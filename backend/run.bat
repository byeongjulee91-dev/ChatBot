@echo off

REM AI ChatBot Backend 실행 스크립트 (Windows)

REM 가상환경 확인
if not exist "venv\" (
    echo 가상환경이 없습니다. 먼저 'python -m venv venv'를 실행하세요.
    exit /b 1
)

REM 가상환경 활성화
call venv\Scripts\activate

REM 의존성 설치 확인
if not exist "venv\Scripts\uvicorn.exe" (
    echo 의존성을 설치합니다...
    pip install -r requirements.txt
)

REM .env 파일 확인
if not exist ".env" (
    echo .env 파일이 없습니다. .env.example을 복사하여 .env 파일을 생성하세요.
    exit /b 1
)

REM 서버 실행
echo 서버를 시작합니다...
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
