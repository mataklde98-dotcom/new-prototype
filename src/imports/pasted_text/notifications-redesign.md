Redesign: Complete visual overhaul of "Benachrichtigungen" screen – current implementation is not acceptable
Screen: Benachrichtigungen (notifications screen)
CRITICAL: The current implementation looks like a wireframe, not a finished UI. Discard the current card-based approach entirely and start fresh with the following precise instructions.

Overall approach:
Do NOT use visible card borders around each notification. Instead, use a clean list layout with subtle separators between items – similar to how notifications look in modern apps like Instagram or WhatsApp. The screen should feel like a native, premium notification list – not a collection of outlined boxes.

Layout for each notification item:
Each notification is a single row with NO visible border or card outline. The structure of each row from left to right:

Unread indicator: A small green/teal dot (6-8px) on the far left, vertically centered. ONLY visible for unread notifications. For read notifications, this space is empty but reserved so all content stays aligned.
Avatar: The profile picture or SoStudy logo (40-44px circle). No overlays, no extra icons on the avatar. Clean circle, nothing else.
Content area (to the right of avatar, takes remaining width):

Line 1: Name in bold (e.g. "Sameera" or "SoStudy ✓") followed by the action text in regular weight on the same line (e.g. "hat dein Dokument überprüft"). If the text is too long, truncate with "..."
Line 2: If there is a linked item, show it in green accent color (e.g. "Quantenmechanik Notizen" or "Nachricht anzeigen"). If no linked item, skip this line.
Line 3: Timestamp in small, dimmed gray text (e.g. "10:30 Uhr"). No clock icon – just the text.


Right side: A small subtle indicator showing the notification type as a tiny icon (chat bubble for messages, document icon for document reviews, bell for system notifications) in gray/muted color. Small (14-16px), not prominent.

NO card borders. NO card backgrounds. NO outlined boxes. Each notification is separated from the next by a thin subtle horizontal divider line (1px, very dim gray, only between items – not above the first or below the last in each section).

Unread vs read distinction:

Unread: Green/teal dot on the left + slightly brighter/bolder text for the name and action
Read: No dot + slightly dimmer text

Do NOT use different background colors for unread vs read. The dot and text weight are enough.

Section headers ("HEUTE", "GESTERN"):

Uppercase, small font, muted gray color
A thin horizontal line extending to the right of the text (same as current but make the line slightly more visible)
Generous top margin (24px) above each section header to clearly separate day groups
Small bottom margin (12px) below the header before the first notification


SoStudy system notifications:

Use the SoStudy logo as the avatar (the green icon that already exists)
No green checkmark overlay, no extra badges on the avatar
"SoStudy" in bold + blue verified checkmark ✓ inline with the name
These should look clean and official but not visually different in layout from teacher notifications


Spacing:

Vertical padding inside each notification row: 12-14px top and bottom
Gap between avatar and content: 12px
Gap between unread dot and avatar: 8px
The divider line between notifications should have no extra margin – it sits right between the padding of adjacent items
Overall left/right screen padding: 16px


Visual reference – this is exactly how it should look:
HEUTE ────────────────────────────

 ● [SoStudy]  SoStudy ✓ Dein Bericht wurde verarbeitet
               10:30 Uhr                              🔔
──────────────────────────────────────
 ● [Sameera]  Sameera hat eine Nachricht gesendet
               Nachricht anzeigen
               10:30 Uhr                              💬
──────────────────────────────────────
   [Sameera]  Sameera hat dein Dokument überprüft
               Quantenmechanik Notizen
               10:30 Uhr                              📄

GESTERN ──────────────────────────

   [Sameera]  Sameera hat dein Dokument überprüft
               Quantenmechanik Notizen
               10:30 Uhr                              📄
──────────────────────────────────────
   [Sameera]  Sameera hat dein Dokument überprüft
               Quantenmechanik Notizen
               10:30 Uhr                              📄
(● = unread dot, items without ● are read, tiny icons on right are muted gray)

What must NOT exist in the final design:

❌ No card borders or outlines around notifications
❌ No card background colors on individual notifications
❌ No icon overlays on avatars (no chat bubble, no document icon ON the avatar)
❌ No clock icon next to timestamps – just the text
❌ No green checkmark circle on SoStudy avatar
❌ No large or prominent type indicators – only the small muted icon on the right


Design guidelines:

This must look like a native iOS/Android notification list – clean, minimal, premium
Dark theme consistent with the rest of the app (#0a0a0a background)
The green accent links (document names, "Nachricht anzeigen") use the existing green (#00D4AA)
The unread dot uses the same green (#00D4AA)
Muted text and icons use a dim gray that matches the app's existing secondary text color
Font: Poppins, matching sizes and weights used elsewhere in the app
Touch targets: each entire notification row is tappable with at least 48px touch target height
All text content must remain in German