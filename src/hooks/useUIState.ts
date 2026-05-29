import { useState } from 'react';

// ===== UI STATE HOOK =====
// Verwaltet UI-spezifische States (Modals, Menus, etc.)

export function useUIState() {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchClosing, setSearchClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /**
   * Öffnet Options Menu
   */
  const openOptionsMenu = () => {
    setShowOptionsMenu(true);
  };

  /**
   * Schließt Options Menu
   */
  const closeOptionsMenu = () => {
    setShowOptionsMenu(false);
  };

  /**
   * Togglet Options Menu
   */
  const toggleOptionsMenu = () => {
    console.log('🔘 toggleOptionsMenu CALLED - Current showOptionsMenu:', showOptionsMenu);
    setShowOptionsMenu((prev) => {
      console.log('🔘 Setting showOptionsMenu from', prev, 'to', !prev);
      return !prev;
    });
  };

  /**
   * Öffnet Search Overlay
   */
  const openSearch = () => {
    console.log('🔍 openSearch CALLED - Current showSearch:', showSearch);
    setShowSearch(true);
    setSearchClosing(false);
    console.log('🔍 setShowSearch(true) called');
  };

  /**
   * Schließt Search Overlay (instant - same speed as opening)
   */
  const closeSearch = () => {
    setSearchQuery(''); // Reset search query beim Schließen
    setShowSearch(false);
    setSearchClosing(false);
  };

  /**
   * Setzt Page zu bestimmter Nummer
   */
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  /**
   * Setzt Page zurück auf 1
   */
  const resetPage = () => {
    setCurrentPage(1);
  };

  /**
   * Geht zur nächsten Page
   */
  const nextPage = (totalPages: number) => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  /**
   * Geht zur vorherigen Page
   */
  const previousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  /**
   * Togglet Sidebar Collapsed State
   */
  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  /**
   * Collapsed Sidebar
   */
  const collapseSidebar = () => {
    setSidebarCollapsed(true);
  };

  /**
   * Expanded Sidebar
   */
  const expandSidebar = () => {
    setSidebarCollapsed(false);
  };

  return {
    // States
    showOptionsMenu,
    showSearch,
    searchClosing,
    searchQuery,
    currentPage,
    sidebarCollapsed,

    // Options Menu
    openOptionsMenu,
    closeOptionsMenu,
    toggleOptionsMenu,

    // Search
    openSearch,
    closeSearch,
    setSearchQuery,

    // Pagination
    goToPage,
    resetPage,
    nextPage,
    previousPage,

    // Sidebar
    toggleSidebar,
    collapseSidebar,
    expandSidebar,

    // Direct Setters (für Edge Cases)
    setShowOptionsMenu,
    setShowSearch,
    setSearchClosing,
    setCurrentPage,
    setSidebarCollapsed,
  };
}
