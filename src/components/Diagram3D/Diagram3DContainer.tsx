import React, { useState, useCallback } from 'react';
import { Viewport3D } from './Viewport3D';
import { Toolbar3D } from './Toolbar3D';
import { PropertiesPanel } from './PropertiesPanel';
import { MoleculePicker } from './MoleculePicker';
import { Download, Save, FolderOpen } from 'lucide-react';
import type { Object3DData, MaterialProperties, MoleculeTemplate } from './types';
import { ELEMENT_COLORS } from './types';

interface Diagram3DContainerProps {
  onExportImage?: () => void;
}

const defaultMaterial: MaterialProperties = {
  type: 'standard',
  color: '#3b82f6',
  opacity: 1,
  metalness: 0.3,
  roughness: 0.7,
  emissive: '#000000',
  emissiveIntensity: 0,
  wireframe: false,
};

// Create initial demo objects to showcase 3D capabilities
const createInitialObjects = (): Object3DData[] => {
  return [
    {
      id: 'demo-cube-1',
      type: 'cube',
      position: [-1.5, 0.5, 0],
      rotation: [0.3, 0.5, 0],
      scale: [1, 1, 1],
      material: { ...defaultMaterial, color: '#3b82f6' },
      dimensions: { width: 1, height: 1, depth: 1 },
    },
    {
      id: 'demo-sphere-1',
      type: 'sphere',
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      material: { ...defaultMaterial, color: '#f97316' },
      dimensions: { radius: 0.5, segments: 32 },
    },
    {
      id: 'demo-cylinder-1',
      type: 'cylinder',
      position: [1.5, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      material: { ...defaultMaterial, color: '#10b981' },
      dimensions: { radius: 0.5, height: 1, segments: 32 },
    },
  ];
};

export const Diagram3DContainer: React.FC<Diagram3DContainerProps> = ({
  onExportImage,
}) => {
  const [objects, setObjects] = useState<Object3DData[]>(createInitialObjects());
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('cube');
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [cameraMode, setCameraMode] = useState<'perspective' | 'orthographic'>('perspective');
  const [autoRotate, setAutoRotate] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#f0f0f0');
  const [showMoleculePicker, setShowMoleculePicker] = useState(false);

  const generateId = () => `obj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addObject = useCallback((type: string) => {
    const newObject: Object3DData = {
      id: generateId(),
      type: type as Object3DData['type'],
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      material: { ...defaultMaterial },
    };

    switch (type) {
      case 'cube':
        newObject.dimensions = { width: 1, height: 1, depth: 1 };
        break;
      case 'sphere':
        newObject.dimensions = { radius: 0.5, segments: 32 };
        break;
      case 'cylinder':
        newObject.dimensions = { radius: 0.5, height: 1, segments: 32 };
        break;
      case 'cone':
        newObject.dimensions = { radius: 0.5, height: 1, segments: 32 };
        break;
      case 'torus':
        newObject.dimensions = { radius: 0.5, tube: 0.2, segments: 32 };
        break;
      case 'pyramid':
        newObject.dimensions = { radius: 0.5 };
        break;
      case 'plane':
        newObject.dimensions = { width: 2, height: 2 };
        break;
      case 'text3d':
        newObject.text = 'Hello';
        newObject.fontSize = 0.5;
        newObject.fontDepth = 0.2;
        break;
      case 'atom':
        newObject.element = 'C';
        newObject.material.color = ELEMENT_COLORS['C'];
        break;
    }

    setObjects((prevObjects) => [...prevObjects, newObject]);
    setSelectedObjectId(newObject.id);
  }, []);

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    
    if (tool === 'molecule') {
      setShowMoleculePicker(true);
    } else if (['move', 'rotate', 'scale'].includes(tool)) {
      // Transform tools - don't create objects
      return;
    } else {
      addObject(tool);
    }
  };

  const handleMoleculeSelect = (molecule: MoleculeTemplate) => {
    const newObjects: Object3DData[] = [];
    const atomIds: string[] = [];

    // Create atoms
    molecule.atoms.forEach((atom) => {
      const atomId = generateId();
      atomIds.push(atomId);
      
      newObjects.push({
        id: atomId,
        type: 'atom',
        position: atom.position,
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        element: atom.element,
        material: {
          ...defaultMaterial,
          color: ELEMENT_COLORS[atom.element] || '#808080',
        },
      });
    });

    // Create bonds
    molecule.bonds.forEach((bond) => {
      const atom1Pos = molecule.atoms[bond.atom1].position;
      const atom2Pos = molecule.atoms[bond.atom2].position;
      
      // Calculate midpoint and rotation for bond
      const midX = (atom1Pos[0] + atom2Pos[0]) / 2;
      const midY = (atom1Pos[1] + atom2Pos[1]) / 2;
      const midZ = (atom1Pos[2] + atom2Pos[2]) / 2;
      
      const dx = atom2Pos[0] - atom1Pos[0];
      const dy = atom2Pos[1] - atom1Pos[1];
      const dz = atom2Pos[2] - atom1Pos[2];
      
      const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      // Calculate rotation to align cylinder with bond direction
      const rotY = Math.atan2(dx, dz);
      const rotZ = Math.atan2(Math.sqrt(dx * dx + dz * dz), dy) - Math.PI / 2;
      
      newObjects.push({
        id: generateId(),
        type: 'bond',
        position: [midX, midY, midZ],
        rotation: [0, rotY, rotZ],
        scale: [1, length, 1],
        bondType: bond.type,
        startAtomId: atomIds[bond.atom1],
        endAtomId: atomIds[bond.atom2],
        material: {
          ...defaultMaterial,
          color: '#808080',
        },
      });
    });

    setObjects((prevObjects) => [...prevObjects, ...newObjects]);
  };

  const updateObject = useCallback((id: string, updates: Partial<Object3DData>) => {
    setObjects((prevObjects) =>
      prevObjects.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj))
    );
  }, []);

  const duplicateObject = useCallback(() => {
    if (!selectedObjectId) return;
    
    setObjects((prevObjects) => {
      const objectToDuplicate = prevObjects.find((obj) => obj.id === selectedObjectId);
      if (!objectToDuplicate) return prevObjects;

      const newObject: Object3DData = {
        ...objectToDuplicate,
        id: generateId(),
        position: [
          objectToDuplicate.position[0] + 1,
          objectToDuplicate.position[1],
          objectToDuplicate.position[2],
        ],
      };

      setSelectedObjectId(newObject.id);
      return [...prevObjects, newObject];
    });
  }, [selectedObjectId]);

  const deleteObject = useCallback(() => {
    if (!selectedObjectId) return;
    
    setObjects((prevObjects) => prevObjects.filter((obj) => obj.id !== selectedObjectId));
    setSelectedObjectId(null);
  }, [selectedObjectId]);

  const selectedObject = selectedObjectId
    ? objects.find((obj) => obj.id === selectedObjectId) || null
    : null;

  const handleSave = () => {
    const sceneData = {
      objects,
      settings: {
        backgroundColor,
        showGrid,
        showAxes,
        cameraMode,
      },
    };
    
    const dataStr = JSON.stringify(sceneData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `3d-scene-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const sceneData = JSON.parse(event.target?.result as string);
          setObjects(sceneData.objects || []);
          if (sceneData.settings) {
            setBackgroundColor(sceneData.settings.backgroundColor || '#f0f0f0');
            setShowGrid(sceneData.settings.showGrid !== false);
            setShowAxes(sceneData.settings.showAxes !== false);
            setCameraMode(sceneData.settings.cameraMode || 'perspective');
          }
        } catch (error) {
          console.error('Failed to load scene:', error);
          alert('Failed to load scene file');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <Toolbar3D
        selectedTool={selectedTool}
        onToolSelect={handleToolSelect}
        onResetCamera={() => {
          // Reset camera is handled by OrbitControls
        }}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        showAxes={showAxes}
        onToggleAxes={() => setShowAxes(!showAxes)}
        cameraMode={cameraMode}
        onToggleCameraMode={() =>
          setCameraMode(cameraMode === 'perspective' ? 'orthographic' : 'perspective')
        }
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* 3D Viewport */}
        <div className="flex-1 relative">
          <Viewport3D
            objects={objects}
            selectedObjectId={selectedObjectId}
            onObjectSelect={setSelectedObjectId}
            showGrid={showGrid}
            showAxes={showAxes}
            cameraMode={cameraMode}
            autoRotate={autoRotate}
            backgroundColor={backgroundColor}
          />
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto p-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Properties
            </h2>
          </div>

          <PropertiesPanel
            selectedObject={selectedObject}
            onUpdateObject={(updates) => selectedObjectId && updateObject(selectedObjectId, updates)}
            onDuplicateObject={duplicateObject}
            onDeleteObject={deleteObject}
          />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span className="text-sm font-medium">Save Scene</span>
          </button>

          <button
            onClick={handleLoad}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FolderOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Load Scene</span>
          </button>

          {onExportImage && (
            <button
              onClick={onExportImage}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm font-medium">Export Image</span>
            </button>
          )}
        </div>
      </div>

      {/* Molecule Picker Dialog */}
      {showMoleculePicker && (
        <MoleculePicker
          onSelectMolecule={handleMoleculeSelect}
          onClose={() => setShowMoleculePicker(false)}
        />
      )}
    </div>
  );
};
