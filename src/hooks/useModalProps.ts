// ===== MODAL PROPS HOOK =====
// Bundles all ModalManager props into a single object
// Reduces App.tsx prop passing by ~15 lines

import { useMemo } from 'react';
import { FlashcardSet } from '@/types/flashcard';

interface ModalPropsInput {
  // Navigation state
  showExamSimulation: boolean;
  showGenerateFlashcards: boolean;
  
  // Flashcard set view state
  showFlashcardSetView: boolean;
  selectedFlashcardSet: FlashcardSet | null;
  
  // Delete modal state
  showDeleteConfirm: boolean;
  deleteMode: 'selected' | 'filtered' | 'all' | null;
  
  // Data
  allSets: FlashcardSet[];
  sortedSets: FlashcardSet[];
  tabFilteredSets: FlashcardSet[];
  selectedCount: number;
  reviewingCompletedExam: any;
  isMobile: boolean;

  // Weakness Context (from Lernanalyse)
  weaknessContext?: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo' } | null;
  examWeaknessContext?: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo'; examTitle?: string; examDurationMinutes?: number } | null;
  
  // Handlers
  onCloseExamSimulation: () => void;
  onCloseGenerateFlashcards: () => void;
  onCloseFlashcardSetView: () => void;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
  onFlashcardSetCreated: (newSet: FlashcardSet) => void;
  onFlashcardProgressUpdate: (setId: number, newProgress: number, updatedCards: any[]) => void;
}

/**
 * Custom Hook that bundles ModalManager props
 * 
 * Benefits:
 * - Cleaner App.tsx (single line instead of 17+)
 * - Type-safe prop passing
 * - Easy to extend/modify
 */
export function useModalProps(input: ModalPropsInput) {
  return useMemo(() => ({
    showExamSimulation: input.showExamSimulation,
    showGenerateFlashcards: input.showGenerateFlashcards,
    showFlashcardSetView: input.showFlashcardSetView,
    showDeleteConfirm: input.showDeleteConfirm,
    selectedFlashcardSet: input.selectedFlashcardSet,
    deleteMode: input.deleteMode,
    selectedCount: input.selectedCount,
    filteredCount: input.sortedSets.length,
    totalCount: input.tabFilteredSets.length,
    allSets: input.allSets,
    reviewingCompletedExam: input.reviewingCompletedExam,
    isMobile: input.isMobile,
    onCloseExamSimulation: input.onCloseExamSimulation,
    onCloseGenerateFlashcards: input.onCloseGenerateFlashcards,
    onCloseFlashcardSetView: input.onCloseFlashcardSetView,
    onCloseDeleteModal: input.onCloseDeleteModal,
    onConfirmDelete: input.onConfirmDelete,
    onFlashcardSetCreated: input.onFlashcardSetCreated,
    onFlashcardProgressUpdate: input.onFlashcardProgressUpdate,
    weaknessContext: input.weaknessContext,
    examWeaknessContext: input.examWeaknessContext,
  }), [
    input.showExamSimulation,
    input.showGenerateFlashcards,
    input.showFlashcardSetView,
    input.showDeleteConfirm,
    input.selectedFlashcardSet,
    input.deleteMode,
    input.selectedCount,
    input.sortedSets.length,
    input.tabFilteredSets,
    input.allSets,
    input.reviewingCompletedExam,
    input.isMobile,
    input.onCloseExamSimulation,
    input.onCloseGenerateFlashcards,
    input.onCloseFlashcardSetView,
    input.onCloseDeleteModal,
    input.onConfirmDelete,
    input.onFlashcardSetCreated,
    input.onFlashcardProgressUpdate,
    input.weaknessContext,
    input.examWeaknessContext,
  ]);
}