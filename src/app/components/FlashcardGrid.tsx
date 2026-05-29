// ===== FLASHCARD GRID WITH SELECTION =====

import FlashcardItem from "./FlashcardItem";
import { FlashcardSet } from "@/types/flashcard";
import Checkbox from '@/app/components/Checkbox';

interface FlashcardGridProps {
  paginatedSets: FlashcardSet[];
  sortedSets: FlashcardSet[];
  selectionMode: boolean;
  selectedCards: number[];
  windowWidth: number;
  sidebarCollapsed: boolean;
  isMobile: boolean;
  gridColumns: string;
  activeTab?: string; // To customize empty state text
  hideEmptyState?: boolean; // Don't show empty state (e.g. when parent shows custom empty state)
  onCardClick: (set: FlashcardSet) => void;
  onToggleSelection: (id: number) => void;
  onCreateOwnSet?: () => void; // Handler for "Eigenes Set erstellen" button
}

export default function FlashcardGrid({
  paginatedSets,
  sortedSets,
  selectionMode,
  selectedCards,
  windowWidth,
  sidebarCollapsed,
  isMobile,
  gridColumns,
  activeTab,
  hideEmptyState = false,
  onCardClick,
  onToggleSelection,
  onCreateOwnSet,
}: FlashcardGridProps) {
  const gap = isMobile ? "12px" : windowWidth < 640 ? "12px" : "16px";
  const marginBottom = isMobile
    ? "24px"
    : windowWidth < 640
      ? "8px"
      : "12px";

  return (
    <div
      className="flex-1 relative z-10 min-h-0"
      style={{
        paddingLeft: isMobile ? "16px" : "0",
        paddingRight: isMobile ? "16px" : "0",
        overflowY: isMobile ? "auto" : "visible",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Button "Eigenes Set erstellen" - NUR im "Eigene"-Tab (Desktop) */}
      {!isMobile && activeTab === 'Manual' && onCreateOwnSet && (
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={onCreateOwnSet}
            className="w-full bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[16px] px-6 py-4 flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-150 active:scale-[0.99]"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="font-['Poppins:Medium',sans-serif] text-[15px] text-white">
              Eigenes Set erstellen
            </span>
          </button>
        </div>
      )}

      {/* Grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: gridColumns,
          gap: gap,
          marginBottom: marginBottom,
          gridAutoRows: "minmax(min-content, max-content)",
        }}
      >
        {paginatedSets.map((set) => (
          <div key={set.id} className="relative">
            {/* Selection Checkbox */}
            {selectionMode && (
              <div
                className="absolute top-3 right-3 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelection(set.id);
                }}
              >
                <Checkbox
                  checked={selectedCards.includes(set.id)}
                  size="lg"
                />
              </div>
            )}

            {/* Flashcard Item */}
            <FlashcardItem
              subject={set.subject}
              title={set.title}
              cardCount={set.cardCount}
              progress={set.progress}
              createdDate={set.createdDate}
              generationNumber={set.generationNumber}
              onClick={() => onCardClick(set)}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedSets.length === 0 && !hideEmptyState && (
        <div
          className="flex items-center justify-center"
          style={{
            padding: windowWidth < 640 ? "32px 0" : "64px 0",
          }}
        >
          {activeTab === 'Manual' ? (
            // Custom Empty State für "Eigene"-Tab
            <div
              className="text-center flex flex-col items-center"
              style={{
                gap: "20px",
                maxWidth: "400px",
              }}
            >
              {/* Icon */}
              <div 
                className="rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center"
                style={{
                  width: windowWidth < 640 ? "80px" : "100px",
                  height: windowWidth < 640 ? "80px" : "100px",
                }}
              >
                <svg
                  className="text-white/40"
                  style={{
                    width: windowWidth < 640 ? "32px" : "40px",
                    height: windowWidth < 640 ? "32px" : "40px",
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3
                className="font-['Poppins:SemiBold',sans-serif] text-white"
                style={{
                  fontSize: windowWidth < 640 ? "18px" : "20px",
                  letterSpacing: "-0.02em",
                }}
              >
                Noch keine eigenen Sets
              </h3>

              {/* Description */}
              <p
                className="font-['Poppins:Regular',sans-serif] text-white/50 text-center"
                style={{
                  fontSize: windowWidth < 640 ? "13px" : "14px",
                  lineHeight: "1.6",
                  maxWidth: "320px",
                }}
              >
                Erstelle dein erstes Set mit dem Button oben und füge deine eigenen Karteikarten hinzu
              </p>
            </div>
          ) : (
            // Standard Empty State für andere Tabs
            <div
              className="text-center"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <p
                className="font-['Poppins:Medium',sans-serif] text-white/40"
                style={{
                  fontSize: windowWidth < 640 ? "13px" : "14px",
                }}
              >
                Keine Sets gefunden
              </p>
              <p
                className="font-['Poppins:Regular',sans-serif] text-white/25"
                style={{
                  fontSize: windowWidth < 640 ? "11px" : "12px",
                }}
              >
                Versuche einen anderen Filter
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}