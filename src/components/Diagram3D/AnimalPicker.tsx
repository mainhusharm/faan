import React from 'react';
import { X } from 'lucide-react';
import type { AnimalTemplate } from './types';
import { ANIMAL_TEMPLATES } from './types';

interface AnimalPickerProps {
  onSelectAnimal: (animal: AnimalTemplate) => void;
  onClose: () => void;
}

export const AnimalPicker: React.FC<AnimalPickerProps> = ({
  onSelectAnimal,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Select an Animal
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ANIMAL_TEMPLATES.map((animal) => (
            <button
              key={animal.name}
              onClick={() => {
                onSelectAnimal(animal);
                onClose();
              }}
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-left group"
            >
              <div className="text-3xl mb-2">{animal.displayName.split(' ')[0]}</div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                {animal.displayName.split(' ')[1]}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {animal.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
