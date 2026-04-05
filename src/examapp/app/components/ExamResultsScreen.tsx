import { motion } from 'motion/react';
import Section3 from '../../imports/Section3';
import Button from '@/app/components/Button';
import CloseButton from '@/app/components/CloseButton';

type ExamResultsScreenProps = {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers?: number; // Optional: for "See results only at the end" mode
  earnedPoints: number;
  totalPoints: number;
  showReviewButton?: boolean; // Show "Prüfung ansehen" button
  onViewExam: () => void;
  onReviewExam?: () => void; // New: Review all questions
  onClose: () => void;
};

export default function ExamResultsScreen({
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  skippedAnswers = 0,
  earnedPoints,
  totalPoints,
  showReviewButton = false,
  onViewExam,
  onReviewExam,
  onClose
}: ExamResultsScreenProps) {
  // Calculate grade (1-6, German system) based on points
  const percentage = (earnedPoints / totalPoints) * 100;
  
  const getGrade = (percent: number): number => {
    if (percent >= 92) return 1;
    if (percent >= 81) return 2;
    if (percent >= 67) return 3;
    if (percent >= 50) return 4;
    if (percent >= 30) return 5;
    return 6;
  };

  const grade = getGrade(percentage);

  // Calculate percentages for the chart
  const correctPercentage = (correctAnswers / totalQuestions) * 100;
  const incorrectPercentage = (incorrectAnswers / totalQuestions) * 100;
  const skippedPercentage = (skippedAnswers / totalQuestions) * 100;

  return (
    <div
      className="size-full flex flex-col bg-[#0a0a0a]"
    >
      {/* Header with Close Button */}
      <div className="px-6 py-3 flex-shrink-0 pt-safe lg:mt-[20px] mt-3">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="font-['Poppins:SemiBold',sans-serif] text-[16px] lg:text-[15px] text-white mb-1">
              Prüfungssimulation
            </h1>
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[13px] text-[#979797]">
              Ergebnis
            </p>
          </div>
          <CloseButton onClick={onClose} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 flex flex-col items-center lg:justify-center">
        {/* Minion with Grade Badge */}
        <motion.div 
          className="relative mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2
          }}
        >
          <div className="w-[146.48px] h-[174.217px] relative">
            <Section3 />
          </div>
          
          {/* Grade Badge */}
          <motion.div 
            className="absolute -bottom-2 -right-2 bg-white rounded-full size-[68px] flex items-center justify-center border-[2.5px] border-black shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 10,
              delay: 0.5
            }}
          >
            <p className="font-['Poppins:Bold',sans-serif] text-[28px] text-[#0a0a0a] leading-none flex items-center justify-center w-full h-full">
              {grade}
            </p>
          </motion.div>
        </motion.div>

        {/* Description Text */}
        <motion.p 
          className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white text-center mb-5 max-w-[281px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Du kannst jetzt alle Fragen aus deiner abgeschlossenen Prüfung überprüfen
        </motion.p>

        {/* Overview Box */}
        <motion.div 
          className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-[20px] w-full max-w-[329px] p-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
              Übersicht
            </p>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#a1a1a1]">
              {totalQuestions} Fragen
            </p>
          </div>

          {/* Circle Chart and Stats */}
          <div className="flex items-center gap-5">
            {/* Modern Stats Layout - No Donut */}
            <div className="w-full space-y-4">
              {/* Correct answers bar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#009379]">
                    Richtig
                  </p>
                  <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-[#009379]">
                    {correctAnswers} <span className="text-[#5a5a5f] font-['Poppins:Medium',sans-serif]">/ {totalQuestions}</span>
                  </p>
                </div>
                <div className="h-[10px] bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #00d4aa 0%, #009379 100%)'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${correctPercentage}%` }}
                    transition={{ duration: 1.2, delay: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                  />
                </div>
              </motion.div>

              {/* Incorrect answers bar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#ff4757]">
                    Falsch
                  </p>
                  <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-[#ff4757]">
                    {incorrectAnswers} <span className="text-[#5a5a5f] font-['Poppins:Medium',sans-serif]">/ {totalQuestions}</span>
                  </p>
                </div>
                <div className="h-[10px] bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#ff4757] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${incorrectPercentage}%` }}
                    transition={{ duration: 1.0, delay: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                  />
                </div>
              </motion.div>

              {/* Skipped answers bar */}
              {skippedAnswers > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#797979]">
                      Übersprungen
                    </p>
                    <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-[#797979]">
                      {skippedAnswers} <span className="text-[#5a5a5f] font-['Poppins:Medium',sans-serif]">/ {totalQuestions}</span>
                    </p>
                  </div>
                  <div className="h-[10px] bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#797979] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${skippedPercentage}%` }}
                      transition={{ duration: 0.8, delay: 1.0, ease: [0.34, 1.56, 0.64, 1] }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div 
          className="flex gap-3 mt-5 w-full max-w-[300px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button onClick={showReviewButton && onReviewExam ? onReviewExam : onViewExam}>
            Prüfung ansehen
          </Button>
        </motion.div>
      </div>
    </div>
  );
}