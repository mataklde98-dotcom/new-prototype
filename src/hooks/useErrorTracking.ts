/**
 * Error Tracking Hook
 * 
 * Provides error tracking functionality for React components.
 */

import { useCallback, useEffect, useState } from 'react';
import type { ErrorContext, ErrorLevel, SystemError } from '../types/error.types';
import { errorService } from '../services/errorService';

export function useErrorTracking(componentName?: string) {
  const [errors, setErrors] = useState<SystemError[]>(() => {
    // Initialize with current errors (runs only once on mount)
    return errorService.getErrors();
  });

  // Subscribe to error updates
  useEffect(() => {
    // Subscribe to updates
    const unsubscribe = errorService.subscribe((updatedErrors) => {
      // Use functional update to avoid stale closures
      setErrors(() => updatedErrors);
    });

    return unsubscribe;
  }, []);

  /**
   * Log an error
   */
  const logError = useCallback(
    (message: string, error?: Error, context?: ErrorContext) => {
      errorService.logError({
        message,
        error,
        context: {
          ...context,
          component: componentName || context?.component,
        },
      });
    },
    [componentName]
  );

  /**
   * Log a warning
   */
  const logWarning = useCallback(
    (message: string, context?: ErrorContext) => {
      errorService.logWarning(message, {
        ...context,
        component: componentName || context?.component,
      });
    },
    [componentName]
  );

  /**
   * Log an info message
   */
  const logInfo = useCallback(
    (message: string, context?: ErrorContext) => {
      errorService.logInfo(message, {
        ...context,
        component: componentName || context?.component,
      });
    },
    [componentName]
  );

  /**
   * Track an async operation
   */
  const trackAsync = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      {
        action,
        onError,
      }: {
        action?: string;
        onError?: (error: Error) => void;
      } = {}
    ): Promise<T | null> => {
      try {
        return await operation();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logError(errorMessage, error instanceof Error ? error : undefined, {
          action,
        });
        onError?.(error instanceof Error ? error : new Error(errorMessage));
        return null;
      }
    },
    [logError]
  );

  /**
   * Create an error boundary for a specific action
   */
  const withErrorBoundary = useCallback(
    <T extends unknown[]>(
      fn: (...args: T) => void,
      action?: string
    ): ((...args: T) => void) => {
      return (...args: T) => {
        try {
          fn(...args);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logError(errorMessage, error instanceof Error ? error : undefined, {
            action,
          });
        }
      };
    },
    [logError]
  );

  return {
    // State
    errors,
    stats: errorService.getStats(),

    // Logging methods
    logError,
    logWarning,
    logInfo,

    // Utilities
    trackAsync,
    withErrorBoundary,

    // Service methods
    clearErrors: errorService.clearErrors.bind(errorService),
    exportErrors: errorService.exportErrors.bind(errorService),
    getErrors: errorService.getErrors.bind(errorService),
  };
}
