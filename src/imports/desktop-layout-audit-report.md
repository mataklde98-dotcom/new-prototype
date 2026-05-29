DESKTOP LAYOUT ARCHITECTURE REPORT
====================================
Status: COMPLETE
Date: 2026-03-03

━━━━━━━━━━━━━━━━━━
1) GLOBAL DESKTOP LAYOUT STRUCTURE
━━━━━━━━━━━━━━━━━━

```
MainLayout (h-screen, flex-col, overflow-hidden)
├── Sidebar (fixed, left-3, top-3, bottom-3, width: sidebarWidth)
│   ├── Expanded: 286px (+ 28px margin = 314px total)
│   └── Collapsed: 65px (+ 20px margin = 85px total)
└── Content Area (flex-1, marginLeft: mainMarginLeft, transition-all 700ms)
    └── DesktopContentWrapper (h-full, w-full)
        ├── Mode: DEFAULT (scrollable, max-width 1200px centered)
        ├── Mode: fullWidth (scrollable, no max-width cap)
        └── Mode: fillHeight (no wrapper scroll, h-full chain, child scrolls)
            └── Outer (max-width 1440px, px-4/6/8, flex-1 flex-col min-h-0)
                └── Inner (max-width 1200px, flex-1 flex-col min-h-0, no py)
                    └── Screen Component (h-full, manages own scroll)
```

KEY PRINCIPLE:
  When sidebar toggles expanded <-> collapsed, MainLayout applies `marginLeft`
  transition (700ms). The content area width changes automatically via CSS.
  All child elements reflow within their container — no JS recalculation needed
  for layout (only for pagination counts where item count matters).

━━━━━━━━━━━━━━━━━━
2) ROOT CAUSE ANALYSIS PER SCREEN
━━━━━━━━━━━━━━━━━━

SCREEN                        | ROOT CAUSE                              | FIX APPLIED
------------------------------|-----------------------------------------|----------------------------------
KlassenarbeitenScreen         | max-w-[560px] hardcoded (mobile width)  | max-w-4xl (896px) mx-auto + h-full chain
SchulaufgabenScreen           | max-w-[560px] hardcoded (mobile width)  | max-w-4xl (896px) mx-auto + h-full chain
SchulaufgabenScreen Grid      | grid-cols-3 fixed                       | auto-fill, minmax(140px, 1fr)
SchulaufgabenScreen Upload    | grid-cols-4 fixed                       | auto-fill, minmax(100px, 1fr)
CompletedExamsDesktopView     | Viewport-based grid calc (windowWidth)  | CSS auto-fill, minmax(340px, 1fr)
ChatScreenDesktop             | Manual h-[calc(100vh-80px)] wrapper     | fillHeight on DesktopContentWrapper
ProfilScreenDesktop           | No height propagation from wrapper      | fillHeight on DesktopContentWrapper

SCREENS CONFIRMED SAFE (no changes needed):
  HomeScreenDesktop          — Content-based scroll, no grids, adapts naturally
  KIToolsScreen              — Intentional max-w-[900px], 2+3 col grids match item count
  TodoManagementScreen       — Content-based scroll, no grids
  MyFlashcardsHeader         — fullWidth mode, useDesktopHeaderLayout handles narrow/wide
  FlashcardGrid              — Viewport-based calc but functionally correct (see note below)

━━━━━━━━━━━━━━━━━━
3) STRUCTURAL CHANGES
━━━━━━━━━━━━━━━━━━

A) DesktopContentWrapper.tsx — NEW `fillHeight` PROP
   File: /src/app/components/DesktopContentWrapper.tsx

   Added `fillHeight` boolean prop:
   - When true: outer div = `overflow-hidden flex flex-col`
   - Middle div: `flex-1 flex-col min-h-0` (height propagation)
   - Inner div: `flex-1 flex-col min-h-0`, NO py-6/py-8 padding
   - Child component manages its own scrolling
   - Max-width constraints (1200px/1440px) preserved (fillHeight != fullWidth)
   - No wrapper scrollbar

   3 MODES NOW AVAILABLE:
   ┌─────────────┬──────────┬───────────┬──────────┬─────────────┐
   │ Mode        │ Scroll   │ Max-Width │ Height   │ Used By     │
   ├─────────────┼──────────┼───────────┼──────────┼─────────────┤
   │ default     │ wrapper  │ 1200px    │ auto     │ Home, KI,   │
   │             │          │           │          │ Todo, Exams  │
   ├─────────────┼──────────┼───────────┼──────────┼─────────────┤
   │ fullWidth   │ wrapper  │ 100%      │ auto     │ MyFlashcards│
   ├─────────────┼──────────┼───────────┼──────────┼─────────────┤
   │ fillHeight  │ child    │ 1200px    │ 100%     │ Profil,     │
   │             │          │           │          │ Chat        │
   └─────────────┴──────────┴───────────┴──────────┴─────────────┘

B) KlassenarbeitenScreen.tsx — DESKTOP LAYOUT WRAPPER
   File: /src/app/components/KlassenarbeitenScreen.tsx
   Lines: 1505-1513 (Desktop return)

   BEFORE: <div class="h-full overflow-hidden px-6 py-5">
             <div class="max-w-[560px]">  ← HARDCODED MOBILE WIDTH
   AFTER:  <div class="h-full overflow-hidden px-2 py-4">
             <div class="h-full max-w-4xl mx-auto">  ← 896px, CENTERED, HEIGHT CHAIN

   Effect: Content expands from 560px to up to 896px, centered in container.
   Height chain established: fillHeight → h-full → flex-col → internal scroll works.

C) SchulaufgabenScreen.tsx — DESKTOP LAYOUT WRAPPER + RESPONSIVE GRID
   File: /src/app/components/SchulaufgabenScreen.tsx

   1. Desktop wrapper (lines 1100-1105):
      Same fix as KlassenarbeitenScreen: max-w-[560px] → max-w-4xl mx-auto + h-full

   2. Photo grid (line 883):
      BEFORE: grid grid-cols-3 gap-[2px]
      AFTER:  grid gap-[2px], gridTemplateColumns: repeat(auto-fill, minmax(140px, 1fr))
      Effect: 3 cols at 560px → 4-6 cols at 896px, adapts to container width

   3. Upload preview grid (line 960):
      BEFORE: grid grid-cols-4 gap-[3px]
      AFTER:  grid gap-[3px], gridTemplateColumns: repeat(auto-fill, minmax(100px, 1fr))
      Effect: Adapts column count to available width

D) CompletedExamsDesktopView.tsx — CONTAINER-RESPONSIVE GRID
   File: /src/app/components/CompletedExamsDesktopView.tsx
   Lines: 202-216

   BEFORE: getGridColumns() with viewport-based calculation
           const effectiveWidth = sidebarCollapsed ? windowWidth - 120 : windowWidth - 280;
           Fixed breakpoints: 1200px → 3 cols, 650px → 2 cols, else 1 col
   AFTER:  const gridTemplateColumns = 'repeat(auto-fill, minmax(340px, 1fr))';
           Pure CSS, adapts to container width automatically

E) ContentRouter.tsx — WRAPPER MODE ASSIGNMENTS
   File: /src/app/components/ContentRouter.tsx

   - ProfilScreenDesktop: <DesktopContentWrapper fillHeight>
   - ChatScreenDesktop: <DesktopContentWrapper fillHeight>
     (removed manual h-[calc(100vh-80px)] wrapper div)

━━━━━━━━━━━━━━━━━━
4) FLASHCARD GRID NOTE
━━━━━━━━━━━━━━━━━━

FlashcardGrid + useCardsPerPageCalculation use viewport-based calculation
(windowWidth - sidebarMargin - padding) instead of container measurement.

This is ACCEPTABLE because:
1. Sidebar dimensions are deterministic (not user-resizable)
2. Calculation correctly accounts for both sidebar states
3. Grid DOES adapt when sidebar toggles (sidebarCollapsed prop triggers recalc)
4. Pagination logic is tightly coupled to column count — CSS auto-fill would
   break cardsPerPage calculation (can't know column count without JS)
5. Migrating to container-based would require ResizeObserver + refactoring
   the entire pagination system — not justified for this audit

STATUS: Functionally correct, structurally impure. Acceptable trade-off.

━━━━━━━━━━━━━━━━━━
5) FILES CHANGED
━━━━━━━━━━━━━━━━━━

/src/app/components/DesktopContentWrapper.tsx    — fillHeight prop, 3-mode architecture
/src/app/components/KlassenarbeitenScreen.tsx    — Desktop wrapper: max-w-4xl mx-auto + h-full
/src/app/components/SchulaufgabenScreen.tsx       — Desktop wrapper + responsive grids (auto-fill)
/src/app/components/CompletedExamsDesktopView.tsx — CSS auto-fill grid (removed viewport calc)
/src/app/components/ContentRouter.tsx             — fillHeight for Profil + Chat routes

━━━━━━━━━━━━━━━━━━
6) VERIFICATION CHECKLIST
━━━━━━━━━━━━━━━━━━

For each screen, sidebar expanded <-> collapsed:

[x] KlassenarbeitenScreen: content expands logically within max-w-4xl
[x] SchulaufgabenScreen: photo grid shows more columns on wider container
[x] CompletedExamsDesktopView: card grid reflows automatically via CSS
[x] ChatScreenDesktop: fills container height without manual calc
[x] ProfilScreenDesktop: main menu scrolls within container height
[x] ProfilScreenDesktop sub-screens: proper height chain via fillHeight
[x] HomeScreenDesktop: content scrolls naturally, no grids affected
[x] KIToolsScreen: intentional max-w-[900px], 2+3 fixed cols = safe
[x] TodoManagementScreen: content scrolls naturally
[x] MyFlashcardsHeader: useDesktopHeaderLayout handles narrow/wide
[x] FlashcardGrid: viewport-based but recalculates on sidebar toggle

CONFIRMED: No horizontal overflow, no unused giant empty spaces,
no broken alignment, no visual imbalance on sidebar toggle.

━━━━━━━━━━━━━━━━━━
7) FOLLOW-UP ITEMS (not blocking)
━━━━━━━━━━━━━━━━━━

1. CompletedExamsDesktopView: `windowHeight` and `sidebarCollapsed` props
   are now unused (grid calc removed). Can be cleaned from interface + ContentRouter.

2. layoutHelpers.ts `calculateGridColumns` + `useDerivedState.ts`:
   Type mismatch — `gridColumns` typed as `number` in DerivedStateOutput
   but `calculateGridColumns` returns `string`. Runtime works (JS coercion)
   but TypeScript annotation is incorrect.

3. FlashcardGrid pagination: future improvement would be to use
   ResizeObserver on the grid container and derive column count from
   actual container width, eliminating all hardcoded sidebar pixel values.
