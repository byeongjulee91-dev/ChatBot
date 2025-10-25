from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from uuid import uuid4

from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import verify_password, get_password_hash, create_access_token


class AuthService:
    """Authentication service"""

    @staticmethod
    async def create_user(db: AsyncSession, user_create: UserCreate) -> User:
        """Create a new user"""
        # Check if user already exists
        result = await db.execute(
            select(User).where(
                (User.email == user_create.email) | (User.username == user_create.username)
            )
        )
        existing_user = result.scalar_one_or_none()

        if existing_user:
            if existing_user.email == user_create.email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )

        # Create new user
        user = User(
            id=str(uuid4()),
            email=user_create.email,
            username=user_create.username,
            hashed_password=get_password_hash(user_create.password),
            is_active=True,
            is_superuser=False
        )

        db.add(user)
        await db.commit()
        await db.refresh(user)

        return user

    @staticmethod
    async def authenticate_user(db: AsyncSession, username: str, password: str) -> Optional[User]:
        """Authenticate a user"""
        result = await db.execute(
            select(User).where(User.username == username)
        )
        user = result.scalar_one_or_none()

        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None

        return user

    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: str) -> Optional[User]:
        """Get user by ID"""
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    def create_user_token(user_id: str) -> str:
        """Create access token for user"""
        return create_access_token(data={"sub": user_id})
