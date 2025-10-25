from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any
from enum import Enum


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class MessageStatus(str, Enum):
    PENDING = "pending"
    STREAMING = "streaming"
    COMPLETED = "completed"
    ERROR = "error"


class MessageFile(BaseModel):
    id: str
    name: str
    type: str
    size: int
    url: str


class MessageBase(BaseModel):
    content: str
    role: MessageRole
    model: Optional[str] = None
    files: Optional[List[MessageFile]] = None


class MessageCreate(MessageBase):
    chat_id: str
    parent_id: Optional[str] = None


class MessageUpdate(BaseModel):
    content: Optional[str] = None
    rating: Optional[int] = None
    status: Optional[MessageStatus] = None


class Message(MessageBase):
    id: str
    chat_id: str
    parent_id: Optional[str] = None
    children_ids: List[str] = []
    timestamp: datetime
    status: MessageStatus
    rating: Optional[int] = None
    citations: Optional[List[Dict[str, Any]]] = None
    message_metadata: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
