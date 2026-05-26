// ===== ELTERN-EINLADUNGS-SERVICE (Onboarding v5 — Änderung 7, Pfad 4) =====
// Lebenszyklus der Schüler→Eltern-Einladung: anlegen (Magic-Link versenden), erneut senden,
// E-Mail ändern, zurückziehen, annehmen. JETZT: Mock + localStorage; der Magic-Link-Versand ist
// gemockt. SPÄTER: echte E-Mail/SMS + Tabelle `parent_invites` (siehe docs/BACKEND_TRACKING.md).

import { generateInviteCode } from '@/mocks/family.mock';
import {
  MOCK_PARENT_INVITES,
  persistParentInvites,
  findParentInviteByToken,
  findActiveParentInviteByStudent,
  type ParentInvite,
} from '@/mocks/parentInvites.mock';
import { identityService } from '@/services/identityService';
import { familyService } from '@/services/familyService';
import type { AuthMethod, Familienkonto } from '@/types/identity';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const parentInviteService = {
  getActiveForStudent: (studentUserId: string): ParentInvite | null =>
    findActiveParentInviteByStudent(studentUserId),

  getByToken: (token: string): ParentInvite | null => findParentInviteByToken(token),

  /** Legt eine Einladung an und „versendet" den Magic-Link (gemockt). */
  create: async (
    studentUserId: string,
    parentEmail: string,
    parentMobile?: string
  ): Promise<ParentInvite> => {
    await delay(400);
    const token = generateInviteCode();
    const now = new Date().toISOString();
    const invite: ParentInvite = {
      token,
      studentUserId,
      parentEmail: parentEmail.trim(),
      parentMobile: parentMobile?.trim() || undefined,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    MOCK_PARENT_INVITES[token] = invite;
    persistParentInvites();
    return invite;
  },

  /** Magic-Link erneut versenden (gemockt). */
  resend: async (token: string): Promise<boolean> => {
    await delay(300);
    const invite = findParentInviteByToken(token);
    if (!invite || invite.status !== 'pending') return false;
    invite.updatedAt = new Date().toISOString();
    persistParentInvites();
    return true;
  },

  /** Andere E-Mail-Adresse probieren. */
  changeEmail: async (token: string, newEmail: string): Promise<ParentInvite | null> => {
    await delay(300);
    const invite = findParentInviteByToken(token);
    if (!invite || invite.status !== 'pending') return null;
    invite.parentEmail = newEmail.trim();
    invite.updatedAt = new Date().toISOString();
    persistParentInvites();
    return invite;
  },

  /** Einladung zurückziehen. */
  withdraw: async (token: string): Promise<boolean> => {
    await delay(250);
    const invite = findParentInviteByToken(token);
    if (!invite) return false;
    invite.status = 'withdrawn';
    invite.updatedAt = new Date().toISOString();
    persistParentInvites();
    return true;
  },

  /**
   * Eltern nehmen die Einladung an (nach Magic-Link-Klick): legt das Eltern-Konto + Familienkonto
   * an, verknüpft den Schüler als Kind (Klarname + Nachhilfe-Einwilligung) und markiert die
   * Einladung als angenommen. Das Elternteil ist danach eingeloggt.
   */
  accept: async (
    token: string,
    data: { childRealName: string; parentRealName: string; parentPhone: string; authMethod: AuthMethod }
  ): Promise<{ ok: boolean; family: Familienkonto | null }> => {
    await delay(400);
    const invite = findParentInviteByToken(token);
    if (!invite || invite.status !== 'pending') return { ok: false, family: null };

    // 1. Eltern-Identität + (leeres) Familienkonto anlegen, Eltern-Session setzen.
    const { family } = await identityService.registerParent({
      real_name: data.parentRealName,
      phone: data.parentPhone,
      email: invite.parentEmail, // die eingeladene Adresse wird Vertrags-/Kontakt-E-Mail
      kiConsentAccepted: true,
      authMethod: data.authMethod,
    });

    // 2. Schüler als Kind verknüpfen — die Einladung IST die Nachhilfe-Freigabe.
    await familyService.linkChildById(family.familyId, invite.studentUserId, {
      realName: data.childRealName,
      tutoringConsent: true,
    });

    invite.status = 'accepted';
    invite.updatedAt = new Date().toISOString();
    persistParentInvites();
    return { ok: true, family };
  },
};
