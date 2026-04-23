import type { FlashcardSet } from '@/types';

// ===== CARD GENERATION SERVICE =====
// Generiert Mock-Karten für Flashcard-Sets
// JETZT: Mock-Generierung basierend auf Set-Metadaten
// SPÄTER: Könnte durch KI-generierte Cards ersetzt werden

export interface FlashcardCard {
  id: string;
  question: string;
  answer: string;
  /** Step-by-step explanation shown in the "Lösung"-Popup of the learn mode. */
  explanation?: string;
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
      explanation:
        `Schritt 1: Schau auf den Titel des Sets — "${set.title}".\n` +
        `Schritt 2: Der Titel verrät das übergeordnete Thema, hier "${set.thema}".\n` +
        `Schritt 3: Innerhalb dieses Themas liegt der Fokus auf "${set.unterthema}", ` +
        `weil das Set genau diesen Ausschnitt übt — daher nennt die Antwort beide Ebenen (Thema + Unterthema).`,
      confidenceScore: progress,
    },
    {
      id: `${set.id}-2`,
      question: `Nenne einen wichtigen Aspekt von ${set.unterthema}`,
      answer: `Ein wichtiger Aspekt ist die praktische Anwendung im Bereich ${set.kategorie}.`,
      explanation:
        `Gedankenweg: Ein "wichtiger Aspekt" ist das, was dir im Alltag oder in Aufgaben häufig begegnet.\n` +
        `Bei ${set.unterthema} ist das typischerweise die praktische Anwendung — also die Frage "Wozu brauche ich das konkret?".\n` +
        `Im Schulkontext läuft diese Anwendung meistens über die Kategorie "${set.kategorie}", ` +
        `weil dort die passenden Aufgabenformate geübt werden. Deshalb verbindet die Antwort genau diese beiden Punkte.`,
      confidenceScore: progress,
    },
    {
      id: `${set.id}-3`,
      question: `Welche Bedeutung hat ${set.unterthema}?`,
      answer: `${set.unterthema} spielt eine zentrale Rolle im Verständnis von ${set.thema}.`,
      explanation:
        `Kurz gedacht: "Bedeutung" heißt — wie hängt das Unterthema mit dem großen Ganzen zusammen?\n` +
        `${set.unterthema} ist kein Seitenaspekt, sondern Grundbaustein von ${set.thema}: ohne es fehlt dir die Basis, ` +
        `um die weiteren Inhalte von ${set.thema} zu verstehen oder anzuwenden.\n` +
        `Deshalb nennt die Antwort genau diese "zentrale Rolle" — sie beschreibt die Beziehung beider Begriffe.`,
      confidenceScore: progress,
    },
    {
      id: `${set.id}-4`,
      question: `Wie unterscheidet sich ${set.unterthema} von anderen Konzepten?`,
      answer: `Die Besonderheit liegt in der spezifischen Betrachtungsweise innerhalb von ${set.kategorie}.`,
      explanation:
        `Vorgehen: Unterscheide, indem du die Perspektive vergleichst, aus der das Thema betrachtet wird.\n` +
        `${set.unterthema} bleibt zwar inhaltlich nah an verwandten Konzepten, aber die Methodik aus der Kategorie ` +
        `"${set.kategorie}" fokussiert auf einen ganz bestimmten Blickwinkel — das ist das eigentliche Alleinstellungsmerkmal.\n` +
        `Daher nennt die Antwort nicht den Inhalt, sondern die spezifische Betrachtungsweise als Kernunterschied.`,
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
