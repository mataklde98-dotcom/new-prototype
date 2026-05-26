// ===== ELTERN-ONBOARDING (Knowunity v5) =====
// Eltern-Pfad: Willkommen → Klarname → Account sichern (Apple/Google/E-Mail) → Familienkonto angelegt
// → erstes Kind hinzufügen (Modi A/B/C via AddChildFlow) → fertig.
// Eltern arbeiten im KLARNAME-Kontext (Vertrag/Familienkonto), daher real_name statt Spitzname.
//
// WICHTIG: Das Elternkonto MUSS sicher gesichert sein (sensible Daten, z.B. Zahlungsmethoden) →
// nur Apple, Google oder E-Mail+Passwort. KEIN reiner Anmelde-Code wie beim Schüler.
// Die KI-Einwilligung (OpenAI/Anthropic/Google) gehört NICHT hierher: Das Elternkonto nutzt keine KI;
// die Einwilligung erfolgt im Schüler-Kontext (bzw. implizit, wenn Eltern ein Kind anlegen).

import React, { useState } from 'react';
import { identityService } from '@/services/identityService';
import {
  EMPTY_PARENT_ONBOARDING_DRAFT,
  type ParentOnboardingDraft,
  type AuthMethod,
} from '@/types/identity';
import {
  MascotAvatar,
  ChatBubble,
  OnboardingShell,
  PrimaryButton,
  TextLink,
  GoogleIcon,
  AppleIcon,
} from '@/app/components/onboarding/OnboardingShared';
import { PhoneEntryFields, OtpEntryFields, PhoneVerifiedRow } from '@/app/components/onboarding/PhoneOtpFields';
import { usePhoneOtp } from '@/hooks/usePhoneOtp';
import SoStudyLogo from '@/app/components/SoStudyLogo';
import AddChildFlow from './AddChildFlow';

type Phase = 'welcome' | 'realName' | 'phone' | 'auth' | 'emailForm' | 'addChild' | 'done';

const PROGRESS: Phase[] = ['realName', 'phone', 'auth'];

interface ParentOnboardingFlowProps {
  onComplete: (userData: any) => void;
  onBack: () => void; // zurück zur Rollenauswahl
}

export default function ParentOnboardingFlow({ onComplete, onBack }: ParentOnboardingFlowProps) {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [draft, setDraft] = useState<ParentOnboardingDraft>(EMPTY_PARENT_ONBOARDING_DRAFT);
  const [authLoading, setAuthLoading] = useState<AuthMethod | null>(null);
  const [familyId, setFamilyId] = useState<string>('');

  // E-Mail-Registrierung (manuell)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const set = (patch: Partial<ParentOnboardingDraft>) => setDraft((d) => ({ ...d, ...patch }));

  // Telefon-Verifikation (Pflicht, vor der Auth) — Änderung 3. Nach erfolgreicher OTP-Prüfung
  // wird die Nummer in den Draft übernommen und direkt zur Auth-Auswahl weitergeleitet.
  const phoneOtp = usePhoneOtp((fullPhone) => {
    set({ phone: fullPhone });
    setPhase('auth');
  });

  const progress = PROGRESS.includes(phase)
    ? { current: PROGRESS.indexOf(phase), total: PROGRESS.length }
    : undefined;

  const finish = () => {
    const raw = localStorage.getItem('userData');
    onComplete(raw ? JSON.parse(raw) : null);
  };

  const handleRegister = async (method: AuthMethod, emailOverride?: string) => {
    setAuthLoading(method);
    const { family } = await identityService.registerParent({
      ...draft,
      authMethod: method,
      email: emailOverride ?? draft.email,
    });
    setAuthLoading(null);
    setFamilyId(family.familyId);
    setPhase('addChild');
  };

  // ===== E1: WILLKOMMEN =====
  if (phase === 'welcome') {
    return (
      <OnboardingShell stepKey={phase}
        onBack={onBack}
        footer={<PrimaryButton onClick={() => setPhase('realName')}>Los geht's</PrimaryButton>}
      >
        <div className="h-full flex flex-col items-center justify-center text-center gap-7">
          <SoStudyLogo />
          <MascotAvatar size={120} />
          <div>
            <h1 className="font-['Poppins:Bold',sans-serif] text-[26px] leading-[1.2] text-white">
              Schön, dass du dabei bist!
            </h1>
            <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white/55 mt-3 max-w-[320px]">
              Richte ein Familienkonto ein, verbinde das Konto deines Kindes und behalte Lernfortschritt
              & Nachhilfe im Blick.
            </p>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ===== E2: KLARNAME =====
  if (phase === 'realName') {
    const valid = draft.real_name.trim().length >= 2;
    return (
      <OnboardingShell stepKey={phase}
        onBack={() => setPhase('welcome')}
        progress={progress}
        footer={<PrimaryButton disabled={!valid} onClick={() => setPhase('phone')}>Weiter</PrimaryButton>}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Wie heißt du?</ChatBubble>
          </div>
          <div>
            <input
              autoFocus
              value={draft.real_name}
              onChange={(e) => set({ real_name: e.target.value })}
              placeholder="Vor- und Nachname"
              className="selectable-text w-full px-5 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white text-[18px] font-['Poppins:Medium',sans-serif] outline-none focus:border-[#009379] transition-colors"
              style={{ fontSize: 18 }}
            />
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40 mt-2.5 px-1">
              Für das Familienkonto und Nachhilfe-Verträge brauchen wir deinen echten Namen.
            </p>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ===== E2b: TELEFONNUMMER + SMS-OTP (Pflicht) — Änderung 3 =====
  // Drei Zustände im selben Phase-Slot: Nummer eingeben → Code eingeben → bestätigt.
  if (phase === 'phone') {
    if (phoneOtp.stage === 'verify') {
      return (
        <OnboardingShell stepKey="phone-verify"
          onBack={phoneOtp.changeNumber}
          progress={progress}
          footer={
            <PrimaryButton
              disabled={phoneOtp.otp.length !== 6 || phoneOtp.busy}
              loading={phoneOtp.busy}
              onClick={phoneOtp.verify}
            >
              Bestätigen
            </PrimaryButton>
          }
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-3">
              <MascotAvatar size={56} />
              <ChatBubble>SMS-Code eingeben</ChatBubble>
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/55 px-1 leading-[1.5]">
              Wir haben dir einen 6-stelligen Code an <span className="text-white/80">{phoneOtp.fullPhone}</span> geschickt.
            </p>
            <OtpEntryFields otp={phoneOtp} />
          </div>
        </OnboardingShell>
      );
    }
    if (phoneOtp.stage === 'verified') {
      return (
        <OnboardingShell stepKey="phone-verified"
          onBack={() => setPhase('realName')}
          progress={progress}
          footer={<PrimaryButton onClick={() => setPhase('auth')}>Weiter</PrimaryButton>}
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-3">
              <MascotAvatar size={56} />
              <ChatBubble>Nummer bestätigt ✓</ChatBubble>
            </div>
            <PhoneVerifiedRow otp={phoneOtp} />
          </div>
        </OnboardingShell>
      );
    }
    return (
      <OnboardingShell stepKey="phone-enter"
        onBack={() => setPhase('realName')}
        progress={progress}
        footer={
          <PrimaryButton
            disabled={!phoneOtp.phoneValid || phoneOtp.busy}
            loading={phoneOtp.busy}
            onClick={phoneOtp.sendCode}
          >
            Code per SMS senden
          </PrimaryButton>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Deine Telefonnummer</ChatBubble>
          </div>
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/55 px-1 leading-[1.5]">
            Für die Nachhilfe-Buchung kontaktieren wir dich telefonisch. Du erhältst gleich einen
            6-stelligen Bestätigungs-Code per SMS.
          </p>
          <PhoneEntryFields otp={phoneOtp} />
        </div>
      </OnboardingShell>
    );
  }

  // ===== E3: ACCOUNT SICHERN (Apple/Google/E-Mail — gemockt) =====
  if (phase === 'auth') {
    const busy = authLoading !== null;
    return (
      <OnboardingShell stepKey={phase} onBack={() => setPhase('phone')} progress={progress}>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Fast geschafft — so sicherst du dein Familienkonto.</ChatBubble>
          </div>

          <button
            onClick={() => handleRegister('apple')}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-white text-black font-['Poppins:SemiBold',sans-serif] text-[16px] active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
          >
            {authLoading === 'apple' ? (
              <div className="w-[18px] h-[18px] border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
            ) : (
              <span className="text-black"><AppleIcon /></span>
            )}
            {authLoading === 'apple' ? 'Verbinden…' : 'Mit Apple fortfahren'}
          </button>

          <button
            onClick={() => handleRegister('google')}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white/80 font-['Poppins:Medium',sans-serif] text-[15px] active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
          >
            {authLoading === 'google' ? (
              <div className="w-[18px] h-[18px] border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {authLoading === 'google' ? 'Verbinden…' : 'Mit Google fortfahren'}
          </button>

          <div className="pt-2">
            <TextLink onClick={() => setPhase('emailForm')}>
              Stattdessen mit E-Mail registrieren
            </TextLink>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ===== E3b: E-MAIL + PASSWORT (manuelle, gesicherte Registrierung) =====
  if (phase === 'emailForm') {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const pwValid = password.length >= 8;
    const busy = authLoading === 'email';
    return (
      <OnboardingShell stepKey={phase} onBack={() => setPhase('auth')}>
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Erstelle dein Familienkonto mit E-Mail.</ChatBubble>
          </div>

          <div className="space-y-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 px-1 block">E-Mail</label>
            <input
              autoFocus
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@beispiel.de"
              className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white font-['Poppins:Medium',sans-serif] outline-none focus:border-[#009379] transition-colors"
              style={{ fontSize: 16 }}
            />
          </div>

          <div className="space-y-2">
            <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 px-1 block">Passwort</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mindestens 8 Zeichen"
                onKeyDown={(e) => { if (e.key === 'Enter' && emailValid && pwValid) handleRegister('email', email.trim()); }}
                className="w-full px-5 py-3.5 pr-16 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white font-['Poppins:Medium',sans-serif] outline-none focus:border-[#009379] transition-colors"
                style={{ fontSize: 16 }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 font-['Poppins:Medium',sans-serif] text-[12px] text-white/45 active:text-white/80"
              >
                {showPw ? 'Verbergen' : 'Anzeigen'}
              </button>
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 px-1">
              Dein Familienkonto schützt sensible Daten (z.B. Zahlungsmethoden) — wähle ein starkes Passwort.
            </p>
          </div>

          <PrimaryButton
            disabled={!emailValid || !pwValid || busy}
            loading={busy}
            onClick={() => handleRegister('email', email.trim())}
          >
            {busy ? 'Konto wird erstellt…' : 'Familienkonto erstellen'}
          </PrimaryButton>
        </div>
      </OnboardingShell>
    );
  }

  // ===== E4–E6: ERSTES KIND HINZUFÜGEN (Modi A/B/C) =====
  if (phase === 'addChild') {
    return (
      <AddChildFlow
        familyId={familyId}
        allowSkip
        onDone={() => setPhase('done')}
        onCancel={() => setPhase('done')}
      />
    );
  }

  // ===== E7: FERTIG =====
  return (
    <OnboardingShell stepKey={phase} footer={<PrimaryButton onClick={finish}>Zum Eltern-Bereich</PrimaryButton>}>
      <div className="h-full flex flex-col items-center justify-center text-center gap-6">
        <MascotAvatar size={110} />
        <ChatBubble>Dein Familienkonto ist startklar! 🎉</ChatBubble>
        <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/50 max-w-[300px]">
          Im Eltern-Bereich verwaltest du die Konten deiner Kinder, ihre Anmelde-Codes und die
          Nachhilfe-Einwilligung.
        </p>
      </div>
    </OnboardingShell>
  );
}
