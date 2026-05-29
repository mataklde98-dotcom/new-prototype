import React from 'react';
import { Plus } from 'lucide-react';

interface AddTaskButtonProps {
  onClick?: () => void;
  /** Compact mode: icon-only for tight spaces */
  compact?: boolean;
}

export default function AddTaskButton({ onClick, compact = false }: AddTaskButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="relative rounded-[14px] h-[38px] bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] text-white flex items-center gap-1 active:scale-[0.98] transition-all duration-150 max-w-full flex-shrink-0"
      style={{
        WebkitTapHighlightColor: 'transparent',
        isolation: 'isolate',
        zIndex: 1,
        padding: compact ? '0 10px' : '0 8px',
      }}
      title="Aufgabe hinzufügen"
    >
      {compact ? (
        <Plus className="relative z-10 w-4 h-4 text-white flex-shrink-0" strokeWidth={2} />
      ) : (
        <>
          <p className="relative z-10 font-['Poppins:SemiBold',sans-serif] font-semibold leading-[normal] whitespace-pre-wrap" style={{ fontSize: '12px' }}>+</p>
          <div className="relative z-10 flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic" style={{ fontSize: '8px' }}>
            <p className="leading-[normal] whitespace-nowrap">Aufgabe hinzufügen</p>
          </div>
        </>
      )}
    </button>
  );
}
