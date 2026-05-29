import React from 'react';
import { StatusBar } from "@/imports/Section7";
import svgPaths from "@/imports/svg-umyc99t8pe";
import imgInformation2 from "figma:asset/e51112c4419b0e3840e36fc1512cdd56c4bab645.png";
import img5Be1B62F1B70E1Fb790B348D76Ddb4Becf81401B9B6732 from "figma:asset/49d3c05880ae6ac2ad58868ed10af9056db78537.png";
import imgEllipse2 from "figma:asset/11a2b9c104f9ad331556dffc2e3e770195913d21.png";
import imgTextField from "figma:asset/7d1e1ed3386fd6d04aa380502f655b29865a72c1.png";
import Button from './Button';

interface HomeScreenProps {
  onNavigateToKITools?: () => void;
  onNavigateToMyFlashcards?: () => void;
}

const HomeScreen = React.memo(function HomeScreen({ onNavigateToKITools, onNavigateToMyFlashcards }: HomeScreenProps) {
  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-[55] overflow-hidden flex flex-col">
      {/* iPhone Status Bar */}
      <div className="shrink-0 bg-[#0a0a0a]">
        <StatusBar />
      </div>
      
      {/* Content Area - scrollable with footer space */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden pb-[94px] scrollbar-hide"
      >
        <style>{`
          .flex-1::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="px-6 pt-4">
          {/* Header with Avatar and Bell */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img 
                src={imgEllipse2} 
                alt="Profile" 
                className="w-[42px] h-[42px] rounded-full object-cover"
              />
              <div>
                <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-white">
                  Hello, Sam!
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-[#009379]">
                    Knowledge level
                  </p>
                  <div className="w-[14px] h-[14px] rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16">
                      <path d="M8 3.5C8.27614 3.5 8.5 3.27614 8.5 3V1C8.5 0.723858 8.27614 0.5 8 0.5C7.72386 0.5 7.5 0.723858 7.5 1V3C7.5 3.27614 7.72386 3.5 8 3.5Z" fill="white"/>
                      <path d="M8 1C6.67392 1 5.40215 1.52678 4.46447 2.46447C3.52678 3.40215 3 4.67392 3 6C3 7.326 4 8 4 8C4 8 5 8.674 5 10V11.5C5 11.7761 5.22386 12 5.5 12H10.5C10.7761 12 11 11.7761 11 11.5V10C11 8.674 12 8 12 8C12 8 13 7.326 13 6C13 4.67392 12.4732 3.40215 11.5355 2.46447C10.5979 1.52678 9.32608 1 8 1Z" fill="white"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-white font-['Poppins:SemiBold',sans-serif] text-[14px]">
                25%
              </div>
              <button className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] flex items-center justify-center active:scale-[0.98] transition-transform">
                <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                  <path d="M12 22C10.9 22 10 21.1 10 20H14C14 21.1 13.1 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Your Todo's Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                Your Todo's
              </p>
              <Button size="xs" fullWidth={false}>
                Add Task
              </Button>
              <button className="w-8 h-8 rounded-full bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] flex items-center justify-center active:scale-[0.98] transition-transform">
                <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                </svg>
              </button>
            </div>

            {/* Date Selector */}
            <div className="flex gap-3 mb-4">
              {[
                { day: 'Mo', date: '19', active: true },
                { day: 'Di', date: '20', active: false },
                { day: 'Mi', date: '21', active: false },
                { day: 'Do', date: '22', active: false },
                { day: 'Fr', date: '23', active: false },
                { day: 'Sa', date: '24', active: false },
                { day: 'So', date: '25', active: false },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className={`flex flex-col items-center justify-center w-[40px] h-[55px] rounded-[20px] active:scale-[0.98] transition-all ${
                    item.active ? 'bg-[#009379]' : 'bg-[#62636d]'
                  }`}
                >
                  <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white">
                    {item.day}
                  </p>
                  <p className="font-['Poppins:Medium',sans-serif] text-[16px] text-white">
                    {item.date}
                  </p>
                </button>
              ))}
            </div>

            {/* Task Cards */}
            <div className="space-y-3">
              {/* Individual Lesson Task */}
              <div className="bg-[#2b2c34] rounded-[12px] h-[70px] flex items-center relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#7F3FFF] rounded-l-[12px]" />
                <div className="flex items-center gap-3 pl-4 pr-4 w-full">
                  <img src={imgTextField} alt="Lesson" className="w-[32px] h-[32px]" />
                  <div className="flex-1">
                    <p className="font-['Poppins:Bold',sans-serif] text-[12px] text-white">
                      Einzelunterricht
                    </p>
                    <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-[#999]">
                      Englisch
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-[#737373]">
                      10:00 PM
                    </span>
                    <Button size="xs" fullWidth={false}>
                      Beitreten
                    </Button>
                  </div>
                </div>
              </div>

              {/* Extra Lesson Task */}
              <div className="bg-[#2b2c34] rounded-[12px] h-[70px] flex items-center relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#ffc107] rounded-l-[12px]" />
                <div className="flex items-center gap-3 pl-4 pr-4 w-full">
                  <img src={imgTextField} alt="Lesson" className="w-[32px] h-[32px]" />
                  <div className="flex-1">
                    <p className="font-['Poppins:Bold',sans-serif] text-[12px] text-white">
                      Extra-Lesson
                    </p>
                    <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-[#999]">
                      Tutoring
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-[#737373]">
                      18:00 - 45 Min
                    </span>
                    <button className="bg-[#0a0a0a] rounded-[8px] px-3 py-1.5 active:scale-[0.98] transition-transform">
                      <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white">
                        Demnächst
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Prüfungssimulation Task */}
              <div className="bg-[#2b2c34] rounded-[12px] h-[70px] flex items-center relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#4cadfd] rounded-l-[12px]" />
                <div className="flex items-center gap-3 pl-4 pr-4 w-full">
                  <img src={img5Be1B62F1B70E1Fb790B348D76Ddb4Becf81401B9B6732} alt="Exam" className="w-[32px] h-[32px]" />
                  <div className="flex-1">
                    <p className="font-['Poppins:Bold',sans-serif] text-[12px] text-white">
                      Prüfungssimulation
                    </p>
                    <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-[#999]">
                      Rechtschreibung
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-[#737373]">
                      30 Min
                    </span>
                    <button className="bg-[#0a0a0a] rounded-[8px] px-3 py-1.5 active:scale-[0.98] transition-transform">
                      <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white">
                        Jetzt starten
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Show More Button */}
              <button className="w-full bg-[#40414b] rounded-[10px] h-[43px] flex items-center justify-center active:scale-[0.98] transition-transform">
                <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#b4b4b4]">
                  mehr anzeigen
                </p>
              </button>
            </div>
          </div>

          {/* AI Tools Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                KI-Tools
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Generate Flashcards */}
              <button 
                onClick={onNavigateToKITools}
                className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[15px] h-[105px] flex flex-col items-center justify-between p-3 active:scale-[0.98] transition-transform relative"
              >
                <div className="absolute top-2 right-2 w-[14px] h-[14px]">
                  <img alt="Info" className="w-full h-full object-contain" src={imgInformation2} />
                </div>
                <div className="w-[38px] h-[38px] mt-1">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
                    <path d={svgPaths.p2cfc4b00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white text-center leading-[15px] w-full">
                  Karteikarten<br />generieren
                </p>
              </button>

              {/* Exam Simulation */}
              <button className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[15px] h-[105px] flex flex-col items-center justify-between p-3 active:scale-[0.98] transition-transform relative">
                <div className="absolute top-2 right-2 w-[14px] h-[14px]">
                  <img alt="Info" className="w-full h-full object-contain" src={imgInformation2} />
                </div>
                <div className="w-[40px] h-[40px] mt-1">
                  <img alt="Exam" className="w-full h-full object-contain" src={img5Be1B62F1B70E1Fb790B348D76Ddb4Becf81401B9B6732} />
                </div>
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white text-center leading-[15px] w-full">
                  Prüfungs-<br />simulation
                </p>
              </button>
            </div>
          </div>

          {/* Recently used Flashcards */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">
                Kürzlich verwendete Karteikarten
              </p>
              <button onClick={onNavigateToMyFlashcards} className="active:scale-[0.98] transition-transform">
                <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
                  Alle
                </p>
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 scrollbar-hide" style={{ scrollPaddingLeft: '24px' }}>
              <div className="min-w-[24px] flex-shrink-0" aria-hidden="true" />
              {[
                { title: 'Alg., Bru., Ausrechne..', chips: ['Mathematik', 'Bio'] },
                { title: 'Alg., Bru., Ausrechne..', chips: ['Mathematik', 'Bio'] },
              ].map((card, idx) => (
                <button 
                  key={idx} 
                  className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[12px] p-3 min-w-[160px] flex-shrink-0 active:scale-[0.98] transition-transform snap-start"
                >
                  <div className="w-[32px] h-[32px] mb-2 rounded-[8px] bg-white/[0.08] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <path d={svgPaths.p2cfc4b00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white mb-2 text-left">
                    {card.title}
                  </p>
                  <div className="flex gap-1.5">
                    {card.chips.map((chip, chipIdx) => (
                      <span 
                        key={chipIdx}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-['Poppins:Medium',sans-serif] ${
                          chipIdx === 0 ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
              <div className="min-w-[24px] flex-shrink-0" aria-hidden="true" />
            </div>
          </div>

          {/* Completed Exams */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">
                Abgeschlossene Prüfungen
              </p>
              <button className="active:scale-[0.98] transition-transform">
                <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
                  Alle
                </p>
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { title: 'Alg., Bru., Ausrechne..', chips: ['Mathematik', 'Bio'] },
                { title: 'Alg., Bru., Ausrechne..', chips: ['Mathematik', 'Bio'] },
              ].map((card, idx) => (
                <button 
                  key={idx} 
                  className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[12px] p-3 min-w-[160px] flex-shrink-0 active:scale-[0.98] transition-transform"
                >
                  <div className="w-[32px] h-[32px] mb-2 rounded-[8px] bg-white/[0.08] flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <path d={svgPaths.p2cfc4b00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white mb-2 text-left">
                    {card.title}
                  </p>
                  <div className="flex gap-1.5">
                    {card.chips.map((chip, chipIdx) => (
                      <span 
                        key={chipIdx}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-['Poppins:Medium',sans-serif] ${
                          chipIdx === 0 ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Your Tutors */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">
                Deine Nachhilfelehrer
              </p>
              <button className="active:scale-[0.98] transition-transform">
                <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
                  Alle
                </p>
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { name: 'Sebastian Müller', img: imgEllipse2 },
                { name: 'Annika Kurz', img: imgEllipse2 },
              ].map((tutor, idx) => (
                <button 
                  key={idx} 
                  className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[12px] p-3 min-w-[120px] flex-shrink-0 flex flex-col items-center active:scale-[0.98] transition-transform"
                >
                  <img 
                    src={tutor.img} 
                    alt={tutor.name} 
                    className="w-[60px] h-[60px] rounded-full object-cover mb-2"
                  />
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white text-center">
                    {tutor.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Extra-Sessions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">
                Extra-Stunden
              </p>
              <button className="active:scale-[0.98] transition-transform">
                <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
                  Alle
                </p>
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { name: 'Sebastian Müller', topic: 'Algebra + Differentialrechnung', date: '10. September', time: '18:00 - 19:00', img: imgEllipse2 },
                { name: 'Sebastian Müller', topic: 'Logarithmisch + Logarithmusfunktionen', date: '13. September', time: '16:00 - 17:30', img: imgEllipse2 },
              ].map((session, idx) => (
                <button 
                  key={idx} 
                  className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[12px] p-3 min-w-[160px] flex-shrink-0 active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img 
                      src={session.img} 
                      alt={session.name} 
                      className="w-[32px] h-[32px] rounded-full object-cover"
                    />
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white text-left">
                      {session.name}
                    </p>
                  </div>
                  <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-white mb-1 text-left">
                    {session.topic}
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-[#999] text-left">
                    {session.date} • {session.time}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Recently viewed Documents */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">
                Kürzlich angesehene Dokumente
              </p>
              <button className="active:scale-[0.98] transition-transform">
                <p className="font-['Poppins:Bold',sans-serif] text-[11px] text-white">
                  Alle
                </p>
              </button>
            </div>

            <div className="space-y-2">
              <button className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[12px] p-3 flex items-center gap-3 w-full active:scale-[0.98] transition-transform">
                <div className="w-[40px] h-[40px] rounded-[8px] bg-white/[0.08] flex items-center justify-center">
                  <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM6 4H13V9H18V20H6V4Z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white">
                    Quantenmechanik Notizen
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-[#999]">
                    Lehrer • Richard Stark
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-[#666]">
                    Mathematik • 15. Dezember 2024
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="mb-6 bg-gradient-to-r from-[#009379] to-[#00705C] rounded-[15px] p-4">
            <p className="font-['Poppins:Bold',sans-serif] text-[14px] text-white mb-1">
              Für jeden eingeladenen Freund:
            </p>
            <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white mb-3">
              2 Extra-Stunden kostenlos für beide!
            </p>
            <button className="bg-white rounded-[10px] px-4 py-2 flex items-center gap-2 active:scale-[0.98] transition-transform">
              <span className="font-['Poppins:Bold',sans-serif] text-[12px] text-[#009379]">
                EINLADEN
              </span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#009379" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default HomeScreen;