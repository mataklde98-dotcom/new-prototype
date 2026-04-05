You are updating the existing SoStudy authentication and registration flow.

IMPORTANT:
Do NOT rebuild the authentication system.
The current architecture already contains:

- AuthWrapper
- LoginScreen
- RegisterScreen
- localStorage login logic
- working authentication flow

Only MODIFY the registration process.

--------------------------------------------------
REMOVE FROM REGISTRATION
--------------------------------------------------

The registration process must NO LONGER ask:

"What type of tutoring do you prefer?"
- Online tutoring
- Local tutoring

Remove all UI and logic related to:

- tutoring type selection
- partner selection
- partner search
- tutoring onboarding

This tutoring decision will happen later inside the app.

Future flow:

After login, the student profile will contain a button:

"Activate Tutoring"

Clicking this button will start a separate onboarding process where the user can choose:

- Online tutoring
- Local tutoring partner

Do NOT design this onboarding now.

--------------------------------------------------
NEW REGISTRATION FLOW
--------------------------------------------------

STEP 1 — WHO IS BEING REGISTERED?

When a user clicks "Register", show a first screen asking:

"Who is being registered?"

Two options:

1. I am a student
2. I am a parent registering my child

UI:

Two large selection cards.

Card 1
Title: "I am a student"
Description: "Create your own learning account."

Card 2
Title: "I am a parent"
Description: "Register your child and track their learning progress."

User selects one option and clicks Continue.

--------------------------------------------------
STEP 2 — REGISTRATION FORM
--------------------------------------------------

Use the EXISTING RegisterScreen as the base.

Keep the current fields:

- Bundesland
- School Type
- Grade
- First Name
- Last Name
- Email
- Password

Do NOT remove these fields.

--------------------------------------------------
STUDENT REGISTRATION FLOW
--------------------------------------------------

If the user selected:

"I am a student"

Then the registration form works exactly as it currently does.

The student registers themselves.

--------------------------------------------------
PARENT REGISTRATION FLOW
--------------------------------------------------

If the user selected:

"I am a parent registering my child"

The SAME registration form appears but with modifications.

At the top of the form show text:

"You are registering a student account for your child."

Change the labels:

First Name → Child First Name  
Last Name → Child Last Name

These fields represent the CHILD.

Below the existing form add a new section:

Parent Account

Fields:

Parent Email  
Parent Password

This ensures that both a student account and a parent account are created.

--------------------------------------------------
IMPORTANT DATA ARCHITECTURE
--------------------------------------------------

When a parent registers a child, the system must create TWO separate accounts.

1. Student Account
2. Parent Account

These accounts must be linked.

Example relationship:

parentId → studentId

The system must support:

Parent → multiple student accounts

Parents must later be able to monitor:

- learning progress
- tutoring participation
- activity

Student accounts must still work independently if no parent is registered.

Do NOT merge parent and student into one account type.

--------------------------------------------------
FORM FIELD STRUCTURE
--------------------------------------------------

Student fields:

Child First Name  
Child Last Name  
School Type  
Grade  
Bundesland  

Student Email (optional if parent manages account)

Parent fields:

Parent Email  
Parent Password

This separation must be visually clear.

--------------------------------------------------
UX GOAL
--------------------------------------------------

Registration must be simple and fast.

Final flow:

Register
→ Choose Student or Parent
→ Fill registration form
→ Account created

No tutoring choices during registration.

--------------------------------------------------
FUTURE FEATURE CONTEXT
--------------------------------------------------

After login, inside the student profile there will be a button:

"Activate Tutoring"

Clicking this button will start tutoring onboarding where the user can choose:

- Online tutoring
- Local tutoring partner

This is NOT part of registration anymore.

--------------------------------------------------
TECHNICAL CONSTRAINTS
--------------------------------------------------

Keep compatibility with:

AuthWrapper  
LoginScreen  
RegisterScreen  
localStorage authentication logic  

Do NOT introduce a new auth architecture.

Only extend the registration UI and add the parent registration option.

--------------------------------------------------
DESIGN REQUIREMENTS
--------------------------------------------------

The flow must work for both:

Desktop  
Mobile

Mobile layout:

- stacked cards
- full width form fields
- large tap targets
- minimal scrolling

Desktop layout:

- centered auth card
- clean spacing
- readable form layout

Use consistent components:

selection cards  
form fields  
section headers  
primary buttons

The result should feel like a modern premium edtech platform.

--------------------------------------------------
END
--------------------------------------------------