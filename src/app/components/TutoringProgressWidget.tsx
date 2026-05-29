// ===== TUTORING PROGRESS WIDGET =====
// Compact widget for the Home Screen showing tutoring progress at a glance.
// Only shown when tutoring is activated. Tapping opens the full Progress screen.
// NEW: Shows streak, teacher tasks count, pre-session warm-up indicator.

import React from 'react';
import {
  Sparkles, ChevronRight, AlertTriangle, Target,
  Calendar, TrendingUp, BookOpen, Zap, ArrowUpRight, ArrowDownRight, Minus,
} from 'lucide-react';
import {
  MOCK_SESSIONS,
  MOCK_OVERALL_STATS,
  MOCK_KNOWLEDGE_GAPS,
  MOCK_ACTIVE_WEAKNESSES,
  MOCK_RESOLVED_WEAKNESSES_COUNT,
} from '@/mocks/tutoringProgress.mock';
import { APP_NOW } from '@/mocks/extraSessions.mock';
import { useTeacherTasks } from '@/hooks/useTeacherTasks';

interface TutoringProgressWidgetProps {
  onOpenProgress?: () => void;
}

export default React.memo(function TutoringProgressWidget({ onOpenProgress }: TutoringProgressWidgetProps) {
  const stats = MOCK_OVERALL_STATS;
  const topWeaknesses = MOCK_SESSIONS.flatMap(s => s.weaknesses).filter(w => w.severity === 'high').slice(0, 2);
  const criticalGaps = MOCK_KNOWLEDGE_GAPS.filter(g => g.severity === 'critical').length;
  const activeWeaknesses = MOCK_ACTIVE_WEAKNESSES.filter(w => w.isActive);
  const resolvedCount = MOCK_RESOLVED_WEAKNESSES_COUNT;
  const teacherTasks = useTeacherTasks();
  const pendingTeacherTasks = teacherTasks.filter(t => t.status !== 'completed').length;

  // Pre-session warm-up check (session within 30 min) — anchored to APP_NOW
  // so the widget's "coming soon" state stays deterministic in the prototype.
  const now = APP_NOW;
  const nextSession = new Date(stats.nextSessionDate);
  const minutesUntilSession = Math.floor((nextSession.getTime() - now.getTime()) / (1000 * 60));
  const warmUpAvailable = minutesUntilSession > 0 && minutesUntilSession <= 30;

  // Confidence color
  const confColor = stats.averageConfidence >= 70 ? '#00D4AA' : stats.averageConfidence >= 45 ? '#FFB84D' : '#FF6B6B';

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">
            Nachhilfe-Fortschritt
          </p>
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
            style={{ background: 'rgba(0,184,148,0.08)', border: '1px solid rgba(0,184,148,0.12)' }}
          >
            <Sparkles className="w-2.5 h-2.5" style={{ color: '#00B894' }} />
            <span className="font-['Poppins:Medium',sans-serif] text-[9px]" style={{ color: '#00B894' }}>
              AI
            </span>
          </div>
        </div>
        <button onClick={onOpenProgress} className="flex items-center gap-0.5">
          <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">Details</p>
          <ChevronRight className="w-3.5 h-3.5 text-white/50" />
        </button>
      </div>

      {/* Main Widget Card */}
      <button
        onClick={onOpenProgress}
        className="w-full rounded-2xl overflow-hidden text-left transition-all duration-200 active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* Top Row: Confidence + Stats */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            {/* Confidence Circle */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                  <circle
                    cx="24" cy="24" r="20" fill="none"
                    stroke={confColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(stats.averageConfidence / 100) * 125.6} 125.6`}
                    style={{ opacity: 0.7 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[13px]" style={{ color: confColor }}>
                    {stats.averageConfidence}%
                  </span>
                </div>
              </div>
              <div>
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/75 leading-[17px]">
                  Gesamtsicherheit
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 leading-[14px]">
                  {stats.totalSessions} Sitzungen · {stats.totalHours.toFixed(1)}h
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#FF6B8A] leading-[20px]">
                  {topWeaknesses.length + criticalGaps}
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/25">
                  Schwächen
                </p>
              </div>
              <div className="w-px h-7 bg-white/[0.06]" />
              <div className="text-center">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#4ADE80] leading-[20px]">
                  {resolvedCount}
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/25">
                  Behoben
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/[0.04]" />

        {/* Bottom Row: AI Insight + Next Session */}
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Teacher Tasks Info */}
          {pendingTeacherTasks > 0 ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(74,158,255,0.08)' }}
              >
                <BookOpen className="w-3.5 h-3.5" style={{ color: '#4A9EFF' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50 leading-[14px] truncate">
                  {pendingTeacherTasks} neue Aufgaben
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/25 leading-[12px]">
                  vom Lehrer
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,184,148,0.08)' }}
              >
                <TrendingUp className="w-3.5 h-3.5" style={{ color: '#00D4AA' }} />
              </div>
              <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50 leading-[14px]">
                Keine offenen Aufgaben
              </p>
            </div>
          )}

          {/* Next Session / Warm-Up */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {warmUpAvailable ? (
              <>
                <Zap className="w-3.5 h-3.5" style={{ color: '#00D4AA' }} />
                <div>
                  <p className="font-['Poppins:Medium',sans-serif] text-[10px] leading-[13px]" style={{ color: '#00D4AA' }}>
                    Warm-Up bereit
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/30 leading-[12px]">
                    In {minutesUntilSession} Min
                  </p>
                </div>
              </>
            ) : (
              <>
                <Calendar className="w-3.5 h-3.5 text-white/25" />
                <div>
                  <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/40 leading-[13px]">
                    Nächste Sitzung
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[9px] leading-[12px]" style={{ color: '#4A9EFF' }}>
                    {formatRelative(stats.nextSessionDate)}
                  </p>
                </div>
              </>
            )}
          </div>

          <ChevronRight className="w-4 h-4 text-white/15 flex-shrink-0" />
        </div>
      </button>
    </div>
  );
});

// Helper — uses APP_NOW (mock universe anchor) for deterministic labels
function formatRelative(iso: string): string {
  const d = new Date(iso);
  const today = new Date(APP_NOW.getFullYear(), APP_NOW.getMonth(), APP_NOW.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Heute';
  if (diff === 1) return 'Morgen';
  if (diff === 2) return 'Übermorgen';
  if (diff > 0 && diff < 7) return `In ${diff} Tagen`;
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}