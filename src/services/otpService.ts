// ===== OTP SERVICE (Onboarding v5 — Änderung 3, gemockt) =====
// SMS-OTP-Verifikation für Telefonnummern (Eltern-Registrierung + 18+-Schüler-Tutoring).
// JETZT: reiner Mock — der Code wird NICHT per SMS versandt, sondern im Demo-UI angezeigt.
// SPÄTER: serverseitige Code-Generierung + Versand via Twilio/Vonage. Der Code muss serverseitig
// mit Ablaufzeit gespeichert und gegen die DB geprüft werden (siehe docs/BACKEND_TRACKING.md).
//
// Verhalten gemäß Spezifikation:
//   - 6-stelliger Code, 10 Minuten gültig.
//   - Falscher Code → Fehlermeldung. Drei Fehlversuche → neuer Code nötig.

const OTP_TTL_MS = 10 * 60 * 1000; // 10 Minuten
const MAX_ATTEMPTS = 3;

interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Pro (normalisierter) Telefonnummer ein offener Code. In-Memory — reicht für den Prototyp.
const otpStore: Record<string, OtpEntry> = {};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const normalize = (phone: string) => phone.replace(/\s+/g, '');
const gen6 = () => String(Math.floor(100000 + Math.random() * 900000));

export type OtpVerifyReason = 'wrong' | 'expired' | 'too_many' | 'no_code';

export const otpService = {
  /**
   * Fordert einen neuen Code an. Mock: erzeugt den Code clientseitig und gibt ihn zur
   * Demo-Anzeige zurück. SPÄTER: POST /api/auth/phone/send-otp (Twilio versendet die SMS).
   */
  requestCode: async (phone: string): Promise<{ ok: boolean; code: string }> => {
    await delay(500); // simulierter SMS-Versand
    const code = gen6();
    otpStore[normalize(phone)] = { code, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 };
    return { ok: true, code };
  },

  /**
   * Prüft den eingegebenen Code gegen den gespeicherten Eintrag.
   * SPÄTER: POST /api/auth/phone/verify-otp (Server-Validierung, kein Client-Vergleich).
   */
  verifyCode: async (
    phone: string,
    input: string
  ): Promise<{ ok: boolean; reason?: OtpVerifyReason }> => {
    await delay(350);
    const key = normalize(phone);
    const entry = otpStore[key];
    if (!entry) return { ok: false, reason: 'no_code' };
    if (Date.now() > entry.expiresAt) {
      delete otpStore[key];
      return { ok: false, reason: 'expired' };
    }
    if (entry.code === input.trim()) {
      delete otpStore[key];
      return { ok: true };
    }
    entry.attempts += 1;
    if (entry.attempts >= MAX_ATTEMPTS) {
      delete otpStore[key]; // nach 3 Fehlversuchen muss ein neuer Code angefordert werden
      return { ok: false, reason: 'too_many' };
    }
    return { ok: false, reason: 'wrong' };
  },
};
