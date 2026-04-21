import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import CompletedExamCard, { CompletedExamCardData } from './CompletedExamCard';
import { getCompletedExams, getTopicBadgeNumber, deleteCompletedExam } from '@/examapp/utils/completedExamsStorage';
import BreadcrumbFilter from './BreadcrumbFilter';
import DesktopOptionsMenu from './DesktopOptionsMenu';

interface CompletedExamsDesktopViewProps {
  onExamClick: (examId: string) => void;
  onClose: () => void;
  windowWidth: number;
  windowHeight: number;
  sidebarCollapsed: boolean;
  key?: string;
}

export default function CompletedExamsDesktopView({ 
  onExamClick,
  onClose,
  windowWidth,
  windowHeight,
  sidebarCollapsed
}: CompletedExamsDesktopViewProps) {
  const [completedExams, setCompletedExams] = useState<CompletedExamCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States (same as Mobile)
  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [activeKategorie, setActiveKategorie] = useState<string>('');
  const [activeThema, setActiveThema] = useState<string>('');
  const [activeUnterthema, setActiveUnterthema] = useState<string>('');
  
  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  
  // Selection Mode
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Focus input when expanded
  React.useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  // Close search when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchExpanded && searchInputRef.current && !searchInputRef.current.closest('.search-container')?.contains(e.target as Node)) {
        if (!searchQuery) {
          setSearchExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchExpanded, searchQuery]);

  // Load completed exams
  useEffect(() => {
    loadCompletedExams();
  }, [selectionMode]);

  const loadCompletedExams = () => {
    setIsLoading(true);
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
      aiGenerated: false,
      grade: exam.grade,
      examScope: exam.examScope,
    }));
    setCompletedExams(examCards);
    setIsLoading(false);
  };

  // Filter handlers
  const handleSubjectChange = (subject: string) => {
    setActiveSubject(subject);
    setActiveKategorie('');
    setActiveThema('');
    setActiveUnterthema('');
  };

  const handleKategorieChange = (kategorie: string) => {
    setActiveKategorie(kategorie);
    setActiveThema('');
    setActiveUnterthema('');
  };

  const handleThemaChange = (thema: string) => {
    setActiveThema(thema);
    setActiveUnterthema('');
  };

  const handleUnterthemaChange = (unterthema: string) => {
    setActiveUnterthema(unterthema);
  };

  // Selection handlers
  const handleEnterSelectionMode = () => {
    setSelectionMode(true);
    setSelectedExams([]);
    setShowOptionsMenu(false);
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

  const handleExitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedExams([]);
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
    setShowOptionsMenu(false);
  };

  const handleDeleteAll = () => {
    completedExams.forEach(exam => deleteCompletedExam(exam.id));
    loadCompletedExams();
    setShowOptionsMenu(false);
  };

  // Apply filters (same logic as Mobile)
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

  // Create data structure for BreadcrumbFilter
  const filterData = completedExams.map(exam => ({
    subject: exam.subjectName,
    kategorie: exam.categoryName,
    thema: exam.topicName,
    unterthema: exam.subtopicNames.join(', ')
  }));

  // Grid uses CSS auto-fill — adapts to container width automatically.
  // No viewport-based calculation needed; sidebar toggle just changes container width.
  const gridTemplateColumns = 'repeat(auto-fill, minmax(340px, 1fr))';

  return (
    <div>
      {/* Header - Same style as My Flashcards */}
      {/* No marginTop/paddingLeft/Right — DesktopContentWrapper is the layout authority */}
      <div
        className="flex-shrink-0 relative z-20"
        style={{
          marginBottom: "12px",
        }}
      >
        <div
          className="relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08]"
          style={{
            borderRadius: "20px",
            padding: "20px",
            willChange: "transform",
            transform: "translateZ(0)",
            isolation: "isolate",
            zIndex: 1,
          }}
        >
          {/* Subtle animated gradient overlay */}
          <div
            className="absolute inset-0 opacity-60 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 20% 50%, rgba(0, 147, 121, 0.03), transparent 50%), radial-gradient(circle at 80% 80%, rgba(97, 140, 255, 0.03), transparent 50%)",
              animation: "pulse 8s ease-in-out infinite",
              borderRadius: "20px",
            }}
          />

          <div
            className="relative z-10"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Title + Search + Options — Single-row safe (no tabs, max ~520px total)
                See useDesktopHeaderLayout for the reusable two-row pattern if tabs are ever added */}
            <div className="flex items-center gap-3 min-w-0">
              {/* ── LEFT GROUP: Title + Search ── adapts to remaining space */}
              <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                <h1
                  className="font-['Poppins:SemiBold',sans-serif] text-white/95 tracking-tight min-w-0 truncate"
                  style={{
                    fontSize: "22px",
                    flexShrink: searchExpanded ? 1 : 0,
                  }}
                >
                  Abgeschlossene Prüfungen
                </h1>

                {/* Search — inline, transitions width */}
                <div
                  className="search-container transition-[width] duration-200 ease-out"
                  style={{
                    width: searchExpanded ? "200px" : "40px",
                    flexShrink: searchExpanded ? 1 : 0,
                    minWidth: searchExpanded ? "100px" : "40px",
                  }}
                >
                  {searchExpanded ? (
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Suche"
                        className="w-full h-10 pl-9 pr-3 bg-[#0a0a0a] border border-white/[0.08] rounded-xl text-white text-[14px] placeholder-white/40 focus:outline-none focus:border-[#009379]/50 transition-colors font-['Poppins:Regular',sans-serif]"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setSearchExpanded(true)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 transition-colors duration-200 hover:bg-white/[0.05] border border-white/10"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* ── RIGHT GROUP: Kebab only ── flex-shrink-0, NEVER moves */}
              <div className="flex items-center flex-shrink-0">
                {!selectionMode && (
                  <div className="relative">
                    <button
                      onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                      className="rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 transition-colors duration-200 hover:bg-white/[0.05]"
                      style={{
                        width: "36px",
                        height: "36px",
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="19" r="2" />
                      </svg>
                    </button>

                    <DesktopOptionsMenu
                      show={showOptionsMenu}
                      sortedSetsCount={filteredExams.length}
                      allSetsCount={completedExams.length}
                      activeSubject={activeSubject}
                      activeKategorie={activeKategorie}
                      activeThema={activeThema}
                      activeUnterthema={activeUnterthema}
                      windowWidth={windowWidth}
                      onClose={() => setShowOptionsMenu(false)}
                      onEnterSelectionMode={handleEnterSelectionMode}
                      onDeleteFiltered={handleDeleteFiltered}
                      onDeleteAll={handleDeleteAll}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Breadcrumb Filter */}
            <div style={{ minHeight: "40px", overflowX: "visible", overflowY: "visible" }}>
              <BreadcrumbFilter
                allSets={filterData}
                activeSubject={activeSubject}
                activeKategorie={activeKategorie}
                activeThema={activeThema}
                activeUnterthema={activeUnterthema}
                onSubjectChange={handleSubjectChange}
                onKategorieChange={handleKategorieChange}
                onThemaChange={handleThemaChange}
                onUnterthemaChange={handleUnterthemaChange}
                showOnlySubject={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content — no internal scroll container, DCW scrolls */}
      <div className="pb-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center" style={{ height: "calc(100vh - 300px)" }}>
            <div className="w-12 h-12 border-4 border-white/10 border-t-[#009379] rounded-full animate-spin mb-4" />
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/60">
              Lade Prüfungen...
            </p>
          </div>
        ) : filteredExams.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center" style={{ height: "calc(100vh - 300px)" }}>
            <div className="text-center max-w-md">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                {searchQuery || activeSubject !== 'All' ? (
                  <Search className="w-12 h-12 text-white/40" />
                ) : (
                  <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
              <h3 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white mb-2">
                {completedExams.length === 0
                  ? 'Noch keine abgeschlossenen Prüfungen'
                  : 'Keine Prüfungen gefunden'
                }
              </h3>
              <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/60">
                {completedExams.length === 0
                  ? 'Absolviere deine erste Prüfung in der Exam Simulation'
                  : 'Versuche es mit anderen Suchkriterien.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="pt-6">
            {/* Grid */}
            <div 
              className="grid gap-4"
              style={{
                gridTemplateColumns
              }}
            >
              {filteredExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3,
                    delay: Math.min(index * 0.05, 0.3)
                  }}
                >
                  <CompletedExamCard
                    exam={exam}
                    onClick={() => {
                      if (selectionMode) {
                        handleToggleExamSelection(exam.id);
                      } else {
                        onExamClick(exam.id);
                      }
                    }}
                    isSelected={selectedExams.includes(exam.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}