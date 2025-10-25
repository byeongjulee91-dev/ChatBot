from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class MessageRole(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class MessageStatus(str, enum.Enum):
    PENDING = "pending"
    STREAMING = "streaming"
    COMPLETED = "completed"
    ERROR = "error"


class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, index=True)
    chat_id = Column(String, ForeignKey("chats.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_id = Column(String, nullable=True)
    children_ids = Column(JSON, nullable=False, default=list)
    role = Column(Enum(MessageRole), nullable=False)
    content = Column(String, nullable=False)
    model = Column(String, nullable=True)
    files = Column(JSON, nullable=True)  # Array of file metadata
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(Enum(MessageStatus), nullable=False, default=MessageStatus.COMPLETED)
    rating = Column(Integer, nullable=True)  # 1 or -1
    citations = Column(JSON, nullable=True)
    metadata = Column(JSON, nullable=True)

    # Relationships
    chat = relationship("Chat", back_populates="messages")
