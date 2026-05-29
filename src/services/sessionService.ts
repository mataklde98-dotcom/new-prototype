import type { LearningSession } from '@/types';
import { MOCK_LEARNING_SESSIONS } from '@/mocks';

// ===== SESSION SERVICE =====
// Zentrale Service-Schicht für alle Learning Session API-Calls
// JETZT: Nutzt Mock-Daten (simuliert API)
// SPÄTER: Ersetze Mock-Aufrufe durch echte API-Calls

// Simuliere API-Delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sessionService = {
  /**
   * Holt alle Learning Sessions
   */
  getAllSessions: async (): Promise<LearningSession[]> => {
    await delay(250);
    return [...MOCK_LEARNING_SESSIONS];
  },

  /**
   * Holt eine einzelne Session anhand der ID
   */
  getSessionById: async (id: number): Promise<LearningSession | null> => {
    await delay(150);
    const session = MOCK_LEARNING_SESSIONS.find(s => s.id === id);
    return session ? { ...session } : null;
  },

  /**
   * Erstellt eine neue Learning Session
   */
  createSession: async (data: Omit<LearningSession, 'id'>): Promise<LearningSession> => {
    await delay(300);
    const newSession: LearningSession = {
      id: Date.now(),
      ...data
    };
    MOCK_LEARNING_SESSIONS.push(newSession);
    return newSession;
  },

  /**
   * Aktualisiert eine bestehende Session
   */
  updateSession: async (id: number, data: Partial<LearningSession>): Promise<LearningSession | null> => {
    await delay(250);
    const index = MOCK_LEARNING_SESSIONS.findIndex(s => s.id === id);
    if (index === -1) return null;

    MOCK_LEARNING_SESSIONS[index] = {
      ...MOCK_LEARNING_SESSIONS[index],
      ...data
    };
    
    return { ...MOCK_LEARNING_SESSIONS[index] };
  },

  /**
   * Löscht eine Session
   */
  deleteSession: async (id: number): Promise<{ success: boolean; deletedId: number }> => {
    await delay(250);
    const index = MOCK_LEARNING_SESSIONS.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Session with id ${id} not found`);
    }

    MOCK_LEARNING_SESSIONS.splice(index, 1);
    return { success: true, deletedId: id };
  },

  /**
   * Holt Sessions für ein bestimmtes Flashcard-Set
   */
  getSessionsBySetId: async (setId: number): Promise<LearningSession[]> => {
    await delay(200);
    return MOCK_LEARNING_SESSIONS
      .filter(session => session.flashcardSetId === setId)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(session => ({ ...session }));
  },

  /**
   * Holt kürzliche Sessions
   */
  getRecentSessions: async (limit: number = 10): Promise<LearningSession[]> => {
    await delay(200);
    return [...MOCK_LEARNING_SESSIONS]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit)
      .map(session => ({ ...session }));
  },

  /**
   * Holt Sessions für heute
   */
  getSessionsForToday: async (): Promise<LearningSession[]> => {
    await delay(200);
    const today = new Date();
    return MOCK_LEARNING_SESSIONS
      .filter(session => {
        const sessionDate = new Date(session.date);
        return (
          sessionDate.getFullYear() === today.getFullYear() &&
          sessionDate.getMonth() === today.getMonth() &&
          sessionDate.getDate() === today.getDate()
        );
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(session => ({ ...session }));
  },

  /**
   * Holt Sessions für ein bestimmtes Datum
   */
  getSessionsByDate: async (date: Date): Promise<LearningSession[]> => {
    await delay(200);
    return MOCK_LEARNING_SESSIONS
      .filter(session => {
        const sessionDate = new Date(session.date);
        return (
          sessionDate.getFullYear() === date.getFullYear() &&
          sessionDate.getMonth() === date.getMonth() &&
          sessionDate.getDate() === date.getDate()
        );
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(session => ({ ...session }));
  },

  /**
   * Berechnet durchschnittlichen Score für ein Set
   */
  getAverageScoreForSet: async (setId: number): Promise<number> => {
    await delay(150);
    const sessions = MOCK_LEARNING_SESSIONS.filter(s => s.flashcardSetId === setId);
    if (sessions.length === 0) return 0;
    
    const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
    return Math.round(totalScore / sessions.length);
  },

  /**
   * Berechnet Gesamtlernzeit
   */
  getTotalStudyTime: async (): Promise<number> => {
    await delay(150);
    return MOCK_LEARNING_SESSIONS.reduce((sum, session) => sum + session.duration, 0);
  },

  /**
   * Berechnet Lernzeit für die letzten N Tage
   */
  getStudyTimeForDays: async (days: number = 7): Promise<number> => {
    await delay(200);
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return MOCK_LEARNING_SESSIONS
      .filter(session => session.date >= cutoffDate)
      .reduce((sum, session) => sum + session.duration, 0);
  },

  /**
   * Berechnet durchschnittliche Lernzeit pro Tag
   */
  getAverageStudyTimePerDay: async (days: number = 7): Promise<number> => {
    await delay(200);
    const totalTime = await sessionService.getStudyTimeForDays(days);
    return Math.round(totalTime / days);
  },

  /**
   * Holt Statistiken für ein Set
   */
  getSetStatistics: async (setId: number): Promise<{
    totalSessions: number;
    totalTime: number;
    averageScore: number;
    totalCardsStudied: number;
    totalCorrectAnswers: number;
    lastSessionDate: Date | null;
  }> => {
    await delay(200);
    const sessions = MOCK_LEARNING_SESSIONS.filter(s => s.flashcardSetId === setId);
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalTime: 0,
        averageScore: 0,
        totalCardsStudied: 0,
        totalCorrectAnswers: 0,
        lastSessionDate: null
      };
    }

    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
    const totalCardsStudied = sessions.reduce((sum, s) => sum + s.cardsStudied, 0);
    const totalCorrectAnswers = sessions.reduce((sum, s) => sum + s.correctAnswers, 0);
    const lastSessionDate = new Date(Math.max(...sessions.map(s => s.date.getTime())));

    return {
      totalSessions: sessions.length,
      totalTime,
      averageScore: Math.round(totalScore / sessions.length),
      totalCardsStudied,
      totalCorrectAnswers,
      lastSessionDate
    };
  },

  /**
   * Holt Lernfortschritt über Zeit (für Charts)
   */
  getProgressOverTime: async (days: number = 30): Promise<Array<{
    date: Date;
    sessionsCount: number;
    totalTime: number;
    averageScore: number;
  }>> => {
    await delay(250);
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const sessions = MOCK_LEARNING_SESSIONS.filter(s => s.date >= cutoffDate);

    // Gruppiere nach Datum
    const grouped = new Map<string, LearningSession[]>();
    sessions.forEach(session => {
      const dateKey = session.date.toISOString().split('T')[0];
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(session);
    });

    // Berechne Statistiken pro Tag
    const result: Array<{
      date: Date;
      sessionsCount: number;
      totalTime: number;
      averageScore: number;
    }> = [];

    grouped.forEach((daySessions, dateKey) => {
      const totalTime = daySessions.reduce((sum, s) => sum + s.duration, 0);
      const totalScore = daySessions.reduce((sum, s) => sum + s.score, 0);
      
      result.push({
        date: new Date(dateKey),
        sessionsCount: daySessions.length,
        totalTime,
        averageScore: Math.round(totalScore / daySessions.length)
      });
    });

    return result.sort((a, b) => a.date.getTime() - b.date.getTime());
  },

  /**
   * Holt Streak-Informationen
   */
  getStudyStreak: async (): Promise<{
    currentStreak: number;
    longestStreak: number;
  }> => {
    await delay(200);
    
    // Sortiere Sessions nach Datum
    const sortedSessions = [...MOCK_LEARNING_SESSIONS].sort((a, b) => 
      b.date.getTime() - a.date.getTime()
    );

    if (sortedSessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Berechne Current Streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const uniqueDates = new Set<string>();
    sortedSessions.forEach(session => {
      const dateStr = new Date(session.date).toISOString().split('T')[0];
      uniqueDates.add(dateStr);
    });

    const sortedDates = Array.from(uniqueDates)
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);
      
      const currentDate = new Date(sortedDates[i]);
      currentDate.setHours(0, 0, 0, 0);
      
      if (currentDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Berechne Longest Streak
    let longestStreak = 0;
    let tempStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      
      const diffDays = Math.floor(
        (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }
};
