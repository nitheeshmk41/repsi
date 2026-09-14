import enum
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Float, DateTime, Date, Enum, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class LeadStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    VISIT_SCHEDULED = "visit_scheduled"
    TRIAL = "trial"
    NEGOTIATION = "negotiation"
    CONVERTED = "converted"
    LOST = "lost"


class LeadPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class FollowUpType(str, enum.Enum):
    CALL = "call"
    WHATSAPP = "whatsapp"
    EMAIL = "email"
    VISIT = "visit"
    TRIAL = "trial"
    RENEWAL = "renewal"
    OTHER = "other"


class FollowUpStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    MISSED = "missed"
    CANCELLED = "cancelled"


class Lead(Base, TimestampMixin, TenantMixin):
    __tablename__ = "leads"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False, default="")
    phone = Column(String(50), nullable=False, index=True)
    email = Column(String(255), nullable=True, index=True)
    gender = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)

    source = Column(String(100), default="Walk-in", nullable=False, index=True)
    status = Column(Enum(LeadStatus), default=LeadStatus.NEW, nullable=False, index=True)
    priority = Column(Enum(LeadPriority), default=LeadPriority.MEDIUM, nullable=False, index=True)

    interested_plan = Column(String(150), nullable=True)
    interested_service = Column(String(150), nullable=True)
    assigned_staff_id = Column(String(64), nullable=True)
    expected_value = Column(Float, default=0.0, nullable=False)

    last_contacted_at = Column(DateTime, nullable=True)
    next_follow_up_at = Column(DateTime, nullable=True, index=True)

    converted_member_id = Column(String(64), ForeignKey("members.id", ondelete="SET NULL"), nullable=True)
    converted_at = Column(DateTime, nullable=True)
    lost_reason = Column(String(255), nullable=True)

    notes = Column(Text, nullable=True)
    tags = Column(String(255), nullable=True)

    # Relationships
    activities = relationship("LeadActivity", back_populates="lead", cascade="all, delete-orphan", order_by="desc(LeadActivity.created_at)")
    follow_ups = relationship("LeadFollowUp", back_populates="lead", cascade="all, delete-orphan")


class LeadActivity(Base, TenantMixin):
    __tablename__ = "lead_activities"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    lead_id = Column(String(64), ForeignKey("leads.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_type = Column(String(50), nullable=False)  # status_change, call, whatsapp, email, visit, trial, note
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    performed_by_id = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    lead = relationship("Lead", back_populates="activities")


class LeadFollowUp(Base, TimestampMixin, TenantMixin):
    __tablename__ = "lead_follow_ups"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    lead_id = Column(String(64), ForeignKey("leads.id", ondelete="CASCADE"), nullable=True, index=True)
    member_id = Column(String(64), ForeignKey("members.id", ondelete="CASCADE"), nullable=True, index=True)

    follow_up_type = Column(Enum(FollowUpType), default=FollowUpType.CALL, nullable=False)
    scheduled_at = Column(DateTime, nullable=False, index=True)
    status = Column(Enum(FollowUpStatus), default=FollowUpStatus.PENDING, nullable=False, index=True)
    notes = Column(Text, nullable=True)
    assigned_to_id = Column(String(64), nullable=True)
    completed_at = Column(DateTime, nullable=True)

    lead = relationship("Lead", back_populates="follow_ups")
