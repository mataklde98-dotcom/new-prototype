/**
 * Error Tracking Demo Component
 * 
 * Demo component to test the error tracking system.
 * Add this to your app temporarily to test error tracking.
 * 
 * Usage:
 * import { ErrorTrackingDemo } from '@/app/components/ErrorTrackingDemo';
 * 
 * Then add <ErrorTrackingDemo /> anywhere in your app.
 */

import { useErrorTracking } from '@/hooks/useErrorTracking';
import { AlertTriangle, AlertCircle, Info, Bug, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function ErrorTrackingDemo() {
  const { logError, logWarning, logInfo, trackAsync, stats } = useErrorTracking('ErrorTrackingDemo');

  const triggerError = () => {
    logError(
      'This is a test error',
      new Error('Test error from demo component'),
      {
        action: 'triggerError',
        demo: true,
      }
    );
    toast.error('Test error logged');
  };

  const triggerWarning = () => {
    logWarning('This is a test warning', {
      action: 'triggerWarning',
      demo: true,
    });
    toast.warning('Test warning logged');
  };

  const triggerInfo = () => {
    logInfo('This is a test info message', {
      action: 'triggerInfo',
      demo: true,
    });
    toast.info('Test info logged');
  };

  const triggerUncaughtError = () => {
    // This will be caught by the global error handler
    setTimeout(() => {
      throw new Error('Uncaught test error');
    }, 100);
    toast.info('Uncaught error will be thrown in 100ms');
  };

  const triggerUnhandledRejection = () => {
    // This will be caught by the global rejection handler
    Promise.reject('Unhandled promise rejection');
    toast.info('Unhandled rejection triggered');
  };

  const triggerAsyncError = async () => {
    await trackAsync(
      async () => {
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 500));
        throw new Error('Async operation failed');
      },
      {
        action: 'triggerAsyncError',
        onError: (error) => {
          toast.error('Async error tracked');
        },
      }
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9998]">
      {/* Collapsible Panel */}
      <div className="relative group">
        {/* Glassmorphism Container */}
        <div className="bg-[#0A0A0A]/95 rounded-[20px] border border-white/[0.08] shadow-2xl p-4 space-y-3 w-[300px]">
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
              <Bug className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">Error Tracking Demo</h3>
              <p className="text-xs text-white/40">Test the error system</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pb-3 border-b border-white/[0.08]">
            <div className="text-center">
              <div className="text-lg font-bold text-red-500">{stats.errors}</div>
              <div className="text-xs text-white/40">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-500">{stats.warnings}</div>
              <div className="text-xs text-white/40">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{stats.info}</div>
              <div className="text-xs text-white/40">Info</div>
            </div>
          </div>

          {/* Trigger Buttons */}
          <div className="space-y-2">
            <button
              onClick={triggerError}
              className="w-full flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Trigger Error
            </button>

            <button
              onClick={triggerWarning}
              className="w-full flex items-center gap-2 px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm font-medium transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              Trigger Warning
            </button>

            <button
              onClick={triggerInfo}
              className="w-full flex items-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-blue-400 text-sm font-medium transition-colors"
            >
              <Info className="w-4 h-4" />
              Trigger Info
            </button>

            <button
              onClick={triggerAsyncError}
              className="w-full flex items-center gap-2 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-400 text-sm font-medium transition-colors"
            >
              <Zap className="w-4 h-4" />
              Trigger Async Error
            </button>

            <button
              onClick={triggerUncaughtError}
              className="w-full flex items-center gap-2 px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg text-orange-400 text-sm font-medium transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Uncaught Error
            </button>

            <button
              onClick={triggerUnhandledRejection}
              className="w-full flex items-center gap-2 px-3 py-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 rounded-lg text-pink-400 text-sm font-medium transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              Unhandled Rejection
            </button>
          </div>

          {/* Help Text */}
          <div className="pt-3 border-t border-white/[0.08]">
            <p className="text-xs text-white/40 text-center">
              Press <kbd className="px-2 py-0.5 bg-white/[0.05] rounded text-white/60">Cmd/Ctrl + Shift + E</kbd> to open console
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
