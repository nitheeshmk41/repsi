import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Enum, ForeignKey, Index, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class AttendanceMethod(str, enum.Enum):
    QR = "qr"
    BIOMETRIC = "biometric"
    MANUAL = "manual"
    RFID = "rfid"


class CheckoutType(str, enum.Enum):
    MANUAL = "MANUAL"
    AUTO = "AUTO"
    STAFF = "STAFF"


class AttendanceStatus(str, enum.Enum):
    CHECKED_IN = "CHECKED_IN"
    CHECKED_OUT = "CHECKED_OUT"
    AUTO_CHECKED_OUT = "AUTO_CHECKED_OUT"


class Attendance(Base, TimestampMixin, TenantMixin):
    __tablename__ = "attendance"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    member_id = Column(String(64), ForeignKey("members.id", ondelete="CASCADE"), nullable=True, index=True)
    trainer_id = Column(String(64), ForeignKey("trainers.id", ondelete="CASCADE"), nullable=True, index=True)
    gym_location_id = Column(String(64), nullable=True, index=True)
    check_in_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    check_out_time = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    method = Column(Enum(AttendanceMethod), default=AttendanceMethod.QR, nullable=False)
    checkout_type = Column(String(20), default=CheckoutType.MANUAL.value, nullable=True)
    qr_token_id = Column(String(64), nullable=True, index=True)
    terminal_id = Column(String(64), nullable=True)  # Turnstile, Reception Tablet, or Kiosk ID
    status = Column(String(30), default=AttendanceStatus.CHECKED_IN.value, nullable=False, index=True)
    notes = Column(String(255), nullable=True)

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

    @property
    def duration_formatted(self) -> str:
        if self.duration_minutes is not None:
            hours = self.duration_minutes // 60
            mins = self.duration_minutes % 60
            if hours > 0:
                return f"{hours}h {mins}m" if mins > 0 else f"{hours}h"
            return f"{mins}m"
        elif self.check_in_time:
            # Active session duration
            start = self.check_in_time
            if start.tzinfo is not None:
                end = self.check_out_time if self.check_out_time is not None else datetime.now(timezone.utc)
                if end.tzinfo is None:
                    end = end.replace(tzinfo=timezone.utc)
            else:
                end = self.check_out_time.replace(tzinfo=None) if self.check_out_time else datetime.now(timezone.utc).replace(tzinfo=None)
            delta = end - start
            total_mins = max(0, int(delta.total_seconds() // 60))
            hours = total_mins // 60
            mins = total_mins % 60
            if hours > 0:
                return f"{hours}h {mins}m" if mins > 0 else f"{hours}h"
            return f"{mins}m"
        return "0m"

    __table_args__ = (
        Index("ix_attendance_ws_date", "workspace_id", "check_in_time"),
        Index("ix_attendance_ws_active", "workspace_id", "check_out_time"),
        Index("ix_attendance_mem_active", "workspace_id", "member_id", "check_out_time"),
    )


class AttendanceQR(Base, TimestampMixin, TenantMixin):
    __tablename__ = "attendance_qrs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    gym_location_id = Column(String(64), nullable=True, index=True)
    token = Column(String(128), unique=True, nullable=False, index=True)
    label = Column(String(100), default="Main Entrance QR", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=True)
    rotated_at = Column(DateTime, nullable=True)
    created_by = Column(String(64), nullable=True)

    __table_args__ = (
        Index("ix_qr_ws_active", "workspace_id", "is_active"),
        Index("ix_qr_token_active", "token", "is_active"),
    )


class AttendanceSettings(Base, TimestampMixin, TenantMixin):
    __tablename__ = "attendance_settings"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    gym_location_id = Column(String(64), nullable=True, index=True)
    max_session_duration_minutes = Column(Integer, default=240, nullable=False)  # 4 hours default
    gym_closing_time = Column(String(10), default="22:00", nullable=False)  # "22:00" = 10:00 PM
    auto_checkout_enabled = Column(Boolean, default=True, nullable=False)
    qr_rotation_interval_minutes = Column(Integer, default=0, nullable=False)  # 0 = manual rotation
    allow_member_manual_checkout = Column(Boolean, default=True, nullable=False)
    allow_staff_manual_checkout = Column(Boolean, default=True, nullable=False)

    __table_args__ = (
        Index("ix_settings_ws_loc", "workspace_id", "gym_location_id"),
    )


class GymLocation(Base, TimestampMixin, TenantMixin):
    __tablename__ = "gym_locations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(150), nullable=False)
    code = Column(String(50), nullable=False)
    address = Column(String(255), nullable=True)
    closing_time = Column(String(10), default="22:00", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    __table_args__ = (
        Index("ix_gym_loc_ws", "workspace_id", "is_active"),
    )


class ClassAttendance(Base, TimestampMixin, TenantMixin):
    __tablename__ = "class_attendance"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    class_id = Column(String(64), nullable=False, index=True)
    member_id = Column(String(64), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    check_in_time = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    status = Column(String(20), default="attended", nullable=False)  # booked, attended, no_show, cancelled
