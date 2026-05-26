// ===== LOGIN SCREEN =====
// Vollflächiger Look (konsistent zum Onboarding). Methode-zuerst:
// Apple/Google primär (beide Rollen), Anmelde-Code als Box (Schüler:innen),
// E-Mail/Passwort eingeklappt hinter Button (meist Eltern).
// Logik (Mock-Login, Code-Login, Social) unverändert.

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, KeyRound, ChevronDown } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import SoStudyLogo from './SoStudyLogo';
import type { SocialAuthInfo } from './AuthWrapper';
import { identityService } from '@/services/identityService';
import { findIdentityById, getDefaultIdentities } from '@/mocks/identity.mock';
import { BRAND, MascotAvatar, GoogleIcon, AppleIcon } from './onboarding/OnboardingShared';

// Voll ausgestatteter Schüler-Mock — Social-Login (Apple/Google) meldet im Prototyp diesen an.
const MOCK_STUDENT_ID = 'user_alexanderbaum_mock_123';

interface LoginScreenProps {
  onLoginSuccess: (userData: any) => void;
  onSwitchToRegister: () => void;
  onSocialAuthNewUser: (info: SocialAuthInfo) => void;
}

// Welche Sekundär-Methode ist aufgeklappt
type OpenMethod = 'none' | 'email' | 'code';

const LoginScreen = React.memo(function LoginScreen({ onLoginSuccess, onSwitchToRegister, onSocialAuthNewUser }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
  const [openMethod, setOpenMethod] = useState<OpenMethod>('none');
  const [code, setCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);

  const toggle = (m: OpenMethod) => {
    setError('');
    setOpenMethod((prev) => (prev === m ? 'none' : m));
  };

  const handleCodeLogin = async () => {
    setError('');
    const trimmed = code.trim();
    if (!trimmed) {
      setError('Bitte Anmelde-Code eingeben');
      return;
    }
    setCodeLoading(true);
    try {
      const identity = await identityService.loginWithAnmeldeCode(trimmed);
      if (!identity) throw new Error('Ungültiger Anmelde-Code');
      // loginWithAnmeldeCode hat Session + userData bereits gesetzt
      const stored = localStorage.getItem('userData');
      onLoginSuccess(stored ? JSON.parse(stored) : identity);
    } catch (err: any) {
      setError(err.message || 'Anmeldung fehlgeschlagen');
    } finally {
      setCodeLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    setError('');

    try {
      // OAuth-Flow simulieren
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Prototyp: Apple/Google = Schüler-Login → direkt in die App (Home). Es wird der voll
      // ausgestattete Schüler-Mock angemeldet (Eltern nutzen den E-Mail-Login).
      // establishSession schreibt vollständige userData (inkl. Spitzname) → kein Namens-/Daten-Gate.
      const identity = findIdentityById(MOCK_STUDENT_ID) ?? getDefaultIdentities()[MOCK_STUDENT_ID];
      if (!identity) throw new Error('Konto nicht gefunden');
      identityService.establishSession(identity, false);
      const stored = localStorage.getItem('userData');
      onLoginSuccess(stored ? JSON.parse(stored) : identity);
    } catch (err: any) {
      setError(`${provider === 'google' ? 'Google' : 'Apple'} Anmeldung fehlgeschlagen`);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Bitte E-Mail und Passwort eingeben');
      return;
    }

    setIsLoading(true);

    try {
      // Check if real Supabase credentials are configured
      const hasRealCredentials = projectId !== 'YOUR_PROJECT_ID_HERE' && publicAnonKey !== 'YOUR_ANON_KEY_HERE';

      if (hasRealCredentials) {
        // Real Supabase Login
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5cb2ed3a/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Login fehlgeschlagen');
        }

        // Store user data in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(data.user));

        onLoginSuccess(data.user);
      } else {
        // Mock Login (Development Mode)
        // userId = kanonische Mock-ID (konsistent zu src/lib/auth.ts → getCurrentUserId nutzt sie fürs Storage-Scoping)
        // role/familyId mitschreiben, damit App.tsx Eltern korrekt zur ParentDashboard routet.
        type MockLoginUser = {
          email: string; password: string; firstName: string; lastName: string;
          userId: string; role: 'student' | 'parent'; familyId?: string; familyRole?: 'owner' | 'child';
        };
        const mockUsers: Record<string, MockLoginUser> = {
          'alexanderbaum@gmail.com': {
            email: 'alexanderbaum@gmail.com',
            password: '12345678',
            firstName: 'Alexander Johannes',
            lastName: 'Baum',
            userId: 'user_alexanderbaum_mock_123',
            role: 'student',
          },
          'newuser@sostudytest.com': {
            email: 'newuser@sostudytest.com',
            password: '12345678',
            firstName: 'Max',
            lastName: 'Mustermann',
            userId: 'user_newuser_mock_456',
            role: 'student',
          },
          'parent@sostudytest.com': {
            email: 'parent@sostudytest.com',
            password: '12345678',
            firstName: 'Sabine',
            lastName: 'Baum',
            userId: 'user_parent_mock_789',
            role: 'parent',
            familyId: 'fam_mock_001',
            familyRole: 'owner',
          }
        };

        const normalizedEmail = email.toLowerCase().trim();
        const mockUser = mockUsers[normalizedEmail];

        if (!mockUser || mockUser.password !== password) {
          throw new Error('Ungültige E-Mail oder Passwort');
        }

        const userData = {
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          userId: mockUser.userId,
          role: mockUser.role,
          familyId: mockUser.familyId,
          familyRole: mockUser.familyRole,
          createdAt: new Date().toISOString()
        };

        // Store user data in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        // Kanonische Identität (sostudy_identity) ableiten → familyService/Tutoring-Gate funktionieren auch beim E-Mail-Login
        identityService.ensureIdentity();

        console.log('✅ Mock Login erfolgreich:', mockUser.email);
        onLoginSuccess(userData);
      }
    } catch (err: any) {
      setError(err.message || 'Login fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  // ===== UI-Bausteine (lokal) =====
  const inputBase =
    "w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl py-3.5 text-white font-['Poppins:Regular',sans-serif] placeholder:text-white/30 outline-none focus:border-[#009379] transition-colors";

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{
        background: `radial-gradient(120% 80% at 50% 0%, rgba(0,147,121,0.10) 0%, ${BRAND.bg} 55%)`,
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div
        className="min-h-full flex flex-col justify-center px-5"
        style={{
          paddingTop: 'calc(var(--safe-area-inset-top) + 32px)',
          paddingBottom: 'calc(var(--safe-area-inset-bottom) + 24px)',
        }}
      >
        <div className="w-full max-w-[400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-7">
            <SoStudyLogo className="h-9 mb-4" />
            <MascotAvatar size={64} />
            <p className="text-white/60 font-['Poppins:Medium',sans-serif] text-[15px] mt-3">
              Willkommen zurück!
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span className="text-red-200 text-[13px] font-['Poppins:Regular',sans-serif]">{error}</span>
            </div>
          )}

          {/* Apple (primär, beide Rollen) */}
          <button
            onClick={() => handleSocialAuth('apple')}
            disabled={socialLoading !== null}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-white text-black font-['Poppins:SemiBold',sans-serif] text-[16px] active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
          >
            {socialLoading === 'apple' ? (
              <div className="w-[18px] h-[18px] border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
            ) : (
              <AppleIcon />
            )}
            {socialLoading === 'apple' ? 'Verbinden…' : 'Mit Apple fortfahren'}
          </button>

          {/* Google + E-Mail (Sekundär-Reihe) */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button
              onClick={() => handleSocialAuth('google')}
              disabled={socialLoading !== null}
              className="flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.10] text-white/80 font-['Poppins:Medium',sans-serif] text-[14px] active:scale-[0.97] transition-all duration-150 disabled:opacity-50"
            >
              {socialLoading === 'google' ? (
                <div className="w-[18px] h-[18px] border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Google
            </button>
            <button
              onClick={() => toggle('email')}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/[0.05] border text-white/80 font-['Poppins:Medium',sans-serif] text-[14px] active:scale-[0.97] transition-all duration-150"
              style={{ borderColor: openMethod === 'email' ? BRAND.primary : 'rgba(255,255,255,0.10)' }}
            >
              <Mail className="w-4 h-4 text-white/55" />
              E-Mail
              <ChevronDown
                className="w-4 h-4 text-white/40 transition-transform duration-200"
                style={{ transform: openMethod === 'email' ? 'rotate(180deg)' : 'none' }}
              />
            </button>
          </div>

          {/* E-Mail/Passwort-Panel (meist Eltern) */}
          {openMethod === 'email' && (
            <div className="mt-3 space-y-3 animate-[onbBubbleIn_0.25s_ease-out]">
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 px-1">
                Meist für Eltern — mit E-Mail & Passwort anmelden.
              </p>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.de"
                  className={`${inputBase} pl-12 pr-4`}
                  style={{ fontSize: 16 }}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Passwort"
                  className={`${inputBase} px-12`}
                  style={{ fontSize: 16 }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 active:scale-95 transition-transform"
                  aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-['Poppins:SemiBold',sans-serif] text-[16px] text-white active:scale-[0.98] transition-all duration-150 disabled:opacity-40"
                style={{
                  background: isLoading ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${BRAND.primaryLight}, ${BRAND.primary})`,
                  boxShadow: isLoading ? 'none' : '0 8px 24px rgba(0,147,121,0.35)',
                }}
              >
                {isLoading && <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {isLoading ? 'Wird geladen…' : 'Anmelden'}
              </button>
            </div>
          )}

          {/* Anmelde-Code (Box, für Schüler:innen) */}
          <button
            onClick={() => toggle('code')}
            className="w-full flex items-center gap-3 p-4 rounded-2xl mt-3 text-left active:scale-[0.98] transition-all duration-150"
            style={{
              background: openMethod === 'code' ? 'rgba(0,147,121,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${openMethod === 'code' ? BRAND.primary : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(0,147,121,0.16)' }}
            >
              <KeyRound className="w-5 h-5" style={{ color: BRAND.primaryLight }} />
            </div>
            <div className="flex-1">
              <div className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">Anmelde-Code</div>
              <div className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/45">für Schüler:innen</div>
            </div>
            <ChevronDown
              className="w-5 h-5 text-white/40 transition-transform duration-200"
              style={{ transform: openMethod === 'code' ? 'rotate(180deg)' : 'none' }}
            />
          </button>

          {/* Anmelde-Code-Panel */}
          {openMethod === 'code' && (
            <div className="mt-3 space-y-3 animate-[onbBubbleIn_0.25s_ease-out]">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="z.B. ALEX-7K2P"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                className={`${inputBase} px-4 text-center font-['Poppins:SemiBold',sans-serif] tracking-[0.18em] placeholder:tracking-normal`}
                style={{ fontSize: 16 }}
                onKeyDown={(e) => e.key === 'Enter' && handleCodeLogin()}
              />
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 px-1">
                Den Code hast du bei der Registrierung erhalten — er funktioniert auf jedem Gerät.
              </p>
              <button
                onClick={handleCodeLogin}
                disabled={codeLoading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-['Poppins:SemiBold',sans-serif] text-[16px] text-white active:scale-[0.98] transition-all duration-150 disabled:opacity-40"
                style={{
                  background: codeLoading ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${BRAND.primaryLight}, ${BRAND.primary})`,
                  boxShadow: codeLoading ? 'none' : '0 8px 24px rgba(0,147,121,0.35)',
                }}
              >
                {codeLoading && <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {codeLoading ? 'Wird geprüft…' : 'Mit Code anmelden'}
              </button>
            </div>
          )}

          {/* Register-Link */}
          <div className="text-center mt-7">
            <span className="text-white/55 font-['Poppins:Regular',sans-serif] text-[14px]">Noch kein Konto? </span>
            <button
              onClick={onSwitchToRegister}
              className="text-white font-['Poppins:SemiBold',sans-serif] text-[14px] active:opacity-70 transition-opacity"
            >
              Registrieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default LoginScreen;
