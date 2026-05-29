Redesign: Restructure Nachhilfe-Fortschritt overview page
Screen: Nachhilfe-Fortschritt (main overview, accessed via Profil → Nachhilfe → Fortschritt)

SECTIONS TO REMOVE:
1. Themenübersicht → COMPLETELY REMOVE
This section showing a general overview of all topics covered across sessions is too broad and not actionable. The student already sees treated topics in each individual session detail. A general summary is too abstract and not connected to specific sessions.
2. Lehrplan bis zur nächsten Sitzung → COMPLETELY REMOVE
This section does not work because the student might have sessions on consecutive days or even two sessions in one day, leaving no time to complete a "Lehrplan". The "Aufgaben vom Lehrer" section already covers what the student needs to do.
3. All Credit displays ("+5 Credits" etc.) → COMPLETELY REMOVE
Remove any credit-related badges, numbers, or indicators from this entire screen. We have not finalized where credits apply yet.

SECTIONS TO KEEP (in order):

Section 1: Bevorstehende Sitzungen (KEEP – unchanged)
Keep exactly as it is. Upcoming tutoring sessions with date, time, subject, teacher name. The student needs to know what is coming next.

Section 2: Sitzungsverlauf (KEEP – unchanged)
Keep exactly as it is. Preview of last 2 sessions with "Alle Sitzungen anzeigen" button. Access to past session details.

Section 3: Aufgaben vom Lehrer (KEEP – redesign as central task hub)
This section becomes the central place for ALL open and completed teacher tasks from ALL sessions combined.
Subtitle: "Alle Aufgaben, die dir deine Lehrer aus den Nachhilfesitzungen aufgegeben haben."
Two sub-sections within:
"Offen" (default view):

Shows all tasks from all sessions that are not yet completed
Each task card uses the same card design as Erkannte Schwächen cards (Fach label, topic name, progress bar, action buttons)
Badge: "Vom Lehrer" in neutral gray (same as in session detail view)
Each card shows which session it came from as a subtle subtitle (e.g. "Aus Sitzung: 10.03.2026")
Preview: 2 cards, then "Alle offenen Aufgaben anzeigen (X)" button

"Erledigt":

Accessible via a toggle or tab within the section: "Offen | Erledigt"
Shows completed tasks with a green checkmark or "Erledigt" badge
Same card design but slightly dimmer/muted to indicate completion
Preview: 2 cards, then "Alle erledigten Aufgaben anzeigen (X)" button


Section 4: Erkannte Schwächen (KEEP – ensure correct structure)
This section shows ALL recognized weaknesses from ALL tutoring sessions combined. It is a comprehensive overview – not limited to one session.
Subtitle: "Alle Schwächen, die in deinen Nachhilfesitzungen erkannt wurden."

Preview: 2 weakness cards
Button: "Alle Schwächen anzeigen (X)" → opens external window with filter chips (Alle / Kritisch / Mittel / Gering)
Card design: same as Erkannte Schwächen cards used throughout the app (Fach label, percentage, progress bar, severity badge, description, action buttons)
Severities: Kritisch (red), Mittel (orange), Gering (green)


Section 5: KI-Wissenslücken (KEEP – unchanged)
Keep this section. It identifies root causes behind multiple weaknesses – something completely different from Erkannte Schwächen and from KI-Empfehlungen in individual sessions.
Subtitle stays or adjust to: "Die KI hat Ursachen erkannt, die mehrere deiner Schwächen verursachen könnten – eine Lücke schließen, mehrere Probleme lösen."

Preview: 2 cards
Button: "Alle Wissenslücken anzeigen (X)" → opens external window with filter chips
Card design: same as Erkannte Schwächen cards
Keep the existing severity system for Wissenslücken


Section 6: Nachhilfe-Insights (NEW – replaces Themenübersicht)
A new section at the bottom showing compact KPI metrics that give the student a high-level view of their tutoring progress over time.
Title: "NACHHILFE-INSIGHTS"
Three metric cards side by side (same style as the "Deine Lernziel-Bilanz" metric cards):
Metric Card 1:

Large number: e.g. "12"
Label below: "Sitzungen absolviert"
Color: app's green/teal accent

Metric Card 2:

Large number: e.g. "68%"
Label below: "Ø Performance"
Color: app's green/teal accent
This is the average performance across all treated topics in all sessions

Metric Card 3:

Trend icon (↗ or ↘ or →)
Label below: "Trend"
Text below icon: "Aufsteigend" or "Stabil" or "Absteigend"
Color: green for Aufsteigend, yellow for Stabil, red for Absteigend

Below the three metric cards, an optional KI-Analyse text box (same style as used in Lernziel-Bilanz):

A short AI-generated summary of the tutoring progress, e.g. "Du hast in 12 Sitzungen deutliche Fortschritte in Mathematik gemacht. Deine größte Verbesserung war bei Bruchrechnung (+25%). Die KI empfiehlt, den Fokus auf Gleichungen umstellen zu legen."


Summary – new section order top to bottom:
┌─────────────────────────────────────┐
│ BEVORSTEHENDE SITZUNGEN             │ ← Keep unchanged
├─────────────────────────────────────┤
│ SITZUNGSVERLAUF                     │ ← Keep unchanged
├─────────────────────────────────────┤
│ AUFGABEN VOM LEHRER                 │ ← Central task hub
│ (Offen | Erledigt toggle)           │    all sessions combined
│ Preview 2 + "Alle anzeigen"        │
├─────────────────────────────────────┤
│ ERKANNTE SCHWÄCHEN                  │ ← All sessions combined
│ Preview 2 + "Alle anzeigen"        │
├─────────────────────────────────────┤
│ KI-WISSENSLÜCKEN                    │ ← Root causes
│ Preview 2 + "Alle anzeigen"        │
├─────────────────────────────────────┤
│ NACHHILFE-INSIGHTS (NEW)            │ ← KPI metrics
│ [12 Sitzungen] [68% Ø] [↗ Trend]  │
│ KI-Analyse: "Du hast in 12..."     │
└─────────────────────────────────────┘

What was removed vs what replaced it:
RemovedReasonThemenübersichtToo broad, not actionable, topics visible in each session detailLehrplan bis zur nächsten SitzungTiming issues, covered by Aufgaben vom LehrerCredit displaysNot finalized yet
AddedReasonNachhilfe-InsightsGives high-level progress view with KPIs and AI analysisAufgaben Offen/Erledigt toggleCentral hub for all teacher tasks across sessions

Design guidelines:

All cards must match the existing Erkannte Schwächen card design used throughout the app
Metric cards in Nachhilfe-Insights must match the style from "Deine Lernziel-Bilanz" (three cards side by side, same size, same font treatment)
KI-Analyse box matches the existing AI analysis box style
"Alle anzeigen" external windows must use the system-wide chip design with green accent
Empty states must be shown when filters return no results
Offen/Erledigt toggle must match existing toggle styles in the app
Dark theme consistent with the rest of the app
All text in German