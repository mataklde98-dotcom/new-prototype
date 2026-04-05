# Prompt für Original Figma Make Agent

**Kopiere diesen Text und füge ihn beim anderen Figma Make Agent ein:**

---

Hallo! Ich brauche deine Hilfe, um eine präzise Dokumentation der aktuellen Typography-Werte dieses Projekts zu erstellen.

## Aufgabe

Erstelle eine .md Datei namens `ORIGINAL_TYPOGRAPHY_VALUES.md`, die EXAKT dokumentiert, welche **Font-Weights, Font-Sizes, Button-Größen und Paddings** in folgenden Screens/Components aktuell verwendet werden:

## Zu dokumentierende Dateien

### Screens (Priority 1):
1. `/src/app/screens/HomeScreen.tsx`
2. `/src/app/screens/FlashcardsScreen.tsx`
3. `/src/app/screens/ExamScreen.tsx`
4. `/src/app/screens/CompletedExamsScreen.tsx`
5. `/src/app/screens/GenerateFlashcardsScreen.tsx`
6. `/src/app/screens/ProfileScreen.tsx`

### Components (Priority 2):
7. `/src/app/components/ExamCard.tsx`
8. `/src/app/components/FlashcardCard.tsx`
9. `/src/app/components/TodoCard.tsx` (falls vorhanden)

### Andere wichtige Screens (Priority 3):
10. `/src/app/screens/ChatScreen.tsx`
11. `/src/app/screens/SettingsScreen.tsx`
12. `/src/app/screens/LoginScreen.tsx`
13. `/src/app/screens/RegisterScreen.tsx`

---

## Format der Dokumentation

Für **JEDE Datei**, dokumentiere bitte:

### 1. Screen/Page Titel
```markdown
### HomeScreen.tsx

#### Screen-Titel (z.B. "Home", "Dashboard")
- **Selector:** Das HTML-Element oder className
- **Font-Family:** Welches Poppins-Variant wird verwendet?
  - Beispiel: `font-['Poppins:SemiBold',sans-serif]` oder `font-semibold`
- **Font-Size:** Exakte Größe
  - Beispiel: `text-[17px]` → 17px
- **Font-Weight:** Numerischer Wert
  - Beispiel: `font-semibold` → 600
- **Code-Zeile:** Der exakte className String aus dem Code
```

### 2. Sektions-Überschriften
```markdown
#### Sektions-Überschriften (z.B. "Your ToDo's", "AI Tools", "Recently used Flashcards")

**"Your ToDo's":**
- Font-Family: font-['Poppins:Bold',sans-serif]
- Font-Size: text-[20px] → 20px
- Font-Weight: 700
- Code: `className="font-['Poppins:Bold',sans-serif] text-[20px] text-white"`

**"AI Tools":**
- Font-Family: font-['Poppins:Bold',sans-serif]
- Font-Size: text-[18px] → 18px
- Font-Weight: 700
- Code: `className="..."`
```

### 3. Card-Titel
```markdown
#### Card-Titel (z.B. FlashcardCard Name, ExamCard Subject)

**Flashcard Card Title:**
- Font-Family: font-['Poppins:SemiBold',sans-serif]
- Font-Size: text-[14px] → 14px
- Font-Weight: 600
- Code: `className="..."`

**Exam Card Subject:**
- Font-Family: ...
- Font-Size: ...
- Font-Weight: ...
- Code: `className="..."`
```

### 4. Buttons
```markdown
#### Buttons

**Primary Button (z.B. "Start now", "Aufgabe hinzufügen"):**
- Font-Family: font-['Poppins:SemiBold',sans-serif]
- Font-Size: text-[16px] → 16px
- Font-Weight: 600
- Padding: px-6 py-3
- Height: h-[44px] (falls definiert)
- Code: `className="..."`

**Secondary Button:**
- Font-Family: ...
- Font-Size: ...
- Font-Weight: ...
- Padding: ...
- Code: `className="..."`

**Small Button/Chip:**
- Font-Family: ...
- Font-Size: ...
- Font-Weight: ...
- Padding: ...
- Code: `className="..."`
```

### 5. Body Text & Labels
```markdown
#### Body Text

**Standard Body:**
- Font-Size: text-[15px] → 15px
- Font-Weight: 400
- Code: `className="..."`

**Small Text:**
- Font-Size: text-[13px] → 13px
- Font-Weight: 400
- Code: `className="..."`

**Labels:**
- Font-Size: ...
- Font-Weight: ...
- Code: `className="..."`
```

### 6. Spezielle Elemente
```markdown
#### Spezielle Elemente (z.B. Stats, Badges, Timestamps)

**Grade Display (z.B. "1.3" in ExamCard):**
- Font-Family: font-['Poppins:Bold',sans-serif]
- Font-Size: text-[22px] → 22px
- Font-Weight: 700
- Code: `className="..."`

**Score Badge (z.B. "85%" in ExamCard):**
- Font-Family: ...
- Font-Size: ...
- Font-Weight: ...
- Code: `className="..."`

**Timestamp/Date:**
- Font-Size: ...
- Font-Weight: ...
- Code: `className="..."`
```

---

## Wichtig!

1. **Lies die Dateien tatsächlich** - verwende das `read` tool
2. **Kopiere die exakten className Strings** aus dem Code
3. **Konvertiere Tailwind-Classes in Werte:**
   - `text-[17px]` → 17px
   - `font-semibold` → 600
   - `font-bold` → 700
   - `px-6 py-3` → padding-x: 24px, padding-y: 12px
4. **Wenn font-['Poppins:XYZ',sans-serif] verwendet wird**, notiere das Variant:
   - `Poppins:Light` → 300
   - `Poppins:Regular` → 400
   - `Poppins:Medium` → 500
   - `Poppins:SemiBold` → 600
   - `Poppins:Bold` → 700

---

## Beispiel einer vollständigen Dokumentation

```markdown
# ORIGINAL_TYPOGRAPHY_VALUES.md
## Original Project Typography Documentation

### HomeScreen.tsx

#### Screen-Titel
- Element: `<h1>` oder Navigation Title
- Font-Family: font-['Poppins:SemiBold',sans-serif]
- Font-Size: 17px
- Font-Weight: 600
- Code: `className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white"`

#### Sektions-Überschrift: "Your ToDo's"
- Element: `<h2>`
- Font-Family: font-['Poppins:Bold',sans-serif]
- Font-Size: 20px
- Font-Weight: 700
- Code: `className="font-['Poppins:Bold',sans-serif] text-[20px] text-white mb-4"`

#### Sektions-Überschrift: "AI Tools"
- Element: `<h2>`
- Font-Family: font-['Poppins:Bold',sans-serif]
- Font-Size: 18px
- Font-Weight: 700
- Code: `className="font-['Poppins:Bold',sans-serif] text-[18px] text-white mb-3"`

#### Primary Button: "Start now"
- Font-Family: font-['Poppins:SemiBold',sans-serif]
- Font-Size: 16px
- Font-Weight: 600
- Padding: px-6 py-3 (24px horizontal, 12px vertical)
- Height: 44px (falls explizit definiert)
- Code: `className="px-6 py-3 font-['Poppins:SemiBold',sans-serif] text-[16px] text-white bg-[#5b5fef] rounded-xl"`

---

### FlashcardsScreen.tsx

#### Screen-Titel: "Flashcards"
- Element: ...
- Font-Family: ...
- Font-Size: ...
- Font-Weight: ...
- Code: `className="..."`

#### Card-Titel (FlashcardCard)
- Font-Family: ...
- Font-Size: ...
- Font-Weight: ...
- Code: `className="..."`

...
```

---

## Deine Aufgabe - Schritt für Schritt:

1. **Lese die oben genannten Dateien** mit dem `read` tool
2. **Suche nach wichtigen Text-Elementen:**
   - Alle `<h1>`, `<h2>`, `<h3>`, `<h4>` Tags
   - Alle `<button>` Tags
   - Card-Titel, Card-Subtitles
   - Labels, Body-Text
3. **Extrahiere className Strings**
4. **Dokumentiere sie im obigen Format**
5. **Erstelle die Datei:** `/ORIGINAL_TYPOGRAPHY_VALUES.md`

---

## Wichtige Hinweise:

- Sei **SEHR PRÄZISE** - jedes Pixel zählt!
- Wenn du **mehrere Varianten** eines Elements siehst (z.B. verschiedene Button-Größen), dokumentiere **ALLE**
- Wenn unsicher, kopiere einfach den **kompletten className String** aus dem Code
- **Ignoriere:** Colors, Backgrounds, Borders, Shadows (nur Typography interessiert uns)

---

Vielen Dank! Diese Dokumentation wird verwendet, um ein anderes Projekt zu korrigieren, das versehentlich zu dünne Schriften, verschiedene Schriftgrößen und verschiedene Buttongrößen usw. bekommen hat.
```
