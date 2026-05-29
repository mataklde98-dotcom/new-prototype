import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Sparkles, GraduationCap } from 'lucide-react';
import { Flame, TrendingUp, BarChart3, Clock, Star } from 'lucide-react';
import { Gift, Users, Copy, Check, Zap } from 'lucide-react';
import SwipeableDateSelector from "@/app/components/SwipeableDateSelector";
import AddTaskButton from "@/app/components/AddTaskButton";
import TodoCardsSection from "@/app/components/TodoCardsSection";
import TodoFilterPopup from "@/app/components/TodoFilterPopup";
import FlashcardItem from "@/app/components/FlashcardItem";
import StudentProfileCard from "@/app/components/StudentProfileCard";
import CompleteProfileBanner from "@/app/components/onboarding/CompleteProfileBanner";
import SkillMapCard from "@/app/components/SkillMapCard";
import { LEARNING_STREAK } from "@/app/components/ProfileAnalyticsScreen";
import svgPaths from "@/imports/svg-umyc99t8pe";
import imgInformation2 from "figma:asset/e51112c4419b0e3840e36fc1512cdd56c4bab645.png";
import img5Be1B62F1B70E1Fb790B348D76Ddb4Becf81401B9B6732 from "figma:asset/49d3c05880ae6ac2ad58868ed10af9056db78537.png";
import imgRectangle24976 from "figma:asset/346fdc3e76f612a8600da1fd68322c302cd42e1c.png";
import imgEllipse2 from "figma:asset/11a2b9c104f9ad331556dffc2e3e770195913d21.png";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCompletedExams, getTopicBadgeNumber } from '@/examapp/utils/completedExamsStorage';
import type { CompletedExam } from '@/examapp/utils/completedExamsStorage';
import CompletedExamCard, { CompletedExamCardData } from '@/app/components/CompletedExamCard';
import { useDesktopHeaderLayout } from '@/hooks/useDesktopHeaderLayout';
import { MOCK_TUTORS, formatTutorName } from '@/mocks';

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

interface HomeScreenDesktopProps {
  onNavigateToKITools?: () => void;
  onNavigateToMyFlashcards?: () => void;
  onNavigateToExamSimulation?: () => void;
  onNavigateToGenerateFlashcards?: () => void;
  onNavigateToTodoManagement?: () => void;
  onNavigateToLernanalyse?: () => void;
  onOpenTeacherProfile?: (teacherId: string) => void;
  allSets?: FlashcardSet[];
  onOpenFlashcardSet?: (set: FlashcardSet) => void;
  onCompletedExamClick?: (examId: string) => void;
  refreshCompletedExams?: number;
  onGenerateForWeakness?: (context: any) => void;
  onStartExamSimulation?: (context: any) => void;
  onOpenCreditHistory?: () => void;
}

const HomeScreenDesktop = React.memo(function HomeScreenDesktop({ 
  onNavigateToKITools, 
  onNavigateToMyFlashcards, 
  onNavigateToExamSimulation, 
  onNavigateToGenerateFlashcards, 
  onNavigateToTodoManagement,
  onNavigateToLernanalyse,
  onOpenTeacherProfile,
  allSets = [], 
  onOpenFlashcardSet,
  onCompletedExamClick,
  refreshCompletedExams,
  onGenerateForWeakness,
  onStartExamSimulation,
  onOpenCreditHistory,
}: HomeScreenDesktopProps) {
  const [selectedDate, setSelectedDate] = useState<{ day: string; date: string; fullDate: Date; isManual?: boolean } | null>(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [todoFilters, setTodoFilters] = useState({
    nachhilfe: true,
    karteikarten: true,
    prufung: true
  });
  
  // Load most recently completed exams (sorted by completion date, not viewed date)
  const [recentCompletedExams, setRecentCompletedExams] = useState<CompletedExam[]>([]);
  
  useEffect(() => {
    const allExams = getCompletedExams();
    // Sort by completedAt (newest first) and take top 10
    const sortedByCompletion = [...allExams]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 10);
    setRecentCompletedExams(sortedByCompletion);
  }, [refreshCompletedExams]); // Refresh when new exams are completed
  
  // Reset selectedDate beim Mount - verhindert "Flackern" von altem Zustand
  useEffect(() => {
    setSelectedDate(null);
  }, []);
  
  // Refs for carousel scrolling
  const flashcardsScrollRef = useRef<HTMLDivElement>(null);
  const formsScrollRef = useRef<HTMLDivElement>(null);
  const tutorsScrollRef = useRef<HTMLDivElement>(null);
  const sessionsScrollRef = useRef<HTMLDivElement>(null);

  // Adaptive header: track ToDo card width via shared hook
  const todoCardRef = useRef<HTMLDivElement>(null);
  const { isNarrow: isCompactHeader } = useDesktopHeaderLayout(todoCardRef, 420);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div>
      {/* Profil-Vervollständigen-Hinweis (Schul-Daten nach dem Dashboard, 28-Mai-Wireframe) */}
      <CompleteProfileBanner />

      {/* TOP SECTION: Two Column Layout - Profil/Skill Map + ToDo's */}
      <div className="grid grid-cols-1 min-[900px]:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] min-[1440px]:grid-cols-[minmax(320px,380px)_minmax(0,1fr)] gap-5 mb-6">
        {/* LEFT COLUMN - Profile + Skill Map */}
        <div className="flex flex-col gap-5">
          <StudentProfileCard />
          <SkillMapCard />
        </div>

        {/* RIGHT COLUMN - Your ToDo's in Card with Fixed Height */}
        <div ref={todoCardRef} className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.1] rounded-[18px] p-5 transition-all duration-300 hover:border-white/[0.15] flex flex-col h-full max-h-[660px] min-w-0 overflow-hidden" style={{ isolation: 'isolate', zIndex: 1 }}>
          {/* Header - Fixed, overflow-safe */}
          <div className="flex items-center justify-between gap-3 mb-4 flex-shrink-0 min-w-0">
            <h2 className="font-['Poppins:Bold',sans-serif] text-[20px] text-white truncate min-w-0 flex-shrink-0">
              Deine To-Do's
            </h2>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
              <AddTaskButton onClick={onNavigateToTodoManagement} compact={isCompactHeader} />
              <div className="relative">
                <button 
                  onClick={() => setShowFilterPopup(!showFilterPopup)}
                  className="w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] flex items-center justify-center hover:border-white/[0.18] transition-colors active:scale-95"
                >
                  <SlidersHorizontal className="w-4 h-4 text-white" />
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
          
          {/* Date Selector - Fixed */}
          <div className="mb-4 flex-shrink-0">
            <SwipeableDateSelector onDateChange={(date, isManual) => setSelectedDate({ ...date, isManual })} />
          </div>
          
          {/* Scrollable Todo Cards Area - Max 4 ToDos visible */}
          <div className="overflow-y-auto pr-2 scroll-smooth max-h-[370px] scrollbar-thin">
            <TodoCardsSection selectedDate={selectedDate} filters={todoFilters} onGenerateForWeakness={onGenerateForWeakness} onStartExamSimulation={onStartExamSimulation} allSets={allSets} onOpenFlashcardSet={onOpenFlashcardSet} />
          </div>
        </div>
      </div>

      {/* 🎯 Lernfokus Card – Schwachstellen + Streak + Gesamtscore (wie Mobile) */}
      {/* TODO: Replace hardcoded mock data with real data source / selectors.
          - Streak, Score, Weaknesses are placeholders.
          - Add empty/loading state when data is unavailable.
          - Card layout must remain safe: truncate + min-w-0 are mandatory. */}
      <div className="mb-6">
        <button
          onClick={onNavigateToLernanalyse}
          className="w-full relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:border-white/[0.15] text-left group"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Hover Glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(147,51,234,0.4), transparent 70%)',
              transitionProperty: 'opacity',
              transitionDuration: '0.15s',
              transitionTimingFunction: 'ease-out'
            }}
          />

          {/* Header: Streak + Score + Lernanalyse Link */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-4 min-w-0 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-orange-400">{LEARNING_STREAK} Tage</span>
              </div>
              <div className="w-px h-3.5 bg-white/10 flex-shrink-0" />
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">72%</span>
                <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">Gesamt</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/40 group-hover:text-white/60 transition-colors">Lernanalyse</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60 transition-colors" />
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/[0.06] mb-3 relative z-10" />

          {/* Schwachstellen */}
          <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/50 mb-2.5 tracking-wide uppercase relative z-10">
            Lernfokus
          </p>
          <div className="flex flex-col gap-2 relative z-10">
            {[
              { name: 'Quadratische Funktionen', subject: 'Mathe', score: 28, color: '#FF4444' },
              { name: 'Passe Compose', subject: 'Franz.', score: 35, color: '#FF4444' },
              { name: 'Zellatmung', subject: 'Bio', score: 42, color: '#FFB800' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white truncate">{item.name}</span>
                  <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30 flex-shrink-0">{item.subject}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <div className="w-[52px] h-[4px] rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                  </div>
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/60 w-[28px] text-right">{item.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </button>
      </div>

      {/* AI Tools & Recently used Flashcards */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">
            KI-Tools & Kürzlich verwendete Karteikarten
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll(flashcardsScrollRef, 'left')}
              className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] flex items-center justify-center hover:border-white/[0.18] transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button 
              onClick={() => scroll(flashcardsScrollRef, 'right')}
              className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] flex items-center justify-center hover:border-white/[0.18] transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-[140px_1px_1fr] gap-3 items-start">
          {/* Generate Flashcards Button */}
          <button 
            onClick={onNavigateToGenerateFlashcards}
            className="group relative overflow-hidden bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] hover:border-white/[0.18] rounded-2xl h-[100px] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
          >
            {/* Hover Glow Effect */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-15 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(97,140,255,0.4), transparent 70%)',
                transitionProperty: 'opacity',
                transitionDuration: '0.15s',
                transitionTimingFunction: 'ease-out'
              }}
            />
            
            <div className="absolute top-2 right-2 w-[13px] h-[13px] opacity-40 group-hover:opacity-70 transition-opacity">
              <img alt="Info" className="w-full h-full object-contain" src={imgInformation2} />
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <Sparkles className="w-[36px] h-[36px] text-white mb-2" strokeWidth={1.5} />
              <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white text-center leading-[14px]">
                Karteikarten<br />generieren
              </p>
            </div>
          </button>

          {/* Vertical Divider */}
          <div className="w-px h-[100px] bg-white/[0.08]" />

          {/* Recently used Flashcards Carousel */}
          <div className="overflow-hidden">
            <div 
              ref={flashcardsScrollRef}
              className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide" 
            >
              {allSets
                .filter(set => set.lastOpened) // Nur Sets mit lastOpened
                .sort((a, b) => (b.lastOpened?.getTime() || 0) - (a.lastOpened?.getTime() || 0)) // Nach lastOpened sortieren
                .slice(0, 6) // Top 6 nehmen für Desktop
                .map(set => (
                  <div key={set.id} className="w-[220px] flex-shrink-0">
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
                  <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/40">
                    Keine kürzlich verwendeten Karteikarten
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exam Simulation & Completed Exams */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">
            Prüfungssimulation & Abgeschlossene Prüfungen
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll(formsScrollRef, 'left')}
              className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] flex items-center justify-center hover:border-white/[0.18] transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button 
              onClick={() => scroll(formsScrollRef, 'right')}
              className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] flex items-center justify-center hover:border-white/[0.18] transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-[140px_1px_1fr] gap-3 items-start">
          {/* Exam Simulation Button */}
          <button 
            onClick={onNavigateToExamSimulation}
            className="group relative overflow-hidden bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] hover:border-white/[0.18] rounded-2xl h-[100px] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
          >
            {/* Hover Glow Effect */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-15 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(0,147,121,0.4), transparent 70%)',
                transitionProperty: 'opacity',
                transitionDuration: '0.15s',
                transitionTimingFunction: 'ease-out'
              }}
            />
            
            <div className="absolute top-2 right-2 w-[13px] h-[13px] opacity-40 group-hover:opacity-70 transition-opacity">
              <img alt="Info" className="w-full h-full object-contain" src={imgInformation2} />
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <GraduationCap className="w-[36px] h-[36px] text-white mb-2" strokeWidth={1.5} />
              <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white text-center leading-[14px]">
                Prüfungs-<br />simulation
              </p>
            </div>
          </button>

          {/* Vertical Divider */}
          <div className="w-px h-[100px] bg-white/[0.08]" />

          {/* Completed Exams Carousel */}
          <div className="overflow-hidden">
            <div 
              ref={formsScrollRef}
              className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide" 
            >
              {recentCompletedExams
                .slice(0, 6) // Top 6 recent exams for desktop
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
                    <div key={exam.id} className="min-w-[280px] flex-shrink-0">
                      <CompletedExamCard 
                        exam={examCard}
                        onClick={() => onCompletedExamClick?.(exam.id)}
                      />
                    </div>
                  );
                })}
              {recentCompletedExams.length === 0 && (
                <div className="w-full text-center py-8">
                  <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/40">
                    Keine abgeschlossenen Prüfungen
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Your Tutors Carousel */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">
            Deine Nachhilfelehrer
          </h3>
          <div className="flex items-center gap-2">
            <button className="hover:opacity-80 transition-opacity ml-1">
              <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
                Alle
              </p>
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {MOCK_TUTORS.map((tutor) => (
            <div
              key={tutor.id}
              onClick={() => onOpenTeacherProfile?.(tutor.id)}
              className="flex flex-col flex-shrink-0 cursor-pointer rounded-[14px] overflow-hidden"
              style={{
                width: '140px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Großes Portrait-Bild */}
              <div className="relative w-full" style={{ height: '130px' }}>
                <img
                  src={tutor.avatar}
                  alt={tutor.name}
                  className="w-full h-full object-cover"
                />
                {/* Gradient-Overlay unten für bessere Lesbarkeit */}
                <div
                  className="absolute inset-x-0 bottom-0 h-[40px]"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}
                />
                {/* Online indicator */}
                {tutor.isOnline && (
                  <div
                    className="absolute top-2.5 right-2.5"
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#00D4AA',
                      border: '2px solid rgba(0,0,0,0.4)',
                      boxShadow: '0 0 6px rgba(0,212,170,0.5)',
                    }}
                  />
                )}
              </div>
              {/* Name */}
              <div className="px-3 py-2.5">
                <p
                  className="text-white/90 text-[12px] leading-tight line-clamp-2"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
                >
                  {formatTutorName(tutor.name)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extra-Sessions Carousel */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">
            Extra-Stunden
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll(sessionsScrollRef, 'left')}
              className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] flex items-center justify-center hover:border-white/[0.18] transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button 
              onClick={() => scroll(sessionsScrollRef, 'right')}
              className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] flex items-center justify-center hover:border-white/[0.18] transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 text-white" />
            </button>
            <button className="hover:opacity-80 transition-opacity ml-1">
              <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
                Alle
              </p>
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div 
            ref={sessionsScrollRef}
            className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide" 
          >
            {[
              { name: 'Sebastian Müller', topic: 'Algebra + Differentialrechnung', date: '10. September', time: '18:00 - 19:00' },
              { name: 'Annika Kurz', topic: 'Logarithmisch + Logarithmusfunktionen', date: '13. September', time: '16:00 - 17:30' },
              { name: 'Michael Schmidt', topic: 'Lineare Algebra Grundlagen', date: '15. September', time: '14:00 - 15:30' },
              { name: 'Laura Weber', topic: 'Quantenmechanik', date: '18. September', time: '10:00 - 11:30' },
            ].map((session, idx) => (
              <div 
                key={idx} 
                className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[14px] p-3 min-w-[220px] hover:border-white/[0.18] transition-all cursor-pointer flex-shrink-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src={imgEllipse2} 
                    alt={session.name} 
                    className="w-[28px] h-[28px] rounded-full object-cover"
                  />
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white leading-tight">
                    {session.name}
                  </p>
                </div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white mb-2 leading-tight">
                  {session.topic}
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-[#999] leading-tight">
                  {session.date}
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-[#999] leading-tight">
                  {session.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently viewed Documents */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">
            Kürzlich angesehene Dokumente
          </h3>
          <button className="hover:opacity-80 transition-opacity">
            <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
              Alle
            </p>
          </button>
        </div>

        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[14px] p-3 flex items-center gap-3 hover:border-white/[0.18] transition-all cursor-pointer">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-white/[0.08] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM6 4H13V9H18V20H6V4Z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white mb-0.5 leading-tight">
              Quantenmechanik Notizen
            </p>
            <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#999] mb-0.5 leading-tight">
              Lehrer • Richard Stark
            </p>
            <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-[#666] leading-tight">
              Mathematik • 15. Dezember 2024
            </p>
          </div>
        </div>
      </div>

      {/* Lern-Streak + Lernzeit */}
      <LernStreakSectionDesktop />

      {/* Promotional Banner */}
      <ReferralBannerDesktop onOpenCreditHistory={onOpenCreditHistory} />
    </div>
  );
});

export default HomeScreenDesktop;

// Referral constants
const INVITE_URL = 'https://sostudy.de/invite/abc123';
const INVITE_TEXT = 'Lerne smarter mit SoStudy – KI-gestützte Lernhilfe für Schüler! Nutze meinen Einladungslink:';

function ReferralBannerDesktop({ onOpenCreditHistory }: { onOpenCreditHistory?: () => void }) {
  const [linkCopied, setLinkCopied] = React.useState(false);
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
            className="flex-1 h-[40px] rounded-xl bg-white/[0.06] border border-white/[0.12] font-['Poppins:Medium',sans-serif] text-[13px] text-white flex items-center justify-center gap-1.5 hover:bg-white/[0.10] active:scale-[0.98] transition-all duration-200"
          >
            <Users className="w-3.5 h-3.5" strokeWidth={2} />
            Einladen
          </button>
          <button
            onClick={handleCopyLink}
            className="h-[40px] px-4 rounded-xl bg-white/[0.06] border border-white/[0.12] font-['Poppins:Medium',sans-serif] text-[13px] text-white flex items-center justify-center gap-1.5 hover:bg-white/[0.10] active:scale-[0.98] transition-all duration-200"
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
        className="mb-4 rounded-2xl p-4"
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
            className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/45 hover:text-white/70 transition-colors flex items-center gap-1"
          >
            Verlauf ansehen
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </>
  );
}

// ===== LERN-STREAK + LERNZEIT SECTION (moved from Übersicht tab) =====
function LernStreakSectionDesktop() {
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