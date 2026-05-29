import React from 'react';
import { createPortal } from 'react-dom';
import { Bell, Flame } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import NotificationPanel from '@/app/components/NotificationPanel';
import { LEARNING_STREAK } from '@/app/components/ProfileAnalyticsScreen';
import { imgBlur } from '@/imports/svg-1d2hv';

/**
 * Apple iOS Button — 1:1 from Figma, adapted for dark (#0a0a0a) background.
 * Structure: BG (Blur mask + Fill + Glass Effect) → Icon → Badge
 */
function AppleGlassButton({ onClick, children, badge }: { onClick: () => void; children: React.ReactNode; badge?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="relative w-[44px] h-[44px] rounded-full flex items-center justify-center active:scale-[0.92] transition-transform"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* === Apple Frosted Glass — faithful to Figma structure === */}

      {/* Layer 1: Backdrop blur — light, not foggy */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      />

      {/* Layer 2: Solid dark fill */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: '#1c1c1e',
        }}
      />

      {/* Layer 3: Edge definition + directional lighting */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `
            0 0 0 0.5px rgba(255,255,255,0.12),
            inset 0.5px 0.5px 1px 0 rgba(255,255,255,0.06),
            0 1px 3px 0 rgba(0,0,0,0.4)
          `,
        }}
      />

      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>

      {/* Notification badge */}
      {badge && (
        <div className="absolute top-[6px] right-[6px] w-[9px] h-[9px] rounded-full bg-[#4ADE80] border-[2px] border-[#0a0a0a] z-20" />
      )}
    </button>
  );
}

interface MobileHeaderProps {
  onStreakClick?: () => void;
}

export default function MobileHeader({ onStreakClick }: MobileHeaderProps = {}) {
  const { profileImage, userName } = useUser();
  const firstName = userName.split(' ')[0];
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const [notifOpen, setNotifOpen] = React.useState(false);
  const hasCustomPhoto = profileImage && !profileImage.startsWith('data:image/svg+xml');

  // Streak-Animation: pulst nur beim ersten App-Öffnen an einem neuen Tag
  const [streakPulsing, setStreakPulsing] = React.useState(false);
  React.useEffect(() => {
    const today = new Date().toDateString();
    const lastPulse = typeof localStorage !== 'undefined' ? localStorage.getItem('lastStreakPulseDate') : null;
    if (lastPulse !== today) {
      // Kurze Verzögerung, damit die Animation nach dem Mount sichtbar ist
      const startTimer = setTimeout(() => setStreakPulsing(true), 400);
      const endTimer = setTimeout(() => setStreakPulsing(false), 2000);
      try {
        localStorage.setItem('lastStreakPulseDate', today);
      } catch {}
      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, []);

  return (
    <div className="w-full px-5 pt-4 pb-5 relative">
      <style>{`
        @keyframes streakFlamePulse {
          0%   { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(255,159,67,0)); }
          25%  { transform: scale(1.35) rotate(-8deg); filter: drop-shadow(0 0 8px rgba(255,159,67,0.7)); }
          50%  { transform: scale(1.15) rotate(6deg); filter: drop-shadow(0 0 6px rgba(255,159,67,0.5)); }
          75%  { transform: scale(1.25) rotate(-4deg); filter: drop-shadow(0 0 7px rgba(255,159,67,0.5)); }
          100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 0 rgba(255,159,67,0)); }
        }
        @keyframes streakPillGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,159,67,0); }
          50%      { box-shadow: 0 0 0 4px rgba(255,159,67,0.18); }
        }
      `}</style>
      <div className="flex items-center justify-between">
        {/* Left: Greeting text */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/50 leading-tight">
            Hi, {firstName}!
          </span>
          <span className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-white leading-tight mt-0.5">
            Willkommen zurück!
          </span>
        </div>

        {/* Right: Streak + Profile Picture + Apple Glass Bell */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Lern-Streak Pill — Motivations-Anker, immer sichtbar. Klick öffnet Detail-Screen. */}
          <button
            onClick={onStreakClick}
            className="flex items-center gap-1.5 px-2.5 h-[30px] rounded-full active:scale-[0.95] transition-transform"
            style={{
              background: 'rgba(255,159,67,0.12)',
              border: '1px solid rgba(255,159,67,0.25)',
              animation: streakPulsing ? 'streakPillGlow 1.4s ease-out' : undefined,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Flame
              className="w-[14px] h-[14px]"
              style={{
                color: '#FF9F43',
                animation: streakPulsing ? 'streakFlamePulse 1.4s ease-out' : undefined,
                transformOrigin: 'center',
              }}
              strokeWidth={2.2}
            />
            <span
              className="font-['Poppins:SemiBold',sans-serif] text-[13px] leading-none"
              style={{ color: '#FF9F43' }}
            >
              {LEARNING_STREAK} Tage
            </span>
          </button>

          {/* Profile Picture */}
          <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-[1.5px]">
            {hasCustomPhoto ? (
              <img 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover" 
                src={profileImage} 
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#00D4AA] flex items-center justify-center">
                <span className="font-['Poppins:Bold',sans-serif] text-[15px] text-white leading-none">{initials}</span>
              </div>
            )}
          </div>

          {/* Apple-style Glass Notification Button */}
          <AppleGlassButton onClick={() => setNotifOpen(true)} badge>
            <Bell className="w-[18px] h-[18px] text-white/80" strokeWidth={1.8} />
          </AppleGlassButton>
        </div>
      </div>

      {/* Mobile Notification Panel – via portal */}
      {typeof document !== 'undefined' && createPortal(
        <NotificationPanel 
          isOpen={notifOpen} 
          onClose={() => setNotifOpen(false)} 
          mobile 
        />,
        document.body
      )}
    </div>
  );
}