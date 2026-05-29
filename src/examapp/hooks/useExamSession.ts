// ==================== EXAM SESSION HOOK ====================
// Extrahiert aus App.tsx - Session-Management für die Prüfungssimulation
// Verantwortlich für: ExamSession, QuestionTiming, Auto-Save, API-Integration (prepareDataForAI)

import { useState, useCallback } from 'react';
import type { 
  ExamSession, 
  ExamConfiguration as ExamConfigType, 
  QuestionTiming, 
  ExamAttempt,
  Question
} from '../app/types/api-types';
import type { GenerateExamQuestion, EvaluateExamResponse } from '../services/examSimulationTypes';
import { formatAnswersForAPI, calculateTimeSpent as calcTimeSpent } from '../services/examSimulationApi';
import { 
  generateId, 
  getCurrentTimestamp, 
} from '../app/utils/api-utils';
import { 
  autoSaveExam, 
  clearAllExamData, 
} from '../app/utils/storage-utils';

type SelectionState = {
  subject?: { id: string; name: string };
  category?: { id: string; name: string };
  selectedTopic?: { id: string; name: string };
  subtopicsByTopic?: { [topicId: string]: Array<{ id: string; name: string }> };
  currentTopic?: { id: string; name: string };
  selectedSubtopics?: Array<{ id: string; name: string }>;
  treeSelection?: {
    [categoryId: string]: {
      category: { id: string; name: string };
      allSelected: boolean;
      topics: {
        [topicId: string]: {
          topic: { id: string; name: string };
          allSelected: boolean;
          subtopicIds: string[];
        };
      };
    };
  };
};

interface UseExamSessionProps {
  userId: string;
  questions: Question[];
  apiQuestions: GenerateExamQuestion[];
  showResultsAtEnd: boolean;
  examConfig: ExamConfigType;
  selectionState: SelectionState;
  setSelectionState: React.Dispatch<React.SetStateAction<SelectionState>>;
  subtopicsCache: { [topicId: string]: Array<{ id: string; name: string }> };
  timer: number;
  answers: Array<{ answer: number | string | number[]; showSolution?: boolean; skipped?: boolean }>;
  visitedQuestions: Set<number>;
  selectedAnswer: number | null;
  selectedAnswers: number[];
  textAnswer: string;
  currentQuestionIndex: number;
  currentExamId: string;
  examStartTime: number;
  evaluateExamAPI: (params: any) => void;
}

interface UseExamSessionReturn {
  // State
  examSession: ExamSession | null;
  setExamSession: React.Dispatch<React.SetStateAction<ExamSession | null>>;
  questionTimings: QuestionTiming[];
  setQuestionTimings: React.Dispatch<React.SetStateAction<QuestionTiming[]>>;
  examAttempt: ExamAttempt;
  setExamAttempt: React.Dispatch<React.SetStateAction<ExamAttempt>>;
  examConfig: ExamConfigType;
  setExamConfig: React.Dispatch<React.SetStateAction<ExamConfigType>>;

  // Functions
  startExamSession: () => ExamSession;
  endExamSession: (status: 'completed' | 'abandoned') => ExamSession | undefined;
  startQuestionTiming: (questionIndex: number) => void;
  updateQuestionTiming: (questionIndex: number, timeSpent: number) => void;
  markQuestionAnswered: (questionIndex: number) => void;
  performAutoSave: () => void;
  prepareDataForAI: () => void;
}

export function useExamSession({
  userId,
  questions,
  apiQuestions,
  showResultsAtEnd,
  examConfig: initialExamConfig,
  selectionState,
  setSelectionState,
  subtopicsCache,
  timer,
  answers,
  visitedQuestions,
  selectedAnswer,
  selectedAnswers,
  textAnswer,
  currentQuestionIndex,
  currentExamId,
  examStartTime,
  evaluateExamAPI,
}: UseExamSessionProps): UseExamSessionReturn {
  const [examSession, setExamSession] = useState<ExamSession | null>(null);
  const [questionTimings, setQuestionTimings] = useState<QuestionTiming[]>([]);
  const [examAttempt, setExamAttempt] = useState<ExamAttempt>({
    attemptNumber: 1,
    previousAttempts: [],
    allowRetry: true,
    maxAttempts: undefined, // Unbegrenzte Versuche
  });
  const [examConfig, setExamConfig] = useState<ExamConfigType>(initialExamConfig);

  // ==================== TIME TRACKING HELPER ====================
  const startQuestionTiming = useCallback((questionIndex: number) => {
    const question = questions[questionIndex];
    if (!question) return;
    
    setQuestionTimings(prev => {
      const existing = prev.find(t => t.questionId === question.id);
      
      if (existing) {
        // Already visited - increment revisit count
        return prev.map(t => 
          t.questionId === question.id 
            ? { ...t, revisitCount: t.revisitCount + 1 }
            : t
        );
      } else {
        // First visit - create new timing
        const newTiming: QuestionTiming = {
          questionId: question.id,
          questionIndex,
          timeSpentSeconds: 0,
          firstVisitedAt: getCurrentTimestamp(),
          revisitCount: 0,
        };
        return [...prev, newTiming];
      }
    });
  }, [questions]);
  
  const updateQuestionTiming = useCallback((questionIndex: number, timeSpent: number) => {
    const question = questions[questionIndex];
    if (!question) return;
    
    setQuestionTimings(prev => prev.map(t => 
      t.questionId === question.id 
        ? { ...t, timeSpentSeconds: t.timeSpentSeconds + timeSpent }
        : t
    ));
  }, [questions]);
  
  const markQuestionAnswered = useCallback((questionIndex: number) => {
    const question = questions[questionIndex];
    if (!question) return;
    
    setQuestionTimings(prev => prev.map(t => 
      t.questionId === question.id 
        ? { ...t, lastAnsweredAt: getCurrentTimestamp() }
        : t
    ));
  }, [questions]);
  
  // ==================== EXAM SESSION MANAGEMENT ====================
  const startExamSession = useCallback(() => {
    // Get actual subtopic IDs - if empty array, use ALL subtopics for that topic
    let actualSubtopicIds: string[] = [];
    let actualSubtopicNames: string[] = [];
    let actualSelectedSubtopics: Array<{ id: string; name: string }> = [];
    
    // Handle tree selection model
    if (selectionState.treeSelection && Object.keys(selectionState.treeSelection).length > 0) {
      for (const catSel of Object.values(selectionState.treeSelection)) {
        if (catSel.allSelected) {
          actualSubtopicIds.push(catSel.category.id);
          actualSubtopicNames.push(catSel.category.name);
          actualSelectedSubtopics.push({ id: catSel.category.id, name: catSel.category.name });
        } else {
          for (const topicSel of Object.values(catSel.topics)) {
            if (topicSel.allSelected) {
              actualSubtopicIds.push(topicSel.topic.id);
              actualSubtopicNames.push(topicSel.topic.name);
              actualSelectedSubtopics.push({ id: topicSel.topic.id, name: topicSel.topic.name });
            } else {
              actualSubtopicIds.push(...topicSel.subtopicIds);
              actualSubtopicNames.push(...topicSel.subtopicIds);
              actualSelectedSubtopics.push(...topicSel.subtopicIds.map(id => ({ id, name: id })));
            }
          }
        }
      }
    } else if (selectionState.selectedTopic && selectionState.subtopicsByTopic) {
      const subtopicsForTopic = selectionState.subtopicsByTopic[selectionState.selectedTopic.id] || [];
      if (subtopicsForTopic.length === 0) {
        // Empty array means "all subtopics selected" - get them from cache
        const allSubtopics = subtopicsCache[selectionState.selectedTopic.id] || [];
        actualSubtopicIds = allSubtopics.map(st => st.id);
        actualSubtopicNames = allSubtopics.map(st => st.name);
        actualSelectedSubtopics = allSubtopics;
      } else {
        // Partial selection
        actualSubtopicIds = subtopicsForTopic.map(st => st.id);
        actualSubtopicNames = subtopicsForTopic.map(st => st.name);
        actualSelectedSubtopics = subtopicsForTopic;
      }
    }
    
    // Derive topicId/topicName from tree selection or old state
    const topicId = selectionState.treeSelection
      ? Object.values(selectionState.treeSelection).flatMap(cs => Object.keys(cs.topics)).join(',')
      : selectionState.selectedTopic?.id || '';
    const topicName = selectionState.treeSelection
      ? Object.values(selectionState.treeSelection).flatMap(cs => 
          cs.allSelected ? [cs.category.name] : Object.values(cs.topics).map(ts => ts.topic.name)
        ).join(', ')
      : selectionState.selectedTopic?.name || '';

    // Update selection state with actual selected subtopics for saving later
    setSelectionState(prev => ({
      ...prev,
      selectedSubtopics: actualSelectedSubtopics
    }));
    
    const session: ExamSession = {
      examId: generateId(),
      userId: userId,
      startTime: getCurrentTimestamp(),
      topicId,
      topicName,
      subtopicIds: actualSubtopicIds,
      subtopicNames: actualSubtopicNames,
      totalQuestions: questions.length,
      timeLimit: timer,
      mode: showResultsAtEnd ? 'endOnly' : 'immediate',
      status: 'inProgress',
      configuration: examConfig,
    };
    
    setExamSession(session);
    console.log('🎯 Exam session started:', session);
    return session;
  }, [userId, questions, selectionState, subtopicsCache, timer, showResultsAtEnd, examConfig, setSelectionState]);
  
  const endExamSession = useCallback((status: 'completed' | 'abandoned') => {
    if (!examSession) return;
    
    const updated: ExamSession = {
      ...examSession,
      endTime: getCurrentTimestamp(),
      status,
    };
    
    setExamSession(updated);
    console.log('🏁 Exam session ended:', updated);
    return updated;
  }, [examSession]);
  
  // ==================== AUTO-SAVE FUNCTIONALITY ====================
  const performAutoSave = useCallback(() => {
    if (!examSession) return;
    
    try {
      const state = {
        currentQuestionIndex,
        remainingTime: timer,
        visitedQuestions: Array.from(visitedQuestions),
        selectedAnswer,
        selectedAnswers,
        textAnswer,
      };
      
      autoSaveExam(examSession, answers, questionTimings, state);
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
    }
  }, [examSession, currentQuestionIndex, timer, visitedQuestions, selectedAnswer, selectedAnswers, textAnswer, answers, questionTimings]);
  
  // ==================== FUNKTION FÜR KI-API INTEGRATION ====================
  // ✅ Diese Funktion triggert die Evaluate Exam API
  // Sie wird aufgerufen wenn die Prüfung beendet wird (normal oder vorzeitig)
  const prepareDataForAI = useCallback(() => {
    // ✅ API CALL: Evaluate Exam
    console.log('📤 Triggering Evaluate Exam API...');
    
    // Format answers for API: { questionId: answer }
    const formattedAnswers = formatAnswersForAPI(
      answers.filter(a => a !== undefined), // Remove undefined answers
      questions
    );
    
    // Calculate total time spent
    const timeSpentSeconds = examStartTime > 0 
      ? Math.floor((Date.now() - examStartTime) / 1000)
      : 0;
    
    // Trigger API call
    evaluateExamAPI({
      userId,
      exam: {
        id: currentExamId,
        questions: apiQuestions.length > 0 ? apiQuestions : questions as any, // Use API questions
      },
      answers: formattedAnswers,
      timeSpent: timeSpentSeconds,
    });
    
    // Log for debugging
    console.log('📤 Evaluate Request:', {
      userId,
      examId: currentExamId,
      answersCount: Object.keys(formattedAnswers).length,
      timeSpent: timeSpentSeconds,
    });
    
    // Clear localStorage after API call triggered
    clearAllExamData();
  }, [answers, questions, apiQuestions, examStartTime, userId, currentExamId, evaluateExamAPI]);

  return {
    // State
    examSession,
    setExamSession,
    questionTimings,
    setQuestionTimings,
    examAttempt,
    setExamAttempt,
    examConfig,
    setExamConfig,

    // Functions
    startExamSession,
    endExamSession,
    startQuestionTiming,
    updateQuestionTiming,
    markQuestionAnswered,
    performAutoSave,
    prepareDataForAI,
  };
}