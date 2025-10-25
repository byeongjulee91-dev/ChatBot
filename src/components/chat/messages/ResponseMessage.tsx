import React, { useState } from 'react';
import { Message } from '@/types';
import { MarkdownRenderer } from '@/components/markdown';
import { formatDate } from '@/utils/format';
import { Tooltip } from '@/components/ui';
import { useChatStore } from '@/store';

interface ResponseMessageProps {
  message: Message;
  onRegenerate?: () => void;
}

export const ResponseMessage: React.FC<ResponseMessageProps> = ({
  message,
  onRegenerate,
}) => {
  const [showActions, setShowActions] = useState(false);
  const updateMessage = useChatStore((state) => state.updateMessage);

  const handleRating = (rating: 1 | -1) => {
    updateMessage(message.id, {
      rating: message.rating === rating ? undefined : rating,
    });
  };

  return (
    <div
      className="flex justify-start mb-4"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-3 max-w-[80%]">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            {message.status === 'streaming' && message.content === '' ? (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                </div>
                <span className="text-sm">응답 생성 중...</span>
              </div>
            ) : (
              <div className="text-sm text-gray-900">
                <MarkdownRenderer content={message.content} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Tooltip content={formatDate(message.timestamp)} position="right">
              <span className="text-xs text-gray-500 cursor-default">
                {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </Tooltip>

            {message.model && (
              <span className="text-xs text-gray-400">· {message.model}</span>
            )}

            {(showActions || message.rating) && message.status === 'completed' && (
              <div className="flex items-center gap-1 ml-2">
                <Tooltip content="좋아요">
                  <button
                    onClick={() => handleRating(1)}
                    className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                      message.rating === 1 ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  </button>
                </Tooltip>

                <Tooltip content="싫어요">
                  <button
                    onClick={() => handleRating(-1)}
                    className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                      message.rating === -1 ? 'text-red-600' : 'text-gray-400'
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                    </svg>
                  </button>
                </Tooltip>

                {onRegenerate && (
                  <Tooltip content="재생성">
                    <button
                      onClick={onRegenerate}
                      className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  </Tooltip>
                )}

                <Tooltip content="복사">
                  <button
                    onClick={() => navigator.clipboard.writeText(message.content)}
                    className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
