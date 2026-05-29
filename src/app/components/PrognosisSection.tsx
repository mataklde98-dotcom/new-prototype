import React, { useMemo } from 'react';
import { FlashcardSet } from '@/types/flashcard';
import { TrendingDown, Brain, AlertTriangle } from 'lucide-react';
import FlashcardItem from './FlashcardItem';
import { usePrognosis } from '@/hooks';

export type PrognosisSubTab = 'weakness' | 'risk' | 'knowledge-gap';

interface PrognosisSectionProps {
  onOpenFlashcardSet: (set: FlashcardSet) => void;
  activeSubject: string | null;
  activeKategorie: string | null;
  activeThema: string | null;
  activeUnterthema: string | null;
  searchQuery?: string;
  selectionMode?: boolean;
  selectedCards?: number[];
  onToggleCardSelection?: (id: number) => void;
  isMobile?: boolean;
  allSets?: FlashcardSet[]; // For single source of truth
  activeSubTab: PrognosisSubTab;
  onSubTabChange: (tab: PrognosisSubTab) => void;
}

const SUB_TABS: { key: PrognosisSubTab; label: string; color: string }[] = [
  { 
    key: 'weakness', 
    label: 'Schwächen', 
    color: '#FF6B6B'
  },
  { 
    key: 'risk', 
    label: 'Risiken', 
    color: '#FFB800'
  },
  { 
    key: 'knowledge-gap', 
    label: 'Lücken', 
    color: '#7B61FF'
  },
];

export default function PrognosisSection({
  onOpenFlashcardSet,
  activeSubject,
  activeKategorie,
  activeThema,
  activeUnterthema,
  searchQuery = '',
  selectionMode = false,
  selectedCards = [],
  onToggleCardSelection,
  isMobile = true,
  allSets,
  activeSubTab,
  onSubTabChange,
}: PrognosisSectionProps) {
  // Hook für Prognosis-Daten mit Filter (3-Layer-Architektur: Mocks → Services → Hooks → Components)
  const { 
    filteredWeaknesses, 
    filteredRelevantTopics,
    filteredKnowledgeGaps
  } = usePrognosis({
    activeSubject,
    activeKategorie,
    activeThema,
    activeUnterthema,
    searchQuery,
    allSets
  });

  // Combined and filtered sets based on active sub-tab
  const displaySets = useMemo(() => {
    switch (activeSubTab) {
      case 'weakness':
        return filteredWeaknesses;
      case 'risk':
        return filteredRelevantTopics;
      case 'knowledge-gap':
        return filteredKnowledgeGaps;
      default:
        return filteredWeaknesses;
    }
  }, [activeSubTab, filteredWeaknesses, filteredRelevantTopics, filteredKnowledgeGaps]);

  // Counts for badges – real data, no fake offsets
  const counts = useMemo(() => ({
    weakness: filteredWeaknesses.length,
    risk: filteredRelevantTopics.length,
    'knowledge-gap': filteredKnowledgeGaps.length,
  }), [filteredWeaknesses, filteredRelevantTopics, filteredKnowledgeGaps]);

  const emptyMessages: Record<PrognosisSubTab, string> = {
    'weakness': 'Keine Schwächen für die ausgewählten Filter gefunden',
    'risk': 'Keine Risiken für die ausgewählten Filter gefunden',
    'knowledge-gap': 'Keine Wissenslücken für die ausgewählten Filter gefunden',
  };

  return (
    <div className={`flex flex-col ${isMobile ? 'pb-[160px]' : 'pb-6'}`}>
      {/* Sub-Tab Segmented Control */}
      <div className={`${isMobile ? 'px-4' : ''} mb-5`}>
        <div 
          className="flex gap-1 p-1 rounded-xl w-full"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {SUB_TABS.map((tab) => {
            const isActive = activeSubTab === tab.key;
            const count = counts[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => onSubTabChange(tab.key)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg transition-all duration-200 whitespace-nowrap flex-auto min-w-0 overflow-hidden"
                style={{
                  background: isActive 
                    ? `rgba(${hexToRgb(tab.color)}, 0.10)` 
                    : 'transparent',
                  border: isActive 
                    ? `1px solid rgba(${hexToRgb(tab.color)}, 0.25)` 
                    : '1px solid transparent',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span 
                  className="font-['Poppins',sans-serif] text-[13px] transition-colors duration-200"
                  style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}
                >
                  {tab.label}
                </span>
                {count > 0 && (
                  <span 
                    className="font-['Poppins',sans-serif] text-[11px] px-1.5 py-0.5 rounded-full text-center transition-all duration-200 shrink-0"
                    style={{
                      background: isActive 
                        ? `rgba(${hexToRgb(tab.color)}, 0.15)` 
                        : 'rgba(255,255,255,0.05)',
                      color: isActive ? tab.color : 'rgba(255,255,255,0.3)',
                      fontWeight: 500,
                    }}
                  >
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Card List */}
      <div className={`space-y-3 ${isMobile ? 'px-4' : ''}`}>
        {displaySets.length > 0 ? (
          displaySets.map((set) => {
            return (
              <div key={set.id} className="relative">
                {/* Selection Checkbox */}
                {selectionMode && (
                  <div
                    className="absolute top-3 right-3 z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCardSelection?.(set.id);
                    }}
                  >
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                        selectedCards.includes(set.id)
                          ? "bg-[#009379] border-[#009379]"
                          : "bg-white/[0.05] border-white/[0.2] hover:border-white/[0.4]"
                      }`}
                    >
                      {selectedCards.includes(set.id) && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                )}

                {/* Type Badge (only in "Alle" view) — removed, no longer needed */}

                {/* Flashcard Item */}
                <FlashcardItem
                  subject={set.subject}
                  title={set.title}
                  cardCount={set.cardCount}
                  progress={set.progress}
                  createdDate={set.createdDate}
                  onClick={() => onOpenFlashcardSet(set)}
                />
              </div>
            );
          })
        ) : (
          <div className={`py-12 text-center ${isMobile ? 'px-6' : ''}`}>
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {activeSubTab === 'weakness' && <TrendingDown className="w-6 h-6 text-white/20" />}
              {activeSubTab === 'risk' && <AlertTriangle className="w-6 h-6 text-white/20" />}
              {activeSubTab === 'knowledge-gap' && <Brain className="w-6 h-6 text-white/20" />}
            </div>
            <p className="font-['Poppins',sans-serif] text-[14px] text-white/40">
              {emptyMessages[activeSubTab]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper: hex color to rgb values string
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}