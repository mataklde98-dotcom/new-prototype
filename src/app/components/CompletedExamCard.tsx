import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Clock, ChevronRight, BookOpen, Layers, X, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Checkbox from '@/app/components/Checkbox';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ExamScopeCategory {
  name: string;
  topics: {
    name: string;
    subtopics: string[];
  }[];
}

export interface CompletedExamCardData {
  id: string;
  topicName: string;
  subjectName: string;
  categoryName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
  badgeNumber: number | null;
  subtopicNames: string[];
  aiGenerated?: boolean;
  grade?: number;
  examScope?: ExamScopeCategory[];
}

interface CompletedExamCardProps {
  exam: CompletedExamCardData;
  onClick: () => void;
  isSelected?: boolean;
  onLongPress?: () => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Build normalized scope from legacy single-field data or new multi-category data */
function buildScope(exam: CompletedExamCardData): ExamScopeCategory[] {
  if (exam.examScope && exam.examScope.length > 0) return exam.examScope;
  return [{
    name: exam.categoryName,
    topics: [{
      name: exam.topicName,
      subtopics: exam.subtopicNames,
    }],
  }];
}

/**
 * Smart, human-readable summary of exam scope.
 * Adapts to 1 category, 2 categories, 3+ categories.
 * Focuses on dominant content, not raw dumps.
 */
function getScopeSummary(scope: ExamScopeCategory[]): { title: string; subtitle: string } {
  const totalCategories = scope.length;
  const totalTopics = scope.reduce((acc, c) => acc + c.topics.length, 0);
  const totalSubtopics = scope.reduce((acc, c) => acc + c.topics.reduce((a, t) => a + t.subtopics.length, 0), 0);

  if (totalCategories === 1) {
    const cat = scope[0];
    if (cat.topics.length === 1) {
      const topic = cat.topics[0];
      return {
        title: cat.name,
        subtitle: topic.subtopics.length > 0
          ? `${topic.name} · ${topic.subtopics.length} ${topic.subtopics.length === 1 ? 'Unterthema' : 'Unterthemen'}`
          : topic.name,
      };
    }
    return {
      title: cat.name,
      subtitle: `${cat.topics.length} Themen · ${totalSubtopics} Unterthemen`,
    };
  }

  if (totalCategories === 2) {
    return {
      title: `${scope[0].name} & ${scope[1].name}`,
      subtitle: `${totalTopics} Themen · ${totalSubtopics} Unterthemen`,
    };
  }

  // 3+
  return {
    title: `${scope[0].name}, ${scope[1].name} & ${totalCategories - 2} weitere`,
    subtitle: `${totalTopics} Themen · ${totalSubtopics} Unterthemen`,
  };
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateLong(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}

function getGradeColor(grade: number): string {
  if (grade <= 2.0) return '#34C759';
  if (grade <= 3.0) return '#5AC8FA';
  if (grade <= 4.0) return '#FF9F0A';
  return '#FF453A';
}

function getGradeText(grade: number): string {
  if (grade <= 1.5) return 'Sehr gut';
  if (grade <= 2.5) return 'Gut';
  if (grade <= 3.5) return 'Befriedigend';
  if (grade <= 4.5) return 'Ausreichend';
  if (grade <= 5.5) return 'Mangelhaft';
  return 'Ungenügend';
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#34C759';
  if (score >= 70) return '#5AC8FA';
  if (score >= 50) return '#FF9F0A';
  return '#FF453A';
}

// ─── Scope Detail Panel (Apple Health-style slide-up) ──────────────────────

function ExamScopePanel({
  isOpen,
  onClose,
  exam,
  scope,
}: {
  isOpen: boolean;
  onClose: () => void;
  exam: CompletedExamCardData;
  scope: ExamScopeCategory[];
}) {
  const totalTopics = scope.reduce((acc, c) => acc + c.topics.length, 0);
  const totalSubtopics = scope.reduce((acc, c) => acc + c.topics.reduce((a, t) => a + t.subtopics.length, 0), 0);

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998]"
            style={{ background: 'rgba(0,0,0,0.65)', WebkitTapHighlightColor: 'transparent' }}
          />

          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 380 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] max-h-[85vh] flex flex-col"
            style={{
              background: '#141414',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {/* Drag indicator */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-[4px] rounded-full bg-white/15" />
            </div>

            {/* Header */}
            <div className="px-5 pt-2 pb-4 flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-['Poppins:Medium',sans-serif] text-[11px] tracking-wide uppercase mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {exam.subjectName} · {formatDateLong(exam.completedAt)}
                </p>
                <h2 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white leading-[24px]">
                  Prüfungsumfang
                </h2>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {scope.length} {scope.length === 1 ? 'Kategorie' : 'Kategorien'} · {totalTopics} {totalTopics === 1 ? 'Thema' : 'Themen'} · {totalSubtopics} {totalSubtopics === 1 ? 'Unterthema' : 'Unterthemen'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center size-[30px] rounded-full flex-shrink-0 ml-3 active:scale-90 transition-transform"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <X className="size-[14px] text-white/60" strokeWidth={2} />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

            {/* Scrollable scope content */}
            <div
              className="flex-1 overflow-y-auto px-5 py-4"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="space-y-5">
                {scope.map((category, ci) => (
                  <div key={ci}>
                    {/* Category */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div
                        className="flex items-center justify-center size-[28px] rounded-lg flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      >
                        <Layers className="size-[14px] text-white/40" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/80 leading-[18px]">
                          {category.name}
                        </p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                          {category.topics.length} {category.topics.length === 1 ? 'Thema' : 'Themen'}
                        </p>
                      </div>
                    </div>

                    {/* Topics as grouped list */}
                    <div
                      className="ml-1 rounded-xl overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      {category.topics.map((topic, ti) => (
                        <div key={ti}>
                          {ti > 0 && <div className="mx-4 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />}
                          <div className="px-4 py-3">
                            {/* Topic name */}
                            <div className="flex items-start gap-2.5">
                              <BookOpen className="size-[13px] text-white/25 flex-shrink-0 mt-[2px]" strokeWidth={1.5} />
                              <p className="font-['Poppins:Medium',sans-serif] text-[12.5px] text-white/65 leading-[17px] flex-1">
                                {topic.name}
                              </p>
                            </div>

                            {/* Subtopics */}
                            {topic.subtopics.length > 0 && (
                              <div className="ml-[23px] mt-2 flex flex-wrap gap-1.5">
                                {topic.subtopics.map((sub, si) => (
                                  <span
                                    key={si}
                                    className="font-['Poppins:Regular',sans-serif] text-[10.5px] leading-[14px] px-2 py-[3px] rounded-md"
                                    style={{
                                      background: 'rgba(255,255,255,0.04)',
                                      color: 'rgba(255,255,255,0.45)',
                                      border: '1px solid rgba(255,255,255,0.05)',
                                    }}
                                  >
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Category separator */}
                    {ci < scope.length - 1 && (
                      <div className="mt-5" />
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom padding for safe area */}
              <div className="h-8" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ─── Main Card Component ───────────────────────────────────────────────────

const CompletedExamCard = React.memo(function CompletedExamCard({
  exam,
  onClick,
  isSelected = false,
  onLongPress,
}: CompletedExamCardProps) {
  const [showScopePanel, setShowScopePanel] = useState(false);
  const scope = buildScope(exam);
  const { title, subtitle } = getScopeSummary(scope);

  const hasGrade = exam.grade != null;
  const gradeColor = hasGrade ? getGradeColor(exam.grade!) : getScoreColor(exam.score);

  const handleScopeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowScopePanel(true);
  };

  return (
    <>
      {/* Scope Detail Panel */}
      <ExamScopePanel
        isOpen={showScopePanel}
        onClose={() => setShowScopePanel(false)}
        exam={exam}
        scope={scope}
      />

      {/* Card */}
      <div
        onClick={onClick}
        onContextMenu={(e) => { e.preventDefault(); onLongPress?.(); }}
        className="relative active:scale-[0.98] transition-transform duration-150 cursor-pointer"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {/* Selection checkbox */}
        {isSelected && (
          <div className="absolute top-3 right-3 z-10">
            <Checkbox checked={true} />
          </div>
        )}

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="p-4">
            {/* Row 1: Subject + Date */}
            <div className="flex items-center justify-between mb-2.5">
              <span
                className="font-['Poppins:Medium',sans-serif] text-[10.5px] tracking-[0.04em] uppercase"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                {exam.subjectName}
              </span>
              <span
                className="font-['Poppins:Regular',sans-serif] text-[10.5px]"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                {formatDate(exam.completedAt)}
              </span>
            </div>

            {/* Row 2: Smart Title */}
            <h3 className="font-['Poppins:SemiBold',sans-serif] text-[14.5px] text-white/90 leading-[20px] mb-0.5">
              {title}
            </h3>

            {/* Row 3: Scope subtitle – tappable to open detail panel */}
            <button
              onClick={handleScopeClick}
              className="flex items-center gap-1.5 mb-3 group/scope"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span
                className="font-['Poppins:Regular',sans-serif] text-[11.5px] transition-colors duration-150 group-hover/scope:text-white/50"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {subtitle}
              </span>
              <span
                className="flex items-center justify-center size-[16px] rounded-full flex-shrink-0 transition-colors duration-150 group-hover/scope:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <ChevronRight
                  className="size-[9px]"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                  strokeWidth={2.5}
                />
              </span>
            </button>

            {/* Row 4: Performance + Meta */}
            <div className="flex items-center">
              {/* Grade or Score */}
              {hasGrade ? (
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-['Poppins:Bold',sans-serif] text-[18px] leading-none"
                    style={{ color: gradeColor }}
                  >
                    {exam.grade!.toFixed(1)}
                  </span>
                  <span
                    className="font-['Poppins:Medium',sans-serif] text-[11.5px]"
                    style={{ color: gradeColor, opacity: 0.75 }}
                  >
                    {getGradeText(exam.grade!)}
                  </span>
                </div>
              ) : (
                <span
                  className="font-['Poppins:Bold',sans-serif] text-[18px] leading-none"
                  style={{ color: gradeColor }}
                >
                  {exam.score}%
                </span>
              )}

              {/* Separator */}
              <div className="w-px h-3 mx-2.5" style={{ background: 'rgba(255,255,255,0.08)' }} />

              {/* Correct answers */}
              <span
                className="font-['Poppins:Regular',sans-serif] text-[11px]"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                {exam.correctAnswers}/{exam.totalQuestions} richtig
              </span>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Duration */}
              <div className="flex items-center gap-1">
                <Clock className="size-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }} strokeWidth={1.5} />
                <span
                  className="font-['Poppins:Regular',sans-serif] text-[10.5px]"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                >
                  {formatTime(exam.timeSpent)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default CompletedExamCard;