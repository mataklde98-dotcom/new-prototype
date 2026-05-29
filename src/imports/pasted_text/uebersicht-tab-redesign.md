Redesign: Simplify "Übersicht" tab – remove situational content, add stable sections
Screen: Lernanalyse → Übersicht tab

Problem:
The current Übersicht tab contains sections that are situational – they depend on whether a Klassenarbeit is upcoming, whether critical weaknesses exist, etc. This means the tab can feel empty or irrelevant when those conditions aren't met. Additionally, the UI of some sections (like "Das steht jetzt an" and "Nächste Klassenarbeit") is not visually consistent with the polished look of other sections in the app.
Goal: The Übersicht must ONLY contain sections that are ALWAYS relevant and ALWAYS filled with data. No situational or conditional content. And the UI must be visually consistent across ALL sections.

What to REMOVE from the Übersicht tab:

"Das steht jetzt an" – COMPLETELY REMOVE. This section is situational and sometimes has no meaningful content to show.
"Nächste Klassenarbeit" – COMPLETELY REMOVE. Not always available. This information is already in the Ziele & Klausuren tab.
"Schwächen-Alert" – COMPLETELY REMOVE. This is conditional and belongs in the Schwächen & Lücken tab.
Nächstes Lernziel card below Nächste Klassenarbeit – COMPLETELY REMOVE. Same reason.


New Übersicht tab structure – from top to bottom:

Section 1: Gesamtfortschritt Hero (KEEP – unchanged)
Keep exactly as it is:

Large ScoreRing with overall percentage
Trend badge (Aufsteigend/Stabil/Absteigend)
This section already looks great – do not change anything


Section 2: Deine Stärken (NEW)
Title: "DEINE STÄRKEN"
Shows the top 3 topics where the student performs best. This section is always filled because as soon as the student has interacted with any content, there will always be strongest topics.
Display as 3 compact cards in a vertical list. Each card contains:

Topic name as title (e.g. "Bruchrechnung")
Fach as subtitle in smaller text (e.g. "Mathematik")
Score/percentage on the right side as a prominent number (e.g. "92%")
A small green accent indicator (dot or subtle left border) to signal "this is positive"

CRITICAL DESIGN INSTRUCTION: This section must be visually consistent with the existing "Lern-Streak" and "Deine Analyse im Detail" sections. Use the SAME card background style (glassmorphism), SAME border radius, SAME padding, SAME font sizes and weights, SAME subtle border treatment. Look at "Lern-Streak" and "Deine Analyse im Detail" as the design reference for how cards should look. Do NOT introduce new card styles, new background colors, or new visual patterns. Everything must feel like it belongs to the same design system.

Section 3: Konsistente Schwächen (NEW)
Title: "KONSISTENTE SCHWÄCHEN"
Shows the top 3 topics where the student consistently performs poorly. This section is always filled because there will always be weakest topics once the student has used the platform.
Display as 3 compact cards in a vertical list. Each card contains:

Topic name as title (e.g. "Zellatmung")
Fach as subtitle in smaller text (e.g. "Biologie")
Score/percentage on the right side as a prominent number (e.g. "28%")
A small red/orange accent indicator (dot or subtle left border) to signal "needs attention"
Below the topic info: TWO compact action buttons side by side: "Karteikarten erstellen" and "Prüfung starten" – same button style as used in the Schwächen & Lücken tab on weakness cards

CRITICAL DESIGN INSTRUCTION: Same rule as above – this section must be visually identical in card style to "Lern-Streak" and "Deine Analyse im Detail". Same glassmorphism cards, same spacing, same typography. The only difference is the content inside the cards. The action buttons must match the existing button style used elsewhere in the app (the compact green-accent glassmorphism buttons).

Section 4: Lern-Streak + Lernzeit (KEEP – unchanged)
Keep exactly as it is:

Streak in days + longest streak
Lernzeit this week
Weekly heatmap with flame icons
This section already looks great – do not change anything


Section 5: Deine Analyse im Detail (KEEP – unchanged)
Keep exactly as it is:

2x2 grid of Quick-Link cards to other tabs
Each card with icon, label, and teaser metric
This section already looks great – do not change anything


Summary of the new Übersicht structure:
┌─────────────────────────────────────────┐
│                                         │
│         🟢 71%  ↗ Aufsteigend           │  ← 1. Gesamtfortschritt Hero
│         ████████████░░░                 │     (unchanged)
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  DEINE STÄRKEN                          │  ← 2. Top 3 Stärken
│                                         │
│  Bruchrechnung                    92%   │
│  Mathematik                             │
│                                         │
│  Simple Past                      88%   │
│  Englisch                               │
│                                         │
│  Erörterung                       85%   │
│  Deutsch                                │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  KONSISTENTE SCHWÄCHEN                  │  ← 3. Top 3 Schwächen
│                                         │
│  Zellatmung                       28%   │
│  Biologie                               │
│  [Karteikarten] [Prüfung starten]      │
│                                         │
│  Stochastik                       35%   │
│  Mathematik                             │
│  [Karteikarten] [Prüfung starten]      │
│                                         │
│  Passé Composé                    41%   │
│  Französisch                            │
│  [Karteikarten] [Prüfung starten]      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  🔥 12 Tage Streak    📚 4,5h/Woche     │  ← 4. Lern-Streak
│  Längste: 18 Tage                       │     (unchanged)
│  Mo Di Mi Do Fr Sa So                   │
│  🔥 🔥 🔥 🔥 ·  ·  ·                    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  DEINE ANALYSE IM DETAIL                │  ← 5. Quick-Links
│                                         │     (unchanged)
│  ┌──────────┐ ┌──────────┐              │
│  │📊 Lern-  │ │🧠 Schwä- │              │
│  │fortschritt│ │chen      │              │
│  │   71%    │ │ 5 erkannt│              │
│  └──────────┘ └──────────┘              │
│  ┌──────────┐ ┌──────────┐              │
│  │🎯 Ziele &│ │📈 Leis-  │              │
│  │Klausuren │ │tung      │              │
│  │3Z · 2K   │ │  Ø 74%   │              │
│  └──────────┘ └──────────┘              │
│                                         │
└─────────────────────────────────────────┘

What was removed vs what replaced it:
RemovedReason"Das steht jetzt an"Situational – sometimes empty or irrelevant"Nächste Klassenarbeit"Situational – not always available, exists in Ziele & Klausuren tab"Schwächen-Alert"Conditional – exists in Schwächen & Lücken tabNächstes Lernziel cardSituational – exists in Ziele & Klausuren tab
AddedReason"Deine Stärken"Always available, motivating, stable data"Konsistente Schwächen"Always available, actionable, stable data

CRITICAL – Overall design consistency instruction:
The ENTIRE Übersicht tab must feel like ONE cohesive design. The sections "Lern-Streak" and "Deine Analyse im Detail" ALREADY look polished and consistent – they are the design benchmark. The new sections "Deine Stärken" and "Konsistente Schwächen" must match this benchmark exactly:

Same card background style (glassmorphism with subtle borders)
Same border radius on all cards
Same internal padding
Same font family (Poppins), same sizes, same weights
Same section title style (uppercase, same font size and weight as "LERN-STREAK" and "DEINE ANALYSE IM DETAIL")
Same vertical spacing between sections
Same color palette – no new colors. Use the existing green (#00D4AA) for positive indicators and the existing red (#FF6B6B) / orange (#FFB84D) for negative indicators
Same dark background (#0a0a0a)

Do NOT create any section that looks visually different or disconnected from the rest. Every section must look like it was designed together as one unified screen.