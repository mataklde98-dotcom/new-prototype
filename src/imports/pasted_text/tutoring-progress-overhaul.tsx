Redesign: Nachhilfe-Fortschritt – Aufgaben vom Lehrer overhaul + Nachhilfe-Insights enhancement
Screen: Nachhilfe-Fortschritt (main overview + "Alle anzeigen" views)
Files affected: TutoringProgressScreen.tsx, tutoringProgress.mock.ts
This prompt contains TWO major changes. Read everything before starting implementation.

PART 1: Aufgaben vom Lehrer – Complete overhaul

1A: Title cleanup – show ONLY topic name
The task titles currently include the type prefix like "15 Karteikarten: Bruchrechnung" or "Mini-Prüfung: pq-Formel". Remove the prefix. The title must show ONLY the topic name.
Current title (wrong)New title (correct)15 Karteikarten: BruchrechnungBruchrechnungMini-Prüfung: pq-Formelpq-FormelPrüfungssimulation: ZellteilungZellteilungLinking Words VokabelnLinking Words Vokabeln (already correct, no prefix)Thesis Statement FormulierungenThesis Statement Formulierungen (already correct)
The type information moves to the detail line (see 1B below).

1B: Detail line – differentiate between Karteikarten and Prüfung
The detail line below the title currently shows "Aus Sitzung: 10.03.26 · ~10 Min" for all task types. This must differ based on task type:
For Karteikarten tasks (type: 'flashcards'):

Instead of "~10 Min" → show the card count, e.g. "15 Karten"
Full detail line: "Aus Sitzung: 10.03.26 · 15 Karten"

For Prüfung tasks (type: 'exam'):

Keep "~20 Min" as it is (duration makes sense for exams)
Full detail line: "Aus Sitzung: 10.03.26 · ~20 Min"


1C: Only ONE action button per task – matching the task type
Currently every task card shows BOTH "Karteikarten erstellen" and "Prüfung starten" buttons. This is wrong. Each task must show only the button that matches its type.
For Karteikarten tasks (type: 'flashcards'):

Show ONLY one button: "Karteikarten üben" (not "Karteikarten erstellen")
First click: navigates to the flashcard generation feature to create the set for this task
After the set has been generated once: subsequent clicks navigate directly to the existing flashcard set (not to generation again)
The button text stays "Karteikarten üben" in both cases

For Prüfung tasks (type: 'exam'):

Show ONLY one button: "Prüfung starten"
Navigates to the exam simulation feature

Do NOT show both buttons on any card. One task type = one button.

1D: Progress bar behavior – different per task type
For Karteikarten tasks:

The progress bar and percentage on the card STAY and are meaningful
The progress is coupled with the flashcard set progress: if the student has completed 60% of the flashcard set, the progress bar shows 60%
When the flashcard set reaches 100%, this task automatically moves to "Erledigt"
The severity "Begonnen" makes sense here – it shows the student has started but not finished the flashcard set

For Prüfung tasks:

REMOVE the progress bar and percentage display entirely
An exam is a one-time action: the student starts it, completes it, gets a grade. There is no "progress"
Instead, after the exam is completed, show the grade the student received (e.g. "Note: 2+" in a badge) where the progress bar used to be
If the exam has not been started yet: show nothing where the progress bar was (or a subtle "Noch nicht gestartet" text)
The severity "Begonnen" does NOT apply to exams – an exam is either "Neu" (not started) or "Erledigt" (completed with grade)


1E: Severity badges – correct per task type
Valid severity states for Karteikarten tasks:

Neu – freshly assigned, not started yet
Begonnen – student has generated the flashcard set and started learning but not at 100% yet
Erledigt – flashcard set at 100% (task moves to Erledigt tab)

Valid severity states for Prüfung tasks:

Neu – freshly assigned, not started yet
Erledigt – exam completed, grade is shown (task moves to Erledigt tab)
There is NO "Begonnen" state for exams

Severity badge colors:

Neu: neutral color (e.g. blue or teal, indicating fresh/new)
Begonnen: orange/yellow (in progress)
Erledigt: green (completed)


1F: Remove credits from task cards
Remove ALL credit displays ("+5 Credits", "credits: 5", etc.) from the task cards. The credits field in mock data can stay but must NOT be rendered in the UI anywhere.

1G: Add Fach filter chips in "Alle anzeigen" view
When the user taps "Alle offenen Aufgaben anzeigen" or "Alle erledigten Aufgaben anzeigen" and enters the full-view screen, add filter chips at the top to filter by Fach:

"Alle" (default, selected)
One chip per Fach that has tasks (e.g. "Mathematik", "Englisch", "Biologie")

Use the same chip style used everywhere else in the app (green accent for selected, outline for unselected). The Offen/Erledigt toggle stays above the filter chips.

1H: Grade display for completed Prüfung tasks
When a Prüfung task is completed and has moved to the "Erledigt" tab, the card must show the grade the student received. Display it as a prominent badge on the card (same position where the progress bar used to be), e.g.:

"Note: 2+" in green (good grade)
"Note: 4-" in orange/red (poor grade)

Use the same grade color coding as elsewhere in the app (green for 1-2, yellow for 3, red for 4-6).

PART 2: Nachhilfe-Insights enhancement – Fortschrittsverlauf

The current Nachhilfe-Insights section with three KPI cards + KI-Analyse text is too minimal. Enhance it with a progress tracking section that shows how the student has developed over time.
2A: Add "Fortschrittsverlauf" sub-section inside Nachhilfe-Insights
Below the three KPI metric cards and above the KI-Analyse text box, add a new sub-section:
Title: "Dein Fortschrittsverlauf"
Subtitle: "Zeigt, wie sich deine Leistung in der Nachhilfe über die Zeit entwickelt hat."
Date range selector:

Two buttons/fields: "Von" and "Bis" that open a calendar/date picker
Default range: last 30 days
Preset chips: "Letzte 7 Tage", "30 Tage", "3 Monate", "Gesamt"
The data below updates based on the selected time range

Content within the selected time range:
A) Performance chart:

A small area chart or line chart showing the performance trend over the selected period
X-axis: dates/weeks
Y-axis: performance percentage (0-100%)
Uses the app's green/teal accent color
Same chart style as used in Lernanalyse (recharts AreaChart)

B) Themen-Fortschritt (topic progress comparison):
Below the chart, show a list of topics where the student has made progress (or regressed) during the selected time range. Each item shows:

Topic name (bold)
Fach as subtitle
Two values: performance at START of range → performance at END of range (e.g. "35% → 68%")
A delta indicator showing the change (e.g. "+33%" in green, or "-5%" in red)
Small progress bar showing current level

Sort by biggest improvement first (most improved topic at top). If a topic has regressed, show it at the bottom with a red delta.
Example:
Bruchrechnung                    +33%
Mathematik                35% → 68%
████████████░░░░

pq-Formel                       +18%
Mathematik                40% → 58%
█████████░░░░░░░

Gleichungen umstellen            -5%
Mathematik                52% → 47%
███████░░░░░░░░░
Show max 5 topics. If more exist, "Alle Themen anzeigen" button → opens external view.
This data is derived from the treated topics across all sessions within the selected time range.

2B: New section order within Nachhilfe-Insights
NACHHILFE-INSIGHTS
│
├── Three KPI metric cards (keep as is)
│   [Sitzungen] [Ø Performance] [Trend]
│
├── Fortschrittsverlauf (NEW)
│   ├── Date range selector (Von/Bis + preset chips)
│   ├── Performance chart (area/line chart)
│   └── Themen-Fortschritt list (topic comparison)
│
└── KI-Analyse text box (keep as is, moves to bottom)

Summary of ALL changes:
ChangeSectionDetailTitle cleanupAufgaben vom LehrerOnly topic name, no type prefixDetail lineAufgaben vom LehrerKarteikarten: "X Karten", Prüfung: "X Min"Single buttonAufgaben vom LehrerKarteikarten → "Karteikarten üben", Prüfung → "Prüfung starten"Progress barAufgaben vom LehrerKeep for Karteikarten (coupled with set), REMOVE for PrüfungGrade displayAufgaben vom LehrerShow grade on completed Prüfung cardsSeveritiesAufgaben vom LehrerKarteikarten: Neu/Begonnen/Erledigt. Prüfung: Neu/Erledigt onlyRemove creditsAufgaben vom LehrerNo credit displays anywhereFach filter chipsAufgaben vom Lehrer "Alle anzeigen"Filter by subjectFortschrittsverlaufNachhilfe-InsightsDate range selector + performance chart + topic comparison

Design guidelines:

All card designs must match the existing Erkannte Schwächen card style
Filter chips use the system-wide green accent chip style
Charts use recharts (already imported) with the app's color palette
Grade badges use the same color coding as in the Klassenarbeiten system
Date range selector can use the existing PremiumCalendarPicker component
Empty states must be shown when no data is available for the selected range
Dark theme consistent
All text in German