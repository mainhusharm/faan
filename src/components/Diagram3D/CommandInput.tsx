import React, { useState, useRef, useEffect } from 'react';
import { Send, Lightbulb, Loader2, CheckCircle2, AlertCircle, History } from 'lucide-react';
import { getCommandSuggestions } from './commandParser';

interface CommandInputProps {
  onCommand: (command: string) => void;
  isProcessing: boolean;
  feedback?: {
    type: 'success' | 'error' | 'info';
    message: string;
  } | null;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  onCommand,
  isProcessing,
  feedback,
}) => {
  const [command, setCommand] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load command history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('3d_command_history');
    if (saved) {
      try {
        setCommandHistory(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load command history:', error);
      }
    }
  }, []);

  // Save command history to localStorage
  const saveHistory = (history: string[]) => {
    try {
      localStorage.setItem('3d_command_history', JSON.stringify(history.slice(-20))); // Keep last 20
    } catch (error) {
      console.error('Failed to save command history:', error);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!command.trim() || isProcessing) return;

    // Add to history
    const newHistory = [...commandHistory, command];
    setCommandHistory(newHistory);
    saveHistory(newHistory);
    setHistoryIndex(-1);

    // Execute command
    onCommand(command);
    setCommand('');
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommand(value);
    
    // Update suggestions
    if (value.length > 0) {
      const newSuggestions = getCommandSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle up/down arrow for command history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCommand(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setShowHelp(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCommand(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const exampleCommands = [
    { command: 'create sphere', description: 'Basic shape' },
    { command: 'make red cube', description: 'Shape with color' },
    { command: 'add blue cylinder', description: 'Shape with color' },
    { command: 'create water molecule', description: 'Molecular structure' },
    { command: 'make large yellow sphere', description: 'Size and color' },
    { command: 'add 3D text "Hello"', description: '3D text object' },
    { command: 'create transparent cube', description: 'Transparent object' },
    { command: 'make metallic sphere', description: 'Metallic material' },
  ];

  return (
    <div className="relative">
      {/* Command Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          {/* Feedback Message */}
          {feedback && (
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                feedback.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : feedback.type === 'error'
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              }`}
            >
              {feedback.type === 'success' && <CheckCircle2 className="h-4 w-4 flex-shrink-0" />}
              {feedback.type === 'error' && <AlertCircle className="h-4 w-4 flex-shrink-0" />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={command}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (command.length > 0) {
                    const newSuggestions = getCommandSuggestions(command);
                    if (newSuggestions.length > 0) {
                      setSuggestions(newSuggestions);
                      setShowSuggestions(true);
                    }
                  }
                }}
                placeholder="Type a command... (e.g., 'create a blue sphere')"
                disabled={isProcessing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Show help"
            >
              <Lightbulb className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (commandHistory.length > 0) {
                  const lastCommand = commandHistory[commandHistory.length - 1];
                  setCommand(lastCommand);
                  inputRef.current?.focus();
                }
              }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Show history"
              disabled={commandHistory.length === 0}
            >
              <History className="h-5 w-5" />
            </button>

            <button
              type="submit"
              disabled={!command.trim() || isProcessing}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Create</span>
                </>
              )}
            </button>
          </div>

          {/* Help Panel */}
          {showHelp && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Example Commands:
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {exampleCommands.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setCommand(example.command);
                      setShowHelp(false);
                      inputRef.current?.focus();
                    }}
                    className="text-left px-3 py-2 rounded bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    <div className="text-sm font-mono text-blue-600 dark:text-blue-400">
                      {example.command}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {example.description}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                💡 Tip: Use ↑↓ arrow keys to browse command history
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
