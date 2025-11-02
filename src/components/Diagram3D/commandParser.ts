import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Object3DData, MaterialProperties } from './types';
import { MOLECULE_TEMPLATES } from './types';

export interface ParsedCommand {
  action: 'create' | 'delete' | 'modify' | 'clear' | 'unknown';
  objectType?: 'cube' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'pyramid' | 'plane' | 'text3d' | 'molecule';
  properties?: {
    color?: string;
    size?: number | 'small' | 'medium' | 'large';
    position?: [number, number, number] | 'left' | 'right' | 'center' | 'above' | 'below';
    text?: string;
    moleculeName?: string;
    material?: Partial<MaterialProperties>;
    count?: number;
    arrangement?: 'circle' | 'grid' | 'row' | 'random';
  };
  error?: string;
}

const COLOR_MAP: Record<string, string> = {
  red: '#FF0000',
  blue: '#0000FF',
  green: '#00FF00',
  yellow: '#FFFF00',
  orange: '#FFA500',
  purple: '#800080',
  pink: '#FFC0CB',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#808080',
  grey: '#808080',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  brown: '#A52A2A',
  gold: '#FFD700',
  silver: '#C0C0C0',
  transparent: '#FFFFFF',
};

const SIZE_MAP: Record<string, number> = {
  tiny: 0.3,
  small: 0.5,
  medium: 1,
  large: 2,
  huge: 3,
  big: 2,
};

const SHAPE_SYNONYMS: Record<string, string> = {
  box: 'cube',
  square: 'cube',
  ball: 'sphere',
  circle: 'sphere',
  tube: 'cylinder',
  pipe: 'cylinder',
  ring: 'torus',
  donut: 'torus',
  triangle: 'pyramid',
  text: 'text3d',
  word: 'text3d',
  words: 'text3d',
};

const POSITION_MAP: Record<string, [number, number, number]> = {
  center: [0, 0, 0],
  left: [-2, 0, 0],
  right: [2, 0, 0],
  above: [0, 2, 0],
  below: [0, -2, 0],
  up: [0, 2, 0],
  down: [0, -2, 0],
  front: [0, 0, 2],
  back: [0, 0, -2],
};

/**
 * Extract color from command text
 */
function extractColor(command: string): string | undefined {
  const lower = command.toLowerCase();
  for (const [name, hex] of Object.entries(COLOR_MAP)) {
    if (lower.includes(name)) {
      return hex;
    }
  }
  return undefined;
}

/**
 * Extract size from command text
 */
function extractSize(command: string): number | 'small' | 'medium' | 'large' | undefined {
  const lower = command.toLowerCase();
  for (const [name, value] of Object.entries(SIZE_MAP)) {
    if (lower.includes(name)) {
      return value;
    }
  }
  
  // Check for numeric size
  const sizeMatch = lower.match(/size\s+(\d+\.?\d*)/);
  if (sizeMatch) {
    return parseFloat(sizeMatch[1]);
  }
  
  const radiusMatch = lower.match(/radius\s+(\d+\.?\d*)/);
  if (radiusMatch) {
    return parseFloat(radiusMatch[1]);
  }
  
  return undefined;
}

/**
 * Extract shape from command text
 */
function extractShape(command: string): string | undefined {
  const lower = command.toLowerCase();
  
  // Direct shape names
  const shapes = ['cube', 'sphere', 'cylinder', 'cone', 'torus', 'pyramid', 'plane'];
  for (const shape of shapes) {
    if (lower.includes(shape)) {
      return shape;
    }
  }
  
  // Check synonyms
  for (const [synonym, shape] of Object.entries(SHAPE_SYNONYMS)) {
    if (lower.includes(synonym)) {
      return shape;
    }
  }
  
  return undefined;
}

/**
 * Extract position from command text
 */
function extractPosition(command: string): [number, number, number] | 'left' | 'right' | 'center' | 'above' | 'below' | undefined {
  const lower = command.toLowerCase();
  
  // Check for coordinate position
  const coordMatch = lower.match(/(?:at|position)\s+(?:x:?\s*)?(-?\d+\.?\d*)[\s,]+(?:y:?\s*)?(-?\d+\.?\d*)[\s,]+(?:z:?\s*)?(-?\d+\.?\d*)/);
  if (coordMatch) {
    return [parseFloat(coordMatch[1]), parseFloat(coordMatch[2]), parseFloat(coordMatch[3])];
  }
  
  // Check for simple coordinate
  const simpleCoordMatch = lower.match(/at\s+(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/);
  if (simpleCoordMatch) {
    return [parseFloat(simpleCoordMatch[1]), parseFloat(simpleCoordMatch[2]), parseFloat(simpleCoordMatch[3])];
  }
  
  // Check for named positions
  for (const [name, pos] of Object.entries(POSITION_MAP)) {
    if (lower.includes(`to the ${name}`) || lower.includes(`to ${name}`) || lower.includes(`at ${name}`)) {
      return pos;
    }
  }
  
  return undefined;
}

/**
 * Extract text content from command
 */
function extractText(command: string): string | undefined {
  // Look for text in quotes
  const quotedMatch = command.match(/['"](.+?)['"]/);
  if (quotedMatch) {
    return quotedMatch[1];
  }
  
  // Look for "text X" or "create text X"
  const textMatch = command.match(/(?:text|word|words)\s+(.+?)(?:\s+(?:at|to|with|in)|$)/i);
  if (textMatch) {
    return textMatch[1].trim();
  }
  
  return undefined;
}

/**
 * Extract molecule name from command
 */
function extractMolecule(command: string): string | undefined {
  const lower = command.toLowerCase();
  
  // Check if it's a molecule command
  if (!lower.includes('molecule') && !lower.includes('water') && !lower.includes('methane') && 
      !lower.includes('ethanol') && !lower.includes('benzene')) {
    return undefined;
  }
  
  // Check against known molecules
  for (const template of MOLECULE_TEMPLATES) {
    if (lower.includes(template.name.toLowerCase())) {
      return template.name;
    }
  }
  
  // Check for common chemical formulas
  if (lower.includes('h2o') || lower.includes('h₂o')) return 'Water';
  if (lower.includes('ch4') || lower.includes('ch₄')) return 'Methane';
  if (lower.includes('c2h5oh') || lower.includes('c₂h₅oh')) return 'Ethanol';
  if (lower.includes('c6h6') || lower.includes('c₆h₆')) return 'Benzene';
  
  return undefined;
}

/**
 * Extract count for multiple objects
 */
function extractCount(command: string): number | undefined {
  const countMatch = command.match(/(\d+)\s+(?:spheres?|cubes?|cylinders?|cones?|objects?)/i);
  if (countMatch) {
    return parseInt(countMatch[1]);
  }
  return undefined;
}

/**
 * Extract material properties
 */
function extractMaterial(command: string): Partial<MaterialProperties> | undefined {
  const lower = command.toLowerCase();
  const material: Partial<MaterialProperties> = {};
  
  if (lower.includes('metallic') || lower.includes('metal')) {
    material.metalness = 1;
    material.roughness = 0.2;
  }
  
  if (lower.includes('transparent') || lower.includes('glass')) {
    material.opacity = 0.3;
  }
  
  if (lower.includes('glowing') || lower.includes('glow')) {
    material.emissiveIntensity = 0.5;
  }
  
  if (lower.includes('wireframe')) {
    material.wireframe = true;
  }
  
  return Object.keys(material).length > 0 ? material : undefined;
}

/**
 * Parse command using pattern matching (fast, for simple commands)
 */
export function parseCommandSimple(command: string): ParsedCommand {
  const lower = command.toLowerCase().trim();
  
  if (!command || lower.length === 0) {
    return {
      action: 'unknown',
      error: 'Please enter a command',
    };
  }
  
  // Check for clear/delete all commands
  if (lower.match(/^(clear|delete all|remove all)/)) {
    return {
      action: 'clear',
    };
  }
  
  // Check for create/make/add commands
  if (lower.match(/^(create|make|add|build|generate)/)) {
    // Check for text
    const text = extractText(command);
    if (text || lower.includes('text') || lower.includes('word')) {
      return {
        action: 'create',
        objectType: 'text3d',
        properties: {
          text: text || 'Hello',
          color: extractColor(command),
          position: extractPosition(command),
          size: extractSize(command),
        },
      };
    }
    
    // Check for molecule
    const molecule = extractMolecule(command);
    if (molecule) {
      return {
        action: 'create',
        objectType: 'molecule',
        properties: {
          moleculeName: molecule,
          position: extractPosition(command),
        },
      };
    }
    
    // Check for basic shapes
    const shape = extractShape(command);
    if (shape) {
      const count = extractCount(command);
      return {
        action: 'create',
        objectType: shape as any,
        properties: {
          color: extractColor(command),
          size: extractSize(command),
          position: extractPosition(command),
          material: extractMaterial(command),
          count: count,
          arrangement: lower.includes('circle') ? 'circle' : lower.includes('grid') ? 'grid' : lower.includes('row') ? 'row' : undefined,
        },
      };
    }
    
    return {
      action: 'unknown',
      error: `Could not identify what to create. Try: "create sphere", "make cube", "add water molecule"`,
    };
  }
  
  return {
    action: 'unknown',
    error: 'Command not recognized. Try: "create sphere", "make red cube", "add water molecule"',
  };
}

/**
 * Parse command using AI (for complex/ambiguous commands)
 */
export async function parseCommandWithAI(command: string, apiKey: string): Promise<ParsedCommand> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Parse this 3D object creation command into structured JSON data.
Command: "${command}"

Return ONLY a valid JSON object with this structure (no markdown, no code blocks):
{
  "action": "create|delete|modify|clear|unknown",
  "objectType": "cube|sphere|cylinder|cone|torus|pyramid|plane|text3d|molecule",
  "properties": {
    "color": "#RRGGBB hex color if mentioned",
    "size": number or "small"|"medium"|"large",
    "position": [x,y,z] array or "left"|"right"|"center"|"above"|"below",
    "text": "text content if creating text",
    "moleculeName": "Water|Methane|Ethanol|Benzene if creating molecule",
    "count": number if creating multiple objects,
    "material": { "metalness": 0-1, "roughness": 0-1, "opacity": 0-1, "emissiveIntensity": 0-1 }
  }
}

Available shapes: cube, sphere, cylinder, cone, torus, pyramid, plane, text3d
Available molecules: Water, Methane, Ethanol, Benzene
Colors: Use hex codes like #FF0000 for red, #0000FF for blue, etc.

Examples:
"create red sphere" → {"action":"create","objectType":"sphere","properties":{"color":"#FF0000"}}
"make water molecule" → {"action":"create","objectType":"molecule","properties":{"moleculeName":"Water"}}
"add 3D text Hello" → {"action":"create","objectType":"text3d","properties":{"text":"Hello"}}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Extract JSON from response (remove markdown code blocks if present)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Convert color names to hex if needed
    if (parsed.properties?.color && !parsed.properties.color.startsWith('#')) {
      parsed.properties.color = COLOR_MAP[parsed.properties.color.toLowerCase()] || parsed.properties.color;
    }
    
    return parsed;
  } catch (error) {
    console.error('AI parsing failed:', error);
    // Fallback to simple parsing
    return parseCommandSimple(command);
  }
}

/**
 * Main command parser - tries simple parsing first, falls back to AI if needed
 */
export async function parseCommand(command: string, apiKey?: string): Promise<ParsedCommand> {
  // Try simple parsing first
  const simpleResult = parseCommandSimple(command);
  
  // If simple parsing worked and found a clear action, use it
  if (simpleResult.action !== 'unknown') {
    return simpleResult;
  }
  
  // If AI key is available and command is complex, use AI
  if (apiKey && command.length > 10) {
    try {
      return await parseCommandWithAI(command, apiKey);
    } catch (error) {
      // If AI fails, return the simple result
      return simpleResult;
    }
  }
  
  return simpleResult;
}

/**
 * Get command suggestions based on partial input
 */
export function getCommandSuggestions(partialCommand: string): string[] {
  const lower = partialCommand.toLowerCase();
  
  const allSuggestions = [
    'create sphere',
    'make red cube',
    'add blue cylinder',
    'create water molecule',
    'make methane',
    'add 3D text "Hello"',
    'create large yellow sphere',
    'make small green cone',
    'add transparent cube',
    'create metallic sphere',
    'make 5 spheres in a circle',
    'add benzene molecule',
    'create glowing red cylinder',
    'make gold sphere',
  ];
  
  if (!partialCommand || partialCommand.length < 2) {
    return allSuggestions.slice(0, 5);
  }
  
  const filtered = allSuggestions.filter(s => s.toLowerCase().includes(lower));
  return filtered.slice(0, 5);
}
