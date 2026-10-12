import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Enum as SQLEnum, JSON, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin

class SubscriptionStatus(str, enum.Enum):
    TRIALING = "trialing"
    ACTIVE = "active"
    GRACE_PERIOD = "grace_period"
    EXPIRED = "expired"
    SUSPENDED = "suspended"
    CANCELLED = "cancelled"
    CANCELED = "canceled"
    PENDING_PAYMENT = "pending_payment"
    PAST_DUE = "past_due"

class BillingCycle(str, enum.Enum):
    MONTHLY = "monthly"
    ANNUAL = "annual"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"

class SubscriptionPlan(Base, TimestampMixin):
    __tablename__ = "subscription_plans"

    id = Column(String(36), primary_key=True)
    code = Column(String(50), unique=True, nullable=False, index=True) # basic, growth, premium, pro, pro_plus, enterprise
    name = Column(String(100), nullable=False)
    tagline = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    
    monthly_price_inr = Column(Float, nullable=False, default=0.0)
    annual_price_inr = Column(Float, nullable=False, default=0.0)
    monthly_price_usd = Column(Float, nullable=False, default=0.0)
    annual_price_usd = Column(Float, nullable=False, default=0.0)

    member_limit = Column(Integer, nullable=False, default=10) # -1 for unlimited
    trainer_limit = Column(Integer, nullable=False, default=1) # -1 for unlimited
    staff_limit = Column(Integer, nullable=False, default=2) # -1 for unlimited
    branch_limit = Column(Integer, nullable=False, default=1) # -1 for unlimited

    is_popular = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True) # For enabling/disabling new signups
    contact_sales = Column(Boolean, default=False) # For custom enterprise pricing
    display_order = Column(Integer, default=0)

    # Feature flags dict, e.g. {"member_management": True, "diet_plans": True, ...}
    features = Column(JSON, nullable=False, default=dict)

    subscriptions = relationship("GymSubscription", back_populates="plan")

class GymSubscription(Base, TimestampMixin):
    __tablename__ = "gym_subscriptions"

    id = Column(String(36), primary_key=True)
    workspace_id = Column(String(64), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id = Column(String(36), ForeignKey("subscription_plans.id"), nullable=False)

    status = Column(String(50), nullable=False, default="trialing")
    billing_cycle = Column(String(50), nullable=False, default="monthly")
    currency = Column(String(10), nullable=False, default="INR")

    trial_start = Column(DateTime, nullable=True)
    trial_end = Column(DateTime, nullable=True)
    trial_started_at = Column(DateTime, nullable=True)
    trial_ends_at = Column(DateTime, nullable=True)
    trial_converted_at = Column(DateTime, nullable=True)
    reminder_sent_flags = Column(JSON, nullable=True, default=dict)
    is_repeat_trial_blocked = Column(Boolean, default=False)
    current_period_start = Column(DateTime, nullable=True)
    current_period_end = Column(DateTime, nullable=True)

    # Per-Gym Overrides
    custom_member_limit = Column(Integer, nullable=True)
    custom_trainer_limit = Column(Integer, nullable=True)
    custom_staff_limit = Column(Integer, nullable=True)
    custom_branch_limit = Column(Integer, nullable=True)
    custom_features = Column(JSON, nullable=True, default=dict)

    # Complimentary Access
    is_complimentary = Column(Boolean, default=False)
    complimentary_until = Column(DateTime, nullable=True)

    # Suspension & Notes
    suspended_at = Column(DateTime, nullable=True)
    suspension_reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)

    cashfree_subscription_id = Column(String(100), nullable=True, index=True)
    cashfree_mandate_id = Column(String(100), nullable=True)
    cancel_at_period_end = Column(Boolean, default=False)
    canceled_at = Column(DateTime, nullable=True)

    plan = relationship("SubscriptionPlan", back_populates="subscriptions")
    payments = relationship("SubscriptionPayment", back_populates="subscription", cascade="all, delete-orphan")
    invoices = relationship("BillingInvoice", back_populates="subscription", cascade="all, delete-orphan")

class SubscriptionAuditLog(Base, TimestampMixin):
    __tablename__ = "subscription_audit_logs"

    id = Column(String(36), primary_key=True)
    workspace_id = Column(String(64), nullable=False, index=True)
    actor_user_id = Column(String(64), nullable=True)
    action = Column(String(100), nullable=False) # trial_extension, plan_change, complimentary_grant, override_updated, status_change
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    reason = Column(Text, nullable=True)


class SubscriptionPayment(Base, TimestampMixin):
    __tablename__ = "subscription_payments"

    id = Column(String(36), primary_key=True)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    subscription_id = Column(String(36), ForeignKey("gym_subscriptions.id", ondelete="CASCADE"), nullable=False)

    cashfree_order_id = Column(String(100), nullable=True, index=True)
    cashfree_payment_id = Column(String(100), nullable=True, index=True)

    amount = Column(Float, nullable=False)
    currency = Column(String(10), nullable=False, default="INR")
    status = Column(SQLEnum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    payment_method = Column(String(50), nullable=True)
    failure_reason = Column(Text, nullable=True)

    subscription = relationship("GymSubscription", back_populates="payments")

class BillingInvoice(Base, TimestampMixin):
    __tablename__ = "billing_invoices"

    id = Column(String(36), primary_key=True)
    invoice_number = Column(String(100), unique=True, nullable=False, index=True)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    subscription_id = Column(String(36), ForeignKey("gym_subscriptions.id", ondelete="CASCADE"), nullable=False)

    amount = Column(Float, nullable=False)
    tax_amount = Column(Float, nullable=False, default=0.0)
    currency = Column(String(10), nullable=False, default="INR")
    status = Column(String(20), nullable=False, default="paid")
    pdf_url = Column(String(255), nullable=True)
    due_date = Column(DateTime, nullable=True)
    paid_at = Column(DateTime, nullable=True)

    subscription = relationship("GymSubscription", back_populates="invoices")

class BillingWebhookEvent(Base, TimestampMixin):
    __tablename__ = "billing_webhook_events"

    id = Column(String(36), primary_key=True)
    event_id = Column(String(100), unique=True, nullable=False, index=True)
    event_type = Column(String(100), nullable=False)
    payload = Column(JSON, nullable=False)
    processed = Column(Boolean, default=False)
    processed_at = Column(DateTime, nullable=True)
    error = Column(Text, nullable=True)
