// ==================== EXAM SIMULATION MOCK DATA ====================
// Mock-Daten für Development und Testing
// Simuliert die AI-API Responses

import type {
  GenerateExamRequest,
  GenerateExamResponse,
  EvaluateExamRequest,
  EvaluateExamResponse,
  GenerateExamQuestion,
  QuestionFeedback,
} from '../services/examSimulationTypes';

// ==================== MOCK CONFIGURATION ====================

const MOCK_ENABLED = import.meta.env.VITE_USE_MOCK_EXAM_API === 'true' || true; // ⚠️ MOCKS AKTIV - API URL (api.sostudyai.com) ist nicht erreichbar!
const MOCK_DELAY_MS = 500; // Simulate API delay (reduziert für bessere UX)

// ==================== MOCK QUESTIONS DATABASE ====================

const MOCK_QUESTIONS_POOL: GenerateExamQuestion[] = [
  {
    id: 'q1',
    type: 'multipleChoice',
    points: 0.5,
    topic: 'Bewegung',
    question: 'Wie wirkt sich regelmäßige körperliche Bewegung auf die geistige Gesundheit aus?',
    options: [
      'Sie hat keine Auswirkung',
      'Sie verschlechtert die Stimmung',
      'Sie verbessert die mentale Gesundheit',
      'Sie erhöht nur das Stresslevel'
    ],
    correctAnswer: 2,
    solution: 'Regelmäßige körperliche Bewegung hat nachweislich positive Auswirkungen auf die geistige Gesundheit. Sie setzt Endorphine frei, die als natürliche Stimmungsaufheller wirken, reduziert Stress und Angstzustände und verbessert die allgemeine mentale Gesundheit.'
  },
  {
    id: 'q2',
    type: 'multipleChoice',
    points: 1.0,
    topic: 'Schlaf',
    question: 'Welche langfristigen gesundheitlichen Auswirkungen kann chronischer Schlafmangel haben?',
    options: [
      'Nur leichte Müdigkeit am Tag',
      'Erhöhtes Risiko für Herz-Kreislauf-Erkrankungen, Diabetes, geschwächtes Immunsystem',
      'Verbesserte Konzentration',
      'Keine nennenswerten Auswirkungen auf die Gesundheit'
    ],
    correctAnswer: 1,
    solution: 'Chronischer Schlafmangel hat weitreichende negative Auswirkungen auf die Gesundheit. Das Immunsystem wird geschwächt, der Stoffwechsel beeinträchtigt, und das Risiko für Herz-Kreislauf-Erkrankungen steigt erheblich.'
  },
  {
    id: 'q3',
    type: 'multipleChoice',
    points: 0.5,
    topic: 'Stress',
    question: 'Welche Methode hat sich als besonders wirksam zur nachhaltigen Stressreduktion erwiesen?',
    options: [
      'Erhöhter Kaffeekonsum',
      'Regelmäßige Meditation und Atemübungen',
      'Schlafzeit reduzieren',
      'Permanente Social-Media-Nutzung'
    ],
    correctAnswer: 1,
    solution: 'Meditation und Atemübungen sind wissenschaftlich fundierte Methoden zur Stressreduktion. Sie aktivieren das parasympathische Nervensystem und senken nachweislich den Cortisol-Spiegel.'
  },
  {
    id: 'q4',
    type: 'fillInTheBlank',
    points: 1.0,
    topic: 'Bewegung',
    question: 'Man sollte pro Woche ______ Mal Sport treiben.',
    correctAnswer: '3-5',
    acceptedAnswers: ['3-5', '3 bis 5', '3 - 5', 'drei bis fünf'],
    solution: 'Experten empfehlen 3-5 Mal pro Woche Sport zu treiben.'
  },
  {
    id: 'q5',
    type: 'fillInTheBlank',  // ✅ Konvertiert zu fill_in_blank
    points: 0.5,
    topic: 'Gesundheit',
    question: 'Der BMI ist ein Maß für ______ und gibt einen ersten Anhaltspunkt zur Beurteilung des Körpergewichts.',
    correctAnswer: 'Körpergewicht im Verhältnis zur Größe',
    acceptedAnswers: [
      'körpergewicht im verhältnis zur größe',
      'körpergewicht und größe',
      'gewicht und größe'
    ],
    solution: 'Der BMI ist ein Maß für Körpergewicht im Verhältnis zur Körpergröße.'
  },
  {
    id: 'q6',
    type: 'shortAnswer',
    points: 1.0,
    topic: 'Prävention',
    question: 'Welche Maßnahmen beugen Herz-Kreislauf-Erkrankungen vor?',
    correctAnswer: 'Regelmäßige Bewegung und gesunde Ernährung',
    acceptedAnswers: [
      'regelmäßige bewegung und gesunde ernährung',
      'bewegung und ernährung',
      'sport und gesunde ernährung'
    ],
    solution: 'Regelmäßige Bewegung und gesunde Ernährung sind die wichtigsten Präventionsmaßnahmen.'
  },
  {
    id: 'q7',
    type: 'multipleChoice',  // ✅ Konvertiert zu multiple_choice (single select)
    points: 0.5,
    topic: 'Hydration',
    question: 'Welche Aussage über Wasser ist am wichtigsten?',
    options: [
      'Wasser ist für alle Körperfunktionen essentiell',
      'Man sollte nur trinken wenn man durstig ist',
      'Kaffee kann nicht zur Flüssigkeitszufuhr beitragen',
      'Wasser ist unwichtig für den Stoffwechsel'
    ],
    correctAnswer: 0,
    solution: 'Wasser ist essentiell für alle Körperfunktionen und sollte regelmäßig getrunken werden.'
  },
  {
    id: 'q8',
    type: 'fillInTheBlank',
    points: 1.0,
    topic: 'Ernährung',
    question: 'Die empfohlene tägliche Proteinzufuhr liegt bei etwa ______ Gramm pro Kilogramm Körpergewicht.',
    correctAnswer: '0.8-1.2',
    acceptedAnswers: ['0.8-1.2', '0,8-1,2', '1'],
    solution: 'Die empfohlene tägliche Proteinzufuhr liegt bei etwa 0.8-1.2 Gramm pro Kilogramm Körpergewicht.'
  },
  {
    id: 'q9',
    type: 'multipleChoice',
    points: 0.5,
    topic: 'Fitness',
    question: 'Was ist beim Krafttraining wichtig?',
    options: [
      'Nur schwere Gewichte',
      'Korrekte Form und progressive Überlastung',
      'Täglich trainieren ohne Pause',
      'Nur Cardio'
    ],
    correctAnswer: 1,
    solution: 'Beim Krafttraining ist die korrekte Ausführung entscheidend.'
  },
  {
    id: 'q10',
    type: 'shortAnswer',
    points: 1.0,
    topic: 'Bewegung',
    question: 'Welche Sportart ist besonders gut für das Herz-Kreislauf-System?',
    correctAnswer: 'Laufen, Schwimmen oder Radfahren',
    acceptedAnswers: [
      'laufen',
      'schwimmen',
      'radfahren',
      'ausdauersport'
    ],
    solution: 'Ausdauersportarten wie Laufen, Schwimmen oder Radfahren sind besonders gut für das Herz-Kreislauf-System.'
  }
];

// ==================== MOCK FUNCTIONS ====================

/**
 * Simulate API delay
 */
const delay = (ms: number = MOCK_DELAY_MS): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate random exam ID
 */
const generateExamId = (): string => {
  return `exam-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Select random questions from pool
 */
const selectRandomQuestions = (count: number): GenerateExamQuestion[] => {
  const shuffled = [...MOCK_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

/**
 * Calculate total points
 */
const calculateTotalPoints = (questions: GenerateExamQuestion[]): number => {
  return questions.reduce((sum, q) => sum + q.points, 0);
};

// ==================== MOCK API IMPLEMENTATIONS ====================

/**
 * Mock: Generate Exam
 */
export const mockGenerateExam = async (
  request: GenerateExamRequest
): Promise<GenerateExamResponse> => {
  console.log('🎭 MOCK: Generate Exam Request:', request);
  console.log('  👤 User:', request.userId);
  console.log('  📍 State:', request.state);
  console.log('  🏫 School Type:', request.schoolType);
  console.log('  🎓 Grade:', request.grade);
  console.log('  📚 Subject:', request.subject);
  console.log('  📖 Topic:', request.topic);
  console.log('  ⏱️  Duration:', request.examDuration, 'minutes');

  await delay();

  // Simulate exam generation
  const examId = generateExamId();
  const questionCount = request.numberOfQuestions || Math.min(10, Math.floor((request.examDuration || 10) / 2)); // 2 min per question
  const questions = selectRandomQuestions(questionCount);
  const totalPoints = calculateTotalPoints(questions);

  const response: GenerateExamResponse = {
    id: examId,
    questions,
    totalPoints,
    timeLimit: (request.examDuration || 10) * 60, // Convert to seconds
    difficulty: request.difficulty || 'medium',
  };

  console.log('🎭 MOCK: Generate Exam Response:', response);
  return response;
};

/**
 * Mock: Evaluate Exam
 */
export const mockEvaluateExam = async (
  request: EvaluateExamRequest
): Promise<EvaluateExamResponse> => {
  console.log('🎭 MOCK: Evaluate Exam Request:', request);

  await delay();

  // Evaluate each question
  const feedback: QuestionFeedback[] = [];
  let totalPointsAchieved = 0;
  let totalPointsPossible = 0;

  request.exam.questions.forEach((question) => {
    const userAnswer = request.answers[question.id];
    const isCorrect = evaluateAnswer(userAnswer, question);
    const pointsAwarded = isCorrect ? question.points : 0;

    totalPointsAchieved += pointsAwarded;
    totalPointsPossible += question.points;

    feedback.push({
      questionId: question.id,
      isCorrect,
      pointsAwarded,
      pointsTotal: question.points,
      feedback: isCorrect
        ? '✅ Perfekt! Deine Antwort ist korrekt.'
        : '❌ Leider falsch. ' + (question.solution || ''),
      correctAnswer: question.correctAnswer,
    });
  });

  // Calculate grade and percentage
  const percentage = (totalPointsAchieved / totalPointsPossible) * 100;
  const grade = calculateGrade(percentage);

  const response: EvaluateExamResponse = {
    grade,
    percentage,
    pointsAchieved: totalPointsAchieved,
    pointsTotal: totalPointsPossible,
    feedback,
    overallFeedback: generateOverallFeedback(percentage),
    recommendations: generateRecommendations(feedback),
    strengths: generateStrengths(feedback),
    weaknesses: generateWeaknesses(feedback),
  };

  console.log('🎭 MOCK: Evaluate Exam Response:', response);
  return response;
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Evaluate a single answer
 */
const evaluateAnswer = (
  userAnswer: number | string | undefined,
  question: GenerateExamQuestion
): boolean => {
  if (userAnswer === undefined) return false;

  // Multiple choice
  if (question.type === 'multipleChoice' && typeof userAnswer === 'number') {
    return userAnswer === question.correctAnswer;
  }

  // Fill in the blank / Short answer
  if (typeof userAnswer === 'string') {
    const normalized = userAnswer.toLowerCase().trim();

    // Check accepted answers
    if (question.acceptedAnswers) {
      return question.acceptedAnswers.some(
        (accepted) => accepted.toLowerCase().trim() === normalized
      );
    }

    // Check correct answer
    if (typeof question.correctAnswer === 'string') {
      return question.correctAnswer.toLowerCase().trim() === normalized;
    }
  }

  return false;
};

/**
 * Calculate grade from percentage (German grading system 1-6)
 */
const calculateGrade = (percentage: number): number => {
  if (percentage >= 92) return 1.0;
  if (percentage >= 81) return 2.0;
  if (percentage >= 67) return 3.0;
  if (percentage >= 50) return 4.0;
  if (percentage >= 30) return 5.0;
  return 6.0;
};

/**
 * Generate overall feedback based on percentage
 */
const generateOverallFeedback = (percentage: number): string => {
  if (percentage >= 90) return '🎉 Hervorragend! Du beherrschst das Thema sehr gut.';
  if (percentage >= 75) return '👍 Gut gemacht! Du hast ein solides Verständnis.';
  if (percentage >= 60) return '✓ Befriedigend. Es gibt noch Verbesserungspotential.';
  if (percentage >= 50) return '⚠️ Ausreichend. Übe die Themen nochmal.';
  return '❌ Ungenügend. Bitte wiederhole die Grundlagen.';
};

/**
 * Generate recommendations based on wrong answers
 */
const generateRecommendations = (feedback: QuestionFeedback[]): string[] => {
  const wrongTopics = feedback
    .filter((f) => !f.isCorrect)
    .map((f) => {
      const question = MOCK_QUESTIONS_POOL.find((q) => q.id === f.questionId);
      return question?.topic || 'Unknown';
    });

  const uniqueTopics = [...new Set(wrongTopics)];
  return uniqueTopics.map((topic) => `Übe mehr zum Thema: ${topic}`);
};

/**
 * Generate strengths based on correct answers
 */
const generateStrengths = (feedback: QuestionFeedback[]): string[] => {
  const correctTopics = feedback
    .filter((f) => f.isCorrect)
    .map((f) => {
      const question = MOCK_QUESTIONS_POOL.find((q) => q.id === f.questionId);
      return question?.topic || 'Unknown';
    });

  const uniqueTopics = [...new Set(correctTopics)];
  return uniqueTopics.map((topic) => `Stark in: ${topic}`);
};

/**
 * Generate weaknesses based on wrong answers
 */
const generateWeaknesses = (feedback: QuestionFeedback[]): string[] => {
  const wrongTopics = feedback
    .filter((f) => !f.isCorrect)
    .map((f) => {
      const question = MOCK_QUESTIONS_POOL.find((q) => q.id === f.questionId);
      return question?.topic || 'Unknown';
    });

  const uniqueTopics = [...new Set(wrongTopics)];
  return uniqueTopics.map((topic) => `Schwäche in: ${topic}`);
};

// ==================== EXPORT MOCK STATUS ====================

export const isMockEnabled = (): boolean => MOCK_ENABLED;
