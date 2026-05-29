import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ClipboardList, CheckCircle2, Target, GraduationCap, Eye, Trash2, Star, Clock } from 'lucide-react';
import { subjects, categories, topics } from '@/shared-content-selection';

import DesktopPageHeader from '@/app/components/DesktopPageHeader';
import PremiumCalendarPicker, { CalendarTrigger } from './PremiumCalendarPicker';
import './SlideTransition.css';
import Button from '@/app/components/Button';

// Flag icon SVG for Lernziele (from Figma import)
const FLAG_PATH = "M4.75 3.70898V5.03906C5.25977 5.1543 5.71289 5.34375 6.1875 5.47461V4.14258C5.67969 4.0293 5.22266 3.83984 4.75 3.70898ZM9.11133 1.30664C8.44141 1.61719 7.61719 1.92969 6.82617 1.92969C5.78125 1.92969 4.91602 1.25 3.59961 1.25C3.11133 1.25 2.67578 1.33594 2.27148 1.48438C2.32617 1.3418 2.35156 1.1875 2.3418 1.02344C2.30664 0.46875 1.85156 0.0234375 1.29492 0C0.669922 -0.0253906 0.15625 0.474609 0.15625 1.09375C0.15625 1.46484 0.341797 1.79297 0.625 1.99023V9.53125C0.625 9.79102 0.833984 10 1.09375 10H1.40625C1.66602 10 1.875 9.79102 1.875 9.53125V7.6875C2.42773 7.45117 3.11719 7.25586 4.10937 7.25586C5.15625 7.25586 6.01953 7.93555 7.33594 7.93555C8.27734 7.93555 9.0293 7.61719 9.72852 7.13672C9.89844 7.01953 9.99805 6.82813 9.99805 6.62109V1.87305C10 1.41797 9.52539 1.11523 9.11133 1.30664ZM3.3125 6.35742C2.80859 6.41016 2.33594 6.51758 1.875 6.68164V5.30469C2.38672 5.12305 2.80273 5.01172 3.3125 4.96484V6.35742ZM9.0625 3.73047C8.60156 3.92187 8.1582 4.11133 7.625 4.19727V5.58594C8.10937 5.51953 8.62891 5.35547 9.0625 5.07813V6.45508C8.57227 6.76953 8.11523 6.9375 7.625 6.98438V5.58594C7.09766 5.6582 6.68945 5.61523 6.1875 5.47656V6.79297C5.7207 6.64844 5.26367 6.4668 4.75 6.37695V5.03906C4.36523 4.95313 3.95313 4.90625 3.3125 4.96484V3.59766C2.875 3.6582 2.44141 3.79687 1.875 4.00586V2.62891C2.52344 2.39062 2.85352 2.24219 3.3125 2.19922V3.59766C3.83984 3.52539 4.25781 3.57227 4.75 3.70898V2.39258C5.21289 2.53711 5.67187 2.71875 6.1875 2.80859V4.14453C6.65039 4.24805 7.11719 4.2793 7.625 4.19727V2.79297C8.15234 2.69922 8.64648 2.52734 9.0625 2.35352V3.73047Z";

function FlagIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d={FLAG_PATH} />
    </svg>
  );
}

// ===== TYPES =====
type TaskType = 'klassenarbeit' | 'lernziel';

export interface TodoTaskDetail {
  id: string;
  type: TaskType;
  subject: string;
  categoryAndTopic: string;
  dueDate: string; // DD.MM.YYYY
  completed: boolean;
  goalDescription?: string;
  topicIds?: string[];
  grade?: string;
  createdAt?: string; // DD.MM.YYYY
}

interface TaskDetailScreenProps {
  task: TodoTaskDetail;
  onClose: () => void;
  onMarkAchieved: (taskId: string) => void;
  onUpdateDate: (taskId: string, newDate: string) => void;
  onUpdateGrade?: (taskId: string, grade: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onRequestUpload?: (taskId: string, subject: string, grade: string) => void;
  isMobile?: boolean;
  isClosing?: boolean;
}

// ===== INFO ROW =====
function InfoRow({ label, value, icon, accentColor }: { label: string; value: string; icon: React.ReactNode; accentColor?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="w-[18px] flex items-center justify-center text-white/25">{icon}</div>
        <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">{label}</span>
      </div>
      <span
        className="font-['Poppins:Medium',sans-serif] text-[13px] text-right truncate"
        style={{ color: accentColor || 'rgba(255,255,255,0.85)' }}
      >
        {value}
      </span>
    </div>
  );
}

// ===== CSS =====
const detailCSS = `
@keyframes detailFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes calendarFadeIn {
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
`;

// ===== DATE UTILITIES =====
function parseDDMMYYYY(dateStr: string): string {
  // DD.MM.YYYY -> YYYY-MM-DD
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return '';
}

function formatToDisplay(isoDate: string): string {
  // YYYY-MM-DD -> DD.MM.YYYY
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
}

// ===== TOPIC VIEWER MODAL (read-only) =====
function TopicViewerModal({
  subjectName,
  topicIds,
  onClose,
  isMobile,
}: {
  subjectName: string;
  topicIds: string[];
  onClose: () => void;
  isMobile: boolean;
}) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward');
  const [animationState, setAnimationState] = useState<'entering' | 'active' | 'exiting'>('entering');

  useEffect(() => {
    const timer = setTimeout(() => setAnimationState('active'), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setAnimationState('exiting');
    setTimeout(() => onClose(), 300);
  };

  // Find subject ID from name
  const subjectId = useMemo(() => {
    const s = subjects.find(s => s.name === subjectName);
    return s?.id || '';
  }, [subjectName]);

  // Get categories that have at least one selected topic
  const relevantCategories = useMemo(() => {
    if (!subjectId) return [];
    const subjectCats = categories.filter(c => c.subjectId === subjectId);
    return subjectCats.filter(cat => {
      const catTopics = topics.filter(t => t.categoryId === cat.id);
      return catTopics.some(t => topicIds.includes(t.id));
    });
  }, [subjectId, topicIds]);

  const categoryTopicsList = useMemo(
    () => activeCategoryId ? topics.filter(t => t.categoryId === activeCategoryId) : [],
    [activeCategoryId]
  );

  const activeCategory = useMemo(
    () => categories.find(c => c.id === activeCategoryId),
    [activeCategoryId]
  );

  const getSelectedCountForCategory = (catId: string) => {
    const catTopics = topics.filter(t => t.categoryId === catId);
    return catTopics.filter(t => topicIds.includes(t.id)).length;
  };

  const goToCategory = (catId: string) => {
    setAnimDir('forward');
    setActiveCategoryId(catId);
  };

  const goBack = () => {
    setAnimDir('back');
    setActiveCategoryId(null);
  };

  const viewerCSS = `
@keyframes viewerFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes viewerSlideIn {
  from { opacity: 0; transform: translateX(12px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes viewerSlideBack {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}
`;

  const modalContent = (
    <div className="size-full flex flex-col bg-[#0a0a0a] overscroll-none relative">
      <style>{viewerCSS}</style>
      {/* Header */}
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
                {activeCategoryId ? activeCategory?.name : 'Ausgewählte Themen'}
              </h1>
              <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[13px] text-[#979797]">
                {activeCategoryId
                  ? `${categoryTopicsList.filter(t => topicIds.includes(t.id)).length} von ${categoryTopicsList.length} Themen ausgewählt`
                  : `${topicIds.length} Themen aus ${relevantCategories.length} ${relevantCategories.length === 1 ? 'Kategorie' : 'Kategorien'}`
                }
              </p>
            </div>
          </div>
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

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto overscroll-none relative scrollbar-hide">
        {!activeCategoryId ? (
          // ===== Category List =====
          <div
            key="categories"
            style={{ animation: animDir === 'back' ? 'viewerSlideBack 0.2s ease-out' : 'viewerFadeIn 0.15s ease-out' }}
          >
            <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
              {relevantCategories.map((cat, index) => {
                const catTopicCount = topics.filter(t => t.categoryId === cat.id).length;
                const selectedCount = getSelectedCountForCategory(cat.id);
                return (
                  <div
                    key={cat.id}
                    className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors duration-150 relative ${isMobile ? 'active:bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    onClick={() => goToCategory(cat.id)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[15px] text-white leading-[22px]">
                        {cat.name}
                      </p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/25 mt-0.5">
                        {selectedCount} von {catTopicCount} Themen ausgewählt
                      </p>
                    </div>
                    <svg className="w-[7px] h-[12px] flex-shrink-0" fill="none" viewBox="0 0 7 12">
                      <path d="M1 1L5.5 6L1 11" stroke="#8E8E93" strokeLinecap="round" strokeWidth="1.5" />
                    </svg>
                    {index < relevantCategories.length - 1 && (
                      <div className="absolute bottom-0 left-4 right-0 h-px bg-white/[0.08]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // ===== Topic List (read-only) =====
          <div
            key={activeCategoryId}
            style={{ animation: 'viewerSlideIn 0.2s ease-out' }}
          >
            <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
              {categoryTopicsList.map((topic, index) => {
                const isSelected = topicIds.includes(topic.id);
                return (
                  <div
                    key={topic.id}
                    className={`flex items-center gap-3.5 px-4 py-3.5 relative ${isSelected ? 'bg-white/[0.03]' : ''}`}
                  >
                    {/* Read-only indicator */}
                    <div className={`w-[18px] h-[18px] rounded-md flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-[#D4A044]/20 border border-[#D4A044]/30' : 'border border-white/[0.08]'
                    }`}>
                      {isSelected && (
                        <svg className="w-[10px] h-[10px]" fill="none" viewBox="0 0 12 12">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#E8B960" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <p className={`font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[15px] leading-[22px] ${
                      isSelected ? 'text-white' : 'text-white/30'
                    }`}>
                      {topic.name}
                    </p>
                    {index < categoryTopicsList.length - 1 && (
                      <div className="absolute bottom-0 left-4 right-0 h-px bg-white/[0.08]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const slideClass =
    animationState === 'entering' ? 'slide-screen-entering' :
    animationState === 'exiting' ? 'slide-screen-exiting' :
    'slide-screen-active';

  if (isMobile) {
    return (
      <div className={`slide-screen ${slideClass}`} style={{ zIndex: 200 }}>
        {modalContent}
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[200]" onClick={handleClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-6">
        <div
          className="rounded-2xl w-full max-w-[520px] max-h-[75vh] overflow-hidden border border-white/[0.08]"
          style={{ animation: 'viewerFadeIn 0.2s ease-out' }}
          onClick={(e) => e.stopPropagation()}
        >
          {modalContent}
        </div>
      </div>
    </>
  );
}

// ===== MAIN COMPONENT =====
export default function TaskDetailScreen({ task, onClose, onMarkAchieved, onUpdateDate, onUpdateGrade, onDeleteTask, onRequestUpload, isMobile = false, isClosing = false }: TaskDetailScreenProps) {
  const isExam = task.type === 'klassenarbeit';
  const accentColor = isExam ? '#D4A044' : '#56C2D9';
  const accentColorLight = isExam ? '#E8B960' : '#7DD4E4';

  // Animation state
  const [animationState, setAnimationState] = useState<'entering' | 'active' | 'exiting'>('entering');

  useEffect(() => {
    const timer = setTimeout(() => setAnimationState('active'), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isClosing) setAnimationState('exiting');
  }, [isClosing]);

  const slideAnimationClass =
    animationState === 'entering' ? 'slide-screen-entering' :
    animationState === 'exiting' ? 'slide-screen-exiting' :
    'slide-screen-active';

  // Editable date state (only for Klassenarbeit)
  const [editedDate, setEditedDate] = useState(task.dueDate);
  const hasDateChanged = editedDate !== task.dueDate;
  const [showDateCalendar, setShowDateCalendar] = useState(false);

  // Confirmation states
  const [isMarking, setIsMarking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTopicViewer, setShowTopicViewer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Grade entry state (only for completed Klassenarbeiten)
  const [showGradeInput, setShowGradeInput] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>(task.grade || '');
  const [selectedModifier, setSelectedModifier] = useState<'+' | '' | '-'>('');
  const [isSavingGrade, setIsSavingGrade] = useState(false);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const [savedGradeForUpload, setSavedGradeForUpload] = useState('');

  // Parse existing grade into base + modifier
  useEffect(() => {
    if (task.grade) {
      const base = task.grade.replace(/[+-]/, '');
      const mod = task.grade.endsWith('+') ? '+' : task.grade.endsWith('-') ? '-' : '';
      setSelectedGrade(base);
      setSelectedModifier(mod as '+' | '' | '-');
    }
  }, [task.grade]);

  const gradeColors: Record<string, { bg: string; border: string; text: string }> = {
    '1': { bg: 'rgba(74, 222, 128, 0.12)', border: 'rgba(74, 222, 128, 0.25)', text: '#4ADE80' },
    '2': { bg: 'rgba(96, 200, 120, 0.12)', border: 'rgba(96, 200, 120, 0.25)', text: '#60C878' },
    '3': { bg: 'rgba(232, 185, 96, 0.12)', border: 'rgba(232, 185, 96, 0.25)', text: '#E8B960' },
    '4': { bg: 'rgba(245, 158, 66, 0.12)', border: 'rgba(245, 158, 66, 0.25)', text: '#F59E42' },
    '5': { bg: 'rgba(255, 120, 80, 0.12)', border: 'rgba(255, 120, 80, 0.25)', text: '#FF7850' },
    '6': { bg: 'rgba(255, 69, 58, 0.12)', border: 'rgba(255, 69, 58, 0.25)', text: '#FF453A' },
  };

  const composedGrade = selectedGrade ? `${selectedGrade}${selectedModifier}` : '';

  const handleSaveGrade = () => {
    if (!composedGrade || !onUpdateGrade) return;
    setIsSavingGrade(true);
    setTimeout(() => {
      onUpdateGrade(task.id, composedGrade);
      setIsSavingGrade(false);
      setShowGradeInput(false);
      // Show upload prompt only if callback is available
      if (onRequestUpload) {
        setSavedGradeForUpload(composedGrade);
        setShowUploadPrompt(true);
      }
    }, 300);
  };

  const handleMarkAchieved = () => {
    setIsMarking(true);
    setTimeout(() => {
      onMarkAchieved(task.id);
      onClose();
    }, 400);
  };

  const handleSaveDate = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateDate(task.id, editedDate);
      onClose();
    }, 400);
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDeleteTask?.(task.id);
      onClose();
    }, 400);
  };

  // ===== CONTENT =====
  const content = (
    <>
      <style>{detailCSS}</style>

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
              Zurück
            </span>
          </button>
        </div>
      </div>
      )}

      {/* Scrollable Content */}
      <div
        className={`flex-1 ${isMobile ? 'overflow-y-auto px-4 pb-[120px] scrollbar-hide' : ''}`}
        style={isMobile ? { WebkitOverflowScrolling: 'touch' } as React.CSSProperties : undefined}
      >
        {/* Title + Type Badge */}
        <div className={`${isMobile ? 'mb-6' : 'mb-8'}`} style={{ animation: 'detailFadeIn 0.2s ease-out' }}>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-[42px] h-[42px] rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${accentColor}18` }}
            >
              {isExam 
                ? <ClipboardList className="w-5 h-5" style={{ color: accentColorLight }} />
                : <FlagIcon className="w-5 h-5" style={{ color: accentColorLight }} />
              }
            </div>
            <div className="min-w-0">
              <h1 className={`font-['Poppins:Bold',sans-serif] text-white tracking-[-0.3px] ${isMobile ? 'text-[20px]' : 'text-[24px]'}`}>
                {task.subject}
              </h1>
              <span 
                className="font-['Poppins:Medium',sans-serif] text-[12px]"
                style={{ color: accentColorLight }}
              >
                {isExam ? 'Klassenarbeit' : 'Lernziel'}
              </span>
            </div>
          </div>
        </div>

        {/* Detail Card */}
        <div 
          className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden"
          style={{ animation: 'detailFadeIn 0.25s ease-out' }}
        >
          <div className={`${isMobile ? 'px-4' : 'px-5'}`}>
            {/* Fach */}
            <InfoRow 
              label="Fach" 
              value={task.subject}
              icon={<GraduationCap className="w-4 h-4" />}
            />
            <div className="h-px bg-white/[0.06] ml-[30px]" />

            {/* Typ */}
            <InfoRow 
              label="Typ" 
              value={isExam ? 'Klassenarbeit' : 'Lernziel'}
              icon={isExam ? <ClipboardList className="w-4 h-4" /> : <FlagIcon className="w-4 h-4" />}
              accentColor={accentColorLight}
            />
            <div className="h-px bg-white/[0.06] ml-[30px]" />

            {/* Thema / Kategorien */}
            {isExam && task.topicIds && task.topicIds.length > 0 ? (
              <div className="flex items-center justify-between gap-4 py-3.5 relative">
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="w-[18px] flex items-center justify-center text-white/25">
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">
                    Themen
                  </span>
                </div>
                <button
                  onClick={() => setShowTopicViewer(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 bg-white/[0.04] border border-white/[0.06] ${isMobile ? 'active:bg-white/[0.08]' : 'hover:bg-white/[0.08]'}`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/85 whitespace-nowrap">
                    {task.categoryAndTopic}
                  </span>
                  <Eye className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                </button>
              </div>
            ) : (
              <InfoRow 
                label={isExam ? 'Themen' : 'Thema'} 
                value={task.categoryAndTopic}
                icon={<Target className="w-4 h-4" />}
              />
            )}
            <div className="h-px bg-white/[0.06] ml-[30px]" />

            {/* Datum */}
            <div className="flex items-center justify-between gap-4 py-3.5">
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div className="w-[18px] flex items-center justify-center text-white/25">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">
                  Datum
                </span>
              </div>
              {isExam && !task.completed ? (
                <CalendarTrigger
                  value={parseDDMMYYYY(editedDate)}
                  placeholder="Datum wählen"
                  onClick={() => setShowDateCalendar(true)}
                  changed={hasDateChanged}
                  className={`px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[14px] outline-none transition-all duration-200 ${
                    hasDateChanged ? 'bg-[#D4A044]/10 border border-[#D4A044]/20 text-[#E8B960]' : 'bg-white/[0.04] border border-white/[0.06] text-white/85'
                  }`}
                />
              ) : (
                <span className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/85">
                  {task.dueDate}
                </span>
              )}
            </div>

            {/* Dauer (only for completed Lernziele with createdAt) */}
            {!isExam && task.completed && task.createdAt && (() => {
              const startParts = task.createdAt!.split('.');
              const endParts = task.dueDate.split('.');
              if (startParts.length === 3 && endParts.length === 3) {
                const startDate = new Date(parseInt(startParts[2]), parseInt(startParts[1]) - 1, parseInt(startParts[0]));
                const endDate = new Date(parseInt(endParts[2]), parseInt(endParts[1]) - 1, parseInt(endParts[0]));
                const diffDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                if (diffDays > 0) {
                  return (
                    <>
                      <div className="h-px bg-white/[0.06] ml-[30px]" />
                      <InfoRow 
                        label="Dauer" 
                        value={`${diffDays} ${diffDays === 1 ? 'Tag' : 'Tage'}`}
                        icon={<Clock className="w-4 h-4" />}
                      />
                    </>
                  );
                }
              }
              return null;
            })()}

            {/* Goal Description (if exists) */}
            {task.goalDescription && (
              <>
                <div className="h-px bg-white/[0.06] ml-[30px]" />
                <div className="py-3.5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-[18px] flex items-center justify-center text-white/25">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h12" />
                      </svg>
                    </div>
                    <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">
                      Zielbeschreibung
                    </span>
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/60 leading-[1.6] ml-[30px] break-words">
                    {task.goalDescription}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status Info */}
        {task.completed && (
          <div 
            className="mt-4 rounded-xl bg-[#4ADE80]/10 border border-[#4ADE80]/15 px-4 py-3 flex items-center gap-2.5"
            style={{ animation: 'detailFadeIn 0.3s ease-out' }}
          >
            <CheckCircle2 className="w-4 h-4 text-[#4ADE80] flex-shrink-0" />
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-[#4ADE80]">
              {isExam ? 'Klassenarbeit erledigt' : 'Lernziel erreicht'}
            </span>
          </div>
        )}

        {/* Grade Section (only for completed Klassenarbeiten) */}
        {isExam && task.completed && onUpdateGrade && (
          <div className="mt-4" style={{ animation: 'detailFadeIn 0.35s ease-out' }}>
            {task.grade && !showGradeInput ? (
              /* Grade Display – compact, read-only (no editing once saved) */
              <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
                <div className={`${isMobile ? 'px-4' : 'px-5'} py-2.5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-[18px] flex items-center justify-center text-white/25">
                        <Star className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">
                        Note
                      </span>
                    </div>
                    <div 
                      className="flex items-center px-2.5 py-1 rounded-lg"
                      style={{ 
                        backgroundColor: gradeColors[task.grade.replace(/[+-]/, '')]?.bg || 'rgba(255,255,255,0.06)',
                        border: `1px solid ${gradeColors[task.grade.replace(/[+-]/, '')]?.border || 'rgba(255,255,255,0.12)'}`
                      }}
                    >
                      <span 
                        className="font-['Poppins:Bold',sans-serif] text-[14px] tracking-[-0.3px]"
                        style={{ color: gradeColors[task.grade.replace(/[+-]/, '')]?.text || 'white' }}
                      >
                        {task.grade}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : !task.grade && !showGradeInput ? (
              /* Grade Entry CTA */
              <button
                onClick={() => setShowGradeInput(true)}
                className={`w-full rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden transition-all duration-200 ${isMobile ? 'active:from-white/[0.06]' : 'hover:from-white/[0.06]'}`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className={`${isMobile ? 'px-4' : 'px-5'} py-4 flex items-center gap-3`}>
                  <div 
                    className="w-[38px] h-[38px] rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(212, 160, 68, 0.12)' }}
                  >
                    <Star className="w-4 h-4 text-[#E8B960]" />
                  </div>
                  <div className="text-left">
                    <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/80">
                      Note eintragen
                    </p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 mt-0.5">
                      Trage deine erhaltene Note ein
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 ml-auto flex-shrink-0" />
                </div>
              </button>
            ) : showGradeInput ? (
              /* Grade Picker */
              <div 
                className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden"
                style={{ animation: 'detailFadeIn 0.15s ease-out' }}
              >
                <div className={`${isMobile ? 'px-4' : 'px-5'} py-4`}>
                  <div className="flex items-center gap-2.5 mb-4">
                    <Star className="w-4 h-4 text-[#E8B960]" />
                    <span className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                      Note auswählen
                    </span>
                  </div>

                  {/* Grade Buttons 1-6 */}
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {['1', '2', '3', '4', '5', '6'].map(g => {
                      const isActive = selectedGrade === g;
                      const colors = gradeColors[g];
                      return (
                        <button
                          key={g}
                          onClick={() => {
                            if (isActive) {
                              setSelectedGrade('');
                            } else {
                              setSelectedGrade(g);
                              if (g === '6') setSelectedModifier('');
                            }
                          }}
                          className="relative flex items-center justify-center h-[44px] rounded-xl transition-all duration-150 active:scale-95"
                          style={{
                            backgroundColor: isActive ? colors.bg : 'rgba(255,255,255,0.04)',
                            border: `1.5px solid ${isActive ? colors.border : 'rgba(255,255,255,0.06)'}`,
                            WebkitTapHighlightColor: 'transparent',
                          }}
                        >
                          <span 
                            className="font-['Poppins:Bold',sans-serif] text-[16px]"
                            style={{ color: isActive ? colors.text : 'rgba(255,255,255,0.35)' }}
                          >
                            {g}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Modifier +/- */}
                  {selectedGrade && selectedGrade !== '6' && (
                    <div className="flex items-center gap-2 mb-4" style={{ animation: 'detailFadeIn 0.12s ease-out' }}>
                      <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/30 mr-1">
                        Tendenz:
                      </span>
                      {(['+', '', '-'] as const).map(mod => {
                        const isActive = selectedModifier === mod;
                        const label = mod === '+' ? `${selectedGrade}+` : mod === '-' ? `${selectedGrade}-` : `${selectedGrade}`;
                        return (
                          <button
                            key={mod || 'none'}
                            onClick={() => setSelectedModifier(mod)}
                            className="flex items-center justify-center px-3.5 py-[6px] rounded-lg transition-all duration-150 active:scale-95"
                            style={{
                              backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                              WebkitTapHighlightColor: 'transparent',
                            }}
                          >
                            <span className={`font-['Poppins:Medium',sans-serif] text-[13px] ${isActive ? 'text-white/80' : 'text-white/30'}`}>
                              {label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Save / Cancel */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleSaveGrade}
                      disabled={!composedGrade || isSavingGrade}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-200 active:scale-[0.97] ${
                        composedGrade && !isSavingGrade
                          ? 'bg-white/[0.06] border border-white/[0.12] cursor-pointer'
                          : 'bg-white/[0.03] border border-white/[0.06] cursor-not-allowed opacity-40'
                      }`}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {isSavingGrade ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white">
                          Speichern
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowGradeInput(false);
                        // Reset to saved values
                        if (task.grade) {
                          const base = task.grade.replace(/[+-]/, '');
                          const mod = task.grade.endsWith('+') ? '+' : task.grade.endsWith('-') ? '-' : '';
                          setSelectedGrade(base);
                          setSelectedModifier(mod as '+' | '' | '-');
                        } else {
                          setSelectedGrade('');
                          setSelectedModifier('');
                        }
                      }}
                      className={`px-4 py-2 rounded-xl font-['Poppins:Medium',sans-serif] text-[12px] text-white/40 transition-all duration-200 ${isMobile ? 'active:bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Hint for editable date */}
        {isExam && !task.completed && (
          <div 
            className="mt-4 rounded-xl bg-white/[0.02] border border-white/[0.04] px-4 py-3 flex items-start gap-2.5"
            style={{ animation: 'detailFadeIn 0.35s ease-out' }}
          >
            <Calendar className="w-3.5 h-3.5 text-white/20 flex-shrink-0 mt-0.5" />
            <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 leading-[1.5]">
              Falls sich der Klausurtermin verschoben hat, kannst du das Datum oben direkt anpassen.
            </span>
          </div>
        )}

        {/* Delete Task Button */}
        {onDeleteTask && (
          <div className="mt-6" style={{ animation: 'detailFadeIn 0.4s ease-out' }}>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${isMobile ? 'active:bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Trash2 className="w-3.5 h-3.5 text-[#FF453A]/60" />
                <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#FF453A]/60">
                  {task.completed ? 'Eintrag entfernen' : 'Aufgabe löschen'}
                </span>
              </button>
            ) : (
              <div className="rounded-xl bg-[#FF453A]/[0.06] border border-[#FF453A]/[0.10] px-4 py-3.5" style={{ animation: 'detailFadeIn 0.15s ease-out' }}>
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/60 mb-3">
                  {task.completed ? 'Eintrag unwiderruflich entfernen?' : 'Aufgabe unwiderruflich löschen?'}
                </p>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF453A]/15 border border-[#FF453A]/20 transition-all duration-200 active:scale-[0.97]"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-[#FF453A]/30 border-t-[#FF453A] rounded-full animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5 text-[#FF453A]" />
                        <span className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#FF453A]">
                          Löschen
                        </span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className={`px-4 py-2 rounded-xl font-['Poppins:Medium',sans-serif] text-[12px] text-white/40 transition-all duration-200 ${isMobile ? 'active:bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      {!task.completed && (
        <div className={`flex-shrink-0 ${isMobile ? 'fixed bottom-0 left-0 right-0 px-4 pb-safe pt-3 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent' : 'mt-6'}`}
          style={isMobile ? { paddingBottom: 'max(env(safe-area-inset-bottom), 24px)' } : undefined}
        >
          {isExam ? (
            <Button
              onClick={handleSaveDate}
              disabled={!hasDateChanged || isSaving}
              size="md"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Änderung speichern'
              )}
            </Button>
          ) : (
            <Button
              onClick={handleMarkAchieved}
              disabled={isMarking}
              size="md"
            >
              {isMarking ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  Als erreicht markieren
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Topic Viewer Modal */}
      {showTopicViewer && task.topicIds && task.topicIds.length > 0 && (
        <TopicViewerModal
          subjectName={task.subject}
          topicIds={task.topicIds}
          onClose={() => setShowTopicViewer(false)}
          isMobile={isMobile}
        />
      )}

      {/* Upload Prompt Popup */}
      {showUploadPrompt && onRequestUpload && (
        <>
          <div className="fixed inset-0 z-[210] bg-black/50" onClick={() => setShowUploadPrompt(false)} />
          <div
            className={`fixed z-[211] ${
              isMobile
                ? 'inset-x-5 top-1/2 -translate-y-1/2'
                : 'inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-full max-w-[380px]'
            }`}
            style={{ animation: 'calendarFadeIn 0.2s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#141414] border border-white/[0.12] rounded-2xl overflow-hidden p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-[42px] h-[42px] rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(212, 160, 68, 0.12)' }}
                >
                  <ClipboardList className="w-5 h-5 text-[#E8B960]" />
                </div>
                <div>
                  <h3 className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">
                    Klassenarbeit hochladen?
                  </h3>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 mt-0.5">
                    {task.subject} &middot; Note {savedGradeForUpload}
                  </p>
                </div>
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/50 leading-[1.6] mb-6">
                Lade deine Klassenarbeit jetzt hoch, damit sie analysiert und ausgewertet werden kann.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowUploadPrompt(false);
                    onRequestUpload(task.id, task.subject, savedGradeForUpload);
                  }}
                  className={`flex-1 h-[44px] rounded-xl flex items-center justify-center gap-2 bg-white/[0.08] border border-white/[0.15] transition-all duration-150 ${isMobile ? 'active:scale-[0.97] active:bg-white/[0.12]' : 'hover:bg-white/[0.12]'}`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">
                    Ja, hochladen
                  </span>
                </button>
                <button
                  onClick={() => setShowUploadPrompt(false)}
                  className={`flex-1 h-[44px] rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] transition-all duration-150 ${isMobile ? 'active:scale-[0.97] active:bg-white/[0.06]' : 'hover:bg-white/[0.06]'}`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">
                    Nein, danke
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Premium Calendar Picker */}
      <PremiumCalendarPicker
        mode="single"
        isOpen={showDateCalendar}
        onClose={() => setShowDateCalendar(false)}
        title="Klassenarbeit-Datum ändern"
        value={parseDDMMYYYY(editedDate)}
        onSelect={(date) => setEditedDate(formatToDisplay(date))}
      />
    </>
  );

  // ===== MOBILE LAYOUT =====
  if (isMobile) {
    return (
      <div className={`slide-screen ${slideAnimationClass} flex flex-col`}>
        {content}
      </div>
    );
  }

  // ===== DESKTOP LAYOUT =====
  // DesktopPageHeader provides standardized back button baseline.
  // No title here — content body has the detailed title + type badge.
  // No narrow max-w — content fills DCW standard width (1200px) like all other screens.
  // No screen-level px, py, h-full, overflow — DCW is the layout authority.
  return (
    <>
      <DesktopPageHeader
        onBack={onClose}
        backLabel="Zurück"
      />
      <div className="pb-8">
        {content}
      </div>
    </>
  );
}