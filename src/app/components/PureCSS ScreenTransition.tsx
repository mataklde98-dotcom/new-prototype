import React, { useEffect, useState } from 'react';

interface PureCSSScreenTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  isVisible: boolean;
  screenKey: string;
}

/**
 * PureCSSScreenTransition 🔥
 * 
 * ZERO JavaScript during animation - Pure CSS only!
 * 
 * BENEFITS:
 * - Browser can optimize transitions natively
 * - Runs on compositor thread (not main thread)
 * - Perfect 120fps on high-refresh displays
 * - No Motion.js overhead
 * - Minimal React re-renders
 * 
 * TRADEOFFS:
 * - Less flexible than Motion.js
 * - No physics-based springs
 * - But: MUCH faster & smoother
 */
export function PureCSSScreenTransition({ 
  children, 
  direction = 'right', 
  isVisible,
  screenKey 
}: PureCSSScreenTransitionProps) {
  
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Mount immediately
      setShouldRender(true);
      // Trigger animation on next frame
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      // Start exit animation
      setIsAnimating(false);
      // Unmount after animation completes
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 280); // Match CSS transition duration
      
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  const slideInClass = direction === 'right' ? 'slide-in-right' : 'slide-in-left';
  const slideOutClass = direction === 'right' ? 'slide-out-left' : 'slide-out-right';

  return (
    <>
      <div
        key={screenKey}
        className={`screen-transition ${isAnimating ? slideInClass : slideOutClass}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 56,
          
          // 🚀 CRITICAL: These enable hardware acceleration
          willChange: isAnimating ? 'transform' : 'auto',
          transform: 'translateZ(0)',
          WebkitFontSmoothing: 'antialiased',
          backfaceVisibility: 'hidden' as const,
          
          // Isolate rendering
          contain: 'layout style paint',
        }}
      >
        {children}
      </div>

      {/* Pure CSS Animations - Run on GPU! */}
      <style jsx>{`
        .screen-transition {
          /* Base transition - optimized for 120Hz */
          transition: transform 280ms cubic-bezier(0.34, 1.26, 0.64, 1);
        }

        /* Slide in from right */
        .slide-in-right {
          transform: translateX(0) translateZ(0);
        }
        .slide-out-right {
          transform: translateX(100%) translateZ(0);
        }

        /* Slide in from left */
        .slide-in-left {
          transform: translateX(0) translateZ(0);
        }
        .slide-out-left {
          transform: translateX(-100%) translateZ(0);
        }

        /* Initial states (before animation) */
        .screen-transition:not(.slide-in-right):not(.slide-in-left) {
          transform: translateX(${direction === 'right' ? '100%' : '-100%'}) translateZ(0);
        }

        /* Optimize for high refresh rate displays */
        @media (min-resolution: 120dpi) {
          .screen-transition {
            /* Slightly faster on 120Hz for crisp feeling */
            transition-duration: 250ms;
          }
        }

        /* Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .screen-transition {
            transition-duration: 1ms !important;
          }
        }
      `}</style>
    </>
  );
}

/**
 * Memoized version
 */
export const MemoizedPureCSSScreenTransition = React.memo(
  PureCSSScreenTransition,
  (prev, next) => {
    return prev.isVisible === next.isVisible && prev.screenKey === next.screenKey;
  }
);
