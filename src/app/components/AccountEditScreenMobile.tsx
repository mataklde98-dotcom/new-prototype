// ===== ACCOUNT EDIT SCREEN MOBILE =====
// Konto-Bearbeitung mit Vorname, Nachname, E-Mail, Telefon und Bundesland
// Apple Vision Pro Style Design

import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { ChevronLeft, Check, Mail, User as UserIcon, Phone, ChevronDown } from 'lucide-react';
import CloseButton from '@/app/components/CloseButton';
import VisionProTextField from './VisionProTextField';
import LinkedAccountsSection from './LinkedAccountsSection';
import './AccountEditScreenMobile.css';

interface AccountEditScreenMobileProps {
  onBack: () => void;
  isClosing?: boolean; // 🚀 Pure CSS Animation Control
  externalTransition?: boolean; // When true, skip portal + own animation (MobileRouteTransition handles it)
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
    countryFlag: string;
    bundesland: string;
  };
  onSave: (data: any) => void;
}

// Deutsche Bundesländer
const BUNDESLAENDER = [
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen'
];

// Country Codes
const COUNTRY_CODES = [
  { code: '+49', flag: '🇩🇪', country: 'Deutschland' },
  { code: '+43', flag: '🇦🇹', country: 'Österreich' },
  { code: '+41', flag: '🇨🇭', country: 'Schweiz' },
  { code: '+44', flag: '🇬🇧', country: 'UK' },
  { code: '+1', flag: '🇺🇸', country: 'USA' },
];



const AccountEditScreenMobile = React.forwardRef<HTMLDivElement, AccountEditScreenMobileProps>(
  ({ onBack, isClosing = false, externalTransition = false, initialData, onSave }, ref) => {
    const [firstName, setFirstName] = useState(initialData.firstName);
    const [lastName, setLastName] = useState(initialData.lastName);
    const [email, setEmail] = useState(initialData.email);
    const [phone, setPhone] = useState(initialData.phone);
    const [countryCode, setCountryCode] = useState(initialData.countryCode);
    const [countryFlag, setCountryFlag] = useState(initialData.countryFlag);
    const [bundesland, setBundesland] = useState(initialData.bundesland);
    const [showToast, setShowToast] = useState(false);

    // Track whether any field has changed from initialData
    const hasChanges = useMemo(() => {
      return (
        firstName !== initialData.firstName ||
        lastName !== initialData.lastName ||
        email !== initialData.email ||
        phone !== initialData.phone ||
        countryCode !== initialData.countryCode ||
        bundesland !== initialData.bundesland
      );
    }, [firstName, lastName, email, phone, countryCode, bundesland, initialData]);

  // 🚀 Pure CSS Animation State (like ScreenManager)
  const [animationState, setAnimationState] = useState<'entering' | 'active' | 'exiting'>('entering');

  // 🔥 FIX: Sync states when initialData updates (z.B. wenn Daten von Supabase geladen werden)
  useEffect(() => {
    setFirstName(initialData.firstName);
    setLastName(initialData.lastName);
    setEmail(initialData.email);
    setPhone(initialData.phone);
    setCountryCode(initialData.countryCode);
    setCountryFlag(initialData.countryFlag);
    setBundesland(initialData.bundesland);
  }, [initialData]);

  // 🚀 Pure CSS Animation: entering → active after 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('active');
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // 🔒 Lock body scroll when mounted to prevent iOS Safari horizontal swipe
  useEffect(() => {
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
  }, []);

  // 🚀 Handle exit animation when isClosing changes
  useEffect(() => {
    if (isClosing) {
      setAnimationState('exiting');
    }
  }, [isClosing]);

  const handleSave = () => {
    onSave({
      firstName,
      lastName,
      email,
      phone,
      countryCode,
      countryFlag,
      bundesland
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 🚀 Pure CSS Animation Classes (like ScreenManager)
  const animationClass = 
    animationState === 'entering' ? 'account-edit-entering' :
    animationState === 'exiting' ? 'account-edit-exiting' :
    'account-edit-active';

  // Render mit Portal direkt in den Body, damit z-Index garantiert über Footer liegt
  const content = (
    <div 
      ref={ref}
      className={externalTransition
        ? 'flex-1 min-h-0 w-full bg-[#0a0a0a] overflow-y-auto overflow-x-hidden'
        : `account-edit-screen ${animationClass}`}
      style={externalTransition ? {
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'none',
      } : undefined}
    >
      {/* Header - wie My Flashcards */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 pt-safe">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Title Section (Links) */}
            <div className="flex-shrink-0">
              <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white">
                Profileinstellungen
              </h1>
            </div>

            {/* Close Button */}
            <CloseButton onClick={onBack} />
          </div>
        </div>
        {/* Trennstrich separat - weiter unten */}
        <div className="border-b border-white/[0.08] mt-3" />
      </div>

      {/* Content */}
      <div className="px-5 pb-32 pt-[100px] space-y-3">
        <VisionProTextField
          label="Vorname"
          value={firstName}
          onChange={setFirstName}
          placeholder="Vorname eingeben"
          leftIcon={<UserIcon className="w-5 h-5" />}
        />

        <VisionProTextField
          label="Nachname"
          value={lastName}
          onChange={setLastName}
          placeholder="Nachname eingeben"
          leftIcon={<UserIcon className="w-5 h-5" />}
        />

        <VisionProTextField
          label="E-Mail"
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="E-Mail eingeben"
          leftIcon={<Mail className="w-5 h-5" />}
        />

        {/* Telefonnummer with Country Code - Native Select */}
        <div className="space-y-2.5">
          <label className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] px-1 block">
            Telefonnummer
          </label>
          <div 
            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] transition-all duration-200"
          >
            <div className="flex items-center px-4 py-3.5 gap-3">
              {/* Phone Icon */}
              <div className="flex-shrink-0 text-white/40">
                <Phone className="w-5 h-5" />
              </div>

              {/* Country Code - Native Select */}
              <div className="relative flex-shrink-0">
                <select
                  value={countryCode}
                  onChange={(e) => {
                    const selected = COUNTRY_CODES.find(c => c.code === e.target.value);
                    if (selected) {
                      setCountryCode(selected.code);
                      setCountryFlag(selected.flag);
                    }
                  }}
                  className="appearance-none bg-transparent font-['Poppins:Medium',sans-serif] text-[15px] text-white pr-5 outline-none cursor-pointer"
                  style={{ WebkitTapHighlightColor: 'transparent', colorScheme: 'dark' }}
                >
                  {COUNTRY_CODES.map((country) => (
                    <option key={country.code} value={country.code} className="bg-[#1a1a1a] text-white">
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" strokeWidth={2} />
              </div>

              {/* Phone Input */}
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="123 456789"
                className="flex-1 bg-transparent text-white placeholder:text-white/30 font-['Poppins:Regular',sans-serif] leading-[20px] outline-none"
                style={{
                  WebkitTapHighlightColor: 'transparent'
                }}
              />
            </div>
          </div>
        </div>

        {/* Bundesland - Native Select */}
        <div className="space-y-2.5">
          <label className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#8E8E93] uppercase tracking-[0.06em] px-1 block">
            Bundesland
          </label>
          <div className="relative">
            <select
              value={bundesland}
              onChange={(e) => setBundesland(e.target.value)}
              className={`w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3.5 font-['Poppins:Regular',sans-serif] text-[15px] appearance-none cursor-pointer outline-none transition-all duration-200 focus:border-white/[0.18] ${bundesland ? 'text-white' : 'text-white/30'}`}
              style={{ WebkitTapHighlightColor: 'transparent', colorScheme: 'dark' }}
            >
              <option value="" disabled className="bg-[#1a1a1a] text-white/40">Bundesland auswählen</option>
              {BUNDESLAENDER.map((land) => (
                <option key={land} value={land} className="bg-[#1a1a1a] text-white">{land}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" strokeWidth={2} />
          </div>
        </div>

        {/* Trennlinie */}
        <div className="border-t border-white/[0.06] my-5" />

        {/* Verknüpfte Konten (Onboarding v5, Phase 2) — speichert sofort, unabhängig vom Speichern-Button */}
        <LinkedAccountsSection />
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-3" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent pointer-events-none" />
        <button
          disabled={!hasChanges}
          onClick={handleSave}
          className="relative w-full py-3.5 rounded-xl font-['Poppins:SemiBold',sans-serif] text-[14px] transition-all duration-200 active:scale-[0.97]"
          style={{
            background: hasChanges ? 'rgba(0,184,148,0.07)' : 'rgba(255,255,255,0.04)',
            border: hasChanges ? '1px solid rgba(0,184,148,0.25)' : '1px solid rgba(255,255,255,0.06)',
            color: hasChanges ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
            cursor: hasChanges ? 'pointer' : 'default',
          }}
        >
          Speichern
        </button>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-xl flex items-center gap-2 font-['Poppins:Medium',sans-serif] text-[13px] text-white"
          style={{
            background: 'rgba(0,212,170,0.15)',
            border: '1px solid rgba(0,212,170,0.3)',
            backdropFilter: 'blur(20px)',
            animation: 'fadeInDown 0.3s ease-out',
          }}
        >
          <Check className="w-4 h-4 text-[#00D4AA]" />
          Änderungen gespeichert
        </div>
      )}
    </div>
  );

  // Portal: Rendere direkt in document.body für korrekten Stacking Context
  return typeof document !== 'undefined' && !externalTransition
    ? ReactDOM.createPortal(content, document.body)
    : content;
  }
);

AccountEditScreenMobile.displayName = 'AccountEditScreenMobile';

export default AccountEditScreenMobile;