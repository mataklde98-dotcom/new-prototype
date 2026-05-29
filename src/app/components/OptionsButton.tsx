// ==================== SHARED OPTIONS BUTTON ====================
// Systemweite Options/3-Punkt-Button-Komponente im Premium Glass Style
// Einheitliche Größe (42px), Glass-Fill, gedämpftes Icon
// Matched CloseButton + SearchButton visuell

import React, { forwardRef } from 'react';

interface OptionsButtonProps {
  onClick: () => void;
  className?: string;
}

const OptionsButton = forwardRef<HTMLButtonElement, OptionsButtonProps>(
  ({ onClick, className = '' }, ref) => {
    return (
      <button
        ref={ref}
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
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
          />
        </svg>
      </button>
    );
  }
);

OptionsButton.displayName = 'OptionsButton';

export default OptionsButton;
