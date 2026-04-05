// ==================== SHARED CLOSE BUTTON ====================
// Systemweite Close-Button-Komponente im Premium Glass Style
// Einheitliche Größe (42px), Glass-Fill, gedämpftes X-Icon
// Verwendet überall: ExamApp, FlashcardGen, Haupt-App

import React from 'react';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  /** Absolute positioning helper, e.g. "absolute top-6 right-6" */
  position?: string;
}

export default function CloseButton({ onClick, className = '', position = '' }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-white/[0.06] border border-white/[0.08] active:bg-white/[0.1] active:border-white/[0.2] rounded-full size-[42px] flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 flex-shrink-0 ${position} ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <svg
        className="w-[16px] h-[16px] text-[#999]"
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
  );
}
