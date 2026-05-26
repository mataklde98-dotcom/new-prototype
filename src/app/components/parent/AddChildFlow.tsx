// ===== KIND HINZUFÜGEN (Onboarding v5 — Aktivierungs-Modi A/B/C) =====
// Wiederverwendbarer Sub-Flow: wird im Eltern-Onboarding (E5–E7) UND im Eltern-Dashboard
// (Multi-Kind) genutzt. Vollflächig im Onboarding-Look (OnboardingShell).
//
//   A = Neues Kind-Konto erstellen (System generiert Anmelde-Code)
//   B = Bestehendes Kind-Konto per Anmelde-Code verknüpfen
//   C = Kind per Einladung (Invite-Code) verknüpfen

import React, { useState } from 'react';
import { familyService } from '@/services/familyService';
import type { ActivationMode, Familienkonto } from '@/types/identity';
import {
  BRAND,
  SCHOOL_TYPES,
  GRADES,
  MascotAvatar,
  ChatBubble,
  OnboardingShell,
  PrimaryButton,
  TextLink,
  ChoiceList,
  BigSelectionCard,
} from '@/app/components/onboarding/OnboardingShared';
import { Copy, Check } from 'lucide-react';

type SubStep = 'mode' | 'detailA' | 'detailB' | 'detailC' | 'result';

interface AddChildFlowProps {
  familyId: string;
  onDone: (family: Familienkonto) => void;
  onCancel: () => void;
  /** Im Onboarding zeigt der erste Schritt "Überspringen" statt "Abbrechen". */
  allowSkip?: boolean;
}

const MODE_CARDS: { mode: ActivationMode; emoji: string; title: string; subtitle: string }[] = [
  { mode: 'A', emoji: '🆕', title: 'Neues Kind-Konto erstellen', subtitle: 'Wir legen ein Konto an — du erhältst einen Anmelde-Code für dein Kind.' },
  { mode: 'B', emoji: '🔗', title: 'Bestehendes Konto verknüpfen', subtitle: 'Dein Kind nutzt SoStudy bereits? Gib seinen Anmelde-Code ein.' },
  { mode: 'C', emoji: '✉️', title: 'Per Einladung verknüpfen', subtitle: 'Sende deinem Kind eine Einladung zum Beitreten.' },
];

export default function AddChildFlow({ familyId, onDone, onCancel, allowSkip }: AddChildFlowProps) {
  const [step, setStep] = useState<SubStep>('mode');
  const [mode, setMode] = useState<ActivationMode | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Modus A — neues Kind
  const [childName, setChildName] = useState('');
  const [childReal, setChildReal] = useState('');
  const [childSchool, setChildSchool] = useState('');
  const [childGrade, setChildGrade] = useState('');

  // Modus B — Code; Modus C — Name-Hinweis
  const [linkCode, setLinkCode] = useState('');
  const [inviteName, setInviteName] = useState('');

  // Ergebnis
  const [resultFamily, setResultFamily] = useState<Familienkonto | null>(null);
  const [resultKind, setResultKind] = useState<'created' | 'linked' | 'invited' | null>(null);
  const [resultCode, setResultCode] = useState(''); // Anmelde-Code (A) oder Invite-Code (C)
  const [resultName, setResultName] = useState('');

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  // ===== AKTIONEN =====
  const submitA = async () => {
    setError('');
    if (childName.trim().length < 2) { setError('Bitte einen Spitznamen eingeben.'); return; }
    setBusy(true);
    const res = await familyService.addChildNew(familyId, {
      display_name: childName,
      real_name: childReal,
      schoolType: childSchool,
      grade: childGrade || undefined,
    });
    setBusy(false);
    if (res.ok) {
      setResultFamily(res.family);
      setResultKind('created');
      setResultCode(res.child.anmeldeCode);
      setResultName(res.child.display_name);
      setStep('result');
    } else {
      setError('Konnte das Kind-Konto nicht anlegen.');
    }
  };

  const submitB = async () => {
    setError('');
    if (!linkCode.trim()) { setError('Bitte den Anmelde-Code des Kindes eingeben.'); return; }
    setBusy(true);
    const res = await familyService.linkChildByCode(familyId, linkCode);
    setBusy(false);
    if (res.ok) {
      setResultFamily(res.family);
      setResultKind('linked');
      setResultName(res.child.display_name);
      setStep('result');
    } else {
      const msg =
        res.reason === 'already_linked' ? 'Dieses Kind ist bereits verknüpft.'
        : res.reason === 'is_parent' ? 'Dieser Code gehört zu einem Elternkonto.'
        : 'Kein Konto mit diesem Code gefunden.';
      setError(msg);
    }
  };

  const submitC = async () => {
    setError('');
    setBusy(true);
    const res = await familyService.inviteChild(familyId, inviteName);
    setBusy(false);
    if (res.ok && res.family) {
      setResultFamily(res.family);
      setResultKind('invited');
      setResultCode(res.inviteCode);
      setResultName(inviteName.trim() || 'dein Kind');
      setStep('result');
    } else {
      setError('Einladung konnte nicht erstellt werden.');
    }
  };

  const back = () => {
    setError('');
    if (step === 'mode') return onCancel();
    if (step === 'result') return onCancel();
    setStep('mode');
  };

  // ===== STEP: MODUS-AUSWAHL =====
  if (step === 'mode') {
    return (
      <OnboardingShell stepKey={step}
        onBack={back}
        footer={
          <div className="space-y-1">
            <PrimaryButton
              disabled={!mode}
              onClick={() => mode && setStep((`detail${mode}` as SubStep))}
            >
              Weiter
            </PrimaryButton>
            {allowSkip && <TextLink onClick={onCancel}>Später hinzufügen</TextLink>}
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Wie möchtest du dein Kind hinzufügen?</ChatBubble>
          </div>
          <div className="space-y-3">
            {MODE_CARDS.map((c) => (
              <BigSelectionCard
                key={c.mode}
                emoji={c.emoji}
                title={c.title}
                subtitle={c.subtitle}
                selected={mode === c.mode}
                onClick={() => setMode(c.mode)}
              />
            ))}
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: MODUS A — neues Kind =====
  if (step === 'detailA') {
    return (
      <OnboardingShell stepKey={step}
        onBack={back}
        footer={<PrimaryButton loading={busy} disabled={busy} onClick={submitA}>Kind-Konto erstellen</PrimaryButton>}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Erzähl mir kurz etwas über dein Kind.</ChatBubble>
          </div>
          <Field label="Spitzname des Kindes *">
            <TextInput value={childName} onChange={setChildName} placeholder="z.B. Lena" autoFocus />
          </Field>
          <Field label="Klarname (für Nachhilfe, optional)">
            <TextInput value={childReal} onChange={setChildReal} placeholder="Vor- und Nachname" />
          </Field>
          <Field label="Schulform">
            <ChoiceList options={SCHOOL_TYPES} value={childSchool} onChange={setChildSchool} columns={2} />
          </Field>
          <Field label="Klasse (optional)">
            <ChoiceList options={GRADES} value={childGrade} onChange={setChildGrade} columns={3} />
          </Field>
          {error && <ErrorText>{error}</ErrorText>}
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: MODUS B — Code verknüpfen =====
  if (step === 'detailB') {
    return (
      <OnboardingShell stepKey={step}
        onBack={back}
        footer={<PrimaryButton loading={busy} disabled={busy} onClick={submitB}>Konto verknüpfen</PrimaryButton>}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Gib den Anmelde-Code deines Kindes ein.</ChatBubble>
          </div>
          <Field label="Anmelde-Code des Kindes">
            <input
              value={linkCode}
              onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
              placeholder="z.B. MAXI-9QR4"
              autoFocus
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              className="w-full px-5 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white text-center font-['Poppins:SemiBold',sans-serif] tracking-[0.18em] placeholder:tracking-normal placeholder:text-white/30 outline-none focus:border-[#009379] transition-colors"
              style={{ fontSize: 18 }}
            />
          </Field>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 px-1">
            Den Code findet dein Kind in seinem Profil unter „Verknüpfte Konten".
          </p>
          {error && <ErrorText>{error}</ErrorText>}
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: MODUS C — Einladung =====
  if (step === 'detailC') {
    return (
      <OnboardingShell stepKey={step}
        onBack={back}
        footer={<PrimaryButton loading={busy} disabled={busy} onClick={submitC}>Einladung erstellen</PrimaryButton>}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Ich erstelle einen Einladungs-Code zum Teilen.</ChatBubble>
          </div>
          <Field label="Name des Kindes (optional)">
            <TextInput value={inviteName} onChange={setInviteName} placeholder="z.B. Nina" autoFocus />
          </Field>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 px-1">
            Dein Kind gibt den Einladungs-Code in seinem SoStudy-Profil ein und ist dann mit eurem
            Familienkonto verbunden.
          </p>
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: ERGEBNIS =====
  return (
    <OnboardingShell stepKey={step} footer={<PrimaryButton onClick={() => resultFamily && onDone(resultFamily)}>Fertig</PrimaryButton>}>
      <div className="h-full flex flex-col items-center justify-center text-center gap-6">
        <MascotAvatar size={96} />
        {resultKind === 'created' && (
          <>
            <ChatBubble>{resultName}s Konto ist bereit! 🎉</ChatBubble>
            <CodeCard label="Anmelde-Code des Kindes" code={resultCode} copied={copied} onCopy={() => copy(resultCode)} />
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 max-w-[300px]">
              Gib diesen Code an dein Kind weiter — damit meldet es sich an.
            </p>
          </>
        )}
        {resultKind === 'linked' && (
          <ChatBubble>{resultName} ist jetzt mit eurem Familienkonto verbunden. ✅</ChatBubble>
        )}
        {resultKind === 'invited' && (
          <>
            <ChatBubble>Einladung für {resultName} erstellt! ✉️</ChatBubble>
            <CodeCard label="Einladungs-Code" code={resultCode} copied={copied} onCopy={() => copy(resultCode)} />
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 max-w-[300px]">
              Teile den Code mit deinem Kind. Sobald es annimmt, erscheint es in deiner Kinder-Liste.
            </p>
          </>
        )}
      </div>
    </OnboardingShell>
  );
}

// ===== KLEINE BAUSTEINE =====
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 px-1 block">{label}</label>
      {children}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, autoFocus,
}: { value: string; onChange: (v: string) => void; placeholder?: string; autoFocus?: boolean }) {
  return (
    <input
      autoFocus={autoFocus}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white font-['Poppins:Medium',sans-serif] outline-none focus:border-[#009379] transition-colors"
      style={{ fontSize: 16 }}
    />
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-red-300 px-1">{children}</p>
  );
}

function CodeCard({ label, code, copied, onCopy }: { label: string; code: string; copied: boolean; onCopy: () => void }) {
  return (
    <button
      onClick={onCopy}
      className="w-full max-w-[320px] rounded-3xl py-6 px-4 active:scale-[0.98] transition-transform"
      style={{ background: 'rgba(0,147,121,0.12)', border: `1.5px solid ${BRAND}` }}
    >
      <div className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/50 mb-1">{label}</div>
      <div className="font-['Poppins:Bold',sans-serif] text-[26px] tracking-[0.1em] text-white break-all">{code}</div>
      <div className="flex items-center justify-center gap-1.5 mt-2 text-[13px] font-['Poppins:Medium',sans-serif] text-white/55">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Kopiert!' : 'Tippen zum Kopieren'}
      </div>
    </button>
  );
}
