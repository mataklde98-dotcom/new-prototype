// ===== SCHULE UND KLASSE POPUP (Desktop) =====
// Kompaktes Popup-Modal mit nativen System-Selects

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { GraduationCap, BookOpen, Check, X } from 'lucide-react';
import { UserAccountData } from '@/contexts/UserContext';
import NativeSelect from './NativeSelect';

const SCHOOL_TYPE_OPTIONS = [
  { value: 'Grundschule', label: 'Grundschule' },
  { value: 'Hauptschule', label: 'Hauptschule' },
  { value: 'Realschule', label: 'Realschule' },
  { value: 'Gymnasium', label: 'Gymnasium' },
  { value: 'Gesamtschule', label: 'Gesamtschule' },
  { value: 'Berufsschule', label: 'Berufsschule' },
];

const GRADE_OPTIONS = Array.from({ length: 13 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}. Klasse`,
}));

interface SchuleUndKlassePopupProps {
  accountData: UserAccountData;
  onSave: (data: UserAccountData) => void;
  onClose: () => void;
}

export default function SchuleUndKlassePopup({ accountData, onSave, onClose }: SchuleUndKlassePopupProps) {
  const [schoolType, setSchoolType] = useState(accountData.schoolType || '');
  const [grade, setGrade] = useState(accountData.grade || '');
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const hasChanges = schoolType !== (accountData.schoolType || '') || grade !== (accountData.grade || '');

  const handleSave = () => {
    onSave({
      ...accountData,
      schoolType,
      grade,
    });
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        backgroundColor: isVisible ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
        backdropFilter: isVisible ? 'blur(4px)' : 'blur(0px)',
        transition: 'background-color 0.2s ease, backdrop-filter 0.2s ease',
      }}
    >
      <div
        ref={popupRef}
        className="w-[420px] max-w-[90vw] rounded-2xl border border-white/[0.08] overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(28,28,30,0.98) 0%, rgba(20,20,22,0.98) 100%)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white">
            Schule und Klasse
          </h2>
          <button
            onClick={handleClose}
            className="w-[28px] h-[28px] rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
          >
            <X className="w-[14px] h-[14px] text-white/60" strokeWidth={2} />
          </button>
        </div>

        {/* Info Text */}
        <div className="px-5 pb-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 leading-[18px]">
            Die Schulform und Klassenstufe können nur einmal im Jahr geändert werden, da die KI sich darauf kalibriert.
          </p>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 space-y-4">
          {/* Schulform */}
          <NativeSelect
            label="Schulform"
            value={schoolType}
            onChange={setSchoolType}
            options={SCHOOL_TYPE_OPTIONS}
            placeholder="Nicht festgelegt"
            icon={
              <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[#009379]/20 to-[#009379]/5 flex items-center justify-center">
                <GraduationCap className="w-[16px] h-[16px] text-[#00D4AA]" strokeWidth={2} />
              </div>
            }
          />

          {/* Klassenstufe */}
          <NativeSelect
            label="Klassenstufe"
            value={grade}
            onChange={setGrade}
            options={GRADE_OPTIONS}
            placeholder="Nicht festgelegt"
            icon={
              <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[#4A90E2]/20 to-[#4A90E2]/5 flex items-center justify-center">
                <BookOpen className="w-[16px] h-[16px] text-[#4A90E2]" strokeWidth={2} />
              </div>
            }
          />

          {/* Save Button */}
          {hasChanges && (
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-xl bg-white/[0.06] border border-white/[0.12] font-['Poppins:SemiBold',sans-serif] text-[14px] text-white flex items-center justify-center gap-2 hover:bg-white/[0.10] active:scale-[0.98] transition-all duration-200"
            >
              <Check className="w-[16px] h-[16px]" strokeWidth={2.5} />
              Änderungen speichern
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
