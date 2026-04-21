// ===== LAYOUT PROPS HOOK =====
// Bundles all MainLayout props into a single object
// Reduces App.tsx prop passing by ~20 lines

import { useMemo } from 'react';

interface LayoutPropsInput {
  isMobile: boolean;
  windowWidth: number;
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  mobileActiveTab: string;
  showMyFlashcards: boolean;
  showCompletedExams: boolean;
  showChats: boolean;
  showAccountEdit: boolean;
  showTodoManagement: boolean;
  showKlassenarbeiten: boolean;
  showSchulaufgaben: boolean;
  showSchuleUndKlasse: boolean;
  showLernanalyse: boolean;
  showTutoringActivation: boolean;
  showTutoringProgress: boolean;
  showMeetings?: boolean;
  showHomeBottomSheet?: boolean;
  showExtraSessions?: boolean;
  onToggleSidebar: () => void;
  onHomeClick: () => void;
  onMyFlashcardsClick: () => void;
  onNavigateToCompletedExams: () => void;
  onNavigateToProfilDesktop: () => void;
  onNavigateToKITools?: () => void;
  onNavigateToChats?: () => void;
  onNavigateToMeetings?: () => void;
  onOpenExamSimulation?: () => void;
  onOpenGenerateFlashcards?: () => void;
  onOpenLernanalyse?: () => void;
  onMobileTabChange: (tab: string) => void;
}

/**
 * Custom Hook that bundles MainLayout props
 * 
 * Benefits:
 * - Cleaner App.tsx (single line instead of 15+)
 * - Type-safe prop passing
 * - Easy to extend/modify
 */
export function useLayoutProps(input: LayoutPropsInput) {
  return useMemo(() => ({
    isMobile: input.isMobile,
    windowWidth: input.windowWidth,
    sidebarWidth: input.sidebarWidth,
    sidebarCollapsed: input.sidebarCollapsed,
    mobileActiveTab: input.mobileActiveTab,
    showMyFlashcards: input.showMyFlashcards && input.isMobile,
    showCompletedExams: input.showCompletedExams && input.isMobile,
    showChats: input.showChats && input.isMobile,
    showAccountEdit: input.showAccountEdit && input.isMobile,
    showTodoManagement: input.showTodoManagement && input.isMobile,
    showKlassenarbeiten: input.showKlassenarbeiten && input.isMobile,
    showSchulaufgaben: input.showSchulaufgaben && input.isMobile,
    showSchuleUndKlasse: input.showSchuleUndKlasse && input.isMobile,
    showLernanalyse: input.showLernanalyse && input.isMobile,
    showTutoringActivation: input.showTutoringActivation && input.isMobile,
    showTutoringProgress: input.showTutoringProgress && input.isMobile,
    showMeetings: (input.showMeetings ?? false) && input.isMobile,
    showHomeBottomSheet: (input.showHomeBottomSheet ?? false) && input.isMobile,
    showExtraSessions: (input.showExtraSessions ?? false) && input.isMobile,
    onToggleSidebar: input.onToggleSidebar,
    onHomeClick: input.onHomeClick,
    onMyFlashcardsClick: input.onMyFlashcardsClick,
    onNavigateToCompletedExams: input.onNavigateToCompletedExams,
    onNavigateToProfilDesktop: input.onNavigateToProfilDesktop,
    onNavigateToKITools: input.onNavigateToKITools,
    onNavigateToChats: input.onNavigateToChats,
    onNavigateToMeetings: input.onNavigateToMeetings,
    onOpenExamSimulation: input.onOpenExamSimulation,
    onOpenGenerateFlashcards: input.onOpenGenerateFlashcards,
    onOpenLernanalyse: input.onOpenLernanalyse,
    onMobileTabChange: input.onMobileTabChange,
  }), [
    input.isMobile,
    input.windowWidth,
    input.sidebarWidth,
    input.sidebarCollapsed,
    input.mobileActiveTab,
    input.showMyFlashcards,
    input.showCompletedExams,
    input.showChats,
    input.showAccountEdit,
    input.showTodoManagement,
    input.showKlassenarbeiten,
    input.showSchulaufgaben,
    input.showSchuleUndKlasse,
    input.showLernanalyse,
    input.showTutoringActivation,
    input.showTutoringProgress,
    input.showMeetings,
    input.showHomeBottomSheet,
    input.showExtraSessions,
    input.onToggleSidebar,
    input.onHomeClick,
    input.onMyFlashcardsClick,
    input.onNavigateToCompletedExams,
    input.onNavigateToProfilDesktop,
    input.onNavigateToKITools,
    input.onNavigateToChats,
    input.onNavigateToMeetings,
    input.onOpenExamSimulation,
    input.onOpenGenerateFlashcards,
    input.onOpenLernanalyse,
    input.onMobileTabChange,
  ]);
}
