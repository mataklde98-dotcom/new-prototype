// ===== BOTTOM BAR =====
// Selection Toolbar OR Create Button + Pagination

import React from 'react';
import SelectionToolbar from './SelectionToolbar';
import PremiumCreateButton from './PremiumCreateButton';
import PaginationControls from './PaginationControls';

interface BottomBarProps {
  isMobile: boolean;
  windowWidth: number;
  selectionMode: boolean;
  selectedCount: number;
  totalCount: number;
  activeTab: string;
  currentPage: number;
  totalPages: number;
  onSelectAll: () => void;
  onCancelSelection: () => void;
  onDeleteSelected: () => void;
  onPageChange: (page: number) => void;
}

export default React.memo(function BottomBar({
  isMobile,
  windowWidth,
  selectionMode,
  selectedCount,
  totalCount,
  activeTab,
  currentPage,
  totalPages,
  onSelectAll,
  onCancelSelection,
  onDeleteSelected,
  onPageChange,
}: BottomBarProps) {
  // Don't render on mobile unless in selection mode or Manual tab
  if (isMobile && !selectionMode && activeTab !== 'Manual') {
    return null;
  }

  // Don't render pagination on desktop when Prognosis or Teacher tab is active
  if (!isMobile && !selectionMode && (activeTab === 'Prognosis' || activeTab === 'Teacher')) {
    return null;
  }

  return (
    <div
      className="flex-shrink-0"
      style={
        isMobile
          ? {
              position: "fixed",
              bottom: "106px",
              left: "16px",
              right: "16px",
              zIndex: 30,
            }
          : {
              marginTop: "auto",
              paddingTop: windowWidth < 640 ? "8px" : "12px",
              paddingBottom: 0,
            }
      }
    >
      {selectionMode ? (
        <SelectionToolbar
          selectedCount={selectedCount}
          totalCount={totalCount}
          windowWidth={windowWidth}
          onSelectAll={onSelectAll}
          onCancel={onCancelSelection}
          onDelete={onDeleteSelected}
        />
      ) : (
        <div
          className="relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06]"
          style={{
            borderRadius: windowWidth < 640 ? "12px" : "16px",
            padding:
              windowWidth < 640
                ? "10px 12px"
                : windowWidth < 768
                  ? "12px 16px"
                  : "16px 24px",
            willChange: "transform",
            transform: "translateZ(0)",
            isolation: "isolate",
            zIndex: 1,
          }}
        >
          <div
            className={`flex items-center justify-between gap-2 md:gap-3 ${
              windowWidth < 850 ? "flex-col" : "flex-row"
            }`}
          >
            {/* Pagination - Desktop Only */}
            {totalPages > 1 && !isMobile ? (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                windowWidth={windowWidth}
                onPageChange={onPageChange}
              />
            ) : windowWidth >= 850 ? (
              <div></div>
            ) : null}

            {/* Create Button */}
            {(!isMobile || activeTab === "Manual") && (
              <div className={`flex-shrink-0 ${windowWidth < 850 ? "w-full" : "w-auto"}`}>
                <PremiumCreateButton />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});