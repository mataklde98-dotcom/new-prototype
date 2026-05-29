import { useState } from 'react';
import SubjectIcon from '@/examapp/app/components/SubjectIcon';
import { type Subtopic } from '@/shared-content-selection';
import FlashcardTutorialModal from './FlashcardTutorialModal';
import PremiumSlider from '@/shared-content-selection/PremiumSlider';
import Button from '@/app/components/Button';
import CloseButton from '@/app/components/CloseButton';

type FlashcardConfigurationProps = {
  subjectId: string;
  selectedSubtopics: Subtopic[];
  onStartGeneration: (count: number) => void;
  onBack: () => void;
  onEditSubtopics: () => void;
};

export default function FlashcardConfiguration({ 
  subjectId,
  selectedSubtopics, 
  onStartGeneration, 
  onBack,
  onEditSubtopics 
}: FlashcardConfigurationProps) {
  const [count, setCount] = useState(10);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleGenerateFlashcards = () => {
    onStartGeneration(count);
  };

  const handleSliderChange = (newValue: number) => {
    setCount(newValue);
  };

  return (
    <div className="size-full flex flex-col bg-[#0a0a0a] overscroll-none relative">
      {/* Header */}
      <div className="px-6 py-3 flex-shrink-0 pt-safe lg:mt-[20px] mt-3">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="font-['Poppins:SemiBold',sans-serif] text-[16px] lg:text-[15px] text-white mb-1">
              Generiere Karteikarten
            </h1>
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[13px] text-[#979797]">
              Karteikarten-Einstellungen
            </p>
          </div>
          <CloseButton onClick={onBack} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-40 overflow-y-auto overscroll-none">

        {/* Slider Card */}
        <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl p-5 mb-3">
          <PremiumSlider
            value={count}
            min={5}
            max={50}
            step={1}
            onChange={handleSliderChange}
            label="Karteikarten"
          />
        </div>

        {/* Unterthemen Row — tappable, opens edit */}
        <button
          onClick={onEditSubtopics}
          className="w-full bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-2xl px-4 h-[54px] flex items-center gap-3 mb-5 cursor-pointer transition-all duration-150 active:scale-[0.98] active:border-white/[0.15]"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="w-[32px] h-[32px] rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
            <SubjectIcon subjectId={subjectId} />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white truncate">
              {selectedSubtopics.length} {selectedSubtopics.length === 1 ? 'Unterthema' : 'Unterthemen'}
            </p>
          </div>
          <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-[#009379] flex-shrink-0">
            Bearbeiten
          </span>
          <svg className="w-[14px] h-[14px] text-[#009379]/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Tutorial Link */}
        <div className="text-center">
          <p 
            className="font-['Poppins:Medium',sans-serif] text-[13px] lg:text-[14px] text-[#797979] cursor-pointer transition-colors underline decoration-dotted underline-offset-4"
            onClick={() => setShowTutorial(true)}
          >
            Wie funktioniert die Karteikarten-Generierung?
          </p>
        </div>
      </div>

      {/* CTA Button — fixed bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 10 }}>
        <div 
          className="h-[80px]"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)' }}
        />
        <div className="px-6 pb-6 bg-[#0a0a0a] pointer-events-auto">
          <Button onClick={handleGenerateFlashcards}>
            Karteikarten generieren
          </Button>
        </div>
      </div>

      {/* Tutorial Modal */}
      <FlashcardTutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </div>
  );
}