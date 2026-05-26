// ===== VERKNÜPFTE KONTEN (Onboarding v5, Phase 2) =====
// Profil-Sektion: zeigt den permanenten Anmelde-Code und erlaubt das nachträgliche
// Verknüpfen von Apple/Google (visuell gemockt via identityService.linkAuthMethod).
// Wiederverwendbar in Mobile- & Desktop-Profil (Parität).

import React, { useEffect, useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import { identityService } from '@/services/identityService';
import type { AuthMethod, SoStudyIdentity } from '@/types/identity';
import { AppleIcon, GoogleIcon } from './onboarding/OnboardingShared';

const BRAND = '#009379';

const LABEL = "font-['Poppins:Medium',sans-serif] text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] px-1 block";

export default function LinkedAccountsSection() {
  const [identity, setIdentity] = useState<SoStudyIdentity | null>(null);
  const [busy, setBusy] = useState<AuthMethod | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIdentity(identityService.getIdentity());
  }, []);

  // Ohne kanonische Identität (z.B. reiner Legacy-Login) blenden wir die Sektion aus.
  if (!identity) return null;

  const linked = identity.linkedAuthMethods ?? [];

  const toggleLink = async (method: AuthMethod) => {
    if (busy) return;
    setBusy(method);
    const updated = linked.includes(method)
      ? await identityService.unlinkAuthMethod(method)
      : await identityService.linkAuthMethod(method);
    if (updated) setIdentity(updated);
    setBusy(null);
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(identity.anmeldeCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const providers: { id: AuthMethod; label: string; icon: ReactNode }[] = [
    { id: 'apple', label: 'Apple', icon: <AppleIcon /> },
    { id: 'google', label: 'Google', icon: <GoogleIcon /> },
  ];

  return (
    <div className="space-y-6">
      {/* Anmelde-Code */}
      <div className="space-y-2.5">
        <label className={LABEL}>Anmelde-Code</label>
        <button
          onClick={copyCode}
          className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl active:scale-[0.99] transition-all duration-150"
          style={{ background: 'rgba(0,147,121,0.10)', border: `1px solid rgba(0,147,121,0.30)` }}
        >
          <span className="font-['Poppins:SemiBold',sans-serif] text-[18px] tracking-[0.14em] text-white">
            {identity.anmeldeCode}
          </span>
          <span className="flex items-center gap-1.5 text-[12px] font-['Poppins:Medium',sans-serif]" style={{ color: BRAND }}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Kopiert' : 'Kopieren'}
          </span>
        </button>
        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 px-1">
          Mit diesem Code meldest du dich auf jedem Gerät an — auch ohne Apple oder Google.
        </p>
      </div>

      {/* Verknüpfte Logins */}
      <div className="space-y-2.5">
        <label className={LABEL}>Verknüpfte Konten</label>
        <div className="space-y-2">
          {providers.map(({ id, label, icon }) => {
            const isLinked = linked.includes(id);
            const isBusy = busy === id;
            return (
              <div
                key={id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="w-6 flex items-center justify-center shrink-0">{icon}</span>
                <span className="flex-1 font-['Poppins:Medium',sans-serif] text-[15px] text-white/90">
                  {label}
                </span>
                {isLinked ? (
                  <button
                    onClick={() => toggleLink(id)}
                    disabled={isBusy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                    style={{ background: 'rgba(0,147,121,0.14)', border: `1px solid ${BRAND}` }}
                  >
                    {isBusy ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" style={{ color: BRAND }} />
                    )}
                    <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/85">
                      {isBusy ? 'Trennen…' : 'Verknüpft'}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => toggleLink(id)}
                    disabled={isBusy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.12] active:scale-95 transition-transform"
                  >
                    {isBusy && (
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                    )}
                    <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/70">
                      {isBusy ? 'Verbinden…' : 'Verknüpfen'}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 px-1">
          Verknüpfe Apple oder Google für einen schnelleren Login. Dein Anmelde-Code bleibt zusätzlich gültig.
        </p>
      </div>
    </div>
  );
}
