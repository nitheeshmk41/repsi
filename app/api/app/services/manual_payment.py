import os
import uuid
from datetime import datetime, date, timedelta, timezone
from typing import Optional, List, Dict, Any, Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app.models.payment_settings import (
    BusinessPaymentSettings,
    ManualPaymentSubmission,
    SubmissionStatus,
)
from app.models.finance import Payment, PaymentStatus, Invoice, PaymentMethod
from app.models.member import Member, Membership, MembershipPlan, MemberStatus
from app.models.user import User, Workspace, WorkspaceMember, UserRole
from app.models.system import AuditLog, Notification
from app.schemas.payment_settings import (
    PaymentSettingsUpdate,
    PaymentInstructionsResponse,
    PaymentSubmissionResponse,
)

# Base directory for private uploads
UPLOADS_BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "private_storage"))


def _ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


def _detect_mime_type(data: bytes) -> Optional[str]:
    """
    Verifies file magic bytes to prevent forged file extensions or executable uploads.
    """
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    elif data.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    elif len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    elif data.startswith(b"%PDF-"):
        return "application/pdf"
    return None


class ManualPaymentService:
    def __init__(self, db: Session, workspace_id: str):
        self.db = db
        self.workspace_id = workspace_id
        self.qr_storage_dir = os.path.join(UPLOADS_BASE_DIR, "payment_qrs", workspace_id)
        self.receipt_storage_dir = os.path.join(UPLOADS_BASE_DIR, "receipts", workspace_id)
        _ensure_dir(self.qr_storage_dir)
        _ensure_dir(self.receipt_storage_dir)

    # ─── OWNER PAYMENT SETTINGS ──────────────────────────────────────────

    def get_or_create_settings(self) -> BusinessPaymentSettings:
        settings = (
            self.db.query(BusinessPaymentSettings)
            .filter(BusinessPaymentSettings.workspace_id == self.workspace_id)
            .first()
        )
        if not settings:
            ws = self.db.query(Workspace).filter(Workspace.id == self.workspace_id).first()
            ws_name = ws.name if ws else "Fitness Center"
            settings = BusinessPaymentSettings(
                workspace_id=self.workspace_id,
                upi_enabled=True,
                upi_id=f"repsi.{self.workspace_id[:8]}@okaxis",
                upi_name=ws_name,
                upi_instructions="Scan QR or pay via any UPI app (GPay, PhonePe, Paytm). Add reference note.",
                qr_enabled=False,
                phone_enabled=False,
                phone_number=ws.phone if ws else None,
                phone_name=ws_name,
                bank_enabled=False,
                bank_account_name=ws_name,
            )
            self.db.add(settings)
            self.db.commit()
            self.db.refresh(settings)
        return settings

    def update_settings(
        self,
        actor_user: User,
        data: PaymentSettingsUpdate,
    ) -> BusinessPaymentSettings:
        settings = self.get_or_create_settings()

        # Capture old state for audit log
        old_data = {
            "upi_enabled": settings.upi_enabled,
            "upi_id": settings.upi_id,
            "qr_enabled": settings.qr_enabled,
            "phone_enabled": settings.phone_enabled,
            "bank_enabled": settings.bank_enabled,
        }

        # Candidate new states
        update_dict = data.model_dump(exclude_unset=True)

        upi_en = update_dict.get("upi_enabled", settings.upi_enabled)
        qr_en = update_dict.get("qr_enabled", settings.qr_enabled)
        phone_en = update_dict.get("phone_enabled", settings.phone_enabled)
        bank_en = update_dict.get("bank_enabled", settings.bank_enabled)

        # Requirement: At least one payment method must remain enabled
        if not (upi_en or qr_en or phone_en or bank_en):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one payment method (UPI, QR, Phone, or Bank Transfer) must remain enabled.",
            )

        # Validate UPI VPA format if provided
        if "upi_id" in update_dict and update_dict["upi_id"]:
            upi_str = update_dict["upi_id"].strip()
            if "@" not in upi_str or len(upi_str) < 5:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid UPI ID / VPA format. Must contain '@' (e.g. business@okhdfcbank).",
                )
            update_dict["upi_id"] = upi_str

        # Apply updates
        for key, val in update_dict.items():
            if hasattr(settings, key):
                setattr(settings, key, val)

        self.db.commit()
        self.db.refresh(settings)

        # Record in AuditLog
        audit = AuditLog(
            workspace_id=self.workspace_id,
            user_id=actor_user.id,
            action="update_payment_settings",
            details=f"Payment settings modified by {actor_user.full_name}: UPI={settings.upi_enabled}, QR={settings.qr_enabled}, Phone={settings.phone_enabled}, Bank={settings.bank_enabled}",
        )
        self.db.add(audit)
        self.db.commit()

        return settings

    def upload_merchant_qr(
        self,
        actor_user: User,
        file_bytes: bytes,
        original_filename: str,
    ) -> BusinessPaymentSettings:
        settings = self.get_or_create_settings()

        # Validate size: max 5 MB
        if len(file_bytes) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="QR image size exceeds 5MB limit.",
            )

        mime = _detect_mime_type(file_bytes)
        if mime not in ["image/png", "image/jpeg", "image/webp"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image format for QR code. Only PNG, JPEG, or WEBP images are supported.",
            )

        ext = mime.split("/")[1]
        storage_filename = f"qr_{uuid.uuid4().hex[:12]}.{ext}"
        storage_path = os.path.join(self.qr_storage_dir, storage_filename)

        with open(storage_path, "wb") as f:
            f.write(file_bytes)

        # Delete previous QR file if existed
        if settings.qr_image_url:
            old_path = os.path.join(self.qr_storage_dir, settings.qr_image_url)
            if os.path.exists(old_path):
                try:
                    os.remove(old_path)
                except Exception:
                    pass

        settings.qr_image_url = storage_filename
        settings.qr_filename = original_filename
        settings.qr_enabled = True

        self.db.commit()
        self.db.refresh(settings)

        audit = AuditLog(
            workspace_id=self.workspace_id,
            user_id=actor_user.id,
            action="upload_merchant_qr",
            details=f"Uploaded custom merchant QR image ({original_filename})",
        )
        self.db.add(audit)
        self.db.commit()

        return settings

    def remove_merchant_qr(self, actor_user: User) -> BusinessPaymentSettings:
        settings = self.get_or_create_settings()
        if settings.qr_image_url:
            old_path = os.path.join(self.qr_storage_dir, settings.qr_image_url)
            if os.path.exists(old_path):
                try:
                    os.remove(old_path)
                except Exception:
                    pass

        settings.qr_image_url = None
        settings.qr_filename = None
        settings.qr_enabled = False

        self.db.commit()
        self.db.refresh(settings)

        audit = AuditLog(
            workspace_id=self.workspace_id,
            user_id=actor_user.id,
            action="remove_merchant_qr",
            details="Removed merchant payment QR image.",
        )
        self.db.add(audit)
        self.db.commit()

        return settings

    # ─── MEMBER PAYMENT INSTRUCTIONS ──────────────────────────────────────

    def get_payment_instructions(
        self,
        invoice_id: str,
        user_id: Optional[str] = None,
    ) -> PaymentInstructionsResponse:
        settings = self.get_or_create_settings()

        invoice = (
            self.db.query(Invoice)
            .filter(Invoice.id == invoice_id, Invoice.workspace_id == self.workspace_id)
            .first()
        )
        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Membership invoice not found in this gym.",
            )

        ws = self.db.query(Workspace).filter(Workspace.id == self.workspace_id).first()
        gym_name = ws.name if ws else "Fitness Gym"

        # Outstanding balance calculation
        amount_paid = getattr(invoice, "amount_paid", 0.0) or (invoice.total_amount if invoice.status == "paid" else 0.0)
        outstanding = max(0.0, round(invoice.total_amount - amount_paid, 2))

        # Identify plan description
        plan_name = "Membership Fee"
        if invoice.member_id:
            m = self.db.query(Member).filter(Member.id == invoice.member_id).first()
            if m and m.memberships:
                active_mem = [mem for mem in m.memberships if mem.status == MemberStatus.ACTIVE]
                if active_mem and active_mem[0].plan:
                    plan_name = active_mem[0].plan.name
                elif m.memberships[0].plan:
                    plan_name = m.memberships[0].plan.name

        # Unique payment reference tag for narration
        ref_code = f"PAY-{invoice.invoice_number[-6:]}-{invoice.id[:4].upper()}"

        # UPI payload generator
        upi_data = None
        if settings.upi_enabled and settings.upi_id:
            upi_uri = (
                f"upi://pay?pa={settings.upi_id}&pn={settings.upi_name or gym_name}"
                f"&am={outstanding:.2f}&tn={ref_code}&cu=INR"
            )
            upi_data = {
                "enabled": True,
                "upi_id": settings.upi_id,
                "upi_name": settings.upi_name or gym_name,
                "instructions": settings.upi_instructions,
                "payment_uri": upi_uri,
            }

        qr_data = None
        if settings.qr_enabled and settings.qr_image_url:
            qr_data = {
                "enabled": True,
                "qr_url": f"/api/v1/payments/settings/qr-code",
                "filename": settings.qr_filename,
            }

        phone_data = None
        if settings.phone_enabled and settings.phone_number:
            phone_data = {
                "enabled": True,
                "phone_number": settings.phone_number,
                "phone_name": settings.phone_name or gym_name,
            }

        bank_data = None
        if settings.bank_enabled and settings.bank_account_number:
            bank_data = {
                "enabled": True,
                "account_name": settings.bank_account_name or gym_name,
                "bank_name": settings.bank_name,
                "account_number": settings.bank_account_number,
                "ifsc": settings.bank_ifsc,
                "branch": settings.bank_branch,
                "instructions": settings.bank_instructions,
            }

        has_active = bool(upi_data or qr_data or phone_data or bank_data)

        instructions_text = (
            f"1. Open your UPI or banking application (Google Pay, PhonePe, Paytm, or Net Banking).\n"
            f"2. Transfer exact fee of ₹{outstanding:,.2f} using any enabled method.\n"
            f"3. In the transfer note/narration, please mention: {ref_code}\n"
            f"4. Take a screenshot or download the receipt PDF after payment.\n"
            f"5. Return here and upload the receipt under 'Submit Payment Receipt'."
        )

        return PaymentInstructionsResponse(
            invoice_id=invoice.id,
            invoice_number=invoice.invoice_number,
            amount_due=invoice.total_amount,
            outstanding_balance=outstanding,
            due_date=invoice.due_date,
            plan_name=plan_name,
            reference_code=ref_code,
            gym_name=gym_name,
            has_active_methods=has_active,
            upi=upi_data,
            qr=qr_data,
            phone=phone_data,
            bank=bank_data,
            instructions_text=instructions_text,
        )

    # ─── RECEIPT UPLOAD & PAYMENT SUBMISSION ──────────────────────────────

    def submit_receipt(
        self,
        user_id: str,
        user_role: str,
        invoice_id: str,
        amount: float,
        payment_method: str,
        transaction_ref: Optional[str],
        payment_date: Optional[datetime],
        notes: Optional[str],
        file_bytes: bytes,
        original_filename: str,
    ) -> ManualPaymentSubmission:
        # Resolve member
        user = self.db.query(User).filter(User.id == user_id).first()
        member = (
            self.db.query(Member)
            .filter(
                Member.workspace_id == self.workspace_id,
                (Member.user_id == user_id) | (Member.email == user.email) | (Member.phone == user.phone),
            )
            .first()
        )
        if not member and user_role == "USER":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No member profile linked to your user account in this gym.",
            )
        elif not member:
            # Staff or admin submitting on behalf
            invoice = self.db.query(Invoice).filter(Invoice.id == invoice_id, Invoice.workspace_id == self.workspace_id).first()
            if invoice and invoice.member_id:
                member = self.db.query(Member).filter(Member.id == invoice.member_id).first()

        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found for this submission.",
            )

        invoice = (
            self.db.query(Invoice)
            .filter(
                Invoice.id == invoice_id,
                Invoice.workspace_id == self.workspace_id,
            )
            .first()
        )
        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invoice not found in this gym.",
            )

        # Cross-member isolation check: member cannot submit against someone else's invoice
        if user_role == "USER" and invoice.member_id != member.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot submit payment proof against an invoice that does not belong to you.",
            )

        # Verify invoice is not already paid or cancelled
        if invoice.status == "paid":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This invoice is already fully paid.",
            )
        if invoice.status in ["void", "cancelled"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This invoice has been voided or cancelled.",
            )

        # Prevent duplicate pending submissions for the same invoice
        existing_pending = (
            self.db.query(ManualPaymentSubmission)
            .filter(
                ManualPaymentSubmission.workspace_id == self.workspace_id,
                ManualPaymentSubmission.invoice_id == invoice.id,
                ManualPaymentSubmission.status == SubmissionStatus.PENDING_REVIEW.value,
            )
            .first()
        )
        if existing_pending:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A payment receipt for this invoice is already submitted and pending review. Please wait for gym verification.",
            )

        # Validate amount
        amount_paid = getattr(invoice, "amount_paid", 0.0) or 0.0
        outstanding = max(0.0, round(invoice.total_amount - amount_paid, 2))
        if amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Submitted payment amount must be greater than zero.",
            )

        # Unless partial payments are configured, require matching amount
        if abs(amount - outstanding) > 0.01:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Submitted amount (₹{amount:,.2f}) must match outstanding invoice balance (₹{outstanding:,.2f}).",
            )

        # File validation
        if len(file_bytes) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Receipt file exceeds maximum allowed size of 10MB.",
            )

        mime = _detect_mime_type(file_bytes)
        if not mime:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file format. Please upload a valid PNG, JPEG, WEBP image or PDF receipt.",
            )

        ext = "pdf" if mime == "application/pdf" else mime.split("/")[1]
        storage_id = f"rcpt_{uuid.uuid4().hex}"
        storage_filename = f"{storage_id}.{ext}"
        storage_path = os.path.join(self.receipt_storage_dir, storage_filename)

        with open(storage_path, "wb") as f:
            f.write(file_bytes)

        ref_code = f"PAY-{invoice.invoice_number[-6:]}-{member.id[:4].upper()}"

        submission = ManualPaymentSubmission(
            workspace_id=self.workspace_id,
            member_id=member.id,
            invoice_id=invoice.id,
            membership_id=invoice.membership_id,
            amount=amount,
            currency="INR",
            payment_method=payment_method,
            transaction_ref=transaction_ref.strip() if transaction_ref else None,
            reference_code=ref_code,
            payment_date=payment_date or datetime.now(timezone.utc),
            receipt_storage_key=storage_filename,
            receipt_filename=original_filename,
            receipt_content_type=mime,
            receipt_file_size=len(file_bytes),
            status=SubmissionStatus.PENDING_REVIEW.value,
            notes=notes.strip() if notes else None,
        )
        self.db.add(submission)
        self.db.commit()
        self.db.refresh(submission)

        # In-app notification for owner/staff
        owner_member = (
            self.db.query(WorkspaceMember)
            .filter(
                WorkspaceMember.workspace_id == self.workspace_id,
                WorkspaceMember.role.in_([UserRole.OWNER, UserRole.ADMIN]),
            )
            .first()
        )
        if owner_member:
            notification = Notification(
                workspace_id=self.workspace_id,
                user_id=owner_member.user_id,
                title="New Payment Receipt Submitted",
                message=f"{member.first_name} {member.last_name or ''} submitted ₹{amount:,.2f} receipt for #{invoice.invoice_number}. Verification required.",
                action_url="/payments",
            )
            self.db.add(notification)
            self.db.commit()

        return submission

    # ─── REVIEW QUEUE & LISTING ───────────────────────────────────────────

    def list_submissions(
        self,
        user_id: str,
        user_role: str,
        status_filter: Optional[str] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> List[PaymentSubmissionResponse]:
        query = self.db.query(ManualPaymentSubmission).filter(
            ManualPaymentSubmission.workspace_id == self.workspace_id
        )

        if user_role == "USER":
            user = self.db.query(User).filter(User.id == user_id).first()
            if user:
                member = (
                    self.db.query(Member)
                    .filter(
                        Member.workspace_id == self.workspace_id,
                        (Member.user_id == user_id) | (Member.email == user.email) | (Member.phone == user.phone),
                    )
                    .first()
                )
                if member:
                    query = query.filter(ManualPaymentSubmission.member_id == member.id)
                else:
                    return []
        else:
            # Filter for owners/staff
            if status_filter and status_filter.lower() != "all":
                query = query.filter(ManualPaymentSubmission.status == status_filter.lower())

            if search and search.strip():
                s = f"%{search.strip()}%"
                query = query.join(Member, ManualPaymentSubmission.member_id == Member.id).join(
                    Invoice, ManualPaymentSubmission.invoice_id == Invoice.id
                ).filter(
                    or_(
                        Member.first_name.ilike(s),
                        Member.last_name.ilike(s),
                        Member.phone.ilike(s),
                        Invoice.invoice_number.ilike(s),
                        ManualPaymentSubmission.transaction_ref.ilike(s),
                        ManualPaymentSubmission.reference_code.ilike(s),
                    )
                )

        records = query.order_by(ManualPaymentSubmission.created_at.desc()).offset(skip).limit(limit).all()

        responses = []
        for r in records:
            member_name = f"{r.member.first_name} {r.member.last_name or ''}".strip() if r.member else "Member"
            inv_num = r.invoice.invoice_number if r.invoice else "INV"
            inv_total = r.invoice.total_amount if r.invoice else r.amount
            plan_name = r.member.plan_name if r.member else "Membership"

            responses.append(
                PaymentSubmissionResponse(
                    id=r.id,
                    workspace_id=r.workspace_id,
                    member_id=r.member_id,
                    member_name=member_name,
                    member_phone=r.member.phone if r.member else None,
                    member_email=r.member.email if r.member else None,
                    invoice_id=r.invoice_id,
                    invoice_number=inv_num,
                    invoice_total=inv_total,
                    membership_plan_name=plan_name,
                    amount=r.amount,
                    currency=r.currency,
                    payment_method=r.payment_method,
                    transaction_ref=r.transaction_ref,
                    reference_code=r.reference_code,
                    payment_date=r.payment_date,
                    receipt_url=f"/api/v1/payments/submissions/{r.id}/receipt",
                    receipt_filename=r.receipt_filename,
                    receipt_content_type=r.receipt_content_type,
                    receipt_file_size=r.receipt_file_size,
                    status=r.status,
                    notes=r.notes,
                    reviewer_id=r.reviewer_id,
                    reviewer_name=r.reviewer_name,
                    reviewed_at=r.reviewed_at,
                    rejection_reason=r.rejection_reason,
                    payment_id=r.payment_id,
                    created_at=r.created_at,
                )
            )

        return responses

    def get_submission(
        self,
        submission_id: str,
        user_id: str,
        user_role: str,
    ) -> PaymentSubmissionResponse:
        sub = (
            self.db.query(ManualPaymentSubmission)
            .filter(
                ManualPaymentSubmission.id == submission_id,
                ManualPaymentSubmission.workspace_id == self.workspace_id,
            )
            .first()
        )
        if not sub:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment submission record not found.",
            )

        # Cross-member isolation check
        if user_role == "USER":
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user or not sub.member or (sub.member.user_id != user.id and sub.member.email != user.email and sub.member.phone != user.phone):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied to this payment submission.",
                )

        member_name = f"{sub.member.first_name} {sub.member.last_name or ''}".strip() if sub.member else "Member"
        return PaymentSubmissionResponse(
            id=sub.id,
            workspace_id=sub.workspace_id,
            member_id=sub.member_id,
            member_name=member_name,
            member_phone=sub.member.phone if sub.member else None,
            member_email=sub.member.email if sub.member else None,
            invoice_id=sub.invoice_id,
            invoice_number=sub.invoice.invoice_number if sub.invoice else None,
            invoice_total=sub.invoice.total_amount if sub.invoice else sub.amount,
            membership_plan_name=sub.member.plan_name if sub.member else None,
            amount=sub.amount,
            currency=sub.currency,
            payment_method=sub.payment_method,
            transaction_ref=sub.transaction_ref,
            reference_code=sub.reference_code,
            payment_date=sub.payment_date,
            receipt_url=f"/api/v1/payments/submissions/{sub.id}/receipt",
            receipt_filename=sub.receipt_filename,
            receipt_content_type=sub.receipt_content_type,
            receipt_file_size=sub.receipt_file_size,
            status=sub.status,
            notes=sub.notes,
            reviewer_id=sub.reviewer_id,
            reviewer_name=sub.reviewer_name,
            reviewed_at=sub.reviewed_at,
            rejection_reason=sub.rejection_reason,
            payment_id=sub.payment_id,
            created_at=sub.created_at,
        )

    # ─── APPROVE PAYMENT WORKFLOW (ATOMIC TRANSACTION) ───────────────────

    def approve_submission(
        self,
        submission_id: str,
        reviewer_user: User,
        reviewer_role: str,
    ) -> ManualPaymentSubmission:
        """
        Atomically approves a manual payment submission:
        1. Validates reviewer permissions and tenant isolation.
        2. Acquires row lock and verifies pending status idempotently.
        3. Updates submission status to 'approved'.
        4. Creates a verified financial ledger entry (Payment).
        5. Updates invoice status to 'paid' and updates balance.
        6. Restores/activates member access.
        7. Creates immutable audit log and notification.
        """
        # Reviewer permission check
        if reviewer_role not in ["OWNER", "ADMIN", "SUPER_ADMIN", "STAFF", "TRAINER"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to review or approve member payments.",
            )

        # For trainers, verify explicit payment review permission if configured
        if reviewer_role == "TRAINER":
            member_check = (
                self.db.query(WorkspaceMember)
                .filter(
                    WorkspaceMember.workspace_id == self.workspace_id,
                    WorkspaceMember.user_id == reviewer_user.id,
                )
                .first()
            )
            # Allow trainer if permissions grant it or role allows
            if member_check and member_check.permissions:
                perms = str(member_check.permissions).lower()
                if "manage_payments" not in perms and "payment_review" not in perms and "all" not in perms:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Trainer account does not have permission to approve financial payments.",
                    )

        # Query and lock submission
        sub = (
            self.db.query(ManualPaymentSubmission)
            .filter(
                ManualPaymentSubmission.id == submission_id,
                ManualPaymentSubmission.workspace_id == self.workspace_id,
            )
            .with_for_update()
            .first()
        )
        if not sub:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment submission record not found.",
            )

        # Idempotency check: prevent duplicate approvals
        if sub.status == SubmissionStatus.APPROVED.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This payment submission has already been approved.",
            )
        if sub.status == SubmissionStatus.REJECTED.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This submission was rejected. The member must submit a new receipt.",
            )

        invoice = (
            self.db.query(Invoice)
            .filter(
                Invoice.id == sub.invoice_id,
                Invoice.workspace_id == self.workspace_id,
            )
            .with_for_update()
            .first()
        )
        if not invoice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Associated invoice was not found.",
            )

        now = datetime.now(timezone.utc)

        # Map payment method enum
        method_enum = PaymentMethod.UPI
        if sub.payment_method.lower() in ["bank_transfer", "bank", "netbanking"]:
            method_enum = PaymentMethod.NETBANKING
        elif sub.payment_method.lower() in ["cash"]:
            method_enum = PaymentMethod.CASH
        elif sub.payment_method.lower() in ["card"]:
            method_enum = PaymentMethod.CARD

        # 1. Create verified payment ledger entry
        payment = Payment(
            workspace_id=self.workspace_id,
            member_id=sub.member_id,
            membership_id=sub.membership_id or invoice.membership_id,
            amount=sub.amount,
            currency=sub.currency,
            method=method_enum,
            status=PaymentStatus.SUCCESS,
            transaction_ref=sub.transaction_ref or sub.reference_code or f"VERIFIED-{sub.id[:8]}",
            invoice_id=invoice.id,
            paid_at=now,
        )
        self.db.add(payment)
        self.db.flush()

        # 2. Update Invoice
        invoice.status = "paid"
        invoice.amount_paid = invoice.total_amount
        invoice.notes = (
            f"{(invoice.notes or '').strip()}\n"
            f"[Manual Verification: Approved by {reviewer_user.full_name} on {now.strftime('%d %b %Y, %I:%M %p UTC')} (Ref: {sub.transaction_ref or sub.reference_code})]"
        ).strip()

        # 3. Update Submission record
        sub.status = SubmissionStatus.APPROVED.value
        sub.reviewer_id = reviewer_user.id
        sub.reviewer_name = reviewer_user.full_name
        sub.reviewed_at = now
        sub.payment_id = payment.id

        # 4. Access Activation & Membership Restoration
        member = (
            self.db.query(Member)
            .filter(Member.id == sub.member_id, Member.workspace_id == self.workspace_id)
            .first()
        )
        if member:
            # Restore member status to ACTIVE if restricted
            if member.status in [MemberStatus.EXPIRED, MemberStatus.SUSPENDED, MemberStatus.FROZEN]:
                member.status = MemberStatus.ACTIVE

            # If membership was expired or pending, update or extend period
            membership = None
            if sub.membership_id or invoice.membership_id:
                mem_id = sub.membership_id or invoice.membership_id
                membership = (
                    self.db.query(Membership)
                    .filter(Membership.id == mem_id, Membership.workspace_id == self.workspace_id)
                    .first()
                )
            if not membership and member.memberships:
                membership = member.memberships[0]

            if membership:
                membership.status = MemberStatus.ACTIVE
                today = date.today()
                # If expired, shift start/end dates
                if membership.end_date < today:
                    duration = (membership.end_date - membership.start_date).days
                    if duration <= 0:
                        duration = 30
                    membership.start_date = today
                    membership.end_date = today + timedelta(days=duration)

        # 5. Record AuditLog
        audit = AuditLog(
            workspace_id=self.workspace_id,
            user_id=reviewer_user.id,
            action="approve_manual_payment",
            details=f"Approved payment of ₹{sub.amount:,.2f} for #{invoice.invoice_number} (Member: {member.first_name if member else 'Unknown'}). Activated gym access.",
        )
        self.db.add(audit)

        # 6. Notify Member
        if member and member.user_id:
            notif = Notification(
                workspace_id=self.workspace_id,
                user_id=member.user_id,
                title="Payment Verified & Approved",
                message=f"Your payment of ₹{sub.amount:,.2f} for #{invoice.invoice_number} has been approved. Your gym access is active!",
                action_url="/member/payments",
            )
            self.db.add(notif)

        self.db.commit()
        self.db.refresh(sub)
        return sub

    # ─── REJECT PAYMENT WORKFLOW ──────────────────────────────────────────

    def reject_submission(
        self,
        submission_id: str,
        reviewer_user: User,
        reviewer_role: str,
        rejection_reason: str,
    ) -> ManualPaymentSubmission:
        """
        Rejects a manual payment submission:
        1. Requires explicit rejection reason.
        2. Keeps invoice unpaid.
        3. Preserves member restrictions.
        4. Notifies member with feedback.
        """
        if reviewer_role not in ["OWNER", "ADMIN", "SUPER_ADMIN", "STAFF", "TRAINER"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to review member payments.",
            )

        clean_reason = rejection_reason.strip() if rejection_reason else ""
        if not clean_reason:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A valid rejection reason must be provided (e.g. 'Receipt screenshot is illegible' or 'Incorrect amount').",
            )

        sub = (
            self.db.query(ManualPaymentSubmission)
            .filter(
                ManualPaymentSubmission.id == submission_id,
                ManualPaymentSubmission.workspace_id == self.workspace_id,
            )
            .with_for_update()
            .first()
        )
        if not sub:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment submission record not found.",
            )

        if sub.status != SubmissionStatus.PENDING_REVIEW.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot reject submission that is already {sub.status}.",
            )

        now = datetime.now(timezone.utc)
        sub.status = SubmissionStatus.REJECTED.value
        sub.rejection_reason = clean_reason
        sub.reviewer_id = reviewer_user.id
        sub.reviewer_name = reviewer_user.full_name
        sub.reviewed_at = now

        # Record AuditLog
        audit = AuditLog(
            workspace_id=self.workspace_id,
            user_id=reviewer_user.id,
            action="reject_manual_payment",
            details=f"Rejected payment submission {sub.id} (Reason: {clean_reason})",
        )
        self.db.add(audit)

        # Notify Member
        if sub.member and sub.member.user_id:
            invoice_num = sub.invoice.invoice_number if sub.invoice else "invoice"
            notif = Notification(
                workspace_id=self.workspace_id,
                user_id=sub.member.user_id,
                title="Payment Receipt Rejected",
                message=f"Your payment proof for #{invoice_num} was rejected: '{clean_reason}'. Please review your transaction and resubmit.",
                action_url="/member/payments",
            )
            self.db.add(notif)

        self.db.commit()
        self.db.refresh(sub)
        return sub

    # ─── SECURE FILE ACCESS ───────────────────────────────────────────────

    def get_receipt_file(
        self,
        submission_id: str,
        user_id: str,
        user_role: str,
    ) -> Tuple[str, str, str]:
        sub = (
            self.db.query(ManualPaymentSubmission)
            .filter(
                ManualPaymentSubmission.id == submission_id,
                ManualPaymentSubmission.workspace_id == self.workspace_id,
            )
            .first()
        )
        if not sub:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment submission not found.",
            )

        # Permission verification: only reviewer or submitting member can view receipt
        if user_role == "USER":
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user or not sub.member or (sub.member.user_id != user.id and sub.member.email != user.email and sub.member.phone != user.phone):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied to this private payment receipt.",
                )

        file_path = os.path.join(self.receipt_storage_dir, sub.receipt_storage_key)
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Receipt file not found on storage server.",
            )

        return file_path, sub.receipt_filename or "receipt", sub.receipt_content_type or "application/octet-stream"

    def get_qr_file(self) -> Tuple[str, str, str]:
        settings = self.get_or_create_settings()
        if not settings.qr_enabled or not settings.qr_image_url:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No merchant payment QR code has been configured for this gym.",
            )

        file_path = os.path.join(self.qr_storage_dir, settings.qr_image_url)
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Merchant QR image file is missing.",
            )

        mime = _detect_mime_type(open(file_path, "rb").read(32)) or "image/png"
        return file_path, settings.qr_filename or "merchant_qr", mime
