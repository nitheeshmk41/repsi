import enum
from sqlalchemy import Column, String, Integer, Float, Boolean, Enum, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class MemberStatus(str, enum.Enum):
    ACTIVE = "active"
    EXPIRING = "expiring"
    EXPIRED = "expired"
    FROZEN = "frozen"
    CANCELLED = "cancelled"


class MembershipPlan(Base, TimestampMixin, TenantMixin):
    __tablename__ = "membership_plans"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(150), nullable=False)  # Monthly, Quarterly, Half-Yearly, Annual
    description = Column(Text, nullable=True)
    duration_months = Column(Integer, default=1, nullable=False)
    price = Column(Float, nullable=False)
    features = Column(Text, nullable=True)  # JSON or comma-separated list of amenities
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    memberships = relationship("Membership", back_populates="plan")


class Member(Base, TimestampMixin, TenantMixin):
    __tablename__ = "members"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=True, default="")
    email = Column(String(255), nullable=True, index=True)
    phone = Column(String(50), nullable=True, index=True)
    avatar_url = Column(String(512), nullable=True)
    gender = Column(String(20), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    emergency_contact = Column(String(100), nullable=True)
    status = Column(Enum(MemberStatus), default=MemberStatus.ACTIVE, nullable=False, index=True)
    joined_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)

    # Assigned Personal Trainer (optional)
    trainer_id = Column(String(64), nullable=True)

    @property
    def repsi_access(self) -> str:
        return "Connected" if self.user_id else "Not connected"

    @property
    def plan_name(self) -> str:
        if self.memberships:
            active = [m for m in self.memberships if m.status == MemberStatus.ACTIVE]
            if active and active[0].plan:
                return active[0].plan.name
            if self.memberships[0].plan:
                return self.memberships[0].plan.name
        return "Monthly"

    # Relationships
    memberships = relationship("Membership", back_populates="member", cascade="all, delete-orphan")


class Membership(Base, TimestampMixin, TenantMixin):
    __tablename__ = "memberships"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    member_id = Column(String(64), ForeignKey("members.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id = Column(String(64), ForeignKey("membership_plans.id"), nullable=False, index=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False, index=True)
    status = Column(Enum(MemberStatus), default=MemberStatus.ACTIVE, nullable=False)
    price_paid = Column(Float, nullable=False)
    auto_renew = Column(Boolean, default=False, nullable=False)

    # Relationships
    member = relationship("Member", back_populates="memberships")
    plan = relationship("MembershipPlan", back_populates="memberships")
