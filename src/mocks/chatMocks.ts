// ===== CHAT MOCKS =====
// Mock-Daten für Chat: 1:1 Lehrer ↔ Schüler UND Gruppenchats

export type ChatParticipantRole = 'teacher' | 'student' | 'self';

export interface ChatMember {
  id: string;
  name: string;
  role: Exclude<ChatParticipantRole, 'self'>; // 'teacher' | 'student'
  avatar: string;
  isOnline: boolean;
  /** When present, marks this member as the current user ("Du"). */
  isSelf?: boolean;
}

export interface ChatReaction {
  /** Emoji character (e.g. "❤️"). */
  emoji: string;
  /** Member IDs who reacted with this emoji. 'student' === self in mocks. */
  memberIds: string[];
}

export interface ChatMessage {
  id: string;
  /**
   * 'student' === current user ("Du"). 'teacher' is used in 1:1 mocks.
   * In group chats we also see specific member IDs (e.g. "m2"). The
   * UI treats anything that is not === 'student' as an incoming message.
   */
  senderId: string;
  senderName: string;
  /** Used by group chats for avatar + sender badge. Optional for 1:1. */
  senderAvatar?: string;
  /** Display role pill next to the name in group chats. */
  senderRole?: 'teacher' | 'student';
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'voice' | 'image' | 'extra-session-request';
  duration?: number;
  attachments?: ChatAttachment[];
  extraSessionRequestId?: string;
  /** WhatsApp-style emoji reactions. */
  reactions?: ChatReaction[];
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'video' | 'document';
  name: string;
  size: string;
  url?: string;
  thumbnail?: string;
}

export type ChatRoomKind = 'teacher' | 'group';

export interface ChatRoom {
  id: string;
  kind: ChatRoomKind;
  /** Teacher 1:1 display name — unused for group rooms. */
  participantName: string;
  /** Always 'teacher' for 1:1. For groups we keep it but don't render it. */
  participantRole: 'teacher';
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  isTyping: boolean;
  subject?: string;

  // ===== Group-only fields =====
  /** Display name shown in the chat list and header for group rooms. */
  groupName?: string;
  /** Optional subject-/context line used under the group name on the list. */
  groupSubtitle?: string;
  /** All members, including the current user (isSelf === true). */
  members?: ChatMember[];
  /** Author of the last message (for prefixing "Max: …" in list previews). */
  lastMessageSenderName?: string;
}

// ===== 1:1 TEACHER ROOMS =====
export const mockTeacherRooms: ChatRoom[] = [
  {
    id: '1',
    kind: 'teacher',
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
    kind: 'teacher',
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
    kind: 'teacher',
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
    kind: 'teacher',
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
    kind: 'teacher',
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

// ===== GROUP ROOMS =====
// Member ID 'student' always represents the current user ("Du") so that the
// existing 1:1 senderId === 'student' logic keeps working in group bubbles.

const groupAMembers: ChatMember[] = [
  { id: 'dr-schmidt', name: 'Dr. Schmidt', role: 'teacher', avatar: 'https://i.pravatar.cc/150?img=12', isOnline: true },
  { id: 'student',    name: 'Du',           role: 'student', avatar: 'https://i.pravatar.cc/150?img=68', isOnline: true, isSelf: true },
  { id: 'lina',       name: 'Lina M.',      role: 'student', avatar: 'https://i.pravatar.cc/150?img=45', isOnline: true },
  { id: 'jonas',      name: 'Jonas K.',     role: 'student', avatar: 'https://i.pravatar.cc/150?img=15', isOnline: true },
  { id: 'mia',        name: 'Mia R.',       role: 'student', avatar: 'https://i.pravatar.cc/150?img=49', isOnline: false },
  { id: 'tim',        name: 'Tim S.',       role: 'student', avatar: 'https://i.pravatar.cc/150?img=11', isOnline: false },
];

const groupBMembers: ChatMember[] = [
  { id: 'prof-mueller', name: 'Prof. Müller', role: 'teacher', avatar: 'https://i.pravatar.cc/150?img=33', isOnline: false },
  { id: 'student',      name: 'Du',            role: 'student', avatar: 'https://i.pravatar.cc/150?img=68', isOnline: true, isSelf: true },
  { id: 'anna',         name: 'Anna L.',       role: 'student', avatar: 'https://i.pravatar.cc/150?img=25', isOnline: true },
  { id: 'paul',         name: 'Paul W.',       role: 'student', avatar: 'https://i.pravatar.cc/150?img=8',  isOnline: true },
  { id: 'sofia',        name: 'Sofia B.',      role: 'student', avatar: 'https://i.pravatar.cc/150?img=27', isOnline: false },
];

const groupCMembers: ChatMember[] = [
  { id: 'fr-hoffmann', name: 'Fr. Hoffmann', role: 'teacher', avatar: 'https://i.pravatar.cc/150?img=47', isOnline: true },
  { id: 'student',     name: 'Du',            role: 'student', avatar: 'https://i.pravatar.cc/150?img=68', isOnline: true, isSelf: true },
  { id: 'emma',        name: 'Emma T.',       role: 'student', avatar: 'https://i.pravatar.cc/150?img=41', isOnline: true },
  { id: 'noah',        name: 'Noah B.',       role: 'student', avatar: 'https://i.pravatar.cc/150?img=52', isOnline: false },
  { id: 'leni',        name: 'Leni F.',       role: 'student', avatar: 'https://i.pravatar.cc/150?img=43', isOnline: true },
];

export const mockGroupRooms: ChatRoom[] = [
  {
    id: 'g1',
    kind: 'group',
    participantName: 'Physik Lerngruppe 11b',
    participantRole: 'teacher',
    participantAvatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'Lina: Hab den Aufgaben-Screenshot gleich da 📸',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 2),
    unreadCount: 4,
    isOnline: true,
    isTyping: false,
    subject: 'Physik',
    groupName: 'Physik Lerngruppe 11b',
    groupSubtitle: 'Klausurvorbereitung Mechanik',
    members: groupAMembers,
    lastMessageSenderName: 'Lina',
  },
  {
    id: 'g2',
    kind: 'group',
    participantName: 'Mathe Abi-Crew',
    participantRole: 'teacher',
    participantAvatar: 'https://i.pravatar.cc/150?img=33',
    lastMessage: 'Paul: ich häng bei Aufgabe 3b fest 😅',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 38),
    unreadCount: 2,
    isOnline: false,
    isTyping: false,
    subject: 'Mathematik',
    groupName: 'Mathe Abi-Crew',
    groupSubtitle: 'Analysis · Integralrechnung',
    members: groupBMembers,
    lastMessageSenderName: 'Paul',
  },
  {
    id: 'g3',
    kind: 'group',
    participantName: 'Englisch Speaking Club',
    participantRole: 'teacher',
    participantAvatar: 'https://i.pravatar.cc/150?img=47',
    lastMessage: 'Fr. Hoffmann: Nicht vergessen — Dienstag 17:00 🙌',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 6),
    unreadCount: 0,
    isOnline: true,
    isTyping: false,
    subject: 'Englisch',
    groupName: 'Englisch Speaking Club',
    groupSubtitle: 'Wöchentliche Session',
    members: groupCMembers,
    lastMessageSenderName: 'Fr. Hoffmann',
  },
];

export const mockChatRooms: ChatRoom[] = [
  ...mockTeacherRooms,
  ...mockGroupRooms,
];

// ===== 1:1 MESSAGES (Dr. Schmidt — also re-used by other teacher rooms as a
// prototype default when no room-specific mocks exist) =====
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

// ===== GROUP MESSAGES =====
// Key: room id. Each message carries senderId (member id) + senderName + senderRole
// so the bubble can show who wrote what.

function memberById(members: ChatMember[], id: string): ChatMember | undefined {
  return members.find((m) => m.id === id);
}

function groupMsg(
  id: string,
  members: ChatMember[],
  senderId: string,
  message: string,
  minutesAgo: number,
  extras: Partial<ChatMessage> = {},
): ChatMessage {
  const m = memberById(members, senderId);
  const senderIsSelf = senderId === 'student';
  return {
    id,
    senderId: senderIsSelf ? 'student' : senderId,
    senderName: senderIsSelf ? 'Du' : m?.name ?? senderId,
    senderAvatar: m?.avatar,
    senderRole: m?.role,
    message,
    timestamp: new Date(Date.now() - 1000 * 60 * minutesAgo),
    isRead: true,
    type: 'text',
    ...extras,
  };
}

export const mockGroupMessages: Record<string, ChatMessage[]> = {
  g1: [
    groupMsg('g1-1', groupAMembers, 'dr-schmidt',
      'Moin zusammen 👋 Morgen fokussieren wir uns auf Kinematik. Bitte bringt eure Übungsblätter mit.', 240),
    groupMsg('g1-2', groupAMembers, 'lina',
      'Alles klar! Ich bin aktuell bei Aufgabe 4 — die mit der schiefen Ebene. Die Zerlegung der Gewichtskraft verwirrt mich noch.', 220),
    groupMsg('g1-3', groupAMembers, 'jonas',
      'Same hier 😅 ich mach mir gleich mal eine Skizze und lade die hoch.', 215),
    groupMsg('g1-4', groupAMembers, 'mia',
      'Ich hab die 4 schon, kann sie später teilen falls es jemandem hilft.', 210,
      { reactions: [{ emoji: '🙏', memberIds: ['lina', 'jonas'] }] }),
    groupMsg('g1-5', groupAMembers, 'student',
      'Top, wäre mega. Bei 5 hab ich eine Verständnisfrage — darf ich die gleich hier reinwerfen?', 200),
    groupMsg('g1-6', groupAMembers, 'dr-schmidt',
      'Immer raus damit, genau dafür ist die Gruppe da.', 195),
    groupMsg('g1-7', groupAMembers, 'student',
      'Warum rechnet man beim Reibungskoeffizienten nur mit der Normalkraft und nicht mit der Gesamtgewichtskraft?', 190),
    groupMsg('g1-8', groupAMembers, 'tim',
      'Weil nur die Komponente senkrecht zur Fläche drückt — parallel passiert nichts gegen die Reibung.', 186),
    groupMsg('g1-9', groupAMembers, 'dr-schmidt',
      'Genau, Tim 👌 F_R = μ · F_N, und F_N = m · g · cos(α) auf der schiefen Ebene.', 183,
      { reactions: [{ emoji: '❤️', memberIds: ['student', 'lina'] }, { emoji: '👍', memberIds: ['jonas', 'mia', 'tim'] }] }),
    groupMsg('g1-10', groupAMembers, 'lina',
      'Aaaah jetzt macht es Klick. Danke euch! 🙌', 175),
    groupMsg('g1-11', groupAMembers, 'jonas',
      'Hier die Skizze, falls jemand den Kräfteplan vergleichen will:', 90,
      {
        attachments: [
          { id: 'g1-att-1', type: 'image', name: 'kraefteplan.jpg', size: '420 KB', url: 'https://picsum.photos/seed/kraefte/500/320' },
        ],
        reactions: [{ emoji: '👍', memberIds: ['student', 'lina', 'mia'] }],
      }),
    groupMsg('g1-12', groupAMembers, 'mia',
      'Perfekt, genau so sieht meiner auch aus.', 80),
    groupMsg('g1-13', groupAMembers, 'student',
      'Kurze Frage an alle — macht ihr morgen die Probeklausur zusammen vorher, so 16:00?', 55),
    groupMsg('g1-14', groupAMembers, 'tim',
      'Ich bin dabei 💪', 50),
    groupMsg('g1-15', groupAMembers, 'lina',
      'Ich auch! Hab den Aufgaben-Screenshot gleich da 📸', 2),
  ],

  g2: [
    groupMsg('g2-1', groupBMembers, 'prof-mueller',
      'Zur Erinnerung: Klausur-Thema sind Stammfunktionen + bestimmtes Integral. Übungsheft S. 84–91.', 420),
    groupMsg('g2-2', groupBMembers, 'anna',
      'Hab die 85 durch — wollt ihr die Zwischenschritte sehen?', 380),
    groupMsg('g2-3', groupBMembers, 'student',
      'Gerne! Ich häng bei der partiellen Integration.', 370),
    groupMsg('g2-4', groupBMembers, 'anna',
      'Trick: immer das ableiten, was beim Ableiten einfacher wird. ln(x) → 1/x.', 365,
      { reactions: [{ emoji: '🙏', memberIds: ['student'] }] }),
    groupMsg('g2-5', groupBMembers, 'sofia',
      'Ich mach mal die 88 — falls einer die hat, können wir vergleichen?', 300),
    groupMsg('g2-6', groupBMembers, 'prof-mueller',
      'Sehr gut, vergleichen ist der schnellste Lernweg. Ich schaue in 30 Min hier wieder rein.', 295),
    groupMsg('g2-7', groupBMembers, 'student',
      'Bei 3b setze ich u = x² und bekomme trotzdem nicht die richtige Stammfunktion 😬', 60),
    groupMsg('g2-8', groupBMembers, 'paul',
      'Kannst du dein Zwischenergebnis schicken? Dann check ich kurz mit.', 52),
    groupMsg('g2-9', groupBMembers, 'paul',
      'ich häng bei Aufgabe 3b fest 😅', 38),
  ],

  g3: [
    groupMsg('g3-1', groupCMembers, 'fr-hoffmann',
      'Hi team! This week we focus on conditional sentences (type II + III).', 1080),
    groupMsg('g3-2', groupCMembers, 'emma',
      'If I had more time, I would definitely join every session 😅', 1050),
    groupMsg('g3-3', groupCMembers, 'noah',
      'Lol same. Fr. Hoffmann, do we have a handout?', 1040),
    groupMsg('g3-4', groupCMembers, 'fr-hoffmann',
      'Ja — ich lade es heute Abend hoch. Bitte durchlesen vor Dienstag.', 1035,
      { reactions: [{ emoji: '👍', memberIds: ['emma', 'leni', 'student'] }] }),
    groupMsg('g3-5', groupCMembers, 'leni',
      'Dienstag 17:00 wie immer, richtig?', 900),
    groupMsg('g3-6', groupCMembers, 'student',
      'Ja, so hatten wir es letzte Woche geplant.', 880),
    groupMsg('g3-7', groupCMembers, 'fr-hoffmann',
      'Nicht vergessen — Dienstag 17:00 🙌', 360),
  ],
};
