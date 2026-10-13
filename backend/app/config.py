import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "KidSync AI"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./kidsync.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "kidsync-super-secret-production-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    ENABLE_AI_LLM_SUMMARY: bool = True

settings = Settings()
