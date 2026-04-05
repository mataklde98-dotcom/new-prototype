Feature + Bugfix: Complete task lifecycle for "Aufgaben vom Lehrer" – Prüfung and Karteikarten flows
Screens:

All "Aufgaben vom Lehrer" sections (Nachhilfe-Fortschritt overview, session detail views)
Karteikarten feature (opened from Lehrer-Aufgabe)
Prüfungssimulation feature (opened from Lehrer-Aufgabe)


FLOW 1: Prüfung tasks – complete lifecycle
Current problem: After completing a Prüfung from a Lehrer-Aufgabe, the grade is not shown on the task card and the task does not move to "Erledigt". It stays open with "Nicht gestartet".
Correct flow:
Step 1 – Task is open, not started:

Card shows in "Offen" tab
Button: "Prüfung starten"
No grade displayed
Status text: "Nicht gestartet" or no status

Step 2 – User taps "Prüfung starten" and completes the exam:

The Prüfungssimulation feature opens (as it currently does – this works)
User completes the exam and receives a grade (e.g. "2+")

Step 3 – After exam completion → task auto-updates:

The grade from the completed Prüfungssimulation is AUTOMATICALLY written back to the task card
The task card now shows the grade as a prominent badge (e.g. "Note: 2+" in green, using the standard grade color coding)
The task AUTOMATICALLY moves from "Offen" to "Erledigt"
The "Prüfung starten" button changes to "Ergebnis ansehen" or disappears
The open task count updates accordingly

This must happen automatically – the user does NOT manually mark the task as done. Completing the exam = task is done.

FLOW 2: Karteikarten tasks – complete lifecycle
Current problem: After generating a Karteikartenset from a Lehrer-Aufgabe, the set is not coupled with the task. The progress does not sync. The task stays open regardless.
Correct flow:
Step 1 – Task is open, first time clicking "Üben":

Card shows in "Offen" tab
Button: "Üben"
Progress: 0%
Status: "Nicht gestartet"

Step 2 – User taps "Üben" for the FIRST time:

The Karteikarten generation feature opens
User generates a Karteikartenset (e.g. 15 cards)
After generation: this specific Karteikartenset is LINKED to this specific task (store the set ID on the task)
The task status changes to "Begonnen"
The task progress updates to match the set progress (initially 0% or wherever the user got to)

Step 3 – User taps "Üben" AGAIN (second time and onwards):

The Karteikarten generation feature does NOT open again
Instead, the user is taken DIRECTLY to the already-generated Karteikartenset that is linked to this task
The user continues learning with that set

Step 4 – Progress sync:

Every time the user makes progress in the linked Karteikartenset (swiping cards right/left in the learning simulator), the progress percentage on the task card updates to match
Task progress = Karteikartenset progress
If the set is at 60%, the task shows 60%

Step 5 – Set reaches 100% → task auto-completes:

When the linked Karteikartenset reaches 100% progress
The task AUTOMATICALLY moves from "Offen" to "Erledigt"
The progress bar shows 100%
The Karteikartenset remains in the system (under Meine Karteikarten) – it is NOT deleted
The user can still access and review the set anytime, but the task is marked as done


Data coupling requirements:
For Prüfung tasks:
Task card ←→ Completed exam result
- Store: examResultId on the task
- Read: grade from the exam result
- Trigger: exam completion → task moves to Erledigt + grade displays
For Karteikarten tasks:
Task card ←→ Generated Karteikartenset
- Store: linkedSetId on the task (set after first generation)
- Read: progress percentage from the linked set
- Trigger: first click → generate + link, subsequent clicks → open linked set
- Trigger: set at 100% → task moves to Erledigt

How to detect "first time" vs "returning":
Check if the task has a linkedSetId:

linkedSetId === null → First time. Open generation feature. After generation, store the new set ID on the task.
linkedSetId !== null → Returning. Open the existing set directly. Skip generation.


Summary:
Task typeFirst click "Üben"/"Prüfung starten"Subsequent clicksCompletion triggerWhat shows on completed cardPrüfungOpens exam simulationN/A (one-time action)Exam completedGrade badge (e.g. "Note: 2+")KarteikartenOpens generation → creates + links setOpens linked set directlySet reaches 100%Progress 100% + Erledigt

This applies to ALL "Aufgaben vom Lehrer" everywhere in the app:

Nachhilfe-Fortschritt overview → Aufgaben vom Lehrer
Session detail view → Aufgaben vom Lehrer
Any "Alle anzeigen" views for Aufgaben vom Lehrer

The behavior must be identical regardless of where the user accesses the task.

Do not change any visual design. Same card style, same buttons, same layout. Only fix the data flow, coupling, and automatic state transitions.