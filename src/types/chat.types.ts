import { MessageHistory } from './message.types';

export interface Chat {
  id: string;
  title: string;
  messages: MessageHistory;
  selectedModels: string[];
  folderId?: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  archived?: boolean;
  pinned?: boolean;
}

export interface ChatFolder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: number;
}

export interface ChatSettings {
  systemPrompt?: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  streamResponse?: boolean;
}
