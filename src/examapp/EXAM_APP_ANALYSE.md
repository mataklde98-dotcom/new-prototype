# 📊 PROJEKT-ANALYSE ERGEBNIS – ExamApp

---

## 1. App.tsx Struktur

| Metrik | Wert |
|---|---|
| **Zeilen** | **3.389** |
| **State-Variablen** | **~50 Stück** |
| **useEffects** | **7 Stück** |
| **Handler-Funktionen** | **~25 Stück** |
| **Inline JSX-Screens** | **~10 Blöcke** |

### Hauptverantwortlichkeiten (alles in EINER Datei!):

1. **Screen-Navigation** – Manuelles State-Management mit `screen`-String statt Router
2. **Content-Selection-Flow** – Subject → Category → Topic → Subtopic laden + cachen
3. **Exam-Lifecycle** – Erstellen, Starten, Durchführen, Beenden, Speichern
4. **Timer-Management** – Countdown, Auto-Submit bei 0, formatTime
5. **Antwort-Handling** – 5 verschiedene Fragetypen (MC, MC-Multi, FillInBlank, FillInBlankChoice, ShortAnswer)
6. **Bewertungslogik** – `isAnswerCorrect()`, `getAnswerScorePercentage()`, `getFeedbackText()`
7. **API-Integration** – Generate Exam + Evaluate Exam (React Query mutations)
8. **Completed Exam Review** – Alte Prüfungen laden und anzeigen
9. **LocalStorage** – Auto-Save, Completed Exams speichern
10. **AI Content Generation** – Modals für KI-Inhaltserstellung (Mock)
11. **UI-Rendering** – Komplette UI für ALLE 10+ Screens inline
12. **Progress-Bar-Berechnung** – `getProgress()` mit Scroll-Offset-Logik
13. **Feedback-System** – Post-Exam Feedback mit User-Profil-Daten
14. **Confirm/Alert Dialoge** – State für multiple Modals

### State-Variablen (gruppiert):

**Screen & Navigation (~5):**
- `screen` (11 mögliche Werte!)
- `selectionState` (verschachteltes Objekt)
- `previousScreen`
- `isLoading`, `loadedScreens`

**Exam-Durchführung (~12):**
- `currentQuestionIndex`, `selectedAnswer`, `selectedAnswers`, `textAnswer`
- `timer`, `examDuration`
- `answers`, `finalAnswers`, `visitedQuestions`
- `isFirstLoad`, `isReviewMode`, `examCompleted`

**API-States (~6):**
- `currentExamId`, `examStartTime`, `apiQuestions`, `apiEvaluationResult`
- `isCreatingExam`, `examSavedToHistory`

**Content-Cache (~4):**
- `subjects`, `categoriesCache`, `topicsCache`, `subtopicsCache`

**AI-Content-Modals (~8):**
- `showAIContentModal`, `aiContentType`, `showAIExistsModal`, `aiExistingContent`
- `showAIResultModal`, `aiGeneratedContent`, `showAIMismatchModal` + 3 weitere

**Alert/Confirm (~6):**
- `showAlert`, `alertTitle`, `alertMessage`
- `showConfirmDialog`, `confirmDialogTitle`, `confirmDialogMessage`, `confirmDialogAction`

**Weitere (~8):**
- `showTutorial`, `showResultsAtEnd`, `emptyContentModal`
- `examSession`, `questionTimings`, `examAttempt`, `examConfig`
- `expectedDeletedCategoryId`

### useEffects (7 Stück):

| # | Zeile ca. | Zweck | Dependencies |
|---|---|---|---|
| 1 | ~L262 | AI Content Cache Invalidation (storage event listener) | `[selectionState]` |
| 2 | ~L723 | Initial Load – alle Subjects laden | `[]` |
| 3 | ~L737 | Completed Exam Review Mode – Daten wiederherstellen | `[reviewingCompletedExam]` |
| 4 | ~L805 | Timer Countdown (interval) | `[screen, timer, examCompleted]` |
| 5 | ~L813 | Auto-Submit bei Timer === 0 | `[timer, screen, examCompleted]` |
| 6 | ~L1699 | Auto-scroll Progress-Bars | `[currentQuestionIndex, isFirstLoad, totalQuestions]` |
| 7 | ~L1712 | Save to Completed Exams History | `[examSavedToHistory, examCompleted, ...]` |

---

## 2. Existierende Struktur

### Hooks (`/src/examapp/hooks/`):

| Hook | Beschreibung |
|---|---|
| `useGenerateExam.ts` | React Query Mutation für Exam-Generierung (API + Mock-Fallback) |
| `useEvaluateExam.ts` | React Query Mutation für Exam-Bewertung (API + Mock-Fallback) |
| `index.ts` | Re-Export der Hooks |

### Services (`/src/examapp/services/`):

| Service | Beschreibung |
|---|---|
| `examSimulationApi.ts` | API-Client-Klasse mit Retry-Logic, Supabase Edge Functions, Response-Mapping |
| `examSimulationTypes.ts` | TypeScript-Types für API Request/Response (Generate + Evaluate) |
| `index.ts` | Re-Export |

### Components (`/src/examapp/app/components/`):

| Component | Beschreibung |
|---|---|
| `ChoicesBox.tsx` | Single-Select Multiple Choice |
| `MultipleChoicesBox.tsx` | Multi-Select mit Checkboxen |
| `FillInTheBlankInput.tsx` | Texteingabe-Frage |
| `FillInTheBlankChoice.tsx` | Lückentext mit Dropdown |
| `AnswerFeedbackScreen.tsx` | Feedback nach Antwort |
| `ExamResultsScreen.tsx` | Ergebnis-Übersicht am Ende |
| `FeedbackScreen.tsx` | Post-Exam Feedback-Formular |
| `ExamConfiguration.tsx` | Prüfungskonfiguration (Dauer, Modus) |
| `ExamTutorialModal.tsx` | Tutorial-Modal |
| `AIContentGenerationModal.tsx` | KI-Inhalte generieren |
| `AIContentExistsModal.tsx` | Duplikat-Warnung |
| `AIContentGenerationResultModal.tsx` | Ergebnis der KI-Generierung |
| `AISubjectMismatchModal.tsx` | Fach-Mismatch-Warnung |
| `SubjectSelection.tsx` | ⚠️ Lokale Kopie (auch in shared-content-selection!) |
| `CategorySelection.tsx` | ⚠️ Lokale Kopie |
| `TopicSelection.tsx` | ⚠️ Lokale Kopie |
| `SubtopicSelection.tsx` | ⚠️ Lokale Kopie |
| `LoadingSpinner.tsx` | ⚠️ Lokale Kopie |
| `Alert.tsx` | ⚠️ Lokale Kopie |
| `EmptyContentModal.tsx` | ⚠️ Lokale Kopie |
| `ConfirmDialog.tsx` | ⚠️ Lokale Kopie |
| `SwipeToDelete.tsx` | Swipe-to-Delete-Geste |
| `SubjectIcon.tsx` | Fach-Icon |
| `QuestionScreen.tsx` | Existiert als Datei (unklar ob genutzt) |
| `/figma/ImageWithFallback.tsx` | Bild mit Fallback |
| `/ui/*` | ~50 shadcn/ui-Komponenten |

### Utils (`/src/examapp/app/utils/`):

| Util | Beschreibung |
|---|---|
| `completedExamsStorage.ts` | CRUD für abgeschlossene Prüfungen (localStorage) |
| `recentlyViewedExams.ts` | Kürzlich angesehene Prüfungen |
| `storage-utils.ts` | Auto-Save, Session, Answers, Timings (localStorage) |
| `api-utils.ts` | Mock-API-Funktionen, Helper (generateId, getCurrentTimestamp) |
| `aiContentStorage.ts` | KI-Inhalte-Speicher |
| `aiContentDuplication.ts` | Duplikat-Erkennung |
| `aiContentHierarchy.ts` | Hierarchie-Verwaltung |
| `aiContentNaming.ts` | Benennungslogik |
| `aiDecisionAPI.ts` | KI-Entscheidungen |
| `aiSubjectDetection.ts` | Fach-Erkennung |
| `intelligentAIContentGeneration.ts` | Intelligente Generierung |
| `contentModeration.ts` | Inhaltsmoderation |
| `testAIScenarios.ts` | Test-Helper für Dev |
| `loadingUtils.ts` | Lade-Hilfsfunktionen |

---

## 3. Abhängigkeiten

### Shared Components (aus `@/shared-content-selection`):

- `SubjectSelection`, `CategorySelection`, `TopicSelection`, `SubtopicSelection`
- `LoadingSpinner`, `Alert`, `EmptyContentModal`, `ConfirmDialog`
- `getSubtopicsForTopic`, `loadCategoriesForSubject`, `loadTopicsForCategory`, `loadSubtopicsForTopic`
- `loadWithMinimumDelay`, `loadAllSubjects`
- Types: `Subject`, `Category`, `Topic`, `Subtopic`

> ⚠️ **Anomalie**: Die App importiert diese aus `@/shared-content-selection`, hat aber auch lokale Kopien in `/components/`. Die lokalen werden NICHT importiert in App.tsx – die Shared-Imports werden genutzt.

### API-Integration:

- **React Query** (`@tanstack/react-query`) – `QueryClient`, `QueryClientProvider`, `useMutation`
- **Supabase Edge Functions** – als Proxy zur AI-API
- 2 Endpunkte: `/exam-simulation-generate` und `/exam-simulation-evaluate`
- Mock-Fallback wenn API nicht erreichbar

### User-System:

- `useUserProfile()` und `useUserRegistration()` aus `@/hooks/useUser`
- `getCurrentUserId()` aus `@/lib/auth`

### Externe Libraries:

- `motion/react` (framer-motion) – Animationen
- `lucide-react` – Icons (X, CircleCheckBig, CircleX)

### LocalStorage:

- `completedExamsStorage` – Abgeschlossene Prüfungen persistieren
- `storage-utils` – Exam-Session auto-save, User-ID, Feedback-Tracking

---

## 4. Screen Flow

```
┌─────────────────┐
│ subjectSelection │  ← Startpunkt (Fach wählen)
└────────┬────────┘
         ▼
┌──────────────────┐
│ categorySelection │  ← Kategorie wählen (z.B. "Algebra")
└────────┬─────────┘
         ▼
┌────────────────┐
│ topicSelection  │  ← Thema wählen (1 Topic, Checkbox)
└───┬─────────┬──┘
    │         │
    ▼         ▼
┌───────────────────┐  ┌──────────────────┐
│ subtopicSelection │  │ examConfiguration │  ← "Weiter" ohne Subtopics
│  (optional)       │  │                  │
└────────┬──────────┘  └────────┬─────────┘
         │                      │
         └──────────┬───────────┘
                    ▼
          ┌──────────────────┐
          │ examConfiguration │  ← Dauer + Modus wählen
          └────────┬─────────┘
                   ▼
             ┌──────────┐
             │  start   │  ← "Prüfung erstellen" Animation + API Call
             └────┬─────┘
                  ▼
            ┌───────────┐
            │ question   │◄──────────────────┐
            └─────┬─────┘                    │
                  │                          │
        ┌─────────┴────────────┐             │
        ▼                      ▼             │
  [Sofort-Feedback]     [Ergebnis am Ende]   │
        │                      │             │
        ▼                      │             │
   ┌──────────┐                │             │
   │ feedback  │───────────────┼─────────────┘
   └─────┬────┘                │     (nächste Frage)
         │                     │
         ▼                     ▼
   ┌──────────┐          ┌──────────┐
   │ results   │◄─────── │ results   │
   └─────┬────┘          └──────────┘
         │
         ▼
   ┌──────────────┐
   │ examFeedback  │  ← Schwierigkeits-Feedback (1-5)
   └──────┬───────┘
          ▼
   zurück zu subjectSelection
```

### Timer-Logic:

- Timer startet in **Sekunden** (`examDuration * 60`)
- Countdown läuft in `useEffect` mit `setInterval` (1s)
- Läuft auf **beiden** Screens: `question` UND `feedback`
- Stoppt wenn `examCompleted === true`
- Bei `timer === 0`: `calculateResultsAndNavigate()` wird automatisch aufgerufen
- Timer wird **rot** bei < 60 Sekunden

### Antwort-Validierung (`isAnswerCorrect()`):

- **multipleChoiceMultiple**: Sortierter Array-Vergleich (Länge + Werte)
- **fillInTheBlank / shortAnswer**: Normalisierter String-Vergleich (lowercase, trim, Komma→Punkt) gegen `acceptedAnswers[]`
- **Default**: Einfacher `===` Vergleich

### Exam beenden (3 Wege):

1. **Letzte Frage beantwortet** → `handleContinue()` / `handleNext()` → `setExamCompleted(true)` → `results`
2. **Timer === 0** → `calculateResultsAndNavigate()` → unbeantwortete Fragen als "skipped"
3. **X-Button** → `ConfirmDialog` → `calculateResultsAndNavigate()` → unbeantwortete als "skipped"

### Zwei Exam-Modi:

1. **Sofort-Feedback** (`showResultsAtEnd = false`): Jede Frage → Feedback-Screen → Lösung anzeigbar → Weiter
2. **Ergebnis am Ende** (`showResultsAtEnd = true`): Alle Fragen durchgehen → Results → Optional Review

---

## 5. Kritische Bereiche für Refactoring

### 🔴 Höchste Priorität:

| Bereich | Zeilen ca. | Problem |
|---|---|---|
| **Inline UI für 10+ Screens** | ~1500 | Jeder Screen-Block (`if (screen === 'xxx') { return ... }`) ist direkt in App.tsx – sollten eigene Komponenten sein |
| **`handleNext()` + `handleContinue()`** | ~200 | Massiv verschachtelte if/else für 2 Modi × 5 Fragetypen × Review-Modus – duplizierter Code |
| **`handleBack()`** | ~80 | Dieselbe Fragetyp-Switch-Logik wie in handleNext/handleContinue |
| **FALLBACK_QUESTIONS (Hardcoded)** | ~250 | 15 Fragen fest im Code, sollten in separate Datei |
| **Progress-Bar-Logic (`getProgress()`)** | ~70 | Komplexe Berechnung mit Farben, Höhen, Scroll-Offset – reine UI-Logik |
| **Results-Berechnung** | ~60 (dupliziert!) | Identische Grade-Berechnung in `results`-Screen UND in `useEffect` für History-Saving |
| **AI Content Generation Mock** | ~100 | Mock-Szenarien sind Business Logic, die in App.tsx lebt |

### 🟡 Mittlere Priorität:

| Bereich | Problem |
|---|---|
| **50 State-Variablen** | Sollten in Custom Hooks gruppiert werden (useExamState, useSelectionState, useUIState, etc.) |
| **Alert/Confirm State** | 6 States für Dialoge → Ein `useDialog()` Hook |
| **Review-Screen** (Zeilen ~3200-3370) | **Toter Code!** Kommt nach einem `return`-Statement, wird nie erreicht. Das Review läuft über den `feedback`-Screen mit `examCompleted=true` |
| **Duplizierte Fragetyp-Switch-Logik** | In handleNext, handleContinue, handleBack, Results-onViewExam, Results-onReviewExam – immer derselbe Code zum Laden des nächsten/vorherigen Frage-States |
| **Selection-Screen-Handler** | Lange Inline-Callbacks in JSX (z.B. `onSelectSubject` ~30 Zeilen, `onSelectCategory` ~40 Zeilen) |

### 🟢 Niedrige Priorität:

| Bereich | Problem |
|---|---|
| Desktop-Wrapper | `<div className="relative w-full h-screen flex items-center justify-center">` → wiederholt sich bei JEDEM Screen |
| `isAnswerCorrect()` als Inline-Funktion | Sollte in einen Utility/Service extrahiert werden |
| Timer-Logic | Simpel genug für einen `useTimer()` Hook |

---

## 6. Fragen vor dem Refactoring

1. **Toter Code in `screen === 'review'`**: Der gesamte Review-Screen-Block (ab ca. Zeile 3200) kommt NACH einem `return`-Statement des Question/Feedback-Renderers und ist **unreachable**. Soll dieser komplett entfernt werden, oder soll er als eigenständiger Screen erhalten bleiben?

2. **Lokale Kopien in `/components/`**: Es gibt `SubjectSelection.tsx`, `CategorySelection.tsx`, `TopicSelection.tsx`, `SubtopicSelection.tsx` usw. sowohl in `/examapp/app/components/` als auch in `@/shared-content-selection`. App.tsx importiert NUR die Shared-Variante. Sollen die lokalen Kopien gelöscht werden?

3. **AI Content Generation**: Die Mock-Szenarien in `handleAIGenerate()` (~100 Zeilen) – ist die echte AI-Integration schon geplant, oder bleibt das vorerst Mock?

4. **`QuestionScreen.tsx` in Components**: Diese Datei existiert, wird aber nirgends importiert. Ist das ein früherer Versuch, den Question-Screen auszulagern?

5. **Soll der Screen-Flow beibehalten werden** (String-basiertes `screen`-State) oder darf ein leichtgewichtiger State-Machine-Ansatz eingeführt werden?

6. **Scope des Refactorings**: Geht es nur um App.tsx aufteilen, oder sollen auch die existierenden Components (ChoicesBox, ExamResultsScreen etc.) refactored werden?

---

## 7. Zusammenfassung in Zahlen

| Metrik | Wert |
|---|---|
| App.tsx Zeilen | 3.389 |
| State-Variablen | ~50 |
| useEffects | 7 |
| Screens (if-Blöcke) | 10 |
| Handler-Funktionen | ~25 |
| Hardcoded Questions | 15 (250 Zeilen) |
| Duplizierte Code-Muster | ~5 (Fragetyp-Switch) |
| Toter Code | ~190 Zeilen (unreachable review screen) |
| Existierende Custom Hooks | 2 (nur API) |
| Utils-Dateien | 14 |
| Components | 24+ |

**Fazit**: Die Datei ist ein klassischer „God Component" – sie übernimmt die Rolle von Router, State-Manager, Business-Logic-Layer und View-Layer gleichzeitig. Das Refactoring sollte systematisch erfolgen: erst State extrahieren (Custom Hooks), dann Business Logic auslagern, dann Screens als eigene Komponenten, und zum Schluss den duplizierten Fragetyp-Switch-Code konsolidieren.

---

## 8. Antworten auf die Fragen (Kapitel 6)

### 1. Toter Code in `screen === 'review'`:
- ✅ **Entfernen!** Der Review-Modus läuft bereits über den `feedback`-Screen mit `examCompleted=true`.
- Der unreachable Code kann komplett gelöscht werden.

### 2. Lokale Kopien in `/components/`:
- ✅ **BEHALTEN aber NICHT anfassen!**
- Ja, das sind Duplikate. Aber wir wollen beim Refactoring NUR aufräumen, keine Features ändern.
- Falls die App irgendwo doch auf die lokalen Kopien zugreifen würde, würde es sonst brechen.
- **Regel: Alles lassen wie es ist, nur App.tsx aufräumen.**

### 3. AI Content Generation:
- ✅ Das bleibt vorerst Mock.
- Einfach so lassen wie es ist, keine Änderungen an der AI-Logic nötig.

### 4. `QuestionScreen.tsx`:
- ✅ **Ignorieren.** Das ist wahrscheinlich ein alter Versuch.
- Wir erstellen im Refactoring eine NEUE `ExamSimulatorScreen.tsx` im `/screens/` Ordner.

### 5. Screen-Flow:
- ✅ **String-basiertes `screen`-State BEIBEHALTEN!**
- Keine State-Machine einführen. Das würde die Logic ändern.
- **Regel: Nur aufräumen, keine neue Logic.**

### 6. Scope des Refactorings:
- ✅ **NUR App.tsx aufteilen!**
- Existierende Components (ChoicesBox, ExamResultsScreen, etc.) **NICHT anfassen!**
- Wir nutzen sie einfach als Imports in den neuen Screen Components.

---

## 9. Refactoring-Regeln

### ❌ KEINE UI-Änderungen:
- Kein Pixel darf sich verschieben
- Keine Styles ändern
- Keine Animationen ändern
- Keine Layouts ändern

### ❌ KEINE Logic-Änderungen:
- Keine Berechnungen optimieren
- Keine Bugs fixen
- Keine „Verbesserungen"
- Duplizierten Code darf dupliziert bleiben (erstmal)

### ✅ NUR Aufräumarbeit:
- Code von App.tsx in Hooks/Screens **verschieben** (nicht ändern!)
- Imports anpassen
- Props durchreichen
- Typen korrekt deklarieren

---

## 10. Hardcoded Questions

Die `FALLBACK_QUESTIONS` (~250 Zeilen) werden extrahiert:

- ✅ **In separate Datei:** `/src/examapp/app/data/fallbackQuestions.ts`
- Import: `import { FALLBACK_QUESTIONS } from './data/fallbackQuestions';`
