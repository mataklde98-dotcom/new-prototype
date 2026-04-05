---

**Prompt for Figma Make:**

---

**Redesign: Final polish pass on "Benachrichtigungen" screen + add filter chips**

**Screen:** Benachrichtigungen

**Reference:** The attached Instagram notification screenshot. Keep matching this layout quality.

---

## FIX 1: Avatar spacing

The avatars are currently too close to the left screen edge. Add proper padding:
- Left screen padding: 16px from screen edge to avatar
- This must be consistent for ALL notification rows including SoStudy and teacher notifications
- The avatars should NOT touch or feel cramped against the left edge

## FIX 2: Add filter chips below the header

Add horizontally scrollable filter chips directly below the "Benachrichtigungen" title – exactly like Instagram has "Alle", "Personen, denen du folgst", "Kommentare" etc.

Our filter chips:

| Chip | What it filters |
|---|---|
| **Alle** | Shows all notifications (default, selected) |
| **Nachhilfe** | Messages from teachers, document reviews, lesson reminders |
| **Lernaktivität** | Lernziel updates, Klausur reminders, KI recommendations |
| **System** | SoStudy notifications, abo/credits updates, referral notifications |

Chip styling:
- The selected/active chip has a white/light fill with dark text (like Instagram's "Alle" chip)
- Unselected chips have a subtle border/outline with light text and no fill (like Instagram's other chips)
- Horizontally scrollable if they don't all fit
- Rounded pill shape
- Position: directly below the header title with 12px gap, above the first section header ("Heute")

## FIX 3: Timestamps must ALWAYS be inline – not on a separate line

Currently the timestamps for SoStudy ("11:12 Uhr") and Sameera's message notification ("10:30 Uhr") are on a SEPARATE line below the text. But for the document review notifications they are inline. This is inconsistent.

ALL timestamps must be inline at the end of the text in muted gray. Never on a separate line. No exceptions.

Current (wrong):
```
SoStudy ✓ Dein Bericht wurde verarbeitet
11:12 Uhr
```

Correct:
```
SoStudy ✓ Dein Bericht wurde verarbeitet · 11:12 Uhr
```

Fix this for EVERY notification on the screen. The dot separator "·" goes before the timestamp. The timestamp is the same muted gray color. Everything flows as one continuous text block.

## FIX 4: Slightly larger avatars

The avatars feel slightly small compared to Instagram. Increase avatar size from current to 44-48px. This gives the notification list more visual weight and makes it feel more premium. Compare with the Instagram screenshot – their avatars are relatively prominent.

## FIX 5: Vertical spacing between items

Add slightly more vertical breathing room between notification items. Currently they feel a tiny bit cramped. Each notification row should have 14-16px vertical padding (top and bottom). There should be a comfortable visual gap between one notification's text and the next notification's avatar.

## FIX 6: Section headers styling

"Heute" and "Gestern" are currently too subtle. Make them match Instagram's style more closely:
- Font weight: Bold (SemiBold or Bold)
- Font size: slightly larger than current (16-18px)
- No horizontal line extending from them – just the bold text, left-aligned
- Top margin above section header: 24-28px (generous gap to separate from previous section)
- Bottom margin below section header: 8-12px before first notification

## FIX 7: Text hierarchy improvement

Make the notification text more readable with better contrast:
- **Name** (e.g. "Sameera", "SoStudy"): Bold, full white (#FFFFFF)
- **Action text** (e.g. "hat dein Dokument überprüft"): Regular weight, slightly dimmer white (#CCCCCC or similar)
- **Linked items** (e.g. "Quantenmechanik Notizen"): Bold, same dimmer white as action text – NOT green, but bold makes it stand out enough
- **Timestamp** (e.g. "10:30 Uhr"): Regular weight, muted gray (#888888 or similar)
- **Dot separator** "·": Same muted gray as timestamp

This creates a clear reading hierarchy: name catches the eye first, then action, then linked item, then timestamp fades into the background.

## FIX 8: Tappable notification feedback

Add a subtle press/highlight state when tapping a notification row. On tap, the row background should briefly show a very subtle lighter shade (e.g. #1a1a1a) and then fade back. This gives tactile feedback that the notification is interactive.

---

**Complete visual target:**

```
     Benachrichtigungen

 [Alle]  [Nachhilfe]  [Lernaktivität]  [System]

 Heute

 [SoStudy]  SoStudy ✓ Dein Bericht
            wurde verarbeitet · 11:12 Uhr

 [Sameera]  Sameera hat dir eine
            Nachricht gesendet · 10:30 Uhr

 [Sameera]  Sameera hat dein Dokument
            überprüft · Quantenmechanik
            Notizen · 10:30 Uhr

 Gestern

 [Sameera]  Sameera hat dein Dokument
            überprüft · Quantenmechanik
            Notizen · 10:30 Uhr

 [Sameera]  Sameera hat dein Dokument
            überprüft · Quantenmechanik
            Notizen · 10:30 Uhr
```

---

**Design guidelines:**
- Match Instagram's notification layout as closely as possible in our dark theme
- Background: #0a0a0a
- Name text: #FFFFFF bold
- Action text: #CCCCCC regular
- Linked items: #CCCCCC bold
- Timestamp + separator: #888888 regular
- NO green accents in notification text – only green in the SoStudy logo avatar
- Filter chips: white fill for selected, outline for unselected (like Instagram)
- Avatars: 44-48px circle
- Screen padding: 16px left/right
- Font: Poppins
- All text in German
- Premium, native, Instagram-quality feel

---