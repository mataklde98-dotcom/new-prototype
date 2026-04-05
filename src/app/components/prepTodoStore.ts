// ===== SHARED PREP-TODO STORE =====
// Single source of truth for all KI-generated prep tasks (Karteikarten & Prüfungssimulationen)
// from Klassenarbeiten and Lernziele. Used by Home, Klassenarbeit-Detail, and Lernziel-Detail.
// Follows the same reactive store pattern as teacherTasksStore / weaknessCardStore.

import { MOCK_UPCOMING_EXAMS } from './profileAnalyticsMockExams';
import { MOCK_ACTIVE_GOALS } from './profileAnalyticsData';

type Listener = () => void;

const STORAGE_KEY = 'prepTodos_v2';

export interface PrepTodo {
  /** Unique ID: `${parentId}::${taskIndex}` */
  id: string;
  parentId: string;
  parentType: 'exam' | 'goal';
  parentSubject: string;
  parentTitle: string; // e.g. "Mathematik" for exams, "Quadratische Funktionen" for goals
  parentDate?: string; // exam date YYYY-MM-DD (only for exam type)
  type: 'flashcards' | 'exam-simulation' | 'chat';
  title: string;
  topic: string;
  completed: boolean;
  assignedDate: string; // YYYY-MM-DD
  completedDate?: string;
  cardCount?: number;
  examDurationMinutes?: number;
  linkedSetId?: number | null;
  flashcardProgress: number; // 0-100
}

/** Build initial todos from mock exam + goal data */
function buildInitialTodos(): PrepTodo[] {
  const todos: PrepTodo[] = [];

  // From upcoming exams
  for (const exam of MOCK_UPCOMING_EXAMS) {
    exam.prepTasks.forEach((task, idx) => {
      todos.push({
        id: `${exam.id}::${idx}`,
        parentId: exam.id,
        parentType: 'exam',
        parentSubject: exam.subject,
        parentTitle: exam.subject,
        parentDate: exam.date,
        type: task.type,
        title: task.title,
        topic: task.topic,
        completed: task.completed,
        assignedDate: task.assignedDate,
        completedDate: task.completedDate,
        cardCount: task.cardCount,
        examDurationMinutes: task.examDurationMinutes,
        linkedSetId: task.linkedSetId ?? null,
        flashcardProgress: task.completed && task.linkedSetId ? 100 : 0,
      });
    });
  }

  // From active goals
  for (const goal of MOCK_ACTIVE_GOALS) {
    goal.prepTasks.forEach((task, idx) => {
      todos.push({
        id: `${goal.id}::${idx}`,
        parentId: goal.id,
        parentType: 'goal',
        parentSubject: goal.subject,
        parentTitle: goal.topic,
        parentDate: goal.dueDate,
        type: task.type,
        title: task.title,
        topic: task.topic,
        completed: task.completed,
        assignedDate: task.assignedDate,
        completedDate: task.completedDate,
        cardCount: task.cardCount,
        examDurationMinutes: task.examDurationMinutes,
        linkedSetId: task.linkedSetId ?? null,
        flashcardProgress: task.completed && task.linkedSetId ? 100 : 0,
      });
    });
  }

  return todos;
}

function loadTodos(): PrepTodo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as PrepTodo[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return buildInitialTodos();
}

let todos: PrepTodo[] = loadTodos();
const listeners = new Set<Listener>();

function notify() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  listeners.forEach(fn => fn());
}

// Subject color map (same as used throughout the app)
const SUBJECT_COLORS: Record<string, string> = {
  'Mathematik': '#10B981',
  'Deutsch': '#3B82F6',
  'Englisch': '#A855F7',
  'Französisch': '#F59E0B',
  'Biologie': '#10B981',
  'Physik': '#EC4899',
  'Chemie': '#F59E0B',
  'Geschichte': '#3B82F6',
};

export function getSubjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] || '#6B7280';
}

export const prepTodoStore = {
  // ── Read ──

  /** Get all todos */
  getAll(): PrepTodo[] {
    return todos;
  },

  /** Get todos filtered by parent (exam or goal) */
  getByParent(parentId: string): PrepTodo[] {
    return todos.filter(t => t.parentId === parentId);
  },

  /** Get open (incomplete) todos for a specific date.
   *  Carryover rule: incomplete todos with assignedDate <= dateStr also appear. */
  getOpenForDate(dateStr: string): PrepTodo[] {
    return todos.filter(t => {
      if (t.completed) return false;
      // Show if assigned on this date OR if assigned before and still incomplete (carryover)
      return t.assignedDate <= dateStr;
    });
  },

  /** Get open todos for a specific day-of-week abbreviation (Mo, Di, Mi...) relative to today's week */
  getOpenForDay(day: string): PrepTodo[] {
    const dayMap: Record<string, number> = { 'So': 0, 'Mo': 1, 'Di': 2, 'Mi': 3, 'Do': 4, 'Fr': 5, 'Sa': 6 };
    const targetDow = dayMap[day];
    if (targetDow === undefined) return [];

    // Calculate the target date based on today (2026-03-18, Wednesday)
    const today = new Date('2026-03-18');
    const todayDow = today.getDay(); // 3 = Wednesday
    const diff = targetDow - todayDow;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    const dateStr = targetDate.toISOString().split('T')[0];

    // For past/today: show carryover (assigned <= date, not completed)
    // For future: show only assigned on that specific date
    if (diff <= 0) {
      return todos.filter(t => !t.completed && t.assignedDate <= dateStr);
    } else {
      return todos.filter(t => !t.completed && t.assignedDate === dateStr);
    }
  },

  /** Find a todo by ID */
  getById(id: string): PrepTodo | undefined {
    return todos.find(t => t.id === id);
  },

  /** Find a todo by parentId and task index */
  getByParentAndIndex(parentId: string, taskIndex: number): PrepTodo | undefined {
    return todos.find(t => t.id === `${parentId}::${taskIndex}`);
  },

  // ── Write ──

  /** Link a flashcard set to a todo */
  linkFlashcardSet(todoId: string, setId: number) {
    todos = todos.map(t =>
      t.id === todoId ? { ...t, linkedSetId: setId, flashcardProgress: 0 } : t
    );
    notify();
  },

  /** Link by parentId + taskIndex (for backward compatibility) */
  linkFlashcardSetByParent(parentId: string, taskIndex: number, setId: number) {
    const todoId = `${parentId}::${taskIndex}`;
    this.linkFlashcardSet(todoId, setId);
  },

  /** Update flashcard progress for all todos with this linked set */
  updateFlashcardProgress(linkedSetId: number | string, progress: number) {
    const setIdNum = typeof linkedSetId === 'string' ? parseInt(linkedSetId, 10) : linkedSetId;
    let changed = false;
    todos = todos.map(t => {
      if (t.linkedSetId === setIdNum) {
        changed = true;
        const newProgress = Math.min(100, Math.max(0, Math.round(progress)));
        return { ...t, flashcardProgress: newProgress };
      }
      return t;
    });
    if (changed) notify();
  },

  /** Mark a todo as completed */
  completeTodo(todoId: string) {
    const today = new Date('2026-03-18').toISOString().split('T')[0];
    todos = todos.map(t =>
      t.id === todoId ? { ...t, completed: true, completedDate: today } : t
    );
    notify();
  },

  /** Reset linked set for new creation (when previous set hit 100%) */
  resetForNewSet(todoId: string) {
    todos = todos.map(t =>
      t.id === todoId ? { ...t, linkedSetId: null, flashcardProgress: 0 } : t
    );
    notify();
  },

  // ── Subscribe ──
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot(): PrepTodo[] {
    return todos;
  },
};