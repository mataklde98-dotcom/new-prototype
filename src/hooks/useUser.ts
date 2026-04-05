import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserProfile, StudyStreak } from '@/types';
import { userService } from '@/services';
import type { UserRegistrationData } from '@/mocks/user.mock';

// ===== REACT QUERY KEYS =====
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  streak: () => [...userKeys.all, 'streak'] as const,
  streakStats: () => [...userKeys.all, 'streakStats'] as const,
  levelInfo: () => [...userKeys.all, 'levelInfo'] as const,
  studyStats: () => [...userKeys.all, 'studyStats'] as const,
  hasStudiedToday: () => [...userKeys.all, 'hasStudiedToday'] as const,
  registrationData: () => [...userKeys.all, 'registrationData'] as const,
};

// ===== QUERY HOOKS =====

/**
 * Hook to get user profile
 */
export function useUserProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: userService.getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get study streak
 */
export function useStreak() {
  return useQuery({
    queryKey: userKeys.streak(),
    queryFn: userService.getStreak,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

/**
 * Hook to get streak statistics
 */
export function useStreakStats() {
  return useQuery({
    queryKey: userKeys.streakStats(),
    queryFn: userService.getStreakStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get level info
 */
export function useLevelInfo() {
  return useQuery({
    queryKey: userKeys.levelInfo(),
    queryFn: userService.getLevelInfo,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

/**
 * Hook to get study statistics
 */
export function useStudyStats() {
  return useQuery({
    queryKey: userKeys.studyStats(),
    queryFn: userService.getStudyStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to check if studied today
 */
export function useHasStudiedToday() {
  return useQuery({
    queryKey: userKeys.hasStudiedToday(),
    queryFn: userService.hasStudiedToday,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

/**
 * ===== USER REGISTRATION DATA =====
 * Hook to get user registration data (Bundesland, Schultyp, Klassenstufe)
 * Diese Daten werden bei Exam Simulation API-Calls mitgeschickt
 * 
 * JETZT: Nutzt Mock-Daten (sync, kein Query nötig)
 * SPÄTER: Query für echte API-Daten
 */
export function useUserRegistration() {
  // Für Mock-Daten: Einfach direkt returnen (sync)
  // Später mit React Query wenn es async API-Calls sind
  const registrationData = userService.getRegistrationData();
  
  return {
    data: registrationData,
    isLoading: false,
    isError: false
  };
}

// ===== MUTATION HOOKS =====

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => userService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
}

/**
 * Hook to update user XP
 */
export function useUpdateXP() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (xpToAdd: number) => userService.updateXP(xpToAdd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      queryClient.invalidateQueries({ queryKey: userKeys.levelInfo() });
    },
  });
}

/**
 * Hook to add study time
 */
export function useAddStudyTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (minutes: number) => userService.addStudyTime(minutes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      queryClient.invalidateQueries({ queryKey: userKeys.studyStats() });
    },
  });
}

/**
 * Hook to update study streak
 */
export function useUpdateStreak() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.updateStreak(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.streak() });
      queryClient.invalidateQueries({ queryKey: userKeys.streakStats() });
      queryClient.invalidateQueries({ queryKey: userKeys.hasStudiedToday() });
    },
  });
}

/**
 * Hook to update user registration data
 */
export function useUpdateRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserRegistrationData>) => userService.updateRegistrationData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.registrationData() });
    },
  });
}
