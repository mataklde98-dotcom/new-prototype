import { useState, useRef, useCallback } from 'react';

type PremiumSliderProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
};

export default function PremiumSlider({ 
  value, 
  min, 
  max, 
  step = 1, 
  onChange,
  label,
  unit,
}: PremiumSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const percentage = ((value - min) / (max - min)) * 100;

  const getValueFromPosition = useCallback((clientX: number) => {
    if (!trackRef.current) return value;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = x / rect.width;
    const raw = min + pct * (max - min);
    const stepped = Math.round(raw / step) * step;
    return Math.max(min, Math.min(max, stepped));
  }, [min, max, step, value]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const newVal = getValueFromPosition(e.clientX);
    onChange(newVal);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [getValueFromPosition, onChange]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const newVal = getValueFromPosition(e.clientX);
    onChange(newVal);
  }, [isDragging, getValueFromPosition, onChange]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    let newVal = value;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      newVal = Math.min(max, value + step);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      newVal = Math.max(min, value - step);
    }
    if (newVal !== value) {
      e.preventDefault();
      onChange(newVal);
    }
  }, [value, min, max, step, onChange]);

  return (
    <div className="w-full">
      {/* Label + Value Row */}
      {label && (
        <div className="flex items-baseline justify-between mb-4">
          <span className="font-['Poppins:SemiBold',sans-serif] text-[14px] lg:text-[15px] text-white">
            {label}
          </span>
          <span className="font-['Poppins:SemiBold',sans-serif] text-[15px] lg:text-[16px] text-white tabular-nums">
            {value}
            {unit && (
              <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40 ml-0.5">
                {unit}
              </span>
            )}
          </span>
        </div>
      )}

      {/* Slider Track Area */}
      <div 
        ref={trackRef}
        className="relative h-[44px] flex items-center cursor-pointer touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {/* Track Background */}
        <div className="absolute left-0 right-0 h-[6px] rounded-full bg-white/[0.08]" />
        
        {/* Track Fill */}
        <div 
          className="absolute left-0 h-[6px] rounded-full transition-[width] duration-75"
          style={{ 
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #007a63 0%, #009379 100%)'
          }}
        />

        {/* Thumb Container */}
        <div 
          className="absolute -translate-x-1/2 flex items-center justify-center transition-[left] duration-75"
          style={{ left: `${percentage}%` }}
        >
          {/* Accent Glow Ring - visible on drag */}
          <div 
            className={`absolute rounded-full transition-all duration-200 ${
              isDragging 
                ? 'w-[42px] h-[42px] opacity-100 scale-100' 
                : 'w-[42px] h-[42px] opacity-0 scale-75'
            }`}
            style={{
              background: 'radial-gradient(circle, rgba(0,147,121,0.12) 0%, transparent 70%)',
            }}
          />
          
          {/* White Thumb */}
          <div 
            className={`relative rounded-full bg-white transition-all duration-150 ${
              isDragging ? 'w-[18px] h-[18px]' : 'w-[16px] h-[16px]'
            }`}
            style={{
              boxShadow: isDragging 
                ? '0 0 16px rgba(0,147,121,0.3), 0 0 4px rgba(255,255,255,0.1)' 
                : '0 0 8px rgba(0,147,121,0.15), 0 0 2px rgba(255,255,255,0.06)',
            }}
          />
        </div>
      </div>
    </div>
  );
}