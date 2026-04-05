import type { UserProfile, StudyStreak } from '@/types';
import { MOCK_USER_PROFILE, MOCK_STUDY_STREAK, MOCK_USER_REGISTRATION } from '@/mocks';
import type { UserRegistrationData } from '@/mocks/user.mock';
import { getCurrentUserId } from '@/lib/auth'; // ✅ Import current user ID helper

// ===== USER SERVICE =====
// Zentrale Service-Schicht für alle User-API-Calls
// JETZT: Nutzt Mock-Daten (simuliert API)
// SPÄTER: Ersetze Mock-Aufrufe durch echte API-Calls (Supabase Auth + Profile)

// Simuliere API-Delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  /**
   * Holt das User-Profil
   */
  getProfile: async (): Promise<UserProfile> => {
    await delay(200);
    return { ...MOCK_USER_PROFILE };
  },

  /**
   * Aktualisiert das User-Profil
   */
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    await delay(300);
    Object.assign(MOCK_USER_PROFILE, data);
    return { ...MOCK_USER_PROFILE };
  },

  /**
   * Aktualisiert User XP
   */
  updateXP: async (xpToAdd: number): Promise<UserProfile> => {
    await delay(150);
    const newXP = MOCK_USER_PROFILE.xp + xpToAdd;
    const newLevel = Math.floor(newXP / 300) + 1; // Level up every 300 XP
    
    MOCK_USER_PROFILE.xp = newXP;
    MOCK_USER_PROFILE.level = newLevel;
    
    return { ...MOCK_USER_PROFILE };
  },

  /**
   * Fügt Lernzeit hinzu
   */
  addStudyTime: async (minutes: number): Promise<UserProfile> => {
    await delay(150);
    MOCK_USER_PROFILE.totalStudyTime += minutes;
    return { ...MOCK_USER_PROFILE };
  },

  /**
   * Holt Study Streak
   */
  getStreak: async (): Promise<StudyStreak> => {
    await delay(200);
    return { ...MOCK_STUDY_STREAK };
  },

  /**
   * Aktualisiert Study Streak
   */
  updateStreak: async (): Promise<StudyStreak> => {
    await delay(200);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if already studied today
    const todayEntry = MOCK_STUDY_STREAK.history.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    if (!todayEntry) {
      // Add today's entry
      MOCK_STUDY_STREAK.history.unshift({
        date: new Date(),
        studied: true
      });
      
      // Update current streak
      MOCK_STUDY_STREAK.currentStreak++;
      
      // Update longest streak if needed
      if (MOCK_STUDY_STREAK.currentStreak > MOCK_STUDY_STREAK.longestStreak) {
        MOCK_STUDY_STREAK.longestStreak = MOCK_STUDY_STREAK.currentStreak;
      }
      
      MOCK_STUDY_STREAK.lastStudyDate = new Date();
    } else if (!todayEntry.studied) {
      // Mark today as studied
      todayEntry.studied = true;
      MOCK_STUDY_STREAK.lastStudyDate = new Date();
    }

    return { ...MOCK_STUDY_STREAK };
  },

  /**
   * Prüft ob heute gelernt wurde
   */
  hasStudiedToday: async (): Promise<boolean> => {
    await delay(100);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEntry = MOCK_STUDY_STREAK.history.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
    
    return todayEntry?.studied ?? false;
  },

  /**
   * Holt Streak-Statistiken
   */
  getStreakStats: async (): Promise<{
    currentStreak: number;
    longestStreak: number;
    studiedDaysThisMonth: number;
    studiedDaysTotal: number;
  }> => {
    await delay(200);
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    
    const studiedDaysThisMonth = MOCK_STUDY_STREAK.history.filter(entry => {
      const entryDate = new Date(entry.date);
      return (
        entry.studied &&
        entryDate.getMonth() === thisMonth &&
        entryDate.getFullYear() === thisYear
      );
    }).length;
    
    const studiedDaysTotal = MOCK_STUDY_STREAK.history.filter(entry => entry.studied).length;

    return {
      currentStreak: MOCK_STUDY_STREAK.currentStreak,
      longestStreak: MOCK_STUDY_STREAK.longestStreak,
      studiedDaysThisMonth,
      studiedDaysTotal
    };
  },

  /**
   * Holt User-Level-Informationen
   */
  getLevelInfo: async (): Promise<{
    currentLevel: number;
    currentXP: number;
    xpForNextLevel: number;
    xpNeeded: number;
    progress: number;
  }> => {
    await delay(150);
    const xpPerLevel = 300;
    const currentLevel = MOCK_USER_PROFILE.level;
    const currentXP = MOCK_USER_PROFILE.xp;
    const xpForCurrentLevel = (currentLevel - 1) * xpPerLevel;
    const xpForNextLevel = currentLevel * xpPerLevel;
    const xpInCurrentLevel = currentXP - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - currentXP;
    const progress = Math.round((xpInCurrentLevel / xpPerLevel) * 100);

    return {
      currentLevel,
      currentXP,
      xpForNextLevel,
      xpNeeded,
      progress
    };
  },

  /**
   * Berechnet Lernstatistiken
   */
  getStudyStats: async (): Promise<{
    totalStudyTime: number; // in Minuten
    totalStudyTimeFormatted: string;
    averageStudyTimePerDay: number; // in Minuten
    studyDaysTotal: number;
    studySessionsTotal: number;
  }> => {
    await delay(200);
    const totalStudyTime = MOCK_USER_PROFILE.totalStudyTime;
    const studyDaysTotal = MOCK_STUDY_STREAK.history.filter(entry => entry.studied).length;
    
    const hours = Math.floor(totalStudyTime / 60);
    const minutes = totalStudyTime % 60;
    const totalStudyTimeFormatted = `${hours}h ${minutes}m`;
    
    const averageStudyTimePerDay = studyDaysTotal > 0 
      ? Math.round(totalStudyTime / studyDaysTotal)
      : 0;

    // Anzahl Sessions (würde normalerweise von sessionService kommen)
    // Für Mock nutzen wir eine Schätzung basierend auf Lernzeit
    const studySessionsTotal = Math.floor(totalStudyTime / 25); // ~25 Min pro Session

    return {
      totalStudyTime,
      totalStudyTimeFormatted,
      averageStudyTimePerDay,
      studyDaysTotal,
      studySessionsTotal
    };
  },

  /**
   * ===== USER REGISTRATION DATA =====
   * Holt die Registrierungsdaten des Users (Bundesland, Schultyp, Klassenstufe)
   * Diese Daten werden bei Exam Simulation API-Calls mitgeschickt
   * 
   * JETZT: Nutzt Mock-Daten (simuliert Profil)
   * SPÄTER: Holt echte Daten aus Backend/Supabase (User-Profil-Tabelle)
   */
  getRegistrationData: (): UserRegistrationData => {
    // ✅ FIX: Use current user ID instead of hardcoded mock ID
    const currentUserId = getCurrentUserId();
    return { 
      ...MOCK_USER_REGISTRATION,
      userId: currentUserId // ✅ Override with current user ID!
    };
  },

  /**
   * Aktualisiert die Registrierungsdaten des Users
   * SPÄTER: POST /api/user/profile mit Update
   */
  updateRegistrationData: async (data: Partial<UserRegistrationData>): Promise<UserRegistrationData> => {
    await delay(300);
    Object.assign(MOCK_USER_REGISTRATION, data);
    return { ...MOCK_USER_REGISTRATION };
  }
};
