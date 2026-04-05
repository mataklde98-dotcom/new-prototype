import { Dispatch, SetStateAction } from "react";
import { FlashcardSet } from "@/types/flashcard";
import { getOrGenerateCards } from "@/services/cardGenerationService";

export function useFlashcardHandlers(
  setActiveSubject: Dispatch<SetStateAction<string>>,
  setActiveKategorie: Dispatch<SetStateAction<string>>,
  setActiveThema: Dispatch<SetStateAction<string>>,
  setActiveUnterthema: Dispatch<SetStateAction<string>>,
  setCurrentPage: Dispatch<SetStateAction<number>>,
  setAllSets: Dispatch<SetStateAction<FlashcardSet[]>>,
  setSelectedCards: Dispatch<SetStateAction<number[]>>,
  setSelectionMode: Dispatch<SetStateAction<boolean>>,
  setShowDeleteConfirm: Dispatch<SetStateAction<boolean>>,
  sortedSets: FlashcardSet[],
  selectedCards: number[],
  deleteMode: "selected" | "filtered" | "all",
  tabFilteredSets: FlashcardSet[]
) {
  // ===== FILTER HANDLERS =====
  // Reset child filters when parent changes
  const handleSubjectChange = (val: string) => {
    setActiveSubject(val);
    setActiveKategorie("");
    setActiveThema("");
    setActiveUnterthema("");
    setCurrentPage(1); // Reset to page 1
  };

  const handleKategorieChange = (val: string) => {
    setActiveKategorie(val);
    setActiveThema("");
    setActiveUnterthema("");
    setCurrentPage(1); // Reset to page 1
  };

  const handleThemaChange = (val: string) => {
    setActiveThema(val);
    setActiveUnterthema("");
    setCurrentPage(1); // Reset to page 1
  };

  const handleUnterthemaChange = (val: string) => {
    setActiveUnterthema(val);
    setCurrentPage(1); // Reset to page 1
  };

  // ===== DELETE HANDLERS =====
  const handleDeleteSelected = () => {
    setAllSets((prev) =>
      prev.filter((set) => !selectedCards.includes(set.id)),
    );
    setSelectedCards([]);
    setSelectionMode(false);
    setShowDeleteConfirm(false);
  };

  const handleDeleteFiltered = () => {
    const filteredIds = sortedSets.map((s) => s.id);
    setAllSets((prev) =>
      prev.filter((set) => !filteredIds.includes(set.id)),
    );
    setSelectedCards([]);
    setSelectionMode(false);
    setShowDeleteConfirm(false);
  };

  const handleDeleteAll = () => {
    const tabIds = tabFilteredSets.map((s) => s.id);
    setAllSets((prev) =>
      prev.filter((set) => !tabIds.includes(set.id)),
    );
    setSelectedCards([]);
    setSelectionMode(false);
    setShowDeleteConfirm(false);
  };

  const confirmDelete = () => {
    if (deleteMode === "selected") handleDeleteSelected();
    else if (deleteMode === "filtered") handleDeleteFiltered();
    else handleDeleteAll();
  };

  // ===== SELECTION HANDLERS =====
  const toggleCardSelection = (id: number) => {
    setSelectedCards((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id],
    );
  };

  const selectAllVisible = () => {
    setSelectedCards(sortedSets.map((s) => s.id));
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedCards([]);
  };

  // ===== FLASHCARD SET HANDLERS =====
  /**
   * Bereitet ein Flashcard-Set zum Öffnen vor
   * Generiert Cards falls keine vorhanden sind
   */
  const prepareFlashcardSetForOpening = (set: FlashcardSet) => {
    // Nutze Service für Card-Generierung
    const cards = getOrGenerateCards(set);

    // Update lastOpened timestamp
    setAllSets((prevSets) =>
      prevSets.map((s) =>
        s.id === set.id
          ? {
              ...s,
              lastOpened: new Date(),
            }
          : s,
      ),
    );

    return {
      setId: set.id,
      setName: set.title,
      subtopicName: set.unterthema,
      subject: set.subject,
      cards,
    };
  };

  return {
    // Filter handlers
    handleSubjectChange,
    handleKategorieChange,
    handleThemaChange,
    handleUnterthemaChange,
    
    // Delete handlers
    handleDeleteSelected,
    handleDeleteFiltered,
    handleDeleteAll,
    confirmDelete,
    
    // Selection handlers
    toggleCardSelection,
    selectAllVisible,
    cancelSelection,
    
    // Flashcard set handlers
    prepareFlashcardSetForOpening,
  };
}