# AI ChatBot Backend

FastAPI 기반 AI 챗봇 백엔드 서버

## 기능

- ✅ JWT 기반 인증 시스템
- ✅ 사용자 관리 (회원가입, 로그인)
- ✅ 채팅 세션 관리
- ✅ 메시지 저장 및 관리
- ✅ AI 모델 통합 (OpenAI, Ollama)
- ✅ 스트리밍 응답 지원
- ✅ SQLAlchemy를 통한 데이터베이스 지원
- ✅ CORS 설정

## 기술 스택

- **FastAPI**: 고성능 웹 프레임워크
- **SQLAlchemy**: ORM 및 데이터베이스 관리
- **Pydantic**: 데이터 검증
- **JWT**: 인증 토큰
- **OpenAI API**: GPT 모델 통합
- **Ollama**: 로컬 LLM 지원

## 설치

### 1. 가상환경 생성 및 활성화

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. 환경변수 설정

`.env.example`을 복사하여 `.env` 파일을 생성하고 필요한 값을 설정합니다:

```bash
cp .env.example .env
```

`.env` 파일 수정:

```env
# 필수: SECRET_KEY 변경
SECRET_KEY="your-secret-key-here-change-in-production"

# OpenAI 사용 시
OPENAI_API_KEY="sk-..."
DEFAULT_AI_PROVIDER="openai"

# Ollama 사용 시
OLLAMA_BASE_URL="http://localhost:11434"
DEFAULT_AI_PROVIDER="ollama"
```

### 4. 데이터베이스 초기화

서버를 처음 실행하면 자동으로 데이터베이스 테이블이 생성됩니다.

## 실행

### 개발 모드

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

또는:

```bash
python app/main.py
```

### 프로덕션 모드

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

서버가 실행되면 다음 주소로 접속할 수 있습니다:

- API: http://localhost:8000
- Swagger 문서: http://localhost:8000/docs
- ReDoc 문서: http://localhost:8000/redoc

## API 엔드포인트

### 인증 (Authentication)

- `POST /api/v1/auth/register` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `GET /api/v1/auth/me` - 현재 사용자 정보

### 채팅 (Chats)

- `POST /api/v1/chats` - 새 채팅 생성
- `GET /api/v1/chats` - 채팅 목록 조회
- `GET /api/v1/chats/{chat_id}` - 특정 채팅 조회
- `PATCH /api/v1/chats/{chat_id}` - 채팅 수정
- `DELETE /api/v1/chats/{chat_id}` - 채팅 삭제

### 메시지 (Messages)

- `POST /api/v1/messages` - 메시지 생성
- `GET /api/v1/messages/chat/{chat_id}` - 채팅의 메시지 목록
- `PATCH /api/v1/messages/{message_id}` - 메시지 수정
- `POST /api/v1/messages/generate` - AI 응답 생성 (스트리밍)

## 프로젝트 구조

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 애플리케이션 진입점
│   ├── config.py            # 설정 관리
│   ├── database.py          # 데이터베이스 연결
│   ├── models/              # SQLAlchemy 모델
│   │   ├── user.py
│   │   ├── chat.py
│   │   └── message.py
│   ├── schemas/             # Pydantic 스키마
│   │   ├── user.py
│   │   ├── chat.py
│   │   └── message.py
│   ├── routers/             # API 라우터
│   │   ├── auth.py
│   │   ├── chats.py
│   │   └── messages.py
│   ├── services/            # 비즈니스 로직
│   │   ├── auth.py
│   │   └── ai.py
│   └── utils/               # 유틸리티
│       └── security.py
├── requirements.txt
├── .env.example
└── README.md
```

## 데이터베이스

기본적으로 SQLite를 사용하지만, PostgreSQL이나 MySQL로 변경할 수 있습니다.

### PostgreSQL 사용

```env
DATABASE_URL="postgresql+asyncpg://user:password@localhost/chatbot"
```

### MySQL 사용

```env
DATABASE_URL="mysql+aiomysql://user:password@localhost/chatbot"
```

## 개발

### 코드 포맷팅

```bash
pip install black isort
black app/
isort app/
```

### 테스트

```bash
pip install pytest pytest-asyncio httpx
pytest
```

## 배포

### Docker 사용 (예정)

```bash
docker build -t chatbot-backend .
docker run -p 8000:8000 --env-file .env chatbot-backend
```

## 문제 해결

### OpenAI API 키 오류

- `.env` 파일에 유효한 `OPENAI_API_KEY`가 설정되어 있는지 확인하세요.

### Ollama 연결 오류

- Ollama가 실행 중인지 확인: `ollama serve`
- `OLLAMA_BASE_URL`이 올바른지 확인하세요.

### 데이터베이스 오류

- 데이터베이스 파일 권한 확인
- `DATABASE_URL`이 올바른지 확인

## 라이선스

MIT
