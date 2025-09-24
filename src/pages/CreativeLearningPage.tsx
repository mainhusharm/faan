import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generateImage } from '../lib/imageGeneration';
import { 
  Palette, 
  Heart, 
  Share2, 
  MessageCircle,
  MoreHorizontal,
  Star,
  Send,
  Search,
  Plus,
  Loader2,
  User,
  Clock,
  XCircle
} from 'lucide-react';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name: string;
  user_avatar?: string;
}

interface CreativeDesign {
  id: string;
  user_id: string;
  title: string;
  description: string;
  prompt: string;
  image_url: string;
  tags: string[];
  is_public: boolean;
  likes_count: number;
  comments_count: number;
  rating: number;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
  comments?: Comment[];
  user_liked?: boolean;
  user_rated?: number;
}


const CreativeLearningPage: React.FC = () => {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<CreativeDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDesign, setNewDesign] = useState({
    title: '',
    description: '',
    prompt: '',
    tags: [] as string[],
    isPublic: true
  });
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    tags: [] as string[]
  });

  // Load designs and check API key status
  useEffect(() => {
    setLoading(false);
    checkApiKey();
    
    // Add mock data with social media features
    setDesigns([
      {
        id: '1',
        user_id: 'user1',
        title: 'Photosynthesis Process Diagram',
        description: 'A comprehensive visual guide showing how plants convert sunlight into energy. Perfect for biology students!',
        prompt: 'Create a detailed scientific diagram of photosynthesis',
        image_url: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Photosynthesis+Process',
        tags: ['biology', 'photosynthesis', 'plants', 'science'],
        is_public: true,
        likes_count: 124,
        comments_count: 8,
        rating: 4.8,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        profiles: { 
          full_name: 'Sarah Chen',
          avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        comments: [
          {
            id: 'c1',
            user_id: 'user2',
            content: 'This is amazing! Really helped me understand the process better. Thanks for sharing!',
            created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            user_name: 'Alex Kim'
          },
          {
            id: 'c2',
            user_id: 'user3',
            content: 'Could you make one for cellular respiration too?',
            created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            user_name: 'Maria Garcia'
          }
        ],
        user_liked: false,
        user_rated: 0
      },
      {
        id: '2',
        user_id: 'user2',
        title: 'Quadratic Formula Visual Guide',
        description: 'Interactive visual explanation of the quadratic formula with step-by-step examples. Great for math students!',
        prompt: 'Create a math infographic for quadratic formula',
        image_url: 'https://via.placeholder.com/800x600/059669/FFFFFF?text=Quadratic+Formula',
        tags: ['mathematics', 'algebra', 'formula', 'education'],
        is_public: true,
        likes_count: 89,
        comments_count: 5,
        rating: 4.6,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        profiles: { 
          full_name: 'Alex Kim',
          avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        comments: [
          {
            id: 'c3',
            user_id: 'user1',
            content: 'Love the visual approach! Much easier to remember this way.',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            user_name: 'Sarah Chen'
          }
        ],
        user_liked: true,
        user_rated: 5
      },
      {
        id: '3',
        user_id: 'user3',
        title: 'World War II Timeline',
        description: 'Comprehensive timeline of major events during WWII with key dates and locations. Perfect for history class!',
        prompt: 'Create a historical timeline infographic',
        image_url: 'https://via.placeholder.com/800x600/DC2626/FFFFFF?text=WWII+Timeline',
        tags: ['history', 'timeline', 'education', 'world-war-2'],
        is_public: true,
        likes_count: 156,
        comments_count: 12,
        rating: 4.9,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        profiles: { 
          full_name: 'Maria Garcia',
          avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        comments: [
          {
            id: 'c4',
            user_id: 'user1',
            content: 'This is incredibly detailed! Thank you for sharing.',
            created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            user_name: 'Sarah Chen'
          },
          {
            id: 'c5',
            user_id: 'user2',
            content: 'Could you add more details about the Pacific theater?',
            created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            user_name: 'Alex Kim'
          }
        ],
        user_liked: false,
        user_rated: 0
      }
    ]);
  }, []);

  const checkApiKey = async () => {
    if (!user) return;
    
    try {
      // Check for Google Gemini API key in localStorage
      const savedApiKey = localStorage.getItem('google_gemini_api_key');
      if (savedApiKey) {
        setApiKey(savedApiKey);
        setHasApiKey(true);
        console.log('✅ Google Gemini API key found - using for image generation');
      } else {
        // No API key - still allow generation with free services
        setApiKey('');
        setHasApiKey(true);
        console.log('✅ AI image generation enabled - using free services');
      }
    } catch (error) {
      console.error('Error checking API key:', error);
    }
  };

  const generateImageWithAI = async (prompt: string) => {
    if (!hasApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    setGenerating(true);
    try {
      console.log('🎨 Generating image with REAL AI system for prompt:', prompt);
      console.log('⚡ Generating image immediately...');
      
      const result = await generateImage({
        prompt,
        apiKey: apiKey || 'free-services',
        style: 'photographic',
        aspectRatio: '16:9'
      });
      
      console.log('Generated image URL:', result.imageUrl);
      
      // Validate the image URL
      if (!result.imageUrl || result.imageUrl.includes('placeholder')) {
        console.warn('Generated image appears to be a placeholder');
      }
      
      return result.imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Image generation error details:', errorMessage);
      
      // Return a more descriptive fallback
      const encodedPrompt = encodeURIComponent(prompt.substring(0, 50));
      return `https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=${encodedPrompt}`;
    } finally {
      setGenerating(false);
    }
  };

  const createDesign = async () => {
    if (!user || !newDesign.title || !newDesign.prompt) return;

    try {
      const imageUrl = await generateImageWithAI(newDesign.prompt) || 'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Generated+Image';
      
      const newDesignData: CreativeDesign = {
        id: Date.now().toString(),
        user_id: user.id,
        title: newDesign.title,
        description: newDesign.description,
        prompt: newDesign.prompt,
        image_url: imageUrl,
        tags: newDesign.tags,
        is_public: newDesign.isPublic,
        likes_count: 0,
        comments_count: 0,
        rating: 0,
        created_at: new Date().toISOString(),
        profiles: { 
          full_name: 'You',
          avatar_url: undefined
        },
        comments: [],
        user_liked: false,
        user_rated: 0
      };

      setDesigns(prev => [newDesignData, ...prev]);
      setShowCreateModal(false);
      setNewDesign({
        title: '',
        description: '',
        prompt: '',
        tags: [],
        isPublic: true
      });
    } catch (error) {
      console.error('Error creating design:', error);
    }
  };

  const toggleLike = async (designId: string) => {
    if (!user) return;

    setDesigns(prev => prev.map(design => {
      if (design.id === designId) {
        const isLiked = design.user_liked;
        return {
          ...design,
          user_liked: !isLiked,
          likes_count: isLiked ? design.likes_count - 1 : design.likes_count + 1
        };
      }
      return design;
    }));
  };

  const addComment = (designId: string) => {
    const comment = newComments[designId];
    if (!comment.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user_id: user?.id || 'current-user',
      content: comment,
      created_at: new Date().toISOString(),
      user_name: 'You'
    };

    setDesigns(prev => prev.map(design => {
      if (design.id === designId) {
        return {
          ...design,
          comments: [...(design.comments || []), newComment],
          comments_count: design.comments_count + 1
        };
      }
      return design;
    }));

    setNewComments(prev => ({ ...prev, [designId]: '' }));
  };

  // Post management functions
  const startEditPost = (design: CreativeDesign) => {
    setEditingPost(design.id);
    setEditForm({
      title: design.title,
      description: design.description,
      tags: design.tags
    });
  };

  const cancelEditPost = () => {
    setEditingPost(null);
    setEditForm({
      title: '',
      description: '',
      tags: []
    });
  };

  const saveEditPost = () => {
    if (!editingPost) return;

    setDesigns(prev => prev.map(design => 
      design.id === editingPost 
        ? { 
            ...design, 
            title: editForm.title,
            description: editForm.description,
            tags: editForm.tags
          }
        : design
    ));

    setEditingPost(null);
    setEditForm({
      title: '',
      description: '',
      tags: []
    });
  };

  const deletePost = (designId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setDesigns(prev => prev.filter(design => design.id !== designId));
    }
  };

  const regenerateImage = async (designId: string, prompt: string) => {
    if (!hasApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    setGenerating(true);
    try {
      const imageUrl = await generateImageWithAI(prompt);
      if (imageUrl) {
        setDesigns(prev => prev.map(design => 
          design.id === designId 
            ? { ...design, image_url: imageUrl }
            : design
        ));
      }
    } catch (error) {
      console.error('Error regenerating image:', error);
    } finally {
      setGenerating(false);
    }
  };

  const rateDesign = (designId: string, rating: number) => {
    if (!user) return;

    setDesigns(prev => prev.map(design => {
      if (design.id === designId) {
        const currentRating = design.user_rated || 0;
        const newRating = currentRating === rating ? 0 : rating;
        return {
          ...design,
          user_rated: newRating
        };
      }
      return design;
    }));
  };

  const toggleComments = (designId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [designId]: !prev[designId]
    }));
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         design.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         design.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="h-8 w-8 text-pink-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Creative Learning Hub
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Share and discover creative ways to learn
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search designs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Social Media Status */}
        {!hasApiKey && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2">📱</div>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Ready to create educational social media posts with instant AI images! 
                <button 
                  onClick={() => setShowApiKeyModal(true)}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Get Started
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Social Media Feed */}
        <div className="space-y-6">
          {filteredDesigns.map((design) => (
            <div key={design.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Post Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                      {design.profiles?.avatar_url ? (
                        <img
                          src={design.profiles.avatar_url}
                          alt={design.profiles.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {design.profiles?.full_name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(design.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {design.user_id === user?.id && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => startEditPost(design)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                          title="Edit post"
                        >
                          <Palette className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => deletePost(design.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full"
                          title="Delete post"
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    )}
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                      <MoreHorizontal className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                {editingPost === design.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        rows={3}
                        placeholder="Enter description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={editForm.tags.join(', ')}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter tags separated by commas"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={saveEditPost}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={cancelEditPost}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {design.title}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {design.description}
                    </p>
                  </>
                )}
                
                {/* Image */}
                <div className="mb-4 relative">
                  {generating && design.user_id === user?.id ? (
                    <div className="w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-300">🤖 AI is generating your educational post image...</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This takes 4-5 seconds using free AI services</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">{design.prompt}</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={design.image_url}
                      alt={design.title}
                      className="w-full rounded-lg shadow-sm"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=${encodeURIComponent(design.title)}`;
                      }}
                    />
                  )}
                  {design.user_id === user?.id && !editingPost && !generating && (
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => regenerateImage(design.id, design.prompt)}
                        disabled={generating}
                        className="px-3 py-1 bg-black/50 hover:bg-black/70 text-white text-xs rounded-lg transition-colors flex items-center space-x-1"
                        title="Regenerate image"
                      >
                        <Palette className="h-3 w-3" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {design.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 text-xs rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {design.rating.toFixed(1)}
                    </span>
                    <span>{design.likes_count} likes</span>
                    <span>{design.comments_count} comments</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => toggleLike(design.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-colors ${
                        design.user_liked 
                          ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${design.user_liked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">Like</span>
                    </button>

                    <button
                      onClick={() => toggleComments(design.id)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">Comment</span>
                    </button>

                    <button className="flex items-center space-x-2 px-3 py-2 rounded-full text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                      <Share2 className="h-5 w-5" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => rateDesign(design.id, star)}
                        className={`h-5 w-5 ${
                          (design.user_rated || 0) >= star
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        <Star className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              {expandedComments[design.id] && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  {/* Existing Comments */}
                  <div className="space-y-3 mb-4">
                    {design.comments?.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm text-gray-900 dark:text-white">
                                {comment.user_name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTimeAgo(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment */}
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComments[design.id] || ''}
                        onChange={(e) => setNewComments(prev => ({ ...prev, [design.id]: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && addComment(design.id)}
                      />
                      <button
                        onClick={() => addComment(design.id)}
                        className="px-4 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors text-sm font-medium"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredDesigns.length === 0 && (
          <div className="text-center py-12">
            <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No designs found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm 
                ? 'Try adjusting your search or filters'
                : 'Be the first to create a creative learning design!'
              }
            </p>
          </div>
        )}
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📱 Create Educational Social Media Post
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Create posts with AI-generated images for the educational community. Instant generation!
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">🎨 Educational Image Generation:</h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>🖼️ Unique educational images</li>
                  <li>⚡ Instant generation</li>
                  <li>📚 Based on your prompt keywords</li>
                  <li>📱 Perfect for social media posts</li>
                  <li>✅ Always works - no API keys needed</li>
                </ul>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
                  💡 Creates unique educational images based on your description!
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (apiKey.trim()) {
                    localStorage.setItem('google_gemini_api_key', apiKey.trim());
                  }
                  setHasApiKey(true);
                  setShowApiKeyModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Creating Posts! 📱
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Design Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Design
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newDesign.title}
                  onChange={(e) => setNewDesign(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Photosynthesis Process Diagram"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newDesign.description}
                  onChange={(e) => setNewDesign(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your design and how it helps with learning..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AI Prompt *
                </label>
                <textarea
                  value={newDesign.prompt}
                  onChange={(e) => setNewDesign(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Describe what you want the AI to generate..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newDesign.tags.join(', ')}
                  onChange={(e) => setNewDesign(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  }))}
                  placeholder="e.g., biology, photosynthesis, diagram, educational"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newDesign.isPublic}
                  onChange={(e) => setNewDesign(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Make this design public for the community
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createDesign}
                disabled={!newDesign.title || !newDesign.prompt || generating}
                className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    🤖 Creating Post...
                  </>
                ) : (
                  <>
                    <Palette className="h-4 w-4 mr-2" />
                    Create Social Media Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeLearningPage;