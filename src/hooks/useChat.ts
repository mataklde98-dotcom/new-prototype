// ===== USE CHAT HOOK =====
// React Hook für Chat State Management

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { chatService, reactionStore } from '@/services/chatService';
import type { ChatMessage, ChatRoom, ChatAttachment } from '@/mocks/chatMocks';

export function useChat(roomId?: string) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(0);

  // Load chat rooms
  const loadChatRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      const rooms = await chatService.getChatRooms();
      setChatRooms(rooms);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load messages for a specific room
  const loadMessages = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const msgs = await chatService.getMessages(id);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (
    text: string,
    type: 'text' | 'voice' | 'image' = 'text',
    attachments?: ChatAttachment[]
  ) => {
    if (!roomId || (!text.trim() && (!attachments || attachments.length === 0))) return;

    try {
      setIsSending(true);
      const newMessage = await chatService.sendMessage(roomId, text, type, attachments);
      setMessages(prev => [...prev, newMessage]);

      // Simulate teacher response after a delay (for demo purposes).
      // Skipped for group rooms — group replies stay deterministic via mocks.
      const isGroup = roomId.startsWith('g');
      if (!isGroup && Math.random() > 0.5) {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            const teacherResponse: ChatMessage = {
              id: `${Date.now()}-teacher`,
              senderId: 'teacher',
              senderName: 'Dr. Schmidt',
              message: getRandomTeacherResponse(),
              timestamp: new Date(),
              isRead: false,
              type: 'text',
            };
            setMessages(prev => [...prev, teacherResponse]);
            setIsTyping(false);
          }, 2000);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  }, [roomId]);

  // Mark messages as read
  const markAsRead = useCallback(async (messageIds: string[]) => {
    try {
      await chatService.markAsRead(messageIds);
      setMessages(prev =>
        prev.map(msg =>
          messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, []);

  // Mark a room's unread count as 0
  const clearUnread = useCallback((targetRoomId: string) => {
    setChatRooms(prev =>
      prev.map(room =>
        room.id === targetRoomId ? { ...room, unreadCount: 0 } : room
      )
    );
  }, []);

  // Toggle a reaction on a message (optimistic + subscription-driven refresh).
  // Pass the current message's reactions as seed so mock-seeded reactions
  // survive a user's first toggle on that message.
  const toggleReaction = useCallback((messageId: string, emoji: string) => {
    if (!roomId) return;
    const msg = messages.find((m) => m.id === messageId);
    chatService.toggleReaction(roomId, messageId, emoji, 'student', msg?.reactions);
  }, [roomId, messages]);

  // Refresh messages when reactions change so seeded reactions stay intact
  // and newly added/removed ones appear live.
  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = reactionStore.subscribe(() => {
      chatService.getMessages(roomId).then(setMessages).catch(() => {});
    });
    return unsubscribe;
  }, [roomId]);

  // Scroll to bottom of messages – returns the fn, component decides when to call
  const scrollToBottom = useCallback((instant?: boolean) => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView(
      { behavior: instant ? ('instant' as ScrollBehavior) : 'smooth' }
    );
  }, []);

  // Auto-scroll ONLY when message count grows (new message arrived).
  // Reaction updates also replace the messages array, so we must not scroll
  // on every array change — that's what caused the chat to jump to bottom
  // every time a user reacted to a message.
  useLayoutEffect(() => {
    if (messages.length === 0) return;
    const prev = prevMessageCountRef.current;
    const curr = messages.length;
    prevMessageCountRef.current = curr;

    if (prev === 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
    } else if (curr > prev) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
    // Same count → likely a reaction refresh; do NOT scroll.
  }, [messages]);

  // Load initial data
  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  // Load messages when roomId changes
  useEffect(() => {
    if (roomId) {
      prevMessageCountRef.current = 0;
      loadMessages(roomId);
    }
  }, [roomId, loadMessages]);

  return {
    chatRooms,
    messages,
    isLoading,
    isSending,
    isTyping,
    messagesEndRef,
    loadChatRooms,
    loadMessages,
    sendMessage,
    markAsRead,
    clearUnread,
    toggleReaction,
    scrollToBottom,
  };
}

// Helper: Random teacher responses for demo
function getRandomTeacherResponse(): string {
  const responses = [
    'Sehr gute Frage! 👍',
    'Das ist richtig!',
    'Genau so ist es! Weiter so! 🎯',
    'Ich kann dir da gerne weiterhelfen.',
    'Hast du noch weitere Fragen?',
    'Perfekt! Du bist auf dem richtigen Weg! ✨',
    'Das hast du gut erklärt!',
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}