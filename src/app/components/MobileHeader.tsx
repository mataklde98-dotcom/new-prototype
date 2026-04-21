import React from 'react';
import { createPortal } from 'react-dom';
import { Bell } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import NotificationPanel from '@/app/components/NotificationPanel';
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

export default function MobileHeader() {
  const { profileImage, userName } = useUser();
  const firstName = userName.split(' ')[0];
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const [notifOpen, setNotifOpen] = React.useState(false);
  const hasCustomPhoto = profileImage && !profileImage.startsWith('data:image/svg+xml');
  
  return (
    <div className="w-full px-5 pt-4 pb-5 relative">
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

        {/* Right: Profile Picture + Apple Glass Bell */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
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