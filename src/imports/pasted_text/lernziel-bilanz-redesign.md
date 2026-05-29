Redesign: "Lernziel-Insights" section in Ziele & Klausuren → Lernziele
Screen: Lernanalyse → Ziele & Klausuren → Lernziele tab → scroll down to the insights section below the active Lernziele

Problem:
The current "Lernziel-Insights" section has multiple issues:

The three metric cards (80% Erfolgsrate, 13d Ø Geplant, 12d Ø Tatsächlich) are not immediately understandable. A student does not know what "Erfolgsrate" means in this context, and "Ø Geplant vs Ø Tatsächlich" is confusing on first glance.
The section "Gemeisterte Themen" is incorrectly named – it should represent reached/completed Lernziele, not mastered topics.
There is no consideration for scalability – a student may have dozens or hundreds of completed Lernziele over time, and they cannot all be displayed here.


Changes to make:

Step 1: Rename the section
Change the section title from "Lernziel-Insights" to "Deine Lernziel-Bilanz"
Remove the lightbulb icon next to the title – it is not needed.

Step 2: Replace the three metric cards with understandable metrics
Remove the current three metric cards (Erfolgsrate, Ø Geplant, Ø Tatsächlich). Replace them with three NEW metric cards that any student understands immediately:
Metric Card 1:

Large number: e.g. "5"
Label below: "Ziele erreicht"
Color: Green (positive/success)

Metric Card 2:

Large number: e.g. "4"
Label below: "Davon pünktlich"
Color: Green (positive/success) or neutral white if all were on time, orange if some were late

Metric Card 3:

Large number: e.g. "3"
Label below: "Aktive Ziele"
Color: The app's primary green/teal accent color

Same card layout as before (three cards side by side in a horizontal row), just with different content. Each card must be instantly scannable – big number, short label, done.

Step 3: Replace "Gemeisterte Themen" with "Erreichte Ziele"
Rename "Gemeisterte Themen" to "Erreichte Ziele"
Display ONLY the last 3 completed Lernziele as a compact list. Each item shows:

Lernziel name (e.g. "Lineare Gleichungen")
Fach as subtitle (e.g. "Mathematik")
Green checkmark icon on the left
Duration on the right: How many days it took to reach the goal (e.g. "12 Tage")

If fewer than 3 Lernziele have been reached, show however many exist. If zero have been reached, show an empty state: "Du hast noch kein Lernziel abgeschlossen. Arbeite an deinen aktiven Zielen!"

Step 4: Add "Alle anzeigen" button below the 3 items
Below the 3 displayed reached Lernziele, add a button: "Alle erreichten Ziele anzeigen"
This button is ONLY visible if more than 3 Lernziele have been reached. If 3 or fewer have been reached, do NOT show this button.
The button style must be identical to the existing "Alle anzeigen" buttons used elsewhere in the app (e.g. "Alle 3 Lernziele anzeigen", "Alle 5 anzeigen" etc.).

Step 5: External window when tapping "Alle anzeigen"
When the user taps "Alle erreichten Ziele anzeigen", an external window/modal opens – identical in style and behavior to the external windows used for "Aktive Lernziele" and "Erkannte Schwierigkeiten".
Header of the external window:

Title: "Erreichte Ziele" with total count (e.g. "Erreichte Ziele (12)")
Close button (X) or back arrow

Filter chips at the top:
Row 1 – Filter by Fach:

"Alle" (default, selected)
One chip per Fach that has at least one reached Lernziel (e.g. "Mathematik", "Englisch", "Deutsch", "Biologie")
Horizontally scrollable if many Fächer exist

Row 2 – Filter by Zeitraum:

"Alle" (default, selected)
"Letzter Monat"
"Letzte 3 Monate"
"Dieses Schuljahr"

Both filter rows work together: the user can filter by Fach AND Zeitraum simultaneously. The list updates in real-time based on the selected filters.
List content:
All reached Lernziele displayed as cards, each showing:

Green checkmark icon
Lernziel name as title
Fach as subtitle
Completion date (e.g. "Erreicht am 15.02.2026")
Duration (e.g. "In 12 Tagen erreicht")

Cards are sorted by most recently completed first (newest at top).
If no Lernziele match the current filter combination, show an empty state: "Keine erreichten Ziele in diesem Zeitraum."

Step 6: KI-Analyse at the bottom
Keep the KI-Analyse box at the bottom of the section but make these changes:

Remove the sparkle/KI icon on the left of the text – it pushes content to the right
Keep the text content as is (the AI-generated summary about goal performance)
The KI-Analyse box stays below the "Alle anzeigen" button


Summary of the new section structure:
DEINE LERNZIEL-BILANZ

┌─────────┐ ┌─────────┐ ┌─────────┐
│    5    │ │    4    │ │    3    │
│  Ziele  │ │  Davon  │ │ Aktive  │
│erreicht │ │pünktlich│ │  Ziele  │
└─────────┘ └─────────┘ └─────────┘

ERREICHTE ZIELE

✅ Lineare Gleichungen          12 Tage
   Mathematik

✅ Simple Past                   8 Tage
   Englisch

✅ Photosynthese                12 Tage
   Biologie

[ Alle erreichten Ziele anzeigen ]
         ↓ opens external window
         ┌──────────────────────────┐
         │ Erreichte Ziele (12)   X │
         │                          │
         │ Alle Ma De En Bio  ←chips│
         │ Alle 1M 3M Schuljahr    │
         │                          │
         │ ✅ Lernziel 1    15.02.  │
         │ ✅ Lernziel 2    03.02.  │
         │ ✅ Lernziel 3    ...     │
         │ ...                      │
         └──────────────────────────┘

KI-Analyse: "4 von 5 Zielen pünktlich
erreicht. Du setzt dir realistische Ziele."

Design guidelines:

External window must match the existing external window style used for Aktive Lernziele and Erkannte Schwierigkeiten – same transition, same layout, same close behavior
Filter chips must match the existing filter chip style used elsewhere in the app
The three metric cards must be the same size and layout as the previous metric cards, just with new content
Dark theme consistent with the rest of the app
All text content must remain in German as shown above