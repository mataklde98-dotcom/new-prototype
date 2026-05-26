// ===== EINLADUNG ANNEHMEN (Onboarding v5, Weg ①) =====
// Kind öffnet die (gemockte) E-Mail-Einladung über den Deep-Link ?invite=<token> und meldet
// sich SELBST mit Apple oder Google an. familyService.acceptInviteWithAuth erzeugt die
// Kind-Identität (echter Name aus der Einladung, eigener Login-Code als Backup) und loggt das
// Kind ein. Den Spitznamen vergibt es danach im NicknameClaimGate (display_name ist noch leer).

import React, { useState, useEffect } from 'react';
import { familyService } from '@/services/familyService';
import type { AuthMethod, FamilyChild } from '@/types/identity';
import {
  MascotAvatar,
  ChatBubble,
  OnboardingShell,
  PrimaryButton,
  AppleIcon,
  GoogleIcon,
} from './OnboardingShared';

interface AcceptInviteFlowProps {
  token: string;
  onComplete: (userData: any) => void;
  onInvalid: () => void;
}

export default function AcceptInviteFlow({ token, onComplete, onInvalid }: AcceptInviteFlowProps) {
  const [child, setChild] = useState<FamilyChild | null>(null);
  const [parentName, setParentName] = useState('Deine Eltern');
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState<AuthMethod | null>(null);

  useEffect(() => {
    const found = familyService.getPendingInviteByToken(token);
    if (found) {
      setChild(found.child);
      setParentName(found.family.parentRealName?.split(' ')[0] || 'Deine Eltern');
    }
    setChecked(true);
  }, [token]);

  const accept = async (method: AuthMethod) => {
    setLoading(method);
    const res = await familyService.acceptInviteWithAuth(token, method);
    setLoading(null);
    if (res.ok) {
      const raw = localStorage.getItem('userData');
      onComplete(raw ? JSON.parse(raw) : null);
    } else {
      onInvalid();
    }
  };

  // Ungültiges / bereits eingelöstes Token
  if (checked && !child) {
    return (
      <OnboardingShell stepKey="invite-invalid"
        footer={<PrimaryButton onClick={onInvalid}>Zur Anmeldung</PrimaryButton>}
      >
        <div className="h-full flex flex-col items-center justify-center text-center gap-6">
          <MascotAvatar size={96} />
          <ChatBubble>Diese Einladung ist leider nicht mehr gültig. 🤔</ChatBubble>
        </div>
      </OnboardingShell>
    );
  }

  const firstName = child?.real_name?.trim().split(' ')[0] || 'Hey';
  const busy = loading !== null;

  return (
    <OnboardingShell stepKey="invite-accept">
      <div className="flex flex-col gap-6 pt-6">
        <div className="flex items-start gap-3">
          <MascotAvatar size={56} />
          <ChatBubble>
            Hallo {firstName}! {parentName} hat dich zu SoStudy eingeladen 🎉 Melde dich an, um loszulegen.
          </ChatBubble>
        </div>

        {/* Apple */}
        <button
          onClick={() => accept('apple')}
          disabled={busy}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-white text-black font-['Poppins:SemiBold',sans-serif] text-[16px] active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
        >
          {loading === 'apple' ? (
            <div className="w-[18px] h-[18px] border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
          ) : (
            <span className="text-black"><AppleIcon /></span>
          )}
          {loading === 'apple' ? 'Verbinden…' : 'Mit Apple anmelden'}
        </button>

        {/* Google */}
        <button
          onClick={() => accept('google')}
          disabled={busy}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white/80 font-['Poppins:Medium',sans-serif] text-[15px] active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
        >
          {loading === 'google' ? (
            <div className="w-[18px] h-[18px] border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          {loading === 'google' ? 'Verbinden…' : 'Mit Google anmelden'}
        </button>

        <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40 px-1 text-center">
          Du bekommst zusätzlich einen Login-Code als Backup — den sehen auch deine Eltern im Familienkonto.
        </p>
      </div>
    </OnboardingShell>
  );
}
