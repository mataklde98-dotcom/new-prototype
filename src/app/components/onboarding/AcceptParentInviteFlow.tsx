// ===== ELTERN-EINLADUNG ANNEHMEN (Onboarding v5 — Änderung 7, Pfad 4) =====
// Ein Elternteil öffnet den (gemockten) Magic-Link ?parentinvite=<token>, den ein <18-Schüler
// ohne Familienkonto verschickt hat. VERKÜRZTER Eltern-Setup: eigener Name + Klarname des Kindes
// → Telefon mit SMS-OTP → Apple/Google/E-Mail-Auth → Verknüpfung. KEINE Schul-Daten (das Kind hat
// sie schon). Danach ist das Elternteil eingeloggt und die Nachhilfe für das Kind freigegeben.

import React, { useState, useEffect } from 'react';
import { parentInviteService } from '@/services/parentInviteService';
import { findIdentityById } from '@/mocks/identity.mock';
import type { AuthMethod } from '@/types/identity';
import {
  MascotAvatar,
  ChatBubble,
  OnboardingShell,
  PrimaryButton,
  TextLink,
  GoogleIcon,
  AppleIcon,
} from './OnboardingShared';
import { PhoneEntryFields, OtpEntryFields, PhoneVerifiedRow } from './PhoneOtpFields';
import { usePhoneOtp } from '@/hooks/usePhoneOtp';

interface AcceptParentInviteFlowProps {
  token: string;
  onComplete: (userData: any) => void;
  onInvalid: () => void;
}

type Phase = 'data' | 'phone' | 'auth' | 'done';

function LabeledInput({
  label, value, onChange, placeholder, autoFocus, type,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; autoFocus?: boolean; type?: string }) {
  const isEmail = type === 'email';
  return (
    <div className="space-y-2">
      <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 px-1 block">{label}</label>
      <input
        type={type}
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoCapitalize={isEmail ? 'none' : undefined}
        autoCorrect={isEmail ? 'off' : undefined}
        className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white font-['Poppins:Medium',sans-serif] outline-none focus:border-[#009379] transition-colors"
        style={{ fontSize: 16 }}
      />
    </div>
  );
}

export default function AcceptParentInviteFlow({ token, onComplete, onInvalid }: AcceptParentInviteFlowProps) {
  const [checked, setChecked] = useState(false);
  const [valid, setValid] = useState(false);
  const [studentName, setStudentName] = useState('dein Kind');
  const [phase, setPhase] = useState<Phase>('data');
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [authLoading, setAuthLoading] = useState<AuthMethod | null>(null);

  // Telefon-Verifikation → bei Erfolg direkt zur Auth-Auswahl.
  const phoneOtp = usePhoneOtp(() => setPhase('auth'));

  useEffect(() => {
    const invite = parentInviteService.getByToken(token);
    if (invite && invite.status === 'pending') {
      setValid(true);
      const student = findIdentityById(invite.studentUserId);
      if (student?.display_name) setStudentName(student.display_name);
      if (student?.real_name) setChildName(student.real_name); // Klarname vorbefüllen, falls vorhanden
    }
    setChecked(true);
  }, [token]);

  const finishAccept = async (method: AuthMethod) => {
    setAuthLoading(method);
    const res = await parentInviteService.accept(token, {
      childRealName: childName.trim(),
      parentRealName: parentName.trim(),
      parentPhone: phoneOtp.fullPhone,
      authMethod: method,
    });
    setAuthLoading(null);
    if (res.ok) setPhase('done');
    else onInvalid();
  };

  const finish = () => {
    const raw = localStorage.getItem('userData');
    onComplete(raw ? JSON.parse(raw) : null);
  };

  // ===== Ungültiges / bereits eingelöstes Token =====
  if (checked && !valid) {
    return (
      <OnboardingShell stepKey="parentinvite-invalid" footer={<PrimaryButton onClick={onInvalid}>Zur Anmeldung</PrimaryButton>}>
        <div className="h-full flex flex-col items-center justify-center text-center gap-6">
          <MascotAvatar size={96} />
          <ChatBubble>Diese Einladung ist leider nicht mehr gültig. 🤔</ChatBubble>
        </div>
      </OnboardingShell>
    );
  }

  // ===== SCHRITT 1: Eltern-Name + Klarname des Kindes =====
  if (phase === 'data') {
    const ok = parentName.trim().length >= 2 && childName.trim().length >= 2;
    return (
      <OnboardingShell stepKey="parentinvite-data"
        onBack={onInvalid}
        footer={<PrimaryButton disabled={!ok} onClick={() => setPhase('phone')}>Weiter</PrimaryButton>}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>{studentName} möchte mit dir Nachhilfe freischalten 🎓</ChatBubble>
          </div>
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/55 px-1 leading-[1.5]">
            Bestätige als Elternteil und richte euer Familienkonto ein. Schul-Infos brauchen wir nicht —
            die hat dein Kind schon.
          </p>
          <LabeledInput label="Dein Name (Vor- und Nachname)" value={parentName} onChange={setParentName} placeholder="Vor- und Nachname" autoFocus />
          <LabeledInput label="Name deines Kindes (für den Vertrag)" value={childName} onChange={setChildName} placeholder="Vor- und Nachname des Kindes" />
        </div>
      </OnboardingShell>
    );
  }

  // ===== SCHRITT 2: Telefonnummer + SMS-OTP =====
  if (phase === 'phone') {
    if (phoneOtp.stage === 'verify') {
      return (
        <OnboardingShell stepKey="parentinvite-otp"
          onBack={phoneOtp.changeNumber}
          footer={
            <PrimaryButton disabled={phoneOtp.otp.length !== 6 || phoneOtp.busy} loading={phoneOtp.busy} onClick={phoneOtp.verify}>
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
        <OnboardingShell stepKey="parentinvite-phone-ok"
          onBack={() => setPhase('data')}
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
      <OnboardingShell stepKey="parentinvite-phone"
        onBack={() => setPhase('data')}
        footer={
          <PrimaryButton disabled={!phoneOtp.phoneValid || phoneOtp.busy} loading={phoneOtp.busy} onClick={phoneOtp.sendCode}>
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

  // ===== SCHRITT 3: Account sichern (Apple/Google/E-Mail) =====
  if (phase === 'auth') {
    const busy = authLoading !== null;
    return (
      <OnboardingShell stepKey="parentinvite-auth" onBack={() => setPhase('phone')}>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Fast geschafft — so sicherst du dein Familienkonto.</ChatBubble>
          </div>

          <button
            onClick={() => finishAccept('apple')}
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
            onClick={() => finishAccept('google')}
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
            <TextLink onClick={() => finishAccept('email')}>
              Stattdessen mit E-Mail fortfahren
            </TextLink>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ===== FERTIG =====
  return (
    <OnboardingShell stepKey="parentinvite-done" footer={<PrimaryButton onClick={finish}>Zum Eltern-Bereich</PrimaryButton>}>
      <div className="h-full flex flex-col items-center justify-center text-center gap-6">
        <MascotAvatar size={110} />
        <ChatBubble>Verknüpft! ✅</ChatBubble>
        <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/50 max-w-[300px]">
          {childName.trim().split(' ')[0] || 'Dein Kind'} ist jetzt mit eurem Familienkonto verbunden und für
          die Nachhilfe freigegeben.
        </p>
      </div>
    </OnboardingShell>
  );
}
