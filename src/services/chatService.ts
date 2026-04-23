// ===== CHAT SERVICE =====
// Service Layer für Chat-Operationen

import type { ChatMessage, ChatRoom, ChatAttachment } from '@/mocks/chatMocks';
import { mockChatRooms, mockChatMessages } from '@/mocks/chatMocks';
import { extraSessionRequestStore, requestToChatMessage } from '@/app/components/extraSessionRequestStore';

// Simulated delay for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ChatService {
  // Get all chat rooms
  async getChatRooms(): Promise<ChatRoom[]> {
    await delay(100);
    return [...mockChatRooms];
  }

  // Get messages for a specific chat room
  async getMessages(roomId: string): Promise<ChatMessage[]> {
    await delay(200);
    // Mock messages are prototype-shared across rooms. Extra-session requests
    // sent from the TeacherProfile are persisted per-room and injected here.
    const extraRequests = extraSessionRequestStore
      .getForTeacher(roomId)
      .map(requestToChatMessage);
    const combined = [...mockChatMessages, ...extraRequests];
    combined.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return combined;
  }

  // Send a new message
  async sendMessage(
    roomId: string,
    message: string,
    type: 'text' | 'voice' | 'image' = 'text',
    attachments?: ChatAttachment[]
  ): Promise<ChatMessage> {
    await delay(300);

    const newMessage: ChatMessage = {
      id: `${Date.now()}`,
      senderId: 'student',
      senderName: 'Du',
      message,
      timestamp: new Date(),
      isRead: false,
      type,
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
    };

    return newMessage;
  }

  // Mark messages as read
  async markAsRead(messageIds: string[]): Promise<void> {
    await delay(100);
    // In a real app, update backend
    console.log('Messages marked as read:', messageIds);
  }

  // Simulate teacher typing
  async simulateTyping(roomId: string, isTyping: boolean): Promise<void> {
    await delay(50);
    console.log('Teacher typing status:', isTyping);
  }

  // Get unread message count
  async getUnreadCount(roomId: string): Promise<number> {
    await delay(50);
    const room = mockChatRooms.find(r => r.id === roomId);
    return room?.unreadCount || 0;
  }
}

export const chatService = new ChatService();