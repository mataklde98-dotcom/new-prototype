// ===== MEIN TARIF SCREEN =====
// Eigenständiger Full-Screen für Tarif-Übersicht & Referral-Gamification
// Premium SaaS Style (Linear/Vercel) – GPU-Slide-Animation via Portal

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Sparkles, Gift, Users, CreditCard, GraduationCap, Copy, Check, Crown, Trophy, Zap, Info, ChevronRight, Award, Flame } from 'lucide-react';
import CloseButton from '@/app/components/CloseButton';
import DesktopPageHeader from '@/app/components/DesktopPageHeader';
import './MeinTarifScreen.css';

interface MeinTarifScreenProps {
  onClose: () => void;
  tutoringActive?: boolean;
  /** When true, skip portal + own animation (external transition handles it) */
  externalTransition?: boolean;
}

export default function MeinTarifScreen({ onClose, tutoringActive = false, externalTransition = false }: MeinTarifScreenProps) {
  // Animation state (mobile portal mode)
  const [animationState, setAnimationState] = useState<'entering' | 'active' | 'exiting'>('entering');

  // Gamification state
  const [referrals, setReferrals] = useState(2);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showCreditInfo, setShowCreditInfo] = useState(false);

  const REFERRALS_NEEDED = 3;

  // Credit system mock data
  const planName = 'Pro Plan';
  const planCreditsPerMonth = 500;
  const planCreditsUsed = 257;
  const planCreditsRemaining = planCreditsPerMonth - planCreditsUsed;
  const referralCredits = 300;
  const activityCredits = 200;
  const totalCredits = planCreditsRemaining + referralCredits + activityCredits;
  const planUsagePercent = (planCreditsUsed / planCreditsPerMonth) * 100;

  // Animation entering → active
  useEffect(() => {
    if (externalTransition) return;
    const timer = setTimeout(() => {
      setAnimationState('active');
    }, 300);
    return () => clearTimeout(timer);
  }, [externalTransition]);

  // Lock body scroll
  useEffect(() => {
    if (externalTransition) return;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;
    const originalTop = document.body.style.top;
    const scrollY = window.scrollY;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
      document.body.style.top = originalTop;
      window.scrollTo(0, scrollY);
    };
  }, [externalTransition]);

  const handleClose = useCallback(() => {
    if (externalTransition) {
      onClose();
      return;
    }
    setAnimationState('exiting');
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, externalTransition]);

  // Share via native Web Share API (WhatsApp, Facebook, SMS, etc.)
  const INVITE_URL = 'https://sostudy.app/invite/abc123';
  const INVITE_TEXT = 'Lerne smarter mit SoStudy – KI-gestützte Lernhilfe für Schüler! Nutze meinen Einladungslink:';

  const handleInvite = async () => {
    if (totalCredits >= 99999) return;

    // Use native share sheet if available (mobile & modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SoStudy – Gemeinsam besser lernen',
          text: INVITE_TEXT,
          url: INVITE_URL,
        });
        // Note: In production, referral count increments server-side
        // when the invited friend actually registers (not on share).
      } catch (err: any) {
        // User cancelled the share – do nothing
        if (err?.name === 'AbortError') return;
      }
    } else {
      // Fallback: copy link to clipboard on desktop browsers without Share API
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(INVITE_URL).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const progressPercent = (referrals / REFERRALS_NEEDED) * 100;

  // CSS animation class (only for portal/mobile mode)
  const animationClass =
    animationState === 'entering' ? 'mein-tarif-entering' :
    animationState === 'exiting' ? 'mein-tarif-exiting' :
    'mein-tarif-active';

  const screenContent = (
    <div
      className={externalTransition
        ? 'flex-1 min-h-0 w-full bg-[#0a0a0a] overflow-y-auto overflow-x-hidden'
        : `mein-tarif-screen ${animationClass}`}
      style={externalTransition ? {
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'none',
      } : undefined}
    >
      {/* Mobile Header */}
      {!externalTransition && (
        <>
          <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 pt-safe">
            <div className="px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Crown className="w-5 h-5 text-white/50" strokeWidth={2} />
                  <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white">
                    Mein Tarif
                  </h1>
                </div>
                <CloseButton onClick={handleClose} />
              </div>
            </div>
            <div className="border-b border-white/[0.08] mt-3" />
          </div>
        </>
      )}

      {/* Desktop Header (inside DCW) */}
      {externalTransition && (
        <DesktopPageHeader
          title="Mein Tarif"
          onBack={handleClose}
          backLabel="Profil"
        />
      )}

      {/* Content */}
      <div className={`px-5 pb-32 space-y-4 ${externalTransition ? '' : 'pt-[100px]'}`}>

        {/* ===== BEREICH 1: Mein Plan ===== */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">
                {planName}
              </span>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 mt-0.5">
                {planCreditsPerMonth} KI-Credits / Monat
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 font-['Poppins:Medium',sans-serif] text-[11px] text-[#10B981]">
              Aktiv
            </span>
          </div>
          <button
            onClick={() => {
              window.open('https://apps.apple.com/account/subscriptions', '_blank');
            }}
            className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/25 active:text-white/40 transition-colors"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            Plan verwalten →
          </button>
        </div>

        {/* ===== BEREICH 2: Meine KI-Credits (merged & redesigned) ===== */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
          <span className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white block mb-4">
            Meine KI-Credits
          </span>

          {/* Part 1: Hero – Total Credits */}
          <div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-['Poppins:SemiBold',sans-serif] text-[32px] text-[#10B981] leading-none">
                {totalCredits}
              </span>
              <span className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/40">
                Credits verfügbar
              </span>
            </div>

            {/* Progress bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40">
                  Plan-Credits diesen Monat
                </span>
                <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/50">
                  {planCreditsUsed} / {planCreditsPerMonth} verbraucht
                </span>
              </div>
              <div className="w-full h-[7px] rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] transition-all duration-500 ease-out"
                  style={{ width: `${planUsagePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Part 2: Three Mini-Cards */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {/* Plan Credits */}
            <div className="rounded-xl bg-[#3B82F6]/[0.07] border border-[#3B82F6]/[0.15] p-3 flex flex-col items-center text-center">
              <div className="w-7 h-7 rounded-lg bg-[#3B82F6]/15 flex items-center justify-center mb-2">
                <Crown className="w-[14px] h-[14px] text-[#3B82F6]" strokeWidth={2} />
              </div>
              <span className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-[#3B82F6] leading-none mb-1">
                {planCreditsRemaining}
              </span>
              <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/35 leading-tight">
                Plan übrig
              </span>
            </div>

            {/* Referral Credits */}
            <div className="rounded-xl bg-[#FFD60A]/[0.07] border border-[#FFD60A]/[0.15] p-3 flex flex-col items-center text-center">
              <div className="w-7 h-7 rounded-lg bg-[#FFD60A]/15 flex items-center justify-center mb-2">
                <Gift className="w-[14px] h-[14px] text-[#FFD60A]" strokeWidth={2} />
              </div>
              <span className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-[#FFD60A] leading-none mb-1">
                {referralCredits}
              </span>
              <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/35 leading-tight">
                Durch Einladungen
              </span>
            </div>

            {/* Streak Credits */}
            <div className="rounded-xl bg-[#F59E0B]/[0.07] border border-[#F59E0B]/[0.15] p-3 flex flex-col items-center text-center">
              <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center mb-2">
                <Flame className="w-[14px] h-[14px] text-[#F59E0B]" strokeWidth={2} />
              </div>
              <span className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-[#F59E0B] leading-none mb-1">
                {activityCredits}
              </span>
              <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/35 leading-tight">
                Durch Lern-Streak
              </span>
            </div>
          </div>

          {/* Part 3: Detail timeline (subtle, secondary) */}
          <div className="space-y-1.5 mb-4 px-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFD60A]/40 flex-shrink-0" />
              <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25">
                Referral-Credits: {referralCredits} Credits · seit Oktober 2025
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]/40 flex-shrink-0" />
              <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25">
                Lern-Streak-Credits: {activityCredits} Credits · seit November 2025
              </span>
            </div>
          </div>

          {/* Part 4: Info notice */}
          <div className="flex items-start gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <Info className="w-3.5 h-3.5 text-white/20 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/20 leading-[15px]">
              Deine kostenlosen Credits (Referral + Aktivitäten) verfallen nicht und bleiben erhalten. Bei deiner nächsten Zahlung kommen deine monatlichen Plan-Credits oben drauf.
            </p>
          </div>
        </div>

        {/* ===== BEREICH 3: Freunde einladen ===== */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFD60A]/10 flex items-center justify-center">
              <Gift className="w-[18px] h-[18px] text-[#FFD60A]" strokeWidth={2} />
            </div>
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white leading-tight">
                Freunde einladen
              </p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 leading-tight mt-0.5">
                Gratis Credits verdienen
              </p>
            </div>
          </div>

          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/50 mb-4 leading-[19px]">
            Lade 3 Freunde ein und erhalte <span className="text-[#FFD60A] font-['Poppins:Medium',sans-serif]">100 Credits kostenlos</span>.
          </p>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/40">
                Einladungen
              </span>
              <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/70">
                {referrals} / {REFERRALS_NEEDED}
              </span>
            </div>
            <div className="w-full h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FFD60A] to-[#F59E0B] transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/20 mb-4 leading-[15px]">
            Einladungen zählen erst, wenn sich deine Freunde registrieren.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={handleInvite}
              className="flex-1 h-[40px] rounded-xl bg-white/[0.06] border border-white/[0.12] font-['Poppins:Medium',sans-serif] text-[13px] text-white flex items-center justify-center gap-1.5 active:bg-white/[0.10] active:scale-[0.98] transition-all duration-200"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Users className="w-3.5 h-3.5" strokeWidth={2} />
              Einladen
            </button>
            <button
              onClick={handleCopyLink}
              className="h-[40px] px-4 rounded-xl bg-white/[0.06] border border-white/[0.12] font-['Poppins:Medium',sans-serif] text-[13px] text-white flex items-center justify-center gap-1.5 active:bg-white/[0.10] active:scale-[0.98] transition-all duration-200"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {linkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#10B981]" strokeWidth={2.5} />
                  <span className="text-[#10B981]">Kopiert</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" strokeWidth={2} />
                  Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* ===== BEREICH 4: Abo Status ===== */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
          <span className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white block mb-3">
            Abo Status
          </span>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40">
                Nächste Zahlung
              </span>
              <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70">
                10.04.2026
              </span>
            </div>

            <div className="h-px bg-white/[0.04]" />

            <div className="flex items-center justify-between">
              <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40">
                Preis
              </span>
              <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/70">
                4,99 € / Monat
              </span>
            </div>

            <div className="h-px bg-white/[0.04]" />

            <div className="flex items-center justify-between">
              <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40">
                Nächste Credits
              </span>
              <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-[#10B981]/70">
                +{planCreditsPerMonth} am 10.04.2026
              </span>
            </div>

            <div className="h-px bg-white/[0.04]" />

            <div className="flex items-start gap-2 pt-0.5">
              <Info className="w-3.5 h-3.5 text-white/20 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/20 leading-[15px]">
                Bei der nächsten Zahlung werden deine monatlichen Plan-Credits aufgeladen. Deine gesammelten Gratis-Credits bleiben bestehen und werden nicht zurückgesetzt.
              </p>
            </div>

            <button
              onClick={() => {
                window.open('https://apps.apple.com/account/subscriptions', '_blank');
              }}
              className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/25 active:text-white/40 transition-colors"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Abo verwalten →
            </button>
          </div>
        </div>

        {/* ===== SECTION: Nachhilfe-Tarif ===== */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
          <div className="flex items-center justify-between">
            <span className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">
              Nachhilfe-Tarif
            </span>
            <span className={`px-2.5 py-1 rounded-full border font-['Poppins:Medium',sans-serif] text-[11px] ${
              tutoringActive
                ? 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]'
                : 'bg-white/[0.04] border-white/[0.08] text-white/30'
            }`}>
              {tutoringActive ? 'Aktiv' : 'Nicht aktiv'}
            </span>
          </div>

          {tutoringActive && (
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40">
                  Vertrag läuft bis
                </span>
                <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70">
                  18.08.2025
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );

  // Desktop (externalTransition) renders inline, Mobile uses Portal
  if (externalTransition) {
    return screenContent;
  }

  return ReactDOM.createPortal(screenContent, document.body);
}