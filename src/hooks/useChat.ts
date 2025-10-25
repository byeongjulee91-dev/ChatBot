import { useCallback } from 'react';
import { useChatStore } from '@/store';
import { Message } from '@/types';
import { messagesApi } from '@/services/api';
import { v4 as uuidv4 } from 'uuid';

export function useChat(chatId: string) {
  const {
    messages,
    generating,
    addMessage,
    updateMessage,
    setGenerating,
    getMessagesByChat,
  } = useChatStore();

  // 현재 채팅의 메시지 가져오기
  const chatMessages = getMessagesByChat(chatId);

  // 메시지 전송 (실제 API)
  const sendMessage = useCallback(
    async (content: string, files?: File[]) => {
      if (!content.trim() && (!files || files.length === 0)) return;

      setGenerating(true);

      try {
        // Prepare file data if any
        const fileData = files?.map((file) => ({
          id: uuidv4(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: '', // TODO: Upload files to server first
        }));

        const lastMessage = chatMessages[chatMessages.length - 1];

        // Create user message locally (will be created on backend too)
        const userMessageId = uuidv4();
        const userMessage: Message = {
          id: userMessageId,
          chatId,
          parentId: lastMessage?.id || null,
          childrenIds: [],
          role: 'user',
          content,
          timestamp: Date.now(),
          status: 'completed',
          files: fileData,
        };

        addMessage(userMessage);

        // Update parent message's children
        if (lastMessage) {
          updateMessage(lastMessage.id, {
            childrenIds: [...lastMessage.childrenIds, userMessageId],
          });
        }

        // Create placeholder assistant message
        const aiMessageId = uuidv4();
        const aiMessage: Message = {
          id: aiMessageId,
          chatId,
          parentId: userMessageId,
          childrenIds: [],
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          status: 'streaming',
        };

        addMessage(aiMessage);
        updateMessage(userMessageId, {
          childrenIds: [aiMessageId],
        });

        // Call backend streaming API
        let streamedContent = '';

        await messagesApi.generateStream(
          {
            chat_id: chatId,
            parent_id: lastMessage?.id || undefined,
            content,
            role: 'user',
            files: fileData,
          },
          // onChunk
          (chunk: string, messageId: string) => {
            streamedContent += chunk;
            updateMessage(aiMessageId, {
              id: messageId, // Update with backend message ID
              content: streamedContent,
              status: 'streaming',
            });
          },
          // onComplete
          (messageId: string) => {
            updateMessage(aiMessageId, {
              id: messageId,
              status: 'completed',
            });
            setGenerating(false);
          },
          // onError
          (error: string) => {
            updateMessage(aiMessageId, {
              content: `Error: ${error}`,
              status: 'error',
            });
            setGenerating(false);
          }
        );
      } catch (error: any) {
        console.error('Failed to send message:', error);
        setGenerating(false);
      }
    },
    [chatId, chatMessages, addMessage, updateMessage, setGenerating]
  );

  // 메시지 재생성
  const regenerateMessage = useCallback(
    async (messageId: string) => {
      const message = messages[messageId];
      if (!message || message.role !== 'assistant') return;

      const parentMessage = message.parentId ? messages[message.parentId] : null;
      if (!parentMessage) return;

      setGenerating(true);

      // 메시지 내용 초기화
      updateMessage(messageId, {
        content: '',
        status: 'streaming',
      });

      try {
        // Call backend streaming API for regeneration
        let streamedContent = '';

        await messagesApi.generateStream(
          {
            chat_id: chatId,
            parent_id: parentMessage.parentId || undefined,
            content: parentMessage.content,
            role: 'user',
          },
          // onChunk
          (chunk: string, backendMessageId: string) => {
            streamedContent += chunk;
            updateMessage(messageId, {
              id: backendMessageId,
              content: streamedContent,
              status: 'streaming',
            });
          },
          // onComplete
          (backendMessageId: string) => {
            updateMessage(messageId, {
              id: backendMessageId,
              status: 'completed',
            });
            setGenerating(false);
          },
          // onError
          (error: string) => {
            updateMessage(messageId, {
              content: `Error: ${error}`,
              status: 'error',
            });
            setGenerating(false);
          }
        );
      } catch (error: any) {
        console.error('Failed to regenerate message:', error);
        updateMessage(messageId, {
          content: `Error: ${error.message || 'Failed to regenerate'}`,
          status: 'error',
        });
        setGenerating(false);
      }
    },
    [chatId, messages, updateMessage, setGenerating]
  );

  // 메시지 편집
  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      const message = messages[messageId];
      if (!message) return;

      // 메시지 내용 업데이트
      updateMessage(messageId, {
        content: newContent,
      });

      // User 메시지 편집 시 다음 assistant 메시지 재생성
      if (message.role === 'user' && message.childrenIds.length > 0) {
        const assistantMessageId = message.childrenIds[0];
        const assistantMessage = messages[assistantMessageId];

        if (assistantMessage && assistantMessage.role === 'assistant') {
          setGenerating(true);

          // 메시지 내용 초기화
          updateMessage(assistantMessageId, {
            content: '',
            status: 'streaming',
          });

          try {
            // Call backend streaming API for regeneration with edited content
            let streamedContent = '';

            await messagesApi.generateStream(
              {
                chat_id: chatId,
                parent_id: message.parentId || undefined,
                content: newContent,
                role: 'user',
              },
              // onChunk
              (chunk: string, backendMessageId: string) => {
                streamedContent += chunk;
                updateMessage(assistantMessageId, {
                  id: backendMessageId,
                  content: streamedContent,
                  status: 'streaming',
                });
              },
              // onComplete
              (backendMessageId: string) => {
                updateMessage(assistantMessageId, {
                  id: backendMessageId,
                  status: 'completed',
                });
                setGenerating(false);
              },
              // onError
              (error: string) => {
                updateMessage(assistantMessageId, {
                  content: `Error: ${error}`,
                  status: 'error',
                });
                setGenerating(false);
              }
            );
          } catch (error: any) {
            console.error('Failed to regenerate message after edit:', error);
            updateMessage(assistantMessageId, {
              content: `Error: ${error.message || 'Failed to regenerate'}`,
              status: 'error',
            });
            setGenerating(false);
          }
        }
      }
    },
    [chatId, messages, updateMessage, setGenerating]
  );

  return {
    messages: chatMessages,
    generating,
    sendMessage,
    regenerateMessage,
    editMessage,
  };
}
