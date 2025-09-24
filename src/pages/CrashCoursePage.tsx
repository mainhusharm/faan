import React, { useState } from 'react';
import RankingSidebar from '../components/Layout/RankingSidebar';
import { Zap, Clock, Play, CheckCircle, Book, Target } from 'lucide-react';

interface CrashCourse {
  id: string;
  title: string;
  description: string;
  topic: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  lessons: number;
  points: number;
}

const CrashCoursePage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<CrashCourse | null>(null);

  React.useEffect(() => {
    console.log('CrashCoursePage: Component loaded');
  }, []);

  const topics = ['JavaScript', 'React', 'Python', 'CSS', 'HTML', 'Node.js', 'Data Science'];

  const crashCourses: CrashCourse[] = [
    {
      id: '1',
      title: 'JavaScript Fundamentals in 2 Hours',
      description: 'Master the core concepts of JavaScript including variables, functions, objects, and DOM manipulation.',
      topic: 'JavaScript',
      duration: '2 hours',
      difficulty: 'Beginner',
      thumbnail: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=400',
      lessons: 8,
      points: 50
    },
    {
      id: '2',
      title: 'React Hooks Crash Course',
      description: 'Learn useState, useEffect, useContext, and custom hooks with practical examples.',
      topic: 'React',
      duration: '90 minutes',
      difficulty: 'Intermediate',
      thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
      lessons: 6,
      points: 60
    },
    {
      id: '3',
      title: 'Python for Beginners',
      description: 'Start programming with Python - syntax, data types, loops, and functions explained simply.',
      topic: 'Python',
      duration: '3 hours',
      difficulty: 'Beginner',
      thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
      lessons: 12,
      points: 75
    },
    {
      id: '4',
      title: 'CSS Grid & Flexbox Mastery',
      description: 'Modern CSS layout techniques for responsive web design.',
      topic: 'CSS',
      duration: '2.5 hours',
      difficulty: 'Intermediate',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      lessons: 10,
      points: 65
    },
    {
      id: '5',
      title: 'HTML5 Semantic Elements',
      description: 'Build accessible and SEO-friendly websites with modern HTML5.',
      topic: 'HTML',
      duration: '1.5 hours',
      difficulty: 'Beginner',
      thumbnail: 'https://images.pexels.com/photos/270632/pexels-photo-270632.jpeg?auto=compress&cs=tinysrgb&w=400',
      lessons: 5,
      points: 40
    },
    {
      id: '6',
      title: 'Node.js API Development',
      description: 'Build REST APIs with Express.js, middleware, and database integration.',
      topic: 'Node.js',
      duration: '4 hours',
      difficulty: 'Advanced',
      thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
      lessons: 15,
      points: 100
    },
    {
      id: '7',
      title: 'Data Science with Python',
      description: 'NumPy, Pandas, and Matplotlib basics for data analysis and visualization.',
      topic: 'Data Science',
      duration: '5 hours',
      difficulty: 'Advanced',
      thumbnail: 'https://images.pexels.com/photos/590011/pexels-photo-590011.jpeg?auto=compress&cs=tinysrgb&w=400',
      lessons: 18,
      points: 120
    }
  ];

  const filteredCourses = selectedTopic === 'all' 
    ? crashCourses 
    : crashCourses.filter(course => course.topic === selectedTopic);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartCourse = (course: CrashCourse) => {
    setSelectedCourse(course);
    // In a real app, this would navigate to the course content
    console.log('Starting crash course:', course.title);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="h-8 w-8 text-orange-500" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Crash Courses</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Intensive, focused learning experiences designed to teach you specific skills quickly
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors duration-300">
                <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">2-5 Hours</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Average Duration</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors duration-300">
                <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Focused</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Single Topic Deep Dive</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors duration-300">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">Practical</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Hands-on Learning</div>
              </div>
            </div>

            {/* Topic Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter by Topic</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTopic('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTopic === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  All Topics
                </button>
                {topics.map(topic => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedTopic === topic
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Book className="h-4 w-4" />
                          <span>{course.lessons} lessons</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{course.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Topic: </span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">{course.topic}</span>
                      </div>
                      <span className="text-orange-600 dark:text-orange-400 font-semibold">+{course.points} pts</span>
                    </div>
                    
                    <button
                      onClick={() => handleStartCourse(course)}
                      className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start Crash Course</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
                <p className="text-gray-600 dark:text-gray-300">Try selecting a different topic</p>
              </div>
            )}

            {/* Course Preview Modal */}
            {selectedCourse && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCourse.title}</h2>
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <span className="text-2xl">×</span>
                      </button>
                    </div>
                    
                    <img
                      src={selectedCourse.thumbnail}
                      alt={selectedCourse.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-orange-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{selectedCourse.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Book className="h-5 w-5 text-blue-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{selectedCourse.lessons} lessons</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-green-500" />
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(selectedCourse.difficulty)}`}>
                          {selectedCourse.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-purple-500" />
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">+{selectedCourse.points} pts</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-6">{selectedCourse.description}</p>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={() => {
                          // Navigate to actual course content
                          console.log('Starting course:', selectedCourse.id);
                          setSelectedCourse(null);
                        }}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Start Now</span>
                      </button>
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Maybe Later
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <RankingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrashCoursePage;