// ===== APP CONSTANTS =====
// Zentrale Konfiguration für Magic Numbers und wiederholte Werte

// ===== BREAKPOINTS =====
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  XS: 640,
} as const;

// ===== SIDEBAR =====
export const SIDEBAR = {
  WIDTH_EXPANDED: 280,
  WIDTH_COLLAPSED: 80,
  MOBILE_OFFSET: 10,
  DESKTOP_OFFSET: 5,
} as const;

// ===== PAGINATION =====
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MOBILE_PAGE_SIZE: 6,
  WINDOW_SIZE: 3, // Anzahl sichtbarer Seitenzahlen
} as const;

// ===== ANIMATION =====
export const ANIMATION = {
  TRANSITION_DURATION: 700, // Sidebar collapse/expand
  SEARCH_CLOSE_DELAY: 250, // Search overlay close animation
  MODAL_TRANSITION: 300,
} as const;

// ===== SPACING =====
export const SPACING = {
  MOBILE_PADDING: '16px',
  MOBILE_BOTTOM_NAV_HEIGHT: '94px',
  MOBILE_BOTTOM_TOOLBAR_OFFSET: '106px',
  DESKTOP_PADDING_SM: '12px',
  DESKTOP_PADDING_MD: '16px',
  DESKTOP_PADDING_LG: '24px',
} as const;

// ===== Z-INDEX =====
export const Z_INDEX = {
  BASE: 1,
  DROPDOWN: 10,
  SIDEBAR: 30,
  BOTTOM_NAV: 60,
  MODAL: 9999,
} as const;

// ===== COLORS (als Ergänzung zu Tailwind) =====
export const COLORS = {
  PRIMARY: '#009379',
  PRIMARY_HOVER: '#00b894',
  PRIMARY_LIGHT: '#00a685',
  GLASS_LIGHT: 'rgba(255, 255, 255, 0.05)',
  GLASS_DARK: 'rgba(255, 255, 255, 0.02)',
  BORDER_LIGHT: 'rgba(255, 255, 255, 0.12)',
  TEXT_PRIMARY: 'rgba(255, 255, 255, 0.95)',
  TEXT_SECONDARY: 'rgba(255, 255, 255, 0.70)',
  TEXT_TERTIARY: 'rgba(255, 255, 255, 0.40)',
} as const;

// ===== BORDER RADIUS =====
export const BORDER_RADIUS = {
  XS: '8px',
  SM: '12px',
  MD: '16px',
  LG: '20px',
  XL: '24px',
  MOBILE_XS: '8px',
  MOBILE_SM: '12px',
  MOBILE_MD: '12px',
  DESKTOP_SM: '12px',
  DESKTOP_MD: '16px',
  DESKTOP_LG: '20px',
} as const;

// ===== TABS =====
export const TABS = {
  DEFAULT_TAB: 'Repeat',
  AVAILABLE_TABS: ['Repeat', 'Manual', 'Prognosis'] as const,
} as const;

// ===== FILTERS =====
export const FILTERS = {
  DEFAULT_SUBJECT: 'All',
  EMPTY_FILTER: '',
} as const;

// ===== MOBILE =====
export const MOBILE_TABS = {
  HOME: 'Home',
  MY_FLASHCARDS: 'My Flashcards',
  KI_TOOLS: 'KI-Tools',
} as const;

// ===== GRID =====
export const GRID = {
  GAP_MOBILE: '12px',
  GAP_DESKTOP_SM: '12px',
  GAP_DESKTOP_MD: '16px',
  MIN_CARD_WIDTH: 280,
  MAX_COLUMNS: 6,
} as const;

// ===== API (für zukünftige Nutzung) =====
export const API = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_COUNT: 3,
} as const;

// ===== DELAYS (für Mock-Simulation) =====
export const MOCK_DELAYS = {
  GET: 300,
  POST: 400,
  PUT: 300,
  DELETE: 300,
  SEARCH: 250,
  SHORT: 100,
  LONG: 500,
} as const;

// ===== TYPE EXPORTS für TypeScript =====
export type Breakpoint = keyof typeof BREAKPOINTS;
export type TabType = typeof TABS.AVAILABLE_TABS[number];
export type MobileTab = typeof MOBILE_TABS[keyof typeof MOBILE_TABS];
