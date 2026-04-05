import React from 'react';

interface MobileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  const tabs = [
    { 
      id: 'repeat', 
      label: 'Repeat',
      icon: (
        <svg className="w-[9px] h-[9px]" fill="currentColor" viewBox="0 0 9 9">
          <path d="M7.5 3.75V1.5L9 0L7.5 1.5H5.25C3.585 1.5 2.25 2.835 2.25 4.5C2.25 6.165 3.585 7.5 5.25 7.5H6.75V6H5.25C4.425 6 3.75 5.325 3.75 4.5C3.75 3.675 4.425 3 5.25 3H7.5L6 4.5L7.5 3.75Z" />
        </svg>
      )
    },
    { 
      id: 'manual', 
      label: 'Manual',
      icon: (
        <svg className="w-[10px] h-[9px]" fill="currentColor" viewBox="0 0 10 9">
          <path d="M5 0L0 4.5L5 9L10 4.5L5 0Z" />
        </svg>
      )
    },
    { 
      id: 'prognosis', 
      label: 'Prognosis',
      icon: (
        <svg className="w-[10px] h-[10px]" fill="currentColor" viewBox="0 0 10 10">
          <path d="M9 5.5H5.5V9H4.5V5.5H1V4.5H4.5V1H5.5V4.5H9V5.5Z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className="relative inline-flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] rounded-lg p-1"
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          isolation: "isolate",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab.toLowerCase() === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id.charAt(0).toUpperCase() + tab.id.slice(1))}
              className="relative px-4 py-2 rounded-md transition-all duration-500 ease-out flex items-center gap-2"
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Active background with gradient + glow */}
              {isActive && (
                <>
                  <div
                    className="absolute inset-0 rounded-md bg-gradient-to-br from-[#009379] to-[#007a63] animate-in fade-in-0 duration-500"
                  />
                  {/* Extra subtle glow */}
                  <div
                    className="absolute inset-0 rounded-md blur-lg opacity-40"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(0, 147, 121, 0.3), transparent 70%)",
                    }}
                  />
                </>
              )}

              {/* Icon */}
              <div 
                className="relative z-10 flex items-center justify-center transition-all duration-300"
                style={{ 
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.4)',
                  width: '11px', 
                  height: '11px',
                }}
              >
                {tab.icon}
              </div>

              {/* Label */}
              <span 
                className="relative z-10 font-['Poppins:SemiBold',sans-serif] transition-all duration-300" 
                style={{ 
                  fontSize: '13px',
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.4)',
                  lineHeight: 'normal',
                  letterSpacing: '-0.01em',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
