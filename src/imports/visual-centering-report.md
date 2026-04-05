I can still see the inconsistency in the screenshots (Klassenarbeiten) even after your report.

This is NOT a question of “pick one screen”.
It’s a global visual alignment issue: the perceived left/right spacing of the content area is not consistent across screens and differs when the sidebar is expanded vs collapsed.

Please do this as a strict visual + measurement-based verification, not a documentation answer.

DESKTOP ONLY. Mobile untouched.

TASK — Prove and Fix Visual Centering Consistency

1) Reproduce using the exact screen:
   Profil → Klassenarbeiten (and then Schulaufgaben).
   Compare:
   - Sidebar expanded
   - Sidebar collapsed

2) Add a temporary dev-only debug overlay (Desktop only) to measure layout:
   - Draw the ContentWrapper bounding box (outline)
   - Show:
     - wrapperLeft distance from viewport
     - wrapperRight distance from viewport
     - wrapperWidth
     - sidebarWidth (current)
   This must work live while toggling the sidebar.

3) Verify this invariant:
   - The wrapper must be centered within the available content region, with consistent horizontal padding rules.
   - The “perceived” spacing from the sidebar edge to the content and from the content to the right edge must follow the same design rule across all screens.

If measurements show different spacing:
- Identify the exact cause:
  - extra padding/margin at screen level
  - nested wrapper inside DesktopContentWrapper
  - incorrect max-width / width:100% usage
  - left offset introduced by a parent container
  - grid container using fixed width
  - inconsistent gap values between sidebar and content

4) Fix it structurally (no per-screen hacks):
   - Ensure every screen uses ONLY DesktopContentWrapper as the horizontal layout authority.
   - Remove any nested mx-auto/max-w/px wrappers inside screens unless explicitly required.
   - Ensure MainLayout’s content region uses a consistent padding/gap strategy relative to sidebar.

DELIVERABLES
- Two screenshots for Klassenarbeiten:
  1) sidebar expanded + debug overlay visible
  2) sidebar collapsed + debug overlay visible
- The measured numbers (left/right distances) in both states
- Root cause (exact file + line)
- Minimal structural fix (files changed)

Important:
Do not ask me which screen. Use Klassenarbeiten/Schulaufgaben as the baseline because the issue is already visible there.
If the overlay shows it is mathematically centered but still looks visually off, then we must adjust the design rule (max-width/padding/gap) globally, not per-screen.