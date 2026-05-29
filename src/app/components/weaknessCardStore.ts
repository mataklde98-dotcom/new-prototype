// ===== SHARED WEAKNESS CARD STORE =====
// Single source of truth for per-weakness-card state: linked flashcard sets, progress, exam grades.
// Used by all weakness/gap/risk/recommendation cards across the platform.
// Follows the same reactive store pattern as teacherTasksStore.

type Listener = () => void;

const STORAGE_KEY = 'weaknessCards_v1';

export interface WeaknessCardState {
  /** Unique key: `${source}::${subject}::${topic}` */
  id: string;
  linkedFlashcardSetId: string | null;
  flashcardSetProgress: number; // 0-100
}

function loadCards(): Record<string, WeaknessCardState> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return {};
}

let cards: Record<string, WeaknessCardState> = loadCards();
const listeners = new Set<Listener>();

function notify() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  listeners.forEach(fn => fn());
}

/** Generate a deterministic card key from source context */
export function getWeaknessCardId(source: string, subject: string, topic: string): string {
  return `${source}::${subject}::${topic}`;
}

/** KI-determined card count based on severity */
export function getKICardCount(severity: string): number {
  if (severity === 'critical' || severity === 'high') return 25;
  if (severity === 'warning' || severity === 'medium') return 20;
  return 15;
}

/** KI-determined exam duration (minutes) based on severity */
export function getKIExamDuration(severity: string): number {
  if (severity === 'critical' || severity === 'high') return 30;
  if (severity === 'warning' || severity === 'medium') return 25;
  return 15;
}

export const weaknessCardStore = {
  // ── Read ──
  getCard(id: string): WeaknessCardState | undefined {
    return cards[id];
  },

  getOrCreate(id: string): WeaknessCardState {
    if (!cards[id]) {
      cards[id] = {
        id,
        linkedFlashcardSetId: null,
        flashcardSetProgress: 0,
      };
      notify();
    }
    return cards[id];
  },

  // ── Write ──

  /** Link a newly-generated flashcard set to this card */
  linkFlashcardSet(cardId: string, setId: string) {
    const card = weaknessCardStore.getOrCreate(cardId);
    cards[cardId] = { ...card, linkedFlashcardSetId: setId, flashcardSetProgress: 0 };
    notify();
  },

  /** Update flashcard progress for a linked set (called from any set progress update) */
  updateFlashcardProgress(linkedSetId: string, progress: number) {
    let changed = false;
    for (const key of Object.keys(cards)) {
      if (cards[key].linkedFlashcardSetId === linkedSetId) {
        cards[key] = { ...cards[key], flashcardSetProgress: Math.min(100, Math.max(0, Math.round(progress))) };
        changed = true;
      }
    }
    if (changed) notify();
  },

  /** Set at 100% → unlink so next click creates a new set */
  resetForNewSet(cardId: string) {
    const card = cards[cardId];
    if (card) {
      cards[cardId] = { ...card, linkedFlashcardSetId: null, flashcardSetProgress: 0 };
      notify();
    }
  },

  /** Clean up all cards pointing to a specific set ID (e.g. set was deleted) */
  unlinkBySetId(setId: string) {
    let changed = false;
    for (const key of Object.keys(cards)) {
      if (cards[key].linkedFlashcardSetId === setId) {
        cards[key] = { ...cards[key], linkedFlashcardSetId: null, flashcardSetProgress: 0 };
        changed = true;
      }
    }
    if (changed) notify();
  },

  // ── Subscribe ──
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Get a snapshot of all cards (for React useSyncExternalStore) */
  getSnapshot(): Record<string, WeaknessCardState> {
    return cards;
  },
};