import { useState } from 'react';
import { FlashcardSet } from '@/types/flashcard';
import { FlashcardCard } from '@/services/cardGenerationService';

// ===== FLASHCARD SET VIEW STATE HOOK =====
// Verwaltet den State für das Flashcard Set View Modal

export interface SelectedFlashcardSet {
  setId: number; // ID des Sets für Progress Update
  setName: string;
  subtopicName: string;
  subject: string;
  cards: FlashcardCard[];
}

export function useFlashcardSetView() {
  const [showFlashcardSetView, setShowFlashcardSetView] = useState(false);
  const [selectedFlashcardSet, setSelectedFlashcardSet] = useState<SelectedFlashcardSet | null>(null);

  /**
   * Öffnet das Flashcard Set View Modal
   */
  const openFlashcardSet = (flashcardSetData: SelectedFlashcardSet) => {
    setSelectedFlashcardSet(flashcardSetData);
    setShowFlashcardSetView(true);
  };

  /**
   * Schließt das Flashcard Set View Modal
   * 🔥 CRITICAL: selectedFlashcardSet MUSS erhalten bleiben bis Exit Animation fertig ist!
   */
  const closeFlashcardSet = () => {
    setShowFlashcardSetView(false);
    // 🔥 DO NOT clear selectedFlashcardSet immediately - wait for exit animation (300ms)
    // ModalManager handles the unmount timing
    setTimeout(() => {
      setSelectedFlashcardSet(null);
    }, 300);
  };

  return {
    showFlashcardSetView,
    selectedFlashcardSet,
    openFlashcardSet,
    closeFlashcardSet,
  };
}
