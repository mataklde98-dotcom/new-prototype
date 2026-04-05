We need to fix a global Desktop layout inconsistency.

Problem:
The content area on the right side is not consistently centered.
Spacing between:
- Sidebar ↔ Content
- Content ↔ Right screen edge
is inconsistent across different screens.

When the sidebar collapses, the content width changes, but inner content padding and centering is not uniform.
Some screens look centered, others look left-heavy or misaligned.

This is a global layout architecture issue, not a screen-specific issue.

DESKTOP ONLY. Mobile untouched.

━━━━━━━━━━━━━━━━━━
TASK — Global Desktop Content Wrapper Standardization
━━━━━━━━━━━━━━━━━━

1) Identify the main Desktop layout structure:
   Sidebar → MainLayout → ContentRouter → Screen

2) Create ONE centralized DesktopContentWrapper component that:
   - Applies consistent horizontal padding (e.g. px-6 or px-8)
   - Applies a consistent max-width (e.g. max-w-[1200px] or chosen design value)
   - Uses mx-auto to center content
   - Works identically whether sidebar is expanded or collapsed
   - Prevents inconsistent inner paddings across screens

3) Remove screen-level max-width and random horizontal paddings where unnecessary.
   Layout responsibility must exist in ONE place only.

4) Ensure:
   - Content is visually centered relative to available space
   - Equal perceived spacing on left and right
   - No screen overrides the layout container unless explicitly justified

━━━━━━━━━━━━━━━━━━
STRUCTURAL RULES
━━━━━━━━━━━━━━━━━━

- Screens should not define their own max-width unless truly required.
- Horizontal spacing must be controlled at layout level.
- Sidebar toggle must not break centering.
- On ultrawide screens, content must remain centered and capped.
- No hardcoded margins to compensate for sidebar width.

━━━━━━━━━━━━━━━━━━
TEST REQUIREMENTS
━━━━━━━━━━━━━━━━━━

Test these screens with sidebar expanded and collapsed:
- HomeScreenDesktop
- MyFlashcards
- CompletedExams
- Profil → Klassenarbeiten
- Profil → Schulaufgaben
- Profil → Lernanalyse

Confirm:
- Same horizontal spacing everywhere
- Content visually centered
- No “drifting” layout when sidebar toggles
- No inconsistent inner paddings

━━━━━━━━━━━━━━━━━━
DELIVERABLES
━━━━━━━━━━━━━━━━━━

1) Desktop Layout Container Report:
   - Where max-width/padding was duplicated
   - What was removed
   - What was centralized

2) Files changed (especially MainLayout and wrapper levels)

3) Before/after screenshots:
   - One screen with sidebar expanded
   - Same screen with sidebar collapsed
   - Show identical centering behavior