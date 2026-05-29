# 🎯 FINAL VS Code Claude Instructions - Typography Restoration

**CRITICAL:** This project has incorrect typography (fonts too thin, sizes too small). Your task is to restore the ORIGINAL typography values documented in `/ORIGINAL_TYPOGRAPHY_VALUES.md`.

---

## 📋 YOUR MISSION

Restore **ONLY** the following in the CURRENT project:
1. ✅ Font-Weights (too thin → correct bold/semibold)
2. ✅ Font-Sizes (too small → correct px values)
3. ✅ Button Paddings (too small → correct sizes)
4. ✅ Container Heights (if changed)

**DO NOT CHANGE:**
- ❌ Code architecture
- ❌ Component structure
- ❌ Logic/Functions
- ❌ Colors (unless part of typography)
- ❌ Layouts/Grids
- ❌ Borders/Shadows (unless part of button sizing)

---

## 🔍 HOW TO USE `/ORIGINAL_TYPOGRAPHY_VALUES.md`

The document contains **EXACT VALUES** from the original project. For each file you edit:

1. **Find the file** in the documentation (e.g., "HomeScreenMobile.tsx")
2. **Read the typography values** for each element
3. **Compare with current code**
4. **Replace ONLY typography-related className parts**

---

## 📱 PRIORITY ORDER - Work through these systematically:

### PHASE 1: Main Screens
1. `/src/app/screens/HomeScreenMobile.tsx`
2. `/src/app/screens/FlashcardsScreen.tsx`
3. `/src/app/screens/ExamScreen.tsx`
4. `/src/app/screens/CompletedExamsScreen.tsx`
5. `/src/app/screens/GenerateFlashcardsScreen.tsx`
6. `/src/app/screens/ProfileScreen.tsx`

### PHASE 2: Components
7. `/src/app/components/FlashcardItem.tsx`
8. `/src/app/components/CompletedExamCard.tsx`
9. `/src/app/components/TodoCard.tsx`

### PHASE 3: Other Screens
10. `/src/app/screens/ChatScreen.tsx`
11. `/src/app/screens/SettingsScreen.tsx`
12. `/src/app/screens/LoginScreen.tsx`
13. `/src/app/screens/RegisterScreen.tsx`

---

## 🎯 CRITICAL FIXES - Common Mistakes to Fix

### Issue 1: Font-Weights Too Thin

**WRONG (Current - too thin):**
```tsx
className="font-medium text-[16px]"          // ❌ Weight: 500 (too thin)
className="font-normal text-[14px]"          // ❌ Weight: 400 (too thin)
className="font-['Poppins:Regular',sans-serif]"  // ❌ Weight: 400
className="font-['Poppins:Medium',sans-serif]"   // ❌ Weight: 500
```

**CORRECT (Original - bold/semibold):**
```tsx
className="font-['Poppins:Bold',sans-serif] text-[18px]"      // ✅ Weight: 700
className="font-['Poppins:SemiBold',sans-serif] text-[14px]" // ✅ Weight: 600
```

**Rule:** 
- **All main headings/section titles** → `Poppins:Bold` (700)
- **All card titles/sub-headings** → `Poppins:SemiBold` (600)
- **All buttons** → `Poppins:SemiBold` (600)

---

### Issue 2: Font-Sizes Too Small

**WRONG (Current):**
```tsx
text-[15px]  // ❌ Section header
text-[14px]  // ❌ Main heading
text-[12px]  // ❌ AI Tool title
```

**CORRECT (Original):**
```tsx
text-[18px]  // ✅ "Your ToDo's" section header
text-[16px]  // ✅ "AI Tools" section header
text-[13px]  // ✅ AI Tool card title
```

---

### Issue 3: Buttons Too Small

**WRONG (Current):**
```tsx
className="px-4 py-2 font-medium text-[15px]"  // ❌ Too small, wrong weight
```

**CORRECT (Original):**
```tsx
className="px-6 py-3 font-['Poppins:SemiBold',sans-serif] text-[16px]"  // ✅
// OR for smaller buttons:
className="px-4 py-1.5 font-['Poppins:SemiBold',sans-serif] text-[12px]"  // ✅
```

---

## 📐 EXACT FIXES BY FILE

### HomeScreenMobile.tsx

#### Fix 1: "Your ToDo's" Section Header
**Find:** Line ~102 (or search for "Your ToDo's")
**Current (WRONG):**
```tsx
className="font-medium text-[16px] text-white"
// OR:
className="font-['Poppins:Medium',sans-serif] text-[16px] text-white"
```
**Change to (CORRECT):**
```tsx
className="font-['Poppins:Bold',sans-serif] text-[18px] text-white"
```

---

#### Fix 2: "AI Tools" Section Header
**Find:** Line ~159 (or search for "AI Tools")
**Current (WRONG):**
```tsx
className="font-medium text-[14px] text-white"
```
**Change to (CORRECT):**
```tsx
className="font-['Poppins:Bold',sans-serif] text-[16px] text-white"
```

---

#### Fix 3: Sub-Section Headers ("Recently used Flashcards", "Completed Exams", etc.)
**Find:** Lines ~234, 274, 326, 377, 444
**Current (WRONG):**
```tsx
className="font-medium text-[12px] text-white"
```
**Change to (CORRECT):**
```tsx
className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white"
```

---

#### Fix 4: "View All" Buttons
**Find:** Lines ~238, 278, 330, 381, 448
**Current (WRONG):**
```tsx
className="font-medium text-[10px] text-white"
// OR:
className="font-semibold text-[10px] text-white"
```
**Change to (CORRECT):**
```tsx
className="font-['Poppins:Bold',sans-serif] text-[11px] text-white"
```

---

#### Fix 5: AI Tool Card Titles
**Find:** Lines ~191, 223 (Generate Flashcards, Exam Simulation)
**Current (WRONG):**
```tsx
className="font-medium text-[12px] text-white text-center"
```
**Change to (CORRECT):**
```tsx
className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white text-center leading-[16px]"
```

---

### FlashcardItem.tsx

#### Fix 1: Flashcard Title
**Find:** Line ~240
**Current (WRONG):**
```tsx
className="font-medium text-[11px] text-white/95"
// OR:
className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/95"
```
**Change to (CORRECT):**
```tsx
className="flex-1 font-['Poppins:SemiBold',sans-serif] text-white/95 text-[12px] leading-[1.25] line-clamp-2 pr-16"
```

---

#### Fix 2: Subject Badge Text
**Find:** Line ~278
**Current (WRONG):**
```tsx
className="font-normal text-[10px] text-white"
```
**Change to (CORRECT):**
```tsx
className="relative z-10 font-['Poppins:Medium',sans-serif] text-white text-[11px] truncate"
```

---

#### Fix 3: Subject Badge Container
**Find:** Line ~264
**IMPORTANT:** Ensure width is FIXED at 100px:
```tsx
className="relative w-[100px] h-7 px-3 rounded-full ..."
```

---

#### Fix 4: Progress Percentage
**Find:** Line ~310
**Current (WRONG):**
```tsx
className="font-semibold text-[11px] text-white"
```
**Change to (CORRECT):**
```tsx
className="font-['Poppins:SemiBold',sans-serif] text-white text-[12px] tabular-nums drop-shadow-lg"
```

---

### CompletedExamCard.tsx

#### Fix 1: Exam Topic Name
**Find:** Line ~157
**Current (WRONG):**
```tsx
className="font-medium text-[13px] text-white"
// OR:
className="font-['Poppins:Medium',sans-serif] text-[13px] text-white"
```
**Change to (CORRECT):**
```tsx
className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white leading-[19px] truncate"
```

---

#### Fix 2: Grade Display (MOST IMPORTANT!)
**Find:** Line ~196
**Current (WRONG):**
```tsx
className="text-[20px] font-bold"
// OR:
className="text-[18px] font-['Poppins:Bold',sans-serif]"
```
**Change to (CORRECT):**
```tsx
className="text-[22px] font-['Poppins:Bold',sans-serif] leading-none mb-0.5"
```
**Note:** This is the MAIN grade number (e.g., "1.3") - must be **22px** and **Bold**!

---

#### Fix 3: Grade Text ("Sehr gut")
**Find:** Line ~207
**Current (WRONG):**
```tsx
className="text-[11px] font-semibold"
```
**Change to (CORRECT):**
```tsx
className="text-[12px] font-['Poppins:SemiBold',sans-serif]"
```

---

#### Fix 4: Subject & Subtopics
**Find:** Line ~178
**Current (WRONG):**
```tsx
className="font-normal text-[10px] text-[#979797]"
```
**Change to (CORRECT):**
```tsx
className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797] group-hover/subtopics:text-[#4cadfd] leading-[15px]"
```

---

### TodoCard.tsx

#### Fix 1: Todo Title
**Find:** Line ~104
**Current (WRONG):**
```tsx
className="font-medium text-[14px] text-white"
```
**Change to (CORRECT):**
```tsx
className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white leading-tight truncate"
```

---

#### Fix 2: Todo Description
**Find:** Line ~109
**Current (WRONG):**
```tsx
className="font-normal text-[11px] text-white/50"
```
**Change to (CORRECT):**
```tsx
className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-tight truncate"
```

---

#### Fix 3: Action Button Text
**Find:** Line ~147
**Current (WRONG):**
```tsx
className="font-medium text-[11px] text-white"
```
**Change to (CORRECT):**
```tsx
className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white leading-none"
```

---

#### Fix 4: TodoCard Container Height
**Find:** Line ~61
**IMPORTANT:** Ensure height is **85px**:
```tsx
className="... h-[85px] rounded-2xl ..."
```

---

## 🎨 TYPOGRAPHY REFERENCE GUIDE

Use this as a **quick reference** when fixing files:

### Font-Weight Mapping
```tsx
// ❌ WRONG (Too Thin):
font-normal              → 400
font-medium              → 500
font-['Poppins:Regular',sans-serif]  → 400
font-['Poppins:Medium',sans-serif]   → 500

// ✅ CORRECT (Bold/SemiBold):
font-['Poppins:Bold',sans-serif]     → 700  // Main headings, section titles
font-['Poppins:SemiBold',sans-serif] → 600  // Card titles, buttons, sub-headings
font-['Poppins:Medium',sans-serif]   → 500  // Labels, badges (OK for small text)
font-['Poppins:Regular',sans-serif]  → 400  // Body text, descriptions (OK)
```

### Font-Size Hierarchy (from ORIGINAL_TYPOGRAPHY_VALUES.md)
```tsx
// Main Section Headers:
text-[18px]  → "Your ToDo's"
text-[16px]  → "AI Tools"

// Sub-Section Headers:
text-[13px]  → "Recently used Flashcards", "Completed Exams"

// Card Titles:
text-[15px]  → TodoCard title
text-[14px]  → CompletedExamCard topic
text-[12px]  → FlashcardItem title

// Large Display:
text-[22px]  → Grade number (CompletedExamCard)

// Buttons:
text-[16px]  → Primary large buttons
text-[12px]  → Small action buttons
text-[11px]  → "View All" buttons

// Labels & Meta:
text-[11px]  → Subject badges, subtopics
text-[10px]  → Card counts, dates, stats
text-[9px]   → Very small meta info
```

### Button Padding Reference
```tsx
// Primary Large Buttons:
px-6 py-3  → Standard primary button (height ~44px)

// Small Action Buttons:
px-4 py-1.5  → TodoCard action buttons ("Join", "Start")

// Promo/Special Buttons:
px-5 py-2  → Promotional banner buttons
```

### Container Heights
```tsx
h-[120px]  → AI Tool cards
h-[100px]  → FlashcardItem cards
h-[85px]   → TodoCard
h-[38px]   → Filter icon button
h-7        → Subject/Progress badges (28px)
```

---

## 🔄 WORKFLOW - Step by Step

### Step 1: Read the file
```bash
# Open the file in VS Code
# Read through the current code
```

### Step 2: Search for typography issues
Look for:
- `font-medium` or `font-normal` on **headings/buttons**
- Small `text-[Xpx]` values that seem wrong
- Missing `Poppins:Bold` or `Poppins:SemiBold`

### Step 3: Cross-reference with `/ORIGINAL_TYPOGRAPHY_VALUES.md`
- Find the component/file in the documentation
- Locate the specific element (e.g., "Section Header: Your ToDo's")
- Copy the **EXACT className string** from the documentation

### Step 4: Replace ONLY typography parts
**Example:**
```tsx
// Current (WRONG):
className="flex items-center justify-between mb-4 font-medium text-[16px] text-white"

// Fix (CORRECT):
className="flex items-center justify-between mb-4 font-['Poppins:Bold',sans-serif] text-[18px] text-white"
//                                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^
//                                                  Changed font-weight           Changed size
```

**IMPORTANT:** Keep spacing/layout classes like `flex`, `items-center`, `mb-4` unchanged!

### Step 5: Test & Validate
- Save the file
- Check that ONLY typography changed
- No layout/logic/color changes!

---

## ⚠️ CRITICAL RULES

### ✅ DO:
1. Change font-weights from thin (400/500) to bold/semibold (600/700) on headings/buttons
2. Change font-sizes to match exact px values from documentation
3. Change button paddings if too small
4. Keep the EXACT same component structure
5. Preserve all layout classes (flex, grid, gap, margin, etc.)
6. Use the EXACT className strings from `/ORIGINAL_TYPOGRAPHY_VALUES.md`

### ❌ DON'T:
1. Change any logic/functions
2. Modify component structure (no new divs, no removing elements)
3. Change colors (unless explicitly part of typography fix)
4. Change borders/shadows (unless part of button sizing)
5. Add new features or components
6. Refactor code
7. Change imports
8. Modify spacing/layout (except button padding when documented)

---

## 📊 VALIDATION CHECKLIST

After fixing each file, check:

- [ ] All **main headings** use `Poppins:Bold` (700)
- [ ] All **card titles** use `Poppins:SemiBold` (600)
- [ ] All **buttons** use `Poppins:SemiBold` (600)
- [ ] Font-sizes match `/ORIGINAL_TYPOGRAPHY_VALUES.md` exactly
- [ ] No layout/spacing changed (except documented button padding)
- [ ] No logic/functions modified
- [ ] No new components added
- [ ] File still works exactly the same functionally

---

## 🎯 SUCCESS CRITERIA

When you're done:
1. ✅ Text looks **bolder** and more **prominent**
2. ✅ Headings are **larger** and easier to read
3. ✅ Buttons feel more **substantial**
4. ✅ App looks **exactly like the original** visually
5. ✅ **ZERO functional changes** - everything still works the same

---

## 📝 EXAMPLE: Complete Fix for HomeScreenMobile.tsx

**Before (WRONG):**
```tsx
<div className="flex items-center justify-between mb-4">
  <p className="font-medium text-[16px] text-white">
    Your ToDo's
  </p>
</div>

<div className="flex items-center justify-between mb-3">
  <p className="font-medium text-[14px] text-white">
    AI Tools
  </p>
</div>

<div className="flex items-center justify-between mb-3">
  <p className="font-medium text-[12px] text-white">
    Recently used Flashcards
  </p>
  <button>
    <p className="font-semibold text-[10px] text-white">
      View All
    </p>
  </button>
</div>
```

**After (CORRECT):**
```tsx
<div className="flex items-center justify-between mb-4">
  <p className="font-['Poppins:Bold',sans-serif] text-[18px] text-white">
    Your ToDo's
  </p>
</div>

<div className="flex items-center justify-between mb-3">
  <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">
    AI Tools
  </p>
</div>

<div className="flex items-center justify-between mb-3">
  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">
    Recently used Flashcards
  </p>
  <button>
    <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
      View All
    </p>
  </button>
</div>
```

**What changed:**
- ✅ "Your ToDo's": `font-medium text-[16px]` → `font-['Poppins:Bold',sans-serif] text-[18px]`
- ✅ "AI Tools": `font-medium text-[14px]` → `font-['Poppins:Bold',sans-serif] text-[16px]`
- ✅ Sub-headers: `font-medium text-[12px]` → `font-['Poppins:SemiBold',sans-serif] text-[13px]`
- ✅ "View All": `font-semibold text-[10px]` → `font-['Poppins:Bold',sans-serif] text-[11px]`

**What stayed the same:**
- ✅ Layout classes: `flex`, `items-center`, `justify-between`, `mb-4`, etc.
- ✅ Structure: Same divs, same nesting
- ✅ Functionality: Same behavior

---

## 🚀 START HERE

1. **Open** `/ORIGINAL_TYPOGRAPHY_VALUES.md` for reference
2. **Start with** `/src/app/screens/HomeScreenMobile.tsx`
3. **Work systematically** through the Priority Order
4. **Use the exact fixes** documented above
5. **Validate** each file before moving to the next

**Good luck! The restoration should make the app look much better with bolder, more prominent text!** 🎨

---

**Made with precision by SoStudy Team**  
*Restoring Apple Vision Pro Style 2026 Typography*
