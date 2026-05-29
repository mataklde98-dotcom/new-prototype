# PHASE 1 - MAIN APP MOBILE SCREENS - Typography Audit

> **Purpose:** Complete typography documentation for all Main App MOBILE screens  
> **Date:** 15. Februar 2026  
> **Analyzed By:** Claude Opus 4.6  
> **Scope:** ONLY Mobile Screens (Desktop → Phase 2)  
> **Project:** SoStudy Learning App - Main App (`/src/app/`)

---

## 🎨 DESIGN SYSTEM SUMMARY (Mobile Screens)

### Font Families Used
- **Primary:** `Poppins` (Bold, SemiBold, Medium, Regular)
- **Format in Code:** `font-['Poppins:Bold',sans-serif]`, `font-['Poppins:SemiBold',sans-serif]`, etc.
- **System Fallback:** `sans-serif`
- **Inline Style Format:** `fontFamily: 'Poppins, sans-serif'`

### Font Weights Map
| Weight | Name | Tailwind Class | Poppins Variant |
|--------|------|---------------|-----------------|
| **700** | Bold | `font-bold` | `Poppins:Bold` |
| **600** | SemiBold | `font-semibold` | `Poppins:SemiBold` |
| **500** | Medium | `font-medium` | `Poppins:Medium` |
| **400** | Regular | `font-normal` | `Poppins:Regular` |

### Common Font Sizes Found (Mobile)
**Large (Headings):**
- 22px, 20px, 18px, 17px

**Medium (Subheadings, Buttons):**
- 16px, 15px, 14px

**Small (Labels, Body):**
- 13px, 12px, 11px

**Tiny (Metadata, Timestamps):**
- 10px, 9px

---

## 📱 SCREEN 1: HomeScreenMobile.tsx

**File:** `src/app/components/HomeScreenMobile.tsx` (517 lines)

---

### 1.1 MobileHeader Component (embedded)
**File:** `src/app/components/MobileHeader.tsx` (used inside HomeScreenMobile)

#### Greeting Title: "Hallo, {firstName}!"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[18px]` → **18px**
- **Font-Weight:** **700** (Bold)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[18px] text-white leading-tight mb-1.5"`
- **Line:** [MobileHeader.tsx#L28](src/app/components/MobileHeader.tsx#L28)

#### Knowledge Level Label: "Knowledge level"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[15px]` → **15px**
- **Font-Weight:** **400** (Regular)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[15px] text-[#888ca4] leading-tight"`
- **Line:** [MobileHeader.tsx#L37](src/app/components/MobileHeader.tsx#L37)

#### Knowledge Percentage: "25%"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[15px]` → **15px**
- **Font-Weight:** **700** (Bold)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[15px] text-white leading-tight"`
- **Line:** [MobileHeader.tsx#L51](src/app/components/MobileHeader.tsx#L51)

---

### 1.2 Section Header: "Your ToDo's"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[18px]` → **18px**
- **Font-Weight:** **700** (Bold)
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[18px] text-white"`
- **Line:** [HomeScreenMobile.tsx#L103](src/app/components/HomeScreenMobile.tsx#L103)

### 1.3 Filter Badge Count (on filter button)
- **Element:** `<span>` tag
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** `font-bold` → **700** (Bold)
- **Code:** `className="... text-[10px] font-bold text-white ..."`
- **Line:** [HomeScreenMobile.tsx#L125](src/app/components/HomeScreenMobile.tsx#L125)

### 1.4 Section Header: "AI Tools"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[16px]` → **16px**
- **Font-Weight:** **700** (Bold)
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[16px] text-white"`
- **Line:** [HomeScreenMobile.tsx#L151](src/app/components/HomeScreenMobile.tsx#L151)

### 1.5 AI Tool Button Label: "Generate Flashcards"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Line-Height:** `leading-[16px]` → **16px**
- **Text-Align:** `text-center`
- **Button Container:** `rounded-2xl h-[120px] p-4`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white text-center leading-[16px]"`
- **Line:** [HomeScreenMobile.tsx#L179](src/app/components/HomeScreenMobile.tsx#L179)

### 1.6 AI Tool Button Label: "Exam Simulation"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Line-Height:** `leading-[16px]` → **16px**
- **Text-Align:** `text-center`
- **Button Container:** `rounded-2xl h-[120px] p-4`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white text-center leading-[16px]"`
- **Line:** [HomeScreenMobile.tsx#L229](src/app/components/HomeScreenMobile.tsx#L229)

### 1.7 Section Header: "Recently used Flashcards"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white"`
- **Line:** [HomeScreenMobile.tsx#L239](src/app/components/HomeScreenMobile.tsx#L239)

### 1.8 "View All" Button Text (multiple sections)
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **700** (Bold)
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[11px] text-white"`
- **Lines:** [HomeScreenMobile.tsx#L242](src/app/components/HomeScreenMobile.tsx#L242), [L278](src/app/components/HomeScreenMobile.tsx#L278), [L305](src/app/components/HomeScreenMobile.tsx#L305), [L340](src/app/components/HomeScreenMobile.tsx#L340), [L381](src/app/components/HomeScreenMobile.tsx#L381), [L432](src/app/components/HomeScreenMobile.tsx#L432)

### 1.9 Empty State Text: "Keine kürzlich verwendeten Karteikarten"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40"`
- **Line:** [HomeScreenMobile.tsx#L261](src/app/components/HomeScreenMobile.tsx#L261)

### 1.10 Section Header: "Completed Exams"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white"`
- **Line:** [HomeScreenMobile.tsx#L275](src/app/components/HomeScreenMobile.tsx#L275)

### 1.11 Section Header: "Your Tutors"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white"`
- **Line:** [HomeScreenMobile.tsx#L302](src/app/components/HomeScreenMobile.tsx#L302)

### 1.12 Tutor Name Card Text
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **600** (SemiBold)
- **Line-Height:** `leading-tight`
- **Text-Align:** `text-center`
- **Code:** `className="relative z-10 font-['Poppins:SemiBold',sans-serif] text-[11px] text-white text-center leading-tight"`
- **Line:** [HomeScreenMobile.tsx#L334](src/app/components/HomeScreenMobile.tsx#L334)

### 1.13 Section Header: "Extra-Sessions"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white"`
- **Line:** [HomeScreenMobile.tsx#L337](src/app/components/HomeScreenMobile.tsx#L337)

### 1.14 Extra-Session Card - Tutor Name
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **600** (SemiBold)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white leading-tight"`
- **Line:** [HomeScreenMobile.tsx#L375](src/app/components/HomeScreenMobile.tsx#L375)

### 1.15 Extra-Session Card - Topic Title
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **600** (SemiBold)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white mb-2 leading-tight"`
- **Line:** [HomeScreenMobile.tsx#L378](src/app/components/HomeScreenMobile.tsx#L378)

### 1.16 Extra-Session Card - Date & Time
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **400** (Regular)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/50 leading-tight"`
- **Lines:** [HomeScreenMobile.tsx#L381-L384](src/app/components/HomeScreenMobile.tsx#L381)

### 1.17 Section Header: "Recently viewed Documents"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white"`
- **Line:** [HomeScreenMobile.tsx#L429](src/app/components/HomeScreenMobile.tsx#L429)

### 1.18 Document Card - Title: "Quantum Mechanics Notes"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **600** (SemiBold)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white mb-1 leading-tight"`
- **Line:** [HomeScreenMobile.tsx#L460](src/app/components/HomeScreenMobile.tsx#L460)

### 1.19 Document Card - Teacher Info
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **400** (Regular)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/50 mb-0.5 leading-tight"`
- **Line:** [HomeScreenMobile.tsx#L463](src/app/components/HomeScreenMobile.tsx#L463)

### 1.20 Document Card - Subject & Date Metadata
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[9px]` → **9px**
- **Font-Weight:** **400** (Regular)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/30 leading-tight"`
- **Line:** [HomeScreenMobile.tsx#L466](src/app/components/HomeScreenMobile.tsx#L466)

### 1.21 Promotional Banner Title
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[14px]` → **14px**
- **Font-Weight:** **700** (Bold)
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[14px] text-white mb-1"`
- **Line:** [HomeScreenMobile.tsx#L473](src/app/components/HomeScreenMobile.tsx#L473)

### 1.22 Promotional Banner Description
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **500** (Medium)
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[12px] text-white mb-3"`
- **Line:** [HomeScreenMobile.tsx#L476](src/app/components/HomeScreenMobile.tsx#L476)

### 1.23 Promotional Banner Button: "EINLADEN"
- **Element:** `<span>` inside `<button>`
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **700** (Bold)
- **Button Padding:** `px-5 py-2` → horizontal: 20px, vertical: 8px
- **Button Border-Radius:** `rounded-[10px]`
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[12px] text-[#009379]"`
- **Line:** [HomeScreenMobile.tsx#L479](src/app/components/HomeScreenMobile.tsx#L479)

---

## 📱 SCREEN 2: MyFlashcardsScreenMobile.tsx

**File:** `src/app/components/MyFlashcardsScreenMobile.tsx` (558 lines)

---

### 2.1 Screen Title: "Meine Karteikarten"
- **Element:** `<h1>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[17px]` → **17px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white"`
- **Line:** [MyFlashcardsScreenMobile.tsx#L214](src/app/components/MyFlashcardsScreenMobile.tsx#L214)

### 2.2 Tab Labels: "KI-Sets", "Eigene", "Prognosen"
- **Element:** `<span>` inside `<button>`
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[14px]` → **14px**
- **Font-Weight:** **500** (Medium)
- **Button Height:** `height: '40px'`
- **Button Padding:** `px-4`
- **Button Border-Radius:** `rounded-[14px]`
- **Code:** `className="... font-['Poppins:Medium',sans-serif] text-[14px] ..."` with `style={{ height: '40px', lineHeight: '1' }}`
- **Line:** [MyFlashcardsScreenMobile.tsx#L492](src/app/components/MyFlashcardsScreenMobile.tsx#L492)

### 2.3 "Eigenes Set erstellen" Button
- **Element:** `<span>` inside `<button>`
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[15px]` → **15px**
- **Font-Weight:** **500** (Medium)
- **Button Padding:** `px-6 py-4` → horizontal: 24px, vertical: 16px
- **Button Border-Radius:** `rounded-[16px]`
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[15px] text-white"`
- **Line:** [MyFlashcardsScreenMobile.tsx#L423](src/app/components/MyFlashcardsScreenMobile.tsx#L423)

---

## 📱 SCREEN 3: ExamScreenMobile.tsx

❌ **Keine separate ExamScreenMobile.tsx** - Es gibt keinen dedizierten Exam-Launcher Mobile Screen.
Die Exam-Simulation wird direkt über Buttons in HomeScreenMobile und KIToolsScreen aufgerufen.
Die eigentliche Exam App lebt in `/src/examapp/` (wird in Phase 4 dokumentiert).

---

## 📱 SCREEN 4: CompletedExamsScreenMobile.tsx

**File:** `src/app/components/CompletedExamsScreenMobile.tsx` (422 lines)

---

### 4.1 Screen Title: "Abgeschlossene Prüfungen"
- **Element:** `<h1>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[17px]` → **17px**
- **Font-Weight:** **600** (SemiBold)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white leading-tight"`
- **Line:** [CompletedExamsScreenMobile.tsx#L230](src/app/components/CompletedExamsScreenMobile.tsx#L230)

### 4.2 Empty State Title
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[16px]` → **16px**
- **Font-Weight:** **600** (SemiBold)
- **Text-Align:** `text-center`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white/60 text-center"`
- **Line:** [CompletedExamsScreenMobile.tsx#L366](src/app/components/CompletedExamsScreenMobile.tsx#L366)

### 4.3 Empty State Description
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[14px]` → **14px**
- **Font-Weight:** **400** (Regular)
- **Text-Align:** `text-center`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/40 text-center mt-2 max-w-[280px]"`
- **Line:** [CompletedExamsScreenMobile.tsx#L372](src/app/components/CompletedExamsScreenMobile.tsx#L372)

---

## 📱 SCREEN 5: GenerateFlashcardsScreenMobile.tsx

❌ **Keine separate GenerateFlashcardsScreenMobile.tsx** - Der Flashcard Generator ist eine eigenständige App in `/src/flashcardgen/GenerateFlashcardsApp.tsx`.
Er verwendet Shared Content Selection Components (Subject, Category, Topic, Subtopic Selection) und hat keine separate Mobile-Variante. Die Selection-Screens werden in der ExamApp-Phase (Phase 4) und Component-Phase dokumentiert, da sie geteilt werden.

---

## 📱 SCREEN 6: ProfilScreenMobile.tsx

**File:** `src/app/components/ProfilScreenMobile.tsx` (414 lines)

---

### 6.1 User Name (Profile Header)
- **Element:** `<h2>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[22px]` → **22px**
- **Font-Weight:** **600** (SemiBold)
- **Text-Align:** `text-center`
- **Letter-Spacing:** `tracking-tight` → tight
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-white text-center mb-1 tracking-tight"`
- **Line:** [ProfilScreenMobile.tsx#L273](src/app/components/ProfilScreenMobile.tsx#L273)

### 6.2 User Email (under name)
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **400** (Regular)
- **Text-Align:** `text-center`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#707070] text-center"`
- **Line:** [ProfilScreenMobile.tsx#L280](src/app/components/ProfilScreenMobile.tsx#L280)

### 6.3 School Info (Bundesland, Schultyp, Klasse)
- **Element:** `<div>` with inline `<span>` tags
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="mt-2 flex items-center justify-center gap-2 text-[12px] text-white/50 font-['Poppins:Regular',sans-serif]"`
- **Line:** [ProfilScreenMobile.tsx#L284](src/app/components/ProfilScreenMobile.tsx#L284)

### 6.4 Section Headers: "Schulfortschritt", "Nachhilfe", "Konto", "Sonstiges"
- **Element:** `<h2>` tag (via `SectionHeader` component)
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **600** (SemiBold)
- **Text-Transform:** `uppercase`
- **Letter-Spacing:** `tracking-wide`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#8E8E93] uppercase tracking-wide mb-2 px-1"`
- **Line:** [ProfilScreenMobile.tsx#L153](src/app/components/ProfilScreenMobile.tsx#L153)

### 6.5 Menu Item Label (Primary)
- **Element:** `<p>` tag (via `MenuItem` component)
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[15px]` → **15px**
- **Font-Weight:** **500** (Medium)
- **Line-Height:** `leading-[20px]` → **20px**
- **Button Padding:** `px-4 py-4` → horizontal: 16px, vertical: 16px
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[15px] leading-[20px]"`
- **Line:** [ProfilScreenMobile.tsx#L107](src/app/components/ProfilScreenMobile.tsx#L107)

### 6.6 Menu Item Sublabel (Secondary)
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **400** (Regular)
- **Line-Height:** `leading-[18px]` → **18px**
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#8E8E93] leading-[18px] mt-0.5"`
- **Line:** [ProfilScreenMobile.tsx#L113](src/app/components/ProfilScreenMobile.tsx#L113)

### 6.7 Badge Text (e.g., "2 Verfügbar")
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **600** (SemiBold)
- **Padding:** `px-2.5 py-1` → horizontal: 10px, vertical: 4px
- **Border-Radius:** `rounded-full`
- **Code:** `className="px-2.5 py-1 rounded-full font-['Poppins:SemiBold',sans-serif] text-[11px]"`
- **Line:** [ProfilScreenMobile.tsx#L121](src/app/components/ProfilScreenMobile.tsx#L121)

### 6.8 App Version Footer: "SoStudy Version 1.0.0"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **400** (Regular)
- **Text-Align:** `text-center`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#707070] text-center"`
- **Line:** [ProfilScreenMobile.tsx#L407](src/app/components/ProfilScreenMobile.tsx#L407)

---

## 📱 SCREEN 7: ChatScreenMobile.tsx

**File:** `src/app/components/ChatScreenMobile.tsx` (570 lines)

---

### 7.1 Chat Room List - Screen Title: "Nachrichten"
- **Element:** `<h1>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[20px]` → **20px**
- **Font-Weight:** **700** (Bold)
- **Letter-Spacing:** `letterSpacing: '-0.5px'` → **-0.5px**
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-white text-[20px]"` + `style={{ letterSpacing: '-0.5px' }}`
- **Line:** [ChatScreenMobile.tsx#L474](src/app/components/ChatScreenMobile.tsx#L474)

### 7.2 Chat Room List - Participant Name
- **Element:** `<h3>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[16px]` → **16px**
- **Font-Weight:** **600** (SemiBold)
- **Letter-Spacing:** `letterSpacing: '-0.3px'` → **-0.3px**
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-white text-[16px] truncate"` + `style={{ letterSpacing: '-0.3px' }}`
- **Line:** [ChatScreenMobile.tsx#L516](src/app/components/ChatScreenMobile.tsx#L516)

### 7.3 Chat Room List - Last Message Time
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-white/40 text-[12px] shrink-0 ml-2"`
- **Line:** [ChatScreenMobile.tsx#L522](src/app/components/ChatScreenMobile.tsx#L522)

### 7.4 Chat Room List - Last Message Preview
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[14px]` → **14px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-white/50 text-[14px] truncate"`
- **Line:** [ChatScreenMobile.tsx#L532](src/app/components/ChatScreenMobile.tsx#L532)

### 7.5 Chat Room List - Unread Count Badge
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **600** (SemiBold)
- **Badge Dimensions:** `minWidth: '20px'`, `height: '20px'`, `borderRadius: '10px'`, `padding: '0 6px'`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-white text-[11px]"`
- **Line:** [ChatScreenMobile.tsx#L544](src/app/components/ChatScreenMobile.tsx#L544)

### 7.6 Chat View - Header Name
- **Element:** `<h2>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[17px]` → **17px**
- **Font-Weight:** **600** (SemiBold)
- **Letter-Spacing:** `letterSpacing: '-0.3px'` → **-0.3px**
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-white text-[17px] truncate"` + `style={{ letterSpacing: '-0.3px' }}`
- **Line:** [ChatScreenMobile.tsx#L115](src/app/components/ChatScreenMobile.tsx#L115)

### 7.7 Chat View - Online/Offline Status
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-white/50 text-[13px]"`
- **Line:** [ChatScreenMobile.tsx#L124](src/app/components/ChatScreenMobile.tsx#L124)

### 7.8 Chat View - "schreibt..." (Typing Indicator)
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[#00D4AA] text-[13px]"`
- **Line:** [ChatScreenMobile.tsx#L121](src/app/components/ChatScreenMobile.tsx#L121)

### 7.9 Date Badge: "Heute"
- **Element:** `<div>` tag (inline style)
- **Font-Family:** `fontFamily: 'Poppins, sans-serif'`
- **Font-Size:** `fontSize: '12px'` → **12px**
- **Font-Weight:** `fontWeight: '500'` → **500** (Medium)
- **Padding:** `padding: '6px 14px'`
- **Border-Radius:** `borderRadius: '12px'`
- **Code:** inline style object
- **Line:** [ChatScreenMobile.tsx#L155](src/app/components/ChatScreenMobile.tsx#L155)

### 7.10 Message Bubble Text
- **Element:** `<p>` tag (via `MessageBubble` component)
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `fontSize: '15px'` → **15px**
- **Font-Weight:** **400** (Regular)
- **Line-Height:** `lineHeight: '21px'` → **21px**
- **Code:** `className="font-['Poppins:Regular',sans-serif]"` + `style={{ fontSize: '15px', lineHeight: '21px' }}`
- **Line:** [ChatScreenMobile.tsx#L417](src/app/components/ChatScreenMobile.tsx#L417)

### 7.11 Message Bubble - Message Container Padding
- **Padding:** `padding: '12px 16px'` → horizontal: 16px, vertical: 12px
- **Border-Radius:** `borderRadius: '18px'` (with `4px` for bottom-left/right corner)

### 7.12 Message Timestamp
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `fontSize: '11px'` → **11px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="font-['Poppins:Regular',sans-serif]"` + `style={{ fontSize: '11px' }}`
- **Line:** [ChatScreenMobile.tsx#L432](src/app/components/ChatScreenMobile.tsx#L432)

### 7.13 Input Placeholder: "Nachricht schreiben..."
- **Element:** `<textarea>`
- **Font-Family:** `fontFamily: 'Poppins, sans-serif'`
- **Font-Size:** `fontSize: '15px'` → **15px**
- **Line-Height:** `lineHeight: '20px'` → **20px**
- **Input Container Padding:** `padding: '10px 16px'`
- **Input Container Border-Radius:** `borderRadius: '24px'`
- **Code:** inline style object
- **Line:** [ChatScreenMobile.tsx#L292](src/app/components/ChatScreenMobile.tsx#L292)

### 7.14 Send Button
- **Element:** `<motion.button>` 
- **Width:** `width: '44px'`
- **Height:** `height: '44px'`
- **Border-Radius:** `borderRadius: '50%'`
- **Line:** [ChatScreenMobile.tsx#L309](src/app/components/ChatScreenMobile.tsx#L309)

---

## 📱 SCREEN 8: KIToolsScreen.tsx

**File:** `src/app/components/KIToolsScreen.tsx` (281 lines)

---

### 8.1 Progress Percentage: "67%"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[14px]` → **14px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white"`
- **Line:** [KIToolsScreen.tsx#L88](src/app/components/KIToolsScreen.tsx#L88)

### 8.2 Primary CTA Button: "Chat with your Learning Assistant"
- **Element:** `<p>` inside `<button>`
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[14px]` → **14px**
- **Font-Weight:** **500** (Medium)
- **Button Height:** `h-[50px]` → **50px**
- **Button Border-Radius:** `rounded-[15px]`
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[14px] text-white"`
- **Line:** [KIToolsScreen.tsx#L94](src/app/components/KIToolsScreen.tsx#L94)

### 8.3 AI Tool Card Labels: "Generate Flashcards", "Exam Simulation"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Line-Height:** `leading-[16px]` → **16px**
- **Text-Align:** `text-center`
- **Button Container:** `rounded-2xl h-[120px] p-4`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white text-center leading-[16px]"`
- **Lines:** [KIToolsScreen.tsx#L126](src/app/components/KIToolsScreen.tsx#L126), [L152](src/app/components/KIToolsScreen.tsx#L152)

### 8.4 Section Header: "Your Library"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **700** (Bold)
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[12px] text-[rgba(255,255,255,0.7)] mb-3"`
- **Line:** [KIToolsScreen.tsx#L160](src/app/components/KIToolsScreen.tsx#L160)

### 8.5 Library Card Labels: "My Flashcards", "Completed Exams", "Prognosis"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **600** (SemiBold)
- **Line-Height:** `leading-[13px]` → **13px**
- **Text-Align:** `text-center`
- **Button Container:** `rounded-2xl h-[120px] p-3`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white text-center leading-[13px]"`
- **Lines:** [KIToolsScreen.tsx#L201](src/app/components/KIToolsScreen.tsx#L201), [L237](src/app/components/KIToolsScreen.tsx#L237), [L270](src/app/components/KIToolsScreen.tsx#L270)

---

## 📱 SCREEN 9: SettingsScreenMobile.tsx

❌ **Keine separate SettingsScreenMobile.tsx vorhanden** - Settings werden über das ProfilScreenMobile.tsx mit MenuItem-Komponenten abgebildet (Benachrichtigungen, Passwort ändern, etc.).

---

## 📱 SCREEN 10: LoginScreen.tsx

**File:** `src/app/components/LoginScreen.tsx` (ca. 186 lines)
❌ **Keine separate Mobile-Variant** - LoginScreen.tsx wird responsive für Mobile und Desktop verwendet.

---

### 10.1 App Title: "SoStudy"
- **Element:** `<h1>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-4xl` → **36px** (Tailwind default)
- **Font-Weight:** **700** (Bold)
- **Code:** `className="text-4xl font-['Poppins:Bold',sans-serif] text-white mb-2"`
- **Line:** [LoginScreen.tsx#L78](src/app/components/LoginScreen.tsx#L78)

### 10.2 App Subtitle: "Anmelden und weiter lernen"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[15px]` → **15px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="text-white/60 font-['Poppins:Regular',sans-serif] text-[15px]"`
- **Line:** [LoginScreen.tsx#L81](src/app/components/LoginScreen.tsx#L81)

### 10.3 Error Message Text
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-sm` → **14px** (Tailwind default)
- **Font-Weight:** **400** (Regular)
- **Code:** `className="text-red-200 text-sm font-['Poppins:Regular',sans-serif]"`
- **Line:** [LoginScreen.tsx#L93](src/app/components/LoginScreen.tsx#L93)

### 10.4 Input Label: "E-Mail", "Passwort"
- **Element:** `<label>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-sm` → **14px** (Tailwind default)
- **Font-Weight:** **500** (Medium)
- **Code:** `className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2"`
- **Lines:** [LoginScreen.tsx#L99](src/app/components/LoginScreen.tsx#L99), [L115](src/app/components/LoginScreen.tsx#L115)

### 10.5 Input Field Text
- **Element:** `<input>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Input Padding:** `px-12 py-3.5` → horizontal: 48px (with icon), vertical: 14px
- **Input Border-Radius:** `rounded-xl`
- **Code:** `className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-12 py-3.5 text-white font-['Poppins:Regular',sans-serif] placeholder:text-white/30 outline-none focus:border-[#009379] transition-colors"`
- **Lines:** [LoginScreen.tsx#L104](src/app/components/LoginScreen.tsx#L104), [L122](src/app/components/LoginScreen.tsx#L122)

### 10.6 Primary Button: "Anmelden"
- **Element:** `<button>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[15px]` → **15px**
- **Font-Weight:** **600** (SemiBold)
- **Button Padding:** `py-4` → vertical: 16px, full width
- **Button Border-Radius:** `rounded-xl`
- **Code:** `className="w-full bg-gradient-to-br from-[#00B894] to-[#009379] text-white font-['Poppins:SemiBold',sans-serif] text-[15px] py-4 rounded-xl ..."`
- **Line:** [LoginScreen.tsx#L137](src/app/components/LoginScreen.tsx#L137)

### 10.7 Register Link: "Noch kein Konto?" + "Jetzt registrieren"
- **Element:** `<span>` + `<button>`
- **Regular Text:** `font-['Poppins:Regular',sans-serif]`, `text-sm` → **14px**, weight **400**
- **Link Text:** `font-['Poppins:SemiBold',sans-serif]`, `text-sm` → **14px**, weight **600**
- **Lines:** [LoginScreen.tsx#L145](src/app/components/LoginScreen.tsx#L145), [L148](src/app/components/LoginScreen.tsx#L148)

---

## 📱 SCREEN 11: RegisterScreen.tsx

**File:** `src/app/components/RegisterScreen.tsx` (373 lines)
❌ **Keine separate Mobile-Variant** - RegisterScreen.tsx wird responsive verwendet.

---

### 11.1 App Title: "SoStudy"
- **Element:** `<h1>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-4xl` → **36px**
- **Font-Weight:** **700** (Bold)
- **Code:** `className="text-4xl font-['Poppins:Bold',sans-serif] text-white mb-2"`
- **Line:** [RegisterScreen.tsx#L140](src/app/components/RegisterScreen.tsx#L140)

### 11.2 App Subtitle: "Jetzt kostenlos registrieren"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[15px]` → **15px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="text-white/60 font-['Poppins:Regular',sans-serif] text-[15px]"`
- **Line:** [RegisterScreen.tsx#L143](src/app/components/RegisterScreen.tsx#L143)

### 11.3 Error Message Text
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-sm` → **14px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="text-red-200 text-sm font-['Poppins:Regular',sans-serif]"`
- **Line:** [RegisterScreen.tsx#L153](src/app/components/RegisterScreen.tsx#L153)

### 11.4 Input Labels: "Bundesland", "Schultyp", "Klasse", "Vorname", "Nachname", "E-Mail", "Passwort"
- **Element:** `<label>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-sm` → **14px**
- **Font-Weight:** **500** (Medium)
- **Code:** `className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2"`
- **Lines:** [RegisterScreen.tsx#L159](src/app/components/RegisterScreen.tsx#L159), [L197](src/app/components/RegisterScreen.tsx#L197), [L234](src/app/components/RegisterScreen.tsx#L234), [L271](src/app/components/RegisterScreen.tsx#L271), [L286](src/app/components/RegisterScreen.tsx#L286), [L301](src/app/components/RegisterScreen.tsx#L301), [L316](src/app/components/RegisterScreen.tsx#L316)

### 11.5 Picker Button Text (Bundesland/Schultyp/Klasse)
- **Element:** `<button>` with `<span>` 
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Input Padding:** `px-4 py-3.5` → horizontal: 16px, vertical: 14px
- **Input Border-Radius:** `rounded-xl`
- **Code:** `className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white font-['Poppins:Regular',sans-serif] ..."`
- **Lines:** [RegisterScreen.tsx#L162](src/app/components/RegisterScreen.tsx#L162), [L200](src/app/components/RegisterScreen.tsx#L200), [L237](src/app/components/RegisterScreen.tsx#L237)

### 11.6 Picker Dropdown Items
- **Element:** `<button>` in dropdown list
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Padding:** `px-4 py-3` → horizontal: 16px, vertical: 12px
- **Border-Radius:** `rounded-lg`
- **Code:** `className="w-full px-4 py-3 rounded-lg text-left text-white font-['Poppins:Regular',sans-serif] ..."`
- **Lines:** [RegisterScreen.tsx#L177](src/app/components/RegisterScreen.tsx#L177), [L217](src/app/components/RegisterScreen.tsx#L217), [L254](src/app/components/RegisterScreen.tsx#L254)

### 11.7 Text Input Fields (Vorname, Nachname, E-Mail, Passwort)
- **Element:** `<input>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Input Padding:** `px-12 py-3.5` → horizontal: 48px (with icon), vertical: 14px
- **Input Border-Radius:** `rounded-xl`
- **Code:** `className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-12 py-3.5 text-white font-['Poppins:Regular',sans-serif] placeholder:text-white/30 ..."`
- **Lines:** [RegisterScreen.tsx#L276](src/app/components/RegisterScreen.tsx#L276), [L291](src/app/components/RegisterScreen.tsx#L291), [L306](src/app/components/RegisterScreen.tsx#L306), [L323](src/app/components/RegisterScreen.tsx#L323)

### 11.8 Primary Button: "Konto erstellen"
- **Element:** `<button>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[15px]` → **15px**
- **Font-Weight:** **600** (SemiBold)
- **Button Padding:** `py-4` → vertical: 16px, full width
- **Button Border-Radius:** `rounded-xl`
- **Code:** `className="w-full bg-gradient-to-br from-[#00B894] to-[#009379] text-white font-['Poppins:SemiBold',sans-serif] text-[15px] py-4 rounded-xl ..."`
- **Line:** [RegisterScreen.tsx#L339](src/app/components/RegisterScreen.tsx#L339)

### 11.9 Login Link: "Bereits ein Konto?" + "Jetzt anmelden"
- **Element:** `<span>` + `<button>`
- **Regular Text:** `font-['Poppins:Regular',sans-serif]`, `text-sm` → **14px**, weight **400**
- **Link Text:** `font-['Poppins:SemiBold',sans-serif]`, `text-sm` → **14px**, weight **600**
- **Lines:** [RegisterScreen.tsx#L348](src/app/components/RegisterScreen.tsx#L348), [L351](src/app/components/RegisterScreen.tsx#L351)

---

## 📱 SHARED COMPONENT: MobileNavigation.tsx

**File:** `src/app/components/MobileNavigation.tsx` (used as bottom tab bar)

---

### Nav Tab Labels: "Home", "Meetings", "Chats", "KI-Tools", "Profil"
- **Element:** `<span>` tag
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight (Active):** `fontWeight: '600'` → **600** (SemiBold)
- **Font-Weight (Inactive):** `fontWeight: '500'` → **500** (Medium)
- **Code:** `className="text-[11px] font-medium ..."` + `style={{ fontWeight: isActive ? '600' : '500' }}`
- **Line:** [MobileNavigation.tsx#L76](src/app/components/MobileNavigation.tsx#L76)

---

## 📱 SHARED COMPONENT: AddTaskButton.tsx

**File:** `src/app/components/AddTaskButton.tsx` (used in HomeScreenMobile)

---

### Plus Sign: "+"
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[18px]` → **18px**
- **Font-Weight:** `font-semibold` → **600** (SemiBold)
- **Button Height:** `h-[38px]`
- **Button Padding:** `px-4`
- **Button Border-Radius:** `rounded-[14px]`
- **Code:** `className="relative z-10 font-['Poppins:SemiBold',sans-serif] font-semibold text-[18px] leading-[normal] whitespace-pre-wrap"`
- **Line:** [AddTaskButton.tsx#L21](src/app/components/AddTaskButton.tsx#L21)

### Button Text: "Aufgabe hinzufügen"
- **Element:** `<p>` inside `<div>`
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **500** (Medium)
- **Code:** `className="relative z-10 flex flex-col font-['Poppins:Medium',sans-serif] justify-center leading-[0] not-italic text-[13px]"`
- **Line:** [AddTaskButton.tsx#L22](src/app/components/AddTaskButton.tsx#L22)

---

## 📱 SHARED COMPONENT: DateCard.tsx

**File:** `src/app/components/DateCard.tsx` (used in SwipeableDateSelector on HomeScreen)

---

### Day Label: "Mo", "Di", etc.
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]` (inherited from parent)
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **500** (Medium, inherited)
- **Code:** `className="relative shrink-0 text-[12px] w-[34px] z-10 ..."`
- **Line:** [DateCard.tsx#L57](src/app/components/DateCard.tsx#L57)

### Date Number: "1", "15", etc.
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]` (inherited from parent)
- **Font-Size:** `text-[18px]` → **18px**
- **Font-Weight:** **500** (Medium, inherited)
- **Code:** `className="relative shrink-0 text-[18px] w-[34px] z-10 ..."`
- **Line:** [DateCard.tsx#L59](src/app/components/DateCard.tsx#L59)

---

## 📱 SHARED COMPONENT: TodoCard.tsx

**File:** `src/app/components/TodoCard.tsx` (used in HomeScreenMobile's TodoCardsSection)

---

### Card Title
- **Element:** `<h3>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[15px]` → **15px**
- **Font-Weight:** **600** (SemiBold)
- **Line-Height:** `leading-tight`
- **Card Height:** `h-[85px]`
- **Card Border-Radius:** `rounded-2xl`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white leading-tight truncate"`
- **Line:** [TodoCard.tsx#L95](src/app/components/TodoCard.tsx#L95)

### Card Description
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **400** (Regular)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-tight truncate"`
- **Line:** [TodoCard.tsx#L100](src/app/components/TodoCard.tsx#L100)

### Subject Pill Label
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **500** (Medium)
- **Pill Padding:** `px-3 py-1` → horizontal: 12px, vertical: 4px
- **Pill Border-Radius:** `rounded-full`
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[11px] text-white leading-none"`
- **Line:** [TodoCard.tsx#L109](src/app/components/TodoCard.tsx#L109)

### Time Text
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **500** (Medium)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/60 leading-tight"`
- **Line:** [TodoCard.tsx#L116](src/app/components/TodoCard.tsx#L116)

### Duration Text
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **400** (Regular)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/40 leading-tight"`
- **Line:** [TodoCard.tsx#L120](src/app/components/TodoCard.tsx#L120)

### Action Button Text: "Beitreten", "Start", "Demnächst"
- **Element:** `<span>` inside `<button>`
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **600** (SemiBold)
- **Button Padding:** `px-4 py-1.5` → horizontal: 16px, vertical: 6px
- **Button Border-Radius:** `rounded-[10px]`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white leading-none"`
- **Line:** [TodoCard.tsx#L127](src/app/components/TodoCard.tsx#L127)

---

## 📱 SHARED COMPONENT: FlashcardItem.tsx

**File:** `src/app/components/FlashcardItem.tsx` (320 lines, used in HomeScreenMobile & MyFlashcardsScreenMobile)

---

### Card Count: "42 Karten"
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-white/25 text-[10px]"`
- **Line:** [FlashcardItem.tsx#L222](src/app/components/FlashcardItem.tsx#L222)

### Date Label
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[9px]` → **9px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-white/30 text-[9px] mt-0.5"`
- **Line:** [FlashcardItem.tsx#L226](src/app/components/FlashcardItem.tsx#L226)

### Card Title
- **Element:** `<h3>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **600** (SemiBold)
- **Line-Height:** `leading-[1.25]`
- **Card Height:** `h-[100px]`
- **Card Border-Radius:** `rounded-2xl`
- **Card Padding:** `p-4`
- **Code:** `className="flex-1 font-['Poppins:SemiBold',sans-serif] text-white/95 text-[12px] leading-[1.25] line-clamp-2 pr-16"`
- **Line:** [FlashcardItem.tsx#L236](src/app/components/FlashcardItem.tsx#L236)

### Golden Badge (e.g., "#1")
- **Element:** `<span>` inside `<h3>`
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Weight:** **700** (Bold)
- **Color:** `#FFD700`
- **Text-Shadow:** `0 0 8px rgba(255, 215, 0, 0.5)`
- **Code:** `className="font-['Poppins:Bold',sans-serif]"` + `style={{ color: '#FFD700', textShadow: '0 0 8px rgba(255, 215, 0, 0.5)' }}`
- **Line:** [FlashcardItem.tsx#L240](src/app/components/FlashcardItem.tsx#L240)

### Subject Badge Text
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **500** (Medium)
- **Badge Width:** `w-[100px]`, `h-7` → height: 28px
- **Badge Border-Radius:** `rounded-full`
- **Code:** `className="relative z-10 font-['Poppins:Medium',sans-serif] text-white text-[11px] truncate"`
- **Line:** [FlashcardItem.tsx#L272](src/app/components/FlashcardItem.tsx#L272)

### Progress Percentage Text
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-white text-[12px] tabular-nums drop-shadow-lg relative z-10"`
- **Line:** [FlashcardItem.tsx#L293](src/app/components/FlashcardItem.tsx#L293)

---

## 📱 SHARED COMPONENT: CompletedExamCard.tsx

**File:** `src/app/components/CompletedExamCard.tsx` (273 lines, used in HomeScreenMobile & CompletedExamsScreenMobile)

---

### Badge Number (e.g., "#1")
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **600** (SemiBold)
- **Padding:** `px-1.5 py-0.5` → horizontal: 6px, vertical: 2px
- **Border-Radius:** `rounded-full`
- **Code:** `className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-['Poppins:SemiBold',sans-serif] flex-shrink-0"`
- **Line:** [CompletedExamCard.tsx#L154](src/app/components/CompletedExamCard.tsx#L154)

### Card Title (Topic Name)
- **Element:** `<h3>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[14px]` → **14px**
- **Font-Weight:** **600** (SemiBold)
- **Line-Height:** `leading-[19px]` → **19px**
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white leading-[19px] truncate min-w-0"`
- **Line:** [CompletedExamCard.tsx#L162](src/app/components/CompletedExamCard.tsx#L162)

### Subject & Subtopics Line
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **500** (Medium)
- **Line-Height:** `leading-[15px]` → **15px**
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797] ... leading-[15px] ..."`
- **Line:** [CompletedExamCard.tsx#L177](src/app/components/CompletedExamCard.tsx#L177)

### Grade Display (e.g., "1.3")
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[22px]` → **22px**
- **Font-Weight:** **700** (Bold)
- **Code:** `className="text-[22px] font-['Poppins:Bold',sans-serif] leading-none mb-0.5"`
- **Line:** [CompletedExamCard.tsx#L191](src/app/components/CompletedExamCard.tsx#L191)

### Grade Label: "Note"
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[9px]` → **9px**
- **Font-Weight:** **500** (Medium)
- **Code:** `className="text-[9px] font-['Poppins:Medium',sans-serif] text-[#707070]"`
- **Line:** [CompletedExamCard.tsx#L196](src/app/components/CompletedExamCard.tsx#L196)

### Grade Text (e.g., "Sehr gut")
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="text-[12px] font-['Poppins:SemiBold',sans-serif]"`
- **Line:** [CompletedExamCard.tsx#L202](src/app/components/CompletedExamCard.tsx#L202)

### Score Details (e.g., "8/10 Richtig • 80%")
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **500** (Medium)
- **Code:** `className="text-[10px] font-['Poppins:Medium',sans-serif] text-[#979797]"`
- **Line:** [CompletedExamCard.tsx#L207](src/app/components/CompletedExamCard.tsx#L207)

### Time & Date Line
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **500** (Medium)
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[#979797]"` (within `text-[10px]` parent)
- **Line:** [CompletedExamCard.tsx#L215](src/app/components/CompletedExamCard.tsx#L215)

### Completion Date
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **500** (Medium)
- **Code:** `className="flex-1 font-['Poppins:Medium',sans-serif] text-[#707070] text-right"`
- **Line:** [CompletedExamCard.tsx#L219](src/app/components/CompletedExamCard.tsx#L219)

### Fallback Score (no grade) - Score Percentage
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[12px]"`
- **Line:** [CompletedExamCard.tsx#L232](src/app/components/CompletedExamCard.tsx#L232)

### Fallback - Questions Count
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **500** (Medium)
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797]"`
- **Line:** [CompletedExamCard.tsx#L239](src/app/components/CompletedExamCard.tsx#L239)

### Fallback - Time
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **500** (Medium)
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797]"`
- **Line:** [CompletedExamCard.tsx#L246](src/app/components/CompletedExamCard.tsx#L246)

### Fallback - Completion Date
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **500** (Medium)
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[10px] text-[#707070]"`
- **Line:** [CompletedExamCard.tsx#L254](src/app/components/CompletedExamCard.tsx#L254)

---

## 📱 SHARED COMPONENT: MobileTabs.tsx

**File:** `src/app/components/MobileTabs.tsx`

---

### Tab Labels: "Repeat", "Manual", "Prognosis"
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `fontSize: '13px'` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Letter-Spacing:** `letterSpacing: '-0.01em'`
- **Button Padding:** `px-4 py-2` → horizontal: 16px, vertical: 8px
- **Button Border-Radius:** `rounded-md`
- **Code:** `className="relative z-10 font-['Poppins:SemiBold',sans-serif] ..."` + `style={{ fontSize: '13px', letterSpacing: '-0.01em' }}`
- **Line:** [MobileTabs.tsx#L87](src/app/components/MobileTabs.tsx#L87)

---

## 📊 TYPOGRAPHY PATTERN SUMMARY (Mobile Screens)

| Element Type | Font-Family | Font-Size | Font-Weight | Common Classes |
|---|---|---|---|---|
| **Screen Title** | Poppins:SemiBold | 17px | 600 | `font-['Poppins:SemiBold',sans-serif] text-[17px]` |
| **App Title (Auth)** | Poppins:Bold | 36px | 700 | `text-4xl font-['Poppins:Bold',sans-serif]` |
| **Profile Name** | Poppins:SemiBold | 22px | 600 | `font-['Poppins:SemiBold',sans-serif] text-[22px]` |
| **Chat List Title** | Poppins:Bold | 20px | 700 | `font-['Poppins:Bold',sans-serif] text-[20px]` |
| **Greeting** | Poppins:Bold | 18px | 700 | `font-['Poppins:Bold',sans-serif] text-[18px]` |
| **Section Header (Home)** | Poppins:Bold | 16-18px | 700 | `font-['Poppins:Bold',sans-serif] text-[16-18px]` |
| **Sub-Section Header** | Poppins:SemiBold | 13px | 600 | `font-['Poppins:SemiBold',sans-serif] text-[13px]` |
| **Section Header (Profil)** | Poppins:SemiBold | 12px | 600 | `uppercase tracking-wide text-[12px]` |
| **Section Header (KI-Tools)** | Poppins:Bold | 12px | 700 | `font-['Poppins:Bold',sans-serif] text-[12px]` |
| **Chat Participant Name** | Poppins:SemiBold | 16-17px | 600 | `font-['Poppins:SemiBold',sans-serif] text-[16-17px]` |
| **Card Title** | Poppins:SemiBold | 12-15px | 600 | `font-['Poppins:SemiBold',sans-serif] text-[12-15px]` |
| **Menu Item** | Poppins:Medium | 15px | 500 | `font-['Poppins:Medium',sans-serif] text-[15px]` |
| **Button (Primary Auth)** | Poppins:SemiBold | 15px | 600 | `font-['Poppins:SemiBold',sans-serif] text-[15px]` |
| **Button (CTA)** | Poppins:Medium | 14px | 500 | `font-['Poppins:Medium',sans-serif] text-[14px]` |
| **AI Tool Label** | Poppins:SemiBold | 13px | 600 | `leading-[16px] text-center` |
| **Tab Label (Bottom Bar)** | Poppins:Medium | 14px | 500 | `font-['Poppins:Medium',sans-serif] text-[14px]` |
| **Nav Tab Label** | — | 11px | 500-600 | `text-[11px] font-medium` |
| **Body Text** | Poppins:Regular | 13-15px | 400 | `font-['Poppins:Regular',sans-serif]` |
| **Message Bubble** | Poppins:Regular | 15px | 400 | `lineHeight: '21px'` |
| **Input Label** | Poppins:Medium | 14px | 500 | `text-sm font-['Poppins:Medium',sans-serif]` |
| **Input Text** | Poppins:Regular | — | 400 | `font-['Poppins:Regular',sans-serif]` |
| **Chat Input** | Poppins | 15px | — | `fontSize: '15px', lineHeight: '20px'` |
| **Card Description** | Poppins:Regular | 12px | 400 | `font-['Poppins:Regular',sans-serif] text-[12px]` |
| **Subject Pill** | Poppins:Medium | 11px | 500 | `font-['Poppins:Medium',sans-serif] text-[11px]` |
| **Small Label** | Poppins:Medium | 10-11px | 500 | `text-[10-11px]` |
| **Badge** | Poppins:SemiBold | 10-11px | 600 | `font-['Poppins:SemiBold',sans-serif]` |
| **Action Button (Card)** | Poppins:SemiBold | 12px | 600 | `px-4 py-1.5 rounded-[10px]` |
| **"View All" Link** | Poppins:Bold | 11px | 700 | `font-['Poppins:Bold',sans-serif] text-[11px]` |
| **Metadata (Tiny)** | Poppins:Regular | 9-10px | 400 | `font-['Poppins:Regular',sans-serif] text-[9-10px]` |
| **Timestamp (Chat)** | Poppins:Regular | 11px | 400 | `fontSize: '11px'` |
| **Grade Display** | Poppins:Bold | 22px | 700 | `font-['Poppins:Bold',sans-serif] text-[22px]` |
| **Error Message** | Poppins:Regular | 14px | 400 | `text-sm font-['Poppins:Regular',sans-serif]` |
| **Auth Link** | Poppins:SemiBold | 14px | 600 | `text-sm font-['Poppins:SemiBold',sans-serif]` |
| **Empty State Title** | Poppins:SemiBold | 16px | 600 | `text-[16px] text-center` |
| **Empty State Description** | Poppins:Regular | 14px | 400 | `text-[14px] text-center` |
| **Promo Title** | Poppins:Bold | 14px | 700 | `font-['Poppins:Bold',sans-serif] text-[14px]` |
| **Promo Description** | Poppins:Medium | 12px | 500 | `font-['Poppins:Medium',sans-serif] text-[12px]` |
| **Promo Button** | Poppins:Bold | 12px | 700 | `px-5 py-2 rounded-[10px]` |
| **App Version** | Poppins:Regular | 11px | 400 | `text-[11px] text-center` |

---

## 🔑 BUTTON PATTERNS SUMMARY (Mobile)

| Button Type | Font | Size | Weight | Padding | Height | Border-Radius |
|---|---|---|---|---|---|---|
| **Auth Primary** | Poppins:SemiBold | 15px | 600 | `py-4` (full-width) | auto | `rounded-xl` |
| **AI Tool Card** | Poppins:SemiBold | 13px | 600 | `p-4` | 120px | `rounded-2xl` |
| **Library Card** | Poppins:SemiBold | 11px | 600 | `p-3` | 120px | `rounded-2xl` |
| **CTA Button** | Poppins:Medium | 14px | 500 | — | 50px | `rounded-[15px]` |
| **Add Task** | Poppins:Medium | 13px | 500 | `px-4` | 38px | `rounded-[14px]` |
| **Action Button (Card)** | Poppins:SemiBold | 12px | 600 | `px-4 py-1.5` | auto | `rounded-[10px]` |
| **Create Set** | Poppins:Medium | 15px | 500 | `px-6 py-4` | auto | `rounded-[16px]` |
| **Promo Invite** | Poppins:Bold | 12px | 700 | `px-5 py-2` | auto | `rounded-[10px]` |
| **Tab Button** | Poppins:Medium | 14px | 500 | `px-4` | 40px | `rounded-[14px]` |
| **Header Icon Button** | — | — | — | — | 42px (circle) | `rounded-full` |
| **Send Button (Chat)** | — | — | — | — | 44px (circle) | `rounded-full` |
| **Date Card** | Poppins:Medium | — | 500 | `px-[6px] py-[16px]` | full | `rounded-[24px]` |

---

## 📐 INPUT PATTERNS SUMMARY (Mobile)

| Input Type | Font | Padding | Border-Radius | Height |
|---|---|---|---|---|
| **Auth Input (with icon)** | Poppins:Regular | `px-12 py-3.5` (48px/14px) | `rounded-xl` | auto |
| **Picker Button** | Poppins:Regular | `px-4 py-3.5` (16px/14px) | `rounded-xl` | auto |
| **Chat Textarea** | Poppins, sans-serif | `10px 16px` | `24px` (parent) | auto (max 100px) |
| **Picker Dropdown Item** | Poppins:Regular | `px-4 py-3` (16px/12px) | `rounded-lg` | auto |

---

✅ **PHASE 1 COMPLETE (Mobile Screens) - Ready for Phase 2**

### Screens Documented:
1. ✅ HomeScreenMobile.tsx (+ MobileHeader, AddTaskButton, DateCard, TodoCard, FlashcardItem, CompletedExamCard)
2. ✅ MyFlashcardsScreenMobile.tsx (+ MobileTabs)
3. ❌ ExamScreenMobile.tsx - Nicht vorhanden (kein separater Launcher-Screen)
4. ✅ CompletedExamsScreenMobile.tsx
5. ❌ GenerateFlashcardsScreenMobile.tsx - Eigenständige App in `/src/flashcardgen/`
6. ✅ ProfilScreenMobile.tsx
7. ✅ ChatScreenMobile.tsx (ChatRoomList + Chat View + MessageBubble)
8. ✅ KIToolsScreen.tsx (kein separater Mobile-Suffix, aber Mobile-Layout)
9. ❌ SettingsScreenMobile.tsx - Nicht vorhanden (in ProfilScreen integriert)
10. ✅ LoginScreen.tsx (keine separate Mobile-Variant, responsive)
11. ✅ RegisterScreen.tsx (keine separate Mobile-Variant, responsive)
12. ✅ MobileNavigation.tsx (Bottom Tab Bar)
