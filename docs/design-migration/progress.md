# Design Migration Progress

## Meta
- Tech-Stack: React 18.3 + TypeScript + Vite 6 + Tailwind 4 + Radix UI + shadcn/ui + Capacitor 8 (iOS)
- Font heute: Poppins (Google Fonts) — dominant via `font-['Poppins:*']` Klassen
- Styling-Ansatz: Tailwind 4 + Emotion (CSS-in-JS) + inline styles
- Token-Pfad: <tbd — Phase 1 (aktuell keine zentrale Token-Datei)>
- Component-Pfad: <tbd — Phase 1 (aktuell /src/app/components/ui für Radix-Wrapper, aber keine eigene Design-Library)>
- Brand-Farben: `#00B894` primär, `#00D4AA` hell, `#009379`/`#007a63` dunkel (Dark-Mode only, BG `#0a0a0a`)
- Letzter Lauf: 2026-04-23

## Phase 0 — Discovery
- [x] Tech-Stack erkannt
- [x] Screen-Inventar erstellt (18 Mobile-Screens)
- [x] Navigation-Flow dokumentiert (BFS ab Home)

### Erkenntnisse aus Phase 0
- **Keine zentrale Design-Token-Datei.** Spacings/Sizes/Radii/Fonts überall inline als Tailwind-Arbitrary-Values (`text-[22px]`, `h-[120px]`, `pb-[94px]` etc.).
- **Brand-Farben zentral dokumentiert** (`SOSTUDY_DESIGN_SYSTEM.md`), aber im Code überall hardcoded String-Literale.
- **Dark-Mode only.** Kein Light-Mode.
- **Touch-Target-Konsistenz fragwürdig.** BottomNav ok (48px+), aber kleine Buttons teilweise 38px.
- **Safe-Area bereits via iOS-CSS-Vars.** `.pt-safe` / `.pb-safe` sind vorhanden.
- **Poppins vs SF Pro offen.** iOS 26 benutzt SF Pro — offen ob Poppins als Brand erhalten bleibt oder auf SF Pro wechselt.

### Screen-Inventar (BFS ab Home)

Hauptreihenfolge (Breitensuche, Home zuerst):

| # | Screen | Pfad | Beschreibung | Einstieg |
|---|--------|------|--------------|----------|
| 1 | HomeScreenMobile | src/app/components/HomeScreenMobile.tsx | Home-Dashboard: Lern-Streak, ToDos, Nachhilfe-Karten, KI-Tools, Klassenarbeiten-Karten | BottomNav |
| 2 | MeetingsScreen | src/app/components/MeetingsScreen.tsx | Nachhilfe-Sitzungen mit Live/Anstehend/Vergangen | BottomNav |
| 3 | ChatScreenMobile | src/app/components/ChatScreenMobile.tsx | Tutoren-Chats + KI-Assistent | BottomNav |
| 4 | KIToolsScreen | src/app/components/KIToolsScreen.tsx | KI-Features: Karteikarten-Generator, Prüfungssimulator | BottomNav + Home |
| 5 | ProfilScreenMobile | src/app/components/ProfilScreenMobile.tsx | Profil-Dashboard | BottomNav |
| 6 | MyFlashcardsScreenMobile | src/app/components/MyFlashcardsScreenMobile.tsx | Karteikarten-Verwaltung mit Auswahl-Modus | Home / KI-Tools |
| 7 | CompletedExamsScreenMobile | src/app/components/CompletedExamsScreenMobile.tsx | Absolvierte Prüfungen | Home / KI-Tools |
| 8 | ProfileAnalyticsScreen | src/app/components/ProfileAnalyticsScreen.tsx | Lernanalyse (Schwächen, Ziele, Klausuren, Leistung) | Home / Profil |
| 9 | TodoManagementScreen | src/app/components/TodoManagementScreen.tsx | ToDo-Verwaltung | Home / Profil |
| 10 | LernStreakScreen | src/app/components/LernStreakScreen.tsx | Streak-Detail | Home |
| 11 | ExtraSessionScreen | src/app/components/ExtraSessionScreen.tsx | Extra-Stunden buchen | Profil |
| 12 | TeacherProfileScreen | src/app/components/TeacherProfileScreen.tsx | Tutor-Profil | Home / Meetings |
| 13 | TutoringActivationFlow | src/app/components/TutoringActivationFlow.tsx | Nachhilfe aktivieren (Onboarding) | Profil / Home |
| 14 | TutoringProgressScreen | src/app/components/TutoringProgressScreen.tsx | Nachhilfe-Fortschritt | Profil / Home |
| 15 | TutoringSessionDetailScreen | src/app/components/TutoringSessionDetailScreen.tsx | Session-Detail | TutoringProgress / Meetings |
| 16 | TutoringExplainScreen | src/app/components/TutoringExplainScreen.tsx | AI-Chat zu Session | SessionDetail |
| 17 | AccountEditScreenMobile | src/app/components/AccountEditScreenMobile.tsx | Account-Daten editieren | Profil |
| 18 | KlassenarbeitenScreen | src/app/components/KlassenarbeitenScreen.tsx | Klassenarbeit-Liste + Upload | Profil |
| 19 | SchulaufgabenScreen | src/app/components/SchulaufgabenScreen.tsx | Schulaufgaben-Verwaltung | Profil |
| 20 | SchuleUndKlasseScreen | src/app/components/SchuleUndKlasseScreen.tsx | Schule/Klasse | AccountEdit |

### BottomNav-Tabs
Home / Meetings / Chats / KI-Tools / Profil

## Phase 1 — Foundation
- [x] Tokens aus Figma extrahiert → `src/styles/tokens.css` (464 LOC) + Report `docs/design-migration/tokens-report.md` (276 LOC) (2026-04-23).
- [x] Refinement-Run (Gate 1 Drill): Typo 11/11 VERIFIED (Node `224:56261`), Dark-Mode Colors ~47 VERIFIED via Plugin-API (`use_figma`), Sheet-Geometrie 12 Tokens VERIFIED, LG Regular+Medium+Large 10 Parameter VERIFIED, Motion + Semantic Colors aus User-Freigabe, Brand-Policy dokumentiert. Verbleibende 6 TBDs haben konkrete Begründungen (Card/Alert/Input-Radii = HIG-only; Sheet-Detents = SwiftUI-Runtime; ButtonXL = SoStudy-custom; LG-Opacity = kein Kit-Value).
- [x] **Gate 1 FREI** (2026-04-23).
- [ ] Core Components gebaut
  - [ ] Text
  - [ ] Button (inkl. Close/Back mit Liquid Glass)
  - [ ] TextField
  - [ ] NavBar
  - [ ] TabBar
  - [ ] Sheet/BottomSheet
  - [ ] ListRow + SectionHeader
  - [ ] Alert
  - [ ] ActionSheet
  - [ ] Toggle
  - [ ] SegmentedControl
- [ ] Foundation durch Reviewer freigegeben

## Phase 2 — Screens
Reihenfolge ab Home (BFS):

| # | Screen | Worker | Reviewer | Status | Notizen |
|---|--------|--------|----------|--------|---------|
| 1 | HomeScreenMobile | - | - | todo | Start |
| 2 | MeetingsScreen | - | - | todo | - |
| 3 | ChatScreenMobile | - | - | todo | - |
| 4 | KIToolsScreen | - | - | todo | - |
| 5 | ProfilScreenMobile | - | - | todo | - |
| 6 | MyFlashcardsScreenMobile | - | - | todo | - |
| 7 | CompletedExamsScreenMobile | - | - | todo | - |
| 8 | ProfileAnalyticsScreen | - | - | todo | Sehr groß (5800+ LOC), evtl. splitten |
| 9 | TodoManagementScreen | - | - | todo | - |
| 10 | LernStreakScreen | - | - | todo | - |
| 11 | ExtraSessionScreen | - | - | todo | - |
| 12 | TeacherProfileScreen | - | - | todo | - |
| 13 | TutoringActivationFlow | - | - | todo | - |
| 14 | TutoringProgressScreen | - | - | todo | - |
| 15 | TutoringSessionDetailScreen | - | - | todo | - |
| 16 | TutoringExplainScreen | - | - | todo | - |
| 17 | AccountEditScreenMobile | - | - | todo | - |
| 18 | KlassenarbeitenScreen | - | - | todo | - |
| 19 | SchulaufgabenScreen | - | - | todo | - |
| 20 | SchuleUndKlasseScreen | - | - | todo | - |

## Log
- 2026-04-23 — progress.md angelegt.
- 2026-04-23 — Phase 0 (Discovery) abgeschlossen. Tech-Stack, 20 Screens, BFS-Reihenfolge, Brand-Farben dokumentiert.
- 2026-04-23 — User-Entscheidungen:
  - Typo: **SF Pro** (Poppins komplett raus). Font-Stack: `-apple-system, 'SF Pro Text', 'SF Pro', system-ui, BlinkMacSystemFont, sans-serif`. Für ≥20pt Display-Styles `'SF Pro Display'` priorisieren.
  - Scope: **Gate 1** nach Token-Extraktion, **Gate 2** nach Core-Components, danach Screens autonom.
  - Phase-1-Zusätze: (A) nur Dark-Mode-Werte, (B) Tokens in Tailwind-4-`@theme`, (C) shadcn/Radix-Primitives behalten und nur wrappen/themen, (D) nur iPhone/Compact-Frames in Apples Datei.
- 2026-04-23 — Figma-MCP-Self-Check **PASS**:
  - whoami ok, File `UaR1FS8C2W8eVtb3rpApoF` erreichbar.
  - Node `5:108579` (Primary Button): px-20/py-14, rounded-1000, SF Pro 17/22 tracking -0.43, Fill `Accents/Blue #0088ff`.
  - Node `5522:11870` (Liquid Glass Close 48×48): backdrop-blur 20px, base-fill rgba(0,0,0,0.04) + mix-blend hard-light, second-fill color-dodge, SF Pro Semibold 19/22, fontVariationSettings 'wdth' 100, fontFeatureSettings 'ss16' 1, innere Shape-Morph-Radien 296px, Luminance-Image-Mask für Blur.
  - Liquid-Glass-Variables echt abrufbar: Light Angle -45, Refraction 60, Frost-Regular 6, Depth-Regular 30, Dispersion 0, Splay-Regular 25.
  - Alle Material-Werte kommen als **echte Werte**, keine generischen Placeholder. Keine HIG-Halluzinationen nötig.
- 2026-04-23 — Starte Phase 1 (Token-Extraction-Agent).
- 2026-04-23 — Phase-1-Token-Extraction (Initial) **abgeschlossen**. Deliverables:
  - `src/styles/tokens.css` — Tailwind-4 `@theme`-Block mit Dark-Mode-only Tokens. Brand preserved, SF Pro stack, Liquid-Glass-Regular vollständig verifiziert.
  - `docs/design-migration/tokens-report.md` — Quellen, Abdeckung, TBDs, Gate-1-Reviewer-Hinweise.
  - **Nicht importiert** in `src/styles/index.css` — wartet auf Gate-1-Freigabe.
- 2026-04-23 — Gate-1-Drill (Token-Refinement-Run) **abgeschlossen**:
  - Typo 11/11 VERIFIED aus Node `224:56261` (Caption 2 → Large Title, alle SF Pro mit korrekten Weights/Letter-Spacings, inkl. Korrekturen Title-1 `+0.38`, Large-Title `+0.40`, Headline `590`).
  - Dark-Mode Colors ~47 Variablen VERIFIED via `use_figma` Plugin-API (Weg B) — direkter Zugriff auf `valuesByMode` im Mode `404:1 Dark`. Accent-Blue korrigiert `#0A84FF → #0091FF` (aktueller Kit-Wert). Labels-Vibrant-Controls/Primary korrigiert (war Light-Mode-Wert).
  - Sheet iPhone Geometrie 12 Tokens VERIFIED (Top/Bottom-Radius, Grabber-Größe+Offset, Padding, Detents).
  - Liquid Glass Regular + Medium + Large: 10 Material-Parameter VERIFIED.
  - Bonus: Keyboard- und Scroll-Edge-Tokens aus Kit.
  - Motion: 8 HIG-Default-Keys (4 Durations + 4 Eases) aus User-Freigabe.
  - Semantic Colors: Success/Warning/Error/Info (iOS-System-Dark) aus User-Freigabe.
  - Brand-Policy als CSS-Kommentar festgehalten: Brand-Grün = einziger Primary-Accent, Apple-Blue nur als Referenz.
  - Verbleibende **6 TBDs** mit Begründung (Card/Alert/Input-Radii HIG-only, Button-XL SoStudy-custom, Sheet-Detents SwiftUI-Runtime, LG-Opacity fallback).
  - MCP Weg B (`use_figma` Plugin-API) deutlich zuverlässiger als Weg A — für künftige Extraktionen: immer zuerst Plugin-API.
- 2026-04-23 — **Gate 1 FREI.** Phase 1b (Component-Builder) kann starten.
  - **TBD-Zählung:** ~30 Dark-Mode-Farbwerte (Apple-System-Colors), 9 Text-Styles numerisch, 3 Radii, 5 Liquid-Glass-Medium/Large-Werte, Motion komplett. Siehe Report.
