// ===== PROFIL-VERVOLLSTÄNDIGEN-BANNER (28-Mai-Wireframe) =====
// Weicher, schließbarer Hinweis auf dem Home-Screen. Erscheint, wenn ein Schüler die Schul-Daten
// (Bundesland/Schulform/Klasse) bzw. — bei 16+ — den KI-Consent noch nicht gesetzt hat.
// FULL ACCESS: blockiert nichts; nudgt nur. Liest die ROHE Identität (identityService), damit die
// UserContext-Defaults das "fehlende Profil" nicht verschlucken. Öffnet den CompleteProfileSheet.

import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { identityService, isProfileComplete } from '@/services/identityService';
import CompleteProfileSheet from './CompleteProfileSheet';

// Pro Tab-Session merken, dass "Später" geklickt wurde → nudgt erst beim nächsten App-Start wieder.
const DISMISS_KEY = 'completeProfileBannerDismissed';

export default function CompleteProfileBanner() {
  const [identity, setIdentity] = useState(() => identityService.getIdentity());
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem(DISMISS_KEY) === '1'; } catch { return false; }
  });
  const [sheetOpen, setSheetOpen] = useState(false);

  // Nur für Schüler mit unvollständigem Profil.
  const incomplete = !!identity && identity.role === 'student' && !isProfileComplete(identity);

  // Overlay-Flow (über dem Home gerendert, solange geöffnet).
  const sheet = sheetOpen && identity ? (
    <CompleteProfileSheet
      onClose={() => setSheetOpen(false)}
      onDone={() => {
        setSheetOpen(false);
        setIdentity(identityService.getIdentity()); // neu lesen → Banner verschwindet, wenn vollständig
      }}
    />
  ) : null;

  if (!incomplete || dismissed) return sheet;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
    setDismissed(true);
  };

  return (
    <>
      <button
        onClick={() => setSheetOpen(true)}
        className="w-full flex items-center gap-3 p-4 rounded-2xl text-left active:scale-[0.99] transition-all duration-150 mb-5"
        style={{ background: 'rgba(0,147,121,0.12)', border: '1px solid rgba(0,147,121,0.45)' }}
      >
        <div
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl"
          style={{ background: 'rgba(0,147,121,0.22)' }}
        >
          <Sparkles size={20} className="text-[#00B894]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
            Profil vervollständigen
          </div>
          <div className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/55 mt-0.5">
            Bundesland, Schulform & Klasse für deinen persönlichen Lernplan.
          </div>
        </div>
        <span
          onClick={handleDismiss}
          role="button"
          aria-label="Später"
          className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full active:scale-90 transition-transform"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <X size={15} className="text-white/50" />
        </span>
      </button>
      {sheet}
    </>
  );
}
