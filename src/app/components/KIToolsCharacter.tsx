import React from 'react';
import svgPaths from "@/imports/svg-qoer347dnk";
import { OVERALL_PROGRESS } from './ProfileAnalyticsScreen';

/**
 * KI Tools Character SVG with Progress Ring - Memoized for Performance
 * Shows the Wissensstand (knowledge level) progress ring around the character,
 * synced with the same value from Lernanalyse.
 */

// Progress ring dimensions — thinner stroke for premium feel
const RING_SIZE = 210;
const RING_STROKE = 5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const KIToolsCharacter = React.memo(function KIToolsCharacter() {
  const progress = OVERALL_PROGRESS;
  const strokeDashoffset = RING_CIRCUMFERENCE - (progress / 100) * RING_CIRCUMFERENCE;

  return (
    <div className="relative w-full shrink-0" style={{ height: '280px' }}>
      {/* Progress Ring */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '28px', width: `${RING_SIZE}px`, height: `${RING_SIZE}px` }}>
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          className="block -rotate-90"
        >
          {/* Track (background ring) */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={RING_STROKE}
          />
          {/* Progress arc */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke="url(#kiProgressGrad)"
            strokeWidth={RING_STROKE}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
          <defs>
            <linearGradient id="kiProgressGrad" gradientUnits="userSpaceOnUse" x1="0" y1={RING_SIZE} x2={RING_SIZE} y2="0">
              <stop offset="0%" stopColor="#00D4AA" />
              <stop offset="100%" stopColor="#009379" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner dark circle (character background) — seamless with page bg */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: `${RING_SIZE - RING_STROKE * 2 - 10}px`,
            height: `${RING_SIZE - RING_STROKE * 2 - 10}px`,
            background: '#0e0e0e',
          }}
        />
      </div>

      {/* Character Illustration */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: '58px', width: '125px', height: '148px' }}>
        <div className="w-full h-full">
          <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 150.561 179.099">
            <g>
              <path d={svgPaths.p24029100} fill="#C0DDD8" stroke="black" strokeWidth="2.29374" />
              <path d={svgPaths.p30fda480} fill="#F1F0F9" />
              <path d={svgPaths.p310ae580} fill="#00362C" />
              <path d={svgPaths.p1334e440} fill="#009379" />
              <ellipse cx="5.81924" cy="10.9155" fill="#009379" rx="5.81924" ry="10.9155" transform="matrix(0.996089 0.0883502 -0.0891496 0.996018 49.2463 55.1253)" />
              <ellipse cx="5.81924" cy="10.9155" fill="#009379" rx="5.81924" ry="10.9155" transform="matrix(0.996089 0.0883502 -0.0891496 0.996018 94.6431 57.6358)" />
              <path d={svgPaths.p3239d000} fill="white" />
              <path d={svgPaths.p313ed700} fill="#009379" stroke="#00362C" strokeWidth="2.29374" />
              <path d={svgPaths.p25e93380} fill="#00705C" />
              <path d={svgPaths.p372f4180} fill="#00A88B" stroke="#00362C" strokeWidth="1.14687" />
              <path d={svgPaths.p2d570300} fill="#009379" stroke="black" strokeWidth="2.29374" />
              <path d={svgPaths.p1c7a600} fill="#EBEBF5" stroke="black" strokeWidth="2.29374" />
              <path d={svgPaths.p7032800} fill="#009379" stroke="black" strokeWidth="2.29374" />
              <path d={svgPaths.p17c90b00} fill="#EBEBF5" stroke="black" strokeWidth="2.29374" />
              <path d={svgPaths.p4212e50} fill="#009379" stroke="black" strokeWidth="2.29374" />
              <path d={svgPaths.p1ea0df00} fill="#EBEBF5" stroke="black" strokeWidth="2.29374" />
              <path d={svgPaths.p3eb65300} fill="#009379" stroke="black" strokeWidth="2.29374" />
              <path d={svgPaths.p3fcdfd00} fill="#EBEBF5" stroke="black" strokeWidth="2.29374" />
              <path d={svgPaths.p16d0ecc0} fill="#009379" stroke="black" strokeWidth="2.29374" />
              <path d={svgPaths.p3e01a440} fill="white" stroke="black" strokeWidth="2.29374" />
              <path d={svgPaths.p2dec9800} stroke="black" strokeWidth="2.29374" />
              <path d={svgPaths.p1a567200} fill="#009379" />
              <path d={svgPaths.p4861280} fill="#00705C" />
              <path d={svgPaths.p2c6c4980} fill="white" stroke="black" strokeWidth="2.29374" />
              <path d={svgPaths.p23fae100} fill="#D0D0D0" />
              <path d={svgPaths.p176e3df0} fill="#D0D0D0" />
              <path d={svgPaths.p1430de00} fill="white" />
              <path d={svgPaths.p13372080} fill="#005C4C" />
              <path d={svgPaths.p3d0df100} fill="#005C4C" />
              <path d={svgPaths.p3849000} fill="#009379" />
              <path d={svgPaths.pa053a00} fill="#009379" />
            </g>
          </svg>
        </div>
      </div>

      {/* Gesamtfortschritt label + percentage — integrated pill style */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5" style={{ top: '250px' }}>
        <span
          className="font-['Poppins:Medium',sans-serif] text-[11px]"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          Gesamtfortschritt
        </span>
        <span
          className="font-['Poppins:SemiBold',sans-serif] text-[11px]"
          style={{ color: '#00D4AA' }}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
});

export default KIToolsCharacter;