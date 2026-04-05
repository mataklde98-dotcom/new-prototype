# Typography Conversion - 6-Phase Implementation Strategy

## 📊 Overview

Diese Datei enthält **6 eigenständige Chat-Prompts** für die Typography-Conversion der SoStudy Learning App.

**Verwendung:** Öffne für **jede Phase einen separaten Chat** in VS Code Claude und kopiere den entsprechenden Prompt.

---

## 🎯 Phase Strategy

| Phase | Scope | Screens/Items | Input Dokumentation | Empfohlene Reihenfolge |
|-------|-------|---------------|---------------------|------------------------|
| **Phase A** | Main App Mobile Screens | 11 Screens | PHASE_1_MAIN_APP_MOBILE_SCREENS.md | **START HIER!** |
| **Phase B** | Main App Desktop Screens | 11 Screens | PHASE_2_MAIN_APP_DESKTOP_SCREENS.md | Nach Phase A |
| **Phase C** | Main App Components + Modals | ~15 Items | PHASE_3_MAIN_APP_COMPONENTS_MODALS.md | Nach Phase B |
| **Phase D** | ExamApp Mobile Screens | 9 Screens | PHASE_4_EXAMAPP_MOBILE_SCREENS.md | Nach Phase C |
| **Phase E** | ExamApp Desktop Screens | 9 Screens | PHASE_5_EXAMAPP_DESKTOP_SCREENS.md | Nach Phase D |
| **Phase F** | ExamApp Components | ~10 Items | PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md | Nach Phase E (Final!) |

**Total:** ~65 Items über 6 Phasen

**Empfehlung:** Arbeite **sequenziell** (Phase A → B → C → D → E → F) für beste Qualität!

**Alternative:** Wenn du schneller willst, kannst du **parallel** arbeiten:
- Chat 1: Phase A (Main App Mobile)
- Chat 2: Phase D (ExamApp Mobile)
- Etc.

---

## ⚠️ WICHTIG: Lies ZUERST!

**Bevor du IRGENDEINEN Prompt verwendest:**

1. **Öffne und lies:** `PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md`
2. **Besonders wichtig:** Section "B) FINAL DESIGN SYSTEM SUMMARY FOR CONVERSION"
3. **Fokus auf:** "CRITICAL CONVERSION RULES"

**Diese 6 Rules MUSST du bei JEDER Phase beachten:**

### **Rule 1: Never Lighten Font-Weights**
- Bold (700) → bleibt Bold → **NICHT** zu SemiBold (600)!
- SemiBold (600) → bleibt SemiBold → **NICHT** zu Medium (500)!
- Keep original weights EXACTLY!

### **Rule 2: Preserve Exact Font Sizes**
- `text-[17px]` → bleibt **17px** → **NICHT** `text-lg` (18px)!
- `text-[20px]` → bleibt **20px** → **NICHT** `text-xl` (20px wäre ok, aber wir wollen exakte Werte)!
- Use exact pixel values from documentation!

### **Rule 3: Maintain Font-Family Declarations**
- `font-['Poppins:Bold',sans-serif]` → keep exactly → **NICHT** vereinfachen zu `font-bold`!
- Font-family AND font-weight must match documentation!

### **Rule 4: Preserve Button Dimensions**
- `h-[44px]` → bleibt **44px**
- `px-6 py-3` → bleibt **px-6 py-3**
- `rounded-2xl` → bleibt **rounded-2xl**
- Button padding affects perceived text weight!

### **Rule 5: Respect Mobile vs Desktop Differences**
- Mobile: `text-[17px]` ≠ Desktop: `text-[20px]`
- Keep responsive breakpoints: `text-[17px] lg:text-[20px]`
- **NICHT** Mobile Typography in Desktop verwenden (oder umgekehrt)!

### **Rule 6: Don't Skip Small Elements**
- Metadata, Timestamps, Badges - **ALLE** wichtig!
- Even "3 cards" oder "2 days ago" muss matchen!

---

## 📋 Workflow pro Phase

**Für JEDE Phase:**

1. **Neuen Chat öffnen** in VS Code
2. **Prompt kopieren** (siehe unten)
3. **Prompt senden** an Claude
4. **Claude arbeitet** Screen-by-Screen
5. **Review** jede Änderung (Git Diff!)
6. **Test** die App
7. **Commit** nach jedem Screen (oder mehreren)
8. **Phase Complete** ✅

**Nach Phase Complete:**
- Weiter zur nächsten Phase ODER
- Pause machen & Review!

---

---

---

# 🚀 PHASE A: Main App Mobile Screens

**Öffne einen NEUEN Chat in VS Code und kopiere folgenden Prompt:**

---

```markdown
# 🎯 TYPOGRAPHY CONVERSION - PHASE A: Main App Mobile Screens

## KONTEXT

Ich habe eine **Learning App** komplett umgebaut (neue saubere Architektur).

Die **ALTE APP** hatte perfekte Typography (Poppins mit exakten Font-Weights, Sizes, Button Dimensions).

Die **NEUE APP** (dieses Projekt hier) hat die gleichen Features, aber die Typography ist **NICHT** mehr korrekt:
- ❌ Font-Weights zu dünn (SemiBold statt Bold, Medium statt SemiBold)
- ❌ Font-Sizes anders (18px statt 20px, etc.)
- ❌ Button Dimensions falsch (andere Paddings, Heights)
- ❌ Font-Family Declarations fehlen oder vereinfacht

**Deine Aufgabe (PHASE A):** Übernehme die **EXAKTE TYPOGRAPHY** aus der alten App in die **11 Mobile Screens** der Main App!

---

## 📚 INPUT DOKUMENTATION

**Haupt-Dokumentation für diese Phase:**
- **`PHASE_1_MAIN_APP_MOBILE_SCREENS.md`** ← Lies diese Datei KOMPLETT!

**Zusätzlich wichtig (Critical Rules):**
- **`PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md`** → Section "B) CRITICAL CONVERSION RULES" ← Lies diese ZUERST!

---

## ⚠️ CRITICAL CONVERSION RULES

**Diese 6 Rules MUSST du IMMER beachten:**

### Rule 1: Never Lighten Font-Weights 🚨
- Original: `Poppins:Bold` (700) → **KEEP 700** (NICHT zu 600!)
- Original: `Poppins:SemiBold` (600) → **KEEP 600** (NICHT zu 500!)
- Original: `Poppins:Medium` (500) → **KEEP 500** (NICHT zu 400!)

**Beispiel:**
```tsx
// ❌ FALSCH (zu dünn!)
<h1 className="text-[20px] font-semibold">Title</h1>

// ✅ RICHTIG (Original war Bold!)
<h1 className="font-['Poppins:Bold',sans-serif] text-[20px]">Title</h1>
```

### Rule 2: Preserve Exact Font Sizes 📏
- Original: `text-[17px]` → **KEEP 17px** (NICHT zu text-lg!)
- Original: `text-[20px]` → **KEEP 20px** (exakte Werte!)
- Use exact pixel values from documentation!

### Rule 3: Maintain Font-Family Declarations 🔤
- Original: `font-['Poppins:Bold',sans-serif]` → **KEEP exactly** (NICHT vereinfachen!)
- Font-family AND font-weight must match!

**Beispiel:**
```tsx
// ❌ FALSCH (Font-Family fehlt!)
<h1 className="text-[20px] font-bold">Title</h1>

// ✅ RICHTIG (Font-Family + Weight!)
<h1 className="font-['Poppins:Bold',sans-serif] text-[20px]">Title</h1>
```

### Rule 4: Preserve Button Dimensions 📦
- Original: `h-[44px] px-6 py-3 rounded-2xl` → **KEEP exactly**
- Button padding affects perceived text weight!

### Rule 5: Respect Mobile vs Desktop Differences 📱💻
- Mobile: `text-[17px]` ≠ Desktop: `text-[20px]`
- Keep responsive breakpoints: `text-[17px] lg:text-[20px]`
- **Diese Phase = MOBILE ONLY!** (Desktop = Phase B)

### Rule 6: Don't Skip Small Elements 🔍
- Metadata, Timestamps, Badges - **ALLE** wichtig!
- Even "3 cards" oder "2 days ago" muss matchen!

---

## 🎯 PHASE A SCOPE

**11 Mobile Screens** aus der Main App (dokumentiert in PHASE_1):

1. **HomeScreenMobile.tsx**
2. **MyFlashcardsScreenMobile.tsx**
3. **ExamScreenMobile.tsx** (falls vorhanden)
4. **CompletedExamsScreenMobile.tsx**
5. **GenerateFlashcardsScreenMobile.tsx**
6. **ProfilScreenMobile.tsx**
7. **ChatScreenMobile.tsx**
8. **KIToolsScreenMobile.tsx**
9. **SettingsScreenMobile.tsx** (falls vorhanden)
10. **LoginScreenMobile.tsx** (falls vorhanden)
11. **RegisterScreenMobile.tsx** (falls vorhanden)

**Wahrscheinliche Pfade in neuer App:**
- `/src/app/components/[ScreenName].tsx`
- `/src/app/screens/[ScreenName].tsx`

**Falls ein Screen NICHT existiert:** Notiere `⚠️ [ScreenName] not found - skipped` und mache weiter!

---

## 📋 WORKFLOW PRO SCREEN

Für **JEDEN Screen** (von 1-11):

### Schritt 1: Dokumentation lesen
- Öffne `PHASE_1_MAIN_APP_MOBILE_SCREENS.md`
- Finde die Section für diesen Screen (z.B. "SCREEN 1: HomeScreenMobile.tsx")
- Lies ALLE Typography-Elemente:
  - Screen Title
  - Section Headers
  - Buttons (Primary, Secondary, Icon Buttons)
  - Card Titles
  - Body Text
  - Labels/Metadata ← **NICHT VERGESSEN!**
  - Timestamps ← **NICHT VERGESSEN!**
  - Badges ← **NICHT VERGESSEN!**
  - Input Placeholders ← **NICHT VERGESSEN!**

### Schritt 2: Datei finden
- Suche die Datei in der neuen App
- Wahrscheinlich: `/src/app/components/[ScreenName].tsx`
- Falls nicht gefunden: Notiere und skippe

### Schritt 3: Vergleichen & Änderungsliste erstellen
Für **JEDES Typography-Element:**

**Beispiel Analyse:**

```markdown
## HomeScreenMobile.tsx - Änderungsliste

### 1. Screen Title "Hallo, {firstName}!"
- **DOKU (Original):** `font-['Poppins:Bold',sans-serif] text-[18px]`
- **AKTUELL (Neu):** `font-semibold text-lg`
- **PROBLEM:** Font-Family fehlt! Font-Size falsch!
- **FIX:** Ändere zu `font-['Poppins:Bold',sans-serif] text-[18px]`

### 2. Section Header "Your ToDo's"
- **DOKU (Original):** `font-['Poppins:Bold',sans-serif] text-[18px]`
- **AKTUELL (Neu):** `font-bold text-[18px]`
- **PROBLEM:** Font-Family Declaration fehlt!
- **FIX:** Ändere zu `font-['Poppins:Bold',sans-serif] text-[18px]`

### 3. Primary Button "Start Exam"
- **DOKU (Original):** `h-[44px] px-6 py-3 rounded-2xl font-['Poppins:SemiBold',sans-serif] text-[16px]`
- **AKTUELL (Neu):** `h-[40px] px-4 py-2 rounded-lg font-semibold text-[15px]`
- **PROBLEM:** ALLES falsch! Height, Padding, Border-Radius, Font-Family, Font-Size!
- **FIX:** Komplett ersetzen mit Original-Werten

(... für ALLE Elemente!)
```

**WICHTIG:** Erstelle diese Liste **BEVOR** du irgendetwas änderst! Ich möchte reviewen können!

### Schritt 4: Implementieren
- Verwende `edit_tool` für jedes Element (oder gruppiere wenn sinnvoll)
- Kopiere exakte className Strings aus Dokumentation
- Ändere **NUR** Typography - keine Logic, keine anderen Styles (außer du musst)!

### Schritt 5: Verifizieren
Nach jeder Änderung prüfe:
- ✅ Font-Family korrekt? (`font-['Poppins:Bold',sans-serif]`)
- ✅ Font-Size exakt? (`text-[20px]`)
- ✅ Font-Weight beibehalten? (Bold = 700, nicht 600!)
- ✅ Button Dimensions korrekt? (Height, Padding, Border-Radius)
- ✅ Nichts anderes verändert? (Logic, Colors, Margins, etc.)

### Schritt 6: Completion
Schreibe nach jedem Screen:
```
✅ [ScreenName] COMPLETE - Typography matched to original

Änderungen:
- [Liste der Änderungen]

Bereit für nächsten Screen!
```

---

## 🚀 START-ANWEISUNG

**Starte mit Screen 1: HomeScreenMobile.tsx**

1. Lies `PHASE_1_MAIN_APP_MOBILE_SCREENS.md` → Section "SCREEN 1: HomeScreenMobile.tsx"
2. Finde `HomeScreenMobile.tsx` in diesem Projekt
3. Erstelle Änderungsliste (siehe Workflow Schritt 3)
4. **ZEIGE MIR DIE ÄNDERUNGSLISTE ZUERST** (ich möchte reviewen!)
5. Nach meiner Bestätigung: Implementiere die Änderungen
6. Verifiziere alle 6 Critical Rules
7. Schreibe "✅ HomeScreenMobile.tsx COMPLETE"

**Dann frage mich:** "Soll ich mit Screen 2: MyFlashcardsScreenMobile.tsx weitermachen?"

---

## ⚠️ WICHTIGE HINWEISE

### Was darfst du ändern:
✅ Font-Family (z.B. zu `font-['Poppins:Bold',sans-serif]`)
✅ Font-Size (z.B. zu `text-[20px]`)
✅ Font-Weight (z.B. von `font-semibold` zu `font-['Poppins:Bold',sans-serif]`)
✅ Button Height (z.B. zu `h-[44px]`)
✅ Button Padding (z.B. zu `px-6 py-3`)
✅ Button Border-Radius (z.B. zu `rounded-2xl`)
✅ Line-Height (z.B. zu `leading-tight`) - wenn in Doku angegeben

### Was darfst du NICHT ändern:
❌ Logic (onClick, useState, etc.)
❌ Colors (text-white, bg-blue-500, etc.) - **UNLESS** es Teil der Typography-Änderung ist
❌ Margins (mt-4, mb-2, etc.) - außer bei Buttons wenn in Doku angegeben
❌ Funktionalität
❌ Imports
❌ Props

### Wenn Font Import fehlt:
Falls Poppins nicht importiert ist:
1. Prüfe `/src/styles/fonts.css`
2. Falls nicht vorhanden, füge hinzu:
```css
/* Poppins Font Import */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
```
3. Prüfe dass `fonts.css` in `/src/styles/index.css` importiert wird

### Wenn Screen nicht existiert:
Falls ein Screen aus PHASE_1 in der neuen App NICHT existiert:
- Notiere: `⚠️ [ScreenName] not found in new app - skipped`
- Mache weiter mit nächstem Screen

### Wenn Screen anders heißt:
Falls ein Screen anders heißt (z.B. `ProfileScreen.tsx` statt `ProfilScreen.tsx`):
- Verwende den neuen Namen
- Notiere: `ℹ️ Using ProfileScreen.tsx instead of ProfilScreen.tsx`

---

## 📊 PROGRESS TRACKING

**Checklist für diese Phase:**

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

**Progress:** 0/11 ➜ **Ziel:** 11/11 ✅

**Nach jedem Screen:** Update diese Liste in deiner Antwort!

---

## ✅ PHASE A COMPLETION CRITERIA

**Phase A ist complete wenn:**

✅ Alle 11 Screens konvertiert (oder als "not found" markiert)
✅ Alle 6 Critical Rules eingehalten
✅ Jeder Screen hat Änderungsliste + Implementation
✅ Keine Syntax-Errors
✅ App läuft noch

**Dann schreibe:**
```
🎉 PHASE A COMPLETE - All Main App Mobile Screens converted!

Screens converted: [X/11]
Screens skipped: [Liste, falls welche fehlen]

Bereit für PHASE B (Main App Desktop Screens)!
```

---

## 🚀 LOS GEHT'S!

**Starte jetzt mit Screen 1: HomeScreenMobile.tsx**

Ich warte auf deine Änderungsliste! 📋
```

---

---

---

# 🚀 PHASE B: Main App Desktop Screens

**Öffne einen NEUEN Chat in VS Code und kopiere folgenden Prompt:**

---

```markdown
# 🎯 TYPOGRAPHY CONVERSION - PHASE B: Main App Desktop Screens

## KONTEXT

Ich habe eine **Learning App** komplett umgebaut (neue saubere Architektur).

Die **ALTE APP** hatte perfekte Typography (Poppins mit exakten Font-Weights, Sizes, Button Dimensions).

Die **NEUE APP** (dieses Projekt hier) hat die gleichen Features, aber die Typography ist **NICHT** mehr korrekt.

**Deine Aufgabe (PHASE B):** Übernehme die **EXAKTE TYPOGRAPHY** aus der alten App in die **11 Desktop Screens** der Main App!

**Wichtig:** Desktop Typography ist **UNTERSCHIEDLICH** von Mobile Typography!

---

## 📚 INPUT DOKUMENTATION

**Haupt-Dokumentation für diese Phase:**
- **`PHASE_2_MAIN_APP_DESKTOP_SCREENS.md`** ← Lies diese Datei KOMPLETT!

**Zusätzlich wichtig (Critical Rules):**
- **`PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md`** → Section "B) CRITICAL CONVERSION RULES" ← Lies diese ZUERST!

---

## ⚠️ CRITICAL CONVERSION RULES

**Diese 6 Rules MUSST du IMMER beachten:**

### Rule 1: Never Lighten Font-Weights 🚨
- Bold (700) bleibt Bold - **NICHT** zu SemiBold (600)!
- SemiBold (600) bleibt SemiBold - **NICHT** zu Medium (500)!

### Rule 2: Preserve Exact Font Sizes 📏
- `text-[20px]` bleibt **20px** - **NICHT** zu `text-xl`!
- Use exact pixel values from documentation!

### Rule 3: Maintain Font-Family Declarations 🔤
- `font-['Poppins:Bold',sans-serif]` - **NICHT** vereinfachen zu `font-bold`!

### Rule 4: Preserve Button Dimensions 📦
- `h-[48px] px-8 py-4 rounded-2xl` → **KEEP exactly**

### Rule 5: Respect Mobile vs Desktop Differences 📱💻
- Desktop kann **ANDERE** Typography haben als Mobile!
- **Beispiel:** Mobile: `text-[17px]` | Desktop: `text-[20px]`
- Responsive: `text-[17px] lg:text-[20px]` (Mobile 17px, Desktop 20px)
- **Diese Phase = DESKTOP ONLY!**

### Rule 6: Don't Skip Small Elements 🔍
- Metadata, Timestamps, Badges - **ALLE** wichtig!

---

## 🎯 PHASE B SCOPE

**11 Desktop Screens** aus der Main App (dokumentiert in PHASE_2):

1. **HomeScreenDesktop.tsx** (oder **HomeScreen.tsx** falls keine separate Mobile-Version)
2. **MyFlashcardsScreenDesktop.tsx**
3. **ExamScreenDesktop.tsx** (falls vorhanden)
4. **CompletedExamsScreenDesktop.tsx**
5. **GenerateFlashcardsScreenDesktop.tsx**
6. **ProfilScreenDesktop.tsx**
7. **ChatScreenDesktop.tsx**
8. **KIToolsScreenDesktop.tsx**
9. **SettingsScreenDesktop.tsx** (falls vorhanden)
10. **LoginScreen.tsx** (falls keine separate Mobile-Version)
11. **RegisterScreen.tsx** (falls keine separate Mobile-Version)

**Wahrscheinliche Pfade:**
- `/src/app/components/[ScreenName].tsx`
- `/src/app/screens/[ScreenName].tsx`

**Wichtig:** Manche Screens haben separate Mobile/Desktop Dateien, manche nutzen responsive Breakpoints (`lg:`) in **EINER** Datei!

**Falls Screen responsive ist (eine Datei für Mobile + Desktop):**
- Prüfe ob Mobile Typography bereits korrekt ist (aus Phase A)
- Ändere **NUR** Desktop-Breakpoints (`lg:`, `xl:`, etc.)
- **Beispiel:**
  ```tsx
  // Mobile (aus Phase A) + Desktop (Phase B)
  <h1 className="font-['Poppins:Bold',sans-serif] text-[17px] lg:text-[20px]">
    Title
  </h1>
  ```

---

## 📋 WORKFLOW PRO SCREEN

Für **JEDEN Screen** (von 1-11):

### Schritt 1: Dokumentation lesen
- Öffne `PHASE_2_MAIN_APP_DESKTOP_SCREENS.md`
- Finde die Section für diesen Screen
- Lies ALLE Typography-Elemente (besonders Desktop-spezifische Größen!)

### Schritt 2: Datei finden
- Suche die Desktop-Variante (z.B. `HomeScreenDesktop.tsx`)
- **ODER** die responsive Datei (z.B. `HomeScreen.tsx` mit `lg:` Breakpoints)
- Falls nicht gefunden: Notiere und skippe

### Schritt 3: Prüfe ob responsive oder separate Datei

**Fall A: Separate Desktop-Datei** (z.B. `HomeScreenDesktop.tsx`)
- Konvertiere ALLE Typography-Werte aus PHASE_2
- Workflow wie Phase A

**Fall B: Responsive Datei** (z.B. `HomeScreen.tsx` mit Mobile + Desktop)
- Prüfe ob Mobile bereits korrekt (aus Phase A)
- Füge/Ändere **NUR** Desktop-Breakpoints (`lg:text-[20px]` etc.)
- **Beispiel:**
  ```tsx
  // Vorher (nur Mobile aus Phase A):
  <h1 className="font-['Poppins:Bold',sans-serif] text-[17px]">Title</h1>
  
  // Nachher (Mobile + Desktop):
  <h1 className="font-['Poppins:Bold',sans-serif] text-[17px] lg:text-[20px]">Title</h1>
  ```

### Schritt 4: Änderungsliste erstellen
Wie in Phase A, aber fokussiert auf Desktop-Werte!

**Beispiel:**
```markdown
## HomeScreenDesktop.tsx - Änderungsliste

### 1. Screen Title "Hallo, {firstName}!"
- **DOKU (Desktop Original):** `font-['Poppins:Bold',sans-serif] text-[20px]`
- **AKTUELL (Neu):** `font-['Poppins:Bold',sans-serif] text-[17px]` (nur Mobile!)
- **PROBLEM:** Desktop Size fehlt!
- **FIX:** Füge `lg:text-[20px]` hinzu → `text-[17px] lg:text-[20px]`

### 2. Primary Button
- **DOKU (Desktop):** `h-[48px] px-8 py-4`
- **AKTUELL:** `h-[44px] px-6 py-3`
- **PROBLEM:** Desktop Dimensions fehlen!
- **FIX:** Responsive: `h-[44px] lg:h-[48px] px-6 lg:px-8 py-3 lg:py-4`
```

### Schritt 5-6: Implementieren & Verifizieren
Wie Phase A!

---

## 🚀 START-ANWEISUNG

**Starte mit Screen 1: HomeScreenDesktop.tsx (oder HomeScreen.tsx)**

1. Lies `PHASE_2_MAIN_APP_DESKTOP_SCREENS.md` → Section für Screen 1
2. Finde die Datei (Desktop-Version oder responsive Version)
3. Erstelle Änderungsliste (Desktop-Werte!)
4. **ZEIGE MIR DIE ÄNDERUNGSLISTE ZUERST**
5. Nach Bestätigung: Implementiere
6. Schreibe "✅ [ScreenName] Desktop COMPLETE"

**Dann frage:** "Soll ich mit Screen 2 weitermachen?"

---

## 📊 PROGRESS TRACKING

**Checklist:**

- [ ] 1. HomeScreenDesktop.tsx (oder HomeScreen.tsx)
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

**Progress:** 0/11 ➜ **Ziel:** 11/11 ✅

---

## ✅ PHASE B COMPLETION

**Phase B ist complete wenn:**

✅ Alle 11 Desktop Screens konvertiert
✅ Desktop Typography matcht PHASE_2 Dokumentation
✅ Mobile Typography unverändert (falls responsive Datei)
✅ Responsive Breakpoints korrekt (`lg:`, `xl:`)
✅ App läuft noch

**Dann schreibe:**
```
🎉 PHASE B COMPLETE - All Main App Desktop Screens converted!

Screens converted: [X/11]

Bereit für PHASE C (Main App Components + Modals)!
```

---

## 🚀 LOS GEHT'S!

**Starte mit Screen 1!**

Ich warte auf deine Änderungsliste! 📋
```

---

---

---

# 🚀 PHASE C: Main App Components + Modals

**Öffne einen NEUEN Chat in VS Code und kopiere folgenden Prompt:**

---

```markdown
# 🎯 TYPOGRAPHY CONVERSION - PHASE C: Main App Components + Modals

## KONTEXT

Ich habe eine **Learning App** komplett umgebaut (neue saubere Architektur).

**Deine Aufgabe (PHASE C):** Übernehme die **EXAKTE TYPOGRAPHY** in **~15 Components + Modals** der Main App!

**Wichtig:** Components können sowohl Mobile als auch Desktop Typography enthalten (responsive)!

---

## 📚 INPUT DOKUMENTATION

**Haupt-Dokumentation für diese Phase:**
- **`PHASE_3_MAIN_APP_COMPONENTS_MODALS.md`** ← Lies diese Datei KOMPLETT!

**Zusätzlich wichtig (Critical Rules):**
- **`PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md`** → Section "B) CRITICAL CONVERSION RULES"

---

## ⚠️ CRITICAL CONVERSION RULES

**Gleiche 6 Rules wie Phase A + B!**

1. **Never Lighten Font-Weights** (Bold bleibt Bold!)
2. **Preserve Exact Font Sizes** (`text-[17px]` bleibt 17px!)
3. **Maintain Font-Family Declarations** (`font-['Poppins:Bold',sans-serif]`!)
4. **Preserve Button Dimensions** (Heights, Paddings, Border-Radius!)
5. **Respect Mobile vs Desktop** (Responsive Breakpoints!)
6. **Don't Skip Small Elements** (Metadata, Badges, etc.!)

---

## 🎯 PHASE C SCOPE

**Components + Modals** aus der Main App (dokumentiert in PHASE_3):

### **Components:**
1. FlashcardCard.tsx
2. ExamCard.tsx
3. TodoCard.tsx
4. BottomNavigation.tsx
5. Sidebar.tsx (Desktop)
6. MobileHeader.tsx
7. CategoryBadge.tsx
8. ProgressBar.tsx
9. (... weitere - siehe PHASE_3 für komplette Liste)

### **Modals:**
1. CreateOwnSetModal.tsx
2. SubtopicsModal.tsx
3. EditFlashcardModal.tsx
4. DeleteConfirmationModal.tsx
5. SettingsModal.tsx
6. (... weitere - siehe PHASE_3 für komplette Liste)

**Wahrscheinliche Pfade:**
- Components: `/src/app/components/[ComponentName].tsx`
- Modals: `/src/app/components/modals/[ModalName].tsx` (oder `/src/app/components/`)

**Total:** ~15 Items

---

## 📋 WORKFLOW PRO COMPONENT/MODAL

Für **JEDES Item**:

### Schritt 1: Dokumentation lesen
- Öffne `PHASE_3_MAIN_APP_COMPONENTS_MODALS.md`
- Finde die Section für dieses Component/Modal
- Beachte ob Mobile + Desktop Werte unterschiedlich sind!

### Schritt 2: Datei finden
- Suche die Datei
- Falls nicht gefunden: Notiere und skippe

### Schritt 3: Änderungsliste erstellen
Wie Phase A/B!

**Beispiel:**
```markdown
## FlashcardCard.tsx - Änderungsliste

### 1. Card Title
- **DOKU:** `font-['Poppins:SemiBold',sans-serif] text-[16px] lg:text-[17px]`
- **AKTUELL:** `font-semibold text-base`
- **PROBLEM:** Font-Family fehlt! Size falsch! Desktop-Size fehlt!
- **FIX:** Ersetze mit `font-['Poppins:SemiBold',sans-serif] text-[16px] lg:text-[17px]`

### 2. Card Metadata "3 cards"
- **DOKU:** `font-['Poppins:Medium',sans-serif] text-[12px]`
- **AKTUELL:** `text-sm text-gray-500`
- **PROBLEM:** Font-Family fehlt! Size falsch (sm = 14px, sollte 12px sein)!
- **FIX:** Ändere zu `font-['Poppins:Medium',sans-serif] text-[12px] text-gray-500`
```

### Schritt 4-6: Implementieren, Verifizieren, Completion
Wie Phase A/B!

---

## 🚀 START-ANWEISUNG

**Starte mit Component 1 (z.B. FlashcardCard.tsx)**

1. Lies `PHASE_3_MAIN_APP_COMPONENTS_MODALS.md` → Section für dieses Component
2. Finde die Datei
3. Erstelle Änderungsliste
4. **ZEIGE MIR DIE LISTE ZUERST**
5. Implementiere nach Bestätigung
6. Schreibe "✅ [ComponentName] COMPLETE"

**Dann frage:** "Soll ich mit dem nächsten Component/Modal weitermachen?"

---

## 📊 PROGRESS TRACKING

**Checklist:**

**Components:**
- [ ] FlashcardCard.tsx
- [ ] ExamCard.tsx
- [ ] TodoCard.tsx
- [ ] BottomNavigation.tsx
- [ ] Sidebar.tsx
- [ ] MobileHeader.tsx
- [ ] (siehe PHASE_3 für komplette Liste)

**Modals:**
- [ ] CreateOwnSetModal.tsx
- [ ] SubtopicsModal.tsx
- [ ] EditFlashcardModal.tsx
- [ ] DeleteConfirmationModal.tsx
- [ ] (siehe PHASE_3 für komplette Liste)

**Progress:** 0/~15 ➜ **Ziel:** ~15/15 ✅

---

## ✅ PHASE C COMPLETION

**Phase C ist complete wenn:**

✅ Alle Components + Modals konvertiert (oder "not found")
✅ Typography matcht PHASE_3
✅ Responsive Breakpoints korrekt
✅ App läuft noch

**Dann schreibe:**
```
🎉 PHASE C COMPLETE - All Main App Components + Modals converted!

Items converted: [X/~15]

Bereit für PHASE D (ExamApp Mobile Screens)!
```

---

## 🚀 LOS GEHT'S!

**Starte mit dem ersten Component!**

Ich warte auf deine Änderungsliste! 📋
```

---

---

---

# 🚀 PHASE D: ExamApp Mobile Screens

**Öffne einen NEUEN Chat in VS Code und kopiere folgenden Prompt:**

---

```markdown
# 🎯 TYPOGRAPHY CONVERSION - PHASE D: ExamApp Mobile Screens

## KONTEXT

Ich habe eine **Learning App** mit einer separaten **ExamApp** (Prüfungssimulation).

Die ExamApp liegt in `/src/examapp/` und hat eigene Screens + Components.

**Deine Aufgabe (PHASE D):** Übernehme die **EXAKTE TYPOGRAPHY** in die **9 Mobile Screens** der ExamApp!

---

## 📚 INPUT DOKUMENTATION

**Haupt-Dokumentation für diese Phase:**
- **`PHASE_4_EXAMAPP_MOBILE_SCREENS.md`** ← Lies diese Datei KOMPLETT!

**Zusätzlich wichtig (Critical Rules):**
- **`PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md`** → Section "B) CRITICAL CONVERSION RULES"

---

## ⚠️ CRITICAL CONVERSION RULES

**Gleiche 6 Rules wie Phase A/B/C!**

1. **Never Lighten Font-Weights** (Bold bleibt Bold!)
2. **Preserve Exact Font Sizes** (`text-[16px]` bleibt 16px!)
3. **Maintain Font-Family Declarations** (`font-['Poppins:SemiBold',sans-serif]`!)
4. **Preserve Button Dimensions** (Heights, Paddings!)
5. **Respect Mobile vs Desktop** (Diese Phase = MOBILE ONLY!)
6. **Don't Skip Small Elements** (Timer, Score, etc.!)

---

## 🎯 PHASE D SCOPE

**9 Mobile Screens** der ExamApp (dokumentiert in PHASE_4):

1. **SubjectSelectionScreenMobile.tsx** (Fach auswählen)
2. **CategorySelectionScreenMobile.tsx** (Kategorie auswählen)
3. **TopicSelectionScreenMobile.tsx** (Themen auswählen)
4. **SubtopicSelectionScreenMobile.tsx** (Unterthemen auswählen)
5. **ExamConfigurationScreenMobile.tsx** (Prüfung konfigurieren)
6. **StartScreenMobile.tsx** (Prüfung starten)
7. **QuestionScreenMobile.tsx** (Frage beantworten)
8. **ResultsScreenMobile.tsx** (Ergebnis anzeigen)
9. **ExamFeedbackScreenMobile.tsx** (Feedback anzeigen)

**Wahrscheinliche Pfade:**
- `/src/examapp/app/components/screens/[ScreenName].tsx`
- `/src/examapp/app/screens/[ScreenName].tsx`
- `/src/examapp/screens/[ScreenName].tsx`

---

## 📋 WORKFLOW PRO SCREEN

**Gleicher Workflow wie Phase A!**

### Für JEDEN Screen (von 1-9):

1. **Dokumentation lesen** (PHASE_4 → Section für diesen Screen)
2. **Datei finden** (in `/src/examapp/`)
3. **Änderungsliste erstellen** (alle Typography-Elemente!)
4. **ZEIGE MIR DIE LISTE ZUERST**
5. **Implementieren** (nach Bestätigung)
6. **Verifizieren** (alle 6 Rules!)
7. **Completion** ("✅ [ScreenName] COMPLETE")

---

## 🚀 START-ANWEISUNG

**Starte mit Screen 1: SubjectSelectionScreenMobile.tsx**

1. Lies `PHASE_4_EXAMAPP_MOBILE_SCREENS.md` → Section "SCREEN 1"
2. Finde die Datei (wahrscheinlich `/src/examapp/app/components/screens/` oder `/src/examapp/app/screens/`)
3. Erstelle Änderungsliste
4. **ZEIGE MIR DIE LISTE**
5. Implementiere
6. Schreibe "✅ SubjectSelectionScreenMobile COMPLETE"

**Dann frage:** "Soll ich mit Screen 2 weitermachen?"

---

## 📊 PROGRESS TRACKING

**Checklist:**

- [ ] 1. SubjectSelectionScreenMobile.tsx
- [ ] 2. CategorySelectionScreenMobile.tsx
- [ ] 3. TopicSelectionScreenMobile.tsx
- [ ] 4. SubtopicSelectionScreenMobile.tsx
- [ ] 5. ExamConfigurationScreenMobile.tsx
- [ ] 6. StartScreenMobile.tsx
- [ ] 7. QuestionScreenMobile.tsx
- [ ] 8. ResultsScreenMobile.tsx
- [ ] 9. ExamFeedbackScreenMobile.tsx

**Progress:** 0/9 ➜ **Ziel:** 9/9 ✅

---

## ✅ PHASE D COMPLETION

**Phase D ist complete wenn:**

✅ Alle 9 ExamApp Mobile Screens konvertiert
✅ Typography matcht PHASE_4
✅ App läuft noch

**Dann schreibe:**
```
🎉 PHASE D COMPLETE - All ExamApp Mobile Screens converted!

Screens converted: [X/9]

Bereit für PHASE E (ExamApp Desktop Screens)!
```

---

## 🚀 LOS GEHT'S!

**Starte mit Screen 1!**

Ich warte auf deine Änderungsliste! 📋
```

---

---

---

# 🚀 PHASE E: ExamApp Desktop Screens

**Öffne einen NEUEN Chat in VS Code und kopiere folgenden Prompt:**

---

```markdown
# 🎯 TYPOGRAPHY CONVERSION - PHASE E: ExamApp Desktop Screens

## KONTEXT

Ich habe eine **ExamApp** (Prüfungssimulation) in `/src/examapp/`.

**Deine Aufgabe (PHASE E):** Übernehme die **EXAKTE TYPOGRAPHY** in die **9 Desktop Screens** der ExamApp!

**Wichtig:** Desktop Typography ist **UNTERSCHIEDLICH** von Mobile Typography!

---

## 📚 INPUT DOKUMENTATION

**Haupt-Dokumentation für diese Phase:**
- **`PHASE_5_EXAMAPP_DESKTOP_SCREENS.md`** ← Lies diese Datei KOMPLETT!

**Zusätzlich wichtig (Critical Rules):**
- **`PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md`** → Section "B) CRITICAL CONVERSION RULES"

---

## ⚠️ CRITICAL CONVERSION RULES

**Gleiche 6 Rules wie alle vorherigen Phasen!**

Besonders wichtig:
- **Rule 5: Mobile vs Desktop unterschiedlich!** (z.B. Mobile: 16px, Desktop: 15px)
- Responsive Breakpoints verwenden: `text-[16px] lg:text-[15px]`

---

## 🎯 PHASE E SCOPE

**9 Desktop Screens** der ExamApp (dokumentiert in PHASE_5):

1. **SubjectSelectionScreenDesktop.tsx** (oder responsive Version)
2. **CategorySelectionScreenDesktop.tsx**
3. **TopicSelectionScreenDesktop.tsx**
4. **SubtopicSelectionScreenDesktop.tsx**
5. **ExamConfigurationScreenDesktop.tsx**
6. **StartScreenDesktop.tsx**
7. **QuestionScreenDesktop.tsx**
8. **ResultsScreenDesktop.tsx**
9. **ExamFeedbackScreenDesktop.tsx**

**Wahrscheinliche Pfade:**
- `/src/examapp/app/components/screens/[ScreenName].tsx`
- `/src/examapp/app/screens/[ScreenName].tsx`

**Wichtig:** Wie Phase B - manche Screens haben separate Desktop-Dateien, manche nutzen responsive Breakpoints!

---

## 📋 WORKFLOW PRO SCREEN

**Gleicher Workflow wie Phase B!**

### Für JEDEN Screen (von 1-9):

1. **Dokumentation lesen** (PHASE_5 → Section für diesen Screen)
2. **Datei finden** (Desktop-Version oder responsive Version)
3. **Prüfe ob responsive oder separate Datei:**
   - **Separate Desktop-Datei:** Konvertiere ALLE Werte aus PHASE_5
   - **Responsive Datei:** Füge/Ändere **NUR** Desktop-Breakpoints (`lg:text-[15px]`)
4. **Änderungsliste erstellen** (Desktop-Werte!)
5. **ZEIGE MIR DIE LISTE ZUERST**
6. **Implementieren**
7. **Verifizieren** (besonders Mobile vs Desktop!)
8. **Completion**

---

## 🚀 START-ANWEISUNG

**Starte mit Screen 1: SubjectSelectionScreenDesktop.tsx (oder responsive Version)**

1. Lies `PHASE_5_EXAMAPP_DESKTOP_SCREENS.md` → Section "SCREEN 1"
2. Finde die Datei (Desktop-Version oder responsive)
3. Erstelle Änderungsliste (Desktop-Werte!)
4. **ZEIGE MIR DIE LISTE**
5. Implementiere
6. Schreibe "✅ [ScreenName] Desktop COMPLETE"

**Dann frage:** "Soll ich mit Screen 2 weitermachen?"

---

## 📊 PROGRESS TRACKING

**Checklist:**

- [ ] 1. SubjectSelectionScreenDesktop.tsx
- [ ] 2. CategorySelectionScreenDesktop.tsx
- [ ] 3. TopicSelectionScreenDesktop.tsx
- [ ] 4. SubtopicSelectionScreenDesktop.tsx
- [ ] 5. ExamConfigurationScreenDesktop.tsx
- [ ] 6. StartScreenDesktop.tsx
- [ ] 7. QuestionScreenDesktop.tsx
- [ ] 8. ResultsScreenDesktop.tsx
- [ ] 9. ExamFeedbackScreenDesktop.tsx

**Progress:** 0/9 ➜ **Ziel:** 9/9 ✅

---

## ✅ PHASE E COMPLETION

**Phase E ist complete wenn:**

✅ Alle 9 ExamApp Desktop Screens konvertiert
✅ Desktop Typography matcht PHASE_5
✅ Mobile Typography unverändert (falls responsive)
✅ Responsive Breakpoints korrekt
✅ App läuft noch

**Dann schreibe:**
```
🎉 PHASE E COMPLETE - All ExamApp Desktop Screens converted!

Screens converted: [X/9]

Bereit für PHASE F (ExamApp Components) - FINAL PHASE!
```

---

## 🚀 LOS GEHT'S!

**Starte mit Screen 1!**

Ich warte auf deine Änderungsliste! 📋
```

---

---

---

# 🚀 PHASE F: ExamApp Components (FINAL!)

**Öffne einen NEUEN Chat in VS Code und kopiere folgenden Prompt:**

---

```markdown
# 🎯 TYPOGRAPHY CONVERSION - PHASE F: ExamApp Components (FINAL PHASE!)

## KONTEXT

Ich habe eine **ExamApp** (Prüfungssimulation) in `/src/examapp/`.

**Deine Aufgabe (PHASE F - FINAL!):** Übernehme die **EXAKTE TYPOGRAPHY** in die **~10 Components** der ExamApp!

**Dies ist die LETZTE PHASE!** 🎉

---

## 📚 INPUT DOKUMENTATION

**Haupt-Dokumentation für diese Phase:**
- **`PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md`** ← Lies diese Datei KOMPLETT!
  - Section A: ExamApp Components Typography
  - Section B: FINAL DESIGN SYSTEM SUMMARY (für Referenz)
  - Section C: CRITICAL CONVERSION RULES (Review!)

---

## ⚠️ CRITICAL CONVERSION RULES

**Ein letztes Mal - alle 6 Rules beachten!**

1. **Never Lighten Font-Weights**
2. **Preserve Exact Font Sizes**
3. **Maintain Font-Family Declarations**
4. **Preserve Button Dimensions**
5. **Respect Mobile vs Desktop**
6. **Don't Skip Small Elements**

---

## 🎯 PHASE F SCOPE

**Components** der ExamApp (dokumentiert in PHASE_6 Section A):

1. **SubjectSelection.tsx** (Selection Component)
2. **CategorySelection.tsx** (Selection Component)
3. **TopicSelection.tsx** (Selection Component)
4. **SubtopicSelection.tsx** (Selection Component)
5. **QuestionCard.tsx** (Question Display Component)
6. **Timer.tsx** (Timer Component)
7. **ProgressBar.tsx** (Progress Component)
8. **ScoreDisplay.tsx** (Score Component)
9. **AnswerButton.tsx** (Answer Button Component)
10. (... weitere - siehe PHASE_6 Section A für komplette Liste)

**Wahrscheinliche Pfade:**
- `/src/examapp/app/components/[ComponentName].tsx`

**Total:** ~10 Items

---

## 📋 WORKFLOW PRO COMPONENT

**Gleicher Workflow wie Phase C!**

### Für JEDES Component (von 1-~10):

1. **Dokumentation lesen** (PHASE_6 Section A → Component)
2. **Datei finden** (in `/src/examapp/app/components/`)
3. **Änderungsliste erstellen** (alle Typography-Elemente!)
4. **ZEIGE MIR DIE LISTE ZUERST**
5. **Implementieren**
6. **Verifizieren**
7. **Completion**

---

## 🚀 START-ANWEISUNG

**Starte mit Component 1: SubjectSelection.tsx**

1. Lies `PHASE_6_EXAMAPP_COMPONENTS_FINAL_SUMMARY.md` → Section A → "1. SubjectSelection.tsx"
2. Finde die Datei (wahrscheinlich `/src/examapp/app/components/SubjectSelection.tsx`)
3. Erstelle Änderungsliste
4. **ZEIGE MIR DIE LISTE**
5. Implementiere
6. Schreibe "✅ SubjectSelection.tsx COMPLETE"

**Dann frage:** "Soll ich mit Component 2 weitermachen?"

---

## 📊 PROGRESS TRACKING

**Checklist:**

- [ ] SubjectSelection.tsx
- [ ] CategorySelection.tsx
- [ ] TopicSelection.tsx
- [ ] SubtopicSelection.tsx
- [ ] QuestionCard.tsx
- [ ] Timer.tsx
- [ ] ProgressBar.tsx
- [ ] ScoreDisplay.tsx
- [ ] AnswerButton.tsx
- [ ] (siehe PHASE_6 für komplette Liste)

**Progress:** 0/~10 ➜ **Ziel:** ~10/10 ✅

---

## ✅ PHASE F COMPLETION

**Phase F ist complete wenn:**

✅ Alle ExamApp Components konvertiert
✅ Typography matcht PHASE_6 Section A
✅ App läuft noch

**Dann schreibe:**
```
🎉🎉🎉 PHASE F COMPLETE - ALL ExamApp Components converted!

Components converted: [X/~10]

🏆 ALL 6 PHASES COMPLETE! 🏆

FINAL SUMMARY:
✅ Phase A: Main App Mobile (11 Screens)
✅ Phase B: Main App Desktop (11 Screens)
✅ Phase C: Main App Components + Modals (~15 Items)
✅ Phase D: ExamApp Mobile (9 Screens)
✅ Phase E: ExamApp Desktop (9 Screens)
✅ Phase F: ExamApp Components (~10 Items)

TOTAL: ~65 Items converted!

Typography Conversion ERFOLGREICH ABGESCHLOSSEN! 🎊
```

---

## 🚀 LOS GEHT'S!

**Starte mit Component 1!**

Dies ist die letzte Phase! 💪

Ich warte auf deine Änderungsliste! 📋
```

---

---

---

# 📊 SUMMARY

## ✅ Was du jetzt hast:

**6 eigenständige Chat-Prompts** für VS Code Claude:

1. **PHASE A:** Main App Mobile Screens (11 Items)
2. **PHASE B:** Main App Desktop Screens (11 Items)
3. **PHASE C:** Main App Components + Modals (~15 Items)
4. **PHASE D:** ExamApp Mobile Screens (9 Items)
5. **PHASE E:** ExamApp Desktop Screens (9 Items)
6. **PHASE F:** ExamApp Components (~10 Items)

**Total: ~65 Items**

---

## 🚀 Wie du sie verwendest:

### **Option 1: Sequenziell (empfohlen!)**
1. Neuer Chat → Phase A Prompt → Fertig → Review
2. Neuer Chat → Phase B Prompt → Fertig → Review
3. Neuer Chat → Phase C Prompt → Fertig → Review
4. ... etc.

**Vorteil:** Beste Qualität! Jeder Chat fokussiert! Du kannst reviewen!

### **Option 2: Parallel (schneller, aber riskanter)**
1. Chat 1 → Phase A Prompt (Main App Mobile)
2. Chat 2 → Phase D Prompt (ExamApp Mobile)
3. Chat 3 → Phase B Prompt (Main App Desktop)
4. Chat 4 → Phase E Prompt (ExamApp Desktop)
5. ... etc.

**Vorteil:** Schneller! Mehrere Chats parallel!
**Nachteil:** Mehr zu reviewen! Mögliche Konflikte!

---

## 📝 NEXT STEPS

1. ✅ Neue App in VS Code öffnen
2. ✅ Diese `.md` Datei + 6 Phase-Dateien in Root kopieren
3. ✅ PHASE_6 lesen (Critical Rules!)
4. ✅ Neuen Chat öffnen
5. ✅ **PHASE A Prompt** kopieren & senden
6. ✅ Loslegen! 🚀

---

**VIEL ERFOLG!** 💪
