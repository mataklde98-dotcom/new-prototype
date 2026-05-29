// ===== USE CURRENT USER HOOK =====
// Convenient hook to access current user from UserContext

import { useUser } from '@/contexts/UserContext';

/**
 * useCurrentUser - Simple hook to get current user profile
 * 
 * Usage:
 * ```typescript
 * const user = useCurrentUser();
 * console.log(user.name, user.profileImage);
 * ```
 * 
 * Returns the current user profile (name and image)
 */
export function useCurrentUser() {
  const { userName, profileImage } = useUser();
  return { 
    name: userName, 
    profileImage,
    // For backwards compatibility
    id: 'single-user',
    email: 'user@sostudyai.com'
  };
}

/**
 * useIsAuthenticated - Check if user is logged in
 * In Single-User-Mode, always returns true
 */
export function useIsAuthenticated(): boolean {
  // Single User Mode - always authenticated
  return true;
}
