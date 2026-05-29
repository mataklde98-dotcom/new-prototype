# SoStudy Design System & Style Guide

> Dieses Dokument beschreibt das vollstaendige Design-System der SoStudy-App.
> Ziel: Ein anderer Entwickler / Figma Make kann damit pixel-perfekte, konsistente Screens bauen.

---

## 1. Grundprinzip: Premium SaaS Style (Linear/Vercel)

Die App folgt einem **flachen, dunklen Premium-SaaS-Stil** (inspiriert von Linear, Vercel, Raycast).
Kein Glasmorphismus, keine Blur-Effekte (`backdrop-blur` ist aus Performance-Gruenden verboten).
Stattdessen: subtile Opacity-Layer, feine Borders, GPU-optimierte Animationen.

---

## 2. Farben

### 2.1 Hintergrund

| Token | Wert | Verwendung |
|-------|------|------------|
| **App-Hintergrund** | `#0a0a0a` | Einheitlicher Hintergrund fuer ALLE Screens |
| **Navbar-Hintergrund** | `rgba(21, 21, 21, 0.9)` | Mobile Bottom-Navigation |

### 2.2 Oberflaechen (3-Stufen-Tiefensystem)

| Stufe | Background | Border | Verwendung |
|-------|-----------|--------|------------|
| **Stufe 1 (Karten)** | `bg-gradient-to-br from-white/[0.04] to-white/[0.01]` | `border border-white/[0.06]` | Cards, Section-Container, Listen |
| **Stufe 2 (Eingaben)** | `bg-white/[0.05]` | `border border-white/[0.08]` | Input-Felder, Date-Picker-Buttons |
| **Stufe 3 (Hover/Active)** | `bg-white/[0.08]` bis `bg-white/[0.10]` | gleich | Hover- und Active-States |

### 2.3 Textfarben

| Typ | Farbe | Verwendung |
|-----|-------|------------|
| **Primaer** | `text-white` oder `#FFFFFF` | Titel, wichtige Labels |
| **Sekundaer** | `text-white/70` oder `rgba(255,255,255,0.7)` | Untertitel, aktive Werte |
| **Tertiaer** | `text-white/50` | Zurueck-Buttons, Counts |
| **Dezent** | `text-white/40` oder `text-white/35` | Inaktive Tabs, Platzhalter |
| **Minimal** | `text-white/30` | Sublabels, Hinweistexte |
| **Ultraleicht** | `text-white/20` bis `text-white/15` | Trennzeichen, Chevrons |
| **iOS Grau** | `#8E8E93` | Section-Header im Profil, Sublabels |

### 2.4 Noten-Farben (Schulnoten 1-6)

```typescript
const GRADE_COLORS = {
  '1': { bg: 'rgba(74, 222, 128, 0.12)',  border: 'rgba(74, 222, 128, 0.25)',  text: '#4ADE80', bar: '#4ADE80' },
  '2': { bg: 'rgba(96, 200, 120, 0.12)',  border: 'rgba(96, 200, 120, 0.25)',  text: '#60C878', bar: '#60C878' },
  '3': { bg: 'rgba(232, 185, 96, 0.12)',  border: 'rgba(232, 185, 96, 0.25)',  text: '#E8B960', bar: '#E8B960' },
  '4': { bg: 'rgba(245, 158, 66, 0.12)',  border: 'rgba(245, 158, 66, 0.25)',  text: '#F59E42', bar: '#F59E42' },
  '5': { bg: 'rgba(255, 120, 80, 0.12)',  border: 'rgba(255, 120, 80, 0.25)',  text: '#FF7850', bar: '#FF7850' },
  '6': { bg: 'rgba(255, 69, 58, 0.12)',   border: 'rgba(255, 69, 58, 0.25)',   text: '#FF453A', bar: '#FF453A' },
};
```

### 2.5 Akzentfarben / Badges

Badges verwenden das Muster: `backgroundColor: ${color}20`, `color: ${color}`, `border: 1px solid ${color}40`

---

## 3. Typografie

### 3.1 Font

- **Font-Familie:** `Poppins` (Google Fonts, alle Weights 100-900)
- **Import:** `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap')`
- **Fallback:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### 3.2 Font-Weight-Syntax (Tailwind)

Statt Tailwind `font-bold` wird ein spezielles Pattern verwendet:

```
font-['Poppins:Regular',sans-serif]   → Poppins 400
font-['Poppins:Medium',sans-serif]    → Poppins 500
font-['Poppins:SemiBold',sans-serif]  → Poppins 600
font-['Poppins:Bold',sans-serif]      → Poppins 700
```

Diese werden in `/src/styles/fonts.css` auf die korrekten `font-weight`-Werte gemappt.

### 3.3 Typografie-Skala

| Element | Font | Size | Weight | Extras |
|---------|------|------|--------|--------|
| **Screen-Titel** | Poppins:Bold | `text-[22px]` (mobil) / `text-[24px]` (desktop) | 700 | `tracking-[-0.3px]` |
| **Card-Titel** | Poppins:Medium | `text-[15px]` | 500 | |
| **Section-Header** | Poppins:SemiBold | `text-[12px]` | 600 | `uppercase tracking-wide` |
| **Body/Sublabel** | Poppins:Regular | `text-[12px]`-`text-[13px]` | 400 | |
| **Tab-Label** | Poppins:Medium | `text-[13px]` | 500 | |
| **Button-Label** | Poppins:Medium | `text-[12px]`-`text-[14px]` | 500 | |
| **Badge-Text** | Poppins:SemiBold/Bold | `text-[11px]`-`text-[12px]` | 600-700 | |
| **NavBar-Label** | Poppins | `10px` | 500 (inaktiv) / 600 (aktiv) | `letterSpacing: -0.1px` |
| **Notiz-Text** | Poppins:Regular | `text-[13px]` | 400 | `break-words`, `overflow-wrap: anywhere`, max 400 Zeichen |

### 3.4 Rendering

```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

---

## 4. Komponenten-Patterns

### 4.1 Cards / Section-Container

```tsx
<div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
  {/* Inhalt */}
</div>
```

### 4.2 Listen-Items (in Cards)

```tsx
<button
  className={`w-full flex items-center gap-3.5 px-4 py-3.5 transition-colors duration-150 relative
    ${isMobile ? 'active:bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}
  style={{ WebkitTapHighlightColor: 'transparent' }}
>
  {/* Icon + Text + Chevron */}
  {!isLast && (
    <div className="absolute bottom-0 left-[60px] right-0 h-px bg-white/[0.06]" />
  )}
</button>
```

Trenn-Linien: `h-px bg-white/[0.06]` oder `h-px bg-white/[0.08]`, **eingerueckt** (z.B. `left-4` oder `left-[60px]`).

### 4.3 Primaer-Button (Header)

```tsx
<button className={`flex items-center gap-1.5 px-3.5 h-[34px] rounded-xl
  bg-white/[0.06] border border-white/[0.12] transition-all duration-150
  ${isMobile ? 'active:bg-white/[0.10]' : 'hover:bg-white/[0.10]'}`}
  style={{ WebkitTapHighlightColor: 'transparent' }}
>
  <Plus className="w-3.5 h-3.5 text-white" />
  <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">Label</span>
</button>
```

### 4.4 Action-Buttons (im Content)

```tsx
// Primaer (weiss/hell)
backgroundColor: 'rgba(255, 255, 255, 0.1)'
color: '#ffffff'

// Sekundaer (gedaempft)
backgroundColor: 'rgba(255, 255, 255, 0.04)'
color: 'rgba(255, 255, 255, 0.4)'
```

### 4.5 Input-Felder

```tsx
<input
  className={`w-full h-[44px] px-4 rounded-xl bg-white/[0.05] border border-white/[0.08]
    text-white font-['Poppins:Regular',sans-serif] text-[14px]
    placeholder:text-white/25 focus:border-white/[0.20] focus:outline-none
    transition-colors`}
/>
```

### 4.6 Textarea

```tsx
<textarea
  className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08]
    text-white font-['Poppins:Regular',sans-serif] text-[14px]
    placeholder:text-white/25 focus:border-white/[0.20] focus:outline-none
    transition-colors resize-none`}
  maxLength={400}
  rows={3}
  style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
/>
```

### 4.7 Tab-Bar (Segmented Control)

GPU-animierter Sliding-Indicator mit `translateX`:

```tsx
<div className="relative p-1 rounded-xl bg-white/[0.04]">
  <div className="relative flex items-center">
    {/* Sliding indicator pill */}
    <div
      className="absolute top-0 bottom-0 left-[4px] rounded-lg"
      style={{
        width: 'calc((100% - 8px) / 2)',  // 2 Tabs
        transform: `translateX(${activeTab === 0 ? '0%' : '100%'})`,
        transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        willChange: 'transform',
      }}
    >
      <div className="absolute inset-0 bg-white/[0.08] border border-white/[0.12] rounded-lg" />
    </div>

    {/* Tab-Buttons */}
    <button className={`relative z-10 flex-1 h-[36px] rounded-lg
      ${isActive ? 'text-white' : 'text-white/35'}`}>
      Label
    </button>
  </div>
</div>
```

### 4.8 Noten-Badge / Grade-Pill

```tsx
<div
  className="flex items-center px-2 py-0.5 rounded-md"
  style={{ backgroundColor: gradeColors.bg, border: `1px solid ${gradeColors.border}` }}
>
  <span className="font-['Poppins:Bold',sans-serif] text-[12px]" style={{ color: gradeColors.text }}>
    2+
  </span>
</div>
```

### 4.9 Noten-Kreise (mit Count-Badge)

```tsx
<div className="relative">
  <div
    className="flex items-center justify-center w-[30px] h-[30px] rounded-full"
    style={{ backgroundColor: `${barColor}18`, border: `1.5px solid ${barColor}45` }}
  >
    <span className="font-['Poppins:Bold',sans-serif] text-[13px]" style={{ color: barColor }}>
      {grade}
    </span>
  </div>
  {count > 1 && (
    <div
      className="absolute -top-[5px] -right-[5px] flex items-center justify-center w-[16px] h-[16px] rounded-full"
      style={{ backgroundColor: barColor }}
    >
      <span className="font-['Poppins:Bold',sans-serif] text-[9px] text-[#0a0a0a]">{count}</span>
    </div>
  )}
</div>
```

---

## 5. Layout-Patterns

### 5.1 Screen-Grundstruktur (Mobile)

```tsx
<div className="size-full flex flex-col bg-[#0a0a0a] overflow-hidden overscroll-none">
  {/* Fixer Header */}
  <div className="flex-shrink-0 px-4 pt-safe">
    {/* Zurueck-Button + Actions */}
    <div className="flex items-center gap-3 h-[56px]">...</div>
    {/* Titel */}
    <div className="mb-5">
      <h1 className="font-['Poppins:Bold',sans-serif] text-[22px] text-white tracking-[-0.3px]">Titel</h1>
    </div>
    {/* Optional: Tab-Bar (sticky, scrollt NICHT mit) */}
  </div>

  {/* Scrollbarer Content */}
  <div
    className="flex-1 min-h-0 overflow-y-auto overscroll-none ka-scroll-hide px-4"
    style={{ scrollbarWidth: 'none' }}
  >
    {/* Content hier */}
  </div>
</div>
```

**Wichtig:** `min-h-0` auf dem scrollbaren Bereich ist **kritisch** fuer korrekte Flexbox-Overflow-Berechnung!

### 5.2 Screen-Grundstruktur (Desktop)

```tsx
<div className="h-full overflow-hidden px-6 py-5">
  <div className="max-w-[560px]">
    {content}
  </div>
</div>
```

### 5.3 Zurueck-Button

```tsx
<button
  onClick={goBack}
  className="flex items-center gap-0.5 active:opacity-70 transition-opacity"
  style={{ WebkitTapHighlightColor: 'transparent' }}
>
  <ChevronLeft className="w-5 h-5 text-white/50" />
  <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50">Zurueck</span>
</button>
```

### 5.4 Scroll-Verhalten

- Content-Wrapper: `overflow-hidden`
- Innerer Scroll-Bereich: `flex-1 min-h-0 overflow-y-auto overscroll-none`
- Desktop-Wrapper: `overflow-hidden`
- Scrollbar ausblenden: `.ka-scroll-hide::-webkit-scrollbar { display: none; }` + `scrollbarWidth: 'none'`
- **KEIN** `-WebkitOverflowScrolling: touch` (veraltet, verursacht Bugs)
- `pb-[120px]` nur im Upload-View (Platz fuer Fixed-Bottom-Buttons)

---

## 6. Animationen & Transitions

### 6.1 Timing-Funktion

**Standard-Easing fuer ALLE Animationen:**
```
cubic-bezier(0.4, 0.0, 0.2, 1)
```
Dies ist die Material Design "standard" Easing-Kurve.

**Standard-Dauer:** `300ms`

### 6.2 GPU-optimierte Screen-Slides

Alle Screen-Uebergaenge nutzen **nur GPU-Properties**: `transform` und `opacity`.

```css
.slide-screen {
  position: fixed;
  inset: 0;
  z-index: 56;
  background: #0a0a0a;
  transition: transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
  will-change: transform;
  transform: translateZ(0);
  contain: layout style paint;
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000px;
}
```

**Einfahren (von rechts):**
```css
@keyframes slideScreenInFromRight {
  from { transform: translateX(100%) translateZ(0); }
  to   { transform: translateX(0) translateZ(0); }
}
```

**Ausfahren (nach rechts):**
```css
@keyframes slideScreenOutToRight {
  from { transform: translateX(0) translateZ(0); }
  to   { transform: translateX(100%) translateZ(0); }
}
```

### 6.3 Content-Animationen (leichte Fade-Ins)

```css
@keyframes kaFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes kaSlideIn {
  from { opacity: 0; transform: translateX(12px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes kaSlideBack {
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

Dauer: `0.2s ease-out`

### 6.4 Swipeable Tabs (Touch-Swipe)

200%-breiter Flex-Container mit zwei 50%-Panels:

```tsx
<div className="overflow-hidden" style={{ touchAction: 'pan-y', clipPath: 'inset(0px)' }}>
  <div
    className="flex"
    style={{
      width: '200%',
      transform: `translateX(calc(${activeTab === 0 ? '0%' : '-50%'} + ${swipeOffset}px))`,
      transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
      willChange: 'transform',
    }}
  >
    <div className="w-1/2 flex-shrink-0">{/* Panel 1 */}</div>
    <div className="w-1/2 flex-shrink-0 pl-[3px]">{/* Panel 2 — pl-[3px] behebt Sub-Pixel-Rendering-Bug */}</div>
  </div>
</div>
```

**Touch-Event-Logik:**
- Axis-Locking (horizontal vs. vertikal)
- Rubber-Band-Effekt an den Raendern
- Velocity-basierte Swipe-Erkennung
- `touchAction: 'pan-y'` erlaubt vertikales Scrollen

### 6.5 useDelayedUnmount Hook

Fuer Mount/Unmount-Animationen (300ms Exit-Animation, dann Unmount):

```tsx
function useDelayedUnmount(isVisible: boolean, delayMs = 300): boolean {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
    } else if (isMounted) {
      const timer = setTimeout(() => setIsMounted(false), delayMs);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isMounted, delayMs]);
  return isMounted;
}
```

**Verwendung:**
```tsx
const isMounted = useDelayedUnmount(showScreen);

{isMounted && (
  <div className={`slide-screen ${showScreen ? 'slide-screen-entering' : 'slide-screen-exiting'}`}>
    <MyScreen isClosing={!showScreen} onClose={() => setShowScreen(false)} />
  </div>
)}
```

---

## 7. Mobile vs. Desktop

### 7.1 Responsivitaet

- **Breakpoint:** `isMobile = windowWidth < 768`
- **Mobile:** Overlay-Screens via `slide-screen` (fixed, full-screen)
- **Desktop:** Inline-Content in Sidebar-Layout mit `max-w-[560px]`

### 7.2 Interaktions-Unterschiede

| | Mobile | Desktop |
|--|--------|---------|
| **Hover** | `active:bg-white/[0.04]` | `hover:bg-white/[0.04]` |
| **Tap-Highlight** | `WebkitTapHighlightColor: 'transparent'` | - |
| **Touch-Feedback** | `active:scale-95` | - |
| **Header-Hoehe** | `h-[56px]` + `pt-safe` | `mb-4` / `mb-6` |
| **Padding** | `px-4` | `px-6 py-5` |
| **Titel-Groesse** | `text-[22px]` | `text-[24px]` |

### 7.3 Safe Areas (iOS PWA)

```
pt-safe        → padding-top: env(safe-area-inset-top)
pb-safe        → padding-bottom: env(safe-area-inset-bottom)
```

---

## 8. Overlay-Screens & z-Index

### 8.1 z-Index-Hierarchie

| z-Index | Verwendung |
|---------|------------|
| `0-1` | ScreenManager (aktive/exiting Screens) |
| `2` | ScreenManager (entering Screen) |
| `56` | Slide-Overlay-Screens (My Flashcards, Completed Exams, etc.) |
| `99999` | Fullscreen-Overlays (Exam Simulation, Flashcard Set View) |
| `100000` | Date-Picker Calendar Backdrop |
| `100001` | Date-Picker Calendar Content |

### 8.2 Portal-Pattern

Fuer Overlays die ueber allem schweben muessen:

```tsx
ReactDOM.createPortal(
  <div style={{ position: 'fixed', inset: 0, zIndex: 99999 }}>
    {/* Overlay-Inhalt */}
  </div>,
  document.body
);
```

---

## 9. Besondere Patterns

### 9.1 Scrollbar ausblenden

```css
.ka-scroll-hide::-webkit-scrollbar { display: none; }
```
Plus inline: `style={{ scrollbarWidth: 'none' }}`

### 9.2 CSS `contain` Property

Fuer Layout-Isolation (Performance):
```tsx
style={{ contain: 'layout style paint' } as React.CSSProperties}
```

### 9.3 Doppel-Render-Zittern vermeiden

Verwende **synchrone Refs** statt `useState` + `useEffect` fuer Werte die beim naechsten Render sofort verfuegbar sein muessen:

```tsx
const prevViewRef = useRef(currentView);
// Am Anfang des Renders aktualisieren:
prevViewRef.current = currentView;
```

### 9.4 Dateinamen-Generierung

Kurze 6-stellige alphanumerische Dateinamen:

```tsx
function generateShortFileName(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return `${result}.pdf`;
}
```

### 9.5 Zoom-Praevention (iOS PWA)

- `touch-action: manipulation` auf `*`
- `gesturestart/gesturechange/gestureend` Events werden prevented
- Multi-Touch-Zoom wird prevented
- Double-Tap-Zoom wird prevented (300ms Threshold)
- Input-Felder: Mindestens `16px` Font-Size um iOS Auto-Zoom zu verhindern

---

## 10. Icon-System

**Library:** `lucide-react`

**Standard-Groessen:**
- Navigation: `size={22}` / `w-5 h-5`
- In Cards: `w-3.5 h-3.5` bis `w-5 h-5`
- Chevrons: `w-[16px] h-[16px]` bis `w-[20px] h-[20px]`
- Emojis als Subject-Icons: `text-[20px]` mit `w-[28px] text-center`

**Farben:**
- Aktiv: `text-white` oder `color: '#FFFFFF'`
- Inaktiv: `text-white/45` oder `color: 'rgba(255,255,255,0.45)'`
- Dezent: `text-white/20` bis `text-white/25`

---

## 11. Performance-Regeln

1. **Kein `backdrop-blur`** — GPU-intensiv, verursacht Jank
2. **`will-change: transform` IMMER AN** fuer animierte Elemente
3. **Nur `transform` + `opacity` animieren** (GPU-only Properties)
4. **`contain: layout style paint`** auf Slide-Screens
5. **`React.memo`** auf alle Screen-Komponenten
6. **`translateZ(0)`** fuer Hardware-Beschleunigung
7. **`-webkit-backface-visibility: hidden`** gegen Flicker
8. **Max 2 Screens gleichzeitig im DOM** (ScreenManager)
9. **`overscroll-none`** auf Scroll-Containern (iOS Bounce verhindern)

---

## 12. Architektur-Ueberblick

### 12.1 Dateien & Ordner

```
/src/app/App.tsx                    → Haupt-Entry, AuthWrapper + AppContent
/src/app/components/                → Alle UI-Komponenten
/src/app/components/ui/             → shadcn/ui Basis-Komponenten
/src/hooks/                         → Custom Hooks (useDelayedUnmount, useNavigation, etc.)
/src/stores/                        → Zustandsspeicher (uploadRequestStore)
/src/styles/fonts.css               → Font-Imports + Weight-Mappings
/src/styles/theme.css               → CSS-Variablen, Tailwind-Theme
/src/styles/index.css               → Globale Styles, Zoom-Praevention
/src/app/components/SlideTransition.css → Slide-Animationen
/src/app/components/ScreenManager.css   → Screen-Transition-Animationen
```

### 12.2 Bibliotheken

| Paket | Verwendung |
|-------|------------|
| `react` + `react-dom` | UI-Framework |
| `lucide-react` | Icons |
| `recharts` | Charts (BarChart, etc.) |
| `pdf-lib` | PDF-Generierung (Download) |
| Tailwind CSS v4 | Utility-First CSS |

### 12.3 Naming Conventions

- Screen-Komponenten: `XxxScreen.tsx` oder `XxxScreenMobile.tsx`
- CSS-Animations-Prefix: `ka-` (Klassenarbeiten), `addTask-` etc.
- Props fuer Closing-Animation: `isClosing?: boolean`
- Props fuer Device: `isMobile?: boolean`

---

## 13. Zusammenfassung: Schnellreferenz

```
Hintergrund:     #0a0a0a
Card:            from-white/[0.04] to-white/[0.01], border-white/[0.06], rounded-[14px]
Input:           bg-white/[0.05], border-white/[0.08], rounded-xl, h-[44px]
Button:          bg-white/[0.06], border-white/[0.12], rounded-xl, h-[34px]
Hover (Desktop): hover:bg-white/[0.10]
Active (Mobile): active:bg-white/[0.04] bis active:bg-white/[0.10]
Font:            Poppins (400/500/600/700)
Easing:          cubic-bezier(0.4, 0.0, 0.2, 1)
Dauer:           300ms (Slides), 200ms (Fade-Ins), 150ms (Micro-Interactions)
Trennlinie:      h-px bg-white/[0.06], eingerueckt
Tap-Highlight:   WebkitTapHighlightColor: 'transparent'
Text primaer:    text-white
Text sekundaer:  text-white/70
Text dezent:     text-white/30-40
```
