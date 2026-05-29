Feature: Align grade entry flow and data between "Ziele & Klausuren" and "ToDos verwalten"
Screens:

Lernanalyse → Ziele & Klausuren → Klassenarbeiten → Abgeschlossene Klausuren
ToDos verwalten → Erledigte Klassenarbeiten

These two sections show the EXACT SAME data. They are the same Klassenarbeiten. Everything must be identical and synchronized.

PART 1: Grade is permanent – no editing after saving
Current behavior: After saving a grade, the user can tap on the grade again and change it.
New behavior: Once a grade has been saved, it is PERMANENT and cannot be changed. The grade display on the card is no longer tappable. There is no edit option, no pencil icon, no way to modify the grade after saving.
Why: The grades feed into KI-Analyse and Klausur-Insights. Allowing changes would falsify the AI data over time.
This rule applies in BOTH locations:

Lernanalyse → Ziele & Klausuren → Abgeschlossene Klausuren
ToDos verwalten → Erledigte Klassenarbeiten

Once saved in either location, the grade is locked everywhere.

PART 2: Grade entry design must be identical in both locations
Current behavior: The grade entry UI in "Ziele & Klausuren" and "ToDos verwalten" looks different. The design for selecting grades and tendencies is inconsistent.
Fix: Use the SAME grade entry design from "ToDos verwalten" as the single source of truth for how grade selection looks. Copy that exact design – same note buttons, same tendency selection (+/Glatt/−), same layout, same colors, same styling – and apply it identically in "Ziele & Klausuren → Abgeschlossene Klausuren".
Both locations must use the EXACT SAME component:

Same grade buttons (1-6) with same colors and layout
Same tendency options (+/Glatt/−) with same styling
Same "Note speichern" button
Same visual flow

There must be ZERO visual difference between entering a grade in ToDos verwalten and entering a grade in Ziele & Klausuren.

PART 3: "Klassenarbeit hochladen" popup after saving grade
Current behavior in ToDos verwalten: After saving a grade, a popup appears asking "Klassenarbeit hochladen?" with two options: "Ja, hochladen" and "Nein, danke". This popup does NOT exist in Ziele & Klausuren.
Fix: After saving a grade in "Ziele & Klausuren → Abgeschlossene Klausuren", show the EXACT SAME "Klassenarbeit hochladen?" popup that already exists in ToDos verwalten.
Flow after tapping "Note speichern" in BOTH locations:

Grade is saved (permanently, no more editing)
Success toast appears briefly
"Klassenarbeit hochladen?" popup appears with:

Title: "Klassenarbeit hochladen"
Text explaining the user can upload their graded exam
Button 1: "Ja, hochladen" (opens file upload)
Button 2: "Nein, danke" (closes popup, returns to list)



Same popup, same design, same options – in both locations.

PART 4: Complete data synchronization
The following must be synchronized as ONE single data source between both screens:
Bevorstehende Klassenarbeiten:

"ToDos verwalten → Bevorstehende Klassenarbeiten" = "Ziele & Klausuren → Bevorstehende Klausuren"
Same exams, same dates, same data

Abgeschlossene Klassenarbeiten:

"ToDos verwalten → Erledigte Klassenarbeiten" = "Ziele & Klausuren → Abgeschlossene Klausuren"
Same exams, same grades, same upload status

Synchronization rules:

If a grade is entered in ToDos verwalten → it immediately appears in Ziele & Klausuren
If a grade is entered in Ziele & Klausuren → it immediately appears in ToDos verwalten
If a Klassenarbeit is uploaded in one location → the upload status shows in both
If a Klassenarbeit expires and moves to "abgeschlossen" → it moves in BOTH locations simultaneously
There is ONE shared data store for all Klassenarbeiten – not two separate lists


Summary:
User taps "Note eintragen" (in EITHER location)
    │
    ▼
┌──────────────────────────────────┐
│ Note eintragen                 X │  ← IDENTICAL design
│ Mathematik · 22.03.2026          │     in both locations
│                                  │     (use ToDos verwalten
│  [1] [2] [3] [4] [5] [6]        │      design as reference)
│                                  │
│  [+]  [Glatt]  [−]              │
│                                  │
│         2+                       │
│                                  │
│  [ Note speichern ]              │
└──────────────────────────────────┘
    │
    ▼ Grade saved PERMANENTLY (no editing)
    │
    ▼ Success toast
    │
    ▼
┌──────────────────────────────────┐
│ Klassenarbeit hochladen?         │  ← SAME popup
│                                  │     in both locations
│ [Ja, hochladen] [Nein, danke]   │
└──────────────────────────────────┘
    │
    ▼ Grade + upload synced across both screens
RuleBehaviorGrade entered in ToDos verwaltenImmediately visible in Ziele & KlausurenGrade entered in Ziele & KlausurenImmediately visible in ToDos verwaltenGrade savedPERMANENT – no editing possible afterwards in either locationUpload popupShown in BOTH locations after savingGrade entry designIDENTICAL in both locations – use ToDos verwalten as referenceData sourceONE shared store – not two separate lists

Design guidelines:

Use the existing grade entry design from ToDos verwalten as the single reference for both locations
Remove any edit/tap functionality on already-saved grades
The "Klassenarbeit hochladen" popup must be identical in both locations
Dark theme consistent with the rest of the app
All text content must remain in German