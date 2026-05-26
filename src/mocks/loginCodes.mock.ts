// ===== LOGIN-CODE STORE (Onboarding v5 — Änderung 6) =====
// Spiegelt die geplante Backend-Tabelle `login_codes` (siehe docs/BACKEND_TRACKING.md):
//   code VARCHAR(16) PRIMARY KEY | user_uuid FK | created_at | last_used_at | is_active
// JETZT: In-Memory + localStorage (Prototyp). Damit lebt der Code unabhängig vom restlichen
// Frontend-Zustand und überlebt einen Reload. Die echte, geräteübergreifende Persistenz (auch
// nach Browser-Reset) leistet erst das Backend — im Mock nicht vollständig abbildbar.

import { MOCK_IDENTITIES } from './identity.mock';

export interface LoginCodeRecord {
  code: string;
  userUuid: string;
  createdAt: string;    // ISO
  lastUsedAt?: string;  // ISO — für Audit (Änderung 6)
  isActive: boolean;    // false nach Reset (alter Code wird ungültig)
}

const LOGIN_CODES_KEY = 'sostudy_login_codes';

function hydrate(): Record<string, LoginCodeRecord> {
  const store: Record<string, LoginCodeRecord> = {};
  // Aus den vorhandenen Identitäten seeden (Demo-User + zur Laufzeit angelegte Kinder).
  for (const id of Object.values(MOCK_IDENTITIES)) {
    if (id.anmeldeCode) {
      store[id.anmeldeCode.toUpperCase()] = {
        code: id.anmeldeCode,
        userUuid: id.userId,
        createdAt: id.createdAt,
        isActive: true,
      };
    }
  }
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOGIN_CODES_KEY);
      if (raw) {
        // Persistierte Einträge (inkl. last_used_at / is_active) gewinnen über die Seeds.
        Object.assign(store, JSON.parse(raw) as Record<string, LoginCodeRecord>);
      }
    } catch {
      /* ignore — fällt auf Seeds zurück */
    }
  }
  return store;
}

export const MOCK_LOGIN_CODES: Record<string, LoginCodeRecord> = hydrate();

export function persistLoginCodes(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LOGIN_CODES_KEY, JSON.stringify(MOCK_LOGIN_CODES));
  } catch {
    /* ignore */
  }
}

/** Aktiver Code-Datensatz (oder null, falls unbekannt/deaktiviert). */
export function findActiveLoginCode(code: string): LoginCodeRecord | null {
  const rec = MOCK_LOGIN_CODES[code.trim().toUpperCase()];
  return rec && rec.isActive ? rec : null;
}

/** Legt einen aktiven Code an (z.B. bei Registrierung / Self-Healing). */
export function recordLoginCode(code: string, userUuid: string): void {
  MOCK_LOGIN_CODES[code.toUpperCase()] = {
    code,
    userUuid,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
  persistLoginCodes();
}

/** Deaktiviert alle aktiven Codes eines Nutzers (Code-Reset). */
export function deactivateUserLoginCodes(userUuid: string): void {
  for (const rec of Object.values(MOCK_LOGIN_CODES)) {
    if (rec.userUuid === userUuid) rec.isActive = false;
  }
  persistLoginCodes();
}

/** Setzt last_used_at (Audit) beim erfolgreichen Login. */
export function touchLoginCode(code: string): void {
  const rec = MOCK_LOGIN_CODES[code.trim().toUpperCase()];
  if (rec) {
    rec.lastUsedAt = new Date().toISOString();
    persistLoginCodes();
  }
}
