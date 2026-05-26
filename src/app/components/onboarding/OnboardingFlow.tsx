// ===== ONBOARDING FLOW (Schüler-Pfad, Knowunity v5) =====
// Vollflächiger Chat-Bubble-Flow mit Maskottchen. Läuft VOR dem Login-Gate
// (in AuthWrapper) und endet mit onComplete(userData) → App-Dashboard.
// Reiner Prototyp: Apple/Google sind VISUELL gemockt, Daten via identityService (localStorage).

import React, { useState } from 'react';
import { identityService } from '@/services/identityService';
import {
  EMPTY_ONBOARDING_DRAFT,
  type OnboardingDraft,
  type AuthMethod,
  type SoStudyIdentity,
} from '@/types/identity';
import {
  BRAND,
  BUNDESLAENDER,
  SCHOOL_TYPES,
  GRADES,
  MascotAvatar,
  ChatBubble,
  OnboardingShell,
  PrimaryButton,
  SecondaryButton,
  LegalDisclaimer,
  TextLink,
  ChoiceList,
  BigSelectionCard,
  GoogleIcon,
  AppleIcon,
} from './OnboardingShared';
import SoStudyLogo from '@/app/components/SoStudyLogo';

type Step =
  | 'landing'
  | 'role'
  | 'mascotIntro'
  | 'nickname'
  | 'bundesland'
  | 'schoolType'
  | 'grade'
  | 'kiConsent'
  | 'authChoice'
  | 'codeDisplay';

// Lineare Reihenfolge des Schüler-Pfads (für goNext/goBack & Fortschritt)
const FLOW: Step[] = [
  'landing', 'role', 'mascotIntro', 'nickname',
  'bundesland', 'schoolType', 'grade', 'kiConsent', 'authChoice',
];
const PROGRESS_STEPS: Step[] = FLOW.slice(2); // ab Maskottchen-Intro Fortschritt zeigen

interface OnboardingFlowProps {
  onComplete: (userData: any) => void;
  onSwitchToLogin: () => void;
  onSwitchToParent: () => void; // Rolle "Elternteil" → Eltern-Onboarding (E1–E8)
}

export default function OnboardingFlow({ onComplete, onSwitchToLogin, onSwitchToParent }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>('landing');
  const [draft, setDraft] = useState<OnboardingDraft>(EMPTY_ONBOARDING_DRAFT);
  const [socialLoading, setSocialLoading] = useState<AuthMethod | null>(null);
  const [registered, setRegistered] = useState<SoStudyIdentity | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (patch: Partial<OnboardingDraft>) => setDraft((d) => ({ ...d, ...patch }));

  const idx = FLOW.indexOf(step);
  const goNext = () => setStep(FLOW[Math.min(idx + 1, FLOW.length - 1)]);
  const goBack = () => {
    if (idx > 0) setStep(FLOW[idx - 1]);
  };

  const progress = PROGRESS_STEPS.includes(step)
    ? { current: PROGRESS_STEPS.indexOf(step), total: PROGRESS_STEPS.length }
    : undefined;

  // Registrierung abschließen (nach Auth-Methoden-Wahl)
  const handleRegister = async (method: AuthMethod) => {
    setSocialLoading(method);
    const identity = await identityService.registerStudent({ ...draft, authMethod: method });
    setSocialLoading(null);
    setRegistered(identity);
    setStep('codeDisplay');
  };

  const finish = () => {
    const raw = localStorage.getItem('userData');
    onComplete(raw ? JSON.parse(raw) : null);
  };

  const copyCode = () => {
    if (!registered) return;
    navigator.clipboard?.writeText(registered.anmeldeCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // ===== STEP: LANDING =====
  if (step === 'landing') {
    return (
      <OnboardingShell stepKey={step}
        footer={
          <div className="space-y-2.5">
            <PrimaryButton onClick={() => setStep('role')}>Neuen Account erstellen</PrimaryButton>
            <SecondaryButton onClick={onSwitchToLogin}>Bereits ein Konto? Anmelden</SecondaryButton>
            <LegalDisclaimer />
          </div>
        }
      >
        <div className="h-full flex flex-col items-center justify-center text-center gap-7">
          <SoStudyLogo />
          <MascotAvatar size={120} />
          <div>
            <h1 className="font-['Poppins:Bold',sans-serif] text-[24px] leading-[1.3] text-white max-w-[330px] mx-auto">
              Lerne mit KI, Karteikarten, Prüfungen und persönlicher Nachhilfe — alles an einem Ort.
            </h1>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: ROLLE-AUSWAHL =====
  if (step === 'role') {
    return (
      <OnboardingShell stepKey={step}
        onBack={goBack}
        footer={
          <PrimaryButton
            disabled={!draft.role}
            onClick={() => (draft.role === 'parent' ? onSwitchToParent() : goNext())}
          >
            Weiter
          </PrimaryButton>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Wer bist du?</ChatBubble>
          </div>
          <div className="space-y-3">
            <BigSelectionCard
              emoji="🎓"
              title="Ich bin Schüler:in"
              subtitle="Erstelle dein eigenes Lernkonto."
              selected={draft.role === 'student'}
              onClick={() => set({ role: 'student' })}
            />
            <BigSelectionCard
              emoji="👨‍👩‍👧"
              title="Ich bin Elternteil"
              subtitle="Richte den Account für dein Kind ein."
              selected={draft.role === 'parent'}
              onClick={() => set({ role: 'parent' })}
            />
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: MASKOTTCHEN-INTRO =====
  if (step === 'mascotIntro') {
    return (
      <OnboardingShell stepKey={step}
        onBack={goBack}
        progress={progress}
        footer={<PrimaryButton onClick={goNext}>Cool, weiter!</PrimaryButton>}
      >
        <div className="h-full flex flex-col items-center justify-center text-center gap-6">
          <MascotAvatar size={130} />
          <ChatBubble>
            Hey! Ich bin Sumi 👋 Ich helfe dir beim Lernen. Lass uns kurz dein Profil einrichten.
          </ChatBubble>
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: SPITZNAME =====
  if (step === 'nickname') {
    const valid = draft.display_name.trim().length >= 2;
    return (
      <OnboardingShell stepKey={step}
        onBack={goBack}
        progress={progress}
        footer={<PrimaryButton disabled={!valid} onClick={goNext}>Weiter</PrimaryButton>}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Wie soll ich dich nennen?</ChatBubble>
          </div>
          <div>
            <input
              autoFocus
              value={draft.display_name}
              onChange={(e) => set({ display_name: e.target.value })}
              placeholder="Dein Spitzname"
              className="selectable-text w-full px-5 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white text-[18px] font-['Poppins:Medium',sans-serif] outline-none focus:border-[#009379] transition-colors"
              style={{ fontSize: 18 }}
            />
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40 mt-2.5 px-1">
              Du kannst auch einen Fantasienamen nehmen — deinen echten Namen brauchen wir erst für
              die Nachhilfe.
            </p>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: BUNDESLAND =====
  if (step === 'bundesland') {
    return (
      <OnboardingShell stepKey={step}
        onBack={goBack}
        progress={progress}
        footer={<PrimaryButton disabled={!draft.bundesland} onClick={goNext}>Weiter</PrimaryButton>}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>In welchem Bundesland gehst du zur Schule?</ChatBubble>
          </div>
          <ChoiceList
            options={BUNDESLAENDER}
            value={draft.bundesland}
            onChange={(v) => set({ bundesland: v })}
            columns={2}
          />
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: SCHULFORM =====
  if (step === 'schoolType') {
    return (
      <OnboardingShell stepKey={step}
        onBack={goBack}
        progress={progress}
        footer={<PrimaryButton disabled={!draft.schoolType} onClick={goNext}>Weiter</PrimaryButton>}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Auf welche Schule gehst du?</ChatBubble>
          </div>
          <ChoiceList
            options={SCHOOL_TYPES}
            value={draft.schoolType}
            onChange={(v) => set({ schoolType: v })}
            columns={2}
          />
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: KLASSENSTUFE (Pflicht — nicht überspringbar) =====
  if (step === 'grade') {
    return (
      <OnboardingShell stepKey={step}
        onBack={goBack}
        progress={progress}
        footer={<PrimaryButton disabled={!draft.grade} onClick={goNext}>Weiter</PrimaryButton>}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>In welcher Klasse bist du?</ChatBubble>
          </div>
          <ChoiceList
            options={GRADES}
            value={draft.grade ?? ''}
            onChange={(v) => set({ grade: v })}
            columns={3}
          />
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: KI-EINWILLIGUNG =====
  if (step === 'kiConsent') {
    return (
      <OnboardingShell stepKey={step}
        onBack={goBack}
        progress={progress}
        footer={
          <PrimaryButton onClick={() => { set({ kiConsentAccepted: true }); goNext(); }}>
            Zustimmen & weiter
          </PrimaryButton>
        }
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

  // ===== STEP: AUTH-AUSWAHL (Apple/Google visuell gemockt + Anmelde-Code) =====
  if (step === 'authChoice') {
    const busy = socialLoading !== null;
    return (
      <OnboardingShell stepKey={step} onBack={goBack} progress={progress}>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Fast geschafft — so sicherst du deinen Account.</ChatBubble>
          </div>

          {/* Apple (primär) */}
          <button
            onClick={() => handleRegister('apple')}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-white text-black font-['Poppins:SemiBold',sans-serif] text-[16px] active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
          >
            {socialLoading === 'apple' ? (
              <div className="w-[18px] h-[18px] border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
            ) : (
              <span className="text-black"><AppleIcon /></span>
            )}
            {socialLoading === 'apple' ? 'Verbinden…' : 'Mit Apple fortfahren'}
          </button>

          {/* Google + E-Mail (sekundär) */}
          <button
            onClick={() => handleRegister('google')}
            disabled={busy}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white/80 font-['Poppins:Medium',sans-serif] text-[15px] active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
          >
            {socialLoading === 'google' ? (
              <div className="w-[18px] h-[18px] border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {socialLoading === 'google' ? 'Verbinden…' : 'Mit Google fortfahren'}
          </button>

          {/* Anmelde-Code (Anton-Style, dezent) */}
          <div className="pt-2">
            <TextLink onClick={() => handleRegister('anmeldeCode')}>
              Lieber ohne Apple/Google? Login-Code nutzen
            </TextLink>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: LOGIN-CODE-ANZEIGE (Backup, immer — auch nach Apple/Google) =====
  if (step === 'codeDisplay' && registered) {
    const usesAuth = registered.authMethod === 'apple' || registered.authMethod === 'google';
    return (
      <OnboardingShell stepKey={step}
        footer={<PrimaryButton onClick={finish}>Weiter zum Dashboard</PrimaryButton>}
      >
        <div className="h-full flex flex-col items-center justify-center text-center gap-6">
          <MascotAvatar size={96} />
          <ChatBubble>
            {usesAuth
              ? 'Geschafft! 🎉 Und hier ist dein Login-Code als Backup.'
              : 'Das ist dein Login-Code — bitte gut aufbewahren!'}
          </ChatBubble>

          <button
            onClick={copyCode}
            className="w-full max-w-[320px] rounded-3xl py-7 active:scale-[0.98] transition-transform"
            style={{ background: 'rgba(0,147,121,0.12)', border: `1.5px solid ${BRAND.primary}` }}
          >
            <div className="font-['Poppins:Bold',sans-serif] text-[34px] tracking-[0.12em] text-white">
              {registered.anmeldeCode}
            </div>
            <div className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50 mt-2">
              {copied ? '✓ Kopiert!' : 'Tippen zum Kopieren'}
            </div>
          </button>

          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 max-w-[300px]">
            {usesAuth
              ? 'Falls du dich mal nicht mit Apple oder Google anmelden kannst, kommst du hiermit rein. Dein Elternteil sieht ihn auch im Familienkonto.'
              : 'Mit diesem Code meldest du dich auf jedem Gerät an. Apple oder Google kannst du später in den Einstellungen verknüpfen.'}
          </p>
        </div>
      </OnboardingShell>
    );
  }

  return null;
}
