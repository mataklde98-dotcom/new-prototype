// ==================== EVALUATE EXAM HOOK ====================
// React Query Hook für Exam Evaluation
// Nutzt Mock-Daten als Fallback wenn API nicht verfügbar

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { evaluateExam as apiEvaluateExam } from '../services/examSimulationApi';
import { mockEvaluateExam, isMockEnabled } from '../mocks/examSimulationMocks';
import type {
  EvaluateExamRequest,
  EvaluateExamResponse,
} from '../services/examSimulationTypes';

// ==================== HOOK OPTIONS ====================

interface UseEvaluateExamOptions {
  onSuccess?: (data: EvaluateExamResponse) => void;
  onError?: (error: Error) => void;
  useMock?: boolean; // Force mock mode
}

// ==================== HOOK ====================

/**
 * Hook to evaluate a completed exam
 * 
 * Usage:
 * ```tsx
 * const { mutate: evaluateExam, isPending, isError, data } = useEvaluateExam({
 *   onSuccess: (response) => {
 *     console.log('Exam evaluated:', response);
 *     // Show results screen with grade, feedback, etc.
 *   },
 *   onError: (error) => {
 *     console.error('Error evaluating exam:', error);
 *   }
 * });
 * 
 * // Trigger exam evaluation
 * evaluateExam({
 *   userId: 'user123',
 *   exam: {
 *     id: 'exam123',
 *     questions: [...]
 *   },
 *   answers: {
 *     'q1': 2,
 *     'q2': 'Berlin',
 *     'q3': 'Long answer text...'
 *   },
 *   timeSpent: 1847 // seconds
 * });
 * ```
 */
export const useEvaluateExam = (
  options: UseEvaluateExamOptions = {}
): UseMutationResult<EvaluateExamResponse, Error, EvaluateExamRequest> => {
  const { onSuccess, onError, useMock } = options;

  return useMutation<EvaluateExamResponse, Error, EvaluateExamRequest>({
    mutationFn: async (request: EvaluateExamRequest) => {
      console.log('🔄 useEvaluateExam: Starting exam evaluation...', request);

      // Determine if we should use mock
      const shouldUseMock = useMock ?? isMockEnabled();

      if (shouldUseMock) {
        console.log('🎭 useEvaluateExam: Using MOCK API');
        return mockEvaluateExam(request);
      }

      console.log('🌐 useEvaluateExam: Using REAL API');
      
      try {
        return await apiEvaluateExam(request);
      } catch (error) {
        // Fallback to mocks if API is unavailable (503 or DNS error)
        console.warn('⚠️ Real API failed, falling back to mocks:', error);
        console.log('🎭 useEvaluateExam: Fallback to MOCK API');
        return mockEvaluateExam(request);
      }
    },
    onSuccess: (data) => {
      console.log('✅ useEvaluateExam: Success!', data);
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error('❌ useEvaluateExam: Error!', error);
      onError?.(error);
    },
    // Retry configuration
    retry: 2, // Retry 2 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

// ==================== HOOK RETURN TYPE ====================

export type UseEvaluateExamReturn = ReturnType<typeof useEvaluateExam>;
