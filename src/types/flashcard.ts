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
    confidenceScore?: number;
  }>;
}