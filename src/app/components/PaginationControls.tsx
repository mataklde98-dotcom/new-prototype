// ===== PAGINATION CONTROLS (DESKTOP ONLY) =====
import { calculatePageNumbers, getNextPage, getPreviousPage } from "@/utils/paginationUtils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  windowWidth: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  windowWidth,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const buttonSize = windowWidth < 640 ? "32px" : "36px";
  const iconSize = windowWidth < 640 ? "w-3.5 h-3.5" : "w-4 h-4";
  const fontSize = windowWidth < 640 ? "11px" : "13px";
  const buttonPadding = windowWidth < 640 ? "0 8px" : "0 12px";
  const ellipsisPadding = windowWidth < 640 ? "0 4px" : "0 8px";

  // Use paginationUtils for page calculation
  const { pages: pageNumbers } = calculatePageNumbers({
    currentPage,
    totalPages,
    windowSize: 3,
  });

  // Generate page buttons using calculated page numbers
  const generatePageButtons = () => {
    return pageNumbers.map((pageNum, idx) => {
      if (pageNum === 'ellipsis') {
        return (
          <span
            key={`ellipsis-${idx}`}
            className="text-white/40 font-['Poppins:Medium',sans-serif]"
            style={{
              padding: ellipsisPadding,
              fontSize: fontSize,
            }}
          >
            ...
          </span>
        );
      }

      return (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`rounded-lg font-['Poppins:Medium',sans-serif] transition-all duration-200 ${
            currentPage === pageNum
              ? "bg-gradient-to-br from-[#009379]/20 to-[#00b894]/20 text-white/95 border border-[#009379]/30 shadow-lg shadow-[#009379]/10"
              : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"
          }`}
          style={{
            minWidth: buttonSize,
            height: buttonSize,
            padding: buttonPadding,
            fontSize: fontSize,
          }}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(getPreviousPage(currentPage))}
        disabled={currentPage === 1}
        className="rounded-lg flex items-center justify-center text-white/60 hover:text-white/90 transition-all duration-200 hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        style={{
          width: buttonSize,
          height: buttonSize,
        }}
      >
        <svg
          className={iconSize}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1">
        {generatePageButtons()}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(getNextPage(currentPage, totalPages))}
        disabled={currentPage === totalPages}
        className="rounded-lg flex items-center justify-center text-white/60 hover:text-white/90 transition-all duration-200 hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        style={{
          width: buttonSize,
          height: buttonSize,
        }}
      >
        <svg
          className={iconSize}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
