// ===== IDENTITY SERVICE (Onboarding v5) =====
// Zentrale Service-Schicht für Registrierung, Identität & Anmelde-Code-Login.
// JETZT: Mock + localStorage (Prototyp, kein Backend).
// SPÄTER: Mock-Aufrufe durch echte Supabase-Calls ersetzen (Auth + Profil-Tabelle).

import type {
  SoStudyIdentity,
  OnboardingDraft,
  ParentOnboardingDraft,
  AuthMethod,
  Familienkonto,
} from '@/types/identity';
import {
  MOCK_IDENTITIES,
  generateAnmeldeCode,
  findIdentityByAnmeldeCode,
  persistIdentities,
} from '@/mocks/identity.mock';
import { MOCK_FAMILIES, persistFamilies, generateFamilyId } from '@/mocks/family.mock';

// Simuliere API-Delay (gleiches Muster wie userService)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ===== localStorage-Keys =====
const IDENTITY_KEY = 'sostudy_identity'; // kanonische Identität (JSON)
const USER_DATA_KEY = 'userData';         // bestehende Kompat-Shape (UserContext/AuthWrapper)

// ===== KOMPAT-LAYER =====
// Schreibt einen userData-Datensatz, den UserContext & AuthWrapper bereits verstehen.
// Wichtig: Im Zwei-Bubble-Modell treibt der SPITZNAME (display_name) die App-Begrüßung,
// der Klarname (real_name) bleibt für den Nachhilfe-Kontext separat.
export function identityToUserData(identity: SoStudyIdentity) {
  return {
    userId: identity.userId,
    role: identity.role,
    // Begrüßung in der Casual-App = Spitzname
    firstName: identity.display_name,
    lastName: '',
    // Kanonische Namensfelder (von der UserContext-Migration genutzt)
    display_name: identity.display_name,
    real_name: identity.real_name,
    email: identity.email ?? '',
    bundesland: identity.bundesland,
    schoolType: identity.schoolType,
    grade: identity.grade,
    volljaehrig: identity.volljaehrig,
    anmeldeCode: identity.anmeldeCode,
    authMethod: identity.authMethod,
    linkedAuthMethods: identity.linkedAuthMethods ?? [],
    // Familienkonto-Verknüpfung (für Parent-/Student-Routing & Tutoring-Matrix)
    familyId: identity.familyId,
    familyRole: identity.familyRole,
  };
}

function persistSession(identity: SoStudyIdentity, isNew: boolean) {
  MOCK_IDENTITIES[identity.userId] = identity;
  persistIdentities(); // Laufzeit-Identität überlebt Reload (Demo-Verlässlichkeit)
  localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(identityToUserData(identity)));
  localStorage.setItem('isLoggedIn', 'true');
  if (isNew) localStorage.setItem('isNewRegistration', 'true');
}

export const identityService = {
  /**
   * Registriert einen Schüler aus dem Onboarding-Draft.
   * Generiert userId + permanenten Anmelde-Code und legt die Session an.
   * SPÄTER: POST an Supabase Auth + Profil-Insert.
   */
  registerStudent: async (draft: OnboardingDraft): Promise<SoStudyIdentity> => {
    await delay(400);

    const identity: SoStudyIdentity = {
      userId: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      role: 'student',
      display_name: draft.display_name.trim(),
      real_name: '', // Klarname kommt erst bei Tutoring-Aktivierung
      bundesland: draft.bundesland,
      schoolType: draft.schoolType,
      grade: draft.grade,
      volljaehrig: false, // später per Volljährigkeits-Toggle setzbar (Phase 5)
      anmeldeCode: generateAnmeldeCode(),
      authMethod: (draft.authMethod ?? 'anmeldeCode') as AuthMethod,
      linkedAuthMethods:
        draft.authMethod === 'apple' || draft.authMethod === 'google' ? [draft.authMethod] : [],
      kiConsent: {
        accepted: draft.kiConsentAccepted,
        timestamp: draft.kiConsentAccepted ? new Date().toISOString() : undefined,
      },
      email: draft.email,
      createdAt: new Date().toISOString(),
    };

    persistSession(identity, true);
    return identity;
  },

  /**
   * Registriert ein Elternteil aus dem Eltern-Onboarding (E1–E8).
   * Legt die Eltern-Identität (Klarname-Kontext) UND ein leeres Familienkonto an.
   * SPÄTER: Supabase Auth + Profil-Insert (role 'parent') + `families`-Insert.
   */
  registerParent: async (
    draft: ParentOnboardingDraft
  ): Promise<{ identity: SoStudyIdentity; family: Familienkonto }> => {
    await delay(400);

    const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const familyId = generateFamilyId();
    const realName = draft.real_name.trim();

    const family: Familienkonto = {
      familyId,
      parentUserId: userId,
      parentRealName: realName,
      children: [],
      createdAt: new Date().toISOString(),
    };
    MOCK_FAMILIES[familyId] = family;
    persistFamilies();

    const identity: SoStudyIdentity = {
      userId,
      role: 'parent',
      // Eltern arbeiten im Klarname-Kontext; Spitzname = Vorname für eine freundliche Begrüßung.
      display_name: realName.split(' ')[0] || realName,
      real_name: realName,
      bundesland: '',
      schoolType: '',
      volljaehrig: true,
      anmeldeCode: generateAnmeldeCode(),
      authMethod: (draft.authMethod ?? 'email') as AuthMethod,
      linkedAuthMethods:
        draft.authMethod === 'apple' || draft.authMethod === 'google' ? [draft.authMethod] : [],
      kiConsent: {
        accepted: draft.kiConsentAccepted,
        timestamp: draft.kiConsentAccepted ? new Date().toISOString() : undefined,
      },
      email: draft.email,
      familyId,
      familyRole: 'owner',
      createdAt: new Date().toISOString(),
    };

    persistSession(identity, true);
    return { identity, family };
  },

  /**
   * Liest die aktuell eingeloggte Identität (oder null).
   */
  getIdentity: (): SoStudyIdentity | null => {
    const raw = localStorage.getItem(IDENTITY_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SoStudyIdentity;
    } catch {
      return null;
    }
  },

  /**
   * Stellt sicher, dass eine kanonische Identität existiert.
   * Brücke für Legacy-Login (E-Mail/Passwort schreibt nur `userData`): leitet daraus
   * eine SoStudyIdentity ab und persistiert sie, damit identitätsabhängige Features
   * (Klarname-Gate, Volljährigkeit, Familienkonto) zuverlässig funktionieren.
   */
  ensureIdentity: (): SoStudyIdentity | null => {
    const existing = identityService.getIdentity();
    if (existing) return existing;
    const raw = localStorage.getItem(USER_DATA_KEY);
    if (!raw) return null;
    try {
      const ud = JSON.parse(raw);
      const legacyName = `${ud.firstName ?? ''} ${ud.lastName ?? ''}`.trim();
      const identity: SoStudyIdentity = {
        userId: ud.userId || `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        role: ud.role || 'student',
        display_name: ud.display_name || ud.firstName || legacyName || 'Ich',
        real_name: ud.real_name || legacyName || '',
        bundesland: ud.bundesland || '',
        schoolType: ud.schoolType || '',
        grade: ud.grade,
        volljaehrig: !!ud.volljaehrig,
        anmeldeCode: ud.anmeldeCode || generateAnmeldeCode(),
        authMethod: (ud.authMethod || 'email') as AuthMethod,
        linkedAuthMethods: ud.linkedAuthMethods || [],
        kiConsent: { accepted: true, timestamp: new Date().toISOString() },
        email: ud.email,
        familyId: ud.familyId,
        familyRole: ud.familyRole,
        createdAt: ud.createdAt || new Date().toISOString(),
      };
      persistSession(identity, false);
      return identity;
    } catch {
      return null;
    }
  },

  /**
   * Anmelde-Code-Login (Anton-Style). Mock-Lookup gegen die Identitäts-Tabelle.
   * SPÄTER: Backend prüft Code gegen die Anmelde-Code-Datenbank.
   */
  loginWithAnmeldeCode: async (code: string): Promise<SoStudyIdentity | null> => {
    await delay(300);
    const identity = findIdentityByAnmeldeCode(code);
    if (!identity) return null;
    persistSession(identity, false);
    return identity;
  },

  /**
   * Setzt den Klarnamen (Voraussetzung für Tutoring-Anfragen).
   */
  setRealName: async (realName: string): Promise<SoStudyIdentity | null> => {
    await delay(200);
    const current = identityService.getIdentity();
    if (!current) return null;
    const updated: SoStudyIdentity = { ...current, real_name: realName.trim() };
    persistSession(updated, false);
    return updated;
  },

  /**
   * Aktualisiert den Volljährigkeits-Toggle (Self-Declaration).
   */
  setVolljaehrig: async (value: boolean): Promise<SoStudyIdentity | null> => {
    await delay(150);
    const current = identityService.getIdentity();
    if (!current) return null;
    const updated: SoStudyIdentity = { ...current, volljaehrig: value };
    persistSession(updated, false);
    return updated;
  },

  /**
   * Verknüpft nachträglich eine Social-Login-Methode (Apple/Google) — visuell gemockt.
   * SPÄTER: Supabase `linkIdentity` (OAuth-Verknüpfung am bestehenden Konto).
   */
  linkAuthMethod: async (method: AuthMethod): Promise<SoStudyIdentity | null> => {
    await delay(600); // simulierte OAuth-Weiterleitung
    const current = identityService.getIdentity();
    if (!current) return null;
    const existing = current.linkedAuthMethods ?? [];
    if (existing.includes(method)) return current; // bereits verknüpft → idempotent
    const updated: SoStudyIdentity = {
      ...current,
      linkedAuthMethods: [...existing, method],
    };
    persistSession(updated, false);
    return updated;
  },

  /**
   * Entfernt eine verknüpfte Social-Login-Methode wieder.
   */
  unlinkAuthMethod: async (method: AuthMethod): Promise<SoStudyIdentity | null> => {
    await delay(300);
    const current = identityService.getIdentity();
    if (!current) return null;
    const updated: SoStudyIdentity = {
      ...current,
      linkedAuthMethods: (current.linkedAuthMethods ?? []).filter((m) => m !== method),
    };
    persistSession(updated, false);
    return updated;
  },
};
