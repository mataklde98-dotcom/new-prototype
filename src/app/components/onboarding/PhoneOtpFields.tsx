// ===== PHONE / OTP FELDER (Onboarding v5 — Änderung 3) =====
// Rein präsentationale Bausteine für die Telefon-Verifikation, gesteuert vom usePhoneOtp-Hook.
// Wiederverwendet im Eltern-Onboarding und im 18+-Schüler-Tutoring-Flow (Änderung 4).
// Die Aktions-Buttons ("Code senden" / "Bestätigen") liefert der jeweilige Host.
//
// Hinweis: Die "Demo — dein SMS-Code"-Box zeigt den Code im UI, weil im Prototyp keine echte SMS
// versandt wird. Im Produktivbetrieb (Twilio) entfällt diese Box.

import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { COUNTRY_CODES, type PhoneOtpController } from '@/hooks/usePhoneOtp';

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-red-300 px-1">{children}</p>;
}

/** Schritt 1: Ländervorwahl + Telefonnummer. */
export function PhoneEntryFields({ otp }: { otp: PhoneOtpController }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative shrink-0">
          <select
            value={otp.countryCode}
            onChange={(e) => otp.setCountryCode(e.target.value)}
            className="appearance-none h-full pl-3.5 pr-8 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white font-['Poppins:Medium',sans-serif] outline-none focus:border-[#009379] transition-colors"
            style={{ fontSize: 16 }}
            aria-label="Ländervorwahl"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code} style={{ color: '#000' }}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-white/45 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          autoFocus
          value={otp.phone}
          // Prototyp: beliebige Eingabe erlaubt (Ziffern, +, -, Klammern, Leerzeichen …) — kein Strippen.
          onChange={(e) => otp.setPhone(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') otp.sendCode(); }}
          placeholder="151 23456789"
          className="flex-1 min-w-0 px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white font-['Poppins:Medium',sans-serif] outline-none focus:border-[#009379] transition-colors"
          style={{ fontSize: 16 }}
        />
      </div>
      {otp.error && <ErrorText>{otp.error}</ErrorText>}
    </div>
  );
}

/** Schritt 2: 6-stelliger Code (autofocus, autocomplete, autoformat) + Resend-Timer. */
export function OtpEntryFields({ otp }: { otp: PhoneOtpController }) {
  return (
    <div className="space-y-4">
      {/* Demo-Anzeige (im Produktivbetrieb entfernt) */}
      <div
        className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl"
        style={{ background: 'rgba(0,184,148,0.08)', border: '1px solid rgba(0,184,148,0.20)' }}
      >
        <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50">Demo — dein SMS-Code:</span>
        <span className="font-['Poppins:Bold',sans-serif] text-[16px] tracking-[0.25em] text-white">{otp.demoCode}</span>
      </div>

      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        maxLength={6}
        value={otp.otp}
        onChange={(e) => otp.setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        onKeyDown={(e) => { if (e.key === 'Enter') otp.verify(); }}
        placeholder="••••••"
        className="w-full px-5 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white text-center font-['Poppins:Bold',sans-serif] tracking-[0.4em] placeholder:tracking-[0.3em] placeholder:text-white/25 outline-none focus:border-[#009379] transition-colors"
        style={{ fontSize: 26 }}
      />

      {otp.error && <ErrorText>{otp.error}</ErrorText>}

      <div className="text-center">
        {otp.resendIn > 0 ? (
          <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/35">
            Code erneut senden in {otp.resendIn}s
          </span>
        ) : (
          <button
            onClick={otp.sendCode}
            disabled={otp.busy}
            className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/55 active:text-white/85 transition-colors disabled:opacity-50"
          >
            Code erneut senden
          </button>
        )}
      </div>
    </div>
  );
}

/** Bestätigte Nummer (grüner Zustand) + "Nummer ändern". */
export function PhoneVerifiedRow({ otp }: { otp: PhoneOtpController }) {
  return (
    <div className="space-y-3">
      <div
        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
        style={{ background: 'rgba(0,184,148,0.10)', border: '1px solid rgba(0,184,148,0.25)' }}
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(0,184,148,0.20)' }}>
          <Check className="w-4 h-4" style={{ color: '#00B894' }} />
        </div>
        <span className="font-['Poppins:Medium',sans-serif] text-[15px] text-white">{otp.fullPhone}</span>
      </div>
      <button
        onClick={otp.changeNumber}
        className="w-full text-center py-2 font-['Poppins:Medium',sans-serif] text-[14px] text-white/45 active:text-white/70 transition-colors"
      >
        Nummer ändern
      </button>
    </div>
  );
}
