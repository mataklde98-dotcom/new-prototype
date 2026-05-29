// ==================== MOBILE VIEWPORT LAYOUT ====================
// Extrahiert aus App.tsx - Wiederverwendbarer Layout-Wrapper
// Jeder Screen in ExamApp nutzt dieses identische Layout:
// - Full-Screen auf Mobile
// - Zentriert + 430x932 mit 80% Scale + rounded auf Desktop

import React from 'react';

interface MobileViewportLayoutProps {
  children: React.ReactNode;
}

export default function MobileViewportLayout({ children }: MobileViewportLayoutProps) {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Desktop: Center and constrain to mobile viewport size with 80% scale */}
      <div className="relative w-full h-full lg:max-w-[430px] lg:max-h-[932px] lg:scale-[0.8] lg:origin-center lg:overflow-hidden lg:rounded-[24px]">
        {/* Mobile Viewport Container - Full screen on mobile, rounded with shadow on desktop */}
        <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden lg:rounded-[24px] lg:shadow-2xl lg:border lg:border-white/10">
          {children}
        </div>
      </div>
    </div>
  );
}
