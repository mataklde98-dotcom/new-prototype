import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

/**
 * System-wide premium glass CTA button.
 * 
 * Matches the flat SaaS design system:
 * - Glass gradient background: from-white/[0.05] to-white/[0.02]
 * - Subtle border: border-white/[0.08]
 * - Rounded, GPU-composited
 * - Poppins Medium white text
 * 
 * Sizes:
 * - xs: compact inline (pill buttons like "Add Task", "Join")
 * - sm: small CTA (38px)
 * - md: standard CTA (46px) — default
 * - lg: large CTA (52px)
 */
export default function Button({
  children,
  onClick,
  disabled = false,
  fullWidth = true,
  size = 'md',
  className = '',
  type = 'button',
  style,
}: ButtonProps) {
  const sizeClasses = {
    xs: 'px-4 py-1.5 rounded-xl text-[12px]',
    sm: 'h-[38px] rounded-xl text-[14px]',
    md: 'h-[46px] rounded-2xl text-[16px]',
    lg: 'h-[52px] rounded-2xl text-[16px]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative ${fullWidth ? 'w-full' : ''} ${sizeClasses[size]} cursor-pointer transition-all duration-200 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
      style={{
        background: disabled ? 'rgba(255,255,255,0.04)' : 'rgba(0,184,148,0.07)',
        border: disabled ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,184,148,0.25)',
        WebkitTapHighlightColor: 'transparent',
        willChange: 'transform',
        transform: 'translateZ(0)',
        isolation: 'isolate',
        ...style,
      }}
    >
      <span className="relative z-10 w-full font-['Poppins:Medium',sans-serif] text-white flex items-center justify-center gap-2" style={{ fontSize: 'inherit' }}>
        {children}
      </span>
    </button>
  );
}