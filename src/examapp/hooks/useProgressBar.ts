// ==================== EXAM PROGRESS BAR HOOK ====================
// Extrahiert aus App.tsx - Progress-Bar-Berechnung und Auto-Scroll
// Verantwortlich für: getProgress(), Auto-Scroll-useEffects

import { useEffect, useCallback, useRef } from 'react';
import type { Question } from '../app/types/api-types';

type AnswerEntry = {
  answer: number | string | number[];
  showSolution?: boolean;
  skipped?: boolean;
};

export type ProgressBar = {
  questionIndex: number;
  color: string;
  height: number;
};

export type ProgressResult = {
  bars: ProgressBar[];
  scrollOffset: number;
  shouldCutLeft: boolean;
  shouldCutRight: boolean;
};

interface UseProgressBarProps {
  questions: Question[];
  answers: AnswerEntry[];
  currentQuestionIndex: number;
  totalQuestions: number;
  showResultsAtEnd: boolean;
  screen: string;
  isFirstLoad: boolean;
  isAnswerCorrect: (answer: number | string | number[], question: Question) => boolean;
}

interface UseProgressBarReturn {
  progressContainerRef: React.RefObject<HTMLDivElement | null>;
  contentScrollRef: React.RefObject<HTMLDivElement | null>;
  getProgress: () => ProgressResult;
}

export function useProgressBar({
  questions,
  answers,
  currentQuestionIndex,
  totalQuestions,
  showResultsAtEnd,
  screen,
  isFirstLoad,
  isAnswerCorrect,
}: UseProgressBarProps): UseProgressBarReturn {
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll progress bars to keep current question visible
  useEffect(() => {
    if (progressContainerRef.current) {
      // No scrolling needed - we render only the visible window
      // Container stays at scrollLeft = 0
      progressContainerRef.current.scrollLeft = 0;
    }
  }, [currentQuestionIndex, isFirstLoad, totalQuestions]);

  // Scroll content to top when question changes
  useEffect(() => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }
  }, [currentQuestionIndex]);

  const getProgress = useCallback((): ProgressResult => {
    const progressBars: ProgressBar[] = [];
    
    // Render ALL bars
    for (let i = 0; i < totalQuestions; i++) {
      if (i === currentQuestionIndex) {
        // Current question - white and taller
        if (answers[i] !== undefined) {
          // ==================== MODE: See results only at the end ====================
          // ✅ FIX: In feedback screen, ALWAYS show colors (even in "results at end" mode)
          if (showResultsAtEnd && screen !== 'feedback') {
            // Show neutral color (white) for answered questions in "See results at end" mode
            progressBars.push({
              questionIndex: i,
              color: '#ffffff',
              height: 11
            });
          } else {
            // ==================== MODE: Show feedback immediately (default) ====================
            const isSkipped = answers[i].skipped || false;
            const isCorrect = !isSkipped && isAnswerCorrect(answers[i].answer, questions[i]);
            progressBars.push({
              questionIndex: i,
              color: isSkipped ? '#797979' : isCorrect ? '#009379' : '#e74c3c',
              height: 11
            });
          }
        } else {
          progressBars.push({
            questionIndex: i,
            color: '#ffffff',
            height: 11
          });
        }
      } else if (answers[i] !== undefined) {
        // Answered question - show correct/wrong/skipped color OR neutral in "See results at end" mode
        // ==================== MODE: See results only at the end ====================
        // ✅ FIX: In feedback screen, ALWAYS show colors (even in "results at end" mode)
        if (showResultsAtEnd && screen !== 'feedback') {
          // Show neutral color for answered questions in "See results at end" mode
          progressBars.push({
            questionIndex: i,
            color: '#555555', // Gray for answered but not current
            height: 5
          });
        } else {
          // ==================== MODE: Show feedback immediately (default) ====================
          const isSkipped = answers[i].skipped || false;
          const isCorrect = !isSkipped && isAnswerCorrect(answers[i].answer, questions[i]);
          progressBars.push({
            questionIndex: i,
            color: isSkipped ? '#797979' : isCorrect ? '#009379' : '#e74c3c',
            height: 5
          });
        }
      } else {
        // Unanswered questions - gray
        progressBars.push({
          questionIndex: i,
          color: '#555555',
          height: 5
        });
      }
    }
    
    // Calculate scroll offset to keep current question centered
    const barWidth = 36; // width of each bar
    const gapWidth = 5;   // gap between bars
    const totalBarWidth = barWidth + gapWidth;
    
    let scrollOffset = 0;
    if (totalQuestions > 9) {
      if (currentQuestionIndex >= 7) {
        // Keep current at position 7
        scrollOffset = Math.min((currentQuestionIndex - 7) * totalBarWidth, (totalQuestions - 9) * totalBarWidth);
      }
    }
    
    const shouldCutLeft = currentQuestionIndex >= 8;
    const shouldCutRight = currentQuestionIndex < totalQuestions - 2;
    
    return { bars: progressBars, scrollOffset, shouldCutLeft, shouldCutRight };
  }, [questions, answers, currentQuestionIndex, totalQuestions, showResultsAtEnd, screen, isAnswerCorrect]);

  return {
    progressContainerRef,
    contentScrollRef,
    getProgress,
  };
}
