import React, { useRef, useState, useCallback, useMemo } from 'react';
import FlashcardGrid from './FlashcardGrid';
import SearchOverlay from './SearchOverlay';
import MobileOptionsMenu from './MobileOptionsMenu';
import SelectionToolbar from './SelectionToolbar';
import { MobileSubjectChips } from './MobileSubjectChips';
import PrognosisSection, { PrognosisSubTab } from './PrognosisSection';
import { FlashcardSet } from '@/types/flashcard';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { usePrognosis } from '@/hooks';
import CloseButton from '@/app/components/CloseButton';
import SearchButton from '@/app/components/SearchButton';
import OptionsButton from '@/app/components/OptionsButton';
import { useUser } from '@/contexts/UserContext';
import { Lock, GraduationCap, Send, Clock } from 'lucide-react';

interface MyFlashcardsScreenMobileProps {
  // Window dimensions
  windowWidth: number;
  
  // All sets
  allSets: FlashcardSet[];
  sortedSets: FlashcardSet[];
  
  // Filter States
  activeTab: string;
  activeSubject: string | null;
  activeKategorie: string | null;
  activeThema: string | null;
  activeUnterthema: string | null;
  searchQuery: string;
  showSearch: boolean;
  searchClosing: boolean;
  showOptionsMenu: boolean;
  
  // Selection Mode
  selectionMode: boolean;
  selectedCards: number[];
  
  // Pagination
  currentPage: number;
  totalPages: number;
  paginatedSets: FlashcardSet[];
  gridColumns: string;
  
  // Handlers
  onTabChange: (tab: string) => void;
  onSubjectChange: (subject: string | null) => void;
  onKategorieChange: (kategorie: string | null) => void;
  onThemaChange: (thema: string | null) => void;
  onUnterthemaChange: (unterthema: string | null) => void;
  onSearchChange: (query: string) => void;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  onToggleOptionsMenu: () => void;
  onCloseOptionsMenu: () => void;
  onEnterSelectionMode: () => void;
  onDeleteFiltered: () => void;
  onDeleteAll: () => void;
  onOpenFlashcardSet: (set: FlashcardSet) => void;
  onToggleCardSelection: (id: number) => void;
  onSelectAllCards: (ids: number[]) => void;
  onCancelSelection: () => void;
  onDeleteSelected: () => void;
  onPageChange: (page: number) => void;
  onClose: () => void; // X-Button Handler
  onCreateOwnSet: () => void; // Button "Eigenes Set erstellen"
  onOpenTutoringActivation?: () => void; // Nachhilfe aktivieren
}

export default React.memo(function MyFlashcardsScreenMobile(props: MyFlashcardsScreenMobileProps) {
  const {
    windowWidth,
    allSets,
    sortedSets,
    activeTab,
    activeSubject,
    activeKategorie,
    activeThema,
    activeUnterthema,
    searchQuery,
    showSearch,
    searchClosing,
    showOptionsMenu,
    selectionMode,
    selectedCards,
    currentPage,
    totalPages,
    paginatedSets,
    gridColumns,
    onTabChange,
    onSubjectChange,
    onKategorieChange,
    onThemaChange,
    onUnterthemaChange,
    onSearchChange,
    onOpenSearch,
    onCloseSearch,
    onToggleOptionsMenu,
    onCloseOptionsMenu,
    onEnterSelectionMode,
    onDeleteFiltered,
    onDeleteAll,
    onOpenFlashcardSet,
    onToggleCardSelection,
    onSelectAllCards,
    onCancelSelection,
    onDeleteSelected,
    onPageChange,
    onClose,
    onCreateOwnSet,
    onOpenTutoringActivation,
  } = props;

  const { tutoringStatus } = useUser();

  // Prognosis Sub-Tab state (lifted from PrognosisSection)
  const [prognosisSubTab, setPrognosisSubTab] = useState<PrognosisSubTab>('weakness');

  // Prognosis data for accurate counts in options menu & selection toolbar
  const { 
    filteredWeaknesses, 
    filteredRelevantTopics,
    filteredKnowledgeGaps
  } = usePrognosis({
    activeSubject,
    activeKategorie,
    activeThema,
    activeUnterthema,
    searchQuery,
    allSets
  });

  // Calculate context-aware counts for options menu
  const visibleSetsForMenu = useMemo(() => {
    if (activeTab === 'Prognosis') {
      switch (prognosisSubTab) {
        case 'weakness': return filteredWeaknesses;
        case 'risk': return filteredRelevantTopics;
        case 'knowledge-gap': return filteredKnowledgeGaps;
      }
    }
    // For KI-Sets, Eigene, Lehrer: sortedSets is already tab-scoped
    return sortedSets;
  }, [activeTab, prognosisSubTab, filteredWeaknesses, filteredRelevantTopics, filteredKnowledgeGaps, sortedSets]);

  // "Alle löschen" count = all sets in current tab/sub-tab (no subject/search filter)
  const allSetsForTab = useMemo(() => {
    if (activeTab === 'Prognosis') {
      // Get unfiltered counts per sub-tab from allSets
      const typeMap: Record<PrognosisSubTab, string> = {
        'weakness': 'weakness',
        'risk': 'risk', 
        'knowledge-gap': 'knowledge-gap',
      };
      return allSets.filter(s => s.type === typeMap[prognosisSubTab]);
    }
    return allSets;
  }, [activeTab, prognosisSubTab, allSets]);

  // Scroll detection for bottom bar hide-on-scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isVisible: isBottomBarVisible } = useScrollDirection({ 
    threshold: 10,
    elementRef: scrollContainerRef 
  });

  // ===== DIRECTIONAL TAB SLIDE =====
  const TAB_ORDER: Record<string, number> = { Repeat: 0, Manual: 1, Prognosis: 2, Teacher: 3 };
  const prevTabRef = useRef(activeTab);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Intercept tab changes to determine slide direction
  const handleTabChangeWithSlide = useCallback((newTab: string) => {
    if (newTab === activeTab) return;
    const dir = (TAB_ORDER[newTab] ?? 0) > (TAB_ORDER[activeTab] ?? 0) ? 'right' : 'left';
    setSlideDirection(dir);
    prevTabRef.current = activeTab;
    onTabChange(newTab);
  }, [activeTab, onTabChange]);

  // Tab indicator position (GPU-composited translateX)
  const tabIndex = activeTab === 'Repeat' ? 0 : activeTab === 'Manual' ? 1 : activeTab === 'Prognosis' ? 2 : 3;

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] flex flex-col">
      {/* Search Overlay - IMMER OBEN, bewegt sich NICHT */}
      {showSearch && (
        <div className="fixed top-0 left-0 right-0 z-[70] pt-safe">
          <div className="px-6 py-3">
            <SearchOverlay
              show={showSearch}
              searchQuery={searchQuery}
              searchClosing={searchClosing}
              onSearchChange={onSearchChange}
              onClose={onCloseSearch}
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
          <div className="px-6 pt-3 pb-0">
            {/* Title + Icons Row - IMMER SICHTBAR */}
          <div className="flex items-center justify-between">
            {/* Title Section (Links) */}
            <div className="flex-shrink-0">
              <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white">
                Meine Karteikarten
              </h1>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Search Button */}
              <SearchButton onClick={onOpenSearch} />

              {/* Options Menu Button + Menu Container */}
              <div className="relative">
                <OptionsButton onClick={onToggleOptionsMenu} />

                <MobileOptionsMenu
                  show={showOptionsMenu}
                  sortedSetsCount={visibleSetsForMenu.length}
                  allSetsCount={allSetsForTab.length}
                  activeSubject={activeSubject || 'All'}
                  activeKategorie={activeKategorie || ''}
                  activeThema={activeThema || ''}
                  activeUnterthema={activeUnterthema || ''}
                  onClose={onCloseOptionsMenu}
                  onEnterSelectionMode={onEnterSelectionMode}
                  onDeleteFiltered={onDeleteFiltered}
                  onDeleteAll={onDeleteAll}
                />
              </div>

              {/* X-Button (Rechts) - immer sichtbar auf Mobile */}
              <CloseButton onClick={onClose} />
            </div>
          </div>

          {/* Filter Chips - IMMER SICHTBAR */}
          <div className="-mx-6 mt-3 pb-3">
            <MobileSubjectChips
              allSets={allSets}
              activeSubject={activeSubject || 'All'}
              activeKategorie={activeKategorie || ''}
              activeThema={activeThema || ''}
              activeUnterthema={activeUnterthema || ''}
              onSubjectChange={onSubjectChange}
              onKategorieChange={onKategorieChange}
              onThemaChange={onThemaChange}
              onUnterthemaChange={onUnterthemaChange}
              showOnlySubject={activeTab === 'Manual'}
            />
          </div>
        </div>
        </div>

        {/* Flashcard Grid - Scrollable Content */}
        {/* Bewegt sich synchron mit Header durch den Wrapper */}
        <div className="absolute left-0 right-0 overflow-hidden pointer-events-auto" style={{ top: '115px', bottom: '0' }}>
          <div 
            ref={scrollContainerRef}
            className="h-full overflow-y-auto scrollbar-thin"
          >
            {/* CSS-only Tab-Transition (no Framer Motion) */}
            <div
              key={activeTab}
              style={{
                animation: `${slideDirection === 'right' ? 'tabSlideFromRight' : 'tabSlideFromLeft'} 300ms cubic-bezier(0.4, 0.0, 0.2, 1) both`,
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased',
              } as React.CSSProperties}
            >
              {/* Prognosen Tab Content */}
              {activeTab === 'Prognosis' ? (
                <div className="pt-4">
                  <PrognosisSection
                    onOpenFlashcardSet={onOpenFlashcardSet}
                    activeSubject={activeSubject}
                    activeKategorie={activeKategorie}
                    activeThema={activeThema}
                    activeUnterthema={activeUnterthema}
                    searchQuery={searchQuery}
                    selectionMode={selectionMode}
                    selectedCards={selectedCards}
                    onToggleCardSelection={onToggleCardSelection}
                    isMobile={true}
                    allSets={allSets}
                    activeSubTab={prognosisSubTab}
                    onSubTabChange={setPrognosisSubTab}
                  />
                </div>
              ) : activeTab === 'Teacher' ? (
                /* Vom Lehrer Tab Content */
                <div className="pt-8 pb-[80px] px-6">
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    {tutoringStatus === 'activated' ? (
                      <>
                        {/* Nachhilfe aktiv – aber noch keine Karteikarten vom Lehrer */}
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                          style={{
                            background: 'rgba(0,184,148,0.07)',
                            border: '1px solid rgba(0,184,148,0.15)',
                          }}
                        >
                          <Send className="w-7 h-7 text-[#00B894]/60" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white/80 mb-2">
                          Vom Lehrer
                        </h3>
                        <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/35 max-w-[280px] leading-relaxed">
                          Hier erscheinen Karteikarten-Sets, die dein Nachhilfelehrer dir zugeschickt hat.
                        </p>
                        <div 
                          className="mt-6 px-4 py-2 rounded-full"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/25">
                            Noch keine Sets erhalten
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Nachhilfe nicht aktiv – Locked State mit CTA */}
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative"
                          style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <GraduationCap className="w-7 h-7 text-white/20" strokeWidth={1.5} />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0a0a0a] flex items-center justify-center">
                            <Lock className="w-3 h-3 text-white/30" strokeWidth={2} />
                          </div>
                        </div>
                        <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white/80 mb-2">
                          Lehrer-Karteikarten
                        </h3>
                        <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/35 max-w-[280px] leading-relaxed mb-1">
                          Dein Nachhilfelehrer kann dir individuelle Karteikarten-Sets zuschicken, die genau auf deine Schwächen abgestimmt sind.
                        </p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/25 max-w-[260px] leading-relaxed">
                          {tutoringStatus === 'requestSent' ? '' : 'Aktiviere die Nachhilfe, um diese Funktion freizuschalten.'}
                        </p>
                        <button
                          onClick={() => {
                            // Navigate to tutoring activation
                            // This will be handled by the parent via a callback
                            if (onOpenTutoringActivation) {
                              onOpenTutoringActivation();
                            }
                          }}
                          className="mt-6 px-5 py-2.5 rounded-xl flex items-center gap-2 active:scale-[0.97] transition-all duration-200"
                          style={{
                            background: tutoringStatus === 'requestSent' ? 'rgba(255,184,77,0.07)' : 'rgba(0,184,148,0.07)',
                            border: tutoringStatus === 'requestSent' ? '1px solid rgba(255,184,77,0.2)' : '1px solid rgba(0,184,148,0.25)',
                            WebkitTapHighlightColor: 'transparent',
                            pointerEvents: tutoringStatus === 'requestSent' ? 'none' : 'auto',
                          }}
                        >
                          {tutoringStatus === 'requestSent' ? (
                            <>
                              <Clock className="w-4 h-4 text-[#FFB84D]" strokeWidth={2} />
                              <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-[#FFB84D]">
                                Anfrage gesendet
                              </span>
                            </>
                          ) : (
                            <>
                              <GraduationCap className="w-4 h-4 text-white/70" strokeWidth={2} />
                              <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/90">
                                Nachhilfe aktivieren
                              </span>
                            </>
                          )}
                        </button>
                        {tutoringStatus === 'requestSent' && (
                          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/20 mt-3 text-center">
                            Dies kann bis zu 48 Stunden dauern.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pt-3 pb-[80px]">
                  {/* Button "Eigenes Set erstellen" - NUR im "Eigene"-Tab */}
                  {activeTab === 'Manual' && (
                    <div className="px-6 pb-4" style={{ position: 'relative', zIndex: 10 }}>
                      <button
                        onClick={() => {
                          console.log('🔵 Eigenes Set erstellen Button clicked!');
                          onCreateOwnSet();
                        }}
                        className="w-full bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] active:border-white/[0.2] rounded-[16px] px-6 py-4 flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-150 active:scale-[0.98]"
                        style={{
                          WebkitTapHighlightColor: 'transparent',
                          pointerEvents: 'auto',
                          touchAction: 'manipulation'
                        }}
                      >
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="font-['Poppins:Medium',sans-serif] text-[15px] text-white">
                          Eigenes Set erstellen
                        </span>
                      </button>
                    </div>
                  )}

                  <FlashcardGrid
                    paginatedSets={paginatedSets}
                    sortedSets={sortedSets}
                    selectionMode={selectionMode}
                    selectedCards={selectedCards}
                    windowWidth={windowWidth}
                    sidebarCollapsed={false}
                    isMobile={true}
                    gridColumns={gridColumns}
                    activeTab={activeTab}
                    onCardClick={onOpenFlashcardSet}
                    onToggleSelection={onToggleCardSelection}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ENDE: Animated Wrapper */}

      {/* Floating Bottom Bar - Tabs ODER Selection Toolbar */}
      <div 
        className="fixed bottom-6 left-6 right-6 z-[70] pointer-events-auto"
        style={{
          transform: isBottomBarVisible ? 'translateY(0)' : 'translateY(calc(100% + 24px))',
          transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
      >
        {selectionMode ? (
          /* Selection Toolbar - wenn Auswahl-Modus aktiv */
          <SelectionToolbar
            selectedCount={selectedCards.length}
            totalCount={visibleSetsForMenu.length}
            windowWidth={windowWidth}
            onSelectAll={() => {
              const allIds = visibleSetsForMenu.map(set => set.id);
              onSelectAllCards(allIds);
            }}
            onCancel={onCancelSelection}
            onDelete={onDeleteSelected}
          />
        ) : (
          /* Premium Glass Container - Normal Tabs mit optimaler Sichtbarkeit */
          <div 
            className="relative rounded-[20px] overflow-hidden bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12]"
          >
            {/* Glasoptik-Texture Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
                opacity: 0.05,
              }}
            />
            {/* Subtiler Top-Glow für mehr Dimension */}
            <div
              className="absolute top-0 left-0 right-0 h-[50%] pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 100%)',
              }}
            />
            
            {/* Main Content */}
            <div className="relative z-10">
              <div className="px-2 py-2">
                <div className="relative flex items-center justify-center gap-1">
                  {/* Smooth sliding indicator - GPU-composited translateX */}
                  <div 
                    className="absolute top-0 bottom-0 left-[4px] rounded-[14px]"
                    style={{
                      width: `calc((100% - 8px) / 4)`,
                      transform: `translateX(${tabIndex * 100}%)`,
                      transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                      willChange: 'transform',
                      contain: 'layout style paint',
                    }}
                  >
                    {/* Indicator Fill - Helle leuchtende Glasoptik */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-white/[0.18] to-white/[0.12] border border-white/[0.2] rounded-[14px]"
                    />
                  </div>
                  
                  {/* Tab Buttons */}
                  {[
                    { id: 'Repeat', label: 'KI-Sets' },
                    { id: 'Manual', label: 'Eigene' },
                    { id: 'Prognosis', label: 'Prognosen' },
                    { id: 'Teacher', label: 'Lehrer' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        console.log('TAB CLICKED:', tab.id, 'Current activeTab:', activeTab);
                        
                        // Ignoriere Klick wenn der gleiche Tab schon aktiv ist
                        if (tab.id === activeTab) {
                          console.log('Same tab, ignoring');
                          return;
                        }
                        
                        console.log('Calling onTabChange with:', tab.id);
                        // Tab wechseln
                        handleTabChangeWithSlide(tab.id);
                      }}
                      className={`
                        relative z-10 flex-1 px-2 rounded-[14px] font-['Poppins:Medium',sans-serif] text-[12px] transition-all duration-200
                        flex items-center justify-center
                        ${activeTab === tab.id
                          ? 'text-white'
                          : 'text-white/70'
                        }
                      `}
                      style={{
                        WebkitTapHighlightColor: 'transparent',
                        height: '40px',
                        lineHeight: '1'
                      }}
                    >
                      <span className="relative" style={{ top: '0.5px' }}>
                        {tab.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});