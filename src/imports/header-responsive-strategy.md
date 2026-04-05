Please think first, propose the strategy, then implement — don’t implement blindly and report after.

The current “Fixed Controls Container” approach is NOT acceptable.

Evidence: On smaller widths the right tab bar overlaps the search and even covers the header title (“Meine Karteikarten”). This is not responsive behavior — it is masking/overlaying content.

RULE:
No UI element is allowed to cover/overlap other UI elements in the header.
No “hide behind the bar”, no “overlay”, no clipping that removes core controls (title/search).

We need a truly responsive Desktop header pattern that ADAPTS when space is tight.

GOAL (Desktop only)
For every Desktop header that contains:
Title + Search + Tabs/Controls + Kebab
It must remain usable at smaller widths without overlap.

When width becomes tight, the header must gracefully adapt using ONE of these strategies:
1) Two-row layout (preferred):
   - Row 1: Title + Kebab (and maybe search icon)
   - Row 2: Tabs + Search (or search full width)
   This keeps everything visible and avoids collisions.
OR
2) Collapse strategy:
   - Tabs compress (short labels / icons only) at smaller widths
   - Search collapses to icon until expanded, but expanding must not overlap anything
OR
3) Tabs wrap/scroll INSIDE their own container:
   - If tabs exceed available width, they wrap to next line OR horizontally scroll inside the card
   - BUT they must not cover Title/Search and must stay within padding.

You must choose the best strategy and implement it intentionally.
Do NOT force “right group immovable” if it causes overlap.
Do NOT use absolute positioning for expanding search.
Do NOT create “bars” that hide other controls.

REQUIREMENTS
- Header must never overlap at these widths: 1024, 1100, 1280, 1366, 1440, 1728, 1920
- Also test zoom: 110% and 125%
- Test states: search collapsed + search expanded (focused)
- Title must always remain readable (truncate allowed, but not covered)
- Search must remain accessible (can move to second row, but must not be hidden)
- Tabs must remain usable (wrap/scroll/collapse), but must not cover other elements
- Kebab must remain inside padding

SCOPE (Desktop)
Fix MyFlashcardsHeaderDesktop FIRST.
Then scan other Desktop headers/toolbars for the same structural collision risk and apply the same pattern consistently.

DELIVERABLES
1) Explain the chosen responsive strategy and WHY it’s the best.
2) Implement it with minimal but structural code changes (no cosmetic redesign).
3) Provide before/after screenshots at 1024/1280/1440 with search expanded and collapsed.
4) List all files changed with key line ranges.

QUALITY GATE (non-negotiable)
If any header control overlaps another control at any tested width/zoom, the task is NOT done.
This requires actual responsive thinking and a real layout solution, not a rigid container that hides content.