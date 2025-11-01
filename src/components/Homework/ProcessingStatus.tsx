import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ProcessingStatusProps {
  status: 'uploading' | 'analyzing' | 'generating' | 'completed' | 'error';
  error?: string;
}

const educationalTips = [
  "Did you know? Breaking down complex problems into smaller steps makes them easier to solve!",
  "Pro tip: Always read the problem twice before attempting to solve it.",
  "Remember: Understanding why a solution works is more important than just getting the answer.",
  "Study tip: Practice similar problems to reinforce your understanding.",
  "Learning fact: Making mistakes is an essential part of the learning process!",
  "Quick tip: Draw diagrams or visual representations to understand problems better.",
  "Study hack: Teach the concept to someone else to solidify your understanding.",
  "Remember: Every expert was once a beginner. Keep practicing!",
];

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status, error }) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (status !== 'completed' && status !== 'error') {
      const interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % educationalTips.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const getStatusConfig = () => {
    switch (status) {
      case 'uploading':
        return {
          icon: Loader2,
          text: 'Uploading image...',
          color: 'text-indigo-600 dark:text-indigo-400',
          bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
        };
      case 'analyzing':
        return {
          icon: Loader2,
          text: 'Reading and analyzing problem...',
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        };
      case 'generating':
        return {
          icon: Loader2,
          text: 'Generating detailed explanation...',
          color: 'text-emerald-600 dark:text-emerald-400',
          bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
        };
      case 'completed':
        return {
          icon: CheckCircle,
          text: 'Solution ready!',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: error || 'An error occurred',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
        };
      default:
        return {
          icon: Loader2,
          text: 'Processing...',
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-900/30',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`${config.bgColor} rounded-2xl p-8 text-center space-y-6`}>
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className={`absolute -inset-2 ${config.bgColor} rounded-full blur-xl opacity-50 ${status !== 'completed' && status !== 'error' ? 'animate-pulse' : ''}`} />
            <div className={`relative ${config.bgColor} p-6 rounded-full`}>
              <Icon className={`h-12 w-12 ${config.color} ${status !== 'completed' && status !== 'error' ? 'animate-spin' : ''}`} />
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div>
          <h3 className={`text-xl font-bold ${config.color} mb-2`}>
            {config.text}
          </h3>
          {status !== 'completed' && status !== 'error' && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This usually takes 10-30 seconds
            </p>
          )}
        </div>

        {/* Educational Tip */}
        {status !== 'completed' && status !== 'error' && (
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
              💡 {educationalTips[tipIndex]}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        {status !== 'completed' && status !== 'error' && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 rounded-full transition-all duration-1000 animate-pulse`}
                style={{
                  width: status === 'uploading' ? '33%' : status === 'analyzing' ? '66%' : '90%'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingStatus;
