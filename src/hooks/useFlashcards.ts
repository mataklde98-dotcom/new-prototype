import { useState, useEffect } from 'react';
import { flashcardService } from '@/services';
import type { FlashcardSet } from '@/types';

// ===== FLASHCARD STATE MANAGEMENT HOOK =====
// Zentrales State Management für alle Flashcard-Sets
// Nutzt flashcardService → später einfach durch API austauschbar

export function useFlashcards(initialSets?: FlashcardSet[]) {
  const [allSets, setAllSets] = useState<FlashcardSet[]>(initialSets || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lädt alle Flashcard-Sets
   */
  const loadAllSets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sets = await flashcardService.getAllSets();
      setAllSets(sets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load flashcards');
      console.error('Error loading flashcards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Aktualisiert ein Flashcard-Set (optimistisches Update)
   */
  const updateSet = async (id: number, data: Partial<FlashcardSet>) => {
    // Optimistisches Update
    setAllSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, ...data } : set))
    );

    try {
      await flashcardService.updateSet(id, data);
    } catch (err) {
      // Rollback bei Fehler
      setError(err instanceof Error ? err.message : 'Failed to update flashcard');
      console.error('Error updating flashcard:', err);
      // Reload to restore correct state
      await loadAllSets();
    }
  };

  /**
   * Löscht ein einzelnes Flashcard-Set
   */
  const deleteSet = async (id: number) => {
    // Optimistisches Update
    setAllSets((prev) => prev.filter((set) => set.id !== id));

    try {
      await flashcardService.deleteSet(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete flashcard');
      console.error('Error deleting flashcard:', err);
      // Reload to restore correct state
      await loadAllSets();
    }
  };

  /**
   * Löscht mehrere Flashcard-Sets
   */
  const deleteSets = async (ids: number[]) => {
    // Optimistisches Update
    setAllSets((prev) => prev.filter((set) => !ids.includes(set.id)));

    try {
      await flashcardService.deleteSets(ids);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete flashcards');
      console.error('Error deleting flashcards:', err);
      // Reload to restore correct state
      await loadAllSets();
    }
  };

  /**
   * Löscht alle Flashcard-Sets
   */
  const deleteAllSets = async () => {
    // Optimistisches Update
    setAllSets([]);

    try {
      await flashcardService.deleteAllSets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete all flashcards');
      console.error('Error deleting all flashcards:', err);
      // Reload to restore correct state
      await loadAllSets();
    }
  };

  /**
   * Fügt ein neues Flashcard-Set hinzu
   */
  const addSet = (newSet: FlashcardSet) => {
    setAllSets((prev) => [newSet, ...prev]);
  };

  /**
   * Aktualisiert lastOpened Timestamp
   */
  const updateLastOpened = async (id: number) => {
    const now = new Date();
    
    // Optimistisches Update
    setAllSets((prev) =>
      prev.map((set) =>
        set.id === id ? { ...set, lastOpened: now } : set
      )
    );

    try {
      await flashcardService.updateLastOpened(id);
    } catch (err) {
      console.error('Error updating lastOpened:', err);
    }
  };

  /**
   * Aktualisiert Progress eines Sets
   */
  const updateProgress = async (id: number, progress: number) => {
    // Optimistisches Update
    setAllSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, progress } : set))
    );

    try {
      await flashcardService.updateProgress(id, progress);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  /**
   * Aktualisiert Progress UND Cards eines Sets
   */
  const updateProgressAndCards = async (
    id: number,
    progress: number,
    cards: Array<{ id: string; question: string; answer: string; confidenceScore?: number }>
  ) => {
    // Optimistisches Update
    setAllSets((prev) =>
      prev.map((set) =>
        set.id === id ? { ...set, progress, cards } : set
      )
    );

    try {
      await flashcardService.updateProgressAndCards(id, progress, cards);
    } catch (err) {
      console.error('Error updating progress and cards:', err);
    }
  };

  return {
    allSets,
    setAllSets,
    isLoading,
    error,
    loadAllSets,
    updateSet,
    deleteSet,
    deleteSets,
    deleteAllSets,
    addSet,
    updateLastOpened,
    updateProgress,
    updateProgressAndCards,
  };
}
