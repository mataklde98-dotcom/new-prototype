// ===== MEINE FÄCHER POPUP =====
// Read-only popup showing the student's selected tutoring subjects
// Bottom-Sheet style matching NotificationSettingsPopup

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Book, X, Info } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface MeineFaecherPopupProps {
  onClose: () => void;
}

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematik': '#618cff',
  'Deutsch': '#ff6b9d',
  'Englisch': '#4a9eff',
  'Biologie': '#00d084',
  'Geschichte': '#ffa94d',
  'Chemie': '#a78bfa',
  'Französisch': '#3b82f6',
  'Physik': '#f59e0b',
  'Latein': '#ef4444',
  'Informatik': '#06b6d4',
};

export default function MeineFaecherPopup({ onClose }: MeineFaecherPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { tutoringStatus, tutoringRequestData } = useUser();

  // Single source of truth: subjects from the activation flow
  const selectedSubjects = tutoringRequestData?.selectedSubjects ?? [];

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
            <Book className="w-5 h-5 text-white/60" strokeWidth={2} />
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white">
              Meine Fächer
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
          Deine ausgewählten Fächer für die Nachhilfe
        </p>

        {/* Subject List */}
        <div className="px-5 pb-3 space-y-2">
          {tutoringStatus === 'notActivated' || selectedSubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Book className="w-8 h-8 text-white/10 mb-3" strokeWidth={1.5} />
              <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/30 mb-1">
                Keine Fächer ausgewählt
              </p>
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/20 max-w-[240px]">
                Aktiviere die Nachhilfe, um deine Fächer auszuwählen.
              </p>
            </div>
          ) : (
            selectedSubjects.map((subject) => {
              const color = SUBJECT_COLORS[subject] || '#618cff';
              return (
                <div
                  key={subject}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/85">
                    {subject}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Info text */}
        <div className="px-5 pb-6 pt-2">
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <Info className="w-3.5 h-3.5 text-white/25 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 leading-relaxed">
              Änderungen an deinen Fächern können über deinen Nachhilfelehrer vorgenommen werden.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}