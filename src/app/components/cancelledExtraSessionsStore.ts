// ===== CANCELLED EXTRA SESSIONS STORE =====
// Shared state for cancelled extra-session IDs.
// Consumers (Home carousel, All-Sessions sheet, Meetings screen) filter these out.

type Listener = () => void;

const cancelled: Set<string> = new Set();
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach((fn) => fn());
}

export const cancelledExtraSessionsStore = {
  isCancelled(id: string): boolean {
    return cancelled.has(id);
  },
  cancel(id: string) {
    if (cancelled.has(id)) return;
    cancelled.add(id);
    notify();
  },
  restore(id: string) {
    if (!cancelled.has(id)) return;
    cancelled.delete(id);
    notify();
  },
  getAll(): string[] {
    return Array.from(cancelled);
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

// React hook convenience
import { useEffect, useState } from 'react';

export function useCancelledExtraSessions(): Set<string> {
  const [, setTick] = useState(0);
  useEffect(() => {
    return cancelledExtraSessionsStore.subscribe(() => setTick((t) => t + 1));
  }, []);
  return new Set(cancelledExtraSessionsStore.getAll());
}
