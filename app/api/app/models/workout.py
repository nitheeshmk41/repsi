from sqlalchemy import Column, String, Integer, Text, ForeignKey
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class Workout(Base, TimestampMixin, TenantMixin):
    __tablename__ = "workouts"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    title = Column(String(150), nullable=False)  # Push-Pull-Legs, Full Body Hypertrophy
    difficulty = Column(String(50), default="Intermediate")
    target_muscle_groups = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    exercises_json = Column(Text, nullable=True)  # JSON serialized list of sets/reps/exercises


class WorkoutPlan(Base, TimestampMixin, TenantMixin):
    __tablename__ = "workout_plans"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    member_id = Column(String(64), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    trainer_id = Column(String(64), nullable=True)
    title = Column(String(150), nullable=False)
    duration_weeks = Column(Integer, default=12, nullable=False)
    schedule_data = Column(Text, nullable=True)
