import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Enum, ForeignKey, Index, Text
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class BiometricDeviceStatus(str, enum.Enum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"
    DISCONNECTED = "DISCONNECTED"
    UNCONFIGURED = "UNCONFIGURED"


class BiometricDevice(Base, TimestampMixin, TenantMixin):
    __tablename__ = "biometric_devices"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    device_name = Column(String(150), nullable=False)
    device_model = Column(String(100), default="ZKTeco Network Terminal", nullable=False)
    device_serial = Column(String(100), nullable=False, index=True)
    ip_address = Column(String(50), nullable=True)
    port = Column(Integer, default=4370, nullable=False)
    device_token = Column(String(128), unique=True, nullable=False, index=True)
    location_name = Column(String(150), default="Main Entrance", nullable=False)
    status = Column(String(30), default=BiometricDeviceStatus.DISCONNECTED.value, nullable=False)
    last_seen_at = Column(DateTime, nullable=True)
    last_sync_at = Column(DateTime, nullable=True)
    last_event_at = Column(DateTime, nullable=True)
    sync_failure_count = Column(Integer, default=0, nullable=False)
    last_error_message = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    __table_args__ = (
        Index("ix_bio_dev_ws", "workspace_id", "is_active"),
        Index("ix_bio_dev_serial", "workspace_id", "device_serial"),
    )
