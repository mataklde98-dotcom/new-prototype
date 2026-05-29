// ===== TUTORING PROGRESS SCREEN =====
// Redesigned based on nachhilfe-overview-redesign.md:
// - Bevorstehende Sitzungen (unchanged)
// - Sitzungsverlauf (2 latest + "Alle anzeigen" → Slide sub-view with filters)
// - Aufgaben vom Lehrer (central task hub with Offen/Erledigt toggle)
// - Erkannte Schwächen (all sessions combined, 2 + "Alle anzeigen")
// - KI-Wissenslücken (root causes, 2 + "Alle anzeigen")
// - Nachhilfe-Insights (KPI metrics + KI-Analyse)
// - Erinnerungen (streak + reminders)
//
// Removed: Themenübersicht, Lernplan bis zur nächsten Sitzung, Credit displays
// Navigation: Slide-Pattern (GPU-optimized CSS transitions)

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, Brain, Calendar, Clock, ChevronRight, ChevronDown, Sparkles,
  TrendingUp, AlertTriangle, CheckCircle2,
  Layers, ClipboardCheck, BookOpen, Target, Zap, Flame,
  GraduationCap, Send, Edit3, Trash2,
  RotateCcw, Play, Check,
  CalendarRange, X as XIcon, ChevronLeft, Search,
} from 'lucide-react';
// Replaced recharts with custom SVG chart to fix null-key warning
import PremiumCalendarPicker from './PremiumCalendarPicker';
import {
  MOCK_SESSIONS,
  MOCK_KNOWLEDGE_GAPS,
  MOCK_OVERALL_STATS,
  MOCK_MASTERY_MAP,
  MOCK_WARMUP,
  MOCK_UPCOMING_SESSIONS,
  MOCK_ACTIVE_WEAKNESSES,
  MOCK_RESOLVED_WEAKNESSES_COUNT,
  type TutoringSession,
  type TeacherAssignedTask,
  type TopicMasteryItem,
  type WarmUpQuestion,
  type UpcomingSession,
  type ActiveWeakness,
} from '@/mocks/tutoringProgress.mock';
import { APP_NOW } from '@/mocks/extraSessions.mock';
import { useTeacherTasks } from '@/hooks/useTeacherTasks';
import GlobalWeaknessActionButtons from './WeaknessActionButtons';
import type { FlashcardSet } from '@/types/flashcard';

// ===================================================================
// TYPES
// ===================================================================

interface TutoringProgressScreenProps {
  onClose: () => void;
  onOpenSessionDetail?: (sessionId: string) => void;
  onGenerateForWeakness?: (context: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'recommendation'; cardCount?: number; assignedDate?: string; teacherTaskId?: string; contextLabel?: string; notificationLabel?: string }) => void;
  onStartExamForWeakness?: (context: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'recommendation'; examDurationMinutes?: number; assignedDate?: string; teacherTaskId?: string; contextLabel?: string; notificationLabel?: string }) => void;
  onOpenLinkedFlashcardSet?: (linkedSetId: string) => void;
  allSets?: FlashcardSet[];
  externalTransition?: boolean;
  isEmpty?: boolean;
}

type SubView = 'overview' | 'allSessions' | 'allWeaknesses' | 'allKnowledgeGaps' | 'allTasks';

// Unified weakness/gap item for merged section
interface UnifiedWeaknessItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  subjectColor: string;
  severity: 'critical' | 'medium' | 'minor';
  type: 'weakness' | 'knowledge-gap';
  source?: 'tutoring' | 'self-learning' | 'both';
  score: number;
}

// ===================================================================
// HELPERS
// ===================================================================

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} Min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}Min` : `${h}h`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date(APP_NOW.getFullYear(), APP_NOW.getMonth(), APP_NOW.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Heute';
  if (diff === 1) return 'Morgen';
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
}

const p = (weight: string) => `font-['Poppins:${weight}',sans-serif]`;

// ===================================================================
// REUSABLE SUB-COMPONENTS
// ===================================================================

function GlassCard({ children, className = '', style, onClick }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`w-full rounded-2xl overflow-hidden text-left ${onClick ? 'transition-all duration-200 active:scale-[0.98]' : ''} ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

function SectionTitle({ children, icon, badge, action }: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h3 className={`${p('SemiBold')} text-[15px] text-white flex-1`}>{children}</h3>
      {badge}
      {action}
    </div>
  );
}

function SectionExplainer({ text }: { text: string }) {
  return (
    <p className={`${p('Regular')} text-[11px] text-white/30 -mt-2 mb-3`}>
      {text}
    </p>
  );
}

function AIBadge() {
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-md"
      style={{ background: 'rgba(0,184,148,0.08)', border: '1px solid rgba(0,184,148,0.12)' }}
    >
      <Sparkles className="w-2.5 h-2.5" style={{ color: '#00B894' }} />
      <span className={`${p('Medium')} text-[9px]`} style={{ color: '#00B894' }}>AI-Analyse</span>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: 'critical' | 'medium' | 'minor' }) {
  const config = {
    critical: { label: 'Kritisch', color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.18)' },
    medium: { label: 'Mittel', color: '#FFB84D', bg: 'rgba(255,184,77,0.08)', border: 'rgba(255,184,77,0.18)' },
    minor: { label: 'Gering', color: 'rgba(255,255,255,0.45)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.10)' },
  }[severity];
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-md"
      style={{ background: config.bg, border: `1px solid ${config.border}` }}
    >
      <span className={`${p('Medium')} text-[9px]`} style={{ color: config.color }}>{config.label}</span>
    </div>
  );
}

function FachBadge({ subject, color }: { subject: string; color: string }) {
  return (
    <span
      className={`${p('SemiBold')} text-[9px] px-1.5 py-0.5 rounded flex-shrink-0`}
      style={{ color, background: `${color}15`, border: `1px solid ${color}25` }}
    >
      {subject}
    </span>
  );
}

// Extract clean topic name from task title (remove type prefixes like "15 Karteikarten:", "Mini-Prüfung:", etc.)
function cleanTaskTitle(title: string): string {
  // Remove patterns like "15 Karteikarten: ", "Mini-Prüfung: ", "Prüfungssimulation: "
  return title.replace(/^\d+\s+Karteikarten:\s*/i, '')
    .replace(/^Mini-Prüfung:\s*/i, '')
    .replace(/^Prüfungssimulation:\s*/i, '')
    .replace(/^Prüfung:\s*/i, '');
}

// Grade color coding: green for 1-2, yellow for 3, red for 4-6
function gradeColor(grade: string): string {
  const num = parseFloat(grade.replace(/[^0-9.]/g, ''));
  if (num <= 2.5) return '#00D4AA';
  if (num <= 3.5) return '#FFB84D';
  return '#FF6B6B';
}

function TaskStatusBadge({ status, taskType }: { status: 'new' | 'started' | 'completed'; taskType: 'flashcards' | 'exam' }) {
  // Exams can only be 'new' or 'completed' (no 'started')
  const effectiveStatus = taskType === 'exam' && status === 'started' ? 'new' : status;
  const config = {
    new: { label: 'Neu', color: '#4A9EFF', bg: 'rgba(74,158,255,0.10)' },
    started: { label: 'Begonnen', color: '#FFB84D', bg: 'rgba(255,184,77,0.10)' },
    completed: { label: 'Erledigt', color: '#00D4AA', bg: 'rgba(0,212,170,0.10)' },
  }[effectiveStatus];
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: config.bg, border: `1px solid ${config.color}25` }}>
      {effectiveStatus === 'completed' && <CheckCircle2 className="w-2.5 h-2.5" style={{ color: config.color }} />}
      <span className={`${p('SemiBold')} text-[9px]`} style={{ color: config.color }}>{config.label}</span>
    </div>
  );
}

function WeaknessActionButtons({ item, onGenerateForWeakness, onStartExamForWeakness, onOpenLinkedFlashcardSet, sourceOverride, allSets }: {
  item: { title: string; subject: string; severity: string; description: string };
  onGenerateForWeakness?: (ctx: any) => void;
  onStartExamForWeakness?: (ctx: any) => void;
  onOpenLinkedFlashcardSet?: (setId: string) => void;
  sourceOverride?: 'weakness' | 'risk' | 'knowledge-gap' | 'recommendation';
  allSets?: FlashcardSet[];
}) {
  const effectiveSource = (sourceOverride || 'weakness') as 'weakness' | 'risk' | 'knowledge-gap' | 'recommendation';
  return (
    <GlobalWeaknessActionButtons
      source={effectiveSource}
      subject={item.subject}
      topic={item.title}
      severity={String(item.severity)}
      recommendation={item.description}
      onGenerate={(ctx) => onGenerateForWeakness?.(ctx)}
      onStartExam={(ctx) => onStartExamForWeakness?.(ctx)}
      onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
      allSets={allSets}
      className="mt-2.5"
    />
  );
}

function ShowMoreButton({ label, count, onClick }: { label: string; count?: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-[14px] h-[44px] flex items-center justify-center gap-2 border border-white/[0.08] active:scale-[0.98] transition-all duration-200 mt-2`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className={`${p('Medium')} text-[12px] text-white/70`}>
        {count !== undefined ? `${label} (${count})` : label}
      </span>
      <ChevronRight className="w-3.5 h-3.5 text-white/70" />
    </button>
  );
}

function SubViewHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex-shrink-0 px-5 pt-6 pb-4 flex items-center gap-3">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <ArrowLeft className="w-5 h-5 text-white/70" />
      </button>
      <h1 className={`${p('SemiBold')} text-[18px] text-white flex-1`}>{title}</h1>
    </div>
  );
}

// ===================================================================
// MAIN COMPONENT
// ===================================================================

export default function TutoringProgressScreen({
  onClose,
  onOpenSessionDetail,
  onGenerateForWeakness,
  onStartExamForWeakness,
  onOpenLinkedFlashcardSet,
  allSets,
  externalTransition = false,
  isEmpty = false,
}: TutoringProgressScreenProps) {
  const stats = MOCK_OVERALL_STATS;
  const sessions = MOCK_SESSIONS;
  const knowledgeGaps = MOCK_KNOWLEDGE_GAPS;
  const teacherTasks = useTeacherTasks();
  // masteryMap removed – Themenübersicht was removed
  const warmupQuestions = MOCK_WARMUP;
  // Use APP_NOW (mock universe anchor) so the "Bevorstehende Sitzungen" list
  // stays populated regardless of real-world clock drift. Real-time filtering
  // caused the list to go empty as the real clock advanced past the mocks.
  const upcomingSessions = React.useMemo(() => {
    const todayStart = new Date(APP_NOW.getFullYear(), APP_NOW.getMonth(), APP_NOW.getDate());
    return MOCK_UPCOMING_SESSIONS
      .filter(s => new Date(s.date) >= todayStart)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);
  const activeWeaknesses = MOCK_ACTIVE_WEAKNESSES;
  const resolvedCount = MOCK_RESOLVED_WEAKNESSES_COUNT;

  // ── Sub-view navigation (Slide pattern) ──
  const [subView, setSubView] = useState<SubView>('overview');
  // selectedSubject removed – Themenübersicht was removed
  const [sessionFilter, setSessionFilter] = useState<'7days' | '30days' | 'custom'>('7days');
  const [sessionSubjectFilter, setSessionSubjectFilter] = useState<string | null>(null);
  // gapSubjectFilter removed – merged into unified weakness filters
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRangeFrom, setDateRangeFrom] = useState<string>('');
  const [dateRangeTo, setDateRangeTo] = useState<string>('');
  // pickerMonth & pickerSelecting removed – handled by PremiumCalendarPicker

  // ── Upcoming sessions state ──
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const INITIAL_UPCOMING_COUNT = 2;

  const [sessionTopicRequests, setSessionTopicRequests] = useState<Record<string, { draft: string; saved: string; editing: boolean }>>(() => {
    const initial: Record<string, { draft: string; saved: string; editing: boolean }> = {};
    upcomingSessions.forEach(s => {
      initial[s.id] = { draft: s.topicRequest || '', saved: s.topicRequest || '', editing: false };
    });
    return initial;
  });

  const updateTopicRequest = (sessionId: string, updates: Partial<{ draft: string; saved: string; editing: boolean }>) => {
    setSessionTopicRequests(prev => ({
      ...prev,
      [sessionId]: { ...prev[sessionId], ...updates },
    }));
  };

  // ── Pre-session warm-up ──
  const now = new Date();
  const nextSession = new Date(stats.nextSessionDate);
  const minutesUntilSession = Math.floor((nextSession.getTime() - now.getTime()) / (1000 * 60));
  const showWarmUp = minutesUntilSession > 0 && minutesUntilSession <= 30;
  const [warmUpOpen, setWarmUpOpen] = useState(false);
  const [warmUpAnswered, setWarmUpAnswered] = useState<Set<string>>(new Set());

  // Study plan state removed – Lernplan section was removed

  // ── Teacher tasks ──
  const [taskTab, setTaskTab] = useState<'open' | 'done'>('open');
  const [taskSubjectFilter, setTaskSubjectFilter] = useState<string | null>(null);

  // ── Nachhilfe-Insights ──
  const [insightsRange, setInsightsRange] = useState<'7' | '30' | '90' | 'all'>('30');
  const openTasks = useMemo(() => teacherTasks.filter(t => t.status !== 'completed'), [teacherTasks]);
  const completedTasks = useMemo(() => teacherTasks.filter(t => t.status === 'completed'), [teacherTasks]);
  const completedTasksCount = completedTasks.length;

  // subjectSummaries removed – Themenübersicht was removed

  // ── Filtered sessions for "All Sessions" sub-view ──
  const filteredSessions = useMemo(() => {
    let filtered = [...sessions];
    if (sessionSubjectFilter) {
      filtered = filtered.filter(s => s.subject === sessionSubjectFilter);
    }
    if (sessionFilter === '7days') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      filtered = filtered.filter(s => new Date(s.date) >= cutoff);
    } else if (sessionFilter === '30days') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      filtered = filtered.filter(s => new Date(s.date) >= cutoff);
    } else if (sessionFilter === 'custom' && dateRangeFrom && dateRangeTo) {
      const from = new Date(dateRangeFrom + 'T00:00:00');
      const to = new Date(dateRangeTo + 'T23:59:59');
      filtered = filtered.filter(s => {
        const d = new Date(s.date);
        return d >= from && d <= to;
      });
    }
    return filtered;
  }, [sessions, sessionFilter, sessionSubjectFilter, dateRangeFrom, dateRangeTo]);

  // subjectTopics removed – Themenübersicht was removed

  // Unique subjects from sessions
  const uniqueSubjects = useMemo(() => [...new Set(sessions.map(s => s.subject))], [sessions]);

  // ── Separate: Observed weaknesses vs KI knowledge gaps ──
  const severityOrder: Record<string, number> = { critical: 0, medium: 1, minor: 2 };

  const observedWeaknesses = useMemo<UnifiedWeaknessItem[]>(() => {
    return activeWeaknesses
      .filter(w => w.isActive)
      .map(w => ({
        id: w.id,
        title: w.title,
        description: w.description,
        subject: w.subject,
        subjectColor: w.subjectColor,
        severity: w.severity,
        type: 'weakness' as const,
        source: w.source,
        score: w.score,
      }))
      .sort((a, b) => (severityOrder[a.severity] ?? 2) - (severityOrder[b.severity] ?? 2));
  }, [activeWeaknesses]);

  const subjectColorMap: Record<string, string> = {
    Mathematik: '#4A9EFF', Englisch: '#FF6B8A', Biologie: '#00D4AA', Chemie: '#FF8C00',
  };

  const kiKnowledgeGaps = useMemo<UnifiedWeaknessItem[]>(() => {
    return knowledgeGaps.map(g => ({
      id: g.id,
      title: g.title,
      description: g.description,
      subject: g.subject,
      subjectColor: subjectColorMap[g.subject] || '#7B61FF',
      severity: g.severity,
      type: 'knowledge-gap' as const,
      score: g.score,
    }))
    .sort((a, b) => (severityOrder[a.severity] ?? 2) - (severityOrder[b.severity] ?? 2));
  }, [knowledgeGaps]);

  // Filter state for sub-views
  const [weaknessSubjectFilter, setWeaknessSubjectFilter] = useState<string | null>(null);
  const [weaknessSeverityFilter, setWeaknessSeverityFilter] = useState<'critical' | 'medium' | 'minor' | null>(null);
  const [gapSubjectFilter, setGapSubjectFilter] = useState<string | null>(null);
  const [gapSeverityFilter, setGapSeverityFilter] = useState<'critical' | 'medium' | 'minor' | null>(null);

  const uniqueWeaknessSubjects = useMemo(() => [...new Set(observedWeaknesses.map(w => w.subject))], [observedWeaknesses]);
  const uniqueGapSubjects = useMemo(() => [...new Set(kiKnowledgeGaps.map(g => g.subject))], [kiKnowledgeGaps]);

  // Scroll only horizontally within the filter container (no vertical page jump)
  const scrollChipCenter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const container = btn.parentElement;
    if (!container) return;
    requestAnimationFrame(() => {
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft = container.scrollLeft + (btnRect.left + btnRect.width / 2) - (containerRect.left + containerRect.width / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    });
  };

  const filteredWeaknesses = useMemo(() => {
    let result = observedWeaknesses;
    if (weaknessSubjectFilter) result = result.filter(w => w.subject === weaknessSubjectFilter);
    if (weaknessSeverityFilter) result = result.filter(w => w.severity === weaknessSeverityFilter);
    return result;
  }, [observedWeaknesses, weaknessSubjectFilter, weaknessSeverityFilter]);

  const filteredKnowledgeGaps = useMemo(() => {
    let result = kiKnowledgeGaps;
    if (gapSubjectFilter) result = result.filter(g => g.subject === gapSubjectFilter);
    if (gapSeverityFilter) result = result.filter(g => g.severity === gapSeverityFilter);
    return result;
  }, [kiKnowledgeGaps, gapSubjectFilter, gapSeverityFilter]);

  const INITIAL_WEAKNESS_COUNT = 2;
  const INITIAL_GAP_COUNT = 2;

  // ===================================================================
  // SLIDE TRANSITION WRAPPER
  // ===================================================================
  const slideTransitionStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    transition: 'transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)',
    willChange: 'transform, opacity',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
  };

  const isOverview = subView === 'overview';

  // ===================================================================
  // RENDER: Upcoming Session Card (shared between initial + expanded)
  // ===================================================================
  const renderUpcomingCard = (us: UpcomingSession, isFirst: boolean) => {
    const isExpanded = expandedSessionId === us.id;
    const reqState = sessionTopicRequests[us.id] || { draft: '', saved: '', editing: false };
    const hasSavedRequest = !!reqState.saved;

    return (
      <div
        key={us.id}
        className="w-full rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: isExpanded
            ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          border: isExpanded ? `1px solid ${us.subjectColor}30` : '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button
          onClick={() => setExpandedSessionId(isExpanded ? null : us.id)}
          className="w-full text-left"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="flex items-center gap-3 p-3.5">
            <div className="w-1 h-10 rounded-full flex-shrink-0 self-center" style={{ backgroundColor: us.subjectColor }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`${p('SemiBold')} text-[13px] text-white`}>{us.subject}</span>
                {isFirst && (
                  <span className={`${p('SemiBold')} text-[8px] px-1.5 py-px rounded-full`} style={{ color: '#00D4AA', background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.20)' }}>Als Nächstes</span>
                )}
                {hasSavedRequest && !isExpanded && <Send className="w-3 h-3 flex-shrink-0" style={{ color: '#00D4AA', opacity: 0.6 }} />}
              </div>
              <span className={`${p('Regular')} text-[11px] text-white/40 truncate block`}>{us.teacherName} · {us.topic}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                <span className={`${p('SemiBold')} text-[12px] block`} style={{ color: formatDayLabel(us.date) === 'Heute' ? '#00D4AA' : 'rgba(255,255,255,0.6)' }}>{formatDayLabel(us.date)}</span>
                <span className={`${p('Regular')} text-[10px] text-white/25 block`}>{formatTime(us.date)} Uhr</span>
              </div>
              <ChevronDown className="w-4 h-4 text-white/20 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </div>
          </div>
        </button>
        {/* Expandable content */}
        <div className="overflow-hidden transition-all duration-300 ease-out" style={{ maxHeight: isExpanded ? '280px' : '0px', opacity: isExpanded ? 1 : 0 }}>
          <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="pt-3.5">
              <p className={`${p('Regular')} text-[10px] text-white/30 mb-2.5 leading-relaxed`}>
                Dein Lehrer bereitet sich anhand deiner erfassten Lerndaten auf die Sitzung vor. Du kannst optional ein Wunschthema eingeben.
              </p>
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-3.5 h-3.5 text-white/40" />
                <span className={`${p('SemiBold')} text-[12px] text-white/70`}>Wunschthema für diese Sitzung</span>
              </div>
              {hasSavedRequest && !reqState.editing ? (
                <div className="px-3 py-2.5 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className={`${p('Medium')} text-[12px] text-white/70 flex-1`}>{reqState.saved}</span>
                  <div className="flex items-center gap-1.5 ml-2">
                    <button onClick={(e) => { e.stopPropagation(); updateTopicRequest(us.id, { editing: true }); }} className="w-7 h-7 rounded-lg flex items-center justify-center active:bg-white/[0.05]">
                      <Edit3 className="w-3.5 h-3.5 text-white/30" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); updateTopicRequest(us.id, { saved: '', draft: '' }); }} className="w-7 h-7 rounded-lg flex items-center justify-center active:bg-white/[0.05]">
                      <Trash2 className="w-3.5 h-3.5 text-white/20" />
                    </button>
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  value={reqState.draft}
                  onChange={(e) => updateTopicRequest(us.id, { draft: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="z.B. Bruchrechnung, Klassenarbeit..."
                  className={`w-full px-3 py-2.5 rounded-xl ${p('Regular')} text-[12px] text-white/80 placeholder-white/20 outline-none`}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              )}
              {hasSavedRequest && !reqState.editing ? (
                <div className="flex items-center gap-2 mt-2.5">
                  <CheckCircle2 className="w-3 h-3" style={{ color: '#00D4AA' }} />
                  <span className={`${p('Medium')} text-[10px]`} style={{ color: '#00D4AA' }}>Gespeicherter Wunsch</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); if (reqState.draft.trim()) updateTopicRequest(us.id, { saved: reqState.draft.trim(), editing: false }); }}
                    disabled={!reqState.draft.trim()}
                    className={`${p('SemiBold')} text-[11px] px-3.5 py-1.5 rounded-xl transition-all active:scale-[0.97] disabled:opacity-30`}
                    style={{ background: 'rgba(0,184,148,0.07)', border: '1px solid rgba(0,184,148,0.25)', color: 'rgba(255,255,255,0.9)' }}
                  >
                    Wunsch speichern
                  </button>
                  {reqState.editing && (
                    <button onClick={(e) => { e.stopPropagation(); updateTopicRequest(us.id, { editing: false, draft: reqState.saved }); }} className={`${p('Medium')} text-[11px] px-3 py-1.5 text-white/30`}>Abbrechen</button>
                  )}
                </div>
              )}
              <p className={`${p('Regular')} text-[10px] text-white/20 mt-2`}>Optional – du kannst jederzeit ändern</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ===================================================================
  // RENDER: OVERVIEW (main scrollable feed)
  // ===================================================================
  const renderOverview = () => (
    <div
      style={{
        ...slideTransitionStyle,
        transform: isOverview ? 'translateX(0)' : 'translateX(-30%)',
        opacity: isOverview ? 1 : 0,
        pointerEvents: isOverview ? 'auto' : 'none',
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>
        <div className="flex-1">
          <h1 className={`${p('SemiBold')} text-[18px] text-white`}>Nachhilfe-Fortschritt</h1>
        </div>
        <AIBadge />
      </div>

      {/* Scrollable Content */}
      <div
        className="overflow-y-auto px-5 pb-12 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch', height: 'calc(100% - 76px)' }}
      >
        <div className="space-y-6">

          {/* ========== SECTION 0: Pre-Session Warm-Up Banner ========== */}
          {showWarmUp && (
            <GlassCard
              style={{
                background: 'linear-gradient(135deg, rgba(0,184,148,0.10) 0%, rgba(74,158,255,0.08) 100%)',
                border: '1px solid rgba(0,184,148,0.20)',
              }}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4" style={{ color: '#00D4AA' }} />
                  <span className={`${p('SemiBold')} text-[13px]`} style={{ color: '#00D4AA' }}>Warm-Up bereit</span>
                </div>
                <p className={`${p('Regular')} text-[12px] text-white/60 mb-3`}>
                  Deine Sitzung mit {stats.nextSessionTeacher}
                </p>
                {!warmUpOpen ? (
                  <button
                    onClick={() => setWarmUpOpen(true)}
                    className={`${p('SemiBold')} text-[12px] px-4 py-2 rounded-xl transition-all active:scale-[0.97]`}
                    style={{ background: 'rgba(0,184,148,0.07)', border: '1px solid rgba(0,184,148,0.25)', color: 'rgba(255,255,255,0.9)' }}
                  >
                    Aufwärmfragen starten
                  </button>
                ) : (
                  <div className="space-y-2.5 mt-2">
                    {warmupQuestions.map((q, idx) => {
                      const answered = warmUpAnswered.has(q.id);
                      return (
                        <div key={q.id} className="flex items-start gap-3">
                          <button
                            onClick={() => {
                              const next = new Set(warmUpAnswered);
                              if (answered) next.delete(q.id); else next.add(q.id);
                              setWarmUpAnswered(next);
                            }}
                            className="w-5 h-5 rounded-md flex-shrink-0 mt-0.5 flex items-center justify-center"
                            style={{
                              background: answered ? 'rgba(0,184,148,0.15)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${answered ? 'rgba(0,184,148,0.40)' : 'rgba(255,255,255,0.10)'}`,
                            }}
                          >
                            {answered && <Check className="w-3 h-3" style={{ color: '#00D4AA' }} />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`${p('Medium')} text-[12px] ${answered ? 'text-white/30 line-through' : 'text-white/80'}`}>
                              {idx + 1}. {q.question}
                            </p>
                            <p className={`${p('Regular')} text-[10px] text-white/25`}>{q.topic}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {/* ========== SECTION 1: Upcoming Sessions ========== */}
          <div>
            <SectionTitle icon={<Calendar className="w-4 h-4 text-white/50" />}>
              Bevorstehende Sitzungen
            </SectionTitle>
            <div>
              <div className="space-y-2">
                {upcomingSessions.slice(0, INITIAL_UPCOMING_COUNT).map((us, idx) => renderUpcomingCard(us, idx === 0))}
              </div>
              {upcomingSessions.length > INITIAL_UPCOMING_COUNT && (
                <>
                  <motion.div
                    initial={false}
                    animate={{ height: showAllUpcoming ? 'auto' : 0, opacity: showAllUpcoming ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                    className="overflow-hidden"
                    style={{ willChange: 'height, opacity', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                  >
                    <div className="space-y-2 mt-2">
                      {upcomingSessions.slice(INITIAL_UPCOMING_COUNT).map((us) => renderUpcomingCard(us, false))}
                    </div>
                  </motion.div>
                  <button
                    onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                    className="relative w-full bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-[14px] h-[44px] flex items-center justify-center gap-2 border border-white/[0.08] active:scale-[0.98] transition-all duration-200 mt-2"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <span className={`${p('Medium')} text-[12px] text-white/70`}>
                      {showAllUpcoming ? 'Weniger anzeigen' : `Mehr anzeigen (${upcomingSessions.length - INITIAL_UPCOMING_COUNT})`}
                    </span>
                    <motion.div animate={{ rotate: showAllUpcoming ? 180 : 0 }} transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}>
                      <ChevronDown className="w-3.5 h-3.5 text-white/70" />
                    </motion.div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ========== SECTION 2: Sitzungsverlauf (3 latest + "Alle anzeigen") ========== */}
          <div>
            <SectionTitle icon={<Clock className="w-4 h-4 text-white/50" />}>
              Sitzungsverlauf
            </SectionTitle>

            <div className="space-y-2">
              {sessions.slice(0, 2).map(session => (
                <GlassCard key={session.id} onClick={() => onOpenSessionDetail?.(session.id)}>
                  <div className="flex">
                    <div className="w-1 flex-shrink-0 rounded-l-2xl" style={{ backgroundColor: session.subjectColor }} />
                    <div className="flex-1 p-3.5 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`${p('SemiBold')} text-[13px] text-white`}>{session.subject}</span>
                        </div>
                        <span className={`${p('Regular')} text-[11px] text-white/50 block`}>{session.mainTopic}</span>
                        <span className={`${p('Regular')} text-[10px] text-white/25 block`}>
                          {formatShortDate(session.date)} · {formatDuration(session.duration)} · {session.teacherName}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/15 flex-shrink-0" />
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            {sessions.length > 2 && (
              <ShowMoreButton
                label="Alle Sitzungen anzeigen"
                count={sessions.length}
                onClick={() => setSubView('allSessions')}
              />
            )}
          </div>

          {/* ========== SECTION 3: Aufgaben vom Lehrer (central task hub) ========== */}
          <div>
            <SectionTitle
              icon={<GraduationCap className="w-4 h-4 text-[#7B61FF]" />}
            >
              Aufgaben vom Lehrer
            </SectionTitle>
            <p className={`${p('Regular')} text-[11px] text-white/30 -mt-2 mb-3 leading-relaxed`}>
              Alle Aufgaben, die dir deine Lehrer aus den Nachhilfesitzungen aufgegeben haben.
            </p>

            {/* Offen / Erledigt toggle */}
            <div className="flex items-center gap-1 mb-3 p-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {(['open', 'done'] as const).map(tab => {
                const isActive = taskTab === tab;
                const label = tab === 'open' ? `Offen (${openTasks.length})` : `Erledigt (${completedTasksCount})`;
                return (
                  <button
                    key={tab}
                    onClick={() => setTaskTab(tab)}
                    className={`flex-1 py-1.5 rounded-md ${p('Medium')} text-[11px] transition-all`}
                    style={{
                      background: isActive ? 'rgba(0,184,148,0.10)' : 'transparent',
                      color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.4)',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {(() => {
              const visibleTasks = taskTab === 'open' ? openTasks : completedTasks;
              const isDone = taskTab === 'done';
              if (visibleTasks.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="w-8 h-8 text-white/10 mb-3" />
                    <p className={`${p('Medium')} text-[13px] text-white/25`}>Keine Einträge vorhanden</p>
                    <p className={`${p('Regular')} text-[11px] text-white/15 mt-1`}>
                      {isDone ? 'Du hast noch keine Aufgaben erledigt.' : 'Keine offenen Aufgaben vorhanden – gut gemacht!'}
                    </p>
                  </div>
                );
              }
              return (<>
            <div className="space-y-2">
              {visibleTasks.slice(0, 2).map(task => {
                const isFlashcards = task.type === 'flashcards';
                const title = cleanTaskTitle(task.title);
                return (
                  <GlassCard key={task.id}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`${p('Medium')} text-[10px] text-white/25 uppercase tracking-wider`}>
                          {task.subject}
                        </span>
                        <div className="flex items-center gap-2.5">
                          {/* Progress bar only for flashcards */}
                          {isFlashcards && (
                            <div className="flex items-center gap-1.5">
                              <span className={`${p('Medium')} text-[10px] text-white/50`}>{task.score}%</span>
                              <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${task.score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }} />
                              </div>
                            </div>
                          )}
                          {/* Grade badge for completed exams */}
                          {!isFlashcards && task.status === 'completed' && task.grade && (
                            <span className={`${p('SemiBold')} text-[10px] px-2 py-0.5 rounded-full`} style={{ color: gradeColor(task.grade), background: `${gradeColor(task.grade)}15`, border: `1px solid ${gradeColor(task.grade)}30` }}>
                              Note: {task.grade}
                            </span>
                          )}
                          {/* "Noch nicht gestartet" for new exams */}
                          {!isFlashcards && task.status === 'new' && (
                            <span className={`${p('Regular')} text-[9px] text-white/25`}>Noch nicht gestartet</span>
                          )}
                        </div>
                      </div>
                      <h4 className={`${p('SemiBold')} text-[13px] text-white mb-2`}>{title}</h4>
                      <p className={`${p('Regular')} text-[11px] text-white/40 leading-relaxed mb-2.5`}>
                        {task.description}
                      </p>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-white/20" />
                          <span className={`${p('Regular')} text-[10px] text-white/25`}>Aus Sitzung: {formatShortDate(task.assignedAt)}</span>
                        </div>
                        <span className={`${p('Regular')} text-[10px] text-white/25`}>
                          {isFlashcards ? `${task.cardCount || '?'} Karten` : `~${task.estimatedMinutes} Min`}
                        </span>
                      </div>
                      {/* Single action button matching task type */}
                      {!isDone && (() => {
                        const hasLinkedSet = isFlashcards && task.linkedSetId && task.status !== 'new';
                        return (
                          <button
                            onClick={() => {
                              if (hasLinkedSet) {
                                onOpenLinkedFlashcardSet?.(task.linkedSetId!);
                              } else if (isFlashcards) {
                                onGenerateForWeakness?.({ topic: title, subject: task.subject, severity: 'high', recommendation: task.description, source: 'teacher-task', cardCount: task.cardCount, assignedDate: formatShortDate(task.assignedAt), teacherTaskId: task.id });
                              } else {
                                onStartExamForWeakness?.({ topic: title, subject: task.subject, severity: 'high', recommendation: task.description, source: 'teacher-task', examDurationMinutes: task.estimatedMinutes, assignedDate: formatShortDate(task.assignedAt), teacherTaskId: task.id });
                              }
                            }}
                            className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg ${p('Medium')} text-[10px] transition-all active:scale-[0.97]`}
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)' }}
                          >
                            {isFlashcards ? <Layers className="w-3 h-3" /> : <ClipboardCheck className="w-3 h-3" />}
                            {hasLinkedSet ? 'Karteikarten fortsetzen' : isFlashcards ? 'Karteikarten üben' : 'Prüfung starten'}
                          </button>
                        );
                      })()}
                      {/* Completed exam: show "Ergebnis ansehen" */}
                      {isDone && !isFlashcards && task.grade && (
                        <button
                          onClick={() => onStartExamForWeakness?.({ topic: title, subject: task.subject, severity: 'high', recommendation: task.description, source: 'teacher-task', examDurationMinutes: task.estimatedMinutes, assignedDate: formatShortDate(task.assignedAt), teacherTaskId: task.id })}
                          className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg ${p('Medium')} text-[10px] transition-all active:scale-[0.97]`}
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)' }}
                        >
                          <ClipboardCheck className="w-3 h-3" />
                          Ergebnis ansehen
                        </button>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            {visibleTasks.length > 2 && (
              <ShowMoreButton
                label={taskTab === 'open' ? 'Alle offenen Aufgaben anzeigen' : 'Alle erledigten Aufgaben anzeigen'}
                count={visibleTasks.length}
                onClick={() => setSubView('allTasks')}
              />
            )}
              </>);
            })()}
          </div>

          {/* ========== SECTION 4a: Erkannte Schwächen ========== */}
          {observedWeaknesses.length > 0 && (
            <div>
              <SectionTitle
                icon={<AlertTriangle className="w-4 h-4 text-[#FF6B6B]" />}
                badge={
                  <span className={`${p('Medium')} text-[10px] text-white/30`}>
                    {observedWeaknesses.length} aktiv · {resolvedCount} behoben
                  </span>
                }
              >
                Erkannte Schwächen
              </SectionTitle>
              <SectionExplainer
                text="Alle Schwächen, die in deinen Nachhilfesitzungen erkannt wurden."
              />

              <div className="space-y-2">
                {observedWeaknesses.slice(0, INITIAL_WEAKNESS_COUNT).map(item => {
                  const sevColor = item.severity === 'critical' ? '#FF6B6B' : item.severity === 'medium' ? '#FFB84D' : '#00D4AA';
                  const sevLabel = item.severity === 'critical' ? 'Kritisch' : item.severity === 'medium' ? 'Mittel' : 'Gering';
                  const sevBg = item.severity === 'critical' ? 'rgba(255,107,107,0.12)' : item.severity === 'medium' ? 'rgba(255,184,77,0.12)' : 'rgba(0,212,170,0.12)';
                  return (
                    <GlassCard key={item.id}>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`${p('Medium')} text-[10px] text-white/25 uppercase tracking-wider`}>
                            {item.subject}
                          </span>
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`${p('Medium')} text-[10px] text-white/50`}>{item.score}%</span>
                              <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${item.score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }} />
                              </div>
                            </div>
                            <span className={`py-0.5 rounded-full ${p('SemiBold')} text-[10px] text-center`} style={{ color: sevColor, backgroundColor: sevBg, border: `1px solid ${sevColor}30`, minWidth: '62px' }}>
                              {sevLabel}
                            </span>
                          </div>
                        </div>
                        <h4 className={`${p('SemiBold')} text-[13px] text-white mb-2`}>{item.title}</h4>
                        <p className={`${p('Regular')} text-[11px] text-white/40 leading-relaxed mb-3`}>
                          {item.description}
                        </p>
                        <GlobalWeaknessActionButtons
                          source="weakness"
                          subject={item.subject}
                          topic={item.title}
                          severity={String(item.severity)}
                          recommendation={item.description}
                          onGenerate={(ctx) => onGenerateForWeakness?.({ ...ctx, contextLabel: 'Nachhilfe-Fortschritt', notificationLabel: 'Schwäche gezielt trainieren' })}
                          onStartExam={(ctx) => onStartExamForWeakness?.({ ...ctx, contextLabel: 'Nachhilfe-Fortschritt', notificationLabel: 'Schwäche gezielt trainieren' })}
                          onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                          allSets={allSets}
                        />
                      </div>
                    </GlassCard>
                  );
                })}
              </div>

              {observedWeaknesses.length > INITIAL_WEAKNESS_COUNT && (
                <ShowMoreButton
                  label="Alle Schwächen anzeigen"
                  count={observedWeaknesses.length}
                  onClick={() => setSubView('allWeaknesses')}
                />
              )}
            </div>
          )}

          {/* ========== SECTION 4b: KI-Wissenslücken ========== */}
          {kiKnowledgeGaps.length > 0 && (
            <div>
              <SectionTitle
                icon={<Brain className="w-4 h-4 text-[#2D9E78]" />}
                badge={<AIBadge />}
              >
                KI-Wissenslücken
              </SectionTitle>
              <SectionExplainer
                text="Die KI hat Ursachen erkannt, die mehrere deiner Schwächen verursachen könnten – eine Lücke schließen, mehrere Probleme lösen."
              />

              <div className="space-y-2">
                {kiKnowledgeGaps.slice(0, INITIAL_GAP_COUNT).map(item => {
                  const sevColor = item.severity === 'critical' ? '#FF6B6B' : item.severity === 'medium' ? '#FFB84D' : '#00D4AA';
                  const sevLabel = item.severity === 'critical' ? 'Kritisch' : item.severity === 'medium' ? 'Mittel' : 'Gering';
                  const sevBg = item.severity === 'critical' ? 'rgba(255,107,107,0.12)' : item.severity === 'medium' ? 'rgba(255,184,77,0.12)' : 'rgba(0,212,170,0.12)';
                  return (
                    <GlassCard key={item.id}>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`${p('Medium')} text-[10px] text-white/25 uppercase tracking-wider`}>
                            {item.subject}
                          </span>
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`${p('Medium')} text-[10px] text-white/50`}>{item.score}%</span>
                              <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${item.score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }} />
                              </div>
                            </div>
                            <span className={`py-0.5 rounded-full ${p('SemiBold')} text-[10px] text-center`} style={{ color: sevColor, backgroundColor: sevBg, border: `1px solid ${sevColor}30`, minWidth: '62px' }}>
                              {sevLabel}
                            </span>
                          </div>
                        </div>
                        <h4 className={`${p('SemiBold')} text-[13px] text-white mb-2`}>{item.title}</h4>
                        <p className={`${p('Regular')} text-[11px] text-white/40 leading-relaxed mb-3`}>
                          {item.description}
                        </p>
                        <GlobalWeaknessActionButtons
                          source="knowledge-gap"
                          subject={item.subject}
                          topic={item.title}
                          severity={String(item.severity)}
                          recommendation={item.description}
                          onGenerate={(ctx) => onGenerateForWeakness?.({ ...ctx, contextLabel: 'Nachhilfe-Fortschritt', notificationLabel: 'Wissenslücke schließen' })}
                          onStartExam={(ctx) => onStartExamForWeakness?.({ ...ctx, contextLabel: 'Nachhilfe-Fortschritt', notificationLabel: 'Wissenslücke schließen' })}
                          onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                          allSets={allSets}
                        />
                      </div>
                    </GlassCard>
                  );
                })}
              </div>

              {kiKnowledgeGaps.length > INITIAL_GAP_COUNT && (
                <ShowMoreButton
                  label="Alle Wissenslücken anzeigen"
                  count={kiKnowledgeGaps.length}
                  onClick={() => setSubView('allKnowledgeGaps')}
                />
              )}
            </div>
          )}

          {/* ========== SECTION: Nachhilfe-Insights (KPI metrics) ========== */}
          <div>
            <SectionTitle icon={<TrendingUp className="w-4 h-4 text-[#00D4AA]" />}>
              Nachhilfe-Insights
            </SectionTitle>

            {/* Three metric cards */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {/* Sessions completed */}
              <GlassCard>
                <div className="p-3 text-center">
                  <span className={`${p('SemiBold')} text-[22px] block`} style={{ color: '#00D4AA' }}>
                    {sessions.length}
                  </span>
                  <span className={`${p('Regular')} text-[10px] text-white/40 block mt-0.5`}>
                    Sitzungen absolviert
                  </span>
                </div>
              </GlassCard>

              {/* Average performance */}
              <GlassCard>
                <div className="p-3 text-center">
                  <span className={`${p('SemiBold')} text-[22px] block`} style={{ color: '#00D4AA' }}>
                    {sessions.length > 0
                      ? Math.round(sessions.reduce((sum, s) => sum + (s.topicsCovered.reduce((ts, t) => ts + t.confidence, 0) / (s.topicsCovered.length || 1)), 0) / sessions.length)
                      : 0}%
                  </span>
                  <span className={`${p('Regular')} text-[10px] text-white/40 block mt-0.5`}>
                    Ø Performance
                  </span>
                </div>
              </GlassCard>

              {/* Trend */}
              {(() => {
                // Simple trend: compare first half avg vs second half avg
                const half = Math.floor(sessions.length / 2);
                const avgOf = (arr: typeof sessions) => arr.length > 0
                  ? arr.reduce((s, sess) => s + sess.topicsCovered.reduce((ts, t) => ts + t.confidence, 0) / (sess.topicsCovered.length || 1), 0) / arr.length
                  : 0;
                const recent = avgOf(sessions.slice(0, half || 1));
                const older = avgOf(sessions.slice(half));
                const diff = recent - older;
                const trend = diff > 3 ? 'up' : diff < -3 ? 'down' : 'stable';
                const trendConfig = {
                  up: { icon: '↗', label: 'Aufsteigend', color: '#00D4AA' },
                  stable: { icon: '→', label: 'Stabil', color: '#FFB84D' },
                  down: { icon: '↘', label: 'Absteigend', color: '#FF6B6B' },
                }[trend];
                return (
                  <GlassCard>
                    <div className="p-3 text-center">
                      <span className={`${p('SemiBold')} text-[22px] block`} style={{ color: trendConfig.color }}>
                        {trendConfig.icon}
                      </span>
                      <span className={`${p('Regular')} text-[10px] text-white/40 block mt-0.5`}>
                        {trendConfig.label}
                      </span>
                    </div>
                  </GlassCard>
                );
              })()}
            </div>

            {/* ── Fortschrittsverlauf ── */}
            <div className="mb-3">
              <h3 className={`${p('SemiBold')} text-[13px] text-white mb-1`}>Dein Fortschrittsverlauf</h3>
              <p className={`${p('Regular')} text-[10px] text-white/30 mb-3`}>
                Zeigt, wie sich deine Leistung in der Nachhilfe über die Zeit entwickelt hat.
              </p>

              {/* Date range preset chips */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
                {([['7', 'Letzte 7 Tage'], ['30', '30 Tage'], ['90', '3 Monate'], ['all', 'Gesamt']] as const).map(([val, label]) => {
                  const isActive = insightsRange === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setInsightsRange(val)}
                      className={`${p('Medium')} text-[11px] px-3 py-1.5 rounded-lg flex-shrink-0 transition-all`}
                      style={{
                        background: isActive ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isActive ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                        color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Performance chart + Topic progress */}
              {(() => {
                const days = insightsRange === 'all' ? 999 : parseInt(insightsRange);
                const cutoff = new Date();
                cutoff.setDate(cutoff.getDate() - days);
                const rangeSessions = insightsRange === 'all' ? sessions : sessions.filter(s => new Date(s.date) >= cutoff);

                // Build chart data from sessions
                const chartDataRaw = [...rangeSessions].reverse().map((s, idx) => ({
                  date: formatShortDate(s.date),
                  performance: Math.round(s.topicsCovered.reduce((sum, t) => sum + t.confidence, 0) / (s.topicsCovered.length || 1)),
                  _key: `${s.id}_${idx}`,
                }));
                // Deduplicate dates for XAxis keys – merge same-date sessions by averaging
                const dateMap = new Map<string, { total: number; count: number; key: string }>();
                chartDataRaw.forEach(d => {
                  if (dateMap.has(d.date)) {
                    const entry = dateMap.get(d.date)!;
                    entry.total += d.performance;
                    entry.count += 1;
                  } else {
                    dateMap.set(d.date, { total: d.performance, count: 1, key: d._key });
                  }
                });
                const chartData = [...dateMap.entries()].map(([date, v]) => ({
                  date,
                  performance: Math.round(v.total / v.count),
                }));

                // Build topic progress comparison
                const topicMap = new Map<string, { subject: string; start: number; end: number; current: number }>();
                const reversed = [...rangeSessions].reverse();
                reversed.forEach((s, i) => {
                  s.topicsCovered.forEach(t => {
                    const key = `${t.name}|${s.subject}`;
                    if (!topicMap.has(key)) {
                      topicMap.set(key, { subject: s.subject, start: t.confidence, end: t.confidence, current: t.confidence });
                    } else {
                      const entry = topicMap.get(key)!;
                      entry.end = t.confidence;
                      entry.current = t.confidence;
                    }
                  });
                });
                const topicProgress = [...topicMap.entries()]
                  .map(([key, val]) => ({ name: key.split('|')[0], ...val, delta: val.end - val.start }))
                  .sort((a, b) => b.delta - a.delta)
                  .slice(0, 5);

                if (chartData.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <TrendingUp className="w-8 h-8 text-white/10 mb-3" />
                      <p className={`${p('Medium')} text-[13px] text-white/25`}>Keine Daten im gewählten Zeitraum</p>
                    </div>
                  );
                }

                return (
                  <>
                    {/* Area chart */}
                    <GlassCard>
                      <div className="p-3" style={{ height: 160 }}>
                        {(() => {
                          const W = 320, H = 120, padL = 36, padR = 8, padT = 8, padB = 20;
                          const cW = W - padL - padR, cH = H - padT - padB;
                          const n = chartData.length;
                          if (n === 0) return null;
                          const points = chartData.map((d: { date: string; performance: number }, i: number) => ({
                            x: padL + (n > 1 ? (i / (n - 1)) * cW : cW / 2),
                            y: padT + cH - (d.performance / 100) * cH,
                            ...d,
                          }));
                          const linePath = points.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x},${pt.y}`).join(' ');
                          const areaPath = `${linePath} L${points[n - 1].x},${padT + cH} L${points[0].x},${padT + cH} Z`;
                          const yTicks = [0, 25, 50, 75, 100];
                          return (
                            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="tpsGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.2} />
                                  <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              {yTicks.map(v => {
                                const y = padT + cH - (v / 100) * cH;
                                return (
                                  <g key={`yt-${v}`}>
                                    <text x={padL - 4} y={y + 3} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize={7}>{v}</text>
                                  </g>
                                );
                              })}
                              {points.map((pt, i) => (
                                <text key={`xl-${i}`} x={pt.x} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={7}>{pt.date}</text>
                              ))}
                              <path d={areaPath} fill="url(#tpsGrad)" />
                              <path d={linePath} fill="none" stroke="#00D4AA" strokeWidth={2} />
                              {points.map((pt, i) => (
                                <circle key={`dot-${i}`} cx={pt.x} cy={pt.y} r={3} fill="#0a0a0a" stroke="#00D4AA" strokeWidth={1.5} />
                              ))}
                            </svg>
                          );
                        })()}
                      </div>
                    </GlassCard>

                    {/* Topic progress comparison */}
                    {topicProgress.length > 0 && (
                      <div className="mt-3">
                        <span className={`${p('SemiBold')} text-[11px] text-white/50 block mb-2`}>Themen-Fortschritt</span>
                        <div className="space-y-2">
                          {topicProgress.map((tp, i) => {
                            const deltaColor = tp.delta > 0 ? '#00D4AA' : tp.delta < 0 ? '#FF6B6B' : '#FFB84D';
                            return (
                              <GlassCard key={i}>
                                <div className="p-3">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex-1 min-w-0">
                                      <span className={`${p('SemiBold')} text-[12px] text-white block`}>{tp.name}</span>
                                      <span className={`${p('Regular')} text-[10px] text-white/25 block`}>{tp.subject}</span>
                                    </div>
                                    <span className={`${p('SemiBold')} text-[12px] flex-shrink-0`} style={{ color: deltaColor }}>
                                      {tp.delta > 0 ? '+' : ''}{tp.delta}%
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`${p('Regular')} text-[9px] text-white/30`}>{tp.start}% → {tp.end}%</span>
                                    <div className="flex-1 relative overflow-hidden rounded-full" style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.08)' }}>
                                      <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${tp.current}%`, backgroundColor: deltaColor, opacity: 0.6, transition: 'width 0.6s ease' }} />
                                    </div>
                                  </div>
                                </div>
                              </GlassCard>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* KI-Analyse text box */}
            <GlassCard style={{ background: 'linear-gradient(135deg, rgba(0,184,148,0.04) 0%, rgba(0,184,148,0.01) 100%)', border: '1px solid rgba(0,184,148,0.10)' }}>
              <div className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,184,148,0.10)' }}>
                  <Sparkles className="w-4 h-4" style={{ color: '#00B894' }} />
                </div>
                <div className="flex-1">
                  <span className={`${p('SemiBold')} text-[11px] block mb-1`} style={{ color: '#00D4AA' }}>KI-Analyse</span>
                  <p className={`${p('Regular')} text-[11px] text-white/50 leading-relaxed`}>
                    Du hast in {sessions.length} Sitzungen deutliche Fortschritte gemacht. Deine größte Verbesserung war bei Bruchrechnung (+25%). Die KI empfiehlt, den Fokus auf Gleichungen umzustellen.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Lernplan section removed – tasks are now in "Aufgaben vom Lehrer" */}

          {/* ========== SECTION 8: Erinnerungen + Streak ========== */}
          <div>
            <SectionTitle icon={<Sparkles className="w-4 h-4 text-[#00D4AA]" />}>
              Erinnerungen
            </SectionTitle>

            <div className="space-y-2.5">
              {stats.streak.isActive && (
                <GlassCard
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,140,0,0.06) 0%, rgba(255,107,107,0.04) 100%)',
                    border: '1px solid rgba(255,140,0,0.15)',
                  }}
                >
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,140,0,0.12)' }}>
                      <Flame className="w-5 h-5" style={{ color: '#FF8C00' }} />
                    </div>
                    <div className="flex-1">
                      <span className={`${p('SemiBold')} text-[14px] text-white block`}>
                        {stats.streak.currentStreak}-Tage Lernstreak!
                      </span>
                      <span className={`${p('Regular')} text-[11px] text-white/40 block`}>
                        Weitermachen! Dein Rekord: {stats.streak.longestStreak} Tage
                      </span>
                    </div>
                  </div>
                </GlassCard>
              )}

              <GlassCard>
                <div className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(74,158,255,0.08)' }}>
                    <Play className="w-4 h-4" style={{ color: '#4A9EFF' }} />
                  </div>
                  <div className="flex-1">
                    <span className={`${p('Medium')} text-[12px] text-white/70 block`}>Weitermachen wo du aufgehört hast</span>
                    <span className={`${p('Regular')} text-[10px] text-white/30 block`}>pq-Formel Karteikarten · 7 von 15</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/15 flex-shrink-0" />
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(123,97,255,0.08)' }}>
                    <RotateCcw className="w-4 h-4" style={{ color: '#7B61FF' }} />
                  </div>
                  <div className="flex-1">
                    <span className={`${p('Medium')} text-[12px] text-white/70 block`}>Spaced Repetition Erinnerung</span>
                    <span className={`${p('Regular')} text-[10px] text-white/30 block`}>3 Sets sollten heute wiederholt werden</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/15 flex-shrink-0" />
                </div>
              </GlassCard>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  // ===================================================================
  // RENDER: ALL SESSIONS (Slide sub-view with filters)
  // ===================================================================
  const renderAllSessions = () => (
    <div
      style={{
        ...slideTransitionStyle,
        transform: subView === 'allSessions' ? 'translateX(0)' : 'translateX(100%)',
        opacity: subView === 'allSessions' ? 1 : 0,
        pointerEvents: subView === 'allSessions' ? 'auto' : 'none',
      }}
    >
      <SubViewHeader title="Sitzungsverlauf" onBack={() => setSubView('overview')} />

      <div
        className="overflow-y-auto px-5 pb-12 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch', height: 'calc(100% - 76px)' }}
      >
        {/* Filter Rows */}
        <div className="flex flex-col gap-2.5 mb-4">
          {/* Row 1: Fächer */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            <button
              onClick={() => setSessionSubjectFilter(null)}
              className={`${p('Medium')} text-[11px] px-3 py-1.5 rounded-lg flex-shrink-0 transition-all`}
              style={{
                background: !sessionSubjectFilter ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${!sessionSubjectFilter ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                color: !sessionSubjectFilter ? '#00D4AA' : 'rgba(255,255,255,0.5)',
              }}
            >
              Alle Fächer
            </button>
            {uniqueSubjects.map(subject => {
              const isActive = sessionSubjectFilter === subject;
              return (
                <button
                  key={subject}
                  onClick={() => setSessionSubjectFilter(isActive ? null : subject)}
                  className={`${p('Medium')} text-[11px] px-3 py-1.5 rounded-lg flex-shrink-0 transition-all`}
                  style={{
                    background: isActive ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                    color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {subject}
                </button>
              );
            })}
          </div>
          {/* Row 2: Zeitraum */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {(['7days', '30days'] as const).map(filter => {
              const label = filter === '7days' ? '7 Tage' : '30 Tage';
              const isActive = sessionFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setSessionFilter(filter)}
                  className={`${p('Medium')} text-[11px] px-3 py-1.5 rounded-lg flex-shrink-0 transition-all`}
                  style={{
                    background: isActive ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                    color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {label}
                </button>
              );
            })}
            <button
              onClick={() => setShowDatePicker(true)}
              className={`${p('Medium')} text-[11px] px-3 py-1.5 rounded-lg flex-shrink-0 transition-all flex items-center gap-1.5`}
              style={{
                background: sessionFilter === 'custom' ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${sessionFilter === 'custom' ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                color: sessionFilter === 'custom' ? '#00D4AA' : 'rgba(255,255,255,0.5)',
              }}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              {sessionFilter === 'custom' && dateRangeFrom && dateRangeTo
                ? `${formatShortDate(dateRangeFrom)} – ${formatShortDate(dateRangeTo)}`
                : 'Zeitraum'}
            </button>
          </div>
        </div>

        {/* Custom date range active indicator */}
        {sessionFilter === 'custom' && dateRangeFrom && dateRangeTo && (
          <div className="flex items-center gap-2 mb-3">
            <span className={`${p('Regular')} text-[10px] text-white/30`}>
              Zeitraum: {formatDate(dateRangeFrom.toISOString())} – {formatDate(dateRangeTo.toISOString())}
            </span>
            <button
              onClick={() => { setSessionFilter('7days'); setDateRangeFrom(''); setDateRangeTo(''); }}
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <XIcon className="w-3 h-3 text-white/30" />
            </button>
          </div>
        )}

        {/* Results count */}
        <p className={`${p('Regular')} text-[11px] text-white/25 mb-3`}>
          {filteredSessions.length} Sitzung{filteredSessions.length !== 1 ? 'en' : ''}
        </p>

        {/* Session list */}
        <div className="space-y-2">
          {filteredSessions.map(session => (
            <GlassCard key={session.id} onClick={() => onOpenSessionDetail?.(session.id)}>
              <div className="flex">
                <div className="w-1 flex-shrink-0 rounded-l-2xl" style={{ backgroundColor: session.subjectColor }} />
                <div className="flex-1 p-3.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`${p('SemiBold')} text-[13px] text-white`}>{session.subject}</span>
                      {session.isOnline && (
                        <div className="flex items-center gap-0.5 px-1.5 py-px rounded" style={{ background: 'rgba(0,184,148,0.08)' }}>
                          <Sparkles className="w-2 h-2" style={{ color: '#00B894' }} />
                          <span className={`${p('Medium')} text-[8px]`} style={{ color: '#00B894' }}>AI</span>
                        </div>
                      )}
                    </div>
                    <span className={`${p('Regular')} text-[11px] text-white/50 block`}>{session.mainTopic}</span>
                    <span className={`${p('Regular')} text-[10px] text-white/25 block`}>
                      {formatDate(session.date)} · {formatDuration(session.duration)} · {session.teacherName}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/15 flex-shrink-0" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className={`${p('Medium')} text-[13px] text-white/30`}>Keine Sitzungen gefunden</p>
            <p className={`${p('Regular')} text-[11px] text-white/20 mt-1`}>Passe die Filter an</p>
          </div>
        )}
      </div>
    </div>
  );

  // renderSubjectDetail removed – Themenübersicht was removed

  // ===================================================================
  // RENDER: ALL WEAKNESSES (observed, Slide sub-view)
  // ===================================================================
  const renderAllWeaknesses = () => (
    <div
      style={{
        ...slideTransitionStyle,
        transform: subView === 'allWeaknesses' ? 'translateX(0)' : 'translateX(100%)',
        opacity: subView === 'allWeaknesses' ? 1 : 0,
        pointerEvents: subView === 'allWeaknesses' ? 'auto' : 'none',
      }}
    >
      <SubViewHeader title="Erkannte Schwächen" onBack={() => setSubView('overview')} />

      <div
        className="overflow-y-auto px-5 pb-12 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch', height: 'calc(100% - 76px)' }}
      >
        <SectionExplainer
          text="Inhalte, bei denen in Nachhilfe-Sitzungen oder beim Selbstlernen konkrete Schwierigkeiten beobachtet wurden. Diese Probleme sind direkt messbar."
        />

        {/* Filter Row – Fach */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={(e) => { setWeaknessSubjectFilter(null); scrollChipCenter(e); }}
            className={`${p('Medium')} text-[11px] px-3 py-1.5 rounded-lg flex-shrink-0 transition-all`}
            style={{
              background: !weaknessSubjectFilter ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${!weaknessSubjectFilter ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
              color: !weaknessSubjectFilter ? '#00D4AA' : 'rgba(255,255,255,0.5)',
            }}
          >
            Alle Fächer
          </button>
          {uniqueWeaknessSubjects.map(subject => {
            const isActive = weaknessSubjectFilter === subject;
            return (
              <button
                key={subject}
                onClick={(e) => { setWeaknessSubjectFilter(isActive ? null : subject); scrollChipCenter(e); }}
                className={`${p('Medium')} text-[11px] px-3 py-1.5 rounded-lg flex-shrink-0 transition-all`}
                style={{
                  background: isActive ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                  color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.5)',
                }}
              >
                {subject}
              </button>
            );
          })}
        </div>

        {/* Filter Row – Severity */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          {([null, 'critical', 'medium', 'minor'] as const).map(sev => {
            const isActive = weaknessSeverityFilter === sev;
            const config = {
              null: { label: 'Alle', color: '#00D4AA', bg: 'rgba(0,184,148,0.10)', border: 'rgba(0,184,148,0.30)' },
              critical: { label: 'Kritisch', color: '#FF6B6B', bg: 'rgba(255,107,107,0.10)', border: 'rgba(255,107,107,0.30)' },
              medium: { label: 'Mittel', color: '#FFB84D', bg: 'rgba(255,184,77,0.10)', border: 'rgba(255,184,77,0.30)' },
              minor: { label: 'Gering', color: 'rgba(255,255,255,0.50)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.15)' },
            }[String(sev) as 'null' | 'critical' | 'medium' | 'minor'];
            return (
              <button
                key={String(sev)}
                onClick={(e) => { setWeaknessSeverityFilter(sev); scrollChipCenter(e); }}
                className={`${p('Medium')} text-[11px] px-3 py-1.5 rounded-lg flex-shrink-0 transition-all flex items-center gap-1.5`}
                style={{
                  background: isActive ? config.bg : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? config.border : 'rgba(255,255,255,0.08)'}`,
                  color: isActive ? config.color : 'rgba(255,255,255,0.5)',
                }}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <p className={`${p('Regular')} text-[11px] text-white/25 mb-3`}>
          {filteredWeaknesses.length} aktiv · {resolvedCount} behoben
        </p>

        {/* Weakness list */}
        <div className="space-y-2">
          {filteredWeaknesses.map(item => {
            const sevColor = item.severity === 'critical' ? '#FF6B6B' : item.severity === 'medium' ? '#FFB84D' : '#00D4AA';
            const sevLabel = item.severity === 'critical' ? 'Kritisch' : item.severity === 'medium' ? 'Mittel' : 'Gering';
            const sevBg = item.severity === 'critical' ? 'rgba(255,107,107,0.12)' : item.severity === 'medium' ? 'rgba(255,184,77,0.12)' : 'rgba(0,212,170,0.12)';
            return (
              <GlassCard key={item.id}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`${p('Medium')} text-[10px] text-white/25 uppercase tracking-wider`}>{item.subject}</span>
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`${p('Medium')} text-[10px] text-white/50`}>{item.score}%</span>
                        <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${item.score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                      <span className={`py-0.5 rounded-full ${p('SemiBold')} text-[10px] text-center`} style={{ color: sevColor, backgroundColor: sevBg, border: `1px solid ${sevColor}30`, minWidth: '62px' }}>
                        {sevLabel}
                      </span>
                    </div>
                  </div>
                  <h4 className={`${p('SemiBold')} text-[13px] text-white mb-2`}>{item.title}</h4>
                  <p className={`${p('Regular')} text-[11px] text-white/40 leading-relaxed mb-3`}>{item.description}</p>
                  <GlobalWeaknessActionButtons
                    source="weakness"
                    subject={item.subject}
                    topic={item.title}
                    severity={String(item.severity)}
                    recommendation={item.description}
                    onGenerate={(ctx) => onGenerateForWeakness?.({ ...ctx, contextLabel: 'Nachhilfe-Fortschritt', notificationLabel: 'Schwäche gezielt trainieren' })}
                    onStartExam={(ctx) => onStartExamForWeakness?.({ ...ctx, contextLabel: 'Nachhilfe-Fortschritt', notificationLabel: 'Schwäche gezielt trainieren' })}
                    onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                    allSets={allSets}
                  />
                </div>
              </GlassCard>
            );
          })}
        </div>

        {filteredWeaknesses.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className={`${p('Medium')} text-[13px] text-white/30`}>Keine Schwächen gefunden</p>
            <p className={`${p('Regular')} text-[11px] text-white/20 mt-1`}>Passe die Filter an</p>
          </div>
        )}
      </div>
    </div>
  );

  // ===================================================================
  // RENDER: ALL KNOWLEDGE GAPS (KI-inferred, Slide sub-view)
  // ===================================================================
  const renderAllKnowledgeGaps = () => (
    <div
      style={{
        ...slideTransitionStyle,
        transform: subView === 'allKnowledgeGaps' ? 'translateX(0)' : 'translateX(100%)',
        opacity: subView === 'allKnowledgeGaps' ? 1 : 0,
        pointerEvents: subView === 'allKnowledgeGaps' ? 'auto' : 'none',
      }}
    >
      <SubViewHeader title="KI-Wissenslücken" onBack={() => setSubView('overview')} />

      <div
        className="overflow-y-auto px-5 pb-12 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch', height: 'calc(100% - 76px)' }}
      >
        <SectionExplainer
          text="Die KI analysiert deine Fehler-Muster, Voraussetzungsketten und Wissensverfall über alle Fächer hinweg, um tieferliegende Ursachen zu finden. Das Beheben einer Lücke kann mehrere Schwächen gleichzeitig lösen."
        />

        {/* Filter Row – Fach */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={(e) => { setGapSubjectFilter(null); scrollChipCenter(e); }}
            className={`${p('Medium')} text-[11px] px-3 py-1.5 rounded-lg flex-shrink-0 transition-all`}
            style={{
              background: !gapSubjectFilter ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${!gapSubjectFilter ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
              color: !gapSubjectFilter ? '#00D4AA' : 'rgba(255,255,255,0.5)',
            }}
          >
            Alle Fächer
          </button>
          {uniqueGapSubjects.map(subject => {
            const isActive = gapSubjectFilter === subject;
            return (
              <button
                key={subject}
                onClick={(e) => { setGapSubjectFilter(isActive ? null : subject); scrollChipCenter(e); }}
                className={`${p('Medium')} text-[11px] px-3 py-1.5 rounded-lg flex-shrink-0 transition-all`}
                style={{
                  background: isActive ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                  color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.5)',
                }}
              >
                {subject}
              </button>
            );
          })}
        </div>

        {/* Filter Row – Severity */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          {([null, 'critical', 'medium', 'minor'] as const).map(sev => {
            const isActive = gapSeverityFilter === sev;
            const config = {
              null: { label: 'Alle', color: '#00D4AA', bg: 'rgba(0,184,148,0.10)', border: 'rgba(0,184,148,0.30)' },
              critical: { label: 'Kritisch', color: '#FF6B6B', bg: 'rgba(255,107,107,0.10)', border: 'rgba(255,107,107,0.30)' },
              medium: { label: 'Mittel', color: '#FFB84D', bg: 'rgba(255,184,77,0.10)', border: 'rgba(255,184,77,0.30)' },
              minor: { label: 'Gering', color: 'rgba(255,255,255,0.50)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.15)' },
            }[String(sev) as 'null' | 'critical' | 'medium' | 'minor'];
            return (
              <button
                key={String(sev)}
                onClick={(e) => { setGapSeverityFilter(sev); scrollChipCenter(e); }}
                className={`${p('Medium')} text-[11px] px-3 py-1.5 rounded-lg flex-shrink-0 transition-all flex items-center gap-1.5`}
                style={{
                  background: isActive ? config.bg : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? config.border : 'rgba(255,255,255,0.08)'}`,
                  color: isActive ? config.color : 'rgba(255,255,255,0.5)',
                }}
              >
                {config.label}
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <p className={`${p('Regular')} text-[11px] text-white/25 mb-3`}>
          {filteredKnowledgeGaps.length} Wissenslücke{filteredKnowledgeGaps.length !== 1 ? 'n' : ''}
        </p>

        {/* Knowledge gap list */}
        <div className="space-y-2">
          {filteredKnowledgeGaps.map(item => {
            const sevColor = item.severity === 'critical' ? '#FF6B6B' : item.severity === 'medium' ? '#FFB84D' : '#00D4AA';
            const sevLabel = item.severity === 'critical' ? 'Kritisch' : item.severity === 'medium' ? 'Mittel' : 'Gering';
            const sevBg = item.severity === 'critical' ? 'rgba(255,107,107,0.12)' : item.severity === 'medium' ? 'rgba(255,184,77,0.12)' : 'rgba(0,212,170,0.12)';
            return (
              <GlassCard key={item.id}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`${p('Medium')} text-[10px] text-white/25 uppercase tracking-wider`}>{item.subject}</span>
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`${p('Medium')} text-[10px] text-white/50`}>{item.score}%</span>
                        <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${item.score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                      <span className={`py-0.5 rounded-full ${p('SemiBold')} text-[10px] text-center`} style={{ color: sevColor, backgroundColor: sevBg, border: `1px solid ${sevColor}30`, minWidth: '62px' }}>
                        {sevLabel}
                      </span>
                    </div>
                  </div>
                  <h4 className={`${p('SemiBold')} text-[13px] text-white mb-2`}>{item.title}</h4>
                  <p className={`${p('Regular')} text-[11px] text-white/40 leading-relaxed mb-3`}>{item.description}</p>
                  <GlobalWeaknessActionButtons
                    source="knowledge-gap"
                    subject={item.subject}
                    topic={item.title}
                    severity={String(item.severity)}
                    recommendation={item.description}
                    onGenerate={(ctx) => onGenerateForWeakness?.({ ...ctx, contextLabel: 'Nachhilfe-Fortschritt', notificationLabel: 'Wissenslücke schließen' })}
                    onStartExam={(ctx) => onStartExamForWeakness?.({ ...ctx, contextLabel: 'Nachhilfe-Fortschritt', notificationLabel: 'Wissenslücke schließen' })}
                    onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                    allSets={allSets}
                  />
                </div>
              </GlassCard>
            );
          })}
        </div>

        {filteredKnowledgeGaps.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className={`${p('Medium')} text-[13px] text-white/30`}>Keine Wissenslücken gefunden</p>
            <p className={`${p('Regular')} text-[11px] text-white/20 mt-1`}>Passe die Filter an</p>
          </div>
        )}
      </div>
    </div>
  );

  // ===================================================================
  // RENDER: ALL TASKS (Slide sub-view)
  // ===================================================================
  const renderAllTasks = () => (
    <div
      style={{
        ...slideTransitionStyle,
        transform: subView === 'allTasks' ? 'translateX(0)' : 'translateX(100%)',
        opacity: subView === 'allTasks' ? 1 : 0,
        pointerEvents: subView === 'allTasks' ? 'auto' : 'none',
      }}
    >
      <SubViewHeader title="Aufgaben vom Lehrer" onBack={() => setSubView('overview')} />

      <div
        className="overflow-y-auto px-5 pb-12 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch', height: 'calc(100% - 76px)' }}
      >
        {/* Offen / Erledigt toggle */}
        <div className="flex items-center gap-1 mb-3 p-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['open', 'done'] as const).map(tab => {
            const isActive = taskTab === tab;
            const label = tab === 'open' ? `Offen (${openTasks.length})` : `Erledigt (${completedTasksCount})`;
            return (
              <button
                key={tab}
                onClick={() => setTaskTab(tab)}
                className={`flex-1 py-1.5 rounded-md ${p('Medium')} text-[11px] transition-all`}
                style={{
                  background: isActive ? 'rgba(0,184,148,0.10)' : 'transparent',
                  color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.4)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Fach filter chips */}
        {(() => {
          const allTasks = taskTab === 'open' ? openTasks : completedTasks;
          const uniqueTaskSubjects = [...new Set(allTasks.map(t => t.subject))];
          return uniqueTaskSubjects.length > 1 ? (
            <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
              <button
                onClick={() => setTaskSubjectFilter(null)}
                className={`${p('Medium')} text-[11px] px-3 py-1.5 rounded-lg flex-shrink-0 transition-all`}
                style={{
                  background: !taskSubjectFilter ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${!taskSubjectFilter ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                  color: !taskSubjectFilter ? '#00D4AA' : 'rgba(255,255,255,0.5)',
                }}
              >
                Alle
              </button>
              {uniqueTaskSubjects.map(subject => {
                const isActive = taskSubjectFilter === subject;
                return (
                  <button
                    key={subject}
                    onClick={() => setTaskSubjectFilter(isActive ? null : subject)}
                    className={`${p('Medium')} text-[11px] px-3 py-1.5 rounded-lg flex-shrink-0 transition-all`}
                    style={{
                      background: isActive ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                      color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
          ) : null;
        })()}

        {(() => {
          const baseTasks = taskTab === 'open' ? openTasks : completedTasks;
          const tasks = taskSubjectFilter ? baseTasks.filter(t => t.subject === taskSubjectFilter) : baseTasks;
          const isDone = taskTab === 'done';
          if (tasks.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="w-8 h-8 text-white/10 mb-3" />
                <p className={`${p('Medium')} text-[13px] text-white/25`}>Keine Einträge vorhanden</p>
                <p className={`${p('Regular')} text-[11px] text-white/15 mt-1`}>
                  {isDone ? 'Du hast noch keine Aufgaben erledigt.' : 'Keine offenen Aufgaben vorhanden – gut gemacht!'}
                </p>
              </div>
            );
          }
          return (
            <div className="space-y-2">
              {tasks.map(task => {
                const isFlashcards = task.type === 'flashcards';
                const title = cleanTaskTitle(task.title);
                return (
                  <GlassCard key={task.id}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`${p('Medium')} text-[10px] text-white/25 uppercase tracking-wider`}>{task.subject}</span>
                        <div className="flex items-center gap-2.5">
                          {isFlashcards && (
                            <div className="flex items-center gap-1.5">
                              <span className={`${p('Medium')} text-[10px] text-white/50`}>{task.score}%</span>
                              <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${task.score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }} />
                              </div>
                            </div>
                          )}
                          {!isFlashcards && task.status === 'completed' && task.grade && (
                            <span className={`${p('SemiBold')} text-[10px] px-2 py-0.5 rounded-full`} style={{ color: gradeColor(task.grade), background: `${gradeColor(task.grade)}15`, border: `1px solid ${gradeColor(task.grade)}30` }}>
                              Note: {task.grade}
                            </span>
                          )}
                          {!isFlashcards && task.status === 'new' && (
                            <span className={`${p('Regular')} text-[9px] text-white/25`}>Noch nicht gestartet</span>
                          )}
                        </div>
                      </div>
                      <h4 className={`${p('SemiBold')} text-[13px] text-white mb-2`}>{title}</h4>
                      <p className={`${p('Regular')} text-[11px] text-white/40 leading-relaxed mb-2.5`}>{task.description}</p>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-white/20" />
                          <span className={`${p('Regular')} text-[10px] text-white/25`}>Aus Sitzung: {formatShortDate(task.assignedAt)}</span>
                        </div>
                        <span className={`${p('Regular')} text-[10px] text-white/25`}>
                          {isFlashcards ? `${task.cardCount || '?'} Karten` : `~${task.estimatedMinutes} Min`}
                        </span>
                      </div>
                      {!isDone && (() => {
                        const hasLinkedSet = isFlashcards && task.linkedSetId && task.status !== 'new';
                        return (
                          <button
                            onClick={() => {
                              if (hasLinkedSet) {
                                onOpenLinkedFlashcardSet?.(task.linkedSetId!);
                              } else if (isFlashcards) {
                                onGenerateForWeakness?.({ topic: title, subject: task.subject, severity: 'high', recommendation: task.description, source: 'teacher-task', cardCount: task.cardCount, assignedDate: formatShortDate(task.assignedAt), teacherTaskId: task.id });
                              } else {
                                onStartExamForWeakness?.({ topic: title, subject: task.subject, severity: 'high', recommendation: task.description, source: 'teacher-task', examDurationMinutes: task.estimatedMinutes, assignedDate: formatShortDate(task.assignedAt), teacherTaskId: task.id });
                              }
                            }}
                            className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg ${p('Medium')} text-[10px] transition-all active:scale-[0.97]`}
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)' }}
                          >
                            {isFlashcards ? <Layers className="w-3 h-3" /> : <ClipboardCheck className="w-3 h-3" />}
                            {hasLinkedSet ? 'Karteikarten fortsetzen' : isFlashcards ? 'Karteikarten üben' : 'Prüfung starten'}
                          </button>
                        );
                      })()}
                      {isDone && !isFlashcards && task.grade && (
                        <button
                          onClick={() => onStartExamForWeakness?.({ topic: title, subject: task.subject, severity: 'high', recommendation: task.description, source: 'teacher-task', examDurationMinutes: task.estimatedMinutes, assignedDate: formatShortDate(task.assignedAt), teacherTaskId: task.id })}
                          className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg ${p('Medium')} text-[10px] transition-all active:scale-[0.97]`}
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)' }}
                        >
                          <ClipboardCheck className="w-3 h-3" />
                          Ergebnis ansehen
                        </button>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );

  // ===================================================================
  // MAIN RENDER
  // ===================================================================
  return (
    <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden">
      {renderOverview()}
      {renderAllSessions()}
      {renderAllWeaknesses()}
      {renderAllKnowledgeGaps()}
      {renderAllTasks()}

      {/* ===== DATE RANGE PICKER ===== */}
      <PremiumCalendarPicker
        mode="range"
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        from={dateRangeFrom}
        to={dateRangeTo}
        maxDate={(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })()}
        onApply={(from, to) => {
          setDateRangeFrom(from);
          setDateRangeTo(to);
          setSessionFilter('custom');
        }}
        presets={(() => {
          const now = new Date();
          const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
          const todayStr = fmt(now);
          const ago = (days: number) => { const d = new Date(); d.setDate(d.getDate() - days); return fmt(d); };
          return [
            { label: 'Letzte Woche', from: ago(7), to: todayStr },
            { label: 'Letzter Monat', from: ago(30), to: todayStr },
            { label: 'Letzte 3 Monate', from: ago(90), to: todayStr },
          ];
        })()}
      />
    </div>
  );
}
