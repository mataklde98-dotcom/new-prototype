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
};

// User 2: Fresh User (Day 0 experience - no mock data)
const MOCK_USER_NEW: UserProfile = {
  userId: 'user_newuser_mock_456',
  email: 'newuser@sostudytest.com',
  firstName: 'Max',
  lastName: 'Mustermann',
  createdAt: new Date().toISOString(),
};

// Map email to mock user
const MOCK_USERS_MAP: Record<string, UserProfile> = {
  'alexanderbaum@gmail.com': MOCK_USER_ALEXANDER,
  'newuser@sostudytest.com': MOCK_USER_NEW,
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
      const email = userData.email?.toLowerCase();
      
      // Return correct mock user ID based on email
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
      
      // Get correct mock user based on email
      const mockUser = MOCK_USERS_MAP[email] || MOCK_USER_ALEXANDER;
      
      return {
        userId: mockUser.userId,
        email: userData.email || mockUser.email,
        firstName: userData.firstName || mockUser.firstName,
        lastName: userData.lastName || mockUser.lastName,
        createdAt: mockUser.createdAt,
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
  // Onboarding v5 Session-Keys
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('isNewRegistration');
  localStorage.removeItem('sostudy_identity');
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
