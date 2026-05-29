// ===== HOOK: useTeacherTasks =====
// Reactive hook for the teacherTasksStore – re-renders on any task update.

import { useSyncExternalStore } from 'react';
import { teacherTasksStore } from '@/app/components/teacherTasksStore';
import type { TeacherAssignedTask } from '@/mocks/tutoringProgress.mock';

export function useTeacherTasks(): TeacherAssignedTask[] {
  return useSyncExternalStore(
    teacherTasksStore.subscribe,
    teacherTasksStore.getTasks,
    teacherTasksStore.getTasks,
  );
}
