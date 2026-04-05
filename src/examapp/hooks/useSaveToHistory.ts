// ==================== SAVE TO HISTORY HOOK ====================
// Handles saving completed exam results to localStorage history
// Extracted from App.tsx Phase 5

import { useEffect } from 'react';
import { saveCompletedExam } from '../app/utils/completedExamsStorage';
import type { CompletedExam } from '../app/utils/completedExamsStorage';
import type { Question } from '../app/types/api-types';
import type { EvaluateExamResponse } from '../services/examSimulationTypes';
import type { AnswerEntry } from './useExamAnswers';
import type { SelectionState } from './useContentSelection';

interface UseSaveToHistoryProps {
  examSavedToHistory: boolean;
  setExamSavedToHistory: React.Dispatch<React.SetStateAction<boolean>>;
  examCompleted: boolean;
  screen: string;
  finalAnswers: AnswerEntry[];
  apiEvaluationResult: EvaluateExamResponse | null;
  questions: Question[];
  currentExamId: string;
  selectionState: SelectionState;
  examStartTime: number;
  userId: string;
  userRegistration: any;
  isAnswerCorrect: (answer: number | string | number[], question: Question) => boolean;
}

export function useSaveToHistory({
  examSavedToHistory,
  setExamSavedToHistory,
  examCompleted,
  screen,
  finalAnswers,
  apiEvaluationResult,
  questions,
  currentExamId,
  selectionState,
  examStartTime,
  userId,
  userRegistration,
  isAnswerCorrect,
}: UseSaveToHistoryProps): void {
  useEffect(() => {
    if (!examSavedToHistory && examCompleted && screen === 'results') {
      const skippedAnswers = finalAnswers.filter(a => a.skipped).length;
      let correctAnswers: number, incorrectAnswers: number, totalPoints: number, earnedPoints: number, grade: number;

      if (apiEvaluationResult) {
        totalPoints = apiEvaluationResult.pointsTotal;
        earnedPoints = apiEvaluationResult.pointsAchieved;
        grade = apiEvaluationResult.grade;
        correctAnswers = apiEvaluationResult.feedback.filter(f => f.isCorrect).length;
        incorrectAnswers = apiEvaluationResult.feedback.filter(f => !f.isCorrect).length - skippedAnswers;
      } else {
        correctAnswers = finalAnswers.filter((a, i) => !a.skipped && isAnswerCorrect(a.answer, questions[i])).length;
        incorrectAnswers = finalAnswers.filter((a, i) => !a.skipped && !isAnswerCorrect(a.answer, questions[i])).length;
        totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
        earnedPoints = finalAnswers.reduce((sum, a, i) => !a.skipped && isAnswerCorrect(a.answer, questions[i]) ? sum + questions[i].points : sum, 0);
        const pct = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
        grade = pct >= 92 ? 1.0 : pct >= 81 ? 2.0 : pct >= 67 ? 3.0 : pct >= 50 ? 4.0 : pct >= 30 ? 5.0 : 6.0;
      }

      const completedExam: CompletedExam = {
        id: currentExamId,
        userId,
        subjectId: selectionState.subject?.id || '',
        subjectName: selectionState.subject?.name || '',
        categoryId: selectionState.treeSelection
          ? Object.keys(selectionState.treeSelection).join(',')
          : selectionState.category?.id || '',
        categoryName: selectionState.treeSelection
          ? Object.values(selectionState.treeSelection).map(cs => cs.category.name).join(', ')
          : selectionState.category?.name || '',
        topicId: selectionState.treeSelection
          ? Object.values(selectionState.treeSelection).flatMap(cs => Object.keys(cs.topics)).join(',')
          : selectionState.selectedTopic?.id || selectionState.currentTopic?.id || '',
        topicName: selectionState.treeSelection
          ? Object.values(selectionState.treeSelection).flatMap(cs => 
              cs.allSelected ? [cs.category.name] : Object.values(cs.topics).map(ts => ts.topic.name)
            ).join(', ')
          : selectionState.selectedTopic?.name || selectionState.currentTopic?.name || '',
        subtopicIds: selectionState.selectedSubtopics?.map(st => st.id) || [],
        subtopicNames: selectionState.selectedSubtopics?.map(st => st.name) || [],
        score: totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0,
        totalQuestions: questions.length,
        correctAnswers,
        incorrectAnswers,
        unanswered: skippedAnswers,
        timeSpent: examStartTime > 0 ? Math.floor((Date.now() - examStartTime) / 1000) : 0,
        completedAt: new Date().toISOString(),
        questions,
        answers: finalAnswers,
        totalPoints,
        achievedPoints: earnedPoints,
        grade,
        userState: userRegistration?.state,
        userSchoolType: userRegistration?.schoolType,
        userGrade: userRegistration?.grade,
      };

      saveCompletedExam(completedExam);
      setExamSavedToHistory(true);
    }
  }, [examSavedToHistory, examCompleted, screen, finalAnswers, apiEvaluationResult, questions, currentExamId, selectionState, examStartTime, userId, userRegistration]);
}