import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


def _build_db_url(raw: str | None) -> str:
    """
    Ensures the DATABASE_URL uses the psycopg3 driver prefix and
    appends sslmode=require (required by Supabase).
    """
    if not raw:
        return ""
    # Normalize driver prefix
    url = raw.replace("postgresql://", "postgresql+psycopg://", 1)
    url = url.replace("postgres://", "postgresql+psycopg://", 1)
    # Append SSL if not already present
    if "sslmode" not in url:
        sep = "&" if "?" in url else "?"
        url = f"{url}{sep}sslmode=require"
    return url


class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
    RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "noreply@rcm.edu")
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    # Supabase connection string — set DATABASE_URL in your .env file
    # Format: postgresql+psycopg://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
    SQLALCHEMY_DATABASE_URI = _build_db_url(os.getenv("DATABASE_URL"))


class ProductionConfig(BaseConfig):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = _build_db_url(os.getenv("DATABASE_URL"))


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
