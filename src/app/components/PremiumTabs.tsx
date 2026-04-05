// ===== PREMIUM TABS COMPONENT =====
interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function PremiumTabs({ activeTab, onTabChange }: TabsProps) {
  const tabs = [
    { 
      id: "Repeat", 
      label: "KI-Sets",
      icon: (
        <svg className="w-[9px] h-[9px]" fill="currentColor" viewBox="0 0 9 9">
          <path d="M7.5 3.75V1.5L9 0L7.5 1.5H5.25C3.585 1.5 2.25 2.835 2.25 4.5C2.25 6.165 3.585 7.5 5.25 7.5H6.75V6H5.25C4.425 6 3.75 5.325 3.75 4.5C3.75 3.675 4.425 3 5.25 3H7.5L6 4.5L7.5 3.75Z" />
        </svg>
      )
    },
    { 
      id: "Manual", 
      label: "Eigene",
      icon: (
        <svg className="w-[10px] h-[9px]" fill="currentColor" viewBox="0 0 10 9">
          <path d="M5 0L0 4.5L5 9L10 4.5L5 0Z" />
        </svg>
      )
    },
    { 
      id: "Prognosis", 
      label: "Prognosen",
      icon: (
        <svg className="w-[10px] h-[10px]" fill="currentColor" viewBox="0 0 10 10">
          <path d="M9 5.5H5.5V9H4.5V5.5H1V4.5H4.5V1H5.5V4.5H9V5.5Z" />
        </svg>
      )
    },
    { 
      id: "Teacher", 
      label: "Lehrer",
      icon: (
        <svg className="w-[10px] h-[10px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
        </svg>
      )
    }
  ];

  return (
    <div
      className="relative inline-flex items-center gap-0.5 sm:gap-1 bg-white/[0.03] border border-white/[0.08] rounded-md sm:rounded-lg md:rounded-xl p-0.5 sm:p-1"
      style={{
        willChange: "transform",
        transform: "translateZ(0)",
        isolation: "isolate",
        zIndex: 1,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-md sm:rounded-lg font-['Poppins:SemiBold',sans-serif] text-[11px] xs:text-[12px] sm:text-[13px] 
              transition-all duration-500 ease-out whitespace-nowrap
              flex items-center justify-center gap-1.5 sm:gap-2
              ${
                isActive
                  ? "text-white"
                  : "text-white/40 hover:text-white/70"
              }
            `}
          >
            {/* Active background with gradient + glow */}
            {isActive && (
              <>
                <div
                  className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#009379] to-[#007a63] animate-in fade-in-0 duration-500"
                />
                {/* Extra subtle glow */}
                <div
                  className="absolute inset-0 rounded-lg blur-lg opacity-40"
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
                width: '11px', 
                height: '11px',
              }}
            >
              {tab.icon}
            </div>

            {/* Tab text */}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}