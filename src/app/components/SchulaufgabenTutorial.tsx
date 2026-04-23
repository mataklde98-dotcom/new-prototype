// ===== SCHULAUFGABEN TUTORIAL =====
// Multi-step onboarding tutorial for the SchulaufgabenScreen.
// Shown on first visit, explains how to correctly upload school assignments.
// Uses ReactDOM.createPortal, motion animations, Poppins font, Premium SaaS style.

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, BookOpen, Calendar, ImageIcon,
  AlertTriangle, Sparkles, ChevronRight, Brain,
  CheckCircle, Info,
} from 'lucide-react';
import CloseButton from './CloseButton';

interface SchulaufgabenTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'schulaufgabenTutorialCompleted';

export function shouldShowSchulaufgabenTutorial(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== 'true';
}

export default function SchulaufgabenTutorial({ isOpen, onClose }: SchulaufgabenTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsTransitioning(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
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
      localStorage.setItem(STORAGE_KEY, 'true');
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

  // ===== FEATURE CARD HELPER =====
  const FeatureCard = ({ icon, color, title, desc }: { icon: React.ReactNode; color: string; title: string; desc: string }) => (
    <div className="flex items-start gap-3 p-3.5 rounded-xl border" style={{ background: `${color}08`, borderColor: `${color}18` }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white mb-0.5">{title}</p>
        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/45 leading-relaxed">{desc}</p>
      </div>
    </div>
  );

  // ===== STEP DOT HELPER =====
  const StepDot = ({ number, label, color, active }: { number: string; label: string; color: string; active?: boolean }) => (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: active ? `${color}20` : 'rgba(255,255,255,0.05)',
          border: `1.5px solid ${active ? `${color}50` : 'rgba(255,255,255,0.1)'}`,
        }}
      >
        <span className="font-['Poppins:Bold',sans-serif] text-[12px]" style={{ color: active ? color : 'rgba(255,255,255,0.35)' }}>
          {number}
        </span>
      </div>
      <p className="font-['Poppins:Medium',sans-serif] text-[13px]" style={{ color: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)' }}>
        {label}
      </p>
    </div>
  );

  const tutorialSteps = [
    // STEP 0: Willkommen
    {
      title: 'Schulaufgaben hochladen',
      subtitle: 'So nutzt du diese Funktion richtig',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Hier kannst du deine <span className="font-['Poppins:SemiBold',sans-serif] text-white">Schulaufgaben</span> als Fotos hochladen, damit die KI weiß, was du aktuell in der Schule behandelst.
          </p>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#A855F7]/[0.06] border border-[#A855F7]/[0.12]">
            <Brain className="w-4 h-4 text-[#A855F7] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              Daraus kann die KI einen <span className="text-white/70">Lernpfad</span> für dich ableiten, weil sie den aktuellen Schulstoff mit deinem Lernprofil abgleichen kann.
            </p>
          </div>
        </div>
      ),
    },

    // STEP 1: Fach auswählen
    {
      title: 'Richtiges Fach auswählen',
      subtitle: 'Damit die KI korrekt zuordnen kann',
      content: (
        <div className="space-y-3.5">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Wähle <span className="font-['Poppins:SemiBold',sans-serif] text-white">immer das korrekte Fach</span> aus, zu dem die Schulaufgabe gehört. Die KI ordnet die Inhalte diesem Fach zu.
          </p>

          {/* Mini Preview: Subject Selection */}
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-4 space-y-2">
            <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/50 mb-2 uppercase tracking-wide">Fach</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Mathematik', selected: true },
                { name: 'Deutsch', selected: false },
                { name: 'Englisch', selected: false },
                { name: 'Biologie', selected: false },
                { name: 'Physik', selected: false },
              ].map(s => (
                <div
                  key={s.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: s.selected ? 'rgba(0,184,148,0.12)' : 'rgba(255,255,255,0.05)',
                    border: s.selected ? '1px solid rgba(0,184,148,0.35)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span
                    className="font-['Poppins:Medium',sans-serif] text-[12px]"
                    style={{ color: s.selected ? '#00B894' : 'rgba(255,255,255,0.5)' }}
                  >
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FF4444]/[0.06] border border-[#FF4444]/[0.12]">
            <AlertTriangle className="w-4 h-4 text-[#FF4444] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              <span className="text-[#FF4444]/80">Wichtig:</span> Ein falsches Fach führt dazu, dass die KI die Inhalte dem falschen Fach zuordnet, das verfälscht deine Analyse.
            </p>
          </div>
        </div>
      ),
    },

    // STEP 2: Datum korrekt wählen
    {
      title: 'Korrektes Datum wählen',
      subtitle: 'Von welchem Datum ist die Schulaufgabe?',
      content: (
        <div className="space-y-3.5">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Stelle das Datum ein, an dem die Schulaufgabe <span className="font-['Poppins:SemiBold',sans-serif] text-white">tatsächlich geschrieben wurde,</span> nicht das Upload-Datum.
          </p>

          <FeatureCard
            icon={<Brain className="w-4.5 h-4.5 text-[#FFB800]" />}
            color="#FFB800"
            title="Warum ist das Datum so wichtig?"
            desc="Die KI nutzt das Datum, um zu berechnen, wann du welche Themen in der Schule behandelt hast. So kann sie deinen Lernstand zeitlich einordnen und bessere Prognosen erstellen."
          />

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FF4444]/[0.06] border border-[#FF4444]/[0.12]">
            <AlertTriangle className="w-4 h-4 text-[#FF4444] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              <span className="text-[#FF4444]/80">Falsches Datum = falsche Analyse.</span> Die KI kann sonst nicht nachvollziehen, was du wann in der Schule durchgenommen hast.
            </p>
          </div>
        </div>
      ),
    },

    // STEP 3: Mehrere Bilder hochladen
    {
      title: 'Fotos hochladen',
      subtitle: 'Mehrere Seiten auf einmal',
      content: (
        <div className="space-y-3.5">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FF4444]/[0.06] border border-[#FF4444]/[0.12]">
            <AlertTriangle className="w-4 h-4 text-[#FF4444] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              <span className="text-[#FF4444]/80">Ganz wichtig:</span> Es ist möglich, mehrere Bilder gleichzeitig hochzuladen. Bitte achte jedoch darauf, dass alle hochgeladenen Bilder <span className="text-white/70">zum selben Datum</span> gehören.
            </p>
          </div>

          {/* Mini Preview: Multi Image Upload */}
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/50 uppercase tracking-wide">Upload</p>
              <div className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#00D4AA]" />
                <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#00D4AA]">3 Bilder</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['Seite 1', 'Seite 2', 'Seite 3'].map((label, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-xl flex flex-col items-center justify-center gap-1.5"
                  style={{
                    background: 'rgba(0,212,170,0.06)',
                    border: '1px solid rgba(0,212,170,0.15)',
                  }}
                >
                  <ImageIcon className="w-5 h-5 text-[#00D4AA]/60" />
                  <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/40">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] border border-dashed border-white/[0.1]">
              <Upload className="w-4 h-4 text-white/30" />
              <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/40">Weitere Bilder hinzufügen</span>
            </div>
          </div>
        </div>
      ),
    },

    // STEP 4: Los geht's
    {
      title: 'Bereit zum Hochladen!',
      subtitle: 'Denk an Fach & Datum',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Kurz zusammengefasst, so machst du alles richtig:
          </p>

          <div className="space-y-2">
            {[
              { text: 'Korrektes Fach auswählen', color: '#4A9EFF' },
              { text: 'Datum der Schulaufgabe einstellen (nicht Upload-Datum)', color: '#FFB800' },
              { text: 'Mehrere Bilder nur bei gleichem Datum', color: '#FF4444' },
              { text: 'Die KI erkennt die behandelten Schulthemen und verbindet sie mit deinem Lernprofil', color: '#A855F7' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: item.color }} />
                </div>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/75">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#00B894]/[0.06] border border-[#00B894]/[0.12]">
            <Sparkles className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              Je mehr Schulaufgaben du korrekt hochlädst, desto besser versteht die KI deinen Wissensstand und kann dir <span className="text-white/70">gezielt beim Lernen helfen</span>.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = tutorialSteps[currentStep];

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
                  >
                    {currentStepData.content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 pt-4 border-t border-white/[0.08] flex-shrink-0">
                {/* Skip tutorial — only before the last step */}
                {currentStep < tutorialSteps.length - 1 && (
                  <button
                    onClick={handleClose}
                    className="mx-auto mb-3 block font-['Poppins:Medium',sans-serif] text-[12px] text-white/35 active:text-white/65 transition-colors"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    Überspringen
                  </button>
                )}
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