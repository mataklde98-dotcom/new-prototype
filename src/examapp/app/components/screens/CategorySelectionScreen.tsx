// ==================== CATEGORY SELECTION SCREEN ====================
// Extrahiert aus App.tsx - Kategorieauswahl
// 1:1 Kopie des screen === 'categorySelection' Blocks

import {
  CategorySelection,
  EmptyContentModal,
  loadTopicsForCategory,
  loadWithMinimumDelay,
  type Category,
  type Topic,
} from '@/shared-content-selection';
import MobileViewportLayout from './MobileViewportLayout';

type SelectionState = {
  subject?: { id: string; name: string };
  category?: { id: string; name: string };
  selectedTopic?: { id: string; name: string };
  subtopicsByTopic?: { [topicId: string]: Array<{ id: string; name: string }> };
  currentTopic?: { id: string; name: string };
  selectedSubtopics?: Array<{ id: string; name: string }>;
};

interface CategorySelectionScreenProps {
  isLoading: boolean;
  selectionState: SelectionState;
  categoriesCache: { [subjectId: string]: Category[] };
  topicsCache: { [categoryId: string]: Topic[] };
  loadedScreens: Set<string>;
  expectedDeletedCategoryId: string | null;
  emptyContentModal: { show: boolean; level: 'categories' | 'topics' | 'subtopics' };
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectionState: React.Dispatch<React.SetStateAction<SelectionState>>;
  setCategoriesCache: React.Dispatch<React.SetStateAction<{ [subjectId: string]: Category[] }>>;
  setTopicsCache: React.Dispatch<React.SetStateAction<{ [categoryId: string]: Topic[] }>>;
  setLoadedScreens: React.Dispatch<React.SetStateAction<Set<string>>>;
  setExpectedDeletedCategoryId: React.Dispatch<React.SetStateAction<string | null>>;
  setEmptyContentModal: React.Dispatch<React.SetStateAction<{ show: boolean; level: 'categories' | 'topics' | 'subtopics' }>>;
  setScreen: (screen: string) => void;
  onClose?: () => void;
}

export default function CategorySelectionScreen({
  isLoading,
  selectionState,
  categoriesCache,
  topicsCache,
  loadedScreens,
  expectedDeletedCategoryId,
  emptyContentModal,
  setIsLoading,
  setSelectionState,
  setCategoriesCache,
  setTopicsCache,
  setLoadedScreens,
  setExpectedDeletedCategoryId,
  setEmptyContentModal,
  setScreen,
  onClose,
}: CategorySelectionScreenProps) {
  return (
    <>
      <MobileViewportLayout>
        <CategorySelection
          title="Prüfungssimulation"
          isLoading={isLoading}
          subjectName={selectionState.subject?.name || ''}
          subjectId={selectionState.subject?.id || ''}
          categories={categoriesCache[selectionState.subject?.id || ''] || []}
          onRequestLoading={(loading) => setIsLoading(loading)}
          expectedDeletedCategoryId={expectedDeletedCategoryId}
          onClose={onClose}
          onSelectCategory={(category) => {
            const screenKey = `topicSelection-${category.id}`;
            const alreadyLoaded = loadedScreens.has(screenKey);
            
            if (alreadyLoaded) {
              // Check if cached topics are empty
              const cachedTopics = topicsCache[category.id] || [];
              if (cachedTopics.length === 0) {
                setEmptyContentModal({ show: true, level: 'topics' });
                return;
              }
              
              // Instant navigation - topics already cached
              // Reset topic and subtopic selection when changing category
              setSelectionState({ 
                ...selectionState, 
                category,
                selectedTopic: undefined,
                subtopicsByTopic: {}
              });
              setScreen('topicSelection');
            } else {
              // Dynamically load topics - Zeit hängt von Content ab
              setIsLoading(true);
              loadWithMinimumDelay(() => loadTopicsForCategory(category.id))
                .then((topics) => {
                  // Check if topics are empty
                  if (topics.length === 0) {
                    setIsLoading(false);
                    setEmptyContentModal({ show: true, level: 'topics' });
                    return;
                  }
                  
                  // Cache topics for this category
                  setTopicsCache(prev => ({ ...prev, [category.id]: topics }));
                  // Reset topic and subtopic selection when changing category
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
                  // TODO: Show error to user
                });
            }
          }}
          onBack={() => {
            setIsLoading(false); // ✅ Reset loading state
            setScreen('subjectSelection');
          }}
          onNavigateToLevel={(level) => {
            if (level === 'subject') {
              setIsLoading(false); // ✅ Reset loading state
              setScreen('subjectSelection');
            }
          }}
          onCategoryDeleted={(categoryId) => {
            // Update cache: Remove deleted category
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
      </MobileViewportLayout>
      
      {/* Empty Content Modal */}
      <EmptyContentModal
        isOpen={emptyContentModal.show}
        onClose={() => setEmptyContentModal({ show: false, level: 'categories' })}
        level={emptyContentModal.level}
      />
    </>
  );
}