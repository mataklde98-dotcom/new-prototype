import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import FlashcardItem from '@/app/components/FlashcardItem';
import Checkbox from '@/app/components/Checkbox';
import CloseButton from '@/app/components/CloseButton';

interface FlashcardTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FlashcardTutorial({ isOpen, onClose }: FlashcardTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Check if user has completed tutorial at least once
  const hasCompletedOnce = localStorage.getItem('hasCompletedFlashcardTutorialOnce') === 'true';

  // Reset step to 0 when tutorial opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setDontShowAgain(false);
      setIsTransitioning(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('flashcardTutorialCompleted', 'true');
    }
    setCurrentStep(0); // Reset für nächstes Öffnen
    setDontShowAgain(false);
    onClose();
  };

  const handleNext = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    // Prevent double-clicks während Animation läuft
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Reset transitioning nach Animation
      setTimeout(() => setIsTransitioning(false), 250);
    } else {
      // User hat das Tutorial komplett durchlaufen
      localStorage.setItem('hasCompletedFlashcardTutorialOnce', 'true');
      handleClose();
    }
  };

  const handlePrevious = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    // Prevent double-clicks während Animation läuft
    if (isTransitioning) return;
    
    if (currentStep > 0) {
      setIsTransitioning(true);
      setCurrentStep(currentStep - 1);
      // Reset transitioning nach Animation
      setTimeout(() => setIsTransitioning(false), 250);
    }
  };

  const tutorialSteps = [
    {
      title: 'Willkommen!',
      subtitle: 'Lerne wie das Karteikarten-System funktioniert',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white/80 leading-relaxed">
            Dieses Tutorial zeigt dir, wie das <span className="font-['Poppins:SemiBold',sans-serif] text-white">Karteikarten-System</span> funktioniert.
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white/80 leading-relaxed">
            Du lernst alles über <span className="font-['Poppins:SemiBold',sans-serif] text-[#00b894]">Fortschritt</span>, <span className="font-['Poppins:SemiBold',sans-serif] text-[#fdcb6e]">Filter</span> und den <span className="font-['Poppins:SemiBold',sans-serif] text-white">Lernmodus</span>.
          </p>
          
          {hasCompletedOnce && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 mt-2">
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/60 leading-relaxed">
                ❗ Um dieses Tutorial nicht erneut anzuzeigen, klicke am Ende auf die Checkbox <span className="font-['Poppins:Medium',sans-serif] text-white/70">"Tutorial nicht mehr anzeigen"</span>.
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Einzelne Karteikarten',
      subtitle: 'Die Farbe der Nummer zeigt den Fortschritt',
      content: (
        <div className="space-y-5">
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white/80 leading-relaxed">
            Jede Karteikarte hat einen <span className="font-['Poppins:SemiBold',sans-serif] text-white">Score</span> von 0% bis 100%. Die <span className="font-['Poppins:SemiBold',sans-serif] text-white">Farbe der Nummer</span> zeigt dir sofort, wie gut du die Karte bereits kannst:
          </p>
          
          <div className="space-y-3">
            {/* Lernphase - GRAU */}
            <div className="flex items-center gap-4">
              <div className="relative w-[32px] h-[32px] rounded-[8px] bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white">1</p>
              </div>
              <div className="flex-1">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white/90">Grau = Lernphase</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/50">0% - 69%</p>
              </div>
            </div>
            
            {/* Fast gemeistert - GELB */}
            <div className="flex items-center gap-4">
              <div className="relative w-[32px] h-[32px] rounded-[8px] bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white">2</p>
              </div>
              <div className="flex-1">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white/90">Gelb = Fast gemeistert</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/50">70% - 99%</p>
              </div>
            </div>
            
            {/* Gemeistert - GRÜN mit Glow */}
            <div className="flex items-center gap-4">
              <div className="relative w-[32px] h-[32px] rounded-[8px] bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white drop-shadow-[0_0_6px_rgba(34,197,94,0.4)]">3</p>
              </div>
              <div className="flex-1">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white/90">Grün = Gemeistert</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/50">100%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/[0.05] border border-white/[0.12] rounded-xl p-3.5 mt-4">
            <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 leading-relaxed">
              💡 So siehst du auf einen Blick, welche Karten du noch üben musst und welche du schon gemeistert hast!
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Lernmodus',
      subtitle: 'Karten durch Wischen beantworten',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white/80 leading-relaxed">
            Im <span className="font-['Poppins:SemiBold',sans-serif] text-white">Lernmodus</span> beantwortest du die Karten durch <span className="font-['Poppins:SemiBold',sans-serif] text-white">Wischen</span>.
          </p>
          
          <div className="space-y-2">
            {/* Swipe Links = Richtig */}
            <div className="bg-[#00b894]/10 border border-[#00b894]/30 rounded-xl p-3 flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#00b894]/20 flex items-center justify-center flex-shrink-0">
                <svg className="size-5" fill="none" viewBox="0 0 20 20">
                  <path d="M4 10L16 10" stroke="#00b894" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 4L4 10L10 16" stroke="#00b894" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#00b894]">← Nach links wischen</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/60">Richtig beantwortet</p>
              </div>
            </div>
            
            {/* Swipe Oben = Mittelmäßig */}
            <div className="bg-[#fdcb6e]/10 border border-[#fdcb6e]/30 rounded-xl p-3 flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#fdcb6e]/20 flex items-center justify-center flex-shrink-0">
                <svg className="size-5" fill="none" viewBox="0 0 20 20">
                  <path d="M10 16L10 4" stroke="#fdcb6e" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4 10L10 4L16 10" stroke="#fdcb6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#fdcb6e]">↑ Nach oben wischen</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/60">Mittelmäßig</p>
              </div>
            </div>
            
            {/* Swipe Rechts = Falsch */}
            <div className="bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-xl p-3 flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#e74c3c]/20 flex items-center justify-center flex-shrink-0">
                <svg className="size-5" fill="none" viewBox="0 0 20 20">
                  <path d="M16 10L4 10" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 4L16 10L10 16" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-[#e74c3c]">→ Nach rechts wischen</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/60">Falsch beantwortet</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    {
      title: 'Score-System',
      subtitle: 'Wie sich dein Score verändert',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white/80 leading-relaxed">
            Bei <span className="font-['Poppins:SemiBold',sans-serif] text-white">jeder Beantwortung</span> ändert sich der Score um folgende <span className="font-['Poppins:SemiBold',sans-serif] text-white">Prozentwerte</span>:
          </p>
          
          <div className="space-y-3">
            {/* Richtig = +40% oder +20% */}
            <div className="bg-[#00b894]/10 border border-[#00b894]/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-8 rounded-full bg-[#00b894]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="size-4" fill="none" viewBox="0 0 16 12">
                    <path d="M2 6L6 10L14 2" stroke="#00b894" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#00b894]">Richtig beantwortet</p>
              </div>
              <div className="ml-11 space-y-1">
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80">
                  • Unter 70%: <span className="text-[#00b894] font-['Poppins:SemiBold',sans-serif]">+40%</span>
                </p>
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80">
                  • Ab 70%: <span className="text-[#00b894] font-['Poppins:SemiBold',sans-serif]">+20%</span>
                </p>
              </div>
            </div>
            
            {/* Mittelmäßig = 0% */}
            <div className="bg-[#fdcb6e]/10 border border-[#fdcb6e]/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-full bg-[#fdcb6e]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="size-4" fill="none" viewBox="0 0 16 4">
                    <path d="M2 2L14 2" stroke="#fdcb6e" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#fdcb6e]">Mittelmäßig</p>
              </div>
              <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/80 ml-11">
                Score <span className="text-white/60">bleibt gleich (±0%)</span>
              </p>
            </div>
            
            {/* Falsch = -15% oder -25% */}
            <div className="bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-8 rounded-full bg-[#e74c3c]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="size-4" fill="none" viewBox="0 0 12 12">
                    <path d="M2 2L10 10M10 2L2 10" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#e74c3c]">Falsch beantwortet</p>
              </div>
              <div className="ml-11 space-y-1">
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80">
                  • Unter 70%: <span className="text-[#e74c3c] font-['Poppins:SemiBold',sans-serif]">-15%</span>
                </p>
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80">
                  • Ab 70%: <span className="text-[#e74c3c] font-['Poppins:SemiBold',sans-serif]">-25%</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/[0.05] border border-white/[0.12] rounded-xl p-3.5 mt-4">
            <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 leading-relaxed">
              💡 Der Score kann nie unter 0% fallen und ist bei 100% gedeckelt!
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Gesamtfortschritt',
      subtitle: 'Der Durchschnitt aller Karten',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white/80 leading-relaxed">
            Der <span className="font-['Poppins:SemiBold',sans-serif] text-white">Gesamtfortschritt</span> zeigt den durchschnittlichen Score <span className="font-['Poppins:SemiBold',sans-serif] text-white">aller Karten</span> im Set.
          </p>

          {/* Echtes Karteikarten-Set Element - Nicht anklickbar */}
          <div className="w-full pointer-events-none">
            <FlashcardItem 
              title="Mathematik - Ableitungen"
              subject="Mathematik"
              cardCount={24}
              progress={65}
              createdDate="2026-02-04"
            />
          </div>
          
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/70 leading-relaxed">
            Den Fortschrittsbalken findest du <span className="font-['Poppins:SemiBold',sans-serif] text-white">am Karteikarten-Set</span> selbst.
          </p>
        </div>
      )
    },
    {
      title: 'Fortschritt & Meisterung',
      subtitle: 'So erreichst du 100%',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white/80 leading-relaxed">
            Der <span className="font-['Poppins:SemiBold',sans-serif] text-[#00b894]">Status "GEMEISTERT"</span> erscheint nur bei Karten mit <span className="font-['Poppins:SemiBold',sans-serif] text-white">100%</span>.
          </p>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-yellow-500">1</p>
              </div>
              <div className="flex-1">
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/70">
                  Karte A: 85% (Fast gemeistert)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-yellow-500">2</p>
              </div>
              <div className="flex-1">
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/70">
                  Karte B: 92% (Fast gemeistert)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-[#00b894]/20 flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#00b894]">3</p>
              </div>
              <div className="flex-1">
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/70">
                  Karte C: 100% (Gemeistert) ✨
                </p>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-3 mt-3">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                Durchschnitt: (85 + 92 + 100) / 3 = 92%
              </p>
            </div>
          </div>
          
          <div className="bg-[#00b894]/10 border border-[#00b894]/30 rounded-xl p-3">
            <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-[#00b894]">
              💡 Beantworte alle Karten so lange richtig, bis sie 100% erreichen - dann ist das Set perfekt gemeistert!
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Filter & Fokus',
      subtitle: 'Gezielt bestimmte Karten üben',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white/80 leading-relaxed">
            Mit dem <span className="font-['Poppins:SemiBold',sans-serif] text-white">Filter</span> kannst du gezielt bestimmte Karten anzeigen.
          </p>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            {/* Filter Checkboxen Demo - Lernphase ist GRAU */}
            <div className="flex items-center gap-3">
              <div className="size-5 rounded border-2 border-white/40 bg-white/40 flex items-center justify-center">
                <svg className="size-3" fill="none" viewBox="0 0 10 8">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/80">Lernphase</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="size-5 rounded border-2 border-white/20" />
              <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/40">Fast gemeistert</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="size-5 rounded border-2 border-white/20" />
              <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/40">Gemeistert</p>
            </div>
          </div>
          
          <div className="bg-[#fdcb6e]/10 border border-[#fdcb6e]/30 rounded-xl p-3">
            <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-[#fdcb6e]">
              💡 Der Filter wirkt sich auch auf den Lernmodus aus!
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Lernmodus & Filter',
      subtitle: 'Filter beeinflussen den Lernmodus',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white/80 leading-relaxed">
            Wenn du einen <span className="font-['Poppins:SemiBold',sans-serif] text-white">Filter</span> aktiv hast und den <span className="font-['Poppins:SemiBold',sans-serif] text-white">Lernmodus</span> startest, werden <span className="font-['Poppins:SemiBold',sans-serif] text-white">nur diese Karten abgefragt</span>.
          </p>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/80 mb-3">Beispiel:</p>
            <div className="space-y-2 text-[13px]">
              <p className="font-['Poppins:Regular',sans-serif] text-white/60">
                ✓ Filter: Nur "Lernphase" (7 Karten)
              </p>
              <p className="font-['Poppins:Regular',sans-serif] text-white/60">
                → Lernmodus: Nur diese 7 Karten
              </p>
              <p className="font-['Poppins:Regular',sans-serif] text-white/60">
                → Counter zeigt: "1 / 7"
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Bereit zum Lernen!',
      subtitle: 'Du kennst jetzt alle Funktionen',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white/80 leading-relaxed">
            Jetzt kennst du alle wichtigen Funktionen:
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-[#00b894]/20 flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#00b894]">✓</p>
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/80">
                Gesamtfortschritt & einzelne Scores
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-[#00b894]/20 flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#00b894]">✓</p>
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/80">
                Filter für gezieltes Üben
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-[#00b894]/20 flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#00b894]">✓</p>
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/80">
                Lernmodus mit Swipe-Gesten
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="size-6 rounded-full bg-[#00b894]/20 flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#00b894]">✓</p>
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/80">
                Filter + Lernmodus kombinieren
              </p>
            </div>
          </div>
          
          {/* Checkbox direkt im Content */}
          <div 
            className="flex items-center gap-3 mt-6 cursor-pointer select-none"
            onClick={() => setDontShowAgain(!dontShowAgain)}
          >
            <Checkbox checked={dontShowAgain} />
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/70">
              Tutorial nicht mehr anzeigen
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = tutorialSteps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[9998]"
            onClick={hasCompletedOnce ? handleClose : undefined}
          />

          {/* Tutorial Modal */}
          <div 
            className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
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
              className="bg-gradient-to-br from-[#1e1e1e] to-[#0a0a0a] border border-white/[0.15] rounded-[24px] w-full max-w-[520px] overflow-hidden flex flex-col h-[90vh] max-h-[700px] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 pb-4 border-b border-white/[0.08] h-[120px] flex flex-col justify-center">
                {/* Close Button - Nur sichtbar wenn Tutorial bereits einmal durchlaufen */}
                {hasCompletedOnce && (
                  <CloseButton
                    onClick={handleClose}
                    className="absolute top-6 right-6"
                  />
                )}
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
                    hasCompletedOnce ? (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isTransitioning) {
                            setIsTransitioning(true);
                            setCurrentStep(index);
                            setTimeout(() => setIsTransitioning(false), 250);
                          }
                        }}
                        disabled={isTransitioning}
                        className={`h-[8px] rounded-full transition-all ${
                          index === currentStep
                            ? 'w-[32px] bg-[#00b894]'
                            : 'w-[8px] bg-white/[0.2] cursor-pointer'
                        }`}
                        style={{
                          WebkitTapHighlightColor: 'transparent',
                          touchAction: 'manipulation',
                          pointerEvents: isTransitioning ? 'none' : 'auto'
                        }}
                      />
                    ) : (
                      <div
                        key={index}
                        className={`h-[8px] rounded-full transition-all ${
                          index === currentStep
                            ? 'w-[32px] bg-[#00b894]'
                            : 'w-[8px] bg-white/[0.2]'
                        }`}
                      />
                    )
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
                      pointerEvents: currentStep === 0 || isTransitioning ? 'none' : 'auto'
                    }}
                  >
                    {/* Background */}
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
                    className={`group relative flex-1 flex items-center justify-center gap-2 h-[48px] rounded-[12px] border border-[#00b894]/30 transition-all overflow-hidden ${
                      isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'
                    }`}
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      pointerEvents: isTransitioning ? 'none' : 'auto'
                    }}
                  >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00b894]/20 to-[#009379]/20" />
                    

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
    </AnimatePresence>
  );
}