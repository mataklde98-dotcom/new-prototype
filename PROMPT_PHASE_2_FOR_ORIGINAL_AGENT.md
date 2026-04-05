# Phase 2 - Erweitere ORIGINAL_TYPOGRAPHY_VALUES.md

**Hallo! Ich brauche deine Hilfe, die bestehende `/ORIGINAL_TYPOGRAPHY_VALUES.md` zu erweitern.**

## Deine Aufgabe:

**ERWEITERE** (nicht neu erstellen!) die bestehende `/ORIGINAL_TYPOGRAPHY_VALUES.md` Datei um die fehlenden Screens und Components.

---

## Was bereits dokumentiert ist ✅:

- HomeScreenMobile.tsx
- FlashcardItem.tsx
- CompletedExamCard.tsx
- TodoCard.tsx

---

## Was DU jetzt dokumentieren sollst ⚠️:

### PRIORITY 1: Main Screens (fehlende)
1. `/src/app/screens/MyFlashcardsScreenMobile.tsx`
2. `/src/app/screens/CompletedExamsScreenMobile.tsx`
3. `/src/app/screens/ProfilScreenMobile.tsx`
4. `/src/app/screens/ChatScreenMobile.tsx`
5. `/src/app/screens/KIToolsScreen.tsx`

### PRIORITY 2: Auth Screens
6. `/src/app/screens/LoginScreen.tsx`
7. `/src/app/screens/RegisterScreen.tsx`

### PRIORITY 3: Modal Components
8. `/src/app/components/modals/CreateOwnSetModal.tsx` (falls vorhanden)
9. `/src/app/components/modals/SubtopicsModal.tsx` (falls vorhanden)
10. **Alle anderen Modals** im `/src/app/components/modals/` Ordner

### PRIORITY 4: Form Components
11. **Alle Form Components** (falls vorhanden)

### PRIORITY 5: Desktop Variants
12. **Desktop Screen Varianten** (nur wenn unterschiedlich zu Mobile)

---

## Wie du vorgehen sollst:

### Schritt 1: Lies die bestehende .md
```bash
# Öffne /ORIGINAL_TYPOGRAPHY_VALUES.md
# Verstehe das Format und die Struktur
```

### Schritt 2: Füge NEUE SECTIONS hinzu

**Füge die neuen Screens NACH "### TodoCard.tsx" ein, aber VOR "## 🎨 DESIGN SYSTEM SUMMARY"**

**Format:**
```markdown
---

### MyFlashcardsScreenMobile.tsx

#### Screen-Titel
- Element: ...
- Font-Family: ...
- Font-Size: ...
- Font-Weight: ...
- Code: `className="..."`
- Line: ...

#### Section Headers
(dokumentiere alle Überschriften wie "All Flashcards", "Filters", etc.)

#### Buttons
(dokumentiere alle Buttons)

#### Card Elements
(falls es spezielle Card-Elemente gibt)

---

### CompletedExamsScreenMobile.tsx

(gleiche Struktur wie oben)

---
```

### Schritt 3: Verwende das GLEICHE Format

**Für JEDES Element dokumentiere:**
1. **Element** - HTML Tag oder Component
2. **Font-Family** - z.B. `font-['Poppins:Bold',sans-serif]`
3. **Font-Size** - z.B. `text-[18px]` → **18px**
4. **Font-Weight** - Numerisch: 700, 600, 500, 400
5. **Code** - Der EXAKTE className String
6. **Line** - Zeilen-Nummer im Code

**Beispiel:**
```markdown
#### Screen-Titel: "My Flashcards"
- **Element:** `<h1>` oder Navigation Title
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[20px]` → **20px**
- **Font-Weight:** **700** (Bold)
- **Color:** `text-white`
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[20px] text-white"`
- **Line:** 45
```

### Schritt 4: Dokumentiere ALLE wichtigen Elemente

Für jeden Screen/Component, dokumentiere:
- ✅ Screen-Titel / Page Header
- ✅ Section Headers (alle h1, h2, h3, h4)
- ✅ Sub-Section Headers
- ✅ Buttons (Primary, Secondary, Small)
- ✅ Card Titles
- ✅ Card Descriptions
- ✅ Labels & Metadata
- ✅ Body Text
- ✅ Form Inputs (Label, Placeholder, Error Text)
- ✅ Modal Titles & Content
- ✅ Icon Sizes (falls wichtig)

### Schritt 5: Update den Changelog

**Am Ende der .md, update diese Section:**

```markdown
## 📝 CHANGELOG

### v1.0 - February 15, 2026
- Initial documentation created
- Documented HomeScreenMobile.tsx (complete)
- Documented FlashcardItem.tsx (complete)
- Documented CompletedExamCard.tsx (complete)
- Documented TodoCard.tsx (complete)
- Added design system summary
- Added component patterns
- Added critical rules

### v2.0 - February 15, 2026  ← FÜGE DAS HINZU!
- ✅ Documented MyFlashcardsScreenMobile.tsx
- ✅ Documented CompletedExamsScreenMobile.tsx
- ✅ Documented ProfilScreenMobile.tsx
- ✅ Documented ChatScreenMobile.tsx
- ✅ Documented KIToolsScreen.tsx
- ✅ Documented LoginScreen.tsx
- ✅ Documented RegisterScreen.tsx
- ✅ Documented Modal components
- ✅ Documented Form components (if any)
- ✅ Documented Desktop variants (if different)

### Future Additions Needed:  ← LÖSCHE DIESE SECTION WENN ALLES FERTIG!
(leer - alles dokumentiert!)
```

---

## ⚠️ WICHTIG:

1. **NICHT neu erstellen** - ERWEITERE die bestehende .md!
2. **GLEICHES Format** beibehalten wie bei HomeScreenMobile.tsx
3. **Lies die Dateien tatsächlich** mit dem `read` tool
4. **Kopiere exakte className Strings** aus dem Code
5. **Dokumentiere Zeilen-Nummern** (Line: ...)
6. **Ignoriere Colors/Layouts** - nur Typography!

---

## Schritt-für-Schritt Workflow:

```bash
1. read /ORIGINAL_TYPOGRAPHY_VALUES.md  
   → Verstehe das Format

2. read /src/app/screens/MyFlashcardsScreenMobile.tsx
   → Analysiere die Typography

3. Dokumentiere in der .md (nach TodoCard.tsx):
   ### MyFlashcardsScreenMobile.tsx
   (wie oben gezeigt)

4. Wiederhole für alle anderen Screens

5. Update Changelog

6. Fertig!
```

---

## Beispiel - Was du hinzufügen sollst:

**Nach "### TodoCard.tsx" (Zeile ~770), füge ein:**

```markdown
---

## 📚 PRIORITY 1B: ADDITIONAL MAIN SCREENS

### MyFlashcardsScreenMobile.tsx

#### Screen-Titel
- **Element:** `<h1>` oder Navigation Title
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[17px]` → **17px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `text-white`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white"`
- **Line:** 42

#### Section Header: "All Flashcards"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[18px]` → **18px**
- **Font-Weight:** **700** (Bold)
- **Color:** `text-white`
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[18px] text-white"`
- **Line:** 78

(... dokumentiere ALLE weiteren Elemente ...)

---

### CompletedExamsScreenMobile.tsx

(gleiche Struktur)

---
```

---

## Fragen?

Wenn eine Datei NICHT existiert:
- Dokumentiere das in der .md: `❌ File not found: /src/app/screens/XYZ.tsx`
- Springe zur nächsten Datei

Wenn unsicher bei Font-Weight:
- Schau dir die className an:
  - `Poppins:Bold` → 700
  - `Poppins:SemiBold` → 600
  - `Poppins:Medium` → 500
  - `Poppins:Regular` → 400
  - `font-bold` → 700

---

**Viel Erfolg! Danke für die Erweiterung der Dokumentation!** 🎯
