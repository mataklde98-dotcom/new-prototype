// ===== LOGIN-CODE SERVICE (Onboarding v5 — Änderung 6) =====
// Service-Seam für die persistente Anmelde-Code-Verwaltung. Spiegelt die geplanten Endpoints:
//   POST /api/auth/code/generate  → generate(userUuid)
//   POST /api/auth/code/login      → login(code)   (Server-Validierung gegen DB, NICHT Frontend-State)
//   POST /api/auth/code/reset      → reset(userUuid)
// JETZT: Mock gegen MOCK_LOGIN_CODES (localStorage). SPÄTER: echte API-Calls — die Aufrufer
// (identityService/familyService) bleiben unverändert. Details: docs/BACKEND_TRACKING.md.

import {
  MOCK_LOGIN_CODES,
  findActiveLoginCode,
  recordLoginCode,
  deactivateUserLoginCodes,
  touchLoginCode,
} from '@/mocks/loginCodes.mock';
import { generateAnmeldeCode, findIdentityByAnmeldeCode } from '@/mocks/identity.mock';

export const loginCodeService = {
  /** Erzeugt einen neuen aktiven Code für den Nutzer; vorhandene werden deaktiviert. */
  generate: (userUuid: string): string => {
    deactivateUserLoginCodes(userUuid);
    let code = generateAnmeldeCode();
    while (MOCK_LOGIN_CODES[code.toUpperCase()]) code = generateAnmeldeCode(); // Kollision vermeiden
    recordLoginCode(code, userUuid);
    return code;
  },

  /** Code-Reset (Profil-Settings + Familienkonto) — semantisch identisch zu generate. */
  reset: (userUuid: string): string => loginCodeService.generate(userUuid),

  /**
   * Server-seitige Code-Validierung (Änderung 6): aktiver Code → userUuid, last_used_at wird
   * aktualisiert. Self-Healing: fehlt der Code (noch) im Store, ist er aber an einer Identität
   * hinterlegt, wird er als aktiv nachgetragen — hält den Prototyp-Login robust.
   */
  login: (code: string): string | null => {
    const active = findActiveLoginCode(code);
    if (active) {
      touchLoginCode(code);
      return active.userUuid;
    }
    const identity = findIdentityByAnmeldeCode(code);
    if (identity?.anmeldeCode) {
      recordLoginCode(identity.anmeldeCode, identity.userId);
      touchLoginCode(identity.anmeldeCode);
      return identity.userId;
    }
    return null;
  },
};
