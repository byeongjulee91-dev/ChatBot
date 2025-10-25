import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Chat, Message, MessageHistory } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { chatsApi } from '@/services/api';

interface ChatState {
  // State
  currentChatId: string | null;
  chats: Record<string, Chat>;
  messages: MessageHistory;
  generating: boolean;

  // Actions
  createChat: (title?: string) => Promise<string>;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  deleteChat: (chatId: string) => void;
  setCurrentChat: (chatId: string | null) => void;

  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;
  getMessagesByChat: (chatId: string) => Message[];

  setGenerating: (generating: boolean) => void;
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set, get) => ({
        currentChatId: null,
        chats: {},
        messages: {},
        generating: false,

        createChat: async (title = '새 대화') => {
          try {
            // Create chat on backend
            const backendChat = await chatsApi.create({ title });

            // Add to local state
            const chat: Chat = {
              id: backendChat.id,
              title: backendChat.title,
              messages: {},
              selectedModels: backendChat.selected_models || ['gpt-4'],
              tags: [],
              createdAt: new Date(backendChat.created_at).getTime(),
              updatedAt: backendChat.updated_at ? new Date(backendChat.updated_at).getTime() : new Date(backendChat.created_at).getTime(),
            };

            set((state) => ({
              chats: { ...state.chats, [chat.id]: chat },
              currentChatId: chat.id,
            }));

            return chat.id;
          } catch (error) {
            console.error('Failed to create chat:', error);
            // Fallback to local creation if backend fails
            const chatId = uuidv4();
            const chat: Chat = {
              id: chatId,
              title,
              messages: {},
              selectedModels: ['gpt-4'],
              tags: [],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };

            set((state) => ({
              chats: { ...state.chats, [chatId]: chat },
              currentChatId: chatId,
            }));

            return chatId;
          }
        },

        updateChat: (chatId, updates) =>
          set((state) => ({
            chats: {
              ...state.chats,
              [chatId]: {
                ...state.chats[chatId],
                ...updates,
                updatedAt: Date.now(),
              },
            },
          })),

        deleteChat: (chatId) =>
          set((state) => {
            const { [chatId]: _, ...rest } = state.chats;
            // 삭제된 채팅의 메시지도 제거
            const newMessages = { ...state.messages };
            Object.keys(newMessages).forEach((msgId) => {
              if (newMessages[msgId].chatId === chatId) {
                delete newMessages[msgId];
              }
            });

            return {
              chats: rest,
              messages: newMessages,
              currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
            };
          }),

        setCurrentChat: (chatId) => set({ currentChatId: chatId }),

        addMessage: (message) =>
          set((state) => ({
            messages: {
              ...state.messages,
              [message.id]: message,
            },
          })),

        updateMessage: (messageId, updates) =>
          set((state) => ({
            messages: {
              ...state.messages,
              [messageId]: {
                ...state.messages[messageId],
                ...updates,
              },
            },
          })),

        deleteMessage: (messageId) =>
          set((state) => {
            const { [messageId]: _, ...rest } = state.messages;
            return { messages: rest };
          }),

        getMessagesByChat: (chatId) => {
          const messages = get().messages;
          return Object.values(messages)
            .filter((msg) => msg.chatId === chatId)
            .sort((a, b) => a.timestamp - b.timestamp);
        },

        setGenerating: (generating) => set({ generating }),

        clearHistory: () =>
          set({
            chats: {},
            messages: {},
            currentChatId: null,
          }),
      }),
      {
        name: 'chat-storage',
        partialize: (state) => ({
          chats: state.chats,
          messages: state.messages,
          currentChatId: state.currentChatId,
        }),
      }
    )
  )
);
