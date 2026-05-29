// ===== DEMO-SEED-PANEL (Onboarding v5) =====
// Schwebender Knopf, der per Klick jeden Präsentations-Zustand herstellt.
// "Gold für Präsentationen": frischer Schüler, Tutoring-Matrix-Quadranten,
// Elternteil mit 1/3 Kindern, Onboarding-Ansicht, Reset. Lädt nach Auswahl neu.
// Reiner Demo-Helfer (Development) — liegt über allem, auch vor dem Login.

import React, { useState } from 'react';
import { DEMO_PRESETS, applyDemoPreset } from '@/lib/demoSeed';

const BRAND = '#009379';
const BRAND_LIGHT = '#00B894';

function currentSummary(): string {
  if (typeof localStorage === 'undefined') return '—';
  try {
    if (localStorage.getItem('isLoggedIn') !== 'true') return 'Ausgeloggt · Onboarding';
    const ud = JSON.parse(localStorage.getItem('userData') || '{}');
    const role = ud.role === 'parent' ? 'Elternteil' : 'Schüler:in';
    const age = ud.role === 'parent' ? '' : ud.volljaehrig ? ' · volljährig' : ' · minderjährig';
    const fam = ud.familyId ? ' · 👪' : '';
    return `${role}: ${ud.display_name || ud.firstName || '—'}${age}${fam}`;
  } catch {
    return '—';
  }
}

export default function DemoSeedPanel() {
  const [open, setOpen] = useState(false);
  const groups = Array.from(new Set(DEMO_PRESETS.map((p) => p.group)));

  return (
    <>
      {/* Schwebender Toggle — über der Mobile-Navigation positioniert */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Demo-Zustände"
        className="fixed z-[99999] flex items-center justify-center rounded-full active:scale-90 transition-transform"
        style={{
          right: 14,
          bottom: 'calc(var(--safe-area-inset-bottom, 0px) + 88px)',
          width: 52,
          height: 52,
          background: `linear-gradient(135deg, ${BRAND_LIGHT}, ${BRAND})`,
          boxShadow: '0 8px 24px rgba(0,147,121,0.45)',
          fontSize: 22,
        }}
      >
        🎬
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[99998] flex items-end sm:items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-[440px] max-h-[82vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
            style={{
              background: '#101216',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
              paddingBottom: 'calc(var(--safe-area-inset-bottom, 0px) + 16px)',
            }}
          >
            {/* Kopf */}
            <div
              className="sticky top-0 px-5 pt-5 pb-3"
              style={{ background: '#101216', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-['Poppins:Bold',sans-serif] text-[17px] text-white">
                  🎬 Demo-Zustände
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.06] active:scale-90 transition-transform"
                  aria-label="Schließen"
                >
                  <span className="text-white/70 text-[18px] leading-none">×</span>
                </button>
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/45 mt-1">
                Stellt per Klick einen Präsentations-Zustand her (lädt neu).
              </p>
              <div
                className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(0,147,121,0.14)', border: `1px solid ${BRAND}` }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND_LIGHT }} />
                <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/80">
                  Jetzt: {currentSummary()}
                </span>
              </div>
            </div>

            {/* Presets nach Gruppe */}
            <div className="px-4 pt-2 pb-2 space-y-4">
              {groups.map((group) => (
                <div key={group}>
                  <div className="px-1 pb-1.5 font-['Poppins:SemiBold',sans-serif] text-[11px] uppercase tracking-wider text-white/35">
                    {group}
                  </div>
                  <div className="space-y-2">
                    {DEMO_PRESETS.filter((p) => p.group === group).map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyDemoPreset(preset.id)}
                        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left active:scale-[0.98] transition-all duration-150"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <span className="text-[22px] shrink-0 w-7 text-center">{preset.emoji}</span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-['Poppins:SemiBold',sans-serif] text-[14px] text-white truncate">
                            {preset.label}
                          </span>
                          <span className="block font-['Poppins:Regular',sans-serif] text-[12px] text-white/45 leading-snug">
                            {preset.hint}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
