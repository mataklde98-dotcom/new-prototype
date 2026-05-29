import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import MobileHeader from "@/app/components/MobileHeader";
import CompleteProfileBanner from "@/app/components/onboarding/CompleteProfileBanner";
import SwipeableDateSelector from "@/app/components/SwipeableDateSelector";
import TodoFilterPopup from "@/app/components/TodoFilterPopup";
import AddTaskButton from "@/imports/Button";
import TodoCardsSection from "@/app/components/TodoCardsSection";
import FlashcardItem from "@/app/components/FlashcardItem";
import svgPaths from "@/imports/svg-umyc99t8pe";
import imgInformation2 from "figma:asset/e51112c4419b0e3840e36fc1512cdd56c4bab645.png";
import img5Be1B62F1B70E1Fb790B348D76Ddb4Becf81401B9B6732 from "figma:asset/49d3c05880ae6ac2ad58868ed10af9056db78537.png";
import imgEllipse2 from "figma:asset/11a2b9c104f9ad331556dffc2e3e770195913d21.png";
import { Sparkles, GraduationCap } from 'lucide-react';
import { Flame, TrendingUp, TrendingDown, ChevronRight, Minus, Lock, Zap, CheckCircle2, Phone, Mail, Clock, Headset, Star, AlertTriangle, Target, Brain, ShieldAlert, ClipboardList, NotebookPen, Layers } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { LEARNING_STREAK } from "@/app/components/ProfileAnalyticsScreen";
import { OVERALL_PROGRESS, MOCK_SUBJECTS, MOCK_ACTIVE_GOALS, MOCK_WEAKNESSES, MOCK_KNOWLEDGE_GAPS_SELF, MOCK_RISKS } from "@/app/components/ProfileAnalyticsScreen";
import { MOCK_UPCOMING_EXAMS } from "@/app/components/profileAnalyticsMockExams";
import { Gift, Users, Copy, Check } from 'lucide-react';

// Referral constants (same as MeinTarifScreen)
const INVITE_URL = 'https://sostudy.de/invite/abc123';
const INVITE_TEXT = 'Lerne smarter mit SoStudy – KI-gestützte Lernhilfe für Schüler! Nutze meinen Einladungslink:';

import { getCompletedExams, getTopicBadgeNumber } from '@/examapp/utils/completedExamsStorage';
import type { CompletedExam } from '@/examapp/utils/completedExamsStorage';
import CompletedExamCard, { CompletedExamCardData } from '@/app/components/CompletedExamCard';
import { MOCK_TUTORS, formatTutorName } from '@/mocks';
import TutoringProgressWidget from './TutoringProgressWidget';
import AllTutorsSheet from './AllTutorsSheet';
import AllExtraSessionsSheet from './AllExtraSessionsSheet';
import { MOCK_EXTRA_SESSIONS, APP_NOW } from '@/mocks/extraSessions.mock';
import { useCancelledExtraSessions } from '@/app/components/cancelledExtraSessionsStore';

interface FlashcardSet {
  id: number;
  subject: string;
  kategorie: string;
  thema: string;
  unterthema: string;
  title: string;
  cardCount: number;
  progress: number;
  createdDate: Date;
  lastOpened?: Date;
  cards: Array<{ id: string; question: string; answer: string }>;
}

interface HomeScreenMobileProps {
  onNavigateToKITools?: () => void;
  onNavigateToMyFlashcards?: () => void;
  onNavigateToExamSimulation?: () => void;
  onNavigateToGenerateFlashcards?: () => void;
  onNavigateToTodoManagement?: () => void;
  onNavigateToLernanalyse?: () => void;
  onNavigateToCompletedExams?: () => void;
  onOpenTeacherProfile?: (teacherId: string) => void;
  onOpenTutoringActivation?: () => void;
  onOpenTutoringProgress?: () => void;
  onShowKlassenarbeiten?: () => void;
  onShowSchulaufgaben?: () => void;
  onOpenStreakScreen?: () => void;
  onOpenCreditHistory?: () => void;
  allSets?: FlashcardSet[];
  onOpenFlashcardSet?: (set: FlashcardSet) => void;
  onCompletedExamClick?: (examId: string) => void;
  refreshCompletedExams?: number;
  /** Prep-todo callbacks for TodoCardsSection */
  onGenerateForWeakness?: (context: any) => void;
  onStartExamSimulation?: (context: any) => void;
  /** Notifies parent when a bottom sheet opens/closes — used to hide MobileNavigation */
  onBottomSheetChange?: (open: boolean) => void;
  /** Tap an Extra-Stunde card → navigate to Meetings screen and open its detail view */
  onOpenExtraSession?: (extraSessionId: string) => void;
}

export default React.memo(function HomeScreenMobile({ 
  onNavigateToKITools, 
  onNavigateToMyFlashcards, 
  onNavigateToExamSimulation, 
  onNavigateToGenerateFlashcards, 
  onNavigateToTodoManagement,
  onNavigateToLernanalyse,
  onNavigateToCompletedExams,
  onOpenTeacherProfile,
  onOpenTutoringActivation,
  onOpenTutoringProgress,
  onShowKlassenarbeiten,
  onShowSchulaufgaben,
  onOpenStreakScreen,
  onOpenCreditHistory,
  allSets = [],
  onOpenFlashcardSet,
  onCompletedExamClick,
  refreshCompletedExams,
  onGenerateForWeakness,
  onStartExamSimulation,
  onBottomSheetChange,
  onOpenExtraSession,
}: HomeScreenMobileProps) {
  const [selectedDate, setSelectedDate] = useState<{ day: string; date: string; fullDate: Date; isManual?: boolean } | null>(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [todoFilters, setTodoFilters] = useState({
    nachhilfe: true,
    karteikarten: true,
    prufung: true
  });
  
  // Load most recently completed exams (sorted by completion date, not viewed date)
  const [recentCompletedExams, setRecentCompletedExams] = useState<CompletedExam[]>([]);
  
  React.useEffect(() => {
    const allExams = getCompletedExams();
    // Sort by completedAt (newest first) and take top 10
    const sortedByCompletion = [...allExams]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 10);
    setRecentCompletedExams(sortedByCompletion);
  }, [refreshCompletedExams]); // Refresh when new exams are completed

  // Reset selectedDate beim Mount - verhindert "Flackern" von altem Zustand
  React.useEffect(() => {
    setSelectedDate(null);
  }, []);

  const user = useUser();
  const [showAllTutors, setShowAllTutors] = useState(false);
  const [showAllExtraSessions, setShowAllExtraSessions] = useState(false);
  const cancelledExtraSessionIds = useCancelledExtraSessions();

  // Notify parent when any bottom sheet opens/closes → hides MobileNavigation
  React.useEffect(() => {
    onBottomSheetChange?.(showAllTutors || showAllExtraSessions);
  }, [showAllTutors, showAllExtraSessions, onBottomSheetChange]);

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] flex flex-col pt-safe">
      {/* Content Area - scrollable with footer space */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden pb-[94px] scrollbar-hide" 
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Header with Profile */}
        <MobileHeader onStreakClick={onOpenStreakScreen} />

        <div className="px-5 pt-2">
          {/* Profil-Vervollständigen-Hinweis (Schul-Daten nach dem Dashboard, 28-Mai-Wireframe) */}
          <CompleteProfileBanner />

          {/* Gesamtfortschritt Progress-Bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70">
                Gesamtfortschritt
              </span>
              <span className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                {OVERALL_PROGRESS}%
              </span>
            </div>
            <div className="w-full h-[8px] rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${OVERALL_PROGRESS}%`,
                  background: 'linear-gradient(to right, #00D4AA, #00B894)',
                }}
              />
            </div>
          </div>

          {/* Your ToDo's Section */}
          <div className="mb-5">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-white whitespace-nowrap">
                Deine ToDo's
              </p>
              <div className="flex items-center gap-4">
                {/* Add Task Button - Figma Import */}
                <div className="w-[176px] h-[38px] cursor-pointer" onClick={onNavigateToTodoManagement}>
                  <AddTaskButton />
                </div>
                
                {/* Filter Icon - Glassmorphismus */}
                <div className="relative">
                  <button 
                    onClick={() => setShowFilterPopup(!showFilterPopup)}
                    className="w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] flex items-center justify-center transition-all duration-300 active:scale-95"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      willChange: 'transform',
                      transform: 'translateZ(0)',
                      isolation: 'isolate',
                      zIndex: 1
                    }}
                  >
                    <SlidersHorizontal className="w-5 h-5 text-white" />
                    {/* Active filter count indicator */}
                    {Object.values(todoFilters).filter(v => !v).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                        {Object.values(todoFilters).filter(v => v).length}
                      </span>
                    )}
                  </button>
                  {showFilterPopup && (
                    <TodoFilterPopup
                      filters={todoFilters}
                      onFilterChange={(filterName) => {
                        setTodoFilters(prev => ({
                          ...prev,
                          [filterName]: !prev[filterName]
                        }));
                      }}
                      onClose={() => setShowFilterPopup(false)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Date Selector - Swipeable */}
            <div className="mb-4">
              <SwipeableDateSelector onDateChange={(date, isManual) => setSelectedDate({ ...date, isManual })} />
            </div>

            {/* Task Cards - NEW MODERN DESIGN */}
            <TodoCardsSection selectedDate={selectedDate} filters={todoFilters} onGenerateForWeakness={onGenerateForWeakness} onStartExamSimulation={onStartExamSimulation} allSets={allSets} onOpenFlashcardSet={onOpenFlashcardSet} />
          </div>

          {/* AI Tools Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">
                KI-Tools
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Generate Flashcards */}
              <button
                onClick={onNavigateToGenerateFlashcards}
                className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl h-[120px] flex flex-col items-center justify-center p-4 transition-all duration-300 active:scale-[0.98]"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                  isolation: 'isolate',
                  zIndex: 1
                }}
              >
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <Sparkles className="w-[44px] h-[44px] mb-3 text-white" strokeWidth={1.5} />
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white text-center leading-[16px]">
                    Karteikarten<br />generieren
                  </p>
                </div>
              </button>

              {/* Exam Simulation */}
              <button
                onClick={onNavigateToExamSimulation}
                className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl h-[120px] flex flex-col items-center justify-center p-4 transition-all duration-300 active:scale-[0.98]"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                  isolation: 'isolate',
                  zIndex: 1
                }}
              >
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <GraduationCap className="w-[44px] h-[44px] mb-3 text-white" strokeWidth={1.5} />
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white text-center leading-[16px]">
                    Prüfungs-<br />simulation
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 🎯 Lernanalyse Quick Access – 4 Rows */}
          <div className="mb-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">
                Lernanalyse
              </p>
              <button onClick={onNavigateToLernanalyse} className="flex items-center gap-0.5">
                <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">Alle zeigen</p>
                <ChevronRight className="w-3.5 h-3.5 text-white/50" />
              </button>
            </div>

            <button
              onClick={onNavigateToLernanalyse}
              className="w-full rounded-2xl overflow-hidden text-left transition-all duration-200 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Row 1: Gesamtfortschritt */}
              {(() => {
                const overallTrend = Math.round(
                  MOCK_SUBJECTS.reduce((s: number, sub: any) => s + sub.trend, 0) / MOCK_SUBJECTS.length
                );
                return (
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(0,212,170,0.08)' }}
                    >
                      <TrendingUp className="w-3.5 h-3.5" style={{ color: '#00D4AA' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white leading-[16px] truncate">
                        Gesamtfortschritt
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">
                        {OVERALL_PROGRESS}%
                      </span>
                      {overallTrend > 0 && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                      {overallTrend < 0 && <TrendingDown className="w-3.5 h-3.5" style={{ color: '#FF4444' }} />}
                      {overallTrend === 0 && <Minus className="w-3.5 h-3.5 text-white/30" />}
                    </div>
                  </div>
                );
              })()}

              <div className="mx-4 h-px bg-white/[0.04]" />

              {/* Row 2: Schwächen */}
              {(() => {
                const weaknessCount = MOCK_WEAKNESSES.length;
                const criticalCount = MOCK_WEAKNESSES.filter(w => w.severity === 'critical').length;
                return (
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(255,107,107,0.08)' }}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#FF6B6B' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white leading-[16px] truncate">
                        {weaknessCount} {weaknessCount === 1 ? 'Schwäche' : 'Schwächen'}
                      </p>
                    </div>
                    {criticalCount > 0 && (
                      <span
                        className="font-['Poppins:SemiBold',sans-serif] text-[11px] flex-shrink-0 px-2 py-0.5 rounded-full"
                        style={{ color: '#FF6B6B', background: 'rgba(255,107,107,0.10)', border: '1px solid rgba(255,107,107,0.20)' }}
                      >
                        {criticalCount} kritisch
                      </span>
                    )}
                  </div>
                );
              })()}

              <div className="mx-4 h-px bg-white/[0.04]" />

              {/* Row 3: Wissenslücken */}
              {(() => {
                const gapCount = MOCK_KNOWLEDGE_GAPS_SELF.length;
                const criticalGaps = MOCK_KNOWLEDGE_GAPS_SELF.filter((g: any) => g.severity === 'critical').length;
                return (
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(45,158,120,0.10)' }}
                    >
                      <Brain className="w-3.5 h-3.5" style={{ color: '#2D9E78' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white leading-[16px] truncate">
                        {gapCount} {gapCount === 1 ? 'Wissenslücke' : 'Wissenslücken'}
                      </p>
                    </div>
                    {criticalGaps > 0 && (
                      <span
                        className="font-['Poppins:SemiBold',sans-serif] text-[11px] flex-shrink-0 px-2 py-0.5 rounded-full"
                        style={{ color: '#2D9E78', background: 'rgba(45,158,120,0.10)', border: '1px solid rgba(45,158,120,0.25)' }}
                      >
                        {criticalGaps} kritisch
                      </span>
                    )}
                  </div>
                );
              })()}

              <div className="mx-4 h-px bg-white/[0.04]" />

              {/* Row 4: Risiken */}
              {(() => {
                const riskCount = MOCK_RISKS.length;
                const highRisks = MOCK_RISKS.filter((r: any) => r.riskLevel === 'high').length;
                return (
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(255,184,77,0.10)' }}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" style={{ color: '#FFB84D' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white leading-[16px] truncate">
                        {riskCount} {riskCount === 1 ? 'Risiko' : 'Risiken'}
                      </p>
                    </div>
                    {highRisks > 0 && (
                      <span
                        className="font-['Poppins:SemiBold',sans-serif] text-[11px] flex-shrink-0 px-2 py-0.5 rounded-full"
                        style={{ color: '#FFB84D', background: 'rgba(255,184,77,0.10)', border: '1px solid rgba(255,184,77,0.25)' }}
                      >
                        {highRisks} hoch
                      </span>
                    )}
                  </div>
                );
              })()}

              <div className="mx-4 h-px bg-white/[0.04]" />

              {/* Row 4: Lernziele */}
              <div className="px-4 py-3 flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(167,139,250,0.08)' }}
                >
                  <Target className="w-3.5 h-3.5" style={{ color: '#A78BFA' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white leading-[16px] truncate">
                    {MOCK_ACTIVE_GOALS.length} {MOCK_ACTIVE_GOALS.length === 1 ? 'aktives Lernziel' : 'aktive Lernziele'}
                  </p>
                </div>
              </div>
            </button>

            {/* Hero Zoom-In: Nächste Prüfung — visuell mit Lernanalyse gekoppelt */}
            {(() => {
              const today = new Date('2026-03-18');
              const upcoming = MOCK_UPCOMING_EXAMS
                .map((e) => ({
                  ...e,
                  daysUntil: Math.ceil((new Date(e.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
                }))
                .filter((e) => e.daysUntil > 0)
                .sort((a, b) => a.daysUntil - b.daysUntil);
              const nextExam = upcoming[0];
              const daysUntil = nextExam?.daysUntil ?? 0;
              const pillColor = daysUntil <= 3 ? '#FF6B6B' : daysUntil <= 7 ? '#FFB800' : '#4A9EFF';
              const pillBg = daysUntil <= 3 ? 'rgba(255,107,107,0.10)' : daysUntil <= 7 ? 'rgba(255,184,0,0.10)' : 'rgba(74,158,255,0.10)';
              const pillBorder = daysUntil <= 3 ? 'rgba(255,107,107,0.20)' : daysUntil <= 7 ? 'rgba(255,184,0,0.20)' : 'rgba(74,158,255,0.20)';

              return (
                <div
                  className="mt-2 rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="px-4 py-3.5 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: nextExam ? pillBg : 'rgba(255,255,255,0.05)' }}
                    >
                      <GraduationCap
                        className="w-5 h-5"
                        style={{ color: nextExam ? pillColor : 'rgba(255,255,255,0.5)' }}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/40 uppercase tracking-wide mb-0.5">
                        Nächste Prüfung
                      </p>
                      {nextExam ? (
                        <>
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white leading-[18px] truncate">
                            {nextExam.subject}
                          </p>
                          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/50 leading-[15px]">
                            {nextExam.overallReadiness}% vorbereitet
                          </p>
                        </>
                      ) : (
                        <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/60 leading-[17px]">
                          Keine Prüfung geplant
                        </p>
                      )}
                    </div>
                    {nextExam && (
                      <span
                        className="font-['Poppins:SemiBold',sans-serif] text-[11px] flex-shrink-0 px-2.5 py-1 rounded-full"
                        style={{ color: pillColor, background: pillBg, border: `1px solid ${pillBorder}` }}
                      >
                        in {daysUntil} {daysUntil === 1 ? 'Tag' : 'Tagen'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Schnellzugriff — Runde Kreise, dezent */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">
                Schnellzugriff
              </p>
            </div>
            <div className="flex items-start justify-around px-2">
            <button
              onClick={onShowKlassenarbeiten}
              className="flex flex-col items-center gap-2 active:scale-[0.95] transition-transform"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div
                className="w-[56px] h-[56px] rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <ClipboardList className="w-5 h-5 text-white/75" strokeWidth={2} />
              </div>
              <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/70 leading-tight text-center max-w-[80px]">
                Klassen-<br />arbeiten
              </span>
            </button>
            <button
              onClick={onShowSchulaufgaben}
              className="flex flex-col items-center gap-2 active:scale-[0.95] transition-transform"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div
                className="w-[56px] h-[56px] rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <NotebookPen className="w-5 h-5 text-white/75" strokeWidth={2} />
              </div>
              <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/70 leading-tight text-center max-w-[80px]">
                Schul-<br />aufgaben
              </span>
            </button>
            <button
              onClick={onNavigateToMyFlashcards}
              className="flex flex-col items-center gap-2 active:scale-[0.95] transition-transform"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div
                className="w-[56px] h-[56px] rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Layers className="w-5 h-5 text-white/75" strokeWidth={2} />
              </div>
              <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/70 leading-tight text-center max-w-[80px]">
                Meine<br />Karteikarten
              </span>
            </button>
            </div>
          </div>

          {/* Recently used Flashcards - USING FlashcardItem */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">
                Kürzlich verwendete Karteikarten
              </p>
              <button onClick={onNavigateToMyFlashcards}>
                <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
                  Alle
                </p>
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 scrollbar-hide" style={{ scrollPaddingLeft: '20px' }}>
              <div className="min-w-[20px] flex-shrink-0" aria-hidden="true" />
              {allSets
                .filter(set => set.lastOpened) // Nur Sets mit lastOpened
                .sort((a, b) => (b.lastOpened?.getTime() || 0) - (a.lastOpened?.getTime() || 0)) // Nach lastOpened sortieren
                .slice(0, 5) // Top 5 nehmen für Mobile
                .map(set => (
                  <div key={set.id} className="w-[231px] flex-shrink-0 snap-start">
                    <FlashcardItem 
                      subject={set.subject}
                      title={set.title}
                      cardCount={set.cardCount}
                      progress={set.progress}
                      createdDate={set.createdDate}
                      onClick={() => onOpenFlashcardSet?.(set)}
                    />
                  </div>
                ))}
              {allSets.filter(set => set.lastOpened).length === 0 && (
                <div className="w-full text-center py-8">
                  <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40">
                    Keine kürzlich verwendeten Karteikarten
                  </p>
                </div>
              )}
              <div className="min-w-[20px] flex-shrink-0" aria-hidden="true" />
            </div>
          </div>

          {/* Completed Exams - USING CompletedExamCard */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">
                Abgeschlossene Prüfungen
              </p>
              <button onClick={onNavigateToCompletedExams}>
                <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
                  Alle
                </p>
              </button>
            </div>

            {recentCompletedExams.length === 0 ? (
              <div className="w-full text-center py-8">
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40">
                  Keine abgeschlossenen Prüfungen
                </p>
              </div>
            ) : recentCompletedExams.length <= 1 ? (
              /* Single exam: render full-width, aligned with section title */
              <div className="flex flex-col gap-3 pb-2">
                {recentCompletedExams.slice(0, 1).map(exam => {
                  const examCard: CompletedExamCardData = {
                    id: exam.id,
                    topicName: exam.topicName,
                    subjectName: exam.subjectName,
                    categoryName: exam.categoryName,
                    score: exam.score,
                    totalQuestions: exam.totalQuestions,
                    correctAnswers: exam.correctAnswers,
                    timeSpent: exam.timeSpent,
                    completedAt: exam.completedAt,
                    badgeNumber: getTopicBadgeNumber(exam.topicName, exam.id),
                    subtopicNames: exam.subtopicNames || [],
                    aiGenerated: false,
                    grade: exam.grade
                  };
                  return (
                    <div key={exam.id}>
                      <CompletedExamCard 
                        exam={examCard}
                        onClick={() => onCompletedExamClick?.(exam.id)}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Multiple exams: horizontal scroll */
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 scrollbar-hide" style={{ scrollPaddingLeft: '20px' }}>
                <div className="min-w-[20px] flex-shrink-0" aria-hidden="true" />
                {recentCompletedExams
                  .slice(0, 5)
                  .map(exam => {
                    const examCard: CompletedExamCardData = {
                      id: exam.id,
                      topicName: exam.topicName,
                      subjectName: exam.subjectName,
                      categoryName: exam.categoryName,
                      score: exam.score,
                      totalQuestions: exam.totalQuestions,
                      correctAnswers: exam.correctAnswers,
                      timeSpent: exam.timeSpent,
                      completedAt: exam.completedAt,
                      badgeNumber: getTopicBadgeNumber(exam.topicName, exam.id),
                      subtopicNames: exam.subtopicNames || [],
                      aiGenerated: false,
                      grade: exam.grade
                    };
                    return (
                      <div key={exam.id} className="w-[280px] flex-shrink-0 snap-start">
                        <CompletedExamCard 
                          exam={examCard}
                          onClick={() => onCompletedExamClick?.(exam.id)}
                        />
                      </div>
                    );
                  })}
                <div className="min-w-[20px] flex-shrink-0" aria-hidden="true" />
              </div>
            )}
          </div>

          {/* ===== TUTORING FEATURES – conditional on tutoringStatus ===== */}

          {/* CTA: Nachhilfe aktivieren (notActivated) */}
          {user.tutoringStatus === 'notActivated' && (
            <div className="mb-6">
              <button
                onClick={onOpenTutoringActivation}
                className="w-full rounded-2xl p-5 text-left transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,184,148,0.10), rgba(0,147,121,0.05))',
                  border: '1px solid rgba(0,184,148,0.20)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #00B894, #009379)' }}
                  >
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white mb-0.5">
                      Nachhilfe aktivieren
                    </h3>
                    <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/45 leading-relaxed">
                      Verbinde dich mit Nachhilfelehrern, die dank KI genau deine Schwächen erkennen und gezielt mit dir daran arbeiten.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30 flex-shrink-0" />
                </div>
              </button>
            </div>
          )}

          {/* Status Card: Anfrage gesendet (requestSent) */}
          {user.tutoringStatus === 'requestSent' && user.tutoringRequestData && (
            <div className="mb-6">
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="px-4 py-3.5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#FFB800' }} />
                  <div className="flex-1">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Anfrage gesendet</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40">Dein Nachhilfe-Institut meldet sich bald.</p>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 mb-2">{user.tutoringRequestData.selectedPartner?.name}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-white/30" />
                      <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50">{user.tutoringRequestData.selectedPartner?.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-white/30" />
                      <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50">{user.tutoringRequestData.selectedPartner?.email}</span>
                    </div>
                    {user.tutoringRequestData.selectedPartner?.openingHours && user.tutoringRequestData.selectedPartner.openingHours.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-white/30 mt-px flex-shrink-0" />
                        <div className="flex flex-col">
                          {user.tutoringRequestData.selectedPartner.openingHours.map((line, i) => (
                            <span key={i} className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-[17px]">
                              {line}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* SoStudy Support Hotline */}
                <div
                  className="px-4 py-3 flex items-center gap-2.5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <Headset className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} />
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 leading-relaxed">
                    Probleme oder Fragen? SoStudy-Hotline: <span className="text-white/40">+49 800 7678839</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Locked preview sections (notActivated + requestSent) */}
          {user.tutoringStatus !== 'activated' && (
            <>
              {/* Locked: Your Tutors */}
              <div className="mb-6 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/40">Deine Nachhilfelehrer</p>
                    <Lock className="w-3.5 h-3.5 text-white/20" />
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden" style={{ filter: 'blur(3px)', opacity: 0.35, pointerEvents: 'none' }}>
                  <div className="flex gap-3 px-1 pb-2">
                    {MOCK_TUTORS.slice(0, 3).map((tutor) => (
                      <div key={tutor.id} className="flex-shrink-0 rounded-[12px] overflow-hidden" style={{ width: '110px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="w-full" style={{ height: '105px', background: 'rgba(255,255,255,0.06)' }} />
                        <div className="px-2.5 py-2">
                          <div className="h-3 w-16 rounded bg-white/10" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 mt-2 text-center">
                  {user.tutoringStatus === 'requestSent' ? 'Anfrage gesendet – du wirst benachrichtigt.' : 'Aktiviere Nachhilfe, um diese Funktion zu nutzen.'}
                </p>
              </div>

              {/* Locked: Nachhilfe-Fortschritt */}
              <div className="mb-6 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/40">Nachhilfe-Fortschritt</p>
                    <Lock className="w-3.5 h-3.5 text-white/20" />
                  </div>
                </div>
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    filter: 'blur(3px)',
                    opacity: 0.35,
                    pointerEvents: 'none',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {/* Hero row skeleton: Ring + Title + Stats */}
                  <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/[0.08]" />
                      <div>
                        <div className="h-3 w-24 rounded bg-white/10 mb-1.5" />
                        <div className="h-2 w-20 rounded bg-white/[0.08]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-5 h-5 rounded bg-white/10" />
                        <div className="h-2 w-10 rounded bg-white/[0.08]" />
                      </div>
                      <div className="w-px h-7 bg-white/[0.06]" />
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-5 h-5 rounded bg-white/10" />
                        <div className="h-2 w-10 rounded bg-white/[0.08]" />
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="mx-4 h-px bg-white/[0.04]" />
                  {/* Bottom row skeleton: Aufgaben + Sitzung */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="h-2.5 w-20 rounded bg-white/10 mb-1" />
                        <div className="h-2 w-12 rounded bg-white/[0.08]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="h-2.5 w-20 rounded bg-white/10 mb-1" />
                        <div className="h-2 w-12 rounded bg-white/[0.08]" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 mt-2 text-center">
                  {user.tutoringStatus === 'requestSent' ? 'Anfrage gesendet – du wirst benachrichtigt.' : 'Aktiviere Nachhilfe, um diese Funktion zu nutzen.'}
                </p>
              </div>

              {/* Locked: Extra-Sessions */}
              <div className="mb-6 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/40">Extra-Stunden</p>
                    <Lock className="w-3.5 h-3.5 text-white/20" />
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden" style={{ filter: 'blur(3px)', opacity: 0.35, pointerEvents: 'none' }}>
                  <div className="flex gap-3 px-1 pb-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="rounded-2xl p-3 w-[190px] flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-white/10" />
                          <div className="h-2.5 w-16 rounded bg-white/10" />
                        </div>
                        <div className="h-3 w-full rounded bg-white/10 mb-2" />
                        <div className="h-2 w-20 rounded bg-white/[0.08]" />
                      </div>
                    ))}
                  </div>
                </div>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 mt-2 text-center">
                  {user.tutoringStatus === 'requestSent' ? 'Anfrage gesendet – du wirst benachrichtigt.' : 'Aktiviere Nachhilfe, um diese Funktion zu nutzen.'}
                </p>
              </div>
            </>
          )}

          {/* ===== UNLOCKED TUTORING FEATURES (activated) ===== */}
          {user.tutoringStatus === 'activated' && (
            <>
              {/* Your Tutors */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">
                    Deine Nachhilfelehrer
                  </p>
                  <button onClick={() => setShowAllTutors(true)}>
                    <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
                      Alle
                    </p>
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 scrollbar-hide" style={{ scrollPaddingLeft: '20px' }}>
                  {MOCK_TUTORS.map((tutor) => (
                    <div
                      key={tutor.id}
                      onClick={() => onOpenTeacherProfile?.(tutor.id)}
                      className="flex-shrink-0 snap-start cursor-pointer active:scale-[0.96] transition-transform rounded-[12px] overflow-hidden"
                      style={{
                        width: '110px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      {/* Portrait-Bild */}
                      <div className="relative w-full" style={{ height: '105px' }}>
                        <img
                          src={tutor.avatar}
                          alt={tutor.name}
                          className="w-full h-full object-cover"
                        />
                        <div
                          className="absolute inset-x-0 bottom-0 h-[35px]"
                          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}
                        />
                        {tutor.isOnline && (
                          <div
                            className="absolute top-2 right-2"
                            style={{
                              width: '9px',
                              height: '9px',
                              borderRadius: '50%',
                              background: '#00D4AA',
                              border: '2px solid rgba(0,0,0,0.4)',
                              boxShadow: '0 0 6px rgba(0,212,170,0.5)',
                            }}
                          />
                        )}
                      </div>
                      <div className="px-2.5 py-2">
                        <p
                          className="text-white/90 text-[11px] leading-tight line-clamp-2"
                          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
                        >
                          {formatTutorName(tutor.name)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tutoring Progress Widget */}
              <TutoringProgressWidget onOpenProgress={onOpenTutoringProgress} />

              {/* Extra-Sessions */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">
                    Extra-Stunden
                  </p>
                  <button onClick={() => setShowAllExtraSessions(true)}>
                    <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
                      Alle
                    </p>
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 scrollbar-hide" style={{ scrollPaddingLeft: '20px' }}>
                  {MOCK_EXTRA_SESSIONS.filter(s => new Date(s.startAtISO) >= APP_NOW && !cancelledExtraSessionIds.has(s.id)).slice(0, 3).map((session) => (
                    <div
                      key={session.id}
                      onClick={() => onOpenExtraSession?.(session.id)}
                      className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl p-3 w-[190px] flex-shrink-0 snap-start transition-all duration-300 cursor-pointer active:scale-[0.98]"
                      style={{
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                        isolation: 'isolate',
                        zIndex: 1,
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <img 
                            src={session.avatar} 
                            alt={session.tutorName} 
                            className="w-[32px] h-[32px] rounded-full object-cover"
                          />
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white leading-tight">
                            {session.tutorName}
                          </p>
                        </div>
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white mb-1 leading-tight">
                          {session.subject}
                        </p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/50 leading-tight">
                          {session.date}
                        </p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/50 leading-tight">
                          {session.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Lern-Streak + Lernzeit (volle Details) — klickbar öffnet Streak-Screen */}
          <LernStreakSection onClick={onOpenStreakScreen} />

          {/* Promotional Banner */}
          <ReferralBannerHome onOpenCreditHistory={onOpenCreditHistory} />
        </div>
      </div>

      {/* All Tutors Bottom Sheet */}
      <AllTutorsSheet
        isOpen={showAllTutors}
        onClose={() => setShowAllTutors(false)}
        onOpenTeacherProfile={onOpenTeacherProfile}
      />

      {/* All Extra Sessions Bottom Sheet */}
      <AllExtraSessionsSheet
        isOpen={showAllExtraSessions}
        onClose={() => setShowAllExtraSessions(false)}
        onOpenExtraSession={(id) => {
          setShowAllExtraSessions(false);
          onOpenExtraSession?.(id);
        }}
      />
    </div>
  );
});

// ===== REFERRAL BANNER (matches MeinTarif design) =====
function ReferralBannerHome({ onOpenCreditHistory }: { onOpenCreditHistory?: () => void }) {
  const [linkCopied, setLinkCopied] = useState(false);
  const referrals = 2;
  const REFERRALS_NEEDED = 3;
  const progressPercent = (referrals / REFERRALS_NEEDED) * 100;

  // Credit system mock data
  const totalCredits = 743;
  const planCreditsPerMonth = 500;
  const planCreditsUsed = 257;
  const planUsagePercent = (planCreditsUsed / planCreditsPerMonth) * 100;

  const handleInvite = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'SoStudy – Gemeinsam besser lernen',
          text: INVITE_TEXT,
          url: INVITE_URL,
        });
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(INVITE_URL).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="mb-3">
      {/* Section Header */}
      <h3 className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
        <Gift className="w-4 h-4" />
        Credits & Belohnungen
      </h3>

      {/* Card 1: Freunde einladen */}
      <div
        className="mb-3 rounded-2xl p-4"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
            <Gift className="w-[18px] h-[18px] text-[#F59E0B]" strokeWidth={2} />
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
          Lade 3 Freunde ein und erhalte <span className="text-[#F59E0B] font-['Poppins:Medium',sans-serif]">100 Credits kostenlos</span>.
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
              className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#F97316] transition-all duration-500 ease-out"
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

      {/* Card 2: Meine Credits (Kurzübersicht) */}
      <div
        className="mb-6 rounded-2xl p-4"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white block mb-3">
          Meine Credits
        </span>

        <div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="font-['Poppins:SemiBold',sans-serif] text-[28px] text-[#10B981] leading-none">
              {totalCredits}
            </span>
            <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40">
              Credits verfügbar
            </span>
          </div>

          {/* Compact progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35">
                Plan-Credits diesen Monat
              </span>
              <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/45">
                {planCreditsUsed} / {planCreditsPerMonth}
              </span>
            </div>
            <div className="w-full h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] transition-all duration-500 ease-out"
                style={{ width: `${planUsagePercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={onOpenCreditHistory}
            className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/45 active:text-white/70 transition-colors flex items-center gap-1"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            Verlauf ansehen
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== LERN-STREAK + LERNZEIT SECTION =====
function LernStreakSection({ onClick }: { onClick?: () => void }) {
  // Mock weekly learning time (same data as was in ProfileAnalyticsScreen Übersicht)
  const weeklyHours = 4;
  const weeklyMins = 32;

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wider flex items-center gap-1.5">
          <Flame className="w-4 h-4" />
          Lern-Streak
        </h3>
        <button
          onClick={onClick}
          className="flex items-center gap-0.5 active:opacity-70 transition-opacity"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">Details</p>
          <ChevronRight className="w-3.5 h-3.5 text-white/50" />
        </button>
      </div>
      <div
        className="w-full text-left rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-['Poppins:SemiBold',sans-serif] text-[24px] text-[#FF9F43]">{LEARNING_STREAK}</span>
              <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">Tage</span>
            </div>
            <div className="h-5 w-px bg-white/[0.06]" />
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-white/25" />
              <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">Längste: <span className="text-white/50">12 Tage</span></span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-white/25" />
            <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/40">
              {weeklyHours > 0 ? `${weeklyHours}h ` : ''}{weeklyMins}min
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, i) => {
            const isActive = i < LEARNING_STREAK && i < 7;
            const isToday = i === 0;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    background: isActive
                      ? isToday
                        ? 'rgba(255,159,67,0.20)'
                        : 'rgba(255,159,67,0.10)'
                      : 'rgba(255,255,255,0.03)',
                    border: isToday ? '1px solid rgba(255,159,67,0.35)' : '1px solid transparent',
                  }}
                >
                  {isActive && <Flame className="w-3 h-3" style={{ color: isToday ? '#FF9F43' : 'rgba(255,159,67,0.50)' }} />}
                </div>
                <span
                  className="font-['Poppins:Medium',sans-serif] text-[9px]"
                  style={{ color: isToday ? '#FF9F43' : 'rgba(255,255,255,0.25)' }}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer CTA — orange Pill-Button (einziges klickbares Element in der Card) */}
        <button
          onClick={onClick}
          className="w-full mt-4 flex items-center justify-center gap-1.5 h-[36px] rounded-xl transition-all active:scale-[0.98]"
          style={{
            background: 'rgba(255,159,67,0.10)',
            border: '1px solid rgba(255,159,67,0.20)',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span className="font-['Poppins:SemiBold',sans-serif] text-[12px]" style={{ color: '#FF9F43' }}>
            Zum Lern-Streak
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: '#FF9F43' }} />
        </button>
      </div>
    </div>
  );
}

