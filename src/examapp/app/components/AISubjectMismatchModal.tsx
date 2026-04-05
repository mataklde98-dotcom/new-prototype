import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import Button from '@/app/components/Button';

/**
 * 🚨 SUBJECT MISMATCH MODAL
 * 
 * Erscheint wenn die AI erkennt, dass die Eingabe besser zu einem anderen Fach passt.
 * 
 * BEISPIEL:
 * - User wählt: "Mathematik"
 * - User tippt: "Groß- und Kleinschreibung"
 * - AI erkennt: Das passt zu "Deutsch"
 * - Modal fragt: "Willst du zu Deutsch wechseln?"
 * 
 * API INTEGRATION:
 * Die echte API macht semantische Analyse und erkennt Fach-Mismatch.
 */

type SubjectMismatchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userInput: string;
  currentSubject: {
    id: string;
    name: string;
  };
  detectedSubject: {
    id: string;
    name: string;
  };
  onSwitchSubject: () => void;
  onContinueWithExplanation: (explanation: string) => void;
};

export default function AISubjectMismatchModal({
  isOpen,
  onClose,
  userInput,
  currentSubject,
  detectedSubject,
  onSwitchSubject,
  onContinueWithExplanation
}: SubjectMismatchModalProps) {
  const [showExplanationField, setShowExplanationField] = useState(false);
  const [explanation, setExplanation] = useState('');

  // ✅ RESET State wenn Modal geschlossen wird
  const handleClose = () => {
    setShowExplanationField(false);
    setExplanation('');
    onClose();
  };

  if (!isOpen) return null;

  const handleSwitchSubject = () => {
    setShowExplanationField(false);
    setExplanation('');
    onSwitchSubject();
    onClose();
  };

  const handleContinue = () => {
    if (showExplanationField) {
      // User will bei aktuellem Fach bleiben und hat erklärt
      onContinueWithExplanation(explanation.trim());
      setShowExplanationField(false);
      setExplanation('');
      onClose();
    } else {
      // Zeige Erklärungsfeld
      setShowExplanationField(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-white/[0.12] rounded-[20px] w-full max-w-[480px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#009379]/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#009379]" strokeWidth={2.5} />
            </div>
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white">
              Fach-Überprüfung
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#979797]" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* User Input Display */}
          <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.12] rounded-[12px] p-3">
            <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797] uppercase tracking-wide mb-2">
              Deine Eingabe
            </p>
            <p className="font-['Poppins:Medium',sans-serif] text-[15px] text-white">
              "{userInput}"
            </p>
          </div>

          {/* Warning Message */}
          <div className="space-y-3">
            <p className="font-['Poppins:Medium',sans-serif] text-[15px] text-white leading-relaxed">
              Deine Eingabe scheint besser zu <span className="text-[#009379] font-['Poppins:SemiBold',sans-serif]">{detectedSubject.name}</span> zu passen.
            </p>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#b8b8b8] leading-relaxed">
              Möchtest du die Lerninhalte für <span className="text-white font-['Poppins:Medium',sans-serif]">{detectedSubject.name}</span> erstellen oder mit <span className="text-white font-['Poppins:Medium',sans-serif]">{currentSubject.name}</span> fortfahren?
            </p>
          </div>

          {/* Explanation Input */}
          {showExplanationField && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <label className="block">
                <span className="font-['Poppins:Medium',sans-serif] text-[14px] text-white mb-1 block">
                  Wie passt deine Eingabe zu {currentSubject.name}?
                </span>
                <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#979797] block mb-3">
                  Diese Information hilft der KI, passende Inhalte zu erstellen.
                </span>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Z.B. 'Ich möchte mathematische Textaufgaben mit Grammatik kombinieren'"
                  className="w-full h-[100px] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.12] rounded-[8px] px-4 py-3 font-['Poppins:Regular',sans-serif] text-[14px] text-white placeholder:text-white/40 focus:border-[#009379] focus:outline-none resize-none"
                />
              </label>
            </motion.div>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-white/[0.08] flex gap-3">
          {/* Switch to Detected Subject */}
          <Button
            fullWidth={false}
            className="flex-1"
            onClick={handleSwitchSubject}
          >
            Wechseln
          </Button>

          {/* Continue with Current Subject */}
          <Button
            fullWidth={false}
            className="flex-1"
            onClick={handleContinue}
            disabled={showExplanationField && !explanation.trim()}
          >
            {showExplanationField ? 'Fortfahren' : 'Bleiben'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Named export für bessere Kompatibilität
export { AISubjectMismatchModal };