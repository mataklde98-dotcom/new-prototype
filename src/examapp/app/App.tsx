// ✅ PHASE 5: REFACTORED App.tsx - Pure Screen Router (~200 lines)
// All state management moved to custom hooks
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import svgPaths from '../imports/svg-urzdbglsr2';
import type { CompletedExam } from './utils/completedExamsStorage';
// ✅ CUSTOM HOOKS
import { useContentSelection } from '../hooks/useContentSelection';
import { useExamState } from '../hooks/useExamState';
import { useExamTimer } from '../hooks/useExamTimer';
import { useExamAnswers } from '../hooks/useExamAnswers';
import { useExamSession } from '../hooks/useExamSession';
import { useProgressBar } from '../hooks/useProgressBar';
import { useExamNavigation } from '../hooks/useExamNavigation';
import { useSaveToHistory } from '../hooks/useSaveToHistory';
// ✅ SCREEN COMPONENTS
import {
  SubjectSelectionScreen,
  CategorySelectionScreen,
  TopicSelectionScreen,
  SubtopicSelectionScreen,
  ExamConfigurationScreen,
  ContentTreeSelectionScreen,
  StartScreen,
  QuestionScreen,
  ResultsScreenWrapper,
  ExamFeedbackScreenWrapper,
} from './components/screens';

// ==================== REACT QUERY CLIENT (OUTSIDE COMPONENT) ====================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false },
    mutations: { retry: 2 },
  },
});

// ==================== MAIN APP COMPONENT ====================
function ExamApp({
  onClose,
  reviewingCompletedExam,
  examWeaknessContext,
}: {
  onClose?: () => void;
  reviewingCompletedExam?: CompletedExam;
  examWeaknessContext?: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo' | 'learning-goal' | 'recommendation'; examTitle?: string; examDurationMinutes?: number; severityLabel?: string; contextLabel?: string; notificationLabel?: string; assignedDate?: string } | null;
}) {
  // ==================== HOOKS ====================
  const content = useContentSelection();
  const exam = useExamState({ reviewingCompletedExam });

  const timerHook = useExamTimer({
    initialMinutes: 10,
    screen: exam.screen,
    examCompleted: exam.examCompleted,
    onTimeUp: () => {
      console.log('⏰ Zeit abgelaufen - forwarding to calculateResultsAndNavigate');
    },
  });

  const examAnswers = useExamAnswers({
    questions: exam.questions,
    currentQuestionIndex: exam.currentQuestionIndex,
    setCurrentQuestionIndex: exam.setCurrentQuestionIndex,
    screen: exam.screen,
    setScreen: exam.setScreen,
    showResultsAtEnd: exam.showResultsAtEnd,
    examCompleted: exam.examCompleted,
    isFirstLoad: exam.isFirstLoad,
    setIsFirstLoad: exam.setIsFirstLoad,
    visitedQuestions: exam.visitedQuestions,
    setVisitedQuestions: exam.setVisitedQuestions,
    timer: timerHook.timer,
    examDuration: timerHook.examDuration,
    setTimer: timerHook.setTimer,
    onExamFinished: () => { exam.setExamCompleted(true); },
    onPrepareDataForAI: () => session.prepareDataForAI(),
  });

  const session = useExamSession({
    userId: exam.userId,
    questions: exam.questions,
    apiQuestions: exam.apiQuestions,
    showResultsAtEnd: exam.showResultsAtEnd,
    examConfig: {
      showResultsAtEnd: false, allowSkipping: true, allowReview: true, allowBack: true,
      showTimer: true, timeWarningMinutes: 2, pauseAllowed: false, calculatorAllowed: false, notesAllowed: false,
    },
    selectionState: content.selectionState,
    setSelectionState: content.setSelectionState,
    subtopicsCache: content.subtopicsCache,
    timer: timerHook.timer,
    answers: examAnswers.answers,
    visitedQuestions: exam.visitedQuestions,
    selectedAnswer: examAnswers.selectedAnswer,
    selectedAnswers: examAnswers.selectedAnswers,
    textAnswer: examAnswers.textAnswer,
    currentQuestionIndex: exam.currentQuestionIndex,
    currentExamId: exam.currentExamId,
    examStartTime: exam.examStartTime,
    evaluateExamAPI: exam.evaluateExamAPI,
  });

  const progressBar = useProgressBar({
    questions: exam.questions,
    answers: examAnswers.answers,
    currentQuestionIndex: exam.currentQuestionIndex,
    totalQuestions: exam.totalQuestions,
    showResultsAtEnd: exam.showResultsAtEnd,
    screen: exam.screen,
    isFirstLoad: exam.isFirstLoad,
    isAnswerCorrect: examAnswers.isAnswerCorrect,
  });

  const navigation = useExamNavigation({
    screen: exam.screen, setScreen: exam.setScreen,
    examCompleted: exam.examCompleted, setExamCompleted: exam.setExamCompleted,
    examSavedToHistory: exam.examSavedToHistory, setExamSavedToHistory: exam.setExamSavedToHistory,
    isReviewMode: exam.isReviewMode, setIsReviewMode: exam.setIsReviewMode,
    isCreatingExam: exam.isCreatingExam, setIsCreatingExam: exam.setIsCreatingExam,
    showResultsAtEnd: exam.showResultsAtEnd,
    answers: examAnswers.answers, setAnswers: examAnswers.setAnswers,
    finalAnswers: examAnswers.finalAnswers, setFinalAnswers: examAnswers.setFinalAnswers,
    questions: exam.questions, currentQuestionIndex: exam.currentQuestionIndex,
    setCurrentQuestionIndex: exam.setCurrentQuestionIndex,
    setSelectedAnswer: examAnswers.setSelectedAnswer, setSelectedAnswers: examAnswers.setSelectedAnswers,
    setTextAnswer: examAnswers.setTextAnswer,
    setVisitedQuestions: exam.setVisitedQuestions, setIsFirstLoad: exam.setIsFirstLoad,
    timer: timerHook.timer, setTimer: timerHook.setTimer, examDuration: timerHook.examDuration,
    selectionState: content.selectionState, setSelectionState: content.setSelectionState,
    examSession: session.examSession, questionTimings: session.questionTimings,
    setQuestionTimings: session.setQuestionTimings,
    startExamSession: session.startExamSession, startQuestionTiming: session.startQuestionTiming,
    prepareDataForAI: session.prepareDataForAI, isAnswerCorrect: examAnswers.isAnswerCorrect,
    userId: exam.userId, userRegistration: exam.userRegistration,
    onClose, reviewingCompletedExam,
    examWeaknessContext,
    setShowConfirmDialog: exam.setShowConfirmDialog, setConfirmDialogTitle: exam.setConfirmDialogTitle,
    setConfirmDialogMessage: exam.setConfirmDialogMessage, setConfirmDialogAction: exam.setConfirmDialogAction,
  });

  // ==================== REVIEW MODE: SET ANSWERS FROM COMPLETED EXAM ====================
  useEffect(() => {
    if (reviewingCompletedExam) {
      examAnswers.setAnswers(reviewingCompletedExam.answers || []);
      examAnswers.setFinalAnswers(reviewingCompletedExam.answers || []);
      const totalDurationMinutes = reviewingCompletedExam.totalQuestions * 2;
      timerHook.setExamDuration(totalDurationMinutes);
      const totalSeconds = totalDurationMinutes * 60;
      timerHook.setTimer(Math.max(0, totalSeconds - reviewingCompletedExam.timeSpent));
    }
  }, [reviewingCompletedExam]);

  // ==================== GENERATE EXAM: INIT ANSWERS ON SUCCESS ====================
  useEffect(() => {
    if (exam.apiQuestions.length > 0 && !exam.examCompleted && !reviewingCompletedExam) {
      const currentAnswersLen = examAnswers.answers.length;
      if (currentAnswersLen === 0 || currentAnswersLen !== exam.apiQuestions.length) {
        examAnswers.setAnswers(exam.apiQuestions.map(() => ({ answer: '', skipped: false })));
      }
    }
  }, [exam.apiQuestions]);

  // ==================== SAVE TO HISTORY ====================
  useSaveToHistory({
    examSavedToHistory: exam.examSavedToHistory,
    setExamSavedToHistory: exam.setExamSavedToHistory,
    examCompleted: exam.examCompleted,
    screen: exam.screen,
    finalAnswers: examAnswers.finalAnswers,
    apiEvaluationResult: exam.apiEvaluationResult,
    questions: exam.questions,
    currentExamId: exam.currentExamId,
    selectionState: content.selectionState,
    examStartTime: exam.examStartTime,
    userId: exam.userId,
    userRegistration: exam.userRegistration,
    isAnswerCorrect: examAnswers.isAnswerCorrect,
  });

  // ==================== WEAKNESS CONTEXT: SKIP TO EXAM CONFIGURATION ====================
  useEffect(() => {
    if (examWeaknessContext && !reviewingCompletedExam) {
      // Pre-fill selection state with weakness context data
      const subjectMap: Record<string, string> = {
        'Mathematik': 'math',
        'Deutsch': 'german',
        'Englisch': 'english',
        'Biologie': 'biology',
        'Französisch': 'french',
        'Geschichte': 'history',
        'Physik': 'physics',
        'Chemie': 'chemistry',
      };
      const subjectId = subjectMap[examWeaknessContext.subject] || 'math';
      
      // Create a mock subtopic from the weakness topic
      const mockSubtopic = { id: `weakness-${examWeaknessContext.topic.toLowerCase().replace(/\s+/g, '-')}`, name: examWeaknessContext.topic };
      
      content.setSelectionState({
        subject: { id: subjectId, name: examWeaknessContext.subject },
        selectedTopic: { id: `topic-${examWeaknessContext.topic.toLowerCase().replace(/\s+/g, '-')}`, name: examWeaknessContext.topic },
        subtopicsByTopic: { [`topic-${examWeaknessContext.topic.toLowerCase().replace(/\s+/g, '-')}`]: [mockSubtopic] },
        selectedSubtopics: [mockSubtopic],
      });
      
      // Skip directly to exam configuration screen
      exam.setScreen('examConfiguration');
    }
  }, [examWeaknessContext]);

  // ==================== SCREEN ROUTER ====================
  if (exam.screen === 'subjectSelection') {
    return (
      <SubjectSelectionScreen
        isLoading={content.isLoading} subjects={content.subjects} selectionState={content.selectionState}
        categoriesCache={content.categoriesCache} loadedScreens={content.loadedScreens}
        emptyContentModal={exam.emptyContentModal} setIsLoading={content.setIsLoading}
        setSelectionState={content.setSelectionState} setCategoriesCache={content.setCategoriesCache}
        setLoadedScreens={content.setLoadedScreens} setEmptyContentModal={exam.setEmptyContentModal}
        setScreen={exam.setScreen} onClose={onClose}
      />
    );
  }

  if (exam.screen === 'categorySelection') {
    return (
      <CategorySelectionScreen
        isLoading={content.isLoading} selectionState={content.selectionState}
        categoriesCache={content.categoriesCache} topicsCache={content.topicsCache}
        loadedScreens={content.loadedScreens} expectedDeletedCategoryId={content.expectedDeletedCategoryId}
        emptyContentModal={exam.emptyContentModal} setIsLoading={content.setIsLoading}
        setSelectionState={content.setSelectionState} setCategoriesCache={content.setCategoriesCache}
        setTopicsCache={content.setTopicsCache} setLoadedScreens={content.setLoadedScreens}
        setExpectedDeletedCategoryId={content.setExpectedDeletedCategoryId}
        setEmptyContentModal={exam.setEmptyContentModal} setScreen={exam.setScreen}
        onClose={onClose}
      />
    );
  }

  if (exam.screen === 'contentTreeSelection') {
    return (
      <ContentTreeSelectionScreen
        selectionState={content.selectionState}
        categoriesCache={content.categoriesCache}
        setCategoriesCache={content.setCategoriesCache}
        setSelectionState={content.setSelectionState}
        setPreviousScreen={content.setPreviousScreen}
        setScreen={exam.setScreen}
        onClose={onClose}
      />
    );
  }

  if (exam.screen === 'topicSelection') {
    return (
      <TopicSelectionScreen
        isLoading={content.isLoading} selectionState={content.selectionState}
        topicsCache={content.topicsCache} subtopicsCache={content.subtopicsCache}
        loadedScreens={content.loadedScreens} emptyContentModal={exam.emptyContentModal}
        showAlert={exam.showAlert} alertTitle={exam.alertTitle} alertMessage={exam.alertMessage}
        showConfirmDialog={exam.showConfirmDialog} confirmDialogTitle={exam.confirmDialogTitle}
        confirmDialogMessage={exam.confirmDialogMessage} confirmDialogAction={exam.confirmDialogAction}
        expectedDeletedCategoryId={content.expectedDeletedCategoryId}
        setIsLoading={content.setIsLoading} setSelectionState={content.setSelectionState}
        setSubtopicsCache={content.setSubtopicsCache} setLoadedScreens={content.setLoadedScreens}
        setEmptyContentModal={exam.setEmptyContentModal} setShowAlert={exam.setShowAlert}
        setShowConfirmDialog={exam.setShowConfirmDialog} setExpectedDeletedCategoryId={content.setExpectedDeletedCategoryId}
        setPreviousScreen={content.setPreviousScreen} setScreen={exam.setScreen}
        onClose={onClose}
      />
    );
  }

  if (exam.screen === 'subtopicSelection') {
    return (
      <SubtopicSelectionScreen
        isLoading={content.isLoading} selectionState={content.selectionState}
        subtopicsCache={content.subtopicsCache} emptyContentModal={exam.emptyContentModal}
        setIsLoading={content.setIsLoading} setSelectionState={content.setSelectionState}
        setEmptyContentModal={exam.setEmptyContentModal} setPreviousScreen={content.setPreviousScreen}
        setScreen={exam.setScreen}
        onClose={onClose}
      />
    );
  }

  if (exam.screen === 'examConfiguration') {
    // Determine context label based on source
    const isPracticeContext = examWeaknessContext?.source === 'practice';
    const isExamPracticeContext = isPracticeContext && !!examWeaknessContext?.examTitle;
    const isRiskContext = examWeaknessContext?.source === 'risk';
    const isKnowledgeGapContext = examWeaknessContext?.source === 'knowledge-gap';
    const isPrepTodoContext = examWeaknessContext?.source === 'prep-todo';
    const isLearningGoalContext = examWeaknessContext?.source === 'learning-goal';
    const isTeacherTaskContext = examWeaknessContext?.source === 'teacher-task';
    const contextLabel = examWeaknessContext
      ? examWeaknessContext.contextLabel
        ? examWeaknessContext.contextLabel
        : isLearningGoalContext
          ? 'Lernziel erreichen'
          : isPrepTodoContext
            ? 'Klassenarbeit-Vorbereitung'
            : isExamPracticeContext
              ? 'Klassenarbeit-Vorbereitung'
              : isPracticeContext
                ? 'Ausgewähltes Thema:'
                : isTeacherTaskContext
                  ? 'Lehrer-Aufgabe'
                  : isRiskContext
                    ? 'Risiko-Thema gezielt vorbereiten'
                    : isKnowledgeGapContext
                      ? 'Wissenslücke schließen'
                      : examWeaknessContext?.source === 'recommendation'
                        ? 'KI-Empfehlung'
                        : 'Schwäche gezielt trainieren'
      : undefined;

    const notificationLabel = examWeaknessContext?.notificationLabel || undefined;

    return (
      <ExamConfigurationScreen
        selectionState={content.selectionState} setSelectionState={content.setSelectionState}
        subtopicsCache={content.subtopicsCache} previousScreen={content.previousScreen}
        userId={exam.userId} userRegistration={exam.userRegistration}
        setTimer={timerHook.setTimer} setExamDuration={timerHook.setExamDuration}
        setShowResultsAtEnd={exam.setShowResultsAtEnd} setIsCreatingExam={exam.setIsCreatingExam}
        setScreen={exam.setScreen} generateExamAPI={exam.generateExamAPI}
        lockedMode={!!examWeaknessContext}
        contextLabel={contextLabel}
        weaknessSeverity={examWeaknessContext?.severity}
        source={examWeaknessContext?.source}
        examTitle={examWeaknessContext?.examTitle}
        lockedDuration={(examWeaknessContext?.source === 'prep-todo' || examWeaknessContext?.source === 'teacher-task') ? examWeaknessContext?.examDurationMinutes : undefined}
        assignedDate={examWeaknessContext?.source === 'teacher-task' ? examWeaknessContext?.assignedDate : undefined}
        severityLabel={examWeaknessContext?.severityLabel}
        notificationLabel={notificationLabel}
        onClose={onClose}
      />
    );
  }

  if (exam.screen === 'start') {
    return <StartScreen onStartClick={navigation.handleStartClick} isCreatingExam={exam.isCreatingExam} />;
  }

  if (exam.screen === 'examFeedback') {
    return <ExamFeedbackScreenWrapper onSubmit={navigation.handleFeedbackSubmit} onSkip={navigation.handleFeedbackSkip} />;
  }

  if (exam.screen === 'results') {
    return (
      <ResultsScreenWrapper
        questions={exam.questions} totalQuestions={exam.totalQuestions}
        finalAnswers={examAnswers.finalAnswers} apiEvaluationResult={exam.apiEvaluationResult}
        showResultsAtEnd={exam.showResultsAtEnd} isAnswerCorrect={examAnswers.isAnswerCorrect}
        setAnswers={examAnswers.setAnswers} setCurrentQuestionIndex={exam.setCurrentQuestionIndex}
        setSelectedAnswer={examAnswers.setSelectedAnswer} setSelectedAnswers={examAnswers.setSelectedAnswers}
        setTextAnswer={examAnswers.setTextAnswer} setVisitedQuestions={exam.setVisitedQuestions}
        setIsFirstLoad={exam.setIsFirstLoad} setIsReviewMode={exam.setIsReviewMode}
        setScreen={exam.setScreen} handleClose={navigation.handleClose}
      />
    );
  }

  // ==================== QUESTION / FEEDBACK SCREEN (default) ====================
  return (
    <QuestionScreen
      screen={exam.screen} isReviewMode={exam.isReviewMode} isFirstLoad={exam.isFirstLoad}
      examCompleted={exam.examCompleted} questions={exam.questions} currentQuestion={exam.currentQuestion}
      currentQuestionIndex={exam.currentQuestionIndex} totalQuestions={exam.totalQuestions}
      isRevisitingQuestion={exam.examCompleted ? false : (examAnswers.answers[exam.currentQuestionIndex] !== undefined)}
      selectedAnswer={examAnswers.selectedAnswer} selectedAnswers={examAnswers.selectedAnswers}
      textAnswer={examAnswers.textAnswer} answers={examAnswers.answers}
      setAnswers={examAnswers.setAnswers} timer={timerHook.timer}
      examDuration={timerHook.examDuration} formatTime={timerHook.formatTime}
      svgPaths={svgPaths} progressContainerRef={progressBar.progressContainerRef}
      contentScrollRef={progressBar.contentScrollRef} getProgress={progressBar.getProgress}
      handleClose={navigation.handleClose} handleAnswerSelect={examAnswers.handleAnswerSelect}
      handleTextAnswerChange={examAnswers.handleTextAnswerChange}
      handleAnswerToggle={examAnswers.handleAnswerToggle} handleNext={examAnswers.handleNext}
      handleContinue={examAnswers.handleContinue} handleBack={examAnswers.handleBack}
      isAnswerCorrect={examAnswers.isAnswerCorrect}
      getAnswerScorePercentage={examAnswers.getAnswerScorePercentage}
      getFeedbackText={examAnswers.getFeedbackText}
      showConfirmDialog={exam.showConfirmDialog} confirmDialogTitle={exam.confirmDialogTitle}
      confirmDialogMessage={exam.confirmDialogMessage} confirmDialogAction={exam.confirmDialogAction}
      setShowConfirmDialog={exam.setShowConfirmDialog}
    />
  );
}

// ==================== WRAPPER WITH QUERY CLIENT PROVIDER ====================
export default function App({
  onClose,
  reviewingCompletedExam,
  examWeaknessContext,
}: {
  onClose?: () => void;
  reviewingCompletedExam?: CompletedExam;
  examWeaknessContext?: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo' | 'learning-goal' | 'recommendation'; examTitle?: string; examDurationMinutes?: number; severityLabel?: string; contextLabel?: string; notificationLabel?: string; assignedDate?: string } | null;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ExamApp onClose={onClose} reviewingCompletedExam={reviewingCompletedExam} examWeaknessContext={examWeaknessContext} />
    </QueryClientProvider>
  );
}