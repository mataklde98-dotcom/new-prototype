// ===== PROFIL VERVOLLSTÄNDIGEN (7-Screen-Onboarding) =====
// Vollflächiger Overlay-Flow, der über den CompleteProfileBanner auf dem Home-Screen geöffnet wird.
// Reihenfolge: Intro → Bundesland → Schulform → Klassenstufe → Lernfortschritt-Info →
// Lernbegleiter-Gedächtnis → Fertig.
// Trennt NOTWENDIGE Verarbeitung (Kernprodukt, kein Toggle) von FREIWILLIGER (Opt-in, Default AUS).
// Schul-Daten werden via identityService persistiert; freiwillige Datenschutz-Einstellungen in
// localStorage (user-namespaced) als Prototyp-Seam für ein späteres Backend.

import React, { useEffect, useState } from 'react';
import { MapPin, GraduationCap, Layers, ClipboardCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { identityService } from '@/services/identityService';
import { getUserStorageKey } from '@/lib/auth';
import { useUser } from '@/contexts/UserContext';
import LegalScreen from '@/app/components/LegalScreen';
import {
  BRAND,
  BUNDESLAENDER,
  SCHOOL_TYPES,
  gradesForSchoolType,
  MascotAvatar,
  ChatBubble,
  OnboardingShell,
  PrimaryButton,
  ChoiceList,
  OnbHeading,
  OnbInfoItem,
  OnbCheckList,
  OnbToggleRow,
  OnbHint,
  OnbLink,
} from './OnboardingShared';

interface CompleteProfileSheetProps {
  onClose: () => void;
  onDone: () => void;
}

type Step =
  | 'intro'
  | 'bundesland'
  | 'schoolType'
  | 'grade'
  | 'lernfortschritt'
  | 'lernbegleiter'
  | 'fertig';

const FLOW: Step[] = [
  'intro',
  'bundesland',
  'schoolType',
  'grade',
  'lernfortschritt',
  'lernbegleiter',
  'fertig',
];

/** localStorage-Key für die freiwilligen Datenschutz-Einstellungen (Prototyp-Seam). */
const PRIVACY_PREFS_KEY = 'privacy_prefs';

export default function CompleteProfileSheet({ onClose, onDone }: CompleteProfileSheetProps) {
  const { accountData, setAccountData } = useUser();

  const [step, setStep] = useState<Step>('intro');
  const [bundesland, setBundesland] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [grade, setGrade] = useState('');
  const [advancing, setAdvancing] = useState(false);

  // Freiwillige Opt-in-Einstellungen — IMMER Default AUS.
  const [chatMemory, setChatMemory] = useState(false); // Screen 6: Chatverlauf berücksichtigen
  const [memories, setMemories] = useState(false); // Screen 6: Erinnerungen

  const [showDatenschutz, setShowDatenschutz] = useState(false);

  const idx = FLOW.indexOf(step);
  const progress = { current: idx, total: FLOW.length };

  const goBack = () => {
    if (idx > 0) setStep(FLOW[idx - 1]);
    else onClose(); // erster Schritt (Intro) → Overlay schließen (weicher Prompt, kein Zwang)
  };

  const go = (next: Step) => setStep(next);

  // Auto-Advance: Auswahl kurz hervorheben, dann automatisch zum nächsten Schritt (kein „Weiter").
  const pickAndGo = (apply: () => void, next: () => void) => {
    if (advancing) return;
    apply();
    setAdvancing(true);
    setTimeout(() => { setAdvancing(false); next(); }, 200);
  };

  // Schul-Daten früh persistieren (beim Verlassen der Klassenstufe), damit das Profil robust als
  // vollständig zählt — selbst wenn der Nutzer die nachfolgenden Datenschutz-Screens abbricht.
  const saveSchoolData = () => {
    void identityService.setSchoolData({ bundesland, schoolType, grade });
    setAccountData({ ...accountData, bundesland, schoolType, grade });
  };

  // Abschluss: freiwillige Einstellungen sichern und Overlay schließen → Home.
  const finish = () => {
    try {
      localStorage.setItem(
        getUserStorageKey(PRIVACY_PREFS_KEY),
        JSON.stringify({ chatMemory, memories }),
      );
    } catch {
      /* localStorage nicht verfügbar → still ignorieren (Prototyp) */
    }
    onDone();
  };

  // Konfetti auf dem Erfolgs-Screen (einmalig beim Mount dieses Schritts).
  useEffect(() => {
    if (step !== 'fertig') return;
    const fire = (particleRatio: number, opts: confetti.Options) =>
      confetti({
        origin: { y: 0.35 },
        colors: [BRAND.primary, BRAND.primaryLight, '#ffffff'],
        disableForReducedMotion: true,
        zIndex: 10000,
        particleCount: Math.floor(180 * particleRatio),
        ...opts,
      });
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, [step]);

  // ===== SCREEN 1: INTRO =====
  if (step === 'intro') {
    return (
      <OnboardingShell
        stepKey={step}
        onBack={goBack}
        progress={progress}
        footer={<PrimaryButton onClick={() => go('bundesland')}>Weiter</PrimaryButton>}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center gap-4">
            <MascotAvatar size={96} />
            <OnbHeading
              title="Lass uns SoStudy an dich anpassen"
              subtitle="Damit SoStudy dir passende Themen, Karteikarten, Übungen und Prüfungssimulationen zeigen kann, brauchen wir ein paar Angaben zu deinem Schulprofil."
            />
          </div>
          <div className="flex flex-col gap-4">
            <OnbInfoItem
              icon={<MapPin size={20} className="text-[#00B894]" strokeWidth={2} />}
              title="Dein Bundesland"
              text="Damit wir Inhalte passend zu deinem Lehrplan anzeigen können."
            />
            <OnbInfoItem
              icon={<GraduationCap size={20} className="text-[#00B894]" strokeWidth={2} />}
              title="Deine Schulform"
              text="Damit Aufgaben und Erklärungen zu deinem Schultyp passen."
            />
            <OnbInfoItem
              icon={<Layers size={20} className="text-[#00B894]" strokeWidth={2} />}
              title="Deine Klassenstufe"
              text="Damit du Inhalte auf deinem aktuellen Niveau bekommst."
            />
          </div>
          <OnbHint>Du kannst diese Angaben später in den Einstellungen ändern.</OnbHint>
        </div>
      </OnboardingShell>
    );
  }

  // ===== SCREEN 2: BUNDESLAND (unverändert) =====
  if (step === 'bundesland') {
    return (
      <OnboardingShell stepKey={step} onBack={goBack} progress={progress}>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>In welchem Bundesland gehst du zur Schule?</ChatBubble>
          </div>
          <ChoiceList options={BUNDESLAENDER} value={bundesland}
            onChange={(v) => pickAndGo(() => setBundesland(v), () => setStep('schoolType'))} columns={2} />
        </div>
      </OnboardingShell>
    );
  }

  // ===== SCREEN 3: SCHULFORM (unverändert) =====
  if (step === 'schoolType') {
    return (
      <OnboardingShell stepKey={step} onBack={goBack} progress={progress}>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>Auf welche Schule gehst du?</ChatBubble>
          </div>
          <ChoiceList options={SCHOOL_TYPES} value={schoolType}
            onChange={(v) => pickAndGo(() => { setSchoolType(v); setGrade(''); }, () => setStep('grade'))} columns={2} />
        </div>
      </OnboardingShell>
    );
  }

  // ===== SCREEN 4: KLASSENSTUFE (unverändert; danach → Lernfortschritt-Info) =====
  if (step === 'grade') {
    return (
      <OnboardingShell stepKey={step} onBack={goBack} progress={progress}>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MascotAvatar size={56} />
            <ChatBubble>In welcher Klasse bist du?</ChatBubble>
          </div>
          <ChoiceList
            options={gradesForSchoolType(schoolType)}
            value={grade}
            onChange={(v) => pickAndGo(() => setGrade(v), () => { saveSchoolData(); setStep('lernfortschritt'); })}
            columns={schoolType === 'Berufsschule' ? 1 : 3}
          />
        </div>
      </OnboardingShell>
    );
  }

  // ===== SCREEN 5: LERNFORTSCHRITT-INFO (reine Info, kein Toggle) =====
  if (step === 'lernfortschritt') {
    return (
      <OnboardingShell
        stepKey={step}
        onBack={goBack}
        progress={progress}
        footer={<PrimaryButton onClick={() => go('lernbegleiter')}>Verstanden &amp; weiter</PrimaryButton>}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div
              className="w-16 h-16 flex items-center justify-center rounded-3xl"
              style={{ background: 'rgba(0,147,121,0.16)', border: '1px solid rgba(0,147,121,0.30)' }}
            >
              <ClipboardCheck size={30} className="text-[#00B894]" strokeWidth={2} />
            </div>
            <OnbHeading
              title="SoStudy merkt sich deinen Lernfortschritt"
              subtitle="Damit du nicht jedes Mal von vorne anfängst, speichert SoStudy deinen Fortschritt und deine Aktivitäten."
            />
          </div>
          <OnbCheckList
            items={[
              'Auch deine Fehler bringen dich weiter – SoStudy erkennt daraus, was du nochmal üben solltest',
              'Sieh in jedem Fach klar, wo du stehst – deine Stärken und Schwächen auf einen Blick',
              'Geh vorbereitet in deine Klassenarbeit – SoStudy zeigt dir, was schon sitzt und woran du noch arbeiten musst',
              'Übungen, die zu dir passen – statt Standardstoff für alle',
              'Weitermachen, wo du aufgehört hast – kein Neuanfang bei jeder Sitzung',
            ]}
          />
          <div className="flex flex-col gap-2">
            <OnbHint>Diese Verarbeitung ist notwendig, damit SoStudy als Lernapp funktioniert.</OnbHint>
            <OnbLink onClick={() => setShowDatenschutz(true)}>Mehr dazu in der Datenschutzerklärung</OnbLink>
          </div>
        </div>
        {showDatenschutz && (
          <LegalScreen type="datenschutz" onClose={() => setShowDatenschutz(false)} />
        )}
      </OnboardingShell>
    );
  }

  // ===== SCREEN 6: LERNBEGLEITER-GEDÄCHTNIS (optional, Default AUS) =====
  if (step === 'lernbegleiter') {
    return (
      <OnboardingShell
        stepKey={step}
        onBack={goBack}
        progress={progress}
        footer={<PrimaryButton onClick={() => go('fertig')}>Auswahl speichern</PrimaryButton>}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center gap-4">
            <MascotAvatar size={96} />
            <OnbHeading title="Bekomme passendere Hilfe statt allgemeiner Antworten" />
          </div>
          <div className="flex flex-col gap-3">
            <OnbToggleRow
              title="Chatverlauf berücksichtigen"
              text="Dein Lernbegleiter knüpft an eure letzten Gespräche an, statt jedes Mal neu zu beginnen."
              checked={chatMemory}
              onChange={setChatMemory}
            />
            <OnbToggleRow
              title="Erinnerungen"
              text="Dein Lernbegleiter merkt sich, was du kannst und wobei du Hilfe brauchst. Du entscheidest, was gespeichert bleibt."
              checked={memories}
              onChange={setMemories}
            />
          </div>
          <OnbHint>
            Du kannst diese Einstellungen jederzeit unter „Lernbegleiter-Einstellungen → Privatsphäre &amp; Verhalten" ändern.
          </OnbHint>
        </div>
      </OnboardingShell>
    );
  }

  // ===== SCREEN 7: FERTIG / LOSLEGEN =====
  return (
    <OnboardingShell
      stepKey={step}
      onBack={goBack}
      progress={progress}
      footer={<PrimaryButton onClick={finish}>Loslegen</PrimaryButton>}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-4">
          <MascotAvatar size={96} />
          <OnbHeading
            title="Dein Lernprofil ist fertig"
            subtitle="SoStudy ist jetzt auf dein Bundesland, deine Schulform und deine Klassenstufe eingestellt."
          />
        </div>
        <OnbCheckList
          items={[
            'Passende Themen',
            'Karteikarten auf deinem Niveau',
            'Lernempfehlungen nach deinem Fortschritt',
            'Streaks und Belohnungen',
          ]}
        />
        <OnbHint>Du kannst dein Profil und deine Datenschutz-Einstellungen jederzeit ändern.</OnbHint>
      </div>
    </OnboardingShell>
  );
}
