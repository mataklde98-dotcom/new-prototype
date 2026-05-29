# Lernanalyse - Vollstandige Dokumentation

**Datei:** `/src/app/components/ProfileAnalyticsScreen.tsx`
**Zugang:** Profil > Lernanalyse oder KI-Tools > Lernanalyse-Button
**Overlay:** Fullscreen Slide-In via `MobileRouteTransition` (Mobile) bzw. inline (Desktop)

---

## Architektur

- Hauptkomponente: `ProfileAnalyticsScreen`
- Design: Premium SaaS Style (Linear/Vercel), Hintergrund `#0a0a0a`, Glassmorphism-Cards
- Fonts: Poppins (SemiBold, Medium, Regular)
- Charts: recharts (AreaChart, RadarChart, BarChart)
- Sub-Views: GPU-optimierte CSS-Slide-Animationen (translateX/opacity), `ReactDOM.createPortal` fur Overlays
- Loading: 800ms Skeleton-Loading-Animation beim Offnen
- Tutorial: `LernanalyseTutorial` wird beim ersten Besuch angezeigt (`shouldShowLernanalyseTutorial()`)

### Externe Sub-Komponenten
- `LernanalyseTutorial` - Onboarding-Tutorial fur Erstbesucher
- `PremiumCalendarPicker` - Kalender-Datepicker fur benutzerdefinierte Zeitraume
- `ExamPrepTodoSection` - ToDo-Liste fur Klausur-/Lernziel-Vorbereitung (in Detail-Views)

### Exportierte Werte
- `OVERALL_PROGRESS` - Durchschnitt aller Facher-Fortschritte (wird in KIToolsScreen referenziert)
- `LEARNING_STREAK` - Berechnete Lern-Streak in Tagen (wird in HomeScreenDesktop referenziert)
- `calculateStreak()` - Funktion zur Streak-Berechnung

---

## 5 Tabs

### Tab-Leiste
Horizontale scrollbare Tab-Bar mit Icons:
| Key | Label | Icon |
|-----|-------|------|
| `overview` | Ubersicht | `Layers` |
| `progress` | Lernfortschritt | `BarChart3` |
| `prognosis` | Schwachen & Lucken | `Brain` |
| `goals` | Ziele & Klausuren | `Target` |
| `performance` | Leistung | `Activity` |

---

## Tab 1: Ubersicht (`overview`)

Dashboard mit Zusammenfassung aller wichtigen Metriken. Jede Karte ist ein Shortcut zum jeweiligen Detail-Tab.

### Sektionen (von oben nach unten):

1. **Gesamtfortschritt - Hero**
   - Grosser `ScoreRing` (72px) mit Gesamtprozent
   - Trend-Badge (Aufsteigend/Stabil/Absteigend) mit Farbe und Icon

2. **Starkstes & Schwachstes Fach**
   - 2-spaltige Grid-Karten
   - Starkstes Fach: Gold-Icon (`Award`), z.B. "Englisch"
   - Schwachstes Fach: Rot-Icon (`AlertTriangle`), z.B. "Biologie"

3. **Skill-Map - Radar**
   - `RadarChart` (recharts) mit allen Fachern
   - Lila Farbe (`#7B61FF`), 200px Hohe
   - Daten: Mathe, Deutsch, Englisch, Bio, Franz., Gesch.

4. **Schwachen & Lucken - Summary** (klickbar -> Tab Prognose)
   - 3-spaltige KPI-Karten: Schwachen (rot), Wissenslucken (orange), Hohe Risiken (orange)
   - Gesamtzahl der Eintrage mit rotem Punkt bei kritischen Schwachen

5. **Ziele & Klausuren - Summary** (klickbar -> Tab Goals)
   - Anzahl Klausuren + Anzahl Ziele
   - Nachste Klausur-Preview mit Countdown und Readiness-Prozent

6. **Leistung - Summary** (klickbar -> Tab Performance)
   - Durchschnitt Gesamt vs. Diese Woche
   - Delta-Anzeige mit Trend-Icon (grun/rot)

7. **Anstehend**
   - Nachste Prufung/Aufgabe mit Countdown in Tagen
   - Lila Akzentfarbe (`#7B61FF`)

8. **Lern-Streak + Lernzeit**
   - Streak in Tagen (orange, `#FF9F43`) + Langste Streak
   - Lernzeit diese Woche (Stunden/Minuten)
   - Wochen-Heatmap (Mo-So) mit Flammen-Icons

---

## Tab 2: Lernfortschritt (`progress`)

Detaillierte Aufschlusselung des Fortschritts nach Fachern, Kategorien und Themen.

### Sektionen:

1. **Gesamtfortschritt**
   - Grosser Prozentwert mit Trend-Icon
   - Progress-Bar (`#00D4AA`)
   - "Basierend auf allen Fachern"

2. **Facherubersicht** (aufklappbar, 3 Ebenen)
   - **Level 1 - Fach**: Name + `StatusBadge` (Auf Kurs/Schwankend/Nachlassend) + `ScoreRing`
     - Facher: Mathematik, Deutsch, Englisch, Biologie
   - **Level 2 - Kategorie** (aufklappbar): Name + Progress-Bar + Prozent
     - z.B. Mathematik: Zahlen & Operationen, Funktionen, Geometrie, Stochastik
   - **Level 3 - Thema**: Name + Mastery-Prozent + Trend-Icon + Ubungen-Zahler
     - z.B. Bruchrechnung 82%, Prozentrechnung 74%, etc.

### Status-Farben (StatusBadge):
- `on-track`: Auf Kurs (`#00D4AA`)
- `needs-attention`: Schwankend (`#FFB800`)
- `at-risk`: Nachlassend (`#FF4444`)

### Progress-Bar-Farben (progressBarColor):
- >= 80%: `#00D4AA`
- >= 50%: `#FFB800`
- < 50%: `#FF4444`

---

## Tab 3: Schwachen & Lucken (`prognosis`)

KI-gestutzte Analyse von Schwachen, Wissenslucken und Risiken.

### Haupt-Ubersicht (renderPrognosisOverview):

1. **Summary KPIs** (3-spaltige Grid)
   - Schwachen (rot `#FF4444`): Anzahl + "X kritisch"
   - Wissenslucken (grun `#2D9E78`): Anzahl + "X kritisch"
   - Risiken (gelb `#FFB800`): Anzahl + "X kritisch"

2. **Erkannte Schwachen** (Preview: 2 Items + "Alle anzeigen")
   - `WeaknessCard`-Komponente pro Eintrag
   - Severity-Badge: Kritisch (rot) / Mittel (orange) / Gering (grun)
   - Score als kompakter Fortschrittsindikator
   - Fach-Label + Empfehlung
   - Action-Buttons: "Karteikarten" + "Prufung simulieren"
   - Kritische Aktionen bei `severity: 'critical'`

3. **KI-Wissenslucken** (Preview: 2 Items + "Alle anzeigen")
   - Titel + Beschreibung (KI-Erklarung der Ursache)
   - Severity-Badge + Score
   - Action-Buttons: Karteikarten / Prufungssimulation
   - KI erkennt gemeinsame Ursachen hinter mehreren Schwachen

4. **Zukunftige Risiken** (Preview: 2 Items + "Alle anzeigen")
   - `RiskBadge`: Kritisch (rot) / Mittel (orange) / Gering (grau)
   - Grund-Text + Score
   - Action-Buttons

### Fullscreen Sub-Views (Slide-In):
- **Alle Schwachen**: Komplette Liste mit Fach-Farbstreifen
- **Alle Wissenslucken**: Komplette Liste
- **Alle Risiken**: Komplette Liste

### WeaknessCard Features:
- Severity-Badge (Kritisch/Mittel/Gering)
- Fortschrittsanzeige (Score-Ring oder Progress)
- Empfehlungstext
- Kritische Aktionen (nur bei `severity: 'critical'`)
- "Karteikarten generieren" Button -> offnet Karteikarten-Generator mit Kontext
- "Prufung simulieren" Button -> offnet Prufungssimulation mit Kontext

---

## Tab 4: Ziele & Klausuren (`goals`)

Zwei Sub-Toggles: **Klassenarbeiten** und **Lernziele**.

### Sub-Toggle: Klassenarbeiten (`exams`)

#### Sektionen:

1. **Bevorstehende Klausuren**
   - Preview: 2 Klausuren + "Alle X Klassenarbeiten anzeigen" Button
   - Pro Klausur-Karte:
     - Fach + Datum + Countdown ("in X Tagen", farbcodiert: <=3 rot, <=7 orange, sonst grun)
     - Vorbereitungs-Progress-Bar (neutral `#00D4AA`)
     - Klickbar -> Klausur-Detail-View

2. **Klausur-Insights**
   - **Korrelation Vorbereitung vs. Note**: 2-spaltig (Gut vorbereitet vs. Wenig gelernt) mit Durchschnittsnoten
   - **Noten-Trend**: Gesamtschnitt + Trend (Verbessernd/Stabil/Rucklaufig)
   - **Vergangene Klausuren Liste**: Preview 3 + "Alle anzeigen"
   - Info-Hinweis: "Basiert nur auf Klausuren aus der ToDo-Verwaltung"

#### Klausur-Detail-View (Fullscreen Slide-In):
- Header: Fach + Datum + Countdown
- **Daten-Grundlage**: Badges (Karteikarten, Prufungen, Chat-Fragen)
- **Vorbereitungs-Level**: Grosser Prozentwert + Progress-Bar
- **KI-Einschatzung**: Text-Box mit violettem Akzent
- **Lernkurve**: `AreaChart` (generiert via `generateLearningCurve()`)
- **Themen-Readiness**: Pro Thema Mastery-Prozent + Kategorie
- **Vergangener Vergleich**: Falls vorhanden, Vergleich mit ahnlicher Klausur
- **KI-Empfehlungen**: Preview 2 + "Alle anzeigen" (Karteikarten/Prufung generieren)
- **Insights**: Preview 3 + "Alle anzeigen" (Starke/Schwache/Nicht geubt)
- **ToDo-Sektion**: `ExamPrepTodoSection` mit Aufgaben-Liste

#### Alle Klausuren Slide-Over:
- Fach-Filter (Alle, Mathematik, Deutsch, etc.)
- Vollstandige Liste aller bevorstehenden Klausuren

### Sub-Toggle: Lernziele (`goals`)

#### Sektionen:

1. **Aktive Lernziele**
   - Preview: 2 Ziele + "Alle X Lernziele anzeigen" Button
   - Pro Lernziel-Karte:
     - Fach + Status-Badge (Auf Kurs `#00D4AA` / Gefahrdet `#FF6B6B` / Verschoben `#FFB84D`)
     - Thema + Zieldatum + Countdown
     - Falls verschoben: durchgestrichenes Original-Datum
     - Fortschritts-Bar (Mastery: Start -> Aktuell -> Target)
     - Klickbar -> Lernziel-Detail-View

2. **Deine Lernziel-Bilanz**
   - **3 Metrik-Karten**: Ziele erreicht, Davon punktlich, Aktive Ziele (alle `#00D4AA`)
   - **Erreichte Ziele Liste**: Preview 3 Eintrage mit Checkmark, Thema, Fach, Dauer
   - **"Alle erreichten Ziele anzeigen"** Button (nur bei >3)
   - **KI-Analyse Box**: Zusammenfassung (punktlich/zu langsam, Durchschnittsdauer)

#### Lernziel-Detail-View (Fullscreen Slide-In):
- Header: Fach + Thema + Status-Badge
- **Zieldatum + Countdown** (mit Original-Datum falls verschoben)
- **Personfliche Notiz** des Schulers
- **Fortschritt**: Mastery Start -> Aktuell -> Ziel (100%) mit Progress-Bar
- **ToDos**: `ExamPrepTodoSection` mit Aufgaben-Liste
- **KI-Einschatzung**: Text mit violettem Akzent
- **Schwierigkeiten**: Preview 2 + "Alle anzeigen"
  - Pro Schwierigkeit: Typ (major/moderate/minor), Thema, Detail
- **KI-Empfehlungen**: Preview 2 + "Alle anzeigen"
  - Severity-Badge + Grund + Action-Buttons (Karteikarten/Prufung)

#### Alle Lernziele Slide-Over:
- Fach-Filter
- Vollstandige Liste aller aktiven Lernziele

#### Erreichte Ziele Slide-Over:
- Fach-Filter + Zeitraum-Filter
- Vollstandige Liste mit Dauer und Punktlichkeits-Status

---

## Tab 5: Leistung (`performance`)

Detaillierte Leistungsanalyse mit Zeitraum-Filtern.

### Zeitraum-Filter:
- Heute | Woche | Monat | Benutzerdefiniert | Gesamt
- Benutzerdefiniert: `PremiumCalendarPicker` fur Von/Bis-Datum

### Sektionen:

1. **Durchschnitt Ergebnis**
   - Grosser Score (farbcodiert) + Delta zum Gesamtdurchschnitt
   - Anzeige: "Gesamt-O" + "Zeitraum-O" mit Vergleich

2. **Zeitraum-Chart** (kontextabhangig)
   - **Heute**: `BarChart` mit stundlicher Aktivitat (Score pro Stunde)
   - **Woche**: `BarChart` mit taglicher Lernzeit (Minuten pro Tag)
   - **Monat/Benutzerdefiniert/Gesamt**: `AreaChart` mit Leistungs-Trend uber Wochen

3. **Aktivitaten nach Typ**
   - Horizontale Balken: Karteikarten (blau `#4A9EFF`), Prufungssimulation (orange `#FF8C00`), Lernassistent (grun `#00D4AA`)
   - Minuten + Prozentanteil pro Typ

4. **Starken & Schwachen** (zeitraumgefiltert)
   - Konsistente Starken (Top 3)
   - Konsistente Schwachen (Top 3)

5. **Alle Aktivitaten** (gefilterte Liste)
   - Pro Aktivitat: Typ-Icon + Titel + Fach + Score + Datum + Dauer
   - Typ-spezifisch:
     - Karteikarten: Fortschritts-Bar + Kartenanzahl
     - Prufungssimulation: Note + Score-Ring
     - Chat: Fragen-Titel

---

## Wiederverwendbare Komponenten

| Komponente | Beschreibung |
|-----------|-------------|
| `SeverityBadge` | Kritisch (rot) / Mittel (orange) / Gering (grun) |
| `RiskBadge` | Kritisch (rot) / Mittel (orange) / Gering (grau) |
| `StatusBadge` | Auf Kurs (grun) / Schwankend (gelb) / Nachlassend (rot) |
| `TrendIcon` | Pfeil hoch (grun) / Strich (grau) / Pfeil runter (rot) |
| `ScoreRing` | SVG-Kreisring mit Score, farbcodiert (grun/gelb/rot) |
| `ActionButton` | Primary (grun-glassmorphism) / Secondary (grau) |
| `GlassCard` | Glassmorphism-Container mit Gradient + Border |
| `SectionTitle` | Uberschrift mit optionalem Icon und Badge |
| `WeaknessCard` | Vollstandige Schwache-Karte mit Actions |
| `EmptyState` | Platzhalter fur leere Listen |

---

## Datenmodell (Types)

### Kern-Types:

```typescript
interface WeaknessItem {
  id: string; topic: string; subject: string;
  score: number; severity: 'critical' | 'warning' | 'moderate';
  recommendation: string; criticalActions: string[];
}

interface StrengthItem {
  id: string; topic: string; subject: string; score: number;
}

interface SubjectProgress {
  id: string; name: string; progress: number;
  status: 'on-track' | 'needs-attention' | 'at-risk';
  trend: number; strongestCategory: string;
  categories: CategoryItem[]; // -> TopicItem[]
}

interface RiskItem {
  id: string; topic: string; subject: string;
  score: number; riskLevel: 'high' | 'medium' | 'low'; reason: string;
}

interface KnowledgeGapItem {
  id: string; title: string; description: string;
  subject: string; score: number;
  severity: 'critical' | 'warning' | 'moderate';
}

interface ActivityItem {
  id: string; type: 'flashcard' | 'exam' | 'chat';
  title: string; subject: string; score?: number;
  date: string; duration: string;
  cardsCount?: number; grade?: string;
  progress?: number; setId?: number; time?: string;
}

interface UpcomingExam {
  id: string; title: string; subject: string; date: string;
  prepStartDate: string; selectedTopics: ExamTopicReadiness[];
  overallReadiness: number; prepTasks: PrepTask[];
  dataSources: DataSource[]; aiAssessment: string;
  insights: ExamInsight[]; pastComparison: ExamPastComparisonData | null;
  recommendations: ExamRecommendation[];
}

interface ActiveGoal {
  id: string; topic: string; subject: string;
  dueDate: string; originalDueDate: string;
  masteryStart: number; masteryCurrent: number; masteryTarget: number;
  todosCompleted: number; todosTotal: number;
  aiReasoning: string; status: 'on-track' | 'at-risk' | 'extended';
  note?: string; difficulties: Difficulty[]; prepTasks: PrepTask[];
}

interface CompletedGoalInsight {
  id: string; topic: string; subject: string;
  plannedDays: number; actualDays: number;
  completedOnTime: boolean; completedDate: string;
}
```

---

## Mock-Daten

| Konstante | Anzahl | Beschreibung |
|-----------|--------|-------------|
| `MOCK_WEAKNESSES` | 5 | Schwachen (2 kritisch, 2 warning, 1 moderate) |
| `MOCK_STRENGTHS` | 6 | Starken (Score 85-94) |
| `MOCK_SUBJECTS` | 4 | Facher mit Kategorien und Themen (Mathe, Deutsch, Englisch, Bio) |
| `MOCK_RISKS` | 5 | Risiken (2 high, 2 medium, 1 low) |
| `MOCK_KNOWLEDGE_GAPS_SELF` | 5 | KI-Wissenslucken (2 kritisch, 2 warning, 1 moderate) |
| `MOCK_ACTIVITIES` | 34 | Aktivitaten (Okt 2025 - Marz 2026) |
| `MOCK_UPCOMING_EXAMS` | extern | Bevorstehende Klausuren (aus `profileAnalyticsMockExams.ts`) |
| `MOCK_ACTIVE_GOALS` | 3 | Aktive Lernziele (Quad. Funktionen, Passe Compose, Zellatmung) |
| `MOCK_COMPLETED_GOAL_INSIGHTS` | 5 | Abgeschlossene Ziele |
| `MOCK_PAST_EXAM_INSIGHTS` | 10 | Vergangene Klausuren mit Noten |
| `MOCK_GOAL_RECOMMENDATIONS` | 9 | KI-Empfehlungen fur Lernziele (3 pro Ziel) |
| `MOCK_UNIFIED_SUMMARY` | 1 | Globale Zusammenfassung |
| `TREND_DATA` | 6 | Wochen-Trend (KW 5-10) |
| `RADAR_DATA` | 6 | Radar-Chart Daten (6 Facher) |
| `WEEKLY_ACTIVITY_DATA` | 7 | Tagliche Lernzeit (abgeleitet) |

---

## Interaktionen & Navigation

### Von Lernanalyse ausgehend:
- **Karteikarten generieren**: `onGenerateForWeakness` -> offnet Karteikarten-Generator mit Kontext (Topic, Subject, Severity, Source)
- **Prufung simulieren**: `onStartExamSimulation` -> offnet Prufungssimulation mit Kontext
- **Karteikarten-Set offnen**: `onOpenFlashcardSet` -> offnet vorhandenes Set im Lernsimulator

### Sources (fur Karteikarten/Prufungs-Generierung):
- `weakness` - Aus Schwachen-Karte
- `risk` - Aus Risiko-Karte
- `knowledge-gap` - Aus Wissenslucken-Karte
- `teacher-task` - Aus Lehrer-Aufgabe
- `practice` - Aus Ubungs-Empfehlung
- `prep-todo` - Aus Vorbereitungs-ToDo (Klausur/Lernziel)
- `learning-goal` - Aus Lernziel-Empfehlung

### Pending Prep Task Link:
- `pendingPrepTaskLink` Prop: Verknupft einen generierten Karteikarten-Set mit einem spezifischen PrepTask (examId + taskIndex + setId)
- Wird nach Karteikarten-Generierung automatisch zuruckgeschrieben

---

## Farb-System

### Severity-Farben (Bewertung):
- Kritisch/Hoch/Dringend: `#FF6B6B` (Rot)
- Mittel/Empfohlen: `#FFB84D` (Orange)
- Gering/Niedrig/Forderlich: `#00D4AA` (Grun)

### Progress-Bars (neutrale Daten):
- Einheitlich `#00D4AA` (Akzentfarbe)

### Score-Ring Farben:
- >= 80: `#00D4AA` (Grun)
- >= 50: `#FFB800` (Gelb)
- < 50: `#FF4444` (Rot)

### Sonstige Akzente:
- Radar-Chart: `#7B61FF` (Lila)
- Streak/Flamme: `#FF9F43` (Orange)
- Anstehend: `#7B61FF` (Lila)
- Starkstes Fach: `#FFB800` (Gold)
- KI-Analyse: `rgba(139,92,246,...)` (Violett)

---

## State Management

### Haupt-States:
- `activeTab`: Aktueller Tab (`TabKey`)
- `isLoading`: Skeleton-Loading beim Offnen
- `showTutorial`: Lernanalyse-Tutorial

### Lernfortschritt-States:
- `expandedSubjects`: Set<string> - aufgeklappte Facher
- `expandedCategories`: Set<string> - aufgeklappte Kategorien

### Schwachen & Lucken-States:
- `prognosisSubView`: 'overview' | 'allWeaknesses' | 'allGaps' | 'allRisks'

### Ziele & Klausuren-States:
- `goalsSubToggle`: 'exams' | 'goals' - Sub-Toggle
- `examDetailId`: string | null - offene Klausur-Detail-View
- `goalDetailId`: string | null - offene Lernziel-Detail-View
- `showAllExams`: boolean - Alle Klausuren Slide-Over
- `showAllGoals`: boolean - Alle Lernziele Slide-Over
- `showAllReachedGoals`: boolean - Erreichte Ziele Slide-Over
- `showAllGoalDifficulties`: boolean - Alle Schwierigkeiten Slide-Over
- `showAllGoalRecs`: boolean - Alle Empfehlungen Slide-Over
- `showAllInsights`: boolean - Alle Insights Slide-Over
- `showAllRecommendations`: boolean - Alle Klausur-Empfehlungen Slide-Over
- `examsSubjectFilter`: string - Fach-Filter fur Klausuren
- `goalsSubjectFilter`: string - Fach-Filter fur Ziele
- `reachedGoalsSubjectFilter`: string - Fach-Filter fur erreichte Ziele
- `reachedGoalsTimeFilter`: string - Zeitraum-Filter fur erreichte Ziele

### Leistung-States:
- `perfTimeRange`: 'today' | 'weekly' | 'monthly' | 'custom' | 'all'
- `customDateFrom` / `customDateTo`: Benutzerdefinierter Zeitraum
- `customRangeApplied`: boolean
- `showCustomPicker`: boolean
- `selectingField`: 'from' | 'to' | null

---

## Props

```typescript
interface ProfileAnalyticsScreenProps {
  isClosing?: boolean;                    // Slide-Out Animation
  onClose: () => void;                    // Zurück-Navigation
  isMobile?: boolean;                     // Mobile/Desktop Layout
  externalTransition?: boolean;           // Externe Transition aktiv
  onGenerateForWeakness?: (context) => void;  // Karteikarten generieren
  onStartExamSimulation?: (context) => void;  // Prüfung simulieren
  allSets?: FlashcardSet[];               // Alle Karteikarten-Sets
  onOpenFlashcardSet?: (set) => void;     // Karteikarten-Set öffnen
  pendingPrepTaskLink?: {                 // Verknüpfung nach Generierung
    examId: string;
    taskIndex: number;
    setId: number;
  } | null;
}
```
