// ==================== EXAM NAVIGATION HOOK ====================
// Extrahiert aus App.tsx - Screen-Navigation und Lifecycle-Handler
// Verantwortlich für: handleStartClick, handleClose, calculateResultsAndNavigate,
// handleFeedbackSubmit/Skip, navigateToStart

import { useState, useCallback } from 'react';
import type { Question, ExamSession, QuestionTiming } from '../app/types/api-types';
import type { CompletedExam } from '../app/utils/completedExamsStorage';
import { getCurrentTimestamp } from '../app/utils/api-utils';

type AnswerEntry = {
  answer: number | string | number[];
  showSolution?: boolean;
  skipped?: boolean;
};

type SelectionState = {
  subject?: { id: string; name: string };
  category?: { id: string; name: string };
  selectedTopic?: { id: string; name: string };
  subtopicsByTopic?: { [topicId: string]: Array<{ id: string; name: string }> };
  currentTopic?: { id: string; name: string };
  selectedSubtopics?: Array<{ id: string; name: string }>;
};

interface UseExamNavigationProps {
  // External state refs
  screen: string;
  setScreen: (screen: string) => void;
  examCompleted: boolean;
  setExamCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  examSavedToHistory: boolean;
  setExamSavedToHistory: React.Dispatch<React.SetStateAction<boolean>>;
  isReviewMode: boolean;
  setIsReviewMode: React.Dispatch<React.SetStateAction<boolean>>;
  isCreatingExam: boolean;
  setIsCreatingExam: React.Dispatch<React.SetStateAction<boolean>>;
  showResultsAtEnd: boolean;
  
  // Answer state
  answers: AnswerEntry[];
  setAnswers: React.Dispatch<React.SetStateAction<AnswerEntry[]>>;
  finalAnswers: AnswerEntry[];
  setFinalAnswers: React.Dispatch<React.SetStateAction<AnswerEntry[]>>;
  
  // Question state
  questions: Question[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedAnswers: React.Dispatch<React.SetStateAction<number[]>>;
  setTextAnswer: React.Dispatch<React.SetStateAction<string>>;
  setVisitedQuestions: React.Dispatch<React.SetStateAction<Set<number>>>;
  setIsFirstLoad: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Timer
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  examDuration: number;
  
  // Session
  selectionState: SelectionState;
  setSelectionState: React.Dispatch<React.SetStateAction<SelectionState>>;
  examSession: ExamSession | null;
  questionTimings: QuestionTiming[];
  setQuestionTimings: React.Dispatch<React.SetStateAction<QuestionTiming[]>>;
  
  // Callbacks
  startExamSession: () => ExamSession;
  startQuestionTiming: (questionIndex: number) => void;
  prepareDataForAI: () => void;
  isAnswerCorrect: (answer: number | string | number[], question: Question) => boolean;
  
  // User data
  userId: string;
  userRegistration: any;
  
  // Parent callbacks
  onClose?: () => void;
  reviewingCompletedExam?: CompletedExam;
  examWeaknessContext?: any;
  
  // Confirm dialog
  setShowConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmDialogTitle: React.Dispatch<React.SetStateAction<string>>;
  setConfirmDialogMessage: React.Dispatch<React.SetStateAction<string>>;
  setConfirmDialogAction: React.Dispatch<React.SetStateAction<(() => void) | null>>;
}

interface UseExamNavigationReturn {
  handleStartClick: () => void;
  handleClose: () => void;
  handleCloseWithFeedbackCheck: () => void;
  calculateResultsAndNavigate: () => void;
  handleFeedbackSubmit: (difficulty: number, comment?: string) => void;
  handleFeedbackSkip: () => void;
  navigateToStart: () => void;
}

export function useExamNavigation({
  screen,
  setScreen,
  examCompleted,
  setExamCompleted,
  examSavedToHistory,
  setExamSavedToHistory,
  isReviewMode,
  setIsReviewMode,
  isCreatingExam,
  setIsCreatingExam,
  showResultsAtEnd,
  answers,
  setAnswers,
  finalAnswers,
  setFinalAnswers,
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  setSelectedAnswer,
  setSelectedAnswers,
  setTextAnswer,
  setVisitedQuestions,
  setIsFirstLoad,
  timer,
  setTimer,
  examDuration,
  selectionState,
  setSelectionState,
  examSession,
  questionTimings,
  setQuestionTimings,
  startExamSession,
  startQuestionTiming,
  prepareDataForAI,
  isAnswerCorrect,
  userId,
  userRegistration,
  onClose,
  reviewingCompletedExam,
  examWeaknessContext,
  setShowConfirmDialog,
  setConfirmDialogTitle,
  setConfirmDialogMessage,
  setConfirmDialogAction,
}: UseExamNavigationProps): UseExamNavigationReturn {

  const handleStartClick = useCallback(() => {
    // Initialize exam session
    startExamSession();
    
    // Initialize question timing for first question
    startQuestionTiming(0);
    
    setScreen('question');
    // ✅ Timer is already set in onStartExam (ExamConfiguration) - don't override it!
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setTextAnswer('');
    setVisitedQuestions(new Set([0]));
    setQuestionTimings([]); // Reset timings
    setExamCompleted(false); // Reset exam completion status (neue Prüfung startet)
    setExamSavedToHistory(false); // Reset saved status for new exam
    // Keep isFirstLoad true - it will be disabled after first answer
  }, [startExamSession, startQuestionTiming, setScreen, setCurrentQuestionIndex, setAnswers, setSelectedAnswer, setSelectedAnswers, setTextAnswer, setVisitedQuestions, setQuestionTimings, setExamCompleted, setExamSavedToHistory]);

  const calculateResultsAndNavigate = useCallback(() => {
    // ==================== WICHTIG für KI-API Integration ====================
    // Beim vorzeitigen Beenden (X-Button): Nur TATSÄCHLICH BEARBEITETE Fragen werden gespeichert
    // Diese gehen später gebündelt an die KI-API zur Bewertung
    // NICHT bearbeitete Fragen werden NUR für die UI als "skipped" markiert, 
    // aber NICHT in den finalen Datensatz aufgenommen, der an die KI geht
    
    const completedAnswers = [...answers];
    
    // Für die UI: Zeige alle Fragen inkl. übersprungene
    const answersForUI = [...answers];
    for (let i = 0; i < questions.length; i++) {
      if (answersForUI[i] === undefined) {
        // Setze passenden "Leer"-Wert basierend auf Fragetyp
        const questionType = questions[i].type;
        let emptyAnswer: number | string | number[];
        
        if (questionType === 'fillInTheBlank' || questionType === 'shortAnswer') {
          emptyAnswer = ''; // Leerer String für Text-Fragen
        } else if (questionType === 'multipleChoiceMultiple') {
          emptyAnswer = []; // Leeres Array für Multi-Select
        } else {
          emptyAnswer = -1; // -1 für Single-Select Multiple Choice
        }
        
        answersForUI[i] = { answer: emptyAnswer, skipped: true }; // Nur für UI-Anzeige
      }
    }
    
    // ==================== FÜR KI-API ====================
    // completedAnswers enthält NUR die tatsächlich bearbeiteten Fragen
    // Diese werden später an die KI-API geschickt:
    // - Frage-ID, Punkte, Thema, Frage, Antwortmöglichkeiten (alles dynamisch)
    // - Nutzer-Antwort (selectedAnswer/textAnswer/selectedAnswers)
    // Die KI bewertet dann und gibt Punkte/Feedback zurück
    
    setFinalAnswers(answersForUI); // Für UI mit übersprungenen Fragen
    setAnswers(completedAnswers); // Nur bearbeitete Fragen (für KI-API)
    
    // Mark exam as completed (wichtig: keine Bestätigung mehr beim X-Klick)
    setExamCompleted(true);
    
    // Navigate to results immediately
    setScreen('results');
    setShowConfirmDialog(false);
    
    // ==================== KI-API AUFRUF IM HINTERGRUND ====================
    // API-Call läuft im Hintergrund - Grade wird später aktualisiert
    setTimeout(() => prepareDataForAI(), 100);
  }, [answers, questions, setFinalAnswers, setAnswers, setExamCompleted, setScreen, setShowConfirmDialog, prepareDataForAI]);

  const handleClose = useCallback(() => {
    // Check if exam is in progress AND not yet completed
    // examCompleted wird true wenn: Zeit abgelaufen, manuell beendet, oder letzte Frage beantwortet
    if ((screen === 'question' || screen === 'feedback') && !examCompleted) {
      // Show confirmation dialog ONLY during active exam (not completed yet)
      setConfirmDialogTitle('Prüfung beenden?');
      setConfirmDialogMessage('Bist du dir sicher, dass du die Prüfung beenden willst? Alle bisherigen Antworten werden bewertet und der Rest als übersprungen angezeigt.');
      setConfirmDialogAction(() => calculateResultsAndNavigate);
      setShowConfirmDialog(true);
    } else {
      // Exam is completed OR not in exam at all - check if feedback should be shown
      handleCloseWithFeedbackCheck();
    }
  }, [screen, examCompleted, calculateResultsAndNavigate, setConfirmDialogTitle, setConfirmDialogMessage, setConfirmDialogAction, setShowConfirmDialog]);

  const handleCloseWithFeedbackCheck = useCallback(() => {
    // ✅ FIX: Only show feedback screen for FRESH exams, not for reviewing old exams
    if (reviewingCompletedExam) {
      // This is a review of an old exam → Close directly, no feedback
      console.log('✅ Review mode: Closing without feedback');
      if (onClose) onClose();
    } else {
      // This is a freshly completed exam → Show feedback screen
      console.log('✅ Fresh exam: Showing feedback screen');
      setScreen('examFeedback');
    }
  }, [reviewingCompletedExam, onClose, setScreen]);

  const handleFeedbackSubmit = useCallback((difficulty: number, comment?: string) => {
    // ==================== VOLLSTÄNDIGES FEEDBACK FÜR KI-API ====================
    // Dieses Feedback wird später an die KI geschickt für:
    // 1. PERSONALISIERUNG: Schwierigkeitsgrad pro Nutzer anpassen
    // 2. QUALITÄTSSICHERUNG: Fragen-Qualität pro Klassenstufe prüfen
    // 3. ADAPTIVE LEARNING: Bessere Fragen für nächste Prüfung generieren
    
    const comprehensiveFeedback = {
      // User Profile (wichtig für Klassenstufen-spezifische Analyse)
      user: {
        userId: userId,
        bundesland: userRegistration?.state || 'Bayern',
        schulform: userRegistration?.schoolType || 'Gymnasium',
        klassenstufe: userRegistration?.grade || '10',
      },
      
      // Exam Context (welches Thema wurde geprüft?)
      examContext: {
        subjectId: selectionState.subject?.id,
        subjectName: selectionState.subject?.name,
        categoryId: selectionState.category?.id,
        categoryName: selectionState.category?.name,
        topicId: selectionState.selectedTopic?.id,
        topicName: selectionState.selectedTopic?.name,
        subtopicIds: examSession?.subtopicIds || [],
        subtopicNames: examSession?.subtopicNames || [],
      },
      
      // Exam Session Data (volle Session-Info)
      examSession: examSession,
      
      // Performance Data (wie hat der Nutzer abgeschnitten?)
      performance: {
        totalQuestions: questions.length,
        answeredQuestions: finalAnswers.filter(a => a && !a.skipped).length,
        skippedQuestions: finalAnswers.filter(a => a && a.skipped).length,
        correctAnswers: finalAnswers.filter((a, idx) => {
          if (!a || a.skipped) return false;
          return isAnswerCorrect(a.answer, questions[idx]);
        }).length,
        totalTimeSeconds: examSession?.timeLimit || (10 * 60),
        timeUsedSeconds: (examSession?.timeLimit || (10 * 60)) - timer,
        wasTimeUp: timer === 0,
      },
      
      // Question Timings (wie lange pro Frage?)
      questionTimings: questionTimings,
      
      // Subjective Feedback (User-Meinung zur Schwierigkeit)
      subjectiveFeedback: {
        difficulty: difficulty, // 1 = zu einfach, 5 = zu schwer
        comment: comment || '',
        timestamp: getCurrentTimestamp(),
      },
    };

    // TODO: Später an KI-API senden: POST /api/exam-feedback
    console.log('📝 COMPREHENSIVE FEEDBACK FOR AI:', comprehensiveFeedback);
    
    // TODO: API Call hier einfügen
    // await fetch('/api/exam-feedback', {
    //   method: 'POST',
    //   body: JSON.stringify(comprehensiveFeedback)
    // });

    // Navigate back to start
    navigateToStart();
  }, [userId, userRegistration, selectionState, examSession, questions, finalAnswers, isAnswerCorrect, timer, questionTimings]);

  const handleFeedbackSkip = useCallback(() => {
    console.log('⏭️ Feedback skipped');
    // Navigate back to start without saving feedback
    navigateToStart();
  }, []);

  const navigateToStart = useCallback(() => {
    // If exam was started from a context button (weakness/strength/etc.), close entirely
    if (examWeaknessContext && onClose) {
      onClose();
      return;
    }
    setScreen('subjectSelection');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setTextAnswer('');
    setTimer(examDuration * 60); // Use stored exam duration
    setVisitedQuestions(new Set([0]));
    setIsFirstLoad(true);
    setExamCompleted(false); // Reset exam completion status
    setExamSavedToHistory(false); // Reset saved status for new exam
    setIsReviewMode(false); // Reset review mode
    // Reset selection state but keep subject selection
    setSelectionState((prev: SelectionState) => ({
      subject: prev.subject, // Keep subject to avoid reloading
    }));
  }, [examWeaknessContext, onClose, setScreen, setCurrentQuestionIndex, setAnswers, setSelectedAnswer, setSelectedAnswers, setTextAnswer, setTimer, examDuration, setVisitedQuestions, setIsFirstLoad, setExamCompleted, setExamSavedToHistory, setIsReviewMode, setSelectionState]);

  return {
    handleStartClick,
    handleClose,
    handleCloseWithFeedbackCheck,
    calculateResultsAndNavigate,
    handleFeedbackSubmit,
    handleFeedbackSkip,
    navigateToStart,
  };
}