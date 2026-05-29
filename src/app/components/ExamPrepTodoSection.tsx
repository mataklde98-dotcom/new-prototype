// ExamPrepTodoSection – renders the "Deine ToDo's" section in exam/goal detail view
// Reads from shared prepTodoStore (single source of truth)

import React, { useSyncExternalStore } from 'react';
import {
  Layers, ClipboardCheck, Sparkles, CheckCircle, ChevronRight, Play, ChevronDown,
} from 'lucide-react';
import type { FlashcardSet } from '@/types/flashcard';
import { prepTodoStore, type PrepTodo } from './prepTodoStore';

interface ExamPrepTodoSectionProps {
  /** The exam or goal ID to filter todos by */
  parentId: string;
  examSubject: string;
  examTitle?: string;
  SectionTitle: React.ComponentType<{ icon: React.ReactNode; title: string }>;
  onGenerateForWeakness?: (context: { topic: string; subject: string; severity: string; recommendation: string; source?: string; cardCount?: number; examTitle?: string; examId?: string; taskIndex?: number; severityLabel?: string }) => void;
  onStartExamSimulation?: (context: { topic: string; subject: string; severity: string; recommendation: string; source?: string; cardCount?: number; examTitle?: string; examDurationMinutes?: number; severityLabel?: string }) => void;
  allSets?: FlashcardSet[];
  onOpenFlashcardSet?: (set: FlashcardSet) => void;
  isGoalContext?: boolean;
  /** @deprecated Use parentId instead. Kept for backward compat. */
  prepTasks?: any[];
  /** @deprecated Use parentId instead. */
  examId?: string;
}

export default function ExamPrepTodoSection({
  parentId,
  examSubject,
  examTitle,
  SectionTitle,
  onGenerateForWeakness,
  onStartExamSimulation,
  allSets = [],
  onOpenFlashcardSet,
  isGoalContext = false,
  // Legacy props (ignored, we read from store)
  examId: legacyExamId,
}: ExamPrepTodoSectionProps) {
  const [showAll, setShowAll] = React.useState(false);

  // Subscribe to store for reactive updates
  const storeTodos = useSyncExternalStore(prepTodoStore.subscribe, prepTodoStore.getSnapshot);

  // Get todos for this parent from store
  const effectiveParentId = parentId || legacyExamId || '';
  const allTodos = React.useMemo(() => {
    return prepTodoStore.getByParent(effectiveParentId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveParentId, storeTodos]);

  const openTasks = allTodos.filter(t => !t.completed);
  const allDone = openTasks.length === 0;
  const INITIAL_LIMIT = 2;
  const visibleTasks = showAll ? openTasks : openTasks.slice(0, INITIAL_LIMIT);
  const hiddenCount = openTasks.length - INITIAL_LIMIT;

  const today = new Date('2026-03-17');
  const getDaysOpen = (assignedDate: string) => {
    const diff = Math.abs(Math.floor((today.getTime() - new Date(assignedDate).getTime()) / (1000 * 60 * 60 * 24)));
    if (diff === 0) return 'Heute zugewiesen';
    if (diff === 1) return 'Seit gestern offen';
    return `Seit ${diff} Tagen offen`;
  };

  const getTaskConfig = (todo: PrepTodo) => {
    if (todo.type === 'flashcards') {
      let actionLabel = 'Karteikarten erstellen';
      let actionIcon = <Layers className="w-3 h-3" />;
      const hasLinkedSet = !!todo.linkedSetId;
      const progress = todo.flashcardProgress;
      const setComplete = hasLinkedSet && progress >= 100;

      if (hasLinkedSet && !setComplete) {
        actionLabel = 'Karteikarten fortsetzen';
        actionIcon = <Play className="w-3 h-3" />;
      } else if (setComplete) {
        actionLabel = 'Neue Karteikarten erstellen';
        actionIcon = <Layers className="w-3 h-3" />;
      }
      return { icon: <Layers className="w-3.5 h-3.5" />, actionLabel, actionIcon };
    }
    if (todo.type === 'exam-simulation') return {
      icon: <ClipboardCheck className="w-3.5 h-3.5" />,
      actionLabel: 'Pr\u00fcfung starten',
      actionIcon: <Play className="w-3 h-3" />,
    };
    return {
      icon: <Sparkles className="w-3.5 h-3.5" />,
      actionLabel: '\u00d6ffnen',
      actionIcon: <ChevronRight className="w-3 h-3" />,
    };
  };

  const getTypeLabel = (todo: PrepTodo) => {
    if (todo.type === 'flashcards') return `${todo.cardCount || 15} Karteikarten`;
    if (todo.type === 'exam-simulation') return `${todo.examDurationMinutes || 20} Min Prüfung`;
    return 'Aufgabe';
  };

  const handleTaskAction = (todo: PrepTodo) => {
    if (todo.type === 'flashcards') {
      const hasLinkedSet = !!todo.linkedSetId;
      const setComplete = hasLinkedSet && todo.flashcardProgress >= 100;

      // If linked set exists and not complete, open it directly
      if (hasLinkedSet && !setComplete && onOpenFlashcardSet) {
        const linkedSet = allSets.find(s => s.id === todo.linkedSetId);
        if (linkedSet) {
          onOpenFlashcardSet(linkedSet);
          return;
        }
      }
      // If set complete, reset for new
      if (setComplete) {
        prepTodoStore.resetForNewSet(todo.id);
      }
      // Extract task index from ID
      const parts = todo.id.split('::');
      const taskIndex = parseInt(parts[1], 10);

      onGenerateForWeakness?.({
        topic: todo.topic,
        subject: examSubject,
        severity: 'moderate',
        recommendation: todo.title,
        source: isGoalContext ? 'learning-goal' : 'prep-todo',
        cardCount: todo.cardCount,
        examTitle: examTitle,
        examId: effectiveParentId,
        taskIndex: taskIndex >= 0 ? taskIndex : undefined,
        severityLabel: 'ToDo',
      });
    } else if (todo.type === 'exam-simulation') {
      onStartExamSimulation?.({
        topic: todo.topic,
        subject: examSubject,
        severity: 'moderate',
        recommendation: `${todo.examDurationMinutes || 20} Min`,
        source: isGoalContext ? 'learning-goal' : 'prep-todo',
        examTitle: examTitle,
        examDurationMinutes: todo.examDurationMinutes,
        severityLabel: 'ToDo',
      });
    }
  };

  return (
    <div className="mb-4">
      <SectionTitle icon={<ClipboardCheck className="w-4 h-4" />} title="Deine ToDo's" />
      {allDone ? (
        <div
          className="p-3 rounded-xl"
          style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.12)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: '#00D4AA' }}><CheckCircle className="w-3.5 h-3.5" /></span>
            <span className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white/80">Alles erledigt</span>
            <span
              className="ml-auto px-1.5 py-0.5 rounded-full font-['Poppins:Medium',sans-serif] text-[9px]"
              style={{ color: '#00D4AA', background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.25)' }}
            >
              Fertig
            </span>
          </div>
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 leading-relaxed">
            Keine offenen ToDo's – weiter so!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleTasks.map((todo) => {
            const config = getTaskConfig(todo);
            return (
              <div
                key={todo.id}
                className="p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{config.icon}</span>
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white/80">{todo.topic}</span>
                  <span
                    className="ml-auto px-1.5 py-0.5 rounded-full font-['Poppins:Medium',sans-serif] text-[9px] flex-shrink-0"
                    style={{ color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                  >
                    Offen
                  </span>
                </div>
                {/* Flashcard progress bar */}
                {todo.type === 'flashcards' && !!todo.linkedSetId && todo.flashcardProgress < 100 && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex-1 h-[4px] rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${todo.flashcardProgress}%`,
                          background: 'linear-gradient(90deg, #00D4AA, #00B894)',
                        }}
                      />
                    </div>
                    <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/40">
                      {todo.flashcardProgress}%
                    </span>
                  </div>
                )}
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 leading-relaxed mb-2.5">
                  {getTypeLabel(todo)} · {getDaysOpen(todo.assignedDate)}
                </p>
                <button
                  className="w-full flex items-center justify-center gap-1.5 py-[6px] rounded-lg transition-all duration-150 active:scale-[0.97] font-['Poppins:Medium',sans-serif] text-[10px]"
                  style={{
                    background: 'rgba(0,184,148,0.07)',
                    border: '1px solid rgba(0,184,148,0.25)',
                    color: 'rgba(255,255,255,0.9)',
                  }}
                  onClick={() => handleTaskAction(todo)}
                >
                  {config.actionIcon}
                  {config.actionLabel}
                  <ChevronRight className="w-3 h-3 ml-0.5 opacity-50" />
                </button>
              </div>
            );
          })}
          {hiddenCount > 0 && (
            <button
              onClick={() => setShowAll(prev => !prev)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all duration-200 active:scale-[0.97] font-['Poppins:Medium',sans-serif] text-[11px]"
              style={{
                color: 'rgba(255,255,255,0.45)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <ChevronDown
                className="w-3.5 h-3.5 transition-transform duration-200"
                style={{ transform: showAll ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
              {showAll ? 'Weniger anzeigen' : `${hiddenCount} weitere anzeigen`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
