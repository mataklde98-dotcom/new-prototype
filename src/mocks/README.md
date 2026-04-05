# Mock Data Structure

Dieser Ordner enthält **ALLE Mock-Daten** für die Entwicklung der SoStudy App.

## 📁 Struktur

```
/src/mocks/
├── index.ts              # Zentrale Exports (IMMER hierüber importieren!)
├── flashcards.mock.ts    # Flashcard Sets & Cards
├── todos.mock.ts         # Todo Items
├── sessions.mock.ts      # Learning Sessions & Statistiken
├── user.mock.ts          # User Profile & Study Streaks
└── README.md             # Diese Datei
```

## 🎯 Verwendung

### ✅ RICHTIG - Import über zentrale index.ts:

```typescript
import { MOCK_FLASHCARD_SETS, MOCK_TODOS } from '@/mocks';
```

### ❌ FALSCH - Direkter Import:

```typescript
// NICHT SO!
import { MOCK_FLASHCARD_SETS } from '@/mocks/flashcards.mock';
```

## 📋 Verfügbare Mock-Daten

### Flashcards (`flashcards.mock.ts`)

```typescript
MOCK_FLASHCARD_SETS: FlashcardSet[]
// 25 vollständige Flashcard-Sets mit Karten
// Subjects: Biologie, Mathematik, Deutsch, Englisch, Geschichte, Chemie, Physik
```

### Todos (`todos.mock.ts`)

```typescript
MOCK_TODOS: Todo[]
getTodosByDate(date: Date): Todo[]
getTodosForToday(): Todo[]
getUpcomingTodos(days: number): Todo[]

// 18 Todo Items (heute bis +6 Tage + vergangene)
// Types: nachhilfe, karteikarten, prufung
```

### Learning Sessions (`sessions.mock.ts`)

```typescript
MOCK_LEARNING_SESSIONS: LearningSession[]
getSessionsBySetId(setId: number): LearningSession[]
getRecentSessions(limit: number): LearningSession[]
getAverageScoreForSet(setId: number): number
getTotalStudyTime(): number
getStudyTimeForDays(days: number): number

// 23 Learning Sessions über 10 Tage
// Scores: 80-94%
```

### User Profile & Streaks (`user.mock.ts`)

```typescript
MOCK_USER_PROFILE: UserProfile
MOCK_STUDY_STREAK: StudyStreak
hasStudiedToday(): boolean
updateUserXP(xpToAdd: number): UserProfile
addStudyTime(minutes: number): UserProfile

// User: Max Mustermann, Level 12, 7-day streak
```

## 🚀 API-Migration (Später)

Wenn die API fertig ist:

### Schritt 1: Service-Datei öffnen

```bash
# Öffne z.B. /src/services/flashcardService.ts
```

### Schritt 2: Mock-Import durch API ersetzen

```typescript
// VORHER:
import { MOCK_FLASHCARD_SETS } from '@/mocks';

export const flashcardService = {
  getAllSets: async () => {
    return Promise.resolve(MOCK_FLASHCARD_SETS);
  }
};

// NACHHER:
export const flashcardService = {
  getAllSets: async () => {
    const response = await fetch('/api/flashcards');
    return response.json();
  }
};
```

### Schritt 3: Mock-Datei löschen (optional)

```bash
rm /src/mocks/flashcards.mock.ts
# Mock wird nicht mehr importiert, kann gelöscht werden
```

### ✅ Fertig!

Components und Hooks bleiben **komplett unverändert**!

## 📊 Mock-Daten Übersicht

| Mock-Datei | Anzahl | Beschreibung |
|---|---|---|
| `flashcards.mock.ts` | 25 Sets | Vollständige Flashcard-Sets mit Cards |
| `todos.mock.ts` | 18 Items | Todos für verschiedene Tage & Fächer |
| `sessions.mock.ts` | 23 Sessions | Learning Sessions über 10 Tage |
| `user.mock.ts` | 1 User + Streak | User Profile & 30-Tage Streak History |

## 🎨 Daten-Qualität

Alle Mock-Daten sind:

- ✅ **Vollständig** - Keine Placeholders oder "..."
- ✅ **Realistisch** - Echte Fächer, Themen, Daten
- ✅ **Konsistent** - IDs referenzieren korrekt
- ✅ **Vielfältig** - Verschiedene Szenarien abgedeckt

## 🔄 Synchronisation mit ContentStore

Die Mock-Daten für Subjects, Categories, Topics und Subtopics werden direkt aus dem `/src/shared-content-store/ContentStore.tsx` verwendet und müssen NICHT hier dupliziert werden.

## 📝 Hinweise

1. **NIE direkt in Components nutzen** - Immer über Services!
2. **NIE Mock-Daten manipulieren** - Nur lesen, nicht schreiben (außer in Services)
3. **Zentrale Imports** - Immer `from '@/mocks'` nutzen
4. **Type-Safety** - Alle Mocks nutzen Types aus `/src/types`

## 🎯 Ziel

Diese Mock-Struktur ermöglicht:

- **Schnelle Entwicklung** - Realistische Daten sofort verfügbar
- **Easy API-Integration** - Nur Services ändern, nicht Components
- **Klare Organisation** - Alles an einem Ort
- **Keine Code-Suche** - Mock-zu-API Migration in Minuten
