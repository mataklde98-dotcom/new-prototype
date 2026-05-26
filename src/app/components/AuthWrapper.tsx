// ===== AUTH WRAPPER =====
// Handles Login/Register State and Screens

import React, { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import OnboardingFlow from './onboarding/OnboardingFlow';

// Social Auth info passed between screens
export interface SocialAuthInfo {
  provider: 'google' | 'apple';
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthWrapperProps {
  children: (userData: any, handleLogout: () => void) => React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  // 'onboarding' = neuer Knowunity-Flow (Default-Einstieg). 'register' = alter Formular-Flow (Fallback).
  const [authView, setAuthView] = useState<'login' | 'register' | 'onboarding'>('onboarding');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [socialAuth, setSocialAuth] = useState<SocialAuthInfo | null>(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const storedUserData = localStorage.getItem('userData');
    
    if (loggedIn === 'true' && storedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUserData));
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
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    // Onboarding v5: neue Session-Keys ebenfalls räumen (sonst Leak zwischen Mock-Usern)
    localStorage.removeItem('sostudy_identity');
    localStorage.removeItem('isNewRegistration');
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
    if (authView === 'onboarding') {
      return (
        <OnboardingFlow
          onComplete={handleRegisterSuccess}
          onSwitchToLogin={() => setAuthView('login')}
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
  
  // User is logged in - render app with userData
  return <>{children(userData, handleLogout)}</>;
}