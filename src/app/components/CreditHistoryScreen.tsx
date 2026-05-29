// ===== CREDIT HISTORY SCREEN =====
// Full screen showing credit consumption history with stats, donut chart,
// category + time range filters, and a day-grouped history list.
// Reached via Home ("Verlauf ansehen") and Mein Tarif ("Credits-Verlauf ansehen").

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, BookOpen, GraduationCap, ClipboardList, FileText, Calendar, X, Sparkles,
} from 'lucide-react';
import {
  MOCK_CREDIT_HISTORY,
  CREDIT_CATEGORIES,
  categoryMeta,
  type CreditCategory,
  type CreditEntry,
} from '@/mocks/creditHistory.mock';
import { APP_NOW } from '@/mocks/extraSessions.mock';

const ff = "Poppins, -apple-system, 'Inter', BlinkMacSystemFont, sans-serif";

type Preset = '7d' | '30d' | 'month' | 'custom';

interface CreditHistoryScreenProps {
  onClose: () => void;
  /** Current available credit balance (shown in stats block). */
  currentBalance?: number;
  isMobile?: boolean;
  externalTransition?: boolean;
}

// ===== HELPERS =====
function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function iso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fromIso(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function formatDayHeader(d: Date): string {
  const today = startOfDay(APP_NOW);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const target = startOfDay(d);
  if (target.getTime() === today.getTime()) return 'Heute';
  if (target.getTime() === yesterday.getTime()) return 'Gestern';
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function formatRangeLabel(from: Date, to: Date): string {
  const sameYear = from.getFullYear() === to.getFullYear();
  const f = from.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', ...(sameYear ? {} : { year: 'numeric' }) });
  const t = to.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${f} – ${t}`;
}

function iconFor(cat: CreditCategory) {
  switch (cat) {
    case 'flashcards': return BookOpen;
    case 'exam': return GraduationCap;
    case 'klassenarbeit': return ClipboardList;
    case 'schulaufgaben': return FileText;
    case 'ai': return Sparkles;
  }
}

// ===== MAIN =====
export default function CreditHistoryScreen({
  onClose,
  currentBalance = 743,
  isMobile = false,
}: CreditHistoryScreenProps) {
  // ===== FILTER STATE =====
  const [activeCategories, setActiveCategories] = useState<Set<CreditCategory>>(
    () => new Set(CREDIT_CATEGORIES.map((c) => c.key)),
  );
  const [preset, setPreset] = useState<Preset>('30d');
  const [customFrom, setCustomFrom] = useState<string>(iso(new Date(APP_NOW.getTime() - 7 * 86400000)));
  const [customTo, setCustomTo] = useState<string>(iso(APP_NOW));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const range = useMemo(() => {
    const today = startOfDay(APP_NOW);
    let from: Date;
    let to: Date = APP_NOW;
    if (preset === '7d') {
      from = new Date(today); from.setDate(from.getDate() - 6);
    } else if (preset === '30d') {
      from = new Date(today); from.setDate(from.getDate() - 29);
    } else if (preset === 'month') {
      from = new Date(today.getFullYear(), today.getMonth(), 1);
    } else {
      from = startOfDay(fromIso(customFrom));
      to = new Date(fromIso(customTo)); to.setHours(23, 59, 59, 999);
    }
    return { from, to };
  }, [preset, customFrom, customTo]);

  // ===== FILTERED DATA =====
  const filtered = useMemo<CreditEntry[]>(() => {
    return MOCK_CREDIT_HISTORY
      .filter((e) => activeCategories.has(e.category))
      .filter((e) => e.timestamp >= range.from && e.timestamp <= range.to)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [activeCategories, range]);

  const totalConsumed = useMemo(() => filtered.reduce((s, e) => s + e.credits, 0), [filtered]);

  const byCategory = useMemo(() => {
    const map = new Map<CreditCategory, number>();
    filtered.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + e.credits));
    return CREDIT_CATEGORIES.map((c) => ({ ...c, total: map.get(c.key) ?? 0 }));
  }, [filtered]);

  // Group by day for the list
  const grouped = useMemo(() => {
    const m = new Map<string, CreditEntry[]>();
    filtered.forEach((e) => {
      const key = iso(e.timestamp);
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(e);
    });
    return Array.from(m.entries()).map(([key, items]) => ({ key, date: fromIso(key), items }));
  }, [filtered]);

  const toggleCategory = (cat: CreditCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      if (next.size === 0) return new Set(CREDIT_CATEGORIES.map((c) => c.key)); // never empty
      return next;
    });
  };

  // ===== DONUT CHART (simple SVG) =====
  const donutSize = 140;
  const donutStroke = 16;
  const radius = (donutSize - donutStroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;
  const segments = byCategory
    .filter((c) => c.total > 0)
    .map((c) => {
      const frac = totalConsumed > 0 ? c.total / totalConsumed : 0;
      const length = frac * circumference;
      const seg = {
        key: c.key,
        color: c.color,
        dashArray: `${length} ${circumference - length}`,
        dashOffset: -cumulativeOffset,
      };
      cumulativeOffset += length;
      return seg;
    });

  const rangeLabel = formatRangeLabel(range.from, range.to);

  // ===== RENDER =====
  return (
    <div
      className="size-full flex flex-col bg-[#0a0a0a] overscroll-none"
      style={{ position: isMobile ? 'relative' : undefined }}
    >
      {/* ===== HEADER ===== */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-5"
        style={{
          height: 60,
          paddingTop: isMobile ? 'max(8px, env(safe-area-inset-top))' : undefined,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded-xl active:scale-95 transition-transform"
          style={{
            width: 36, height: 36,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            WebkitTapHighlightColor: 'transparent',
          }}
          aria-label="Zurück"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" strokeWidth={2} />
        </button>
        <h1 className="text-white text-[16px]" style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.2px' }}>
          Credits-Verlauf
        </h1>
      </div>

      {/* ===== SCROLLABLE CONTENT ===== */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-10">
        {/* ===== STATS BLOCK ===== */}
        <div
          className="mt-5 rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 100%)',
            border: '1px solid rgba(16,185,129,0.18)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white/50 text-[11px] uppercase tracking-wider mb-1.5"
                 style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '0.08em' }}>
                Verfügbar
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[#10B981] text-[32px]" style={{ fontFamily: ff, fontWeight: 700, lineHeight: 1 }}>
                  {currentBalance}
                </span>
                <span className="text-white/45 text-[13px]" style={{ fontFamily: ff }}>Credits</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-[11px] uppercase tracking-wider mb-1.5"
                 style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '0.08em' }}>
                Verbraucht im Zeitraum
              </p>
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-white text-[24px]" style={{ fontFamily: ff, fontWeight: 700, lineHeight: 1 }}>
                  −{totalConsumed}
                </span>
                <span className="text-white/45 text-[12px]" style={{ fontFamily: ff }}>Credits</span>
              </div>
              <p className="text-white/30 text-[11px] mt-1" style={{ fontFamily: ff }}>
                {rangeLabel}
              </p>
            </div>
          </div>
        </div>

        {/* ===== DONUT CHART ===== */}
        <div
          className="mt-4 rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <h3 className="text-white/90 text-[14px] mb-4"
              style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.2px' }}>
            Verteilung nach Kategorie
          </h3>

          {totalConsumed === 0 ? (
            <div className="py-8 text-center">
              <p className="text-white/35 text-[13px]" style={{ fontFamily: ff }}>
                Keine Einträge im ausgewählten Zeitraum.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5">
              {/* Donut — centered on top so the legend has full row width */}
              <div className="relative flex-shrink-0" style={{ width: donutSize, height: donutSize }}>
                <svg width={donutSize} height={donutSize} className="-rotate-90">
                  <circle
                    cx={donutSize / 2} cy={donutSize / 2} r={radius}
                    fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={donutStroke}
                  />
                  {segments.map((s) => (
                    <circle
                      key={s.key}
                      cx={donutSize / 2} cy={donutSize / 2} r={radius}
                      fill="none" stroke={s.color} strokeWidth={donutStroke}
                      strokeDasharray={s.dashArray} strokeDashoffset={s.dashOffset}
                      strokeLinecap="butt"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white text-[24px]" style={{ fontFamily: ff, fontWeight: 700, lineHeight: 1 }}>
                    {totalConsumed}
                  </span>
                  <span className="text-white/40 text-[10px] mt-1" style={{ fontFamily: ff, fontWeight: 500 }}>
                    gesamt
                  </span>
                </div>
              </div>

              {/* Legend — full-width grid with tinted category chips */}
              <div className="w-full grid grid-cols-2 gap-2">
                {byCategory.map((c) => {
                  const pct = totalConsumed > 0 ? Math.round((c.total / totalConsumed) * 100) : 0;
                  return (
                    <div
                      key={c.key}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{
                        background: `${c.color}10`,
                        border: `1px solid ${c.color}26`,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: c.color, boxShadow: `0 0 8px ${c.color}66` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[11px] leading-tight"
                          style={{ fontFamily: ff, fontWeight: 600, color: c.color }}
                        >
                          {c.label}
                        </p>
                        <p
                          className="text-white/55 text-[10px] mt-0.5 leading-tight"
                          style={{ fontFamily: ff, fontWeight: 500 }}
                        >
                          {c.total} Credits · {pct}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ===== FILTERS ===== */}
        <div className="mt-4 space-y-3">
          {/* Category chips */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-0.5">
            {CREDIT_CATEGORIES.map((c) => {
              const active = activeCategories.has(c.key);
              const Icon = iconFor(c.key);
              return (
                <button
                  key={c.key}
                  onClick={() => toggleCategory(c.key)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
                  style={{
                    background: active ? `${c.color}1A` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? `${c.color}44` : 'rgba(255,255,255,0.06)'}`,
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <Icon className="w-3 h-3" style={{ color: active ? c.color : 'rgba(255,255,255,0.4)' }} strokeWidth={2.2} />
                  <span className="text-[11px]"
                        style={{
                          fontFamily: ff,
                          fontWeight: 600,
                          color: active ? c.color : 'rgba(255,255,255,0.5)',
                        }}>
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Time range presets */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-0.5">
            {[
              { key: '7d' as const, label: '7 Tage' },
              { key: '30d' as const, label: '30 Tage' },
              { key: 'month' as const, label: 'Dieser Monat' },
            ].map((p) => {
              const active = preset === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => setPreset(p.key)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
                  style={{
                    background: active ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <span className="text-[11px]"
                        style={{
                          fontFamily: ff,
                          fontWeight: 600,
                          color: active ? 'white' : 'rgba(255,255,255,0.5)',
                        }}>
                    {p.label}
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => setShowDatePicker(true)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
              style={{
                background: preset === 'custom' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${preset === 'custom' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Calendar className="w-3 h-3"
                        style={{ color: preset === 'custom' ? 'white' : 'rgba(255,255,255,0.5)' }}
                        strokeWidth={2.2} />
              <span className="text-[11px]"
                    style={{
                      fontFamily: ff,
                      fontWeight: 600,
                      color: preset === 'custom' ? 'white' : 'rgba(255,255,255,0.5)',
                    }}>
                {preset === 'custom' ? rangeLabel : 'Eigener Zeitraum'}
              </span>
            </button>
          </div>
        </div>

        {/* ===== HISTORY LIST ===== */}
        <div className="mt-5">
          {grouped.length === 0 ? (
            <div
              className="rounded-2xl py-10 text-center"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px dashed rgba(255,255,255,0.08)',
              }}
            >
              <p className="text-white/40 text-[13px]" style={{ fontFamily: ff, fontWeight: 500 }}>
                Keine Einträge für diese Auswahl
              </p>
              <p className="text-white/25 text-[11px] mt-1" style={{ fontFamily: ff }}>
                Passe Kategorien oder Zeitraum an.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {grouped.map((group) => {
                const daySum = group.items.reduce((s, e) => s + e.credits, 0);
                return (
                  <div key={group.key}>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-white/55 text-[11px] uppercase tracking-wider"
                            style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '0.08em' }}>
                        {formatDayHeader(group.date)}
                      </span>
                      <span className="text-white/35 text-[11px]" style={{ fontFamily: ff, fontWeight: 500 }}>
                        −{daySum} Credits
                      </span>
                    </div>
                    <div
                      className="rounded-2xl overflow-hidden"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {group.items.map((e, idx) => {
                        const meta = categoryMeta(e.category);
                        const Icon = iconFor(e.category);
                        return (
                          <div
                            key={e.id}
                            className="flex items-center gap-3 px-3.5 py-3"
                            style={{
                              borderTop: idx === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)',
                            }}
                          >
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                background: `${meta.color}18`,
                                border: `1px solid ${meta.color}30`,
                              }}
                            >
                              <Icon className="w-4 h-4" style={{ color: meta.color }} strokeWidth={2.2} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-[13px] truncate"
                                 style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.1px' }}>
                                {e.title}
                              </p>
                              {e.subtitle && (
                                <p className="text-white/40 text-[11px] truncate mt-0.5"
                                   style={{ fontFamily: ff, fontWeight: 400 }}>
                                  {e.subtitle}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end flex-shrink-0">
                              <span className="text-[13px]"
                                    style={{ fontFamily: ff, fontWeight: 700, color: '#F87171' }}>
                                −{e.credits}
                              </span>
                              <span className="text-white/30 text-[10px] mt-0.5"
                                    style={{ fontFamily: ff, fontWeight: 500 }}>
                                {formatTime(e.timestamp)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ===== CUSTOM DATE PICKER ===== */}
      <AnimatePresence>
        {showDatePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[11000] flex items-end sm:items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            onClick={() => setShowDatePicker(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
              style={{
                background: 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)',
                border: '1px solid rgba(255,255,255,0.10)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              }}
            >
              <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
              </div>
              <div className="px-5 pt-3 pb-4 flex items-center justify-between border-b border-white/[0.06]">
                <h3 className="text-white text-[15px]" style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.2px' }}>
                  Eigener Zeitraum
                </h3>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.05] active:scale-95 transition-transform"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  aria-label="Schließen"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <label className="text-white/45 text-[11px] uppercase tracking-wider block mb-1.5"
                         style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '0.08em' }}>
                    Von
                  </label>
                  <input
                    type="date"
                    value={customFrom}
                    max={customTo}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.05] border border-white/[0.08] px-3.5 py-2.5 text-white text-[14px] outline-none focus:border-white/[0.15]"
                    style={{ fontFamily: ff, colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label className="text-white/45 text-[11px] uppercase tracking-wider block mb-1.5"
                         style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '0.08em' }}>
                    Bis
                  </label>
                  <input
                    type="date"
                    value={customTo}
                    min={customFrom}
                    max={iso(APP_NOW)}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-full rounded-xl bg-white/[0.05] border border-white/[0.08] px-3.5 py-2.5 text-white text-[14px] outline-none focus:border-white/[0.15]"
                    style={{ fontFamily: ff, colorScheme: 'dark' }}
                  />
                </div>
              </div>
              <div className="px-5 pb-5 pt-1">
                <button
                  onClick={() => {
                    setPreset('custom');
                    setShowDatePicker(false);
                  }}
                  className="w-full h-[44px] rounded-xl flex items-center justify-center active:scale-[0.98] transition-transform"
                  style={{
                    background: 'rgba(16,185,129,0.14)',
                    border: '1px solid rgba(16,185,129,0.30)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <span className="text-[13px]" style={{ fontFamily: ff, fontWeight: 600, color: '#10B981' }}>
                    Zeitraum anwenden
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
