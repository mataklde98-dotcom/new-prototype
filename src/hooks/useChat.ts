// ===== USE CHAT HOOK =====
// React Hook für Chat State Management

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { chatService } from '@/services/chatService';
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

      // Simulate teacher response after a delay (for demo purposes)
      if (Math.random() > 0.5) {
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

  // Scroll to bottom of messages – returns the fn, component decides when to call
  const scrollToBottom = useCallback((instant?: boolean) => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView(
      { behavior: instant ? ('instant' as ScrollBehavior) : 'smooth' }
    );
  }, []);

  // Auto-scroll on new messages
  // useLayoutEffect fires BEFORE the browser paints → no visible jump
  useLayoutEffect(() => {
    if (messages.length === 0) return;
    const wasEmpty = prevMessageCountRef.current === 0;
    prevMessageCountRef.current = messages.length;

    if (wasEmpty) {
      // Initial load → instant scroll before paint, user never sees top
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
    } else {
      // New message → smooth scroll (use rAF so it doesn't block)
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
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