// ===== TUTOR MOCKS =====
// Zentrale Tutor-Daten, abgeleitet aus den Chat-Räumen (= zugeordnete Lehrer)

import { mockChatRooms } from './chatMocks';

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

/**
 * Kürzt lange Tutoren-Namen für die UI-Darstellung.
 * Titel (Dr., Prof., Fr., Hr.) bleiben erhalten.
 * Der Nachname wird auf "X." gekürzt wenn der Gesamtname zu lang wäre.
 * 
 * Beispiele:
 *   "Alexander Johannes Baum" → "Alexander B."
 *   "Dr. Alexander Johannes Baum" → "Dr. Alexander B."
 *   "Prof. Müller" → "Prof. Müller" (schon kurz genug)
 *   "Fr. Hoffmann" → "Fr. Hoffmann"
 */
export function formatTutorName(fullName: string): string {
  const titles = ['Dr.', 'Prof.', 'Fr.', 'Hr.'];
  const parts = fullName.trim().split(/\s+/);
  
  // Extract title if present
  let title = '';
  let nameParts = [...parts];
  if (parts.length > 1 && titles.includes(parts[0])) {
    title = parts[0] + ' ';
    nameParts = parts.slice(1);
  }
  
  // If only one name part (after title), return as-is
  if (nameParts.length <= 1) {
    return fullName;
  }
  
  // If two parts and total is short, keep full
  if (nameParts.length === 2 && fullName.length <= 16) {
    return fullName;
  }
  
  // Keep first name, abbreviate last name (skip middle names)
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  return `${title}${firstName} ${lastName.charAt(0)}.`;
}

/**
 * Alle dem Schüler zugeordneten Tutoren.
 * Single Source of Truth – abgeleitet aus mockChatRooms,
 * damit Chat und Home-Screen immer konsistent sind.
 */
export const MOCK_TUTORS: Tutor[] = mockChatRooms.map((room) => ({
  id: room.id,
  name: room.participantName,
  avatar: room.participantAvatar,
  isOnline: room.isOnline,
}));