// ✅ Completed Exams Storage - Local Storage for completed exam simulations
// Similar to aiContentStorage but for tracking finished exams
import { getUserStorageKey, getCurrentUserId } from '@/lib/auth';

export interface CompletedExam {
  id: string;
  userId: string; // ✅ Required: User who completed the exam
  subjectId: string;
  subjectName: string;
  categoryId: string;
  categoryName: string;
  topicId: string;
  topicName: string;
  subtopicIds: string[];
  subtopicNames: string[];
  score: number; // Percentage (0-100)
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  timeSpent: number; // in seconds
  completedAt: string; // ISO date string
  questions: any[]; // Store questions for review
  answers: any; // Store answers for review
  // 🆕 Points-based results (korrekte Grade-Berechnung)
  totalPoints?: number;     // Summe aller Question.points
  achievedPoints?: number;  // Tatsächlich erreichte Points
  grade?: number;           // Deutsche Note 1-6
  // User registration data (für spätere API-Analytics)
  userState?: string; // Bundesland
  userSchoolType?: string; // Schultyp
  userGrade?: string; // Klassenstufe
  // 🏆 Generation Number (wie bei Flashcards - permanente Badge-Nummer)
  generationNumber?: number; // #1, #2, #3, etc. - zeigt X-te Prüfung zum selben Thema
  // 🆕 Multi-category exam scope (new exam selection model)
  examScope?: ExamScopeCategory[];
}

export interface ExamScopeCategory {
  name: string;
  topics: {
    name: string;
    subtopics: string[];
  }[];
}

// ✅ FIX: Get storage key dynamically (not at import time!)
function getStorageKey(): string {
  return getUserStorageKey('completedExams');
}

export function getCompletedExams(): CompletedExam[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const STORAGE_KEY = getStorageKey(); // ✅ Get key when function is called
    const userId = getCurrentUserId();
    
    console.log('📖 [getCompletedExams] Reading exams...');
    console.log('📖 [getCompletedExams] STORAGE_KEY:', STORAGE_KEY);
    console.log('📖 [getCompletedExams] userId:', userId);
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      console.log('📖 [getCompletedExams] No exams found in storage');
      return [];
    }
    
    const allExams = JSON.parse(stored) as CompletedExam[];
    console.log('📖 [getCompletedExams] All exams in storage:', allExams.length);
    
    // ✅ Filter by current user
    const userExams = allExams.filter(exam => exam.userId === userId);
    console.log('📖 [getCompletedExams] User exams:', userExams.length);
    console.log('📖 [getCompletedExams] Filtered exams:', userExams);
    
    return userExams;
  } catch (error) {
    console.error('❌ [getCompletedExams] Error loading completed exams:', error);
    return [];
  }
}

export function saveCompletedExam(exam: CompletedExam): void {
  if (typeof window === 'undefined') return;
  
  try {
    const STORAGE_KEY = getStorageKey(); // ✅ Get key when function is called
    const userId = getCurrentUserId();
    
    console.log('💾 [saveCompletedExam] Saving exam...');
    console.log('💾 [saveCompletedExam] STORAGE_KEY:', STORAGE_KEY);
    console.log('💾 [saveCompletedExam] userId:', userId);
    console.log('💾 [saveCompletedExam] Exam data:', exam);
    
    // ✅ Ensure exam has userId
    if (!exam.userId) {
      exam.userId = userId;
    }
    
    // ✅ FIX: Load ALL exams (not filtered!), add new one, then save ALL
    const stored = localStorage.getItem(STORAGE_KEY);
    const allExams: CompletedExam[] = stored ? JSON.parse(stored) : [];
    console.log('💾 [saveCompletedExam] All exams in storage:', allExams.length);
    
    // Get current user's exams for generation number calculation
    const userExams = allExams.filter(e => e.userId === userId);
    console.log('💾 [saveCompletedExam] Current user exams:', userExams.length);
    
    // 🏆 Calculate generation number like Flashcards (permanent badge)
    if (!exam.generationNumber) {
      const sameTopicExams = userExams.filter(e => e.topicName === exam.topicName);
      const existingNumbers = sameTopicExams.map(e => e.generationNumber || 0);
      const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
      exam.generationNumber = maxNumber + 1;
    }
    
    allExams.unshift(exam); // Add to beginning (most recent first) of ALL exams
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allExams)); // ✅ Save ALL exams!
    
    console.log('✅ [saveCompletedExam] Exam saved! Total exams in storage:', allExams.length);
    console.log('✅ [saveCompletedExam] Saved exam:', exam);
  } catch (error) {
    console.error('❌ [saveCompletedExam] Error saving completed exam:', error);
  }
}

export function deleteCompletedExam(examId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const STORAGE_KEY = getStorageKey(); // ✅ Get key when function is called
    
    // ✅ FIX: Load ALL exams, delete the one, save ALL
    const stored = localStorage.getItem(STORAGE_KEY);
    const allExams: CompletedExam[] = stored ? JSON.parse(stored) : [];
    const filtered = allExams.filter(e => e.id !== examId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting completed exam:', error);
  }
}

export function clearAllCompletedExams(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const STORAGE_KEY = getStorageKey(); // ✅ Get key when function is called
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing completed exams:', error);
  }
}

// Helper to get badge number for an exam (returns stored generationNumber)
// Like Flashcards - always shows the permanent generation number (#1, #2, #3, etc.)
export function getTopicBadgeNumber(topicName: string, examId: string): number | null {
  const exams = getCompletedExams();
  const exam = exams.find(e => e.id === examId);
  return exam?.generationNumber ?? null;
}