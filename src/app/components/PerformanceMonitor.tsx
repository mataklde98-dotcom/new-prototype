/**
 * 🚀 Performance Monitor - Live FPS Counter
 * 
 * Zeigt Live-FPS und Performance-Metriken während der Entwicklung
 * NUR FÜR DEVELOPMENT - In Production entfernen!
 * 
 * Usage:
 * import { PerformanceMonitor } from '@/app/components/PerformanceMonitor';
 * 
 * // In App.tsx:
 * <PerformanceMonitor />
 */

import React, { useState, useEffect, useRef } from 'react';
import { supports120Hz } from '@/utils/performance';

interface PerformanceStats {
  fps: number;
  avgFps: number;
  maxFps: number;
  minFps: number;
  frameTime: number;
}

export function PerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    avgFps: 0,
    maxFps: 0,
    minFps: 999,
    frameTime: 0,
  });
  const [isMinimized, setIsMinimized] = useState(true);
  
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    const fpsHistory: number[] = [];

    const measureFPS = (currentTime: number) => {
      frameCount++;
      const delta = currentTime - lastTime;

      // Update FPS every 500ms
      if (delta >= 500) {
        const currentFps = Math.round((frameCount * 1000) / delta);
        const frameTime = delta / frameCount;
        
        // Add to history (keep last 10 values)
        fpsHistory.push(currentFps);
        if (fpsHistory.length > 10) {
          fpsHistory.shift();
        }

        // Calculate average, max, min
        const avgFps = Math.round(
          fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length
        );
        const maxFps = Math.max(...fpsHistory);
        const minFps = Math.min(...fpsHistory);

        setStats({
          fps: currentFps,
          avgFps,
          maxFps,
          minFps,
          frameTime: Math.round(frameTime * 100) / 100,
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      rafIdRef.current = requestAnimationFrame(measureFPS);
    };

    rafIdRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const is120Hz = supports120Hz();
  
  // FPS Color Coding
  const getFpsColor = (fps: number): string => {
    if (is120Hz) {
      // 120Hz Display
      if (fps >= 110) return 'text-green-400';
      if (fps >= 90) return 'text-yellow-400';
      return 'text-red-400';
    } else {
      // 60Hz Display
      if (fps >= 55) return 'text-green-400';
      if (fps >= 45) return 'text-yellow-400';
      return 'text-red-400';
    }
  };

  const getPerformanceLabel = (fps: number): string => {
    if (is120Hz) {
      if (fps >= 110) return '🚀 Excellent';
      if (fps >= 90) return '⚡ Good';
      return '⚠️ Poor';
    } else {
      if (fps >= 55) return '✅ Smooth';
      if (fps >= 45) return '⚠️ Acceptable';
      return '❌ Laggy';
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed top-20 right-4 z-[9998] px-3 py-2 bg-black/80 rounded-lg border border-white/20 shadow-2xl"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div className="flex items-center gap-2">
          <div className={`font-mono text-sm font-bold ${getFpsColor(stats.fps)}`}>
            {stats.fps} FPS
          </div>
          <div className="text-white/40 text-xs">
            {is120Hz ? '120Hz' : '60Hz'}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-[9998] w-72 bg-black/90 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <h3 className="text-white font-medium text-sm">Performance Monitor</h3>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-white/60 hover:text-white text-lg px-2"
        >
          −
        </button>
      </div>

      {/* Stats Grid */}
      <div className="p-4 space-y-3">
        {/* Current FPS */}
        <div className="bg-white/5 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs font-medium">Current FPS</span>
            <span className="text-white/40 text-xs">{getPerformanceLabel(stats.fps)}</span>
          </div>
          <div className={`font-mono text-3xl font-bold ${getFpsColor(stats.fps)}`}>
            {stats.fps}
            <span className="text-white/40 text-lg ml-1">fps</span>
          </div>
          <div className="text-white/30 text-xs">
            {stats.frameTime}ms per frame
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          {/* Average */}
          <div className="bg-white/5 rounded-lg p-2 space-y-0.5">
            <div className="text-white/40 text-[10px] font-medium uppercase">Avg</div>
            <div className="text-white font-mono text-sm font-bold">
              {stats.avgFps}
            </div>
          </div>

          {/* Max */}
          <div className="bg-white/5 rounded-lg p-2 space-y-0.5">
            <div className="text-white/40 text-[10px] font-medium uppercase">Max</div>
            <div className="text-green-400 font-mono text-sm font-bold">
              {stats.maxFps}
            </div>
          </div>

          {/* Min */}
          <div className="bg-white/5 rounded-lg p-2 space-y-0.5">
            <div className="text-white/40 text-[10px] font-medium uppercase">Min</div>
            <div className="text-red-400 font-mono text-sm font-bold">
              {stats.minFps}
            </div>
          </div>
        </div>

        {/* Device Info */}
        <div className="bg-white/5 rounded-lg p-3 space-y-2">
          <div className="text-white/40 text-[10px] font-medium uppercase">Device</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-xs">Refresh Rate</span>
              <span className="text-white font-mono text-sm">
                {is120Hz ? '120Hz' : '60Hz'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-xs">Target FPS</span>
              <span className="text-white font-mono text-sm">
                {is120Hz ? '120' : '60'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-xs">Status</span>
              <span className={`text-xs font-medium ${
                is120Hz ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {is120Hz ? '✅ Optimized' : '⚠️ Standard'}
              </span>
            </div>
          </div>
        </div>

        {/* Target FPS Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-[10px] font-medium uppercase">
              Performance
            </span>
            <span className="text-white/40 text-[10px] font-mono">
              {Math.round((stats.fps / (is120Hz ? 120 : 60)) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                stats.fps >= (is120Hz ? 110 : 55)
                  ? 'bg-gradient-to-r from-green-400 to-green-500'
                  : stats.fps >= (is120Hz ? 90 : 45)
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                  : 'bg-gradient-to-r from-red-400 to-red-500'
              }`}
              style={{
                width: `${Math.min((stats.fps / (is120Hz ? 120 : 60)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
          <p className="text-blue-400/80 text-[10px] leading-relaxed">
            💡 <strong>Tip:</strong> Keep FPS above {is120Hz ? '110' : '55'} for smooth animations.
            Use Chrome DevTools Performance tab for detailed profiling.
          </p>
        </div>
      </div>
    </div>
  );
}
