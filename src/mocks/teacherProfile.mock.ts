// ===== TEACHER PROFILE MOCK DATA =====
// Erweiterte Lehrer-Daten, teacher-scoped Meetings & Dokumente
// Designed for easy API swap via useTeacherProfileData hook

import { MOCK_TUTORS } from './tutors.mock';

// ===== TYPES =====
export interface TeacherProfile {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  subjects: string[];
  rating: number;         // 1-5
  experienceYears: number;
  bio: string;
  totalLessons: number;   // Gesamtanzahl der Stunden mit diesem Schüler
}

export interface TeacherMeeting {
  id: string;
  teacherId: string;
  subject: string;
  topicTitle: string;
  lessonType: '1on1' | 'group';
  startAt: string;   // ISO date
  endAt: string;      // ISO date
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  studentsCount?: number;
}

export interface SharedDocument {
  id: string;
  teacherId: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'image';
  fileSize: string;     // z.B. "2.4 MB"
  uploadDate: string;   // ISO date
  sentBy: 'teacher' | 'student';
  subject: string;
}

// ===== EXTENDED TEACHER DATA =====
// Maps MOCK_TUTORS IDs to richer profile info
const TEACHER_EXTENSIONS: Record<string, Omit<TeacherProfile, 'id' | 'name' | 'avatar' | 'isOnline'>> = {
  '1': {
    subjects: ['Physik', 'Mathematik', 'Chemie'],
    rating: 4.8,
    experienceYears: 12,
    bio: 'Spezialisiert auf Mechanik und Quantenphysik. Promoviert an der TU München.',
    totalLessons: 34,
  },
  '2': {
    subjects: ['Mathematik', 'Physik'],
    rating: 4.9,
    experienceYears: 18,
    bio: 'Professor für angewandte Mathematik. Schwerpunkt: Analysis und lineare Algebra.',
    totalLessons: 52,
  },
  '3': {
    subjects: ['Deutsch', 'Geschichte'],
    rating: 4.6,
    experienceYears: 8,
    bio: 'Germanistin mit Schwerpunkt auf Textanalyse und kreativem Schreiben.',
    totalLessons: 28,
  },
  '4': {
    subjects: ['Englisch'],
    rating: 4.7,
    experienceYears: 10,
    bio: 'Native-Level Englisch. Zertifizierte Cambridge-Prüferin.',
    totalLessons: 41,
  },
  '5': {
    subjects: ['Chemie', 'Biologie'],
    rating: 4.5,
    experienceYears: 6,
    bio: 'Chemiker mit Laborerfahrung. Macht komplexe Formeln verständlich.',
    totalLessons: 19,
  },
};

/**
 * Gibt das vollständige TeacherProfile für einen Tutor zurück.
 */
export function getTeacherProfile(teacherId: string): TeacherProfile | null {
  const tutor = MOCK_TUTORS.find(t => t.id === teacherId);
  if (!tutor) return null;

  const ext = TEACHER_EXTENSIONS[teacherId] || {
    subjects: ['Allgemein'],
    rating: 4.0,
    experienceYears: 3,
    bio: '',
    totalLessons: 5,
  };

  return {
    id: tutor.id,
    name: tutor.name,
    avatar: tutor.avatar,
    isOnline: tutor.isOnline,
    ...ext,
  };
}

// ===== TEACHER-SCOPED MEETINGS =====
const now = new Date();
const day = 24 * 60 * 60 * 1000;

function isoDate(offset: number, hour: number, min = 0): string {
  const d = new Date(now.getTime() + offset);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

export const MOCK_TEACHER_MEETINGS: TeacherMeeting[] = [
  // ---- Teacher 1 (Dr. Schmidt – Physik) ----
  { id: 'tm1', teacherId: '1', subject: 'Physik', topicTitle: 'Newtonsche Gesetze', lessonType: '1on1', startAt: isoDate(2 * day, 15), endAt: isoDate(2 * day, 16), status: 'scheduled' },
  { id: 'tm2', teacherId: '1', subject: 'Physik', topicTitle: 'Kinematik Übungen', lessonType: '1on1', startAt: isoDate(6 * day, 14), endAt: isoDate(6 * day, 15), status: 'scheduled' },
  { id: 'tm3', teacherId: '1', subject: 'Physik', topicTitle: 'Optik Grundlagen', lessonType: '1on1', startAt: isoDate(-3 * day, 16), endAt: isoDate(-3 * day, 17), status: 'ended' },
  { id: 'tm4', teacherId: '1', subject: 'Physik', topicTitle: 'Wellentheorie', lessonType: '1on1', startAt: isoDate(-7 * day, 15), endAt: isoDate(-7 * day, 16), status: 'ended' },

  // ---- Teacher 2 (Prof. Müller – Mathematik) ----
  { id: 'tm5', teacherId: '2', subject: 'Mathematik', topicTitle: 'Integralrechnung', lessonType: '1on1', startAt: isoDate(1 * day, 16), endAt: isoDate(1 * day, 17), status: 'scheduled' },
  { id: 'tm6', teacherId: '2', subject: 'Mathematik', topicTitle: 'Analysis Klausurvorbereitung', lessonType: 'group', startAt: isoDate(4 * day, 10), endAt: isoDate(4 * day, 11, 30), status: 'scheduled', studentsCount: 4 },
  { id: 'tm7', teacherId: '2', subject: 'Mathematik', topicTitle: 'Quadratische Gleichungen', lessonType: '1on1', startAt: isoDate(-2 * day, 16), endAt: isoDate(-2 * day, 17), status: 'ended' },
  { id: 'tm8', teacherId: '2', subject: 'Mathematik', topicTitle: 'Lineare Gleichungssysteme', lessonType: '1on1', startAt: isoDate(-5 * day, 16), endAt: isoDate(-5 * day, 17), status: 'ended' },
  { id: 'tm9', teacherId: '2', subject: 'Physik', topicTitle: 'Vektorrechnung in der Physik', lessonType: '1on1', startAt: isoDate(-9 * day, 14), endAt: isoDate(-9 * day, 15), status: 'ended' },

  // ---- Teacher 3 (Dr. Weber – Deutsch) ----
  { id: 'tm10', teacherId: '3', subject: 'Deutsch', topicTitle: 'Gedichtanalyse Romantik', lessonType: '1on1', startAt: isoDate(3 * day, 11), endAt: isoDate(3 * day, 12), status: 'scheduled' },
  { id: 'tm11', teacherId: '3', subject: 'Deutsch', topicTitle: 'Erörterung schreiben', lessonType: '1on1', startAt: isoDate(-4 * day, 11), endAt: isoDate(-4 * day, 12), status: 'ended' },
  { id: 'tm12', teacherId: '3', subject: 'Geschichte', topicTitle: 'Weimarer Republik', lessonType: 'group', startAt: isoDate(-10 * day, 10), endAt: isoDate(-10 * day, 11, 30), status: 'ended', studentsCount: 3 },

  // ---- Teacher 4 (Fr. Hoffmann – Englisch) ----
  { id: 'tm13', teacherId: '4', subject: 'Englisch', topicTitle: 'Conditional Sentences', lessonType: '1on1', startAt: isoDate(1 * day, 14), endAt: isoDate(1 * day, 15), status: 'scheduled' },
  { id: 'tm14', teacherId: '4', subject: 'Englisch', topicTitle: 'Essay Writing B2', lessonType: '1on1', startAt: isoDate(-1 * day, 14), endAt: isoDate(-1 * day, 15), status: 'ended' },
  { id: 'tm15', teacherId: '4', subject: 'Englisch', topicTitle: 'Reading Comprehension', lessonType: '1on1', startAt: isoDate(-6 * day, 15), endAt: isoDate(-6 * day, 16), status: 'cancelled' },

  // ---- Teacher 5 (Hr. Becker – Chemie) ----
  // No upcoming meetings → triggers empty state
  { id: 'tm16', teacherId: '5', subject: 'Chemie', topicTitle: 'Stöchiometrie', lessonType: '1on1', startAt: isoDate(-8 * day, 15), endAt: isoDate(-8 * day, 16), status: 'ended' },
];

// ===== SHARED DOCUMENTS =====
export const MOCK_SHARED_DOCUMENTS: SharedDocument[] = [
  // Teacher 1 (Dr. Schmidt)
  { id: 'doc1', teacherId: '1', fileName: 'Physik_Zusammenfassung_Optik.pdf', fileType: 'pdf', fileSize: '2.4 MB', uploadDate: isoDate(-3 * day, 17), sentBy: 'teacher', subject: 'Physik' },
  { id: 'doc2', teacherId: '1', fileName: 'Übungsblatt_Mechanik.pdf', fileType: 'pdf', fileSize: '1.1 MB', uploadDate: isoDate(-7 * day, 16), sentBy: 'teacher', subject: 'Physik' },
  { id: 'doc3', teacherId: '1', fileName: 'Meine_Notizen_Wellenlehre.docx', fileType: 'docx', fileSize: '340 KB', uploadDate: isoDate(-5 * day, 20), sentBy: 'student', subject: 'Physik' },

  // Teacher 2 (Prof. Müller)
  { id: 'doc4', teacherId: '2', fileName: 'Analysis_Formelsammlung.pdf', fileType: 'pdf', fileSize: '3.8 MB', uploadDate: isoDate(-2 * day, 17), sentBy: 'teacher', subject: 'Mathematik' },
  { id: 'doc5', teacherId: '2', fileName: 'Klausur_Mathe_Musterlösung.pdf', fileType: 'pdf', fileSize: '1.5 MB', uploadDate: isoDate(-5 * day, 17), sentBy: 'teacher', subject: 'Mathematik' },
  { id: 'doc6', teacherId: '2', fileName: 'Hausaufgabe_Integrale.docx', fileType: 'docx', fileSize: '280 KB', uploadDate: isoDate(-4 * day, 19), sentBy: 'student', subject: 'Mathematik' },
  { id: 'doc7', teacherId: '2', fileName: 'Mathe_Präsentation.pptx', fileType: 'pptx', fileSize: '5.2 MB', uploadDate: isoDate(-9 * day, 15), sentBy: 'student', subject: 'Mathematik' },

  // Teacher 3 (Dr. Weber)
  { id: 'doc8', teacherId: '3', fileName: 'Gedichtanalyse_Vorlage.pdf', fileType: 'pdf', fileSize: '890 KB', uploadDate: isoDate(-4 * day, 12), sentBy: 'teacher', subject: 'Deutsch' },
  { id: 'doc9', teacherId: '3', fileName: 'Mein_Erörterungsaufsatz.docx', fileType: 'docx', fileSize: '210 KB', uploadDate: isoDate(-4 * day, 18), sentBy: 'student', subject: 'Deutsch' },

  // Teacher 4 (Fr. Hoffmann)
  { id: 'doc10', teacherId: '4', fileName: 'English_Grammar_B2.pdf', fileType: 'pdf', fileSize: '1.8 MB', uploadDate: isoDate(-1 * day, 15), sentBy: 'teacher', subject: 'Englisch' },

  // Teacher 5 (Hr. Becker) — empty → triggers empty state
];

/**
 * Gibt alle Meetings für einen bestimmten Lehrer zurück,
 * aufgeteilt in upcoming und past.
 */
export function getTeacherMeetings(teacherId: string) {
  const now = new Date();
  const meetings = MOCK_TEACHER_MEETINGS.filter(m => m.teacherId === teacherId);

  const upcoming = meetings
    .filter(m => m.status === 'scheduled' || m.status === 'live')
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

  const past = meetings
    .filter(m => m.status === 'ended' || m.status === 'cancelled')
    .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());

  return { upcoming, past };
}

/**
 * Gibt alle geteilten Dokumente für einen bestimmten Lehrer zurück.
 */
export function getTeacherDocuments(teacherId: string): SharedDocument[] {
  return MOCK_SHARED_DOCUMENTS
    .filter(d => d.teacherId === teacherId)
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
}