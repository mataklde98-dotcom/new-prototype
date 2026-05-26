// ===== KIND HINZUFÜGEN (Onboarding v5 — 3 Wege) =====
// Wiederverwendbarer Sub-Flow: Eltern-Onboarding (E5–E7) UND Eltern-Dashboard (Multi-Kind).
// Vollflächig im Onboarding-Look (OnboardingShell). Drei Wege, wie ein Kind ans Familienkonto kommt:
//
//   ① E-Mail einladen   → Kind wählt selbst Apple/Google (Mode 'C' → acceptInviteWithAuth)
//   ② Login-Code        → System erzeugt einen Code, Eltern geben ihn weiter (Mode 'A')
//   ③ Konto verknüpfen  → Kind nutzt SoStudy schon, per Login-Code anbinden (Mode 'B')
//
// In ALLEN Fällen geben die Eltern nur den ECHTEN Namen — den Spitznamen vergibt das Kind selbst.

import React, { useState } from 'react';
import { familyService } from '@/services/familyService';
import { clearUserSession } from '@/lib/auth';
import type { ActivationMode, Familienkonto } from '@/types/identity';
import {
  BRAND,
  BUNDESLAENDER,
  SCHOOL_TYPES,
  gradesForSchoolType,
  MascotAvatar,
  ChatBubble,
  OnboardingShell,
  PrimaryButton,
  SecondaryButton,
  TextLink,
  ChoiceList,
  BigSelectionCard,
} from '@/app/components/onboarding/OnboardingShared';
import { Copy, Check } from 'lucide-react';

type SubStep =
  | 'mode'
  | 'detailA'
  // Weg ② Schul-Daten als Progressive Disclosure (Änderung 2 überarbeitet): je ein Screen.
  | 'schoolIntro'        // Meta-Entscheidung "Wer füllt aus?"
  | 'schoolBundesland'   // nur Bundesland
  | 'schoolSchulform'    // nur Schulform
  | 'schoolKlasse'       // nur Klassenstufe (gefiltert nach Schulform)
  | 'detailB'
  | 'detailC'
  | 'result';

interface AddChildFlowProps {
  familyId: string;
  onDone: (family: Familienkonto) => void;
  onCancel: () => void;
  /** Im Onboarding zeigt der erste Schritt "Überspringen" statt "Abbrechen". */
  allowSkip?: boolean;
}

// Reihenfolge = Empfehlung: E-Mail zuerst (sicherster Weg, Kind nutzt eigene Auth).
const MODE_CARDS: { mode: ActivationMode; emoji: string; title: string; subtitle: string }[] = [
  { mode: 'C', emoji: '✉️', title: 'Per E-Mail einladen', subtitle: 'Dein Kind meldet sich selbst mit Apple oder Google an.' },
  { mode: 'A', emoji: '🔑', title: 'Login-Code erstellen', subtitle: 'Wir erzeugen einen Code, den du deinem Kind weitergibst.' },
  { mode: 'B', emoji: '🔗', title: 'Bestehendes Konto verknüpfen', subtitle: 'Dein Kind nutzt SoStudy schon? Gib seinen Login-Code ein.' },
];

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function AddChildFlow({ familyId, onDone, onCancel, allowSkip }: AddChildFlowProps) {
  const [step, setStep] = useState<SubStep>('mode');
  const [mode, setMode] = useState<ActivationMode | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Gemeinsame Kind-Felder (Weg ② Code & Weg ① E-Mail) — Eltern geben nur den echten Namen.
  const [childReal, setChildReal] = useState('');
  const [childBundesland, setChildBundesland] = useState('');
  const [childSchool, setChildSchool] = useState('');
  const [childGrade, setChildGrade] = useState('');
  const [childEmail, setChildEmail] = useState(''); // nur Weg ①

  // Weg ③ — bestehender Login-Code
  const [linkCode, setLinkCode] = useState('');

  // Ergebnis
  const [resultFamily, setResultFamily] = useState<Familienkonto | null>(null);
  const [resultKind, setResultKind] = useState<'created' | 'linked' | 'invited' | null>(null);
  const [resultCode, setResultCode] = useState(''); // Login-Code (②) oder Invite-Token (①)
  const [resultName, setResultName] = useState('');
  const [resultEmail, setResultEmail] = useState('');

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const firstName = (full: string) => full.trim().split(' ')[0] || 'Dein Kind';

  // ===== AKTIONEN =====
  // Weg ② — Name validieren, dann zur Meta-Entscheidung der Schul-Daten (Screen 1/4).
  const goToSchoolA = () => {
    setError('');
    if (childReal.trim().length < 2) { setError('Bitte den Namen des Kindes eingeben.'); return; }
    setStep('schoolIntro');
  };

  // Weg ② — Login-Code-Konto anlegen. includeSchool=false → Schul-Daten bleiben leer,
  // das Kind ergänzt sie beim ersten Login (Änderung 2 / SchoolDataClaimGate).
  // gradeOverride: bei der Auto-Weiterleitung auf Screen 4/4 wird submitA direkt im Klick-Handler
  // der Klassenstufe aufgerufen — der State (childGrade) ist im selben Tick noch nicht aktualisiert,
  // daher reichen wir den gerade gewählten Wert explizit durch.
  const submitA = async (includeSchool: boolean, gradeOverride?: string) => {
    if (busy) return;
    setError('');
    if (childReal.trim().length < 2) { setError('Bitte den Namen des Kindes eingeben.'); return; }
    setBusy(true);
    const res = await familyService.addChildNew(familyId, {
      real_name: childReal,
      bundesland: includeSchool ? childBundesland || undefined : undefined,
      schoolType: includeSchool ? childSchool || undefined : undefined,
      grade: includeSchool ? (gradeOverride ?? childGrade) || undefined : undefined,
    });
    setBusy(false);
    if (res.ok) {
      setResultFamily(res.family);
      setResultKind('created');
      setResultCode(res.child.anmeldeCode);
      setResultName(firstName(childReal));
      setStep('result');
    } else {
      setError('Konnte das Kind-Konto nicht anlegen.');
    }
  };

  // Weg ③ — bestehendes Konto verknüpfen
  const submitB = async () => {
    setError('');
    if (!linkCode.trim()) { setError('Bitte den Login-Code des Kindes eingeben.'); return; }
    setBusy(true);
    const res = await familyService.linkChildByCode(familyId, linkCode);
    setBusy(false);
    if (res.ok) {
      setResultFamily(res.family);
      setResultKind('linked');
      setResultName(res.child.display_name?.trim() || firstName(res.child.real_name || ''));
      setStep('result');
    } else {
      const msg =
        res.reason === 'already_linked' ? 'Dieses Kind ist bereits verknüpft.'
        : res.reason === 'is_parent' ? 'Dieser Code gehört zu einem Elternkonto.'
        : 'Kein Konto mit diesem Code gefunden.';
      setError(msg);
    }
  };

  // Weg ① — per E-Mail einladen
  const submitC = async () => {
    setError('');
    if (childReal.trim().length < 2) { setError('Bitte den Namen des Kindes eingeben.'); return; }
    if (!isValidEmail(childEmail)) { setError('Bitte eine gültige E-Mail-Adresse eingeben.'); return; }
    setBusy(true);
    const res = await familyService.inviteChildByEmail(familyId, {
      real_name: childReal,
      email: childEmail,
      schoolType: childSchool || undefined,
      grade: childGrade || undefined,
    });
    setBusy(false);
    if (res.ok && res.family) {
      setResultFamily(res.family);
      setResultKind('invited');
      setResultCode(res.inviteToken);
      setResultName(firstName(childReal));
      setResultEmail(childEmail.trim());
      setStep('result');
    } else {
      setError('Einladung konnte nicht erstellt werden.');
    }
  };

  // Demo: E-Mail-Klick des Kindes simulieren → Eltern-Session verlassen, Annehmen-Flow per ?invite öffnen.
  const openInviteAsChild = () => {
    clearUserSession();
    window.location.href = `${window.location.pathname}?invite=${encodeURIComponent(resultCode)}`;
  };

  const back = () => {
    setError('');
    if (step === 'mode') return onCancel();
    if (step === 'result') return onCancel();
    setStep('mode');
  };

  // ===== STEP: WEG-AUSWAHL =====
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

  // ===== STEP: WEG ② — Login-Code erstellen (1/2: Name) =====
  if (step === 'detailA') {
    return (
      <OnboardingShell stepKey={step}
        onBack={back}
        footer={<PrimaryButton onClick={goToSchoolA}>Weiter</PrimaryButton>}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Wie heißt dein Kind?</ChatBubble>
          </div>
          <Field label="Vor- und Nachname des Kindes *">
            <TextInput value={childReal} onChange={setChildReal} placeholder="Vor- und Nachname" autoFocus />
          </Field>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 px-1">
            Den Spitznamen wählt dein Kind beim ersten Login selbst.
          </p>
          {error && <ErrorText>{error}</ErrorText>}
        </div>
      </OnboardingShell>
    );
  }

  // ===== WEG ② — SCHUL-DATEN ALS PROGRESSIVE DISCLOSURE (Änderung 2 überarbeitet) =====
  // Vier getrennte Screens statt einer überladenen Multi-Auswahl. Jeder Screen folgt dem
  // Sumi-Bubble-Look des Schüler-Pfads: genau eine Frage, klare Buttons.
  //
  // Screen 1/4 — Meta-Entscheidung "Wer füllt aus?" (BEWUSST ohne jegliche Datenfelder).
  if (step === 'schoolIntro') {
    return (
      <OnboardingShell stepKey={step}
        onBack={() => setStep('detailA')}
        footer={
          <div className="space-y-2.5">
            <PrimaryButton onClick={() => setStep('schoolBundesland')}>Ich fülle es aus</PrimaryButton>
            <SecondaryButton disabled={busy} onClick={() => submitA(false)}>Mein Kind macht das später</SecondaryButton>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Schul-Informationen deines Kindes</ChatBubble>
          </div>
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/55 px-1 -mt-1 leading-[1.5]">
            Optional — Bundesland, Schulform und Klassenstufe helfen uns, passende Lerninhalte anzuzeigen.
          </p>
          {error && <ErrorText>{error}</ErrorText>}
        </div>
      </OnboardingShell>
    );
  }

  // Screen 2/4 — nur Bundesland.
  if (step === 'schoolBundesland') {
    return (
      <OnboardingShell stepKey={step}
        onBack={() => setStep('schoolIntro')}
        progress={{ current: 0, total: 3 }}
        footer={<PrimaryButton disabled={!childBundesland} onClick={() => setStep('schoolSchulform')}>Weiter</PrimaryButton>}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>In welchem Bundesland geht dein Kind zur Schule?</ChatBubble>
          </div>
          <ChoiceList options={BUNDESLAENDER} value={childBundesland} onChange={setChildBundesland} columns={2} />
        </div>
      </OnboardingShell>
    );
  }

  // Screen 3/4 — nur Schulform (MVP: in allen Bundesländern dieselben Schulformen).
  if (step === 'schoolSchulform') {
    return (
      <OnboardingShell stepKey={step}
        onBack={() => setStep('schoolBundesland')}
        progress={{ current: 1, total: 3 }}
        footer={<PrimaryButton disabled={!childSchool} onClick={() => setStep('schoolKlasse')}>Weiter</PrimaryButton>}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Auf welche Schule geht dein Kind?</ChatBubble>
          </div>
          {/* Schulform wechseln setzt eine evtl. schon gewählte Klassenstufe zurück (sonst ungültig). */}
          <ChoiceList
            options={SCHOOL_TYPES}
            value={childSchool}
            onChange={(v) => { setChildSchool(v); setChildGrade(''); }}
            columns={2}
          />
        </div>
      </OnboardingShell>
    );
  }

  // Screen 4/4 — nur Klassenstufe, gefiltert nach Schulform. Auswahl legt das Kind direkt an.
  if (step === 'schoolKlasse') {
    const grades = gradesForSchoolType(childSchool);
    const isBerufsschule = childSchool === 'Berufsschule';
    return (
      <OnboardingShell stepKey={step}
        onBack={() => setStep('schoolSchulform')}
        progress={{ current: 2, total: 3 }}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>In welcher Klasse ist dein Kind?</ChatBubble>
          </div>
          {/* Auswahl löst direkt das Anlegen aus → gewählten Wert explizit durchreichen (Stale-State). */}
          <ChoiceList
            options={grades}
            value={childGrade}
            onChange={(v) => { if (busy) return; setChildGrade(v); submitA(true, v); }}
            columns={isBerufsschule ? 1 : 3}
          />
          {busy && (
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 px-1 text-center">
              Konto wird angelegt…
            </p>
          )}
          {error && <ErrorText>{error}</ErrorText>}
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: WEG ③ — bestehendes Konto verknüpfen =====
  if (step === 'detailB') {
    return (
      <OnboardingShell stepKey={step}
        onBack={back}
        footer={<PrimaryButton loading={busy} disabled={busy} onClick={submitB}>Konto verknüpfen</PrimaryButton>}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Gib den Login-Code deines Kindes ein.</ChatBubble>
          </div>
          <Field label="Login-Code des Kindes">
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
            Den Code findet dein Kind in seinem Profil unter „Login & Sicherheit".
          </p>
          {error && <ErrorText>{error}</ErrorText>}
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: WEG ① — per E-Mail einladen =====
  if (step === 'detailC') {
    return (
      <OnboardingShell stepKey={step}
        onBack={back}
        footer={<PrimaryButton loading={busy} disabled={busy} onClick={submitC}>Einladung senden</PrimaryButton>}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Ich schicke deinem Kind eine Einladung per E-Mail.</ChatBubble>
          </div>
          <Field label="Vor- und Nachname des Kindes *">
            <TextInput value={childReal} onChange={setChildReal} placeholder="Vor- und Nachname" autoFocus />
          </Field>
          <Field label="E-Mail des Kindes *">
            <TextInput value={childEmail} onChange={setChildEmail} placeholder="kind@beispiel.de" type="email" />
          </Field>
          <Field label="Schulform (optional)">
            <ChoiceList options={SCHOOL_TYPES} value={childSchool} onChange={(v) => { setChildSchool(v); setChildGrade(''); }} columns={2} />
          </Field>
          {childSchool && (
            <Field label="Klassenstufe (optional)">
              <ChoiceList options={gradesForSchoolType(childSchool)} value={childGrade} onChange={setChildGrade} columns={childSchool === 'Berufsschule' ? 1 : 3} />
            </Field>
          )}
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 px-1">
            Dein Kind öffnet die Einladung und meldet sich selbst mit Apple oder Google an — den Spitznamen wählt es dabei selbst.
          </p>
          {error && <ErrorText>{error}</ErrorText>}
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: ERGEBNIS =====
  return (
    <OnboardingShell stepKey={step} footer={
      resultKind === 'invited' ? (
        <div className="space-y-2.5">
          <PrimaryButton onClick={openInviteAsChild}>Einladung als Kind öffnen ▶</PrimaryButton>
          <SecondaryButton onClick={() => resultFamily && onDone(resultFamily)}>Fertig</SecondaryButton>
        </div>
      ) : (
        <PrimaryButton onClick={() => resultFamily && onDone(resultFamily)}>Fertig</PrimaryButton>
      )
    }>
      <div className="h-full flex flex-col items-center justify-center text-center gap-6">
        <MascotAvatar size={96} />
        {resultKind === 'created' && (
          <>
            <ChatBubble>{resultName}s Konto ist bereit! 🎉</ChatBubble>
            <CodeCard label="Login-Code des Kindes" code={resultCode} copied={copied} onCopy={() => copy(resultCode)} />
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 max-w-[300px]">
              Gib diesen Code an dein Kind weiter — damit meldet es sich an. Du findest ihn jederzeit hier im Familienkonto.
            </p>
          </>
        )}
        {resultKind === 'linked' && (
          <ChatBubble>{resultName} ist jetzt mit eurem Familienkonto verbunden. ✅</ChatBubble>
        )}
        {resultKind === 'invited' && (
          <>
            <ChatBubble>Einladung an {resultEmail} gesendet! ✉️</ChatBubble>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/55 max-w-[320px]">
              {resultName} öffnet die E-Mail und meldet sich mit Apple oder Google an. Danach erscheint {resultName} in deiner Kinder-Liste.
            </p>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 max-w-[300px]">
              Zum Ausprobieren simuliert „Einladung als Kind öffnen" den Klick deines Kindes auf die E-Mail.
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
  value, onChange, placeholder, autoFocus, type,
}: { value: string; onChange: (v: string) => void; placeholder?: string; autoFocus?: boolean; type?: string }) {
  const isEmail = type === 'email';
  return (
    <input
      type={type}
      autoFocus={autoFocus}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoCapitalize={isEmail ? 'none' : undefined}
      autoCorrect={isEmail ? 'off' : undefined}
      spellCheck={isEmail ? false : undefined}
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
      style={{ background: 'rgba(0,147,121,0.12)', border: `1.5px solid ${BRAND.primary}` }}
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
