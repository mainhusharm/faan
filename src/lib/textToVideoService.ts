// Text to Video Generation Service
import UserApiKeysService from './userApiKeys';
import GeminiImageGenerator from './geminiImageGenerator';

export interface VideoGenerationRequest {
  text: string;
  style: 'educational' | 'presentation' | 'tutorial' | 'animated';
  duration: number; // in minutes
  voice: 'male' | 'female' | 'neutral';
  backgroundMusic: boolean;
  quality: 'standard' | 'hd' | '4k';
}

export interface VideoGenerationResponse {
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  size: string;
  model: string;
  timestamp: string;
  cost: number;
}

export interface VideoGenerationProgress {
  stage: 'processing' | 'generating' | 'rendering' | 'uploading' | 'complete';
  progress: number; // 0-100
  message: string;
}

class TextToVideoService {
  private static instance: TextToVideoService;
  private userApiKeysService: UserApiKeysService;
  private imageGenerator: GeminiImageGenerator;

  private constructor() {
    this.userApiKeysService = UserApiKeysService.getInstance();
    this.imageGenerator = GeminiImageGenerator.getInstance();
  }

  static getInstance(): TextToVideoService {
    if (!TextToVideoService.instance) {
      TextToVideoService.instance = new TextToVideoService();
    }
    return TextToVideoService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      await this.imageGenerator.initialize();
      console.log('✅ Text to Video Service initialized successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Text to Video Service:', error);
      return false;
    }
  }

  async generateVideo(
    request: VideoGenerationRequest,
    onProgress?: (progress: VideoGenerationProgress) => void
  ): Promise<VideoGenerationResponse> {
    console.log('🎬 Starting video generation...', request);

    try {
      // Stage 1: Processing text and generating images
      onProgress?.({
        stage: 'processing',
        progress: 10,
        message: 'Processing text and generating visual content...'
      });

      // Generate images for the video
      const images = await this.generateVideoImages(request.text, request.style);
      
      onProgress?.({
        stage: 'generating',
        progress: 40,
        message: 'Creating video sequence...'
      });

      // Stage 2: Generate video (simulated for now)
      const videoData = await this.createVideoSequence(images, request);
      
      onProgress?.({
        stage: 'rendering',
        progress: 70,
        message: 'Rendering video with audio...'
      });

      // Stage 3: Add audio and finalize
      const finalVideo = await this.addAudioToVideo(videoData, request);
      
      onProgress?.({
        stage: 'uploading',
        progress: 90,
        message: 'Uploading video...'
      });

      // Stage 4: Upload and get final URL
      const videoUrl = await this.uploadVideo(finalVideo);
      
      onProgress?.({
        stage: 'complete',
        progress: 100,
        message: 'Video generation complete!'
      });

      return {
        videoUrl,
        thumbnailUrl: images[0] || '',
        duration: request.duration * 60, // Convert to seconds
        size: this.calculateVideoSize(request.duration, request.quality),
        model: 'fusioned-ai-video-v1',
        timestamp: new Date().toISOString(),
        cost: this.calculateCost(request)
      };

    } catch (error) {
      console.error('❌ Video generation failed:', error);
      throw new Error(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async generateVideoImages(text: string, style: string): Promise<string[]> {
    const images: string[] = [];
    
    // Split text into segments for different scenes
    const segments = this.splitTextIntoSegments(text);
    
    for (let i = 0; i < Math.min(segments.length, 5); i++) {
      try {
        const response = await this.imageGenerator.generateImage({
          prompt: `Educational video scene: ${segments[i]}. Style: ${style}. Clear, informative, suitable for learning.`,
          style: this.getImageStyle(style),
          aspectRatio: '16:9',
          quality: 'high'
        });
        
        images.push(response.imageUrl);
      } catch (error) {
        console.warn(`Failed to generate image for segment ${i}:`, error);
        // Continue with other segments
      }
    }
    
    return images;
  }

  private splitTextIntoSegments(text: string): string[] {
    // Simple text splitting - in a real implementation, this would be more sophisticated
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const segments: string[] = [];
    
    for (let i = 0; i < sentences.length; i += 2) {
      const segment = sentences.slice(i, i + 2).join('. ').trim();
      if (segment) {
        segments.push(segment);
      }
    }
    
    return segments.length > 0 ? segments : [text];
  }

  private getImageStyle(style: string): 'photographic' | 'digital_art' | 'sketch' | 'watercolor' | 'oil_painting' {
    const styleMap: Record<string, 'photographic' | 'digital_art' | 'sketch' | 'watercolor' | 'oil_painting'> = {
      'educational': 'digital_art',
      'presentation': 'photographic',
      'tutorial': 'digital_art',
      'animated': 'digital_art'
    };
    
    return styleMap[style] || 'digital_art';
  }

  private async createVideoSequence(images: string[], request: VideoGenerationRequest): Promise<any> {
    // Simulate video creation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would:
    // 1. Create video frames from images
    // 2. Add transitions between scenes
    // 3. Apply visual effects based on style
    // 4. Generate video file
    
    return {
      frames: images,
      duration: request.duration * 60,
      style: request.style
    };
  }

  private async addAudioToVideo(videoData: any, request: VideoGenerationRequest): Promise<any> {
    // Simulate audio addition
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real implementation, this would:
    // 1. Convert text to speech using TTS service
    // 2. Add background music if requested
    // 3. Mix audio with video
    // 4. Export final video file
    
    return {
      ...videoData,
      audio: {
        voice: request.voice,
        backgroundMusic: request.backgroundMusic,
        text: request.text
      }
    };
  }

  private async uploadVideo(videoData: any): Promise<string> {
    // Simulate video upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would upload to your video storage service
    // For now, return a demo URL
    return `https://demo-videos.s3.amazonaws.com/course-${Date.now()}.mp4`;
  }

  private calculateVideoSize(durationMinutes: number, quality: string): string {
    const baseSize = durationMinutes * 10; // MB per minute base
    const qualityMultiplier = {
      'standard': 1,
      'hd': 2,
      '4k': 4
    };
    
    const sizeInMB = baseSize * (qualityMultiplier[quality] || 1);
    
    if (sizeInMB < 1024) {
      return `${Math.round(sizeInMB)} MB`;
    } else {
      return `${Math.round(sizeInMB / 1024 * 10) / 10} GB`;
    }
  }

  private calculateCost(request: VideoGenerationRequest): number {
    // Pricing based on duration and quality
    const baseCost = request.duration * 0.5; // $0.50 per minute
    const qualityMultiplier = {
      'standard': 1,
      'hd': 1.5,
      '4k': 2
    };
    
    const qualityCost = baseCost * (qualityMultiplier[request.quality] || 1);
    const musicCost = request.backgroundMusic ? 0.1 : 0;
    
    return Math.round((qualityCost + musicCost) * 100) / 100;
  }

  async getAvailableVoices(): Promise<Array<{id: string, name: string, language: string}>> {
    return [
      { id: 'male', name: 'Male Voice', language: 'en-US' },
      { id: 'female', name: 'Female Voice', language: 'en-US' },
      { id: 'neutral', name: 'Neutral Voice', language: 'en-US' }
    ];
  }

  async getVideoStyles(): Promise<Array<{id: string, name: string, description: string}>> {
    return [
      { 
        id: 'educational', 
        name: 'Educational', 
        description: 'Clean, informative style perfect for learning content' 
      },
      { 
        id: 'presentation', 
        name: 'Presentation', 
        description: 'Professional style suitable for business presentations' 
      },
      { 
        id: 'tutorial', 
        name: 'Tutorial', 
        description: 'Step-by-step style ideal for how-to content' 
      },
      { 
        id: 'animated', 
        name: 'Animated', 
        description: 'Dynamic, engaging style with visual effects' 
      }
    ];
  }

  async estimateCost(request: VideoGenerationRequest): Promise<number> {
    return this.calculateCost(request);
  }

  async estimateGenerationTime(request: VideoGenerationRequest): Promise<number> {
    // Estimate in minutes
    const baseTime = request.duration * 0.5; // 30 seconds per minute of content
    const qualityMultiplier = {
      'standard': 1,
      'hd': 1.5,
      '4k': 2
    };
    
    return Math.max(1, Math.round(baseTime * (qualityMultiplier[request.quality] || 1)));
  }
}

export default TextToVideoService;
