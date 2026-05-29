Platform-wide change: KI determines Karteikarten count AND Prüfung duration – locked across all sections
This changes the behavior of "Karteikarten erstellen" and "Prüfung starten" buttons across the ENTIRE platform. Read everything carefully before implementing.

THE CHANGE
Currently, when a student taps "Karteikarten erstellen" or "Prüfung starten" from weakness/gap/risk/recommendation cards, they can freely choose the card count or exam duration themselves. This changes: the KI now determines these values and locks them, just like we already do for Lehrer-Aufgaben.

KARTEIKARTEN FLOW – Platform-wide
First click on "Karteikarten erstellen":

Feature opens with the card count LOCKED by the KI (e.g. 20 Karten)
The slider is disabled/grayed out with a lock icon – same lock design as Lehrer-Aufgaben
Lock text: "Anzahl von der KI festgelegt" (NOT "Lehrer-Aufgabe")
Student generates the set
The generated set is COUPLED with this specific weakness/gap/risk/recommendation
After generation, the button text on the card changes from "Karteikarten erstellen" to "Karteikarten fortsetzen"

Subsequent clicks "Karteikarten fortsetzen":

Opens the LINKED set directly – does NOT open the generation feature again
Student continues learning where they left off
Progress on the card syncs with the set progress

Set reaches 100%:

The button text changes to "Neue Karteikarten erstellen"
The student can create a NEW set for the same weakness
The KI determines the count again – potentially fewer cards because the student has improved
The old set stays in Meine Karteikarten and is not deleted
The card is now coupled with the NEW set
Cycle repeats: Erstellen → Fortsetzen → 100% → Neue erstellen

Button text lifecycle:
"Karteikarten erstellen" → (first set generated) →
"Karteikarten fortsetzen" → (set at 100%) →
"Neue Karteikarten erstellen" → (new set generated) →
"Karteikarten fortsetzen" → (set at 100%) →
"Neue Karteikarten erstellen" → ... (repeats)

PRÜFUNG FLOW – Platform-wide
First click on "Prüfung starten":

Feature opens with the exam duration LOCKED by the KI (e.g. 25 Min)
The slider is disabled/grayed out with a lock icon – same lock design as Lehrer-Aufgaben
Lock text: "Dauer von der KI festgelegt" (NOT "Lehrer-Aufgabe")
Student completes the exam and receives a grade
The grade is shown on the card (e.g. "Note: 2+")
After completion, the button text changes from "Prüfung starten" to "Neue Prüfung starten"

After first exam completed – "Neue Prüfung starten":

Opens the exam feature again with a NEW KI-locked duration
The KI may adjust the duration based on how the student performed in the previous exam
Student completes the new exam, gets a new grade
The card updates to show the latest grade
Cycle repeats

Button text lifecycle:
"Prüfung starten" → (exam completed, grade shown) →
"Neue Prüfung starten" → (new exam completed, new grade) →
"Neue Prüfung starten" → ... (repeats)

WHERE THIS APPLIES
Every single location in the app where "Karteikarten erstellen" and "Prüfung starten" buttons appear on weakness/gap/risk/recommendation cards:
Lernanalyse → Schwächen & Lücken:

Erkannte Schwächen → both buttons
KI-Wissenslücken → both buttons
Zukünftige Risiken → both buttons

Lernanalyse → Ziele & Klausuren → Klassenarbeit-Detail:

Stärken & Schwächen → both buttons
KI-Empfehlungen → both buttons

Lernanalyse → Ziele & Klausuren → Lernziel-Detail:

Erkannte Schwierigkeiten → both buttons
KI-Empfehlungen → both buttons

Nachhilfe-Fortschritt → Overview:

Erkannte Schwächen → both buttons
KI-Wissenslücken → both buttons

Nachhilfe-Fortschritt → Session Detail:

Erkannte Schwächen → both buttons
KI-Empfehlungen → both buttons

Also in ALL "Alle anzeigen" expanded views for the above sections.

WHERE THIS DOES NOT APPLY
Exception 1: KI-Tools → Karteikarten generieren / Prüfungssimulation
When the student goes to KI-Tools and freely creates flashcards or starts an exam simulation WITHOUT a specific weakness context, they can still freely choose the count/duration. This is free learning, not targeted weakness training.
Exception 2: Lehrer-Aufgaben
These already have their own lock system ("Anzahl durch Lehrer-Aufgabe festgelegt"). Keep that unchanged. The lock text for Lehrer-Aufgaben stays as it is.
Exception 3: Deine ToDo's in Klassenarbeit/Lernziel Detail
These already have locked values. Keep unchanged.

LOCK TEXT DIFFERENTIATION
Three different lock texts depending on the source:
SourceLock text for KarteikartenLock text for PrüfungKI (weakness/gap/risk/recommendation)"Anzahl von der KI festgelegt""Dauer von der KI festgelegt"Lehrer-Aufgabe"Anzahl durch Lehrer-Aufgabe festgelegt""Dauer durch Lehrer-Aufgabe festgelegt"Free (KI-Tools)No lock, slider freely adjustableNo lock, slider freely adjustable
All three lock designs use the SAME visual lock component (lock icon, grayed-out slider). Only the text differs.

NOTIFICATION BAR DIFFERENTIATION
When the feature screen opens, the notification bar at the top must show the correct source:
SourceNotification textNotification colorErkannte Schwäche"Schwäche gezielt trainieren" + severity badgeSeverity colorKI-Wissenslücke"Wissenslücke schließen" + severity badgeSeverity colorZukünftiges Risiko"Risiko vorbeugen" + severity badgeSeverity colorStärken & Schwächen (Klassenarbeit)"Klausurvorbereitung" + severity badgeSeverity colorKI-Empfehlung"KI-Empfehlung" + severity badgeSeverity colorLehrer-Aufgabe"Lehrer-Aufgabe"Green (no severity)Free (KI-Tools)No notification barN/A

TECHNICAL SUMMARY
For each weakness/gap/risk/recommendation card, store:
{
  linkedFlashcardSetId: string | null,    // linked Karteikarten set
  flashcardSetProgress: number,            // 0-100, synced from set
  lastExamGrade: string | null,           // e.g. "2+", from last completed exam
  examCompleted: boolean                   // has at least one exam been completed
}
Button rendering logic:
Karteikarten:
  linkedSetId === null → "Karteikarten erstellen"
  linkedSetId !== null && progress < 100 → "Karteikarten fortsetzen"
  linkedSetId !== null && progress === 100 → "Neue Karteikarten erstellen"

Prüfung:
  examCompleted === false → "Prüfung starten"
  examCompleted === true → "Neue Prüfung starten"

Design guidelines:

Lock icon and disabled slider: SAME visual design as Lehrer-Aufgaben locks
Button text changes must happen seamlessly without page reload
Progress sync between flashcard set and card must be real-time
Grade display on cards after exam completion: same grade badge style used elsewhere
All text in German
Dark theme consistent