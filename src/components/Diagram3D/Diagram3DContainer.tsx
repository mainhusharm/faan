import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Viewport3D } from './Viewport3D';
import { Toolbar3D } from './Toolbar3D';
import { PropertiesPanel } from './PropertiesPanel';
import { MoleculePicker } from './MoleculePicker';
import { AnimalPicker } from './AnimalPicker';
import { Download, Save, FolderOpen } from 'lucide-react';
import type { Object3DData, MaterialProperties, MoleculeTemplate, AnimalTemplate } from './types';
import { ELEMENT_COLORS, MOLECULE_TEMPLATES, ANIMAL_TEMPLATES } from './types';

interface Diagram3DContainerProps {
  onExportImage?: () => void;
}

export interface Diagram3DHandle {
   createObject: (type: string, color?: string, size?: number, aspectRatio?: number, points?: Array<{ x: number; y: number }>) => void;
   createMolecule: (moleculeName: string) => boolean;
   createAnimal: (animalName: string) => boolean;
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

export const Diagram3DContainer = forwardRef<Diagram3DHandle, Diagram3DContainerProps>(({
  onExportImage,
}, ref) => {
  const [objects, setObjects] = useState<Object3DData[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('cube');
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [cameraMode, setCameraMode] = useState<'perspective' | 'orthographic'>('perspective');
  const [autoRotate, setAutoRotate] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e');
  const [showMoleculePicker, setShowMoleculePicker] = useState(false);
  const [showAnimalPicker, setShowAnimalPicker] = useState(false);

  const generateId = () => `obj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addObject = useCallback((type: string, customColor?: string, customSize?: number, customAspectRatio?: number, customPoints?: Array<{ x: number; y: number }>) => {
    const size = customSize || 1;
    const newObject: Object3DData = {
      id: generateId(),
      type: type as Object3DData['type'],
      position: [
        Math.random() * 4 - 2,  // Random X position
        size / 2,                // Above ground based on size
        Math.random() * 4 - 2   // Random Z position
      ],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      material: { ...defaultMaterial, color: customColor || defaultMaterial.color },
    };

    switch (type) {
      case 'cube': {
        // For cubes created from rectangles, use aspect ratio to set width/depth
        if (customAspectRatio && customAspectRatio !== 1) {
          const baseSize = size * 0.7;
          newObject.dimensions = { 
            width: baseSize * customAspectRatio, 
            height: baseSize,
            depth: baseSize 
          };
        } else {
          newObject.dimensions = { width: size, height: size, depth: size };
        }
        break;
      }
      case 'sphere':
        newObject.dimensions = { radius: size * 0.5, segments: 32 };
        break;
      case 'cylinder':
        newObject.dimensions = { radius: size * 0.5, height: size, segments: 32 };
        break;
      case 'cone':
        newObject.dimensions = { radius: size * 0.5, height: size, segments: 32 };
        break;
      case 'torus':
        newObject.dimensions = { radius: size * 0.5, tube: size * 0.2, segments: 32 };
        break;
      case 'pyramid':
        newObject.dimensions = { radius: size * 0.5 };
        break;
      case 'plane':
        newObject.dimensions = { width: size * 2, height: size * 2 };
        break;
      case 'text3d':
        newObject.text = 'Hello';
        newObject.fontSize = size * 0.5;
        newObject.fontDepth = size * 0.2;
        break;
      case 'atom':
        newObject.element = 'C';
        newObject.material.color = ELEMENT_COLORS['C'];
        break;
      case 'custom_drawing':
        if (customPoints && customPoints.length > 0) {
          newObject.drawingPoints = customPoints;
        }
        break;
      }

      setObjects((prevObjects) => [...prevObjects, newObject]);
      setSelectedObjectId(newObject.id);
      }, []);

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
    
    if (tool === 'molecule') {
      setShowMoleculePicker(true);
    } else if (tool === 'animal') {
      setShowAnimalPicker(true);
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

  const handleAnimalSelect = (animal: AnimalTemplate) => {
    const newObject: Object3DData = {
      id: generateId(),
      type: 'animal',
      position: [
        Math.random() * 4 - 2,
        1,
        Math.random() * 4 - 2,
      ],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      material: { ...defaultMaterial, color: animal.color },
      animalName: animal.name,
      animalParts: animal.parts,
    };

    setObjects((prevObjects) => [...prevObjects, newObject]);
    setSelectedObjectId(newObject.id);
  };

  const createMoleculeByName = useCallback((moleculeName: string) => {
    const normalizedName = moleculeName.toLowerCase().trim();
    let template: MoleculeTemplate | undefined;

    // Find matching molecule template
    if (normalizedName.includes('water') || normalizedName === 'h2o') {
      template = MOLECULE_TEMPLATES.find(m => m.name === 'Water');
    } else if (normalizedName.includes('methane') || normalizedName === 'ch4') {
      template = MOLECULE_TEMPLATES.find(m => m.name === 'Methane');
    } else if (normalizedName.includes('ethanol') || normalizedName.includes('alcohol')) {
      template = MOLECULE_TEMPLATES.find(m => m.name === 'Ethanol');
    } else if (normalizedName.includes('benzene')) {
      template = MOLECULE_TEMPLATES.find(m => m.name === 'Benzene');
    }

    if (template) {
      handleMoleculeSelect(template);
      return true;
    }
    return false;
  }, []);

  const createAnimalByName = useCallback((animalName: string) => {
    const normalizedName = animalName.toLowerCase().trim();
    let template: AnimalTemplate | undefined;

    // Find matching animal template
    if (normalizedName.includes('dog') || normalizedName.includes('puppy')) {
      template = ANIMAL_TEMPLATES.find(a => a.name === 'dog');
    } else if (normalizedName.includes('cat') || normalizedName.includes('kitten')) {
      template = ANIMAL_TEMPLATES.find(a => a.name === 'cat');
    } else if (normalizedName.includes('bird') || normalizedName.includes('eagle') || normalizedName.includes('hawk')) {
      template = ANIMAL_TEMPLATES.find(a => a.name === 'bird');
    } else if (normalizedName.includes('fish') || normalizedName.includes('salmon')) {
      template = ANIMAL_TEMPLATES.find(a => a.name === 'fish');
    } else if (normalizedName.includes('elephant')) {
      template = ANIMAL_TEMPLATES.find(a => a.name === 'elephant');
    } else if (normalizedName.includes('monkey') || normalizedName.includes('ape') || normalizedName.includes('primate')) {
      template = ANIMAL_TEMPLATES.find(a => a.name === 'monkey');
    } else if (normalizedName.includes('zebra')) {
      template = ANIMAL_TEMPLATES.find(a => a.name === 'zebra');
    }

    if (template) {
      handleAnimalSelect(template);
      return true;
    }
    return false;
  }, []);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    createObject: (type: string, color?: string, size?: number, aspectRatio?: number, points?: Array<{ x: number; y: number }>) => {
      addObject(type, color, size, aspectRatio, points);
    },
    createMolecule: (moleculeName: string) => {
      return createMoleculeByName(moleculeName);
    },
    createAnimal: (animalName: string) => {
      return createAnimalByName(animalName);
    },
  }), [addObject, createMoleculeByName, createAnimalByName]);

  const updateObject = useCallback((id: string, updates: Partial<Object3DData>) => {
    setObjects((prevObjects) =>
      prevObjects.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj))
    );
  }, []);

  const handleObjectDrag = useCallback((id: string, newPosition: [number, number, number]) => {
    updateObject(id, { position: newPosition });
  }, [updateObject]);

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
            setBackgroundColor(sceneData.settings.backgroundColor || '#1a1a2e');
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
            onObjectDrag={handleObjectDrag}
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

      {/* Animal Picker Dialog */}
      {showAnimalPicker && (
        <AnimalPicker
          onSelectAnimal={handleAnimalSelect}
          onClose={() => setShowAnimalPicker(false)}
        />
      )}
    </div>
  );
});

Diagram3DContainer.displayName = 'Diagram3DContainer';
