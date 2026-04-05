// ==================== SUBJECT SELECTION SCREEN ====================
// Extrahiert aus App.tsx - Fächerauswahl
// 1:1 Kopie des screen === 'subjectSelection' Blocks

import {
  SubjectSelection,
  EmptyContentModal,
  loadCategoriesForSubject,
  loadWithMinimumDelay,
  type Subject,
  type Category,
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

interface SubjectSelectionScreenProps {
  isLoading: boolean;
  subjects: Subject[];
  selectionState: SelectionState;
  categoriesCache: { [subjectId: string]: Category[] };
  loadedScreens: Set<string>;
  emptyContentModal: { show: boolean; level: 'categories' | 'topics' | 'subtopics' };
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectionState: React.Dispatch<React.SetStateAction<SelectionState>>;
  setCategoriesCache: React.Dispatch<React.SetStateAction<{ [subjectId: string]: Category[] }>>;
  setLoadedScreens: React.Dispatch<React.SetStateAction<Set<string>>>;
  setEmptyContentModal: React.Dispatch<React.SetStateAction<{ show: boolean; level: 'categories' | 'topics' | 'subtopics' }>>;
  setScreen: (screen: string) => void;
  onClose?: () => void;
}

export default function SubjectSelectionScreen({
  isLoading,
  subjects,
  selectionState,
  categoriesCache,
  loadedScreens,
  emptyContentModal,
  setIsLoading,
  setSelectionState,
  setCategoriesCache,
  setLoadedScreens,
  setEmptyContentModal,
  setScreen,
  onClose,
}: SubjectSelectionScreenProps) {
  return (
    <>
      <MobileViewportLayout>
        <SubjectSelection
          title="Prüfungssimulation"
          isLoading={isLoading}
          subjects={subjects}
          onSelectSubject={(subject) => {
            const screenKey = `categorySelection-${subject.id}`;
            const alreadyLoaded = loadedScreens.has(screenKey);
            
            if (alreadyLoaded) {
              // Check if cached categories are empty
              const cachedCategories = categoriesCache[subject.id] || [];
              if (cachedCategories.length === 0) {
                setEmptyContentModal({ show: true, level: 'categories' });
                return;
              }
              
              // Instant navigation - categories already cached
              setSelectionState({ ...selectionState, subject });
              setScreen('contentTreeSelection');
            } else {
              // Dynamically load categories - Zeit hängt von Content ab
              setIsLoading(true);
              loadWithMinimumDelay(() => loadCategoriesForSubject(subject.id))
                .then((categories) => {
                  // Check if categories are empty
                  if (categories.length === 0) {
                    setIsLoading(false);
                    setEmptyContentModal({ show: true, level: 'categories' });
                    return;
                  }
                  
                  // Cache categories for this subject
                  setCategoriesCache(prev => ({ ...prev, [subject.id]: categories }));
                  setSelectionState({ ...selectionState, subject });
                  setScreen('contentTreeSelection');
                  setLoadedScreens(prev => new Set(prev).add(screenKey));
                  setIsLoading(false);
                })
                .catch((error) => {
                  console.error('Failed to load categories:', error);
                  setIsLoading(false);
                  // TODO: Show error to user
                });
            }
          }}
          onClose={() => {
            // Close button - return to parent app
            onClose?.();
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