import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import Button from '@/app/components/Button';

type AIContentGenerationModalProps = {
  isOpen: boolean;
  type: 'category' | 'topic';
  currentSubjectId: string;
  currentSubjectName: string;
  onClose: () => void;
  onGenerate: (input: string, selectedSubjectId: string) => Promise<void>;
  defaultInput?: string;
  defaultSubjectId?: string;
};

export default function AIContentGenerationModal({ 
  isOpen, 
  type, 
  currentSubjectId,
  currentSubjectName,
  onClose, 
  onGenerate,
  defaultInput = '',
  defaultSubjectId
}: AIContentGenerationModalProps) {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Reset input when modal opens
  useEffect(() => {
    if (isOpen) {
      setInput(defaultInput);
    }
  }, [isOpen, defaultInput]);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    try {
      // KI erkennt automatisch das Fach
      await onGenerate(input.trim(), currentSubjectId);
      setInput('');
      // ✅ NICHT onClose() aufrufen - Parent entscheidet wann Modal geschlossen wird!
      // Das ermöglicht smooth transition zu Result-Modal oder anderen Flows
    } catch (error) {
      console.error('❌ Fehler bei KI-Generierung:', error);
      // Bei Fehler schließen wir das Modal
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  const typeText = type === 'category' ? 'Kategorie' : 'Thema';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Professional Dark Overlay (wie iOS, WhatsApp, Instagram) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[360px] md:w-[440px] lg:w-[400px] max-w-[90vw] max-h-[85vh] bg-[#141414] border border-white/[0.12] rounded-[16px] md:rounded-[18px] flex flex-col"
          >
            {/* Header with collapsible arrow */}
            <div 
              className="relative flex items-center justify-between px-5 md:px-6 py-4 md:py-[18px] border-b border-white/[0.12] cursor-pointer transition-all rounded-t-[16px] md:rounded-t-[18px]"
              onClick={onClose}
            >
              <p className="relative z-10 font-['Poppins:Medium',sans-serif] text-[13px] md:text-[16px] lg:text-[14px] text-white text-center flex-1 leading-[1.4] lg:leading-[1.2] lg:whitespace-nowrap">
                {typeText} oder Thema fehlt? Mit KI erstellen
              </p>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex items-center justify-center w-[14px] h-[8px] md:w-[15px] md:h-[9px] ml-3 flex-shrink-0"
              >
                <svg className="w-full h-full" fill="none" viewBox="0 0 10 6">
                  <path d="M1 1L5 5L9 1" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
                </svg>
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-5 md:p-6 flex-grow overflow-y-auto">
              {/* Info Text with Icon */}
              <div className="flex items-start gap-2.5 mb-3.5">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-[15px] h-[15px] md:w-[16px] md:h-[16px]" fill="none" viewBox="0 0 14 14">
                    <circle cx="7" cy="7" r="6.5" stroke="white" strokeWidth="1" />
                    <circle cx="7" cy="4.5" r="0.75" fill="white" />
                    <path d="M7 6.5V10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="font-['Poppins:Regular',sans-serif] text-[11.5px] md:text-[12.5px] text-white/70 leading-[1.5]">
                  Schreib, was du lernen möchtest. Die KI prüft bestehende Inhalte und ergänzt automatisch, was fehlt.
                </p>
              </div>

              {/* Lightning Icon + Info */}
              <div className="flex items-start gap-2.5 mb-4">
                <Sparkles className="w-[15px] h-[15px] md:w-[16px] md:h-[16px] text-yellow-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
                <p className="font-['Poppins:Regular',sans-serif] text-[11.5px] md:text-[12.5px] text-white/70 leading-[1.5]">
                  Deine selbst erstellten Lerninhalte erkennst du an diesem Symbol.
                </p>
              </div>

              {/* Textarea */}
              <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.12] rounded-[14px] md:rounded-[15px] mb-3.5 h-[180px] md:h-[190px] flex flex-col p-4 md:p-5 relative"
              >
                <div className="w-full flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Was möchtest du genau lernen... ?"
                    disabled={isGenerating}
                    maxLength={200}
                    className="w-full h-full bg-transparent font-['Poppins:Regular',sans-serif] text-white placeholder:text-white/40 text-left outline-none resize-none leading-[1.5]"
                  />
                </div>
                
                {/* Character Counter */}
                <div className="w-full flex justify-end mt-2">
                  <p className={`font-['Poppins:Regular',sans-serif] text-[11px] md:text-[12px] transition-colors ${
                    input.length >= 200 
                      ? 'text-red-400' 
                      : input.length >= 180 
                        ? 'text-yellow-400' 
                        : 'text-white/50'
                  }`}>
                    {input.length}/200
                  </p>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!input.trim() || isGenerating}
                size="lg"
              >
                {isGenerating ? 'Generiere...' : 'Lerninhalt generieren'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}