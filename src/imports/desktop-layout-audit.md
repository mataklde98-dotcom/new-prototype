We are no longer fixing individual headers.

We now need a Desktop layout architecture audit.

Problem:
Some Desktop screens are implicitly optimized for “sidebar expanded” width.
When the sidebar collapses, the content area becomes wider, but several screens (e.g. Profil → Klassenarbeiten & Schulaufgaben) do not adapt correctly to the larger container width.

This indicates a structural layout issue in the Desktop content container logic.

DESKTOP ONLY. Mobile untouched.

━━━━━━━━━━━━━━━━━━
TASK — Desktop Layout Adaptation Audit
━━━━━━━━━━━━━━━━━━

1) Identify the global Desktop layout structure:
   - Sidebar (expanded / collapsed)
   - Main content wrapper
   - Inner max-width containers (if any)

2) Verify that ALL Desktop screens:
   - Use container-width responsive logic (not assumptions about sidebar state)
   - Properly adapt when sidebar toggles (expanded ↔ collapsed)
   - Properly expand grid/content areas when more width becomes available

3) Specifically audit these high-risk screens:
   - Profil → Klassenarbeiten
   - Profil → Schulaufgaben
   - Profil → Lernanalyse
   - CompletedExamsDesktopView
   - MyFlashcards
   - Any grid-based or card-based screen

4) For each screen, check:
   - Does content use max-width cap unnecessarily?
   - Does grid use fixed column counts instead of responsive auto-fit?
   - Are there hardcoded widths preventing expansion?
   - Does layout rely on viewport width instead of container width?

━━━━━━━━━━━━━━━━━━
REQUIRED STRUCTURAL RULES
━━━━━━━━━━━━━━━━━━

- Layout must respond to container width, not sidebar state.
- Use responsive grid patterns:
    grid-template-columns: repeat(auto-fit, minmax(Xpx, 1fr))
  instead of fixed 2-column/3-column logic.
- Avoid fixed pixel widths unless necessary.
- If max-width is used for readability (e.g. 1200px), it must be intentional and centered.
- When sidebar collapses, content must naturally reflow and use available space.

No cosmetic patches.
No screen-specific hacks.
Fix layout structure at container level where possible.

━━━━━━━━━━━━━━━━━━
TEST REQUIREMENTS
━━━━━━━━━━━━━━━━━━

For each audited screen:
- Toggle sidebar expanded ↔ collapsed
- Resize from narrow → wide
- Confirm:
   - content expands logically
   - no unused giant empty spaces
   - no broken alignment
   - no horizontal overflow
   - no visual imbalance

━━━━━━━━━━━━━━━━━━
DELIVERABLES
━━━━━━━━━━━━━━━━━━

1) Desktop Layout Architecture Report:
   - Root cause category per screen (fixed grid, max-width cap, hardcoded width, etc.)
   - Structural fix applied
   - Files changed + key line ranges

2) Before/After screenshots for:
   - Klassenarbeiten (sidebar expanded vs collapsed)
   - Schulaufgaben (sidebar expanded vs collapsed)
   - One grid-heavy screen (e.g. Flashcards or Completed Exams)

3) Confirmation that layout now adapts dynamically to sidebar state changes without requiring manual breakpoints tied to sidebar width.