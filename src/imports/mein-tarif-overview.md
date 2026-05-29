Design a modern mobile UI screen for an EdTech platform called SoStudy.

This screen is located inside the student profile under the menu item:

"Mein Tarif"

Important:
This is NOT a purchase or subscription checkout screen.
It is a **plan overview screen** where the student can see their current plan and rewards.

The student already has an **active subscription for AI features**.

The design should be **mobile-first**, clean, modern, and feel like a premium EdTech product.

Use a **dark theme**, rounded cards, modern typography, subtle gradients and clear visual hierarchy.

The UI should feel similar to high quality SaaS products like:
Notion, Linear, Stripe dashboards, and Duolingo.

--------------------------------------------------

SECTION 1 — KI-FUNKTIONEN

Title:
KI-Funktionen

On the right side display a green status badge:

Aktiv

Below the title place a small subtle link:

Abo beenden

This link should be visually discreet (small text, muted color).

--------------------------------------------------

SECTION 2 — FREUNDE EINLADEN (Gamification / Reward System)

Create a card that motivates students to invite friends.

Headline:

Freunde einladen & gratis Monate verdienen

Subtext:

Lade 3 Freunde ein und erhalte 1 Monat kostenlos.

Below this display a **progress bar** showing referral progress.

Example:

2 / 3 Einladungen

Add a small hint text:

Einladungen zählen erst, wenn sich deine Freunde registrieren.

PROTOTYPE LOGIC:

• Each successful referral increases the progress
• A referral counts only when the invited friend:
  - registers
  - creates an account
  - logs in

Backend is not required, but the prototype should visually simulate the logic.

--------------------------------------------------

SECTION 3 — KOSTENLOSE MONATE

Below the referral system show a card displaying earned rewards.

Title:

Kostenlose Monate

Example:

2 Monate gesammelt

Add a hint text:

Maximal 12 Monate möglich

PROTOTYPE LOGIC:

When referral progress reaches 3 / 3:

• add +1 free month
• reset referral progress back to 0

Free months accumulate up to a maximum of 12.

--------------------------------------------------

SECTION 4 — ABO STATUS

Display subscription information.

Läuft ab:
10.05.2025

Below that display the price:

4,99 € / Monat

If the student has free months available show an additional info text:

Kostenlose Monate werden automatisch nach Ablauf des aktuellen Abos genutzt.

This explains that free months activate only after the current paid subscription ends.

--------------------------------------------------

SECTION 5 — NACHHILFE TARIF

Create another card for tutoring services.

Title:

Nachhilfe-Tarif

Status badge:

If tutoring is not activated:
Nicht aktiv

If tutoring is active:
Aktiv

If active display:

Vertrag läuft bis:
18.08.2025

For now this section only displays status and expiration date.

--------------------------------------------------

DESIGN STYLE

The interface should feel motivating and gamified for students.

Use:

• card-based layout
• soft shadows
• subtle gradients
• smooth progress bars
• modern spacing
• clear typography
• minimal clutter

Use accent colors for:

• active status
• progress indicators
• rewards

Avoid generic AI-looking UI.

The result should look like a **polished production-level app interface**, not a simple prototype.