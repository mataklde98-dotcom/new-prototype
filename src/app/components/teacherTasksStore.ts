// ===== SHARED TEACHER TASKS STORE =====
// Single source of truth for "Aufgaben vom Lehrer" – reactive store with localStorage persistence.
// Manages the complete lifecycle: open → started → completed for both Prüfung and Karteikarten tasks.

import { MOCK_TEACHER_TASKS } from '@/mocks/tutoringProgress.mock';
import type { TeacherAssignedTask } from '@/mocks/tutoringProgress.mock';

type Listener = () => void;

const STORAGE_KEY = 'teacherTasks_v2';

// Initialize from localStorage or mock data
function loadTasks(): TeacherAssignedTask[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  // First load: persist mock data
  const initial = structuredClone(MOCK_TEACHER_TASKS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

let tasks: TeacherAssignedTask[] = loadTasks();
const listeners = new Set<Listener>();

function notify() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  listeners.forEach(fn => fn());
}

export const teacherTasksStore = {
  // ── Read ──
  getTasks(): TeacherAssignedTask[] {
    return tasks;
  },

  getTaskById(id: string): TeacherAssignedTask | undefined {
    return tasks.find(t => t.id === id);
  },

  /** Find a task that is linked to a specific flashcard set */
  getTaskByLinkedSetId(setId: string): TeacherAssignedTask | undefined {
    return tasks.find(t => t.linkedSetId === setId);
  },

  // ── Write ──

  /** Generic update for a task */
  updateTask(id: string, updates: Partial<TeacherAssignedTask>) {
    tasks = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    notify();
  },

  /** FLOW 1: Exam completed → set grade + auto-complete */
  completeExamTask(id: string, grade: string) {
    tasks = tasks.map(t =>
      t.id === id ? { ...t, status: 'completed' as const, grade, score: 100 } : t
    );
    notify();
  },

  /** FLOW 2a: Link a newly-generated flashcard set to a task */
  linkFlashcardSet(id: string, linkedSetId: string) {
    tasks = tasks.map(t =>
      t.id === id ? { ...t, linkedSetId, status: 'started' as const } : t
    );
    notify();
  },

  /** Clean up tasks pointing to a flashcard set that no longer exists */
  unlinkBySetId(setId: string) {
    let changed = false;
    tasks = tasks.map(t => {
      if (t.linkedSetId === setId) {
        changed = true;
        return { ...t, linkedSetId: undefined, score: 0, status: 'new' as const };
      }
      return t;
    });
    if (changed) notify();
  },

  /** FLOW 2b: Update flashcard task progress (called on every card swipe) */
  updateFlashcardProgress(linkedSetId: string, progress: number) {
    tasks = tasks.map(t => {
      if (t.linkedSetId !== linkedSetId) return t;
      const clamped = Math.min(100, Math.max(0, Math.round(progress)));
      const isComplete = clamped >= 100;
      return {
        ...t,
        score: clamped,
        status: isComplete ? 'completed' as const : (t.status === 'new' ? 'started' as const : t.status),
      };
    });
    notify();
  },

  // ── Subscribe ──
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Reset to mock data (dev helper) */
  reset() {
    tasks = structuredClone(MOCK_TEACHER_TASKS);
    notify();
  },
};