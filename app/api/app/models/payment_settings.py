import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, Index
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class SubmissionStatus(str, enum.Enum):
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class BusinessPaymentSettings(Base, TimestampMixin, TenantMixin):
    """
    Gym owner's configured manual payment methods (UPI, QR, Phone, Bank Details).
    Tenant-isolated and scoped to workspace_id.
    """
    __tablename__ = "business_payment_settings"

    id = Column(String(64), primary_key=True, default=generate_uuid)

    # UPI Configuration
    upi_enabled = Column(Boolean, default=True, nullable=False)
    upi_id = Column(String(100), nullable=True)  # e.g. merchant@okhdfcbank
    upi_name = Column(String(150), nullable=True)  # Business or account holder name
    upi_instructions = Column(Text, nullable=True)

    # Uploaded Merchant QR Code (Google Pay, PhonePe, Paytm, Bank QR)
    qr_enabled = Column(Boolean, default=False, nullable=False)
    qr_image_url = Column(String(512), nullable=True)  # Private storage key
    qr_filename = Column(String(255), nullable=True)

    # Business Payment Phone Number
    phone_enabled = Column(Boolean, default=False, nullable=False)
    phone_number = Column(String(50), nullable=True)
    phone_name = Column(String(150), nullable=True)

    # Direct Bank Transfer Details
    bank_enabled = Column(Boolean, default=False, nullable=False)
    bank_account_name = Column(String(150), nullable=True)
    bank_name = Column(String(150), nullable=True)
    bank_account_number = Column(String(100), nullable=True)
    bank_ifsc = Column(String(20), nullable=True)
    bank_branch = Column(String(150), nullable=True)
    bank_instructions = Column(Text, nullable=True)

    # General instructions
    general_notes = Column(Text, nullable=True)

    __table_args__ = (
        Index("ix_bus_payment_settings_ws", "workspace_id", unique=True),
    )


class ManualPaymentSubmission(Base, TimestampMixin, TenantMixin):
    """
    Member-submitted manual payment proof against an outstanding membership invoice.
    Tracks review lifecycle, verification audit, and receipt storage.
    """
    __tablename__ = "manual_payment_submissions"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    member_id = Column(String(64), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    invoice_id = Column(String(64), ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False, index=True)
    membership_id = Column(String(64), ForeignKey("memberships.id", ondelete="SET NULL"), nullable=True)

    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    payment_method = Column(String(50), default="upi", nullable=False)  # upi, qr, phone, bank_transfer
    transaction_ref = Column(String(100), nullable=True, index=True)  # UTR, Bank Ref, or UPI Txn ID
    reference_code = Column(String(60), nullable=True, index=True)  # Pre-generated transfer narration tag

    payment_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Secure Private File Storage
    receipt_storage_key = Column(String(512), nullable=False)  # Private storage identifier
    receipt_filename = Column(String(255), nullable=True)
    receipt_content_type = Column(String(100), nullable=True)
    receipt_file_size = Column(Integer, nullable=True)

    # Lifecycle State
    status = Column(String(30), default=SubmissionStatus.PENDING_REVIEW.value, nullable=False, index=True)
    notes = Column(Text, nullable=True)

    # Reviewer Information
    reviewer_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewer_name = Column(String(150), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)

    # Linked Payment Ledger entry (created upon approval)
    payment_id = Column(String(64), ForeignKey("payments.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    member = relationship("Member", lazy="joined")
    invoice = relationship("Invoice", lazy="joined")

    __table_args__ = (
        Index("ix_payment_sub_ws_status", "workspace_id", "status"),
        Index("ix_payment_sub_mem_status", "member_id", "status"),
    )
