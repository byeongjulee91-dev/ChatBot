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
   * Uses fetch API with ReadableStream for SSE
   */
  generateStream: async (
    data: MessageCreateRequest,
    onChunk: (chunk: string, messageId: string) => void,
    onComplete: (messageId: string) => void,
    onError: (error: string) => void
  ): Promise<void> => {
    const token = localStorage.getItem('access_token');
    const url = `${apiClient.defaults.baseURL}/messages/generate`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.substring(6));

              if (jsonData.chunk) {
                onChunk(jsonData.chunk, jsonData.message_id);
              }

              if (jsonData.done) {
                onComplete(jsonData.message_id);
              }

              if (jsonData.error) {
                onError(jsonData.error);
              }
            } catch (e) {
              // Skip invalid JSON
              console.warn('Failed to parse SSE data:', line);
            }
          }
        }
      }
    } catch (error: any) {
      onError(error.message || 'Streaming failed');
    }
  },
};
