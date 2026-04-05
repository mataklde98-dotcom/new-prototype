// ==================== RESULTS SCREEN WRAPPER ====================
// Extrahiert aus App.tsx - Ergebnisanzeige mit Grade-Berechnung
// 1:1 Kopie des screen === 'results' Blocks (inkl. API/Client-Side Berechnung)

import ExamResultsScreen from '../ExamResultsScreen';
import MobileViewportLayout from './MobileViewportLayout';
import type { Question } from '../../types/api-types';
import type { EvaluateExamResponse } from '../../../services/examSimulationTypes';

type AnswerEntry = {
  answer: number | string | number[];
  showSolution?: boolean;
  skipped?: boolean;
};

interface ResultsScreenWrapperProps {
  // Data
  questions: Question[];
  totalQuestions: number;
  finalAnswers: AnswerEntry[];
  apiEvaluationResult: EvaluateExamResponse | null;
  showResultsAtEnd: boolean;
  
  // Validation
  isAnswerCorrect: (answer: number | string | number[], question: Question) => boolean;
  
  // State setters for review navigation
  setAnswers: React.Dispatch<React.SetStateAction<AnswerEntry[]>>;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedAnswers: React.Dispatch<React.SetStateAction<number[]>>;
  setTextAnswer: React.Dispatch<React.SetStateAction<string>>;
  setVisitedQuestions: React.Dispatch<React.SetStateAction<Set<number>>>;
  setIsFirstLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setIsReviewMode: React.Dispatch<React.SetStateAction<boolean>>;
  setScreen: (screen: string) => void;
  
  // Callbacks
  handleClose: () => void;
}

export default function ResultsScreenWrapper({
  questions,
  totalQuestions,
  finalAnswers,
  apiEvaluationResult,
  showResultsAtEnd,
  isAnswerCorrect,
  setAnswers,
  setCurrentQuestionIndex,
  setSelectedAnswer,
  setSelectedAnswers,
  setTextAnswer,
  setVisitedQuestions,
  setIsFirstLoad,
  setIsReviewMode,
  setScreen,
  handleClose,
}: ResultsScreenWrapperProps) {
  // Calculate statistics
  // ==================== RESULTS: API or Client-Side Calculation ====================
  // Use API evaluation result if available, otherwise fallback to client-side calculation
  const skippedAnswers = finalAnswers.filter(answer => answer.skipped).length;
  
  let correctAnswers: number;
  let incorrectAnswers: number;
  let totalPoints: number;
  let earnedPoints: number;
  let grade: number;
  
  if (apiEvaluationResult) {
    // ✅ Use API evaluation results
    console.log('✅ Using API Evaluation Results:', apiEvaluationResult);
    
    totalPoints = apiEvaluationResult.pointsTotal;
    earnedPoints = apiEvaluationResult.pointsAchieved;
    grade = apiEvaluationResult.grade;
    
    // Calculate correct/incorrect from feedback
    correctAnswers = apiEvaluationResult.feedback.filter(f => f.isCorrect).length;
    incorrectAnswers = apiEvaluationResult.feedback.filter(f => !f.isCorrect).length - skippedAnswers;
  } else {
    // Fallback: Client-side calculation (temporary)
    console.log('⚠️ Using Client-Side Calculation (Fallback)');
    
    correctAnswers = finalAnswers.filter((answer, index) => 
      !answer.skipped && isAnswerCorrect(answer.answer, questions[index])
    ).length;
    incorrectAnswers = finalAnswers.filter((answer, index) =>
      !answer.skipped && !isAnswerCorrect(answer.answer, questions[index])
    ).length;

    // Calculate points (skipped questions don't count)
    totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    earnedPoints = finalAnswers.reduce((sum, answer, index) => {
      const question = questions[index];
      if (!answer.skipped && isAnswerCorrect(answer.answer, question)) {
        return sum + question.points;
      }
      return sum;
    }, 0);
    
    // Calculate grade from percentage (German grading system 1-6)
    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    if (percentage >= 92) grade = 1.0;
    else if (percentage >= 81) grade = 2.0;
    else if (percentage >= 67) grade = 3.0;
    else if (percentage >= 50) grade = 4.0;
    else if (percentage >= 30) grade = 5.0;
    else grade = 6.0;
  }
  
  // NOTE: Exam saving is now handled by useEffect at the top level (before conditional returns)

  // Helper to set up first question state for review
  const setupFirstQuestionForReview = () => {
    // Reset showSolution for all answers so solutions are closed when reviewing
    const resetAnswers = finalAnswers.map(a => ({ ...a, showSolution: false }));
    setAnswers(resetAnswers);
    setCurrentQuestionIndex(0);
    // Set up state for first question review
    const firstQuestion = questions[0];
    if (firstQuestion.type === 'fillInTheBlank' || firstQuestion.type === 'shortAnswer') {
      setTextAnswer(finalAnswers[0]?.answer as string || '');
      setSelectedAnswer(null);
      setSelectedAnswers([]);
    } else if (firstQuestion.type === 'multipleChoiceMultiple') {
      setSelectedAnswers(Array.isArray(finalAnswers[0]?.answer) ? finalAnswers[0].answer as number[] : []);
      setTextAnswer('');
      setSelectedAnswer(null);
    } else {
      setSelectedAnswer(typeof finalAnswers[0]?.answer === 'number' ? finalAnswers[0].answer : null);
      setTextAnswer('');
      setSelectedAnswers([]);
    }
    setVisitedQuestions(new Set([0]));
    setIsFirstLoad(true);
    setIsReviewMode(true); // Enable review mode to show total/remaining time
  };

  return (
    <MobileViewportLayout>
      <ExamResultsScreen
        totalQuestions={totalQuestions}
        correctAnswers={correctAnswers}
        incorrectAnswers={incorrectAnswers}
        skippedAnswers={skippedAnswers}
        earnedPoints={earnedPoints}
        totalPoints={totalPoints}
        showReviewButton={showResultsAtEnd}
        onReviewExam={showResultsAtEnd ? () => {
          setupFirstQuestionForReview();
          setScreen('feedback'); // Use feedback screen instead of review
        } : undefined}
        onViewExam={() => {
          if (showResultsAtEnd) {
            // Close results and return to subject selection
            handleClose();
          } else {
            // Default mode: Reset to first question with all answers preserved
            setupFirstQuestionForReview();
            setScreen('feedback');
          }
        }}
        onClose={handleClose}
      />
    </MobileViewportLayout>
  );
}