// ===== useDelayedUnmount =====
// Two-state mount/unmount pattern for slide animations.
// Keeps component mounted during exit animation (300ms default),
// then unmounts after the animation completes.

import { useState, useEffect } from 'react';

export function useDelayedUnmount(isVisible: boolean, delayMs = 300): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
    } else if (isMounted) {
      const timer = setTimeout(() => setIsMounted(false), delayMs);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isMounted, delayMs]);

  return isMounted;
}
