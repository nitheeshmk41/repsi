import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey, Index
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class AttendanceMethod(str, enum.Enum):
    QR = "qr"
    BIOMETRIC = "biometric"
    MANUAL = "manual"
    RFID = "rfid"


class Attendance(Base, TimestampMixin, TenantMixin):
    __tablename__ = "attendance"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    member_id = Column(String(64), ForeignKey("members.id", ondelete="CASCADE"), nullable=True, index=True)
    trainer_id = Column(String(64), ForeignKey("trainers.id", ondelete="CASCADE"), nullable=True, index=True)
    check_in_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    check_out_time = Column(DateTime, nullable=True)
    method = Column(Enum(AttendanceMethod), default=AttendanceMethod.QR, nullable=False)
    terminal_id = Column(String(64), nullable=True)  # Turnstile or Tablet ID

    member = relationship("Member", foreign_keys=[member_id], lazy="joined")
    trainer = relationship("Trainer", foreign_keys=[trainer_id], lazy="joined")

    @property
    def person_name(self) -> str:
        if self.trainer:
            return self.trainer.name
        if self.member:
            return f"{self.member.first_name} {self.member.last_name or ''}".strip()
        return "Facility Visitor"

    @property
    def person_type(self) -> str:
        return "trainer" if self.trainer_id else "member"

    @property
    def attendance_status(self) -> str:
        return "out" if self.check_out_time else "in"

    __table_args__ = (
        Index("ix_attendance_ws_date", "workspace_id", "check_in_time"),
    )


class ClassAttendance(Base, TimestampMixin, TenantMixin):
    __tablename__ = "class_attendance"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    class_id = Column(String(64), nullable=False, index=True)
    member_id = Column(String(64), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    check_in_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    status = Column(String(20), default="attended", nullable=False)  # booked, attended, no_show, cancelled
