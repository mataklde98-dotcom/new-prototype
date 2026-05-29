DESKTOP VERTICAL FRAMING & MODE CONSISTENCY REFACTOR
======================================================
Status: IMPLEMENTED
Date: 2026-03-03

━━━━━━━━━━━━━━━━━━
VERTICAL AUTHORITY: Option A
━━━━━━━━━━━━━━━━━━

Decision: Stage Container (Content Column) defines vertical inset.
DesktopContentWrapper has ZERO vertical padding.

  Content Column: pt-3 pb-3 (12px top + bottom)
  DesktopContentWrapper: no py, no pt, no pb
  Screens: no layout-level mt or pt

Result: ALL screens start at 12px from viewport top, matching sidebar card top.

━━━━━━━━━━━━━━━━━━
BEFORE → AFTER (vertical starting points)
━━━━━━━━━━━━━━━━━━

  Screen                 | BEFORE (top offset)       | AFTER
  -----------------------|---------------------------|--------
  Home                   | py-6/py-8 = 24-32px       | 12px ✓
  Profil                 | pt-3 (DCW fillHeight) 12px| 12px ✓
  Chat                   | pt-3 (DCW fillHeight) 12px| 12px ✓
  Meine Karteikarten     | py-6/py-8 + mt-20 = 44-52 | 12px ✓
  Abgeschlossene Prüfg.  | py-6/py-8 + mt-20 = 44-52 | 12px ✓
  KI-Tools               | py-6/py-8 = 24-32px       | 12px ✓
  Todo Management        | py-6/py-8 = 24-32px       | 12px ✓

All now equal → 12px = sidebar card top ✓

━━━━━━━━━━━━━━━━━━
DCW MODE INVENTORY (per screen)
━━━━━━━━━━━━━━━━━━

  Screen                 | DCW mode                        | scroll
  -----------------------|---------------------------------|--------
  Home                   | default                         | DCW scrolls
  KI-Tools               | default + contentMaxWidth=900   | DCW scrolls
  Todo Management        | default                         | DCW scrolls
  Completed Exams        | default                         | DCW scrolls (screen has internal scroll too)
  Profil                 | fillHeight                      | screen scrolls
  Chat                   | fillHeight + fullWidth           | screen scrolls
  My Flashcards          | fullWidth + scrollable=false     | paginated (no scroll)

Usage rules:
  - default = standard scroll screens, max-w-1200 centered
  - fillHeight = full height propagation, screen manages its own scrolling
  - fullWidth = grid/board layouts needing full container width
  - contentMaxWidth = override inner max-width for narrower content

━━━━━━━━━━━━━━━━━━
PASS/FAIL
━━━━━━━━━━━━━━━━━━

For Home, Profil, Meine Karteikarten, Abgeschlossene Prüfungen:

  ✓ Top of first content block aligns with top of sidebar card (both at 12px)
  ✓ distanceTopSidebarCardToViewport == distanceTopContentToViewport (12px)
  ✓ Right spacing equals DCW padding token (px-4/6/8)
  ✓ Switching between screens does NOT change vertical starting point

━━━━━━━━━━━━━━━━━━
REMOVED VERTICAL SPACING RULES
━━━━━━━━━━━━━━━━━━

1. DesktopContentWrapper: removed `pt-3 pb-3` from fillHeight mode
2. DesktopContentWrapper: removed `py-6 min-[1024px]:py-8` from default mode inner div
3. CompletedExamsDesktopView: removed `marginTop: "20px"` from header
4. CompletedExamsDesktopView: removed `paddingLeft/Right: 24-32px` from header + content
5. MyFlashcardsHeaderDesktop: removed `marginTop: "20px"` from header

━━━━━━━━━━━━━━━━━━
LAYOUT HIERARCHY DIAGRAM (FINAL)
━━━━━━━━━━━━━━━━━━

  Viewport (h-screen, bg-[#0a0a0a], overflow-hidden)
  │
  └── Stage Container (flex-1 flex min-h-0)
      │
      ├── Sidebar Column (flex-shrink-0, pl-3 pt-3 pb-3, transition-all 700ms)
      │   width: sidebarWidth + 12px
      │   └── ModernSidebar (h-full, rounded-2xl card)
      │       top: 12px, bottom: viewport-12px, left: 12px
      │
      └── Content Column (flex-1, min-w-0, min-h-0, pt-3 pb-3)
          right edge: viewport right edge (flush)
          content area: 12px..viewport-12px vertically
          │
          └── DesktopContentWrapper (h-full, w-full)
              │   scroll: overflow-y-auto (default) or overflow-hidden (fillHeight)
              │   NO vertical padding (zero)
              │   scrollbar at viewport right edge
              │
              ├── Outer Wrapper (mx-auto, max-w-1440, px-4/6/8)
              │   symmetric horizontal padding
              │
              └── Inner Content (mx-auto, max-w-1200 or custom)
                  │   symmetric centering
                  │
                  └── Screen content
                      no layout-level px, mx-auto, max-w, mt, pt

━━━━━━━━━━━━━━━━━━
FILES CHANGED
━━━━━━━━━━━━━━━━━━

/src/app/components/MainLayout.tsx
  - Content Column: added pt-3 pb-3
  - Updated header docs with vertical authority

/src/app/components/DesktopContentWrapper.tsx
  - Removed: pt-3 pb-3 from fillHeight mode
  - Removed: py-6 min-[1024px]:py-8 from default mode inner div
  - Updated: docs to clarify "NO vertical padding"

/src/app/components/CompletedExamsDesktopView.tsx
  - Removed: marginTop: "20px" from header
  - Removed: paddingLeft/Right from header + content sections

/src/app/components/MyFlashcardsHeaderDesktop.tsx
  - Removed: marginTop: "20px" from header

/src/app/components/DebugLayoutOverlay.tsx
  - Added: wrapperTop measurement
  - Added: Stage Framing (vertical) section with sidebar/content T/B comparison
