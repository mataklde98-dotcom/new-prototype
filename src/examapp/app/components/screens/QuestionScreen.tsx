// ==================== QUESTION SCREEN ====================
// Extrahiert aus App.tsx - Hauptscreen für Fragen + Feedback
// 1:1 Kopie des main return Blocks (question/feedback Ansicht)
// Enthält: Header mit Timer, Progress Bars, animierter Content, Navigation Box

import { motion, AnimatePresence } from 'motion/react';
import ChoicesBox from '../ChoicesBox';
import MultipleChoicesBox from '../MultipleChoicesBox';
import FillInTheBlankInput from '../FillInTheBlankInput';
import FillInTheBlankChoice from '../FillInTheBlankChoice';
import { ConfirmDialog } from '@/shared-content-selection';
import Button from '@/app/components/Button';
import CloseButton from '@/app/components/CloseButton';
import type { Question } from '../../types/api-types';
import type { ProgressResult } from '../../../hooks/useProgressBar';

type AnswerEntry = {
  answer: number | string | number[];
  showSolution?: boolean;
  skipped?: boolean;
};

interface QuestionScreenProps {
  // Screen state
  screen: string;
  isReviewMode: boolean;
  isFirstLoad: boolean;
  examCompleted: boolean;
  
  // Question data
  questions: Question[];
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  isRevisitingQuestion: boolean;
  
  // Answer state
  selectedAnswer: number | null;
  selectedAnswers: number[];
  textAnswer: string;
  answers: AnswerEntry[];
  setAnswers: React.Dispatch<React.SetStateAction<AnswerEntry[]>>;
  
  // Timer
  timer: number;
  examDuration: number;
  formatTime: (seconds: number) => string;
  
  // SVG paths (from Figma imports)
  svgPaths: any;
  
  // Progress
  progressContainerRef: React.RefObject<HTMLDivElement | null>;
  contentScrollRef: React.RefObject<HTMLDivElement | null>;
  getProgress: () => ProgressResult;
  
  // Handlers
  handleClose: () => void;
  handleAnswerSelect: (answerIndex: number) => void;
  handleTextAnswerChange: (text: string) => void;
  handleAnswerToggle: (answerIndex: number) => void;
  handleNext: () => void;
  handleContinue: () => void;
  handleBack: () => void;
  
  // Validation
  isAnswerCorrect: (answer: number | string | number[], question: Question) => boolean;
  getAnswerScorePercentage: (answer: number | string | number[], question: Question) => number;
  getFeedbackText: (scorePercentage: number) => string;
  
  // Confirm dialog
  showConfirmDialog: boolean;
  confirmDialogTitle: string;
  confirmDialogMessage: string;
  confirmDialogAction: (() => void) | null;
  setShowConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function QuestionScreen({
  screen,
  isReviewMode,
  isFirstLoad,
  examCompleted,
  questions,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  isRevisitingQuestion,
  selectedAnswer,
  selectedAnswers,
  textAnswer,
  answers,
  setAnswers,
  timer,
  examDuration,
  formatTime,
  svgPaths,
  progressContainerRef,
  contentScrollRef,
  getProgress,
  handleClose,
  handleAnswerSelect,
  handleTextAnswerChange,
  handleAnswerToggle,
  handleNext,
  handleContinue,
  handleBack,
  isAnswerCorrect,
  getAnswerScorePercentage,
  getFeedbackText,
  showConfirmDialog,
  confirmDialogTitle,
  confirmDialogMessage,
  confirmDialogAction,
  setShowConfirmDialog,
}: QuestionScreenProps) {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Desktop: Center and constrain to mobile viewport size with 80% scale */}
      <div className="relative w-full h-full lg:max-w-[430px] lg:max-h-[932px] lg:scale-[0.8] lg:origin-center lg:overflow-hidden lg:rounded-[24px]">
        {/* Mobile Viewport Container */}
        <div className="size-full flex flex-col bg-[#0a0a0a] overflow-hidden lg:relative lg:rounded-[24px] lg:shadow-2xl lg:border lg:border-white/10 pt-safe">
          {/* Static Header with Timer and Close */}
          <div className="px-6 py-3 flex-shrink-0 mt-3 lg:mt-0">
            <div className="flex items-center justify-between mb-4">
              <div className="w-[42px]" />
              
              {isReviewMode ? (
                // Review Mode: Show both total time and remaining time with labels
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[rgba(255,255,255,0.6)] mb-1 leading-none">Gesamtzeit</p>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-white leading-none">
                      {formatTime(examDuration * 60)}
                    </p>
                  </div>
                  <div className="h-[35px] w-[1px] bg-[rgba(255,255,255,0.2)]" />
                  <div className="flex flex-col items-center">
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[rgba(255,255,255,0.6)] mb-1 leading-none">Restzeit</p>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-white leading-none">
                      {formatTime(timer)}
                    </p>
                  </div>
                </div>
              ) : (
                // Normal Mode: Show only timer with icon (during exam and immediate feedback)
                <div className="flex items-center gap-2">
                  <div className="size-5">
                    <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                      <path d={svgPaths.p1f1b6800} stroke={timer < 60 ? '#e74c3c' : '#ffffff'} strokeWidth="3" />
                      <path d={svgPaths.p2edd2b80} stroke={timer < 60 ? '#e74c3c' : '#ffffff'} strokeLinecap="round" strokeWidth="3" />
                    </svg>
                  </div>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[30px]" style={{ color: timer < 60 ? '#e74c3c' : '#ffffff' }}>
                    {formatTime(timer)}
                  </p>
                </div>
              )}

              <CloseButton onClick={handleClose} />
            </div>

            {/* Progress bars */}
            <div 
              className="flex gap-[5px] items-center mb-3 overflow-x-hidden relative" 
              ref={progressContainerRef}
            >
              <motion.div
                className="flex gap-[5px] items-center"
                animate={{ 
                  x: -getProgress().scrollOffset,
                  marginLeft: getProgress().shouldCutLeft ? -10 : 0,
                  marginRight: (getProgress().shouldCutRight && !getProgress().shouldCutLeft) ? -10 : 0
                }}
                transition={isFirstLoad ? {} : {
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                style={{
                  width: 'fit-content'
                }}
              >
                {getProgress().bars.map((bar) => (
                  <motion.div
                    key={bar.questionIndex}
                    className="rounded-[13px] w-[36px] flex-shrink-0"
                    initial={isFirstLoad ? { backgroundColor: bar.color, height: bar.height } : false}
                    animate={{
                      backgroundColor: bar.color,
                      height: bar.height
                    }}
                    transition={isFirstLoad ? {} : {
                      duration: 0.5,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </div>

          {/* Animated Content Area */}
          <div className="flex-1 overflow-y-auto px-6 pb-[13px]" ref={contentScrollRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`question-${currentQuestionIndex}`}
                initial={isFirstLoad ? false : { opacity: 0, y: 20, scale: 0.98 }}
                animate={isFirstLoad ? false : { opacity: 1, y: 0, scale: 1 }}
                exit={isFirstLoad ? false : { opacity: 0, y: -20, scale: 0.98 }}
                transition={isFirstLoad ? {} : { 
                  duration: 0.4, 
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                {/* Points */}
                <motion.div 
                  className="mb-4"
                  initial={isFirstLoad ? false : { opacity: 0, x: -10 }}
                  animate={isFirstLoad ? false : { opacity: 1, x: 0 }}
                  transition={isFirstLoad ? {} : { duration: 0.3, delay: 0.1 }}
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] font-['Poppins:SemiBold',sans-serif] text-[#797979] text-[12px] tracking-[0.5px]">
                    {currentQuestion.points} PKT
                  </span>
                </motion.div>

                {/* Question */}
                <motion.div 
                  className="mb-6"
                  initial={isFirstLoad ? false : { opacity: 0, x: -10 }}
                  animate={isFirstLoad ? false : { opacity: 1, x: 0 }}
                  transition={isFirstLoad ? {} : { duration: 0.3, delay: 0.15 }}
                >
                  {currentQuestion.topic && (
                    <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/35 mb-2.5">
                      Unterthema: {currentQuestion.topic.replace(/:$/, '')}
                    </p>
                  )}
                  <p className="font-['Poppins:Regular',sans-serif] text-white text-[15px] leading-[24px]">
                    {currentQuestion.question}
                  </p>
                </motion.div>

                {/* Choices */}
                {currentQuestion.type === 'fillInTheBlank' || currentQuestion.type === 'shortAnswer' ? (
                  <FillInTheBlankInput
                    textAnswer={textAnswer}
                    onTextAnswerChange={handleTextAnswerChange}
                    showFeedback={screen === 'feedback'}
                    correctAnswer={currentQuestion.correctAnswer}
                    isCorrect={isAnswerCorrect(textAnswer, currentQuestion)}
                    isRevisit={isRevisitingQuestion}
                    isInitialLoad={isFirstLoad}
                  />
                ) : currentQuestion.type === 'fillInTheBlankChoice' ? (
                  <FillInTheBlankChoice
                    textBefore={currentQuestion.textBefore!}
                    textAfter={currentQuestion.textAfter!}
                    choices={currentQuestion.choices!}
                    selectedChoice={selectedAnswer}
                    onChoiceSelect={handleAnswerSelect}
                    showFeedback={screen === 'feedback'}
                    correctAnswer={currentQuestion.correctAnswer as number}
                    isCorrect={isAnswerCorrect(selectedAnswer, currentQuestion)}
                    isRevisit={isRevisitingQuestion}
                    isInitialLoad={isFirstLoad}
                  />
                ) : currentQuestion.type === 'multipleChoiceMultiple' ? (
                  <MultipleChoicesBox
                    choices={currentQuestion.choices!}
                    selectedAnswers={selectedAnswers}
                    onAnswerToggle={handleAnswerToggle}
                    showFeedback={screen === 'feedback'}
                    correctAnswers={currentQuestion.correctAnswer as number[]}
                    isCorrect={isAnswerCorrect(selectedAnswers, currentQuestion)}
                    isRevisit={isRevisitingQuestion}
                    isInitialLoad={isFirstLoad}
                  />
                ) : (
                  <ChoicesBox
                    choices={currentQuestion.choices!}
                    selectedAnswer={selectedAnswer}
                    onAnswerSelect={handleAnswerSelect}
                    showFeedback={screen === 'feedback'}
                    correctAnswer={currentQuestion.correctAnswer}
                    isCorrect={isAnswerCorrect(selectedAnswer, currentQuestion)}
                    isRevisit={isRevisitingQuestion}
                    isInitialLoad={isFirstLoad}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Static Navigation Box */}
          <div className="flex-shrink-0 bg-gradient-to-br from-white/[0.08] to-white/[0.04] rounded-t-[16px] border border-white/[0.12] border-b-0">
            <div className="p-5 px-6">
              {screen === 'feedback' && (() => {
                const isSkipped = answers[currentQuestionIndex]?.skipped || false;
                const userAnswer = (currentQuestion.type === 'fillInTheBlank' || currentQuestion.type === 'shortAnswer') 
                  ? textAnswer 
                  : currentQuestion.type === 'multipleChoiceMultiple' 
                    ? selectedAnswers 
                    : selectedAnswer;
                const isCorrect = !isSkipped && isAnswerCorrect(userAnswer!, currentQuestion);
                const scorePercentage = !isSkipped ? getAnswerScorePercentage(userAnswer!, currentQuestion) : 0;
                const feedbackText = !isSkipped ? getFeedbackText(scorePercentage) : 'Übersprungen.';
                const feedbackColor = isSkipped ? 'text-[#797979]' : scorePercentage === 100 ? 'text-[#009379]' : scorePercentage > 0 ? 'text-[#FFA500]' : 'text-[#e74c3c]';
                
                return (
                  <motion.div
                    initial={{ maxHeight: 0, opacity: 0, y: 20 }}
                    animate={{ maxHeight: 300, opacity: 1, y: 0 }}
                    exit={{ maxHeight: 0, opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    {/* Feedback Header row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {!isSkipped && (
                          <div className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${
                            scorePercentage === 100 ? 'bg-[#009379]' : scorePercentage > 0 ? 'bg-[#FFA500]' : 'bg-[#e74c3c]'
                          }`} />
                        )}
                        <p className={`font-['Poppins:SemiBold',sans-serif] text-[15px] ${feedbackColor}`}>
                          {feedbackText}
                        </p>
                      </div>
                      <button 
                        className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40 hover:text-white/60 active:text-white/70 cursor-pointer transition-colors duration-200 bg-transparent border-none outline-none" 
                        onClick={() => {
                          const currentState = answers[currentQuestionIndex]?.showSolution || false;
                          const newAnswers = [...answers];
                          newAnswers[currentQuestionIndex] = {
                            ...newAnswers[currentQuestionIndex],
                            answer: userAnswer!,
                            showSolution: !currentState
                          };
                          setAnswers(newAnswers);
                        }}
                      >
                        {answers[currentQuestionIndex]?.showSolution ? 'Lösung ausblenden' : 'Lösung anzeigen'}
                      </button>
                    </div>
                    
                    {/* Solution text */}
                    <div className={`overflow-hidden transition-all duration-300 ${
                      answers[currentQuestionIndex]?.showSolution ? 'max-h-[500px] opacity-100 mb-5' : 'max-h-0 opacity-0 mb-0'
                    }`}>
                      <div className="max-h-[150px] overflow-y-auto pr-2">
                        <p className="font-['Poppins:Regular',sans-serif] text-[#969696] text-[13px] leading-[20px]">
                          {currentQuestion.solution}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Navigation Buttons */}
              <div className="flex gap-3 items-center">
                {/* Back Button */}
                <button 
                  className={`flex items-center justify-center size-[52px] rounded-full border border-white/[0.12] bg-gradient-to-br from-white/[0.08] to-white/[0.04] transition-colors flex-shrink-0 ${
                    currentQuestionIndex > 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                  style={undefined}
                  onClick={currentQuestionIndex > 0 ? handleBack : undefined}
                  disabled={currentQuestionIndex === 0}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Next Button */}
                <Button
                  size="lg"
                  fullWidth={false}
                  className="flex-1"
                  onClick={screen === 'question' ? handleNext : handleContinue}
                >
                  Weiter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ConfirmDialog for Question/Feedback screens */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title={confirmDialogTitle}
        message={confirmDialogMessage}
        onConfirm={() => {
          if (confirmDialogAction) {
            confirmDialogAction();
          }
        }}
        onCancel={() => setShowConfirmDialog(false)}
        confirmText="Ja"
        cancelText="Nein"
      />
    </div>
  );
}