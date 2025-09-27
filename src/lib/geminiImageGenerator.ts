// Google Gemini 2.5 Flash Image Generation Service
import { GoogleGenerativeAI } from '@google/generative-ai';
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

class GeminiImageGenerator {
  private static instance: GeminiImageGenerator;
  private userApiKeysService: UserApiKeysService;
  private genAI: GoogleGenerativeAI | null = null;

  private constructor() {
    this.userApiKeysService = UserApiKeysService.getInstance();
  }

  static getInstance(): GeminiImageGenerator {
    if (!GeminiImageGenerator.instance) {
      GeminiImageGenerator.instance = new GeminiImageGenerator();
    }
    return GeminiImageGenerator.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      const apiKey = await this.userApiKeysService.getApiKey('gemini');
      
      if (!apiKey) {
        console.log('⚠️ No Gemini API key found, will use fallback services');
        return true; // Still works with fallbacks
      }

      console.log('🔑 Initializing Google Gemini 2.5 Flash Image...');
      this.genAI = new GoogleGenerativeAI(apiKey);
      console.log('✅ Gemini service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Gemini service:', error);
      return false;
    }
  }

  async generateImage(request: ImageRequest): Promise<ImageResponse> {
    console.log('🎨 Starting Gemini 2.5 Flash Image generation...');
    console.log('📝 Prompt:', request.prompt);

    try {
      // Try Gemini 2.5 Flash Image first if API key is available
      if (this.genAI) {
        console.log('🚀 Using Google Gemini 2.5 Flash Image...');
        return await this.generateWithGemini(request);
      }

      // Check for OpenAI key as fallback
      const openaiKey = await this.userApiKeysService.getApiKey('openai');
      if (openaiKey) {
        console.log('🎨 Using OpenAI DALL-E as fallback...');
        return await this.generateWithOpenAI(openaiKey, request.prompt);
      }

      // Final fallback to free service
      console.log('🌸 Using Pollinations AI (free service)...');
      return await this.generateWithPollinations(request.prompt);
      
    } catch (error) {
      console.error('❌ Gemini image generation failed:', error);
      
      // Try fallback services
      try {
        const openaiKey = await this.userApiKeysService.getApiKey('openai');
        if (openaiKey) {
          console.log('🔄 Trying OpenAI DALL-E fallback...');
          return await this.generateWithOpenAI(openaiKey, request.prompt);
        }
      } catch (fallbackError) {
        console.warn('⚠️ OpenAI fallback also failed:', fallbackError);
      }

      // Final fallback
      console.log('🔄 Using Pollinations AI as final fallback...');
      return await this.generateWithPollinations(request.prompt);
    }
  }

  private async generateWithGemini(request: ImageRequest): Promise<ImageResponse> {
    if (!this.genAI) {
      throw new Error('Gemini not initialized');
    }

    try {
      // Use Gemini 2.5 Flash Image model
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-image-preview' 
      });

      console.log('🎯 Generating with Gemini 2.5 Flash Image model...');
      
      // Create a detailed prompt for educational content
      const enhancedPrompt = `Create an educational illustration: ${request.prompt}. 
        Make it clear, informative, and suitable for learning materials. 
        Style: ${request.style || 'photographic'}. 
        Ensure high quality and educational value.`;

      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      
      // Extract image data from response
      const imageData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (!imageData) {
        throw new Error('No image data received from Gemini');
      }

      // Convert base64 to blob URL
      const imageBlob = new Blob([Uint8Array.from(atob(imageData), c => c.charCodeAt(0))], {
        type: 'image/png'
      });
      
      const imageUrl = URL.createObjectURL(imageBlob);

      return {
        imageUrl,
        prompt: `Gemini 2.5 Flash: ${request.prompt}`,
        model: 'gemini-2.5-flash-image-preview',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Gemini 2.5 Flash Image generation failed:', error);
      throw error;
    }
  }

  private async generateWithOpenAI(apiKey: string, prompt: string): Promise<ImageResponse> {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `Educational illustration: ${prompt}`,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural'
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data.data[0].url;

      return {
        imageUrl,
        prompt: `OpenAI DALL-E: ${prompt}`,
        model: 'dall-e-3',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ OpenAI generation failed:', error);
      throw error;
    }
  }

  private async generateWithPollinations(prompt: string): Promise<ImageResponse> {
    console.log('🌸 Using Pollinations AI...');
    
    const encodedPrompt = encodeURIComponent(`educational illustration: ${prompt}, clear, informative, learning material`);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${Date.now()}`;
    
    return {
      imageUrl,
      prompt: `Pollinations AI: ${prompt}`,
      model: 'pollinations-ai',
      timestamp: new Date().toISOString()
    };
  }
}

export default GeminiImageGenerator;
