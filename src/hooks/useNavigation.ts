import { useState, useRef } from 'react';

// ===== NAVIGATION STATE HOOK =====
// Verwaltet alle Navigation-States für die App

export interface NavigationState {
  showHome: boolean;
  showMyFlashcards: boolean;
  showKITools: boolean;
  showExamSimulation: boolean;
  showGenerateFlashcards: boolean;
  showCompletedExams: boolean;
  showChats: boolean;
  showAccountEdit: boolean;
  showTodoManagement: boolean;
  showKlassenarbeiten: boolean;
  showLernanalyse: boolean;
  showSchulaufgaben: boolean;
  showSchuleUndKlasse: boolean;
  showMeetings: boolean;
  showTutoringActivation: boolean;
  showTutoringProgress: boolean;
  showTutoringSessionDetail: boolean;
  showTutoringExplain: boolean;
  selectedTutoringSessionId: string | null;
  mobileActiveTab: string;
}

// Animation-Lock Konstante: Mindest-Duration für Tab-Transitions (muss mit ScreenTransition.tsx übereinstimmen)
const ANIMATION_LOCK_DURATION = 350; // 350ms = gleich wie transition duration

export function useNavigation() {
  // Animation-Lock: Verhindert Race-Conditions bei schnellen Tab-Wechseln (muss VOR allen useState sein!)
  const isTransitioning = useRef(false);

  const [showHome, setShowHome] = useState(true);
  const [showMyFlashcards, setShowMyFlashcards] = useState(false);
  const [showKITools, setShowKITools] = useState(false);
  const [showProfil, setShowProfil] = useState(false);
  const [showProfilDesktop, setShowProfilDesktop] = useState(false);
  const [showExamSimulation, setShowExamSimulation] = useState(false);
  const [showGenerateFlashcards, setShowGenerateFlashcards] = useState(false);
  const [showCompletedExams, setShowCompletedExams] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [showAccountEdit, setShowAccountEdit] = useState(false);
  const [showTodoManagement, setShowTodoManagement] = useState(false);
  const [showKlassenarbeiten, setShowKlassenarbeiten] = useState(false);
  const [showLernanalyse, setShowLernanalyse] = useState(false);
  const [showSchulaufgaben, setShowSchulaufgaben] = useState(false);
  const [showSchuleUndKlasse, setShowSchuleUndKlasse] = useState(false);
  const [showMeetings, setShowMeetings] = useState(false);
  const [showTutoringActivation, setShowTutoringActivation] = useState(false);
  const [showTutoringProgress, setShowTutoringProgress] = useState(false);
  const [showTutoringSessionDetail, setShowTutoringSessionDetail] = useState(false);
  const [showTutoringExplain, setShowTutoringExplain] = useState(false);
  const [showExtraSessions, setShowExtraSessions] = useState(false);
  const [showLernStreak, setShowLernStreak] = useState(false);
  const [selectedTutoringSessionId, setSelectedTutoringSessionId] = useState<string | null>(null);
  const [mobileActiveTab, setMobileActiveTab] = useState('Home');
  
  // Teacher Profile
  const [showTeacherProfile, setShowTeacherProfile] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [teacherProfileOrigin, setTeacherProfileOrigin] = useState<'home' | 'chats'>('home');
  
  // Track previous screen before opening My Flashcards
  const [previousScreenBeforeMyFlashcards, setPreviousScreenBeforeMyFlashcards] = useState<'home' | 'kitools'>('home');
  
  // Track previous screen before opening Generate Flashcards
  const [previousScreenBeforeGenerate, setPreviousScreenBeforeGenerate] = useState<'home' | 'kitools' | 'myflashcards'>('kitools');
  
  // Track previous screen before opening Exam Simulation
  const [previousScreenBeforeExam, setPreviousScreenBeforeExam] = useState<'home' | 'kitools' | 'myflashcards'>('kitools');
  
  // Track previous screen before opening Completed Exams
  const [previousScreenBeforeCompletedExams, setPreviousScreenBeforeCompletedExams] = useState<'home' | 'kitools'>('kitools');
  
  // Track previous screen before opening Profil (für Close-Button Navigation)
  const [previousScreenBeforeProfil, setPreviousScreenBeforeProfil] = useState<'home' | 'kitools'>('home');
  
  // Track previous screen before opening Chats (für Close-Button Navigation)
  const [previousScreenBeforeChats, setPreviousScreenBeforeChats] = useState<'home' | 'kitools'>('home');
  
  // Track previous screen before opening Flashcard Set View
  const [previousScreenBeforeFlashcardSet, setPreviousScreenBeforeFlashcardSet] = useState<'home' | 'kitools' | 'myflashcards' | 'generateflashcards' | 'examsimulation' | 'completedexams'>('myflashcards');
  
  // Track transition direction for mobile animations
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | 'up' | 'down'>('right');

  /**
   * Navigiert zum Home Screen
   */
  const navigateToHome = () => {
    setShowHome(true);
    setShowMyFlashcards(false);
    setShowKITools(false);
    setShowProfil(false);
    setShowProfilDesktop(false);
    setShowExamSimulation(false);
    setShowGenerateFlashcards(false);
    setShowCompletedExams(false);
    setShowChats(false);
    setShowTodoManagement(false);
    setShowLernanalyse(false);
    setShowMeetings(false);
    setShowTeacherProfile(false);
    setSelectedTeacherId(null);
    setMobileActiveTab('Home');
  };

  /**
   * Navigiert zu My Flashcards
   * Desktop: Full Navigation (alle States reset)
   * Mobile: Overlay bleibt kompatibel via ScreenManager
   */
  const navigateToMyFlashcards = () => {
    // Track von wo wir kommen (für Close-Button Navigation)
    if (showHome) {
      setPreviousScreenBeforeMyFlashcards('home');
    } else if (showKITools) {
      setPreviousScreenBeforeMyFlashcards('kitools');
    }
    
    // My Flashcards is an OVERLAY — do NOT change ScreenManager states
    // (showHome, showKITools, showProfil must stay unchanged so the
    // underlying screen remains static while the overlay slides in/out)
    setShowMyFlashcards(true);
    // Close other overlays that might be open
    setShowExamSimulation(false);
    setShowGenerateFlashcards(false);
    setShowCompletedExams(false);
    setShowTodoManagement(false);
  };

  /**
   * Schließt My Flashcards und navigiert zurück zum vorherigen Screen
   */
  const closeMyFlashcards = () => {
    // Just close the overlay — underlying ScreenManager screen was never changed
    setShowMyFlashcards(false);
  };

  /**
   * Navigiert zu KI-Tools
   */
  const navigateToKITools = () => {
    setShowHome(false);
    setShowMyFlashcards(false);
    setShowKITools(true);
    setShowProfil(false);
    setShowProfilDesktop(false);
    setShowExamSimulation(false);
    setShowGenerateFlashcards(false);
    setShowCompletedExams(false);
    setShowChats(false);
    setShowTodoManagement(false);
    setShowLernanalyse(false);
    setShowMeetings(false);
    setShowTeacherProfile(false);
    setSelectedTeacherId(null);
    setMobileActiveTab('KI-Tools');
  };

  /**
   * Navigiert zu Completed Exams
   * Desktop: Full Navigation (alle States reset)
   * Mobile: Overlay bleibt kompatibel via ScreenManager
   */
  const navigateToCompletedExams = () => {
    // Track von wo wir kommen (für Close-Button Navigation)
    if (showHome) {
      setPreviousScreenBeforeCompletedExams('home');
    } else if (showKITools) {
      setPreviousScreenBeforeCompletedExams('kitools');
    }
    
    // Completed Exams is an OVERLAY — do NOT change ScreenManager states
    // (showHome, showKITools, showProfil must stay unchanged so the
    // underlying screen remains static while the overlay slides in/out)
    setShowCompletedExams(true);
    // Close other overlays that might be open
    setShowMyFlashcards(false);
    setShowExamSimulation(false);
    setShowGenerateFlashcards(false);
    setShowTodoManagement(false);
  };

  /**
   * Schließt Completed Exams und navigiert zurück zum vorherigen Screen
   */
  const closeCompletedExams = () => {
    // Just close the overlay — underlying ScreenManager screen was never changed
    setShowCompletedExams(false);
  };

  /**
   * Navigiert zu Profil
   * Trackt automatisch den vorherigen Screen für Back-Navigation
   */
  const navigateToProfil = () => {
    // Track von wo wir kommen (für Close-Button Navigation)
    if (showHome) {
      setPreviousScreenBeforeProfil('home');
    } else if (showKITools) {
      setPreviousScreenBeforeProfil('kitools');
    }
    
    setShowHome(false);
    setShowMyFlashcards(false);
    setShowKITools(false);
    setShowProfil(true);
    setShowExamSimulation(false);
    setShowGenerateFlashcards(false);
    setShowCompletedExams(false);
    setShowChats(false);
    setMobileActiveTab('Profil');
  };

  /**
   * Navigiert zu Chats
   * Trackt automatisch den vorherigen Screen für Back-Navigation
   */
  const navigateToChats = () => {
    // Track von wo wir kommen (für Close-Button Navigation)
    if (showHome) {
      setPreviousScreenBeforeChats('home');
    } else if (showKITools) {
      setPreviousScreenBeforeChats('kitools');
    }
    
    setShowHome(false);
    setShowMyFlashcards(false);
    setShowKITools(false);
    setShowProfil(false);
    setShowProfilDesktop(false);
    setShowExamSimulation(false);
    setShowGenerateFlashcards(false);
    setShowCompletedExams(false);
    setShowChats(true);
    setShowTodoManagement(false);
    setShowLernanalyse(false);
    setShowMeetings(false);
    setShowTeacherProfile(false);
    setSelectedTeacherId(null);
    setMobileActiveTab('Chats');
  };

  /**
   * Schließt Chats und navigiert zurück zum vorherigen Screen
   */
  const closeChats = () => {
    setShowChats(false);
    
    if (previousScreenBeforeChats === 'home') {
      setShowHome(true);
      setShowKITools(false);
      setMobileActiveTab('Home');
    } else if (previousScreenBeforeChats === 'kitools') {
      setShowHome(false);
      setShowKITools(true);
      setMobileActiveTab('KI-Tools');
    }
  };

  /**
   * Schließt Profil und navigiert zurück zum vorherigen Screen
   */
  const closeProfil = () => {
    setShowProfil(false);
    
    if (previousScreenBeforeProfil === 'home') {
      setShowHome(true);
      setShowKITools(false);
      setMobileActiveTab('Home');
    } else if (previousScreenBeforeProfil === 'kitools') {
      setShowHome(false);
      setShowKITools(true);
      setMobileActiveTab('KI-Tools');
    }
  };

  /**
   * Öffnet Exam Simulation
   */
  const openExamSimulation = () => {
    // Remember where we came from
    if (showHome) {
      setPreviousScreenBeforeExam('home');
    } else if (showKITools) {
      setPreviousScreenBeforeExam('kitools');
    } else if (showMyFlashcards) {
      setPreviousScreenBeforeExam('myflashcards');
    }
    
    setShowExamSimulation(true);
    // Note: We DON'T hide the underlying screens anymore to prevent re-mounting
    // The modal renders on top with higher z-index
  };

  /**
   * Schließt Exam Simulation - Screens bleiben wie sie waren (kein Re-Mount)
   */
  const closeExamSimulation = (isMobile: boolean) => {
    setShowExamSimulation(false);
    // Note: Underlying screens stay mounted - we only close the modal layer
    // The previous screen is still visible because it was never hidden
  };

  /**
   * Öffnet Generate Flashcards
   * Desktop: Inline im ContentRouter (hat Priorität über andere Content-Screens)
   * Mobile: Overlay-Modal via ModalManager (Screens bleiben wie sie sind)
   */
  const openGenerateFlashcards = () => {
    // Remember where we came from
    if (showHome) {
      setPreviousScreenBeforeGenerate('home');
    } else if (showKITools) {
      setPreviousScreenBeforeGenerate('kitools');
    } else if (showMyFlashcards) {
      setPreviousScreenBeforeGenerate('myflashcards');
    }
    
    setShowGenerateFlashcards(true);
    // Note: We DON'T hide the underlying screens anymore.
    // Desktop: ContentRouter checks showGenerateFlashcards FIRST (priority routing).
    // Mobile: ModalManager renders it as overlay on top of everything.
  };

  /**
   * Schließt Generate Flashcards und navigiert zurück zum vorherigen Screen
   */
  const closeGenerateFlashcards = (isMobile: boolean) => {
    setShowGenerateFlashcards(false);
    // Underlying screens stay mounted — we only close the generate flashcards layer
  };

  /**
   * Schließt Generate Flashcards und navigiert zu My Flashcards (nach erfolgreicher Generierung)
   */
  const closeGenerateFlashcardsAndNavigateToMyFlashcards = (isMobile: boolean) => {
    setShowGenerateFlashcards(false);
    // My Flashcards is an overlay — do NOT change ScreenManager states
    setShowMyFlashcards(true);
  };

  /**
   * Trackt den aktuellen Screen bevor ein Flashcard-Set geöffnet wird
   * Optional: Override für spezielle Cases (z.B. nach Generate Flashcards immer zu My Flashcards)
   */
  const trackCurrentScreenBeforeFlashcardSet = (override?: 'home' | 'kitools' | 'myflashcards' | 'generateflashcards' | 'examsimulation' | 'completedexams') => {
    if (override) {
      setPreviousScreenBeforeFlashcardSet(override);
      return;
    }
    
    // Priority order (highest to lowest):
    // 1. Modals (Generate Flashcards, Exam Simulation)
    // 2. Overlays (My Flashcards, Completed Exams) — checked BEFORE underlying screens
    // 3. Underlying screens (KI-Tools, Home)
    // 4. Fallback: My Flashcards (Desktop default when showHome = false)
    
    if (showGenerateFlashcards) {
      setPreviousScreenBeforeFlashcardSet('generateflashcards');
    } else if (showExamSimulation) {
      setPreviousScreenBeforeFlashcardSet('examsimulation');
    } else if (showCompletedExams) {
      setPreviousScreenBeforeFlashcardSet('completedexams');
    } else if (showMyFlashcards) {
      setPreviousScreenBeforeFlashcardSet('myflashcards');
    } else if (showKITools) {
      setPreviousScreenBeforeFlashcardSet('kitools');
    } else if (showHome) {
      setPreviousScreenBeforeFlashcardSet('home');
    } else {
      // Fallback: Wenn nichts explizit aktiv ist (z.B. Desktop My Flashcards via Sidebar),
      // ist der Standard "myflashcards"
      setPreviousScreenBeforeFlashcardSet('myflashcards');
    }
  };

  /**
   * Navigiert zurück zur vorherigen View nach dem Schließen des Flashcard-Sets
   * Optional: Callback um z.B. Tab auf "Repeat" zu setzen
   */
  const navigateBackFromFlashcardSet = (isMobile: boolean, onNavigateToMyFlashcards?: () => void) => {
    // Navigate back to where we came from
    if (previousScreenBeforeFlashcardSet === 'generateflashcards') {
      setShowGenerateFlashcards(true);
      setShowExamSimulation(false);
      setShowHome(false);
      setShowKITools(false);
      setShowMyFlashcards(false);
      setShowCompletedExams(false);
      // Mobile tab stays the same
    } else if (previousScreenBeforeFlashcardSet === 'examsimulation') {
      setShowExamSimulation(true);
      setShowGenerateFlashcards(false);
      setShowHome(false);
      setShowKITools(false);
      setShowMyFlashcards(false);
      setShowCompletedExams(false);
      // Mobile tab stays the same
    } else if (previousScreenBeforeFlashcardSet === 'completedexams') {
      setShowHome(false);
      setShowKITools(false);
      setShowMyFlashcards(false);
      setShowExamSimulation(false);
      setShowGenerateFlashcards(false);
      setShowCompletedExams(true);
      if (isMobile) {
        setMobileActiveTab('Completed Exams');
      }
    } else if (previousScreenBeforeFlashcardSet === 'home') {
      setShowHome(true);
      setShowKITools(false);
      setShowMyFlashcards(false);
      setShowExamSimulation(false);
      setShowGenerateFlashcards(false);
      setShowCompletedExams(false);
      if (isMobile) {
        setMobileActiveTab('Home');
      }
    } else if (previousScreenBeforeFlashcardSet === 'kitools') {
      setShowHome(false);
      setShowKITools(true);
      setShowMyFlashcards(false);
      setShowExamSimulation(false);
      setShowGenerateFlashcards(false);
      setShowCompletedExams(false);
      if (isMobile) {
        setMobileActiveTab('KI-Tools');
      }
    } else if (previousScreenBeforeFlashcardSet === 'myflashcards') {
      // My Flashcards is an OVERLAY — don't touch underlying screen states (showHome, showKITools)
      // Just ensure the overlay is open and close other modals
      setShowMyFlashcards(true);
      setShowExamSimulation(false);
      setShowGenerateFlashcards(false);
      setShowCompletedExams(false);
      if (isMobile) {
        setMobileActiveTab('My Flashcards');
      }
      // Callback für spezielle Actions (z.B. Tab auf "Repeat" setzen nach Generate Flashcards)
      if (onNavigateToMyFlashcards) {
        onNavigateToMyFlashcards();
      }
    }
  };

  /**
   * Mobile Tab Change Handler with Transition Direction
   * Inkludiert Animation-Lock für smooth Transitions ohne Race-Conditions
   */
  const handleMobileTabChange = (tab: string) => {
    // 🔒 ANIMATION-LOCK: Ignoriere Klicks während Transition läuft
    if (isTransitioning.current) {
      console.log('⏳ Animation läuft noch - Klick ignoriert');
      return;
    }

    // Ignoriere Klick wenn der gleiche Tab schon aktiv ist
    if (tab === mobileActiveTab) {
      return;
    }

    // 🔒 Aktiviere Animation-Lock
    isTransitioning.current = true;

    // Determine transition direction based on tab order
    // Home (0) <- Meetings (1) <- Chats (2) <- KI-Tools (3) <- Profil (4)
    const tabOrder = { 'Home': 0, 'Meetings': 1, 'Chats': 2, 'KI-Tools': 3, 'Profil': 4 };
    const currentOrder = tabOrder[mobileActiveTab as keyof typeof tabOrder] || 0;
    const nextOrder = tabOrder[tab as keyof typeof tabOrder] || 0;
    
    // Set direction: right = forward (->), left = backward (<-)
    if (nextOrder > currentOrder) {
      setTransitionDirection('right'); // Slide from right (forward)
    } else if (nextOrder < currentOrder) {
      setTransitionDirection('left'); // Slide from left (backward)
    }
    
    setMobileActiveTab(tab);
    if (tab === 'KI-Tools') {
      navigateToKITools();
    } else if (tab === 'Home') {
      navigateToHome();
    } else if (tab === 'My Flashcards') {
      navigateToMyFlashcards();
    } else if (tab === 'Profil') {
      navigateToProfil();
    } else if (tab === 'Chats') {
      navigateToChats();
    } else if (tab === 'Meetings') {
      // Meetings is a ScreenManager screen — reset other main screens
      setShowHome(false);
      setShowKITools(false);
      setShowMyFlashcards(false);
      setShowProfil(false);
      setShowChats(false);
      setShowMeetings(true);
    } else {
      setShowHome(false);
      setShowKITools(false);
      setShowMyFlashcards(false);
      setShowProfil(false);
      setShowChats(false);
    }

    // 🔓 Deaktiviere Animation-Lock nach Mindest-Duration
    setTimeout(() => {
      isTransitioning.current = false;
      console.log('✅ Animation-Lock released');
    }, ANIMATION_LOCK_DURATION);
  };

  /**
   * Navigiert zu Desktop Profil (nur für Desktop!)
   * 🔄 Synchronisiert auch showProfil + mobileActiveTab für nahtlosen Desktop↔Mobile Wechsel
   */
  const navigateToProfilDesktop = () => {
    setShowHome(false);
    setShowMyFlashcards(false);
    setShowKITools(false);
    setShowProfil(true);
    setShowProfilDesktop(true);
    setShowExamSimulation(false);
    setShowGenerateFlashcards(false);
    setShowCompletedExams(false);
    setShowChats(false);
    setShowTodoManagement(false);
    setShowLernanalyse(false);
    setShowMeetings(false);
    setShowTeacherProfile(false);
    setSelectedTeacherId(null);
    setMobileActiveTab('Profil');
  };

  /**
   * Schließt Desktop Profil
   */
  const closeProfilDesktop = () => {
    setShowProfilDesktop(false);
    setShowHome(true); // Zurück zu Home
  };

  /**
   * Navigiert zum ToDo-Management Screen
   */
  const navigateToTodoManagement = () => {
    // TodoManagement is an OVERLAY — do NOT change ScreenManager states
    setShowTodoManagement(true);
    // Close other overlays that might be open
    setShowMyFlashcards(false);
    setShowExamSimulation(false);
    setShowGenerateFlashcards(false);
    setShowCompletedExams(false);
  };

  /**
   * Schließt den ToDo-Management Screen
   */
  const closeTodoManagement = () => {
    // Just close the overlay — underlying ScreenManager screen was never changed
    setShowTodoManagement(false);
  };

  /**
   * Öffnet Lernanalyse als Overlay (Mobile) oder als Desktop-Screen
   */
  const openLernanalyse = () => {
    setShowLernanalyse(true);
    // On mobile, Lernanalyse is an overlay — don't touch underlying screen state.
    // On desktop, ContentRouter checks showLernanalyse with highest priority,
    // so underlying screen booleans can stay as-is.
  };

  /**
   * Schließt Lernanalyse und navigiert zurück zum Ursprungs-Screen
   */
  const closeLernanalyse = () => {
    setShowLernanalyse(false);
    // Underlying screen state was never changed, so the previous screen
    // (Home, Profil, KI-Tools) is still active — no animation glitch.
  };

  /**
   * Navigiert zu Meetings (Desktop)
   */
  const navigateToMeetings = () => {
    setShowHome(false);
    setShowMyFlashcards(false);
    setShowKITools(false);
    setShowProfil(false);
    setShowProfilDesktop(false);
    setShowExamSimulation(false);
    setShowGenerateFlashcards(false);
    setShowCompletedExams(false);
    setShowChats(false);
    setShowTodoManagement(false);
    setShowLernanalyse(false);
    setShowMeetings(true);
    setShowTeacherProfile(false);
    setSelectedTeacherId(null);
  };
  
  return {
    // States
    showHome,
    showMyFlashcards,
    showKITools,
    showProfil,
    showProfilDesktop,
    showExamSimulation,
    showGenerateFlashcards,
    showCompletedExams,
    showChats,
    showAccountEdit,
    showTodoManagement,
    showKlassenarbeiten,
    showLernanalyse,
    showSchulaufgaben,
    showSchuleUndKlasse,
    showMeetings,
    showTutoringActivation,
    showTutoringProgress,
    showTutoringSessionDetail,
    showTutoringExplain,
    showExtraSessions,
    showLernStreak,
    selectedTutoringSessionId,
    mobileActiveTab,
    transitionDirection,

    // Navigation Functions
    navigateToHome,
    navigateToMyFlashcards,
    navigateToKITools,
    navigateToProfil,
    navigateToProfilDesktop,
    navigateToCompletedExams,
    navigateToChats,
    closeMyFlashcards,
    closeProfil,
    closeProfilDesktop,
    closeCompletedExams,
    closeChats,
    openExamSimulation,
    closeExamSimulation,
    openGenerateFlashcards,
    closeGenerateFlashcards,
    closeGenerateFlashcardsAndNavigateToMyFlashcards,
    handleMobileTabChange,
    
    // Flashcard Set Navigation
    trackCurrentScreenBeforeFlashcardSet,
    navigateBackFromFlashcardSet,

    // Direct Setters (for special cases)
    setShowHome,
    setShowMyFlashcards,
    setShowKITools,
    setShowProfil,
    setShowCompletedExams,
    setShowChats,
    setShowAccountEdit,
    setShowTodoManagement,
    setShowKlassenarbeiten,
    setShowLernanalyse,
    setShowSchulaufgaben,
    setShowSchuleUndKlasse,
    setShowMeetings,
    setShowTutoringActivation,
    setShowTutoringProgress,
    setShowTutoringSessionDetail,
    setShowTutoringExplain,
    setShowExtraSessions,
    setShowLernStreak,
    setSelectedTutoringSessionId,
    
    // ToDo-Management Navigation
    navigateToTodoManagement,
    closeTodoManagement,

    // Lernanalyse Navigation
    openLernanalyse,
    closeLernanalyse,

    // Meetings Navigation
    navigateToMeetings,

    // Teacher Profile Navigation
    showTeacherProfile,
    selectedTeacherId,
    openTeacherProfile: (teacherId: string) => {
      setSelectedTeacherId(teacherId);
      setShowTeacherProfile(true);
      // Track origin for back navigation
      if (showChats) {
        setTeacherProfileOrigin('chats');
      } else {
        setTeacherProfileOrigin('home');
      }
      // Desktop: Reset all other screens
      setShowHome(false);
      setShowMyFlashcards(false);
      setShowKITools(false);
      setShowProfil(false);
      setShowProfilDesktop(false);
      setShowExamSimulation(false);
      setShowGenerateFlashcards(false);
      setShowCompletedExams(false);
      setShowChats(false);
      setShowTodoManagement(false);
      setShowLernanalyse(false);
      setShowMeetings(false);
    },
    closeTeacherProfile: () => {
      setShowTeacherProfile(false);
      setSelectedTeacherId(null);
      // Navigate back to origin screen
      if (teacherProfileOrigin === 'chats') {
        setShowChats(true);
        setMobileActiveTab('Chats');
      } else {
        setShowHome(true);
        setMobileActiveTab('Home');
      }
    },
  };
}