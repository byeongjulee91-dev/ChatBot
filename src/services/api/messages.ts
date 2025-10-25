import apiClient from './client';
import type { Message, MessageCreateRequest, MessageUpdateRequest } from './types';

export const messagesApi = {
  /**
   * Get all messages for a chat
   */
  getByChatId: async (chatId: string): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>(`/messages/chat/${chatId}`);
    return response.data;
  },

  /**
   * Create a new message
   */
  create: async (data: MessageCreateRequest): Promise<Message> => {
    const response = await apiClient.post<Message>('/messages', data);
    return response.data;
  },

  /**
   * Update a message
   */
  update: async (messageId: string, data: MessageUpdateRequest): Promise<Message> => {
    const response = await apiClient.patch<Message>(`/messages/${messageId}`, data);
    return response.data;
  },

  /**
   * Generate AI response (streaming)
   * Returns EventSource for Server-Sent Events
   * Note: This is a placeholder. Actual implementation will be in step 3.
   */
  generateStream: (_data: MessageCreateRequest): EventSource => {
    const token = localStorage.getItem('access_token');
    const url = new URL(`${apiClient.defaults.baseURL}/messages/generate`);

    // Add auth token as query param for EventSource (since it doesn't support headers)
    if (token) {
      url.searchParams.append('token', token);
    }

    const eventSource = new EventSource(url.toString());

    return eventSource;
  },
};
