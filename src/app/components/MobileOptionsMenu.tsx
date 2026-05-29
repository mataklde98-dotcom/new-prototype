// ===== MOBILE OPTIONS MENU (3-DOTS DROPDOWN) =====

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface MobileOptionsMenuProps {
  show: boolean;
  sortedSetsCount: number;
  allSetsCount: number;
  activeSubject: string;
  activeKategorie: string;
  activeThema: string;
  activeUnterthema: string;
  onClose: () => void;
  onEnterSelectionMode: () => void;
  onDeleteFiltered: () => void;
  onDeleteAll: () => void;
}

export default function MobileOptionsMenu({
  show,
  sortedSetsCount,
  allSetsCount,
  activeSubject,
  activeKategorie,
  activeThema,
  activeUnterthema,
  onClose,
  onEnterSelectionMode,
  onDeleteFiltered,
  onDeleteAll,
}: MobileOptionsMenuProps) {
  // Close on Escape key
  useEffect(() => {
    if (!show) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [show, onClose]);

  if (!show) return null;

  const isFilterActive =
    activeSubject !== "All" ||
    activeKategorie ||
    activeThema ||
    activeUnterthema;

  return createPortal(
    <>
      {/* Backdrop for closing */}
      <div 
        className="fixed inset-0 z-[190]" 
        onClick={onClose}
      />

      {/* Menu - Fixed position direkt unter den Header-Buttons, am rechten Bildschirmrand */}
      <div
        className="fixed right-4 min-w-[240px] z-[200] rounded-2xl border border-white/[0.12]"
        style={{
          top: 'calc(env(safe-area-inset-top) + 12px + 42px + 8px)'
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          className="rounded-2xl bg-[#141414]"
          style={{
            animation: "fadeSlideIn 0.2s ease-out",
          }}
        >
          {/* Auswahl-Modus */}
          <button
            onClick={() => {
              onEnterSelectionMode();
              onClose();
            }}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left font-['Poppins:Medium',sans-serif] text-[14px] text-white/70 hover:text-white hover:bg-white/[0.05] transition-all duration-200 first:rounded-t-2xl"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Auswahl-Modus
          </button>

          <div className="h-px bg-white/[0.06] mx-3" />

          {/* Gefilterte löschen */}
          <button
            onClick={() => {
              onDeleteFiltered();
              onClose();
            }}
            disabled={!isFilterActive}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left font-['Poppins:Medium',sans-serif] text-[14px] text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.05] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <div className="flex flex-col">
              <span>Gefilterte löschen</span>
              <span className="text-[12px] text-white/40">
                ({sortedSetsCount})
              </span>
            </div>
          </button>

          {/* Alle löschen */}
          <button
            onClick={() => {
              onDeleteAll();
              onClose();
            }}
            disabled={allSetsCount === 0}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left font-['Poppins:Medium',sans-serif] text-[14px] text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.05] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed last:rounded-b-2xl"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <div className="flex flex-col">
              <span>Alle löschen</span>
              <span className="text-[12px] text-white/40">
                ({allSetsCount})
              </span>
            </div>
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}