#!/bin/bash

# AI ChatBot Backend 실행 스크립트 (uv)

# uv 설치 확인
if ! command -v uv &> /dev/null; then
    echo "uv가 설치되어 있지 않습니다."
    echo "다음 명령어로 설치하세요:"
    echo "curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# 가상환경 확인 및 생성
if [ ! -d ".venv" ]; then
    echo "가상환경을 생성합니다..."
    uv venv
fi

# 의존성 설치
echo "의존성을 동기화합니다..."
uv pip install -e .

# .env 파일 확인
if [ ! -f ".env" ]; then
    echo ".env 파일이 없습니다. .env.example을 복사하여 .env 파일을 생성하세요."
    echo "cp .env.example .env"
    exit 1
fi

# 서버 실행
echo "서버를 시작합니다..."
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
