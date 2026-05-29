// ===== SELECTION MODE TOOLBAR =====

interface SelectionToolbarProps {
  selectedCount: number;
  totalCount: number;
  windowWidth: number;
  onSelectAll: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function SelectionToolbar({
  selectedCount,
  totalCount,
  windowWidth,
  onSelectAll,
  onCancel,
  onDelete,
}: SelectionToolbarProps) {
  return (
    <div
      className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.12]"
      style={{
        borderRadius: windowWidth < 640 ? "12px" : "16px",
        padding:
          windowWidth < 640
            ? "12px 16px"
            : windowWidth < 768
              ? "16px 20px"
              : "20px 24px",
        willChange: "transform",
        transform: "translateZ(0)",
        isolation: "isolate",
        zIndex: 1,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        {/* Left: Selection Count + Select All */}
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="font-['Poppins:Medium',sans-serif] text-white/60 text-[13px] sm:text-[14px]">
            {selectedCount} ausgewählt
          </span>
          <button
            onClick={onSelectAll}
            className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[12px] sm:text-[13px] text-white/60 hover:text-white transition-all duration-200 border border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02] hover:bg-white/[0.05]"
          >
            Alle auswählen ({totalCount})
          </button>
        </div>

        {/* Right: Cancel + Delete Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            className="px-3 sm:px-4 py-2 rounded-lg font-['Poppins:Medium',sans-serif] text-[12px] sm:text-[13px] text-white/60 hover:text-white transition-all duration-200"
          >
            Abbrechen
          </button>

          {/* Delete Selected */}
          <button
            onClick={onDelete}
            disabled={selectedCount === 0}
            className="px-4 sm:px-5 py-2 rounded-lg font-['Poppins:Medium',sans-serif] text-[12px] sm:text-[13px] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background:
                selectedCount > 0
                  ? "linear-gradient(135deg, rgba(220, 38, 38, 0.9), rgba(185, 28, 28, 0.9))"
                  : "linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(185, 28, 28, 0.3))",
              border:
                selectedCount > 0
                  ? "1px solid rgba(220, 38, 38, 0.5)"
                  : "1px solid rgba(220, 38, 38, 0.2)",
              color:
                selectedCount > 0
                  ? "#fff"
                  : "rgba(255, 255, 255, 0.3)",
            }}
          >
            <svg
              className="w-4 h-4 inline mr-1.5 mb-0.5"
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
            Löschen ({selectedCount})
          </button>
        </div>
      </div>
    </div>
  );
}
