import { useCallback } from 'react';
import { useChatStore } from '@/store';
import { Message } from '@/types';
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

  // 메시지 전송 (시뮬레이션)
  const sendMessage = useCallback(
    async (content: string, files?: File[]) => {
      if (!content.trim() && (!files || files.length === 0)) return;

      // 사용자 메시지 추가
      const userMessageId = uuidv4();
      const lastMessage = chatMessages[chatMessages.length - 1];

      const userMessage: Message = {
        id: userMessageId,
        chatId,
        parentId: lastMessage?.id || null,
        childrenIds: [],
        role: 'user',
        content,
        timestamp: Date.now(),
        status: 'completed',
      };

      addMessage(userMessage);

      // AI 응답 시뮬레이션
      setGenerating(true);

      // AI 메시지 생성
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

      // 부모 메시지의 자식으로 추가
      if (lastMessage) {
        updateMessage(lastMessage.id, {
          childrenIds: [...lastMessage.childrenIds, userMessageId],
        });
      }
      updateMessage(userMessageId, {
        childrenIds: [aiMessageId],
      });

      addMessage(aiMessage);

      // 스트리밍 시뮬레이션
      const responseText = `안녕하세요! 귀하의 메시지 "${content}"를 받았습니다. 이것은 시뮬레이션된 응답입니다. 실제 AI 백엔드를 연결하면 실제 응답을 받을 수 있습니다.`;

      let currentContent = '';
      const words = responseText.split(' ');

      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        currentContent += (i > 0 ? ' ' : '') + words[i];
        updateMessage(aiMessageId, {
          content: currentContent,
          status: i === words.length - 1 ? 'completed' : 'streaming',
        });
      }

      setGenerating(false);
    },
    [chatId, chatMessages, addMessage, updateMessage, setGenerating]
  );

  // 메시지 재생성
  const regenerateMessage = useCallback(
    async (messageId: string) => {
      const message = messages[messageId];
      if (!message || message.role !== 'assistant') return;

      setGenerating(true);

      // 메시지 내용 초기화
      updateMessage(messageId, {
        content: '',
        status: 'streaming',
      });

      // 재생성 시뮬레이션
      const responseText = '재생성된 응답입니다. 실제 AI 백엔드를 연결하면 다른 응답을 받을 수 있습니다.';
      let currentContent = '';
      const words = responseText.split(' ');

      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        currentContent += (i > 0 ? ' ' : '') + words[i];
        updateMessage(messageId, {
          content: currentContent,
          status: i === words.length - 1 ? 'completed' : 'streaming',
        });
      }

      setGenerating(false);
    },
    [messages, updateMessage, setGenerating]
  );

  // 메시지 편집
  const editMessage = useCallback(
    (messageId: string, newContent: string) => {
      const message = messages[messageId];
      if (!message) return;

      // 메시지 내용 업데이트
      updateMessage(messageId, {
        content: newContent,
      });
    },
    [messages, updateMessage]
  );

  return {
    messages: chatMessages,
    generating,
    sendMessage,
    regenerateMessage,
    editMessage,
  };
}
