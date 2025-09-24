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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-6">
                      <div className="h-32 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-all duration-500">
      <div className="max-w-8xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          <div className="xl:col-span-3">
            {/* Header Section */}
            <div className="mb-12 animate-fadeInUp">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 gradient-primary rounded-2xl">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white">Core STEM Courses</h1>
                  <p className="text-2xl text-slate-600 dark:text-gray-300 mt-2">Master Physics, Chemistry, Mathematics, Biology, and Engineering with AI-powered visualizations</p>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="card mb-12 animate-fadeInUp">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 relative">
                  <Search className="h-6 w-6 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search STEM courses, subjects, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-12 text-lg"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="input text-lg min-w-[200px]"
                  >
                    <option value="all">All Levels</option>
                    <option value="Foundation">Foundation</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <button className="btn-primary flex items-center text-lg px-8 py-3">
                    <Filter className="h-5 w-5 mr-3" />
                    Filter
                  </button>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="card-hover animate-fadeInUp group"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="relative overflow-hidden rounded-2xl mb-6">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 glass rounded-2xl px-4 py-2 text-white text-sm font-semibold">
                      {course.level}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                        <Play className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:gradient-text transition-all duration-300">
                        {course.title}
                      </h3>
                      <p className="text-slate-600 dark:text-gray-300 text-lg leading-relaxed line-clamp-3">
                        {course.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-slate-600 dark:text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{course.instructor}</div>
                            <div className="text-sm text-slate-500">Instructor</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <Bookmark className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <Share2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <span className="gradient-text font-bold text-lg">View Course</span>
                      <ChevronRight className="h-6 w-6 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-20 animate-fadeInUp">
                <div className="w-32 h-32 gradient-primary rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">No courses found</h3>
                <p className="text-xl text-slate-600 dark:text-gray-300 mb-8">Try adjusting your search or filter criteria</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLevel('all');
                  }}
                  className="btn-primary text-lg px-8 py-4"
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