import React from 'react';
import { createPortal } from 'react-dom';
import { Bell } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import NotificationPanel from '@/app/components/NotificationPanel';
import { OVERALL_PROGRESS } from '@/app/components/ProfileAnalyticsScreen';

export default function MobileHeader() {
  const { profileImage, userName } = useUser();
  const firstName = userName.split(' ')[0];
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const [notifOpen, setNotifOpen] = React.useState(false);
  const hasCustomPhoto = profileImage && !profileImage.startsWith('data:image/svg+xml');

  const overallProgress = OVERALL_PROGRESS;
  
  return (
    <div className="w-full px-5 py-3 pb-5 relative">
      {/* Line 1: Greeting + Bell */}
      <div className="flex items-center gap-3.5 mb-2.5">
        {/* Profile Picture - Initials fallback */}
        <div className="flex-shrink-0">
          <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-[2px]">
            {hasCustomPhoto ? (
              <img 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover" 
                src={profileImage} 
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#00D4AA] flex items-center justify-center">
                <span className="font-['Poppins:Bold',sans-serif] text-[18px] text-white leading-none">{initials}</span>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white leading-tight truncate flex-1 min-w-0">
          Hallo, {firstName}!
        </p>

        {/* Notification Bell - Far Right */}
        <button 
          className="flex-shrink-0 w-[24px] h-[24px] relative active:scale-90 transition-transform mr-[16px]"
          onClick={() => setNotifOpen(true)}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <Bell className="w-full h-full text-white/50" strokeWidth={1.8} />
          {/* Notification dot */}
          <div className="absolute -top-0.5 -right-0.5 w-[7px] h-[7px] rounded-full bg-[#4ADE80] border border-[#0a0a0a]" />
        </button>
      </div>

      {/* Line 2: Label + Percentage */}
      <div className="flex items-center justify-between px-1 mb-1.5">
        <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/60">
          Gesamtfortschritt
        </span>
        <span className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white/60">
          {overallProgress}%
        </span>
      </div>

      {/* Line 3: Progress Bar */}
      <div className="px-1">
        <div className="relative w-full h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ 
              width: `${overallProgress}%`,
              background: 'linear-gradient(90deg, #00B894, #00D4AA)',
              transition: 'width 0.8s ease',
            }}
          />
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