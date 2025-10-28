import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RankingSidebar from '../components/Layout/RankingSidebar';
import { 
  Clock, Star, Users, Search, Filter, 
  BookOpen, TrendingUp, Award, Zap,
  ChevronRight, Play, Bookmark, Share2
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  instructor: string;
  duration: string;
  level: string;
  rating: number;
}

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('CoursesPage: Loading courses...');
    // Core STEM Course Offerings with AI visualizations
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Physics Foundation - Mechanics & Motion',
        description: 'Master kinematics, forces, and energy with AI visualizations of projectile motion and molecular-level demonstrations',
        thumbnail_url: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Dr. Sarah Williams',
        duration: '24 hours',
        level: 'Foundation',
        rating: 4.9
      },
      {
        id: '2',
        title: 'Physics Advanced - Modern Physics',
        description: 'Explore atomic structure, quantum mechanics, and nuclear physics with AI electron orbital visualizations',
        thumbnail_url: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Prof. Michael Rodriguez',
        duration: '32 hours',
        level: 'Advanced',
        rating: 4.8
      },
      {
        id: '3',
        title: 'Chemistry Foundation - Atomic Structure',
        description: 'Learn atomic models, chemical bonding, and periodic trends with AI molecular animations',
        thumbnail_url: 'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Dr. Emily Chen',
        duration: '28 hours',
        level: 'Foundation',
        rating: 4.7
      },
      {
        id: '4',
        title: 'Chemistry Advanced - Organic Chemistry',
        description: 'Master molecular structures, reaction mechanisms, and polymer formation with 3D AI models',
        thumbnail_url: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Dr. James Thompson',
        duration: '36 hours',
        level: 'Advanced',
        rating: 4.9
      },
      {
        id: '5',
        title: 'Mathematics Foundation - Algebra & Functions',
        description: 'Master linear equations, quadratic functions, and exponential growth with AI graphing visualizations',
        thumbnail_url: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Prof. Lisa Anderson',
        duration: '30 hours',
        level: 'Foundation',
        rating: 4.8
      },
      {
        id: '6',
        title: 'Calculus I - Limits, Derivatives & Integration',
        description: 'Master the fundamentals of calculus with limits, derivatives, and introduction to integration. Learn with AI-powered curve analysis, area-under-curve visualizations, and interactive problem solving.',
        thumbnail_url: 'https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Dr. Robert Kim',
        duration: '52 hours',
        level: 'Foundation',
        rating: 4.9
      },
      {
        id: '7',
        title: 'Chemistry Foundation - Atomic Theory & Stoichiometry',
        description: 'Master fundamental chemistry concepts including the mole concept, Avogadro\'s number, and molar mass calculations. Learn with AI-powered molecular visualizations, stoichiometric calculations, and interactive problem-solving tools.',
        thumbnail_url: 'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Dr. Michael Chen',
        duration: '28 hours',
        level: 'Foundation',
        rating: 4.8
      },
      {
        id: '13',
        title: 'Calculus II - Comprehensive Integration & Applications',
        description: 'Master comprehensive integration techniques including substitution, integration by parts, partial fractions, and trigonometric substitution. Explore advanced applications in physics, engineering, and mathematics with AI-powered visualizations.',
        thumbnail_url: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Dr. Robert Kim',
        duration: '65 hours',
        level: 'Intermediate',
        rating: 4.8
      },
      {
        id: '14',
        title: 'Calculus III - Multivariable Calculus',
        description: 'Master partial derivatives, multiple integrals, and vector calculus with 3D AI visualizations and surface analysis tools.',
        thumbnail_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Dr. Robert Kim',
        duration: '55 hours',
        level: 'Advanced',
        rating: 4.9
      },
      {
        id: '15',
        title: 'Differential Equations',
        description: 'Solve first-order, second-order, and systems of differential equations with AI solution visualization and phase plane analysis.',
        thumbnail_url: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Dr. Robert Kim',
        duration: '42 hours',
        level: 'Advanced',
        rating: 4.7
      },
      {
        id: '7',
        title: 'Biology Foundation - Cell Biology',
        description: 'Study cell structure, photosynthesis, and cellular respiration with AI organelle animations',
        thumbnail_url: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Dr. Maria Garcia',
        duration: '26 hours',
        level: 'Foundation',
        rating: 4.8
      },
      {
        id: '8',
        title: 'Biology Advanced - Human Biology',
        description: 'Explore body systems, immune responses, and neural networks with AI physiological process animations',
        thumbnail_url: 'https://images.pexels.com/photos/2280569/pexels-photo-2280569.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Dr. David Wilson',
        duration: '34 hours',
        level: 'Advanced',
        rating: 4.7
      },
      {
        id: '9',
        title: 'Engineering Design Process',
        description: 'Learn problem-solving with AI simulation testing, materials science, and robotics programming',
        thumbnail_url: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Prof. Alex Johnson',
        duration: '38 hours',
        level: 'Intermediate',
        rating: 4.9
      },
      {
        id: '10',
        title: 'Data Science & Computing',
        description: 'Master algorithms, machine learning, and coding with AI flowcharts and pattern recognition',
        thumbnail_url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Dr. Jennifer Lee',
        duration: '42 hours',
        level: 'Intermediate',
        rating: 4.8
      },
      {
        id: '11',
        title: 'Physics - Waves & Sound',
        description: 'Study wave mechanics, acoustics, and optics with AI-generated wave propagation and ray-tracing animations',
        thumbnail_url: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Dr. Sarah Williams',
        duration: '22 hours',
        level: 'Foundation',
        rating: 4.6
      },
      {
        id: '12',
        title: 'Physics - Electricity & Magnetism',
        description: 'Master electric and magnetic fields with AI-generated charge interactions and electromagnetic simulations',
        thumbnail_url: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600',
        instructor: 'Prof. Michael Rodriguez',
        duration: '28 hours',
        level: 'Foundation',
        rating: 4.7
      }
    ];

    setTimeout(() => {
      console.log('CoursesPage: Courses loaded successfully');
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedLevel, courses]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Foundation':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black transition-all duration-500 particle-bg">
        <div className="max-w-8xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
            <div className="xl:col-span-3">
              <div className="animate-pulse space-y-12">
                <div className="text-center">
                  <div className="h-16 w-16 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-full mx-auto mb-6 animate-neon-pulse"></div>
                  <div className="h-12 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl max-w-2xl mx-auto mb-4"></div>
                  <div className="h-8 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-xl max-w-3xl mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="glass-vibrant rounded-3xl p-6 border-2 border-purple-500/20">
                      <div className="h-64 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-2xl mb-6 shimmer-effect"></div>
                      <div className="h-6 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-xl mb-3"></div>
                      <div className="h-4 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-lg mb-4 w-3/4"></div>
                      <div className="flex justify-between">
                        <div className="h-8 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-xl w-24"></div>
                        <div className="h-8 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-xl w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="animate-pulse">
              <div className="h-96 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-3xl glass-vibrant border-2 border-purple-500/20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black transition-all duration-500 particle-bg overflow-hidden">
      <div className="max-w-8xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          <div className="xl:col-span-3">
            {/* Header Section */}
            <div className="mb-16 slide-up-animation">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-6 floating-animation">
                  <div className="p-6 rounded-3xl glass-vibrant border-4 border-cyan-400 neon-glow-border">
                    <BookOpen className="h-16 w-16 text-cyan-400" />
                  </div>
                  <div className="absolute inset-0 blur-2xl bg-cyan-400 opacity-30 rounded-3xl"></div>
                </div>
                <h1 className="text-7xl lg:text-8xl font-black mb-6 gradient-text-animated">
                  Core STEM Courses
                </h1>
                <p className="text-2xl lg:text-3xl font-semibold text-cyan-300 max-w-4xl neon-text-animated">
                  Master Physics, Chemistry, Mathematics, Biology & Engineering with AI-powered visualizations
                </p>
                <div className="flex gap-4 mt-8">
                  <div className="px-6 py-3 glass-vibrant rounded-2xl flex items-center gap-2 scale-in-animation" style={{animationDelay: '0.2s'}}>
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <span className="text-white font-bold">15+ Courses</span>
                  </div>
                  <div className="px-6 py-3 glass-vibrant rounded-2xl flex items-center gap-2 scale-in-animation" style={{animationDelay: '0.3s'}}>
                    <Award className="h-5 w-5 text-yellow-400" />
                    <span className="text-white font-bold">AI-Powered</span>
                  </div>
                  <div className="px-6 py-3 glass-vibrant rounded-2xl flex items-center gap-2 scale-in-animation" style={{animationDelay: '0.4s'}}>
                    <Zap className="h-5 w-5 text-purple-400" />
                    <span className="text-white font-bold">Interactive</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="glass-vibrant rounded-3xl p-8 mb-12 slide-up-animation border-2 border-purple-500/30">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 relative group">
                  <Search className="h-6 w-6 text-cyan-400 absolute left-6 top-1/2 transform -translate-y-1/2 z-10 group-focus-within:scale-110 transition-transform" />
                  <input
                    type="text"
                    placeholder="Search STEM courses, subjects, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-slate-900/50 border-2 border-cyan-500/30 rounded-2xl text-white text-lg font-medium placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/20 transition-all"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="px-6 py-5 bg-slate-900/50 border-2 border-purple-500/30 rounded-2xl text-white text-lg font-medium min-w-[200px] focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-400/20 transition-all cursor-pointer"
                  >
                    <option value="all">All Levels</option>
                    <option value="Foundation">Foundation</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <button className="px-8 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg rounded-2xl flex items-center gap-3 hover:from-cyan-400 hover:to-purple-500 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all duration-300">
                    <Filter className="h-5 w-5" />
                    Filter
                  </button>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredCourses.map((course, index) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="course-card-gradient course-card-3d rounded-3xl p-6 group slide-up-animation"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="relative overflow-hidden rounded-2xl mb-6 shimmer-effect image-overlay-gradient">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-64 object-cover group-hover:scale-125 group-hover:rotate-3 transition-all duration-700"
                    />
                    <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white text-sm font-bold border-2 border-white/20 backdrop-blur-sm shadow-lg">
                      {course.level}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                      <div className="p-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_40px_rgba(0,245,255,0.6)] transform hover:rotate-90 transition-all duration-300">
                        <Play className="h-8 w-8" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-2xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300 leading-tight">
                        {course.title}
                      </h3>
                      <p className="text-cyan-100/80 text-base leading-relaxed line-clamp-3 group-hover:text-white transition-colors">
                        {course.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 px-4 py-2 bg-slate-900/50 rounded-xl border border-cyan-500/30">
                        <Clock className="h-5 w-5 text-cyan-400" />
                        <span className="font-bold text-white">{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 px-4 py-2 bg-slate-900/50 rounded-xl border border-yellow-500/30">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-bold text-white">{course.rating}</span>
                      </div>
                    </div>
                    
                    <div className="pt-5 border-t border-cyan-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Users className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{course.instructor}</div>
                            <div className="text-xs text-cyan-300/70 font-medium">Instructor</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 rounded-lg transition-all">
                            <Bookmark className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-lg transition-all">
                            <Share2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-xl border border-cyan-500/20 group-hover:border-cyan-400 transition-all">
                      <span className="gradient-text-animated font-black text-lg">Explore Course</span>
                      <ChevronRight className="h-6 w-6 text-cyan-400 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-20 slide-up-animation">
                <div className="relative w-40 h-40 mx-auto mb-8 floating-animation">
                  <div className="w-40 h-40 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center neon-glow-border">
                    <Search className="h-20 w-20 text-white" />
                  </div>
                  <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-cyan-500 to-purple-600 opacity-40 rounded-full"></div>
                </div>
                <h3 className="text-5xl font-black gradient-text-animated mb-6">No courses found</h3>
                <p className="text-2xl text-cyan-300 mb-10 max-w-lg mx-auto">Try adjusting your search or filter criteria to discover amazing courses</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLevel('all');
                  }}
                  className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-xl rounded-2xl hover:from-cyan-400 hover:to-purple-500 transform hover:scale-110 hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <div className="xl:col-span-1">
            <RankingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;