// ===== CREDIT HISTORY MOCK =====
// Verbrauchte Credits über die letzten ~30 Tage, verankert am APP_NOW des
// Mock-Universums (2026-03-18). Damit der Verlauf im Prototyp dauerhaft
// lebendig aussieht und nicht mit der echten Uhr verschwindet.

import { APP_NOW } from './extraSessions.mock';

export type CreditCategory = 'flashcards' | 'exam' | 'klassenarbeit' | 'schulaufgaben' | 'ai';

export interface CreditEntry {
  id: string;
  category: CreditCategory;
  title: string;
  subtitle?: string;
  credits: number; // positiv, Anzahl verbrauchter Credits
  timestamp: Date;
}

export interface CreditCategoryMeta {
  key: CreditCategory;
  label: string;
  color: string;
}

export const CREDIT_CATEGORIES: CreditCategoryMeta[] = [
  { key: 'flashcards',    label: 'Karteikarten',       color: '#4A9EFF' },
  { key: 'exam',          label: 'Prüfungssimulation', color: '#9B87FF' },
  { key: 'klassenarbeit', label: 'Klassenarbeiten',    color: '#FFB84D' },
  { key: 'schulaufgaben', label: 'Schulaufgaben',      color: '#06B6D4' },
  { key: 'ai',            label: 'Lernassistent',      color: '#00D4AA' },
];

export function categoryMeta(key: CreditCategory): CreditCategoryMeta {
  return CREDIT_CATEGORIES.find((c) => c.key === key) ?? CREDIT_CATEGORIES[0];
}

/**
 * Baut ein Date relativ zu APP_NOW:
 *   - daysAgo: Tage vor APP_NOW
 *   - hour/minute: Uhrzeit an diesem Tag
 */
function at(daysAgo: number, hour: number, minute = 0): Date {
  const d = new Date(APP_NOW);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function entry(
  id: string,
  category: CreditCategory,
  title: string,
  subtitle: string | undefined,
  credits: number,
  daysAgo: number,
  hour: number,
  minute = 0,
): CreditEntry {
  return { id, category, title, subtitle, credits, timestamp: at(daysAgo, hour, minute) };
}

// Seeded history: 60+ entries über ~30 Tage, realistische Muster
// (mehr Karteikarten + Chat als Klausuren; Peaks abends/am Wochenende)
export const MOCK_CREDIT_HISTORY: CreditEntry[] = [
  // === Heute (daysAgo = 0) ===
  entry('ch-001', 'flashcards',    'Karteikarten generiert',    'Mathe · Bruchrechnung · 12 Karten',      6, 0, 17, 42),
  entry('ch-002', 'exam',          'Prüfungssimulation',        'Mathe · Quadratische Gleichungen · 45 Min', 15, 0, 16, 5),
  entry('ch-003', 'flashcards',    'Karteikarten generiert',    'Biologie · Zellteilung · 10 Karten',      5, 0, 14, 20),
  entry('ch-004', 'schulaufgaben', 'Schulaufgabe hochgeladen',  'Deutsch · Gedichtanalyse · Note 2',       3, 0, 11, 15),

  // === Gestern (1) ===
  entry('ch-005', 'flashcards',    'Karteikarten generiert',    'Englisch · Conditionals · 15 Karten',     8, 1, 20, 30),
  entry('ch-006', 'flashcards',    'Karteikarten generiert',    'Physik · Mechanik · 8 Karten',            4, 1, 19, 12),
  entry('ch-007', 'klassenarbeit', 'Klassenarbeit analysiert',  'Mathe · Analysis · Note 2,3',             5, 1, 17, 48),
  entry('ch-008', 'exam',          'Prüfungssimulation',        'Englisch · Reading Comprehension · 30 Min', 10, 1, 15, 0),

  // === Vorgestern (2) ===
  entry('ch-009', 'flashcards',    'Karteikarten generiert',    'Chemie · Stöchiometrie · 12 Karten',      6, 2, 21, 5),
  entry('ch-010', 'flashcards',    'Karteikarten generiert',    'Mathe · Vektoren · 10 Karten',            5, 2, 18, 33),
  entry('ch-011', 'schulaufgaben', 'Schulaufgabe hochgeladen',  'Englisch · Essay B2 · Note 1,7',          3, 2, 16, 22),
  entry('ch-012', 'klassenarbeit', 'Klassenarbeit analysiert',  'Physik · Optik · Note 3',                 5, 2, 10, 45),

  // === 3 Tage (So, 15.03.) — Wochenend-Peak ===
  entry('ch-013', 'exam',          'Prüfungssimulation',        'Mathe · Vollsimulation · 90 Min',        25, 3, 15, 0),
  entry('ch-014', 'flashcards',    'Karteikarten generiert',    'Mathe · Trigonometrie · 20 Karten',      10, 3, 13, 20),
  entry('ch-015', 'flashcards',    'Karteikarten generiert',    'Deutsch · Erzählperspektive · 8 Karten', 4, 3, 11, 5),
  entry('ch-016', 'flashcards',    'Karteikarten generiert',    'Biologie · Genetik · 14 Karten',         7, 3, 9, 50),

  // === 4 Tage (Sa, 14.03.) ===
  entry('ch-017', 'exam',          'Prüfungssimulation',        'Englisch · Grammar · 30 Min',            10, 4, 20, 10),
  entry('ch-018', 'flashcards',    'Karteikarten generiert',    'Französisch · Passé composé · 12 Karten', 6, 4, 17, 35),
  entry('ch-019', 'schulaufgaben', 'Schulaufgabe hochgeladen',  'Mathe · Integralrechnung · Note 2',       3, 4, 14, 0),
  entry('ch-020', 'klassenarbeit', 'Klassenarbeit analysiert',  'Deutsch · Erörterung · Note 1,7',         5, 4, 12, 18),

  // === 5 Tage (Fr, 13.03.) ===
  entry('ch-021', 'flashcards',    'Karteikarten generiert',    'Chemie · Säuren und Basen · 10 Karten',   5, 5, 19, 40),
  entry('ch-022', 'exam',          'Prüfungssimulation',        'Mathe · Geometrie · 45 Min',             15, 5, 17, 0),
  entry('ch-023', 'flashcards',    'Karteikarten generiert',    'Geschichte · Weimarer Republik · 15 Karten', 8, 5, 15, 25),

  // === 6 Tage ===
  entry('ch-024', 'flashcards',    'Karteikarten generiert',    'Mathe · Lineare Gleichungen · 10 Karten', 5, 6, 21, 15),
  entry('ch-025', 'schulaufgaben', 'Schulaufgabe hochgeladen',  'Biologie · Ökologie · Note 2,3',          3, 6, 18, 5),
  entry('ch-026', 'flashcards',    'Karteikarten generiert',    'Englisch · Vocabulary Unit 7 · 20 Karten', 10, 6, 16, 30),
  entry('ch-027', 'exam',          'Prüfungssimulation',        'Biologie · Zellbiologie · 30 Min',       10, 6, 14, 0),

  // === 7 Tage ===
  entry('ch-028', 'klassenarbeit', 'Klassenarbeit analysiert',  'Chemie · Organische Chemie · Note 3,3',   5, 7, 20, 50),
  entry('ch-029', 'flashcards',    'Karteikarten generiert',    'Mathe · Statistik · 12 Karten',           6, 7, 19, 22),
  entry('ch-030', 'flashcards',    'Karteikarten generiert',    'Physik · Elektrizität · 10 Karten',       5, 7, 17, 10),

  // === 8 Tage ===
  entry('ch-031', 'exam',          'Prüfungssimulation',        'Deutsch · Textanalyse · 60 Min',         20, 8, 16, 0),
  entry('ch-032', 'flashcards',    'Karteikarten generiert',    'Englisch · Present Perfect · 10 Karten',  5, 8, 14, 45),
  entry('ch-033', 'flashcards',    'Karteikarten generiert',    'Französisch · Vokabeln Unité 3 · 18 Karten', 9, 8, 11, 20),

  // === 9 Tage ===
  entry('ch-034', 'schulaufgaben', 'Schulaufgabe hochgeladen',  'Physik · Mechanik · Note 2,7',            3, 9, 19, 0),
  entry('ch-035', 'flashcards',    'Karteikarten generiert',    'Biologie · Mitose · 8 Karten',            4, 9, 17, 15),
  entry('ch-036', 'klassenarbeit', 'Klassenarbeit analysiert',  'Mathe · Funktionen · Note 1,3',           5, 9, 15, 30),
  entry('ch-037', 'flashcards',    'Karteikarten generiert',    'Mathe · Ableitungen · 15 Karten',         8, 9, 13, 5),

  // === 10 Tage ===
  entry('ch-038', 'exam',          'Prüfungssimulation',        'Englisch · Listening · 30 Min',          10, 10, 20, 40),
  entry('ch-039', 'flashcards',    'Karteikarten generiert',    'Chemie · Periodensystem · 14 Karten',     7, 10, 18, 12),

  // === 11 Tage ===
  entry('ch-040', 'flashcards',    'Karteikarten generiert',    'Mathe · Wahrscheinlichkeit · 12 Karten',  6, 11, 19, 30),
  entry('ch-041', 'schulaufgaben', 'Schulaufgabe hochgeladen',  'Deutsch · Aufsatz · Note 2',              3, 11, 16, 50),
  entry('ch-042', 'flashcards',    'Karteikarten generiert',    'Biologie · Verdauung · 9 Karten',         5, 11, 14, 0),

  // === 12 Tage ===
  entry('ch-043', 'exam',          'Prüfungssimulation',        'Mathe · Integrale · 45 Min',             15, 12, 17, 25),
  entry('ch-044', 'flashcards',    'Karteikarten generiert',    'Geschichte · Französische Revolution · 16 Karten', 8, 12, 15, 0),

  // === 13 Tage ===
  entry('ch-045', 'klassenarbeit', 'Klassenarbeit analysiert',  'Englisch · Reading · Note 2',             5, 13, 20, 10),
  entry('ch-046', 'flashcards',    'Karteikarten generiert',    'Französisch · Futur simple · 10 Karten',  5, 13, 18, 0),
  entry('ch-047', 'flashcards',    'Karteikarten generiert',    'Physik · Wellen · 8 Karten',              4, 13, 15, 40),

  // === 14 Tage ===
  entry('ch-048', 'exam',          'Prüfungssimulation',        'Chemie · Redoxreaktionen · 30 Min',      10, 14, 19, 20),
  entry('ch-049', 'flashcards',    'Karteikarten generiert',    'Mathe · Bruchterme · 10 Karten',          5, 14, 16, 10),

  // === 15 Tage ===
  entry('ch-050', 'flashcards',    'Karteikarten generiert',    'Biologie · Evolution · 12 Karten',        6, 15, 21, 0),
  entry('ch-051', 'schulaufgaben', 'Schulaufgabe hochgeladen',  'Geschichte · Quellenanalyse · Note 2,3',  3, 15, 18, 45),
  entry('ch-052', 'flashcards',    'Karteikarten generiert',    'Mathe · Prozentrechnung · 8 Karten',      4, 15, 14, 30),

  // === 18 Tage ===
  entry('ch-053', 'exam',          'Prüfungssimulation',        'Mathe · Vektorrechnung · 60 Min',        20, 18, 16, 0),
  entry('ch-054', 'flashcards',    'Karteikarten generiert',    'Englisch · Business English · 15 Karten', 8, 18, 13, 20),

  // === 20 Tage ===
  entry('ch-055', 'klassenarbeit', 'Klassenarbeit analysiert',  'Biologie · Stoffwechsel · Note 2,7',      5, 20, 19, 15),
  entry('ch-056', 'flashcards',    'Karteikarten generiert',    'Chemie · Atommodelle · 10 Karten',        5, 20, 17, 0),

  // === 22 Tage ===
  entry('ch-057', 'flashcards',    'Karteikarten generiert',    'Mathe · Parabeln · 12 Karten',            6, 22, 15, 40),
  entry('ch-058', 'exam',          'Prüfungssimulation',        'Deutsch · Gedichtanalyse · 45 Min',      15, 22, 12, 0),

  // === 25 Tage ===
  entry('ch-059', 'flashcards',    'Karteikarten generiert',    'Geschichte · Kalter Krieg · 14 Karten',   7, 25, 18, 30),
  entry('ch-060', 'schulaufgaben', 'Schulaufgabe hochgeladen',  'Mathe · Geometrie · Note 2',              3, 25, 16, 0),
  entry('ch-061', 'flashcards',    'Karteikarten generiert',    'Französisch · Grammatik · 10 Karten',     5, 25, 14, 15),

  // === 28 Tage ===
  entry('ch-062', 'klassenarbeit', 'Klassenarbeit analysiert',  'Französisch · Vokabeltest · Note 3',      5, 28, 17, 50),
  entry('ch-063', 'flashcards',    'Karteikarten generiert',    'Physik · Thermodynamik · 10 Karten',      5, 28, 15, 0),

  // === 30 Tage ===
  entry('ch-064', 'exam',          'Prüfungssimulation',        'Biologie · Genetik · 45 Min',            15, 30, 19, 30),
  entry('ch-065', 'flashcards',    'Karteikarten generiert',    'Englisch · Passive Voice · 12 Karten',    6, 30, 17, 10),
  entry('ch-066', 'flashcards',    'Karteikarten generiert',    'Mathe · Terme · 8 Karten',                4, 30, 14, 0),

  // === Lernassistent-Nutzung (KI-Chat) ===
  entry('ch-067', 'ai', 'Lernassistent · Frage', 'Mitternachtsformel · 8 Nachrichten',          2, 0, 19, 15),
  entry('ch-068', 'ai', 'Lernassistent · Frage', 'Photosynthese erklärt · 5 Nachrichten',        1, 0, 13, 40),
  entry('ch-069', 'ai', 'Lernassistent · Frage', 'Englisch Grammar · 6 Nachrichten',             2, 1, 21, 8),
  entry('ch-070', 'ai', 'Lernassistent · Frage', 'Mathe Beweisführung · 12 Nachrichten',         3, 1, 18, 22),
  entry('ch-071', 'ai', 'Lernassistent · Frage', 'Chemie Molare Masse · 4 Nachrichten',          1, 2, 17, 0),
  entry('ch-072', 'ai', 'Lernassistent · Frage', 'Deutsch Textanalyse · 10 Nachrichten',         3, 3, 20, 30),
  entry('ch-073', 'ai', 'Lernassistent · Frage', 'Biologie Vererbung · 7 Nachrichten',           2, 4, 19, 10),
  entry('ch-074', 'ai', 'Lernassistent · Frage', 'Physik Formeln · 6 Nachrichten',               2, 5, 16, 45),
  entry('ch-075', 'ai', 'Lernassistent · Frage', 'Mathe Statistik · 9 Nachrichten',              3, 6, 21, 30),
  entry('ch-076', 'ai', 'Lernassistent · Frage', 'Englisch Essay Tipps · 8 Nachrichten',         2, 7, 18, 55),
  entry('ch-077', 'ai', 'Lernassistent · Frage', 'Chemie Redox · 5 Nachrichten',                 2, 8, 20, 10),
  entry('ch-078', 'ai', 'Lernassistent · Frage', 'Mathe Integrale · 14 Nachrichten',             4, 9, 16, 20),
  entry('ch-079', 'ai', 'Lernassistent · Frage', 'Deutsch Gedichtform · 6 Nachrichten',          2, 10, 14, 50),
  entry('ch-080', 'ai', 'Lernassistent · Frage', 'Biologie Evolution · 7 Nachrichten',           2, 12, 19, 15),
  entry('ch-081', 'ai', 'Lernassistent · Frage', 'Mathe Parabeln · 8 Nachrichten',               2, 14, 17, 40),
  entry('ch-082', 'ai', 'Lernassistent · Frage', 'Englisch Reading · 5 Nachrichten',             2, 16, 20, 5),
  entry('ch-083', 'ai', 'Lernassistent · Frage', 'Physik Optik · 9 Nachrichten',                 3, 19, 18, 0),
  entry('ch-084', 'ai', 'Lernassistent · Frage', 'Mathe Trigonometrie · 11 Nachrichten',         3, 21, 16, 35),
  entry('ch-085', 'ai', 'Lernassistent · Frage', 'Geschichte Weimar · 6 Nachrichten',            2, 24, 15, 20),
  entry('ch-086', 'ai', 'Lernassistent · Frage', 'Französisch Konjugation · 7 Nachrichten',      2, 27, 19, 45),
];
