GLOBAL DESKTOP LAYOUT AUTHORITY REFACTOR
=========================================
Status: IMPLEMENTED
Date: 2026-03-03

━━━━━━━━━━━━━━━━━━
ARCHITECTURE: BEFORE → AFTER
━━━━━━━━━━━━━━━━━━

BEFORE (broken — horizontal drift possible):
  Viewport
  ├── Sidebar: FIXED left-3 top-3 bottom-3, z-30
  └── Content: flex-1, marginLeft: sidebarWidth+28, overflow:hidden
      └── DesktopContentWrapper (scroll + centering)
          └── Screen (some with own max-w, mx-auto, px)

  Problems:
  - Sidebar out of flow → no shared layout container
  - marginLeft hack → asymmetric (no matching right margin)
  - Scrollbar NOT at viewport edge when marginRight added
  - Screens defined their own horizontal spacing

AFTER (single layout authority):
  Viewport (h-screen, overflow-hidden)
  └── Stage Container (flex row, min-h-0)
      ├── Sidebar Column (flex-shrink-0, pl-3 pt-3 pb-3, transition-all)
      │   └── ModernSidebar (h-full, rounded card)
      └── Content Column (flex-1, min-w-0, min-h-0)
          └── DesktopContentWrapper (sole horizontal authority)
              ├── Scroll container (overflow-y-auto, NO padding/margin)
              ├── Outer wrapper (max-w-1440, mx-auto, px-4/6/8)
              └── Inner content (max-w-1200, mx-auto)
                  └── Screen content (NO own horizontal spacing)

━━━━━━━━━━━━━━━━━━
SPACING TOKENS
━━━━━━━━━━━━━━━━━━

  SIDEBAR_INSET         = 12px (pl-3, pt-3, pb-3 on sidebar column)
  CONTENT_PADDING       = responsive px-4 (16px) / px-6 (24px) / px-8 (32px)
  SIDEBAR→CONTENT GAP   = equals CONTENT_PADDING left (no extra gap needed)
  CONTENT→VIEWPORT_R    = 0px (content column flush with viewport right edge)
  CONTENT_MAX_WIDTH     = 1200px default (configurable via contentMaxWidth prop)
  WRAPPER_MAX_WIDTH     = 1440px (outer centering wrapper)
  STAGE_VERTICAL        = 12px (pt-3 pb-3 in fillHeight mode, aligns with sidebar)

These values are identical across ALL desktop screens.

━━━━━━━━━━━━━━━━━━
PASS/FAIL VERIFICATION
━━━━━━━━━━━━━━━━━━

1. abs(wrapperLeft - wrapperRight) <= 1px
   ✓ Wrapper is mx-auto centered within content column.
   Both left and right gaps from content column edges are equal.
   Measurement: wrapperLeftRel === wrapperRightRel (within content column).

2. distanceSidebarEdgeToContent is constant
   ✓ = DesktopContentWrapper left padding (px-4/6/8), same responsive token.
   No extra gap layer. The DCW padding IS the gap.

3. distanceContentToViewportRight follows same Stage Padding rule
   ✓ Content column extends to viewport right edge (0px gap).
   Visual spacing = DesktopContentWrapper right padding (same px-4/6/8 token).
   Sidebar-to-content gap = DCW left padding = DCW right padding → SAME RULE.

4. Scrollbar flush with viewport edge
   ✓ Content column has no margin/padding on right side.
   DesktopContentWrapper scroll container (overflow-y-auto) extends to content column right edge = viewport right edge.
   Scrollbar sits at viewport edge.

━━━━━━━━━━━━━━━━━━
REGRESSION RULE VERIFICATION
━━━━━━━━━━━━━━━━━━

"Fixing scrollbar must NOT affect centering" → ✓
  Scrollbar position is determined by content column (flush right).
  Centering is determined by DCW's mx-auto (inside scroll container).
  Independent concerns.

"Fixing centering must NOT affect scrollbar" → ✓
  mx-auto and max-width are inside the scroll container.
  They don't affect the scroll container's box model.

━━━━━━━━━━━━━━━━━━
FILES CHANGED
━━━━━━━━━━━━━━━━━━

CORE REFACTOR:
  /src/app/components/MainLayout.tsx
    - Removed: fixed sidebar, marginLeft, mainMarginLeft prop
    - Added: Stage Container (flex), Sidebar Column (in-flow), Content Column (flex-1)
    - Sidebar uses pl-3 pt-3 pb-3 for inset (replaces fixed left-3 top-3 bottom-3)
    - Content column has no right margin/padding → scrollbar flush

  /src/app/components/DesktopContentWrapper.tsx
    - Added: contentMaxWidth prop (default 1200px)
    - Constants: DEFAULT_CONTENT_MAX_WIDTH, OUTER_WRAPPER_MAX_WIDTH
    - fillHeight mode: pt-3 pb-3 for vertical stage framing
    - Documented as single horizontal layout authority

PROPS CLEANUP:
  /src/hooks/useLayoutProps.ts — Removed mainMarginLeft
  /src/app/App.tsx — Removed mainMarginLeft from layoutProps

SCREEN CLEANUP (removed redundant horizontal spacing):
  /src/app/components/ContentRouter.tsx
    - KI-Tools: removed max-w-[900px] mx-auto wrapper → contentMaxWidth={900}
    - Chat: fillHeight fullWidth (unchanged from previous fix)

  /src/app/components/KlassenarbeitenScreen.tsx
    - Removed: px-2 from desktop layout outer div
    - Kept: max-w-4xl mx-auto (content formatting, not layout)

  /src/app/components/SchulaufgabenScreen.tsx
    - Removed: px-2 from desktop layout outer div
    - Kept: max-w-4xl mx-auto (content formatting, not layout)

DEBUG:
  /src/app/components/DebugLayoutOverlay.tsx — Rebuilt for new architecture
    Shows: PASS/FAIL, sidebar column, content column, wrapper symmetry, scroll position

━━━━━━━━━━━━━━━━━━
REMOVED REDUNDANT WRAPPERS
━━━━━━━━━━━━━━━━━━

1. ContentRouter: <div className="max-w-[900px] mx-auto"> around KI-Tools
2. KlassenarbeitenScreen: px-2 on desktop outer div
3. SchulaufgabenScreen: px-2 on desktop outer div
4. MainLayout: entire fixed sidebar container + marginLeft pattern

━━━━━━━━━━━━━━━━━━
SCROLL ARCHITECTURE
━━━━━━━━━━━━━━━━━━

Which element scrolls?
  - Default screens (Home, CompletedExams, KI-Tools, Todo):
    DesktopContentWrapper outer div (overflow-y-auto)
    → Scrollbar at content column right edge = viewport right edge

  - fillHeight screens (Chat, Profil):
    DesktopContentWrapper outer div is overflow-hidden
    Child manages its own scrolling:
    - Chat: messages panel (internal overflow-y-auto)
    - Profil: profile content div (internal overflow-y-auto)

━━━━━━━━━━━━━━━━━━
CLEANUP (after visual verification)
━━━━━━━━━━━━━━━━━━

1. Remove DebugLayoutOverlay from App.tsx
2. Delete /src/app/components/DebugLayoutOverlay.tsx
3. Remove data-debug attributes from DesktopContentWrapper.tsx and MainLayout.tsx
4. Remove mainMarginLeft from useDerivedState / layoutHelpers (legacy, no longer used by MainLayout)
