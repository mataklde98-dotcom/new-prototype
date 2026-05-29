// ==================== API UTILITY FUNCTIONS ====================
// Mock-Funktionen für API-Calls - später durch echte API-Aufrufe ersetzen

import type {
  StartExamRequest,
  StartExamResponse,
  SaveProgressRequest,
  ResumeExamResponse,
  EvaluateExamRequest,
  EvaluateExamResponse,
  ExamHistoryResponse,
  UserStatisticsResponse,
  ExamSession,
  QuestionTiming,
  Question
} from '../types/api-types';

// ==================== HELPER: Generate unique ID ====================
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ==================== HELPER: Current timestamp ====================
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// ==================== HELPER: Calculate time spent ====================
export const calculateTimeSpent = (startTime: string, endTime?: string): number => {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  return Math.floor((end - start) / 1000); // Seconds
};

// ==================== MOCK: Start Exam ====================
export const mockStartExam = async (request: StartExamRequest): Promise<StartExamResponse> => {
  // Simuliere API-Latenz
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('📡 API Call: POST /api/exam/start', request);
  
  // In der echten Implementierung: Fragen von Backend laden
  // Hier: Return mock data
  return {
    examId: generateId(),
    questions: [], // Wird später von echtem API gefüllt
    timeLimit: 600, // 10 Minuten
    shuffleQuestions: false,
    shuffleChoices: false,
  };
};

// ==================== MOCK: Save Progress ====================
export const mockSaveProgress = async (request: SaveProgressRequest): Promise<void> => {
  console.log('📡 API Call: POST /api/exam/save-progress', request);
  
  // In der echten Implementierung: Progress an Backend senden
  // Hier: Nur logging
  
  await new Promise(resolve => setTimeout(resolve, 200));
};

// ==================== MOCK: Resume Exam ====================
export const mockResumeExam = async (examId: string): Promise<ResumeExamResponse | null> => {
  console.log('📡 API Call: GET /api/exam/resume/' + examId);
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In der echten Implementierung: Gespeicherten Progress laden
  // Hier: Return null (kein gespeicherter Progress)
  return null;
};

// ==================== MOCK: Evaluate Exam ====================
export const mockEvaluateExam = async (request: EvaluateExamRequest): Promise<EvaluateExamResponse> => {
  console.log('📡 API Call: POST /api/exam/evaluate', request);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In der echten Implementierung: KI bewertet alle Antworten
  // Hier: Return mock response
  return {
    examId: request.examId,
    totalPoints: 0,
    achievedPoints: 0,
    grade: 6,
    questionResults: [],
    overallFeedback: 'Mock: API-Integration erforderlich',
    recommendations: [],
    strengths: [],
    weaknesses: [],
  };
};

// ==================== MOCK: Get Exam History ====================
export const mockGetExamHistory = async (userId: string): Promise<ExamHistoryResponse> => {
  console.log('📡 API Call: GET /api/user/' + userId + '/exam-history');
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock-Daten für Demo
  return [
    {
      examId: 'exam-001',
      topicName: 'Grenzwerte von Funktionen',
      date: new Date(Date.now() - 86400000).toISOString(), // Gestern
      score: 7.5,
      grade: 2.0,
      questionsCount: 15,
      timeSpent: 480,
    },
    {
      examId: 'exam-002',
      topicName: 'Kettenregel',
      date: new Date(Date.now() - 172800000).toISOString(), // Vor 2 Tagen
      score: 6.0,
      grade: 3.0,
      questionsCount: 12,
      timeSpent: 420,
    },
  ];
};

// ==================== MOCK: Get User Statistics ====================
export const mockGetUserStatistics = async (userId: string): Promise<UserStatisticsResponse> => {
  console.log('📡 API Call: GET /api/user/' + userId + '/statistics');
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock-Daten für Demo
  return {
    totalExamsCompleted: 12,
    averageGrade: 2.3,
    strongTopics: ['Differentiation', 'Integralrechnung'],
    weakTopics: ['Epsilon-Delta-Kriterium', 'Grenzwertbeweise'],
    improvementTrend: 'up',
    totalTimeSpent: 7200, // 2 Stunden
    totalQuestionsAnswered: 180,
  };
};

// ==================== HELPER: Shuffle array ====================
export const shuffleArray = <T>(array: T[], seed?: string): T[] => {
  const arr = [...array];
  
  if (seed) {
    // Seeded shuffle für reproduzierbare Randomisierung
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }
    
    const random = () => {
      hash = (hash * 9301 + 49297) % 233280;
      return hash / 233280;
    };
    
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } else {
    // Standard Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  return arr;
};

// ==================== HELPER: Shuffle question choices ====================
export const shuffleQuestionChoices = (questions: Question[], seed?: string): Question[] => {
  return questions.map((question, index) => {
    if (!question.choices || question.choices.length === 0) {
      return question;
    }
    
    // Create mapping of old indices to shuffled
    const originalChoices = [...question.choices];
    const shuffledChoices = shuffleArray(question.choices, seed ? `${seed}-q${index}` : undefined);
    
    // Update correctAnswer to match new positions
    let newCorrectAnswer = question.correctAnswer;
    
    if (typeof question.correctAnswer === 'number') {
      const correctChoice = originalChoices[question.correctAnswer];
      newCorrectAnswer = shuffledChoices.indexOf(correctChoice);
    } else if (Array.isArray(question.correctAnswer)) {
      newCorrectAnswer = question.correctAnswer.map(idx => {
        const correctChoice = originalChoices[idx as number];
        return shuffledChoices.indexOf(correctChoice);
      });
    }
    
    return {
      ...question,
      choices: shuffledChoices,
      correctAnswer: newCorrectAnswer,
    };
  });
};
