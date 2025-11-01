import { supabase } from './supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface HomeworkUpload {
  id: string;
  user_id: string;
  image_url: string;
  file_name: string;
  file_size: number;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface HomeworkAnalysis {
  id: string;
  upload_id: string;
  ocr_text: string | null;
  content_type: string | null;
  sub_topic: string | null;
  question_type: string | null;
  processing_metadata: Record<string, unknown>;
  confidence: number | null;
  created_at: string;
}

export interface HomeworkSolution {
  id: string;
  analysis_id: string;
  explanation: string;
  step_by_step_solution: Array<{ step: number; title: string; content: string; }>;
  common_mistakes: string[];
  related_concepts: string[];
  practice_problems: Array<{ question: string; difficulty: string; }>;
  resources: Array<{ title: string; url?: string; description: string; }>;
  created_at: string;
}

export interface FullHomeworkResult {
  upload: HomeworkUpload;
  analysis: HomeworkAnalysis;
  solution: HomeworkSolution;
}

/**
 * Upload homework image to Supabase storage
 */
export async function uploadHomeworkImage(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('homework-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('homework-images')
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Create homework upload record
 */
export async function createHomeworkUpload(
  userId: string,
  imageUrl: string,
  fileName: string,
  fileSize: number,
  format: string,
  metadata: Record<string, unknown> = {}
): Promise<HomeworkUpload> {
  const { data, error } = await supabase
    .from('homework_uploads')
    .insert({
      user_id: userId,
      image_url: imageUrl,
      file_name: fileName,
      file_size: fileSize,
      format: format,
      status: 'pending',
      metadata: metadata
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create upload record: ${error.message}`);
  }

  return data;
}

/**
 * Update homework upload status
 */
export async function updateHomeworkUploadStatus(
  uploadId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed'
): Promise<void> {
  const { error } = await supabase
    .from('homework_uploads')
    .update({ status })
    .eq('id', uploadId);

  if (error) {
    throw new Error(`Failed to update upload status: ${error.message}`);
  }
}

/**
 * Convert file to base64 for AI analysis
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Analyze homework image using Google Gemini Vision AI
 */
export async function analyzeHomeworkImage(
  file: File,
  uploadId: string,
  apiKey: string
): Promise<{ analysis: HomeworkAnalysis; solution: HomeworkSolution }> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert file to base64
    const base64Data = await fileToBase64(file);
    
    // Create the prompt for comprehensive analysis
    const prompt = `You are an expert educational AI tutor. Analyze this homework problem image and provide a comprehensive response in JSON format.

Please provide:
1. Extract and transcribe all text (including handwritten text and mathematical equations)
2. Identify the subject area (Math, Science, English, History, etc.)
3. Identify the sub-topic
4. Classify the question type (problem-solving, multiple choice, essay, etc.)
5. Provide a detailed step-by-step solution with clear reasoning
6. List common mistakes students make with this type of problem
7. List related concepts the student should understand
8. Generate 3-5 similar practice problems with varying difficulty
9. Suggest helpful learning resources

Return ONLY a valid JSON object with this exact structure:
{
  "extracted_text": "full transcription of the problem",
  "content_type": "subject area",
  "sub_topic": "specific topic",
  "question_type": "type of question",
  "confidence": 0.95,
  "explanation": "clear explanation of what the problem is asking",
  "step_by_step_solution": [
    {
      "step": 1,
      "title": "Step title",
      "content": "Detailed explanation with reasoning"
    }
  ],
  "final_answer": "the final answer",
  "common_mistakes": ["mistake 1", "mistake 2"],
  "related_concepts": ["concept 1", "concept 2"],
  "practice_problems": [
    {
      "question": "practice problem text",
      "difficulty": "easy/medium/hard",
      "hint": "optional hint"
    }
  ],
  "resources": [
    {
      "title": "resource title",
      "description": "what this resource covers",
      "url": "optional URL"
    }
  ]
}`;

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text;
    if (text.includes('```json')) {
      jsonText = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      jsonText = text.split('```')[1].split('```')[0].trim();
    }
    
    const aiResponse = JSON.parse(jsonText);

    // Create analysis record
    const { data: analysisData, error: analysisError } = await supabase
      .from('homework_analysis')
      .insert({
        upload_id: uploadId,
        ocr_text: aiResponse.extracted_text,
        content_type: aiResponse.content_type,
        sub_topic: aiResponse.sub_topic,
        question_type: aiResponse.question_type,
        confidence: aiResponse.confidence,
        processing_metadata: {
          model: 'gemini-1.5-flash',
          timestamp: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (analysisError) {
      throw new Error(`Failed to save analysis: ${analysisError.message}`);
    }

    // Create solution record
    const { data: solutionData, error: solutionError } = await supabase
      .from('homework_solutions')
      .insert({
        analysis_id: analysisData.id,
        explanation: aiResponse.explanation,
        step_by_step_solution: aiResponse.step_by_step_solution,
        common_mistakes: aiResponse.common_mistakes,
        related_concepts: aiResponse.related_concepts,
        practice_problems: aiResponse.practice_problems,
        resources: aiResponse.resources
      })
      .select()
      .single();

    if (solutionError) {
      throw new Error(`Failed to save solution: ${solutionError.message}`);
    }

    return {
      analysis: analysisData,
      solution: solutionData
    };
  } catch (error) {
    console.error('Error analyzing homework:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please check your settings and try again.');
      } else if (error.message.includes('quota') || error.message.includes('429')) {
        throw new Error('API quota exceeded. Please try again later or check your API key limits.');
      } else if (error.message.includes('JSON')) {
        throw new Error('Failed to process AI response. Please try again with a clearer image.');
      } else if (error.message.includes('Failed to save')) {
        throw new Error('Failed to save results to database. Please check your connection and try again.');
      }
      throw error;
    }
    
    throw new Error('Failed to analyze homework. Please try again.');
  }
}

/**
 * Get user's homework upload history
 */
export async function getHomeworkHistory(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<HomeworkUpload[]> {
  const { data, error } = await supabase
    .from('homework_uploads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch homework history: ${error.message}`);
  }

  return data || [];
}

/**
 * Get full homework result (upload + analysis + solution)
 */
export async function getHomeworkResult(uploadId: string): Promise<FullHomeworkResult | null> {
  // Get upload
  const { data: upload, error: uploadError } = await supabase
    .from('homework_uploads')
    .select('*')
    .eq('id', uploadId)
    .single();

  if (uploadError || !upload) {
    throw new Error(`Failed to fetch upload: ${uploadError?.message}`);
  }

  // Get analysis
  const { data: analysis, error: analysisError } = await supabase
    .from('homework_analysis')
    .select('*')
    .eq('upload_id', uploadId)
    .single();

  if (analysisError || !analysis) {
    return null; // Analysis not yet available
  }

  // Get solution
  const { data: solution, error: solutionError } = await supabase
    .from('homework_solutions')
    .select('*')
    .eq('analysis_id', analysis.id)
    .single();

  if (solutionError || !solution) {
    return null; // Solution not yet available
  }

  return {
    upload,
    analysis,
    solution
  };
}

/**
 * Delete homework upload and related data
 */
export async function deleteHomeworkUpload(uploadId: string, imageUrl: string): Promise<void> {
  // Extract file path from URL
  const urlParts = imageUrl.split('/homework-images/');
  if (urlParts.length > 1) {
    const filePath = urlParts[1].split('?')[0];
    
    // Delete from storage
    await supabase.storage
      .from('homework-images')
      .remove([filePath]);
  }

  // Delete from database (cascades to analysis and solution)
  const { error } = await supabase
    .from('homework_uploads')
    .delete()
    .eq('id', uploadId);

  if (error) {
    throw new Error(`Failed to delete upload: ${error.message}`);
  }
}

/**
 * Search homework history
 */
export async function searchHomeworkHistory(
  userId: string,
  searchQuery: string
): Promise<FullHomeworkResult[]> {
  const { data: uploads, error } = await supabase
    .from('homework_uploads')
    .select(`
      *,
      homework_analysis (
        *,
        homework_solutions (*)
      )
    `)
    .eq('user_id', userId)
    .ilike('file_name', `%${searchQuery}%`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to search homework: ${error.message}`);
  }

  interface UploadWithRelations extends HomeworkUpload {
    homework_analysis?: Array<HomeworkAnalysis & {
      homework_solutions?: HomeworkSolution[];
    }>;
  }

  return (uploads as UploadWithRelations[]).map((upload) => ({
    upload,
    analysis: upload.homework_analysis?.[0],
    solution: upload.homework_analysis?.[0]?.homework_solutions?.[0]
  })).filter((result): result is FullHomeworkResult => !!result.analysis && !!result.solution);
}
