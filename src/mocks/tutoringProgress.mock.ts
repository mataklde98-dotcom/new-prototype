// ===== TUTORING PROGRESS MOCK DATA =====
// Redesigned mock data for the student-facing tutoring progress system.
// Supports both Online (with transcription) and Local (teacher feedback only) tutoring variants.
// Data strands: Self-learning (flashcards, exams, AI assistant) + Tutoring (sessions).

// ===== INTERFACES =====

export interface TutoringSessionTopic {
  name: string;
  confidence: number; // 0-100
}

export interface TutoringSessionWeakness {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  source: 'tutoring' | 'self-learning' | 'both';
  subject?: string; // for aggregated view
  isActive?: boolean; // true = still relevant, false = resolved
}

export interface TutoringSessionRecommendation {
  id: string;
  type: 'flashcards' | 'exercises' | 'exam' | 'review';
  title: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  fromTeacher: boolean;
}

export interface TutoringSessionKeyTakeaway {
  id: string;
  text: string;
}

export interface TutoringStudyPlanItem {
  id: string;
  day: string;
  task: string;
  duration: string;
  completed: boolean;
  fromTeacher: boolean;
  actionType?: 'flashcards' | 'exam'; // KI-determined type
  linkedSetId?: string | null; // existing set ID or null
}

export interface TutoringSession {
  id: string;
  subject: string;
  subjectColor: string;
  date: string; // ISO
  duration: number; // minutes
  mainTopic: string;
  teacherName: string;
  status: 'analyzed' | 'pending' | 'scheduled';
  isOnline: boolean;
  aiSummary: string;
  teacherFeedback?: string;
  topicsCovered: TutoringSessionTopic[];
  weaknesses: TutoringSessionWeakness[];
  keyTakeaways: TutoringSessionKeyTakeaway[];
  recommendations: TutoringSessionRecommendation[];
  studyPlan: TutoringStudyPlanItem[];
}

export interface AIKnowledgeGap {
  id: string;
  title: string;
  description: string;
  subject: string;
  severity: 'critical' | 'medium' | 'minor';
  score: number;
}

export interface TopicRequest {
  id: string;
  text: string;
  savedAt: string;
  sessionId: string;
}

export interface TeacherAssignedTask {
  id: string;
  type: 'flashcards' | 'exam';
  title: string;
  description: string;
  subject: string;
  assignedAt: string; // ISO date for display
  sessionId?: string | null; // optional link to a session
  status: 'new' | 'started' | 'completed';
  estimatedMinutes: number;
  credits?: number; // gamification credits reward (not rendered)
  score: number;
  cardCount?: number; // for flashcards: number of cards in the set
  grade?: string; // for completed exams: grade received (e.g. "2+", "3-")
  linkedSetId?: string | null; // for flashcards: linked flashcard set ID if generated
}

export interface SessionRecap {
  sessionId: string;
  topicsCovered: string[];
  strongTopics: string[];
  weakTopics: string[];
  recommendedAction: string;
  isOnline: boolean;
}

export interface UpcomingSession {
  id: string;
  subject: string;
  subjectColor: string;
  topic: string;
  teacherName: string;
  date: string;
  duration: number;
  isOnline: boolean;
  topicRequest?: string | null;
}

export interface TopicMasteryItem {
  id: string;
  topic: string;
  subject: string;
  subjectColor: string;
  status: 'mastered' | 'in_progress' | 'not_started';
  sessionsCount?: number; // how many sessions covered this topic
  lastSessionDate?: string; // ISO
}

export interface ProgressStreak {
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
}

export interface WarmUpQuestion {
  id: string;
  question: string;
  topic: string;
}

// NEW: Aggregated active weakness (for overview)
export interface ActiveWeakness {
  id: string;
  title: string;
  description: string;
  subject: string;
  subjectColor: string;
  severity: 'critical' | 'medium' | 'minor';
  source: 'tutoring' | 'self-learning' | 'both';
  isActive: boolean;
  detectedAt: string; // ISO
  score: number;
}

// NEW: AI Recommendations
export type AIRecommendationSeverity = 'urgent' | 'recommended' | 'beneficial';

export interface AISessionRecommendation {
  id: string;
  title: string;
  description: string;
  subject: string;
  severity: AIRecommendationSeverity;
  score: number; // 0-100
}

// ===== MOCK SESSIONS =====

export const MOCK_SESSIONS: TutoringSession[] = [
  {
    id: 'session_1',
    subject: 'Mathematik',
    subjectColor: '#4A9EFF',
    date: '2026-03-10T16:00:00',
    duration: 60,
    mainTopic: 'Quadratische Funktionen',
    teacherName: 'Frau Schmidt',
    status: 'analyzed',
    isOnline: true,
    aiSummary: 'In dieser Sitzung wurden quadratische Funktionen ausführlich behandelt. Der Schwerpunkt lag auf der pq-Formel und dem Zeichnen von Parabeln. Du hast gute Fortschritte beim Verstehen der Scheitelpunktform gemacht, hattest aber noch Schwierigkeiten beim Umstellen von Gleichungen und beim korrekten Anwenden der pq-Formel bei negativen Diskriminanten.',
    topicsCovered: [
      { name: 'pq-Formel', confidence: 55 },
      { name: 'Parabeln zeichnen', confidence: 40 },
      { name: 'Scheitelpunktform', confidence: 72 },
      { name: 'Nullstellen berechnen', confidence: 48 },
      { name: 'Graphenanalyse', confidence: 65 },
    ],
    weaknesses: [
      { id: 'w1', title: 'pq-Formel anwenden', description: 'Schwierigkeiten beim Einsetzen negativer Werte und Interpretation der Diskriminante.', severity: 'high', source: 'both', subject: 'Mathematik', isActive: true },
      { id: 'w2', title: 'Gleichungen umstellen', description: 'Fehler beim Isolieren der Variable, besonders bei Brüchen.', severity: 'high', source: 'tutoring', subject: 'Mathematik', isActive: true },
      { id: 'w3', title: 'Parabeln korrekt zeichnen', description: 'Achsensymmetrie und Scheitelpunkt werden teilweise verwechselt.', severity: 'medium', source: 'tutoring', subject: 'Mathematik', isActive: true },
    ],
    keyTakeaways: [
      { id: 'kt1', text: 'Die Scheitelpunktform y = a(x-d)² + e zeigt direkt den Scheitelpunkt.' },
      { id: 'kt2', text: 'Die Diskriminante (p/2)² - q entscheidet über die Anzahl der Nullstellen.' },
      { id: 'kt3', text: 'Negative Öffnungen (a < 0) bedeuten, die Parabel ist nach unten geöffnet.' },
    ],
    recommendations: [
      { id: 'r1', type: 'flashcards', title: '15 Karteikarten zur pq-Formel', description: 'Wiederhole die wichtigsten Formeln und Sonderfälle.', estimatedMinutes: 10, completed: false, fromTeacher: true },
      { id: 'r2', type: 'exercises', title: '8 Übungsaufgaben zum Gleichungen umstellen', description: 'Trainiere das Umstellen mit steigender Schwierigkeit.', estimatedMinutes: 20, completed: false, fromTeacher: false },
      { id: 'r3', type: 'exam', title: 'Mini-Prüfungssimulation: Quadratische Funktionen', description: 'Teste dein Wissen unter realistischen Bedingungen.', estimatedMinutes: 25, completed: false, fromTeacher: false },
      { id: 'r4', type: 'review', title: 'Sitzung nochmal erklären lassen', description: 'Lass dir die schwierigsten Konzepte vom AI-Assistenten erneut erklären.', estimatedMinutes: 5, completed: false, fromTeacher: false },
    ],
    studyPlan: [
      { id: 'sp1', day: 'Mittwoch', task: 'pq-Formel wiederholen', duration: '10 Min', completed: true, fromTeacher: true, actionType: 'flashcards', linkedSetId: 'set_pq_001' },
      { id: 'sp2', day: 'Donnerstag', task: 'Gleichungen umstellen üben', duration: '20 Min', completed: false, fromTeacher: false, actionType: 'flashcards', linkedSetId: null },
      { id: 'sp3', day: 'Freitag', task: 'Parabeln zeichnen (3 Aufgaben)', duration: '15 Min', completed: false, fromTeacher: true, actionType: 'exam', linkedSetId: null },
      { id: 'sp4', day: 'Samstag', task: 'Mini-Prüfungssimulation durchführen', duration: '25 Min', completed: false, fromTeacher: false, actionType: 'exam', linkedSetId: 'exam_quad_001' },
      { id: 'sp5', day: 'Sonntag', task: 'Schwächen mit AI durchgehen', duration: '10 Min', completed: false, fromTeacher: false, actionType: 'flashcards', linkedSetId: null },
    ],
  },
  {
    id: 'session_2',
    subject: 'Englisch',
    subjectColor: '#FF6B8A',
    date: '2026-03-07T15:00:00',
    duration: 45,
    mainTopic: 'Essay Structure & Argumentation',
    teacherName: 'Herr Weber',
    status: 'analyzed',
    isOnline: true,
    aiSummary: 'Die Sitzung konzentrierte sich auf den Aufbau eines argumentativen Essays. Du hast die Grundstruktur (Introduction, Body, Conclusion) gut verstanden, aber die Formulierung starker Thesis Statements und die Verwendung von Linking Words müssen noch verbessert werden.',
    topicsCovered: [
      { name: 'Essay Structure', confidence: 70 },
      { name: 'Thesis Statements', confidence: 42 },
      { name: 'Linking Words', confidence: 55 },
      { name: 'Argumentation', confidence: 60 },
    ],
    weaknesses: [
      { id: 'w4', title: 'Thesis Statements formulieren', description: 'Die These ist oft zu allgemein und nicht spezifisch genug.', severity: 'high', source: 'tutoring', subject: 'Englisch', isActive: true },
      { id: 'w5', title: 'Linking Words einsetzen', description: 'Übergänge zwischen Absätzen wirken abrupt.', severity: 'medium', source: 'self-learning', subject: 'Englisch', isActive: false },
    ],
    keyTakeaways: [
      { id: 'kt4', text: 'Ein starkes Thesis Statement muss eine klare Position enthalten.' },
      { id: 'kt5', text: 'Linking Words wie "Furthermore", "However", "In contrast" verbinden Argumente.' },
    ],
    recommendations: [
      { id: 'r5', type: 'flashcards', title: '20 Karteikarten zu Linking Words', description: 'Lerne die wichtigsten Verbindungswörter.', estimatedMinutes: 12, completed: true, fromTeacher: true },
      { id: 'r6', type: 'exercises', title: '5 Thesis Statement Übungen', description: 'Schreibe zu verschiedenen Themen jeweils ein Thesis Statement.', estimatedMinutes: 15, completed: false, fromTeacher: false },
    ],
    studyPlan: [
      { id: 'sp6', day: 'Montag', task: 'Linking Words Karteikarten', duration: '12 Min', completed: true, fromTeacher: true, actionType: 'flashcards', linkedSetId: 'set_linking_001' },
      { id: 'sp7', day: 'Dienstag', task: 'Thesis Statement Übungen', duration: '15 Min', completed: false, fromTeacher: false, actionType: 'exam', linkedSetId: null },
    ],
  },
  {
    id: 'session_3',
    subject: 'Biologie',
    subjectColor: '#00D4AA',
    date: '2026-03-05T14:30:00',
    duration: 60,
    mainTopic: 'Zellteilung: Mitose & Meiose',
    teacherName: 'Frau Müller',
    status: 'analyzed',
    isOnline: false,
    teacherFeedback: 'In dieser Sitzung wurden Mitose und Meiose behandelt. Mitose-Phasen wurden gut verstanden. Bei Meiose bestehen noch Unsicherheiten, besonders beim Crossing-over und der Unterscheidung der Phasen.',
    aiSummary: 'Umfassende Sitzung zur Zellteilung. Mitose-Phasen wurden gut verstanden, bei der Meiose bestehen noch Unsicherheiten – besonders beim Crossing-over und der Unterscheidung von Meiose I und Meiose II.',
    topicsCovered: [
      { name: 'Mitose-Phasen', confidence: 78 },
      { name: 'Meiose I & II', confidence: 45 },
      { name: 'Crossing-over', confidence: 35 },
      { name: 'Diploid / Haploid', confidence: 52 },
      { name: 'Zellzyklus', confidence: 68 },
    ],
    weaknesses: [
      { id: 'w6', title: 'Meiose I vs. Meiose II', description: 'Verwechslung der beiden Teilungsschritte und was jeweils passiert.', severity: 'high', source: 'both', subject: 'Biologie', isActive: true },
      { id: 'w7', title: 'Crossing-over erklären', description: 'Der Austausch genetischen Materials wird nicht sicher beschrieben.', severity: 'medium', source: 'tutoring', subject: 'Biologie', isActive: false },
      { id: 'w8', title: 'Chromosomenzahlen', description: 'Unsicherheit bei der Berechnung von diploid zu haploid.', severity: 'medium', source: 'self-learning', subject: 'Biologie', isActive: false },
    ],
    keyTakeaways: [
      { id: 'kt6', text: 'Mitose = identische Kopie (2n → 2n), Meiose = Halbierung (2n → n).' },
      { id: 'kt7', text: 'Crossing-over findet in der Prophase I der Meiose statt.' },
      { id: 'kt8', text: 'Der Mensch hat 46 Chromosomen (diploid) bzw. 23 (haploid in Keimzellen).' },
    ],
    recommendations: [
      { id: 'r7', type: 'flashcards', title: '12 Karteikarten zu Mitose & Meiose', description: 'Vergleiche die Phasen beider Prozesse.', estimatedMinutes: 8, completed: true, fromTeacher: false },
      { id: 'r8', type: 'exam', title: 'Prüfungssimulation: Zellteilung', description: 'Komplette Prüfungssimulation zum Thema.', estimatedMinutes: 30, completed: false, fromTeacher: true },
    ],
    studyPlan: [
      { id: 'sp8', day: 'Donnerstag', task: 'Karteikarten Mitose & Meiose', duration: '8 Min', completed: true, fromTeacher: false, actionType: 'flashcards', linkedSetId: 'set_zellteilung_001' },
      { id: 'sp9', day: 'Freitag', task: 'Prüfungssimulation durchführen', duration: '30 Min', completed: false, fromTeacher: true, actionType: 'exam', linkedSetId: null },
    ],
  },
  {
    id: 'session_4',
    subject: 'Chemie',
    subjectColor: '#FF8C00',
    date: '2026-03-01T16:30:00',
    duration: 50,
    mainTopic: 'Säuren und Basen',
    teacherName: 'Herr Fischer',
    status: 'analyzed',
    isOnline: false,
    teacherFeedback: 'Grundlagen der Säuren-Basen-Chemie besprochen. pH-Wert-Berechnung und Neutralisation wurden behandelt. Indikatoren und Pufferlösungen sind noch unsichere Themen.',
    aiSummary: 'Grundlagen der Säuren-Basen-Chemie wurden besprochen. pH-Wert-Berechnung und die Reaktionsgleichungen zwischen starken Säuren und Basen wurden behandelt. Indikatoren und Pufferlösungen sind noch unsichere Themen.',
    topicsCovered: [
      { name: 'pH-Wert Berechnung', confidence: 58 },
      { name: 'Neutralisation', confidence: 70 },
      { name: 'Indikatoren', confidence: 40 },
      { name: 'Pufferlösungen', confidence: 30 },
    ],
    weaknesses: [
      { id: 'w9', title: 'pH-Wert bei schwachen Säuren', description: 'Logarithmische Berechnung wird oft falsch angewandt.', severity: 'high', source: 'both', subject: 'Chemie', isActive: true },
      { id: 'w10', title: 'Pufferlösungen verstehen', description: 'Das Prinzip der Pufferung ist unklar.', severity: 'medium', source: 'tutoring', subject: 'Chemie', isActive: true },
    ],
    keyTakeaways: [
      { id: 'kt9', text: 'pH = -log[H+]. Starke Säuren dissoziieren vollständig.' },
      { id: 'kt10', text: 'Neutralisation: Säure + Base → Salz + Wasser.' },
    ],
    recommendations: [
      { id: 'r9', type: 'flashcards', title: '10 Karteikarten zu Säuren & Basen', description: 'Formeln und Definitionen festigen.', estimatedMinutes: 8, completed: false, fromTeacher: false },
      { id: 'r10', type: 'exercises', title: '6 pH-Wert Berechnungen', description: 'Schritt-für-Schritt pH-Wert Aufgaben.', estimatedMinutes: 18, completed: false, fromTeacher: false },
    ],
    studyPlan: [],
  },
];

// ===== AI KNOWLEDGE GAPS =====

export const MOCK_KNOWLEDGE_GAPS: AIKnowledgeGap[] = [
  {
    id: 'gap_1',
    title: 'Bruchrechnung als Grundlage',
    description: 'Die AI hat erkannt, dass Schwierigkeiten bei quadratischen Gleichungen möglicherweise auf unsichere Bruchrechnung zurückzuführen sind.',
    subject: 'Mathematik',
    severity: 'critical',
    score: 85,
  },
  {
    id: 'gap_2',
    title: 'Textverständnis bei Englisch-Aufgaben',
    description: 'Beim Essay-Schreiben zeigt sich, dass du längere englische Texte noch nicht sicher analysieren kannst.',
    subject: 'Englisch',
    severity: 'medium',
    score: 60,
  },
  {
    id: 'gap_3',
    title: 'Stöchiometrie-Grundlagen',
    description: 'Berechnungen mit Mol und Stoffmenge fallen schwer – das beeinflusst auch pH-Wert Aufgaben.',
    subject: 'Chemie',
    severity: 'minor',
    score: 45,
  },
  {
    id: 'gap_4',
    title: 'Binomische Formeln sicher anwenden',
    description: 'Die KI hat festgestellt, dass binomische Formeln beim Vereinfachen von Termen häufig fehlerhaft angewendet werden.',
    subject: 'Mathematik',
    severity: 'critical',
    score: 90,
  },
  {
    id: 'gap_5',
    title: 'Zellatmung vs. Photosynthese',
    description: 'Verwechslung der Reaktionsgleichungen und Edukte/Produkte beider Prozesse – ein häufiges Problem in Klausuren.',
    subject: 'Biologie',
    severity: 'medium',
    score: 65,
  },
  {
    id: 'gap_6',
    title: 'If-Clauses Typ II & III',
    description: 'Beim Essay-Schreiben werden Conditional-Sätze oft falsch gebildet, besonders Typ III mit Past Perfect.',
    subject: 'Englisch',
    severity: 'medium',
    score: 55,
  },
  {
    id: 'gap_7',
    title: 'Oxidationszahlen bestimmen',
    description: 'Redoxreaktionen können nicht korrekt aufgestellt werden, weil die Oxidationszahlen unsicher sind.',
    subject: 'Chemie',
    severity: 'critical',
    score: 80,
  },
];

// ===== TEACHER ASSIGNED TASKS =====

export const MOCK_TEACHER_TASKS: TeacherAssignedTask[] = [
  {
    id: 'tt_1',
    type: 'flashcards',
    title: '15 Karteikarten: Bruchrechnung',
    description: 'Grundlagen der Bruchrechnung festigen',
    subject: 'Mathematik',
    assignedAt: '2026-03-10T17:00:00',
    sessionId: 'session_1',
    status: 'new',
    estimatedMinutes: 10,
    credits: 5,
    score: 0,
    cardCount: 15,
    linkedSetId: null,
  },
  {
    id: 'tt_2',
    type: 'exam',
    title: 'Mini-Prüfung: pq-Formel',
    description: 'Anwendung der pq-Formel testen',
    subject: 'Mathematik',
    assignedAt: '2026-03-10T17:00:00',
    sessionId: 'session_1',
    status: 'new',
    estimatedMinutes: 20,
    credits: 10,
    score: 0,
  },
  {
    id: 'tt_3',
    type: 'flashcards',
    title: 'Linking Words Vokabeln',
    description: 'Wichtige Verbindungswörter für Essays',
    subject: 'Englisch',
    assignedAt: '2026-03-08T10:00:00',
    sessionId: 'session_2',
    status: 'completed',
    estimatedMinutes: 12,
    credits: 5,
    score: 100,
    cardCount: 20,
    linkedSetId: 'set_linking_001',
  },
  {
    id: 'tt_4',
    type: 'exam',
    title: 'Prüfungssimulation: Zellteilung',
    description: 'Mitose & Meiose Verständnis überprüfen',
    subject: 'Biologie',
    assignedAt: '2026-03-05T15:30:00',
    sessionId: 'session_3',
    status: 'completed',
    estimatedMinutes: 30,
    credits: 15,
    score: 100,
    grade: '2+',
  },
  {
    id: 'tt_5',
    type: 'flashcards',
    title: 'Thesis Statement Formulierungen',
    description: 'Verschiedene Thesis-Typen üben',
    subject: 'Englisch',
    assignedAt: '2026-03-12T09:00:00',
    sessionId: null, // generell erteilt, nicht sitzungsbezogen
    status: 'new',
    estimatedMinutes: 15,
    credits: 5,
    score: 0,
    cardCount: 10,
    linkedSetId: null,
  },
];

// ===== ACTIVE WEAKNESSES (aggregated, only current) =====

export const MOCK_ACTIVE_WEAKNESSES: ActiveWeakness[] = [
  {
    id: 'aw_1',
    title: 'pq-Formel anwenden',
    description: 'Schwierigkeiten beim Einsetzen negativer Werte und Interpretation der Diskriminante.',
    subject: 'Mathematik',
    subjectColor: '#4A9EFF',
    severity: 'critical',
    source: 'both',
    isActive: true,
    detectedAt: '2026-03-10T16:00:00',
    score: 85,
  },
  {
    id: 'aw_2',
    title: 'Gleichungen umstellen',
    description: 'Fehler beim Isolieren der Variable, besonders bei Brüchen.',
    subject: 'Mathematik',
    subjectColor: '#4A9EFF',
    severity: 'critical',
    source: 'tutoring',
    isActive: true,
    detectedAt: '2026-03-10T16:00:00',
    score: 90,
  },
  {
    id: 'aw_3',
    title: 'Thesis Statements formulieren',
    description: 'Die These ist oft zu allgemein und nicht spezifisch genug.',
    subject: 'Englisch',
    subjectColor: '#FF6B8A',
    severity: 'medium',
    source: 'tutoring',
    isActive: true,
    detectedAt: '2026-03-07T15:00:00',
    score: 60,
  },
  {
    id: 'aw_4',
    title: 'Meiose I vs. Meiose II',
    description: 'Verwechslung der beiden Teilungsschritte und was jeweils passiert.',
    subject: 'Biologie',
    subjectColor: '#00D4AA',
    severity: 'critical',
    source: 'both',
    isActive: true,
    detectedAt: '2026-03-05T14:30:00',
    score: 80,
  },
  {
    id: 'aw_5',
    title: 'pH-Wert bei schwachen Säuren',
    description: 'Logarithmische Berechnung wird oft falsch angewandt.',
    subject: 'Chemie',
    subjectColor: '#FF8C00',
    severity: 'medium',
    source: 'both',
    isActive: true,
    detectedAt: '2026-03-01T16:30:00',
    score: 70,
  },
  {
    id: 'aw_6',
    title: 'Pufferlösungen verstehen',
    description: 'Das Prinzip der Pufferung ist unklar.',
    subject: 'Chemie',
    subjectColor: '#FF8C00',
    severity: 'minor',
    source: 'tutoring',
    isActive: true,
    detectedAt: '2026-03-01T16:30:00',
    score: 50,
  },
  {
    id: 'aw_7',
    title: 'Parabeln korrekt zeichnen',
    description: 'Achsensymmetrie und Scheitelpunkt werden teilweise verwechselt.',
    subject: 'Mathematik',
    subjectColor: '#4A9EFF',
    severity: 'minor',
    source: 'tutoring',
    isActive: true,
    detectedAt: '2026-03-10T16:00:00',
    score: 40,
  },
];

// Resolved weaknesses count (for counter display)
export const MOCK_RESOLVED_WEAKNESSES_COUNT = 8;

// ===== SESSION RECAP (Latest Session) =====

export const MOCK_SESSION_RECAP: SessionRecap = {
  sessionId: 'session_1',
  topicsCovered: ['pq-Formel', 'Parabeln zeichnen', 'Scheitelpunktform'],
  strongTopics: ['Scheitelpunktform'],
  weakTopics: ['pq-Formel', 'Parabeln zeichnen'],
  recommendedAction: 'Karteikarten zur pq-Formel wiederholen und Übungsaufgaben lösen',
  isOnline: true,
};

// ===== TOPIC MASTERY MAP =====

export const MOCK_MASTERY_MAP: TopicMasteryItem[] = [
  { id: 'tm_1', topic: 'Lineare Gleichungen', subject: 'Mathematik', subjectColor: '#4A9EFF', status: 'mastered', sessionsCount: 3, lastSessionDate: '2026-02-20T16:00:00' },
  { id: 'tm_2', topic: 'pq-Formel', subject: 'Mathematik', subjectColor: '#4A9EFF', status: 'in_progress', sessionsCount: 2, lastSessionDate: '2026-03-10T16:00:00' },
  { id: 'tm_3', topic: 'Bruchrechnung', subject: 'Mathematik', subjectColor: '#4A9EFF', status: 'in_progress', sessionsCount: 1, lastSessionDate: '2026-03-10T16:00:00' },
  { id: 'tm_4', topic: 'Prozentrechnung', subject: 'Mathematik', subjectColor: '#4A9EFF', status: 'mastered', sessionsCount: 2, lastSessionDate: '2026-02-15T16:00:00' },
  { id: 'tm_5', topic: 'Geometrie', subject: 'Mathematik', subjectColor: '#4A9EFF', status: 'not_started', sessionsCount: 0 },
  { id: 'tm_6', topic: 'Scheitelpunktform', subject: 'Mathematik', subjectColor: '#4A9EFF', status: 'in_progress', sessionsCount: 1, lastSessionDate: '2026-03-10T16:00:00' },
  { id: 'tm_7', topic: 'Essay Structure', subject: 'Englisch', subjectColor: '#FF6B8A', status: 'in_progress', sessionsCount: 1, lastSessionDate: '2026-03-07T15:00:00' },
  { id: 'tm_8', topic: 'Linking Words', subject: 'Englisch', subjectColor: '#FF6B8A', status: 'mastered', sessionsCount: 2, lastSessionDate: '2026-03-07T15:00:00' },
  { id: 'tm_9', topic: 'Thesis Statements', subject: 'Englisch', subjectColor: '#FF6B8A', status: 'in_progress', sessionsCount: 1, lastSessionDate: '2026-03-07T15:00:00' },
  { id: 'tm_10', topic: 'Mitose', subject: 'Biologie', subjectColor: '#00D4AA', status: 'mastered', sessionsCount: 1, lastSessionDate: '2026-03-05T14:30:00' },
  { id: 'tm_11', topic: 'Meiose', subject: 'Biologie', subjectColor: '#00D4AA', status: 'in_progress', sessionsCount: 1, lastSessionDate: '2026-03-05T14:30:00' },
  { id: 'tm_12', topic: 'Crossing-over', subject: 'Biologie', subjectColor: '#00D4AA', status: 'in_progress', sessionsCount: 1, lastSessionDate: '2026-03-05T14:30:00' },
  { id: 'tm_13', topic: 'pH-Wert Berechnung', subject: 'Chemie', subjectColor: '#FF8C00', status: 'in_progress', sessionsCount: 1, lastSessionDate: '2026-03-01T16:30:00' },
  { id: 'tm_14', topic: 'Neutralisation', subject: 'Chemie', subjectColor: '#FF8C00', status: 'mastered', sessionsCount: 1, lastSessionDate: '2026-03-01T16:30:00' },
  { id: 'tm_15', topic: 'Pufferlösungen', subject: 'Chemie', subjectColor: '#FF8C00', status: 'not_started', sessionsCount: 0 },
];

// ===== WARM-UP QUESTIONS =====

export const MOCK_WARMUP: WarmUpQuestion[] = [
  { id: 'wu_1', question: 'Was ist die allgemeine Form einer quadratischen Funktion?', topic: 'Quadratische Funktionen' },
  { id: 'wu_2', question: 'Wie berechnet man die Nullstellen mit der pq-Formel?', topic: 'pq-Formel' },
  { id: 'wu_3', question: 'Was beschreibt der Scheitelpunkt einer Parabel?', topic: 'Parabeln' },
];

// ===== OVERALL STATS =====

// Bevorstehende Sitzungen — relativ zu APP_NOW (2026-03-18 12:00) verankert,
// damit sie im Prototyp-Universum dauerhaft sichtbar bleiben.
export const MOCK_UPCOMING_SESSIONS: UpcomingSession[] = [
  {
    id: 'upcoming_1',
    subject: 'Mathematik',
    subjectColor: '#4A9EFF',
    topic: 'Quadratische Ergänzung',
    teacherName: 'Frau Schmidt',
    date: '2026-03-18T16:00:00',
    duration: 60,
    isOnline: true,
    topicRequest: 'Bruchrechnung, Klassenarbeit am Freitag',
  },
  {
    id: 'upcoming_2',
    subject: 'Englisch',
    subjectColor: '#FF6B8A',
    topic: 'Argumentative Essay Writing',
    teacherName: 'Herr Weber',
    date: '2026-03-19T15:00:00',
    duration: 45,
    isOnline: true,
    topicRequest: null,
  },
  {
    id: 'upcoming_3',
    subject: 'Chemie',
    subjectColor: '#FF8C00',
    topic: 'Redoxreaktionen',
    teacherName: 'Herr Fischer',
    date: '2026-03-19T16:30:00',
    duration: 50,
    isOnline: false,
    topicRequest: null,
  },
  {
    id: 'upcoming_4',
    subject: 'Biologie',
    subjectColor: '#00D4AA',
    topic: 'Genetik: Mendelsche Regeln',
    teacherName: 'Frau Müller',
    date: '2026-03-20T14:30:00',
    duration: 60,
    isOnline: false,
    topicRequest: null,
  },
  {
    id: 'upcoming_5',
    subject: 'Mathematik',
    subjectColor: '#4A9EFF',
    topic: 'Lineare Gleichungssysteme',
    teacherName: 'Frau Schmidt',
    date: '2026-03-21T16:00:00',
    duration: 60,
    isOnline: true,
    topicRequest: null,
  },
  {
    id: 'upcoming_6',
    subject: 'Englisch',
    subjectColor: '#FF6B8A',
    topic: 'Reading Comprehension Practice',
    teacherName: 'Herr Weber',
    date: '2026-03-23T15:00:00',
    duration: 45,
    isOnline: true,
    topicRequest: null,
  },
  {
    id: 'upcoming_7',
    subject: 'Physik',
    subjectColor: '#7B61FF',
    topic: 'Newtonsche Mechanik · Kräftezerlegung',
    teacherName: 'Herr Becker',
    date: '2026-03-24T17:00:00',
    duration: 60,
    isOnline: true,
    topicRequest: null,
  },
  {
    id: 'upcoming_8',
    subject: 'Deutsch',
    subjectColor: '#FFB800',
    topic: 'Gedichtanalyse · Romantik',
    teacherName: 'Frau Weber',
    date: '2026-03-25T14:00:00',
    duration: 45,
    isOnline: false,
    topicRequest: null,
  },
];

export const MOCK_OVERALL_STATS = {
  totalSessions: 4,
  totalHours: 3.6,
  averageConfidence: 56,
  weaknessesResolved: MOCK_RESOLVED_WEAKNESSES_COUNT,
  weaknessesActive: MOCK_ACTIVE_WEAKNESSES.filter(w => w.isActive).length,
  weaknessesTotal: MOCK_ACTIVE_WEAKNESSES.filter(w => w.isActive).length + MOCK_RESOLVED_WEAKNESSES_COUNT,
  nextSessionDate: '2026-03-18T16:00:00',
  nextSessionSubject: 'Mathematik',
  nextSessionTopic: 'Quadratische Ergänzung',
  nextSessionTeacher: 'Frau Schmidt',
  streak: { currentStreak: 5, longestStreak: 12, isActive: true } as ProgressStreak,
  trend: 'up' as 'up' | 'stable' | 'down',
  trendDelta: 12,
  pendingTeacherTasks: MOCK_TEACHER_TASKS.filter(t => t.status !== 'completed').length,
  completedTeacherTasks: MOCK_TEACHER_TASKS.filter(t => t.status === 'completed').length,
  savedTopicRequest: {
    id: 'req_1',
    text: 'Bruchrechnung, Klassenarbeit am Freitag',
    savedAt: '2026-03-13T10:00:00',
    sessionId: 'next',
  } as TopicRequest | null,
};

// ===== AI SESSION RECOMMENDATIONS (per session) =====

export const MOCK_AI_SESSION_RECOMMENDATIONS: Record<string, AISessionRecommendation[]> = {
  session_1: [
    { id: 'air_1', title: 'Binomische Formeln wiederholen', description: 'Die KI hat erkannt, dass unsichere binomische Formeln das Vereinfachen bei der pq-Formel erschweren. Ein gezieltes Training kann mehrere Schwächen gleichzeitig beheben.', subject: 'Mathematik', severity: 'urgent', score: 30 },
    { id: 'air_2', title: 'Bruchrechnung vertiefen', description: 'Fehler beim Umstellen von Gleichungen deuten auf Lücken in der Bruchrechnung hin. Diese Grundlage ist essentiell für alle weiteren Themen.', subject: 'Mathematik', severity: 'urgent', score: 20 },
    { id: 'air_3', title: 'Funktionstypen vergleichen', description: 'Ein Vergleich von linearen und quadratischen Funktionen kann dir helfen, Parabeln besser zu verstehen und Graphen sicherer zu analysieren.', subject: 'Mathematik', severity: 'recommended', score: 55 },
    { id: 'air_4', title: 'Koordinatensystem-Training', description: 'Sicheres Arbeiten im Koordinatensystem verbessert das Zeichnen von Parabeln und die Graphenanalyse.', subject: 'Mathematik', severity: 'beneficial', score: 70 },
  ],
  session_2: [
    { id: 'air_5', title: 'Satzstruktur-Grundlagen', description: 'Die KI empfiehlt, englische Satzstrukturen zu festigen, da dies die Formulierung starker Thesis Statements direkt verbessert.', subject: 'Englisch', severity: 'urgent', score: 35 },
    { id: 'air_6', title: 'Argumentationslogik üben', description: 'Logische Verknüpfung von Argumenten trainieren – das verbessert sowohl Linking Words als auch die Gesamtstruktur.', subject: 'Englisch', severity: 'recommended', score: 50 },
    { id: 'air_7', title: 'Muster-Essays analysieren', description: 'Das Lesen und Analysieren von Beispiel-Essays hilft, gute Strukturen und Formulierungen zu verinnerlichen.', subject: 'Englisch', severity: 'beneficial', score: 65 },
  ],
  session_3: [
    { id: 'air_8', title: 'Zellbiologie-Grundlagen', description: 'Die KI hat festgestellt, dass grundlegende Zellstrukturen noch unsicher sind. Das beeinflusst das Verständnis von Mitose und Meiose.', subject: 'Biologie', severity: 'urgent', score: 25 },
    { id: 'air_9', title: 'Genetik-Vorkenntnisse aufbauen', description: 'Crossing-over wird verständlicher, wenn die Grundlagen der Genetik (DNA, Chromosomen) gefestigt sind.', subject: 'Biologie', severity: 'recommended', score: 45 },
  ],
  session_4: [
    { id: 'air_10', title: 'Logarithmen-Grundlagen', description: 'Die pH-Wert-Berechnung erfordert sicheres Arbeiten mit Logarithmen. Ein gezieltes Training kann dieses Defizit beheben.', subject: 'Chemie', severity: 'urgent', score: 20 },
    { id: 'air_11', title: 'Gleichgewichtsreaktionen verstehen', description: 'Pufferlösungen basieren auf chemischen Gleichgewichten. Das Verständnis dieser Grundlage ist entscheidend.', subject: 'Chemie', severity: 'recommended', score: 40 },
    { id: 'air_12', title: 'Periodensystem-Trends', description: 'Die Trends im Periodensystem (Elektronegativität, Säurestärke) helfen beim Verständnis von Säure-Base-Reaktionen.', subject: 'Chemie', severity: 'beneficial', score: 60 },
  ],
};