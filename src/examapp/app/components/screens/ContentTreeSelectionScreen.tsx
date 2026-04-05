// ==================== CONTENT TREE SELECTION SCREEN ====================
// Flexible Baum-Auswahl: Kategorien → Themen → Unterthemen
// Schüler kann auf jeder Ebene auswählen und mehrere Kategorien gleichzeitig wählen

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronDown, Search, X, Sparkles } from 'lucide-react';
import MobileViewportLayout from './MobileViewportLayout';
import Button from '@/app/components/Button';
import Checkbox from '@/app/components/Checkbox';
import CloseButton from '@/app/components/CloseButton';
import AIContentGenerationModal from '../AIContentGenerationModal';
import AIContentGenerationResultModal from '../AIContentGenerationResultModal';
import AIContentExistsModal from '../AIContentExistsModal';
import { generateAIContentHierarchically } from '../../utils/aiContentHierarchy';
import {
  loadTopicsForCategory,
  loadSubtopicsForTopic,
  loadCategoriesForSubject,
  type Category,
  type Topic,
  type Subtopic,
} from '@/shared-content-selection';

// ==================== TYPES ====================

export type TreeSelection = {
  [categoryId: string]: {
    category: { id: string; name: string };
    allSelected: boolean; // ganze Kategorie ausgewählt
    topics: {
      [topicId: string]: {
        topic: { id: string; name: string };
        allSelected: boolean; // ganzes Thema ausgewählt
        subtopicIds: string[]; // einzelne Unterthemen
      };
    };
  };
};

type SelectionState = {
  subject?: { id: string; name: string };
  category?: { id: string; name: string };
  selectedTopic?: { id: string; name: string };
  subtopicsByTopic?: { [topicId: string]: Array<{ id: string; name: string }> };
  currentTopic?: { id: string; name: string };
  selectedSubtopics?: Array<{ id: string; name: string }>;
  treeSelection?: TreeSelection;
};

interface ContentTreeSelectionScreenProps {
  selectionState: SelectionState;
  categoriesCache: { [subjectId: string]: Category[] };
  setCategoriesCache: React.Dispatch<React.SetStateAction<{ [subjectId: string]: Category[] }>>;
  setSelectionState: React.Dispatch<React.SetStateAction<SelectionState>>;
  setPreviousScreen: React.Dispatch<React.SetStateAction<'topicSelection' | 'subtopicSelection'>>;
  setScreen: (screen: string) => void;
  onClose?: () => void;
}

// ==================== COMPONENT ====================

export default function ContentTreeSelectionScreen({
  selectionState,
  categoriesCache,
  setCategoriesCache,
  setSelectionState,
  setPreviousScreen,
  setScreen,
  onClose,
}: ContentTreeSelectionScreenProps) {
  const subjectId = selectionState.subject?.id || '';
  const subjectName = selectionState.subject?.name || '';
  const categories = categoriesCache[subjectId] || [];

  // Selection state
  const [treeSelection, setTreeSelection] = useState<TreeSelection>(
    selectionState.treeSelection || {}
  );

  // Expanded state
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  // Data caches (loaded on expand)
  const [topicsCache, setTopicsCache] = useState<{ [categoryId: string]: Topic[] }>({});
  const [subtopicsCache, setSubtopicsCache] = useState<{ [topicId: string]: Subtopic[] }>({});

  // Loading states
  const [loadingCategories, setLoadingCategories] = useState<Set<string>>(new Set());
  const [loadingTopics, setLoadingTopics] = useState<Set<string>>(new Set());

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Breadcrumb dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // AI Content Generation
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiResultContent, setAiResultContent] = useState<{
    categories: {
      name: string;
      isNew: boolean;
      topics: {
        name: string;
        isNew: boolean;
        subtopics: { name: string; isNew: boolean }[];
      }[];
    }[];
  } | null>(null);
  const [showExistsModal, setShowExistsModal] = useState(false);
  const [existsModalContent, setExistsModalContent] = useState<{
    categories?: Array<{
      id: string; name: string; aiGenerated: boolean;
      topics?: Array<{
        id: string; name: string; aiGenerated: boolean;
        subtopics?: Array<{ id: string; name: string; aiGenerated: boolean }>;
      }>;
    }>;
  } | null>(null);
  const [recoveryInput, setRecoveryInput] = useState('');
  const [recoverySubjectId, setRecoverySubjectId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ==================== SELECTION COUNTING ====================

  const getSelectionCount = useCallback(() => {
    let count = 0;
    for (const catSel of Object.values(treeSelection)) {
      if (catSel.allSelected) {
        count++;
      } else {
        for (const topicSel of Object.values(catSel.topics)) {
          if (topicSel.allSelected) {
            count++;
          } else {
            count += topicSel.subtopicIds.length;
          }
        }
      }
    }
    return count;
  }, [treeSelection]);

  const hasSelection = getSelectionCount() > 0;

  // ==================== CATEGORY HELPERS ====================

  const isCategorySelected = (categoryId: string) => {
    return !!treeSelection[categoryId]?.allSelected;
  };

  const isCategoryPartiallySelected = (categoryId: string) => {
    const catSel = treeSelection[categoryId];
    if (!catSel || catSel.allSelected) return false;
    return Object.keys(catSel.topics).length > 0;
  };

  const toggleCategory = (category: Category) => {
    setTreeSelection(prev => {
      const next = { ...prev };
      if (next[category.id]?.allSelected) {
        // Deselect entire category
        delete next[category.id];
      } else {
        // Select entire category
        next[category.id] = {
          category: { id: category.id, name: category.name },
          allSelected: true,
          topics: {},
        };
      }
      return next;
    });
  };

  // ==================== TOPIC HELPERS ====================

  const isTopicSelected = (categoryId: string, topicId: string) => {
    const catSel = treeSelection[categoryId];
    if (!catSel) return false;
    if (catSel.allSelected) return true;
    return !!catSel.topics[topicId]?.allSelected;
  };

  const isTopicPartiallySelected = (categoryId: string, topicId: string) => {
    const catSel = treeSelection[categoryId];
    if (!catSel || catSel.allSelected) return false;
    const topicSel = catSel.topics[topicId];
    if (!topicSel || topicSel.allSelected) return false;
    return topicSel.subtopicIds.length > 0;
  };

  const toggleTopic = (category: Category, topic: Topic) => {
    setTreeSelection(prev => {
      const next = { ...prev };
      const catSel = next[category.id] || {
        category: { id: category.id, name: category.name },
        allSelected: false,
        topics: {},
      };

      // If category was fully selected, we need to convert to partial
      if (catSel.allSelected) {
        // Deselect this topic = select all OTHER topics
        const allTopics = topicsCache[category.id] || [];
        const newTopics: typeof catSel.topics = {};
        for (const t of allTopics) {
          if (t.id !== topic.id) {
            newTopics[t.id] = {
              topic: { id: t.id, name: t.name },
              allSelected: true,
              subtopicIds: [],
            };
          }
        }
        next[category.id] = {
          ...catSel,
          allSelected: false,
          topics: newTopics,
        };
        // If no topics left selected, remove the category
        if (Object.keys(newTopics).length === 0) {
          delete next[category.id];
        }
      } else {
        const topicSel = catSel.topics[topic.id];
        if (topicSel?.allSelected) {
          // Deselect topic
          const newTopics = { ...catSel.topics };
          delete newTopics[topic.id];
          if (Object.keys(newTopics).length === 0) {
            delete next[category.id];
          } else {
            next[category.id] = { ...catSel, topics: newTopics };
          }
        } else {
          // Select entire topic
          const newTopics = { ...catSel.topics };
          newTopics[topic.id] = {
            topic: { id: topic.id, name: topic.name },
            allSelected: true,
            subtopicIds: [],
          };
          next[category.id] = { ...catSel, topics: newTopics };

          // Check if all topics are now selected → promote to category-level
          const allTopics = topicsCache[category.id] || [];
          if (allTopics.length > 0 && allTopics.every(t => newTopics[t.id]?.allSelected)) {
            next[category.id] = {
              ...catSel,
              allSelected: true,
              topics: {},
            };
          }
        }
      }
      return next;
    });
  };

  // ==================== SUBTOPIC HELPERS ====================

  const isSubtopicSelected = (categoryId: string, topicId: string, subtopicId: string) => {
    const catSel = treeSelection[categoryId];
    if (!catSel) return false;
    if (catSel.allSelected) return true;
    const topicSel = catSel.topics[topicId];
    if (!topicSel) return false;
    if (topicSel.allSelected) return true;
    return topicSel.subtopicIds.includes(subtopicId);
  };

  const toggleSubtopic = (category: Category, topic: Topic, subtopic: Subtopic) => {
    setTreeSelection(prev => {
      const next = { ...prev };
      const catSel = next[category.id] || {
        category: { id: category.id, name: category.name },
        allSelected: false,
        topics: {},
      };

      // If category was fully selected, convert to partial (all topics selected except this subtopic)
      if (catSel.allSelected) {
        const allTopics = topicsCache[category.id] || [];
        const newTopics: typeof catSel.topics = {};
        for (const t of allTopics) {
          if (t.id === topic.id) {
            // This topic: all subtopics except the toggled one
            const allSubs = subtopicsCache[topic.id] || [];
            const filteredIds = allSubs.filter(s => s.id !== subtopic.id).map(s => s.id);
            if (filteredIds.length > 0) {
              newTopics[t.id] = {
                topic: { id: t.id, name: t.name },
                allSelected: false,
                subtopicIds: filteredIds,
              };
            }
          } else {
            newTopics[t.id] = {
              topic: { id: t.id, name: t.name },
              allSelected: true,
              subtopicIds: [],
            };
          }
        }
        next[category.id] = { ...catSel, allSelected: false, topics: newTopics };
        if (Object.keys(newTopics).length === 0) delete next[category.id];
        return next;
      }

      let topicSel = catSel.topics[topic.id];
      
      // If topic was fully selected, convert to partial
      if (topicSel?.allSelected) {
        const allSubs = subtopicsCache[topic.id] || [];
        const filteredIds = allSubs.filter(s => s.id !== subtopic.id).map(s => s.id);
        const newTopics = { ...catSel.topics };
        if (filteredIds.length > 0) {
          newTopics[topic.id] = {
            topic: { id: topic.id, name: topic.name },
            allSelected: false,
            subtopicIds: filteredIds,
          };
        } else {
          delete newTopics[topic.id];
        }
        next[category.id] = { ...catSel, topics: newTopics };
        if (Object.keys(newTopics).length === 0) delete next[category.id];
        return next;
      }

      // Normal toggle
      const currentIds = topicSel?.subtopicIds || [];
      let newIds: string[];
      if (currentIds.includes(subtopic.id)) {
        newIds = currentIds.filter(id => id !== subtopic.id);
      } else {
        newIds = [...currentIds, subtopic.id];
      }

      const newTopics = { ...catSel.topics };
      
      // Check if all subtopics are now selected → promote to topic-level
      const allSubs = subtopicsCache[topic.id] || [];
      if (allSubs.length > 0 && newIds.length === allSubs.length) {
        newTopics[topic.id] = {
          topic: { id: topic.id, name: topic.name },
          allSelected: true,
          subtopicIds: [],
        };
        // Check if all topics are now fully selected → promote to category-level
        const allTopics = topicsCache[category.id] || [];
        if (allTopics.length > 0 && allTopics.every(t => newTopics[t.id]?.allSelected)) {
          next[category.id] = { ...catSel, allSelected: true, topics: {} };
          return next;
        }
      } else if (newIds.length === 0) {
        delete newTopics[topic.id];
      } else {
        newTopics[topic.id] = {
          topic: { id: topic.id, name: topic.name },
          allSelected: false,
          subtopicIds: newIds,
        };
      }

      if (Object.keys(newTopics).length === 0) {
        delete next[category.id];
      } else {
        next[category.id] = { ...catSel, topics: newTopics };
      }
      return next;
    });
  };

  // ==================== EXPAND/COLLAPSE ====================

  const toggleExpandCategory = async (categoryId: string) => {
    if (expandedCategories.has(categoryId)) {
      setExpandedCategories(prev => {
        const next = new Set(prev);
        next.delete(categoryId);
        return next;
      });
      return;
    }

    // Load topics if not cached
    if (!topicsCache[categoryId]) {
      setLoadingCategories(prev => new Set(prev).add(categoryId));
      try {
        const topics = await loadTopicsForCategory(categoryId);
        setTopicsCache(prev => ({ ...prev, [categoryId]: topics }));
      } catch (error) {
        console.error('Failed to load topics:', error);
      } finally {
        setLoadingCategories(prev => {
          const next = new Set(prev);
          next.delete(categoryId);
          return next;
        });
      }
    }

    setExpandedCategories(prev => new Set(prev).add(categoryId));
  };

  const toggleExpandTopic = async (topicId: string) => {
    if (expandedTopics.has(topicId)) {
      setExpandedTopics(prev => {
        const next = new Set(prev);
        next.delete(topicId);
        return next;
      });
      return;
    }

    // Load subtopics if not cached
    if (!subtopicsCache[topicId]) {
      setLoadingTopics(prev => new Set(prev).add(topicId));
      try {
        const subtopics = await loadSubtopicsForTopic(topicId);
        setSubtopicsCache(prev => ({ ...prev, [topicId]: subtopics }));
      } catch (error) {
        console.error('Failed to load subtopics:', error);
      } finally {
        setLoadingTopics(prev => {
          const next = new Set(prev);
          next.delete(topicId);
          return next;
        });
      }
    }

    setExpandedTopics(prev => new Set(prev).add(topicId));
  };

  // ==================== CONTINUE ====================

  const handleContinue = () => {
    // Save tree selection in state and navigate to examConfiguration
    setSelectionState(prev => ({
      ...prev,
      treeSelection,
    }));
    setPreviousScreen('topicSelection');
    setScreen('examConfiguration');
  };

  // ==================== AI CONTENT GENERATION ====================

  const handleAIGeneration = async (input: string, selectedSubjectId: string) => {
    const result = await generateAIContentHierarchically(input, selectedSubjectId);
    
    // Duplikat gefunden
    if (result.type === 'already-exists') {
      setExistsModalContent(result.existingContent || { categories: [] });
      setShowAIModal(false);
      setShowExistsModal(true);
      return;
    }
    
    // Erfolgreich generiert: Result-Modal zeigen (Bug 2 fix)
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
            isNew: true
          }))
        }] : []
      }]
    });

    // Kategorien-Cache refreshen damit neue Inhalte sofort sichtbar sind (Bug 1 fix)
    try {
      const refreshedCategories = await loadCategoriesForSubject(subjectId);
      setCategoriesCache(prev => ({
        ...prev,
        [subjectId]: refreshedCategories
      }));
      // Auch lokale Topic/Subtopic-Caches invalidieren für neue Kategorien
      if (result.category.isNew) {
        setTopicsCache(prev => {
          const next = { ...prev };
          delete next[result.category.id];
          return next;
        });
      }
      if (result.topic?.isNew && result.topic.id) {
        setSubtopicsCache(prev => {
          const next = { ...prev };
          delete next[result.topic!.id];
          return next;
        });
      }
    } catch (error) {
      console.error('Failed to refresh categories after AI generation:', error);
    }
  };

  // ==================== SEARCH FILTER ====================

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ==================== RENDER ====================

  return (
    <MobileViewportLayout>
      <div className="size-full flex flex-col bg-[#0a0a0a] overscroll-none relative">
        {/* Header */}
        <div className="px-6 py-3 flex-shrink-0 pt-safe lg:mt-[20px] mt-3">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="font-['Poppins:SemiBold',sans-serif] text-[16px] lg:text-[15px] text-white mb-1">
                Prüfungssimulation
              </h1>
              <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[13px] text-[#979797]">
                Wähle Inhalte für die Prüfung
              </p>
            </div>
            <CloseButton onClick={onClose || (() => setScreen('subjectSelection'))} />
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
            <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80 whitespace-nowrap truncate">
              {subjectName}
            </p>
            <svg className={`w-[9px] h-[5px] ml-auto flex-shrink-0 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 10 6">
              <path d="M1 1L5 5L9 1" stroke="white" strokeOpacity="0.35" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
          </div>
          
          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-[46px] left-6 bg-[#1a1a1a] border border-white/[0.10] rounded-xl overflow-hidden z-50 w-[160px]">
              <div 
                className="px-3.5 py-2.5 cursor-pointer transition-colors duration-150 border-b border-white/[0.06] active:bg-white/[0.04]"
                onClick={() => {
                  setShowDropdown(false);
                  setScreen('subjectSelection');
                }}
              >
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50">Fächer</p>
              </div>
              <div className="px-3.5 py-2.5 bg-white/[0.05]">
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white">Inhalte</p>
              </div>
            </div>
          )}
          
          {/* Search */}
          <div className="relative bg-white/[0.05] border border-white/[0.08] h-[38px] rounded-xl px-3.5 flex-1 flex items-center gap-2.5 overflow-hidden">
            <Search className="size-[15px] flex-shrink-0 text-[#666]" strokeWidth={1.5} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Suche"
              className="flex-1 min-w-0 bg-transparent font-['Poppins:Regular',sans-serif] text-[13px] text-white placeholder:text-white/25 outline-none"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }} className="flex-shrink-0 p-1">
                <X className="size-[11px] text-[#666]" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        {/* Tree Content */}
        <div className="flex-1 px-6 pb-32 overflow-y-auto overscroll-none relative">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {filteredCategories.length === 0 ? (
              searchQuery ? (
                <div className="text-center py-12">
                  <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">
                    Keine Kategorien gefunden
                  </p>
                </div>
              ) : null
            ) : (
              <div className="space-y-2">
                {filteredCategories.map((category) => (
                  <CategoryNode
                    key={category.id}
                    category={category}
                    isSelected={isCategorySelected(category.id)}
                    isPartial={isCategoryPartiallySelected(category.id)}
                    isExpanded={expandedCategories.has(category.id)}
                    isLoading={loadingCategories.has(category.id)}
                    topics={topicsCache[category.id] || []}
                    subtopicsCache={subtopicsCache}
                    expandedTopics={expandedTopics}
                    loadingTopics={loadingTopics}
                    treeSelection={treeSelection}
                    onToggleSelect={() => toggleCategory(category)}
                    onToggleExpand={() => toggleExpandCategory(category.id)}
                    onToggleTopic={(topic) => toggleTopic(category, topic)}
                    onToggleExpandTopic={(topicId) => toggleExpandTopic(topicId)}
                    onToggleSubtopic={(topic, subtopic) => toggleSubtopic(category, topic, subtopic)}
                    isTopicSelected={(topicId) => isTopicSelected(category.id, topicId)}
                    isTopicPartial={(topicId) => isTopicPartiallySelected(category.id, topicId)}
                    isSubtopicSelected={(topicId, subtopicId) => isSubtopicSelected(category.id, topicId, subtopicId)}
                  />
                ))}

                {/* AI Generate Button */}
                <div
                  className="flex items-center justify-center gap-2 py-4 cursor-pointer transition-colors duration-150 active:bg-white/[0.04] rounded-[14px]"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => setShowAIModal(true)}
                >
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] lg:text-[13px] text-white/35 text-center">
                    Kategorie oder Thema fehlt? Mit KI erstellen
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
          <Button
            size="lg"
            disabled={!hasSelection}
            onClick={handleContinue}
          >
            Weiter
          </Button>
        </div>
      </div>

      {/* AI Content Generation Modal */}
      <AIContentGenerationModal
        isOpen={showAIModal}
        type="category"
        currentSubjectId={subjectId}
        currentSubjectName={subjectName}
        onClose={() => {
          setShowAIModal(false);
          setRecoveryInput('');
          setRecoverySubjectId(undefined);
        }}
        onGenerate={handleAIGeneration}
        defaultInput={recoveryInput}
        defaultSubjectId={recoverySubjectId}
      />

      {/* AI Content Generation Result Modal */}
      <AIContentGenerationResultModal
        isOpen={aiResultContent !== null}
        content={aiResultContent}
        subjectId={subjectId}
        onClose={() => setAiResultContent(null)}
      />

      {/* AI Content Exists Modal */}
      <AIContentExistsModal
        isOpen={showExistsModal}
        content={existsModalContent}
        onClose={() => setShowExistsModal(false)}
      />
    </MobileViewportLayout>
  );
}

// ==================== CATEGORY NODE ====================

function CategoryNode({
  category,
  isSelected,
  isPartial,
  isExpanded,
  isLoading,
  topics,
  subtopicsCache,
  expandedTopics,
  loadingTopics,
  treeSelection,
  onToggleSelect,
  onToggleExpand,
  onToggleTopic,
  onToggleExpandTopic,
  onToggleSubtopic,
  isTopicSelected,
  isTopicPartial,
  isSubtopicSelected,
}: {
  category: Category;
  isSelected: boolean;
  isPartial: boolean;
  isExpanded: boolean;
  isLoading: boolean;
  topics: Topic[];
  subtopicsCache: { [topicId: string]: Subtopic[] };
  expandedTopics: Set<string>;
  loadingTopics: Set<string>;
  treeSelection: TreeSelection;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onToggleTopic: (topic: Topic) => void;
  onToggleExpandTopic: (topicId: string) => void;
  onToggleSubtopic: (topic: Topic, subtopic: Subtopic) => void;
  isTopicSelected: (topicId: string) => boolean;
  isTopicPartial: (topicId: string) => boolean;
  isSubtopicSelected: (topicId: string, subtopicId: string) => boolean;
}) {
  return (
    <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
      {/* Category Row */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors duration-150 active:bg-white/[0.04]"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        onClick={onToggleSelect}
      >
        {/* Checkbox */}
        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onChange={onToggleSelect}
            size="md"
          />
        </div>

        {/* Partial indicator (dash) */}
        {isPartial && !isSelected && (
          <div className="absolute left-[28px] top-1/2 -translate-y-1/2 w-2.5 h-0.5 bg-white/60 rounded-full pointer-events-none" />
        )}

        {/* Name */}
        <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[15px] text-white flex-1 leading-[22px]">
          {category.name}
        </p>

        {/* AI badge */}
        {category.aiGenerated && (
          <Sparkles className="w-[16px] h-[16px] text-[#FFD700] flex-shrink-0" strokeWidth={2.5} fill="#FFD700" />
        )}

        {/* Expand/Collapse Arrow */}
        <button
          className="flex-shrink-0 p-1.5 -mr-1.5 rounded-lg transition-colors active:bg-white/[0.06]"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {isLoading ? (
            <div className="size-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          ) : isExpanded ? (
            <ChevronDown className="size-4 text-white/40" strokeWidth={2} />
          ) : (
            <ChevronRight className="size-4 text-white/40" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Topics (expanded) */}
      <AnimatePresence>
        {isExpanded && topics.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06]">
              {topics.map((topic) => (
                <TopicNode
                  key={topic.id}
                  topic={topic}
                  isSelected={isTopicSelected(topic.id)}
                  isPartial={isTopicPartial(topic.id)}
                  isExpanded={expandedTopics.has(topic.id)}
                  isLoading={loadingTopics.has(topic.id)}
                  subtopics={subtopicsCache[topic.id] || []}
                  onToggleSelect={() => onToggleTopic(topic)}
                  onToggleExpand={() => onToggleExpandTopic(topic.id)}
                  onToggleSubtopic={(subtopic) => onToggleSubtopic(topic, subtopic)}
                  isSubtopicSelected={(subtopicId) => isSubtopicSelected(topic.id, subtopicId)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== TOPIC NODE ====================

function TopicNode({
  topic,
  isSelected,
  isPartial,
  isExpanded,
  isLoading,
  subtopics,
  onToggleSelect,
  onToggleExpand,
  onToggleSubtopic,
  isSubtopicSelected,
}: {
  topic: Topic;
  isSelected: boolean;
  isPartial: boolean;
  isExpanded: boolean;
  isLoading: boolean;
  subtopics: Subtopic[];
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onToggleSubtopic: (subtopic: Subtopic) => void;
  isSubtopicSelected: (subtopicId: string) => boolean;
}) {
  return (
    <div>
      {/* Topic Row */}
      <div
        className="flex items-center gap-3 pl-10 pr-4 py-3 cursor-pointer transition-colors duration-150 active:bg-white/[0.04] relative"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        onClick={onToggleSelect}
      >
        {/* Vertical guide line */}
        <div className="absolute left-[26px] top-0 bottom-0 w-px bg-white/[0.06]" />

        {/* Checkbox */}
        <div className="flex-shrink-0 relative" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onChange={onToggleSelect}
            size="sm"
          />
        </div>

        {/* Name */}
        <p className={`font-['Poppins:Regular',sans-serif] text-[13px] flex-1 leading-[20px] ${
          isSelected ? 'text-white' : 'text-white/70'
        }`}>
          {topic.name}
        </p>

        {/* AI badge */}
        {topic.aiGenerated && (
          <Sparkles className="w-[14px] h-[14px] text-[#FFD700] flex-shrink-0" strokeWidth={2.5} fill="#FFD700" />
        )}

        {/* Partial dot */}
        {isPartial && !isSelected && (
          <div className="size-1.5 rounded-full bg-white/40 flex-shrink-0" />
        )}

        {/* Expand/Collapse Arrow */}
        <button
          className="flex-shrink-0 p-1.5 -mr-1.5 rounded-lg transition-colors active:bg-white/[0.06]"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {isLoading ? (
            <div className="size-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          ) : isExpanded ? (
            <ChevronDown className="size-3.5 text-white/30" strokeWidth={2} />
          ) : (
            <ChevronRight className="size-3.5 text-white/30" strokeWidth={2} />
          )}
        </button>

        {/* Divider */}
        <div className="absolute bottom-0 left-10 right-0 h-px bg-white/[0.04]" />
      </div>

      {/* Subtopics (expanded) */}
      <AnimatePresence>
        {isExpanded && subtopics.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {subtopics.map((subtopic) => (
              <div
                key={subtopic.id}
                className="flex items-center gap-3 pl-[60px] pr-4 py-2.5 cursor-pointer transition-colors duration-150 active:bg-white/[0.04] relative"
                style={{ WebkitTapHighlightColor: 'transparent' }}
                onClick={() => onToggleSubtopic(subtopic)}
              >
                {/* Vertical guide lines */}
                <div className="absolute left-[26px] top-0 bottom-0 w-px bg-white/[0.06]" />
                <div className="absolute left-[46px] top-0 bottom-0 w-px bg-white/[0.04]" />

                {/* Checkbox */}
                <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSubtopicSelected(subtopic.id)}
                    onChange={() => onToggleSubtopic(subtopic)}
                    size="sm"
                  />
                </div>

                {/* Name */}
                <p className={`font-['Poppins:Regular',sans-serif] text-[12px] flex-1 leading-[18px] ${
                  isSubtopicSelected(subtopic.id) ? 'text-white/70' : 'text-white/40'
                }`}>
                  {subtopic.name}
                </p>

                {/* AI badge */}
                {subtopic.aiGenerated && (
                  <Sparkles className="w-[12px] h-[12px] text-[#FFD700] flex-shrink-0" strokeWidth={2.5} fill="#FFD700" />
                )}

                {/* Divider */}
                <div className="absolute bottom-0 left-[60px] right-0 h-px bg-white/[0.03]" />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}