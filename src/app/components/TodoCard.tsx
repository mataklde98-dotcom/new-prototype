import React from 'react';
import { BookOpen, GraduationCap, Users, FileText, Brain } from 'lucide-react';

export type TodoType = 'einzelunterricht' | 'gruppenunterricht' | 'extra-stunde' | 'extra-stunden' | 'prüfungssimulation' | 'karteikarten';

interface TodoCardProps {
  type: TodoType;
  title: string;
  description: string;
  subject: string;
  subjectColor: string;
  time?: string;
  duration?: string;
  actionLabel: string;
  actionType: 'join' | 'upcoming' | 'start';
  accentGradient: string;
  isLive?: boolean;
  locationType?: 'online' | 'local';
  onAction?: () => void;
  /** Flashcard progress 0-100 for prep todos */
  flashcardProgress?: number;
}

// ⚡ PERFORMANCE: Icon Mapping außerhalb der Component (wird nur 1x erstellt!)
const ICON_MAP: Record<string, React.ReactNode> = {
  'einzelunterricht': <BookOpen className="w-5 h-5" strokeWidth={2.2} />,
  'gruppenunterricht': <Users className="w-5 h-5" strokeWidth={2.2} />,
  'extra-stunde': <GraduationCap className="w-5 h-5" strokeWidth={2.2} />,
  'extra-stunden': <GraduationCap className="w-5 h-5" strokeWidth={2.2} />,
  'prüfungssimulation': <FileText className="w-5 h-5" strokeWidth={2.2} />,
  'karteikarten': <Brain className="w-5 h-5" strokeWidth={2.2} />,
};

// ⚡ PERFORMANCE: React.memo - verhindert unnötige Re-Renders!
const TodoCard = React.memo(function TodoCard({
  type,
  title,
  description,
  subject,
  subjectColor,
  time,
  duration,
  actionLabel,
  actionType,
  isLive,
  locationType,
  onAction,
  flashcardProgress,
}: TodoCardProps) {
  // ⚡ PERFORMANCE: Direktes Lookup statt Function Call
  const IconComponent = ICON_MAP[type] || ICON_MAP['einzelunterricht'];

  const isSessionType = ['einzelunterricht', 'gruppenunterricht', 'extra-stunde', 'extra-stunden'].includes(type);

  // ⚡ Premium Button Styles - Clean & Minimal
  const actionButtonStyle = React.useMemo(() => {
    // "Geplant" buttons for session types (not live) – always dimmed
    if (isSessionType && !isLive) {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        color: 'rgba(255, 255, 255, 0.35)',
        border: 'none',
      };
    }
    if (actionType === 'join' || actionType === 'start') {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        border: 'none',
      };
    }
    return {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      color: 'rgba(255, 255, 255, 0.35)',
      border: 'none',
    };
  }, [actionType, isSessionType, isLive]);

  return (
    <div 
      className="relative bg-white/[0.03] border border-white/[0.08] rounded-[18px] overflow-hidden"
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div className="relative p-4">
        
        {/* Single Row: Compact & Clean Layout */}
        <div className="flex items-center gap-3.5 min-[375px]:flex-row flex-col min-[375px]:items-center items-stretch">
          
          {/* Content Stack - Main Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            {/* Title */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white leading-[1.25] tracking-[-0.01em]">
                {title}
              </h3>
              {isLive && (
                <span
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: 'rgba(0, 184, 148, 0.12)',
                    border: '1px solid rgba(0, 184, 148, 0.30)',
                  }}
                >
                  <span
                    className="w-[6px] h-[6px] rounded-full"
                    style={{
                      backgroundColor: '#00B894',
                      boxShadow: '0 0 6px rgba(0, 184, 148, 0.6)',
                      animation: 'livePulse 1.5s ease-in-out infinite',
                    }}
                  />
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[9px] text-[#00B894] uppercase tracking-wider leading-none">
                    {locationType === 'local' ? 'Vor Ort' : 'Live'}
                  </span>
                </span>
              )}
            </div>
            
            {/* Meta Row: Subject • Time (duration moved to description for session types) */}
            <div className="flex items-center gap-1.5 text-white/35 flex-wrap">
              <span 
                className="font-['Poppins:Medium',sans-serif] text-[12px] leading-none"
                style={{ color: `${subjectColor}99` }}
              >
                {subject}
              </span>
              {time && (
                <>
                  <span className="text-white/20">•</span>
                  <span className="font-['Poppins:Regular',sans-serif] text-[12px] leading-none">
                    {time}
                  </span>
                </>
              )}
              {!isSessionType && duration && (
                <>
                  <span className="text-white/20">•</span>
                  <span className="font-['Poppins:Regular',sans-serif] text-[12px] leading-none">
                    {duration}
                  </span>
                </>
              )}
            </div>

            {/* Description / Category - with duration for session types */}
            {(description || (isSessionType && duration)) && (
              <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/35 leading-[1.3] mt-0.5 truncate">
                {isSessionType && description && duration
                  ? `${description} · ${duration}`
                  : isSessionType && duration
                    ? duration
                    : description}
              </p>
            )}
          </div>

          {/* Action Button - Compact & Clean */}
          {!(isLive && locationType === 'local') && (
          <button 
            className="h-[32px] px-4 rounded-full transition-all active:scale-95 whitespace-nowrap flex-shrink-0 self-end min-[375px]:self-center flex items-center justify-center"
            style={{
              WebkitTapHighlightColor: 'transparent',
              ...(isLive ? {
                backgroundColor: 'rgba(0, 184, 148, 0.12)',
                color: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(0, 184, 148, 0.30)',
              } : actionButtonStyle),
            }}
            onClick={onAction}
          >
            <span className="font-['Poppins:SemiBold',sans-serif] text-[12px] leading-none">
              {isLive ? 'Beitreten' : isSessionType ? 'Geplant' : actionLabel}
            </span>
          </button>
          )}
        </div>

      </div>
    </div>
  );
});

export default TodoCard;

// CSS Keyframes for live pulse
const styleTag = typeof document !== 'undefined' && !document.getElementById('live-pulse-style')
  ? (() => {
      const s = document.createElement('style');
      s.id = 'live-pulse-style';
      s.textContent = `@keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`;
      document.head.appendChild(s);
      return s;
    })()
  : null;