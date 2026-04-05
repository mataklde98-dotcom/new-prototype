// ===== DESKTOP OPTIONS MENU (3-DOTS DROPDOWN) =====

interface DesktopOptionsMenuProps {
  show: boolean;
  sortedSetsCount: number;
  allSetsCount: number;
  activeSubject: string;
  activeKategorie: string;
  activeThema: string;
  activeUnterthema: string;
  windowWidth: number;
  onClose: () => void;
  onEnterSelectionMode: () => void;
  onDeleteFiltered: () => void;
  onDeleteAll: () => void;
}

export default function DesktopOptionsMenu({
  show,
  sortedSetsCount,
  allSetsCount,
  activeSubject,
  activeKategorie,
  activeThema,
  activeUnterthema,
  windowWidth,
  onClose,
  onEnterSelectionMode,
  onDeleteFiltered,
  onDeleteAll,
}: DesktopOptionsMenuProps) {
  if (!show) return null;

  const isFilterActive =
    activeSubject !== "All" ||
    activeKategorie ||
    activeThema ||
    activeUnterthema;

  return (
    <div
      className="absolute right-0 top-full mt-2 min-w-[180px] sm:min-w-[200px] z-[100] rounded-xl border border-white/[0.12] bg-[#141414]"
      onMouseLeave={onClose}
    >
      <button
        onClick={() => {
          onEnterSelectionMode();
          onClose();
        }}
        className="w-full px-4 py-3 flex items-center gap-3 text-left font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 hover:text-white hover:bg-white/[0.05] transition-all duration-200 first:rounded-t-xl last:rounded-b-xl"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Auswahl-Modus
      </button>

      <div className="h-px bg-white/[0.06] mx-2" />

      <button
        onClick={() => {
          onDeleteFiltered();
          onClose();
        }}
        disabled={!isFilterActive}
        className="w-full px-4 py-3 flex items-center gap-3 text-left font-['Poppins:Medium',sans-serif] text-[13px] text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.05] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <div className="flex flex-col">
          <span>Gefilterte löschen</span>
          <span className="text-[11px] text-white/40">
            ({sortedSetsCount})
          </span>
        </div>
      </button>

      <button
        onClick={() => {
          onDeleteAll();
          onClose();
        }}
        disabled={allSetsCount === 0}
        className="w-full px-4 py-3 flex items-center gap-3 text-left font-['Poppins:Medium',sans-serif] text-[13px] text-red-400/70 hover:text-red-400 hover:bg-red-500/[0.05] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed last:rounded-b-xl"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <div className="flex flex-col">
          <span>Alle löschen</span>
          <span className="text-[11px] text-white/40">({allSetsCount})</span>
        </div>
      </button>
    </div>
  );
}