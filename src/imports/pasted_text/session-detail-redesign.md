
Prompt for Figma Make:

Redesign: Session detail view in Nachhilfe-Fortschritt → Sitzungsverlauf
Screen: Nachhilfe-Fortschritt → Sitzungsverlauf → tap on a past session → Session detail view
This screen shows the details of a completed tutoring session. The current content structure needs to be reorganized. Some sections are redundant and must be removed, others need adjustments.

SECTION 1: Header (KEEP – unchanged)
Keep exactly as it is:

Topic name (e.g. "Quadratische Funktionen")
Subject + Teacher name (e.g. "Mathematik · Frau Schmidt")
AI badge
Date + Duration (e.g. "Dienstag, 10. März 2026 · 1 Stunde")


SECTION 2: Sitzungs-Zusammenfassung → COMPLETELY REMOVE
Delete the entire "Sitzungs-Zusammenfassung" section with "Behandelt:", "Stark:", "Weiter üben:" and the recommendation text. This is a weak repetition of what AI-Zusammenfassung and Behandelte Themen already show much better. It adds no unique value.

SECTION 3: AI-Zusammenfassung (KEEP – unchanged)
Keep exactly as it is. This is the personal AI-generated report for the student summarizing what happened in the session. The text, the AI badge, the card style – all stays.

SECTION 4: Behandelte Themen (KEEP + add subtitle)
Keep the section with the topic names and progress bars as they are. But add a descriptive subtitle below the section title so the student understands what the progress bars mean.

Title: "Behandelte Themen" (stays)
NEW subtitle below the title: "Zeigt, wie gut du in den behandelten Themen während dieser Sitzung abgeschnitten hast – basierend auf der KI-Analyse des Unterrichts."
Subtitle styling: small font size (12-13px), muted gray color, max 2 lines
Progress bars and percentages stay as they are


SECTION 5: Erkannte Schwächen (KEEP + change severities + add buttons)
Keep this section but make two changes:
Change 1: Replace the current severity badges
The current badges say "Beide Stränge" and "Aus Nachhilfe" – a student does not understand what "Stränge" means. Replace ALL severity badges with the standard severity system used throughout the app:
Current (wrong for student)New (correct)Beide SträngeKritisch (red)Aus NachhilfeMittel (orange) or Gering (green) depending on actual severity
Use the standard severity colors: Kritisch = red, Mittel = orange, Gering = green. Assign the severity based on the actual weakness level, not based on which "strand" it comes from.
Change 2: Add action buttons to each weakness card
Each weakness card must have two compact action buttons at the bottom – identical to how weakness cards look in the Nachhilfe-Fortschritt Gesamtübersicht and in Lernanalyse → Schwächen & Lücken:

"Karteikarten erstellen"
"Prüfung starten"

Same button style, same size, same positioning as used elsewhere in the app.
Card design: The weakness cards in this session detail view must look identical in design to the weakness cards in Nachhilfe-Fortschritt Gesamtübersicht → Erkannte Schwächen. Same card background, same layout, same severity badge positioning.

SECTION 6: Wichtige Erkenntnisse (KEEP – unchanged)
Keep exactly as it is. The numbered list with formulas and key takeaways is valuable for the student. Do not change anything.

SECTION 7: Empfohlene Übungen → COMPLETELY REMOVE
Delete the entire "Empfohlene Übungen" section with the cards showing "15 Karteikarten zur pq-Formel", "8 Übungsaufgaben", "Mini-Prüfungssimulation", "Sitzung nochmal erklären lassen". This section is redundant because:

Erkannte Schwächen already has action buttons for Karteikarten and Prüfung
The Lernplan section below also covers what the student should do
"Sitzung nochmal erklären lassen" moves to the Aktionen section at the bottom


SECTION 8: Lernplan → RENAME + redesign
Rename from "Lernplan" to "Aufgaben vom Lehrer"
Add subtitle: "Vom Lehrer empfohlen – arbeite diese Themen bis zur nächsten Sitzung durch."

Subtitle styling: small font size (12-13px), muted gray color

Redesign the items: Remove the checkbox-style layout. Replace with compact cards for each item, each containing:

Topic name as title (bold)
Subtitle: Day + Duration (e.g. "Mittwoch · 10 Min")
If the item involves Karteikarten or Prüfung: show the corresponding action button ("Karteikarten üben" or "Prüfung starten")
Items that were set by the teacher get a small "Vom Lehrer" badge in muted style

Same card design as ToDo cards used elsewhere in the app. Remove all checkbox circles.

SECTION 9: Aktionen → REDUCE to 2 items + add subtitles
Rename section to "Aktionen" (stays) but reduce from 4 buttons to 2:
REMOVE:

"Karteikarten erstellen" → redundant, already available in Erkannte Schwächen and Aufgaben vom Lehrer
"Prüfungssimulation starten" → redundant, same reason

KEEP with subtitles:
Button 1: "Sitzung nochmal erklären lassen"

Keep the existing button style
ADD subtitle below the button text: "Durch den Lernassistenten"
Subtitle: small, muted gray, inside the button card

Button 2: "Ich brauche mehr Hilfe zu diesem Thema"

Keep the existing button style
ADD subtitle below the button text: "Wird deinem Lehrer weitergeleitet"
Subtitle: small, muted gray, inside the button card


Summary – new section order top to bottom:
┌─────────────────────────────────────┐
│ HEADER                              │ ← Keep unchanged
│ Quadratische Funktionen             │
│ Mathematik · Frau Schmidt           │
│ Dienstag, 10. März 2026 · 1 Stunde │
├─────────────────────────────────────┤
│ AI-ZUSAMMENFASSUNG                  │ ← Keep unchanged
│ "In dieser Sitzung wurden..."       │
├─────────────────────────────────────┤
│ BEHANDELTE THEMEN                   │ ← Keep + add subtitle
│ (KI-Analyse deiner Performance)     │
│ pq-Formel ████░░░ 55%              │
│ Parabeln ███░░░░ 40%               │
│ Scheitelpunktform ██████░ 72%      │
├─────────────────────────────────────┤
│ ERKANNTE SCHWÄCHEN                  │ ← Change severities
│                                     │    + add action buttons
│ pq-Formel anwenden     [Kritisch]  │
│ Schwierigkeiten beim...             │
│ [Karteikarten] [Prüfung starten]   │
│                                     │
│ Gleichungen umstellen   [Mittel]   │
│ Fehler beim Isolieren...            │
│ [Karteikarten] [Prüfung starten]   │
├─────────────────────────────────────┤
│ WICHTIGE ERKENNTNISSE               │ ← Keep unchanged
│ 1. Die Scheitelpunktform...         │
│ 2. Die Diskriminante...             │
│ 3. Negative Öffnungen...            │
├─────────────────────────────────────┤
│ AUFGABEN VOM LEHRER                 │ ← Renamed from Lernplan
│ (Arbeite diese Themen bis zur       │    Redesigned cards
│  nächsten Sitzung durch)            │
│                                     │
│ pq-Formel wiederholen  [Vom Lehrer] │
│ Mittwoch · 10 Min                   │
│ [Karteikarten üben >]              │
│                                     │
│ Gleichungen umstellen üben          │
│ Donnerstag · 20 Min                 │
│ [Prüfung starten >]               │
├─────────────────────────────────────┤
│ AKTIONEN                            │ ← Reduced to 2
│                                     │
│ [Sitzung nochmal erklären lassen]  │
│  Durch den Lernassistenten          │
│                                     │
│ [Ich brauche mehr Hilfe]           │
│  Wird deinem Lehrer weitergeleitet  │
└─────────────────────────────────────┘

What was removed:
RemovedReasonSitzungs-ZusammenfassungRedundant with AI-Zusammenfassung + Behandelte ThemenEmpfohlene ÜbungenRedundant with Erkannte Schwächen buttons + Aufgaben vom LehrerAktionen: Karteikarten erstellenRedundant, already on weakness cards + AufgabenAktionen: Prüfungssimulation startenRedundant, already on weakness cards + Aufgaben

Design guidelines:

All new elements must match the existing dark theme and card styles
Weakness cards must look identical to those in the Nachhilfe-Fortschritt Gesamtübersicht
Action buttons on weakness cards must match the standard button style used throughout the app
Severity badges use the standard app severity colors (Kritisch red, Mittel orange, Gering green)
"Aufgaben vom Lehrer" cards must look similar to ToDo cards used elsewhere
Subtitles are always small (12-13px), muted gray
Smooth and consistent with the rest of the app
All text in German