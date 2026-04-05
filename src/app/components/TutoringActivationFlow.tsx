// ===== TUTORING ACTIVATION FLOW =====
// Multi-step onboarding for activating the tutoring service.
// Rendered as a full-screen overlay via MobileRouteTransition / ContentRouter.
//
// Steps:
//   1. Tutoring Type (Online / Local)
//   2. Partner Search (only for Local)
//   3. Subject Selection
//   4. Confirmation / Send Request

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Globe, MapPin, Search, Check, CheckCircle2,
  Phone, Mail, BookOpen, GraduationCap, ChevronRight, Star, Clock,
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import type { TutoringRequestData } from '@/contexts/UserContext';
import {
  MOCK_PARTNERS,
  ONLINE_PARTNER,
  ALL_SUBJECTS,
} from '@/mocks/tutoringPartners.mock';
import type { TutoringPartner } from '@/mocks/tutoringPartners.mock';
import Button from './Button';

// ===================================================================
// TYPES
// ===================================================================
type FlowStep = 'type' | 'partner' | 'subjects' | 'confirm';

interface TutoringActivationFlowProps {
  onClose: () => void;
  externalTransition?: boolean;
}

// ===================================================================
// SUB-COMPONENTS
// ===================================================================

/** Back button */
const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 mb-5 text-white/50 active:text-white/80 transition-colors"
  >
    <ArrowLeft className="w-5 h-5" />
    <span className="font-['Poppins:Medium',sans-serif] text-[14px]">Zurück</span>
  </button>
);

/** Step header */
const StepHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-6">
    <h2 className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-white mb-1.5">
      {title}
    </h2>
    <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/50 leading-relaxed">
      {subtitle}
    </p>
  </div>
);

/** Selection card (reused for type + partner) */
const SelectionCard = ({
  icon,
  title,
  description,
  isSelected,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  badge?: string;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left px-5 py-4 rounded-2xl transition-all duration-200 active:scale-[0.98]"
    style={{
      background: isSelected
        ? 'linear-gradient(135deg, rgba(0,184,148,0.12), rgba(0,147,121,0.08))'
        : 'rgba(255,255,255,0.04)',
      border: isSelected
        ? '1px solid rgba(0,184,148,0.35)'
        : '1px solid rgba(255,255,255,0.08)',
    }}
  >
    <div className="relative z-10 flex items-start gap-4">
      <div
        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: isSelected
            ? 'linear-gradient(135deg, #00B894, #009379)'
            : 'rgba(255,255,255,0.06)',
          border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3
            className="font-['Poppins:SemiBold',sans-serif] text-[15px]"
            style={{ color: isSelected ? 'white' : 'rgba(255,255,255,0.85)' }}
          >
            {title}
          </h3>
          {badge && (
            <span
              className="px-2 py-0.5 rounded-full font-['Poppins:Medium',sans-serif] text-[10px]"
              style={{ background: 'rgba(0,184,148,0.15)', color: '#00B894' }}
            >
              {badge}
            </span>
          )}
        </div>
        <p
          className="font-['Poppins:Regular',sans-serif] text-[13px] leading-relaxed mt-0.5"
          style={{ color: isSelected ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)' }}
        >
          {description}
        </p>
      </div>
      <div
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
        style={{
          border: isSelected ? '2px solid #00B894' : '2px solid rgba(255,255,255,0.15)',
          background: 'transparent',
        }}
      >
        {isSelected && (
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00B894' }} />
        )}
      </div>
    </div>
  </button>
);

/** Step progress indicator */
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex items-center gap-2 mb-6">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div
        key={i}
        className="h-1 rounded-full flex-1 transition-all duration-300"
        style={{
          background:
            i < currentStep
              ? '#00B894'
              : i === currentStep
              ? 'rgba(0,184,148,0.5)'
              : 'rgba(255,255,255,0.08)',
        }}
      />
    ))}
  </div>
);

// ===================================================================
// MAIN COMPONENT
// ===================================================================
export default function TutoringActivationFlow({
  onClose,
  externalTransition,
}: TutoringActivationFlowProps) {
  const { setTutoringStatus, setTutoringRequestData } = useUser();

  // Flow state
  const [step, setStep] = useState<FlowStep>('type');
  const [tutoringType, setTutoringType] = useState<'online' | 'local' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<TutoringPartner | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Derive total steps based on type
  const isLocal = tutoringType === 'local';
  const totalSteps = isLocal ? 4 : 3;

  const currentStepIndex = (() => {
    if (step === 'type') return 0;
    if (step === 'partner') return 1;
    if (step === 'subjects') return isLocal ? 2 : 1;
    if (step === 'confirm') return isLocal ? 3 : 2;
    return 0;
  })();

  // Filter partners by search
  const filteredPartners = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_PARTNERS;
    const q = searchQuery.toLowerCase();
    return MOCK_PARTNERS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // The effective partner (for online = ONLINE_PARTNER)
  const effectivePartner = tutoringType === 'online' ? ONLINE_PARTNER : selectedPartner;

  // Navigation
  const goNext = () => {
    if (step === 'type') {
      if (tutoringType === 'local') {
        setStep('partner');
      } else {
        setStep('subjects');
      }
    } else if (step === 'partner') {
      setStep('subjects');
    } else if (step === 'subjects') {
      setStep('confirm');
    }
  };

  const goBack = () => {
    if (step === 'confirm') {
      setStep('subjects');
    } else if (step === 'subjects') {
      if (isLocal) {
        setStep('partner');
      } else {
        setStep('type');
      }
    } else if (step === 'partner') {
      setStep('type');
    } else {
      onClose();
    }
  };

  // Submit request
  const handleSubmit = () => {
    if (!tutoringType || !effectivePartner) return;

    const requestData: TutoringRequestData = {
      tutoringType,
      selectedPartner: {
        id: effectivePartner.id,
        name: effectivePartner.name,
        phone: effectivePartner.phone,
        email: effectivePartner.email,
        city: effectivePartner.city,
        openingHours: effectivePartner.openingHours,
      },
      selectedSubjects,
      requestDate: new Date().toISOString(),
    };

    setTutoringRequestData(requestData);
    setTutoringStatus('requestSent');
    setIsSubmitted(true);
  };

  // Toggle subject selection
  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  // ===================================================================
  // STEP 1: Tutoring Type
  // ===================================================================
  const renderTypeStep = () => (
    <>
      <BackButton onClick={onClose} />
      <StepIndicator currentStep={0} totalSteps={totalSteps} />
      <StepHeader
        title="Nachhilfe aktivieren"
        subtitle="Wähle die Art der Nachhilfe, die am besten zu dir passt."
      />

      <div className="space-y-3 mb-6">
        <SelectionCard
          icon={<Globe className="w-6 h-6 text-white" />}
          title="Online-Nachhilfe"
          description="Flexibel von zu Hause lernen mit persönlichem Tutor per Video-Call."
          isSelected={tutoringType === 'online'}
          onClick={() => setTutoringType('online')}
        />
        <SelectionCard
          icon={<MapPin className="w-6 h-6 text-white" />}
          title="Lokale Nachhilfe"
          description="Persönliche Nachhilfe bei einem Partner-Institut in deiner Nähe."
          isSelected={tutoringType === 'local'}
          onClick={() => setTutoringType('local')}
        />
      </div>

      <Button onClick={goNext} disabled={!tutoringType}>Weiter</Button>
    </>
  );

  // ===================================================================
  // STEP 3: Subject Selection
  // ===================================================================
  const renderSubjectsStep = () => (
    <>
      <BackButton onClick={goBack} />
      <StepIndicator currentStep={isLocal ? 2 : 1} totalSteps={totalSteps} />
      <StepHeader
        title="Fächer auswählen"
        subtitle="In welchen Fächern brauchst du Nachhilfe?"
      />

      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {ALL_SUBJECTS.map((subject) => {
          const isSelected = selectedSubjects.includes(subject);
          return (
            <button
              key={subject}
              onClick={() => toggleSubject(subject)}
              className="px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.97] flex items-center gap-2.5"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(0,184,148,0.15), rgba(0,147,121,0.10))'
                  : 'rgba(255,255,255,0.04)',
                border: isSelected
                  ? '1px solid rgba(0,184,148,0.35)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{
                  background: isSelected ? '#00B894' : 'transparent',
                  border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
                }}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span
                className="font-['Poppins:Medium',sans-serif] text-[13px] truncate"
                style={{ color: isSelected ? 'white' : 'rgba(255,255,255,0.6)' }}
              >
                {subject}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        onClick={goNext}
        disabled={selectedSubjects.length === 0}
      >
        Weiter
      </Button>
    </>
  );

  // ===================================================================
  // STEP 4: Confirmation / Send Request
  // ===================================================================
  const renderConfirmStep = () => {
    if (isSubmitted) {
      // Success state
      return (
        <>
          <div className="flex flex-col items-center justify-center py-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'rgba(0,184,148,0.12)' }}
            >
              <CheckCircle2 className="w-10 h-10" style={{ color: '#00B894' }} />
            </div>
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-white mb-2 text-center">
              Anfrage gesendet!
            </h2>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/50 text-center leading-relaxed max-w-[300px] mb-8">
              Dein Nachhilfe-Institut wird sich in Kürze per Telefon bei dir melden.
            </p>

            {/* Contact details */}
            {effectivePartner && (
              <div
                className="w-full rounded-2xl px-5 py-4 mb-6"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <h4 className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/60 uppercase tracking-wider mb-3">
                  Kontakt
                </h4>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white mb-3">
                  {effectivePartner.name}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-white/40" />
                    <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/60">
                      {effectivePartner.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-white/40" />
                    <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/60">
                      {effectivePartner.email}
                    </span>
                  </div>
                  {effectivePartner.openingHours && effectivePartner.openingHours.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col">
                        {effectivePartner.openingHours.map((line, i) => (
                          <span key={i} className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/60 leading-[20px]">
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Button onClick={onClose}>Verstanden</Button>
        </>
      );
    }

    // Pre-submit summary
    return (
      <>
        <BackButton onClick={goBack} />
        <StepIndicator currentStep={isLocal ? 3 : 2} totalSteps={totalSteps} />
        <StepHeader
          title="Anfrage senden"
          subtitle="Deine Anfrage ist unverbindlich und kostenlos, prüfe kurz deine Angaben und schick sie ab."
        />

        {/* Summary */}
        <div
          className="rounded-2xl px-5 py-4 mb-4"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Type */}
          <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {tutoringType === 'online' ? (
              <Globe className="w-5 h-5 text-white/50" />
            ) : (
              <MapPin className="w-5 h-5 text-white/50" />
            )}
            <div>
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 uppercase tracking-wider">
                Art
              </p>
              <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white">
                {tutoringType === 'online' ? 'Online-Nachhilfe' : 'Lokale Nachhilfe'}
              </p>
            </div>
          </div>

          {/* Partner */}
          {effectivePartner && (
            <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <GraduationCap className="w-5 h-5 text-white/50" />
              <div>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 uppercase tracking-wider">
                  Institut
                </p>
                <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white">
                  {effectivePartner.name}
                </p>
                {effectivePartner.address && (
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 mt-0.5">
                    {effectivePartner.address}, {effectivePartner.city}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Subjects */}
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-white/50 mt-0.5" />
            <div>
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 uppercase tracking-wider mb-1.5">
                Fächer
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedSubjects.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg font-['Poppins:Medium',sans-serif] text-[12px]"
                    style={{
                      background: 'rgba(0,184,148,0.12)',
                      color: '#00B894',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact info hint */}
        {effectivePartner && (
          <div
            className="flex items-start gap-2.5 mb-6 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
          >
            <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(96,165,250,0.8)' }} />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] leading-relaxed" style={{ color: 'rgba(96,165,250,0.7)' }}>
              Deine Anfrage wird an {effectivePartner.name} weitergeleitet. {tutoringType === 'local' ? 'Sie melden sich telefonisch bei dir, um alles Weitere zu besprechen.' : 'Wir melden uns telefonisch bei dir, um alles Weitere zu besprechen.'}
            </p>
          </div>
        )}

        <Button onClick={handleSubmit}>Anfrage senden</Button>
      </>
    );
  };

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <div
      className="size-full flex flex-col overflow-hidden overscroll-none"
      style={{ background: '#0a0a0a' }}
    >
      {step === 'partner' ? (
        /* Partner step: fixed layout with scrollable list in the middle */
        <div className="flex-1 flex flex-col min-h-0 px-6 pt-8">
          <div className="max-w-md mx-auto w-full flex flex-col flex-1 min-h-0">
            <BackButton onClick={goBack} />
            <StepIndicator currentStep={1} totalSteps={totalSteps} />
            <StepHeader
              title="Partner-Institut finden"
              subtitle="Suche nach Nachhilfe-Partnern in deiner Stadt."
            />

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Stadt, PLZ oder Straße eingeben..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-12 py-3.5 text-white font-['Poppins:Regular',sans-serif] placeholder:text-white/30 outline-none focus:border-[#009379] transition-colors"
              />
            </div>

            {/* Partner list – scrollable, fills remaining space */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-1 space-y-3">
              {filteredPartners.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/40">
                    Keine Partner in dieser Region gefunden.
                  </p>
                </div>
              ) : (
                filteredPartners.map((partner) => (
                  <button
                    key={partner.id}
                    onClick={() => setSelectedPartner(partner)}
                    className="w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98]"
                    style={{
                      background:
                        selectedPartner?.id === partner.id
                          ? 'linear-gradient(135deg, rgba(0,184,148,0.12), rgba(0,147,121,0.08))'
                          : 'rgba(255,255,255,0.04)',
                      border:
                        selectedPartner?.id === partner.id
                          ? '1px solid rgba(0,184,148,0.35)'
                          : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                        {partner.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-white/30" />
                      <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40">
                        {partner.city}
                      </span>
                    </div>
                    {partner.address && (
                      <div className="flex items-center gap-1.5 mb-1 ml-5">
                        <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/30">
                          {partner.address}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mb-1">
                      <Phone className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                      <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/30">
                        {partner.phone}
                      </span>
                    </div>
                    {partner.openingHours && partner.openingHours.length > 0 && (
                      <div className="flex items-start gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-white/30 mt-px flex-shrink-0" />
                        <div className="flex flex-col">
                          {partner.openingHours.map((line, i) => (
                            <span key={i} className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/30 leading-[17px]">
                              {line}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* description removed - address is enough */}
                  </button>
                ))
              )}
            </div>

            {/* Fixed bottom button */}
            <div className="py-4 pb-8">
              <Button onClick={goNext} disabled={!selectedPartner}>Weiter</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-8 min-h-0">
          <div className="max-w-md mx-auto flex flex-col" style={{ minHeight: '100%' }}>
            {step === 'type' && renderTypeStep()}
            {step === 'subjects' && renderSubjectsStep()}
            {step === 'confirm' && renderConfirmStep()}
          </div>
        </div>
      )}
    </div>
  );
}