import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Camera, History, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import ImageUploader from '../components/Homework/ImageUploader';
import ImageEditor from '../components/Homework/ImageEditor';
import ProcessingStatus from '../components/Homework/ProcessingStatus';
import SolutionDisplay from '../components/Homework/SolutionDisplay';
import HomeworkHistory from '../components/Homework/HomeworkHistory';
import {
  uploadHomeworkImage,
  createHomeworkUpload,
  updateHomeworkUploadStatus,
  getHomeworkResult,
  FullHomeworkResult,
} from '../lib/homeworkService';
import { getUserApiKey } from '../lib/userApiKeys';

type ViewMode = 'upload' | 'history';
type ProcessingStep = 'idle' | 'uploading' | 'analyzing' | 'generating' | 'completed' | 'error';

const HomeworkPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('upload');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingImage, setEditingImage] = useState<File | null>(null);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FullHomeworkResult | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    loadApiKey();
    console.log('🏠 Homework component mounted');
    console.log('👤 User:', user?.email || 'Not logged in');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Log when images change
  useEffect(() => {
    console.log('=== IMAGE STATE CHANGED ===');
    console.log('📸 Selected image:', selectedImage?.name || 'None');
    console.log('🔘 Button should be:', selectedImage ? 'ENABLED (blue)' : 'DISABLED (gray)');
  }, [selectedImage]);

  // Log when analyzing state changes  
  useEffect(() => {
    console.log('=== PROCESSING STATE CHANGED ===');
    console.log('🔄 Processing state:', processingStep);
  }, [processingStep]);

  const loadApiKey = async () => {
    if (!user) return;
    try {
      const key = await getUserApiKey(user.id, 'gemini');
      setApiKey(key);
      console.log('🔑 Gemini API Key loaded from user settings:', !!key);
      if (key) {
        console.log('🔑 API Key source: user-settings');
      } else {
        console.log('⚠️ No Gemini API key found in user settings');
      }
    } catch (error) {
      console.error('Error loading API key:', error);
      setApiKey(null);
    }
  };

  const handleImageSelected = (file: File) => {
    console.log('=== IMAGE SELECTED ===');
    console.log('📸 Image selected:', file.name, file.size, file.type);
    console.log('✅ Setting selectedImage state');
    setSelectedImage(file);
    setEditingImage(null);
    setResult(null);
    setError(null);
    console.log('✅ Button should now be ENABLED (blue)');
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setEditingImage(null);
    setResult(null);
    setError(null);
    setProcessingStep('idle');
  };

  const handleEditImage = () => {
    if (selectedImage) {
      setEditingImage(selectedImage);
    }
  };

  const handleSaveEdit = (editedImage: File) => {
    setSelectedImage(editedImage);
    setEditingImage(null);
  };

  const handleCancelEdit = () => {
    setEditingImage(null);
  };

  const handleProcess = async () => {
    console.log('=== ANALYZE BUTTON CLICKED ===');
    console.log('📷 Selected Image:', selectedImage?.name);
    console.log('👤 User:', user?.email);
    console.log('🔄 Processing Step:', processingStep);
    
    if (!selectedImage) {
      console.error('❌ No image selected');
      alert('❌ Please upload an image first');
      return;
    }
    
    if (!user) {
      console.error('❌ No user signed in');
      alert('❌ Please sign in first');
      return;
    }
    
    setProcessingStep('analyzing');
    setError(null);
    
    try {
      // Check if user has configured their Gemini API key
      console.log('🔑 Checking for Gemini API Key...');
      console.log('🔑 API Key from user settings:', !!apiKey);
      
      if (!apiKey) {
        console.error('❌ No Gemini API key found in user settings!');
        const redirectToSettings = confirm(
          '❌ No Gemini API key found!\n\n' +
          'Please add your Gemini API key in Settings to use the AI Homework Helper.\n\n' +
          'Click OK to go to API Settings now, or Cancel to stay here.'
        );
        
        if (redirectToSettings) {
          window.location.href = '/api-settings';
        }
        
        setProcessingStep('idle');
        return;
      }
      
      console.log('✅ Gemini API key found from user settings, proceeding...');
      
      // Convert image to base64
      console.log('📸 Converting image to base64...');
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedImage);
      });
      
      const base64Data = await base64Promise;
      const base64Image = base64Data.split(',')[1]; // Remove data:image prefix
      
      console.log('✅ Image converted to base64');
      console.log('📊 Base64 length:', base64Image.length);
      
      // Call Gemini API directly with fetch using user's API key
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      console.log('📡 Calling Gemini API with user API key...');
      console.log('🌐 URL:', url.replace(apiKey, 'API_KEY_HIDDEN'));
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: "Analyze this homework problem and provide:\n\n1. SUBJECT & TOPIC: What is this about?\n2. PROBLEM: What is being asked?\n3. SOLUTION: Step-by-step solution\n4. ANSWER: Final answer\n5. TIPS: Key tips\n\nBe clear and detailed."
              },
              {
                inline_data: {
                  mime_type: selectedImage.type || "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }]
        })
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response OK:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        
        // Provide specific error messages based on status code
        if (response.status === 400) {
          const redirectToSettings = confirm(
            '❌ Invalid API key!\n\n' +
            'Your Gemini API key appears to be invalid or incorrectly configured.\n\n' +
            'Click OK to go to API Settings and update your key, or Cancel to stay here.'
          );
          
          if (redirectToSettings) {
            window.location.href = '/api-settings';
          }
          
          setProcessingStep('idle');
          return;
        } else if (response.status === 429) {
          alert(
            '❌ API Quota Exceeded!\n\n' +
            'Your Gemini API key has exceeded its quota.\n' +
            'Please check your usage at https://makersuite.google.com/app/apikey'
          );
          setProcessingStep('idle');
          return;
        } else if (response.status === 403) {
          alert(
            '❌ API Access Denied!\n\n' +
            'Your Gemini API key does not have permission to access this API.\n' +
            'Please check your API key configuration.'
          );
          setProcessingStep('idle');
          return;
        }
        
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Got response from Gemini');
      console.log('📦 Response data:', data);
      
      // Extract the text from response
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No solution generated';
      console.log('📝 Solution text length:', resultText.length);
      console.log('📝 Solution preview:', resultText.substring(0, 100) + '...');
      
      // Upload image to storage and create records (for history)
      console.log('💾 Saving to database...');
      setProcessingStep('uploading');
      const imageUrl = await uploadHomeworkImage(selectedImage, user.id);
      const upload = await createHomeworkUpload(
        user.id,
        imageUrl,
        selectedImage.name,
        selectedImage.size,
        selectedImage.type
      );
      await updateHomeworkUploadStatus(upload.id, 'completed');
      console.log('✅ Saved to database');
      
      // Create simplified analysis and solution records
      setProcessingStep('generating');
      
      // Parse the AI response into structured format
      const analysis = {
        id: upload.id,
        upload_id: upload.id,
        ocr_text: resultText.substring(0, 1000),
        content_type: 'General',
        sub_topic: 'Homework Help',
        question_type: 'Problem',
        processing_metadata: { model: 'gemini-1.5-flash', method: 'direct-api' },
        confidence: 0.9,
        created_at: new Date().toISOString()
      };
      
      const solution = {
        id: upload.id,
        analysis_id: upload.id,
        explanation: resultText,
        step_by_step_solution: [
          {
            step: 1,
            title: 'AI Solution',
            content: resultText
          }
        ],
        common_mistakes: [],
        related_concepts: [],
        practice_problems: [],
        resources: [],
        created_at: new Date().toISOString()
      };
      
      setResult({
        upload,
        analysis,
        solution
      });
      
      setProcessingStep('completed');
      console.log('✅✅✅ ANALYSIS COMPLETE! ✅✅✅');
      alert('✅ Analysis complete! Scroll down to see the solution.');
      
    } catch (error) {
      console.error('❌❌❌ ERROR OCCURRED ❌❌❌');
      console.error('❌ Error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error analyzing image';
      setError(errorMessage);
      alert('❌ Error: ' + errorMessage);
      setProcessingStep('error');
    }
  };

  const handleViewSolution = async (uploadId: string) => {
    try {
      const homeworkResult = await getHomeworkResult(uploadId);
      if (homeworkResult) {
        setResult(homeworkResult);
        setViewMode('upload');
        setSelectedImage(null);
        setProcessingStep('completed');
      }
    } catch (error) {
      console.error('Error loading solution:', error);
      alert('Failed to load solution. Please try again.');
    }
  };

  const handleNewUpload = () => {
    setSelectedImage(null);
    setResult(null);
    setProcessingStep('idle');
    setError(null);
    setViewMode('upload');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to use the Homework Helper feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 rounded-full opacity-30 blur-xl animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            AI Homework Helper
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload a photo of your homework problem and get instant step-by-step solutions with AI-powered explanations
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('upload')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                viewMode === 'upload'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Camera className="h-5 w-5" />
              <span>Upload</span>
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                viewMode === 'history'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <History className="h-5 w-5" />
              <span>History</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'upload' ? (
          <div className="space-y-8">
            {/* API Key Warning */}
            {!apiKey && processingStep === 'idle' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                      API Key Required
                    </h3>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Please configure your Gemini API key in{' '}
                      <a href="/api-settings" className="underline hover:text-yellow-900 dark:hover:text-yellow-100">
                        Settings
                      </a>{' '}
                      to use the AI Homework Helper.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Interface */}
            {processingStep === 'idle' && !result && (
              <>
                <ImageUploader
                  onImageSelected={handleImageSelected}
                  selectedImage={selectedImage}
                  onClear={handleClearImage}
                />

                {/* Action Buttons */}
                {selectedImage && (
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleEditImage}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-200"
                    >
                      Edit Image
                    </button>
                    <button
                      onClick={handleProcess}
                      disabled={!selectedImage || processingStep === 'analyzing' || processingStep === 'uploading' || processingStep === 'generating'}
                      className="flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                      style={{
                        backgroundColor: (!selectedImage || processingStep === 'analyzing' || processingStep === 'uploading' || processingStep === 'generating') ? '#9ca3af' : '#2563eb',
                        color: 'white',
                        padding: '12px 32px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: (!selectedImage || processingStep === 'analyzing' || processingStep === 'uploading' || processingStep === 'generating') ? 'not-allowed' : 'pointer',
                        opacity: (!selectedImage || processingStep === 'analyzing' || processingStep === 'uploading' || processingStep === 'generating') ? 0.5 : 1,
                        border: 'none',
                      }}
                    >
                      {processingStep === 'analyzing' || processingStep === 'uploading' || processingStep === 'generating' ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          <span>Analyze with AI</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Processing Status */}
            {processingStep !== 'idle' && processingStep !== 'completed' && (
              <ProcessingStatus status={processingStep} error={error || undefined} />
            )}

            {/* Solution Display */}
            {processingStep === 'completed' && result && (
              <>
                <SolutionDisplay
                  analysis={result.analysis}
                  solution={result.solution}
                  onAskFollowUp={() => {
                    // TODO: Integrate with Overhaul Chat
                    alert('Follow-up chat feature coming soon!');
                  }}
                  onSaveToNotes={() => {
                    // TODO: Integrate with Notes system
                    alert('Save to notes feature coming soon!');
                  }}
                  onExportPDF={() => {
                    // TODO: Implement PDF export
                    alert('PDF export feature coming soon!');
                  }}
                />

                {/* New Upload Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleNewUpload}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg transform hover:scale-105"
                  >
                    <Camera className="h-5 w-5" />
                    <span>Upload Another Problem</span>
                  </button>
                </div>
              </>
            )}

            {/* Error Display */}
            {processingStep === 'error' && error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Processing Failed
                </h3>
                <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
                <button
                  onClick={handleNewUpload}
                  className="px-6 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-900 dark:text-red-100 rounded-lg font-semibold transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        ) : (
          <HomeworkHistory userId={user.id} onViewSolution={handleViewSolution} />
        )}

        {/* Image Editor Modal */}
        {editingImage && (
          <ImageEditor
            image={editingImage}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        )}
      </div>
    </div>
  );
};

export default HomeworkPage;
