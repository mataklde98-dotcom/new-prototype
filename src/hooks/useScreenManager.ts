import { useMemo } from 'react';

/**
 * useScreenManager - Bridge between Navigation State & ScreenManager 🌉
 * 
 * Converts boolean navigation states to a single activeScreen string
 * for the ScreenManager component.
 * 
 * BENEFITS:
 * - No breaking changes to existing navigation logic
 * - Minimal code changes required
 * - Type-safe screen management
 */

interface ScreenManagerHookProps {
  showHome: boolean;
  showMyFlashcards: boolean;
  showKITools: boolean;
  showProfil: boolean;
  showCompletedExams: boolean;
  showChats: boolean;
  showMeetings: boolean;
  isMobile: boolean;
}

export type ScreenKey = 
  | 'home'
  | 'my-flashcards'
  | 'ki-tools'
  | 'profil'
  | 'completed-exams'
  | 'chats'
  | 'meetings';

export function useScreenManager({
  showHome,
  showMyFlashcards,
  showKITools,
  showProfil,
  showCompletedExams,
  showChats,
  showMeetings,
  isMobile,
}: ScreenManagerHookProps) {
  
  /**
   * Determine active screen based on boolean states
   * Priority: Latest opened screen wins
   */
  const activeScreen: ScreenKey = useMemo(() => {
    // Only apply to mobile screens
    if (!isMobile) return 'home';

    if (showMeetings) return 'meetings';
    if (showChats) return 'chats';
    // 🚀 showCompletedExams wird NICHT mehr hier geprüft —
    //    Completed Exams ist jetzt ein Overlay (wie MyFlashcards/TodoManagement)
    if (showProfil) return 'profil';
    // 🚀 showMyFlashcards wird NICHT mehr hier geprüft —
    //    My Flashcards ist jetzt ein Overlay (wie TodoManagement)
    if (showKITools) return 'ki-tools';
    if (showHome) return 'home';
    
    // Fallback
    return 'home';
  }, [showHome, showMyFlashcards, showKITools, showProfil, showCompletedExams, showChats, showMeetings, isMobile]);

  return {
    activeScreen,
  };
}