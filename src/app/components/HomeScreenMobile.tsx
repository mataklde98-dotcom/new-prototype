import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import MobileHeader from "@/app/components/MobileHeader";
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
import { Flame, TrendingUp, TrendingDown, ChevronRight, Minus, Lock, Zap, CheckCircle2, Phone, Mail, Clock, Headset, Star } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { LEARNING_STREAK } from "@/app/components/ProfileAnalyticsScreen";
import { OVERALL_PROGRESS, MOCK_SUBJECTS, MOCK_ACTIVE_GOALS } from "@/app/components/ProfileAnalyticsScreen";
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
  allSets?: FlashcardSet[];
  onOpenFlashcardSet?: (set: FlashcardSet) => void;
  onCompletedExamClick?: (examId: string) => void;
  refreshCompletedExams?: number;
  /** Prep-todo callbacks for TodoCardsSection */
  onGenerateForWeakness?: (context: any) => void;
  onStartExamSimulation?: (context: any) => void;
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
  allSets = [], 
  onOpenFlashcardSet,
  onCompletedExamClick,
  refreshCompletedExams,
  onGenerateForWeakness,
  onStartExamSimulation,
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
        <MobileHeader />

        <div className="px-5 pt-2">
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

          {/* 🎯 Auf einen Blick Card – Dynamic priority-based items + Gesamtleistung */}
          <div className="mb-6">
            <button
              onClick={onNavigateToLernanalyse}
              className="w-full relative overflow-hidden rounded-2xl p-4 transition-all duration-300 active:scale-[0.98] text-left"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                WebkitTapHighlightColor: 'transparent',
                willChange: 'transform',
                transform: 'translateZ(0)',
                isolation: 'isolate',
              }}
            >
              {/* Header: Gesamtfortschritt + Lernanalyse link */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">Gesamtfortschritt</span>
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">{OVERALL_PROGRESS}%</span>
                  {(() => {
                    const overallTrend = Math.round(MOCK_SUBJECTS.reduce((s: number, sub: any) => s + sub.trend, 0) / MOCK_SUBJECTS.length);
                    if (overallTrend === 0) return <Minus className="w-3.5 h-3.5 text-white/30" />;
                    return overallTrend > 0
                      ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      : <TrendingDown className="w-3.5 h-3.5 text-[#FF4444]" />;
                  })()}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/40">Lernanalyse</span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/[0.06] mb-3" />

              {/* Auf einen Blick */}
              <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/50 mb-2.5 tracking-wide uppercase">
                Dein Fokus
              </p>
              <div className="flex flex-col gap-2">
                {(() => {
                  const today = new Date('2026-03-18');
                  const items: { priority: number; label: string; dotColor: string; badge: string; badgeColor: string; subtitle: string }[] = [];

                  // Priority 1 & 3 & 7: Upcoming exams by days
                  for (const exam of MOCK_UPCOMING_EXAMS) {
                    const days = Math.ceil((new Date(exam.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    if (days <= 0) continue;
                    const sub = `Klassenarbeit · ${exam.subject}`;
                    if (days <= 3) {
                      items.push({ priority: 1, label: `${exam.subject}-Klausur`, dotColor: '#FF4444', badge: `In ${days} ${days === 1 ? 'Tag' : 'Tagen'}`, badgeColor: '#FF4444', subtitle: sub });
                    } else if (days <= 7) {
                      items.push({ priority: 3, label: `${exam.subject}-Klausur`, dotColor: '#FFB800', badge: `In ${days} ${days === 1 ? 'Tag' : 'Tagen'}`, badgeColor: '#FFB800', subtitle: sub });
                    } else {
                      items.push({ priority: 7, label: `${exam.subject}-Klausur`, dotColor: '#00D4AA', badge: `In ${days} ${days === 1 ? 'Tag' : 'Tagen'}`, badgeColor: '#00D4AA', subtitle: sub });
                    }
                  }

                  // Priority 2, 4, 8: Learning goals
                  for (const goal of MOCK_ACTIVE_GOALS) {
                    const sub = `Lernziel · ${goal.subject}`;
                    if (goal.status === 'at-risk') {
                      items.push({ priority: 2, label: `${goal.topic}`, dotColor: '#FF4444', badge: 'Gefährdet', badgeColor: '#FF4444', subtitle: sub });
                    } else if (goal.status === 'extended') {
                      items.push({ priority: 4, label: `${goal.topic}`, dotColor: '#FFB800', badge: 'Verschoben', badgeColor: '#FFB800', subtitle: sub });
                    } else if (goal.status === 'on-track') {
                      items.push({ priority: 8, label: `${goal.topic}`, dotColor: '#00D4AA', badge: 'Auf Kurs', badgeColor: '#00D4AA', subtitle: sub });
                    }
                  }

                  // Priority 5 & 6: Subject trends
                  for (const subj of MOCK_SUBJECTS) {
                    if (subj.trend <= -5) {
                      items.push({ priority: 5, label: `${subj.name}`, dotColor: '#FF4444', badge: `${subj.progress}% ↘`, badgeColor: '#FF4444', subtitle: `Fach-Trend · ${subj.name}` });
                    } else if (subj.trend < 0 && subj.trend > -5) {
                      items.push({ priority: 6, label: `${subj.name}`, dotColor: '#FFB800', badge: `${subj.progress}% ↕`, badgeColor: '#FFB800', subtitle: `Fach-Trend · ${subj.name}` });
                    }
                  }

                  items.sort((a, b) => a.priority - b.priority);
                  return items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[6px]" style={{ backgroundColor: item.dotColor }} />
                        <div className="min-w-0 flex-1">
                          <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white truncate block">{item.label}</span>
                          <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30 block mt-0.5 truncate">{item.subtitle}</span>
                        </div>
                      </div>
                      <span
                        className="font-['Poppins:Medium',sans-serif] text-[10px] flex-shrink-0 ml-3 mt-[2px] px-2 py-0.5 rounded-full"
                        style={{ color: item.badgeColor, background: `${item.badgeColor}12`, border: `1px solid ${item.badgeColor}25` }}
                      >
                        {item.badge}
                      </span>
                    </div>
                  ));
                })()}
              </div>

            </button>
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
                  Aktiviere Nachhilfe, um diese Funktion zu nutzen.
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
                  Aktiviere Nachhilfe, um diese Funktion zu nutzen.
                </p>
              </div>

              {/* Locked: Recently viewed Documents */}
              <div className="mb-6 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/40">Kürzlich angesehene Dokumente</p>
                    <Lock className="w-3.5 h-3.5 text-white/20" />
                  </div>
                </div>
                <div className="relative rounded-2xl overflow-hidden" style={{ filter: 'blur(3px)', opacity: 0.35, pointerEvents: 'none' }}>
                  <div className="flex gap-3 px-1 pb-2">
                    <div className="rounded-2xl p-3 w-[280px] flex-shrink-0 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="w-11 h-11 rounded-[10px] bg-white/10" />
                      <div className="flex-1">
                        <div className="h-3 w-32 rounded bg-white/10 mb-1.5" />
                        <div className="h-2 w-24 rounded bg-white/[0.08]" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 mt-2 text-center">
                  Aktiviere Nachhilfe, um diese Funktion zu nutzen.
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
                  <button>
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
                  <button>
                    <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
                      Alle
                    </p>
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 scrollbar-hide" style={{ scrollPaddingLeft: '20px' }}>
                  {[
                    { name: 'Sebastian Müller', topic: 'Algebra + Differentialrechnung', date: '10. September', time: '18:00 - 19:00' },
                    { name: 'Sebastian Müller', topic: 'Logarithmisch + Logarithmusfunktionen', date: '13. September', time: '16:00 - 17:30' },
                  ].map((session, idx) => (
                    <div 
                      key={idx} 
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
                            src={imgEllipse2} 
                            alt={session.name} 
                            className="w-[32px] h-[32px] rounded-full object-cover"
                          />
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white leading-tight">
                            {session.name}
                          </p>
                        </div>
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white mb-2 leading-tight">
                          {session.topic}
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

              {/* Recently viewed Documents */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">
                    Kürzlich angesehene Dokumente
                  </p>
                  <button>
                    <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
                      Alle
                    </p>
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 scrollbar-hide" style={{ scrollPaddingLeft: '20px' }}>
                  <div 
                    className="relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl p-3 w-[280px] flex-shrink-0 snap-start flex items-center gap-3 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      willChange: 'transform',
                      transform: 'translateZ(0)',
                      isolation: 'isolate',
                      zIndex: 1
                    }}
                  >
                    <div className="relative z-10 w-[45px] h-[45px] rounded-[10px] bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM6 4H13V9H18V20H6V4Z" />
                      </svg>
                    </div>
                    <div className="relative z-10 flex-1 min-w-0">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white mb-1 leading-tight">
                        Quantenmechanik Notizen
                      </p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/50 mb-0.5 leading-tight">
                        Lehrer • Richard Stark
                      </p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/30 leading-tight">
                        Mathematik • 15. Dezember 2024
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Lern-Streak + Lernzeit */}
          <LernStreakSection />

          {/* Promotional Banner */}
          <ReferralBannerHome />
        </div>
      </div>
    </div>
  );
});

// ===== REFERRAL BANNER (matches MeinTarif design) =====
function ReferralBannerHome() {
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
    <>
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
            className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/30 active:text-white/50 transition-colors flex items-center gap-1"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            Details anzeigen
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </>
  );
}

// ===== LERN-STREAK + LERNZEIT SECTION =====
function LernStreakSection() {
  // Mock weekly learning time (same data as was in ProfileAnalyticsScreen Übersicht)
  const weeklyHours = 4;
  const weeklyMins = 32;

  return (
    <div className="mb-3">
      <h3 className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
        <Flame className="w-4 h-4" />
        Lern-Streak
      </h3>
      <div
        className="rounded-2xl p-4"
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
      </div>
    </div>
  );
}