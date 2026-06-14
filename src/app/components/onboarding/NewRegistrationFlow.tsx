// ===== SOSTUDY ONBOARDING (Schüler-Strecke, Prototyp) =====
// EIGENSTÄNDIGE Onboarding-/Login-Strecke — STANDARD-Einstieg für ausgeloggte Nutzer
// (siehe main.tsx: gerendert, solange keine Session besteht). Nach Abschluss legt finalize()
// eine Mock-Session an und die Haupt-App <App/> übernimmt (Schüler-Home/Dashboard).
//
// Reiner Prototyp: KEIN Backend, keine echte Auth. Frontend-Validierung, Daten im Component-State.
// Flow (Schüler):
//   Welcome → Account erstellen [Mit Account | Mit Login-Code]
//     ├─ Mit Account     → Bundesland → Schulform → Klassenstufe → Lernbegleiter → Fertig
//     └─ Mit Login-Code  → Login-Code anzeigen → Bundesland → … → Fertig
//   Auswahl-Screens (Bundesland/Schulform/Klassenstufe): Tippkacheln mit Auto-Advance (kein „Weiter").
//   Eltern → Platzhalter-Screen (separater Flow, hier nicht gebaut).
// Übergänge: horizontaler iOS-Slide (von rechts vor, von links zurück) via framer-motion.

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  GraduationCap, ShieldCheck, ArrowRight, Eye, EyeOff, Check,
  PartyPopper, Copy, Download, KeyRound, LogIn,
} from 'lucide-react';
import PeopleRounded from '@mui/icons-material/PeopleRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import { identityService } from '@/services/identityService';
import type { AuthMethod, SoStudyIdentity } from '@/types/identity';
import { BRAND, MascotAvatar, ProgressDots, GoogleIcon, AppleIcon, BUNDESLAENDER } from './OnboardingShared';
import SoStudyLogo from '@/app/components/SoStudyLogo';
import welcomeHero from '@/assets/welcome-hero.png';

type Role = 'student' | 'parent';
type Step = 'role' | 'method' | 'loginCodeChoice' | 'codeEntry' | 'signup' | 'codeShow' | 'nickname' | 'bundesland' | 'schoolForm' | 'grade' | 'companion' | 'done' | 'parent';

// Auswahl-Listen (Prototyp).
const SCHOOL_FORMS = ['Gymnasium', 'Realschule', 'Gesamtschule', 'Hauptschule', 'Berufsschule', 'Andere'];
const GRADES = ['5. Klasse', '6. Klasse', '7. Klasse', '8. Klasse', '9. Klasse', '10. Klasse', '11. Klasse', '12. Klasse', '13. Klasse'];

// Stabiler, ruhender Hintergrund-Verlauf (Etappen sliden DARÜBER, der Hintergrund bleibt stehen).
const SCREEN_BG = `radial-gradient(120% 80% at 50% 0%, rgba(0,147,121,0.10) 0%, ${BRAND.bg} 55%)`;

const slideVariants = {
  enter: (dir: 'forward' | 'back') => ({ x: dir === 'forward' ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (dir: 'forward' | 'back') => ({ x: dir === 'forward' ? '-100%' : '100%' }),
};
const slideTransition = { duration: 0.42, ease: [0.32, 0.72, 0, 1] as const };

const goToApp = () => { window.location.assign('/'); };

// Login-Code im Format SOST-XXXX-XXXX (Prototyp: einmalig zufällig, keine Verwechslungs-Zeichen).
const genLoginCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const block = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `SOST-${block()}-${block()}`;
};

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
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Passwort verbergen' : 'Passwort anzeigen'}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-white/40 active:scale-90 transition-transform"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

// AGB-Hinweis (exakter Wortlaut, klickbare Links) — Willkommens- & Account-Screen.
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
    <button
      type="button"
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

// Inline-Block, der beim Erscheinen sanft eingeblendet wird (Mikro-Interaktion innerhalb einer Etappe).
function Reveal({ k, children }: { k: string; children: React.ReactNode }) {
  return <div key={k} className="animate-[onbStepIn_0.3s_ease-out]">{children}</div>;
}


function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Zurück"
      className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08] active:scale-90 transition-transform">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M15 18l-6-6 6-6" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// Kopfzeile auf Schritt-Screens: Zurück (links), optional Fortschrittspunkte (Mitte).
function TopBar({ onBack, progress }: { onBack: () => void; progress?: { current: number; total: number } }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <BackButton onClick={onBack} />
      {progress ? <ProgressDots current={progress.current} total={progress.total} /> : <div className="w-9 h-9" />}
      <div className="w-9 h-9" />
    </div>
  );
}

// Zentrierter Icon-Header (Schritt-Screens): Icon + Titel (+ optional Untertitel).
function IconHeader({ icon, title, subtitle }: { icon?: React.ReactNode; title: React.ReactNode; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 mb-7">
      {icon && <div className="w-16 h-16 flex items-center justify-center">{icon}</div>}
      <h1 className="font-['Poppins:Bold',sans-serif] text-[23px] leading-[1.2] text-white px-3">{title}</h1>
      {subtitle && <p className="font-['Poppins:Regular',sans-serif] text-[14px] leading-[1.5] text-white/50 px-4">{subtitle}</p>}
    </div>
  );
}

// Methoden-Karte (Methoden-Screen): horizontal — rundes Icon-Badge links, Titel + Beschreibung,
// runder Pfeil-Button rechts. accent-Variante (Account) mit Türkis-Glow.
function MethodCard({ icon, title, subtitle, accent, onClick }: {
  icon: React.ReactNode; title: string; subtitle: string; accent?: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-3xl text-left active:scale-[0.98] transition-all duration-200"
      style={{
        background: accent
          ? 'linear-gradient(160deg, rgba(0,147,121,0.16), rgba(255,255,255,0.02))'
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${accent ? 'rgba(0,147,121,0.45)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: accent ? '0 14px 36px rgba(0,147,121,0.18)' : '0 8px 22px rgba(0,0,0,0.22)',
      }}>
      <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-full"
        style={{
          background: accent ? 'radial-gradient(circle at 50% 45%, rgba(0,184,148,0.28), rgba(0,147,121,0.06))' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${accent ? 'rgba(0,184,148,0.45)' : 'rgba(255,255,255,0.10)'}`,
          boxShadow: accent ? '0 0 20px rgba(0,184,148,0.30)' : 'none',
        }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white leading-[1.25]">{title}</div>
        <div className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/45 mt-1 leading-[1.4]">{subtitle}</div>
      </div>
      <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full"
        style={accent
          ? { background: `linear-gradient(135deg, ${BRAND.primaryLight}, ${BRAND.primary})`, boxShadow: '0 8px 18px rgba(0,147,121,0.45)' }
          : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>
        <ArrowRight size={18} color="#fff" strokeWidth={2.4} />
      </div>
    </button>
  );
}

// Info-Pill (Glas-Zeile mit Icon links) — AGB, Hinweise.
function InfoPill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="shrink-0 mt-0.5">{icon}</div>
      <p className="font-['Poppins:Regular',sans-serif] text-[12px] leading-[1.5] text-white/55">{children}</p>
    </div>
  );
}

// Rollen-Karte (Screen 1): premium, zentriert — rundes Icon-Badge mit Glow, Titel,
// Beschreibung, runder Pfeil-Button unten. Schüler-Karte (accent) türkis leuchtend.
function RoleCard({ icon, title, subtitle, accent, onClick }: {
  icon: React.ReactNode; title: string; subtitle?: string; accent?: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className="relative flex flex-col items-center text-center gap-3 px-4 py-6 rounded-3xl h-full active:scale-[0.98] transition-all duration-200"
      style={{
        background: accent
          ? 'linear-gradient(160deg, rgba(0,147,121,0.16), rgba(255,255,255,0.02))'
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${accent ? 'rgba(0,147,121,0.45)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: accent ? '0 16px 40px rgba(0,147,121,0.18)' : '0 8px 22px rgba(0,0,0,0.22)',
      }}>
      {/* Rundes Icon-Badge (mit Glow bei accent) */}
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
      {/* Runder Pfeil-Button unten */}
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

// Einzelauswahl-Liste (Radio links) — Schulform.
function RadioList({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2.5">
      {options.map((opt) => {
        const sel = value === opt;
        return (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left active:scale-[0.99] transition-all duration-150"
            style={{ background: sel ? 'rgba(0,147,121,0.12)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${sel ? BRAND.primary : 'rgba(255,255,255,0.08)'}` }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ border: `2px solid ${sel ? BRAND.primary : 'rgba(255,255,255,0.25)'}` }}>
              {sel && <span className="w-2.5 h-2.5 rounded-full" style={{ background: BRAND.primaryLight }} />}
            </span>
            <span className={`font-['Poppins:Medium',sans-serif] text-[15px] ${sel ? 'text-white' : 'text-white/75'}`}>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

// Code-Box (Monospace) — Login-Code-Anzeige.
function CodeBox({ code }: { code: string }) {
  const [prefix, ...rest] = code.split('-');
  return (
    <div className="w-full rounded-2xl px-5 py-5 text-center" style={{ background: 'rgba(0,147,121,0.10)', border: `1.5px solid ${BRAND.primary}` }}>
      <span className="font-mono font-bold text-[24px] tracking-[0.10em]">
        <span style={{ color: BRAND.primaryLight }}>{prefix}</span>
        <span className="text-white">{rest.length ? '-' + rest.join('-') : ''}</span>
      </span>
    </div>
  );
}

// Sekundärer Glas-Button (Icon oben, Label unten) — Code kopieren/speichern.
function GlassBtn({ onClick, icon, children }: { onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className="flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl active:scale-[0.98] transition-all duration-150"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
      {icon}
      <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80">{children}</span>
    </button>
  );
}

// Platzhalter-Bühne für den Lernbegleiter. AKTUELL: vorhandenes Maskottchen-Asset groß &
// freigestellt (kein Kreis/Rahmen). SPÄTER: hier ein interaktives 3D-Modell einhängen
// (z. B. ein <Canvas>/Modell in diesen Slot rendern). Bewusst als austauschbare Komponente.
function CompanionStage() {
  return (
    <div data-companion-3d-slot className="flex items-center justify-center my-1" style={{ minHeight: 228 }}>
      <MascotAvatar size={212} />
    </div>
  );
}

// ===== HAUPTKOMPONENTE =====
export default function NewRegistrationFlow() {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [step, setStep] = useState<Step>('role');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState('');

  // Account-Erstellung
  const [accountMethod, setAccountMethod] = useState<AuthMethod | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Nickname (Login-Code-Pfad)
  const [createdCode, setCreatedCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Profil-Wizard
  const [bundesland, setBundesland] = useState('');
  const [schoolForm, setSchoolForm] = useState('');
  const [grade, setGrade] = useState('');
  const [companionName, setCompanionName] = useState('');
  const [finalizing, setFinalizing] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  // Eltern-Registrierung (Demo-SMS-OTP)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpStage, setOtpStage] = useState<'idle' | 'sent'>('idle');
  const [demoCode, setDemoCode] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // Login (bestehend)
  const [busy, setBusy] = useState<AuthMethod | 'verify' | null>(null);
  const [loginCode, setLoginCode] = useState('');
  const [showCodeLogin, setShowCodeLogin] = useState(false);

  // ===== Navigation =====
  const codePath = accountMethod === 'anmeldeCode';
  const progressSteps: Step[] = codePath
    ? ['method', 'codeShow', 'nickname', 'bundesland', 'schoolForm', 'grade', 'companion']
    : ['method', 'signup', 'nickname', 'bundesland', 'schoolForm', 'grade', 'companion'];
  const progressFor = (s: Step) => {
    const i = progressSteps.indexOf(s);
    return i >= 0 ? { current: i, total: progressSteps.length } : undefined;
  };

  const advance = (next: Step) => { setError(''); setDirection('forward'); setStep(next); };

  // Tipp-Kachel: kurz hervorheben (~200 ms), dann automatisch weiter (kein „Weiter"-Button).
  const pickAndAdvance = (setter: (v: string) => void, value: string, next: Step) => {
    if (advancing) return;
    setter(value);
    setAdvancing(true);
    setTimeout(() => { setAdvancing(false); advance(next); }, 200);
  };

  const pickRole = (r: string) => {
    setError(''); setDirection('forward');
    if (r === 'student') { setRole('student'); setStep('method'); }
    else { setRole('parent'); setStep('parent'); }
  };

  const goBack = () => {
    setError(''); setDirection('back');
    switch (step) {
      case 'method': setStep('role'); break;
      case 'signup': setStep('method'); break;
      case 'parent': setStep('role'); break;
      case 'loginCodeChoice': setStep('method'); break;
      case 'codeEntry': setStep('loginCodeChoice'); break;
      case 'codeShow': setStep('loginCodeChoice'); break;
      case 'nickname': setStep(codePath ? 'codeShow' : 'signup'); break;
      case 'bundesland': setStep('nickname'); break;
      case 'schoolForm': setStep('bundesland'); break;
      case 'grade': setStep('schoolForm'); break;
      case 'companion': setStep('grade'); break;
      case 'done': setStep('companion'); break;
    }
  };

  const switchToLogin = () => { setError(''); setDirection('forward'); setMode('login'); };
  const switchToRegister = () => { setError(''); setDirection('back'); setMode('register'); setStep('role'); };

  // Account-Erstellung (Prototyp: KEIN echter Login — Methode merken, weiter zum Profil-Wizard).
  const createAccount = (method: AuthMethod) => { setAccountMethod(method); advance('nickname'); };
  const createLoginCode = () => { setAccountMethod('anmeldeCode'); setCreatedCode(genLoginCode()); advance('codeShow'); };

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

  const copyCode = () => {
    navigator.clipboard?.writeText(createdCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const saveCode = () => {
    const blob = new Blob([`SoStudy Login-Code: ${createdCode}\nBewahre diesen Code sicher auf.`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sostudy-login-code.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  // Abschluss: Mock-Session anlegen → Haupt-App (Schüler-Home). Extras lokal sichern.
  const finalize = () => {
    if (finalizing) return;
    setFinalizing(true);
    const emailPath = accountMethod === 'email';
    try {
      if (companionName.trim()) localStorage.setItem('sostudy_companion_name', companionName.trim());
    } catch { /* prototype */ }
    identityService.registerStudent({
      role: 'student',
      display_name: username.trim(), // Nickname wird jetzt für beide Pfade gesetzt
      bundesland,
      schoolType: schoolForm,
      grade: grade ? grade.replace(/\D/g, '') : undefined,
      kiConsentAccepted: false,
      authMethod: accountMethod ?? 'anmeldeCode',
      email: emailPath ? email.trim() : undefined,
      ageBracket: '16plus',
      anonymous: false,
      username: codePath ? username.trim() : undefined,
    }).then(goToApp);
  };

  // Login (bestehend)
  const doCodeLogin = async () => {
    if (!loginCode.trim() || busy) return;
    setError(''); setBusy('anmeldeCode');
    const identity = await identityService.loginWithAnmeldeCode(loginCode.trim());
    setBusy(null);
    if (identity) goToApp();
    else setError('Ungültiger Login-Code.');
  };
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

  // ===== Validierung (rein Frontend) =====
  const accountValid = email.includes('@') && email.trim().length >= 5 && password.trim().length >= 6;
  const parentEmailValid = fullName.trim().length >= 2 && email.includes('@') && password.trim().length >= 6;
  const nicknameValid = username.trim().length >= 2;

  // ===== Screens =====
  // SCREEN 1 — Willkommen / Wer bist du?
  const renderRole = () => (
    <>
      <img src={welcomeHero} alt="" draggable={false} className="w-full select-none" />
      <h1 className="text-center font-['Poppins:Bold',sans-serif] text-[30px] leading-[1.15] text-white -mt-1">
        Willkommen bei
      </h1>
      <div className="flex justify-center mt-2">
        <SoStudyLogo className="h-9" />
      </div>

      <div className="flex-1" />

      <h2 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white mb-3">Wer bist du?</h2>
      <div className="grid grid-cols-2 gap-3 items-stretch">
        <RoleCard accent icon={<GraduationCap size={30} color={BRAND.primaryLight} strokeWidth={1.8} />}
          title="Ich bin Schüler:in" subtitle="Lerne, erstelle und organisiere deine Materialien." onClick={() => pickRole('student')} />
        <RoleCard icon={<PeopleRounded style={{ fontSize: 32, color: 'rgba(255,255,255,0.82)' }} />}
          title="Ich bin Elternteil" subtitle="Unterstütze dein Kind und behalte den Überblick." onClick={() => pickRole('parent')} />
      </div>

      <div className="flex-1" />

      {/* Hinweisblock (AGB) */}
      <div className="space-y-2.5">
        <InfoPill icon={<ShieldCheck size={18} color={BRAND.primaryLight} strokeWidth={2} />}>
          <AgbText />
        </InfoPill>
      </div>

      <div className="pt-5 text-center">
        <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45">Bereits ein Konto?</p>
        <button type="button" onClick={switchToLogin}
          className="inline-flex items-center gap-1 mt-1 font-['Poppins:SemiBold',sans-serif] text-[15px] active:opacity-70 transition-opacity" style={{ color: BRAND.primaryLight }}>
          Anmelden <ArrowRight size={16} strokeWidth={2.4} />
        </button>
      </div>
    </>
  );

  // SCREEN 2 — Account erstellen (Toggle: Mit Account | Mit Login-Code)
  // SCREEN — Methoden-Auswahl (nach „Ich bin Schüler:in"): Account vs. Login-Code.
  const renderMethod = () => (
    <>
      <TopBar onBack={goBack} progress={progressFor('method')} />
      <img src={welcomeHero} alt="" draggable={false} className="w-full select-none" />
      <h1 className="text-center font-['Poppins:Bold',sans-serif] text-[26px] leading-[1.15] text-white -mt-1">
        Wie möchtest <span style={{ color: BRAND.primaryLight }}>du starten?</span>
      </h1>
      <p className="text-center font-['Poppins:Regular',sans-serif] text-[14px] leading-[1.5] text-white/50 mt-2 px-4">
        Wähle die Option, die am besten zu dir passt.
      </p>
      <div className="flex flex-col gap-3 mt-6">
        <MethodCard accent
          icon={<PersonRounded style={{ fontSize: 26, color: BRAND.primaryLight }} />}
          title="Mit Account fortfahren"
          subtitle="Nutze Apple, Google oder E-Mail. Konto kann wiederhergestellt werden."
          onClick={() => advance('signup')} />
        <MethodCard
          icon={<ShieldCheck size={24} color="rgba(255,255,255,0.82)" strokeWidth={2} />}
          title="Mit Login-Code starten"
          subtitle="Ohne E-Mail, ohne Telefonnummer und ohne echten Namen. Du erhältst einen Code für deinen Zugang."
          onClick={() => advance('loginCodeChoice')} />
      </div>
    </>
  );

  const renderSignup = () => (
    <>
      <TopBar onBack={goBack} progress={progressFor('signup')} />
      <div className="flex flex-col items-center text-center gap-3 mb-6 mt-2">
        <h1 className="font-['Poppins:Bold',sans-serif] text-[26px] leading-[1.15] text-white">
          Account <span style={{ color: BRAND.primaryLight }}>erstellen</span>
        </h1>
        <p className="font-['Poppins:Regular',sans-serif] text-[14px] leading-[1.5] text-white/50 px-4">
          Erstelle dein Konto und starte dein Lernabenteuer mit SoStudy.
        </p>
      </div>

      <div className="space-y-3">
        <AppleBtn onClick={() => createAccount('apple')} label="Mit Apple fortfahren" />
        <GoogleBtn onClick={() => createAccount('google')} />
        <Or label="oder mit E-Mail" />
        <Field type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail" autoCapitalize="none" autoCorrect="off" />
        <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort (mind. 6 Zeichen)" />
        <PrimaryBtn onClick={() => createAccount('email')} disabled={!accountValid}>
          Account erstellen <ArrowRight size={18} strokeWidth={2.4} />
        </PrimaryBtn>
      </div>

      <div className="mt-auto pt-6 text-center">
        <button type="button" onClick={switchToLogin}
          className="inline-flex items-center gap-1 font-['Poppins:Medium',sans-serif] text-[14px] text-white/55 active:text-white/85">
          Bereits ein Konto? Anmelden <ArrowRight size={14} strokeWidth={2.2} />
        </button>
      </div>
    </>
  );

  // SCREEN — Login-Code verwenden (Auswahl: neu erstellen / vorhandenen nutzen)
  const renderLoginCodeChoice = () => (
    <>
      <TopBar onBack={goBack} />
      <div className="flex flex-col items-center text-center gap-3 mb-6 mt-2">
        <h1 className="font-['Poppins:Bold',sans-serif] text-[26px] leading-[1.15] text-white">
          Login-Code <span style={{ color: BRAND.primaryLight }}>verwenden</span>
        </h1>
        <p className="font-['Poppins:Regular',sans-serif] text-[14px] leading-[1.5] text-white/50 px-4">
          Hast du schon einen Code oder brauchst du einen neuen?
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <MethodCard accent
          icon={<KeyRound size={24} color={BRAND.primaryLight} strokeWidth={2} />}
          title="Neuen Code erstellen"
          subtitle="Starte ohne E-Mail und erhalte deinen persönlichen Zugangscode."
          onClick={createLoginCode} />
        <MethodCard
          icon={<LogIn size={24} color="rgba(255,255,255,0.82)" strokeWidth={2} />}
          title="Ich habe bereits einen Code"
          subtitle="Melde dich mit deinem vorhandenen Code an."
          onClick={() => advance('codeEntry')} />
      </div>
    </>
  );

  // SCREEN — Login-Code eingeben (vorhandenen Code zum Einloggen nutzen)
  const renderCodeEntry = () => (
    <>
      <TopBar onBack={goBack} />
      <div className="flex flex-col items-center text-center gap-3 mb-6 mt-2">
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'radial-gradient(circle at 50% 45%, rgba(0,184,148,0.22), transparent 70%)', border: '1px solid rgba(0,184,148,0.40)' }}>
          <KeyRound size={28} color={BRAND.primaryLight} strokeWidth={2} />
        </div>
        <h1 className="font-['Poppins:Bold',sans-serif] text-[24px] leading-[1.2] text-white">Login-Code eingeben</h1>
        <p className="font-['Poppins:Regular',sans-serif] text-[14px] leading-[1.5] text-white/50 px-4">
          Gib deinen Zugangscode ein, um dich anzumelden.
        </p>
      </div>
      <div className="space-y-3">
        <Field value={loginCode} onChange={(e) => setLoginCode(e.target.value.toUpperCase())} placeholder="z. B. SOST-7K4P-92MX" autoCapitalize="characters" autoCorrect="off" style={{ textTransform: 'uppercase', letterSpacing: '0.10em', textAlign: 'center' }} />
        <PrimaryBtn onClick={doCodeLogin} loading={busy === 'anmeldeCode'} disabled={!loginCode.trim()}>Mit Code anmelden</PrimaryBtn>
        {error && <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-red-300 px-1">{error}</p>}
      </div>
      <div className="mt-auto pt-6 text-center">
        <button type="button" onClick={createLoginCode}
          className="font-['Poppins:Medium',sans-serif] text-[14px] active:opacity-70 transition-opacity" style={{ color: BRAND.primaryLight }}>
          Noch keinen Code? Neuen Code erstellen
        </button>
      </div>
    </>
  );

  // SCREEN 3 — Login-Code anzeigen
  const renderCodeShow = () => (
    <>
      <TopBar onBack={goBack} progress={progressFor('codeShow')} />
      <div className="flex flex-col items-center text-center gap-3 mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ border: `2.5px solid ${BRAND.primary}` }}>
          <Check size={30} color={BRAND.primaryLight} strokeWidth={3} />
        </div>
        <h1 className="font-['Poppins:Bold',sans-serif] text-[24px] leading-[1.2] text-white">Dein Login-Code</h1>
        <p className="font-['Poppins:Regular',sans-serif] text-[14px] leading-[1.5] text-white/50 px-4">
          Speichere diesen Code sicher. Du brauchst ihn, um dich später wieder einzuloggen.
        </p>
      </div>
      <CodeBox code={createdCode} />
      <div className="grid grid-cols-2 gap-2.5 mt-4">
        <GlassBtn onClick={copyCode} icon={<Copy size={20} color={BRAND.primaryLight} />}>{copied ? 'Kopiert!' : 'Code kopieren'}</GlassBtn>
        <GlassBtn onClick={saveCode} icon={<Download size={20} color={BRAND.primaryLight} />}>Code speichern</GlassBtn>
      </div>
      <div className="mt-4">
        <InfoPill icon={<ShieldCheck size={18} color={BRAND.primaryLight} strokeWidth={2} />}>
          Aus Datenschutzgründen nutzen wir keine E-Mail zur Wiederherstellung. Wenn du den Code verlierst, kann dein Zugang möglicherweise nicht wiederhergestellt werden.
        </InfoPill>
      </div>
      <div className="mt-auto pt-6">
        <PrimaryBtn onClick={() => advance('nickname')}>Ich habe den Code gespeichert <ArrowRight size={18} strokeWidth={2.4} /></PrimaryBtn>
      </div>
    </>
  );

  // SCREEN — Nickname (eigener Schritt, beide Pfade; KEIN Auto-Advance)
  const renderNickname = () => (
    <>
      <TopBar onBack={goBack} progress={progressFor('nickname')} />
      <div className="text-center mb-6 mt-2">
        <h1 className="font-['Poppins:Bold',sans-serif] text-[24px] leading-[1.2] text-white px-3">Wie sollen wir dich nennen?</h1>
      </div>
      <div>
        <label className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 px-1">Nickname</label>
        <div className="mt-1.5">
          <Field value={username} onChange={(e) => setUsername(e.target.value.slice(0, 20))} placeholder="z. B. MatheTiger" autoCapitalize="none" autoCorrect="off" maxLength={20} />
        </div>
        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 px-1 mt-2 leading-[1.5]">
          Wähle einen Namen, der dich im Lernen motiviert.
        </p>
      </div>
      <div className="mt-auto pt-6">
        <PrimaryBtn onClick={() => advance('bundesland')} disabled={!nicknameValid}>Weiter <ArrowRight size={18} strokeWidth={2.4} /></PrimaryBtn>
      </div>
    </>
  );

  // SCREEN A — Bundesland (Tippkacheln, Auto-Advance)
  const renderBundesland = () => (
    <>
      <TopBar onBack={goBack} progress={progressFor('bundesland')} />
      <IconHeader title="In welchem Bundesland lernst du?" />
      <RadioList options={BUNDESLAENDER} value={bundesland} onChange={(v) => pickAndAdvance(setBundesland, v, 'schoolForm')} />
    </>
  );

  // SCREEN B — Schulform (Tippkacheln, Auto-Advance)
  const renderSchoolForm = () => (
    <>
      <TopBar onBack={goBack} progress={progressFor('schoolForm')} />
      <IconHeader title="Welche Schulform besuchst du?" />
      <RadioList options={SCHOOL_FORMS} value={schoolForm} onChange={(v) => pickAndAdvance(setSchoolForm, v, 'grade')} />
    </>
  );

  // SCREEN C — Klassenstufe (Tippkacheln, Auto-Advance)
  const renderGrade = () => (
    <>
      <TopBar onBack={goBack} progress={progressFor('grade')} />
      <IconHeader title="In welche Klasse gehst du?" />
      <RadioList options={GRADES} value={grade} onChange={(v) => pickAndAdvance(setGrade, v, 'companion')} />
    </>
  );

  // SCREEN 7 — Lernbegleiter benennen
  const renderCompanion = () => (
    <>
      <TopBar onBack={goBack} progress={progressFor('companion')} />
      <div className="text-center mb-2 mt-2">
        <h1 className="font-['Poppins:Bold',sans-serif] text-[23px] leading-[1.2] text-white px-3">Wie soll dein Lernbegleiter heißen?</h1>
      </div>
      <CompanionStage />
      <div className="mt-3">
        <label className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 px-1">Name deines Lernbegleiters</label>
        <div className="mt-1.5">
          <Field value={companionName} onChange={(e) => setCompanionName(e.target.value.slice(0, 20))} placeholder="z. B. LernBuddy" maxLength={20} />
        </div>
        <div className="flex items-center justify-between gap-3 mt-2 px-1">
          <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 leading-[1.4]">Du kannst den Namen später jederzeit ändern.</span>
          <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 shrink-0">{companionName.length} / 20</span>
        </div>
      </div>
      <div className="mt-auto pt-4 space-y-2">
        <PrimaryBtn onClick={() => advance('done')}>Weiter <ArrowRight size={18} strokeWidth={2.4} /></PrimaryBtn>
        <button type="button" onClick={() => advance('done')}
          className="w-full text-center py-2 font-['Poppins:Medium',sans-serif] text-[14px]" style={{ color: BRAND.primaryLight }}>
          Später festlegen
        </button>
      </div>
    </>
  );

  // SCREEN 8 — Fertig / Start
  const renderDone = () => (
    <>
      <TopBar onBack={goBack} />
      <div className="flex flex-col items-center text-center gap-4 pt-2">
        <PartyPopper size={44} color={BRAND.primaryLight} strokeWidth={1.6} />
        <h1 className="font-['Poppins:Bold',sans-serif] text-[28px] leading-[1.15] text-white">Du bist bereit!</h1>
        <p className="font-['Poppins:Regular',sans-serif] text-[15px] leading-[1.5] text-white/55 px-4">
          Dein Lernabenteuer mit SoStudy kann starten.
        </p>
        <div className="my-4"><MascotAvatar size={200} /></div>
      </div>
      <div className="mt-auto pt-6">
        <PrimaryBtn onClick={finalize} loading={finalizing}>Loslegen <ArrowRight size={18} strokeWidth={2.4} /></PrimaryBtn>
      </div>
    </>
  );

  // ELTERN — Registrierung (Apple/Google oder E-Mail + Demo-SMS-OTP) → Eltern-Dashboard
  const renderParent = () => (
    <>
      <TopBar onBack={goBack} />
      <div className="flex flex-col items-center text-center gap-3 mb-6 mt-2">
        <h1 className="font-['Poppins:Bold',sans-serif] text-[26px] leading-[1.15] text-white">
          Eltern-Account <span style={{ color: BRAND.primaryLight }}>erstellen</span>
        </h1>
        <p className="font-['Poppins:Regular',sans-serif] text-[14px] leading-[1.5] text-white/50 px-2">
          Behalte den Lernweg deines Kindes im Blick, von Fortschritten in der App bis zu Nachhilfeleistungen.
        </p>
      </div>
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

  // LOGIN (bestehend)
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

        {!showCodeLogin ? (
          <button type="button" onClick={() => setShowCodeLogin(true)}
            className="w-full text-center py-2 font-['Poppins:Medium',sans-serif] text-[14px] text-white/55 active:text-white/85">
            Login-Code? Hier eingeben
          </button>
        ) : (
          <Reveal k="codeLogin">
            <Or label="Login-Code" />
            <Field value={loginCode} onChange={(e) => setLoginCode(e.target.value.toUpperCase())} placeholder="z. B. SOST-7K4P-92MX" autoCapitalize="characters" style={{ textTransform: 'uppercase', letterSpacing: '0.10em', textAlign: 'center' }} />
            <div className="h-2.5" />
            <PrimaryBtn onClick={doCodeLogin} loading={busy === 'anmeldeCode'} disabled={!loginCode.trim()}>Mit Code anmelden</PrimaryBtn>
          </Reveal>
        )}
      </div>
      {error && <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-red-300 px-1 mt-3">{error}</p>}
      <div className="pt-3">
        <button type="button" onClick={switchToRegister}
          className="w-full text-center py-2 font-['Poppins:Medium',sans-serif] text-[14px] text-white/55 active:text-white/85">
          Noch kein Konto? Registrieren
        </button>
      </div>
    </>
  );

  // ===== Aktive Etappe =====
  const screenKey = mode === 'login' ? 'login' : `register:${step}`;
  let content: React.ReactNode;
  if (mode === 'login') content = renderLogin();
  else if (step === 'role') content = renderRole();
  else if (step === 'method') content = renderMethod();
  else if (step === 'loginCodeChoice') content = renderLoginCodeChoice();
  else if (step === 'codeEntry') content = renderCodeEntry();
  else if (step === 'signup') content = renderSignup();
  else if (step === 'codeShow') content = renderCodeShow();
  else if (step === 'nickname') content = renderNickname();
  else if (step === 'bundesland') content = renderBundesland();
  else if (step === 'schoolForm') content = renderSchoolForm();
  else if (step === 'grade') content = renderGrade();
  else if (step === 'companion') content = renderCompanion();
  else if (step === 'done') content = renderDone();
  else content = renderParent();

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
