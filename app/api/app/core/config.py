from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_CURRENT_DIR = Path(__file__).resolve().parent
_ROOT_ENV = _CURRENT_DIR.parent.parent.parent / ".env"
_REPO_ENV = _CURRENT_DIR.parent.parent.parent.parent / ".env"
_ENV_FILES = [str(_REPO_ENV), str(_ROOT_ENV), ".env"]


class Settings(BaseSettings):
    PROJECT_NAME: str = "REPSI API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str = "repsi-super-secret-key-change-in-production-min-32-chars-long"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    FRONTEND_URL: str = "http://localhost:3000"

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = ""
    OTP_EXPIRE_MINUTES: int = 10
    OTP_RESEND_COOLDOWN_SECONDS: int = 60

    # Database (PostgreSQL Neon from root .env with SQLite fallback for local test/dev)
    DATABASE_URL: str = "sqlite:///./repsi.db"

    # Cashfree Payment Gateway
    CASHFREE_APP_ID: str = ""
    CASHFREE_SECRET_KEY: str = ""
    CASHFREE_ENV: str = "TEST"

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
        "https://repsi.app",
        "https://www.repsi.app",
        "https://repsi.vercel.app",
        "https://repsi.fastapicloud.dev",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, str):
            if not v.strip():
                return []
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return [str(i).strip() for i in parsed]
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return [str(i).strip() for i in v]
        raise ValueError(v)

    model_config = SettingsConfigDict(
        env_file=_ENV_FILES,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
