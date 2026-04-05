/**
 * useAppHandlers Hook
 * 
 * Kapselt alle Event-Handler-Logik der App
 * Macht die App.tsx schlanker und übersichtlicher
 */

import { useState } from 'react';
import type { FlashcardSet } from '@/types/flashcard';
import { getCompletedExams } from '@/examapp/utils/completedExamsStorage';
import type { CompletedExam } from '@/examapp/utils/completedExamsStorage';
import { trackExamView } from '@/examapp/utils/recentlyViewedExams';

interface UseAppHandlersProps {
  // Selection
  selectionMode: boolean;
  
  // Flashcard Operations
  addSet: (set: FlashcardSet) => void;
  updateProgressAndCards: (setId: number, progress: number, cards: any[]) => void;
  prepareFlashcardSetForOpening: (set: FlashcardSet) => any;
  
  // Navigation
  trackCurrentScreenBeforeFlashcardSet: (screen?: string) => void;
  closeGenerateFlashcardsAndNavigateToMyFlashcards: (isMobile: boolean) => void;
  navigateBackFromFlashcardSet: (isMobile: boolean, callback?: () => void) => void;
  openExamSimulation: () => void;
  
  // Flashcard Set View
  openFlashcardSet: (data: any) => void;
  closeFlashcardSet: () => void;
  
  // Filters
  setActiveTab: (tab: string) => void;
}

export function useAppHandlers(props: UseAppHandlersProps) {
  const {
    selectionMode,
    addSet,
    updateProgressAndCards,
    prepareFlashcardSetForOpening,
    trackCurrentScreenBeforeFlashcardSet,
    closeGenerateFlashcardsAndNavigateToMyFlashcards,
    navigateBackFromFlashcardSet,
    openExamSimulation,
    openFlashcardSet,
    closeFlashcardSet,
    setActiveTab,
  } = props;

  // Track wenn ein Set gerade via Generate Flashcards neu erstellt wurde
  const [isNewlyGeneratedSet, setIsNewlyGeneratedSet] = useState(false);
  
  // ✅ COMPLETED EXAM REVIEW STATE
  // Wenn User auf Completed Exam klickt → Exam-Daten speichern und ExamApp öffnen
  const [reviewingCompletedExam, setReviewingCompletedExam] = useState<CompletedExam | null>(null);

  /**
   * Handler: Open Flashcard Set
   */
  const handleOpenFlashcardSet = (set: FlashcardSet) => {
    if (selectionMode) return;
    
    // Track current screen before opening flashcard set
    trackCurrentScreenBeforeFlashcardSet();
    
    // Reset newly generated flag (normales Öffnen eines Sets, nicht via Generate)
    setIsNewlyGeneratedSet(false);
    
    const flashcardSetData = prepareFlashcardSetForOpening(set);
    openFlashcardSet(flashcardSetData);
  };

  /**
   * Handler: Flashcard Set Created (via Generate Flashcards)
   */
  const handleFlashcardSetCreated = (newSet: FlashcardSet, isMobile: boolean) => {
    // ✅ 3-Layer Architecture: Use Hook Method
    addSet(newSet);
    console.log(`📚 Neues Flashcard-Set #${newSet.generationNumber} hinzugefügt:`, newSet.title);
    
    // Flag setzen: Dieses Set wurde gerade neu generiert!
    setIsNewlyGeneratedSet(true);
    
    // Close the Generate Flashcards modal and navigate to My Flashcards
    closeGenerateFlashcardsAndNavigateToMyFlashcards(isMobile);
    
    // WICHTIG: Explizit 'myflashcards' als Previous Screen setzen!
    // Wenn ein neues Set via Generate Flashcards erstellt wurde, soll es beim Schließen
    // immer zu My Flashcards zurück gehen (nicht zu Generate Flashcards)
    trackCurrentScreenBeforeFlashcardSet('myflashcards');
    
    // Open the flashcard set view immediately
    const flashcardSetData = prepareFlashcardSetForOpening(newSet);
    openFlashcardSet(flashcardSetData);
  };

  /**
   * Handler: Flashcard Progress Update
   */
  const handleFlashcardProgressUpdate = (setId: number, progress: number, cards: any[]) => {
    // ✅ 3-Layer Architecture: Use Hook Method
    updateProgressAndCards(setId, progress, cards);
  };

  /**
   * Handler: Close Flashcard Set View
   */
  const handleCloseFlashcardSetView = (isMobile: boolean) => {
    // Close the flashcard set view
    closeFlashcardSet();
    
    // Navigate back to the screen we came from
    // Wenn das Set gerade neu generiert wurde, setze Tab auf "Repeat"
    navigateBackFromFlashcardSet(isMobile, () => {
      if (isNewlyGeneratedSet) {
        setActiveTab('Repeat');
        setIsNewlyGeneratedSet(false); // Reset Flag
        console.log('📍 Neues Set geschlossen → My Flashcards (Repeat Tab)');
      }
    });
  };

  /**
   * Handler: Completed Exam Click
   */
  const handleCompletedExamClick = (examId: string, context: string = '') => {
    console.log(`📋 ${context ? `[${context}] ` : ''}Opening Completed Exam:`, examId);
    
    // Track this exam as recently viewed
    trackExamView(examId);
    
    // Load exam from localStorage
    const allExams = getCompletedExams();
    const exam = allExams.find(e => e.id === examId);
    
    if (exam) {
      // Store exam for review
      setReviewingCompletedExam(exam);
      
      // Open Exam Simulation modal with review mode
      openExamSimulation();
    } else {
      console.error('❌ Exam not found:', examId);
    }
  };

  /**
   * Handler: Create Own Set Save
   */
  const handleCreateOwnSetSave = (
    title: string, 
    cards: any[], 
    subject: string,
    onCloseModal: () => void
  ) => {
    // Create new flashcard set
    const newSet: FlashcardSet = {
      id: Date.now(),
      subject: subject, // Use selected subject instead of 'Custom'
      kategorie: '',
      thema: '',
      unterthema: '',
      title: title,
      cardCount: cards.length,
      progress: 0,
      createdDate: new Date(),
      lastOpened: new Date(),
      cards: cards,
      isManual: true,
      type: 'manual',
    };

    // ✅ 3-Layer Architecture: Use Hook Method
    addSet(newSet);

    // Close modal
    onCloseModal();

    // Switch to Manual tab to show the new set
    setActiveTab('Manual');
  };

  return {
    // State
    reviewingCompletedExam,
    setReviewingCompletedExam,
    
    // Handlers
    handleOpenFlashcardSet,
    handleFlashcardSetCreated,
    handleFlashcardProgressUpdate,
    handleCloseFlashcardSetView,
    handleCompletedExamClick,
    handleCreateOwnSetSave,
  };
}
