from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Application
    app_name: str = "AI ChatBot API"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"

    # Database
    database_url: str = "sqlite+aiosqlite:///./chatbot.db"

    # Security
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # CORS
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000"
    ]

    # AI Model Configuration
    openai_api_key: str = ""
    openai_model: str = "gpt-3.5-turbo"

    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama2"

    default_ai_provider: str = "openai"  # "openai" or "ollama"

    # File Upload
    max_upload_size: int = 10485760  # 10MB
    upload_dir: str = "./uploads"

    # Redis
    redis_url: str = "redis://localhost:6379/0"
    enable_redis: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
