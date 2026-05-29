// ===== EXTRA-SESSION REQUEST MODAL =====
// Opens from TeacherProfileScreen when the student taps "Extra-Stunde".
// Collects duration (45 / 90 min), date, time, and an optional note,
// then writes a request into extraSessionRequestStore — which is picked up
// by chatService and shown as a student chat message in the teacher chat.

import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { X, Calendar, Clock, Send, CheckCircle2 } from 'lucide-react';
import { extraSessionRequestStore } from './extraSessionRequestStore';

interface ExtraSessionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Teacher/Room id the request is sent to. */
  teacherId: string;
  /** Display name used in the modal header only. */
  teacherName: string;
  /** Called after the user confirms — parent can trigger navigation to chat. */
  onRequestSent?: () => void;
}

const poppins = (weight: string) => `font-['Poppins:${weight}',sans-serif]`;

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function defaultTime(): string {
  const d = new Date();
  d.setHours(d.getHours() + 1);
  const h = String(d.getHours()).padStart(2, '0');
  return `${h}:00`;
}

export default function ExtraSessionRequestModal({
  isOpen,
  onClose,
  teacherId,
  teacherName,
  onRequestSent,
}: ExtraSessionRequestModalProps) {
  const [duration, setDuration] = useState<45 | 90>(45);
  const [date, setDate] = useState<string>(todayISO());
  const [time, setTime] = useState<string>(defaultTime());
  const [note, setNote] = useState<string>('');
  const [animateIn, setAnimateIn] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentToast, setSentToast] = useState(false);

  // Mount/unmount with animation
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimateIn(true)));
      // Reset form on each open
      setDuration(45);
      setDate(todayISO());
      setTime(defaultTime());
      setNote('');
      setSentToast(false);
      setIsSending(false);
    } else {
      setAnimateIn(false);
      const t = setTimeout(() => setVisible(false), 260);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const minDate = useMemo(() => todayISO(), []);
  const canSend = Boolean(date && time);

  const handleSend = () => {
    if (!canSend || isSending) return;
    setIsSending(true);
    // Write into the store — chatService will pick it up on next load.
    extraSessionRequestStore.addRequest({
      teacherId,
      durationMinutes: duration,
      date,
      time,
      note: note.trim() || undefined,
    });
    // Show a short success toast, then close the modal. The student stays
    // on the TeacherProfile (no navigation); the request is visible in the
    // chat the next time they open it.
    setTimeout(() => {
      setIsSending(false);
      setSentToast(true);
      setTimeout(() => {
        onClose();
        onRequestSent?.();
      }, 1400);
    }, 250);
  };

  if (!visible) return null;

  const modal = (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center z-[10000]"
      onClick={onClose}
      style={{
        background: animateIn ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
        backdropFilter: animateIn ? 'blur(8px)' : 'blur(0px)',
        WebkitBackdropFilter: animateIn ? 'blur(8px)' : 'blur(0px)',
        transition: 'background 0.25s ease, backdrop-filter 0.25s ease, -webkit-backdrop-filter 0.25s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #1e1e1e 0%, #141414 100%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          maxHeight: '92vh',
          transform: animateIn ? 'translateY(0)' : 'translateY(24px)',
          opacity: animateIn ? 1 : 0,
          transition: 'transform 0.26s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.26s ease',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3 border-b border-white/[0.06]">
          <div className="flex-1 min-w-0">
            <h3 className={`${poppins('SemiBold')} text-[16px] text-white leading-tight`}>
              Extra-Stunde anfragen
            </h3>
            <p className={`${poppins('Regular')} text-[12px] text-white/45 mt-0.5`}>
              Anfrage an {teacherName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.05] active:scale-95 transition-transform flex-shrink-0"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0 space-y-4">
          {/* Duration */}
          <div>
            <label className={`${poppins('Medium')} text-[12px] text-white/40 mb-2 block`}>Dauer</label>
            <div className="grid grid-cols-2 gap-2.5">
              {([45, 90] as const).map((d) => {
                const active = duration === d;
                return (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`h-[48px] rounded-xl ${poppins('SemiBold')} text-[14px] transition-all active:scale-[0.97]`}
                    style={{
                      background: active ? 'rgba(0,184,148,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                      color: active ? '#00D4AA' : 'rgba(255,255,255,0.55)',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {d} Min.
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date + Time side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`${poppins('Medium')} text-[12px] text-white/40 mb-2 block`}>Datum</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type="date"
                  value={date}
                  min={minDate}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full h-[48px] pl-10 pr-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white ${poppins('Medium')} text-[14px] outline-none focus:border-white/[0.15] transition-colors`}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
            <div>
              <label className={`${poppins('Medium')} text-[12px] text-white/40 mb-2 block`}>Uhrzeit</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`w-full h-[48px] pl-10 pr-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white ${poppins('Medium')} text-[14px] outline-none focus:border-white/[0.15] transition-colors`}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className={`${poppins('Medium')} text-[12px] text-white/40 mb-2 block`}>
              Notiz <span className="text-white/20">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 300))}
              placeholder="Thema, Fragen oder Hinweise für den Lehrer…"
              rows={3}
              className={`w-full rounded-xl bg-white/[0.05] border border-white/[0.08] px-3.5 py-3 ${poppins('Regular')} text-[13px] text-white placeholder:text-white/25 outline-none focus:border-white/[0.15] transition-colors resize-none leading-relaxed`}
            />
            <p className={`${poppins('Regular')} text-[10px] text-white/20 text-right mt-1`}>
              {note.length}/300
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pt-3 pb-5 border-t border-white/[0.06]">
          <button
            onClick={handleSend}
            disabled={!canSend || isSending}
            className={`w-full h-[48px] rounded-xl flex items-center justify-center gap-2 ${poppins('SemiBold')} text-[14px] transition-all active:scale-[0.98]`}
            style={{
              background: canSend && !isSending ? 'rgba(0,184,148,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${canSend && !isSending ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
              color: canSend && !isSending ? '#00D4AA' : 'rgba(255,255,255,0.30)',
              WebkitTapHighlightColor: 'transparent',
              cursor: canSend && !isSending ? 'pointer' : 'not-allowed',
            }}
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-[#00D4AA]/40 border-t-[#00D4AA] rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" strokeWidth={2.2} />
                Anfrage senden
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation toast */}
      {sentToast && (
        <div
          className="fixed left-1/2 -translate-x-1/2 rounded-xl px-4 py-3 flex items-center gap-2.5 z-[10001] max-w-[92%]"
          style={{
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
            background: 'rgba(0,184,148,0.14)',
            border: '1px solid rgba(0,184,148,0.32)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#00D4AA' }} strokeWidth={2.2} />
          <span className={`${poppins('Medium')} text-[12px] leading-tight`} style={{ color: '#00D4AA' }}>
            Anfrage gesendet · im Chat sichtbar
          </span>
        </div>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? ReactDOM.createPortal(modal, document.body) : null;
}
