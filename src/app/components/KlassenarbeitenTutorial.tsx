// ===== KLASSENARBEITEN TUTORIAL =====
// First-time tutorial overlay for the Klassenarbeiten screen.
// Matches the platform-wide tutorial chrome (SchulaufgabenTutorial / TodoTutorial /
// LernanalyseTutorial): header + scrollable content + footer with progress dots.
// Content (4 Steps) unchanged.

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Upload,
  Users,
  TrendingUp,
} from 'lucide-react';
import CloseButton from './CloseButton';

const STORAGE_KEY = 'klassenarbeiten_tutorial_seen';

interface KlassenarbeitenTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export function hasSeenKlassenarbeitenTutorial(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markKlassenarbeitenTutorialSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {}
}

// ===== STEP DATA — Content unchanged from prior version =====
const tutorialSteps = [
  {
    icon: Upload,
    iconBg: 'rgba(0,184,148,0.12)',
    iconColor: '#00B894',
    title: 'Willkommen bei Klassenarbeiten',
    subtitle: 'So nutzt du die Klassenarbeiten-Funktion',
    description:
      'Lade deine geschriebenen Klassenarbeiten hoch und lass die KI sie automatisch analysieren. So wird dein Lernprofil immer genauer und dein Lernerlebnis immer besser.',
  },
  {
    icon: Brain,
    iconBg: 'rgba(139,92,246,0.12)',
    iconColor: '#8B5CF6',
    title: 'KI-Analyse',
    subtitle: 'Was mit deinen Uploads passiert',
    description:
      'Die KI analysiert jede hochgeladene Klassenarbeit auf Note, Stärken und Schwächen. Diese Erkenntnisse werden automatisch in dein Lernprofil aufgenommen, damit die KI dich besser versteht.',
  },
  {
    icon: TrendingUp,
    iconBg: 'rgba(59,130,246,0.12)',
    iconColor: '#3B82F6',
    title: 'Präziseres Lernerlebnis',
    subtitle: 'Je mehr, desto genauer',
    description:
      'Je mehr Klassenarbeiten du hochlädst, desto besser kennt die KI deinen Wissensstand. Übungen, Karteikarten und Prüfungssimulationen passen sich automatisch an deine Stärken und Schwächen an.',
  },
  {
    icon: Users,
    iconBg: 'rgba(245,158,66,0.12)',
    iconColor: '#F59E42',
    title: 'Einsicht für Nachhilfelehrer',
    subtitle: 'Gezielt an deinen Schwächen arbeiten',
    description:
      'Wenn du die Nachhilfe aktivierst, haben deine Nachhilfelehrer Einsicht auf deine hochgeladenen Klassenarbeiten, die Notenübersicht und die KI-Analysen deiner Stärken und Schwächen. So können sie gezielt mit dir an deinen Schwächen arbeiten.',
  },
];

export default function KlassenarbeitenTutorial({ isOpen, onClose }: KlassenarbeitenTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsTransitioning(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    markKlassenarbeitenTutorialSeen();
    setCurrentStep(0);
    onClose();
  };

  const handleNext = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimeout(() => setIsTransitioning(false), 250);
    } else {
      handleClose();
    }
  };

  const handlePrevious = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (isTransitioning) return;
    if (currentStep > 0) {
      setIsTransitioning(true);
      setCurrentStep(currentStep - 1);
      setTimeout(() => setIsTransitioning(false), 250);
    }
  };

  const currentStepData = tutorialSteps[currentStep];
  const StepIcon = currentStepData.icon;

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[9998]"
            onClick={handleClose}
          />

          {/* Tutorial Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
            style={{
              padding: '1rem',
              paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))',
              paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-[#1e1e1e] to-[#0a0a0a] border border-white/[0.15] rounded-[24px] w-full max-w-[520px] overflow-hidden flex flex-col h-[90vh] max-h-[680px] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 pb-4 border-b border-white/[0.08] h-[120px] flex flex-col justify-center">
                <CloseButton
                  onClick={handleClose}
                  className="absolute top-6 right-6"
                />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="pr-12"
                  >
                    {/* Step badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px]"
                        style={{
                          color: '#00B894',
                          background: 'rgba(0,184,148,0.12)',
                          border: '1px solid rgba(0,184,148,0.25)',
                        }}
                      >
                        {currentStep + 1} / {tutorialSteps.length}
                      </span>
                    </div>
                    <h2 className="font-['Poppins:Bold',sans-serif] text-[20px] text-white mb-1 leading-tight">
                      {currentStepData.title}
                    </h2>
                    <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#979797] leading-snug">
                      {currentStepData.subtitle}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Content */}
              <div className="px-6 py-6 flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Icon */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                      style={{
                        background: currentStepData.iconBg,
                        border: `1px solid ${currentStepData.iconColor}25`,
                      }}
                    >
                      <StepIcon className="w-8 h-8" style={{ color: currentStepData.iconColor }} />
                    </div>

                    {/* Description */}
                    <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed text-center">
                      {currentStepData.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 pt-4 border-t border-white/[0.08] flex-shrink-0">
                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-[8px] rounded-full transition-all ${
                        index === currentStep
                          ? 'w-[32px] bg-[#00B894]'
                          : 'w-[8px] bg-white/[0.2]'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handlePrevious}
                    onTouchEnd={handlePrevious}
                    disabled={currentStep === 0 || isTransitioning}
                    className={`group relative flex items-center justify-center gap-2 h-[48px] rounded-[12px] border border-white/[0.1] px-6 transition-all overflow-hidden ${
                      currentStep === 0 || isTransitioning
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer active:scale-95'
                    }`}
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      pointerEvents: currentStep === 0 || isTransitioning ? 'none' : 'auto',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-white/[0.02]" />
                    <svg className="relative z-10 w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <p className="relative z-10 font-['Poppins:Medium',sans-serif] text-[15px] text-white">
                      Zurück
                    </p>
                  </button>

                  <button
                    onClick={handleNext}
                    onTouchEnd={handleNext}
                    disabled={isTransitioning}
                    className={`group relative flex-1 flex items-center justify-center gap-2 h-[48px] rounded-[12px] border border-[#00B894]/30 transition-all overflow-hidden ${
                      isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'
                    }`}
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      pointerEvents: isTransitioning ? 'none' : 'auto',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00B894]/20 to-[#009379]/20" />
                    <p className="relative z-10 font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">
                      {currentStep === tutorialSteps.length - 1 ? 'Verstanden!' : 'Weiter'}
                    </p>
                    <svg className="relative z-10 w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
