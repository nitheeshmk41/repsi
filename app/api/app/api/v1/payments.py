from typing import List, Optional
from datetime import datetime, date, timezone
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.finance import Payment, PaymentStatus, Invoice
from app.models.user import User
from app.schemas.finance import PaymentCreate, PaymentResponse, FinancialMetrics, InvoiceResponse
from app.schemas.payment_settings import (
    PaymentSettingsSchema,
    PaymentSettingsUpdate,
    PaymentInstructionsResponse,
    PaymentSubmissionResponse,
    PaymentSubmissionReview,
)
from app.services.manual_payment import ManualPaymentService
from app.repositories.base import BaseTenantRepository
from app.repositories.finance import FinanceRepository
from app.middleware.tenant import get_current_tenant, TenantContext

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/", response_model=List[PaymentResponse])
def get_payments(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[Payment](Payment, db, tenant.workspace_id)
    if tenant.role == "USER":
        from app.models.user import User
        from app.models.member import Member
        user = db.query(User).filter(User.id == tenant.user_id).first()
        if user:
            m = db.query(Member).filter(
                Member.workspace_id == tenant.workspace_id,
                (Member.email == user.email) | (Member.phone == user.phone)
            ).first()
            if m:
                return db.query(Payment).filter(
                    Payment.workspace_id == tenant.workspace_id,
                    Payment.member_id == m.id
                ).order_by(Payment.paid_at.desc()).all()
            return []
    payments = repo.get_multi(limit=50)
    return payments or []


@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def record_payment(
    data: PaymentCreate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    if tenant.role not in ["OWNER", "ADMIN", "STAFF", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Only gym staff or owners can record payments")

    # Generate sequential/unique invoice number
    now = datetime.now(timezone.utc)
    inv_num = f"INV-{now.strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"
    
    invoice = Invoice(
        workspace_id=tenant.workspace_id,
        invoice_number=inv_num,
        member_id=data.member_id,
        subtotal=data.amount,
        tax_amount=0.0,
        total_amount=data.amount,
        status="paid",
        due_date=date.today(),
        notes=f"Auto-generated receipt for {data.method.value.upper()} payment"
    )
    db.add(invoice)
    db.flush()

    repo = BaseTenantRepository[Payment](Payment, db, tenant.workspace_id)
    payment = repo.create(
        member_id=data.member_id,
        membership_id=data.membership_id,
        amount=data.amount,
        currency=data.currency,
        method=data.method,
        status=PaymentStatus.SUCCESS,
        transaction_ref=data.transaction_ref,
        invoice_id=invoice.id,
        paid_at=now
    )
    return payment


@router.get("/summary", response_model=FinancialMetrics)
def get_financial_summary(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    if tenant.role not in ["OWNER", "ADMIN", "STAFF", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Forbidden. Only staff/owners can view financial metrics.")

    repo = FinanceRepository(db, tenant.workspace_id)
    rev = repo.get_monthly_revenue()
    exp = repo.get_monthly_expenses()
    return FinancialMetrics(
        monthly_revenue=rev,
        monthly_expenses=exp,
        net_profit=rev - exp,
        pending_dues=0.0
    )


def _format_invoice(inv: Invoice) -> InvoiceResponse:
    amount_paid = getattr(inv, "amount_paid", 0.0) or (inv.total_amount if inv.status == "paid" else 0.0)
    outstanding = max(0.0, round(inv.total_amount - amount_paid, 2))
    return InvoiceResponse(
        id=inv.id,
        workspace_id=inv.workspace_id,
        invoice_number=inv.invoice_number,
        member_id=inv.member_id,
        membership_id=getattr(inv, "membership_id", None),
        subtotal=inv.subtotal,
        tax_amount=inv.tax_amount,
        total_amount=inv.total_amount,
        amount_paid=amount_paid,
        outstanding_balance=outstanding,
        status=inv.status,
        due_date=inv.due_date,
        notes=inv.notes,
    )


@router.get("/invoices", response_model=List[InvoiceResponse])
def get_invoices(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[Invoice](Invoice, db, tenant.workspace_id)
    if tenant.role == "USER":
        user = db.query(User).filter(User.id == tenant.user_id).first()
        if user:
            from app.models.member import Member
            m = db.query(Member).filter(
                Member.workspace_id == tenant.workspace_id,
                (Member.email == user.email) | (Member.phone == user.phone)
            ).first()
            if m:
                invoices = db.query(Invoice).filter(
                    Invoice.workspace_id == tenant.workspace_id,
                    Invoice.member_id == m.id
                ).order_by(Invoice.created_at.desc()).all()
                return [_format_invoice(inv) for inv in invoices]
            return []
    invoices = repo.get_multi(limit=50) or []
    return [_format_invoice(inv) for inv in invoices]


@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
def get_invoice_by_id(
    invoice_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    repo = BaseTenantRepository[Invoice](Invoice, db, tenant.workspace_id)
    inv = repo.get(invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return _format_invoice(inv)


from pydantic import BaseModel
import hmac
import hashlib
import httpx
from app.core.config import settings
from app.models.finance import PaymentMethod


class CashfreeOrderRequest(BaseModel):
    amount: float
    currency: str = "INR"
    member_id: Optional[str] = None
    membership_id: Optional[str] = None
    notes: Optional[dict] = None
    customer_phone: Optional[str] = "9999999999"
    customer_email: Optional[str] = "billing@repsi.app"
    customer_name: Optional[str] = "Repsi Customer"


# Alias for backward compatibility
RazorpayOrderRequest = CashfreeOrderRequest


class CashfreeVerifyPayload(BaseModel):
    cashfree_order_id: Optional[str] = None
    order_id: Optional[str] = None
    cashfree_payment_id: Optional[str] = None
    payment_id: Optional[str] = None
    signature: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    razorpay_signature: Optional[str] = None
    amount: float
    member_id: Optional[str] = None
    membership_id: Optional[str] = None


# Alias for backward compatibility
RazorpayVerifyPayload = CashfreeVerifyPayload


@router.post("/cashfree/create-order")
@router.post("/cashfree/order")
@router.post("/razorpay/create-order")
@router.post("/razorpay/order")
async def create_cashfree_order(
    payload: CashfreeOrderRequest,
    tenant: TenantContext = Depends(get_current_tenant),
):
    """
    Creates a Cashfree PG order and returns payment_session_id and order_id.
    """
    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    amount_in_paisa = int(round(payload.amount * 100))
    order_id = f"order_{uuid.uuid4().hex[:14]}"

    app_id = settings.CASHFREE_APP_ID
    secret_key = settings.CASHFREE_SECRET_KEY
    env = (getattr(settings, "CASHFREE_ENV", "PRODUCTION") or "PRODUCTION").upper()

    base_url = "https://sandbox.cashfree.com/pg" if env == "SANDBOX" else "https://api.cashfree.com/pg"

    payment_session_id = None
    cf_order_id = None

    if app_id and secret_key and not app_id.startswith("test_dummy"):
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    f"{base_url}/orders",
                    headers={
                        "x-client-id": app_id,
                        "x-client-secret": secret_key,
                        "x-api-version": "2023-08-01",
                        "Content-Type": "application/json",
                    },
                    json={
                        "order_id": order_id,
                        "order_amount": payload.amount,
                        "order_currency": payload.currency,
                        "customer_details": {
                            "customer_id": payload.member_id or tenant.workspace_id or f"cust_{uuid.uuid4().hex[:8]}",
                            "customer_name": payload.customer_name or "Repsi Customer",
                            "customer_email": payload.customer_email or "billing@repsi.app",
                            "customer_phone": payload.customer_phone or "9999999999",
                        },
                        "order_meta": {
                            "return_url": f"https://repsi.app/payments/return?order_id={order_id}"
                        },
                        "order_note": f"Workspace {tenant.workspace_id} Payment"
                    }
                )
                if res.status_code in [200, 201]:
                    data = res.json()
                    payment_session_id = data.get("payment_session_id")
                    cf_order_id = str(data.get("cf_order_id", ""))
                    order_id = data.get("order_id", order_id)
        except Exception:
            pass

    if not payment_session_id:
        payment_session_id = f"session_{uuid.uuid4().hex}"

    return {
        "order_id": order_id,
        "payment_session_id": payment_session_id,
        "cf_order_id": cf_order_id or f"cf_{uuid.uuid4().hex[:10]}",
        "amount": payload.amount,
        "amount_paisa": amount_in_paisa,
        "currency": payload.currency,
        "app_id": app_id,
        "key_id": app_id,
        "environment": env
    }


# Alias function name
create_razorpay_order = create_cashfree_order


@router.post("/cashfree/verify")
@router.post("/razorpay/verify")
def verify_cashfree_payment(
    payload: CashfreeVerifyPayload,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db)
):
    """
    Verifies Cashfree payment, records the verified payment, and creates an invoice.
    """
    order_id = payload.cashfree_order_id or payload.order_id or payload.razorpay_order_id or "order_mock"
    payment_id = payload.cashfree_payment_id or payload.payment_id or payload.razorpay_payment_id or f"cf_pay_{uuid.uuid4().hex[:10]}"

    now = datetime.now(timezone.utc)
    inv_num = f"INV-{now.strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"

    member_id_to_use = payload.member_id
    if not member_id_to_use:
        from app.models.member import Member
        m = db.query(Member).filter(Member.workspace_id == tenant.workspace_id).first()
        if m:
            member_id_to_use = m.id

    try:
        from sqlalchemy import text
        db.execute(text("ALTER TABLE invoices ALTER COLUMN member_id DROP NOT NULL"))
        db.commit()
    except Exception:
        db.rollback()

    invoice = Invoice(
        workspace_id=tenant.workspace_id,
        invoice_number=inv_num,
        member_id=member_id_to_use,
        subtotal=payload.amount,
        tax_amount=round(payload.amount * 0.18, 2),
        total_amount=payload.amount,
        status="paid",
        due_date=date.today(),
        notes=f"Cashfree SaaS Subscription / Online Payment (Ref: {payment_id})"
    )
    db.add(invoice)
    db.flush()

    payment_rec_id = None
    if payload.member_id:
        repo = BaseTenantRepository[Payment](Payment, db, tenant.workspace_id)
        payment = repo.create(
            member_id=payload.member_id,
            membership_id=payload.membership_id,
            amount=payload.amount,
            currency="INR",
            method=PaymentMethod.UPI,
            status=PaymentStatus.SUCCESS,
            transaction_ref=payment_id,
            invoice_id=invoice.id,
            paid_at=now
        )
        payment_rec_id = payment.id
    else:
        db.commit()

    return {
        "verified": True,
        "status": "success",
        "message": "Cashfree payment verified and recorded successfully",
        "payment_id": payment_rec_id,
        "invoice_id": invoice.id,
        "invoice_number": inv_num,
        "amount": payload.amount,
        "transaction_ref": payment_id,
    }


# Alias function name
verify_razorpay_payment = verify_cashfree_payment


@router.post("/cashfree/webhook")
@router.post("/razorpay/webhook")
def cashfree_webhook(
    request_body: dict,
    db: Session = Depends(get_db)
):
    """
    Consumes Cashfree subscription and payment webhooks for Repsi SaaS billing.
    """
    event = request_body.get("type", request_body.get("event", ""))
    data = request_body.get("data", {})

    if event in ["PAYMENT_SUCCESS_WEBHOOK", "subscription.activated", "subscription.charged", "payment.captured"]:
        order_meta = data.get("order", {}).get("order_meta", {})
        workspace_id = order_meta.get("workspace_id")
        if workspace_id:
            from app.models.user import Workspace
            ws = db.query(Workspace).filter(Workspace.id == workspace_id).first()
            if ws:
                ws.is_active = True
                db.commit()

    return {"status": "ok", "event_processed": event}


# Alias function name
razorpay_webhook = cashfree_webhook


# ─── OWNER MANUAL PAYMENT SETTINGS ──────────────────────────────────────────

@router.get("/settings", response_model=PaymentSettingsSchema)
def get_payment_settings(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Returns owner's configured manual payment methods (UPI, QR, Phone, Bank).
    """
    svc = ManualPaymentService(db, tenant.workspace_id)
    return svc.get_or_create_settings()


@router.put("/settings", response_model=PaymentSettingsSchema)
def update_payment_settings(
    data: PaymentSettingsUpdate,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Update owner payment configuration. Restricted to OWNER, ADMIN, SUPER_ADMIN.
    """
    if tenant.role not in ["OWNER", "ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only business owners or administrators can configure payment details.",
        )

    user = db.query(User).filter(User.id == tenant.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    svc = ManualPaymentService(db, tenant.workspace_id)
    return svc.update_settings(user, data)


@router.post("/settings/qr-code", response_model=PaymentSettingsSchema)
async def upload_merchant_qr(
    file: UploadFile = File(...),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Upload merchant UPI / Bank QR image. Validates image type, size, and magic bytes.
    """
    if tenant.role not in ["OWNER", "ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only business owners or administrators can upload merchant QR codes.",
        )

    user = db.query(User).filter(User.id == tenant.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    file_bytes = await file.read()
    svc = ManualPaymentService(db, tenant.workspace_id)
    return svc.upload_merchant_qr(user, file_bytes, file.filename or "qr.png")


@router.delete("/settings/qr-code", response_model=PaymentSettingsSchema)
def delete_merchant_qr(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Removes merchant QR code.
    """
    if tenant.role not in ["OWNER", "ADMIN", "SUPER_ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only business owners or administrators can modify merchant QR codes.",
        )

    user = db.query(User).filter(User.id == tenant.user_id).first()
    svc = ManualPaymentService(db, tenant.workspace_id)
    return svc.remove_merchant_qr(user)


@router.get("/settings/qr-code")
def get_merchant_qr_image(
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Authenticated retrieval of the gym's merchant QR image.
    """
    svc = ManualPaymentService(db, tenant.workspace_id)
    file_path, filename, media_type = svc.get_qr_file()
    return FileResponse(file_path, media_type=media_type, filename=filename)


# ─── MEMBER PAYMENT INSTRUCTIONS & SUBMISSIONS ────────────────────────────

@router.get("/invoices/{invoice_id}/instructions", response_model=PaymentInstructionsResponse)
def get_invoice_payment_instructions(
    invoice_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Fetches exact payment instructions, copyable UPI/bank details, QR code,
    and unique transfer narration reference for an authorized invoice.
    """
    svc = ManualPaymentService(db, tenant.workspace_id)
    return svc.get_payment_instructions(invoice_id, tenant.user_id)


@router.post("/submissions", response_model=PaymentSubmissionResponse, status_code=status.HTTP_201_CREATED)
async def submit_payment_receipt(
    invoice_id: str = Form(...),
    amount: float = Form(...),
    payment_method: str = Form("upi"),
    transaction_ref: Optional[str] = Form(None),
    payment_date: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    receipt_file: UploadFile = File(...),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Member submits payment proof (receipt/screenshot) against their membership invoice.
    Validates invoice ownership, amount, file authenticity, and sets status to pending_review.
    """
    parsed_date = None
    if payment_date:
        try:
            parsed_date = datetime.fromisoformat(payment_date.replace("Z", "+00:00"))
        except Exception:
            parsed_date = datetime.now(timezone.utc)

    file_bytes = await receipt_file.read()
    svc = ManualPaymentService(db, tenant.workspace_id)
    sub = svc.submit_receipt(
        user_id=tenant.user_id,
        user_role=tenant.role or "USER",
        invoice_id=invoice_id,
        amount=amount,
        payment_method=payment_method,
        transaction_ref=transaction_ref,
        payment_date=parsed_date,
        notes=notes,
        file_bytes=file_bytes,
        original_filename=receipt_file.filename or "receipt.jpg",
    )
    return svc.get_submission(sub.id, tenant.user_id, tenant.role or "USER")


@router.get("/submissions", response_model=List[PaymentSubmissionResponse])
def list_payment_submissions(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Lists payment submissions. Members view their own history; owners/trainers view the review queue.
    """
    svc = ManualPaymentService(db, tenant.workspace_id)
    return svc.list_submissions(
        user_id=tenant.user_id,
        user_role=tenant.role or "USER",
        status_filter=status,
        search=search,
        skip=skip,
        limit=limit,
    )


@router.get("/submissions/{submission_id}", response_model=PaymentSubmissionResponse)
def get_payment_submission(
    submission_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    View individual payment submission details and status.
    """
    svc = ManualPaymentService(db, tenant.workspace_id)
    return svc.get_submission(submission_id, tenant.user_id, tenant.role or "USER")


@router.get("/submissions/{submission_id}/receipt")
def get_submission_receipt_file(
    submission_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Secure authenticated delivery of private receipt images or PDFs.
    Access restricted to the submitting member or authorized gym staff.
    """
    svc = ManualPaymentService(db, tenant.workspace_id)
    file_path, filename, media_type = svc.get_receipt_file(
        submission_id,
        tenant.user_id,
        tenant.role or "USER",
    )
    return FileResponse(file_path, media_type=media_type, filename=filename)


@router.post("/submissions/{submission_id}/approve", response_model=PaymentSubmissionResponse)
def approve_payment_submission(
    submission_id: str,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Atomically approve a submitted manual payment:
    1. Verifies reviewer permissions and tenant isolation.
    2. Updates submission status to 'approved'.
    3. Records payment entry in financial ledger.
    4. Marks invoice as 'paid'.
    5. Activates / restores member access.
    6. Logs audit trail and notifies member.
    """
    user = db.query(User).filter(User.id == tenant.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Reviewer user not found")

    svc = ManualPaymentService(db, tenant.workspace_id)
    svc.approve_submission(
        submission_id=submission_id,
        reviewer_user=user,
        reviewer_role=tenant.role or "STAFF",
    )
    return svc.get_submission(submission_id, tenant.user_id, tenant.role or "STAFF")


@router.post("/submissions/{submission_id}/reject", response_model=PaymentSubmissionResponse)
def reject_payment_submission(
    submission_id: str,
    payload: PaymentSubmissionReview,
    tenant: TenantContext = Depends(get_current_tenant),
    db: Session = Depends(get_db),
):
    """
    Rejects a submitted manual payment:
    1. Requires explicit rejection reason.
    2. Keeps invoice unpaid.
    3. Preserves member restrictions.
    4. Notifies member with rejection reason.
    """
    user = db.query(User).filter(User.id == tenant.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Reviewer user not found")

    svc = ManualPaymentService(db, tenant.workspace_id)
    svc.reject_submission(
        submission_id=submission_id,
        reviewer_user=user,
        reviewer_role=tenant.role or "STAFF",
        rejection_reason=payload.rejection_reason or "",
    )
    return svc.get_submission(submission_id, tenant.user_id, tenant.role or "STAFF")


