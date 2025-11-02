import type { ParsedCommand } from './commandParser';
import type { Object3DData, MaterialProperties, MoleculeTemplate } from './types';
import { MOLECULE_TEMPLATES, ELEMENT_COLORS } from './types';

interface ExecutionResult {
  success: boolean;
  message: string;
  objects?: Object3DData[];
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

/**
 * Generate a unique ID for objects
 */
function generateId(): string {
  return `obj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convert position string to coordinates
 */
function resolvePosition(position?: [number, number, number] | 'left' | 'right' | 'center' | 'above' | 'below'): [number, number, number] {
  if (!position || position === 'center') {
    return [0, 0, 0];
  }
  
  if (typeof position === 'string') {
    const positionMap: Record<string, [number, number, number]> = {
      left: [-2, 0, 0],
      right: [2, 0, 0],
      above: [0, 2, 0],
      below: [0, -2, 0],
    };
    return positionMap[position] || [0, 0, 0];
  }
  
  return position;
}

/**
 * Resolve size value
 */
function resolveSize(size?: number | 'small' | 'medium' | 'large'): number {
  if (typeof size === 'number') {
    return size;
  }
  
  const sizeMap = {
    small: 0.5,
    medium: 1,
    large: 2,
  };
  
  return sizeMap[size as keyof typeof sizeMap] || 1;
}

/**
 * Create a basic shape object
 */
function createBasicShape(
  type: 'cube' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'pyramid' | 'plane',
  properties?: ParsedCommand['properties']
): Object3DData {
  const size = resolveSize(properties?.size);
  const position = resolvePosition(properties?.position);
  const color = properties?.color || defaultMaterial.color;
  
  const material: MaterialProperties = {
    ...defaultMaterial,
    color,
    ...(properties?.material || {}),
  };
  
  const baseObject: Object3DData = {
    id: generateId(),
    type,
    position,
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    material,
  };
  
  // Set dimensions based on type
  switch (type) {
    case 'cube':
      baseObject.dimensions = { width: size, height: size, depth: size };
      break;
    case 'sphere':
      baseObject.dimensions = { radius: size * 0.5, segments: 32 };
      break;
    case 'cylinder':
      baseObject.dimensions = { radius: size * 0.5, height: size, segments: 32 };
      break;
    case 'cone':
      baseObject.dimensions = { radius: size * 0.5, height: size, segments: 32 };
      break;
    case 'torus':
      baseObject.dimensions = { radius: size * 0.5, tube: size * 0.2, segments: 32 };
      break;
    case 'pyramid':
      baseObject.dimensions = { radius: size * 0.5 };
      break;
    case 'plane':
      baseObject.dimensions = { width: size * 2, height: size * 2 };
      break;
  }
  
  return baseObject;
}

/**
 * Create a 3D text object
 */
function createText3D(properties?: ParsedCommand['properties']): Object3DData {
  const position = resolvePosition(properties?.position);
  const color = properties?.color || defaultMaterial.color;
  const size = resolveSize(properties?.size);
  
  return {
    id: generateId(),
    type: 'text3d',
    position,
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    material: {
      ...defaultMaterial,
      color,
    },
    text: properties?.text || 'Hello',
    fontSize: size * 0.5,
    fontDepth: size * 0.2,
  };
}

/**
 * Create a molecule
 */
function createMolecule(moleculeName: string, basePosition?: [number, number, number]): Object3DData[] {
  const template = MOLECULE_TEMPLATES.find(
    m => m.name.toLowerCase() === moleculeName.toLowerCase()
  );
  
  if (!template) {
    throw new Error(`Molecule "${moleculeName}" not found`);
  }
  
  const objects: Object3DData[] = [];
  const atomIds: string[] = [];
  const position = basePosition || [0, 0, 0];
  
  // Create atoms
  template.atoms.forEach((atom) => {
    const atomId = generateId();
    atomIds.push(atomId);
    
    objects.push({
      id: atomId,
      type: 'atom',
      position: [
        position[0] + atom.position[0],
        position[1] + atom.position[1],
        position[2] + atom.position[2],
      ],
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
  template.bonds.forEach((bond) => {
    const atom1Pos = template.atoms[bond.atom1].position;
    const atom2Pos = template.atoms[bond.atom2].position;
    
    // Calculate midpoint and rotation for bond
    const midX = position[0] + (atom1Pos[0] + atom2Pos[0]) / 2;
    const midY = position[1] + (atom1Pos[1] + atom2Pos[1]) / 2;
    const midZ = position[2] + (atom1Pos[2] + atom2Pos[2]) / 2;
    
    const dx = atom2Pos[0] - atom1Pos[0];
    const dy = atom2Pos[1] - atom1Pos[1];
    const dz = atom2Pos[2] - atom1Pos[2];
    
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    // Calculate rotation to align cylinder with bond direction
    const rotY = Math.atan2(dx, dz);
    const rotZ = Math.atan2(Math.sqrt(dx * dx + dz * dz), dy) - Math.PI / 2;
    
    objects.push({
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
  
  return objects;
}

/**
 * Create multiple objects in an arrangement
 */
function createMultiple(
  objectType: 'cube' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'pyramid' | 'plane',
  count: number,
  arrangement?: 'circle' | 'grid' | 'row' | 'random',
  properties?: ParsedCommand['properties']
): Object3DData[] {
  const objects: Object3DData[] = [];
  const basePosition = resolvePosition(properties?.position);
  
  for (let i = 0; i < count; i++) {
    let position: [number, number, number];
    
    switch (arrangement) {
      case 'circle':
        const angle = (i / count) * Math.PI * 2;
        const radius = 3;
        position = [
          basePosition[0] + Math.cos(angle) * radius,
          basePosition[1],
          basePosition[2] + Math.sin(angle) * radius,
        ];
        break;
      
      case 'grid':
        const gridSize = Math.ceil(Math.sqrt(count));
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        position = [
          basePosition[0] + (col - gridSize / 2) * 1.5,
          basePosition[1],
          basePosition[2] + (row - gridSize / 2) * 1.5,
        ];
        break;
      
      case 'row':
        position = [
          basePosition[0] + (i - count / 2) * 1.5,
          basePosition[1],
          basePosition[2],
        ];
        break;
      
      case 'random':
      default:
        position = [
          basePosition[0] + (Math.random() - 0.5) * 5,
          basePosition[1] + (Math.random() - 0.5) * 5,
          basePosition[2] + (Math.random() - 0.5) * 5,
        ];
        break;
    }
    
    const obj = createBasicShape(objectType, {
      ...properties,
      position,
    });
    objects.push(obj);
  }
  
  return objects;
}

/**
 * Execute a parsed command and return the objects to create
 */
export function executeCommand(parsedCommand: ParsedCommand): ExecutionResult {
  try {
    if (parsedCommand.action === 'unknown') {
      return {
        success: false,
        message: parsedCommand.error || 'Command not recognized',
      };
    }
    
    if (parsedCommand.action === 'clear') {
      return {
        success: true,
        message: 'Scene cleared',
        objects: [],
      };
    }
    
    if (parsedCommand.action === 'create') {
      const { objectType, properties } = parsedCommand;
      
      if (!objectType) {
        return {
          success: false,
          message: 'No object type specified',
        };
      }
      
      // Handle multiple objects
      if (properties?.count && properties.count > 1) {
        if (objectType === 'molecule' || objectType === 'text3d') {
          return {
            success: false,
            message: 'Cannot create multiple molecules or text objects at once',
          };
        }
        
        const objects = createMultiple(
          objectType as any,
          properties.count,
          properties.arrangement,
          properties
        );
        
        return {
          success: true,
          message: `✓ Created ${properties.count} ${objectType}s`,
          objects,
        };
      }
      
      // Handle single object creation
      let objects: Object3DData[] = [];
      let message = '';
      
      switch (objectType) {
        case 'text3d':
          objects = [createText3D(properties)];
          message = `✓ Created 3D text "${properties?.text || 'Hello'}"`;
          break;
        
        case 'molecule':
          if (!properties?.moleculeName) {
            return {
              success: false,
              message: 'No molecule name specified',
            };
          }
          try {
            objects = createMolecule(properties.moleculeName, resolvePosition(properties.position));
            message = `✓ Created ${properties.moleculeName} molecule`;
          } catch (error) {
            return {
              success: false,
              message: error instanceof Error ? error.message : 'Failed to create molecule',
            };
          }
          break;
        
        default:
          // Basic shapes
          objects = [createBasicShape(objectType as any, properties)];
          const colorDesc = properties?.color ? ` ${properties.color}` : '';
          const sizeDesc = properties?.size ? ` ${properties.size}` : '';
          message = `✓ Created${colorDesc}${sizeDesc} ${objectType}`;
          break;
      }
      
      return {
        success: true,
        message,
        objects,
      };
    }
    
    return {
      success: false,
      message: 'Command action not implemented',
    };
  } catch (error) {
    console.error('Command execution error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to execute command',
    };
  }
}
