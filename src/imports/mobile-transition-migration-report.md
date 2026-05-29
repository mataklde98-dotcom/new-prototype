MOBILE TRANSITION STANDARDIZATION - MIGRATION REPORT

Date: 2026-03-03
Status: COMPLETE

========================================
1. CENTRAL COMPONENT CREATED
========================================

File: /src/app/components/MobileRouteTransition.tsx

Props:
  - isVisible: boolean (controls slide-in/out + delayed unmount)
  - children: ReactNode
  - zIndex?: number (default: 56, footer is z-60)
  - className?: string

Internally uses:
  - useDelayedUnmount (300ms delayed unmount for exit animation)
  - SlideTransition.css (GPU-optimized slide-screen classes)

========================================
2. FOOTER FIX (MainLayout.tsx)
========================================

BEFORE:
  MobileNavigation was conditionally UNMOUNTED when overlays open:
  {isMobile && !showMyFlashcards && !showCompletedExams && !showChats && !showAccountEdit && !showTodoManagement && (
    <MobileNavigation ... />
  )}

AFTER:
  MobileNavigation is ALWAYS MOUNTED on mobile.
  Visibility controlled via CSS transform: translateY(calc(100% + 20px))
  - No unmount/remount during transitions
  - Smooth slide-out animation when overlays open
  - pointerEvents: 'none' when hidden
  - GPU-accelerated (will-change: transform)

========================================
3. MIGRATED OVERLAYS (App.tsx)
========================================

All 4 top-level overlays migrated from manual slide-screen + useDelayedUnmount to MobileRouteTransition:

a) MyFlashcardsScreenMobile
   BEFORE: {isMobile && isMyFlashcardsMounted && (<div className="slide-screen ...">)}
   AFTER:  {isMobile && (<MobileRouteTransition isVisible={navigation.showMyFlashcards}>)}

b) CompletedExamsScreenMobile
   BEFORE: {isMobile && isCompletedExamsMounted && (<div className="slide-screen ...">)}
   AFTER:  {isMobile && (<MobileRouteTransition isVisible={navigation.showCompletedExams}>)}

c) ProfileAnalyticsScreen (Lernanalyse)
   BEFORE: {isLernanalyseMounted && (<div className="slide-screen ..." style={{zIndex: 61}}>)}
   AFTER:  <MobileRouteTransition isVisible={navigation.showLernanalyse} zIndex={61}>

d) TodoManagementScreen
   BEFORE: {isMobile && isTodoMounted && (<TodoManagementScreen isClosing={...} />)}
   AFTER:  {isMobile && (<MobileRouteTransition isVisible={navigation.showTodoManagement}>)}
   NOTE:   isClosing prop no longer passed (MobileRouteTransition handles animation)

========================================
4. REMOVED FROM App.tsx
========================================

- 4x useDelayedUnmount() calls (isTodoMounted, isMyFlashcardsMounted, isCompletedExamsMounted, isLernanalyseMounted)
- useDelayedUnmount import
- Manual slide-screen wrapper divs for all 4 overlays

========================================
5. TODOMANAGEMENTSCREEN FIX
========================================

TodoManagement had its own internal slide-screen wrapper on mobile.
With MobileRouteTransition wrapping it from App.tsx, this caused a double-animation.

FIX: Replaced internal slide-screen wrapper:
  BEFORE: <div className={`slide-screen ${slideAnimationClass} flex flex-col`}>
  AFTER:  <div className="flex flex-col h-full bg-[#0a0a0a]">

The internal animation state machine (animationState, isClosing) is still present
for the desktop flow but no longer drives the mobile wrapper.

========================================
6. UNCHANGED (intentionally)
========================================

- ScreenManager.tsx (tab transitions Home/KI-Tools/Profil/Chats) - already centralized
- AddTaskScreen.tsx (sub-screen within TodoManagement - LOCAL transition is correct)
- TaskDetailScreen.tsx (sub-screen within TodoManagement - LOCAL transition is correct)
- KlassenarbeitenScreen.tsx (sub-screen within Profil - LOCAL transition is correct)
- SchulaufgabenScreen.tsx (sub-screen within Klassenarbeiten - LOCAL transition is correct)
- ScreenTransition.tsx (unused/legacy - can be deleted in cleanup)
- PureCSS ScreenTransition.tsx (unused/legacy - can be deleted in cleanup)
- OptimizedScreenContainer.tsx (unused/legacy - can be deleted in cleanup)
- TransitionBenchmark.tsx (dev tool - no change needed)
- TransitionComparison.tsx (dev tool - no change needed)

========================================
7. Z-INDEX HIERARCHY (Mobile)
========================================

z-0..2   ScreenManager screens (tab content)
z-56     Overlay screens (MyFlashcards, CompletedExams, TodoManagement)
z-60     MobileNavigation (footer) - ALWAYS on top
z-61     Lernanalyse (above standard overlays)
z-200    Sub-screens (AddTaskScreen, TaskDetailScreen within TodoManagement)
z-99999  KlassenarbeitenScreen, SchulaufgabenScreen (legacy, within Profil)

========================================
8. VERIFICATION CRITERIA
========================================

- [ ] Footer stays visible and fixed during tab transitions (Home <-> KI-Tools <-> Profil)
- [ ] Footer smoothly slides out when overlays open (MyFlashcards, CompletedExams, TodoManagement)
- [ ] Footer smoothly slides back in when overlays close
- [ ] No footer flicker during any transition
- [ ] Overlay slide-in from right works correctly
- [ ] Overlay slide-out to right works correctly
- [ ] Sub-screens within overlays (AddTask, TaskDetail) still transition correctly
- [ ] Lernanalyse opens above other overlays (z-61)
- [ ] Desktop layout is unchanged