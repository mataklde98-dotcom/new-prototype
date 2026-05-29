FIX PROFILE SCROLLBAR INSET (Desktop)
=======================================
Status: IMPLEMENTED
Date: 2026-03-03
Fix: Option A (Unify Profil with standard DCW scroll)

━━━━━━━━━━━━━━━━━━
ROOT CAUSE
━━━━━━━━━━━━━━━━━━

File: /src/app/components/ProfilScreenDesktop.tsx, line 210-215
File: /src/app/components/ContentRouter.tsx, line 237 (fillHeight mode)

Profil used `fillHeight` DCW mode:
  DCW outer (overflow-hidden)
  → DCW wrapper (px-4/6/8, max-w-1440)  ← PADDING HERE
    → DCW inner (max-w-1200)
      → ProfilScreenDesktop
        → scroll div (overflow-y-auto)  ← SCROLLBAR INSET BY px-4/6/8

The scroll container was INSIDE DCW's padded wrappers.
Scrollbar was at (viewport right - DCW padding), not viewport edge.

━━━━━━━━━━━━━━━━━━
FIX (Option A: Unify with standard DCW scroll)
━━━━━━━━━━━━━━━━━━

AFTER:
  DCW outer (overflow-y-auto)  ← DCW IS THE SCROLL CONTAINER
  → DCW wrapper (px-4/6/8, max-w-1440)
    → DCW inner (max-w-1200)
      → ProfilScreenDesktop  ← no internal scroll, content flows normally

  Scrollbar at DCW outer right edge = content column right edge = viewport edge ✓

━━━━━━━━━━━━━━━━━━
VERIFICATION VALUES
━━━━━━━━━━━━━━━━━━

  scrollElRight == viewportWidth ✓ (DCW outer extends to viewport edge)
  computed paddingRight on scrollEl == 0 ✓ (DCW outer has no padding)
  abs(wrapperLeft - wrapperRight) <= 1px ✓ (symmetric mx-auto centering)

━━━━━━━━━━━━━━━━━━
FILES CHANGED
━━━━━━━━━━━━━━━━━━

/src/app/components/ProfilScreenDesktop.tsx
  - REMOVED: internal scroll container (overflow-y-auto, scrollbar styles, h-full, bg-[#0a0a0a])
  - REMOVED: screen-level px-5 (DCW handles horizontal spacing)
  - REMOVED: pt-12 (layout-level vertical offset)
  - KEPT: pb-32, space-y-4 (content spacing within the profile page)
  - RESULT: content flows normally, DCW scroll container handles scrolling

/src/app/components/ContentRouter.tsx
  - CHANGED: Profil from `<DesktopContentWrapper fillHeight>` to `<DesktopContentWrapper>` (default mode)
  - DCW scrolls the profile content; scrollbar at viewport edge

/src/app/components/KlassenarbeitenScreen.tsx (desktop return)
  - CHANGED: `h-full` → `style={{ height: 'calc(100vh - 24px)' }}`
  - Viewport-based height matches Content Column pt-3 + pb-3 (24px total)
  - Works in default DCW mode without fillHeight chain

/src/app/components/SchulaufgabenScreen.tsx (desktop return)
  - CHANGED: `h-full` → `style={{ height: 'calc(100vh - 24px)' }}`
  - Same viewport-based height fix as Klassenarbeiten

━━━━━━━━━━━━━━━━━━
UPDATED DCW MODE INVENTORY
━━━━━━━━━━━━━━━━━━

  Screen                 | DCW mode                        | scroll
  -----------------------|---------------------------------|---------
  Home                   | default                         | DCW scrolls ✓
  KI-Tools               | default + contentMaxWidth=900   | DCW scrolls ✓
  Todo Management        | default                         | DCW scrolls ✓
  Completed Exams        | default                         | DCW scrolls ✓
  Profil                 | default ← CHANGED from fillHeight| DCW scrolls ✓
  Chat                   | fillHeight + fullWidth           | panels scroll
  My Flashcards          | fullWidth + scrollable=false     | paginated

Only Chat retains fillHeight (needed for split panel layout with independent scroll).
All other screens use default DCW mode — scrollbar at viewport edge.

━━━━━━━━━━━━━━━━━━
REMAINING fillHeight USAGE
━━━━━━━━━━━━━━━━━━

Only: Chat (fillHeight + fullWidth)
  - Chat has split panels with independent scroll
  - Chat scrollbar is panel-level (inside chat card), not full-page
  - Scrollbar inset is correct for Chat (visually inside the card)
