// ===== WEAKNESS ACTION BUTTONS =====
// Reusable buttons for weakness/gap/risk/recommendation cards.
// Handles KI-locked card count/exam duration, button text lifecycle,
// grade badges, and progress display.

import { useSyncExternalStore, useEffect } from 'react';
import { Layers, ClipboardCheck, Play } from 'lucide-react';
import {
  weaknessCardStore,
  getWeaknessCardId,
  getKICardCount,
  getKIExamDuration,
  type WeaknessCardState,
} from './weaknessCardStore';
import type { FlashcardSet } from '@/types/flashcard';

interface WeaknessActionButtonsProps {
  source: 'weakness' | 'risk' | 'knowledge-gap' | 'recommendation';
  subject: string;
  topic: string;
  severity: string;
  recommendation: string;
  /** Show both buttons (default) or only one */
  showFlashcards?: boolean;
  showExam?: boolean;
  onGenerate: (ctx: any) => void;
  onStartExam: (ctx: any) => void;
  onOpenLinkedFlashcardSet?: (setId: string) => void;
  /** All available flashcard sets — needed to validate link existence */
  allSets?: FlashcardSet[];
  /** Optional: className for the wrapper */
  className?: string;
}

export default function WeaknessActionButtons({
  source,
  subject,
  topic,
  severity,
  recommendation,
  showFlashcards = true,
  showExam = true,
  onGenerate,
  onStartExam,
  onOpenLinkedFlashcardSet,
  allSets,
  className = '',
}: WeaknessActionButtonsProps) {
  // Subscribe to store changes
  const cards = useSyncExternalStore(
    weaknessCardStore.subscribe,
    weaknessCardStore.getSnapshot,
  );
  const cardId = getWeaknessCardId(source, subject, topic);
  const card: WeaknessCardState | undefined = cards[cardId];

  const kiCardCount = getKICardCount(severity);
  const kiExamDuration = getKIExamDuration(severity);

  // Validate: does the linked set still exist in allSets?
  // If allSets is undefined, we trust the store (backwards compat).
  // If allSets is an array, we check existence.
  const linkedSetId = card?.linkedFlashcardSetId ?? null;
  const linkedSetExists = linkedSetId != null && (
    allSets === undefined ||
    allSets.some((s) => String(s.id) === String(linkedSetId))
  );
  const hasLinkedSet = linkedSetExists;
  const progress = hasLinkedSet ? (card?.flashcardSetProgress ?? 0) : 0;
  const setComplete = hasLinkedSet && progress >= 100;

  // Self-heal: if store claims a link but the set is gone, clean up the orphaned link.
  // This ensures the next render shows "Karteikarten erstellen" again.
  useEffect(() => {
    if (linkedSetId != null && allSets !== undefined && !linkedSetExists) {
      weaknessCardStore.unlinkBySetId(String(linkedSetId));
    }
  }, [linkedSetId, linkedSetExists, allSets]);

  let flashcardButtonText = 'Karteikarten erstellen';
  let flashcardIcon = <Layers className="w-3 h-3" />;
  if (hasLinkedSet && !setComplete) {
    flashcardButtonText = 'Karteikarten fortsetzen';
    flashcardIcon = <Play className="w-3 h-3" />;
  } else if (setComplete) {
    flashcardButtonText = 'Neue Karteikarten erstellen';
    flashcardIcon = <Layers className="w-3 h-3" />;
  }

  // Button text logic for Prüfung
  const examButtonText = 'Prüfung starten';

  const handleFlashcardClick = () => {
    if (hasLinkedSet && !setComplete) {
      // Open linked set directly
      onOpenLinkedFlashcardSet?.(card!.linkedFlashcardSetId!);
    } else {
      if (setComplete) {
        // Reset for new set, then open generation
        weaknessCardStore.resetForNewSet(cardId);
      }
      // Open generation with KI-locked count
      onGenerate({
        topic,
        subject,
        severity,
        recommendation,
        source,
        cardCount: kiCardCount,
      });
    }
  };

  const handleExamClick = () => {
    onStartExam({
      topic,
      subject,
      severity,
      recommendation,
      source,
      examDurationMinutes: kiExamDuration,
    });
  };

  const btnStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: 'rgba(255,255,255,0.75)',
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Grade badge for completed exam */}
      {/* REMOVED: Grades are NEVER shown on weakness/gap/risk/recommendation cards */}

      <div className="flex gap-2">
        {showFlashcards && (
          <button
            onClick={handleFlashcardClick}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[10px] transition-all active:scale-[0.97]"
            style={btnStyle}
          >
            {flashcardIcon}
            {flashcardButtonText}
          </button>
        )}
        {showExam && (
          <button
            onClick={handleExamClick}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[10px] transition-all active:scale-[0.97]"
            style={btnStyle}
          >
            <ClipboardCheck className="w-3 h-3" />
            {examButtonText}
          </button>
        )}
      </div>
    </div>
  );
}