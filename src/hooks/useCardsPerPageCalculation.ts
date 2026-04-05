// ===== CARDS PER PAGE CALCULATION HOOK =====

import { useState, useEffect } from 'react';

/**
 * Custom hook to calculate optimal cards per page based on window size and layout
 * Dynamically adapts to available screen space for optimal grid layout
 */
export function useCardsPerPageCalculation(
  windowWidth: number,
  windowHeight: number,
  sidebarCollapsed: boolean
): number {
  const [cardsPerPage, setCardsPerPage] = useState(12);

  // Smart, adaptive cards calculation - fills available space dynamically
  useEffect(() => {
    const calculateCards = () => {
      const isMobile = windowWidth < 768;

      // Calculate available width (considering sidebar on desktop)
      let availableWidth = windowWidth;
      if (!isMobile) {
        const sidebarWidth = sidebarCollapsed
          ? 65
          : windowWidth < 500
            ? 220
            : 286;
        const horizontalPadding =
          windowWidth < 640 ? 24 : windowWidth < 768 ? 32 : 64;
        const sidebarMargin = sidebarCollapsed
          ? 85
          : windowWidth < 500
            ? 230
            : 306;
        availableWidth =
          windowWidth - sidebarMargin - horizontalPadding;
      } else {
        // Mobile: full width minus padding
        availableWidth = windowWidth - 32; // 16px left + 16px right
      }

      // Determine columns based on available content width
      let columns = 1;
      if (availableWidth >= 1000) {
        columns = 3; // 3 columns for wide layouts
      } else if (availableWidth >= 600) {
        columns = 2; // 2 columns for medium layouts
      }
      // else 1 column for narrow layouts

      // Calculate available height for cards
      // CARD HEIGHT IS FIXED: 100px (FlashcardItem h-[100px])
      const FIXED_CARD_HEIGHT = 100;
      const gapSize = isMobile
        ? 12
        : windowWidth < 640
          ? 12
          : 16;

      // Measure fixed UI elements precisely
      const headerHeight = isMobile
        ? 110
        : windowWidth < 640
          ? 105
          : windowWidth < 768
            ? 120
            : 130;
      const paginationHeight = isMobile
        ? 100
        : windowWidth < 640
          ? 60
          : 65;
      const bottomNavHeight = isMobile ? 90 : 0;
      const verticalPadding = isMobile
        ? 20
        : windowWidth < 640
          ? 20
          : windowWidth < 768
            ? 28
            : 40;
      // Mehr Safety Buffer für größere iPhones (Pro Max, Plus) damit Pagination sichtbar bleibt
      const safetyBuffer =
        isMobile && windowWidth > 393 ? 30 : 10;

      const usedHeight =
        headerHeight +
        paginationHeight +
        bottomNavHeight +
        verticalPadding +
        safetyBuffer;
      const availableHeight = Math.max(
        100,
        windowHeight - usedHeight,
      );

      // Calculate how many rows fit with FIXED card height
      // Formula: floor((availableHeight + gap) / (cardHeight + gap))
      const rowsWithGap = Math.floor(
        (availableHeight + gapSize) /
          (FIXED_CARD_HEIGHT + gapSize),
      );
      let rows = Math.max(2, rowsWithGap);

      // FIX: iPhone Pro Max (430px) und Plus (428px) auf maximal 4 Karten limitieren
      if (isMobile && windowWidth > 393 && rows > 4) {
        rows = 4;
      }

      const total = columns * rows;
      console.log(
        `🎯 [${isMobile ? "MOBILE" : "DESKTOP"}] Window: ${windowWidth}×${windowHeight} | Sidebar: ${sidebarCollapsed ? "collapsed" : "open"} | Available: ${availableWidth}×${availableHeight}px | Grid: ${columns}×${rows} = ${total} cards`,
      );

      setCardsPerPage(total);
    };

    calculateCards();
  }, [windowWidth, windowHeight, sidebarCollapsed]);

  return cardsPerPage;
}
