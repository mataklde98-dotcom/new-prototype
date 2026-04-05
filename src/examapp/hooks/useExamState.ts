// ==================== EXAM STATE HOOK ====================
// Coordinates all exam-specific state: screen, questions, API integration,
// review mode initialization, and save-to-history logic
// Extracted from App.tsx Phase 5

import { useState, useEffect } from 'react';
import { useGenerateExam, useEvaluateExam } from './index';
import type { GenerateExamResponse, EvaluateExamResponse, GenerateExamQuestion } from '../services/examSimulationTypes';
import { useUserProfile, useUserRegistration } from '@/hooks/useUser';
import { getCurrentUserId } from '@/lib/auth';
import { saveCompletedExam } from '../app/utils/completedExamsStorage';
import type { CompletedExam } from '../app/utils/completedExamsStorage';
import { FALLBACK_QUESTIONS } from '../app/data/fallbackQuestions';
import type { Question } from '../app/types/api-types';
import type { AnswerEntry } from './useExamAnswers';
import type { SelectionState } from './useContentSelection';

// ==================== PROPS ====================
interface UseExamStateProps {
  reviewingCompletedExam?: CompletedExam;
}

// ==================== RETURN TYPE ====================
export interface UseExamStateReturn {
  // User
  userId: string;
  userProfile: any;
  userRegistration: any;

  // Screen
  screen: string;
  setScreen: (screen: string) => void;

  // Question index
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;

  // Visited
  visitedQuestions: Set<number>;
  setVisitedQuestions: React.Dispatch<React.SetStateAction<Set<number>>>;
  isFirstLoad: boolean;
  setIsFirstLoad: React.Dispatch<React.SetStateAction<boolean>>;

  // Modal & UI states
  emptyContentModal: { show: boolean; level: 'categories' | 'topics' | 'subtopics' };
  setEmptyContentModal: React.Dispatch<React.SetStateAction<{ show: boolean; level: 'categories' | 'topics' | 'subtopics' }>>;
  showTutorial: boolean;
  setShowTutorial: React.Dispatch<React.SetStateAction<boolean>>;
  showAlert: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  alertTitle: string;
  setAlertTitle: React.Dispatch<React.SetStateAction<string>>;
  alertMessage: string;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  showConfirmDialog: boolean;
  setShowConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>;
  confirmDialogTitle: string;
  setConfirmDialogTitle: React.Dispatch<React.SetStateAction<string>>;
  confirmDialogMessage: string;
  setConfirmDialogMessage: React.Dispatch<React.SetStateAction<string>>;
  confirmDialogAction: (() => void) | null;
  setConfirmDialogAction: React.Dispatch<React.SetStateAction<(() => void) | null>>;

  // Exam config flags
  showResultsAtEnd: boolean;
  setShowResultsAtEnd: React.Dispatch<React.SetStateAction<boolean>>;
  isReviewMode: boolean;
  setIsReviewMode: React.Dispatch<React.SetStateAction<boolean>>;
  examCompleted: boolean;
  setExamCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  isCreatingExam: boolean;
  setIsCreatingExam: React.Dispatch<React.SetStateAction<boolean>>;
  examSavedToHistory: boolean;
  setExamSavedToHistory: React.Dispatch<React.SetStateAction<boolean>>;

  // API exam data
  currentExamId: string;
  setCurrentExamId: React.Dispatch<React.SetStateAction<string>>;
  examStartTime: number;
  setExamStartTime: React.Dispatch<React.SetStateAction<number>>;
  apiQuestions: GenerateExamQuestion[];
  setApiQuestions: React.Dispatch<React.SetStateAction<GenerateExamQuestion[]>>;
  apiEvaluationResult: EvaluateExamResponse | null;
  setApiEvaluationResult: React.Dispatch<React.SetStateAction<EvaluateExamResponse | null>>;

  // Derived questions
  questions: Question[];
  currentQuestion: Question;
  totalQuestions: number;

  // React Query mutations
  generateExamAPI: (params: any) => void;
  isGeneratingExam: boolean;
  evaluateExamAPI: (params: any) => void;
  isEvaluatingExam: boolean;
}

// ==================== HOOK ====================
export function useExamState({
  reviewingCompletedExam,
}: UseExamStateProps): UseExamStateReturn {
  // ==================== USER PROFILE DATA ====================
  const { data: userProfile } = useUserProfile();
  const { data: userRegistration } = useUserRegistration();
  const userId = getCurrentUserId();

  // ==================== SCREEN & NAVIGATION STATE ====================
  const [screen, setScreen] = useState<string>('subjectSelection');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // ==================== MODAL & UI STATES ====================
  const [emptyContentModal, setEmptyContentModal] = useState<{ show: boolean; level: 'categories' | 'topics' | 'subtopics' }>({ show: false, level: 'categories' });
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogTitle, setConfirmDialogTitle] = useState('');
  const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
  const [confirmDialogAction, setConfirmDialogAction] = useState<(() => void) | null>(null);

  // ==================== EXAM CONFIG STATES ====================
  const [showResultsAtEnd, setShowResultsAtEnd] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [isCreatingExam, setIsCreatingExam] = useState(true);
  const [examSavedToHistory, setExamSavedToHistory] = useState(false);

  // ==================== API EXAM STATES ====================
  const [currentExamId, setCurrentExamId] = useState<string>('');
  const [examStartTime, setExamStartTime] = useState<number>(0);
  const [apiQuestions, setApiQuestions] = useState<GenerateExamQuestion[]>([]);
  const [apiEvaluationResult, setApiEvaluationResult] = useState<EvaluateExamResponse | null>(null);

  // ==================== EXAM ANSWERS (for onSuccess callbacks) ====================
  // These will be set externally after the hook initializes via the returned setters
  const [answersInitializer, setAnswersInitializer] = useState<((questions: GenerateExamQuestion[]) => void) | null>(null);

  // ==================== QUESTIONS (derived) ====================
  const questions: Question[] = apiQuestions.length > 0
    ? apiQuestions.map(apiQ => ({
        id: apiQ.id,
        type: apiQ.type === 'multiple_choice' ? 'multipleChoice'
          : apiQ.type === 'fill_in_blank' ? 'fillInTheBlank'
          : apiQ.type === 'short_answer' ? 'shortAnswer'
          : apiQ.type as any,
        question: apiQ.question,
        topic: apiQ.subtopic || apiQ.topic || '',
        choices: apiQ.options || [],
        correctAnswer: apiQ.correctAnswer,
        solution: apiQ.solution || (apiQ as any).explanation || '',
        points: apiQ.points || 1,
      } as Question))
    : FALLBACK_QUESTIONS;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // ==================== REACT QUERY HOOKS ====================
  const { mutate: generateExamAPI, isPending: isGeneratingExam } = useGenerateExam({
    onSuccess: (response: GenerateExamResponse) => {
      console.log('✅ Exam Generated Successfully:', response);
      setCurrentExamId(response.id);
      setApiQuestions(response.questions);
      setExamStartTime(Date.now());
      setIsCreatingExam(false);
      setVisitedQuestions(new Set([0]));
    },
    onError: (error: Error) => {
      console.error('❌ Error generating exam:', error);
      setIsCreatingExam(false);
      setAlertTitle('Fehler');
      setAlertMessage('Die Prüfung konnte nicht erstellt werden. Bitte versuche es erneut.');
      setShowAlert(true);
    },
  });

  const { mutate: evaluateExamAPI, isPending: isEvaluatingExam } = useEvaluateExam({
    onSuccess: (response: EvaluateExamResponse) => {
      console.log('✅ Exam Evaluated Successfully:', response);
      setApiEvaluationResult(response);
    },
    onError: (error: Error) => {
      console.error('❌ Error evaluating exam:', error);
    },
  });

  // ==================== COMPLETED EXAM REVIEW MODE ====================
  useEffect(() => {
    if (reviewingCompletedExam) {
      const storedQuestions = reviewingCompletedExam.questions || [];
      const apiFormattedQuestions: GenerateExamQuestion[] = storedQuestions.map((q: any) => ({
        id: q.id || `q${Math.random()}`,
        type: q.type === 'multipleChoice' ? 'multiple_choice'
          : q.type === 'multipleChoiceMultiple' ? 'multiple_choice_multiple'
          : q.type === 'fillInTheBlank' ? 'fill_in_blank'
          : q.type === 'fillInBlankChoice' ? 'fill_in_blank_choice'
          : q.type === 'shortAnswer' ? 'short_answer'
          : 'multiple_choice',
        question: q.question || '',
        topic: q.topic || '',
        options: q.choices || [],
        correctAnswer: q.correctAnswer,
        explanation: q.solution || '',
        points: q.points || 1,
      }));
      setApiQuestions(apiFormattedQuestions);
      setExamCompleted(true);
      setExamSavedToHistory(true);
      setCurrentExamId(reviewingCompletedExam.id);
      if (reviewingCompletedExam.grade && reviewingCompletedExam.totalPoints) {
        const achievedPts = reviewingCompletedExam.achievedPoints || 0;
        const totalPts = reviewingCompletedExam.totalPoints;
        setApiEvaluationResult({
          pointsTotal: totalPts,
          pointsAchieved: achievedPts,
          percentage: totalPts > 0 ? Math.round((achievedPts / totalPts) * 100) : 0,
          grade: reviewingCompletedExam.grade,
          feedback: (reviewingCompletedExam.answers || []).map((answer: any, index: number) => ({
            questionId: apiFormattedQuestions[index]?.id || `q${index}`,
            isCorrect: !answer.skipped && index < reviewingCompletedExam.correctAnswers,
            pointsAwarded: 0,
            pointsTotal: apiFormattedQuestions[index]?.points || 1,
            feedback: apiFormattedQuestions[index]?.solution || (apiFormattedQuestions[index] as any)?.explanation || '',
          })),
        });
      }
      setScreen('results');
    }
  }, [reviewingCompletedExam]);

  return {
    // User
    userId,
    userProfile,
    userRegistration,

    // Screen
    screen,
    setScreen,

    // Question index
    currentQuestionIndex,
    setCurrentQuestionIndex,

    // Visited
    visitedQuestions,
    setVisitedQuestions,
    isFirstLoad,
    setIsFirstLoad,

    // Modal & UI states
    emptyContentModal,
    setEmptyContentModal,
    showTutorial,
    setShowTutorial,
    showAlert,
    setShowAlert,
    alertTitle,
    setAlertTitle,
    alertMessage,
    setAlertMessage,
    showConfirmDialog,
    setShowConfirmDialog,
    confirmDialogTitle,
    setConfirmDialogTitle,
    confirmDialogMessage,
    setConfirmDialogMessage,
    confirmDialogAction,
    setConfirmDialogAction,

    // Exam config flags
    showResultsAtEnd,
    setShowResultsAtEnd,
    isReviewMode,
    setIsReviewMode,
    examCompleted,
    setExamCompleted,
    isCreatingExam,
    setIsCreatingExam,
    examSavedToHistory,
    setExamSavedToHistory,

    // API exam data
    currentExamId,
    setCurrentExamId,
    examStartTime,
    setExamStartTime,
    apiQuestions,
    setApiQuestions,
    apiEvaluationResult,
    setApiEvaluationResult,

    // Derived questions
    questions,
    currentQuestion,
    totalQuestions,

    // React Query mutations
    generateExamAPI,
    isGeneratingExam,
    evaluateExamAPI,
    isEvaluatingExam,
  };
}