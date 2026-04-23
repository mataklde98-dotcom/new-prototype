// ===== TUTORING SESSION DETAIL SCREEN =====
// Detailed view of a single tutoring session.
// Redesigned: removed redundant sections, added severity badges, action buttons on weaknesses,
// renamed Lernplan → Aufgaben vom Lehrer, reduced Aktionen to 2.

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Sparkles, Clock, ChevronRight, CheckCircle2,
  Layers, ClipboardCheck, BookOpen, Target, Brain,
  AlertTriangle, Check, Lightbulb, HelpCircle, MessageCircle,
  Play, Info, Calendar,
} from 'lucide-react';
import {
  MOCK_SESSIONS,
  MOCK_SESSION_RECAP,
  MOCK_AI_SESSION_RECOMMENDATIONS,
  type TutoringSession,
  type TutoringSessionTopic,
  type TutoringSessionWeakness,
  type TutoringSessionRecommendation,
  type TutoringStudyPlanItem,
  type AISessionRecommendation,
  type AIRecommendationSeverity,
} from '@/mocks/tutoringProgress.mock';
import { useTeacherTasks } from '@/hooks/useTeacherTasks';
import GlobalWeaknessActionButtons from './WeaknessActionButtons';
import type { FlashcardSet } from '@/types/flashcard';

// ===================================================================
// TYPES
// ===================================================================

export interface WeaknessContext {
  subject?: string;
  topic?: string;
  subtopic?: string;
  severity?: string;
  recommendation?: string;
  source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice';
  contextLabel?: string;
  notificationLabel?: string;
}

interface TutoringSessionDetailScreenProps {
  sessionId: string | null;
  onClose: () => void;
  onOpenExplainSession?: (sessionId: string) => void;
  onGenerateForWeakness?: (context: WeaknessContext) => void;
  onStartExamForWeakness?: (context: WeaknessContext) => void;
  onOpenLinkedFlashcardSet?: (linkedSetId: string) => void;
  allSets?: FlashcardSet[];
  externalTransition?: boolean;
}

// ===================================================================
// HELPERS
// ===================================================================

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} Minuten`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h} Stunde${h > 1 ? 'n' : ''}`;
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function cleanTaskTitle(title: string): string {
  return title.replace(/^\d+\s+Karteikarten:\s*/i, '')
    .replace(/^Mini-Prüfung:\s*/i, '')
    .replace(/^Prüfungssimulation:\s*/i, '')
    .replace(/^Prüfung:\s*/i, '')
    .replace(/^Karteikarten\s*/i, '');
}

const poppins = (weight: string) => `font-['Poppins:${weight}',sans-serif]`;

function gradeColor(grade: string): string {
  const num = parseFloat(grade.replace(/[^0-9.]/g, ''));
  if (num <= 2.5) return '#00D4AA';
  if (num <= 3.5) return '#FFB84D';
  return '#FF6B6B';
}

// ===================================================================
// SUB-COMPONENTS
// ===================================================================

function GlassCard({ children, className = '', style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, icon, badge, subtitle }: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className={`${poppins('SemiBold')} text-[15px] text-white flex-1`}>{children}</h3>
        {badge}
      </div>
      {subtitle && (
        <p className={`${poppins('Regular')} text-[12px] text-white/30 mt-1 leading-relaxed`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function AIBadge() {
  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-md"
      style={{ background: 'rgba(0,184,148,0.08)', border: '1px solid rgba(0,184,148,0.12)' }}
    >
      <Sparkles className="w-2.5 h-2.5" style={{ color: '#00B894' }} />
      <span className={`${poppins('Medium')} text-[9px]`} style={{ color: '#00B894' }}>AI</span>
    </div>
  );
}

function SeverityDot({ severity }: { severity: string }) {
  const color = severity === 'high' ? '#FF6B6B' : severity === 'medium' ? '#FFB84D' : '#00D4AA';
  return <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />;
}

function SeverityBadge({ severity }: { severity: string }) {
  const config = severity === 'high'
    ? { label: 'Kritisch', color: '#FF6B6B' }
    : severity === 'medium'
    ? { label: 'Mittel', color: '#FFB84D' }
    : { label: 'Gering', color: '#00D4AA' };
  return (
    <span
      className={`${poppins('Medium')} text-[9px] px-1.5 py-0.5 rounded`}
      style={{ color: config.color, background: `${config.color}12`, border: `1px solid ${config.color}20` }}
    >
      {config.label}
    </span>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 70 ? '#00D4AA' : value >= 45 ? '#FFB84D' : '#FF6B6B';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-[5px] rounded-full bg-white/[0.04] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className={`${poppins('SemiBold')} text-[11px] text-white/50 w-[30px] text-right`}>{value}%</span>
    </div>
  );
}

function WeaknessActionButton({ icon: Icon, label, color, onClick }: {
  icon: React.ElementType;
  label: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all active:scale-[0.97]"
      style={{
        background: `${color}0a`,
        border: `1px solid ${color}20`,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <Icon className="w-3 h-3" style={{ color }} />
      <span className={`${poppins('Medium')} text-[10px]`} style={{ color }}>{label}</span>
    </button>
  );
}

// ===================================================================
// MAIN COMPONENT
// ===================================================================

export default function TutoringSessionDetailScreen({
  sessionId,
  onClose,
  onOpenExplainSession,
  onGenerateForWeakness,
  onStartExamForWeakness,
  onOpenLinkedFlashcardSet,
  allSets,
  externalTransition = false,
}: TutoringSessionDetailScreenProps) {
  const session = useMemo(() => MOCK_SESSIONS.find(s => s.id === sessionId), [sessionId]);
  const allTeacherTasks = useTeacherTasks();

  const [helpRequested, setHelpRequested] = useState<Set<string>>(new Set());
  const [recFilter, setRecFilter] = useState<'all' | AIRecommendationSeverity>('all');
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);
  const [showAllWeaknesses, setShowAllWeaknesses] = useState(false);
  const [weaknessFilter, setWeaknessFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // ── Teacher task toggle & sub-view ──
  const [sessionTaskTab, setSessionTaskTab] = useState<'open' | 'done'>('open');
  const [sessionTaskSubView, setSessionTaskSubView] = useState<'allSessionTasks' | null>(null);

  const aiRecommendations = useMemo(() => {
    if (!session) return [];
    return MOCK_AI_SESSION_RECOMMENDATIONS[session.id] || [];
  }, [session]);

  if (!session) {
    return (
      <div className="relative w-full h-full bg-[#0a0a0a] flex items-center justify-center">
        <p className={`${poppins('Regular')} text-[14px] text-white/40`}>Sitzung nicht gefunden</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className={`${poppins('SemiBold')} text-[18px] text-white truncate`}>{session.mainTopic}</h1>
          <p className={`${poppins('Regular')} text-[12px] text-white/35`}>
            {session.subject} · {session.teacherName}
          </p>
        </div>
        {session.isOnline && <AIBadge />}
      </div>

      {/* Scrollable Content */}
      <div
        className="flex-1 overflow-y-auto px-5 pb-12 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="space-y-6">

          {/* Session Meta */}
          <div className="flex items-center gap-4">
            <div
              className="h-1 w-8 rounded-full"
              style={{ backgroundColor: session.subjectColor }}
            />
            <p className={`${poppins('Regular')} text-[12px] text-white/40`}>
              {formatDate(session.date)} · {formatDuration(session.duration)}
            </p>
          </div>

          {/* ===== SECTION: Sitzungs-Zusammenfassung → REMOVED ===== */}

          {/* ===== AI SUMMARY (unchanged) ===== */}
          <div>
            <SectionTitle
              icon={<Brain className="w-4 h-4 text-[#7B61FF]" />}
              badge={session.isOnline ? <AIBadge /> : undefined}
            >
              {session.isOnline ? 'AI-Zusammenfassung' : 'Zusammenfassung'}
            </SectionTitle>

            <GlassCard>
              <div className="p-4">
                {!session.isOnline && (
                  <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <Info className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
                    <p className={`${poppins('Regular')} text-[10px] text-white/30`}>
                      Diese Zusammenfassung basiert auf dem Feedback deines Lehrers.
                    </p>
                  </div>
                )}

                <p className={`${poppins('Regular')} text-[12px] text-white/60 leading-relaxed`}>
                  {session.isOnline ? session.aiSummary : (session.teacherFeedback || session.aiSummary)}
                </p>
              </div>
            </GlassCard>
          </div>

          {/* ===== BEHANDELTE THEMEN (+ subtitle) ===== */}
          <div>
            <SectionTitle
              icon={<Target className="w-4 h-4 text-[#4A9EFF]" />}
              subtitle="Zeigt, wie gut du in den behandelten Themen während dieser Sitzung abgeschnitten hast – basierend auf der KI-Analyse des Unterrichts."
            >
              Behandelte Themen
            </SectionTitle>

            <GlassCard>
              <div className="p-4 space-y-3">
                {session.topicsCovered.map((topic, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <p className={`${poppins('Medium')} text-[12px] text-white/70`}>{topic.name}</p>
                    </div>
                    <ConfidenceBar value={topic.confidence} />
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ===== ERKANNTE SCHWÄCHEN (severity badges + action buttons) ===== */}
          {session.weaknesses.length > 0 && (
            <div>
              <SectionTitle icon={<AlertTriangle className="w-4 h-4 text-[#FF6B6B]" />}>
                Erkannte Schwächen
              </SectionTitle>

              <div className="space-y-2">
                {session.weaknesses.slice(0, 2).map(w => {
                  const sevColor = w.severity === 'high' ? '#FF6B6B' : w.severity === 'medium' ? '#FFB84D' : '#00D4AA';
                  const sevLabel = w.severity === 'high' ? 'Kritisch' : w.severity === 'medium' ? 'Mittel' : 'Gering';
                  const sevBg = w.severity === 'high' ? 'rgba(255,107,107,0.12)' : w.severity === 'medium' ? 'rgba(255,184,77,0.12)' : 'rgba(0,212,170,0.12)';
                  // Derive a score from severity since the mock doesn't have one
                  const score = w.severity === 'high' ? 25 : w.severity === 'medium' ? 50 : 75;
                  const subjectName = w.subject || session.subject;

                  return (
                    <GlassCard key={w.id}>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`${poppins('Medium')} text-[10px] text-white/25 uppercase tracking-wider`}>
                            {subjectName}
                          </span>
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`${poppins('Medium')} text-[10px] text-white/50`}>{score}%</span>
                              <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }} />
                              </div>
                            </div>
                            <span className={`py-0.5 rounded-full ${poppins('SemiBold')} text-[10px] text-center`} style={{ color: sevColor, backgroundColor: sevBg, border: `1px solid ${sevColor}30`, minWidth: '62px' }}>
                              {sevLabel}
                            </span>
                          </div>
                        </div>
                        <h4 className={`${poppins('SemiBold')} text-[13px] text-white mb-2`}>{w.title}</h4>
                        <p className={`${poppins('Regular')} text-[11px] text-white/40 leading-relaxed mb-3`}>
                          {w.description}
                        </p>
                        <GlobalWeaknessActionButtons
                          source="weakness"
                          subject={subjectName}
                          topic={w.title}
                          severity={w.severity === 'high' ? 'critical' : w.severity === 'medium' ? 'warning' : 'moderate'}
                          recommendation={w.description}
                          onGenerate={(ctx) => onGenerateForWeakness?.({ ...ctx, contextLabel: `${session.subject}unterricht`, notificationLabel: 'Schwäche gezielt trainieren' })}
                          onStartExam={(ctx) => onStartExamForWeakness?.({ ...ctx, contextLabel: `${session.subject}unterricht`, notificationLabel: 'Schwäche gezielt trainieren' })}
                          onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                          allSets={allSets}
                        />
                      </div>
                    </GlassCard>
                  );
                })}
              </div>

              {session.weaknesses.length > 2 && (
                <button
                  onClick={() => { setWeaknessFilter('all'); setShowAllWeaknesses(true); }}
                  className={`w-full mt-3 py-2.5 rounded-xl ${poppins('Medium')} text-[12px] text-white/40 transition-all active:scale-[0.98]`}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {`Alle ${session.weaknesses.length} anzeigen`}
                </button>
              )}
            </div>
          )}

          {/* ===== KI-EMPFEHLUNGEN (NEW – between Schwächen and Erkenntnisse) ===== */}
          {aiRecommendations.length > 0 && (
            <div>
              <SectionTitle
                icon={<Brain className="w-4 h-4 text-[#2D9E78]" />}
                badge={<AIBadge />}
                subtitle="Basierend auf deiner Performance in den behandelten Themen empfiehlt die KI folgende Inhalte zur Vertiefung."
              >
                {`KI-Empfehlungen (${aiRecommendations.length})`}
              </SectionTitle>

              <div className="space-y-2">
                {aiRecommendations.slice(0, 2).map(rec => {
                  const sevColor = rec.severity === 'urgent' ? '#FF6B6B' : rec.severity === 'recommended' ? '#FFB84D' : '#00D4AA';
                  const sevLabel = rec.severity === 'urgent' ? 'Dringend' : rec.severity === 'recommended' ? 'Empfohlen' : 'Förderlich';
                  const sevBg = rec.severity === 'urgent' ? 'rgba(255,107,107,0.12)' : rec.severity === 'recommended' ? 'rgba(255,184,77,0.12)' : 'rgba(0,212,170,0.12)';

                  return (
                    <GlassCard key={rec.id}>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`${poppins('Medium')} text-[10px] text-white/25 uppercase tracking-wider`}>
                            {rec.subject}
                          </span>
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`${poppins('Medium')} text-[10px] text-white/50`}>{rec.score}%</span>
                              <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${rec.score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }} />
                              </div>
                            </div>
                            <span className={`py-0.5 rounded-full ${poppins('SemiBold')} text-[10px] text-center`} style={{ color: sevColor, backgroundColor: sevBg, border: `1px solid ${sevColor}30`, minWidth: '62px' }}>
                              {sevLabel}
                            </span>
                          </div>
                        </div>
                        <h4 className={`${poppins('SemiBold')} text-[13px] text-white mb-2`}>{rec.title}</h4>
                        <p className={`${poppins('Regular')} text-[11px] text-white/40 leading-relaxed mb-3`}>
                          {rec.description}
                        </p>
                        <GlobalWeaknessActionButtons
                          source="recommendation"
                          subject={rec.subject}
                          topic={rec.title}
                          severity={rec.severity === 'urgent' ? 'critical' : rec.severity === 'recommended' ? 'warning' : 'moderate'}
                          recommendation={rec.description}
                          onGenerate={(ctx) => onGenerateForWeakness?.({ ...ctx, contextLabel: `${session.subject}unterricht`, notificationLabel: 'KI-Empfehlung' })}
                          onStartExam={(ctx) => onStartExamForWeakness?.({ ...ctx, contextLabel: `${session.subject}unterricht`, notificationLabel: 'KI-Empfehlung' })}
                          onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                          allSets={allSets}
                        />
                      </div>
                    </GlassCard>
                  );
                })}
              </div>

              {aiRecommendations.length > 2 && (
                <button
                  onClick={() => { setRecFilter('all'); setShowAllRecommendations(true); }}
                  className={`w-full mt-3 py-2.5 rounded-xl ${poppins('Medium')} text-[12px] text-white/40 transition-all active:scale-[0.98]`}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {`Alle ${aiRecommendations.length} anzeigen`}
                </button>
              )}
            </div>
          )}

          {/* ===== WICHTIGE ERKENNTNISSE (unchanged) ===== */}
          {session.isOnline && session.keyTakeaways.length > 0 && (
            <div>
              <SectionTitle icon={<Lightbulb className="w-4 h-4 text-[#FFB84D]" />}>
                Wichtige Erkenntnisse
              </SectionTitle>

              <GlassCard>
                <div className="p-4 space-y-3">
                  {session.keyTakeaways.map((takeaway, idx) => (
                    <div key={takeaway.id} className="flex items-start gap-2.5">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-px"
                        style={{ background: 'rgba(255,184,77,0.10)' }}
                      >
                        <span className={`${poppins('SemiBold')} text-[9px]`} style={{ color: '#FFB84D' }}>
                          {idx + 1}
                        </span>
                      </div>
                      <p className={`${poppins('Regular')} text-[12px] text-white/60 leading-relaxed`}>
                        {takeaway.text}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* ===== SECTION: Empfohlene Übungen → REMOVED ===== */}

          {/* ===== AUFGABEN VOM LEHRER (uses shared teacherTasksStore, identical to overview) ===== */}
          {(() => {
            const sessionTasks = allTeacherTasks.filter(t => t.sessionId === session.id);
            if (sessionTasks.length === 0) return null;
            const openTasks = sessionTasks.filter(t => t.status !== 'completed');
            const completedTasks = sessionTasks.filter(t => t.status === 'completed');
            const visibleTasks = sessionTaskTab === 'open' ? openTasks : completedTasks;
            const isDone = sessionTaskTab === 'done';

            const renderTaskCard = (task: typeof sessionTasks[0]) => {
              const isFlashcards = task.type === 'flashcards';
              const title = cleanTaskTitle(task.title);
              return (
                <GlassCard key={task.id}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`${poppins('Medium')} text-[10px] text-white/25 uppercase tracking-wider`}>
                        {task.subject}
                      </span>
                      <div className="flex items-center gap-2.5">
                        {/* Progress bar only for flashcards */}
                        {isFlashcards && (
                          <div className="flex items-center gap-1.5">
                            <span className={`${poppins('Medium')} text-[10px] text-white/50`}>{task.score}%</span>
                            <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${task.score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }} />
                            </div>
                          </div>
                        )}
                        {/* Grade badge for completed exams */}
                        {!isFlashcards && task.status === 'completed' && task.grade && (
                          <span className={`${poppins('SemiBold')} text-[10px] px-2 py-0.5 rounded-full`} style={{ color: gradeColor(task.grade), background: `${gradeColor(task.grade)}15`, border: `1px solid ${gradeColor(task.grade)}30` }}>
                            Note: {task.grade}
                          </span>
                        )}
                        {/* "Noch nicht gestartet" for new exams */}
                        {!isFlashcards && task.status === 'new' && (
                          <span className={`${poppins('Regular')} text-[9px] text-white/25`}>Noch nicht gestartet</span>
                        )}
                      </div>
                    </div>
                    <h4 className={`${poppins('SemiBold')} text-[13px] text-white mb-2`}>{title}</h4>
                    <p className={`${poppins('Regular')} text-[11px] text-white/40 leading-relaxed mb-2.5`}>
                      {task.description}
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-white/20" />
                        <span className={`${poppins('Regular')} text-[10px] text-white/25`}>Aus Sitzung: {formatShortDate(task.assignedAt)}</span>
                      </div>
                      <span className={`${poppins('Regular')} text-[10px] text-white/25`}>
                        {isFlashcards ? `${task.cardCount || '?'} Karten` : `~${task.estimatedMinutes} Min`}
                      </span>
                    </div>
                    {/* Action button for open tasks */}
                    {!isDone && (() => {
                      const hasLinkedSet = isFlashcards && task.linkedSetId && task.status !== 'new';
                      return (
                        <button
                          onClick={() => {
                            if (hasLinkedSet) {
                              onOpenLinkedFlashcardSet?.(task.linkedSetId!);
                            } else if (isFlashcards) {
                              onGenerateForWeakness?.({ topic: title, subject: task.subject, severity: 'high', recommendation: task.description, source: 'teacher-task', cardCount: task.cardCount, assignedDate: formatShortDate(task.assignedAt), teacherTaskId: task.id } as any);
                            } else {
                              onStartExamForWeakness?.({ topic: title, subject: task.subject, severity: 'high', recommendation: task.description, source: 'teacher-task', examDurationMinutes: task.estimatedMinutes, assignedDate: formatShortDate(task.assignedAt), teacherTaskId: task.id } as any);
                            }
                          }}
                          className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg ${poppins('Medium')} text-[10px] transition-all active:scale-[0.97]`}
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)' }}
                        >
                          {isFlashcards ? <Layers className="w-3 h-3" /> : <ClipboardCheck className="w-3 h-3" />}
                          {hasLinkedSet ? 'Karteikarten fortsetzen' : isFlashcards ? 'Karteikarten erstellen' : 'Prüfung starten'}
                        </button>
                      );
                    })()}
                    {/* Completed exam: show "Ergebnis ansehen" */}
                    {isDone && !isFlashcards && task.grade && (
                      <button
                        onClick={() => onStartExamForWeakness?.({ topic: title, subject: task.subject, severity: 'high', recommendation: task.description, source: 'teacher-task', examDurationMinutes: task.estimatedMinutes, assignedDate: formatShortDate(task.assignedAt), teacherTaskId: task.id } as any)}
                        className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg ${poppins('Medium')} text-[10px] transition-all active:scale-[0.97]`}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)' }}
                      >
                        <ClipboardCheck className="w-3 h-3" />
                        Ergebnis ansehen
                      </button>
                    )}
                  </div>
                </GlassCard>
              );
            };

            return (
            <div>
              <SectionTitle
                icon={<ClipboardCheck className="w-4 h-4 text-[#7B61FF]" />}
                subtitle="Vom Lehrer empfohlen"
              >
                Aufgaben vom Lehrer
              </SectionTitle>

              {/* Offen / Erledigt toggle */}
              <div className="flex items-center gap-1 mb-3 p-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {(['open', 'done'] as const).map(tab => {
                  const isActive = sessionTaskTab === tab;
                  const label = tab === 'open' ? `Offen (${openTasks.length})` : `Erledigt (${completedTasks.length})`;
                  return (
                    <button
                      key={tab}
                      onClick={() => setSessionTaskTab(tab)}
                      className={`flex-1 py-1.5 rounded-md ${poppins('Medium')} text-[11px] transition-all`}
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

              {visibleTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="w-8 h-8 text-white/10 mb-3" />
                  <p className={`${poppins('Medium')} text-[13px] text-white/25`}>
                    {isDone ? 'Noch keine erledigten Aufgaben' : 'Alle Aufgaben erledigt!'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {visibleTasks.slice(0, 2).map(renderTaskCard)}
                  </div>

                  {visibleTasks.length > 2 && (
                    <button
                      onClick={() => setSessionTaskSubView('allSessionTasks')}
                      className={`w-full mt-3 py-2.5 rounded-xl ${poppins('Medium')} text-[12px] text-white/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2`}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      {isDone ? `Alle erledigten Aufgaben anzeigen (${visibleTasks.length})` : `Alle offenen Aufgaben anzeigen (${visibleTasks.length})`}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>
            );
          })()}

          {/* ===== AKTIONEN (reduced to 2) ===== */}
          <div>
            <SectionTitle icon={<Sparkles className="w-4 h-4 text-[#00B894]" />}>
              Aktionen
            </SectionTitle>

            <div className="space-y-2.5">
              {/* Explain Session */}
              {session.isOnline && (
                <button
                  onClick={() => onOpenExplainSession?.(session.id)}
                  className="w-full p-3.5 rounded-2xl flex items-center gap-3 transition-all active:scale-[0.98]"
                  style={{
                    background: 'rgba(0,184,148,0.06)',
                    border: '1px solid rgba(0,184,148,0.15)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,184,148,0.10)' }}>
                    <MessageCircle className="w-4 h-4" style={{ color: '#00D4AA' }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`${poppins('SemiBold')} text-[13px] text-white/80`}>Sitzung nochmal erklären lassen</p>
                    <p className={`${poppins('Regular')} text-[10px] text-white/30`}>Durch den Lernassistenten</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/15" />
                </button>
              )}

              {/* "I need more help" */}
              <button
                onClick={() => {
                  const next = new Set(helpRequested);
                  next.add(session.mainTopic);
                  setHelpRequested(next);
                }}
                disabled={helpRequested.has(session.mainTopic)}
                className="w-full p-3.5 rounded-2xl flex items-center gap-3 transition-all active:scale-[0.98] disabled:opacity-40"
                style={{
                  background: helpRequested.has(session.mainTopic)
                    ? 'rgba(0,212,170,0.06)'
                    : 'rgba(123,97,255,0.06)',
                  border: `1px solid ${helpRequested.has(session.mainTopic)
                    ? 'rgba(0,212,170,0.15)'
                    : 'rgba(123,97,255,0.15)'}`,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: helpRequested.has(session.mainTopic)
                      ? 'rgba(0,212,170,0.10)'
                      : 'rgba(123,97,255,0.10)',
                  }}
                >
                  {helpRequested.has(session.mainTopic) ? (
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#00D4AA' }} />
                  ) : (
                    <HelpCircle className="w-4 h-4" style={{ color: '#7B61FF' }} />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className={`${poppins('SemiBold')} text-[13px] text-white/80`}>
                    {helpRequested.has(session.mainTopic) ? 'Lehrer benachrichtigt' : 'Ich brauche mehr Hilfe zu diesem Thema'}
                  </p>
                  <p className={`${poppins('Regular')} text-[10px] text-white/30`}>
                    {helpRequested.has(session.mainTopic)
                      ? 'Dein Lehrer wird das in der nächsten Sitzung berücksichtigen'
                      : 'Wird deinem Lehrer weitergeleitet'}
                  </p>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ===== ALL RECOMMENDATIONS OVERLAY ===== */}
      {showAllRecommendations && (
        <div className="absolute inset-0 z-50 bg-[#0a0a0a] flex flex-col">
          {/* Overlay Header */}
          <div className="flex-shrink-0 px-5 pt-6 pb-4 flex items-center gap-3">
            <button
              onClick={() => setShowAllRecommendations(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </button>
            <h2 className={`${poppins('SemiBold')} text-[17px] text-white flex-1`}>KI-Empfehlungen</h2>
            <AIBadge />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
            {([
              { key: 'all' as const, label: 'Alle', color: '#00D4AA', bg: 'rgba(0,184,148,0.10)', border: 'rgba(0,184,148,0.30)' },
              { key: 'urgent' as const, label: 'Dringend', color: '#FF6B6B', bg: 'rgba(255,107,107,0.10)', border: 'rgba(255,107,107,0.30)' },
              { key: 'recommended' as const, label: 'Empfohlen', color: '#FFB84D', bg: 'rgba(255,184,77,0.10)', border: 'rgba(255,184,77,0.30)' },
              { key: 'beneficial' as const, label: 'Förderlich', color: '#00D4AA', bg: 'rgba(0,212,170,0.10)', border: 'rgba(0,212,170,0.30)' },
            ] as const).map(chip => {
              const isActive = recFilter === chip.key;
              return (
                <button
                  key={chip.key}
                  onClick={() => setRecFilter(chip.key)}
                  className={`px-3 py-1.5 rounded-lg ${poppins('Medium')} text-[11px] whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5`}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    background: isActive ? chip.bg : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? chip.border : 'rgba(255,255,255,0.08)'}`,
                    color: isActive ? chip.color : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Scrollable Cards */}
          <div className="flex-1 overflow-y-auto px-5 pb-12 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="space-y-2">
              {(() => {
                const filtered = aiRecommendations.filter(r => recFilter === 'all' || r.severity === recFilter);
                if (filtered.length === 0) {
                  const msg = recFilter === 'urgent' ? 'Keine dringenden Empfehlungen vorhanden.'
                    : recFilter === 'recommended' ? 'Keine empfohlenen Inhalte für diesen Filter.'
                    : recFilter === 'beneficial' ? 'Keine förderlichen Empfehlungen vorhanden.'
                    : 'Keine Empfehlungen vorhanden.';
                  const positive = recFilter === 'urgent';
                  return (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle2 className="w-8 h-8 text-white/10 mb-3" />
                      <p className={`${poppins('Medium')} text-[13px] text-white/25`}>Keine Einträge vorhanden</p>
                      <p className={`${poppins('Regular')} text-[11px] text-white/15 mt-1`}>{positive ? 'Keine dringenden Empfehlungen – gut gemacht!' : msg}</p>
                    </div>
                  );
                }
                return filtered.map(rec => {
                  const sevColor = rec.severity === 'urgent' ? '#FF6B6B' : rec.severity === 'recommended' ? '#FFB84D' : '#00D4AA';
                  const sevLabel = rec.severity === 'urgent' ? 'Dringend' : rec.severity === 'recommended' ? 'Empfohlen' : 'Förderlich';
                  const sevBg = rec.severity === 'urgent' ? 'rgba(255,107,107,0.12)' : rec.severity === 'recommended' ? 'rgba(255,184,77,0.12)' : 'rgba(0,212,170,0.12)';

                  return (
                    <GlassCard key={rec.id}>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`${poppins('Medium')} text-[10px] text-white/25 uppercase tracking-wider`}>
                            {rec.subject}
                          </span>
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`${poppins('Medium')} text-[10px] text-white/50`}>{rec.score}%</span>
                              <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${rec.score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }} />
                              </div>
                            </div>
                            <span className={`py-0.5 rounded-full ${poppins('SemiBold')} text-[10px] text-center`} style={{ color: sevColor, backgroundColor: sevBg, border: `1px solid ${sevColor}30`, minWidth: '62px' }}>
                              {sevLabel}
                            </span>
                          </div>
                        </div>
                        <h4 className={`${poppins('SemiBold')} text-[13px] text-white mb-2`}>{rec.title}</h4>
                        <p className={`${poppins('Regular')} text-[11px] text-white/40 leading-relaxed mb-3`}>
                          {rec.description}
                        </p>
                        <GlobalWeaknessActionButtons
                          source="recommendation"
                          subject={rec.subject}
                          topic={rec.title}
                          severity={rec.severity === 'urgent' ? 'critical' : rec.severity === 'recommended' ? 'warning' : 'moderate'}
                          recommendation={rec.description}
                          onGenerate={(ctx) => onGenerateForWeakness?.({ ...ctx, contextLabel: `${session.subject}unterricht`, notificationLabel: 'KI-Empfehlung' })}
                          onStartExam={(ctx) => onStartExamForWeakness?.({ ...ctx, contextLabel: `${session.subject}unterricht`, notificationLabel: 'KI-Empfehlung' })}
                          onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                          allSets={allSets}
                        />
                      </div>
                    </GlassCard>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ===== ALL WEAKNESSES OVERLAY ===== */}
      {showAllWeaknesses && (
        <div className="absolute inset-0 z-50 bg-[#0a0a0a] flex flex-col">
          {/* Overlay Header */}
          <div className="flex-shrink-0 px-5 pt-6 pb-4 flex items-center gap-3">
            <button
              onClick={() => setShowAllWeaknesses(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </button>
            <h2 className={`${poppins('SemiBold')} text-[17px] text-white flex-1`}>Erkannte Schwächen</h2>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
            {([
              { key: 'all' as const, label: 'Alle', color: '#00D4AA', bg: 'rgba(0,184,148,0.10)', border: 'rgba(0,184,148,0.30)' },
              { key: 'high' as const, label: 'Kritisch', color: '#FF6B6B', bg: 'rgba(255,107,107,0.10)', border: 'rgba(255,107,107,0.30)' },
              { key: 'medium' as const, label: 'Mittel', color: '#FFB84D', bg: 'rgba(255,184,77,0.10)', border: 'rgba(255,184,77,0.30)' },
              { key: 'low' as const, label: 'Gering', color: '#00D4AA', bg: 'rgba(0,212,170,0.10)', border: 'rgba(0,212,170,0.30)' },
            ] as const).map(chip => {
              const isActive = weaknessFilter === chip.key;
              return (
                <button
                  key={chip.key}
                  onClick={() => setWeaknessFilter(chip.key)}
                  className={`px-3 py-1.5 rounded-lg ${poppins('Medium')} text-[11px] whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5`}
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    background: isActive ? chip.bg : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? chip.border : 'rgba(255,255,255,0.08)'}`,
                    color: isActive ? chip.color : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Scrollable Cards – Weaknesses */}
          <div className="flex-1 overflow-y-auto px-5 pb-12 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="space-y-2">
              {(() => {
                const filtered = session.weaknesses.filter(w => weaknessFilter === 'all' || w.severity === weaknessFilter);
                if (filtered.length === 0) {
                  const msg = weaknessFilter === 'high' ? 'Es gibt keine kritischen Einträge – gut gemacht!'
                    : weaknessFilter === 'medium' ? 'Es gibt keine Einträge mit mittlerer Priorität.'
                    : weaknessFilter === 'low' ? 'Es gibt keine Einträge mit geringer Priorität.'
                    : 'Keine Schwächen vorhanden.';
                  return (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle2 className="w-8 h-8 text-white/10 mb-3" />
                      <p className={`${poppins('Medium')} text-[13px] text-white/25`}>Keine Einträge vorhanden</p>
                      <p className={`${poppins('Regular')} text-[11px] text-white/15 mt-1`}>{msg}</p>
                    </div>
                  );
                }
                return filtered.map(w => {
                  const sevColor = w.severity === 'high' ? '#FF6B6B' : w.severity === 'medium' ? '#FFB84D' : '#00D4AA';
                  const sevLabel = w.severity === 'high' ? 'Kritisch' : w.severity === 'medium' ? 'Mittel' : 'Gering';
                  const sevBg = w.severity === 'high' ? 'rgba(255,107,107,0.12)' : w.severity === 'medium' ? 'rgba(255,184,77,0.12)' : 'rgba(0,212,170,0.12)';
                  const score = w.severity === 'high' ? 25 : w.severity === 'medium' ? 50 : 75;
                  const subjectName = w.subject || session.subject;

                  return (
                    <GlassCard key={w.id}>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`${poppins('Medium')} text-[10px] text-white/25 uppercase tracking-wider`}>
                            {subjectName}
                          </span>
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`${poppins('Medium')} text-[10px] text-white/50`}>{score}%</span>
                              <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }} />
                              </div>
                            </div>
                            <span className={`py-0.5 rounded-full ${poppins('SemiBold')} text-[10px] text-center`} style={{ color: sevColor, backgroundColor: sevBg, border: `1px solid ${sevColor}30`, minWidth: '62px' }}>
                              {sevLabel}
                            </span>
                          </div>
                        </div>
                        <h4 className={`${poppins('SemiBold')} text-[13px] text-white mb-2`}>{w.title}</h4>
                        <p className={`${poppins('Regular')} text-[11px] text-white/40 leading-relaxed mb-3`}>
                          {w.description}
                        </p>
                        <GlobalWeaknessActionButtons
                          source="weakness"
                          subject={subjectName}
                          topic={w.title}
                          severity={w.severity === 'high' ? 'critical' : w.severity === 'medium' ? 'warning' : 'moderate'}
                          recommendation={w.description}
                          onGenerate={(ctx) => onGenerateForWeakness?.({ ...ctx, contextLabel: `${session.subject}unterricht`, notificationLabel: 'Schwäche gezielt trainieren' })}
                          onStartExam={(ctx) => onStartExamForWeakness?.({ ...ctx, contextLabel: `${session.subject}unterricht`, notificationLabel: 'Schwäche gezielt trainieren' })}
                          onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                          allSets={allSets}
                        />
                      </div>
                    </GlassCard>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ===== ALL SESSION TASKS OVERLAY ===== */}
      {sessionTaskSubView === 'allSessionTasks' && (() => {
        const sessionTasks = allTeacherTasks.filter(t => t.sessionId === session.id);
        const openTasks = sessionTasks.filter(t => t.status !== 'completed');
        const completedTasks = sessionTasks.filter(t => t.status === 'completed');
        const visibleTasks = sessionTaskTab === 'open' ? openTasks : completedTasks;
        const isDone = sessionTaskTab === 'done';

        return (
          <div className="absolute inset-0 z-50 bg-[#0a0a0a] flex flex-col">
            {/* Overlay Header */}
            <div className="flex-shrink-0 px-5 pt-6 pb-4 flex items-center gap-3">
              <button
                onClick={() => setSessionTaskSubView(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <h2 className={`${poppins('SemiBold')} text-[17px] text-white flex-1`}>Aufgaben vom Lehrer</h2>
            </div>

            {/* Offen / Erledigt toggle */}
            <div className="px-5 pb-3">
              <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {(['open', 'done'] as const).map(tab => {
                  const isActive = sessionTaskTab === tab;
                  const label = tab === 'open' ? `Offen (${openTasks.length})` : `Erledigt (${completedTasks.length})`;
                  return (
                    <button
                      key={tab}
                      onClick={() => setSessionTaskTab(tab)}
                      className={`flex-1 py-1.5 rounded-md ${poppins('Medium')} text-[11px] transition-all`}
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
            </div>

            {/* Scrollable Cards */}
            <div className="flex-1 overflow-y-auto px-5 pb-12 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="space-y-2">
                {visibleTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle2 className="w-8 h-8 text-white/10 mb-3" />
                    <p className={`${poppins('Medium')} text-[13px] text-white/25`}>
                      {isDone ? 'Noch keine erledigten Aufgaben' : 'Alle Aufgaben erledigt!'}
                    </p>
                  </div>
                ) : visibleTasks.map(task => {
                  const isFlashcards = task.type === 'flashcards';
                  const title = cleanTaskTitle(task.title);
                  return (
                    <GlassCard key={task.id}>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`${poppins('Medium')} text-[10px] text-white/25 uppercase tracking-wider`}>
                            {task.subject}
                          </span>
                          <div className="flex items-center gap-2.5">
                            {isFlashcards && (
                              <div className="flex items-center gap-1.5">
                                <span className={`${poppins('Medium')} text-[10px] text-white/50`}>{task.score}%</span>
                                <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                                  <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${task.score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }} />
                                </div>
                              </div>
                            )}
                            {!isFlashcards && task.status === 'completed' && task.grade && (
                              <span className={`${poppins('SemiBold')} text-[10px] px-2 py-0.5 rounded-full`} style={{ color: gradeColor(task.grade), background: `${gradeColor(task.grade)}15`, border: `1px solid ${gradeColor(task.grade)}30` }}>
                                Note: {task.grade}
                              </span>
                            )}
                            {!isFlashcards && task.status === 'new' && (
                              <span className={`${poppins('Regular')} text-[9px] text-white/25`}>Noch nicht gestartet</span>
                            )}
                          </div>
                        </div>
                        <h4 className={`${poppins('SemiBold')} text-[13px] text-white mb-2`}>{title}</h4>
                        <p className={`${poppins('Regular')} text-[11px] text-white/40 leading-relaxed mb-2.5`}>
                          {task.description}
                        </p>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-white/20" />
                            <span className={`${poppins('Regular')} text-[10px] text-white/25`}>Aus Sitzung: {formatShortDate(task.assignedAt)}</span>
                          </div>
                          <span className={`${poppins('Regular')} text-[10px] text-white/25`}>
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
                                  onGenerateForWeakness?.({ topic: title, subject: task.subject, severity: 'high', recommendation: task.description, source: 'teacher-task', cardCount: task.cardCount, assignedDate: formatShortDate(task.assignedAt), teacherTaskId: task.id } as any);
                                } else {
                                  onStartExamForWeakness?.({ topic: title, subject: task.subject, severity: 'high', recommendation: task.description, source: 'teacher-task', examDurationMinutes: task.estimatedMinutes, assignedDate: formatShortDate(task.assignedAt), teacherTaskId: task.id } as any);
                                }
                              }}
                              className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg ${poppins('Medium')} text-[10px] transition-all active:scale-[0.97]`}
                              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.75)' }}
                            >
                              {isFlashcards ? <Layers className="w-3 h-3" /> : <ClipboardCheck className="w-3 h-3" />}
                              {hasLinkedSet ? 'Karteikarten fortsetzen' : isFlashcards ? 'Karteikarten erstellen' : 'Prüfung starten'}
                            </button>
                          );
                        })()}
                        {isDone && !isFlashcards && task.grade && (
                          <button
                            onClick={() => onStartExamForWeakness?.({ topic: title, subject: task.subject, severity: 'high', recommendation: task.description, source: 'teacher-task', examDurationMinutes: task.estimatedMinutes, assignedDate: formatShortDate(task.assignedAt), teacherTaskId: task.id } as any)}
                            className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg ${poppins('Medium')} text-[10px] transition-all active:scale-[0.97]`}
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
            </div>
          </div>
        );
      })()}
    </div>
  );
}