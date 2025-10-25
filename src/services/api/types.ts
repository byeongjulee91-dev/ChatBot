// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at?: string;
}

// Chat Types
export interface Chat {
  id: string;
  user_id: string;
  title: string;
  selected_models: string[];
  created_at: string;
  updated_at?: string;
}

export interface ChatCreateRequest {
  title?: string;
  selected_models?: string[];
}

export interface ChatUpdateRequest {
  title?: string;
  selected_models?: string[];
}

// Message Types
export interface MessageFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Message {
  id: string;
  chat_id: string;
  parent_id: string | null;
  children_ids: string[];
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  files?: MessageFile[];
  timestamp: string;
  status: 'pending' | 'streaming' | 'completed' | 'error';
  rating?: number;
  citations?: any[];
  message_metadata?: Record<string, any>;
}

export interface MessageCreateRequest {
  chat_id: string;
  parent_id?: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  model?: string;
  files?: MessageFile[];
}

export interface MessageUpdateRequest {
  content?: string;
  rating?: number;
  status?: 'pending' | 'streaming' | 'completed' | 'error';
}

// API Error Response
export interface ApiError {
  detail: string;
}
