import React, { useState, useMemo, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, GraduationCap, Calendar, Clock, CheckCircle2, BookOpen, ClipboardList, Star } from 'lucide-react';

// Flag icon SVG for Lernziele (from Figma import)
const FLAG_PATH = "M4.75 3.70898V5.03906C5.25977 5.1543 5.71289 5.34375 6.1875 5.47461V4.14258C5.67969 4.0293 5.22266 3.83984 4.75 3.70898ZM9.11133 1.30664C8.44141 1.61719 7.61719 1.92969 6.82617 1.92969C5.78125 1.92969 4.91602 1.25 3.59961 1.25C3.11133 1.25 2.67578 1.33594 2.27148 1.48438C2.32617 1.3418 2.35156 1.1875 2.3418 1.02344C2.30664 0.46875 1.85156 0.0234375 1.29492 0C0.669922 -0.0253906 0.15625 0.474609 0.15625 1.09375C0.15625 1.46484 0.341797 1.79297 0.625 1.99023V9.53125C0.625 9.79102 0.833984 10 1.09375 10H1.40625C1.66602 10 1.875 9.79102 1.875 9.53125V7.6875C2.42773 7.45117 3.11719 7.25586 4.10937 7.25586C5.15625 7.25586 6.01953 7.93555 7.33594 7.93555C8.27734 7.93555 9.0293 7.61719 9.72852 7.13672C9.89844 7.01953 9.99805 6.82813 9.99805 6.62109V1.87305C10 1.41797 9.52539 1.11523 9.11133 1.30664ZM3.3125 6.35742C2.80859 6.41016 2.33594 6.51758 1.875 6.68164V5.30469C2.38672 5.12305 2.80273 5.01172 3.3125 4.96484V6.35742ZM9.0625 3.73047C8.60156 3.92187 8.1582 4.11133 7.625 4.19727V5.58594C8.10937 5.51953 8.62891 5.35547 9.0625 5.07813V6.45508C8.57227 6.76953 8.11523 6.9375 7.625 6.98438V5.58594C7.09766 5.6582 6.68945 5.61523 6.1875 5.47656V6.79297C5.7207 6.64844 5.26367 6.4668 4.75 6.37695V5.03906C4.36523 4.95313 3.95313 4.90625 3.3125 4.96484V3.59766C2.875 3.6582 2.44141 3.79687 1.875 4.00586V2.62891C2.52344 2.39062 2.85352 2.24219 3.3125 2.19922V3.59766C3.83984 3.52539 4.25781 3.57227 4.75 3.70898V2.39258C5.21289 2.53711 5.67187 2.71875 6.1875 2.80859V4.14453C6.65039 4.24805 7.11719 4.2793 7.625 4.19727V2.79297C8.15234 2.69922 8.64648 2.52734 9.0625 2.35352V3.73047Z";

function FlagIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d={FLAG_PATH} />
    </svg>
  );
}
import Button from '@/app/components/Button';
import AddTaskScreen from '@/app/components/AddTaskScreen';
import TaskDetailScreen from '@/app/components/TaskDetailScreen';
import { examGradesStore } from './examGradesStore';
import DesktopPageHeader from '@/app/components/DesktopPageHeader';
import type { NewTaskData } from '@/app/components/AddTaskScreen';
import './SlideTransition.css';
import SwipeToDelete from '@/app/components/SwipeToDelete';
import TodoTutorial, { shouldShowTodoTutorial } from '@/app/components/TodoTutorial';

// ===== TYPES =====
type TaskType = 'klassenarbeit' | 'lernziel';

interface TodoTask {
  id: string;
  type: TaskType;
  subject: string;
  categoryAndTopic: string;
  dueDate: string;
  completed: boolean;
  goalDescription?: string;
  topicIds?: string[];
  grade?: string;
  createdAt?: string; // DD.MM.YYYY – when the task was created
}

// ===== INITIAL MOCK DATA =====
const INITIAL_TASKS: TodoTask[] = [
  { id: '1', type: 'klassenarbeit', subject: 'Mathematik', categoryAndTopic: '5 Themen aus 3 Kategorien', dueDate: '31.12.2024', completed: false, topicIds: ['math-cat1-topic1', 'math-cat1-topic2', 'math-cat3-topic1', 'math-cat4-topic1', 'math-cat4-topic3'] },
  { id: '2', type: 'lernziel', subject: 'Deutsch', categoryAndTopic: 'Dramatische Lektüren', dueDate: '10.01.2025', completed: false, createdAt: '15.11.2024' },
  { id: '3', type: 'lernziel', subject: 'Französisch', categoryAndTopic: 'Grammatik', dueDate: '15.01.2025', completed: false, createdAt: '20.11.2024' },
  { id: '4', type: 'klassenarbeit', subject: 'Geschichte', categoryAndTopic: '8 Themen aus 4 Kategorien', dueDate: '20.01.2025', completed: false, topicIds: ['history-cat1-topic1', 'history-cat1-topic2', 'history-cat2-topic1', 'history-cat2-topic3', 'history-cat3-topic1', 'history-cat3-topic2', 'history-cat4-topic1', 'history-cat4-topic3'] },
  { id: '5', type: 'lernziel', subject: 'Biologie', categoryAndTopic: 'Stoff- & Energiewechsel', dueDate: '04.02.2025', completed: false, createdAt: '01.12.2024' },
  { id: '6', type: 'klassenarbeit', subject: 'Informatik', categoryAndTopic: '2 Themen aus 1 Kategorie', dueDate: '17.02.2025', completed: false, topicIds: ['info-cat1-topic1', 'info-cat1-topic2'] },
  { id: '7', type: 'klassenarbeit', subject: 'Politik & GK', categoryAndTopic: '3 Themen aus 4 Kategorien', dueDate: '02.03.2025', completed: false, topicIds: ['pol-cat1-topic1', 'pol-cat2-topic1', 'pol-cat3-topic1'] },
  { id: '8', type: 'lernziel', subject: 'Mathematik', categoryAndTopic: 'Analysis & Differentialrechnung', dueDate: '12.12.2024', completed: true, createdAt: '25.10.2024' },
  { id: '9', type: 'klassenarbeit', subject: 'Physik', categoryAndTopic: 'Mechanik & Thermodynamik', dueDate: '05.12.2024', completed: true, grade: '2+', topicIds: ['phys-cat1-topic1', 'phys-cat1-topic2', 'phys-cat2-topic1'] },
  { id: '10', type: 'lernziel', subject: 'Englisch', categoryAndTopic: 'Shakespeare Dramen', dueDate: '28.11.2024', completed: true, createdAt: '10.10.2024' },
];

const ALL_SUBJECTS = ['Mathematik', 'Deutsch', 'Französisch', 'Geschichte', 'Biologie', 'Informatik', 'Politik & GK', 'Physik', 'Englisch'];

// Module-level persistent store (survives component remounts on mobile/desktop switch)
let persistedTasks: TodoTask[] | null = null;

type FilterType = 'alle' | 'lernziel' | 'klassenarbeit' | 'erledigte_lernziele' | 'erledigte_klassenarbeiten';

// ===== CSS KEYFRAMES =====
const cssKeyframes = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scrollHintPulse {
  0% { opacity: 0.25; }
  50% { opacity: 0.5; }
  100% { opacity: 0.25; }
}
div::-webkit-scrollbar { display: none; }
`;

// ===== GROUPED STATS STRIP =====
// Two rows: Klassenarbeiten + Lernziele, each with open/done counts inline
interface StatsStripProps {
  examOpen: number;
  examDone: number;
  goalOpen: number;
  goalDone: number;
  isMobile: boolean;
}

function StatsStrip({ examOpen, examDone, goalOpen, goalDone, isMobile }: StatsStripProps) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
      {/* Row 1: Klassenarbeiten */}
      <div className={`flex items-center justify-between ${isMobile ? 'px-4 py-3' : 'px-5 py-3.5'} border-b border-white/[0.04]`}>
        <div className="flex items-center gap-2.5">
          <ClipboardList className="w-4 h-4 text-white/20 flex-shrink-0" />
          <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50">
            Klassenarbeiten
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-['Poppins:Bold',sans-serif] text-[15px] text-white/80 tracking-[-0.3px]">
              {examOpen}
            </span>
            <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/25">
              anstehend
            </span>
          </div>
          <div className="w-px h-3 bg-white/[0.08]" />
          <div className="flex items-center gap-1.5">
            <span className="font-['Poppins:Bold',sans-serif] text-[15px] text-white/80 tracking-[-0.3px]">
              {examDone}
            </span>
            <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/25">
              erledigt
            </span>
          </div>
        </div>
      </div>
      {/* Row 2: Lernziele */}
      <div className={`flex items-center justify-between ${isMobile ? 'px-4 py-3' : 'px-5 py-3.5'}`}>
        <div className="flex items-center gap-2.5">
          <FlagIcon className="w-4 h-4 text-white/20 flex-shrink-0" />
          <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50">
            Lernziele
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-['Poppins:Bold',sans-serif] text-[15px] text-white/80 tracking-[-0.3px]">
              {goalOpen}
            </span>
            <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/25">
              offen
            </span>
          </div>
          <div className="w-px h-3 bg-white/[0.08]" />
          <div className="flex items-center gap-1.5">
            <span className="font-['Poppins:Bold',sans-serif] text-[15px] text-white/80 tracking-[-0.3px]">
              {goalDone}
            </span>
            <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/25">
              erreicht
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== TYPE BADGE =====
function TypeBadge({ type, grade, isMobile, completed }: { type: TaskType; grade?: string; isMobile?: boolean; completed?: boolean }) {
  const isExam = type === 'klassenarbeit';
  
  const gradeColors: Record<string, string> = {
    '1': '#4ADE80', '2': '#60C878', '3': '#E8B960',
    '4': '#F59E42', '5': '#FF7850', '6': '#FF453A',
  };

  const typeBadge = (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-['Poppins:Medium',sans-serif] text-[10px] whitespace-nowrap bg-white/[0.05] text-white/40">
      {isExam ? <ClipboardList className="w-3 h-3 flex-shrink-0 relative -top-px" /> : <FlagIcon className="w-3 h-3 flex-shrink-0" />}
      {isExam ? 'Klassenarbeit' : 'Lernziel'}
    </span>
  );
  
  if (grade) {
    const baseGrade = grade.replace(/[+-]/, '');
    const color = gradeColors[baseGrade] || '#E8B960';
    const gradeBadge = (
      <span 
        className="inline-flex items-center px-1.5 py-0.5 rounded-md font-['Poppins:Bold',sans-serif] text-[10px] whitespace-nowrap"
        style={{ backgroundColor: `${color}18`, color }}
      >
        {grade}
      </span>
    );
    return (
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isMobile ? <>{gradeBadge}{typeBadge}</> : <>{typeBadge}{gradeBadge}</>}
      </div>
    );
  }

  // Completed Klassenarbeit without grade → show hint
  if (isExam && completed && !grade) {
    const hintBadge = (
      <span 
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-['Poppins:Medium',sans-serif] text-[10px] whitespace-nowrap"
        style={{ backgroundColor: 'rgba(212, 160, 68, 0.10)', border: '1px dashed rgba(212, 160, 68, 0.25)' }}
      >
        <Star className="w-2.5 h-2.5 text-[#D4A044]/60" />
        <span className="text-[#D4A044]/60">Note?</span>
      </span>
    );
    return (
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isMobile ? <>{hintBadge}{typeBadge}</> : <>{typeBadge}{hintBadge}</>}
      </div>
    );
  }
  
  return typeBadge;
}

// ===== FILTER CHIP =====
function FilterChip({ label, active, onClick, count, isMobile }: { label: string; active: boolean; onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; count?: number; isMobile?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-[7px] rounded-full font-['Poppins:Medium',sans-serif] text-[12px] transition-all duration-200 whitespace-nowrap active:scale-[0.97] flex-shrink-0 ${
        active
          ? 'bg-white/[0.10] text-white border border-white/[0.15]'
          : `text-white/40 border border-transparent ${isMobile ? '' : 'hover:text-white/60 hover:bg-white/[0.03]'}`
      }`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {label}
      {count !== undefined && (
        <span className={`text-[10px] px-1.5 py-px rounded-full ${
          active ? 'bg-white/[0.12] text-white/80' : 'bg-white/[0.05] text-white/30'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

// ===== SUBJECT DROPDOWN =====
function SubjectDropdown({ selectedSubject, onSelect, subjects, isMobile }: { selectedSubject: string | null; onSelect: (s: string | null) => void; subjects: string[]; isMobile?: boolean }) {
  const [open, setOpen] = useState(false);
  
  const isActive = selectedSubject !== null;
  const displayLabel = selectedSubject || 'Alle Fächer';
  
  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 transition-all duration-200"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <span 
          className={`font-['Poppins:Medium',sans-serif] text-[12px] whitespace-nowrap ${isActive ? 'text-white/50' : 'text-white/30'}`}
        >
          {displayLabel}
        </span>
        <svg 
          className="transition-transform duration-200 flex-shrink-0" 
          width="10" 
          height="10" 
          viewBox="0 0 12 12" 
          fill="none"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path 
            d="M3 4.5L6 7.5L9 4.5" 
            stroke={isActive ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)'} 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 right-0 bg-[#141414] border border-white/[0.12] rounded-xl py-1.5 min-w-[180px] max-h-[60vh] overflow-y-auto z-50 scrollbar-hide" style={{ animation: 'fadeSlideUp 0.15s ease-out' }}>
            <button
              onClick={() => { onSelect(null); setOpen(false); }}
              className={`w-full px-4 py-2.5 text-left font-['Poppins:Regular',sans-serif] text-[13px] transition-colors ${
                !selectedSubject ? 'text-white bg-white/[0.06]' : `text-white/60 ${isMobile ? 'active:bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`
              }`}
            >
              Alle Fächer
            </button>
            {subjects.map(s => (
              <button
                key={s}
                onClick={() => { onSelect(s); setOpen(false); }}
                className={`w-full px-4 py-2.5 text-left font-['Poppins:Regular',sans-serif] text-[13px] transition-colors ${
                  selectedSubject === s ? 'text-white bg-white/[0.06]' : `text-white/60 ${isMobile ? 'active:bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ===== MOBILE TASK CARD =====
function MobileTaskCard({ task, onClick }: { task: TodoTask; onClick?: () => void }) {
  const isExam = task.type === 'klassenarbeit';
  const accentColor = task.completed ? '#4ADE80' : (isExam ? '#D4A044' : '#56C2D9');
  
  return (
    <div
      onClick={onClick}
      className={`relative rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden transition-all duration-200 active:scale-[0.985] cursor-pointer`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Left Accent Bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="pl-4 pr-3.5 py-3.5">
        {/* Top Row: Subject + Badge */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white truncate min-w-0">
            {task.subject}
          </p>
          <TypeBadge type={task.type} />
        </div>
        
        {/* Bottom Row: Topic + Date */}
        <div className="flex items-center justify-between gap-3">
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 truncate min-w-0">
            {task.categoryAndTopic}
          </p>
          <div className="flex items-center gap-1.5 text-white/25 flex-shrink-0">
            <Calendar className="w-3 h-3" />
            <span className="font-['Poppins:Regular',sans-serif] text-[11px]">
              {task.dueDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN COMPONENT =====
interface TodoManagementScreenProps {
  onClose: () => void;
  onRequestUpload?: (taskId: string, subject: string, grade: string) => void;
  isMobile?: boolean;
  isClosing?: boolean;
}

export default function TodoManagementScreen({ onClose, onRequestUpload, isMobile = false, isClosing = false }: TodoManagementScreenProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('alle');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TodoTask[]>(persistedTasks || INITIAL_TASKS);
  const [showAddTask, setShowAddTask] = useState(false);

  // 🚀 Tutorial state
  const [showTutorial, setShowTutorial] = useState(() => shouldShowTodoTutorial());

  // 🚀 Sync tasks to module-level store for persistence across remounts
  React.useEffect(() => {
    persistedTasks = tasks;
  }, [tasks]);

  // 🚀 Auto-complete Klassenarbeiten whose dueDate has passed
  React.useEffect(() => {
    setTasks(prev => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let changed = false;
      const updated = prev.map(task => {
        if (task.type === 'klassenarbeit' && !task.completed) {
          // Parse DD.MM.YYYY format
          const parts = task.dueDate.split('.');
          if (parts.length === 3) {
            const dueDate = new Date(
              parseInt(parts[2], 10),
              parseInt(parts[1], 10) - 1,
              parseInt(parts[0], 10)
            );
            dueDate.setHours(0, 0, 0, 0);
            // If today is past the due date (i.e. the day after or later)
            if (today > dueDate) {
              changed = true;
              return { ...task, completed: true };
            }
          }
        }
        return task;
      });
      return changed ? updated : prev;
    });
  }, []);

  // 🚀 Task Detail State
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // 🚀 Pure CSS Animation State (like AccountEditScreenMobile / ScreenManager)
  const [animationState, setAnimationState] = useState<'entering' | 'active' | 'exiting'>('entering');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('active');
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (isClosing) {
      setAnimationState('exiting');
    }
  }, [isClosing]);

  const slideAnimationClass = 
    animationState === 'entering' ? 'slide-screen-entering' :
    animationState === 'exiting' ? 'slide-screen-exiting' :
    'slide-screen-active';

  // 🚀 Two-state mount/unmount pattern
  const [isAddTaskMounted, setIsAddTaskMounted] = useState(false);
  
  React.useEffect(() => {
    if (showAddTask) {
      setIsAddTaskMounted(true);
    } else {
      if (isAddTaskMounted) {
        if (isMobile) {
          // Mobile: 300ms delay for slide-out animation
          const timer = setTimeout(() => {
            setIsAddTaskMounted(false);
          }, 300);
          return () => clearTimeout(timer);
        } else {
          // Desktop: instant unmount (no slide animation needed)
          setIsAddTaskMounted(false);
        }
      }
    }
  }, [showAddTask, isAddTaskMounted, isMobile]);

  // 🚀 Two-state mount/unmount pattern for TaskDetail
  const [isDetailMounted, setIsDetailMounted] = useState(false);
  
  React.useEffect(() => {
    if (showTaskDetail) {
      setIsDetailMounted(true);
    } else {
      if (isDetailMounted) {
        if (isMobile) {
          // Mobile: 300ms delay for slide-out animation
          const timer = setTimeout(() => {
            setIsDetailMounted(false);
          }, 300);
          return () => clearTimeout(timer);
        } else {
          // Desktop: instant unmount
          setIsDetailMounted(false);
        }
      }
    }
  }, [showTaskDetail, isDetailMounted, isMobile]);

  const selectedTask = useMemo(
    () => selectedTaskId ? tasks.find(t => t.id === selectedTaskId) || null : null,
    [selectedTaskId, tasks]
  );

  const handleOpenDetail = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
    setShowTaskDetail(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowTaskDetail(false);
  }, []);

  const handleMarkAchieved = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
  }, []);

  const handleUpdateDate = useCallback((taskId: string, newDate: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, dueDate: newDate } : t));
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setShowTaskDetail(false);
  }, []);

  const handleUpdateGrade = useCallback((taskId: string, grade: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, grade } : t));
    // Sync to shared grade store for cross-screen sync
    examGradesStore.setGrade(`todo-${taskId}`, grade);
  }, []);

  const filterScrollRef = useRef<HTMLDivElement>(null);

  // Scroll-hint: track whether filter bar can still scroll right
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollEnd = useCallback(() => {
    const el = filterScrollRef.current;
    if (!el) return;
    const remaining = el.scrollWidth - el.scrollLeft - el.clientWidth;
    setCanScrollRight(remaining > 4);
  }, []);

  React.useEffect(() => {
    const el = filterScrollRef.current;
    if (!el) return;
    // initial check after mount
    const raf = requestAnimationFrame(() => checkScrollEnd());
    el.addEventListener('scroll', checkScrollEnd, { passive: true });
    window.addEventListener('resize', checkScrollEnd);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', checkScrollEnd);
      window.removeEventListener('resize', checkScrollEnd);
    };
  }, [checkScrollEnd]);

  const handleFilterClick = useCallback((filter: FilterType, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveFilter(filter);
    const button = e.currentTarget;
    requestAnimationFrame(() => {
      button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  }, []);

  const allSubjects = useMemo(() => {
    const subjectSet = new Set(tasks.map(t => t.subject));
    ALL_SUBJECTS.forEach(s => subjectSet.add(s));
    return Array.from(subjectSet).sort();
  }, [tasks]);

  const handleAddTask = (taskData: NewTaskData) => {
    const newTask: TodoTask = {
      id: `task-${Date.now()}`,
      type: taskData.type,
      subject: taskData.subject,
      categoryAndTopic: taskData.categoryAndTopic,
      dueDate: taskData.dueDate,
      completed: false,
      goalDescription: taskData.goalDescription,
      topicIds: taskData.topicIds,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const stats = useMemo(() => {
    const upcomingExams = tasks.filter(t => t.type === 'klassenarbeit' && !t.completed).length;
    const completedExams = tasks.filter(t => t.type === 'klassenarbeit' && t.completed).length;
    const openGoals = tasks.filter(t => t.type === 'lernziel' && !t.completed).length;
    const achievedGoals = tasks.filter(t => t.type === 'lernziel' && t.completed).length;
    return { upcomingExams, completedExams, openGoals, achievedGoals };
  }, [tasks]);

  const filterCounts = useMemo(() => ({
    alle: tasks.filter(t => !t.completed).length,
    lernziel: tasks.filter(t => t.type === 'lernziel' && !t.completed).length,
    klassenarbeit: tasks.filter(t => t.type === 'klassenarbeit' && !t.completed).length,
    erledigte_lernziele: tasks.filter(t => t.type === 'lernziel' && t.completed).length,
    erledigte_klassenarbeiten: tasks.filter(t => t.type === 'klassenarbeit' && t.completed).length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    switch (activeFilter) {
      case 'alle': result = result.filter(t => !t.completed); break;
      case 'lernziel': result = result.filter(t => t.type === 'lernziel' && !t.completed); break;
      case 'klassenarbeit': result = result.filter(t => t.type === 'klassenarbeit' && !t.completed); break;
      case 'erledigte_lernziele': result = result.filter(t => t.type === 'lernziel' && t.completed); break;
      case 'erledigte_klassenarbeiten': result = result.filter(t => t.type === 'klassenarbeit' && t.completed); break;
    }
    if (selectedSubject) result = result.filter(t => t.subject === selectedSubject);
    return result;
  }, [activeFilter, selectedSubject, tasks]);

  // ===== SHARED FILTER BAR =====
  const filterBarJSX = (
    <div
      ref={filterScrollRef}
      className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
      style={{ ...(isMobile ? { scrollPaddingLeft: '16px' } : {}) }}
    >
      {isMobile && <div className="min-w-[8px] flex-shrink-0" aria-hidden="true" />}
      <FilterChip label="Alle" active={activeFilter === 'alle'} onClick={(e) => handleFilterClick('alle', e)} count={filterCounts.alle} isMobile={isMobile} />
      <div className="w-px h-4 bg-white/[0.06] flex-shrink-0" />
      <FilterChip label="Lernziele" active={activeFilter === 'lernziel'} onClick={(e) => handleFilterClick('lernziel', e)} count={filterCounts.lernziel} isMobile={isMobile} />
      <FilterChip label="Klassenarbeiten" active={activeFilter === 'klassenarbeit'} onClick={(e) => handleFilterClick('klassenarbeit', e)} count={filterCounts.klassenarbeit} isMobile={isMobile} />
      <div className="w-px h-4 bg-white/[0.06] flex-shrink-0" />
      <FilterChip label="Erreichte Lernziele" active={activeFilter === 'erledigte_lernziele'} onClick={(e) => handleFilterClick('erledigte_lernziele', e)} count={filterCounts.erledigte_lernziele} isMobile={isMobile} />
      <FilterChip label="Erledigte Klassenarbeiten" active={activeFilter === 'erledigte_klassenarbeiten'} onClick={(e) => handleFilterClick('erledigte_klassenarbeiten', e)} count={filterCounts.erledigte_klassenarbeiten} isMobile={isMobile} />
      {isMobile && <div className="min-w-[8px] flex-shrink-0" aria-hidden="true" />}
    </div>
  );

  // ===== SHARED SECTION HEADER =====
  const sectionHeaderJSX = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/30">
          Aufgaben
        </p>
        <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/20">
          · {filteredTasks.length}
        </span>
      </div>
      <SubjectDropdown selectedSubject={selectedSubject} onSelect={setSelectedSubject} subjects={allSubjects} isMobile={isMobile} />
    </div>
  );

  // ===== SHARED EMPTY STATE =====
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16" style={{ animation: 'fadeSlideUp 0.3s ease-out' }}>
      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
        <ClipboardList className="w-6 h-6 text-white/15" />
      </div>
      <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/30 mb-1">
        Keine Aufgaben gefunden
      </p>
      <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/15">
        Passe deine Filter an oder füge neue Aufgaben hinzu
      </p>
    </div>
  );

  // ===== AddTaskScreen Overlay =====
  const addTaskOverlay = isAddTaskMounted && (
    <AddTaskScreen
      onClose={() => setShowAddTask(false)}
      onAddTask={handleAddTask}
      isMobile={isMobile}
      isClosing={!showAddTask}
    />
  );

  // ===== TaskDetailScreen Overlay =====
  const taskDetailOverlay = isDetailMounted && selectedTask && (
    <TaskDetailScreen
      task={selectedTask}
      onClose={handleCloseDetail}
      onMarkAchieved={handleMarkAchieved}
      onUpdateDate={handleUpdateDate}
      onDeleteTask={handleDeleteTask}
      onUpdateGrade={handleUpdateGrade}
      onRequestUpload={onRequestUpload}
      isMobile={isMobile}
      isClosing={!showTaskDetail}
    />
  );

  // ===== MOBILE LAYOUT =====
  if (isMobile) {
    return (
      <>
        <div className="flex flex-col h-full bg-[#0a0a0a]">
          <style>{cssKeyframes}</style>

          {/* Header */}
          <div className="flex-shrink-0 px-4 pt-safe">
            <div className="flex items-center justify-between h-[56px] gap-2">
              <button
                onClick={onClose}
                className="flex items-center gap-0.5 active:opacity-70 transition-opacity flex-shrink-0"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ChevronLeft className="w-5 h-5 text-white/50" />
                <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50">
                  Zurück
                </span>
              </button>
              <Button
                size="xs"
                fullWidth={false}
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-1.5 flex-shrink-0"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Aufgabe hinzufügen
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden pb-[100px] scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Title Section */}
            <div className="px-4 mt-1 mb-4">
              <h1 className="font-['Poppins:Bold',sans-serif] text-[20px] text-white tracking-[-0.3px]">
                To-Do's verwalten
              </h1>
            </div>

            {/* Grouped Stats Strip */}
            <div className="px-4 mb-4">
              <StatsStrip
                examOpen={stats.upcomingExams}
                examDone={stats.completedExams}
                goalOpen={stats.openGoals}
                goalDone={stats.achievedGoals}
                isMobile={true}
              />
            </div>

            {/* Filter Bar - full bleed to screen edges */}
            <div className="mb-4 relative">
              {filterBarJSX}
            </div>

            {/* Section Header */}
            <div className="px-4 mb-2">
              {sectionHeaderJSX}
            </div>

            {/* Task Cards */}
            <div key={`${activeFilter}-${selectedSubject}`} className="px-4" style={{ animation: 'tabFadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) both' }}>
              {filteredTasks.length > 0 ? (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                  {filteredTasks.map((task, index) => {
                    const isExam = task.type === 'klassenarbeit';
                    const accentColor = task.completed ? '#4ADE80' : (isExam ? '#D4A044' : '#56C2D9');
                    return (
                      <SwipeToDelete
                        key={task.id}
                        onDelete={() => handleDeleteTask(task.id)}
                      >
                        <div
                          onClick={() => { setSelectedTaskId(task.id); setShowTaskDetail(true); }}
                          className={`relative overflow-hidden active:bg-white/[0.03] transition-colors duration-150 cursor-pointer ${
                            index < filteredTasks.length - 1 ? 'border-b border-white/[0.04]' : ''
                          }`}
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          {/* Left Accent Bar */}
                          <div 
                            className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full"
                            style={{ background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}88)` }}
                          />
                          
                          <div className="pl-4 pr-3.5 py-3.5">
                            {/* Top Row: Subject + Badge */}
                            <div className="flex items-center justify-between gap-3 mb-1.5">
                              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white truncate min-w-0">
                                {task.subject}
                              </p>
                              <TypeBadge type={task.type} grade={task.grade} isMobile={true} completed={task.completed} />
                            </div>
                            
                            {/* Bottom Row: Topic + Date */}
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 truncate min-w-0">
                                {task.categoryAndTopic}
                              </p>
                              <div className="flex items-center gap-1.5 text-white/25 flex-shrink-0">
                                <Calendar className="w-3 h-3" />
                                <span className="font-['Poppins:Regular',sans-serif] text-[11px]">
                                  {task.dueDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwipeToDelete>
                    );
                  })}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>

        {addTaskOverlay}
        {taskDetailOverlay}
        <TodoTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      </>
    );
  }

  // ===== DESKTOP LAYOUT =====
  return (
    <>
      {/* Priority: TaskDetail > AddTask > Main */}
      {isDetailMounted && selectedTask ? (
        <TaskDetailScreen
          task={selectedTask}
          onClose={handleCloseDetail}
          onMarkAchieved={handleMarkAchieved}
          onUpdateDate={handleUpdateDate}
          onDeleteTask={handleDeleteTask}
          onUpdateGrade={handleUpdateGrade}
          onRequestUpload={onRequestUpload}
          isMobile={false}
          isClosing={!showTaskDetail}
        />
      ) : isAddTaskMounted ? (
        <AddTaskScreen
          onClose={() => setShowAddTask(false)}
          onAddTask={handleAddTask}
          isMobile={false}
          isClosing={!showAddTask}
        />
      ) : (
      <>
        <style>{cssKeyframes}</style>

        {/* Shared header baseline — DesktopPageHeader */}
        <DesktopPageHeader
          title="To-Do's verwalten"
          onBack={onClose}
          backLabel="Zurück zum Home"
          actions={
            <Button
              size="sm"
              fullWidth={false}
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2 px-5 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Aufgabe hinzufügen
            </Button>
          }
        />

        {/* Grouped Stats Strip */}
        <div className="mb-6">
          <StatsStrip
            examOpen={stats.upcomingExams}
            examDone={stats.completedExams}
            goalOpen={stats.openGoals}
            goalDone={stats.achievedGoals}
            isMobile={false}
          />
        </div>

        {/* Filter Bar */}
        <div className="mb-5">
          {filterBarJSX}
        </div>

        {/* Section Header */}
        <div className="mb-3">
          {sectionHeaderJSX}
        </div>

        {/* Task Table */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden mb-8">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_120px_1fr_120px] gap-4 px-5 py-3 border-b border-white/[0.06]">
            <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/25 uppercase tracking-[0.05em]">Typ</p>
            <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/25 uppercase tracking-[0.05em]">Fach</p>
            <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/25 uppercase tracking-[0.05em]">Thema</p>
            <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/25 uppercase tracking-[0.05em] text-right">Datum</p>
          </div>

          {/* Table Body */}
          <div key={`${activeFilter}-${selectedSubject}`} style={{ animation: 'tabFadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) both' }}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <div
                key={task.id}
                onClick={() => handleOpenDetail(task.id)}
                className={`relative grid grid-cols-[1fr_120px_1fr_120px] gap-4 px-5 py-3 items-center transition-all duration-200 hover:bg-white/[0.02] cursor-pointer group ${
                  index < filteredTasks.length - 1 ? 'border-b border-white/[0.04]' : ''
                }`}
              >
                {/* Left Accent Bar */}
                <div 
                  className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                  style={{ background: (() => {
                    const color = task.completed ? '#4ADE80' : (task.type === 'klassenarbeit' ? '#D4A044' : '#56C2D9');
                    return `linear-gradient(to bottom, ${color}, ${color}88)`;
                  })() }}
                />
                <div><TypeBadge type={task.type} grade={task.grade} completed={task.completed} /></div>
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80 group-hover:text-white transition-colors truncate">{task.subject}</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/35 truncate">{task.categoryAndTopic}</p>
                <div className="flex justify-end">
                  <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/30">
                    {task.dueDate}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState />
          )}
          </div>
        </div>
      </>
      )}
      <TodoTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </>
  );
}