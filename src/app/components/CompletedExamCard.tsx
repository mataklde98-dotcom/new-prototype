import React, { useState } from 'react';
import { CheckCircle2, Clock, Trophy, Sparkles, ChevronRight } from 'lucide-react';
import SubtopicsModal from './SubtopicsModal';
import Checkbox from '@/app/components/Checkbox';

export interface CompletedExamCardData {
  id: string;
  topicName: string;
  subjectName: string;
  categoryName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  completedAt: string; // ISO date string
  badgeNumber: number | null; // For duplicate topics (#1, #2, etc)
  subtopicNames: string[];
  aiGenerated?: boolean;
  grade?: number; // German grade 1.0-6.0
}

interface CompletedExamCardProps {
  exam: CompletedExamCardData;
  onClick: () => void;
  isSelected?: boolean;
  onLongPress?: () => void;
}

// ⚡ PERFORMANCE: React.memo - verhindert unnötige Re-Renders!
const CompletedExamCard = React.memo(function CompletedExamCard({ exam, onClick, isSelected = false, onLongPress }: CompletedExamCardProps) {
  const [showSubtopicsModal, setShowSubtopicsModal] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return '#009379'; // Excellent - Green
    if (score >= 70) return '#4cadfd'; // Good - Blue
    if (score >= 50) return '#ffa500'; // Average - Orange
    return '#ff4444'; // Needs improvement - Red
  };

  const getGradeColor = (grade: number): string => {
    if (grade <= 2.0) return '#009379'; // Sehr gut / Gut - Green
    if (grade <= 3.0) return '#4cadfd'; // Befriedigend - Blue  
    if (grade <= 4.0) return '#ffa500'; // Ausreichend - Orange
    return '#ff4444'; // Mangelhaft / Ungenügend - Red
  };

  const getGradeText = (grade: number): string => {
    if (grade <= 1.5) return 'Sehr gut';
    if (grade <= 2.5) return 'Gut';
    if (grade <= 3.5) return 'Befriedigend';
    if (grade <= 4.5) return 'Ausreichend';
    if (grade <= 5.5) return 'Mangelhaft';
    return 'Ungenügend';
  };

  // Format subtopics display
  const getSubtopicsText = (): string => {
    if (exam.subtopicNames.length === 0) return 'Keine Unterthemen';
    if (exam.subtopicNames.length === 1) return exam.subtopicNames[0];
    return `${exam.subtopicNames.length} Unterthemen`;
  };

  const handleSubtopicsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setShowSubtopicsModal(true);
  };

  return (
    <>
      <SubtopicsModal
        isOpen={showSubtopicsModal}
        onClose={() => setShowSubtopicsModal(false)}
        subtopics={exam.subtopicNames}
        topicName={exam.topicName}
        subjectName={exam.subjectName}
        badgeNumber={exam.badgeNumber}
      />

      <div
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress?.();
      }}
      className={`
        group relative rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border transition-all duration-300 cursor-pointer
        border-white/[0.08]
        active:scale-[0.98]
      `}
      style={{
        WebkitTapHighlightColor: 'transparent',
        transform: 'translateZ(0)',
      }}
    >

      {/* Selection Checkbox */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10">
          <Checkbox checked={true} />
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10 p-3 flex flex-col h-full">
        {/* Header with Title and Badge */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              {/* Golden Badge VOR dem Namen (wie bei Flashcards) */}
              {exam.badgeNumber !== null && exam.badgeNumber !== undefined && (
                <span 
                  className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-['Poppins:SemiBold',sans-serif] flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(255, 215, 0, 0.15)',
                    color: '#FFD700',
                    border: '1px solid rgba(255, 215, 0, 0.3)'
                  }}
                >
                  #{exam.badgeNumber}
                </span>
              )}
              <h3 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white leading-[19px] truncate min-w-0">
                {exam.topicName}
              </h3>
            </div>
          </div>

          {/* AI Generated Badge */}
          {exam.aiGenerated && (
            <Sparkles className="w-[14px] h-[14px] text-[#FFD700] flex-shrink-0" strokeWidth={2.5} fill="#FFD700" />
          )}
        </div>

        {/* Subject & Subtopics (Clickable) */}
        <button
          onClick={handleSubtopicsClick}
          className="w-full text-left mb-2 group/subtopics"
          style={{
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <div className="flex items-center gap-1.5 transition-all duration-200">
            <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797] group-hover/subtopics:text-[#4cadfd] leading-[15px] transition-colors duration-200 flex-1 truncate">
              {exam.subjectName} • {getSubtopicsText()}
            </p>
            {exam.subtopicNames.length > 1 && (
              <ChevronRight 
                className="size-[12px] text-[#979797] group-hover/subtopics:text-[#4cadfd] flex-shrink-0 transition-colors duration-200" 
                strokeWidth={2.5} 
              />
            )}
          </div>
        </button>

        {/* GRADE DISPLAY (statt Progress Bar) */}
        {exam.grade && (
          <>
            <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="flex flex-col items-center justify-center min-w-[50px]">
                <div 
                  className="text-[22px] font-['Poppins:Bold',sans-serif] leading-none mb-0.5"
                  style={{ color: getGradeColor(exam.grade) }}
                >
                  {exam.grade.toFixed(1)}
                </div>
                <div className="text-[9px] font-['Poppins:Medium',sans-serif] text-[#707070]">
                  Note
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <div 
                  className="text-[12px] font-['Poppins:SemiBold',sans-serif]"
                  style={{ color: getGradeColor(exam.grade) }}
                >
                  {getGradeText(exam.grade)}
                </div>
                <div className="text-[10px] font-['Poppins:Medium',sans-serif] text-[#979797]">
                  {exam.correctAnswers}/{exam.totalQuestions} Richtig • {exam.score}%
                </div>
              </div>
            </div>
            {/* Time & Date - in one line */}
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1">
                <Clock className="size-[11px] text-[#979797] flex-shrink-0" />
                <span className="font-['Poppins:Medium',sans-serif] text-[#979797]">
                  Dauer: {formatTime(exam.timeSpent)}
                </span>
              </div>
              <div className="flex-1 font-['Poppins:Medium',sans-serif] text-[#707070] text-right">
                {formatDate(exam.completedAt)}
              </div>
            </div>
          </>
        )}

        {/* Stats Row (only if no grade available - fallback) */}
        {!exam.grade && (
          <>
            <div className="flex items-center gap-3 mb-2">
              {/* Score */}
              <div className="flex items-center gap-1">
                <Trophy className="size-[12px] flex-shrink-0" style={{ color: getScoreColor(exam.score) }} />
                <span className="font-['Poppins:SemiBold',sans-serif] text-[12px]" style={{ color: getScoreColor(exam.score) }}>
                  {exam.score}%
                </span>
              </div>

              {/* Questions */}
              <div className="flex items-center gap-1">
                <CheckCircle2 className="size-[12px] text-[#979797] flex-shrink-0" />
                <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797]">
                  {exam.correctAnswers}/{exam.totalQuestions}
                </span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1">
                <Clock className="size-[12px] text-[#979797] flex-shrink-0" />
                <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797]">
                  {formatTime(exam.timeSpent)}
                </span>
              </div>
            </div>
            {/* Date */}
            <div className="pt-1.5 border-t border-white/[0.06]">
              <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-[#707070]">
                Abgeschlossen: {formatDate(exam.completedAt)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
});

export default CompletedExamCard;