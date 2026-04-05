/**
 * Error Boundary Component
 * 
 * Catches React component errors and logs them to the error service.
 */

import React, { Component, ReactNode } from 'react';
import { errorService } from '../../services/errorService';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to error service
    errorService.logError({
      message: `React Error Boundary: ${error.message}`,
      error,
      context: {
        component: 'ErrorBoundary',
        action: 'componentDidCatch',
        componentStack: errorInfo.componentStack,
      },
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI with Apple Vision Pro aesthetic
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
          <div className="max-w-md mx-auto p-8">
            {/* Glass Card */}
            <div className="relative group">
              {/* Glassmorphism Container */}
              <div className="relative bg-white/[0.03] rounded-[24px] border border-white/[0.08] p-8 shadow-2xl">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="relative z-10 text-center space-y-6">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
                      <div className="relative bg-gradient-to-br from-red-500 to-orange-500 p-4 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-semibold text-white">
                    Etwas ist schief gelaufen
                  </h2>

                  {/* Error Message */}
                  <p className="text-sm text-white/60">
                    {this.state.error?.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      onClick={this.handleReset}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Erneut versuchen
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-white/[0.05] hover:bg-white/[0.08] text-white/80 font-medium rounded-xl transition-all duration-200 border border-white/[0.08]"
                    >
                      App neu laden
                    </button>
                  </div>

                  {/* Developer Info */}
                  <p className="text-xs text-white/40 pt-4">
                    Fehler wurde protokolliert. Drücke Cmd/Ctrl + Shift + E für Details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}