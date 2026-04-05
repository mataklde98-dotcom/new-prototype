Bugfix + Feature: Fix attachment sending and implement multi-image display in Teacher Chat
Screen: Chats → Chat with a teacher (individual chat view)
This prompt covers TWO issues: a bug where attachments are not sent, and a new multi-image display layout for sent images in the chat.

BUG: Attachments are not sent with messages
Current behavior:
When the user selects an image from the gallery or a file and then taps the send button, ONLY the text message is sent. The attachment (image or file) is NOT included in the sent message. The attachment disappears and never arrives in the chat.
Expected behavior:
When the user has attached one or more images, files, or any media AND taps the send button, the attachment(s) MUST be sent together with the message. If there is no text, the attachment(s) should still be sent on their own. If there is text AND an attachment, both must be sent together in the same message bubble.
Fix instructions:

Ensure that when the send button is tapped, the system checks for BOTH text content AND attached files/media
If attachments are present, they MUST be included in the sent message payload
After sending, the attachments must be visible in the chat as part of the sent message
After successful sending, the attachment preview in the input area must be cleared


FEATURE: Multi-image display layout in chat bubbles
When multiple images are sent in a single message, they must be displayed in a grid layout inside the chat bubble – similar to how WhatsApp displays multiple images. The layout changes depending on how many images are sent:
1 image:

Displayed as a single image bubble, full width of the chat bubble
Rounded corners
Tapping opens the image in a fullscreen viewer

2 images:

Displayed side by side in a 2-column grid
Both images equal size
Rounded corners on the outer edges
Tapping either image opens it in a fullscreen viewer

3 images:

Displayed as: 1 large image on the left taking up half the width, 2 smaller images stacked on the right
Rounded corners on the outer edges
Tapping any image opens it in a fullscreen viewer

4 images:

Displayed as a 2x2 grid
All four images equal size
Rounded corners on the outer edges
Tapping any image opens it in a fullscreen viewer

5 or more images:

Display the first 3 images in the layout described above for 3 images
The 4th visible image position shows the last image with a dark overlay and a "+X" number in the center, where X is the number of remaining unseen images (e.g. if 8 images are sent, show 3 normally + 1 with "+4" overlay)
Tapping the "+X" image opens ALL images in a fullscreen carousel viewer starting from that image
Tapping any of the other visible images opens the fullscreen carousel viewer starting from that specific image

Grid spacing:

2px gap between images in the grid
Consistent rounded corners on the outer edges of the entire grid (inner edges where images meet have no rounding)


FEATURE: Fullscreen image viewer with carousel
When the user taps on ANY image in the chat (single or multi-image), a fullscreen image viewer opens. When the message contains MULTIPLE images, the viewer must include a carousel/slider to swipe through all images.
Reference implementation: The carousel/slider that is already implemented in "Schulaufgaben" (school assignments) for the gallery view. Use THAT existing carousel component and behavior as the reference. The fullscreen image viewer in the chat must work identically to how it works in Schulaufgaben.
Fullscreen viewer features:

Dark/black background
The tapped image is shown first (not always starting from image 1)
Horizontal swipe to navigate between images (left/right)
Dot indicators or counter at the bottom showing current position (e.g. "3 / 8")
Pinch to zoom on each image
Close button (X) in the top corner to return to the chat
Smooth swipe transitions between images – identical to the Schulaufgaben carousel

Important: The carousel/slider behavior is ONLY activated when multiple images are in one message. If only a single image was sent, the fullscreen viewer opens without carousel – just the single image with zoom and close.

How files (non-images) appear when sent
For non-image files (PDF, DOCX, XLSX, PPTX, TXT), the display remains as a file card – there is NO grid layout for files. Each file is shown as its own card inside the chat bubble:

File type icon (PDF icon, Word icon, etc.)
File name
File size
Tap to open/download

If a message contains a mix of images AND files, display the image grid first, then the file cards below it, all within the same chat bubble.

Summary of changes:
1. BUG FIX: Attachments must actually be sent when send button is tapped
   └── Currently only text is sent, attachments are lost

2. MULTI-IMAGE GRID: Display multiple images in a grid layout
   ├── 1 image → full width
   ├── 2 images → side by side
   ├── 3 images → 1 large + 2 small
   ├── 4 images → 2x2 grid
   └── 5+ images → 3 visible + "+X" overlay on 4th position

3. FULLSCREEN VIEWER: Tap any image → fullscreen with carousel
   ├── Reference: Use the existing Schulaufgaben carousel component
   ├── Horizontal swipe between images
   ├── Position indicator (e.g. "3 / 8")
   ├── Pinch to zoom
   └── Only carousel when multiple images, otherwise single view

4. FILES: Non-image files display as cards, no grid
   └── Mixed messages: image grid first, file cards below

Design guidelines:

The image grid must match the dark theme of the app
Grid gaps between images: 2px
The "+X" overlay must have a semi-transparent dark background (e.g. rgba black 60%) with white text centered
The fullscreen viewer must have a smooth open/close animation
The carousel swipe must feel native and responsive – reference the Schulaufgaben implementation
All transitions must be smooth: opening fullscreen, swiping between images, closing
Sent image bubbles must have the same bubble styling (color, alignment) as regular sent messages
All text content must remain in German