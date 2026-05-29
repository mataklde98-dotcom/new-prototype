// ===== NOTIFICATION SETTINGS POPUP =====
// Bottom-Sheet Popup für Push & E-Mail Benachrichtigungseinstellungen
// Premium SaaS Style (Linear/Vercel)

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Bell, Mail, Smartphone, X, MessageSquare, BookOpen, GraduationCap, CalendarCheck } from 'lucide-react';

interface NotificationSettingsPopupProps {
  onClose: () => void;
}

interface NotificationCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const CATEGORIES: NotificationCategory[] = [
  {
    id: 'chat',
    label: 'Chat-Nachrichten',
    icon: <MessageSquare className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    id: 'study',
    label: 'Lern-Erinnerungen',
    icon: <BookOpen className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    id: 'exams',
    label: 'Prüfungen & Deadlines',
    icon: <CalendarCheck className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    id: 'tutoring',
    label: 'Nachhilfe-Updates',
    icon: <GraduationCap className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
];

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative w-[46px] h-[28px] rounded-full transition-all duration-300 flex-shrink-0 ${
      enabled ? 'bg-[#10B981]' : 'bg-white/[0.12]'
    }`}
    style={{ WebkitTapHighlightColor: 'transparent' }}
  >
    <div
      className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-md transition-all duration-300 ${
        enabled ? 'left-[21px]' : 'left-[3px]'
      }`}
    />
  </button>
);

export default function NotificationSettingsPopup({ onClose }: NotificationSettingsPopupProps) {
  // Global toggles
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  // Per-category toggles (push)
  const [pushCategories, setPushCategories] = useState<Record<string, boolean>>({
    chat: true,
    study: true,
    exams: true,
    tutoring: true,
  });

  // Per-category toggles (email)
  const [emailCategories, setEmailCategories] = useState<Record<string, boolean>>({
    chat: false,
    study: true,
    exams: true,
    tutoring: true,
  });

  // Animation state
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const togglePushCategory = (id: string) => {
    setPushCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleEmailCategory = (id: string) => {
    setEmailCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
        className={`relative w-full max-w-[500px] max-h-[85vh] bg-[#141414] border border-white/[0.08] rounded-t-[20px] overflow-hidden transition-transform duration-300 ease-out ${
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
            <Bell className="w-5 h-5 text-white/60" strokeWidth={2} />
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white">
              Benachrichtigungen
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center active:bg-white/[0.12] transition-colors"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X className="w-4 h-4 text-white/60" strokeWidth={2} />
          </button>
        </div>

        <div className="h-px bg-white/[0.06]" />

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 pb-10 pt-4 scrollbar-thin" style={{ maxHeight: 'calc(85vh - 100px)', WebkitOverflowScrolling: 'touch' }}>
          
          {/* Push Notifications Master Toggle */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden mb-4">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-[18px] h-[18px] text-[#10B981]" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                    Push-Benachrichtigungen
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 mt-0.5">
                    Auf deinem Gerät anzeigen
                  </p>
                </div>
              </div>
              <ToggleSwitch enabled={pushEnabled} onChange={setPushEnabled} />
            </div>

            {/* Push Sub-Categories */}
            {pushEnabled && (
              <div className="border-t border-white/[0.06]">
                {CATEGORIES.map((cat, i) => (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="text-white/30 flex-shrink-0">
                          {cat.icon}
                        </div>
                        <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80">
                          {cat.label}
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={pushCategories[cat.id]}
                        onChange={() => togglePushCategory(cat.id)}
                      />
                    </div>
                    {i < CATEGORIES.length - 1 && (
                      <div className="ml-[52px] mr-4 h-px bg-white/[0.04]" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email Notifications Master Toggle */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-[18px] h-[18px] text-[#6366F1]" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                    E-Mail-Benachrichtigungen
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 mt-0.5">
                    An deine E-Mail-Adresse senden
                  </p>
                </div>
              </div>
              <ToggleSwitch enabled={emailEnabled} onChange={setEmailEnabled} />
            </div>

            {/* Email Sub-Categories */}
            {emailEnabled && (
              <div className="border-t border-white/[0.06]">
                {CATEGORIES.map((cat, i) => (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="text-white/30 flex-shrink-0">
                          {cat.icon}
                        </div>
                        <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80">
                          {cat.label}
                        </p>
                      </div>
                      <ToggleSwitch
                        enabled={emailCategories[cat.id]}
                        onChange={() => toggleEmailCategory(cat.id)}
                      />
                    </div>
                    {i < CATEGORIES.length - 1 && (
                      <div className="ml-[52px] mr-4 h-px bg-white/[0.04]" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Text */}
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 text-center mt-5 px-4 leading-[16px]">
            Du kannst Push-Benachrichtigungen auch in den Systemeinstellungen deines Geräts verwalten.
          </p>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}
