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
  | 'molecule';

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
      { element: 'H', position: [0.63, 0.63, 0.63] },
      { element: 'H', position: [-0.63, -0.63, 0.63] },
      { element: 'H', position: [-0.63, 0.63, -0.63] },
      { element: 'H', position: [0.63, -0.63, -0.63] },
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
