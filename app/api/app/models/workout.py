import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey, Date, DateTime, Enum
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class WorkoutStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SCHEDULED = "SCHEDULED"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"


class Workout(Base, TimestampMixin, TenantMixin):
    __tablename__ = "workouts"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    trainer_id = Column(String(64), ForeignKey("trainers.id", ondelete="SET NULL"), nullable=True, index=True)
    member_id = Column(String(64), ForeignKey("members.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(150), nullable=False)  # Push-Pull-Legs, Full Body Hypertrophy
    difficulty = Column(String(50), default="Intermediate")
    target_muscle_groups = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    exercises_json = Column(Text, nullable=True)  # JSON serialized list of sets/reps/exercises/weights
    scheduled_date = Column(Date, nullable=True, index=True)
    status = Column(Enum(WorkoutStatus), default=WorkoutStatus.ACTIVE, nullable=False, index=True)
    completion_percentage = Column(Float, default=0.0)
    client_logged_at = Column(DateTime(timezone=True), nullable=True)
    trainer_feedback = Column(Text, nullable=True)


class WorkoutPlan(Base, TimestampMixin, TenantMixin):
    __tablename__ = "workout_plans"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    member_id = Column(String(64), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    trainer_id = Column(String(64), ForeignKey("trainers.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(150), nullable=False)
    duration_weeks = Column(Integer, default=12, nullable=False)
    schedule_data = Column(Text, nullable=True)
    status = Column(Enum(WorkoutStatus), default=WorkoutStatus.ACTIVE, nullable=False)

