// ===== PAGINATION UTILITIES =====
// Hilfsfunktionen für Pagination-Logik

export interface PageNumbersConfig {
  currentPage: number;
  totalPages: number;
  windowSize?: number; // Anzahl sichtbarer Seiten (default: 3)
}

export interface PageNumbersResult {
  pages: (number | 'ellipsis')[];
  hasEllipsis: boolean;
  showLastPage: boolean;
}

/**
 * Berechnet die anzuzeigenden Seitenzahlen mit 3er-Fenster
 * 
 * Logik:
 * - Wenn aktive Seite 1-3: zeige 1,2,3
 * - Wenn aktive Seite 4: zeige 2,3,4
 * - Wenn aktive Seite 5: zeige 3,4,5
 * - etc.
 * - Zeige "..." und letzte Seite wenn wir nicht am Ende sind
 * 
 * @param config - Konfiguration mit currentPage, totalPages, windowSize
 * @returns Array von Seitenzahlen und Metadaten
 */
export function calculatePageNumbers({
  currentPage,
  totalPages,
  windowSize = 3,
}: PageNumbersConfig): PageNumbersResult {
  const pages: (number | 'ellipsis')[] = [];

  if (totalPages === 0) {
    return { pages: [], hasEllipsis: false, showLastPage: false };
  }

  // Berechne das Fenster mit aktiver Seite ganz rechts
  let windowStart = Math.max(1, currentPage - (windowSize - 1));
  let windowEnd = windowStart + (windowSize - 1);

  // Wenn wir am Ende sind, justiere das Fenster
  if (windowEnd > totalPages) {
    windowEnd = totalPages;
    windowStart = Math.max(1, windowEnd - (windowSize - 1));
  }

  // Füge das Fenster hinzu
  for (let i = windowStart; i <= windowEnd; i++) {
    pages.push(i);
  }

  // Zeige "..." und letzte Seite wenn wir nicht am Ende sind
  const hasEllipsis = windowEnd < totalPages;
  const showLastPage = windowEnd < totalPages;

  if (hasEllipsis) {
    pages.push('ellipsis');
  }

  if (showLastPage) {
    pages.push(totalPages);
  }

  return {
    pages,
    hasEllipsis,
    showLastPage,
  };
}

/**
 * Prüft ob eine Seite die erste Seite ist
 */
export function isFirstPage(currentPage: number): boolean {
  return currentPage === 1;
}

/**
 * Prüft ob eine Seite die letzte Seite ist
 */
export function isLastPage(currentPage: number, totalPages: number): boolean {
  return currentPage === totalPages;
}

/**
 * Berechnet die nächste Seite
 */
export function getNextPage(currentPage: number, totalPages: number): number {
  return Math.min(totalPages, currentPage + 1);
}

/**
 * Berechnet die vorherige Seite
 */
export function getPreviousPage(currentPage: number): number {
  return Math.max(1, currentPage - 1);
}

/**
 * Validiert die aktuelle Seite gegen die Gesamtzahl
 */
export function validateCurrentPage(currentPage: number, totalPages: number): number {
  if (totalPages === 0) return 1;
  if (currentPage > totalPages) return totalPages;
  if (currentPage < 1) return 1;
  return currentPage;
}
