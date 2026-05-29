CHAT DESKTOP LAYOUT FIX REPORT
================================
Status: IMPLEMENTED
Date: 2026-03-03

━━━━━━━━━━━━━━━━━━
PROBLEM 1: Height / Stage Framing
━━━━━━━━━━━━━━━━━━

Root cause: DesktopContentWrapper fillHeight mode had NO vertical padding.
  File: /src/app/components/DesktopContentWrapper.tsx, line 48
  The sidebar has `fixed top-3 bottom-3` (12px inset from viewport top/bottom).
  The content area started at y=0 and ended at y=viewportHeight (no inset).
  → Chat card did not align with sidebar card vertically.

Fix: Added `pt-3 pb-3` (12px top/bottom) to fillHeight mode outer container.

AFTER FIX:
  Sidebar card:  top=12px,  bottom=viewport-12px
  Content card:  top=12px,  bottom=viewport-12px
  → Vertical stage alignment ✓

Affected screens (fillHeight):
  - ChatScreenDesktop ✓
  - ProfilScreenDesktop (incl. Klassenarbeiten, Schulaufgaben) ✓

━━━━━━━━━━━━━━━━━━
PROBLEM 2: Wasted Horizontal Space
━━━━━━━━━━━━━━━━━━

Root cause: Chat was inside DesktopContentWrapper with fillHeight but NOT fullWidth.
  File: /src/app/components/ContentRouter.tsx, line 268
  Both max-width caps applied: max-w-1440px outer + max-w-1200px inner.
  Chat panels (left 340px + right flex-1) were capped at 1200px total.
  On a 1920px screen, ~400px was wasted empty space.

Fix: Added `fullWidth` prop: `<DesktopContentWrapper fillHeight fullWidth>`
  Both max-width caps are now 100%, panels fill available width.

AFTER FIX (1920px, sidebar expanded):
  Content area: 1606px
  px-8 padding: 32px each side
  Chat panels fill: 1542px (340px left + 1202px right)
  → No wasted space ✓

━━━━━━━━━━━━━━━━━━
PROBLEM 3: Scrollbar at Viewport Edge
━━━━━━━━━━━━━━━━━━

Root cause: Previous fix added `marginRight: 12px` to MainLayout content area.
  File: /src/app/components/MainLayout.tsx, line 103
  This pushed the entire content area (and all scrollbars within) 12px inward.

Fix: REVERTED marginRight: 12px. Content area now extends to viewport right edge.

Scroll architecture:
  - MainLayout content div:     overflow: hidden (no scrollbar)
  - DesktopContentWrapper:      overflow-y-auto (default) or overflow-hidden (fillHeight)
  - For default mode: scrollbar on DesktopContentWrapper → at content area right edge = viewport right edge ✓
  - For fillHeight (Chat): scrollbar on internal messages panel → within Chat card ✓

AFTER FIX:
  Scrollbar is flush with viewport right edge in all screens ✓

━━━━━━━━━━━━━━━━━━
HORIZONTAL CENTERING (clarification)
━━━━━━━━━━━━━━━━━━

The content IS correctly centered within its available space:
  - Content area: starts at mainMarginLeft, extends to viewport right edge
  - DesktopContentWrapper: symmetric px-4/6/8 padding + mx-auto centering
  - Inner content: max-w-1200px centered within wrapper

The "perceived asymmetry" comes from the sidebar gap (16px between sidebar right edge
and content left edge). This is inherent to the floating sidebar design (left-3) and
is standard behavior — the same pattern as Linear, Notion, etc.

The scrollbar stays at the viewport edge. Visual spacing is handled by
DesktopContentWrapper's internal padding (px-4/6/8), not external margins.

━━━━━━━━━━━━━━━━━━
FILES CHANGED
━━━━━━━━━━━━━━━━━━

/src/app/components/MainLayout.tsx            — REVERTED marginRight: 12px
/src/app/components/DesktopContentWrapper.tsx  — Added pt-3 pb-3 for fillHeight mode
/src/app/components/ContentRouter.tsx          — Chat: added fullWidth prop
/src/app/components/DebugLayoutOverlay.tsx     — Extended with stage framing + chat panel + scroll measurements

━━━━━━━━━━━━━━━━━━
DEBUG OVERLAY (Ctrl+Shift+D)
━━━━━━━━━━━━━━━━━━

Now shows:
  - Sidebar inset (T/B/L)
  - MainLayout content margins
  - Wrapper (max-w-1440) bounding box + vertical bounds
  - Inner (max-w-1200) bounding box + L/R delta
  - Stage framing: sidebar T/B vs content T/B with match indicator
  - Chat panels: leftPanel, rightPanel, gap, sum vs wrapper width
  - Scroll container: element, padding-right, margin-right, right edge distance

━━━━━━━━━━━━━━━━━━
CLEANUP (after verification)
━━━━━━━━━━━━━━━━━━

1. Remove DebugLayoutOverlay from App.tsx
2. Delete /src/app/components/DebugLayoutOverlay.tsx
3. Remove data-debug attributes from DesktopContentWrapper.tsx
