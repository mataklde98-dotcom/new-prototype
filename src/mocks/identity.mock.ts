// ===== IDENTITY MOCK DATA (Onboarding v5) =====
// Mutierbarer In-Memory-Store für SoStudy-Identitäten (Prototyp).
// Passt zum bestehenden Mock-Pattern (siehe user.mock.ts): Module-Level-Objekt,
// das die Services direkt mutieren. SPÄTER: ersetzt durch Supabase-Profil-Tabelle.
//
// NEU: Der Store wird zusätzlich in localStorage gespiegelt, damit zur Laufzeit
// angelegte Identitäten (Onboarding, per Eltern erstellte Kinder) einen Reload
// überleben — das macht das Demo-Seeding für Präsentationen verlässlich.

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
// Schlüssel = userId. Konsistent zu den 2 Mock-Usern in src/lib/auth.ts,
// plus ein Elternteil + ein verknüpftes Kind (für den Eltern-/Familienkonto-Demo).

const DEFAULT_IDENTITIES: Record<string, SoStudyIdentity> = {
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
    anmeldeCode: 'ALEX-7K2P', // Schüler haben immer einen Login-Code, auch mit verknüpfter Auth
    authMethod: 'email',
    linkedAuthMethods: ['apple'],
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
    linkedAuthMethods: [],
    kiConsent: { accepted: true, timestamp: '2026-01-01T00:00:00.000Z' },
    createdAt: '2026-01-01T00:00:00.000Z',
  },

  // Elternteil (owner des Familienkontos fam_mock_001)
  user_parent_mock_789: {
    userId: 'user_parent_mock_789',
    role: 'parent',
    display_name: 'Sabine',
    real_name: 'Sabine Baum',
    bundesland: '',
    schoolType: '',
    volljaehrig: true,
    anmeldeCode: '', // Eltern melden sich per Auth an → kein Anmelde-Code
    authMethod: 'email',
    linkedAuthMethods: ['apple', 'google'],
    kiConsent: { accepted: true, timestamp: '2026-01-01T00:00:00.000Z' },
    email: 'parent@sostudytest.com',
    familyId: 'fam_mock_001',
    familyRole: 'owner',
    createdAt: '2026-01-01T00:00:00.000Z',
  },

  // Verknüpftes Kind unter fam_mock_001 (Klarname gesetzt, Eltern-Einwilligung erteilt)
  user_child_mock_790: {
    userId: 'user_child_mock_790',
    role: 'student',
    display_name: 'Lena',
    real_name: 'Lena Baum',
    bundesland: 'Bayern',
    schoolType: 'Gymnasium',
    grade: '7',
    volljaehrig: false,
    anmeldeCode: 'LENA-3F8K',
    authMethod: 'anmeldeCode',
    linkedAuthMethods: [],
    kiConsent: { accepted: true, timestamp: '2026-01-01T00:00:00.000Z' },
    familyId: 'fam_mock_001',
    familyRole: 'child',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
};

// ===== PERSISTENZ-LAYER (localStorage-Spiegel) =====
const IDENTITIES_KEY = 'sostudy_identities';

function hydrateIdentities(): Record<string, SoStudyIdentity> {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_IDENTITIES };
  try {
    const raw = localStorage.getItem(IDENTITIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, SoStudyIdentity>;
      // Persistierte Einträge gewinnen, Defaults werden ergänzt (neue Demo-User tauchen auf).
      return { ...DEFAULT_IDENTITIES, ...parsed };
    }
  } catch {
    /* ignore — fällt auf Defaults zurück */
  }
  return { ...DEFAULT_IDENTITIES };
}

export const MOCK_IDENTITIES: Record<string, SoStudyIdentity> = hydrateIdentities();

/** Tiefe Kopie der Default-Identitäten (Basis fürs Demo-Seeding). */
export function getDefaultIdentities(): Record<string, SoStudyIdentity> {
  return JSON.parse(JSON.stringify(DEFAULT_IDENTITIES));
}

/** Spiegelt den aktuellen In-Memory-Store nach localStorage (von Services nach Mutationen aufgerufen). */
export function persistIdentities(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(IDENTITIES_KEY, JSON.stringify(MOCK_IDENTITIES));
  } catch {
    /* ignore */
  }
}

/** Schreibt/aktualisiert eine Identität und persistiert. */
export function upsertIdentity(identity: SoStudyIdentity): void {
  MOCK_IDENTITIES[identity.userId] = identity;
  persistIdentities();
}

// ===== HELPER: Lookup per Anmelde-Code (für Code-Login) =====
export function findIdentityByAnmeldeCode(code: string): SoStudyIdentity | null {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null; // leere Eingabe matcht nie
  return (
    Object.values(MOCK_IDENTITIES).find(
      // Identitäten ohne aktiven Code (Auth-Nutzer, anmeldeCode '') überspringen.
      (identity) => identity.anmeldeCode && identity.anmeldeCode.toUpperCase() === normalized
    ) ?? null
  );
}

/** Lookup per userId. */
export function findIdentityById(userId: string): SoStudyIdentity | null {
  return MOCK_IDENTITIES[userId] ?? null;
}
