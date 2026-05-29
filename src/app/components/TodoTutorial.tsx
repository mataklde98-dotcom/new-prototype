// ===== TODO TUTORIAL =====
// Multi-step onboarding tutorial for the TodoManagementScreen.
// Shown on first visit, explains Lernziele, Klassenarbeiten, erledigte KA flow.
// Uses ReactDOM.createPortal, motion animations, Poppins font, Premium SaaS style.

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target, Calendar, Brain, Sparkles,
  AlertTriangle, CheckCircle, ClipboardList,
  Star, Upload, BookOpen, Info,
} from 'lucide-react';
import CloseButton from './CloseButton';

// Flag icon SVG (reused from TodoManagementScreen)
const FLAG_PATH = "M4.75 3.70898V5.03906C5.25977 5.1543 5.71289 5.34375 6.1875 5.47461V4.14258C5.67969 4.0293 5.22266 3.83984 4.75 3.70898ZM9.11133 1.30664C8.44141 1.61719 7.61719 1.92969 6.82617 1.92969C5.78125 1.92969 4.91602 1.25 3.59961 1.25C3.11133 1.25 2.67578 1.33594 2.27148 1.48438C2.32617 1.3418 2.35156 1.1875 2.3418 1.02344C2.30664 0.46875 1.85156 0.0234375 1.29492 0C0.669922 -0.0253906 0.15625 0.474609 0.15625 1.09375C0.15625 1.46484 0.341797 1.79297 0.625 1.99023V9.53125C0.625 9.79102 0.833984 10 1.09375 10H1.40625C1.66602 10 1.875 9.79102 1.875 9.53125V7.6875C2.42773 7.45117 3.11719 7.25586 4.10937 7.25586C5.15625 7.25586 6.01953 7.93555 7.33594 7.93555C8.27734 7.93555 9.0293 7.61719 9.72852 7.13672C9.89844 7.01953 9.99805 6.82813 9.99805 6.62109V1.87305C10 1.41797 9.52539 1.11523 9.11133 1.30664ZM3.3125 6.35742C2.80859 6.41016 2.33594 6.51758 1.875 6.68164V5.30469C2.38672 5.12305 2.80273 5.01172 3.3125 4.96484V6.35742ZM9.0625 3.73047C8.60156 3.92187 8.1582 4.11133 7.625 4.19727V5.58594C8.10937 5.51953 8.62891 5.35547 9.0625 5.07813V6.45508C8.57227 6.76953 8.11523 6.9375 7.625 6.98438V5.58594C7.09766 5.6582 6.68945 5.61523 6.1875 5.47656V6.79297C5.7207 6.64844 5.26367 6.4668 4.75 6.37695V5.03906C4.36523 4.95313 3.95313 4.90625 3.3125 4.96484V3.59766C2.875 3.6582 2.44141 3.79687 1.875 4.00586V2.62891C2.52344 2.39062 2.85352 2.24219 3.3125 2.19922V3.59766C3.83984 3.52539 4.25781 3.57227 4.75 3.70898V2.39258C5.21289 2.53711 5.67187 2.71875 6.1875 2.80859V4.14453C6.65039 4.24805 7.11719 4.2793 7.625 4.19727V2.79297C8.15234 2.69922 8.64648 2.52734 9.0625 2.35352V3.73047Z";

function FlagIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d={FLAG_PATH} />
    </svg>
  );
}

interface TodoTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'todoTutorialCompleted';

export function shouldShowTodoTutorial(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== 'true';
}

export default function TodoTutorial({ isOpen, onClose }: TodoTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsTransitioning(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setCurrentStep(0);
    onClose();
  };

  const handleNext = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimeout(() => setIsTransitioning(false), 250);
    } else {
      localStorage.setItem(STORAGE_KEY, 'true');
      handleClose();
    }
  };

  const handlePrevious = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (isTransitioning) return;
    if (currentStep > 0) {
      setIsTransitioning(true);
      setCurrentStep(currentStep - 1);
      setTimeout(() => setIsTransitioning(false), 250);
    }
  };

  // ===== FEATURE CARD HELPER =====
  const FeatureCard = ({ icon, color, title, desc }: { icon: React.ReactNode; color: string; title: string; desc: string }) => (
    <div className="flex items-start gap-3 p-3.5 rounded-xl border" style={{ background: `${color}08`, borderColor: `${color}18` }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white mb-0.5">{title}</p>
        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/45 leading-relaxed">{desc}</p>
      </div>
    </div>
  );

  const tutorialSteps = [
    // STEP 0: Willkommen – Überblick
    {
      title: 'Willkommen bei deinen To-Do\'s',
      subtitle: 'Dein persönlicher Lernplan',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Hier verwaltest du deine <span className="font-['Poppins:SemiBold',sans-serif] text-white">Lernziele</span> und <span className="font-['Poppins:SemiBold',sans-serif] text-white">Klassenarbeiten</span>. Die KI erstellt dir daraus automatisch tägliche Aufgaben wie Karteikarten und Prüfungssimulationen.
          </p>

          <div className="space-y-2.5">
            <FeatureCard
              icon={<FlagIcon className="w-4.5 h-4.5 text-[#56C2D9]" />}
              color="#56C2D9"
              title="Lernziele"
              desc="Setze dir ein Thema, das du bis zu einem bestimmten Datum beherrschen möchtest. Die KI bereitet dich Schritt für Schritt darauf vor."
            />
            <FeatureCard
              icon={<ClipboardList className="w-4.5 h-4.5 text-[#D4A044]" />}
              color="#D4A044"
              title="Klassenarbeiten"
              desc="Trage eine bevorstehende Klassenarbeit ein und die KI erstellt dir einen Vorbereitungsplan mit allen relevanten Aufgaben."
            />
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#A855F7]/[0.06] border border-[#A855F7]/[0.12]">
            <Brain className="w-4 h-4 text-[#A855F7] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              Basierend auf deinen Einträgen bekommst du <span className="text-white/70">täglich personalisierte To-Do's</span> — Karteikarten lernen, Prüfungssimulationen und mehr.
            </p>
          </div>
        </div>
      ),
    },

    // STEP 1: Lernziele
    {
      title: 'Lernziele setzen',
      subtitle: 'Ein Thema gezielt meistern',
      content: (
        <div className="space-y-3.5">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Bei einem Lernziel wählst du <span className="font-['Poppins:SemiBold',sans-serif] text-white">ein einzelnes Thema</span> aus und setzt ein Datum, bis wann du es beherrschen möchtest. Die KI gibt dir dann täglich passende Aufgaben.
          </p>

          {/* Mini Preview: Lernziel */}
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <FlagIcon className="w-4 h-4 text-[#56C2D9]" />
              <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/50 uppercase tracking-wide">Lernziel</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#56C2D9]/[0.08] border border-[#56C2D9]/[0.2]">
              <BookOpen className="w-5 h-5 text-[#56C2D9]" />
              <div className="flex-1">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">Dramatische Lektüren</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">Deutsch · bis 10.01.2025</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Target className="w-4 h-4 text-white/30" />
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35 italic">
                „Ich möchte die Dramenanalyse sicher beherrschen..."
              </p>
            </div>
          </div>

          <FeatureCard
            icon={<Sparkles className="w-4.5 h-4.5 text-[#00B894]" />}
            color="#00B894"
            title="Tipp: Zielbeschreibung nutzen"
            desc="Beschreibe dein Anliegen detailliert in der Zielbeschreibung. So kann die KI viel gezielter auf dein Lernziel eingehen als nur auf das gesamte Thema."
          />

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#56C2D9]/[0.06] border border-[#56C2D9]/[0.12]">
            <Info className="w-4 h-4 text-[#56C2D9] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              Es ist nur erlaubt, <span className="text-white/70">ein einzelnes Thema</span> pro Lernziel auszuwählen — so bleibt der Fokus klar und die KI kann präzise Aufgaben erstellen.
            </p>
          </div>
        </div>
      ),
    },

    // STEP 2: Lernziel-Automatik
    {
      title: 'Automatische Fortschrittskontrolle',
      subtitle: 'Die KI erkennt, wann du dein Ziel erreichst',
      content: (
        <div className="space-y-3.5">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Jeden Tag bekommst du passende To-Do's: <span className="font-['Poppins:SemiBold',sans-serif] text-white">Karteikarten lernen</span>, <span className="font-['Poppins:SemiBold',sans-serif] text-white">Prüfungssimulationen</span> und mehr — alles auf dein Lernziel ausgerichtet.
          </p>

          {/* Mini Preview: Daily Todos */}
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-4 space-y-2">
            <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/50 mb-2 uppercase tracking-wide">Tägliche Aufgaben</p>
            {[
              { icon: <div className="w-2 h-2 rounded-full bg-[#4A9EFF]" />, text: 'Karteikarten: Dramatische Lektüren', sub: '12 Karten · ~15 Min.' },
              { icon: <div className="w-2 h-2 rounded-full bg-[#FF8C00]" />, text: 'Prüfungssimulation: Dramenanalyse', sub: '10 Fragen · ~20 Min.' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                {item.icon}
                <div className="flex-1 min-w-0">
                  <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/70 truncate">{item.text}</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5">
            <FeatureCard
              icon={<CheckCircle className="w-4.5 h-4.5 text-[#4ADE80]" />}
              color="#4ADE80"
              title="Automatisch abgeschlossen"
              desc="Wenn das Datum erreicht ist und die KI erkennt, dass du das Thema verstanden hast, wird dein Lernziel automatisch als erreicht markiert."
            />
            <FeatureCard
              icon={<Calendar className="w-4.5 h-4.5 text-[#FFB800]" />}
              color="#FFB800"
              title="Datum-Anpassung"
              desc="Sollte die KI feststellen, dass du noch mehr Zeit brauchst, kann sie das Zieldatum verschieben — damit du wirklich sicher bist."
            />
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#A855F7]/[0.06] border border-[#A855F7]/[0.12]">
            <Info className="w-4 h-4 text-[#A855F7] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              Du kannst ein Lernziel auch jederzeit <span className="text-white/70">manuell als erreicht markieren</span>, wenn du der Meinung bist, dass du es geschafft hast.
            </p>
          </div>
        </div>
      ),
    },

    // STEP 3: Klassenarbeiten
    {
      title: 'Klassenarbeiten eintragen',
      subtitle: 'Gezielte Vorbereitung auf Prüfungen',
      content: (
        <div className="space-y-3.5">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Bei einer Klassenarbeit kannst du <span className="font-['Poppins:SemiBold',sans-serif] text-white">mehrere Themen aus verschiedenen Kategorien</span> auswählen, von denen du denkst, dass sie drankommen könnten.
          </p>

          {/* Mini Preview: Klassenarbeit */}
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="w-4 h-4 text-[#D4A044]" />
              <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/50 uppercase tracking-wide">Klassenarbeit</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#D4A044]/[0.08] border border-[#D4A044]/[0.2]">
              <div className="flex-1">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">Mathematik</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">5 Themen aus 3 Kategorien</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D4A044]/15 border border-[#D4A044]/25">
                <Calendar className="w-3 h-3 text-[#D4A044]" />
                <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-[#D4A044]">31.12.2024</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Analysis', 'Vektoren', 'Stochastik', 'Integrale', 'Kurvendisk.'].map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md font-['Poppins:Medium',sans-serif] text-[10px]" style={{ background: 'rgba(212,160,68,0.1)', color: 'rgba(212,160,68,0.7)', border: '1px solid rgba(212,160,68,0.15)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <FeatureCard
            icon={<Sparkles className="w-4.5 h-4.5 text-[#00B894]" />}
            color="#00B894"
            title="Tipp: Zielbeschreibung"
            desc="Teile deine Bedenken mit, beschreibe was du denkst das drankommen könnte — die KI nutzt das für eine noch gezieltere Vorbereitung."
          />

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#D4A044]/[0.06] border border-[#D4A044]/[0.12]">
            <Info className="w-4 h-4 text-[#D4A044] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              Das Datum kannst du jederzeit ändern, falls sich die Klassenarbeit <span className="text-white/70">verschiebt</span>. Nach dem Datum wird sie automatisch als erledigt markiert.
            </p>
          </div>
        </div>
      ),
    },

    // STEP 4: Erledigte Klassenarbeiten – Note & Upload
    {
      title: 'Nach der Klassenarbeit',
      subtitle: 'Note eintragen & Arbeit hochladen',
      content: (
        <div className="space-y-3.5">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            Nachdem eine Klassenarbeit geschrieben wurde, kannst du dein <span className="font-['Poppins:SemiBold',sans-serif] text-white">Ergebnis hinterlegen</span> und die Arbeit hochladen — das verbessert dein Lernerlebnis deutlich.
          </p>

          {/* Mini Preview: Grade + Upload */}
          <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] rounded-2xl p-4 space-y-3">
            <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/50 mb-1 uppercase tracking-wide">Ergebnis</p>
            
            {/* Grade Selection Preview */}
            <div className="flex items-center gap-2">
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 mr-1">Note:</p>
              {['1', '2', '3'].map((g, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: g === '2' ? 'rgba(96,200,120,0.15)' : 'rgba(255,255,255,0.04)',
                    border: g === '2' ? '1.5px solid rgba(96,200,120,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="font-['Poppins:Bold',sans-serif] text-[14px]" style={{ color: g === '2' ? '#60C878' : 'rgba(255,255,255,0.3)' }}>{g}</span>
                </div>
              ))}
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 ml-1">...</p>
            </div>

            {/* Tendency Preview */}
            <div className="flex items-center gap-2">
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 mr-1">Tendenz:</p>
              {['2+', '2', '2-'].map((t, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1 rounded-md"
                  style={{
                    background: t === '2+' ? 'rgba(96,200,120,0.12)' : 'rgba(255,255,255,0.04)',
                    border: t === '2+' ? '1px solid rgba(96,200,120,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span className="font-['Poppins:Medium',sans-serif] text-[11px]" style={{ color: t === '2+' ? '#60C878' : 'rgba(255,255,255,0.3)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <FeatureCard
            icon={<Upload className="w-4.5 h-4.5 text-[#3B82F6]" />}
            color="#3B82F6"
            title="Klassenarbeit hochladen"
            desc="Nach dem Speichern der Note wirst du gefragt, ob du die Arbeit hochladen möchtest. Dadurch kann die KI die Aufgabenstellungen mit deiner Vorbereitung abgleichen."
          />

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#00B894]/[0.06] border border-[#00B894]/[0.12]">
            <Sparkles className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              Je mehr Daten die KI über deine Ergebnisse hat, desto <span className="text-white/70">besser kann sie dich auf zukünftige Prüfungen vorbereiten</span> und dein Lernerlebnis optimieren.
            </p>
          </div>
        </div>
      ),
    },

    // STEP 5: Los geht's
    {
      title: 'Bereit loszulegen!',
      subtitle: 'Kurz zusammengefasst',
      content: (
        <div className="space-y-4">
          <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/75 leading-relaxed">
            So holst du das Beste aus deinen To-Do's heraus:
          </p>

          <div className="space-y-2">
            {[
              { text: 'Lernziel: Ein Thema auswählen + Zieldatum setzen', color: '#56C2D9' },
              { text: 'Zielbeschreibung nutzen — besser als nur ein Thema', color: '#00B894' },
              { text: 'Klassenarbeit: Mehrere Themen + Prüfungsdatum eintragen', color: '#D4A044' },
              { text: 'Die KI erstellt dir täglich passende Aufgaben', color: '#A855F7' },
              { text: 'Lernziele werden automatisch als erreicht markiert', color: '#4ADE80' },
              { text: 'Nach der Klassenarbeit: Note eintragen & Arbeit hochladen', color: '#3B82F6' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: item.color }} />
                </div>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/75">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#00B894]/[0.06] border border-[#00B894]/[0.12]">
            <Sparkles className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-relaxed">
              Klicke auf <span className="text-white/70">„Aufgabe hinzufügen"</span>, um dein erstes Lernziel oder deine erste Klassenarbeit einzutragen!
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = tutorialSteps[currentStep];

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[9998]"
            onClick={handleClose}
          />

          {/* Tutorial Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
            style={{
              padding: '1rem',
              paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))',
              paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-[#1e1e1e] to-[#0a0a0a] border border-white/[0.15] rounded-[24px] w-full max-w-[520px] overflow-hidden flex flex-col h-[90vh] max-h-[680px] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 pb-4 border-b border-white/[0.08] h-[120px] flex flex-col justify-center">
                <CloseButton
                  onClick={handleClose}
                  className="absolute top-6 right-6"
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
                    {/* Step badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px]"
                        style={{
                          color: '#00B894',
                          background: 'rgba(0,184,148,0.12)',
                          border: '1px solid rgba(0,184,148,0.25)',
                        }}
                      >
                        {currentStep + 1} / {tutorialSteps.length}
                      </span>
                    </div>
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
              <div className="px-6 py-6 flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStepData.content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 pt-4 border-t border-white/[0.08] flex-shrink-0">
                {/* Skip tutorial — only before the last step */}
                {currentStep < tutorialSteps.length - 1 && (
                  <button
                    onClick={handleClose}
                    className="mx-auto mb-3 block font-['Poppins:Medium',sans-serif] text-[12px] text-white/35 active:text-white/65 transition-colors"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    Überspringen
                  </button>
                )}
                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-[8px] rounded-full transition-all ${
                        index === currentStep
                          ? 'w-[32px] bg-[#00B894]'
                          : 'w-[8px] bg-white/[0.2]'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handlePrevious}
                    onTouchEnd={handlePrevious}
                    disabled={currentStep === 0 || isTransitioning}
                    className={`group relative flex items-center justify-center gap-2 h-[48px] rounded-[12px] border border-white/[0.1] px-6 transition-all overflow-hidden ${
                      currentStep === 0 || isTransitioning
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer active:scale-95'
                    }`}
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      pointerEvents: currentStep === 0 || isTransitioning ? 'none' : 'auto',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-white/[0.02]" />
                    <svg className="relative z-10 w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <p className="relative z-10 font-['Poppins:Medium',sans-serif] text-[15px] text-white">
                      Zurück
                    </p>
                  </button>

                  <button
                    onClick={handleNext}
                    onTouchEnd={handleNext}
                    disabled={isTransitioning}
                    className={`group relative flex-1 flex items-center justify-center gap-2 h-[48px] rounded-[12px] border border-[#00B894]/30 transition-all overflow-hidden ${
                      isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'
                    }`}
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      pointerEvents: isTransitioning ? 'none' : 'auto',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00B894]/20 to-[#009379]/20" />
                    <p className="relative z-10 font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">
                      {currentStep === tutorialSteps.length - 1 ? 'Verstanden!' : 'Weiter'}
                    </p>
                    <svg className="relative z-10 w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}