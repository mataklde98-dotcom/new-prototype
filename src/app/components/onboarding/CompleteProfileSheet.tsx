// ===== PROFIL VERVOLLSTÄNDIGEN (28-Mai-Wireframe, nach dem Dashboard) =====
// Vollflächiger Overlay-Flow, der über den CompleteProfileBanner auf dem Home-Screen geöffnet wird.
// Sammelt die Schul-Daten (Bundesland → Schulform → Klasse) und — NUR für 16+ — den KI-Consent
// (Pflicht zum Abschluss). Anonyme Unter-16-Konten überspringen den KI-Schritt.
// Persistiert via identityService und aktualisiert den UserContext, damit die Screens sofort stimmen.

import React, { useState } from 'react';
import { identityService } from '@/services/identityService';
import { useUser } from '@/contexts/UserContext';
import {
  BUNDESLAENDER,
  SCHOOL_TYPES,
  gradesForSchoolType,
  MascotAvatar,
  ChatBubble,
  OnboardingShell,
  PrimaryButton,
  ChoiceList,
} from './OnboardingShared';

interface CompleteProfileSheetProps {
  /** true → 16+: KI-Consent-Schritt am Ende (Pflicht). false → unter 16: ohne KI-Schritt. */
  requireKiConsent: boolean;
  onClose: () => void;
  onDone: () => void;
}

type Step = 'bundesland' | 'schoolType' | 'grade' | 'kiConsent';

export default function CompleteProfileSheet({ requireKiConsent, onClose, onDone }: CompleteProfileSheetProps) {
  const { accountData, setAccountData } = useUser();

  const FLOW: Step[] = requireKiConsent
    ? ['bundesland', 'schoolType', 'grade', 'kiConsent']
    : ['bundesland', 'schoolType', 'grade'];

  const [step, setStep] = useState<Step>('bundesland');
  const [bundesland, setBundesland] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [grade, setGrade] = useState('');
  const [busy, setBusy] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const idx = FLOW.indexOf(step);
  const progress = { current: idx, total: FLOW.length };
  const goBack = () => {
    if (idx > 0) setStep(FLOW[idx - 1]);
    else onClose(); // erster Schritt → Overlay schließen (weicher Prompt, kein Zwang)
  };

  const persist = async () => {
    if (busy) return;
    setBusy(true);
    await identityService.setSchoolData({ bundesland, schoolType, grade });
    if (requireKiConsent) await identityService.setKiConsent(true);
    // UserContext sofort aktualisieren, damit Profil-/Home-Screens die Werte zeigen.
    setAccountData({ ...accountData, bundesland, schoolType, grade });
    setBusy(false);
    onDone();
  };

  // Auto-Advance: Auswahl kurz hervorheben, dann automatisch zum nächsten Schritt (kein „Weiter").
  const pickAndGo = (apply: () => void, next: () => void) => {
    if (advancing || busy) return;
    apply();
    setAdvancing(true);
    setTimeout(() => { setAdvancing(false); next(); }, 200);
  };

  // ===== SCHRITT: BUNDESLAND =====
  if (step === 'bundesland') {
    return (
      <OnboardingShell stepKey={step} onBack={goBack} progress={progress}>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>In welchem Bundesland gehst du zur Schule?</ChatBubble>
          </div>
          <ChoiceList options={BUNDESLAENDER} value={bundesland}
            onChange={(v) => pickAndGo(() => setBundesland(v), () => setStep('schoolType'))} columns={2} />
        </div>
      </OnboardingShell>
    );
  }

  // ===== SCHRITT: SCHULFORM =====
  if (step === 'schoolType') {
    return (
      <OnboardingShell stepKey={step} onBack={goBack} progress={progress}>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Auf welche Schule gehst du?</ChatBubble>
          </div>
          <ChoiceList options={SCHOOL_TYPES} value={schoolType}
            onChange={(v) => pickAndGo(() => { setSchoolType(v); setGrade(''); }, () => setStep('grade'))} columns={2} />
        </div>
      </OnboardingShell>
    );
  }

  // ===== SCHRITT: KLASSENSTUFE =====
  if (step === 'grade') {
    return (
      <OnboardingShell stepKey={step} onBack={goBack} progress={progress}>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>In welcher Klasse bist du?</ChatBubble>
          </div>
          <ChoiceList
            options={gradesForSchoolType(schoolType)}
            value={grade}
            onChange={(v) => pickAndGo(() => setGrade(v), () => (requireKiConsent ? setStep('kiConsent') : persist()))}
            columns={schoolType === 'Berufsschule' ? 1 : 3}
          />
        </div>
      </OnboardingShell>
    );
  }

  // ===== SCHRITT: KI-EINWILLIGUNG (nur 16+, Pflicht zum Abschluss) =====
  return (
    <OnboardingShell stepKey={step} onBack={goBack} progress={progress}
      footer={<PrimaryButton disabled={busy} loading={busy} onClick={persist}>Zustimmen & fertig</PrimaryButton>}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <MascotAvatar size={56} />
          <ChatBubble>Kurz zur KI — okay für dich?</ChatBubble>
        </div>
        <div
          className="rounded-3xl p-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] leading-[1.55] text-white/70">
            SoStudy nutzt KI-Anbieter (<span className="text-white/90">OpenAI</span>,
            <span className="text-white/90"> Anthropic</span>, <span className="text-white/90">Google</span>) als
            Kernfunktion unseres Lernangebots. Diese Verarbeitung ist gemäß{' '}
            <span className="text-white/90">Art. 6 Abs. 1 lit. b DSGVO</span> zur Erfüllung des Nutzungsvertrags
            erforderlich. Da die Verarbeitung teilweise in den USA erfolgt, willigst du mit „Zustimmen" gemäß{' '}
            <span className="text-white/90">Art. 49 Abs. 1 lit. a DSGVO</span> in diese Drittlandsübermittlung ein.
          </p>
        </div>
      </div>
    </OnboardingShell>
  );
}
