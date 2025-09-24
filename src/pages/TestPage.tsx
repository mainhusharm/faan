import React, { useState } from 'react';
import RankingSidebar from '../components/Layout/RankingSidebar';
import { TestTube, Clock, Award, Play, CheckCircle, XCircle, Trophy } from 'lucide-react';

interface Test {
  id: string;
  title: string;
  description: string;
  topic: string;
  questions: number;
  duration: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  maxScore: number;
  passingScore: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  points: number;
}

interface TestResult {
  score: number;
  percentage: number;
  passed: boolean;
  timeUsed: number;
}

const TestPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const topics = ['JavaScript', 'React', 'Python', 'CSS', 'HTML', 'Node.js', 'General'];

  const tests: Test[] = [
    {
      id: '1',
      title: 'JavaScript Fundamentals Assessment',
      description: 'Test your knowledge of JavaScript basics including variables, functions, and objects.',
      topic: 'JavaScript',
      questions: 15,
      duration: 20,
      difficulty: 'Beginner',
      maxScore: 100,
      passingScore: 70
    },
    {
      id: '2',
      title: 'React Components & Hooks',
      description: 'Evaluate your understanding of React components, state management, and hooks.',
      topic: 'React',
      questions: 20,
      duration: 30,
      difficulty: 'Intermediate',
      maxScore: 120,
      passingScore: 80
    },
    {
      id: '3',
      title: 'Python Programming Test',
      description: 'Comprehensive test covering Python syntax, data structures, and algorithms.',
      topic: 'Python',
      questions: 25,
      duration: 40,
      difficulty: 'Advanced',
      maxScore: 150,
      passingScore: 90
    },
    {
      id: '4',
      title: 'CSS Layout & Styling',
      description: 'Test your CSS skills including flexbox, grid, and responsive design.',
      topic: 'CSS',
      questions: 18,
      duration: 25,
      difficulty: 'Intermediate',
      maxScore: 110,
      passingScore: 75
    },
    {
      id: '5',
      title: 'HTML5 & Semantic Web',
      description: 'Assessment of modern HTML5 features and semantic markup.',
      topic: 'HTML',
      questions: 12,
      duration: 15,
      difficulty: 'Beginner',
      maxScore: 80,
      passingScore: 60
    },
    {
      id: '6',
      title: 'Node.js Backend Development',
      description: 'Test your knowledge of Node.js, Express, and server-side JavaScript.',
      topic: 'Node.js',
      questions: 22,
      duration: 35,
      difficulty: 'Advanced',
      maxScore: 130,
      passingScore: 85
    },
    {
      id: '7',
      title: 'Full-Stack Web Development',
      description: 'Comprehensive test covering frontend, backend, and database concepts.',
      topic: 'General',
      questions: 30,
      duration: 50,
      difficulty: 'Advanced',
      maxScore: 200,
      passingScore: 120
    }
  ];

  // Mock questions for the test
  const mockQuestions: Question[] = [
    {
      id: '1',
      question: 'What is the correct way to declare a variable in JavaScript?',
      options: ['var myVar = 5;', 'variable myVar = 5;', 'v myVar = 5;', 'declare myVar = 5;'],
      correct_answer: 0,
      points: 5
    },
    {
      id: '2',
      question: 'Which method is used to add an element to the end of an array?',
      options: ['append()', 'push()', 'add()', 'insert()'],
      correct_answer: 1,
      points: 5
    },
    // Add more questions as needed
  ];

  const filteredTests = selectedTopic === 'all' 
    ? tests 
    : tests.filter(test => test.topic === selectedTopic);

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

  const startTest = (test: Test) => {
    setActiveTest(test);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(test.duration * 60); // Convert to seconds
    setTestResult(null);
    setShowResult(false);
  };

  const submitTest = () => {
    if (!activeTest) return;

    // Calculate score
    let score = 0;
    mockQuestions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        score += question.points;
      }
    });

    const percentage = (score / activeTest.maxScore) * 100;
    const passed = score >= activeTest.passingScore;
    const timeUsed = (activeTest.duration * 60) - timeLeft;

    const result: TestResult = {
      score,
      percentage,
      passed,
      timeUsed: Math.floor(timeUsed / 60) // Convert back to minutes
    };

    setTestResult(result);
    setShowResult(true);
  };

  const resetTest = () => {
    setActiveTest(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(0);
    setTestResult(null);
    setShowResult(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Timer effect
  React.useEffect(() => {
    if (activeTest && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && activeTest && !showResult) {
      submitTest();
    }
  }, [timeLeft, activeTest, showResult]);

  if (showResult && testResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  testResult.passed ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {testResult.passed ? (
                    <Trophy className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {testResult.passed ? 'Congratulations!' : 'Keep Learning!'}
                </h1>
                <p className="text-gray-600 mb-8">
                  {testResult.passed 
                    ? 'You have successfully passed the test!' 
                    : 'You need more practice to pass this test.'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{testResult.score}</div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">{testResult.percentage.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Percentage</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{activeTest?.passingScore}</div>
                    <div className="text-sm text-gray-600">Passing Score</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">{testResult.timeUsed}min</div>
                    <div className="text-sm text-gray-600">Time Used</div>
                  </div>
                </div>

                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={resetTest}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Take Another Test
                  </button>
                  {!testResult.passed && (
                    <button
                      onClick={() => startTest(activeTest!)}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      Retry Test
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <RankingSidebar />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTest && !showResult) {
    const currentQuestion = mockQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / activeTest.questions) * 100;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Test Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{activeTest.title}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-orange-600">
                  <Clock className="h-5 w-5" />
                  <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {activeTest.questions}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          {/* Question */}
          {currentQuestion && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQuestion.question}
              </h2>
              
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      answers[currentQuestionIndex] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={index}
                      checked={answers[currentQuestionIndex] === index}
                      onChange={() => setAnswers({ ...answers, [currentQuestionIndex]: index })}
                      className="sr-only"
                    />
                    <span className="flex-1">{option}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {currentQuestionIndex < activeTest.questions - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={submitTest}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <TestTube className="h-8 w-8 text-blue-500" />
                <h1 className="text-3xl font-bold text-gray-900">Skill Tests</h1>
              </div>
              <p className="text-gray-600">
                Evaluate your knowledge and earn certifications with our comprehensive tests
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <TestTube className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Timed Tests</div>
                <div className="text-sm text-gray-600">Real Assessment Conditions</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Certificates</div>
                <div className="text-sm text-gray-600">Earn Upon Passing</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">Rankings</div>
                <div className="text-sm text-gray-600">Compete with Others</div>
              </div>
            </div>

            {/* Topic Filter */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Topic</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTopic('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTopic === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Tests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTests.map((test) => (
                <div key={test.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(test.difficulty)}`}>
                      {test.difficulty}
                    </span>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{test.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TestTube className="h-4 w-4" />
                        <span>{test.questions} questions</span>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{test.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Topic: </span>
                      <span className="font-medium text-blue-600">{test.topic}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Passing: </span>
                      <span className="font-medium text-green-600">{test.passingScore}/{test.maxScore}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => startTest(test)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Start Test</span>
                  </button>
                </div>
              ))}
            </div>

            {filteredTests.length === 0 && (
              <div className="text-center py-12">
                <TestTube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
                <p className="text-gray-600">Try selecting a different topic</p>
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

export default TestPage;