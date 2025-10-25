import React from 'react';
import { useAuthStore, useChatStore, useUIStore } from '@/store';
import { formatRelativeTime } from '@/utils/format';
import { Button } from '@/components/ui';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { chats, currentChatId, setCurrentChat, createChat, deleteChat } =
    useChatStore();
  const { showSidebar, toggleSidebar } = useUIStore();

  const chatList = Object.values(chats).sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  const handleNewChat = () => {
    createChat();
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('이 대화를 삭제하시겠습니까?')) {
      deleteChat(chatId);
    }
  };

  if (!showSidebar) {
    return (
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-10 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    );
  }

  return (
    <aside className="w-64 bg-gray-50 border-r flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">대화 목록</h2>
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <Button
          onClick={handleNewChat}
          variant="primary"
          className="w-full"
          size="sm"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          새 대화
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {chatList.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            대화 내역이 없습니다
          </div>
        ) : (
          <div className="space-y-1">
            {chatList.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setCurrentChat(chat.id)}
                className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                  currentChatId === chat.id
                    ? 'bg-primary-100 border border-primary-300'
                    : 'hover:bg-gray-100 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-medium truncate ${
                        currentChatId === chat.id
                          ? 'text-primary-900'
                          : 'text-gray-900'
                      }`}
                    >
                      {chat.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatRelativeTime(chat.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                  >
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {chat.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {chat.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-0.5 bg-gray-200 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-white space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.username}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={logout}
          variant="secondary"
          className="w-full"
          size="sm"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          로그아웃
        </Button>

        <div className="text-xs text-gray-500 text-center">
          AI ChatBot v1.0
        </div>
      </div>
    </aside>
  );
};
