import React from 'react';
import { useFlashcardSets, useCreateFlashcardSet, useUpdateProgress } from '@/hooks';

// ===== DEMO COMPONENT =====
// Zeigt wie die neue Architektur funktioniert

export function FlashcardsDemo() {
  const { data: allSets, isLoading, error, refetch } = useFlashcardSets();
  const { mutate: createSet, isPending: isCreating } = useCreateFlashcardSet();
  const { mutate: updateProgress } = useUpdateProgress();

  if (isLoading) {
    return (
      <div className="p-4 bg-[#0a0a0a] rounded-lg">
        <p className="text-white/60">Karteikarten werden geladen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-[#0a0a0a] rounded-lg">
        <p className="text-red-400">Fehler: {error.message}</p>
        <button 
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-white/[0.04] text-white rounded-lg hover:bg-white/[0.08]"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  const handleCreateSet = () => {
    createSet({
      subject: "Test",
      kategorie: "Demo",
      thema: "React Query",
      unterthema: "Hooks",
      title: "Test Set - " + new Date().toLocaleTimeString(),
      cardCount: 10,
      progress: 0,
      type: 'new'
    });
  };

  const handleUpdateProgress = (id: number, currentProgress: number) => {
    const newProgress = Math.min(currentProgress + 10, 100);
    updateProgress({ id, progress: newProgress });
  };

  return (
    <div className="p-4 bg-[#0a0a0a] rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg font-['Poppins:SemiBold',sans-serif]">
          Flashcards Demo (React Query)
        </h2>
        <button
          onClick={handleCreateSet}
          disabled={isCreating}
          className="px-4 py-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isCreating ? 'Creating...' : 'Create Test Set'}
        </button>
      </div>

      <div className="text-white/60 text-sm">
        Total Sets: {allSets?.length || 0}
      </div>

      <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
        {allSets?.slice(0, 10).map(set => (
          <div 
            key={set.id}
            className="p-3 bg-[#0a0a0a] rounded-lg border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-['Poppins:Medium',sans-serif] truncate">
                  {set.title}
                </div>
                <div className="text-white/40 text-xs mt-1">
                  {set.subject} • {set.cardCount} cards
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="text-white/60 text-xs">
                  {set.progress}%
                </div>
                <button
                  onClick={() => handleUpdateProgress(set.id, set.progress)}
                  className="px-2 py-1 bg-[#2a2b33] text-white/80 text-xs rounded hover:bg-[#3a3b43]"
                >
                  +10%
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}