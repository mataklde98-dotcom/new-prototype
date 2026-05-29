// ===== NEW REGISTRATION FLOW (Referenz-Strecke, 28-Mai-Wireframe) =====
// EIGENSTÄNDIGE Single-Screen-Registrierung — erreichbar NUR unter /new-registration (siehe main.tsx).
// Berührt den bestehenden Onboarding-/Auth-Flow NICHT. Gedacht als Referenz für andere Entwickler.
//
// Prinzip (Doc §3): EIN Screen, progressive Inline-Enthüllung. Beim Tippen auf "Schüler:in" / "Elternteil"
// erscheint das passende Formular SOFORT darunter — KEIN Seitenwechsel, kein extra "Weiter".
//   Schüler → Alters-Stufe (16+/unter 16) → Signup-Formular (Pfad B/C)
//   Elternteil → Eltern-Formular + SMS-OTP (Pfad A)
// Schul-Daten + KI-Consent folgen NACH dem Dashboard (CompleteProfileBanner) — nicht hier.
//
// Reiner Prototyp: Apple/Google sind visuell gemockt; Registrierung läuft über identityService
// (localStorage). Nach Abschluss → Redirect auf "/" (Haupt-App liest die Session → Home/Dashboard).

import React, { useState } from 'react';
import { identityService } from '@/services/identityService';
import type { AuthMethod, AgeBracket, SoStudyIdentity } from '@/types/identity';
import { BRAND, MascotAvatar, GoogleIcon, AppleIcon } from './OnboardingShared';
import SoStudyLogo from '@/app/components/SoStudyLogo';

type Role = 'student' | 'parent';

// Nach Abschluss zurück in die Haupt-App (liest isLoggedIn/userData → Home bzw. Eltern-Dashboard).
const goToApp = () => { window.location.assign('/'); };

// ===== KLEINE BAUSTEINE (Dark-Glass, Poppins, Brand #009379) =====
function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="selectable-text w-full px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white font-['Poppins:Medium',sans-serif] outline-none focus:border-[#009379] transition-colors"
      style={{ fontSize: 16, ...(props.style || {}) }}
    />
  );
}

function PrimaryBtn({ children, onClick, disabled, loading, type = 'button' }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; loading?: boolean; type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-['Poppins:SemiBold',sans-serif] text-[16px] text-white active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:active:scale-100"
      style={{
        background: disabled || loading ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${BRAND.primaryLight}, ${BRAND.primary})`,
        boxShadow: disabled || loading ? 'none' : '0 8px 24px rgba(0,147,121,0.35)',
      }}
    >
      {loading && <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
}

function AppleBtn({ onClick, loading, label }: { onClick: () => void; loading?: boolean; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-white text-black font-['Poppins:SemiBold',sans-serif] text-[16px] active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
    >
      {loading ? <div className="w-[18px] h-[18px] border-2 border-black/20 border-t-black/60 rounded-full animate-spin" /> : <span className="text-black"><AppleIcon /></span>}
      {loading ? 'Verbinden…' : label}
    </button>
  );
}

function GoogleBtn({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white/80 font-['Poppins:Medium',sans-serif] text-[15px] active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
    >
      {loading ? <div className="w-[18px] h-[18px] border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /> : <GoogleIcon />}
      {loading ? 'Verbinden…' : 'Mit Google fortfahren'}
    </button>
  );
}

function Or({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-white/[0.10]" />
      <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35">{label}</span>
      <div className="flex-1 h-px bg-white/[0.10]" />
    </div>
  );
}

// Zwei nebeneinander stehende Auswahl-Buttons (Rolle / Alter) — Tippen wählt + enthüllt sofort.
function PickRow({ options, value, onPick }: {
  options: { key: string; emoji: string; title: string }[];
  value: string | null;
  onPick: (key: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {options.map((o) => {
        const sel = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onPick(o.key)}
            className="flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-2xl text-center active:scale-[0.98] transition-all duration-150"
            style={{
              background: sel ? 'rgba(0,147,121,0.16)' : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${sel ? BRAND.primary : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <span className="text-[24px] leading-none">{o.emoji}</span>
            <span className={`font-['Poppins:SemiBold',sans-serif] text-[14px] ${sel ? 'text-white' : 'text-white/75'}`}>{o.title}</span>
          </button>
        );
      })}
    </div>
  );
}

// Inline-Block, der beim Erscheinen sanft eingeblendet wird.
function Reveal({ k, children }: { k: string; children: React.ReactNode }) {
  return <div key={k} className="animate-[onbStepIn_0.3s_ease-out]">{children}</div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white/90 mb-3 mt-1">{children}</h2>;
}

// ===== HAUPTKOMPONENTE =====
export default function NewRegistrationFlow() {
  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Registrierungs-Zustand
  const [role, setRole] = useState<Role | null>(null);
  const [ageBracket, setAgeBracket] = useState<AgeBracket | null>(null);
  const [busy, setBusy] = useState<AuthMethod | 'verify' | null>(null);
  const [error, setError] = useState('');

  // Formularfelder
  const [fullName, setFullName] = useState(''); // Pfad A: EIN Feld "Vor- und Nachname" (wie im HTML)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  // Eltern-OTP (Pfad A2) — lokal gemockt, ohne Validierung, Code vorbefüllt.
  const [otpStage, setOtpStage] = useState<'idle' | 'sent'>('idle');
  const [demoCode, setDemoCode] = useState('');
  const [otpInput, setOtpInput] = useState('');

  const pickRole = (r: string) => { setRole(r as Role); setAgeBracket(null); setError(''); };
  const pickAge = (a: string) => { setAgeBracket(a as AgeBracket); setError(''); };

  // ===== Schüler-Registrierung (Pfad B/C) =====
  const registerStudent = async (method: AuthMethod) => {
    if (busy) return;
    const anonymous = ageBracket === 'under16';
    const usernamePath = anonymous && method === 'anmeldeCode';
    const emailPrefix = method === 'email' ? email.trim().split('@')[0] : '';
    setError('');
    setBusy(method);
    await identityService.registerStudent({
      role: 'student',
      // Direkter Anzeigename → KEIN extra Spitzname-Schritt (so simpel wie im HTML).
      display_name: usernamePath ? username.trim() : emailPrefix,
      bundesland: '', schoolType: '', grade: undefined,
      kiConsentAccepted: false,
      authMethod: method,
      email: method === 'email' ? email.trim() : undefined,
      ageBracket: ageBracket ?? '16plus',
      anonymous,
      username: usernamePath ? username.trim() : undefined,
    });
    setBusy(null);
    // HTML B2/C2: "One step → straight to Home". Der Login-Code bleibt im Profil sichtbar.
    goToApp();
  };

  // ===== Eltern-Registrierung (Pfad A) =====
  const requestParentOtp = () => {
    // Prototyp: KEINE Validierung — Code lokal erzeugen + direkt vorbefüllen (ein Tap genügt).
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setDemoCode(code);
    setOtpInput(code);
    setOtpStage('sent');
    setError('');
  };

  const verifyParentAndRegister = async (method: AuthMethod) => {
    if (busy) return;
    setError('');
    setBusy(method === 'email' ? 'verify' : method);
    await identityService.registerParent({
      real_name: fullName.trim(),
      phone: phone.trim() ? `${phone.trim()}` : undefined,
      email: method === 'email' ? email.trim() : undefined,
      kiConsentAccepted: true,
      authMethod: method,
    });
    setBusy(null);
    goToApp(); // → Eltern-Dashboard
  };

  // ===== Login (L1/L2) =====
  const [loginCode, setLoginCode] = useState('');
  const [showCodeLogin, setShowCodeLogin] = useState(false);
  const doCodeLogin = async () => {
    if (!loginCode.trim() || busy) return;
    setError('');
    setBusy('anmeldeCode');
    const identity = await identityService.loginWithAnmeldeCode(loginCode.trim());
    setBusy(null);
    if (identity) goToApp();
    else setError('Ungültiger Login-Code.');
  };
  const demoSocialLogin = async (method: AuthMethod) => {
    // Prototyp-Login: voll ausgestatteten Demo-Schüler anmelden → Home.
    if (busy) return;
    setBusy(method);
    const now = new Date().toISOString();
    identityService.establishSession({
      userId: 'user_demo_login_ref', role: 'student',
      display_name: 'Alex', real_name: '',
      bundesland: 'Bayern', schoolType: 'Gymnasium', grade: '10',
      volljaehrig: false, ageBracket: '16plus', anonymous: false,
      anmeldeCode: '', authMethod: method,
      linkedAuthMethods: method === 'apple' || method === 'google' ? [method] : [],
      kiConsent: { accepted: true, timestamp: now }, createdAt: now,
    } as SoStudyIdentity, false);
    setBusy(null);
    goToApp();
  };

  // ===== Validierung der Formulare (sanft, nur fürs Aktivieren des Buttons) =====
  const emailValid = email.includes('@') && email.trim().length >= 5 && password.trim().length >= 6;
  const usernameValid = username.trim().length >= 2 && password.trim().length >= 6;
  const parentEmailValid = fullName.trim().length >= 2 && email.includes('@') && password.trim().length >= 6;

  // ===== LOGIN-MODUS (L1/L2) =====
  if (mode === 'login') {
    return (
      <Screen>
        <Header />
        <SectionLabel>Willkommen zurück</SectionLabel>
        <div className="space-y-3">
          <AppleBtn onClick={() => demoSocialLogin('apple')} loading={busy === 'apple'} label="Mit Apple anmelden" />
          <GoogleBtn onClick={() => demoSocialLogin('google')} loading={busy === 'google'} />
          <Or label="oder mit E-Mail" />
          <Field type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" autoCapitalize="none" />
          <Field type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort" />
          <PrimaryBtn onClick={() => demoSocialLogin('email')} loading={busy === 'email'}>Anmelden</PrimaryBtn>

          {!showCodeLogin ? (
            <button type="button" onClick={() => setShowCodeLogin(true)}
              className="w-full text-center py-2 font-['Poppins:Medium',sans-serif] text-[14px] text-white/55 active:text-white/85">
              Login-Code? Hier eingeben
            </button>
          ) : (
            <Reveal k="codeLogin">
              <Or label="Login-Code" />
              <Field value={loginCode} onChange={(e) => setLoginCode(e.target.value.toUpperCase())} placeholder="z. B. ABCD-1234" autoCapitalize="characters" style={{ textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center' }} />
              <div className="h-2.5" />
              <PrimaryBtn onClick={doCodeLogin} loading={busy === 'anmeldeCode'} disabled={!loginCode.trim()}>Mit Code anmelden</PrimaryBtn>
            </Reveal>
          )}
        </div>
        {error && <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-red-300 px-1 mt-3">{error}</p>}
        <div className="pt-3">
          <button type="button" onClick={() => { setMode('register'); setError(''); }}
            className="w-full text-center py-2 font-['Poppins:Medium',sans-serif] text-[14px] text-white/55 active:text-white/85">
            Noch kein Konto? Registrieren
          </button>
        </div>
      </Screen>
    );
  }

  // ===== REGISTRIERUNGS-MODUS (Single-Screen, progressive Enthüllung) =====
  return (
    <Screen>
      <Header />

      {/* SCHRITT 1 — Rolle (immer sichtbar). Tippen enthüllt sofort. */}
      <SectionLabel>Wer bist du?</SectionLabel>
      <PickRow
        value={role}
        onPick={pickRole}
        options={[
          { key: 'student', emoji: '🎓', title: 'Ich bin Schüler:in' },
          { key: 'parent', emoji: '👨‍👩‍👧', title: 'Ich bin Elternteil' },
        ]}
      />

      {/* PFAD SCHÜLER → Alter → Signup (alles inline) */}
      {role === 'student' && (
        <Reveal k="student">
          <div className="h-6" />
          <SectionLabel>Wie alt bist du?</SectionLabel>
          <PickRow
            value={ageBracket}
            onPick={pickAge}
            options={[
              { key: '16plus', emoji: '🧑', title: '16 oder älter' },
              { key: 'under16', emoji: '🧒', title: 'Unter 16' },
            ]}
          />
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 px-1 mt-2 leading-[1.5]">
            Wir fragen kein Geburtsdatum — nur diese grobe Einordnung.
          </p>

          {/* Pfad B — 16+ */}
          {ageBracket === '16plus' && (
            <Reveal k="b">
              <div className="h-6" />
              <SectionLabel>Account erstellen</SectionLabel>
              <div className="space-y-3">
                <AppleBtn onClick={() => registerStudent('apple')} loading={busy === 'apple'} label="Mit Apple fortfahren" />
                <GoogleBtn onClick={() => registerStudent('google')} loading={busy === 'google'} />
                <Or label="oder mit E-Mail" />
                <Field type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" autoCapitalize="none" />
                <Field type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort (mind. 6 Zeichen)" />
                <PrimaryBtn onClick={() => registerStudent('email')} loading={busy === 'email'} disabled={!emailValid}>Account erstellen</PrimaryBtn>
              </div>
            </Reveal>
          )}

          {/* Pfad C — unter 16 (anonym: Apple-only / Username, KEIN Google, KEINE E-Mail) */}
          {ageBracket === 'under16' && (
            <Reveal k="c">
              <div className="h-6" />
              <SectionLabel>Account erstellen</SectionLabel>
              <div className="space-y-3">
                <AppleBtn onClick={() => registerStudent('apple')} loading={busy === 'apple'} label="Mit Apple fortfahren" />
                <p className="text-center font-['Poppins:Regular',sans-serif] text-[12px] text-white/35">
                  Mit „E-Mail verbergen" bleibst du komplett anonym.
                </p>
                <Or label="oder ohne Apple" />
                <Field value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username (Fantasiename)" autoCapitalize="none" autoCorrect="off" />
                <Field type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort (mind. 6 Zeichen)" />
                <PrimaryBtn onClick={() => registerStudent('anmeldeCode')} loading={busy === 'anmeldeCode'} disabled={!usernameValid}>Account erstellen</PrimaryBtn>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 px-1 leading-[1.5]">
                  Keine E-Mail, kein echter Name — dein Username genügt.
                </p>
              </div>
            </Reveal>
          )}
        </Reveal>
      )}

      {/* PFAD ELTERN → Formular + SMS-OTP (inline) */}
      {role === 'parent' && (
        <Reveal k="parent">
          <div className="h-6" />
          <SectionLabel>Eltern-Account erstellen</SectionLabel>
          <div className="space-y-3">
            <AppleBtn onClick={() => verifyParentAndRegister('apple')} loading={busy === 'apple'} label="Mit Apple fortfahren" />
            <GoogleBtn onClick={() => verifyParentAndRegister('google')} loading={busy === 'google'} />
            <Or label="oder mit E-Mail" />
            <Field value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Vor- und Nachname" />
            <Field type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" autoCapitalize="none" />
            <Field type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort (mind. 6 Zeichen)" />
            <Field type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Handynummer (für Rückrufe)" />

            {otpStage === 'idle' ? (
              <PrimaryBtn onClick={requestParentOtp} disabled={!parentEmailValid}>Account erstellen</PrimaryBtn>
            ) : (
              <Reveal k="otp">
                <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl mb-3"
                  style={{ background: 'rgba(0,184,148,0.08)', border: '1px solid rgba(0,184,148,0.20)' }}>
                  <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50">Demo — dein SMS-Code:</span>
                  <span className="font-['Poppins:Bold',sans-serif] text-[16px] tracking-[0.25em] text-white">{demoCode}</span>
                </div>
                <Field inputMode="numeric" maxLength={6} value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••" style={{ textAlign: 'center', letterSpacing: '0.4em', fontSize: 22 }} />
                <div className="h-2.5" />
                <PrimaryBtn onClick={() => verifyParentAndRegister('email')} loading={busy === 'verify'}>Bestätigen & loslegen</PrimaryBtn>
              </Reveal>
            )}
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 px-1 leading-[1.5]">
              Handynummer ist Pflicht — für Nachhilfe-Rückrufe. Dein Kind verbindest du später vom Dashboard aus.
            </p>
          </div>
        </Reveal>
      )}

      {error && <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-red-300 px-1 mt-3">{error}</p>}

      {/* Footer: T&C + Unter-16-Hinweis + Login-Wechsel */}
      <div className="pt-6 space-y-2">
        <p className="text-center font-['Poppins:Regular',sans-serif] text-[12px] leading-[1.55] text-white/40 px-3">
          Mit der Nutzung von SoStudy bestätigst du, dass du unsere{' '}
          <span className="text-white/65 underline underline-offset-2">AGB</span> und{' '}
          <span className="text-white/65 underline underline-offset-2">Datenschutzerklärung</span> akzeptierst.
        </p>
        <p className="text-center font-['Poppins:Regular',sans-serif] text-[12px] leading-[1.5] text-white/35 px-3">
          Unter 16? Dein Konto bleibt anonym — wir fragen keine persönlichen Daten.
        </p>
        <button type="button" onClick={() => { setMode('login'); setError(''); }}
          className="w-full text-center py-2 font-['Poppins:Medium',sans-serif] text-[14px] text-white/55 active:text-white/85">
          Bereits ein Konto? Anmelden
        </button>
      </div>
    </Screen>
  );
}

// ===== SCREEN-CONTAINER (eine vollflächige, scrollbare Spalte) =====
function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 overflow-y-auto" style={{ background: `radial-gradient(120% 80% at 50% 0%, rgba(0,147,121,0.10) 0%, ${BRAND.bg} 55%)` }}>
      <div
        className="min-h-full max-w-[480px] mx-auto w-full flex flex-col px-5"
        style={{ paddingTop: 'calc(var(--safe-area-inset-top) + 24px)', paddingBottom: 'calc(var(--safe-area-inset-bottom) + 28px)' }}
      >
        {children}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex flex-col items-center text-center gap-4 mb-7">
      <SoStudyLogo />
      <MascotAvatar size={84} />
      <div className="font-['Poppins:Bold',sans-serif] text-[24px] leading-[1.2] text-white">Willkommen bei SoStudy</div>
    </div>
  );
}
