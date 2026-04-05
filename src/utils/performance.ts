/**
 * 🚀 120Hz Performance Utilities
 * 
 * Helper functions and constants for achieving buttery-smooth
 * 120fps animations on iPhone Pro models and other high-refresh displays
 */

/**
 * Optimized transition class for hardware-accelerated animations
 * Use this instead of `transition-all` for better performance
 */
export const TRANSITION_TRANSFORM = 'transition-transform duration-200 ease-out will-change-transform';
export const TRANSITION_OPACITY = 'transition-opacity duration-200 ease-out will-change-opacity';
export const TRANSITION_COLORS = 'transition-colors duration-200 ease-out';
export const TRANSITION_SCALE = 'transition-transform duration-150 ease-out will-change-transform active:scale-95';

/**
 * Hardware acceleration style object
 * Apply to any element that animates position/transform
 */
export const hwAccelerate: React.CSSProperties = {
  transform: 'translate3d(0, 0, 0)',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  WebkitFontSmoothing: 'antialiased',
};

/**
 * Optimized spring configuration for Motion/Framer Motion
 * Tuned for 120Hz displays with native iOS feel
 */
export const spring120Hz = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
  mass: 0.8,
};

/**
 * Ultra-smooth easing for 120Hz displays
 * iOS-like cubic bezier curve
 */
export const easing120Hz = [0.32, 0.72, 0, 1] as const;

/**
 * Quick easing for micro-interactions (buttons, checkboxes)
 */
export const easingQuick = [0.4, 0, 0.2, 1] as const;

/**
 * Check if device supports 120Hz refresh rate
 * (Note: This is a heuristic, not 100% accurate)
 */
export function supports120Hz(): boolean {
  // Check for high refresh rate support
  // Safari on iPhone 13 Pro+ supports this
  if (typeof window === 'undefined') return false;
  
  // UserAgent check for iPhone Pro models
  const isIPhonePro = /iPhone1[3-9]/.test(navigator.userAgent) || /iPhone[2-9]\d/.test(navigator.userAgent);
  
  // Check if prefers-reduced-motion is disabled (user wants smooth animations)
  const prefersMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return isIPhonePro && prefersMotion;
}

/**
 * Get optimal animation duration based on device capabilities
 */
export function getOptimalDuration(base: number = 300): number {
  return supports120Hz() ? base * 0.85 : base; // 15% faster on 120Hz
}

/**
 * RequestAnimationFrame wrapper with 120Hz awareness
 * Use this for smooth JS-based animations
 */
export function smoothRAF(callback: FrameRequestCallback): number {
  if (typeof window === 'undefined') return 0;
  return window.requestAnimationFrame(callback);
}

/**
 * Cancel RAF
 */
export function cancelRAF(id: number): void {
  if (typeof window === 'undefined') return;
  window.cancelAnimationFrame(id);
}

/**
 * Debounced scroll handler optimized for 120Hz
 */
export function createScrollHandler(
  callback: () => void,
  fps: number = 120
): () => void {
  let rafId: number | null = null;
  let lastTime = 0;
  const interval = 1000 / fps;

  return () => {
    if (rafId !== null) return;

    rafId = smoothRAF((time) => {
      if (time - lastTime >= interval) {
        callback();
        lastTime = time;
      }
      rafId = null;
    });
  };
}
