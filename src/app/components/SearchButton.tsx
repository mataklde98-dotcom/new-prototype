// ==================== SHARED SEARCH BUTTON ====================
// Systemweite Search-Button-Komponente im Premium Glass Style
// Einheitliche Größe (42px), Glass-Fill, gedämpftes Icon
// Matched CloseButton + OptionsButton visuell

import React from 'react';

interface SearchButtonProps {
  onClick: () => void;
  className?: string;
}

export default function SearchButton({ onClick, className = '' }: SearchButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-white/[0.06] border border-white/[0.08] active:bg-white/[0.1] active:border-white/[0.2] rounded-full size-[42px] flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 flex-shrink-0 ${className}`}
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  );
}
