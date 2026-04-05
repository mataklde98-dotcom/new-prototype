// ✨ GENERATING FLASHCARDS SCREEN — Premium SaaS Style (Linear/Vercel)
// Consistent #0a0a0a background, GPU-optimized animations, glassmorphism cards

import { useEffect, useState, useRef } from 'react';
import { X, Sparkles, Check } from 'lucide-react';

interface GeneratingFlashcardsScreenProps {
  subtopicName: string;
  flashcardCount: number;
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function GeneratingFlashcardsScreen({
  subtopicName,
  flashcardCount,
  onComplete,
  onCancel
}: GeneratingFlashcardsScreenProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'analyzing' | 'generating' | 'finalizing' | 'complete'>('analyzing');
  const [isCompleting, setIsCompleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const completeCalled = useRef(false);

  // Entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Stage-based progress — guaranteed 100%
  useEffect(() => {
    const duration = 5000;
    const fps = 60;
    const totalFrames = (duration / 1000) * fps;
    const incrementPerFrame = 100 / totalFrames;
    let currentFrame = 0;

    const interval = setInterval(() => {
      currentFrame++;
      const nextProgress = Math.min(currentFrame * incrementPerFrame, 100);
      setProgress(nextProgress);

      if (nextProgress < 25) setStage('analyzing');
      else if (nextProgress < 75) setStage('generating');
      else if (nextProgress < 100) setStage('finalizing');
      else setStage('complete');

      if (nextProgress >= 100) {
        clearInterval(interval);
        setIsCompleting(true);
        setTimeout(() => {
          if (onComplete && !completeCalled.current) {
            completeCalled.current = true;
            onComplete();
          }
        }, 1200);
      }
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [onComplete]);

  const stageLabels: Record<string, string> = {
    analyzing: 'Thema wird analysiert…',
    generating: 'Karteikarten werden erstellt…',
    finalizing: 'Wird abgeschlossen…',
    complete: 'Abgeschlossen'
  };

  const isComplete = stage === 'complete';

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: '#0a0a0a' }}
    >
      {/* ── Ambient Glow ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '15%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: isComplete
            ? 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(0,147,121,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          transition: 'background 0.8s ease',
          willChange: 'background',
        }}
      />

      {/* ── Secondary lower glow ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0,147,121,0.03) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* ── Close button ── */}
      {!isCompleting && onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <X size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
        </button>
      )}

      {/* ── Main content ── */}
      <div
        className="relative flex flex-col items-center w-full max-w-md px-8"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* ── Floating Cards ── */}
        <div className="relative w-full h-44 flex items-center justify-center mb-10">
          {[0, 1, 2].map((i) => {
            const isCenter = i === 1;
            const xOffset = (i - 1) * 82;
            return (
              <div
                key={i}
                className="absolute"
                style={{
                  width: isCenter ? '76px' : '68px',
                  height: isCenter ? '104px' : '92px',
                  borderRadius: '16px',
                  background: isCenter
                    ? 'linear-gradient(145deg, rgba(0,147,121,0.12) 0%, rgba(0,147,121,0.04) 100%)'
                    : 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  border: isCenter
                    ? '1px solid rgba(0,147,121,0.25)'
                    : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: isCenter
                    ? '0 8px 32px rgba(0,147,121,0.08), inset 0 1px 0 rgba(255,255,255,0.04)'
                    : '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.02)',
                  opacity: isCompleting ? 0 : (isCenter ? 1 : 0.6),
                  transform: isCompleting
                    ? `translateX(${xOffset}px) translateY(-30px) scale(0.9)`
                    : undefined,
                  animationName: isCompleting
                    ? 'none'
                    : `gfs-float-${i}`,
                  animationDuration: isCenter ? '5s' : '4.5s',
                  animationTimingFunction: 'ease-in-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${i * 0.4}s`,
                  transition: 'opacity 0.6s ease, transform 0.6s ease',
                  willChange: 'transform',
                }}
              >
                {/* Card inner content */}
                <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-3">
                  {/* Icon */}
                  <div
                    className="rounded-lg flex items-center justify-center"
                    style={{
                      width: isCenter ? '32px' : '28px',
                      height: isCenter ? '32px' : '28px',
                      background: isCenter
                        ? 'rgba(0,147,121,0.12)'
                        : 'rgba(255,255,255,0.04)',
                      border: isCenter
                        ? '1px solid rgba(0,147,121,0.15)'
                        : '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <svg
                      width={isCenter ? 16 : 14}
                      height={isCenter ? 16 : 14}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={isCenter ? 'rgba(0,200,160,0.8)' : 'rgba(255,255,255,0.25)'}
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2.5" />
                      <path d="M3 10h18" />
                    </svg>
                  </div>

                  {/* Skeleton lines */}
                  <div className="w-full space-y-1.5 px-1">
                    <div
                      className="h-[2px] rounded-full mx-auto"
                      style={{
                        width: '80%',
                        background: isCenter ? 'rgba(0,147,121,0.2)' : 'rgba(255,255,255,0.06)',
                      }}
                    />
                    <div
                      className="h-[2px] rounded-full mx-auto"
                      style={{
                        width: '60%',
                        background: isCenter ? 'rgba(0,147,121,0.12)' : 'rgba(255,255,255,0.04)',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Sparkle indicator on completion */}
          {isComplete && (
            <div
              className="absolute flex items-center justify-center"
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(52,211,153,0.15) 0%, rgba(0,147,121,0.08) 100%)',
                border: '1px solid rgba(52,211,153,0.2)',
                boxShadow: '0 0 40px rgba(52,211,153,0.1)',
                animation: 'gfs-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
              }}
            >
              <Check size={22} style={{ color: 'rgba(52,211,153,0.9)' }} strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* ── Typography ── */}
        <div className="text-center space-y-2.5 mb-10">
          <h2
            style={{
              color: 'rgba(255,255,255,0.95)',
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '-0.025em',
              lineHeight: 1.3,
            }}
          >
            {isComplete ? 'Erfolgreich erstellt!' : 'Karteikarten werden generiert'}
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: '-0.01em',
            }}
          >
            {flashcardCount} Karten für „{subtopicName}"
          </p>
        </div>

        {/* ── Progress section ── */}
        <div className="w-full max-w-xs space-y-3.5">
          {/* Progress bar */}
          <div className="relative w-full overflow-hidden" style={{ height: '3px', borderRadius: '2px' }}>
            {/* Track */}
            <div
              className="absolute inset-0"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '2px',
              }}
            />
            {/* Fill */}
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: `${progress}%`,
                borderRadius: '2px',
                background: isComplete
                  ? 'linear-gradient(90deg, rgba(52,211,153,0.9) 0%, rgba(110,231,183,0.95) 100%)'
                  : 'linear-gradient(90deg, rgba(0,147,121,0.8) 0%, rgba(0,200,160,0.9) 100%)',
                boxShadow: isComplete
                  ? '0 0 12px rgba(52,211,153,0.3)'
                  : '0 0 8px rgba(0,147,121,0.2)',
                transition: 'width 0.08s linear, background 0.5s ease, box-shadow 0.5s ease',
                willChange: 'width',
              }}
            />
            {/* Shimmer overlay on bar (only while loading) */}
            {!isComplete && (
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                  animation: 'gfs-shimmer 2s ease-in-out infinite',
                  willChange: 'transform',
                }}
              />
            )}
          </div>

          {/* Stage label + percentage */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {!isComplete && (
                <Sparkles
                  size={11}
                  style={{
                    color: 'rgba(0,200,160,0.6)',
                    animation: 'gfs-pulse-icon 2s ease-in-out infinite',
                  }}
                />
              )}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  color: isComplete
                    ? 'rgba(52,211,153,0.8)'
                    : 'rgba(0,200,160,0.55)',
                  textTransform: 'uppercase',
                  transition: 'color 0.5s ease',
                }}
              >
                {stageLabels[stage]}
              </span>
            </div>
            <span
              className="tabular-nums"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.02em',
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes gfs-float-0 {
          0%, 100% { transform: translateX(-82px) translateY(0px) rotate(-3deg) scale(0.96); }
          50%      { transform: translateX(-82px) translateY(-14px) rotate(-4.5deg) scale(0.98); }
        }
        @keyframes gfs-float-1 {
          0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg) scale(1); }
          30%      { transform: translateX(0px) translateY(-6px) rotate(0.8deg) scale(1.01); }
          50%      { transform: translateX(0px) translateY(-18px) rotate(0deg) scale(1.03); }
          70%      { transform: translateX(0px) translateY(-6px) rotate(-0.8deg) scale(1.01); }
        }
        @keyframes gfs-float-2 {
          0%, 100% { transform: translateX(82px) translateY(0px) rotate(3deg) scale(0.96); }
          50%      { transform: translateX(82px) translateY(-14px) rotate(4.5deg) scale(0.98); }
        }
        @keyframes gfs-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes gfs-pop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes gfs-pulse-icon {
          0%, 100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
