// ===== LEGAL SCREEN =====
// AGB, Impressum, Datenschutzerklärung – Prototyp-Inhalte
// Premium SaaS Style (Linear/Vercel) – GPU-Slide-Animation via Portal

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Scale, Building2, Shield } from 'lucide-react';
import CloseButton from '@/app/components/CloseButton';
import DesktopPageHeader from '@/app/components/DesktopPageHeader';
import './LegalScreen.css';

type LegalType = 'agb' | 'impressum' | 'datenschutz';

interface LegalScreenProps {
  type: LegalType;
  onClose: () => void;
  /** When true, skip portal + own animation (desktop inline mode) */
  externalTransition?: boolean;
}

const LEGAL_CONFIG: Record<LegalType, { title: string; icon: React.ReactNode }> = {
  agb: {
    title: 'AGB',
    icon: <Scale className="w-5 h-5 text-white/50" strokeWidth={2} />,
  },
  impressum: {
    title: 'Impressum',
    icon: <Building2 className="w-5 h-5 text-white/50" strokeWidth={2} />,
  },
  datenschutz: {
    title: 'Datenschutzerklärung',
    icon: <Shield className="w-5 h-5 text-white/50" strokeWidth={2} />,
  },
};

// ===== EXAMPLE CONTENT =====

function AGBContent() {
  return (
    <div className="space-y-6">
      <SectionBlock title="1. Geltungsbereich">
        Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Nutzer der SoStudy-App und
        der zugehörigen Webplattform. Mit der Registrierung und Nutzung des Dienstes erklärt sich
        der Nutzer mit diesen AGB einverstanden.
      </SectionBlock>

      <SectionBlock title="2. Leistungsbeschreibung">
        SoStudy bietet eine KI-gestützte Lernplattform für Schülerinnen und Schüler. Der Dienst
        umfasst personalisierte Lernpläne, KI-basierte Übungsaufgaben, Klassenarbeitsvorbereitung
        sowie optionale Nachhilfevermittlung. Die verfügbaren Funktionen können je nach gewähltem
        Tarif variieren.
      </SectionBlock>

      <SectionBlock title="3. Registrierung und Nutzerkonto">
        Für die Nutzung von SoStudy ist eine Registrierung erforderlich. Der Nutzer verpflichtet sich,
        wahrheitsgemäße Angaben zu machen und seine Zugangsdaten vertraulich zu behandeln. Minderjährige
        benötigen die Einwilligung eines Erziehungsberechtigten.
      </SectionBlock>

      <SectionBlock title="4. Vertragsschluss und Laufzeit">
        Der Vertrag kommt mit der erfolgreichen Registrierung zustande. Kostenpflichtige Abonnements
        verlängern sich automatisch um den jeweiligen Abrechnungszeitraum, sofern sie nicht rechtzeitig
        gekündigt werden. Die Kündigung erfolgt über die jeweilige Plattform (App Store / Google Play).
      </SectionBlock>

      <SectionBlock title="5. Preise und Zahlung">
        Die aktuellen Preise sind in der App und auf der Website einsehbar. Die Abrechnung erfolgt
        über den jeweiligen App Store (Apple App Store oder Google Play Store). Alle Preise verstehen
        sich inklusive der gesetzlichen Mehrwertsteuer.
      </SectionBlock>

      <SectionBlock title="6. Nutzungsrechte und -pflichten">
        Der Nutzer erhält ein einfaches, nicht übertragbares Nutzungsrecht an der Software. Es ist
        untersagt, Inhalte der Plattform ohne Genehmigung zu vervielfältigen, zu verändern oder
        weiterzuverbreiten. Der Nutzer verpflichtet sich, die Plattform nicht missbräuchlich zu nutzen.
      </SectionBlock>

      <SectionBlock title="7. Haftung">
        SoStudy haftet nicht für die inhaltliche Richtigkeit der KI-generierten Lerninhalte. Eine
        Haftung für Schäden besteht nur bei Vorsatz und grober Fahrlässigkeit. Die Haftung für
        leichte Fahrlässigkeit ist auf vorhersehbare, vertragstypische Schäden begrenzt.
      </SectionBlock>

      <SectionBlock title="8. Widerrufsrecht">
        Verbraucher haben das Recht, binnen 14 Tagen ohne Angabe von Gründen den Vertrag zu widerrufen.
        Die Widerrufsfrist beginnt mit dem Tag des Vertragsschlusses. Bei In-App-Käufen gelten die
        Widerrufsrichtlinien des jeweiligen App Stores.
      </SectionBlock>

      <SectionBlock title="9. Schlussbestimmungen">
        Es gilt das Recht der Bundesrepublik Deutschland. Sollten einzelne Bestimmungen dieser AGB
        unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Gerichtsstand
        ist, soweit gesetzlich zulässig, der Sitz des Unternehmens.
      </SectionBlock>

      <LastUpdated date="01. März 2026" />
    </div>
  );
}

function ImpressumContent() {
  return (
    <div className="space-y-6">
      <SectionBlock title="Angaben gemäß § 5 TMG">
        <div className="space-y-1">
          <p>SoStudy GmbH</p>
          <p>Musterstraße 42</p>
          <p>10115 Berlin</p>
          <p>Deutschland</p>
        </div>
      </SectionBlock>

      <SectionBlock title="Vertreten durch">
        <p>Geschäftsführer: Max Mustermann</p>
      </SectionBlock>

      <SectionBlock title="Kontakt">
        <div className="space-y-1">
          <p>Telefon: +49 (0) 30 123456789</p>
          <p>E-Mail: kontakt@sostudy.app</p>
          <p>Website: www.sostudy.app</p>
        </div>
      </SectionBlock>

      <SectionBlock title="Registereintrag">
        <div className="space-y-1">
          <p>Eintragung im Handelsregister</p>
          <p>Registergericht: Amtsgericht Berlin-Charlottenburg</p>
          <p>Registernummer: HRB 123456</p>
        </div>
      </SectionBlock>

      <SectionBlock title="Umsatzsteuer-ID">
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
          DE 123456789
        </p>
      </SectionBlock>

      <SectionBlock title="Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV">
        <div className="space-y-1">
          <p>Max Mustermann</p>
          <p>Musterstraße 42</p>
          <p>10115 Berlin</p>
        </div>
      </SectionBlock>

      <SectionBlock title="Streitschlichtung">
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
        https://ec.europa.eu/consumers/odr/. Unsere E-Mail-Adresse finden Sie oben im Impressum.
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </SectionBlock>

      <LastUpdated date="01. März 2026" />
    </div>
  );
}

function DatenschutzContent() {
  return (
    <div className="space-y-6">
      <SectionBlock title="1. Datenschutz auf einen Blick">
        <h4 className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/80 mb-1">Allgemeine Hinweise</h4>
        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen
        Daten passiert, wenn Sie unsere App nutzen. Personenbezogene Daten sind alle Daten, mit denen
        Sie persönlich identifiziert werden können.
      </SectionBlock>

      <SectionBlock title="2. Verantwortliche Stelle">
        <div className="space-y-1">
          <p>SoStudy GmbH</p>
          <p>Musterstraße 42</p>
          <p>10115 Berlin</p>
          <p>E-Mail: datenschutz@sostudy.app</p>
        </div>
      </SectionBlock>

      <SectionBlock title="3. Datenerfassung in unserer App">
        <h4 className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/80 mb-1">Welche Daten werden erfasst?</h4>
        <p className="mb-3">
          Wir erfassen Daten, die Sie uns aktiv mitteilen (z.B. bei der Registrierung: Name, E-Mail,
          Schule, Klassenstufe) sowie automatisch erhobene technische Daten (z.B. Gerätetyp,
          Betriebssystem, App-Version).
        </p>
        <h4 className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/80 mb-1">Wofür nutzen wir Ihre Daten?</h4>
        <p>
          Die Daten werden genutzt, um personalisierte Lerninhalte bereitzustellen, den Lernfortschritt
          zu analysieren und die App kontinuierlich zu verbessern.
        </p>
      </SectionBlock>

      <SectionBlock title="4. KI-Verarbeitung">
        SoStudy verwendet künstliche Intelligenz zur Erstellung personalisierter Lerninhalte. Dabei
        werden Ihre Lernfortschrittsdaten anonymisiert verarbeitet. Eine Weitergabe an Dritte
        zu Werbezwecken findet nicht statt.
      </SectionBlock>

      <SectionBlock title="5. Hosting und Content Delivery">
        Unsere App nutzt Dienste von Supabase (Hosting und Datenbank) sowie Cloudflare (CDN).
        Server befinden sich in der EU. Es gelten die Datenschutzbestimmungen der jeweiligen Anbieter.
      </SectionBlock>

      <SectionBlock title="6. Ihre Rechte">
        <p className="mb-2">Sie haben jederzeit das Recht auf:</p>
        <ul className="list-disc list-inside space-y-1.5 text-white/50">
          <li>Auskunft über Ihre gespeicherten Daten</li>
          <li>Berichtigung unrichtiger Daten</li>
          <li>Löschung Ihrer Daten</li>
          <li>Einschränkung der Verarbeitung</li>
          <li>Datenübertragbarkeit</li>
          <li>Widerspruch gegen die Verarbeitung</li>
        </ul>
      </SectionBlock>

      <SectionBlock title="7. Cookies und Tracking">
        Die SoStudy-App verwendet keine Tracking-Cookies. Für die Funktionalität notwendige
        Session-Daten werden lokal auf Ihrem Gerät gespeichert und nicht an Dritte weitergegeben.
      </SectionBlock>

      <SectionBlock title="8. Datensicherheit">
        Wir verwenden SSL/TLS-Verschlüsselung für alle Datenübertragungen. Ihre Passwörter
        werden ausschließlich als kryptografische Hashes gespeichert. Regelmäßige Sicherheitsaudits
        gewährleisten den Schutz Ihrer Daten.
      </SectionBlock>

      <SectionBlock title="9. Änderungen dieser Datenschutzerklärung">
        Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen
        oder bei Änderungen des Dienstes anzupassen. Die aktuelle Version finden Sie stets in der App.
      </SectionBlock>

      <LastUpdated date="01. März 2026" />
    </div>
  );
}

// ===== SHARED UI COMPONENTS =====

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
      <h3 className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white mb-3">
        {title}
      </h3>
      <div className="font-['Poppins:Regular',sans-serif] text-[13.5px] text-white/50 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function LastUpdated({ date }: { date: string }) {
  return (
    <div className="pt-2 pb-4">
      <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#707070] text-center">
        Zuletzt aktualisiert: {date}
      </p>
    </div>
  );
}

// ===== MAIN COMPONENT =====

export default function LegalScreen({ type, onClose, externalTransition = false }: LegalScreenProps) {
  const [animationState, setAnimationState] = useState<'entering' | 'active' | 'exiting'>('entering');
  const config = LEGAL_CONFIG[type];

  // Animation entering → active
  useEffect(() => {
    if (externalTransition) return;
    const timer = setTimeout(() => setAnimationState('active'), 300);
    return () => clearTimeout(timer);
  }, [externalTransition]);

  // Lock body scroll (mobile portal mode)
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
    setTimeout(() => onClose(), 300);
  }, [onClose, externalTransition]);

  const animationClass =
    animationState === 'entering' ? 'legal-entering' :
    animationState === 'exiting' ? 'legal-exiting' :
    'legal-active';

  const ContentComponent = type === 'agb' ? AGBContent
    : type === 'impressum' ? ImpressumContent
    : DatenschutzContent;

  const screenContent = (
    <div
      className={externalTransition
        ? 'flex-1 min-h-0 w-full bg-[#0a0a0a] overflow-y-auto overflow-x-hidden'
        : `legal-screen ${animationClass}`}
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
                  {config.icon}
                  <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white">
                    {config.title}
                  </h1>
                </div>
                <CloseButton onClick={handleClose} />
              </div>
            </div>
            <div className="border-b border-white/[0.08] mt-3" />
          </div>
        </>
      )}

      {/* Desktop Header */}
      {externalTransition && (
        <DesktopPageHeader
          title={config.title}
          onBack={handleClose}
          backLabel="Profil"
        />
      )}

      {/* Content */}
      <div className={`px-5 pb-32 space-y-4 ${externalTransition ? '' : 'pt-[100px]'}`}>
        <ContentComponent />
      </div>
    </div>
  );

  // Portal mode for mobile, inline for desktop
  if (externalTransition) {
    return screenContent;
  }

  return ReactDOM.createPortal(screenContent, document.body);
}
