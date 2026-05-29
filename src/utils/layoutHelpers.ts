// ===== LAYOUT CALCULATION UTILITIES =====

export interface SidebarDimensions {
  sidebarWidth: number;
  mainMarginLeft: number;
  isVerySmallScreen: boolean;
}

/**
 * Calculates sidebar width and main content margin based on screen size and sidebar state
 * @param windowWidth - Current window width
 * @param sidebarCollapsed - Whether sidebar is collapsed
 * @param isMobile - Whether device is mobile
 * @returns Sidebar dimensions and layout values
 */
export function calculateSidebarDimensions(
  windowWidth: number,
  sidebarCollapsed: boolean,
  isMobile: boolean
): SidebarDimensions {
  const isVerySmallScreen = windowWidth < 500;
  
  const sidebarWidth = isMobile
    ? 0
    : sidebarCollapsed
      ? 65
      : isVerySmallScreen
        ? 220
        : 286;
  
  const mainMarginLeft = isMobile
    ? 0
    : sidebarWidth + (isVerySmallScreen ? 16 : 28); // 12px sidebar left margin + 16px gap

  return {
    sidebarWidth,
    mainMarginLeft,
    isVerySmallScreen,
  };
}

/**
 * Calculates grid template columns based on available width
 * @param windowWidth - Current window width
 * @param sidebarCollapsed - Whether sidebar is collapsed
 * @param isMobile - Whether device is mobile
 * @returns CSS grid-template-columns value
 */
export function calculateGridColumns(
  windowWidth: number,
  sidebarCollapsed: boolean,
  isMobile: boolean
): string {
  if (isMobile) {
    const mobileWidth = windowWidth - 32; // padding
    if (mobileWidth >= 600) return "repeat(2, 1fr)";
    return "1fr";
  }

  const sidebarWidth = sidebarCollapsed
    ? 65
    : windowWidth < 500
      ? 220
      : 286;
  
  const horizontalPadding =
    windowWidth < 640
      ? 24
      : windowWidth < 768
        ? 32
        : 64;
  
  const sidebarMargin = sidebarCollapsed
    ? 85
    : windowWidth < 500
      ? 230
      : 306;
  
  const availableWidth =
    windowWidth - sidebarMargin - horizontalPadding;

  if (availableWidth >= 1000) return "repeat(3, 1fr)";
  if (availableWidth >= 600) return "repeat(2, 1fr)";
  return "1fr";
}