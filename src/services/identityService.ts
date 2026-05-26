// ===== IDENTITY SERVICE (Onboarding v5) =====
// Zentrale Service-Schicht für Registrierung, Identität & Anmelde-Code-Login.
// JETZT: Mock + localStorage (Prototyp, kein Backend).
// SPÄTER: Mock-Aufrufe durch echte Supabase-Calls ersetzen (Auth + Profil-Tabelle).

import type { SoStudyIdentity, OnboardingDraft, AuthMethod } from '@/types/identity';
import {
  MOCK_IDENTITIES,
  generateAnmeldeCode,
  findIdentityByAnmeldeCode,
} from '@/mocks/identity.mock';

// Simuliere API-Delay (gleiches Muster wie userService)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ===== localStorage-Keys =====
const IDENTITY_KEY = 'sostudy_identity'; // kanonische Identität (JSON)
const USER_DATA_KEY = 'userData';         // bestehende Kompat-Shape (UserContext/AuthWrapper)

// ===== KOMPAT-LAYER =====
// Schreibt einen userData-Datensatz, den UserContext & AuthWrapper bereits verstehen.
// Wichtig: Im Zwei-Bubble-Modell treibt der SPITZNAME (display_name) die App-Begrüßung,
// der Klarname (real_name) bleibt für den Nachhilfe-Kontext separat.
function toUserData(identity: SoStudyIdentity) {
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
  };
}

function persistSession(identity: SoStudyIdentity, isNew: boolean) {
  MOCK_IDENTITIES[identity.userId] = identity;
  localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(toUserData(identity)));
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
      volljaehrig: false, // TODO: später per Volljährigkeits-Toggle setzbar
      anmeldeCode: generateAnmeldeCode(),
      authMethod: (draft.authMethod ?? 'anmeldeCode') as AuthMethod,
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
};
