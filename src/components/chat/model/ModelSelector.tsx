import React, { useState } from 'react';
import { useModelStore } from '@/store';
import { Button, Modal } from '@/components/ui';

interface ModelSelectorProps {
  selectedModels: string[];
  onChange: (modelIds: string[]) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModels,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { models } = useModelStore();

  const selectedModelObjects = models.filter((m) =>
    selectedModels.includes(m.id)
  );

  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      // 최소 1개는 선택되어야 함
      if (selectedModels.length === 1) return;
      onChange(selectedModels.filter((id) => id !== modelId));
    } else {
      onChange([...selectedModels, modelId]);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">모델:</span>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span className="text-sm font-medium">
            {selectedModelObjects.map((m) => m.name).join(', ')}
          </span>
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="모델 선택">
        <div className="space-y-3">
          {models.map((model) => {
            const isSelected = selectedModels.includes(model.id);
            return (
              <div
                key={model.id}
                onClick={() => toggleModel(model.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{model.name}</h3>
                      <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">
                        {model.provider}
                      </span>
                    </div>
                    {model.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {model.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {model.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setIsOpen(false)}>완료</Button>
        </div>
      </Modal>
    </>
  );
};
