// ===== LERNANALYSE TUTORIAL =====
// Multi-step onboarding tutorial for the ProfileAnalyticsScreen (Lernanalyse).
// Shown on first visit, explains all 4 tabs and key features.
// Uses ReactDOM.createPortal, motion animations, Poppins font, Premium SaaS style.

import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers, BarChart3, Brain, Activity,
  AlertTriangle, TrendingUp, BookOpen, Target,
  Sparkles, ClipboardCheck, ChevronRight, Award, Flame, ChevronDown,
} from 'lucide-react';
import CloseButton from './CloseButton';

interface LernanalyseTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'lernanalyseTutorialCompleted';

export function shouldShowLernanalyseTutorial(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== 'true';
}

export default function LernanalyseTutorial({ isOpen, onClose }: LernanalyseTutorialProps) {
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

  // ===== TAB PILL HELPER =====
  const TabPill = ({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) => (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{
        background: active ? 'rgba(0,184,148,0.12)' : 'rgba(255,255,255,0.05)',
        border: active ? '1px solid rgba(0,184,148,0.3)' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <span style={{ color: active ? '#00B894' : 'rgba(255,255,255,0.4)' }}>{icon}</span>
      <span
        className="font-['Poppins:Medium',sans-serif] text-[11px]"
        style={{ color: active ? '#00B894' : 'rgba(255,255,255,0.5)' }}
      >
        {label}
      </span>
    </div>
  );

  const tutorialSteps = [
    // STEP 0: Willkommen
    {
      title: 'Deine Lernanalyse',
      subtitle: 'KI-gestützte Einblicke in deinen Lernfortschritt',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Die <span className="font-['Poppins:SemiBold',sans-serif] text-white">Lernanalyse</span> gibt dir einen vollständigen Überblick über deinen aktuellen Wissensstand und zeigt dir, wo du stehst und wo du noch hinmusst.
          </p>

          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-4">
            <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/50 mb-3 uppercase tracking-wide">4 Bereiche</p>
            <div className="flex flex-wrap gap-2">
              <TabPill icon={<Layers className="w-3.5 h-3.5" />} label="Übersicht" active />
              <TabPill icon={<BarChart3 className="w-3.5 h-3.5" />} label="Lernfortschritt" />
              <TabPill icon={<Brain className="w-3.5 h-3.5" />} label="KI-Prognose" />
              <TabPill icon={<Activity className="w-3.5 h-3.5" />} label="Leistung" />
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#00B894]/[0.06] border border-[#00B894]/[0.12]">
            <Sparkles className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              Alle Analysen basieren auf deinen Aktivitäten in <span className="text-white/70">Karteikarten</span>, <span className="text-white/70">Prüfungssimulationen</span>, dem <span className="text-white/70">Lernassistenten</span> und der <span className="text-white/70">KI-Auswertung hochgeladener Klassenarbeiten</span>.
            </p>
          </div>
        </div>
      ),
    },

    // STEP 1: Übersicht
    {
      title: 'Übersicht',
      subtitle: 'Schneller Blick auf deinen Lernstand',
      content: (
        <div className="space-y-3.5">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Der erste Tab gibt dir einen schnellen Überblick über deinen gesamten Lernstand.
          </p>

          <FeatureCard
            icon={<TrendingUp className="w-4.5 h-4.5 text-[#00D4AA]" />}
            color="#00D4AA"
            title="Wissensstand"
            desc="Aktueller Wissensstand mit Trend-Anzeige und Anzahl kritischer Schwächen auf einen Blick."
          />
          <FeatureCard
            icon={<AlertTriangle className="w-4.5 h-4.5 text-[#FF4444]" />}
            color="#FF4444"
            title="Top Schwächen"
            desc="Themen, bei denen du noch Nachholbedarf hast. Direkt dort kannst du Karteikarten erstellen oder eine Prüfungssimulation starten."
          />
          <FeatureCard
            icon={<Award className="w-4.5 h-4.5 text-[#00D4AA]" />}
            color="#00D4AA"
            title="Stärken"
            desc="Deine besten Themen auf einen Blick, so weißt du, was du schon draufhast."
          />
        </div>
      ),
    },

    // STEP 2: Lernfortschritt
    {
      title: 'Lernfortschritt',
      subtitle: 'Fächerübersicht mit Lücken & Themen',
      content: (
        <div className="space-y-3.5">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Im Tab <span className="font-['Poppins:SemiBold',sans-serif] text-white">Lernfortschritt</span> siehst du für jedes Fach den detaillierten Stand.
          </p>

          {/* Mini-Preview: Fach-Accordion wie es aussieht */}
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-4 space-y-3">
            {/* Fach Header Preview */}
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Mathematik</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 font-['Poppins:Medium',sans-serif] text-[10px] text-[#FFB800]">Aufmerksamkeit</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">Fortschritt 68%</span>
                  <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">•</span>
                  <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">Abdeckung 72%</span>
                </div>
              </div>
              {/* Mini Score Ring */}
              <div className="relative w-[38px] h-[38px] flex-shrink-0">
                <svg viewBox="0 0 38 38" className="w-full h-full -rotate-90">
                  <circle cx="19" cy="19" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <circle cx="19" cy="19" r="15" fill="none" stroke="#FFB800" strokeWidth="3" strokeDasharray={`${68 / 100 * 94.25} 94.25`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-['Poppins:SemiBold',sans-serif] text-[11px] text-white">68</span>
              </div>
              <ChevronDown className="w-4 h-4 text-white/30 rotate-180 flex-shrink-0" />
            </div>

            {/* Lücken */}
            <div className="border-t border-white/[0.05] pt-3">
              <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#FFB800]/70 mb-1.5 uppercase tracking-wide">Lücken</p>
              <div className="flex flex-wrap gap-1.5">
                {['Quadratische Fkt.', 'Stochastik', 'Trigonometrie'].map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-[#FFB800]/10 text-[#FFB800] font-['Poppins:Medium',sans-serif] text-[11px] border border-[#FFB800]/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Nächste relevante Themen */}
            <div>
              <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/30 mb-1.5 uppercase tracking-wide">Nächste relevante Themen</p>
              <div className="flex flex-wrap gap-1.5">
                {['Integralrechnung', 'Vektoren', 'Matrizenrechnung'].map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-white/50 font-['Poppins:Medium',sans-serif] text-[11px] border border-white/[0.06]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#4A9EFF]/[0.06] border border-[#4A9EFF]/[0.12]">
            <Target className="w-4 h-4 text-[#4A9EFF] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              Jedes Fach ist aufklappbar, mit <span className="text-white/70">Lücken</span>, <span className="text-white/70">nächsten relevanten Themen</span> und einem <span className="text-white/70">Üben-Button</span> pro Thema.
            </p>
          </div>
        </div>
      ),
    },

    // STEP 3: KI-Prognose
    {
      title: 'KI-Prognose',
      subtitle: 'Vorhersagen & zukünftige Risiken',
      content: (
        <div className="space-y-3.5">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Die <span className="font-['Poppins:SemiBold',sans-serif] text-white">KI-Prognose</span> analysiert deine Lernmuster und sagt dir, wo du jetzt handeln solltest.
          </p>

          <FeatureCard
            icon={<Brain className="w-4.5 h-4.5 text-[#A855F7]" />}
            color="#A855F7"
            title="KI-Analyse"
            desc="Dein aktueller Trend, dringende Handlungen und eine Übersicht über Schwächen, Stärken und Risiken."
          />
          <FeatureCard
            icon={<AlertTriangle className="w-4.5 h-4.5 text-[#FF4444]" />}
            color="#FF4444"
            title="Kritische Schwächen"
            desc="Themen mit den niedrigsten Scores, mit direkter Möglichkeit zum Üben."
          />
          <FeatureCard
            icon={<Flame className="w-4.5 h-4.5 text-[#FFB800]" />}
            color="#FFB800"
            title="Zukünftige Risiken"
            desc="Themen, die bald zum Problem werden könnten. Frühzeitig gegensteuern!"
          />

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#A855F7]/[0.06] border border-[#A855F7]/[0.12]">
            <Sparkles className="w-4 h-4 text-[#A855F7] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              Die <span className="text-white/70">Skill-Map</span> zeigt dir, wie stark du in Prüfungssimulationen in jedem Fach abschneidest.
            </p>
          </div>
        </div>
      ),
    },

    // STEP 4: Leistung
    {
      title: 'Leistung',
      subtitle: 'Aktivitäten, Zeiterfassung & Ergebnisse',
      content: (
        <div className="space-y-3.5">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Der Tab <span className="font-['Poppins:SemiBold',sans-serif] text-white">Leistung</span> zeigt deine gesamte Lernaktivität im Überblick.
          </p>

          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-4 space-y-2.5">
            <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/50 mb-1 uppercase tracking-wide">3 Lernaktivitäten</p>

            <div className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(74,158,255,0.06)' }}>
              <Layers className="w-4 h-4 text-[#4A9EFF]" />
              <div className="flex-1">
                <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">Karteikarten Lernsimulator</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#4A9EFF]" />
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(255,140,0,0.06)' }}>
              <ClipboardCheck className="w-4 h-4 text-[#FF8C00]" />
              <div className="flex-1">
                <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">Prüfungssimulation</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#FF8C00]" />
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(0,212,170,0.06)' }}>
              <Sparkles className="w-4 h-4 text-[#00D4AA]" />
              <div className="flex-1">
                <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">Lernassistent</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#00D4AA]" />
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FF8C00]/[0.06] border border-[#FF8C00]/[0.12]">
            <Activity className="w-4 h-4 text-[#FF8C00] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              Zusätzlich siehst du eine <span className="text-white/70">Wochenübersicht</span> deiner Lernzeit und eine <span className="text-white/70">detaillierte Aktivitäts-Historie</span>.
            </p>
          </div>
        </div>
      ),
    },

    // STEP 5: Los geht's
    {
      title: 'Bereit für den Überblick!',
      subtitle: 'Du kennst jetzt alle Funktionen',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Jetzt kennst du den vollen Funktionsumfang deiner Lernanalyse:
          </p>

          <div className="space-y-2">
            {[
              'Übersicht mit Stärken & Schwächen',
              'Schwächen gezielt üben mit Karteikarten & Prüfungssimulationen',
              'Lernfortschritt mit Fächerübersicht, deiner Lücken, zukünftig relevante Themen & Üben-Button',
              'KI-Prognose zukünftiger Risikothemen, bevor sie zum Problem werden',
              'Die Skill-Map zeigt, wie gut du in Prüfungssimulationen in jedem Fach abschneidest',
              'Leistungsanalyse mit Lernzeit & Aktivitätsfeed',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-6 rounded-full bg-[#00B894]/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#00B894]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/75">{text}</p>
              </div>
            ))}
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
              className="bg-gradient-to-br from-[#1e1e1e] to-[#0a0a0a] border border-white/[0.15] rounded-[24px] w-full max-w-[520px] overflow-hidden flex flex-col h-[90vh] max-h-[700px] pointer-events-auto"
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
                      {currentStep === tutorialSteps.length - 1 ? 'Los geht\'s!' : 'Weiter'}
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