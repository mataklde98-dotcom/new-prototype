# Typography Conversion - Master Guide für VS Code Claude

## 📊 Overview

**Aufgabe:** Übernehme die **exakte Typography** aus der alten SoStudy Learning App in die neue App (gleiche Features, neue Architektur).

**Problem:** Die neue App hat die gleiche Funktionalität, aber die Typography ist NICHT mehr korrekt:
- ❌ Font-Weights zu dünn (SemiBold statt Bold, Medium statt SemiBold)
- ❌ Font-Sizes anders (18px statt 20px, etc.)
- ❌ Button Dimensions falsch (andere Paddings, Heights)
- ❌ Font-Family Declarations fehlen oder vereinfacht

**Lösung:** Screen-by-Screen die Typography aus den 6 Phase-Dokumentationen übernehmen!

---

## 📚 DOKUMENTATION VERFÜGBAR

Du hast **6 Typography Audit Phasen** (im Root des Projekts):

| Datei | Inhalt | Screens/Items |
|-------|--------|---------------|
| `PHASE_1_MAIN_APP_MOBILE_SCREENS.md` | Main App Mobile Screens | 11 Screens |
| `PHASE_2_MAIN_APP_DESKTOP_SCREENS.md` | Main App Desktop Screens | 11 Screens |
| `PHASE_3_MAIN_APP_COMPONENTS_MODALS.md` | Main App Components + Modals | ~15 Items |
| `PHASE_4_EXAMAPP_MOBILE_SCREENS.md` | ExamApp Mobile Screens | 9 Screens |
| `PHASE_5_EXAMAPP_DESKTOP_SCREENS.md` | ExamApp Desktop Screens | 9 Screens |
| `PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md` | ExamApp Components + **Design System Summary** | ~10 Items + Summary |

**Total:** ~65 Items dokumentiert

**⚠️ WICHTIG:** Lies **PHASE_6** ZUERST! Sie enthält:
- ✅ Design System Summary (Font Families, Weights, Common Sizes)
- ✅ Mobile vs Desktop Differences
- ✅ Component Patterns
- ✅ **CRITICAL CONVERSION RULES** (extrem wichtig!)

---

## ⚠️ CRITICAL CONVERSION RULES (aus Phase 6)

### **Rule 1: Never Lighten Font-Weights** 🚨
- Original: `Poppins:Bold` (700) → **KEEP 700**
- Original: `Poppins:SemiBold` (600) → **KEEP 600**
- Original: `Poppins:Medium` (500) → **KEEP 500**

**VERBOTEN:**
- ❌ Bold → SemiBold (700 → 600)
- ❌ SemiBold → Medium (600 → 500)
- ❌ Medium → Regular (500 → 400)

**Häufiger Fehler:**
```tsx
// ❌ FALSCH (zu dünn!)
<h1 className="text-[20px] font-semibold">Title</h1>

// ✅ RICHTIG (Original war Bold!)
<h1 className="font-['Poppins:Bold',sans-serif] text-[20px]">Title</h1>
```

---

### **Rule 2: Preserve Exact Font Sizes** 📏
- Original: `text-[20px]` → **KEEP 20px exactly**
- Original: `text-[17px]` → **KEEP 17px exactly**
- **NICHT** runden oder in Tailwind-Klassen umwandeln!

**VERBOTEN:**
- ❌ `text-[20px]` → `text-xl` (würde 20px sein, aber wir wollen exakte Werte)
- ❌ `text-[17px]` → `text-lg` (würde 18px sein!)
- ❌ `text-[14px]` → `text-sm` (könnte anders sein!)

**Immer exakte Pixel-Werte verwenden:**
```tsx
// ✅ RICHTIG
<p className="text-[17px]">Text</p>
<p className="text-[14px]">Small Text</p>
```

---

### **Rule 3: Maintain Font-Family Declarations** 🔤
- Original: `font-['Poppins:Bold',sans-serif]` → **KEEP genau so!**
- **NICHT** vereinfachen zu `font-bold`!

**Warum?** 
- `font-bold` setzt nur `font-weight: 700`
- `font-['Poppins:Bold',sans-serif]` setzt Font-Family UND Weight!

**VERBOTEN:**
```tsx
// ❌ FALSCH (Font-Family fehlt!)
<h1 className="text-[20px] font-bold">Title</h1>

// ✅ RICHTIG (Font-Family + Weight!)
<h1 className="font-['Poppins:Bold',sans-serif] text-[20px]">Title</h1>
```

**Erlaubt** (wenn Doku explizit `font-bold` zeigt):
```tsx
// ✅ OK (wenn in Doku steht "font-bold")
<span className="text-[10px] font-bold">Badge</span>
```

---

### **Rule 4: Preserve Button Dimensions** 📦
- Original: `h-[44px]` → **KEEP 44px**
- Original: `px-6 py-3` → **KEEP exact padding**
- Original: `rounded-2xl` → **KEEP border-radius**

**Button Padding beeinflusst die wahrgenommene Schrift-Dicke!**

**Beispiel:**
```tsx
// ❌ FALSCH (zu klein, Text wirkt dünn)
<button className="px-4 py-2 h-[40px] rounded-lg font-semibold text-[16px]">
  Start
</button>

// ✅ RICHTIG (Original Dimensions)
<button className="px-6 py-3 h-[44px] rounded-2xl font-['Poppins:SemiBold',sans-serif] text-[16px]">
  Start
</button>
```

---

### **Rule 5: Respect Mobile vs Desktop Differences** 📱💻
- Mobile und Desktop haben **UNTERSCHIEDLICHE** Typography!
- **NICHT** Mobile Typography in Desktop verwenden (oder umgekehrt)!
- Responsive Breakpoints beibehalten (`lg:text-[20px]` etc.)

**Beispiel:**
```tsx
// ✅ RICHTIG (Mobile: 17px, Desktop: 20px)
<h1 className="font-['Poppins:Bold',sans-serif] text-[17px] lg:text-[20px]">
  Screen Title
</h1>

// ❌ FALSCH (überall gleich)
<h1 className="font-['Poppins:Bold',sans-serif] text-[20px]">
  Screen Title
</h1>
```

**Mobile Doku:** PHASE_1, PHASE_4
**Desktop Doku:** PHASE_2, PHASE_5

---

### **Rule 6: Don't Skip Small Elements** 🔍
- Metadata, Timestamps, Badges - **ALLE** wichtig!
- Auch "3 cards", "2 days ago", "80%" müssen matchen!

**Häufiger Fehler:**
- ✅ Screen Title gefixt
- ✅ Buttons gefixt
- ❌ Metadata vergessen! (z.B. "3 cards" ist jetzt `text-sm` statt `text-[12px]`)

**Checke ALLE Typography-Elemente:**
- Screen Titles
- Section Headers
- Buttons
- Card Titles
- Body Text
- Labels/Metadata ← **NICHT VERGESSEN!**
- Timestamps ← **NICHT VERGESSEN!**
- Badges ← **NICHT VERGESSEN!**
- Input Placeholders ← **NICHT VERGESSEN!**

---

## 🎯 STRATEGIE: Screen-by-Screen Conversion

**NICHT alles auf einmal!** Das Projekt hat ~65 Items!

**Arbeite Screen-by-Screen** in dieser Reihenfolge:

### **PHASE A: Main App Mobile Screens (11 Screens)**
Start here! Mobile First!

1. HomeScreenMobile.tsx
2. MyFlashcardsScreenMobile.tsx
3. ExamScreenMobile.tsx (falls vorhanden)
4. CompletedExamsScreenMobile.tsx
5. GenerateFlashcardsScreenMobile.tsx
6. ProfilScreenMobile.tsx
7. ChatScreenMobile.tsx
8. KIToolsScreenMobile.tsx
9. SettingsScreenMobile.tsx (falls vorhanden)
10. LoginScreenMobile.tsx (falls vorhanden)
11. RegisterScreenMobile.tsx (falls vorhanden)

### **PHASE B: Main App Desktop Screens (11 Screens)**
Nach Phase A!

1. HomeScreenDesktop.tsx (oder HomeScreen.tsx)
2. MyFlashcardsScreenDesktop.tsx
3. ExamScreenDesktop.tsx (falls vorhanden)
4. CompletedExamsScreenDesktop.tsx
5. GenerateFlashcardsScreenDesktop.tsx
6. ProfilScreenDesktop.tsx
7. ChatScreenDesktop.tsx
8. KIToolsScreenDesktop.tsx
9. SettingsScreenDesktop.tsx (falls vorhanden)
10. LoginScreen.tsx (falls keine separate Mobile-Version)
11. RegisterScreen.tsx (falls keine separate Mobile-Version)

### **PHASE C: Main App Components + Modals (~15 Items)**
Nach Phase B!

**Components:**
1. FlashcardCard.tsx
2. ExamCard.tsx
3. TodoCard.tsx
4. BottomNavigation.tsx
5. Sidebar.tsx
6. (etc. - siehe PHASE_3)

**Modals:**
1. CreateOwnSetModal.tsx
2. SubtopicsModal.tsx
3. EditFlashcardModal.tsx
4. DeleteConfirmationModal.tsx
5. (etc. - siehe PHASE_3)

### **PHASE D: ExamApp Mobile Screens (9 Screens)**
Nach Phase C!

1. SubjectSelectionScreenMobile.tsx
2. CategorySelectionScreenMobile.tsx
3. TopicSelectionScreenMobile.tsx
4. SubtopicSelectionScreenMobile.tsx
5. ExamConfigurationScreenMobile.tsx
6. StartScreenMobile.tsx
7. QuestionScreenMobile.tsx
8. ResultsScreenMobile.tsx
9. ExamFeedbackScreenMobile.tsx

### **PHASE E: ExamApp Desktop Screens (9 Screens)**
Nach Phase D!

(Gleiche Liste wie Phase D, nur Desktop-Variants)

### **PHASE F: ExamApp Components (~10 Items)**
Nach Phase E!

1. SubjectSelection.tsx
2. CategorySelection.tsx
3. TopicSelection.tsx
4. QuestionCard.tsx
5. Timer.tsx
6. (etc. - siehe PHASE_6)

---

## 📋 WORKFLOW PRO SCREEN

Für **JEDEN Screen** folgst du diesem Workflow:

### **Schritt 1: Dokumentation lesen**
- Öffne die passende Phase-Datei (z.B. PHASE_1 für HomeScreenMobile)
- Lies die Sektion für diesen Screen gründlich
- Notiere alle Typography-Elemente:
  - Screen Title
  - Section Headers
  - Buttons
  - Card Titles
  - Body Text
  - Labels/Metadata
  - Special Elements

### **Schritt 2: Datei in neuer App finden**
- Suche die Datei im neuen Projekt
- Wahrscheinliche Pfade:
  - Main App: `/src/app/components/` oder `/src/app/screens/`
  - ExamApp: `/src/examapp/app/components/screens/` oder `/src/examapp/app/screens/`
- Falls nicht gefunden: Notiere `⚠️ Screen XYZ not found - skipped`

### **Schritt 3: Vergleichen & Änderungsliste erstellen**
Für **JEDES Typography-Element:**

**Beispiel Analyse:**

```markdown
## HomeScreenMobile.tsx - Änderungsliste

### 1. Screen Title "Hallo, {firstName}!"
- **DOKU (Original):** `font-['Poppins:Bold',sans-serif] text-[18px]`
- **AKTUELL (Neu):** `font-semibold text-lg`
- **PROBLEM:** Font-Family fehlt! Font-Size falsch (text-lg = 18px ist ok, aber wir wollen exakte Werte)
- **FIX:** Ändere zu `font-['Poppins:Bold',sans-serif] text-[18px]`

### 2. Section Header "Your ToDo's"
- **DOKU (Original):** `font-['Poppins:Bold',sans-serif] text-[18px]`
- **AKTUELL (Neu):** `font-bold text-[18px]`
- **PROBLEM:** Font-Family Declaration fehlt!
- **FIX:** Ändere zu `font-['Poppins:Bold',sans-serif] text-[18px]`

### 3. Primary Button "Start Exam"
- **DOKU (Original):** `h-[44px] px-6 py-3 rounded-2xl font-['Poppins:SemiBold',sans-serif] text-[16px]`
- **AKTUELL (Neu):** `h-[40px] px-4 py-2 rounded-lg font-semibold text-[15px]`
- **PROBLEM:** Alles falsch! Height, Padding, Border-Radius, Font-Family, Font-Size!
- **FIX:** Komplett ersetzen mit Original-Werten

(... für ALLE Elemente!)
```

### **Schritt 4: Changes implementieren**
- Verwende `edit_tool` für **jedes Element** (oder gruppiere wenn sinnvoll)
- Sei **SEHR PRÄZISE** - kopiere exakte className Strings aus Doku
- Ändere **NUR** Typography - keine Logic, keine anderen Styles!

### **Schritt 5: Verification**
Nach jeder Änderung prüfe:
- ✅ Font-Family korrekt? (`font-['Poppins:Bold',sans-serif]`)
- ✅ Font-Size exakt? (`text-[20px]`)
- ✅ Font-Weight beibehalten? (Bold bleibt Bold, nicht zu SemiBold!)
- ✅ Button Dimensions korrekt? (Height, Padding, Border-Radius)
- ✅ Mobile vs Desktop Breakpoints? (`lg:text-[20px]`)
- ✅ Nichts anderes verändert? (Logic, Colors, Margins, etc.)

### **Schritt 6: Completion**
Schreibe:
```
✅ [ScreenName] COMPLETE - Typography matched to original

Änderungen:
- Screen Title: Font-Family + Weight gefixt
- Section Headers (3): Font-Size angepasst
- Primary Button: Dimensions + Font gefixt
- Card Metadata (5): Font-Size korrigiert
- Timestamps (2): Font-Family hinzugefügt

Total: 12 Typography-Fixes

Bereit für nächsten Screen!
```

---

## 🚀 PROMPT TEMPLATES

### **Template 1: Einzelner Screen (empfohlen für Start)**

```markdown
# CONVERSION TASK: [ScreenName]

**Phase:** [Phase A/B/C/D/E/F]
**Documentation:** [PHASE_X_FILENAME.md]
**Screen:** [ScreenName].tsx

## Aufgabe:

1. Lies die Dokumentation für **[ScreenName]** in `[PHASE_X_FILENAME.md]`
2. Finde die Datei `[ScreenName].tsx` in der neuen App
3. Vergleiche aktuelle Typography mit dokumentierter Typography
4. Erstelle eine **Änderungsliste** (siehe Workflow Schritt 3)
5. Implementiere die Änderungen
6. Verifiziere alle 6 Critical Rules

**Wichtig:**
- Ändere **NUR** Typography (Font-Family, Size, Weight, Button Dimensions)
- **NICHT** Logic, Colors, Margins oder andere Styles ändern
- Wenn Element in Doku fehlt, lass es wie es ist

Nach Abschluss schreibe:
"✅ [ScreenName] COMPLETE - Typography matched to original"

Los geht's!
```

**Beispiel Nutzung:**
```markdown
# CONVERSION TASK: HomeScreenMobile

**Phase:** Phase A
**Documentation:** PHASE_1_MAIN_APP_MOBILE_SCREENS.md
**Screen:** HomeScreenMobile.tsx

## Aufgabe:

1. Lies die Dokumentation für **HomeScreenMobile** in `PHASE_1_MAIN_APP_MOBILE_SCREENS.md`
2. Finde die Datei `HomeScreenMobile.tsx` in der neuen App
3. Vergleiche aktuelle Typography mit dokumentierter Typography
4. Erstelle eine **Änderungsliste**
5. Implementiere die Änderungen
6. Verifiziere alle 6 Critical Rules

Los geht's!
```

---

### **Template 2: Mehrere Screens (wenn Claude gut performt)**

```markdown
# CONVERSION TASK: Phase A - Screens 1-3

**Phase:** Phase A (Main App Mobile Screens)
**Documentation:** PHASE_1_MAIN_APP_MOBILE_SCREENS.md
**Screens:**
1. HomeScreenMobile.tsx
2. MyFlashcardsScreenMobile.tsx
3. ExamScreenMobile.tsx

## Aufgabe:

Für **JEDEN Screen** separat:

1. Dokumentation lesen
2. Datei finden
3. Änderungsliste erstellen
4. Implementieren
5. Verifizieren

**Wichtig:**
- Arbeite Screen-by-Screen (nicht alles parallel!)
- Erstelle separate Änderungsliste für jeden Screen
- Verifiziere Critical Rules pro Screen

Nach jedem Screen schreibe:
"✅ [ScreenName] COMPLETE"

Nach allen 3 Screens schreibe:
"✅ PHASE A - Screens 1-3 COMPLETE"

Los geht's!
```

---

### **Template 3: Komplette Phase (nur wenn alles läuft)**

```markdown
# CONVERSION TASK: PHASE A - All Mobile Screens

**Phase:** Phase A (Main App Mobile Screens)
**Documentation:** PHASE_1_MAIN_APP_MOBILE_SCREENS.md
**Screens:** 11 Mobile Screens (siehe Doku)

## Aufgabe:

Konvertiere **ALLE 11 Mobile Screens** aus PHASE_1.

Für jeden Screen:
1. Dokumentation lesen
2. Datei finden
3. Änderungsliste erstellen (kurz!)
4. Implementieren
5. Verifizieren

**Wichtig:**
- Critical Rules beachten!
- Wenn Screen nicht existiert: überspringen und notieren
- Wenn Screen anders heißt: adaptieren und notieren

Nach jedem Screen kurze Bestätigung:
"✅ [ScreenName] COMPLETE"

Nach allen Screens:
"✅ PHASE A COMPLETE - All Mobile Screens converted"

Los geht's!
```

---

## 📊 PROGRESS TRACKING

### **Checklist: Main App Mobile (Phase A)**

- [ ] 1. HomeScreenMobile.tsx
- [ ] 2. MyFlashcardsScreenMobile.tsx
- [ ] 3. ExamScreenMobile.tsx
- [ ] 4. CompletedExamsScreenMobile.tsx
- [ ] 5. GenerateFlashcardsScreenMobile.tsx
- [ ] 6. ProfilScreenMobile.tsx
- [ ] 7. ChatScreenMobile.tsx
- [ ] 8. KIToolsScreenMobile.tsx
- [ ] 9. SettingsScreenMobile.tsx
- [ ] 10. LoginScreenMobile.tsx
- [ ] 11. RegisterScreenMobile.tsx

**Progress:** 0/11 ➜ Ziel: 11/11 ✅

---

### **Checklist: Main App Desktop (Phase B)**

- [ ] 1. HomeScreenDesktop.tsx
- [ ] 2. MyFlashcardsScreenDesktop.tsx
- [ ] 3. ExamScreenDesktop.tsx
- [ ] 4. CompletedExamsScreenDesktop.tsx
- [ ] 5. GenerateFlashcardsScreenDesktop.tsx
- [ ] 6. ProfilScreenDesktop.tsx
- [ ] 7. ChatScreenDesktop.tsx
- [ ] 8. KIToolsScreenDesktop.tsx
- [ ] 9. SettingsScreenDesktop.tsx
- [ ] 10. LoginScreen.tsx
- [ ] 11. RegisterScreen.tsx

**Progress:** 0/11 ➜ Ziel: 11/11 ✅

---

### **Checklist: Main App Components + Modals (Phase C)**

**Components:**
- [ ] FlashcardCard.tsx
- [ ] ExamCard.tsx
- [ ] TodoCard.tsx
- [ ] BottomNavigation.tsx
- [ ] Sidebar.tsx
- [ ] (siehe PHASE_3 für komplette Liste)

**Modals:**
- [ ] CreateOwnSetModal.tsx
- [ ] SubtopicsModal.tsx
- [ ] EditFlashcardModal.tsx
- [ ] DeleteConfirmationModal.tsx
- [ ] (siehe PHASE_3 für komplette Liste)

**Progress:** 0/~15 ➜ Ziel: ~15/15 ✅

---

### **Checklist: ExamApp Mobile (Phase D)**

- [ ] 1. SubjectSelectionScreenMobile.tsx
- [ ] 2. CategorySelectionScreenMobile.tsx
- [ ] 3. TopicSelectionScreenMobile.tsx
- [ ] 4. SubtopicSelectionScreenMobile.tsx
- [ ] 5. ExamConfigurationScreenMobile.tsx
- [ ] 6. StartScreenMobile.tsx
- [ ] 7. QuestionScreenMobile.tsx
- [ ] 8. ResultsScreenMobile.tsx
- [ ] 9. ExamFeedbackScreenMobile.tsx

**Progress:** 0/9 ➜ Ziel: 9/9 ✅

---

### **Checklist: ExamApp Desktop (Phase E)**

- [ ] 1. SubjectSelectionScreenDesktop.tsx
- [ ] 2. CategorySelectionScreenDesktop.tsx
- [ ] 3. TopicSelectionScreenDesktop.tsx
- [ ] 4. SubtopicSelectionScreenDesktop.tsx
- [ ] 5. ExamConfigurationScreenDesktop.tsx
- [ ] 6. StartScreenDesktop.tsx
- [ ] 7. QuestionScreenDesktop.tsx
- [ ] 8. ResultsScreenDesktop.tsx
- [ ] 9. ExamFeedbackScreenDesktop.tsx

**Progress:** 0/9 ➜ Ziel: 9/9 ✅

---

### **Checklist: ExamApp Components (Phase F)**

- [ ] SubjectSelection.tsx
- [ ] CategorySelection.tsx
- [ ] TopicSelection.tsx
- [ ] SubtopicSelection.tsx
- [ ] QuestionCard.tsx
- [ ] Timer.tsx
- [ ] ProgressBar.tsx
- [ ] ScoreDisplay.tsx
- [ ] (siehe PHASE_6 für komplette Liste)

**Progress:** 0/~10 ➜ Ziel: ~10/10 ✅

---

### **TOTAL PROGRESS**

**Phases Completed:** 0/6
**Items Completed:** 0/~65

🎯 **Ziel:** 6/6 Phases, ~65/65 Items ✅

---

## 🔍 QUALITY CONTROL CHECKLIST

Nach **JEDEM Screen** prüfe:

### **Typography Checks:**
- [ ] ✅ Font-Family korrekt? (`font-['Poppins:Bold',sans-serif]` etc.)
- [ ] ✅ Font-Size exakt? (`text-[20px]` statt `text-xl`)
- [ ] ✅ Font-Weight beibehalten? (Bold = Bold, nicht SemiBold!)
- [ ] ✅ Button Heights korrekt? (`h-[44px]`, `h-[48px]`, etc.)
- [ ] ✅ Button Paddings korrekt? (`px-6 py-3`, etc.)
- [ ] ✅ Border-Radius korrekt? (`rounded-2xl`, etc.)
- [ ] ✅ Mobile vs Desktop Breakpoints? (`lg:text-[20px]`)
- [ ] ✅ Kleine Elemente nicht vergessen? (Metadata, Timestamps, Badges!)

### **Code Quality Checks:**
- [ ] ✅ Nur Typography geändert? (keine Logic-Änderungen!)
- [ ] ✅ Colors unverändert? (text-white, text-gray-500, etc.)
- [ ] ✅ Margins/Paddings unverändert? (außer Button Paddings!)
- [ ] ✅ Funktionalität unverändert? (onClick, etc.)
- [ ] ✅ Imports unverändert?
- [ ] ✅ Keine Syntax-Fehler?

### **Documentation Checks:**
- [ ] ✅ Alle Elemente aus Doku behandelt?
- [ ] ✅ Keine Elemente übersprungen?
- [ ] ✅ Line-Numbers geprüft? (falls Doku Line-Numbers hat)

---

## ⚠️ HÄUFIGE FEHLER & SOLUTIONS

### **Fehler 1: Font-Weight zu dünn**

**Problem:**
```tsx
// Doku sagt: Poppins:Bold (700)
// Neue App hat:
<h1 className="font-semibold text-[20px]">Title</h1>
```

**Lösung:**
```tsx
<h1 className="font-['Poppins:Bold',sans-serif] text-[20px]">Title</h1>
```

---

### **Fehler 2: Font-Family fehlt**

**Problem:**
```tsx
// Doku sagt: font-['Poppins:Bold',sans-serif]
// Neue App hat:
<h1 className="font-bold text-[20px]">Title</h1>
```

**Lösung:**
```tsx
<h1 className="font-['Poppins:Bold',sans-serif] text-[20px]">Title</h1>
```

**Warum wichtig?**
- `font-bold` = nur font-weight: 700
- `font-['Poppins:Bold',sans-serif]` = font-family + font-weight!

---

### **Fehler 3: Font-Size gerundet**

**Problem:**
```tsx
// Doku sagt: text-[17px]
// Neue App hat:
<p className="text-lg">Text</p>  // text-lg = 18px!
```

**Lösung:**
```tsx
<p className="text-[17px]">Text</p>
```

---

### **Fehler 4: Button Dimensions falsch**

**Problem:**
```tsx
// Doku sagt: h-[44px] px-6 py-3 rounded-2xl
// Neue App hat:
<button className="h-[40px] px-4 py-2 rounded-lg">Start</button>
```

**Lösung:**
```tsx
<button className="h-[44px] px-6 py-3 rounded-2xl">Start</button>
```

---

### **Fehler 5: Mobile vs Desktop verwechselt**

**Problem:**
```tsx
// Doku sagt: Mobile: 17px, Desktop: 20px
// Neue App hat:
<h1 className="text-[20px]">Title</h1>  // Überall 20px!
```

**Lösung:**
```tsx
<h1 className="text-[17px] lg:text-[20px]">Title</h1>
```

---

### **Fehler 6: Kleine Elemente vergessen**

**Problem:**
- Screen Title: ✅ Gefixt
- Buttons: ✅ Gefixt
- Metadata: ❌ Vergessen!

**Beispiel:**
```tsx
// Doku sagt für "3 cards": text-[12px] font-['Poppins:Medium',sans-serif]
// Neue App hat:
<span className="text-sm text-gray-500">3 cards</span>  // Falsch!
```

**Lösung:**
```tsx
<span className="text-[12px] font-['Poppins:Medium',sans-serif] text-gray-500">3 cards</span>
```

---

## 🛠️ PROJEKT-STRUKTUR (Neue App)

**Finde die Files hier:**

### **Main App:**
```
/src/app/
├── components/          ← Screens + Components (wahrscheinlich!)
│   ├── HomeScreenMobile.tsx
│   ├── HomeScreenDesktop.tsx
│   ├── MyFlashcardsScreenMobile.tsx
│   ├── FlashcardCard.tsx
│   ├── modals/         ← Modals (falls separater Ordner)
│   │   ├── CreateOwnSetModal.tsx
│   │   └── ...
│   └── ...
├── screens/            ← Alternative: Screens hier (falls separiert)
│   └── ...
└── ...
```

### **ExamApp:**
```
/src/examapp/
├── app/
│   ├── components/
│   │   ├── screens/    ← ExamApp Screens (wahrscheinlich!)
│   │   │   ├── SubjectSelectionScreenMobile.tsx
│   │   │   ├── QuestionScreenMobile.tsx
│   │   │   └── ...
│   │   ├── SubjectSelection.tsx  ← Components
│   │   ├── CategorySelection.tsx
│   │   └── ...
│   └── screens/        ← Alternative: Screens hier
│       └── ...
└── ...
```

**Tipp:** Wenn unsicher, suche mit:
```bash
find /src -name "HomeScreenMobile.tsx"
```

---

## 💡 FONT IMPORT CHECK

**Poppins muss importiert sein!**

### **Prüfe:**
`/src/styles/fonts.css`

**Sollte enthalten:**
```css
/* Poppins Font Import */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
```

**Falls nicht vorhanden:**

1. Erstelle `/src/styles/fonts.css` (falls nicht existiert)
2. Füge Import hinzu (am Anfang der Datei!)
3. Prüfe dass `fonts.css` in `/src/styles/index.css` importiert wird:

```css
/* In /src/styles/index.css */
@import './fonts.css';
```

---

## 🚀 START-ANLEITUNG

### **Schritt 1: Preparation**
1. ✅ Neue App in VS Code geöffnet
2. ✅ Alle 6 Phase-Dateien im Root
3. ✅ Claude Chat in VS Code geöffnet
4. ✅ PHASE_6 gelesen (Design System Summary + Critical Rules!)

### **Schritt 2: Start mit Phase A, Screen 1**

**Kopiere diesen Prompt in VS Code Claude:**

```markdown
# 🎯 TYPOGRAPHY CONVERSION - START

## CONTEXT

Ich habe eine Learning App umgebaut. Die neue App (dieses Projekt) hat die gleichen Features wie die alte App, aber die Typography ist NICHT mehr korrekt (Font-Weights zu dünn, Font-Sizes anders, Button Dimensions falsch).

Ich habe die komplette Typography der alten App dokumentiert (6 Phase-Dateien im Root).

**Deine Aufgabe:** Übernehme die exakte Typography aus der Dokumentation in die neue App!

---

## 📚 DOCUMENTATION

Lies bitte **ALLE 6 Dateien** im Root:
1. PHASE_1_MAIN_APP_MOBILE_SCREENS.md
2. PHASE_2_MAIN_APP_DESKTOP_SCREENS.md
3. PHASE_3_MAIN_APP_COMPONENTS_MODALS.md
4. PHASE_4_EXAMAPP_MOBILE_SCREENS.md
5. PHASE_5_EXAMAPP_DESKTOP_SCREENS.md
6. PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md ← **START HIER!**

**Besonders wichtig: PHASE_6** enthält:
- Design System Summary
- Mobile vs Desktop Differences
- Component Patterns
- **CRITICAL CONVERSION RULES** ← Sehr wichtig!

---

## ⚠️ CRITICAL RULES (aus PHASE_6)

Lies diese im Detail! Die wichtigsten:

1. **Never Lighten Font-Weights** - Bold bleibt Bold (700), nicht SemiBold (600)!
2. **Preserve Exact Font Sizes** - text-[17px] bleibt 17px, nicht text-lg!
3. **Maintain Font-Family Declarations** - font-['Poppins:Bold',sans-serif] nicht vereinfachen!
4. **Preserve Button Dimensions** - h-[44px], px-6 py-3, etc. exakt übernehmen!
5. **Respect Mobile vs Desktop** - Unterschiedliche Typography für Mobile/Desktop!
6. **Don't Skip Small Elements** - Metadata, Timestamps, Badges nicht vergessen!

---

## 🚀 ERSTE AUFGABE: HomeScreenMobile.tsx

**Phase:** A (Main App Mobile Screens)
**Documentation:** PHASE_1_MAIN_APP_MOBILE_SCREENS.md → Section: "SCREEN 1: HomeScreenMobile.tsx"

### Deine Aufgabe:

1. **Lies** die Dokumentation für HomeScreenMobile in PHASE_1
2. **Finde** die Datei HomeScreenMobile.tsx in diesem Projekt (wahrscheinlich in /src/app/components/)
3. **Vergleiche** aktuelle Typography mit dokumentierter Typography
4. **Erstelle eine Änderungsliste:**
   - Was ist aktuell anders?
   - Welche className Strings müssen geändert werden?
   - Für jedes Element: Screen Title, Section Headers, Buttons, Cards, Metadata, etc.
5. **Implementiere** die Änderungen (verwende edit_tool)
6. **Verifiziere** alle 6 Critical Rules

**Wichtig:**
- Ändere **NUR** Typography (Font-Family, Size, Weight, Button Dimensions)
- Ändere **NICHT** Logic, Colors, Margins (außer Button Paddings!) oder andere Funktionalität
- Wenn Element in Doku fehlt, lass es wie es ist

**Nach Abschluss schreibe:**
"✅ HomeScreenMobile.tsx COMPLETE - Typography matched to original"

Dann frage mich ob du mit Screen 2 weitermachen sollst!

Los geht's! 🚀
```

### **Schritt 3: Review & Continue**

Nach jedem Screen:
1. ✅ Prüfe Änderungen (Git Diff!)
2. ✅ Teste die App (läuft sie noch?)
3. ✅ Checke Typography visuell (sieht es richtig aus?)
4. ✅ Commit (z.B. "fix: HomeScreenMobile typography")
5. ✅ Sage Claude: "Perfekt! Weiter mit Screen 2: MyFlashcardsScreenMobile.tsx"

### **Schritt 4: Repeat für alle Screens**

- Phase A: 11 Mobile Screens
- Phase B: 11 Desktop Screens
- Phase C: ~15 Components + Modals
- Phase D: 9 ExamApp Mobile Screens
- Phase E: 9 ExamApp Desktop Screens
- Phase F: ~10 ExamApp Components

**Total: ~65 Items!**

---

## 📊 ERFOLGS-KRITERIEN

**Du bist fertig wenn:**

✅ **Alle 6 Phasen abgeschlossen:**
- [ ] Phase A: Main App Mobile (11/11)
- [ ] Phase B: Main App Desktop (11/11)
- [ ] Phase C: Components + Modals (~15/15)
- [ ] Phase D: ExamApp Mobile (9/9)
- [ ] Phase E: ExamApp Desktop (9/9)
- [ ] Phase F: ExamApp Components (~10/10)

✅ **Alle 6 Critical Rules eingehalten**

✅ **Visuelle Prüfung:**
- Schrift sieht "kräftig" aus (nicht dünn!)
- Buttons haben richtige Größe
- Mobile vs Desktop unterscheidet sich korrekt

✅ **App läuft ohne Fehler**

✅ **Git History sauber:**
- Commits pro Screen (oder pro 2-3 Screens)
- Klare Commit Messages: "fix: HomeScreenMobile typography"

---

## 🎉 FINAL CHECKLIST

Nach Abschluss ALLER Phasen:

- [ ] Alle 65 Items konvertiert
- [ ] Critical Rules überall eingehalten
- [ ] App getestet (Mobile + Desktop)
- [ ] Visuelle Prüfung durchgeführt
- [ ] Git Commits sauber
- [ ] **FERTIG!** 🚀

**Dann erstelle ein Final Summary:**

```markdown
# ✅ TYPOGRAPHY CONVERSION COMPLETE

**Date:** [Datum]
**Duration:** [Zeit]
**Items Converted:** ~65

## Phases Completed:
✅ Phase A: Main App Mobile (11 Screens)
✅ Phase B: Main App Desktop (11 Screens)
✅ Phase C: Components + Modals (~15 Items)
✅ Phase D: ExamApp Mobile (9 Screens)
✅ Phase E: ExamApp Desktop (9 Screens)
✅ Phase F: ExamApp Components (~10 Items)

## Critical Rules Verification:
✅ Rule 1: Font-Weights beibehalten (Bold = Bold)
✅ Rule 2: Exact Font-Sizes (text-[17px] etc.)
✅ Rule 3: Font-Family Declarations (font-['Poppins:Bold',sans-serif])
✅ Rule 4: Button Dimensions (h-[44px], px-6 py-3, etc.)
✅ Rule 5: Mobile vs Desktop respektiert
✅ Rule 6: Kleine Elemente nicht vergessen

## Test Results:
✅ App läuft ohne Errors
✅ Mobile Typography korrekt
✅ Desktop Typography korrekt
✅ Visuelle Prüfung passed

## Git Commits:
~65 Commits (1 pro Screen/Component)

🎉 PROJEKT ERFOLGREICH ABGESCHLOSSEN!
```

---

## 💡 TIPPS & TRICKS

### **Tipp 1: Git Commits pro Screen**
Nach jedem Screen:
```bash
git add src/app/components/HomeScreenMobile.tsx
git commit -m "fix(typography): HomeScreenMobile - match original design"
```

### **Tipp 2: Visual Regression Testing**
- Mache Screenshots vor der Conversion (alte App)
- Mache Screenshots nach der Conversion (neue App)
- Vergleiche Side-by-Side!

### **Tipp 3: Start mit kleinen Screens**
- HomeScreenMobile ist groß und komplex
- Wenn du unsicher bist, starte mit kleinerem Screen (z.B. ProfilScreenMobile)

### **Tipp 4: Batch similar screens**
Wenn Claude gut performt:
- Alle Selection Screens (Subject, Category, Topic) zusammen
- Alle Result Screens zusammen
- etc.

### **Tipp 5: Use Claude's Memory**
In VS Code Claude kannst du zwischen Screens referenzieren:
"Mache QuestionScreenMobile genau wie SubjectSelectionScreenMobile - gleicher Ansatz!"

### **Tipp 6: Pause & Review**
Nach Phase A (11 Screens):
- Pause machen!
- Alle 11 Screens testen
- Visuelle Prüfung
- Dann erst weiter zu Phase B

---

**VIEL ERFOLG! 🚀**

Du schaffst das! Screen-by-Screen bis alle 65 Items perfekt sind! 💪
