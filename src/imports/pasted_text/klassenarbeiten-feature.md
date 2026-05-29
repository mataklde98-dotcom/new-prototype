---

**Prompt for Figma Make:**

---

**Feature: Auto-archive Klassenarbeiten + new "Abgeschlossene Klausuren" section with grade entry**

**Screen:** Lernanalyse → Ziele & Klausuren → Klassenarbeiten tab

---

## PART 1: Auto-remove expired Klassenarbeiten from "Bevorstehende Klausuren"

When the date of a Klassenarbeit has passed (the exam day is over), that Klassenarbeit must automatically disappear from the "Bevorstehende Klausuren" section. It must NOT remain visible there. The count badge (e.g. "(4)") must also update accordingly.

The removed Klassenarbeit moves to the new "Abgeschlossene Klausuren" section described below.

---

## PART 2: New section "Abgeschlossene Klausuren"

Add a NEW section below "Bevorstehende Klausuren" (and above "Klausur-Insights"):

**Section title:** "ABGESCHLOSSENE KLAUSUREN" with a count badge showing the total number (e.g. "(7)")

**Preview:** Show the last 2 completed Klassenarbeiten as cards. If more than 2 exist, show a button "Alle [X] abgeschlossene Klausuren anzeigen" that opens an external window with filter chips (by Fach) – identical pattern to how "Bevorstehende Klausuren" and "Aktive Lernziele" handle their "Alle anzeigen" views.

---

**Each completed Klassenarbeit card shows:**

- Fach label (e.g. "MATHEMATIK")
- Date of the Klassenarbeit (e.g. "15.03.2026")
- Label: "Klassenarbeit"
- Grade display: If a grade has been entered, show the grade prominently (e.g. "2+" in large font with appropriate color coding: green for 1-2, yellow/orange for 3, red for 4-6). If NO grade has been entered yet, show a button "Note eintragen" instead.

**Important:** The completed Klassenarbeit card is a SIMPLIFIED view. When tapping on it, it does NOT open the full detail view with ToDos, Stärken & Schwächen, KI-Empfehlungen etc. Those sections are only relevant for preparation BEFORE the exam. After the exam is done, the only interaction is viewing the card and optionally entering a grade.

---

## PART 3: Grade entry popup

When the user taps "Note eintragen" on a completed Klassenarbeit card (or taps on a card that has no grade yet), a popup/modal opens:

**Header:**
- Title: "Note eintragen"
- Subtitle: Fach + Datum der Klassenarbeit (e.g. "Mathematik · 15.03.2026")
- Close button (X) top right

**Grade selection:**
- 6 large tappable buttons in a horizontal row for grades 1 through 6
- Each button shows the number (1, 2, 3, 4, 5, 6)
- Color coding:
  - 1 = dark green
  - 2 = green
  - 3 = yellow/orange
  - 4 = orange
  - 5 = red/orange
  - 6 = red
- The selected grade is visually highlighted (filled background, others are outlined)

**Tendency selection (appears after selecting a grade):**
- Three tappable options in a horizontal row:
  - "+" (e.g. 2+)
  - "Glatt" (e.g. 2, no tendency)
  - "−" (e.g. 2−)
- The selected tendency is visually highlighted
- This selection is optional – "Glatt" is the default

**Preview:**
After selecting grade + tendency, show a preview of the combined grade (e.g. "2+" displayed prominently)

**Save button:**
- Full-width button: "Note speichern"
- Disabled until at least a grade is selected
- After saving: The popup closes, the card updates to show the saved grade, and a brief success toast/notification appears: "Note gespeichert"

**Edit existing grade:**
If a grade has already been entered, tapping the grade on the card reopens this same popup with the existing grade pre-selected, allowing the user to change it.

---

## PART 4: Synchronization with ToDo management

**Critical requirement:** The Klassenarbeiten in "Ziele & Klausuren" and the Klassenarbeiten in "ToDos verwalten" must be synchronized. They are the SAME data.

This means:
1. A Klassenarbeit that appears in "ToDos verwalten → Bevorstehende Klassenarbeiten" is the SAME Klassenarbeit that appears in "Ziele & Klausuren → Bevorstehende Klausuren"
2. When a Klassenarbeit expires and moves to "ToDos verwalten → Erledigte Klassenarbeiten", it must ALSO appear in "Ziele & Klausuren → Abgeschlossene Klausuren"
3. If a student enters a grade in "ToDos verwalten → Erledigte Klassenarbeiten", that grade must IMMEDIATELY be visible in "Ziele & Klausuren → Abgeschlossene Klausuren" as well – and vice versa
4. The grade entry popup must be IDENTICAL in both locations – same design, same options (1-6 with +/Glatt/−), same behavior
5. There must be ONE single source of truth for the grade. It does not matter WHERE the student enters the grade – it syncs everywhere.

**Display the sync visually:**
If a grade has already been entered (from either location), the completed Klassenarbeit card in "Abgeschlossene Klausuren" shows the grade directly instead of the "Note eintragen" button. The user can still tap it to edit.

---

## Summary of the complete flow:

```
BEVORSTEHENDE KLAUSUREN (4)
┌─────────────────────────────────┐
│ MATHEMATIK        In 5 Tagen    │
│ 22.03.2026                      │
│ Vorbereitung  ████░░░ 72%       │
└─────────────────────────────────┘
         │
         │  (exam date passes)
         ▼
ABGESCHLOSSENE KLAUSUREN (7)
┌─────────────────────────────────┐
│ MATHEMATIK                      │
│ 22.03.2026                      │
│ Klassenarbeit          [2+] ✅  │  ← grade entered
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ PHYSIK                          │
│ 10.03.2026                      │
│ Klassenarbeit  [Note eintragen] │  ← no grade yet
└─────────────────────────────────┘

  [ Alle 7 abgeschlossene Klausuren anzeigen ]
         │
         ▼ opens external window
  ┌────────────────────────────────┐
  │ Abgeschlossene Klausuren (7) X│
  │                                │
  │ Alle  Ma  De  Ph  Bio  ← chips│
  │                                │
  │ Card 1 (with grade)            │
  │ Card 2 (without grade)         │
  │ Card 3 ...                     │
  └────────────────────────────────┘
```

---

**Grade entry flow:**

```
Tap "Note eintragen" or tap existing grade
         │
         ▼
┌──────────────────────────────────┐
│ Note eintragen                 X │
│ Mathematik · 22.03.2026          │
│                                  │
│  [1] [2] [3] [4] [5] [6]        │  ← select grade
│                                  │
│  [+]  [Glatt]  [−]              │  ← select tendency
│                                  │
│         2+                       │  ← preview
│                                  │
│  [ Note speichern ]              │
└──────────────────────────────────┘
         │
         ▼
  Grade saved → synced to ToDo management
  Card updates to show grade
```

---

**Design guidelines:**
- The "Abgeschlossene Klausuren" section must visually match the "Bevorstehende Klausuren" section in card style and layout
- Grade colors: green spectrum for good grades (1-2), yellow/orange for middle (3-4), red for poor (5-6)
- The grade on the card should be displayed as a prominent badge, similar in style to the countdown badges on bevorstehende Klausuren cards
- The grade entry popup must match the existing popup/modal style of the app
- The "Alle anzeigen" external window must be identical in structure to the other "Alle anzeigen" windows (same transition, filter chips, card list)
- Dark theme consistent with the rest of the app
- All text content must remain in German

---