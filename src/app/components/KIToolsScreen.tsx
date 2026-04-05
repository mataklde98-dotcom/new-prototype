import React from 'react';
import { Sparkles, GraduationCap, BookOpen, ClipboardCheck, BarChart3 } from 'lucide-react';
import KIToolsCharacter from './KIToolsCharacter';

interface KIToolsScreenProps {
  onClose?: () => void;
  onNavigateToMyFlashcards?: () => void;
  onNavigateToExamSimulation?: () => void;
  onNavigateToGenerateFlashcards?: () => void;
  onNavigateToCompletedExams?: () => void;
  onNavigateToLernanalyse?: () => void;
}

export default React.memo(function KIToolsScreen({ onClose, onNavigateToMyFlashcards, onNavigateToExamSimulation, onNavigateToGenerateFlashcards, onNavigateToCompletedExams, onNavigateToLernanalyse }: KIToolsScreenProps) {
  return (
    <div className="relative w-full h-full bg-[#0a0a0a] flex flex-col pt-safe">
      {/* Content Area - fills remaining space with footer space */}
      {/* Note: Added 8px top spacing for visual breathing room */}
      <div className="flex-1 overflow-hidden flex flex-col pt-2 pb-[94px]" style={{ WebkitOverflowScrolling: 'touch' }}>
        
        {/* Hero Section with Character and Circle - Memoized for Performance */}
        <KIToolsCharacter />

        {/* AI Tools Grid - 2 columns */}
        <div className="px-4 mb-5 shrink-0">
          <div className="grid grid-cols-2 gap-3">
            {/* Generate Flashcards */}
            <button 
              onClick={onNavigateToGenerateFlashcards}
              className="group relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl h-[120px] flex flex-col items-center justify-center p-4 transition-all duration-300 active:scale-[0.98]"
              style={{
                WebkitTapHighlightColor: 'transparent',
                willChange: 'transform',
                transform: 'translateZ(0)',
                isolation: 'isolate',
                zIndex: 1
              }}
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
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <Sparkles className="w-[44px] h-[44px] mb-3 text-white" strokeWidth={1.5} />
                <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white text-center leading-[16px]">
                  Karteikarten<br />erstellen
                </p>
              </div>
            </button>

            {/* Exam Simulation */}
            <button 
              onClick={onNavigateToExamSimulation}
              className="group relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl h-[120px] flex flex-col items-center justify-center p-4 transition-all duration-300 active:scale-[0.98]"
              style={{
                WebkitTapHighlightColor: 'transparent',
                willChange: 'transform',
                transform: 'translateZ(0)',
                isolation: 'isolate',
                zIndex: 1
              }}
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
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <GraduationCap className="w-[44px] h-[44px] mb-3 text-white" strokeWidth={1.5} />
                <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white text-center leading-[16px]">
                  Prüfungs-<br />Simulation
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Your Library Section */}
        <div className="px-4 shrink-0">
          <p className="font-['Poppins:Bold',sans-serif] text-[12px] text-[rgba(255,255,255,0.7)] mb-3">
            Deine Bibliothek
          </p>
          
          {/* Library Grid - 3 columns */}
          <div className="grid grid-cols-3 gap-3">
            {/* My Flashcards */}
            <button 
              onClick={onNavigateToMyFlashcards}
              className="group relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl h-[120px] flex flex-col items-center justify-center p-3 transition-all duration-300 active:scale-[0.98]"
              style={{
                WebkitTapHighlightColor: 'transparent',
                willChange: 'transform',
                transform: 'translateZ(0)',
                isolation: 'isolate',
                zIndex: 1
              }}
            >
              {/* Hover Glow Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-12 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(97,140,255,0.3), transparent 70%)',
                  transitionProperty: 'opacity',
                  transitionDuration: '0.15s',
                  transitionTimingFunction: 'ease-out'
                }}
              />
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <BookOpen className="w-[38px] h-[38px] mb-2 text-white" strokeWidth={1.5} />
                <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white text-center leading-[13px]">
                  Meine<br />Karteikarten
                </p>
              </div>
            </button>

            {/* Completed Exams */}
            <button 
              onClick={onNavigateToCompletedExams}
              className="group relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl h-[120px] flex flex-col items-center justify-center p-3 transition-all duration-300 active:scale-[0.98]"
              style={{
                WebkitTapHighlightColor: 'transparent',
                willChange: 'transform',
                transform: 'translateZ(0)',
                isolation: 'isolate',
                zIndex: 1
              }}
            >
              {/* Hover Glow Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-12 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(0,147,121,0.3), transparent 70%)',
                  transitionProperty: 'opacity',
                  transitionDuration: '0.15s',
                  transitionTimingFunction: 'ease-out'
                }}
              />
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <ClipboardCheck className="w-[38px] h-[38px] mb-2 text-white" strokeWidth={1.5} />
                <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white text-center leading-[13px]">
                  Abgeschlossene<br />Prüfungen
                </p>
              </div>
            </button>

            {/* Lernanalyse */}
            <button 
              onClick={onNavigateToLernanalyse}
              className="group relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl h-[120px] flex flex-col items-center justify-center p-3 transition-all duration-300 active:scale-[0.98]"
              style={{
                WebkitTapHighlightColor: 'transparent',
                willChange: 'transform',
                transform: 'translateZ(0)',
                isolation: 'isolate',
                zIndex: 1
              }}
            >
              {/* Hover Glow Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-12 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(147,51,234,0.3), transparent 70%)',
                  transitionProperty: 'opacity',
                  transitionDuration: '0.15s',
                  transitionTimingFunction: 'ease-out'
                }}
              />
              
              <div className="relative z-10 flex flex-col items-center justify-center">
                <BarChart3 className="w-[38px] h-[38px] mb-2 text-white" strokeWidth={1.5} />
                <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white text-center leading-[13px]">
                  Lernanalyse
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});