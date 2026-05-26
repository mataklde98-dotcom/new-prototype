// ===== usePhoneOtp (Onboarding v5 — Änderung 3) =====
// Wiederverwendbare Logik für Telefonnummer-Eingabe + SMS-OTP-Verifikation.
// Genutzt im Eltern-Onboarding (Telefon-Pflichtfeld) UND im 18+-Schüler-Tutoring-Flow (Änderung 4).
// Die UI dazu liefert PhoneOtpFields (rein präsentational); die Aktions-Buttons stellt der Host.

import { useState, useEffect, useRef, useCallback } from 'react';
import { otpService, type OtpVerifyReason } from '@/services/otpService';

// Ländervorwahl-Picker, default +49. Kompakte Auswahl (Prototyp).
export const COUNTRY_CODES: { code: string; flag: string; label: string }[] = [
  { code: '+49', flag: '🇩🇪', label: 'Deutschland' },
  { code: '+43', flag: '🇦🇹', label: 'Österreich' },
  { code: '+41', flag: '🇨🇭', label: 'Schweiz' },
  { code: '+31', flag: '🇳🇱', label: 'Niederlande' },
  { code: '+33', flag: '🇫🇷', label: 'Frankreich' },
  { code: '+39', flag: '🇮🇹', label: 'Italien' },
  { code: '+34', flag: '🇪🇸', label: 'Spanien' },
  { code: '+44', flag: '🇬🇧', label: 'Vereinigtes Königreich' },
  { code: '+90', flag: '🇹🇷', label: 'Türkei' },
  { code: '+48', flag: '🇵🇱', label: 'Polen' },
];

const RESEND_SECONDS = 60;

export function usePhoneOtp(onVerified?: (fullPhone: string) => void) {
  const [countryCode, setCountryCode] = useState('+49');
  const [phone, setPhone] = useState('');
  const [stage, setStage] = useState<'enter' | 'verify' | 'verified'>('enter');
  const [otp, setOtp] = useState('');
  const [demoCode, setDemoCode] = useState(''); // nur Demo-Anzeige (Mock)
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  const fullPhone = `${countryCode} ${phone.trim()}`.trim();
  const phoneValid = phone.replace(/\D/g, '').length >= 6;

  // onVerified per Ref → stabile verify-Callback ohne Stale-Closure.
  const onVerifiedRef = useRef(onVerified);
  useEffect(() => { onVerifiedRef.current = onVerified; });

  // Resend-Countdown (60s)
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const sendCode = useCallback(async () => {
    if (!phoneValid || busy) return;
    setError('');
    setBusy(true);
    const res = await otpService.requestCode(fullPhone);
    setBusy(false);
    if (res.ok) {
      setDemoCode(res.code);
      setStage('verify');
      setOtp('');
      setResendIn(RESEND_SECONDS);
    } else {
      setError('Code konnte nicht gesendet werden.');
    }
  }, [fullPhone, phoneValid, busy]);

  const verify = useCallback(async () => {
    if (otp.length !== 6 || busy) return;
    setError('');
    setBusy(true);
    const res = await otpService.verifyCode(fullPhone, otp);
    setBusy(false);
    if (res.ok) {
      setStage('verified');
      onVerifiedRef.current?.(fullPhone);
      return;
    }
    const reason = res.reason as OtpVerifyReason;
    if (reason === 'too_many') {
      setError('Zu viele Fehlversuche. Bitte fordere einen neuen Code an.');
      setStage('enter');
      setOtp('');
    } else if (reason === 'expired' || reason === 'no_code') {
      setError('Der Code ist abgelaufen. Bitte fordere einen neuen Code an.');
      setStage('enter');
      setOtp('');
    } else {
      setError('Falscher Code. Bitte versuche es erneut.');
    }
  }, [fullPhone, otp, busy]);

  const changeNumber = useCallback(() => {
    setStage('enter');
    setOtp('');
    setError('');
    setResendIn(0);
  }, []);

  return {
    countryCode, setCountryCode,
    phone, setPhone, phoneValid,
    stage, otp, setOtp, demoCode, error, busy, resendIn, fullPhone,
    sendCode, verify, changeNumber,
    verified: stage === 'verified',
  };
}

export type PhoneOtpController = ReturnType<typeof usePhoneOtp>;
