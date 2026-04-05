// ==================== TOPIC SELECTION SCREEN ====================
// Extrahiert aus App.tsx - Themenauswahl mit Subtopic-Navigation
// 1:1 Kopie des screen === 'topicSelection' Blocks

import {
  TopicSelection,
  EmptyContentModal,
  Alert,
  ConfirmDialog,
  getSubtopicsForTopic,
  loadSubtopicsForTopic,
  loadWithMinimumDelay,
  type Topic,
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

interface TopicSelectionScreenProps {
  isLoading: boolean;
  selectionState: SelectionState;
  topicsCache: { [categoryId: string]: Topic[] };
  subtopicsCache: { [topicId: string]: Subtopic[] };
  loadedScreens: Set<string>;
  emptyContentModal: { show: boolean; level: 'categories' | 'topics' | 'subtopics' };
  showAlert: boolean;
  alertTitle: string;
  alertMessage: string;
  showConfirmDialog: boolean;
  confirmDialogTitle: string;
  confirmDialogMessage: string;
  confirmDialogAction: (() => void) | null;
  expectedDeletedCategoryId: string | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectionState: React.Dispatch<React.SetStateAction<SelectionState>>;
  setSubtopicsCache: React.Dispatch<React.SetStateAction<{ [topicId: string]: Subtopic[] }>>;
  setLoadedScreens: React.Dispatch<React.SetStateAction<Set<string>>>;
  setEmptyContentModal: React.Dispatch<React.SetStateAction<{ show: boolean; level: 'categories' | 'topics' | 'subtopics' }>>;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConfirmDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setExpectedDeletedCategoryId: React.Dispatch<React.SetStateAction<string | null>>;
  setPreviousScreen: React.Dispatch<React.SetStateAction<'topicSelection' | 'subtopicSelection'>>;
  setScreen: (screen: string) => void;
  onClose?: () => void;
}

export default function TopicSelectionScreen({
  isLoading,
  selectionState,
  topicsCache,
  subtopicsCache,
  loadedScreens,
  emptyContentModal,
  showAlert,
  alertTitle,
  alertMessage,
  showConfirmDialog,
  confirmDialogTitle,
  confirmDialogMessage,
  confirmDialogAction,
  expectedDeletedCategoryId,
  setIsLoading,
  setSelectionState,
  setSubtopicsCache,
  setLoadedScreens,
  setEmptyContentModal,
  setShowAlert,
  setShowConfirmDialog,
  setExpectedDeletedCategoryId,
  setPreviousScreen,
  setScreen,
  onClose,
}: TopicSelectionScreenProps) {
  return (
    <>
      <MobileViewportLayout>
        <TopicSelection
          title="Prüfungssimulation"
          isLoading={isLoading}
          categoryName={selectionState.category?.name || ''}
          categoryId={selectionState.category?.id || ''}
          subjectId={selectionState.subject?.id || 'math'}
          subjectName={selectionState.subject?.name || 'Mathematik'}
          topics={topicsCache[selectionState.category?.id || ''] || []}
          selectedTopic={selectionState.selectedTopic}
          subtopicsByTopic={selectionState.subtopicsByTopic || {}}
          onRequestLoading={(loading) => setIsLoading(loading)}
          onClose={onClose}
          onSelectTopic={(topic) => {
            // User selected/deselected a topic via checkbox
            if (topic) {
              setSelectionState({ 
                ...selectionState, 
                selectedTopic: topic,
                subtopicsByTopic: { [topic.id]: [] } // Empty array means "all subtopics"
              });
            } else {
              // Deselect
              setSelectionState({ 
                ...selectionState, 
                selectedTopic: undefined,
                subtopicsByTopic: {}
              });
            }
          }}
          onContinue={() => {
            // User clicked "Weiter" button -> Navigate to exam config with all subtopics selected
            if (selectionState.selectedTopic) {
              // Check if this topic has subtopics
              const topicId = selectionState.selectedTopic.id;
              
              console.log('🔹 onContinue: TopicSelection → ExamConfiguration', {
                topicId,
                topicName: selectionState.selectedTopic.name,
              });
              
              // Load subtopics synchronously from cache (no loading screen)
              const subtopics = getSubtopicsForTopic(topicId);
              console.log('✅ Subtopics für Topic:', subtopics.length, subtopics);
              
              if (subtopics.length === 0) {
                // No subtopics available - show empty content modal
                setEmptyContentModal({ show: true, level: 'subtopics' });
                return;
              }
              
              // Cache subtopics and proceed to exam configuration
              setSubtopicsCache(prev => ({ ...prev, [topicId]: subtopics }));
              setSelectionState({
                ...selectionState,
                subtopicsByTopic: { [selectionState.selectedTopic!.id]: [] }
              });
              setPreviousScreen('topicSelection');
              setScreen('examConfiguration');
            }
          }}
          onNavigateToSubtopics={(topic) => {
            // Navigate to subtopics for this specific topic
            const screenKey = `subtopicSelection-${topic.id}`;
            const alreadyLoaded = loadedScreens.has(screenKey);
            
            // Determine if we keep existing subtopic selections
            // If navigating to the SAME topic that was previously selected, keep selections
            // If navigating to a DIFFERENT topic, clear ALL previous selections
            let newSubtopicsByTopic = { ...(selectionState.subtopicsByTopic || {}) };
            
            // Check which topic we're coming from (could be selectedTopic or currentTopic)
            const lastTopicId = selectionState.selectedTopic?.id || selectionState.currentTopic?.id;
            
            // If navigating to a different topic, clear ALL subtopic selections
            if (lastTopicId && lastTopicId !== topic.id) {
              // Different topic selected - clear ALL subtopic selections
              console.log('🧹 Clearing all subtopics - navigating from', lastTopicId, 'to', topic.id);
              newSubtopicsByTopic = {};
            } else if (lastTopicId === topic.id) {
              console.log('✅ Keeping subtopics - same topic', topic.id);
            }
            
            if (alreadyLoaded) {
              // Check if there are subtopics
              const subtopicsForTopic = subtopicsCache[topic.id] || [];
              if (subtopicsForTopic.length === 0) {
                // No subtopics available - show modal
                console.log('🚨 (Cached) Keine Subtopics gefunden für Topic:', topic.id);
                setEmptyContentModal({ show: true, level: 'subtopics' });
                return;
              }
              // Instant navigation - subtopics already cached
              setSelectionState({ ...selectionState, currentTopic: topic, subtopicsByTopic: newSubtopicsByTopic });
              setScreen('subtopicSelection');
            } else {
              // Dynamically load subtopics - Zeit hängt von Content ab
              setIsLoading(true);
              loadWithMinimumDelay(() => loadSubtopicsForTopic(topic.id))
                .then((subtopics) => {
                  // Check if there are subtopics
                  if (subtopics.length === 0) {
                    // No subtopics available - show modal
                    console.log('🚨 Keine Subtopics gefunden für Topic:', topic.id);
                    setIsLoading(false);
                    setEmptyContentModal({ show: true, level: 'subtopics' });
                    return;
                  }
                  // Cache subtopics for this topic
                  setSubtopicsCache(prev => ({ ...prev, [topic.id]: subtopics }));
                  setSelectionState({ ...selectionState, currentTopic: topic, subtopicsByTopic: newSubtopicsByTopic });
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
            setIsLoading(false); // ✅ Reset loading state
            setScreen('categorySelection');
          }}
          onNavigateToLevel={(level, deletedCategoryId) => {
            if (level === 'subject') {
              setIsLoading(false); // ✅ Reset loading state
              setExpectedDeletedCategoryId(null); // ✅ Reset signal
              setScreen('subjectSelection');
            } else if (level === 'category') {
              // ✅ CASCADE-DELETE: Signalisiere welche Kategorie gelöscht werden soll
              if (deletedCategoryId) {
                console.log('🎯 App.tsx: CASCADE-Delete erkannt, setze expectedDeletedCategoryId:', deletedCategoryId);
                setExpectedDeletedCategoryId(deletedCategoryId);
                // NICHT setIsLoading(false) - CategorySelection macht das!
              } else {
                setIsLoading(false); // ✅ Reset loading state bei normalem Navigate
                setExpectedDeletedCategoryId(null);
              }
              setScreen('categorySelection');
            }
          }}
          onRequestAIContent={() => {
            // Open AI content generation modal for Topics
            setEmptyContentModal({ show: true, level: 'topics' });
          }}
        />
      </MobileViewportLayout>
      
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
      
      {/* Empty Content Modal */}
      <EmptyContentModal
        isOpen={emptyContentModal.show}
        onClose={() => setEmptyContentModal({ show: false, level: 'categories' })}
        level={emptyContentModal.level}
      />
    </>
  );
}