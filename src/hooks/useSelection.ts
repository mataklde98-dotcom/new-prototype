import { useState } from 'react';

// ===== SELECTION STATE HOOK =====
// Verwaltet Selection-Mode und ausgewählte Items

export function useSelection() {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  /**
   * Aktiviert Selection Mode
   */
  const enterSelectionMode = () => {
    setSelectionMode(true);
  };

  /**
   * Deaktiviert Selection Mode und cleared Selection
   */
  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedCards([]);
  };

  /**
   * Togglet Selection einer Card
   */
  const toggleCard = (id: number) => {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  /**
   * Wählt mehrere Cards aus
   */
  const selectCards = (ids: number[]) => {
    setSelectedCards(ids);
  };

  /**
   * Wählt alle Cards aus
   */
  const selectAll = (ids: number[]) => {
    setSelectedCards(ids);
  };

  /**
   * Deselektiert alle Cards
   */
  const deselectAll = () => {
    setSelectedCards([]);
  };

  /**
   * Prüft ob eine Card ausgewählt ist
   */
  const isSelected = (id: number): boolean => {
    return selectedCards.includes(id);
  };

  /**
   * Prüft ob alle Cards ausgewählt sind
   */
  const areAllSelected = (allIds: number[]): boolean => {
    return (
      allIds.length > 0 &&
      allIds.every((id) => selectedCards.includes(id))
    );
  };

  /**
   * Gibt die Anzahl der ausgewählten Cards zurück
   */
  const getSelectedCount = (): number => {
    return selectedCards.length;
  };

  /**
   * Prüft ob mindestens eine Card ausgewählt ist
   */
  const hasSelection = (): boolean => {
    return selectedCards.length > 0;
  };

  return {
    // States
    selectionMode,
    selectedCards,

    // Mode Control
    enterSelectionMode,
    exitSelectionMode,

    // Selection Control
    toggleCard,
    selectCards,
    selectAll,
    deselectAll,

    // Queries
    isSelected,
    areAllSelected,
    getSelectedCount,
    hasSelection,

    // Direct Setters (für Edge Cases)
    setSelectionMode,
    setSelectedCards,
  };
}
