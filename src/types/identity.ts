// ===== SOSTUDY IDENTITY MODEL (Onboarding v5) =====
// Kanonisches Datenmodell für den Knowunity-artigen Onboarding-/Auth-Flow.
// Reiner Prototyp: lebt in localStorage + Mock — KEIN echtes Backend.
// SPÄTER: Diese Felder bilden 1:1 die Supabase-Profil-Tabelle ab.

export type UserRole = 'student' | 'parent';

export type AuthMethod = 'apple' | 'google' | 'anmeldeCode' | 'email';

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
  display_name: string; // Spitzname — Pflicht
  real_name: string;    // Klarname — anfangs '' (wird erst bei Tutoring-Aktivierung erforderlich)

  // Schul-Personalisierung
  bundesland: string;
  schoolType: string;
  grade?: string; // optional / überspringbar im Onboarding

  // Volljährigkeit (Self-Declaration) — steuert die Tutoring-Aktivierungs-Matrix
  volljaehrig: boolean;

  // Anmelde-Code (Anton-Style, permanent) — für Login ohne Apple/Google
  anmeldeCode: string;

  // Auth & Consent
  authMethod: AuthMethod;
  kiConsent: KiConsent;
  email?: string; // optional (z.B. bei reinem Anmelde-Code-Pfad nicht vorhanden)

  createdAt: string; // ISO
}

// ===== ONBOARDING-DRAFT =====
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
