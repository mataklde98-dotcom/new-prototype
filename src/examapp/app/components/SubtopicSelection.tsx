import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import AIContentGenerationModal from './AIContentGenerationModal';
import AIContentGenerationResultModal from './AIContentGenerationResultModal';
import { type Subtopic, allSubtopics as standardSubtopics } from '../data/subtopics';
import SwipeToDelete from './SwipeToDelete';
import { deleteAISubtopic, getAISubtopics, getAITopics } from '../utils/aiContentStorage';
import { generateAIContentHierarchically } from '../utils/aiContentHierarchy';
import CloseButton from '@/app/components/CloseButton';
import { topics as standardTopics } from '../data/topics';
import { simulateNetworkDelay } from '../utils/loadingUtils';
import Checkbox from '@/app/components/Checkbox';
import Button from '@/app/components/Button';

type SubtopicSelectionProps = {
  topicName: string;
  topicId: string;
  categoryId: string; // ✅ NEU: Für CASCADE-Intelligenz
  subjectId: string;
  subtopics: Subtopic[]; // Now passed as prop (dynamically loaded)
  onContinue: (selectedSubtopics: Subtopic[]) => void;
  onBack: (selectedSubtopics: Subtopic[]) => void;
  onClose?: () => void;
  onNavigateToLevel?: (level: 'subject' | 'category' | 'topic', selectedSubtopics: Subtopic[]) => void;
  initialSelection?: Subtopic[];
  isLoading?: boolean;
  onRequestLoading?: (isLoading: boolean) => void; // Callback to show/hide loading screen
  title?: string; // Dynamic title for different features
  mode?: 'exam' | 'generate'; // Mode for different selection behaviors
};

export default function SubtopicSelection({ topicName, topicId, categoryId, subjectId, subtopics, onContinue, onBack, onClose, onNavigateToLevel, initialSelection, isLoading, onRequestLoading, title = 'Prüfungssimulation', mode = 'exam' }: SubtopicSelectionProps) {
  const [selectedSubtopics, setSelectedSubtopics] = useState<Set<string>>(
    new Set(initialSelection?.map(subtopic => subtopic.id) || [])
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSubtopicId, setHoveredSubtopicId] = useState<string | null>(null);
  const [showAIModal, setShowAIModal] = useState(false); // ✅ AI Modal State
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
  } | null>(null); // ✅ AI Result State
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Force re-render when AI content changes
  const [, forceUpdate] = useState({});

  // Listen for AI content changes (subtopics creation/deletion)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('🔄 SubtopicSelection - AI Content geändert, UI wird aktualisiert');
      forceUpdate({}); // Force re-render to show new subtopics
      
      // ✅ INTELLIGENTER CASCADE AUTO-REDIRECT
      const aiSubtopics = getAISubtopics().filter(s => s.topicId === topicId);
      const stdSubtopics = standardSubtopics.filter(s => s.topicId === topicId);
      const totalSubtopics = aiSubtopics.length + stdSubtopics.length;
      
      if (totalSubtopics === 0) {
        console.log('🔗 CASCADE: Alle Subtopics gelöscht → Topic wird CASCADE-gelöscht');
        
        // SMART CHECK: Ist dieses Topic das EINZIGE in der Kategorie?
        const aiTopics = getAITopics().filter(t => t.categoryId === categoryId);
        const stdTopics = standardTopics.filter(t => t.categoryId === categoryId);
        const totalTopics = aiTopics.length + stdTopics.length;
        
        console.log(`📊 Anzahl Topics in Kategorie ${categoryId}:`, totalTopics);
        
        if (totalTopics <= 1) {
          // ✅ Das gelöschte Topic war das EINZIGE → Direkt zu CategorySelection
          console.log('🔙 SMART REDIRECT: Topic war das einzige → Direkt zu CategorySelection');
          if (onNavigateToLevel) {
            onNavigateToLevel('category', []);
          } else {
            onBack([]);
          }
        } else {
          // Topic war NICHT das einzige → Normal zu TopicSelection
          console.log('🔙 NORMAL REDIRECT: Es gibt noch andere Topics → Zu TopicSelection');
          onBack([]);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [topicId, categoryId, onBack, onNavigateToLevel]);

  // Update selected subtopics when initialSelection changes (when coming back to this screen)
  useEffect(() => {
    if (initialSelection && initialSelection.length > 0) {
      setSelectedSubtopics(new Set(initialSelection.map(subtopic => subtopic.id)));
    }
  }, [initialSelection]);

  const toggleSubtopic = (subtopicId: string) => {
    setSelectedSubtopics(prev => {
      const newSet = new Set(prev);
      
      // In 'generate' mode: Single-select only (replace selection)
      if (mode === 'generate') {
        // If clicking the same subtopic, deselect it
        if (newSet.has(subtopicId)) {
          newSet.delete(subtopicId);
        } else {
          // Otherwise, clear all and select only this one
          newSet.clear();
          newSet.add(subtopicId);
        }
        return newSet;
      }
      
      // In 'exam' mode: Multi-select (default behavior)
      if (newSet.has(subtopicId)) {
        newSet.delete(subtopicId);
      } else {
        newSet.add(subtopicId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    // Select all subtopics for this topic
    const allSubtopicIds = subtopics.map(st => st.id);
    setSelectedSubtopics(new Set(allSubtopicIds));
  };

  const handleDeselectAll = () => {
    // Deselect all subtopics
    setSelectedSubtopics(new Set());
  };

  const handleToggleAll = () => {
    // If all are selected, deselect all. Otherwise, select all.
    if (areAllSelected) {
      handleDeselectAll();
    } else {
      handleSelectAll();
    }
  };

  const handleContinue = () => {
    const selected = subtopics.filter(st => selectedSubtopics.has(st.id));
    onContinue(selected);
  };

  const handleNavigate = (level: 'subject' | 'category' | 'topic') => {
    setShowDropdown(false);
    if (onNavigateToLevel) {
      const selected = subtopics.filter(st => selectedSubtopics.has(st.id));
      onNavigateToLevel(level, selected);
    }
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

  // Filter subtopics for this topic (already filtered by topic in App.tsx)
  // Filter by search query
  const filteredSubtopics = subtopics.filter(subtopic =>
    subtopic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };
  
  // Check if all subtopics are selected
  const areAllSelected = subtopics.length > 0 && subtopics.every(st => selectedSubtopics.has(st.id));

  // Delete handler for AI-generated subtopics
  const handleDeleteSubtopic = async (subtopicId: string) => {
    // ✅ SYNCHRONE CASCADE-LÖSCHUNG mit Return-Value
    const result = deleteAISubtopic(subtopicId);
    
    console.log('🗑️ DELETE RESULT:', result);
    
    // ✅ Schließe Result-Modal falls offen
    setAiResultContent(null);
    
    // If this subtopic was selected, deselect it
    if (selectedSubtopics.has(subtopicId)) {
      setSelectedSubtopics(prev => {
        const newSet = new Set(prev);
        newSet.delete(subtopicId);
        return newSet;
      });
    }
    
    // ✅ NUR LOADING WENN CASCADE-REDIRECT passiert
    if (result.deletedCategory) {
      // Topic UND Kategorie wurden CASCADE-gelöscht → Zurück zu CategorySelection
      console.log('🔙 CASCADE: Kategorie gelöscht → Redirect zu CategorySelection');
      
      // Show loading screen während CASCADE-Redirect
      if (onRequestLoading) {
        onRequestLoading(true);
      }
      
      // ✅ WARTE LANGE bevor Navigation → Kategorie verschwindet im Hintergrund
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onNavigateToLevel) {
        onNavigateToLevel('category', []);
      } else {
        onBack([]);
      }
      
      // ✅ Noch länger warten NACH Navigation → Loading bleibt über neuem Screen
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (onRequestLoading) {
        onRequestLoading(false);
      }
    } else if (result.deletedTopic) {
      // Nur Topic wurde CASCADE-gelöscht → Zurück zu TopicSelection
      console.log('🔙 CASCADE: Topic gelöscht → Redirect zu TopicSelection');
      
      // Show loading screen während CASCADE-Redirect
      if (onRequestLoading) {
        onRequestLoading(true);
      }
      
      // ✅ WARTE LANGE bevor Navigation → Topic verschwindet im Hintergrund
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onBack([]);
      
      // ✅ Noch länger warten NACH Navigation → Loading bleibt über neuem Screen
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (onRequestLoading) {
        onRequestLoading(false);
      }
    }
    // Sonst: Kein CASCADE → Bleibe auf aktueller Seite (KEIN Loading)
    // UI updated sich via forceUpdate automatisch
  };

  // ✅ AI Content Generation Handler
  const handleAIGeneration = async (input: string, selectedSubjectId: string) => {
    console.log('🤖 KI-Generierung für Subtopics:', {
      topic: topicName,
      topicId: topicId,
      currentSubjectId: subjectId,
      selectedSubjectId: selectedSubjectId,
      userInput: input
    });
    
    // ✅ HIERARCHISCHE AI-LOGIK (zentrale Funktion)
    const result = await generateAIContentHierarchically(input, selectedSubjectId);
    
    console.log('🤖 AI-Ergebnis:', result);
    
    // ✅ Schließe AI-Modal und zeige Result-Modal
    setShowAIModal(false);
    
    setAiResultContent({
      categories: [
        {
          name: result.category.name,
          isNew: result.category.isNew,
          topics: [
            {
              name: result.topic?.name || topicName,
              isNew: result.topic?.isNew || false,
              subtopics: result.subtopics.map(subtopic => ({
                name: subtopic,
                isNew: true
              }))
            }
          ]
        }
      ]
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
              Wähle Unterthemen aus
            </p>
          </div>
          <CloseButton onClick={onClose || (() => onBack(Array.from(selectedSubtopics).map(id => subtopics.find(st => st.id === id)!)))} />
        </div>
      </div>

      {/* Filters */}
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
          <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80 whitespace-nowrap">Unterthemen</p>
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
            <div 
              className="px-3.5 py-2.5 cursor-pointer transition-colors duration-150 border-b border-white/[0.06] active:bg-white/[0.04]"
              onClick={() => handleNavigate('topic')}
            >
              <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50">Themen</p>
            </div>
            <div className="px-3.5 py-2.5 bg-white/[0.05]">
              <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white">Unterthemen</p>
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

      {/* Subtopic List */}
      <div className="flex-1 px-6 pb-32 overflow-y-auto overscroll-none relative">
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredSubtopics.length === 0 ? (
            searchQuery ? (
              <div className="text-center py-12">
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">
                  Keine Unterthemen gefunden
                </p>
              </div>
            ) : null
          ) : (
            <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
              {filteredSubtopics.map((subtopic, index) => {
                const isSelected = selectedSubtopics.has(subtopic.id);
                const isHovered = hoveredSubtopicId === subtopic.id;
                
                const subtopicContent = (
                  <div
                    className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors duration-150 active:bg-white/[0.04] relative ${isSelected ? 'bg-white/[0.03]' : ''}`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    onClick={() => toggleSubtopic(subtopic.id)}
                    onMouseEnter={() => setHoveredSubtopicId(subtopic.id)}
                    onMouseLeave={() => setHoveredSubtopicId(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSubtopic(subtopic.id);
                      }
                    }}
                    tabIndex={0}
                    role="checkbox"
                    aria-checked={isSelected}
                  >
                    {/* Checkbox — Shared Component */}
                    <div className="flex-shrink-0">
                      <Checkbox checked={isSelected} />
                    </div>
                    
                    <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[15px] text-white flex-1 leading-[22px]">
                      {subtopic.name}
                    </p>
                    {subtopic.aiGenerated && (
                      <Sparkles className="w-[16px] h-[16px] text-[#FFD700] flex-shrink-0" strokeWidth={2.5} fill="#FFD700" />
                    )}
                    {/* Divider */}
                    <div className="absolute bottom-0 left-4 right-0 h-px bg-white/[0.08]" />
                  </div>
                );

                // Wrap AI-generated subtopics with SwipeToDelete
                if (subtopic.aiGenerated) {
                  return (
                    <SwipeToDelete
                      key={subtopic.id}
                      onDelete={() => handleDeleteSubtopic(subtopic.id)}
                    >
                      {subtopicContent}
                    </SwipeToDelete>
                  );
                }

                // Standard subtopics without swipe
                return (
                  <div key={subtopic.id}>
                    {subtopicContent}
                  </div>
                );
              })}

              {/* AI Generate Button - inside container as last row */}
              <div
                className="flex items-center justify-center gap-2 px-4 py-3 cursor-pointer transition-colors duration-150 active:bg-white/[0.04]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
                onClick={() => setShowAIModal(true)}
              >
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] lg:text-[13px] text-white/35 text-center">
                  Unterthema fehlt? Mit KI erstellen
                </p>
                <svg className="w-[7px] h-[12px]" fill="none" viewBox="0 0 7 12">
                  <path d="M1 1L5.5 6L1 11" stroke="#8E8E93" strokeOpacity="0.4" strokeLinecap="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Continue Button */}
      <div className="px-6 pb-6 absolute bottom-0 left-0 right-0 bg-[#0a0a0a] pt-6 flex-shrink-0">
        <div className="flex gap-3">
          {/* Show "Alle auswählen/abwählen" button only in 'exam' mode */}
          {mode === 'exam' && (
            <Button
              fullWidth={false}
              className="flex-1"
              onClick={handleToggleAll}
            >
              {areAllSelected ? 'Alle abwählen' : 'Alle auswählen'}
            </Button>
          )}
          <Button
            fullWidth={mode === 'generate'}
            className={mode !== 'generate' ? 'flex-1' : ''}
            onClick={handleContinue}
            disabled={selectedSubtopics.size === 0}
          >
            Weiter
          </Button>
        </div>
      </div>

      {/* AI Content Generation Modal */}
      <AIContentGenerationModal
        isOpen={showAIModal}
        type="subtopic"
        currentSubjectId={subjectId}
        currentSubjectName={topicName}
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