export interface Model {
  id: string;
  name: string;
  description?: string;
  provider: 'openai' | 'ollama' | 'anthropic' | 'custom';
  capabilities: ModelCapability[];
  parameters?: ModelParameters;
  maxTokens?: number;
  contextWindow?: number;
}

export type ModelCapability =
  | 'chat'
  | 'streaming'
  | 'vision'
  | 'function-calling'
  | 'web-search'
  | 'code-execution'
  | 'image-generation';

export interface ModelParameters {
  temperature?: number;
  topP?: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface ModelProvider {
  id: string;
  name: string;
  apiKey?: string;
  baseUrl?: string;
  models: Model[];
}
