// ===== USE AI CHAT HOOK =====
// State management for the AI Learning Assistant
// Mirrors the backend API structure from ai-assistant-concept.md
// v2 – Phase 4: error states, rate limit, loading states
// v3 – Phase 5: chat list, archive, delete, chat selection

import { useState, useCallback, useRef, useLayoutEffect, useEffect } from 'react';

// ===== TYPES (matching API response shapes) =====

export interface AiSuggestedAction {
  type: 'flashcards' | 'exam' | 'summary' | 'explanation';
  topic?: string;
  subject?: string;
  label: string;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedActions?: AiSuggestedAction[];
  metadata?: {
    responseTime?: number;
    tokensUsed?: number;
  };
}

export interface AiChat {
  chatId: string;
  title: string;
  lastMessage: string;
  createdAt: Date;
  status: 'active' | 'archived';
}

// Error types matching API error scenarios
export type AiErrorType = 'network' | 'send_failed' | 'unavailable' | 'rate_limit_minute' | 'rate_limit_day';

export interface AiError {
  type: AiErrorType;
  message: string;
}

// Rate limit response shape: GET /v1/curriculum/chat-assistant/rate-limit/:userId
export interface AiRateLimit {
  perMinute: number;
  perDay: number;
  remainingMinute: number;
  remainingDay: number;
}

export type AiSubject = 'Mathematik' | 'Englisch' | 'Biologie' | 'Chemie' | 'Physik';

export const AI_SUBJECTS: AiSubject[] = ['Mathematik', 'Englisch', 'Biologie', 'Chemie', 'Physik'];

// ===== MOCK RESPONSES =====
// Simulates POST /v1/curriculum/chat-assistant/message

interface MockApiResponse {
  response: string;
  suggestedActions?: AiSuggestedAction[];
  metadata: { responseTime: number; tokensUsed: number };
}

const MOCK_RESPONSES: Record<string, MockApiResponse> = {
  mitternachtsformel: {
    response:
      'Die Mitternachtsformel (auch ABC-Formel) löst quadratische Gleichungen der Form ax² + bx + c = 0.\n\nDie Formel lautet:\nx = (-b ± √(b² - 4ac)) / (2a)\n\nDer Ausdruck unter der Wurzel (b² - 4ac) heißt Diskriminante:\n• D > 0 → zwei verschiedene Lösungen\n• D = 0 → eine doppelte Lösung\n• D < 0 → keine reelle Lösung\n\nBeispiel: x² - 5x + 6 = 0\n→ a=1, b=-5, c=6\n→ x = (5 ± √(25-24)) / 2 = (5 ± 1) / 2\n→ x₁ = 3, x₂ = 2',
    suggestedActions: [
      { type: 'flashcards', topic: 'Quadratische Gleichungen', label: 'Lernkarten zu Quadratischen Gleichungen' },
      { type: 'exam', subject: 'Mathematik', label: 'Prüfungssimulation in Mathematik starten' },
    ],
    metadata: { responseTime: 1840, tokensUsed: 312 },
  },
  schwächsten: {
    response:
      'Basierend auf deinen letzten Lernaktivitäten sehe ich folgende Schwachstellen:\n\n📊 Mathematik – Bruchrechnung: 45% Erfolgsquote\nDu hast Schwierigkeiten beim Kürzen und Erweitern von Brüchen.\n\n📊 Physik – Mechanik: 52% Erfolgsquote\nBesonders bei der Anwendung der Newtonschen Gesetze.\n\n📊 Englisch – Grammatik: 61% Erfolgsquote\nConditional Sentences bereiten dir noch Probleme.\n\nIch empfehle dir, mit Bruchrechnung zu starten – das ist die größte Baustelle.',
    suggestedActions: [
      { type: 'flashcards', topic: 'Bruchrechnung', label: 'Lernkarten zu Bruchrechnung erstellen' },
      { type: 'exam', subject: 'Mathematik', label: 'Mathe-Test zu Brüchen starten' },
    ],
    metadata: { responseTime: 2100, tokensUsed: 428 },
  },
  lernkarten: {
    response:
      'Ich erstelle dir Lernkarten zum Thema Bruchrechnung! 📚\n\nHier sind die wichtigsten Konzepte, die ich abdecken werde:\n\n1. Brüche kürzen und erweitern\n2. Addition und Subtraktion von Brüchen\n3. Multiplikation und Division von Brüchen\n4. Gemischte Zahlen umwandeln\n5. Bruchgleichungen lösen\n\nIch habe 15 Lernkarten vorbereitet. Du kannst sie direkt in deinem Flashcard-Bereich finden.',
    suggestedActions: [
      { type: 'flashcards', topic: 'Bruchrechnung', label: 'Lernkarten jetzt öffnen' },
    ],
    metadata: { responseTime: 3200, tokensUsed: 567 },
  },
  prüfung: {
    response:
      'Klar, ich helfe dir bei der Prüfungsvorbereitung! 🎯\n\nFür deine nächste Mathe-Prüfung schlage ich folgende Strategie vor:\n\n1. **Schwachstellen identifizieren** – Wir schauen uns deine letzten Ergebnisse an\n2. **Gezielte Übungen** – Ich erstelle dir Aufgaben zu deinen Problemthemen\n3. **Probeklausur** – Zum Abschluss eine realistische Prüfungssimulation\n\nWomit möchtest du anfangen?',
    suggestedActions: [
      { type: 'exam', subject: 'Mathematik', label: 'Prüfungssimulation starten' },
      { type: 'flashcards', topic: 'Prüfungsvorbereitung', label: 'Wichtige Formeln wiederholen' },
      { type: 'summary', topic: 'Mathematik Überblick', label: 'Zusammenfassung der Themen' },
    ],
    metadata: { responseTime: 1950, tokensUsed: 389 },
  },
};

const GENERIC_RESPONSES: MockApiResponse[] = [
  {
    response:
      'Das ist eine gute Frage! Lass mich dir dabei helfen.\n\nKannst du mir etwas mehr Kontext geben? Zum Beispiel:\n• Welches Fach betrifft deine Frage?\n• Gibt es ein bestimmtes Thema, das dir Schwierigkeiten macht?\n\nSo kann ich dir eine gezieltere Antwort geben.',
    metadata: { responseTime: 1200, tokensUsed: 178 },
  },
  {
    response:
      'Ich verstehe! Lass mich das für dich aufschlüsseln.\n\nBasierend auf deinem Lernprofil kann ich dir verschiedene Lernmethoden vorschlagen. Möchtest du:\n• Eine ausführliche Erklärung zum Thema?\n• Übungsaufgaben zum Selbsttest?\n• Lernkarten zum Wiederholen?',
    suggestedActions: [
      { type: 'explanation', topic: 'Ausführliche Erklärung', label: 'Erklärung anzeigen' },
      { type: 'flashcards', topic: 'Übungskarten', label: 'Lernkarten erstellen' },
    ],
    metadata: { responseTime: 1650, tokensUsed: 234 },
  },
  {
    response:
      'Gute Idee, sich damit zu beschäftigen! 💡\n\nIch kann dir bei diesem Thema auf verschiedene Arten helfen. Sag mir einfach, was du brauchst – eine Erklärung, Übungsaufgaben oder eine Zusammenfassung.',
    metadata: { responseTime: 980, tokensUsed: 145 },
  },
];

function findMockResponse(message: string): MockApiResponse {
  const lower = message.toLowerCase();
  if (lower.includes('mitternachtsformel') || lower.includes('abc-formel') || lower.includes('quadratisch'))
    return MOCK_RESPONSES.mitternachtsformel;
  if (lower.includes('schwächsten') || lower.includes('schwach') || lower.includes('schwäche'))
    return MOCK_RESPONSES.schwächsten;
  if (lower.includes('lernkarten') || lower.includes('flashcard') || lower.includes('bruchrechnung'))
    return MOCK_RESPONSES.lernkarten;
  if (lower.includes('prüfung') || lower.includes('klausur') || lower.includes('test') || lower.includes('bereite'))
    return MOCK_RESPONSES.prüfung;
  return GENERIC_RESPONSES[Math.floor(Math.random() * GENERIC_RESPONSES.length)];
}

// Mock older messages for "load older messages" (GET /v1/curriculum/chat-assistant/chat/:chatId/history)
const MOCK_OLDER_MESSAGES: AiChatMessage[] = [
  {
    id: 'msg_older_1_user',
    role: 'user',
    content: 'Hallo, kannst du mir bei Mathe helfen?',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'msg_older_2_assistant',
    role: 'assistant',
    content: 'Natürlich! Ich helfe dir gerne bei Mathe. Was genau möchtest du wissen? Ich kann dir bei verschiedenen Themen helfen – von Algebra über Geometrie bis hin zu Analysis.',
    timestamp: new Date(Date.now() - 3590000),
    metadata: { responseTime: 1100, tokensUsed: 156 },
  },
  {
    id: 'msg_older_3_user',
    role: 'user',
    content: 'Ich verstehe lineare Gleichungen nicht so gut.',
    timestamp: new Date(Date.now() - 3500000),
  },
  {
    id: 'msg_older_4_assistant',
    role: 'assistant',
    content: 'Kein Problem! Lineare Gleichungen sind Gleichungen der Form ax + b = c.\n\nDas Ziel ist es, x zu isolieren:\n1. Subtrahiere b von beiden Seiten\n2. Teile durch a\n\nBeispiel: 2x + 3 = 7\n→ 2x = 4\n→ x = 2',
    timestamp: new Date(Date.now() - 3490000),
    suggestedActions: [
      { type: 'flashcards', topic: 'Lineare Gleichungen', label: 'Lernkarten zu linearen Gleichungen' },
    ],
    metadata: { responseTime: 1560, tokensUsed: 210 },
  },
];

// ===== RATE LIMIT DEFAULTS =====
// Mirrors GET /v1/curriculum/chat-assistant/rate-limit/:userId
const RATE_LIMIT_PER_MINUTE = 5;
const RATE_LIMIT_PER_DAY = 100;

// ===== MOCK PAST CHATS =====
// Simulates GET /v1/curriculum/chat-assistant/chats/:userId
// Response: { chatId, title, lastMessage, createdAt, status }
const MOCK_PAST_CHATS: AiChat[] = [
  {
    chatId: 'chat_past_1',
    title: 'Mathematik Hilfe',
    lastMessage: 'Die Mitternachtsformel löst quadratische Gleichungen...',
    createdAt: new Date(Date.now() - 86400000),
    status: 'active',
  },
  {
    chatId: 'chat_past_2',
    title: 'Englisch Grammatik',
    lastMessage: 'Conditional Sentences bestehen aus zwei Teilen...',
    createdAt: new Date(Date.now() - 172800000),
    status: 'active',
  },
  {
    chatId: 'chat_past_3',
    title: 'Prüfungsvorbereitung Biologie',
    lastMessage: 'Für deine Bio-Prüfung empfehle ich folgende Strategie...',
    createdAt: new Date(Date.now() - 345600000),
    status: 'active',
  },
  {
    chatId: 'chat_past_5',
    title: 'Chemie – Periodensystem',
    lastMessage: 'Die Hauptgruppen des Periodensystems ordnen Elemente nach...',
    createdAt: new Date(Date.now() - 432000000),
    status: 'active',
  },
  {
    chatId: 'chat_past_6',
    title: 'Deutsch Erörterung',
    lastMessage: 'Eine Erörterung gliedert sich in Einleitung, Hauptteil und...',
    createdAt: new Date(Date.now() - 518400000),
    status: 'active',
  },
  {
    chatId: 'chat_past_7',
    title: 'Französisch Vokabeln',
    lastMessage: 'Hier sind die wichtigsten Vokabeln für Lektion 5...',
    createdAt: new Date(Date.now() - 604800000),
    status: 'active',
  },
  {
    chatId: 'chat_past_8',
    title: 'Mathe – Integralrechnung',
    lastMessage: 'Das bestimmte Integral berechnet die Fläche unter einer Kurve...',
    createdAt: new Date(Date.now() - 691200000),
    status: 'active',
  },
  {
    chatId: 'chat_past_9',
    title: 'Geschichte – Weimarer Republik',
    lastMessage: 'Die Weimarer Republik wurde 1918 nach dem Ende des...',
    createdAt: new Date(Date.now() - 777600000),
    status: 'active',
  },
  {
    chatId: 'chat_past_10',
    title: 'Physik – Elektrodynamik',
    lastMessage: 'Das Ohmsche Gesetz beschreibt den Zusammenhang zwischen...',
    createdAt: new Date(Date.now() - 864000000),
    status: 'active',
  },
  {
    chatId: 'chat_past_11',
    title: 'Bio – Fotosynthese',
    lastMessage: 'Die Fotosynthese läuft in zwei Phasen ab: Lichtreaktion und...',
    createdAt: new Date(Date.now() - 950400000),
    status: 'active',
  },
  {
    chatId: 'chat_past_12',
    title: 'Englisch – Essay Writing',
    lastMessage: 'A good essay needs a clear thesis statement in the introduction...',
    createdAt: new Date(Date.now() - 1036800000),
    status: 'active',
  },
  {
    chatId: 'chat_past_13',
    title: 'Mathe – Stochastik',
    lastMessage: 'Die bedingte Wahrscheinlichkeit P(A|B) berechnet man mit...',
    createdAt: new Date(Date.now() - 1123200000),
    status: 'active',
  },
  {
    chatId: 'chat_past_14',
    title: 'Latein Übersetzung',
    lastMessage: 'Bei der Übersetzung von Ciceros Reden solltest du auf die...',
    createdAt: new Date(Date.now() - 1209600000),
    status: 'active',
  },
  {
    chatId: 'chat_past_15',
    title: 'Chemie – Redoxreaktionen',
    lastMessage: 'Bei Redoxreaktionen werden Elektronen übertragen. Oxidation...',
    createdAt: new Date(Date.now() - 1296000000),
    status: 'active',
  },
  {
    chatId: 'chat_past_16',
    title: 'Erdkunde – Klimazonen',
    lastMessage: 'Die Erde wird in verschiedene Klimazonen eingeteilt...',
    createdAt: new Date(Date.now() - 1382400000),
    status: 'active',
  },
  {
    chatId: 'chat_past_4',
    title: 'Physik – Mechanik',
    lastMessage: 'Die Newtonschen Gesetze beschreiben die Bewegung...',
    createdAt: new Date(Date.now() - 1468800000),
    status: 'archived',
  },
  {
    chatId: 'chat_past_17',
    title: 'Mathe – Vektoren',
    lastMessage: 'Vektoren sind gerichtete Größen im Raum...',
    createdAt: new Date(Date.now() - 1555200000),
    status: 'archived',
  },
];

// Mock messages for loading a past chat (GET /v1/.../chat/:chatId/history)
const MOCK_PAST_CHAT_MESSAGES: Record<string, AiChatMessage[]> = {
  chat_past_1: [
    { id: 'pc1_1', role: 'user', content: 'Erkläre mir die Mitternachtsformel', timestamp: new Date(Date.now() - 86400000) },
    { id: 'pc1_2', role: 'assistant', content: 'Die Mitternachtsformel (auch ABC-Formel) löst quadratische Gleichungen der Form ax² + bx + c = 0.\n\nx = (-b ± √(b² - 4ac)) / (2a)', timestamp: new Date(Date.now() - 86390000), metadata: { responseTime: 1840, tokensUsed: 312 } },
  ],
  chat_past_2: [
    { id: 'pc2_1', role: 'user', content: 'Was sind Conditional Sentences?', timestamp: new Date(Date.now() - 172800000) },
    { id: 'pc2_2', role: 'assistant', content: 'Conditional Sentences (Bedingungssätze) bestehen aus zwei Teilen:\n\n• If-Clause (Bedingung)\n• Main Clause (Folge)\n\nEs gibt drei Typen:\nType I: reale Bedingung (If + Present → will + Infinitive)\nType II: irreale Bedingung (If + Past → would + Infinitive)\nType III: vergangene irreale Bedingung (If + Past Perfect → would have + Past Participle)', timestamp: new Date(Date.now() - 172790000), metadata: { responseTime: 2100, tokensUsed: 280 }, suggestedActions: [{ type: 'flashcards', topic: 'Conditional Sentences', label: 'Lernkarten zu Conditional Sentences' }] },
  ],
  chat_past_3: [
    { id: 'pc3_1', role: 'user', content: 'Hilf mir bei der Biologie-Prüfung', timestamp: new Date(Date.now() - 345600000) },
    { id: 'pc3_2', role: 'assistant', content: 'Für deine Bio-Prüfung empfehle ich folgende Strategie:\n\n1. Zellbiologie wiederholen\n2. Genetik-Grundlagen festigen\n3. Ökologie-Zusammenhänge verstehen\n\nWomit möchtest du anfangen?', timestamp: new Date(Date.now() - 345590000), metadata: { responseTime: 1500, tokensUsed: 198 }, suggestedActions: [{ type: 'exam', subject: 'Biologie', label: 'Prüfungssimulation starten' }, { type: 'summary', topic: 'Biologie', label: 'Zusammenfassung erstellen' }] },
  ],
};

// ===== HOOK =====

export function useAiChat() {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<AiSubject | null>(null);
  const [error, setError] = useState<AiError | null>(null);

  // Loading states (API: GET /v1/curriculum/chat-assistant/chat/:chatId/history)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  // Rate limit state (API: GET /v1/curriculum/chat-assistant/rate-limit/:userId)
  const [rateLimit, setRateLimit] = useState<AiRateLimit>({
    perMinute: RATE_LIMIT_PER_MINUTE,
    perDay: RATE_LIMIT_PER_DAY,
    remainingMinute: RATE_LIMIT_PER_MINUTE,
    remainingDay: RATE_LIMIT_PER_DAY,
  });

  // Phase 5: Past chats state (API: GET /v1/.../chats/:userId)
  const [pastChats, setPastChats] = useState<AiChat[]>(MOCK_PAST_CHATS);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);

  // Track timestamps for rate limiting
  const minuteTimestampsRef = useRef<number[]>([]);
  const dayCountRef = useRef(0);
  const lastFailedMessageRef = useRef<{ text: string; subject?: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up minute-window timestamps every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      minuteTimestampsRef.current = minuteTimestampsRef.current.filter(t => now - t < 60000);
      setRateLimit(prev => ({
        ...prev,
        remainingMinute: Math.max(0, RATE_LIMIT_PER_MINUTE - minuteTimestampsRef.current.length),
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll on new messages
  useLayoutEffect(() => {
    if (messages.length === 0) return;
    const wasEmpty = prevMessageCountRef.current === 0;
    prevMessageCountRef.current = messages.length;

    if (wasEmpty) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
    } else {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [messages]);

  // Check rate limits before sending
  const checkRateLimit = useCallback((): AiError | null => {
    const now = Date.now();
    // Clean expired timestamps
    minuteTimestampsRef.current = minuteTimestampsRef.current.filter(t => now - t < 60000);

    if (minuteTimestampsRef.current.length >= RATE_LIMIT_PER_MINUTE) {
      return {
        type: 'rate_limit_minute',
        message: 'Du hast dein Nachrichtenlimit für diese Minute erreicht.',
      };
    }
    if (dayCountRef.current >= RATE_LIMIT_PER_DAY) {
      return {
        type: 'rate_limit_day',
        message: `Du hast dein Tageslimit von ${RATE_LIMIT_PER_DAY} Nachrichten erreicht.`,
      };
    }
    return null;
  }, []);

  // Simulate: POST /v1/curriculum/chat-assistant/message
  // Body: { userId, message, chatId?, subject? }
  const sendMessage = useCallback(async (text: string, subject?: string) => {
    if (!text.trim() || isSending) return;

    setError(null);
    lastFailedMessageRef.current = null;

    // Check rate limit
    const rateLimitError = checkRateLimit();
    if (rateLimitError) {
      setError(rateLimitError);
      return;
    }

    // Track rate limit
    minuteTimestampsRef.current.push(Date.now());
    dayCountRef.current += 1;
    setRateLimit(prev => ({
      ...prev,
      remainingMinute: Math.max(0, RATE_LIMIT_PER_MINUTE - minuteTimestampsRef.current.length),
      remainingDay: Math.max(0, RATE_LIMIT_PER_DAY - dayCountRef.current),
    }));

    // Create or reuse chatId
    const currentChatId = chatId || `chat_${Date.now()}`;
    if (!chatId) setChatId(currentChatId);

    // Add user message
    const userMessage: AiChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    // Simulate API delay + typing
    const mockResponse = findMockResponse(text);
    const delay = 800 + Math.random() * 1200;

    // Show typing indicator after a short pause
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(true);
    }, 300);

    try {
      await new Promise(resolve => setTimeout(resolve, delay));

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      // Simulate typing for the response duration
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));
      setIsTyping(false);

      // Add assistant response
      const assistantMessage: AiChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: mockResponse.response,
        timestamp: new Date(),
        suggestedActions: mockResponse.suggestedActions,
        metadata: mockResponse.metadata,
      };
      setMessages(prev => [...prev, assistantMessage]);

      // After first message exchange, simulate hasMore = true for history
      setHasMore(true);
    } catch {
      lastFailedMessageRef.current = { text, subject };
      setError({
        type: 'send_failed',
        message: 'Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.',
      });
      setIsTyping(false);
    } finally {
      setIsSending(false);
    }
  }, [chatId, isSending, checkRateLimit]);

  // Retry last failed message
  const retryLastMessage = useCallback(async () => {
    if (!lastFailedMessageRef.current) return;
    const { text, subject } = lastFailedMessageRef.current;
    // Remove the failed user message (last user message in the list)
    setMessages(prev => {
      const lastUserIdx = [...prev].reverse().findIndex(m => m.role === 'user');
      if (lastUserIdx === -1) return prev;
      const actualIdx = prev.length - 1 - lastUserIdx;
      return [...prev.slice(0, actualIdx), ...prev.slice(actualIdx + 1)];
    });
    setError(null);
    lastFailedMessageRef.current = null;
    await sendMessage(text, subject);
  }, [sendMessage]);

  // Simulate: GET /v1/curriculum/chat-assistant/chat/:chatId/history (load older)
  // Response: { messages, total, hasMore }
  const loadOlderMessages = useCallback(async () => {
    if (isLoadingOlder || !hasMore) return;
    setIsLoadingOlder(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

      setMessages(prev => [...MOCK_OLDER_MESSAGES, ...prev]);
      setHasMore(false); // Only one page of older messages in mock
    } catch {
      setError({
        type: 'network',
        message: 'Ältere Nachrichten konnten nicht geladen werden.',
      });
    } finally {
      setIsLoadingOlder(false);
    }
  }, [isLoadingOlder, hasMore]);

  // Clear chat / start new
  const clearChat = useCallback(() => {
    setMessages([]);
    setChatId(null);
    setError(null);
    setIsTyping(false);
    setIsSending(false);
    setHasMore(false);
    setIsLoadingHistory(false);
    setIsLoadingOlder(false);
    prevMessageCountRef.current = 0;
    lastFailedMessageRef.current = null;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  }, []);

  // Simulate: GET /v1/curriculum/chat-assistant/chat/:chatId/history
  // Load a past chat's messages
  const selectChat = useCallback(async (targetChatId: string) => {
    setIsLoadingHistory(true);
    setError(null);
    // Don't set showChatHistory here – the ChatHistoryPanel handles its own close

    try {
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 600));

      const pastMessages = MOCK_PAST_CHAT_MESSAGES[targetChatId];
      if (pastMessages) {
        setMessages(pastMessages);
        setChatId(targetChatId);
        setHasMore(false);
        prevMessageCountRef.current = 0;
      }
    } catch {
      setError({
        type: 'network',
        message: 'Chat konnte nicht geladen werden.',
      });
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Simulate: PUT /v1/curriculum/chat-assistant/chat/:chatId/archive
  const archiveChat = useCallback(async (targetChatId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));

      setPastChats(prev =>
        prev.map(c =>
          c.chatId === targetChatId ? { ...c, status: 'archived' as const } : c
        )
      );

      // If the archived chat is currently active, clear it
      if (chatId === targetChatId) {
        setMessages([]);
        setChatId(null);
        prevMessageCountRef.current = 0;
      }
    } catch {
      setError({
        type: 'network',
        message: 'Chat konnte nicht archiviert werden.',
      });
    }
  }, [chatId]);

  // Simulate: DELETE /v1/curriculum/chat-assistant/chat/:chatId
  const deleteChat = useCallback(async (targetChatId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));

      setPastChats(prev => prev.filter(c => c.chatId !== targetChatId));

      // If the deleted chat is currently active, clear it
      if (chatId === targetChatId) {
        setMessages([]);
        setChatId(null);
        prevMessageCountRef.current = 0;
      }
    } catch {
      setError({
        type: 'network',
        message: 'Chat konnte nicht gelöscht werden.',
      });
    }
  }, [chatId]);

  // Dismiss error
  const dismissError = useCallback(() => setError(null), []);

  const hasMessages = messages.length > 0;
  const isRateLimited = error?.type === 'rate_limit_minute' || error?.type === 'rate_limit_day';

  return {
    messages,
    chatId,
    isSending,
    isTyping,
    error,
    isRateLimited,
    hasMessages,
    selectedSubject,
    setSelectedSubject,
    messagesEndRef,
    sendMessage,
    clearChat,
    dismissError,
    retryLastMessage,
    // Loading states
    isLoadingHistory,
    hasMore,
    isLoadingOlder,
    loadOlderMessages,
    // Rate limit info
    rateLimit,
    // Past chats
    pastChats,
    isLoadingChats,
    showChatHistory,
    setShowChatHistory,
    selectChat,
    archiveChat,
    deleteChat,
  };
}