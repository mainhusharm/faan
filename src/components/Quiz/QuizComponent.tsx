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
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300 border border-slate-700/50">
      {/* Header with AI Branding */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl ring-2 ring-white/30 shadow-lg">
              <Brain className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">AI Knowledge Check</h3>
              <p className="text-cyan-100 text-sm font-medium mt-1">Powered by Fusioned AI ✨</p>
            </div>
          </div>
          
          {/* Timer and Stats */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {streak > 0 && (
              <div className="flex items-center space-x-2 bg-yellow-400/20 backdrop-blur-xl px-4 py-2 rounded-xl ring-2 ring-yellow-300/30 shadow-lg">
                <Trophy className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-bold">{streak} 🔥</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-xl ring-2 ring-white/30 shadow-lg">
              <Clock className={`h-5 w-5 ${getTimerColor()}`} />
              <span className={`font-mono text-xl font-bold ${getTimerColor()}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>
        
        {/* Timer Progress Bar */}
        <div className="mt-6 w-full bg-white/20 backdrop-blur-sm rounded-full h-2.5 overflow-hidden shadow-inner relative">
          <div 
            className={`h-full rounded-full transition-all duration-1000 shadow-lg ${
              timeLeft > 20 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : timeLeft > 10 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
            }`}
            style={{ width: `${getProgressWidth()}%` }}
          />
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Question */}
        <div className="mb-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white mb-3">Challenge Question</h4>
              <p className="text-slate-200 text-lg leading-relaxed">{quiz.question}</p>
            </div>
          </div>
          
          {/* Confidence Meter */}
          {selectedAnswer !== null && !showResult && (
            <div className="mt-6 p-5 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl border border-blue-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-400" />
                  AI Confidence Analysis
                </span>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{confidence.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-900/50 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className="space-y-4 mb-8">
          {quiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && setSelectedAnswer(index)}
              disabled={showResult}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
                selectedAnswer === index && !showResult
                  ? 'border-blue-500 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 shadow-lg shadow-blue-500/20 backdrop-blur-xl'
                  : 'border-slate-600/50 hover:border-slate-500 bg-slate-800/50 backdrop-blur-xl'
              } ${
                showResult && index === quiz.correct_answer 
                  ? 'border-green-500 bg-gradient-to-r from-green-500/20 to-emerald-500/20 shadow-lg shadow-green-500/20 animate-pulse' 
                  : ''
              } ${
                showResult && selectedAnswer === index && index !== quiz.correct_answer
                  ? 'border-red-500 bg-gradient-to-r from-red-500/20 to-pink-500/20 shadow-lg shadow-red-500/20'
                  : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-base shadow-lg transition-all ${
                  selectedAnswer === index && !showResult
                    ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-blue-500/50'
                    : showResult && index === quiz.correct_answer
                    ? 'border-green-500 bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-green-500/50'
                    : showResult && selectedAnswer === index && index !== quiz.correct_answer
                    ? 'border-red-500 bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-red-500/50'
                    : 'border-slate-600 text-slate-400 bg-slate-700/50'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1 text-slate-100 font-medium text-base">{option}</span>
                
              {showResult && index === quiz.correct_answer && (
                  <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1.5 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-bold text-sm">Correct!</span>
                  </div>
              )}
              {showResult && selectedAnswer === index && index !== quiz.correct_answer && (
                  <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1.5 rounded-xl">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <span className="text-red-400 font-bold text-sm">Incorrect</span>
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
            className="mb-6 flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 font-semibold transition-all hover:scale-105 bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/30"
          >
            <Lightbulb className="h-5 w-5" />
            <span>Need a hint? 💡</span>
          </button>
        )}

        {/* Hint Display */}
        {showHint && !showResult && (
          <div className="mb-6 p-5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30 rounded-2xl backdrop-blur-xl shadow-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="font-bold text-yellow-300">AI Hint</span>
            </div>
            <p className="text-slate-200">Think about the fundamental principles we just learned in the video. What would Newton say? 🤔</p>
      </div>
        )}

        {/* Action Buttons */}
      {!showResult ? (
          <div className="flex space-x-3">
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
              className="flex-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 disabled:from-slate-700 disabled:to-slate-800 disabled:opacity-50 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-blue-500/50"
            >
              <div className="flex items-center justify-center space-x-3">
                <Zap className="h-6 w-6" />
                <span className="text-lg">Submit Answer</span>
                <ArrowRight className="h-6 w-6" />
              </div>
        </button>
          </div>
        ) : (
          /* Results Section */
          <div className={`space-y-6 ${animateResult ? 'animate-fadeIn' : ''}`}>
            {/* AI Feedback */}
            <div className={`p-6 sm:p-8 rounded-2xl border-2 shadow-xl backdrop-blur-xl ${
              isCorrect 
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50' 
                : 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/50'
            }`}>
              <div className="flex items-start space-x-5">
                <div className={`text-5xl ${isCorrect ? 'animate-bounce' : 'animate-pulse'}`}>
                  {aiFeedback.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <Brain className={`h-7 w-7 ${isCorrect ? 'text-green-400' : 'text-blue-400'}`} />
                    <span className={`font-bold text-xl ${isCorrect ? 'text-green-300' : 'text-blue-300'}`}>
                      AI Analysis
              </span>
                  </div>
                  <p className={`text-lg font-semibold mb-5 ${isCorrect ? 'text-green-200' : 'text-blue-200'}`}>
                    {aiFeedback.message}
                  </p>
                  <div className="bg-slate-800/60 backdrop-blur-xl p-5 rounded-xl border border-slate-700/50 shadow-inner">
                    <h5 className="font-bold text-slate-200 mb-3 flex items-center gap-2">
                      <span className="text-2xl">📚</span>
                      Explanation:
                    </h5>
                    <p className="text-slate-300 leading-relaxed">{quiz.explanation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-5 bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-600/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{timeLeft}s</div>
                <div className="text-sm text-slate-400 font-medium mt-2">Time Left</div>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-600/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{confidence.toFixed(0)}%</div>
                <div className="text-sm text-slate-400 font-medium mt-2">Confidence</div>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-600/50">
                <div className="flex items-center justify-center space-x-2">
                  <Star className="h-6 w-6 text-yellow-400 fill-current" />
                  <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {isCorrect ? (15 + Math.floor((timeLeft / 30) * 10) + (confidence > 80 ? 5 : 0)) : 3}
                  </span>
                </div>
                <div className="text-sm text-slate-400 font-medium mt-2">Points Earned</div>
              </div>
          </div>
          
          <button
            onClick={handleReset}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-slate-600/50"
          >
              <div className="flex items-center justify-center space-x-3">
                <RotateCcw className="h-6 w-6" />
                <span className="text-lg">Try Another Question</span>
              </div>
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default QuizComponent;