You are working on the SoStudy authentication system. The current implementation already contains:

- AuthWrapper.tsx
- LoginScreen.tsx
- RegisterScreen.tsx

The current RegisterScreen contains the following fields:

Bundesland
School Type
Grade
First Name
Last Name
Email
Password

The goal is NOT to redesign the entire auth architecture but to EXTEND the registration flow with a PRE-REGISTRATION SELECTION FLOW.

The current RegisterScreen should only appear AFTER the correct selections have been made.

-----------------------------------
NEW REGISTRATION FLOW STRUCTURE
-----------------------------------

STEP 1 – USER TYPE SELECTION

When the user clicks "Register", the first screen must ask:

"Who are you registering?"

Two options:

1. I am a student registering myself
2. I am a parent registering my child

UI:
Two large selectable cards.

If student → continue to Step 2
If parent → continue to Step 2

Parent flow will later create a student account for the child but uses the same registration fields.

-----------------------------------

STEP 2 – TUTORING TYPE SELECTION

Next screen asks:

"What type of tutoring are you looking for?"

Two options:

1. Online Tutoring
2. Local Tutoring

-----------------------------------

STEP 3A – ONLINE TUTORING FLOW

If the user selects Online Tutoring:

Skip partner selection completely.

User proceeds directly to the existing RegisterScreen.

No changes to fields except:

Bundesland must remain selectable.

-----------------------------------

STEP 3B – LOCAL TUTORING FLOW

If the user selects Local Tutoring:

Show a new screen:

"Choose a tutoring partner near you"

Features:

Search field:
"Enter your city"

Below show a list of partner tutoring institutes.

Example partner object:

{
  partnerId: "partner_berlin_001",
  name: "Berlin Learning Center",
  city: "Berlin",
  address: "Alexanderplatz 10",
  bundesland: "Berlin"
}

User selects one partner.

After selection:

partnerId is stored in the registration context.

Bundesland field in the RegisterScreen must automatically be filled using the partner data and must NOT be editable.

-----------------------------------

STEP 4 – REGISTRATION FORM

Now load the EXISTING RegisterScreen.

Fields remain:

School Type
Grade
First Name
Last Name
Email
Password

Bundesland behavior:

If LOCAL partner selected → auto-filled and locked
If ONLINE tutoring → selectable as before

-----------------------------------

PARENT REGISTRATION SPECIAL CASE

If parent selected in Step 1:

First Name / Last Name fields refer to the CHILD.

Later parent accounts will exist but NOT in this phase.

-----------------------------------

TECHNICAL REQUIREMENTS

1. Do NOT modify AuthWrapper logic.
2. Do NOT modify LoginScreen.
3. Only extend RegisterScreen flow.

Implement a small state machine inside registration:

registrationStep:

"userType"
"tutoringType"
"partnerSelection"
"registerForm"

Context object:

registrationContext = {
 userType: "student" | "parent",
 tutoringType: "online" | "local",
 selectedPartner: null | PartnerObject
}

-----------------------------------

UX GOALS

Flow must feel simple:

Register
→ Choose user type
→ Choose tutoring type
→ (optional) choose partner
→ Fill registration form

-----------------------------------

IMPORTANT

Do not break the current authentication system or localStorage logic.
Only extend the UI flow before RegisterScreen is shown.