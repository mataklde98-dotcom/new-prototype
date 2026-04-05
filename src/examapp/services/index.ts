// ==================== EXAM SIMULATION SERVICES ====================
// Central export for all exam simulation services and types

// API Services
export {
  examSimulationAPI,
  generateExam,
  evaluateExam,
  formatAnswersForAPI,
  calculateTimeSpent,
  validateGenerateRequest,
  validateEvaluateRequest,
} from './examSimulationApi';

// Types
export type {
  QuestionType,
  Difficulty,
  GenerateExamRequest,
  GenerateExamQuestion,
  GenerateExamResponse,
  APIGenerateExamResponse,
  EvaluateExamRequest,
  QuestionFeedback,
  EvaluateExamResponse,
  APIEvaluateExamResponse,
  APIError,
  APIConfig,
  ExamState,
} from './examSimulationTypes';

// Mocks
export {
  mockGenerateExam,
  mockEvaluateExam,
  isMockEnabled,
} from '../mocks/examSimulationMocks';
