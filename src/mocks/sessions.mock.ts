import type { LearningSession } from '@/types';

// ===== LEARNING SESSIONS MOCK DATA =====
// Vollständige Mock-Daten für Learning Sessions

export const MOCK_LEARNING_SESSIONS: LearningSession[] = [
  // Heutige Sessions
  {
    id: 1,
    flashcardSetId: 5, // Mendelsche Regeln
    date: new Date(Date.now() - 30 * 60 * 1000), // vor 30 Minuten
    duration: 1800, // 30 Minuten
    cardsStudied: 25,
    correctAnswers: 22,
    score: 88
  },
  {
    id: 2,
    flashcardSetId: 1, // Mitochondrien
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // vor 2 Stunden
    duration: 1200, // 20 Minuten
    cardsStudied: 15,
    correctAnswers: 12,
    score: 80
  },
  {
    id: 3,
    flashcardSetId: 14, // Gleichförmige Bewegung
    date: new Date(Date.now() - 3 * 60 * 60 * 1000), // vor 3 Stunden
    duration: 900, // 15 Minuten
    cardsStudied: 10,
    correctAnswers: 9,
    score: 90
  },
  
  // Gestern
  {
    id: 4,
    flashcardSetId: 12, // DNA-Replikation
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000),
    duration: 2100, // 35 Minuten
    cardsStudied: 30,
    correctAnswers: 24,
    score: 80
  },
  {
    id: 5,
    flashcardSetId: 3, // Mitochondrien Genetik
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000),
    duration: 1500, // 25 Minuten
    cardsStudied: 20,
    correctAnswers: 18,
    score: 90
  },
  
  // Vor 2 Tagen
  {
    id: 6,
    flashcardSetId: 8, // B2 Academic Vocabulary
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000),
    duration: 1800, // 30 Minuten
    cardsStudied: 25,
    correctAnswers: 23,
    score: 92
  },
  {
    id: 7,
    flashcardSetId: 25, // Present Perfect
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000),
    duration: 1200, // 20 Minuten
    cardsStudied: 18,
    correctAnswers: 16,
    score: 89
  },
  
  // Vor 3 Tagen
  {
    id: 8,
    flashcardSetId: 4, // Chloroplasten
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000),
    duration: 2400, // 40 Minuten
    cardsStudied: 35,
    correctAnswers: 32,
    score: 91
  },
  {
    id: 9,
    flashcardSetId: 18, // Ableitungsregeln
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 7 * 60 * 60 * 1000),
    duration: 1800, // 30 Minuten
    cardsStudied: 22,
    correctAnswers: 19,
    score: 86
  },
  
  // Vor 4 Tagen
  {
    id: 10,
    flashcardSetId: 6, // Lineare Gleichungen
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000),
    duration: 1500, // 25 Minuten
    cardsStudied: 18,
    correctAnswers: 17,
    score: 94
  },
  {
    id: 11,
    flashcardSetId: 15, // Newtonsche Gesetze
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000),
    duration: 1800, // 30 Minuten
    cardsStudied: 20,
    correctAnswers: 17,
    score: 85
  },
  
  // Vor 5 Tagen
  {
    id: 12,
    flashcardSetId: 15, // Newtonsche Gesetze
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000),
    duration: 1200, // 20 Minuten
    cardsStudied: 15,
    correctAnswers: 12,
    score: 80
  },
  {
    id: 13,
    flashcardSetId: 7, // Unregelmäßige Verben
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000),
    duration: 2100, // 35 Minuten
    cardsStudied: 30,
    correctAnswers: 26,
    score: 87
  },
  
  // Vor 6 Tagen
  {
    id: 14,
    flashcardSetId: 23, // Romantik
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000),
    duration: 1800, // 30 Minuten
    cardsStudied: 25,
    correctAnswers: 21,
    score: 84
  },
  {
    id: 15,
    flashcardSetId: 11, // Waldökosystem
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 - 7 * 60 * 60 * 1000),
    duration: 900, // 15 Minuten
    cardsStudied: 12,
    correctAnswers: 11,
    score: 92
  },
  
  // Vor 7 Tagen
  {
    id: 16,
    flashcardSetId: 1, // Mitochondrien
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000),
    duration: 1500, // 25 Minuten
    cardsStudied: 20,
    correctAnswers: 16,
    score: 80
  },
  {
    id: 17,
    flashcardSetId: 9, // Zweiter Weltkrieg
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000),
    duration: 2400, // 40 Minuten
    cardsStudied: 30,
    correctAnswers: 27,
    score: 90
  },
  
  // Vor 8 Tagen
  {
    id: 18,
    flashcardSetId: 11, // Waldökosystem
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000),
    duration: 1200, // 20 Minuten
    cardsStudied: 15,
    correctAnswers: 13,
    score: 87
  },
  {
    id: 19,
    flashcardSetId: 17, // Pythagoras
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000),
    duration: 1800, // 30 Minuten
    cardsStudied: 24,
    correctAnswers: 22,
    score: 92
  },
  
  // Vor 9 Tagen
  {
    id: 20,
    flashcardSetId: 16, // Ohmsches Gesetz
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000),
    duration: 1500, // 25 Minuten
    cardsStudied: 20,
    correctAnswers: 17,
    score: 85
  },
  {
    id: 21,
    flashcardSetId: 14, // Gleichförmige Bewegung
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 - 7 * 60 * 60 * 1000),
    duration: 900, // 15 Minuten
    cardsStudied: 12,
    correctAnswers: 10,
    score: 83
  },
  
  // Vor 10 Tagen
  {
    id: 22,
    flashcardSetId: 4, // Chloroplasten
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000),
    duration: 2100, // 35 Minuten
    cardsStudied: 28,
    correctAnswers: 25,
    score: 89
  },
  {
    id: 23,
    flashcardSetId: 20, // pH-Wert
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000),
    duration: 1800, // 30 Minuten
    cardsStudied: 25,
    correctAnswers: 21,
    score: 84
  }
];

// Helper function to get sessions for a specific flashcard set
export const getSessionsBySetId = (setId: number): LearningSession[] => {
  return MOCK_LEARNING_SESSIONS
    .filter(session => session.flashcardSetId === setId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Helper function to get recent sessions
export const getRecentSessions = (limit: number = 10): LearningSession[] => {
  return [...MOCK_LEARNING_SESSIONS]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);
};

// Helper function to calculate average score for a set
export const getAverageScoreForSet = (setId: number): number => {
  const sessions = getSessionsBySetId(setId);
  if (sessions.length === 0) return 0;
  
  const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
  return Math.round(totalScore / sessions.length);
};

// Helper function to get total study time
export const getTotalStudyTime = (): number => {
  return MOCK_LEARNING_SESSIONS.reduce((sum, session) => sum + session.duration, 0);
};

// Helper function to get study time for last N days
export const getStudyTimeForDays = (days: number = 7): number => {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return MOCK_LEARNING_SESSIONS
    .filter(session => session.date >= cutoffDate)
    .reduce((sum, session) => sum + session.duration, 0);
};
