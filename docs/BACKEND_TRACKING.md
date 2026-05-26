# Backend- & Tracking-Dokumentation (Registrierungs-/Nachhilfe-Flow v6)

> **Status: Prototyp (mock-only).** SoStudy hat noch kein echtes Backend — Auth, Identität,
> Familienkonto, Login-Codes und SMS-OTP laufen über die Service-Schicht in `src/services/*`
> gegen Mock-Daten in `src/mocks/*` (gespiegelt nach `localStorage`). Dieses Dokument hält fest,
> **was das spätere Backend implementieren muss** und **welche Verarbeitungspunkte für die
> Datenschutzerklärung relevant sind**. Die Datenschutzerklärung selbst wird separat juristisch
> erstellt — hier wird nur technisch dokumentiert.

Letzte Aktualisierung: v6-Finalisierung (Änderungen 1–7).

---

## 1. Anmelde-Code-Persistenz (Änderung 6)

**Problem:** Im Prototyp lebt der Anmelde-Code nur in `localStorage`. Nach einem Browser-Reset
(Storage gelöscht) wäre der Code ungültig. Produktiv muss der Code **serverseitig persistent**
und **geräteübergreifend** gültig sein.

**Aktueller Mock-Stand:**
- Store `src/mocks/loginCodes.mock.ts` spiegelt die geplante Tabelle (Felder unten), inkl.
  `last_used_at` (Audit) und `is_active` (Reset). Persistenz via `localStorage`-Schlüssel
  `sostudy_login_codes`.
- Seam `src/services/loginCodeService.ts` mit `generate` / `login` / `reset` bildet die
  geplanten Endpoints ab. `identityService.loginWithAnmeldeCode` validiert **nicht** mehr gegen
  den Frontend-Zustand, sondern über `loginCodeService.login(code)` (Server-Validierungs-Seam).

**Ziel-Datenbanktabelle `login_codes`:**

| Spalte         | Typ               | Hinweise                                              |
|----------------|-------------------|-------------------------------------------------------|
| `code`         | `VARCHAR(16)` PK  | z.B. `MIRA-7K2P` (2 Blöcke à 4 Zeichen, ohne 0/O/1/I/L) |
| `user_uuid`    | `UUID` FK → `users.uuid` | Besitzer des Codes                             |
| `created_at`   | `TIMESTAMP`       | Anlagezeitpunkt                                       |
| `last_used_at` | `TIMESTAMP` NULL  | letzter erfolgreicher Login (Audit)                   |
| `is_active`    | `BOOLEAN`         | `false` nach Reset (alter Code wird ungültig)         |

**API-Endpoints (ersetzen die `loginCodeService`-Methoden 1:1):**
- `POST /api/auth/code/generate` — bei Registrierung; legt einen aktiven Code an.
- `POST /api/auth/code/login` `{ code }` → Session-Token. **Server-Validierung gegen die DB**,
  nicht gegen Frontend-State. Setzt `last_used_at`.
- `POST /api/auth/code/reset` — im Profil-Settings **und** im Familienkonto. Deaktiviert den
  alten Code (`is_active = false`) und legt einen neuen aktiven an.

**Wichtig:** Schüler haben **immer** einen Login-Code (auch mit Apple/Google als zusätzliche
Methode). Der Code wird nie gelöscht, nur regeneriert. Eltern haben **keinen** Login-Code.

---

## 2. Weitere Verarbeitungspunkte

> Wird in der Tracking-Konsolidierung ergänzt (SMS-OTP-Versand, KI-Drittlandsübermittlung,
> Eltern-Magic-Link-Einladung).
