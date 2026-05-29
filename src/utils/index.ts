// ===== CENTRAL UTILS EXPORTS =====
// Zentrale Export-Datei für alle Utility Functions

// Flashcard Utils
export { filterFlashcardSets } from './flashcardFilters';

// Pagination Utils
export { calculatePagination } from './paginationHelpers';
export {
  calculatePageNumbers,
  isFirstPage,
  isLastPage,
  getNextPage,
  getPreviousPage,
  validateCurrentPage,
} from './paginationUtils';

// Layout Utils
export {
  calculateSidebarDimensions,
  calculateGridColumns,
} from './layoutHelpers';

// 🚀 Performance Utils (120Hz Optimization)
export {
  TRANSITION_TRANSFORM,
  TRANSITION_OPACITY,
  TRANSITION_COLORS,
  TRANSITION_SCALE,
  hwAccelerate,
  spring120Hz,
  easing120Hz,
  easingQuick,
  supports120Hz,
  getOptimalDuration,
  smoothRAF,
  cancelRAF,
  createScrollHandler,
} from './performance';
