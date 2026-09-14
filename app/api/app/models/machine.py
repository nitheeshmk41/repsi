from sqlalchemy import Column, String, Text, Boolean
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class GymMachine(Base, TimestampMixin, TenantMixin):
    __tablename__ = "machines"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(150), nullable=False)
    category = Column(String(50), default="Strength", nullable=False)
    brand = Column(String(100), default="Generic", nullable=False)
    model = Column(String(100), default="Standard", nullable=False)
    muscle_group = Column(String(200), default="Full Body", nullable=False)
    status = Column(String(50), default="Available", nullable=False)  # Available, In Use, Maintenance, Out of Service
    instructions = Column(Text, nullable=True)
    last_serviced = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
