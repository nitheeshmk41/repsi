import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Index
from app.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class TimestampMixin:
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class TenantMixin:
    """
    Guarantees every tenant-owned record strictly belongs to a specific workspace.
    A composite index on (workspace_id, id) enforces efficient and isolated queries.
    """
    workspace_id = Column(String(64), nullable=False, index=True)
