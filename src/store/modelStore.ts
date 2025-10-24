import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Model } from '@/types';

interface ModelState {
  models: Model[];
  selectedModels: string[];
  loading: boolean;

  setModels: (models: Model[]) => void;
  addModel: (model: Model) => void;
  removeModel: (modelId: string) => void;
  setSelectedModels: (modelIds: string[]) => void;
  toggleModelSelection: (modelId: string) => void;
  setLoading: (loading: boolean) => void;
}

// 기본 모델 데이터
const defaultModels: Model[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'OpenAI의 가장 강력한 모델',
    provider: 'openai',
    capabilities: ['chat', 'streaming', 'vision', 'function-calling'],
    maxTokens: 8192,
    contextWindow: 128000,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: '빠르고 효율적인 모델',
    provider: 'openai',
    capabilities: ['chat', 'streaming', 'function-calling'],
    maxTokens: 4096,
    contextWindow: 16385,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Anthropic의 최고 성능 모델',
    provider: 'anthropic',
    capabilities: ['chat', 'streaming', 'vision'],
    maxTokens: 4096,
    contextWindow: 200000,
  },
];

export const useModelStore = create<ModelState>()(
  devtools((set) => ({
    models: defaultModels,
    selectedModels: ['gpt-4'],
    loading: false,

    setModels: (models) => set({ models }),

    addModel: (model) =>
      set((state) => ({
        models: [...state.models, model],
      })),

    removeModel: (modelId) =>
      set((state) => ({
        models: state.models.filter((m) => m.id !== modelId),
        selectedModels: state.selectedModels.filter((id) => id !== modelId),
      })),

    setSelectedModels: (modelIds) => set({ selectedModels: modelIds }),

    toggleModelSelection: (modelId) =>
      set((state) => {
        const isSelected = state.selectedModels.includes(modelId);
        if (isSelected) {
          // 최소 1개는 선택되어야 함
          if (state.selectedModels.length === 1) return state;
          return {
            selectedModels: state.selectedModels.filter((id) => id !== modelId),
          };
        } else {
          return {
            selectedModels: [...state.selectedModels, modelId],
          };
        }
      }),

    setLoading: (loading) => set({ loading }),
  }))
);
