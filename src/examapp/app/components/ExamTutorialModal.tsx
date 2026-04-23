import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '@/app/components/Button';
import CloseButton from '@/app/components/CloseButton';

type ExamTutorialModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ExamTutorialModal({ isOpen, onClose }: ExamTutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when step changes
  useEffect(() => {
    if (contentRef.current) {
      // Immediate scroll reset before animation
      contentRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  const tutorialSteps = [
    // STEP 0: Willkommen
    {
      title: 'Willkommen zum Tutorial',
      subtitle: 'Lerne wie die Prüfungssimulation funktioniert',
      content: (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#009379] to-[#00705C] flex items-center justify-center mb-6">
            <svg className="w-[60px] h-[60px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-[#b3b3b3] text-center leading-relaxed px-4">
            In den nächsten Schritten erklären wir dir, wie du deine Prüfung optimal einrichten und auch verstehen kannst.
          </p>
        </div>
      )
    },
    // STEP 1: Ein Thema pro Prüfung (KRITISCHE REGEL!)
    {
      title: 'Ein Thema pro Prüfung',
      subtitle: 'Für bessere Übersicht und gezielteres Lernen',
      content: (
        <div className="flex flex-col py-4">
          {/* Main explanation */}
          <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.12] rounded-[12px] p-5 mb-5">
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#e3e3e3] text-center leading-relaxed">
              Pro Prüfung kannst du nur <span className="font-['Poppins:SemiBold',sans-serif] text-[#009379]">ein Thema</span> und dessen Unterthemen auswählen.
            </p>
          </div>

          {/* Visual example */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Allowed */}
            <div className="bg-gradient-to-br from-[#009379]/10 to-[#009379]/5 border-2 border-[#009379] rounded-[12px] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-[24px] h-[24px] rounded-full bg-[#009379] flex items-center justify-center flex-shrink-0">
                  <svg className="w-[14px] h-[14px]" fill="white" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-['Poppins:Bold',sans-serif] text-[13px] text-[#009379]">
                  Möglich
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="bg-[#009379]/20 rounded-[6px] px-2 py-1.5">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white">Thema: Algebra</p>
                </div>
                <div className="pl-2 space-y-1">
                  <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#b3b3b3]">→ Gleichungen</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#b3b3b3]">→ Funktionen</p>
                </div>
              </div>
            </div>

            {/* Not allowed */}
            <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-2 border-[#e74c3c]/50 rounded-[12px] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-[24px] h-[24px] rounded-full bg-[#e74c3c] flex items-center justify-center flex-shrink-0">
                  <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="font-['Poppins:Bold',sans-serif] text-[13px] text-[#e74c3c]">
                  Nicht möglich
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="bg-[#e74c3c]/20 rounded-[6px] px-2 py-1.5">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white line-through">Thema: Algebra</p>
                </div>
                <div className="bg-[#e74c3c]/20 rounded-[6px] px-2 py-1.5">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white line-through">Thema: Geometrie</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reasons */}
          <div className="space-y-3 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#009379] flex items-center justify-center flex-shrink-0">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white mb-1">
                  Bessere Übersicht
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] leading-relaxed">
                  Du kannst deine Prüfungen später rückblickend sortiert einsehen. Gemischte Themen würden keinen klaren Überblick bieten.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#009379] flex items-center justify-center flex-shrink-0">
                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white mb-1">
                  Konkrete Lernziele
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] leading-relaxed">
                  Fokussiere dich auf ein Thema nach dem anderen. So siehst du genau, wo du noch Übungsbedarf hast.
                </p>
              </div>
            </div>
          </div>

          {/* Tip for multiple topics */}
          <div className="bg-[#1a3a35] border border-[#009379]/30 rounded-[10px] p-4">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#009379] text-center mb-2">
              💡 Für Klassenarbeiten mit mehreren Themen:
            </p>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3] text-center leading-relaxed">
              Erstelle mehrere separate Prüfungen oder setze eine anstehende Klassenarbeit in deiner ToDo. Dort ist es möglich mehrere Auswahle zu treffen. Damit die KI dir tägliche ToDo's erstellt mit Karteikarten-Sets und Prüfungssimulationen, um dich auf die Klassenarbeit vorzubereiten.
            </p>
          </div>
        </div>
      )
    },
    // STEP 2: Unterthemen ändern
    {
      title: 'Unterthemen ändern',
      subtitle: 'Flexible Prüfungsgestaltung',
      content: (
        <div className="flex flex-col py-4">
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] rounded-[12px] p-5 mb-5">
            <div className="flex items-start gap-4">
              <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-[#009379] to-[#00705C] flex items-center justify-center flex-shrink-0">
                <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white mb-2">
                  Zwei Modi verfügbar
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] leading-relaxed mb-3">
                  Du kannst wählen, wie umfangreich deine Prüfung sein soll:
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-[6px] h-[6px] rounded-full bg-[#009379] mt-2 flex-shrink-0" />
                    <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#e3e3e3]">
                      <span className="font-['Poppins:SemiBold',sans-serif]">Alle Unterthemen:</span> Wähle ein ganzes Thema mit allen zugehörigen Unterthemen für eine umfassende Prüfung
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-[6px] h-[6px] rounded-full bg-[#009379] mt-2 flex-shrink-0" />
                    <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#e3e3e3]">
                      <span className="font-['Poppins:SemiBold',sans-serif]">Nur ausgewählte:</span> Wähle gezielt einzelne Unterthemen aus, die du vertiefen möchtest
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a3a35] border border-[#009379]/30 rounded-[10px] p-4 mb-4">
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] text-center leading-relaxed">
              Mit dem Button "Unterthemen ändern" kannst du jederzeit deine Auswahl anpassen.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[#979797]">
            <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px]">
              Mindestens ein Unterthema muss ausgewählt sein
            </p>
          </div>
        </div>
      )
    },
    // STEP 3: Prüfungsdauer
    {
      title: 'Prüfungsdauer in Minuten',
      subtitle: 'Das System passt sich automatisch an',
      content: (
        <div className="flex flex-col py-4">
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] rounded-[12px] p-5 mb-5">
            <div className="flex items-center gap-4">
              <div className="w-[50px] h-[50px] rounded-full bg-[#009379] flex items-center justify-center flex-shrink-0">
                <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white mb-1">
                  Intelligente Anpassung
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#979797]">
                  Anzahl der Fragen wird automatisch berechnet
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 px-2 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-[8px] h-[8px] rounded-full bg-[#009379] mt-2 flex-shrink-0" />
              <div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white mb-1">
                  Basierend auf deiner Zeit
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] leading-relaxed">
                  Das System ermittelt die optimale Anzahl an Fragen für deine gewählte Prüfungsdauer
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-[8px] h-[8px] rounded-full bg-[#009379] mt-2 flex-shrink-0" />
              <div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white mb-1">
                  Angepasst an dein Thema
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] leading-relaxed">
                  Die Fragenzahl richtet sich nach den ausgewählten Unterthemen und deren Umfang
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a3a35] border border-[#009379]/30 rounded-[10px] p-4">
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] text-center">
              💡 Je länger die Prüfung, desto mehr Fragen erhältst du und desto genauer wird deine Bewertung.
            </p>
          </div>
        </div>
      )
    },
    // STEP 4: Die 5 Fragetypen
    {
      title: 'Die 5 Fragetypen',
      subtitle: 'So beantwortest du die verschiedenen Fragen',
      content: (
        <div className="flex flex-col py-4">
          {/* Type 1: Single Choice */}
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] rounded-[12px] p-4 mb-3">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#009379] flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">1</p>
              </div>
              <div>
                <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white mb-1">
                  Einzelauswahl (Standard)
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3]">
                  Nur eine Antwort ist richtig
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] rounded-[8px] p-3 border border-[#484848]">
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#979797] mb-2">Beispiel:</p>
              <div className="space-y-[13px]">
                {/* Unselected option */}
                <div className="min-h-[54px] rounded-[8px] flex items-start px-[11px] py-[15px] bg-[#0a0a0a] border border-solid border-[#484848]">
                  <div className="rounded-[5px] size-[23px] border-[1.5px] border-solid bg-[#0a0a0a] border-[#484848] flex-shrink-0" />
                  <p className="font-['Poppins:Medium',sans-serif] text-[15px] leading-[23px] ml-5 text-white">
                    Antwort A
                  </p>
                </div>
                {/* Selected option */}
                <div className="min-h-[54px] rounded-[8px] flex items-start px-[11px] py-[15px] bg-[#0a0a0a] border border-solid border-[#b4b4b4]">
                  <div className="rounded-[5px] size-[23px] border-[1.5px] border-solid bg-[#bcbcbc] border-[#bcbcbc] flex-shrink-0" />
                  <p className="font-['Poppins:Medium',sans-serif] text-[15px] leading-[23px] ml-5 text-white">
                    Antwort B
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Type 2: Multiple Choice */}
          <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] rounded-[12px] p-4 mb-3">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#ff9500] flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">2</p>
              </div>
              <div>
                <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white mb-1">
                  Mehrfachauswahl
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3]">
                  Eine oder mehrere Antworten sind richtig
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] rounded-[8px] p-3 border border-[#484848]">
              <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#797979] italic mb-3">
                Mehrere Antworten möglich
              </p>
              <div className="space-y-[13px]">
                {/* Selected checkbox 1 */}
                <div className="min-h-[54px] rounded-[8px] flex items-start px-[11px] py-[15px] bg-[#0a0a0a] border border-solid border-[#b4b4b4]">
                  <div className="rounded-[5px] size-[23px] border-[1.5px] border-solid bg-[#bcbcbc] border-[#bcbcbc] flex-shrink-0" />
                  <p className="font-['Poppins:Medium',sans-serif] text-[15px] leading-[23px] ml-5 text-white">
                    Antwort A
                  </p>
                </div>
                {/* Unselected checkbox */}
                <div className="min-h-[54px] rounded-[8px] flex items-start px-[11px] py-[15px] bg-[#0a0a0a] border border-solid border-[#484848]">
                  <div className="rounded-[5px] size-[23px] border-[1.5px] border-solid bg-[#0a0a0a] border-[#484848] flex-shrink-0" />
                  <p className="font-['Poppins:Medium',sans-serif] text-[15px] leading-[23px] ml-5 text-white">
                    Antwort B
                  </p>
                </div>
                {/* Selected checkbox 2 */}
                <div className="min-h-[54px] rounded-[8px] flex items-start px-[11px] py-[15px] bg-[#0a0a0a] border border-solid border-[#b4b4b4]">
                  <div className="rounded-[5px] size-[23px] border-[1.5px] border-solid bg-[#bcbcbc] border-[#bcbcbc] flex-shrink-0" />
                  <p className="font-['Poppins:Medium',sans-serif] text-[15px] leading-[23px] ml-5 text-white">
                    Antwort C
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Type 3: Fill in the blank */}
          <div className="bg-[#0a0a0a] rounded-[12px] p-4 mb-3 border border-white/[0.08]">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#0066cc] flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">3</p>
              </div>
              <div>
                <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white mb-1">
                  Lückentext (freie Eingabe)
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3]">
                  Trage die Antwort selbst ein
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] rounded-[8px] p-3 border border-[#484848]">
              <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white mb-3 leading-relaxed">
                Man sollte pro Woche ______ Mal Sport treiben.
              </p>
              <input
                type="text"
                value="3-5"
                readOnly
                className="w-full h-[58px] rounded-[12px] px-5 font-['Poppins:Regular',sans-serif] text-white bg-[#0a0a0a] border-2 border-[#484848] outline-none"
              />
            </div>
          </div>

          {/* Type 4: Fill in the blank with dropdown */}
          <div className="bg-[#0a0a0a] rounded-[12px] p-4 mb-3 border border-white/[0.08]">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#9b59b6] flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">4</p>
              </div>
              <div>
                <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white mb-1">
                  Lückentext mit Auswahl
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3]">
                  Wähle eine Antwort → füllt die Lücke aus
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] rounded-[8px] p-3 border border-[#484848]">
              <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white leading-[24px] mb-3">
                Der BMI ist ein Maß für{' '}
                <span className="inline-block min-w-[120px] px-3 py-1 rounded-lg border-2 border-dashed border-[#484848] bg-[#0a0a0a] text-[#797979]">
                  ________
                </span>
                {' '}und gibt einen Anhaltspunkt.
              </p>
              <div className="space-y-[13px]">
                <div className="min-h-[54px] rounded-[8px] flex items-start px-[11px] py-[15px] bg-[#0a0a0a] border border-solid border-[#484848]">
                  <div className="rounded-[5px] size-[23px] border-[1.5px] border-solid bg-[#0a0a0a] border-[#484848] flex-shrink-0" />
                  <p className="font-['Poppins:Medium',sans-serif] text-[15px] leading-[23px] ml-5 text-white">
                    Körpergröße
                  </p>
                </div>
                <div className="min-h-[54px] rounded-[8px] flex items-start px-[11px] py-[15px] bg-[#0a0a0a] border border-solid border-[#b4b4b4]">
                  <div className="rounded-[5px] size-[23px] border-[1.5px] border-solid bg-[#bcbcbc] border-[#bcbcbc] flex-shrink-0" />
                  <p className="font-['Poppins:Medium',sans-serif] text-[15px] leading-[23px] ml-5 text-white">
                    Körpergewicht im Verhältnis zur Größe
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Type 5: Short Answer */}
          <div className="bg-[#0a0a0a] rounded-[12px] p-4 mb-4 border border-white/[0.08]">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-[32px] h-[32px] rounded-full bg-[#e74c3c] flex items-center justify-center flex-shrink-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">5</p>
              </div>
              <div>
                <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white mb-1">
                  Kurze Textantwort
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3]">
                  Schreibe deine Antwort in eigenen Worten
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] rounded-[8px] p-3 border border-[#484848]">
              <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white mb-3 leading-relaxed">
                Welche Maßnahmen beugen Herz-Kreislauf-Erkrankungen vor?
              </p>
              <input
                type="text"
                value="Regelmäßige Bewegung und gesunde Ernährung"
                readOnly
                className="w-full h-[58px] rounded-[12px] px-5 font-['Poppins:Regular',sans-serif] text-white bg-[#0a0a0a] border-2 border-[#484848] outline-none"
              />
            </div>
          </div>

          {/* Bottom tip */}
          <div className="bg-[#1a3a35] border border-[#009379]/30 rounded-[10px] p-3">
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3] text-center leading-relaxed">
              💡 Das System erkennt automatisch den Fragetyp und passt die Eingabemöglichkeiten an!
            </p>
          </div>
        </div>
      )
    },
    // STEP 5: Fragen & Punktesystem
    {
      title: 'Fragen & Punktesystem',
      subtitle: 'So funktioniert die Bewertung',
      content: (
        <div className="flex flex-col py-4">
          {/* Unterthema-Anzeige */}
          <div className="bg-[#0a0a0a] rounded-[12px] p-4 mb-5 border border-white/[0.08]">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-[40px] h-[40px] rounded-full bg-[#009379] flex items-center justify-center flex-shrink-0">
                <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-white mb-1">
                  Unterthema bei jeder Frage
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] leading-relaxed">
                  Über jeder Frage wird angezeigt, zu welchem Unterthema sie gehört
                </p>
              </div>
            </div>
            
            {/* Visual Example */}
            <div className="bg-[#0a0a0a] rounded-[10px] p-4 border border-[#484848]">
              <p className="font-['Poppins:Bold',sans-serif] text-white text-[15px] mb-2">
                Gleichungen:
              </p>
              <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-white leading-[24px]">
                Löse die Gleichung: 2x + 5 = 13
              </p>
            </div>
          </div>

          {/* Punktesystem - NUR 1 BEISPIEL MIT 0,5 PKT */}
          <div className="bg-gradient-to-br from-[#ffd700]/10 to-[#ffd700]/5 border-2 border-[#ffd700]/50 rounded-[12px] p-4 mb-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-[40px] h-[40px] rounded-full bg-[#ffd700] flex items-center justify-center flex-shrink-0">
                <span className="text-[20px]">🎯</span>
              </div>
              <div>
                <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-white mb-1">
                  Intelligentes Punktesystem
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#b3b3b3] leading-relaxed">
                  Jede Frage hat einen individuellen Punktewert basierend auf ihrer Komplexität
                </p>
              </div>
            </div>

            <div className="bg-[#0a0a0a] rounded-[10px] p-4 border border-[#484848]">
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#979797] mb-3">
                So wird es über jeder Frage angezeigt:
              </p>
              
              {/* NUR 1 Beispiel mit 0,5 PKT */}
              <div className="bg-[#0a0a0a] rounded-[8px] p-3 border border-[#484848]">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[#797979] text-[14px] mb-2">
                  0.5 PKT
                </p>
                <p className="font-['Poppins:Bold',sans-serif] text-white text-[13px] mb-1">
                  Grundlagen:
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-white text-[13px] leading-relaxed">
                  Was ist die Summe von 5 + 3?
                </p>
              </div>
            </div>
          </div>

          {/* Teilpunkte */}
          <div className="bg-[#0a0a0a] rounded-[12px] p-4 mb-4 border border-white/[0.08]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[18px]">✂️</span>
              <p className="font-['Poppins:Bold',sans-serif] text-[15px] text-white">
                Teilpunkte möglich!
              </p>
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#e3e3e3] leading-relaxed mb-3">
              Bei Fragen mit <span className="font-['Poppins:SemiBold',sans-serif] text-[#009379]">mehreren richtigen Antworten</span> erhältst du anteilige Punkte für jede richtige Auswahl.
            </p>
            
            <div className="bg-[#0a0a0a] rounded-[10px] p-4 border border-[#484848]">
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#979797] mb-3">
                Beispiel: Frage mit 2 richtigen Antworten
              </p>
              
              {/* Visual example with checkboxes */}
              <div className="space-y-[13px] mb-3">
                {/* Correct, selected */}
                <div className="min-h-[54px] rounded-[8px] flex items-start px-[11px] py-[15px] bg-[#0a0a0a] border border-solid border-[#b4b4b4]">
                  <div className="rounded-[5px] size-[23px] border-[1.5px] border-solid bg-[#bcbcbc] border-[#bcbcbc] flex-shrink-0" />
                  <p className="font-['Poppins:Medium',sans-serif] text-[15px] leading-[23px] ml-5 text-white">
                    Antwort A
                  </p>
                </div>
                {/* Correct, NOT selected */}
                <div className="min-h-[54px] rounded-[8px] flex items-start px-[11px] py-[15px] bg-[#0a0a0a] border border-solid border-[#484848]">
                  <div className="rounded-[5px] size-[23px] border-[1.5px] border-solid bg-[#0a0a0a] border-[#484848] flex-shrink-0" />
                  <p className="font-['Poppins:Medium',sans-serif] text-[15px] leading-[23px] ml-5 text-white">
                    Antwort B (vergessen)
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-[#484848]">
                <div className="flex items-center gap-2">
                  <span className="text-[#009379] text-[14px]">✓</span>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3]">
                    1 von 2 richtig angekreuzt = <span className="font-['Poppins:SemiBold',sans-serif] text-white">halbe Punkte</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#e74c3c] text-[14px]">✗</span>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3]">
                    Falsche Antwort dabei = <span className="font-['Poppins:SemiBold',sans-serif] text-[#e74c3c]">0 Punkte</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Note calculation */}
          <div className="bg-[#1a3a35] border border-[#009379]/30 rounded-[10px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[16px]">📊</span>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#009379]">
                Notenberechnung
              </p>
            </div>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3] text-center leading-relaxed">
              Deine <span className="font-['Poppins:SemiBold',sans-serif] text-white">Note (1-6)</span> ergibt sich aus deinen erreichten Punkten im Verhältnis zu den maximal möglichen Punkten der Prüfung.
            </p>
          </div>
        </div>
      )
    },
    // STEP 6: Ergebnisse nur am Ende anzeigen
    {
      title: 'Ergebnisse nur am Ende anzeigen',
      subtitle: 'Wähle dein Lernformat',
      content: (
        <div className="flex flex-col py-4">
          {/* Main explanation */}
          <div className="bg-[#0a0a0a] rounded-[12px] p-4 mb-4 border border-white/[0.08]">
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#e3e3e3] text-center leading-relaxed">
              Diese Einstellung bestimmt, <span className="font-['Poppins:SemiBold',sans-serif] text-white">wann du siehst</span>, ob deine Antworten richtig oder falsch waren.
            </p>
          </div>

          <div className="space-y-4 mb-4">
            {/* Option 1: Standard (Checkbox NICHT aktiviert) */}
            <div className="bg-gradient-to-br from-[#009379]/10 to-[#009379]/5 border-2 border-[#009379] rounded-[14px] p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-[20px] h-[20px] rounded-[5px] border-2 border-[#009379] bg-transparent flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-['Poppins:Bold',sans-serif] text-[15px] text-white mb-1">
                    Ergebnisse nur am Ende anzeigen
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#979797]">
                      Checkbox NICHT aktiviert ☐
                    </p>
                    <span className="px-2 py-0.5 bg-[#009379] rounded-full text-[9px] font-['Poppins:SemiBold',sans-serif] text-white">
                      STANDARD
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#0a0a0a] rounded-[8px] p-3 mb-2">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#009379] mb-1">
                  ✓ Was passiert:
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#e3e3e3] leading-relaxed">
                  Nach jeder Frage siehst du <span className="font-['Poppins:SemiBold',sans-serif]">sofort</span> ob deine Antwort richtig ✅ oder falsch ❌ war.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[13px] mt-0.5">💡</span>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#b3b3b3] leading-relaxed">
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[#009379]">Perfekt zum Lernen:</span> Du merkst sofort was du falsch verstanden hast.
                </p>
              </div>
            </div>

            {/* Option 2: Nur am Ende (Checkbox aktiviert) */}
            <div className="bg-[#0a0a0a] border-2 border-[#e74c3c]/50 rounded-[14px] p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-[20px] h-[20px] rounded-[5px] border-2 border-[#e74c3c] bg-transparent flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-[12px] h-[12px]" fill="none" viewBox="0 0 24 24" stroke="#e74c3c" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-['Poppins:Bold',sans-serif] text-[15px] text-white mb-1">
                    Ergebnisse nur am Ende anzeigen
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#979797]">
                      Checkbox aktiviert ☑
                    </p>
                    <span className="px-2 py-0.5 bg-[#e74c3c] rounded-full text-[9px] font-['Poppins:SemiBold',sans-serif] text-white">
                      PRÜFUNG
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#0a0a0a] rounded-[8px] p-3 mb-2">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#e74c3c] mb-1">
                  ✓ Was passiert:
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#e3e3e3] leading-relaxed">
                  Du beantwortest <span className="font-['Poppins:SemiBold',sans-serif]">alle Fragen</span> ohne zu wissen ob sie richtig sind. Die Auswertung siehst du erst <span className="font-['Poppins:SemiBold',sans-serif]">ganz am Ende</span>.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[13px] mt-0.5">🎯</span>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#b3b3b3] leading-relaxed">
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[#e74c3c]">Wie eine echte Prüfung:</span> Perfekt zum Üben für den Ernstfall!
                </p>
              </div>
            </div>
          </div>

          {/* Bottom tip */}
          <div className="bg-[#1a3a35] border border-[#009379]/30 rounded-[10px] p-3">
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#b3b3b3] text-center leading-relaxed">
              <span className="font-['Poppins:SemiBold',sans-serif] text-[#009379]">Tipp:</span> Lass die Checkbox deaktiviert zum Lernen. Wenn du dich sicher fühlst, aktiviere sie für den Prüfungsmodus! 📚
            </p>
          </div>
        </div>
      )
    },
    // STEP 7: Bereit
    {
      title: 'Bereit für die Prüfung?',
      subtitle: 'Viel Erfolg beim Lernen!',
      content: (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#009379] to-[#00705C] flex items-center justify-center mb-6 relative">
            <svg className="w-[60px] h-[60px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute -top-2 -right-2 w-[40px] h-[40px] rounded-full bg-[#ffd700] flex items-center justify-center">
              <span className="text-[24px]">🎯</span>
            </div>
          </div>
          <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-[#b3b3b3] text-center leading-relaxed px-4 mb-4">
            Du weißt jetzt alles Wichtige über die Prüfungssimulation!
          </p>
          <div className="bg-[#0a0a0a] rounded-[10px] p-4 w-full border border-white/[0.08]">
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#e3e3e3] text-center">
              Tipp: Starte mit einer <span className="font-['Poppins:SemiBold',sans-serif] text-[#009379]">kurzen Prüfung</span> und steigere dich nach und nach! 📈
            </p>
          </div>
        </div>
      )
    }
  ];

  const totalSteps = tutorialSteps.length;
  const currentStepData = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={handleClose}
          style={{
            padding: '1rem',
            paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))',
            paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-[#141414] border border-white/[0.12] rounded-[24px] w-full max-w-[520px] overflow-hidden flex flex-col h-[90vh] max-h-[700px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-white/[0.08] h-[120px] flex flex-col justify-center">
              <CloseButton
                onClick={handleClose}
                position="absolute top-6 right-6"
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="pr-12"
                >
                  <h2 className="font-['Poppins:Bold',sans-serif] text-[20px] text-white mb-1 leading-tight">
                    {currentStepData.title}
                  </h2>
                  <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#979797] leading-snug">
                    {currentStepData.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Content */}
            <div className="px-6 py-6 flex-1 overflow-y-auto" ref={contentRef}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStepData.content}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer with Navigation */}
            <div className="p-6 pt-4 border-t border-white/[0.08] flex-shrink-0">
              {/* Skip tutorial — only before the last step */}
              {currentStep < totalSteps - 1 && (
                <button
                  onClick={onClose}
                  className="mx-auto mb-3 block font-['Poppins:Medium',sans-serif] text-[12px] text-white/35 hover:text-white/60 active:text-white/65 transition-colors"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  Überspringen
                </button>
              )}
              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {tutorialSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-[8px] rounded-full transition-all ${
                      index === currentStep
                        ? 'w-[32px] bg-[#009379]'
                        : 'w-[8px] bg-white/[0.2]'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <Button
                  fullWidth={false}
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="px-6 flex items-center gap-2"
                >
                  <ChevronLeft className="w-[18px] h-[18px] text-white" />
                  Zurück
                </Button>

                <Button
                  onClick={currentStep === totalSteps - 1 ? handleClose : handleNext}
                  className="flex-1"
                >
                  {currentStep === totalSteps - 1 ? 'Verstanden' : 'Weiter'}
                  {currentStep !== totalSteps - 1 && (
                    <ChevronRight className="w-[18px] h-[18px] text-white" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}