// Video Storage Configuration
// Replace these with your actual storage URLs

export const VIDEO_STORAGE_CONFIG = {
  // AWS S3 Configuration
  s3: {
    bucketName: 'fusioned-videos',
    region: 'us-east-1',
    baseUrl: 'https://fusioned-videos.s3.amazonaws.com',
    cdnUrl: 'https://d1234567890.cloudfront.net', // CloudFront CDN URL
  },
  
  // Alternative: Vimeo Configuration
  vimeo: {
    baseUrl: 'https://player.vimeo.com/video',
    apiUrl: 'https://api.vimeo.com',
  },
  
  // Alternative: YouTube Configuration
  youtube: {
    baseUrl: 'https://www.youtube.com/embed',
    apiUrl: 'https://www.googleapis.com/youtube/v3',
  }
};

// Video URL Generator Functions
export const generateVideoUrl = (videoPath: string, storageType: 's3' | 'vimeo' | 'youtube' = 's3') => {
  switch (storageType) {
    case 's3':
      return `${VIDEO_STORAGE_CONFIG.s3.cdnUrl}/${videoPath}`;
    case 'vimeo':
      return `${VIDEO_STORAGE_CONFIG.vimeo.baseUrl}/${videoPath}`;
    case 'youtube':
      return `${VIDEO_STORAGE_CONFIG.youtube.baseUrl}/${videoPath}`;
    default:
      return videoPath; // Fallback to direct URL
  }
};

// Example video paths for your courses
export const VIDEO_PATHS = {
  physics: {
    kinematics: 'courses/physics/kinematics/introduction.mp4',
    newtonsLaws: 'courses/physics/kinematics/newtons-laws.mp4',
    energyMomentum: 'courses/physics/kinematics/energy-momentum.mp4',
    projectileMotion: 'courses/physics/kinematics/projectile-motion.mp4',
  },
  chemistry: {
    atomicStructure: 'courses/chemistry/atomic-structure/introduction.mp4',
    chemicalBonding: 'courses/chemistry/atomic-structure/chemical-bonding.mp4',
    reactions: 'courses/chemistry/reactions/stoichiometry.mp4',
    organicChemistry: 'courses/chemistry/organic/molecular-structures.mp4',
  },
  mathematics: {
    algebra: 'courses/mathematics/algebra/linear-equations.mp4',
    geometry: 'courses/mathematics/geometry/3d-visualizations.mp4',
    calculus: 'courses/mathematics/calculus/derivatives.mp4',
    statistics: 'courses/mathematics/statistics/probability.mp4',
  },
  biology: {
    cellBiology: 'courses/biology/cell-biology/structure.mp4',
    genetics: 'courses/biology/genetics/dna-structure.mp4',
    humanBiology: 'courses/biology/human/body-systems.mp4',
    ecology: 'courses/biology/ecology/ecosystems.mp4',
  }
};

// Helper function to get video URL for a specific course and lesson
export const getVideoUrl = (subject: keyof typeof VIDEO_PATHS, lesson: string, storageType: 's3' | 'vimeo' | 'youtube' = 's3') => {
  const path = VIDEO_PATHS[subject][lesson as keyof typeof VIDEO_PATHS[typeof subject]];
  if (!path) {
    console.warn(`Video path not found for ${subject}/${lesson}`);
    return '';
  }
  return generateVideoUrl(path, storageType);
};

// Upload helper function (for future implementation)
export const uploadVideo = async (file: File, path: string): Promise<string> => {
  // This would integrate with your backend API
  // For now, return a placeholder
  console.log(`Uploading video: ${file.name} to ${path}`);
  return `https://your-storage.com/${path}`;
};

// Video quality options
export const VIDEO_QUALITIES = [
  { label: 'Auto', value: 'auto' },
  { label: '1080p', value: '1080p' },
  { label: '720p', value: '720p' },
  { label: '480p', value: '480p' },
  { label: '360p', value: '360p' },
];

// Video format support
export const SUPPORTED_FORMATS = [
  'mp4',
  'webm',
  'ogg',
  'mov',
  'avi'
];

// Storage cost calculator (rough estimates)
export const calculateStorageCost = (sizeInGB: number, storageType: 's3' | 'vimeo' | 'youtube' = 's3') => {
  const costs = {
    s3: 0.023, // $0.023 per GB per month
    vimeo: 0.075, // $75/month for 1TB
    youtube: 0, // Free but with limitations
  };
  
  return sizeInGB * costs[storageType];
};
