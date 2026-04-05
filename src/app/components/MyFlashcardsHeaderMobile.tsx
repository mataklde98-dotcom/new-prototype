// ===== MY FLASHCARDS HEADER MOBILE =====
// Mobile-only Header für My Flashcards Screen

import React, { useRef } from 'react';
import { MobileTabs } from './MobileTabs';
import { MobileSubjectChips } from './MobileSubjectChips';
import CloseButton from '@/app/components/CloseButton';
import SearchButton from '@/app/components/SearchButton';
import OptionsButton from '@/app/components/OptionsButton';
import MobileOptionsMenu from './MobileOptionsMenu';
import { FlashcardSet } from '@/types/flashcard';

interface MyFlashcardsHeaderMobileProps {
  // State Props
  activeTab: string;
  activeSubject: string;
  activeKategorie: string;
  activeThema: string;
  activeUnterthema: string;
  searchQuery: string;
  showSearch: boolean;
  searchClosing: boolean;
  showOptionsMenu: boolean;
  
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
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  onToggleOptionsMenu: () => void;
  onCloseOptionsMenu: () => void;
  onEnterSelectionMode: () => void;
  onDeleteFiltered: () => void;
  onDeleteAll: () => void;
  onClose: () => void; // X-Button Handler
}

export default function MyFlashcardsHeaderMobile({
  activeTab,
  activeSubject,
  activeKategorie,
  activeThema,
  activeUnterthema,
  searchQuery,
  showSearch,
  searchClosing,
  showOptionsMenu,
  allSets,
  sortedSetsCount,
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
  onClose,
}: MyFlashcardsHeaderMobileProps) {
  const optionsButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="px-6 py-4">
      {/* Title + Search/Options Row */}
      <div className="flex items-center justify-between">
        {showSearch ? (
          <SearchOverlay
            show={showSearch}
            searchQuery={searchQuery}
            searchClosing={searchClosing}
            onSearchChange={onSearchChange}
            onClose={onCloseSearch}
          />
        ) : (
          <>
            {/* Options Menu Button (Links) */}
            <div className="relative flex-shrink-0">
              <OptionsButton
                ref={optionsButtonRef}
                onClick={onToggleOptionsMenu}
              />

              <MobileOptionsMenu
                show={showOptionsMenu}
                sortedSetsCount={sortedSetsCount}
                allSetsCount={allSets.length}
                activeSubject={activeSubject}
                activeKategorie={activeKategorie}
                activeThema={activeThema}
                activeUnterthema={activeUnterthema}
                onClose={onCloseOptionsMenu}
                onEnterSelectionMode={onEnterSelectionMode}
                onDeleteFiltered={onDeleteFiltered}
                onDeleteAll={onDeleteAll}
              />
            </div>

            {/* Search Button (Mittig) */}
            <div className="flex-1 flex items-center justify-center">
              <SearchButton onClick={onOpenSearch} />
            </div>

            {/* X-Button (Rechts) */}
            <CloseButton onClick={onClose} />
          </>
        )}
      </div>
    </div>
  );
}