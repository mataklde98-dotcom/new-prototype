// ===== SHARED TYPE DEFINITIONS =====
// Zentrale Type-Definitionen für die gesamte App

export interface FlashcardCard {
  id: string;
  question: string;
  answer: string;
}

export interface FlashcardSet {
  id: number;
  subject: string;
  kategorie: string;
  thema: string;
  unterthema: string;
  title: string;
  cardCount: number;
  progress: number;
  createdDate: Date;
  lastOpened?: Date | null;
  type?: 'repeat' | 'new' | 'generated';
  cards?: FlashcardCard[];
}

export interface Todo {
  id: number;
  title: string;
  subject: string;
  type: 'nachhilfe' | 'karteikarten' | 'prufung';
  date: Date;
  time?: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
  description?: string;
}

export interface LearningSession {
  id: number;
  flashcardSetId: number;
  date: Date;
  duration: number; // in Sekunden
  cardsStudied: number;
  correctAnswers: number;
  score: number; // Prozent
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Category {
  id: string;
  subjectId: string;
  name: string;
}

export interface Topic {
  id: string;
  categoryId: string;
  name: string;
}

export interface Subtopic {
  id: string;
  topicId: string;
  name: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
  totalStudyTime: number; // in Minuten
  joinedDate: Date;
  
  // Exam Simulation - Profil-Daten für API
  state?: string;        // Bundesland (z.B. "Bayern")
  schoolType?: string;   // Schultyp (z.B. "Gymnasium")
  grade?: string;        // Klassenstufe (z.B. "10")
}

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: Date;
  history: Array<{
    date: Date;
    studied: boolean;
  }>;
}
