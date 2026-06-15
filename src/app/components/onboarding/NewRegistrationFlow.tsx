// ===== SOSTUDY ONBOARDING (Einstieg, Prototyp) =====
// STANDARD-Einstieg für ausgeloggte Nutzer (siehe main.tsx). Reiner Prototyp: KEIN Backend,
// Frontend-Validierung, Mock-Session via identityService.
//
// Prinzip: EINE Seite. "Wer bist du?" → beim Tippen auf eine Rolle erscheint das passende
// Account-Formular INLINE darunter (Auto-Scroll), kein Seitenwechsel. Hochscrollen + andere
// Rolle wählen tauscht das Formular. Nach Account-/Auth-Erstellung → direkt Home/Dashboard.
//   Schüler  → Apple/Google/E-Mail+Passwort → registerStudent → Home
//   Eltern   → Apple/Google bzw. Name/E-Mail/Passwort/Handynummer + Demo-OTP → registerParent → Eltern-Dashboard
// Login-Screen ("Willkommen zurück") separat; Wechsel via horizontalem framer-motion-Slide.
// HINWEIS: Nickname/Bundesland/Schulform/Klassenstufe/Lernbegleiter werden NICHT mehr hier
// erhoben (kommen später an anderer Stelle) — identityService unterstützt die Felder weiterhin.

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GraduationCap, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import PeopleRounded from '@mui/icons-material/PeopleRounded';
import { identityService } from '@/services/identityService';
import type { AuthMethod, SoStudyIdentity } from '@/types/identity';
import { BRAND, GoogleIcon, AppleIcon } from './OnboardingShared';
import SoStudyLogo from '@/app/components/SoStudyLogo';
import welcomeHero from '@/assets/welcome-hero.png';

type Role = 'student' | 'parent';

// Stabiler, ruhender Hintergrund-Verlauf (register/login sliden DARÜBER).
const SCREEN_BG = `radial-gradient(120% 80% at 50% 0%, rgba(0,147,121,0.10) 0%, ${BRAND.bg} 55%)`;

const slideVariants = {
  enter: (dir: 'forward' | 'back') => ({ x: dir === 'forward' ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (dir: 'forward' | 'back') => ({ x: dir === 'forward' ? '-100%' : '100%' }),
};
const slideTransition = { duration: 0.42, ease: [0.32, 0.72, 0, 1] as const };

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

function PasswordField({ value, onChange, placeholder }: {
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="selectable-text w-full pl-5 pr-12 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white font-['Poppins:Medium',sans-serif] outline-none focus:border-[#009379] transition-colors"
        style={{ fontSize: 16 }}
      />
      <button type="button" onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Passwort verbergen' : 'Passwort anzeigen'}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-white/40 active:scale-90 transition-transform">
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

// AGB-Hinweis (exakter Wortlaut, klickbare Links) — gleiche Schriftgröße wie Umgebungstext.
function AgbLink({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => { /* Prototyp: echte AGB-/Datenschutz-Seiten folgen später */ }}
      className="inline p-0 m-0 align-baseline text-[12px] leading-[inherit] underline underline-offset-2 font-['Poppins:Regular',sans-serif] text-[#00B894] active:opacity-70">
      {children}
    </button>
  );
}
function AgbText() {
  return (
    <>
      Mit der Nutzung von SoStudy bestätigst du, dass du unsere{' '}
      <AgbLink>AGB</AgbLink> und <AgbLink>Datenschutzerklärung</AgbLink> gelesen und akzeptiert hast.
    </>
  );
}

function PrimaryBtn({ children, onClick, disabled, loading }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; loading?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-['Poppins:SemiBold',sans-serif] text-[16px] text-white active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:active:scale-100"
      style={{
        background: disabled || loading ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${BRAND.primaryLight}, ${BRAND.primary})`,
        boxShadow: disabled || loading ? 'none' : '0 8px 24px rgba(0,147,121,0.35)',
      }}>
      {loading && <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
}

function AppleBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-white text-black font-['Poppins:SemiBold',sans-serif] text-[16px] active:scale-[0.98] transition-all duration-150">
      <span className="text-black"><AppleIcon /></span>{label}
    </button>
  );
}

function GoogleBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white/80 font-['Poppins:Medium',sans-serif] text-[15px] active:scale-[0.98] transition-all duration-150">
      <GoogleIcon />Mit Google fortfahren
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

// Sanftes Einblenden eines Inline-Blocks (key wechselt → Re-Animation beim Rollenwechsel).
function Reveal({ k, children }: { k: string; children: React.ReactNode }) {
  return <div key={k} className="animate-[onbStepIn_0.3s_ease-out]">{children}</div>;
}

// Info-Pill (Glas-Zeile mit Icon links) — AGB.
function InfoPill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="shrink-0 mt-0.5">{icon}</div>
      <p className="font-['Poppins:Regular',sans-serif] text-[12px] leading-[1.5] text-white/55">{children}</p>
    </div>
  );
}

// Rollen-Karte: zentriert — rundes Icon-Badge mit Glow, Titel, Beschreibung, runder Pfeil unten.
// accent (= ausgewählte Rolle) wird türkis hervorgehoben.
function RoleCard({ icon, title, subtitle, accent, onClick }: {
  icon: React.ReactNode; title: string; subtitle?: string; accent?: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className="relative flex flex-col items-center text-center gap-3 px-4 py-6 rounded-3xl h-full active:scale-[0.98] transition-all duration-200"
      style={{
        background: accent ? 'linear-gradient(160deg, rgba(0,147,121,0.16), rgba(255,255,255,0.02))' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${accent ? 'rgba(0,147,121,0.45)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: accent ? '0 16px 40px rgba(0,147,121,0.18)' : '0 8px 22px rgba(0,0,0,0.22)',
      }}>
      <div className="w-16 h-16 flex items-center justify-center rounded-full mt-1"
        style={{
          background: accent ? 'radial-gradient(circle at 50% 45%, rgba(0,184,148,0.28), rgba(0,147,121,0.06))' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${accent ? 'rgba(0,184,148,0.45)' : 'rgba(255,255,255,0.10)'}`,
          boxShadow: accent ? '0 0 26px rgba(0,184,148,0.35)' : 'none',
        }}>
        {icon}
      </div>
      <div className="mt-1">
        <div className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white leading-[1.2]">{title}</div>
        {subtitle && <div className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/45 mt-1.5 leading-[1.45]">{subtitle}</div>}
      </div>
      <div className="mt-auto pt-3">
        <div className="w-11 h-11 flex items-center justify-center rounded-full"
          style={accent
            ? { background: `linear-gradient(135deg, ${BRAND.primaryLight}, ${BRAND.primary})`, boxShadow: '0 8px 20px rgba(0,147,121,0.45)' }
            : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>
          <ArrowRight size={18} color="#fff" strokeWidth={2.4} />
        </div>
      </div>
    </button>
  );
}

// Inline-Überschrift der Account-Formulare.
function FormHeading({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-3">
      <h2 className="font-['Poppins:Bold',sans-serif] text-[22px] leading-[1.15] text-white">{children}</h2>
      {subtitle && <p className="font-['Poppins:Regular',sans-serif] text-[14px] leading-[1.5] text-white/50 mt-1.5 px-2">{subtitle}</p>}
    </div>
  );
}

// ===== HAUPTKOMPONENTE =====
export default function NewRegistrationFlow() {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<AuthMethod | 'verify' | null>(null);

  // Formularfelder
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Eltern
  const [phone, setPhone] = useState('');        // Eltern

  // Eltern-OTP (Demo)
  const [otpStage, setOtpStage] = useState<'idle' | 'sent'>('idle');
  const [demoCode, setDemoCode] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // Auto-Scroll zum Inline-Formular bei Rollenwahl
  const formRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (role && formRef.current) {
      const t = setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 70);
      return () => clearTimeout(t);
    }
  }, [role]);

  const pickRole = (r: Role) => {
    setError('');
    setOtpStage('idle');
    setRole(r);
  };

  // ===== Schüler-Registrierung → direkt Home =====
  const registerStudent = async (method: AuthMethod) => {
    if (busy) return;
    setError(''); setBusy(method);
    const emailPath = method === 'email';
    // Interim-Name (bis Nickname später an anderer Stelle erfasst wird) → kein Nickname-Gate, direkt Home.
    const displayName = emailPath ? (email.trim().split('@')[0] || 'Lernende:r') : 'Lernende:r';
    await identityService.registerStudent({
      role: 'student',
      display_name: displayName,
      bundesland: '', schoolType: '', grade: undefined,
      kiConsentAccepted: false,
      authMethod: method,
      email: emailPath ? email.trim() : undefined,
      ageBracket: '16plus',
      anonymous: false,
    });
    setBusy(null);
    goToApp();
  };

  // ===== Eltern-Registrierung (Demo-SMS-OTP) → Eltern-Dashboard =====
  const requestParentOtp = () => {
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
    goToApp();
  };

  // ===== Login (bestehender Mock-Login) =====
  const demoSocialLogin = async (method: AuthMethod) => {
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

  const switchToLogin = () => { setError(''); setDirection('forward'); setMode('login'); };
  const switchToRegister = () => { setError(''); setDirection('back'); setMode('register'); };

  // ===== Validierung =====
  const accountValid = email.includes('@') && email.trim().length >= 5 && password.trim().length >= 6;
  const parentEmailValid = fullName.trim().length >= 2 && email.includes('@') && password.trim().length >= 6;

  // ===== Inline-Formulare =====
  const renderStudentForm = () => (
    <>
      <FormHeading subtitle="Damit dein Fortschritt nicht verloren geht und du jederzeit weiterlernen kannst.">Account <span style={{ color: BRAND.primaryLight }}>erstellen</span></FormHeading>
      <div className="space-y-3">
        <AppleBtn onClick={() => registerStudent('apple')} label="Mit Apple fortfahren" />
        <GoogleBtn onClick={() => registerStudent('google')} />
        <Or label="oder mit E-Mail" />
        <Field type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" autoCapitalize="none" autoCorrect="off" />
        <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort (mind. 6 Zeichen)" />
        <PrimaryBtn onClick={() => registerStudent('email')} disabled={!accountValid} loading={busy === 'email'}>
          Account erstellen <ArrowRight size={18} strokeWidth={2.4} />
        </PrimaryBtn>
      </div>
    </>
  );

  const renderParentForm = () => (
    <>
      <FormHeading subtitle="Behalte den Lernweg deines Kindes im Blick, von Fortschritten in der App bis zu Nachhilfeleistungen.">
        Eltern-Account <span style={{ color: BRAND.primaryLight }}>erstellen</span>
      </FormHeading>
      <div className="space-y-3">
        <AppleBtn onClick={() => verifyParentAndRegister('apple')} label="Mit Apple fortfahren" />
        <GoogleBtn onClick={() => verifyParentAndRegister('google')} />
        <Or label="oder mit E-Mail" />
        <Field value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Vor- und Nachname" />
        <Field type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" autoCapitalize="none" autoCorrect="off" />
        <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort (mind. 6 Zeichen)" />
        <Field type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Handynummer (für Rückrufe)" />

        {otpStage === 'idle' ? (
          <PrimaryBtn onClick={requestParentOtp} disabled={!parentEmailValid}>
            Account erstellen <ArrowRight size={18} strokeWidth={2.4} />
          </PrimaryBtn>
        ) : (
          <Reveal k="parentOtp">
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
    </>
  );

  // ===== Register (eine Seite) =====
  const renderRegister = () => (
    <>
      <img src={welcomeHero} alt="" draggable={false} className="w-full select-none" />
      <h1 className="text-center font-['Poppins:Bold',sans-serif] text-[30px] leading-[1.15] text-white -mt-1">
        Willkommen bei
      </h1>
      <div className="flex justify-center mt-2">
        <SoStudyLogo className="h-9" />
      </div>
      <p className="text-center font-['Poppins:Regular',sans-serif] text-[14px] leading-[1.5] text-white/55 mt-3 px-4">
        KI-Lerntools und persönliche Nachhilfe, alles in einer App.
      </p>

      <h2 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white mt-6 mb-3">Wer bist du?</h2>
      <div className="grid grid-cols-2 gap-3 items-stretch">
        <RoleCard accent={role === 'student'} icon={<GraduationCap size={30} color={BRAND.primaryLight} strokeWidth={1.8} />}
          title="Ich bin Schüler:in" subtitle="Lerne, erstelle und organisiere deine Materialien." onClick={() => pickRole('student')} />
        <RoleCard accent={role === 'parent'} icon={<PeopleRounded style={{ fontSize: 32, color: role === 'parent' ? BRAND.primaryLight : 'rgba(255,255,255,0.82)' }} />}
          title="Ich bin Elternteil" subtitle="Unterstütze dein Kind und behalte den Überblick." onClick={() => pickRole('parent')} />
      </div>

      {role && (
        <div ref={formRef} className="mt-7 scroll-mt-4">
          <Reveal k={role}>
            {role === 'student' ? renderStudentForm() : renderParentForm()}
          </Reveal>
        </div>
      )}

      {error && <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-red-300 px-1 mt-3">{error}</p>}

      <div className="mt-auto pt-8 space-y-4">
        <InfoPill icon={<ShieldCheck size={18} color={BRAND.primaryLight} strokeWidth={2} />}>
          <AgbText />
        </InfoPill>
        <div className="text-center">
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45">Bereits ein Konto?</p>
          <button type="button" onClick={switchToLogin}
            className="inline-flex items-center gap-1 mt-1 font-['Poppins:SemiBold',sans-serif] text-[15px] active:opacity-70 transition-opacity" style={{ color: BRAND.primaryLight }}>
            Anmelden <ArrowRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </>
  );

  // ===== Login ("Willkommen zurück") =====
  const renderLogin = () => (
    <>
      <img src={welcomeHero} alt="" draggable={false} className="w-full select-none" />
      <h1 className="text-center font-['Poppins:Bold',sans-serif] text-[26px] leading-[1.15] text-white -mt-1 mb-7">Willkommen zurück</h1>
      <div className="space-y-3">
        <AppleBtn onClick={() => demoSocialLogin('apple')} label="Mit Apple anmelden" />
        <GoogleBtn onClick={() => demoSocialLogin('google')} />
        <Or label="oder mit E-Mail" />
        <Field type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" autoCapitalize="none" />
        <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort" />
        <PrimaryBtn onClick={() => demoSocialLogin('email')} loading={busy === 'email'}>Anmelden</PrimaryBtn>
      </div>
      {error && <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-red-300 px-1 mt-3">{error}</p>}
      <div className="mt-auto pt-6">
        <button type="button" onClick={switchToRegister}
          className="w-full text-center py-2 font-['Poppins:Medium',sans-serif] text-[14px] text-white/55 active:text-white/85">
          Noch kein Konto? Registrieren
        </button>
      </div>
    </>
  );

  const screenKey = mode;
  const content = mode === 'login' ? renderLogin() : renderRegister();

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: SCREEN_BG }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={screenKey}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          className="absolute inset-0 overflow-y-auto"
          style={{ willChange: 'transform' }}
        >
          <div
            className="min-h-full max-w-[480px] mx-auto w-full flex flex-col px-5"
            style={{ paddingTop: 'calc(var(--safe-area-inset-top) + 24px)', paddingBottom: 'calc(var(--safe-area-inset-bottom) + 28px)' }}
          >
            {content}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
