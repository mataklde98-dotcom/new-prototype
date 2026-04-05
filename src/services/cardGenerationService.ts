import type { FlashcardSet } from '@/types';

// ===== CARD GENERATION SERVICE =====
// Generiert Mock-Karten für Flashcard-Sets
// JETZT: Mock-Generierung basierend auf Set-Metadaten
// SPÄTER: Könnte durch KI-generierte Cards ersetzt werden

export interface FlashcardCard {
  id: string;
  question: string;
  answer: string;
  confidenceScore?: number;
}

/**
 * Generiert Mock-Karten für ein Flashcard-Set
 * @param set - Das Flashcard-Set für das Karten generiert werden sollen
 * @param defaultProgress - Standard-Progress für neue Karten (default: set.progress)
 * @returns Array von generierten Flashcard-Karten
 */
export const generateMockCards = (
  set: FlashcardSet,
  defaultProgress?: number
): FlashcardCard[] => {
  const progress = defaultProgress ?? set.progress;

  return [
    {
      id: `${set.id}-1`,
      question: `Was ist das Hauptthema von "${set.title}"?`,
      answer: `Das Hauptthema behandelt ${set.thema} mit Fokus auf ${set.unterthema}.`,
      confidenceScore: progress,
    },
    {
      id: `${set.id}-2`,
      question: `Nenne einen wichtigen Aspekt von ${set.unterthema}`,
      answer: `Ein wichtiger Aspekt ist die praktische Anwendung im Bereich ${set.kategorie}.`,
      confidenceScore: progress,
    },
    {
      id: `${set.id}-3`,
      question: `Welche Bedeutung hat ${set.unterthema}?`,
      answer: `${set.unterthema} spielt eine zentrale Rolle im Verständnis von ${set.thema}.`,
      confidenceScore: progress,
    },
    {
      id: `${set.id}-4`,
      question: `Wie unterscheidet sich ${set.unterthema} von anderen Konzepten?`,
      answer: `Die Besonderheit liegt in der spezifischen Betrachtungsweise innerhalb von ${set.kategorie}.`,
      confidenceScore: progress,
    },
  ];
};

/**
 * Initialisiert Cards mit confidenceScore falls nicht vorhanden
 * @param cards - Bestehende Cards
 * @param defaultProgress - Standard-Progress als Fallback
 * @returns Cards mit initialisiertem confidenceScore
 */
export const initializeCardsWithScores = (
  cards: FlashcardCard[],
  defaultProgress: number
): FlashcardCard[] => {
  return cards.map((card) => ({
    ...card,
    confidenceScore: card.confidenceScore ?? defaultProgress,
  }));
};

/**
 * Holt oder generiert Cards für ein Set
 * @param set - Das Flashcard-Set
 * @returns Cards (entweder bestehende oder neu generierte)
 */
export const getOrGenerateCards = (set: FlashcardSet): FlashcardCard[] => {
  if (set.cards && set.cards.length > 0) {
    return initializeCardsWithScores(set.cards, set.progress);
  }
  
  return generateMockCards(set);
};
