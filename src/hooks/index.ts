// ===== CENTRAL HOOKS EXPORTS =====
// Zentrale Export-Datei für alle Custom Hooks

// User Context Hooks (NEW - Current User)
export { useCurrentUser, useIsAuthenticated } from './useCurrentUser';

// Error Tracking Hook (NEW - System Error Tracking)
export { useErrorTracking } from './useErrorTracking';

// Flashcard Hooks (Enterprise Architecture)
export { useFlashcards } from './useFlashcards';
export { useFlashcardHandlers } from './useFlashcardHandlers';
export { useFlashcardSetView } from './useFlashcardSetView';
export { useFlashcardFilters } from './useFlashcardFilters';
export { usePrognosis } from './usePrognosis';

// App Event Handlers Hook
export { useAppHandlers } from './useAppHandlers';

// UI State Hooks (NEU)
export { useNavigation } from './useNavigation';
export { useSelection } from './useSelection';
export { useUIState } from './useUIState';
export { useDeleteModal } from './useDeleteModal';
export { useScreenManager } from './useScreenManager';
export { useDelayedUnmount } from './useDelayedUnmount';

// Derived State & Props Bundling Hooks (Senior-Level Optimization)
export { useDerivedState } from './useDerivedState';
export { useLayoutProps } from './useLayoutProps';
export { useModalProps } from './useModalProps';

// Chat Hooks
export { useChat } from './useChat';
export { useAiChat } from './useAiChat';

// Teacher Profile Hook
export { useTeacherProfileData } from './useTeacherProfileData';

// Layout & Window Hooks
export { useWindowSize } from './useWindowSize';
export { useCardsPerPageCalculation } from './useCardsPerPageCalculation';
export { useScrollDirection } from './useScrollDirection';
export { useDesktopHeaderLayout, DESKTOP_HEADER_NARROW_BP } from './useDesktopHeaderLayout';

// Legacy Hooks (falls noch verwendet)
export {
  useTodos,
  useTodo,
  useTodosForToday,
  useUpcomingTodos,
  useOverdueTodos,
  useCompletedTodos,
  useTodosByDate,
  useTodosByType,
  useTodosBySubject,
  useTodosWithFilters,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
  useToggleTodo,
  todoKeys,
} from './useTodos';

export {
  useSessions,
  useSession,
  useSessionsBySet,
  useRecentSessions,
  useSessionsForToday,
  useSessionsByDate,
  useAverageScoreForSet,
  useTotalStudyTime,
  useStudyTimeForDays,
  useAverageStudyTimePerDay,
  useSetStatistics,
  useProgressOverTime,
  useStudyStreak,
  useCreateSession,
  useUpdateSession,
  useDeleteSession,
  sessionKeys,
} from './useSessions';

export {
  useUserProfile,
  useStreak,
  useStreakStats,
  useLevelInfo,
  useStudyStats,
  useHasStudiedToday,
  useUserRegistration,
  useUpdateProfile,
  useUpdateXP,
  useAddStudyTime,
  useUpdateStreak,
  useUpdateRegistration,
  userKeys,
} from './useUser';