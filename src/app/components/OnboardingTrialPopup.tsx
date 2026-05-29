// ===== ONBOARDING TRIAL POPUP (Multi-Step) =====
// Premium modal shown on first login after registration.
// Step 1: Hero statement — user MUST read it, only "Weiter" available.
// Step 2: Features — AI capabilities overview.
// Step 3: AI-Enhanced Tutoring — tutoring concept.
// Step 4: Trial info, referral bonus, CTA.
// Rendered via ReactDOM.createPortal at z-9999.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  Brain,
  Target,
  Upload,
  Layers,
  FileCheck,
  TrendingUp,
  Gift,
  ChevronRight,
  ChevronLeft,
  X,
  Zap,
  ArrowRight,
  Users,
  BarChart3,
  Crosshair,
  Copy,
  Check,
  ClipboardList,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import SoStudyLogo from './SoStudyLogo';

interface OnboardingTrialPopupProps {
  onStartTrial: () => void;
  onDismiss: () => void;
}

// ===== FEATURE CARD DATA =====
const features = [
  {
    icon: Brain,
    title: 'Schwächen erkennen',
    desc: 'Die KI analysiert, wie du Aufgaben löst und erkennt Wissenslücken automatisch.',
  },
  {
    icon: Target,
    title: 'Gezielte Übungen',
    desc: 'Aufgaben werden individuell auf deine erkannten Wissenslücken zugeschnitten, nicht zufällig.',
  },
  {
    icon: Upload,
    title: 'Klassenarbeiten hochladen',
    desc: 'Lade Klassenarbeiten hoch, die KI analysiert deine Note, erkennt deine Stärken und Schwächen und integriert diese Erkenntnisse in dein Lernprofil.',
  },
  {
    icon: ClipboardList,
    title: 'Schulaufgaben hochladen',
    desc: 'Lade Schulaufgaben hoch, damit die KI versteht, welche Themen du gerade in der Schule lernst',
  },
  {
    icon: Layers,
    title: 'Karteikarten entlang deines Lernpfads',
    desc: 'Generiere Karteikarten entlang Fach → Kategorie → Thema → Unterthema, zusätzlich gezielt zu deinen erkannten Schwächen und zukünftig relevanten Themen.',
  },
  {
    icon: FileCheck,
    title: 'Prüfungssimulation',
    desc: 'Realistische Prüfungssimulationen, die sich an dein Niveau und Wissensstand anpassen.',
  },
  {
    icon: TrendingUp,
    title: 'Fortschritt verfolgen',
    desc: 'Sieh genau, wie sich dein Wissensstand über die Zeit verbessert.',
  },
  {
    icon: Sparkles,
    title: 'Persönlicher Lernassistent',
    desc: 'Chatte mit deinem Lernassistenten. Er kennt deinen Wissensstand, deine Stärken, deine Schwächen und dein gesamtes Lernprofil.',
  },
  {
    icon: BookOpen,
    title: 'Dein Wissensstand pro Fach',
    desc: 'Sieh für jedes Fach genau, in welchen Themen du stark bist und wo du noch Schwächen hast.',
  },
];

export default function OnboardingTrialPopup({
  onStartTrial,
  onDismiss,
}: OnboardingTrialPopupProps) {
  const [phase, setPhase] = useState<'entering' | 'visible' | 'exiting'>('entering');
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [stepTransition, setStepTransition] = useState<'idle' | 'out' | 'in'>('idle');
  const [countdown, setCountdown] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Animate in
  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('visible'));
    });
    return () => cancelAnimationFrame(t);
  }, []);

  // Countdown timer for step 1
  useEffect(() => {
    if (step !== 1 || countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, countdown]);

  const handleClose = useCallback(
    (action: 'start' | 'dismiss') => {
      setPhase('exiting');
      setTimeout(() => {
        action === 'start' ? onStartTrial() : onDismiss();
      }, 320);
    },
    [onStartTrial, onDismiss]
  );

  const handleNext = useCallback(() => {
    setStepTransition('out');
    setTimeout(() => {
      setStep((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : prev));
      setStepTransition('in');
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setTimeout(() => setStepTransition('idle'), 350);
    }, 250);
  }, []);

  const handleBack = useCallback(() => {
    setStepTransition('out');
    setTimeout(() => {
      setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : prev));
      setStepTransition('in');
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setTimeout(() => setStepTransition('idle'), 350);
    }, 250);
  }, []);

  const isOpen = phase === 'visible';

  // Step content opacity/transform for transitions
  const stepStyle: React.CSSProperties =
    stepTransition === 'out'
      ? { opacity: 0, transform: 'translateX(-16px)', transition: 'opacity 0.22s ease, transform 0.22s ease' }
      : stepTransition === 'in'
        ? { opacity: 0, transform: 'translateX(16px)', transition: 'none' }
        : { opacity: 1, transform: 'translateX(0)', transition: 'opacity 0.3s ease, transform 0.3s ease' };

  // Force reflow for 'in' animation
  useEffect(() => {
    if (stepTransition === 'in') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setStepTransition('idle'));
      });
    }
  }, [stepTransition]);

  const content = (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center"
      style={{
        zIndex: 9999,
        background: isOpen ? 'rgba(0,0,0,0.78)' : 'rgba(0,0,0,0)',
        transition: 'background 0.38s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
      onClick={(e) => {
        // Backdrop click disabled — user must complete the onboarding flow
      }}
    >
      {/* Modal container */}
      <div
        ref={scrollRef}
        className="relative w-full sm:max-w-[440px] max-h-[92vh] sm:max-h-[88vh] overflow-y-auto sm:rounded-2xl rounded-t-2xl"
        style={{
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.06)',
          borderBottom: 'none',
          opacity: isOpen ? 1 : 0,
          transform: isOpen
            ? 'translateY(0) scale(1)'
            : phase === 'entering'
              ? 'translateY(40px) scale(0.97)'
              : 'translateY(20px) scale(0.98)',
          transition:
            'opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1), transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.12) transparent',
        }}
      >
        {/* ─── Top ambient glow ─── */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[200px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center top, rgba(0,184,148,0.10) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* ─── Pill drag indicator (mobile) ─── */}
        {/* Removed for clean onboarding design */}

        {/* ─── Close button — only on step 2+ ─── */}
        {step >= 2 && (
          <>
            {/* Back button */}
            <button
              onClick={handleBack}
              className="absolute top-4 left-4 z-20 w-7 h-7 rounded-lg flex items-center justify-center text-white/20 active:text-white/50 active:bg-white/[0.06] transition-colors"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <ChevronLeft className="w-[16px] h-[16px]" />
            </button>
          </>
        )}

        {/* ─── Content ─── */}
        <div className="relative z-[1] px-6 sm:px-7 pt-6 sm:pt-8 pb-6" style={stepStyle}>
          {step === 1 ? (
            /* ═══════════ STEP 1: Hero Statement ═══════════ */
            <>
              {/* Logo */}
              <div className="flex justify-center mb-5">
                <SoStudyLogo className="h-8" />
              </div>

              {/* Headline */}
              <h2
                className="text-center font-['Poppins:SemiBold',sans-serif] text-white tracking-tight whitespace-nowrap mb-5"
                style={{ fontSize: '19px', lineHeight: '1.25' }}
              >
                Die Zukunft des Lernens beginnt{' '}
                <span style={{ color: '#00B894' }}>jetzt.</span>
              </h2>

              {/* ─── HERO STATEMENT CARD ─── */}
              <div
                className="relative mx-auto rounded-xl px-5 py-5 mb-6"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(0,184,148,0.07) 0%, rgba(0,184,148,0.02) 100%)',
                  border: '1px solid rgba(0,184,148,0.14)',
                }}
              >
                {/* Subtle inner glow */}
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 30% 0%, rgba(0,184,148,0.06) 0%, transparent 60%)',
                  }}
                />
                <p
                  className="relative text-center font-['Poppins:Medium',sans-serif] leading-relaxed"
                  style={{ fontSize: '14px', color: '#00B894' }}
                >
                  Die KI von SoStudy lernt, wie du denkst. Sie kennt deinen Wissensstand besser als du selbst.
                  Und sie funktioniert für jeden Schüler anders.
                </p>
                <p
                  className="relative text-center font-['Poppins:Regular',sans-serif] mt-4 leading-relaxed"
                  style={{ fontSize: '13px', color: '#00B894' }}
                >
                  Jede gelöste Aufgabe, jeder Fehler, jede Aktivität in der App macht deine KI präziser. Sie baut daraus dein persönliches Lernprofil.
                </p>
                <p
                  className="relative text-center font-['Poppins:Regular',sans-serif] mt-3 leading-relaxed"
                  style={{ fontSize: '13px', color: '#00B894' }}
                >
                  Je mehr du lernst, desto genauer weiß sie,
                  was du als Nächstes verstehen musst.
                </p>
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-1.5 mb-5">
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: '#00B894' }}
                />
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                />
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                />
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                />
              </div>

              {/* Weiter button */}
              <button
                onClick={countdown <= 0 ? handleNext : undefined}
                disabled={countdown > 0}
                className="w-full py-[13px] rounded-xl font-['Poppins:SemiBold',sans-serif] text-white transition-all duration-200 active:scale-[0.98] active:opacity-90 relative overflow-hidden"
                style={{
                  fontSize: '14.5px',
                  background: countdown > 0
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(0,184,148,0.07)',
                  border: countdown > 0 ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,184,148,0.25)',
                  cursor: countdown > 0 ? 'default' : 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
              >
                {/* Progress bar fill */}
                {countdown > 0 && (
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,184,148,0.12), rgba(0,184,148,0.04))',
                      width: `${((10 - countdown) / 10) * 100}%`,
                      transition: 'width 1s linear',
                    }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {countdown > 0 ? (
                    <>
                      <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                        Weiter in {countdown}s
                      </span>
                    </>
                  ) : (
                    <>
                      Weiter
                      <ArrowRight className="w-[15px] h-[15px]" />
                    </>
                  )}
                </span>
              </button>
            </>
          ) : step === 2 ? (
            /* ═══════════ STEP 2: Features ═══════════ */
            <>
              {/* Small headline */}
              <h2
                className="text-center font-['Poppins:SemiBold',sans-serif] text-white tracking-tight mb-1"
                style={{ fontSize: '18px', lineHeight: '1.3' }}
              >
                Was SoStudy für dich tut
              </h2>
              <p
                className="text-center font-['Poppins:Regular',sans-serif] text-white/35 mb-5"
                style={{ fontSize: '12.5px' }}
              >
                Alles, was deine personalisierte KI ab sofort automatisch für dich übernimmt.
              </p>

              {/* ─── Feature highlight grid ─── */}
              <div className="grid grid-cols-1 gap-2 mb-5">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 px-3.5 py-3 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-[30px] h-[30px] rounded-[9px] flex items-center justify-center mt-[1px]"
                        style={{ background: 'rgba(0,184,148,0.08)' }}
                      >
                        <Icon
                          className="w-[15px] h-[15px]"
                          style={{ color: '#00B894' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-['Poppins:Medium',sans-serif] text-white/85 mb-[2px]"
                          style={{ fontSize: '13px' }}
                        >
                          {f.title}
                        </p>
                        <p
                          className="font-['Poppins:Regular',sans-serif] text-white/35 leading-snug"
                          style={{ fontSize: '11.5px' }}
                        >
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-1.5 mb-5">
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                />
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: '#00B894' }}
                />
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                />
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                />
              </div>

              {/* ─── Weiter Button ─── */}
              <button
                onClick={handleNext}
                className="w-full py-[13px] rounded-xl font-['Poppins:SemiBold',sans-serif] text-white cursor-pointer transition-all duration-200 active:scale-[0.98]"
                style={{
                  fontSize: '14.5px',
                  background: 'rgba(0,184,148,0.07)',
                  border: '1px solid rgba(0,184,148,0.25)',
                  WebkitTapHighlightColor: 'transparent',
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Weiter
                  <ArrowRight className="w-[15px] h-[15px]" />
                </span>
              </button>
            </>
          ) : step === 3 ? (
            /* ═══════════ STEP 3: AI-Enhanced Tutoring ═══════════ */
            <>
              {/* Headline */}
              <h2
                className="text-center font-['Poppins:SemiBold',sans-serif] text-white tracking-tight mb-1"
                style={{ fontSize: '18px', lineHeight: '1.3' }}
              >
                Nachhilfe, die{' '}
                <span style={{ color: '#00B894' }}>wirklich</span> versteht.
              </h2>
              <p
                className="text-center font-['Poppins:Regular',sans-serif] text-white/35 mb-5"
                style={{ fontSize: '12.5px' }}
              >
                SoStudy verbindet KI-Lernen mit echten Nachhilfelehrern, für eine völlig neue Art.
              </p>

              {/* ─── Concept explanation card ─── */}
              <div
                className="relative mx-auto rounded-xl px-5 py-5 mb-4"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(0,184,148,0.07) 0%, rgba(0,184,148,0.02) 100%)',
                  border: '1px solid rgba(0,184,148,0.14)',
                }}
              >
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 30% 0%, rgba(0,184,148,0.06) 0%, transparent 60%)',
                  }}
                />
                <p
                  className="relative text-center font-['Poppins:Medium',sans-serif] leading-relaxed"
                  style={{ fontSize: '13px', color: '#00B894' }}
                >
                  Die KI analysiert kontinuierlich dein Lernverhalten und erstellt ein detailliertes Lernprofil mit deinem Wissensstand sowie deinen Stärken und Schwächen in jedem Fach und Thema.
                </p>
                <p
                  className="relative text-center font-['Poppins:Regular',sans-serif] mt-3 leading-relaxed"
                  style={{ fontSize: '12.5px', color: '#00B894' }}
                >
                  Nachhilfelehrer auf SoStudy haben Zugriff auf dieses Profil und sehen sofort, wo du stehst, ohne dass du erst erklären musst, wo du Hilfe brauchst.
                </p>
              </div>

              {/* ─── Benefit cards ─── */}
              <div className="grid grid-cols-1 gap-2 mb-5">
                {[
                  {
                    icon: Users,
                    title: 'Dein Lernprofil für den Nachhilfelehrer',
                    desc: 'Nachhilfelehrer sehen deinen Wissensstand, deine Stärken und Schwächen, direkt in der App.',
                  },
                  {
                    icon: Crosshair,
                    title: 'Fokus auf echte Wissenslücken',
                    desc: 'Die KI zeigt deinen Nachhilfelehrern genau, wo deine Wissenslücken liegen. So können sie direkt an den Themen arbeiten, in denen du wirklich Unterstützung brauchst.',
                  },
                  {
                    icon: BarChart3,
                    title: 'Effektiver durch KI-Insights',
                    desc: 'KI-gestützte Erkenntnisse machen jede Nachhilfestunde präziser für dich, persönlicher und wirkungsvoller.',
                  },
                ].map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 px-3.5 py-3 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <div
                        className="flex-shrink-0 w-[30px] h-[30px] rounded-[9px] flex items-center justify-center mt-[1px]"
                        style={{ background: 'rgba(0,184,148,0.08)' }}
                      >
                        <Icon
                          className="w-[15px] h-[15px]"
                          style={{ color: '#00B894' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-['Poppins:Medium',sans-serif] text-white/85 mb-[2px]"
                          style={{ fontSize: '13px' }}
                        >
                          {f.title}
                        </p>
                        <p
                          className="font-['Poppins:Regular',sans-serif] text-white/35 leading-snug"
                          style={{ fontSize: '11.5px' }}
                        >
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-1.5 mb-5">
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                />
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                />
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: '#00B894' }}
                />
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                />
              </div>

              {/* ─── Weiter Button ─── */}
              <button
                onClick={handleNext}
                className="w-full py-[13px] rounded-xl font-['Poppins:SemiBold',sans-serif] text-white cursor-pointer transition-all duration-200 active:scale-[0.98]"
                style={{
                  fontSize: '14.5px',
                  background: 'rgba(0,184,148,0.07)',
                  border: '1px solid rgba(0,184,148,0.25)',
                  WebkitTapHighlightColor: 'transparent',
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  Weiter
                  <ArrowRight className="w-[15px] h-[15px]" />
                </span>
              </button>
            </>
          ) : (
            /* ═══════════ STEP 4: Trial Info, Referral Bonus, CTA ═══════════ */
            <>
              {/* Headline */}
              <h2
                className="text-center font-['Poppins:SemiBold',sans-serif] text-white tracking-tight mb-1"
                style={{ fontSize: '18px', lineHeight: '1.3' }}
              >
                Starte jetzt{' '}
                <span style={{ color: '#00B894' }}>kostenlos.</span>
              </h2>
              <p
                className="text-center font-['Poppins:Regular',sans-serif] text-white/35 mb-5"
                style={{ fontSize: '12.5px' }}
              >
                Teste alle Features ohne Risiko, ohne Verpflichtung.
              </p>

              {/* ─── Trial info ─── */}
              <div
                className="rounded-xl px-4 py-3.5 mb-3"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <Zap
                    className="w-[14px] h-[14px]"
                    style={{ color: '#00B894' }}
                  />
                  <span
                    className="font-['Poppins:Medium',sans-serif] text-white/65"
                    style={{ fontSize: '12.5px' }}
                  >
                    30 Tage kostenlos
                  </span>
                </div>
                <div className="space-y-1.5 ml-[22px]">
                  {[
                    'Voller Zugang zu allen KI-Funktionen, sofort',
                    'Kein automatisches Abo, du entscheidest danach',
                    'Je mehr du übst, desto besser kennt dich die KI',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span
                        className="mt-[5px] w-[4px] h-[4px] rounded-full flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.15)' }}
                      />
                      <span
                        className="font-['Poppins:Regular',sans-serif] text-white/35 leading-relaxed"
                        style={{ fontSize: '11.5px' }}
                      >
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── Referral bonus ─── */}
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 cursor-pointer active:scale-[0.98] transition-transform"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(0,184,148,0.05), rgba(0,184,148,0.015))',
                  border: '1px solid rgba(0,184,148,0.10)',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onClick={() => {
                  const referralLink = `${window.location.origin}/ref/demo-user-id`;
                  const textArea = document.createElement('textarea');
                  textArea.value = referralLink;
                  textArea.style.position = 'fixed';
                  textArea.style.left = '-9999px';
                  textArea.style.top = '-9999px';
                  textArea.style.opacity = '0';
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();
                  try {
                    document.execCommand('copy');
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2000);
                  } catch {
                    // silent fail
                  }
                  document.body.removeChild(textArea);
                }}
              >
                <div
                  className="flex-shrink-0 w-[34px] h-[34px] rounded-[10px] flex items-center justify-center"
                  style={{ background: 'rgba(0,184,148,0.10)' }}
                >
                  <Gift
                    className="w-[16px] h-[16px]"
                    style={{ color: '#00B894' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-['Poppins:Medium',sans-serif] text-white/75 mb-[1px]"
                    style={{ fontSize: '12.5px' }}
                  >
                    Bis zu 12 Monate gratis
                  </p>
                  <p
                    className="font-['Poppins:Regular',sans-serif] text-white/30 leading-snug"
                    style={{ fontSize: '11px' }}
                  >
                    Teile deinen Einladungslink mit Freunden. Für je 3 Freunde, die beitreten, erhältst du einen weiteren Monat gratis.
                  </p>
                </div>
                <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: linkCopied ? 'rgba(0,184,148,0.15)' : 'transparent' }}
                >
                  {linkCopied ? (
                    <Check className="w-[14px] h-[14px]" style={{ color: '#00B894' }} />
                  ) : (
                    <Copy className="w-[14px] h-[14px] text-white/15" />
                  )}
                </div>
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-1.5 mb-5">
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                />
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                />
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: 'rgba(255,255,255,0.10)' }}
                />
                <div
                  className="w-5 h-[3px] rounded-full"
                  style={{ background: '#00B894' }}
                />
              </div>

              {/* ─── CTA Button (green gradient) ─── */}
              <button
                onClick={() => handleClose('start')}
                className="w-full py-[13px] rounded-xl font-['Poppins:SemiBold',sans-serif] text-white cursor-pointer transition-all duration-200 active:scale-[0.98]"
                style={{
                  fontSize: '14.5px',
                  background: 'rgba(0,184,148,0.07)',
                  border: '1px solid rgba(0,184,148,0.25)',
                  WebkitTapHighlightColor: 'transparent',
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  30 Tage kostenlos starten
                  <ArrowRight className="w-[15px] h-[15px]" />
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}