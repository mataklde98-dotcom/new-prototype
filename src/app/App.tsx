// ===== SOSTUDY - ULTRA-CLEAN APP =====
// Enterprise-Level Architecture with Perfect Separation of Concerns
// v1.6.5 - Force clean rebuild after hideBottomNav fix
// v1.6.6 - Calendar date picker redesign
// v1.6.7 - ScoreRing threshold fix + force rebuild

import React, { useState, useEffect, useRef } from "react";
import { UserProvider, useUser } from "@/contexts/UserContext";
import MainLayout from "@/app/components/MainLayout";
import ContentRouter from "@/app/components/ContentRouter";
import ModalManager from "@/app/components/ModalManager";
import HomeScreenMobile from "@/app/components/HomeScreenMobile";
import KIToolsScreen from "@/app/components/KIToolsScreen";
import MyFlashcardsScreenMobile from "@/app/components/MyFlashcardsScreenMobile";
import CompletedExamsScreenMobile from "@/app/components/CompletedExamsScreenMobile";
import ProfilScreenMobile from "@/app/components/ProfilScreenMobile";
import ChatScreenMobile from "@/app/components/ChatScreenMobile";
import TodoManagementScreen from "./components/TodoManagementScreen";
import ProfileAnalyticsScreen from "./components/ProfileAnalyticsScreen";
import AccountEditScreenMobile from "./components/AccountEditScreenMobile";
import KlassenarbeitenScreen from "./components/KlassenarbeitenScreen";
import SchulaufgabenScreen from "./components/SchulaufgabenScreen";
import SchuleUndKlasseScreen from "./components/SchuleUndKlasseScreen";
import MeetingsScreen from "./components/MeetingsScreen";
import TeacherProfileScreen from "./components/TeacherProfileScreen";
import CreateOwnSetModal from "./components/CreateOwnSetModal";
import TutoringActivationFlow from "./components/TutoringActivationFlow";
import TutoringProgressScreen from "./components/TutoringProgressScreen";
import TutoringSessionDetailScreen from "./components/TutoringSessionDetailScreen";
import TutoringExplainScreen from "./components/TutoringExplainScreen";
import ExtraSessionsScreen from "./components/ExtraSessionScreen";
import LernStreakScreen from "./components/LernStreakScreen";
import OnboardingTrialPopup from "./components/OnboardingTrialPopup";
import AuthWrapper from "@/app/components/AuthWrapper";
import { ScreenManager } from "@/app/components/ScreenManager";
import { MobileRouteTransition } from "@/app/components/MobileRouteTransition";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import { DeveloperConsole } from "@/app/components/DeveloperConsole";
import DebugLayoutOverlay from "@/app/components/DebugLayoutOverlay";
import { setPendingUploadRequest } from "@/stores/uploadRequestStore";
import { teacherTasksStore } from "./components/teacherTasksStore";
import { weaknessCardStore } from "./components/weaknessCardStore";
import { getWeaknessCardId, getKICardCount, getKIExamDuration } from "./components/weaknessCardStore";
import { getCompletedExams } from '@/examapp/utils/completedExamsStorage';
import { prepTodoStore } from './components/prepTodoStore';
// 🚀 120Hz Performance Tools (Development Only)
// import { Performance120HzDemo } from "@/app/components/Performance120HzDemo";
// import { PerformanceMonitor } from "@/app/components/PerformanceMonitor";

// Hooks
import {
  useFlashcards,
  useFlashcardHandlers,
  useFlashcardSetView,
  useWindowSize,
  useNavigation,
  useFlashcardFilters,
  useSelection,
  useUIState,
  useDeleteModal,
  useAppHandlers,
  useDerivedState,
  useLayoutProps,
  useModalProps,
  useScreenManager,
} from "@/hooks";

// Types
import { FlashcardSet } from "@/types/flashcard";

// ===== ACCOUNT EDIT OVERLAY (needs useUser inside UserProvider) =====
function MobileAccountEditOverlay({ onClose }: { onClose: () => void }) {
  const { accountData, setAccountData } = useUser();
  return (
    <AccountEditScreenMobile
      onBack={onClose}
      initialData={accountData}
      onSave={setAccountData}
      externalTransition
    />
  );
}

// ===== SCHULE UND KLASSE OVERLAY (needs useUser inside UserProvider) =====
function MobileSchuleUndKlasseOverlay({ onClose }: { onClose: () => void }) {
  const { accountData, setAccountData } = useUser();
  return (
    <SchuleUndKlasseScreen
      onBack={onClose}
      accountData={accountData}
      onSave={setAccountData}
      externalTransition
    />
  );
}

// ===== MAIN APP (ULTRA-CLEAN - ~200 LINES) =====
export default function App() {
  // v1.5.9 force clean rebuild
  return (
    <AuthWrapper>
      {(userData, handleLogout) => (
        <AppContent userData={userData} onLogout={handleLogout} />
      )}
    </AuthWrapper>
  );
}

// ===== APP CONTENT (Only rendered when logged in) =====
function AppContent({ userData, onLogout }: { userData: any; onLogout: () => void }) {
  // ===== CORE STATE =====
  const { windowWidth, windowHeight } = useWindowSize();
  const isMobile = windowWidth < 768;
  
  // ===== FLASHCARD DATA (3-Layer Architecture) =====
  const flashcards = useFlashcards();
  const { allSets, setAllSets, addSet, updateProgressAndCards } = flashcards;
  
  // Create Own Set Modal State
  const [showCreateOwnSetModal, setShowCreateOwnSetModal] = useState(false);

  // Track if Home's bottom sheet is open (AllTutors / AllExtraSessions) — used to hide MobileNavigation
  const [homeBottomSheetOpen, setHomeBottomSheetOpen] = useState(false);

  // Track if we need to refresh Completed Exams list after closing exam modal
  const [refreshCompletedExams, setRefreshCompletedExams] = useState(0);

  // Weakness context for generating flashcards from Lernanalyse
  const [weaknessContext, setWeaknessContext] = useState<{ topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo' | 'learning-goal' | 'recommendation'; cardCount?: number; examTitle?: string; examId?: string; taskIndex?: number; severityLabel?: string; contextLabel?: string; notificationLabel?: string; assignedDate?: string; teacherTaskId?: string } | null>(null);

  // Exam weakness context — pre-fill exam simulation from Lernanalyse weakness card
  const [examWeaknessContext, setExamWeaknessContext] = useState<{ topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo' | 'learning-goal' | 'recommendation'; cardCount?: number; examTitle?: string; examDurationMinutes?: number; severityLabel?: string; contextLabel?: string; notificationLabel?: string; assignedDate?: string; teacherTaskId?: string } | null>(null);

  // Track exam count before opening the exam feature — only write grade if a NEW exam was completed
  const examCountBeforeOpenRef = useRef<number>(0);

  // Pending prep task link — when a flashcard set is created for a prep-todo, link it back
  const [pendingPrepTaskLink, setPendingPrepTaskLink] = useState<{ examId: string; taskIndex: number; setId: number } | null>(null);

  // Pending chat teacher ID — when navigating from Teacher Profile → Chat
  const [pendingChatTeacherId, setPendingChatTeacherId] = useState<string | null>(null);

  // Pending Extra-Session ID — when tapping an Extra-Stunde card in Home, navigate to Meetings and open its detail view
  const [pendingExtraSessionId, setPendingExtraSessionId] = useState<string | null>(null);

  // ===== ONBOARDING TRIAL POPUP =====
  // Prototyping-Modus: Popup wird nach jeder Registrierung angezeigt,
  // aber NICHT nach einem normalen Login. Das `isNewRegistration`-Flag
  // wird nur in RegisterScreen gesetzt.
  const [showOnboardingTrial, setShowOnboardingTrial] = useState(false);

  useEffect(() => {
    const isNewReg = localStorage.getItem('isNewRegistration');
    if (isNewReg) {
      // Prototyping: Immer nach Registrierung anzeigen, auch wenn Trial schon mal gestartet wurde
      const timer = setTimeout(() => setShowOnboardingTrial(true), 700);
      return () => clearTimeout(timer);
    }
    // --- Produktions-Logik (später aktivieren): ---
    // if (isNewReg && !localStorage.getItem('trialStartedAt')) {
    //   const timer = setTimeout(() => setShowOnboardingTrial(true), 700);
    //   return () => clearTimeout(timer);
    // }
  }, []);

  const handleStartTrial = () => {
    localStorage.setItem('trialStartedAt', new Date().toISOString());
    localStorage.removeItem('isNewRegistration');
    setShowOnboardingTrial(false);
  };

  const handleDismissTrial = () => {
    localStorage.removeItem('isNewRegistration');
    setShowOnboardingTrial(false);
  };

  // ===== CUSTOM HOOKS (State Management) =====
  const navigation = useNavigation();
  const filters = useFlashcardFilters();
  const selection = useSelection();
  const uiState = useUIState();
  const deleteModal = useDeleteModal();
  const flashcardSetView = useFlashcardSetView();

  // 🚀 Overlay mount/unmount is now handled inside MobileRouteTransition (centralized).
  
  // ===== SCREEN MANAGER (Performance Optimization) =====
  const screenManager = useScreenManager({
    showHome: navigation.showHome,
    showMyFlashcards: navigation.showMyFlashcards,
    showKITools: navigation.showKITools,
    showProfil: navigation.showProfil,
    showCompletedExams: navigation.showCompletedExams,
    showChats: navigation.showChats,
    showMeetings: navigation.mobileActiveTab === 'Meetings',
    isMobile,
  });

  // ===== DERIVED STATE (Computed Values) =====
  const derived = useDerivedState({
    allSets,
    activeTab: filters.activeTab,
    activeSubject: filters.activeSubject,
    activeKategorie: filters.activeKategorie,
    activeThema: filters.activeThema,
    activeUnterthema: filters.activeUnterthema,
    searchQuery: uiState.searchQuery,
    currentPage: uiState.currentPage,
    sidebarCollapsed: uiState.sidebarCollapsed,
    windowWidth,
    windowHeight,
    isMobile,
  });

  // ===== HANDLERS HOOK =====
  const handlers = useFlashcardHandlers(
    filters.setSubject,
    filters.setKategorie,
    filters.setThema,
    filters.setUnterthema,
    uiState.resetPage,
    setAllSets,
    selection.setSelectedCards,
    selection.setSelectionMode,
    deleteModal.setShowDeleteConfirm,
    derived.sortedSets,
    selection.selectedCards,
    deleteModal.deleteMode,
    derived.tabFilteredSets
  );

  // ===== APP EVENT HANDLERS HOOK =====
  const appHandlers = useAppHandlers({
    selectionMode: selection.selectionMode,
    addSet,
    updateProgressAndCards,
    prepareFlashcardSetForOpening: handlers.prepareFlashcardSetForOpening,
    trackCurrentScreenBeforeFlashcardSet: navigation.trackCurrentScreenBeforeFlashcardSet,
    closeGenerateFlashcardsAndNavigateToMyFlashcards: navigation.closeGenerateFlashcardsAndNavigateToMyFlashcards,
    navigateBackFromFlashcardSet: navigation.navigateBackFromFlashcardSet,
    openExamSimulation: navigation.openExamSimulation,
    openFlashcardSet: flashcardSetView.openFlashcardSet,
    closeFlashcardSet: flashcardSetView.closeFlashcardSet,
    setActiveTab: filters.setActiveTab,
  });

  // ===== PROPS BUNDLING (Layout & Modals) =====
  const layoutProps = useLayoutProps({
    isMobile,
    windowWidth,
    sidebarWidth: derived.sidebarWidth,
    sidebarCollapsed: uiState.sidebarCollapsed,
    mobileActiveTab: navigation.mobileActiveTab,
    showMyFlashcards: navigation.showMyFlashcards,
    showCompletedExams: navigation.showCompletedExams,
    showChats: navigation.showChats,
    showAccountEdit: navigation.showAccountEdit,
    showTodoManagement: navigation.showTodoManagement,
    showMeetings: navigation.showMeetings,
    showKlassenarbeiten: navigation.showKlassenarbeiten,
    showSchulaufgaben: navigation.showSchulaufgaben,
    showSchuleUndKlasse: navigation.showSchuleUndKlasse,
    showLernanalyse: navigation.showLernanalyse,
    showTutoringActivation: navigation.showTutoringActivation,
    showTutoringProgress: navigation.showTutoringProgress,
    showHomeBottomSheet: homeBottomSheetOpen,
    showExtraSessions: navigation.showExtraSessions,
    showLernStreak: navigation.showLernStreak,
    onToggleSidebar: uiState.toggleSidebar,
    onHomeClick: navigation.navigateToHome,
    onMyFlashcardsClick: () => {
      filters.changeTab('Repeat');
      navigation.navigateToMyFlashcards();
    },
    onNavigateToCompletedExams: navigation.navigateToCompletedExams,
    onNavigateToProfilDesktop: navigation.navigateToProfilDesktop,
    onNavigateToKITools: navigation.navigateToKITools,
    onNavigateToChats: () => {
      setPendingChatTeacherId(null);
      navigation.navigateToChats();
    },
    onNavigateToMeetings: navigation.navigateToMeetings,
    onOpenExamSimulation: navigation.openExamSimulation,
    onOpenGenerateFlashcards: navigation.openGenerateFlashcards,
    onOpenLernanalyse: navigation.openLernanalyse,
    onMobileTabChange: navigation.handleMobileTabChange,
  });

  const modalProps = useModalProps({
    showExamSimulation: navigation.showExamSimulation,
    showGenerateFlashcards: navigation.showGenerateFlashcards,
    showFlashcardSetView: flashcardSetView.showFlashcardSetView,
    selectedFlashcardSet: flashcardSetView.selectedFlashcardSet,
    showDeleteConfirm: deleteModal.showDeleteConfirm,
    deleteMode: deleteModal.deleteMode,
    allSets,
    sortedSets: derived.sortedSets,
    tabFilteredSets: derived.tabFilteredSets,
    selectedCount: selection.selectedCards.length,
    reviewingCompletedExam: appHandlers.reviewingCompletedExam,
    isMobile,
    onCloseExamSimulation: () => {
      // Only process grade if a NEW exam was completed during this session
      const examsNow = getCompletedExams();
      const hasNewExam = examsNow.length > examCountBeforeOpenRef.current;
      const gradeMap: Record<number, string> = { 1: '1', 1.3: '1-', 1.7: '2+', 2: '2', 2.3: '2-', 2.7: '3+', 3: '3', 3.3: '3-', 3.7: '4+', 4: '4', 4.3: '4-', 4.7: '5+', 5: '5', 5.3: '5-', 6: '6' };
      if (hasNewExam) {
        const latest = examsNow[0];
        const gradeStr = latest && latest.grade !== undefined ? (gradeMap[latest.grade] || String(latest.grade)) : null;
        // FLOW 1: Teacher-task exam completion
        if (gradeStr && examWeaknessContext?.source === 'teacher-task' && examWeaknessContext.teacherTaskId) {
          teacherTasksStore.completeExamTask(examWeaknessContext.teacherTaskId, gradeStr);
        }
        // REMOVED: Grades are NEVER written to weakness/risk/knowledge-gap cards
      }
      appHandlers.setReviewingCompletedExam(null);
      setRefreshCompletedExams(prev => prev + 1);
      navigation.closeExamSimulation(isMobile);
      setTimeout(() => setExamWeaknessContext(null), 350);
    },
    onCloseGenerateFlashcards: () => {
      navigation.closeGenerateFlashcards(isMobile);
      // Clear weakness context AFTER exit animation completes (300ms modal transition)
      setTimeout(() => {
        setWeaknessContext(null);
      }, 350);
    },
    onCloseFlashcardSetView: () => appHandlers.handleCloseFlashcardSetView(isMobile),
    onCloseDeleteModal: deleteModal.closeDeleteModal,
    onConfirmDelete: handlers.confirmDelete,
    onFlashcardSetCreated: (newSet) => {
      appHandlers.handleFlashcardSetCreated(newSet, isMobile);
      if ((weaknessContext?.source === 'prep-todo' || weaknessContext?.source === 'learning-goal') && weaknessContext.examId && weaknessContext.taskIndex !== undefined) {
        setPendingPrepTaskLink({ examId: weaknessContext.examId, taskIndex: weaknessContext.taskIndex, setId: newSet.id });
        // Sync to shared prepTodoStore
        prepTodoStore.linkFlashcardSetByParent(weaknessContext.examId, weaknessContext.taskIndex, newSet.id);
      }
      // FLOW 2a: Teacher-task flashcard linking (ContentRouter)
      if (weaknessContext?.source === 'teacher-task' && weaknessContext.teacherTaskId) {
        teacherTasksStore.linkFlashcardSet(weaknessContext.teacherTaskId, String(newSet.id));
      }
      // KI weakness card → link flashcard set
      if (weaknessContext && (weaknessContext.source === 'weakness' || weaknessContext.source === 'risk' || weaknessContext.source === 'knowledge-gap')) {
        const cardId = getWeaknessCardId(weaknessContext.source, weaknessContext.subject, weaknessContext.topic);
        weaknessCardStore.linkFlashcardSet(cardId, String(newSet.id));
      }
    },
    onFlashcardProgressUpdate: (setId: number, progress: number, cards: any[]) => {
      appHandlers.handleFlashcardProgressUpdate(setId, progress, cards);
      // FLOW 2b: Sync flashcard progress to any linked teacher task
      teacherTasksStore.updateFlashcardProgress(String(setId), progress);
      // Sync to weakness card store
      weaknessCardStore.updateFlashcardProgress(String(setId), progress);
      // Sync to prep todo store
      prepTodoStore.updateFlashcardProgress(setId, progress);
    },
    weaknessContext,
    examWeaknessContext,
  });

  // ===== EFFECTS =====
  // Load flashcard sets on mount
  useEffect(() => {
    flashcards.loadAllSets();
  }, []);

  useEffect(() => {
    if (uiState.currentPage > derived.totalPages && derived.totalPages > 0) {
      uiState.resetPage();
    }
  }, [derived.cardsPerPage, derived.totalPages, uiState.currentPage]);

  // ===== RENDER =====
  return (
    <ErrorBoundary>
      <UserProvider>
        <MainLayout {...layoutProps}>
      {/* Content Router */}
      <ContentRouter
        // Navigation
        showHome={navigation.showHome}
        showMyFlashcards={navigation.showMyFlashcards}
        showKITools={navigation.showKITools}
        showChats={navigation.showChats}
        showCompletedExams={navigation.showCompletedExams}
        showProfilDesktop={navigation.showProfilDesktop}
        showTodoManagement={navigation.showTodoManagement}
        showMeetings={navigation.showMeetings}
        showKlassenarbeiten={navigation.showKlassenarbeiten}
        showLernanalyse={navigation.showLernanalyse}
        showTeacherProfile={navigation.showTeacherProfile}
        selectedTeacherId={navigation.selectedTeacherId}
        onShowKlassenarbeitenChange={navigation.setShowKlassenarbeiten}
        onOpenLernanalyse={navigation.openLernanalyse}
        onCloseLernanalyse={navigation.closeLernanalyse}
        onGenerateForWeakness={(ctx) => {
          setWeaknessContext(ctx);
          navigation.openGenerateFlashcards();
        }}
        onStartExamForWeakness={(ctx) => {
          setExamWeaknessContext(ctx);
          examCountBeforeOpenRef.current = getCompletedExams().length;
          navigation.openExamSimulation();
        }}
        onCloseTeacherProfile={navigation.closeTeacherProfile}
        onOpenTeacherProfile={navigation.openTeacherProfile}
        onOpenChatWithTeacher={(teacherId: string) => {
          setPendingChatTeacherId(teacherId);
          navigation.closeTeacherProfile();
          setTimeout(() => navigation.navigateToChats(), 100);
        }}
        initialChatTeacherId={pendingChatTeacherId}
        pendingPrepTaskLink={pendingPrepTaskLink}
        isMobile={isMobile}

        // Generate Flashcards (inline desktop)
        showGenerateFlashcards={navigation.showGenerateFlashcards}
        onCloseGenerateFlashcards={() => {
          navigation.closeGenerateFlashcards(isMobile);
          setTimeout(() => setWeaknessContext(null), 350);
        }}
        onFlashcardSetCreated={(newSet) => {
          appHandlers.handleFlashcardSetCreated(newSet, isMobile);
          if ((weaknessContext?.source === 'prep-todo' || weaknessContext?.source === 'learning-goal') && weaknessContext.examId && weaknessContext.taskIndex !== undefined) {
            setPendingPrepTaskLink({ examId: weaknessContext.examId, taskIndex: weaknessContext.taskIndex, setId: newSet.id });
            // Sync to shared prepTodoStore
            prepTodoStore.linkFlashcardSetByParent(weaknessContext.examId, weaknessContext.taskIndex, newSet.id);
          }
          // FLOW 2a: Teacher-task flashcard linking (ContentRouter inline)
          if (weaknessContext?.source === 'teacher-task' && weaknessContext.teacherTaskId) {
            teacherTasksStore.linkFlashcardSet(weaknessContext.teacherTaskId, String(newSet.id));
          }
          // KI weakness card → link flashcard set
          if (weaknessContext && (weaknessContext.source === 'weakness' || weaknessContext.source === 'risk' || weaknessContext.source === 'knowledge-gap')) {
            const cardId = getWeaknessCardId(weaknessContext.source, weaknessContext.subject, weaknessContext.topic);
            weaknessCardStore.linkFlashcardSet(cardId, String(newSet.id));
          }
        }}
        weaknessContext={weaknessContext}

        // Exam Simulation (inline desktop)
        showExamSimulation={navigation.showExamSimulation}
        onCloseExamSimulation={() => {
          // Only process grade if a NEW exam was completed during this session
          const examsNow = getCompletedExams();
          const hasNewExam = examsNow.length > examCountBeforeOpenRef.current;
          const gradeMap: Record<number, string> = { 1: '1', 1.3: '1-', 1.7: '2+', 2: '2', 2.3: '2-', 2.7: '3+', 3: '3', 3.3: '3-', 3.7: '4+', 4: '4', 4.3: '4-', 4.7: '5+', 5: '5', 5.3: '5-', 6: '6' };
          if (hasNewExam) {
            const latest = examsNow[0];
            const gradeStr = latest && latest.grade !== undefined ? (gradeMap[latest.grade] || String(latest.grade)) : null;
            // FLOW 1: Teacher-task exam completion
            if (gradeStr && examWeaknessContext?.source === 'teacher-task' && examWeaknessContext.teacherTaskId) {
              teacherTasksStore.completeExamTask(examWeaknessContext.teacherTaskId, gradeStr);
            }
            // REMOVED: Grades are NEVER written to weakness/risk/knowledge-gap cards
          }
          appHandlers.setReviewingCompletedExam(null);
          setRefreshCompletedExams(prev => prev + 1);
          navigation.closeExamSimulation(isMobile);
          setTimeout(() => setExamWeaknessContext(null), 350);
        }}
        reviewingCompletedExam={appHandlers.reviewingCompletedExam || undefined}
        examWeaknessContext={examWeaknessContext}

        // Window
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        sidebarCollapsed={uiState.sidebarCollapsed}

        // Filters
        activeTab={filters.activeTab}
        activeSubject={filters.activeSubject}
        activeKategorie={filters.activeKategorie}
        activeThema={filters.activeThema}
        activeUnterthema={filters.activeUnterthema}
        searchQuery={filters.searchQuery}

        // UI State
        showSearch={uiState.showSearch}
        searchClosing={uiState.searchClosing}
        showOptionsMenu={uiState.showOptionsMenu}
        currentPage={uiState.currentPage}

        // Selection
        selectionMode={selection.selectionMode}
        selectedCards={selection.selectedCards}

        // Data
        allSets={allSets}
        paginatedSets={derived.paginatedSets}
        sortedSets={derived.sortedSets}
        totalPages={derived.totalPages}
        gridColumns={derived.gridColumns}

        // Handlers
        onNavigateToHome={navigation.navigateToHome}
        onNavigateToKITools={navigation.navigateToKITools}
        onNavigateToMyFlashcards={() => {
          filters.changeTab('Repeat');
          navigation.navigateToMyFlashcards();
        }}
        onNavigateToCompletedExams={navigation.navigateToCompletedExams}
        onLogout={onLogout}
        onOpenExamSimulation={navigation.openExamSimulation}
        onOpenGenerateFlashcards={navigation.openGenerateFlashcards}
        onOpenFlashcardSet={appHandlers.handleOpenFlashcardSet}
        onCompletedExamClick={(examId) => appHandlers.handleCompletedExamClick(examId, 'Desktop')}
        refreshCompletedExams={refreshCompletedExams}
        onMobileTabChange={navigation.handleMobileTabChange}
        onTabChange={filters.changeTab}
        onSubjectChange={handlers.handleSubjectChange}
        onKategorieChange={handlers.handleKategorieChange}
        onThemaChange={handlers.handleThemaChange}
        onUnterthemaChange={handlers.handleUnterthemaChange}
        onSearchChange={filters.setSearchQuery}
        onOpenSearch={uiState.openSearch}
        onCloseSearch={uiState.closeSearch}
        onToggleOptionsMenu={uiState.toggleOptionsMenu}
        onCloseOptionsMenu={uiState.closeOptionsMenu}
        onEnterSelectionMode={selection.enterSelectionMode}
        onDeleteFiltered={deleteModal.openDeleteFiltered}
        onDeleteAll={deleteModal.openDeleteAll}
        onToggleCardSelection={handlers.toggleCardSelection}
        onSelectAll={() => selection.selectAll(derived.sortedSets.map(s => s.id))}
        onCancelSelection={handlers.cancelSelection}
        onDeleteSelected={deleteModal.openDeleteSelected}
        onPageChange={uiState.setCurrentPage}
        onCreateOwnSet={() => setShowCreateOwnSetModal(true)}
        onNavigateToTodoManagement={navigation.navigateToTodoManagement}
        onCloseTodoManagement={navigation.closeTodoManagement}
        onRequestUpload={(taskId, subject, grade) => {
          // Store prefill data for KlassenarbeitenScreen
          setPendingUploadRequest({ linkedTaskId: taskId, subject, grade });
          // Close TodoManagement and navigate to Profil with KlassenarbeitenScreen
          navigation.closeTodoManagement();
          setTimeout(() => {
            navigation.navigateToProfilDesktop();
            navigation.setShowKlassenarbeiten(true);
          }, 100);
        }}
        onOpenTutoringActivation={() => navigation.setShowTutoringActivation(true)}
        onOpenTutoringProgress={() => navigation.setShowTutoringProgress(true)}
      />

      {/* 🚀 OPTIMIZED SCREEN MANAGER - Only renders active screen! */}
      {isMobile && (
        <ScreenManager
          activeScreen={screenManager.activeScreen}
          transitionDirection={navigation.transitionDirection}
          screens={[
            {
              key: 'home',
              component: (
                <HomeScreenMobile
                   onNavigateToKITools={() => navigation.handleMobileTabChange('KI-Tools')}
                   onNavigateToMyFlashcards={() => {
                     filters.changeTab('Repeat');
                     navigation.navigateToMyFlashcards();
                   }}
                   onNavigateToExamSimulation={navigation.openExamSimulation}
                   onNavigateToGenerateFlashcards={navigation.openGenerateFlashcards}
                   onNavigateToTodoManagement={navigation.navigateToTodoManagement}
                   onNavigateToLernanalyse={navigation.openLernanalyse}
                   onNavigateToCompletedExams={navigation.navigateToCompletedExams}
                   onOpenTeacherProfile={navigation.openTeacherProfile}
                   onOpenTutoringActivation={() => navigation.setShowTutoringActivation(true)}
                   onOpenTutoringProgress={() => navigation.setShowTutoringProgress(true)}
                   onShowKlassenarbeiten={() => navigation.setShowKlassenarbeiten(true)}
                   onShowSchulaufgaben={() => navigation.setShowSchulaufgaben(true)}
                   onOpenStreakScreen={() => navigation.setShowLernStreak(true)}
                   allSets={allSets}
                   onOpenFlashcardSet={appHandlers.handleOpenFlashcardSet}
                   onCompletedExamClick={(examId) => appHandlers.handleCompletedExamClick(examId, 'Mobile')}
                   refreshCompletedExams={refreshCompletedExams}
                   onGenerateForWeakness={(ctx) => {
                     setWeaknessContext(ctx);
                     navigation.openGenerateFlashcards();
                   }}
                   onStartExamSimulation={(ctx) => {
                     setExamWeaknessContext(ctx);
                     examCountBeforeOpenRef.current = getCompletedExams().length;
                     navigation.openExamSimulation();
                   }}
                   onBottomSheetChange={setHomeBottomSheetOpen}
                   onOpenExtraSession={(id) => setPendingExtraSessionId(id)}
                 />
              ),
            },
            {
              key: 'ki-tools',
              component: (
                <KIToolsScreen
                  onClose={navigation.navigateToHome}
                  onNavigateToMyFlashcards={() => {
                    filters.changeTab('Repeat');
                    navigation.navigateToMyFlashcards();
                  }}
                  onNavigateToExamSimulation={navigation.openExamSimulation}
                  onNavigateToGenerateFlashcards={navigation.openGenerateFlashcards}
                  onNavigateToCompletedExams={navigation.navigateToCompletedExams}
                  onNavigateToLernanalyse={navigation.openLernanalyse}
                />
              ),
            },
            {
              key: 'profil',
              component: (
                <ProfilScreenMobile
                  onClose={navigation.closeProfil}
                  onLogout={onLogout}
                  onAccountEditChange={navigation.setShowAccountEdit}
                  showKlassenarbeiten={navigation.showKlassenarbeiten}
                  onShowKlassenarbeitenChange={navigation.setShowKlassenarbeiten}
                  showSchulaufgaben={navigation.showSchulaufgaben}
                  onShowSchulaufgabenChange={navigation.setShowSchulaufgaben}
                  onOpenLernanalyse={navigation.openLernanalyse}
                  onShowSchuleUndKlasse={navigation.setShowSchuleUndKlasse}
                  onOpenTutoringActivation={() => navigation.setShowTutoringActivation(true)}
                  onOpenTutoringProgress={() => navigation.setShowTutoringProgress(true)}
                  onOpenExtraSessions={() => navigation.setShowExtraSessions(true)}
                />
              ),
            },
            {
              key: 'chats',
              component: (
                <ChatScreenMobile
                  onClose={navigation.closeChats}
                  onOpenTeacherProfile={navigation.openTeacherProfile}
                  onOpenTutoringActivation={() => navigation.setShowTutoringActivation(true)}
                />
              ),
            },
            {
              key: 'meetings',
              component: (
                <MeetingsScreen
                  isMobile={true}
                  onOpenTutoringActivation={() => navigation.setShowTutoringActivation(true)}
                  onOpenTutoringSession={(sessionId) => {
                    navigation.setSelectedTutoringSessionId(sessionId);
                    navigation.setShowTutoringSessionDetail(true);
                  }}
                />
              ),
            },
          ]}
        />
      )}

      {/* Modals */}
      <ModalManager {...modalProps} />

      {/* 🚀 Mobile My Flashcards Screen - Overlay with Slide-In/Out */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showMyFlashcards}>
          <MyFlashcardsScreenMobile
            windowWidth={windowWidth}
            allSets={derived.tabFilteredSets}
            sortedSets={derived.sortedSets}
            activeTab={filters.activeTab}
            activeSubject={filters.activeSubject === 'Alle Fächer' || filters.activeSubject === 'All' ? null : filters.activeSubject}
            activeKategorie={filters.activeKategorie || null}
            activeThema={filters.activeThema || null}
            activeUnterthema={filters.activeUnterthema || null}
            searchQuery={uiState.searchQuery}
            showSearch={uiState.showSearch}
            searchClosing={uiState.searchClosing}
            showOptionsMenu={uiState.showOptionsMenu}
            selectionMode={selection.selectionMode}
            selectedCards={selection.selectedCards}
            currentPage={uiState.currentPage}
            totalPages={derived.totalPages}
            paginatedSets={derived.paginatedSets}
            gridColumns={derived.gridColumns}
            onTabChange={filters.changeTab}
            onSubjectChange={(subject) => filters.setSubject(subject || 'All')}
            onKategorieChange={(kategorie) => filters.setKategorie(kategorie || '')}
            onThemaChange={(thema) => filters.setThema(thema || '')}
            onUnterthemaChange={(unterthema) => filters.setUnterthema(unterthema || '')}
            onSearchChange={uiState.setSearchQuery}
            onOpenSearch={uiState.openSearch}
            onCloseSearch={uiState.closeSearch}
            onToggleOptionsMenu={uiState.toggleOptionsMenu}
            onCloseOptionsMenu={uiState.closeOptionsMenu}
            onEnterSelectionMode={selection.enterSelectionMode}
            onDeleteFiltered={deleteModal.openDeleteFiltered}
            onDeleteAll={deleteModal.openDeleteAll}
            onOpenFlashcardSet={appHandlers.handleOpenFlashcardSet}
            onToggleCardSelection={selection.toggleCard}
            onSelectAllCards={selection.selectCards}
            onCancelSelection={selection.exitSelectionMode}
            onDeleteSelected={deleteModal.openDeleteSelected}
            onPageChange={uiState.setCurrentPage}
            onClose={navigation.closeMyFlashcards}
            onCreateOwnSet={() => setShowCreateOwnSetModal(true)}
            onOpenTutoringActivation={() => navigation.setShowTutoringActivation(true)}
          />
        </MobileRouteTransition>
      )}

      {/* 🚀 Mobile Completed Exams Screen - Overlay with Slide-In/Out */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showCompletedExams}>
          <CompletedExamsScreenMobile
            onClose={navigation.closeCompletedExams}
            onExamClick={(examId) => {
              appHandlers.handleCompletedExamClick(examId);
            }}
          />
        </MobileRouteTransition>
      )}

      {/* 🚀 Lernanalyse Screen - Overlay with Slide-In/Out (accessible from KI-Tools & Profil) */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showLernanalyse} zIndex={61}>
          <ProfileAnalyticsScreen
            isClosing={!navigation.showLernanalyse}
            onClose={navigation.closeLernanalyse}
            isMobile={isMobile}
            externalTransition
            allSets={allSets}
            onGenerateForWeakness={(ctx) => {
              setWeaknessContext(ctx);
              navigation.openGenerateFlashcards();
            }}
            onStartExamSimulation={(ctx) => {
              setExamWeaknessContext(ctx);
              examCountBeforeOpenRef.current = getCompletedExams().length;
              navigation.openExamSimulation();
            }}
            onOpenFlashcardSet={appHandlers.handleOpenFlashcardSet}
            onOpenLinkedFlashcardSet={(setId) => {
              const set = allSets.find(s => String(s.id) === String(setId));
              if (set) {
                appHandlers.handleOpenFlashcardSet(set);
              } else {
                // Orphaned link — set was deleted. Clean up across all stores so UI resets to "erstellen".
                weaknessCardStore.unlinkBySetId(String(setId));
                teacherTasksStore.unlinkBySetId(String(setId));
                prepTodoStore.unlinkBySetId(setId);
              }
            }}
            pendingPrepTaskLink={pendingPrepTaskLink}
            onRequestUpload={(examId, subject, grade) => {
              setPendingUploadRequest({ linkedTaskId: examId, subject, grade });
              navigation.closeLernanalyse();
              setTimeout(() => {
                navigation.handleMobileTabChange('Profil');
                navigation.setShowKlassenarbeiten(true);
              }, 350);
            }}
          />
        </MobileRouteTransition>
      )}

      {/* Mobile ToDo Management Screen */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showTodoManagement}>
          <TodoManagementScreen
            onClose={navigation.closeTodoManagement}
            onRequestUpload={(taskId, subject, grade) => {
              // Store prefill data for KlassenarbeitenScreen
              setPendingUploadRequest({ linkedTaskId: taskId, subject, grade });
              // Close TodoManagement
              navigation.closeTodoManagement();
              // Navigate to Profil and open KlassenarbeitenScreen
              setTimeout(() => {
                navigation.handleMobileTabChange('Profil');
                navigation.setShowKlassenarbeiten(true);
              }, 350);
            }}
            isMobile={true}
          />
        </MobileRouteTransition>
      )}

      {/* Mobile Account Edit Screen - Overlay with Slide-In/Out */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showAccountEdit}>
          <MobileAccountEditOverlay
            onClose={() => navigation.setShowAccountEdit(false)}
          />
        </MobileRouteTransition>
      )}

      {/* Mobile Klassenarbeiten Screen - Overlay with Slide-In/Out */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showKlassenarbeiten}>
          <KlassenarbeitenScreen
            onClose={() => navigation.setShowKlassenarbeiten(false)}
            isMobile={true}
            externalTransition
          />
        </MobileRouteTransition>
      )}

      {/* Mobile Schulaufgaben Screen - Overlay with Slide-In/Out */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showSchulaufgaben}>
          <SchulaufgabenScreen
            onClose={() => navigation.setShowSchulaufgaben(false)}
            isMobile={true}
            externalTransition
          />
        </MobileRouteTransition>
      )}

      {/* Mobile Schule und Klasse Screen - Overlay with Slide-In/Out */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showSchuleUndKlasse}>
          <MobileSchuleUndKlasseOverlay
            onClose={() => navigation.setShowSchuleUndKlasse(false)}
          />
        </MobileRouteTransition>
      )}

      {/* Mobile Teacher Profile Screen - Overlay with Slide-In/Out */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showTeacherProfile}>
          <TeacherProfileScreen
            teacherId={navigation.selectedTeacherId}
            onClose={navigation.closeTeacherProfile}
            onOpenChat={(teacherId) => {
              navigation.closeTeacherProfile();
              setTimeout(() => navigation.handleMobileTabChange('Chats'), 350);
            }}
            isMobile={true}
            externalTransition
          />
        </MobileRouteTransition>
      )}

      {/* Mobile Tutoring Activation Flow - Overlay with Slide-In/Out */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showTutoringActivation}>
          <TutoringActivationFlow
            onClose={() => navigation.setShowTutoringActivation(false)}
            externalTransition
          />
        </MobileRouteTransition>
      )}

      {/* Mobile Tutoring Progress Screen - Overlay with Slide-In/Out */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showTutoringProgress}>
          <TutoringProgressScreen
            onClose={() => navigation.setShowTutoringProgress(false)}
            allSets={allSets}
            onOpenSessionDetail={(sessionId) => {
              navigation.setSelectedTutoringSessionId(sessionId);
              navigation.setShowTutoringSessionDetail(true);
            }}
            onGenerateForWeakness={(ctx) => {
              setWeaknessContext(ctx);
              navigation.openGenerateFlashcards();
            }}
            onStartExamForWeakness={(ctx) => {
              setExamWeaknessContext(ctx);
              examCountBeforeOpenRef.current = getCompletedExams().length;
              navigation.openExamSimulation();
            }}
            onOpenLinkedFlashcardSet={(linkedSetId) => {
              const set = allSets.find(s => String(s.id) === linkedSetId);
              if (set) {
                appHandlers.handleOpenFlashcardSet(set);
              } else {
                // Orphaned link — set was deleted. Clean up across all stores so UI resets to "erstellen".
                weaknessCardStore.unlinkBySetId(String(linkedSetId));
                teacherTasksStore.unlinkBySetId(String(linkedSetId));
                prepTodoStore.unlinkBySetId(linkedSetId);
              }
            }}
            externalTransition
          />
        </MobileRouteTransition>
      )}

      {/* Mobile Tutoring Session Detail Screen - Overlay with Slide-In/Out */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showTutoringSessionDetail}>
          <TutoringSessionDetailScreen
            sessionId={navigation.selectedTutoringSessionId}
            allSets={allSets}
            onClose={() => {
              navigation.setShowTutoringSessionDetail(false);
              setTimeout(() => navigation.setSelectedTutoringSessionId(null), 350);
            }}
            onOpenExplainSession={(sessionId) => {
              navigation.setShowTutoringExplain(true);
            }}
            onGenerateForWeakness={(ctx) => {
              setWeaknessContext(ctx);
              navigation.openGenerateFlashcards();
            }}
            onStartExamForWeakness={(ctx) => {
              setExamWeaknessContext(ctx);
              examCountBeforeOpenRef.current = getCompletedExams().length;
              navigation.openExamSimulation();
            }}
            onOpenLinkedFlashcardSet={(linkedSetId) => {
              const set = allSets.find(s => String(s.id) === linkedSetId);
              if (set) {
                appHandlers.handleOpenFlashcardSet(set);
              } else {
                // Orphaned link — set was deleted. Clean up across all stores so UI resets to "erstellen".
                weaknessCardStore.unlinkBySetId(String(linkedSetId));
                teacherTasksStore.unlinkBySetId(String(linkedSetId));
                prepTodoStore.unlinkBySetId(linkedSetId);
              }
            }}
            externalTransition
          />
        </MobileRouteTransition>
      )}

      {/* Mobile Tutoring Explain Screen (AI Chat) - Overlay with Slide-In/Out */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showTutoringExplain}>
          <TutoringExplainScreen
            sessionId={navigation.selectedTutoringSessionId}
            onClose={() => navigation.setShowTutoringExplain(false)}
            externalTransition
          />
        </MobileRouteTransition>
      )}

      {/* Mobile Extra-Stunde Detail (Direct-Open from Home tap) — overlays Home without tab change */}
      {isMobile && (
        <MobileRouteTransition isVisible={!!pendingExtraSessionId}>
          <MeetingsScreen
            isMobile={true}
            externalTransition
            directExtraSessionId={pendingExtraSessionId}
            onClose={() => setPendingExtraSessionId(null)}
            onOpenTutoringSession={(sessionId) => {
              setPendingExtraSessionId(null);
              navigation.setSelectedTutoringSessionId(sessionId);
              navigation.setShowTutoringSessionDetail(true);
            }}
          />
        </MobileRouteTransition>
      )}

      {/* Mobile Extra Sessions (Nachhilfe Stunden kaufen) - Overlay with Slide-In/Out */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showExtraSessions}>
          <ExtraSessionsScreen
            onClose={() => navigation.setShowExtraSessions(false)}
            externalTransition
          />
        </MobileRouteTransition>
      )}

      {/* Mobile Lern-Streak Detail Screen - Overlay with Slide-In/Out */}
      {isMobile && (
        <MobileRouteTransition isVisible={navigation.showLernStreak}>
          <LernStreakScreen
            onClose={() => navigation.setShowLernStreak(false)}
            externalTransition
          />
        </MobileRouteTransition>
      )}

      {/* Create Own Set Modal */}
      <CreateOwnSetModal
        isOpen={showCreateOwnSetModal}
        onClose={() => setShowCreateOwnSetModal(false)}
        onSave={(title, cards, subject) => 
          appHandlers.handleCreateOwnSetSave(title, cards, subject, () => setShowCreateOwnSetModal(false))
        }
      />

      {/* Developer Console (Cmd/Ctrl + Shift + E) */}
      <DeveloperConsole />

      {/* Onboarding Trial Popup — first login after registration */}
      {showOnboardingTrial && (
        <OnboardingTrialPopup
          onStartTrial={handleStartTrial}
          onDismiss={handleDismissTrial}
        />
      )}

      {/* Debug Layout Overlay (Ctrl+Shift+D) — Desktop only, temporary */}
      {!isMobile && (
        <DebugLayoutOverlay
          sidebarWidth={derived.sidebarWidth}
          sidebarCollapsed={uiState.sidebarCollapsed}
          mainMarginLeft={0}
        />
      )}

      {/* 🚀 120Hz Performance Tools (Development Only) 
          Uncomment to monitor/test 120Hz performance:
          
          <PerformanceMonitor />     // Live FPS counter
          <Performance120HzDemo />   // Animation demos
      */}
    </MainLayout>
    </UserProvider>
    </ErrorBoundary>
  );
}