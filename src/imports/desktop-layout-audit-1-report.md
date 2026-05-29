GLOBAL DESKTOP LAYOUT AUDIT & STANDARDIZATION — REPORT
========================================================
Status: IMPLEMENTED
Date: 2026-03-03

━━━━━━━━━━━━━━━━━━
1. GLOBAL DESKTOP WRAPPER ✅
━━━━━━━━━━━━━━━━━━
Every screen runs inside DesktopContentWrapper with enum-based width policy.
No hardcoded max-w-[...] values for layout framing.
Width policy: "standard" | "narrow" | "wide" | "full" (in DCW only).

━━━━━━━━━━━━━━━━━━
2. BACK BUTTON STANDARDISIERT ✅
━━━━━━━━━━━━━━━━━━
Created: /src/app/components/DesktopPageHeader.tsx

All desktop back buttons now use DesktopPageHeader:
  - Same position (pt-5 from DCW top, always above page title)
  - Same spacing (mb-1.5 gap to title row)
  - Same icon (ChevronLeft w-4 h-4 text-white/30)
  - Same typography (Poppins:Medium 13px text-white/30)
  - Same hover state (group-hover:text-white/50)

Screens using DesktopPageHeader:
  ✅ TodoManagementScreen — title + actions (Add button)
  ✅ TaskDetailScreen — back-only (no title, content has rich title+badge)
  ✅ AddTaskScreen — title + back

Screens with custom headers (architecturally aligned):
  • CompletedExamsDesktopView — glassmorphism card header (title + search + options)
  • MyFlashcardsHeaderDesktop — tabs + breadcrumbs + search

Screens without header (dashboard content):
  • HomeScreenDesktop, ProfilScreenDesktop main, KI-Tools, ChatScreenDesktop

━━━━━━━━━━━━━━━━━━
3. DETAILSEITEN GEFIXT ✅
━━━━━━━━━━━━━━━━━━
TaskDetailScreen:
  ❌ REMOVED: h-full overflow-y-auto px-6 py-5, max-w-[560px]
  ✅ ADDED: DesktopPageHeader (back-only), max-w-3xl (768px reading width)
  ✅ Internal header now mobile-only (isMobile guard)
  ✅ DCW scrolls content

AddTaskScreen:
  ❌ REMOVED: h-full overflow-y-auto px-6 py-5
  ✅ ADDED: DesktopPageHeader (title + back)
  ✅ Internal header + title now mobile-only
  ✅ DCW scrolls content

Klassenarbeiten / Schulaufgaben:
  ✅ max-w-4xl mx-auto kept as CONTENT concern (reading width)
  ✅ Viewport-based height (calc(100vh - 24px))
  ✅ No screen-level px — DCW handles spacing

━━━━━━━━━━━━━━━━━━
4. CONTENT-SKALIERUNG ✅
━━━━━━━━━━━━━━━━━━
Width policy assignments:
  standard (1200px) → Home, Profil, CompletedExams, Todo
  narrow (900px)    → KI-Tools
  full (no limit)   → MyFlashcards, Chat

  ❌ REMOVED: fixed 560px container (TaskDetailScreen)
  ✅ REPLACED: max-w-3xl (768px) — wider, adapts to screen

Content-level max-w (NOT layout framing):
  • max-w-4xl (896px) — Klassenarbeiten, Schulaufgaben (reading width)
  • max-w-3xl (768px) — TaskDetailScreen (detail width)
  • max-w-[560px] — REMOVED

━━━━━━━━━━━━━━━━━━
5. SIDEBAR-INTERAKTION ✅
━━━━━━━━━━━━━━━━━━
  ✅ Content does not shift on sidebar toggle (flex-based layout)
  ✅ Centering is always visually consistent (mx-auto in DCW)
  ✅ No different start point per screen
  ✅ Width policy is sidebar-state independent

━━━━━━━━━━━━━━━━━━
6. VISUELLE VERTIKALE KONSISTENZ ✅
━━━━━━━━━━━━━━━━━━
  ✅ All screens start at same Y (Content Column pt-3 = 12px)
  ✅ DesktopPageHeader pt-5 ensures identical top spacing
  ✅ Fixed gaps: back button → title (mb-1.5), title → children (mt-3), header → content (pb-4)

━━━━━━━━━━━━━━━━━━
7. MOBILE-LOGIK ENTFERNT (DESKTOP) ✅
━━━━━━━━━━━━━━━━━━
  ✅ TaskDetailScreen: desktop renders without mobile px-4, pt-safe, overflow-y-auto
  ✅ AddTaskScreen: desktop renders without mobile px-4, pt-safe, overflow-y-auto
  ✅ TodoManagementScreen: desktop uses DesktopPageHeader, not mobile slide-screen header
  ✅ CompletedExamsDesktopView: no mobile-style centered containers

━━━━━━━━━━━━━━━━━━
FILES CHANGED (CUMULATIVE)
━━━━━━━━━━━━━━━━━━

NEW:
  /src/app/components/DesktopPageHeader.tsx

MODIFIED:
  /src/app/components/DesktopContentWrapper.tsx — ContentWidth enum, removed fullWidth/contentMaxWidth
  /src/app/components/ContentRouter.tsx — contentWidth policies for all screens
  /src/app/components/MainLayout.tsx — updated architecture docs
  /src/app/components/TodoManagementScreen.tsx — DesktopPageHeader, removed screen-level spacing
  /src/app/components/TaskDetailScreen.tsx — DesktopPageHeader, mobile-only header, max-w-3xl
  /src/app/components/AddTaskScreen.tsx — DesktopPageHeader, mobile-only header/title
  /src/app/components/CompletedExamsDesktopView.tsx — removed h-full, internal scroll
  /src/app/components/KlassenarbeitenScreen.tsx — viewport-based height
  /src/app/components/SchulaufgabenScreen.tsx — viewport-based height
  /src/app/components/ProfilScreenDesktop.tsx — removed internal scroll container
  /src/app/components/DebugLayoutOverlay.tsx — extended metrics
