// ===== MEETING RATING MODAL =====
// Portal-based modal for rating past meetings
// 4 smiley scale + optional message + anonymity notice
// Premium SaaS Style (#0a0a0a, Poppins)
// Mobile: active: states, no hover:

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Shield, Check, Calendar, Clock } from 'lucide-react';
import { useDelayedUnmount } from '@/hooks/useDelayedUnmount';

const ff = "Poppins, -apple-system, 'Inter', BlinkMacSystemFont, sans-serif";

interface MeetingRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: 1 | 2 | 3 | 4, message: string) => void;
  meetingSubject: string;
  tutorName: string;
  meetingDate: string;   // ISO string
  meetingTime: string;   // formatted time range e.g. "16:00 – 17:00"
}

const RATING_OPTIONS: { value: 1 | 2 | 3 | 4; emoji: string; label: string; color: string }[] = [
  { value: 1, emoji: '😞', label: 'Schlecht', color: '#FF4444' },
  { value: 2, emoji: '😐', label: 'Ok', color: '#FFB800' },
  { value: 3, emoji: '🙂', label: 'Gut', color: '#82C91E' },
  { value: 4, emoji: '😄', label: 'Super', color: '#00D4AA' },
];

export function MeetingRatingModal({
  isOpen,
  onClose,
  onSubmit,
  meetingSubject,
  tutorName,
  meetingDate,
  meetingTime,
}: MeetingRatingModalProps) {
  const isMounted = useDelayedUnmount(isOpen, 280);
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedRating, setSelectedRating] = useState<1 | 2 | 3 | 4 | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Animate in
  useEffect(() => {
    if (isOpen && isMounted) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    }
    if (!isOpen) setAnimateIn(false);
  }, [isOpen, isMounted]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setSelectedRating(null);
        setMessage('');
        setSubmitted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  const handleSubmit = () => {
    if (!selectedRating) return;
    onSubmit(selectedRating, message);
    setSubmitted(true);
    setTimeout(() => onClose(), 1200);
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: animateIn ? 1 : 0,
          transition: 'opacity 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          backgroundColor: '#141414',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          overflow: 'hidden',
          transform: animateIn ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(12px)',
          opacity: animateIn ? 1 : 0,
          transition: 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1), opacity 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {submitted ? (
          /* ===== SUCCESS STATE ===== */
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{
                background: 'rgba(0, 212, 170, 0.1)',
                border: '1px solid rgba(0, 212, 170, 0.2)',
              }}
            >
              <Check className="w-7 h-7 text-[#00D4AA]" strokeWidth={2.5} />
            </div>
            <p
              className="text-white text-[16px] mb-1.5"
              style={{ fontFamily: ff, fontWeight: 600 }}
            >
              Vielen Dank!
            </p>
            <p
              className="text-white/40 text-[13px] text-center"
              style={{ fontFamily: ff, fontWeight: 400 }}
            >
              Deine Bewertung hilft uns, die Plattform zu verbessern.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 pt-5 pb-3"
            >
              <div className="flex-1 min-w-0">
                <p
                  className="text-white text-[16px]"
                  style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.3px' }}
                >
                  Meeting bewerten
                </p>
                <p
                  className="text-white/35 text-[12px] mt-0.5 truncate"
                  style={{ fontFamily: ff, fontWeight: 400 }}
                >
                  {meetingSubject} · {tutorName}
                </p>
                <p
                  className="text-white/35 text-[12px] mt-0.5 truncate"
                  style={{ fontFamily: ff, fontWeight: 400 }}
                >
                  <Calendar className="w-3 h-3 inline-block mr-1" strokeWidth={2} /> {new Date(meetingDate).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
                  <Clock className="w-3 h-3 inline-block mx-1" strokeWidth={2} /> {meetingTime}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 active:scale-90 active:bg-white/[0.10] transition-all ml-3"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <X className="w-4 h-4 text-white/50" strokeWidth={2} />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-5" style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

            {/* Rating Question */}
            <div className="px-5 pt-5 pb-2">
              <p
                className="text-white/70 text-[14px] text-center"
                style={{ fontFamily: ff, fontWeight: 500 }}
              >
                Wie war dein Meeting?
              </p>
            </div>

            {/* Smiley Selection */}
            <div className="flex items-center justify-center gap-3 px-5 py-4">
              {RATING_OPTIONS.map((opt) => {
                const isSelected = selectedRating === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedRating(opt.value)}
                    className="flex flex-col items-center gap-2 active:scale-90 transition-all"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <div
                      className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center transition-all"
                      style={{
                        background: isSelected
                          ? `${opt.color}15`
                          : 'rgba(255,255,255,0.03)',
                        border: isSelected
                          ? `2px solid ${opt.color}50`
                          : '1px solid rgba(255,255,255,0.06)',
                        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                      }}
                    >
                      <span className="text-[28px]">{opt.emoji}</span>
                    </div>
                    <span
                      className="text-[11px]"
                      style={{
                        fontFamily: ff,
                        fontWeight: isSelected ? 600 : 400,
                        color: isSelected ? opt.color : 'rgba(255,255,255,0.35)',
                      }}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="px-5 pb-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bitte teile uns kurz mit, warum du diese Bewertung gibst..."
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-white text-[13px] placeholder:text-white/20 outline-none resize-none"
                style={{
                  fontFamily: ff,
                  fontWeight: 400,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              />
            </div>

            {/* Anonymity Notice */}
            <div className="mx-5 mb-4 flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
              style={{
                background: 'rgba(0, 212, 170, 0.04)',
                border: '1px solid rgba(0, 212, 170, 0.08)',
              }}
            >
              <Shield
                className="w-4 h-4 shrink-0 mt-0.5"
                strokeWidth={2}
                style={{ color: 'rgba(0, 212, 170, 0.5)' }}
              />
              <p
                className="text-[11px]"
                style={{
                  fontFamily: ff,
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.40)',
                  lineHeight: '1.5',
                }}
              >
                Deine Bewertung ist <span style={{ color: 'rgba(0, 212, 170, 0.7)', fontWeight: 600 }}>vollständig anonym</span>. Dein Lehrer kann die Bewertung nicht sehen. Sie hilft uns, die Benutzererfahrung zu verbessern.
              </p>
            </div>

            {/* Submit Button */}
            <div className="px-5 pb-5">
              <button
                onClick={handleSubmit}
                disabled={!selectedRating || !message.trim()}
                className="w-full py-3 rounded-xl text-[14px] transition-all active:scale-[0.98]"
                style={{
                  fontFamily: ff,
                  fontWeight: 600,
                  color: selectedRating && message.trim() ? '#fff' : 'rgba(255,255,255,0.25)',
                  background: selectedRating && message.trim()
                    ? 'rgba(255,255,255,0.10)'
                    : 'rgba(255,255,255,0.04)',
                  border: selectedRating && message.trim()
                    ? '1px solid rgba(255,255,255,0.12)'
                    : '1px solid rgba(255,255,255,0.06)',
                  cursor: selectedRating && message.trim() ? 'pointer' : 'default',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                Bewertung abgeben
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// ===== RATING DISPLAY (for detail views) =====
export function RatingBadge({ rating }: { rating: 1 | 2 | 3 | 4 }) {
  const opt = RATING_OPTIONS.find(o => o.value === rating)!;
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
      style={{
        background: `${opt.color}10`,
        border: `1px solid ${opt.color}20`,
      }}
    >
      <span className="text-[14px]">{opt.emoji}</span>
      <span
        className="text-[11px]"
        style={{ fontFamily: ff, fontWeight: 600, color: opt.color }}
      >
        {opt.label}
      </span>
    </div>
  );
}