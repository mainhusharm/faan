import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import QuizComponent from '../components/Quiz/QuizComponent';
import RankingSidebar from '../components/Layout/RankingSidebar';
import { 
  Play, CheckCircle, Clock, Users, Star, ChevronRight, ChevronLeft, 
  BookOpen, Bookmark, Share2, ThumbsUp, 
  CheckCircle2, FileText, Video, BarChart3,
  Trophy, Zap, Target, Brain, Calculator, MessageCircle,
  TrendingUp, Award, Flame
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Video {
  id: string;
  title: string;
  video_url: string;
  duration: number;
  order_index: number;
  description?: string;
  isPreview?: boolean;
}

interface Quiz {
  id: string;
  video_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  rating: number;
  studentsCount: number;
  lastUpdated: string;
  language: string;
  price: number;
  originalPrice?: number;
  whatYoullLearn: string[];
  requirements: string[];
  instructorBio: string;
  instructorRating: number;
  instructorStudents: number;
  instructorCourses: number;
}

interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  avatar?: string;
}

interface Note {
  id: string;
  videoId: string;
  timestamp: number;
  content: string;
  createdAt: string;
}

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarkedVideos, setBookmarkedVideos] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'reviews' | 'instructor'>('overview');
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [courseProgress, setCourseProgress] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState<string>('');
  const [showProblemSolver, setShowProblemSolver] = useState(false);
  const [problemInput, setProblemInput] = useState('');
  const [problemSolution, setProblemSolution] = useState('');
  const [showGraphingTool, setShowGraphingTool] = useState(false);
  const [graphFunction, setGraphFunction] = useState('');
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [discussionMessages, setDiscussionMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!courseId) return;
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    // Mock data - replace with actual Supabase queries
    const getCourseData = (id: string): Course => {
      const courses: { [key: string]: Course } = {
        '6': {
          id: '6',
          title: 'Calculus I - Limits, Derivatives & Integration',
          description: 'Master the fundamentals of calculus with limits, derivatives, and introduction to integration. Learn with AI-powered curve analysis, interactive visualizations, and step-by-step problem solving. This comprehensive course covers everything from basic limit concepts to derivative applications and basic integration techniques.',
          instructor: 'Dr. Robert Kim',
          duration: '52 hours',
          level: 'Foundation',
          rating: 4.9,
          studentsCount: 18750,
          lastUpdated: '2024-01-15',
          language: 'English',
          price: 99.99,
          originalPrice: 249.99,
          whatYoullLearn: [
            'Master the concept of limits and continuity',
            'Understand derivatives and their geometric meaning',
            'Apply differentiation rules and chain rule',
            'Solve optimization problems using derivatives',
            'Learn basic integration techniques and applications',
            'Master implicit differentiation and related rates',
            'Understand L\'Hôpital\'s rule and indeterminate forms',
            'Apply integration to find areas under curves'
          ],
          requirements: [
            'Strong foundation in algebra and trigonometry',
            'Understanding of functions and their properties',
            'Basic knowledge of coordinate geometry',
            'Access to computer with internet connection'
          ],
          instructorBio: 'Dr. Robert Kim is a distinguished mathematics professor with 20+ years of experience in calculus education. He has authored several calculus textbooks and has helped over 100,000 students master calculus concepts.',
          instructorRating: 4.9,
          instructorStudents: 100000,
          instructorCourses: 15
        },
        '13': {
          id: '13',
          title: 'Calculus II - Comprehensive Integration & Applications',
          description: 'Master comprehensive integration techniques including substitution, integration by parts, partial fractions, and trigonometric substitution. Explore advanced applications in physics, engineering, and mathematics with AI-powered visualizations, 3D volume calculations, and real-world problem solving.',
          instructor: 'Dr. Robert Kim',
          duration: '65 hours',
          level: 'Intermediate',
          rating: 4.8,
          studentsCount: 15200,
          lastUpdated: '2024-01-15',
          language: 'English',
          price: 109.99,
          originalPrice: 279.99,
          whatYoullLearn: [
            'Master all major integration techniques',
            'Understand the Fundamental Theorem of Calculus',
            'Apply integration to find areas, volumes, and surface areas',
            'Solve real-world physics and engineering problems',
            'Work with improper integrals and convergence',
            'Master infinite series and convergence tests',
            'Use AI tools for complex area and volume calculations',
            'Apply integration to work, fluid pressure, and center of mass',
            'Master power series and Taylor series approximations'
          ],
          requirements: [
            'Completion of Calculus I or equivalent',
            'Strong understanding of derivatives',
            'Knowledge of basic integration concepts',
            'Access to computer with internet connection'
          ],
          instructorBio: 'Dr. Robert Kim is a distinguished mathematics professor with 20+ years of experience in calculus education. He has authored several calculus textbooks and has helped over 100,000 students master calculus concepts.',
          instructorRating: 4.9,
          instructorStudents: 100000,
          instructorCourses: 15
        },
        '14': {
          id: '14',
          title: 'Calculus III - Multivariable Calculus',
          description: 'Master partial derivatives, multiple integrals, and vector calculus with 3D AI visualizations and surface analysis tools. Explore the beautiful world of multivariable calculus.',
          instructor: 'Dr. Robert Kim',
          duration: '55 hours',
          level: 'Advanced',
          rating: 4.9,
          studentsCount: 12800,
          lastUpdated: '2024-01-15',
          language: 'English',
          price: 119.99,
          originalPrice: 299.99,
          whatYoullLearn: [
            'Master partial derivatives and gradients',
            'Understand multiple integrals and their applications',
            'Work with vector fields and line integrals',
            'Apply Green\'s, Stokes\' and Divergence theorems',
            'Use 3D AI visualizations for complex surfaces',
            'Solve optimization problems in multiple variables',
            'Apply multivariable calculus to physics and engineering'
          ],
          requirements: [
            'Completion of Calculus I and II',
            'Strong understanding of single-variable calculus',
            'Basic knowledge of vectors and 3D geometry',
            'Access to computer with internet connection'
          ],
          instructorBio: 'Dr. Robert Kim is a distinguished mathematics professor with 20+ years of experience in calculus education. He has authored several calculus textbooks and has helped over 100,000 students master calculus concepts.',
          instructorRating: 4.9,
          instructorStudents: 100000,
          instructorCourses: 15
        },
        '15': {
          id: '15',
          title: 'Differential Equations',
          description: 'Solve first-order, second-order, and systems of differential equations with AI solution visualization and phase plane analysis. Master the mathematical language of change.',
          instructor: 'Dr. Robert Kim',
          duration: '42 hours',
          level: 'Advanced',
          rating: 4.7,
          studentsCount: 9600,
          lastUpdated: '2024-01-15',
          language: 'English',
          price: 109.99,
          originalPrice: 259.99,
          whatYoullLearn: [
            'Solve first-order differential equations',
            'Master second-order linear differential equations',
            'Work with systems of differential equations',
            'Use Laplace transforms for solving DEs',
            'Apply AI visualization for phase plane analysis',
            'Model real-world phenomena with differential equations',
            'Understand stability and equilibrium points'
          ],
          requirements: [
            'Completion of Calculus I and II',
            'Understanding of integration techniques',
            'Basic knowledge of complex numbers',
            'Access to computer with internet connection'
          ],
          instructorBio: 'Dr. Robert Kim is a distinguished mathematics professor with 20+ years of experience in calculus education. He has authored several calculus textbooks and has helped over 100,000 students master calculus concepts.',
          instructorRating: 4.9,
          instructorStudents: 100000,
          instructorCourses: 15
        },
        '7': {
          id: '7',
          title: 'Chemistry Foundation - Atomic Theory & Stoichiometry',
          description: 'Master fundamental chemistry concepts including the mole concept, Avogadro\'s number, and molar mass calculations. Learn with AI-powered molecular visualizations, stoichiometric calculations, and interactive problem-solving tools.',
          instructor: 'Dr. Michael Chen',
          duration: '28 hours',
          level: 'Foundation',
          rating: 4.8,
          studentsCount: 15200,
          lastUpdated: '2024-01-15',
          language: 'English',
          price: 94.99,
          originalPrice: 219.99,
          whatYoullLearn: [
            'Master the mole concept and its applications',
            'Understand Avogadro\'s number and its significance',
            'Calculate molar mass for compounds and elements',
            'Apply stoichiometric principles to chemical reactions',
            'Use AI tools for molecular visualization and calculations',
            'Solve complex chemistry problems with confidence'
          ],
          requirements: [
            'Basic understanding of algebra',
            'High school mathematics background',
            'Access to computer with internet connection',
            'No prior chemistry experience required'
          ],
          instructorBio: 'Dr. Michael Chen is a distinguished chemistry professor with 18+ years of experience in chemical education. He has authored several chemistry textbooks and has helped over 75,000 students master chemistry concepts.',
          instructorRating: 4.8,
          instructorStudents: 75000,
          instructorCourses: 10
        },
        '1': {
          id: '1',
      title: 'Physics Foundation - Mechanics & Motion',
      description: 'Master kinematics, forces, and energy with AI visualizations of projectile motion and molecular-level demonstrations. Learn Newton\'s Laws with interactive simulations and explore energy conservation through particle animations.',
      instructor: 'Dr. Sarah Williams',
      duration: '24 hours',
      level: 'Foundation',
      rating: 4.9,
      studentsCount: 12450,
      lastUpdated: '2024-01-15',
      language: 'English',
      price: 89.99,
      originalPrice: 199.99,
      whatYoullLearn: [
        'Master fundamental concepts of kinematics and motion',
        'Understand Newton\'s Laws with interactive AI visualizations',
        'Apply energy and momentum principles to real-world problems',
        'Analyze projectile motion using advanced simulations',
        'Develop problem-solving skills for physics challenges'
      ],
      requirements: [
        'Basic understanding of algebra',
        'High school mathematics background',
        'Access to computer with internet connection',
        'No prior physics experience required'
      ],
      instructorBio: 'Dr. Sarah Williams is a renowned physics professor with 15+ years of experience in STEM education. She has published over 50 research papers and has taught thousands of students worldwide.',
      instructorRating: 4.9,
      instructorStudents: 45000,
      instructorCourses: 12
        }
      };
      
      return courses[id] || courses['1']; // Default to physics course if not found
    };

    const mockCourse = getCourseData(courseId!);

    const getVideosForCourse = (courseId: string): Video[] => {
      const videoSets: { [key: string]: Video[] } = {
        '6': [ // Calculus I
          {
            id: 'calc1-1',
            title: 'Introduction to Limits',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 18,
            order_index: 0,
            description: 'Learn the fundamental concept of limits and how they form the foundation of calculus with AI-powered visualizations.',
            isPreview: true
          },
          {
            id: 'calc1-2',
            title: 'Continuity and One-Sided Limits',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 22,
            order_index: 1,
            description: 'Explore continuity and one-sided limits with interactive graphs and real-world examples.'
          },
          {
            id: 'calc1-3',
            title: 'Introduction to Derivatives',
            video_url: 'https://www.youtube.com/embed/9y6mQTpVRIM',
            duration: 25,
            order_index: 2,
            description: 'Understand the derivative as the slope of the tangent line and rate of change with AI curve analysis.'
          },
          {
            id: 'calc1-4',
            title: 'Basic Differentiation Rules',
            video_url: 'https://www.youtube.com/embed/9y6mQTpVRIM',
            duration: 28,
            order_index: 3,
            description: 'Master the power rule, product rule, and quotient rule with step-by-step AI demonstrations.'
          },
          {
            id: 'calc1-5',
            title: 'Chain Rule and Implicit Differentiation',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 30,
            order_index: 4,
            description: 'Learn the chain rule and implicit differentiation with AI visualizations of composite functions.'
          },
          {
            id: 'calc1-6',
            title: 'Introduction to Integration',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 28,
            order_index: 5,
            description: 'Discover integration as the reverse of differentiation with AI area-under-curve visualizations and basic integration rules.'
          },
          {
            id: 'calc1-7',
            title: 'Applications of Derivatives',
            video_url: 'https://www.youtube.com/embed/9y6mQTpVRIM',
            duration: 32,
            order_index: 6,
            description: 'Apply derivatives to optimization problems, related rates, and curve sketching with AI tools.'
          },
          {
            id: 'calc1-8',
            title: 'Basic Integration Applications',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 30,
            order_index: 7,
            description: 'Apply basic integration to find areas under curves and solve simple real-world problems with AI visualizations.'
          }
        ],
        '13': [ // Calculus II
          {
            id: 'calc2-1',
            title: 'Introduction to Integration',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 20,
            order_index: 0,
            description: 'Learn the concept of integration as the reverse of differentiation with AI area-under-curve visualizations.',
            isPreview: true
          },
          {
            id: 'calc2-2',
            title: 'Basic Integration Techniques',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 25,
            order_index: 1,
            description: 'Master basic integration rules and techniques with AI step-by-step problem solving.'
          },
          {
            id: 'calc2-3',
            title: 'Integration by Substitution',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 28,
            order_index: 2,
            description: 'Learn u-substitution method with AI visualizations of function transformations.'
          },
          {
            id: 'calc2-4',
            title: 'Integration by Parts',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 30,
            order_index: 3,
            description: 'Master integration by parts with AI demonstrations of the LIATE rule.'
          },
          {
            id: 'calc2-5',
            title: 'Advanced Integration Techniques',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 32,
            order_index: 4,
            description: 'Master partial fractions, trigonometric substitution, and integration of rational functions with AI step-by-step solutions.'
          },
          {
            id: 'calc2-6',
            title: 'Applications of Integration - Areas and Volumes',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 35,
            order_index: 5,
            description: 'Apply integration to find areas between curves, volumes of revolution, and surface areas with 3D AI visualizations.'
          },
          {
            id: 'calc2-7',
            title: 'Applications of Integration - Physics and Engineering',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 33,
            order_index: 6,
            description: 'Solve real-world problems: work, fluid pressure, center of mass, and arc length with AI simulations.'
          },
          {
            id: 'calc2-8',
            title: 'Improper Integrals and Convergence',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 28,
            order_index: 7,
            description: 'Master improper integrals with infinite limits and discontinuities using AI convergence analysis.'
          },
          {
            id: 'calc2-9',
            title: 'Infinite Series and Convergence Tests',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 32,
            order_index: 8,
            description: 'Explore infinite series, convergence tests, and power series with AI convergence analysis tools.'
          },
          {
            id: 'calc2-10',
            title: 'Power Series and Taylor Series',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 30,
            order_index: 9,
            description: 'Master power series representation of functions and Taylor series approximations with AI polynomial visualizations.'
          }
        ],
        '14': [ // Calculus III
          {
            id: 'calc3-1',
            title: 'Functions of Several Variables',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 22,
            order_index: 0,
            description: 'Introduction to functions of multiple variables with 3D AI surface visualizations.',
            isPreview: true
          },
          {
            id: 'calc3-2',
            title: 'Partial Derivatives',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 25,
            order_index: 1,
            description: 'Learn partial derivatives and their geometric interpretation with AI 3D surface analysis.'
          },
          {
            id: 'calc3-3',
            title: 'Multiple Integrals',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 30,
            order_index: 2,
            description: 'Master double and triple integrals with AI volume calculations and 3D visualizations.'
          },
          {
            id: 'calc3-4',
            title: 'Vector Fields and Line Integrals',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 28,
            order_index: 3,
            description: 'Explore vector fields and line integrals with AI vector field visualizations.'
          },
          {
            id: 'calc3-5',
            title: 'Green\'s, Stokes\' and Divergence Theorems',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 35,
            order_index: 4,
            description: 'Master the fundamental theorems of vector calculus with AI 3D demonstrations.'
          },
          {
            id: 'calc3-6',
            title: 'Applications in Physics and Engineering',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 32,
            order_index: 5,
            description: 'Apply multivariable calculus to real-world physics and engineering problems with AI simulations.'
          }
        ],
        '15': [ // Differential Equations
          {
            id: 'de-1',
            title: 'Introduction to Differential Equations',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 20,
            order_index: 0,
            description: 'Learn what differential equations are and their importance in modeling real-world phenomena.',
            isPreview: true
          },
          {
            id: 'de-2',
            title: 'First-Order Differential Equations',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 25,
            order_index: 1,
            description: 'Solve separable and linear first-order differential equations with AI solution visualization.'
          },
          {
            id: 'de-3',
            title: 'Second-Order Linear Differential Equations',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 30,
            order_index: 2,
            description: 'Master homogeneous and non-homogeneous second-order linear differential equations.'
          },
          {
            id: 'de-4',
            title: 'Systems of Differential Equations',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 28,
            order_index: 3,
            description: 'Solve systems of differential equations with AI phase plane analysis.'
          },
          {
            id: 'de-5',
            title: 'Laplace Transforms',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 32,
            order_index: 4,
            description: 'Use Laplace transforms to solve differential equations with AI transform visualizations.'
          },
          {
            id: 'de-6',
            title: 'Applications in Science and Engineering',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 35,
            order_index: 5,
            description: 'Apply differential equations to model population growth, oscillations, and electrical circuits.'
          }
        ],
        '7': [ // Chemistry Foundation
          {
            id: 'chem1-1',
            title: 'The Mole Concept',
            video_url: 'https://www.youtube.com/embed/TGG0p1fWYqE',
            duration: 22,
            order_index: 0,
            description: 'Master the fundamental mole concept and understand how it relates to counting atoms and molecules in chemical reactions.',
            isPreview: true
          },
          {
            id: 'chem1-2',
            title: 'Avogadro\'s Number',
            video_url: 'https://www.youtube.com/embed/NRz6P7jVols',
            duration: 18,
            order_index: 1,
            description: 'Learn about Avogadro\'s number (6.022 × 10²³) and its significance in connecting the microscopic world of atoms to macroscopic measurements.'
          },
          {
            id: 'chem1-3',
            title: 'Molar Mass Calculations',
            video_url: 'https://www.youtube.com/embed/mYnu7oin5ho',
            duration: 25,
            order_index: 2,
            description: 'Calculate molar mass for elements and compounds, and apply these calculations to solve stoichiometric problems.'
          }
        ],
        '1': [ // Physics (default)
      {
        id: '1',
        title: 'Introduction to Kinematics',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 15,
        order_index: 0,
        description: 'Learn the basics of motion, displacement, velocity, and acceleration with AI-powered visualizations.',
        isPreview: true
      },
      {
        id: '2',
        title: 'Newton\'s Laws of Motion',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 20,
        order_index: 1,
        description: 'Explore the three fundamental laws of motion with molecular-level demonstrations and interactive simulations.'
      },
      {
        id: '3',
        title: 'Energy and Momentum',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 25,
        order_index: 2,
        description: 'Understand conservation of energy and momentum through particle animations and real-world examples.'
      },
      {
        id: '4',
        title: 'Projectile Motion with AI Visualizations',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 30,
        order_index: 3,
        description: 'Master projectile motion with advanced AI simulations showing trajectory analysis and optimization.'
      }
        ]
      };
      
      return videoSets[courseId] || videoSets['1'];
    };

    const mockVideos = getVideosForCourse(courseId!);

    const getReviewsForCourse = (courseId: string): Review[] => {
      const reviewSets: { [key: string]: Review[] } = {
        '6': [ // Calculus I
          {
            id: 'calc1-r1',
            studentName: 'Sarah Mitchell',
            rating: 5,
            comment: 'Dr. Kim\'s explanations of limits and derivatives are crystal clear! The AI graphing tools helped me visualize concepts I never understood before. This course changed my perspective on calculus.',
            date: '2024-01-12',
            helpful: 32,
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
          },
          {
            id: 'calc1-r2',
            studentName: 'Michael Rodriguez',
            rating: 5,
            comment: 'The step-by-step AI demonstrations of the chain rule and product rule are incredible. I finally understand how derivatives work! Highly recommend for anyone struggling with calculus.',
            date: '2024-01-10',
            helpful: 28,
            avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100'
          },
          {
            id: 'calc1-r3',
            studentName: 'Emily Chen',
            rating: 4,
            comment: 'Great course structure and the AI visualizations make abstract concepts tangible. The optimization problems section was particularly helpful. Would love more practice problems.',
            date: '2024-01-08',
            helpful: 19,
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
          }
        ],
        '13': [ // Calculus II
          {
            id: 'calc2-r1',
            studentName: 'James Wilson',
            rating: 5,
            comment: 'Integration was always my weak point, but Dr. Kim\'s AI area-under-curve visualizations made it click! The u-substitution examples are perfectly explained.',
            date: '2024-01-11',
            helpful: 25,
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
          },
          {
            id: 'calc2-r2',
            studentName: 'Lisa Anderson',
            rating: 5,
            comment: 'The series convergence section with AI analysis tools is fantastic. I finally understand when series converge or diverge. The applications to real-world problems are eye-opening.',
            date: '2024-01-09',
            helpful: 22,
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
          },
          {
            id: 'calc2-r3',
            studentName: 'Robert Kim',
            rating: 4,
            comment: 'Excellent course! The integration by parts demonstrations are very clear. The 3D volume calculations with AI are amazing. More practice with partial fractions would be great.',
            date: '2024-01-07',
            helpful: 16,
            avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100'
          }
        ],
        '14': [ // Calculus III
          {
            id: 'calc3-r1',
            studentName: 'Jennifer Lee',
            rating: 5,
            comment: 'The 3D AI surface visualizations for multivariable functions are incredible! Dr. Kim makes partial derivatives and gradients so intuitive. This course is a masterpiece.',
            date: '2024-01-13',
            helpful: 35,
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
          },
          {
            id: 'calc3-r2',
            studentName: 'David Thompson',
            rating: 5,
            comment: 'Vector calculus was always intimidating, but the AI demonstrations of Green\'s and Stokes\' theorems made everything clear. The applications to physics are fascinating.',
            date: '2024-01-11',
            helpful: 29,
            avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100'
          },
          {
            id: 'calc3-r3',
            studentName: 'Amanda Davis',
            rating: 4,
            comment: 'Great course! The multiple integrals section with AI volume calculations is excellent. The gradient and directional derivatives explanations are very clear. More examples would be helpful.',
            date: '2024-01-09',
            helpful: 21,
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
          }
        ],
        '15': [ // Differential Equations
          {
            id: 'de-r1',
            studentName: 'Christopher Brown',
            rating: 5,
            comment: 'Differential equations finally make sense! The AI phase plane analysis and solution visualizations are incredible. Dr. Kim\'s approach to Laplace transforms is brilliant.',
            date: '2024-01-14',
            helpful: 31,
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
          },
          {
            id: 'de-r2',
            studentName: 'Rachel Green',
            rating: 5,
            comment: 'The applications to population growth and electrical circuits are fascinating! The AI solution curves help visualize what the equations actually represent. Highly recommend!',
            date: '2024-01-12',
            helpful: 27,
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
          },
          {
            id: 'de-r3',
            studentName: 'Kevin Martinez',
            rating: 4,
            comment: 'Great course structure! The systems of differential equations section is well explained. The AI stability analysis tools are very helpful. More practice problems would be great.',
            date: '2024-01-10',
            helpful: 18,
            avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100'
          }
        ],
        '7': [ // Chemistry Foundation
          {
            id: 'chem1-r1',
            studentName: 'Jennifer Liu',
            rating: 5,
            comment: 'Dr. Chen\'s explanation of the mole concept is brilliant! The AI molecular visualizations made it so much easier to understand how atoms and molecules relate to macroscopic measurements.',
            date: '2024-01-14',
            helpful: 28,
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
          },
          {
            id: 'chem1-r2',
            studentName: 'Marcus Thompson',
            rating: 5,
            comment: 'Finally understand Avogadro\'s number! The way Dr. Chen connects the microscopic world to the macroscopic world is incredible. The molar mass calculations are now crystal clear.',
            date: '2024-01-12',
            helpful: 22,
            avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100'
          },
          {
            id: 'chem1-r3',
            studentName: 'Sofia Rodriguez',
            rating: 4,
            comment: 'Great course for understanding fundamental chemistry concepts. The step-by-step approach to stoichiometry problems really helped me build confidence. Would love more practice problems!',
            date: '2024-01-09',
            helpful: 15,
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
          }
        ],
        '1': [ // Physics (default)
      {
        id: '1',
        studentName: 'Alex Johnson',
        rating: 5,
        comment: 'Amazing course! The AI visualizations really helped me understand complex physics concepts. Dr. Williams explains everything so clearly.',
        date: '2024-01-10',
        helpful: 24,
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        id: '2',
        studentName: 'Maria Garcia',
        rating: 5,
        comment: 'The interactive simulations are incredible. I finally understand projectile motion! Highly recommend this course.',
        date: '2024-01-08',
        helpful: 18,
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        id: '3',
        studentName: 'David Chen',
        rating: 4,
        comment: 'Great course structure and content. The AI visualizations make abstract concepts tangible. Would love more practice problems.',
        date: '2024-01-05',
        helpful: 12,
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
        ]
      };
      
      return reviewSets[courseId] || reviewSets['1'];
    };

    const mockReviews = getReviewsForCourse(courseId!);

    // AI-Generated quiz questions based on the current video and course
    const getQuizzesForCourse = (courseId: string): Quiz[] => {
      const quizSets: { [key: string]: Quiz[] } = {
        '6': [ // Calculus I
          {
            id: 'calc1-q1',
            video_id: 'calc1-1',
            question: 'What is the limit of f(x) = x² as x approaches 3?',
            options: [
              '6',
              '9',
              '3',
              'The limit does not exist'
            ],
            correct_answer: 1,
            explanation: 'The limit of x² as x approaches 3 is 3² = 9. This can be found by direct substitution since x² is continuous at x = 3.'
          },
          {
            id: 'calc1-q2',
            video_id: 'calc1-2',
            question: 'A function f(x) is continuous at x = a if:',
            options: [
              'f(a) exists',
              'lim(x→a) f(x) exists',
              'lim(x→a) f(x) = f(a)',
              'All of the above'
            ],
            correct_answer: 3,
            explanation: 'A function is continuous at x = a if and only if: f(a) exists, the limit exists, and the limit equals the function value at that point.'
          },
          {
            id: 'calc1-q3',
            video_id: 'calc1-3',
            question: 'What is the derivative of f(x) = x³?',
            options: [
              '3x²',
              'x²',
              '3x',
              'x³/3'
            ],
            correct_answer: 0,
            explanation: 'Using the power rule: d/dx(x³) = 3x². The power rule states that d/dx(xⁿ) = nxⁿ⁻¹.'
          },
          {
            id: 'calc1-q4',
            video_id: 'calc1-4',
            question: 'What is the derivative of f(x) = x² · sin(x)?',
            options: [
              '2x · sin(x)',
              'x² · cos(x)',
              '2x · sin(x) + x² · cos(x)',
              '2x · cos(x)'
            ],
            correct_answer: 2,
            explanation: 'Using the product rule: d/dx[f(x)·g(x)] = f\'(x)·g(x) + f(x)·g\'(x). So d/dx[x²·sin(x)] = 2x·sin(x) + x²·cos(x).'
          },
          {
            id: 'calc1-q5',
            video_id: 'calc1-5',
            question: 'What is the derivative of f(x) = (x² + 1)³?',
            options: [
              '3(x² + 1)²',
              '6x(x² + 1)²',
              '3x(x² + 1)²',
              '6(x² + 1)²'
            ],
            correct_answer: 1,
            explanation: 'Using the chain rule: d/dx[(x² + 1)³] = 3(x² + 1)² · d/dx(x² + 1) = 3(x² + 1)² · 2x = 6x(x² + 1)².'
          },
          {
            id: 'calc1-q6',
            video_id: 'calc1-6',
            question: 'To find the maximum value of f(x) = x² - 4x + 3, we:',
            options: [
              'Set f(x) = 0',
              'Set f\'(x) = 0',
              'Set f\'\'(x) = 0',
              'Evaluate f(0)'
            ],
            correct_answer: 1,
            explanation: 'To find extrema, we find critical points by setting the first derivative equal to zero: f\'(x) = 0. Then we use the second derivative test to determine if it\'s a maximum or minimum.'
          }
        ],
        '13': [ // Calculus II
          {
            id: 'calc2-q1',
            video_id: 'calc2-1',
            question: 'What is ∫x dx?',
            options: [
              'x²/2 + C',
              'x + C',
              'x² + C',
              '1 + C'
            ],
            correct_answer: 0,
            explanation: 'Using the power rule for integration: ∫x dx = x²/2 + C. The power rule states that ∫xⁿ dx = xⁿ⁺¹/(n+1) + C for n ≠ -1.'
          },
          {
            id: 'calc2-q2',
            video_id: 'calc2-2',
            question: 'What is ∫(3x² + 2x + 1) dx?',
            options: [
              'x³ + x² + x + C',
              '6x + 2 + C',
              '3x³ + 2x² + x + C',
              'x³ + x² + x'
            ],
            correct_answer: 0,
            explanation: 'Using the sum rule and power rule: ∫(3x² + 2x + 1) dx = 3(x³/3) + 2(x²/2) + x + C = x³ + x² + x + C.'
          },
          {
            id: 'calc2-q3',
            video_id: 'calc2-3',
            question: 'To evaluate ∫x·e^(x²) dx, we use:',
            options: [
              'Integration by parts',
              'u-substitution with u = x²',
              'Partial fractions',
              'Trigonometric substitution'
            ],
            correct_answer: 1,
            explanation: 'We use u-substitution with u = x², so du = 2x dx. This gives us ∫x·e^(x²) dx = (1/2)∫e^u du = (1/2)e^u + C = (1/2)e^(x²) + C.'
          },
          {
            id: 'calc2-q4',
            video_id: 'calc2-4',
            question: 'To evaluate ∫x·sin(x) dx, we use:',
            options: [
              'u-substitution',
              'Integration by parts with u = x, dv = sin(x) dx',
              'Partial fractions',
              'Trigonometric identity'
            ],
            correct_answer: 1,
            explanation: 'We use integration by parts with u = x (so du = dx) and dv = sin(x) dx (so v = -cos(x)). This gives us ∫x·sin(x) dx = -x·cos(x) + ∫cos(x) dx = -x·cos(x) + sin(x) + C.'
          },
          {
            id: 'calc2-q5',
            video_id: 'calc2-5',
            question: 'The area between y = x² and y = x from x = 0 to x = 1 is:',
            options: [
              '∫₀¹ (x - x²) dx',
              '∫₀¹ (x² - x) dx',
              '∫₀¹ x dx',
              '∫₀¹ x² dx'
            ],
            correct_answer: 0,
            explanation: 'The area between two curves is ∫[top function - bottom function] dx. Since x > x² on [0,1], the area is ∫₀¹ (x - x²) dx.'
          },
          {
            id: 'calc2-q6',
            video_id: 'calc2-6',
            question: 'The series Σ(n=1 to ∞) 1/n²:',
            options: [
              'Diverges',
              'Converges to π²/6',
              'Converges to 1',
              'Converges to 0'
            ],
            correct_answer: 1,
            explanation: 'This is the famous Basel problem. The series Σ(n=1 to ∞) 1/n² converges to π²/6, as proven by Euler. It\'s a p-series with p = 2 > 1, so it converges.'
          }
        ],
        '14': [ // Calculus III
          {
            id: 'calc3-q1',
            video_id: 'calc3-1',
            question: 'For f(x,y) = x² + y², what is f(2,3)?',
            options: [
              '13',
              '12',
              '5',
              '6'
            ],
            correct_answer: 0,
            explanation: 'f(2,3) = 2² + 3² = 4 + 9 = 13. This represents the value of the function at the point (2,3).'
          },
          {
            id: 'calc3-q2',
            video_id: 'calc3-2',
            question: 'What is ∂f/∂x for f(x,y) = x²y + sin(xy)?',
            options: [
              '2xy + y·cos(xy)',
              'x² + x·cos(xy)',
              '2xy + x·cos(xy)',
              '2xy + cos(xy)'
            ],
            correct_answer: 0,
            explanation: '∂f/∂x = ∂/∂x[x²y + sin(xy)] = 2xy + cos(xy)·∂/∂x(xy) = 2xy + cos(xy)·y = 2xy + y·cos(xy).'
          },
          {
            id: 'calc3-q3',
            video_id: 'calc3-3',
            question: 'What is ∫₀¹∫₀² xy dy dx?',
            options: [
              '1',
              '2',
              '1/2',
              '3/2'
            ],
            correct_answer: 0,
            explanation: '∫₀¹∫₀² xy dy dx = ∫₀¹ x[∫₀² y dy] dx = ∫₀¹ x[y²/2]₀² dx = ∫₀¹ x[2] dx = ∫₀¹ 2x dx = [x²]₀¹ = 1.'
          },
          {
            id: 'calc3-q4',
            video_id: 'calc3-4',
            question: 'A vector field F(x,y) = (P(x,y), Q(x,y)) is conservative if:',
            options: [
              'P = Q',
              '∂P/∂y = ∂Q/∂x',
              '∂P/∂x = ∂Q/∂y',
              'P + Q = 0'
            ],
            correct_answer: 1,
            explanation: 'A vector field is conservative if and only if ∂P/∂y = ∂Q/∂x. This is the condition for the vector field to have a potential function.'
          },
          {
            id: 'calc3-q5',
            video_id: 'calc3-5',
            question: 'Green\'s theorem relates:',
            options: [
              'A line integral to a surface integral',
              'A line integral to a double integral',
              'A surface integral to a volume integral',
              'Two line integrals'
            ],
            correct_answer: 1,
            explanation: 'Green\'s theorem relates a line integral around a simple closed curve to a double integral over the region enclosed by the curve: ∮P dx + Q dy = ∬(∂Q/∂x - ∂P/∂y) dA.'
          },
          {
            id: 'calc3-q6',
            video_id: 'calc3-6',
            question: 'The gradient of f(x,y,z) = x² + y² + z² at (1,1,1) is:',
            options: [
              '(2,2,2)',
              '(1,1,1)',
              '(3,3,3)',
              '(0,0,0)'
            ],
            correct_answer: 0,
            explanation: '∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z) = (2x, 2y, 2z). At (1,1,1), ∇f = (2,2,2).'
          }
        ],
        '15': [ // Differential Equations
          {
            id: 'de-q1',
            video_id: 'de-1',
            question: 'What is the order of the differential equation y\'\' + 3y\' + 2y = 0?',
            options: [
              'First order',
              'Second order',
              'Third order',
              'Zero order'
            ],
            correct_answer: 1,
            explanation: 'The order of a differential equation is the highest derivative present. Here, y\'\' is the highest derivative, so it\'s second order.'
          },
          {
            id: 'de-q2',
            video_id: 'de-2',
            question: 'The general solution of dy/dx = 2x is:',
            options: [
              'y = x² + C',
              'y = 2x + C',
              'y = x²',
              'y = 2x'
            ],
            correct_answer: 0,
            explanation: 'Separating variables: dy = 2x dx. Integrating both sides: ∫dy = ∫2x dx, so y = x² + C.'
          },
          {
            id: 'de-q3',
            video_id: 'de-3',
            question: 'The characteristic equation of y\'\' - 5y\' + 6y = 0 is:',
            options: [
              'r² - 5r + 6 = 0',
              'r - 5r + 6 = 0',
              'r² + 5r + 6 = 0',
              'r² - 6r + 5 = 0'
            ],
            correct_answer: 0,
            explanation: 'For ay\'\' + by\' + cy = 0, the characteristic equation is ar² + br + c = 0. So for y\'\' - 5y\' + 6y = 0, it\'s r² - 5r + 6 = 0.'
          },
          {
            id: 'de-q4',
            video_id: 'de-4',
            question: 'A system dx/dt = x + y, dy/dt = x - y has equilibrium at:',
            options: [
              '(0,0)',
              '(1,1)',
              '(1,-1)',
              'No equilibrium'
            ],
            correct_answer: 0,
            explanation: 'At equilibrium, dx/dt = 0 and dy/dt = 0. So x + y = 0 and x - y = 0. Adding: 2x = 0, so x = 0. Then y = 0. So equilibrium is at (0,0).'
          },
          {
            id: 'de-q5',
            video_id: 'de-5',
            question: 'The Laplace transform of f(t) = e^(at) is:',
            options: [
              '1/(s-a)',
              '1/(s+a)',
              's/(s²+a²)',
              'a/(s²+a²)'
            ],
            correct_answer: 0,
            explanation: 'L{e^(at)} = ∫₀^∞ e^(at)·e^(-st) dt = ∫₀^∞ e^((a-s)t) dt = [e^((a-s)t)/(a-s)]₀^∞ = 1/(s-a) for s > a.'
          },
          {
            id: 'de-q6',
            video_id: 'de-6',
            question: 'The logistic equation dP/dt = rP(1-P/K) models:',
            options: [
              'Exponential growth',
              'Population growth with carrying capacity',
              'Linear growth',
              'Oscillatory behavior'
            ],
            correct_answer: 1,
            explanation: 'The logistic equation models population growth with a carrying capacity K. When P is small, growth is approximately exponential. As P approaches K, growth slows down.'
          }
        ],
        '7': [ // Chemistry Foundation
          {
            id: 'chem1-q1',
            video_id: 'chem1-1',
            question: 'What is the mole concept primarily used for in chemistry?',
            options: [
              'Measuring temperature',
              'Counting atoms and molecules',
              'Determining color changes',
              'Measuring pressure'
            ],
            correct_answer: 1,
            explanation: 'The mole concept is fundamental for counting atoms and molecules in chemical reactions. One mole contains 6.022 × 10²³ particles (Avogadro\'s number).'
          },
          {
            id: 'chem1-q2',
            video_id: 'chem1-1',
            question: 'How many atoms are in 2 moles of carbon?',
            options: [
              '6.022 × 10²³ atoms',
              '1.204 × 10²⁴ atoms',
              '3.011 × 10²³ atoms',
              '12.044 × 10²³ atoms'
            ],
            correct_answer: 1,
            explanation: '2 moles × 6.022 × 10²³ atoms/mol = 1.204 × 10²⁴ atoms. The mole concept allows us to convert between moles and number of particles.'
          },
          {
            id: 'chem1-q3',
            video_id: 'chem1-1',
            question: 'What is the relationship between moles and grams?',
            options: [
              'Moles = grams × molar mass',
              'Grams = moles × molar mass',
              'Moles = grams ÷ molar mass',
              'Both B and C are correct'
            ],
            correct_answer: 3,
            explanation: 'Both B and C are correct. Grams = moles × molar mass (to convert moles to grams) and moles = grams ÷ molar mass (to convert grams to moles).'
          },
          {
            id: 'chem1-q4',
            video_id: 'chem1-2',
            question: 'What is the value of Avogadro\'s number?',
            options: [
              '6.022 × 10²²',
              '6.022 × 10²³',
              '6.022 × 10²⁴',
              '6.022 × 10²¹'
            ],
            correct_answer: 1,
            explanation: 'Avogadro\'s number is 6.022 × 10²³, which represents the number of particles (atoms, molecules, ions) in one mole of a substance.'
          },
          {
            id: 'chem1-q5',
            video_id: 'chem1-2',
            question: 'Who is Avogadro\'s number named after?',
            options: [
              'Amedeo Avogadro',
              'Antoine Lavoisier',
              'John Dalton',
              'Robert Boyle'
            ],
            correct_answer: 0,
            explanation: 'Avogadro\'s number is named after Amedeo Avogadro, an Italian scientist who proposed that equal volumes of gases at the same temperature and pressure contain equal numbers of molecules.'
          },
          {
            id: 'chem1-q6',
            video_id: 'chem1-2',
            question: 'If you have 3.011 × 10²³ molecules of water, how many moles is this?',
            options: [
              '0.5 moles',
              '1.0 mole',
              '1.5 moles',
              '2.0 moles'
            ],
            correct_answer: 0,
            explanation: '3.011 × 10²³ molecules ÷ 6.022 × 10²³ molecules/mol = 0.5 moles. This demonstrates the relationship between number of particles and moles.'
          },
          {
            id: 'chem1-q7',
            video_id: 'chem1-3',
            question: 'What is the molar mass of water (H₂O)?',
            options: [
              '16.00 g/mol',
              '18.02 g/mol',
              '20.02 g/mol',
              '22.02 g/mol'
            ],
            correct_answer: 1,
            explanation: 'The molar mass of water is 18.02 g/mol: 2(1.01) + 16.00 = 2.02 + 16.00 = 18.02 g/mol, where 1.01 g/mol is the atomic mass of hydrogen and 16.00 g/mol is the atomic mass of oxygen.'
          },
          {
            id: 'chem1-q8',
            video_id: 'chem1-3',
            question: 'How do you calculate the molar mass of a compound?',
            options: [
              'Add all atomic masses together',
              'Multiply all atomic masses together',
              'Add atomic masses multiplied by their subscripts',
              'Divide atomic masses by their subscripts'
            ],
            correct_answer: 2,
            explanation: 'To calculate molar mass, multiply each element\'s atomic mass by its subscript in the formula, then add all the results together.'
          },
          {
            id: 'chem1-q9',
            video_id: 'chem1-3',
            question: 'What is the molar mass of carbon dioxide (CO₂)?',
            options: [
              '28.01 g/mol',
              '44.01 g/mol',
              '32.00 g/mol',
              '16.00 g/mol'
            ],
            correct_answer: 1,
            explanation: 'CO₂ molar mass = 12.01 + 2(16.00) = 12.01 + 32.00 = 44.01 g/mol. Carbon has atomic mass 12.01 g/mol and oxygen has 16.00 g/mol.'
          },
          {
            id: 'chem1-q10',
            video_id: 'chem1-3',
            question: 'If you have 36.04 grams of water, how many moles is this?',
            options: [
              '1.0 mole',
              '2.0 moles',
              '0.5 moles',
              '18.02 moles'
            ],
            correct_answer: 1,
            explanation: 'Moles = grams ÷ molar mass = 36.04 g ÷ 18.02 g/mol = 2.0 moles. This demonstrates the practical application of molar mass calculations.'
          }
        ],
        '1': [ // Physics (default)
      {
      id: '1',
        video_id: '1',
        question: 'According to Newton\'s First Law, what happens to an object in motion when no net force acts on it?',
        options: [
          'It stops immediately',
          'It continues at constant velocity',
          'It accelerates',
          'It changes direction'
        ],
        correct_answer: 1,
        explanation: 'Newton\'s First Law states that an object in motion will continue at constant velocity (including zero velocity) unless acted upon by a net external force.'
      },
      {
        id: '2',
        video_id: '2',
        question: 'If you push a box with 10N of force and friction opposes with 6N, what is the net force?',
      options: [
          '16N in the direction of push',
          '4N in the direction of push',
          '6N opposing the push',
          '10N in the direction of push'
      ],
      correct_answer: 1,
        explanation: 'Net force = Applied force - Friction = 10N - 6N = 4N in the direction of the push. This demonstrates how multiple forces combine.'
      },
      {
        id: '3',
        video_id: '3',
        question: 'A 2kg ball moving at 5m/s collides with a stationary 1kg ball. What principle governs this collision?',
        options: [
          'Conservation of Energy only',
          'Conservation of Momentum only',
          'Both Conservation of Energy and Momentum',
          'Newton\'s Third Law only'
        ],
        correct_answer: 2,
        explanation: 'In collisions, both momentum and energy conservation apply. Momentum is always conserved, while kinetic energy conservation depends on whether the collision is elastic or inelastic.'
      },
      {
        id: '4',
        video_id: '4',
        question: 'A projectile launched at 45° will have its maximum range when air resistance is ignored. Why?',
        options: [
          'It maximizes the horizontal velocity component',
          'It minimizes the effect of gravity',
          'It optimally balances horizontal distance and flight time',
          'It maximizes the vertical velocity component'
        ],
        correct_answer: 2,
        explanation: 'At 45°, the horizontal and vertical velocity components are equal, creating the optimal balance between horizontal distance traveled and time in flight for maximum range.'
      }
        ]
      };
      
      return quizSets[courseId] || quizSets['1'];
    };

    const aiQuizzes = getQuizzesForCourse(courseId!);

    const currentQuiz = aiQuizzes.find(q => q.video_id === currentVideo?.id) || aiQuizzes[0];

    console.log('Setting course data:', { mockCourse, mockVideos, currentQuiz });
    setCourse(mockCourse);
    setVideos(mockVideos);
    setReviews(mockReviews);
    setCurrentQuiz(currentQuiz);
    setCurrentVideo(mockVideos[0]); // Set the first video as current
    setCourseProgress(25); // Mock progress
    setLoading(false);
  };

  const handleVideoEnd = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = async (score: number) => {
    if (!user || !course || !videos[currentVideoIndex]) return;

    // Mark video as completed
    const videoId = videos[currentVideoIndex].id;
    setCompletedVideos(prev => new Set([...prev, videoId]));

    // Update course progress
    const newProgress = ((completedVideos.size + 1) / videos.length) * 100;
    setCourseProgress(newProgress);

    // Update points and achievements
    const newPoints = (profile?.points || 0) + score;
    setTotalPoints(newPoints);

    // Check for achievements
    const newAchievements = [...achievements];
    if (score >= 5 && !achievements.includes('Quiz Master')) {
      newAchievements.push('Quiz Master');
      setNewAchievement('Quiz Master');
      setShowAchievement(true);
    }
    if (completedVideos.size + 1 === videos.length && !achievements.includes('Course Complete')) {
      newAchievements.push('Course Complete');
      setNewAchievement('Course Complete');
      setShowAchievement(true);
    }
    if (newPoints >= 100 && !achievements.includes('Point Collector')) {
      newAchievements.push('Point Collector');
      setNewAchievement('Point Collector');
      setShowAchievement(true);
    }
    setAchievements(newAchievements);

    // Update streak
    setStreak(prev => prev + 1);

    // Update user points
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          points: newPoints,
          achievements: newAchievements,
          streak: streak + 1
        })
        .eq('id', user.id);

      if (error) console.error('Error updating points:', error);
    } catch (error) {
      console.error('Error updating points:', error);
    }

    setShowQuiz(false);

    // Auto-advance to next video if available
    if (currentVideoIndex < videos.length - 1) {
      setTimeout(() => {
        const nextIndex = currentVideoIndex + 1;
        setCurrentVideoIndex(nextIndex);
        setCurrentVideo(videos[nextIndex]);
      }, 2000);
    }
  };

  const navigateToVideo = (index: number) => {
    console.log('Navigating to video index:', index, 'videos:', videos);
    setCurrentVideoIndex(index);
    setCurrentVideo(videos[index]); // Set the current video
    setShowQuiz(false);
    
    // Update quiz for the new video using the course-specific quiz system
    const videoId = videos[index]?.id;
    console.log('Selected video ID:', videoId);
    
    // Get quizzes for the current course
    const getQuizzesForCourse = (courseId: string): Quiz[] => {
      const quizSets: { [key: string]: Quiz[] } = {
        '6': [ // Calculus I
          {
            id: 'calc1-q1',
            video_id: 'calc1-1',
            question: 'What is the limit of f(x) = x² as x approaches 3?',
            options: ['6', '9', '3', 'The limit does not exist'],
            correct_answer: 1,
            explanation: 'The limit of x² as x approaches 3 is 3² = 9. This can be found by direct substitution since x² is continuous at x = 3.'
          },
          {
            id: 'calc1-q2',
            video_id: 'calc1-2',
            question: 'A function f(x) is continuous at x = a if:',
            options: ['f(a) exists', 'lim(x→a) f(x) exists', 'lim(x→a) f(x) = f(a)', 'All of the above'],
            correct_answer: 3,
            explanation: 'A function is continuous at x = a if and only if: f(a) exists, the limit exists, and the limit equals the function value at that point.'
          },
          {
            id: 'calc1-q3',
            video_id: 'calc1-3',
            question: 'What is the derivative of f(x) = x³?',
            options: ['3x²', 'x²', '3x', 'x³/3'],
            correct_answer: 0,
            explanation: 'Using the power rule: d/dx(x³) = 3x². The power rule states that d/dx(xⁿ) = nxⁿ⁻¹. This fundamental concept is covered in your differentiation video.'
          },
          {
            id: 'calc1-q3b',
            video_id: 'calc1-3',
            question: 'What does the derivative represent geometrically?',
            options: ['The area under the curve', 'The slope of the tangent line', 'The y-intercept', 'The x-intercept'],
            correct_answer: 1,
            explanation: 'The derivative represents the slope of the tangent line to the curve at any given point. This is the fundamental geometric interpretation of derivatives.'
          },
          {
            id: 'calc1-q3c',
            video_id: 'calc1-3',
            question: 'What is the derivative of f(x) = 5x²?',
            options: ['10x', '5x', '10x²', '5x²'],
            correct_answer: 0,
            explanation: 'Using the power rule: d/dx(5x²) = 5 × 2x = 10x. The constant multiple rule allows us to factor out the constant 5.'
          },
          {
            id: 'calc1-q3d',
            video_id: 'calc1-3',
            question: 'What is the derivative of f(x) = x² + 3x + 2?',
            options: ['2x + 3', '2x + 3x + 2', 'x + 3', '2x² + 3x'],
            correct_answer: 0,
            explanation: 'Using the sum rule and power rule: d/dx(x² + 3x + 2) = 2x + 3 + 0 = 2x + 3. The derivative of a constant is 0.'
          },
          {
            id: 'calc1-q3e',
            video_id: 'calc1-3',
            question: 'What is the derivative of f(x) = 1/x?',
            options: ['-1/x²', '1/x²', '-x²', 'x²'],
            correct_answer: 0,
            explanation: 'Rewriting 1/x as x⁻¹ and using the power rule: d/dx(x⁻¹) = -1 × x⁻² = -1/x². This is a common derivative that students should memorize.'
          },
          {
            id: 'calc1-q3b',
            video_id: 'calc1-3',
            question: 'What does the derivative represent geometrically?',
            options: ['The area under the curve', 'The slope of the tangent line', 'The y-intercept', 'The x-intercept'],
            correct_answer: 1,
            explanation: 'The derivative represents the slope of the tangent line to the curve at any given point. This is the fundamental geometric interpretation of derivatives.'
          },
          {
            id: 'calc1-q3c',
            video_id: 'calc1-3',
            question: 'What is the derivative of f(x) = 5x²?',
            options: ['10x', '5x', '10x²', '5x²'],
            correct_answer: 0,
            explanation: 'Using the power rule: d/dx(5x²) = 5 × 2x = 10x. The constant multiple rule allows us to factor out the constant 5.'
          },
          {
            id: 'calc1-q3d',
            video_id: 'calc1-3',
            question: 'What is the derivative of f(x) = x² + 3x + 2?',
            options: ['2x + 3', '2x + 3x + 2', 'x + 3', '2x² + 3x'],
            correct_answer: 0,
            explanation: 'Using the sum rule and power rule: d/dx(x² + 3x + 2) = 2x + 3 + 0 = 2x + 3. The derivative of a constant is 0.'
          },
          {
            id: 'calc1-q3e',
            video_id: 'calc1-3',
            question: 'What is the derivative of f(x) = 1/x?',
            options: ['-1/x²', '1/x²', '-x²', 'x²'],
            correct_answer: 0,
            explanation: 'Rewriting 1/x as x⁻¹ and using the power rule: d/dx(x⁻¹) = -1 × x⁻² = -1/x². This is a common derivative that students should memorize.'
          },
          {
            id: 'calc1-q3f',
            video_id: 'calc1-3',
            question: 'What is the derivative of f(x) = √x?',
            options: ['1/(2√x)', '1/√x', '2√x', '√x/2'],
            correct_answer: 0,
            explanation: 'Rewriting √x as x^(1/2) and using the power rule: d/dx(x^(1/2)) = (1/2)x^(-1/2) = 1/(2√x). This is another fundamental derivative.'
          },
          {
            id: 'calc1-q4',
            video_id: 'calc1-4',
            question: 'What is the derivative of f(x) = x² · sin(x)?',
            options: ['2x · sin(x)', 'x² · cos(x)', '2x · sin(x) + x² · cos(x)', '2x · cos(x)'],
            correct_answer: 2,
            explanation: 'Using the product rule: d/dx[f(x)·g(x)] = f\'(x)·g(x) + f(x)·g\'(x). So d/dx[x²·sin(x)] = 2x·sin(x) + x²·cos(x).'
          },
          {
            id: 'calc1-q5',
            video_id: 'calc1-5',
            question: 'What is the derivative of f(x) = (x² + 1)³?',
            options: ['3(x² + 1)²', '6x(x² + 1)²', '3x(x² + 1)²', '6(x² + 1)²'],
            correct_answer: 1,
            explanation: 'Using the chain rule: d/dx[(x² + 1)³] = 3(x² + 1)² · d/dx(x² + 1) = 3(x² + 1)² · 2x = 6x(x² + 1)².'
          },
          {
            id: 'calc1-q6',
            video_id: 'calc1-6',
            question: 'What is ∫x dx?',
            options: ['x²/2 + C', 'x + C', 'x² + C', '1 + C'],
            correct_answer: 0,
            explanation: 'Using the power rule for integration: ∫x dx = x²/2 + C. The power rule states that ∫xⁿ dx = xⁿ⁺¹/(n+1) + C for n ≠ -1.'
          },
          {
            id: 'calc1-q7',
            video_id: 'calc1-7',
            question: 'To find the maximum value of f(x) = x² - 4x + 3, we:',
            options: ['Set f(x) = 0', 'Set f\'(x) = 0', 'Set f\'\'(x) = 0', 'Evaluate f(0)'],
            correct_answer: 1,
            explanation: 'To find extrema, we find critical points by setting the first derivative equal to zero: f\'(x) = 0. Then we use the second derivative test to determine if it\'s a maximum or minimum.'
          },
          {
            id: 'calc1-q8',
            video_id: 'calc1-8',
            question: 'The area under the curve y = x² from x = 0 to x = 2 is:',
            options: ['8/3', '4', '2', '16/3'],
            correct_answer: 0,
            explanation: 'The area is ∫₀² x² dx = [x³/3]₀² = 2³/3 - 0³/3 = 8/3. This demonstrates the fundamental connection between integration and area.'
          }
        ],
        '13': [ // Calculus II
          {
            id: 'calc2-q1',
            video_id: 'calc2-1',
            question: 'What is ∫x dx?',
            options: ['x²/2 + C', 'x + C', 'x² + C', '1 + C'],
            correct_answer: 0,
            explanation: 'Using the power rule for integration: ∫x dx = x²/2 + C. The power rule states that ∫xⁿ dx = xⁿ⁺¹/(n+1) + C for n ≠ -1.'
          },
          {
            id: 'calc2-q2',
            video_id: 'calc2-2',
            question: 'What is ∫(3x² + 2x + 1) dx?',
            options: ['x³ + x² + x + C', '6x + 2 + C', '3x³ + 2x² + x + C', 'x³ + x² + x'],
            correct_answer: 0,
            explanation: 'Using the sum rule and power rule: ∫(3x² + 2x + 1) dx = 3(x³/3) + 2(x²/2) + x + C = x³ + x² + x + C.'
          },
          {
            id: 'calc2-q3',
            video_id: 'calc2-3',
            question: 'To evaluate ∫x·e^(x²) dx, we use:',
            options: ['Integration by parts', 'u-substitution with u = x²', 'Partial fractions', 'Trigonometric substitution'],
            correct_answer: 1,
            explanation: 'We use u-substitution with u = x², so du = 2x dx. This gives us ∫x·e^(x²) dx = (1/2)∫e^u du = (1/2)e^u + C = (1/2)e^(x²) + C.'
          },
          {
            id: 'calc2-q4',
            video_id: 'calc2-4',
            question: 'To evaluate ∫x·sin(x) dx, we use:',
            options: ['u-substitution', 'Integration by parts with u = x, dv = sin(x) dx', 'Partial fractions', 'Trigonometric identity'],
            correct_answer: 1,
            explanation: 'We use integration by parts with u = x (so du = dx) and dv = sin(x) dx (so v = -cos(x)). This gives us ∫x·sin(x) dx = -x·cos(x) + ∫cos(x) dx = -x·cos(x) + sin(x) + C.'
          },
          {
            id: 'calc2-q5',
            video_id: 'calc2-5',
            question: 'To integrate ∫1/(x²-1) dx, we use:',
            options: ['u-substitution', 'Integration by parts', 'Partial fractions', 'Trigonometric substitution'],
            correct_answer: 2,
            explanation: 'We use partial fractions: 1/(x²-1) = 1/[(x-1)(x+1)] = A/(x-1) + B/(x+1). Solving gives A = 1/2, B = -1/2, so the integral becomes (1/2)ln|x-1| - (1/2)ln|x+1| + C.'
          },
          {
            id: 'calc2-q6',
            video_id: 'calc2-6',
            question: 'The area between y = x² and y = x from x = 0 to x = 1 is:',
            options: ['∫₀¹ (x - x²) dx', '∫₀¹ (x² - x) dx', '∫₀¹ x dx', '∫₀¹ x² dx'],
            correct_answer: 0,
            explanation: 'The area between two curves is ∫[top function - bottom function] dx. Since x > x² on [0,1], the area is ∫₀¹ (x - x²) dx.'
          },
          {
            id: 'calc2-q7',
            video_id: 'calc2-7',
            question: 'The work done by a force F(x) = 2x moving an object from x = 0 to x = 3 is:',
            options: ['9', '6', '18', '12'],
            correct_answer: 0,
            explanation: 'Work = ∫₀³ F(x) dx = ∫₀³ 2x dx = [x²]₀³ = 3² - 0² = 9. This demonstrates the application of integration to physics problems.'
          },
          {
            id: 'calc2-q8',
            video_id: 'calc2-8',
            question: 'The improper integral ∫₁^∞ 1/x² dx:',
            options: ['Diverges', 'Converges to 1', 'Converges to 0', 'Converges to 2'],
            correct_answer: 1,
            explanation: '∫₁^∞ 1/x² dx = lim(t→∞) ∫₁ᵗ 1/x² dx = lim(t→∞) [-1/x]₁ᵗ = lim(t→∞) [-1/t + 1] = 0 + 1 = 1. This is a convergent improper integral.'
          },
          {
            id: 'calc2-q9',
            video_id: 'calc2-9',
            question: 'The series Σ(n=1 to ∞) 1/n²:',
            options: ['Diverges', 'Converges to π²/6', 'Converges to 1', 'Converges to 0'],
            correct_answer: 1,
            explanation: 'This is the famous Basel problem. The series Σ(n=1 to ∞) 1/n² converges to π²/6, as proven by Euler. It\'s a p-series with p = 2 > 1, so it converges.'
          },
          {
            id: 'calc2-q10',
            video_id: 'calc2-10',
            question: 'The Taylor series for e^x centered at x = 0 is:',
            options: ['Σ(n=0 to ∞) xⁿ/n!', 'Σ(n=0 to ∞) xⁿ', 'Σ(n=0 to ∞) xⁿ/n', 'Σ(n=0 to ∞) xⁿ/(n+1)!'],
            correct_answer: 0,
            explanation: 'The Taylor series for e^x is e^x = Σ(n=0 to ∞) xⁿ/n! = 1 + x + x²/2! + x³/3! + ... This is one of the most important power series in mathematics.'
          }
        ],
        '14': [ // Calculus III
          {
            id: 'calc3-q1',
            video_id: 'calc3-1',
            question: 'For f(x,y) = x² + y², what is f(2,3)?',
            options: ['13', '12', '5', '6'],
            correct_answer: 0,
            explanation: 'f(2,3) = 2² + 3² = 4 + 9 = 13. This represents the value of the function at the point (2,3).'
          },
          {
            id: 'calc3-q2',
            video_id: 'calc3-2',
            question: 'What is ∂f/∂x for f(x,y) = x²y + sin(xy)?',
            options: ['2xy + y·cos(xy)', 'x² + x·cos(xy)', '2xy + x·cos(xy)', '2xy + cos(xy)'],
            correct_answer: 0,
            explanation: '∂f/∂x = ∂/∂x[x²y + sin(xy)] = 2xy + cos(xy)·∂/∂x(xy) = 2xy + cos(xy)·y = 2xy + y·cos(xy).'
          },
          {
            id: 'calc3-q3',
            video_id: 'calc3-3',
            question: 'What is ∫₀¹∫₀² xy dy dx?',
            options: ['1', '2', '1/2', '3/2'],
            correct_answer: 0,
            explanation: '∫₀¹∫₀² xy dy dx = ∫₀¹ x[∫₀² y dy] dx = ∫₀¹ x[y²/2]₀² dx = ∫₀¹ x[2] dx = ∫₀¹ 2x dx = [x²]₀¹ = 1.'
          },
          {
            id: 'calc3-q4',
            video_id: 'calc3-4',
            question: 'A vector field F(x,y) = (P(x,y), Q(x,y)) is conservative if:',
            options: ['P = Q', '∂P/∂y = ∂Q/∂x', '∂P/∂x = ∂Q/∂y', 'P + Q = 0'],
            correct_answer: 1,
            explanation: 'A vector field is conservative if and only if ∂P/∂y = ∂Q/∂x. This is the condition for the vector field to have a potential function.'
          },
          {
            id: 'calc3-q5',
            video_id: 'calc3-5',
            question: 'Green\'s theorem relates:',
            options: ['A line integral to a surface integral', 'A line integral to a double integral', 'A surface integral to a volume integral', 'Two line integrals'],
            correct_answer: 1,
            explanation: 'Green\'s theorem relates a line integral around a simple closed curve to a double integral over the region enclosed by the curve: ∮P dx + Q dy = ∬(∂Q/∂x - ∂P/∂y) dA.'
          },
          {
            id: 'calc3-q6',
            video_id: 'calc3-6',
            question: 'The gradient of f(x,y,z) = x² + y² + z² at (1,1,1) is:',
            options: ['(2,2,2)', '(1,1,1)', '(3,3,3)', '(0,0,0)'],
            correct_answer: 0,
            explanation: '∇f = (∂f/∂x, ∂f/∂y, ∂f/∂z) = (2x, 2y, 2z). At (1,1,1), ∇f = (2,2,2).'
          }
        ],
        '15': [ // Differential Equations
          {
            id: 'de-q1',
            video_id: 'de-1',
            question: 'What is the order of the differential equation y\'\' + 3y\' + 2y = 0?',
            options: ['First order', 'Second order', 'Third order', 'Zero order'],
            correct_answer: 1,
            explanation: 'The order of a differential equation is the highest derivative present. Here, y\'\' is the highest derivative, so it\'s second order.'
          },
          {
            id: 'de-q2',
            video_id: 'de-2',
            question: 'The general solution of dy/dx = 2x is:',
            options: ['y = x² + C', 'y = 2x + C', 'y = x²', 'y = 2x'],
            correct_answer: 0,
            explanation: 'Separating variables: dy = 2x dx. Integrating both sides: ∫dy = ∫2x dx, so y = x² + C.'
          },
          {
            id: 'de-q3',
            video_id: 'de-3',
            question: 'The characteristic equation of y\'\' - 5y\' + 6y = 0 is:',
            options: ['r² - 5r + 6 = 0', 'r - 5r + 6 = 0', 'r² + 5r + 6 = 0', 'r² - 6r + 5 = 0'],
            correct_answer: 0,
            explanation: 'For ay\'\' + by\' + cy = 0, the characteristic equation is ar² + br + c = 0. So for y\'\' - 5y\' + 6y = 0, it\'s r² - 5r + 6 = 0.'
          },
          {
            id: 'de-q4',
            video_id: 'de-4',
            question: 'A system dx/dt = x + y, dy/dt = x - y has equilibrium at:',
            options: ['(0,0)', '(1,1)', '(1,-1)', 'No equilibrium'],
            correct_answer: 0,
            explanation: 'At equilibrium, dx/dt = 0 and dy/dt = 0. So x + y = 0 and x - y = 0. Adding: 2x = 0, so x = 0. Then y = 0. So equilibrium is at (0,0).'
          },
          {
            id: 'de-q5',
            video_id: 'de-5',
            question: 'The Laplace transform of f(t) = e^(at) is:',
            options: ['1/(s-a)', '1/(s+a)', 's/(s²+a²)', 'a/(s²+a²)'],
            correct_answer: 0,
            explanation: 'L{e^(at)} = ∫₀^∞ e^(at)·e^(-st) dt = ∫₀^∞ e^((a-s)t) dt = [e^((a-s)t)/(a-s)]₀^∞ = 1/(s-a) for s > a.'
          },
          {
            id: 'de-q6',
            video_id: 'de-6',
            question: 'The logistic equation dP/dt = rP(1-P/K) models:',
            options: ['Exponential growth', 'Population growth with carrying capacity', 'Linear growth', 'Oscillatory behavior'],
            correct_answer: 1,
            explanation: 'The logistic equation models population growth with a carrying capacity K. When P is small, growth is approximately exponential. As P approaches K, growth slows down.'
          }
        ],
        '7': [ // Chemistry Foundation
          {
            id: 'chem1-q1',
            video_id: 'chem1-1',
            question: 'What is the mole concept primarily used for in chemistry?',
            options: ['Measuring temperature', 'Counting atoms and molecules', 'Determining color changes', 'Measuring pressure'],
            correct_answer: 1,
            explanation: 'The mole concept is fundamental for counting atoms and molecules in chemical reactions. One mole contains 6.022 × 10²³ particles (Avogadro\'s number).'
          },
          {
            id: 'chem1-q2',
            video_id: 'chem1-1',
            question: 'How many atoms are in 2 moles of carbon?',
            options: ['6.022 × 10²³ atoms', '1.204 × 10²⁴ atoms', '3.011 × 10²³ atoms', '12.044 × 10²³ atoms'],
            correct_answer: 1,
            explanation: '2 moles × 6.022 × 10²³ atoms/mol = 1.204 × 10²⁴ atoms. The mole concept allows us to convert between moles and number of particles.'
          },
          {
            id: 'chem1-q3',
            video_id: 'chem1-1',
            question: 'What is the relationship between moles and grams?',
            options: ['Moles = grams × molar mass', 'Grams = moles × molar mass', 'Moles = grams ÷ molar mass', 'Both B and C are correct'],
            correct_answer: 3,
            explanation: 'Both B and C are correct. Grams = moles × molar mass (to convert moles to grams) and moles = grams ÷ molar mass (to convert grams to moles).'
          },
          {
            id: 'chem1-q4',
            video_id: 'chem1-2',
            question: 'What is the value of Avogadro\'s number?',
            options: ['6.022 × 10²²', '6.022 × 10²³', '6.022 × 10²⁴', '6.022 × 10²¹'],
            correct_answer: 1,
            explanation: 'Avogadro\'s number is 6.022 × 10²³, which represents the number of particles (atoms, molecules, ions) in one mole of a substance.'
          },
          {
            id: 'chem1-q5',
            video_id: 'chem1-2',
            question: 'Who is Avogadro\'s number named after?',
            options: ['Amedeo Avogadro', 'Antoine Lavoisier', 'John Dalton', 'Robert Boyle'],
            correct_answer: 0,
            explanation: 'Avogadro\'s number is named after Amedeo Avogadro, an Italian scientist who proposed that equal volumes of gases at the same temperature and pressure contain equal numbers of molecules.'
          },
          {
            id: 'chem1-q6',
            video_id: 'chem1-2',
            question: 'If you have 3.011 × 10²³ molecules of water, how many moles is this?',
            options: ['0.5 moles', '1.0 mole', '1.5 moles', '2.0 moles'],
            correct_answer: 0,
            explanation: '3.011 × 10²³ molecules ÷ 6.022 × 10²³ molecules/mol = 0.5 moles. This demonstrates the relationship between number of particles and moles.'
          },
          {
            id: 'chem1-q7',
            video_id: 'chem1-3',
            question: 'What is the molar mass of water (H₂O)?',
            options: ['16.00 g/mol', '18.02 g/mol', '20.02 g/mol', '22.02 g/mol'],
            correct_answer: 1,
            explanation: 'The molar mass of water is 18.02 g/mol: 2(1.01) + 16.00 = 2.02 + 16.00 = 18.02 g/mol, where 1.01 g/mol is the atomic mass of hydrogen and 16.00 g/mol is the atomic mass of oxygen.'
          },
          {
            id: 'chem1-q8',
            video_id: 'chem1-3',
            question: 'How do you calculate the molar mass of a compound?',
            options: ['Add all atomic masses together', 'Multiply all atomic masses together', 'Add atomic masses multiplied by their subscripts', 'Divide atomic masses by their subscripts'],
            correct_answer: 2,
            explanation: 'To calculate molar mass, multiply each element\'s atomic mass by its subscript in the formula, then add all the results together.'
          },
          {
            id: 'chem1-q9',
            video_id: 'chem1-3',
            question: 'What is the molar mass of carbon dioxide (CO₂)?',
            options: ['28.01 g/mol', '44.01 g/mol', '32.00 g/mol', '16.00 g/mol'],
            correct_answer: 1,
            explanation: 'CO₂ molar mass = 12.01 + 2(16.00) = 12.01 + 32.00 = 44.01 g/mol. Carbon has atomic mass 12.01 g/mol and oxygen has 16.00 g/mol.'
          },
          {
            id: 'chem1-q10',
            video_id: 'chem1-3',
            question: 'If you have 36.04 grams of water, how many moles is this?',
            options: ['1.0 mole', '2.0 moles', '0.5 moles', '18.02 moles'],
            correct_answer: 1,
            explanation: 'Moles = grams ÷ molar mass = 36.04 g ÷ 18.02 g/mol = 2.0 moles. This demonstrates the practical application of molar mass calculations.'
          }
        ],
        '1': [ // Physics (default)
      {
        id: '1',
        video_id: '1',
        question: 'According to Newton\'s First Law, what happens to an object in motion when no net force acts on it?',
            options: ['It stops immediately', 'It continues at constant velocity', 'It accelerates', 'It changes direction'],
        correct_answer: 1,
        explanation: 'Newton\'s First Law states that an object in motion will continue at constant velocity (including zero velocity) unless acted upon by a net external force.'
      },
      {
        id: '2',
        video_id: '2',
        question: 'If you push a box with 10N of force and friction opposes with 6N, what is the net force?',
            options: ['16N in the direction of push', '4N in the direction of push', '6N opposing the push', '10N in the direction of push'],
        correct_answer: 1,
        explanation: 'Net force = Applied force - Friction = 10N - 6N = 4N in the direction of the push. This demonstrates how multiple forces combine.'
      },
      {
        id: '3',
        video_id: '3',
        question: 'A 2kg ball moving at 5m/s collides with a stationary 1kg ball. What principle governs this collision?',
            options: ['Conservation of Energy only', 'Conservation of Momentum only', 'Both Conservation of Energy and Momentum', 'Newton\'s Third Law only'],
        correct_answer: 2,
        explanation: 'In collisions, both momentum and energy conservation apply. Momentum is always conserved, while kinetic energy conservation depends on whether the collision is elastic or inelastic.'
      },
      {
        id: '4',
        video_id: '4',
        question: 'A projectile launched at 45° will have its maximum range when air resistance is ignored. Why?',
            options: ['It maximizes the horizontal velocity component', 'It minimizes the effect of gravity', 'It optimally balances horizontal distance and flight time', 'It maximizes the vertical velocity component'],
        correct_answer: 2,
        explanation: 'At 45°, the horizontal and vertical velocity components are equal, creating the optimal balance between horizontal distance traveled and time in flight for maximum range.'
      }
        ]
      };
    
      return quizSets[courseId] || quizSets['1'];
    };
    
    const aiQuizzes = getQuizzesForCourse(courseId!);
    const newQuiz = aiQuizzes.find(q => q.video_id === videoId) || aiQuizzes[0];
    setCurrentQuiz(newQuiz);
  };

  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  const addNote = () => {
    if (!newNote.trim() || !currentVideo) return;
    
    const note: Note = {
      id: Date.now().toString(),
      videoId: currentVideo.id,
      timestamp: 0, // Would be actual video timestamp
      content: newNote,
      createdAt: new Date().toISOString()
    };
    
    setNotes(prev => [...prev, note]);
    setNewNote('');
  };

  const toggleBookmark = (videoId: string) => {
    setBookmarkedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <button
            onClick={() => navigate('/courses')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black particle-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3">
            {/* Course Header */}
            <div className="course-card-gradient rounded-3xl p-8 mb-8 shimmer-effect border-2 border-purple-500/30">
              <div className="flex items-center space-x-2 text-sm mb-6">
                <button
                  onClick={() => navigate('/courses')}
                  className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Courses
                </button>
                <ChevronRight className="h-4 w-4 text-purple-400" />
                <span className="text-cyan-200">{course.title}</span>
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
                <div className="flex-1">
                  <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight gradient-text-animated">{course.title}</h1>
                  <p className="text-xl text-cyan-100 leading-relaxed mb-8">{course.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 px-5 py-4 bg-slate-900/50 rounded-2xl border border-cyan-500/30">
                      <div className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-cyan-300 font-medium">Instructor</div>
                        <div className="font-bold text-white text-lg">{course.instructor}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 px-5 py-4 bg-slate-900/50 rounded-2xl border border-green-500/30">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-green-300 font-medium">Duration</div>
                        <div className="font-bold text-white text-lg">{course.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 px-5 py-4 bg-slate-900/50 rounded-2xl border border-yellow-500/30">
                      <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
                        <Star className="h-6 w-6 text-white fill-current" />
                      </div>
                      <div>
                        <div className="text-xs text-yellow-300 font-medium">Rating</div>
                        <div className="font-bold text-white text-lg">{course.rating} ({course.studentsCount.toLocaleString()})</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 px-5 py-4 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-2xl border border-purple-500/30">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-purple-300 font-medium">Level</div>
                        <div className="font-bold text-white text-lg">{course.level}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center lg:items-end space-y-4 glass-vibrant rounded-3xl p-6 border-2 border-cyan-500/30">
                  <div className="text-center lg:text-right">
                    <div className="text-xs text-cyan-300 font-bold mb-2">SPECIAL OFFER</div>
                    <div className="text-5xl font-black gradient-text-animated mb-2">${course.price}</div>
                    {course.originalPrice && (
                      <div className="text-2xl text-gray-400 line-through">${course.originalPrice}</div>
                    )}
                    <div className="mt-3 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30">
                      <span className="text-green-300 font-bold text-sm">{Math.round((1 - course.price / (course.originalPrice || course.price)) * 100)}% OFF</span>
                    </div>
                  </div>
                  <button className="w-full px-8 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-xl rounded-2xl hover:from-cyan-400 hover:to-purple-500 transform hover:scale-105 hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] transition-all duration-300 flex items-center justify-center gap-3">
                    <Zap className="h-6 w-6" />
                    Enroll Now
                  </button>
                  <div className="flex items-center gap-2 text-cyan-300 text-sm">
                    <Flame className="h-5 w-5 text-orange-400" />
                    <span className="font-bold">{Math.floor(Math.random() * 50 + 10)} students enrolled today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Player Section */}
            {currentVideo && (
              <div className="course-card-gradient rounded-3xl overflow-hidden mb-8 border-2 border-purple-500/30">
                {/* Video Player Header */}
                <div className="p-6 border-b border-cyan-500/20 bg-slate-900/30">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex-1">
                      <h2 className="text-3xl font-black gradient-text-animated mb-4">
                        {currentVideo.title}
                      </h2>
                      <p className="text-cyan-100 mb-6 leading-relaxed text-lg">
                        {currentVideo.description}
                      </p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-slate-900/50 rounded-xl border border-cyan-500/30">
                          <Clock className="h-5 w-5 text-cyan-400" />
                          <span className="text-white font-bold">{formatDuration(currentVideo.duration)}</span>
                        </div>
                        {currentVideo.isPreview && (
                          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg">
                            <Play className="h-4 w-4" />
                            FREE PREVIEW
                          </span>
                        )}
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                          <BarChart3 className="h-5 w-5 text-purple-400" />
                          <span className="text-white font-bold">{courseProgress.toFixed(0)}% Complete</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 glass-vibrant rounded-2xl p-3 border border-cyan-500/30">
                      <button
                        onClick={() => navigateToVideo(Math.max(0, currentVideoIndex - 1))}
                        disabled={currentVideoIndex === 0}
                        className="p-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <span className="text-white font-black px-3">
                        {currentVideoIndex + 1} / {videos.length}
                      </span>
                      <button
                        onClick={() => navigateToVideo(Math.min(videos.length - 1, currentVideoIndex + 1))}
                        disabled={currentVideoIndex === videos.length - 1}
                        className="p-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="flex items-center justify-between pt-6 border-t border-cyan-500/20">
                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        onClick={() => toggleBookmark(currentVideo.id)}
                        className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                          bookmarkedVideos.has(currentVideo.id)
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                            : 'bg-slate-900/50 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400'
                        }`}
                      >
                        <Bookmark className="h-5 w-5" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setShowNotes(!showNotes)}
                        className="px-4 py-3 rounded-xl bg-slate-900/50 text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-400 font-bold transition-all flex items-center gap-2"
                      >
                        <FileText className="h-5 w-5" />
                        <span>Notes</span>
                      </button>
                      <button className="px-4 py-3 rounded-xl bg-slate-900/50 text-pink-400 hover:text-pink-300 border border-pink-500/30 hover:border-pink-400 font-bold transition-all flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        <span>Share</span>
                      </button>
                    </div>
                    {/* Interactive Tools */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Quiz Button */}
                      {!showQuiz && currentQuiz && (
                        <button
                          onClick={() => setShowQuiz(true)}
                          className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-400 hover:to-green-500 transform hover:scale-105 transition-all font-black flex items-center gap-2 shadow-lg"
                        >
                          <Brain className="h-5 w-5" />
                          <span>Quiz</span>
                        </button>
                      )}
                      
                      {/* Problem Solver */}
                      <button
                        onClick={() => setShowProblemSolver(!showProblemSolver)}
                        className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-400 hover:to-pink-500 transform hover:scale-105 transition-all font-black flex items-center gap-2 shadow-lg"
                      >
                        <Calculator className="h-5 w-5" />
                        <span>Solve</span>
                      </button>
                      
                      {/* Graphing Tool */}
                      <button
                        onClick={() => setShowGraphingTool(!showGraphingTool)}
                        className="px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-400 hover:to-cyan-500 transform hover:scale-105 transition-all font-black flex items-center gap-2 shadow-lg"
                      >
                        <TrendingUp className="h-5 w-5" />
                        <span>Graph</span>
                      </button>
                      
                      {/* Discussion */}
                      <button
                        onClick={() => setShowDiscussion(!showDiscussion)}
                        className="px-5 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transform hover:scale-105 transition-all font-black flex items-center gap-2 shadow-lg"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>Discuss</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video Player */}
                <div className="relative">
                  <VideoPlayer
                    src={currentVideo.video_url}
                    onVideoEnd={handleVideoEnd}
                  />
                </div>

                {/* Notes Section */}
                {showNotes && (
                  <div className="p-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Add a note..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={addNote}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {notes.filter(note => note.videoId === currentVideo.id).map(note => (
                          <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{note.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(note.createdAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quiz */}
            {showQuiz && currentQuiz && (
              <div className="mb-6">
                <QuizComponent
                  quiz={currentQuiz}
                  onComplete={handleQuizComplete}
                />
              </div>
            )}

            {/* Premium Interactive Problem Solver */}
            {showProblemSolver && (
              <div className="relative bg-gradient-to-br from-white/95 via-purple-50/90 to-white/95 dark:from-slate-900/95 dark:via-purple-950/90 dark:to-slate-900/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(139,92,246,0.4)] border border-purple-200/50 dark:border-purple-500/20 p-8 sm:p-10 mb-8 transition-all duration-500 hover:shadow-[0_20px_80px_-15px_rgba(139,92,246,0.6)] ring-1 ring-purple-100/50 dark:ring-purple-500/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-br from-violet-500 via-purple-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-500/30">
                      <Calculator className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-purple-700 dark:from-violet-400 dark:via-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
                        AI Problem Solver
                      </h3>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mt-1">Powered by advanced AI mathematics</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-xs">BETA</span>
                        Enter your calculus problem
                      </label>
                      <input
                        type="text"
                        value={problemInput}
                        onChange={(e) => setProblemInput(e.target.value)}
                        placeholder='Try "derivative of x^2 + 3x + 1" or "integral of 2x"...'
                        className="w-full px-6 py-4 bg-white/80 dark:bg-slate-800/80 border-2 border-purple-200 dark:border-purple-500/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 dark:text-white transition-all duration-300 text-lg shadow-sm hover:shadow-md backdrop-blur-sm"
                      />
                    </div>
                    
                    <button
                      onClick={() => {
                        // Simulate AI problem solving
                        const solutions: { [key: string]: string } = {
                          'derivative of x^2': '2x',
                          'derivative of x^2 + 3x + 1': '2x + 3',
                          'derivative of x^3': '3x^2',
                          'derivative of sin(x)': 'cos(x)',
                          'derivative of e^x': 'e^x',
                          'integral of 2x': 'x^2 + C',
                          'integral of x^2': 'x^3/3 + C'
                        };
                        const solution = solutions[problemInput.toLowerCase()] || 'Step-by-step solution will be provided here...';
                        setProblemSolution(solution);
                      }}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-500 via-purple-500 to-purple-600 text-white rounded-2xl hover:from-violet-600 hover:via-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transform hover:-translate-y-0.5 font-bold text-lg flex items-center gap-3 justify-center ring-2 ring-purple-400/20"
                    >
                      <Brain className="h-5 w-5" />
                      Solve with AI
                    </button>
                    
                    {problemSolution && (
                      <div className="bg-gradient-to-br from-purple-50/80 via-white/80 to-purple-50/80 dark:from-purple-950/50 dark:via-slate-800/80 dark:to-purple-950/50 p-6 sm:p-8 rounded-2xl border-2 border-purple-200 dark:border-purple-500/30 shadow-inner backdrop-blur-sm animate-fadeIn">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                          <h4 className="font-black text-gray-900 dark:text-white text-xl">Solution</h4>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-purple-200 dark:border-purple-500/30 shadow-sm">
                          <p className="text-gray-900 dark:text-gray-100 font-mono text-xl font-bold">{problemSolution}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Premium Interactive Graphing Tool */}
            {showGraphingTool && (
              <div className="relative bg-gradient-to-br from-white/95 via-blue-50/90 to-white/95 dark:from-slate-900/95 dark:via-blue-950/90 dark:to-slate-900/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(59,130,246,0.4)] border border-blue-200/50 dark:border-blue-500/20 p-8 sm:p-10 mb-8 transition-all duration-500 hover:shadow-[0_20px_80px_-15px_rgba(59,130,246,0.6)] ring-1 ring-blue-100/50 dark:ring-blue-500/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
                      <TrendingUp className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
                        AI Graphing Tool
                      </h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">Visualize functions in real-time</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs">NEW</span>
                        Enter function to graph
                      </label>
                      <input
                        type="text"
                        value={graphFunction}
                        onChange={(e) => setGraphFunction(e.target.value)}
                        placeholder='Try "x^2", "sin(x)", "e^x", or "x^3 - 2x"...'
                        className="w-full px-6 py-4 bg-white/80 dark:bg-slate-800/80 border-2 border-blue-200 dark:border-blue-500/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white transition-all duration-300 text-lg shadow-sm hover:shadow-md backdrop-blur-sm"
                      />
                    </div>
                    
                    <button
                      onClick={() => {
                        // Simulate graphing
                        console.log('Graphing function:', graphFunction);
                      }}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 font-bold text-lg flex items-center gap-3 justify-center ring-2 ring-blue-400/20"
                    >
                      <TrendingUp className="h-5 w-5" />
                      Generate Graph
                    </button>
                    
                    <div className="bg-gradient-to-br from-blue-50/80 via-white/80 to-cyan-50/80 dark:from-blue-950/50 dark:via-slate-800/80 dark:to-cyan-950/50 h-96 rounded-2xl flex items-center justify-center border-2 border-blue-200 dark:border-blue-500/30 shadow-inner backdrop-blur-sm overflow-hidden">
                      <div className="text-center text-gray-600 dark:text-gray-300">
                        <div className="p-6 bg-white/90 dark:bg-slate-800/90 rounded-3xl shadow-2xl mb-6 ring-1 ring-blue-200 dark:ring-blue-500/30 backdrop-blur-sm">
                          <TrendingUp className="h-20 w-20 mx-auto mb-4 text-blue-500 dark:text-blue-400" />
                          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4"></div>
                        </div>
                        <p className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Interactive Graph Canvas</p>
                        {graphFunction && (
                          <div className="bg-white/90 dark:bg-slate-800/90 px-6 py-3 rounded-2xl border border-blue-200 dark:border-blue-500/30 inline-block shadow-sm backdrop-blur-sm">
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Function: </span>
                            <span className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">{graphFunction}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Discussion Forum */}
            {showDiscussion && (
              <div className="relative bg-gradient-to-br from-white/95 via-orange-50/90 to-white/95 dark:from-slate-900/95 dark:via-orange-950/90 dark:to-slate-900/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(249,115,22,0.4)] border border-orange-200/50 dark:border-orange-500/20 p-8 sm:p-10 mb-8 transition-all duration-500 hover:shadow-[0_20px_80px_-15px_rgba(249,115,22,0.6)] ring-1 ring-orange-100/50 dark:ring-orange-500/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-4 bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 rounded-2xl shadow-lg shadow-orange-500/30">
                      <MessageCircle className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-orange-700 dark:from-amber-400 dark:via-orange-400 dark:to-orange-500 bg-clip-text text-transparent">
                        Course Discussion
                      </h3>
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mt-1">Connect with fellow learners</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      {discussionMessages.map((msg, index) => (
                        <div key={index} className="flex space-x-4 p-5 bg-gradient-to-r from-orange-50/80 via-white/80 to-orange-50/80 dark:from-orange-950/50 dark:via-slate-800/80 dark:to-orange-950/50 rounded-2xl border border-orange-200 dark:border-orange-500/30 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 ring-2 ring-orange-300 dark:ring-orange-500/30">
                            <span className="text-white font-black text-base">{msg.user[0]}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <span className="font-bold text-gray-900 dark:text-white text-lg">{msg.user}</span>
                              <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50 px-3 py-1.5 rounded-full font-medium">{msg.time}</span>
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-900 p-4 rounded-xl border border-orange-200 dark:border-orange-500/30 leading-relaxed">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ask a question or share your thoughts..."
                        className="flex-1 px-6 py-4 bg-white/80 dark:bg-slate-800/80 border-2 border-orange-200 dark:border-orange-500/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white transition-all duration-300 text-lg shadow-sm hover:shadow-md backdrop-blur-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newMessage.trim()) {
                            setDiscussionMessages(prev => [...prev, {
                              user: 'You',
                              message: newMessage,
                              time: 'now'
                            }]);
                            setNewMessage('');
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newMessage.trim()) {
                            setDiscussionMessages(prev => [...prev, {
                              user: 'You',
                              message: newMessage,
                              time: 'now'
                            }]);
                            setNewMessage('');
                          }
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white rounded-2xl hover:from-amber-600 hover:via-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transform hover:-translate-y-0.5 font-bold text-lg flex items-center gap-3 justify-center ring-2 ring-orange-400/20"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Course Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: BookOpen },
                    { id: 'content', label: 'Content', icon: Video },
                    { id: 'reviews', label: 'Reviews', icon: Star },
                    { id: 'instructor', label: 'Instructor', icon: Users }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Course Description - Enhanced with glassmorphism */}
                    <div className="relative group overflow-hidden bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 rounded-3xl p-8 border-2 border-blue-200/50 hover:border-blue-300/70 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <div className="relative p-4 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                              <BookOpen className="h-8 w-8 text-white" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-3xl font-black text-gray-900 mb-1">Course Overview</h3>
                            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-gray-800 text-lg leading-relaxed font-medium">{course.description}</p>
                        
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t-2 border-blue-200/50">
                          <div className="text-center">
                            <div className="text-3xl font-black text-blue-600 mb-1">{videos.length}</div>
                            <div className="text-sm text-gray-600 font-semibold">Lessons</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-black text-indigo-600 mb-1">{course.level}</div>
                            <div className="text-sm text-gray-600 font-semibold">Level</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-black text-purple-600 mb-1">{course.duration}</div>
                            <div className="text-sm text-gray-600 font-semibold">Duration</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-black text-pink-600 mb-1">{course.language}</div>
                            <div className="text-sm text-gray-600 font-semibold">Language</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* What You'll Learn - Enhanced with cards and hover effects */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 rounded-3xl p-8 border-2 border-green-200/50 hover:border-green-300/70 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20">
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="absolute inset-0 bg-green-600 rounded-2xl blur-xl opacity-50"></div>
                              <div className="relative p-4 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 rounded-2xl shadow-lg">
                                <Target className="h-8 w-8 text-white" />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-3xl font-black text-gray-900 mb-1">What You'll Learn</h3>
                              <div className="h-1.5 w-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
                            </div>
                          </div>
                          <div className="px-4 py-2 bg-green-100 rounded-xl border-2 border-green-300">
                            <span className="text-green-800 font-black text-lg">{course.whatYoullLearn.length} Skills</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {course.whatYoullLearn.map((item, index) => (
                            <div key={index} className="group relative overflow-hidden bg-gradient-to-br from-white via-green-50/50 to-emerald-50/30 p-6 rounded-2xl border-2 border-green-200/70 hover:border-green-400 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-1">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                              <div className="relative flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-green-500 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                      <CheckCircle2 className="h-7 w-7 text-white" />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs font-black text-green-600 mb-2">SKILL {index + 1}</div>
                                  <p className="text-gray-900 font-bold text-base leading-snug">{item}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Requirements - Enhanced with timeline style */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-yellow-500/5 rounded-3xl p-8 border-2 border-orange-200/50 hover:border-orange-300/70 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20">
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="absolute inset-0 bg-orange-600 rounded-2xl blur-xl opacity-50"></div>
                              <div className="relative p-4 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-600 rounded-2xl shadow-lg">
                                <CheckCircle className="h-8 w-8 text-white" />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-3xl font-black text-gray-900 mb-1">Prerequisites</h3>
                              <div className="h-1.5 w-24 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full"></div>
                            </div>
                          </div>
                          <div className="px-4 py-2 bg-orange-100 rounded-xl border-2 border-orange-300">
                            <span className="text-orange-800 font-black text-lg">{course.requirements.length} Required</span>
                          </div>
                        </div>
                        <div className="relative space-y-5">
                          {/* Timeline line */}
                          <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-orange-300 via-amber-300 to-yellow-300 rounded-full"></div>
                          
                          {course.requirements.map((req, index) => (
                            <div key={index} className="relative group flex items-start space-x-6 bg-gradient-to-br from-white via-orange-50/50 to-amber-50/30 p-6 rounded-2xl border-2 border-orange-200/70 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:translate-x-2">
                              <div className="relative flex-shrink-0">
                                <div className="absolute inset-0 bg-orange-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                <div className="relative w-14 h-14 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                                  <span className="text-white text-xl font-black">{index + 1}</span>
                                </div>
                              </div>
                              <div className="flex-1 pt-2">
                                <div className="text-xs font-black text-orange-600 mb-2">REQUIREMENT {index + 1}</div>
                                <p className="text-gray-900 font-bold text-base leading-snug">{req}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Course Stats - Enhanced with animations and gradients */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="group relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-500 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-6">
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                              <Clock className="h-10 w-10" />
                            </div>
                            <div className="px-3 py-1 bg-white/20 rounded-xl backdrop-blur-sm">
                              <BarChart3 className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="mb-3">
                            <h4 className="text-lg font-bold text-blue-100 mb-2">Total Duration</h4>
                            <p className="text-5xl font-black mb-2">{course.duration}</p>
                            <div className="h-1.5 w-20 bg-white/40 rounded-full"></div>
                          </div>
                          <p className="text-blue-100 font-semibold">Complete Learning Path</p>
                        </div>
                      </div>
                      
                      <div className="group relative overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-500 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-transparent to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-6">
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                              <Users className="h-10 w-10" />
                            </div>
                            <div className="px-3 py-1 bg-white/20 rounded-xl backdrop-blur-sm">
                              <TrendingUp className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="mb-3">
                            <h4 className="text-lg font-bold text-green-100 mb-2">Students Enrolled</h4>
                            <p className="text-5xl font-black mb-2">{course.studentsCount.toLocaleString()}</p>
                            <div className="h-1.5 w-20 bg-white/40 rounded-full"></div>
                          </div>
                          <p className="text-green-100 font-semibold">Active Community</p>
                        </div>
                      </div>
                      
                      <div className="group relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-6">
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                              <Star className="h-10 w-10 fill-current" />
                            </div>
                            <div className="px-3 py-1 bg-white/20 rounded-xl backdrop-blur-sm">
                              <Award className="h-5 w-5" />
                            </div>
                          </div>
                          <div className="mb-3">
                            <h4 className="text-lg font-bold text-purple-100 mb-2">Average Rating</h4>
                            <div className="flex items-baseline space-x-2 mb-2">
                              <p className="text-5xl font-black">{course.rating}</p>
                              <span className="text-2xl font-bold text-purple-200">/5.0</span>
                            </div>
                            <div className="h-1.5 w-20 bg-white/40 rounded-full"></div>
                          </div>
                          <p className="text-purple-100 font-semibold">Highly Rated Course</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-8">
                    {/* Content Header with Stats */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 rounded-3xl p-8 border-2 border-purple-200/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-transparent to-pink-400/5"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="absolute inset-0 bg-purple-600 rounded-2xl blur-xl opacity-50"></div>
                              <div className="relative p-4 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 rounded-2xl shadow-lg">
                                <Video className="h-8 w-8 text-white" />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-3xl font-black text-gray-900 mb-1">Course Content</h3>
                              <div className="h-1.5 w-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="px-4 py-2 bg-purple-100 rounded-xl border-2 border-purple-300">
                              <span className="text-purple-800 font-black text-lg">{videos.length} Lessons</span>
                            </div>
                            <div className="px-4 py-2 bg-pink-100 rounded-xl border-2 border-pink-300">
                              <span className="text-pink-800 font-black text-lg">{course.duration}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-gray-600">COMPLETED</span>
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="text-3xl font-black text-green-600">{completedVideos.size}/{videos.length}</div>
                          </div>
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-gray-600">PROGRESS</span>
                              <BarChart3 className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="text-3xl font-black text-blue-600">{courseProgress.toFixed(0)}%</div>
                          </div>
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-gray-600">TIME LEFT</span>
                              <Clock className="h-5 w-5 text-orange-500" />
                            </div>
                            <div className="text-3xl font-black text-orange-600">{Math.round((100 - courseProgress) * videos.length * 25 / 100)} min</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video List */}
                    <div className="space-y-4">
                      {videos.map((video, index) => {
                        const isCompleted = completedVideos.has(video.id);
                        const isCurrent = currentVideoIndex === index;
                        
                        return (
                          <button
                            key={video.id}
                            onClick={() => navigateToVideo(index)}
                            className={`group w-full text-left relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                              isCurrent
                                ? 'border-blue-500 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-xl shadow-blue-500/20 scale-[1.02]'
                                : isCompleted
                                ? 'border-green-300/70 bg-gradient-to-r from-green-50/50 via-emerald-50/30 to-white hover:border-green-400 hover:shadow-lg hover:shadow-green-500/20'
                                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10'
                            } hover:scale-[1.02]`}
                          >
                            {/* Background gradient effect */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                              isCurrent 
                                ? 'bg-gradient-to-r from-blue-400/5 via-indigo-400/5 to-purple-400/5'
                                : isCompleted
                                ? 'bg-gradient-to-r from-green-400/5 via-emerald-400/5 to-teal-400/5'
                                : 'bg-gradient-to-r from-purple-400/5 via-pink-400/5 to-blue-400/5'
                            }`}></div>
                            
                            {/* Progress indicator line */}
                            {(isCurrent || isCompleted) && (
                              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                isCurrent ? 'bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500' : 'bg-gradient-to-b from-green-500 to-emerald-500'
                              }`}></div>
                            )}
                            
                            <div className="relative p-6">
                              <div className="flex items-center space-x-5">
                                {/* Video Icon/Status */}
                                <div className="flex-shrink-0">
                                  {isCompleted ? (
                                    <div className="relative">
                                      <div className="absolute inset-0 bg-green-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                      <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <CheckCircle className="h-8 w-8 text-white" />
                                      </div>
                                    </div>
                                  ) : isCurrent ? (
                                    <div className="relative">
                                      <div className="absolute inset-0 bg-blue-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                      <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                                        <Play className="h-8 w-8 text-white fill-current" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="relative">
                                      <div className="absolute inset-0 bg-gray-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                      <div className="relative w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-2xl flex items-center justify-center shadow group-hover:from-purple-100 group-hover:to-pink-100 group-hover:border-purple-300 transition-all duration-300">
                                        <Play className="h-7 w-7 text-gray-500 group-hover:text-purple-600 transition-colors" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Video Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-xs font-black px-3 py-1 rounded-lg ${
                                          isCurrent 
                                            ? 'bg-blue-600 text-white' 
                                            : isCompleted
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                        }`}>
                                          LESSON {index + 1}
                                        </span>
                                        {video.isPreview && (
                                          <span className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-lg">
                                            <Play className="h-3 w-3" />
                                            FREE PREVIEW
                                          </span>
                                        )}
                                        {isCurrent && (
                                          <span className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-lg text-xs font-black animate-pulse">
                                            <Flame className="h-3 w-3" />
                                            NOW PLAYING
                                          </span>
                                        )}
                                      </div>
                                      <h4 className={`text-xl font-bold mb-2 ${
                                        isCurrent ? 'text-blue-900' : 'text-gray-900'
                                      }`}>
                                        {video.title}
                                      </h4>
                                      {video.description && (
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                          {video.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Meta info */}
                                  <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                                      <Clock className="h-4 w-4 text-gray-600" />
                                      <span className="text-sm font-bold text-gray-700">{formatDuration(video.duration)}</span>
                                    </div>
                                    {isCompleted && (
                                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-bold text-green-700">Completed</span>
                                      </div>
                                    )}
                                    {bookmarkedVideos.has(video.id) && (
                                      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 rounded-lg">
                                        <Bookmark className="h-4 w-4 text-yellow-600" />
                                        <span className="text-sm font-bold text-yellow-700">Saved</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Chevron indicator */}
                                <div className="flex-shrink-0">
                                  <div className={`p-3 rounded-xl transition-all duration-300 ${
                                    isCurrent 
                                      ? 'bg-blue-100 text-blue-600 scale-110' 
                                      : 'bg-gray-100 text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 group-hover:scale-110'
                                  }`}>
                                    <ChevronRight className="h-6 w-6" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Course Summary Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 rounded-3xl p-8 border-2 border-indigo-200/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/5 via-transparent to-pink-400/5"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl">
                              <Award className="h-6 w-6 text-white" />
                            </div>
                            <h4 className="text-2xl font-black text-gray-900">Course Summary</h4>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200/50">
                            <div className="text-3xl font-black text-indigo-600 mb-1">{videos.length}</div>
                            <div className="text-sm text-gray-600 font-bold">Total Lessons</div>
                          </div>
                          <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200/50">
                            <div className="text-3xl font-black text-purple-600 mb-1">{videos.reduce((acc, v) => acc + v.duration, 0)}</div>
                            <div className="text-sm text-gray-600 font-bold">Total Minutes</div>
                          </div>
                          <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-pink-200/50">
                            <div className="text-3xl font-black text-pink-600 mb-1">{completedVideos.size}</div>
                            <div className="text-sm text-gray-600 font-bold">Completed</div>
                          </div>
                          <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200/50">
                            <div className="text-3xl font-black text-blue-600 mb-1">{videos.length - completedVideos.size}</div>
                            <div className="text-sm text-gray-600 font-bold">Remaining</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Student Reviews</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(course.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {course.rating} ({reviews.length} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex items-start space-x-3">
                            <img
                              src={review.avatar}
                              alt={review.studentName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-gray-900">{review.studentName}</span>
                                <div className="flex items-center space-x-1">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                              </div>
                              <p className="text-gray-700 mb-2">{review.comment}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <button className="flex items-center space-x-1 hover:text-gray-700">
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>Helpful ({review.helpful})</span>
                                </button>
                                <button className="hover:text-gray-700">Report</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div className="space-y-8">
                    {/* Instructor Header */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                      <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                        {/* Instructor Avatar */}
                        <div className="relative">
                          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Users className="h-12 w-12 text-white" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        
                        {/* Instructor Info */}
                        <div className="flex-1">
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">{course.instructor}</h3>
                          <p className="text-lg text-gray-600 mb-4">Expert Instructor & Course Creator</p>
                          
                          <div className="flex flex-wrap items-center gap-6 mb-6">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {renderStars(course.instructorRating)}
                              </div>
                              <span className="font-semibold text-gray-900">{course.instructorRating}</span>
                              <span className="text-gray-600">Instructor Rating</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-5 w-5 text-blue-600" />
                              <span className="font-semibold text-gray-900">{course.instructorStudents.toLocaleString()}</span>
                              <span className="text-gray-600">Students</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <BookOpen className="h-5 w-5 text-green-600" />
                              <span className="font-semibold text-gray-900">{course.instructorCourses}</span>
                              <span className="text-gray-600">Courses</span>
                            </div>
                          </div>
                          
                          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                            View Full Profile
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Instructor Bio */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-600 rounded-lg">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900">About the Instructor</h4>
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">{course.instructorBio}</p>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <h5 className="text-lg font-semibold text-gray-900 mb-4">Teaching Philosophy</h5>
                        <p className="text-gray-600 leading-relaxed">
                          "I believe in making complex concepts accessible through clear explanations, 
                          practical examples, and hands-on learning. My goal is to help every student 
                          not just understand the material, but truly master it and apply it in real-world scenarios."
                        </p>
                      </div>
                    </div>

                    {/* Instructor Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center space-x-3 mb-3">
                          <Trophy className="h-8 w-8" />
                          <h4 className="text-xl font-bold">Experience</h4>
                        </div>
                        <p className="text-3xl font-bold">20+</p>
                        <p className="text-blue-100">Years Teaching</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center space-x-3 mb-3">
                          <Users className="h-8 w-8" />
                          <h4 className="text-xl font-bold">Students</h4>
                        </div>
                        <p className="text-3xl font-bold">{course.instructorStudents.toLocaleString()}</p>
                        <p className="text-green-100">Taught</p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center space-x-3 mb-3">
                          <Star className="h-8 w-8" />
                          <h4 className="text-xl font-bold">Rating</h4>
                        </div>
                        <p className="text-3xl font-bold">{course.instructorRating}</p>
                        <p className="text-purple-100">Instructor Rating</p>
                      </div>
                    </div>

                    {/* Student Testimonials */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-8">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-yellow-600 rounded-lg">
                          <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900">What Students Say</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                          <div className="flex items-center space-x-1 mb-3">
                            {renderStars(5)}
                          </div>
                          <p className="text-gray-700 mb-4 italic">
                            "Amazing instructor! The explanations are crystal clear and the examples are perfect. 
                            I finally understand calculus thanks to this course."
                          </p>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">A</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Alex Johnson</p>
                              <p className="text-sm text-gray-600">Student</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                          <div className="flex items-center space-x-1 mb-3">
                            {renderStars(5)}
                          </div>
                          <p className="text-gray-700 mb-4 italic">
                            "The best math instructor I've ever had. The AI visualizations make everything 
                            so much easier to understand. Highly recommended!"
                          </p>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">S</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Sarah Chen</p>
                              <p className="text-sm text-gray-600">Student</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Course Progress</span>
                    <span>{courseProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${courseProgress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{completedVideos.size}</div>
                    <div className="text-sm text-green-600">Completed</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{videos.length}</div>
                    <div className="text-sm text-blue-600">Total Videos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium">{course.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students</span>
                  <span className="font-medium">{course.studentsCount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <RankingSidebar />
          </div>
        </div>
      </div>

      {/* Achievement Notification */}
      {showAchievement && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white p-6 rounded-2xl shadow-2xl border border-yellow-300/50 flex items-center space-x-4 backdrop-blur-xl">
            <div className="p-3 bg-white/20 rounded-xl">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-xl mb-1">🎉 Achievement Unlocked!</h4>
              <p className="text-lg font-medium">{newAchievement}</p>
            </div>
            <button
              onClick={() => setShowAchievement(false)}
              className="text-white hover:text-yellow-200 p-2 rounded-full hover:bg-white/20 transition-all duration-300"
            >
              <span className="text-xl font-bold">✕</span>
            </button>
          </div>
        </div>
      )}

      {/* Progress Stats */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="bg-white backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 p-6 space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <p className="text-lg font-bold text-gray-900">{courseProgress.toFixed(0)}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Points</span>
              <p className="text-lg font-bold text-gray-900">{totalPoints}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl">
            <div className="p-2 bg-red-500 rounded-lg">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Streak</span>
              <p className="text-lg font-bold text-gray-900">{streak} days</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Achievements</span>
              <p className="text-lg font-bold text-gray-900">{achievements.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;