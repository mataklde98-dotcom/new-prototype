// ===== VISION PRO TEXT FIELD =====
// Inspiriert vom iPhone iOS TextField Design
// Ultra-Edles Eingabefeld mit Apple Vision Pro Ästhetik
// Glassmorphism, subtile Separatoren und perfekte Typography

import React, { useState, useRef, useEffect } from 'react';

interface VisionProTextFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  autoFocus?: boolean;
  maxLength?: number;
}

export default function VisionProTextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = 'Value',
  disabled = false,
  multiline = false,
  rows = 1,
  leftIcon,
  rightIcon,
  onRightIconClick,
  autoFocus = false,
  maxLength,
}: VisionProTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) {
      if (multiline) {
        textareaRef.current?.focus();
      } else {
        inputRef.current?.focus();
      }
    }
  }, [autoFocus, multiline]);

  // Shared styles
  const containerStyle = {
  };

  const inputClasses = `
    flex-1 bg-transparent text-white placeholder:text-white/30 
    font-['Poppins:Regular',sans-serif] leading-[20px]
    outline-none transition-all duration-200
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <div className="w-full space-y-2.5">
      {/* Label */}
      {label && (
        <label className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] px-1 block">
          {label}
        </label>
      )}

      {/* Input Container - Login Screen Style */}
      <div 
        className={`
          w-full rounded-xl 
          bg-white/[0.04]
          border transition-all duration-200
          ${isFocused ? 'border-[#009379]' : 'border-white/[0.08]'}
          ${disabled ? 'opacity-60' : ''}
        `}
        style={containerStyle}
      >
        {/* Content Container */}
        <div className="flex items-center px-4 py-3.5 gap-3">
          {/* Left Icon */}
          {leftIcon && (
            <div className="flex-shrink-0 text-white/40">
              {leftIcon}
            </div>
          )}

          {/* Input or Textarea */}
          {multiline ? (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              maxLength={maxLength}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`${inputClasses} resize-none min-h-[80px]`}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            />
          ) : (
            <input
              ref={inputRef}
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={inputClasses}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            />
          )}

          {/* Right Icon */}
          {rightIcon && (
            <>
              {onRightIconClick ? (
                <button
                  onClick={onRightIconClick}
                  className="flex-shrink-0 text-white/40 transition-transform active:scale-95"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {rightIcon}
                </button>
              ) : (
                <div className="flex-shrink-0 text-white/40">
                  {rightIcon}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Character Count (optional) */}
      {maxLength && (
        <div className="px-1 flex justify-end">
          <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/40">
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}