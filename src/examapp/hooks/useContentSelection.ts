// ==================== CONTENT SELECTION HOOK ====================
// Manages subject/category/topic/subtopic loading, caching, and AI content cache invalidation
// Extracted from App.tsx Phase 5

import { useState, useEffect, useCallback } from 'react';
import {
  loadCategoriesForSubject,
  loadTopicsForCategory,
  loadSubtopicsForTopic,
  loadWithMinimumDelay,
  loadAllSubjects,
  type Subject,
  type Category,
  type Topic,
  type Subtopic,
} from '@/shared-content-selection';
import { setupTestHelper } from '../app/utils/testAIScenarios';
import type { TreeSelection } from '../app/components/screens/ContentTreeSelectionScreen';

// ==================== TYPES ====================
export type SelectionState = {
  subject?: { id: string; name: string };
  category?: { id: string; name: string };
  selectedTopic?: { id: string; name: string };
  subtopicsByTopic?: { [topicId: string]: Array<{ id: string; name: string }> };
  currentTopic?: { id: string; name: string };
  selectedSubtopics?: Array<{ id: string; name: string }>;
  treeSelection?: TreeSelection;
};

// ==================== RETURN TYPE ====================
export interface UseContentSelectionReturn {
  // Loading
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  // Subjects
  subjects: Subject[];

  // Selection state
  selectionState: SelectionState;
  setSelectionState: React.Dispatch<React.SetStateAction<SelectionState>>;

  // Caches
  categoriesCache: { [subjectId: string]: Category[] };
  setCategoriesCache: React.Dispatch<React.SetStateAction<{ [subjectId: string]: Category[] }>>;
  topicsCache: { [categoryId: string]: Topic[] };
  setTopicsCache: React.Dispatch<React.SetStateAction<{ [categoryId: string]: Topic[] }>>;
  subtopicsCache: { [topicId: string]: Subtopic[] };
  setSubtopicsCache: React.Dispatch<React.SetStateAction<{ [topicId: string]: Subtopic[] }>>;

  // Screen tracking
  loadedScreens: Set<string>;
  setLoadedScreens: React.Dispatch<React.SetStateAction<Set<string>>>;

  // Navigation helpers
  previousScreen: 'topicSelection' | 'subtopicSelection';
  setPreviousScreen: React.Dispatch<React.SetStateAction<'topicSelection' | 'subtopicSelection'>>;
  expectedDeletedCategoryId: string | null;
  setExpectedDeletedCategoryId: React.Dispatch<React.SetStateAction<string | null>>;
}

// ==================== HOOK ====================
export function useContentSelection(): UseContentSelectionReturn {
  // ==================== LOADING STATE ====================
  const [isLoading, setIsLoading] = useState(false);

  // ==================== SUBJECTS ====================
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // ==================== SELECTION STATE ====================
  const [selectionState, setSelectionState] = useState<SelectionState>({});

  // ==================== CACHES ====================
  const [categoriesCache, setCategoriesCache] = useState<{ [subjectId: string]: Category[] }>({});
  const [topicsCache, setTopicsCache] = useState<{ [categoryId: string]: Topic[] }>({});
  const [subtopicsCache, setSubtopicsCache] = useState<{ [topicId: string]: Subtopic[] }>({});

  // ==================== SCREEN TRACKING ====================
  const [loadedScreens, setLoadedScreens] = useState<Set<string>>(new Set());

  // ==================== NAVIGATION HELPERS ====================
  const [previousScreen, setPreviousScreen] = useState<'topicSelection' | 'subtopicSelection'>('topicSelection');
  const [expectedDeletedCategoryId, setExpectedDeletedCategoryId] = useState<string | null>(null);

  // ==================== INITIAL LOAD ====================
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      try {
        const loadedSubjects = await loadAllSubjects();
        setSubjects(loadedSubjects);
      } catch (error) {
        console.error('Failed to load subjects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
    setupTestHelper();
  }, []);

  // ==================== AI CONTENT CACHE INVALIDATION ====================
  useEffect(() => {
    const handleStorageChange = async () => {
      if (selectionState.subject) {
        try {
          const updatedCategories = await loadCategoriesForSubject(selectionState.subject.id);
          setCategoriesCache(prev => ({ ...prev, [selectionState.subject!.id]: updatedCategories }));
        } catch (error) {
          console.error('❌ Category cache update failed:', error);
        }
      }
      if (selectionState.category) {
        try {
          const updatedTopics = await loadTopicsForCategory(selectionState.category.id);
          setTopicsCache(prev => ({ ...prev, [selectionState.category!.id]: updatedTopics }));
        } catch (error) {
          console.error('❌ Topic cache update failed:', error);
        }
      }
      setSubtopicsCache(prev => {
        const allTopicIds = Object.keys(prev);
        (async () => {
          for (const topicId of allTopicIds) {
            try {
              const updated = await loadSubtopicsForTopic(topicId);
              setSubtopicsCache(current => ({ ...current, [topicId]: updated }));
            } catch (error) {
              console.error(`❌ Subtopic cache update failed for ${topicId}:`, error);
            }
          }
        })();
        return prev;
      });
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectionState]);

  return {
    isLoading,
    setIsLoading,
    subjects,
    selectionState,
    setSelectionState,
    categoriesCache,
    setCategoriesCache,
    topicsCache,
    setTopicsCache,
    subtopicsCache,
    setSubtopicsCache,
    loadedScreens,
    setLoadedScreens,
    previousScreen,
    setPreviousScreen,
    expectedDeletedCategoryId,
    setExpectedDeletedCategoryId,
  };
}