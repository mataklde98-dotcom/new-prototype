# SoStudy Design System Reference

Dieses Dokument beschreibt das komplette Design-System der SoStudy-App.
Verwende es als Referenz, um ein visuell identisches Projekt in Figma Make aufzusetzen.

---

## 1. Grundlagen

### Stil-Philosophie
- **Premium Flat SaaS** inspiriert von Linear, Vercel, Raycast
- Kein Skeuomorphismus, keine Schatten-Orgien, kein Neon-Glow
- Subtiler Glassmorphismus auf `#0a0a0a`-Hintergrund
- Augenfreundlich: Niedrige Kontraste, gedaempfte Transparenzen
- Mobile-First PWA (iOS-optimiert), responsive Desktop-Layout mit Sidebar

### Hintergrundfarbe
```
#0a0a0a (global, einheitlich fuer ALLE Screens)
```

### Schriftart
```
Poppins (Google Fonts) - alle Weights 100-900
Import: @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap')
```

### Poppins-Weight-Helper (Tailwind-Syntax)
```css
font-['Poppins:Regular',sans-serif]   /* 400 */
font-['Poppins:Medium',sans-serif]    /* 500 */
font-['Poppins:SemiBold',sans-serif]  /* 600 */
font-['Poppins:Bold',sans-serif]      /* 700 */
```

Alternativ als JS-Helper:
```tsx
const poppins = (weight: string) => `font-['Poppins:${weight}',sans-serif]`;
// Nutzung: className={`${poppins('SemiBold')} text-[14px] text-white`}
```

---

## 2. Farbsystem

### Primaerfarben
| Name | Hex | Verwendung |
|------|-----|-----------|
| Hintergrund | `#0a0a0a` | Globaler App-Background |
| Akzent Gruen | `#00B894` | CTA-Buttons, Selection-Cards, Step-Indicators |
| Akzent Gruen (heller) | `#00D4AA` | Status-Texte, Badges, Trend-Indikatoren |
| Akzent Gruen (dunkler) | `#009379` | Tab-Hintergruende, Gradient-Start |
| Akzent Gruen (dunkelster) | `#007a63` | Gradient-End fuer aktive Tabs |

### Text-Farben (RGBA-basiert, NICHT hex)
```
Primaer:        rgba(255, 255, 255, 0.9)   oder text-white
Sekundaer:      rgba(255, 255, 255, 0.7)   oder text-white/70
Tertiaer:       rgba(255, 255, 255, 0.5)
Quaternaer:     rgba(255, 255, 255, 0.4)   oder text-white/40
Gedaempft:      rgba(255, 255, 255, 0.3)   oder text-white/30
Minimal:        rgba(255, 255, 255, 0.2)   oder text-white/20
```

### Lernaktivitaeten-Farben (Leistungs-Tab)
| Aktivitaet | Farbe | Icon (Lucide) |
|-----------|-------|---------------|
| Karteikarten Lernsimulator | `#4A9EFF` (Blau) | `Layers` |
| Pruefungssimulation | `#FF8C00` (Orange) | `ClipboardCheck` |
| Lernassistent | `#00D4AA` (Gruen) | `Sparkles` |

### Funktionsfarben
```
Erfolg:         #00D4AA / #CCEABB
Warnung:        #FF8C00
Kritisch:       #FF4757
Lila (Hilfe):   HelpCircle-Button-Farbe
```

---

## 3. Komponenten-Bibliothek

### 3.1 Button (Systemweit)

Der **einzige** CTA-Button-Style in der gesamten App:

```tsx
// Aktiv-State:
background: rgba(0, 184, 148, 0.07)     // Gruener Glassmorphismus
border: 1px solid rgba(0, 184, 148, 0.25)
color: rgba(255, 255, 255, 0.9)

// Disabled-State:
background: rgba(255, 255, 255, 0.04)
border: 1px solid rgba(255, 255, 255, 0.06)
opacity: 0.3

// Interaction:
active:scale-[0.98]                      // Tap-Feedback
transition-all duration-200
WebkitTapHighlightColor: transparent
willChange: transform
transform: translateZ(0)                 // GPU-Promotion
```

**Groessen:**
```
xs: px-4 py-1.5 rounded-xl text-[12px]   // Pill-Buttons
sm: h-[38px] rounded-xl text-[14px]      // Kleine CTAs
md: h-[46px] rounded-2xl text-[16px]     // Standard (Default)
lg: h-[52px] rounded-2xl text-[16px]     // Grosse CTAs
```

### 3.2 CloseButton

```tsx
// Einheitlich 42x42px, runder Glass-Style:
bg-white/[0.06]
border border-white/[0.08]
active:bg-white/[0.1] active:border-white/[0.2]
rounded-full size-[42px]
// X-Icon: 16x16px, Farbe #999
```

### 3.3 Card (Basis-Pattern)

```tsx
// Standard-Karte:
background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)
border: 1px solid rgba(255,255,255,0.06)
border-radius: 14px (rounded-[14px]) oder 16px (rounded-2xl)

// Expanded/Active Card:
background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)
border: 1px solid {subjectColor}30     // Farbig mit 30% Opacity

// Glassmorphismus-Variante (Buttons):
bg-gradient-to-br from-white/[0.05] to-white/[0.02]
border border-white/[0.08]
```

### 3.4 Input / TextField (VisionPro-Style)

```tsx
// Container:
bg-white/[0.04]
border: border-white/[0.08]
rounded-xl
px-4 py-3.5

// Focus-State:
border-color: #009379

// Text:
text-white/80 (Eingabe)
placeholder-white/20 oder placeholder-white/30

// Label (ueber Input):
text-[11px] text-[#8E8E93] uppercase tracking-[0.06em]
```

### 3.5 NativeSelect (Dropdown)

```tsx
bg-white/[0.04]
border border-white/[0.08]
rounded-xl
text-[14px]
// Focus: border-white/[0.18] bg-white/[0.06]
// Chevron-Icon rechts: text-white/30
// colorScheme: 'dark' (fuer native Dark-Mode-Optionen)
```

### 3.6 Checkbox

```tsx
// Unchecked: border-2 border-white/30, transparent bg
// Checked:   bg-white/20 border-white/60, weisser Checkmark
// Groessen: sm (16px), md (20px), lg (24px)
```

### 3.7 Tabs (PremiumTabs)

```tsx
// Container:
bg-white/[0.03]
border border-white/[0.08]
rounded-lg p-1

// Inaktiver Tab:
text-white/40
hover:text-white/70

// Aktiver Tab:
text-white
background: gradient from-[#009379] to-[#007a63]
// + Subtle Glow: radial-gradient(circle, rgba(0,147,121,0.3), transparent 70%)
```

### 3.8 Bottom Navigation (Mobile)

```tsx
height: 61.268px
border-radius: 34px
background: rgba(21, 21, 21, 0.9)
box-shadow: inset 0 0 0 0.657px rgba(255, 255, 255, 0.1)
// Icons: 22px, Lucide
// Label: Poppins 10px
// Aktiv: weiss, Inaktiv: rgba(255,255,255,0.45)
// Hide on Scroll: translateY mit 300ms ease
```

### 3.9 Badge / Pill

```tsx
// Gruen-Badge (z.B. "Als Naechstes"):
text-[8px] px-1.5 py-px rounded-full
color: #00D4AA
background: rgba(0,212,170,0.12)
border: 1px solid rgba(0,212,170,0.20)
```

### 3.10 Progress Bar

```tsx
// Track:
h-[6px] rounded-full bg-white/[0.06]

// Fill:
rounded-full
// Einfarbig oder Gradient:
background: linear-gradient(90deg, {color}, {lighterColor})
```

---

## 4. Typografie-Scale

```
text-[8px]   - Micro-Badges
text-[10px]  - Hinweise, Timestamps, Quartaere Info
text-[11px]  - Labels, Sekundaere Info, Uppercase-Labels
text-[12px]  - Button-Text (xs), Karten-Subtexte
text-[13px]  - Tab-Labels, Card-Titel
text-[14px]  - Standard-Body, Input-Text
text-[16px]  - H4, Button-Text (md/lg), Grosse Labels
text-[18px]  - H3, Section-Titel
text-[20px]  - H2, Screen-Titel
text-[24px]  - H1, Hero-Titel
```

---

## 5. Spacing-System

```
gap/padding Einheiten (Tailwind):
1    = 4px
1.5  = 6px
2    = 8px
2.5  = 10px
3    = 12px
3.5  = 14px
4    = 16px
5    = 20px
6    = 24px

Typische Patterns:
- Card-Padding: p-3.5 oder p-4
- Section-Abstand: space-y-4 oder space-y-6
- Karten untereinander: space-y-2 oder space-y-2.5
- Screen-Padding (Mobile): px-5
- Screen-Padding (Desktop): px-6 oder px-8
```

---

## 6. Animationen & Transitions

### 6.1 Material Design Easing
```
Standard:  cubic-bezier(0.4, 0.0, 0.2, 1)   // 300ms
Oder als Array fuer motion: [0.4, 0.0, 0.2, 1]
```

### 6.2 Screen-Transitions (CSS, GPU-optimiert)

Alle Overlay-Screens verwenden `ReactDOM.createPortal` und reine CSS-Animationen:

```css
.screen {
  position: fixed;
  inset: 0;
  background: #0a0a0a;
  
  /* GPU-Promotion */
  will-change: transform;
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  contain: layout style paint;
  
  /* Animation */
  transition: transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* Slide from Right */
@keyframes slideInFromRight {
  from { transform: translateX(100%) translateZ(0); }
  to   { transform: translateX(0) translateZ(0); }
}

/* Slide out to Right */
@keyframes slideOutToRight {
  from { transform: translateX(0) translateZ(0); }
  to   { transform: translateX(100%) translateZ(0); }
}
```

### 6.3 useDelayedUnmount Hook

Two-State Mount/Unmount fuer Exit-Animationen:

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

// Nutzung:
const isMounted = useDelayedUnmount(showScreen, 300);
// isMounted = true waehrend der Exit-Animation
// Nach 300ms wird die Komponente unmounted
```

### 6.4 Expandable Content (motion/react)

```tsx
import { motion } from 'motion/react';

<motion.div
  initial={false}
  animate={{
    height: isExpanded ? 'auto' : 0,
    opacity: isExpanded ? 1 : 0,
  }}
  transition={{
    duration: 0.4,
    ease: [0.4, 0.0, 0.2, 1],
  }}
  className="overflow-hidden"
  style={{
    willChange: 'height, opacity',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
  }}
>
  {/* Content */}
</motion.div>
```

### 6.5 Tab-Slide-Animationen (CSS)

```css
@keyframes tabSlideFromRight {
  from { transform: translateX(100%) translateZ(0); opacity: 1; }
  to   { transform: translateX(0) translateZ(0); opacity: 1; }
}

@keyframes tabSlideFromLeft {
  from { transform: translateX(-100%) translateZ(0); opacity: 1; }
  to   { transform: translateX(0) translateZ(0); opacity: 1; }
}

@keyframes tabFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### 6.6 Modal-Animationen

```
Mobile:  Slide from Right (identisch zu Screen-Transitions)
Desktop: Scale + Fade (scale 0.96 -> 1.0, opacity 0 -> 1)
```

### 6.7 Side-Panel (Chat History Style)

```css
/* Backdrop */
background: rgba(0, 0, 0, 0.55)
transition: background 300ms

/* Panel */
width: 82%, max-width: 340px
background: #111111
border-left: 1px solid rgba(255, 255, 255, 0.06)
transform: translateX(100%) -> translateX(0)
```

---

## 7. GPU-Performance-Regeln

1. **Nur `transform` und `opacity` animieren** - keine `width`, `height`, `top`, `left`
2. **`will-change: transform` immer aktiv** (kein dynamisches Togglen)
3. **`transform: translateZ(0)`** auf allen animierten Elementen
4. **`contain: layout style paint`** auf Screen-Wrappern
5. **`-webkit-backface-visibility: hidden`** gegen Flicker
6. **`isolation: isolate`** auf Buttons mit z-index
7. **Reduced Motion respektieren:**
   ```css
   @media (prefers-reduced-motion: reduce) {
     transition-duration: 1ms !important;
     animation-duration: 1ms !important;
   }
   ```

---

## 8. iOS PWA Patterns

### Safe Area Insets
```css
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
}
```

### Zoom Prevention
```css
* {
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

/* Inputs muessen text-selection erlauben */
input, textarea { -webkit-user-select: text; user-select: text; }

/* iOS Auto-Zoom Prevention */
@supports (-webkit-touch-callout: none) {
  input, textarea, select { font-size: max(1em, 16px); }
}
```

### Native App Feel
```css
html, body {
  touch-action: manipulation;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
  position: fixed;
  width: 100%; height: 100%;
  overflow: hidden;
}
```

### Tap Highlight
```tsx
style={{ WebkitTapHighlightColor: 'transparent' }}
// Auf ALLEN klickbaren Elementen setzen
```

---

## 9. Scrollbar-System

```css
/* Global: Duenne, transparente Scrollbar */
scrollbar-width: thin;
scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

/* Webkit */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }

/* .scrollbar-hide - Komplett versteckt (Tab-Bars etc.) */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { scrollbar-width: none; }
```

---

## 10. Layout-Architektur

### Mobile
```
[MobileHeader]        - Profilbild, Name, Fortschrittsbalken
[Screen Content]      - Scrollbar Bereich (flex-1 overflow-y-auto)
[MobileNavigation]    - Floating Bottom Bar (34px Radius, 5 Tabs)
```

### Desktop
```
[ModernSidebar]       - Links, collapsible (erweiterbar)
[DesktopContentWrapper] - Rechts, flex-1
  [DesktopPageHeader] - Breadcrumbs, Search, Tabs
  [Content]           - Grid/Listen
  [BottomBar]         - Pagination + Create-Button
```

### Screen-Management
- **ScreenManager** (CSS-basiert): Hauptnavigation zwischen Tabs
- **ModalManager** (CSS-basiert): Overlay-Screens (Mobile: Slide, Desktop: Scale)
- **createPortal**: Alle Overlays via `ReactDOM.createPortal(jsx, document.body)`
- **useDelayedUnmount**: Exit-Animation abwarten vor Unmount

---

## 11. Expandable Listen ("Mehr anzeigen")

Pattern fuer Listen mit 2+ sichtbaren Items und expandierbarem Rest:

```tsx
<div>
  {/* Immer sichtbare Items */}
  <div className="space-y-2">
    {items.slice(0, 2).map(item => <Card key={item.id} />)}
  </div>

  {/* Expandierbare Items + Button */}
  {items.length > 2 && (
    <>
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
        className="overflow-hidden"
        style={{ willChange: 'height, opacity', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      >
        <div className="space-y-2 mt-2">
          {items.slice(2).map(item => <Card key={item.id} />)}
        </div>
      </motion.div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative w-full bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-[14px] h-[44px] flex items-center justify-center gap-2 border border-white/[0.08] active:scale-[0.98] transition-all duration-200 mt-2"
      >
        <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/70">
          {isExpanded ? 'Weniger anzeigen' : `Mehr anzeigen (${items.length - 2})`}
        </span>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}>
          <ChevronDown className="w-3.5 h-3.5 text-white/70" />
        </motion.div>
      </button>
    </>
  )}
</div>
```

**Wichtig:** Die `motion.div` und der Button muessen AUSSERHALB des `space-y-*` Containers liegen, damit die kollabierte `motion.div` (height: 0) keinen extra Abstand erzeugt.

---

## 12. Icon-Library

**Lucide React** (`lucide-react`) - durchgaengig verwendet.

Haeufig genutzte Icons:
```
Navigation:   Home, CalendarClock, MessageCircle, Sparkles, User
Actions:      ChevronDown, ChevronRight, ChevronLeft, ArrowLeft, X
Status:       CheckCircle2, AlertTriangle, TrendingUp, TrendingDown
Content:      BookOpen, FileText, Brain, Layers, GraduationCap
UI:           Search, Bell, Settings, Edit3, Trash2, Send, Copy
Special:      Flame (Streak), Target, Award, Clock, Headset, HelpCircle
```

---

## 13. Wichtige NPM-Pakete

```json
{
  "motion": "^11.x",           // Animationen (import from 'motion/react')
  "lucide-react": "^0.x",      // Icons
  "recharts": "^2.x",          // Charts & Graphen
  "react-router": "^7.x",      // Routing (NICHT react-router-dom)
  "sonner": "^1.x"             // Toast-Notifications
}
```

---

## 14. Checkliste fuer neues Projekt

- [ ] Background `#0a0a0a` setzen
- [ ] Poppins Font importieren (alle Weights)
- [ ] `fonts.css` mit Weight-Helper-Klassen anlegen
- [ ] Theme-Variablen in `theme.css` definieren
- [ ] iOS PWA CSS (touch-action, overscroll, safe-area) einrichten
- [ ] Scrollbar-System (duenn + hide-Klasse) einrichten
- [ ] `Button`-Komponente mit gruenem Glassmorphismus erstellen
- [ ] `CloseButton`-Komponente (42px, rund, glass) erstellen
- [ ] `useDelayedUnmount` Hook anlegen
- [ ] ScreenManager/SlideTransition CSS anlegen
- [ ] `motion` Paket installieren
- [ ] `lucide-react` installieren
- [ ] `WebkitTapHighlightColor: transparent` auf alle Buttons
- [ ] `will-change` + `translateZ(0)` auf animierte Elemente
- [ ] `prefers-reduced-motion` Media Queries einbauen
