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

## 2. SMS-OTP-Verifikation (Änderung 3 + 4)

Telefonnummern werden per 6-stelligem SMS-Code verifiziert: bei der **Eltern-Registrierung**
(Pflichtfeld vor der Auth) und beim **18+-Schüler** vor der Nachhilfe-Anfrage.

**Aktueller Mock-Stand:**
- `src/services/otpService.ts` (Code clientseitig erzeugt, 10 Min gültig, 3 Fehlversuche → neuer
  Code) + `usePhoneOtp`-Hook + `PhoneOtpFields`. Der Code wird **im Demo-UI angezeigt** (keine
  echte SMS). 60-Sekunden-Resend-Timer.

**Backend-Anforderung:**
- Code **serverseitig** generieren und mit Ablaufzeit (10 Min) speichern; Versand über einen
  SMS-Dienstleister (**Twilio** oder Vonage). Server-Validierung, kein Client-Vergleich.
- Endpoints (Vorschlag): `POST /api/auth/phone/send-otp`, `POST /api/auth/phone/verify-otp`.
- Drei Fehlversuche → Code invalidieren, neuer Code nötig.

**DSGVO-Klausel (für die Datenschutzerklärung):**
> „Zur Verifikation deiner Telefonnummer übermitteln wir den 6-stelligen Code an unseren
> SMS-Dienstleister Twilio (Irland/Deutschland). Die Telefonnummer wird zur Erfüllung des Vertrags
> gemäß Art. 6 Abs. 1 lit. b DSGVO verarbeitet."

---

## 3. KI-Drittlandsübermittlung (Änderung 1)

Die Lernfunktionen nutzen KI-Anbieter (**OpenAI, Anthropic, Google**) als Kernfunktion.

- **Rechtsgrundlage Verarbeitung:** Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung — KI ist das
  Kernangebot, daher keine separate, widerrufbare Einwilligung für die Verarbeitung selbst →
  vermeidet das Kopplungsverbot, Art. 7 Abs. 4).
- **Rechtsgrundlage Drittlandsübermittlung (USA):** Art. 49 Abs. 1 lit. a DSGVO (ausdrückliche
  Einwilligung in die Übermittlung), abgefragt im KI-Consent-Schritt mit „Zustimmen & weiter".
- **Tracking:** `kiConsent.accepted` + `kiConsent.timestamp` werden pro Identität gespeichert
  (Audit). Eltern willigen beim Anlegen/Einladen eines Kindes in dessen Namen ein.

---

## 4. Eltern-Einladung per Magic-Link (Änderung 7, Pfad 4)

Ein **selbst-registrierter Schüler unter 18 ohne Familienkonto** lädt seine Eltern per E-Mail ein,
ein Familienkonto zu erstellen und die Nachhilfe freizugeben.

**Aktueller Mock-Stand:**
- `src/mocks/parentInvites.mock.ts` + `src/services/parentInviteService.ts`
  (create / resend / changeEmail / withdraw / accept), localStorage-Schlüssel
  `sostudy_parent_invites`. Magic-Link-Versand ist **gemockt** (Token im Frontend,
  Demo-Öffnen über `?parentinvite=<token>`).

**Ziel-Datenbanktabelle `parent_invites`:**

| Spalte           | Typ            | Hinweise                                  |
|------------------|----------------|-------------------------------------------|
| `token`          | `VARCHAR` PK   | Magic-Link-Token                          |
| `student_uuid`   | `UUID` FK      | wer eingeladen hat                        |
| `parent_email`   | `VARCHAR`      | Einladungsadresse (wird Vertrags-E-Mail)  |
| `parent_mobile`  | `VARCHAR` NULL | optional, SMS-Backup                      |
| `status`         | `ENUM`         | `pending` / `accepted` / `withdrawn`      |
| `created_at`     | `TIMESTAMP`    |                                           |
| `updated_at`     | `TIMESTAMP`    | Resend / Statuswechsel                    |

**Backend-Anforderung:** Magic-Link per E-Mail (und optional SMS-Backup an `parent_mobile`)
versenden. Beim Annehmen: Eltern-Konto + Familienkonto anlegen, Schüler verknüpfen,
Nachhilfe-Einwilligung setzen, Einladung auf `accepted`.

**DSGVO-Klausel (für die Datenschutzerklärung):** Versand der Einladungs-E-Mail/SMS an die vom
Schüler angegebene Eltern-Adresse zur Anbahnung des Nachhilfe-Vertrags (Art. 6 Abs. 1 lit. b DSGVO).

---

## 5. Übersicht: DSGVO-relevante Verarbeitungspunkte

Für die spätere juristische Datenschutzerklärung relevant:

| Punkt                         | Datenarten                         | Dienstleister / Drittland         | Rechtsgrundlage                          |
|-------------------------------|------------------------------------|-----------------------------------|------------------------------------------|
| KI-Lernfunktionen             | Nutzereingaben                     | OpenAI / Anthropic / Google (USA) | Art. 6 (1) b; Drittland: Art. 49 (1) a   |
| SMS-OTP-Versand               | Telefonnummer, 6-stelliger Code    | Twilio (Irland/DE)                | Art. 6 (1) b                             |
| Anmelde-Code-Speicherung      | Code, user_uuid, Login-Zeitpunkte  | eigenes Backend                   | Art. 6 (1) b                             |
| Eltern-Einladung (Magic-Link) | Eltern-E-Mail, optional Mobilnr.   | E-Mail-/SMS-Provider              | Art. 6 (1) b                             |
| Klarname/Kontakt (Nachhilfe)  | Vor-/Nachname, E-Mail, Telefon     | eigenes Backend                   | Art. 6 (1) b                             |

> Hinweis Spitzname/Klarname: Der **Spitzname** (`display_name`) treibt die Casual-App-UI; der
> **Klarname** (`real_name`) wird nur im Nachhilfe-/Vertrags-/Familienkonto-Kontext verarbeitet.

---

## 6. Offene Punkte / spätere Schritte

- Klassenstufen-Liste um „Universität", „Ausbildung", „Sonstige" erweitern (bewusst noch nicht umgesetzt).
- Datenschutzerklärung wird separat juristisch erstellt (nutzt obige Tracking-Punkte als Input).
