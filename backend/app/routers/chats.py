from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from uuid import uuid4

from app.database import get_db
from app.models.chat import Chat as ChatModel
from app.models.user import User
from app.schemas.chat import Chat, ChatCreate, ChatUpdate
from app.routers.auth import get_current_user

router = APIRouter(prefix="/chats", tags=["chats"])


@router.post("", response_model=Chat, status_code=status.HTTP_201_CREATED)
async def create_chat(
    chat_create: ChatCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new chat"""
    chat = ChatModel(
        id=str(uuid4()),
        user_id=current_user.id,
        title=chat_create.title,
        selected_models=chat_create.selected_models or []
    )

    db.add(chat)
    await db.commit()
    await db.refresh(chat)

    return chat


@router.get("", response_model=List[Chat])
async def get_chats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all chats for current user"""
    result = await db.execute(
        select(ChatModel)
        .where(ChatModel.user_id == current_user.id)
        .order_by(ChatModel.updated_at.desc())
    )
    chats = result.scalars().all()

    return chats


@router.get("/{chat_id}", response_model=Chat)
async def get_chat(
    chat_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific chat"""
    result = await db.execute(
        select(ChatModel).where(
            (ChatModel.id == chat_id) & (ChatModel.user_id == current_user.id)
        )
    )
    chat = result.scalar_one_or_none()

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )

    return chat


@router.patch("/{chat_id}", response_model=Chat)
async def update_chat(
    chat_id: str,
    chat_update: ChatUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a chat"""
    result = await db.execute(
        select(ChatModel).where(
            (ChatModel.id == chat_id) & (ChatModel.user_id == current_user.id)
        )
    )
    chat = result.scalar_one_or_none()

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )

    # Update fields
    if chat_update.title is not None:
        chat.title = chat_update.title
    if chat_update.selected_models is not None:
        chat.selected_models = chat_update.selected_models

    await db.commit()
    await db.refresh(chat)

    return chat


@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat(
    chat_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a chat"""
    result = await db.execute(
        select(ChatModel).where(
            (ChatModel.id == chat_id) & (ChatModel.user_id == current_user.id)
        )
    )
    chat = result.scalar_one_or_none()

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )

    await db.execute(
        delete(ChatModel).where(ChatModel.id == chat_id)
    )
    await db.commit()

    return None
