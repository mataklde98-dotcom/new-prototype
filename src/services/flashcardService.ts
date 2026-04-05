import type { FlashcardSet } from '@/types';
import { MOCK_FLASHCARD_SETS } from '@/mocks';
import { getCurrentUserId } from '@/lib/auth';

// ===== FLASHCARD SERVICE =====
// Zentrale Service-Schicht für alle Flashcard-API-Calls
// JETZT: Nutzt Mock-Daten + User-Scoping
// SPÄTER: Ersetze Mock-Aufrufe durch echte API-Calls
// WICHTIG: MOCK_FLASHCARD_SETS enthält bereits Prognosis-Daten!

export const flashcardService = {
  /**
   * Holt alle Flashcard-Sets (inkl. Prognosis-Daten) für den aktuellen User
   * JETZT: Filter by userId from mock data
   * SPÄTER: GET /api/flashcards?userId={userId}
   */
  getAllSets: async (): Promise<FlashcardSet[]> => {
    const userId = getCurrentUserId();
    // Filter mock data by current user
    return MOCK_FLASHCARD_SETS.filter(set => set.userId === userId);
  },

  /**
   * Holt ein einzelnes Flashcard-Set anhand der ID (nur wenn es dem User gehört)
   * SPÄTER: GET /api/flashcards/:id
   */
  getSetById: async (id: number): Promise<FlashcardSet | null> => {
    const userId = getCurrentUserId();
    const set = MOCK_FLASHCARD_SETS.find(s => s.id === id && s.userId === userId);
    return set ? { ...set } : null;
  },

  /**
   * Erstellt ein neues Flashcard-Set für den aktuellen User
   * SPÄTER: POST /api/flashcards
   */
  createSet: async (data: Omit<FlashcardSet, 'id' | 'createdDate' | 'userId'>): Promise<FlashcardSet> => {
    const userId = getCurrentUserId();
    const newSet: FlashcardSet = {
      id: Date.now(),
      userId, // ✅ Automatically assign to current user
      ...data,
      createdDate: new Date(),
      lastOpened: undefined
    };
    MOCK_FLASHCARD_SETS.push(newSet);
    return newSet;
  },

  /**
   * Aktualisiert ein bestehendes Flashcard-Set (nur wenn es dem User gehört)
   * SPÄTER: PATCH /api/flashcards/:id
   */
  updateSet: async (id: number, data: Partial<FlashcardSet>): Promise<FlashcardSet | null> => {
    const userId = getCurrentUserId();
    const index = MOCK_FLASHCARD_SETS.findIndex(s => s.id === id && s.userId === userId);
    if (index === -1) return null;

    MOCK_FLASHCARD_SETS[index] = {
      ...MOCK_FLASHCARD_SETS[index],
      ...data
    };
    
    return { ...MOCK_FLASHCARD_SETS[index] };
  },

  /**
   * Löscht ein Flashcard-Set
   * SPÄTER: DELETE /api/flashcards/:id
   */
  deleteSet: async (id: number): Promise<{ success: boolean; deletedId: number }> => {
    const index = MOCK_FLASHCARD_SETS.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Flashcard set with id ${id} not found`);
    }

    MOCK_FLASHCARD_SETS.splice(index, 1);
    return { success: true, deletedId: id };
  },

  /**
   * Holt kürzlich geöffnete Flashcard-Sets
   * SPÄTER: GET /api/flashcards/recent?limit=5
   */
  getRecentSets: async (limit: number = 5): Promise<FlashcardSet[]> => {
    return MOCK_FLASHCARD_SETS
      .filter(set => set.lastOpened)
      .sort((a, b) => {
        if (!a.lastOpened || !b.lastOpened) return 0;
        return b.lastOpened.getTime() - a.lastOpened.getTime();
      })
      .slice(0, limit)
      .map(set => ({ ...set }));
  },

  /**
   * Sucht Flashcard-Sets nach Query
   * SPÄTER: GET /api/flashcards/search?q=query
   */
  searchSets: async (query: string): Promise<FlashcardSet[]> => {
    const lowerQuery = query.toLowerCase();
    return MOCK_FLASHCARD_SETS.filter(set =>
      set.subject.toLowerCase().includes(lowerQuery) ||
      set.kategorie.toLowerCase().includes(lowerQuery) ||
      set.thema.toLowerCase().includes(lowerQuery) ||
      set.unterthema.toLowerCase().includes(lowerQuery) ||
      set.title.toLowerCase().includes(lowerQuery)
    ).map(set => ({ ...set }));
  },

  /**
   * Filtert Sets nach Subject
   * SPÄTER: GET /api/flashcards?subject=Math
   */
  getSetsBySubject: async (subject: string): Promise<FlashcardSet[]> => {
    return MOCK_FLASHCARD_SETS
      .filter(set => set.subject === subject)
      .map(set => ({ ...set }));
  },

  /**
   * Filtert Sets nach Category
   * SPÄTER: GET /api/flashcards?category=Algebra
   */
  getSetsByCategory: async (category: string): Promise<FlashcardSet[]> => {
    return MOCK_FLASHCARD_SETS
      .filter(set => set.kategorie === category)
      .map(set => ({ ...set }));
  },

  /**
   * Filtert Sets nach Topic
   * SPÄTER: GET /api/flashcards?topic=Linear%20Equations
   */
  getSetsByTopic: async (topic: string): Promise<FlashcardSet[]> => {
    return MOCK_FLASHCARD_SETS
      .filter(set => set.thema === topic)
      .map(set => ({ ...set }));
  },

  /**
   * Filtert Sets nach Subtopic
   * SPÄTER: GET /api/flashcards?subtopic=Solving%20Methods
   */
  getSetsBySubtopic: async (subtopic: string): Promise<FlashcardSet[]> => {
    return MOCK_FLASHCARD_SETS
      .filter(set => set.unterthema === subtopic)
      .map(set => ({ ...set }));
  },

  /**
   * Aktualisiert lastOpened Timestamp
   * SPÄTER: PATCH /api/flashcards/:id/last-opened
   */
  updateLastOpened: async (id: number): Promise<FlashcardSet | null> => {
    const index = MOCK_FLASHCARD_SETS.findIndex(s => s.id === id);
    if (index === -1) return null;

    MOCK_FLASHCARD_SETS[index].lastOpened = new Date();
    return { ...MOCK_FLASHCARD_SETS[index] };
  },

  /**
   * Aktualisiert Progress
   * SPÄTER: PATCH /api/flashcards/:id/progress
   */
  updateProgress: async (id: number, progress: number): Promise<FlashcardSet | null> => {
    const index = MOCK_FLASHCARD_SETS.findIndex(s => s.id === id);
    if (index === -1) return null;

    MOCK_FLASHCARD_SETS[index].progress = progress;
    return { ...MOCK_FLASHCARD_SETS[index] };
  },

  /**
   * Holt Sets die wiederholt werden sollten
   * SPÄTER: GET /api/flashcards/to-repeat
   */
  getSetsToRepeat: async (): Promise<FlashcardSet[]> => {
    return MOCK_FLASHCARD_SETS
      .filter(set => set.type === 'repeat' && set.progress < 100)
      .sort((a, b) => a.progress - b.progress)
      .map(set => ({ ...set }));
  },

  /**
   * Holt neue Sets (noch nie geöffnet)
   * SPÄTER: GET /api/flashcards/new
   */
  getNewSets: async (): Promise<FlashcardSet[]> => {
    return MOCK_FLASHCARD_SETS
      .filter(set => !set.lastOpened)
      .map(set => ({ ...set }));
  },

  /**
   * Löscht mehrere Flashcard-Sets auf einmal
   * SPÄTER: DELETE /api/flashcards/batch
   */
  deleteSets: async (ids: number[]): Promise<{ success: boolean; deletedIds: number[] }> => {
    const deletedIds: number[] = [];
    
    ids.forEach(id => {
      const index = MOCK_FLASHCARD_SETS.findIndex(s => s.id === id);
      if (index !== -1) {
        MOCK_FLASHCARD_SETS.splice(index, 1);
        deletedIds.push(id);
      }
    });

    return { success: true, deletedIds };
  },

  /**
   * Löscht alle Flashcard-Sets
   * SPÄTER: DELETE /api/flashcards/all
   */
  deleteAllSets: async (): Promise<{ success: boolean; deletedCount: number }> => {
    const count = MOCK_FLASHCARD_SETS.length;
    MOCK_FLASHCARD_SETS.length = 0; // Clear array
    return { success: true, deletedCount: count };
  },

  /**
   * Aktualisiert Progress und Cards eines Sets
   * SPÄTER: PATCH /api/flashcards/:id/progress-and-cards
   */
  updateProgressAndCards: async (
    id: number, 
    progress: number, 
    cards: Array<{ id: string; question: string; answer: string; confidenceScore?: number }>
  ): Promise<FlashcardSet | null> => {
    const index = MOCK_FLASHCARD_SETS.findIndex(s => s.id === id);
    if (index === -1) return null;

    MOCK_FLASHCARD_SETS[index] = {
      ...MOCK_FLASHCARD_SETS[index],
      progress,
      cards
    };
    
    return { ...MOCK_FLASHCARD_SETS[index] };
  }
};
