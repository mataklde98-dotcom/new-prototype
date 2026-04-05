// ===== HOOK: useWeaknessCards =====
// React hook for the weaknessCardStore (useSyncExternalStore pattern)

import { useSyncExternalStore } from 'react';
import { weaknessCardStore, getWeaknessCardId, type WeaknessCardState } from '@/app/components/weaknessCardStore';

export function useWeaknessCards() {
  const snapshot = useSyncExternalStore(
    weaknessCardStore.subscribe,
    weaknessCardStore.getSnapshot,
  );
  return snapshot;
}

export function useWeaknessCard(source: string, subject: string, topic: string): WeaknessCardState | undefined {
  const cards = useWeaknessCards();
  const id = getWeaknessCardId(source, subject, topic);
  return cards[id];
}
