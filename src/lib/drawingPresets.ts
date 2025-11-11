export interface DrawingPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultColor: string;
  suggestedColors: string[];
}

export interface CarPreset extends DrawingPreset {
  type: 'car';
  bodyColor?: string;
  wheelColor?: string;
  windowColor?: string;
}

export const DRAWING_PRESETS: DrawingPreset[] = [
  {
    id: 'car',
    name: 'Car',
    icon: '🚗',
    description: 'Draw a car with wheels and details',
    defaultColor: '#FF0000',
    suggestedColors: ['#FF0000', '#0000FF', '#000000', '#FFFFFF', '#FFA500', '#00FF00'],
  },
  {
    id: 'house',
    name: 'House',
    icon: '🏠',
    description: 'Draw a house with roof',
    defaultColor: '#8B4513',
    suggestedColors: ['#8B4513', '#FF0000', '#FFFFFF', '#D2B48C', '#000000'],
  },
  {
    id: 'tree',
    name: 'Tree',
    icon: '🌳',
    description: 'Draw a tree with trunk and leaves',
    defaultColor: '#228B22',
    suggestedColors: ['#228B22', '#8B4513', '#32CD32', '#006400', '#00FF00'],
  },
  {
    id: 'flower',
    name: 'Flower',
    icon: '🌸',
    description: 'Draw a flower with petals',
    defaultColor: '#FF1493',
    suggestedColors: ['#FF1493', '#FF0000', '#FFFF00', '#FF69B4', '#FF00FF'],
  },
  {
    id: 'star',
    name: 'Star',
    icon: '⭐',
    description: 'Draw a star shape',
    defaultColor: '#FFD700',
    suggestedColors: ['#FFD700', '#FFA500', '#FF0000', '#FFFFFF', '#00FFFF'],
  },
  {
    id: 'heart',
    name: 'Heart',
    icon: '❤️',
    description: 'Draw a heart shape',
    defaultColor: '#FF0000',
    suggestedColors: ['#FF0000', '#FF1493', '#FF69B4', '#FF00FF', '#FF4500'],
  },
  {
    id: 'freeform',
    name: 'Freeform',
    icon: '✏️',
    description: 'Draw anything you want',
    defaultColor: '#000000',
    suggestedColors: ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FFA500'],
  },
];

export const CAR_PRESETS: Record<string, CarPreset> = {
  sedan: {
    id: 'sedan',
    name: 'Sedan',
    icon: '🚗',
    description: 'A classic sedan car',
    type: 'car',
    defaultColor: '#FF0000',
    bodyColor: '#FF0000',
    wheelColor: '#000000',
    windowColor: '#87CEEB',
    suggestedColors: ['#FF0000', '#0000FF', '#000000', '#FFFFFF', '#FFA500'],
  },
  suv: {
    id: 'suv',
    name: 'SUV',
    icon: '🚙',
    description: 'A large SUV car',
    type: 'car',
    defaultColor: '#0000FF',
    bodyColor: '#0000FF',
    wheelColor: '#333333',
    windowColor: '#87CEEB',
    suggestedColors: ['#0000FF', '#FF0000', '#000000', '#FFFFFF', '#808080'],
  },
  sports: {
    id: 'sports',
    name: 'Sports Car',
    icon: '🏎️',
    description: 'A fast sports car',
    type: 'car',
    defaultColor: '#FF6600',
    bodyColor: '#FF6600',
    wheelColor: '#000000',
    windowColor: '#000080',
    suggestedColors: ['#FF6600', '#FF0000', '#FFFF00', '#000000', '#FFA500'],
  },
};

export function getPresetById(id: string): DrawingPreset | undefined {
  return DRAWING_PRESETS.find(p => p.id === id);
}

export function getCarPresetById(id: string): CarPreset | undefined {
  return Object.values(CAR_PRESETS).find(p => p.id === id);
}

export function applyPresetStyling(presetId: string, baseColor: string): { primary: string; secondary: string; tertiary: string } {
  const preset = getPresetById(presetId);
  
  if (!preset) {
    return {
      primary: baseColor,
      secondary: '#000000',
      tertiary: '#FFFFFF',
    };
  }

  // Different color schemes for different presets
  if (presetId === 'car') {
    return {
      primary: baseColor, // body color
      secondary: '#000000', // wheels/details
      tertiary: '#87CEEB', // windows
    };
  } else if (presetId === 'house') {
    return {
      primary: baseColor, // walls
      secondary: '#FF0000', // roof
      tertiary: '#FFFF00', // windows
    };
  } else if (presetId === 'tree') {
    return {
      primary: '#228B22', // leaves
      secondary: baseColor, // trunk
      tertiary: '#000000', // details
    };
  } else if (presetId === 'flower') {
    return {
      primary: baseColor, // petals
      secondary: '#00FF00', // stem
      tertiary: '#FFD700', // center
    };
  }

  return {
    primary: baseColor,
    secondary: '#000000',
    tertiary: '#FFFFFF',
  };
}
