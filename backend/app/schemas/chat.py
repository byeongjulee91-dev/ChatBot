from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class ChatBase(BaseModel):
    title: str = Field(default="새 대화")
    selected_models: List[str] = Field(default_factory=list)


class ChatCreate(ChatBase):
    pass


class ChatUpdate(BaseModel):
    title: Optional[str] = None
    selected_models: Optional[List[str]] = None


class Chat(ChatBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
