import { useState } from 'react';

// ===== FLASHCARD FILTERS HOOK =====
// Verwaltet alle Filter-States für Flashcards

export interface FlashcardFilters {
  activeTab: string;
  activeSubject: string;
  activeKategorie: string;
  activeThema: string;
  activeUnterthema: string;
  searchQuery: string;
}

export function useFlashcardFilters() {
  const [activeTab, setActiveTab] = useState('Repeat');
  const [activeSubject, setActiveSubject] = useState('Alle Fächer');
  const [activeKategorie, setActiveKategorie] = useState('');
  const [activeThema, setActiveThema] = useState('');
  const [activeUnterthema, setActiveUnterthema] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Setzt Subject und resettet Child-Filter
   */
  const setSubject = (subject: string) => {
    setActiveSubject(subject);
    setActiveKategorie('');
    setActiveThema('');
    setActiveUnterthema('');
  };

  /**
   * Setzt Kategorie und resettet Child-Filter
   */
  const setKategorie = (kategorie: string) => {
    setActiveKategorie(kategorie);
    setActiveThema('');
    setActiveUnterthema('');
  };

  /**
   * Setzt Thema und resettet Child-Filter
   */
  const setThema = (thema: string) => {
    setActiveThema(thema);
    setActiveUnterthema('');
  };

  /**
   * Setzt Unterthema
   */
  const setUnterthema = (unterthema: string) => {
    setActiveUnterthema(unterthema);
  };

  /**
   * Resettet alle Filter
   */
  const resetFilters = () => {
    setActiveTab('Repeat');
    setActiveSubject('Alle Fächer');
    setActiveKategorie('');
    setActiveThema('');
    setActiveUnterthema('');
    setSearchQuery('');
  };

  /**
   * Resettet nur Hierarchie-Filter (nicht Tab & Search)
   */
  const resetHierarchyFilters = () => {
    setActiveSubject('Alle Fächer');
    setActiveKategorie('');
    setActiveThema('');
    setActiveUnterthema('');
  };

  /**
   * Wechselt Tab und resettet Hierarchie-Filter
   * Damit jeder Tab seine eigenen Filter hat
   */
  const changeTab = (newTab: string) => {
    setActiveTab(newTab);
    resetHierarchyFilters();
  };

  /**
   * Gibt alle Filter als Objekt zurück
   */
  const getFilters = (): FlashcardFilters => ({
    activeTab,
    activeSubject,
    activeKategorie,
    activeThema,
    activeUnterthema,
    searchQuery,
  });

  /**
   * Prüft ob Filter aktiv sind
   */
  const hasActiveFilters = (): boolean => {
    return (
      (activeSubject !== 'Alle Fächer' && activeSubject !== 'All') ||
      activeKategorie !== '' ||
      activeThema !== '' ||
      activeUnterthema !== '' ||
      searchQuery !== ''
    );
  };

  return {
    // States
    activeTab,
    activeSubject,
    activeKategorie,
    activeThema,
    activeUnterthema,
    searchQuery,

    // Setters (Smart - mit Auto-Reset)
    setSubject,
    setKategorie,
    setThema,
    setUnterthema,

    // Direct Setters (für Edge Cases)
    setActiveTab,
    setActiveSubject,
    setActiveKategorie,
    setActiveThema,
    setActiveUnterthema,
    setSearchQuery,

    // Tab-Wechsel mit Auto-Reset
    changeTab,

    // Utility Functions
    resetFilters,
    resetHierarchyFilters,
    getFilters,
    hasActiveFilters,
  };
}
