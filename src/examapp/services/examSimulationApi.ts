// ==================== EXAM SIMULATION API SERVICE ====================
// API-Kommunikation mit dem Backend für Exam Generation & Evaluation
// 100% kompatibel mit AI-Entwickler API-Dokumentation
// ✅ Nutzt Supabase Edge Functions als Proxy zur AI-API

import type {
  GenerateExamRequest,
  GenerateExamResponse,
  EvaluateExamRequest,
  EvaluateExamResponse,
  APIError,
  APIConfig,
  APIGenerateExamResponse,
  APIEvaluateExamResponse,
  GenerateExamQuestion,
  QuestionFeedback,
  QuestionType,
} from './examSimulationTypes';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

// ==================== API CONFIGURATION ====================

// ✅ Supabase Server URL (Hono Server)
const SUPABASE_SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5cb2ed3a`;

const DEFAULT_CONFIG: APIConfig = {
  baseURL: SUPABASE_SERVER_URL, // ✅ Nutzt Hono Server mit Exam Routes
  timeout: 30000, // 30 seconds
  retries: 3,
};

// ==================== API CLIENT ====================

class ExamSimulationAPIClient {
  private config: APIConfig;

  constructor(config: Partial<APIConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Makes an API request with retry logic
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        // Build headers für Supabase Edge Functions
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`, // ✅ Supabase Auth
          ...options.headers as Record<string, string>,
        };

        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData: APIError = await response.json().catch(() => ({
            error: `HTTP Error ${response.status}`,
          }));
          throw new Error(errorData.error || `HTTP Error ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;
        console.error(`API Request failed (attempt ${attempt + 1}/${this.config.retries}):`, error);

        // Don't retry on abort (timeout)
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout');
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.config.retries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || new Error('Unknown error');
  }

  /**
   * Generate Exam API
   * POST /exam-simulation-generate (Supabase Edge Function)
   */
  async generateExam(request: GenerateExamRequest): Promise<GenerateExamResponse> {
    console.log('📤 API: Generate Exam Request:', request);

    // API gibt zurück: { success, message, exam: { metadata, questions, solutions, statistics } }
    const apiResponse = await this.request<APIGenerateExamResponse>('/exam-simulation-generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    console.log('📥 API: Generate Exam RAW Response:', apiResponse);

    // Response Mapping: API-Struktur → Frontend-Struktur
    const frontendResponse = convertAPIGenerateResponse(apiResponse);

    console.log('✅ API: Generate Exam CONVERTED Response:', frontendResponse);
    return frontendResponse;
  }

  /**
   * Evaluate Exam API
   * POST /exam-simulation-evaluate (Supabase Edge Function)
   */
  async evaluateExam(request: EvaluateExamRequest): Promise<EvaluateExamResponse> {
    console.log('📤 API: Evaluate Exam Request:', request);

    // API gibt zurück: { success, message, results: { score, maxScore, percentage, grade, passed, questionResults, summary, analysis } }
    const apiResponse = await this.request<APIEvaluateExamResponse>('/exam-simulation-evaluate', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    console.log('📥 API: Evaluate Exam RAW Response:', apiResponse);

    // Response Mapping: API-Struktur → Frontend-Struktur
    const frontendResponse = convertAPIEvaluateResponse(apiResponse);

    console.log('✅ API: Evaluate Exam CONVERTED Response:', frontendResponse);
    return frontendResponse;
  }
}

// ==================== SINGLETON INSTANCE ====================

export const examSimulationAPI = new ExamSimulationAPIClient();

// ==================== EXPORTED FUNCTIONS ====================

/**
 * Generate a new exam
 */
export const generateExam = async (
  request: GenerateExamRequest
): Promise<GenerateExamResponse> => {
  return examSimulationAPI.generateExam(request);
};

/**
 * Evaluate a completed exam
 */
export const evaluateExam = async (
  request: EvaluateExamRequest
): Promise<EvaluateExamResponse> => {
  return examSimulationAPI.evaluateExam(request);
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Format answers from internal state to API format
 * Converts array format to { questionId: answer } format
 */
export const formatAnswersForAPI = (
  answers: Array<{ answer: number | string | number[]; skipped?: boolean }>,
  questions: { id: string }[]
): { [questionId: string]: number | string } => {
  const formatted: { [questionId: string]: number | string } = {};

  answers.forEach((answerObj, index) => {
    const questionId = questions[index]?.id;
    if (!questionId) return;

    // Skip skipped questions (⚠️ DEFIZIT - API unterstützt noch nicht)
    if (answerObj.skipped) {
      // TODO: Später als null senden wenn API unterstützt
      return;
    }

    // Convert answer to API format
    let apiAnswer: number | string;

    if (Array.isArray(answerObj.answer)) {
      // Multi-select: Convert array to comma-separated string (temporary)
      // TODO: Check with API how to handle multi-select
      apiAnswer = answerObj.answer.join(',');
    } else {
      apiAnswer = answerObj.answer;
    }

    formatted[questionId] = apiAnswer;
  });

  return formatted;
};

/**
 * Calculate time spent in seconds
 */
export const calculateTimeSpent = (startTime: number): number => {
  const now = Date.now();
  return Math.floor((now - startTime) / 1000);
};

/**
 * Validate exam request before sending
 */
export const validateGenerateRequest = (
  request: GenerateExamRequest
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields (laut API-Doku)
  if (!request.userId) errors.push('userId is required');
  if (!request.state) errors.push('state is required');
  if (!request.schoolType) errors.push('schoolType is required');
  if (!request.grade) errors.push('grade is required');
  if (!request.subject) errors.push('subject is required');

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate evaluate request before sending
 */
export const validateEvaluateRequest = (
  request: EvaluateExamRequest
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!request.userId) errors.push('userId is required');
  if (!request.exam?.id) errors.push('exam.id is required');
  if (!request.exam?.questions || request.exam.questions.length === 0) {
    errors.push('exam.questions is required and must not be empty');
  }
  if (!request.answers || Object.keys(request.answers).length === 0) {
    errors.push('answers is required and must not be empty');
  }
  if (typeof request.timeSpent !== 'number' || request.timeSpent < 0) {
    errors.push('timeSpent must be a non-negative number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ==================== RESPONSE CONVERTERS ====================

/**
 * Konvertiert API Question Type zu Frontend Question Type
 * ✅ Laut API-Doku (Screenshot):
 * - API: "multiple_choice" → Frontend: "multipleChoice"
 * - API: "fill_in_blank" → Frontend: "fillInTheBlank"
 * - API: "open_question" → Frontend: "shortAnswer"
 */
const convertQuestionType = (apiType: string): QuestionType => {
  switch (apiType) {
    case 'multiple_choice':
      return 'multipleChoice';
    case 'fill_in_blank':
      return 'fillInTheBlank';
    case 'open_question':  // ⚠️ API nennt es "open_question", nicht "short_answer"
    case 'short_answer':   // Fallback for backwards compatibility
      return 'shortAnswer';
    default:
      console.warn(`Unknown API question type: ${apiType}, defaulting to multipleChoice`);
      return 'multipleChoice';
  }
};

/**
 * Konvertiert API Generate Response → Frontend Response
 * API: { success, message, exam: { metadata, questions, solutions, statistics } }
 * Frontend: { id, questions, totalPoints, timeLimit }
 */
const convertAPIGenerateResponse = (
  apiResponse: APIGenerateExamResponse
): GenerateExamResponse => {
  const { exam } = apiResponse;
  
  // Merge questions with solutions
  const questions: GenerateExamQuestion[] = exam.questions.map((q) => {
    const solution = exam.solutions.find(s => s.questionId === q.id);
    
    return {
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options,
      points: q.points,
      subtopic: q.subtopic,
      correctAnswer: solution?.correctAnswer,
      solution: solution?.explanation,
      topic: exam.metadata.topic,
    };
  });

  return {
    id: exam.metadata.examId,
    questions,
    totalPoints: exam.statistics.totalPoints,
    timeLimit: exam.metadata.examDuration * 60, // minutes → seconds
    difficulty: exam.metadata.difficulty as 'easy' | 'medium' | 'hard',
  };
};

/**
 * Konvertiert API Evaluate Response → Frontend Response
 * API: { success, message, results: { score, maxScore, percentage, grade, passed, questionResults, summary, analysis } }
 * Frontend: { grade, percentage, pointsAchieved, pointsTotal, feedback, overallFeedback, recommendations, strengths, weaknesses }
 */
const convertAPIEvaluateResponse = (
  apiResponse: APIEvaluateExamResponse
): EvaluateExamResponse => {
  const { results } = apiResponse;
  
  // Convert questionResults to feedback
  const feedback: QuestionFeedback[] = results.questionResults.map((qr) => ({
    questionId: qr.questionId,
    isCorrect: qr.correct,
    pointsAwarded: qr.pointsAwarded,
    pointsTotal: qr.maxPoints,
    feedback: qr.feedback,
    correctAnswer: qr.correctAnswer,
  }));

  return {
    grade: results.grade,
    percentage: results.percentage,
    pointsAchieved: results.score,
    pointsTotal: results.maxScore,
    feedback,
    overallFeedback: results.analysis.overallFeedback,
    recommendations: results.analysis.recommendations,
    strengths: results.analysis.strengths,
    weaknesses: results.analysis.weaknesses,
  };
};
