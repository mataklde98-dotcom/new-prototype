import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '@/services';
import type { LearningSession } from '@/types';

// ===== SESSION HOOKS =====
// Custom Hooks für Learning Session-Daten mit React Query

// Query Keys
export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters: string) => [...sessionKeys.lists(), { filters }] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: number) => [...sessionKeys.details(), id] as const,
  bySet: (setId: number) => [...sessionKeys.all, 'bySet', setId] as const,
  recent: (limit: number) => [...sessionKeys.all, 'recent', limit] as const,
  today: () => [...sessionKeys.all, 'today'] as const,
  byDate: (date: Date) => [...sessionKeys.all, 'byDate', date.toISOString()] as const,
  stats: (setId: number) => [...sessionKeys.all, 'stats', setId] as const,
  progress: (days: number) => [...sessionKeys.all, 'progress', days] as const,
  streak: () => [...sessionKeys.all, 'streak'] as const,
};

/**
 * Hook: Holt alle Sessions
 */
export function useSessions() {
  return useQuery({
    queryKey: sessionKeys.lists(),
    queryFn: sessionService.getAllSessions,
  });
}

/**
 * Hook: Holt eine einzelne Session
 */
export function useSession(id: number) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionService.getSessionById(id),
    enabled: !!id,
  });
}

/**
 * Hook: Holt Sessions für ein Flashcard-Set
 */
export function useSessionsBySet(setId: number) {
  return useQuery({
    queryKey: sessionKeys.bySet(setId),
    queryFn: () => sessionService.getSessionsBySetId(setId),
    enabled: !!setId,
  });
}

/**
 * Hook: Holt kürzliche Sessions
 */
export function useRecentSessions(limit: number = 10) {
  return useQuery({
    queryKey: sessionKeys.recent(limit),
    queryFn: () => sessionService.getRecentSessions(limit),
  });
}

/**
 * Hook: Holt Sessions für heute
 */
export function useSessionsForToday() {
  return useQuery({
    queryKey: sessionKeys.today(),
    queryFn: sessionService.getSessionsForToday,
  });
}

/**
 * Hook: Holt Sessions für ein bestimmtes Datum
 */
export function useSessionsByDate(date: Date) {
  return useQuery({
    queryKey: sessionKeys.byDate(date),
    queryFn: () => sessionService.getSessionsByDate(date),
  });
}

/**
 * Hook: Holt durchschnittlichen Score für ein Set
 */
export function useAverageScoreForSet(setId: number) {
  return useQuery({
    queryKey: [...sessionKeys.bySet(setId), 'averageScore'],
    queryFn: () => sessionService.getAverageScoreForSet(setId),
    enabled: !!setId,
  });
}

/**
 * Hook: Holt Gesamtlernzeit
 */
export function useTotalStudyTime() {
  return useQuery({
    queryKey: [...sessionKeys.all, 'totalTime'],
    queryFn: sessionService.getTotalStudyTime,
  });
}

/**
 * Hook: Holt Lernzeit für letzte N Tage
 */
export function useStudyTimeForDays(days: number = 7) {
  return useQuery({
    queryKey: [...sessionKeys.all, 'timeForDays', days],
    queryFn: () => sessionService.getStudyTimeForDays(days),
  });
}

/**
 * Hook: Holt durchschnittliche Lernzeit pro Tag
 */
export function useAverageStudyTimePerDay(days: number = 7) {
  return useQuery({
    queryKey: [...sessionKeys.all, 'averagePerDay', days],
    queryFn: () => sessionService.getAverageStudyTimePerDay(days),
  });
}

/**
 * Hook: Holt Statistiken für ein Set
 */
export function useSetStatistics(setId: number) {
  return useQuery({
    queryKey: sessionKeys.stats(setId),
    queryFn: () => sessionService.getSetStatistics(setId),
    enabled: !!setId,
  });
}

/**
 * Hook: Holt Lernfortschritt über Zeit
 */
export function useProgressOverTime(days: number = 30) {
  return useQuery({
    queryKey: sessionKeys.progress(days),
    queryFn: () => sessionService.getProgressOverTime(days),
  });
}

/**
 * Hook: Holt Study Streak
 */
export function useStudyStreak() {
  return useQuery({
    queryKey: sessionKeys.streak(),
    queryFn: sessionService.getStudyStreak,
  });
}

/**
 * Hook: Erstellt eine neue Session
 */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<LearningSession, 'id'>) => 
      sessionService.createSession(data),
    onSuccess: (data) => {
      // Invalidiere alle Session-Listen
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
      // Invalidiere Set-spezifische Queries
      if (data) {
        queryClient.invalidateQueries({ 
          queryKey: sessionKeys.bySet(data.flashcardSetId) 
        });
        queryClient.invalidateQueries({ 
          queryKey: sessionKeys.stats(data.flashcardSetId) 
        });
      }
    },
  });
}

/**
 * Hook: Aktualisiert eine Session
 */
export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<LearningSession> }) => 
      sessionService.updateSession(id, data),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: sessionKeys.detail(data.id) });
        queryClient.invalidateQueries({ 
          queryKey: sessionKeys.bySet(data.flashcardSetId) 
        });
        queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      }
    },
  });
}

/**
 * Hook: Löscht eine Session
 */
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sessionService.deleteSession(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: sessionKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}
