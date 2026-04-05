// ==================== API TYPES FÜR BACKEND-INTEGRATION ====================
// Diese Types definieren die Datenstrukturen für die API-Kommunikation

// ==================== ERWEITERTE QUESTION TYPE ====================
export type Question = {
  // Basis-Felder (bereits vorhanden)
  id: string;
  points: number;
  topic: string;
  type?: 'multipleChoice' | 'fillInTheBlank' | 'fillInTheBlankChoice' | 'shortAnswer' | 'multipleChoiceMultiple';
  question: string;
  textBefore?: string;
  textAfter?: string;
  choices?: string[];
  correctAnswer: number | string | number[];
  acceptedAnswers?: string[];
  solution: string;
  
  // Neue API-Felder für erweiterte Funktionalität
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  imageUrl?: string;
  imagePosition?: 'before' | 'after' | 'inline';
  imageCaption?: string;
  estimatedTimeSeconds?: number;
  source?: string;
  createdAt?: string;
  lastModified?: string;
  version?: number;
};

// ==================== EXAM CONFIGURATION ====================
export type ExamConfiguration = {
  showResultsAtEnd: boolean;          // Ergebnisse nur am Ende zeigen
  allowSkipping: boolean;             // Fragen überspringen erlauben
  allowReview: boolean;               // Review am Ende erlauben
  allowBack: boolean;                 // Zurück-Navigation erlauben
  showTimer: boolean;                 // Timer anzeigen
  timeWarningMinutes?: number;        // Warnung bei X Minuten Rest
  pauseAllowed: boolean;              // Pause-Funktion erlauben
  calculatorAllowed: boolean;         // Taschenrechner erlauben
  notesAllowed: boolean;              // Notizen erlauben
};

// ==================== EXAM SESSION ====================
export type ExamSession = {
  examId: string;                     // Eindeutige Prüfungs-ID
  userId: string;                     // Nutzer-ID
  startTime: string;                  // ISO timestamp
  endTime?: string;                   // ISO timestamp (wenn beendet)
  topicId: string;                    // Gewähltes Thema
  topicName: string;                  // Themenname
  subtopicIds: string[];              // Gewählte Unterthemen
  subtopicNames: string[];            // Unterthemen-Namen
  totalQuestions: number;             // Anzahl der Fragen
  timeLimit: number;                  // Zeitlimit in Sekunden
  mode: 'immediate' | 'endOnly';      // Feedback-Modus
  status: 'inProgress' | 'completed' | 'abandoned';
  configuration: ExamConfiguration;   // Prüfungskonfiguration
};

// ==================== QUESTION TIMING ====================
export type QuestionTiming = {
  questionId: string;                 // Fragen-ID
  questionIndex: number;              // Index in der Fragenliste
  timeSpentSeconds: number;           // Gesamtzeit bei dieser Frage
  firstVisitedAt: string;             // ISO timestamp - erstes Öffnen
  lastAnsweredAt?: string;            // ISO timestamp - letzte Antwort
  revisitCount: number;               // Wie oft zurückgegangen
};

// ==================== EXAM ATTEMPT ====================
export type ExamAttempt = {
  attemptNumber: number;              // Aktueller Versuch (1, 2, 3, ...)
  previousAttempts: Array<{
    examId: string;
    date: string;
    score: number;
    grade: number;
    topicName: string;
  }>;
  allowRetry: boolean;                // Wiederholen erlaubt?
  maxAttempts?: number;               // Maximale Versuche (null = unbegrenzt)
};

// ==================== QUESTION RESULT (von KI-API) ====================
export type QuestionResult = {
  questionId: string;
  maxPoints: number;
  awardedPoints: number;              // Kann Teilpunkte sein!
  isFullyCorrect: boolean;
  isPartiallyCorrect?: boolean;       // Teilweise richtig
  feedback: string;                   // KI-generiertes Feedback
  correctAnswer?: string | number | number[];
};

// ==================== EXAM HISTORY ====================
export type ExamHistory = {
  examId: string;
  topicName: string;
  date: string;                       // ISO timestamp
  score: number;                      // Erreichte Punkte
  grade: number;                      // Note (1-6)
  questionsCount: number;
  timeSpent: number;                  // In Sekunden
};

// ==================== USER STATISTICS ====================
export type UserStatistics = {
  totalExamsCompleted: number;
  averageGrade: number;
  strongTopics: string[];             // Themen wo User gut ist
  weakTopics: string[];               // Themen die geübt werden sollten
  improvementTrend: 'up' | 'down' | 'stable';
  totalTimeSpent: number;             // Gesamtzeit in Sekunden
  totalQuestionsAnswered: number;
};

// ==================== API REQUEST/RESPONSE TYPES ====================

// POST /api/exam/start
export type StartExamRequest = {
  userId: string;
  topicId: string;
  subtopicIds?: string[];
  configuration: ExamConfiguration;
};

export type StartExamResponse = {
  examId: string;
  questions: Question[];
  timeLimit: number;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  seed?: string;                      // Für reproduzierbare Randomisierung
};

// POST /api/exam/save-progress
export type SaveProgressRequest = {
  examId: string;
  currentQuestionIndex: number;
  answers: Array<{
    answer: number | string | number[];
    skipped?: boolean;
  }>;
  remainingTime: number;
  visitedQuestions: number[];
  questionTimings: QuestionTiming[];
  timestamp: string;
};

// GET /api/exam/resume/{examId}
export type ResumeExamResponse = {
  examSession: ExamSession;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Array<{
    answer: number | string | number[];
    skipped?: boolean;
  }>;
  remainingTime: number;
  visitedQuestions: number[];
  questionTimings: QuestionTiming[];
};

// POST /api/exam/evaluate
export type EvaluateExamRequest = {
  examId: string;
  userId: string;
  answers: Array<{
    questionId: string;
    questionType?: string;
    points: number;
    topic: string;
    questionText: string;
    answerChoices?: string[] | null;
    userAnswer: number | string | number[];
    wasSkipped: boolean;
    timeSpent: number;
    attemptNumber: number;
  }>;
  totalTimeSpent: number;
  questionTimings: QuestionTiming[];
};

export type EvaluateExamResponse = {
  examId: string;
  totalPoints: number;
  achievedPoints: number;
  grade: number;                      // 1-6
  questionResults: QuestionResult[];
  overallFeedback: string;            // KI-generiertes Gesamtfeedback
  recommendations: string[];          // Was sollte geübt werden?
  strengths: string[];                // Was lief gut?
  weaknesses: string[];               // Was sollte verbessert werden?
};

// GET /api/user/{userId}/exam-history
export type ExamHistoryResponse = ExamHistory[];

// GET /api/user/{userId}/statistics
export type UserStatisticsResponse = UserStatistics;
