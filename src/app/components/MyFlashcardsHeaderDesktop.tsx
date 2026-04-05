// ===== MY FLASHCARDS HEADER DESKTOP =====
// Desktop-only Header für My Flashcards Screen

import React from 'react';
import { Search } from 'lucide-react';
import PremiumTabs from './PremiumTabs';
import BreadcrumbFilter from './BreadcrumbFilter';
import DesktopOptionsMenu from './DesktopOptionsMenu';
import { FlashcardSet } from '@/types/flashcard';
import { useDesktopHeaderLayout } from '@/hooks/useDesktopHeaderLayout';

interface MyFlashcardsHeaderDesktopProps {
  // State Props
  windowWidth: number;
  activeTab: string;
  activeSubject: string;
  activeKategorie: string;
  activeThema: string;
  activeUnterthema: string;
  searchQuery: string;
  showOptionsMenu: boolean;
  selectionMode: boolean;
  
  // Data Props
  allSets: FlashcardSet[];
  sortedSetsCount: number;
  
  // Handler Props
  onTabChange: (tab: string) => void;
  onSubjectChange: (subject: string) => void;
  onKategorieChange: (kategorie: string) => void;
  onThemaChange: (thema: string) => void;
  onUnterthemaChange: (unterthema: string) => void;
  onSearchChange: (query: string) => void;
  onToggleOptionsMenu: () => void;
  onCloseOptionsMenu: () => void;
  onEnterSelectionMode: () => void;
  onDeleteFiltered: () => void;
  onDeleteAll: () => void;
}

export default function MyFlashcardsHeaderDesktop({
  windowWidth,
  activeTab,
  activeSubject,
  activeKategorie,
  activeThema,
  activeUnterthema,
  searchQuery,
  showOptionsMenu,
  selectionMode,
  allSets,
  sortedSetsCount,
  onTabChange,
  onSubjectChange,
  onKategorieChange,
  onThemaChange,
  onUnterthemaChange,
  onSearchChange,
  onToggleOptionsMenu,
  onCloseOptionsMenu,
  onEnterSelectionMode,
  onDeleteFiltered,
  onDeleteAll,
}: MyFlashcardsHeaderDesktopProps) {
  const [searchExpanded, setSearchExpanded] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const headerCardRef = React.useRef<HTMLDivElement>(null);

  // Reusable hook: switch to 2-row layout when container is narrow
  const { isNarrow: isNarrowHeader } = useDesktopHeaderLayout(headerCardRef);

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

  // ── Shared sub-components (avoid duplication) ──

  const SearchComponent = (
    <div
      className="search-container flex-shrink-0 transition-[width] duration-200 ease-out"
      style={{ width: searchExpanded ? "200px" : "40px" }}
    >
      {searchExpanded ? (
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
  );

  const KebabComponent = !selectionMode ? (
    <div className="relative flex-shrink-0">
      <button
        onClick={onToggleOptionsMenu}
        className="rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 transition-colors duration-200 hover:bg-white/[0.05]"
        style={{ width: "36px", height: "36px" }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>
      <DesktopOptionsMenu
        show={showOptionsMenu}
        sortedSetsCount={sortedSetsCount}
        allSetsCount={allSets.length}
        activeSubject={activeSubject}
        activeKategorie={activeKategorie}
        activeThema={activeThema}
        activeUnterthema={activeUnterthema}
        windowWidth={windowWidth}
        onClose={onCloseOptionsMenu}
        onEnterSelectionMode={onEnterSelectionMode}
        onDeleteFiltered={onDeleteFiltered}
        onDeleteAll={onDeleteAll}
      />
    </div>
  ) : null;

  return (
    <div
      className="flex-shrink-0 relative z-20"
      style={{
        marginBottom: windowWidth < 640 ? "24px" : "12px",
      }}
    >
      <div
        ref={headerCardRef}
        className="relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08]"
        style={{
          borderRadius: windowWidth < 768 ? "16px" : "20px",
          padding: windowWidth < 768 ? "16px" : "20px",
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
            borderRadius: windowWidth < 768 ? "16px" : "20px",
          }}
        />

        <div
          className="relative z-10 flex flex-col"
          style={{ gap: "12px" }}
        >
          {isNarrowHeader ? (
            /* ━━━ NARROW (<820px card): Two-row layout ━━━
               Row 1: Title (truncatable) + Search + Kebab
               Row 2: Tabs (overflow-x-auto safety for future tab growth)
               Nothing overlaps — each row is intrinsically overflow-safe */
            <>
              <div className="flex items-center gap-3 min-w-0">
                <h1
                  className="font-['Poppins:SemiBold',sans-serif] text-white/95 tracking-tight flex-1 min-w-0 truncate"
                  style={{ fontSize: "22px" }}
                >
                  Meine Karteikarten
                </h1>
                {SearchComponent}
                {KebabComponent}
              </div>
              {/* Row 2: Tabs — overflow-x-auto as safety valve for 4+ tabs / long i18n labels */}
              <div className="flex items-center -mx-1 px-1 overflow-x-auto">
                <PremiumTabs activeTab={activeTab} onTabChange={onTabChange} />
              </div>
            </>
          ) : (
            /* ━━━ WIDE (≥820px card): Single-row layout ━━━
               [Title truncatable] [Search] ── spacer ── [Tabs] [Kebab]
               Title is flex-shrink-1 → truncates gracefully when space is tight.
               This is safe because 820px guarantees tabs + search + kebab fit,
               and title absorbs the remaining space. */
            <div className="flex items-center gap-3 min-w-0">
              <h1
                className="font-['Poppins:SemiBold',sans-serif] text-white/95 tracking-tight min-w-0 truncate"
                style={{ fontSize: "22px", flexShrink: 1 }}
              >
                Meine Karteikarten
              </h1>
              {SearchComponent}
              <div className="flex-1 min-w-0" />
              <div className="flex-shrink-0">
                <PremiumTabs activeTab={activeTab} onTabChange={onTabChange} />
              </div>
              {KebabComponent}
            </div>
          )}

          {/* Breadcrumb Filter */}
          <div style={{ minHeight: "40px", overflowX: "visible", overflowY: "visible" }}>
            <BreadcrumbFilter
              allSets={allSets}
              activeSubject={activeSubject}
              activeKategorie={activeKategorie}
              activeThema={activeThema}
              activeUnterthema={activeUnterthema}
              onSubjectChange={onSubjectChange}
              onKategorieChange={onKategorieChange}
              onThemaChange={onThemaChange}
              onUnterthemaChange={onUnterthemaChange}
              showOnlySubject={activeTab === 'Manual'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}