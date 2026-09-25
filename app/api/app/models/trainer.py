import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey, Time, Date, DateTime, Enum, Index
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class TrainerStatus(str, enum.Enum):
    INVITED = "INVITED"
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    SUSPENDED = "SUSPENDED"
    REMOVED = "REMOVED"


class TrainerClientStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    ENDED = "ENDED"
    REQUESTED = "REQUESTED"


class SessionStatus(str, enum.Enum):
    SCHEDULED = "SCHEDULED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    NO_SHOW = "NO_SHOW"


class Trainer(Base, TimestampMixin, TenantMixin):
    __tablename__ = "trainers"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=False)
    specialization = Column(String(150), nullable=True)  # Strength, HIIT, Yoga, Rehab
    bio = Column(Text, nullable=True)
    hourly_rate = Column(Float, default=0.0)
    commission_percentage = Column(Float, default=0.0)
    status = Column(Enum(TrainerStatus), default=TrainerStatus.ACTIVE, nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    profile_photo = Column(String(512), nullable=True)
    experience = Column(String(100), nullable=True)
    joining_date = Column(Date, nullable=True)
    certifications = Column(Text, nullable=True)
    working_hours = Column(Text, nullable=True)
    emergency_contact = Column(String(100), nullable=True)


class TrainerClient(Base, TimestampMixin, TenantMixin):
    __tablename__ = "trainer_client"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    trainer_id = Column(String(64), ForeignKey("trainers.id", ondelete="CASCADE"), nullable=False, index=True)
    client_id = Column(String(64), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(Enum(TrainerClientStatus), default=TrainerClientStatus.ACTIVE, nullable=False, index=True)
    assigned_by = Column(String(64), nullable=True)
    assigned_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    started_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)

    __table_args__ = (
        Index("ix_trainer_client_ws_tr_cl", "workspace_id", "trainer_id", "client_id"),
    )


class TrainingSession(Base, TimestampMixin, TenantMixin):
    __tablename__ = "training_sessions"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    trainer_id = Column(String(64), ForeignKey("trainers.id", ondelete="CASCADE"), nullable=False, index=True)
    client_id = Column(String(64), ForeignKey("members.id", ondelete="SET NULL"), nullable=True, index=True)
    class_id = Column(String(64), ForeignKey("classes.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(150), nullable=False)
    scheduled_at = Column(DateTime(timezone=True), nullable=False, index=True)
    duration_minutes = Column(Integer, default=60, nullable=False)
    status = Column(Enum(SessionStatus), default=SessionStatus.SCHEDULED, nullable=False, index=True)
    notes = Column(Text, nullable=True)


class ClientNote(Base, TimestampMixin, TenantMixin):
    __tablename__ = "client_notes"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    trainer_id = Column(String(64), ForeignKey("trainers.id", ondelete="CASCADE"), nullable=False, index=True)
    client_id = Column(String(64), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    content = Column(Text, nullable=False)


class GymClass(Base, TimestampMixin, TenantMixin):
    __tablename__ = "classes"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    trainer_id = Column(String(64), ForeignKey("trainers.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(150), nullable=False)  # CrossFit WOD, Morning Yoga, Spin Cycling
    category = Column(String(50), default="General")
    schedule = Column(String(100), nullable=False)  # Mon/Wed/Fri 07:00 AM
    duration_minutes = Column(Integer, default=60, nullable=False)
    capacity = Column(Integer, default=20, nullable=False)
    room = Column(String(100), default="Main Studio")
    is_active = Column(Boolean, default=True, nullable=False)

