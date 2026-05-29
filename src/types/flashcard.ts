// ===== FLASHCARD TYPES =====

export interface FlashcardSet {
  id: number;
  userId?: string; // Optional: User-specific data
  subject: string;
  kategorie: string;
  thema: string;
  unterthema: string;
  title: string;
  cardCount: number;
  progress: number;
  createdDate: Date;
  lastOpened?: Date;
  type?: "repeat" | "manual" | "weakness" | "risk" | "knowledge-gap" | "teacher";
  generationNumber?: number;
  isManual?: boolean; // Flag for manually created sets
  cards?: Array<{
    id: string;
    question: string;
    answer: string;
    /** Optional step-by-step explanation shown in the "Lösung"-Popup (learn mode ? button). */
    explanation?: string;
    confidenceScore?: number;
  }>;
}