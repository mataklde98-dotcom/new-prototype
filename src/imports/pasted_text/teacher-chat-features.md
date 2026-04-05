
Prompt for Figma Make:

Feature: File/Media Upload and Chat Settings in Teacher Chat
Screen: Chats → Chat with a teacher (individual chat view)

PART 1: File & Media Upload via "+" Button
Current state: There is a "+" button next to the message input field, but tapping it does nothing. There is no upload functionality implemented.
What to build:
When the user taps the "+" button next to the message input field, a bottom sheet / action sheet opens with the following upload options:
Option 1: Foto oder Video aufnehmen

Icon: Camera icon
Action: Opens the device camera to take a photo or record a video
After capturing, the media is attached to the message and a preview thumbnail is shown in the message input area before sending

Option 2: Foto oder Video aus Galerie

Icon: Image/Gallery icon
Action: Opens the device photo gallery/library
User can select one or multiple photos/videos
After selecting, preview thumbnails are shown in the message input area before sending
Multiple selection should be supported

Option 3: Dokument

Icon: Document/File icon
Action: Opens the device file picker
Supported file types: PDF, DOCX, XLSX, PPTX, TXT
After selecting, the file is shown as a file attachment card in the message input area with file name, file type icon, and file size before sending

Option 4: Audio-Nachricht

Icon: Microphone icon
Action: Starts recording an audio message
While recording: Show a recording indicator with duration timer and a stop button
After stopping: Show the audio message as a playable preview before sending with a play button and duration

Bottom sheet layout:

The four options are displayed as a grid (2x2) or horizontal row with icon above and label below
Each option has a circular or rounded icon container with a subtle background color
Tapping outside the bottom sheet or swiping down closes it
The bottom sheet style must match the existing UI patterns of the app

After attaching a file/media:

A preview appears above the message input field
The preview shows a thumbnail (for images/videos), a file card (for documents), or an audio waveform (for audio)
There is an "X" button on each preview to remove the attachment before sending
The user can still type a text message alongside the attachment
The send button sends both the text and the attachment together

How attachments appear in the chat after sending:

Images: Displayed as inline image bubbles with rounded corners. Tapping opens a fullscreen image viewer with zoom and close button.
Videos: Displayed as a thumbnail with a play button overlay. Tapping opens a video player.
Documents: Displayed as a file card inside the chat bubble showing: file type icon, file name, file size, and a download/open button.
Audio messages: Displayed as a playable audio bar inside the chat bubble with play/pause button, waveform visualization, and duration.


PART 2: Chat Settings
Current state: There are no chat settings or options available in the individual teacher chat view.
What to build:
Add a settings icon (three dots ⋮ or gear icon) in the top right corner of the chat header, next to or near the teacher's name. Tapping this icon opens a bottom sheet or dropdown menu with the following options:

Option 1: Chat stummschalten

Icon: Bell with slash icon
Label: "Chat stummschalten"
Action: Opens a sub-selection with mute duration options:

"1 Stunde"
"8 Stunden"
"24 Stunden"
"Bis ich es ändere"


After selecting: A small muted icon appears next to the chat name in the chat list AND a subtle banner appears at the top of the chat: "Dieser Chat ist stummgeschaltet. Stummschaltung aufheben →"
When already muted: The option changes to "Stummschaltung aufheben" with a regular bell icon

Option 2: Nutzer melden

Icon: Flag/Warning icon
Label: "Nutzer melden"
Action: Opens a report popup/modal with:

Title: "Nutzer melden"
Subtitle: "Wähle einen Grund für die Meldung."
Selectable report reasons (user must choose ONE):

"Beleidigung oder Mobbing"
"Unangemessene Inhalte"
"Spam oder Werbung"
"Betrug oder Fake-Profil"
"Sonstiges"


Optional text field: "Weitere Details (optional)" with placeholder "Beschreibe das Problem..."
Button: "Meldung senden" (disabled until a reason is selected)
After sending: Success state with checkmark, title "Meldung eingegangen", subtitle "Wir prüfen deine Meldung so schnell wie möglich. Vielen Dank.", and "Schließen" button



Option 3: Nutzer blockieren

Icon: Block/Circle with slash icon
Label: "Nutzer blockieren"
Action: Opens a confirmation dialog:

Title: "Nutzer blockieren?"
Text: "Du wirst keine Nachrichten mehr von diesem Nutzer erhalten und kannst ihm keine Nachrichten mehr senden."
Two buttons: "Abbrechen" (secondary) and "Blockieren" (red/destructive)
After confirming: The chat input field is replaced by a bar saying "Du hast diesen Nutzer blockiert. Blockierung aufheben →"



Option 4: Medien & Dateien

Icon: Image/Grid icon
Label: "Medien & Dateien"
Action: Opens a new screen or modal showing all shared media and files in this chat conversation
Layout: Tab bar at top with two tabs:

"Medien" → Grid view of all shared photos and videos as thumbnails
"Dateien" → List view of all shared documents with file name, type, size, and date


If no media or files have been shared: Empty state with text "Noch keine Medien oder Dateien geteilt."


Summary of the chat settings menu:
Chat Header → Tap ⋮ (settings icon)
    │
    ├── 🔕 Chat stummschalten → Mute duration selection
    ├── 🚩 Nutzer melden → Report popup with reasons
    ├── 🚫 Nutzer blockieren → Confirmation dialog
    └── 🖼️ Medien & Dateien → Gallery of shared media/files
There is NO "Chat löschen" option. Deleting a chat between student and tutor is not permitted. The chat history must always be preserved.

Design guidelines:

The "+" upload bottom sheet and the chat settings menu must match the existing bottom sheet / modal style of the app
Dark theme consistent with the rest of the app
Destructive actions (blockieren) must be in red text to signal danger
All confirmations for destructive actions require two-step confirmation (dialog with cancel + confirm)
Smooth transitions and animations for all popups, bottom sheets, and state changes
The chat settings icon in the header must not interfere with the existing back button or teacher name/avatar
File attachment previews in the message input must be compact and not take up too much space
All text content must remain in German as shown above
Mobile-first: Everything must be easily tappable with proper touch targets