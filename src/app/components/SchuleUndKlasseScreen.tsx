// ===== SCHULE UND KLASSE SCREEN =====
// Zeigt die bei der Registrierung gewählte Schulform und Klasse an
// Nutzt native System-Selects (iOS Wheel-Picker / Android Spinner)

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { GraduationCap, BookOpen, Check } from 'lucide-react';
import CloseButton from '@/app/components/CloseButton';
import NativeSelect from './NativeSelect';
import { UserAccountData } from '@/contexts/UserContext';

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

interface SchuleUndKlasseScreenProps {
  onBack: () => void;
  isClosing?: boolean;
  externalTransition?: boolean;
  accountData: UserAccountData;
  onSave: (data: UserAccountData) => void;
}

const SchuleUndKlasseScreen = React.forwardRef<HTMLDivElement, SchuleUndKlasseScreenProps>(
  ({ onBack, isClosing = false, externalTransition = false, accountData, onSave }, ref) => {
    const [schoolType, setSchoolType] = useState(accountData.schoolType || '');
    const [grade, setGrade] = useState(accountData.grade || '');

    // Animation state
    const [animationState, setAnimationState] = useState<'entering' | 'active' | 'exiting'>('entering');

    // Sync when accountData changes
    useEffect(() => {
      setSchoolType(accountData.schoolType || '');
      setGrade(accountData.grade || '');
    }, [accountData]);

    // Enter animation
    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimationState('active');
      }, 300);
      return () => clearTimeout(timer);
    }, []);

    // Lock body scroll
    useEffect(() => {
      if (externalTransition) return;
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalWidth = document.body.style.width;
      const originalTop = document.body.style.top;
      const scrollY = window.scrollY;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = originalWidth;
        document.body.style.top = originalTop;
        window.scrollTo(0, scrollY);
      };
    }, [externalTransition]);

    // Exit animation
    useEffect(() => {
      if (isClosing) {
        setAnimationState('exiting');
      }
    }, [isClosing]);

    const hasChanges = schoolType !== (accountData.schoolType || '') || grade !== (accountData.grade || '');

    const handleSave = () => {
      onSave({
        ...accountData,
        schoolType,
        grade,
      });
      onBack();
    };

    // Animation classes (same pattern as AccountEditScreenMobile)
    const animationClass =
      animationState === 'entering' ? 'account-edit-entering' :
      animationState === 'exiting' ? 'account-edit-exiting' :
      'account-edit-active';

    const content = (
      <div
        ref={ref}
        className={externalTransition
          ? 'flex-1 min-h-0 w-full bg-[#0a0a0a] overflow-y-auto overflow-x-hidden'
          : `account-edit-screen ${animationClass}`}
        style={externalTransition ? {
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'none',
        } : undefined}
      >
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 pt-safe">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white">
                  Schule und Klasse
                </h1>
              </div>
              <CloseButton onClick={onBack} />
            </div>
          </div>
          <div className="border-b border-white/[0.08] mt-3" />
        </div>

        {/* Content */}
        <div className="px-5 pb-32 pt-[100px] space-y-5">
          {/* Info Text */}
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40 leading-[20px]">
            Die Schulform und Klassenstufe können nur einmal im Jahr geändert werden, da die KI sich darauf kalibriert.
          </p>

          {/* Schultyp */}
          <NativeSelect
            label="Schulform"
            value={schoolType}
            onChange={setSchoolType}
            options={SCHOOL_TYPE_OPTIONS}
            placeholder="Nicht festgelegt"
            icon={
              <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#009379]/20 to-[#009379]/5 flex items-center justify-center">
                <GraduationCap className="w-[20px] h-[20px] text-[#00D4AA]" strokeWidth={2} />
              </div>
            }
          />

          {/* Klasse */}
          <NativeSelect
            label="Klassenstufe"
            value={grade}
            onChange={setGrade}
            options={GRADE_OPTIONS}
            placeholder="Nicht festgelegt"
            icon={
              <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#4A90E2]/20 to-[#4A90E2]/5 flex items-center justify-center">
                <BookOpen className="w-[20px] h-[20px] text-[#4A90E2]" strokeWidth={2} />
              </div>
            }
          />

          {/* Save Button - only visible when changes exist */}
          {hasChanges && (
            <button
              onClick={handleSave}
              className="w-full py-4 rounded-[14px] bg-white/[0.06] border border-white/[0.12] font-['Poppins:SemiBold',sans-serif] text-[15px] text-white transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Check className="w-[18px] h-[18px]" strokeWidth={2.5} />
              Änderungen speichern
            </button>
          )}
        </div>
      </div>
    );

    // If externalTransition, don't wrap in portal
    if (externalTransition) {
      return content;
    }

    return ReactDOM.createPortal(content, document.body);
  }
);

SchuleUndKlasseScreen.displayName = 'SchuleUndKlasseScreen';

export default SchuleUndKlasseScreen;
