Improve the UX and visual behavior of the Tutoring Activation system in SoStudy.

This prompt focuses only on USER EXPERIENCE and VISUAL DESIGN.

Do not change system architecture or backend logic.

--------------------------------------------------

GOAL

The tutoring activation experience should:

- clearly communicate the value of tutoring
- encourage students to activate tutoring
- visually preview locked features
- feel premium and intuitive
- increase conversion from Basic User → Tutoring User

--------------------------------------------------

LOCKED FEATURE PREVIEW

When tutoring is NOT activated:

Tutoring features should still appear visually in the UI but in a locked preview state.

Example sections that appear locked:

HOME

- Your Tutors
- Extra Sessions
- Recently Viewed Documents
- Meetings
- Chat (except AI assistant)

PROFILE

- Set Availability
- My Subjects
- Extra Hours

Each locked section should:

- show a blurred preview or placeholder content
- display a lock icon
- include text:

"Activate tutoring to access this feature."

--------------------------------------------------

ACTIVATION CTA DESIGN

The "Activate Tutoring" call-to-action must be very visible.

Show it in two places:

1. Home screen
2. Profile tutoring section

Design suggestion:

Large card component with:

Title:
"Activate Tutoring"

Subtitle:
"Connect with professional tutors and unlock personalized learning."

CTA Button:
"Activate Tutoring"

Optional small preview icons for:

- live sessions
- tutor chat
- subject support

--------------------------------------------------

REQUEST SENT STATE

After the student submits the tutoring request:

The UI must change from:

"Activate Tutoring"

to

"Request Submitted"

The UI should show:

Status Card:

Title:
"Your tutoring request has been submitted"

Text:
"Our tutoring team will contact you soon by phone or email."

Show partner contact details:

Phone number
Email address

Add small button:

"View Contact Details"

--------------------------------------------------

ACTIVATED STATE

Once tutoring becomes activated:

All locked features become fully interactive.

Remove lock icons.

Replace preview placeholders with real content.

Examples:

"Your Tutors" shows assigned tutors.
"Meetings" shows scheduled sessions.
"Chat" shows tutor conversations.
"My Subjects" becomes editable.

--------------------------------------------------

PREVIEW MODE FOR PROTOTYPE

During prototyping:

Show example tutor data after activation.

Example preview content:

Tutor Name
Subject
Next Session Date
Message preview

Use realistic placeholder data so the interface feels like a real product.

--------------------------------------------------

VISUAL STYLE

The tutoring activation flow should feel:

modern
clean
professional
motivating

Avoid:

empty screens
technical language
confusing states

Use:

clear step progression
friendly explanations
visual previews
simple call-to-action buttons

--------------------------------------------------

IMPORTANT

This prompt only improves UX and UI.

Do NOT modify authentication or registration flows.