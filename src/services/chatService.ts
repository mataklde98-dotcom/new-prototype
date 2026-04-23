// ===== CHAT SERVICE =====
// Service Layer für Chat-Operationen (1:1 + Gruppenchat)

import type { ChatMessage, ChatRoom, ChatAttachment } from '@/mocks/chatMocks';
import {
  mockChatRooms,
  mockChatMessages,
  mockGroupMessages,
} from '@/mocks/chatMocks';
import { extraSessionRequestStore, requestToChatMessage } from '@/app/components/extraSessionRequestStore';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type ReactionsPatch = Record<string, { emoji: string; memberIds: string[] }[]>;

/**
 * In-memory reaction overrides (room -> message -> reactions).
 * This lets the UI toggle reactions without mutating the mocks and works
 * for both 1:1 and group rooms.
 */
class ReactionStore {
  private byRoom = new Map<string, Map<string, { emoji: string; memberIds: string[] }[]>>();
  private listeners = new Set<() => void>();

  get(roomId: string, messageId: string) {
    return this.byRoom.get(roomId)?.get(messageId);
  }

  getRoomPatch(roomId: string): ReactionsPatch {
    const map = this.byRoom.get(roomId);
    if (!map) return {};
    const out: ReactionsPatch = {};
    map.forEach((v, k) => (out[k] = v));
    return out;
  }

  toggle(
    roomId: string,
    messageId: string,
    emoji: string,
    memberId: string,
    seedReactions?: { emoji: string; memberIds: string[] }[],
  ): void {
    let roomMap = this.byRoom.get(roomId);
    if (!roomMap) {
      roomMap = new Map();
      this.byRoom.set(roomId, roomMap);
    }
    let current = roomMap.get(messageId);
    // First-time toggle on a message with seeded reactions → clone the seed
    // so we don't wipe pre-existing reactions when the user adds theirs.
    if (!current && seedReactions && seedReactions.length > 0) {
      current = seedReactions.map((r) => ({ emoji: r.emoji, memberIds: [...r.memberIds] }));
      roomMap.set(messageId, current);
    }
    const list = current ? current.map((r) => ({ ...r, memberIds: [...r.memberIds] })) : [];
    const existingIdx = list.findIndex((r) => r.emoji === emoji);
    if (existingIdx >= 0) {
      const entry = list[existingIdx];
      const hasMine = entry.memberIds.includes(memberId);
      if (hasMine) {
        entry.memberIds = entry.memberIds.filter((m) => m !== memberId);
        if (entry.memberIds.length === 0) list.splice(existingIdx, 1);
      } else {
        entry.memberIds = [...entry.memberIds, memberId];
      }
    } else {
      list.push({ emoji, memberIds: [memberId] });
    }
    roomMap.set(messageId, list);
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => {
      try { l(); } catch { /* ignore */ }
    });
  }
}

export const reactionStore = new ReactionStore();

function applyReactionOverrides(roomId: string, msgs: ChatMessage[]): ChatMessage[] {
  const patch = reactionStore.getRoomPatch(roomId);
  if (Object.keys(patch).length === 0) return msgs;
  return msgs.map((m) => {
    const r = patch[m.id];
    if (!r) return m;
    return { ...m, reactions: r };
  });
}

class ChatService {
  async getChatRooms(): Promise<ChatRoom[]> {
    await delay(100);
    return [...mockChatRooms];
  }

  /**
   * Get messages for a specific chat room.
   * - Group rooms: returns room-scoped mock conversation.
   * - 1:1 teacher rooms: returns the shared prototype thread.
   * Extra-session requests sent from the TeacherProfile are injected as cards
   * on the teacher's 1:1 room.
   */
  async getMessages(roomId: string): Promise<ChatMessage[]> {
    await delay(150);

    const isGroup = roomId.startsWith('g');
    let base: ChatMessage[];
    if (isGroup) {
      base = [...(mockGroupMessages[roomId] ?? [])];
    } else {
      const extraRequests = extraSessionRequestStore
        .getForTeacher(roomId)
        .map(requestToChatMessage);
      base = [...mockChatMessages, ...extraRequests];
    }

    base = applyReactionOverrides(roomId, base);
    base.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return base;
  }

  async sendMessage(
    roomId: string,
    message: string,
    type: 'text' | 'voice' | 'image' = 'text',
    attachments?: ChatAttachment[],
  ): Promise<ChatMessage> {
    await delay(220);
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
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

  async markAsRead(messageIds: string[]): Promise<void> {
    await delay(80);
    console.log('Messages marked as read:', messageIds);
  }

  async simulateTyping(_roomId: string, isTyping: boolean): Promise<void> {
    await delay(40);
    console.log('Teacher typing status:', isTyping);
  }

  async getUnreadCount(roomId: string): Promise<number> {
    await delay(40);
    const room = mockChatRooms.find((r) => r.id === roomId);
    return room?.unreadCount || 0;
  }

  /** Toggle a reaction by the current user (memberId === 'student').
   *  `seedReactions` primes the store on first-touch so mock-seeded reactions
   *  aren't wiped when the user adds their own. */
  toggleReaction(
    roomId: string,
    messageId: string,
    emoji: string,
    memberId = 'student',
    seedReactions?: { emoji: string; memberIds: string[] }[],
  ): void {
    reactionStore.toggle(roomId, messageId, emoji, memberId, seedReactions);
  }
}

export const chatService = new ChatService();
