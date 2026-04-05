# Typography Audit - Complete Codebase Analysis

## 🎯 Your Mission

Analyze ALL screens and components in this codebase and create a **complete typography documentation** that will be used to convert a new version of this app to match the EXACT typography settings of this original app.

---

## ⚠️ CRITICAL RULES

### ✅ DOCUMENT (Typography):
- **Font-Family** (e.g., `font-['Poppins:Bold',sans-serif]`, `font-sans`, etc.)
- **Font-Size** (e.g., `text-[18px]`, `text-lg`, etc.)
- **Font-Weight** (e.g., `font-bold`, `Poppins:SemiBold`, numerically: 700, 600, 500, 400)
- **Line-Height** (if explicitly defined, e.g., `leading-[24px]`)
- **Letter-Spacing** (if explicitly defined, e.g., `tracking-tight`)
- **Text-Transform** (if used, e.g., `uppercase`, `capitalize`)

### ✅ DOCUMENT (Button/Input Context):
- **Button Padding** (e.g., `px-6 py-3` → horizontal: 24px, vertical: 12px)
- **Button Height** (if explicitly defined, e.g., `h-[44px]` → 44px)
- **Button Border Radius** (affects visual weight, e.g., `rounded-xl`, `rounded-lg`)
- **Input Padding** (for form fields)

> **Why?** Padding and height affect how bold/prominent text appears visually.

### ❌ IGNORE (Do NOT document):
- Colors (text-white, text-gray-500, etc.) - SKIP
- Backgrounds (bg-*, etc.) - SKIP
- Borders on non-interactive elements - SKIP
- Shadows (shadow-*, etc.) - SKIP
- Spacing on non-button/input elements (margin, gap, etc.) - SKIP
- Layout (flex, grid, etc.) - SKIP
- Positioning (absolute, relative, etc.) - SKIP
- Opacity, transitions, animations - SKIP

**Focus ONLY on typography (plus button/input dimensions for context)!**

---

## 📂 Project Structure

This project contains **TWO APPS**:

### 1. Main Learning App (`/src/app/`)
- Screens in `/src/app/screens/`
- Components in `/src/app/components/`
- Modals in `/src/app/components/modals/`

### 2. ExamApp (Separate App Inside: `/src/examapp/`)
- Screens in `/src/examapp/app/components/screens/` (or `/src/examapp/app/screens/`)
- Components in `/src/examapp/app/components/`
- This is a COMPLETE standalone exam simulation app

---

## 📋 Files to Document

### PRIORITY 1: Main App Screens

Analyze ALL screens in `/src/app/screens/`:

1. **HomeScreen.tsx** (or HomeScreenMobile.tsx, HomeScreenDesktop.tsx)
2. **FlashcardsScreen.tsx** (or MyFlashcardsScreenMobile.tsx)
3. **ExamScreen.tsx** (main exam launcher screen, not the ExamApp)
4. **CompletedExamsScreen.tsx** (or CompletedExamsScreenMobile.tsx)
5. **GenerateFlashcardsScreen.tsx** (flashcard generator AI tool)
6. **ProfileScreen.tsx** (or ProfilScreenMobile.tsx)
7. **ChatScreen.tsx** (or ChatScreenMobile.tsx)
8. **KIToolsScreen.tsx** (AI Tools overview)
9. **SettingsScreen.tsx** (if exists)
10. **LoginScreen.tsx**
11. **RegisterScreen.tsx**

**For each screen, document ALL typography elements:**
- Screen Title / Page Header / Navigation Title
- Section Headers (h1, h2, h3, h4) - e.g., "Your ToDo's", "AI Tools", "Recently used Flashcards"
- Sub-Section Headers
- Button Text (Primary, Secondary, Small buttons, Icon buttons)
- Card Titles
- Card Subtitles / Descriptions
- Labels & Metadata (e.g., "3 cards", "2 days ago", timestamps)
- Body Text / Paragraphs
- Input Labels & Placeholders
- Error Messages
- Success Messages
- Special Elements (Grade displays, Scores, Percentages, Badges)
- Any other text elements

---

### PRIORITY 2: Main App Components

Analyze ALL components in `/src/app/components/`:

1. **FlashcardCard.tsx** (or FlashcardItem.tsx)
2. **ExamCard.tsx** (or CompletedExamCard.tsx)
3. **TodoCard.tsx**
4. **BottomNavigation.tsx** (if exists)
5. **TopNavigation.tsx** (if exists)
6. **AIToolCard.tsx** (if exists)
7. **Any other card/list item components**

**For components, document:**
- Card Title
- Card Subtitle / Description
- Metadata / Labels (counts, dates, etc.)
- Button text within cards
- Special elements (scores, badges, etc.)

---

### PRIORITY 3: Modal Components

Analyze ALL modals in `/src/app/components/modals/`:

1. **CreateOwnSetModal.tsx** (if exists)
2. **SubtopicsModal.tsx** (if exists)
3. **EditFlashcardModal.tsx** (if exists)
4. **DeleteConfirmationModal.tsx** (if exists)
5. **SettingsModal.tsx** (if exists)
6. **FeedbackModal.tsx** (if exists)
7. **Any other modal components**

**For modals, document:**
- Modal Title
- Modal Description/Body Text
- Button Labels (Confirm, Cancel, etc.)
- Form Labels (if applicable)
- Input placeholders
- Error/Success messages

---

### PRIORITY 4: ExamApp Screens ⚠️ CRITICAL!

**This is a separate app within `/src/examapp/`!**

Analyze ALL screens in `/src/examapp/app/components/screens/` OR `/src/examapp/app/screens/`:

1. **SubjectSelectionScreen.tsx** (select subject for exam)
2. **CategorySelectionScreen.tsx** (select category)
3. **TopicSelectionScreen.tsx** (select topic)
4. **SubtopicSelectionScreen.tsx** (select subtopic)
5. **ExamConfigurationScreen.tsx** (configure exam settings: time, questions, etc.)
6. **StartScreen.tsx** (countdown before exam starts)
7. **QuestionScreen.tsx** (the actual exam question display)
8. **ResultsScreen.tsx** (or ResultsScreenWrapper.tsx - exam results)
9. **ExamFeedbackScreen.tsx** (or ExamFeedbackScreenWrapper.tsx - feedback form)

**Find the actual file names by exploring the `/src/examapp/` directory structure!**

**For ExamApp screens, pay SPECIAL attention to:**
- Navigation titles
- Selection cards/buttons (subject cards, category cards, etc.)
- Question number display (e.g., "Question 3/10")
- Question text (the actual exam question)
- Answer options (A, B, C, D - or text answers)
- Timer display (e.g., "08:45" remaining)
- Score display (e.g., "8/10 correct", "80%")
- Grade display (e.g., "1.3", "2.0")
- Feedback text
- Configuration labels (dropdowns, toggles, sliders)
- Button text ("Next", "Submit", "Review", etc.)

---

### PRIORITY 5: ExamApp Components

Analyze components in `/src/examapp/app/components/`:

1. **SubjectCard.tsx** (if separate component)
2. **QuestionCard.tsx** (if separate component)
3. **AnswerOption.tsx** (if separate component)
4. **Timer.tsx** (if separate component)
5. **ProgressBar.tsx** (if separate component)
6. **Any other ExamApp-specific components**

---

### PRIORITY 6: FlashcardGen App (if exists)

If there's a `/src/flashcardgen/` directory, document it similarly to ExamApp.

---

### PRIORITY 7: Desktop Variants (Optional)

If desktop variants exist (e.g., `HomeScreenDesktop.tsx`), document ONLY if typography differs from mobile.

---

## 📐 Output Format - EXACT STRUCTURE

Use this EXACT format for your final documentation:

```markdown
# ORIGINAL TYPOGRAPHY VALUES - Complete Audit

> **Purpose:** Complete typography documentation for converting new app to match original design
> **Date:** February 15, 2026
> **Analyzed By:** Claude Opus 4.6
> **Project:** Learning App (Main App + ExamApp)

---

## 🎨 DESIGN SYSTEM SUMMARY

### Font Families Used
- Primary: Poppins (Bold, SemiBold, Medium, Regular)
- System Fallback: sans-serif
- [List any other font families found]

### Font Weights Map
- **700** = Bold (Poppins:Bold, font-bold)
- **600** = SemiBold (Poppins:SemiBold, font-semibold)
- **500** = Medium (Poppins:Medium, font-medium)
- **400** = Regular (Poppins:Regular, font-normal, default)
- **300** = Light (Poppins:Light, font-light) - if used

### Common Font Sizes Found
**Large (Headings):**
- 24px, 22px, 20px, 18px

**Medium (Subheadings, Buttons):**
- 17px, 16px, 15px

**Small (Body, Labels):**
- 14px, 13px, 12px

**Tiny (Metadata, Timestamps):**
- 11px, 10px

### Button Patterns
**Primary Buttons:**
- Font-Size: 16px
- Font-Weight: 600 (SemiBold)
- Padding: px-6 py-3 (24px/12px)
- Height: h-[44px]
- Border-Radius: rounded-xl

**Secondary Buttons:**
- [Document if different]

**Small Buttons:**
- [Document if different]

---

## 📱 MAIN APP - SCREENS

### HomeScreen.tsx

#### Screen Title: "Home"
- **Element:** `<h1>` or Navigation Title
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[17px]` → **17px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white"`
- **Line:** 42

#### Section Header: "Your ToDo's"
- **Element:** `<h2>` or `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[20px]` → **20px**
- **Font-Weight:** **700** (Bold)
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[20px] text-white mb-4"`
- **Line:** 78

#### Section Header: "AI Tools"
- **Element:** `<h2>` or `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[18px]` → **18px**
- **Font-Weight:** **700** (Bold)
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[18px] text-white mb-3"`
- **Line:** 95

#### Section Header: "Recently used Flashcards"
- **Element:** `<h2>` or `<p>` tag
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[18px]` → **18px**
- **Font-Weight:** **700** (Bold)
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[18px] text-white mb-3"`
- **Line:** 145

#### Primary Button: "Start now"
- **Element:** `<button>`
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[16px]` → **16px**
- **Font-Weight:** **600** (SemiBold)
- **Padding:** `px-6 py-3` → horizontal: 24px, vertical: 12px
- **Height:** `h-[44px]` → **44px**
- **Border-Radius:** `rounded-xl`
- **Code:** `className="px-6 py-3 h-[44px] font-['Poppins:SemiBold',sans-serif] text-[16px] text-white bg-[#5b5fef] rounded-xl"`
- **Line:** 112

#### Secondary Button: "Aufgabe hinzufügen"
- **Element:** `<button>`
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[15px]` → **15px**
- **Font-Weight:** **600** (SemiBold)
- **Padding:** `px-4 py-2` → horizontal: 16px, vertical: 8px
- **Code:** `className="px-4 py-2 font-['Poppins:SemiBold',sans-serif] text-[15px] ..."`
- **Line:** 128

#### Card Title (in TodoCard or similar)
- **Element:** `<h3>` or card title text
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[16px]` → **16px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[16px]"`
- **Line:** 156

#### Card Description/Body Text
- **Element:** `<p>` tag
- **Font-Size:** `text-[14px]` → **14px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="text-[14px] text-gray-400"`
- **Line:** 162

#### Small Metadata Text (e.g., "3 cards", "2 days ago")
- **Element:** `<span>` or small text
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="text-[13px] text-gray-500"`
- **Line:** 178

[Continue documenting ALL other text elements in HomeScreen.tsx]

---

### FlashcardsScreen.tsx

#### Screen Title: "Flashcards"
- **Element:** Navigation Title
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[17px]` → **17px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[17px]"`
- **Line:** 38

[Continue for all elements...]

---

### CompletedExamsScreen.tsx

[Same detailed structure]

---

### GenerateFlashcardsScreen.tsx

[Same detailed structure - pay attention to AI-related labels]

---

### ProfileScreen.tsx

[Same detailed structure]

---

### ChatScreen.tsx

[Same detailed structure - document message typography]

---

### KIToolsScreen.tsx

[Same detailed structure - document AI tool card typography]

---

### LoginScreen.tsx

#### Screen Title: "Login"
- [Document]

#### Input Label: "Email"
- **Element:** `<label>` or input label
- **Font-Size:** [Document]
- **Font-Weight:** [Document]
- **Code:** [Document]
- **Line:** [Document]

#### Input Placeholder
- [Document]

#### Primary Button: "Sign In"
- [Document full button typography + padding + height]

#### Link Text: "Forgot Password?"
- [Document]

[Continue for all elements...]

---

### RegisterScreen.tsx

[Same detailed structure as LoginScreen]

---

### SettingsScreen.tsx

[If exists, document]

---

## 🎴 MAIN APP - COMPONENTS

### FlashcardCard.tsx (or FlashcardItem.tsx)

#### Card Title
- **Element:** `<h3>` or title element
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[14px]` → **14px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[14px]"`
- **Line:** 25

#### Card Subtitle / Subject
- **Element:** `<p>` or subtitle
- **Font-Size:** `text-[13px]` → **13px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="text-[13px]"`
- **Line:** 32

#### Metadata: "3 cards"
- **Element:** `<span>`
- **Font-Size:** `text-[12px]` → **12px**
- **Font-Weight:** **400** (Regular)
- **Code:** `className="text-[12px]"`
- **Line:** 45

[Continue for all elements...]

---

### ExamCard.tsx (or CompletedExamCard.tsx)

#### Card Title / Subject
- [Document]

#### Grade Display: "1.3"
- **Element:** Large number display
- **Font-Family:** `font-['Poppins:Bold',sans-serif]`
- **Font-Size:** `text-[22px]` → **22px**
- **Font-Weight:** **700** (Bold)
- **Code:** `className="font-['Poppins:Bold',sans-serif] text-[22px]"`
- **Line:** [Document]

#### Score Display: "8/10" or "80%"
- **Element:** Score or percentage
- **Font-Family:** `font-['Poppins:SemiBold',sans-serif]`
- **Font-Size:** `text-[16px]` → **16px**
- **Font-Weight:** **600** (SemiBold)
- **Code:** `className="font-['Poppins:SemiBold',sans-serif] text-[16px]"`
- **Line:** [Document]

[Continue...]

---

### TodoCard.tsx

[Document all typography]

---

### BottomNavigation.tsx

#### Navigation Label (e.g., "Home", "Chat")
- [Document]

[Continue...]

---

## 🎭 MAIN APP - MODALS

### CreateOwnSetModal.tsx

#### Modal Title
- [Document]

#### Input Label: "Set Name"
- [Document]

#### Button: "Create"
- [Document full typography + button dimensions]

[Continue...]

---

### SubtopicsModal.tsx

[Same detailed structure]

---

### [Any other modals]

[Document all]

---

## 🎓 EXAMAPP - SCREENS

> **Note:** ExamApp is a separate application within `/src/examapp/`

### SubjectSelectionScreen.tsx

#### Screen Title / Navigation Title
- **Element:** Navigation bar title
- **Font-Family:** [Document exact value from code]
- **Font-Size:** [Document exact value]
- **Font-Weight:** [Document exact value]
- **Code:** [Full className string]
- **Line:** [Line number]

#### Instruction Text: "Select a subject"
- [Document]

#### Subject Card Title (e.g., "Informatik", "Mathe")
- **Element:** Button or card title
- **Font-Family:** [Document]
- **Font-Size:** [Document]
- **Font-Weight:** [Document]
- **Padding:** [Document if button]
- **Code:** [Document]
- **Line:** [Document]

#### Subject Card Description (if exists)
- [Document]

[Continue for all elements in this screen...]

---

### CategorySelectionScreen.tsx

#### Screen Title
- [Document]

#### Back Button Text
- [Document]

#### Category Card Title
- [Document]

[Continue...]

---

### TopicSelectionScreen.tsx

[Same detailed structure]

---

### SubtopicSelectionScreen.tsx

[Same detailed structure]

---

### ExamConfigurationScreen.tsx

**IMPORTANT:** This screen has many labels and settings

#### Screen Title
- [Document]

#### Section Header: "Exam Settings" (example)
- [Document]

#### Label: "Number of Questions"
- [Document]

#### Label: "Time Limit"
- [Document]

#### Dropdown Text
- [Document]

#### Toggle Label
- [Document]

#### Button: "Generate Exam" or "Start Exam"
- [Document full typography + dimensions]

[Continue for ALL configuration elements...]

---

### StartScreen.tsx

#### Screen Title / Header
- [Document]

#### Countdown Display: "3" (large number)
- **Element:** Countdown number
- **Font-Family:** [Document]
- **Font-Size:** [Likely very large, e.g., text-[48px] or bigger]
- **Font-Weight:** [Document]
- **Code:** [Document]
- **Line:** [Document]

#### Instruction Text: "Get ready!"
- [Document]

#### Button: "Start Now" (if exists)
- [Document]

---

### QuestionScreen.tsx

**VERY IMPORTANT for exam experience!**

#### Question Number: "Question 3/10"
- **Element:** Header or label
- **Font-Family:** [Document]
- **Font-Size:** [Document]
- **Font-Weight:** [Document]
- **Code:** [Document]
- **Line:** [Document]

#### Question Text (the actual exam question)
- **Element:** Main question text
- **Font-Family:** [Document]
- **Font-Size:** [Document - likely larger, e.g., 16-18px]
- **Font-Weight:** [Document]
- **Code:** [Document]
- **Line:** [Document]

#### Answer Option Text (A, B, C, D or text answers)
- **Element:** Button or radio button label
- **Font-Family:** [Document]
- **Font-Size:** [Document]
- **Font-Weight:** [Document]
- **Padding:** [Document if button]
- **Code:** [Document]
- **Line:** [Document]

#### Timer Display: "08:45"
- **Element:** Timer text
- **Font-Family:** [Document]
- **Font-Size:** [Document]
- **Font-Weight:** [Document]
- **Code:** [Document]
- **Line:** [Document]

#### Navigation Button: "Next Question"
- [Document full typography + dimensions]

#### Navigation Button: "Previous Question"
- [Document]

#### Button: "Submit Exam"
- [Document]

[Continue for all elements...]

---

### ResultsScreen.tsx

#### Screen Title: "Exam Results"
- [Document]

#### Score Display (large number): "8/10"
- **Element:** Large score display
- **Font-Family:** [Document - likely Bold]
- **Font-Size:** [Document - likely very large, e.g., 32-48px]
- **Font-Weight:** [Document]
- **Code:** [Document]
- **Line:** [Document]

#### Percentage Display: "80%"
- [Document]

#### Grade Display: "1.7"
- [Document]

#### Summary Label: "Correct Answers"
- [Document]

#### Summary Value: "8"
- [Document]

#### Button: "Review Answers"
- [Document]

#### Button: "Close"
- [Document]

[Continue...]

---

### ExamFeedbackScreen.tsx

#### Screen Title: "How was your exam?"
- [Document]

#### Form Label: "Rate your experience"
- [Document]

#### Input Placeholder: "Any comments?"
- [Document]

#### Button: "Submit Feedback"
- [Document]

#### Button: "Skip"
- [Document]

[Continue...]

---

## 🎯 EXAMAPP - COMPONENTS

### SubjectCard.tsx (if separate component)

[Document if exists]

---

### QuestionCard.tsx (if separate component)

[Document if exists]

---

### AnswerOption.tsx (if separate component)

[Document if exists]

---

### Timer.tsx (if separate component)

[Document if exists]

---

## 🔧 FLASHCARDGEN APP (if exists)

If `/src/flashcardgen/` exists, document similarly to ExamApp.

---

## 📐 COMPONENT PATTERNS

After documenting all files, summarize common patterns:

### Pattern: Screen Titles
Across all screens, screen titles consistently use:
- **Font-Family:** Poppins:SemiBold
- **Font-Size:** 17px
- **Font-Weight:** 600

### Pattern: Main Section Headers (h2)
Example: "Your ToDo's", "AI Tools"
- **Font-Family:** Poppins:Bold
- **Font-Size:** 18-20px
- **Font-Weight:** 700

### Pattern: Sub-Section Headers (h3)
- **Font-Family:** Poppins:SemiBold
- **Font-Size:** 16px
- **Font-Weight:** 600

### Pattern: Primary Buttons
- **Font-Family:** Poppins:SemiBold
- **Font-Size:** 16px
- **Font-Weight:** 600
- **Padding:** px-6 py-3 (24px/12px)
- **Height:** h-[44px]
- **Border-Radius:** rounded-xl

### Pattern: Secondary Buttons
- [Document if different pattern]

### Pattern: Card Titles
- **Font-Family:** Poppins:SemiBold
- **Font-Size:** 14-16px
- **Font-Weight:** 600

### Pattern: Body Text
- **Font-Size:** 14-15px
- **Font-Weight:** 400

### Pattern: Small Metadata/Labels
- **Font-Size:** 12-13px
- **Font-Weight:** 400

### Pattern: Large Numbers (Scores, Grades)
- **Font-Family:** Poppins:Bold
- **Font-Size:** 22-48px (depending on context)
- **Font-Weight:** 700

---

## ⚠️ CRITICAL RULES FOR CONVERSION

### Rule 1: Never Lighten Font-Weights
- If original is **Poppins:Bold (700)**, keep **700**
- If original is **Poppins:SemiBold (600)**, keep **600**
- NEVER convert Bold to SemiBold or Medium

### Rule 2: Preserve Exact Font Sizes
- `text-[20px]` stays **20px**, don't convert to `text-xl`
- Keep exact pixel values, don't round or approximate

### Rule 3: Maintain Font-Family Declarations
- Keep `font-['Poppins:Bold',sans-serif]` format exactly
- Don't simplify to just `font-bold` if the original uses Poppins variant

### Rule 4: Preserve Button Dimensions
- Button padding affects perceived text weight
- Button height affects click target and visual prominence
- Keep exact px-X py-Y values

### Rule 5: Line-Height Matters for Headings
- If original has `leading-tight`, `leading-[24px]`, etc., preserve it
- Line-height affects text density and readability

### Rule 6: Don't Skip Small Elements
- Metadata, timestamps, badges - all matter
- Even "3 cards" or "2 days ago" should match original

---

## 📝 CHANGELOG

### v1.0 - February 15, 2026
- Complete typography audit by Claude Opus 4.6
- Documented all Main App screens (~10 screens)
- Documented all Main App components
- Documented all Modal components
- Documented all ExamApp screens (~9 screens)
- Documented ExamApp components
- Documented FlashcardGen app (if exists)
- Created component patterns summary
- Created critical conversion rules

---

## 🏁 COMPLETION CHECKLIST

Before submitting, verify you documented:

**Main App Screens:**
- [ ] HomeScreen
- [ ] FlashcardsScreen
- [ ] ExamScreen
- [ ] CompletedExamsScreen
- [ ] GenerateFlashcardsScreen
- [ ] ProfileScreen
- [ ] ChatScreen
- [ ] KIToolsScreen
- [ ] SettingsScreen
- [ ] LoginScreen
- [ ] RegisterScreen

**Main App Components:**
- [ ] FlashcardCard/FlashcardItem
- [ ] ExamCard/CompletedExamCard
- [ ] TodoCard
- [ ] BottomNavigation
- [ ] Other cards/components

**Main App Modals:**
- [ ] CreateOwnSetModal
- [ ] SubtopicsModal
- [ ] EditFlashcardModal
- [ ] DeleteConfirmationModal
- [ ] All other modals

**ExamApp Screens:**
- [ ] SubjectSelectionScreen
- [ ] CategorySelectionScreen
- [ ] TopicSelectionScreen
- [ ] SubtopicSelectionScreen
- [ ] ExamConfigurationScreen
- [ ] StartScreen
- [ ] QuestionScreen
- [ ] ResultsScreen
- [ ] ExamFeedbackScreen

**ExamApp Components:**
- [ ] Any separate components

**FlashcardGen App:**
- [ ] Document if exists

**Total:** ~30-40 screens/components/modals

---

## 🚀 Step-by-Step Workflow

### Step 1: Explore Project Structure
```bash
# List all screens
ls /src/app/screens/

# List all components
ls /src/app/components/

# List all modals
ls /src/app/components/modals/

# List ExamApp screens (try both paths)
ls /src/examapp/app/components/screens/
ls /src/examapp/app/screens/

# List ExamApp components
ls /src/examapp/app/components/

# Check for FlashcardGen
ls /src/flashcardgen/
```

### Step 2: Read Files Systematically
For each file:
1. Use `read` tool to open the file
2. Look for `className` attributes
3. Extract ONLY typography-related classes (and button/input padding/height)
4. Note the line number
5. Document in the format shown above

### Step 3: Look for These Patterns in Code
- `font-['Poppins:XYZ',sans-serif]`
- `font-bold`, `font-semibold`, `font-medium`
- `text-[Xpx]`
- `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, etc.
- `leading-[Xpx]`, `leading-tight`, `leading-normal`, etc.
- `tracking-tight`, `tracking-wide`, etc.
- `uppercase`, `lowercase`, `capitalize`
- For buttons: `px-X py-Y`, `h-[Xpx]`, `rounded-X`

### Step 4: Create Design System Summary
After documenting all files, analyze common patterns:
- What font sizes are used most?
- What are the heading hierarchies?
- What are the button typography standards?
- Are there consistent card title patterns?

### Step 5: Write Component Patterns
Group similar elements:
- All screen titles use...
- All section headers use...
- All primary buttons use...
- All card titles use...

### Step 6: Verify Completeness
- Use the checklist above
- Make sure you didn't miss any screens
- Make sure you didn't miss the ExamApp!
- Make sure you documented special elements (scores, grades, timers, etc.)

---

## 💡 Pro Tips

### Finding Typography in Code
Search for these patterns:
- `className="` - all styling
- `font-` - font families and weights
- `text-` - font sizes
- `Poppins` - custom font usage

### Understanding Font-Weight Variants
When you see:
- `Poppins:Bold` → Weight: 700
- `Poppins:SemiBold` → Weight: 600
- `Poppins:Medium` → Weight: 500
- `Poppins:Regular` → Weight: 400
- `Poppins:Light` → Weight: 300
- `font-bold` → Weight: 700
- `font-semibold` → Weight: 600

### Converting Tailwind Classes
- `text-xs` → 12px
- `text-sm` → 14px
- `text-base` → 16px
- `text-lg` → 18px
- `text-xl` → 20px
- `text-2xl` → 24px
- `text-3xl` → 30px
- `text-4xl` → 36px

BUT: Prefer exact px values when they're used (e.g., `text-[17px]` → 17px)

### Button Padding Conversion
- `px-6` → 24px horizontal (1.5rem = 24px)
- `py-3` → 12px vertical (0.75rem = 12px)
- `px-4` → 16px horizontal
- `py-2` → 8px vertical

### What to Document for Each Element
Minimum documentation:
- Element type (h1, button, p, span, etc.)
- Font-Family (if specified)
- Font-Size (exact value)
- Font-Weight (numeric value)
- Full className string
- Line number

For buttons, ALSO include:
- Padding values
- Height (if defined)
- Border-Radius (for context)

---

## ❓ FAQ

### Q: What if a file doesn't exist?
A: Note it in the documentation: `❌ File not found: /src/app/screens/SettingsScreen.tsx` and move to the next file.

### Q: What if I see inline styles instead of className?
A: Document those too! Note that it's an inline style.
Example: `style={{ fontSize: '18px', fontWeight: 700 }}`

### Q: Should I document text that's in variables or constants?
A: Document the className/style, even if the text content is dynamic.

### Q: What about text in SVGs or images?
A: Skip SVG/image text - only document HTML/React text elements.

### Q: What if the same className pattern appears many times?
A: Document it once, but note where it's used (e.g., "Used in: line 25, 42, 78, 95").

### Q: Should I include colors in the "Code" field?
A: Yes, include the FULL className string (including colors), but don't document colors separately. We only extract typography from the string.

---

## ✅ Quality Checklist

Before submitting your audit:

- [ ] Did you explore the ENTIRE project structure?
- [ ] Did you document the ExamApp (not just the Main App)?
- [ ] Did you document ALL screens listed in PRIORITY 1-5?
- [ ] Did you document special elements (scores, grades, timers)?
- [ ] Did you include button dimensions (padding, height)?
- [ ] Did you create a Design System Summary?
- [ ] Did you create Component Patterns?
- [ ] Did you note line numbers for each element?
- [ ] Did you copy EXACT className strings?
- [ ] Did you convert Tailwind classes to pixel values?
- [ ] Did you map font-weight variants to numeric values?

---

**This documentation will be used to fix a new version of this app that has incorrect typography (too thin fonts, wrong sizes, wrong button dimensions). The more thorough and accurate you are, the better the conversion will be!**

**Good luck! Take your time and be thorough!** 🎯
