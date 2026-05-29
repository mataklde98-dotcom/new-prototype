// ===== MY FLASHCARDS HEADER =====
// Wrapper Component - rendert Mobile oder Desktop Version

import React from 'react';
import MyFlashcardsHeaderMobile from './MyFlashcardsHeaderMobile';
import MyFlashcardsHeaderDesktop from './MyFlashcardsHeaderDesktop';
import { FlashcardSet } from '@/types/flashcard';

interface MyFlashcardsHeaderProps {
  // State Props
  isMobile: boolean;
  windowWidth: number;
  activeTab: string;
  activeSubject: string;
  activeKategorie: string;
  activeThema: string;
  activeUnterthema: string;
  searchQuery: string;
  showSearch: boolean;
  searchClosing: boolean;
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
  onOpenSearch: () => void;
  onCloseSearch: () => void;
  onToggleOptionsMenu: () => void;
  onCloseOptionsMenu: () => void;
  onEnterSelectionMode: () => void;
  onDeleteFiltered: () => void;
  onDeleteAll: () => void;
  onClose?: () => void; // Optional X-Button Handler (nur Mobile)
}

export default function MyFlashcardsHeader(props: MyFlashcardsHeaderProps) {
  if (props.isMobile) {
    return <MyFlashcardsHeaderMobile {...props} />;
  }
  
  return <MyFlashcardsHeaderDesktop {...props} />;
}
