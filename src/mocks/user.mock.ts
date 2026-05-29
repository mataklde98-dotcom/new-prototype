import type { UserProfile, StudyStreak } from '@/types';

// ===== USER PROFILE MOCK DATA =====
// Vollständige Mock-Daten für User Profile

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'user-1',
  name: 'Max Mustermann',
  email: 'max.mustermann@sostudy.app',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  level: 12,
  xp: 3450,
  streak: 7,
  totalStudyTime: 18720, // 312 Stunden in Minuten
  joinedDate: new Date('2025-09-15'),
  
  // Exam Simulation - Profil-Daten
  state: 'Bayern',
  schoolType: 'Gymnasium',
  grade: '10'
};

// ===== USER REGISTRATION DATA (für Exam Simulation API) =====
// Diese Daten werden später bei der Registrierung vom User gewählt
// und bei jedem Exam-Simulation-API-Call mitgeschickt

export interface UserRegistrationData {
  userId: string;
  state: string;        // Bundesland
  schoolType: string;   // Schultyp
  grade: string;        // Klassenstufe
}

export const MOCK_USER_REGISTRATION: UserRegistrationData = {
  userId: 'mock-user-001',
  state: 'Bayern',
  schoolType: 'Gymnasium',
  grade: '10'
};

// ===== STUDY STREAK MOCK DATA =====
// Vollständige Mock-Daten für Study Streaks

export const MOCK_STUDY_STREAK: StudyStreak = {
  currentStreak: 7,
  longestStreak: 14,
  lastStudyDate: new Date(),
  history: [
    // Letzte 30 Tage
    { date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), studied: false },
    { date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), studied: false },
    { date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000), studied: false },
    { date: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000), studied: false },
    { date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000), studied: false },
    { date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), studied: true },
    { date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000), studied: true }
  ]
};

// Helper function to check if studied today
export const hasStudiedToday = (): boolean => {
  const today = new Date();
  const todayEntry = MOCK_STUDY_STREAK.history.find(entry => {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getFullYear() === today.getFullYear() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getDate() === today.getDate()
    );
  });
  return todayEntry?.studied ?? false;
};

// Helper function to update user XP
export const updateUserXP = (xpToAdd: number): UserProfile => {
  const newXP = MOCK_USER_PROFILE.xp + xpToAdd;
  const newLevel = Math.floor(newXP / 300) + 1; // Level up every 300 XP
  
  return {
    ...MOCK_USER_PROFILE,
    xp: newXP,
    level: newLevel
  };
};

// Helper function to add study time
export const addStudyTime = (minutes: number): UserProfile => {
  return {
    ...MOCK_USER_PROFILE,
    totalStudyTime: MOCK_USER_PROFILE.totalStudyTime + minutes
  };
};
