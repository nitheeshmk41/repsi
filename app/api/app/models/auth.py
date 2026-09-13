from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String

from app.core.database import Base
from app.models.base import generate_uuid


class PendingRegistration(Base):
    __tablename__ = "pending_registrations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    gym_name = Column(String(255), nullable=False)
    gym_phone = Column(String(50), nullable=True)
    gym_city = Column(String(100), nullable=True)
    otp_hash = Column(String(128), nullable=False)
    otp_expires_at = Column(DateTime(timezone=True), nullable=False)
    last_sent_at = Column(DateTime(timezone=True), nullable=False)
    attempts = Column(Integer, nullable=False, default=0)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
