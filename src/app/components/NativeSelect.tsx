// ===== NATIVE SELECT =====
// Wiederverwendbare native <select>-Komponente die auf iOS den Wheel-Picker
// und auf Android den Material-Spinner auslöst.
// Dunkel gestylt passend zum App-Design-System.

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface NativeSelectOption {
  value: string;
  label: string;
}

interface NativeSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: NativeSelectOption[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export default function NativeSelect({
  value,
  onChange,
  options,
  placeholder = 'Auswählen',
  label,
  required,
  disabled = false,
  icon,
  className = '',
}: NativeSelectProps) {
  return (
    <div className={`${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`}>
      {label && (
        <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/40 mb-1.5 tracking-[0.02em] px-0.5">
          {label}{required && <span className="text-white/25 ml-0.5">*</span>}
        </p>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-[1]">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full rounded-xl bg-white/[0.04] border border-white/[0.08] font-['Poppins:Regular',sans-serif] text-[14px] text-white appearance-none cursor-pointer outline-none transition-all duration-200 focus:border-white/[0.18] focus:bg-white/[0.06] active:scale-[0.995] ${
            icon ? 'pl-14 pr-10 py-3' : 'pl-4 pr-10 py-3'
          } ${!value ? 'text-white/30' : ''}`}
          style={{
            WebkitTapHighlightColor: 'transparent',
            colorScheme: 'dark',
          }}
        >
          <option value="" disabled className="bg-[#1a1a1a] text-white/40">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-[#1a1a1a] text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
          strokeWidth={2}
        />
      </div>
    </div>
  );
}