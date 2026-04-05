Build a complete new student-facing tutoring progress system inside the existing student profile area.

Placement:
- Add this inside the student profile
- Section: Tutoring
- New menu item: Progress
- The Progress area should only be visible if tutoring has been activated for the student
- This feature is ONLY for the student side for now
- Do NOT build teacher panel or teacher workflow screens yet
- Focus entirely on the student experience and UI/UX

Goal:
Turn tutoring sessions into structured AI-powered learning progress. The system should make every tutoring session feel like an intelligent learning source, not just a meeting history. The student should be able to review what happened in the session, what they struggled with, what they learned, and what they should do next.

Important:
This is currently a prototype / product flow. Build the full UI, components, layouts, cards, states, navigation, empty states, and realistic mock data. The backend logic does not need to be implemented, but the screens should look complete and product-ready.

Please design the following flow and screens:

1) Tutoring Section in Student Profile
- In the student profile, inside the Tutoring area, add a new menu item called “Progress”
- Use the same design language as the rest of the app
- Make it feel integrated, not like a separate tool
- Show it only when tutoring is enabled
- If tutoring is not enabled, show a clean empty/locked state with a message such as:
  “Activate tutoring to track your session progress, summaries, weaknesses, and AI learning recommendations.”

2) Progress Overview Screen
Create a main overview screen for Tutoring → Progress with a clean dashboard-like structure.

This overview should contain:
- Header/title: “Tutoring Progress”
- Short subtitle explaining that tutoring sessions are converted into structured AI learning insights
- A summary card with overall tutoring progress
- Recent tutoring sessions list
- Key weaknesses detected over time
- Recommended next steps
- Skill progress snapshot
- Study plan until next tutoring session
- Quick action buttons

Suggested components:
- Progress summary card
- “Recent Sessions” section
- “Detected Weaknesses” card
- “What You Learned” card
- “Recommended Practice” card
- “Before Your Next Session” card
- Skill map preview card
- Quick action buttons for flashcards, exercises, exam simulation, and AI explanation

3) Session History / Meeting Entries
Create a list of tutoring session entries.

Each session card should display:
- Subject
- Date
- Duration
- Main topic
- Status or tag like “Analyzed by AI”
- Optional teacher name
- Clean CTA such as “View details”

Example card content:
- Mathematics
- March 12, 2026
- 60 min
- Topic: Quadratic Functions

The session list should feel modern, structured, and easy to scan.

4) Session Detail Screen
When the student opens a tutoring session entry, show a complete AI-generated learning breakdown.

This detailed session page should include:

A. Session Header
- Subject
- Date
- Duration
- Main topic
- Teacher name (optional)
- Status badge such as “AI analyzed”

B. AI Summary
Section title:
- “Session Summary”
Display a short readable summary of what was discussed and where the student had difficulties.

C. Topics Covered
Section title:
- “Topics Covered”
Display topic chips, tags, or a bullet-style visual list such as:
- pq-formula
- Parabolas
- Root calculation
- Graph analysis

D. Detected Weaknesses
Section title:
- “Detected Weaknesses”
Show clear weakness cards or bullet points like:
- Applying the pq-formula
- Rearranging equations
- Drawing parabolas correctly

Make this visually important because this is one of the core AI outputs.

E. Key Takeaways
Section title:
- “What You Learned Today”
Show the most important things the student learned in the session.

F. Recommended Practice
Section title:
- “Recommended Practice”
Show AI-generated next steps such as:
- Review 10 flashcards
- Solve 5 practice exercises
- Start 1 exam simulation

G. Study Plan Until Next Session
Section title:
- “Before Your Next Session”
Show a mini study plan based on the tutoring session.

5) AI Action Buttons on Session Detail
On the session detail screen, add strong action buttons for immediate learning conversion.

Required buttons:
- Create Flashcards
- Generate Practice Exercises
- Start Exam Simulation
- Explain the Tutoring Session Again

These buttons should feel like key product actions, not secondary buttons.

For “Explain the Tutoring Session Again”:
- This should open a student-facing AI assistant style screen or bottom sheet
- The assistant should say something like:
  “In your last tutoring session, you discussed the pq-formula. Let me explain it step by step again.”
- The student should be able to ask follow-up questions in a chat-like interface
- Make this feel like the Learning Assistant is re-teaching the session in simple terms

6) AI Knowledge Gap Recognition
Add a dedicated UI section or insight card showing that AI recognized deeper learning issues from the conversation.

Example:
- “AI detected that you may still struggle with fractions.”
- “A personalized learning path has been suggested.”

This section should visually connect tutoring sessions with:
- learning paths
- exercises
- flashcards
- explanations

The UI should make it obvious that the platform intelligently reacts to real student struggles.

7) Skill Map Integration
Add a student-facing skill progress area connected to tutoring.

Show a compact skill map or skill breakdown for the subject, for example:
- Algebra: 62%
- Geometry: 48%
- Functions: 71%

This should be based conceptually on:
- tutoring sessions
- exercises
- flashcards
- exam simulations

Build it as a student progress visualization card. It does not need advanced analytics logic yet, but it should look real and polished.

8) Smart Recommendations and Reminders
Include UI blocks for:
- recommended review tasks
- spaced repetition reminder
- “Review your last tutoring session”
- “Continue where you left off”

Make these feel intelligent and personalized.

9) Empty States / No Session States
Design polished empty states for:
- tutoring enabled but no sessions yet
- no AI analysis available yet
- no weaknesses detected yet
- no recommendations yet

Example empty state:
“You haven’t completed a tutoring session yet. Once your first session is analyzed, your summaries, weaknesses, and recommendations will appear here.”

10) Mobile and Desktop Consistency
Make sure the feature is built consistently for both mobile and desktop profile flows if applicable in the current project structure.
Use existing app patterns, spacing, cards, navigation style, typography, and buttons.

11) Design Direction
Use a modern, clean EdTech product style:
- structured cards
- soft hierarchy
- readable sections
- intuitive progress visuals
- useful AI labels/badges
- strong but clean CTA buttons
- student-friendly and motivating tone
- no clutter
- premium but practical UX

12) Mock Data
Use realistic tutoring session mock data such as:
- Mathematics / Quadratic Functions
- English / Essay Structure
- Biology / Cell Division
- Chemistry / Acids and Bases

For each session, generate believable summaries, weaknesses, key takeaways, and recommended practice so the prototype feels alive.

13) Important Scope Note
Only build the student-side tutoring progress experience.
Do not build teacher dashboards, teacher editing workflows, or teacher analytics views yet.
This phase is only for the student profile and student tutoring progress flow.

Please create all relevant screens, components, cards, interactions, states, and navigation needed so this feature feels complete and demo-ready inside the existing product.