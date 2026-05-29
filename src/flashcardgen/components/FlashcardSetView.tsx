import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shuffle, Play, SlidersHorizontal, HelpCircle, X, Sparkles } from 'lucide-react';
import Checkbox from '@/app/components/Checkbox';
import { FlashcardTutorial } from './FlashcardTutorial';
import Button from '@/app/components/Button';
import CloseButton from '@/app/components/CloseButton';

// Get subject color - same as FlashcardItem
function getSubjectColor(subject: string): string {
  const colorMap: Record<string, string> = {
    "Mathematik": "#618cff",
    "Mathe": "#618cff",
    "Deutsch": "#ff6b9d",
    "Englisch": "#4a9eff",
    "Biologie": "#00d084",
    "Geschichte": "#ffa94d",
    "Chemie": "#a78bfa",
    "Französisch": "#3b82f6",
  };
  return colorMap[subject] || "#618cff";
}

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  /** Step-by-step explanation shown in the "Lösung"-Popup (? button in learn mode). */
  explanation?: string;
  confidenceScore?: number; // 0-100%, optional for backwards compatibility
};

type FlashcardSetViewProps = {
  isOpen: boolean;
  onClose: () => void;
  setName: string;
  subtopicName: string;
  subject: string;
  cards: Flashcard[];
  onProgressUpdate?: (progress: number, updatedCards: Flashcard[]) => void; // Callback für Progress + Card Updates
};

export default function FlashcardSetView({
  isOpen,
  onClose,
  setName,
  subtopicName,
  subject,
  cards: initialCards,
  onProgressUpdate
}: FlashcardSetViewProps) {
  const [cards, setCards] = useState<Flashcard[]>(initialCards || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [isShuffling, setIsShuffling] = useState(false);
  
  // Filter State - Checkboxen statt Radio (alle am Anfang an)
  const [filters, setFilters] = useState({
    learningPhase: true,    // 0-69%
    almostMastered: true,   // 70-99%
    mastered: true          // 100%
  });
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const answerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Lernmodus State
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [swipeAxis, setSwipeAxis] = useState<'horizontal' | 'vertical' | null>(null);
  
  // Track welche Karten bereits beantwortet wurden (für Simulator Progress Bar)
  const [answeredCards, setAnsweredCards] = useState<Set<string>>(new Set());
  
  // Eingefrorene Karten für Lernmodus - bleibt konstant während des Lernmodus
  const [learningModeCards, setLearningModeCards] = useState<Flashcard[]>([]);
  
  // Tutorial State
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  
  // "Lösung"-Popup state — opened from the ? button next to "Karte umdrehen".
  // Shows a step-by-step explanation of why the current answer is correct.
  const [showSolution, setShowSolution] = useState(false);
  
  // Confidence Score System - Map von card.id -> score (0-100)
  const [cardScores, setCardScores] = useState<Map<string, number>>(() => {
    // Initialisiere mit existierenden Scores oder 0
    const initialScores = new Map<string, number>();
    initialCards?.forEach(card => {
      initialScores.set(card.id, card.confidenceScore ?? 0);
    });
    return initialScores;
  });

  // Update cards when initialCards changes
  useEffect(() => {
    if (initialCards && initialCards.length > 0) {
      setCards(initialCards);
      // Update Scores auch
      const newScores = new Map<string, number>();
      initialCards.forEach(card => {
        newScores.set(card.id, card.confidenceScore ?? 0);
      });
      setCardScores(newScores);
      
      // 🔥 Notify parent of initial scores (using initialCards directly, not state)
      notifyProgressUpdate(newScores, initialCards);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCards]);
  
  // Check if tutorial should be shown on open
  useEffect(() => {
    if (isOpen) {
      const tutorialCompleted = localStorage.getItem('flashcardTutorialCompleted');
      if (!tutorialCompleted) {
        // Kleine Verzögerung für smoother UX
        setTimeout(() => {
          setIsTutorialOpen(true);
        }, 500);
      }
    }
  }, [isOpen]);

  // 🔥 Helper function to notify parent of progress updates
  // Called manually after score changes instead of useEffect to prevent infinite loops
  const notifyProgressUpdate = (updatedScores: Map<string, number>, currentCards: Flashcard[]) => {
    if (currentCards.length > 0 && onProgressUpdate) {
      const totalScore = Array.from(updatedScores.values()).reduce((sum, score) => sum + score, 0);
      const averageScore = totalScore / currentCards.length;
      
      const updatedCards = currentCards.map(card => ({
        ...card,
        confidenceScore: updatedScores.get(card.id) ?? 0
      }));
      
      onProgressUpdate(Math.round(averageScore), updatedCards);
    }
  };

  // Toggle card flip
  const handleCardFlip = (cardId: string) => {
    setFlippedCards(prev => {
      // Wenn die Karte bereits offen ist, schließe sie
      if (prev.has(cardId)) {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      } 
      // Sonst: Schließe alle anderen und öffne nur diese Karte
      else {
        const newSet = new Set<string>();
        newSet.add(cardId);
        
        // Auto-scroll: Sobald Antwort eingeblendet wird, stelle sicher dass sie komplett sichtbar ist
        setTimeout(() => {
          const cardElement = cardRefs.current[cardId];
          if (cardElement) {
            cardElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            });
          }
        }, 400);
        
        return newSet;
      }
    });
  };

  // Shuffle cards with animation
  const handleShuffle = () => {
    setIsShuffling(true);
    // Reset all flipped cards
    setFlippedCards(new Set());
    
    // Wait for animation, then shuffle and show cards again
    setTimeout(() => {
      // WICHTIG: Karten mit aktuellen Scores kombinieren VOR dem Shufflen!
      const cardsWithCurrentScores = cards.map(card => ({
        ...card,
        confidenceScore: cardScores.get(card.id) ?? 0
      }));
      
      const shuffled = [...cardsWithCurrentScores];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setCards(shuffled);
      setIsShuffling(false);
    }, 1200);
  };

  // Filter cards based on search AND confidence score
  const filteredCards = cards.filter(card => {
    // Search filter
    const matchesSearch = card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Confidence filter - Checkbox style
    const score = cardScores.get(card.id) ?? 0;
    
    // Normale Filter
    const isLearningPhase = score < 70;      // 0-69%
    const isAlmostMastered = score >= 70 && score < 100;  // 70-99%
    const isMastered = score === 100;        // 100%
    
    // Zeige Karte wenn entsprechende Checkbox an ist
    if (isLearningPhase && filters.learningPhase) return true;
    if (isAlmostMastered && filters.almostMastered) return true;
    if (isMastered && filters.mastered) return true;
    
    return false;
  });

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };
  
  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isFilterDropdownOpen]);
  
  // Lernmodus Functions
  const startLearningMode = () => {
    // Friere aktuelle filteredCards ein - diese Liste bleibt während des Lernmodus konstant!
    setLearningModeCards([...filteredCards]);
    setIsLearningMode(true);
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
    setAnsweredCards(new Set()); // Reset bei jedem Start
  };
  
  const exitLearningMode = () => {
    // Trigger Exit-Animation durch State-Änderung
    setIsLearningMode(false);
    // States werden nach Animation-Ende in onAnimationComplete resettet
  };
  
  const handleCardFlipLearning = (e: React.MouseEvent) => {
    // Nur flippen wenn wir NICHT am Swipen sind
    if (swipeAxis === null) {
      setIsCardFlipped(!isCardFlipped);
    }
  };
  
  const goToNextCard = () => {
    if (currentCardIndex < learningModeCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsCardFlipped(false);
    } else {
      // Letzte Karte erreicht - Auto-Exit nach kurzer Verzögerung
      setTimeout(() => {
        exitLearningMode();
      }, 400);
    }
  };
  
  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsCardFlipped(false);
    }
  };
  
  // Pan Handler - Karte bleibt FIXIERT, nur Effekt erscheint!
  const handlePanStart = (event: any, info: any) => {
    // Bestimme Achse beim Start - dann locked!
    if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
      setSwipeAxis('horizontal');
    } else {
      setSwipeAxis('vertical');
    }
  };

  const handlePan = (event: any, info: any) => {
    const threshold = 20;
    
    // Nur in der gelockten Achse bewegen!
    if (swipeAxis === 'horizontal') {
      if (info.offset.x < -threshold) {
        setSwipeDirection('right'); // Nach LINKS wischen = Richtig (Grün)
      } else if (info.offset.x > threshold) {
        setSwipeDirection('left'); // Nach RECHTS wischen = Falsch (Rot)
      } else {
        setSwipeDirection(null);
      }
    } else if (swipeAxis === 'vertical') {
      if (info.offset.y < -threshold) {
        setSwipeDirection('up'); // Oben = Mittelmäßig (Orange)
      } else {
        setSwipeDirection(null);
      }
    }
  };
  
  const handlePanEnd = (event: any, info: any) => {
    const threshold = 60;
    
    // Check ob genug geswiped wurde
    let shouldAdvance = false;
    let swipeType: 'correct' | 'medium' | 'wrong' | null = null;
    
    if (swipeAxis === 'horizontal') {
      if (Math.abs(info.offset.x) > threshold) {
        if (info.offset.x < 0) {
          // Swipe LEFT = RICHTIG
          swipeType = 'correct';
          console.log('✅ Richtig markiert!');
        } else {
          // Swipe RIGHT = FALSCH
          swipeType = 'wrong';
          console.log('❌ Falsch markiert!');
        }
        shouldAdvance = true;
      }
    } else if (swipeAxis === 'vertical') {
      if (Math.abs(info.offset.y) > threshold) {
        // Swipe UP = MITTEL
        swipeType = 'medium';
        console.log('🟡 Mittelmäßig markiert!');
        shouldAdvance = true;
      }
    }
    
    // Update Confidence Score + Track beantwortet
    if (shouldAdvance && swipeType) {
      const currentCard = learningModeCards[currentCardIndex];
      const currentScore = cardScores.get(currentCard.id) ?? 0;
      let newScore = currentScore;
      
      // Score Update Logic (Option A: Mittel = +0%)
      if (swipeType === 'correct') {
        if (currentScore < 70) {
          newScore = Math.min(100, currentScore + 40);
        } else {
          newScore = Math.min(100, currentScore + 20);
        }
      } else if (swipeType === 'medium') {
        // Option A: Mittel erhöht Score NICHT
        newScore = currentScore; // +0%
      } else if (swipeType === 'wrong') {
        if (currentScore < 70) {
          newScore = Math.max(0, currentScore - 15);
        } else {
          newScore = Math.max(0, currentScore - 25);
        }
      }
      
      // Markiere Karte als beantwortet für Simulator Progress
      setAnsweredCards(prev => {
        const newSet = new Set(prev);
        newSet.add(currentCard.id);
        return newSet;
      });
      
      // Update Score in Map
      const updatedScores = new Map(cardScores);
      updatedScores.set(currentCard.id, newScore);
      setCardScores(updatedScores);
      
      // 🔥 Notify parent after state update (NOT inside setter to avoid setState-during-render warning)
      notifyProgressUpdate(updatedScores, cards);
      
      console.log(`Score Update: ${currentScore}% → ${newScore}%`);
    }
    
    // IMMER sofort reset - verhindert Overlay-Bug
    setSwipeDirection(null);
    setSwipeAxis(null);
    
    if (shouldAdvance) {
      // Karte sofort zurückflippen falls sie auf der Antwort-Seite ist
      setIsCardFlipped(false);
      
      // Karte wechselt während sie zurückgleitet (200ms für smooth transition)
      setTimeout(() => {
        goToNextCard();
      }, 200);
    }
  };

  // ===== RENDER LOGIC =====
  // 🔥 NO early return here! ModalManager handles mounting/unmounting.
  // Berechne Werte für beide Views
  const totalScore = Array.from(cardScores.values()).reduce((sum, score) => sum + score, 0);
  const averageScore = cards.length > 0 ? totalScore / cards.length : 0;

  // Learning Mode Werte (nur wenn aktiv)
  let currentCard: Flashcard | null = null;
  let progress = 0;
  
  if (isLearningMode && learningModeCards.length > 0) {
    // Safety check: Clamp index wenn außerhalb des Arrays (setState via useEffect unten)
    const safeIndex = currentCardIndex >= learningModeCards.length ? 0 : currentCardIndex;
    currentCard = learningModeCards[safeIndex];
    // Progress Bar = ANZAHL beantworteter Karten
    progress = (answeredCards.size / learningModeCards.length) * 100;
  }

  // Safety check: Reset index wenn außerhalb des Arrays (deferred to avoid setState-during-render)
  useEffect(() => {
    if (isLearningMode && learningModeCards.length > 0 && currentCardIndex >= learningModeCards.length) {
      setCurrentCardIndex(0);
    }
  }, [isLearningMode, learningModeCards.length, currentCardIndex]);

  // Safety check: Beende Lernmodus wenn keine Karten vorhanden
  useEffect(() => {
    if (isLearningMode && learningModeCards.length === 0) {
      exitLearningMode();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLearningMode, learningModeCards.length]);

  return (
    <AnimatePresence initial={false} onExitComplete={() => {
      // Reset States nach Exit-Animation
      setCurrentCardIndex(0);
      setIsCardFlipped(false);
    }}>
      {isLearningMode && currentCard ? (
        <motion.div
          key="learning-mode"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="size-full flex flex-col bg-[#0a0a0a] overscroll-none relative"
          style={{ position: 'absolute', inset: 0, zIndex: 10 }}
        >
        {/* Minimale Top-Bar */}
        <div className="px-6 py-3 flex-shrink-0 pt-safe lg:mt-[20px] mt-3">
          <div className="flex items-end justify-between mb-4">
            {/* Counter links - Normal, KEINE Farbe im Learning Mode */}
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/60">
              {currentCardIndex + 1} / {learningModeCards.length}
            </p>
            
            {/* Exit rechts */}
            <CloseButton onClick={exitLearningMode} />
          </div>
          
          {/* Glassmorphism Progress Bar */}
          <div className="relative w-full h-[10px] bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-full overflow-hidden"
            style={{
              isolation: 'isolate',
              zIndex: 1
            }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
              style={{
                background: 'linear-gradient(90deg, rgba(0, 147, 121, 0.5), rgba(0, 184, 148, 0.5))'
              }}
            />
          </div>
        </div>
        
        {/* Große Karte - Näher am Progressbalken */}
        <div className="flex-1 flex items-center justify-center px-5 -mt-4 pb-4">
          <motion.div
            onPanStart={handlePanStart}
            onPan={handlePan}
            onPanEnd={handlePanEnd}
            className="relative w-full max-w-[420px] h-full max-h-[580px] cursor-pointer select-none touch-none"
            style={{ perspective: '1200px' }}
          >
            <motion.div
              animate={{ 
                rotateY: isCardFlipped ? 180 : 0,
                x: swipeDirection === 'left' ? 6 : swipeDirection === 'right' ? -6 : 0,
                y: swipeDirection === 'up' ? -6 : 0,
              }}
              transition={{ 
                rotateY: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] },
                x: { duration: 0.15, ease: [0.4, 0.0, 0.2, 1] },
                y: { duration: 0.15, ease: [0.4, 0.0, 0.2, 1] },
              }}
              className="relative w-full h-full"
              style={{ 
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                willChange: 'transform',
                perspective: 1000,
                WebkitPerspective: 1000
              }}
              onClick={handleCardFlipLearning}
            >
              {/* Question Side (Front) - Apple 2026 Glassmorphism */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.12] rounded-[20px] flex flex-col overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  willChange: 'transform',
                  transform: 'translateZ(1px)',
                  WebkitTransform: 'translateZ(1px)',
                  isolation: 'isolate'
                }}
              >
                {/* Swipe Overlays - Apple 2026 Style - Elegant & Minimal */}
                <AnimatePresence>
                  {/* FALSCH - LINKS - Reiner Farbhauch ohne Blur */}
                  {swipeDirection === 'left' && (
                    <motion.div
                      key="swipe-left"
                      initial={{ opacity: 0, x: -60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                      className="absolute left-0 top-0 bottom-0 w-full z-10 pointer-events-none overflow-hidden rounded-[20px]"
                    >
                      {/* KEIN backdropFilter - nur reiner Farbgradient */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-[400px]"
                        style={{
                          background: 'linear-gradient(to right, rgba(255, 107, 107, 0.12) 0%, rgba(255, 107, 107, 0.06) 25%, rgba(255, 107, 107, 0) 60%)',
                        }}
                      />
                      {/* X Icon */}
                      <div className="absolute left-8 top-1/2 -translate-y-1/2">
                        <svg className="size-[64px]" fill="none" viewBox="0 0 64 64">
                          <path d="M20 20L44 44M44 20L20 44" stroke="rgba(255, 120, 120, 0.9)" strokeWidth="4.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* RICHTIG - RECHTS - Reiner Farbhauch ohne Blur */}
                  {swipeDirection === 'right' && (
                    <motion.div
                      key="swipe-right"
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                      className="absolute right-0 top-0 bottom-0 w-full z-10 pointer-events-none overflow-hidden rounded-[20px]"
                    >
                      {/* KEIN backdropFilter - nur reiner Farbgradient */}
                      <div 
                        className="absolute right-0 top-0 bottom-0 w-[400px]"
                        style={{
                          background: 'linear-gradient(to left, rgba(94, 196, 176, 0.12) 0%, rgba(94, 196, 176, 0.06) 25%, rgba(94, 196, 176, 0) 60%)',
                        }}
                      />
                      {/* Checkmark Icon */}
                      <div className="absolute right-8 top-1/2 -translate-y-1/2">
                        <svg className="size-[64px]" fill="none" viewBox="0 0 64 64">
                          <path d="M18 32L28 42L46 22" stroke="rgba(100, 200, 180, 0.9)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* MITTEL - OBEN - Reiner Farbhauch ohne Blur */}
                  {swipeDirection === 'up' && (
                    <motion.div
                      key="swipe-up"
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                      className="absolute bottom-0 left-0 right-0 h-full z-10 pointer-events-none overflow-hidden rounded-[20px]"
                    >
                      {/* KEIN backdropFilter - nur reiner Farbgradient */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-[400px]"
                        style={{
                          background: 'linear-gradient(to top, rgba(255, 165, 0, 0.12) 0%, rgba(255, 165, 0, 0.06) 25%, rgba(255, 165, 0, 0) 60%)',
                        }}
                      />
                      {/* Minus Icon */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-8">
                        <svg className="size-[64px]" fill="none" viewBox="0 0 64 64">
                          <path d="M20 32H44" stroke="rgba(255, 170, 0, 0.9)" strokeWidth="4.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Frage Badge - Grau und dezent */}
                <div className="flex items-center justify-center pt-6 pb-3">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.04] rounded-full border border-white/[0.06]">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/40 uppercase tracking-wider">
                      Frage
                    </p>
                  </div>
                </div>
                
                {/* Frage - Maximaler Platz, perfekt zentriert */}
                <div className="flex-1 flex items-center justify-center px-8 pb-8">
                  <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white text-center leading-[28px]">
                    {currentCard.question}
                  </p>
                </div>
              </div>
              
              {/* Answer Side (Back) - Apple 2026 Glassmorphism */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.12] rounded-[20px] flex flex-col overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg) translateZ(1px)',
                  WebkitTransform: 'rotateY(180deg) translateZ(1px)',
                  willChange: 'transform',
                  isolation: 'isolate'
                }}
              >
                {/* Swipe Overlays - MIT rotateY(180deg) für korrekte Anzeige auf der Rückseite */}
                <AnimatePresence>
                  {/* FALSCH - LINKS - Reiner Farbhauch ohne Blur (Rückseite) */}
                  {swipeDirection === 'left' && (
                    <motion.div
                      key="swipe-left-back"
                      initial={{ opacity: 0, x: -60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                      className="absolute left-0 top-0 bottom-0 w-full z-10 pointer-events-none overflow-hidden rounded-[20px]"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      {/* KEIN backdropFilter - nur reiner Farbgradient */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-[400px]"
                        style={{
                          background: 'linear-gradient(to right, rgba(255, 107, 107, 0.12) 0%, rgba(255, 107, 107, 0.06) 25%, rgba(255, 107, 107, 0) 60%)',
                        }}
                      />
                      {/* X Icon */}
                      <div className="absolute left-8 top-1/2 -translate-y-1/2">
                        <svg className="size-[64px]" fill="none" viewBox="0 0 64 64">
                          <path d="M20 20L44 44M44 20L20 44" stroke="rgba(255, 120, 120, 0.9)" strokeWidth="4.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* RICHTIG - RECHTS - Reiner Farbhauch ohne Blur (Rückseite) */}
                  {swipeDirection === 'right' && (
                    <motion.div
                      key="swipe-right-back"
                      initial={{ opacity: 0, x: 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                      className="absolute right-0 top-0 bottom-0 w-full z-10 pointer-events-none overflow-hidden rounded-[20px]"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      {/* KEIN backdropFilter - nur reiner Farbgradient */}
                      <div 
                        className="absolute right-0 top-0 bottom-0 w-[400px]"
                        style={{
                          background: 'linear-gradient(to left, rgba(94, 196, 176, 0.12) 0%, rgba(94, 196, 176, 0.06) 25%, rgba(94, 196, 176, 0) 60%)',
                        }}
                      />
                      {/* Checkmark Icon */}
                      <div className="absolute right-8 top-1/2 -translate-y-1/2">
                        <svg className="size-[64px]" fill="none" viewBox="0 0 64 64">
                          <path d="M18 32L28 42L46 22" stroke="rgba(100, 200, 180, 0.9)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* MITTEL - OBEN - Reiner Farbhauch ohne Blur (Rückseite) */}
                  {swipeDirection === 'up' && (
                    <motion.div
                      key="swipe-up-back"
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                      className="absolute bottom-0 left-0 right-0 h-full z-10 pointer-events-none overflow-hidden rounded-[20px]"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      {/* KEIN backdropFilter - nur reiner Farbgradient */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-[400px]"
                        style={{
                          background: 'linear-gradient(to top, rgba(255, 165, 0, 0.12) 0%, rgba(255, 165, 0, 0.06) 25%, rgba(255, 165, 0, 0) 60%)',
                        }}
                      />
                      {/* Minus Icon */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-8">
                        <svg className="size-[64px]" fill="none" viewBox="0 0 64 64">
                          <path d="M20 32H44" stroke="rgba(255, 170, 0, 0.9)" strokeWidth="4.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Answer Badge - Grün mit Punkt */}
                <div className="flex items-center justify-center pt-6 pb-3">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-[#009379]/20 rounded-full border border-[#009379]/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#009379]" />
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-[#009379] uppercase tracking-wider">
                      Antwort
                    </p>
                  </div>
                </div>
                
                {/* Antwort - Gleiche Farbe wie Frage */}
                <div className="flex-1 flex items-center justify-center px-8 pb-8">
                  <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white text-center leading-[28px]">
                    {currentCard.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Karte Umdrehen Button - Apple 2026 Glassmorphism */}
        <div className="px-6 pb-8 flex-shrink-0">
          <div className="flex items-center justify-center gap-3">
            {/* "Lösung"-Button — opens a popup with a step-by-step explanation
                so students see *how* the answer comes about, not just the answer. */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSolution(true);
              }}
              className="relative px-4 py-4 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95"
              style={{
                background: 'rgba(123,97,255,0.06)',
                border: '1px solid rgba(123,97,255,0.20)',
                WebkitTapHighlightColor: 'transparent',
                willChange: 'transform',
                transform: 'translateZ(0)',
                isolation: 'isolate',
                zIndex: 1,
              }}
              title="Lösung anzeigen"
              aria-label="Lösung anzeigen"
            >
              <HelpCircle className="relative z-10 w-[20px] h-[20px]" style={{ color: '#7B61FF' }} />
            </button>

            {/* Flip Button */}
            <button
              onClick={() => {
                // Toggle Flip - funktioniert auf beiden Seiten
                setIsCardFlipped(!isCardFlipped);
              }}
              className="relative px-8 py-4 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] flex items-center gap-3 transition-all duration-300 active:scale-95"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                willChange: 'transform',
                transform: 'translateZ(0)',
                isolation: 'isolate',
                zIndex: 1
              }}
            >
              {/* Icon */}
              <svg className="relative z-10 size-[20px] transition-transform duration-300" fill="none" viewBox="0 0 24 24">
                <path d="M3 12h18M3 12l4-4M3 12l4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12l-4-4M21 12l-4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              {/* Text */}
              <p className="relative z-10 font-['Poppins:SemiBold',sans-serif] text-[13px] text-white tracking-wide">
                Karte umdrehen
              </p>
            </button>
          </div>
        </div>

        {/* ===== LÖSUNG POPUP ===== */}
        <AnimatePresence>
          {showSolution && currentCard && (
            <motion.div
              key="solution-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[11000] flex items-end sm:items-center justify-center"
              style={{
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
              onClick={() => setShowSolution(false)}
            >
              <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 40, opacity: 0, scale: 0.98 }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[440px] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
                style={{
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)',
                  border: '1px solid rgba(123,97,255,0.25)',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
                  maxHeight: '86vh',
                  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                }}
              >
                {/* Handle (mobile) */}
                <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
                  <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
                </div>

                {/* Header */}
                <div className="px-5 pt-3 pb-4 flex items-start justify-between gap-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'rgba(123,97,255,0.12)',
                        border: '1px solid rgba(123,97,255,0.28)',
                      }}
                    >
                      <Sparkles className="w-4 h-4" style={{ color: '#9B87FF' }} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <h3
                        className="text-white text-[16px] truncate"
                        style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, letterSpacing: '-0.2px' }}
                      >
                        Lösung
                      </h3>
                      <p
                        className="text-white/45 text-[11px] mt-0.5"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        So kommst du auf die Antwort
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSolution(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.05] active:scale-95 transition-transform flex-shrink-0"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    aria-label="Schließen"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>

                {/* Content — nur der Lösungsweg, Frage/Antwort sind auf der Karte selbst sichtbar */}
                <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-hide">
                  <p
                    className="text-[10px] uppercase tracking-wider mb-2"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: '#9B87FF', letterSpacing: '0.08em' }}
                  >
                    Lösungsweg
                  </p>
                  {currentCard.explanation && currentCard.explanation.trim().length > 0 ? (
                    <p
                      className="text-white/85 text-[14px] whitespace-pre-line"
                      style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, lineHeight: '22px' }}
                    >
                      {currentCard.explanation}
                    </p>
                  ) : (
                    <p
                      className="text-white/45 text-[13px]"
                      style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, lineHeight: '20px' }}
                    >
                      Für diese Karte ist noch kein Lösungsweg hinterlegt. Dein Lehrer kann
                      eine ausführliche Erklärung ergänzen, damit du den Gedankengang besser
                      nachvollziehen kannst.
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 pt-3 pb-5 border-t border-white/[0.06]">
                  <button
                    onClick={() => setShowSolution(false)}
                    className="w-full h-[44px] rounded-xl flex items-center justify-center active:scale-[0.98] transition-transform"
                    style={{
                      background: 'rgba(123,97,255,0.14)',
                      border: '1px solid rgba(123,97,255,0.30)',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <span
                      className="text-[13px]"
                      style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: '#C6A5FF' }}
                    >
                      Alles klar, zurück
                    </span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      ) : (
        <div
          key="normal-view"
          className="size-full flex flex-col bg-[#0a0a0a] overscroll-none relative"
        >
      {/* Header */}
      <div className="px-6 py-3 flex-shrink-0 pt-safe lg:mt-[20px] mt-3">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="font-['Poppins:SemiBold',sans-serif] text-[16px] lg:text-[15px] text-white mb-1">
              {setName}
            </h1>
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[13px] text-[#979797] truncate">
              {subject}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {/* Help/Tutorial Button */}
            <button
              className="bg-white/[0.06] border border-white/[0.08] active:bg-white/[0.1] active:border-white/[0.2] rounded-full size-[42px] flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 flex-shrink-0"
              style={{
                WebkitTapHighlightColor: 'transparent'
              }}
              onClick={() => setIsTutorialOpen(true)}
              title="Tutorial öffnen"
            >
              <svg
                className="w-[16px] h-[16px] text-[#999]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            
            {/* Close Button */}
            <CloseButton onClick={onClose} />
          </div>
        </div>
      </div>

      {/* Actions: Shuffle + Search with Filter */}
      <div className="px-6 mb-5 flex gap-2.5 flex-shrink-0">
        <button
          onClick={handleShuffle}
          className="relative bg-white/[0.05] border border-white/[0.08] h-[38px] rounded-xl px-3.5 flex items-center gap-2.5 flex-shrink-0 transition-colors duration-150"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <Shuffle className="w-[15px] h-[15px] text-white/80 flex-shrink-0" strokeWidth={2} />
          <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80 whitespace-nowrap">Karten mischen</p>
        </button>
        
        {/* Search Field with integrated Filter */}
        <div 
          ref={filterDropdownRef} 
          className="relative flex-1 min-w-0"
        >
          <div 
            onClick={() => searchInputRef.current?.focus()}
            className="bg-white/[0.05] border border-white/[0.08] h-[38px] rounded-xl px-3.5 flex items-center gap-2.5 overflow-hidden cursor-text"
            style={{
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <svg className="size-[15px] flex-shrink-0" fill="none" viewBox="0 0 16 16">
              <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#666" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d="M14 14L11.1 11.1" stroke="#666" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Suche"
              className="flex-1 min-w-0 bg-transparent font-['Poppins:Regular',sans-serif] text-[13px] text-white placeholder:text-white/25 outline-none"
            />
            
            {/* Clear Button - mit fixer Breite damit Filter-Button nicht verschoben wird */}
            <div className="flex-shrink-0 w-[20px] flex items-center justify-center">
              {searchQuery && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSearch();
                  }}
                  className="p-0.5 transition-opacity"
                >
                  <svg className="size-[11px]" fill="none" viewBox="0 0 12 12">
                    <path d="M2 2L10 10M10 2L2 10" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Filter Icon - rechts im Suchfeld */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFilterDropdownOpen(!isFilterDropdownOpen);
              }}
              className="relative flex-shrink-0 p-0.5 transition-opacity -mr-1"
            >
              <SlidersHorizontal className="w-[15px] h-[15px] text-white/60" strokeWidth={2} />
              
              {/* Active Filter Badge - zeige wenn nicht alle Filter aktiv sind */}
              {(!filters.learningPhase || !filters.almostMastered || !filters.mastered) && (
                <div 
                  className="absolute -top-0.5 -right-0.5 w-[8px] h-[8px] rounded-full border border-[#18181b] bg-[#009379]"
                />
              )}
            </button>
          </div>
          
          {/* Filter Dropdown - outside overflow-hidden container */}
          <AnimatePresence>
            {isFilterDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-[99]" 
                  onClick={() => setIsFilterDropdownOpen(false)}
                />
                
                {/* Popup */}
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: [0.4, 0.0, 0.2, 1] }}
                  className="absolute top-[44px] right-0 min-w-[240px] rounded-xl border border-white/[0.10] bg-[#141414] overflow-hidden"
                  style={{
                    zIndex: 1000
                  }}
                >
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter-Modus
                  </p>
                </div>
                
                {/* Filter Options */}
                <div className="py-2">
                  {/* Lernphase (0-69%) */}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, learningPhase: !prev.learningPhase }))}
                    className="w-full px-4 py-3.5 flex items-center gap-3 text-left font-['Poppins:Medium',sans-serif] text-[14px] text-white/70 transition-all duration-200"
                  >
                    <Checkbox checked={filters.learningPhase} />
                    <div className="w-[18px] h-[18px] rounded-md bg-white/[0.08] flex items-center justify-center">
                      <div className="w-[8px] h-[8px] rounded-full bg-[#707070]" />
                    </div>
                    <span>Lernphase</span>
                  </button>
                  
                  {/* Fast gemeistert (70-99%) */}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, almostMastered: !prev.almostMastered }))}
                    className="w-full px-4 py-3.5 flex items-center gap-3 text-left font-['Poppins:Medium',sans-serif] text-[14px] text-white/70 transition-all duration-200"
                  >
                    <Checkbox checked={filters.almostMastered} />
                    <div className="w-[18px] h-[18px] rounded-md bg-yellow-500/10 flex items-center justify-center">
                      <div className="w-[8px] h-[8px] rounded-full bg-yellow-500" />
                    </div>
                    <span>Fast gemeistert</span>
                  </button>
                  
                  {/* Gemeistert (100%) */}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, mastered: !prev.mastered }))}
                    className="w-full px-4 py-3.5 flex items-center gap-3 text-left font-['Poppins:Medium',sans-serif] text-[14px] text-white/70 transition-all duration-200"
                  >
                    <Checkbox checked={filters.mastered} />
                    <div className="w-[18px] h-[18px] rounded-md bg-green-500/10 flex items-center justify-center">
                      <div className="w-[8px] h-[8px] rounded-full bg-green-500" />
                    </div>
                    <span>Gemeistert</span>
                  </button>
                </div>
              </motion.div>
            </>
            )}
          </AnimatePresence>
        </div>
      </div>



      {/* Cards List */}
      <div ref={scrollContainerRef} className="flex-1 px-6 pb-3 overflow-y-auto overscroll-none relative">
        {/* Shuffle Loading Animation */}
        <AnimatePresence>
          {isShuffling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] flex items-center justify-center"
            >
              <div className="relative w-[280px] h-[240px] flex items-center justify-center">
                {/* 3 Cards that shuffle positions - Faster & No Text */}
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="absolute w-[280px] h-[70px] rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] flex items-center px-4 gap-3"
                    animate={{
                      y: [
                        index === 0 ? -85 : index === 1 ? 0 : 85,
                        index === 0 ? 0 : index === 1 ? 85 : -85,
                        index === 0 ? 85 : index === 1 ? -85 : 0,
                        index === 0 ? -85 : index === 1 ? 0 : 85
                      ],
                      opacity: [0.6, 0.9, 0.6, 0.6]
                    }}
                    transition={{
                      duration: 1.3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      willChange: 'transform, opacity',
                      transform: 'translateZ(0)'
                    }}
                  >
                    {/* Placeholder line for card content */}
                    <div className="flex-1 h-[8px] rounded-full bg-white/[0.15]" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={isShuffling ? 'hidden' : 'visible'}
          initial={{ opacity: 0 }}
          animate={{ opacity: isShuffling ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {filteredCards.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-[#707070]">
                Keine Karteikarten gefunden
              </p>
            </div>
          ) : (
            filteredCards.map((card, index) => {
              const isFlipped = flippedCards.has(card.id);
              
              // Score für diese Karte
              const cardScore = cardScores.get(card.id) ?? 0;
              
              // Helper: Kartennummer Farbe - immer weiß für konsistentes Design
              const getCardNumberColor = (score: number) => {
                return 'text-white';
              };
              
              // Helper: Box Background Farbe
              const getCardNumberBgColor = (score: number) => {
                if (score === 100) return 'bg-green-500/10';
                if (score >= 70) return 'bg-yellow-500/10';
                return 'bg-white/[0.08]';
              };
              
              // Helper: Kartennummer Glow (nur bei mastered)
              const getCardNumberGlow = (score: number) => {
                if (score === 100) return 'drop-shadow-[0_0_6px_rgba(34,197,94,0.4)]';
                return '';
              };
              
              return (
                <div
                  key={card.id}
                  ref={(el) => (cardRefs.current[card.id] = el)}
                  onClick={() => handleCardFlip(card.id)}
                  className="relative rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] cursor-pointer overflow-hidden"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    willChange: 'transform',
                    transform: 'translate3d(0,0,0)',
                    WebkitTransform: 'translate3d(0,0,0)',
                    isolation: 'isolate',
                    zIndex: 1,
                    transition: 'transform 0.15s ease-out',
                    scrollMarginTop: '104px',
                    contain: 'layout style paint'
                  }}
                >
                  {/* Question - Fades out when flipped */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isFlipped ? 0 : 'auto',
                      opacity: isFlipped ? 0 : 1
                    }}
                    transition={{
                      height: { duration: 0.35, ease: [0.4, 0.0, 0.2, 1] },
                      opacity: { duration: 0.2 }
                    }}
                    style={{ 
                      overflow: 'hidden',
                      willChange: 'height, opacity',
                      transform: 'translate3d(0,0,0)',
                      WebkitTransform: 'translate3d(0,0,0)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      contain: 'layout paint'
                    }}
                  >
                    <div className="flex items-center px-[11px] py-[15px] gap-4 min-h-[54px]">
                      <div className={`relative z-10 w-[32px] h-[32px] rounded-[8px] ${getCardNumberBgColor(cardScore)} flex items-center justify-center flex-shrink-0 transition-all duration-300`}>
                        <p className={`font-['Poppins:Bold',sans-serif] text-[14px] ${getCardNumberColor(cardScore)} ${getCardNumberGlow(cardScore)} transition-all duration-300`}>
                          {index + 1}
                        </p>
                      </div>
                      <p 
                        className="relative z-10 font-['Poppins:Medium',sans-serif] text-[15px] lg:text-[16px] text-white flex-1 leading-[22px] lg:leading-[23px]"
                        style={{
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          wordWrap: 'break-word'
                        }}
                      >
                        {card.question}
                      </p>
                    </div>
                  </motion.div>

                  {/* Answer - Expands to replace question */}
                  <motion.div
                    ref={(el) => {
                      if (el) answerRefs.current[card.id] = el;
                    }}
                    initial={false}
                    animate={{
                      height: isFlipped ? 'auto' : 0,
                      opacity: isFlipped ? 1 : 0
                    }}
                    transition={{
                      height: { duration: 0.35, ease: [0.4, 0.0, 0.2, 1] },
                      opacity: { duration: 0.25, delay: isFlipped ? 0.1 : 0 }
                    }}
                    style={{ 
                      overflow: 'hidden',
                      willChange: 'height, opacity',
                      transform: 'translate3d(0,0,0)',
                      WebkitTransform: 'translate3d(0,0,0)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      contain: 'layout paint'
                    }}
                  >
                    <div
                      className="relative rounded-2xl bg-gradient-to-br from-[#009379]/10 to-[#009379]/5 border border-[#009379]/40 flex items-start px-[11px] py-[15px] gap-4 mx-[11px] mb-[11px] mt-[11px]"
                    >
                      <div className="relative z-10 flex flex-col flex-1 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-[5px] h-[5px] rounded-full bg-[#009379]" />
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#009379] uppercase tracking-wider">
                            Antwort
                          </p>
                        </div>
                        <p 
                          className="font-['Poppins:Regular',sans-serif] text-[14px] lg:text-[15px] text-white/90 leading-[20px] lg:leading-[22px]"
                          style={{
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            wordWrap: 'break-word'
                          }}
                        >
                          {card.answer}
                        </p>
                      </div>
                      
                      {/* Close Icon */}
                      <svg className="relative z-10 w-[14px] h-[14px] flex-shrink-0 self-start mt-1" fill="none" viewBox="0 0 14 14">
                        <path d="M2 2L12 12M12 2L2 12" stroke="#009379" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </motion.div>
                </div>
              );
            })
          )}
        </motion.div>
      </div>

      {/* Footer - Start Learning Mode Button */}
      {!isShuffling && (
        <div className="relative px-6 pb-6 pt-6 flex-shrink-0">
          {/* Gradient Overlay to fade out cards */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, #0a0a0a 60%, #0a0a0a 100%)',
              zIndex: 10
            }}
          />
          
          <div style={{ position: 'relative', zIndex: 20 }}>
            <Button
              disabled={filteredCards.length === 0}
              onClick={startLearningMode}
            >
              Lernmodus starten
            </Button>
          </div>
        </div>
      )}
      
      {/* Tutorial */}
      <FlashcardTutorial 
        isOpen={isTutorialOpen} 
        onClose={() => setIsTutorialOpen(false)} 
      />
        </div>
      )}
    </AnimatePresence>
  );
}