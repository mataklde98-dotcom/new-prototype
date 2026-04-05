// ===== SEARCH OVERLAY (MOBILE) =====

interface SearchOverlayProps {
  show: boolean;
  searchQuery: string;
  searchClosing: boolean;
  onSearchChange: (value: string) => void;
  onClose: () => void;
}

export default function SearchOverlay({
  show,
  searchQuery,
  searchClosing,
  onSearchChange,
  onClose,
}: SearchOverlayProps) {
  if (!show) return null;

  const handleClose = () => {
    // Clear text for clean animation
    onSearchChange("");
    // Close immediately - no delay needed
    onClose();
  };

  const handleBlur = () => {
    // Auto-close if empty
    if (searchQuery.trim() === "") {
      onClose();
    }
  };

  return (
    <div
      className="flex items-center gap-3 flex-1"
      style={{
        animation: searchClosing
          ? "slideUpOut 0.3s ease-out"
          : "slideDownIn 0.3s ease-out",
      }}
    >
      <div className="flex-1 relative">
        <input
          type="text"
          autoFocus
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onBlur={handleBlur}
          placeholder="Karteikarten durchsuchen..."
          className="w-full px-4 py-2.5 pl-10 pr-10 rounded-xl font-['Poppins:Regular',sans-serif] text-[14px] text-white placeholder:text-white/40 transition-all duration-200 border border-white/[0.12] focus:border-[#009379]/50 outline-none"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
          }}
        />

        {/* Search Icon (left) */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Close Button (right) */}
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            handleClose();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors duration-200 flex items-center justify-center"
          style={{
            width: "20px",
            height: "20px",
          }}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}