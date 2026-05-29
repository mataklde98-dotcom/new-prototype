// ===== ONBOARDING FLOW (Schüler-Pfad, 28-Mai-Wireframe) =====
// One-Step-Signup: Landing → Wer bist du? → Alter (16+/unter 16) → Registrieren → Dashboard.
// Schul-Daten + KI-Consent werden NICHT mehr hier gesammelt, sondern NACH dem Dashboard
// über den CompleteProfile-Banner. Apple/Google sind VISUELL gemockt; Daten via identityService.
//   Pfad B (16+):     Apple / Google / E-Mail+Passwort → direkt ins Dashboard.
//   Pfad C (unter 16): anonym — Apple "E-Mail verbergen" ODER Fantasie-Username+Passwort.
//                      Danach EINMALIG der Login-Code (einzige Wiederanmeldung), dann Dashboard.

import React, { useState } from 'react';
import { identityService } from '@/services/identityService';
import {
  EMPTY_ONBOARDING_DRAFT,
  type OnboardingDraft,
  type AuthMethod,
  type AgeBracket,
  type SoStudyIdentity,
} from '@/types/identity';
import {
  BRAND,
  MascotAvatar,
  ChatBubble,
  OnboardingShell,
  PrimaryButton,
  SecondaryButton,
  LegalDisclaimer,
  TextLink,
  BigSelectionCard,
  GoogleIcon,
  AppleIcon,
} from './OnboardingShared';
import SoStudyLogo from '@/app/components/SoStudyLogo';

type Step = 'landing' | 'role' | 'ageBracket' | 'signup' | 'codeDisplay';

// Lineare Reihenfolge (für goBack & Fortschritt). 'codeDisplay' liegt außerhalb (nur Pfad C).
const FLOW: Step[] = ['landing', 'role', 'ageBracket', 'signup'];
const PROGRESS_STEPS: Step[] = ['ageBracket', 'signup'];

interface OnboardingFlowProps {
  onComplete: (userData: any) => void;
  onSwitchToLogin: () => void;
  onSwitchToParent: () => void; // Rolle "Elternteil" → Eltern-Onboarding (E1–E8)
}

// Eingabe-Feld im Onboarding-Look (Glass, ≥16px gegen iOS-Zoom).
function OnbInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="selectable-text w-full px-5 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white text-[16px] font-['Poppins:Medium',sans-serif] outline-none focus:border-[#009379] transition-colors"
      style={{ fontSize: 16, ...(props.style || {}) }}
    />
  );
}

// "oder"-Trenner zwischen Social-Login und Formular.
function OrDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-white/[0.10]" />
      <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35">{label}</span>
      <div className="flex-1 h-px bg-white/[0.10]" />
    </div>
  );
}

export default function OnboardingFlow({ onComplete, onSwitchToLogin, onSwitchToParent }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>('landing');
  const [draft, setDraft] = useState<OnboardingDraft>(EMPTY_ONBOARDING_DRAFT);
  const [socialLoading, setSocialLoading] = useState<AuthMethod | null>(null);
  const [registered, setRegistered] = useState<SoStudyIdentity | null>(null);
  const [copied, setCopied] = useState(false);

  // Formular-Felder des One-Step-Signups
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const set = (patch: Partial<OnboardingDraft>) => setDraft((d) => ({ ...d, ...patch }));

  const idx = FLOW.indexOf(step);
  const goBack = () => {
    if (idx > 0) setStep(FLOW[idx - 1]);
  };

  const progress = PROGRESS_STEPS.includes(step)
    ? { current: PROGRESS_STEPS.indexOf(step), total: PROGRESS_STEPS.length }
    : undefined;

  const finishWith = (_identity: SoStudyIdentity) => {
    // registerStudent() hat userData bereits in localStorage persistiert.
    const raw = localStorage.getItem('userData');
    onComplete(raw ? JSON.parse(raw) : null);
  };

  // ===== Registrierung (nach Auth-Methoden-Wahl) =====
  const handleRegister = async (method: AuthMethod) => {
    if (socialLoading) return;
    const anonymous = draft.ageBracket === 'under16';
    const usernamePath = anonymous && method === 'anmeldeCode';
    setSocialLoading(method);
    const identity = await identityService.registerStudent({
      ...draft,
      authMethod: method,
      // Pfad C per Username: Anzeigename = Username (kein Nachname/Spitzname-Schritt nötig).
      display_name: usernamePath ? username.trim() : '',
      username: usernamePath ? username.trim() : undefined,
      // E-Mail nur im 16+-E-Mail-Pfad; anonyme Konten erheben keine.
      email: method === 'email' ? email.trim() : undefined,
    });
    setSocialLoading(null);
    setRegistered(identity);
    // Doc §8: JEDER Schüler bekommt seinen Login-Code EINMALIG beim Signup gezeigt
    // (danach immer im Profil sichtbar). Für anonyme Konten ist er die einzige Wiederanmeldung.
    setStep('codeDisplay');
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
            {/* Unter-16-Hinweis (Doc §3 Screen 0) */}
            <p className="text-center font-['Poppins:Regular',sans-serif] text-[12px] leading-[1.5] text-white/35 px-3">
              Unter 16? Dein Konto bleibt anonym — wir fragen keine persönlichen Daten.
            </p>
          </div>
        }
      >
        <div className="h-full flex flex-col items-center justify-center text-center gap-7">
          <SoStudyLogo />
          <MascotAvatar size={120} />
          <div>
            <h1 className="font-['Poppins:Bold',sans-serif] text-[28px] leading-[1.2] text-white">
              Bessere Noten.
              <br />
              Weniger Stress.
            </h1>
            <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white/55 mt-3 max-w-[300px]">
              Dein KI-Lernbuddy für Karteikarten, Probeklausuren und Nachhilfe.
            </p>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: ROLLE-AUSWAHL =====
  // Doc §3: Auswahl führt OHNE extra "Weiter" direkt in den jeweiligen Pfad.
  if (step === 'role') {
    return (
      <OnboardingShell stepKey={step} onBack={goBack}>
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
              onClick={() => { set({ role: 'student' }); setStep('ageBracket'); }}
            />
            <BigSelectionCard
              emoji="👨‍👩‍👧"
              title="Ich bin Elternteil"
              subtitle="Richte den Account für dein Kind ein."
              selected={draft.role === 'parent'}
              onClick={() => { set({ role: 'parent' }); onSwitchToParent(); }}
            />
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: ALTERS-STUFE (Self-Declaration, KEIN Geburtsdatum) =====
  // Doc §3/§6: Tippen wählt die Stufe und führt OHNE extra "Weiter" direkt zum Signup (B vs. C).
  if (step === 'ageBracket') {
    const pick = (v: AgeBracket) => { set({ ageBracket: v }); setStep('signup'); };
    return (
      <OnboardingShell stepKey={step} onBack={goBack} progress={progress}>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Wie alt bist du ungefähr?</ChatBubble>
          </div>
          <div className="space-y-3">
            <BigSelectionCard
              emoji="🧑"
              title="16 oder älter"
              subtitle="Du kannst dich mit E-Mail, Apple oder Google anmelden."
              selected={draft.ageBracket === '16plus'}
              onClick={() => pick('16plus')}
            />
            <BigSelectionCard
              emoji="🧒"
              title="Unter 16"
              subtitle="Dein Konto bleibt anonym — wir fragen keinen echten Namen."
              selected={draft.ageBracket === 'under16'}
              onClick={() => pick('under16')}
            />
          </div>
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 px-1 leading-[1.5]">
            Wir fragen kein Geburtsdatum — nur diese grobe Einordnung für den Datenschutz.
          </p>
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: ONE-STEP-SIGNUP =====
  if (step === 'signup') {
    const busy = socialLoading !== null;
    const isUnder16 = draft.ageBracket === 'under16';
    const emailValid = email.includes('@') && email.trim().length >= 5 && password.trim().length >= 6;
    const usernameValid = username.trim().length >= 2 && password.trim().length >= 6;

    return (
      <OnboardingShell stepKey={step} onBack={goBack} progress={progress}>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Fast geschafft — erstelle deinen Account.</ChatBubble>
          </div>

          {/* Apple (immer, primär) */}
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
          {isUnder16 && (
            <p className="-mt-3 text-center font-['Poppins:Regular',sans-serif] text-[12px] text-white/35">
              Mit „E-Mail verbergen" bleibst du komplett anonym.
            </p>
          )}

          {/* Google nur für 16+ (Pfad C ist Apple-only / Username) */}
          {!isUnder16 && (
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
          )}

          <OrDivider label={isUnder16 ? 'oder ohne Apple' : 'oder mit E-Mail'} />

          {/* Formular — 16+: E-Mail+Passwort · unter 16: Fantasie-Username+Passwort */}
          {isUnder16 ? (
            <div className="space-y-3">
              <OnbInput
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (Fantasiename)"
                autoCapitalize="none"
                autoCorrect="off"
              />
              <OnbInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort (mind. 6 Zeichen)"
              />
              <PrimaryButton
                disabled={!usernameValid || busy}
                loading={socialLoading === 'anmeldeCode'}
                onClick={() => handleRegister('anmeldeCode')}
              >
                Account erstellen
              </PrimaryButton>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 px-1 leading-[1.5]">
                Keine E-Mail, kein echter Name — dein Username genügt.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <OnbInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-Mail"
                autoCapitalize="none"
                autoCorrect="off"
              />
              <OnbInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort (mind. 6 Zeichen)"
              />
              <PrimaryButton
                disabled={!emailValid || busy}
                loading={socialLoading === 'email'}
                onClick={() => handleRegister('email')}
              >
                Account erstellen
              </PrimaryButton>
            </div>
          )}

          <div className="pt-1">
            <TextLink onClick={onSwitchToLogin}>Bereits ein Konto? Anmelden</TextLink>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  // ===== STEP: LOGIN-CODE-ANZEIGE (Doc §8: jeder Schüler, einmalig beim Signup) =====
  if (step === 'codeDisplay' && registered) {
    const anon = !!registered.anonymous;
    return (
      <OnboardingShell stepKey={step}
        footer={<PrimaryButton onClick={() => finishWith(registered)}>Weiter zum Dashboard</PrimaryButton>}
      >
        <div className="h-full flex flex-col items-center justify-center text-center gap-6">
          <MascotAvatar size={96} />
          <ChatBubble>
            {anon
              ? 'Geschafft! 🎉 Das ist dein Login-Code — bitte gut aufbewahren!'
              : 'Geschafft! 🎉 Hier ist dein Login-Code als Backup.'}
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
            {anon
              ? 'Da dein Konto anonym ist, kommst du nur mit diesem Code (oder Apple) wieder rein. Du findest ihn jederzeit in den Einstellungen.'
              : 'Falls du dich mal nicht anmelden kannst, kommst du hiermit rein. Du findest ihn jederzeit in den Einstellungen.'}
          </p>
        </div>
      </OnboardingShell>
    );
  }

  return null;
}
