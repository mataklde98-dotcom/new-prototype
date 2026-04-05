import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, RotateCw, Trash2, Check, Pencil } from 'lucide-react';
import SubjectPicker from './SubjectPicker';
import CloseButton from '@/app/components/CloseButton';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface CreateOwnSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, cards: Flashcard[], subject: string) => void;
}

export default function CreateOwnSetModal({ isOpen, onClose, onSave }: CreateOwnSetModalProps) {
  const [setTitle, setSetTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Mathematik'); // Default subject
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [flippedCardsList, setFlippedCardsList] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  // Available subjects - same as in filters
  const subjects = ['Mathematik', 'Deutsch', 'Englisch', 'Biologie', 'Geschichte', 'Chemie', 'Französisch'];

  console.log('🟡 CreateOwnSetModal render - isOpen:', isOpen);

  // Titel-Limit: 2 Zeilen à ~30 Zeichen = 60 Zeichen
  const TITLE_MAX_LENGTH = 60;

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSetTitle('');
      setSelectedSubject('Mathematik');
      setCurrentQuestion('');
      setCurrentAnswer('');
      setIsFlipped(false);
      setCards([]);
      setEditingCardId(null);
      setFlippedCardsList(new Set());
    }
  }, [isOpen]);

  // Add/Update Card Handler
  const handleAddCard = () => {
    if (!currentQuestion.trim() || !currentAnswer.trim()) {
      return;
    }

    if (editingCardId) {
      // Update existing card
      setCards(cards.map(card => 
        card.id === editingCardId 
          ? { ...card, question: currentQuestion, answer: currentAnswer }
          : card
      ));
      setEditingCardId(null);
    } else {
      // Add new card
      const newCard: Flashcard = {
        id: Date.now().toString(),
        question: currentQuestion,
        answer: currentAnswer,
      };
      setCards([...cards, newCard]);
    }

    // Reset form
    setCurrentQuestion('');
    setCurrentAnswer('');
    setIsFlipped(false);
  };

  // Edit Card Handler
  const handleEditCard = (card: Flashcard) => {
    setCurrentQuestion(card.question);
    setCurrentAnswer(card.answer);
    setEditingCardId(card.id);
    setIsFlipped(false);

    // Scroll to top to show the flip card
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }, 100);
  };

  // Delete Card Handler
  const handleDeleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
    if (editingCardId === id) {
      setEditingCardId(null);
      setCurrentQuestion('');
      setCurrentAnswer('');
      setIsFlipped(false);
    }
  };

  // Cancel Edit Handler
  const handleCancelEdit = () => {
    setCurrentQuestion('');
    setCurrentAnswer('');
    setEditingCardId(null);
    setIsFlipped(false);
  };

  // Flip Card in List Handler
  const handleCardListFlip = (cardId: string) => {
    setFlippedCardsList(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // Save Set Handler
  const handleSaveSet = () => {
    if (!setTitle.trim() || cards.length === 0) {
      return;
    }
    onSave(setTitle, cards, selectedSubject);
    onClose();
  };

  const handleClose = () => {
    // Don't reset state here - let useEffect handle it
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
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-[#141414] border border-white/[0.12] rounded-[24px] w-full max-w-[520px] overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-white/[0.08] flex-shrink-0">
              <CloseButton
                onClick={handleClose}
                position="absolute top-6 right-6"
              />

              <h2 className="font-['Poppins:Bold',sans-serif] text-white text-[22px] mb-1">
                Eigenes Set erstellen
              </h2>
              <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#b3b3b3]">
                Erstelle deine eigenen Karteikarten
              </p>
            </div>

            {/* Content - Scrollable */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin"
            >
              {/* Subject Picker - iOS Style Bottom Sheet */}
              <SubjectPicker
                value={selectedSubject}
                onChange={setSelectedSubject}
                subjects={subjects}
                label="Fach"
                className="mb-6"
              />

              {/* Set Titel Input */}
              <div className="mb-6">
                <label className="block font-['Poppins:Medium',sans-serif] text-white/70 text-[13px] mb-2">
                  Set-Titel
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={setTitle}
                    onChange={(e) => setSetTitle(e.target.value.slice(0, TITLE_MAX_LENGTH))}
                    placeholder="z.B. Englisch Vokabeln Unit 3"
                    maxLength={TITLE_MAX_LENGTH}
                    className="w-full bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] focus:border-white/[0.2] rounded-[14px] pl-4 pr-14 py-3.5 font-['Poppins:Regular',sans-serif] text-white placeholder:text-white/30 outline-none transition-all duration-150"
                    style={{
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="font-['Poppins:Medium',sans-serif] text-white/50 text-[11px]">
                      {setTitle.length}/{TITLE_MAX_LENGTH}
                    </span>
                  </div>
                </div>
              </div>

              {/* Flip Card Creator */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-['Poppins:Medium',sans-serif] text-white/70 text-[13px]">
                    {editingCardId ? 'Karte bearbeiten' : 'Neue Karte erstellen'}
                  </label>
                  {editingCardId && (
                    <button
                      onClick={handleCancelEdit}
                      className="font-['Poppins:Medium',sans-serif] text-white/50 text-[12px] active:scale-95 transition-all duration-150"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      Abbrechen
                    </button>
                  )}
                </div>

                {/* Card + Buttons Container - Max Width */}
                <div className="max-w-[400px] mx-auto">
                  {/* Flip Card */}
                  <div 
                    className="relative w-full h-[240px] mb-4"
                    style={{ perspective: '1000px' }}
                  >
                  <div 
                    className="relative w-full h-full transition-transform duration-500"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    {/* Front Side - Question */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.12] rounded-[20px] flex flex-col overflow-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      {/* Frage Badge - Grau und dezent */}
                      <div className="flex items-center justify-between pt-6 pb-3 px-6">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.04] rounded-full border border-white/[0.06]">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                          <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/40 uppercase tracking-wider">
                            Frage
                          </p>
                        </div>
                        <button
                          onClick={() => setIsFlipped(true)}
                          className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center active:scale-95 transition-all duration-150"
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          <RotateCw className="w-4 h-4 text-white/60" />
                        </button>
                      </div>
                      <textarea
                        value={currentQuestion}
                        onChange={(e) => setCurrentQuestion(e.target.value)}
                        placeholder="Frage eingeben..."
                        className="flex-1 bg-transparent border-none outline-none resize-none font-['Poppins:Medium',sans-serif] text-white placeholder:text-white/30 px-8 pb-8 text-center"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      />
                    </div>

                    {/* Back Side - Answer */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.12] rounded-[20px] flex flex-col overflow-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      {/* Answer Badge - Grün mit Punkt */}
                      <div className="flex items-center justify-between pt-6 pb-3 px-6">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#009379]/20 rounded-full border border-[#009379]/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#009379]" />
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-[#009379] uppercase tracking-wider">
                            Antwort
                          </p>
                        </div>
                        <button
                          onClick={() => setIsFlipped(false)}
                          className="w-8 h-8 rounded-lg bg-[#009379]/10 border border-[#009379]/20 flex items-center justify-center active:scale-95 transition-all duration-150"
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          <RotateCw className="w-4 h-4 text-[#009379]" />
                        </button>
                      </div>
                      <textarea
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Antwort eingeben..."
                        className="flex-1 bg-transparent border-none outline-none resize-none font-['Poppins:Medium',sans-serif] text-white placeholder:text-white/30 px-8 pb-8 text-center"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      />
                    </div>
                  </div>
                </div>

                  {/* Buttons - Umdrehen & Hinzufügen */}
                  <div className="flex items-center gap-3">
                  {/* Karte umdrehen Button */}
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="flex-1 bg-gradient-to-br from-white/[0.10] to-white/[0.05] border border-white/[0.15] rounded-[14px] px-4 py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200"
                    style={{
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    <RotateCw className="w-5 h-5 text-white transition-colors" />
                    <span className="font-['Poppins:Medium',sans-serif] text-white text-[15px]">
                      Umdrehen
                    </span>
                  </button>

                  {/* Karte hinzufügen/aktualisieren Button */}
                  <button
                    onClick={handleAddCard}
                    disabled={!currentQuestion.trim() || !currentAnswer.trim()}
                    className="flex-1 bg-gradient-to-br from-white/[0.10] to-white/[0.05] disabled:from-white/[0.03] disabled:to-white/[0.02] border border-white/[0.15] disabled:border-white/[0.06] rounded-[14px] px-4 py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    {editingCardId ? (
                      <>
                        <Check className="w-5 h-5 text-white transition-colors" />
                        <span className="font-['Poppins:Medium',sans-serif] text-white text-[15px]">
                          Aktualisieren
                        </span>
                      </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-white transition-colors" />
                      <span className="font-['Poppins:Medium',sans-serif] text-white text-[15px]">
                        Hinzufügen
                      </span>
                    </>
                  )}
                  </button>
                </div>
                </div>
              </div>

              {/* Cards List */}
              {cards.length > 0 && (
                <div className="space-y-3 mb-5">
                  <h3 className="font-['Poppins:SemiBold',sans-serif] text-white/70 text-[13px]">
                    Erstellte Karten ({cards.length})
                  </h3>
                  {cards.map((card, index) => {
                    const isCardFlipped = flippedCardsList.has(card.id);
                    
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                        className="relative rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] overflow-hidden"
                        style={{
                          WebkitTapHighlightColor: 'transparent',
                          willChange: 'transform',
                          transform: 'translateZ(0)',
                          isolation: 'isolate',
                          zIndex: 1,
                          transition: 'all 0.3s'
                        }}
                      >
                        {/* Question - Fades out when flipped */}
                        <motion.div
                          initial={false}
                          animate={{
                            height: isCardFlipped ? 0 : 'auto',
                            opacity: isCardFlipped ? 0 : 1
                          }}
                          transition={{
                            height: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
                            opacity: { duration: 0.15 }
                          }}
                          style={{ overflow: 'hidden' }}
                        >
                          {/* Question Row - Click to flip */}
                          <div 
                            onClick={() => handleCardListFlip(card.id)}
                            className="flex items-center px-[11px] pt-[15px] pb-[10px] gap-4 min-h-[54px] cursor-pointer"
                          >
                            <div className="relative z-10 w-[32px] h-[32px] rounded-[8px] bg-white/[0.08] flex items-center justify-center flex-shrink-0 transition-all duration-300">
                              <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white transition-all duration-300">
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

                          {/* Action Buttons Row */}
                          <div 
                            className="flex justify-end gap-1.5 px-[11px] pb-[15px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCard(card);
                              }}
                              className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center active:scale-95 transition-all duration-150"
                              style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                              <Pencil className="w-3.5 h-3.5 text-white/70" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCard(card.id);
                              }}
                              className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center active:scale-95 transition-all duration-150"
                              style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        </motion.div>

                        {/* Answer - Expands to replace question */}
                        <motion.div
                          initial={false}
                          animate={{
                            height: isCardFlipped ? 'auto' : 0,
                            opacity: isCardFlipped ? 1 : 0
                          }}
                          transition={{
                            height: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
                            opacity: { duration: 0.2, delay: isCardFlipped ? 0.1 : 0 }
                          }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div
                            onClick={() => handleCardListFlip(card.id)}
                            className="relative rounded-2xl bg-gradient-to-br from-[#009379]/10 to-[#009379]/5 border border-[#009379]/40 flex items-start px-[11px] py-[15px] gap-4 mx-[11px] mb-[11px] mt-[11px] cursor-pointer"
                          >
                            <div className="relative z-10 flex flex-col flex-1 gap-2 min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <div className="w-[5px] h-[5px] rounded-full bg-[#009379]" />
                                <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#009379] uppercase tracking-wider">
                                  Antwort
                                </p>
                              </div>
                              <p className="font-['Poppins:Regular',sans-serif] text-[14px] lg:text-[15px] text-white/90 leading-[20px] lg:leading-[22px] break-words">
                                {card.answer}
                              </p>
                            </div>
                            
                            {/* Close Icon */}
                            <svg className="relative z-10 w-[14px] h-[14px] flex-shrink-0 self-start mt-1" fill="none" viewBox="0 0 14 14">
                              <path d="M2 2L12 12M12 2L2 12" stroke="#009379" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </div>
                        </motion.div>


                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Empty State Hint */}
              {cards.length === 0 && (
                <div className="text-center py-6 px-4">
                  <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-white/30" />
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-white/40 text-[13px] leading-relaxed">
                    Füge mindestens eine Karte hinzu,<br />um dein Set zu erstellen
                  </p>
                </div>
              )}

              {/* Save Button - Only show when cards exist */}
              {cards.length > 0 && (
                <div className="mt-6 pb-2">
                  <button
                    onClick={handleSaveSet}
                    disabled={!setTitle.trim() || cards.length === 0}
                    className="w-full rounded-[16px] px-6 py-4 flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: (!setTitle.trim() || cards.length === 0) ? 'rgba(255,255,255,0.04)' : 'rgba(0,184,148,0.07)',
                      border: (!setTitle.trim() || cards.length === 0) ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,184,148,0.25)',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <Check className="w-5 h-5 text-white" />
                    <span className="font-['Poppins:SemiBold',sans-serif] text-white text-[15px]">
                      Set erstellen ({cards.length} {cards.length === 1 ? 'Karte' : 'Karten'})
                    </span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}