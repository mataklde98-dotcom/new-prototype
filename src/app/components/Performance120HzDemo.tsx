/**
 * 🚀 120Hz Performance Demo Component
 * 
 * Zeigt die Unterschiede zwischen standard und optimierten Animationen
 * NUR FÜR DEVELOPMENT - In Production entfernen!
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TRANSITION_SCALE, 
  hwAccelerate, 
  spring120Hz, 
  easing120Hz,
  supports120Hz 
} from '@/utils/performance';

export function Performance120HzDemo() {
  const [show, setShow] = useState(false);
  const [animating, setAnimating] = useState(false);

  const is120Hz = supports120Hz();

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="fixed bottom-24 right-4 z-[9999] px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        🚀 120Hz Demo
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-6">
      <div className="bg-white/10 rounded-3xl p-8 max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            🚀 120Hz Performance Demo
          </h2>
          <button
            onClick={() => setShow(false)}
            className="text-white/60 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Device Info */}
        <div className="bg-white/5 rounded-xl p-4 space-y-2">
          <p className="text-white/60 text-sm">Device Status:</p>
          <p className="text-white font-medium">
            {is120Hz ? '✅ 120Hz Supported!' : '⚠️ 60Hz Display'}
          </p>
          <p className="text-white/40 text-xs">
            {is120Hz 
              ? 'Optimized animations active'
              : 'Standard 60fps animations'
            }
          </p>
        </div>

        {/* Animation Tests */}
        <div className="space-y-4">
          {/* Test 1: Transition Scale (Button) */}
          <div className="space-y-2">
            <p className="text-white/80 text-sm font-medium">
              1. Optimized Button (TRANSITION_SCALE)
            </p>
            <button
              className={`w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium ${TRANSITION_SCALE}`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Tap me! 🚀
            </button>
          </div>

          {/* Test 2: Motion Spring */}
          <div className="space-y-2">
            <p className="text-white/80 text-sm font-medium">
              2. Spring Animation (spring120Hz)
            </p>
            <button
              onClick={() => setAnimating(!animating)}
              className="w-full px-6 py-4 bg-white/10 rounded-xl text-white font-medium"
            >
              Toggle Animation
            </button>
            <motion.div
              className="w-full h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl"
              animate={{
                x: animating ? 100 : 0,
                scale: animating ? 1.1 : 1,
              }}
              transition={spring120Hz}
              style={hwAccelerate}
            />
          </div>

          {/* Test 3: Easing Comparison */}
          <div className="space-y-2">
            <p className="text-white/80 text-sm font-medium">
              3. Custom Easing (easing120Hz)
            </p>
            <motion.div
              className="w-full h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-medium"
              animate={{
                rotate: animating ? 360 : 0,
              }}
              transition={{
                duration: 0.6,
                ease: easing120Hz,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={hwAccelerate}
            >
              Smooth Rotation
            </motion.div>
          </div>

          {/* Test 4: Translate3D */}
          <div className="space-y-2">
            <p className="text-white/80 text-sm font-medium">
              4. Hardware Accelerated (translate3d)
            </p>
            <motion.div
              className="w-full h-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl"
              animate={{
                y: animating ? -20 : 0,
              }}
              transition={{
                duration: 0.3,
                ease: easing120Hz,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                ...hwAccelerate,
                willChange: 'transform',
              }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 space-y-2">
          <p className="text-blue-400 text-sm font-medium">
            💡 Performance Tip
          </p>
          <p className="text-white/60 text-xs leading-relaxed">
            Alle Animationen nutzen <code className="text-blue-400">transform</code> und{' '}
            <code className="text-blue-400">opacity</code> für GPU-Beschleunigung.
            Auf iPhone Pro Modellen laufen diese mit 120fps!
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className={`w-full px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium ${TRANSITION_SCALE}`}
        >
          Close Demo
        </button>
      </div>
    </div>
  );
}
