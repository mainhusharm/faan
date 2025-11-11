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
  TrendingUp, Award, Flame, Sparkles, Globe, Download,
  Lock, Unlock, PlayCircle, Circle, ArrowRight
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
          },
          {
            id: 'chem1-4',
            title: 'Acid Base Full Methods',
            video_url: 'https://www.youtube.com/embed/n10YHmpzGLs',
            duration: 32,
            order_index: 3,
            description: 'Learn comprehensive acid-base chemistry methods including pH calculations, titrations, and buffer solutions.'
          },
          {
            id: 'chem1-5',
            title: 'Acid Base Properties Along with How It Works',
            video_url: 'https://www.youtube.com/embed/ox2qUj-dEUo',
            duration: 28,
            order_index: 4,
            description: 'Understand the properties of acids and bases and how they interact in chemical reactions.'
          },
          {
            id: 'chem1-6',
            title: 'How Acid Base Works Out',
            video_url: 'https://www.youtube.com/embed/ik9xKEtPLVE',
            duration: 26,
            order_index: 5,
            description: 'Master the detailed mechanisms of acid-base reactions and their applications in real-world scenarios.'
          }
        ],
        '12': [ // Physics - Electricity & Magnetism
          {
            id: 'em-1',
            title: 'Future Tech and Electromagnetic',
            video_url: 'https://www.youtube.com/embed/V9ZLS8rlDhA',
            duration: 28,
            order_index: 0,
            description: 'Explore future technology and electromagnetic principles with advanced visualizations.',
            isPreview: true
          },
          {
            id: 'em-2',
            title: 'How Energy Gets Converted',
            video_url: 'https://www.youtube.com/embed/KdHbDn_4vKU',
            duration: 24,
            order_index: 1,
            description: 'Understand energy conversion in electromagnetic systems and real-world applications.'
          },
          {
            id: 'em-3',
            title: 'Electric Power and Magnetic Current',
            video_url: 'https://www.youtube.com/embed/nc437pMGLgE',
            duration: 26,
            order_index: 2,
            description: 'Master the relationship between electric power and magnetic current with interactive demonstrations.'
          },
          {
            id: 'em-4',
            title: 'How Electric Charge Works',
            video_url: 'https://www.youtube.com/embed/E_-9JygaqK0',
            duration: 22,
            order_index: 3,
            description: 'Learn the fundamentals of electric charge and its behavior in electromagnetic fields.'
          },
          {
            id: 'em-5',
            title: 'Different Types of Energy',
            video_url: 'https://www.youtube.com/embed/eqzJ2TOIgAQ',
            duration: 25,
            order_index: 4,
            description: 'Explore different forms of energy and their transformations in electromagnetic systems.'
          },
          {
            id: 'em-6',
            title: 'How Current in Wire Works',
            video_url: 'https://www.youtube.com/embed/R4GINCjCjGY',
            duration: 30,
            order_index: 5,
            description: 'Get a comprehensive explanation of how current flows through wires and circuits.'
          }
        ],
        '5': [ // Mathematics Foundation - Algebra & Functions
          {
            id: 'algebra-1',
            title: 'Full Algebra Mathematics',
            video_url: 'https://www.youtube.com/embed/t-KsAsgarc0',
            duration: 45,
            order_index: 0,
            description: 'Complete algebra fundamentals including equations, functions, and graphing with AI-powered visualizations.',
            isPreview: true
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

    // Set data
    setCourse(mockCourse);
    setVideos(mockVideos);
    setCurrentVideoIndex(0);
    setCurrentVideo(mockVideos[0]);
    setReviews(mockReviews);
    setLoading(false);
    
    // Calculate progress
    const progress = (completedVideos.size / mockVideos.length) * 100;
    setCourseProgress(progress);

    // Fetch quiz for first video
    const firstVideo = mockVideos[0];
    if (firstVideo) {
      await loadQuizForVideo(firstVideo.id, courseId!);
    }
  };

  const handleVideoEnd = async () => {
    if (!currentVideo) return;
    
    // Mark video as completed
    const newCompletedVideos = new Set(completedVideos);
    newCompletedVideos.add(currentVideo.id);
    setCompletedVideos(newCompletedVideos);
    
    // Update progress
    const progress = (newCompletedVideos.size / videos.length) * 100;
    setCourseProgress(progress);
    
    // Save to Supabase if user is logged in
    if (user) {
      // await saveVideoProgress(user.id, courseId!, currentVideo.id);
    }
    
    // Show quiz
    if (currentQuiz) {
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = async (score: number) => {
    setShowQuiz(false);
    
    // Award points
    const points = Math.round(score * 10);
    setTotalPoints(prev => prev + points);
    
    // Auto-advance to next video
    if (currentVideoIndex < videos.length - 1) {
      navigateToVideo(currentVideoIndex + 1);
    }
  };

  const navigateToVideo = async (index: number) => {
    if (index < 0 || index >= videos.length) return;
    
    setCurrentVideoIndex(index);
    const video = videos[index];
    setCurrentVideo(video);
    setShowQuiz(false);
    
    // Load quiz for this video
    await loadQuizForVideo(video.id, courseId!);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadQuizForVideo = async (videoId: string, courseId: string) => {
    // Mock quiz data - replace with actual Supabase query
    const getQuizzesForCourse = (courseId: string): any[] => {
      const quizSets: { [key: string]: any[] } = {
        '6': [ // Calculus I quizzes
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
          }
        ],
        '1': [ // Physics quizzes
          {
            id: '1',
            video_id: '1',
            question: 'According to Newton\'s First Law, what happens to an object in motion when no net force acts on it?',
            options: ['It stops immediately', 'It continues at constant velocity', 'It accelerates', 'It changes direction'],
            correct_answer: 1,
            explanation: 'Newton\'s First Law states that an object in motion will continue at constant velocity (including zero velocity) unless acted upon by a net external force.'
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
      timestamp: 0,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-slate-800/50 rounded-2xl w-2/3"></div>
            <div className="h-96 bg-slate-800/50 rounded-3xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-64 bg-slate-800/50 rounded-2xl"></div>
              <div className="h-64 bg-slate-800/50 rounded-2xl"></div>
              <div className="h-64 bg-slate-800/50 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Course not found</h2>
          <button
            onClick={() => navigate('/courses')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8">
            {/* Premium Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900/95 via-indigo-900/95 to-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)]">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
              
              <div className="relative z-10 p-8 lg:p-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-3 mb-8">
                  <button
                    onClick={() => navigate('/courses')}
                    className="group flex items-center gap-2 text-indigo-300 hover:text-white transition-all duration-300"
                  >
                    <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-semibold tracking-wide">All Courses</span>
                  </button>
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                  <span className="text-sm text-slate-400 truncate">{course.title}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                  {/* Left: Course Info */}
                  <div className="flex-1 space-y-8">
                    {/* Title with premium typography */}
                    <div>
                      <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black mb-6 leading-[1.1] bg-gradient-to-r from-white via-indigo-100 to-white bg-clip-text text-transparent tracking-tight">
                        {course.title}
                      </h1>
                      <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed font-light">
                        {course.description}
                      </p>
                    </div>

                    {/* Premium Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Users, label: 'Instructor', value: course.instructor, gradient: 'from-indigo-500 to-purple-600' },
                        { icon: Clock, label: 'Duration', value: course.duration, gradient: 'from-purple-500 to-pink-600' },
                        { icon: Star, label: 'Rating', value: `${course.rating} (${course.studentsCount.toLocaleString()})`, gradient: 'from-amber-500 to-orange-600' },
                        { icon: Trophy, label: 'Level', value: course.level, gradient: 'from-cyan-500 to-blue-600' }
                      ].map((stat, idx) => (
                        <div key={idx} className="group relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-white/5 p-5 hover:border-white/10 transition-all duration-500 hover:scale-[1.02]">
                          <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>
                          <div className="relative flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                              <stat.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-1">{stat.label}</div>
                              <div className="font-bold text-white text-base">{stat.value}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                        <span className="text-green-400 font-bold text-sm flex items-center gap-2">
                          <Unlock className="h-4 w-4" />
                          {videos.filter(v => v.isPreview).length} Free Previews
                        </span>
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                        <span className="text-blue-400 font-bold text-sm flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {course.language}
                        </span>
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
                        <span className="text-purple-400 font-bold text-sm flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Offline Access
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Pricing Card */}
                  <div className="lg:w-80 flex-shrink-0">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-[2px] shadow-[0_20px_60px_-15px_rgba(99,102,241,0.5)] hover:shadow-[0_20px_80px_-15px_rgba(99,102,241,0.7)] transition-all duration-500">
                      <div className="relative bg-slate-900 rounded-3xl p-8 h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
                        
                        <div className="relative space-y-6">
                          <div>
                            <div className="text-xs font-bold text-indigo-300 mb-3 tracking-wider uppercase flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              Limited Time Offer
                            </div>
                            <div className="flex items-baseline gap-3 mb-2">
                              <span className="text-6xl font-black text-white">${course.price}</span>
                              {course.originalPrice && (
                                <span className="text-2xl text-slate-500 line-through">${course.originalPrice}</span>
                              )}
                            </div>
                            {course.originalPrice && (
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
                                <span className="text-green-400 font-bold text-sm">
                                  Save {Math.round((1 - course.price / course.originalPrice) * 100)}%
                                </span>
                              </div>
                            )}
                          </div>

                          <button className="group w-full relative overflow-hidden px-8 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-xl rounded-2xl hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <span className="relative flex items-center justify-center gap-3">
                              <Zap className="h-6 w-6" />
                              Enroll Now
                            </span>
                          </button>

                          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                            <Flame className="h-5 w-5 text-orange-400" />
                            <span className="font-semibold">{Math.floor(Math.random() * 50 + 10)} students enrolled today</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Video Player Section */}
            {currentVideo && (
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900/95 via-slate-900/98 to-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"></div>
                
                <div className="relative z-10 p-6 lg:p-8">
                  {/* Video Header */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between gap-6 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wider uppercase">
                            Lesson {currentVideoIndex + 1} of {videos.length}
                          </span>
                          {currentVideo.isPreview && (
                            <span className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-bold flex items-center gap-2">
                              <PlayCircle className="h-3 w-3" />
                              Free Preview
                            </span>
                          )}
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black text-white mb-3 leading-tight">
                          {currentVideo.title}
                        </h2>
                        <p className="text-lg text-slate-300 leading-relaxed">
                          {currentVideo.description}
                        </p>
                      </div>

                      {/* Video Navigation */}
                      <div className="flex items-center gap-2 bg-slate-800/50 rounded-2xl p-2 backdrop-blur-xl border border-white/5">
                        <button
                          onClick={() => navigateToVideo(Math.max(0, currentVideoIndex - 1))}
                          disabled={currentVideoIndex === 0}
                          className="p-3 text-indigo-400 hover:text-white hover:bg-indigo-500/10 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 disabled:hover:bg-transparent"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => navigateToVideo(Math.min(videos.length - 1, currentVideoIndex + 1))}
                          disabled={currentVideoIndex === videos.length - 1}
                          className="p-3 text-indigo-400 hover:text-white hover:bg-indigo-500/10 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 disabled:hover:bg-transparent"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Video Meta Info */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-white/5 backdrop-blur-xl">
                        <Clock className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm font-semibold text-white">{formatDuration(currentVideo.duration)}</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-white/5 backdrop-blur-xl">
                        <BarChart3 className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-semibold text-white">{courseProgress.toFixed(0)}% Complete</span>
                      </div>
                      <button
                        onClick={() => toggleBookmark(currentVideo.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                          bookmarkedVideos.has(currentVideo.id)
                            ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                            : 'bg-slate-800/50 border border-white/5 text-slate-400 hover:text-white'
                        } backdrop-blur-xl`}
                      >
                        <Bookmark className="h-4 w-4" />
                        <span className="text-sm">Bookmark</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-white/5 text-slate-400 hover:text-white font-semibold transition-all duration-300 backdrop-blur-xl">
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Video Player */}
                  <div className="mb-6">
                    <VideoPlayer
                      src={currentVideo.video_url}
                      onVideoEnd={handleVideoEnd}
                    />
                  </div>

                  {/* Interactive Tools Bar */}
                  <div className="flex flex-wrap gap-3">
                    {!showQuiz && currentQuiz && (
                      <button
                        onClick={() => setShowQuiz(true)}
                        className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 font-bold flex items-center gap-2"
                      >
                        <Brain className="h-5 w-5" />
                        <span>Take Quiz</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowProblemSolver(!showProblemSolver)}
                      className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-400 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 font-bold flex items-center gap-2"
                    >
                      <Calculator className="h-5 w-5" />
                      <span>AI Solver</span>
                    </button>
                    <button
                      onClick={() => setShowGraphingTool(!showGraphingTool)}
                      className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl hover:from-blue-400 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 font-bold flex items-center gap-2"
                    >
                      <TrendingUp className="h-5 w-5" />
                      <span>Graph Tool</span>
                    </button>
                    <button
                      onClick={() => setShowDiscussion(!showDiscussion)}
                      className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-400 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-orange-500/50 font-bold flex items-center gap-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>Discussion</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz */}
            {showQuiz && currentQuiz && (
              <div className="animate-fadeIn">
                <QuizComponent
                  quiz={currentQuiz}
                  onComplete={handleQuizComplete}
                />
              </div>
            )}

            {/* AI Tools Sections */}
            {showProblemSolver && (
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-900/50 via-slate-900/80 to-pink-900/50 backdrop-blur-2xl border border-purple-500/20 p-8 shadow-[0_20px_60px_-15px_rgba(168,85,247,0.4)]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"></div>
                
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                      <Calculator className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white">AI Problem Solver</h3>
                      <p className="text-sm text-purple-300 font-medium">Powered by advanced AI mathematics</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={problemInput}
                      onChange={(e) => setProblemInput(e.target.value)}
                      placeholder='Try "derivative of x^2 + 3x + 1" or "integral of 2x"...'
                      className="w-full px-6 py-4 bg-slate-800/80 border-2 border-purple-500/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 text-white transition-all duration-300 text-lg"
                    />
                    
                    <button
                      onClick={() => {
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
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-400 hover:to-pink-500 transition-all duration-300 shadow-lg font-bold text-lg flex items-center gap-3"
                    >
                      <Brain className="h-5 w-5" />
                      Solve with AI
                    </button>
                    
                    {problemSolution && (
                      <div className="bg-slate-800/80 p-8 rounded-2xl border-2 border-purple-500/30">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                          <h4 className="font-black text-white text-xl">Solution</h4>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-xl">
                          <p className="text-white font-mono text-xl font-bold">{problemSolution}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showGraphingTool && (
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-900/50 via-slate-900/80 to-cyan-900/50 backdrop-blur-2xl border border-blue-500/20 p-8 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.4)]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5"></div>
                
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
                      <TrendingUp className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white">AI Graphing Tool</h3>
                      <p className="text-sm text-blue-300 font-medium">Visualize functions in real-time</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={graphFunction}
                      onChange={(e) => setGraphFunction(e.target.value)}
                      placeholder='Try "x^2", "sin(x)", "e^x", or "x^3 - 2x"...'
                      className="w-full px-6 py-4 bg-slate-800/80 border-2 border-blue-500/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 text-white transition-all duration-300 text-lg"
                    />
                    
                    <button
                      onClick={() => console.log('Graphing function:', graphFunction)}
                      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl hover:from-blue-400 hover:to-cyan-500 transition-all duration-300 shadow-lg font-bold text-lg flex items-center gap-3"
                    >
                      <TrendingUp className="h-5 w-5" />
                      Generate Graph
                    </button>
                    
                    <div className="bg-slate-800/80 h-96 rounded-2xl flex items-center justify-center border-2 border-blue-500/30">
                      <div className="text-center">
                        <div className="p-6 bg-slate-900 rounded-3xl mb-6">
                          <TrendingUp className="h-20 w-20 mx-auto mb-4 text-blue-400" />
                        </div>
                        <p className="text-xl font-bold text-white mb-3">Interactive Graph Canvas</p>
                        {graphFunction && (
                          <div className="bg-slate-900 px-6 py-3 rounded-2xl inline-block">
                            <span className="text-sm text-slate-400 font-medium">Function: </span>
                            <span className="font-mono text-lg font-bold text-blue-400">{graphFunction}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showDiscussion && (
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-900/50 via-slate-900/80 to-red-900/50 backdrop-blur-2xl border border-orange-500/20 p-8 shadow-[0_20px_60px_-15px_rgba(249,115,22,0.4)]">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5"></div>
                
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
                      <MessageCircle className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white">Course Discussion</h3>
                      <p className="text-sm text-orange-300 font-medium">Connect with fellow learners</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {discussionMessages.map((msg, index) => (
                        <div key={index} className="flex gap-4 p-5 bg-slate-800/80 rounded-2xl border border-orange-500/20">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-black text-base">{msg.user[0]}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="font-bold text-white text-lg">{msg.user}</span>
                              <span className="text-xs text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-full font-medium">{msg.time}</span>
                            </div>
                            <p className="text-slate-300 bg-slate-900 p-4 rounded-xl leading-relaxed">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ask a question or share your thoughts..."
                        className="flex-1 px-6 py-4 bg-slate-800/80 border-2 border-orange-500/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-400 text-white transition-all duration-300 text-lg"
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
                        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:from-orange-400 hover:to-red-500 transition-all duration-300 shadow-lg font-bold text-lg flex items-center gap-3"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modern Tabs Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900/95 via-slate-900/98 to-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)]">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"></div>
              
              {/* Premium Tab Navigation */}
              <div className="relative border-b border-white/5">
                <div className="flex overflow-x-auto no-scrollbar px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: BookOpen },
                    { id: 'content', label: 'Content', icon: Video },
                    { id: 'reviews', label: 'Reviews', icon: Star },
                    { id: 'instructor', label: 'Instructor', icon: Users }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`relative flex items-center gap-3 px-6 py-5 font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="relative p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* What You'll Learn */}
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-3xl font-black text-white">What You'll Learn</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.whatYoullLearn.map((item, index) => (
                          <div key={index} className="group flex items-start gap-4 p-6 rounded-2xl bg-slate-800/50 border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                              <CheckCircle2 className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-slate-300 font-medium leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-3xl font-black text-white">Prerequisites</h3>
                      </div>
                      <div className="space-y-4">
                        {course.requirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-4 p-6 rounded-2xl bg-slate-800/50 border border-white/5">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg text-white font-black">
                              {index + 1}
                            </div>
                            <p className="text-slate-300 font-medium leading-relaxed">{req}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: 'Total Duration', value: course.duration, icon: Clock, gradient: 'from-blue-500 to-indigo-600' },
                        { label: 'Students Enrolled', value: course.studentsCount.toLocaleString(), icon: Users, gradient: 'from-green-500 to-emerald-600' },
                        { label: 'Average Rating', value: `${course.rating} / 5.0`, icon: Star, gradient: 'from-purple-500 to-pink-600' }
                      ].map((stat, idx) => (
                        <div key={idx} className={`group relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg hover:shadow-2xl transition-all duration-500`}>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                          <div className="relative">
                            <stat.icon className="h-10 w-10 text-white mb-4" />
                            <h4 className="text-lg font-bold text-white/80 mb-2">{stat.label}</h4>
                            <p className="text-4xl font-black text-white">{stat.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-6">
                    {/* Progress Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-green-300 uppercase tracking-wider">Completed</span>
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="text-4xl font-black text-green-400">{completedVideos.size}/{videos.length}</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-blue-300 uppercase tracking-wider">Progress</span>
                          <BarChart3 className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="text-4xl font-black text-blue-400">{courseProgress.toFixed(0)}%</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-orange-300 uppercase tracking-wider">Time Left</span>
                          <Clock className="h-5 w-5 text-orange-400" />
                        </div>
                        <div className="text-4xl font-black text-orange-400">{Math.round((100 - courseProgress) * videos.length * 25 / 100)} min</div>
                      </div>
                    </div>

                    {/* Video List */}
                    <div className="space-y-3">
                      {videos.map((video, index) => {
                        const isCompleted = completedVideos.has(video.id);
                        const isCurrent = currentVideoIndex === index;
                        
                        return (
                          <button
                            key={video.id}
                            onClick={() => navigateToVideo(index)}
                            className={`group w-full text-left relative overflow-hidden rounded-2xl transition-all duration-300 ${
                              isCurrent
                                ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                                : isCompleted
                                ? 'bg-green-500/5 border-2 border-green-500/20 hover:border-green-500/40'
                                : 'bg-slate-800/30 border-2 border-white/5 hover:border-white/10'
                            }`}
                          >
                            {(isCurrent || isCompleted) && (
                              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                isCurrent ? 'bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500' : 'bg-gradient-to-b from-green-500 to-emerald-500'
                              }`}></div>
                            )}
                            
                            <div className="p-6 flex items-center gap-5">
                              {/* Video Icon */}
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <CheckCircle className="h-8 w-8 text-white" />
                                  </div>
                                ) : isCurrent ? (
                                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                                    <Play className="h-8 w-8 text-white fill-current" />
                                  </div>
                                ) : (
                                  <div className="w-16 h-16 bg-slate-700/50 border-2 border-slate-600 rounded-2xl flex items-center justify-center group-hover:border-indigo-500 group-hover:bg-indigo-500/10 transition-all">
                                    <Play className="h-7 w-7 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Video Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={`text-xs font-black px-3 py-1 rounded-lg ${
                                    isCurrent 
                                      ? 'bg-indigo-500 text-white' 
                                      : isCompleted
                                      ? 'bg-green-500 text-white'
                                      : 'bg-slate-700 text-slate-300'
                                  }`}>
                                    LESSON {index + 1}
                                  </span>
                                  {video.isPreview && (
                                    <span className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-black">
                                      <PlayCircle className="h-3 w-3" />
                                      FREE
                                    </span>
                                  )}
                                  {isCurrent && (
                                    <span className="flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-black animate-pulse">
                                      <Circle className="h-2 w-2 fill-current" />
                                      NOW PLAYING
                                    </span>
                                  )}
                                </div>
                                <h4 className={`text-xl font-bold mb-2 ${
                                  isCurrent ? 'text-white' : 'text-slate-300'
                                }`}>
                                  {video.title}
                                </h4>
                                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-3">
                                  {video.description}
                                </p>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/50 rounded-lg">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm font-semibold text-slate-300">{formatDuration(video.duration)}</span>
                                  </div>
                                  {isCompleted && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-lg">
                                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                                      <span className="text-sm font-semibold text-green-300">Completed</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Arrow indicator */}
                              <div className="flex-shrink-0">
                                <ArrowRight className={`h-6 w-6 transition-all duration-300 ${
                                  isCurrent 
                                    ? 'text-indigo-400 scale-110' 
                                    : 'text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1'
                                }`} />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-3xl font-black text-white">Student Reviews</h3>
                      <div className="flex items-center gap-3 px-5 py-3 bg-slate-800/50 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-1">
                          {renderStars(course.rating)}
                        </div>
                        <span className="text-white font-bold">{course.rating} ({reviews.length} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {reviews.map(review => (
                        <div key={review.id} className="p-6 rounded-2xl bg-slate-800/30 border border-white/5 hover:border-white/10 transition-all">
                          <div className="flex items-start gap-4">
                            <img
                              src={review.avatar}
                              alt={review.studentName}
                              className="w-12 h-12 rounded-full ring-2 ring-white/10"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="font-bold text-white text-lg">{review.studentName}</span>
                                <div className="flex items-center gap-1">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-slate-400">{formatDate(review.date)}</span>
                              </div>
                              <p className="text-slate-300 mb-4 leading-relaxed">{review.comment}</p>
                              <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>Helpful ({review.helpful})</span>
                                </button>
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
                    <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div className="relative">
                          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Users className="h-12 w-12 text-white" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-4xl font-black text-white mb-2">{course.instructor}</h3>
                          <p className="text-lg text-slate-300 mb-6">Expert Instructor & Course Creator</p>
                          
                          <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {renderStars(course.instructorRating)}
                              </div>
                              <span className="font-bold text-white">{course.instructorRating}</span>
                              <span className="text-slate-400">Rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-indigo-400" />
                              <span className="font-bold text-white">{course.instructorStudents.toLocaleString()}</span>
                              <span className="text-slate-400">Students</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-purple-400" />
                              <span className="font-bold text-white">{course.instructorCourses}</span>
                              <span className="text-slate-400">Courses</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instructor Bio */}
                    <div className="p-8 rounded-2xl bg-slate-800/30 border border-white/5">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="text-2xl font-black text-white">About the Instructor</h4>
                      </div>
                      <p className="text-lg text-slate-300 leading-relaxed">{course.instructorBio}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <RankingSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
