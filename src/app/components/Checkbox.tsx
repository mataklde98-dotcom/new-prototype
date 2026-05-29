import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function Checkbox({ checked, onChange, size = 'md', disabled = false }: CheckboxProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const checkSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  // If onChange is provided, render as button (standalone usage)
  // Otherwise render as div (when used inside another clickable element)
  const Component = onChange ? 'button' : 'div';

  return (
    <Component
      {...(onChange ? { onClick: onChange, disabled, type: 'button' as const } : {})}
      className={`${sizeClasses[size]} rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
        checked 
          ? 'bg-white/20 border-white/60' 
          : 'border-white/30'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : onChange ? 'cursor-pointer' : ''}`}
    >
      {checked && (
        <svg 
          className={`${checkSizes[size]} text-white`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </Component>
  );
}
