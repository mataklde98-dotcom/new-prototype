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
  findIdentityById,
  persistIdentities,
} from '@/mocks/identity.mock';
import { MOCK_FAMILIES, persistFamilies, generateFamilyId } from '@/mocks/family.mock';
import { recordLoginCode } from '@/mocks/loginCodes.mock';
import { loginCodeService } from '@/services/loginCodeService';

// Simuliere API-Delay (gleiches Muster wie userService)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ===== localStorage-Keys =====
const IDENTITY_KEY = 'sostudy_identity'; // kanonische Identität (JSON)
const USER_DATA_KEY = 'userData';         // bestehende Kompat-Shape (UserContext/AuthWrapper)

// ===== KOMPAT-LAYER =====
// Schreibt einen userData-Datensatz, den UserContext & AuthWrapper bereits verstehen.
// Wichtig: Im Zwei-Bubble-Modell treibt der SPITZNAME (display_name) die App-Begrüßung,
// der Klarname (real_name) bleibt für den Nachhilfe-Kontext separat.
/**
 * Profil vollständig? (treibt den CompleteProfile-Banner auf dem Dashboard.)
 * Schüler: Schul-Daten (Bundesland/Schulform/Klasse) gesetzt. Eltern gelten immer als vollständig.
 * Hinweis: KI-Consent ist KEINE Voraussetzung mehr für die Profil-Vollständigkeit
 * (KI-Nutzung = notwendige Verarbeitung zur Vertragserfüllung, kein eigener Einwilligungsschritt).
 */
export function isProfileComplete(identity: SoStudyIdentity): boolean {
  if (identity.role !== 'student') return true;
  return !!(identity.bundesland && identity.schoolType && identity.grade);
}

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
    phone: identity.phone ?? '',
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
    // Onboarding 28-Mai (One-Step-Signup + Profil-nach-Dashboard)
    ageBracket: identity.ageBracket,
    anonymous: identity.anonymous ?? false,
    username: identity.username,
    kiConsentAccepted: identity.kiConsent.accepted,
    profileComplete: isProfileComplete(identity),
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

/** Hält den Login-Code eines Kindes im Familienkonto synchron (Eltern-Recovery-Anker). */
function syncFamilyChildCode(childUserId: string, anmeldeCode: string) {
  let changed = false;
  for (const family of Object.values(MOCK_FAMILIES)) {
    const child = family.children.find((c) => c.childUserId === childUserId);
    if (child) {
      child.anmeldeCode = anmeldeCode;
      changed = true;
    }
  }
  if (changed) persistFamilies();
}

/** Hält die Schul-Daten eines Kindes im Familienkonto synchron (z.B. nach dem Erst-Login-Schul-Wizard). */
function syncFamilyChildSchool(childUserId: string, identity: SoStudyIdentity) {
  let changed = false;
  for (const family of Object.values(MOCK_FAMILIES)) {
    const child = family.children.find((c) => c.childUserId === childUserId);
    if (child) {
      child.bundesland = identity.bundesland;
      child.schoolType = identity.schoolType;
      child.grade = identity.grade;
      changed = true;
    }
  }
  if (changed) persistFamilies();
}

export const identityService = {
  /**
   * Registriert einen Schüler aus dem Onboarding-Draft.
   * Generiert userId + permanenten Anmelde-Code und legt die Session an.
   * SPÄTER: POST an Supabase Auth + Profil-Insert.
   */
  registerStudent: async (draft: OnboardingDraft): Promise<SoStudyIdentity> => {
    await delay(400);

    // Pfad C (unter 16): anonym — keine E-Mail, Login per Apple "E-Mail verbergen" oder Fantasie-Username.
    const isAnonymous = draft.ageBracket === 'under16';
    const username = draft.username?.trim() || undefined;

    const identity: SoStudyIdentity = {
      userId: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      role: 'student',
      // Beim One-Step-Signup gibt es keinen Spitzname-Schritt mehr. Pfad C nimmt den Username
      // als Anzeigenamen; Pfad B startet leer → NicknameClaimGate fragt ihn einmalig nach dem Login.
      display_name: (draft.display_name.trim() || username || ''),
      real_name: '', // Klarname kommt erst bei Tutoring-Aktivierung
      bundesland: draft.bundesland, // beim One-Step-Signup leer → CompleteProfile nach Dashboard
      schoolType: draft.schoolType,
      grade: draft.grade,
      volljaehrig: false, // 18er-Grenze, UNABHÄNGIG von ageBracket — erst bei Tutoring relevant
      ageBracket: draft.ageBracket,
      anonymous: isAnonymous,
      username,
      // Jeder Schüler erhält IMMER einen Login-Code (vollwertige Methode + Backup, Anton-Style) —
      // auch bei Apple/Google. Der Code wird nie gelöscht, nur bei Bedarf regenerierbar.
      anmeldeCode: generateAnmeldeCode(),
      authMethod: (draft.authMethod ?? 'anmeldeCode') as AuthMethod,
      linkedAuthMethods:
        draft.authMethod === 'apple' || draft.authMethod === 'google' ? [draft.authMethod] : [],
      kiConsent: {
        accepted: draft.kiConsentAccepted,
        timestamp: draft.kiConsentAccepted ? new Date().toISOString() : undefined,
      },
      // Anonyme Konten (Pfad C) erheben KEINE E-Mail.
      email: isAnonymous ? undefined : draft.email,
      createdAt: new Date().toISOString(),
    };

    persistSession(identity, true);
    recordLoginCode(identity.anmeldeCode, identity.userId); // Code im Login-Code-Store anlegen (Änderung 6)
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
      parentEmail: draft.email,
      parentPhone: draft.phone,
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
      // Eltern melden sich per Auth (Apple/Google/E-Mail) an — kein Anmelde-Code.
      anmeldeCode: '',
      authMethod: (draft.authMethod ?? 'email') as AuthMethod,
      linkedAuthMethods:
        draft.authMethod === 'apple' || draft.authMethod === 'google' ? [draft.authMethod] : [],
      kiConsent: {
        accepted: draft.kiConsentAccepted,
        timestamp: draft.kiConsentAccepted ? new Date().toISOString() : undefined,
      },
      email: draft.email,
      phone: draft.phone,
      familyId,
      familyRole: 'owner',
      createdAt: new Date().toISOString(),
    };

    persistSession(identity, true);
    return { identity, family };
  },

  /**
   * Setzt die Session für eine extern erstellte Identität (z.B. ein per E-Mail-Einladung
   * aktiviertes Kind aus familyService). SPÄTER: entspricht dem Supabase-Session-Setzen.
   */
  establishSession: (identity: SoStudyIdentity, isNew = true): SoStudyIdentity => {
    persistSession(identity, isNew);
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
        // Schüler haben immer einen Login-Code; Eltern (E-Mail-Track) keinen.
        anmeldeCode:
          ud.anmeldeCode || ((ud.role || 'student') === 'parent' ? '' : generateAnmeldeCode()),
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
    // Server-seitige Code-Validierung (Änderung 6): unabhängig vom Frontend-Zustand,
    // aktualisiert last_used_at. Mappt den Code → userUuid → Identität.
    const userUuid = loginCodeService.login(code);
    if (!userUuid) return null;
    const identity = findIdentityById(userUuid);
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
   * Setzt E-Mail + (verifizierte) Telefonnummer für den 18+-Schüler vor der Nachhilfe-Anfrage
   * (Änderung 4). Ersetzt NICHT den Spitznamen — nur die Nachhilfe-/Kontaktfelder.
   */
  setContact: async (
    data: { email?: string; phone?: string }
  ): Promise<SoStudyIdentity | null> => {
    await delay(150);
    const current = identityService.getIdentity();
    if (!current) return null;
    const updated: SoStudyIdentity = {
      ...current,
      email: data.email ?? current.email,
      phone: data.phone ?? current.phone,
    };
    persistSession(updated, false);
    return updated;
  },

  /**
   * Setzt den Spitznamen (display_name). Genutzt vom Spitzname-Schritt beim ersten Login
   * eines von Eltern angelegten Kindes (Modus A), das seinen Namen selbst vergibt.
   */
  setDisplayName: async (displayName: string): Promise<SoStudyIdentity | null> => {
    await delay(200);
    const current = identityService.getIdentity();
    if (!current) return null;
    const updated: SoStudyIdentity = { ...current, display_name: displayName.trim() };
    persistSession(updated, false);
    return updated;
  },

  /**
   * Setzt/ergänzt die Schul-Daten (Bundesland/Schulform/Klasse). Genutzt vom Schul-Daten-Schritt
   * beim ERSTEN Login eines von Eltern angelegten Kindes, dessen Schul-Daten die Eltern
   * übersprungen haben (Änderung 2). Synchronisiert auch den Familienkonto-Eintrag.
   * SPÄTER: Profil-Update gegen Supabase.
   */
  setSchoolData: async (
    data: { bundesland?: string; schoolType?: string; grade?: string }
  ): Promise<SoStudyIdentity | null> => {
    await delay(200);
    const current = identityService.getIdentity();
    if (!current) return null;
    const updated: SoStudyIdentity = {
      ...current,
      bundesland: data.bundesland ?? current.bundesland,
      schoolType: data.schoolType ?? current.schoolType,
      grade: data.grade ?? current.grade,
    };
    persistSession(updated, false);
    syncFamilyChildSchool(current.userId, updated);
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
   * Setzt die KI-Einwilligung (Drittlandsübermittlung OpenAI/Anthropic/Google).
   * Genutzt vom CompleteProfile-Flow nach dem Dashboard (16+-Pfad, Pflicht zum Abschluss).
   */
  setKiConsent: async (accepted: boolean): Promise<SoStudyIdentity | null> => {
    await delay(150);
    const current = identityService.getIdentity();
    if (!current) return null;
    const updated: SoStudyIdentity = {
      ...current,
      kiConsent: { accepted, timestamp: accepted ? new Date().toISOString() : undefined },
    };
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
      // Auth kommt additiv dazu; der Login-Code bleibt als vollwertige Backup-Methode bestehen.
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
    // Der Login-Code bleibt als Backup bestehen → das Trennen einer Auth-Methode sperrt nie aus.
    const updated: SoStudyIdentity = {
      ...current,
      linkedAuthMethods: (current.linkedAuthMethods ?? []).filter((m) => m !== method),
    };
    persistSession(updated, false);
    return updated;
  },

  /**
   * Schüler ändert seinen eigenen Login-Code (z.B. wenn ihn jemand kennt) — der alte wird
   * ungültig. Gehört das Kind zu einem Familienkonto, zieht der Code im Eltern-Dashboard mit.
   */
  regenerateAnmeldeCode: async (): Promise<SoStudyIdentity | null> => {
    await delay(250);
    const current = identityService.getIdentity();
    if (!current) return null;
    // Reset gegen den Login-Code-Store: alter Code wird deaktiviert, neuer aktiv (Änderung 6).
    const anmeldeCode = loginCodeService.reset(current.userId);
    const updated: SoStudyIdentity = { ...current, anmeldeCode };
    persistSession(updated, false);
    syncFamilyChildCode(current.userId, anmeldeCode);
    return updated;
  },
};
