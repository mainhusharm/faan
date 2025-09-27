// AI Image Generation Service with Google Gemini integration
import GeminiImageGenerator from './geminiImageGenerator';

export interface ImageGenerationRequest {
  prompt: string;
  apiKey?: string;
  style?: 'photographic' | 'digital_art' | 'sketch' | 'watercolor' | 'oil_painting';
  aspectRatio?: '16:9' | '1:1' | '9:16' | '4:3' | '3:4';
}

export interface ImageGenerationResponse {
  imageUrl: string;
  prompt: string;
  model: string;
  timestamp: string;
}

// Fallback services
async function generateWithPollinations(prompt: string): Promise<ImageGenerationResponse> {
  console.log('🌸 Using Pollinations AI fallback...');
  const encodedPrompt = encodeURIComponent(`educational illustration: ${prompt}, clear, informative, learning material`);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${Date.now()}`;
  
  return {
    imageUrl,
    prompt: `Pollinations AI: ${prompt}`,
    model: 'pollinations-ai',
    timestamp: new Date().toISOString()
  };
}

async function generateWithPicsum(prompt: string): Promise<ImageGenerationResponse> {
  console.log('📸 Using Picsum.photos fallback...');
  const promptHash = prompt.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const keywords = extractEducationalKeywords(prompt);
  const seed = Math.abs(promptHash) % 10000;
  const imageUrl = `https://picsum.photos/seed/${keywords}-edu-${seed}/800/600`;
  
  return {
    imageUrl,
    prompt: `Demo image for: ${prompt}`,
    model: 'picsum-photos',
    timestamp: new Date().toISOString()
  };
}

// Extract educational keywords from prompt
function extractEducationalKeywords(prompt: string): string {
  const promptLower = prompt.toLowerCase();
  const keywords = [];
  
  if (promptLower.includes('science') || promptLower.includes('biology') || promptLower.includes('chemistry')) {
    keywords.push('science');
  }
  if (promptLower.includes('math') || promptLower.includes('mathematics') || promptLower.includes('equation')) {
    keywords.push('math');
  }
  if (promptLower.includes('history') || promptLower.includes('historical') || promptLower.includes('timeline')) {
    keywords.push('history');
  }
  if (promptLower.includes('art') || promptLower.includes('creative') || promptLower.includes('design')) {
    keywords.push('art');
  }
  if (promptLower.includes('education') || promptLower.includes('learning') || promptLower.includes('study')) {
    keywords.push('education');
  }
  
  return keywords.length > 0 ? keywords.join('-') : 'education';
}

// Main image generation function with Google Gemini integration
export async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  const { prompt, style, aspectRatio } = request;
  
  console.log('🚀 Starting image generation with Google Gemini...');
  console.log('📝 Prompt:', prompt);
  
  try {
    // Use Google Gemini service (with API key integration)
    const geminiService = GeminiImageGenerator.getInstance();
    
    // Initialize the service
    await geminiService.initialize();
    
    const result = await geminiService.generateImage({
      prompt,
      style,
      aspectRatio,
      quality: 'high'
    });
    
    console.log('✅ Image generated successfully with Gemini!');
    return result;
    
  } catch (error) {
    console.warn('⚠️ Gemini service failed, trying fallback...', error);
    
    try {
      // Fallback to Pollinations AI
      console.log('🎨 Using Pollinations AI fallback...');
      return await generateWithPollinations(prompt);
    } catch (pollinationsError) {
      console.warn('⚠️ Pollinations AI failed, trying Picsum fallback...', pollinationsError);
      
      try {
        // Final fallback to Picsum
        console.log('📸 Using Picsum.photos fallback...');
        return await generateWithPicsum(prompt);
      } catch (fallbackError) {
        console.error('❌ All image generation methods failed:', fallbackError);
        throw new Error('Image generation failed. Please try again later.');
      }
    }
  }
}

// Export the Gemini service for direct use
export { GeminiImageGenerator };