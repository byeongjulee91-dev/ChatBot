from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import uuid4
import json

from app.database import get_db
from app.models.message import Message as MessageModel, MessageStatus
from app.models.chat import Chat as ChatModel
from app.models.user import User
from app.schemas.message import Message, MessageCreate, MessageUpdate
from app.routers.auth import get_current_user
from app.services.ai import AIService
from app.config import get_settings

settings = get_settings()

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("", response_model=Message, status_code=status.HTTP_201_CREATED)
async def create_message(
    message_create: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new message"""
    # Verify chat belongs to user
    result = await db.execute(
        select(ChatModel).where(
            (ChatModel.id == message_create.chat_id) & (ChatModel.user_id == current_user.id)
        )
    )
    chat = result.scalar_one_or_none()

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )

    # Create user message
    message = MessageModel(
        id=str(uuid4()),
        chat_id=message_create.chat_id,
        parent_id=message_create.parent_id,
        children_ids=[],
        role=message_create.role,
        content=message_create.content,
        model=message_create.model,
        files=message_create.files,
        status=MessageStatus.COMPLETED
    )

    db.add(message)

    # Update parent message's children
    if message_create.parent_id:
        result = await db.execute(
            select(MessageModel).where(MessageModel.id == message_create.parent_id)
        )
        parent = result.scalar_one_or_none()
        if parent:
            parent.children_ids = parent.children_ids + [message.id]

    await db.commit()
    await db.refresh(message)

    return message


@router.get("/chat/{chat_id}", response_model=List[Message])
async def get_messages_by_chat(
    chat_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all messages for a chat"""
    # Verify chat belongs to user
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

    # Get messages
    result = await db.execute(
        select(MessageModel)
        .where(MessageModel.chat_id == chat_id)
        .order_by(MessageModel.timestamp.asc())
    )
    messages = result.scalars().all()

    return messages


@router.patch("/{message_id}", response_model=Message)
async def update_message(
    message_id: str,
    message_update: MessageUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a message"""
    # Get message and verify ownership
    result = await db.execute(
        select(MessageModel).where(MessageModel.id == message_id)
    )
    message = result.scalar_one_or_none()

    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )

    # Verify chat belongs to user
    result = await db.execute(
        select(ChatModel).where(
            (ChatModel.id == message.chat_id) & (ChatModel.user_id == current_user.id)
        )
    )
    chat = result.scalar_one_or_none()

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this message"
        )

    # Update fields
    if message_update.content is not None:
        message.content = message_update.content
    if message_update.rating is not None:
        message.rating = message_update.rating
    if message_update.status is not None:
        message.status = message_update.status

    await db.commit()
    await db.refresh(message)

    return message


@router.post("/generate", response_class=StreamingResponse)
async def generate_message(
    message_create: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate AI response for a message (streaming)"""
    # Verify chat belongs to user
    result = await db.execute(
        select(ChatModel).where(
            (ChatModel.id == message_create.chat_id) & (ChatModel.user_id == current_user.id)
        )
    )
    chat = result.scalar_one_or_none()

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )

    # Create user message
    user_message = MessageModel(
        id=str(uuid4()),
        chat_id=message_create.chat_id,
        parent_id=message_create.parent_id,
        children_ids=[],
        role=message_create.role,
        content=message_create.content,
        model=message_create.model,
        files=message_create.files,
        status=MessageStatus.COMPLETED
    )

    db.add(user_message)

    # Update parent message's children
    if message_create.parent_id:
        result = await db.execute(
            select(MessageModel).where(MessageModel.id == message_create.parent_id)
        )
        parent = result.scalar_one_or_none()
        if parent:
            parent.children_ids = parent.children_ids + [user_message.id]

    await db.commit()
    await db.refresh(user_message)

    # Create AI message placeholder
    # Use default model based on provider if not specified
    default_model = settings.openai_model if settings.default_ai_provider == "openai" else settings.ollama_model

    ai_message_id = str(uuid4())
    ai_message = MessageModel(
        id=ai_message_id,
        chat_id=message_create.chat_id,
        parent_id=user_message.id,
        children_ids=[],
        role="assistant",
        content="",
        model=message_create.model or default_model,
        status=MessageStatus.STREAMING
    )

    db.add(ai_message)
    user_message.children_ids = [ai_message_id]

    await db.commit()
    await db.refresh(ai_message)

    # Get conversation history
    result = await db.execute(
        select(MessageModel)
        .where(MessageModel.chat_id == message_create.chat_id)
        .order_by(MessageModel.timestamp.asc())
    )
    all_messages = result.scalars().all()

    # Convert to OpenAI format
    conversation = [
        {"role": msg.role.value, "content": msg.content}
        for msg in all_messages
        if msg.role.value in ["user", "assistant", "system"]
    ]

    # Stream AI response
    async def stream_response():
        ai_service = AIService()
        full_content = ""

        try:
            # Determine provider: use default from settings, or infer from model name
            provider = settings.default_ai_provider
            if "gpt" in ai_message.model.lower() or "openai" in ai_message.model.lower():
                provider = "openai"
            elif "llama" in ai_message.model.lower() or "mistral" in ai_message.model.lower():
                provider = "ollama"

            async for chunk in ai_service.generate_completion_stream(
                messages=conversation,
                model=ai_message.model,
                provider=provider
            ):
                full_content += chunk

                # Send chunk as SSE
                yield f"data: {json.dumps({'chunk': chunk, 'message_id': ai_message_id})}\n\n"

            # Update message with final content
            async with AsyncSessionLocal() as update_db:
                result = await update_db.execute(
                    select(MessageModel).where(MessageModel.id == ai_message_id)
                )
                msg = result.scalar_one_or_none()
                if msg:
                    msg.content = full_content
                    msg.status = MessageStatus.COMPLETED
                    await update_db.commit()

            yield f"data: {json.dumps({'done': True, 'message_id': ai_message_id})}\n\n"

        except Exception as e:
            # Update message status to error
            async with AsyncSessionLocal() as update_db:
                result = await update_db.execute(
                    select(MessageModel).where(MessageModel.id == ai_message_id)
                )
                msg = result.scalar_one_or_none()
                if msg:
                    msg.status = MessageStatus.ERROR
                    msg.content = full_content or "Error generating response"
                    await update_db.commit()

            yield f"data: {json.dumps({'error': str(e), 'message_id': ai_message_id})}\n\n"

    return StreamingResponse(
        stream_response(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


# Import async session maker
from app.database import AsyncSessionLocal
