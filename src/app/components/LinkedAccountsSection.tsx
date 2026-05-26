// ===== LOGIN & SICHERHEIT (Onboarding v5) =====
// Profil-Sektion (im AccountEdit-Screen): zeigt den permanenten Login-Code (Backup) mit
// Show/Hide + Kopieren + bei Bedarf "Code ändern", und erlaubt das Verknüpfen von Apple/Google
// (visuell gemockt). Der Login-Code bleibt IMMER bestehen — Auth kommt additiv dazu und ersetzt
// den Code NICHT. Ändert der Schüler den Code, synct er ins Familienkonto (Eltern-Recovery-Anker).

import React, { useEffect, useState, type ReactNode } from 'react';
import { Check, Copy, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { identityService } from '@/services/identityService';
import type { AuthMethod, SoStudyIdentity } from '@/types/identity';
import { AppleIcon, GoogleIcon } from './onboarding/OnboardingShared';

const BRAND = '#009379';

const LABEL = "font-['Poppins:Medium',sans-serif] text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] px-1 block";

export default function LinkedAccountsSection() {
  const [identity, setIdentity] = useState<SoStudyIdentity | null>(null);
  const [busy, setBusy] = useState<AuthMethod | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [regenBusy, setRegenBusy] = useState(false);

  useEffect(() => {
    setIdentity(identityService.getIdentity());
  }, []);

  // Ohne kanonische Identität (z.B. reiner Legacy-Login) blenden wir die Sektion aus.
  if (!identity) return null;

  const linked = identity.linkedAuthMethods ?? [];
  const hasCode = !!identity.anmeldeCode; // Eltern haben keinen Code → Sektion entfällt

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

  const regenerate = async () => {
    setRegenBusy(true);
    const updated = await identityService.regenerateAnmeldeCode();
    setRegenBusy(false);
    setConfirmRegen(false);
    if (updated) {
      setIdentity(updated);
      setShowCode(true); // neuen Code direkt zeigen
    }
  };

  const providers: { id: AuthMethod; label: string; icon: ReactNode }[] = [
    { id: 'apple', label: 'Apple', icon: <AppleIcon /> },
    { id: 'google', label: 'Google', icon: <GoogleIcon /> },
  ];

  return (
    <div className="space-y-6">
      {/* Login-Code (Backup) — Show/Hide + Kopieren + bei Bedarf ändern */}
      {hasCode && (
        <div className="space-y-2.5">
          <label className={LABEL}>Login-Code (Backup)</label>
          <div
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl"
            style={{ background: 'rgba(0,147,121,0.10)', border: `1px solid rgba(0,147,121,0.30)` }}
          >
            <span className="font-['Poppins:SemiBold',sans-serif] text-[18px] tracking-[0.14em] text-white">
              {showCode ? identity.anmeldeCode : '••••-••••'}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowCode((v) => !v)}
                className="p-2 rounded-lg active:scale-90 transition-transform"
                aria-label={showCode ? 'Code verbergen' : 'Code anzeigen'}
              >
                {showCode ? <EyeOff className="w-4 h-4 text-white/55" /> : <Eye className="w-4 h-4 text-white/55" />}
              </button>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg active:scale-95 transition-transform text-[12px] font-['Poppins:Medium',sans-serif]"
                style={{ color: BRAND }}
                aria-label="Code kopieren"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Kopiert' : 'Kopieren'}
              </button>
            </div>
          </div>
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 px-1">
            Falls du dich mal nicht mit Apple oder Google anmelden kannst, kommst du hiermit auf jedem
            Gerät rein. Dein Elternteil sieht ihn auch im Familienkonto.
          </p>

          {/* Code ändern (Inline-Bestätigung — alter Code wird ungültig) */}
          {confirmRegen ? (
            <div className="flex items-center gap-2 px-1 pt-1">
              <span className="flex-1 font-['Poppins:Regular',sans-serif] text-[12px] text-white/55">
                Neuen Code erzeugen? Der alte wird ungültig.
              </span>
              <button
                onClick={() => setConfirmRegen(false)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.12] text-[12px] font-['Poppins:Medium',sans-serif] text-white/70 active:scale-95 transition-transform"
              >
                Abbrechen
              </button>
              <button
                onClick={regenerate}
                disabled={regenBusy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-['Poppins:Medium',sans-serif] text-white active:scale-95 transition-transform"
                style={{ background: BRAND }}
              >
                {regenBusy && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Ja, ändern
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmRegen(true)}
              className="flex items-center gap-1.5 px-1 pt-0.5 text-[12px] font-['Poppins:Medium',sans-serif] text-white/45 active:text-white/70 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Code ändern
            </button>
          )}
        </div>
      )}

      {/* Verknüpfte Logins (Apple/Google) — additiv, der Code bleibt bestehen */}
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
          Verknüpfe Apple oder Google für einen schnelleren Login. Dein Login-Code bleibt als Backup gültig.
        </p>
      </div>
    </div>
  );
}
