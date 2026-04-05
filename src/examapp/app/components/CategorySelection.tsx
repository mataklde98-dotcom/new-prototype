import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import SwipeToDelete from './SwipeToDelete';
import AIContentGenerationModal from './AIContentGenerationModal';
import AIContentGenerationResultModal from './AIContentGenerationResultModal';
import AIContentExistsModal from './AIContentExistsModal';
import { deleteAICategory } from '../utils/aiContentStorage';
import CloseButton from '@/app/components/CloseButton';
import { generateAIContentHierarchically } from '../utils/aiContentHierarchy';
import { simulateNetworkDelay } from '../utils/loadingUtils';

type Category = {
  id: string;
  name: string;
  subjectId: string;
  aiGenerated?: boolean;
};

type CategorySelectionProps = {
  subjectName: string;
  subjectId: string;
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  onBack: () => void;
  onClose?: () => void;
  onNavigateToLevel?: (level: 'subject') => void;
  onCategoryDeleted?: (categoryId: string) => void; // For updating parent cache
  isLoading?: boolean;
  onRequestLoading?: (isLoading: boolean) => void; // Callback to show/hide loading screen
  expectedDeletedCategoryId?: string | null; // ✅ NEU: Signal für CASCADE-Delete
  title?: string; // Dynamic title for different features
  mode?: 'exam' | 'generate'; // Mode for different selection behaviors
};

export default function CategorySelection({ subjectName, subjectId, categories, onSelectCategory, onBack, onClose, onNavigateToLevel, isLoading, onCategoryDeleted, onRequestLoading, expectedDeletedCategoryId, title = 'Prüfungssimulation', mode = 'exam' }: CategorySelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
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
  // ✅ NEU: State für Duplikat-Modal
  const [showExistsModal, setShowExistsModal] = useState(false);
  const [existsModalContent, setExistsModalContent] = useState<{
    categories?: Array<{
      id: string;
      name: string;
      aiGenerated: boolean;
      topics?: Array<{
        id: string;
        name: string;
        aiGenerated: boolean;
        subtopics?: Array<{
          id: string;
          name: string;
          aiGenerated: boolean;
        }>;
      }>;
    }>;
  } | null>(null);
  
  // ✅ NEU: State für Subject-Mismatch Modal
  const [showMismatchModal, setShowMismatchModal] = useState(false);
  const [mismatchModalContent, setMismatchModalContent] = useState<{
    userInput: string;
    currentSubject: { id: string; name: string };
    detectedSubject: { id: string; name: string };
  } | null>(null);
  
  // ✅ NEU: State für Mismatch Recovery (Input + Fach speichern)
  const [recoveryInput, setRecoveryInput] = useState('');
  const [recoverySubjectId, setRecoverySubjectId] = useState<string | undefined>(undefined);
  
  const [localCategories, setLocalCategories] = useState<Category[]>(categories); // Local state for dynamic updates
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Force re-render when AI content changes
  const [, forceUpdate] = useState({});

  // Update local categories when prop changes
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);
  
  // Listen for AI content changes (topics/subtopics creation/deletion)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('🔄 CategorySelection - AI Content geändert, UI wird aktualisiert');
      forceUpdate({}); // Force re-render to update topic counts
      
      // ✅ CASCADE-DELETE SYNCHRONISATION
      // Wenn wir erwarten, dass eine Kategorie gelöscht wurde (von TopicSelection)
      if (expectedDeletedCategoryId) {
        // Prüfe ob die Kategorie wirklich aus dem State entfernt wurde
        const categoryStillExists = localCategories.some(cat => cat.id === expectedDeletedCategoryId);
        
        if (!categoryStillExists) {
          console.log('✅ CASCADE COMPLETE: Kategorie wurde entfernt → Loading OFF');
          // Kategorie ist weg → Loading Screen ausblenden
          if (onRequestLoading) {
            onRequestLoading(false);
          }
        } else {
          console.log('⏳ CASCADE PENDING: Kategorie existiert noch, warte...');
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [expectedDeletedCategoryId, localCategories, onRequestLoading]);

  const handleSelectCategory = (category: Category) => {
    onSelectCategory(category);
  };

  const handleNavigate = (level: 'subject') => {
    setShowDropdown(false);
    if (onNavigateToLevel) {
      onNavigateToLevel(level);
    }
  };

  useEffect(() => {
    const currentRef = dropdownRef.current;
    const handleClickOutside = (event: MouseEvent) => {
      if (currentRef && !currentRef.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter categories by search query (already filtered by subject in App.tsx)
  const filteredCategories = localCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  // Delete AI-generated category
  const handleDeleteCategory = async (categoryId: string) => {
    // ✅ SYNCHRONE CASCADE-LÖSCHUNG mit Return-Value
    const result = deleteAICategory(categoryId);
    
    console.log('🗑️ DELETE RESULT:', result);
    
    // Sofort aus UI entfernen (optimistic update)
    setLocalCategories(prev => prev.filter(cat => cat.id !== categoryId));
    
    // Callback to update cache in parent
    if (onCategoryDeleted) {
      onCategoryDeleted(categoryId);
    }
    
    // ✅ NUR LOADING WENN CASCADE-REDIRECT passiert
    if (result.deletedSubject) {
      console.log('🔙 CASCADE: Subject ist jetzt leer → Redirect zu SubjectSelection');
      
      // Show loading screen während CASCADE-Redirect
      if (onRequestLoading) {
        onRequestLoading(true);
      }
      
      // ✅ WARTE LANGE bevor Navigation → Subject-Verschwinden NICHT sichtbar
      await simulateNetworkDelay(2000, 2200);
      
      if (onNavigateToLevel) {
        onNavigateToLevel('subject');
      } else {
        onBack();
      }
      
      // ✅ Noch länger warten NACH Navigation → Loading bleibt über neuem Screen
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (onRequestLoading) {
        onRequestLoading(false);
      }
    }
    // Sonst: Bleibe auf CategorySelection (UI updated sich automatisch, KEIN Loading)
  };

  // AI Content Generation Handler
  const handleAIGeneration = async (input: string, selectedSubjectId: string) => {
    console.log('🤖 KI-Generierung gestartet:', {
      currentSubject: subjectName,
      currentSubjectId: subjectId,
      selectedSubjectId: selectedSubjectId,
      userInput: input
    });
    
    // ✅ HIERARCHISCHE AI-LOGIK (zentrale Funktion) - KI erkennt automatisch Fach
    const result = await generateAIContentHierarchically(input, selectedSubjectId);
    
    console.log('🤖 AI-Ergebnis RAW:', JSON.stringify(result, null, 2));
    console.log('🤖 AI-Ergebnis type:', result.type);
    console.log('🤖 AI-Ergebnis category:', result.category);
    console.log('🤖 AI-Ergebnis topic:', result.topic);
    console.log('🤖 AI-Ergebnis subtopics:', result.subtopics);
    
    // ✅ Prüfe ob Content bereits existiert
    if (result.type === 'already-exists') {
      console.log('⚠️ DUPLIKAT GEFUNDEN - Zeige Exists Modal mit Pfad');
      
      setExistsModalContent(result.existingContent || { categories: [] });
      setShowAIModal(false); // AI-Modal schließen
      setShowExistsModal(true); // Exists-Modal öffnen
      return;
    }
    
    // ✅ Subject-Mismatch: Zeige Mismatch-Modal
    if (result.type === 'subject-mismatch') {
      console.log('🚨 SUBJECT-MISMATCH - Zeige Mismatch Modal');
      setMismatchModalContent(result.subjectMismatch || null);
      setShowAIModal(false); // AI-Modal schließen
      setShowMismatchModal(true); // Mismatch-Modal öffnen
      return;
    }
    
    // ✅ KORREKTE TRANSFORMATION basierend auf result.type
    // Die KI entscheidet was erstellt wird - Modal zeigt nur das NEU erstellte mit Stars!
    const transformedContent = {
      categories: [{
        name: result.category.name,
        isNew: result.category.isNew  // Nur true wenn KI NEUE Kategorie erstellt hat
      }],
      topics: result.topic ? [{
        name: result.topic.name,
        isNew: result.topic.isNew,  // Nur true wenn KI NEUES Thema erstellt hat
        subtopics: result.subtopics.map(subtopicName => ({
          name: subtopicName,
          isNew: true  // Subtopics sind immer neu erstellt
        }))
      }] : []
    };
    
    console.log('🔄 TRANSFORMED Content für Modal:', JSON.stringify(transformedContent, null, 2));
    console.log('📊 Ergebnis-Typ:', result.type);
    console.log('  → Kategorie isNew:', result.category.isNew);
    console.log('  → Topic isNew:', result.topic?.isNew);
    
    // ✅ Schließe AI-Modal und öffne Result-Modal
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
    
    if (result.type === 'new-category') {
      setLocalCategories(prev => [...prev, {
        id: result.category.id,
        name: result.category.name,
        subjectId: subjectId,
        aiGenerated: true
      }]);
    }
    
    window.dispatchEvent(new Event('storage'));
  };
  
  // ✅ NEU: Subject-Mismatch Handler
  const handleSwitchSubject = () => {
    if (!mismatchModalContent) return;
    
    console.log('🔄 SUBJECT-WECHSEL:', {
      from: mismatchModalContent.currentSubject.name,
      to: mismatchModalContent.detectedSubject.name,
      input: mismatchModalContent.userInput
    });
    
    // ✅ SPEICHERE Input + erkanntes Fach für Recovery
    setRecoveryInput(mismatchModalContent.userInput);
    setRecoverySubjectId(mismatchModalContent.detectedSubject.id);
    
    // Schließe Mismatch Modal, öffne AI-Modal mit neuem Fach
    setShowMismatchModal(false);
    setShowAIModal(true);
  };
  
  const handleContinueWithExplanation = async (explanation: string) => {
    if (!mismatchModalContent) return;
    
    console.log('✅ USER BLEIBT BEI AKTUELLEM FACH:', {
      subject: mismatchModalContent.currentSubject.name,
      explanation: explanation || '(keine Erklärung gegeben)'
    });
    
    // Schließe Mismatch Modal
    setShowMismatchModal(false);
    
    // Generiere Content mit User-Erklärung (API würde das berücksichtigen)
    const input = explanation 
      ? `${mismatchModalContent.userInput} (${explanation})`
      : mismatchModalContent.userInput;
    
    const result = await generateAIContentHierarchically(input, mismatchModalContent.currentSubject.id);
    
    // Verarbeite Ergebnis wie gewohnt
    if (result.type === 'already-exists') {
      setExistsModalContent(result.existingContent || { categories: [] });
      setShowExistsModal(true);
      return;
    }
    
    setAiResultContent({
      categories: [{
        name: result.category.name,
        isNew: result.category.isNew,
        topics: result.topic ? [{
          name: result.topic.name,
          isNew: result.topic.isNew,
          subtopics: result.subtopics.map(subtopicName => ({
            name: subtopicName,
            isNew: true // Alle Subtopics sind neu wenn sie gerade erstellt wurden
          }))
        }] : []
      }]
    });
    
    if (result.type === 'new-category') {
      setLocalCategories(prev => [...prev, {
        id: result.category.id,
        name: result.category.name,
        subjectId: subjectId,
        aiGenerated: true
      }]);
    }
    
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
              Wähle eine Kategorie
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
          <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80 whitespace-nowrap">Kategorien</p>
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
            <div className="px-3.5 py-2.5 bg-white/[0.05]">
              <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white">Kategorien</p>
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

      {/* Category List */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto overscroll-none relative">
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredCategories.length === 0 ? (
            searchQuery ? (
              <div className="text-center py-12">
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">
                  Keine Kategorien gefunden
                </p>
              </div>
            ) : null
          ) : (
            <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
              {filteredCategories.map((category, index) => {
                const categoryContent = (
                  <div
                    className="flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors duration-150 active:bg-white/[0.04] relative"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    onClick={() => handleSelectCategory(category)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectCategory(category);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[15px] text-white flex-1 leading-[22px]">
                      {category.name}
                    </p>
                    {category.aiGenerated && (
                      <Sparkles className="w-[16px] h-[16px] text-[#FFD700] flex-shrink-0" strokeWidth={2.5} fill="#FFD700" />
                    )}
                    <svg className="w-[7px] h-[12px] flex-shrink-0" fill="none" viewBox="0 0 7 12">
                      <path d="M1 1L5.5 6L1 11" stroke="#8E8E93" strokeLinecap="round" strokeWidth="1.5" />
                    </svg>
                    {/* Divider */}
                    <div className="absolute bottom-0 left-4 right-0 h-px bg-white/[0.08]" />
                  </div>
                );

                // Wrap AI-generated categories with SwipeToDelete
                if (category.aiGenerated) {
                  return (
                    <SwipeToDelete
                      key={category.id}
                      onDelete={() => handleDeleteCategory(category.id)}
                    >
                      {categoryContent}
                    </SwipeToDelete>
                  );
                }

                // Standard categories without swipe
                return (
                  <div key={category.id}>
                    {categoryContent}
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

      {/* AI Content Generation Modal */}
      <AIContentGenerationModal
        isOpen={showAIModal}
        type="category"
        currentSubjectId={subjectId}
        currentSubjectName={subjectName}
        onClose={() => {
          setShowAIModal(false);
          // ✅ RESET Recovery State beim Schließen
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
    </div>
  );
}