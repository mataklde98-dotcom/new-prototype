// ===== FAMILY MOCK DATA (Onboarding v5 — Familienkonto) =====
// Mutierbarer In-Memory-Store für Familienkonten (Eltern → Kinder), wie identity.mock.ts
// mit localStorage-Spiegel, damit zur Laufzeit angelegte Familien einen Reload überleben.
// SPÄTER: Supabase-Tabellen `families` + `family_members`.

import type { Familienkonto } from '@/types/identity';

// ===== ID-/CODE-GENERATOREN =====
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateFamilyId(): string {
  return `fam_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Einladungs-Code (Modus C) — kurz, gut abschreibbar, mit erkennbarem Präfix. */
export function generateInviteCode(): string {
  const block = Array.from({ length: 6 }, () =>
    CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  ).join('');
  return `EINLADUNG-${block}`;
}

// ===== VORBEFÜLLTES DEMO-FAMILIENKONTO =====
// Konsistent zu den Demo-Identitäten in identity.mock.ts (Elternteil Sabine + Kind Lena).
const DEFAULT_FAMILIES: Record<string, Familienkonto> = {
  fam_mock_001: {
    familyId: 'fam_mock_001',
    parentUserId: 'user_parent_mock_789',
    parentRealName: 'Sabine Baum',
    parentEmail: 'parent@sostudytest.com',
    parentPhone: '+49 151 23456789',
    createdAt: '2026-01-01T00:00:00.000Z',
    children: [
      {
        childUserId: 'user_child_mock_790',
        display_name: 'Lena',
        real_name: 'Lena Baum',
        anmeldeCode: 'LENA-3F8K',
        bundesland: 'Bayern',
        schoolType: 'Gymnasium',
        grade: '7',
        activationMode: 'A',
        tutoringConsent: true,
        pending: false,
        linkedAt: '2026-01-01T00:00:00.000Z',
      },
    ],
  },
};

// ===== PERSISTENZ-LAYER (localStorage-Spiegel) =====
const FAMILIES_KEY = 'sostudy_families';

function hydrateFamilies(): Record<string, Familienkonto> {
  if (typeof localStorage === 'undefined') return structuredCloneSafe(DEFAULT_FAMILIES);
  try {
    const raw = localStorage.getItem(FAMILIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, Familienkonto>;
      return { ...structuredCloneSafe(DEFAULT_FAMILIES), ...parsed };
    }
  } catch {
    /* ignore */
  }
  return structuredCloneSafe(DEFAULT_FAMILIES);
}

function structuredCloneSafe<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const MOCK_FAMILIES: Record<string, Familienkonto> = hydrateFamilies();

/** Tiefe Kopie der Default-Familienkonten (Basis fürs Demo-Seeding). */
export function getDefaultFamilies(): Record<string, Familienkonto> {
  return structuredCloneSafe(DEFAULT_FAMILIES);
}

/** Spiegelt den Store nach localStorage (von familyService nach Mutationen aufgerufen). */
export function persistFamilies(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(FAMILIES_KEY, JSON.stringify(MOCK_FAMILIES));
  } catch {
    /* ignore */
  }
}

// ===== HELPER =====
export function findFamilyById(familyId: string): Familienkonto | null {
  return MOCK_FAMILIES[familyId] ?? null;
}

export function findFamilyByParent(parentUserId: string): Familienkonto | null {
  return (
    Object.values(MOCK_FAMILIES).find((f) => f.parentUserId === parentUserId) ?? null
  );
}

/** Sucht das Familienkonto, das ein offenes Einladungs-Token (Modus C) trägt. */
export function findFamilyByInviteCode(inviteCode: string): Familienkonto | null {
  const normalized = inviteCode.trim().toUpperCase();
  return (
    Object.values(MOCK_FAMILIES).find((f) =>
      f.children.some((c) => c.pending && c.anmeldeCode.toUpperCase() === normalized)
    ) ?? null
  );
}
