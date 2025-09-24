import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Brain, Zap, Target, Trophy, Clock, ArrowRight, Lightbulb, Sparkles, Star, RotateCcw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, onComplete }) => {
  const { isDarkMode } = useTheme();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [streak, setStreak] = useState(0);

  const handleSubmit = useCallback(() => {
    if (selectedAnswer === null) return;

    setIsActive(false);
    const correct = selectedAnswer === quiz.correct_answer;
    setIsCorrect(correct);
    
    // Animate result reveal
    setTimeout(() => {
    setShowResult(true);
      setAnimateResult(true);
    }, 500);

    // Calculate sophisticated scoring
    let score = 0;
    if (correct) {
      score = 15; // Base score
      score += Math.floor((timeLeft / 30) * 10); // Time bonus
      score += confidence > 80 ? 5 : 0; // Confidence bonus
      if (streak > 2) score += 5; // Streak bonus
      setStreak(streak + 1);
    } else {
      score = 3; // Participation points
      setStreak(0);
    }
    
    setTimeout(() => {
    onComplete(score);
    }, 2000);
  }, [selectedAnswer, quiz.correct_answer, timeLeft, confidence, streak, onComplete]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResult) {
      // Auto-submit when time runs out
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, showResult, handleSubmit]);

  // Confidence tracker
  useEffect(() => {
    if (selectedAnswer !== null) {
      const baseConfidence = 25;
      const timeBonus = (timeLeft / 30) * 75;
      setConfidence(Math.min(100, baseConfidence + timeBonus));
    }
  }, [selectedAnswer, timeLeft]);

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setTimeLeft(30);
    setIsActive(true);
    setShowHint(false);
    setAnimateResult(false);
    setConfidence(0);
  };

  const getAIFeedback = () => {
    if (isCorrect) {
      const positiveMessages = [
        { emoji: "🎉", message: "Brilliant! Your understanding is crystal clear!" },
        { emoji: "⚡", message: "Lightning fast! You've mastered this concept!" },
        { emoji: "🧠", message: "Genius level thinking! Keep up the amazing work!" },
        { emoji: "🌟", message: "Stellar performance! You're on fire!" },
        { emoji: "🎯", message: "Bullseye! Perfect accuracy and great timing!" }
      ];
      
      if (timeLeft > 20) {
        return { emoji: "🚀", message: "Incredible speed and accuracy! You're a physics superstar!" };
      } else if (confidence > 80) {
        return { emoji: "💎", message: "Diamond-level confidence! Your knowledge shines bright!" };
      } else {
        return positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
      }
    } else {
      const encouragingMessages = [
        { emoji: "🌱", message: "Great effort! Learning happens through exploration!" },
        { emoji: "🔄", message: "Close one! You're building strong foundations!" },
        { emoji: "💪", message: "Keep pushing! Every attempt makes you stronger!" },
        { emoji: "🎓", message: "Learning moment! You're one step closer to mastery!" },
        { emoji: "✨", message: "Good thinking! Let's refine that understanding!" }
      ];
      return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    }
  };

  const getTimerColor = () => {
    if (timeLeft > 20) return "text-green-500";
    if (timeLeft > 10) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressWidth = () => {
    return (timeLeft / 30) * 100;
  };

  const aiFeedback = getAIFeedback();

  return (
    <div className={`bg-gradient-to-br ${isDarkMode ? 'from-gray-800 to-gray-900' : 'from-blue-50 to-indigo-100'} rounded-xl shadow-lg overflow-hidden transition-colors duration-300`}>
      {/* Header with AI Branding */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">AI Knowledge Check</h3>
              <p className="text-blue-100 text-sm">Powered by Fusioned AI ✨</p>
            </div>
          </div>
          
          {/* Timer and Stats */}
          <div className="flex items-center space-x-4">
            {streak > 0 && (
              <div className="flex items-center space-x-1 bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-full">
                <Trophy className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-medium">{streak} 🔥</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Clock className={`h-5 w-5 ${getTimerColor()}`} />
              <span className={`font-mono text-lg font-bold ${getTimerColor()}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>
        
        {/* Timer Progress Bar */}
        <div className="mt-4 w-full bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeLeft > 20 ? 'bg-green-400' : timeLeft > 10 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${getProgressWidth()}%` }}
          />
        </div>
      </div>

      <div className="p-6">
        {/* Question */}
        <div className="mb-6">
          <div className="flex items-start space-x-3 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Challenge Question</h4>
              <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-lg leading-relaxed`}>{quiz.question}</p>
            </div>
          </div>
          
          {/* Confidence Meter */}
          {selectedAnswer !== null && !showResult && (
            <div className="mt-4 p-3 bg-white rounded-lg border-2 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">AI Confidence Analysis</span>
                <span className="text-sm font-bold text-blue-600">{confidence.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {quiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && setSelectedAnswer(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                selectedAnswer === index && !showResult
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              } ${
                showResult && index === quiz.correct_answer 
                  ? 'border-green-500 bg-green-50 animate-pulse' 
                  : ''
              } ${
                showResult && selectedAnswer === index && index !== quiz.correct_answer
                  ? 'border-red-500 bg-red-50'
                  : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                  selectedAnswer === index && !showResult
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : showResult && index === quiz.correct_answer
                    ? 'border-green-500 bg-green-500 text-white'
                    : showResult && selectedAnswer === index && index !== quiz.correct_answer
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1 text-gray-800 font-medium">{option}</span>
                
              {showResult && index === quiz.correct_answer && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="text-green-600 font-bold text-sm">Correct!</span>
                  </div>
              )}
              {showResult && selectedAnswer === index && index !== quiz.correct_answer && (
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-6 w-6 text-red-500" />
                    <span className="text-red-600 font-bold text-sm">Incorrect</span>
                  </div>
              )}
              </div>
            </button>
          ))}
        </div>

        {/* Hint Button */}
        {!showResult && timeLeft < 15 && !showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="mb-4 flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 font-medium"
          >
            <Lightbulb className="h-5 w-5" />
            <span>Need a hint? 💡</span>
          </button>
        )}

        {/* Hint Display */}
        {showHint && !showResult && (
          <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">AI Hint</span>
            </div>
            <p className="text-yellow-700">Think about the fundamental principles we just learned in the video. What would Newton say? 🤔</p>
      </div>
        )}

        {/* Action Buttons */}
      {!showResult ? (
          <div className="flex space-x-3">
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Submit Answer</span>
                <ArrowRight className="h-5 w-5" />
              </div>
        </button>
          </div>
        ) : (
          /* Results Section */
          <div className={`space-y-4 ${animateResult ? 'animate-fadeIn' : ''}`}>
            {/* AI Feedback */}
            <div className={`p-6 rounded-xl border-2 ${
              isCorrect 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
            }`}>
              <div className="flex items-start space-x-4">
                <div className={`text-4xl ${isCorrect ? 'animate-bounce' : 'animate-pulse'}`}>
                  {aiFeedback.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <Brain className={`h-6 w-6 ${isCorrect ? 'text-green-600' : 'text-blue-600'}`} />
                    <span className={`font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-blue-800'}`}>
                      AI Analysis
              </span>
                  </div>
                  <p className={`text-lg font-medium mb-3 ${isCorrect ? 'text-green-700' : 'text-blue-700'}`}>
                    {aiFeedback.message}
                  </p>
                  <div className="bg-white bg-opacity-60 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">📚 Explanation:</h5>
                    <p className="text-gray-700">{quiz.explanation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-md">
                <div className="text-2xl font-bold text-blue-600">{timeLeft}s</div>
                <div className="text-sm text-gray-600">Time Left</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-md">
                <div className="text-2xl font-bold text-purple-600">{confidence.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-2xl font-bold text-yellow-600">
                    {isCorrect ? (15 + Math.floor((timeLeft / 30) * 10) + (confidence > 80 ? 5 : 0)) : 3}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
          </div>
          
          <button
            onClick={handleReset}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
              <div className="flex items-center justify-center space-x-2">
                <RotateCcw className="h-5 w-5" />
                <span>Try Another Question</span>
              </div>
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default QuizComponent;