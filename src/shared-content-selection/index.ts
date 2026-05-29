// ✅ SHARED CONTENT SELECTION - Central exports for system-wide content selection
// This ensures Subject/Category/Topic/Subtopic selection is synchronized across all features
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  🎯 SHARED CONTENT SELECTION ARCHITECTURE                       │
// ├─────────────────────────────────────────────────────────────────┤
// │                                                                 │
// │  Screen 1-4: SYNCHRONIZED ACROSS ALL FEATURES                   │
// │  ════════════════════════════════════════════════════            │
// │  1️⃣  SubjectSelection   → Select Fach                          │
// │  2️⃣  CategorySelection  → Select Category                      │
// │  3️⃣  TopicSelection     → Select Thema                         │
// │  4️⃣  SubtopicSelection  → Select Unterthema                    │
// │                                                                 │
// │  Screen 5+: FEATURE-SPECIFIC                                    │
// │  ═══════════════════════                                        │
// │  📝 ExamApp              → ExamConfiguration                    │
// │  🃏 GenerateFlashcards   → FlashcardConfig                      │
// │  🔮 Future Features      → Custom Screens                       │
// │                                                                 │
// │  ✅ BENEFIT: One change = All features updated!                 │
// └─────────────────────────────────────────────────────────────────┘

// Components
export { default as SubjectSelection } from '@/examapp/app/components/SubjectSelection';
export { default as CategorySelection } from '@/examapp/app/components/CategorySelection';
export { default as TopicSelection } from '@/examapp/app/components/TopicSelection';
export { default as SubtopicSelection } from '@/examapp/app/components/SubtopicSelection';

// Loading & UI Components  
export { default as LoadingSpinner } from '@/examapp/app/components/LoadingSpinner';
export { default as Alert } from '@/examapp/app/components/Alert';
export { default as EmptyContentModal } from '@/examapp/app/components/EmptyContentModal';
export { default as ConfirmDialog } from '@/examapp/app/components/ConfirmDialog';
export { default as PremiumSlider } from './PremiumSlider';

// Data
export { subjects } from '@/examapp/app/data/subjects';
export { categories } from '@/examapp/app/data/categories';
export { topics } from '@/examapp/app/data/topics';
export { getSubtopicsForTopic } from '@/examapp/app/data/subtopics';

// Types
export type { Subject } from '@/examapp/app/data/subjects';
export type { Category } from '@/examapp/app/data/categories';
export type { Topic } from '@/examapp/app/data/topics';
export type { Subtopic } from '@/examapp/app/data/subtopics';

// Utils
export { 
  loadCategoriesForSubject, 
  loadTopicsForCategory, 
  loadSubtopicsForTopic,
  loadWithMinimumDelay,
  loadAllSubjects
} from '@/examapp/app/utils/loadingUtils';

// ==================== USAGE ====================
// Both ExamApp and GenerateFlashcardsApp should import from here:
//
// import {
//   SubjectSelection,
//   CategorySelection,
//   TopicSelection,
//   SubtopicSelection,
//   loadAllSubjects,
//   type Subject,
//   type Category
// } from '@/shared-content-selection';
//
// This way, any changes to these components/data/utils 
// automatically apply to ALL features using content selection.