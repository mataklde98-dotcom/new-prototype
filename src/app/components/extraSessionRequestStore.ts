// ===== EXTRA-SESSION REQUEST STORE =====
// Lightweight in-memory + localStorage store for extra-session requests that
// a student sends to a teacher from TeacherProfileScreen. chatService reads
// from this store and injects the requests as student chat messages into the
// teacher's chat room.

import { useSyncExternalStore } from 'react';
import type { ChatMessage } from '@/mocks/chatMocks';

export type ExtraSessionRequestStatus =
  | 'pending'       // Anfrage gesendet, wartet auf Lehrer
  | 'approved'      // Lehrer hat zugestimmt
  | 'rescheduled'   // Lehrer hat anderen Termin vorgeschlagen
  | 'declined'      // Lehrer hat abgelehnt
  | 'withdrawn';    // Schüler hat zurückgezogen

export interface ExtraSessionRequest {
  id: string;
  teacherId: string;
  durationMinutes: 45 | 90;
  date: string; // ISO date (YYYY-MM-DD)
  time: string; // HH:MM
  note?: string;
  createdAt: number;
  status: ExtraSessionRequestStatus;
  /** Teacher's proposed alternate date when status === 'rescheduled'. */
  rescheduledDate?: string;
  /** Teacher's proposed alternate time when status === 'rescheduled'. */
  rescheduledTime?: string;
  /** Optional teacher note attached to the status change. */
  teacherNote?: string;
}

const STORAGE_KEY = 'extraSessionRequests.v1';

type Listener = () => void;

function loadFromStorage(): ExtraSessionRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Backwards-compat migration: requests stored before status field.
    return parsed.map((r) => ({ ...r, status: (r?.status as ExtraSessionRequestStatus) ?? 'pending' }));
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
    return this.requests;
  }

  getForTeacher(teacherId: string): ExtraSessionRequest[] {
    return this.requests.filter((r) => r.teacherId === teacherId);
  }

  getById(id: string): ExtraSessionRequest | undefined {
    return this.requests.find((r) => r.id === id);
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
      status: 'pending',
    };
    this.requests = [...this.requests, request];
    saveToStorage(this.requests);
    this.notify();
    this.scheduleSimulatedTeacherResponse(request.id);
    return request;
  }

  private updateRecord(id: string, patch: Partial<ExtraSessionRequest>): void {
    let changed = false;
    this.requests = this.requests.map((r) => {
      if (r.id !== id) return r;
      changed = true;
      return { ...r, ...patch };
    });
    if (changed) {
      saveToStorage(this.requests);
      this.notify();
    }
  }

  /** Student withdraws a still-pending request. No-op if already resolved. */
  withdrawRequest(id: string): void {
    const rec = this.requests.find((r) => r.id === id);
    if (!rec || rec.status !== 'pending') return;
    this.updateRecord(id, { status: 'withdrawn' });
  }

  /** Teacher-side transitions — exposed for completeness / admin tooling. */
  approveRequest(id: string, teacherNote?: string): void {
    this.updateRecord(id, { status: 'approved', teacherNote });
  }

  rescheduleRequest(id: string, newDate: string, newTime: string, teacherNote?: string): void {
    this.updateRecord(id, {
      status: 'rescheduled',
      rescheduledDate: newDate,
      rescheduledTime: newTime,
      teacherNote,
    });
  }

  declineRequest(id: string, teacherNote?: string): void {
    this.updateRecord(id, { status: 'declined', teacherNote });
  }

  /**
   * Prototype only — after 12–18s, randomly transition a pending request
   * so the demo feels alive without a real teacher backend. Skips the
   * transition if the student withdraws or the status is otherwise set.
   */
  private scheduleSimulatedTeacherResponse(id: string): void {
    if (typeof window === 'undefined') return;
    const delay = 12000 + Math.random() * 6000;
    setTimeout(() => {
      const rec = this.requests.find((r) => r.id === id);
      if (!rec || rec.status !== 'pending') return;
      const roll = Math.random();
      if (roll < 0.6) {
        this.updateRecord(id, {
          status: 'approved',
          teacherNote: 'Passt — freu mich auf dich.',
        });
      } else if (roll < 0.9) {
        const [h, m] = rec.time.split(':');
        const newH = String(Math.min(21, parseInt(h, 10) + 1)).padStart(2, '0');
        this.updateRecord(id, {
          status: 'rescheduled',
          rescheduledDate: rec.date,
          rescheduledTime: `${newH}:${m}`,
          teacherNote: 'Dieser Zeitpunkt passt mir leider nicht — wie wäre es eine Stunde später?',
        });
      } else {
        this.updateRecord(id, {
          status: 'declined',
          teacherNote: 'Sorry, an diesem Tag bin ich verhindert.',
        });
      }
    }, delay);
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
    message: lines.join('\n'), // fallback text if the client can't render the card
    timestamp: new Date(request.createdAt),
    isRead: true,
    type: 'extra-session-request',
    extraSessionRequestId: request.id,
  };
}

/** Reactive lookup hook — re-renders consumers on status changes. */
export function useExtraSessionRequest(id?: string): ExtraSessionRequest | undefined {
  const all = useSyncExternalStore(
    (listener) => extraSessionRequestStore.subscribe(listener),
    () => extraSessionRequestStore.getAll(),
  );
  if (!id) return undefined;
  return all.find((r) => r.id === id);
}
