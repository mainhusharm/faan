// AI Image Generation Service using multiple APIs with user-specific keys
import UserApiKeysService from './userApiKeys';

export interface ImageRequest {
  prompt: string;
  style?: 'photographic' | 'digital_art' | 'sketch' | 'watercolor' | 'oil_painting';
  aspectRatio?: '16:9' | '1:1' | '9:16' | '4:3' | '3:4';
  quality?: 'standard' | 'high';
}

export interface ImageResponse {
  imageUrl: string;
  prompt: string;
  model: string;
  timestamp: string;
}

class GeminiImageService {
  private static instance: GeminiImageService;
  private userApiKeysService: UserApiKeysService;

  private constructor() {
    this.userApiKeysService = UserApiKeysService.getInstance();
  }

  static getInstance(): GeminiImageService {
    if (!GeminiImageService.instance) {
      GeminiImageService.instance = new GeminiImageService();
    }
    return GeminiImageService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('✅ AI Image Service initialized successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize AI Image Service:', error);
      return false;
    }
  }

  async generateImage(request: ImageRequest): Promise<ImageResponse> {
    try {
      // Try Gemini first if user has API key
      const geminiApiKey = await this.userApiKeysService.getApiKey('gemini');
      if (geminiApiKey) {
        console.log('🎨 Using Gemini for image generation');
        // For now, Gemini doesn't have image generation, so we'll use it for text processing
        // and fall back to other services for actual image generation
        return await this.generateWithPollinations(request);
      }
      
      // Try OpenAI DALL-E if user has API key
      const openaiApiKey = await this.userApiKeysService.getApiKey('openai');
      if (openaiApiKey) {
        console.log('🎨 Using OpenAI DALL-E for image generation');
        return await this.generateWithOpenAI(request, openaiApiKey);
      }
      
      // Fallback to free services
      console.log('🎨 Using free Pollinations AI for image generation');
      return await this.generateWithPollinations(request);
      
    } catch (error) {
      console.error('❌ Image generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check for specific API errors
      if (errorMessage.includes('quota') || errorMessage.includes('limit') || errorMessage.includes('rate')) {
        throw new Error('API_RATE_LIMIT: Rate limit exceeded. Please try again later.');
      } else if (errorMessage.includes('billing') || errorMessage.includes('payment')) {
        throw new Error('API_BILLING: Billing limit reached. Please check your API billing.');
      } else if (errorMessage.includes('invalid') || errorMessage.includes('unauthorized')) {
        throw new Error('API_INVALID_KEY: Invalid API key. Please check your API key.');
      } else {
        throw new Error(`Image generation failed: ${errorMessage}`);
      }
    }
  }

  private async generateWithOpenAI(request: ImageRequest, apiKey: string): Promise<ImageResponse> {
    console.log('🎨 Generating image with OpenAI DALL-E...');
    
    const enhancedPrompt = this.enhancePrompt(request.prompt, request.style, request.aspectRatio);
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: this.getImageSize(request.aspectRatio),
        quality: request.quality || 'standard',
        style: request.style === 'photographic' ? 'natural' : 'vivid'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;

    return {
      imageUrl,
      prompt: enhancedPrompt,
      model: 'dall-e-3',
      timestamp: new Date().toISOString()
    };
  }

  private async generateWithPollinations(request: ImageRequest): Promise<ImageResponse> {
    console.log('🌸 Generating image with Pollinations AI...');
    
    const enhancedPrompt = this.enhancePrompt(request.prompt, request.style, request.aspectRatio);
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    
    // Get dimensions based on aspect ratio
    const dimensions = this.getImageDimensions(request.aspectRatio);
    
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dimensions.width}&height=${dimensions.height}&seed=${Date.now()}&model=flux&nologo=true`;
    
    return {
      imageUrl,
      prompt: enhancedPrompt,
      model: 'pollinations-ai',
      timestamp: new Date().toISOString()
    };
  }

  private enhancePrompt(prompt: string, style?: string, aspectRatio?: string): string {
    let enhanced = prompt;

    // Add style instructions
    if (style) {
      const styleInstructions = {
        'photographic': 'high-quality, realistic photographic image with sharp details and natural lighting',
        'digital_art': 'digital artwork with vibrant colors, clean lines, and modern digital art style',
        'sketch': 'hand-drawn sketch with pencil-like strokes, shading, and artistic line work',
        'watercolor': 'watercolor painting with soft, flowing colors, gentle brushstrokes, and artistic texture',
        'oil_painting': 'oil painting with rich, textured brushstrokes, deep colors, and classical art style'
      };
      enhanced += `, ${styleInstructions[style as keyof typeof styleInstructions] || ''}`;
    }

    // Add educational context
    enhanced += ', educational illustration, clear and informative, suitable for learning materials';

    return enhanced;
  }

  private getImageSize(aspectRatio?: string): string {
    const sizeMap = {
      '16:9': '1792x1024',
      '1:1': '1024x1024',
      '9:16': '1024x1792',
      '4:3': '1024x768',
      '3:4': '768x1024'
    };
    return sizeMap[aspectRatio as keyof typeof sizeMap] || '1792x1024';
  }

  private getImageDimensions(aspectRatio?: string): { width: number; height: number } {
    const dimensionMap = {
      '16:9': { width: 800, height: 450 },
      '1:1': { width: 600, height: 600 },
      '9:16': { width: 450, height: 800 },
      '4:3': { width: 600, height: 450 },
      '3:4': { width: 450, height: 600 }
    };
    return dimensionMap[aspectRatio as keyof typeof dimensionMap] || { width: 800, height: 450 };
  }

  async editImage(imageData: string, prompt: string): Promise<ImageResponse> {
    // For now, we'll use a simple approach - generate a new image with the edit prompt
    // In a real implementation, you'd use an image editing API
    console.log('✏️ Image editing not fully implemented yet, generating new image...');
    
    const editRequest: ImageRequest = {
      prompt: `Edit this image: ${prompt}`,
      style: 'digital_art'
    };
    
    return await this.generateImage(editRequest);
  }

  isInitialized(): boolean {
    return true; // Always available with fallbacks
  }

  async getApiKey(): Promise<string | null> {
    return await this.userApiKeysService.getApiKey('openai');
  }

  async hasApiKey(): Promise<boolean> {
    return await this.userApiKeysService.hasApiKey('openai');
  }
}

export default GeminiImageService;
