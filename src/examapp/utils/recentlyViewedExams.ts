// ===== RECENTLY VIEWED COMPLETED EXAMS STORAGE =====
// Tracks recently viewed completed exams for display in Home screen

import { CompletedExam } from './completedExamsStorage';
import { getUserStorageKey } from '@/lib/auth';

// ✅ FIX: Get storage key dynamically (not at import time!)
function getStorageKey(): string {
  return getUserStorageKey('recently_viewed_exams');
}

const MAX_RECENT_EXAMS = 10; // Maximum number of recently viewed exams to track

interface RecentlyViewedExam {
  examId: string;
  viewedAt: number; // timestamp
}

// ===== GET RECENTLY VIEWED EXAMS =====
export function getRecentlyViewedExams(): RecentlyViewedExam[] {
  try {
    const STORAGE_KEY = getStorageKey(); // ✅ Get key when function is called
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('[RecentlyViewedExams] Error loading:', error);
    return [];
  }
}

// ===== TRACK EXAM VIEW =====
export function trackExamView(examId: string): void {
  try {
    const STORAGE_KEY = getStorageKey(); // ✅ Get key when function is called
    const recentExams = getRecentlyViewedExams();
    
    // Remove existing entry if present
    const filtered = recentExams.filter(item => item.examId !== examId);
    
    // Add to beginning
    const updated: RecentlyViewedExam[] = [
      { examId, viewedAt: Date.now() },
      ...filtered
    ].slice(0, MAX_RECENT_EXAMS); // Keep only MAX_RECENT_EXAMS most recent
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('[RecentlyViewedExams] Error tracking view:', error);
  }
}

// ===== GET RECENT EXAMS WITH FULL DATA =====
export function getRecentExamsWithData(
  completedExams: CompletedExam[]
): CompletedExam[] {
  const recentViews = getRecentlyViewedExams();
  const result: CompletedExam[] = [];
  
  // Map recent views to full exam data, maintaining order
  for (const view of recentViews) {
    const exam = completedExams.find(e => e.id === view.examId);
    if (exam) {
      result.push(exam);
    }
  }
  
  return result;
}

// ===== CLEAR RECENTLY VIEWED =====
export function clearRecentlyViewedExams(): void {
  try {
    const STORAGE_KEY = getStorageKey(); // ✅ Get key when function is called
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[RecentlyViewedExams] Error clearing:', error);
  }
}
