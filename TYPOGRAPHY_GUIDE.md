# 🎨 SoStudy Typography Guide
**Vollständige Dokumentation aller Schriftarten, -größen und -gewichte**

Version: 1.0.0  
Letzte Aktualisierung: Februar 2025  
Design System: Apple Vision Pro Style 2026 mit Glasmorphism

---

## 📋 Inhaltsverzeichnis

1. [Globale Font-Einstellungen](#globale-font-einstellungen)
2. [Standard HTML-Elemente](#standard-html-elemente)
3. [Navigations-Bereiche](#navigations-bereiche)
4. [Screen Headers](#screen-headers)
5. [Content-Bereiche](#content-bereiche)
6. [Buttons & Interactive Elements](#buttons--interactive-elements)
7. [Form Elements](#form-elements)
8. [Cards & Lists](#cards--lists)
9. [Modals & Overlays](#modals--overlays)
10. [Chat & Messaging](#chat--messaging)
11. [Exam System](#exam-system)
12. [Tailwind Typography Utilities](#tailwind-typography-utilities)

---

## 🌍 Globale Font-Einstellungen

### Primary Font Family
```css
font-family: 'Poppins', sans-serif
```

**Hinweis:** Poppins ist die Standard-Schriftart der gesamten App. Sie wird über Tailwind und inline-styles definiert.

### Font Size Base
```css
--font-size: 16px; /* Root size */
```

### Font Weights
```css
--font-weight-normal: 400;  /* Regular */
--font-weight-medium: 500;  /* Medium */
```

**Verwendete Font-Weight-Varianten:**
- `font-['Poppins:Light',sans-serif]` → **300** (Light)
- `font-['Poppins:Regular',sans-serif]` → **400** (Regular/Normal)
- `font-['Poppins:Medium',sans-serif]` → **500** (Medium)
- `font-['Poppins:SemiBold',sans-serif]` → **600** (SemiBold)
- `font-['Poppins:Bold',sans-serif]` → **700** (Bold)

---

## 📐 Standard HTML-Elemente

### H1 (Heading 1)
```css
font-size: var(--text-2xl);
font-weight: var(--font-weight-medium); /* 500 */
line-height: 1.5;
```
**Verwendung:** Hauptüberschriften, Page-Titel

---

### H2 (Heading 2)
```css
font-size: var(--text-xl);
font-weight: var(--font-weight-medium); /* 500 */
line-height: 1.5;
```
**Verwendung:** Sektions-Titel, Unter-Überschriften

---

### H3 (Heading 3)
```css
font-size: var(--text-lg);
font-weight: var(--font-weight-medium); /* 500 */
line-height: 1.5;
```
**Verwendung:** Kleine Überschriften, Card-Titel

---

### H4 (Heading 4)
```css
font-size: var(--text-base);
font-weight: var(--font-weight-medium); /* 500 */
line-height: 1.5;
```
**Verwendung:** Mini-Überschriften, Labels

---

### Labels
```css
font-size: var(--text-base);
font-weight: var(--font-weight-medium); /* 500 */
line-height: 1.5;
```
**Verwendung:** Form-Labels, Beschriftungen

---

### Buttons
```css
font-size: var(--text-base);
font-weight: var(--font-weight-medium); /* 500 */
line-height: 1.5;
```
**Verwendung:** Standard-Buttons

---

### Inputs
```css
font-size: var(--text-base);
font-weight: var(--font-weight-normal); /* 400 */
line-height: 1.5;
```
**Verwendung:** Text-Inputs, Textareas

---

## 🧭 Navigations-Bereiche

### Mobile Navigation Header
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 17px
font-weight: 600
color: white
letter-spacing: -0.3px
```
**Beispiel:** Screen-Titel in Mobile Navigation

---

### Breadcrumb Items
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 11.5px
font-weight: 500
transition: all 300ms
```

**States:**
- **Inactive:** `rgba(255, 255, 255, 0.5)`
- **Active:** `rgba(255, 255, 255, 0.95)`
- **Hover:** `rgba(255, 255, 255, 1.0)`

---

### Sidebar Menu Items
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 14px
font-weight: 500
```

**States:**
- **Inactive:** `rgba(255, 255, 255, 0.6)`
- **Active/Hover:** `rgba(255, 255, 255, 0.95)`

---

## 📱 Screen Headers

### Mobile Screen Title (Standard)
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 17px
font-weight: 600
color: white
line-height: tight
```
**Beispiel:** "Abgeschlossene Prüfungen", "Profileinstellungen"

---

### Desktop Page Title
```tsx
font-family: 'Poppins:Bold', sans-serif
font-size: 20px
font-weight: 700
color: white
letter-spacing: -0.5px
```
**Beispiel:** Chat-Screen Desktop Header

---

### Subtitle / Description
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 14px
font-weight: 400
color: rgba(255, 255, 255, 0.6)
```
**Beispiel:** "Erstelle deine eigenen Karteikarten"

---

## 📄 Content-Bereiche

### Body Text (Standard)
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 15px
font-weight: 400
line-height: 20px
color: white
```

---

### Small Body Text
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 13px
font-weight: 400
color: rgba(255, 255, 255, 0.6)
```

---

### Micro Text / Captions
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 11px
font-weight: 500
color: rgba(255, 255, 255, 0.4)
```

---

### Labels / Tags
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 11px
font-weight: 500
text-transform: uppercase
letter-spacing: 0.06em
color: #8E8E93
```
**Beispiel:** "TELEFONNUMMER", "BUNDESLAND"

---

## 🔘 Buttons & Interactive Elements

### Primary Button
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 16px
font-weight: 600
color: white
```

---

### Secondary Button
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 15px
font-weight: 500
color: white
```

---

### Small Button / Chip
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 12px
font-weight: 500
```

---

### Icon Button Label
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 13px
font-weight: 500
```

---

### Link / Action Text
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 14px
font-weight: 500
color: #4cadfd (Blue)
transition: all 200ms
```

---

## 📝 Form Elements

### Input Label
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 13px
font-weight: 500
color: rgba(255, 255, 255, 0.7)
```

---

### Input Field
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 15px
font-weight: 400
line-height: 20px
color: white
placeholder: rgba(255, 255, 255, 0.3)
```

---

### Input Helper Text
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 12px
font-weight: 400
color: rgba(255, 255, 255, 0.5)
```

---

### Dropdown Selected Value
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 15px
font-weight: 400
color: white
```

---

### Dropdown Placeholder
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 15px
font-weight: 400
color: rgba(255, 255, 255, 0.3)
```

---

### Character Counter
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 11px
font-weight: 500
color: rgba(255, 255, 255, 0.5)
```
**Beispiel:** "45/60"

---

## 🎴 Cards & Lists

### Card Title
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 14px
font-weight: 600
line-height: 19px
color: white
```

---

### Card Subtitle / Meta Info
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 11px
font-weight: 500
line-height: 15px
color: #979797
```

---

### Card Badge / Tag
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 10px
font-weight: 600
padding: 2px 6px
border-radius: 9999px
```

---

### Card Stats (Large)
```tsx
font-family: 'Poppins:Bold', sans-serif
font-size: 22px
font-weight: 700
line-height: none
```
**Beispiel:** Note (z.B. "1.3")

---

### Card Stats (Small)
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 12px
font-weight: 600
```
**Beispiel:** Score (z.B. "85%")

---

### Card Date/Time
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 10px
font-weight: 500
color: #707070
```

---

### List Item Title
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 16px
font-weight: 600
color: white
```

---

### List Item Subtitle
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 14px
font-weight: 400
color: rgba(255, 255, 255, 0.5)
```

---

## 📦 Modals & Overlays

### Modal Title
```tsx
font-family: 'Poppins:Bold', sans-serif
font-size: 22px
font-weight: 700
color: white
```

---

### Modal Subtitle
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 14px
font-weight: 400
color: #b3b3b3
```

---

### Bottom Sheet Title
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 17px
font-weight: 600
color: white
```

---

### Toast / Notification Text
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 13px
font-weight: 500
color: white
```

---

### Alert Title
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 18px
font-weight: 600
color: white
```

---

### Alert Message
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 14px
font-weight: 400
color: rgba(255, 255, 255, 0.7)
```

---

## 💬 Chat & Messaging

### Chat Room Name
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 17px
font-weight: 600
color: white
letter-spacing: -0.3px
truncate: true
```

---

### Chat Status (Online)
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 13px
font-weight: 400
color: #00D4AA
```

---

### Chat Status (Offline)
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 13px
font-weight: 400
color: rgba(255, 255, 255, 0.5)
```

---

### Chat Message Text
```tsx
font-family: 'Poppins', sans-serif
font-size: 15px
font-weight: 400
line-height: 20px
color: white
```

---

### Chat Timestamp
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 12px
font-weight: 400
color: rgba(255, 255, 255, 0.4)
```

---

### Chat Room List Item Title
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 16px
font-weight: 600
color: white
letter-spacing: -0.3px
truncate: true
```

---

### Chat Room List Item Preview
```tsx
font-family: 'Poppins:Regular', sans-serif
font-size: 14px
font-weight: 400
color: rgba(255, 255, 255, 0.5)
truncate: true
```

---

### Unread Count Badge
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 11px
font-weight: 600
color: white
background: gradient
```

---

## 🎓 Exam System

### Exam Card Subject Name
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 14px
font-weight: 600
line-height: 19px
color: white
truncate: true
```

---

### Exam Card Topic Info
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 11px
font-weight: 500
line-height: 15px
color: #979797
transition: colors 200ms
```

**Hover State:**
```tsx
color: #4cadfd
```

---

### Exam Grade (Large Display)
```tsx
font-family: 'Poppins:Bold', sans-serif
font-size: 22px
font-weight: 700
line-height: none
color: dynamic /* Based on grade */
```

**Grade Colors:**
- **1.0-2.0:** `#00d4aa` (Green)
- **2.1-3.0:** `#4cadfd` (Blue)
- **3.1-4.0:** `#ffa500` (Orange)
- **4.1-6.0:** `#ff4444` (Red)

---

### Exam Score Badge
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 12px
font-weight: 600
color: dynamic /* Based on score */
```

---

### Exam Stats Small
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 11px
font-weight: 500
color: #979797
```
**Beispiel:** "15/20" (Richtige Antworten)

---

### Exam Date/Time
```tsx
font-family: 'Poppins:Medium', sans-serif
font-size: 10px
font-weight: 500
color: #707070
```

---

### Exam Badge (Mode/Status)
```tsx
font-family: 'Poppins:SemiBold', sans-serif
font-size: 10px
font-weight: 600
padding: 2px 6px
border-radius: 9999px
background: dynamic
```

---

## 🎨 Tailwind Typography Utilities

### Font Size Classes (Verfügbar)
```css
text-xs    → 0.75rem (12px)
text-sm    → 0.875rem (14px)
text-base  → 1rem (16px)
text-lg    → 1.125rem (18px)
text-xl    → 1.25rem (20px)
text-2xl   → 1.5rem (24px)
text-3xl   → 1.875rem (30px)
text-4xl   → 2.25rem (36px)
```

---

### Font Weight Classes
```css
font-light     → 300
font-normal    → 400
font-medium    → 500
font-semibold  → 600
font-bold      → 700
```

---

### Line Height Classes
```css
leading-none    → 1
leading-tight   → 1.25
leading-snug    → 1.375
leading-normal  → 1.5
leading-relaxed → 1.625
leading-loose   → 2
```

---

### Letter Spacing Classes
```css
tracking-tighter → -0.05em
tracking-tight   → -0.025em
tracking-normal  → 0
tracking-wide    → 0.025em
tracking-wider   → 0.05em
tracking-widest  → 0.1em
```

---

## 🎯 Farb-Konventionen

### Text Colors
```css
text-white              → rgba(255, 255, 255, 1.0)
text-white/90           → rgba(255, 255, 255, 0.9)
text-white/70           → rgba(255, 255, 255, 0.7)
text-white/60           → rgba(255, 255, 255, 0.6)
text-white/50           → rgba(255, 255, 255, 0.5)
text-white/40           → rgba(255, 255, 255, 0.4)
text-white/30           → rgba(255, 255, 255, 0.3)
```

---

### Brand Colors (Text)
```css
text-[#00D4AA]  → SoStudy Green (Primary)
text-[#4cadfd]  → SoStudy Blue (Accent)
text-[#8E8E93]  → Gray (Labels)
text-[#979797]  → Gray (Meta Info)
text-[#707070]  → Gray (Disabled)
text-[#b3b3b3]  → Light Gray (Secondary)
```

---

## 📐 Spacing & Layout

### Mobile Content Spacing
```css
padding-x: 16px (Standard)
padding-y: 20px (Standard)
gap: 12px (Standard zwischen Elementen)
```

---

### Desktop Content Spacing
```css
padding-x: 24px
padding-y: 24px
gap: 16px
```

---

## 🔍 Best Practices

### ✅ DO's
1. **Poppins als Standard-Font** für alle Texte verwenden
2. **Font-Weight:** Medium (500) für Buttons/Labels, Regular (400) für Body-Text
3. **Konsistente Font-Sizes:** 10px, 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 20px, 22px
4. **Letter-Spacing:** `-0.3px` bis `-0.5px` für Headlines (Apple-Style)
5. **Line-Height:** `1.5` für bessere Lesbarkeit
6. **Opacity-Abstufungen:** 30%, 40%, 50%, 60%, 70%, 90%, 100%

---

### ❌ DON'Ts
1. **Keine anderen Font-Families** außer Poppins verwenden
2. **Keine ungeraden Font-Sizes** (z.B. 13.5px, 14.3px)
3. **Keine festen Farb-Werte** ohne Opacity (immer rgba verwenden)
4. **Kein Font-Weight unter 300** (zu dünn für Glasmorphism)
5. **Keine Line-Height unter 1.2** (schlecht lesbar)

---

## 📱 Responsive Typography

### Mobile (< 768px)
```tsx
Headers: 17px - 20px
Body: 14px - 15px
Small: 11px - 13px
Micro: 10px
```

---

### Desktop (≥ 768px)
```tsx
Headers: 20px - 24px
Body: 15px - 16px
Small: 13px - 14px
Micro: 11px
```

---

## 🎨 Accessibility

### WCAG 2.1 Konformität
- **Mindest-Kontrast:** 4.5:1 für normalen Text
- **Großer Text (≥18px):** 3:1 Kontrast ausreichend
- **Body-Text Minimum:** 14px (besser 15px)
- **Touch-Targets:** Mindestens 44x44px

---

### Font-Smoothing
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```
**Wird global in `theme.css` angewendet**

---

## 📚 Beispiel-Implementierungen

### Mobile Screen Header
```tsx
<h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white leading-tight">
  Screen Title
</h1>
```

---

### Card Title mit Meta Info
```tsx
<div>
  <h3 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white leading-[19px]">
    Flashcard Set Title
  </h3>
  <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797] leading-[15px]">
    Mathematik • 24 Karten
  </p>
</div>
```

---

### Input mit Label
```tsx
<div>
  <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 mb-2">
    Email-Adresse
  </label>
  <input 
    type="email"
    placeholder="mail@example.com"
    className="font-['Poppins:Regular',sans-serif] text-[15px] text-white placeholder:text-white/30"
  />
</div>
```

---

### Button Primary
```tsx
<button className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white">
  Speichern
</button>
```

---

## 🔄 Updates & Changelog

### Version 1.0.0 (Februar 2025)
- ✅ Initiale Dokumentation erstellt
- ✅ Alle Bereiche der App dokumentiert
- ✅ Best Practices definiert
- ✅ Accessibility-Guidelines hinzugefügt

---

## 📞 Support

Bei Fragen zur Typography:
- **Design System Lead:** SoStudy Design Team
- **Figma File:** SoStudy Main App (Apple Vision Pro Style 2026)
- **Tech Stack:** React + Tailwind CSS v4 + Poppins Font

---

**Made with ❤️ by SoStudy Team**  
*Ultra-Clean Architecture • Apple Vision Pro Style 2026*
