// ==================== EXAM CONFIGURATION SCREEN ====================
// Extrahiert aus App.tsx - Prüfungskonfiguration (Dauer, Modus)
// Unterstützt sowohl altes SelectionState als auch neues TreeSelection

import ExamConfiguration from '../ExamConfiguration';
import MobileViewportLayout from './MobileViewportLayout';
import { getSubtopicsForTopic } from '@/shared-content-selection';
import type { TreeSelection } from './ContentTreeSelectionScreen';

type SelectionState = {
  subject?: { id: string; name: string };
  category?: { id: string; name: string };
  selectedTopic?: { id: string; name: string };
  subtopicsByTopic?: { [topicId: string]: Array<{ id: string; name: string }> };
  currentTopic?: { id: string; name: string };
  selectedSubtopics?: Array<{ id: string; name: string }>;
  treeSelection?: TreeSelection;
};

interface ExamConfigurationScreenProps {
  selectionState: SelectionState;
  setSelectionState: React.Dispatch<React.SetStateAction<SelectionState>>;
  subtopicsCache: { [topicId: string]: Array<{ id: string; name: string }> };
  previousScreen: 'topicSelection' | 'subtopicSelection';
  userId: string;
  userRegistration: any;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  setExamDuration: React.Dispatch<React.SetStateAction<number>>;
  setShowResultsAtEnd: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCreatingExam: React.Dispatch<React.SetStateAction<boolean>>;
  setScreen: (screen: string) => void;
  generateExamAPI: (params: any) => void;
  lockedMode?: boolean;
  contextLabel?: string;
  weaknessSeverity?: string;
  source?: string;
  examTitle?: string;
  lockedDuration?: number;
  assignedDate?: string;
  severityLabel?: string;
  notificationLabel?: string;
  onClose?: () => void;
}

// Helper: Build a summary label from tree selection for display
function getTreeSelectionSummary(treeSelection: TreeSelection): string {
  const parts: string[] = [];
  for (const catSel of Object.values(treeSelection)) {
    if (catSel.allSelected) {
      parts.push(catSel.category.name);
    } else {
      for (const topicSel of Object.values(catSel.topics)) {
        if (topicSel.allSelected) {
          parts.push(topicSel.topic.name);
        } else {
          parts.push(`${topicSel.subtopicIds.length} Unterthemen`);
        }
      }
    }
  }
  if (parts.length <= 2) return parts.join(', ');
  return `${parts[0]}, ${parts[1]} +${parts.length - 2} weitere`;
}

// Helper: Build a topic string from tree selection for API
function getTreeSelectionTopicForAPI(treeSelection: TreeSelection): string | undefined {
  const topicNames: string[] = [];
  for (const catSel of Object.values(treeSelection)) {
    if (catSel.allSelected) {
      // Whole category - use category name as topic
      topicNames.push(catSel.category.name);
    } else {
      for (const topicSel of Object.values(catSel.topics)) {
        topicNames.push(topicSel.topic.name);
      }
    }
  }
  return topicNames.length > 0 ? topicNames.join(', ') : undefined;
}

// Helper: Build competency areas from tree selection for API
function getTreeSelectionCategoriesForAPI(treeSelection: TreeSelection): string | undefined {
  const categoryNames = Object.values(treeSelection).map(cs => cs.category.name);
  return categoryNames.length > 0 ? categoryNames.join(', ') : undefined;
}

// Helper: Extract pseudo-subtopics from tree selection for display in ExamConfiguration
function getTreeSelectionAsSubtopics(treeSelection: TreeSelection): Array<{ id: string; name: string }> {
  const result: Array<{ id: string; name: string }> = [];
  for (const catSel of Object.values(treeSelection)) {
    if (catSel.allSelected) {
      result.push({ id: catSel.category.id, name: `${catSel.category.name} (komplett)` });
    } else {
      for (const topicSel of Object.values(catSel.topics)) {
        if (topicSel.allSelected) {
          result.push({ id: topicSel.topic.id, name: topicSel.topic.name });
        } else {
          for (const subId of topicSel.subtopicIds) {
            result.push({ id: subId, name: subId }); // Will be resolved later
          }
        }
      }
    }
  }
  return result;
}

export default function ExamConfigurationScreen({
  selectionState,
  setSelectionState,
  subtopicsCache,
  previousScreen,
  userId,
  userRegistration,
  setTimer,
  setExamDuration,
  setShowResultsAtEnd,
  setIsCreatingExam,
  setScreen,
  generateExamAPI,
  lockedMode = false,
  contextLabel,
  weaknessSeverity,
  source,
  examTitle,
  lockedDuration,
  assignedDate,
  severityLabel,
  notificationLabel,
  onClose,
}: ExamConfigurationScreenProps) {
  const hasTreeSelection = selectionState.treeSelection && Object.keys(selectionState.treeSelection).length > 0;

  // Get all selected subtopics - handle both old and new selection model
  const allSelectedSubtopics = hasTreeSelection
    ? getTreeSelectionAsSubtopics(selectionState.treeSelection!)
    : selectionState.selectedTopic && selectionState.subtopicsByTopic
      ? (() => {
          const subtopicsArray = Object.values(selectionState.subtopicsByTopic).flat();
          if (subtopicsArray.length === 0 && selectionState.selectedTopic) {
            return getSubtopicsForTopic(selectionState.selectedTopic.id);
          }
          return subtopicsArray;
        })()
      : [];

  return (
    <MobileViewportLayout>
      <ExamConfiguration
        subjectId={selectionState.subject?.id || 'math'}
        selectedSubtopics={allSelectedSubtopics}
        lockedMode={lockedMode}
        contentLabel={hasTreeSelection ? 'Inhalte' : undefined}
        weaknessTopic={lockedMode ? selectionState.selectedTopic?.name : undefined}
        weaknessSubject={lockedMode ? selectionState.subject?.name : undefined}
        weaknessSeverity={weaknessSeverity}
        contextLabel={contextLabel}
        source={source}
        examTitle={examTitle}
        lockedDuration={lockedDuration}
        assignedDate={assignedDate}
        severityLabel={severityLabel}
        notificationLabel={notificationLabel}
        onStartExam={(duration, showResultsAtEndOption) => {
          setTimer(duration * 60);
          setExamDuration(duration);
          setShowResultsAtEnd(showResultsAtEndOption);
          setIsCreatingExam(true);
          setScreen('start');
          
          // Build API params based on selection model
          if (hasTreeSelection) {
            generateExamAPI({
              userId,
              state: userRegistration?.state || 'Bayern',
              schoolType: userRegistration?.schoolType || 'Gymnasium',
              grade: userRegistration?.grade || '10',
              subject: selectionState.subject?.name || '',
              topic: getTreeSelectionTopicForAPI(selectionState.treeSelection!),
              competencyArea: getTreeSelectionCategoriesForAPI(selectionState.treeSelection!),
              examDuration: duration,
            });
          } else {
            generateExamAPI({
              userId,
              state: userRegistration?.state || 'Bayern',
              schoolType: userRegistration?.schoolType || 'Gymnasium',
              grade: userRegistration?.grade || '10',
              subject: selectionState.subject?.name || '',
              topic: selectionState.selectedTopic?.name,
              competencyArea: selectionState.category?.name,
              examDuration: duration,
            });
          }
        }}
        onBack={() => {
          if (lockedMode) {
            onClose?.();
            return;
          }
          // Go back to tree selection or previous screen
          if (hasTreeSelection) {
            setScreen('contentTreeSelection');
          } else if (previousScreen === 'subtopicSelection' && selectionState.selectedTopic) {
            setSelectionState({ 
              ...selectionState, 
              currentTopic: selectionState.selectedTopic 
            });
            setScreen(previousScreen);
          } else {
            setScreen(previousScreen);
          }
        }}
        onEditSubtopics={() => {
          if (lockedMode) return;
          if (hasTreeSelection) {
            setScreen('contentTreeSelection');
          } else if (selectionState.selectedTopic) {
            setSelectionState({ ...selectionState, currentTopic: selectionState.selectedTopic });
            setScreen('subtopicSelection');
          }
        }}
      />
    </MobileViewportLayout>
  );
}