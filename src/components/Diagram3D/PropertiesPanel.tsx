import React from 'react';
import { Trash2, Copy } from 'lucide-react';
import type { Object3DData, MaterialType } from './types';

interface PropertiesPanelProps {
  selectedObject: Object3DData | null;
  onUpdateObject: (updates: Partial<Object3DData>) => void;
  onDuplicateObject: () => void;
  onDeleteObject: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedObject,
  onUpdateObject,
  onDuplicateObject,
  onDeleteObject,
}) => {
  if (!selectedObject) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Select an object to edit its properties
      </div>
    );
  }

  const materialTypes: MaterialType[] = ['standard', 'phong', 'basic', 'wireframe', 'glass', 'metallic'];

  return (
    <div className="space-y-4">
      {/* Object Type */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Object Type
        </h3>
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300">
          {selectedObject.type.charAt(0).toUpperCase() + selectedObject.type.slice(1)}
        </div>
      </div>

      {/* Position */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Position
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {['x', 'y', 'z'].map((axis, index) => (
            <div key={axis}>
              <label className="text-xs text-gray-600 dark:text-gray-400 uppercase">
                {axis}
              </label>
              <input
                type="number"
                value={selectedObject.position[index].toFixed(2)}
                onChange={(e) => {
                  const newPos = [...selectedObject.position] as [number, number, number];
                  newPos[index] = parseFloat(e.target.value) || 0;
                  onUpdateObject({ position: newPos });
                }}
                step="0.1"
                className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rotation */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Rotation (radians)
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {['x', 'y', 'z'].map((axis, index) => (
            <div key={axis}>
              <label className="text-xs text-gray-600 dark:text-gray-400 uppercase">
                {axis}
              </label>
              <input
                type="number"
                value={selectedObject.rotation[index].toFixed(2)}
                onChange={(e) => {
                  const newRot = [...selectedObject.rotation] as [number, number, number];
                  newRot[index] = parseFloat(e.target.value) || 0;
                  onUpdateObject({ rotation: newRot });
                }}
                step="0.1"
                className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scale */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Scale
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {['x', 'y', 'z'].map((axis, index) => (
            <div key={axis}>
              <label className="text-xs text-gray-600 dark:text-gray-400 uppercase">
                {axis}
              </label>
              <input
                type="number"
                value={selectedObject.scale[index].toFixed(2)}
                onChange={(e) => {
                  const newScale = [...selectedObject.scale] as [number, number, number];
                  newScale[index] = parseFloat(e.target.value) || 1;
                  onUpdateObject({ scale: newScale });
                }}
                step="0.1"
                min="0.1"
                className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Material Properties */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Material
        </h3>
        
        {/* Material Type */}
        <div className="mb-3">
          <label className="text-xs text-gray-600 dark:text-gray-400">Type</label>
          <select
            value={selectedObject.material.type}
            onChange={(e) =>
              onUpdateObject({
                material: { ...selectedObject.material, type: e.target.value as MaterialType },
              })
            }
            className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {materialTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div className="mb-3">
          <label className="text-xs text-gray-600 dark:text-gray-400">Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={selectedObject.material.color}
              onChange={(e) =>
                onUpdateObject({
                  material: { ...selectedObject.material, color: e.target.value },
                })
              }
              className="w-12 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedObject.material.color}
              onChange={(e) =>
                onUpdateObject({
                  material: { ...selectedObject.material, color: e.target.value },
                })
              }
              className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Opacity */}
        <div className="mb-3">
          <label className="text-xs text-gray-600 dark:text-gray-400">
            Opacity: {selectedObject.material.opacity.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedObject.material.opacity}
            onChange={(e) =>
              onUpdateObject({
                material: { ...selectedObject.material, opacity: parseFloat(e.target.value) },
              })
            }
            className="w-full"
          />
        </div>

        {/* Metalness (for standard/metallic materials) */}
        {(selectedObject.material.type === 'standard' || selectedObject.material.type === 'metallic') && (
          <div className="mb-3">
            <label className="text-xs text-gray-600 dark:text-gray-400">
              Metalness: {selectedObject.material.metalness.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedObject.material.metalness}
              onChange={(e) =>
                onUpdateObject({
                  material: { ...selectedObject.material, metalness: parseFloat(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>
        )}

        {/* Roughness (for standard/metallic materials) */}
        {(selectedObject.material.type === 'standard' || selectedObject.material.type === 'metallic') && (
          <div className="mb-3">
            <label className="text-xs text-gray-600 dark:text-gray-400">
              Roughness: {selectedObject.material.roughness.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedObject.material.roughness}
              onChange={(e) =>
                onUpdateObject({
                  material: { ...selectedObject.material, roughness: parseFloat(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Text-specific properties */}
      {selectedObject.type === 'text3d' && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Text Properties
          </h3>
          
          <div className="mb-3">
            <label className="text-xs text-gray-600 dark:text-gray-400">Text</label>
            <input
              type="text"
              value={selectedObject.text || ''}
              onChange={(e) => onUpdateObject({ text: e.target.value })}
              className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-3">
            <label className="text-xs text-gray-600 dark:text-gray-400">
              Font Size: {selectedObject.fontSize?.toFixed(2) || 0.5}
            </label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={selectedObject.fontSize || 0.5}
              onChange={(e) => onUpdateObject({ fontSize: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="mb-3">
            <label className="text-xs text-gray-600 dark:text-gray-400">
              Depth: {selectedObject.fontDepth?.toFixed(2) || 0.2}
            </label>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={selectedObject.fontDepth || 0.2}
              onChange={(e) => onUpdateObject({ fontDepth: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Atom-specific properties */}
      {selectedObject.type === 'atom' && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Atom Properties
          </h3>
          
          <div className="mb-3">
            <label className="text-xs text-gray-600 dark:text-gray-400">Element</label>
            <select
              value={selectedObject.element || 'C'}
              onChange={(e) => onUpdateObject({ element: e.target.value })}
              className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {['H', 'C', 'N', 'O', 'F', 'Cl', 'Br', 'I', 'P', 'S', 'B', 'Li', 'Na', 'K', 'Mg', 'Ca', 'Fe', 'Zn'].map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex space-x-2">
        <button
          onClick={onDuplicateObject}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Copy className="h-4 w-4" />
          <span className="text-sm">Duplicate</span>
        </button>
        <button
          onClick={onDeleteObject}
          className="flex-1 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span className="text-sm">Delete</span>
        </button>
      </div>
    </div>
  );
};
