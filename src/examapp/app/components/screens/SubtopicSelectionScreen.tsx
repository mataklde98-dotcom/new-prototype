// ==================== SUBTOPIC SELECTION SCREEN ====================
// Extrahiert aus App.tsx - Unterthemenauswahl
// 1:1 Kopie des screen === 'subtopicSelection' Blocks

import {
  SubtopicSelection,
  EmptyContentModal,
  type Subtopic,
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

interface SubtopicSelectionScreenProps {
  isLoading: boolean;
  selectionState: SelectionState;
  subtopicsCache: { [topicId: string]: Subtopic[] };
  emptyContentModal: { show: boolean; level: 'categories' | 'topics' | 'subtopics' };
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectionState: React.Dispatch<React.SetStateAction<SelectionState>>;
  setEmptyContentModal: React.Dispatch<React.SetStateAction<{ show: boolean; level: 'categories' | 'topics' | 'subtopics' }>>;
  setPreviousScreen: React.Dispatch<React.SetStateAction<'topicSelection' | 'subtopicSelection'>>;
  setScreen: (screen: string) => void;
  onClose?: () => void;
}

export default function SubtopicSelectionScreen({
  isLoading,
  selectionState,
  subtopicsCache,
  emptyContentModal,
  setIsLoading,
  setSelectionState,
  setEmptyContentModal,
  setPreviousScreen,
  setScreen,
  onClose,
}: SubtopicSelectionScreenProps) {
  return (
    <>
      <MobileViewportLayout>
        <SubtopicSelection
          title="Prüfungssimulation"
          isLoading={isLoading}
          topicName={selectionState.currentTopic?.name || ''}
          topicId={selectionState.currentTopic?.id || ''}
          categoryId={selectionState.category?.id || ''}
          subjectId={selectionState.subject?.id || 'math'}
          subtopics={subtopicsCache[selectionState.currentTopic?.id || ''] || []}
          onRequestLoading={(loading) => setIsLoading(loading)}
          onClose={onClose}
          onContinue={(subtopics) => {
            // Save subtopics for this topic and set selectedTopic
            if (!selectionState.currentTopic) return; // Safety check
            
            const newSubtopicsByTopic = { ...selectionState.subtopicsByTopic };
            
            // Check if ALL subtopics are selected
            const totalSubtopics = subtopicsCache[selectionState.currentTopic.id]?.length || 0;
            if (subtopics.length === totalSubtopics && totalSubtopics > 0) {
              // All subtopics selected → store empty array to indicate "all selected"
              newSubtopicsByTopic[selectionState.currentTopic.id] = [];
            } else {
              // Partial selection → store the actual array
              newSubtopicsByTopic[selectionState.currentTopic.id] = subtopics;
            }
            
            setSelectionState({ 
              ...selectionState, 
              selectedTopic: selectionState.currentTopic,
              subtopicsByTopic: newSubtopicsByTopic,
              currentTopic: undefined 
            });
            setPreviousScreen('subtopicSelection'); // Remember we came from subtopics
            setScreen('examConfiguration'); // Changed from 'topicSelection' to go directly to exam config
          }}
          onBack={(subtopics) => {
            // Save subtopics when going back via "X" button
            if (!selectionState.currentTopic) {
              setScreen('topicSelection');
              return;
            }
            
            const newSubtopicsByTopic = { ...selectionState.subtopicsByTopic };
            
            if (subtopics.length > 0) {
              // Check if ALL subtopics are selected
              const totalSubtopics = subtopicsCache[selectionState.currentTopic.id]?.length || 0;
              if (subtopics.length === totalSubtopics && totalSubtopics > 0) {
                // All subtopics selected → store empty array to indicate "all selected"
                newSubtopicsByTopic[selectionState.currentTopic.id] = [];
              } else {
                // Partial selection → store the actual array
                newSubtopicsByTopic[selectionState.currentTopic.id] = subtopics;
              }
              // Set selectedTopic if subtopics were selected
              setSelectionState({ 
                ...selectionState, 
                selectedTopic: selectionState.currentTopic,
                subtopicsByTopic: newSubtopicsByTopic,
                currentTopic: undefined 
              });
            } else {
              // Remove from subtopicsByTopic if nothing selected
              delete newSubtopicsByTopic[selectionState.currentTopic.id];
              // If this was the selected topic and now has no subtopics, deselect it
              const shouldDeselectTopic = selectionState.selectedTopic?.id === selectionState.currentTopic?.id;
              setSelectionState({ 
                ...selectionState, 
                selectedTopic: shouldDeselectTopic ? undefined : selectionState.selectedTopic,
                subtopicsByTopic: newSubtopicsByTopic,
                currentTopic: undefined 
              });
            }
            setIsLoading(false); // ✅ Reset loading state
            setScreen('topicSelection');
          }}
          onNavigateToLevel={(level, subtopics) => {
            // Save subtopics when navigating via dropdown
            if (!selectionState.currentTopic) {
              // If no currentTopic, just navigate
              if (level === 'subject') {
                setIsLoading(false); // ✅ Reset loading state
                setScreen('subjectSelection');
              } else if (level === 'category') {
                setIsLoading(false); // ✅ Reset loading state
                setScreen('categorySelection');
              } else if (level === 'topic') {
                setIsLoading(false); // ✅ Reset loading state
                setScreen('topicSelection');
              }
              return;
            }
            
            const newSubtopicsByTopic = { ...selectionState.subtopicsByTopic };
            if (subtopics.length > 0) {
              // Check if ALL subtopics are selected
              const totalSubtopics = subtopicsCache[selectionState.currentTopic.id]?.length || 0;
              if (subtopics.length === totalSubtopics && totalSubtopics > 0) {
                // All subtopics selected → store empty array to indicate "all selected"
                newSubtopicsByTopic[selectionState.currentTopic.id] = [];
              } else {
                // Partial selection → store the actual array
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
              setIsLoading(false); // ✅ Reset loading state
              setScreen('subjectSelection');
            } else if (level === 'category') {
              setIsLoading(false); // ✅ Reset loading state
              setScreen('categorySelection');
            } else if (level === 'topic') {
              setIsLoading(false); // ✅ Reset loading state
              setScreen('topicSelection');
            }
          }}
          initialSelection={(() => {
            const topicId = selectionState.currentTopic?.id || '';
            const subtopicsForTopic = selectionState.subtopicsByTopic?.[topicId];
            
            // If subtopicsForTopic is an empty array, it means "all subtopics selected"
            // So we need to return all subtopics from cache
            if (Array.isArray(subtopicsForTopic) && subtopicsForTopic.length === 0) {
              return subtopicsCache[topicId] || [];
            }
            
            // Otherwise return the actual selected subtopics
            return subtopicsForTopic || [];
          })()}
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