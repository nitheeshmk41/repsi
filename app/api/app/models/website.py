from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, UniqueConstraint
from app.core.database import Base
from app.models.base import TimestampMixin, TenantMixin, generate_uuid


class Website(Base, TimestampMixin, TenantMixin):
    __tablename__ = "websites"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    
    # Subdomain and custom domain
    subdomain = Column(String(100), nullable=False, unique=True, index=True)
    custom_domain = Column(String(255), nullable=True, unique=True, index=True)
    custom_domain_status = Column(String(50), default="not_connected", nullable=False)  # not_connected, pending_verification, verified, active

    # Template selection
    template_id = Column(String(50), default="modern-fitness", nullable=False)  # modern-fitness, minimal-gym, performance, luxury-fitness, crossfit, personal-training

    # Publish state
    is_published = Column(Boolean, default=False, nullable=False, index=True)
    published_at = Column(DateTime, nullable=True)

    # Branding & Content
    title = Column(String(255), nullable=False)
    tagline = Column(String(255), nullable=True)
    primary_color = Column(String(20), default="#16A34A", nullable=False)
    secondary_color = Column(String(20), default="#15803D", nullable=False)
    accent_color = Column(String(20), default="#22C55E", nullable=False)

    logo_url = Column(String(512), nullable=True)
    hero_image_url = Column(String(512), nullable=True)
    about_text = Column(Text, nullable=True)
    
    # Contact info
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    opening_hours = Column(String(255), nullable=True)

    # JSON configurations
    social_links = Column(Text, nullable=True)
    sections_config = Column(Text, nullable=True)

    # SEO
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)

    # Analytics counters
    views_count = Column(Integer, default=0, nullable=False)
    leads_count = Column(Integer, default=0, nullable=False)
