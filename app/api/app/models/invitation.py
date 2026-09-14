import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class InvitationRole(str, enum.Enum):
    MEMBER = "member"
    TRAINER = "trainer"


class InvitationStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    EXPIRED = "expired"
    REVOKED = "revoked"


class GymInvitation(Base, TimestampMixin, TenantMixin):
    __tablename__ = "gym_invitations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    email = Column(String(255), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(Enum(InvitationRole), nullable=False)
    specialization = Column(String(150), nullable=True)
    token_hash = Column(String(255), nullable=False, unique=True, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    invited_by_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status = Column(Enum(InvitationStatus), default=InvitationStatus.PENDING, nullable=False, index=True)

    invited_by = relationship("User", foreign_keys=[invited_by_id])
