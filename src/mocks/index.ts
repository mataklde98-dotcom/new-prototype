// ===== CENTRAL MOCK DATA EXPORTS =====
// Zentrale Export-Datei für alle Mock-Daten

// Flashcards
export {
  MOCK_FLASHCARD_SETS,
  mockPrognosisWeakness,
  mockPrognosisRelevant,
  mockRegularSets
} from './flashcards.mock';

// Todos
export {
  MOCK_TODOS,
  getTodosByDate,
  getTodosForToday,
  getUpcomingTodos
} from './todos.mock';

// Learning Sessions
export {
  MOCK_LEARNING_SESSIONS,
  getSessionsBySetId,
  getRecentSessions,
  getAverageScoreForSet,
  getTotalStudyTime,
  getStudyTimeForDays
} from './sessions.mock';

// User Profile & Streaks
export {
  MOCK_USER_PROFILE,
  MOCK_STUDY_STREAK,
  MOCK_USER_REGISTRATION,
  hasStudiedToday,
  updateUserXP,
  addStudyTime
} from './user.mock';

// User Registration Types
export type { UserRegistrationData } from './user.mock';

// Identity (Onboarding v5)
export {
  MOCK_IDENTITIES,
  generateAnmeldeCode,
  findIdentityByAnmeldeCode,
  findIdentityById,
  persistIdentities,
  upsertIdentity,
} from './identity.mock';

// Familienkonto (Onboarding v5)
export {
  MOCK_FAMILIES,
  persistFamilies,
  findFamilyById,
  findFamilyByParent,
  findFamilyByInviteCode,
  generateFamilyId,
  generateInviteCode,
} from './family.mock';

// Tutors (abgeleitet aus Chat-Räumen)
export { MOCK_TUTORS, formatTutorName } from './tutors.mock';
export type { Tutor } from './tutors.mock';

// Teacher Profiles (erweiterte Tutor-Daten, scoped Meetings & Dokumente)
export {
  getTeacherProfile,
  getTeacherMeetings,
  getTeacherDocuments,
  MOCK_TEACHER_MEETINGS,
  MOCK_SHARED_DOCUMENTS,
} from './teacherProfile.mock';
export type {
  TeacherProfile,
  TeacherMeeting,
  SharedDocument,
} from './teacherProfile.mock';