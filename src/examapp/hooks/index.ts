// ==================== EXAM SIMULATION HOOKS ====================
// Central export for all exam simulation hooks

export { useGenerateExam, type UseGenerateExamReturn } from './useGenerateExam';
export { useEvaluateExam, type UseEvaluateExamReturn } from './useEvaluateExam';

// ==================== PHASE 2-4: Custom Hooks (extrahiert aus App.tsx) ====================
export { useExamTimer } from './useExamTimer';
export { useExamAnswers, type AnswerEntry } from './useExamAnswers';
export { useExamSession } from './useExamSession';
export { useProgressBar, type ProgressBar, type ProgressResult } from './useProgressBar';
export { useExamNavigation } from './useExamNavigation';

// ==================== PHASE 5: Coordination Hooks ====================
export { useContentSelection, type SelectionState, type UseContentSelectionReturn } from './useContentSelection';
export { useExamState, type UseExamStateReturn } from './useExamState';
export { useSaveToHistory } from './useSaveToHistory';
