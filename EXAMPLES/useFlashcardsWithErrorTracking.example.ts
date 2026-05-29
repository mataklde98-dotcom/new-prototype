/**
 * Example: Flashcards Hook with Error Tracking
 * 
 * This is an example of how to integrate error tracking into an existing hook.
 * DO NOT USE THIS FILE - it's just an example!
 */

import { useState } from 'react';
import { flashcardService } from '@/services';
import { useErrorTracking } from '@/hooks/useErrorTracking';
import type { FlashcardSet } from '@/types';
import { toast } from 'sonner';

export function useFlashcardsWithErrorTracking(initialSets?: FlashcardSet[]) {
  const [allSets, setAllSets] = useState<FlashcardSet[]>(initialSets || []);
  const [isLoading, setIsLoading] = useState(false);
  
  // ✅ Add error tracking
  const { logError, logWarning, logInfo, trackAsync } = useErrorTracking('useFlashcards');

  /**
   * Lädt alle Flashcard-Sets with error tracking
   */
  const loadAllSets = async () => {
    setIsLoading(true);
    
    // ✅ Use trackAsync for automatic error handling
    const sets = await trackAsync(
      async () => {
        logInfo('Loading flashcard sets', { action: 'loadAllSets' });
        return await flashcardService.getAllSets();
      },
      {
        action: 'loadAllSets',
        onError: (error) => {
          toast.error('Failed to load flashcards', {
            description: error.message,
          });
        },
      }
    );

    if (sets) {
      setAllSets(sets);
      logInfo(`Loaded ${sets.length} flashcard sets`, {
        action: 'loadAllSets',
        count: sets.length,
      });
    }
    
    setIsLoading(false);
  };

  /**
   * Aktualisiert ein Flashcard-Set with error tracking
   */
  const updateSet = async (id: number, data: Partial<FlashcardSet>) => {
    // Store original state for rollback
    const originalSet = allSets.find((set) => set.id === id);
    
    // Optimistisches Update
    setAllSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, ...data } : set))
    );

    // ✅ Track the update operation
    const result = await trackAsync(
      async () => {
        return await flashcardService.updateSet(id, data);
      },
      {
        action: 'updateSet',
        onError: (error) => {
          // ✅ Rollback on error
          if (originalSet) {
            setAllSets((prev) =>
              prev.map((set) => (set.id === id ? originalSet : set))
            );
          }
          
          toast.error('Failed to update flashcard', {
            description: error.message,
          });
        },
      }
    );

    if (result) {
      logInfo('Flashcard set updated', {
        action: 'updateSet',
        setId: id,
        updatedFields: Object.keys(data),
      });
    }
  };

  /**
   * Löscht ein einzelnes Flashcard-Set with error tracking
   */
  const deleteSet = async (id: number) => {
    // Store original state for rollback
    const originalSets = [...allSets];
    
    // Optimistisches Update
    setAllSets((prev) => prev.filter((set) => set.id !== id));

    // ✅ Track the delete operation
    const result = await trackAsync(
      async () => {
        return await flashcardService.deleteSet(id);
      },
      {
        action: 'deleteSet',
        onError: (error) => {
          // ✅ Rollback on error
          setAllSets(originalSets);
          
          toast.error('Failed to delete flashcard', {
            description: error.message,
          });
        },
      }
    );

    if (result) {
      logInfo('Flashcard set deleted', {
        action: 'deleteSet',
        setId: id,
      });
      toast.success('Flashcard deleted');
    }
  };

  /**
   * Löscht mehrere Flashcard-Sets with error tracking
   */
  const deleteSets = async (ids: number[]) => {
    // Store original state for rollback
    const originalSets = [...allSets];
    
    // Optimistisches Update
    setAllSets((prev) => prev.filter((set) => !ids.includes(set.id)));

    // ✅ Track the bulk delete operation
    const result = await trackAsync(
      async () => {
        return await flashcardService.deleteSets(ids);
      },
      {
        action: 'deleteSets',
        onError: (error) => {
          // ✅ Rollback on error
          setAllSets(originalSets);
          
          toast.error('Failed to delete flashcards', {
            description: error.message,
          });
        },
      }
    );

    if (result) {
      logInfo('Multiple flashcard sets deleted', {
        action: 'deleteSets',
        count: ids.length,
        setIds: ids,
      });
      toast.success(`${ids.length} flashcards deleted`);
    }
  };

  /**
   * Löscht alle Flashcard-Sets with warning
   */
  const deleteAllSets = async () => {
    // ✅ Log warning for critical operation
    logWarning('Deleting all flashcard sets', {
      action: 'deleteAllSets',
      count: allSets.length,
    });

    // Store original state for rollback
    const originalSets = [...allSets];
    
    // Optimistisches Update
    setAllSets([]);

    // ✅ Track the critical delete operation
    const result = await trackAsync(
      async () => {
        return await flashcardService.deleteAllSets();
      },
      {
        action: 'deleteAllSets',
        onError: (error) => {
          // ✅ Rollback on error
          setAllSets(originalSets);
          
          toast.error('Failed to delete all flashcards', {
            description: error.message,
          });
        },
      }
    );

    if (result) {
      logInfo('All flashcard sets deleted', {
        action: 'deleteAllSets',
        count: originalSets.length,
      });
      toast.success('All flashcards deleted');
    }
  };

  /**
   * Fügt ein neues Flashcard-Set hinzu
   */
  const addSet = (newSet: FlashcardSet) => {
    setAllSets((prev) => [newSet, ...prev]);
    
    // ✅ Log info for successful operation
    logInfo('New flashcard set added', {
      action: 'addSet',
      setId: newSet.id,
      title: newSet.title,
      cardCount: newSet.cards.length,
    });
  };

  /**
   * Aktualisiert lastOpened Timestamp
   */
  const updateLastOpened = async (id: number) => {
    const now = new Date();
    
    // Optimistisches Update
    setAllSets((prev) =>
      prev.map((set) =>
        set.id === id ? { ...set, lastOpened: now } : set
      )
    );

    // ✅ Track with minimal logging (no error toast needed)
    await trackAsync(
      async () => {
        return await flashcardService.updateLastOpened(id);
      },
      {
        action: 'updateLastOpened',
        // Don't show error to user - non-critical operation
        onError: (error) => {
          logWarning('Failed to update lastOpened timestamp', {
            action: 'updateLastOpened',
            setId: id,
            error: error.message,
          });
        },
      }
    );
  };

  /**
   * Manual error logging example
   */
  const performComplexOperation = async (data: unknown) => {
    try {
      // Validate data
      if (!data) {
        // ✅ Log warning for validation issues
        logWarning('Invalid data provided', {
          action: 'performComplexOperation',
          data,
        });
        toast.warning('Invalid data');
        return;
      }

      // Perform operation
      const result = await flashcardService.someComplexOperation(data);
      
      // ✅ Log success
      logInfo('Complex operation completed', {
        action: 'performComplexOperation',
        result,
      });
      
      return result;
    } catch (error) {
      // ✅ Manual error logging with full context
      logError(
        'Complex operation failed',
        error as Error,
        {
          action: 'performComplexOperation',
          data,
          timestamp: Date.now(),
        }
      );
      
      toast.error('Operation failed');
      throw error;
    }
  };

  return {
    allSets,
    setAllSets,
    isLoading,
    loadAllSets,
    updateSet,
    deleteSet,
    deleteSets,
    deleteAllSets,
    addSet,
    updateLastOpened,
    performComplexOperation,
  };
}

/**
 * KEY TAKEAWAYS:
 * 
 * 1. Use trackAsync() for async operations with automatic error handling
 * 2. Use logInfo() for successful operations
 * 3. Use logWarning() for validation issues or non-critical errors
 * 4. Use logError() for critical errors that need attention
 * 5. Always provide context (action, relevant IDs, data)
 * 6. Use toast notifications for user feedback
 * 7. Implement rollback logic for optimistic updates
 * 8. Don't show toast for non-critical operations (like updateLastOpened)
 */
