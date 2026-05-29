// ==================== GENERATE EXAM HOOK ====================
// React Query Hook für Exam Generation
// Nutzt Mock-Daten als Fallback wenn API nicht verfügbar

import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { generateExam as apiGenerateExam } from '../services/examSimulationApi';
import { mockGenerateExam, isMockEnabled } from '../mocks/examSimulationMocks';
import type {
  GenerateExamRequest,
  GenerateExamResponse,
} from '../services/examSimulationTypes';

// ==================== HOOK OPTIONS ====================

interface UseGenerateExamOptions {
  onSuccess?: (data: GenerateExamResponse) => void;
  onError?: (error: Error) => void;
  useMock?: boolean; // Force mock mode
}

// ==================== HOOK ====================

/**
 * Hook to generate a new exam
 * 
 * Usage:
 * ```tsx
 * const { mutate: generateExam, isPending, isError, data } = useGenerateExam({
 *   onSuccess: (response) => {
 *     console.log('Exam generated:', response);
 *     // Save exam to store, navigate to quiz screen, etc.
 *   },
 *   onError: (error) => {
 *     console.error('Error generating exam:', error);
 *   }
 * });
 * 
 * // Trigger exam generation
 * generateExam({
 *   userId: 'user123',
 *   subject: 'Mathematik',
 *   topic: 'Quadratische Gleichungen',
 *   examDuration: 10 // minutes
 * });
 * ```
 */
export const useGenerateExam = (
  options: UseGenerateExamOptions = {}
): UseMutationResult<GenerateExamResponse, Error, GenerateExamRequest> => {
  const { onSuccess, onError, useMock } = options;

  return useMutation<GenerateExamResponse, Error, GenerateExamRequest>({
    mutationFn: async (request: GenerateExamRequest) => {
      console.log('🔄 useGenerateExam: Starting exam generation...', request);

      // Determine if we should use mock
      const shouldUseMock = useMock ?? isMockEnabled();

      if (shouldUseMock) {
        console.log('🎭 useGenerateExam: Using MOCK API');
        return mockGenerateExam(request);
      }

      console.log('🌐 useGenerateExam: Using REAL API');
      
      try {
        return await apiGenerateExam(request);
      } catch (error) {
        // Fallback to mocks if API is unavailable (503 or DNS error)
        console.warn('⚠️ Real API failed, falling back to mocks:', error);
        console.log('🎭 useGenerateExam: Fallback to MOCK API');
        return mockGenerateExam(request);
      }
    },
    onSuccess: (data) => {
      console.log('✅ useGenerateExam: Success!', data);
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error('❌ useGenerateExam: Error!', error);
      onError?.(error);
    },
    // Retry configuration
    retry: 2, // Retry 2 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

// ==================== HOOK RETURN TYPE ====================

export type UseGenerateExamReturn = ReturnType<typeof useGenerateExam>;
