// ===== SOSTUDY IDENTITY MODEL (Onboarding v5) =====
// Kanonisches Datenmodell für den Knowunity-artigen Onboarding-/Auth-Flow.
// Reiner Prototyp: lebt in localStorage + Mock — KEIN echtes Backend.
// SPÄTER: Diese Felder bilden 1:1 die Supabase-Profil-Tabelle ab.

export type UserRole = 'student' | 'parent';

export type AuthMethod = 'apple' | 'google' | 'anmeldeCode' | 'email';

// ===== AKTIVIERUNGS-MODI (Familienkonto / Kind-Anbindung) =====
// Drei Wege, wie ein Kind-Konto an ein Familienkonto kommt:
//   A = Eltern erstellen ein NEUES Kind-Konto (Eltern-first → System generiert Anmelde-Code).
//   B = Bestehendes Kind-Konto per Anmelde-Code VERKNÜPFEN (Kind-first → Eltern hängen sich an).
//   C = Kind per EINLADUNG verknüpfen (Eltern senden Invite-Code, Kind nimmt an).
export type ActivationMode = 'A' | 'B' | 'C';

export type FamilyRole = 'owner' | 'child';

// ===== KI-EINWILLIGUNG =====
// Separate, explizite Einwilligung (Drittlandsübermittlung OpenAI/Anthropic/Google).
export interface KiConsent {
  accepted: boolean;
  timestamp?: string; // ISO — wann zugestimmt wurde (für Audit-Log später)
}

// ===== KANONISCHE IDENTITÄT =====
// Spitzname (display_name) = überall in der Casual-App sichtbar (Pflicht).
// Klarname (real_name)     = NUR im Nachhilfe-/Vertrags-/Familienkonto-Kontext, sonst leer.
export interface SoStudyIdentity {
  userId: string;
  role: UserRole;

  // Zwei-Bubble-Namensmodell
  display_name: string; // Spitzname — '' bis das Kind ihn beim ersten Login selbst vergibt
  real_name: string;    // Klarname — anfangs '' (wird erst bei Tutoring-Aktivierung erforderlich)

  // Schul-Personalisierung (bei Eltern leer)
  bundesland: string;
  schoolType: string;
  grade?: string; // optional / überspringbar im Onboarding

  // Volljährigkeit (Self-Declaration) — steuert die Tutoring-Aktivierungs-Matrix
  volljaehrig: boolean;

  // Anmelde-Code (Anton-Style) — für Login ohne Apple/Google.
  // '' = kein aktiver Code: echte Auth (Apple/Google/E-Mail) löst den teilbaren Code ab.
  anmeldeCode: string;

  // Auth & Consent
  authMethod: AuthMethod;
  // Verknüpfte Social-Logins (nachträglich im Profil verknüpfbar; visuell gemockt)
  linkedAuthMethods?: AuthMethod[];
  kiConsent: KiConsent;
  email?: string; // optional (z.B. bei reinem Anmelde-Code-Pfad nicht vorhanden)
  phone?: string; // verifizierte Telefonnummer — Eltern: Pflicht; 18+-Schüler: für Nachhilfe (Änderung 3/4)

  // ===== FAMILIENKONTO-VERKNÜPFUNG =====
  // - Eltern (role 'parent'):  familyRole 'owner', familyId = eigenes Familienkonto.
  // - Kind   (role 'student'): familyRole 'child', familyId = Familienkonto der Eltern.
  //   Fehlt familyId beim Schüler, ist KEIN Elternkonto verknüpft (relevant für die Tutoring-Matrix).
  familyId?: string;
  familyRole?: FamilyRole;

  createdAt: string; // ISO
}

// ===== FAMILIENKONTO =====
// Ein Elternteil (owner) verwaltet 1..n Kinder. Lebt im familyService-Mock (localStorage).
// SPÄTER: eigene Supabase-Tabelle `families` + `family_members`.
export interface FamilyChild {
  childUserId: string;       // referenziert eine SoStudyIdentity (role 'student')
  display_name: string;      // Spitzname (Anzeige in der Kinder-Liste)
  real_name: string;         // Klarname (für Nachhilfe/Vertrag); '' bis gesetzt
  anmeldeCode: string;       // Login-Code des Kindes (von Eltern verwaltbar); bei E-Mail-Einladung das Invite-Token
  email?: string;            // bei E-Mail-Einladung (Weg ①): Adresse, an die eingeladen wurde
  bundesland?: string;       // Schul-Daten optional: Eltern können sie überspringen → Kind ergänzt sie beim ersten Login
  schoolType?: string;
  grade?: string;
  activationMode: ActivationMode; // wie das Kind angebunden wurde (A/B/C)
  tutoringConsent: boolean;  // Eltern-Einwilligung zur Nachhilfe für dieses Kind
  pending: boolean;          // true = Einladung (Modus C) noch nicht angenommen
  linkedAt: string;          // ISO
}

export interface Familienkonto {
  familyId: string;
  parentUserId: string;
  parentRealName: string;    // Klarname des Elternteils (Pflicht im Vertrags-Kontext)
  parentEmail?: string;      // für den Vertragsversand der Nachhilfe (Änderung 5)
  parentPhone?: string;      // verifizierte Eltern-Telefonnummer für den Rückruf (Änderung 3/5)
  children: FamilyChild[];
  createdAt: string;         // ISO
}

// ===== ONBOARDING-DRAFT (Schüler) =====
// Wird Schritt für Schritt im OnboardingFlow gesammelt und am Ende an
// identityService.registerStudent() übergeben.
export interface OnboardingDraft {
  role: UserRole | null;
  display_name: string;
  bundesland: string;
  schoolType: string;
  grade?: string;
  kiConsentAccepted: boolean;
  authMethod: AuthMethod | null;
  email?: string;
}

export const EMPTY_ONBOARDING_DRAFT: OnboardingDraft = {
  role: null,
  display_name: '',
  bundesland: '',
  schoolType: '',
  grade: undefined,
  kiConsentAccepted: false,
  authMethod: null,
  email: undefined,
};

// ===== ONBOARDING-DRAFT (Eltern, E1–E8) =====
// Eltern arbeiten im Klarname-Kontext (Vertrag/Familienkonto) — daher real_name statt Spitzname.
export interface ParentOnboardingDraft {
  real_name: string;          // Klarname des Elternteils (Pflicht)
  phone?: string;             // verifizierte Telefonnummer (Pflicht, per SMS-OTP) — Änderung 3
  email?: string;
  kiConsentAccepted: boolean;
  authMethod: AuthMethod | null;
}

export const EMPTY_PARENT_ONBOARDING_DRAFT: ParentOnboardingDraft = {
  real_name: '',
  phone: undefined,
  email: undefined,
  kiConsentAccepted: false,
  authMethod: null,
};
