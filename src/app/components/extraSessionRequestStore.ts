// ===== EXTRA-SESSION REQUEST STORE =====
// Lightweight in-memory + localStorage store for extra-session requests that
// a student sends to a teacher from TeacherProfileScreen. chatService reads
// from this store and injects the requests as student chat messages into the
// teacher's chat room.

import type { ChatMessage } from '@/mocks/chatMocks';

export interface ExtraSessionRequest {
  id: string;
  teacherId: string;
  durationMinutes: 45 | 90;
  date: string; // ISO date (YYYY-MM-DD)
  time: string; // HH:MM
  note?: string;
  createdAt: number;
}

const STORAGE_KEY = 'extraSessionRequests.v1';

type Listener = () => void;

function loadFromStorage(): ExtraSessionRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(requests: ExtraSessionRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // ignore quota errors
  }
}

class ExtraSessionRequestStore {
  private requests: ExtraSessionRequest[] = loadFromStorage();
  private listeners: Set<Listener> = new Set();

  getAll(): ExtraSessionRequest[] {
    return [...this.requests];
  }

  getForTeacher(teacherId: string): ExtraSessionRequest[] {
    return this.requests.filter((r) => r.teacherId === teacherId);
  }

  addRequest(input: {
    teacherId: string;
    durationMinutes: 45 | 90;
    date: string;
    time: string;
    note?: string;
  }): ExtraSessionRequest {
    const request: ExtraSessionRequest = {
      id: `esr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      teacherId: input.teacherId,
      durationMinutes: input.durationMinutes,
      date: input.date,
      time: input.time,
      note: input.note,
      createdAt: Date.now(),
    };
    this.requests = [...this.requests, request];
    saveToStorage(this.requests);
    this.notify();
    return request;
  }

  remove(id: string): void {
    this.requests = this.requests.filter((r) => r.id !== id);
    saveToStorage(this.requests);
    this.notify();
  }

  clear(): void {
    this.requests = [];
    saveToStorage(this.requests);
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch {
        // ignore listener errors
      }
    });
  }
}

export const extraSessionRequestStore = new ExtraSessionRequestStore();

/**
 * Formats a request into a ChatMessage so chatService can inject it into the
 * teacher's chat room alongside regular messages.
 */
export function requestToChatMessage(request: ExtraSessionRequest): ChatMessage {
  const dateLabel = (() => {
    try {
      const [y, m, d] = request.date.split('-').map(Number);
      const dt = new Date(y, (m || 1) - 1, d || 1);
      return dt.toLocaleDateString('de-DE', {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
      });
    } catch {
      return request.date;
    }
  })();

  const lines = [
    `Hey, ich würde gerne eine Extra-Stunde buchen (${request.durationMinutes} Min).`,
    `Termin: ${dateLabel} um ${request.time} Uhr.`,
  ];
  if (request.note && request.note.trim().length > 0) {
    lines.push(`Anmerkung: ${request.note.trim()}`);
  }

  return {
    id: `extra-req-${request.id}`,
    senderId: 'student',
    senderName: 'Du',
    message: lines.join('\n'),
    timestamp: new Date(request.createdAt),
    isRead: true,
    type: 'text',
  };
}
