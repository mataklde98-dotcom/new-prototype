import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { MOCK_EXTRA_SESSIONS, APP_NOW, ExtraSession } from '@/mocks/extraSessions.mock';
import { cancelledExtraSessionsStore, useCancelledExtraSessions } from '@/app/components/cancelledExtraSessionsStore';

interface AllExtraSessionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** Tap a session row → navigate to Meetings screen detail view */
  onOpenExtraSession?: (extraSessionId: string) => void;
}

// ===== STORNO-LOGIK =====
// >48h vor Start → keine Warnung (normal) — Absage refundet die Stunde
// 48h–24h vor Start → Warnung "noch X h stornierbar" — Absage refundet die Stunde
// <24h vor Start → "Storno-Frist abgelaufen" — Absage möglich, aber KEIN Refund
type CancelState = 'none' | 'warning' | 'expired';

function getCancelState(session: ExtraSession, now: Date): { state: CancelState; hoursLeft: number } {
  const start = new Date(session.startAtISO).getTime();
  const diffMs = start - now.getTime();
  const hoursUntilStart = diffMs / (1000 * 60 * 60);
  const hoursUntilDeadline = hoursUntilStart - 24;

  if (hoursUntilStart < 24) return { state: 'expired', hoursLeft: 0 };
  if (hoursUntilStart <= 48) {
    return { state: 'warning', hoursLeft: Math.max(0, Math.floor(hoursUntilDeadline)) };
  }
  return { state: 'none', hoursLeft: Math.floor(hoursUntilDeadline) };
}

export default function AllExtraSessionsSheet({ isOpen, onClose, onOpenExtraSession }: AllExtraSessionsSheetProps) {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [, setTick] = useState(0);

  // Confirm-Dialog State
  const [confirmSession, setConfirmSession] = useState<ExtraSession | null>(null);

  // Abgesagte Session-IDs aus dem geteilten Store (verschwinden überall in der App)
  const cancelledIds = useCancelledExtraSessions();

  // Toast State
  const [toast, setToast] = useState<{ message: string; refunded: boolean } | null>(null);

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

  // Live-Update für Countdown (alle 60 s neu rendern)
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Toast Auto-Dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  if (!visible) return null;

  const now = APP_NOW;
  const upcoming = MOCK_EXTRA_SESSIONS.filter(
    (s) => new Date(s.startAtISO) >= now && !cancelledIds.has(s.id),
  );

  const handleCancelClick = (session: ExtraSession) => {
    setConfirmSession(session);
  };

  const handleConfirmCancel = () => {
    if (!confirmSession) return;
    const { state } = getCancelState(confirmSession, now);
    const refunded = state !== 'expired';

    cancelledExtraSessionsStore.cancel(confirmSession.id);
    setConfirmSession(null);
    setToast({
      message: refunded
        ? 'Termin abgesagt · Extra-Stunde wurde zurückgebucht'
        : 'Termin abgesagt · Extra-Stunde nicht zurückerstattet',
      refunded,
    });
  };

  const SessionCard = ({ session }: { session: ExtraSession }) => {
    const { state, hoursLeft } = getCancelState(session, now);

    return (
      <div
        onClick={() => onOpenExtraSession?.(session.id)}
        className="flex flex-col gap-2.5 rounded-2xl p-3.5 transition-all duration-200 cursor-pointer active:scale-[0.99]"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div className="flex items-center gap-3.5">
          <div className="relative flex-shrink-0 w-[50px] h-[50px] rounded-full overflow-hidden">
            <img src={session.avatar} alt={session.tutorName} className="w-full h-full object-cover" />
          </div>

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

        {/* Storno-Bereich (Status + Button) */}
        {(
          <div
            className="flex items-center justify-between pt-2.5 gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            {/* Status-Text links */}
            <div className="flex-1 min-w-0">
              {state === 'warning' && (
                <span
                  className="font-['Poppins:SemiBold',sans-serif] text-[10px]"
                  style={{ color: '#FF9F43' }}
                >
                  noch {hoursLeft} h stornierbar
                </span>
              )}
              {state === 'expired' && (
                <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30">
                  Storno-Frist abgelaufen
                </span>
              )}
              {state === 'none' && (
                <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30">
                  Kostenlos stornierbar
                </span>
              )}
            </div>

            {/* Einheitlicher Absagen-Button */}
            <button
              onClick={(e) => { e.stopPropagation(); handleCancelClick(session); }}
              className="font-['Poppins:SemiBold',sans-serif] text-[10px] px-3 py-1.5 rounded-md transition-all active:scale-95 flex-shrink-0"
              style={{
                color: '#FF9F43',
                background: 'rgba(255,159,67,0.08)',
                border: '1px solid rgba(255,159,67,0.25)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Absagen
            </button>
          </div>
        )}
      </div>
    );
  };

  // ===== CONFIRM DIALOG =====
  const confirmState = confirmSession ? getCancelState(confirmSession, now) : null;
  const confirmRefunded = confirmState && confirmState.state !== 'expired';

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
        <div className="flex items-center justify-between px-5 pb-2 pt-2">
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

        {/* Storno-Hinweis */}
        <div className="px-5 pb-3">
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">
            Kostenlos stornierbar bis 24 h vor Beginn
          </p>
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

        {/* ===== TOAST ===== */}
        {toast && (
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-xl px-4 py-3 flex items-center gap-2.5 z-[10] max-w-[92%]"
            style={{
              bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
              background: toast.refunded ? 'rgba(0,184,148,0.12)' : 'rgba(255,107,107,0.12)',
              border: `1px solid ${toast.refunded ? 'rgba(0,184,148,0.30)' : 'rgba(255,107,107,0.30)'}`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              animation: 'toastIn 0.25s ease-out',
            }}
          >
            {toast.refunded ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#00B894' }} strokeWidth={2.2} />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF6B6B' }} strokeWidth={2.2} />
            )}
            <span
              className="font-['Poppins:Medium',sans-serif] text-[12px] leading-tight"
              style={{ color: toast.refunded ? '#00B894' : '#FF6B6B' }}
            >
              {toast.message}
            </span>
          </div>
        )}
      </div>

      {/* ===== CONFIRM DIALOG ===== */}
      {confirmSession && confirmState && (
        <div
          className="absolute inset-0 z-[10000] flex items-center justify-center px-5"
          style={{
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={() => setConfirmSession(null)}
        >
          <div
            className="w-full max-w-[340px] rounded-2xl p-5"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(180deg, #1e1e1e 0%, #141414 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: confirmRefunded ? 'rgba(255,159,67,0.12)' : 'rgba(255,107,107,0.12)',
                  border: `1px solid ${confirmRefunded ? 'rgba(255,159,67,0.25)' : 'rgba(255,107,107,0.25)'}`,
                }}
              >
                <AlertTriangle
                  className="w-5 h-5"
                  style={{ color: confirmRefunded ? '#FF9F43' : '#FF6B6B' }}
                  strokeWidth={2.2}
                />
              </div>
              <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white leading-tight">
                Extra-Stunde absagen?
              </h3>
            </div>

            {/* Termin-Infos */}
            <div
              className="rounded-xl px-3 py-2.5 mb-3"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white leading-tight">
                {confirmSession.subject} · {confirmSession.tutorName}
              </p>
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/45 mt-0.5">
                {confirmSession.date} · {confirmSession.time}
              </p>
            </div>

            {/* Kontext-spezifische Nachricht */}
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/65 leading-[18px] mb-5">
              {confirmRefunded ? (
                <>
                  Die Extra-Stunde wird dir <span className="text-white font-['Poppins:SemiBold',sans-serif]">zurückgebucht</span> und kann für einen neuen Termin genutzt werden.
                </>
              ) : (
                <>
                  Die Storno-Frist (24 h vor Beginn) ist bereits angebrochen. Du kannst den Termin absagen, die Extra-Stunde wird jedoch <span style={{ color: '#FF6B6B' }} className="font-['Poppins:SemiBold',sans-serif]">nicht zurückerstattet</span>.
                </>
              )}
            </p>

            {/* Buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={() => setConfirmSession(null)}
                className="flex-1 h-[42px] rounded-xl font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 active:scale-[0.98] transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                Abbrechen
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 h-[42px] rounded-xl font-['Poppins:SemiBold',sans-serif] text-[13px] active:scale-[0.98] transition-all"
                style={{
                  color: confirmRefunded ? '#FF9F43' : '#FF6B6B',
                  background: confirmRefunded ? 'rgba(255,159,67,0.12)' : 'rgba(255,107,107,0.12)',
                  border: `1px solid ${confirmRefunded ? 'rgba(255,159,67,0.30)' : 'rgba(255,107,107,0.30)'}`,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                Ja, absagen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Animation Keyframes */}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
