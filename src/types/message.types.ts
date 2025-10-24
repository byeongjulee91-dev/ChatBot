export interface Message {
  id: string;
  chatId: string;
  parentId: string | null;
  childrenIds: string[];
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  files?: MessageFile[];
  timestamp: number;
  status?: 'pending' | 'streaming' | 'completed' | 'error';
  rating?: 1 | -1;
  citations?: Citation[];
  metadata?: Record<string, any>;
}

export interface MessageFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  preview?: string;
}

export interface Citation {
  id: string;
  source: string;
  title?: string;
  url?: string;
  snippet?: string;
}

export interface MessageHistory {
  [messageId: string]: Message;
}

export interface StreamingMessage {
  id: string;
  content: string;
  done: boolean;
  model?: string;
}
