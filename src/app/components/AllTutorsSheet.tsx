import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MOCK_TUTORS } from '@/mocks';
import { getTeacherProfile } from '@/mocks/teacherProfile.mock';

interface AllTutorsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTeacherProfile?: (teacherId: string) => void;
}

export default function AllTutorsSheet({ isOpen, onClose, onOpenTeacherProfile }: AllTutorsSheetProps) {
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

  const tutorsWithProfile = MOCK_TUTORS.map(tutor => ({
    ...tutor,
    profile: getTeacherProfile(tutor.id),
  }));

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
          <h2 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white">
            Deine Nachhilfelehrer
          </h2>
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

        {/* Teacher List */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8 scrollbar-hide">
          <div className="flex flex-col gap-3">
            {tutorsWithProfile.map((tutor) => (
              <button
                key={tutor.id}
                onClick={() => {
                  onOpenTeacherProfile?.(tutor.id);
                  onClose();
                }}
                className="flex items-center gap-3.5 rounded-2xl p-3 text-left transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {/* Avatar – same card style as Home */}
                <div
                  className="relative flex-shrink-0 rounded-[12px] overflow-hidden"
                  style={{ width: '72px', height: '72px' }}
                >
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-[25px]"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}
                  />
                  {tutor.isOnline && (
                    <div
                      className="absolute top-1.5 right-1.5"
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        background: '#00D4AA',
                        border: '2px solid rgba(0,0,0,0.4)',
                        boxShadow: '0 0 6px rgba(0,212,170,0.5)',
                      }}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white leading-tight mb-1">
                    {tutor.name}
                  </p>

                  {/* Subjects as pills */}
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {tutor.profile?.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="font-['Poppins:Medium',sans-serif] text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(0,184,148,0.08)',
                          border: '1px solid rgba(0,184,148,0.15)',
                          color: '#00D4AA',
                        }}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>

                  {/* Meta row */}
                  {/* removed rating and total lessons */}
                </div>

              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}