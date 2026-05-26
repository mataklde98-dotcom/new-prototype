// ===== ELTERN-EINLADUNGS-STORE (Onboarding v5 — Änderung 7, Pfad 4) =====
// Ein selbst-registrierter Schüler (<18, OHNE Familienkonto) lädt seine Eltern per E-Mail
// (Magic-Link) ein, ein Familienkonto zu erstellen und die Nachhilfe freizugeben.
// JETZT: Mock + localStorage. SPÄTER: Tabelle `parent_invites` + Magic-Link-Versand per E-Mail
// (und optional SMS-Backup). Siehe docs/BACKEND_TRACKING.md.

export type ParentInviteStatus = 'pending' | 'accepted' | 'withdrawn';

export interface ParentInvite {
  token: string;          // Magic-Link-Token (EINLADUNG-XXXXXX)
  studentUserId: string;  // wer eingeladen hat
  parentEmail: string;
  parentMobile?: string;  // optional, für SMS-Backup
  status: ParentInviteStatus;
  createdAt: string;      // ISO
  updatedAt: string;      // ISO (Resend / Statuswechsel)
}

const KEY = 'sostudy_parent_invites';

function hydrate(): Record<string, ParentInvite> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Record<string, ParentInvite>;
  } catch {
    /* ignore */
  }
  return {};
}

export const MOCK_PARENT_INVITES: Record<string, ParentInvite> = hydrate();

export function persistParentInvites(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(MOCK_PARENT_INVITES));
  } catch {
    /* ignore */
  }
}

export function findParentInviteByToken(token: string): ParentInvite | null {
  return MOCK_PARENT_INVITES[token] ?? null;
}

/** Offene (pending) Einladung eines Schülers — es gibt höchstens eine aktive. */
export function findActiveParentInviteByStudent(studentUserId: string): ParentInvite | null {
  return (
    Object.values(MOCK_PARENT_INVITES).find(
      (i) => i.studentUserId === studentUserId && i.status === 'pending'
    ) ?? null
  );
}
