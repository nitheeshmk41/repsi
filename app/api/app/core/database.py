from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Engine setup: handles SQLite connect_args if in local dev
connect_args = {}
engine_kwargs = {
    "pool_pre_ping": True,
    "echo": settings.DEBUG and not settings.DATABASE_URL.startswith("sqlite"),
}

if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    engine_kwargs["pool_size"] = settings.DATABASE_POOL_SIZE
    engine_kwargs["max_overflow"] = settings.DATABASE_MAX_OVERFLOW
    engine_kwargs["pool_recycle"] = 1800

try:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args=connect_args,
        **engine_kwargs,
    )
except Exception:
    # Graceful fallback to sqlite if remote DB driver cannot load in local environment
    engine = create_engine(
        "sqlite:///./repsi.db",
        connect_args={"check_same_thread": False},
        pool_pre_ping=True,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
