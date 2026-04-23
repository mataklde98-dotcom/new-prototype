// ===== CONTENT ROUTER =====
// Routes between different screens based on navigation state

import React from 'react';
import { motion } from 'motion/react';
import HomeScreenDesktop from './HomeScreenDesktop';
import HomeScreenMobile from './HomeScreenMobile';
import KIToolsScreen from './KIToolsScreen';
import MyFlashcardsHeader from './MyFlashcardsHeader';
import FlashcardGrid from './FlashcardGrid';
import PrognosisSection from './PrognosisSection';
import BottomBar from './BottomBar';
import CompletedExamsDesktopView from './CompletedExamsDesktopView';
import ProfilScreenDesktop from './ProfilScreenDesktop';
import TodoManagementScreen from './TodoManagementScreen';
import MeetingsScreen from './MeetingsScreen';
import ChatScreenDesktop from './ChatScreenDesktop';
import DesktopContentWrapper from './DesktopContentWrapper';
import { FlashcardSet } from '@/types/flashcard';
import ProfileAnalyticsScreen from './ProfileAnalyticsScreen';
import TeacherProfileScreen from './TeacherProfileScreen';
import GenerateFlashcardsApp from '@/flashcardgen/GenerateFlashcardsApp';
import ExamSimulationApp from '@/examapp/app/App';
import { ContentStoreProvider } from '@/shared-content-store/ContentStore';

interface ContentRouterProps {
  // Navigation State
  showHome: boolean;
  showMyFlashcards: boolean;
  showKITools: boolean;
  showChats: boolean;
  showCompletedExams: boolean;
  showProfilDesktop: boolean;
  showTodoManagement?: boolean;
  showMeetings?: boolean;
  showKlassenarbeiten?: boolean;
  showLernanalyse?: boolean;
  showTeacherProfile?: boolean;
  showGenerateFlashcards?: boolean;
  showExamSimulation?: boolean;
  selectedTeacherId?: string | null;
  onShowKlassenarbeitenChange?: (show: boolean) => void;
  onOpenLernanalyse?: () => void;
  onCloseLernanalyse?: () => void;
  onGenerateForWeakness?: (context: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo'; examId?: string; taskIndex?: number }) => void;
  onStartExamForWeakness?: (context: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo'; examTitle?: string; examDurationMinutes?: number }) => void;
  onOpenTeacherProfile?: (teacherId: string) => void;
  onCloseTeacherProfile?: () => void;
  onOpenChatWithTeacher?: (teacherId: string) => void;
  onOpenMeetingFromTeacherProfile?: (meeting: import('./MeetingsScreen').Meeting) => void;
  initialChatTeacherId?: string | null;
  pendingPrepTaskLink?: { examId: string; taskIndex: number; setId: number } | null;
  isMobile: boolean;

  // Generate Flashcards (inline desktop)
  onCloseGenerateFlashcards?: () => void;
  onFlashcardSetCreated?: (newSet: FlashcardSet) => void;
  weaknessContext?: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo' | 'learning-goal' | 'recommendation'; severityLabel?: string; contextLabel?: string; notificationLabel?: string } | null;

  // Exam Simulation (inline desktop)
  onCloseExamSimulation?: () => void;
  reviewingCompletedExam?: import('@/examapp/app/utils/completedExamsStorage').CompletedExam;
  examWeaknessContext?: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo' | 'learning-goal' | 'recommendation'; examTitle?: string; examDurationMinutes?: number; severityLabel?: string; contextLabel?: string; notificationLabel?: string; assignedDate?: string } | null;

  // Window State
  windowWidth: number;
  windowHeight: number;
  sidebarCollapsed: boolean;

  // Filter State
  activeTab: string;
  activeSubject: string;
  activeKategorie: string;
  activeThema: string;
  activeUnterthema: string;
  searchQuery: string;

  // UI State
  showSearch: boolean;
  searchClosing: boolean;
  showOptionsMenu: boolean;
  currentPage: number;

  // Selection State
  selectionMode: boolean;
  selectedCards: number[];

  // Data
  allSets: FlashcardSet[];
  paginatedSets: FlashcardSet[];
  sortedSets: FlashcardSet[];
  totalPages: number;
  gridColumns: number;

  // Handlers
  onNavigateToHome: () => void;
  onNavigateToKITools: () => void;
  onNavigateToMyFlashcards: () => void;
  onNavigateToCompletedExams: () => void;
  onLogout?: () => void;
  onOpenExamSimulation: () => void;
  onOpenGenerateFlashcards: () => void;
  onOpenFlashcardSet: (set: FlashcardSet) => void;
  onCompletedExamClick?: (examId: string) => void;
  refreshCompletedExams?: number;
  onOpenCleanExamTest?: () => void;  // 🧪 TEST
  onNavigateToTodoManagement?: () => void;
  onCloseTodoManagement?: () => void;
  onNavigateToMeetings?: () => void;
  onRequestUpload?: (taskId: string, subject: string, grade: string) => void;
  onMobileTabChange: (tab: string) => void;
  onOpenTutoringActivation?: () => void;
  onOpenTutoringProgress?: () => void;
  onOpenCreditHistory?: () => void;
  onTabChange: (tab: string) => void;
  onSubjectChange: (subject: string) => void;
  onKategorieChange: (kategorie: string) => void;
  onThemaChange: (thema: string) => void;
  onUnterthemaChange: (unterthema: string) => void;
  onSearchChange: (query: string) => void;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  onToggleOptionsMenu: () => void;
  onCloseOptionsMenu: () => void;
  onEnterSelectionMode: () => void;
  onDeleteFiltered: () => void;
  onDeleteAll: () => void;
  onToggleCardSelection: (id: number) => void;
  onSelectAll: () => void;
  onCancelSelection: () => void;
  onDeleteSelected: () => void;
  onPageChange: (page: number) => void;
  onCreateOwnSet: () => void;
}

export default function ContentRouter(props: ContentRouterProps) {
  const {
    showHome,
    showMyFlashcards,
    showKITools,
    showChats,
    showCompletedExams,
    showProfilDesktop,
    showTodoManagement,
    showMeetings,
    showKlassenarbeiten,
    showLernanalyse,
    showTeacherProfile,
    showGenerateFlashcards,
    showExamSimulation,
    selectedTeacherId,
    onShowKlassenarbeitenChange,
    onOpenLernanalyse,
    onCloseLernanalyse,
    onGenerateForWeakness,
    onStartExamForWeakness,
    onOpenTeacherProfile,
    onCloseTeacherProfile,
    onOpenChatWithTeacher,
    onOpenMeetingFromTeacherProfile,
    initialChatTeacherId,
    pendingPrepTaskLink,
    isMobile,
    windowWidth,
    windowHeight,
    sidebarCollapsed,
    allSets,
    paginatedSets,
    sortedSets,
    totalPages,
    gridColumns,
    selectionMode,
    selectedCards,
    activeTab,
    currentPage,
    onNavigateToHome,
    onNavigateToKITools,
    onNavigateToMyFlashcards,
    onNavigateToCompletedExams,
    onOpenExamSimulation,
    onOpenGenerateFlashcards,
    onOpenFlashcardSet,
    onCompletedExamClick,
    refreshCompletedExams,
    onOpenCleanExamTest,  // 🧪 TEST
    onNavigateToTodoManagement,
    onCloseTodoManagement,
    onNavigateToMeetings,
    onRequestUpload,
    onMobileTabChange,
    onToggleCardSelection,
    onSelectAll,
    onCancelSelection,
    onDeleteSelected,
    onPageChange,
    onCreateOwnSet,
    onCloseGenerateFlashcards,
    onFlashcardSetCreated,
    weaknessContext,
    onCloseExamSimulation,
    reviewingCompletedExam,
    examWeaknessContext,
  } = props;

  // ===== TAB-FILTERED SETS FOR FILTER OPTIONS =====
  // Filter sets by tab to show only relevant options in filter dropdowns
  const tabFilteredSets = React.useMemo(() => {
    switch (activeTab) {
      case 'Repeat':
        return allSets.filter(set => set.type === 'repeat');
      case 'Manual':
        return allSets.filter(set => set.type === 'manual');
      case 'Prognosis':
        return allSets.filter(set => set.type === 'weakness' || set.type === 'risk' || set.type === 'knowledge-gap');
      case 'Teacher':
        return allSets.filter(set => set.type === 'teacher');
      default:
        return allSets;
    }
  }, [allSets, activeTab]);

  // Mobile Screens (rendered in App.tsx as overlays with transitions)
  // - Home Screen
  // - KI-Tools Screen  
  // - My Flashcards Screen
  // - Completed Exams Screen
  if (isMobile) {
    return null;
  }

  // Desktop Generate Flashcards Screen — standard width, fillHeight (inline content area)
  if (showGenerateFlashcards) {
    return (
      <DesktopContentWrapper contentWidth="standard" fillHeight>
        <ContentStoreProvider>
          <div className="relative w-full h-full overflow-hidden">
            <GenerateFlashcardsApp
              onClose={onCloseGenerateFlashcards}
              onFlashcardSetCreated={onFlashcardSetCreated}
              weaknessContext={weaknessContext}
            />
          </div>
        </ContentStoreProvider>
      </DesktopContentWrapper>
    );
  }

  // Desktop Exam Simulation Screen — standard width, fillHeight (inline content area)
  if (showExamSimulation) {
    return (
      <DesktopContentWrapper contentWidth="standard" fillHeight>
        <ContentStoreProvider>
          <div className="relative w-full h-full overflow-hidden">
            <ExamSimulationApp
              onClose={onCloseExamSimulation}
              reviewingCompletedExam={reviewingCompletedExam}
              examWeaknessContext={examWeaknessContext}
            />
          </div>
        </ContentStoreProvider>
      </DesktopContentWrapper>
    );
  }

  // Desktop Lernanalyse Screen — standard width, fillHeight (own scrolling)
  // Priority: checked before showHome/showProfil so underlying screen state can stay intact
  if (showLernanalyse) {
    return (
      <DesktopContentWrapper contentWidth="standard" fillHeight>
        <ProfileAnalyticsScreen
          onClose={onCloseLernanalyse || onNavigateToHome}
          isMobile={false}
          externalTransition
          allSets={allSets}
          onGenerateForWeakness={onGenerateForWeakness}
          onStartExamSimulation={onStartExamForWeakness}
          onOpenFlashcardSet={onOpenFlashcardSet}
          pendingPrepTaskLink={pendingPrepTaskLink}
          onRequestUpload={onRequestUpload ? (examId, subject, grade) => {
            if (onCloseLernanalyse) onCloseLernanalyse();
            onRequestUpload(examId, subject, grade);
          } : undefined}
        />
      </DesktopContentWrapper>
    );
  }

  // Desktop Home Screen — standard width (1200px dashboard)
  if (showHome) {
    return (
      <DesktopContentWrapper contentWidth="standard">
        <HomeScreenDesktop
          key="home-desktop-reset"
          onNavigateToKITools={onNavigateToKITools}
          onNavigateToMyFlashcards={onNavigateToMyFlashcards}
          onNavigateToExamSimulation={onOpenExamSimulation}
          onNavigateToGenerateFlashcards={onOpenGenerateFlashcards}
          onNavigateToTodoManagement={onNavigateToTodoManagement}
          onNavigateToLernanalyse={onOpenLernanalyse}
          onOpenTeacherProfile={onOpenTeacherProfile}
          allSets={allSets}
          onOpenFlashcardSet={onOpenFlashcardSet}
          onOpenCleanExamTest={onOpenCleanExamTest}
          onCompletedExamClick={onCompletedExamClick}
          refreshCompletedExams={refreshCompletedExams}
          onGenerateForWeakness={onGenerateForWeakness}
          onStartExamSimulation={onStartExamForWeakness}
          onOpenCreditHistory={props.onOpenCreditHistory}
        />
      </DesktopContentWrapper>
    );
  }

  // Desktop KI-Tools Screen — standard width (1200px, same as all main screens)
  if (showKITools) {
    return (
      <DesktopContentWrapper contentWidth="standard">
        <KIToolsScreen
          onClose={onNavigateToHome}
          onNavigateToMyFlashcards={onNavigateToMyFlashcards}
          onNavigateToExamSimulation={onOpenExamSimulation}
          onNavigateToGenerateFlashcards={onOpenGenerateFlashcards}
          onNavigateToCompletedExams={onNavigateToCompletedExams}
          onNavigateToLernanalyse={onOpenLernanalyse}
        />
      </DesktopContentWrapper>
    );
  }

  // Desktop Completed Exams Screen — standard width
  if (showCompletedExams) {
    return (
      <DesktopContentWrapper contentWidth="standard">
        <CompletedExamsDesktopView
          key={`completed-exams-${refreshCompletedExams}`}
          onExamClick={(examId) => {
            console.log('📋 [Desktop] Opening Completed Exam:', examId);
            onCompletedExamClick?.(examId);
          }}
          onClose={onNavigateToHome}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          sidebarCollapsed={sidebarCollapsed}
        />
      </DesktopContentWrapper>
    );
  }

  // Desktop Profil Screen — standard width, DCW scrolls
  if (showProfilDesktop) {
    return (
      <DesktopContentWrapper contentWidth="standard">
        <ProfilScreenDesktop
          onClose={onNavigateToHome}
          onLogout={props.onLogout}
          showKlassenarbeiten={showKlassenarbeiten}
          onShowKlassenarbeitenChange={onShowKlassenarbeitenChange}
          onOpenLernanalyse={onOpenLernanalyse}
          onOpenTutoringActivation={props.onOpenTutoringActivation}
          onOpenTutoringProgress={props.onOpenTutoringProgress}
          onOpenCreditHistory={props.onOpenCreditHistory}
        />
      </DesktopContentWrapper>
    );
  }

  // Desktop Todo Management Screen — standard width
  if (showTodoManagement) {
    return (
      <DesktopContentWrapper contentWidth="standard">
        <TodoManagementScreen
          onClose={onCloseTodoManagement || onNavigateToHome}
          onRequestUpload={onRequestUpload}
        />
      </DesktopContentWrapper>
    );
  }

  // Desktop Meetings Screen — standard width
  if (showMeetings) {
    return (
      <DesktopContentWrapper contentWidth="standard" fillHeight>
        <MeetingsScreen
          onClose={onNavigateToHome}
          externalTransition
          onOpenTutoringActivation={props.onOpenTutoringActivation}
        />
      </DesktopContentWrapper>
    );
  }

  // Desktop Teacher Profile Screen — standard width, scrollable
  if (showTeacherProfile && selectedTeacherId) {
    return (
      <DesktopContentWrapper contentWidth="standard" key={`teacher-profile-${selectedTeacherId}`}>
        <TeacherProfileScreen
          teacherId={selectedTeacherId}
          onClose={onCloseTeacherProfile || onNavigateToHome}
          onOpenChat={onOpenChatWithTeacher}
          onOpenMeeting={onOpenMeetingFromTeacherProfile}
          externalTransition
        />
      </DesktopContentWrapper>
    );
  }

  // Desktop Chat Screen — full width + fillHeight
  if (showChats) {
    return (
      <DesktopContentWrapper contentWidth="full" fillHeight>
        <ChatScreenDesktop
          onClose={onNavigateToHome}
          initialTeacherId={initialChatTeacherId}
          onOpenTeacherProfile={onOpenTeacherProfile}
          onOpenTutoringActivation={props.onOpenTutoringActivation}
        />
      </DesktopContentWrapper>
    );
  }

  // Desktop My Flashcards Screen — full width, paginated grid
  if (showMyFlashcards || !showHome) {
    return (
      <DesktopContentWrapper contentWidth="full" scrollable={false}>
        {/* Header */}
        <MyFlashcardsHeader
          isMobile={isMobile}
          windowWidth={windowWidth}
          activeTab={activeTab}
          activeSubject={props.activeSubject}
          activeKategorie={props.activeKategorie}
          activeThema={props.activeThema}
          activeUnterthema={props.activeUnterthema}
          searchQuery={props.searchQuery}
          showSearch={props.showSearch}
          searchClosing={props.searchClosing}
          showOptionsMenu={props.showOptionsMenu}
          selectionMode={selectionMode}
          allSets={tabFilteredSets}
          sortedSetsCount={sortedSets.length}
          onTabChange={props.onTabChange}
          onSubjectChange={props.onSubjectChange}
          onKategorieChange={props.onKategorieChange}
          onThemaChange={props.onThemaChange}
          onUnterthemaChange={props.onUnterthemaChange}
          onSearchChange={props.onSearchChange}
          onOpenSearch={props.onOpenSearch}
          onCloseSearch={props.onCloseSearch}
          onToggleOptionsMenu={props.onToggleOptionsMenu}
          onCloseOptionsMenu={props.onCloseOptionsMenu}
          onEnterSelectionMode={props.onEnterSelectionMode}
          onDeleteFiltered={props.onDeleteFiltered}
          onDeleteAll={props.onDeleteAll}
        />

        {/* Content: Prognosis Section OR Flashcard Grid */}
        {activeTab === 'Prognosis' ? (
          <PrognosisSection
            onOpenFlashcardSet={onOpenFlashcardSet}
            activeSubject={props.activeSubject}
            activeKategorie={props.activeKategorie}
            activeThema={props.activeThema}
            activeUnterthema={props.activeUnterthema}
            searchQuery={props.searchQuery}
            selectionMode={selectionMode}
            selectedCards={selectedCards}
            onToggleCardSelection={onToggleCardSelection}
            isMobile={false}
            allSets={allSets}
          />
        ) : activeTab === 'Teacher' ? (
          /* Vom Lehrer Tab Content – Platzhalter (Desktop) */
          <div className="flex flex-col items-center justify-center text-center py-24">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{
                background: 'rgba(0,184,148,0.07)',
                border: '1px solid rgba(0,184,148,0.15)',
              }}
            >
              <svg className="w-9 h-9" style={{ color: 'rgba(0,184,148,0.5)' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
              </svg>
            </div>
            <h3 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white/80 mb-2">
              Lehrer
            </h3>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/35 max-w-[340px] leading-relaxed">
              Hier erscheinen Karteikarten-Sets, die dein Lehrer dir zugewiesen hat
            </p>
            <div 
              className="mt-8 px-5 py-2.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/25">
                Demnächst verfügbar
              </span>
            </div>
          </div>
        ) : (
          <FlashcardGrid
            paginatedSets={paginatedSets}
            sortedSets={sortedSets}
            selectionMode={selectionMode}
            selectedCards={selectedCards}
            windowWidth={windowWidth}
            sidebarCollapsed={props.sidebarCollapsed}
            isMobile={isMobile}
            gridColumns={gridColumns}
            activeTab={props.activeTab}
            onCardClick={onOpenFlashcardSet}
            onToggleSelection={onToggleCardSelection}
            onCreateOwnSet={onCreateOwnSet}
          />
        )}

        {/* Bottom Bar */}
        <BottomBar
          isMobile={isMobile}
          windowWidth={windowWidth}
          selectionMode={selectionMode}
          selectedCount={selectedCards.length}
          totalCount={sortedSets.length}
          activeTab={activeTab}
          currentPage={currentPage}
          totalPages={totalPages}
          onSelectAll={onSelectAll}
          onCancelSelection={onCancelSelection}
          onDeleteSelected={onDeleteSelected}
          onPageChange={onPageChange}
        />
      </DesktopContentWrapper>
    );
  }

  return null;
}