/**
 * System Error Service
 * 
 * Centralized error tracking and logging service.
 * Stores errors in localStorage for persistence across sessions.
 */

import type { ErrorContext, ErrorLevel, ErrorStats, SystemError } from '../types/error.types';

const ERROR_STORAGE_KEY = 'sostudy_system_errors';
const MAX_ERRORS = 100;

class ErrorService {
  private errors: SystemError[] = [];
  private listeners: Set<(errors: SystemError[]) => void> = new Set();

  constructor() {
    this.loadErrors();
    this.setupGlobalErrorHandler();
  }

  /**
   * Load errors from localStorage
   */
  private loadErrors(): void {
    try {
      const stored = localStorage.getItem(ERROR_STORAGE_KEY);
      if (stored) {
        this.errors = JSON.parse(stored);
        // Keep only recent errors
        if (this.errors.length > MAX_ERRORS) {
          this.errors = this.errors.slice(-MAX_ERRORS);
          this.saveErrors();
        }
      }
    } catch (error) {
      console.error('Failed to load error history:', error);
      this.errors = [];
    }
  }

  /**
   * Save errors to localStorage
   */
  private saveErrors(): void {
    try {
      localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(this.errors));
    } catch (error) {
      console.error('Failed to save error history:', error);
    }
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandler(): void {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        error: event.error,
        context: {
          component: 'GlobalErrorHandler',
          action: 'uncaughtError',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        error: event.reason instanceof Error ? event.reason : undefined,
        context: {
          component: 'GlobalErrorHandler',
          action: 'unhandledRejection',
        },
      });
    });
  }

  /**
   * Log an error
   */
  logError({
    message,
    error,
    context,
    level = 'error',
  }: {
    message: string;
    error?: Error;
    context?: ErrorContext;
    level?: ErrorLevel;
  }): void {
    const systemError: SystemError = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      level,
      message,
      stack: error?.stack,
      context: {
        ...context,
        route: window.location.pathname,
        userAgent: navigator.userAgent,
      },
      error: error ? {
        name: error.name,
        message: error.message,
      } as Error : undefined,
    };

    this.errors.push(systemError);

    // Keep only last MAX_ERRORS
    if (this.errors.length > MAX_ERRORS) {
      this.errors = this.errors.slice(-MAX_ERRORS);
    }

    this.saveErrors();
    this.notifyListeners();

    // Console output with colors
    const styles: Record<ErrorLevel, string> = {
      error: 'color: #ef4444; font-weight: bold;',
      warning: 'color: #f59e0b; font-weight: bold;',
      info: 'color: #3b82f6; font-weight: bold;',
    };

    console.groupCollapsed(
      `%c[SoStudy ${level.toUpperCase()}] ${message}`,
      styles[level]
    );
    if (context) {
      console.log('Context:', context);
    }
    if (error) {
      console.error('Error:', error);
    }
    if (error?.stack) {
      console.log('Stack:', error.stack);
    }
    console.groupEnd();
  }

  /**
   * Log a warning
   */
  logWarning(message: string, context?: ErrorContext): void {
    this.logError({ message, context, level: 'warning' });
  }

  /**
   * Log an info message
   */
  logInfo(message: string, context?: ErrorContext): void {
    this.logError({ message, context, level: 'info' });
  }

  /**
   * Get all errors
   */
  getErrors(): SystemError[] {
    return [...this.errors];
  }

  /**
   * Get errors by level
   */
  getErrorsByLevel(level: ErrorLevel): SystemError[] {
    return this.errors.filter((error) => error.level === level);
  }

  /**
   * Get error statistics
   */
  getStats(): ErrorStats {
    const errors = this.errors.filter((e) => e.level === 'error');
    const warnings = this.errors.filter((e) => e.level === 'warning');
    const info = this.errors.filter((e) => e.level === 'info');

    return {
      total: this.errors.length,
      errors: errors.length,
      warnings: warnings.length,
      info: info.length,
      lastError: this.errors[this.errors.length - 1],
    };
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors = [];
    this.saveErrors();
    this.notifyListeners();
    console.log('%c[SoStudy] Error history cleared', 'color: #10b981; font-weight: bold;');
  }

  /**
   * Export errors as JSON
   */
  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }

  /**
   * Subscribe to error updates
   */
  subscribe(listener: (errors: SystemError[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener([...this.errors]));
  }
}

// Singleton instance
export const errorService = new ErrorService();

// Export for testing
export { ErrorService };
