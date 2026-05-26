// ===== IDENTITY MOCK DATA (Onboarding v5) =====
// Mutierbarer In-Memory-Store für SoStudy-Identitäten (Prototyp).
// Passt zum bestehenden Mock-Pattern (siehe user.mock.ts): Module-Level-Objekt,
// das die Services direkt mutieren. SPÄTER: ersetzt durch Supabase-Profil-Tabelle.

import type { SoStudyIdentity } from '@/types/identity';

// ===== ANMELDE-CODE-GENERATOR =====
// Format wie in der Doku (z.B. "MIRA-7K2P"): 2 Blöcke à 4 Zeichen.
// Ohne mehrdeutige Zeichen (0/O, 1/I/L) für gute Lesbarkeit beim Abschreiben.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateAnmeldeCode(): string {
  const block = () =>
    Array.from({ length: 4 }, () =>
      CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
    ).join('');
  return `${block()}-${block()}`;
}

// ===== VORBEFÜLLTE DEMO-IDENTITÄTEN =====
// Schlüssel = userId. Konsistent zu den 2 Mock-Usern in src/lib/auth.ts.

export const MOCK_IDENTITIES: Record<string, SoStudyIdentity> = {
  // User 1: Bestandsnutzer mit vollem Profil (Klarname gesetzt → Tutoring möglich)
  user_alexanderbaum_mock_123: {
    userId: 'user_alexanderbaum_mock_123',
    role: 'student',
    display_name: 'Alex',
    real_name: 'Alexander Johannes Baum',
    bundesland: 'Bayern',
    schoolType: 'Gymnasium',
    grade: '10',
    volljaehrig: false,
    anmeldeCode: 'ALEX-7K2P',
    authMethod: 'email',
    kiConsent: { accepted: true, timestamp: '2026-01-01T00:00:00.000Z' },
    email: 'alexanderbaum@gmail.com',
    createdAt: '2026-01-01T00:00:00.000Z',
  },

  // User 2: Frische Spitzname-only-Identität (Day-0, real_name noch leer → Tutoring gesperrt)
  user_newuser_mock_456: {
    userId: 'user_newuser_mock_456',
    role: 'student',
    display_name: 'Maxi',
    real_name: '',
    bundesland: 'Berlin',
    schoolType: 'Gesamtschule',
    grade: '8',
    volljaehrig: false,
    anmeldeCode: 'MAXI-9QR4',
    authMethod: 'anmeldeCode',
    kiConsent: { accepted: true, timestamp: new Date().toISOString() },
    createdAt: new Date().toISOString(),
  },
};

// ===== HELPER: Lookup per Anmelde-Code (für Code-Login) =====
export function findIdentityByAnmeldeCode(code: string): SoStudyIdentity | null {
  const normalized = code.trim().toUpperCase();
  return (
    Object.values(MOCK_IDENTITIES).find(
      (identity) => identity.anmeldeCode.toUpperCase() === normalized
    ) ?? null
  );
}
