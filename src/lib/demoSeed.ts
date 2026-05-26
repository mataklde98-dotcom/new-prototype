// ===== DEMO-SEEDING (Onboarding v5) =====
// "Gold für Präsentationen": Pro Knopfdruck einen exakt definierten App-Zustand herstellen.
// Schreibt deterministisch die Mock-Stores + Session nach localStorage und lädt neu.
// Reiner Prototyp-Helfer (Development/Demo) — kein Backend.

import type {
  SoStudyIdentity,
  Familienkonto,
  FamilyChild,
  ActivationMode,
} from '@/types/identity';
import { getDefaultIdentities } from '@/mocks/identity.mock';
import { getDefaultFamilies } from '@/mocks/family.mock';
import { identityToUserData } from '@/services/identityService';
import type { TutoringStatus } from '@/contexts/UserContext';

// Kanonische Demo-IDs (entsprechen den Mock-Usern in src/lib/auth.ts + identity.mock.ts)
const ALEX = 'user_alexanderbaum_mock_123';
const MAXI = 'user_newuser_mock_456';
const PARENT = 'user_parent_mock_789';
const FAM = 'fam_mock_001';

const ISO = '2026-01-01T00:00:00.000Z';

// localStorage-Keys, die ein Preset zurücksetzt (user-scoped Karteikarten-Keys bleiben erhalten).
const DEMO_KEYS = [
  'isLoggedIn',
  'userData',
  'sostudy_identity',
  'sostudy_identities',
  'sostudy_families',
  'isNewRegistration',
  'tutoringStatus',
  'tutoringRequestData',
  'userName',
  'userAccountData',
  'userProfileImage',
  'trialStartedAt',
  'hasSeededTestUser',
];

interface StateSpec {
  identities: Record<string, SoStudyIdentity>;
  families: Record<string, Familienkonto>;
  sessionUserId?: string;        // undefined = ausgeloggt (Onboarding sichtbar)
  tutoringStatus?: TutoringStatus;
  isNewRegistration?: boolean;   // zeigt das Trial-Popup nach "Registrierung"
}

export interface DemoPreset {
  id: string;
  group: string;
  emoji: string;
  label: string;
  hint: string;
  build: () => StateSpec;
}

// ===== HELFER =====
function childEntry(idy: SoStudyIdentity, mode: ActivationMode, consent: boolean): FamilyChild {
  return {
    childUserId: idy.userId,
    display_name: idy.display_name,
    real_name: idy.real_name,
    anmeldeCode: idy.anmeldeCode,
    schoolType: idy.schoolType,
    grade: idy.grade,
    activationMode: mode,
    tutoringConsent: consent,
    pending: false,
    linkedAt: ISO,
  };
}

function pendingEntry(name: string, inviteCode: string): FamilyChild {
  return {
    childUserId: `pending_${name.toLowerCase()}`,
    display_name: name,
    real_name: '',
    anmeldeCode: inviteCode,
    activationMode: 'C',
    tutoringConsent: false,
    pending: true,
    linkedAt: ISO,
  };
}

function student(userId: string, over: Partial<SoStudyIdentity>): SoStudyIdentity {
  return {
    userId,
    role: 'student',
    display_name: 'Demo',
    real_name: '',
    bundesland: 'Bayern',
    schoolType: 'Gymnasium',
    grade: '9',
    volljaehrig: false,
    anmeldeCode: 'DEMO-0000',
    authMethod: 'anmeldeCode',
    linkedAuthMethods: [],
    kiConsent: { accepted: true, timestamp: ISO },
    createdAt: ISO,
    ...over,
  };
}

// ===== PRESETS =====
export const DEMO_PRESETS: DemoPreset[] = [
  // ---------- Schüler (Casual-App) ----------
  {
    id: 'fresh-student',
    group: 'Schüler',
    emoji: '🆕',
    label: 'Frischer Schüler (Day-0)',
    hint: 'Maxi, kein Klarname, gerade registriert → Trial-Popup + Klarname-Gate',
    build: () => {
      const identities = getDefaultIdentities();
      identities[MAXI] = {
        ...identities[MAXI],
        real_name: '',
        volljaehrig: false,
        familyId: undefined,
        familyRole: undefined,
      };
      return {
        identities,
        families: getDefaultFamilies(),
        sessionUserId: MAXI,
        tutoringStatus: 'notActivated',
        isNewRegistration: true,
      };
    },
  },
  {
    id: 'student-full',
    group: 'Schüler',
    emoji: '🎓',
    label: 'Schüler mit vollem Profil',
    hint: 'Alex, Klarname gesetzt, volle Mock-Daten',
    build: () => ({
      identities: getDefaultIdentities(),
      families: getDefaultFamilies(),
      sessionUserId: ALEX,
      tutoringStatus: 'notActivated',
    }),
  },

  // ---------- Tutoring 4-Felder-Matrix (Alter × Elternkonto) ----------
  {
    id: 'matrix-minor-noparent',
    group: 'Tutoring-Matrix',
    emoji: '🔒',
    label: 'Minderjährig · kein Elternkonto',
    hint: 'Tutoring → Eltern-Einladung nötig',
    build: () => {
      const identities = getDefaultIdentities();
      identities[ALEX] = { ...identities[ALEX], volljaehrig: false, familyId: undefined, familyRole: undefined };
      return { identities, families: getDefaultFamilies(), sessionUserId: ALEX, tutoringStatus: 'notActivated' };
    },
  },
  {
    id: 'matrix-minor-parent',
    group: 'Tutoring-Matrix',
    emoji: '👨‍👩‍👧',
    label: 'Minderjährig · Elternkonto verknüpft',
    hint: 'Tutoring → Eltern-Einwilligung anfragen (noch ausstehend)',
    build: () => {
      const identities = getDefaultIdentities();
      identities[ALEX] = { ...identities[ALEX], volljaehrig: false, familyId: FAM, familyRole: 'child' };
      const families = getDefaultFamilies();
      // Alex als zweites Kind unter Sabines Familienkonto, Einwilligung noch NICHT erteilt.
      families[FAM] = {
        ...families[FAM],
        children: [...families[FAM].children, childEntry(identities[ALEX], 'B', false)],
      };
      return { identities, families, sessionUserId: ALEX, tutoringStatus: 'notActivated' };
    },
  },
  {
    id: 'matrix-adult-noparent',
    group: 'Tutoring-Matrix',
    emoji: '🔞',
    label: 'Volljährig · kein Elternkonto',
    hint: 'Tutoring → direkt selbst aktivierbar',
    build: () => {
      const identities = getDefaultIdentities();
      identities[ALEX] = { ...identities[ALEX], volljaehrig: true, familyId: undefined, familyRole: undefined };
      return { identities, families: getDefaultFamilies(), sessionUserId: ALEX, tutoringStatus: 'notActivated' };
    },
  },
  {
    id: 'matrix-adult-parent',
    group: 'Tutoring-Matrix',
    emoji: '🧑‍🎓',
    label: 'Volljährig · Elternkonto verknüpft',
    hint: 'Tutoring → selbst aktivierbar, Eltern informativ',
    build: () => {
      const identities = getDefaultIdentities();
      identities[ALEX] = { ...identities[ALEX], volljaehrig: true, familyId: FAM, familyRole: 'child' };
      const families = getDefaultFamilies();
      families[FAM] = {
        ...families[FAM],
        children: [...families[FAM].children, childEntry(identities[ALEX], 'B', true)],
      };
      return { identities, families, sessionUserId: ALEX, tutoringStatus: 'notActivated' };
    },
  },

  // ---------- Eltern / Familienkonto ----------
  {
    id: 'parent-empty',
    group: 'Eltern',
    emoji: '👤',
    label: 'Elternteil · noch kein Kind',
    hint: 'Sabine, leeres Familienkonto → erstes Kind hinzufügen demonstrieren',
    build: () => {
      const families = getDefaultFamilies();
      families[FAM] = { ...families[FAM], children: [] };
      return { identities: getDefaultIdentities(), families, sessionUserId: PARENT };
    },
  },
  {
    id: 'parent-1child',
    group: 'Eltern',
    emoji: '🧑‍🤝‍🧑',
    label: 'Elternteil · 1 Kind',
    hint: 'Sabine + Lena (Modus A, Einwilligung erteilt)',
    build: () => ({
      identities: getDefaultIdentities(),
      families: getDefaultFamilies(),
      sessionUserId: PARENT,
    }),
  },
  {
    id: 'parent-3children',
    group: 'Eltern',
    emoji: '👨‍👩‍👧‍👦',
    label: 'Elternteil · 3 Kinder (Multi)',
    hint: 'Lena (A), Tim (B), Nina (C, Einladung offen) — gemischte Einwilligung',
    build: () => {
      const identities = getDefaultIdentities();
      // Zusätzliches verknüpftes Kind "Tim" (Modus B)
      const tim = student('user_demo_tim_001', {
        display_name: 'Tim',
        real_name: 'Tim Baum',
        grade: '5',
        schoolType: 'Realschule',
        anmeldeCode: 'TIM-5H2N',
        familyId: FAM,
        familyRole: 'child',
      });
      identities[tim.userId] = tim;

      const families = getDefaultFamilies();
      const lena = families[FAM].children[0]; // Lena (Modus A, consent true)
      families[FAM] = {
        ...families[FAM],
        children: [
          lena,
          childEntry(tim, 'B', false),                  // Einwilligung ausstehend
          pendingEntry('Nina', 'EINLADUNG-7K2P9Q'),     // Modus C, Einladung offen
        ],
      };
      return { identities, families, sessionUserId: PARENT };
    },
  },

  // ---------- Allgemein ----------
  {
    id: 'onboarding',
    group: 'Allgemein',
    emoji: '🚪',
    label: 'Ausgeloggt · Onboarding ansehen',
    hint: 'Zeigt den Onboarding-Einstieg (Code-Login bleibt nutzbar)',
    build: () => ({
      identities: getDefaultIdentities(),
      families: getDefaultFamilies(),
      sessionUserId: undefined,
    }),
  },
  {
    id: 'reset',
    group: 'Allgemein',
    emoji: '♻️',
    label: 'Alles zurücksetzen',
    hint: 'Löscht alle Demo-Daten → frischer Default-Zustand',
    build: () => ({
      identities: getDefaultIdentities(),
      families: getDefaultFamilies(),
      sessionUserId: undefined,
    }),
  },
];

// ===== ANWENDEN =====
function writeState(spec: StateSpec, opts: { keepStores?: boolean } = {}): void {
  if (typeof localStorage === 'undefined') return;

  // 1) Demo-Keys räumen
  DEMO_KEYS.forEach((k) => localStorage.removeItem(k));

  // 2) Mock-Stores schreiben (außer beim harten Reset, der die Defaults beim Reload neu aufbaut)
  if (!opts.keepStores) {
    localStorage.setItem('sostudy_identities', JSON.stringify(spec.identities));
    localStorage.setItem('sostudy_families', JSON.stringify(spec.families));
  }

  // 3) Session setzen (oder ausgeloggt lassen)
  if (spec.sessionUserId) {
    const identity = spec.identities[spec.sessionUserId];
    if (identity) {
      localStorage.setItem('sostudy_identity', JSON.stringify(identity));
      localStorage.setItem('userData', JSON.stringify(identityToUserData(identity)));
      localStorage.setItem('isLoggedIn', 'true');
    }
  }

  // 4) Optionale Zusatz-Flags
  if (spec.tutoringStatus) localStorage.setItem('tutoringStatus', spec.tutoringStatus);
  if (spec.isNewRegistration) localStorage.setItem('isNewRegistration', 'true');
}

/** Wendet ein Preset an und lädt die App neu (Stores hydrieren beim Reload aus localStorage). */
export function applyDemoPreset(id: string): void {
  const preset = DEMO_PRESETS.find((p) => p.id === id);
  if (!preset) return;

  const spec = preset.build();
  // Harter Reset: nur Keys löschen, Stores NICHT neu schreiben → Defaults beim Reload.
  writeState(spec, { keepStores: id === 'reset' });

  if (typeof window !== 'undefined') window.location.reload();
}

/**
 * Deep-Link: `?demo=<presetId>` beim Laden anwenden (bookmark-bare Demo-Zustände).
 * Schreibt den Zustand, entfernt den Query-Parameter und lädt EINMAL neu.
 * Rückgabe true = es wird neu geladen (Aufrufer sollte das Rendern überspringen).
 */
export function applyDemoFromQuery(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('demo');
  if (!id) return false;

  // Parameter immer entfernen (auch bei ungültiger ID) → keine Reload-Schleife.
  params.delete('demo');
  const search = params.toString();
  const cleanUrl = window.location.pathname + (search ? `?${search}` : '') + window.location.hash;

  const preset = DEMO_PRESETS.find((p) => p.id === id);
  if (!preset) {
    window.history.replaceState({}, '', cleanUrl);
    return false;
  }

  writeState(preset.build(), { keepStores: id === 'reset' });
  window.history.replaceState({}, '', cleanUrl);
  window.location.reload();
  return true;
}
