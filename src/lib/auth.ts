// ===== SOSTUDY AUTH UTILITIES =====
// Smart Architecture: Ready for Backend Integration
// 2 Mock Users for Testing:
//   1. alexanderbaum@gmail.com / 12345678 (with mock data)
//   2. newuser@sostudytest.com / 12345678 (fresh start, no data)

export interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  // ===== Onboarding v5 (additiv, optional — bricht bestehende Aufrufer nicht) =====
  role?: 'student' | 'parent';
  display_name?: string;   // Spitzname (Casual-App)
  real_name?: string;      // Klarname (Nachhilfe-/Vertrags-Kontext)
  familyId?: string;       // Familienkonto-Verknüpfung
  familyRole?: 'owner' | 'child';
  // ===== Onboarding 28-Mai (One-Step-Signup, Profil nach Dashboard) =====
  ageBracket?: '16plus' | 'under16'; // Self-Declaration (16), steuert Pfad B/C
  anonymous?: boolean;     // Pfad C: keine E-Mail/Klarname
  username?: string;       // Pfad C: Fantasie-Login-Kennung
  profileComplete?: boolean; // Schul-Daten (+ KI bei 16+) gesetzt → Banner aus
}

// ===== MOCK USERS (Development) =====
// These will be replaced with real Supabase Auth later

// User 1: Main Development User (has all mock data)
const MOCK_USER_ALEXANDER: UserProfile = {
  userId: 'user_alexanderbaum_mock_123',
  email: 'alexanderbaum@gmail.com',
  firstName: 'Alexander Johannes',
  lastName: 'Baum',
  createdAt: '2026-01-01T00:00:00.000Z',
  role: 'student',
  display_name: 'Alex',
  real_name: 'Alexander Johannes Baum',
};

// User 2: Fresh User (Day 0 experience - no mock data)
const MOCK_USER_NEW: UserProfile = {
  userId: 'user_newuser_mock_456',
  email: 'newuser@sostudytest.com',
  firstName: 'Max',
  lastName: 'Mustermann',
  createdAt: new Date().toISOString(),
  role: 'student',
  display_name: 'Maxi',
  real_name: '', // Day-0: Klarname noch nicht gesetzt
};

// User 3: Elternteil (Familienkonto-Demo, Onboarding v5)
const MOCK_USER_PARENT: UserProfile = {
  userId: 'user_parent_mock_789',
  email: 'parent@sostudytest.com',
  firstName: 'Sabine',
  lastName: 'Baum',
  createdAt: '2026-01-01T00:00:00.000Z',
  role: 'parent',
  display_name: 'Sabine',
  real_name: 'Sabine Baum',
  familyId: 'fam_mock_001',
  familyRole: 'owner',
};

// Map email to mock user
const MOCK_USERS_MAP: Record<string, UserProfile> = {
  'alexanderbaum@gmail.com': MOCK_USER_ALEXANDER,
  'newuser@sostudytest.com': MOCK_USER_NEW,
  'parent@sostudytest.com': MOCK_USER_PARENT,
};

/**
 * Get Current User ID
 * 
 * NOW: Returns mock user ID based on logged-in user
 * LATER (Backend): Get from Supabase Auth Session
 * 
 * @returns userId string
 */
export const getCurrentUserId = (): string => {
  // Check localStorage for current user
  const userDataStr = localStorage.getItem('userData');
  
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);

      // Onboarding v5: kanonische userId hat Vorrang (isoliert user-scoped Storage korrekt,
      // auch für zur Laufzeit angelegte Konten wie Eltern oder per Eltern erstellte Kinder).
      if (userData.userId) {
        return userData.userId;
      }

      // Legacy-Fallback: Mapping per E-Mail
      const email = userData.email?.toLowerCase();
      if (MOCK_USERS_MAP[email]) {
        return MOCK_USERS_MAP[email].userId;
      }
    } catch (e) {
      console.error('Failed to parse userData:', e);
    }
  }
  
  // TODO: Replace with Supabase Auth
  // const session = await supabase.auth.getSession();
  // return session?.data?.session?.user?.id || '';
  
  // Default to Alexander (main dev user)
  return MOCK_USER_ALEXANDER.userId;
};

/**
 * Get Current User Profile
 * 
 * NOW: Returns mock user profile based on logged-in user
 * LATER (Backend): Fetch from Supabase Database
 * 
 * @returns UserProfile
 */
export const getCurrentUserProfile = (): UserProfile => {
  // Check localStorage for userData (from login/register)
  const userDataStr = localStorage.getItem('userData');
  
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      const email = userData.email?.toLowerCase();
      
      // Get correct mock user based on email (Legacy-Basis)
      const mockUser = MOCK_USERS_MAP[email] || MOCK_USER_ALEXANDER;

      return {
        // userId aus userData bevorzugen (Onboarding v5), sonst Mock-Basis
        userId: userData.userId || mockUser.userId,
        email: userData.email || mockUser.email,
        firstName: userData.firstName || mockUser.firstName,
        lastName: userData.lastName || mockUser.lastName,
        createdAt: mockUser.createdAt,
        // Onboarding-v5-Felder additiv durchreichen
        role: userData.role || mockUser.role,
        display_name: userData.display_name || mockUser.display_name,
        real_name: userData.real_name ?? mockUser.real_name,
        familyId: userData.familyId || mockUser.familyId,
        familyRole: userData.familyRole || mockUser.familyRole,
        // Onboarding 28-Mai — additiv durchreichen
        ageBracket: userData.ageBracket,
        anonymous: userData.anonymous ?? false,
        username: userData.username,
        profileComplete: userData.profileComplete,
      };
    } catch (e) {
      console.error('Failed to parse userData:', e);
    }
  }
  
  // TODO: Replace with Supabase Query
  // const { data } = await supabase
  //   .from('profiles')
  //   .select('*')
  //   .eq('id', userId)
  //   .single();
  
  return MOCK_USER_ALEXANDER;
};

/**
 * Check if User is Authenticated
 * 
 * NOW: Always returns true (mock mode)
 * LATER (Backend): Check Supabase session
 * 
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  // Check if user has logged in (userData exists)
  const userData = localStorage.getItem('userData');
  
  // TODO: Replace with Supabase Auth Check
  // const session = await supabase.auth.getSession();
  // return !!session?.data?.session;
  
  return !!userData; // If userData exists, user is logged in
};

/**
 * Get User-Specific Storage Key
 * Helper to create user-scoped localStorage keys
 * 
 * @param key - Base key name
 * @returns User-scoped key
 */
export const getUserStorageKey = (key: string): string => {
  const userId = getCurrentUserId();
  return `sostudy_${userId}_${key}`;
};

/**
 * Clear User Session
 * 
 * NOW: Clears localStorage
 * LATER (Backend): Call Supabase signOut
 */
export const clearUserSession = (): void => {
  // TODO: Add Supabase signOut
  // await supabase.auth.signOut();
  
  localStorage.removeItem('userData');
  localStorage.removeItem('userAccountData');
  localStorage.removeItem('userName');
  localStorage.removeItem('userProfileImage');
  // Tutoring-State (sonst leakt der Status zum nächsten Mock-User)
  localStorage.removeItem('tutoringStatus');
  localStorage.removeItem('tutoringRequestData');
  // Onboarding v5 Session-Keys
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('isNewRegistration');
  localStorage.removeItem('sostudy_identity');
  // Bewusst NICHT geräumt: sostudy_identities / sostudy_families
  // → angelegte Konten bleiben erhalten, damit der Anmelde-Code-Login danach weiter funktioniert.
};

// ===== EXPORT MOCK USERS FOR TESTING =====

// User 1: Main Development User (with mock data)
export const MOCK_USER_ALEXANDER_EMAIL = 'alexanderbaum@gmail.com';
export const MOCK_USER_ALEXANDER_PASSWORD = '12345678';

// User 2: Fresh User (Day 0 experience)
export const MOCK_USER_NEW_EMAIL = 'newuser@sostudytest.com';
export const MOCK_USER_NEW_PASSWORD = '12345678';

// Legacy exports
export const MOCK_USER_EMAIL = MOCK_USER_ALEXANDER_EMAIL;
export const MOCK_USER_PASSWORD = MOCK_USER_ALEXANDER_PASSWORD;
export const MOCK_USER = MOCK_USER_ALEXANDER;
