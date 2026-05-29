We are now in FINAL Desktop QA / Hardening mode.
Mobile must NOT be touched.

Your report looks good, but before we accept it as “done” we need one last proof that the solution is truly robust and will not regress when labels change, new tabs are added, or users resize freely.

GOAL (Desktop)
Desktop must be intrinsically responsive:
- No overlap ever
- No control outside card padding
- No element rendered outside rounded card borders
- No horizontal page overflow
- No layout jitter when toggling search
If the window becomes very narrow, the UI must degrade gracefully (2-row / compact / stacked / more-menu) — but never overlap.

TASK A — Stress test (labels + future growth)
On Desktop ONLY, temporarily stress the header content:
1) Replace the header title with a long title, e.g.
   "Meine Karteikarten Sammlung 2026 – Erweiterte KI Lernsets und Prognosen"
2) Replace tab labels with longer variants, e.g.
   "KI-Karteikarten-Sets", "Eigene Sammlungen", "Leistungs-Prognosen"
3) (Optional) simulate future growth: add a 4th tab label temporarily (e.g. "Favoriten"), just for the test.

Then test ALL states:
- Search collapsed + expanded/focused
- Sidebar expanded + collapsed
- Zoom: 100% and 125%

And test a continuous resize (drag) from very wide → very narrow, plus spot checks at:
960, 1024, 1100, 1280, 1440, 1920, 2560

If ANY overlap or clipping happens at any point, the header structure is still wrong — fix the structure (do not patch symptoms) and re-test.

TASK B — Apply the same robustness rule across Desktop
Do a Desktop-wide scan for the same class of risk:
Any header/toolbar with 3+ controls in a row (title/search/tabs/buttons/icons) must either:
- use useDesktopHeaderLayout with a defined narrow strategy, OR
- be proven structurally impossible to overflow (with clear reasoning).

Do not say “low risk” without proof. Assume future growth.

DELIVERABLES (required)
1) Evidence screenshots (or short video) for MyFlashcards header:
   - 1024 sidebar expanded, search expanded, long labels
   - 1280 sidebar expanded, search expanded, long labels
   - 1024 sidebar collapsed, search expanded, long labels
   - 1280 @ 125% zoom, search expanded, long labels
   - one short screen recording: resizing wide → narrow while toggling search (no jitter/overlap)

2) Desktop Hardening Report update:
   - What broke (if anything) under stress test
   - Root cause
   - Structural fix
   - Files changed + key line ranges

QUALITY GATE
If overlap happens at any size in the stress test, the implementation is considered incorrect. Fix the structure until it is intrinsically responsive.