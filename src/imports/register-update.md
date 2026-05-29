You are updating the existing SoStudy authentication flow.

IMPORTANT:
Do not rebuild the authentication architecture.
The current system already includes:

- AuthWrapper
- LoginScreen
- RegisterScreen
- working registration form
- localStorage login logic

Your task is to MODIFY the registration flow, not redesign it.

--------------------------------------------------

CHANGE 1 – REMOVE TUTORING TYPE FROM REGISTRATION

The registration process must NO LONGER ask:

"Online tutoring or local tutoring?"

This decision will now happen later inside the app after login.

Remove all UI and logic related to:

- tutoring type selection
- partner location selection
- partner search

These features will be moved to a later onboarding step inside the app.

--------------------------------------------------

NEW REGISTRATION FLOW

STEP 1 – WHO IS BEING REGISTERED?

When a user clicks "Register", show a first screen with this question:

"Who is being registered?"

Two options:

1. I am a student
2. I am a parent registering my child

UI:

Two large selectable cards.

Card 1:
Title: "I am a student"
Description: "Create your own learning account."

Card 2:
Title: "I am a parent"
Description: "Register your child and track their learning progress."

After selection → Continue to the registration form.

--------------------------------------------------

STEP 2 – REGISTRATION FORM

Use the EXISTING RegisterScreen as the base.

Fields currently included:
- Bundesland
- School Type
- Grade
- First Name
- Last Name
- Email
- Password

Do not remove these fields.

--------------------------------------------------

STUDENT FLOW

If "I am a student" was selected:

The form remains exactly as it currently exists.

The student registers themselves.

--------------------------------------------------

PARENT FLOW

If "I am a parent registering my child":

The same registration form appears but with small adjustments.

The form fields now represent the CHILD.

Add a small text at the top:

"You are registering a student account for your child."

Below the existing fields add a new section:

Parent Account

Fields:

Parent Email
Parent Password

This ensures that:

- a student account is created
- a parent account is created at the same time

The parent account will later allow the parent to monitor the student's progress.

--------------------------------------------------

IMPORTANT BEHAVIOR

Student fields:
First Name
Last Name
School Type
Grade

These belong to the child.

Parent fields belong to the parent login.

--------------------------------------------------

FUTURE FEATURE (IMPORTANT CONTEXT)

The tutoring selection (online vs local tutoring) must NOT be part of registration anymore.

Instead:

After login, inside the student profile there will be a button:

"Activate Tutoring"

Clicking this button will start a new onboarding flow that includes:

- choosing online tutoring
- choosing local tutoring partners

Do NOT design this onboarding now.
Only make sure the registration flow no longer includes it.

--------------------------------------------------

TECHNICAL NOTE

Keep compatibility with the current system:

AuthWrapper
LoginScreen
RegisterScreen
localStorage login flow

Do not introduce new authentication architecture.

Only extend the RegisterScreen with the parent option and remove tutoring selection.

--------------------------------------------------

UX GOAL

Registration should now be simple:

Register
→ Choose Student or Parent
→ Fill registration form
→ Account created