# Typography Audit - Multi-Phase Workflow (6 Phases)

## 📊 Overview

Dieses Projekt hat **~60-80 Screens/Components/Modals** zu dokumentieren (Mobile + Desktop!).

**Zu viel für einen Chat!** ❌

**Lösung:** Aufteilen in **6 PHASEN**, jede Phase in einem **neuen Chat** mit Claude Opus 4.6.

---

## 🎯 PHASE 1: Main App MOBILE Screens (11 Screens)

**Neuer Chat starten!**

### Prompt für Chat 1:

```
Ich habe dir das komplette Lern-App-Projekt hochgeladen.

Bitte lies die Datei "/INSTRUCTIONS_FOR_VSCODE_CLAUDE_TYPOGRAPHY_AUDIT_V2.md".

DEINE AUFGABE - PHASE 1 von 6:

Dokumentiere die Typography von ALLEN Main App MOBILE Screens in /src/app/screens/:

1. HomeScreenMobile.tsx
2. MyFlashcardsScreenMobile.tsx (oder FlashcardsScreenMobile.tsx)
3. ExamScreenMobile.tsx (Exam-Launcher Screen, nicht ExamApp!)
4. CompletedExamsScreenMobile.tsx
5. GenerateFlashcardsScreenMobile.tsx (Flashcard Generator AI Tool)
6. ProfilScreenMobile.tsx (oder ProfileScreenMobile.tsx)
7. ChatScreenMobile.tsx
8. KIToolsScreenMobile.tsx (AI Tools Overview)
9. SettingsScreenMobile.tsx (falls vorhanden)
10. LoginScreenMobile.tsx (falls separate Mobile-Version)
11. RegisterScreenMobile.tsx (falls separate Mobile-Version)

⚠️ WICHTIG: Nur MOBILE Screens! Desktop kommt in Phase 2!

Falls Login/Register KEINE separate Mobile-Variant haben (nur LoginScreen.tsx existiert), 
überspringe diese und notiere: "❌ Keine separate Mobile-Variant - wird in Desktop-Phase dokumentiert"

Erstelle eine .md Datei namens "PHASE_1_MAIN_APP_MOBILE_SCREENS.md" mit der Typography-Dokumentation.

Verwende das Format aus den Instructions (Font-Family, Font-Size, Font-Weight, Button-Padding, Line-Numbers, etc.).

Dokumentiere für JEDEN Screen:
- Screen Title
- Section Headers (alle! z.B. "Your ToDo's", "AI Tools", "Recently used Flashcards")
- Buttons (inkl. Padding, Height, Border-Radius)
- Card Titles/Descriptions
- Body Text
- Labels/Metadata (z.B. "3 cards", "2 days ago")
- Input Labels & Placeholders
- Special Elements (Grades, Scores, Badges, etc.)

Sei SEHR PRÄZISE - kopiere exakte className Strings und Line-Numbers!

Nach Fertigstellung schreibe: "✅ PHASE 1 COMPLETE (Mobile Screens) - Ready for Phase 2"
```

### Was wird dokumentiert:
- ✅ 11 Main App MOBILE Screens
- ✅ Alle Typography-Elemente pro Screen
- ✅ Button Dimensions (Padding, Height, Border-Radius)
- ✅ Special Elements (Grades, Scores, etc.)

### Output:
`PHASE_1_MAIN_APP_MOBILE_SCREENS.md`

---

## 🎯 PHASE 2: Main App DESKTOP Screens (11 Screens)

**Neuer Chat starten!**

### Prompt für Chat 2:

```
Ich habe dir das komplette Lern-App-Projekt hochgeladen.

Bitte lies die Datei "/INSTRUCTIONS_FOR_VSCODE_CLAUDE_TYPOGRAPHY_AUDIT_V2.md".

KONTEXT: Phase 1 ist abgeschlossen (Mobile Screens sind dokumentiert).

DEINE AUFGABE - PHASE 2 von 6:

Dokumentiere die Typography von ALLEN Main App DESKTOP Screens in /src/app/screens/:

1. HomeScreenDesktop.tsx (oder HomeScreen.tsx falls keine separate Mobile-Version)
2. MyFlashcardsScreenDesktop.tsx (oder FlashcardsScreenDesktop.tsx)
3. ExamScreenDesktop.tsx
4. CompletedExamsScreenDesktop.tsx
5. GenerateFlashcardsScreenDesktop.tsx
6. ProfilScreenDesktop.tsx (oder ProfileScreenDesktop.tsx)
7. ChatScreenDesktop.tsx
8. KIToolsScreenDesktop.tsx
9. SettingsScreenDesktop.tsx (falls vorhanden)
10. LoginScreen.tsx (falls KEINE separate Mobile-Variant existiert)
11. RegisterScreen.tsx (falls KEINE separate Mobile-Variant existiert)

⚠️ WICHTIG: Nur DESKTOP Screens! 

Falls ein Screen KEINE separate Desktop-Variant hat, notiere:
"❌ Keine separate Desktop-Variant für [ScreenName] gefunden"

Erstelle eine .md Datei namens "PHASE_2_MAIN_APP_DESKTOP_SCREENS.md".

Verwende das Format aus den Instructions.

Dokumentiere für JEDEN Screen:
- Screen Title
- Section Headers
- Buttons (inkl. Padding, Height, Border-Radius)
- Card Titles/Descriptions
- Body Text
- Labels/Metadata
- Input Labels & Placeholders
- Special Elements

💡 TIPP: Desktop hat oft größere Font-Sizes, andere Paddings, andere Layouts!

Nach Fertigstellung schreibe: "✅ PHASE 2 COMPLETE (Desktop Screens) - Ready for Phase 3"
```

### Was wird dokumentiert:
- ✅ 11 Main App DESKTOP Screens
- ✅ Alle Typography-Elemente pro Screen
- ✅ Desktop-spezifische Typography (oft größer als Mobile)

### Output:
`PHASE_2_MAIN_APP_DESKTOP_SCREENS.md`

---

## 🎯 PHASE 3: Main App Components + Modals (10-15 Items)

**Neuer Chat starten!**

### Prompt für Chat 3:

```
Ich habe dir das komplette Lern-App-Projekt hochgeladen.

Bitte lies die Datei "/INSTRUCTIONS_FOR_VSCODE_CLAUDE_TYPOGRAPHY_AUDIT_V2.md".

KONTEXT: Phase 1 und 2 sind abgeschlossen (Main App Screens Mobile + Desktop sind dokumentiert).

DEINE AUFGABE - PHASE 3 von 6:

Dokumentiere die Typography von:

A) ALLEN Main App Components in /src/app/components/:
   1. FlashcardCard.tsx (oder FlashcardItem.tsx)
   2. ExamCard.tsx (oder CompletedExamCard.tsx)
   3. TodoCard.tsx
   4. BottomNavigation.tsx (falls vorhanden - mobile navigation)
   5. TopNavigation.tsx (falls vorhanden)
   6. AIToolCard.tsx (falls vorhanden)
   7. Sidebar.tsx (falls vorhanden - desktop navigation)
   8. Alle anderen card/list components

B) ALLEN Modals in /src/app/components/modals/:
   1. CreateOwnSetModal.tsx
   2. SubtopicsModal.tsx
   3. EditFlashcardModal.tsx
   4. DeleteConfirmationModal.tsx
   5. SettingsModal.tsx
   6. FeedbackModal.tsx
   7. ShareModal.tsx
   8. ExportModal.tsx
   9. Alle anderen Modals

⚠️ WICHTIG: Components/Modals sind oft responsive (gleiche Component für Mobile + Desktop)!

Falls eine Component verschiedene Typography für Mobile vs Desktop hat, dokumentiere BEIDE:
- "Typography (Mobile)"
- "Typography (Desktop)"

Erstelle eine .md Datei namens "PHASE_3_MAIN_APP_COMPONENTS_MODALS.md".

Verwende das Format aus den Instructions.

Dokumentiere für JEDE Component/Modal:
- Titles/Headers
- Buttons (inkl. Dimensions)
- Labels/Metadata
- Body Text
- Special Elements (Scores, Badges, etc.)

Nach Fertigstellung schreibe: "✅ PHASE 3 COMPLETE (Components + Modals) - Ready for Phase 4"
```

### Was wird dokumentiert:
- ✅ Alle Main App Components (~5-7 Components)
- ✅ Alle Main App Modals (~5-10 Modals)
- ✅ Mobile + Desktop Variants (falls unterschiedlich)

### Output:
`PHASE_3_MAIN_APP_COMPONENTS_MODALS.md`

---

## 🎯 PHASE 4: ExamApp MOBILE Screens (9 Screens)

**Neuer Chat starten!**

### Prompt für Chat 4:

```
Ich habe dir das komplette Lern-App-Projekt hochgeladen.

Bitte lies die Datei "/INSTRUCTIONS_FOR_VSCODE_CLAUDE_TYPOGRAPHY_AUDIT_V2.md".

KONTEXT: Phase 1, 2, und 3 sind abgeschlossen (Main App ist komplett dokumentiert).

DEINE AUFGABE - PHASE 4 von 6:

⚠️ WICHTIG: Das ExamApp ist eine SEPARATE App in /src/examapp/!

Dokumentiere die Typography von ALLEN ExamApp MOBILE Screens in:
- /src/examapp/app/components/screens/ ODER
- /src/examapp/app/screens/

(Finde zuerst die richtige Struktur!)

MOBILE Screens zu dokumentieren:
1. SubjectSelectionScreenMobile.tsx (Fach-Auswahl)
2. CategorySelectionScreenMobile.tsx (Kategorie-Auswahl)
3. TopicSelectionScreenMobile.tsx (Themen-Auswahl)
4. SubtopicSelectionScreenMobile.tsx (Unterthemen-Auswahl)
5. ExamConfigurationScreenMobile.tsx (Prüfungs-Einstellungen)
6. StartScreenMobile.tsx (Countdown vor Prüfung)
7. QuestionScreenMobile.tsx (Fragen-Anzeige während Prüfung)
8. ResultsScreenMobile.tsx (oder ResultsScreenWrapperMobile.tsx - Ergebnisse)
9. ExamFeedbackScreenMobile.tsx (oder ExamFeedbackScreenWrapperMobile.tsx - Feedback)

⚠️ WICHTIG: Nur MOBILE Screens! Desktop kommt in Phase 5!

Falls keine separate "Mobile"-Suffix existiert, aber die Screen-Namen sind generisch
(z.B. nur "SubjectSelectionScreen.tsx"), prüfe ob es eine Desktop-Variant gibt.
Falls NEIN, dokumentiere die generische Version in dieser Phase.

Erstelle eine .md Datei namens "PHASE_4_EXAMAPP_MOBILE_SCREENS.md".

Verwende das Format aus den Instructions.

BESONDERS WICHTIG für ExamApp:
- Question Number Display ("Question 3/10")
- Question Text (die Frage selbst - oft größere Font!)
- Answer Options (A, B, C, D - Button oder Radio)
- Timer Display ("08:45" - oft prominent dargestellt)
- Score Display ("8/10", "80%")
- Grade Display ("1.3" - große Bold Number)
- Countdown Display (große "3", "2", "1" - sehr groß!)
- Configuration Labels (alle Settings: Dropdowns, Toggles, Slider)
- Navigation Buttons ("Next", "Previous", "Submit")
- Selection Cards (Subject/Category/Topic Cards - Titel, Icons, etc.)

Nach Fertigstellung schreibe: "✅ PHASE 4 COMPLETE (ExamApp Mobile) - Ready for Phase 5"
```

### Was wird dokumentiert:
- ✅ Alle 9 ExamApp MOBILE Screens
- ✅ Alle Typography-Elemente (besonders: Questions, Answers, Timer, Scores)
- ✅ Special Elements (Countdown, Grade Display, etc.)

### Output:
`PHASE_4_EXAMAPP_MOBILE_SCREENS.md`

---

## 🎯 PHASE 5: ExamApp DESKTOP Screens (9 Screens)

**Neuer Chat starten!**

### Prompt für Chat 5:

```
Ich habe dir das komplette Lern-App-Projekt hochgeladen.

Bitte lies die Datei "/INSTRUCTIONS_FOR_VSCODE_CLAUDE_TYPOGRAPHY_AUDIT_V2.md".

KONTEXT: Phase 1-4 sind abgeschlossen (Main App komplett + ExamApp Mobile dokumentiert).

DEINE AUFGABE - PHASE 5 von 6:

⚠️ WICHTIG: Das ExamApp ist eine SEPARATE App in /src/examapp/!

Dokumentiere die Typography von ALLEN ExamApp DESKTOP Screens in:
- /src/examapp/app/components/screens/ ODER
- /src/examapp/app/screens/

DESKTOP Screens zu dokumentieren:
1. SubjectSelectionScreenDesktop.tsx
2. CategorySelectionScreenDesktop.tsx
3. TopicSelectionScreenDesktop.tsx
4. SubtopicSelectionScreenDesktop.tsx
5. ExamConfigurationScreenDesktop.tsx
6. StartScreenDesktop.tsx
7. QuestionScreenDesktop.tsx
8. ResultsScreenDesktop.tsx (oder ResultsScreenWrapperDesktop.tsx)
9. ExamFeedbackScreenDesktop.tsx (oder ExamFeedbackScreenWrapperDesktop.tsx)

⚠️ WICHTIG: Nur DESKTOP Screens!

Falls keine separate Desktop-Variants existieren, notiere:
"❌ Keine separate Desktop-Variants gefunden - ExamApp verwendet generische Screens (bereits in Phase 4 dokumentiert)"

Erstelle eine .md Datei namens "PHASE_5_EXAMAPP_DESKTOP_SCREENS.md".

Verwende das Format aus den Instructions.

BESONDERS WICHTIG für ExamApp Desktop:
- Oft größere Question Text (mehr Platz)
- Oft andere Answer Layout (2-column statt stacked)
- Timer kann anders positioniert sein
- Desktop hat oft zusätzliche Navigation (Breadcrumbs, etc.)

Nach Fertigstellung schreibe: "✅ PHASE 5 COMPLETE (ExamApp Desktop) - Ready for Phase 6"
```

### Was wird dokumentiert:
- ✅ Alle 9 ExamApp DESKTOP Screens
- ✅ Desktop-spezifische Typography
- ✅ Desktop-spezifische Layouts (falls Typography anders)

### Output:
`PHASE_5_EXAMAPP_DESKTOP_SCREENS.md`

---

## 🎯 PHASE 6: ExamApp Components + Final Summary

**Neuer Chat starten!**

### Prompt für Chat 6:

```
Ich habe dir das komplette Lern-App-Projekt hochgeladen.

Bitte lies die Datei "/INSTRUCTIONS_FOR_VSCODE_CLAUDE_TYPOGRAPHY_AUDIT_V2.md".

KONTEXT: Phase 1-5 sind abgeschlossen (Alle Screens sind dokumentiert!).

DEINE AUFGABE - PHASE 6 von 6 (FINAL):

A) Dokumentiere ExamApp Components in /src/examapp/app/components/:
   1. SubjectCard.tsx (falls separate Component)
   2. CategoryCard.tsx (falls separate Component)
   3. TopicCard.tsx (falls separate Component)
   4. QuestionCard.tsx (falls separate Component)
   5. AnswerOption.tsx (falls separate Component)
   6. Timer.tsx (falls separate Component)
   7. ProgressBar.tsx (falls separate Component)
   8. ScoreDisplay.tsx (falls separate Component)
   9. GradeDisplay.tsx (falls separate Component)
   10. Alle anderen ExamApp-spezifischen Components

B) Erstelle DESIGN SYSTEM SUMMARY:

   **Font Families Used:**
   - Liste alle verwendeten Font-Families
   - Beispiel: Poppins (Bold, SemiBold, Medium, Regular)
   
   **Font Weights Map:**
   - 700 = Bold (Poppins:Bold, font-bold)
   - 600 = SemiBold (Poppins:SemiBold, font-semibold)
   - 500 = Medium (Poppins:Medium, font-medium)
   - 400 = Regular (Poppins:Regular, font-normal)
   
   **Common Font Sizes:**
   Gruppiere alle gefundenen Font-Sizes:
   - Large (Headings): 24px, 22px, 20px, 18px
   - Medium (Subheadings, Buttons): 17px, 16px, 15px
   - Small (Body, Labels): 14px, 13px, 12px
   - Tiny (Metadata): 11px, 10px
   
   **Button Patterns:**
   - Primary Buttons: Font-Size X, Weight X, Padding X, Height X
   - Secondary Buttons: ...
   - Small Buttons: ...
   
   **Mobile vs Desktop Differences:**
   - Screen Titles: Mobile: 17px, Desktop: 20px (Beispiel)
   - Section Headers: Mobile: 18px, Desktop: 22px
   - Buttons: Mobile: h-[44px], Desktop: h-[48px]
   - [Alle Unterschiede auflisten]

C) Erstelle COMPONENT PATTERNS:

   **Pattern: Screen Titles**
   - Mobile: Poppins:SemiBold, 17px, Weight 600
   - Desktop: Poppins:Bold, 20px, Weight 700
   
   **Pattern: Main Section Headers (h2)**
   - Beispiel: "Your ToDo's", "AI Tools"
   - Mobile: Poppins:Bold, 18-20px, Weight 700
   - Desktop: Poppins:Bold, 20-24px, Weight 700
   
   **Pattern: Sub-Section Headers (h3)**
   - ...
   
   **Pattern: Primary Buttons**
   - Mobile: Poppins:SemiBold, 16px, px-6 py-3, h-[44px]
   - Desktop: Poppins:SemiBold, 16px, px-8 py-3, h-[48px]
   
   **Pattern: Card Titles**
   - ...
   
   **Pattern: Body Text**
   - ...
   
   **Pattern: Small Metadata/Labels**
   - ...
   
   **Pattern: Large Numbers (Scores, Grades)**
   - Mobile: Poppins:Bold, 22-32px, Weight 700
   - Desktop: Poppins:Bold, 32-48px, Weight 700
   
   **Pattern: ExamApp Question Text**
   - Mobile: ...
   - Desktop: ...
   
   **Pattern: ExamApp Timer Display**
   - Mobile: ...
   - Desktop: ...

D) Erstelle CRITICAL RULES FOR CONVERSION:

   **Rule 1: Never Lighten Font-Weights**
   - If original is Poppins:Bold (700), keep 700
   - If original is Poppins:SemiBold (600), keep 600
   - NEVER convert Bold to SemiBold or Medium
   
   **Rule 2: Preserve Exact Font Sizes**
   - text-[20px] stays 20px, don't convert to text-xl
   - Keep exact pixel values, don't round
   
   **Rule 3: Maintain Font-Family Declarations**
   - Keep font-['Poppins:Bold',sans-serif] format exactly
   - Don't simplify to just font-bold
   
   **Rule 4: Preserve Button Dimensions**
   - Button padding affects perceived text weight
   - Keep exact px-X py-Y values
   - Keep exact heights (h-[44px], h-[48px], etc.)
   
   **Rule 5: Respect Mobile vs Desktop Differences**
   - Mobile and Desktop can have different typography
   - Don't mix Mobile typography into Desktop or vice versa
   - Preserve responsive breakpoints
   
   **Rule 6: Don't Skip Small Elements**
   - Metadata, timestamps, badges - all matter
   - Even "3 cards" or "2 days ago" should match original

E) Erstelle CHANGELOG:

   **v1.0 - February 15, 2026**
   - Complete typography audit by Claude Opus 4.6
   - Phase 1: Main App Mobile Screens (11 screens)
   - Phase 2: Main App Desktop Screens (11 screens)
   - Phase 3: Main App Components + Modals (~15 items)
   - Phase 4: ExamApp Mobile Screens (9 screens)
   - Phase 5: ExamApp Desktop Screens (9 screens)
   - Phase 6: ExamApp Components + Summary (~10 items)
   - Total: ~65 items documented
   - Created Design System Summary
   - Created Component Patterns (Mobile + Desktop)
   - Created Critical Conversion Rules

Erstelle eine .md Datei namens "PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md".

Nach Fertigstellung schreibe: "✅ PHASE 6 COMPLETE - ALL 6 PHASES DONE! 🎉"
```

### Was wird dokumentiert:
- ✅ Alle ExamApp Components
- ✅ **Design System Summary** (Fonts, Weights, Sizes, Mobile vs Desktop!)
- ✅ **Component Patterns** (was wird konsistent verwendet? Mobile vs Desktop!)
- ✅ **Critical Conversion Rules** (6 Regeln)
- ✅ **Changelog**

### Output:
`PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md`

---

## 🔄 PHASE 7 (Optional): Merge All Phases

**Neuer Chat starten (oder bei Phase 6 Chat bleiben)**

### Prompt für Chat 7:

```
Bitte lade folgende 6 .md Dateien hoch:
1. PHASE_1_MAIN_APP_MOBILE_SCREENS.md
2. PHASE_2_MAIN_APP_DESKTOP_SCREENS.md
3. PHASE_3_MAIN_APP_COMPONENTS_MODALS.md
4. PHASE_4_EXAMAPP_MOBILE_SCREENS.md
5. PHASE_5_EXAMAPP_DESKTOP_SCREENS.md
6. PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md

AUFGABE:

Merge alle 6 Phasen in EINE vollständige Datei:
"COMPLETE_ORIGINAL_TYPOGRAPHY_AUDIT.md"

Struktur:
1. Design System Summary (aus Phase 6)
2. Mobile vs Desktop Differences (aus Phase 6)
3. Main App - Mobile Screens (aus Phase 1)
4. Main App - Desktop Screens (aus Phase 2)
5. Main App - Components (aus Phase 3)
6. Main App - Modals (aus Phase 3)
7. ExamApp - Mobile Screens (aus Phase 4)
8. ExamApp - Desktop Screens (aus Phase 5)
9. ExamApp - Components (aus Phase 6)
10. Component Patterns (aus Phase 6)
11. Critical Conversion Rules (aus Phase 6)
12. Changelog (aus Phase 6)
13. Completion Checklist

Erstelle diese finale Datei!
```

### Output:
`COMPLETE_ORIGINAL_TYPOGRAPHY_AUDIT.md` ← **FINALE DOKUMENTATION**

---

## 📋 ZUSAMMENFASSUNG

### Du brauchst:

**6 CHATS** (+ optional 1 Merge-Chat):

| Phase | Chat | Files Upload | Output | Items |
|-------|------|--------------|--------|-------|
| **1** | Neuer Chat | Project + Instructions V2 | `PHASE_1_MAIN_APP_MOBILE_SCREENS.md` | 11 Mobile Screens |
| **2** | Neuer Chat | Project + Instructions V2 | `PHASE_2_MAIN_APP_DESKTOP_SCREENS.md` | 11 Desktop Screens |
| **3** | Neuer Chat | Project + Instructions V2 | `PHASE_3_MAIN_APP_COMPONENTS_MODALS.md` | ~10-15 Items |
| **4** | Neuer Chat | Project + Instructions V2 | `PHASE_4_EXAMAPP_MOBILE_SCREENS.md` | 9 Mobile Screens |
| **5** | Neuer Chat | Project + Instructions V2 | `PHASE_5_EXAMAPP_DESKTOP_SCREENS.md` | 9 Desktop Screens |
| **6** | Neuer Chat | Project + Instructions V2 | `PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md` | ~10 Items + Summary |
| **7** | Neuer Chat (optional) | Alle 6 Phase-Dateien | `COMPLETE_ORIGINAL_TYPOGRAPHY_AUDIT.md` | Merge |

### Pro Chat:
- ✅ Upload: **Project Folder + Instructions V2**
- ✅ Kopiere Prompt für diese Phase
- ✅ Warte bis Claude fertig ist ("✅ PHASE X COMPLETE")
- ✅ Download die Output-Datei
- ✅ **Neuer Chat** für nächste Phase

---

## 💡 WARUM 6 PHASEN?

### ✅ Vorteile:
1. **Klar getrennt:** Mobile vs Desktop separat
2. **Überschaubar:** Jede Phase hat ~9-15 Items
3. **Fokus:** Claude konzentriert sich auf EINE Sache (Mobile ODER Desktop)
4. **Qualität:** Keine Verwechslungen zwischen Mobile/Desktop Typography
5. **Fehlertoleranz:** Wenn eine Phase scheitert, nur diese wiederholen
6. **Flexibilität:** Du kannst Phasen in beliebiger Reihenfolge machen

### ❌ Alternative (4 Phasen mit Mobile+Desktop gemischt):
- Claude könnte Mobile und Desktop Typography verwechseln
- Schwer zu debuggen wenn ein Screen fehlt
- Unübersichtlich

### ❌ Alternative (1 Chat):
- 60-80 Items in einem Chat
- Claude wird müde/nachlässig
- Vergisst Details am Ende
- Hohe Fehlerquote

---

## 🚀 START-ANLEITUNG

### Schritt 1: Vorbereitung
- ✅ Altes Projekt-Folder bereit
- ✅ `INSTRUCTIONS_FOR_VSCODE_CLAUDE_TYPOGRAPHY_AUDIT_V2.md` bereit
- ✅ VS Code mit Claude Opus 4.6 öffnen

### Schritt 2: Phase 1 starten (Mobile Screens)
1. **Neuen Chat** in VS Code öffnen
2. **Project Folder** hochladen
3. **Instructions V2** hochladen
4. **Prompt für Phase 1** kopieren (siehe oben)
5. Senden & warten

### Schritt 3: Phase 1 abschließen
1. Warte bis "✅ PHASE 1 COMPLETE (Mobile Screens)"
2. **Download** `PHASE_1_MAIN_APP_MOBILE_SCREENS.md`
3. **Überprüfen:** Sind alle 11 Mobile Screens dokumentiert?

### Schritt 4: Phase 2 starten (Desktop Screens)
1. **NEUEN CHAT** öffnen (wichtig!)
2. **Project Folder** hochladen (nochmal!)
3. **Instructions V2** hochladen (nochmal!)
4. **Prompt für Phase 2** kopieren
5. Senden & warten

### Schritt 5-10: Phase 3, 4, 5, 6, 7
Wiederhole für jede Phase!

---

## ⚠️ WICHTIGE HINWEISE

### Bei jedem neuen Chat:
- ✅ **Project Folder** NOCHMAL hochladen
- ✅ **Instructions V2** NOCHMAL hochladen
- ✅ Claude hat KEINEN Kontext von vorherigen Chats!

### Wenn Claude nachlässig wird:
- ❌ NICHT in gleichem Chat weitermachen
- ✅ Neuen Chat starten
- ✅ Phase wiederholen

### Wenn eine Datei fehlt:
- Claude notiert: `❌ Keine separate Mobile-Variant für SettingsScreen gefunden`
- Das ist OK! Einfach weitermachen

### Quality Check nach jeder Phase:
- ✅ Sind alle erwarteten Files dokumentiert?
- ✅ Sind Line-Numbers vorhanden?
- ✅ Sind className Strings vollständig?
- ✅ Sind Button Dimensions dokumentiert?
- ✅ Ist Mobile vs Desktop klar getrennt?

---

## 📊 FORTSCHRITT TRACKING

### Checklist zum Abhaken:

- [ ] **PHASE 1:** Main App Mobile Screens (11) → `PHASE_1_MAIN_APP_MOBILE_SCREENS.md`
- [ ] **PHASE 2:** Main App Desktop Screens (11) → `PHASE_2_MAIN_APP_DESKTOP_SCREENS.md`
- [ ] **PHASE 3:** Main App Components + Modals (~10-15) → `PHASE_3_MAIN_APP_COMPONENTS_MODALS.md`
- [ ] **PHASE 4:** ExamApp Mobile Screens (9) → `PHASE_4_EXAMAPP_MOBILE_SCREENS.md`
- [ ] **PHASE 5:** ExamApp Desktop Screens (9) → `PHASE_5_EXAMAPP_DESKTOP_SCREENS.md`
- [ ] **PHASE 6:** ExamApp Components + Summary (~10) → `PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md`
- [ ] **PHASE 7:** Merge All (optional) → `COMPLETE_ORIGINAL_TYPOGRAPHY_AUDIT.md`

### Total Items Documented:
- Main App Mobile Screens: 11
- Main App Desktop Screens: 11
- Main App Components: ~5-7
- Main App Modals: ~5-10
- ExamApp Mobile Screens: 9
- ExamApp Desktop Screens: 9
- ExamApp Components: ~5-10
- **TOTAL: ~55-66 Items**

---

## 🎯 MOBILE vs DESKTOP - Was zu erwarten ist

### Typography Unterschiede typischerweise:

**Mobile:**
- Kleinere Font-Sizes (17px vs 20px Screen Titles)
- Kompaktere Buttons (h-[44px] vs h-[48px])
- Tightere Paddings (px-4 py-2 vs px-6 py-3)
- Konservativere Line-Heights (leading-tight)

**Desktop:**
- Größere Font-Sizes (mehr Platz)
- Größere Buttons (bessere Click-Targets nicht nötig, aber visuell größer)
- Großzügigere Paddings
- Lockerere Line-Heights (leading-normal oder leading-relaxed)

**Aber:** Nicht immer! Manchmal ist Typography identisch, nur Layout ändert sich!

---

## 🎯 FINALE NUTZUNG

Nach allen 6 (oder 7) Phasen hast du:

1. **6 Phase-Dateien** (oder 1 Merge-Datei)
2. **Vollständige Typography-Dokumentation** des alten Projekts (Mobile + Desktop!)
3. **Design System Summary** mit Mobile vs Desktop Differences
4. **Component Patterns** (Mobile vs Desktop)
5. **Conversion Rules**

**Diese Dokumentation verwendest du dann als Basis, um die NEUE App (bei Figma Make) anzupassen!**

---

## 💡 PRO TIPPS

### Parallel arbeiten möglich?
Theoretisch JA - du könntest Phase 1 + 2 parallel starten (2 VS Code Fenster).
ABER: Ich empfehle sequenziell, damit du Phase 1 erst reviewen kannst.

### Was wenn Desktop nicht existiert?
Falls ein Screen KEINE Desktop-Variant hat, notiert Claude das.
Beispiel: `❌ Keine separate Desktop-Variant für ChatScreen gefunden`
→ Dann verwendest du die Mobile-Doku auch für Desktop!

### Was wenn nur generische Screens existieren (kein Mobile/Desktop Suffix)?
Phase 1 (Mobile) Prompt sagt:
"Falls generisch, dokumentiere in dieser Phase"
Phase 2 (Desktop) Prompt sagt:
"Falls generisch und bereits in Phase 1 dokumentiert, überspringe"

### Wann Phase 7 (Merge) machen?
- Option A: Sofort nach Phase 6 (im gleichen Chat)
- Option B: Später separat
- Option C: Gar nicht (du verwendest die 6 separaten Files)

Empfehlung: **Option C** - 6 separate Files sind übersichtlicher!
Nur mergen wenn du wirklich EIN großes Dokument brauchst.

---

**Viel Erfolg mit den 6 Phasen! 🚀**
