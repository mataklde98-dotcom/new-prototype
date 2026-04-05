// ✅ GENERATE FLASHCARDS APP - Shares Subject/Category/Topic/Subtopic with ExamApp, Different after Config
import { useState, useEffect } from 'react';
import {
  SubjectSelection,
  CategorySelection,
  TopicSelection,
  SubtopicSelection,
  LoadingSpinner,
  Alert,
  EmptyContentModal,
  ConfirmDialog,
  getSubtopicsForTopic,
  loadCategoriesForSubject,
  loadTopicsForCategory,
  loadSubtopicsForTopic,
  loadWithMinimumDelay,
  loadAllSubjects,
  type Subject,
  type Category,
  type Topic,
  type Subtopic
} from '@/shared-content-selection';
import FlashcardConfiguration from '@/flashcardgen/components/FlashcardConfiguration';
import GeneratingFlashcardsScreen from '@/flashcardgen/components/GeneratingFlashcardsScreen';
import WeaknessFlashcardConfig from '@/flashcardgen/components/WeaknessFlashcardConfig';

type SelectionState = {
  subject?: { id: string; name: string };
  category?: { id: string; name: string };
  selectedTopic?: { id: string; name: string };
  subtopicsByTopic?: { [topicId: string]: Array<{ id: string; name: string }> };
  currentTopic?: { id: string; name: string };
};

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
  lastOpened?: Date; // Optional - nur wenn wirklich geöffnet wurde
  type: 'repeat' | 'manual' | 'weakness' | 'risk' | 'knowledge-gap' | 'teacher';
  generationNumber?: number;
  cards?: Array<{id: string; question: string; answer: string; confidenceScore?: number}>;
}

export default function GenerateFlashcardsApp({ 
  onClose,
  onFlashcardSetCreated,
  existingSets,
  weaknessContext
}: { 
  onClose?: () => void;
  onFlashcardSetCreated?: (newSet: FlashcardSet) => void;
  existingSets?: FlashcardSet[];
  weaknessContext?: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo' | 'learning-goal' | 'recommendation'; cardCount?: number; examTitle?: string; severityLabel?: string; contextLabel?: string; assignedDate?: string; notificationLabel?: string } | null;
}) {
  const [screen, setScreen] = useState<'subjectSelection' | 'categorySelection' | 'topicSelection' | 'subtopicSelection' | 'flashcardConfig' | 'generating' | 'weaknessConfig'>('subjectSelection');
  const [selectionState, setSelectionState] = useState<SelectionState>({});
  const [previousScreen, setPreviousScreen] = useState<'topicSelection' | 'subtopicSelection'>('topicSelection');
  const [expectedDeletedCategoryId, setExpectedDeletedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedScreens, setLoadedScreens] = useState<Set<string>>(new Set());
  const [flashcardCount, setFlashcardCount] = useState<number>(10);
  
  // Generation State
  const [generatingSubtopic, setGeneratingSubtopic] = useState<{ name: string; count: number } | null>(null);
  const [generationTimeoutId, setGenerationTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // Empty content modal state
  const [emptyContentModal, setEmptyContentModal] = useState<{
    show: boolean;
    level: 'categories' | 'topics' | 'subtopics';
  }>({ show: false, level: 'categories' });
  
  // ==================== ALERT STATES ====================
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  
  // ==================== CONFIRM DIALOG STATES ====================
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogTitle, setConfirmDialogTitle] = useState('');
  const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
  const [confirmDialogAction, setConfirmDialogAction] = useState<(() => void) | null>(null);
  
  // ==================== DYNAMIC DATA STATES ====================
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categoriesCache, setCategoriesCache] = useState<{ [subjectId: string]: Category[] }>({});
  const [topicsCache, setTopicsCache] = useState<{ [categoryId: string]: Topic[] }>({});
  const [subtopicsCache, setSubtopicsCache] = useState<{ [topicId: string]: Subtopic[] }>({});
  
  // ==================== GENERATION HANDLER ====================
  const handleGenerationComplete = () => {
    if (!generatingSubtopic || !selectionState.selectedTopic) return;
    
    // TODO: API Integration - Generate flashcards via API
    const now = new Date();
    const subtopicName = generatingSubtopic.name;
    const count = generatingSubtopic.count;
    
    // Calculate generation number: Find highest existing number + 1
    const setsWithSameUnterthema = (existingSets || []).filter(
      set => set.unterthema === subtopicName
    );
    const existingNumbers = setsWithSameUnterthema.map(set => set.generationNumber || 0);
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const generationNumber = maxNumber + 1;
    
    // Create title with golden badge prefix
    const titleWithBadge = `#${generationNumber} ${subtopicName}`;
    
    // Generate mock flashcards until we have API integration
    const mockFlashcards = Array.from({ length: count }, (_, i) => ({
      id: `card-${Date.now()}-${i}`,
      question: `Frage ${i + 1} zu ${subtopicName}`,
      answer: `Antwort ${i + 1} zu ${subtopicName}`,
      confidenceScore: 0
    }));
    
    // Create new FlashcardSet object
    const newFlashcardSet: FlashcardSet = {
      id: Date.now(), // Temporary ID until we have proper backend
      subject: selectionState.subject?.name || '',
      kategorie: selectionState.category?.name || '',
      thema: selectionState.selectedTopic.name,
      unterthema: subtopicName,
      title: titleWithBadge,
      cardCount: count,
      progress: 0,
      createdDate: now,
      type: 'repeat',
      generationNumber: generationNumber,
      cards: mockFlashcards
    };
    
    console.log('✅ Flashcard-Set erstellt:', newFlashcardSet);
    console.log('📚 Mock-Flashcards generiert:', mockFlashcards.length, 'Karten');
    
    // Add the set to App.tsx and open it automatically
    if (onFlashcardSetCreated) {
      onFlashcardSetCreated(newFlashcardSet);
    }
    
    // Reset generation state
    setGeneratingSubtopic(null);
    setGenerationTimeoutId(null);
  };
  
  const handleGenerationCancel = () => {
    // Clear timeout if exists
    if (generationTimeoutId) {
      clearTimeout(generationTimeoutId);
      setGenerationTimeoutId(null);
    }
    
    // Reset state and close modal
    setGeneratingSubtopic(null);
    
    if (weaknessContext) {
      // In weakness mode, go back to weakness config
      setScreen('weaknessConfig');
    } else {
      setScreen('flashcardConfig');
      if (onClose) {
        onClose();
      }
    }
  };
  
  // ==================== WEAKNESS MODE: init on mount ====================
  useEffect(() => {
    if (weaknessContext) {
      setScreen('weaknessConfig');
    }
  }, []);

  // ==================== WEAKNESS MODE: generation handler ====================
  const handleWeaknessGeneration = (count: number) => {
    if (!weaknessContext) return;
    
    setGeneratingSubtopic({
      name: weaknessContext.topic,
      count: count,
    });
    setFlashcardCount(count);
    setScreen('generating');
  };

  const handleWeaknessGenerationComplete = () => {
    if (!weaknessContext || !generatingSubtopic) return;
    
    const now = new Date();
    const count = generatingSubtopic.count;
    
    // Generate mock flashcards
    const mockFlashcards = Array.from({ length: count }, (_, i) => ({
      id: `card-${Date.now()}-${i}`,
      question: `Frage ${i + 1} zu ${weaknessContext.topic}`,
      answer: `Antwort ${i + 1} zu ${weaknessContext.topic}`,
      confidenceScore: 0
    }));
    
    // Determine set type based on source:
    // weakness → 'weakness' (appears under Prognosen → Erkannte Schwächen)
    // risk → 'risk' (appears under Prognosen → Zukünftige Risiken)
    // knowledge-gap → 'knowledge-gap' (appears under Prognosen → Wissenslücken)
    // teacher-task → 'teacher' (appears under Lehrer tab)
    // practice → 'repeat' (appears under KI-Sets)
    const setType = (() => {
      switch (weaknessContext.source) {
        case 'weakness':
          return 'weakness' as const;
        case 'risk':
          return 'risk' as const;
        case 'knowledge-gap':
          return 'knowledge-gap' as const;
        case 'teacher-task':
          return 'teacher' as const;
        case 'prep-todo':
          return 'repeat' as const;
        case 'learning-goal':
          return 'repeat' as const;
        case 'practice':
        default:
          return 'repeat' as const;
      }
    })();

    const kategorieLabel = (() => {
      switch (weaknessContext.source) {
        case 'weakness':
          return 'Lernanalyse';
        case 'risk':
          return 'Zukünftige Risiken';
        case 'knowledge-gap':
          return 'KI-Wissenslücken';
        case 'teacher-task':
          return 'Vom Lehrer';
        case 'prep-todo':
          return 'Klassenarbeit-Vorbereitung';
        case 'learning-goal':
          return 'Lernziel erreichen';
        case 'practice':
        default:
          return weaknessContext.examTitle ? 'Klassenarbeit-Vorbereitung' : weaknessContext.subject;
      }
    })();
    
    const newFlashcardSet: FlashcardSet = {
      id: Date.now(),
      subject: weaknessContext.subject,
      kategorie: kategorieLabel,
      thema: weaknessContext.topic,
      unterthema: weaknessContext.topic,
      title: `${weaknessContext.topic}`,
      cardCount: count,
      progress: 0,
      createdDate: now,
      type: setType,
      generationNumber: 1,
      cards: mockFlashcards
    };
    
    console.log(`✅ ${weaknessContext.source}-Karteikarten-Set erstellt (type: ${setType}):`, newFlashcardSet);
    
    if (onFlashcardSetCreated) {
      onFlashcardSetCreated(newFlashcardSet);
    }
    
    setGeneratingSubtopic(null);
    setGenerationTimeoutId(null);
  };
  
  // ==================== AI CONTENT CACHE INVALIDATION ====================
  useEffect(() => {
    const handleStorageChange = async () => {
      console.log('🔄 [GenerateFlashcards] Storage Event - AI Content wurde erstellt, Cache wird aktualisiert...');
      
      if (selectionState.subject) {
        const subjectId = selectionState.subject.id;
        try {
          const updatedCategories = await loadCategoriesForSubject(subjectId);
          setCategoriesCache(prev => ({ ...prev, [subjectId]: updatedCategories }));
          console.log('✅ Categories Cache aktualisiert:', updatedCategories.length, 'Kategorien');
        } catch (error) {
          console.error('❌ Fehler beim Aktualisieren des Category Cache:', error);
        }
      }
      
      if (selectionState.category) {
        const categoryId = selectionState.category.id;
        try {
          const updatedTopics = await loadTopicsForCategory(categoryId);
          setTopicsCache(prev => ({ ...prev, [categoryId]: updatedTopics }));
          console.log('✅ Topics Cache aktualisiert:', updatedTopics.length, 'Topics');
        } catch (error) {
          console.error('❌ Fehler beim Aktualisieren des Topic Cache:', error);
        }
      }
      
      const allTopicIds = Object.keys(subtopicsCache);
      for (const topicId of allTopicIds) {
        try {
          const updatedSubtopics = await loadSubtopicsForTopic(topicId);
          setSubtopicsCache(prev => ({ ...prev, [topicId]: updatedSubtopics }));
          console.log(`✅ Subtopics Cache für Topic ${topicId} aktualisiert:`, updatedSubtopics.length, 'Subtopics');
        } catch (error) {
          console.error(`❌ Fehler beim Aktualisieren des Subtopic Cache für Topic ${topicId}:`, error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [selectionState, subtopicsCache]);
  
  // ==================== LOAD SUBJECTS ON MOUNT ====================
  useEffect(() => {
    const loadSubjects = async () => {
      setIsLoading(true);
      try {
        const loadedSubjects = await loadAllSubjects();
        setSubjects(loadedSubjects);
        setLoadedScreens(prev => new Set(prev).add('subjectSelection'));
      } catch (error) {
        console.error('❌ Fehler beim Laden der Subjects:', error);
        setAlertTitle('Fehler');
        setAlertMessage('Subjects konnten nicht geladen werden. Bitte versuche es erneut.');
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSubjects();
  }, []);
  
  // ==================== SCREEN RENDERS ====================
  if (screen === 'subjectSelection') {
    return (
      <>
        <div className="relative w-full h-screen flex items-center justify-center">
          <div className="relative w-full h-full lg:max-w-[430px] lg:max-h-[932px] lg:scale-[0.8] lg:origin-center lg:overflow-hidden lg:rounded-[24px]">
            <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden lg:rounded-[24px] lg:shadow-2xl lg:border lg:border-white/10">
              <SubjectSelection
                mode="generate"
                title="Generiere Karteikarten"
                isLoading={isLoading}
                subjects={subjects}
                onSelectSubject={(subject) => {
                  const screenKey = `categorySelection-${subject.id}`;
                  const alreadyLoaded = loadedScreens.has(screenKey);
                  
                  if (alreadyLoaded) {
                    const cachedCategories = categoriesCache[subject.id] || [];
                    if (cachedCategories.length === 0) {
                      setEmptyContentModal({ show: true, level: 'categories' });
                      return;
                    }
                    
                    setSelectionState({ ...selectionState, subject });
                    setScreen('categorySelection');
                  } else {
                    setIsLoading(true);
                    loadWithMinimumDelay(() => loadCategoriesForSubject(subject.id))
                      .then((categories) => {
                        if (categories.length === 0) {
                          setIsLoading(false);
                          setEmptyContentModal({ show: true, level: 'categories' });
                          return;
                        }
                        
                        setCategoriesCache(prev => ({ ...prev, [subject.id]: categories }));
                        setSelectionState({ ...selectionState, subject });
                        setScreen('categorySelection');
                        setLoadedScreens(prev => new Set(prev).add(screenKey));
                        setIsLoading(false);
                      })
                      .catch((error) => {
                        console.error('Failed to load categories:', error);
                        setIsLoading(false);
                      });
                  }
                }}
                onClose={() => {
                  onClose?.();
                }}
              />
            </div>
          </div>
        </div>
        
        <EmptyContentModal
          isOpen={emptyContentModal.show}
          onClose={() => setEmptyContentModal({ show: false, level: 'categories' })}
          level={emptyContentModal.level}
        />
      </>
    );
  }

  if (screen === 'categorySelection') {
    return (
      <>
        <div className="relative w-full h-screen flex items-center justify-center">
          <div className="relative w-full h-full lg:max-w-[430px] lg:max-h-[932px] lg:scale-[0.8] lg:origin-center lg:overflow-hidden lg:rounded-[24px]">
            <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden lg:rounded-[24px] lg:shadow-2xl lg:border lg:border-white/10">
              <CategorySelection
                mode="generate"
                title="Generiere Karteikarten"
                isLoading={isLoading}
                subjectName={selectionState.subject?.name || ''}
                subjectId={selectionState.subject?.id || ''}
                categories={categoriesCache[selectionState.subject?.id || ''] || []}
                onRequestLoading={(loading) => setIsLoading(loading)}
                expectedDeletedCategoryId={expectedDeletedCategoryId}
                onClose={() => onClose?.()}
                onSelectCategory={(category) => {
                  const screenKey = `topicSelection-${category.id}`;
                  const alreadyLoaded = loadedScreens.has(screenKey);
                  
                  if (alreadyLoaded) {
                    const cachedTopics = topicsCache[category.id] || [];
                    if (cachedTopics.length === 0) {
                      setEmptyContentModal({ show: true, level: 'topics' });
                      return;
                    }
                    
                    setSelectionState({ 
                      ...selectionState, 
                      category,
                      selectedTopic: undefined,
                      subtopicsByTopic: {}
                    });
                    setScreen('topicSelection');
                  } else {
                    setIsLoading(true);
                    loadWithMinimumDelay(() => loadTopicsForCategory(category.id))
                      .then((topics) => {
                        if (topics.length === 0) {
                          setIsLoading(false);
                          setEmptyContentModal({ show: true, level: 'topics' });
                          return;
                        }
                        
                        setTopicsCache(prev => ({ ...prev, [category.id]: topics }));
                        setSelectionState({ 
                          ...selectionState, 
                          category,
                          selectedTopic: undefined,
                          subtopicsByTopic: {}
                        });
                        setScreen('topicSelection');
                        setLoadedScreens(prev => new Set(prev).add(screenKey));
                        setIsLoading(false);
                      })
                      .catch((error) => {
                        console.error('Failed to load topics:', error);
                        setIsLoading(false);
                      });
                  }
                }}
                onBack={() => {
                  setIsLoading(false);
                  setScreen('subjectSelection');
                }}
                onNavigateToLevel={(level) => {
                  if (level === 'subject') {
                    setIsLoading(false);
                    setScreen('subjectSelection');
                  }
                }}
                onCategoryDeleted={(categoryId) => {
                  const subjectId = selectionState.subject?.id;
                  if (subjectId && categoriesCache[subjectId]) {
                    setCategoriesCache(prev => ({
                      ...prev,
                      [subjectId]: prev[subjectId].filter(cat => cat.id !== categoryId)
                    }));
                    console.log('✅ Cache aktualisiert - Kategorie entfernt:', categoryId);
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        <EmptyContentModal
          isOpen={emptyContentModal.show}
          onClose={() => setEmptyContentModal({ show: false, level: 'categories' })}
          level={emptyContentModal.level}
        />
      </>
    );
  }

  if (screen === 'topicSelection') {
    return (
      <>
        <div className="relative w-full h-screen flex items-center justify-center">
          <div className="relative w-full h-full lg:max-w-[430px] lg:max-h-[932px] lg:scale-[0.8] lg:origin-center lg:overflow-hidden lg:rounded-[24px]">
            <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden lg:rounded-[24px] lg:shadow-2xl lg:border lg:border-white/10">
              <TopicSelection
                mode="generate"
                title="Generiere Karteikarten"
                isLoading={isLoading}
                categoryName={selectionState.category?.name || ''}
                categoryId={selectionState.category?.id || ''}
                subjectId={selectionState.subject?.id || 'math'}
                subjectName={selectionState.subject?.name || 'Mathematik'}
                topics={topicsCache[selectionState.category?.id || ''] || []}
                selectedTopic={selectionState.selectedTopic}
                subtopicsByTopic={selectionState.subtopicsByTopic || {}}
                onRequestLoading={(loading) => setIsLoading(loading)}
                onClose={() => onClose?.()}
                onSelectTopic={(topic) => {
                  if (topic) {
                    setSelectionState({ 
                      ...selectionState, 
                      selectedTopic: topic,
                      subtopicsByTopic: { [topic.id]: [] }
                    });
                  } else {
                    setSelectionState({ 
                      ...selectionState, 
                      selectedTopic: undefined,
                      subtopicsByTopic: {}
                    });
                  }
                }}
                onContinue={() => {
                  if (selectionState.selectedTopic) {
                    const topicId = selectionState.selectedTopic.id;
                    const subtopics = getSubtopicsForTopic(topicId);
                    
                    if (subtopics.length === 0) {
                      setEmptyContentModal({ show: true, level: 'subtopics' });
                      return;
                    }
                    
                    setSubtopicsCache(prev => ({ ...prev, [topicId]: subtopics }));
                    setSelectionState({
                      ...selectionState,
                      subtopicsByTopic: { [selectionState.selectedTopic.id]: [] }
                    });
                    setPreviousScreen('topicSelection');
                    setScreen('flashcardConfig');
                  }
                }}
                onNavigateToSubtopics={(topic) => {
                  const screenKey = `subtopicSelection-${topic.id}`;
                  const alreadyLoaded = loadedScreens.has(screenKey);
                  
                  // Check if we're navigating to a DIFFERENT topic
                  // If yes, clear all subtopic selections (Single-Select Mode!)
                  const isDifferentTopic = selectionState.selectedTopic && selectionState.selectedTopic.id !== topic.id;
                  
                  if (alreadyLoaded) {
                    const subtopicsForTopic = subtopicsCache[topic.id] || [];
                    if (subtopicsForTopic.length === 0) {
                      setEmptyContentModal({ show: true, level: 'subtopics' });
                      return;
                    }
                    setSelectionState({ 
                      ...selectionState, 
                      currentTopic: topic,
                      // Clear subtopic selections if navigating to different topic
                      subtopicsByTopic: isDifferentTopic ? {} : selectionState.subtopicsByTopic
                    });
                    setScreen('subtopicSelection');
                  } else {
                    setIsLoading(true);
                    loadWithMinimumDelay(() => loadSubtopicsForTopic(topic.id))
                      .then((subtopics) => {
                        if (subtopics.length === 0) {
                          setIsLoading(false);
                          setEmptyContentModal({ show: true, level: 'subtopics' });
                          return;
                        }
                        setSubtopicsCache(prev => ({ ...prev, [topic.id]: subtopics }));
                        setSelectionState({ 
                          ...selectionState, 
                          currentTopic: topic,
                          // Clear subtopic selections if navigating to different topic
                          subtopicsByTopic: isDifferentTopic ? {} : selectionState.subtopicsByTopic
                        });
                        setScreen('subtopicSelection');
                        setLoadedScreens(prev => new Set(prev).add(screenKey));
                        setIsLoading(false);
                      })
                      .catch((error) => {
                        console.error('Failed to load subtopics:', error);
                        setIsLoading(false);
                        setEmptyContentModal({ show: true, level: 'subtopics' });
                      });
                  }
                }}
                onBack={() => {
                  setIsLoading(false);
                  setScreen('categorySelection');
                }}
                onNavigateToLevel={(level, deletedCategoryId) => {
                  if (level === 'subject') {
                    setIsLoading(false);
                    setExpectedDeletedCategoryId(null);
                    setScreen('subjectSelection');
                  } else if (level === 'category') {
                    if (deletedCategoryId) {
                      setExpectedDeletedCategoryId(deletedCategoryId);
                    } else {
                      setIsLoading(false);
                      setExpectedDeletedCategoryId(null);
                    }
                    setScreen('categorySelection');
                  }
                }}
                onRequestAIContent={() => {
                  setEmptyContentModal({ show: true, level: 'topics' });
                }}
              />
            </div>
          </div>
        </div>
        
        <Alert
          show={showAlert}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
        
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title={confirmDialogTitle}
          message={confirmDialogMessage}
          onConfirm={() => {
            if (confirmDialogAction) {
              confirmDialogAction();
            }
          }}
          onCancel={() => setShowConfirmDialog(false)}
          confirmText="Ja"
          cancelText="Nein"
        />
        
        <EmptyContentModal
          isOpen={emptyContentModal.show}
          onClose={() => setEmptyContentModal({ show: false, level: 'categories' })}
          level={emptyContentModal.level}
        />
      </>
    );
  }

  if (screen === 'subtopicSelection') {
    return (
      <>
        <div className="relative w-full h-screen flex items-center justify-center">
          <div className="relative w-full h-full lg:max-w-[430px] lg:max-h-[932px] lg:scale-[0.8] lg:origin-center lg:overflow-hidden lg:rounded-[24px]">
            <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden lg:rounded-[24px] lg:shadow-2xl lg:border lg:border-white/10">
              <SubtopicSelection
                mode="generate"
                title="Generiere Karteikarten"
                isLoading={isLoading}
                topicName={selectionState.currentTopic?.name || ''}
                topicId={selectionState.currentTopic?.id || ''}
                categoryId={selectionState.category?.id || ''}
                subjectId={selectionState.subject?.id || 'math'}
                subtopics={subtopicsCache[selectionState.currentTopic?.id || ''] || []}
                onRequestLoading={(loading) => setIsLoading(loading)}
                onClose={() => onClose?.()}
                onContinue={(subtopics) => {
                  if (!selectionState.currentTopic) return;
                  
                  const newSubtopicsByTopic = { ...selectionState.subtopicsByTopic };
                  const totalSubtopics = subtopicsCache[selectionState.currentTopic.id]?.length || 0;
                  
                  if (subtopics.length === totalSubtopics && totalSubtopics > 0) {
                    newSubtopicsByTopic[selectionState.currentTopic.id] = [];
                  } else {
                    newSubtopicsByTopic[selectionState.currentTopic.id] = subtopics;
                  }
                  
                  setSelectionState({ 
                    ...selectionState, 
                    selectedTopic: selectionState.currentTopic,
                    subtopicsByTopic: newSubtopicsByTopic,
                    currentTopic: undefined 
                  });
                  setPreviousScreen('subtopicSelection');
                  setScreen('flashcardConfig');
                }}
                onBack={(subtopics) => {
                  if (!selectionState.currentTopic) {
                    setScreen('topicSelection');
                    return;
                  }
                  
                  const newSubtopicsByTopic = { ...selectionState.subtopicsByTopic };
                  
                  if (subtopics.length > 0) {
                    const totalSubtopics = subtopicsCache[selectionState.currentTopic.id]?.length || 0;
                    if (subtopics.length === totalSubtopics && totalSubtopics > 0) {
                      newSubtopicsByTopic[selectionState.currentTopic.id] = [];
                    } else {
                      newSubtopicsByTopic[selectionState.currentTopic.id] = subtopics;
                    }
                    setSelectionState({ 
                      ...selectionState, 
                      selectedTopic: selectionState.currentTopic,
                      subtopicsByTopic: newSubtopicsByTopic,
                      currentTopic: undefined 
                    });
                  } else {
                    delete newSubtopicsByTopic[selectionState.currentTopic.id];
                    const shouldDeselectTopic = selectionState.selectedTopic?.id === selectionState.currentTopic?.id;
                    setSelectionState({ 
                      ...selectionState, 
                      selectedTopic: shouldDeselectTopic ? undefined : selectionState.selectedTopic,
                      subtopicsByTopic: newSubtopicsByTopic,
                      currentTopic: undefined 
                    });
                  }
                  setIsLoading(false);
                  setScreen('topicSelection');
                }}
                onNavigateToLevel={(level, subtopics) => {
                  if (!selectionState.currentTopic) {
                    if (level === 'subject') {
                      setIsLoading(false);
                      setScreen('subjectSelection');
                    } else if (level === 'category') {
                      setIsLoading(false);
                      setScreen('categorySelection');
                    } else if (level === 'topic') {
                      setIsLoading(false);
                      setScreen('topicSelection');
                    }
                    return;
                  }
                  
                  const newSubtopicsByTopic = { ...selectionState.subtopicsByTopic };
                  if (subtopics.length > 0) {
                    const totalSubtopics = subtopicsCache[selectionState.currentTopic.id]?.length || 0;
                    if (subtopics.length === totalSubtopics && totalSubtopics > 0) {
                      newSubtopicsByTopic[selectionState.currentTopic.id] = [];
                    } else {
                      newSubtopicsByTopic[selectionState.currentTopic.id] = subtopics;
                    }
                    setSelectionState({ 
                      ...selectionState, 
                      selectedTopic: selectionState.currentTopic,
                      subtopicsByTopic: newSubtopicsByTopic,
                      currentTopic: undefined 
                    });
                  } else {
                    delete newSubtopicsByTopic[selectionState.currentTopic.id];
                    const shouldDeselectTopic = selectionState.selectedTopic?.id === selectionState.currentTopic?.id;
                    setSelectionState({ 
                      ...selectionState, 
                      selectedTopic: shouldDeselectTopic ? undefined : selectionState.selectedTopic,
                      subtopicsByTopic: newSubtopicsByTopic,
                      currentTopic: undefined 
                    });
                  }
                  if (level === 'subject') {
                    setIsLoading(false);
                    setScreen('subjectSelection');
                  } else if (level === 'category') {
                    setIsLoading(false);
                    setScreen('categorySelection');
                  } else if (level === 'topic') {
                    setIsLoading(false);
                    setScreen('topicSelection');
                  }
                }}
                initialSelection={(() => {
                  const topicId = selectionState.currentTopic?.id || '';
                  const subtopicsForTopic = selectionState.subtopicsByTopic?.[topicId];
                  
                  if (Array.isArray(subtopicsForTopic) && subtopicsForTopic.length === 0) {
                    return subtopicsCache[topicId] || [];
                  }
                  
                  return subtopicsForTopic || [];
                })()}
              />
            </div>
          </div>
        </div>
        
        <EmptyContentModal
          isOpen={emptyContentModal.show}
          onClose={() => setEmptyContentModal({ show: false, level: 'categories' })}
          level={emptyContentModal.level}
        />
      </>
    );
  }

  if (screen === 'flashcardConfig') {
    // Get all selected subtopics
    // If subtopicsByTopic has empty array, it means "all subtopics" - load them all
    console.log('🎯 FlashcardConfiguration - selectionState:', {
      selectedTopic: selectionState.selectedTopic,
      subtopicsByTopic: selectionState.subtopicsByTopic,
      cache: subtopicsCache
    });
    
    const allSelectedSubtopics = selectionState.selectedTopic && selectionState.subtopicsByTopic
      ? (() => {
          const subtopicsArray = Object.values(selectionState.subtopicsByTopic).flat();
          console.log('📊 subtopicsArray:', subtopicsArray);
          // If empty array, load all subtopics for the selected topic
          if (subtopicsArray.length === 0 && selectionState.selectedTopic) {
            const fromHelper = getSubtopicsForTopic(selectionState.selectedTopic.id);
            console.log('🔄 Lade ALLE Subtopics mit getSubtopicsForTopic:', fromHelper);
            return fromHelper;
          }
          return subtopicsArray;
        })()
      : [];
    
    console.log('✅ allSelectedSubtopics FINAL:', allSelectedSubtopics);

    return (
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="relative w-full h-full lg:max-w-[430px] lg:max-h-[932px] lg:scale-[0.8] lg:origin-center lg:overflow-hidden lg:rounded-[24px]">
          <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden lg:rounded-[24px] lg:shadow-2xl lg:border lg:border-white/10">
            <FlashcardConfiguration
              subjectId={selectionState.subject?.id || 'math'}
              selectedSubtopics={allSelectedSubtopics}
              onStartGeneration={(count) => {
                setGeneratingSubtopic({
                  name: allSelectedSubtopics[0].name,
                  count: count
                });
                setFlashcardCount(count);
                setScreen('generating');
              }}
              onBack={() => {
                // Go back to the screen we came from (topic or subtopic)
                if (previousScreen === 'subtopicSelection') {
                  // If we came from subtopic selection, go back there
                  if (selectionState.selectedTopic) {
                    setSelectionState({
                      ...selectionState,
                      currentTopic: selectionState.selectedTopic,
                      selectedTopic: undefined
                    });
                  }
                  setScreen('subtopicSelection');
                } else {
                  // Otherwise go back to topic selection
                  setScreen('topicSelection');
                }
              }}
              onEditSubtopics={() => {
                // Navigate to subtopic selection to edit
                if (selectionState.selectedTopic) {
                  setSelectionState({
                    ...selectionState,
                    currentTopic: selectionState.selectedTopic,
                    selectedTopic: undefined
                  });
                  setScreen('subtopicSelection');
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'weaknessConfig') {
    return (
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="relative w-full h-full lg:max-w-[430px] lg:max-h-[932px] lg:scale-[0.8] lg:origin-center lg:overflow-hidden lg:rounded-[24px]">
          <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden lg:rounded-[24px] lg:shadow-2xl lg:border lg:border-white/10">
            <WeaknessFlashcardConfig
              topic={weaknessContext?.topic || ''}
              subject={weaknessContext?.subject || ''}
              severity={weaknessContext?.severity || 'warning'}
              recommendation={weaknessContext?.recommendation || ''}
              source={weaknessContext?.source || 'weakness'}
              lockedCardCount={weaknessContext?.cardCount}
              examTitle={weaknessContext?.examTitle}
              assignedDate={weaknessContext?.assignedDate}
              severityLabel={weaknessContext?.severityLabel}
              contextLabel={weaknessContext?.contextLabel}
              notificationLabel={weaknessContext?.notificationLabel}
              onStartGeneration={handleWeaknessGeneration}
              onClose={() => onClose?.()}
            />
          </div>
        </div>
      </div>
    );
  }

  // GENERATING SCREEN
  if (screen === 'generating' && generatingSubtopic) {
    return (
      <>
        <div className="relative w-full h-screen flex items-center justify-center">
          <div className="relative w-full h-full lg:max-w-[430px] lg:max-h-[932px] lg:scale-[0.8] lg:origin-center lg:overflow-hidden lg:rounded-[24px]">
            <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden lg:rounded-[24px] lg:shadow-2xl lg:border lg:border-white/10">
              <GeneratingFlashcardsScreen
                subtopicName={generatingSubtopic.name}
                flashcardCount={generatingSubtopic.count}
                onComplete={weaknessContext ? handleWeaknessGenerationComplete : handleGenerationComplete}
                onCancel={handleGenerationCancel}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}