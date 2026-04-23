// ===== CHAT MOCKS =====
// Mock-Daten für Chat zwischen Schüler und Lehrer

export interface ChatMessage {
  id: string;
  senderId: 'student' | 'teacher';
  senderName: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'voice' | 'image' | 'extra-session-request';
  duration?: number; // Für Voice Messages in Sekunden
  attachments?: ChatAttachment[];
  /** Link to an ExtraSessionRequest in extraSessionRequestStore (type==='extra-session-request') */
  extraSessionRequestId?: string;
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'video' | 'document';
  name: string;
  size: string;
  url?: string;
  thumbnail?: string;
}

export interface ChatRoom {
  id: string;
  participantName: string;
  participantRole: 'teacher';
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  isTyping: boolean;
  subject?: string;
}

// Mock Chat Rooms (Lehrer-Liste)
export const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    participantName: 'Dr. Schmidt',
    participantRole: 'teacher',
    participantAvatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'Sehr gut! Weiter so 👍',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    isOnline: true,
    isTyping: false,
    subject: 'Physik',
  },
  {
    id: '2',
    participantName: 'Prof. Müller',
    participantRole: 'teacher',
    participantAvatar: 'https://i.pravatar.cc/150?img=33',
    lastMessage: 'Die Aufgaben sind bis Freitag abzugeben.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
    subject: 'Mathematik',
  },
  {
    id: '3',
    participantName: 'Dr. Weber',
    participantRole: 'teacher',
    participantAvatar: 'https://i.pravatar.cc/150?img=65',
    lastMessage: 'Kannst du mir deine Zusammenfassung schicken?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    isOnline: true,
    isTyping: false,
    subject: 'Deutsch',
  },
  {
    id: '4',
    participantName: 'Fr. Hoffmann',
    participantRole: 'teacher',
    participantAvatar: 'https://i.pravatar.cc/150?img=47',
    lastMessage: 'Tolle Arbeit bei der Präsentation!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unreadCount: 1,
    isOnline: false,
    isTyping: false,
    subject: 'Englisch',
  },
  {
    id: '5',
    participantName: 'Hr. Becker',
    participantRole: 'teacher',
    participantAvatar: 'https://i.pravatar.cc/150?img=53',
    lastMessage: 'Vergiss nicht das Experiment morgen!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 72),
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
    subject: 'Chemie',
  },
];

// Mock Chat Messages (Konversation mit Dr. Schmidt)
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: 'teacher',
    senderName: 'Dr. Schmidt',
    message: 'Hallo! Wie kommst du mit dem neuen Stoff voran?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    isRead: true,
    type: 'text',
  },
  {
    id: '2',
    senderId: 'student',
    senderName: 'Du',
    message: 'Hallo Dr. Schmidt! Ich komme ganz gut zurecht, aber ich habe noch ein paar Fragen zur Quantenmechanik.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    isRead: true,
    type: 'text',
  },
  {
    id: '3',
    senderId: 'teacher',
    senderName: 'Dr. Schmidt',
    message: 'Klar, gerne! Was genau möchtest du wissen?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.4),
    isRead: true,
    type: 'text',
  },
  {
    id: '4',
    senderId: 'student',
    senderName: 'Du',
    message: 'Ich verstehe das Konzept der Wellenfunktion noch nicht ganz. Können Sie mir das noch einmal erklären?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.3),
    isRead: true,
    type: 'text',
  },
  {
    id: '5',
    senderId: 'teacher',
    senderName: 'Dr. Schmidt',
    message: 'Natürlich! Die Wellenfunktion beschreibt den quantenmechanischen Zustand eines Systems. Sie gibt uns die Wahrscheinlichkeit, ein Teilchen an einem bestimmten Ort zu finden.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.2),
    isRead: true,
    type: 'text',
  },
  {
    id: '6',
    senderId: 'teacher',
    senderName: 'Dr. Schmidt',
    message: 'Das Quadrat der Wellenfunktion |ψ|² gibt uns die Wahrscheinlichkeitsdichte.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.15),
    isRead: true,
    type: 'text',
  },
  {
    id: '7',
    senderId: 'student',
    senderName: 'Du',
    message: 'Ah okay, das macht Sinn! Und wie hängt das mit dem Unschärfe-Prinzip zusammen?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true,
    type: 'text',
  },
  {
    id: '8',
    senderId: 'teacher',
    senderName: 'Dr. Schmidt',
    message: 'Sehr gute Frage! Das Unschärfe-Prinzip besagt, dass wir Ort und Impuls eines Teilchens nicht gleichzeitig beliebig genau messen können.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9),
    isRead: true,
    type: 'text',
  },
  {
    id: '9',
    senderId: 'teacher',
    senderName: 'Dr. Schmidt',
    message: 'Je genauer wir den Ort kennen, desto ungenauer wird der Impuls - und umgekehrt. Das ist eine fundamentale Eigenschaft der Quantenmechanik! 🔬',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.85),
    isRead: true,
    type: 'text',
  },
  {
    id: '10',
    senderId: 'student',
    senderName: 'Du',
    message: 'Vielen Dank! Das hilft mir sehr weiter. Ich werde das nochmal in Ruhe durcharbeiten.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.7),
    isRead: true,
    type: 'text',
  },
  {
    id: '11',
    senderId: 'teacher',
    senderName: 'Dr. Schmidt',
    message: 'Sehr gerne! Wenn du noch weitere Fragen hast, melde dich einfach.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: true,
    type: 'text',
  },
  {
    id: '12',
    senderId: 'teacher',
    senderName: 'Dr. Schmidt',
    message: 'Die Übungsaufgaben sind übrigens sehr wichtig für das Verständnis. Hast du sie schon gemacht?',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    isRead: false,
    type: 'text',
  },
  {
    id: '13',
    senderId: 'teacher',
    senderName: 'Dr. Schmidt',
    message: 'Sehr gut! Weiter so 👍',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isRead: false,
    type: 'text',
  },
];