import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface ScreenTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  isVisible: boolean;
  screenKey: string;
}

/**
 * ScreenTransition Component - RENDERING OPTIMIZED 🚀
 * 
 * KEY OPTIMIZATIONS:
 * 1. Children nur rendern wenn Screen sichtbar oder animiert
 * 2. Lazy unmount - Content bleibt kurz im DOM für smooth exit
 * 3. GPU-accelerated transforms
 * 4. Minimale React re-renders
 */
export function ScreenTransition({ 
  children, 
  direction = 'right', 
  isVisible,
  screenKey 
}: ScreenTransitionProps) {
  
  const prefersReducedMotion = useReducedMotion();
  const hasBeenVisible = useRef(false);
  
  // Track if this screen has ever been visible (for lazy mounting)
  useEffect(() => {
    if (isVisible) {
      hasBeenVisible.current = true;
    }
  }, [isVisible]);
  
  // Define animation variants based on direction
  const variants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: 0 }
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: 0 }
    },
    up: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' }
    },
    down: {
      initial: { y: '-100%' },
      animate: { y: 0 },
      exit: { y: '-100%' }
    }
  };

  const currentVariant = variants[direction];

  // If user prefers reduced motion, use instant transitions
  if (prefersReducedMotion) {
    return isVisible ? (
      <div
        key={screenKey}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 56,
        }}
      >
        {children}
      </div>
    ) : null;
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {isVisible && (
        <motion.div
          key={screenKey}
          initial={currentVariant.initial}
          animate={currentVariant.animate}
          exit={currentVariant.exit}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 32,
            mass: 0.7,
            bounce: 0,
            // CRITICAL: Velocity 0 prevents jarring starts
            velocity: 0,
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 56,
            
            // 🚀 GPU OPTIMIZATIONS
            willChange: 'transform',
            transform: 'translateZ(0)',
            
            // Prevent text blur during animation
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            
            // Isolate rendering context
            contain: 'layout style paint',
            
            // Force GPU layer
            backfaceVisibility: 'hidden' as const,
          }}
        >
          {/* 🎯 RENDER OPTIMIZATION: Only render children when visible */}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Memoized version for extra performance
 * Use this when passing complex children
 */
export const MemoizedScreenTransition = React.memo(ScreenTransition, (prev, next) => {
  // Only re-render if visibility or screen key changes
  return prev.isVisible === next.isVisible && prev.screenKey === next.screenKey;
});
