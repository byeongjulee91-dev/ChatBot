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
- **uv**: 빠른 Python 패키지 관리자

## 설치

### 1. uv 설치

uv를 사용하여 빠르게 의존성을 관리합니다.

```bash
# Linux/Mac
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 2. 프로젝트 설정

```bash
cd backend

# 가상환경 생성 (.venv)
uv venv

# 의존성 설치
uv pip install -e .
```

### 3. 환경변수 설정

`.env.example`을 복사하여 `.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

**중요:** `.env` 파일에는 모든 필수 환경 변수가 포함되어 있어야 합니다.

#### 필수 설정 항목

**Application (애플리케이션 설정)**
```env
APP_NAME="AI ChatBot API"
DEBUG=True
API_V1_PREFIX="/api/v1"
```

**Database (데이터베이스 설정)**
```env
# SQLite (기본값)
DATABASE_URL="sqlite+aiosqlite:///./chatbot.db"

# PostgreSQL 사용 시
# DATABASE_URL="postgresql+asyncpg://user:password@localhost/chatbot"
```

**Security (보안 설정)**
```env
SECRET_KEY="your-secret-key-here-change-in-production-PLEASE-CHANGE-THIS"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**CORS (CORS 설정)**
```env
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

**AI Model Configuration (AI 모델 설정)**
```env
# OpenAI 설정 (OpenAI 사용 시)
OPENAI_API_KEY=""                    # OpenAI API 키 (사용 시 입력)
OPENAI_MODEL="gpt-3.5-turbo"

# Ollama 설정 (로컬 LLM 사용 시)
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama2"

# 기본 AI 제공자 선택: "openai" 또는 "ollama"
DEFAULT_AI_PROVIDER="ollama"
```

**File Upload (파일 업로드 설정)**
```env
MAX_UPLOAD_SIZE=10485760             # 10MB
UPLOAD_DIR="./uploads"
```

**Redis (Redis 설정 - 선택사항)**
```env
REDIS_URL="redis://localhost:6379/0"
ENABLE_REDIS=False
```

#### Ollama 설정 (로컬 LLM 사용)

1. **Ollama 설치**
   ```bash
   # Linux/Mac
   curl https://ollama.ai/install.sh | sh

   # 또는 https://ollama.ai 에서 다운로드
   ```

2. **모델 다운로드**
   ```bash
   # Llama 2 모델 다운로드 (권장)
   ollama pull llama2

   # 다른 모델들
   ollama pull mistral      # Mistral 7B
   ollama pull mixtral      # Mixtral 8x7B
   ollama pull phi          # Microsoft Phi-2
   ```

3. **Ollama 서버 실행**
   ```bash
   ollama serve
   ```

4. **.env 설정**
   ```env
   OLLAMA_BASE_URL="http://localhost:11434"
   OLLAMA_MODEL="llama2"
   DEFAULT_AI_PROVIDER="ollama"
   OPENAI_API_KEY=""                # 비워두기
   ```

#### OpenAI 설정

1. **API 키 발급**
   - https://platform.openai.com/api-keys 에서 API 키 생성

2. **.env 설정**
   ```env
   OPENAI_API_KEY="sk-proj-..."
   OPENAI_MODEL="gpt-3.5-turbo"     # 또는 gpt-4
   DEFAULT_AI_PROVIDER="openai"
   ```

### 4. 데이터베이스 초기화

서버를 처음 실행하면 자동으로 데이터베이스 테이블이 생성됩니다.

## 실행

### 개발 모드 (권장)

**방법 1: 실행 스크립트 사용 (가장 간단)**

```bash
# Linux/Mac
./run.sh

# Windows
run.bat
```

실행 스크립트는 자동으로:
- uv 설치 확인
- 가상환경 생성 (없는 경우)
- 의존성 설치
- .env 파일 확인
- 서버 시작

**방법 2: uv run 직접 사용**

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**방법 3: 가상환경 활성화 후 실행**

```bash
# 가상환경 활성화
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 프로덕션 모드

```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
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
├── pyproject.toml           # 프로젝트 설정 및 의존성
├── requirements.txt         # (레거시 - pyproject.toml 사용 권장)
├── .env.example
├── run.sh                   # Linux/Mac 실행 스크립트
├── run.bat                  # Windows 실행 스크립트
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

### 개발 도구 설치

pyproject.toml에 정의된 개발 도구를 설치합니다:

```bash
uv pip install -e ".[dev]"
```

### 코드 포맷팅

```bash
# Black (코드 포맷터)
uv run black app/

# isort (import 정렬)
uv run isort app/

# Ruff (빠른 린터)
uv run ruff check app/
```

### 테스트

```bash
# 테스트 실행
uv run pytest

# 커버리지와 함께 실행
uv run pytest --cov=app
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
