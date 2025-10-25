#!/bin/bash

# AI ChatBot Backend 실행 스크립트

# 가상환경 활성화 확인
if [ ! -d "venv" ]; then
    echo "가상환경이 없습니다. 먼저 'python -m venv venv'를 실행하세요."
    exit 1
fi

# 가상환경 활성화
source venv/bin/activate

# 의존성 설치 확인
if [ ! -f "venv/bin/uvicorn" ]; then
    echo "의존성을 설치합니다..."
    pip install -r requirements.txt
fi

# .env 파일 확인
if [ ! -f ".env" ]; then
    echo ".env 파일이 없습니다. .env.example을 복사하여 .env 파일을 생성하세요."
    exit 1
fi

# 서버 실행
echo "서버를 시작합니다..."
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
