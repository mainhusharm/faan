export type Object3DType =
   | 'cube'
   | 'sphere'
   | 'cylinder'
   | 'cone'
   | 'torus'
   | 'pyramid'
   | 'plane'
   | 'text3d'
   | 'atom'
   | 'bond'
   | 'molecule'
   | 'animal'
   | 'custom_drawing';

export type MaterialType = 'standard' | 'phong' | 'basic' | 'wireframe' | 'glass' | 'metallic';

export type BondType = 'single' | 'double' | 'triple';

export interface MaterialProperties {
  type: MaterialType;
  color: string;
  opacity: number;
  metalness: number;
  roughness: number;
  emissive: string;
  emissiveIntensity: number;
  wireframe: boolean;
}

export interface Object3DData {
  id: string;
  type: Object3DType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  material: MaterialProperties;
  
  // Shape-specific properties
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    radius?: number;
    tube?: number;
    segments?: number;
  };
  
  // Text-specific properties
  text?: string;
  fontSize?: number;
  fontDepth?: number;
  
  // Atom-specific properties
  element?: string;
  atomicNumber?: number;
  
  // Bond-specific properties
  bondType?: BondType;
  startAtomId?: string;
  endAtomId?: string;
  
  // Molecule-specific properties
  moleculeName?: string;
  atoms?: string[];
  bonds?: string[];
  
  // Animal-specific properties
   animalName?: string;
   animalParts?: AnimalPart[];

   // Custom drawing-specific properties
   drawingPoints?: Array<{ x: number; y: number }>;
  }

export interface AnimalPart {
  name: string;
  type: 'sphere' | 'cylinder' | 'cone' | 'cube';
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  color: string;
}

export interface AnimalTemplate {
  name: string;
  displayName: string;
  description: string;
  color: string;
  parts: AnimalPart[];
}

export interface MoleculeTemplate {
  name: string;
  formula: string;
  description: string;
  atoms: Array<{
    element: string;
    position: [number, number, number];
  }>;
  bonds: Array<{
    atom1: number;
    atom2: number;
    type: BondType;
  }>;
}

export const ELEMENT_COLORS: Record<string, string> = {
  H: '#FFFFFF', // Hydrogen - White
  C: '#000000', // Carbon - Black
  N: '#3050F8', // Nitrogen - Blue
  O: '#FF0D0D', // Oxygen - Red
  F: '#90E050', // Fluorine - Green
  Cl: '#1FF01F', // Chlorine - Green
  Br: '#A62929', // Bromine - Brown
  I: '#940094', // Iodine - Purple
  P: '#FF8000', // Phosphorus - Orange
  S: '#FFFF30', // Sulfur - Yellow
  B: '#FFB5B5', // Boron - Pink
  Li: '#CC80FF', // Lithium - Violet
  Na: '#AB5CF2', // Sodium - Violet
  K: '#8F40D4', // Potassium - Violet
  Mg: '#8AFF00', // Magnesium - Green
  Ca: '#3DFF00', // Calcium - Green
  Fe: '#E06633', // Iron - Orange
  Zn: '#7D80B0', // Zinc - Gray
};

export const ELEMENT_RADII: Record<string, number> = {
  H: 0.25,
  C: 0.4,
  N: 0.35,
  O: 0.35,
  F: 0.3,
  Cl: 0.5,
  Br: 0.6,
  I: 0.7,
  P: 0.45,
  S: 0.45,
  B: 0.4,
  Li: 0.35,
  Na: 0.4,
  K: 0.45,
  Mg: 0.35,
  Ca: 0.4,
  Fe: 0.4,
  Zn: 0.35,
};

export const MOLECULE_TEMPLATES: MoleculeTemplate[] = [
  {
    name: 'Water',
    formula: 'H₂O',
    description: 'Water molecule',
    atoms: [
      { element: 'O', position: [0, 0, 0] },
      { element: 'H', position: [0.76, 0.59, 0] },
      { element: 'H', position: [-0.76, 0.59, 0] },
    ],
    bonds: [
      { atom1: 0, atom2: 1, type: 'single' },
      { atom1: 0, atom2: 2, type: 'single' },
    ],
  },
  {
    name: 'Methane',
    formula: 'CH₄',
    description: 'Methane molecule',
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      // Tetrahedral geometry with 109.5° bond angles
      // Bond length ~1.09 Angstrom scaled
      { element: 'H', position: [0, 1.09, 0] },  // Top
      { element: 'H', position: [1.028, -0.363, 0] },  // Front-right
      { element: 'H', position: [-0.514, -0.363, 0.89] },  // Back-left
      { element: 'H', position: [-0.514, -0.363, -0.89] },  // Front-left
    ],
    bonds: [
      { atom1: 0, atom2: 1, type: 'single' },
      { atom1: 0, atom2: 2, type: 'single' },
      { atom1: 0, atom2: 3, type: 'single' },
      { atom1: 0, atom2: 4, type: 'single' },
    ],
  },
  {
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    description: 'Ethanol molecule',
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'C', position: [1.54, 0, 0] },
      { element: 'O', position: [2.31, 1.25, 0] },
      { element: 'H', position: [-0.54, 0.89, 0] },
      { element: 'H', position: [-0.54, -0.89, 0] },
      { element: 'H', position: [0, 0, 1] },
      { element: 'H', position: [2.08, -0.89, 0] },
      { element: 'H', position: [1.54, 0, -1] },
      { element: 'H', position: [3.25, 1.25, 0] },
    ],
    bonds: [
      { atom1: 0, atom2: 1, type: 'single' },
      { atom1: 1, atom2: 2, type: 'single' },
      { atom1: 0, atom2: 3, type: 'single' },
      { atom1: 0, atom2: 4, type: 'single' },
      { atom1: 0, atom2: 5, type: 'single' },
      { atom1: 1, atom2: 6, type: 'single' },
      { atom1: 1, atom2: 7, type: 'single' },
      { atom1: 2, atom2: 8, type: 'single' },
    ],
  },
  {
    name: 'Benzene',
    formula: 'C₆H₆',
    description: 'Benzene ring',
    atoms: [
      { element: 'C', position: [1.2, 0, 0] },
      { element: 'C', position: [0.6, 1.04, 0] },
      { element: 'C', position: [-0.6, 1.04, 0] },
      { element: 'C', position: [-1.2, 0, 0] },
      { element: 'C', position: [-0.6, -1.04, 0] },
      { element: 'C', position: [0.6, -1.04, 0] },
      { element: 'H', position: [2.28, 0, 0] },
      { element: 'H', position: [1.14, 1.98, 0] },
      { element: 'H', position: [-1.14, 1.98, 0] },
      { element: 'H', position: [-2.28, 0, 0] },
      { element: 'H', position: [-1.14, -1.98, 0] },
      { element: 'H', position: [1.14, -1.98, 0] },
    ],
    bonds: [
      { atom1: 0, atom2: 1, type: 'double' },
      { atom1: 1, atom2: 2, type: 'single' },
      { atom1: 2, atom2: 3, type: 'double' },
      { atom1: 3, atom2: 4, type: 'single' },
      { atom1: 4, atom2: 5, type: 'double' },
      { atom1: 5, atom2: 0, type: 'single' },
      { atom1: 0, atom2: 6, type: 'single' },
      { atom1: 1, atom2: 7, type: 'single' },
      { atom1: 2, atom2: 8, type: 'single' },
      { atom1: 3, atom2: 9, type: 'single' },
      { atom1: 4, atom2: 10, type: 'single' },
      { atom1: 5, atom2: 11, type: 'single' },
    ],
  },
];

export const ANIMAL_TEMPLATES: AnimalTemplate[] = [
  {
    name: 'dog',
    displayName: '🐕 Dog',
    description: 'A simple 3D dog model',
    color: '#8B4513',
    parts: [
      // Body
      { name: 'body', type: 'cylinder', position: [0, 0.5, 0], scale: [0.6, 1.2, 0.3], rotation: [Math.PI / 2, 0, 0], color: '#A0522D' },
      // Head
      { name: 'head', type: 'sphere', position: [0, 1.3, -0.5], scale: [0.5, 0.5, 0.5], rotation: [0, 0, 0], color: '#8B4513' },
      // Snout
      { name: 'snout', type: 'sphere', position: [0, 1.15, -0.95], scale: [0.3, 0.3, 0.25], rotation: [0, 0, 0], color: '#A0522D' },
      // Left ear
      { name: 'leftEar', type: 'cone', position: [-0.25, 1.65, -0.3], scale: [0.2, 0.4, 0.2], rotation: [0, 0, 0], color: '#654321' },
      // Right ear
      { name: 'rightEar', type: 'cone', position: [0.25, 1.65, -0.3], scale: [0.2, 0.4, 0.2], rotation: [0, 0, 0], color: '#654321' },
      // Front left leg
      { name: 'frontLeftLeg', type: 'cylinder', position: [-0.35, 0.1, -0.15], scale: [0.15, 0.6, 0.15], rotation: [0, 0, 0], color: '#8B4513' },
      // Front right leg
      { name: 'frontRightLeg', type: 'cylinder', position: [0.35, 0.1, -0.15], scale: [0.15, 0.6, 0.15], rotation: [0, 0, 0], color: '#8B4513' },
      // Back left leg
      { name: 'backLeftLeg', type: 'cylinder', position: [-0.35, 0.1, 0.35], scale: [0.15, 0.6, 0.15], rotation: [0, 0, 0], color: '#8B4513' },
      // Back right leg
      { name: 'backRightLeg', type: 'cylinder', position: [0.35, 0.1, 0.35], scale: [0.15, 0.6, 0.15], rotation: [0, 0, 0], color: '#8B4513' },
      // Tail
      { name: 'tail', type: 'cylinder', position: [0, 0.6, 0.8], scale: [0.1, 0.8, 0.1], rotation: [0.3, 0, 0], color: '#8B4513' },
    ],
  },
  {
    name: 'cat',
    displayName: '🐱 Cat',
    description: 'A simple 3D cat model',
    color: '#FF8C00',
    parts: [
      // Body
      { name: 'body', type: 'cylinder', position: [0, 0.5, 0], scale: [0.5, 1, 0.3], rotation: [Math.PI / 2, 0, 0], color: '#FFA500' },
      // Head
      { name: 'head', type: 'sphere', position: [0, 1.2, -0.4], scale: [0.4, 0.4, 0.4], rotation: [0, 0, 0], color: '#FF8C00' },
      // Snout
      { name: 'snout', type: 'sphere', position: [0, 1.05, -0.75], scale: [0.2, 0.2, 0.15], rotation: [0, 0, 0], color: '#FFB347' },
      // Left ear (triangle/cone)
      { name: 'leftEar', type: 'cone', position: [-0.2, 1.55, -0.35], scale: [0.15, 0.35, 0.15], rotation: [0, 0, -0.3], color: '#FF8C00' },
      // Right ear (triangle/cone)
      { name: 'rightEar', type: 'cone', position: [0.2, 1.55, -0.35], scale: [0.15, 0.35, 0.15], rotation: [0, 0, 0.3], color: '#FF8C00' },
      // Front left leg
      { name: 'frontLeftLeg', type: 'cylinder', position: [-0.25, 0.05, -0.1], scale: [0.12, 0.5, 0.12], rotation: [0, 0, 0], color: '#FF8C00' },
      // Front right leg
      { name: 'frontRightLeg', type: 'cylinder', position: [0.25, 0.05, -0.1], scale: [0.12, 0.5, 0.12], rotation: [0, 0, 0], color: '#FF8C00' },
      // Back left leg
      { name: 'backLeftLeg', type: 'cylinder', position: [-0.25, 0.05, 0.35], scale: [0.12, 0.5, 0.12], rotation: [0, 0, 0], color: '#FF8C00' },
      // Back right leg
      { name: 'backRightLeg', type: 'cylinder', position: [0.25, 0.05, 0.35], scale: [0.12, 0.5, 0.12], rotation: [0, 0, 0], color: '#FF8C00' },
      // Tail
      { name: 'tail', type: 'cylinder', position: [0, 0.5, 0.8], scale: [0.1, 0.7, 0.1], rotation: [0.4, 0, 0], color: '#FF8C00' },
    ],
  },
  {
    name: 'bird',
    displayName: '🐦 Bird',
    description: 'A simple 3D bird model',
    color: '#FFD700',
    parts: [
      // Body
      { name: 'body', type: 'sphere', position: [0, 0.6, 0], scale: [0.4, 0.5, 0.3], rotation: [0, 0, 0], color: '#FFD700' },
      // Head
      { name: 'head', type: 'sphere', position: [0, 1, -0.35], scale: [0.3, 0.3, 0.3], rotation: [0, 0, 0], color: '#FFA500' },
      // Beak
      { name: 'beak', type: 'cone', position: [0, 0.95, -0.6], scale: [0.15, 0.15, 0.2], rotation: [0, 0, 0], color: '#FF6347' },
      // Left wing
      { name: 'leftWing', type: 'cube', position: [-0.4, 0.65, -0.05], scale: [0.15, 0.3, 0.5], rotation: [0, 0, -0.2], color: '#FFD700' },
      // Right wing
      { name: 'rightWing', type: 'cube', position: [0.4, 0.65, -0.05], scale: [0.15, 0.3, 0.5], rotation: [0, 0, 0.2], color: '#FFD700' },
      // Left leg
      { name: 'leftLeg', type: 'cylinder', position: [-0.15, 0.2, -0.1], scale: [0.08, 0.3, 0.08], rotation: [0, 0, 0], color: '#FF6347' },
      // Right leg
      { name: 'rightLeg', type: 'cylinder', position: [0.15, 0.2, -0.1], scale: [0.08, 0.3, 0.08], rotation: [0, 0, 0], color: '#FF6347' },
      // Tail
      { name: 'tail', type: 'cube', position: [0, 0.6, 0.5], scale: [0.2, 0.2, 0.4], rotation: [0, 0, 0], color: '#FFD700' },
    ],
  },
  {
    name: 'fish',
    displayName: '🐟 Fish',
    description: 'A simple 3D fish model',
    color: '#FF6347',
    parts: [
      // Body
      { name: 'body', type: 'cylinder', position: [0, 0, 0], scale: [0.3, 0.6, 0.4], rotation: [0, 0, Math.PI / 2], color: '#FF6347' },
      // Head
      { name: 'head', type: 'sphere', position: [-0.4, 0, 0], scale: [0.35, 0.35, 0.35], rotation: [0, 0, 0], color: '#DC143C' },
      // Tail fin (top)
      { name: 'tailFinTop', type: 'cube', position: [0.5, 0.2, 0], scale: [0.15, 0.25, 0.4], rotation: [0, 0, 0.3], color: '#FF4500' },
      // Tail fin (bottom)
      { name: 'tailFinBottom', type: 'cube', position: [0.5, -0.2, 0], scale: [0.15, 0.25, 0.4], rotation: [0, 0, -0.3], color: '#FF4500' },
      // Dorsal fin
      { name: 'dorsalFin', type: 'cube', position: [-0.05, 0.25, 0], scale: [0.15, 0.3, 0.2], rotation: [0, 0, 0], color: '#DC143C' },
      // Ventral fin
      { name: 'ventralFin', type: 'cube', position: [-0.05, -0.25, 0], scale: [0.15, 0.3, 0.2], rotation: [0, 0, 0], color: '#DC143C' },
      // Left pectoral fin
      { name: 'leftPectoralFin', type: 'cube', position: [-0.1, 0, -0.25], scale: [0.1, 0.2, 0.3], rotation: [0, 0, 0], color: '#FF6347' },
      // Right pectoral fin
      { name: 'rightPectoralFin', type: 'cube', position: [-0.1, 0, 0.25], scale: [0.1, 0.2, 0.3], rotation: [0, 0, 0], color: '#FF6347' },
    ],
  },
  {
    name: 'elephant',
    displayName: '🐘 Elephant',
    description: 'A simple 3D elephant model',
    color: '#808080',
    parts: [
      // Body
      { name: 'body', type: 'cylinder', position: [0, 0.6, 0], scale: [0.8, 1.2, 0.5], rotation: [Math.PI / 2, 0, 0], color: '#A9A9A9' },
      // Head
      { name: 'head', type: 'sphere', position: [0, 1.4, -0.6], scale: [0.6, 0.6, 0.6], rotation: [0, 0, 0], color: '#808080' },
      // Trunk
      { name: 'trunk', type: 'cylinder', position: [0.1, 0.8, -0.9], scale: [0.2, 1, 0.2], rotation: [0.4, 0, 0.1], color: '#708090' },
      // Left ear
      { name: 'leftEar', type: 'cube', position: [-0.6, 1.2, -0.3], scale: [0.3, 0.6, 0.15], rotation: [0, 0, 0], color: '#808080' },
      // Right ear
      { name: 'rightEar', type: 'cube', position: [0.6, 1.2, -0.3], scale: [0.3, 0.6, 0.15], rotation: [0, 0, 0], color: '#808080' },
      // Front left leg
      { name: 'frontLeftLeg', type: 'cylinder', position: [-0.4, 0.1, -0.2], scale: [0.25, 0.8, 0.25], rotation: [0, 0, 0], color: '#808080' },
      // Front right leg
      { name: 'frontRightLeg', type: 'cylinder', position: [0.4, 0.1, -0.2], scale: [0.25, 0.8, 0.25], rotation: [0, 0, 0], color: '#808080' },
      // Back left leg
      { name: 'backLeftLeg', type: 'cylinder', position: [-0.4, 0.1, 0.5], scale: [0.25, 0.8, 0.25], rotation: [0, 0, 0], color: '#808080' },
      // Back right leg
      { name: 'backRightLeg', type: 'cylinder', position: [0.4, 0.1, 0.5], scale: [0.25, 0.8, 0.25], rotation: [0, 0, 0], color: '#808080' },
      // Tusk (left)
      { name: 'leftTusk', type: 'cone', position: [-0.2, 0.95, -1.1], scale: [0.1, 0.4, 0.1], rotation: [0.3, 0, 0], color: '#FFFFF0' },
      // Tusk (right)
      { name: 'rightTusk', type: 'cone', position: [0.2, 0.95, -1.1], scale: [0.1, 0.4, 0.1], rotation: [0.3, 0, 0], color: '#FFFFF0' },
      // Tail
      { name: 'tail', type: 'cylinder', position: [0, 0.6, 1.1], scale: [0.08, 1, 0.08], rotation: [0, 0, 0], color: '#808080' },
    ],
  },
  {
    name: 'monkey',
    displayName: '🐵 Monkey',
    description: 'A simple 3D monkey model',
    color: '#8B4513',
    parts: [
      // Body
      { name: 'body', type: 'cylinder', position: [0, 0.4, 0], scale: [0.4, 0.8, 0.3], rotation: [Math.PI / 2, 0, 0], color: '#A0522D' },
      // Head
      { name: 'head', type: 'sphere', position: [0, 1.1, -0.2], scale: [0.45, 0.45, 0.45], rotation: [0, 0, 0], color: '#8B4513' },
      // Face (lighter color)
      { name: 'face', type: 'sphere', position: [0, 1, -0.45], scale: [0.25, 0.25, 0.15], rotation: [0, 0, 0], color: '#D2B48C' },
      // Left ear
      { name: 'leftEar', type: 'sphere', position: [-0.35, 1.3, -0.15], scale: [0.2, 0.2, 0.15], rotation: [0, 0, 0], color: '#8B4513' },
      // Right ear
      { name: 'rightEar', type: 'sphere', position: [0.35, 1.3, -0.15], scale: [0.2, 0.2, 0.15], rotation: [0, 0, 0], color: '#8B4513' },
      // Left arm
      { name: 'leftArm', type: 'cylinder', position: [-0.35, 0.6, -0.05], scale: [0.15, 0.7, 0.15], rotation: [0, 0, 0.3], color: '#A0522D' },
      // Right arm
      { name: 'rightArm', type: 'cylinder', position: [0.35, 0.6, -0.05], scale: [0.15, 0.7, 0.15], rotation: [0, 0, -0.3], color: '#A0522D' },
      // Left leg
      { name: 'leftLeg', type: 'cylinder', position: [-0.2, 0.05, 0.15], scale: [0.15, 0.5, 0.15], rotation: [0, 0, 0], color: '#8B4513' },
      // Right leg
      { name: 'rightLeg', type: 'cylinder', position: [0.2, 0.05, 0.15], scale: [0.15, 0.5, 0.15], rotation: [0, 0, 0], color: '#8B4513' },
      // Tail
      { name: 'tail', type: 'cylinder', position: [0, 0.4, 0.6], scale: [0.1, 0.9, 0.1], rotation: [0.2, 0, 0], color: '#8B4513' },
    ],
  },
  {
    name: 'zebra',
    displayName: '🦓 Zebra',
    description: 'A simple 3D zebra model with stripes',
    color: '#000000',
    parts: [
      // Body
      { name: 'body', type: 'cylinder', position: [0, 0.6, 0], scale: [0.7, 1.3, 0.4], rotation: [Math.PI / 2, 0, 0], color: '#FFFFFF' },
      // Head
      { name: 'head', type: 'sphere', position: [0, 1.5, -0.7], scale: [0.5, 0.6, 0.5], rotation: [0, 0, 0], color: '#FFFFFF' },
      // Snout
      { name: 'snout', type: 'cylinder', position: [0, 1.25, -1.1], scale: [0.25, 0.35, 0.3], rotation: [0, 0, 0], color: '#FFFFFF' },
      // Left ear
      { name: 'leftEar', type: 'cone', position: [-0.3, 2, -0.5], scale: [0.2, 0.4, 0.2], rotation: [0, 0, 0], color: '#FFFFFF' },
      // Right ear
      { name: 'rightEar', type: 'cone', position: [0.3, 2, -0.5], scale: [0.2, 0.4, 0.2], rotation: [0, 0, 0], color: '#FFFFFF' },
      // Front left leg
      { name: 'frontLeftLeg', type: 'cylinder', position: [-0.35, 0.15, -0.25], scale: [0.18, 0.85, 0.18], rotation: [0, 0, 0], color: '#FFFFFF' },
      // Front right leg
      { name: 'frontRightLeg', type: 'cylinder', position: [0.35, 0.15, -0.25], scale: [0.18, 0.85, 0.18], rotation: [0, 0, 0], color: '#FFFFFF' },
      // Back left leg
      { name: 'backLeftLeg', type: 'cylinder', position: [-0.35, 0.15, 0.5], scale: [0.18, 0.85, 0.18], rotation: [0, 0, 0], color: '#FFFFFF' },
      // Back right leg
      { name: 'backRightLeg', type: 'cylinder', position: [0.35, 0.15, 0.5], scale: [0.18, 0.85, 0.18], rotation: [0, 0, 0], color: '#FFFFFF' },
      // Neck stripe
      { name: 'neckStripe', type: 'cylinder', position: [-0.15, 1.2, -0.3], scale: [0.08, 0.5, 0.4], rotation: [0, 0, 0], color: '#000000' },
      // Tail
      { name: 'tail', type: 'cylinder', position: [0, 0.7, 1.2], scale: [0.1, 1, 0.1], rotation: [0.2, 0, 0], color: '#FFFFFF' },
    ],
  },
];
