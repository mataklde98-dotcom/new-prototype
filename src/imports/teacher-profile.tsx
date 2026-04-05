Build a Teacher Profile screen for a modern AI-powered EdTech learning platform.

This screen opens when a student clicks on a teacher inside the Home dashboard.

The goal is to allow the student to view the teacher’s profile and interact with the teacher.

------------------------------------------------

GENERAL LAYOUT

Create a clean modern dashboard profile layout.

Top section:
Teacher profile header

Below:
Teacher interaction actions

Below:
Upcoming meetings

Below:
Past meetings

Below:
Shared documents between student and teacher

Use a card-based layout with clear sections.

------------------------------------------------

HEADER SECTION – TEACHER PROFILE

Display the following information:

• Teacher profile picture (large circular avatar)  
• Teacher name  
• Subjects the teacher teaches specifically for this student

Example:
Mathematics  
Physics  
English

If multiple subjects exist, display them as tags or pills.

Optional additional metadata:

• Teacher rating  
• Years of teaching experience  
• Short bio (optional future feature)

------------------------------------------------

ACTION BUTTONS

Below the teacher header add three primary action buttons.

1. Chat with Teacher  
2. Share Document  
3. Request Extra Lesson

Buttons should be visually prominent and aligned horizontally on desktop.

Button behaviors:

Chat with Teacher  
→ Opens chat conversation with that teacher

Share Document  
→ Opens file upload modal to send document to teacher

Request Extra Lesson  
→ Opens booking modal where student can request additional tutoring time

------------------------------------------------

UPCOMING MEETINGS SECTION

Title:
Upcoming Meetings

Display all future meetings with this specific teacher only.

Each meeting card should show:

• Date  
• Time  
• Subject  
• Meeting type (Group / Private lesson)  
• Join Meeting button (if meeting is soon)

If no upcoming meetings exist:

Show empty state:
"No upcoming meetings scheduled with this teacher."

------------------------------------------------

PAST MEETINGS SECTION

Title:
Past Meetings

Display previous meetings with this teacher.

Each card shows:

• Date  
• Subject  
• Duration  
• Status (Completed / Missed)

Optional:

"View meeting summary" button.

------------------------------------------------

DOCUMENTS EXCHANGED

Title:
Shared Documents

Display documents exchanged between the student and this teacher.

Sort documents based on last viewed or last activity.

Each document item should show:

• File name  
• Upload date  
• Who sent it (Teacher / Student)  
• View / Download button

Important:

This is only a preview section.

Later there will be a dedicated Documents area where all files from all teachers are stored.

------------------------------------------------

EMPTY STATES

Include empty states for:

No meetings yet  
No past meetings  
No documents shared yet

Example message:

"You haven't exchanged any documents with this teacher yet."

------------------------------------------------

UI STYLE

Modern SaaS dashboard design.

Use:

Soft cards  
Rounded corners  
Clean spacing  
Subject tags  
Icons for actions  
Neutral color palette with accent highlights

Responsive layout for:

Desktop  
Tablet  
Mobile

------------------------------------------------

NAVIGATION

This screen opens when a student clicks a teacher card inside the Home dashboard.

Example route:

/teacher-profile/:teacherId

------------------------------------------------

GOAL

A complete Teacher Profile page where a student can:

• View teacher information  
• See assigned subjects  
• Chat with the teacher  
• Share documents  
• Request extra tutoring sessions  
• View upcoming and past meetings with that specific teacher  
• View previously exchanged documents