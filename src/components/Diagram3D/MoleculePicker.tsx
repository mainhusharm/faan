import React from 'react';
import { MOLECULE_TEMPLATES } from './types';
import type { MoleculeTemplate } from './types';

interface MoleculePickerProps {
  onSelectMolecule: (molecule: MoleculeTemplate) => void;
  onClose: () => void;
}

export const MoleculePicker: React.FC<MoleculePickerProps> = ({
  onSelectMolecule,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Select a Molecule
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Choose from pre-built molecular structures
          </p>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOLECULE_TEMPLATES.map((molecule) => (
              <button
                key={molecule.name}
                onClick={() => {
                  onSelectMolecule(molecule);
                  onClose();
                }}
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {molecule.name}
                  </h4>
                  <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                    {molecule.formula}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {molecule.description}
                </p>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  {molecule.atoms.length} atoms, {molecule.bonds.length} bonds
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
