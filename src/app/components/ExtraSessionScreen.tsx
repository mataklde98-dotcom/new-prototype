// ===== EXTRA-STUNDEN SCREEN =====
// Kauf-Flow für zusätzliche Nachhilfestunden.
// Single-Entry: Klick auf "Extra-Stunden" im Profil → dieser Screen.
//
// ARCHITEKTUR:
//   view = 'overview' → Bestand + Kauf-CTA + Historie + Prototyp-Demo-Block
//   view = 'wizard'   → 4-Step Kauf-Flow (Menge → Daten → Zahlung → Bestätigen)
//                       + 5. Step = Success-Screen (auto-close-Fallback)
//
// CAP-LOGIK:
//   Max 6 verfügbare Stunden gleichzeitig (EXTRA_SESSION_CAP in UserContext).
//   Harter Cap auf Kauf (qty + available ≤ 6).
//   Weicher Cap auf Storno (available kann temporär > 6 sein).
//   Solange available >= 6 → Kauf blockiert bis runter konsumiert.

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Minus, Check, BookOpen, CreditCard, ShieldCheck } from 'lucide-react';
import { useUser, EXTRA_SESSION_CAP, EXTRA_SESSION_PRICE } from '@/contexts/UserContext';

interface ExtraSessionsScreenProps {
  onClose: () => void;
  externalTransition?: boolean;
}

type View = 'overview' | 'wizard';
type WizardStep = 1 | 2 | 3 | 4 | 5; // 5 = success

interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  zip: string;
  city: string;
}

interface CardData {
  holder: string;
  number: string; // mit Spaces
  expiry: string; // MM/YY
  cvc: string;
}

// Nur Ziffern, gruppiert in 4er-Blöcken, max 19 Ziffern (23 Zeichen inkl. Spaces)
const formatCardNumber = (v: string) =>
  v.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');

// MM/YY — automatischer Slash nach 2 Ziffern
const formatExpiry = (v: string) => {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const formatCvc = (v: string) => v.replace(/\D/g, '').slice(0, 4);

const PAYMENT_METHODS = [
  { id: 'paypal', label: 'PayPal', sublabel: 'Zahle mit deinem PayPal-Konto' },
  { id: 'klarna', label: 'Klarna', sublabel: 'Rechnung oder Ratenzahlung' },
  { id: 'creditcard', label: 'Kreditkarte', sublabel: 'Visa, Mastercard, Amex' },
  { id: 'sofort', label: 'Sofortüberweisung', sublabel: 'Direkt vom Bankkonto' },
];

// Brand-Icons als Inline-SVG (simple-icons Pfade, CC0)
const PayPalIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
  </svg>
);

const KlarnaIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <span
    className={className}
    style={{
      ...style,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Poppins:Bold', sans-serif",
      fontWeight: 800,
      fontSize: '18px',
      lineHeight: 1,
      letterSpacing: '-0.5px',
    }}
  >
    K
  </span>
);

// Input component ausserhalb der Hauptkomponente — sonst wird er bei jedem
// Render neu erzeugt und das <input> verliert Focus nach jedem Tastendruck.
interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

const Input = ({ label, value, onChange, placeholder, type = 'text' }: InputProps) => (
  <div>
    <label className="block font-['Poppins:Medium',sans-serif] text-[12px] text-white/55 mb-1.5">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-[44px] px-4 rounded-xl font-['Poppins:Regular',sans-serif] text-[14px] text-white placeholder:text-white/25 outline-none transition-colors"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    />
  </div>
);

export default function ExtraSessionsScreen({ onClose }: ExtraSessionsScreenProps) {
  const {
    accountData,
    extraSessions,
    purchaseExtraSessions,
    consumeExtraSession,
    cancelExtraSession,
    resetExtraSessions,
    canPurchaseExtraSessions,
    maxPurchasableExtraSessions,
  } = useUser();

  const [view, setView] = useState<View>('overview');
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [purchaseQty, setPurchaseQty] = useState<number>(1);
  const [personalData, setPersonalData] = useState<PersonalData>({
    firstName: accountData.firstName || '',
    lastName: accountData.lastName || '',
    email: accountData.email || '',
    street: '',
    zip: '',
    city: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<string>('paypal');
  const [cardData, setCardData] = useState<CardData>({
    holder: '',
    number: '',
    expiry: '',
    cvc: '',
  });

  const openWizard = () => {
    // Qty auf max 1 oder maxPurchasable clampen
    const initialQty = Math.min(1, maxPurchasableExtraSessions);
    setPurchaseQty(Math.max(initialQty, 1));
    setWizardStep(1);
    setView('wizard');
  };

  const closeWizard = () => {
    setView('overview');
    setWizardStep(1);
  };

  const handleWizardBack = () => {
    if (wizardStep === 1) {
      closeWizard();
    } else {
      setWizardStep((s) => (s - 1) as WizardStep);
    }
  };

  const handleWizardNext = () => {
    if (wizardStep < 4) {
      setWizardStep((s) => (s + 1) as WizardStep);
    }
  };

  const handleConfirmPurchase = () => {
    purchaseExtraSessions(purchaseQty, paymentMethod);
    setWizardStep(5);
  };

  const total = purchaseQty * EXTRA_SESSION_PRICE;

  // ===== OVERVIEW VIEW =====
  const renderOverview = () => (
    <>
      {/* Bestand Card */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(0,184,148,0.08), rgba(0,184,148,0.04))',
          border: '1px solid rgba(0,184,148,0.18)',
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #00B894, #009379)' }}
          >
            <BookOpen className="w-6 h-6 text-white" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 mb-0.5">
              Aktuell verfügbar
            </p>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[24px] text-white leading-none">
              {extraSessions.available}
              <span className="text-white/30 text-[16px] font-['Poppins:Regular',sans-serif]"> / {EXTRA_SESSION_CAP}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[12px] mb-4">
          <span className="font-['Poppins:Regular',sans-serif] text-white/45">
            {EXTRA_SESSION_PRICE} € pro 45min-Einheit
          </span>
          {!canPurchaseExtraSessions && (
            <span className="font-['Poppins:Medium',sans-serif]" style={{ color: '#FFB800' }}>
              Maximum erreicht
            </span>
          )}
        </div>

        <button
          onClick={openWizard}
          disabled={!canPurchaseExtraSessions}
          className="w-full h-[48px] rounded-xl font-['Poppins:SemiBold',sans-serif] text-[14px] transition-all duration-200 active:scale-[0.98] disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: canPurchaseExtraSessions
              ? 'linear-gradient(135deg, #00B894, #009379)'
              : 'rgba(255,255,255,0.06)',
            color: canPurchaseExtraSessions ? '#ffffff' : 'rgba(255,255,255,0.35)',
          }}
        >
          {canPurchaseExtraSessions ? 'Stunden kaufen' : 'Kauf gesperrt'}
        </button>

        {!canPurchaseExtraSessions && (
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35 text-center mt-2.5 leading-[15px]">
            Verbrauche erst Stunden bei deinem Nachhilfelehrer, bevor du neue kaufen kannst.
          </p>
        )}
      </div>

      {/* Info Card */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white mb-1.5">
          So funktioniert's
        </p>
        <ul className="space-y-1.5">
          <li className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/55 leading-[17px]">
            · 1 Einheit = 45 Minuten Nachhilfe
          </li>
          <li className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/55 leading-[17px]">
            · Flexibel als Einzel- (45min) oder Doppelstunde (90min) planbar
          </li>
          <li className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/55 leading-[17px]">
            · Max. {EXTRA_SESSION_CAP} Einheiten gleichzeitig im Bestand
          </li>
        </ul>
      </div>

      {/* Prototyp-Demo-Block */}
      <div
        className="rounded-2xl p-4 mt-8"
        style={{
          border: '1.5px dashed rgba(255,184,0,0.35)',
          background: 'rgba(255,184,0,0.03)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[14px]">🧪</span>
          <p className="font-['Poppins:SemiBold',sans-serif] text-[12px]" style={{ color: '#FFB800' }}>
            Prototyp-Demo · wird später entfernt
          </p>
        </div>
        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 mb-3 leading-[15px]">
          Diese Buttons simulieren das Verhalten im echten System. In Produktion passiert das automatisch durch geplante Termine und Stornos.
        </p>
        <div className="space-y-2">
          <button
            onClick={consumeExtraSession}
            disabled={extraSessions.available <= 0}
            className="w-full h-[38px] rounded-lg font-['Poppins:Medium',sans-serif] text-[12px] transition-all active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            −1 verbrauchen (Termin mit Lehrer)
          </button>
          <button
            onClick={cancelExtraSession}
            className="w-full h-[38px] rounded-lg font-['Poppins:Medium',sans-serif] text-[12px] transition-all active:scale-[0.98]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            +1 Storno simulieren (Cap-Override)
          </button>
          <button
            onClick={resetExtraSessions}
            className="w-full h-[38px] rounded-lg font-['Poppins:Medium',sans-serif] text-[12px] transition-all active:scale-[0.98]"
            style={{
              background: 'rgba(255,184,0,0.08)',
              border: '1px solid rgba(255,184,0,0.2)',
              color: '#FFB800',
            }}
          >
            Reset auf 2 (Historie löschen)
          </button>
        </div>
      </div>
    </>
  );

  // ===== WIZARD STEPS =====
  const StepIndicator = () => (
    <div className="flex items-center gap-1.5 mb-6">
      {[1, 2, 3, 4].map((s) => {
        const active = s === wizardStep;
        const done = s < wizardStep;
        return (
          <div
            key={s}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{
              background: done || active ? '#00B894' : 'rgba(255,255,255,0.08)',
            }}
          />
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <>
      <h2 className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-white mb-1">
        Wie viele Stunden?
      </h2>
      <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 mb-6">
        Max. {maxPurchasableExtraSessions} {maxPurchasableExtraSessions === 1 ? 'Stunde' : 'Stunden'} kaufbar (Bestand: {extraSessions.available} / {EXTRA_SESSION_CAP})
      </p>

      <div
        className="rounded-2xl p-6"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center justify-between gap-4 mb-5">
          <button
            onClick={() => setPurchaseQty((q) => Math.max(1, q - 1))}
            disabled={purchaseQty <= 1}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:active:scale-100"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Minus className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
          <div className="text-center">
            <p className="font-['Poppins:Bold',sans-serif] text-[48px] text-white leading-none">
              {purchaseQty}
            </p>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 mt-1">
              {purchaseQty === 1 ? 'Stunde' : 'Stunden'}
            </p>
          </div>
          <button
            onClick={() => setPurchaseQty((q) => Math.min(maxPurchasableExtraSessions, q + 1))}
            disabled={purchaseQty >= maxPurchasableExtraSessions}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 disabled:active:scale-100"
            style={{
              background: 'rgba(0,184,148,0.12)',
              border: '1px solid rgba(0,184,148,0.25)',
            }}
          >
            <Plus className="w-5 h-5" style={{ color: '#00B894' }} strokeWidth={2.5} />
          </button>
        </div>

        <div
          className="pt-4 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/50">
            {purchaseQty} × {EXTRA_SESSION_PRICE} €
          </span>
          <span className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white">
            {total} €
          </span>
        </div>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2 className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-white mb-1">
        Rechnungsdaten
      </h2>
      <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 mb-6">
        Deine Daten für die Rechnung
      </p>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Vorname"
            value={personalData.firstName}
            onChange={(v) => setPersonalData((d) => ({ ...d, firstName: v }))}
          />
          <Input
            label="Nachname"
            value={personalData.lastName}
            onChange={(v) => setPersonalData((d) => ({ ...d, lastName: v }))}
          />
        </div>
        <Input
          label="E-Mail"
          type="email"
          value={personalData.email}
          onChange={(v) => setPersonalData((d) => ({ ...d, email: v }))}
        />
        <Input
          label="Straße & Hausnummer"
          value={personalData.street}
          onChange={(v) => setPersonalData((d) => ({ ...d, street: v }))}
          placeholder="Musterstraße 12"
        />
        <div className="grid grid-cols-[100px_1fr] gap-3">
          <Input
            label="PLZ"
            value={personalData.zip}
            onChange={(v) => setPersonalData((d) => ({ ...d, zip: v }))}
            placeholder="80331"
          />
          <Input
            label="Stadt"
            value={personalData.city}
            onChange={(v) => setPersonalData((d) => ({ ...d, city: v }))}
            placeholder="München"
          />
        </div>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h2 className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-white mb-1">
        Zahlungsmethode
      </h2>
      <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 mb-6">
        Wähle deine bevorzugte Zahlungsart
      </p>

      <div className="space-y-2">
        {PAYMENT_METHODS.map((pm) => {
          const selected = paymentMethod === pm.id;
          const isPayPal = pm.id === 'paypal';
          const isKlarna = pm.id === 'klarna';
          const isCredit = pm.id === 'creditcard';
          const hasBrand = isPayPal || isKlarna;
          const brandBg = isPayPal ? '#003087' : isKlarna ? '#FFB3C7' : undefined;
          const brandFg = isPayPal ? '#FFFFFF' : isKlarna ? '#000000' : undefined;

          return (
            <div
              key={pm.id}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                background: selected ? 'rgba(0,184,148,0.08)' : 'rgba(255,255,255,0.03)',
                border: selected ? '1.5px solid #00B894' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <button
                onClick={() => setPaymentMethod(pm.id)}
                className="w-full flex items-center gap-3 p-4 transition-all active:scale-[0.99]"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: hasBrand
                      ? brandBg
                      : selected ? 'rgba(0,184,148,0.15)' : 'rgba(255,255,255,0.05)',
                  }}
                >
                  {isPayPal ? (
                    <PayPalIcon className="w-5 h-5" style={{ color: brandFg }} />
                  ) : isKlarna ? (
                    <KlarnaIcon className="w-5 h-5" style={{ color: brandFg }} />
                  ) : (
                    <CreditCard className="w-5 h-5" style={{ color: selected ? '#00B894' : 'rgba(255,255,255,0.4)' }} strokeWidth={2} />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                    {pm.label}
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40">
                    {pm.sublabel}
                  </p>
                </div>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: selected ? '#00B894' : 'transparent',
                    border: selected ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
                  }}
                >
                  {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
              </button>

              {/* Kreditkarten-Form — nur wenn Kreditkarte ausgewählt */}
              {isCredit && selected && (
                <div
                  className="px-4 pb-4 pt-1 space-y-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="pt-3">
                    <Input
                      label="Karteninhaber"
                      value={cardData.holder}
                      onChange={(v) => setCardData((d) => ({ ...d, holder: v }))}
                      placeholder="Max Mustermann"
                    />
                  </div>
                  <Input
                    label="Kartennummer"
                    value={cardData.number}
                    onChange={(v) => setCardData((d) => ({ ...d, number: formatCardNumber(v) }))}
                    placeholder="1234 5678 9012 3456"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Ablauf (MM/YY)"
                      value={cardData.expiry}
                      onChange={(v) => setCardData((d) => ({ ...d, expiry: formatExpiry(v) }))}
                      placeholder="12/27"
                    />
                    <Input
                      label="CVC"
                      value={cardData.cvc}
                      onChange={(v) => setCardData((d) => ({ ...d, cvc: formatCvc(v) }))}
                      placeholder="123"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  const renderStep4 = () => {
    const pm = PAYMENT_METHODS.find((p) => p.id === paymentMethod);
    return (
      <>
        <h2 className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-white mb-1">
          Bestellung prüfen
        </h2>
        <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 mb-6">
          Alles korrekt? Dann kostenpflichtig bestellen.
        </p>

        <div
          className="rounded-2xl p-4 mb-3"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wide mb-3">
            Bestellung
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/70">
              {purchaseQty} × Extra-Stunde (45min)
            </span>
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white">
              {total} €
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40">
              Inkl. 19% MwSt.
            </span>
            <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40">
              {(total * 0.19 / 1.19).toFixed(2).replace('.', ',')} €
            </span>
          </div>
          <div
            className="pt-3 mt-2 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">
              Gesamt
            </span>
            <span className="font-['Poppins:Bold',sans-serif] text-[18px] text-white">
              {total} €
            </span>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 mb-3"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wide mb-2">
            Rechnungsadresse
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/70 leading-[19px]">
            {personalData.firstName} {personalData.lastName}<br />
            {personalData.street || '—'}<br />
            {personalData.zip || '—'} {personalData.city || '—'}<br />
            {personalData.email}
          </p>
        </div>

        <div
          className="rounded-2xl p-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wide mb-2">
            Zahlungsart
          </p>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/70">
            {pm?.label}
            {paymentMethod === 'creditcard' && cardData.number && (
              <span className="text-white/40"> · •••• {cardData.number.replace(/\s/g, '').slice(-4)}</span>
            )}
          </p>
        </div>

        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 mt-4 leading-[15px] text-center">
          Mit Klick auf "Zahlungspflichtig bestellen" stimmst du unseren AGB zu.
        </p>
      </>
    );
  };

  const renderStep5Success = () => (
    <div className="flex flex-col items-center justify-center text-center pt-12">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'linear-gradient(135deg, #00B894, #009379)' }}
      >
        <Check className="w-10 h-10 text-white" strokeWidth={3} />
      </div>
      <h2 className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-white mb-2">
        Kauf erfolgreich!
      </h2>
      <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/55 max-w-[280px] mb-6 leading-[20px]">
        {purchaseQty} {purchaseQty === 1 ? 'Extra-Stunde wurde' : 'Extra-Stunden wurden'} deinem Bestand gutgeschrieben.
      </p>
      <div
        className="rounded-xl px-4 py-3 mb-8 flex items-center gap-2"
        style={{ background: 'rgba(0,184,148,0.08)', border: '1px solid rgba(0,184,148,0.2)' }}
      >
        <ShieldCheck className="w-4 h-4" style={{ color: '#00B894' }} />
        <span className="font-['Poppins:Medium',sans-serif] text-[12px]" style={{ color: '#00B894' }}>
          Neuer Bestand: {extraSessions.available} / {EXTRA_SESSION_CAP}
        </span>
      </div>
      <button
        onClick={closeWizard}
        className="w-full h-[48px] rounded-xl font-['Poppins:SemiBold',sans-serif] text-[14px] transition-all active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, #00B894, #009379)',
          color: '#ffffff',
        }}
      >
        Zur Übersicht
      </button>
    </div>
  );

  // ===== WIZARD FOOTER (nur Step 1-4) =====
  const step2Valid = personalData.firstName.trim() && personalData.lastName.trim() && personalData.email.trim() && personalData.street.trim() && personalData.zip.trim() && personalData.city.trim();
  const cardValid =
    cardData.holder.trim().length > 1 &&
    cardData.number.replace(/\s/g, '').length >= 13 &&
    /^\d{2}\/\d{2}$/.test(cardData.expiry) &&
    cardData.cvc.length >= 3;
  const step3Valid = !!paymentMethod && (paymentMethod !== 'creditcard' || cardValid);
  const canAdvance = wizardStep === 1 ? purchaseQty > 0 && purchaseQty <= maxPurchasableExtraSessions
    : wizardStep === 2 ? step2Valid
    : wizardStep === 3 ? step3Valid
    : true;

  const renderWizardFooter = () => {
    if (wizardStep === 5) return null;
    return (
      <div
        className="flex-shrink-0 px-5 pt-3 pb-safe"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(10,10,10,0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <div className="pb-3">
          {wizardStep < 4 ? (
            <button
              onClick={handleWizardNext}
              disabled={!canAdvance}
              className="w-full h-[48px] rounded-xl font-['Poppins:SemiBold',sans-serif] text-[14px] transition-all active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
              style={{
                background: canAdvance ? 'linear-gradient(135deg, #00B894, #009379)' : 'rgba(255,255,255,0.06)',
                color: canAdvance ? '#ffffff' : 'rgba(255,255,255,0.35)',
              }}
            >
              Weiter
            </button>
          ) : (
            <button
              onClick={handleConfirmPurchase}
              className="w-full h-[48px] rounded-xl font-['Poppins:SemiBold',sans-serif] text-[14px] transition-all active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #00B894, #009379)',
                color: '#ffffff',
              }}
            >
              Zahlungspflichtig bestellen · {total} €
            </button>
          )}
        </div>
      </div>
    );
  };

  // ===== RENDER =====
  const headerTitle = view === 'overview'
    ? 'Extra-Stunden'
    : wizardStep === 5 ? '' : 'Stunden kaufen';

  const headerBackHandler = view === 'overview' ? onClose : handleWizardBack;
  const headerBackDisabled = wizardStep === 5;

  return (
    <div className="size-full flex flex-col bg-[#0a0a0a] overflow-hidden overscroll-none">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-safe">
        <div className="flex items-center gap-3 h-[56px]">
          {!headerBackDisabled && (
            <button
              onClick={headerBackHandler}
              className="flex items-center gap-0.5 active:opacity-70 transition-opacity"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <ChevronLeft className="w-5 h-5 text-white/50" />
              <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50">
                {view === 'overview' ? 'Zurück' : wizardStep === 1 ? 'Abbrechen' : 'Zurück'}
              </span>
            </button>
          )}
          <div className="flex-1" />
        </div>
        {headerTitle && (
          <div className="mb-5">
            <h1 className="font-['Poppins:Bold',sans-serif] text-[22px] text-white tracking-[-0.3px]">
              {headerTitle}
            </h1>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-none px-5 pb-8">
        {view === 'overview' && renderOverview()}
        {view === 'wizard' && wizardStep < 5 && (
          <>
            <StepIndicator />
            {wizardStep === 1 && renderStep1()}
            {wizardStep === 2 && renderStep2()}
            {wizardStep === 3 && renderStep3()}
            {wizardStep === 4 && renderStep4()}
          </>
        )}
        {view === 'wizard' && wizardStep === 5 && renderStep5Success()}
      </div>

      {view === 'wizard' && renderWizardFooter()}
    </div>
  );
}
