import { useState } from 'react';
import { Zap, ClipboardCheck, Lock } from 'lucide-react';
import SubjectIcon from './SubjectIcon';
import { type Subtopic } from '../data/subtopics';
import ExamTutorialModal from './ExamTutorialModal';
import PremiumSlider from '@/shared-content-selection/PremiumSlider';
import Checkbox from '@/app/components/Checkbox';
import Button from '@/app/components/Button';
import CloseButton from '@/app/components/CloseButton';

type ExamConfigurationProps = {
  subjectId: string;
  selectedSubtopics: Subtopic[];
  onStartExam: (duration: number, showResultsAtEnd: boolean) => void;
  onBack: () => void;
  onEditSubtopics: () => void;
  lockedMode?: boolean;
  weaknessTopic?: string;
  weaknessSubject?: string;
  weaknessSeverity?: string;
  contextLabel?: string;
  source?: string;
  examTitle?: string;
  lockedDuration?: number;
  assignedDate?: string; // session date for teacher-task display
  contentLabel?: string; // Custom label instead of "Unterthemen" (e.g. "Inhalte")
  severityLabel?: string; // explicit label override for learning-goal context
  notificationLabel?: string; // separate label for notification banner in locked card
};

export default function ExamConfiguration({ 
  subjectId,
  selectedSubtopics, 
  onStartExam, 
  onBack,
  onEditSubtopics,
  lockedMode = false,
  weaknessTopic,
  weaknessSubject,
  weaknessSeverity,
  contextLabel = 'Schwäche gezielt trainieren',
  source,
  examTitle,
  lockedDuration,
  assignedDate,
  contentLabel,
  severityLabel: severityLabelOverride,
  notificationLabel,
}: ExamConfigurationProps) {
  const isKISource = source === 'weakness' || source === 'risk' || source === 'knowledge-gap' || source === 'recommendation';
  const isDurationLocked = ((source === 'prep-todo' || source === 'teacher-task') && !!lockedDuration) || isKISource;
  const isExamPractice = source === 'practice' && !!examTitle;
  const isLearningGoal = source === 'learning-goal';
  const isLearningGoalTodo = isLearningGoal && severityLabelOverride === 'ToDo';
  const isRecommendation = source === 'recommendation';
  const [duration, setDuration] = useState(lockedDuration || 10);
  const effectiveDuration = isDurationLocked ? (lockedDuration || duration) : duration;
  const [showResultsAtEnd, setShowResultsAtEnd] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleCreateExam = () => {
    onStartExam(effectiveDuration, showResultsAtEnd);
  };

  const handleSliderChange = (newValue: number) => {
    setDuration(newValue);
  };

  return (
    <div className="size-full flex flex-col bg-[#0a0a0a] overscroll-none relative">
      {/* Header */}
      <div className="px-6 py-3 flex-shrink-0 pt-safe lg:mt-[20px] mt-3">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="font-['Poppins:SemiBold',sans-serif] text-[16px] lg:text-[15px] text-white mb-1">
              Prüfungssimulation
            </h1>
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[13px] text-[#979797]">
              {contextLabel !== 'Schwäche gezielt trainieren' ? contextLabel : (isLearningGoal ? 'Lernziel erreichen' : (source === 'prep-todo' || isExamPractice) ? 'Klassenarbeit-Vorbereitung' : source === 'teacher-task' ? 'Lehrer-Aufgabe' : isRecommendation ? 'KI-Empfehlung' : 'Prüfungseinstellungen')}
            </p>
          </div>
          <CloseButton onClick={onBack} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-40 overflow-y-auto overscroll-none">

        {/* Locked Mode Context Card */}
        {lockedMode && weaknessTopic && (() => {
          const isPractice = source === 'practice';
          const isPrepTodo = source === 'prep-todo';
          const isTeacherTask = source === 'teacher-task';
          const isCritical = weaknessSeverity === 'critical' || weaknessSeverity === 'high';
          const isWarning = weaknessSeverity === 'warning' || weaknessSeverity === 'medium';
          const severityColor = isCritical ? '#FF6B6B' : isWarning ? '#FFB84D' : '#00D4AA';
          const severityLabel = isRecommendation ? (isCritical ? 'Dringend' : isWarning ? 'Empfohlen' : 'Förderlich') : (isCritical ? 'Kritisch' : isWarning ? 'Mittel' : 'Gering');
          const examSeverityLabel = isCritical ? 'Kritisch' : isWarning ? 'Schwachstelle' : 'Stärke';
          const goalSeverityLabel = isCritical ? 'Hoch' : isWarning ? 'Mittel' : 'Niedrig';
          const practiceColor = '#00D4AA';
          const cardColor = isTeacherTask ? practiceColor : isLearningGoalTodo ? practiceColor : isLearningGoal ? severityColor : isExamPractice ? severityColor : (isPractice || isPrepTodo) ? practiceColor : severityColor;
          return (
          <div className="rounded-2xl p-5 mb-3 border" style={{
            background: `linear-gradient(135deg, ${cardColor}08 0%, ${cardColor}03 100%)`,
            borderColor: `${cardColor}20`,
          }}>
            {/* Contextual label */}
            {isLearningGoalTodo ? (
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
            ) : !isPractice && (
            <div className="flex items-center gap-1.5 mb-3">
              <Zap className="w-3.5 h-3.5" style={{ color: cardColor }} />
              <span
                className="font-['Poppins:SemiBold',sans-serif] text-[12px]"
                style={{ color: cardColor }}
              >
                {notificationLabel || contextLabel}
              </span>
            </div>
            )}
            {/* Subject + Badge row */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/25 uppercase tracking-wider">
                {weaknessSubject}{isTeacherTask && assignedDate ? ` · ${assignedDate}` : ''}
              </span>
              {isTeacherTask ? null : isExamPractice ? (
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
                  {severityLabelOverride || goalSeverityLabel}
                </span>
              ) : !isPractice && (
                <span
                  className="px-3 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px] text-center whitespace-nowrap"
                  style={{
                    color: severityColor,
                    backgroundColor: `${severityColor}15`,
                    border: `1px solid ${severityColor}30`,
                    minWidth: '62px',
                  }}
                >
                  {severityLabelOverride || severityLabel}
                </span>
              )}
            </div>
            {/* Topic */}
            <h3 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
              {weaknessTopic}
            </h3>
            {(isPrepTodo || isExamPractice || isLearningGoal) && examTitle && (
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35 mt-1">
                {examTitle}
              </p>
            )}
          </div>
          );
        })()}

        {/* Slider Card */}
        <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl p-5 mb-3">
          {isDurationLocked ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80">Prüfungsdauer</span>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-white/30" />
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">{effectiveDuration} min</span>
                </div>
              </div>
              <div className="w-full h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '100%', background: 'linear-gradient(90deg, #00D4AA60, #00D4AA30)' }} />
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30 mt-2 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                {source === 'teacher-task' ? `Dauer durch Lehrer-Aufgabe festgelegt${assignedDate ? ` · ${assignedDate}` : ''}` : isKISource ? 'Dauer von der KI festgelegt' : 'Dauer durch ToDo-Aufgabe festgelegt'}
              </p>
            </div>
          ) : (
          <PremiumSlider
            value={duration}
            min={5}
            max={40}
            step={1}
            onChange={handleSliderChange}
            label="Prüfungsdauer"
            unit="min"
          />
          )}
        </div>

        {/* Unterthemen Row — tappable, opens edit (hidden in locked mode) */}
        {!lockedMode && (
        <div
          className="w-full bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl px-4 h-[54px] flex items-center gap-3 mb-3 transition-all duration-150 cursor-pointer active:scale-[0.98] active:border-white/[0.15]"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          onClick={onEditSubtopics}
        >
          <div className="w-[32px] h-[32px] rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
            <SubjectIcon subjectId={subjectId} />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white truncate">
              {contentLabel 
                ? 'Prüfungsinhalte'
                : `${selectedSubtopics.length} ${selectedSubtopics.length === 1 ? 'Unterthema' : 'Unterthemen'}`
              }
            </p>
          </div>
              <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-[#009379] flex-shrink-0">
                Bearbeiten
              </span>
              <svg className="w-[14px] h-[14px] text-[#009379]/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
        </div>
        )}

        {/* Checkbox: Show results at end */}
        <div 
          className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] h-[54px] rounded-2xl px-4 flex items-center cursor-pointer transition-all duration-150 active:scale-[0.98] mb-5"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          onClick={() => setShowResultsAtEnd(!showResultsAtEnd)}
        >
          <Checkbox
            checked={showResultsAtEnd}
          />
          <p className="font-['Poppins:Medium',sans-serif] text-[13px] lg:text-[14px] text-white/60 ml-3">
            Ergebnisse nur am Ende anzeigen
          </p>
        </div>

        {/* Tutorial Link */}
        <div className="text-center">
          <p 
            className="font-['Poppins:Medium',sans-serif] text-[13px] lg:text-[14px] text-[#797979] cursor-pointer transition-colors underline decoration-dotted underline-offset-4" 
            onClick={() => setShowTutorial(true)}
          >
            Wie funktioniert eine Prüfung?
          </p>
        </div>
      </div>

      {/* CTA Button — fixed bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 10 }}>
        <div 
          className="h-[80px]"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)' }}
        />
        <div className="px-6 pb-6 bg-[#0a0a0a] pointer-events-auto">
          <Button onClick={handleCreateExam}>
            Prüfung erstellen
          </Button>
        </div>
      </div>

      {/* Tutorial Modal */}
      <ExamTutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </div>
  );
}