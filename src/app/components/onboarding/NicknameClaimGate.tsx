// ===== SPITZNAME-SCHRITT (Onboarding v5) =====
// Greift beim ERSTEN Login eines Schülers, der noch keinen Spitznamen hat (display_name '') —
// typischerweise ein von Eltern angelegtes (Login-Code) oder per E-Mail eingeladenes Kind.
// Das Kind vergibt seinen Spitznamen hier SELBST (die Eltern sind unbeteiligt). Danach Dashboard.

import React, { useState } from 'react';
import { identityService } from '@/services/identityService';
import { MascotAvatar, ChatBubble, OnboardingShell, PrimaryButton } from './OnboardingShared';

interface NicknameClaimGateProps {
  userData: any;
  onDone: (userData: any) => void;
}

export default function NicknameClaimGate({ userData, onDone }: NicknameClaimGateProps) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const valid = name.trim().length >= 2;

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    await identityService.setDisplayName(name);
    setBusy(false);
    const raw = localStorage.getItem('userData');
    onDone(raw ? JSON.parse(raw) : { ...userData, display_name: name.trim() });
  };

  return (
    <OnboardingShell
      stepKey="nicknameClaim"
      footer={<PrimaryButton disabled={!valid} loading={busy} onClick={submit}>Los geht's!</PrimaryButton>}
    >
      <div className="flex flex-col gap-5 pt-6">
        <div className="flex items-start gap-3">
          <MascotAvatar size={56} />
          <ChatBubble>Hey, schön dass du da bist! 👋 Ich bin Sumi.</ChatBubble>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-[56px] shrink-0" />
          <ChatBubble>Wie soll ich dich nennen?</ChatBubble>
        </div>
        <div className="pt-1">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && valid) submit(); }}
            placeholder="Dein Spitzname"
            className="selectable-text w-full px-5 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white text-[18px] font-['Poppins:Medium',sans-serif] outline-none focus:border-[#009379] transition-colors"
            style={{ fontSize: 18 }}
          />
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40 mt-2.5 px-1">
            So wirst du in SoStudy angezeigt. Du kannst auch einen Fantasienamen nehmen.
          </p>
        </div>
      </div>
    </OnboardingShell>
  );
}
