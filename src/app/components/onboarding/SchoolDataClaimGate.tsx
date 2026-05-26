// ===== SCHUL-DATEN-SCHRITT (Onboarding v5 — Änderung 2) =====
// Greift beim ERSTEN Login eines Schülers, dessen Eltern beim Anlegen die Schul-Daten
// übersprungen haben (Bundesland/Schulform/Klasse fehlen). Das Kind ergänzt sie hier selbst —
// derselbe Look wie der Schüler-Erst-Registrierungs-Flow, aber OHNE KI-Consent und OHNE Auth
// (beides ist beim verknüpften Kind bereits erledigt). Läuft NACH dem NicknameClaimGate.

import React, { useState } from 'react';
import { identityService } from '@/services/identityService';
import {
  BUNDESLAENDER,
  SCHOOL_TYPES,
  GRADES,
  MascotAvatar,
  ChatBubble,
  OnboardingShell,
  PrimaryButton,
  ChoiceList,
} from './OnboardingShared';

interface SchoolDataClaimGateProps {
  userData: any;
  onDone: (userData: any) => void;
}

type Step = 'bundesland' | 'schoolType' | 'grade';
const FLOW: Step[] = ['bundesland', 'schoolType', 'grade'];

export default function SchoolDataClaimGate({ userData, onDone }: SchoolDataClaimGateProps) {
  const [step, setStep] = useState<Step>('bundesland');
  // Bereits vorhandene Werte vorbefüllen (z.B. wenn nur die Klasse fehlt).
  const [bundesland, setBundesland] = useState<string>(userData?.bundesland || '');
  const [schoolType, setSchoolType] = useState<string>(userData?.schoolType || '');
  const [grade, setGrade] = useState<string>(userData?.grade || '');
  const [busy, setBusy] = useState(false);

  const idx = FLOW.indexOf(step);
  const progress = { current: idx, total: FLOW.length };
  const goBack = () => idx > 0 && setStep(FLOW[idx - 1]);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    await identityService.setSchoolData({ bundesland, schoolType, grade });
    setBusy(false);
    const raw = localStorage.getItem('userData');
    onDone(raw ? JSON.parse(raw) : { ...userData, bundesland, schoolType, grade });
  };

  // ===== SCHRITT: BUNDESLAND =====
  if (step === 'bundesland') {
    return (
      <OnboardingShell
        stepKey={step}
        progress={progress}
        footer={<PrimaryButton disabled={!bundesland} onClick={() => setStep('schoolType')}>Weiter</PrimaryButton>}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Bevor's losgeht — in welchem Bundesland gehst du zur Schule?</ChatBubble>
          </div>
          <ChoiceList options={BUNDESLAENDER} value={bundesland} onChange={setBundesland} columns={2} />
        </div>
      </OnboardingShell>
    );
  }

  // ===== SCHRITT: SCHULFORM =====
  if (step === 'schoolType') {
    return (
      <OnboardingShell
        stepKey={step}
        onBack={goBack}
        progress={progress}
        footer={<PrimaryButton disabled={!schoolType} onClick={() => setStep('grade')}>Weiter</PrimaryButton>}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Auf welche Schule gehst du?</ChatBubble>
          </div>
          <ChoiceList options={SCHOOL_TYPES} value={schoolType} onChange={setSchoolType} columns={2} />
        </div>
      </OnboardingShell>
    );
  }

  // ===== SCHRITT: KLASSENSTUFE =====
  return (
    <OnboardingShell
      stepKey={step}
      onBack={goBack}
      progress={progress}
      footer={<PrimaryButton disabled={!grade || busy} loading={busy} onClick={submit}>Los geht's!</PrimaryButton>}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <MascotAvatar size={56} />
          <ChatBubble>In welcher Klasse bist du?</ChatBubble>
        </div>
        <ChoiceList options={GRADES} value={grade} onChange={setGrade} columns={3} />
      </div>
    </OnboardingShell>
  );
}
