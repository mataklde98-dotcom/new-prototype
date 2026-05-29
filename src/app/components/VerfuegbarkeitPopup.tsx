// ===== VERFÜGBARKEIT POPUP =====
// Read-only popup showing the student's agreed tutoring availability
// Bottom-Sheet style matching NotificationSettingsPopup

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Clock, X, Info } from 'lucide-react';

interface VerfuegbarkeitPopupProps {
  onClose: () => void;
}

interface DaySlot {
  day: string;
  time: string | null; // null = nicht verfügbar
}

const AVAILABILITY: DaySlot[] = [
  { day: 'Montag', time: '07:00 – 13:00 Uhr' },
  { day: 'Dienstag', time: '13:00 – 20:00 Uhr' },
  { day: 'Mittwoch', time: '15:00 – 19:00 Uhr' },
  { day: 'Donnerstag', time: '07:00 – 13:00 Uhr' },
  { day: 'Freitag', time: '14:00 – 18:00 Uhr' },
  { day: 'Samstag', time: '10:00 – 16:00 Uhr' },
  { day: 'Sonntag', time: null },
];

export default function VerfuegbarkeitPopup({ onClose }: VerfuegbarkeitPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  }, [onClose]);

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`relative w-full max-w-[500px] bg-[#141414] border border-white/[0.08] rounded-t-[20px] overflow-hidden transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-[5px] rounded-full bg-white/[0.15]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-white/60" strokeWidth={2} />
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white">
              Verfügbarkeit
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center active:bg-white/[0.12] transition-colors"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X className="w-4 h-4 text-white/50" strokeWidth={2} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="px-5 pb-4 font-['Poppins:Regular',sans-serif] text-[13px] text-white/40">
          Deine verfügbaren Zeiten für die Nachhilfe
        </p>

        {/* Day List */}
        <div className="px-5 pb-3 space-y-1.5">
          {AVAILABILITY.map(({ day, time }) => (
            <div
              key={day}
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/85">
                {day}
              </span>
              <span
                className={`font-['Poppins:Regular',sans-serif] text-[13px] ${
                  time ? 'text-white/55' : 'text-white/25'
                }`}
              >
                {time || 'Nicht verfügbar'}
              </span>
            </div>
          ))}
        </div>

        {/* Info text */}
        <div className="px-5 pb-6 pt-2">
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <Info className="w-3.5 h-3.5 text-white/25 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 leading-relaxed">
              Änderungen an deiner Verfügbarkeit können über deinen Nachhilfelehrer vorgenommen werden.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}
