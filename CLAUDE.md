# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SoStudy — a German-language, mobile-first study app (flashcards, AI tools, exam simulation, tutoring). Originally generated from Figma Make ("Visual Studio V1"), now developed in VS Code. It ships as a web app and as a native iOS/Android app via Capacitor (`appId: com.sostudy.app`). UI copy, code comments, and most docs are in **German** — keep new strings and comments German unless the surrounding code is English.

## Commands

**Use pnpm, not npm.** The repo is pnpm-configured (`pnpm-workspace.yaml`, `pnpm.overrides`). `npm install` fails here with `Cannot read properties of null (reading 'matches')`. If `pnpm` isn't global, `npx pnpm@9 <cmd>` works. If deps look broken: `rm -rf node_modules && npx pnpm@9 install`.

```bash
pnpm install            # install dependencies
pnpm dev                # Vite dev server (main app entry: index.html → src/main.tsx)
pnpm build              # production build → dist/
pnpm build:capacitor    # vite build && cap sync (build + push web assets to native shells)
pnpm cap:ios            # open the iOS project in Xcode
pnpm cap:android        # open the Android project in Android Studio
pnpm cap:add:ios        # scaffold the iOS native project (first time only)
```

There is **no lint, test, or typecheck tooling** and **no `tsconfig.json`** — TypeScript is transpiled by Vite/esbuild without type checking. Do not assume `tsc`, `jest`, `vitest`, or `eslint` are available. "Testing" in `docs/TESTING_GUIDE.md` refers to manual DevTools performance profiling, not automated tests.

**`pnpm build` works and deploys on Vercel.** The Figma bundle ships without a `src/assets/` directory, so a few `figma:asset/` images are missing. The `figmaAssetResolver` in `vite.config.ts` handles this: existing assets resolve normally; **missing ones fall back to a transparent 1×1 placeholder** (logged as `[figma-asset] fehlt…` at build time) so Rollup doesn't abort. Drop the real PNGs into `src/assets/` with their exact hashed filenames and they're picked up automatically — no code change. The bundle is one large JS chunk (~3 MB) — acceptable for the prototype; code-split later if needed.

## Build & tooling specifics (`vite.config.ts`)

- **Path alias `@` → `src/`**. Use `@/...` imports everywhere.
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin — there is **no `tailwind.config.js`**. Configuration and design tokens live in CSS (`src/styles/theme.css`, `tokens.css`) using `@theme`/CSS custom properties. `postcss.config.mjs` is intentionally empty.
- **`figma:asset/...` imports** are resolved by a custom Vite plugin to `src/assets/`. Files from the Figma export use this scheme.
- `assetsInclude` covers `**/*.svg` and `**/*.csv` for raw imports — **never add `.css`, `.tsx`, or `.ts`** to it.
- Per the config comments, the React and Tailwind plugins are both required for Figma Make and must not be removed; React's `babel.compact` is set to `false`.

## Architecture

### Three bundled "apps", one build
The codebase contains three separately-authored React apps. Only the **main app** is a build entry; the other two are embedded as components.

- **Main app** — `src/main.tsx` → `src/app/App.tsx`. This is the only entry wired into `index.html`.
- **Exam simulation** — `src/examapp/`. Embedded into the main app via `ContentRouter` as `import ExamSimulationApp from '@/examapp/app/App'`. It has its own `src/examapp/main.tsx` (a standalone entry that is **not** used by the unified build), its own hooks/services/styles, and brings **its own `QueryClientProvider`** in `examapp/app/App.tsx`.
- **Flashcard generation** — `src/flashcardgen/GenerateFlashcardsApp.tsx`. Also embedded via `ContentRouter`.

When working in `examapp/` or `flashcardgen/`, treat them as self-contained — they have their own conventions and provider wiring distinct from the main app.

### Main app composition (`src/app/App.tsx`)
`App` → `AuthWrapper` (render-prop, gates on login) → `AppContent`. `AppContent` wraps `<UserProvider>` and composes a fixed set of orchestrators:
- **`MainLayout`** — sidebar/shell chrome (desktop + mobile).
- **`ContentRouter`** — renders the active screen.
- **`ModalManager`** — all modals/overlays.
- **`ScreenManager`** / **`MobileRouteTransition`** — screen mounting and transitions.

Note: `AppContent` does **not** mount a `QueryClientProvider`. The `QueryProvider`, `AppWithProviders`, and `AppWithContentStore` wrappers exist in `src/providers/` and `src/app/` but are **not imported by `main.tsx`**. React Query is therefore only live inside the embedded exam app's subtree. Verify provider context before adding `@tanstack/react-query` hooks to the main app render path.

### Navigation (no router library)
There is no React Router. Navigation is **boolean state flags** in the `useNavigation` hook (`src/hooks/useNavigation.ts`): `showHome`, `showMyFlashcards`, `showExamSimulation`, `mobileActiveTab`, etc., plus `previousScreenBefore*` state to drive back-navigation and directional transitions. `ContentRouter` reads these flags to decide what to render. To add a screen: add the flag + open/close handlers in `useNavigation`, then branch on it in `ContentRouter`.

### Data layer: mock services, designed for later backend swap
This is the most important pattern to understand. There is **no real backend yet**.

- **`src/services/*`** — service modules (`flashcardService`, `userService`, `todoService`, `sessionService`, etc.) expose async API-shaped methods that return **mock data with simulated `setTimeout` delays**. They are the seam intended to be replaced with real Supabase calls later (search for `// TODO: Replace with Supabase`). Re-exported from `src/services/index.ts`.
- **`src/mocks/*`** — the mock datasets (`MOCK_FLASHCARD_SETS`, `MOCK_USER_PROFILE`, etc.). Mutations mutate these module-level objects in place. Exported via `src/mocks/index.ts`.
- **`src/lib/auth.ts`** — mock auth. Two test users (`alexanderbaum@gmail.com` has full mock data; `newuser@sostudytest.com` is a fresh "day 0" account), password `12345678`. Auth state and user-scoped data live in `localStorage` (`getUserStorageKey` namespaces keys by user). All functions document the intended Supabase replacement inline.
- **`utils/supabase/info.ts`** holds placeholder `projectId`/`publicAnonKey` — Supabase is wired for later, not active.

When asked to "connect the backend," the work is replacing service-method bodies and `lib/auth.ts`, not rewriting components.

### State management
Mixed by design — don't assume one approach:
- **Custom state hooks** drive the main app. `useFlashcards` (the primary data hook) holds local `useState` + calls `flashcardService` with optimistic updates and rollback-on-error. Most main-app data hooks follow this shape.
- **React Query hooks** also exist (`useTodos`, `useSessions`, `useUser` in `src/hooks/`) but require a `QueryClientProvider` (see provider note above).
- **React Context**: `UserContext` (main app account data), `ContentStore` (`src/shared-content-store/`, shares Subjects/Categories/Topics/Subtopics between Exam Simulation and Flashcard Generation).
- **Plain module stores**: e.g. `src/stores/uploadRequestStore.ts`, `teacherTasksStore`, `weaknessCardStore`, `prepTodoStore` (in `src/app/components/`).

### UI / design system
- **Components**: ~140 screen/feature components in `src/app/components/`; shadcn/ui-style primitives in `src/app/components/ui/`; Radix UI + MUI + Framer Motion/`motion` available.
- **Design tokens** live in `src/styles/theme.css` and `src/styles/tokens.css`; the style entry is `src/styles/index.css` (imported by `main.tsx`). Brand primary is `#009379`; the UI is a dark glassmorphism theme. Font is **Poppins** (note the `font-['Poppins:Medium',sans-serif]` class syntax that maps to weights in `fonts.css`).
- **Shared magic numbers** (breakpoints, sidebar widths, pagination sizes, z-index, animation durations) are centralized in `src/config/constants.ts` — prefer these over hardcoding. Mobile breakpoint is `< 768px`.
- `src/imports/` contains raw Figma-exported components/assets — generally generated output, edit with care.

### Mobile / PWA behavior (intentional — do not remove)
The app deliberately behaves like a native app: `src/main.tsx` and `src/styles/index.css` aggressively **prevent all zoom** (pinch, double-tap, ctrl+wheel, iOS input-focus zoom) and lock `html/body` to `position: fixed` with `overscroll-behavior: none`. iOS safe-area insets are exposed as `--safe-area-inset-*` CSS vars with `.pt-safe`/`.pb-safe` utilities. Keep input `font-size` ≥ 16px to avoid iOS zoom-on-focus.

## Reference docs in this repo

The repo root and subfolders contain extensive German design/migration docs. The most useful:
- `SOSTUDY_DESIGN_SYSTEM.md`, `DESIGN_SYSTEM_REFERENCE.md` — design system spec.
- `TYPOGRAPHY_GUIDE.md` + the `TYPOGRAPHY_CONVERSION_*` / `*TYPOGRAPHY_AUDIT*` docs — an ongoing typography-token migration effort; consult before touching font sizing/weights.
- `CAPACITOR_SETUP_GUIDE.md`, `ios-capacitor-config.md` — native build setup.
- `AUTH_SCREENS_REFERENCE.md`, `PERFORMANCE_OPTIMIZATIONS.md`, `src/examapp/EXAM_APP_ANALYSE.md` — feature/area deep-dives.
- `guidelines/Guidelines.md` is currently the empty Figma Make template (no project-specific rules yet).
