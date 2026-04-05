// ===== FLASHCARD FILTER UTILITIES =====

import { FlashcardSet } from '@/types/flashcard';

export interface FlashcardFilters {
  activeTab: string;
  activeSubject: string;
  activeKategorie: string;
  activeThema: string;
  activeUnterthema: string;
  searchQuery: string;
}

/**
 * Filters and sorts flashcard sets based on provided filters
 * @param allSets - All flashcard sets
 * @param filters - Filter criteria
 * @returns Filtered and sorted flashcard sets (newest first)
 */
export function filterFlashcardSets(
  allSets: FlashcardSet[],
  filters: FlashcardFilters
): FlashcardSet[] {
  let filteredSets = allSets;

  // Filter by Tab (Repeat, Manual, Prognosis, Teacher) - Sets ohne type werden als 'repeat' behandelt
  const tabFilter = filters.activeTab.toLowerCase();
  if (tabFilter === 'prognosis') {
    // Prognosis tab shows all prognosis sub-types: weakness, risk, knowledge-gap
    filteredSets = filteredSets.filter(
      (s) => s.type === 'weakness' || s.type === 'risk' || s.type === 'knowledge-gap',
    );
  } else {
    filteredSets = filteredSets.filter(
      (s) => (s.type || "repeat") === tabFilter,
    );
  }

  // Subject filter - always applied
  if (filters.activeSubject !== "Alle Fächer" && filters.activeSubject !== "All") {
    filteredSets = filteredSets.filter(
      (s) => s.subject === filters.activeSubject,
    );
  }

  // Kategorie, Thema, Unterthema filters - ONLY excluded in "manual" tab (Eigene)
  // Both "repeat" (KI-Sets) and "prognosis" (Prognosen) tabs support full hierarchy
  const isManualTab = tabFilter === 'manual';
  
  if (!isManualTab && filters.activeKategorie && filters.activeKategorie !== "Alle") {
    filteredSets = filteredSets.filter(
      (s) => s.kategorie === filters.activeKategorie,
    );
  }

  if (!isManualTab && filters.activeThema && filters.activeThema !== "Alle") {
    filteredSets = filteredSets.filter(
      (s) => s.thema === filters.activeThema,
    );
  }

  if (!isManualTab && filters.activeUnterthema && filters.activeUnterthema !== "Alle") {
    filteredSets = filteredSets.filter(
      (s) => s.unterthema === filters.activeUnterthema,
    );
  }

  // Search filter
  if (filters.searchQuery && filters.searchQuery.trim() !== "") {
    const query = filters.searchQuery.toLowerCase();
    filteredSets = filteredSets.filter(
      (s) =>
        s.title?.toLowerCase().includes(query) ||
        s.subject?.toLowerCase().includes(query) ||
        s.kategorie?.toLowerCase().includes(query) ||
        s.thema?.toLowerCase().includes(query) ||
        s.unterthema?.toLowerCase().includes(query),
    );
  }

  // Sort by createdDate (newest first) - My Flashcards zeigt Erstellungsdatum
  return [...filteredSets].sort((a, b) => {
    const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
    const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
    return dateB - dateA;
  });
}