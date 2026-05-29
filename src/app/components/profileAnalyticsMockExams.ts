// Extracted MOCK_UPCOMING_EXAMS data for ProfileAnalyticsScreen
// Clean version with cardCount, examDurationMinutes, and linkedSetId fields

export interface ExamTopicReadiness {
  name: string;
  category: string;
  mastery: number;
}

export interface ExamInsight {
  type: 'strength' | 'weakness' | 'not-practiced';
  topic: string;
  detail: string;
}

export interface ExamPastComparisonData {
  subject: string;
  date: string;
  daysBeforeReadiness: number;
  daysBeforeExam: number;
  grade: number;
}

export interface ExamRecommendation {
  id: string;
  topic: string;
  subject: string;
  reason: string;
  severity: 'critical' | 'warning' | 'moderate';
  actions: ('flashcards' | 'exam-simulation')[];
}

export interface UpcomingExam {
  id: string;
  subject: string;
  date: string;
  prepStartDate: string;
  selectedTopics: ExamTopicReadiness[];
  overallReadiness: number;
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
  dataSources: { label: string; count: number }[];
  aiAssessment: string;
  insights: ExamInsight[];
  pastComparison: ExamPastComparisonData | null;
  recommendations: ExamRecommendation[];
}

export const MOCK_UPCOMING_EXAMS: UpcomingExam[] = [
  {
    id: 'ue1',
    subject: 'Mathematik',
    date: '2026-03-22',
    prepStartDate: '2026-03-01',
    selectedTopics: [
      { name: 'Bruchrechnung', category: 'Zahlen & Operationen', mastery: 82 },
      { name: 'Prozentrechnung', category: 'Zahlen & Operationen', mastery: 74 },
      { name: 'Lineare Funktionen', category: 'Funktionen', mastery: 78 },
      { name: 'Steigungsberechnung', category: 'Funktionen', mastery: 52 },
    ],
    overallReadiness: 72,
    prepTasks: [
      { type: 'flashcards', title: '15 Karteikarten: Bruchrechnung durchgehen', topic: 'Bruchrechnung', completed: true, assignedDate: '2026-03-02', completedDate: '2026-03-02', cardCount: 15, linkedSetId: 101 },
      { type: 'exam-simulation', title: '20 Min: Pr\u00fcfung Bruchrechnung & Prozent absolvieren', topic: 'Bruchrechnung', completed: true, assignedDate: '2026-03-03', completedDate: '2026-03-04', examDurationMinutes: 20 },
      { type: 'flashcards', title: '15 Karteikarten: Prozentrechnung durchgehen', topic: 'Prozentrechnung', completed: true, assignedDate: '2026-03-05', completedDate: '2026-03-05', cardCount: 15, linkedSetId: 102 },
      { type: 'flashcards', title: '15 Karteikarten: Lineare Funktionen durchgehen', topic: 'Lineare Funktionen', completed: true, assignedDate: '2026-03-06', completedDate: '2026-03-07', cardCount: 15, linkedSetId: 103 },
      { type: 'exam-simulation', title: '25 Min: Pr\u00fcfung Lineare Funktionen absolvieren', topic: 'Lineare Funktionen', completed: true, assignedDate: '2026-03-08', completedDate: '2026-03-08', examDurationMinutes: 25 },
      { type: 'flashcards', title: '15 Karteikarten: Steigungsberechnung durchgehen', topic: 'Steigungsberechnung', completed: false, assignedDate: '2026-03-15', cardCount: 15 },
      { type: 'exam-simulation', title: '20 Min: Pr\u00fcfung Steigungsberechnung absolvieren', topic: 'Steigungsberechnung', completed: false, assignedDate: '2026-03-16', examDurationMinutes: 20 },
    ],
    dataSources: [
      { label: 'Karteikarten', count: 3 },
      { label: 'Pr\u00fcfungssimulationen', count: 2 },
      { label: 'Chat-Fragen', count: 5 },
    ],
    aiAssessment: 'Deine Vorbereitung liegt bei 72% basierend auf Karteikarten, Pr\u00fcfungssimulationen und Chat-Interaktionen. Steigungsberechnung braucht noch Aufmerksamkeit.',
    insights: [
      { type: 'strength', topic: 'Bruchrechnung', detail: 'Sitzt gut \u2013 3 Karteikarten-Sessions fehlerfrei, Pr\u00fcfungssimulation 91%' },
      { type: 'strength', topic: 'Lineare Funktionen', detail: 'Solide Basis \u2013 letzte Pr\u00fcfungssimulation 84%, Chat-Fragen korrekt beantwortet' },
      { type: 'weakness', topic: 'Steigungsberechnung', detail: 'Wiederkehrende Fehler bei negativen Steigungen und Steigungsdreieck \u2013 in 2 von 3 \u00dcbungen Probleme' },
      { type: 'not-practiced', topic: 'Prozentrechnung Textaufgaben', detail: 'Grundlagen sitzen (74%), aber Textaufgaben-Umwandlung noch nicht gezielt ge\u00fcbt' },
      { type: 'weakness', topic: 'Gleichungen lösen', detail: 'Äquivalenzumformungen bei Bruchgleichungen noch unsicher \u2013 2 von 4 Aufgaben fehlerhaft' },
      { type: 'not-practiced', topic: 'Koordinatengeometrie', detail: 'Mittelpunkt und Abstand zweier Punkte noch gar nicht geübt \u2013 kommt aber laut Lehrplan dran' },
    ],
    pastComparison: {
      subject: 'Mathematik',
      date: '2026-01-15',
      daysBeforeReadiness: 65,
      daysBeforeExam: 5,
      grade: 3,
    },
    recommendations: [
      { id: 'rec1', topic: 'Steigungsberechnung', subject: 'Mathematik', reason: 'Wiederkehrende Fehler bei negativen Steigungen \u2013 gezieltes \u00dcben kann deinen Score um ~15% heben', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
      { id: 'rec2', topic: 'Prozentrechnung Textaufgaben', subject: 'Mathematik', reason: 'Grundlagen sitzen, aber Textaufgaben noch nicht ge\u00fcbt \u2013 hohe Klausur-Relevanz', severity: 'warning', actions: ['flashcards', 'exam-simulation'] },
      { id: 'rec1b', topic: 'Koordinatengeometrie', subject: 'Mathematik', reason: 'Mittelpunkt und Abstand zweier Punkte noch gar nicht geübt – kommt laut Lehrplan in der Klausur dran', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
      { id: 'rec1c', topic: 'Gleichungen lösen', subject: 'Mathematik', reason: 'Bruchgleichungen und Äquivalenzumformungen festigen – das sichert dir Punkte bei Standardaufgaben', severity: 'warning', actions: ['flashcards', 'exam-simulation'] },
      { id: 'rec1d', topic: 'Funktionsgraphen deuten', subject: 'Mathematik', reason: 'Ablesen von Nullstellen und Schnittpunkten noch unsicher – kurze Übung reicht aus', severity: 'moderate', actions: ['flashcards', 'exam-simulation'] },
    ],
  },
  {
    id: 'ue2',
    subject: 'Deutsch',
    date: '2026-03-27',
    prepStartDate: '2026-03-04',
    selectedTopics: [
      { name: 'Er\u00f6rterung', category: 'Texte schreiben', mastery: 86 },
      { name: 'Gedichtanalyse', category: 'Texte lesen & verstehen', mastery: 48 },
    ],
    overallReadiness: 67,
    prepTasks: [
      { type: 'flashcards', title: '15 Karteikarten: Er\u00f6rterung Aufbau durchgehen', topic: 'Er\u00f6rterung', completed: true, assignedDate: '2026-03-05', completedDate: '2026-03-05', cardCount: 15, linkedSetId: 201 },
      { type: 'exam-simulation', title: '20 Min: Pr\u00fcfung Er\u00f6rterung absolvieren', topic: 'Er\u00f6rterung', completed: true, assignedDate: '2026-03-06', completedDate: '2026-03-08', examDurationMinutes: 20 },
      { type: 'exam-simulation', title: '25 Min: Pr\u00fcfung Gedichtanalyse \u2013 Stilmittel absolvieren', topic: 'Gedichtanalyse', completed: false, assignedDate: '2026-03-14', examDurationMinutes: 25 },
    ],
    dataSources: [
      { label: 'Pr\u00fcfungssimulationen', count: 1 },
      { label: 'Chat-Fragen', count: 3 },
    ],
    aiAssessment: 'Er\u00f6rterung sitzt gut, aber Gedichtanalyse zieht den Schnitt runter. Die gezielten ToDos fokussieren auf Stilmittel und Metrik.',
    insights: [
      { type: 'strength', topic: 'Er\u00f6rterung', detail: 'Sehr gut vorbereitet \u2013 Pr\u00fcfungssimulation mit 89% bestanden, Argumentationsstruktur sitzt' },
      { type: 'weakness', topic: 'Gedichtanalyse', detail: 'Stilmittel werden oft verwechselt (Metapher/Vergleich), Metrik-Analyse unsicher' },
      { type: 'not-practiced', topic: 'Reimschema-Analyse', detail: 'Wurde in Chat-Fragen erw\u00e4hnt, aber noch nie aktiv ge\u00fcbt' },
    ],
    pastComparison: {
      subject: 'Deutsch',
      date: '2025-12-10',
      daysBeforeReadiness: 38,
      daysBeforeExam: 10,
      grade: 4,
    },
    recommendations: [
      { id: 'rec3', topic: 'Gedichtanalyse', subject: 'Deutsch', reason: 'Stilmittel-Verwechslungen beheben \u2013 das allein kann den Score stark verbessern', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
      { id: 'rec4', topic: 'Reimschema-Analyse', subject: 'Deutsch', reason: 'Noch nie ge\u00fcbt, aber klausurrelevant \u2013 schneller Einstieg m\u00f6glich', severity: 'moderate', actions: ['flashcards', 'exam-simulation'] },
      { id: 'rec3b', topic: 'Erzählperspektiven', subject: 'Deutsch', reason: 'Auktorial vs. personal wird häufig verwechselt – ein Durchgang reicht zur Sicherheit', severity: 'warning', actions: ['flashcards', 'exam-simulation'] },
      { id: 'rec3c', topic: 'Kommasetzung', subject: 'Deutsch', reason: 'Wiederkehrende Fehler bei Relativsätzen – gezielte Übung vermeidet Punktabzug', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
    ],
  },
  {
    id: 'ue3',
    subject: 'Biologie',
    date: '2026-04-02',
    prepStartDate: '2026-03-08',
    selectedTopics: [
      { name: 'Mendelsche Regeln', category: 'Genetik', mastery: 65 },
      { name: 'DNA-Aufbau', category: 'Genetik', mastery: 58 },
    ],
    overallReadiness: 54,
    prepTasks: [
      { type: 'flashcards', title: '15 Karteikarten: DNA-Aufbau durchgehen', topic: 'DNA-Aufbau', completed: false, assignedDate: '2026-03-12', cardCount: 15 },
    ],
    dataSources: [
      { label: 'Chat-Fragen', count: 2 },
    ],
    aiAssessment: 'Noch am Anfang der Vorbereitung. Starte jetzt mit den gezielten ToDos und Karteikarten.',
    insights: [
      { type: 'weakness', topic: 'DNA-Aufbau', detail: 'Grundstruktur noch unsicher \u2013 Basenpaare und Doppelhelix werden verwechselt' },
      { type: 'not-practiced', topic: 'Mendelsche Regeln', detail: 'Nur im Chat angefragt, noch keine aktive \u00dcbung durchgef\u00fchrt' },
    ],
    pastComparison: {
      subject: 'Biologie',
      date: '2025-11-20',
      daysBeforeReadiness: 85,
      daysBeforeExam: 16,
      grade: 2,
    },
    recommendations: [
      { id: 'rec5', topic: 'DNA-Aufbau', subject: 'Biologie', reason: 'Grundlagen festigen \u2013 das ist die Basis f\u00fcr alle Genetik-Themen', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
      { id: 'rec6', topic: 'Mendelsche Regeln', subject: 'Biologie', reason: 'Noch nicht ge\u00fcbt, hohe Relevanz \u2013 Kreuzungsschema \u00fcben', severity: 'moderate', actions: ['flashcards', 'exam-simulation'] },
      { id: 'rec5b', topic: 'Proteinbiosynthese', subject: 'Biologie', reason: 'Transkription und Translation sind Grundlage für Klausurfragen zur Genexpression', severity: 'warning', actions: ['flashcards', 'exam-simulation'] },
    ],
  },
  {
    id: 'ue4',
    subject: 'Englisch',
    date: '2026-04-08',
    prepStartDate: '2026-02-10',
    selectedTopics: [
      { name: 'Listening Comprehension', category: 'Skills', mastery: 71 },
    ],
    overallReadiness: 71,
    prepTasks: [
      { type: 'flashcards', title: '15 Karteikarten: Listening Vokabeln durchgehen', topic: 'Listening Comprehension', completed: true, assignedDate: '2026-03-01', completedDate: '2026-03-01', cardCount: 15, linkedSetId: 401 },
      { type: 'exam-simulation', title: '20 Min: Pr\u00fcfung Listening Comprehension absolvieren', topic: 'Listening Comprehension', completed: true, assignedDate: '2026-03-02', completedDate: '2026-03-03', examDurationMinutes: 20 },
      { type: 'flashcards', title: '15 Karteikarten: Listening Keywords durchgehen', topic: 'Listening Comprehension', completed: true, assignedDate: '2026-03-04', completedDate: '2026-03-04', cardCount: 15, linkedSetId: 402 },
    ],
    dataSources: [
      { label: 'Pr\u00fcfungssimulationen', count: 1 },
      { label: 'Chat-Fragen', count: 4 },
    ],
    aiAssessment: 'Gute Vorbereitung. Die letzte Simulation lief solide \u2013 noch ein Durchgang festigt das.',
    insights: [
      { type: 'strength', topic: 'Listening Comprehension', detail: 'Grundverst\u00e4ndnis gut \u2013 letzte Simulation 78% korrekt' },
    ],
    pastComparison: null,
    recommendations: [
      { id: 'rec7', topic: 'Listening Comprehension', subject: 'Englisch', reason: 'Ein weiterer \u00dcbungsdurchgang kann deine Sicherheit festigen', severity: 'moderate', actions: ['flashcards', 'exam-simulation'] },
      { id: 'rec7b', topic: 'Vocabulary in Context', subject: 'Englisch', reason: 'Unbekannte Wörter aus dem Kontext erschließen – das wird in Listening-Tests häufig geprüft', severity: 'warning', actions: ['flashcards', 'exam-simulation'] },
      { id: 'rec7c', topic: 'Note-Taking Skills', subject: 'Englisch', reason: 'Mitschreiben während des Hörens üben – verbessert die Trefferquote bei Detail-Fragen deutlich', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
    ],
  },
];

// ===== COMPLETED EXAMS (past dates, for "Abgeschlossene Klausuren") =====
export interface CompletedExam {
  id: string;
  subject: string;
  date: string; // ISO date string
  overallReadiness: number; // readiness at time of exam
}

export const MOCK_COMPLETED_EXAMS: CompletedExam[] = [
  { id: 'ce1', subject: 'Mathematik', date: '2026-03-15', overallReadiness: 65 },
  { id: 'ce2', subject: 'Physik', date: '2026-03-10', overallReadiness: 78 },
  { id: 'ce3', subject: 'Deutsch', date: '2026-03-03', overallReadiness: 82 },
  { id: 'ce4', subject: 'Englisch', date: '2026-02-25', overallReadiness: 91 },
  { id: 'ce5', subject: 'Biologie', date: '2026-02-18', overallReadiness: 44 },
  { id: 'ce6', subject: 'Französisch', date: '2026-02-10', overallReadiness: 56 },
  { id: 'ce7', subject: 'Geschichte', date: '2026-01-28', overallReadiness: 73 },
  { id: 'ce8', subject: 'Chemie', date: '2026-03-12', overallReadiness: 58 },
  { id: 'ce9', subject: 'Mathematik', date: '2026-02-28', overallReadiness: 71 },
  { id: 'ce10', subject: 'Kunst', date: '2026-03-05', overallReadiness: 88 },
];
// Pre-seeded grades (some exams already have grades entered)
import { examGradesStore } from './examGradesStore';
examGradesStore.setGrade('ce1', '3+');
examGradesStore.setGrade('ce3', '2');
examGradesStore.setGrade('ce4', '1-');
examGradesStore.setGrade('ce5', '4+');
examGradesStore.setGrade('ce7', '2+');