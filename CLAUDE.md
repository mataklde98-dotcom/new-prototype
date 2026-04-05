# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SoStudy is a German study/learning app (Lern-App) built as a mobile-first PWA, optimized for iOS. It was originally generated from Figma Make and is actively developed. The app includes flashcard management, exam simulation, AI chat tools, todo management, teacher profiles, tutoring features, and learning analytics.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build
- `npm run build:capacitor` — Build + sync to Capacitor (iOS/Android)
- `npm run cap:sync` — Sync web assets to native projects
- `npm run cap:ios` / `npm run cap:android` — Open native IDE

No test runner or linter is configured.

## Tech Stack

- **React 18** + **TypeScript** + **Vite** (ESM)
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin, not PostCSS)
- **Capacitor** for native iOS/Android wrapper
- **Radix UI** primitives + **MUI** (icons/material) + **shadcn/ui** pattern (`class-variance-authority`, `clsx`, `tailwind-merge`)
- **Framer Motion** (`motion/react`) for animations
- **Recharts** for data visualization
- **React Hook Form**, **React DnD**, **TanStack Query**
- Path alias: `@/` resolves to `./src/`

## Architecture

### Navigation (no React Router)

The app uses a **custom screen manager** instead of a router:
- `App.tsx` is the root — manages all screen state via `useScreenManager` and `useNavigation` hooks
- `ScreenManager` handles animated transitions between screens (pure CSS, 120fps GPU-optimized)
- `MobileRouteTransition` provides iOS-style slide transitions
- `ContentRouter` maps navigation state to screen components (desktop)
- `MainLayout` provides the responsive shell: sidebar (desktop) + bottom nav (mobile)

### Layout System

- **Desktop**: `MainLayout` → `ModernSidebar` + `DesktopContentWrapper` (width policy: standard/wide/full)
- **Mobile**: Full-screen views with `MobileNavigation` bottom bar
- **Breakpoint**: 768px (`BREAKPOINTS.MOBILE` in `src/config/constants.ts`)
- Screens must NOT define their own `px`, `mx-auto`, `max-w`, or layout-level margins — `DesktopContentWrapper` is the sole width/spacing authority

### Sub-Applications

- **`src/examapp/`** — Exam simulation engine (separate App, services, hooks, types, data)
- **`src/flashcardgen/`** — Flashcard generation flow
- **`src/shared-content-selection/`** and **`src/shared-content-store/`** — Cross-app content sharing

### Data Layer

- Currently uses **mock data** (`src/mocks/`) with simulated delays — no real backend yet
- Auth uses `localStorage` with two test users defined in `src/lib/auth.ts`:
  - `alexanderbaum@gmail.com` / `12345678` (full mock data)
  - `newuser@sostudytest.com` / `12345678` (empty state)
- Services in `src/services/` are structured for future Supabase integration
- `src/contexts/UserContext.tsx` provides user state via React Context

### Key Directories

- `src/app/components/` — ~130 screen and UI components (the main component library)
- `src/hooks/` — ~30 custom hooks (barrel-exported from `src/hooks/index.ts`)
- `src/imports/` — Figma Make generated component variants (raw imports, not hand-edited)
- `src/config/constants.ts` — Centralized magic numbers (breakpoints, spacing, z-index, colors, animation durations)
- `src/styles/` — CSS entry points: `index.css` imports `fonts.css`, `tailwind.css`, `theme.css`, `scrollbar-hide.css`

## Design System

### Visual Style
- **Dark theme only**: background `#0a0a0a`, premium flat SaaS style (Linear/Vercel-inspired)
- Surface depth system: 3 tiers using `bg-white/[0.04]` → `bg-white/[0.05]` → `bg-white/[0.08]`
- Text opacity hierarchy: `text-white` → `text-white/70` → `text-white/50` → `text-white/40` → `text-white/30`
- Accent green: `#00B894` (CTAs), `#00D4AA` (status), `#009379` (subtle)

### Typography
- **Font**: Poppins (all weights 100-900, loaded via Google Fonts in `src/styles/fonts.css`)
- Custom Tailwind weight syntax using CSS overrides:
  - `font-['Poppins:Regular',sans-serif]` → 400
  - `font-['Poppins:Medium',sans-serif]` → 500
  - `font-['Poppins:SemiBold',sans-serif]` → 600
  - `font-['Poppins:Bold',sans-serif]` → 700
- Headings/section titles use SemiBold (600) or Bold (700) — never Regular/Medium for titles
- Buttons use SemiBold (600), 16px font size

## Performance Rules

- **Never use `backdrop-blur`** — replaced with solid `bg-[#1a1a1a]/80` equivalents for GPU performance
- Use `React.memo` on list-rendered components (FlashcardItem, TodoCard, DateCard, CompletedExamCard)
- Screen transitions use only GPU-composited properties (`transform`, `opacity`)
- Inputs must have `font-size >= 16px` to prevent iOS auto-zoom
- `will-change` should be used sparingly
