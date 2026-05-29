Create a complete, production-ready UI/UX concept for an AI learning assistant inside an existing EdTech platform.

The feature must strictly follow the backend API structure described below. The UI must reflect the API logic exactly and must not invent features that do not exist in the API.

The final design must be realistic and implementation-ready for a React / TypeScript frontend.

All visible product language must be German.

The design must feel like a modern premium AI-powered EdTech platform for students (2026 design level).

--------------------------------

PLATFORM CONTEXT

The platform already includes:

• student dashboard
• flashcards
• exam simulations
• learning analytics
• chat with teachers
• tutoring features

Inside the existing chat system there will be a dedicated AI chat called:

"Dein Lernassistent"

This assistant acts as a personalized AI tutor that understands the student's learning context.

--------------------------------

--------------------------------

CHAT SYSTEM INTEGRATION

The AI learning assistant must be accessible through the existing chat section of the platform.

Inside the current chat list there should be a conversation entry called:

"Dein Lernassistent"

This entry should appear similar to a normal chat conversation so that students can access the assistant naturally through the existing chat area.

Once the user clicks on this chat entry, they enter the AI assistant experience.

After opening the assistant conversation, the interface may expand into a more advanced AI tutoring chat interface that supports the functionality required by the API (messages, suggested actions, learning assistance, etc.).

The internal layout of the assistant conversation does not have to be limited to the current chat UI and may introduce richer components if necessary to support the AI tutoring experience.

The only strict requirement is that the entry point to the assistant is the existing chat area of the platform and appears as a normal chat conversation called "Dein Lernassistent".

--------------------------------

BACKEND API STRUCTURE (STRICT)

1) Send message

POST  
/v1/curriculum/chat-assistant/message

Body parameters:

userId (required)  
message (required)  
chatId (optional)  
subject (optional)

If chatId is missing → backend creates a new chat automatically.

The UI must support:

• message input
• send button
• optional subject selector

Example subjects:

Mathematik  
Englisch  
Biologie  
Chemie  
Physik

Subject selection must be optional.

--------------------------------

API RESPONSE

Example response:

{
"success": true,
"chatId": "chat_123",
"messageId": "msg_456",
"response": "Hallo! Ich sehe, dass du Schwierigkeiten mit ...",
"suggestedActions": [
{ "type": "flashcards", "topic": "Quadratische Gleichungen" },
{ "type": "exam", "subject": "Mathematik" }
],
"metadata": {
"responseTime": 2340,
"tokensUsed": 456
}
}

The UI must render:

• assistant message
• optional suggested actions
• optional metadata display (example: response time)

--------------------------------

SUGGESTED ACTIONS UI

Use the API field:

suggestedActions

Example UI:

Assistant message

Action cards below message:

"Flashcards zu Quadratischen Gleichungen öffnen"

"Prüfungssimulation in Mathematik starten"

These actions should appear directly under the assistant response.

--------------------------------

CHAT LIST ENDPOINT

GET  
/v1/curriculum/chat-assistant/chats/:userId

Response contains:

chatId  
title  
lastMessage  
createdAt  
status

Design a chat list UI that displays:

• chat title
• last message preview
• timestamp
• chat status

Example chat titles:

Mathematik Hilfe  
Englisch Grammatik  
Prüfungsvorbereitung Biologie

--------------------------------

CHAT HISTORY ENDPOINT

GET  
/v1/curriculum/chat-assistant/chat/:chatId/history

Response returns:

messages  
total  
hasMore

Each message contains:

role (user / assistant)  
content  
timestamp

The UI must display:

• message bubbles
• user messages
• assistant messages
• timestamps
• scrollable message history

If hasMore = true

Design a UI to load older messages.

Example:

"Ältere Nachrichten laden"

or infinite scroll.

--------------------------------

ARCHIVE CHAT

PUT  
/v1/curriculum/chat-assistant/chat/:chatId/archive

UI must support:

Archive Chat option in the chat header menu.

--------------------------------

DELETE CHAT

DELETE  
/v1/curriculum/chat-assistant/chat/:chatId

UI must support:

Delete chat option with confirmation modal.

Example confirmation text:

"Möchtest du diesen Chat wirklich löschen?"

--------------------------------

RATE LIMIT ENDPOINT

GET  
/v1/curriculum/chat-assistant/rate-limit/:userId

Example limits:

perMinute: 5  
perDay: 100

Design UI for rate limit states.

Examples:

"Du hast dein Nachrichtenlimit für diese Minute erreicht."

"Heute verbleiben dir noch 55 Nachrichten."

--------------------------------

EMPTY STATE

When the assistant is used for the first time show a welcome screen.

Title:

Dein persönlicher Lernassistent

Description:

"Ich helfe dir beim Lernen, erkläre schwierige Themen und unterstütze dich bei der Prüfungsvorbereitung."

Example prompts:

• "Erkläre mir die Mitternachtsformel"
• "Worin bin ich aktuell am schwächsten?"
• "Erstelle mir Lernkarten für Bruchrechnung"
• "Bereite mich auf meine nächste Mathe-Prüfung vor"

Include quick prompt buttons.

--------------------------------

LOADING STATES

Design loading states for:

• loading chat history
• sending message
• assistant generating response
• loading older messages

Include:

• skeleton loaders
• typing indicator for assistant

--------------------------------

ERROR STATES

Design clear UI for:

• network errors
• failed message sending
• assistant unavailable

Include retry button.

--------------------------------

DESIGN STYLE

Design language should be:

• modern
• minimal
• premium EdTech platform
• clean chat UI
• soft shadows
• rounded corners
• high readability
• calm colors

Avoid futuristic or experimental layouts.

--------------------------------

FIGMA STRUCTURE

Organize the design into sections:

Chat List

• chat list with pinned AI assistant
• chat list with multiple assistant chats

AI Chat

• empty state
• active conversation
• conversation with suggested actions

System States

• loading state
• error state
• rate limit state

Modals

• delete confirmation
• archive confirmation

Components

• AI avatar
• chat list item
• message bubble user
• message bubble assistant
• suggested action card
• subject chip
• typing indicator
• rate limit banner

--------------------------------

IMPORTANT

Think like a senior product designer and frontend architect.

The result must be implementation-oriented and fully compatible with the API endpoints described above.

Do not generate a generic chatbot interface.

Generate a realistic, complete feature flow for an AI learning assistant inside the chat system.



ist das gut kann ich abschicken ?