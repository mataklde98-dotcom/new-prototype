// ===== REGISTER SCREEN =====
// Simplified 2-Step Registration Flow:
//   Step 1: User Type Selection (Student / Parent)
//   Step 2: Registration Form
//
// Tutoring type selection has been removed from registration.
// It will be handled post-login via "Activate Tutoring" in the student profile.
//
// AuthWrapper.tsx and LoginScreen.tsx are NOT modified.

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  User, Mail, Lock, Eye, EyeOff, AlertCircle,
  MapPin, GraduationCap, BookOpen, ChevronDown,
  ArrowLeft, Users, Info, ShieldCheck, CheckCircle,
} from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import SoStudyLogo from './SoStudyLogo';
import type { SocialAuthInfo } from './AuthWrapper';

// ===== TYPES =====
type RegistrationStep = 'userType' | 'registerForm' | 'otp';
type UserType = 'student' | 'parent';

// ===== PROPS (unchanged) =====
interface RegisterScreenProps {
  onRegisterSuccess: (userData: any) => void;
  onSwitchToLogin: () => void;
  socialAuth?: SocialAuthInfo | null;
}

// ===== CONSTANTS =====
const BUNDESLAENDER = [
  'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
  'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
  'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
  'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen',
];

const SCHOOL_TYPES = [
  'Grundschule', 'Hauptschule', 'Realschule',
  'Gymnasium', 'Gesamtschule', 'Berufsschule',
];

const GRADES = ['1','2','3','4','5','6','7','8','9','10','11','12','13'];

// ===== REUSABLE SUB-COMPONENTS =====

/** Progress bar showing current step */
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex items-center gap-2 justify-center mb-8">
    {Array.from({ length: totalSteps }, (_, i) => {
      const stepNum = i + 1;
      const isActive = stepNum === currentStep;
      const isCompleted = stepNum < currentStep;
      return (
        <div key={stepNum} className="flex items-center gap-2">
          {i > 0 && (
            <div
              className="h-[2px] w-6 sm:w-8 rounded-full transition-all duration-500 ease-out"
              style={{ background: isCompleted ? 'rgba(0,184,148,0.5)' : 'rgba(0,184,148,0.1)' }}
            />
          )}
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: 32,
              height: 32,
              transition: 'transform 0.45s cubic-bezier(0.25, 0.1, 0.25, 1), background-color 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease',
              backgroundColor: isCompleted
                ? 'rgba(0,184,148,0.2)'
                : isActive
                  ? 'rgba(0,184,148,0.15)'
                  : 'rgba(0,184,148,0.06)',
              border: isCompleted
                ? '1.5px solid rgba(0,184,148,0.5)'
                : isActive
                  ? '1.5px solid rgba(0,184,148,0.45)'
                  : '1px solid rgba(0,184,148,0.2)',
              transform: isActive ? 'scale(1)' : 'scale(0.75)',
            }}
          >
            {/* Checkmark – fades in with scale */}
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{
                position: 'absolute',
                transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: isCompleted ? 1 : 0,
                transform: isCompleted ? 'scale(1)' : 'scale(0.3)',
              }}
            >
              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="rgba(0,184,148,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* Number – fades out */}
            <span
              className="font-['Poppins:SemiBold',sans-serif]"
              style={{
                position: 'absolute',
                transition: 'opacity 0.25s ease, transform 0.25s ease',
                opacity: isCompleted ? 0 : 1,
                transform: isCompleted ? 'scale(0.5)' : 'scale(1)',
                fontSize: isActive ? 13 : 11,
                color: isActive ? 'rgba(0,184,148,0.95)' : 'rgba(0,184,148,0.5)',
              }}
            >
              {stepNum}
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

/** Selection card */
const SelectionCard = ({
  icon,
  title,
  description,
  isSelected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left rounded-2xl p-5 transition-all duration-200 active:scale-[0.98] relative overflow-hidden"
    style={{
      background: isSelected
        ? 'linear-gradient(135deg, rgba(0,184,148,0.12), rgba(0,147,121,0.06))'
        : 'rgba(255,255,255,0.03)',
      border: isSelected
        ? '1.5px solid rgba(0,184,148,0.4)'
        : '1.5px solid rgba(255,255,255,0.08)',
      WebkitTapHighlightColor: 'transparent',
    }}
  >
    {isSelected && (
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(0,184,148,0.25), transparent 70%)',
        }}
      />
    )}
    <div className="relative z-10 flex items-start gap-4">
      <div
        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: isSelected
            ? 'linear-gradient(135deg, #00B894, #009379)'
            : 'rgba(255,255,255,0.06)',
          border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className="font-['Poppins:SemiBold',sans-serif] text-[15px] mb-1"
          style={{ color: isSelected ? 'white' : 'rgba(255,255,255,0.85)' }}
        >
          {title}
        </h3>
        <p
          className="font-['Poppins:Regular',sans-serif] text-[13px] leading-relaxed"
          style={{ color: isSelected ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)' }}
        >
          {description}
        </p>
      </div>
      <div
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
        style={{
          border: isSelected ? '2px solid #00B894' : '2px solid rgba(255,255,255,0.15)',
          background: 'transparent',
        }}
      >
        {isSelected && (
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00B894' }} />
        )}
      </div>
    </div>
  </button>
);

/** CTA button */
const CTAButton = ({
  label,
  onClick,
  disabled = false,
  isLoading = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className="w-full py-3.5 rounded-xl font-['Poppins:SemiBold',sans-serif] text-[14px] transition-all duration-200 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
    style={{
      background: disabled
        ? 'rgba(255,255,255,0.04)'
        : 'rgba(0,184,148,0.07)',
      border: disabled
        ? '1px solid rgba(255,255,255,0.06)'
        : '1px solid rgba(0,184,148,0.25)',
      color: disabled
        ? 'rgba(255,255,255,0.2)'
        : 'rgba(255,255,255,0.9)',
    }}
  >
    {isLoading ? 'Wird geladen...' : label}
  </button>
);

/** Back button */
const BackButton = ({ onClick }: { onClick: () => void }) => (
  <div className="flex justify-start mb-0">
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/[0.06] border border-white/[0.08] active:bg-white/[0.10] transition-colors"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <ArrowLeft className="w-4 h-4 text-white/60" />
    </button>
  </div>
);

/** Step header */
const StepHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="text-center mb-6">
    <h2 className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-white mb-1.5 tracking-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/50 leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

/** Section divider for parent fields */
const SectionDivider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 my-6">
    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
    <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/40 uppercase tracking-wider">
      {label}
    </span>
    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
  </div>
);

// ===== MAIN COMPONENT =====
const RegisterScreen = React.memo(function RegisterScreen({
  onRegisterSuccess,
  onSwitchToLogin,
  socialAuth,
}: RegisterScreenProps) {
  // ── State Machine ──
  const [step, setStep] = useState<RegistrationStep>('userType');
  const [userType, setUserType] = useState<UserType | null>(null);

  // ── Student/Child Form State ──
  const [bundesland, setBundesland] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [grade, setGrade] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ── Parent-only Fields ──
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [showParentPassword, setShowParentPassword] = useState(false);

  // ── Picker UI State ──
  // (removed – using native selects now)

  // ── General UI State ──
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ── OTP State ──
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpWrong, setOtpWrong] = useState(false);
  const otpInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // ── Parent Notice State ──
  const [showParentNotice, setShowParentNotice] = useState(false);

  // ── Derived ──
  const isParentFlow = userType === 'parent';
  const isSocialAuth = !!socialAuth;
  const currentStepNumber = step === 'userType' ? 1 : step === 'registerForm' ? 2 : 3;
  const totalSteps = isSocialAuth ? 2 : 3;

  // Pre-fill social auth data when available
  React.useEffect(() => {
    if (socialAuth) {
      const name = [socialAuth.firstName, socialAuth.lastName].filter(Boolean).join(' ');
      if (name) setFullName(name);
      setEmail(socialAuth.email);
    }
  }, [socialAuth]);

  // ── Navigation ──
  const goNext = () => {
    if (step === 'userType') setStep('registerForm');
  };

  const goBack = () => {
    setError('');
    if (step === 'registerForm') setStep('userType');
    if (step === 'otp') setStep('registerForm');
  };

  // ── OTP helpers ──
  const generateOtp = () => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(code);
    return code;
  };

  const sendOtp = () => {
    const code = generateOtp();
    // Determine target email: parent flow → parentEmail, student flow → student email
    const targetEmail = isParentFlow ? parentEmail : email;
    setOtpEmail(targetEmail);
    setOtpCode('');
    setOtpResendCooldown(30);
    console.log(`📧 OTP Code "${code}" gesendet an: ${targetEmail}`);
  };

  // Resend cooldown timer
  React.useEffect(() => {
    if (otpResendCooldown <= 0) return;
    const timer = setTimeout(() => setOtpResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpResendCooldown]);

  // Auto-focus first OTP input when entering OTP step
  React.useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  // ── Form validation (shared between flows) ──
  const validateForm = (): boolean => {
    setError('');
    const isSocialAuth = !!socialAuth;

    if (isSocialAuth && !isParentFlow) {
      if (!bundesland || !schoolType || !grade || !fullName) {
        setError('Bitte alle Felder ausfüllen');
        return false;
      }
    } else if (!isSocialAuth) {
      if (!bundesland || !schoolType || !grade || !fullName || !email) {
        setError('Bitte alle Felder ausfüllen');
        return false;
      }
      if (!isParentFlow) {
        if (!password) { setError('Bitte alle Felder ausfüllen'); return false; }
        if (password.length < 6) { setError('Passwort muss mindestens 6 Zeichen lang sein'); return false; }
      }
    } else {
      if (!bundesland || !schoolType || !grade || !fullName || !email) {
        setError('Bitte alle Felder ausfüllen');
        return false;
      }
    }

    if (isParentFlow && !isSocialAuth) {
      if (!parentEmail || !parentPassword) { setError('Bitte auch die Eltern-Zugangsdaten ausfüllen'); return false; }
      if (parentPassword.length < 6) { setError('Eltern-Passwort muss mindestens 6 Zeichen lang sein'); return false; }
    }

    return true;
  };

  // ── Handle "Weiter" on register form → go to OTP or register directly ──
  const handleFormSubmit = () => {
    if (!validateForm()) return;

    // Parent flow: show developer notice instead of proceeding
    if (isParentFlow) {
      setShowParentNotice(true);
      return;
    }

    const isSocialAuth = !!socialAuth;
    if (isSocialAuth) {
      // Social auth: skip OTP, register directly
      handleRegister();
    } else {
      // Normal flow: send OTP and go to OTP step
      sendOtp();
      setStep('otp');
    }
  };

  // ── OTP digit input handler ──
  const handleOtpDigit = (index: number, value: string) => {
    if (otpVerified) return;
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const newCode = otpCode.split('');
    newCode[index] = digit;
    const joined = newCode.join('');
    setOtpCode(joined);
    setError('');
    setOtpWrong(false);

    if (digit && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 4 digits entered
    if (digit && index === 3 && joined.length === 4) {
      setTimeout(() => autoVerify(joined), 150);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (otpVerified) return;
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    if (otpVerified) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) {
      setOtpCode(pasted);
      otpInputRefs.current[3]?.focus();
      setTimeout(() => autoVerify(pasted), 150);
    }
  };

  // ── Auto-verify OTP ──
  const autoVerify = (code: string) => {
    if (code !== generatedOtp) {
      setError('Ungültiger Code. Bitte versuche es erneut.');
      setOtpWrong(true);
      // Clear the code after a short shake
      setTimeout(() => {
        setOtpCode('');
        otpInputRefs.current[0]?.focus();
      }, 800);
      return;
    }
    // OTP correct → show verified badge, then register
    setOtpVerified(true);
    setError('');
    setTimeout(() => {
      handleRegister();
    }, 1800);
  };

  // ── Verify OTP and complete registration (kept as fallback) ──
  const handleVerifyOtp = () => {
    if (otpCode.length !== 4) {
      setError('Bitte den vollständigen Code eingeben');
      return;
    }
    if (otpCode !== generatedOtp) {
      setError('Ungültiger Code. Bitte versuche es erneut.');
      setOtpWrong(true);
      return;
    }
    // OTP correct → complete registration
    handleRegister();
  };

  // ── Register handler (actual API/mock call) ──
  const handleRegister = async () => {
    setError('');

    // Validate student/child fields
    const isSocialAuth = !!socialAuth;
    if (isSocialAuth && !isParentFlow) {
      // Social auth student: no password needed, email is pre-filled
      if (!bundesland || !schoolType || !grade || !fullName) {
        setError('Bitte alle Felder ausfüllen');
        return;
      }
    } else if (!isSocialAuth) {
      // Normal flow
      if (!bundesland || !schoolType || !grade || !fullName || !email) {
        setError('Bitte alle Felder ausfüllen');
        return;
      }

      // Student self-registration: password required
      if (!isParentFlow) {
        if (!password) {
          setError('Bitte alle Felder ausfüllen');
          return;
        }
        if (password.length < 6) {
          setError('Passwort muss mindestens 6 Zeichen lang sein');
          return;
        }
      }
    } else {
      // Social auth parent: validate child fields
      if (!bundesland || !schoolType || !grade || !fullName || !email) {
        setError('Bitte alle Felder ausfüllen');
        return;
      }
    }

    // Parent flow (non-social): validate parent credentials
    if (isParentFlow && !isSocialAuth) {
      if (!parentEmail || !parentPassword) {
        setError('Bitte auch die Eltern-Zugangsdaten ausfüllen');
        return;
      }
      if (parentPassword.length < 6) {
        setError('Eltern-Passwort muss mindestens 6 Zeichen lang sein');
        return;
      }
    }

    setIsLoading(true);

    try {
      const hasRealCredentials =
        projectId !== 'YOUR_PROJECT_ID_HERE' && publicAnonKey !== 'YOUR_ANON_KEY_HERE';

      if (hasRealCredentials) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-5cb2ed3a/auth/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              bundesland,
              schoolType,
              grade,
              fullName,
              email,
              // Student password only sent for self-registration
              ...(!isParentFlow && { password }),
              userType,
              // Parent flow: student account is passwordless, invitation sent
              ...(isParentFlow && {
                studentPasswordless: true,
                sendStudentInvitation: true,
                parentEmail,
                parentPassword,
              }),
            }),
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registrierung fehlgeschlagen');

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('isNewRegistration', 'true');
        onRegisterSuccess(data.user);
      } else {
        // Mock Registration
        const studentData = {
          email: email.toLowerCase().trim(),
          fullName,
          bundesland,
          schoolType,
          grade,
          userType,
          userId: `user_${email.split('@')[0]}_mock_${Date.now()}`,
          createdAt: new Date().toISOString(),
          ...(isSocialAuth && {
            socialProvider: socialAuth!.provider,
            authMethod: 'social',
          }),
          ...(isParentFlow && !isSocialAuth && {
            passwordless: true,
            invitationSent: true,
            parentId: `parent_${parentEmail.split('@')[0]}_mock_${Date.now()}`,
            parentEmail: parentEmail.toLowerCase().trim(),
          }),
          ...(isParentFlow && isSocialAuth && {
            socialProvider: socialAuth!.provider,
            authMethod: 'social',
            parentEmail: socialAuth!.email,
          }),
        };

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(studentData));
        localStorage.setItem('isNewRegistration', 'true');
        console.log('✅ Mock Registrierung erfolgreich:', studentData.email);
        onRegisterSuccess(studentData);
      }
    } catch (err: any) {
      setError(err.message || 'Registrierung fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  // ===================================================================
  // RENDER: STEP 1 – User Type Selection
  // ===================================================================
  const renderUserTypeStep = () => (
    <>
      <StepHeader
        title="Wer wird registriert?"
        subtitle="Wähle aus, für wen dieses Konto erstellt wird."
      />

      <div className="space-y-3 mb-6">
        <SelectionCard
          icon={<GraduationCap className="w-6 h-6 text-white" />}
          title="Ich bin Schüler:in"
          description="Erstelle dein eigenes Lernkonto bei SoStudy."
          isSelected={userType === 'student'}
          onClick={() => setUserType('student')}
        />
        <SelectionCard
          icon={<Users className="w-6 h-6 text-white" />}
          title="Ich bin Elternteil"
          description="Registriere dein Kind und verfolge seinen Lernfortschritt."
          isSelected={userType === 'parent'}
          onClick={() => setUserType('parent')}
        />
      </div>

      <CTAButton
        label="Weiter"
        onClick={goNext}
        disabled={!userType}
      />
    </>
  );

  // ===================================================================
  // RENDER: STEP 2 – Registration Form
  // ===================================================================
  const renderRegisterFormStep = () => {
    const isSocialAuth = !!socialAuth;
    const providerLabel = socialAuth?.provider === 'google' ? 'Google' : 'Apple';

    return (
    <>
      <div className="mb-6">
        <div className="flex items-center mb-1.5">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-white/50 active:text-white/80 active:bg-white/[0.06] transition-colors"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <h2 className="flex-1 text-center font-['Poppins:SemiBold',sans-serif] text-[22px] text-white tracking-tight pr-9">
            Konto erstellen
          </h2>
        </div>
        <p className="text-center font-['Poppins:Regular',sans-serif] text-[14px] text-white/50 leading-relaxed">
          {isParentFlow
            ? 'Erstelle ein Schülerkonto für dein Kind.'
            : 'Bitte vervollständige deine Daten.'}
        </p>
      </div>

      {/* Social Auth Badge */}
      {/* removed – social auth info now shown inline below email field */}

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="text-red-200 text-sm font-['Poppins:Regular',sans-serif]">{error}</span>
        </div>
      )}

      {/* ── Student / Child Section Label (parent flow only) ── */}
      {isParentFlow && (
        <SectionDivider label="Schüler-Daten" />
      )}

      {/* Bundesland */}
      <div className="mb-4">
        <label className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2">
          Bundesland
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
          <select
            value={bundesland}
            onChange={(e) => setBundesland(e.target.value)}
            className={`w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-12 py-3.5 font-['Poppins:Regular',sans-serif] outline-none focus:border-white/[0.25] transition-colors ${bundesland ? 'text-white' : 'text-white/30'}`}
          >
            <option value="">Bundesland auswählen</option>
            {BUNDESLAENDER.map((land) => (
              <option key={land} value={land}>
                {land}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* School Type */}
      <div className="mb-4">
        <label className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2">Schultyp</label>
        <div className="relative">
          <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
          <select
            value={schoolType}
            onChange={(e) => setSchoolType(e.target.value)}
            className={`w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-12 py-3.5 font-['Poppins:Regular',sans-serif] outline-none focus:border-white/[0.25] transition-colors ${schoolType ? 'text-white' : 'text-white/30'}`}
          >
            <option value="">Schultyp auswählen</option>
            {SCHOOL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade */}
      <div className="mb-4">
        <label className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2">Klasse</label>
        <div className="relative">
          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className={`w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-12 py-3.5 font-['Poppins:Regular',sans-serif] outline-none focus:border-white/[0.25] transition-colors ${grade ? 'text-white' : 'text-white/30'}`}
          >
            <option value="">Klasse auswählen</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}. Klasse
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Full Name */}
      <div className="mb-4">
        <label className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2">
          {isParentFlow ? 'Vor- und Nachname des Kindes' : 'Vor- und Nachname'}
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={isParentFlow ? 'z.B. Max Mustermann' : 'Alexander Baum'}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white font-['Poppins:Regular',sans-serif] placeholder:text-white/30 outline-none focus:border-white/[0.25] transition-colors"
          />
        </div>
      </div>

      {/* Email */}
      {isSocialAuth && !isParentFlow ? (
        /* Social Auth Student: show compact badge like "Dein Eltern-Konto" */
        <div
          className="flex items-center gap-2.5 mb-6 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(0,184,148,0.06)', border: '1px solid rgba(0,184,148,0.15)' }}
        >
          {socialAuth!.provider === 'google' ? (
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
          ) : (
            <svg width="12" height="14" viewBox="0 0 16 20" fill="white" className="flex-shrink-0" style={{ overflow: 'visible' }}>
              <path d="M13.04 10.58c-.03-2.78 2.27-4.12 2.37-4.18-1.29-1.89-3.3-2.15-4.02-2.18-1.71-.17-3.34 1.01-4.21 1.01-.87 0-2.22-.98-3.65-.96-1.88.03-3.61 1.09-4.58 2.78-1.95 3.39-.5 8.41 1.4 11.16.93 1.35 2.04 2.86 3.5 2.81 1.4-.06 1.93-.91 3.63-.91 1.7 0 2.18.91 3.67.88 1.51-.03 2.48-1.37 3.4-2.72 1.07-1.56 1.51-3.07 1.54-3.15-.03-.01-2.95-1.13-2.98-4.5zM10.23 2.54c.77-.94 1.29-2.24 1.15-3.54-1.11.05-2.45.74-3.25 1.67-.72.83-1.34 2.16-1.18 3.43 1.24.1 2.5-.63 3.28-1.56z"/>
            </svg>
          )}
          <div className="flex-1 min-w-0">
            <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/40 block">
              Dein Konto
            </span>
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 block truncate">
              {socialAuth!.email}
            </span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,184,148,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2">
            {isParentFlow && !isSocialAuth ? 'E-Mail des Kindes' : 'E-Mail'}
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isParentFlow ? 'kind@beispiel.de' : 'alexanderbaum@gmail.com'}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white font-['Poppins:Regular',sans-serif] placeholder:text-white/30 outline-none focus:border-white/[0.25] transition-colors"
            />
          </div>
          {isParentFlow && !isSocialAuth && (
            <p className="mt-1.5 font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
              An diese Adresse wird eine Einladung zum Erstellen des Passworts gesendet.
            </p>
          )}
        </div>
      )}

      {/* Password (Student) – hidden in parent flow AND social auth */}
      {!isParentFlow && !isSocialAuth && (
        <div className="mb-6">
          <label className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2">
            Passwort
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-12 py-3.5 text-white font-['Poppins:Regular',sans-serif] placeholder:text-white/30 outline-none focus:border-white/[0.25] transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 active:scale-95 transition-transform"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Invitation info – parent flow only */}
      {isParentFlow && (
        <div
          className="flex items-start gap-2.5 mb-2 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(0,184,148,0.06)', border: '1px solid rgba(0,184,148,0.15)' }}
        >
          <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(0,184,148,0.8)' }} />
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] leading-relaxed" style={{ color: 'rgba(0,184,148,0.7)' }}>
            Dein Kind erhält nach der Registrierung eine E-Mail-Einladung mit einem sicheren Link, um ein eigenes Passwort zu erstellen und sich anzumelden.
          </p>
        </div>
      )}

      {/* ── Parent Section ── */}
      {isParentFlow && !isSocialAuth && (
        <>
          <SectionDivider label="Eltern-Konto" />

          {/* Parent info hint */}
          <div
            className="flex items-start gap-2.5 mb-4 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(0,184,148,0.06)', border: '1px solid rgba(0,184,148,0.15)' }}
          >
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(0,184,148,0.8)' }} />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] leading-relaxed" style={{ color: 'rgba(0,184,148,0.7)' }}>
              Mit deinem Eltern-Konto kannst du den Lernfortschritt deines Kindes verfolgen.
            </p>
          </div>

          {/* Parent Name */}
          <div className="mb-4">
            <label className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2">
              Vor- und Nachname
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Vor- und Nachname"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white font-['Poppins:Regular',sans-serif] placeholder:text-white/30 outline-none focus:border-white/[0.25] transition-colors"
              />
            </div>
          </div>

          {/* Parent Email */}
          <div className="mb-4">
            <label className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2">
              Eltern E-Mail
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="eltern@beispiel.de"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white font-['Poppins:Regular',sans-serif] placeholder:text-white/30 outline-none focus:border-white/[0.25] transition-colors"
              />
            </div>
          </div>

          {/* Parent Password */}
          <div className="mb-6">
            <label className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2">
              Eltern Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type={showParentPassword ? 'text' : 'password'}
                value={parentPassword}
                onChange={(e) => setParentPassword(e.target.value)}
                placeholder="Mindestens 6 Zeichen"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-12 py-3.5 text-white font-['Poppins:Regular',sans-serif] placeholder:text-white/30 outline-none focus:border-white/[0.25] transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              />
              <button
                onClick={() => setShowParentPassword(!showParentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 active:scale-95 transition-transform"
              >
                {showParentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Parent Social Auth: show fixed parent email */}
      {isParentFlow && isSocialAuth && (
        <>
          <SectionDivider label="Eltern-Konto" />

          {/* Parent info hint */}
          <div
            className="flex items-start gap-2.5 mb-4 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(0,184,148,0.06)', border: '1px solid rgba(0,184,148,0.15)' }}
          >
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(0,184,148,0.8)' }} />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] leading-relaxed" style={{ color: 'rgba(0,184,148,0.7)' }}>
              Mit deinem Eltern-Konto kannst du den Lernfortschritt deines Kindes verfolgen.
            </p>
          </div>

          {/* Parent Name (Social Auth) */}
          <div className="mb-4">
            <label className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2">
              Vor- und Nachname
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Vor- und Nachname"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-12 py-3.5 text-white font-['Poppins:Regular',sans-serif] placeholder:text-white/30 outline-none focus:border-white/[0.25] transition-colors"
              />
            </div>
          </div>

          <div
            className="flex items-center gap-2.5 mb-6 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(0,184,148,0.06)', border: '1px solid rgba(0,184,148,0.15)' }}
          >
            {socialAuth!.provider === 'google' ? (
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            ) : (
              <svg width="12" height="14" viewBox="0 0 16 20" fill="white" className="flex-shrink-0" style={{ overflow: 'visible' }}>
                <path d="M13.04 10.58c-.03-2.78 2.27-4.12 2.37-4.18-1.29-1.89-3.3-2.15-4.02-2.18-1.71-.17-3.34 1.01-4.21 1.01-.87 0-2.22-.98-3.65-.96-1.88.03-3.61 1.09-4.58 2.78-1.95 3.39-.5 8.41 1.4 11.16.93 1.35 2.04 2.86 3.5 2.81 1.4-.06 1.93-.91 3.63-.91 1.7 0 2.18.91 3.67.88 1.51-.03 2.48-1.37 3.4-2.72 1.07-1.56 1.51-3.07 1.54-3.15-.03-.01-2.95-1.13-2.98-4.5zM10.23 2.54c.77-.94 1.29-2.24 1.15-3.54-1.11.05-2.45.74-3.25 1.67-.72.83-1.34 2.16-1.18 3.43 1.24.1 2.5-.63 3.28-1.56z"/>
              </svg>
            )}
            <div className="flex-1 min-w-0">
              <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/40 block">
                Dein Eltern-Konto
              </span>
              <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 block truncate">
                {socialAuth!.email}
              </span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,184,148,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
        </>
      )}

      <CTAButton
        label="Konto erstellen"
        onClick={handleFormSubmit}
        isLoading={isLoading}
      />
    </>
    );
  };

  // ===================================================================
  // RENDER: STEP 3 – OTP Verification
  // ===================================================================
  const renderOtpStep = () => {
    return (
    <>
      <div className="mb-8">
        <div className="flex items-center mb-1.5">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-white/50 active:text-white/80 active:bg-white/[0.06] transition-colors"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <h2 className="flex-1 text-center font-['Poppins:SemiBold',sans-serif] text-[22px] text-white tracking-tight pr-9">
            Code eingeben
          </h2>
        </div>
        <p className="text-center font-['Poppins:Regular',sans-serif] text-[14px] text-white/50 leading-relaxed mt-1">
          Wir haben einen 4-stelligen Code an
        </p>
        <p className="text-center font-['Poppins:Medium',sans-serif] text-[14px] text-white/70">
          {otpEmail}
        </p>
        <p className="text-center font-['Poppins:Regular',sans-serif] text-[14px] text-white/50 leading-relaxed">
          gesendet.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="text-red-200 text-sm font-['Poppins:Regular',sans-serif]">{error}</span>
        </div>
      )}

      {/* Verified Badge */}
      {otpVerified && (
        <div className="flex justify-center mb-6">
          <div
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl"
            style={{
              background: 'rgba(0,184,148,0.1)',
              border: '1px solid rgba(0,184,148,0.25)',
              animation: 'otpVerifiedFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <CheckCircle className="w-[18px] h-[18px]" style={{ color: '#00B894' }} />
            <span className="font-['Poppins:SemiBold',sans-serif] text-[14px]" style={{ color: '#00B894' }}>
              Verifiziert
            </span>
          </div>
        </div>
      )}

      {/* OTP Input Fields */}
      {!otpVerified && (
        <>
          <div
            className="flex justify-center gap-3 mb-6"
            style={{
              animation: otpWrong ? 'otpShake 0.5s ease-in-out' : undefined,
            }}
          >
            {Array.from({ length: 4 }, (_, i) => (
              <input
                key={i}
                ref={(el) => { otpInputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                value={otpCode[i] || ''}
                onChange={(e) => handleOtpDigit(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                onPaste={handleOtpPaste}
                className={`w-14 h-14 text-center text-[22px] font-['Poppins:SemiBold',sans-serif] text-white bg-white/[0.04] rounded-xl outline-none transition-all duration-200 ${
                  otpWrong
                    ? 'border-2'
                    : otpCode[i]
                      ? 'border-2'
                      : 'border border-white/[0.08]'
                }`}
                style={
                  otpWrong
                    ? { borderColor: 'rgba(239,68,68,0.5)' }
                    : otpCode[i]
                      ? { borderColor: 'rgba(0,184,148,0.5)' }
                      : undefined
                }
                maxLength={1}
              />
            ))}
          </div>

          {/* Resend OTP */}
          <div className="text-center mb-6">
            {otpResendCooldown > 0 ? (
              <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/30">
                Erneut senden in {otpResendCooldown}s
              </span>
            ) : (
              <button
                onClick={sendOtp}
                className="font-['Poppins:Medium',sans-serif] text-[13px] active:opacity-70 transition-opacity"
                style={{ color: '#00B894' }}
              >
                Code erneut senden
              </button>
            )}
          </div>

          {/* Dev hint: show OTP in console */}
          <div
            className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-white/20" />
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/20">
              Demo-Modus: Der Code wurde in der Browser-Konsole ausgegeben.
            </p>
          </div>
        </>
      )}

      {/* CSS Keyframes for shake + fade-in */}
      <style>{`
        @keyframes otpShake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes otpVerifiedFadeIn {
          0% { opacity: 0; transform: scale(0.8) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
    );
  };

  // ===================================================================
  // MAIN RENDER
  // ===================================================================
  return (
    <div
      className="fixed inset-0 overflow-y-auto px-5 py-8 scrollbar-hide"
      style={{
        background: '#0a0a0a',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div className="w-full max-w-md mx-auto">
        {/* Logo – consistent on both steps */}
        <div className="text-center mb-2">
          <SoStudyLogo className="h-7 mx-auto mb-1.5" />
          <p className="text-white/60 font-['Poppins:Regular',sans-serif] text-[13px]">
            Jetzt kostenlos registrieren
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStepNumber} totalSteps={totalSteps} />

        {/* Glass Card */}
        <div className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.03] border border-white/[0.10] rounded-3xl p-6 mb-4">
          {step === 'userType' && renderUserTypeStep()}
          {step === 'registerForm' && renderRegisterFormStep()}
          {step === 'otp' && renderOtpStep()}
        </div>

        {/* Login Link */}
        <div className="text-center mb-10">
          <span className="text-white/60 font-['Poppins:Regular',sans-serif] text-sm">
            Bereits ein Konto?{' '}
          </span>
          <button
            onClick={onSwitchToLogin}
            className="text-white font-['Poppins:SemiBold',sans-serif] text-sm active:opacity-70 transition-opacity"
          >
            Jetzt anmelden
          </button>
        </div>
      </div>

      {/* ═══════════ PARENT NOTICE MODAL (Dev Note) ═══════════ */}
      {showParentNotice && ReactDOM.createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center px-5"
          style={{ zIndex: 9999, background: 'rgba(0,0,0,0.80)' }}
          onClick={() => setShowParentNotice(false)}
        >
          <div
            className="relative w-full max-w-[420px] rounded-2xl p-6 sm:p-7"
            style={{
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.08)',
              animation: 'parentNoticeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dev badge */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mb-4"
              style={{ background: 'rgba(255,165,0,0.10)', border: '1px solid rgba(255,165,0,0.20)' }}
            >
              <Info className="w-3.5 h-3.5" style={{ color: '#FFA500' }} />
              <span className="font-['Poppins:SemiBold',sans-serif] text-[11px] uppercase tracking-wider" style={{ color: '#FFA500' }}>
                Entwickler-Notiz
              </span>
            </div>

            <h3
              className="font-['Poppins:SemiBold',sans-serif] text-white mb-3"
              style={{ fontSize: '16px', lineHeight: '1.35' }}
            >
              Prototyp-Ende: Eltern-Flow
            </h3>

            <div className="space-y-3 mb-5">
              <div
                className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full mt-[7px] flex-shrink-0" style={{ background: '#FFA500' }} />
                <p className="font-['Poppins:Regular',sans-serif] text-[12.5px] text-white/50 leading-relaxed">
                  Das Elternteil kommt in das <span className="text-white/70">Dashboard für Eltern</span> rein.
                </p>
              </div>

              <div
                className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full mt-[7px] flex-shrink-0" style={{ background: '#FFA500' }} />
                <p className="font-['Poppins:Regular',sans-serif] text-[12.5px] text-white/50 leading-relaxed">
                  Das Kind erhält zu diesem Zeitpunkt eine <span className="text-white/70">E-Mail, um sich ein Passwort zu setzen</span>, damit es sich als Schüler in der App einloggen kann.
                </p>
              </div>

              <div
                className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full mt-[7px] flex-shrink-0" style={{ background: '#FFA500' }} />
                <p className="font-['Poppins:Regular',sans-serif] text-[12.5px] text-white/50 leading-relaxed">
                  In Zukunft kann das Elternteil in einem <span className="text-white/70">Dashboard alle Leistungen seines Kindes</span> sehen.
                </p>
              </div>
            </div>

            <div
              className="flex items-start gap-2 px-3 py-2.5 rounded-lg mb-5"
              style={{ background: 'rgba(255,165,0,0.06)', border: '1px solid rgba(255,165,0,0.12)' }}
            >
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,165,0,0.5)' }} />
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] leading-relaxed" style={{ color: 'rgba(255,165,0,0.5)' }}>
                Der Prototyp für Eltern endet hier. Diese Notiz dient der Entwicklerin als Referenz für die spätere Implementierung.
              </p>
            </div>

            <button
              onClick={() => setShowParentNotice(false)}
              className="w-full py-[13px] rounded-xl font-['Poppins:SemiBold',sans-serif] text-white/90 cursor-pointer transition-all duration-200 active:scale-[0.98]"
              style={{
                fontSize: '14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              Verstanden
            </button>
          </div>

          <style>{`
            @keyframes parentNoticeIn {
              0% { opacity: 0; transform: scale(0.95) translateY(12px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>,
        document.body
      )}
    </div>
  );
});

export default RegisterScreen;