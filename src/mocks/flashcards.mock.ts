import type { FlashcardSet } from '@/types';

// ===== FLASHCARD SETS MOCK DATA =====
// Vollständige Mock-Daten für Flashcard Sets
// All data is scoped to alexanderbaum@gmail.com (main dev user)

// Prognosis-Daten werden weiter unten definiert und hier zusammengeführt
// Dadurch sind sie in allSets verfügbar wenn später eine API kommt

// ✅ FIX: Hardcode user ID for mock data (belongs to alexanderbaum@gmail.com)
// Don't use getCurrentUserId() at import time - it won't work!
const MOCK_USER_ID = 'user_alexanderbaum_mock_123';

// ===== PROGNOSIS MOCK DATA =====
// Speziell für Prognosen-Feature: Schwächen und relevante Themen

export const mockPrognosisWeakness: FlashcardSet[] = [
  // Erkannte Schwächen - Mathematik
  {
    id: 5001,
    userId: MOCK_USER_ID,
    title: 'Quadratische Funktionen - Scheitelpunktform',
    subject: 'Mathematik',
    kategorie: 'Analysis',
    thema: 'Quadratische Funktionen',
    unterthema: 'Scheitelpunktform',
    type: 'weakness',
    cardCount: 12,
    lastOpened: new Date('2026-02-07'),
    createdDate: new Date('2026-02-07'),
    progress: 45,
  },
  {
    id: 5002,
    userId: MOCK_USER_ID,
    title: 'Binomische Formeln - Anwendung',
    subject: 'Mathematik',
    kategorie: 'Algebra',
    thema: 'Terme und Gleichungen',
    unterthema: 'Binomische Formeln',
    type: 'weakness',
    cardCount: 15,
    lastOpened: new Date('2026-02-06'),
    createdDate: new Date('2026-02-06'),
    progress: 33,
  },
  // Erkannte Schwächen - Biologie
  {
    id: 5003,
    userId: MOCK_USER_ID,
    title: 'Fotosynthese - Lichtabhängige Reaktion',
    subject: 'Biologie',
    kategorie: 'Ökologie',
    thema: 'Stoffwechsel',
    unterthema: 'Fotosynthese',
    type: 'weakness',
    cardCount: 18,
    lastOpened: new Date('2026-02-08'),
    createdDate: new Date('2026-02-08'),
    progress: 28,
  },
  {
    id: 5004,
    userId: MOCK_USER_ID,
    title: 'Genetik - Mendelsche Regeln',
    subject: 'Biologie',
    kategorie: 'Genetik',
    thema: 'Vererbungslehre',
    unterthema: 'Mendelsche Regeln',
    type: 'weakness',
    cardCount: 20,
    lastOpened: new Date('2026-02-05'),
    createdDate: new Date('2026-02-05'),
    progress: 40,
  },
  // Erkannte Schwächen - Geschichte
  {
    id: 5005,
    userId: MOCK_USER_ID,
    title: 'Französische Revolution - Ursachen',
    subject: 'Geschichte',
    kategorie: 'Neuzeit',
    thema: 'Revolutionen',
    unterthema: 'Französische Revolution',
    type: 'weakness',
    cardCount: 14,
    lastOpened: new Date('2026-02-04'),
    createdDate: new Date('2026-02-04'),
    progress: 50,
  },
];

export const mockPrognosisRelevant: FlashcardSet[] = [
  // Relevante Themen - Mathematik
  {
    id: 6001,
    userId: MOCK_USER_ID,
    title: 'Ableitungen - Grundlagen',
    subject: 'Mathematik',
    kategorie: 'Analysis',
    thema: 'Differentialrechnung',
    unterthema: 'Ableitungsregeln',
    type: 'risk',
    cardCount: 25,
    lastOpened: new Date('2026-02-09'),
    createdDate: new Date('2026-02-09'),
    progress: 72,
  },
  {
    id: 6002,
    userId: MOCK_USER_ID,
    title: 'Vektorrechnung - Skalarprodukt',
    subject: 'Mathematik',
    kategorie: 'Geometrie',
    thema: 'Vektorrechnung',
    unterthema: 'Skalarprodukt',
    type: 'risk',
    cardCount: 16,
    lastOpened: new Date('2026-02-08'),
    createdDate: new Date('2026-02-08'),
    progress: 65,
  },
  // Relevante Themen - Chemie
  {
    id: 6003,
    userId: MOCK_USER_ID,
    title: 'Säure-Base-Reaktionen - pH-Wert',
    subject: 'Chemie',
    kategorie: 'Allgemeine Chemie',
    thema: 'Säuren und Basen',
    unterthema: 'pH-Wert Berechnung',
    type: 'risk',
    cardCount: 22,
    lastOpened: new Date('2026-02-07'),
    createdDate: new Date('2026-02-07'),
    progress: 68,
  },
  {
    id: 6004,
    userId: MOCK_USER_ID,
    title: 'Organische Chemie - Alkane',
    subject: 'Chemie',
    kategorie: 'Organische Chemie',
    thema: 'Kohlenwasserstoffe',
    unterthema: 'Alkane',
    type: 'risk',
    cardCount: 18,
    lastOpened: new Date('2026-02-06'),
    createdDate: new Date('2026-02-06'),
    progress: 55,
  },
  // Relevante Themen - Englisch
  {
    id: 6005,
    userId: MOCK_USER_ID,
    title: 'Grammar - Present Perfect',
    subject: 'Englisch',
    kategorie: 'Grammar',
    thema: 'Tenses',
    unterthema: 'Present Perfect',
    type: 'risk',
    cardCount: 20,
    lastOpened: new Date('2026-02-09'),
    createdDate: new Date('2026-02-09'),
    progress: 80,
  },
  // Relevante Themen - Physik
  {
    id: 6006,
    userId: MOCK_USER_ID,
    title: 'Mechanik - Newtonsche Gesetze',
    subject: 'Physik',
    kategorie: 'Mechanik',
    thema: 'Dynamik',
    unterthema: 'Newtonsche Axiome',
    type: 'risk',
    cardCount: 15,
    lastOpened: new Date('2026-02-05'),
    createdDate: new Date('2026-02-05'),
    progress: 60,
  },
];

// ===== WISSENSLÜCKEN MOCK DATA =====
// KI-erkannte tieferliegende Wissenslücken als Karteikarten-Sets
export const mockPrognosisKnowledgeGaps: FlashcardSet[] = [
  {
    id: 8001,
    userId: MOCK_USER_ID,
    title: 'Bruchrechnung - Grundoperationen',
    subject: 'Mathematik',
    kategorie: 'Arithmetik',
    thema: 'Bruchrechnung',
    unterthema: 'Grundoperationen',
    type: 'knowledge-gap',
    cardCount: 18,
    lastOpened: new Date('2026-02-10'),
    createdDate: new Date('2026-02-10'),
    progress: 28,
  },
  {
    id: 8002,
    userId: MOCK_USER_ID,
    title: 'Textverständnis - Analyse längerer Texte',
    subject: 'Englisch',
    kategorie: 'Reading',
    thema: 'Text Analysis',
    unterthema: 'Comprehension',
    type: 'knowledge-gap',
    cardCount: 14,
    lastOpened: new Date('2026-02-08'),
    createdDate: new Date('2026-02-08'),
    progress: 35,
  },
  {
    id: 8003,
    userId: MOCK_USER_ID,
    title: 'Stöchiometrie - Mol & Stoffmenge',
    subject: 'Chemie',
    kategorie: 'Allgemeine Chemie',
    thema: 'Stöchiometrie',
    unterthema: 'Mol-Berechnungen',
    type: 'knowledge-gap',
    cardCount: 20,
    lastOpened: new Date('2026-02-07'),
    createdDate: new Date('2026-02-07'),
    progress: 22,
  },
  {
    id: 8004,
    userId: MOCK_USER_ID,
    title: 'Binomische Formeln - Sichere Anwendung',
    subject: 'Mathematik',
    kategorie: 'Algebra',
    thema: 'Terme und Gleichungen',
    unterthema: 'Binomische Formeln',
    type: 'knowledge-gap',
    cardCount: 16,
    lastOpened: new Date('2026-02-06'),
    createdDate: new Date('2026-02-06'),
    progress: 40,
  },
  {
    id: 8005,
    userId: MOCK_USER_ID,
    title: 'Zellatmung vs. Photosynthese',
    subject: 'Biologie',
    kategorie: 'Zellbiologie',
    thema: 'Stoffwechsel',
    unterthema: 'Energiegewinnung',
    type: 'knowledge-gap',
    cardCount: 12,
    lastOpened: new Date('2026-02-05'),
    createdDate: new Date('2026-02-05'),
    progress: 30,
  },
];

// ===== REGULÄRE LERN-SETS (vom Schüler erstellt/gelernt) =====
// Diese Sets werden im Aktivitätsfeed referenziert via setId
export const mockRegularSets: FlashcardSet[] = [
  {
    id: 7001,
    userId: MOCK_USER_ID,
    title: 'Lineare Gleichungen',
    subject: 'Mathematik',
    kategorie: 'Algebra',
    thema: 'Gleichungen',
    unterthema: 'Lineare Gleichungen',
    cardCount: 24,
    lastOpened: new Date('2026-03-11'),
    createdDate: new Date('2026-02-15'),
    progress: 78,
  },
  {
    id: 7002,
    userId: MOCK_USER_ID,
    title: 'Vokabeln Unit 7',
    subject: 'Englisch',
    kategorie: 'Vocabulary',
    thema: 'Units',
    unterthema: 'Unit 7',
    cardCount: 18,
    lastOpened: new Date('2026-03-09'),
    createdDate: new Date('2026-02-20'),
    progress: 62,
  },
  {
    id: 7003,
    userId: MOCK_USER_ID,
    title: 'Passé Composé',
    subject: 'Französisch',
    kategorie: 'Grammaire',
    thema: 'Temps du passé',
    unterthema: 'Passé Composé',
    cardCount: 30,
    lastOpened: new Date('2026-03-07'),
    createdDate: new Date('2026-02-10'),
    progress: 22,
  },
  {
    id: 7004,
    userId: MOCK_USER_ID,
    title: 'Photosynthese',
    subject: 'Biologie',
    kategorie: 'Ökologie',
    thema: 'Stoffwechsel',
    unterthema: 'Photosynthese',
    cardCount: 20,
    lastOpened: new Date('2026-03-05'),
    createdDate: new Date('2026-02-12'),
    progress: 85,
  },
];

// ===== COMBINED EXPORT =====
// Alle Mock-Daten zusammengeführt für konsistente Verfügbarkeit
// WICHTIG: Wenn später echte API-Daten kommen, müssen Prognosis-Sets 
// im gleichen Response wie andere Sets enthalten sein!
export const MOCK_FLASHCARD_SETS: FlashcardSet[] = [
  ...mockPrognosisWeakness,
  ...mockPrognosisRelevant,
  ...mockPrognosisKnowledgeGaps,
  ...mockRegularSets,
];