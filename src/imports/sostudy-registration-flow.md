Design the SoStudy registration flow as a responsive multi-step authentication experience for BOTH desktop and mobile.

IMPORTANT:
The flow must be optimized equally for:
- Desktop web
- Mobile app screens

Do not create separate products.
Create one consistent responsive design system that works for both screen sizes.

-----------------------------------
GOAL
-----------------------------------

Create a clean, premium, modern registration flow for SoStudy that feels intuitive, lightweight, and scalable.

This registration flow must support:

1. Student self-registration
2. Parent registering a child
3. Online tutoring registration
4. Local tutoring registration through licensed partners

The design must fit naturally into the existing SoStudy auth system and must look like a polished real product, not a generic template.

-----------------------------------
SCREEN FLOW
-----------------------------------

Create the following screens:

1. Registration Entry – User Type Selection
2. Tutoring Type Selection
3. Local Partner Search + Partner Selection
4. Registration Form
5. Optional summary / review state before final submit if helpful

-----------------------------------
RESPONSIVE DESIGN REQUIREMENTS
-----------------------------------

Design for both:

Desktop:
- centered auth card layout
- comfortable spacing
- side illustration or subtle branding area is allowed
- max content width should feel premium and not too stretched

Mobile:
- stacked layout
- thumb-friendly tap targets
- no horizontal overflow
- minimal scrolling where possible
- sticky bottom CTA button if useful

The experience must feel native on mobile and elegant on desktop.

Use responsive behavior such as:
- cards stacking vertically on mobile
- multi-column layouts collapsing into one column
- partner cards becoming compact on mobile
- form fields spanning full width on mobile

-----------------------------------
VISUAL STYLE
-----------------------------------

Style direction:
- modern edtech premium interface
- clean, trustworthy, intelligent
- minimal but warm
- slightly futuristic but not flashy
- suitable for students and parents
- high readability
- polished onboarding experience

Use:
- soft spacing
- clean typography hierarchy
- rounded cards/buttons
- subtle depth, not heavy shadows
- clear step progression
- elegant selected states
- professional form layout

Avoid:
- clutter
- overly playful childish UI
- too many colors
- overly glassy or distracting effects
- large empty areas
- confusing navigation

-----------------------------------
SCREEN DETAILS
-----------------------------------

1. USER TYPE SELECTION

Headline:
"Who are you registering?"

Options:
- I am a student registering myself
- I am a parent registering my child

UI:
- two large selection cards
- each card must have icon, title, short description
- selected state must be visually very clear
- primary CTA button below: Continue

Desktop:
- cards can appear side by side

Mobile:
- cards must stack vertically

-----------------------------------

2. TUTORING TYPE SELECTION

Headline:
"What type of tutoring are you looking for?"

Options:
- Online Tutoring
- Local Tutoring

Add short explanatory text under each option.

Online:
Student joins SoStudy’s own tutoring service directly.

Local:
Student is assigned to one of our licensed local tutoring partners.

Same responsive behavior as Step 1.

-----------------------------------

3. LOCAL PARTNER SEARCH

Only shown if Local Tutoring is selected.

Headline:
"Choose a tutoring partner near you"

Include:
- search input for city / location
- list of available partner institutes
- each partner card should show:
  - partner name
  - city
  - address
  - Bundesland
  - optional badge: "Licensed Partner"

Desktop:
- search field on top
- partner cards in a clean list or 2-column grid if elegant

Mobile:
- full-width search field
- single-column partner cards
- very easy to tap/select

Selected partner must be clearly highlighted.

-----------------------------------

4. REGISTRATION FORM

After partner selection or online tutoring selection, show the registration form.

Form behavior:

If Online Tutoring:
- Bundesland is selectable manually

If Local Tutoring:
- Bundesland is auto-filled from selected partner
- field is locked / read-only
- show subtle helper text:
  "Automatically assigned based on selected tutoring partner"

Fields:
- School Type
- Grade
- First Name
- Last Name
- Email
- Password

If Parent flow selected:
- clearly indicate that the child’s information should be entered
- small info text at top:
  "Please enter your child’s student details"

Keep the form extremely clear and easy to scan.

Desktop:
- can use 2-column layout where appropriate
- but do not reduce readability

Mobile:
- all fields full width
- generous spacing
- keyboard-safe layout

-----------------------------------
STEP INDICATOR
-----------------------------------

Add a progress indicator across the flow.

For example:
Step 1 → Step 2 → Step 3 → Step 4

Rules:
- clear current step
- completed steps visible
- on mobile keep it compact
- user should always know where they are

-----------------------------------
NAVIGATION
-----------------------------------

Include:
- Back button on every step after step 1
- Continue button
- Final CTA: Create Account

Do not make navigation confusing.

-----------------------------------
ACCESSIBILITY / USABILITY
-----------------------------------

Ensure:
- strong contrast
- readable font sizes on mobile
- easy tap targets
- obvious selected states
- error states for forms
- empty state for partner search
- disabled state for CTA until required selection is made

-----------------------------------
COMPONENT CONSISTENCY
-----------------------------------

Use reusable components for:
- selection cards
- step headers
- progress indicator
- partner cards
- form fields
- CTA buttons

The design must feel like one consistent system.

-----------------------------------
OUTPUT REQUIREMENT
-----------------------------------

Create all screens in a way that a frontend developer can immediately understand:
- layout
- responsive behavior
- step transitions
- selected states
- disabled states
- locked Bundesland state for local tutoring
- parent vs student hint text

The final result must be implementation-ready and reduce revision work.