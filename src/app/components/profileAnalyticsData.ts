// ===== EXTRACTED TYPES & MOCK DATA for ProfileAnalyticsScreen =====
// Extracted to reduce main file size below Babel's 500KB threshold

// ===== TYPES =====
export interface WeaknessItem {
  id: string;
  topic: string;
  subject: string;
  score: number;
  severity: 'critical' | 'warning' | 'moderate';
  recommendation: string;
  criticalActions: string[];
}

export interface StrengthItem {
  id: string;
  topic: string;
  subject: string;
  score: number;
}

export interface TopicItem {
  id: string;
  name: string;
  mastery: number;
  completedExercises: number;
  totalExercises: number;
  trend: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  progress: number;
  topics: TopicItem[];
}

export interface SubjectProgress {
  id: string;
  name: string;
  progress: number;
  status: 'on-track' | 'needs-attention' | 'at-risk';
  trend: number;
  strongestCategory: string;
  categories: CategoryItem[];
}

export interface RiskItem {
  id: string;
  topic: string;
  subject: string;
  score: number;
  riskLevel: 'high' | 'medium' | 'low';
  reason: string;
}

export interface ActivityItem {
  id: string;
  type: 'flashcard' | 'exam' | 'chat';
  title: string;
  subject: string;
  score?: number;
  date: string;
  duration: string;
  cardsCount?: number;
  grade?: string;
  progress?: number;
  setId?: number;
  time?: string;
}

export interface UnifiedSummary {
  totalActivities: number;
  averagePerformance: number;
  strongestSubject: string;
  weakestSubject: string;
  trend: 'improving' | 'stable' | 'declining';
  learningStyle: string;
  dataSources: { key: string; label: string; count: number }[];
}

export interface KnowledgeGapItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  score: number;
  severity: 'critical' | 'warning' | 'moderate';
}

export interface PastExamInsight {
  id: string;
  title: string;
  subject: string;
  date: string;
  grade: number;
  prepPercent: number;
}

export interface ActiveGoal {
  id: string;
  topic: string;
  subject: string;
  dueDate: string;
  originalDueDate: string;
  masteryStart: number;
  masteryCurrent: number;
  masteryTarget: number;
  todosCompleted: number;
  todosTotal: number;
  aiReasoning: string;
  status: 'on-track' | 'at-risk' | 'extended';
  note?: string;
  difficulties: {
    topic: string;
    detail: string;
    type: 'major' | 'moderate' | 'minor';
  }[];
  prepTasks: {
    type: 'flashcards' | 'exam-simulation' | 'chat';
    title: string;
    topic: string;
    completed: boolean;
    assignedDate: string;
    completedDate?: string;
    cardCount?: number;
    examDurationMinutes?: number;
    linkedSetId?: number;
  }[];
}

export interface CompletedGoalInsight {
  id: string;
  topic: string;
  subject: string;
  plannedDays: number;
  actualDays: number;
  completedOnTime: boolean;
  completedDate: string;
}

export interface GoalRecommendation {
  id: string;
  goalId: string;
  topic: string;
  subject: string;
  reason: string;
  severity: 'critical' | 'warning' | 'moderate';
  actions: ('flashcards' | 'exam-simulation')[];
}

export interface ExamLearningCurvePoint {
  label: string;
  readiness: number;
}

// Re-export types from profileAnalyticsMockExams that are used in the main file
export type { ExamTopicReadiness, ExamInsight, ExamPastComparisonData, ExamRecommendation } from './profileAnalyticsMockExams';

// ===== UTILITY FUNCTIONS =====

/** Simple deterministic hash for seeded pseudo-random */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Dynamically generate learning curve data points from prepStartDate to today */
export function generateLearningCurve(prepStartDate: string, currentReadiness: number): ExamLearningCurvePoint[] {
  const today = new Date('2026-03-17');
  const start = new Date(prepStartDate);
  const totalDays = Math.max(1, Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  const rand = seededRandom(totalDays * 1000 + currentReadiness);

  let numPoints: number;
  if (totalDays <= 7) numPoints = Math.min(totalDays + 1, 5);
  else if (totalDays <= 14) numPoints = 5;
  else if (totalDays <= 30) numPoints = 6;
  else if (totalDays <= 60) numPoints = 7;
  else numPoints = 8;

  numPoints = Math.max(3, Math.min(numPoints, totalDays + 1));

  const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  const startReadiness = Math.max(8, currentReadiness * (0.2 + rand() * 0.15));

  const points: ExamLearningCurvePoint[] = [];
  for (let i = 0; i < numPoints; i++) {
    const fraction = i / (numPoints - 1);
    const dayOffset = Math.round(fraction * totalDays);
    const pointDate = new Date(start.getTime() + dayOffset * 24 * 60 * 60 * 1000);

    const easedFraction = Math.pow(fraction, 0.7);
    const noise = i > 0 && i < numPoints - 1 ? (rand() - 0.5) * 6 : 0;
    const readiness = i === numPoints - 1
      ? currentReadiness
      : Math.round(Math.min(100, Math.max(0, startReadiness + (currentReadiness - startReadiness) * easedFraction + noise)));

    const label = `${pointDate.getDate()}. ${MONTHS[pointDate.getMonth()]}`;
    points.push({ label, readiness });
  }

  return points;
}

export function calculateStreak(activities: { date: string }[]): number {
  const today = new Date('2026-03-15');
  const activityDates = new Set(activities.map(a => a.date));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (activityDates.has(key)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ===== MOCK DATA =====

export const MOCK_WEAKNESSES: WeaknessItem[] = [
  { id: 'w1', topic: 'Quadratische Funktionen & Textaufgaben', subject: 'Mathematik', score: 28, severity: 'critical', recommendation: 'Scheitelpunktform und Nullstellen intensiv üben – besonders die Umformung von Textaufgaben in mathematische Gleichungen bereitet noch Schwierigkeiten', criticalActions: ['Grundlagen-Quiz wiederholen', 'Übungsblatt Scheitelpunktform'] },
  { id: 'w2', topic: 'Passé Composé mit unregelmäßigen Verben', subject: 'Französisch', score: 35, severity: 'critical', recommendation: 'Hilfsverben être/avoir wiederholen', criticalActions: ['Konjugationstabelle lernen', 'Lückentext-Übungen'] },
  { id: 'w3', topic: 'Zellatmung', subject: 'Biologie', score: 42, severity: 'warning', recommendation: 'Glykolyse und Citratzyklus Schritte lernen', criticalActions: [] },
  { id: 'w4', topic: 'Gedichtanalyse', subject: 'Deutsch', score: 48, severity: 'warning', recommendation: 'Stilmittel und Metrik systematisch üben', criticalActions: [] },
  { id: 'w5', topic: 'Industrialisierung & soziale Folgen', subject: 'Geschichte', score: 55, severity: 'moderate', recommendation: 'Zeitleiste und Schlüsselereignisse wiederholen', criticalActions: [] },
];

export const MOCK_STRENGTHS: StrengthItem[] = [
  { id: 's1', topic: 'Lineare Gleichungen', subject: 'Mathematik', score: 94 },
  { id: 's2', topic: 'Vokabular B2', subject: 'Englisch', score: 91 },
  { id: 's3', topic: 'Photosynthese', subject: 'Biologie', score: 88 },
  { id: 's4', topic: 'Erörterung', subject: 'Deutsch', score: 86 },
  { id: 's5', topic: 'Terme vereinfachen', subject: 'Mathematik', score: 85 },
  { id: 's6', topic: 'Simple Past', subject: 'Englisch', score: 92 },
];

export const MOCK_SUBJECTS: SubjectProgress[] = [
  {
    id: 'sub1', name: 'Mathematik', progress: 68, status: 'needs-attention',
    trend: -3, strongestCategory: 'Zahlen & Operationen',
    categories: [
      {
        id: 'mc1', name: 'Zahlen & Operationen', progress: 79,
        topics: [
          { id: 'mt1', name: 'Bruchrechnung', mastery: 82, completedExercises: 45, totalExercises: 50, trend: 3 },
          { id: 'mt2', name: 'Prozentrechnung', mastery: 74, completedExercises: 32, totalExercises: 40, trend: 0 },
          { id: 'mt3', name: 'Terme vereinfachen', mastery: 85, completedExercises: 38, totalExercises: 42, trend: 5 },
          { id: 'mt4', name: 'Gleichungen lösen', mastery: 71, completedExercises: 28, totalExercises: 38, trend: -2 },
        ],
      },
      {
        id: 'mc2', name: 'Funktionen', progress: 58,
        topics: [
          { id: 'mt5', name: 'Lineare Funktionen', mastery: 78, completedExercises: 35, totalExercises: 44, trend: 4 },
          { id: 'mt6', name: 'Funktionsgraphen deuten', mastery: 61, completedExercises: 18, totalExercises: 30, trend: 0 },
          { id: 'mt7', name: 'Steigungsberechnung', mastery: 52, completedExercises: 14, totalExercises: 28, trend: -3 },
          { id: 'mt8', name: 'Funktionsgleichungen', mastery: 41, completedExercises: 10, totalExercises: 32, trend: -5 },
        ],
      },
      {
        id: 'mc3', name: 'Geometrie', progress: 72,
        topics: [
          { id: 'mt9', name: 'Flächenberechnung', mastery: 88, completedExercises: 40, totalExercises: 44, trend: 2 },
          { id: 'mt10', name: 'Körper & Volumen', mastery: 69, completedExercises: 22, totalExercises: 34, trend: 0 },
          { id: 'mt11', name: 'Winkel & Symmetrie', mastery: 75, completedExercises: 30, totalExercises: 38, trend: 3 },
          { id: 'mt12', name: 'Trigonometrie', mastery: 38, completedExercises: 8, totalExercises: 30, trend: -4 },
        ],
      },
      {
        id: 'mc4', name: 'Stochastik', progress: 48,
        topics: [
          { id: 'mt13', name: 'Wahrscheinlichkeitsrechnung', mastery: 41, completedExercises: 12, totalExercises: 36, trend: -6 },
          { id: 'mt14', name: 'Datenauswertung', mastery: 55, completedExercises: 16, totalExercises: 28, trend: 0 },
          { id: 'mt15', name: 'Baumdiagramme', mastery: 47, completedExercises: 10, totalExercises: 24, trend: -2 },
        ],
      },
    ],
  },
  {
    id: 'sub2', name: 'Deutsch', progress: 74, status: 'on-track',
    trend: 6, strongestCategory: 'Texte lesen & verstehen',
    categories: [
      {
        id: 'dc1', name: 'Texte schreiben', progress: 76,
        topics: [
          { id: 'dt1', name: 'Erörterung', mastery: 86, completedExercises: 28, totalExercises: 30, trend: 5 },
          { id: 'dt2', name: 'Inhaltsangabe', mastery: 79, completedExercises: 22, totalExercises: 26, trend: 3 },
          { id: 'dt3', name: 'Kreatives Schreiben', mastery: 72, completedExercises: 18, totalExercises: 24, trend: 0 },
          { id: 'dt4', name: 'Berichte & Protokolle', mastery: 68, completedExercises: 14, totalExercises: 20, trend: 4 },
        ],
      },
      {
        id: 'dc2', name: 'Texte lesen & verstehen', progress: 71,
        topics: [
          { id: 'dt5', name: 'Sachtexte analysieren', mastery: 81, completedExercises: 24, totalExercises: 28, trend: 4 },
          { id: 'dt6', name: 'Gedichtanalyse', mastery: 48, completedExercises: 10, totalExercises: 24, trend: -3 },
          { id: 'dt7', name: 'Epische Texte', mastery: 74, completedExercises: 20, totalExercises: 26, trend: 2 },
          { id: 'dt8', name: 'Dramenanalyse', mastery: 65, completedExercises: 15, totalExercises: 22, trend: 0 },
        ],
      },
      {
        id: 'dc3', name: 'Sprache & Grammatik', progress: 66,
        topics: [
          { id: 'dt9', name: 'Kommasetzung', mastery: 58, completedExercises: 20, totalExercises: 36, trend: -2 },
          { id: 'dt10', name: 'Satzglieder', mastery: 62, completedExercises: 16, totalExercises: 28, trend: 0 },
          { id: 'dt11', name: 'Rechtschreibung', mastery: 78, completedExercises: 32, totalExercises: 38, trend: 3 },
        ],
      },
      {
        id: 'dc4', name: 'Medien & Methoden', progress: 82,
        topics: [
          { id: 'dt12', name: 'Medienanalyse', mastery: 84, completedExercises: 18, totalExercises: 20, trend: 0 },
          { id: 'dt13', name: 'Quellenarbeit', mastery: 80, completedExercises: 16, totalExercises: 20, trend: 2 },
        ],
      },
    ],
  },
  {
    id: 'sub3', name: 'Englisch', progress: 82, status: 'on-track',
    trend: 0, strongestCategory: 'Reading',
    categories: [
      {
        id: 'ec1', name: 'Reading', progress: 88,
        topics: [
          { id: 'et1', name: 'Text Comprehension', mastery: 91, completedExercises: 36, totalExercises: 38, trend: 4 },
          { id: 'et2', name: 'Vocabulary B2', mastery: 88, completedExercises: 42, totalExercises: 46, trend: 2 },
          { id: 'et3', name: 'Summary Writing', mastery: 82, completedExercises: 26, totalExercises: 30, trend: 0 },
        ],
      },
      {
        id: 'ec2', name: 'Writing', progress: 80,
        topics: [
          { id: 'et4', name: 'Essay Writing', mastery: 85, completedExercises: 20, totalExercises: 22, trend: 3 },
          { id: 'et5', name: 'Creative Writing', mastery: 78, completedExercises: 18, totalExercises: 24, trend: 0 },
          { id: 'et6', name: 'Formal Letters', mastery: 76, completedExercises: 14, totalExercises: 18, trend: 0 },
        ],
      },
      {
        id: 'ec3', name: 'Grammar', progress: 74,
        topics: [
          { id: 'et7', name: 'Tenses', mastery: 84, completedExercises: 38, totalExercises: 42, trend: 0 },
          { id: 'et8', name: 'Conditional Sentences', mastery: 53, completedExercises: 12, totalExercises: 28, trend: -4 },
          { id: 'et9', name: 'Relative Clauses', mastery: 72, completedExercises: 20, totalExercises: 26, trend: 2 },
          { id: 'et10', name: 'Passive Voice', mastery: 79, completedExercises: 22, totalExercises: 26, trend: 0 },
        ],
      },
      {
        id: 'ec4', name: 'Listening & Speaking', progress: 77,
        topics: [
          { id: 'et11', name: 'Listening Comprehension', mastery: 78, completedExercises: 24, totalExercises: 30, trend: 0 },
          { id: 'et12', name: 'Presentations', mastery: 76, completedExercises: 8, totalExercises: 12, trend: 3 },
        ],
      },
    ],
  },
  {
    id: 'sub4', name: 'Biologie', progress: 61, status: 'at-risk',
    trend: -8, strongestCategory: 'Ökologie',
    categories: [
      {
        id: 'bc1', name: 'Zellbiologie', progress: 55,
        topics: [
          { id: 'bt1', name: 'Zellaufbau', mastery: 72, completedExercises: 20, totalExercises: 26, trend: -4 },
          { id: 'bt2', name: 'Zellatmung', mastery: 42, completedExercises: 10, totalExercises: 28, trend: -6 },
          { id: 'bt3', name: 'Zellteilung', mastery: 51, completedExercises: 14, totalExercises: 30, trend: -3 },
        ],
      },
      {
        id: 'bc2', name: 'Genetik', progress: 48,
        topics: [
          { id: 'bt4', name: 'Vererbungslehre', mastery: 55, completedExercises: 16, totalExercises: 30, trend: -5 },
          { id: 'bt5', name: 'DNA & RNA', mastery: 44, completedExercises: 12, totalExercises: 28, trend: -4 },
          { id: 'bt6', name: 'Mutation & Selektion', mastery: 38, completedExercises: 8, totalExercises: 26, trend: -7 },
        ],
      },
      {
        id: 'bc3', name: 'Ökologie', progress: 78,
        topics: [
          { id: 'bt7', name: 'Ökosysteme', mastery: 76, completedExercises: 22, totalExercises: 28, trend: 0 },
          { id: 'bt8', name: 'Stoffkreisläufe', mastery: 71, completedExercises: 18, totalExercises: 24, trend: -2 },
          { id: 'bt9', name: 'Photosynthese', mastery: 88, completedExercises: 30, totalExercises: 32, trend: 3 },
        ],
      },
    ],
  },
];

export const OVERALL_PROGRESS = Math.round(MOCK_SUBJECTS.reduce((s, sub) => s + sub.progress, 0) / MOCK_SUBJECTS.length);

export const MOCK_RISKS: RiskItem[] = [
  { id: 'r1', topic: 'Stochastik', subject: 'Mathematik', score: 15, riskLevel: 'high', reason: 'Klausur in 2 Wochen, Score aktuell bei 41%' },
  { id: 'r2', topic: 'Genetik', subject: 'Biologie', score: 20, riskLevel: 'high', reason: 'Nur 2 Versuche, stark fallender Trend' },
  { id: 'r3', topic: 'Conditional Sentences', subject: 'Englisch', score: 38, riskLevel: 'medium', reason: 'Grundlagen fehlen, baut auf für B2-Level' },
  { id: 'r4', topic: 'Trigonometrie', subject: 'Mathematik', score: 32, riskLevel: 'medium', reason: 'Noch nicht bearbeitet, Vorwissen lückenhaft' },
  { id: 'r5', topic: 'Kommasetzung', subject: 'Deutsch', score: 62, riskLevel: 'low', reason: 'Leichter Abwärtstrend, regelmäßiges Üben empfohlen' },
];

export const MOCK_ACTIVITIES: ActivityItem[] = [
  // === Aktuelle Woche (9.–15. März 2026) ===
  { id: 'a0a', type: 'exam', title: 'Prüfungssimulation: Lineare Funktionen', subject: 'Mathematik', score: 85, date: '2026-03-15', duration: '28 min', grade: '2', time: '09:30' },
  { id: 'a0b', type: 'chat', title: '4 Fragen zur Photosynthese', subject: 'Biologie', date: '2026-03-15', duration: '12 min', time: '13:15' },
  { id: 'a1', type: 'flashcard', title: 'Lineare Gleichungen', subject: 'Mathematik', score: 94, date: '2026-03-15', duration: '15 min', cardsCount: 24, progress: 78, setId: 7001, time: '16:45' },
  { id: 'a2', type: 'exam', title: 'Prüfungssimulation: Erörterung', subject: 'Deutsch', score: 78, date: '2026-03-14', duration: '32 min', grade: '3' },
  { id: 'a3', type: 'flashcard', title: 'Vokabeln Unit 7', subject: 'Englisch', score: 88, date: '2026-03-14', duration: '12 min', cardsCount: 18, progress: 62, setId: 7002 },
  { id: 'a4', type: 'chat', title: '3 Fragen zu Zellatmung', subject: 'Biologie', date: '2026-03-13', duration: '8 min' },
  { id: 'a5', type: 'flashcard', title: 'Passé Composé', subject: 'Französisch', score: 35, date: '2026-03-12', duration: '20 min', cardsCount: 30, progress: 22, setId: 7003 },
  { id: 'a6', type: 'exam', title: 'Prüfungssimulation: Bruchrechnung', subject: 'Mathematik', score: 82, date: '2026-03-12', duration: '25 min', grade: '2' },
  { id: 'a7', type: 'flashcard', title: 'Photosynthese', subject: 'Biologie', score: 91, date: '2026-03-11', duration: '18 min', cardsCount: 20, progress: 85, setId: 7004 },
  { id: 'a8', type: 'chat', title: '5 Fragen zur Erörterung', subject: 'Deutsch', date: '2026-03-11', duration: '11 min' },
  { id: 'a9', type: 'exam', title: 'Prüfungssimulation: Stochastik', subject: 'Mathematik', score: 41, date: '2026-03-10', duration: '28 min', grade: '5' },
  { id: 'a10', type: 'chat', title: 'Allgemeine Lernfragen', subject: '', date: '2026-03-09', duration: '5 min' },
  // === Vorwoche (2.–8. März 2026) ===
  { id: 'a11', type: 'flashcard', title: 'Terme vereinfachen', subject: 'Mathematik', score: 72, date: '2026-03-08', duration: '14 min', cardsCount: 20, progress: 55 },
  { id: 'a12', type: 'exam', title: 'Prüfungssimulation: Gedichtanalyse', subject: 'Deutsch', score: 58, date: '2026-03-07', duration: '30 min', grade: '4' },
  { id: 'a13', type: 'flashcard', title: 'Vokabeln Unit 6', subject: 'Englisch', score: 81, date: '2026-03-06', duration: '10 min', cardsCount: 15, progress: 70 },
  { id: 'a14', type: 'chat', title: '2 Fragen zu Genetik', subject: 'Biologie', date: '2026-03-05', duration: '6 min' },
  { id: 'a15', type: 'exam', title: 'Prüfungssimulation: Lineare Funktionen', subject: 'Mathematik', score: 67, date: '2026-03-04', duration: '22 min', grade: '3' },
  { id: 'a16', type: 'flashcard', title: 'Simple Past', subject: 'Englisch', score: 85, date: '2026-03-03', duration: '12 min', cardsCount: 16, progress: 75 },
  { id: 'a17', type: 'chat', title: 'Fragen zu Industrialisierung', subject: 'Geschichte', date: '2026-03-02', duration: '9 min' },
  // === Vormonat (Februar 2026) ===
  { id: 'a18', type: 'flashcard', title: 'Bruchrechnung Basics', subject: 'Mathematik', score: 63, date: '2026-02-27', duration: '16 min', cardsCount: 22, progress: 45 },
  { id: 'a19', type: 'exam', title: 'Prüfungssimulation: Kommasetzung', subject: 'Deutsch', score: 55, date: '2026-02-25', duration: '28 min', grade: '4' },
  { id: 'a20', type: 'flashcard', title: 'Vokabeln Unit 5', subject: 'Englisch', score: 76, date: '2026-02-22', duration: '11 min', cardsCount: 14, progress: 58 },
  { id: 'a21', type: 'exam', title: 'Prüfungssimulation: Zellatmung', subject: 'Biologie', score: 38, date: '2026-02-20', duration: '35 min', grade: '5' },
  { id: 'a22', type: 'chat', title: 'Fragen zu Passé Composé', subject: 'Französisch', date: '2026-02-18', duration: '7 min' },
  { id: 'a23', type: 'flashcard', title: 'Quadratische Funktionen', subject: 'Mathematik', score: 42, date: '2026-02-15', duration: '20 min', cardsCount: 25, progress: 30 },
  { id: 'a24', type: 'exam', title: 'Prüfungssimulation: Simple Past', subject: 'Englisch', score: 70, date: '2026-02-12', duration: '24 min', grade: '3' },
  { id: 'a25', type: 'flashcard', title: 'Erörterung Aufbau', subject: 'Deutsch', score: 68, date: '2026-02-10', duration: '13 min', cardsCount: 18, progress: 50 },
  // === Ältere Daten (Jan 2026, Dez/Nov/Okt 2025) ===
  { id: 'a26', type: 'exam', title: 'Prüfungssimulation: Prozentrechnung', subject: 'Mathematik', score: 59, date: '2026-01-28', duration: '26 min', grade: '4' },
  { id: 'a27', type: 'flashcard', title: 'Vokabeln Unit 4', subject: 'Englisch', score: 74, date: '2026-01-22', duration: '10 min', cardsCount: 12, progress: 62 },
  { id: 'a28', type: 'chat', title: 'Fragen zu Photosynthese', subject: 'Biologie', date: '2026-01-18', duration: '8 min' },
  { id: 'a29', type: 'flashcard', title: 'Konjugation Präsens', subject: 'Französisch', score: 50, date: '2026-01-10', duration: '15 min', cardsCount: 20, progress: 35 },
  { id: 'a30', type: 'exam', title: 'Prüfungssimulation: Textanalyse', subject: 'Deutsch', score: 62, date: '2025-12-18', duration: '30 min', grade: '3' },
  { id: 'a31', type: 'flashcard', title: 'Grundrechenarten', subject: 'Mathematik', score: 88, date: '2025-12-10', duration: '12 min', cardsCount: 16, progress: 80 },
  { id: 'a32', type: 'exam', title: 'Prüfungssimulation: Ökologie', subject: 'Biologie', score: 45, date: '2025-11-25', duration: '32 min', grade: '5' },
  { id: 'a33', type: 'flashcard', title: 'Conditional Sentences', subject: 'Englisch', score: 53, date: '2025-11-15', duration: '14 min', cardsCount: 18, progress: 40 },
  { id: 'a34', type: 'chat', title: 'Allgemeine Lernstrategie', subject: '', date: '2025-10-20', duration: '10 min' },
];

export const LEARNING_STREAK = calculateStreak(MOCK_ACTIVITIES);

export const TREND_DATA = [
  { week: 'KW 5', score: 58 },
  { week: 'KW 6', score: 61 },
  { week: 'KW 7', score: 59 },
  { week: 'KW 8', score: 65 },
  { week: 'KW 9', score: 68 },
  { week: 'KW 10', score: 72 },
];

export const RADAR_DATA = [
  { subject: 'Mathe', score: 68, fullMark: 100 },
  { subject: 'Deutsch', score: 74, fullMark: 100 },
  { subject: 'Englisch', score: 82, fullMark: 100 },
  { subject: 'Bio', score: 61, fullMark: 100 },
  { subject: 'Franz.', score: 45, fullMark: 100 },
  { subject: 'Gesch.', score: 65, fullMark: 100 },
];

// Derive weekly activity data from MOCK_ACTIVITIES (single source of truth)
export const WEEKLY_ACTIVITY_DATA = (() => {
  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const weekStart = new Date('2026-03-09');
  const buckets: Record<string, number> = { Mo: 0, Di: 0, Mi: 0, Do: 0, Fr: 0, Sa: 0, So: 0 };
  MOCK_ACTIVITIES.forEach(a => {
    const d = new Date(a.date + 'T00:00:00');
    if (d >= weekStart) {
      const dayKey = dayNames[d.getDay()];
      const mins = parseInt(a.duration.replace(/[^\d]/g, '')) || 0;
      buckets[dayKey] += mins;
    }
  });
  return ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => ({ day, minutes: buckets[day] }));
})();

export const MOCK_UNIFIED_SUMMARY: UnifiedSummary = {
  totalActivities: 38,
  averagePerformance: 72,
  strongestSubject: 'Englisch',
  weakestSubject: 'Biologie',
  trend: 'improving',
  learningStyle: 'Ausgewogener Lernstil',
  dataSources: [
    { key: 'flashcards', label: 'Karteikarten Lernsimulator', count: 65 },
    { key: 'exams', label: 'Prüfungssimulation', count: 85 },
    { key: 'chat', label: 'Lernassistent', count: 24 },
  ],
};

export const MOCK_KNOWLEDGE_GAPS_SELF: KnowledgeGapItem[] = [
  { id: 'sg1', title: 'Grundlagen der Termumformung', description: 'Die KI hat erkannt, dass Fehler bei quadratischen Gleichungen und Bruchrechnung auf unsichere Termumformung zurückzuführen sind.', subject: 'Mathematik', score: 22, severity: 'critical' },
  { id: 'sg2', title: 'Satzglied-Erkennung', description: 'Schwächen bei Kommasetzung und Gedichtanalyse deuten auf ein grundlegendes Defizit bei der Satzglied-Erkennung hin.', subject: 'Deutsch', score: 40, severity: 'warning' },
  { id: 'sg3', title: 'Grundvokabular Biologie (Zellbiologie)', description: 'Verwechslungen bei Zellatmung und Genetik legen nahe, dass die Fachbegriffe der Zellbiologie nicht sicher sitzen.', subject: 'Biologie', score: 18, severity: 'critical' },
  { id: 'sg4', title: 'Zeitformen-System Französisch', description: 'Die Schwäche beim Passé Composé könnte auf ein fehlendes Verständnis des gesamten Zeitformen-Systems zurückgehen.', subject: 'Französisch', score: 45, severity: 'warning' },
  { id: 'sg5', title: 'Wahrscheinlichkeitsbegriff', description: 'Der niedrige Score bei Stochastik deutet auf Lücken beim intuitiven Verständnis von Wahrscheinlichkeiten hin.', subject: 'Mathematik', score: 58, severity: 'moderate' },
];

// Synced with KlassenarbeitenScreen INITIAL_EXAMS
export const MOCK_PAST_EXAM_INSIGHTS: PastExamInsight[] = [
  { id: 'pe1', title: 'Lineare Algebra', subject: 'Mathematik', date: '2025-02-14', grade: 1, prepPercent: 88 },
  { id: 'pe2', title: 'Geometrie Grundlagen', subject: 'Mathematik', date: '2025-01-28', grade: 2, prepPercent: 72 },
  { id: 'pe3', title: 'Erörterung Medien', subject: 'Deutsch', date: '2025-01-18', grade: 3, prepPercent: 55 },
  { id: 'pe4', title: 'Weimarer Republik', subject: 'Geschichte', date: '2025-01-15', grade: 2, prepPercent: 78 },
  { id: 'pe5', title: 'Vektorrechnung', subject: 'Mathematik', date: '2025-01-10', grade: 3, prepPercent: 45 },
  { id: 'pe6', title: 'Stochastik Klausur', subject: 'Mathematik', date: '2024-12-20', grade: 1, prepPercent: 91 },
  { id: 'pe7', title: 'Shakespeare Analysis', subject: 'Englisch', date: '2024-12-10', grade: 1, prepPercent: 85 },
  { id: 'pe8', title: 'Mechanik & Thermodynamik', subject: 'Physik', date: '2024-12-05', grade: 2, prepPercent: 76 },
  { id: 'pe9', title: 'Dramenanalyse Faust', subject: 'Deutsch', date: '2024-11-22', grade: 2, prepPercent: 68 },
  { id: 'pe10', title: 'Analysis Klausur Q1', subject: 'Mathematik', date: '2024-11-15', grade: 2, prepPercent: 71 },
];

export const MOCK_ACTIVE_GOALS: ActiveGoal[] = [
  {
    id: 'ag1', topic: 'Quadratische Funktionen', subject: 'Mathematik',
    dueDate: '2026-03-28', originalDueDate: '2026-03-28',
    masteryStart: 28, masteryCurrent: 54, masteryTarget: 100,
    todosCompleted: 4, todosTotal: 8,
    note: 'Ich will quadratische Funktionen komplett verstehen – Scheitelpunktform, Nullstellen mit p-q-Formel und Graphen zeichnen können. Wichtig für die Mathe-Klausur Ende März, aber auch generell fürs Verständnis von Funktionen.',
    aiReasoning: 'Dein Fortschritt ist von 28% auf 54% gestiegen – basierend auf Karteikarten-Sessions und einer Prüfungssimulation. Die gezielten ToDos können die restlichen 46% zum Ziel schließen.',
    status: 'on-track',
    difficulties: [
      { topic: 'Scheitelpunktform \u2194 Normalform', detail: 'Die Umwandlung zwischen Scheitelpunktform und Normalform wird häufig verwechselt – besonders das Vorzeichen beim Quadrieren der verschobenen Variablen.', type: 'major' },
      { topic: 'p-q-Formel Sonderfälle', detail: 'Wenn die Diskriminante negativ ist, wird das nicht erkannt und es werden falsche Nullstellen berechnet. Sonderfälle brauchen mehr Übung.', type: 'major' },
      { topic: 'Graphen strecken/stauchen', detail: 'Der Streckfaktor a wird mit der Verschiebung verwechselt – du weißt, wie er den Graphen beeinflusst, aber die Kombination mit Verschiebung ist noch unsicher.', type: 'moderate' },
      { topic: 'Textaufgaben modellieren', detail: 'Bei Textaufgaben fällt es schwer, die richtige Funktion aufzustellen. Die Übersetzung von Text in mathematische Terme braucht noch Übung.', type: 'moderate' },
      { topic: 'Symmetrieachse bestimmen', detail: 'Kleinere Unsicherheit: Die Symmetrieachse wird manchmal falsch aus der Scheitelpunktform abgelesen, besonders bei negativem Vorzeichen.', type: 'minor' },
    ],
    prepTasks: [
      { type: 'flashcards', title: '15 Karteikarten: Scheitelpunktform durchgehen', topic: 'Scheitelpunktform', completed: true, assignedDate: '2026-03-08', completedDate: '2026-03-08', cardCount: 15, linkedSetId: 301 },
      { type: 'exam-simulation', title: '20 Min: Prüfung Quadratische Gleichungen', topic: 'Quadratische Gleichungen', completed: true, assignedDate: '2026-03-10', completedDate: '2026-03-11', examDurationMinutes: 20 },
      { type: 'flashcards', title: '15 Karteikarten: Nullstellen berechnen', topic: 'Nullstellen berechnen', completed: true, assignedDate: '2026-03-12', completedDate: '2026-03-12', cardCount: 15, linkedSetId: 302 },
      { type: 'flashcards', title: '15 Karteikarten: p-q-Formel üben', topic: 'p-q-Formel', completed: true, assignedDate: '2026-03-14', completedDate: '2026-03-15', cardCount: 15, linkedSetId: 303 },
      { type: 'exam-simulation', title: '25 Min: Prüfung Graphen verschieben & strecken', topic: 'Graphen verschieben', completed: false, assignedDate: '2026-03-16', examDurationMinutes: 25 },
      { type: 'flashcards', title: '15 Karteikarten: Diskriminante & Sonderfälle', topic: 'Diskriminante', completed: false, assignedDate: '2026-03-18', cardCount: 15 },
      { type: 'exam-simulation', title: '20 Min: Prüfung Scheitelpunktform & Normalform', topic: 'Scheitelpunktform', completed: false, assignedDate: '2026-03-20', examDurationMinutes: 20 },
      { type: 'flashcards', title: '15 Karteikarten: Textaufgaben quadratische Funktionen', topic: 'Textaufgaben', completed: false, assignedDate: '2026-03-22', cardCount: 15 },
    ],
  },
  {
    id: 'ag2', topic: 'Passé Composé', subject: 'Französisch',
    dueDate: '2026-04-05', originalDueDate: '2026-03-25',
    masteryStart: 20, masteryCurrent: 35, masteryTarget: 100,
    todosCompleted: 2, todosTotal: 6,
    note: 'Passé Composé sicher bilden können – mit être und avoir, auch die Angleichung. Brauche das für den Französisch-Test und will nicht mehr unsicher sein bei den Hilfsverben.',
    aiReasoning: 'Das Ziel wurde verschoben, weil dein Fortschritt trotz 2 erledigten ToDos nur auf 35% gestiegen ist. Die Plattform-Daten zeigen, dass die Hilfsverben être/avoir noch nicht sicher sitzen – die KI empfiehlt, erst die Grundlagen zu festigen.',
    status: 'extended',
    difficulties: [
      { topic: 'être vs. avoir Verwendung', detail: 'Die Wahl des richtigen Hilfsverbs wird häufig verwechselt – besonders bei Bewegungsverben, die être verlangen, wird avoir verwendet.', type: 'major' },
      { topic: 'Participe passé Angleichung', detail: 'Die Angleichung des Partizips bei être-Verben wird vergessen oder falsch angewendet – Genus und Numerus stimmen oft nicht überein.', type: 'major' },
      { topic: 'Unregelmäßige Partizipien', detail: 'Formen wie "fait", "pris", "mis" werden mit den regelmäßigen Endungen verwechselt. Die unregelmäßigen Formen sitzen noch nicht sicher.', type: 'moderate' },
      { topic: 'Verneinung im Passé Composé', detail: 'Die Stellung von "ne...pas" um das Hilfsverb herum wird bei längeren Sätzen unsicher.', type: 'minor' },
    ],
    prepTasks: [
      { type: 'flashcards', title: '15 Karteikarten: être/avoir Konjugation', topic: 'Hilfsverben', completed: true, assignedDate: '2026-03-10', completedDate: '2026-03-11', cardCount: 15, linkedSetId: 304 },
      { type: 'flashcards', title: '15 Karteikarten: Participe passé Formen', topic: 'Participe passé', completed: true, assignedDate: '2026-03-13', completedDate: '2026-03-14', cardCount: 15, linkedSetId: 305 },
      { type: 'exam-simulation', title: '20 Min: Prüfung être/avoir Verwendung', topic: 'Hilfsverben', completed: false, assignedDate: '2026-03-16', examDurationMinutes: 20 },
      { type: 'flashcards', title: '15 Karteikarten: Angleichung bei être', topic: 'Angleichung', completed: false, assignedDate: '2026-03-18', cardCount: 15 },
      { type: 'exam-simulation', title: '25 Min: Prüfung Passé Composé komplett', topic: 'Passé Composé', completed: false, assignedDate: '2026-03-22', examDurationMinutes: 25 },
      { type: 'flashcards', title: '15 Karteikarten: Unregelmäßige Partizipien', topic: 'Unregelmäßige Partizipien', completed: false, assignedDate: '2026-03-25', cardCount: 15 },
    ],
  },
  {
    id: 'ag3', topic: 'Zellatmung verstehen', subject: 'Biologie',
    dueDate: '2026-03-20', originalDueDate: '2026-03-20',
    masteryStart: 35, masteryCurrent: 42, masteryTarget: 100,
    todosCompleted: 1, todosTotal: 5,
    note: 'Zellatmung komplett durcharbeiten – Glykolyse, Citratzyklus und Atmungskette. Will verstehen wie ATP produziert wird und die einzelnen Schritte erklären können.',
    aiReasoning: 'Kaum Fortschritt: Nur von 35% auf 42% gestiegen. Nur 1 ToDo erledigt und keine weiteren Aktivitäten zum Thema erkannt. Ohne tägliches Lernen wird das Ziel in 3 Tagen nicht erreicht.',
    status: 'at-risk',
    difficulties: [
      { topic: 'ATP-Bilanz berechnen', detail: 'Die Gesamt-ATP-Ausbeute aus Glykolyse, Citratzyklus und Atmungskette wird nicht korrekt zusammengerechnet – einzelne Schritte werden vergessen.', type: 'major' },
      { topic: 'Citratzyklus Schritte', detail: 'Die Reihenfolge der Zwischenprodukte im Citratzyklus wird verwechselt. Acetyl-CoA \u2192 Citrat ist klar, aber danach wird es unsicher.', type: 'major' },
      { topic: 'Elektronentransportkette', detail: 'Die Rolle der Elektronencarrier (NADH, FADH\u2082) in der Atmungskette und wie sie zur ATP-Synthese beitragen, ist noch nicht verstanden.', type: 'moderate' },
    ],
    prepTasks: [
      { type: 'flashcards', title: '15 Karteikarten: Glykolyse Grundlagen', topic: 'Glykolyse', completed: true, assignedDate: '2026-03-12', completedDate: '2026-03-13', cardCount: 15, linkedSetId: 306 },
      { type: 'exam-simulation', title: '20 Min: Prüfung Glykolyse Schritte', topic: 'Glykolyse', completed: false, assignedDate: '2026-03-15', examDurationMinutes: 20 },
      { type: 'flashcards', title: '15 Karteikarten: Citratzyklus', topic: 'Citratzyklus', completed: false, assignedDate: '2026-03-17', cardCount: 15 },
      { type: 'flashcards', title: '15 Karteikarten: Atmungskette & ATP', topic: 'Atmungskette', completed: false, assignedDate: '2026-03-18', cardCount: 15 },
      { type: 'exam-simulation', title: '25 Min: Prüfung Zellatmung komplett', topic: 'Zellatmung', completed: false, assignedDate: '2026-03-19', examDurationMinutes: 25 },
    ],
  },
];

export const MOCK_GOAL_RECOMMENDATIONS: GoalRecommendation[] = [
  { id: 'gr1', goalId: 'ag1', topic: 'Scheitelpunktform', subject: 'Mathematik', reason: 'Dein Fortschritt bei der Scheitelpunktform liegt bei nur 32% – das ist eine Kernkompetenz für quadratische Funktionen. Karteikarten helfen dir, die Umwandlung zu verinnerlichen.', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr2', goalId: 'ag1', topic: 'Nullstellen berechnen', subject: 'Mathematik', reason: 'Die p-q-Formel und das Faktorisieren sind essenziell. Dein letzter Übungstest zeigt Unsicherheiten bei Sonderfällen (Diskriminante = 0).', severity: 'warning', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr3', goalId: 'ag1', topic: 'Graphen verschieben & strecken', subject: 'Mathematik', reason: 'Du kannst bereits Grundformen zeichnen, aber Verschiebungen mit Parametern a, d und e solltest du noch üben, um dein Ziel zu erreichen.', severity: 'moderate', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr4', goalId: 'ag2', topic: 'Hilfsverben être/avoir', subject: 'Französisch', reason: 'Die KI hat erkannt, dass du être-Verben mit avoir konjugierst. Diese Grundlage muss sitzen, bevor du komplexere Sätze bildest.', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr5', goalId: 'ag2', topic: 'Participe passé Angleichung', subject: 'Französisch', reason: 'Die Angleichung bei être-Verben fehlt in 70% deiner Übungen. Gezieltes Training schließt diese Lücke schnell.', severity: 'warning', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr6', goalId: 'ag2', topic: 'Unregelmäßige Partizipien', subject: 'Französisch', reason: 'Die häufigsten unregelmäßigen Formen (fait, dit, pris, mis) solltest du noch absichern – sie kommen in fast jeder Aufgabe vor.', severity: 'moderate', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr7', goalId: 'ag3', topic: 'Glykolyse Schritte', subject: 'Biologie', reason: 'Du hast die Glykolyse noch gar nicht aktiv geübt. Sie ist der erste Schritt der Zellatmung und Grundlage für alles Weitere.', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr8', goalId: 'ag3', topic: 'Citratzyklus', subject: 'Biologie', reason: 'Ohne Verständnis des Citratzyklus fehlt dir die Verbindung zwischen Glykolyse und Atmungskette. Empfohlene Wiederholung.', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr9', goalId: 'ag3', topic: 'Atmungskette & ATP-Synthese', subject: 'Biologie', reason: 'Der Elektronentransport ist komplex, aber wenn du die vorherigen Schritte verstehst, wirst du auch die Atmungskette schaffen.', severity: 'warning', actions: ['flashcards', 'exam-simulation'] },
];

export const MOCK_COMPLETED_GOAL_INSIGHTS: CompletedGoalInsight[] = [
  { id: 'cg1', topic: 'Lineare Gleichungen', subject: 'Mathematik', plannedDays: 14, actualDays: 12, completedOnTime: true, completedDate: '2026-03-05' },
  { id: 'cg2', topic: 'Simple Past', subject: 'Englisch', plannedDays: 10, actualDays: 8, completedOnTime: true, completedDate: '2026-02-20' },
  { id: 'cg3', topic: 'Photosynthese', subject: 'Biologie', plannedDays: 12, actualDays: 12, completedOnTime: true, completedDate: '2026-02-15' },
  { id: 'cg4', topic: 'Erörterung Aufbau', subject: 'Deutsch', plannedDays: 7, actualDays: 11, completedOnTime: false, completedDate: '2026-01-28' },
  { id: 'cg5', topic: 'Vokabeln B2 Unit 1-3', subject: 'Englisch', plannedDays: 21, actualDays: 19, completedOnTime: true, completedDate: '2026-01-10' },
];

export type GoalsSubToggle = 'exams' | 'goals';
export type TabKey = 'overview' | 'progress' | 'prognosis' | 'goals' | 'performance';
export type PrognosisSubView = 'overview' | 'allWeaknesses' | 'allGaps' | 'allRisks';
