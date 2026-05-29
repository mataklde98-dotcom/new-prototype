// ===== WEAKNESS / PRACTICE / PREP-TODO FLASHCARD CONFIG =====
// Configuration screen for generating flashcards from Lernanalyse or exam prep.
// source='weakness'         → "Schwäche gezielt trainieren", appears under Prognosen → Erkannte Schwächen
// source='risk'             → "Risiko-Thema vorbereiten", appears under Prognosen → Zukünftige Risiken
// source='knowledge-gap'    → "Wissenslücke schließen", appears under Prognosen → Wissenslücken
// source='teacher-task'     → "Lehrer-Aufgabe", appears under Meine Karteikarten → Lehrer
// source='practice'         → "Thema üben", appears under Meine Karteikarten → KI-Sets
// source='prep-todo'        → "Klassenarbeit-Vorbereitung", locked card count, appears under Meine Karteikarten → KI-Sets
// source='learning-goal'    → "Lernziel erreichen", appears under Meine Karteikarten → KI-Sets
// source='recommendation'   → "KI-Empfehlung", appears under Nachhilfe → KI-Empfehlungen

import { useState } from 'react';
import { AlertTriangle, Brain, Sparkles, BookOpen, Zap, ClipboardCheck, Lock } from 'lucide-react';
import PremiumSlider from '@/shared-content-selection/PremiumSlider';
import CloseButton from '@/app/components/CloseButton';
import Button from '@/app/components/Button';

interface WeaknessFlashcardConfigProps {
  topic: string;
  subject: string;
  severity: string; // 'critical' | 'warning' | 'moderate' | 'high' | 'medium' | 'low'
  recommendation: string;
  source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo' | 'learning-goal' | 'recommendation';
  lockedCardCount?: number; // for prep-todo: fixed card count from ToDo task
  examTitle?: string; // for prep-todo: the exam name e.g. "Mathe Klassenarbeit Nr. 4"
  assignedDate?: string; // for teacher-task: session date for display
  severityLabel?: string; // explicit label override for learning-goal context
  contextLabel?: string; // explicit notification text override (e.g. "Lernziel erreichen", "Klassenarbeit-Vorbereitung")
  notificationLabel?: string; // separate label for notification banner (e.g. "Schwäche gezielt trainieren", "Stärke weiter ausbauen")
  onStartGeneration: (count: number) => void;
  onClose: () => void;
}

export default function WeaknessFlashcardConfig({
  topic,
  subject,
  severity,
  recommendation,
  source = 'weakness',
  lockedCardCount,
  examTitle,
  assignedDate,
  severityLabel: severityLabelOverride,
  contextLabel,
  notificationLabel,
  onStartGeneration,
  onClose,
}: WeaknessFlashcardConfigProps) {
  const [count, setCount] = useState(lockedCardCount || 10);

  const isPractice = source === 'practice';
  const isExamPractice = isPractice && !!examTitle;
  const isKnowledgeGap = source === 'knowledge-gap';
  const isTeacherTask = source === 'teacher-task';
  const isRisk = source === 'risk';
  const isPrepTodo = source === 'prep-todo';
  const isLearningGoal = source === 'learning-goal';
  const isLearningGoalTodo = isLearningGoal && severityLabelOverride === 'ToDo';
  const isRecommendation = source === 'recommendation';

  // KI source: weakness/risk/knowledge-gap/recommendation (NOT teacher-task, NOT prep-todo, NOT free)
  const isKISource = !isPractice && !isTeacherTask && !isPrepTodo && !isLearningGoalTodo && (source === 'weakness' || source === 'risk' || source === 'knowledge-gap' || source === 'recommendation');

  const isCritical = severity === 'critical' || severity === 'high';
  const isWarning = severity === 'warning' || severity === 'medium';
  const severityLabel = isCritical ? 'Kritisch' : isWarning ? 'Mittel' : 'Gering';
  const severityColor = isCritical ? '#FF6B6B' : isWarning ? '#FFB84D' : '#00D4AA';

  // For KI-Empfehlungen: use recommendation-specific severity labels
  const recommendationSeverityLabel = isCritical ? 'Dringend' : isWarning ? 'Empfohlen' : 'Förderlich';

  // For exam practice: use insight-specific labels matching Stärken & Schwächen
  const examSeverityLabel = isCritical ? 'Kritisch' : isWarning ? 'Schwachstelle' : 'Stärke';

  // For learning goals: use goal-specific severity labels
  const goalSeverityLabel = isCritical ? 'Hoch' : isWarning ? 'Mittel' : 'Niedrig';

  // Practice & prep-todo mode uses a neutral green accent
  const practiceColor = '#00D4AA';
  
  // For exam practice, use severity color; for plain practice/prep-todo, use green
  const examPracticeColor = isExamPractice ? severityColor : practiceColor;
  
  // For prep-todo or teacher-task, the card count is locked
  const isCountLocked = ((isPrepTodo || isTeacherTask) && !!lockedCardCount) || isKISource;
  const effectiveCount = isCountLocked ? (lockedCardCount || count) : count;

  return (
    <div className="size-full flex flex-col bg-[#0a0a0a] overscroll-none relative">
      {/* Header */}
      <div className="px-6 py-3 flex-shrink-0 pt-safe lg:mt-[20px] mt-3">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="font-['Poppins:SemiBold',sans-serif] text-[16px] lg:text-[15px] text-white mb-1">
              Karteikarten erstellen
            </h1>
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[13px] text-[#979797]">
              {contextLabel || (isLearningGoal ? 'Lernziel erreichen' : isPrepTodo ? 'Klassenarbeit-Vorbereitung' : isExamPractice ? 'Klassenarbeit-Vorbereitung' : isPractice ? 'Thema üben' : isTeacherTask ? 'Lehrer-Aufgabe' : isRecommendation ? 'KI-Empfehlung' : isKnowledgeGap ? 'Wissenslücke schließen' : isRisk ? 'Risiko-Thema vorbereiten' : 'Karteikarten aus Lernanalyse')}
            </p>
          </div>
          <CloseButton onClick={onClose} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-40 overflow-y-auto overscroll-none">

        {/* Context Banner */}
        <div
          className="rounded-2xl p-5 mb-4 border"
          style={{
            background: (isPractice && !isExamPractice || isPrepTodo || isLearningGoalTodo || isTeacherTask)
              ? `linear-gradient(135deg, ${practiceColor}08 0%, ${practiceColor}03 100%)`
              : `linear-gradient(135deg, ${severityColor}08 0%, ${severityColor}03 100%)`,
            borderColor: (isPractice && !isExamPractice || isPrepTodo || isLearningGoalTodo || isTeacherTask) ? `${practiceColor}20` : `${severityColor}20`,
          }}
        >
          {/* Contextual label */}
          {contextLabel ? (
            <div className="flex items-center gap-1.5 mb-3">
              <Zap className="w-3.5 h-3.5" style={{ color: severityColor }} />
              <span
                className="font-['Poppins:SemiBold',sans-serif] text-[12px]"
                style={{ color: severityColor }}
              >
                {notificationLabel || contextLabel}
              </span>
            </div>
          ) : isLearningGoalTodo ? (
            <div className="flex items-center gap-1.5 mb-3">
              <ClipboardCheck className="w-3.5 h-3.5" style={{ color: practiceColor }} />
              <span
                className="font-['Poppins:SemiBold',sans-serif] text-[12px]"
                style={{ color: practiceColor }}
              >
                Lernziel erreichen
              </span>
            </div>
          ) : isLearningGoal ? (
            <div className="flex items-center gap-1.5 mb-3">
              <Zap className="w-3.5 h-3.5" style={{ color: severityColor }} />
              <span
                className="font-['Poppins:SemiBold',sans-serif] text-[12px]"
                style={{ color: severityColor }}
              >
                Lernziel erreichen
              </span>
            </div>
          ) : isExamPractice ? (
            <div className="flex items-center gap-1.5 mb-3">
              <ClipboardCheck className="w-3.5 h-3.5" style={{ color: severityColor }} />
              <span
                className="font-['Poppins:SemiBold',sans-serif] text-[12px]"
                style={{ color: severityColor }}
              >
                Klassenarbeit-Vorbereitung
              </span>
            </div>
          ) : isPrepTodo ? (
            <div className="flex items-center gap-1.5 mb-3">
              <ClipboardCheck className="w-3.5 h-3.5" style={{ color: practiceColor }} />
              <span
                className="font-['Poppins:SemiBold',sans-serif] text-[12px]"
                style={{ color: practiceColor }}
              >
                Klassenarbeit-Vorbereitung
              </span>
            </div>
          ) : isTeacherTask ? (
            <div className="flex items-center gap-1.5 mb-3">
              <ClipboardCheck className="w-3.5 h-3.5" style={{ color: practiceColor }} />
              <span
                className="font-['Poppins:SemiBold',sans-serif] text-[12px]"
                style={{ color: practiceColor }}
              >
                Lehrer-Aufgabe
              </span>
            </div>
          ) : isRecommendation ? (
            <div className="flex items-center gap-1.5 mb-3">
              <Zap className="w-3.5 h-3.5" style={{ color: severityColor }} />
              <span
                className="font-['Poppins:SemiBold',sans-serif] text-[12px]"
                style={{ color: severityColor }}
              >
                KI-Empfehlung
              </span>
            </div>
          ) : !isPractice && (
            <div className="flex items-center gap-1.5 mb-3">
              <Zap className="w-3.5 h-3.5" style={{ color: severityColor }} />
              <span
                className="font-['Poppins:SemiBold',sans-serif] text-[12px]"
                style={{ color: severityColor }}
              >
                {isKnowledgeGap ? 'Wissenslücke schließen' : isRisk ? 'Risiko-Thema vorbereiten' : 'Schwäche gezielt trainieren'}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/25 uppercase tracking-wider">
              {subject}{isTeacherTask && assignedDate ? ` · ${assignedDate}` : ''}
            </span>
            {isExamPractice ? (
              <span
                className="px-3 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px] text-center whitespace-nowrap"
                style={{
                  color: severityColor,
                  backgroundColor: `${severityColor}15`,
                  border: `1px solid ${severityColor}30`,
                  minWidth: '62px',
                }}
              >
                {severityLabelOverride || examSeverityLabel}
              </span>
            ) : isPrepTodo ? (
              <span
                className="px-3 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px] text-center whitespace-nowrap"
                style={{
                  color: practiceColor,
                  backgroundColor: `${practiceColor}15`,
                  border: `1px solid ${practiceColor}30`,
                  minWidth: '62px',
                }}
              >
                ToDo
              </span>
            ) : isLearningGoalTodo ? (
              <span
                className="px-3 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px] text-center whitespace-nowrap"
                style={{
                  color: practiceColor,
                  backgroundColor: `${practiceColor}15`,
                  border: `1px solid ${practiceColor}30`,
                  minWidth: '62px',
                }}
              >
                ToDo
              </span>
            ) : isLearningGoal ? (
              <span
                className="px-3 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px] text-center whitespace-nowrap"
                style={{
                  color: severityColor,
                  backgroundColor: `${severityColor}15`,
                  border: `1px solid ${severityColor}30`,
                  minWidth: '62px',
                }}
              >
                {severityLabelOverride || examSeverityLabel}
              </span>
            ) : isTeacherTask ? null : !isPractice && (
              <span
                className="px-3 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px] text-center whitespace-nowrap"
                style={{
                  color: severityColor,
                  backgroundColor: `${severityColor}15`,
                  border: `1px solid ${severityColor}30`,
                  minWidth: '62px',
                }}
              >
                {severityLabelOverride || (isRecommendation ? recommendationSeverityLabel : severityLabel)}
              </span>
            )}
          </div>
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
            {topic}
          </h3>
          {(isPrepTodo || isExamPractice || isLearningGoal) && examTitle && (
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35 mt-1">
              {examTitle}
            </p>
          )}
        </div>

        {/* Slider Card – locked in prep-todo mode */}
        <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl p-5 mb-4">
          {isCountLocked ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80">Karteikarten</span>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-white/30" />
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">{effectiveCount}</span>
                </div>
              </div>
              <div className="w-full h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '100%', background: `linear-gradient(90deg, ${practiceColor}60, ${practiceColor}30)` }} />
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30 mt-2 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                {isTeacherTask ? `Anzahl durch Lehrer-Aufgabe festgelegt${assignedDate ? ` · ${assignedDate}` : ''}` : isKISource ? 'Anzahl von der KI festgelegt' : 'Anzahl durch ToDo-Aufgabe festgelegt'}
              </p>
            </div>
          ) : (
            <PremiumSlider
              value={count}
              min={5}
              max={50}
              step={5}
              onChange={(v) => setCount(v)}
              label="Karteikarten"
            />
          )}
        </div>

        {/* Info Banner */}
        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{
            background: 'linear-gradient(135deg, rgba(0,184,148,0.08) 0%, rgba(0,184,148,0.03) 100%)',
            border: '1px solid rgba(0,184,148,0.15)',
          }}
        >
          <Brain className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#00B894' }} />
          <div>
            <p className="font-['Poppins:Medium',sans-serif] text-[12px] mb-1" style={{ color: 'rgba(0,184,148,0.9)' }}>
              KI-generierte Karteikarten
            </p>
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 leading-relaxed">
              {isPrepTodo
                ? <>Basierend auf deiner Klassenarbeit-Vorbereitung werden {lockedCardCount} Karteikarten zu <span className="text-white/60">{topic}</span> generiert. Das Set erscheint unter <span className="text-white/60">Meine Karteikarten &rarr; KI-Sets</span>.</>
                : isLearningGoal
                ? <>Basierend auf deinem Lernziel werden KI-Karteikarten zu <span className="text-white/60">{topic}</span> generiert. Das Set erscheint unter <span className="text-white/60">Meine Karteikarten &rarr; KI-Sets</span>.</>
                : isExamPractice
                ? <>Basierend auf deiner Klassenarbeit-Vorbereitung werden KI-Karteikarten zu <span className="text-white/60">{topic}</span> generiert. Das Set erscheint unter <span className="text-white/60">Meine Karteikarten &rarr; KI-Sets</span>.</>
                : isPractice
                ? <>Basierend auf dem ausgewählten Thema werden KI-Karteikarten generiert. Das Set erscheint unter <span className="text-white/60">Meine Karteikarten &rarr; KI-Sets</span>.</>
                : isKnowledgeGap
                ? <>Basierend auf deiner Lernanalyse werden gezielt Karteikarten zu deiner Wissenslücke generiert. Das Set erscheint unter <span className="text-white/60">Meine Karteikarten &rarr; Prognosen &rarr; Wissenslücken</span>.</>
                : isTeacherTask
                ? <>Basierend auf der Aufgabe deines Lehrers werden {lockedCardCount ? <>{lockedCardCount} </> : null}KI-Karteikarten zu <span className="text-white/60">{topic}</span> generiert. Das Set erscheint unter <span className="text-white/60">Meine Karteikarten &rarr; Lehrer</span>.</>
                : isRisk
                ? <>Basierend auf deiner Lernanalyse werden gezielt Karteikarten zu einem zukünftigen Risiko-Thema generiert. Das Set erscheint unter <span className="text-white/60">Meine Karteikarten &rarr; Prognosen &rarr; Zukünftige Risiken</span>.</>
                : isRecommendation
                ? <>Basierend auf der KI-Empfehlung werden gezielt Karteikarten zu <span className="text-white/60">{topic}</span> generiert. Das Set erscheint unter <span className="text-white/60">Nachhilfe &rarr; KI-Empfehlungen</span>.</>
                : <>Basierend auf deiner Lernanalyse werden gezielt Karteikarten zu deiner Schwäche generiert. Das Set erscheint unter <span className="text-white/60">Meine Karteikarten &rarr; Prognosen &rarr; Erkannte Schwächen</span>.</>
              }
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-safe bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent pt-12 mb-4">
        <Button size="lg" onClick={() => onStartGeneration(effectiveCount)}>
          {effectiveCount} Karteikarten generieren
        </Button>
      </div>
    </div>
  );
}