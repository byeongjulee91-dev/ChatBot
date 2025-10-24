# AI ChatBot - React + TypeScript + Tailwind CSS

React, TypeScript, Tailwind CSS를 사용하여 만든 AI 챗봇 서비스입니다. open-webui의 Svelte 기반 채팅 컴포넌트를 React로 리팩토링하여 구현했습니다.

## 주요 기능

### 채팅 기능
- 실시간 메시지 송수신 (시뮬레이션)
- 스트리밍 응답 표시
- 메시지 히스토리 관리
- 메시지 평가 (좋아요/싫어요)
- 응답 재생성
- 메시지 복사

### 멀티 모델 지원
- 여러 AI 모델 선택 가능
- GPT-4, GPT-3.5 Turbo, Claude 3 Opus 등
- 모델별 설정 및 능력 표시

### UI/UX
- 반응형 디자인
- 다크/라이트 모드 지원 (계획)
- 사이드바 토글
- 마크다운 렌더링
- 코드 하이라이팅
- 파일 첨부 (UI 구현)

### 데이터 관리
- Zustand를 사용한 상태 관리
- LocalStorage 기반 영구 저장
- 채팅 히스토리 관리
- 대화 생성/삭제

## 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Zustand** - 상태 관리
- **React Markdown** - 마크다운 렌더링
- **React Syntax Highlighter** - 코드 하이라이팅

## 프로젝트 구조

```
src/
├── components/           # React 컴포넌트
│   ├── chat/            # 채팅 관련 컴포넌트
│   │   ├── messages/    # 메시지 컴포넌트
│   │   ├── input/       # 입력 컴포넌트
│   │   ├── model/       # 모델 선택 컴포넌트
│   │   ├── Chat.tsx     # 메인 채팅 컨테이너
│   │   └── Sidebar.tsx  # 사이드바
│   ├── ui/              # 재사용 가능한 UI 컴포넌트
│   └── markdown/        # 마크다운 렌더러
├── hooks/               # 커스텀 훅
├── store/               # Zustand 스토어
├── types/               # TypeScript 타입 정의
├── utils/               # 유틸리티 함수
├── App.tsx              # 메인 앱 컴포넌트
└── main.tsx             # 엔트리 포인트
```

## 설치 및 실행

### 필수 요구사항
- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 프리뷰

```bash
npm run preview
```

## 주요 컴포넌트

### Chat
메인 채팅 컨테이너로, 메시지 리스트와 입력 필드를 포함합니다.

### MessageList
메시지 목록을 렌더링하며, 사용자 메시지와 AI 응답을 구분하여 표시합니다.

### MessageInput
메시지 입력 필드로, 텍스트 입력, 파일 첨부, 전송 기능을 제공합니다.

### ModelSelector
AI 모델 선택 UI로, 여러 모델 중에서 사용할 모델을 선택할 수 있습니다.

### Sidebar
대화 목록을 표시하고 새 대화를 시작할 수 있는 사이드바입니다.

## 상태 관리

### ChatStore
- 현재 채팅 ID
- 채팅 목록
- 메시지 히스토리
- 생성 중 상태

### ModelStore
- 사용 가능한 모델 목록
- 선택된 모델

### UIStore
- 사이드바 표시 여부
- 테마 설정
- 메시지 레이아웃

## 커스터마이징

### 모델 추가
`src/store/modelStore.ts`의 `defaultModels` 배열에 새 모델을 추가할 수 있습니다.

```typescript
const newModel: Model = {
  id: 'new-model',
  name: 'New Model',
  description: '새 모델 설명',
  provider: 'custom',
  capabilities: ['chat', 'streaming'],
};
```

### 테마 수정
`tailwind.config.js`에서 색상과 테마를 수정할 수 있습니다.

### AI 백엔드 연결
현재는 시뮬레이션된 응답을 사용합니다. 실제 AI API를 연결하려면:

1. `src/services/` 폴더에 API 클라이언트 생성
2. `src/hooks/useChat.ts`의 `sendMessage` 함수 수정
3. 실제 API 엔드포인트로 요청 전송

예시:
```typescript
// src/services/api.ts
export async function sendChatMessage(content: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return response.json();
}
```

## 향후 계획

- [ ] 실제 AI API 통합 (OpenAI, Anthropic 등)
- [ ] Socket.IO 기반 실시간 스트리밍
- [ ] 이미지 업로드 및 비전 모델 지원
- [ ] 음성 입력/출력 (TTS/STT)
- [ ] 코드 실행 기능
- [ ] 채팅 검색 기능
- [ ] 채팅 내보내기 (JSON, Markdown)
- [ ] 다국어 지원
- [ ] 다크 모드 완전 구현
- [ ] 모바일 최적화

## 라이선스

MIT License

## 기여

버그 리포트, 기능 제안, PR을 환영합니다!

## 참고

이 프로젝트는 [open-webui](https://github.com/open-webui/open-webui)의 Svelte 기반 채팅 컴포넌트를 참고하여 React로 리팩토링했습니다.