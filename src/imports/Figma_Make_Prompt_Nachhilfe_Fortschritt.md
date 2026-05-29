# PROMPT FOR CLAUDE (FIGMA MAKE) – Redesign Nachhilfe-Fortschritt (Student Panel)

## Context

You are working on the SoStudy student app prototype. The app uses a **dark glassmorphism UI** with:
- Background: `#0a0a0a`
- Cards: `GlassCard` with `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)` and `border: 1px solid rgba(255,255,255,0.06)`
- Font: `Poppins` (SemiBold for titles, Medium for labels, Regular for body)
- Colors: Green `#00D4AA` / `#00B894`, Blue `#4A9EFF`, Orange `#FFB84D` / `#FF8C00`, Red `#FF6B6B` / `#FF6B8A`, Purple `#7B61FF`
- AI badge: Green pill with Sparkles icon + "AI" / "AI-Analyse"
- Full-screen overlays via `MobileRouteTransition` pattern (slide-in from right)
- All screens have a back arrow (ArrowLeft) in the top-left and a scrollable content area

The prototype already has a **Nachhilfe-Fortschritt** section (TutoringProgressScreen.tsx, TutoringSessionDetailScreen.tsx, TutoringProgressWidget.tsx, TutoringExplainScreen.tsx) that needs to be **completely redesigned** to match the new teacher panel concept.

The existing routing/navigation structure uses `useNavigation.ts` with these states:
- `showTutoringProgress` → opens TutoringProgressScreen
- `showTutoringSessionDetail` + `selectedTutoringSessionId` → opens TutoringSessionDetailScreen
- `showTutoringExplain` → opens TutoringExplainScreen

Keep this navigation structure intact. The entry point is the `TutoringProgressWidget` on the home screen (HomeScreenMobile.tsx) which opens the full TutoringProgressScreen on tap.

---

## What Changed (Teacher Panel Context)

We built a comprehensive AI Teaching Assistant for tutors. The teacher panel:
1. **Combines two data strands**: Self-learning (flashcards, exam simulations, learning assistant, uploaded tests) + Tutoring (session transcription/post-session feedback)
2. **Generates AI briefings** before each session showing insights from both strands
3. **Generates AI worksheets** tailored to the student's exact error patterns
4. **Students can submit topic requests** for their next session (no deadline/cutoff)
5. **Teachers can assign tasks** (flashcards, exam simulations) as independent work after sessions
6. **Session Recap Cards** are generated after each session
7. **"I'm Confused" button** during self-learning flags topics for the teacher
8. **Pre-Session Warm-Up** sends practice questions 30 min before a session
9. **Progress Streaks** gamification for daily learning
10. **Topic Mastery Map** visual overview of mastered/in-progress/not-started topics

The student panel's Nachhilfe-Fortschritt section must reflect these changes. It shows **student-relevant data only** — no sentiment data, no class patterns, no other students' data.

There are **two variants**: Online tutoring (with transcription → richer session data) and Local tutoring (no transcription → simpler session summaries). The UI should handle both gracefully — same layout, but some sections show less detail for local tutoring students.

---

## REDESIGNED SECTIONS

### TutoringProgressWidget (Home Screen Widget)
**File: TutoringProgressWidget.tsx**
**Keep the existing compact card layout but update content to show:**
- Overall confidence circle (keep)
- Weakness count + pending tasks count (keep)
- **NEW**: If there's a pre-session warm-up available (session in < 30 min), show a highlighted "Warm-Up bereit 🔥" badge instead of the next session date
- **NEW**: Show streak count (🔥 5-Tage Streak) if active
- **NEW**: If teacher assigned tasks (flashcards/exam sim), show a small badge: "2 neue Aufgaben vom Lehrer"
- Bottom row: Keep AI insight + next session layout

---

### TutoringProgressScreen (Main Screen – Complete Redesign)
**File: TutoringProgressScreen.tsx**
**Single-column scrollable feed. Redesign with these sections in order:**

#### Section 0: Pre-Session Warm-Up Banner (Conditional)
- Only visible if a session is happening within the next 30 minutes
- Full-width card with a warm gradient (green/blue)
- Text: "Deine Sitzung mit [Lehrer] ist in [X] Minuten. Hier sind 3 Aufwärmfragen!"
- Tap opens a mini quiz (can be a simple list of 3 questions related to the briefing topic)
- After completion or if session is not soon: hidden

#### Section 1: Next Session + Topic Request
- **Top card** showing: Next session date (relative: "Morgen", "In 3 Tagen"), subject, teacher name
- **Below it**: "Wunschthema für die nächste Sitzung" input area
  - Introductory text: "Dein Lehrer bereitet die nächste Sitzung basierend auf deinen Lerndaten vor. Möchtest du ein bestimmtes Thema behandeln?"
  - Text input field with placeholder: "z.B. Bruchrechnung, Klassenarbeit am Freitag..."
  - "Wunsch speichern" button (green, `#00B894`)
  - "Gespeicherter Wunsch:" label showing current saved wish (if any), with option to edit/delete
  - Small note: "Optional – du kannst jederzeit ändern"
- This is the **most important new element** — it connects to the teacher's briefing system

#### Section 2: Session Recap Card (Latest Session)
- Only shown after a session has been analyzed
- Card with subject color indicator on the left (like existing session cards)
- Content:
  - "📚 Heute behandelt:" + list of topics
  - "✅ Stark:" + topics that went well (green text)
  - "🔁 Weiter üben:" + topics that need work (orange/red text)
  - "👉 Empfohlen:" + direct link to recommended flashcards/exercises
- **For Online tutoring students**: Shows rich detail from transcription (AI summary available, "Sitzung erklären lassen" button)
- **For Local tutoring students**: Shows simpler summary (topics + ratings from teacher's post-session, no "Sitzung erklären lassen" button)

#### Section 3: Assigned Tasks from Teacher
- Only shown if teacher has assigned flashcards or exam simulations
- Section title: "Aufgaben vom Lehrer" with a teacher icon
- Each task as a card:
  - Type icon (Layers for flashcards blue, ClipboardCheck for exam orange)
  - Task title + description
  - Status: "Neu" (blue badge), "Begonnen" (yellow), "Abgeschlossen ✅" (green)
  - Estimated time
  - Tap opens the flashcard set or exam simulation
- If no assigned tasks: section is hidden

#### Section 4: AI Knowledge Gap Recognition (Keep from existing, refine)
- Keep existing layout with SeverityDot + title + description + connected actions
- Connected actions should now be tappable buttons that actually open flashcard generator or exam simulation

#### Section 5: Detected Weaknesses (Keep from existing, refine)
- Keep existing layout
- Add small label showing source: "Aus Nachhilfe" or "Aus Selbstlernen" or "Beide Stränge" — so the student understands where the weakness was detected
- Do NOT show: teacher's emoji ratings, sentiment data, or detailed teacher notes

#### Section 6: Recommended Practice (Keep from existing)
- Keep existing layout with type icons and estimated time
- Add "Vom Lehrer empfohlen" badge for teacher-assigned recommendations vs AI-generated ones

#### Section 7: Topic Mastery Map (NEW)
- Section title: "Themenübersicht" with a visual map icon
- Visual representation of topics per subject:
  - ✅ Gemeistert (green, filled circle)
  - 🔄 In Bearbeitung (yellow, half-filled circle)  
  - ❌ Noch nicht begonnen (gray, empty circle)
- Organized by subject (Math topics, English topics, etc.)
- Simple, visual, no percentages — just status indicators
- Data source: Combined from both strands (tutoring confidence + self-learning scores)

#### Section 8: Study Plan Until Next Session (Keep from existing, refine)
- Keep checklist format
- Add items that come from teacher assignments: "📋 Vom Lehrer: Karteikarten-Set durcharbeiten"
- Completed items are crossed out with green checkmark

#### Section 9: Session History (Keep from existing)
- Keep existing clickable session cards with subject color, AI badge, date, duration, teacher name
- Each card opens TutoringSessionDetailScreen

#### Section 10: Smart Reminders (Keep from existing, add streak)
- Keep "Weitermachen wo du aufgehört hast" card
- Keep "Spaced Repetition Erinnerung" card
- **NEW**: Add progress streak card if streak is active:
  - "🔥 5-Tage Lernstreak! Weitermachen!"
  - Small motivational text

---

### TutoringSessionDetailScreen (Session Detail – Refine)
**File: TutoringSessionDetailScreen.tsx**
**Keep existing structure but add/modify:**

#### Add at top: Session Recap Card
- Same as Section 2 in the main screen but with full detail
- Shows: Topics covered with confidence bars, what went well, what needs practice

#### Modify: AI Summary Section
- **Online students**: Keep full AI summary with "Sitzung erklären lassen" button
- **Local students**: Show simplified summary: "In dieser Sitzung wurden folgende Themen behandelt: [topics]. Dein Lehrer hat folgende Einschätzung gegeben: [simplified feedback]." No "Sitzung erklären lassen" button.
- Add a note at top for local: "Diese Zusammenfassung basiert auf dem Feedback deines Lehrers."

#### Keep: Topics Covered with confidence bars
#### Keep: Detected Weaknesses with severity badges
#### Keep: Key Takeaways (Online only — hide for Local students)
#### Keep: Recommended Practice
#### Keep: Study Plan

#### Modify: AI Action Buttons at bottom
- Keep "Karteikarten erstellen" and "Prüfungssimulation starten"
- **Online only**: Keep "Sitzung nochmal erklären lassen"
- **NEW for both**: "Ich brauche mehr Hilfe zu diesem Thema" button → This flags the topic for the teacher's next briefing (similar to the "I'm Confused" button concept)

---

### TutoringProgressWidget (Update for new features)
**Keep compact layout, add:**
- Streak badge (🔥) if active
- "Aufgaben vom Lehrer" count if any pending
- Pre-Session Warm-Up indicator if session is within 30 min

---

### Mock Data Updates
**File: src/mocks/tutoringProgress.mock.ts**
**Add these new interfaces and mock data:**

```typescript
// NEW: Student topic request
export interface TopicRequest {
  id: string;
  text: string;
  savedAt: string; // ISO date
  sessionId: string; // for which upcoming session
}

// NEW: Teacher-assigned task
export interface TeacherAssignedTask {
  id: string;
  type: 'flashcards' | 'exam';
  title: string;
  description: string;
  assignedAt: string;
  status: 'new' | 'started' | 'completed';
  estimatedMinutes: number;
}

// NEW: Session Recap
export interface SessionRecap {
  sessionId: string;
  topicsCovered: string[];
  strongTopics: string[];
  weakTopics: string[];
  recommendedAction: string;
  isOnline: boolean; // determines detail level
}

// NEW: Topic Mastery Item
export interface TopicMasteryItem {
  id: string;
  topic: string;
  subject: string;
  status: 'mastered' | 'in_progress' | 'not_started';
}

// NEW: Progress Streak
export interface ProgressStreak {
  currentStreak: number;
  longestStreak: number;
  isActive: boolean;
}

// NEW: Pre-Session Warm-Up
export interface WarmUpQuestion {
  id: string;
  question: string;
  topic: string;
}

// Add to MOCK_OVERALL_STATS:
export const MOCK_OVERALL_STATS = {
  // ... existing fields ...
  streak: { currentStreak: 5, longestStreak: 12, isActive: true },
  pendingTeacherTasks: 2,
  savedTopicRequest: { id: 'req_1', text: 'Bruchrechnung, Klassenarbeit am Freitag', savedAt: '2026-03-13T10:00:00', sessionId: 'next' },
};

// Add mock assigned tasks
export const MOCK_TEACHER_TASKS: TeacherAssignedTask[] = [
  { id: 'tt_1', type: 'flashcards', title: '15 Karteikarten: Bruchrechnung', description: 'Vom Lehrer zugewiesen nach letzter Sitzung', assignedAt: '2026-03-10T17:00:00', status: 'new', estimatedMinutes: 10 },
  { id: 'tt_2', type: 'exam', title: 'Mini-Prüfung: pq-Formel', description: 'Vom Lehrer zugewiesen', assignedAt: '2026-03-10T17:00:00', status: 'started', estimatedMinutes: 20 },
];

// Add mock mastery map
export const MOCK_MASTERY_MAP: TopicMasteryItem[] = [
  { id: 'tm_1', topic: 'Lineare Gleichungen', subject: 'Mathematik', status: 'mastered' },
  { id: 'tm_2', topic: 'pq-Formel', subject: 'Mathematik', status: 'in_progress' },
  { id: 'tm_3', topic: 'Bruchrechnung', subject: 'Mathematik', status: 'in_progress' },
  { id: 'tm_4', topic: 'Prozentrechnung', subject: 'Mathematik', status: 'mastered' },
  { id: 'tm_5', topic: 'Geometrie', subject: 'Mathematik', status: 'not_started' },
  { id: 'tm_6', topic: 'Essay Structure', subject: 'Englisch', status: 'in_progress' },
  { id: 'tm_7', topic: 'Linking Words', subject: 'Englisch', status: 'mastered' },
  { id: 'tm_8', topic: 'Thesis Statements', subject: 'Englisch', status: 'in_progress' },
  { id: 'tm_9', topic: 'Mitose', subject: 'Biologie', status: 'mastered' },
  { id: 'tm_10', topic: 'Meiose', subject: 'Biologie', status: 'in_progress' },
];

// Add mock session recap for latest session
export const MOCK_SESSION_RECAP: SessionRecap = {
  sessionId: 'session_1',
  topicsCovered: ['pq-Formel', 'Parabeln zeichnen', 'Scheitelpunktform'],
  strongTopics: ['Scheitelpunktform'],
  weakTopics: ['pq-Formel', 'Parabeln zeichnen'],
  recommendedAction: 'Teste diese 5 Karteikarten zur pq-Formel',
  isOnline: true,
};

// Add mock warm-up questions
export const MOCK_WARMUP: WarmUpQuestion[] = [
  { id: 'wu_1', question: 'Was ist die allgemeine Form einer quadratischen Funktion?', topic: 'Quadratische Funktionen' },
  { id: 'wu_2', question: 'Wie berechnet man die Nullstellen mit der pq-Formel?', topic: 'pq-Formel' },
  { id: 'wu_3', question: 'Was beschreibt der Scheitelpunkt einer Parabel?', topic: 'Parabeln' },
];
```

---

## IMPORTANT CONSTRAINTS

1. **Keep existing navigation structure** — `showTutoringProgress`, `showTutoringSessionDetail`, `showTutoringExplain` states in useNavigation.ts
2. **Keep the existing GlassCard, SectionTitle, StatPill, ConfidenceBar, TrendBadge, SeverityDot sub-components** — they are used consistently across the app
3. **Keep the dark glassmorphism design language** — do NOT introduce new design patterns
4. **Keep German language** for all UI text (the app is in German)
5. **Font must remain Poppins** with the same weight usage: SemiBold for titles (15px), Medium for labels (12-13px), Regular for body (11-12px)
6. **Icons from lucide-react** — do not introduce other icon libraries
7. **TutoringExplainScreen.tsx stays as-is** — it's the AI chat screen that re-explains the session
8. **The "I'm Confused" button functionality** should also be added as a floating button on the FlashcardItem and exam simulation screens (but that's a separate task — for now just add the trigger in the session detail screen)
9. **All data comes from mock files** — do not add API calls. Use the mock data structure defined above.
10. **The Lernanalyse (ProfileAnalyticsScreen.tsx) is NOT being changed** — it stays as-is. The Nachhilfe-Fortschritt is a completely separate section.

---

## CRITICAL: OVERWRITE EXISTING FILES

⚠️ **The current prototype already contains an OLD version of the Nachhilfe-Fortschritt section. This old version is OUTDATED and must be COMPLETELY REPLACED — do NOT try to merge, patch, or partially update the old code. Write entirely new files from scratch based on this specification.**

The old files contain brainstorming-level placeholder UI that does NOT match the new teacher panel concept. The section structure, data flow, mock data, and features are all different now. Attempting to preserve old code will create inconsistencies.

**Specifically:**
- `src/mocks/tutoringProgress.mock.ts` → **DELETE ALL OLD CONTENT, WRITE FROM SCRATCH.** Old interfaces (TutoringSession, SkillArea, etc.) must be replaced with the new interfaces defined below. The old mock data (MOCK_SESSIONS, MOCK_SKILL_AREAS, etc.) is outdated and must be completely replaced.
- `src/app/components/TutoringProgressScreen.tsx` → **DELETE ALL OLD CONTENT, WRITE FROM SCRATCH.** The old screen had 8 sections (Progress Summary, AI Knowledge Gaps, Weaknesses, Recommended Practice, Skill Map, Study Plan, Sessions, Smart Reminders). The new screen has 10 completely different sections as specified below. Do NOT carry over any old section structure.
- `src/app/components/TutoringSessionDetailScreen.tsx` → **DELETE ALL OLD CONTENT, WRITE FROM SCRATCH.** The old detail screen does not support online/local variants, Session Recap Cards, or the "I need more help" button. Rewrite entirely.
- `src/app/components/TutoringProgressWidget.tsx` → **DELETE ALL OLD CONTENT, WRITE FROM SCRATCH.** The old widget does not show streaks, teacher tasks, or warm-up indicators. Rewrite entirely.

**Files that must NOT be changed:**
| File | Action |
|------|--------|
| `src/hooks/useNavigation.ts` | **NO CHANGE** — keep all existing navigation states exactly as they are |
| `src/app/App.tsx` | **NO CHANGE** — keep all routing and MobileRouteTransition wrappers exactly as they are |
| `src/app/components/TutoringExplainScreen.tsx` | **NO CHANGE** — this AI chat screen stays as-is |
| `src/app/components/TutoringActivationFlow.tsx` | **NO CHANGE** — the activation flow stays as-is |
| All other component files | **NO CHANGE** |

**What you MUST preserve from the old code:**
1. The component names must stay the same (TutoringProgressScreen, TutoringSessionDetailScreen, TutoringProgressWidget) — because App.tsx imports them by these names
2. The props interfaces must remain compatible with how App.tsx calls them (onClose, onOpenSessionDetail, sessionId, onOpenExplainSession, onGenerateForWeakness, onStartExamForWeakness, externalTransition)
3. The reusable sub-component patterns (GlassCard, SectionTitle, StatPill, ConfidenceBar, TrendBadge, SeverityDot) — rebuild them in each file using the same visual design, or extract to a shared file
4. The lucide-react icon imports and dark glassmorphism styling

---

## PRIORITY ORDER

1. **First**: Delete all content in `tutoringProgress.mock.ts` and write completely new interfaces + mock data from scratch
2. **Second**: Delete all content in `TutoringProgressScreen.tsx` and write the entirely new 10-section screen from scratch
3. **Third**: Delete all content in `TutoringSessionDetailScreen.tsx` and write the new detail screen with online/local variants from scratch
4. **Fourth**: Delete all content in `TutoringProgressWidget.tsx` and write the new widget with streak/tasks/warm-up from scratch
5. **Finally**: Verify that all navigation flows still work — the component names and prop interfaces must match what App.tsx expects:
   - `TutoringProgressScreen` must accept: `{ onClose, onOpenSessionDetail, externalTransition, isEmpty }`
   - `TutoringSessionDetailScreen` must accept: `{ sessionId, onClose, onOpenExplainSession, onGenerateForWeakness, onStartExamForWeakness, externalTransition }`
   - `TutoringProgressWidget` must accept: `{ onOpenProgress }`
   - Test flow: Widget tap → Progress Screen → Session card tap → Session Detail → "Sitzung erklären" → Explain Screen
