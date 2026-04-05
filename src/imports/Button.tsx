export default function Button() {
  return (
    <button 
      className="flex items-center justify-center gap-2 px-4 h-full rounded-[14px] border-[0.657px] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] border-solid shadow-[0px_4px_24px_0px_rgba(0,0,0,0.12)] transition-all duration-300 active:scale-[0.98]"
      style={{ 
        backgroundImage: "linear-gradient(168.451deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
        WebkitTapHighlightColor: 'transparent',
        willChange: 'transform',
        transform: 'translateZ(0)',
        isolation: 'isolate'
      }}
    >
      {/* Plus Icon */}
      <span className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white leading-none">
        +
      </span>
      
      {/* Text */}
      <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white whitespace-nowrap leading-none">
        Aufgabe hinzufügen
      </span>
    </button>
  );
}
