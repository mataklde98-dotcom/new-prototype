// ===== WINDOW SIZE HOOK =====

import { useState, useEffect } from 'react';

export interface WindowSize {
  windowWidth: number;
  windowHeight: number;
}

/**
 * Custom hook to track window dimensions
 * Automatically updates on window resize events
 */
export function useWindowSize(): WindowSize {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 768
  );

  // Track window width and height for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  return { windowWidth, windowHeight };
}
