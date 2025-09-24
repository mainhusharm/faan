import React, { useState } from 'react';
import RankingSidebar from '../components/Layout/RankingSidebar';
import { Code, CheckCircle, XCircle, Play, Lightbulb } from 'lucide-react';

interface PracticeQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  question: string;
  code?: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  points: number;
}

const PracticePage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  React.useEffect(() => {
    console.log('PracticePage: Component loaded');
  }, []);

  const topics = ['JavaScript', 'React', 'Python', 'CSS', 'HTML', 'Node.js'];
  
  const practiceQuestions: PracticeQuestion[] = [
    {
      id: '1',
      title: 'Array Methods in JavaScript',
      difficulty: 'Easy',
      topic: 'JavaScript',
      question: 'Which method adds elements to the end of an array?',
      options: ['push()', 'pop()', 'shift()', 'unshift()'],
      correct_answer: 0,
      explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.',
      points: 5
    },
    {
      id: '2',
      title: 'React Component Lifecycle',
      difficulty: 'Medium',
      topic: 'React',
      question: 'Which lifecycle method is called after a component is mounted?',
      options: ['componentWillMount()', 'componentDidMount()', 'componentWillUpdate()', 'componentDidUpdate()'],
      correct_answer: 1,
      explanation: 'componentDidMount() is called immediately after a component is mounted. This is a good place to trigger network requests.',
      points: 10
    },
    {
      id: '3',
      title: 'Python List Comprehension',
      difficulty: 'Hard',
      topic: 'Python',
      question: 'What does this list comprehension return: [x**2 for x in range(5) if x % 2 == 0]',
      code: '[x**2 for x in range(5) if x % 2 == 0]',
      options: ['[0, 4, 16]', '[1, 9]', '[0, 1, 4, 9, 16]', '[2, 4]'],
      correct_answer: 0,
      explanation: 'This creates a list of squares for even numbers from 0 to 4: 0²=0, 2²=4, 4²=16, so [0, 4, 16].',
      points: 15
    },
    {
      id: '4',
      title: 'CSS Flexbox',
      difficulty: 'Medium',
      topic: 'CSS',
      question: 'Which property is used to center items both horizontally and vertically in a flexbox?',
      options: ['align-items: center', 'justify-content: center', 'Both align-items and justify-content set to center', 'text-align: center'],
      correct_answer: 2,
      explanation: 'You need both align-items: center (for vertical) and justify-content: center (for horizontal) to center items in both directions.',
      points: 10
    },
    {
      id: '5',
      title: 'HTML5 Semantic Elements',
      difficulty: 'Easy',
      topic: 'HTML',
      question: 'Which HTML5 element represents the main content of a document?',
      options: ['<main>', '<content>', '<primary>', '<article>'],
      correct_answer: 0,
      explanation: 'The <main> element represents the dominant content of the body of a document.',
      points: 5
    },
    {
      id: '6',
      title: 'Node.js Modules',
      difficulty: 'Hard',
      topic: 'Node.js',
      question: 'What is the difference between require() and import?',
      options: [
        'No difference, they are identical',
        'require() is CommonJS, import is ES6 modules',
        'import is older syntax',
        'require() only works in browser'
      ],
      correct_answer: 1,
      explanation: 'require() is part of CommonJS module system, while import is part of ES6 (ES2015) module syntax.',
      points: 15
    }
  ];

  const [filteredQuestions, setFilteredQuestions] = useState(practiceQuestions);

  const filterQuestions = () => {
    let filtered = practiceQuestions;

    if (selectedTopic !== 'all') {
      filtered = filtered.filter(q => q.topic === selectedTopic);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    setFilteredQuestions(filtered);
  };

  React.useEffect(() => {
    filterQuestions();
  }, [selectedTopic, selectedDifficulty]);

  const startQuestion = (question: PracticeQuestion) => {
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentQuestion) return;

    const correct = selectedAnswer === currentQuestion.correct_answer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const resetQuestion = () => {
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Practice Zone</h1>
              <p className="text-gray-600 dark:text-gray-300">Test your knowledge with hands-on practice questions</p>
            </div>

            {!currentQuestion ? (
              <>
                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-300">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter Questions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topic</label>
                      <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="all">All Topics</option>
                        {topics.map(topic => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="all">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Questions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredQuestions.map((question) => (
                    <div key={question.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">+{question.points} pts</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{question.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{question.topic}</p>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{question.question}</p>
                      <button
                        onClick={() => startQuestion(question)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Start Practice</span>
                      </button>
                    </div>
                  ))}
                </div>

                {filteredQuestions.length === 0 && (
                  <div className="text-center py-12">
                    <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No questions found</h3>
                    <p className="text-gray-600 dark:text-gray-300">Try adjusting your filters</p>
                  </div>
                )}
              </>
            ) : (
              /* Question View */
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(currentQuestion.difficulty)}`}>
                      {currentQuestion.difficulty}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">{currentQuestion.topic}</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">+{currentQuestion.points} pts</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{currentQuestion.title}</h2>
                <p className="text-gray-800 dark:text-gray-300 mb-6">{currentQuestion.question}</p>

                {currentQuestion.code && (
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <code className="text-sm font-mono text-gray-800 dark:text-gray-200">{currentQuestion.code}</code>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      } ${showResult && index === currentQuestion.correct_answer ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''} ${
                        showResult && selectedAnswer === index && index !== currentQuestion.correct_answer
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={index}
                        checked={selectedAnswer === index}
                        onChange={() => setSelectedAnswer(index)}
                        disabled={showResult}
                        className="sr-only"
                      />
                      <span className="flex-1 text-gray-900 dark:text-white">{option}</span>
                      {showResult && index === currentQuestion.correct_answer && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {showResult && selectedAnswer === index && index !== currentQuestion.correct_answer && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </label>
                  ))}
                </div>

                {!showResult ? (
                  <div className="flex space-x-4">
                    <button
                      onClick={submitAnswer}
                      disabled={selectedAnswer === null}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      Submit Answer
                    </button>
                    <button
                      onClick={resetQuestion}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className={`font-medium ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                          {isCorrect ? 'Correct!' : 'Incorrect'}
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Lightbulb className={`h-5 w-5 mt-0.5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`} />
                        <p className={`text-sm ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={resetQuestion}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                      >
                        Try Another Question
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAnswer(null);
                          setShowResult(false);
                          setIsCorrect(false);
                        }}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
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

export default PracticePage;