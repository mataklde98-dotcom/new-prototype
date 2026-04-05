Redesign: Standardize all insight/weakness/recommendation cards in Klassenarbeit and Lernziel detail views to match the neutral GlassCard + Progressbar design
Screens:

Lernanalyse → Ziele & Klausuren → Klassenarbeiten → Klassenarbeit-Detailansicht → Stärken & Schwächen
Lernanalyse → Ziele & Klausuren → Klassenarbeiten → Klassenarbeit-Detailansicht → KI-Empfehlungen
Lernanalyse → Ziele & Klausuren → Lernziele → Lernziel-Detailansicht → Erkannte Schwierigkeiten
Lernanalyse → Ziele & Klausuren → Lernziele → Lernziel-Detailansicht → KI-Empfehlungen
ALL "Alle anzeigen" expanded views for the above sections


Problem:
The cards in the above sections use colored backgrounds (green for Stärke, yellow for Schwachstelle, red for Kritisch/Nicht geübt) and have NO progress bars. This is inconsistent with the rest of the app, where cards in Schwächen & Lücken, Nachhilfe-Fortschritt, and session details all use the neutral GlassCard design with a progress bar and percentage.
The colored backgrounds are redundant because the severity badges already provide the color coding. Having a colored background + colored badge + colored text is triple-signaling the same information.

Fix: Replace ALL colored cards with the neutral GlassCard + Progressbar design
Reference design (correct): Look at how cards are rendered in:

Lernanalyse → Schwächen & Lücken → Erkannte Schwächen
Nachhilfe-Fortschritt → Erkannte Schwächen
Nachhilfe-Fortschritt → Session detail → Erkannte Schwächen

These use the correct design: neutral GlassCard background, Fach label top left, percentage + progress bar on the right, severity badge, topic name bold, description text, and action buttons. Copy this EXACT card design.

Section 1: Klassenarbeit-Detail → Stärken & Schwächen
Current (wrong): Cards have colored backgrounds – green for "Stärke", yellow for "Schwachstelle", red for "Kritisch"/"Nicht geübt". No progress bar, no percentage.
New (correct): Each card uses the neutral GlassCard design:

Fach label top left (e.g. "MATHEMATIK" in small uppercase gray)
Percentage + progress bar on the right (e.g. "72%" with neutral progress bar)
Severity badge next to the progress bar:

"Stärke" → green badge (keep this severity label)
"Schwachstelle" → orange badge (keep this severity label)
"Kritisch" / "Nicht geübt" → red badge (keep this severity label)


Topic name bold below the Fach label
Description text in muted gray
Action buttons: "Karteikarten erstellen" and "Prüfung starten"
Card background: neutral GlassCard (glassmorphism, subtle border) – NO colored background

The severity information stays – only the visual presentation changes from colored backgrounds to neutral cards with severity badges.

Section 2: Klassenarbeit-Detail → KI-Empfehlungen
Current (wrong): Cards may have colored backgrounds or inconsistent styling compared to the rest of the app.
New (correct): Same neutral GlassCard design as above:

Fach label, percentage + progress bar, topic name, description, action buttons
Severity badges: "Dringend" (red), "Empfohlen" (orange), "Förderlich" (green)
Neutral GlassCard background – no colored backgrounds


Section 3: Lernziel-Detail → Erkannte Schwierigkeiten
Current (wrong): Cards have colored backgrounds based on severity and no progress bars.
New (correct): Same neutral GlassCard design:

Fach label, percentage + progress bar, topic name, description, action buttons
Severity badges: use the existing severity labels for this section
Neutral GlassCard background


Section 4: Lernziel-Detail → KI-Empfehlungen
Current (wrong): Cards may have colored backgrounds, inconsistent with rest of app.
New (correct): Same neutral GlassCard design:

Fach label, percentage + progress bar, topic name, description, action buttons
Severity badges: "Dringend" (red), "Empfohlen" (orange), "Förderlich" (green)
Neutral GlassCard background


The "Alle anzeigen" expanded views must also be updated:
When the user taps "Alle anzeigen" for any of the above sections, the cards in the expanded view must ALSO use the neutral GlassCard + Progressbar design. Not just the preview cards – every single card everywhere.

Summary – what changes on each card:
ElementCurrent (wrong)New (correct)Card backgroundColored (green/yellow/red tint)Neutral GlassCard (glassmorphism)Progress barMissingAdded – shows percentage with neutral barPercentage numberMissingAdded – shows score on the rightSeverity badgePresent (keep)Present (keep – unchanged)Fach labelMay be missingAdded – small uppercase gray top leftTopic namePresentPresent (unchanged)Description textPresentPresent (unchanged)Action buttonsPresentPresent (unchanged)

The card structure must be identical everywhere in the app:
┌─────────────────────────────────────────┐
│ MATHEMATIK        72% ━━━━░░  Stärke   │
│                                         │
│ Scheitelpunktform                       │
│ Du beherrschst die Umwandlung...        │
│                                         │
│ [Karteikarten erstellen] [Prüfung start]│
└─────────────────────────────────────────┘
This structure is used in Schwächen & Lücken, Nachhilfe-Fortschritt, session details – and now ALSO in Klassenarbeit details and Lernziel details. ONE card design for the entire app.

Design guidelines:

Use the EXACT same GlassCard component and styling as in Schwächen & Lücken → Erkannte Schwächen
Same progress bar style (neutral, thin, with percentage)
Same severity badge component (same sizes, colors, border radius)
Same Fach label styling (uppercase, small, gray)
Same font sizes and weights for topic name and description
Same action button styling
Dark theme consistent
All text in German
This applies to both the preview cards (2 visible) AND all cards in "Alle anzeigen" views