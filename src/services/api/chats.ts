import apiClient from './client';
import type { Chat, ChatCreateRequest, ChatUpdateRequest } from './types';

export const chatsApi = {
  /**
   * Get all chats for current user
   */
  getAll: async (): Promise<Chat[]> => {
    const response = await apiClient.get<Chat[]>('/chats');
    return response.data;
  },

  /**
   * Get a specific chat by ID
   */
  getById: async (chatId: string): Promise<Chat> => {
    const response = await apiClient.get<Chat>(`/chats/${chatId}`);
    return response.data;
  },

  /**
   * Create a new chat
   */
  create: async (data: ChatCreateRequest): Promise<Chat> => {
    const response = await apiClient.post<Chat>('/chats', data);
    return response.data;
  },

  /**
   * Update a chat
   */
  update: async (chatId: string, data: ChatUpdateRequest): Promise<Chat> => {
    const response = await apiClient.patch<Chat>(`/chats/${chatId}`, data);
    return response.data;
  },

  /**
   * Delete a chat
   */
  delete: async (chatId: string): Promise<void> => {
    await apiClient.delete(`/chats/${chatId}`);
  },
};
