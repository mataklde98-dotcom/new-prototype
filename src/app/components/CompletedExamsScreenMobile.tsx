import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CompletedExamCard, { CompletedExamCardData } from './CompletedExamCard';
import SearchOverlay from './SearchOverlay';
import MobileOptionsMenu from './MobileOptionsMenu';
import { MobileSubjectChips } from './MobileSubjectChips';
import SelectionToolbar from './SelectionToolbar';
import { getCompletedExams, getTopicBadgeNumber, deleteCompletedExam } from '@/examapp/utils/completedExamsStorage';
import CloseButton from '@/app/components/CloseButton';
import SearchButton from '@/app/components/SearchButton';
import OptionsButton from '@/app/components/OptionsButton';

interface CompletedExamsScreenMobileProps {
  onClose: () => void;
  onExamClick: (examId: string) => void;
}

export default React.memo(function CompletedExamsScreenMobile({ onClose, onExamClick }: CompletedExamsScreenMobileProps) {
  const [completedExams, setCompletedExams] = useState<CompletedExamCardData[]>([]);
  
  // Filter States
  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [activeKategorie, setActiveKategorie] = useState<string>('');
  const [activeThema, setActiveThema] = useState<string>('');
  const [activeUnterthema, setActiveUnterthema] = useState<string>('');
  
  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchClosing, setSearchClosing] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  
  // Selection Mode
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);

  // Load completed exams on mount and refresh when selection mode ends
  useEffect(() => {
    loadCompletedExams();
  }, [selectionMode]);

  const loadCompletedExams = () => {
    const exams = getCompletedExams();
    const examCards: CompletedExamCardData[] = exams.map(exam => ({
      id: exam.id,
      topicName: exam.topicName,
      subjectName: exam.subjectName,
      categoryName: exam.categoryName,
      score: exam.score,
      totalQuestions: exam.totalQuestions,
      correctAnswers: exam.correctAnswers,
      timeSpent: exam.timeSpent,
      completedAt: exam.completedAt,
      badgeNumber: getTopicBadgeNumber(exam.topicName, exam.id),
      subtopicNames: exam.subtopicNames,
      aiGenerated: false, // TODO: Track if subtopics were AI generated
      grade: exam.grade, // ✅ German grade 1.0-6.0
      examScope: exam.examScope,
    }));
    console.log('[CompletedExams] Loaded exam cards with badges:', examCards.map(e => ({ 
      topic: e.topicName, 
      badge: e.badgeNumber 
    })));
    setCompletedExams(examCards);
  };

  // Search functionality
  const handleOpenSearch = () => {
    setShowSearch(true);
    setSearchClosing(false);
  };

  const handleCloseSearch = () => {
    setSearchClosing(true);
    setTimeout(() => {
      setShowSearch(false);
      setSearchClosing(false);
      setSearchQuery('');
    }, 300);
  };

  const handleToggleOptionsMenu = () => {
    setShowOptionsMenu(!showOptionsMenu);
  };

  const handleCloseOptionsMenu = () => {
    setShowOptionsMenu(false);
  };

  // Filter handlers
  const handleSubjectChange = (subject: string | null) => {
    setActiveSubject(subject || 'All');
    setActiveKategorie('');
    setActiveThema('');
    setActiveUnterthema('');
  };

  const handleKategorieChange = (kategorie: string | null) => {
    setActiveKategorie(kategorie || '');
    setActiveThema('');
    setActiveUnterthema('');
  };

  const handleThemaChange = (thema: string | null) => {
    setActiveThema(thema || '');
    setActiveUnterthema('');
  };

  const handleUnterthemaChange = (unterthema: string | null) => {
    setActiveUnterthema(unterthema || '');
  };

  // Selection handlers
  const handleEnterSelectionMode = () => {
    setSelectionMode(true);
    setSelectedExams([]);
    handleCloseOptionsMenu();
  };

  const handleExitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedExams([]);
  };

  const handleToggleExamSelection = (examId: string) => {
    if (selectedExams.includes(examId)) {
      setSelectedExams(selectedExams.filter(id => id !== examId));
    } else {
      setSelectedExams([...selectedExams, examId]);
    }
  };

  const handleSelectAllExams = () => {
    setSelectedExams(filteredExams.map(exam => exam.id));
  };

  const handleDeleteSelected = () => {
    selectedExams.forEach(id => deleteCompletedExam(id));
    loadCompletedExams();
    handleExitSelectionMode();
  };

  // Delete handlers
  const handleDeleteFiltered = () => {
    filteredExams.forEach(exam => deleteCompletedExam(exam.id));
    loadCompletedExams();
    handleCloseOptionsMenu();
  };

  const handleDeleteAll = () => {
    completedExams.forEach(exam => deleteCompletedExam(exam.id));
    loadCompletedExams();
    handleCloseOptionsMenu();
  };

  // Apply filters
  const filteredExams = completedExams.filter(exam => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        exam.topicName.toLowerCase().includes(query) ||
        exam.subjectName.toLowerCase().includes(query) ||
        exam.categoryName.toLowerCase().includes(query) ||
        exam.subtopicNames.some(name => name.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Subject filter
    if (activeSubject && activeSubject !== 'All' && activeSubject !== 'Alle Fächer') {
      if (exam.subjectName !== activeSubject) return false;
    }

    // Category filter
    if (activeKategorie) {
      if (exam.categoryName !== activeKategorie) return false;
    }

    // Thema filter
    if (activeThema) {
      if (exam.topicName !== activeThema) return false;
    }

    // Unterthema filter
    if (activeUnterthema) {
      if (!exam.subtopicNames.includes(activeUnterthema)) return false;
    }

    return true;
  });

  // Create data structure for MobileSubjectChips
  const chipsData = completedExams.map(exam => ({
    subject: exam.subjectName,
    kategorie: exam.categoryName,
    thema: exam.topicName,
    unterthema: exam.subtopicNames.join(', ') // Join for display
  }));

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] flex flex-col pt-safe">
      {/* Search Overlay - IMMER OBEN, bewegt sich NICHT */}
      {showSearch && (
        <div className="fixed top-0 left-0 right-0 z-[70] pt-safe">
          <div className="px-6 py-3">
            <SearchOverlay
              show={showSearch}
              searchQuery={searchQuery}
              searchClosing={searchClosing}
              onSearchChange={setSearchQuery}
              onClose={handleCloseSearch}
            />
          </div>
        </div>
      )}

      {/* ANIMATED WRAPPER: Header + Content bewegen sich ZUSAMMEN */}
      <div 
        className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none"
        style={{
          transform: showSearch ? 'translateY(60px)' : 'translateY(0)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform'
        }}
      >
        {/* Floating Header - Solid Background */}
        <div className="fixed top-0 left-0 right-0 z-[60] bg-[#0a0a0a]/95 border-b border-white/[0.05] pt-safe pointer-events-auto">
          <div className="px-6 py-3 space-y-3">
            {/* Title + Icons Row - IMMER SICHTBAR */}
            <div className="flex items-start justify-between">
              {/* Title Section (Links) - Zweizeilig */}
              <div className="flex-shrink-0 max-w-[200px]">
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white leading-tight">
                  Abgeschlossene Prüfungen
                </h1>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Search Button */}
                <SearchButton
                  onClick={handleOpenSearch}
                />

                {/* Options Menu Button + Menu Container */}
                <div className="relative">
                  <OptionsButton
                    onClick={handleToggleOptionsMenu}
                  />

                  <MobileOptionsMenu
                    show={showOptionsMenu}
                    sortedSetsCount={filteredExams.length}
                    allSetsCount={completedExams.length}
                    activeSubject={activeSubject}
                    activeKategorie={activeKategorie}
                    activeThema={activeThema}
                    activeUnterthema={activeUnterthema}
                    onClose={handleCloseOptionsMenu}
                    onEnterSelectionMode={handleEnterSelectionMode}
                    onDeleteFiltered={handleDeleteFiltered}
                    onDeleteAll={handleDeleteAll}
                  />
                </div>

                {/* X-Button (Rechts) - immer sichtbar auf Mobile */}
                <CloseButton onClick={onClose} />
              </div>
            </div>

            {/* Filter Chips - IMMER SICHTBAR */}
            <div className="-mx-6">
              <MobileSubjectChips
                allSets={chipsData}
                activeSubject={activeSubject}
                activeKategorie={activeKategorie}
                activeThema={activeThema}
                activeUnterthema={activeUnterthema}
                onSubjectChange={handleSubjectChange}
                onKategorieChange={handleKategorieChange}
                onThemaChange={handleThemaChange}
                onUnterthemaChange={handleUnterthemaChange}
              />
            </div>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="absolute left-0 right-0 overflow-hidden pointer-events-auto" style={{ top: '138px', bottom: '100px' }}>
          <div 
            className="size-full overflow-y-auto px-6 py-4"
            style={{
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {/* Selection Toolbar */}
            <AnimatePresence mode="wait">
              {selectionMode && (
                <SelectionToolbar
                  selectedCount={selectedExams.length}
                  totalCount={filteredExams.length}
                  onSelectAll={handleSelectAllExams}
                  onCancel={handleExitSelectionMode}
                  onDelete={handleDeleteSelected}
                />
              )}
            </AnimatePresence>

            {/* Empty State */}
            {filteredExams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 mb-4 rounded-full bg-white/[0.05] flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white/60 text-center">
                  {completedExams.length === 0
                    ? 'Noch keine abgeschlossenen Prüfungen'
                    : 'Keine Prüfungen gefunden'}
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/40 text-center mt-2 max-w-[280px]">
                  {completedExams.length === 0
                    ? 'Absolviere deine erste Prüfung in der Exam Simulation'
                    : 'Versuche einen anderen Filter oder Suchbegriff'}
                </p>
              </div>
            ) : (
              <>
                {/* Exam Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredExams.map(exam => (
                    <CompletedExamCard
                      key={exam.id}
                      exam={exam}
                      onClick={() => {
                        if (selectionMode) {
                          handleToggleExamSelection(exam.id);
                        } else {
                          onExamClick(exam.id);
                        }
                      }}
                      onLongPress={() => {
                        if (!selectionMode) {
                          setSelectionMode(true);
                          setSelectedExams([exam.id]);
                        }
                      }}
                      isSelected={selectedExams.includes(exam.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});