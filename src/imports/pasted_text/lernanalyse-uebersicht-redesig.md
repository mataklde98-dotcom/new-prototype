**Redesign: "Übersicht" tab in Lernanalyse – Simplify into an action-oriented dashboard**

**Screen:** Lernanalyse → Übersicht tab (first tab)

---

**Problem:**
The current Übersicht tab shows too much information that is too shallow. It includes a Radar-Chart that most students won't understand, a "Stärkstes & Schwächstes Fach" section that is redundant with the Lernfortschritt tab, and a Leistung Summary that is too abstract. The tab tries to show everything but gives the student no clear direction on what to do next. The Übersicht should answer three questions: "How am I doing overall?", "What's coming up next?", and "What should I do right now?"

---

**What to REMOVE from the Übersicht tab:**

1. **Skill-Map Radar-Chart** – COMPLETELY REMOVE. It looks fancy but provides no actionable insight for students. The Fächerübersicht in the Lernfortschritt tab already shows subject performance much better.

2. **Stärkstes & Schwächstes Fach** (2-column grid cards) – COMPLETELY REMOVE. This is redundant information already available in the Lernfortschritt tab.

3. **Leistung Summary** – COMPLETELY REMOVE as a standalone section. It will be replaced by a Quick-Link card at the bottom.

4. **Schwächen & Lücken Summary** (the 3-column KPI cards with Schwächen/Wissenslücken/Risiken counts) – COMPLETELY REMOVE as a standalone section. It will be replaced by a smarter Schwächen-Alert and a Quick-Link card.

5. **Ziele & Klausuren Summary** – COMPLETELY REMOVE as a standalone section. It will be replaced by the "Anstehend" section and a Quick-Link card.

---

**New Übersicht tab structure – from top to bottom:**

---

**Section 1: Gesamtfortschritt Hero (KEEP – unchanged)**

Keep exactly as it is now:
- Large ScoreRing (72px) with overall percentage
- Trend badge (Aufsteigend/Stabil/Absteigend) with color and icon
- This is the first thing the student sees – their overall standing at a glance

---

**Section 2: Nächste Handlungen (NEW – most important section)**

Title: "Das steht jetzt an"

This section shows the 2-3 most urgent/important actions the student should take RIGHT NOW. Think of it as a smart, prioritized to-do list generated from all data across the app.

Each action item is a compact card containing:
- A priority indicator on the left (colored dot or small icon):
  - Red for urgent/critical items
  - Orange for important items
  - Green/teal for recommended items
- A short, actionable title (e.g. "Mathe-Klausur in 3 Tagen – Scheitelpunktform üben")
- A brief one-line reason WHY this action matters (e.g. "Nur 32% Fortschritt bei einem Kernthema")
- One direct action button on the right or below (e.g. "Karteikarten erstellen", "Prüfung starten", "Details ansehen")

Examples of what could appear here:
- An upcoming Klassenarbeit in less than 7 days with low preparation → "Mathe-Klausur am 22.03. – Vorbereitung bei 42%"
- A critical weakness that needs attention → "Kritische Schwäche: Bruchrechnung – nur 28%"
- An overdue or open ToDo → "Offene Aufgabe: 25 Min Prüfung Graphen verschieben"
- A Lernziel that is at risk → "Lernziel 'Passé Composé' gefährdet – Fortschritt stagniert"

Rules:
- Show maximum 3 items
- Sorted by urgency: most urgent first
- Each item must have exactly ONE clear action button
- If there are no urgent items, show a positive message: "Alles im grünen Bereich! Weiter so." with a subtle checkmark icon

---

**Section 3: Anstehend (KEEP – but make it more prominent)**

Title: "Nächste Klassenarbeit"

Show the next upcoming Klassenarbeit as a prominent card:
- Fach + Datum
- Countdown badge (e.g. "in 5 Tagen") – color coded: red if ≤3 days, orange if ≤7 days, green otherwise
- Vorbereitung progress bar with percentage
- The entire card is tappable → navigates to the Klassenarbeit detail view

If there is also a Lernziel with an upcoming deadline, show it as a second card below the Klassenarbeit:
- Same compact card style
- Fach + Lernziel name + Zieldatum + Countdown
- Fortschritt progress bar with percentage
- Tappable → navigates to Lernziel detail view

If no upcoming Klassenarbeit or Lernziel exists, show an empty state: "Keine anstehenden Termine – nutze die Zeit zum Wiederholen!"

---

**Section 4: Schwächen-Alert (NEW – conditional, only shows when critical weaknesses exist)**

This section ONLY appears if there are critical weaknesses or high risks detected. If there are none, this section is completely hidden – it does not show at all.

When visible:
- A compact alert card with a subtle red/orange left border
- Icon: Warning triangle
- Title: e.g. "2 kritische Schwächen erkannt"
- Subtitle: e.g. "Bruchrechnung und Zellatmung brauchen dringend Aufmerksamkeit"
- Button: "Schwächen ansehen →" – navigates to the Schwächen & Lücken tab

This is NOT a full list of weaknesses. It is just a brief alert that links to the detail tab. Keep it compact – maximum 3 lines of text.

---

**Section 5: Lern-Streak + Lernzeit (KEEP – unchanged)**

Keep exactly as it is now:
- Streak in days (orange) + longest streak
- Lernzeit this week (hours/minutes)
- Weekly heatmap (Mo-So) with flame icons
- This section motivates the student and is lightweight

---

**Section 6: Quick-Links (NEW – replaces the removed summary sections)**

Title: "Deine Analyse im Detail"

A 2x2 grid of compact, tappable cards. Each card is a shortcut to one of the other tabs with a single teaser metric:

**Card 1: Lernfortschritt**
- Icon: BarChart3
- Label: "Lernfortschritt"
- Teaser metric: The overall progress percentage (e.g. "71%")
- Tap → navigates to Lernfortschritt tab

**Card 2: Schwächen & Lücken**
- Icon: Brain
- Label: "Schwächen & Lücken"
- Teaser metric: Total number of weaknesses (e.g. "5 erkannt")
- Tap → navigates to Schwächen & Lücken tab

**Card 3: Ziele & Klausuren**
- Icon: Target
- Label: "Ziele & Klausuren"
- Teaser metric: Number of active items (e.g. "3 Ziele · 2 Klausuren")
- Tap → navigates to Ziele & Klausuren tab

**Card 4: Leistung**
- Icon: Activity
- Label: "Leistung"
- Teaser metric: Average score this week (e.g. "Ø 74%")
- Tap → navigates to Leistung tab

Each card has a subtle background, the icon in the top-left, the label below it, and the teaser metric prominently displayed. All four cards are the same size.

---

**Summary of the new Übersicht structure:**

```
┌─────────────────────────────────────────┐
│                                         │
│         🟢 71%  ↗ Aufsteigend           │  ← 1. Gesamtfortschritt Hero
│         ████████████░░░                 │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  DAS STEHT JETZT AN                     │  ← 2. Nächste Handlungen
│                                         │
│  🔴 Mathe-Klausur in 3 Tagen            │
│     Vorbereitung nur bei 42%            │
│                    [Details ansehen]     │
│                                         │
│  🔴 Kritisch: Bruchrechnung             │
│     Nur 28% – Kernthema Mathematik      │
│                    [Karteikarten]        │
│                                         │
│  🟠 Offene Aufgabe: Graphen-Prüfung     │
│     Seit gestern offen                  │
│                    [Prüfung starten]     │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  NÄCHSTE KLASSENARBEIT                  │  ← 3. Anstehend
│                                         │
│  Mathematik          ⏰ in 5 Tagen      │
│  22.03.2026                             │
│  Vorbereitung  ██████░░░░ 72%           │
│                                    >    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ⚠️ 2 kritische Schwächen erkannt       │  ← 4. Schwächen-Alert
│  Bruchrechnung und Zellatmung           │     (only if critical)
│              [Schwächen ansehen →]       │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  🔥 12 Tage Streak    📚 4,5h/Woche     │  ← 5. Lern-Streak
│  Längste: 18 Tage                       │
│  Mo Di Mi Do Fr Sa So                   │
│  🔥 🔥 🔥 🔥 ·  ·  ·                    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  DEINE ANALYSE IM DETAIL                │  ← 6. Quick-Links
│                                         │
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
```

---

**What was removed vs what replaced it:**

| Removed | Replaced by |
|---|---|
| Skill-Map Radar-Chart | Nothing – not needed |
| Stärkstes & Schwächstes Fach | Nothing – available in Lernfortschritt tab |
| Schwächen & Lücken Summary (3 KPI cards) | Schwächen-Alert (conditional) + Quick-Link card |
| Ziele & Klausuren Summary | Anstehend section + Quick-Link card |
| Leistung Summary | Quick-Link card |

---

**Design guidelines:**
- The "Nächste Handlungen" section is the MOST IMPORTANT section – it should feel prominent and actionable. Use subtle card backgrounds with colored left borders for priority indication.
- The Schwächen-Alert should feel like a notification/warning – subtle red or orange left border, not an aggressive full-red card.
- Quick-Link cards should feel lightweight and tappable – subtle glassmorphism background matching the existing card style.
- Maintain the existing dark theme, glassmorphism style, and color system throughout.
- All transitions when tapping cards (to detail views or other tabs) must be smooth and match existing app transitions.
- All text content must remain in German as shown above.
- Mobile-first: Everything must be scannable and tappable without scrolling through walls of text.

---