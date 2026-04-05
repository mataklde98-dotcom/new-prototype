// ===== KLASSENARBEITEN TUTORIAL =====
// First-time tutorial overlay for the Klassenarbeiten screen.
// Explains: KI-Analyse, Lernprofil-Integration, Nachhilfe-Einsicht.
// Uses localStorage to track "seen" state. Rendered via ReactDOM.createPortal.

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  Brain,
  BarChart3,
  Upload,
  Users,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Eye,
} from 'lucide-react';
import Button from './Button';
import CloseButton from './CloseButton';

const STORAGE_KEY = 'klassenarbeiten_tutorial_seen';

interface KlassenarbeitenTutorialProps {
  onComplete: () => void;
}

// ===== STEP DATA =====
const steps = [
  {
    icon: Upload,
    iconBg: 'rgba(0,184,148,0.12)',
    iconColor: '#00B894',
    title: 'Willkommen bei Klassenarbeiten',
    description:
      'Lade deine geschriebenen Klassenarbeiten hoch und lass die KI sie automatisch analysieren. So wird dein Lernprofil immer genauer und dein Lernerlebnis immer besser.',
  },
  {
    icon: Brain,
    iconBg: 'rgba(139,92,246,0.12)',
    iconColor: '#8B5CF6',
    title: 'KI-Analyse',
    description:
      'Die KI analysiert jede hochgeladene Klassenarbeit auf Note, Stärken und Schwächen. Diese Erkenntnisse werden automatisch in dein Lernprofil aufgenommen, damit die KI dich besser versteht.',
  },
  {
    icon: TrendingUp,
    iconBg: 'rgba(59,130,246,0.12)',
    iconColor: '#3B82F6',
    title: 'Präziseres Lernerlebnis',
    description:
      'Je mehr Klassenarbeiten du hochlädst, desto besser kennt die KI deinen Wissensstand. Übungen, Karteikarten und Prüfungssimulationen passen sich automatisch an deine Stärken und Schwächen an.',
  },
  {
    icon: Users,
    iconBg: 'rgba(245,158,66,0.12)',
    iconColor: '#F59E42',
    title: 'Einsicht für Nachhilfelehrer',
    description:
      'Wenn du die Nachhilfe aktivierst, haben deine Nachhilfelehrer Einsicht auf deine hochgeladenen Klassenarbeiten, die Notenübersicht und die KI-Analysen deiner Stärken und Schwächen. So können sie gezielt mit dir an deinen Schwächen arbeiten.',
  },
];

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

export default function KlassenarbeitenTutorial({ onComplete }: KlassenarbeitenTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleComplete = useCallback(() => {
    setIsExiting(true);
    markKlassenarbeitenTutorialSeen();
    setTimeout(() => onComplete(), 280);
  }, [onComplete]);

  const handleSkipClose = useCallback(() => {
    markKlassenarbeitenTutorialSeen();
    setIsExiting(true);
    setTimeout(() => onComplete(), 280);
  }, [onComplete]);

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const step = steps[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === steps.length - 1;

  const overlay = (
    <div
      className="fixed inset-0 flex items-center justify-center p-5"
      style={{
        zIndex: 999999,
        background: isVisible && !isExiting ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0)',
        backdropFilter: isVisible && !isExiting ? 'blur(12px)' : 'blur(0px)',
        WebkitBackdropFilter: isVisible && !isExiting ? 'blur(12px)' : 'blur(0px)',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease',
      }}
    >
      <div
        className="w-full max-w-[380px] rounded-3xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.10)',
          opacity: isVisible && !isExiting ? 1 : 0,
          transform: isVisible && !isExiting ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {/* Content */}
        <div className="px-7 pt-8 pb-6">
          {/* Close button */}
          <CloseButton
            onClick={handleSkipClose}
            className="absolute top-4 right-4 z-10"
          />

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((_, i) => (
              <div
                key={i}
                className="h-[3px] rounded-full flex-1 transition-all duration-300"
                style={{
                  background:
                    i < currentStep
                      ? '#00B894'
                      : i === currentStep
                      ? 'rgba(0,184,148,0.6)'
                      : 'rgba(255,255,255,0.08)',
                }}
              />
            ))}
          </div>

          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: step.iconBg,
              border: `1px solid ${step.iconColor}25`,
            }}
          >
            <StepIcon className="w-8 h-8" style={{ color: step.iconColor }} />
          </div>

          {/* Text */}
          <div className="text-center mb-8">
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-white mb-3 tracking-[-0.3px]">
              {step.title}
            </h2>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/50 leading-[1.7]">
              {step.description}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={goNext}>
              {isLastStep ? 'Verstanden' : 'Weiter'}
              {!isLastStep && <ChevronRight className="w-4 h-4 text-white/60" />}
            </Button>

            <div className="flex items-center justify-between px-1">
              {currentStep > 0 ? (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1 py-2 transition-colors"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <ChevronLeft className="w-4 h-4 text-white/30" />
                  <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/30">
                    Zurück
                  </span>
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? ReactDOM.createPortal(overlay, document.body)
    : null;
}