import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronDown, ChevronRight, Target, GraduationCap, Check, X } from 'lucide-react';
import { subjects, categories, topics } from '@/shared-content-selection';
import Checkbox from '@/app/components/Checkbox';
import DesktopPageHeader from '@/app/components/DesktopPageHeader';
import PremiumCalendarPicker, { CalendarTrigger } from './PremiumCalendarPicker';
import './SlideTransition.css';

// ===== TYPES =====
type TaskType = 'lernziel' | 'klassenarbeit';

export interface NewTaskData {
  type: TaskType;
  subject: string;
  categoryAndTopic: string;
  dueDate: string;
  goalDescription?: string;
  topicIds?: string[];
}

interface AddTaskScreenProps {
  onClose: () => void;
  onAddTask: (task: NewTaskData) => void;
  isMobile?: boolean;
  isClosing?: boolean; // 🚀 Pure CSS Animation Control (like AccountEditScreenMobile)
}

// ===== CSS =====
const addTaskCSS = `
@keyframes addTaskFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes addTaskSlideIn {
  from { opacity: 0; transform: translateX(12px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes addTaskSlideBack {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}
`;

// ===== OUTLINED FIELD =====
function OutlinedField({
  label,
  required,
  value,
  placeholder,
  onClick,
  hasChevron = true,
  disabled = false,
  isMobile = false,
}: {
  label: string;
  required?: boolean;
  value?: string;
  placeholder: string;
  onClick?: () => void;
  hasChevron?: boolean;
  disabled?: boolean;
  isMobile?: boolean;
}) {
  return (
    <div className={`transition-opacity duration-200 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/40 mb-1.5 tracking-[0.02em]">
        {label}{required && <span className="text-white/25 ml-0.5">*</span>}
      </p>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`relative w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-left transition-all duration-200 ${
          disabled ? 'cursor-not-allowed' : `cursor-pointer active:scale-[0.995] ${isMobile ? '' : 'hover:bg-white/[0.06] hover:border-white/[0.14]'}`
        }`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className={`font-['Poppins:Regular',sans-serif] text-[14px] truncate ${value ? 'text-white/90' : 'text-white/25'}`}>
            {value || placeholder}
          </span>
          {hasChevron && <ChevronDown className={`w-4 h-4 flex-shrink-0 ml-2 transition-colors ${value ? 'text-white/30' : 'text-white/15'}`} />}
        </div>
      </button>
    </div>
  );
}

// ===== OUTLINED TEXTAREA =====
function OutlinedTextarea({
  label,
  required,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  maxLength,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
  disabled?: boolean;
  maxLength?: number;
}) {
  return (
    <div className={`transition-opacity duration-200 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/40 mb-1.5 tracking-[0.02em]">
        {label}{required && <span className="text-white/25 ml-0.5">*</span>}
      </p>
      <div className={`w-full bg-white/[0.04] border border-white/[0.08] rounded-xl transition-all duration-200 ${
        disabled ? '' : 'focus-within:border-white/[0.18] focus-within:bg-white/[0.06]'
      }`}>
        <style>{`
          .outlined-textarea::placeholder {
            font-size: 14px;
            line-height: 1.55;
          }
        `}</style>
        <textarea
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (maxLength && v.length > maxLength) return;
            onChange(v);
          }}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          maxLength={maxLength}
          className={`outlined-textarea w-full bg-transparent px-4 py-3 font-['Poppins:Regular',sans-serif] text-[16px] text-white/90 placeholder-white/20 resize-none outline-none scrollbar-hide ${
            disabled ? 'cursor-not-allowed' : ''
          }`}
        />
        {maxLength && (
          <div className="flex justify-end px-4 pb-2.5 -mt-1">
            <span className={`font-['Poppins:Regular',sans-serif] text-[11px] transition-colors duration-200 ${
              value.length >= maxLength ? 'text-[#ff6b6b]/60' : value.length >= maxLength * 0.85 ? 'text-white/30' : 'text-white/15'
            }`}>
              {value.length}/{maxLength}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== TOPIC PICKER MODAL (for Klassenarbeit) =====
// Redesigned to match the 4-Seiten Design (ExamApp CategorySelection/TopicSelection style)
function TopicPickerModal({
  subjectId,
  selectedTopicIds,
  onToggleTopic,
  onClose,
  isMobile,
}: {
  subjectId: string;
  selectedTopicIds: string[];
  onToggleTopic: (topicId: string) => void;
  onClose: () => void;
  isMobile: boolean;
}) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward');

  // ===== Standard slide-screen State Machine (entering → active → exiting) =====
  const [animationState, setAnimationState] = useState<'entering' | 'active' | 'exiting'>('entering');

  useEffect(() => {
    const timer = setTimeout(() => setAnimationState('active'), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setAnimationState('exiting');
    setTimeout(() => onClose(), 300);
  };

  const subjectCategories = useMemo(
    () => categories.filter(c => c.subjectId === subjectId),
    [subjectId]
  );

  const categoryTopics = useMemo(
    () => activeCategoryId ? topics.filter(t => t.categoryId === activeCategoryId) : [],
    [activeCategoryId]
  );

  const activeCategory = useMemo(
    () => categories.find(c => c.id === activeCategoryId),
    [activeCategoryId]
  );

  const getSelectedCountForCategory = (catId: string) => {
    const catTopics = topics.filter(t => t.categoryId === catId);
    return catTopics.filter(t => selectedTopicIds.includes(t.id)).length;
  };

  const totalSelected = selectedTopicIds.length;

  const goToCategory = (catId: string) => {
    setAnimDir('forward');
    setActiveCategoryId(catId);
  };

  const goBack = () => {
    setAnimDir('back');
    setActiveCategoryId(null);
  };

  // Card style matching ExamApp 4-Seiten
  const cardBase = "relative min-h-[54px] rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] flex items-center px-[11px] py-[15px] cursor-pointer transition-all duration-200 active:scale-[0.98]";
  const cardGPU: React.CSSProperties = {
    WebkitTapHighlightColor: 'transparent',
    willChange: 'transform',
    transform: 'translateZ(0)',
    isolation: 'isolate' as const,
  };

  // Chevron Right SVG (matching ExamApp)
  const ChevronRightSVG = () => (
    <svg className="w-[6px] h-[11px] flex-shrink-0" fill="none" viewBox="0 0 6 11">
      <path d="M1 1L5 5.5L1 10" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );

  const modalContent = (
    <div className="size-full flex flex-col bg-[#0a0a0a] overscroll-none relative">
      {/* Header - 4-Seiten Style */}
      <div className={`px-6 py-3 flex-shrink-0 ${isMobile ? 'pt-safe mt-3' : 'lg:mt-[20px]'}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            {activeCategoryId && (
              <button
                onClick={goBack}
                className="flex items-center justify-center size-[42px] rounded-full bg-white/[0.06] border border-white/[0.08] active:bg-white/[0.1] active:border-white/[0.2] active:scale-95 transition-all duration-150 flex-shrink-0"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ChevronLeft className="w-4 h-4 text-white/60" />
              </button>
            )}
            <div>
              <h1 className="font-['Poppins:SemiBold',sans-serif] text-[16px] lg:text-[15px] text-white mb-0.5 line-clamp-2">
                {activeCategoryId ? activeCategory?.name : 'Kategorien & Themen'}
              </h1>
              <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[13px] text-[#979797]">
                {activeCategoryId
                  ? `${categoryTopics.filter(t => selectedTopicIds.includes(t.id)).length} von ${categoryTopics.length} Themen ausgewählt`
                  : totalSelected > 0
                    ? <span className="text-[#7DD4E4]">{totalSelected} Themen ausgewählt</span>
                    : 'Wähle Kategorien & Themen'
                }
              </p>
            </div>
          </div>
          {/* CloseButton matching shared component style */}
          <button
            onClick={handleClose}
            className="bg-white/[0.06] border border-white/[0.08] active:bg-white/[0.1] active:border-white/[0.2] rounded-full size-[42px] flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 flex-shrink-0"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <svg className="w-[16px] h-[16px] text-[#999]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content - Container + Divider Style */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto overscroll-none relative scrollbar-hide">
        {!activeCategoryId ? (
          // ===== Category List =====
          <div
            key="categories"
            style={{ animation: animDir === 'back' ? 'addTaskSlideBack 0.2s ease-out' : 'addTaskFadeIn 0.15s ease-out' }}
          >
            <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
              {subjectCategories.map((cat, index) => {
                const catTopicCount = topics.filter(t => t.categoryId === cat.id).length;
                const selectedCount = getSelectedCountForCategory(cat.id);
                return (
                  <div
                    key={cat.id}
                    className="flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors duration-150 active:bg-white/[0.04] relative"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    onClick={() => goToCategory(cat.id)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[15px] text-white leading-[22px]">
                        {cat.name}
                      </p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/25 mt-0.5">
                        {catTopicCount} Themen
                        {selectedCount > 0 && (
                          <span className="text-[#7DD4E4] ml-1.5">
                            ({selectedCount} ausgewählt)
                          </span>
                        )}
                      </p>
                    </div>
                    <svg className="w-[7px] h-[12px] flex-shrink-0" fill="none" viewBox="0 0 7 12">
                      <path d="M1 1L5.5 6L1 11" stroke="#8E8E93" strokeLinecap="round" strokeWidth="1.5" />
                    </svg>
                    {/* Divider */}
                    {index < subjectCategories.length - 1 && (
                      <div className="absolute bottom-0 left-4 right-0 h-px bg-white/[0.08]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // ===== Topic List within Category =====
          <div
            key={activeCategoryId}
            style={{ animation: 'addTaskSlideIn 0.2s ease-out' }}
          >
            <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
              {categoryTopics.map((topic, index) => {
                const isSelected = selectedTopicIds.includes(topic.id);
                return (
                  <div
                    key={topic.id}
                    className={`flex items-center gap-3.5 px-4 py-3.5 cursor-pointer transition-colors duration-150 active:bg-white/[0.04] relative ${isSelected ? 'bg-white/[0.03]' : ''}`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    onClick={() => onToggleTopic(topic.id)}
                  >
                    <Checkbox checked={isSelected} size="sm" />
                    <p className={`font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[15px] leading-[22px] ${
                      isSelected ? 'text-white' : 'text-white/60'
                    }`}>
                      {topic.name}
                    </p>
                    {/* Divider */}
                    {index < categoryTopics.length - 1 && (
                      <div className="absolute bottom-0 left-4 right-0 h-px bg-white/[0.08]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer removed - X button in header is sufficient */}
    </div>
  );

  const slideClass =
    animationState === 'entering' ? 'slide-screen-entering' :
    animationState === 'exiting' ? 'slide-screen-exiting' :
    'slide-screen-active';

  // Mobile: fixed overlay using standard slide-screen transition
  if (isMobile) {
    return (
      <div className={`slide-screen ${slideClass}`} style={{ zIndex: 200 }}>
        {modalContent}
      </div>
    );
  }

  // Desktop: centered modal panel
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[200]" onClick={handleClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-6">
        <div
          className="rounded-2xl w-full max-w-[520px] max-h-[75vh] overflow-hidden border border-white/[0.08]"
          style={{ animation: 'addTaskFadeIn 0.2s ease-out' }}
          onClick={(e) => e.stopPropagation()}
        >
          {modalContent}
        </div>
      </div>
    </>
  );
}

// Native select styling helper
const nativeSelectClass = (hasValue: boolean, disabled: boolean) =>
  `w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 font-['Poppins:Regular',sans-serif] text-[14px] appearance-none cursor-pointer outline-none transition-all duration-200 focus:border-white/[0.18] focus:bg-white/[0.06] active:scale-[0.995] ${hasValue ? 'text-white/90' : 'text-white/25'} ${disabled ? 'opacity-40 pointer-events-none cursor-not-allowed' : ''}`;

const nativeSelectStyle: React.CSSProperties = { WebkitTapHighlightColor: 'transparent', colorScheme: 'dark' };

// ===== MAIN COMPONENT =====
export default function AddTaskScreen({ onClose, onAddTask, isMobile = false, isClosing = false }: AddTaskScreenProps) {
  const [taskType, setTaskType] = useState<TaskType>('lernziel');
  
  // 🚀 Pure CSS Animation State (like AccountEditScreenMobile / ScreenManager)
  const [animationState, setAnimationState] = useState<'entering' | 'active' | 'exiting'>('entering');

  // entering → active after 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('active');
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle exit animation when isClosing changes
  useEffect(() => {
    if (isClosing) {
      setAnimationState('exiting');
    }
  }, [isClosing]);

  // 🚀 Pure CSS Animation Classes (like ScreenManager)
  const slideAnimationClass = 
    animationState === 'entering' ? 'slide-screen-entering' :
    animationState === 'exiting' ? 'slide-screen-exiting' :
    'slide-screen-active';

  // Shared state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [goalDescription, setGoalDescription] = useState('');
  
  // Lernziel state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  
  // Klassenarbeit state
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  
  // Dropdown visibility
  const [showTopicPicker, setShowTopicPicker] = useState(false);

  // Dynamic overflow detection — only allow scroll when content overflows
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
    }
  }, []);

  useEffect(() => {
    checkOverflow();
    const el = scrollContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    // Also observe children changes
    const mutationObs = new MutationObserver(checkOverflow);
    mutationObs.observe(el, { childList: true, subtree: true, attributes: true });
    return () => { observer.disconnect(); mutationObs.disconnect(); };
  }, [checkOverflow, taskType, selectedSubjectId, selectedCategoryId, selectedTopicId, selectedTopicIds, dueDate, goalDescription]);

  // Derived data
  const selectedSubject = useMemo(
    () => subjects.find(s => s.id === selectedSubjectId),
    [selectedSubjectId]
  );
  const filteredCategories = useMemo(() => selectedSubjectId ? categories.filter(c => c.subjectId === selectedSubjectId) : [], [selectedSubjectId]);
  const filteredTopics = useMemo(() => selectedCategoryId ? topics.filter(t => t.categoryId === selectedCategoryId) : [], [selectedCategoryId]);
  const selectedCategory = useMemo(() => categories.find(c => c.id === selectedCategoryId), [selectedCategoryId]);
  const selectedTopic = useMemo(() => topics.find(t => t.id === selectedTopicId), [selectedTopicId]);

  // Topic picker summary for Klassenarbeit
  const topicPickerSummary = useMemo(() => {
    if (selectedTopicIds.length === 0) return '';
    const uniqueCats = new Set(selectedTopicIds.map(tid => {
      const topic = topics.find(t => t.id === tid);
      return topic?.categoryId;
    }).filter(Boolean));
    return `${selectedTopicIds.length} Themen aus ${uniqueCats.size} ${uniqueCats.size === 1 ? 'Kategorie' : 'Kategorien'}`;
  }, [selectedTopicIds]);

  // Progressive unlock flags
  // Lernziel: Fach → Kategorie → Thema → Datum  Zielbeschreibung
  const lzDateDisabled = !selectedTopicId;
  const lzDescDisabled = !dueDate;
  // Klassenarbeit: Fach → Kategorien & Themen → Datum → Zielbeschreibung
  const kaDateDisabled = selectedTopicIds.length === 0;
  const kaDescDisabled = !dueDate;

  // Reset when switching type
  const handleTypeChange = (type: TaskType) => {
    setTaskType(type);
    setSelectedSubjectId(null);
    setSelectedCategoryId(null);
    setSelectedTopicId(null);
    setSelectedTopicIds([]);
    setDueDate('');
    setGoalDescription('');
  };

  // Reset downstream when subject changes
  const handleSubjectChange = (id: string) => {
    setSelectedSubjectId(id);
    setSelectedCategoryId(null);
    setSelectedTopicId(null);
    setSelectedTopicIds([]);
    setDueDate('');
    setGoalDescription('');
  };

  // Reset topic + downstream when category changes
  const handleCategoryChange = (id: string) => {
    setSelectedCategoryId(id);
    setSelectedTopicId(null);
    setDueDate('');
    setGoalDescription('');
  };

  // Toggle topic for Klassenarbeit
  const handleToggleTopic = (topicId: string) => {
    setSelectedTopicIds(prev =>
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
    );
  };

  // Format date from YYYY-MM-DD to DD.MM.YYYY
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
  };

  // Format date for display
  const displayDate = dueDate ? formatDate(dueDate) : '';

  // Validation
  const isValid = useMemo(() => {
    if (!selectedSubjectId || !dueDate) return false;
    if (taskType === 'lernziel') {
      return !!selectedCategoryId && !!selectedTopicId;
    } else {
      return selectedTopicIds.length > 0;
    }
  }, [taskType, selectedSubjectId, selectedCategoryId, selectedTopicId, selectedTopicIds, dueDate]);

  // Submit
  const handleSubmit = () => {
    if (!isValid || !selectedSubject) return;

    const task: NewTaskData = {
      type: taskType,
      subject: selectedSubject.name,
      categoryAndTopic: taskType === 'lernziel'
        ? selectedTopic?.name || ''
        : topicPickerSummary,
      dueDate: formatDate(dueDate),
      goalDescription: goalDescription || undefined,
      topicIds: taskType === 'klassenarbeit' ? [...selectedTopicIds] : undefined,
    };

    onAddTask(task);
    onClose();
  };

  // ===== RENDER =====
  const content = (
    <>
      <style>{addTaskCSS}</style>
      
      {/* Header — mobile only; desktop uses DesktopPageHeader */}
      {isMobile && (
      <div className="flex-shrink-0 px-4 pt-safe">
        <div className="flex items-center h-[56px]">
          <button
            onClick={onClose}
            className="flex items-center gap-0.5 active:opacity-70 transition-opacity"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <ChevronLeft className="w-5 h-5 text-white/50" />
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50">
              Zurück zu To-Do Verwaltung
            </span>
          </button>
        </div>
      </div>
      )}

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className={`flex-1 ${isOverflowing ? 'overflow-y-auto' : 'overflow-hidden'} ${isMobile ? 'px-4 pb-4 scrollbar-hide' : ''}`}
        style={isMobile ? { overscrollBehavior: 'none', WebkitOverflowScrolling: isOverflowing ? 'touch' : undefined } as React.CSSProperties : undefined}
      >
        {/* Title — mobile only; desktop has DesktopPageHeader */}
        {isMobile && (
        <div className="mb-5">
          <h1 className="font-['Poppins:Bold',sans-serif] text-white tracking-[-0.3px] text-[20px]">
            Aufgabe hinzufügen
          </h1>
        </div>
        )}

        {/* Type Selector */}
        <div className={`flex items-center gap-3 ${isMobile ? 'mb-5' : 'mb-6'}`} style={{ animation: 'addTaskFadeIn 0.2s ease-out' }}>
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/50 flex-shrink-0">
            Bitte auswählen:
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleTypeChange('lernziel')}
              className={`flex items-center gap-1.5 px-3.5 py-[7px] rounded-full font-['Poppins:Medium',sans-serif] text-[12px] transition-all duration-200 active:scale-[0.97] ${
                taskType === 'lernziel'
                  ? 'bg-[#56C2D9]/20 text-[#7DD4E4] border border-[#56C2D9]/30'
                  : `text-white/40 bg-white/[0.04] border border-transparent ${isMobile ? '' : 'hover:bg-white/[0.06]'}`
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Target className="w-3.5 h-3.5" />
              Lernziel
            </button>
            <button
              onClick={() => handleTypeChange('klassenarbeit')}
              className={`flex items-center gap-1.5 px-3.5 py-[7px] rounded-full font-['Poppins:Medium',sans-serif] text-[12px] transition-all duration-200 active:scale-[0.97] ${
                taskType === 'klassenarbeit'
                  ? 'bg-[#D4A044]/20 text-[#E8B960] border border-[#D4A044]/30'
                  : `text-white/40 bg-white/[0.04] border border-transparent ${isMobile ? '' : 'hover:bg-white/[0.06]'}`
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Klassenarbeit
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div style={{ animation: 'addTaskFadeIn 0.25s ease-out' }}>
          {taskType === 'lernziel' ? (
            // ===== LERNZIEL FORM =====
            <div key="lernziel-form" className="space-y-5">
              {/* Row 1: Fach + Kategorie */}
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {/* Fach – Native Select */}
                <div>
                  <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/40 mb-1.5 tracking-[0.02em]">
                    Fach<span className="text-white/25 ml-0.5">*</span>
                  </p>
                  <div className="relative">
                    <select
                      value={selectedSubjectId || ''}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      className={nativeSelectClass(!!selectedSubjectId, false)}
                      style={nativeSelectStyle}
                    >
                      <option value="" disabled className="bg-[#1a1a1a] text-white/40">Fach auswählen</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id} className="bg-[#1a1a1a] text-white">{s.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" strokeWidth={2} />
                  </div>
                </div>
                {/* Kategorie – Native Select */}
                <div>
                  <p className={`font-['Poppins:Medium',sans-serif] text-[11px] text-white/40 mb-1.5 tracking-[0.02em] ${!selectedSubjectId ? 'opacity-40' : ''}`}>
                    Kategorie<span className="text-white/25 ml-0.5">*</span>
                  </p>
                  <div className="relative">
                    <select
                      value={selectedCategoryId || ''}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      disabled={!selectedSubjectId}
                      className={nativeSelectClass(!!selectedCategoryId, !selectedSubjectId)}
                      style={nativeSelectStyle}
                    >
                      <option value="" disabled className="bg-[#1a1a1a] text-white/40">Kategorie auswählen</option>
                      {filteredCategories.map(c => (
                        <option key={c.id} value={c.id} className="bg-[#1a1a1a] text-white">{c.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" strokeWidth={2} />
                  </div>
                </div>
              </div>

              {/* Row 2: Thema + Datum */}
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {/* Thema – Native Select */}
                <div>
                  <p className={`font-['Poppins:Medium',sans-serif] text-[11px] text-white/40 mb-1.5 tracking-[0.02em] ${!selectedCategoryId ? 'opacity-40' : ''}`}>
                    Thema<span className="text-white/25 ml-0.5">*</span>
                  </p>
                  <div className="relative">
                    <select
                      value={selectedTopicId || ''}
                      onChange={(e) => setSelectedTopicId(e.target.value)}
                      disabled={!selectedCategoryId}
                      className={nativeSelectClass(!!selectedTopicId, !selectedCategoryId)}
                      style={nativeSelectStyle}
                    >
                      <option value="" disabled className="bg-[#1a1a1a] text-white/40">Thema auswählen</option>
                      {filteredTopics.map(t => (
                        <option key={t.id} value={t.id} className="bg-[#1a1a1a] text-white">{t.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" strokeWidth={2} />
                  </div>
                </div>
                <div className={`relative ${lzDateDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                  <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/40 mb-1.5 tracking-[0.02em]">
                    Zieldatum<span className="text-white/25 ml-0.5">*</span>
                  </p>
                  <CalendarTrigger
                    value={dueDate}
                    placeholder="Datum wählen"
                    onClick={() => setShowCalendar(true)}
                    disabled={lzDateDisabled}
                  />
                </div>
              </div>

              {/* Zielbeschreibung */}
              <OutlinedTextarea
                label="Zielbeschreibung"
                value={goalDescription}
                onChange={setGoalDescription}
                placeholder="Beschreibe kurz, was du mit diesem Lernziel erreichen möchtest, z. B. 'Quadratische Gleichungen sicher anwenden können'. Wenn du kein spezifisches Ziel hast, kannst du dieses Feld leer lassen."
                rows={4}
                disabled={lzDescDisabled}
                maxLength={400}
              />
            </div>
          ) : (
            // ===== KLASSENARBEIT FORM =====
            <div key="klassenarbeit-form" className="space-y-5">
              {/* Row 1: Fach + Kategorien & Themen */}
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {/* Fach – Native Select */}
                <div>
                  <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/40 mb-1.5 tracking-[0.02em]">
                    Fach<span className="text-white/25 ml-0.5">*</span>
                  </p>
                  <div className="relative">
                    <select
                      value={selectedSubjectId || ''}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      className={nativeSelectClass(!!selectedSubjectId, false)}
                      style={nativeSelectStyle}
                    >
                      <option value="" disabled className="bg-[#1a1a1a] text-white/40">Auswählen</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id} className="bg-[#1a1a1a] text-white">{s.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" strokeWidth={2} />
                  </div>
                </div>
                <div className="relative">
                  <OutlinedField
                    label="Kategorien & Themen"
                    required
                    value={topicPickerSummary}
                    placeholder="Auswählen"
                    onClick={() => selectedSubjectId && setShowTopicPicker(true)}
                    disabled={!selectedSubjectId}
                    isMobile={isMobile}
                  />
                </div>
              </div>

              {/* Row 2: Datum */}
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div className={`relative ${kaDateDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                  <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/40 mb-1.5 tracking-[0.02em]">
                    Klassenarbeit-Datum<span className="text-white/25 ml-0.5">*</span>
                  </p>
                  <CalendarTrigger
                    value={dueDate}
                    placeholder="Datum wählen"
                    onClick={() => setShowCalendar(true)}
                    disabled={kaDateDisabled}
                  />
                </div>
                {!isMobile && <div />}
              </div>

              {/* Zielbeschreibung */}
              <OutlinedTextarea
                label="Zielbeschreibung"
                value={goalDescription}
                onChange={setGoalDescription}
                placeholder="Teile mit, was dir schwerfällt, welche Bedenken du bezüglich der bevorstehenden Klassenarbeit hast oder welche Bereiche du in der Vorbereitung stärker fokussieren möchtest. Wenn du unsicher bist oder es allgemein halten möchtest, lasse dieses Feld leer, die KI versucht dann eigenständig Schwerpunkte festzulegen."
                rows={6}
                disabled={kaDescDisabled}
                maxLength={400}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className={`flex gap-3 mt-8 ${isMobile ? 'mb-6' : 'mb-8'}`}>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={`h-[48px] rounded-xl border flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] ${
                isMobile ? 'flex-1' : 'px-7'
              } ${
                isValid
                  ? `bg-white/[0.06] border-white/[0.14] cursor-pointer ${isMobile ? 'active:bg-white/[0.10]' : 'hover:bg-white/[0.10] hover:border-white/[0.20]'}`
                  : 'bg-white/[0.03] border-white/[0.06] cursor-not-allowed'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className={`font-['Poppins:SemiBold',sans-serif] text-[14px] ${isValid ? 'text-white' : 'text-white/25'}`}>
                {taskType === 'lernziel' ? 'Lernziel setzen' : 'Hinzufügen'}
              </span>
            </button>
            <button
              onClick={onClose}
              className={`h-[48px] rounded-xl border border-white/[0.12] bg-white/[0.03] flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                isMobile ? 'flex-1' : 'px-7'
              } ${isMobile ? '' : 'hover:bg-white/[0.06]'}`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/60">
                Abbrechen
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Topic Picker Modal (Klassenarbeit) */}
      {showTopicPicker && selectedSubjectId && (
        <TopicPickerModal
          subjectId={selectedSubjectId}
          selectedTopicIds={selectedTopicIds}
          onToggleTopic={handleToggleTopic}
          onClose={() => setShowTopicPicker(false)}
          isMobile={isMobile}
        />
      )}

      {/* Premium Calendar Picker */}
      <PremiumCalendarPicker
        mode="single"
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        title={taskType === 'lernziel' ? 'Zieldatum wählen' : 'Klassenarbeit-Datum wählen'}
        value={dueDate}
        onSelect={(date) => setDueDate(date)}
        minDate={taskType === 'lernziel' ? (() => { const d = new Date(); d.setDate(d.getDate() + 3); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })() : undefined}
      />
    </>
  );

  // ===== LAYOUT WRAPPER =====
  if (isMobile) {
    return (
      <div
        className={`slide-screen ${slideAnimationClass} flex flex-col`}
        style={{ overscrollBehavior: 'none' }}
      >
        {content}
      </div>
    );
  }

  // Desktop: im gleichen Content-Bereich wie TodoManagement (kein Fullscreen-Overlay)
  // DesktopPageHeader provides standardized back button + title.
  // No screen-level px, py, h-full, overflow — DCW is the layout authority.
  return (
    <>
      <DesktopPageHeader
        title="Aufgabe hinzufügen"
        onBack={onClose}
        backLabel="Zurück"
      />
      {content}
    </>
  );
}