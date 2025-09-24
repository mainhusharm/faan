import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  Play, 
  Star, 
  CheckCircle,
  ArrowRight,
  Globe,
  Clock,
  Target,
  Zap,
  Shield,
  Smartphone,
  Monitor,
  Brain,
  Trophy,
  MessageCircle,
  ChevronRight,
  Palette,
  Heart,
  Share2
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <BookOpen className="h-12 w-12 text-indigo-600" />,
      title: 'Interactive Learning',
      description: 'Engage with dynamic content, hands-on exercises, and real-world projects that make learning stick.',
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      icon: <Users className="h-12 w-12 text-emerald-600" />,
      title: 'Expert Mentorship',
      description: 'Learn from industry professionals with years of experience in their respective fields.',
      color: 'bg-emerald-50 border-emerald-200'
    },
    {
      icon: <Award className="h-12 w-12 text-amber-600" />,
      title: 'Verified Certificates',
      description: 'Earn industry-recognized certificates that boost your career prospects and credibility.',
      color: 'bg-amber-50 border-amber-200'
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-rose-600" />,
      title: 'Progress Analytics',
      description: 'Track your learning journey with detailed insights and personalized recommendations.',
      color: 'bg-rose-50 border-rose-200'
    },
    {
      icon: <Globe className="h-12 w-12 text-blue-600" />,
      title: 'Global Community',
      description: 'Connect with learners worldwide and collaborate on projects and discussions.',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: <Zap className="h-12 w-12 text-purple-600" />,
      title: 'Adaptive Learning',
      description: 'AI-powered personalization that adapts to your learning style and pace.',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      icon: <Palette className="h-12 w-12 text-pink-600" />,
      title: 'Creative Learning Hub',
      description: 'Generate and share creative educational designs using AI. Inspire others with your visual learning approaches.',
      color: 'bg-pink-50 border-pink-200'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Learners', icon: <Users className="h-6 w-6" /> },
    { number: '1,200+', label: 'Expert Courses', icon: <BookOpen className="h-6 w-6" /> },
    { number: '95%', label: 'Success Rate', icon: <Trophy className="h-6 w-6" /> },
    { number: '24/7', label: 'Support Available', icon: <MessageCircle className="h-6 w-6" /> }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Full Stack Developer at Google',
      content: 'Fusioned transformed my career completely. The practical approach and expert guidance helped me land my dream job at Google.',
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      company: 'Google'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Data Scientist at Microsoft',
      content: 'The quality of content and the interactive learning experience is unmatched. I gained practical skills that I use daily in my role.',
      rating: 5,
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      company: 'Microsoft'
    },
    {
      name: 'Emily Johnson',
      role: 'UX Designer at Apple',
      content: 'The design courses here are incredibly comprehensive. The projects and feedback from mentors helped me build an amazing portfolio.',
      rating: 5,
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      company: 'Apple'
    }
  ];

  const learningPaths = [
    {
      title: 'Physics',
      description: 'Master mechanics, thermodynamics, and modern physics',
      courses: 18,
      duration: '1 year',
      level: '12th Standard',
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600',
      skills: ['Mechanics', 'Thermodynamics', 'Optics', 'Modern Physics']
    },
    {
      title: 'Chemistry',
      description: 'Explore organic, inorganic and physical chemistry',
      courses: 16,
      duration: '1 year',
      level: '12th Standard',
      image: 'https://images.pexels.com/photos/590011/pexels-photo-590011.jpeg?auto=compress&cs=tinysrgb&w=600',
      skills: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry']
    },
    {
      title: 'Mathematics',
      description: 'Master calculus, algebra and coordinate geometry',
      courses: 20,
      duration: '1 year',
      level: '12th Standard',
      image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600',
      skills: ['Calculus', 'Algebra', 'Coordinate Geometry', 'Statistics']
    }
  ];


  const platformFeatures = [
    {
      icon: <Monitor className="h-8 w-8 text-indigo-600" />,
      title: 'Multi-Device Learning',
      description: 'Learn seamlessly across desktop, tablet, and mobile devices'
    },
    {
      icon: <Brain className="h-8 w-8 text-emerald-600" />,
      title: 'AI-Powered Insights',
      description: 'Get personalized recommendations based on your learning patterns'
    },
    {
      icon: <Shield className="h-8 w-8 text-amber-600" />,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security measures'
    },
    {
      icon: <Clock className="h-8 w-8 text-rose-600" />,
      title: 'Flexible Schedule',
      description: 'Learn at your own pace with lifetime access to course materials'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-all duration-500">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="relative max-w-8xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 animate-fadeInLeft">
              <div className="space-y-6">
                <div className="inline-flex items-center px-6 py-3 glass rounded-2xl text-white text-sm font-semibold">
                  <Zap className="h-5 w-5 mr-3" />
                  🚀 Transform Your Future Today
                </div>
                <h1 className="text-6xl lg:text-8xl font-black leading-tight text-white">
                  Master Skills That
                  <span className="block gradient-text-secondary"> Matter Most</span>
                </h1>
                <p className="text-2xl text-blue-100 leading-relaxed max-w-2xl font-medium">
                  Join over 50,000+ professionals who've accelerated their careers with our cutting-edge courses, 
                  AI-powered learning, and industry-recognized certifications.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                {user ? (
                  <Link
                    to="/courses"
                    className="group btn-primary text-lg px-8 py-4 inline-flex items-center"
                  >
                    <Play className="h-6 w-6 mr-3" />
                    Continue Learning
                    <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="group btn-primary text-lg px-8 py-4 inline-flex items-center"
                    >
                      Start Learning Free
                      <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/signin"
                      className="btn-ghost text-lg px-8 py-4 text-white border-white/30 hover:bg-white/10 hover:border-white/50"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-12 pt-6">
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-4 border-white shadow-lg"></div>
                    ))}
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">50,000+</div>
                    <div className="text-blue-200 text-sm">Active Learners</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                  <div className="ml-3">
                    <div className="text-white font-bold text-lg">4.9/5</div>
                    <div className="text-blue-200 text-sm">Rating</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fadeInRight">
              <div className="relative z-10">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Online Learning"
                    className="rounded-3xl shadow-2xl border-4 border-white/20"
                  />
                  
                  {/* Floating Cards */}
                  <div className="absolute -top-8 -right-8 glass rounded-2xl p-6 shadow-xl animate-float">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xl">95%</div>
                        <div className="text-blue-200 text-sm">Success Rate</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-8 -left-8 glass rounded-2xl p-6 shadow-xl animate-float" style={{animationDelay: '1s'}}>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 gradient-success rounded-2xl flex items-center justify-center">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-bold text-xl">1,200+</div>
                        <div className="text-blue-200 text-sm">Expert Courses</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-3xl blur-3xl transform scale-110 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl">
        <div className="max-w-8xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-fadeInUp" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-3xl text-white mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  {stat.icon}
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white mb-2 gradient-text">{stat.number}</div>
                <div className="text-slate-600 dark:text-gray-300 font-semibold text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-gray-800">
        <div className="max-w-8xl mx-auto px-6">
          <div className="text-center mb-20 animate-fadeInUp">
            <div className="inline-flex items-center px-6 py-3 gradient-primary rounded-2xl text-white text-sm font-semibold mb-6">
              <Target className="h-5 w-5 mr-3" />
              Why Choose Fusioned
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-8">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-2xl text-slate-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Our comprehensive platform provides all the tools, resources, and support you need to master new skills and advance your career.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-hover animate-fadeInUp group" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="mb-8 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{feature.title}</h3>
                <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-gray-900">
        <div className="max-w-8xl mx-auto px-6">
          <div className="text-center mb-20 animate-fadeInUp">
            <div className="inline-flex items-center px-6 py-3 gradient-success rounded-2xl text-white text-sm font-semibold mb-6">
              <BookOpen className="h-5 w-5 mr-3" />
              Popular Learning Paths
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-8">
              Structured Learning <span className="gradient-text-secondary">Journeys</span>
            </h2>
            <p className="text-2xl text-slate-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Follow our expertly designed learning paths to master in-demand skills and achieve your career goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {learningPaths.map((path, index) => (
              <div key={index} className="card-hover animate-fadeInUp group overflow-hidden" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="relative">
                  <img
                    src={path.image}
                    alt={path.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-6 right-6 glass rounded-2xl px-4 py-2 text-white text-sm font-semibold">
                    {path.courses} courses
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{path.title}</h3>
                  <p className="text-slate-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">{path.description}</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center text-slate-600 dark:text-gray-300">
                      <Clock className="h-5 w-5 mr-3 text-blue-600" />
                      <span className="font-semibold">{path.duration}</span>
                    </div>
                    <div className="flex items-center text-slate-600 dark:text-gray-300">
                      <Target className="h-5 w-5 mr-3 text-emerald-600" />
                      <span className="font-semibold">{path.level}</span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="text-lg font-bold text-slate-900 dark:text-white mb-4">Key Skills:</div>
                    <div className="flex flex-wrap gap-3">
                      {path.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full btn-primary text-lg py-4 flex items-center justify-center group">
                    Start Learning Path
                    <ChevronRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Learning Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-4">
              <Palette className="h-4 w-4 mr-2" />
              New Feature
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Creative Learning <span className="text-pink-600">Hub</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Generate and share creative educational designs using AI. Inspire the community with your innovative visual learning approaches.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Palette className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">AI-Powered Design Generation</h3>
                    <p className="text-slate-600">Create stunning educational diagrams, infographics, and visual aids using Google's Imagen 3 AI technology.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Community Sharing</h3>
                    <p className="text-slate-600">Share your creative designs with the community and discover innovative learning approaches from other students.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Heart className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Interactive Community</h3>
                    <p className="text-slate-600">Like, comment, and engage with creative designs. Build a network of visual learners and educators.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/creative-learning"
                  className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Palette className="h-5 w-5 mr-2" />
                  Explore Creative Hub
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/settings"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-pink-300 hover:border-pink-400 text-pink-700 hover:text-pink-800 font-semibold rounded-xl transition-all duration-200 hover:bg-pink-50"
                >
                  Setup API Key
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="w-full h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg mb-3 flex items-center justify-center">
                      <Palette className="h-8 w-8 text-pink-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm">Photosynthesis Diagram</h4>
                    <p className="text-xs text-slate-600">by Sarah Chen</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-slate-600">24</span>
                      </div>
                      <Share2 className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-lg mb-3 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm">Math Formula Visual</h4>
                    <p className="text-xs text-slate-600">by Alex Kim</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-slate-600">18</span>
                      </div>
                      <Share2 className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="w-full h-32 bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg mb-3 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm">History Timeline</h4>
                    <p className="text-xs text-slate-600">by Maria Garcia</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-slate-600">31</span>
                      </div>
                      <Share2 className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-lg">
                    <div className="w-full h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg mb-3 flex items-center justify-center">
                      <Zap className="h-8 w-8 text-amber-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm">Chemistry Reaction</h4>
                    <p className="text-xs text-slate-600">by David Lee</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-slate-600">27</span>
                      </div>
                      <Share2 className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
                <Smartphone className="h-4 w-4 mr-2" />
                Advanced Platform
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Learn Anywhere, <span className="text-purple-600">Anytime</span>
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Our cutting-edge platform adapts to your learning style and provides a seamless experience across all devices.
              </p>
              
              <div className="space-y-6">
                {platformFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                      <p className="text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Learning Platform"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Brain className="h-6 w-6" />
                  <div>
                    <div className="font-bold">AI-Powered</div>
                    <div className="text-sm opacity-90">Smart Learning</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-amber-600/20 border border-amber-500/30 rounded-full text-amber-300 text-sm font-medium mb-4">
              <MessageCircle className="h-4 w-4 mr-2" />
              Success Stories
            </div>
            <h2 className="text-4xl font-bold mb-6">
              What Our <span className="text-amber-400">Learners Say</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Join thousands of professionals who have transformed their careers with Fusioned
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-slate-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
          
          <div className="relative max-w-6xl mx-auto px-6 text-center animate-fadeInUp">
            <h2 className="text-5xl lg:text-7xl font-black mb-8">
              Ready to Transform Your <span className="gradient-text-secondary">Career?</span>
            </h2>
            <p className="text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Join over 50,000+ students who have achieved excellent results in their 12th standard board exams with our expert-led courses and comprehensive study materials.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                to="/signup"
                className="group inline-flex items-center justify-center px-10 py-5 bg-white hover:bg-slate-100 text-blue-600 font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Start Learning Free
                <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-white/30 hover:border-white/50 text-white font-bold text-xl rounded-2xl transition-all duration-300 hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
            <div className="flex items-center justify-center space-x-12 text-lg text-blue-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6" />
                <span className="font-semibold">Free 7-day trial</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6" />
                <span className="font-semibold">No credit card required</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6" />
                <span className="font-semibold">Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;