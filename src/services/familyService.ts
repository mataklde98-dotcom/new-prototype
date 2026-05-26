// ===== FAMILY SERVICE (Onboarding v5 — Familienkonto) =====
// Verwaltung von Familienkonten: Kinder anlegen/verknüpfen, Codes verwalten,
// Eltern-Einwilligung pro Kind. JETZT: Mock + localStorage (kein Backend).
// SPÄTER: Supabase-Tabellen `families` + `family_members`.
//
// Drei Aktivierungs-Modi (siehe types/identity.ts → ActivationMode):
//   A = Eltern erstellen ein neues Kind-Konto (System generiert Anmelde-Code).
//   B = Bestehendes Kind-Konto per Anmelde-Code verknüpfen.
//   C = Kind per Einladung (Invite-Code) verknüpfen → Eintrag bleibt `pending`, bis das Kind annimmt.

import type {
  SoStudyIdentity,
  Familienkonto,
  FamilyChild,
  AuthMethod,
} from '@/types/identity';
import {
  MOCK_IDENTITIES,
  generateAnmeldeCode,
  findIdentityByAnmeldeCode,
  findIdentityById,
  upsertIdentity,
  persistIdentities,
} from '@/mocks/identity.mock';
import {
  MOCK_FAMILIES,
  persistFamilies,
  findFamilyById,
  findFamilyByParent,
  findFamilyByInviteCode,
  generateInviteCode,
} from '@/mocks/family.mock';
import { identityService } from '@/services/identityService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface NewChildInput {
  real_name: string;           // Klarname — primärer Name (Eltern geben nur den echten Namen ein)
  display_name?: string;       // Spitzname — bleibt leer; das Kind vergibt ihn beim ersten Login selbst
  bundesland?: string;
  schoolType?: string;
  grade?: string;
  tutoringConsent?: boolean;   // Eltern-Einwilligung direkt erteilen
}

export type LinkResult =
  | { ok: true; family: Familienkonto; child: FamilyChild }
  | { ok: false; reason: 'not_found' | 'already_linked' | 'is_parent' };

export const familyService = {
  /** Familienkonto des aktuell eingeloggten Elternteils (oder null). */
  getFamily: (): Familienkonto | null => {
    const identity = identityService.getIdentity();
    if (!identity) return null;
    if (identity.familyId) return findFamilyById(identity.familyId);
    return findFamilyByParent(identity.userId);
  },

  getFamilyById: (familyId: string): Familienkonto | null => findFamilyById(familyId),

  /**
   * MODUS A — Eltern erstellen ein NEUES Kind-Konto.
   * Legt eine neue Schüler-Identität (mit generiertem Anmelde-Code) an und hängt sie ans Familienkonto.
   */
  addChildNew: async (familyId: string, input: NewChildInput): Promise<LinkResult> => {
    await delay(400);
    const family = findFamilyById(familyId);
    if (!family) return { ok: false, reason: 'not_found' };

    const childUserId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const anmeldeCode = generateAnmeldeCode();

    const childIdentity: SoStudyIdentity = {
      userId: childUserId,
      role: 'student',
      display_name: (input.display_name ?? '').trim(), // leer → Kind vergibt Spitzname beim ersten Login
      real_name: input.real_name.trim(),
      bundesland: input.bundesland ?? '',
      schoolType: input.schoolType ?? '',
      grade: input.grade,
      volljaehrig: false,
      anmeldeCode,
      authMethod: 'anmeldeCode',
      linkedAuthMethods: [],
      // Eltern willigen im Namen des Kindes in die KI-Nutzung ein.
      kiConsent: { accepted: true, timestamp: new Date().toISOString() },
      familyId,
      familyRole: 'child',
      createdAt: new Date().toISOString(),
    };
    upsertIdentity(childIdentity);

    const child: FamilyChild = {
      childUserId,
      display_name: childIdentity.display_name,
      real_name: childIdentity.real_name,
      anmeldeCode,
      schoolType: childIdentity.schoolType,
      grade: childIdentity.grade,
      activationMode: 'A',
      tutoringConsent: input.tutoringConsent ?? false,
      pending: false,
      linkedAt: new Date().toISOString(),
    };
    family.children.push(child);
    persistFamilies();

    return { ok: true, family, child };
  },

  /**
   * MODUS B — Bestehendes Kind-Konto per Anmelde-Code verknüpfen.
   * Findet eine vorhandene Schüler-Identität über den Code und hängt sie ans Familienkonto.
   */
  linkChildByCode: async (familyId: string, code: string): Promise<LinkResult> => {
    await delay(400);
    const family = findFamilyById(familyId);
    if (!family) return { ok: false, reason: 'not_found' };

    const identity = findIdentityByAnmeldeCode(code);
    if (!identity) return { ok: false, reason: 'not_found' };
    if (identity.role === 'parent') return { ok: false, reason: 'is_parent' };
    if (family.children.some((c) => c.childUserId === identity.userId)) {
      return { ok: false, reason: 'already_linked' };
    }

    // Identität ans Familienkonto binden
    upsertIdentity({ ...identity, familyId, familyRole: 'child' });

    const child: FamilyChild = {
      childUserId: identity.userId,
      display_name: identity.display_name,
      real_name: identity.real_name,
      anmeldeCode: identity.anmeldeCode,
      schoolType: identity.schoolType,
      grade: identity.grade,
      activationMode: 'B',
      tutoringConsent: false,
      pending: false,
      linkedAt: new Date().toISOString(),
    };
    family.children.push(child);
    persistFamilies();

    return { ok: true, family, child };
  },

  /**
   * WEG ① — Eltern laden ihr Kind per E-Mail ein.
   * Legt einen `pending`-Eintrag mit echtem Namen + E-Mail + Invite-Token an. Das Kind öffnet
   * die (gemockte) Einladung und wählt selbst Auth → acceptInviteWithAuth.
   */
  inviteChildByEmail: async (
    familyId: string,
    input: { real_name: string; email: string; schoolType?: string; grade?: string }
  ): Promise<{ ok: boolean; inviteToken: string; family: Familienkonto | null }> => {
    await delay(350);
    const family = findFamilyById(familyId);
    if (!family) return { ok: false, inviteToken: '', family: null };

    const inviteToken = generateInviteCode();
    const child: FamilyChild = {
      childUserId: `pending_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      display_name: '', // Spitzname vergibt das Kind selbst nach dem Annehmen
      real_name: input.real_name.trim(),
      anmeldeCode: inviteToken, // hält das Invite-Token bis zur Annahme
      email: input.email.trim(),
      schoolType: input.schoolType,
      grade: input.grade,
      activationMode: 'C',
      tutoringConsent: false,
      pending: true,
      linkedAt: new Date().toISOString(),
    };
    family.children.push(child);
    persistFamilies();

    return { ok: true, inviteToken, family };
  },

  /** Liefert Familie + offenen Einladungs-Eintrag zu einem Invite-Token (für den Annehmen-Flow). */
  getPendingInviteByToken: (
    token: string
  ): { family: Familienkonto; child: FamilyChild } | null => {
    const family = findFamilyByInviteCode(token);
    if (!family) return null;
    const child = family.children.find(
      (c) => c.pending && c.anmeldeCode.toUpperCase() === token.trim().toUpperCase()
    );
    return child ? { family, child } : null;
  },

  /**
   * WEG ① (Annahme) — Kind nimmt die E-Mail-Einladung an und wählt eine Auth-Methode (Apple/Google).
   * Erstellt eine NEUE Schüler-Identität (echter Name aus der Einladung, Spitzname leer → wird
   * beim ersten Login vergeben) MIT eigenem Login-Code (Backup), bindet sie ans Familienkonto
   * und setzt die Session — das Kind ist danach eingeloggt.
   */
  acceptInviteWithAuth: async (token: string, authMethod: AuthMethod): Promise<LinkResult> => {
    await delay(400);
    const family = findFamilyByInviteCode(token);
    if (!family) return { ok: false, reason: 'not_found' };

    const pendingIdx = family.children.findIndex(
      (c) => c.pending && c.anmeldeCode.toUpperCase() === token.trim().toUpperCase()
    );
    if (pendingIdx === -1) return { ok: false, reason: 'not_found' };
    const pending = family.children[pendingIdx];

    const childUserId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const anmeldeCode = generateAnmeldeCode();
    const childIdentity: SoStudyIdentity = {
      userId: childUserId,
      role: 'student',
      display_name: '', // Spitzname vergibt das Kind beim ersten Login selbst
      real_name: pending.real_name,
      bundesland: '',
      schoolType: pending.schoolType ?? '',
      grade: pending.grade,
      volljaehrig: false,
      anmeldeCode, // Schüler haben immer einen Login-Code (Backup), zusätzlich zur Auth
      authMethod,
      linkedAuthMethods: authMethod === 'apple' || authMethod === 'google' ? [authMethod] : [],
      // Eltern haben im Namen des Kindes in die KI-Nutzung eingewilligt.
      kiConsent: { accepted: true, timestamp: new Date().toISOString() },
      email: pending.email,
      familyId: family.familyId,
      familyRole: 'child',
      createdAt: new Date().toISOString(),
    };
    upsertIdentity(childIdentity);

    const child: FamilyChild = {
      ...pending,
      childUserId,
      anmeldeCode,
      pending: false,
      linkedAt: new Date().toISOString(),
    };
    family.children[pendingIdx] = child;
    persistFamilies();

    // Session für das frisch aktivierte Kind setzen (es ist jetzt eingeloggt).
    identityService.establishSession(childIdentity, true);

    return { ok: true, family, child };
  },

  /** Generiert einen neuen Anmelde-Code für ein Kind (Code-Management). */
  regenerateChildCode: async (
    familyId: string,
    childUserId: string
  ): Promise<{ ok: boolean; anmeldeCode: string; family: Familienkonto | null }> => {
    await delay(300);
    const family = findFamilyById(familyId);
    if (!family) return { ok: false, anmeldeCode: '', family: null };
    const child = family.children.find((c) => c.childUserId === childUserId);
    if (!child) return { ok: false, anmeldeCode: '', family: null };

    const anmeldeCode = generateAnmeldeCode();
    child.anmeldeCode = anmeldeCode;
    // Auch die Kind-Identität aktualisieren, damit der Login mit dem neuen Code funktioniert.
    const identity = findIdentityById(childUserId);
    if (identity) {
      identity.anmeldeCode = anmeldeCode;
      persistIdentities();
    }
    persistFamilies();
    return { ok: true, anmeldeCode, family };
  },

  /** Setzt die Eltern-Einwilligung zur Nachhilfe für ein Kind. */
  setTutoringConsent: async (
    familyId: string,
    childUserId: string,
    value: boolean
  ): Promise<Familienkonto | null> => {
    await delay(200);
    const family = findFamilyById(familyId);
    if (!family) return null;
    const child = family.children.find((c) => c.childUserId === childUserId);
    if (child) {
      child.tutoringConsent = value;
      persistFamilies();
    }
    return family;
  },

  /** Entfernt ein Kind aus dem Familienkonto (Identität bleibt bestehen, nur entkoppelt). */
  removeChild: async (familyId: string, childUserId: string): Promise<Familienkonto | null> => {
    await delay(250);
    const family = findFamilyById(familyId);
    if (!family) return null;
    family.children = family.children.filter((c) => c.childUserId !== childUserId);
    const identity = findIdentityById(childUserId);
    if (identity && identity.familyId === familyId) {
      const { familyId: _omit, familyRole: _omit2, ...rest } = identity;
      MOCK_IDENTITIES[childUserId] = rest as SoStudyIdentity;
      persistIdentities();
    }
    persistFamilies();
    return family;
  },
};
