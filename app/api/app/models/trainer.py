from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey, Time
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


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
    is_active = Column(Boolean, default=True, nullable=False)


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
