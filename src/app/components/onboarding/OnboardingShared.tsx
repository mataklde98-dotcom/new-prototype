// ===== ONBOARDING — GEMEINSAME BAUSTEINE (Knowunity-Look) =====
// Vollflächige Chat-Bubble-Screens mit Maskottchen-Dialog.
// Reiner Prototyp-UI-Layer; deutsche Texte, Dark-Glass, Poppins, Brand #009379.

import React from 'react';

// ===== BRAND =====
export const BRAND = {
  primary: '#009379',
  primaryLight: '#00B894',
  bg: '#0a0a0a',
} as const;

// ===== DATENLISTEN (konsistent zu RegisterScreen) =====
export const BUNDESLAENDER = [
  'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
  'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
  'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
  'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen',
];

export const SCHOOL_TYPES = [
  'Grundschule', 'Hauptschule', 'Realschule',
  'Gymnasium', 'Gesamtschule', 'Berufsschule',
];

export const GRADES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

// Klassenstufen je Schulform — verhindert fachlich falsche Optionen (z.B. "Klasse 13" für
// Grundschule). MVP: Schulformen selbst sind in allen Bundesländern gleich verfügbar.
// SPÄTER: ggf. serverseitig / pro Bundesland verfeinern.
export const KLASSEN_BY_SCHULFORM: Record<string, string[]> = {
  Grundschule: ['1', '2', '3', '4'],
  Hauptschule: ['5', '6', '7', '8', '9', '10'],
  Realschule: ['5', '6', '7', '8', '9', '10'],
  Gymnasium: ['5', '6', '7', '8', '9', '10', '11', '12', '13'],
  Gesamtschule: ['5', '6', '7', '8', '9', '10', '11', '12', '13'],
  Berufsschule: ['1. Lehrjahr', '2. Lehrjahr', '3. Lehrjahr'],
};

/** Gültige Klassenstufen für eine Schulform (Fallback: alle, falls Schulform leer/unbekannt). */
export const gradesForSchoolType = (schoolType: string): string[] =>
  KLASSEN_BY_SCHULFORM[schoolType] ?? GRADES;

// ===== MASKOTTCHEN (Inline-SVG-Platzhalter) =====
// Freundliches Blob-Maskottchen im Brand-Verlauf. Später 1:1 gegen ein echtes Asset austauschbar.
export function MascotAvatar({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" aria-hidden>
      <defs>
        <linearGradient id="mascotGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BRAND.primaryLight} />
          <stop offset="100%" stopColor={BRAND.primary} />
        </linearGradient>
      </defs>
      {/* Glow */}
      <circle cx="48" cy="48" r="40" fill="url(#mascotGrad)" opacity="0.18" />
      {/* Körper */}
      <path
        d="M24 44c0-13.255 10.745-24 24-24s24 10.745 24 24v10c0 9.941-8.059 18-18 18H42c-9.941 0-18-8.059-18-18V44z"
        fill="url(#mascotGrad)"
      />
      {/* Antenne */}
      <line x1="48" y1="20" x2="48" y2="11" stroke="url(#mascotGrad)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="48" cy="9" r="3.5" fill={BRAND.primaryLight} />
      {/* Augen */}
      <circle cx="39" cy="46" r="5.5" fill="#0a0a0a" />
      <circle cx="57" cy="46" r="5.5" fill="#0a0a0a" />
      <circle cx="40.8" cy="44.3" r="1.8" fill="#fff" />
      <circle cx="58.8" cy="44.3" r="1.8" fill="#fff" />
      {/* Lächeln */}
      <path d="M40 58c2.5 3 11.5 3 16 0" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ===== CHAT-BUBBLE (Maskottchen spricht) =====
export function ChatBubble({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative max-w-[88%] rounded-[20px] rounded-tl-[6px] px-5 py-4 animate-[onbBubbleIn_0.35s_ease-out]"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="font-['Poppins:Medium',sans-serif] text-[20px] leading-[1.35] text-white/95">
        {children}
      </div>
    </div>
  );
}

// ===== PROGRESS DOTS =====
export function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: i === current ? 20 : 6,
            background: i <= current ? BRAND.primary : 'rgba(255,255,255,0.18)',
          }}
        />
      ))}
    </div>
  );
}

// ===== SHELL =====
// Vollflächiger Onboarding-Container: Kopfzeile (Zurück + Fortschritt),
// Scroll-Inhalt, fixierter Footer mit CTA.
export function OnboardingShell({
  onBack,
  progress,
  children,
  footer,
  stepKey,
}: {
  onBack?: () => void;
  progress?: { current: number; total: number };
  children: React.ReactNode;
  footer?: React.ReactNode;
  stepKey?: string | number; // wechselt pro Schritt → sanftes Einblenden (onbStepIn)
}) {
  // Zentrierte Spalte (max. 480px) für Desktop-Parität; mobil unverändert vollflächig.
  const COL = 'max-w-[480px] mx-auto w-full';
  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        background: `radial-gradient(120% 80% at 50% 0%, rgba(0,147,121,0.10) 0%, ${BRAND.bg} 55%)`,
      }}
    >
      {/* Kopfzeile */}
      <div className="px-5 pb-2" style={{ paddingTop: 'calc(var(--safe-area-inset-top) + 16px)' }}>
        <div className={`${COL} flex items-center justify-between`}>
          {onBack ? (
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08] active:scale-90 transition-transform"
              aria-label="Zurück"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}
          {progress && <ProgressDots current={progress.current} total={progress.total} />}
          <div className="w-9 h-9" />
        </div>
      </div>

      {/* Inhalt — pro Schritt sanft eingeblendet */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4">
        <div key={stepKey} className={`${COL} h-full animate-[onbStepIn_0.3s_ease-out]`}>
          {children}
        </div>
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-5 pt-3" style={{ paddingBottom: 'calc(var(--safe-area-inset-bottom) + 20px)' }}>
          <div className={COL}>{footer}</div>
        </div>
      )}
    </div>
  );
}

// ===== PRIMARY BUTTON =====
export function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-['Poppins:SemiBold',sans-serif] text-[16px] text-white active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:active:scale-100"
      style={{
        background:
          disabled || loading
            ? 'rgba(255,255,255,0.08)'
            : `linear-gradient(135deg, ${BRAND.primaryLight}, ${BRAND.primary})`,
        boxShadow: disabled || loading ? 'none' : '0 8px 24px rgba(0,147,121,0.35)',
      }}
    >
      {loading && (
        <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

// ===== SECONDARY BUTTON (Glass, gleichwertige Aktion) =====
export function SecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center py-4 rounded-2xl font-['Poppins:SemiBold',sans-serif] text-[16px] text-white/85 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:active:scale-100"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      {children}
    </button>
  );
}

// ===== DISCLAIMER (Browse-Wrap, juristisch entscheidend) =====
export function LegalDisclaimer() {
  return (
    <p className="text-center font-['Poppins:Regular',sans-serif] text-[12px] leading-[1.55] text-white/40 px-3 pt-1">
      Mit der Nutzung von SoStudy bestätigst du, dass du unsere{' '}
      <button className="inline p-0 m-0 align-baseline font-['Poppins:Medium',sans-serif] text-[12px] leading-[inherit] text-white/65 underline underline-offset-2 active:text-white/90">AGB</button>{' '}
      und{' '}
      <button className="inline p-0 m-0 align-baseline font-['Poppins:Medium',sans-serif] text-[12px] leading-[inherit] text-white/65 underline underline-offset-2 active:text-white/90">Datenschutzerklärung</button>{' '}
      gelesen und akzeptiert hast.
    </p>
  );
}

// ===== TEXT LINK (sekundär, dezent) =====
export function TextLink({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-center py-2 font-['Poppins:Medium',sans-serif] text-[14px] text-white/45 active:text-white/70 transition-colors"
    >
      {children}
    </button>
  );
}

// ===== CHOICE LIST (Single-Select, z.B. Bundesland/Schulform/Klasse) =====
export function ChoiceList({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  columns?: 1 | 2 | 3;
}) {
  const gridCols = columns === 3 ? 'grid-cols-3' : columns === 2 ? 'grid-cols-2' : 'grid-cols-1';
  return (
    <div className={`grid ${gridCols} gap-2.5`}>
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-left active:scale-[0.98] transition-all duration-150"
            style={{
              background: selected ? 'rgba(0,147,121,0.14)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selected ? BRAND.primary : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <span
              className={`font-['Poppins:Medium',sans-serif] text-[15px] ${
                selected ? 'text-white' : 'text-white/70'
              }`}
            >
              {opt}
            </span>
            {selected && columns === 1 && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke={BRAND.primaryLight} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ===== BIG SELECTION CARD (Rolle-Auswahl) =====
export function BigSelectionCard({
  emoji,
  title,
  subtitle,
  selected,
  onClick,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-5 rounded-3xl text-left active:scale-[0.98] transition-all duration-150"
      style={{
        background: selected ? 'rgba(0,147,121,0.14)' : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${selected ? BRAND.primary : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      <div
        className="w-14 h-14 flex items-center justify-center rounded-2xl text-[28px] shrink-0"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        {emoji}
      </div>
      <div className="flex-1">
        <div className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white">{title}</div>
        <div className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/55 mt-0.5">{subtitle}</div>
      </div>
    </button>
  );
}

// ===== SOCIAL ICONS (visuell gemockt) =====
export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

export function AppleIcon() {
  // fill via currentColor → Textfarbe des Buttons steuert die Logo-Farbe
  // (weiß auf dunkel, schwarz auf weißem Apple-Button).
  return (
    <svg width="16" height="18" viewBox="0 0 16 20" fill="currentColor" style={{ overflow: 'visible' }}>
      <path d="M13.04 10.58c-.03-2.78 2.27-4.12 2.37-4.18-1.29-1.89-3.3-2.15-4.02-2.18-1.71-.17-3.34 1.01-4.21 1.01-.87 0-2.22-.98-3.65-.96-1.88.03-3.61 1.09-4.58 2.78-1.95 3.39-.5 8.41 1.4 11.16.93 1.35 2.04 2.86 3.5 2.81 1.4-.06 1.93-.91 3.63-.91 1.7 0 2.18.91 3.67.88 1.51-.03 2.48-1.37 3.4-2.72 1.07-1.56 1.51-3.07 1.54-3.15-.03-.01-2.95-1.13-2.98-4.5zM10.23 2.54c.77-.94 1.29-2.24 1.15-3.54-1.11.05-2.45.74-3.25 1.67-.72.83-1.34 2.16-1.18 3.43 1.24.1 2.5-.63 3.28-1.56z" />
    </svg>
  );
}
