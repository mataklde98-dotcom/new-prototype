import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// ===== Poppins helper =====
const p = (w: string) => `font-['Poppins:${w}',sans-serif]`;

// ===== Format helpers =====
const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const formatDisplay = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
};

const MONTHS_DE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

// ===== Types =====
interface RangePreset {
  label: string;
  from: string; // YYYY-MM-DD
  to: string;
}

interface BaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  /** Date string YYYY-MM-DD – no days after this are selectable */
  maxDate?: string;
  /** Date string YYYY-MM-DD – no days before this are selectable */
  minDate?: string;
}

interface SingleModeProps extends BaseProps {
  mode: 'single';
  value: string; // YYYY-MM-DD
  onSelect: (date: string) => void;
}

interface RangeModeProps extends BaseProps {
  mode: 'range';
  from: string; // YYYY-MM-DD
  to: string;
  onApply: (from: string, to: string) => void;
  presets?: RangePreset[];
}

export type PremiumCalendarPickerProps = SingleModeProps | RangeModeProps;

// ===== Component =====
export default function PremiumCalendarPicker(props: PremiumCalendarPickerProps) {
  const { isOpen, onClose, title, maxDate, minDate, mode } = props;

  // --- Internal state ---
  const initialMonth = useMemo(() => {
    const ref =
      mode === 'single'
        ? props.value
        : props.to || props.from;
    if (ref) {
      const d = new Date(ref + 'T00:00:00');
      return { year: d.getFullYear(), month: d.getMonth() };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const [calMonth, setCalMonth] = useState(initialMonth);
  // Reset when opening
  React.useEffect(() => {
    if (isOpen) {
      const ref = mode === 'single' ? (props as SingleModeProps).value : (props as RangeModeProps).to || (props as RangeModeProps).from;
      if (ref) {
        const d = new Date(ref + 'T00:00:00');
        setCalMonth({ year: d.getFullYear(), month: d.getMonth() });
      } else {
        const now = new Date();
        setCalMonth({ year: now.getFullYear(), month: now.getMonth() });
      }
      if (mode === 'range') {
        setLocalFrom((props as RangeModeProps).from);
        setLocalTo((props as RangeModeProps).to);
        setSelecting('from');
      }
      if (mode === 'single') {
        setLocalSingle((props as SingleModeProps).value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Range state
  const [localFrom, setLocalFrom] = useState(mode === 'range' ? (props as RangeModeProps).from : '');
  const [localTo, setLocalTo] = useState(mode === 'range' ? (props as RangeModeProps).to : '');
  const [selecting, setSelecting] = useState<'from' | 'to'>('from');

  // Single state
  const [localSingle, setLocalSingle] = useState(mode === 'single' ? (props as SingleModeProps).value : '');

  if (!isOpen) return null;

  // --- Month nav ---
  const prevMonth = () =>
    setCalMonth((prev) => {
      const m = prev.month - 1;
      return m < 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: m };
    });
  const nextMonth = () =>
    setCalMonth((prev) => {
      const m = prev.month + 1;
      return m > 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: m };
    });

  // --- Build day grid ---
  const { year, month } = calMonth;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startPad = (firstDay.getDay() + 6) % 7; // Monday = 0

  const today = new Date();
  const todayStr = toDateStr(today);

  const handleDayClick = (dateStr: string) => {
    if (mode === 'single') {
      setLocalSingle(dateStr);
      (props as SingleModeProps).onSelect(dateStr);
      onClose();
    } else {
      if (selecting === 'from') {
        setLocalFrom(dateStr);
        if (!localTo || dateStr > localTo) {
          setLocalTo('');
        }
        setSelecting('to');
      } else {
        if (localFrom && dateStr < localFrom) {
          setLocalFrom(dateStr);
          setSelecting('to');
        } else {
          setLocalTo(dateStr);
        }
      }
    }
  };

  const isDayDisabled = (dateStr: string) => {
    if (maxDate && dateStr > maxDate) return true;
    if (minDate && dateStr < minDate) return true;
    return false;
  };

  // --- Days ---
  const days: React.ReactNode[] = [];
  for (let i = 0; i < startPad; i++) {
    days.push(<div key={`pad-${i}`} />);
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const disabled = isDayDisabled(dateStr);
    const isToday = dateStr === todayStr;

    let isEndpoint = false;
    let isInRange = false;
    let isSelected = false;

    if (mode === 'single') {
      isSelected = dateStr === localSingle;
    } else {
      const isFrom = dateStr === localFrom;
      const isTo = dateStr === localTo;
      isEndpoint = isFrom || isTo;
      if (localFrom && localTo && dateStr >= localFrom && dateStr <= localTo) {
        isInRange = true;
      }
    }

    const highlight = isSelected || isEndpoint;

    days.push(
      <button
        key={d}
        disabled={disabled}
        onClick={() => handleDayClick(dateStr)}
        className={`w-full aspect-square rounded-lg flex items-center justify-center ${p('Medium')} text-[12px] transition-all`}
        style={{
          background: highlight
            ? 'rgba(0,184,148,0.20)'
            : isInRange
            ? 'rgba(0,184,148,0.07)'
            : 'transparent',
          border: highlight ? '1px solid rgba(0,184,148,0.40)' : '1px solid transparent',
          color: disabled
            ? 'rgba(255,255,255,0.12)'
            : highlight
            ? '#00D4AA'
            : isInRange
            ? 'rgba(0,184,148,0.8)'
            : isToday
            ? '#fff'
            : 'rgba(255,255,255,0.5)',
        }}
      >
        {d}
      </button>,
    );
  }

  // --- Presets (range only) ---
  const presets = mode === 'range' ? (props as RangeModeProps).presets : undefined;

  // --- Can apply? (range only) ---
  const canApply = mode === 'range' && localFrom && localTo && localFrom <= localTo;

  const content = (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Bottom Sheet */}
      <div
        className="relative w-full max-w-[420px] mx-auto rounded-t-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
          paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)',
          animation: 'premiumCalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Indicator */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-[4px] rounded-full bg-white/15" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-3 flex items-center justify-between">
          <div>
            <h3 className={`${p('SemiBold')} text-[16px] text-white tracking-[-0.3px]`}>
              {title || (mode === 'range' ? 'Zeitraum wählen' : 'Datum wählen')}
            </h3>
            {mode === 'range' && (
              <p className={`${p('Regular')} text-[12px] text-white/40 mt-0.5`}>
                Wähle Start- und Enddatum
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/[0.05] active:bg-white/[0.1] transition-colors"
          >
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {/* Von / Bis tabs (range only) */}
        {mode === 'range' && (
          <div className="px-5 pb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSelecting('from')}
                className={`flex-1 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  selecting === 'from'
                    ? 'bg-[#00B894]/10 border border-[#00B894]/25'
                    : 'bg-white/[0.03] border border-white/[0.06]'
                }`}
              >
                <p className={`${p('Medium')} text-[9px] mb-0.5 ${selecting === 'from' ? 'text-[#00B894]/60' : 'text-white/25'}`}>VON</p>
                <p className={`${p('SemiBold')} text-[13px] ${selecting === 'from' ? 'text-[#00B894]' : 'text-white/70'}`}>
                  {localFrom ? formatDisplay(localFrom) : '—'}
                </p>
              </button>
              <div className="flex items-center">
                <div className="w-4 h-[1px] bg-white/15" />
              </div>
              <button
                onClick={() => setSelecting('to')}
                className={`flex-1 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  selecting === 'to'
                    ? 'bg-[#00B894]/10 border border-[#00B894]/25'
                    : 'bg-white/[0.03] border border-white/[0.06]'
                }`}
              >
                <p className={`${p('Medium')} text-[9px] mb-0.5 ${selecting === 'to' ? 'text-[#00B894]/60' : 'text-white/25'}`}>BIS</p>
                <p className={`${p('SemiBold')} text-[13px] ${selecting === 'to' ? 'text-[#00B894]' : 'text-white/70'}`}>
                  {localTo ? formatDisplay(localTo) : '—'}
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="px-5 pb-3">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <ChevronLeft className="w-4 h-4 text-white/50" />
            </button>
            <span className={`${p('SemiBold')} text-[13px] text-white/70`}>
              {MONTHS_DE[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <ChevronRight className="w-4 h-4 text-white/50" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
              <div key={day} className={`${p('Medium')} text-[10px] text-white/25 text-center py-1`}>
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">{days}</div>
        </div>

        {/* Quick Presets (range only) */}
        {mode === 'range' && presets && presets.length > 0 && (
          <div className="px-5 pb-3">
            <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setLocalFrom(preset.from);
                    setLocalTo(preset.to);
                    const d = new Date(preset.from + 'T00:00:00');
                    setCalMonth({ year: d.getFullYear(), month: d.getMonth() });
                  }}
                  className={`px-3 py-1.5 rounded-lg ${p('Medium')} text-[10px] text-white/40 bg-white/[0.03] border border-white/[0.06] whitespace-nowrap active:scale-[0.96] transition-all duration-200`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Apply Button (range only) */}
        {mode === 'range' && (
          <div className="px-5 pb-2 pt-1">
            <button
              onClick={() => {
                if (canApply) {
                  (props as RangeModeProps).onApply(localFrom, localTo);
                  onClose();
                }
              }}
              disabled={!canApply}
              className={`w-full py-3 rounded-xl ${p('SemiBold')} text-[14px] transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed`}
              style={{
                background: 'rgba(0,184,148,0.07)',
                border: '1px solid rgba(0,184,148,0.25)',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              Zeitraum anwenden
            </button>
          </div>
        )}
      </div>

      {/* Animation */}
      <style>{`
        @keyframes premiumCalSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}

// ===== Trigger Button =====
// A styled button that looks like a date input field and opens the calendar
interface CalendarTriggerProps {
  value: string; // YYYY-MM-DD or empty
  placeholder?: string;
  onClick: () => void;
  disabled?: boolean;
  /** Optional className override */
  className?: string;
  /** Show the "changed" orange style */
  changed?: boolean;
}

export function CalendarTrigger({
  value,
  placeholder = 'Datum wählen',
  onClick,
  disabled,
  className,
  changed,
}: CalendarTriggerProps) {
  const display = value ? formatDisplay(value) : placeholder;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        className ||
        `w-full rounded-xl px-4 py-3 ${p('Regular')} text-[14px] cursor-pointer outline-none transition-all duration-200 text-left ${
          changed
            ? 'bg-[#D4A044]/10 border border-[#D4A044]/20 text-[#E8B960]'
            : value
            ? 'bg-white/[0.04] border border-white/[0.08] text-white/90'
            : 'bg-white/[0.04] border border-white/[0.08] text-white/25'
        } ${disabled ? 'opacity-40 pointer-events-none' : 'active:bg-white/[0.06] active:border-white/[0.18]'}`
      }
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {display}
    </button>
  );
}

// ===== Inline Range Trigger =====
// Replaces native date range inputs (like in KlassenarbeitenScreen)
interface RangeCalendarTriggerProps {
  from: string;
  to: string;
  onClick: () => void;
  onClear?: () => void;
  isMobile?: boolean;
}

export function RangeCalendarTrigger({ from, to, onClick, onClear, isMobile }: RangeCalendarTriggerProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onClick}
        className={`flex-1 h-[38px] rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 ${p('Medium')} text-[12px] outline-none transition-colors text-left ${
          from ? 'text-white/70' : 'text-white/25'
        }`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {from ? formatDisplay(from) : 'Von'}
      </button>
      <span className={`${p('Medium')} text-[11px] text-white/20`}>–</span>
      <button
        onClick={onClick}
        className={`flex-1 h-[38px] rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 ${p('Medium')} text-[12px] outline-none transition-colors text-left ${
          to ? 'text-white/70' : 'text-white/25'
        }`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {to ? formatDisplay(to) : 'Bis'}
      </button>
      {(from || to) && onClear && (
        <button
          onClick={onClear}
          className={`flex items-center justify-center w-[38px] h-[38px] rounded-xl bg-white/[0.05] border border-white/[0.08] transition-colors ${
            isMobile ? 'active:bg-white/[0.10]' : 'hover:bg-white/[0.10]'
          }`}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <X className="w-3.5 h-3.5 text-white/40" />
        </button>
      )}
    </div>
  );
}
