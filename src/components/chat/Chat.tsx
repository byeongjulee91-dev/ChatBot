import React, { useEffect } from 'react';
import { useChatStore } from '@/store';
import { useChat } from '@/hooks';
import { MessageList } from './messages';
import { MessageInput } from './input';
import { ModelSelector } from './model';

interface ChatProps {
  chatId: string;
}

export const Chat: React.FC<ChatProps> = ({ chatId }) => {
  const { messages, generating, sendMessage, regenerateMessage, editMessage } = useChat(chatId);
  const { chats, updateChat } = useChatStore();
  const chat = chats[chatId];

  // 첫 메시지가 추가되면 제목 자동 생성
  useEffect(() => {
    if (messages.length === 1 && chat.title === '새 대화') {
      const firstMessage = messages[0];
      const title = firstMessage.content.slice(0, 50) + (firstMessage.content.length > 50 ? '...' : '');
      updateChat(chatId, { title });
    }
  }, [messages, chat, chatId, updateChat]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    await sendMessage(content, files);
  };

  const handleRegenerate = async (messageId: string) => {
    await regenerateMessage(messageId);
  };

  const handleEdit = (messageId: string, newContent: string) => {
    editMessage(messageId, newContent);
  };

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">채팅을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{chat.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {messages.length}개의 메시지
            </p>
          </div>
          <ModelSelector
            selectedModels={chat.selectedModels}
            onChange={(models) => updateChat(chatId, { selectedModels: models })}
          />
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <MessageList
            messages={messages}
            onRegenerate={handleRegenerate}
            onEdit={handleEdit}
          />
        </div>
      </main>

      {/* Input */}
      <footer className="border-t">
        <div className="max-w-4xl mx-auto">
          <MessageInput
            onSend={handleSendMessage}
            disabled={generating}
          />
        </div>
      </footer>
    </div>
  );
};
