import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import AIContentGenerationModal from './AIContentGenerationModal';
import AIContentGenerationResultModal from './AIContentGenerationResultModal';
import { type Topic } from '../data/topics';
import CloseButton from '@/app/components/CloseButton';
import SwipeToDelete from './SwipeToDelete';
import { deleteAITopic, getAITopics } from '../utils/aiContentStorage';
import { generateAIContentHierarchically } from '../utils/aiContentHierarchy';
import { topics as standardTopics } from '../data/topics';

type TopicSelectionProps = {
  categoryName: string;
  categoryId: string;
  subjectId: string;
  subjectName: string;
  topics: (Topic & { aiGenerated?: boolean })[];
  selectedTopic: Topic | null;
  subtopicsByTopic: { [topicId: string]: Array<{ id: string; name: string }> };
  onSelectTopic: (topic: Topic | null) => void;
  onContinue: () => void;
  onNavigateToSubtopics: (topic: Topic) => void;
  onBack: () => void;
  onClose?: () => void;
  onNavigateToLevel?: (level: string, deletedCategoryId?: string) => void;
  isLoading?: boolean;
  onRequestAIContent?: () => void;
  onRequestLoading?: (isLoading: boolean) => void;
  title?: string;
  mode?: 'exam' | 'generate';
};

export default function TopicSelection({
  categoryName,
  categoryId,
  subjectId,
  subjectName,
  topics,
  selectedTopic,
  subtopicsByTopic,
  onSelectTopic,
  onContinue,
  onNavigateToSubtopics,
  onBack,
  onClose,
  onNavigateToLevel,
  isLoading,
  onRequestAIContent,
  onRequestLoading,
  title = 'Prüfungssimulation',
  mode = 'exam'
}: TopicSelectionProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiResultContent, setAiResultContent] = useState<{
    categories: {
      name: string;
      isNew: boolean;
      topics: {
        name: string;
        isNew: boolean;
        subtopics: {
          name: string;
          isNew: boolean;
        }[];
      }[];
    }[];
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // ✅ NEW: Track deletion state
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Force re-render when AI content changes
  const [, forceUpdate] = useState({});

  // Listen for AI content changes (subtopics creation/deletion)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('🔄 TopicSelection - AI Content geändert, UI wird aktualisiert');
      forceUpdate({}); // Force re-render to update subtopic counts
      
      // ✅ CASCADE AUTO-REDIRECT: Check if all topics were deleted
      const aiTopics = getAITopics().filter(t => t.categoryId === categoryId);
      const stdTopics = standardTopics.filter(t => t.categoryId === categoryId);
      const totalTopics = aiTopics.length + stdTopics.length;
      
      if (totalTopics === 0) {
        console.log('🔙 CASCADE AUTO-REDIRECT: Keine Topics mehr vorhanden → Zurück zu CategorySelection');
        onBack();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [categoryId, onBack]);

  // DEPRECATED: Checkbox functionality removed for consistent design
  const handleCheckboxClick = (topic: Topic, e: React.MouseEvent) => {
    // Not used anymore - checkboxes removed from UI
    return;
  };

  const handleChevronClick = (topic: Topic, e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigateToSubtopics(topic);
  };

  const handleNavigate = (level: 'subject' | 'category') => {
    setShowDropdown(false);
    if (onNavigateToLevel) {
      onNavigateToLevel(level);
    }
  };

  // DEPRECATED: "Weiter" button removed for consistent design
  const handleContinue = () => {
    // Not used anymore - button removed from UI
    return;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter topics by search query (already filtered by category in App.tsx)
  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  // Helper: Get badge text for a topic
  const getBadgeText = (topic: Topic): string | null => {
    // Never show badges anymore (consistent design)
    return null;
  };

  // Helper: Check if topic is selected (fully or partially)
  // Helper: Topics never show as "selected" anymore (consistent design)
  const isTopicSelected = (topic: Topic): boolean => {
    return false; // Always false - topics are just navigation now
  };

  // Helper: Checkboxes removed - this function kept for compatibility
  const isCheckboxChecked = (topic: Topic): boolean => {
    return false; // No checkboxes anymore
  };

  // Delete handler for AI-generated topics
  const handleDeleteTopic = async (topicId: string) => {
    // ✅ START DELETION: Hide buttons immediately
    setIsDeleting(true);
    
    // ✅ SYNCHRONE CASCADE-LÖSCHUNG mit Return-Value
    const result = deleteAITopic(topicId);
    
    console.log('🗑️ DELETE RESULT:', result);
    
    // If this topic was selected, deselect it
    if (selectedTopic?.id === topicId) {
      onSelectTopic(null);
    }
    
    // ✅ Storage event wird automatisch von deleteAITopic() getriggert
    
    // ✅ NUR LOADING WENN CASCADE-REDIRECT passiert
    if (result.deletedCategory) {
      // Kategorie wurde CASCADE-gelöscht → Zurück zu CategorySelection
      console.log('🔙 CASCADE: Kategorie gelöscht → Redirect zu CategorySelection');
      
      // Show loading screen während CASCADE-Redirect
      if (onRequestLoading) {
        onRequestLoading(true);
      }
      
      // ✅ WARTE LANGE bevor Navigation → Kategorie verschwindet im Hintergrund
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Jetzt navigieren
      if (onNavigateToLevel) {
        onNavigateToLevel('category', result.deletedCategoryId);
      } else {
        onBack();
      }
      
      // ✅ Noch länger warten NACH Navigation → Loading bleibt über neuem Screen
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (onRequestLoading) {
        onRequestLoading(false);
      }
      
      // Re-enable buttons
      setIsDeleting(false);
    } else {
      // ✅ NO CASCADE: Re-enable buttons after deletion
      setIsDeleting(false);
    }
    // Sonst: Bleibe auf TopicSelection (UI updated sich automatisch, KEIN Loading)
  };

  // AI Content Generation Handler
  const handleAIGeneration = async (input: string, selectedSubjectId: string) => {
    console.log('🤖 KI-Generierung für Topic:', {
      category: categoryName,
      categoryId: categoryId,
      currentSubjectId: subjectId,
      selectedSubjectId: selectedSubjectId,
      userInput: input
    });
    
    // ✅ HIERARCHISCHE AI-LOGIK (zentrale Funktion) - nutzt das ausgewählte Fach
    const result = await generateAIContentHierarchically(input, selectedSubjectId);
    
    console.log('🤖 AI-Ergebnis:', result);
    
    // ✅ Subject-Mismatch oder Already-Exists? -> Parent-Components haben die Modals
    // Hier zeigen wir nur Success-Results
    
    // ✅ Schließe AI-Modal und zeige Result-Modal
    setShowAIModal(false);
    
    setAiResultContent({
      categories: [{
        name: result.category.name,
        isNew: result.category.isNew,
        topics: result.topic ? [{
          name: result.topic.name,
          isNew: result.topic.isNew,
          subtopics: result.subtopics.map(subtopicName => ({
            name: subtopicName,
            isNew: true // Alle Subtopics sind neu
          }))
        }] : []
      }]
    });
    
    // Trigger storage event für Re-Render
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="size-full flex flex-col bg-[#0a0a0a] overscroll-none relative">
      {/* Loading overlay removed — content renders instantly */}

      {/* Header - STATIC */}
      <div className="px-6 py-3 flex-shrink-0 pt-safe lg:mt-[20px] mt-3">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="font-['Poppins:SemiBold',sans-serif] text-[16px] lg:text-[15px] text-white mb-1">
              {title}
            </h1>
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[13px] text-[#979797]">
              Wähle Themen aus
            </p>
          </div>
          <CloseButton onClick={onClose || onBack} />
        </div>
      </div>

      {/* Filters - STATIC */}
      <div className="px-6 mb-5 flex gap-2.5 flex-shrink-0 relative" ref={dropdownRef}>
        <div 
          className="relative bg-white/[0.05] border border-white/[0.08] h-[38px] rounded-xl px-3.5 flex items-center gap-2.5 w-[160px] cursor-pointer transition-colors duration-150"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <svg className="w-[15px] h-[7px] flex-shrink-0 opacity-40" fill="none" viewBox="0 0 18.5 9.5">
            <path d="M0.75 0.75H17.75" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
            <path d="M4.81522 8.75H13.6848" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
            <path d="M2.59783 4.75H15.9022" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
          <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80 whitespace-nowrap">Themen</p>
          <svg className={`w-[9px] h-[5px] ml-auto flex-shrink-0 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 10 6">
            <path d="M1 1L5 5L9 1" stroke="white" strokeOpacity="0.35" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
        
        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute top-[46px] left-6 bg-[#1a1a1a] border border-white/[0.10] rounded-xl overflow-hidden z-50 w-[160px]"
          >
            <div 
              className="px-3.5 py-2.5 cursor-pointer transition-colors duration-150 border-b border-white/[0.06] active:bg-white/[0.04]"
              onClick={() => handleNavigate('subject')}
            >
              <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50">Fächer</p>
            </div>
            <div 
              className="px-3.5 py-2.5 cursor-pointer transition-colors duration-150 border-b border-white/[0.06] active:bg-white/[0.04]"
              onClick={() => handleNavigate('category')}
            >
              <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50">Kategorien</p>
            </div>
            <div className="px-3.5 py-2.5 bg-white/[0.05]">
              <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white">Themen</p>
            </div>
          </div>
        )}
        
        <div className="relative bg-white/[0.05] border border-white/[0.08] h-[38px] rounded-xl px-3.5 flex-1 flex items-center gap-2.5 overflow-hidden"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <svg className="size-[15px] flex-shrink-0" fill="none" viewBox="0 0 16 16">
            <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#666" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M14 14L11.1 11.1" stroke="#666" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Suche"
            className="flex-1 min-w-0 bg-transparent font-['Poppins:Regular',sans-serif] text-[13px] text-white placeholder:text-white/25 outline-none"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="flex-shrink-0 p-1 transition-opacity"
            >
              <svg className="size-[11px]" fill="none" viewBox="0 0 12 12">
                <path d="M2 2L10 10M10 2L2 10" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Topic List */}
      <div className="flex-1 px-6 pb-32 overflow-y-auto overscroll-none relative">
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: isDeleting ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredTopics.length === 0 ? (
            searchQuery ? (
              <div className="text-center py-12">
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">
                  Keine Themen gefunden
                </p>
              </div>
            ) : null
          ) : (
            <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
              {filteredTopics.map((topic, index) => {
                const isSelected = isTopicSelected(topic);
                const isChecked = isCheckboxChecked(topic);
                const badgeText = getBadgeText(topic);
                const isDisabled = false;
                
                const topicContent = (
                  <div
                    className={`flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 relative ${
                      isDisabled
                        ? 'opacity-50'
                        : isSelected 
                          ? 'bg-white/[0.03] cursor-pointer active:bg-white/[0.06]'
                          : 'cursor-pointer active:bg-white/[0.04]'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    onClick={(e) => {
                      if (!isDisabled) handleChevronClick(topic, e);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (!isDisabled) handleChevronClick(topic, e);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    {/* Text and Badge */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <p className={`font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[15px] leading-[22px] flex-1 min-w-0 ${isDisabled ? 'text-white/30' : 'text-white'}`}>
                        {topic.name}
                      </p>
                      {topic.aiGenerated && (
                        <Sparkles className="w-[16px] h-[16px] text-[#FFD700] flex-shrink-0" strokeWidth={2.5} fill="#FFD700" />
                      )}
                      {badgeText && (
                        <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/30 whitespace-nowrap flex-shrink-0">
                          {badgeText}
                        </span>
                      )}
                    </div>
                    
                    {/* Chevron */}
                    <svg className="w-[7px] h-[12px] flex-shrink-0" fill="none" viewBox="0 0 7 12">
                      <path d="M1 1L5.5 6L1 11" stroke={isDisabled ? '#8E8E93' : '#8E8E93'} strokeOpacity={isDisabled ? '0.3' : '1'} strokeLinecap="round" strokeWidth="1.5" />
                    </svg>
                    {/* Divider */}
                    <div className="absolute bottom-0 left-4 right-0 h-px bg-white/[0.08]" />
                  </div>
                );

                // Wrap AI-generated topics with SwipeToDelete
                if (topic.aiGenerated) {
                  return (
                    <SwipeToDelete
                      key={topic.id}
                      onDelete={() => handleDeleteTopic(topic.id)}
                      disabled={isDisabled}
                    >
                      {topicContent}
                    </SwipeToDelete>
                  );
                }

                // Standard topics without swipe
                return (
                  <div key={topic.id}>
                    {topicContent}
                  </div>
                );
              })}

              {/* AI Generate Button - inside container as last row */}
              {onRequestAIContent && !isLoading && !isDeleting && (
                <div
                  className="flex items-center justify-center gap-2 px-4 py-3 cursor-pointer transition-colors duration-150 active:bg-white/[0.04]"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => setShowAIModal(true)}
                >
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] lg:text-[13px] text-white/35 text-center">
                    Thema fehlt? Mit KI erstellen
                  </p>
                  <svg className="w-[7px] h-[12px]" fill="none" viewBox="0 0 7 12">
                    <path d="M1 1L5.5 6L1 11" stroke="#8E8E93" strokeOpacity="0.4" strokeLinecap="round" strokeWidth="1.5" />
                  </svg>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Continue Button - Only in 'exam' mode */}
      {/* Continue Button - Removed for consistent design */}
      <div className="px-6 pb-6 absolute bottom-0 left-0 right-0 bg-[#0a0a0a] pt-6 flex-shrink-0">
        {/* Buttons removed - users always navigate to subtopics */}
      </div>

      {/* AI Content Generation Modal */}
      <AIContentGenerationModal
        isOpen={showAIModal}
        type="category"
        currentSubjectId={subjectId}
        currentSubjectName={categoryName}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGeneration}
      />

      {/* AI Content Generation Result Modal */}
      <AIContentGenerationResultModal
        isOpen={aiResultContent !== null}
        content={aiResultContent}
        subjectId={subjectId}
        onClose={() => setAiResultContent(null)}
      />
    </div>
  );
}