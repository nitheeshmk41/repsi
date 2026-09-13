import enum
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Float, DateTime, Date, Enum, ForeignKey, Text
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class PaymentMethod(str, enum.Enum):
    UPI = "upi"
    CARD = "card"
    CASH = "cash"
    NETBANKING = "netbanking"
    CHEQUE = "cheque"


class PaymentStatus(str, enum.Enum):
    SUCCESS = "success"
    PENDING = "pending"
    FAILED = "failed"
    REFUNDED = "refunded"


class Payment(Base, TimestampMixin, TenantMixin):
    __tablename__ = "payments"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    member_id = Column(String(64), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    membership_id = Column(String(64), ForeignKey("memberships.id", ondelete="SET NULL"), nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    method = Column(Enum(PaymentMethod), default=PaymentMethod.UPI, nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.SUCCESS, nullable=False, index=True)
    transaction_ref = Column(String(100), nullable=True)
    invoice_id = Column(String(64), nullable=True)
    paid_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)


class Invoice(Base, TimestampMixin, TenantMixin):
    __tablename__ = "invoices"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    invoice_number = Column(String(50), nullable=False, index=True)
    member_id = Column(String(64), ForeignKey("members.id", ondelete="CASCADE"), nullable=False)
    subtotal = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0, nullable=False)  # GST
    total_amount = Column(Float, nullable=False)
    status = Column(String(20), default="paid", nullable=False)  # paid, pending, void
    due_date = Column(Date, default=date.today, nullable=False)
    notes = Column(Text, nullable=True)


class Expense(Base, TimestampMixin, TenantMixin):
    __tablename__ = "expenses"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    category = Column(String(100), nullable=False)  # Rent, Equipment, Electricity, Salaries, Maintenance
    title = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    expense_date = Column(Date, default=date.today, nullable=False, index=True)
    vendor = Column(String(150), nullable=True)
    payment_method = Column(String(50), default="bank_transfer")
    notes = Column(Text, nullable=True)
