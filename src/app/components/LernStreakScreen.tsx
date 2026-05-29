// ===== LERN-STREAK SCREEN =====
// Detail-Screen mit Belohnungen, Streak-Schutz, Meilensteinen und Stats.
// Erreichbar via Klick auf Streak-Pill im MobileHeader ODER die LernStreakSection auf Home.
//
// DESIGN: Folgt dem LernStreakSection-Stil (Flammen-Orange #FF9F43, Glass-Cards,
// uppercase Section-Header mit Flame/Star/Clock).

import React from 'react';
import { ChevronLeft, Flame, Gift, Shield, Clock, Zap, Trophy, Lock, Calendar, Snowflake } from 'lucide-react';
import { LEARNING_STREAK } from '@/app/components/ProfileAnalyticsScreen';

interface LernStreakScreenProps {
  onClose: () => void;
  externalTransition?: boolean;
}

// ===== MOCK DATA =====
const STREAK_FREEZES_AVAILABLE = 1;
const MAX_STREAK_FREEZES = 2;
const FREEZE_PURCHASE_COST = 50; // Credits pro Freeze
const LONGEST_STREAK = 47; // Persönlicher Rekord (Mock — später aus User-Daten)

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
  { days: 180, credits: 600, label: 'Halbjahr' },
  { days: 270, credits: 900, label: '9 Monate' },
  { days: 365, credits: 1500, label: 'Jahres-Champion' },
];

// ===== MONATS-BONUS =====
// Regel: Monat 1 (Start-Monat) → anteilig (gelaufene Tage / Monatslänge × 50).
//        Ab Monat 2 → voller Bonus (+50) wenn Streak durchgehend vom 01. bis 01.
const MONTHLY_BONUS_CREDITS = 50;
// Mock: "Heute" im App-Universum — matcht andere Home-Berechnungen.
const TODAY = new Date('2026-03-18');
// Ableitbar aus LEARNING_STREAK: Start = heute minus (streak-1) Tage.
const STREAK_START = new Date(TODAY);
STREAK_START.setDate(TODAY.getDate() - (LEARNING_STREAK - 1));

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

interface MonthlyBonus {
  credits: number;
  isPartial: boolean;
  payoutDate: Date; // immer der 01. des Folgemonats
  daysInStreakThisMonth: number;
  totalDaysThisMonth: number;
}

function calculateCurrentMonthBonus(today: Date, streakStart: Date, multiplierValue: number): MonthlyBonus {
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const totalDaysThisMonth = getDaysInMonth(currentYear, currentMonth);
  const payoutDate = new Date(currentYear, currentMonth + 1, 1);

  const isFirstMonth =
    streakStart.getMonth() === currentMonth && streakStart.getFullYear() === currentYear;

  let daysInStreak: number;
  if (isFirstMonth) {
    // Von Streak-Start bis Monatsende, anteilig × Multiplier
    daysInStreak = totalDaysThisMonth - streakStart.getDate() + 1;
    const proportional = Math.round((daysInStreak / totalDaysThisMonth) * MONTHLY_BONUS_CREDITS * multiplierValue);
    return {
      credits: proportional,
      isPartial: true,
      payoutDate,
      daysInStreakThisMonth: daysInStreak,
      totalDaysThisMonth,
    };
  }

  // Ab Monat 2: voller Bonus × Multiplier, wenn durchgehend
  return {
    credits: Math.round(MONTHLY_BONUS_CREDITS * multiplierValue),
    isPartial: false,
    payoutDate,
    daysInStreakThisMonth: totalDaysThisMonth,
    totalDaysThisMonth,
  };
}

function formatPayoutDate(d: Date): string {
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ];
  return `1. ${months[d.getMonth()]}`;
}

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
  const daysToNext = nextMilestone ? nextMilestone.days - streak : 0;

  // Monats-Bonus — wird vom Multiplier erhöht
  const monthlyBonus = calculateCurrentMonthBonus(TODAY, STREAK_START, multiplier.value);
  const daysUntilPayout = Math.ceil(
    (monthlyBonus.payoutDate.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24),
  );
  const monthProgress =
    (monthlyBonus.daysInStreakThisMonth / monthlyBonus.totalDaysThisMonth) * 100;

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
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/50 mb-3">
            Du bist seit {streak} Tagen am Ball — weiter so!
          </p>

          {/* Persönlicher Rekord */}
          {streak >= LONGEST_STREAK ? (
            <div className="flex items-center justify-center gap-1.5 mb-4">
              <Trophy className="w-3.5 h-3.5" style={{ color: '#FF9F43' }} strokeWidth={2.2} />
              <span
                className="font-['Poppins:SemiBold',sans-serif] text-[11px]"
                style={{ color: '#FF9F43' }}
              >
                Neuer persönlicher Rekord!
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 mb-4">
              <Trophy className="w-3 h-3 text-white/35" strokeWidth={2} />
              <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/45">
                Persönlicher Rekord: {LONGEST_STREAK} Tage
              </span>
            </div>
          )}

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
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/45 mt-3 leading-[15px] max-w-[280px] mx-auto">
            Dein Multiplier erhöht deinen monatlichen Bonus.
          </p>
        </div>

        {/* ===== MONATS-BONUS ===== */}
        <div>
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            Monats-Bonus
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
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,159,67,0.12)' }}
                >
                  <Calendar className="w-5 h-5" style={{ color: '#FF9F43' }} strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                    +{monthlyBonus.credits} Credits
                    {monthlyBonus.isPartial && (
                      <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/45 ml-1.5">
                        (anteilig)
                      </span>
                    )}
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">
                    Auszahlung am {formatPayoutDate(monthlyBonus.payoutDate)}
                  </p>
                </div>
              </div>
              <span
                className="font-['Poppins:SemiBold',sans-serif] text-[11px] flex-shrink-0 px-2 py-0.5 rounded-full"
                style={{
                  color: '#FF9F43',
                  background: 'rgba(255,159,67,0.10)',
                  border: '1px solid rgba(255,159,67,0.25)',
                }}
              >
                noch {daysUntilPayout} {daysUntilPayout === 1 ? 'Tag' : 'Tage'}
              </span>
            </div>

            {/* Fortschritt diesen Monat */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">
                  Tage im Streak diesen Monat
                </span>
                <span className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/70">
                  {monthlyBonus.daysInStreakThisMonth} / {monthlyBonus.totalDaysThisMonth}
                </span>
              </div>
              <div className="w-full h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(Math.max(monthProgress, 0), 100)}%`,
                    background: 'linear-gradient(to right, #FF9F43, #FFB84D)',
                  }}
                />
              </div>
            </div>

            {/* Einführungs-Text mit Uhr-Icon — unter Progress-Bar */}
            <div
              className="flex items-start gap-2 pt-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Clock className="w-3.5 h-3.5 text-white/30 flex-shrink-0 mt-0.5" />
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/50 leading-[15px]">
                Für jeden Monat, den du komplett im Streak bleibst, bekommst du am 01. des Folgemonats <span className="text-white/75 font-['Poppins:Medium',sans-serif]">+50 Credits × Multiplier</span>.
              </p>
            </div>
          </div>
        </div>

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
              <div className="flex items-center gap-1">
                {Array.from({ length: MAX_STREAK_FREEZES }).map((_, i) => {
                  const isAvailable = i < STREAK_FREEZES_AVAILABLE;
                  return (
                    <Snowflake
                      key={i}
                      className="w-4 h-4"
                      style={{
                        color: isAvailable ? '#4A9EFF' : 'rgba(255,255,255,0.15)',
                        filter: isAvailable ? 'drop-shadow(0 0 4px rgba(74,158,255,0.4))' : undefined,
                      }}
                      strokeWidth={2}
                    />
                  );
                })}
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

            {/* Kauf-Button — nur aktiv wenn unter MAX */}
            {(() => {
              const atMax = STREAK_FREEZES_AVAILABLE >= MAX_STREAK_FREEZES;
              return (
                <button
                  disabled={atMax}
                  className="w-full mt-3 h-[40px] rounded-xl font-['Poppins:SemiBold',sans-serif] text-[13px] transition-all active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-1.5"
                  style={{
                    background: atMax ? 'rgba(255,255,255,0.04)' : 'rgba(74,158,255,0.12)',
                    border: `1px solid ${atMax ? 'rgba(255,255,255,0.06)' : 'rgba(74,158,255,0.25)'}`,
                    color: atMax ? 'rgba(255,255,255,0.35)' : '#4A9EFF',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {atMax ? (
                    <>Maximum erreicht</>
                  ) : (
                    <>
                      <Snowflake className="w-4 h-4" strokeWidth={2.2} />
                      Freeze aufladen · {FREEZE_PURCHASE_COST} Credits
                    </>
                  )}
                </button>
              );
            })()}
          </div>
        </div>

        {/* ===== MEILENSTEINE (inkl. Nächste Belohnung Fortschritt) ===== */}
        <div>
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            Meilensteine
          </h3>

          {/* Nächste Belohnung — Info-Card */}
          {nextMilestone && (
            <div
              className="rounded-2xl p-4 mb-3"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,159,67,0.12)' }}
                  >
                    <Gift className="w-5 h-5" style={{ color: '#FF9F43' }} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/50 leading-tight">
                      Nächste Belohnung
                    </p>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white leading-tight mt-0.5">
                      +{nextMilestone.credits} Credits
                    </p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 mt-0.5">
                      {nextMilestone.days} Tage{nextMilestone.label ? ` · ${nextMilestone.label}` : ''}
                    </p>
                  </div>
                </div>
                <span
                  className="font-['Poppins:SemiBold',sans-serif] text-[11px] flex-shrink-0 px-2 py-0.5 rounded-full"
                  style={{
                    color: '#FF9F43',
                    background: 'rgba(255,159,67,0.10)',
                    border: '1px solid rgba(255,159,67,0.25)',
                  }}
                >
                  noch {daysToNext} {daysToNext === 1 ? 'Tag' : 'Tage'}
                </span>
              </div>
            </div>
          )}

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
              · Dein Multiplier erhöht deinen monatlichen Bonus — je länger der Streak, desto höher
            </li>
            <li className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/55 leading-[17px]">
              · Für jeden vollständigen Monat im Streak gibt's Bonus-Credits (+50 × Multiplier) am 01. des Folgemonats
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
