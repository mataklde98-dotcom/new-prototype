// ===== PREMIUM CREATE BUTTON =====
import { Plus } from "lucide-react";

export default function PremiumCreateButton() {
  return (
    <button
      className="group relative w-full px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl font-['Poppins:SemiBold',sans-serif] text-[12px] md:text-[13px] text-white overflow-hidden transition-all duration-200 active:scale-95"
      style={{
        background: 'rgba(0,184,148,0.07)',
        border: '1px solid rgba(0,184,148,0.25)',
      }}
    >
      {/* Button content */}
      <div className="relative flex items-center justify-center gap-1.5 md:gap-2">
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        <span>Create Flashcard-Set</span>
      </div>
    </button>
  );
}
