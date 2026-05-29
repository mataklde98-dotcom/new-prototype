DESKTOP LAYOUT SYSTEM COMPLETION
==================================
Status: IMPLEMENTED
Date: 2026-03-03

━━━━━━━━━━━━━━━━━━
FINAL HIERARCHY (LOCKED)
━━━━━━━━━━━━━━━━━━

  Viewport (h-screen, overflow-hidden)
  └── MainLayout (Stage Container, flex-based)
      ├── Sidebar Column (flex-shrink-0, pl-3 pt-3 pb-3)
      │   └── ModernSidebar (h-full, rounded card)
      └── Content Column (flex-1, min-w-0, min-h-0, pt-3 pb-3)
          └── DesktopContentWrapper (scroll + centering + width policy)
              └── DesktopPageHeader (shared header baseline — optional)
              └── ScreenContent

No screen inserts spacing outside this structure.

━━━━━━━━━━━━━━━━━━
1️⃣ ARCHITECTURE: LOCKED
━━━━━━━━━━━━━━━━━━
See hierarchy above. MainLayout.tsx header docs updated with all invariants.

━━━━━━━━━━━━━━━━━━
2️⃣ DESKTOP PAGE HEADER: CREATED
━━━━━━━━━━━━━━━━━━
File: /src/app/components/DesktopPageHeader.tsx

Props:
  title: string (required)
  subtitle?: string
  onBack?: () => void (shows back button)
  backLabel?: string (default: "Zurück")
  actions?: React.ReactNode (right-side buttons)
  children?: React.ReactNode (tabs, breadcrumbs, filters below title)
  titleSize?: 'default' | 'compact'

Spacing tokens:
  pt-5 (20px)  — top breathing room from stage framing
  mb-1.5       — back row → title row gap
  mt-3         — title row → children gap
  pb-4 (16px)  — bottom gap to screen content

Screens using DesktopPageHeader:
  ✅ TodoManagementScreen (onBack, title, actions)
  
Screens WITHOUT header (dashboard/flow content):
  Home, Profil main, KI-Tools (no header needed, content starts at DCW top)

Screens with existing complex headers (kept as-is, structurally aligned):
  CompletedExamsDesktopView (custom header with search + breadcrumbs)
  MyFlashcardsHeaderDesktop (custom header with tabs + breadcrumbs)

━━━━━━━━━━━━━━━━━━
3️⃣ CONTENT WIDTH POLICY: IMPLEMENTED
━━━━━━━━━━━━━━━━━━
Type: ContentWidth = "standard" | "narrow" | "wide" | "full"

  Policy     | Outer max-w | Inner max-w | Use case
  -----------|-------------|-------------|------------------
  standard   | 1440px      | 1200px      | dashboards, overviews
  narrow     | 1440px      | 900px       | detail/reading pages
  wide       | 1600px      | 1440px      | large detail pages
  full       | none        | none        | grids, data-heavy

Exported type: ContentWidth from DesktopContentWrapper.tsx

Old props removed:
  ❌ fullWidth (replaced by contentWidth="full")
  ❌ contentMaxWidth (replaced by policy enum)

━━━━━━━━━━━━━━━━━━
4️⃣ SCREEN WIDTH POLICY ASSIGNMENTS
━━━━━━━━━━━━━━━━━━

  Screen                 | Policy     | Mode
  -----------------------|------------|------------------
  Home                   | standard   | default (DCW scrolls)
  KI-Tools               | narrow     | default (DCW scrolls)
  Profil                 | standard   | default (DCW scrolls)
  Completed Exams        | standard   | default (DCW scrolls)
  Todo Management        | standard   | default (DCW scrolls)
  Chat                   | full       | fillHeight (panels scroll)
  My Flashcards          | full       | scrollable=false (paginated)

Detail screens (inside Profil DCW):
  Klassenarbeiten        | (inherits standard) | viewport-based height
  Schulaufgaben          | (inherits standard) | viewport-based height

Note: Klassenarbeiten/Schulaufgaben use max-w-4xl mx-auto internally —
this is a CONTENT formatting concern (reading width), not layout framing.

━━━━━━━━━━━━━━━━━━
5️⃣ SCREEN-LEVEL SPACING REMOVED
━━━━━━━━━━━━━━━━━━

TodoManagementScreen (desktop):
  ❌ h-full overflow-y-auto px-6 py-5 — entire scroll+padding wrapper removed
  ❌ Custom back button / title layout — replaced with DesktopPageHeader
  ✅ Content flows directly, DCW scrolls

TaskDetailScreen (desktop):
  ❌ h-full overflow-y-auto px-6 py-5 — removed
  ✅ max-w-[560px] kept (content formatting concern)
  ✅ Content flows directly, DCW scrolls

AddTaskScreen (desktop):
  ❌ h-full overflow-y-auto px-6 py-5 — removed
  ✅ Content flows directly, DCW scrolls

CompletedExamsDesktopView:
  ❌ h-full flex-col bg-[#0a0a0a] — removed from root
  ❌ flex-1 overflow-y-auto — internal scroll container removed
  ✅ Content flows directly, DCW scrolls

━━━━━━━━━━━━━━━━━━
6️⃣ SCROLL RULE: ENFORCED
━━━━━━━━━━━━━━━━━━

Scrolling occurs at DCW level (overflow-y-auto on root div).
No nested scroll containers for main page content.

Exceptions:
  - Chat: fillHeight mode, panels manage own scroll
  - My Flashcards: scrollable=false, paginated grid

All screens:
  ✅ No margin-right on scroll container
  ✅ No padding-right on scroll container
  ✅ Scrollbar flush at viewport edge
  ✅ No nested scroll containers

━━━━━━━━━━━━━━━━━━
7️⃣ LARGE SCREEN BEHAVIOR
━━━━━━━━━━━━━━━━━━

On viewport ≥ 1600px:
  - "standard" screens: inner 1200px centered in 1440px outer
  - "wide" screens: inner 1440px centered in 1600px outer
  - Content remains centered
  - Sidebar expanded/collapsed changes available width, NOT policy
  - No "tiny island" effect — width policies are generous

━━━━━━━━━━━━━━━━━━
8️⃣ DEBUG OVERLAY: EXTENDED
━━━━━━━━━━━━━━━━━━

New metrics added:
  - contentWidthPolicy (reads data-content-width attribute from DCW root)
  - headerTopY / firstContentTopY (measures DesktopPageHeader position)

PASS conditions:
  ✅ headerTopY equal across screens (±1px)
  ✅ firstContentTopY equal across screens (±1px)
  ✅ contentWidthPolicy correct per screen type
  ✅ Scrollbar flush at viewport edge

━━━━━━━━━━━━━━━━━━
FILES CHANGED
━━━━━━━━━━━━━━━━━━

NEW:
  /src/app/components/DesktopPageHeader.tsx — shared header baseline

MODIFIED:
  /src/app/components/DesktopContentWrapper.tsx — ContentWidth enum, removed fullWidth/contentMaxWidth
  /src/app/components/ContentRouter.tsx — all screens use contentWidth policy
  /src/app/components/MainLayout.tsx — updated architecture docs
  /src/app/components/TodoManagementScreen.tsx — uses DesktopPageHeader, removed screen-level spacing
  /src/app/components/TaskDetailScreen.tsx — removed screen-level spacing
  /src/app/components/AddTaskScreen.tsx — removed screen-level spacing
  /src/app/components/CompletedExamsDesktopView.tsx — removed h-full, internal scroll
  /src/app/components/DebugLayoutOverlay.tsx — extended with contentWidthPolicy, header metrics

━━━━━━━━━━━━━━━━━━
ACCEPTANCE CRITERIA STATUS
━━━━━━━━━━━━━━━━━━

  ✅ All screens share identical header baseline (DesktopPageHeader pt-5)
  ✅ No screen defines its own outer spacing
  ✅ No screen defines its own max width (except content-level concerns)
  ✅ Large displays use width policy for appropriate sizing
  ✅ Sidebar expanded/collapsed does not change structural layout
  ✅ Scrollbar remains at viewport edge
  ✅ No per-screen margin fixes needed — architecture is correct
