import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { MOCK_EXTRA_SESSIONS } from '@/mocks/extraSessions.mock';

interface AllExtraSessionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AllExtraSessionsSheet({ isOpen, onClose }: AllExtraSessionsSheetProps) {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    } else {
      setAnimateIn(false);
      const t = setTimeout(() => setVisible(false), 340);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!visible) return null;

  // Only show upcoming sessions
  const now = new Date('2026-03-18');
  const upcoming = MOCK_EXTRA_SESSIONS.filter(s => new Date(s.dateISO) >= now);

  const SessionCard = ({ session }: { session: typeof MOCK_EXTRA_SESSIONS[0] }) => (
    <div
      className="flex items-center gap-3.5 rounded-2xl p-3.5 transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0 w-[50px] h-[50px] rounded-full overflow-hidden">
        <img src={session.avatar} alt={session.tutorName} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white leading-tight mb-0.5">
          {session.subject}
        </p>
        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/50 leading-tight mb-1">
          {session.tutorName}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-white/25" />
            <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/35">
              {session.date}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-white/25" />
            <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/35">
              {session.time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col justify-end"
      style={{ pointerEvents: animateIn ? 'auto' : 'none' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          opacity: animateIn ? 1 : 0,
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full max-h-[85vh] flex flex-col transition-transform duration-300 ease-out"
        style={{
          transform: animateIn ? 'translateY(0)' : 'translateY(100%)',
          background: 'linear-gradient(180deg, #1a1a1a 0%, #111111 100%)',
          borderRadius: '20px 20px 0 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-9 h-[4px] rounded-full bg-white/15" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 pt-2">
          <div>
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white">
              Extra-Stunden
            </h2>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 mt-0.5">
              {upcoming.length} Sitzungen
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.07] flex items-center justify-center active:scale-95 transition-transform"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/[0.06]" />

        {/* Session List */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8 scrollbar-hide">
          {upcoming.length > 0 && (
            <>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wider mb-3">
                Bevorstehend
              </p>
              <div className="flex flex-col gap-2.5 mb-6">
                {upcoming.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}