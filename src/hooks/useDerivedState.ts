// ===== DERIVED STATE HOOK =====
// Centralizes all computed/derived values from base state
// Reduces App.tsx complexity by ~40 lines

import React from 'react';
import { FlashcardSet } from '@/types/flashcard';
import {
  filterFlashcardSets,
  calculatePagination,
  calculateSidebarDimensions,
  calculateGridColumns,
} from '@/utils';
import { useCardsPerPageCalculation } from './useCardsPerPageCalculation';

interface DerivedStateInput {
  allSets: FlashcardSet[];
  activeTab: string;
  activeSubject: string | null;
  activeKategorie: string;
  activeThema: string;
  activeUnterthema: string;
  searchQuery: string;
  currentPage: number;
  sidebarCollapsed: boolean;
  windowWidth: number;
  windowHeight: number;
  isMobile: boolean;
}

interface DerivedStateOutput {
  cardsPerPage: number;
  sortedSets: FlashcardSet[];
  tabFilteredSets: FlashcardSet[];
  paginatedSets: FlashcardSet[];
  totalPages: number;
  sidebarWidth: number;
  mainMarginLeft: number;
  gridColumns: number;
}

/**
 * Custom Hook for all derived/computed state
 * 
 * Takes base state and returns computed values
 * All calculations are properly memoized
 */
export function useDerivedState(input: DerivedStateInput): DerivedStateOutput {
  const {
    allSets,
    activeTab,
    activeSubject,
    activeKategorie,
    activeThema,
    activeUnterthema,
    searchQuery,
    currentPage,
    sidebarCollapsed,
    windowWidth,
    windowHeight,
    isMobile,
  } = input;

  // Cards per page calculation
  const cardsPerPage = useCardsPerPageCalculation(
    windowWidth,
    windowHeight,
    sidebarCollapsed
  );

  // Sorted/filtered sets (with all filters applied)
  const sortedSets = filterFlashcardSets(allSets, {
    activeTab,
    activeSubject,
    activeKategorie,
    activeThema,
    activeUnterthema,
    searchQuery: searchQuery || '',
  });

  // Tab-filtered sets (only tab filter, for filter options)
  const tabFilteredSets = React.useMemo(() => {
    switch (activeTab) {
      case 'Repeat':
        return allSets.filter(set => (set.type || 'repeat') === 'repeat');
      case 'Manual':
        return allSets.filter(set => set.type === 'manual');
      case 'Prognosis':
        return allSets.filter(set => set.type === 'weakness' || set.type === 'risk' || set.type === 'knowledge-gap');
      case 'Teacher':
        return allSets.filter(set => set.type === 'teacher');
      default:
        return allSets;
    }
  }, [allSets, activeTab]);

  // Pagination
  const { paginatedSets, totalPages } = calculatePagination(
    sortedSets,
    currentPage,
    cardsPerPage,
    isMobile
  );

  // Sidebar dimensions
  const { sidebarWidth, mainMarginLeft } = calculateSidebarDimensions(
    windowWidth,
    sidebarCollapsed,
    isMobile
  );

  // Grid columns
  const gridColumns = calculateGridColumns(
    windowWidth,
    sidebarCollapsed,
    isMobile
  );

  return {
    cardsPerPage,
    sortedSets,
    tabFilteredSets,
    paginatedSets,
    totalPages,
    sidebarWidth,
    mainMarginLeft,
    gridColumns,
  };
}