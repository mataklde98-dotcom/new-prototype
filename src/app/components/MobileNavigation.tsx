import React from 'react';
import { Home, CalendarClock, MessageCircle, Sparkles, User } from 'lucide-react';

interface MobileNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isVisible?: boolean; // Hide on scroll support
}

export default React.memo(function MobileNavigation({ activeTab = 'Home', onTabChange, isVisible = true }: MobileNavigationProps) {
  const tabs = [
    { id: 'Home', label: 'Home', Icon: Home },
    { id: 'Meetings', label: 'Meetings', Icon: CalendarClock },
    { id: 'Chats', label: 'Chats', Icon: MessageCircle },
    { id: 'KI-Tools', label: 'KI-Tools', Icon: Sparkles },
    { id: 'Profil', label: 'Profil', Icon: User },
  ];

  return (
    <div
      className="flex items-center justify-around"
      style={{
        height: '61.268px',
        borderRadius: '34px',
        background: 'rgba(21, 21, 21, 0.9)',
        boxShadow: 'inset 0 0 0 0.657px rgba(255, 255, 255, 0.1)',
        // Hide on scroll animation
        transform: isVisible ? 'translateY(0)' : 'translateY(calc(100% + 20px))',
        transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        willChange: 'transform',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const { Icon } = tab;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className="flex flex-col items-center justify-center gap-[3px] active:scale-95"
            style={{
              WebkitTapHighlightColor: 'transparent',
              minWidth: '48px',
              transition: 'transform 0.15s ease-out',
            }}
          >
            {/* Icon */}
            <Icon
              size={22}
              strokeWidth={2}
              color={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)'}
              style={{
                width: '21.996px',
                height: '21.996px',
                transition: 'color 0.2s ease-out',
              }}
            />

            {/* Label */}
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '10px',
                letterSpacing: '-0.1px',
                lineHeight: '1',
                color: isActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.45)',
                fontWeight: isActive ? 600 : 500,
                transition: 'color 0.2s ease-out',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
});