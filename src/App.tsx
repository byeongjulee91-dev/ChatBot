import { useEffect } from 'react';
import { Chat, Sidebar } from '@/components/chat';
import { useChatStore, useUIStore } from '@/store';

function App() {
  const { currentChatId, createChat } = useChatStore();
  const { showSidebar } = useUIStore();

  // 초기 채팅 생성
  useEffect(() => {
    if (!currentChatId) {
      createChat();
    }
  }, [currentChatId, createChat]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      {showSidebar && <Sidebar />}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChatId ? (
          <Chat chatId={currentChatId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                AI ChatBot에 오신 것을 환영합니다
              </h2>
              <p className="text-gray-600 mb-6">
                새로운 대화를 시작하여 AI와 대화해보세요
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
