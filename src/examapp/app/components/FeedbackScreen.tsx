import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CloseButton from '@/app/components/CloseButton';
import Button from '@/app/components/Button';

type FeedbackScreenProps = {
  onSubmit: (difficulty: number, comment?: string) => void;
  onSkip: () => void;
};

export default function FeedbackScreen({ onSubmit, onSkip }: FeedbackScreenProps) {
  const [sliderValue, setSliderValue] = useState(50); // 0 = too easy, 50 = okay, 100 = too difficult
  const [comment, setComment] = useState('');
  const autoSkipTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-skip after 30 seconds
  useEffect(() => {
    autoSkipTimerRef.current = setTimeout(() => {
      console.log('⏱️ Auto-skip: 30 seconds passed');
      onSkip();
    }, 30000);

    return () => {
      if (autoSkipTimerRef.current) {
        clearTimeout(autoSkipTimerRef.current);
      }
    };
  }, [onSkip]);

  const handleSubmit = () => {
    if (autoSkipTimerRef.current) {
      clearTimeout(autoSkipTimerRef.current);
    }
    onSubmit(sliderValue, comment);
  };

  const handleSkip = () => {
    if (autoSkipTimerRef.current) {
      clearTimeout(autoSkipTimerRef.current);
    }
    onSkip();
  };

  const getDifficultyLabel = (value: number): string => {
    if (value < 33) return 'zu einfach';
    if (value > 67) return 'zu schwierig';
    return 'okay';
  };

  const getDifficultyColor = (value: number): string => {
    if (value < 33) return '#009379';
    if (value > 67) return '#ff4757';
    return '#009379';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#0a0a0a] overflow-hidden relative size-full flex flex-col"
    >
      {/* Header */}
      <div className="px-6 py-3 flex-shrink-0 pt-safe lg:mt-[20px] mt-3">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] lg:text-[15px] text-white mb-1">
              Feedback
            </p>
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[13px] text-[#979797]">
              Dein Feedback ist uns wichtig
            </p>
          </div>
          <CloseButton onClick={handleSkip} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-6">
        {/* Question */}
        <motion.p
          className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Wie fandest du die Prüfung?
        </motion.p>

        {/* Modern Slider */}
        <motion.div
          className="w-full max-w-[313px] mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Slider Track */}
          <div className="relative h-[5px] rounded-full bg-white/[0.08]">
            {/* Filled portion */}
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                width: `${sliderValue}%`,
                backgroundColor: getDifficultyColor(sliderValue),
                boxShadow: `0 0 8px ${getDifficultyColor(sliderValue)}40`,
              }}
            />

            {/* Hidden range input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              style={{ margin: 0 }}
            />

            {/* Visual thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `calc(${sliderValue}% - 10px)`,
              }}
            >
              {/* Glow ring */}
              <div
                className="absolute inset-[-6px] rounded-full"
                style={{ backgroundColor: `${getDifficultyColor(sliderValue)}15` }}
              />
              {/* Thumb circle */}
              <div
                className="relative size-[20px] rounded-full border-[2.5px] border-[#0a0a0a]"
                style={{
                  backgroundColor: getDifficultyColor(sliderValue),
                  boxShadow: `0 0 10px ${getDifficultyColor(sliderValue)}50`,
                }}
              />
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-3.5 px-0.5">
            <p className={`font-['Poppins:Medium',sans-serif] text-[10px] ${sliderValue < 33 ? 'text-white/50' : 'text-white/25'}`}>
              zu einfach
            </p>
            <p className={`font-['Poppins:Medium',sans-serif] text-[10px] ${sliderValue >= 33 && sliderValue <= 67 ? 'text-white/50' : 'text-white/25'}`}>
              okay
            </p>
            <p className={`font-['Poppins:Medium',sans-serif] text-[10px] ${sliderValue > 67 ? 'text-white/50' : 'text-white/25'}`}>
              zu schwierig
            </p>
          </div>

          {/* Current selection badge */}
          <div className="flex justify-center mt-5">
            <motion.div
              key={getDifficultyLabel(sliderValue)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="px-4 py-1.5 rounded-full border"
              style={{
                backgroundColor: `${getDifficultyColor(sliderValue)}10`,
                borderColor: `${getDifficultyColor(sliderValue)}25`,
              }}
            >
              <p
                className="font-['Poppins:Medium',sans-serif] text-[13px]"
                style={{ color: getDifficultyColor(sliderValue) }}
              >
                {getDifficultyLabel(sliderValue)}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Done Button */}
        <motion.div
          className="w-full max-w-[313px] mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button onClick={handleSubmit}>
            Fertig
          </Button>
        </motion.div>

        {/* Skip link */}
        <motion.button
          onClick={handleSkip}
          className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/30 mt-5 transition-colors cursor-pointer hover:text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          Überspringen
        </motion.button>
      </div>
    </motion.div>
  );
}