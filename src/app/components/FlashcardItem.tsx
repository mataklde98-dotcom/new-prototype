import React from 'react';
import svgPaths from "@/imports/svg-6w4ngzlyfx";

interface FlashcardItemProps {
  subject: string;
  title?: string;
  cardCount?: number;
  progress?: number;
  createdDate?: Date | string; // Optional: Datum für Timeline-Anzeige
  generationNumber?: number; // Golden badge: #1, #2, #3, etc.
  onClick?: () => void; // Click handler to open flashcard set
}

// Subject icon mapping
function SubjectIcon({ subject }: { subject: string }) {
  const iconClasses = "w-6 h-6";
  
  // Math icon (calculator)
  if (subject === "Mathematik" || subject === "Mathe") {
    return (
      <svg className={iconClasses} fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <path d={svgPaths.p3881dd00} fill="white" />
      </svg>
    );
  }
  
  // Deutsch (German flag)
  if (subject === "Deutsch") {
    return (
      <div className={`${iconClasses} overflow-clip relative rounded-sm`}>
        <div className="absolute inset-[66.66%_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 6.40065">
            <path d="M0 0H19.2V6.40065H0V0Z" fill="#FFCB00" />
          </svg>
        </div>
        <div className="absolute inset-[33.33%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 6.40065">
            <path d="M0 0H19.2V6.40065H0V0Z" fill="#E32D3C" />
          </svg>
        </div>
        <div className="absolute inset-[0_0_66.66%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 6.40065">
            <path d="M0 0H19.2V6.40065H0V0Z" fill="black" />
          </svg>
        </div>
      </div>
    );
  }
  
  // Biology (leaf)
  if (subject === "Biologie") {
    return (
      <svg className={iconClasses} fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <path d={svgPaths.p2517c2e0} fill="white" />
      </svg>
    );
  }
  
  // History (clock/globe)
  if (subject === "Geschichte") {
    return (
      <svg className={iconClasses} fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <path d={svgPaths.pf40f100} fill="white" />
      </svg>
    );
  }
  
  // English (UK flag)
  if (subject === "Englisch") {
    return (
      <div className={`${iconClasses} overflow-clip relative rounded-sm`}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
          <path d="M0 0H19.2V19.2H0V0Z" fill="#012169" />
        </svg>
        <div className="absolute inset-[-5.77%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.417 21.417">
            <path d={svgPaths.p3c441de0} stroke="white" strokeWidth="3.13535" />
          </svg>
        </div>
        <div className="absolute inset-[-3.61%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.5856 20.5856">
            <path d={svgPaths.p30cee240} stroke="#C8102E" strokeWidth="1.95959" />
          </svg>
        </div>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
          <path d="M9.6 0V19.2M0 9.6H19.2" stroke="white" strokeWidth="5.22525" />
        </svg>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
          <path d="M9.6 0V19.2M0 9.6H19.2" stroke="#C8102E" strokeWidth="3.13535" />
        </svg>
      </div>
    );
  }
  
  // Chemistry (flask)
  if (subject === "Chemie") {
    return (
      <svg className={iconClasses} fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 19.2">
        <path d={svgPaths.p2b174200} fill="white" />
      </svg>
    );
  }
  
  // French (French flag)
  if (subject === "Französisch") {
    return (
      <div className={`${iconClasses} overflow-clip relative rounded-sm`}>
        <div className="absolute inset-[0_0_0_66.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.4 19.2">
            <path d="M0 0H6.4V19.2H0V0Z" fill="#E32D3C" />
          </svg>
        </div>
        <div className="absolute inset-[0_33.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.4 19.2">
            <path d="M0 0H6.4V19.2H0V0Z" fill="white" />
          </svg>
        </div>
        <div className="absolute inset-[0_66.67%_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.4 19.2">
            <path d="M0 0H6.4V19.2H0V0Z" fill="#2B4896" />
          </svg>
        </div>
      </div>
    );
  }
  
  // Default fallback (search icon)
  return (
    <svg className={iconClasses} fill="none" preserveAspectRatio="none" viewBox="0 0 12.8 12.8">
      <path d={svgPaths.p23f68ff0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
      <path d="M11.2 11.2L8.87998 8.88" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
    </svg>
  );
}

// Get subject color
function getSubjectColor(subject: string): string {
  const colorMap: Record<string, string> = {
    "Mathematik": "#618cff",
    "Mathe": "#618cff",
    "Deutsch": "#ff6b9d",
    "Englisch": "#4a9eff",
    "Biologie": "#00d084",
    "Geschichte": "#ffa94d",
    "Chemie": "#a78bfa",
    "Französisch": "#3b82f6",
  };
  return colorMap[subject] || "#618cff";
}

// Format date for display
function formatDate(date: Date | string | undefined): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const targetDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  
  // Heute - zeige Zeit
  if (targetDate.getTime() === today.getTime()) {
    return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }
  
  // Gestern
  if (targetDate.getTime() === yesterday.getTime()) {
    return 'Gestern';
  }
  
  // Innerhalb der letzten 7 Tage - zeige Wochentag
  const diffDays = Math.floor((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    const weekday = d.toLocaleDateString('de-DE', { weekday: 'short' });
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  }
  
  // Älter - zeige Datum
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}

// ⚡ PERFORMANCE: React.memo - verhindert unnötige Re-Renders!
const FlashcardItem = React.memo(function FlashcardItem({ 
  subject, 
  title = "Alltag, Gefühle",
  cardCount = 42,
  progress = 50,
  createdDate,
  generationNumber,
  onClick
}: FlashcardItemProps) {
  const subjectColor = getSubjectColor(subject);
  const dateLabel = formatDate(createdDate);
  
  return (
    <div 
      onClick={onClick}
      className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl p-4 h-[100px] transition-all duration-300 ease-out cursor-pointer active:scale-[0.98] outline-none focus:outline-none"
      style={{
        WebkitTapHighlightColor: 'transparent',
        transform: 'translateZ(0)',
      }}
    >
      {/* Card Count + Datum - Dezent in der Ecke */}
      <div className="absolute top-3 right-3 text-right">
        <div className="font-['Poppins:Regular',sans-serif] text-white/25 text-[10px]">
          {cardCount} Karten
        </div>
        {dateLabel && (
          <div className="font-['Poppins:Regular',sans-serif] text-white/30 text-[9px] mt-0.5">
            {dateLabel}
          </div>
        )}
      </div>
      
      <div className="relative h-full flex flex-col justify-between">
        {/* Top Row: Icon + Title */}
        <div className="flex items-start gap-2.5">
          {/* Icon - Left */}
          <div className="relative w-6 h-6 shrink-0 flex items-center justify-center mt-0.5">
            <SubjectIcon subject={subject} />
          </div>
          
          {/* Title - 2 lines max - Badge is golden */}
          <h3 className="flex-1 font-['Poppins:SemiBold',sans-serif] text-white/95 text-[12px] leading-[1.25] line-clamp-2 pr-16">
            {title.match(/^#\d+\s/) ? (
              <>
                <span 
                  className="font-['Poppins:Bold',sans-serif]" 
                  style={{ 
                    color: '#FFD700',
                    textShadow: '0 0 8px rgba(255, 215, 0, 0.5)'
                  }}
                >
                  {title.match(/^#\d+/)?.[0]}
                </span>
                {title.replace(/^#\d+/, '')}
              </>
            ) : (
              title
            )}
          </h3>
        </div>
        
        {/* Bottom Row: Subject Badge + Progress Badge - BEGINNT BEI 0 (nicht eingerückt!) */}
        <div className="flex items-center gap-2">
          {/* Subject Badge - FIXED WIDTH 100px - NO BACKDROP-BLUR */}
          <div 
            className="relative w-[100px] h-7 px-3 rounded-full flex items-center justify-center shrink-0 border overflow-hidden"
            style={{ 
              backgroundColor: `${subjectColor}25`,
              borderColor: `${subjectColor}40`
            }}
          >
            {/* Subtle Inner Glow */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${subjectColor}50, transparent 70%)`
              }}
            />
            <span className="relative z-10 font-['Poppins:Medium',sans-serif] text-white text-[11px] truncate">
              {subject}
            </span>
          </div>
          
          {/* Progress Badge - FLEX-1 (nimmt gesamten restlichen Platz!) - NO BACKDROP-BLUR */}
          <div className="relative flex-1 h-7 rounded-full overflow-hidden border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Progress Fill (Left Side) - NO BACKDROP-BLUR */}
            <div 
              className="absolute inset-y-0 left-0 transition-all duration-700 ease-out"
              style={{ 
                width: `${progress}%`,
                backgroundColor: `${subjectColor}30`
              }}
            >
              {/* Inner Glow for Fill */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{
                  background: `linear-gradient(90deg, ${subjectColor}40, ${subjectColor}20)`
                }}
              />
            </div>
            
            {/* Progress Text - MITTIG in gesamter Badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-['Poppins:SemiBold',sans-serif] text-white text-[12px] tabular-nums drop-shadow-lg relative z-10">
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FlashcardItem;
