import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '@/app/components/Button';
import CloseButton from '@/app/components/CloseButton';

type FlashcardTutorialModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function FlashcardTutorialModal({ isOpen, onClose }: FlashcardTutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when step changes
  useEffect(() => {
    if (contentRef.current) {
      // Immediate scroll reset before animation
      contentRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  const tutorialSteps = [
    // STEP 0: Willkommen
    {
      title: 'Willkommen zum Tutorial',
      subtitle: 'Lerne wie die Karteikarten-Generierung funktioniert',
      content: (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#009379] to-[#00705C] flex items-center justify-center mb-6">
            <svg className="w-[60px] h-[60px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-[#b3b3b3] text-center leading-relaxed px-4">
            In den nächsten Schritten erklären wir dir, wie du deine Karteikarten optimal generieren lässt und warum wir auf gezielte Lerneinheiten setzen.
          </p>
        </div>
      )
    },
    // STEP 1: Ein Unterthema pro Set (KRITISCHE REGEL!)
    {
      title: 'Ein Unterthema pro Set',
      subtitle: 'Für besseren Überblick und gezieltes Lernen',
      content: (
        <div className="flex flex-col py-4">
          {/* Main explanation */}
          <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.12] rounded-[12px] p-5 mb-5">
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#e3e3e3] text-center leading-relaxed">
              Pro Karteikarten-Set kannst du nur <span className="font-['Poppins:SemiBold',sans-serif] text-[#009379]">ein Unterthema</span> auswählen.
            </p>
          </div>

          {/* Visual example */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Allowed */}
            <div className="bg-gradient-to-br from-[#009379]/10 to-[#009379]/5 border-2 border-[#009379] rounded-[12px] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-[24px] h-[24px] rounded-full bg-[#009379] flex items-center justify-center flex-shrink-0">
                  <svg className="w-[14px] h-[14px]" fill="white" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-['Poppins:Bold',sans-serif] text-[13px] text-[#009379]">
                  Möglich
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="bg-[#009379]/20 rounded-[6px] px-2 py-1.5">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white">Unterthema: Gleichungen</p>
                </div>
                <div className="pl-2">
                  <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#b3b3b3]">→ 20 Karteikarten</p>
                </div>
              </div>
            </div>

            {/* Not allowed */}
            <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-2 border-[#e74c3c]/50 rounded-[12px] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-[24px] h-[24px] rounded-full bg-[#e74c3c] flex items-center justify-center flex-shrink-0">
                  <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="font-['Poppins:Bold',sans-serif] text-[13px] text-[#e74c3c]">
                  Nicht möglich
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="bg-[#e74c3c]/20 rounded-[6px] px-2 py-1.5">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white line-through">Gleichungen</p>
                </div>
                <div className="bg-[#e74c3c]/20 rounded-[6px] px-2 py-1.5">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white line-through">Funktionen</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reasons */}
          <div className="space-y-3 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#009379] flex items-center justify-center flex-shrink-0">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white mb-1">
                  Klarer Überblick
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] leading-relaxed">
                  Du kannst deine Karteikarten-Sets später sortiert nach Unterthemen einsehen. Gemischte Unterthemen würden keinen klaren Überblick bieten.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#009379] flex items-center justify-center flex-shrink-0">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white mb-1">
                  Gezielte KI-Generierung
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] leading-relaxed">
                  Die KI generiert basierend auf einem Unterthema gezielt passende Fragen. Das sorgt für hochwertige und thematisch konsistente Karteikarten.
                </p>
              </div>
            </div>
          </div>

          {/* Tip for multiple subtopics */}
          <div className="bg-[#1a3a35] border border-[#009379]/30 rounded-[10px] p-4">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#009379] text-center mb-2">
              💡 Für mehrere Unterthemen:
            </p>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3] text-center leading-relaxed">
              Erstelle mehrere separate Karteikarten-Sets. So behältst du den Überblick und kannst gezielt einzelne Unterthemen wiederholen.
            </p>
          </div>
        </div>
      )
    },
    // STEP 2: Anzahl der Karteikarten
    {
      title: 'Anzahl der Karteikarten',
      subtitle: 'Du bestimmst den Umfang',
      content: (
        <div className="flex flex-col py-4">
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] rounded-[12px] p-5 mb-5">
            <div className="flex items-center gap-4">
              <div className="w-[50px] h-[50px] rounded-full bg-[#009379] flex items-center justify-center flex-shrink-0">
                <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white mb-1">
                  Flexibel anpassbar
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#979797]">
                  Von 5 bis 50 Karteikarten pro Set
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 px-2 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-[8px] h-[8px] rounded-full bg-[#009379] mt-2 flex-shrink-0" />
              <div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white mb-1">
                  Kurze Sessions (5-15 Karten)
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] leading-relaxed">
                  Perfekt für schnelle Wiederholungen zwischendurch oder erste Einführungen in ein Thema
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-[8px] h-[8px] rounded-full bg-[#009379] mt-2 flex-shrink-0" />
              <div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white mb-1">
                  Intensive Sessions (20-50 Karten)
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] leading-relaxed">
                  Ideal für tiefgreifendes Lernen und umfassende Vorbereitung auf Prüfungen
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a3a35] border border-[#009379]/30 rounded-[10px] p-4">
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] text-center">
              💡 Je mehr Karteikarten, desto umfassender wird das Unterthema abgedeckt.
            </p>
          </div>
        </div>
      )
    },
    // STEP 3: Karteikarten-Typen
    {
      title: 'Verschiedene Karteikarten-Typen',
      subtitle: 'Abwechslungsreiches Lernen',
      content: (
        <div className="flex flex-col py-4">
          {/* Type 1: Frage → Antwort */}
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] rounded-[12px] p-4 mb-3">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#009379] flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">1</p>
              </div>
              <div>
                <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white mb-1">
                  Klassische Karteikarte
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3]">
                  Frage auf der Vorderseite, Antwort auf der Rückseite
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] rounded-[8px] p-4 border border-[#484848]">
              <div className="mb-3">
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#979797] mb-2">Vorderseite:</p>
                <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white">
                  Was ist die Quadratwurzel von 16?
                </p>
              </div>
              <div className="border-t border-[#484848] pt-3">
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#979797] mb-2">Rückseite:</p>
                <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#009379]">
                  4
                </p>
              </div>
            </div>
          </div>

          {/* Type 2: Multiple Choice */}
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] rounded-[12px] p-4 mb-3">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#ff9500] flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">2</p>
              </div>
              <div>
                <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white mb-1">
                  Multiple Choice
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3]">
                  Frage mit Auswahlmöglichkeiten
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] rounded-[8px] p-3 border border-[#484848]">
              <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white mb-3">
                Welche Zahl ist eine Primzahl?
              </p>
              <div className="space-y-2">
                <div className="bg-[#0a0a0a] rounded-[6px] px-3 py-2 border border-[#484848]">
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white">A) 4</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-[6px] px-3 py-2 border border-[#484848]">
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white">B) 6</p>
                </div>
                <div className="bg-[#009379]/20 rounded-[6px] px-3 py-2 border border-[#009379]">
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#009379]">C) 7 ✓</p>
                </div>
              </div>
            </div>
          </div>

          {/* Type 3: Lückentext */}
          <div className="bg-[#0a0a0a] rounded-[12px] p-4 mb-4 border border-white/[0.08]">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#0066cc] flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">3</p>
              </div>
              <div>
                <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white mb-1">
                  Lückentext
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3]">
                  Fülle die fehlenden Wörter ein
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] rounded-[8px] p-3 border border-[#484848]">
              <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white leading-relaxed">
                Der Satz des Pythagoras lautet: a² + b² = <span className="text-[#009379] font-['Poppins:SemiBold',sans-serif]">____</span>
              </p>
            </div>
          </div>

          {/* Bottom tip */}
          <div className="bg-[#1a3a35] border border-[#009379]/30 rounded-[10px] p-3">
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3] text-center leading-relaxed">
              💡 Die KI wählt automatisch den passenden Karteikarten-Typ für jede Frage!
            </p>
          </div>
        </div>
      )
    },
    // STEP 4: Los geht's!
    {
      title: 'Bereit zum Lernen?',
      subtitle: 'Erstelle jetzt dein erstes Karteikarten-Set',
      content: (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#009379] to-[#00705C] flex items-center justify-center mb-6">
            <svg className="w-[60px] h-[60px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white text-center mb-3">
            Alles klar!
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-[#b3b3b3] text-center leading-relaxed px-4 mb-6">
            Du bist jetzt bereit, deine ersten Karteikarten zu generieren. Wähle ein Unterthema, stelle die Anzahl ein und lass die KI für dich arbeiten!
          </p>
          <div className="bg-[#1a3a35] border border-[#009379]/30 rounded-[10px] p-4 w-full">
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] text-center leading-relaxed">
              Tipp: Erstelle regelmäßig neue Sets zu verschiedenen Unterthemen, um dein Wissen zu vertiefen!
            </p>
          </div>
        </div>
      )
    }
  ];

  const totalSteps = tutorialSteps.length;
  const currentStepData = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={handleClose}
          style={{
            padding: '1rem',
            paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))',
            paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-[#141414] border border-white/[0.12] rounded-[24px] w-full max-w-[520px] overflow-hidden flex flex-col h-[90vh] max-h-[700px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-white/[0.08] h-[120px] flex flex-col justify-center">
              <CloseButton
                onClick={handleClose}
                position="absolute top-6 right-6"
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
            <div className="px-6 flex-1 overflow-y-auto" ref={contentRef}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStepData.content}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer with Navigation */}
            <div className="p-6 pt-4 border-t border-white/[0.08] flex-shrink-0">
              {/* Skip tutorial — only before the last step */}
              {currentStep < totalSteps - 1 && (
                <button
                  onClick={onClose}
                  className="mx-auto mb-3 block font-['Poppins:Medium',sans-serif] text-[12px] text-white/35 hover:text-white/60 active:text-white/65 transition-colors"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  Überspringen
                </button>
              )}
              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {tutorialSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-[8px] rounded-full transition-all ${
                      index === currentStep
                        ? 'w-[32px] bg-[#009379]'
                        : 'w-[8px] bg-white/[0.2]'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <Button
                  fullWidth={false}
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="px-6"
                >
                  <ChevronLeft className="w-[18px] h-[18px] text-white" />
                  Zurück
                </Button>

                <Button
                  onClick={currentStep === totalSteps - 1 ? handleClose : handleNext}
                  className="flex-1"
                >
                  {currentStep === totalSteps - 1 ? 'Verstanden!' : 'Weiter'}
                  {currentStep !== totalSteps - 1 && (
                    <ChevronRight className="w-[18px] h-[18px] text-white" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}