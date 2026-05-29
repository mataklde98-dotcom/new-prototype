// ===== PAGINATION UTILITIES =====

import { FlashcardSet } from '@/types/flashcard';

export interface PaginationResult {
  paginatedSets: FlashcardSet[];
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

/**
 * Calculates pagination for flashcard sets
 * @param sortedSets - Sorted flashcard sets
 * @param currentPage - Current page number (1-based)
 * @param cardsPerPage - Number of cards per page
 * @param isMobile - Whether device is mobile (no pagination on mobile)
 * @returns Pagination result with paginated sets and metadata
 */
export function calculatePagination(
  sortedSets: FlashcardSet[],
  currentPage: number,
  cardsPerPage: number,
  isMobile: boolean
): PaginationResult {
  // Bei Mobile keine Pagination, alles anzeigen
  const totalPages = isMobile
    ? 1
    : Math.ceil(sortedSets.length / cardsPerPage);
  
  const startIndex = isMobile
    ? 0
    : (currentPage - 1) * cardsPerPage;
  
  const endIndex = isMobile
    ? sortedSets.length
    : startIndex + cardsPerPage;
  
  const paginatedSets = sortedSets.slice(startIndex, endIndex);

  return {
    paginatedSets,
    totalPages,
    startIndex,
    endIndex,
  };
}
