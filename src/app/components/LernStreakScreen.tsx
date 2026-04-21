// ===== LERN-STREAK SCREEN =====
// Detail-Screen mit Belohnungen, Streak-Schutz, Meilensteinen und Stats.
// Erreichbar via Klick auf Streak-Pill im MobileHeader ODER die LernStreakSection auf Home.
//
// DESIGN: Folgt dem LernStreakSection-Stil (Flammen-Orange #FF9F43, Glass-Cards,
// uppercase Section-Header mit Flame/Star/Clock).

import React from 'react';
import { ChevronLeft, Flame, Gift, Shield, Star, Clock, Zap, Trophy, Lock } from 'lucide-react';
import { LEARNING_STREAK } from '@/app/components/ProfileAnalyticsScreen';

interface LernStreakScreenProps {
  onClose: () => void;
  externalTransition?: boolean;
}

// ===== MOCK DATA =====
const LONGEST_STREAK = 42;
const STREAK_FREEZES_AVAILABLE = 1;
const MAX_STREAK_FREEZES = 2;
const WEEKLY_HOURS = 4;
const WEEKLY_MINS = 32;

interface Milestone {
  days: number;
  credits: number;
  label?: string;
}

const MILESTONES: Milestone[] = [
  { days: 3, credits: 5 },
  { days: 7, credits: 15, label: 'Erste Woche' },
  { days: 14, credits: 30 },
  { days: 30, credits: 75, label: 'Monats-Streak' },
  { days: 50, credits: 125 },
  { days: 100, credits: 300, label: 'Jahrhundert' },
  { days: 365, credits: 1500, label: 'Jahres-Champion' },
];

function getMultiplier(streak: number): { value: number; label: string; nextAt?: number } {
  if (streak >= 100) return { value: 3, label: '3× Multiplier' };
  if (streak >= 31) return { value: 2, label: '2× Multiplier', nextAt: 100 };
  if (streak >= 8) return { value: 1.5, label: '1,5× Multiplier', nextAt: 31 };
  return { value: 1, label: '1× Multiplier', nextAt: 8 };
}

export default function LernStreakScreen({ onClose }: LernStreakScreenProps) {
  const streak = LEARNING_STREAK;
  const multiplier = getMultiplier(streak);
  const nextMilestone = MILESTONES.find((m) => m.days > streak);
  const prevMilestoneDays = MILESTONES.filter((m) => m.days <= streak).pop()?.days ?? 0;
  const progressToNext = nextMilestone
    ? ((streak - prevMilestoneDays) / (nextMilestone.days - prevMilestoneDays)) * 100
    : 100;
  const daysToNext = nextMilestone ? nextMilestone.days - streak : 0;

  return (
    <div className="size-full flex flex-col bg-[#0a0a0a] overflow-hidden overscroll-none">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-safe">
        <div className="flex items-center gap-3 h-[56px]">
          <button
            onClick={onClose}
            className="flex items-center gap-0.5 active:opacity-70 transition-opacity"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <ChevronLeft className="w-5 h-5 text-white/50" />
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50">
              Zurück
            </span>
          </button>
        </div>
        <div className="mb-4">
          <h1 className="font-['Poppins:Bold',sans-serif] text-[22px] text-white tracking-[-0.3px]">
            Lern-Streak
          </h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-none px-5 pb-8 space-y-5">
        {/* ===== HERO: Große Flammen-Card ===== */}
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,159,67,0.15), rgba(255,159,67,0.04))',
            border: '1px solid rgba(255,159,67,0.25)',
          }}
        >
          <div className="flex items-center justify-center mb-3">
            <div
              className="w-[88px] h-[88px] rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,159,67,0.18)' }}
            >
              <Flame className="w-12 h-12" style={{ color: '#FF9F43' }} strokeWidth={2} />
            </div>
          </div>
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <span
              className="font-['Poppins:Bold',sans-serif] text-[56px] leading-none"
              style={{ color: '#FF9F43' }}
            >
              {streak}
            </span>
            <span className="font-['Poppins:Medium',sans-serif] text-[16px] text-white/60">
              Tage
            </span>
          </div>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/50 mb-4">
            Du bist seit {streak} Tagen am Ball — weiter so!
          </p>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,159,67,0.18)',
              border: '1px solid rgba(255,159,67,0.35)',
            }}
          >
            <Zap className="w-3.5 h-3.5" style={{ color: '#FF9F43' }} strokeWidth={2.2} />
            <span
              className="font-['Poppins:SemiBold',sans-serif] text-[12px]"
              style={{ color: '#FF9F43' }}
            >
              {multiplier.label}
            </span>
          </div>
          {multiplier.nextAt && (
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35 mt-2">
              Ab {multiplier.nextAt} Tagen: {getMultiplier(multiplier.nextAt).label}
            </p>
          )}
        </div>

        {/* ===== NEXT MILESTONE ===== */}
        {nextMilestone && (
          <div>
            <h3 className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Gift className="w-4 h-4" />
              Nächste Belohnung
            </h3>
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,159,67,0.12)' }}
                  >
                    <Gift className="w-5 h-5" style={{ color: '#FF9F43' }} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                      +{nextMilestone.credits} Credits
                    </p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">
                      {nextMilestone.days} Tage{nextMilestone.label ? ` · ${nextMilestone.label}` : ''}
                    </p>
                  </div>
                </div>
                <span
                  className="font-['Poppins:SemiBold',sans-serif] text-[12px]"
                  style={{ color: '#FF9F43' }}
                >
                  noch {daysToNext} {daysToNext === 1 ? 'Tag' : 'Tage'}
                </span>
              </div>
              <div className="w-full h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(Math.max(progressToNext, 0), 100)}%`,
                    background: 'linear-gradient(to right, #FF9F43, #FFB84D)',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ===== STREAK-SCHUTZ ===== */}
        <div>
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            Streak-Schutz
          </h3>
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(74,158,255,0.12)' }}
              >
                <Shield className="w-5 h-5" style={{ color: '#4A9EFF' }} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                  {STREAK_FREEZES_AVAILABLE} Streak-Freeze verfügbar
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 leading-[15px]">
                  Schützt deinen Streak automatisch, wenn du einen Tag verpasst
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: MAX_STREAK_FREEZES }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: i < STREAK_FREEZES_AVAILABLE ? '#4A9EFF' : 'rgba(255,255,255,0.1)',
                    }}
                  />
                ))}
              </div>
            </div>
            <div
              className="flex items-center gap-2 pt-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Clock className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/50 leading-[15px]">
                Alle 14 Tage erhältst du einen neuen Freeze (max. {MAX_STREAK_FREEZES})
              </p>
            </div>
          </div>
        </div>

        {/* ===== MEILENSTEINE TIMELINE ===== */}
        <div>
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            Meilensteine
          </h3>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {MILESTONES.map((m, i) => {
              const achieved = m.days <= streak;
              const isNext = !achieved && m.days === nextMilestone?.days;
              const isLast = i === MILESTONES.length - 1;
              return (
                <React.Fragment key={m.days}>
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: achieved
                          ? 'rgba(255,159,67,0.15)'
                          : isNext
                          ? 'rgba(255,159,67,0.08)'
                          : 'rgba(255,255,255,0.03)',
                        border: isNext ? '1px solid rgba(255,159,67,0.35)' : '1px solid transparent',
                      }}
                    >
                      {achieved ? (
                        <Flame className="w-4 h-4" style={{ color: '#FF9F43' }} strokeWidth={2.2} />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-white/25" strokeWidth={2} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-['Poppins:Medium',sans-serif] text-[13px] leading-tight truncate"
                        style={{ color: achieved ? '#ffffff' : 'rgba(255,255,255,0.5)' }}
                      >
                        {m.days} Tage{m.label ? ` · ${m.label}` : ''}
                      </p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35 mt-0.5">
                        +{m.credits} Credits
                      </p>
                    </div>
                    {achieved && (
                      <span
                        className="font-['Poppins:SemiBold',sans-serif] text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          color: '#FF9F43',
                          background: 'rgba(255,159,67,0.12)',
                          border: '1px solid rgba(255,159,67,0.25)',
                        }}
                      >
                        ✓ Erhalten
                      </span>
                    )}
                    {isNext && (
                      <span
                        className="font-['Poppins:SemiBold',sans-serif] text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          color: 'rgba(255,255,255,0.6)',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        Nächstes
                      </span>
                    )}
                  </div>
                  {!isLast && <div className="mx-4 h-px bg-white/[0.04]" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ===== STATS: Rekord + Wochenzeit + 7-Tage-Grid ===== */}
        <div>
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Star className="w-4 h-4" />
            Deine Woche
          </h3>
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-white/25" />
                <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                  Längste:{' '}
                  <span className="text-white/60">{LONGEST_STREAK} Tage</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-white/25" />
                <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/40">
                  {WEEKLY_HOURS > 0 ? `${WEEKLY_HOURS}h ` : ''}
                  {WEEKLY_MINS}min
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, i) => {
                const isActive = i < streak && i < 7;
                const isToday = i === 0;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full aspect-square rounded-lg flex items-center justify-center transition-colors"
                      style={{
                        background: isActive
                          ? isToday
                            ? 'rgba(255,159,67,0.20)'
                            : 'rgba(255,159,67,0.10)'
                          : 'rgba(255,255,255,0.03)',
                        border: isToday ? '1px solid rgba(255,159,67,0.35)' : '1px solid transparent',
                      }}
                    >
                      {isActive && (
                        <Flame
                          className="w-3 h-3"
                          style={{ color: isToday ? '#FF9F43' : 'rgba(255,159,67,0.50)' }}
                        />
                      )}
                    </div>
                    <span
                      className="font-['Poppins:Medium',sans-serif] text-[9px]"
                      style={{ color: isToday ? '#FF9F43' : 'rgba(255,255,255,0.25)' }}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===== INFO: So funktioniert's ===== */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white mb-2">
            So funktioniert's
          </p>
          <ul className="space-y-1.5">
            <li className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/55 leading-[17px]">
              · Öffne die App mindestens einmal pro Tag und absolviere eine Lerneinheit
            </li>
            <li className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/55 leading-[17px]">
              · Der Lerntag endet erst um 03:00 Uhr — perfekt für Spätlerner
            </li>
            <li className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/55 leading-[17px]">
              · Ein Streak-Freeze schützt dich automatisch bei verpassten Tagen
            </li>
            <li className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/55 leading-[17px]">
              · Längere Streaks = höherer Multiplier für tägliche Bonus-Credits
            </li>
            <li className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/55 leading-[17px]">
              · Nach einem Bruch: 24h-Window zur Reaktivierung (1× pro Monat gratis)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
