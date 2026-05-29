import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import svgPaths from '../../imports/svg-urzdbglsr2';

type FillInTheBlankChoiceProps = {
  textBefore: string;
  textAfter: string;
  choices: string[];
  selectedChoice: number | null;
  onChoiceSelect: (index: number) => void;
  showFeedback: boolean;
  correctAnswer: number;
  isCorrect: boolean;
  isRevisit: boolean;
  isInitialLoad: boolean;
};

export default function FillInTheBlankChoice({
  textBefore,
  textAfter,
  choices,
  selectedChoice,
  onChoiceSelect,
  showFeedback,
  correctAnswer,
  isCorrect,
  isRevisit,
  isInitialLoad
}: FillInTheBlankChoiceProps) {
  const [blankText, setBlankText] = useState<string>('');
  const blankRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (showFeedback && selectedChoice !== null) {
      // Sanft einblenden nach kurzem Delay
      setTimeout(() => {
        setBlankText(choices[isCorrect ? selectedChoice : correctAnswer]);
      }, 400); // Kurzes Delay für smooth transition
    }
  }, [showFeedback, selectedChoice, isCorrect, correctAnswer, choices]);

  const getBlankStyle = () => {
    if (!showFeedback || !blankText) {
      return {
        bg: 'bg-[#0a0a0a]',
        border: 'border-[#484848] border-dashed',
        text: 'text-[#797979]'
      };
    }

    if (isCorrect) {
      return {
        bg: 'bg-[#009379]/10',
        border: 'border-[#009379]',
        text: 'text-[#009379]'
      };
    } else {
      return {
        bg: 'bg-[#009379]/10',
        border: 'border-[#009379] border-dashed',
        text: 'text-[#009379]'
      };
    }
  };

  const blankStyle = getBlankStyle();

  return (
    <div>
      {/* Text with blank */}
      <motion.div 
        className="font-['Poppins:Regular',sans-serif] text-white text-[15px] leading-[24px] mb-6"
        initial={isInitialLoad ? false : { opacity: 0 }}
        animate={isInitialLoad ? false : { opacity: 1 }}
        transition={isInitialLoad ? {} : { duration: 0.3, delay: 0.2 }}
      >
        {textBefore}{' '}
        <span
          ref={blankRef}
          className={`inline-block min-w-[120px] px-3 py-1 rounded-lg border-2 transition-all duration-300 ${blankStyle.bg} ${blankStyle.border} ${blankStyle.text}`}
        >
          {blankText || '________'}
        </span>
        {' '}{textAfter}
      </motion.div>

      {/* Choice buttons - using the same design as ChoicesBox */}
      <div className="space-y-[13px] mb-6">
        {choices.map((choice, index) => {
          const isSelectedChoice = index === selectedChoice;
          const isCorrectChoice = index === correctAnswer;
          
          // Feedback mode styling (same as ChoicesBox)
          const showAsCorrectSolid = showFeedback && isCorrectChoice && isCorrect;
          const showAsCorrectDashed = showFeedback && isCorrectChoice && !isCorrect;
          const showAsWrong = showFeedback && isSelectedChoice && !isCorrect;
          
          let borderStyle = 'border-solid';
          if (showAsCorrectDashed) {
            borderStyle = 'border-dashed';
          }
          
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
                    ? showAsCorrectSolid || showAsCorrectDashed
                      ? `bg-gradient-to-br from-white/[0.08] to-white/[0.04] border ${borderStyle}`
                      : showAsWrong
                      ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-solid'
                      : 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-solid border-white/[0.08]'
                    : `bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-solid ${
                      isSelectedChoice ? 'border-white/[0.2]' : 'border-white/[0.08]'
                    } cursor-pointer`
                }`}
                style={
                  showFeedback
                    ? {
                        borderColor: showAsCorrectSolid || showAsCorrectDashed
                          ? '#009379'
                          : showAsWrong
                          ? '#e74c3c'
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
                onClick={!showFeedback ? () => onChoiceSelect(index) : undefined}
              >
                {/* Hover Glow Effect - nur wenn nicht Feedback Mode */}


                {/* Checkmark for correct answer (feedback mode) */}
                {showFeedback && (showAsCorrectSolid || showAsCorrectDashed) && (
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
                      isSelectedChoice ? 'bg-white/[0.15] border-white/[0.4]' : 'bg-white/[0.03] border-white/[0.15]'
                    }`}
                    animate={isSelectedChoice ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.25 }}
                  >
                    {isSelectedChoice && (
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
                {showFeedback && !showAsCorrectSolid && !showAsCorrectDashed && !showAsWrong && (
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