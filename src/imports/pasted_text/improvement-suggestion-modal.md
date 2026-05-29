**Feature: Add "Verbesserungsvorschlag" (Improvement Suggestion) to Profil → Konto**

**Screen:** Profil → Konto

---

**Step 1: New menu item in Konto**

Add a new menu item below "Passwort ändern" in the Konto screen:
- Label: "Verbesserungsvorschlag"
- Icon: A fitting icon (e.g. lightbulb or message bubble icon)
- Style: Identical to the existing menu items in Konto (same font size, same spacing, same chevron/arrow if present)
- Tapping this item opens a popup/modal

---

**Step 2: Popup/Modal – "Verbesserungsvorschlag senden"**

When the user taps "Verbesserungsvorschlag", a popup/modal opens with the following content from top to bottom:

**Header:**
- Title: "Verbesserungsvorschlag"
- Subtitle: "Dein Feedback hilft uns, die App für dich zu verbessern."
- Close button (X) in the top right corner

**Section 1: Kategorie auswählen**
- Label: "Art des Feedbacks"
- Selection type: Horizontally scrollable chips OR vertically stacked selectable options – whatever fits the existing UI style better
- Exactly 5 options, user must select ONE:

  | Option | Icon | Color |
  |---|---|---|
  | Fehler melden | Bug/Warning icon | Red |
  | Feature-Wunsch | Lightbulb/Plus icon | Blue/Purple |
  | Verbesserung | Arrow-up/Wrench icon | Orange |
  | Lob | Heart/Star/Thumbs-up icon | Green |
  | Sonstiges | Dots/Misc icon | Gray |

- Default: No option pre-selected. User must choose one before sending.
- The selected option should be visually highlighted (e.g. border color change, background tint, or filled state)

**Section 2: Priorität**
- Label: "Wie wichtig ist dir das?"
- Three selectable options as chips or toggles, user must select ONE:
  - "Sehr wichtig"
  - "Mittel"
  - "Nice-to-have"
- Default: No option pre-selected.
- Visually highlighted when selected, same style as the category selection above

**Section 3: Nachricht**
- Label: "Deine Nachricht"
- Multi-line text input field
- Placeholder text: "Beschreibe deinen Vorschlag so detailliert wie möglich..."
- Minimum height: 4-5 lines visible
- The text field should be resizable or scrollable if the user types a lot

**Section 4: Send Button**
- Full-width button at the bottom
- Label: "Vorschlag senden"
- Style: Primary button style matching the existing app design (green accent)
- Button is DISABLED (grayed out) until the user has:
  1. Selected a category AND
  2. Selected a priority AND
  3. Typed at least some text in the message field
- Once all three conditions are met, the button becomes active/enabled

---

**Step 3: Success Confirmation**

After the user taps "Vorschlag senden", the popup content transitions to a success state:

- Animated checkmark or success icon (green)
- Title: "Vielen Dank!"
- Subtitle: "Dein Verbesserungsvorschlag ist bei uns eingegangen. Wir schauen uns dein Feedback an."
- Button: "Schließen" – closes the popup and returns to the Konto screen

The transition from the form to the success state should be a smooth animation (e.g. fade or slide), not an abrupt switch.

---

**Summary of the full flow:**

```
Profil → Konto
    │
    └── Tap "Verbesserungsvorschlag"
            │
            └── Popup opens
                    │
                    ├── 1. Select category (Fehler melden / Feature-Wunsch / Verbesserung / Lob / Sonstiges)
                    ├── 2. Select priority (Sehr wichtig / Mittel / Nice-to-have)
                    ├── 3. Type message
                    ├── 4. Tap "Vorschlag senden"
                    │
                    └── Success state
                            │
                            ├── "Vielen Dank!" message
                            └── Tap "Schließen" → back to Konto
```

---

**Design guidelines:**
- The popup must match the existing modal/popup style used elsewhere in the app
- Dark theme consistent with the rest of the app
- The category chips should have distinct colors so the user can differentiate them instantly
- The priority chips can be more subtle in color – they don't need to be as prominent as the categories
- Smooth transitions throughout: opening the popup, switching to success state, closing
- Mobile-first: All elements must be easily tappable and the popup must be scrollable if content exceeds screen height
- All text content must remain in German as shown above

---