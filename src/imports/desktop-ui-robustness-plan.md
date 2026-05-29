From now on: NO more Mobile/Desktop parity work.
Mobile is NOT touched. Mobile is reference only, but do not compare features anymore.

Focus: Desktop UI robustness + responsiveness only.

PROBLEM (current example: My Flashcards header)
Even after the last fix, when the search field is expanded:
- the right tab group (“KI-Sets, Eigene, Prognosen…”) shifts to the right
- the kebab / icons get too close to the edge
- sometimes elements overflow outside the rounded card frame

This means the Desktop header layout is still structurally wrong (space is not reserved correctly, shrinking rules are incomplete).

GOAL
On Desktop, expanding/collapsing the search must NEVER:
- push the tab group out of the card
- cause icons to touch/overflow the border
- cause any horizontal overflow
- cause layout jitter

SCOPE (Desktop only)
1) Fix MyFlashcardsHeaderDesktop properly.
2) Then scan the entire Desktop app for the SAME class of issues (headers with title + search + tabs + icons, toolbars, cards).
3) Apply one consistent “Desktop header pattern” everywhere it appears.

REQUIRED SOLUTION STYLE (structural, not patchy)
Do NOT fix with small margin tweaks (“mr-1”) or one-off max-width guesses.
Instead, redesign the layout STRUCTURE (Desktop-only) so it is intrinsically responsive.

Use one of these robust approaches (choose best, but must be consistent):
A) CSS GRID header layout with strict columns:
   - Left: Title (minmax(0, auto) + truncate)
   - Middle: Search (minmax(40px, 200px), expands but can shrink)
   - Right: Controls (tabs + kebab) with max width handling
   The right group must stay INSIDE padding always.

OR

B) Flex layout with a fixed “controls container” that never moves:
   - Right controls have a reserved width area (tabs + kebab)
   - Left side (title + search) adapts WITHOUT pushing the right side out
   - Tabs must be overflow-safe:
     - either wrap to a second line cleanly at small widths, OR
     - scroll horizontally INSIDE the control group (within the card), OR
     - compress labels (Desktop-only) at small widths
   Choose ONE strategy and apply consistently.

NON-NEGOTIABLE DESKTOP RULES
- Any text container in a flex row must have min-w-0 + truncate/line-clamp as needed.
- Control groups must have overflow handling INSIDE their container (never overflow outside the card).
- The kebab/icon area must have guaranteed right padding space at all times.
- Expanding search must not reflow controls in a way that causes jitter/shift.
- No “absolute positioned expanding” UI.
- No “magic fixes” that only work at one width.

TEST MATRIX (must actually test)
Desktop widths: 1024, 1100, 1280, 1366, 1440, 1536, 1728, 1920, 2560
Also test browser zoom: 110% and 125%
Test both states:
- search collapsed
- search expanded (focused)
And confirm:
- no horizontal overflow
- no clipped borders
- no shifting controls out of the card

DELIVERABLES
1) Desktop UI Hardening Report:
   - Issue found (screen + component)
   - Repro steps (width/zoom + state)
   - Root cause (layout reasoning)
   - Structural fix explanation
   - Files changed + key line ranges

2) Evidence:
   - Before/after screenshots (My Flashcards at 1280/1440/1920 with search expanded and collapsed)
   - If possible: short screen recording showing there is no jitter when toggling search

IMPORTANT
- Desktop only. Do not touch Mobile files.
- Do not mark done until toggling search does not move the tabs/icons and nothing overflows.

If expanding/collapsing the search causes any visible shift or overflow at any tested width/zoom, the header structure is still incorrect. Rebuild the Desktop header layout (grid or reserved-controls approach) until it is intrinsically responsive.