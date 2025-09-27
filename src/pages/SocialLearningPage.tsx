import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Trophy, 
  Star, 
  Flame, 
  X, 
  Play, 
  CheckCircle,
  XCircle,
  Cpu,
  Palette,
  Sparkles,
  Edit3,
  Upload,
  Wand2
} from 'lucide-react';
import GeminiImageService from '../lib/geminiImageService';
import { generateImage } from '../lib/imageGeneration';

const SocialLearningPage: React.FC = () => {
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
          },
          {
            id: "q3",
            question: "Which organelle is responsible for photosynthesis?",
            options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"],
            correct: "Chloroplast",
            points: 15
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
          },
          {
            id: "q2",
            question: "What is the derivative of sin(x)?",
            options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
            correct: "cos(x)",
            points: 25
          }
        ]
      }
    },
    {
      id: 3,
      author: "Emma Thompson",
      authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      title: "Historical Timeline: World War II 🕰️",
      content: "Created this comprehensive timeline showing key events of WWII. Perfect for history students!",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
      type: "lesson",
      tags: ["history", "world-war-2", "timeline", "education"],
      likes: 67,
      comments: 23,
      shares: 18,
      points: 180,
      createdAt: "1 day ago",
      isLiked: false,
      quiz: {
        id: "quiz3",
        questions: [
          {
            id: "q1",
            question: "When did World War II start?",
            options: ["1938", "1939", "1940", "1941"],
            correct: "1939",
            points: 15
          },
          {
            id: "q2",
            question: "Which country was NOT part of the Axis powers?",
            options: ["Germany", "Japan", "Italy", "France"],
            correct: "France",
            points: 20
          }
        ]
      }
    }
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

  // Initialize Gemini Image Service
  useEffect(() => {
    const initGeminiService = async () => {
      const service = GeminiImageService.getInstance();
      // Hardcoded API key for demo purposes
      const hardcodedApiKey = 'AIzaSyBvOkBw7cJhF2L3mN8pQ9rS4tU5vW6xY7z';
      const initialized = await service.initialize(hardcodedApiKey);
      
      if (initialized) {
        setGeminiService(service);
        setGeminiAvailable(true);
        setApiError(null);
        console.log('🤖 Google Gemini 2.5 Flash Image API initialized successfully!');
        console.log('✅ Ready to generate high-quality educational images!');
      } else {
        console.log('⚠️ Gemini API not available - will use fallback services');
        setApiError('API initialization failed');
      }
    };
    
    initGeminiService();
  }, []);

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

  // AI Generation functions
  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setAiGenerating(true);
    setApiError(null);
    try {
      const response = await generateImage({
        prompt: aiPrompt,
        style: aiStyle,
        aspectRatio: aiAspectRatio,
        apiKey: geminiService?.getApiKey() || undefined
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

  const useGeneratedImage = () => {
    if (aiGeneratedImage) {
      setPostImage(aiGeneratedImage);
      setShowAiModal(false);
    }
  };

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
                  Learning Social Hub
                  {geminiAvailable && (
                    <span className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full font-medium">
                      🤖 AI Ready
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Share knowledge, take quizzes, and earn points!
                </p>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="flex items-center space-x-4">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Error Display */}
        {apiError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
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
                    
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
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
            </div>
          ))}
        </div>
      </div>

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

              {postType === 'quiz' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quiz Questions
                    </label>
                    <button
                      onClick={addQuizQuestion}
                      className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Question
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {quizQuestions.map((question, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => updateQuizQuestion(index, 'question', e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-3"
                          placeholder="Question..."
                        />
                        
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {question.options.map((option: string, optIndex: number) => (
                            <input
                              key={optIndex}
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[optIndex] = e.target.value;
                                updateQuizQuestion(index, 'options', newOptions);
                              }}
                              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder={`Option ${optIndex + 1}...`}
                            />
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <select
                            value={question.correct}
                            onChange={(e) => updateQuizQuestion(index, 'correct', e.target.value)}
                            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="">Select correct answer</option>
                            {question.options.map((option: string, optIndex: number) => (
                              <option key={optIndex} value={option}>
                                {option || `Option ${optIndex + 1}`}
                              </option>
                            ))}
                          </select>
                          
                          <input
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuizQuestion(index, 'points', parseInt(e.target.value))}
                            className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Points"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
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

      {/* AI Generation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Generate Image with AI
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
                  Prompt
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe the educational image you want to create..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Style
                  </label>
                  <select
                    value={aiStyle}
                    onChange={(e) => setAiStyle(e.target.value as any)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="16:9">16:9 (Wide)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="9:16">9:16 (Tall)</option>
                    <option value="4:3">4:3 (Standard)</option>
                    <option value="3:4">3:4 (Portrait)</option>
                  </select>
                </div>
              </div>

              {aiGeneratedImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Generated Image
                  </label>
                  <img
                    src={aiGeneratedImage}
                    alt="Generated"
                    className="w-full h-64 object-cover rounded-lg"
                  />
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
                  onClick={generateWithAI}
                  disabled={!aiPrompt.trim() || aiGenerating}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {aiGenerating ? 'Generating...' : 'Generate'}
                </button>
                {aiGeneratedImage && (
                  <button
                    onClick={useGeneratedImage}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-colors"
                  >
                    Use Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLearningPage;
