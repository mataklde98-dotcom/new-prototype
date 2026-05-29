Feature: Detail view for completed Klassenarbeiten (Abgeschlossene Klausuren)
Screen: Lernanalyse → Ziele & Klausuren → Klassenarbeiten → Abgeschlossene Klausuren → tap on a completed Klassenarbeit

Current behavior:
When the user taps on an abgeschlossene Klassenarbeit, the grade entry popup opens directly. There is no detail view.
New behavior:
When the user taps on an abgeschlossene Klassenarbeit, a detail view opens (same transition and screen style as the bevorstehende Klassenarbeit detail view). Inside this detail view, the user can see retrospective information about their preparation AND enter their grade.

New detail view structure – top to bottom:

Section 1: Header

Fach name as title (e.g. "Mathematik")
Date of the Klassenarbeit (e.g. "22.03.2026")
Label: "Abgeschlossene Klassenarbeit"
If a grade has been entered: show the grade prominently as a large badge (e.g. "2+" in green). The grade is NOT editable – it is permanent (as we already implemented).
If NO grade has been entered: show a prominent "Note eintragen" button. Tapping this opens the SAME grade entry popup that already exists (grade 1-6, tendency +/Glatt/−, then Klassenarbeit hochladen popup). The flow is identical to what currently happens when tapping on an abgeschlossene Klassenarbeit directly – just now it happens inside the detail view instead of immediately.


Section 2: Vorbereitungs-Bilanz
Title: "VORBEREITUNGS-BILANZ"
Subtitle: "Dein Vorbereitungsstand am Tag der Klassenarbeit."
Show the preparation percentage FROZEN at the state it was on the day of the exam. This is a snapshot, not a live value.

Large percentage number (e.g. "72%") prominently displayed
Progress bar showing the percentage
Use the app's neutral green/teal color for the progress bar
This value does not change – it is a historical snapshot


Section 3: Abgeschlossene Aktivitäten
Title: "DEINE VORBEREITUNG IN ZAHLEN"
Subtitle: "Was du für diese Klassenarbeit geleistet hast."
Three KPI metric cards side by side (same style as "Deine Lernziel-Bilanz" and "Nachhilfe-Insights" metric cards):
Card 1:

Large number: e.g. "45"
Label: "Karten gelernt"
Color: green/teal accent

Card 2:

Large number: e.g. "3"
Label: "Simulationen"
Color: green/teal accent

Card 3:

Large number: e.g. "4,5h"
Label: "Lernzeit"
Color: green/teal accent

These numbers represent the total flashcards studied, exam simulations completed, and total study time the student invested specifically for this Klassenarbeit during the preparation period.

Section 4: Themen-Bereitschaft
Title: "THEMEN-BEREITSCHAFT"
Subtitle: "Dein Stand in den klausurrelevanten Themen am Tag der Klassenarbeit."
A list of topics that were relevant for this Klassenarbeit, each showing the readiness percentage FROZEN at the state on the exam day:
Each topic row:

Topic name on the left (bold)
Percentage on the right
Progress bar below the topic name
Progress bar color: neutral green/teal (same as everywhere else – no colored bars based on percentage)

Example:
Scheitelpunktform                    85%
████████████████░░░

pq-Formel                           42%
████████░░░░░░░░░░░

Parabeln zeichnen                   68%
█████████████░░░░░░
Show all topics. If more than 5, show first 5 and a "Alle Themen anzeigen" button.
These values are frozen snapshots – they do not change.

Section 5: KI-Rückblick
Title: none – just the KI-Analyse box
Same style as the KI-Analyse boxes used in Lernziel-Bilanz and Nachhilfe-Insights (green-tinted GlassCard with sparkle icon):

Sparkle icon on the left
"KI-Rückblick" label in green
AI-generated summary text, e.g.: "Du hast dich 2 Wochen lang auf diese Klassenarbeit vorbereitet und 72% Bereitschaft erreicht. Deine Stärke war Scheitelpunktform (85%), während die pq-Formel (42%) deine größte Lücke war. Insgesamt hast du 45 Karteikarten gelernt und 3 Simulationen absolviert."

This is a retrospective summary – it reflects on what happened, not what to do next.

Summary – complete detail view:
┌─────────────────────────────────────────┐
│ Mathematik                              │
│ 22.03.2026                              │
│ Abgeschlossene Klassenarbeit            │
│                                         │
│          [ 2+ ]  ← grade (or            │
│                    "Note eintragen")     │
├─────────────────────────────────────────┤
│ VORBEREITUNGS-BILANZ                    │
│ Dein Vorbereitungsstand am Klausurtag   │
│                                         │
│            72%                          │
│ ████████████████░░░░░░                  │
├─────────────────────────────────────────┤
│ DEINE VORBEREITUNG IN ZAHLEN            │
│                                         │
│ ┌────────┐ ┌────────┐ ┌────────┐       │
│ │   45   │ │    3   │ │  4,5h  │       │
│ │ Karten │ │ Simul. │ │Lernzeit│       │
│ └────────┘ └────────┘ └────────┘       │
├─────────────────────────────────────────┤
│ THEMEN-BEREITSCHAFT                     │
│ Stand am Tag der Klassenarbeit          │
│                                         │
│ Scheitelpunktform              85%      │
│ ████████████████░░░                     │
│                                         │
│ pq-Formel                      42%      │
│ ████████░░░░░░░░░░░                     │
│                                         │
│ Parabeln zeichnen              68%      │
│ █████████████░░░░░░                     │
├─────────────────────────────────────────┤
│ ✨ KI-Rückblick                         │
│ Du hast dich 2 Wochen lang              │
│ vorbereitet und 72% Bereitschaft        │
│ erreicht. Deine Stärke war...           │
└─────────────────────────────────────────┘

Design guidelines:

The detail view transition must be IDENTICAL to how bevorstehende Klassenarbeit detail views open (same slide-in, same back button, same header style)
KPI metric cards must match the existing metric card style from Lernziel-Bilanz and Nachhilfe-Insights
Progress bars use the neutral green/teal accent color
The KI-Rückblick box matches the existing KI-Analyse box style
The grade display/entry follows the existing grade system (permanent after saving, 1-6 with tendency, Klassenarbeit hochladen popup after saving)
All values in this view are FROZEN snapshots from the exam day – they must not change over time
Dark theme consistent with the rest of the app
All text in German