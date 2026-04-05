# ORIGINAL TYPOGRAPHY VALUES DOCUMENTATION
## SoStudy Project - Exact Typography Reference

> **Purpose:** This document serves as the single source of truth for all typography values (font-weights, font-sizes, button sizes, paddings) used in the SoStudy project. Use this to maintain consistency across all screens and components.

> **Last Updated:** February 15, 2026

---

## 📱 PRIORITY 1: MAIN SCREENS

### HomeScreenMobile.tsx

#### Section Headers

**"Your ToDo's" (Main Section):**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[18px]` → **18px**
- **Font-Weight:** **700** (Bold)
- **Color:** `text-white`
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[18px] text-white"`
- **Line:** 102

**"AI Tools" (Section Header):**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[16px]` → **16px**
- **Font-Weight:** **700** (Bold)
- **Color:** `text-white`
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[16px] text-white"`
- **Line:** 159

**"Recently used Flashcards" (Sub-Section Header):**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `text-white`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white"`
- **Line:** 234

**"Completed Exams" (Sub-Section Header):**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `text-white`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white"`
- **Line:** 274

**"Your Tutors" (Sub-Section Header):**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white"`
- **Line:** 326

**"Extra-Sessions" (Sub-Section Header):**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white"`
- **Line:** 377

**"Recently viewed Documents" (Sub-Section Header):**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white"`
- **Line:** 444

---

#### "View All" Buttons

**"View All" Link Text:**
- **Element:** `<p>` inside `<button>`
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **700** (Bold)
- **Color:** `text-white`
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[11px] text-white"`
- **Lines:** 238, 278, 330, 381, 448

---

#### AI Tool Cards

**AI Tool Card Title (Generate Flashcards / Exam Simulation):**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `text-white`
- **Text-Align:** `text-center`
- **Line-Height:** `leading-[16px]`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white text-center leading-[16px]"`
- **Lines:** 191, 223

**AI Tool Card Container:**
- **Size:** `h-[120px]` → **120px height**
- **Border-Radius:** `rounded-2xl`
- **Padding:** `p-4`
- **Code:** `className="... rounded-2xl h-[120px] ... p-4 ..."`

**AI Tool Icon:**
- **Size:** `w-[44px] h-[44px]` → **44px × 44px**
- **Margin-Bottom:** `mb-3`
- **Lines:** 190, 222

---

#### Tutor Cards

**Tutor Name:**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `text-white`
- **Text-Align:** `text-center`
- **Line-Height:** `leading-tight`
- **Code:** `className="relative z-10 font-['Poppins:SemiBold',sans-serif] text-[11px] text-white text-center leading-tight"`
- **Line:** 366

**Tutor Card Container:**
- **Min-Width:** `min-w-[140px]`
- **Border-Radius:** `rounded-2xl`
- **Padding:** `p-4`

**Tutor Profile Image:**
- **Size:** `w-[70px] h-[70px]` → **70px × 70px**
- **Border-Radius:** `rounded-full`
- **Margin-Bottom:** `mb-3`
- **Line:** 364

---

#### Extra-Sessions Cards

**Extra-Session Tutor Name:**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `text-white`
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white leading-tight"`
- **Line:** 422

**Extra-Session Topic:**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `text-white`
- **Line-Height:** `leading-tight`
- **Margin-Bottom:** `mb-2`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white mb-2 leading-tight"`
- **Line:** 426

**Extra-Session Date/Time:**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **400** (Regular)
- **Color:** `text-white/50` (50% opacity)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/50 leading-tight"`
- **Lines:** 429, 432

**Extra-Session Card Container:**
- **Min-Width:** `min-w-[190px]`
- **Border-Radius:** `rounded-2xl`
- **Padding:** `p-3`
- **Height:** Not fixed (auto-height)

**Extra-Session Tutor Avatar (small):**
- **Size:** `w-[32px] h-[32px]` → **32px × 32px**
- **Border-Radius:** `rounded-full`
- **Line:** 420

---

#### Document Card

**Document Title:**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `text-white`
- **Margin-Bottom:** `mb-1`
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white mb-1 leading-tight"`
- **Line:** 482

**Document Teacher:**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **400** (Regular)
- **Color:** `text-white/50`
- **Margin-Bottom:** `mb-0.5`
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/50 mb-0.5 leading-tight"`
- **Line:** 485

**Document Meta (Subject + Date):**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[9px]` → **9px**
- **Font-Weight:** **400** (Regular)
- **Color:** `text-white/30` (30% opacity)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/30 leading-tight"`
- **Line:** 488

**Document Icon Container:**
- **Size:** `w-[45px] h-[45px]` → **45px × 45px**
- **Border-Radius:** `rounded-[10px]`
- **Background:** `bg-white/[0.06]`
- **Line:** 476

---

#### Promotional Banner

**Promo Banner Main Text:**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[14px]` → **14px**
- **Font-Weight:** **700** (Bold)
- **Color:** `text-white`
- **Margin-Bottom:** `mb-1`
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[14px] text-white mb-1"`
- **Line:** 497

**Promo Banner Sub-Text:**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **500** (Medium)
- **Color:** `text-white`
- **Margin-Bottom:** `mb-3`
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[12px] text-white mb-3"`
- **Line:** 500

**Promo Banner Button Text:**
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **700** (Bold)
- **Color:** `text-[#009379]` (Green text on white button)
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[12px] text-[#009379]"`
- **Line:** 504

**Promo Banner Button:**
- **Background:** `bg-white`
- **Border-Radius:** `rounded-[10px]`
- **Padding:** `px-5 py-2`
- **Code:** `className="bg-white rounded-[10px] px-5 py-2 ..."`
- **Line:** 503

**Promo Banner Container:**
- **Border-Radius:** `rounded-2xl`
- **Padding:** `p-4`
- **Margin-Bottom:** `mb-6`
- **Background:** `bg-gradient-to-r from-[#009379] to-[#00705C]`
- **Box-Shadow:** `shadow-[0px_4px_16px_rgba(0,147,121,0.35)]`

---

#### Empty States

**Empty State Text (No Flashcards / No Exams):**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **400** (Regular)
- **Color:** `text-white/40` (40% opacity)
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40"`
- **Lines:** 263, 315

---

#### Filter Button

**Filter Icon Button:**
- **Size:** `w-[38px] h-[38px]` → **38px × 38px**
- **Border-Radius:** `rounded-[10px]`
- **Background:** `bg-gradient-to-br from-white/[0.05] to-white/[0.02]`
- **Border:** `border border-white/[0.08]`
- **Hover:** `hover:border-white/[0.15]`
- **Active:** `active:scale-95`
- **Line:** 113

**Filter Count Badge:**
- **Size:** `w-4 h-4` → **16px × 16px**
- **Border-Radius:** `rounded-full`
- **Background:** `bg-purple-500`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** `font-bold` → **700**
- **Position:** `absolute -top-1 -right-1`
- **Code:** `className="... w-4 h-4 bg-purple-500 rounded-full text-[10px] font-bold text-white ..."`
- **Line:** 126

---

## 📇 PRIORITY 2: COMPONENTS

### FlashcardItem.tsx (Component)

#### Card Title

**Flashcard Title:**
- **Element:** `<h3>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `text-white/95` (95% opacity)
- **Line-Height:** `leading-[1.25]`
- **Max-Lines:** `line-clamp-2` (2 lines max with ellipsis)
- **Padding-Right:** `pr-16` (to avoid card count overlap)
- **Code:** `className="flex-1 font-['Poppins:SemiBold',sans-serif] text-white/95 text-[12px] leading-[1.25] line-clamp-2 pr-16"`
- **Line:** 240

**Golden Badge in Title (e.g., "#1"):**
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Weight:** **700** (Bold)
- **Color:** `#FFD700` (Gold)
- **Text-Shadow:** `0 0 8px rgba(255, 215, 0, 0.5)`
- **Code:** `className="font-['Poppins:Bold',sans-serif]" style={{ color: '#FFD700', textShadow: '0 0 8px rgba(255, 215, 0, 0.5)' }}`
- **Line:** 244

---

#### Card Meta Information

**Card Count ("42 Karten"):**
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **400** (Regular)
- **Color:** `text-white/25` (25% opacity - very subtle)
- **Position:** `absolute top-3 right-3`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-white/25 text-[10px]"`
- **Line:** 221

**Date Label ("Heute", "Gestern", etc.):**
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[9px]` → **9px**
- **Font-Weight:** **400** (Regular)
- **Color:** `text-white/30` (30% opacity)
- **Margin-Top:** `mt-0.5`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-white/30 text-[9px] mt-0.5"`
- **Line:** 225

---

#### Subject Badge

**Subject Badge Text:**
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **500** (Medium)
- **Color:** `text-white`
- **Text-Overflow:** `truncate`
- **Code:** `className="relative z-10 font-['Poppins:Medium',sans-serif] text-white text-[11px] truncate"`
- **Line:** 278

**Subject Badge Container:**
- **Width:** `w-[100px]` → **100px** (FIXED WIDTH!)
- **Height:** `h-7` → **28px**
- **Padding:** `px-3`
- **Border-Radius:** `rounded-full`
- **Background:** Dynamic (subject color with 25% opacity + blur)
- **Border:** Dynamic (subject color with 40% opacity)
- **Code:** `className="relative w-[100px] h-7 px-3 rounded-full ..."`
- **Line:** 264

---

#### Progress Badge

**Progress Percentage Text:**
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `text-white`
- **Font-Variant:** `tabular-nums` (monospace numbers)
- **Text-Shadow:** `drop-shadow-lg`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-white text-[12px] tabular-nums drop-shadow-lg ..."`
- **Line:** 310

**Progress Badge Container:**
- **Width:** `flex-1` (takes remaining space after subject badge)
- **Height:** `h-7` → **28px**
- **Border-Radius:** `rounded-full`
- **Background:** `rgba(255, 255, 255, 0.03)`
- **Border:** `rgba(255, 255, 255, 0.08)`
- **Code:** `className="relative flex-1 h-7 rounded-full ..."`
- **Line:** 284

---

#### Card Container

**FlashcardItem Card:**
- **Height:** `h-[100px]` → **100px** (FIXED HEIGHT!)
- **Border-Radius:** `rounded-2xl`
- **Padding:** `p-4`
- **Background:** `bg-gradient-to-br from-white/[0.05] to-white/[0.02]`
- **Border:** `border border-white/[0.08]`
- **Hover:** `hover:border-white/[0.15]`
- **Active:** `active:scale-[0.98]`
- **Box-Shadow:** `0 4px 24px rgba(0, 0, 0, 0.12)`
- **Code:** `className="... bg-gradient-to-br from-white/[0.05] to-white/[0.02] ... border border-white/[0.08] rounded-2xl p-4 h-[100px] ..."`
- **Line:** 198

**Subject Icon:**
- **Size:** `w-6 h-6` → **24px × 24px**
- **Margin-Top:** `mt-0.5`
- **Line:** 235

---

### CompletedExamCard.tsx (Component)

#### Card Header & Title

**Exam Topic Name:**
- **Element:** `<h3>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[14px]` → **14px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `text-white`
- **Line-Height:** `leading-[19px]`
- **Text-Overflow:** `truncate`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white leading-[19px] truncate ..."`
- **Line:** 157

**Golden Badge (e.g., "#1", "#2"):**
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `#FFD700` (Gold)
- **Background:** `rgba(255, 215, 0, 0.15)` (Gold 15% opacity)
- **Border:** `1px solid rgba(255, 215, 0, 0.3)`
- **Padding:** `px-1.5 py-0.5`
- **Border-Radius:** `rounded-full`
- **Code:** `className="... px-1.5 py-0.5 rounded-full text-[10px] font-['Poppins:SemiBold',sans-serif] ..." style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)', color: '#FFD700', border: '1px solid rgba(255, 215, 0, 0.3)' }}`
- **Line:** 147

---

#### Subject & Subtopics

**Subject & Subtopics Text:**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **500** (Medium)
- **Color:** `text-[#979797]` (Gray)
- **Hover-Color:** `group-hover/subtopics:text-[#4cadfd]` (Blue on hover)
- **Line-Height:** `leading-[15px]`
- **Text-Overflow:** `truncate`
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797] group-hover/subtopics:text-[#4cadfd] leading-[15px] ..."`
- **Line:** 178

---

#### Grade Display (Main Feature)

**Grade Number (e.g., "1.3"):**
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[22px]` → **22px** (LARGE!)
- **Font-Weight:** **700** (Bold)
- **Color:** Dynamic based on grade (Green/Blue/Orange/Red)
- **Line-Height:** `leading-none`
- **Margin-Bottom:** `mb-0.5`
- **Code:** `className="text-[22px] font-['Poppins:Bold',sans-serif] leading-none mb-0.5" style={{ color: getGradeColor(exam.grade) }}`
- **Line:** 196

**Grade Label ("Note"):**
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[9px]` → **9px**
- **Font-Weight:** **500** (Medium)
- **Color:** `text-[#707070]` (Dark gray)
- **Code:** `className="text-[9px] font-['Poppins:Medium',sans-serif] text-[#707070]"`
- **Line:** 201

**Grade Text (e.g., "Sehr gut"):**
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** Dynamic based on grade
- **Code:** `className="text-[12px] font-['Poppins:SemiBold',sans-serif]" style={{ color: getGradeColor(exam.grade) }}`
- **Line:** 207

**Grade Stats ("12/15 Richtig • 80%"):**
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **500** (Medium)
- **Color:** `text-[#979797]` (Gray)
- **Code:** `className="text-[10px] font-['Poppins:Medium',sans-serif] text-[#979797]"`
- **Line:** 212

---

#### Time & Date Display

**Time Display ("Dauer: 5:32"):**
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **500** (Medium)
- **Color:** `text-[#979797]` (Gray)
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[#979797]"`
- **Line:** 221

**Date Display ("10.12.2024"):**
- **Element:** `<div>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **500** (Medium)
- **Color:** `text-[#707070]` (Dark gray)
- **Text-Align:** `text-right`
- **Code:** `className="flex-1 font-['Poppins:Medium',sans-serif] text-[#707070] text-right"`
- **Line:** 225

---

#### Fallback Stats (when no grade available)

**Score Percentage:**
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** Dynamic (Green/Blue/Orange/Red based on score)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[12px]" style={{ color: getScoreColor(exam.score) }}`
- **Line:** 239

**Questions Count ("12/15"):**
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **500** (Medium)
- **Color:** `text-[#979797]` (Gray)
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797]"`
- **Line:** 247

**Time Display (Fallback):**
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **500** (Medium)
- **Color:** `text-[#979797]` (Gray)
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797]"`
- **Line:** 255

**Completed Date (Fallback):**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **500** (Medium)
- **Color:** `text-[#707070]` (Dark gray)
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[10px] text-[#707070]"`
- **Line:** 262

---

#### Icons

**Trophy Icon (Score):**
- **Size:** `size-[12px]` → **12px × 12px**
- **Line:** 238

**CheckCircle2 Icon (Questions):**
- **Size:** `size-[12px]` → **12px × 12px**
- **Line:** 246

**Clock Icon (Time):**
- **Size:** `size-[12px]` → **12px × 12px**
- **Lines:** 220, 254

**Clock Icon (Time in main display):**
- **Size:** `size-[11px]` → **11px × 11px**
- **Line:** 220

**ChevronRight Icon (Subtopics):**
- **Size:** `size-[12px]` → **12px × 12px**
- **Line:** 182

**Sparkles Icon (AI Generated):**
- **Size:** `w-[14px] h-[14px]` → **14px × 14px**
- **Line:** 165

**CheckCircle2 Icon (Selection):**
- **Size:** `size-[14px]` → **14px × 14px**
- **Line:** 133

---

#### Card Container

**CompletedExamCard:**
- **Border-Radius:** `rounded-xl`
- **Padding:** `p-3`
- **Background:** `bg-gradient-to-br from-white/[0.05] to-white/[0.02]`
- **Border:** `border border-white/[0.08]`
- **Hover:** `hover:border-white/[0.15]`
- **Active:** `active:scale-[0.98]`
- **Box-Shadow:** `0 4px 24px rgba(0, 0, 0, 0.12)`
- **Selected Border:** `border-[#009379]` (Green when selected)
- **Selected Background:** `bg-[#009379]/10`
- **Selected Shadow:** `0 0 0 2px #009379, 0 4px 24px rgba(0, 0, 0, 0.12)`
- **Code:** `className="... rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] ... border ..."`
- **Line:** 99

---

### TodoCard.tsx (Component)

#### Card Title & Description

**Todo Title:**
- **Element:** `<h3>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[15px]` → **15px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `text-white`
- **Line-Height:** `leading-tight`
- **Text-Overflow:** `truncate`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white leading-tight truncate"`
- **Line:** 104

**Todo Description:**
- **Element:** `<p>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **400** (Regular)
- **Color:** `text-white/50` (50% opacity)
- **Line-Height:** `leading-tight`
- **Text-Overflow:** `truncate`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-tight truncate"`
- **Line:** 109

---

#### Subject Pill

**Subject Pill Text:**
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **500** (Medium)
- **Color:** `text-white`
- **Line-Height:** `leading-none`
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[11px] text-white leading-none"`
- **Line:** 121

**Subject Pill Container:**
- **Padding:** `px-3 py-1`
- **Border-Radius:** `rounded-full`
- **Background:** Dynamic (subject color)
- **Box-Shadow:** Dynamic (subject color with 40% opacity)
- **Display:** `inline-flex items-center`
- **Code:** `className="inline-flex items-center px-3 py-1 rounded-full ..."`
- **Line:** 115

---

#### Time & Action Button

**Time Display:**
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Medium',sans-serif]`
- **Font-Size:** `text-[11px]` → **11px**
- **Font-Weight:** **500** (Medium)
- **Color:** `text-white/60` (60% opacity)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/60 leading-tight"`
- **Line:** 132

**Duration Display:**
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:Regular',sans-serif]`
- **Font-Size:** `text-[10px]` → **10px**
- **Font-Weight:** **400** (Regular)
- **Color:** `text-white/40` (40% opacity)
- **Line-Height:** `leading-tight`
- **Code:** `className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/40 leading-tight"`
- **Line:** 137

**Action Button Text:**
- **Element:** `<span>` tag
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **600** (SemiBold)
- **Color:** `text-white`
- **Line-Height:** `leading-none`
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white leading-none"`
- **Line:** 147

**Action Button Container:**
- **Padding:** `px-4 py-1.5`
- **Border-Radius:** `rounded-[10px]`
- **Active:** `active:scale-95`
- **Background (Join):** `bg-gradient-to-r from-[#009379] to-[#00b894]` (Green gradient)
- **Background (Start):** `bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]` (Purple gradient)
- **Background (Upcoming):** `bg-white/[0.06]` (Transparent)
- **Box-Shadow (Join):** `shadow-[0px_4px_16px_rgba(0,147,121,0.35)]`
- **Box-Shadow (Start):** `shadow-[0px_4px_16px_rgba(99,102,241,0.35)]`
- **Code:** `className="px-4 py-1.5 rounded-[10px] ..."`
- **Line:** 145

---

#### Icon Container

**Icon Circle:**
- **Size:** `w-[42px] h-[42px]` → **42px × 42px**
- **Border-Radius:** `rounded-[12px]`
- **Background:** Dynamic gradient based on accent color
- **Box-Shadow:** Dynamic based on accent color
- **Code:** `className="w-[42px] h-[42px] rounded-[12px] ..."`
- **Line:** 92

**Icon (Lucide Icons):**
- **Size:** `w-5 h-5` → **20px × 20px**
- **Color:** `text-white`

---

#### Card Container

**TodoCard:**
- **Height:** `h-[85px]` → **85px** (FIXED HEIGHT!)
- **Border-Radius:** `rounded-2xl`
- **Padding:** `pl-4 pr-3` (asymmetric - left more than right)
- **Background:** `bg-gradient-to-br from-white/[0.05] to-white/[0.02]`
- **Border:** `border border-white/[0.08]`
- **Hover:** `hover:border-white/[0.15]`
- **Active:** `active:scale-[0.98]`
- **Box-Shadow:** `0 4px 24px rgba(0, 0, 0, 0.12)`
- **Code:** `className="... bg-gradient-to-br from-white/[0.05] to-white/[0.02] ... border border-white/[0.08] rounded-2xl h-[85px] ..."`
- **Line:** 61

**Accent Bar (Left Edge):**
- **Width:** `w-[5px]` → **5px**
- **Position:** `absolute left-0 top-0 bottom-0`
- **Border-Radius:** `rounded-l-2xl`
- **Background:** Dynamic gradient
- **Code:** `className="absolute left-0 top-0 bottom-0 w-[5px] rounded-l-2xl"`
- **Line:** 84

---

## 🎨 DESIGN SYSTEM SUMMARY

### Font Families Used
1. **Poppins:Bold** → Font-Weight: **700**
2. **Poppins:SemiBold** → Font-Weight: **600**
3. **Poppins:Medium** → Font-Weight: **500**
4. **Poppins:Regular** → Font-Weight: **400**
5. **font-bold** (Tailwind) → Font-Weight: **700**

---

### Font Size Hierarchy

#### Extra Large (Headings & Emphasis)
- **22px** - Grade numbers (CompletedExamCard)

#### Large (Main Headings)
- **18px** - "Your ToDo's" section header
- **16px** - "AI Tools" section header
- **15px** - Todo card titles

#### Medium (Sub-Headings & Important Text)
- **14px** - Exam topic names, promo banner main text
- **13px** - Sub-section headers, AI tool card titles, empty state text
- **12px** - Flashcard titles, grade text, score %, todo action buttons, promo button, document titles

#### Small (Body Text & Labels)
- **11px** - Subject badges, subtopics text, stats, tutor names, "View All" buttons, subject pills, time displays
- **10px** - Card counts, date labels, grade labels, stats details, document meta, duration displays, grade stats
- **9px** - Date labels (FlashcardItem), grade label ("Note"), document subject/date

---

### Common Padding & Spacing Values

#### Card Padding
- **p-4** (16px all sides) - FlashcardItem, AI tool cards, tutor cards, promo banner
- **p-3** (12px all sides) - CompletedExamCard, extra-session cards, document cards
- **px-4 py-1.5** - Todo action buttons
- **px-5 py-2** - Promo banner button
- **px-6 py-3** - Standard button size (if used elsewhere)

#### Container Heights
- **h-[120px]** - AI tool cards
- **h-[100px]** - FlashcardItem cards
- **h-[85px]** - TodoCard
- **h-[38px]** - Filter icon button
- **h-7 (28px)** - Subject badge, progress badge in FlashcardItem

#### Icon Sizes
- **44px × 44px** - AI tool card icons
- **42px × 42px** - Todo card icon container
- **32px × 32px** - Small tutor avatars (extra-sessions)
- **70px × 70px** - Large tutor avatars
- **24px × 24px** - Subject icons in FlashcardItem
- **20px × 20px** - Standard lucide icons
- **14px × 14px** - Small icons (sparkles, checkmarks)
- **12px × 12px** - Tiny icons (trophy, clock, chevron)
- **11px × 11px** - Very small icons (clock in main display)

#### Border Radius
- **rounded-2xl (16px)** - Large cards (FlashcardItem, TodoCard, AI tools, sections)
- **rounded-xl (12px)** - Medium cards (CompletedExamCard)
- **rounded-[12px]** - Todo icon container
- **rounded-[10px]** - Filter button, document icon, promo button, action buttons
- **rounded-full** - Subject badges, progress badges, golden badges, profile images
- **rounded-[2px] / rounded-sm** - Flag icons

---

### Color Opacity Patterns

#### Text Opacity Levels
- **100%** (`text-white`) - Primary text, headers, important content
- **95%** (`text-white/95`) - Flashcard titles (slightly dimmed)
- **60%** (`text-white/60`) - Time displays
- **50%** (`text-white/50`) - Todo descriptions, document teacher names
- **40%** (`text-white/40`) - Empty state text, duration displays
- **30%** (`text-white/30`) - Date labels, document meta
- **25%** (`text-white/25`) - Card counts (very subtle)

#### Background Opacity Levels
- **from-white/[0.05]** - Card gradient start
- **to-white/[0.02]** - Card gradient end
- **white/[0.08]** - Border default
- **white/[0.15]** - Border hover
- **white/[0.06]** - Subtle backgrounds
- **white/[0.03]** - Very subtle backgrounds

#### Subject Colors
- **#618cff** - Mathematik / Mathe (Blue)
- **#ff6b9d** - Deutsch (Pink)
- **#4a9eff** - Englisch (Light Blue)
- **#00d084** - Biologie (Green)
- **#ffa94d** - Geschichte (Orange)
- **#a78bfa** - Chemie (Purple)
- **#3b82f6** - Französisch (Blue)

#### Accent Colors
- **#009379** - Primary Green (success, join buttons, selection)
- **#00b894** - Light Green (gradient end)
- **#6366f1** - Purple (start buttons)
- **#8b5cf6** - Light Purple (gradient end)
- **#4cadfd** - Blue (hover states, links)
- **#FFD700** - Gold (badges, highlights)

#### Grade Colors (Dynamic)
- **#009379** - Excellent (90%+) / Sehr gut (≤2.0)
- **#4cadfd** - Good (70-89%) / Befriedigend (2.1-3.0)
- **#ffa500** - Average (50-69%) / Ausreichend (3.1-4.0)
- **#ff4444** - Poor (<50%) / Mangelhaft (4.1+)

---

### Typography Best Practices

#### Line Height Rules
- **leading-none** - For large display numbers (grades, scores)
- **leading-tight** - For compact multi-line text (names, descriptions, dates)
- **leading-[16px]** - For AI tool card labels (2 lines centered)
- **leading-[19px]** - For exam topic names
- **leading-[15px]** - For subtopics text
- **leading-[1.25]** - For flashcard titles

#### Text Truncation
- **truncate** - Single line ellipsis
- **line-clamp-2** - Two line ellipsis (flashcard titles)

#### Font Variant
- **tabular-nums** - For progress percentages (monospace numbers for alignment)

#### Text Shadows
- **drop-shadow-lg** - For progress percentage text (better visibility on colored backgrounds)
- **text-shadow: '0 0 8px rgba(255, 215, 0, 0.5)'** - For golden badge text (glow effect)

---

## 📐 COMPONENT PATTERNS

### Card Pattern (Glassmorphism)
```tsx
className="
  group relative overflow-hidden 
  bg-gradient-to-br from-white/[0.05] to-white/[0.02] 
  backdrop-blur-xl border border-white/[0.08] 
  hover:border-white/[0.15] 
  rounded-2xl p-4 
  transition-all duration-300 
  cursor-pointer active:scale-[0.98]
"
style={{
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
  WebkitTapHighlightColor: 'transparent',
  willChange: 'transform',
  transform: 'translateZ(0)',
  isolation: 'isolate',
  zIndex: 1
}}
```

### Hover Glow Pattern
```tsx
<div 
  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-15 pointer-events-none"
  style={{
    background: `radial-gradient(circle at 50% 50%, ${color}30, transparent 75%)`,
    transitionProperty: 'opacity',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease-out'
  }}
/>
```

### Button Pattern (Primary)
```tsx
className="
  px-4 py-1.5 rounded-[10px] 
  bg-gradient-to-r from-[#009379] to-[#00b894] 
  shadow-[0px_4px_16px_rgba(0,147,121,0.35)]
  transition-all active:scale-95
"
<span className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white leading-none">
  Button Text
</span>
```

### Badge Pattern (Subject)
```tsx
<div 
  className="
    relative w-[100px] h-7 px-3 
    rounded-full flex items-center justify-center 
    backdrop-blur-xl border overflow-hidden
  "
  style={{ 
    backgroundColor: `${subjectColor}25`,
    borderColor: `${subjectColor}40`,
    boxShadow: `0 4px 16px ${subjectColor}20`
  }}
>
  <span className="relative z-10 font-['Poppins:Medium',sans-serif] text-white text-[11px] truncate">
    {subject}
  </span>
</div>
```

---

## ⚠️ CRITICAL RULES

### DO's:
1. ✅ **Always use exact Poppins variants** (`Poppins:Bold`, `Poppins:SemiBold`, etc.) - NEVER use generic `font-bold` or `font-semibold` without the Poppins family!
2. ✅ **Use exact pixel values** (e.g., `text-[18px]`) - NEVER use Tailwind defaults like `text-lg` or `text-xl`
3. ✅ **Maintain consistent icon sizes** within the same component type
4. ✅ **Use glassmorphism pattern** for all cards: `bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/[0.08]`
5. ✅ **Always include hover effects** with instant-off transitions (`duration: '0.15s'` or `duration: '0.2s'`)
6. ✅ **Use `active:scale-[0.98]`** for all interactive cards
7. ✅ **Apply proper text truncation** (`truncate` for single line, `line-clamp-2` for multi-line)

### DON'Ts:
1. ❌ **NEVER use default Tailwind font sizes** (`text-sm`, `text-base`, `text-lg`, etc.) - Always use exact pixel values!
2. ❌ **NEVER use generic font-weight classes** without Poppins family specification
3. ❌ **NEVER skip the hover glow effect** on cards
4. ❌ **NEVER use solid backgrounds** - Always use gradients with transparency
5. ❌ **NEVER forget WebkitTapHighlightColor: 'transparent'** on interactive elements
6. ❌ **NEVER use different border-radius values** within the same component type

---

## 🔍 USAGE NOTES

### When to use each font weight:
- **Poppins:Bold (700)** → Main section headers, emphasis text, large display numbers
- **Poppins:SemiBold (600)** → Card titles, sub-section headers, button text, important labels
- **Poppins:Medium (500)** → Subject badges, stats, metadata, secondary labels
- **Poppins:Regular (400)** → Body text, descriptions, timestamps, card counts

### Spacing Hierarchy:
- **mb-6** → Between major sections
- **mb-5** → Within major sections (rare)
- **mb-4** → Between section header and content
- **mb-3** → Between sub-section header and content
- **mb-2** → Within card content (between elements)
- **mb-1** → Tight spacing (between label and value)
- **mb-0.5 / mt-0.5** → Very tight spacing

### Opacity Guidance:
- Use **100%** for primary content
- Use **60-95%** for secondary but still important content
- Use **40-50%** for tertiary / helper text
- Use **25-30%** for very subtle labels (card counts, background info)

---

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

### Future Additions Needed:
- [ ] MyFlashcardsScreenMobile.tsx
- [ ] CompletedExamsScreenMobile.tsx
- [ ] ProfilScreenMobile.tsx
- [ ] ChatScreenMobile.tsx
- [ ] KIToolsScreen.tsx
- [ ] LoginScreen.tsx / RegisterScreen.tsx
- [ ] Desktop variants (if different from mobile)
- [ ] Modal components (CreateOwnSetModal, SubtopicsModal, etc.)
- [ ] Form components (if any)

---

**END OF DOCUMENTATION**

*This document is a living reference. Update it whenever typography changes are made to maintain accuracy.*
