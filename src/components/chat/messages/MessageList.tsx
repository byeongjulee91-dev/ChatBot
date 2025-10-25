import React from 'react';
import { Message } from '@/types';
import { UserMessage } from './UserMessage';
import { ResponseMessage } from './ResponseMessage';
import { useAutoScroll } from '@/hooks';

interface MessageListProps {
  messages: Message[];
  onRegenerate?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onRegenerate,
  onEdit,
}) => {
  const scrollRef = useAutoScroll([messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary-600"
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            새로운 대화를 시작하세요
          </h3>
          <p className="text-sm text-gray-500">
            아래에 메시지를 입력하여 AI와 대화를 시작하세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {messages.map((message) => {
        if (message.role === 'user') {
          return (
            <UserMessage
              key={message.id}
              message={message}
              onEdit={onEdit}
            />
          );
        } else if (message.role === 'assistant') {
          return (
            <ResponseMessage
              key={message.id}
              message={message}
              onRegenerate={
                onRegenerate ? () => onRegenerate(message.id) : undefined
              }
              onEdit={onEdit}
            />
          );
        }
        return null;
      })}
      <div ref={scrollRef} />
    </div>
  );
};
