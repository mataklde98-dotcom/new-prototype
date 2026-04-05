# 🎯 VS Code Claude - Font Weight & Size Correction Instructions

**WICHTIG:** Dieses Dokument enthält präzise Anweisungen zur Korrektur der Typography. Folge EXAKT diesen Anweisungen ohne zusätzliche Änderungen!

---

## 🚨 Problem-Beschreibung

Das aktuelle Projekt hat durch eine vorherige Säuberung **zu dünne Schriften** erhalten. Vergleiche die beiden Screenshots:

- **Screenshot 1 (AKTUELL - FALSCH):** Schriften sind zu dünn, Text wirkt leicht/schwach
- **Screenshot 2 (ORIGINAL - KORREKT):** Schriften sind kräftiger, Text wirkt bold/gewichtig

**Deine Aufgabe:** Stelle die **originalen Font-Weights, Font-Sizes und Button-Größen** wieder her, ohne die Code-Architektur zu verändern.

---

## ✅ WAS DU ÄNDERN DARFST

### 1. Font-Weights (Schriftstärke)

**Korrigiere folgende Font-Weight-Fehler:**

#### Überschriften (Headings)
```tsx
// ❌ FALSCH (aktuell):
className="font-normal"              // font-weight: 400
className="font-medium"              // font-weight: 500
className="font-['Poppins:Regular',sans-serif]"

// ✅ KORREKT (muss sein):
className="font-semibold"            // font-weight: 600
className="font-bold"                // font-weight: 700
className="font-['Poppins:SemiBold',sans-serif]"
className="font-['Poppins:Bold',sans-serif]"
```

**Regel:** Alle **Hauptüberschriften, Sektions-Titel, Screen-Titel** verwenden:
- **SemiBold (600)** oder **Bold (700)**
- Beispiele: "Your ToDo's", "AI Tools", "Recently used Flashcards", "Karteikarten"

---

#### Card-Titel & Content-Titel
```tsx
// ❌ FALSCH:
className="font-normal text-[14px]"
className="font-medium text-[14px]"

// ✅ KORREKT:
className="font-semibold text-[14px]"
className="font-['Poppins:SemiBold',sans-serif] text-[14px]"
```

**Regel:** Card-Titel wie "Ableitungen - Grundlagen", "Grammar - Present Perfect" verwenden **SemiBold (600)**

---

#### Buttons
```tsx
// ❌ FALSCH:
className="font-medium text-[15px]"

// ✅ KORREKT:
className="font-semibold text-[16px]"
className="font-['Poppins:SemiBold',sans-serif] text-[16px]"
```

**Regel:** Alle primären Buttons ("Start now", "Aufgabe hinzufügen", etc.) verwenden:
- **Font-Weight:** SemiBold (600)
- **Font-Size:** 16px (nicht 15px!)

---

### 2. Font-Sizes (Schriftgrößen)

**Vergleiche Original-Screenshots und korrigiere abweichende Größen:**

| Element | Aktuell (FALSCH) | Original (KORREKT) |
|---------|------------------|-------------------|
| Screen-Titel | text-[15px] | text-[17px] |
| Sektions-Überschriften | text-[16px] | text-[18px] - text-[20px] |
| Card-Titel | text-[13px] | text-[14px] |
| Button-Text | text-[15px] | text-[16px] |
| Body-Text | text-[14px] | text-[15px] |
| Small Text | text-[12px] | text-[13px] |

**Regel:** Schaue dir das Original-Projekt an und übernimm die **exakten px-Werte**!

---

### 3. Button-Größen & Padding

**Buttons sind möglicherweise zu klein geworden. Prüfe:**

```tsx
// Primary Buttons (z.B. "Start now")
// Original hatte wahrscheinlich:
className="px-6 py-3"          // Größeres Padding
className="h-[44px]"           // Größere Höhe
className="min-h-[44px]"       // Touch-Target

// Stelle sicher, dass Buttons "anfassbar" sind!
```

**Regel:** Vergleiche Button-Größen mit dem Original. Buttons sollten **mindestens 44px Höhe** haben (Apple Human Interface Guidelines).

---

### 4. Letter-Spacing

**Prüfe Headlines auf korrekten Letter-Spacing:**

```tsx
// Headlines (Screen-Titel, große Überschriften)
className="tracking-tight"     // letter-spacing: -0.025em
// Oder:
style={{ letterSpacing: '-0.3px' }}
```

---

## ❌ WAS DU NICHT ÄNDERN DARFST

**KRITISCH:** Ändere **NUR** Typography & Sizing. Folgendes bleibt **UNANGETASTET:**

### 🔒 Geschützte Bereiche

1. **Code-Architektur**
   - ❌ Keine Component-Struktur ändern
   - ❌ Keine Imports umstrukturieren
   - ❌ Keine Functions/Logic anfassen
   - ❌ Keine State-Management-Änderungen

2. **Layout & Spacing**
   - ❌ Keine Margins ändern (außer wenn es direkt mit Button-Size zusammenhängt)
   - ❌ Keine Paddings ändern (außer Button-Padding siehe oben)
   - ❌ Keine Flexbox/Grid-Strukturen ändern
   - ❌ Keine Width/Height-Werte ändern (außer Buttons)

3. **Styling (außer Typography)**
   - ❌ Keine Colors ändern
   - ❌ Keine Borders ändern
   - ❌ Keine Shadows ändern
   - ❌ Keine Border-Radius ändern
   - ❌ Keine Backgrounds ändern
   - ❌ Keine Glassmorphism-Effekte ändern

4. **Files & Structure**
   - ❌ Keine Dateien löschen
   - ❌ Keine Dateien umbenennen
   - ❌ Keine neue Komponenten erstellen
   - ❌ Keine Imports hinzufügen/entfernen

---

## 🎯 Vorgehensweise (Step-by-Step)

### Phase 1: Analyse
1. **Vergleiche beide Projekte** visuell (Screenshots)
2. **Identifiziere alle Stellen** mit zu dünnen Fonts
3. **Notiere exakte Unterschiede** in Font-Weight & Size

### Phase 2: Systematische Korrektur
1. **Starte mit HomeScreen.tsx** (Hauptbeispiel aus Screenshots)
2. **Korrigiere nur Font-Weights & Sizes** in dieser Datei
3. **Teste visuell** gegen Original
4. **Wiederhole** für alle anderen Screens:
   - ProfileScreen.tsx
   - ChatScreen.tsx
   - FlashcardsScreen.tsx
   - ExamScreen.tsx
   - SettingsScreen.tsx
   - LoginScreen.tsx
   - RegisterScreen.tsx
   - Alle anderen .tsx Files

### Phase 3: Components
1. **Gehe durch `/src/app/components/`**
2. **Korrigiere** Card-Komponenten, Button-Komponenten, etc.
3. **Achte besonders auf:**
   - ExamCard.tsx
   - FlashcardCard.tsx
   - TodoCard.tsx
   - Alle Button-Komponenten

### Phase 4: Validierung
1. **Vergleiche** jede geänderte Datei mit Original
2. **Stelle sicher:** Nur Typography/Sizing wurde geändert
3. **Teste:** Keine funktionalen Änderungen

---

## 📋 Konkrete Beispiele aus HomeScreen

### Beispiel 1: "Your ToDo's" Überschrift

**Aktuell (FALSCH):**
```tsx
<h2 className="text-[16px] font-medium text-white">
  Your ToDo's
</h2>
```

**Original (KORREKT):**
```tsx
<h2 className="text-[20px] font-bold text-white">
  Your ToDo's
</h2>
```

**Änderung:** `font-medium` → `font-bold`, `text-[16px]` → `text-[20px]`

---

### Beispiel 2: "Karteikarten" Titel

**Aktuell (FALSCH):**
```tsx
<h3 className="font-['Poppins:Regular',sans-serif] text-[14px] text-white">
  Karteikarten
</h3>
```

**Original (KORREKT):**
```tsx
<h3 className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">
  Karteikarten
</h3>
```

**Änderung:** `Poppins:Regular` → `Poppins:SemiBold`, `text-[14px]` → `text-[15px]`

---

### Beispiel 3: "Start now" Button

**Aktuell (FALSCH):**
```tsx
<button className="px-4 py-2 font-medium text-[15px] text-white bg-[#5b5fef] rounded-xl">
  Start now
</button>
```

**Original (KORREKT):**
```tsx
<button className="px-6 py-3 font-semibold text-[16px] text-white bg-[#5b5fef] rounded-xl">
  Start now
</button>
```

**Änderung:** 
- Padding: `px-4 py-2` → `px-6 py-3`
- Font: `font-medium text-[15px]` → `font-semibold text-[16px]`

---

### Beispiel 4: "AI Tools" Sektions-Titel

**Aktuell (FALSCH):**
```tsx
<h2 className="text-[16px] font-medium text-white mb-3">
  AI Tools
</h2>
```

**Original (KORREKT):**
```tsx
<h2 className="text-[18px] font-bold text-white mb-3">
  AI Tools
</h2>
```

**Änderung:** `font-medium text-[16px]` → `font-bold text-[18px]`

---

### Beispiel 5: "Recently used Flashcards" Header

**Aktuell (FALSCH):**
```tsx
<h3 className="text-[15px] font-medium text-white">
  Recently used Flashcards
</h3>
```

**Original (KORREKT):**
```tsx
<h3 className="text-[16px] font-semibold text-white">
  Recently used Flashcards
</h3>
```

**Änderung:** `font-medium text-[15px]` → `font-semibold text-[16px]`

---

## 🎨 Font-Weight Mapping (Referenz)

```css
/* Poppins Font-Weights */
font-light     = 300 = font-['Poppins:Light',sans-serif]
font-normal    = 400 = font-['Poppins:Regular',sans-serif]
font-medium    = 500 = font-['Poppins:Medium',sans-serif]
font-semibold  = 600 = font-['Poppins:SemiBold',sans-serif]
font-bold      = 700 = font-['Poppins:Bold',sans-serif]
```

**Häufigste Fehler:**
- ❌ `font-medium` (500) wird verwendet
- ✅ `font-semibold` (600) sollte verwendet werden

---

## 📦 Dateien die wahrscheinlich betroffen sind

**Priorisierte Liste (arbeite diese ab):**

### High Priority (Screenshots zeigen diese):
1. `/src/app/screens/HomeScreen.tsx`
2. `/src/app/components/ExamCard.tsx`
3. `/src/app/components/FlashcardCard.tsx`

### Medium Priority:
4. `/src/app/screens/FlashcardsScreen.tsx`
5. `/src/app/screens/ExamScreen.tsx`
6. `/src/app/screens/ProfileScreen.tsx`
7. `/src/app/screens/ChatScreen.tsx`
8. `/src/app/screens/SettingsScreen.tsx`

### Low Priority (auch checken):
9. `/src/app/screens/LoginScreen.tsx`
10. `/src/app/screens/RegisterScreen.tsx`
11. Alle anderen `/src/app/components/*.tsx`

---

## ✅ Checkliste für jede Datei

Gehe jede Datei durch und stelle sicher:

- [ ] Alle **Hauptüberschriften** verwenden `font-semibold` oder `font-bold`
- [ ] Alle **Screen-Titel** verwenden `text-[17px]` - `text-[20px]`
- [ ] Alle **Card-Titel** verwenden `font-semibold text-[14px]`
- [ ] Alle **Sektions-Header** verwenden `font-bold text-[18px]` - `text-[20px]`
- [ ] Alle **Primary Buttons** verwenden `font-semibold text-[16px]` + `px-6 py-3`
- [ ] Alle **Small Buttons** verwenden `font-medium text-[13px]`
- [ ] Keine **Layout/Logic/Styling-Änderungen** außer Typography

---

## 🔍 Validierungs-Kriterien

**Nach Abschluss der Änderungen:**

1. **Visueller Vergleich:** Screenshots vom aktuellen Stand müssen mit Original übereinstimmen
2. **Font-Weight-Test:** Alle wichtigen Texte sollten "kräftig" und "bold" wirken (nicht dünn)
3. **Button-Test:** Buttons sollten größer/anfassbarer sein (min. 44px Höhe)
4. **Keine Funktions-Änderungen:** App muss exakt gleich funktionieren wie vorher
5. **Keine Style-Änderungen:** Nur Typography wurde angepasst

---

## 🚀 Zusammenfassung - Quick Rules

**Faustregel:**
1. **Überschriften:** Immer `font-semibold` (600) oder `font-bold` (700)
2. **Buttons:** Immer `font-semibold` (600) mit `text-[16px]`
3. **Card-Titel:** Immer `font-semibold` (600)
4. **Body-Text:** `font-normal` (400) ist OK
5. **Labels/Small:** `font-medium` (500) ist OK

**Wenn unsicher:** Schaue ins Original-Projekt und kopiere den exakten Font-Weight & Size!

---

## ⚠️ WICHTIGE HINWEISE

1. **Arbeite systematisch:** Screen für Screen, Component für Component
2. **Teste visuell:** Vergleiche mit Screenshots nach jeder Änderung
3. **Bleib konservativ:** Ändere NUR was notwendig ist
4. **Dokumentiere:** Notiere welche Dateien du geändert hast
5. **Kein "Cleanup":** Keine Code-Optimierungen, keine Refactorings!

---

## 📸 Referenz-Screenshots

- **Screenshot 1 (AKTUELL):** Zeigt zu dünne Schriften
- **Screenshot 2 (ORIGINAL):** Zeigt korrekte bold/semibold Schriften

**Ziel:** Screenshot 1 soll aussehen wie Screenshot 2!

---

**Made with precision by SoStudy Team**  
*Ultra-Clean Architecture • Apple Vision Pro Style 2026*
