from sqlalchemy import Column, String, Boolean, Text, ForeignKey, DateTime
from datetime import datetime, timezone
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class Notification(Base, TimestampMixin, TenantMixin):
    __tablename__ = "notifications"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    action_url = Column(String(512), nullable=True)


class Activity(Base, TimestampMixin, TenantMixin):
    __tablename__ = "activities"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), nullable=True)
    action = Column(String(100), nullable=False)  # member_registered, payment_received, checked_in
    entity_type = Column(String(50), nullable=False)  # Member, Payment, Class
    entity_id = Column(String(64), nullable=False)
    description = Column(Text, nullable=False)


class AuditLog(Base, TimestampMixin, TenantMixin):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), nullable=True)
    ip_address = Column(String(50), nullable=True)
    action = Column(String(150), nullable=False)
    details = Column(Text, nullable=True)


class Report(Base, TimestampMixin, TenantMixin):
    __tablename__ = "reports"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    report_type = Column(String(100), nullable=False)  # revenue_monthly, attendance_peak, member_retention
    period = Column(String(50), nullable=False)
    generated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    data_json = Column(Text, nullable=True)
