import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Palette, 
  Download, 
  Share2, 
  Heart, 
  MessageCircle,
  MoreVertical,
  XCircle,
  Wand2,
  Sparkles,
  Edit3,
  RefreshCw,
  Sliders,
  Cpu,
  X,
  Plus,
  Trophy,
  Star,
  Flame,
  Play,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { generateImage } from '../lib/imageGeneration';

const CreativeLearningPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Social Learning state
  const [posts, setPosts] = useState<any[]>([]);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [userStreak, setUserStreak] = useState(0);
  
  // Post creation state
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null);
  const [postTags, setPostTags] = useState('');
  const [postType, setPostType] = useState<'image' | 'quiz' | 'lesson'>('image');
  
  // AI Image generation state (additional)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: string}>({});
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizResults, setShowQuizResults] = useState(false);

  // AI state
  const [geminiService, setGeminiService] = useState<GeminiImageService | null>(null);
  const [geminiAvailable, setGeminiAvailable] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStyle, setAiStyle] = useState<'photographic' | 'digital_art' | 'sketch' | 'watercolor' | 'oil_painting'>('photographic');
  const [aiAspectRatio, setAiAspectRatio] = useState<'16:9' | '1:1' | '9:16' | '4:3' | '3:4'>('16:9');
  
  // Comment system state
  const [showComments, setShowComments] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);

  // Sample posts data
  const samplePosts = [
    {
      id: 1,
      author: "Dr. Sarah Chen",
      authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      title: "Photosynthesis Made Simple! 🌱",
      content: "Just created this visual guide to help students understand how plants make their own food. The process is fascinating!",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
      type: "lesson",
      tags: ["biology", "photosynthesis", "plants", "science"],
      likes: 42,
      comments: 8,
      shares: 12,
      points: 150,
      createdAt: "2 hours ago",
      isLiked: false,
      quiz: {
        id: "quiz1",
        questions: [
          {
            id: "q1",
            question: "What gas do plants absorb from the atmosphere during photosynthesis?",
            options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
            correct: "Carbon Dioxide",
            points: 10
          },
          {
            id: "q2", 
            question: "What is the main product of photosynthesis?",
            options: ["Water", "Glucose", "Oxygen", "Chlorophyll"],
            correct: "Glucose",
            points: 10
          }
        ]
      }
    },
    {
      id: 2,
      author: "Prof. Michael Rodriguez",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      title: "Math Challenge: Calculus Derivatives 📐",
      content: "Test your calculus skills with this derivative problem. First correct answer gets bonus points!",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop",
      type: "quiz",
      tags: ["mathematics", "calculus", "derivatives", "challenge"],
      likes: 28,
      comments: 15,
      shares: 5,
      points: 200,
      createdAt: "4 hours ago",
      isLiked: true,
      quiz: {
        id: "quiz2",
        questions: [
          {
            id: "q1",
            question: "What is the derivative of x²?",
            options: ["x", "2x", "x²", "2x²"],
            correct: "2x",
            points: 20
          }
        ]
      }
    }
  ];

  // Creative tools state
  const [designs, setDesigns] = useState<any[]>([]);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageEdits, setImageEdits] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  });

  // Educational suggestions for AI
  const educationalSuggestions = [
    "Create a visual timeline of the American Revolution",
    "Design a molecular structure diagram for water (H2O)",
    "Illustrate the water cycle with labeled components",
    "Make a colorful periodic table with element properties",
    "Create a diagram of the human digestive system",
    "Design a map showing the spread of the Roman Empire",
    "Illustrate the process of photosynthesis step by step",
    "Create a visual representation of the solar system",
    "Design a flowchart of the scientific method",
    "Make an infographic about renewable energy sources"
  ];


  // Initialize posts and user data
  useEffect(() => {
    setPosts(samplePosts);
    // Load user data from localStorage
    const savedPoints = localStorage.getItem('userPoints');
    const savedLevel = localStorage.getItem('userLevel');
    const savedStreak = localStorage.getItem('userStreak');
    
    if (savedPoints) setUserPoints(parseInt(savedPoints));
    if (savedLevel) setUserLevel(parseInt(savedLevel));
    if (savedStreak) setUserStreak(parseInt(savedStreak));
  }, []);

  // Initialize posts, user data, and Gemini service
  useEffect(() => {
    setPosts(samplePosts);
    // Load user data from localStorage
    const savedPoints = localStorage.getItem('userPoints');
    const savedLevel = localStorage.getItem('userLevel');
    const savedStreak = localStorage.getItem('userStreak');
    
    if (savedPoints) setUserPoints(parseInt(savedPoints));
    if (savedLevel) setUserLevel(parseInt(savedLevel));
    if (savedStreak) setUserStreak(parseInt(savedStreak));

    // Initialize AI Image service
    const initGeminiService = async () => {
      const service = GeminiImageService.getInstance();
      const userApiKeysService = UserApiKeysService.getInstance();
      
      const initialized = await service.initialize();
      
      if (initialized) {
        setGeminiService(service);
        
        // Check if user has API key
        const hasApiKey = await userApiKeysService.hasApiKey('openai');
        setGeminiAvailable(hasApiKey);
        
        if (hasApiKey) {
          setApiError(null);
          console.log('🤖 AI Image Service initialized with user API key!');
          console.log('✅ Ready to generate high-quality educational images!');
        } else {
          console.log('⚠️ No user API key found - will use free fallback services');
          setApiError(null); // No error, just using fallbacks
        }
      } else {
        console.log('⚠️ AI Image Service not available');
        setApiError('Service initialization failed');
      }
    };
    
    initGeminiService();
  }, []);


  // AI Generation functions
  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setAiGenerating(true);
    setApiError(null);
    try {
      const response = await generateImage({
        prompt: aiPrompt,
        style: aiStyle,
        aspectRatio: aiAspectRatio
      });
      setAiGeneratedImage(response.imageUrl);
    } catch (error) {
      console.error('AI generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check for specific API errors
      if (errorMessage.includes('API_RATE_LIMIT') || errorMessage.includes('quota') || errorMessage.includes('limit') || errorMessage.includes('rate')) {
        setApiError('🚫 API Rate Limit Reached! Please try again later or use fallback services.');
      } else if (errorMessage.includes('API_BILLING') || errorMessage.includes('billing') || errorMessage.includes('payment')) {
        setApiError('💳 Billing limit reached. Please check your Google Cloud billing.');
      } else if (errorMessage.includes('API_INVALID_KEY') || errorMessage.includes('invalid') || errorMessage.includes('unauthorized')) {
        setApiError('🔑 Invalid API key. Please check your Gemini API key.');
      } else {
        setApiError(`❌ Generation failed: ${errorMessage}`);
      }
    } finally {
      setAiGenerating(false);
    }
  };

  const useAiSuggestion = (suggestion: string) => {
    setAiPrompt(suggestion);
    setShowAiModal(true);
  };

  const addQuizQuestion = () => {
    const newQuestion = {
      id: `q${quizQuestions.length + 1}`,
      question: '',
      options: ['', '', '', ''],
      correct: '',
      points: 10
    };
    setQuizQuestions([...quizQuestions, newQuestion]);
  };

  const updateQuizQuestion = (index: number, field: string, value: any) => {
    const updated = [...quizQuestions];
    if (field === 'options') {
      updated[index].options = value;
    } else {
      updated[index][field] = value;
    }
    setQuizQuestions(updated);
  };


  // AI Image Generation Functions
  const generateAIImage = async () => {
    if (!aiPrompt.trim()) {
      return;
    }

    setIsGeneratingImage(true);
    
    // Simple timeout to show loading state
    setTimeout(() => {
      try {
        console.log('🎨 Generating image for:', aiPrompt);
        
        // Use Pollinations AI - simple and reliable
        const encodedPrompt = encodeURIComponent(`educational illustration: ${aiPrompt}, clear, informative, learning material`);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${Date.now()}`;
        
        console.log('✅ Image URL:', imageUrl);
        
        setGeneratedImageUrl(imageUrl);
        setPostImage(imageUrl);
        setIsGeneratingImage(false);
      } catch (error) {
        console.error('Error generating image:', error);
        setIsGeneratingImage(false);
      }
    }, 1000); // 1 second delay to show loading
  };

  const useGeneratedImage = () => {
    if (generatedImageUrl) {
      setPostImage(generatedImageUrl);
      setShowAiModal(false);
      setAiPrompt('');
      setGeneratedImageUrl(null);
    }
  };

  // Social Learning Functions
  const handleLikePost = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
        const newPoints = post.isLiked ? userPoints - 5 : userPoints + 5;
        setUserPoints(newPoints);
        localStorage.setItem('userPoints', newPoints.toString());
        return {
          ...post,
          likes: newLikes,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleSharePost = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Create shareable link
    const shareUrl = `${window.location.origin}/creative-learning?post=${postId}`;
    const shareText = `Check out this educational post: "${post.title}"`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: shareText,
        url: shareUrl
      }).then(() => {
        // Increment share count on successful share
        incrementShareCount(postId);
        console.log('Post shared successfully via Web Share API!');
      }).catch((error) => {
        console.log('Web Share cancelled or failed:', error);
        // Fallback to clipboard
        fallbackShare(shareUrl, shareText, postId);
      });
    } else {
      // Fallback to clipboard
      fallbackShare(shareUrl, shareText, postId);
    }
  };

  const fallbackShare = async (shareUrl: string, shareText: string, postId: number) => {
    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      
      // Show success message
      alert('Post link copied to clipboard! You can now share it anywhere.');
      
      // Increment share count
      incrementShareCount(postId);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Final fallback - show the link
      alert(`Share this post:\n${shareText}\n${shareUrl}`);
      incrementShareCount(postId);
    }
  };

  const incrementShareCount = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newShares = post.shares + 1;
        const newPoints = userPoints + 10;
        setUserPoints(newPoints);
        localStorage.setItem('userPoints', newPoints.toString());
        return { ...post, shares: newShares };
      }
      return post;
    }));
  };

  const handleCommentPost = (postId: number) => {
    // Toggle comment section visibility
    setShowComments(showComments === postId ? null : postId);
  };

  const submitComment = (postId: number) => {
    if (!commentText.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComments = post.comments + 1;
        const newPoints = userPoints + 3;
        setUserPoints(newPoints);
        localStorage.setItem('userPoints', newPoints.toString());
        
        // Add comment to post
        const newComment = {
          id: Date.now(),
          text: commentText,
          author: 'You',
          timestamp: new Date().toISOString(),
          likes: 0
        };
        
        return { 
          ...post, 
          comments: newComments,
          commentList: [...(post.commentList || []), newComment]
        };
      }
      return post;
    }));
    
    setCommentText('');
    console.log('Comment added successfully!');
  };

  const startQuiz = (post: any) => {
    setCurrentQuiz(post.quiz);
    setQuizQuestions(post.quiz.questions);
    setCurrentQuestionIndex(0);
    setQuizAnswers({});
    setQuizScore(0);
    setShowQuizResults(false);
    setShowQuizModal(true);
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answer });
  };

  const submitQuiz = () => {
    let score = 0;
    let earnedPoints = 0;
    
    quizQuestions.forEach(question => {
      if (quizAnswers[question.id] === question.correct) {
        score += 1;
        earnedPoints += question.points;
      }
    });
    
    setQuizScore(score);
    setUserPoints(userPoints + earnedPoints);
    localStorage.setItem('userPoints', (userPoints + earnedPoints).toString());
    setShowQuizResults(true);
  };

  const createPost = async () => {
    if (!postTitle.trim() || !postContent.trim()) return;
    
    const newPost = {
      id: Date.now(),
      author: "You",
      authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      title: postTitle,
      content: postContent,
      image: postImage,
      type: postType,
      tags: postTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      likes: 0,
      comments: 0,
      shares: 0,
      points: postType === 'quiz' ? 200 : 100,
      createdAt: "Just now",
      isLiked: false,
      quiz: postType === 'quiz' ? {
        id: `quiz_${Date.now()}`,
        questions: quizQuestions
      } : null
    };
    
    setPosts([newPost, ...posts]);
    setPostTitle('');
    setPostContent('');
    setPostImage(null);
    setPostTags('');
    setPostType('image');
    setQuizQuestions([]);
    setShowCreatePostModal(false);
    
    // Award points for creating post
    const newPoints = userPoints + (postType === 'quiz' ? 50 : 25);
    setUserPoints(newPoints);
    localStorage.setItem('userPoints', newPoints.toString());
  };

  const saveAiImage = () => {
    if (aiGeneratedImage) {
      const newDesign = {
        id: Date.now(),
        title: aiPrompt,
        description: `AI-generated: ${aiPrompt}`,
        imageUrl: aiGeneratedImage,
        tags: extractTagsFromPrompt(aiPrompt),
        likes: 0,
        comments: 0,
        isLiked: false,
        author: 'AI Assistant',
        createdAt: new Date().toISOString()
      };
      
      setDesigns(prev => [newDesign, ...prev]);
      setAiGeneratedImage(null);
      setAiPrompt('');
      setShowAiModal(false);
    }
  };

  const extractTagsFromPrompt = (prompt: string): string[] => {
    const commonTags = ['education', 'learning', 'visual', 'diagram', 'infographic'];
    const words = prompt.toLowerCase().split(' ');
    return [...new Set([...commonTags, ...words.filter(word => word.length > 3)])];
  };


  const toggleLike = (id: number) => {
    setDesigns(prev => prev.map(design => 
      design.id === id 
        ? { 
          ...design,
            isLiked: !design.isLiked,
            likes: design.isLiked ? design.likes - 1 : design.likes + 1
          }
        : design
    ));
  };

  // Nano Banana Image Editor Modal
  const NanoBananaEditor = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
              <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Gemini 2.5 Flash Image Editor
              </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                Powered by Google's Gemini 2.5 Flash Image API
                </p>
              </div>
            </div>
              <button
            onClick={() => setShowEditModal(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
            <XCircle className="h-6 w-6" />
              </button>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              {editingImage ? (
                <img
                  src={editingImage}
                  alt="Editing"
                  className="w-full h-auto rounded-lg"
                  style={{
                    filter: `brightness(${imageEdits.brightness}%) contrast(${imageEdits.contrast}%) saturate(${imageEdits.saturation}%) blur(${imageEdits.blur}px)`
                  }}
                        />
                      ) : (
                <div className="text-center py-12">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Upload an image to edit</p>
                </div>
                      )}
                    </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
                        <button
                onClick={async () => {
                  if (editingImage && geminiService) {
                    try {
                      setApiError(null);
                      const enhanced = await geminiService.editImage(editingImage, 'Enhance this image for educational purposes with better clarity and contrast');
                      setEditingImage(enhanced.imageUrl);
                    } catch (error) {
                      console.error('Enhancement failed:', error);
                      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                      if (errorMessage.includes('API_RATE_LIMIT') || errorMessage.includes('quota') || errorMessage.includes('limit')) {
                        setApiError('🚫 API Rate Limit Reached! Please try again later.');
                      } else {
                        setApiError(`❌ Enhancement failed: ${errorMessage}`);
                      }
                    }
                  }
                }}
                className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mb-1" />
                <span className="text-xs text-blue-700 dark:text-blue-300">Enhance</span>
                        </button>
                        <button
                onClick={async () => {
                  if (editingImage && geminiService) {
                    try {
                      setApiError(null);
                      const filtered = await geminiService.editImage(editingImage, 'Apply an educational filter to make this image more suitable for learning materials');
                      setEditingImage(filtered.imageUrl);
                    } catch (error) {
                      console.error('Filtering failed:', error);
                      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                      if (errorMessage.includes('API_RATE_LIMIT') || errorMessage.includes('quota') || errorMessage.includes('limit')) {
                        setApiError('🚫 API Rate Limit Reached! Please try again later.');
                      } else {
                        setApiError(`❌ Filtering failed: ${errorMessage}`);
                      }
                    }
                  }
                }}
                className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <Wand2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mb-1" />
                <span className="text-xs text-purple-700 dark:text-purple-300">Filter</span>
                        </button>
              <button
                onClick={async () => {
                  if (editingImage && geminiService) {
                    try {
                      setApiError(null);
                      const stylized = await geminiService.editImage(editingImage, 'Convert this image to a stylized educational diagram with clear visual elements');
                      setEditingImage(stylized.imageUrl);
                    } catch (error) {
                      console.error('Stylization failed:', error);
                      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                      if (errorMessage.includes('API_RATE_LIMIT') || errorMessage.includes('quota') || errorMessage.includes('limit')) {
                        setApiError('🚫 API Rate Limit Reached! Please try again later.');
                      } else {
                        setApiError(`❌ Stylization failed: ${errorMessage}`);
                      }
                    }
                  }
                }}
                className="flex flex-col items-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
              >
                <Edit3 className="h-5 w-5 text-pink-600 dark:text-pink-400 mb-1" />
                <span className="text-xs text-pink-700 dark:text-pink-300">Stylize</span>
                    </button>
                </div>
              </div>

          {/* Editing Controls */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                <Sliders className="h-4 w-4 inline mr-2" />
                Adjustments
              </h4>
              
                  <div className="space-y-4">
                    <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">
                    Brightness: {imageEdits.brightness}%
                      </label>
                      <input
                    type="range"
                    min="0"
                    max="200"
                    value={imageEdits.brightness}
                    onChange={(e) => setImageEdits(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                    className="w-full"
                      />
                    </div>
                
                    <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">
                    Contrast: {imageEdits.contrast}%
                      </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={imageEdits.contrast}
                    onChange={(e) => setImageEdits(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                    className="w-full"
                      />
                    </div>
                
                    <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">
                    Saturation: {imageEdits.saturation}%
                      </label>
                      <input
                    type="range"
                    min="0"
                    max="200"
                    value={imageEdits.saturation}
                    onChange={(e) => setImageEdits(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                    className="w-full"
                      />
      </div>
                
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">
                    Blur: {imageEdits.blur}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={imageEdits.blur}
                    onChange={(e) => setImageEdits(prev => ({ ...prev, blur: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                    </div>
                  </div>
            </div>

            {/* AI Features */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Cpu className="h-4 w-4 inline mr-2" />
                AI-Powered Features
              </h4>
              
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                  🎨 Auto-enhance for education
                </button>
                <button className="w-full text-left px-3 py-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                  📐 Add educational annotations
                </button>
                <button className="w-full text-left px-3 py-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                  🔍 Extract text from image
                </button>
                <button className="w-full text-left px-3 py-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                  📊 Convert to diagram
                </button>
                      </div>
                    </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setImageEdits({
                    brightness: 100,
                    contrast: 100,
                    saturation: 100,
                    blur: 0
                  });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </button>
                      <button
                onClick={() => {
                  if (editingImage) {
                    const link = document.createElement('a');
                    link.download = 'edited-image.png';
                    link.href = editingImage;
                    link.click();
                  }
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
                      </button>
                    </div>
                </div>
                </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="h-8 w-8 text-pink-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  Creative Learning Hub
                  {geminiAvailable && (
                    <span className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full font-medium">
                      🤖 AI Ready
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Create, share, and learn together with AI
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Stats */}
            <div className="flex items-center space-x-3">
                <div className="flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{userPoints}</span>
                </div>
                <div className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">L{userLevel}</span>
                </div>
                <div className="flex items-center px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full">
                  <Flame className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{userStreak}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
              <button
                  onClick={() => setShowCreatePostModal(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </button>
                <button
                  onClick={() => setShowAiModal(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all text-sm font-medium"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Generate
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered Features Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI-Powered Learning Tools
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Generate educational content with AI assistance
              </p>
            </div>
          </div>
          
          {apiError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    API Error
                  </h3>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    {apiError}
                  </p>
                      <button
                    onClick={() => setApiError(null)}
                    className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                  >
                    Dismiss
                      </button>
                  </div>
                </div>
              </div>
          )}

          {!geminiAvailable && !apiError && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Cpu className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Add your API Key for premium AI features
                  </h3>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Add your API key in Settings to unlock high-quality AI image generation. Free fallback services are available.
                  </p>
                  <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔘 Manage API Keys button clicked');
                    console.log('Navigating to /settings');
                    try {
                      navigate('/settings');
                    } catch (error) {
                      console.error('Navigation error:', error);
                      window.location.href = '/settings';
                    }
                  }}
                    className="mt-2 text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors cursor-pointer"
                    type="button"
                >
                    Manage API Keys
                </button>
                          </div>
                        </div>
                      </div>
          )}

          {/* Always show API key management button */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Cpu className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    API Key Management
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Manage your AI service API keys for enhanced features
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔘 Test Settings button clicked');
                    console.log('Navigating to /test-settings');
                    try {
                      navigate('/test-settings');
                    } catch (error) {
                      console.error('Navigation error:', error);
                      window.location.href = '/test-settings';
                    }
                  }}
                  className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors cursor-pointer"
                  type="button"
                >
                  Test Route
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔘 Manage API Keys button clicked');
                    navigate('/api-settings');
                  }}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                  type="button"
                >
                  Manage API Keys
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {educationalSuggestions.slice(0, 5).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => useAiSuggestion(suggestion)}
                className="text-left p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm border border-gray-200 dark:border-gray-600"
              >
                {suggestion}
              </button>
                    ))}
                  </div>
                    </div>

        {/* Designs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <div key={design.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative group">
                <img
                  src={design.imageUrl}
                  alt={design.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                      <button
                      onClick={() => toggleLike(design.id)}
                      className={`p-2 rounded-full ${
                        design.isLiked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      } transition-colors`}
                    >
                      <Heart className={`h-4 w-4 ${design.isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                      <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {design.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {design.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {design.tags.slice(0, 3).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {design.likes}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {design.comments}
                    </span>
                  </div>
                  <span className="text-xs">
                    by {design.author}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {designs.length === 0 && (
          <div className="text-center py-12">
            <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No designs yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start by uploading a design or generating one with AI
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowAiModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Generate with AI
              </button>
            </div>
          </div>
        )}

      {/* Social Learning Feed */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Learning Community Feed
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Share your creations and learn from others
          </p>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {post.author}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {post.createdAt}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.type === 'quiz' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200'
                          : post.type === 'lesson'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      }`}>
                        {post.type === 'quiz' ? 'Quiz' : post.type === 'lesson' ? 'Lesson' : 'Image'}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      {post.content}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      )}
                    </div>
                      </div>
                    </div>

              {/* Post Image */}
              {post.image && (
                <div className="px-6 pb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  </div>
              )}

              {/* Post Actions */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                        <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-2 ${
                        post.isLiked 
                          ? 'text-red-500' 
                          : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
                      } transition-colors`}
                    >
                      <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{post.likes}</span>
                        </button>
                    
                    <button 
                      onClick={() => handleCommentPost(post.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>
                    
                        <button
                      onClick={() => handleSharePost(post.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                        >
                      <Share2 className="h-5 w-5" />
                      <span className="text-sm font-medium">{post.shares}</span>
                        </button>
                      </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Trophy className="h-4 w-4" />
                      <span className="text-sm font-medium">{post.points}</span>
                    </div>
                    
                    {post.quiz && (
                      <button
                        onClick={() => startQuiz(post)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all text-sm font-medium"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Take Quiz
                    </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Comments Section */}
              {showComments === post.id && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="space-y-4">
                    {/* Comment Input */}
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write a comment..."
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                          rows={2}
                        />
                      </div>
                      <button
                        onClick={() => submitComment(post.id)}
                        disabled={!commentText.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Post
                      </button>
                    </div>
                    
                    {/* Comments List */}
                    <div className="space-y-3">
                      {post.commentList?.map((comment: any) => (
                        <div key={comment.id} className="flex space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {comment.author.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                  {comment.author}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(comment.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {(!post.commentList || post.commentList.length === 0) && (
                        <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                          No comments yet. Be the first to comment!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
                </div>
              </div>


      {/* AI Generation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                      </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    AI Image Generator
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Create educational content with AI
                  </p>
                    </div>
              </div>
                      <button
                onClick={() => setShowAiModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
                      </button>
                    </div>

            <div className="space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe what you want to create
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="e.g., Create a colorful diagram of the water cycle with labeled components"
                />
                </div>

              {/* Style and Aspect Ratio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Style
                </label>
                  <select
                    value={aiStyle}
                    onChange={(e) => setAiStyle(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="photographic">Photographic</option>
                    <option value="digital_art">Digital Art</option>
                    <option value="sketch">Sketch</option>
                    <option value="watercolor">Watercolor</option>
                    <option value="oil_painting">Oil Painting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Aspect Ratio
                  </label>
                  <select
                    value={aiAspectRatio}
                    onChange={(e) => setAiAspectRatio(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="16:9">16:9 (Widescreen)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="9:16">9:16 (Portrait)</option>
                    <option value="4:3">4:3 (Standard)</option>
                    <option value="3:4">3:4 (Portrait)</option>
                  </select>
                  </div>
                </div>
            
              {/* Generated Image */}
              {aiGeneratedImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Generated Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <img
                      src={aiGeneratedImage}
                      alt="Generated"
                      className="w-full h-auto rounded-lg"
                    />
              </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                    <button
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
                    </button>
                    <button
                  onClick={generateWithAI}
                  disabled={!aiPrompt.trim() || aiGenerating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {aiGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                  </>
                ) : (
                  <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate
                  </>
                )}
                    </button>
                {aiGeneratedImage && (
                      <button
                    onClick={saveAiImage}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Save to Gallery
                      </button>
                )}
                  </div>
                </div>
              </div>
        </div>
      )}


      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Learning Post
            </h3>
              <button
                onClick={() => setShowCreatePostModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Post Type
                </label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="image">Image Post</option>
                  <option value="lesson">Lesson</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter post title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Share your knowledge..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image (Optional)
                </label>
                <div className="flex space-x-3">
                  <input
                    type="url"
                    value={postImage || ''}
                    onChange={(e) => setPostImage(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Image URL..."
                  />
                  <button
                    onClick={() => setShowAiModal(true)}
                    className="flex items-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Generate
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="biology, science, education..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreatePostModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createPost}
                  disabled={!postTitle.trim() || !postContent.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Image Generation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Generate AI Image
              </h3>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe the image you want to generate
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., A futuristic classroom with holographic displays and students learning about space exploration"
                />
              </div>

              {generatedImageUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Generated Image
                  </label>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <img 
                      src={generatedImageUrl} 
                      alt="Generated" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={generateAIImage}
                  disabled={!aiPrompt.trim() || isGeneratingImage}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </button>
                {generatedImageUrl && (
                  <button
                    onClick={useGeneratedImage}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Use This Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuizModal && currentQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Quiz Challenge
              </h3>
              <button
                onClick={() => setShowQuizModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {!showQuizResults ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                  </h4>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                    />
              </div>
            </div>
            
                <div>
                  <h5 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {quizQuestions[currentQuestionIndex]?.question}
                  </h5>
                  
                  <div className="space-y-3">
                    {quizQuestions[currentQuestionIndex]?.options.map((option: string, index: number) => (
              <button
                        key={index}
                        onClick={() => handleQuizAnswer(quizQuestions[currentQuestionIndex].id, option)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                          quizAnswers[quizQuestions[currentQuestionIndex].id] === option
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        {option}
              </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
              <button
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {currentQuestionIndex === quizQuestions.length - 1 ? (
                    <button
                      onClick={submitQuiz}
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestionIndex(Math.min(quizQuestions.length - 1, currentQuestionIndex + 1))}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="text-6xl">🎉</div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Quiz Complete!
                </h4>
                <div className="text-lg text-gray-600 dark:text-gray-300">
                  You scored {quizScore} out of {quizQuestions.length} questions
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +{quizQuestions.reduce((total: number, q: any) => 
                    quizAnswers[q.id] === q.correct ? total + q.points : total, 0
                  )} Points Earned!
                </div>
                <button
                  onClick={() => setShowQuizModal(false)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  Continue Learning
              </button>
            </div>
            )}
          </div>
        </div>
      )}

      {/* Nano Banana Editor Modal */}
      {showEditModal && <NanoBananaEditor />}
    </div>
  );
};

export default CreativeLearningPage;
