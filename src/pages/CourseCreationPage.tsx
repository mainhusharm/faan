import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Video, 
  Play, 
  Pause, 
  Download, 
  Upload, 
  Settings, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Wand2,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Zap,
  Crown
} from 'lucide-react';
import GeminiImageGenerator from '../lib/geminiImageGenerator';
import TextToVideoService, { VideoGenerationProgress } from '../lib/textToVideoService';
import { generateVideoUrl } from '../lib/videoStorage';
import VideoEditor from '../components/VideoEditor/VideoEditor';
import VideoEditorDemo from '../components/VideoEditor/VideoEditorDemo';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  videoMinutes: number;
  imageGenerations: number;
  popular?: boolean;
}

interface VideoGenerationRequest {
  text: string;
  style: 'educational' | 'presentation' | 'tutorial' | 'animated';
  duration: number;
  voice: 'male' | 'female' | 'neutral';
  backgroundMusic: boolean;
  quality: 'standard' | 'hd' | '4k';
}

const CourseCreationPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'text-to-video' | 'upload' | 'video-editor' | 'pricing'>('text-to-video');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('basic');
  const [generationProgress, setGenerationProgress] = useState<VideoGenerationProgress | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [showVideoEditorDemo, setShowVideoEditorDemo] = useState(false);
  const [videoRequest, setVideoRequest] = useState<VideoGenerationRequest>({
    text: '',
    style: 'educational',
    duration: 2,
    voice: 'neutral',
    backgroundMusic: true,
    quality: 'standard'
  });

  const pricingTiers: PricingTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      features: [
        '2 minutes of video generation',
        '5 AI image generations', 
        'Basic voice options (3 voices)',
        'Standard quality (720p)',
        'Basic templates',
        'Email support'
      ],
      videoMinutes: 2,
      imageGenerations: 5
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19.99,
      features: [
        '10 minutes of video generation',
        '25 AI image generations',
        'All voice options (6 voices)',
        'HD quality (1080p)',
        'Background music library',
        'Advanced templates',
        'Priority support',
        'Custom watermarks'
      ],
      videoMinutes: 10,
      imageGenerations: 25,
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 39.99,
      features: [
        '30 minutes of video generation',
        '100 AI image generations',
        'All voice options (12 voices)',
        '4K quality (2160p)',
        'Premium music library',
        'Custom branding',
        'White-label options',
        'Priority support',
        'API access',
        'Custom templates'
      ],
      videoMinutes: 30,
      imageGenerations: 100
    }
  ];

  const handleTextToVideo = async () => {
    if (!videoRequest.text.trim()) {
      alert('Please enter text for video generation');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(null);
    
    try {
      const textToVideoService = TextToVideoService.getInstance();
      await textToVideoService.initialize();
      
      const response = await textToVideoService.generateVideo(
        videoRequest,
        (progress) => {
          setGenerationProgress(progress);
        }
      );
      
      setGeneratedVideo(response.videoUrl);
      
    } catch (error) {
      console.error('Video generation failed:', error);
      alert('Video generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  const handleImageGeneration = async () => {
    try {
      const imageGenerator = GeminiImageGenerator.getInstance();
      await imageGenerator.initialize();
      
      const response = await imageGenerator.generateImage({
        prompt: `Educational illustration for course: ${videoRequest.text}`,
        style: 'digital_art',
        aspectRatio: '16:9',
        quality: 'high'
      });
      
      // Handle generated image
      console.log('Generated image:', response);
      
    } catch (error) {
      console.error('Image generation failed:', error);
    }
  };

  const selectedTierData = pricingTiers.find(tier => tier.id === selectedTier);

  // Calculate cost and time estimates when video request changes
  useEffect(() => {
    const calculateEstimates = async () => {
      if (videoRequest.text.trim()) {
        try {
          const textToVideoService = TextToVideoService.getInstance();
          await textToVideoService.initialize();
          
          const cost = await textToVideoService.estimateCost(videoRequest);
          const time = await textToVideoService.estimateGenerationTime(videoRequest);
          
          setEstimatedCost(cost);
          setEstimatedTime(time);
        } catch (error) {
          console.error('Failed to calculate estimates:', error);
        }
      }
    };

    calculateEstimates();
  }, [videoRequest]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Create Your Course
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Transform your ideas into engaging educational content with AI-powered tools
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'text-to-video', label: 'Text to Video', icon: Wand2 },
                { id: 'upload', label: 'Upload Content', icon: Upload },
                { id: 'video-editor', label: 'Video Editor', icon: Video },
                { id: 'pricing', label: 'Pricing Plans', icon: DollarSign }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'text-to-video' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Text to Video Generator
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Content
                    </label>
                    <textarea
                      value={videoRequest.text}
                      onChange={(e) => setVideoRequest({...videoRequest, text: e.target.value})}
                      placeholder="Enter your course content here... (e.g., 'Introduction to React: Learn the fundamentals of React development including components, state management, and hooks.')"
                      className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Style
                      </label>
                      <select
                        value={videoRequest.style}
                        onChange={(e) => setVideoRequest({...videoRequest, style: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="educational">Educational</option>
                        <option value="presentation">Presentation</option>
                        <option value="tutorial">Tutorial</option>
                        <option value="animated">Animated</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={videoRequest.duration}
                        onChange={(e) => setVideoRequest({...videoRequest, duration: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Voice
                      </label>
                      <select
                        value={videoRequest.voice}
                        onChange={(e) => setVideoRequest({...videoRequest, voice: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="neutral">Neutral</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quality
                      </label>
                      <select
                        value={videoRequest.quality}
                        onChange={(e) => setVideoRequest({...videoRequest, quality: e.target.value as any})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="standard">Standard (720p)</option>
                        <option value="hd">HD (1080p)</option>
                        <option value="4k">4K (2160p)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="backgroundMusic"
                      checked={videoRequest.backgroundMusic}
                      onChange={(e) => setVideoRequest({...videoRequest, backgroundMusic: e.target.checked})}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="backgroundMusic" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Background Music
                    </label>
                  </div>

                  {/* Cost and Time Estimates */}
                  {estimatedCost > 0 && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                            Estimated Cost
                          </p>
                          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            ${estimatedCost.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                            Est. Time
                          </p>
                          <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                            {estimatedTime} min
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={handleTextToVideo}
                      disabled={isGenerating || !videoRequest.text.trim()}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-5 w-5" />
                          <span>Generate Video</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleImageGeneration}
                      className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ImageIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <FileText className="h-5 w-5 text-indigo-600 mb-2" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Import from File</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Upload text document</div>
                  </button>
                  <button className="p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Sparkles className="h-5 w-5 text-emerald-600 mb-2" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">AI Enhance</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Improve your content</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Video Preview
                </h3>
                
                {isGenerating && generationProgress ? (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            {generationProgress.message}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Stage: {generationProgress.stage}
                          </p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${generationProgress.progress}%` }}
                        ></div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {generationProgress.progress}% complete
                      </p>
                    </div>
                  </div>
                ) : generatedVideo ? (
                  <div className="space-y-4">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        src={generatedVideo}
                        controls
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                      <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                        <Upload className="h-4 w-4" />
                        <span>Publish</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Your generated video will appear here
                    </p>
                  </div>
                )}
              </div>

              {/* Usage Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Usage This Month
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Video Minutes</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">0 / {selectedTierData?.videoMinutes || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Image Generations</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">0 / {selectedTierData?.imageGenerations || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Upload Your Content
            </h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Drag and drop your files here
              </h4>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Support for MP4, AVI, MOV, and other video formats
              </p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Choose Files
              </button>
            </div>
          </div>
        )}

        {activeTab === 'video-editor' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Video Editor
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create and edit your course videos with professional tools. Combine your own content with AI-generated videos.
              </p>
            </div>
            <div className="h-[600px]">
              <VideoEditor
                onExport={(project) => {
                  console.log('Exporting project:', project);
                  // Handle export
                }}
                onSave={(project) => {
                  console.log('Saving project:', project);
                  // Handle save
                }}
              />
            </div>
            
            {/* Video Editor Demo Button */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Want to see what the video editor can do? Check out our interactive demo!
                </p>
                <button
                  onClick={() => setShowVideoEditorDemo(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Video className="h-5 w-5" />
                  <span>View Video Editor Demo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Plan
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Select the perfect plan for your course creation needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 ${
                    tier.popular ? 'ring-2 ring-indigo-500 scale-105' : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Crown className="h-4 w-4" />
                        <span>Most Popular</span>
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {tier.name}
                    </h4>
                    <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                      ${tier.price}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">per month</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedTier(tier.id)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                      selectedTier === tier.id
                        ? 'bg-indigo-600 text-white'
                        : tier.popular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {selectedTier === tier.id ? 'Selected' : 'Select Plan'}
                  </button>
                  
                  {selectedTier === tier.id && (
                    <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                          Selected Plan
                        </span>
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                        You can start creating videos immediately
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                Need more? Contact us for custom plans
              </h4>
              <p className="text-indigo-700 dark:text-indigo-300 mb-4">
                For enterprise needs or custom requirements, we offer tailored solutions.
              </p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Contact Sales
              </button>
            </div>

            {/* Current Subscription Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Subscription
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {selectedTierData?.name} Plan
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${selectedTierData?.price}/month
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Renews monthly
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedTierData?.videoMinutes || 0}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Video Minutes
                    </p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {selectedTierData?.imageGenerations || 0}
                    </p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      AI Images
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Manage Billing
                  </button>
                  <button className="flex-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Editor Demo */}
      {showVideoEditorDemo && (
        <VideoEditorDemo onClose={() => setShowVideoEditorDemo(false)} />
      )}
    </div>
  );
};

export default CourseCreationPage;
