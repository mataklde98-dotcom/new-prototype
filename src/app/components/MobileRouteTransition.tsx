// ===== MOBILE ROUTE TRANSITION =====
// Central transition authority for ALL mobile overlay screens.
//
// ARCHITECTURE:
//   This is the ONLY component allowed to handle overlay slide-in/out transitions
//   on mobile. All top-level mobile overlays (MyFlashcards, CompletedExams,
//   Lernanalyse, TodoManagement) MUST use this component.
//
// BEHAVIOR:
//   - Mounts children immediately when `isVisible` becomes true
//   - Plays slide-in animation (from right)
//   - When `isVisible` becomes false, plays slide-out animation
//   - Unmounts children after exit animation completes (300ms)
//
// INVARIANTS:
//   1. Header/Footer are OUTSIDE this component (never affected by transition)
//   2. Only the content area is animated
//   3. Uses GPU-optimized CSS classes from SlideTransition.css
//   4. z-index is configurable but defaults to 56 (below footer z-60)

import React from 'react';
import { useDelayedUnmount } from '@/hooks/useDelayedUnmount';
import './SlideTransition.css';

interface MobileRouteTransitionProps {
  /** Controls visibility — true = slide in, false = slide out then unmount */
  isVisible: boolean;
  /** Content to render inside the transition wrapper */
  children: React.ReactNode;
  /** z-index of the overlay (default: 56, below footer at z-60) */
  zIndex?: number;
  /** Additional CSS classes for the wrapper */
  className?: string;
}

export function MobileRouteTransition({
  isVisible,
  children,
  zIndex = 56,
  className = '',
}: MobileRouteTransitionProps) {
  const isMounted = useDelayedUnmount(isVisible, 300);

  if (!isMounted) return null;

  const slideClass = isVisible
    ? 'slide-screen-entering'
    : 'slide-screen-exiting';

  return (
    <div
      className={`slide-screen ${slideClass} flex flex-col ${className}`}
      style={{ zIndex }}
    >
      {children}
    </div>
  );
}

export default MobileRouteTransition;
