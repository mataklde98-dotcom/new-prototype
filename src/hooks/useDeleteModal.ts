import { useState } from 'react';

// ===== DELETE MODAL HOOK =====
// Verwaltet Delete Confirmation Modal State

export type DeleteMode = 'selected' | 'filtered' | 'all';

export function useDeleteModal() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMode, setDeleteMode] = useState<DeleteMode>('selected');

  /**
   * Öffnet Delete Modal für ausgewählte Items
   */
  const openDeleteSelected = () => {
    setDeleteMode('selected');
    setShowDeleteConfirm(true);
  };

  /**
   * Öffnet Delete Modal für gefilterte Items
   */
  const openDeleteFiltered = () => {
    setDeleteMode('filtered');
    setShowDeleteConfirm(true);
  };

  /**
   * Öffnet Delete Modal für alle Items
   */
  const openDeleteAll = () => {
    setDeleteMode('all');
    setShowDeleteConfirm(true);
  };

  /**
   * Schließt Delete Modal
   */
  const closeDeleteModal = () => {
    setShowDeleteConfirm(false);
  };

  /**
   * Öffnet Delete Modal mit spezifischem Mode
   */
  const openDeleteModal = (mode: DeleteMode) => {
    setDeleteMode(mode);
    setShowDeleteConfirm(true);
  };

  return {
    // States
    showDeleteConfirm,
    deleteMode,

    // Actions
    openDeleteSelected,
    openDeleteFiltered,
    openDeleteAll,
    closeDeleteModal,
    openDeleteModal,

    // Direct Setters (für Edge Cases)
    setShowDeleteConfirm,
    setDeleteMode,
  };
}
