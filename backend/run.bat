@echo off

REM AI ChatBot Backend 실행 스크립트 (uv - Windows)

REM uv 설치 확인
where uv >nul 2>nul
if %errorlevel% neq 0 (
    echo uv가 설치되어 있지 않습니다.
    echo 다음 명령어로 설치하세요:
    echo powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
    exit /b 1
)

REM 가상환경 확인 및 생성
if not exist ".venv\" (
    echo 가상환경을 생성합니다...
    uv venv
)

REM 의존성 설치
echo 의존성을 동기화합니다...
uv pip install -e .

REM .env 파일 확인
if not exist ".env" (
    echo .env 파일이 없습니다. .env.example을 복사하여 .env 파일을 생성하세요.
    echo copy .env.example .env
    exit /b 1
)

REM 서버 실행
echo 서버를 시작합니다...
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
