/**
 * System Error Tracking Types
 */

export type ErrorLevel = 'error' | 'warning' | 'info';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  route?: string;
  [key: string]: unknown;
}

export interface SystemError {
  id: string;
  timestamp: number;
  level: ErrorLevel;
  message: string;
  stack?: string;
  context?: ErrorContext;
  error?: Error;
}

export interface ErrorStats {
  total: number;
  errors: number;
  warnings: number;
  info: number;
  lastError?: SystemError;
}
