import React, { useState, useEffect, useRef } from 'react';
import { ScreenTransition } from './ScreenTransition';
import { PureCSSScreenTransition } from './PureCSS ScreenTransition';

/**
 * TransitionBenchmark - Live Performance Comparison 🔬
 * 
 * Vergleicht die verschiedenen Transition-Ansätze in Echtzeit
 */
export function TransitionBenchmark() {
  const [approach, setApproach] = useState<'motion' | 'css'>('motion');
  const [activeScreen, setActiveScreen] = useState<'A' | 'B'>('A');
  const [fps, setFps] = useState(0);
  const frameTimesRef = useRef<number[]>([]);
  const rafRef = useRef<number>();
  const lastFrameTimeRef = useRef(performance.now());

  // FPS Counter
  useEffect(() => {
    const measureFPS = () => {
      const now = performance.now();
      const delta = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      frameTimesRef.current.push(delta);
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      const avgDelta = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
      const currentFps = Math.round(1000 / avgDelta);
      setFps(currentFps);

      rafRef.current = requestAnimationFrame(measureFPS);
    };

    rafRef.current = requestAnimationFrame(measureFPS);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const toggleScreen = () => {
    setActiveScreen(prev => prev === 'A' ? 'B' : 'A');
  };

  // Demo Screens with complex content
  const ScreenA = (
    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-col gap-4 p-8">
      <h1 className="text-white text-4xl font-bold">Screen A</h1>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-20 h-20 bg-white/20 rounded-lg" />
        ))}
      </div>
    </div>
  );

  const ScreenB = (
    <div className="w-full h-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center flex-col gap-4 p-8">
      <h1 className="text-white text-4xl font-bold">Screen B</h1>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-20 h-20 bg-white/20 rounded-lg" />
        ))}
      </div>
    </div>
  );

  const TransitionWrapper = approach === 'motion' ? ScreenTransition : PureCSSScreenTransition;

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col">
      {/* Controls */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-white text-2xl font-bold mb-4">
            🔬 Transition Performance Test
          </h2>
          
          {/* Approach Selector */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setApproach('motion')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                approach === 'motion'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              Motion.js Spring
            </button>
            <button
              onClick={() => setApproach('css')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                approach === 'css'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              Pure CSS
            </button>
          </div>

          {/* FPS Display */}
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/10 px-6 py-3 rounded-xl">
              <div className="text-white/60 text-sm mb-1">Current FPS</div>
              <div className={`text-3xl font-bold ${
                fps >= 100 ? 'text-green-400' : fps >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {fps} fps
              </div>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl flex-1">
              <div className="text-white/60 text-sm mb-1">Status</div>
              <div className="text-white font-semibold">
                {fps >= 100 ? '🔥 Excellent (120Hz ready)' : 
                 fps >= 60 ? '✅ Good (60Hz)' : 
                 '⚠️ Needs optimization'}
              </div>
            </div>
          </div>

          {/* Test Button */}
          <button
            onClick={toggleScreen}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            🚀 Toggle Screen (Test Transition)
          </button>
        </div>
      </div>

      {/* Transition Demo Area */}
      <div className="flex-1 relative overflow-hidden">
        <TransitionWrapper
          isVisible={activeScreen === 'A'}
          screenKey="screen-a"
          direction="right"
        >
          {ScreenA}
        </TransitionWrapper>

        <TransitionWrapper
          isVisible={activeScreen === 'B'}
          screenKey="screen-b"
          direction="right"
        >
          {ScreenB}
        </TransitionWrapper>
      </div>

      {/* Legend */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-white/60 text-sm">
            💡 Klicke mehrmals auf "Toggle Screen" und beobachte die FPS-Werte während der Animation
          </div>
        </div>
      </div>
    </div>
  );
}
