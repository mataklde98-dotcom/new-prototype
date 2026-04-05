import React from 'react';

interface DateCardProps {
  day: string;
  date: string;
  active?: boolean;
}

// ⚡ PERFORMANCE: React.memo - verhindert unnötige Re-Renders!
const DateCard = React.memo(function DateCard({ day, date, active = false }: DateCardProps) {
  return (
    <button 
      className={`relative overflow-hidden transition-all duration-300 ease-out active:scale-95 ${
        active 
          ? 'bg-gradient-to-br from-white/[0.12] to-white/[0.06] border border-white/[0.18]' 
          : 'bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12]'
      } content-stretch flex flex-col font-['Poppins:Medium',sans-serif] items-center justify-center leading-[normal] not-italic px-[6px] py-[16px] rounded-[24px] w-full h-full text-center text-white whitespace-pre-wrap`}
      style={{
        WebkitTapHighlightColor: 'transparent',
        transform: 'translateZ(0)',
      }}
    >
      {/* Active Glow Effect - Ultra-dezent & edel */}
      {active && (
        <div 
          className="absolute inset-0 rounded-[24px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04), transparent 65%)',
            opacity: 1
          }}
        />
      )}
      
      <p className={`relative shrink-0 text-[12px] w-[34px] z-10 transition-colors duration-200 ${
        active ? 'text-white/95' : 'text-white/70'
      }`}>{day}</p>
      <p className={`relative shrink-0 text-[18px] w-[34px] z-10 transition-colors duration-200 ${
        active ? 'text-white' : 'text-white/80'
      }`}>{date}</p>
    </button>
  );
});

export default DateCard;
