VISUAL CENTERING FIX REPORT
============================
Status: IMPLEMENTED
Date: 2026-03-03

━━━━━━━━━━━━━━━━━━
ROOT CAUSE
━━━━━━━━━━━━━━━━━━

File: /src/app/components/MainLayout.tsx, line 100-107

The Main Content Area div had:
  - marginLeft: 314px (sidebar expanded) / 93px (collapsed) ✓
  - marginRight: 0px ✗ ← ASYMMETRIC

The Sidebar container has `fixed left-3` (12px from viewport left).
But the content area extended all the way to the viewport right edge (0px margin).

This means:
  - Left visual frame: 12px (viewport→sidebar) + 286px (sidebar) + 16px (gap) = 314px
  - Right visual frame: 0px

All inner centering (DesktopContentWrapper mx-auto) was correct relative to its
container — but the container itself was asymmetrically positioned in the viewport.

━━━━━━━━━━━━━━━━━━
EXACT MEASUREMENTS (before fix, 1920px viewport)
━━━━━━━━━━━━━━━━━━

SIDEBAR EXPANDED (286px):
  Sidebar: left=12px, width=286px, right-edge=298px
  Content: left=314px, right=1920px, width=1606px
  → Left gap from viewport: 314px
  → Right gap from viewport: 0px
  → Delta: 314px asymmetry

SIDEBAR COLLAPSED (65px):
  Sidebar: left=12px, width=65px, right-edge=77px
  Content: left=93px, right=1920px, width=1827px
  → Left gap from viewport: 93px
  → Right gap from viewport: 0px
  → Delta: 93px asymmetry

━━━━━━━━━━━━━━━━━━
FIX
━━━━━━━━━━━━━━━━━━

File: /src/app/components/MainLayout.tsx
Line: 103 (style object)

ADDED: marginRight: isMobile ? 0 : '12px'

This mirrors the sidebar's `left-3 (12px)` viewport inset on the right side.

AFTER FIX (1920px viewport):

SIDEBAR EXPANDED:
  Content: left=314px, right=1908px, width=1594px
  → Right gap: 12px (matches sidebar's left viewport inset)

SIDEBAR COLLAPSED:
  Content: left=93px, right=1908px, width=1815px
  → Right gap: 12px (matches sidebar's left viewport inset)

The DesktopContentWrapper's mx-auto centering now works within a
properly-framed content area. All screens benefit from this single change.

━━━━━━━━━━━━━━━━━━
DEBUG OVERLAY
━━━━━━━━━━━━━━━━━━

File: /src/app/components/DebugLayoutOverlay.tsx
Toggle: Ctrl+Shift+D (Desktop only)

Shows live measurements:
  - Sidebar state + width
  - marginLeft / marginRight values
  - Outer wrapper (max-w-1440) bounding box
  - Inner content (max-w-1200) bounding box
  - L/R Delta with centered/off-center indicator

The overlay reads data-debug="content-wrapper" and data-debug="content-inner"
attributes on DesktopContentWrapper divs.

━━━━━━━━━━━━━━━━━━
FILES CHANGED
━━━━━━━━━━━━━━━━━━

/src/app/components/MainLayout.tsx          — Added marginRight: 12px (desktop only)
/src/app/components/DesktopContentWrapper.tsx — Added data-debug attributes (for overlay)
/src/app/components/DebugLayoutOverlay.tsx   — NEW: Debug overlay component
/src/app/App.tsx                             — Imported + rendered DebugLayoutOverlay

━━━━━━━━━━━━━━━━━━
CLEANUP (after visual verification)
━━━━━━━━━━━━━━━━━━

Once centering is confirmed visually:
1. Remove DebugLayoutOverlay from App.tsx
2. Delete /src/app/components/DebugLayoutOverlay.tsx
3. Remove data-debug attributes from DesktopContentWrapper.tsx
