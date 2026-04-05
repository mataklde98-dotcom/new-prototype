import React, { useState, useEffect, useSyncExternalStore } from 'react';
import TodoCard from './TodoCard';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '@/contexts/UserContext';
import { prepTodoStore, getSubjectColor, type PrepTodo } from './prepTodoStore';
import type { FlashcardSet } from '@/types/flashcard';

interface TodoCardsSectionProps {
  selectedDate?: { day: string; date: string; fullDate: Date; isManual?: boolean } | null;
  filters?: {
    nachhilfe: boolean;
    karteikarten: boolean;
    prufung: boolean;
  };
  /** Callbacks for prep-todo actions */
  onGenerateForWeakness?: (context: any) => void;
  onStartExamSimulation?: (context: any) => void;
  allSets?: FlashcardSet[];
  onOpenFlashcardSet?: (set: FlashcardSet) => void;
}

export default function TodoCardsSection({ selectedDate, filters, onGenerateForWeakness, onStartExamSimulation, allSets = [], onOpenFlashcardSet }: TodoCardsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { tutoringStatus, tutoringRequestData } = useUser();

  // Subscribe to prepTodoStore for reactive updates
  const storeTodos = useSyncExternalStore(prepTodoStore.subscribe, prepTodoStore.getSnapshot);

  // Real-time tick every 30s to auto-update session states
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  // Helper: get current time in Europe/Berlin timezone
  const getNowBerlin = () => {
    const now = new Date();
    const berlinStr = now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' });
    return new Date(berlinStr);
  };

  const nachhilfeActivated = tutoringStatus === 'activated';
  const nachhilfeType: 'online' | 'local' | null = nachhilfeActivated
    ? (tutoringRequestData?.tutoringType ?? 'online')
    : null;

  // Generate a dynamic tutoring session ~5 minutes from now (Berlin time) for today
  const dynamicSession = React.useMemo(() => {
    const berlinNow = getNowBerlin();
    const mins = berlinNow.getMinutes() + 5;
    const hours = berlinNow.getHours() + Math.floor(mins / 60);
    const adjustedMins = mins % 60;
    const timeStr = `${String(hours).padStart(2, '0')}:${String(adjustedMins).padStart(2, '0')} Uhr`;
    return {
      type: 'einzelunterricht' as const,
      title: 'Einzelunterricht',
      description: 'Nachhilfe',
      subject: 'Physik',
      subjectColor: '#EC4899',
      time: timeStr,
      duration: '30 Min',
      actionLabel: 'Beitreten',
      actionType: 'join' as const,
      accentGradient: 'linear-gradient(135deg, #EC4899, #DB2777)',
      locationType: 'online' as const,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Static tutoring sessions per day (these are separate from prep todos)
  const getTutoringSessionsForDay = (day: string) => {
    const sessionsByDay: Record<string, any[]> = {
      'Mo': [
        {
          type: 'einzelunterricht' as const, title: 'Einzelunterricht', description: 'Nachhilfe',
          subject: 'Mathematik', subjectColor: '#10B981', time: '14:00 Uhr', duration: '60 Min',
          actionLabel: 'Beitreten', actionType: 'join' as const,
          accentGradient: 'linear-gradient(135deg, #10B981, #059669)', locationType: 'local' as const,
        },
        {
          type: 'extra-stunden' as const, title: 'Extra-Stunden', description: 'Nachhilfe',
          subject: 'Chemie', subjectColor: '#F59E0B', time: '18:00 Uhr', duration: '45 Min',
          actionLabel: 'Demnächst', actionType: 'upcoming' as const,
          accentGradient: 'linear-gradient(135deg, #F59E0B, #D97706)', locationType: 'online' as const,
        },
      ],
      'Di': [
        {
          type: 'gruppenunterricht' as const, title: 'Gruppenunterricht', description: 'Nachhilfe',
          subject: 'Physik', subjectColor: '#EC4899', time: '16:30 Uhr', duration: '60 Min',
          actionLabel: 'Beitreten', actionType: 'join' as const,
          accentGradient: 'linear-gradient(135deg, #EC4899, #DB2777)', locationType: 'local' as const,
        },
      ],
      'Mi': [
        {
          type: 'einzelunterricht' as const, title: 'Einzelunterricht', description: 'Nachhilfe',
          subject: 'Englisch', subjectColor: '#A855F7', time: '14:00 Uhr', duration: '60 Min',
          actionLabel: 'Beitreten', actionType: 'join' as const,
          accentGradient: 'linear-gradient(135deg, #A855F7, #9333EA)', locationType: 'online' as const,
        },
        {
          type: 'extra-stunde' as const, title: 'Extra-Stunde', description: 'Nachhilfe',
          subject: 'Mathematik', subjectColor: '#10B981', time: '15:00 Uhr', duration: '45 Min',
          actionLabel: 'Beitreten', actionType: 'join' as const,
          accentGradient: 'linear-gradient(135deg, #10B981, #059669)', locationType: 'online' as const,
        },
        {
          type: 'einzelunterricht' as const, title: 'Einzelunterricht', description: 'Nachhilfe',
          subject: 'Deutsch', subjectColor: '#3B82F6', time: '19:30 Uhr', duration: '60 Min',
          actionLabel: 'Demnächst', actionType: 'upcoming' as const,
          accentGradient: 'linear-gradient(135deg, #3B82F6, #2563EB)', locationType: 'online' as const,
        },
        {
          type: 'gruppenunterricht' as const, title: 'Gruppenunterricht', description: 'Nachhilfe',
          subject: 'Chemie', subjectColor: '#F59E0B', time: '18:30 Uhr', duration: '60 Min',
          actionLabel: 'Beitreten', actionType: 'join' as const,
          accentGradient: 'linear-gradient(135deg, #F59E0B, #D97706)', locationType: 'online' as const,
        },
      ],
      'Do': [
        {
          type: 'gruppenunterricht' as const, title: 'Gruppenunterricht', description: 'Nachhilfe',
          subject: 'Chemie', subjectColor: '#F59E0B', time: '15:00 Uhr', duration: '60 Min',
          actionLabel: 'Beitreten', actionType: 'join' as const,
          accentGradient: 'linear-gradient(135deg, #F59E0B, #D97706)', locationType: 'local' as const,
        },
      ],
      'Fr': [
        {
          type: 'einzelunterricht' as const, title: 'Einzelunterricht', description: 'Nachhilfe',
          subject: 'Biologie', subjectColor: '#10B981', time: '13:00 Uhr', duration: '60 Min',
          actionLabel: 'Beitreten', actionType: 'join' as const,
          accentGradient: 'linear-gradient(135deg, #10B981, #059669)', locationType: 'online' as const,
        },
      ],
    };
    return sessionsByDay[day] || [];
  };

  // Get current day
  const getTodayDay = () => {
    const berlinNow = getNowBerlin();
    const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    return dayNames[berlinNow.getDay()];
  };

  const currentDay = selectedDate?.day || getTodayDay();

  // Convert prep todos from store into TodoCard-compatible format
  const prepTodosForDay = React.useMemo(() => {
    const openTodos = prepTodoStore.getOpenForDay(currentDay);
    return openTodos.map((todo: PrepTodo) => {
      const color = getSubjectColor(todo.parentSubject);
      const isFlashcards = todo.type === 'flashcards';
      const hasLinkedSet = !!todo.linkedSetId;
      const progress = todo.flashcardProgress;
      const setComplete = hasLinkedSet && progress >= 100;

      // Button text lifecycle (shorter for Home ToDo cards)
      let actionLabel = isFlashcards ? 'Karten erstellen' : 'Prüfung starten';
      if (isFlashcards) {
        if (hasLinkedSet && !setComplete) actionLabel = 'Üben';
        else if (setComplete) actionLabel = 'Neue Karten erstellen';
      }

      // Purpose line: what this task belongs to
      const fmtDateShort = (dateStr?: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.`;
      };
      const purposeLine = todo.parentType === 'exam'
        ? `Klausur am ${fmtDateShort(todo.parentDate)}`
        : `Lernziel: ${todo.parentTitle}`;

      return {
        type: (isFlashcards ? 'karteikarten' : 'prüfungssimulation') as const,
        title: isFlashcards ? 'Karteikarten' : 'Prüfungssimulation',
        description: purposeLine,
        subject: todo.parentSubject,
        subjectColor: color,
        duration: isFlashcards ? `${todo.cardCount || 15} Karten` : `${todo.examDurationMinutes || 20} Min`,
        actionLabel,
        actionType: 'start' as const,
        accentGradient: `linear-gradient(135deg, ${color}, ${color}cc)`,
        flashcardProgress: isFlashcards && hasLinkedSet && !setComplete ? progress : undefined,
        // Store the todo reference for action handling
        _prepTodo: todo,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDay, storeTodos]);

  // Tutoring sessions for this day
  const tutoringSessions = getTutoringSessionsForDay(currentDay);

  // Inject dynamic session into today's tutoring
  const allTutoringUnfiltered = React.useMemo(() => {
    const todayDay = getTodayDay();
    if (currentDay === todayDay) {
      return [...tutoringSessions, dynamicSession];
    }
    return tutoringSessions;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDay, tutoringSessions, dynamicSession]);

  // Session live/ended logic
  const isToday = currentDay === getTodayDay();
  const SESSION_TYPES = ['einzelunterricht', 'gruppenunterricht', 'extra-stunden', 'extra-stunde'];

  const isSessionLive = (todo: any): boolean => {
    if (!isToday) return false;
    if (!SESSION_TYPES.includes(todo.type)) return false;
    if (!todo.time) return false;
    const match = todo.time.match(/(\d{1,2}):(\d{2})/);
    if (!match) return false;
    const startMinutes = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
    let durationMin = 60;
    if (todo.duration) {
      const durMatch = todo.duration.match(/(\d+)\s*Min/);
      if (durMatch) durationMin = parseInt(durMatch[1], 10);
    }
    const endMinutes = startMinutes + durationMin;
    const berlinNow = getNowBerlin();
    const nowMinutes = berlinNow.getHours() * 60 + berlinNow.getMinutes();
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  };

  const isSessionEnded = (todo: any): boolean => {
    if (!isToday) return false;
    if (!SESSION_TYPES.includes(todo.type)) return false;
    if (!todo.time) return false;
    const match = todo.time.match(/(\d{1,2}):(\d{2})/);
    if (!match) return false;
    const startMinutes = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
    let durationMin = 60;
    if (todo.duration) {
      const durMatch = todo.duration.match(/(\d+)\s*Min/);
      if (durMatch) durationMin = parseInt(durMatch[1], 10);
    }
    const endMinutes = startMinutes + durationMin;
    const berlinNow = getNowBerlin();
    const nowMinutes = berlinNow.getHours() * 60 + berlinNow.getMinutes();
    return nowMinutes >= endMinutes;
  };

  // Combine tutoring + prep todos, apply filters
  const allTodos = React.useMemo(() => {
    // Filter tutoring sessions
    const filteredTutoring = allTutoringUnfiltered.filter(todo => {
      if (isSessionEnded(todo)) return false;
      if (!nachhilfeActivated && SESSION_TYPES.includes(todo.type)) return false;
      if (!filters) return true;
      const filterCategory = 'nachhilfe' as keyof typeof filters;
      return filters[filterCategory];
    });

    // Filter prep todos
    const filteredPrep = prepTodosForDay.filter(todo => {
      if (!filters) return true;
      if (todo.type === 'karteikarten') return filters.karteikarten;
      if (todo.type === 'prüfungssimulation') return filters.prufung;
      return true;
    });

    // Interleave: tutoring sessions first (time-sensitive), then prep todos
    return [...filteredTutoring, ...filteredPrep];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTutoringUnfiltered, prepTodosForDay, filters, nachhilfeActivated]);

  const hiddenCount = allTodos.length - 2;
  const isManualChange = selectedDate?.isManual ?? false;

  // Track previous day for slide direction
  const [previousDay, setPreviousDay] = useState(currentDay);
  const dayOrder = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const currentIndex = dayOrder.indexOf(currentDay);
  const previousIndex = dayOrder.indexOf(previousDay);
  const direction = currentIndex > previousIndex ? 1 : -1;

  React.useEffect(() => {
    if (currentDay !== previousDay) {
      setPreviousDay(currentDay);
      setIsExpanded(false);
    }
  }, [currentDay, previousDay]);

  // Handle prep todo action (Karteikarten/Prüfung)
  const handlePrepTodoAction = (todo: any) => {
    const prepTodo = todo._prepTodo as PrepTodo;
    if (!prepTodo) return;

    if (prepTodo.type === 'flashcards') {
      // If linked set exists and not complete, open it directly
      if (prepTodo.linkedSetId && prepTodo.flashcardProgress < 100 && onOpenFlashcardSet) {
        const linkedSet = allSets.find(s => s.id === prepTodo.linkedSetId);
        if (linkedSet) {
          onOpenFlashcardSet(linkedSet);
          return;
        }
      }
      // If set complete, reset for new
      if (prepTodo.linkedSetId && prepTodo.flashcardProgress >= 100) {
        prepTodoStore.resetForNewSet(prepTodo.id);
      }
      // Find original task index from the ID
      const parts = prepTodo.id.split('::');
      const taskIndex = parseInt(parts[1], 10);
      onGenerateForWeakness?.({
        topic: prepTodo.topic,
        subject: prepTodo.parentSubject,
        severity: 'moderate',
        recommendation: prepTodo.title,
        source: prepTodo.parentType === 'goal' ? 'learning-goal' : 'prep-todo',
        cardCount: prepTodo.cardCount,
        examTitle: prepTodo.parentTitle,
        examId: prepTodo.parentId,
        taskIndex,
        severityLabel: 'ToDo',
      });
    } else if (prepTodo.type === 'exam-simulation') {
      onStartExamSimulation?.({
        topic: prepTodo.topic,
        subject: prepTodo.parentSubject,
        severity: 'moderate',
        recommendation: `${prepTodo.examDurationMinutes || 20} Min`,
        source: prepTodo.parentType === 'goal' ? 'learning-goal' : 'prep-todo',
        examTitle: prepTodo.parentTitle,
        examDurationMinutes: prepTodo.examDurationMinutes,
        severityLabel: 'ToDo',
      });
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentDay}
          initial={isManualChange ? { 
            opacity: 0, 
            x: direction * 20,
          } : false}
          animate={{ 
            opacity: 1, 
            x: 0,
          }}
          exit={{ 
            opacity: 0, 
            x: direction * -20,
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0.0, 0.2, 1],
          }}
        >
          {allTodos.length > 0 ? (
            <>
              {/* Erste 2 ToDos - immer sichtbar */}
              <div className="space-y-2.5">
                {allTodos.slice(0, 2).map((todo, idx) => {
                  const isSession = SESSION_TYPES.includes(todo.type);
                  const effectiveLocationType = isSession && nachhilfeType ? nachhilfeType : todo.locationType;
                  const isPrepTodo = '_prepTodo' in todo;
                  return (
                    <TodoCard
                      key={isPrepTodo ? (todo as any)._prepTodo.id : `session-${idx}`}
                      {...todo}
                      locationType={effectiveLocationType}
                      isLive={todo.isLive || isSessionLive(todo)}
                      onAction={isPrepTodo ? () => handlePrepTodoAction(todo) : undefined}
                    />
                  );
                })}
              </div>

              {/* Restliche ToDos - expandable */}
              {allTodos.length > 2 && (
                <>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isExpanded ? 'auto' : 0,
                      opacity: isExpanded ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0.0, 0.2, 1],
                    }}
                    className="overflow-hidden"
                    style={{
                      willChange: 'height, opacity',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="space-y-2.5 mt-2.5">
                      {allTodos.slice(2).map((todo, idx) => {
                        const isSession = SESSION_TYPES.includes(todo.type);
                        const effectiveLocationType = isSession && nachhilfeType ? nachhilfeType : todo.locationType;
                        const isPrepTodo = '_prepTodo' in todo;
                        return (
                          <TodoCard
                            key={isPrepTodo ? (todo as any)._prepTodo.id : `session-extra-${idx}`}
                            {...todo}
                            locationType={effectiveLocationType}
                            isLive={todo.isLive || isSessionLive(todo)}
                            onAction={isPrepTodo ? () => handlePrepTodoAction(todo) : undefined}
                          />
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Show More / Show Less Button */}
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="relative w-full bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-[14px] h-[44px] flex items-center justify-center gap-2 border border-white/[0.08] active:scale-[0.98] transition-all duration-200 mt-3"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      isolation: 'isolate',
                    }}
                  >
                    <span className="relative z-10 font-['Poppins:Medium',sans-serif] text-[12px] text-white/70">
                      {isExpanded ? 'weniger anzeigen' : `mehr anzeigen (${hiddenCount})`}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
                      className="relative z-10"
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-white/70" />
                    </motion.div>
                  </button>
                </>
              )}
            </>
          ) : (
            // Keine Events für diesen Tag
            <div className="bg-gradient-to-r from-[#3a3b44]/40 to-[#2d3e38]/40 rounded-[14px] h-[120px] flex flex-col items-center justify-center border border-white/5">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white/50 mb-1">
                Keine Ereignisse
              </p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/30">
                Für diesen Tag hast du nichts geplant
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}