// ==================== EXAM ANSWERS HOOK ====================
// Extrahiert aus App.tsx - Bewertungslogik und Answer-Handling
// Verantwortlich für: isAnswerCorrect, getAnswerScorePercentage, getFeedbackText,
// handleAnswerSelect, handleTextAnswerChange, handleAnswerToggle, handleNext, handleContinue, handleBack

import { useState, useCallback } from 'react';
import type { Question } from '../app/types/api-types';

// ==================== ANSWER STATE TYPE ====================
export type AnswerEntry = {
  answer: number | string | number[];
  showSolution?: boolean;
  skipped?: boolean;
};

interface UseExamAnswersProps {
  questions: Question[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  screen: string;
  setScreen: (screen: string) => void;
  showResultsAtEnd: boolean;
  examCompleted: boolean;
  isFirstLoad: boolean;
  setIsFirstLoad: React.Dispatch<React.SetStateAction<boolean>>;
  visitedQuestions: Set<number>;
  setVisitedQuestions: React.Dispatch<React.SetStateAction<Set<number>>>;
  timer: number;
  examDuration: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  onExamFinished: (finalAnswers: AnswerEntry[], answers: AnswerEntry[]) => void;
  onPrepareDataForAI: () => void;
}

interface UseExamAnswersReturn {
  // State
  selectedAnswer: number | null;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<number | null>>;
  selectedAnswers: number[];
  setSelectedAnswers: React.Dispatch<React.SetStateAction<number[]>>;
  textAnswer: string;
  setTextAnswer: React.Dispatch<React.SetStateAction<string>>;
  answers: AnswerEntry[];
  setAnswers: React.Dispatch<React.SetStateAction<AnswerEntry[]>>;
  finalAnswers: AnswerEntry[];
  setFinalAnswers: React.Dispatch<React.SetStateAction<AnswerEntry[]>>;

  // Validation functions
  isAnswerCorrect: (answer: number | string | number[], question: Question) => boolean;
  getAnswerScorePercentage: (answer: number | string | number[], question: Question) => number;
  getFeedbackText: (scorePercentage: number) => string;

  // Handlers
  handleAnswerSelect: (answerIndex: number) => void;
  handleTextAnswerChange: (text: string) => void;
  handleAnswerToggle: (answerIndex: number) => void;
  handleNext: () => void;
  handleContinue: () => void;
  handleBack: () => void;
}

export function useExamAnswers({
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  screen,
  setScreen,
  showResultsAtEnd,
  examCompleted,
  isFirstLoad,
  setIsFirstLoad,
  visitedQuestions,
  setVisitedQuestions,
  timer,
  examDuration,
  setTimer,
  onExamFinished,
  onPrepareDataForAI,
}: UseExamAnswersProps): UseExamAnswersReturn {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); // For multi-select questions
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<AnswerEntry[]>([]);
  const [finalAnswers, setFinalAnswers] = useState<AnswerEntry[]>([]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  // ==================== BEWERTUNGSLOGIK: SPÄTER VON KI-API ====================
  // Diese Client-Side-Bewertung ist nur temporär für die Demo
  // In der finalen Version:
  // 1. Alle beantworteten Fragen werden gebündelt an die KI-API geschickt
  // 2. Die KI bewertet JEDE Antwort (egal welcher Fragetyp)
  // 3. Die KI gibt zurück: Punkte, Korrektheit, individuelles Feedback
  // 4. Dadurch kann die KI auch offene Antworten intelligent bewerten
  // Helper function to check if an answer is correct (TEMPORÄR - später KI-API)
  const isAnswerCorrect = useCallback((answer: number | string | number[], question: Question): boolean => {
    // For multi-select questions
    if (question.type === 'multipleChoiceMultiple' && Array.isArray(answer) && Array.isArray(question.correctAnswer)) {
      if (answer.length !== question.correctAnswer.length) return false;
      const sortedAnswer = [...answer].sort((a, b) => a - b);
      const sortedCorrect = [...question.correctAnswer].sort((a, b) => a - b);
      return sortedAnswer.every((val, idx) => val === sortedCorrect[idx]);
    }
    // For fill-in-the-blank and short-answer questions with acceptedAnswers
    if ((question.type === 'fillInTheBlank' || question.type === 'shortAnswer') && typeof answer === 'string' && question.acceptedAnswers) {
      // Normalize: lowercase, trim, replace commas with periods for decimal numbers
      const normalizedAnswer = answer.toLowerCase().trim().replace(',', '.');
      return question.acceptedAnswers.some(accepted => {
        const normalizedAccepted = accepted.toLowerCase().trim().replace(',', '.');
        return normalizedAccepted === normalizedAnswer;
      });
    }
    // Default comparison
    return answer === question.correctAnswer;
  }, []);

  // Helper function to calculate answer score percentage (0-100)
  // Used to differentiate between "Leider falsch", "Teilweise richtig", and "Perfekt"
  const getAnswerScorePercentage = useCallback((answer: number | string | number[], question: Question): number => {
    // For multi-select questions with partial scoring
    if (question.type === 'multipleChoiceMultiple' && Array.isArray(answer) && Array.isArray(question.correctAnswer)) {
      const correctAnswers = question.correctAnswer;
      const selectedAnswers = answer;
      
      // Count correct selections
      const correctSelections = selectedAnswers.filter(ans => correctAnswers.includes(ans)).length;
      // Count incorrect selections
      const incorrectSelections = selectedAnswers.filter(ans => !correctAnswers.includes(ans)).length;
      
      // If wrong answers selected, reduce score
      const totalCorrectAnswers = correctAnswers.length;
      const score = Math.max(0, correctSelections - incorrectSelections);
      
      return (score / totalCorrectAnswers) * 100;
    }
    
    // For all other question types: binary (0% or 100%)
    return isAnswerCorrect(answer, question) ? 100 : 0;
  }, [isAnswerCorrect]);

  // Helper function to get feedback text based on score
  const getFeedbackText = useCallback((scorePercentage: number): string => {
    if (scorePercentage === 100) return 'Perfekt!';
    if (scorePercentage > 0) return 'Teilweise richtig!';
    return 'Leider falsch.';
  }, []);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    // ✅ FIX: In review mode (after exam completion), inputs should be read-only
    if (examCompleted) return;
    
    // ==================== MODE: See results only at the end ====================
    if (showResultsAtEnd) {
      // Allow changing the answer before clicking "Next"
      setSelectedAnswer(answerIndex);
      
      // Disable first load flag AFTER the first interaction
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
      return; // Stay on question screen, don't save to answers yet
    }
    
    // ==================== MODE: Show feedback immediately (default) ====================
    if (answers[currentQuestionIndex] !== undefined) return; // Already answered
    
    setSelectedAnswer(answerIndex);
    
    // Save the answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = { answer: answerIndex };
    setAnswers(newAnswers);
    
    // Go to feedback screen
    setScreen('feedback');
    
    // Disable first load flag AFTER the first interaction
    if (isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [examCompleted, showResultsAtEnd, answers, currentQuestionIndex, isFirstLoad, setIsFirstLoad, setScreen]);

  // Wrapper for text answer changes (read-only in review mode)
  const handleTextAnswerChange = useCallback((text: string) => {
    // ✅ FIX: In review mode (after exam completion), inputs should be read-only
    if (examCompleted) return;
    setTextAnswer(text);
  }, [examCompleted]);

  // Handler for multi-select questions (toggle checkboxes)
  const handleAnswerToggle = useCallback((answerIndex: number) => {
    // ✅ FIX: In review mode (after exam completion), inputs should be read-only
    if (examCompleted) return;
    
    // ==================== MODE: See results only at the end ====================
    if (showResultsAtEnd) {
      // Allow toggling answers before clicking "Next"
      setSelectedAnswers(prev => {
        if (prev.includes(answerIndex)) {
          return prev.filter(i => i !== answerIndex);
        } else {
          return [...prev, answerIndex];
        }
      });
      return; // Don't save to answers yet
    }
    
    // ==================== MODE: Show feedback immediately (default) ====================
    if (answers[currentQuestionIndex] !== undefined) return; // Already answered
    
    setSelectedAnswers(prev => {
      if (prev.includes(answerIndex)) {
        return prev.filter(i => i !== answerIndex);
      } else {
        return [...prev, answerIndex];
      }
    });
  }, [examCompleted, showResultsAtEnd, answers, currentQuestionIndex]);

  const handleNext = useCallback(() => {
    const isTextQuestion = currentQuestion.type === 'fillInTheBlank' || currentQuestion.type === 'shortAnswer';
    const isMultiSelect = currentQuestion.type === 'multipleChoiceMultiple';
    
    // ==================== MODE: See results only at the end ====================
    if (showResultsAtEnd) {
      // ✅ FIX: In review mode, don't save answers - just navigate
      let newAnswers = [...answers]; // Define outside to be accessible later
      
      if (!examCompleted) {
        // Check if answer was provided
        let hasAnswer = false;
        let answerValue: number | string | number[] = '';
        
        if (isTextQuestion) {
          hasAnswer = textAnswer.trim() !== '';
          answerValue = textAnswer.trim();
        } else if (isMultiSelect) {
          hasAnswer = selectedAnswers.length > 0;
          answerValue = selectedAnswers;
        } else {
          hasAnswer = selectedAnswer !== null;
          answerValue = selectedAnswer!;
        }
        
        // Save answer or mark as skipped
        if (hasAnswer) {
          newAnswers[currentQuestionIndex] = { answer: answerValue, skipped: false };
        } else {
          newAnswers[currentQuestionIndex] = { answer: '', skipped: true };
        }
        setAnswers(newAnswers);
      }
      
      // Disable first load flag
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
      
      // Navigate to next question or results
      if (currentQuestionIndex < totalQuestions - 1) {
        // Go to next question
        const newIndex = currentQuestionIndex + 1;
        const nextQuestion = questions[newIndex];
        
        setCurrentQuestionIndex(newIndex);
        setVisitedQuestions(prev => new Set(prev).add(newIndex));
        
        // Load saved answer for next question (if exists)
        if (nextQuestion.type === 'fillInTheBlank' || nextQuestion.type === 'shortAnswer') {
          setTextAnswer(answers[newIndex]?.answer as string || '');
          setSelectedAnswer(null);
          setSelectedAnswers([]);
        } else if (nextQuestion.type === 'multipleChoiceMultiple') {
          setSelectedAnswers(Array.isArray(answers[newIndex]?.answer) ? answers[newIndex].answer as number[] : []);
          setSelectedAnswer(null);
          setTextAnswer('');
        } else {
          setSelectedAnswer(typeof answers[newIndex]?.answer === 'number' ? answers[newIndex].answer as number : null);
          setTextAnswer('');
          setSelectedAnswers([]);
        }
      } else {
        // Last question -> Go to results
        // ✅ FIX: In review mode, don't re-calculate results
        if (!examCompleted) {
          setFinalAnswers(newAnswers);
          setAnswers(newAnswers); // Wichtig: Update answers für KI-API
          
          // Notify parent that exam is finished
          onExamFinished(newAnswers, newAnswers);
          
          // Navigate to results immediately
          setScreen('results');
          
          // ==================== KI-API AUFRUF IM HINTERGRUND ====================
          // API-Call läuft im Hintergrund - Grade wird später aktualisiert
          setTimeout(() => onPrepareDataForAI(), 100);
        } else {
          setScreen('results');
        }
      }
      return;
    }
    
    // ==================== MODE: Show feedback immediately (default) ====================
    // Allow skipping questions - if no answer is provided, mark as skipped
    if (answers[currentQuestionIndex] === undefined) {
      const newAnswers = [...answers];
      
      if (isTextQuestion) {
        // Text-based question logic
        if (textAnswer.trim() !== '') {
          newAnswers[currentQuestionIndex] = { answer: textAnswer.trim(), skipped: false };
        } else {
          newAnswers[currentQuestionIndex] = { answer: '', skipped: true };
        }
      } else if (isMultiSelect) {
        // Multi-select question logic
        if (selectedAnswers.length > 0) {
          newAnswers[currentQuestionIndex] = { answer: selectedAnswers, skipped: false };
        } else {
          newAnswers[currentQuestionIndex] = { answer: [], skipped: true };
        }
      } else {
        // Single-select multiple choice logic
        if (selectedAnswer !== null) {
          newAnswers[currentQuestionIndex] = { answer: selectedAnswer, skipped: false };
        } else {
          newAnswers[currentQuestionIndex] = { answer: -1, skipped: true };
        }
      }
      
      setAnswers(newAnswers);
      setScreen('feedback');
      
      // Disable first load flag
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
    }
  }, [currentQuestion, showResultsAtEnd, answers, examCompleted, textAnswer, selectedAnswers, selectedAnswer, currentQuestionIndex, totalQuestions, questions, isFirstLoad, setIsFirstLoad, setCurrentQuestionIndex, setVisitedQuestions, setScreen, onExamFinished, onPrepareDataForAI]);

  const handleContinue = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      const newIndex = currentQuestionIndex + 1;
      const nextQuestion = questions[newIndex];
      
      setCurrentQuestionIndex(newIndex);
      setVisitedQuestions(prev => new Set(prev).add(newIndex));
      
      // Reset answer states based on question type
      if (nextQuestion.type === 'fillInTheBlank' || nextQuestion.type === 'shortAnswer') {
        setTextAnswer(answers[newIndex]?.answer as string || '');
        setSelectedAnswer(null);
        setSelectedAnswers([]);
      } else if (nextQuestion.type === 'multipleChoiceMultiple') {
        setSelectedAnswers(Array.isArray(answers[newIndex]?.answer) ? answers[newIndex].answer as number[] : []);
        setSelectedAnswer(null);
        setTextAnswer('');
      } else {
        setSelectedAnswer(typeof answers[newIndex]?.answer === 'number' ? answers[newIndex].answer as number : null);
        setTextAnswer('');
        setSelectedAnswers([]);
      }
      
      // ==================== MODE: See results only at the end ====================
      // In "showResultsAtEnd" mode, NEVER show feedback screen during exam
      // Only at the very end after last question
      // ✅ FIX: In review mode (after exam completion), ALWAYS show feedback
      if (examCompleted) {
        setScreen('feedback');
      } else if (showResultsAtEnd) {
        setScreen('question');
      } else {
        // ==================== MODE: Show feedback immediately (default) ====================
        // If the next question was already answered, go to feedback screen
        if (answers[newIndex] !== undefined) {
          setScreen('feedback');
        } else {
          // Otherwise go to question screen
          setScreen('question');
        }
      }
    } else {
      // Last question reached
      // ✅ FIX: In review mode, go back to results instead of re-calculating
      if (examCompleted) {
        setScreen('results');
        return;
      }
      
      // Exam finished (Simulator 1 - feedback mode)
      setFinalAnswers(answers);
      
      // Notify parent that exam is finished
      onExamFinished(answers, answers);
      
      // Navigate to results immediately
      setScreen('results');
      
      // ==================== KI-API AUFRUF IM HINTERGRUND ====================
      // API-Call läuft im Hintergrund - Grade wird später aktualisiert
      setTimeout(() => onPrepareDataForAI(), 100);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setSelectedAnswers([]);
      setTextAnswer('');
      setTimer(examDuration * 60); // Use stored exam duration
      setVisitedQuestions(new Set([0]));
      setIsFirstLoad(true); // Reset to true after exam finish
    }
  }, [currentQuestionIndex, totalQuestions, questions, answers, examCompleted, showResultsAtEnd, examDuration, setCurrentQuestionIndex, setVisitedQuestions, setScreen, setTimer, setIsFirstLoad, onExamFinished, onPrepareDataForAI]);

  const handleBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      const currentQ = questions[currentQuestionIndex];
      const isTextQuestion = currentQ.type === 'fillInTheBlank' || currentQ.type === 'shortAnswer';
      const isMultiSelect = currentQ.type === 'multipleChoiceMultiple';
      
      // ==================== MODE: See results only at the end ====================
      // Save current answer before going back (so it doesn't get lost)
      if (showResultsAtEnd) {
        const newAnswers = [...answers];
        
        // Check if answer was provided
        let hasAnswer = false;
        let answerValue: number | string | number[] = '';
        
        if (isTextQuestion) {
          hasAnswer = textAnswer.trim() !== '';
          answerValue = textAnswer.trim();
        } else if (isMultiSelect) {
          hasAnswer = selectedAnswers.length > 0;
          answerValue = selectedAnswers;
        } else {
          hasAnswer = selectedAnswer !== null;
          answerValue = selectedAnswer!;
        }
        
        // Save answer or mark as skipped
        if (hasAnswer) {
          newAnswers[currentQuestionIndex] = { answer: answerValue, skipped: false };
        } else if (answers[currentQuestionIndex] === undefined) {
          // Only mark as skipped if no previous answer exists
          newAnswers[currentQuestionIndex] = { answer: '', skipped: true };
        }
        setAnswers(newAnswers);
      }
      
      const newIndex = currentQuestionIndex - 1;
      const prevQuestion = questions[newIndex];
      
      setCurrentQuestionIndex(newIndex);
      setVisitedQuestions(prev => new Set(prev).add(newIndex));
      
      // Reset answer states based on question type
      if (prevQuestion.type === 'fillInTheBlank' || prevQuestion.type === 'shortAnswer') {
        setTextAnswer(answers[newIndex]?.answer as string || '');
        setSelectedAnswer(null);
        setSelectedAnswers([]);
      } else if (prevQuestion.type === 'multipleChoiceMultiple') {
        setSelectedAnswers(Array.isArray(answers[newIndex]?.answer) ? answers[newIndex].answer as number[] : []);
        setSelectedAnswer(null);
        setTextAnswer('');
      } else {
        setSelectedAnswer(typeof answers[newIndex]?.answer === 'number' ? answers[newIndex].answer as number : null);
        setTextAnswer('');
        setSelectedAnswers([]);
      }
      
      // ==================== MODE: See results only at the end ====================
      // In "showResultsAtEnd" mode, NEVER show feedback screen during exam
      // Only at the very end after last question
      // ✅ FIX: In review mode (after exam completion), ALWAYS show feedback
      if (examCompleted) {
        setScreen('feedback');
      } else if (showResultsAtEnd) {
        setScreen('question');
      } else {
        // ==================== MODE: Show feedback immediately (default) ====================
        // If the previous question was already answered, go to feedback screen
        if (answers[newIndex] !== undefined) {
          setScreen('feedback');
        } else {
          // Otherwise go to question screen
          setScreen('question');
        }
      }
    }
  }, [currentQuestionIndex, questions, showResultsAtEnd, answers, textAnswer, selectedAnswers, selectedAnswer, examCompleted, setCurrentQuestionIndex, setVisitedQuestions, setScreen]);

  return {
    // State
    selectedAnswer,
    setSelectedAnswer,
    selectedAnswers,
    setSelectedAnswers,
    textAnswer,
    setTextAnswer,
    answers,
    setAnswers,
    finalAnswers,
    setFinalAnswers,

    // Validation functions
    isAnswerCorrect,
    getAnswerScorePercentage,
    getFeedbackText,

    // Handlers
    handleAnswerSelect,
    handleTextAnswerChange,
    handleAnswerToggle,
    handleNext,
    handleContinue,
    handleBack,
  };
}
