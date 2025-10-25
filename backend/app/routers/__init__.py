from app.routers.auth import router as auth_router
from app.routers.chats import router as chats_router
from app.routers.messages import router as messages_router

__all__ = ["auth_router", "chats_router", "messages_router"]
