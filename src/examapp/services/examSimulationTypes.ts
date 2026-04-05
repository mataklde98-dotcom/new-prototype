// ==================== EXAM SIMULATION API TYPES ====================
// Diese Types sind 100% kompatibel mit der AI-Entwickler API-Dokumentation
// Unterschied zu /app/types/api-types.ts: Diese sind für die EXTERNE AI-API
// api-types.ts sind für interne Datenstrukturen

// ==================== QUESTION TYPES ====================
// ⚠️ API unterstützt nur 3 Types (laut Doku):
// - multiple_choice (40%) → "multipleChoice"
// - fill_in_blank (30%) → "fillInTheBlank" 
// - open_question (30%) → "shortAnswer"

export type QuestionType = 
  | 'multipleChoice'              // Single-Select (API: multiple_choice)
  | 'fillInTheBlank'              // Fill-in-the-blank (API: fill_in_blank)
  | 'shortAnswer';                // Open question (API: open_question)

// 🔮 FUTURE: Weitere Types wenn API erweitert wird
// | 'multipleChoiceMultiple'      // Multi-Select mit Checkboxen
// | 'fillInTheBlankChoice'        // Lückentext mit Dropdown

export type Difficulty = 'easy' | 'medium' | 'hard';

// ==================== GENERATE EXAM API ====================

export interface GenerateExamRequest {
  // Required fields (laut API-Doku)
  userId: string;                 // Frontend sends
  state: string;                  // Frontend sends (aus UserProfile, z.B. "Bayern")
  schoolType: string;             // Frontend sends (aus UserProfile, z.B. "Gymnasium")
  grade: string;                  // Frontend sends (aus UserProfile, z.B. "10")
  subject: string;                // Frontend sends (e.g., "Mathematik")
  
  // Optional fields (laut API-Doku)
  competencyArea?: string;        // Frontend sends (optional, z.B. "Algebra")
  topic?: string;                 // Frontend sends (optional, z.B. "Quadratische Gleichungen")
  numberOfQuestions?: number;     // Frontend sends (optional, default: 20)
  examDuration?: number;          // Frontend sends (optional, default: 45 minutes)
  difficulty?: Difficulty;        // Frontend sends (optional, "easy", "medium", "hard", "mixed")
  
  // ⚠️ REMOVED: subtopics - API unterstützt es NICHT laut Doku
  // 🔮 FUTURE: Wenn API erweitert wird, hier wieder hinzufügen
}

export interface GenerateExamQuestion {
  id: string;                     // Question ID (z.B. "q1", "q2", ...)
  type: string;                   // Question Type (API nutzt eigene 3 Types)
  question: string;               // Question text
  options?: string[];             // Choices (für multiple_choice)
  points: number;                 // Max points für diese Frage
  
  // Unterthema-Felder
  topic?: string;                 // Unterthema der Frage (z.B. "Bewegung", "Schlaf")
  subtopic?: string;              // Alias für topic (Wird später hinzugefügt)
  
  // Interne Felder (für Frontend Rendering)
  correctAnswer?: number | string | number[]; // Temporär für Client-Side Preview
  solution?: string;              // Lösung/Erklärung
  textBefore?: string;            // Für fillInTheBlankChoice
  textAfter?: string;             // Für fillInTheBlankChoice
  acceptedAnswers?: string[];     // Für fillInTheBlank/shortAnswer
}

// ==================== API RAW RESPONSE (direkt von API) ====================

export interface APIGenerateExamResponse {
  success: boolean;
  message: string;
  exam: {
    metadata: {
      examId: string;
      subject: string;
      topic: string;
      competencyArea?: string;
      state: string;
      schoolType: string;
      grade: string;
      numberOfQuestions: number;
      examDuration: number;  // in minutes
      difficulty: string;
      generatedAt: string;   // ISO timestamp
    };
    questions: Array<{
      id: string;
      type: string;  // API nutzt 3 Types: "multiple_choice", "fill_in_blank", "short_answer"
      question: string;
      options?: string[];
      points: number;
      subtopic?: string;
    }>;
    solutions: Array<{
      questionId: string;
      correctAnswer: any;
      explanation: string;
    }>;
    statistics: {
      totalPoints: number;
      estimatedDuration: number;  // in minutes
      byType: {                   // ✅ AKTUALISIERT laut API-Doku
        multipleChoice: number;   // Anzahl Multiple Choice Fragen
        fillInBlanks: number;     // Anzahl Fill-in-Blank Fragen (API: fillInBlanks)
        openQuestions: number;    // Anzahl Open Questions (API: openQuestions)
      };
      byDifficulty: {             // ✅ AKTUALISIERT laut API-Doku
        easy: number;
        medium: number;
        hard: number;
      };
    };
  };
}

// ==================== FRONTEND RESPONSE (nach Konvertierung) ====================

export interface GenerateExamResponse {
  id: string;                     // Exam ID
  questions: GenerateExamQuestion[]; // Array of questions (mit Frontend-Types)
  
  // Optional metadata
  totalPoints?: number;           // Gesamtpunktzahl
  timeLimit?: number;             // Time limit in seconds
  difficulty?: Difficulty;        // Overall difficulty
}

// ==================== EVALUATE EXAM API ====================

export interface EvaluateExamRequest {
  userId: string;                 // Frontend sends
  exam: {
    id: string;                   // Exam ID from Generate Response
    questions: GenerateExamQuestion[]; // Komplettes Questions Array
  };
  answers: {
    [questionId: string]: number | string; // ✅ Format PERFEKT!
    // Beispiele:
    // "q1": 2                   (multiple choice - index)
    // "q2": "Berlin"            (fill in blank - text)
    // "q3": "Long answer..."    (short answer - text)
  };
  timeSpent: number;              // Total time in seconds (Frontend berechnet)
}

export interface QuestionFeedback {
  questionId: string;             // Question ID
  isCorrect: boolean;             // Correct or not
  pointsAwarded: number;          // Points awarded (kann Teilpunkte sein)
  pointsTotal: number;            // Max points
  feedback: string;               // AI-generated feedback
  correctAnswer?: string | number | number[]; // Correct answer (optional)
}

// ==================== API RAW RESPONSE (direkt von API) ====================

export interface APIEvaluateExamResponse {
  success: boolean;
  message: string;
  results: {
    score: number;              // Points achieved
    maxScore: number;           // Total points possible
    percentage: number;         // Percentage (0-100)
    grade: number;              // Note (1.0 - 6.0)
    passed: boolean;            // Whether exam passed
    questionResults: Array<{
      questionId: string;
      correct: boolean;
      pointsAwarded: number;
      maxPoints: number;
      userAnswer: any;
      correctAnswer: any;
      feedback: string;
    }>;
    summary: {
      totalQuestions: number;
      correctAnswers: number;
      partiallyCorrect: number;
      incorrect: number;
      timeSpent: number;        // in seconds
    };
    analysis: {
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
      overallFeedback: string;
    };
  };
}

// ==================== FRONTEND RESPONSE (nach Konvertierung) ====================

export interface EvaluateExamResponse {
  grade: number;                  // Note (1.0 - 6.0, z.B. 2.3)
  percentage: number;             // Percentage (0-100)
  pointsAchieved: number;         // Total points achieved
  pointsTotal: number;            // Total points possible
  feedback: QuestionFeedback[];   // Feedback per question
  
  // Optional fields
  overallFeedback?: string;       // Overall AI feedback
  recommendations?: string[];     // Recommendations for improvement
  strengths?: string[];           // What went well
  weaknesses?: string[];          // What needs work
}

// ==================== ERROR RESPONSES ====================

export interface APIError {
  error: string;                  // Error message
  code?: string;                  // Error code
  details?: any;                  // Additional details
}

// ==================== INTERNAL TYPES (Frontend State) ====================

export interface ExamState {
  examId: string;                 // Current exam ID
  questions: GenerateExamQuestion[]; // Questions
  currentQuestionIndex: number;   // Current question index
  answers: {
    [questionId: string]: number | string; // User answers
  };
  startTime: number;              // Timestamp when exam started
  timeSpent: number;              // Total time spent (seconds)
  status: 'generating' | 'inProgress' | 'evaluating' | 'completed' | 'error';
}

// ==================== API CONFIGURATION ====================

export interface APIConfig {
  baseURL: string;                // API base URL
  timeout: number;                // Request timeout (ms)
  retries: number;                // Number of retries on failure
}