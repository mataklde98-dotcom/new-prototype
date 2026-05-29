import React, { useState, useEffect } from 'react';
import { X, Sparkles, ChevronLeft, BadgeCheck, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '@/contexts/UserContext';

interface Notification {
  id: string;
  type: 'system' | 'chat' | 'review';
  avatar?: string;
  from: string;
  message: string;
  highlight?: string;
  time: string;
  verified?: boolean;
  unread: boolean;
  category: 'nachhilfe' | 'lernaktivitaet' | 'system';
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { top: number; left: number };
  mobile?: boolean;
}

type FilterKey = 'alle' | 'nachhilfe' | 'lernaktivitaet' | 'system';

const filters: { key: FilterKey; label: string }[] = [
  { key: 'alle', label: 'Alle' },
  { key: 'nachhilfe', label: 'Nachhilfe' },
  { key: 'lernaktivitaet', label: 'Lernaktivität' },
  { key: 'system', label: 'System' },
];

const todayNotifications: Notification[] = [
  {
    id: '1',
    type: 'system',
    from: 'SoStudy',
    message: 'Dein Bericht wurde verarbeitet',
    time: '11:12 Uhr',
    verified: true,
    unread: true,
    category: 'system',
  },
  {
    id: '2',
    type: 'chat',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    from: 'Sameera',
    message: 'hat dir eine Nachricht gesendet',
    time: '10:30 Uhr',
    unread: true,
    category: 'nachhilfe',
  },
  {
    id: '3',
    type: 'review',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    from: 'Sameera',
    message: 'hat dein Dokument überprüft',
    highlight: 'Quantenmechanik Notizen',
    time: '10:30 Uhr',
    unread: false,
    category: 'nachhilfe',
  },
  {
    id: '7',
    type: 'system',
    from: 'SoStudy',
    message: 'Deine KI-Empfehlungen wurden aktualisiert',
    time: '09:15 Uhr',
    verified: true,
    unread: false,
    category: 'lernaktivitaet',
  },
  {
    id: '8',
    type: 'review',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    from: 'Sameera',
    message: 'hat deinen Aufsatz kommentiert',
    highlight: 'Erörterung Aufbau',
    time: '08:45 Uhr',
    unread: false,
    category: 'nachhilfe',
  },
];

const yesterdayNotifications: Notification[] = [
  {
    id: '5',
    type: 'review',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    from: 'Sameera',
    message: 'hat dein Dokument überprüft',
    highlight: 'Quantenmechanik Notizen',
    time: '10:30 Uhr',
    unread: false,
    category: 'nachhilfe',
  },
  {
    id: '6',
    type: 'review',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    from: 'Sameera',
    message: 'hat dein Dokument überprüft',
    highlight: 'Quantenmechanik Notizen',
    time: '10:30 Uhr',
    unread: false,
    category: 'nachhilfe',
  },
  {
    id: '9',
    type: 'system',
    from: 'SoStudy',
    message: 'Dein Lernziel "Quadratische Funktionen" ist auf Kurs',
    time: '18:30 Uhr',
    verified: true,
    unread: false,
    category: 'lernaktivitaet',
  },
  {
    id: '10',
    type: 'chat',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    from: 'Sameera',
    message: 'hat dir eine Nachricht gesendet',
    time: '14:20 Uhr',
    unread: false,
    category: 'nachhilfe',
  },
];

const thisWeekNotifications: Notification[] = [
  {
    id: '11',
    type: 'system',
    from: 'SoStudy',
    message: 'Erinnerung: Mathematik-Klausur in 5 Tagen',
    time: 'Montag',
    verified: true,
    unread: false,
    category: 'lernaktivitaet',
  },
  {
    id: '12',
    type: 'review',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    from: 'Sameera',
    message: 'hat dein Dokument überprüft',
    highlight: 'Funktionsanalyse Übung',
    time: 'Montag',
    unread: false,
    category: 'nachhilfe',
  },
  {
    id: '13',
    type: 'system',
    from: 'SoStudy',
    message: 'Du hast 50 Credits durch Aktivitäten verdient',
    time: 'Sonntag',
    verified: true,
    unread: false,
    category: 'system',
  },
];

const thisMonthNotifications: Notification[] = [
  {
    id: '14',
    type: 'chat',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    from: 'Sameera',
    message: 'hat dir eine Nachricht gesendet',
    time: '08. Mär',
    unread: false,
    category: 'nachhilfe',
  },
  {
    id: '15',
    type: 'system',
    from: 'SoStudy',
    message: 'Dein Lernziel "Simple Past" wurde erreicht',
    time: '05. Mär',
    verified: true,
    unread: false,
    category: 'lernaktivitaet',
  },
  {
    id: '16',
    type: 'system',
    from: 'SoStudy',
    message: 'Willkommen bei SoStudy! Starte jetzt mit deinem ersten Lernziel',
    time: '01. Mär',
    verified: true,
    unread: false,
    category: 'system',
  },
];

function NotificationRow({ notification, mobile }: { notification: Notification; mobile?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 cursor-pointer transition-colors duration-150 ${
        mobile ? 'active:bg-[#1a1a1a]' : 'hover:bg-[#1a1a1a]'
      }`}
      style={{
        padding: '14px 16px',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {notification.avatar ? (
          <div className="w-[46px] h-[46px] rounded-full overflow-hidden">
            <img src={notification.avatar} alt={notification.from} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-[46px] h-[46px] rounded-full bg-gradient-to-br from-[#00D4AA]/15 to-[#009379]/10 flex items-center justify-center">
            <Sparkles className="w-[19px] h-[19px] text-[#00D4AA]" strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-[3px]">
        <p className="font-['Poppins:Regular',sans-serif] text-[14px] leading-[21px]" style={{ color: '#CCCCCC' }}>
          <span className="font-['Poppins:SemiBold',sans-serif]" style={{ color: '#FFFFFF' }}>
            {notification.from}
          </span>
          {notification.verified && (
            <BadgeCheck
              className="inline-block w-[14px] h-[14px] ml-[3px] mr-[1px] align-[-2px]"
              style={{ color: '#3897F0', fill: '#3897F0', stroke: '#0a0a0a', strokeWidth: 2.5 }}
            />
          )}
          {' '}{notification.message}
          {notification.highlight && (
            <>
              <span style={{ color: '#888888' }}> · </span>
              <span className="font-['Poppins:SemiBold',sans-serif]">{notification.highlight}</span>
            </>
          )}
          <span style={{ color: '#888888' }}> · {notification.time}</span>
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ label, first }: { label: string; first?: boolean }) {
  return (
    <div style={{ padding: `${first ? 14 : 26}px 16px 10px 16px` }}>
      <span className="font-['Poppins:Bold',sans-serif] text-[16px]" style={{ color: '#FFFFFF' }}>
        {label}
      </span>
    </div>
  );
}

function FilterChips({ active, onChange, filters: filtersList }: { active: FilterKey; onChange: (k: FilterKey) => void; filters: { key: FilterKey; label: string }[] }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto scrollbar-hide"
      style={{ padding: '12px 16px 4px 16px' }}
    >
      {filtersList.map((f) => {
        const isActive = f.key === active;
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={`min-[375px]:flex-1 min-[375px]:min-w-0 max-[374px]:flex-shrink-0 max-[374px]:px-4 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] text-center whitespace-nowrap transition-all duration-200 active:scale-[0.96] ${
              isActive
                ? 'bg-[#00B894]/10 text-[#00B894] border border-[#00B894]/25'
                : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.05]'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8">
      <div className="w-14 h-14 rounded-full bg-white/[0.04] flex items-center justify-center mb-5">
        <Bell className="w-6 h-6 text-white/15" strokeWidth={1.5} />
      </div>
      <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] mb-1 text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Keine neuen Benachrichtigungen
      </p>
      <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-center leading-[19px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
        Sobald es etwas Neues gibt,<br />erfährst du es hier.
      </p>
    </div>
  );
}

interface SectionData {
  label: string;
  items: Notification[];
}

function NotificationContent({ mobile }: { mobile?: boolean }) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('alle');
  const user = useUser();
  const tutoringActive = user.tutoringStatus === 'activated';

  // Dynamische Filter-Liste: Nachhilfe nur wenn Tutoring aktiviert
  const visibleFilters = tutoringActive
    ? filters
    : filters.filter((f) => f.key !== 'nachhilfe');

  // Auto-Reset: wenn Filter "nachhilfe" aktiv ist und Tutoring deaktiviert wird
  useEffect(() => {
    if (!tutoringActive && activeFilter === 'nachhilfe') {
      setActiveFilter('alle');
    }
  }, [tutoringActive, activeFilter]);

  const filterList = (list: Notification[]) => {
    // Wenn Tutoring nicht aktiviert: Nachhilfe-Kategorie komplett rausfiltern
    const base = tutoringActive ? list : list.filter((n) => n.category !== 'nachhilfe');
    if (activeFilter === 'alle') return base;
    return base.filter((n) => n.category === activeFilter);
  };

  const sections: SectionData[] = [
    { label: 'Heute', items: filterList(todayNotifications) },
    { label: 'Gestern', items: filterList(yesterdayNotifications) },
    { label: 'Diese Woche', items: filterList(thisWeekNotifications) },
    { label: 'Diesen Monat', items: filterList(thisMonthNotifications) },
  ].filter((s) => s.items.length > 0);

  const isEmpty = sections.length === 0;

  return (
    <div className="pb-6">
      <FilterChips active={activeFilter} onChange={setActiveFilter} filters={visibleFilters} />

      {isEmpty ? (
        <EmptyState />
      ) : (
        sections.map((section, si) => (
          <React.Fragment key={section.label}>
            <SectionHeader label={section.label} first={si === 0} />
            {section.items.map((notif) => (
              <NotificationRow key={notif.id} notification={notif} mobile={mobile} />
            ))}
          </React.Fragment>
        ))
      )}
    </div>
  );
}

export default function NotificationPanel({ isOpen, onClose, position, mobile }: NotificationPanelProps) {
  if (mobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col"
            style={{ willChange: 'transform' }}
          >
            <div className="flex-none flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.06]">
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center active:bg-white/[0.06] transition-colors"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ChevronLeft className="w-5 h-5 text-white/60" strokeWidth={2} />
              </button>
              <h3 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white">
                Benachrichtigungen
              </h3>
              <div className="w-9" />
            </div>
            <div
              className="flex-1 overflow-y-auto pb-safe scrollbar-hide"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <NotificationContent mobile />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[9999] w-[360px]"
            style={{
              top: `${position?.top || 70}px`,
              left: `${position?.left || 20}px`,
            }}
          >
            <div className="relative bg-[#111111] border border-white/[0.10] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
                <h3 className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white/90">
                  Benachrichtigungen
                </h3>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors group"
                >
                  <X className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" strokeWidth={2} />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[480px] custom-scrollbar scrollbar-thin">
                <NotificationContent />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}