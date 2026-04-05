// ==================== LOCAL STORAGE UTILITIES ====================
// Für Offline-Support und automatisches Backup

import type { ExamSession, QuestionTiming } from '../types/api-types';

// ==================== HELPER: Check if localStorage is available ====================
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return false;
    }
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

const STORAGE_KEYS = {
  EXAM_SESSION: 'exam_session',
  EXAM_ANSWERS: 'exam_answers',
  EXAM_TIMINGS: 'exam_timings',
  EXAM_STATE: 'exam_state',
  USER_ID: 'user_id',
  FEEDBACK_GIVEN: 'feedback_given', // Track which subtopics already have feedback
} as const;

// ==================== EXAM SESSION ====================
export const saveExamSession = (session: ExamSession): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.EXAM_SESSION, JSON.stringify(session));
    console.log('💾 Exam session saved to localStorage');
  } catch (error) {
    console.error('❌ Failed to save exam session:', error);
  }
};

export const loadExamSession = (): ExamSession | null => {
  if (!isLocalStorageAvailable()) return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXAM_SESSION);
    if (!data) return null;
    
    const session = JSON.parse(data) as ExamSession;
    console.log('📂 Exam session loaded from localStorage');
    return session;
  } catch (error) {
    console.error('❌ Failed to load exam session:', error);
    return null;
  }
};

export const clearExamSession = (): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.EXAM_SESSION);
    console.log('🗑️ Exam session cleared from localStorage');
  } catch (error) {
    console.error('❌ Failed to clear exam session:', error);
  }
};

// ==================== EXAM ANSWERS ====================
export const saveExamAnswers = (
  answers: Array<{ answer: number | string | number[]; skipped?: boolean }>
): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.EXAM_ANSWERS, JSON.stringify(answers));
    console.log('💾 Exam answers saved to localStorage');
  } catch (error) {
    console.error('❌ Failed to save exam answers:', error);
  }
};

export const loadExamAnswers = (): Array<{ answer: number | string | number[]; skipped?: boolean }> | null => {
  if (!isLocalStorageAvailable()) return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXAM_ANSWERS);
    if (!data) return null;
    
    console.log('📂 Exam answers loaded from localStorage');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Failed to load exam answers:', error);
    return null;
  }
};

export const clearExamAnswers = (): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.EXAM_ANSWERS);
    console.log('🗑️ Exam answers cleared from localStorage');
  } catch (error) {
    console.error('❌ Failed to clear exam answers:', error);
  }
};

// ==================== EXAM TIMINGS ====================
export const saveExamTimings = (timings: QuestionTiming[]): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.EXAM_TIMINGS, JSON.stringify(timings));
    console.log('💾 Exam timings saved to localStorage');
  } catch (error) {
    console.error('❌ Failed to save exam timings:', error);
  }
};

export const loadExamTimings = (): QuestionTiming[] | null => {
  if (!isLocalStorageAvailable()) return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXAM_TIMINGS);
    if (!data) return null;
    
    console.log('📂 Exam timings loaded from localStorage');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Failed to load exam timings:', error);
    return null;
  }
};

export const clearExamTimings = (): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.EXAM_TIMINGS);
    console.log('🗑️ Exam timings cleared from localStorage');
  } catch (error) {
    console.error('❌ Failed to clear exam timings:', error);
  }
};

// ==================== EXAM STATE ====================
export interface ExamState {
  currentQuestionIndex: number;
  remainingTime: number;
  visitedQuestions: number[];
  selectedAnswer: number | null;
  selectedAnswers: number[];
  textAnswer: string;
}

export const saveExamState = (state: ExamState): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.EXAM_STATE, JSON.stringify(state));
    console.log('💾 Exam state saved to localStorage');
  } catch (error) {
    console.error('❌ Failed to save exam state:', error);
  }
};

export const loadExamState = (): ExamState | null => {
  if (!isLocalStorageAvailable()) return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXAM_STATE);
    if (!data) return null;
    
    const state = JSON.parse(data);
    // Convert visitedQuestions array back to Set
    console.log('📂 Exam state loaded from localStorage');
    return state;
  } catch (error) {
    console.error('❌ Failed to load exam state:', error);
    return null;
  }
};

export const clearExamState = (): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.EXAM_STATE);
    console.log('🗑️ Exam state cleared from localStorage');
  } catch (error) {
    console.error('❌ Failed to clear exam state:', error);
  }
};

// ==================== USER ID ====================
export const saveUserId = (userId: string): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    console.log('💾 User ID saved to localStorage');
  } catch (error) {
    console.error('❌ Failed to save user ID:', error);
  }
};

export const loadUserId = (): string | null => {
  if (!isLocalStorageAvailable()) return null;
  try {
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (userId) {
      console.log('📂 User ID loaded from localStorage');
    }
    return userId;
  } catch (error) {
    console.error('❌ Failed to load user ID:', error);
    return null;
  }
};

// ==================== CLEAR ALL ====================
export const clearAllExamData = (): void => {
  clearExamSession();
  clearExamAnswers();
  clearExamTimings();
  clearExamState();
  console.log('🗑️ All exam data cleared from localStorage');
};

// ==================== AUTO-SAVE ====================
export const autoSaveExam = (
  session: ExamSession,
  answers: Array<{ answer: number | string | number[]; skipped?: boolean }>,
  timings: QuestionTiming[],
  state: ExamState
): void => {
  saveExamSession(session);
  saveExamAnswers(answers);
  saveExamTimings(timings);
  saveExamState(state);
  console.log('💾 Auto-save completed');
};

// ==================== RESTORE EXAM ====================
export const restoreExam = (): {
  session: ExamSession | null;
  answers: Array<{ answer: number | string | number[]; skipped?: boolean }> | null;
  timings: QuestionTiming[] | null;
  state: ExamState | null;
} => {
  const session = loadExamSession();
  const answers = loadExamAnswers();
  const timings = loadExamTimings();
  const state = loadExamState();
  
  if (session && answers && timings && state) {
    console.log('✅ Full exam data restored from localStorage');
  }
  
  return { session, answers, timings, state };
};

// ==================== FEEDBACK TRACKING ====================
// Track which subtopics already received feedback (only show once per subtopic)

export interface ExamFeedback {
  difficulty: number; // 0-100 slider value (0 = too easy, 50 = okay, 100 = too difficult)
  comment?: string;
  timestamp: number;
  subtopicIds: string[]; // IDs of subtopics this exam covered
}

export const hasFeedbackBeenGiven = (subtopicIds: string[]): boolean => {
  if (!isLocalStorageAvailable()) return false;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK_GIVEN);
    if (!data) return false;
    
    const feedbackMap: { [key: string]: boolean } = JSON.parse(data);
    // Check if ANY of the subtopics already has feedback
    return subtopicIds.some(id => feedbackMap[id] === true);
  } catch (error) {
    console.error('❌ Failed to check feedback status:', error);
    return false;
  }
};

export const markFeedbackAsGiven = (subtopicIds: string[], feedback: ExamFeedback): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK_GIVEN);
    const feedbackMap: { [key: string]: boolean } = data ? JSON.parse(data) : {};
    
    // Mark all subtopics as having received feedback
    subtopicIds.forEach(id => {
      feedbackMap[id] = true;
    });
    
    localStorage.setItem(STORAGE_KEYS.FEEDBACK_GIVEN, JSON.stringify(feedbackMap));
    console.log('💾 Feedback marked as given for subtopics:', subtopicIds);
    
    // TODO: Send feedback to backend API
    // await fetch('/api/feedback', { method: 'POST', body: JSON.stringify(feedback) });
  } catch (error) {
    console.error('❌ Failed to mark feedback as given:', error);
  }
};