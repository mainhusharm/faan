import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Something went wrong
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  The application encountered an error
                </p>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                Error Details:
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 font-mono break-all">
                {this.state.error?.toString()}
              </p>
            </div>

            {this.state.errorInfo && (
              <details className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  Stack Trace
                </summary>
                <pre className="text-xs text-gray-600 dark:text-gray-400 mt-2 overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
