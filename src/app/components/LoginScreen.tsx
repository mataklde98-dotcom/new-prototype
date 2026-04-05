// ===== LOGIN SCREEN =====
// Apple Vision Pro Style Login mit E-Mail & Passwort

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import SoStudyLogo from './SoStudyLogo';
import type { SocialAuthInfo } from './AuthWrapper';

interface LoginScreenProps {
  onLoginSuccess: (userData: any) => void;
  onSwitchToRegister: () => void;
  onSocialAuthNewUser: (info: SocialAuthInfo) => void;
}

const LoginScreen = React.memo(function LoginScreen({ onLoginSuccess, onSwitchToRegister, onSocialAuthNewUser }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    setError('');

    try {
      // Simulate OAuth flow delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      const mockSocialEmail = provider === 'google' 
        ? 'alexander.baum@gmail.com' 
        : 'alexander.baum@icloud.com';
      const mockFirstName = 'Alexander';
      const mockLastName = 'Baum';

      // Check if user already exists (mock check)
      const existingUser = localStorage.getItem('userData');
      if (existingUser) {
        const parsed = JSON.parse(existingUser);
        if (parsed.email === mockSocialEmail || parsed.socialProvider === provider) {
          // Existing user → direct login
          localStorage.setItem('isLoggedIn', 'true');
          onLoginSuccess(parsed);
          return;
        }
      }

      // New user → redirect to register with social info
      onSocialAuthNewUser({
        provider,
        email: mockSocialEmail,
        firstName: mockFirstName,
        lastName: mockLastName,
      });
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
        const mockUsers: Record<string, { email: string; password: string; firstName: string; lastName: string }> = {
          'alexanderbaum@gmail.com': {
            email: 'alexanderbaum@gmail.com',
            password: '12345678',
            firstName: 'Alexander Johannes',
            lastName: 'Baum'
          },
          'newuser@sostudytest.com': {
            email: 'newuser@sostudytest.com',
            password: '12345678',
            firstName: 'Max',
            lastName: 'Mustermann'
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
          userId: `user_${normalizedEmail.split('@')[0]}_mock_123`,
          createdAt: new Date().toISOString()
        };

        // Store user data in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        
        console.log('✅ Mock Login erfolgreich:', mockUser.email);
        onLoginSuccess(userData);
      }
    } catch (err: any) {
      setError(err.message || 'Login fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto flex items-center justify-center px-5 py-10"
      style={{
        background: '#0a0a0a',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <SoStudyLogo className="h-10 mx-auto mb-3" />
          <p className="text-white/60 font-['Poppins:Regular',sans-serif] text-[15px]">
            Anmelden und weiter lernen
          </p>
        </div>

        {/* Login Card */}
        <div 
          className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.03] border border-white/[0.10] rounded-3xl p-6 mb-4"
        >
          {/* Error Message */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200 text-sm font-['Poppins:Regular',sans-serif]">
                {error}
              </span>
            </div>
          )}

          {/* E-Mail Input */}
          <div className="mb-4">
            <label className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2">
              E-Mail
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alexanderbaum@gmail.com"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white font-['Poppins:Regular',sans-serif] placeholder:text-white/30 outline-none focus:border-white/[0.25] transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2">
              Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-12 py-3.5 text-white font-['Poppins:Regular',sans-serif] placeholder:text-white/30 outline-none focus:border-white/[0.25] transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 active:scale-95 transition-transform"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full font-['Poppins:SemiBold',sans-serif] text-[14px] py-3.5 rounded-xl active:scale-[0.98] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: isLoading
                ? 'rgba(255,255,255,0.04)'
                : 'rgba(0,184,148,0.07)',
              border: isLoading
                ? '1px solid rgba(255,255,255,0.06)'
                : '1px solid rgba(0,184,148,0.25)',
              color: isLoading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.9)',
            }}
          >
            {isLoading ? 'Wird geladen...' : 'Anmelden'}
          </button>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <span className="text-white/60 font-['Poppins:Regular',sans-serif] text-sm">
            Noch kein Konto?{' '}
          </span>
          <button
            onClick={onSwitchToRegister}
            className="text-white font-['Poppins:SemiBold',sans-serif] text-sm active:opacity-70 transition-opacity"
          >
            Jetzt registrieren
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 uppercase tracking-widest">
            oder
          </span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Social Login */}
        <div className="flex gap-3">
          <button
            onClick={() => handleSocialAuth('google')}
            disabled={socialLoading !== null}
            className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] active:scale-[0.97] active:bg-white/[0.07] transition-all duration-150 disabled:opacity-50 disabled:active:scale-100"
          >
            {socialLoading === 'google' ? (
              <div className="w-[18px] h-[18px] border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            )}
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/60">
              {socialLoading === 'google' ? 'Verbinden...' : 'Google'}
            </span>
          </button>
          <button
            onClick={() => handleSocialAuth('apple')}
            disabled={socialLoading !== null}
            className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] active:scale-[0.97] active:bg-white/[0.07] transition-all duration-150 disabled:opacity-50 disabled:active:scale-100"
          >
            {socialLoading === 'apple' ? (
              <div className="w-[16px] h-[16px] border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            ) : (
              <svg width="16" height="18" viewBox="0 0 16 20" fill="white" style={{ overflow: 'visible' }}>
                <path d="M13.04 10.58c-.03-2.78 2.27-4.12 2.37-4.18-1.29-1.89-3.3-2.15-4.02-2.18-1.71-.17-3.34 1.01-4.21 1.01-.87 0-2.22-.98-3.65-.96-1.88.03-3.61 1.09-4.58 2.78-1.95 3.39-.5 8.41 1.4 11.16.93 1.35 2.04 2.86 3.5 2.81 1.4-.06 1.93-.91 3.63-.91 1.7 0 2.18.91 3.67.88 1.51-.03 2.48-1.37 3.4-2.72 1.07-1.56 1.51-3.07 1.54-3.15-.03-.01-2.95-1.13-2.98-4.5zM10.23 2.54c.77-.94 1.29-2.24 1.15-3.54-1.11.05-2.45.74-3.25 1.67-.72.83-1.34 2.16-1.18 3.43 1.24.1 2.5-.63 3.28-1.56z"/>
              </svg>
            )}
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/60">
              {socialLoading === 'apple' ? 'Verbinden...' : 'Apple'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default LoginScreen;