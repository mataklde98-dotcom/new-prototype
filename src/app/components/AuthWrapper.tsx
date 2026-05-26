// ===== AUTH WRAPPER =====
// Handles Login/Register State and Screens

import React, { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import OnboardingFlow from './onboarding/OnboardingFlow';
import ParentOnboardingFlow from './parent/ParentOnboardingFlow';
import NicknameClaimGate from './onboarding/NicknameClaimGate';
import SchoolDataClaimGate from './onboarding/SchoolDataClaimGate';
import AcceptInviteFlow from './onboarding/AcceptInviteFlow';
import AcceptParentInviteFlow from './onboarding/AcceptParentInviteFlow';
import { clearUserSession } from '@/lib/auth';

// Social Auth info passed between screens
export interface SocialAuthInfo {
  provider: 'google' | 'apple';
  email: string;
  firstName?: string;
  lastName?: string;
}

/** Entfernt den ?invite-Parameter aus der URL (nach Annahme/Abbruch), ohne Reload. */
function clearInviteFromUrl() {
  if (typeof window !== 'undefined' && window.history?.replaceState) {
    window.history.replaceState({}, '', window.location.pathname);
  }
}

interface AuthWrapperProps {
  children: (userData: any, handleLogout: () => void) => React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  // 'onboarding' = neuer Knowunity-Flow (Default-Einstieg). 'parentOnboarding' = Eltern-Pfad (E1–E8).
  // 'register' = alter Formular-Flow (Fallback).
  const [authView, setAuthView] = useState<'login' | 'register' | 'onboarding' | 'parentOnboarding' | 'acceptInvite' | 'acceptParentInvite'>('onboarding');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [socialAuth, setSocialAuth] = useState<SocialAuthInfo | null>(null);
  // Token aus einem ?invite=<token>-Deep-Link (Kind öffnet die E-Mail-Einladung, Weg ①).
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  // Token aus einem ?parentinvite=<token>-Deep-Link (Eltern öffnen die Schüler-Einladung, Pfad 4).
  const [parentInviteToken, setParentInviteToken] = useState<string | null>(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    const parentInvite = params.get('parentinvite');
    const loggedIn = localStorage.getItem('isLoggedIn');
    const storedUserData = localStorage.getItem('userData');

    if (loggedIn === 'true' && storedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUserData));
    } else if (invite) {
      // Kind öffnet eine E-Mail-Einladung (Weg ①) → direkt in den Annehmen-Flow.
      setInviteToken(invite);
      setAuthView('acceptInvite');
    } else if (parentInvite) {
      // Eltern öffnen die Schüler-Einladung (Pfad 4, Änderung 7) → Eltern-Annehmen-Flow.
      setParentInviteToken(parentInvite);
      setAuthView('acceptParentInvite');
    }

    setIsCheckingAuth(false);
  }, []);
  
  // Seed test user on first load (Development Only)
  useEffect(() => {
    const seedTestUser = async () => {
      const hasSeeded = localStorage.getItem('hasSeededTestUser');
      if (!hasSeeded) {
        try {
          const { projectId, publicAnonKey } = await import('/utils/supabase/info');
          // Only attempt seeding if valid credentials are configured
          if (projectId !== 'YOUR_PROJECT_ID_HERE' && publicAnonKey !== 'YOUR_ANON_KEY_HERE') {
            await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5cb2ed3a/auth/seed`, {
              headers: { 'Authorization': `Bearer ${publicAnonKey}` }
            });
            console.log('✅ Test user seeded: alexanderbaum@gmail.com / 12345678');
          }
          localStorage.setItem('hasSeededTestUser', 'true');
        } catch (e) {
          // Silently fail - seeding is optional
          localStorage.setItem('hasSeededTestUser', 'true');
        }
      }
    };
    seedTestUser();
  }, []);
  
  const handleLoginSuccess = (user: any) => {
    setIsLoggedIn(true);
    setUserData(user);
  };
  
  const handleRegisterSuccess = (user: any) => {
    setIsLoggedIn(true);
    setUserData(user);
  };
  
  const handleLogout = () => {
    // Vollständige Session-Bereinigung (inkl. Profilbild/Name/Account/Tutoring) →
    // kein Daten-Leak zwischen Mock-Usern. Lässt sostudy_identities/-families absichtlich stehen.
    clearUserSession();
    setIsLoggedIn(false);
    setUserData(null);
  };
  
  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#0a0a0a' }}
      >
        <div className="text-white font-['Poppins:Regular',sans-serif]">
          Lädt...
        </div>
      </div>
    );
  }
  
  // Show auth screens if not logged in
  if (!isLoggedIn) {
    if (authView === 'acceptInvite' && inviteToken) {
      return (
        <AcceptInviteFlow
          token={inviteToken}
          onComplete={(u) => { clearInviteFromUrl(); handleRegisterSuccess(u); }}
          onInvalid={() => { clearInviteFromUrl(); setInviteToken(null); setAuthView('onboarding'); }}
        />
      );
    }
    if (authView === 'acceptParentInvite' && parentInviteToken) {
      return (
        <AcceptParentInviteFlow
          token={parentInviteToken}
          onComplete={(u) => { clearInviteFromUrl(); handleRegisterSuccess(u); }}
          onInvalid={() => { clearInviteFromUrl(); setParentInviteToken(null); setAuthView('onboarding'); }}
        />
      );
    }
    if (authView === 'onboarding') {
      return (
        <OnboardingFlow
          onComplete={handleRegisterSuccess}
          onSwitchToLogin={() => setAuthView('login')}
          onSwitchToParent={() => setAuthView('parentOnboarding')}
        />
      );
    }
    if (authView === 'parentOnboarding') {
      return (
        <ParentOnboardingFlow
          onComplete={handleRegisterSuccess}
          onBack={() => setAuthView('onboarding')}
        />
      );
    }
    if (authView === 'login') {
      return (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => setAuthView('onboarding')}
          onSocialAuthNewUser={(info: SocialAuthInfo) => {
            setSocialAuth(info);
            setAuthView('register');
          }}
        />
      );
    } else {
      return (
        <RegisterScreen 
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => {
            setSocialAuth(null);
            setAuthView('login');
          }}
          socialAuth={socialAuth}
        />
      );
    }
  }
  
  // Schüler ohne Spitznamen (frisch von Eltern angelegt/eingeladen) vergeben ihn zuerst selbst.
  if (userData?.role === 'student' && !(userData.display_name ?? '').trim()) {
    return <NicknameClaimGate userData={userData} onDone={(u) => setUserData(u)} />;
  }

  // Verknüpftes Kind, dessen Eltern die Schul-Daten übersprungen haben (Änderung 2):
  // beim ERSTEN Login selbst ergänzen (NACH dem Spitznamen). Greift nur bei Kind-Konten,
  // da selbst-registrierte Schüler diese Felder im Onboarding zwingend setzen.
  if (
    userData?.role === 'student' &&
    userData?.familyRole === 'child' &&
    (!(userData.schoolType ?? '').trim() || !(userData.grade ?? '').toString().trim())
  ) {
    return <SchoolDataClaimGate userData={userData} onDone={(u) => setUserData(u)} />;
  }

  // User is logged in - render app with userData
  return <>{children(userData, handleLogout)}</>;
}