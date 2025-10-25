import { useEffect, useState } from 'react';
import { Chat, Sidebar } from '@/components/chat';
import { LoginForm, RegisterForm } from '@/components/auth';
import { useAuthStore, useChatStore, useUIStore } from '@/store';

function App() {
  const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();
  const { currentChatId, createChat } = useChatStore();
  const { showSidebar } = useUIStore();
  const [showRegister, setShowRegister] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 초기 채팅 생성 (인증된 경우에만)
  useEffect(() => {
    if (isAuthenticated && !currentChatId) {
      createChat();
    }
  }, [isAuthenticated, currentChatId, createChat]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login/register
  if (!isAuthenticated) {
    return (
      <>
        {showRegister ? (
          <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </>
    );
  }

  // Authenticated - show chat
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
                환영합니다, {user?.username}님!
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
