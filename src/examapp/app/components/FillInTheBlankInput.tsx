import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import svgPaths from '../../imports/svg-urzdbglsr2';

interface FillInTheBlankInputProps {
  textAnswer: string;
  onTextAnswerChange: (answer: string) => void;
  showFeedback: boolean;
  correctAnswer: string | number;
  isCorrect: boolean;
  isRevisit: boolean;
  isInitialLoad: boolean;
  showCorrectAnswer?: boolean; // Optional: Show correct answer below input
}

export default function FillInTheBlankInput({
  textAnswer,
  onTextAnswerChange,
  showFeedback,
  correctAnswer,
  isCorrect,
  isRevisit,
  isInitialLoad,
  showCorrectAnswer = true
}: FillInTheBlankInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to end when feedback appears by setting cursor position
  useEffect(() => {
    if (showFeedback && inputRef.current) {
      // Focus and set cursor to end
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
      
      // Blur after scroll completes
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }, 50);
    }
  }, [showFeedback]);

  return (
    <motion.div
      className="relative"
      initial={isInitialLoad ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={isInitialLoad ? {} : { duration: 0.3, delay: 0.2 }}
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={textAnswer}
          onChange={(e) => onTextAnswerChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Deine Antwort..."
          disabled={showFeedback}
          className={`w-full h-[58px] rounded-2xl px-5 ${showFeedback ? 'pr-[60px]' : ''} font-['Poppins:Regular',sans-serif] text-[16px] text-white placeholder-[#666666] transition-all duration-300 outline-none ${
            showFeedback
              ? isCorrect
                ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-[#009379]'
                : 'bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-[#e74c3c]'
              : isFocused
              ? 'bg-gradient-to-br from-white/[0.06] to-white/[0.03] border border-white/[0.3]'
              : 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08]'
          }`}
          style={{
            WebkitTapHighlightColor: 'transparent'
          }}
        />
        
        {/* Feedback Icon - Same as Multiple Choice */}
        {showFeedback && (
          <motion.div
            className="absolute right-4 top-1/2 -translate-y-1/2 size-[23px] flex items-center justify-center"
            initial={{ scale: 0, rotate: isCorrect ? -90 : 90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
          >
            {isCorrect ? (
              <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
                <path d={svgPaths.pac8f470} fill="#009379" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 2L16 16" stroke="#e74c3c" strokeLinecap="round" strokeWidth="2.5" />
                <path d="M16 2L2 16" stroke="#e74c3c" strokeLinecap="round" strokeWidth="2.5" />
              </svg>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Show correct answer if wrong or skipped */}
      {showFeedback && !isCorrect && showCorrectAnswer && correctAnswer && (
        <motion.div
          className="mt-4 relative overflow-hidden rounded-2xl"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Glass background */}
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] rounded-2xl p-4">
            {/* Header with icon */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[18px] h-[18px] rounded-full bg-[#009379]/15 flex items-center justify-center flex-shrink-0">
                <svg width="10" height="8" viewBox="0 0 21 15" fill="none">
                  <path d={svgPaths.pac8f470} fill="#009379" />
                </svg>
              </div>
              <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#009379]/80 uppercase tracking-[0.5px]">
                Richtige Antwort
              </p>
            </div>
            
            {/* Answer text */}
            <p className="font-['Poppins:Medium',sans-serif] text-white/90 text-[15px] leading-[22px]">
              {correctAnswer}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}