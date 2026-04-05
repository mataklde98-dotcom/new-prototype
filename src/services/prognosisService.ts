import type { FlashcardSet } from '@/types';
import { mockPrognosisWeakness, mockPrognosisRelevant, mockPrognosisKnowledgeGaps } from '@/mocks/flashcards.mock';

// ===== PROGNOSIS SERVICE =====
// Zentrale Service-Schicht für alle Prognosis-API-Calls
// JETZT: Nutzt Mock-Daten (werden beim App-Start sofort geladen)
// SPÄTER: Ersetze Mock-Aufrufe durch echte API-Calls zur Prognosis-API
// 
// Die API wird später Flashcard-Sets mit folgender Struktur zurückgeben:
// - subject, kategorie, thema, unterthema (für Filterung)
// - type: 'weakness', 'risk', oder 'knowledge-gap'

export const prognosisService = {
  /**
   * Holt alle erkannten Schwächen (Flashcard-Sets mit niedrigem Progress)
   * SPÄTER: GET /api/prognosis/weaknesses
   */
  getWeaknesses: async (): Promise<FlashcardSet[]> => {
    return [...mockPrognosisWeakness];
  },

  /**
   * Holt alle relevanten Themen basierend auf Lernverlauf
   * SPÄTER: GET /api/prognosis/relevant-topics
   */
  getRelevantTopics: async (): Promise<FlashcardSet[]> => {
    return [...mockPrognosisRelevant];
  },

  /**
   * Holt alle KI-erkannten Wissenslücken
   * SPÄTER: GET /api/prognosis/knowledge-gaps
   */
  getKnowledgeGaps: async (): Promise<FlashcardSet[]> => {
    return [...mockPrognosisKnowledgeGaps];
  },

  /**
   * Holt alle Prognosis-Daten gleichzeitig
   * SPÄTER: GET /api/prognosis/all
   */
  getAllPrognosisData: async (): Promise<{
    weaknesses: FlashcardSet[];
    relevantTopics: FlashcardSet[];
    knowledgeGaps: FlashcardSet[];
  }> => {
    return {
      weaknesses: [...mockPrognosisWeakness],
      relevantTopics: [...mockPrognosisRelevant],
      knowledgeGaps: [...mockPrognosisKnowledgeGaps]
    };
  }
};