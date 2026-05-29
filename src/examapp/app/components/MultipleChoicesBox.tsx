import { motion } from 'motion/react';
import svgPaths from '../../imports/svg-urzdbglsr2';

interface MultipleChoicesBoxProps {
  choices: string[];
  selectedAnswers: number[];
  onAnswerToggle: (answerIndex: number) => void;
  showFeedback: boolean;
  correctAnswers: number[];
  isCorrect: boolean;
  isRevisit: boolean;
  isInitialLoad: boolean;
}

export default function MultipleChoicesBox({
  choices,
  selectedAnswers,
  onAnswerToggle,
  showFeedback,
  correctAnswers,
  isCorrect,
  isRevisit,
  isInitialLoad
}: MultipleChoicesBoxProps) {
  return (
    <div className="space-y-4">
      {/* Hint Text */}
      <motion.p
        className="font-['Poppins:Regular',sans-serif] text-[#797979] text-[13px] italic"
        initial={isInitialLoad ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={isInitialLoad ? {} : { duration: 0.3, delay: 0.1 }}
      >
        Mehrere Antworten möglich
      </motion.p>

      {/* Choices */}
      <div className="space-y-[13px] mb-6">
        {choices.map((choice, index) => {
          const isSelected = selectedAnswers.includes(index);
          const isCorrectAnswer = correctAnswers.includes(index);
          
          // Feedback mode styling
          const showAsCorrect = showFeedback && isCorrectAnswer && isSelected;
          const showAsWrong = showFeedback && isSelected && !isCorrectAnswer;
          const showAsUnselectedCorrect = showFeedback && isCorrectAnswer && !isSelected;

          return (
            <motion.div
              key={index}
              initial={isInitialLoad ? false : { opacity: 0, y: 8 }}
              animate={isInitialLoad ? false : { opacity: 1, y: 0 }}
              transition={isInitialLoad ? {} : {
                duration: isRevisit ? 0.15 : 0.35,
                delay: isRevisit ? 0 : index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="relative"
            >
              <div
                className={`group relative min-h-[54px] rounded-2xl flex items-start px-[11px] py-[15px] transition-all duration-300 ${
                  showFeedback
                    ? showAsCorrect
                      ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-solid'
                      : showAsWrong
                      ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-solid'
                      : showAsUnselectedCorrect
                      ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-dashed'
                      : 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-solid border-white/[0.08]'
                    : `bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-solid ${
                      isSelected ? 'border-white/[0.2]' : 'border-white/[0.08]'
                    } cursor-pointer`
                }`}
                style={
                  showFeedback
                    ? {
                        borderColor: showAsCorrect
                          ? '#009379'
                          : showAsWrong
                          ? '#e74c3c'
                          : showAsUnselectedCorrect
                          ? '#009379'
                          : 'rgba(255, 255, 255, 0.08)',

                        WebkitTapHighlightColor: 'transparent',
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                        isolation: 'isolate',
                        zIndex: 1
                      }
                    : {
                        WebkitTapHighlightColor: 'transparent',
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                        isolation: 'isolate',
                        zIndex: 1
                      }
                }
                onClick={!showFeedback ? () => onAnswerToggle(index) : undefined}
              >
                {/* Hover Glow Effect - nur wenn nicht Feedback Mode */}


                {/* Checkmark for correct answer (feedback mode) */}
                {showFeedback && (showAsCorrect || showAsUnselectedCorrect) && (
                  <motion.div
                    className="relative z-10 size-[23px] flex items-center justify-center flex-shrink-0"
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1
                    }}
                  >
                    <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
                      <path d={svgPaths.pac8f470} fill="#009379" />
                    </svg>
                  </motion.div>
                )}

                {/* X mark for wrong answer (feedback mode) */}
                {showFeedback && showAsWrong && (
                  <motion.div
                    className="relative z-10 size-[23px] flex items-center justify-center flex-shrink-0"
                    initial={{ scale: 0, rotate: 90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M2 2L16 16" stroke="#e74c3c" strokeLinecap="round" strokeWidth="2.5" />
                      <path d="M16 2L2 16" stroke="#e74c3c" strokeLinecap="round" strokeWidth="2.5" />
                    </svg>
                  </motion.div>
                )}

                {/* Checkbox (question mode or non-selected feedback) */}
                {!showFeedback && (
                  <motion.div
                    className={`relative z-10 rounded-[6px] size-[23px] border-[1.5px] border-solid transition-all flex-shrink-0 flex items-center justify-center ${
                      isSelected ? 'bg-white/[0.15] border-white/[0.4]' : 'bg-white/[0.03] border-white/[0.15]'
                    }`}
                    animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.25 }}
                  >
                    {isSelected && (
                      <motion.svg 
                        width="12" height="9" viewBox="0 0 12 9" fill="none"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    )}
                  </motion.div>
                )}

                {/* Empty checkbox for non-selected answers in feedback mode */}
                {showFeedback && !showAsCorrect && !showAsWrong && !showAsUnselectedCorrect && (
                  <div className="relative z-10 bg-white/[0.03] border-white/[0.15] border-[1.5px] border-solid rounded-[5px] size-[23px] flex-shrink-0" />
                )}

                <p
                  className={`relative z-10 font-['Poppins:Medium',sans-serif] text-[15px] leading-[23px] ml-5 text-white`}
                >
                  {choice}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}