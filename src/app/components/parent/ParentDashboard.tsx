// ===== ELTERN-DASHBOARD (Onboarding v5 — Familienkonto) =====
// Eigener Bereich für eingeloggte Eltern (role 'parent'): Kinder-Liste, Code-Management,
// Nachhilfe-Einwilligung pro Kind, Multi-Kind (weitere hinzufügen). Mobile & Desktop (zentrierte Spalte).

import React, { useEffect, useState } from 'react';
import { LogOut, Plus, RefreshCw, Copy, Check, Trash2 } from 'lucide-react';
import { familyService } from '@/services/familyService';
import { identityService } from '@/services/identityService';
import type { Familienkonto, FamilyChild, ActivationMode } from '@/types/identity';
import SoStudyLogo from '@/app/components/SoStudyLogo';
import { MascotAvatar } from '@/app/components/onboarding/OnboardingShared';
import AddChildFlow from './AddChildFlow';

const BRAND = '#009379';

const MODE_LABEL: Record<ActivationMode, string> = {
  A: 'Konto erstellt',
  B: 'Konto verknüpft',
  C: 'Eingeladen',
};

interface ParentDashboardProps {
  userData: any;
  onLogout: () => void;
}

export default function ParentDashboard({ userData, onLogout }: ParentDashboardProps) {
  const [family, setFamily] = useState<Familienkonto | null>(null);
  const [showAddChild, setShowAddChild] = useState(false);

  useEffect(() => {
    setFamily(familyService.getFamily());
  }, []);

  const parentName =
    identityService.getIdentity()?.display_name ||
    userData?.display_name ||
    userData?.firstName ||
    family?.parentRealName?.split(' ')[0] ||
    'Elternteil';

  const children = family?.children ?? [];

  // Vollflächiger Add-Child-Flow als Overlay (gleicher Look wie Onboarding)
  if (showAddChild && family) {
    return (
      <AddChildFlow
        familyId={family.familyId}
        onDone={(updated) => { setFamily({ ...updated }); setShowAddChild(false); }}
        onCancel={() => setShowAddChild(false)}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ background: `radial-gradient(120% 70% at 50% 0%, rgba(0,147,121,0.10) 0%, #0a0a0a 50%)` }}
    >
      {/* Kopfzeile */}
      <div
        className="sticky top-0 z-10 px-5 pb-3 backdrop-blur-md"
        style={{
          paddingTop: 'calc(var(--safe-area-inset-top, 0px) + 16px)',
          background: 'rgba(10,10,10,0.72)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-[640px] mx-auto flex items-center justify-between">
          <SoStudyLogo className="h-7" />
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.10] active:scale-95 transition-transform"
          >
            <LogOut className="w-4 h-4 text-white/60" />
            <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/70">Abmelden</span>
          </button>
        </div>
      </div>

      <div className="max-w-[640px] mx-auto px-5 pt-6" style={{ paddingBottom: 'calc(var(--safe-area-inset-bottom, 0px) + 120px)' }}>
        {/* Begrüßung */}
        <div className="flex items-center gap-4 mb-7">
          <MascotAvatar size={64} />
          <div>
            <h1 className="font-['Poppins:Bold',sans-serif] text-[24px] leading-tight text-white">
              Hallo, {parentName}! 👋
            </h1>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/50 mt-0.5">
              {children.length === 0
                ? 'Dein Familienkonto ist eingerichtet.'
                : `${children.length} ${children.length === 1 ? 'Kind' : 'Kinder'} in deinem Familienkonto`}
            </p>
          </div>
        </div>

        {/* Abschnittstitel */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white/80">Meine Kinder</h2>
        </div>

        {/* Kinder-Liste / Leerzustand */}
        {children.length === 0 ? (
          <EmptyState onAdd={() => setShowAddChild(true)} />
        ) : (
          <div className="space-y-3">
            {children.map((child) => (
              <ChildCard
                key={child.childUserId}
                child={child}
                familyId={family!.familyId}
                onUpdate={(updated) => setFamily({ ...updated })}
              />
            ))}
          </div>
        )}

        {/* Weiteres Kind hinzufügen (Multi-Kind) */}
        {children.length > 0 && (
          <button
            onClick={() => setShowAddChild(true)}
            className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-2xl active:scale-[0.98] transition-transform"
            style={{ background: 'rgba(0,147,121,0.10)', border: `1px dashed rgba(0,147,121,0.45)` }}
          >
            <Plus className="w-5 h-5" style={{ color: BRAND }} />
            <span className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white/85">
              Weiteres Kind hinzufügen
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

// ===== LEERZUSTAND =====
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="rounded-3xl p-8 flex flex-col items-center text-center gap-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="text-[40px]">👶</div>
      <p className="font-['Poppins:Medium',sans-serif] text-[15px] text-white/70 max-w-[260px]">
        Noch kein Kind verknüpft. Füge das erste Kind hinzu, um loszulegen.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-3 rounded-2xl active:scale-[0.98] transition-transform"
        style={{ background: `linear-gradient(135deg, #00B894, ${BRAND})`, boxShadow: '0 8px 24px rgba(0,147,121,0.35)' }}
      >
        <Plus className="w-5 h-5 text-white" />
        <span className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">Kind hinzufügen</span>
      </button>
    </div>
  );
}

// ===== KIND-KARTE =====
function ChildCard({
  child, familyId, onUpdate,
}: { child: FamilyChild; familyId: string; onUpdate: (family: Familienkonto) => void }) {
  const [busy, setBusy] = useState<'consent' | 'code' | 'remove' | null>(null);
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(child.anmeldeCode);

  const copy = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const toggleConsent = async () => {
    if (busy || child.pending) return;
    setBusy('consent');
    const fam = await familyService.setTutoringConsent(familyId, child.childUserId, !child.tutoringConsent);
    setBusy(null);
    if (fam) onUpdate(fam);
  };

  const regenerate = async () => {
    if (busy) return;
    setBusy('code');
    const res = await familyService.regenerateChildCode(familyId, child.childUserId);
    setBusy(null);
    if (res.ok && res.family) {
      setCode(res.anmeldeCode);
      onUpdate(res.family);
    }
  };

  const remove = async () => {
    if (busy) return;
    setBusy('remove');
    const fam = await familyService.removeChild(familyId, child.childUserId);
    setBusy(null);
    if (fam) onUpdate(fam);
  };

  return (
    <div
      className="rounded-3xl p-4"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Kopf: Avatar + Name + Mode-Badge */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center font-['Poppins:Bold',sans-serif] text-[18px] text-white shrink-0"
          style={{ background: `linear-gradient(135deg, #00B894, ${BRAND})` }}
        >
          {child.display_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white truncate">
            {child.display_name}
          </div>
          <div className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/45 truncate">
            {[child.schoolType, child.grade && `Klasse ${child.grade}`].filter(Boolean).join(' · ') || 'Kein Profil-Detail'}
          </div>
        </div>
        <span
          className="px-2.5 py-1 rounded-full font-['Poppins:Medium',sans-serif] text-[11px] shrink-0"
          style={{
            background: child.pending ? 'rgba(245,158,11,0.14)' : 'rgba(255,255,255,0.06)',
            color: child.pending ? '#fbbf24' : 'rgba(255,255,255,0.6)',
            border: child.pending ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {child.pending ? 'Einladung offen' : MODE_LABEL[child.activationMode]}
        </span>
      </div>

      {/* Anmelde-/Einladungs-Code + Verwaltung */}
      <div
        className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-2xl"
        style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex-1 min-w-0">
          <div className="font-['Poppins:Medium',sans-serif] text-[10px] uppercase tracking-wider text-white/35">
            {child.pending ? 'Einladungs-Code' : 'Anmelde-Code'}
          </div>
          <div className="font-['Poppins:SemiBold',sans-serif] text-[15px] tracking-[0.10em] text-white truncate">
            {code}
          </div>
        </div>
        <button onClick={copy} className="p-2 rounded-lg bg-white/[0.05] active:scale-90 transition-transform" aria-label="Code kopieren">
          {copied ? <Check className="w-4 h-4" style={{ color: BRAND }} /> : <Copy className="w-4 h-4 text-white/55" />}
        </button>
        {!child.pending && (
          <button onClick={regenerate} className="p-2 rounded-lg bg-white/[0.05] active:scale-90 transition-transform" aria-label="Neuen Code generieren">
            <RefreshCw className={`w-4 h-4 text-white/55 ${busy === 'code' ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Nachhilfe-Einwilligung + Entfernen */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ConsentSwitch on={child.tutoringConsent} disabled={child.pending || busy === 'consent'} onToggle={toggleConsent} />
          <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70">
            Nachhilfe erlaubt
          </span>
        </div>
        <button
          onClick={remove}
          disabled={busy === 'remove'}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg active:scale-95 transition-transform disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4 text-red-400/70" />
          <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-red-300/70">Entfernen</span>
        </button>
      </div>
    </div>
  );
}

// ===== EINWILLIGUNGS-SCHALTER =====
function ConsentSwitch({ on, disabled, onToggle }: { on: boolean; disabled?: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className="relative w-11 h-6 rounded-full transition-colors duration-200 disabled:opacity-40"
      style={{ background: on ? BRAND : 'rgba(255,255,255,0.14)' }}
      aria-pressed={on}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
        style={{ transform: on ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  );
}
