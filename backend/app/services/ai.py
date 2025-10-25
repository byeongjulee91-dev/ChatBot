from typing import AsyncGenerator
import httpx
from openai import AsyncOpenAI
from app.config import get_settings

settings = get_settings()


class AIService:
    """AI service for generating chat completions"""

    def __init__(self):
        self.openai_client = None
        if settings.openai_api_key:
            self.openai_client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def generate_completion_stream(
        self,
        messages: list[dict],
        model: str = None,
        provider: str = None
    ) -> AsyncGenerator[str, None]:
        """Generate streaming completion from AI model"""
        provider = provider or settings.default_ai_provider
        model = model or (settings.openai_model if provider == "openai" else settings.ollama_model)

        if provider == "openai":
            async for chunk in self._generate_openai_stream(messages, model):
                yield chunk
        elif provider == "ollama":
            async for chunk in self._generate_ollama_stream(messages, model):
                yield chunk
        else:
            raise ValueError(f"Unknown AI provider: {provider}")

    async def _generate_openai_stream(
        self,
        messages: list[dict],
        model: str
    ) -> AsyncGenerator[str, None]:
        """Generate streaming completion from OpenAI"""
        if not self.openai_client:
            raise ValueError("OpenAI API key not configured")

        stream = await self.openai_client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True
        )

        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    async def _generate_ollama_stream(
        self,
        messages: list[dict],
        model: str
    ) -> AsyncGenerator[str, None]:
        """Generate streaming completion from Ollama"""
        url = f"{settings.ollama_base_url}/api/chat"

        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream(
                "POST",
                url,
                json={
                    "model": model,
                    "messages": messages,
                    "stream": True
                }
            ) as response:
                response.raise_for_status()

                async for line in response.aiter_lines():
                    if line:
                        import json
                        data = json.loads(line)
                        if "message" in data and "content" in data["message"]:
                            yield data["message"]["content"]

    async def generate_completion(
        self,
        messages: list[dict],
        model: str = None,
        provider: str = None
    ) -> str:
        """Generate non-streaming completion from AI model"""
        chunks = []
        async for chunk in self.generate_completion_stream(messages, model, provider):
            chunks.append(chunk)
        return "".join(chunks)
