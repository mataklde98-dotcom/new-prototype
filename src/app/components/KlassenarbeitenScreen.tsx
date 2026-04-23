// ===== KLASSENARBEITEN SCREEN =====
// Upload & Management von Klassenarbeiten pro Fach
// Premium SaaS Style (Linear/Vercel) — Sticky Tab Bar

import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ChevronLeft, ChevronRight, Upload, FileText, Image, Plus, Calendar, Star, BarChart3, X, Trash2, MessageSquare, Download } from 'lucide-react';


import DesktopPageHeader from '@/app/components/DesktopPageHeader';
import PremiumCalendarPicker, { RangeCalendarTrigger } from './PremiumCalendarPicker';
import './SlideTransition.css';
import { consumePendingUploadRequest } from '@/stores/uploadRequestStore';
import { PDFDocument } from 'pdf-lib';
import Button from '@/app/components/Button';
import KlassenarbeitenTutorial, { hasSeenKlassenarbeitenTutorial } from '@/app/components/KlassenarbeitenTutorial';

// ===== TYPES =====
interface UploadedExam {
  id: string;
  subject: string;
  title: string;
  message?: string;
  grade: string;
  uploadDate: string; // DD.MM.YYYY
  fileType: 'pdf' | 'images';
  fileCount: number;
  fileName: string;
  linkedTaskId?: string; // Verknüpfung zur erledigten Klassenarbeit-Aufgabe
  files?: File[]; // Original uploaded files for PDF generation
}

interface KlassenarbeitenScreenProps {
  onClose: () => void;
  isMobile?: boolean;
  isClosing?: boolean;
  externalTransition?: boolean;
}

// ===== CONSTANTS =====
const ALL_SUBJECTS = ['Mathematik', 'Deutsch', 'Französisch', 'Geschichte', 'Biologie', 'Informatik', 'Politik & GK', 'Physik', 'Englisch'];

const SUBJECT_ICONS: Record<string, string> = {
  'Mathematik': '📐',
  'Deutsch': '📖',
  'Französisch': '🇫🇷',
  'Geschichte': '🏛️',
  'Biologie': '🧬',
  'Informatik': '💻',
  'Politik & GK': '⚖️',
  'Physik': '⚛️',
  'Englisch': '🇬🇧',
};

const GRADE_COLORS: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  '1': { bg: 'rgba(74, 222, 128, 0.12)', border: 'rgba(74, 222, 128, 0.25)', text: '#4ADE80', bar: '#4ADE80' },
  '2': { bg: 'rgba(96, 200, 120, 0.12)', border: 'rgba(96, 200, 120, 0.25)', text: '#60C878', bar: '#60C878' },
  '3': { bg: 'rgba(232, 185, 96, 0.12)', border: 'rgba(232, 185, 96, 0.25)', text: '#E8B960', bar: '#E8B960' },
  '4': { bg: 'rgba(245, 158, 66, 0.12)', border: 'rgba(245, 158, 66, 0.25)', text: '#F59E42', bar: '#F59E42' },
  '5': { bg: 'rgba(255, 120, 80, 0.12)', border: 'rgba(255, 120, 80, 0.25)', text: '#FF7850', bar: '#FF7850' },
  '6': { bg: 'rgba(255, 69, 58, 0.12)', border: 'rgba(255, 69, 58, 0.25)', text: '#FF453A', bar: '#FF453A' },
};

// ===== MOCK DATA =====
const INITIAL_EXAMS: UploadedExam[] = [
  { id: '1', subject: 'Mathematik', title: 'Analysis Klausur Q1', message: 'Differentialrechnung und Integrale', grade: '2+', uploadDate: '15.11.2024', fileType: 'pdf', fileCount: 1, fileName: 'a7k3m1.pdf' },
  { id: '2', subject: 'Mathematik', title: 'Stochastik Klausur', grade: '1-', uploadDate: '20.12.2024', fileType: 'images', fileCount: 4, fileName: 'x9p2w4.pdf' },
  { id: '3', subject: 'Mathematik', title: 'Vektorrechnung', grade: '3', uploadDate: '10.01.2025', fileType: 'pdf', fileCount: 1, fileName: 'b5n8r6.pdf' },
  { id: '4', subject: 'Mathematik', title: 'Geometrie Grundlagen', grade: '2', uploadDate: '28.01.2025', fileType: 'images', fileCount: 3, fileName: 'q3t7v2.pdf' },
  { id: '5', subject: 'Mathematik', title: 'Lineare Algebra', grade: '1', uploadDate: '14.02.2025', fileType: 'pdf', fileCount: 1, fileName: 'h1j6c9.pdf' },
  { id: '6', subject: 'Deutsch', title: 'Dramenanalyse Faust', message: 'Szenenanalyse Studierzimmer', grade: '2-', uploadDate: '22.11.2024', fileType: 'pdf', fileCount: 1, fileName: 'f4d8e3.pdf' },
  { id: '7', subject: 'Deutsch', title: 'Erörterung Medien', grade: '3+', uploadDate: '18.01.2025', fileType: 'images', fileCount: 5, fileName: 'y2g5l7.pdf' },
  { id: '8', subject: 'Physik', title: 'Mechanik & Thermodynamik', grade: '2+', uploadDate: '05.12.2024', fileType: 'pdf', fileCount: 1, fileName: 'u6s1w8.pdf' },
  { id: '9', subject: 'Englisch', title: 'Shakespeare Analysis', message: 'Hamlet Act 3 Scene 1', grade: '1', uploadDate: '10.12.2024', fileType: 'pdf', fileCount: 1, fileName: 'z4m9k5.pdf' },
  { id: '10', subject: 'Geschichte', title: 'Weimarer Republik', grade: '2', uploadDate: '15.01.2025', fileType: 'images', fileCount: 6, fileName: 'r8e2p0.pdf' },
];

// Module-level persistent store
let persistedExams: UploadedExam[] | null = null;

// ===== CSS =====
const screenCSS = `
@keyframes kaFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes kaSlideIn {
  from { opacity: 0; transform: translateX(12px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes kaSlideBack {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes kaOverviewFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.ka-scroll-hide::-webkit-scrollbar { display: none; }
`;

// ===== HELPER =====
function generateShortFileName(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return `${result}.pdf`;
}

function parseDDMMYYYY(dateStr: string): Date {
  const parts = dateStr.split('.');
  return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
}

function formatToDisplay(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

function getBaseGrade(grade: string): string {
  return grade.replace(/[+-]/, '');
}

function formatYYYYMMDDToDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
}



function calculateAverage(exams: UploadedExam[]): number {
  if (exams.length === 0) return 0;
  const gradeValues: Record<string, number> = {
    '1+': 0.7, '1': 1.0, '1-': 1.3,
    '2+': 1.7, '2': 2.0, '2-': 2.3,
    '3+': 2.7, '3': 3.0, '3-': 3.3,
    '4+': 3.7, '4': 4.0, '4-': 4.3,
    '5+': 4.7, '5': 5.0, '5-': 5.3,
    '6': 6.0,
  };
  const sum = exams.reduce((acc, e) => acc + (gradeValues[e.grade] || 3.0), 0);
  return Math.round((sum / exams.length) * 10) / 10;
}

// ===== MAIN COMPONENT =====
export default function KlassenarbeitenScreen({ onClose, isMobile = false, isClosing = false, externalTransition = false }: KlassenarbeitenScreenProps) {
  // Animation state
  const [animationState, setAnimationState] = useState<'entering' | 'active' | 'exiting'>('entering');
  useEffect(() => {
    const timer = setTimeout(() => setAnimationState('active'), 300);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (isClosing) setAnimationState('exiting');
  }, [isClosing]);

  // Data
  const [exams, setExams] = useState<UploadedExam[]>(() => persistedExams || INITIAL_EXAMS);
  useEffect(() => { persistedExams = exams; }, [exams]);

  // Navigation
  type View = 'overview' | 'upload' | 'stats' | 'detail';
  const [currentView, setCurrentView] = useState<View>('overview');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<UploadedExam | null>(null);
  const [navDirection, setNavDirection] = useState<'forward' | 'back'>('forward');

  // Overview tab: 'list' (Fächer) or 'allStats' (Gesamtstatistik)
  const [overviewTab, setOverviewTab] = useState<'list' | 'allStats'>('list');
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const swipeLockedRef = useRef<'horizontal' | 'vertical' | null>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // Touch swipe handlers for tab switching
  const handleTabTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    swipeLockedRef.current = null;
    setIsSwiping(false);
  };

  const handleTabTouchMove = (e: React.TouchEvent) => {
    if (!swipeStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - swipeStartRef.current.x;
    const dy = touch.clientY - swipeStartRef.current.y;

    // Lock axis after 10px movement
    if (swipeLockedRef.current === null && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      swipeLockedRef.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
    }

    if (swipeLockedRef.current === 'horizontal') {
      setIsSwiping(true);
      let clampedDx = dx;
      // Rubber-band at edges (can't swipe right on list, can't swipe left on stats)
      if (overviewTab === 'list' && dx > 0) {
        clampedDx = dx * 0.2; // rubber-band
      } else if (overviewTab === 'allStats' && dx < 0) {
        clampedDx = dx * 0.2; // rubber-band
      }
      setSwipeOffset(clampedDx);
    }
  };

  const handleTabTouchEnd = () => {
    if (!swipeStartRef.current || swipeLockedRef.current !== 'horizontal') {
      swipeStartRef.current = null;
      swipeLockedRef.current = null;
      setIsSwiping(false);
      setSwipeOffset(0);
      return;
    }

    const threshold = 50;
    const velocityThreshold = 0.3;
    const elapsed = Date.now() - swipeStartRef.current.time;
    const velocity = Math.abs(swipeOffset) / elapsed;
    const shouldSwitch = Math.abs(swipeOffset) > threshold || velocity > velocityThreshold;

    if (shouldSwitch) {
      if (overviewTab === 'list' && swipeOffset < 0) {
        setOverviewTab('allStats');
      } else if (overviewTab === 'allStats' && swipeOffset > 0) {
        setOverviewTab('list');
      }
    }

    setSwipeOffset(0);
    setIsSwiping(false);
    swipeStartRef.current = null;
    swipeLockedRef.current = null;
  };

  // Upload form state
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadGrade, setUploadGrade] = useState('');
  const [uploadModifier, setUploadModifier] = useState<'+' | '' | '-'>('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadLinkedTaskId, setUploadLinkedTaskId] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for pending upload request from TodoManagement (prefill data)
  useEffect(() => {
    const req = consumePendingUploadRequest();
    if (req) {
      // Parse grade into base + modifier
      const base = req.grade.replace(/[+-]/, '');
      const mod = req.grade.endsWith('+') ? '+' : req.grade.endsWith('-') ? '-' : '';
      setUploadSubject(req.subject);
      setUploadGrade(base);
      setUploadModifier(mod as '+' | '' | '-');
      setUploadLinkedTaskId(req.linkedTaskId);
      setUploadTitle('');
      setUploadMessage('');
      setUploadFiles([]);
      setNavDirection('forward');
      setCurrentView('upload');
    }
  }, []);

  // Stats date filter (per-subject stats view) — stored as YYYY-MM-DD
  const [statsFrom, setStatsFrom] = useState('');
  const [statsTo, setStatsTo] = useState('');

  // Overview stats date filter
  const [overviewDateFrom, setOverviewDateFrom] = useState('');
  const [overviewDateTo, setOverviewDateTo] = useState('');
  const [showOverviewCalendar, setShowOverviewCalendar] = useState(false);
  const [showStatsCalendar, setShowStatsCalendar] = useState(false);

  // Chart tooltip state for mobile tap-to-dismiss
  const [chartActiveIndex, setChartActiveIndex] = useState<number | undefined>(undefined);
  const chartRef = useRef<HTMLDivElement>(null);

  // Dismiss chart tooltip when clicking outside the chart container
  useEffect(() => {
    if (!isMobile || chartActiveIndex === undefined) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (chartRef.current && !chartRef.current.contains(e.target as Node)) {
        setChartActiveIndex(undefined);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isMobile, chartActiveIndex]);

  // Tutorial (first-time only)
  const [showTutorial, setShowTutorial] = useState(() => !hasSeenKlassenarbeitenTutorial());

  // Delete confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const composedGrade = uploadGrade ? `${uploadGrade}${uploadModifier}` : '';

  // Navigation helpers
  const goToSubject = (subject: string) => {
    setNavDirection('forward');
    setSelectedSubject(subject);
    setStatsFrom('');
    setStatsTo('');
    setCurrentView('stats');
  };

  const goToUpload = (subject?: string) => {
    setNavDirection('forward');
    if (subject) setUploadSubject(subject);
    setUploadTitle('');
    setUploadMessage('');
    setUploadGrade('');
    setUploadModifier('');
    setUploadFiles([]);
    setUploadLinkedTaskId(undefined);
    setCurrentView('upload');
  };

  const goToDetail = (exam: UploadedExam) => {
    setNavDirection('forward');
    setSelectedExam(exam);
    setCurrentView('detail');
  };

  const goBack = () => {
    setNavDirection('back');
    if (currentView === 'detail') {
      setCurrentView('stats');
      setSelectedExam(null);
    } else if (currentView === 'stats') {
      setCurrentView('overview');
      setSelectedSubject('');
    } else if (currentView === 'upload') {
      setCurrentView(selectedSubject ? 'stats' : 'overview');
    } else {
      onClose();
    }
  };

  // Subject counts
  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_SUBJECTS.forEach(s => { counts[s] = 0; });
    exams.forEach(e => { counts[e.subject] = (counts[e.subject] || 0) + 1; });
    return counts;
  }, [exams]);

  // Subject exams
  const subjectExams = useMemo(() => {
    return exams
      .filter(e => e.subject === selectedSubject)
      .sort((a, b) => parseDDMMYYYY(b.uploadDate).getTime() - parseDDMMYYYY(a.uploadDate).getTime());
  }, [exams, selectedSubject]);

  // Stats data
  const statsExams = useMemo(() => {
    let filtered = exams.filter(e => e.subject === selectedSubject);
    if (statsFrom) {
      const fromDate = new Date(statsFrom + 'T00:00:00');
      filtered = filtered.filter(e => parseDDMMYYYY(e.uploadDate) >= fromDate);
    }
    if (statsTo) {
      const toDate = new Date(statsTo + 'T23:59:59');
      filtered = filtered.filter(e => parseDDMMYYYY(e.uploadDate) <= toDate);
    }
    return filtered;
  }, [exams, selectedSubject, statsFrom, statsTo]);

  const statsChartData = useMemo(() => {
    const counts: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 };
    statsExams.forEach(e => {
      const base = getBaseGrade(e.grade);
      if (counts[base] !== undefined) counts[base]++;
    });
    return Object.entries(counts).map(([grade, count]) => ({
      grade: `Note ${grade}`,
      count,
      gradeNum: grade,
    }));
  }, [statsExams]);

  // Upload handler
  const handleUpload = () => {
    if (!uploadSubject || !uploadTitle || !composedGrade || uploadFiles.length === 0) return;
    setIsUploading(true);
    setTimeout(() => {
      const isSinglePdf = uploadFiles.length === 1 && uploadFiles[0].type === 'application/pdf';
      const newExam: UploadedExam = {
        id: `upload-${Date.now()}`,
        subject: uploadSubject,
        title: uploadTitle,
        message: uploadMessage || undefined,
        grade: composedGrade,
        uploadDate: formatToDisplay(new Date()),
        fileType: isSinglePdf ? 'pdf' : 'images',
        fileCount: isSinglePdf ? 1 : uploadFiles.length,
        fileName: generateShortFileName(),
        linkedTaskId: uploadLinkedTaskId,
        files: [...uploadFiles], // Store file references for PDF generation
      };
      setExams(prev => [newExam, ...prev]);
      setIsUploading(false);
      setSelectedSubject(uploadSubject);
      setNavDirection('back');
      setCurrentView('stats');
    }, 800);
  };

  // Delete handler
  const handleDelete = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    setDeleteConfirmId(null);
    if (currentView === 'detail') {
      setNavDirection('back');
      setCurrentView('stats');
    }
  };

  // File handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Filtered exams for overview stats (date range)
  const overviewFilteredExams = useMemo(() => {
    if (!overviewDateFrom && !overviewDateTo) return exams;
    return exams.filter(e => {
      const d = parseDDMMYYYY(e.uploadDate).getTime();
      if (overviewDateFrom) {
        const from = new Date(overviewDateFrom).getTime();
        if (d < from) return false;
      }
      if (overviewDateTo) {
        const to = new Date(overviewDateTo);
        to.setHours(23, 59, 59, 999);
        if (d > to.getTime()) return false;
      }
      return true;
    });
  }, [exams, overviewDateFrom, overviewDateTo]);

  // Per-subject detailed stats for all-stats view
  const perSubjectStats = useMemo(() => {
    return ALL_SUBJECTS
      .map(subject => {
        const subExams = overviewFilteredExams.filter(e => e.subject === subject);
        const gradeCounts: Record<string, number> = {};
        subExams.forEach(e => {
          const base = getBaseGrade(e.grade);
          gradeCounts[base] = (gradeCounts[base] || 0) + 1;
        });
        return {
          subject,
          count: subExams.length,
          average: subExams.length > 0 ? calculateAverage(subExams) : null,
          gradeCounts,
        };
      })
      .filter(s => s.count > 0)
      .sort((a, b) => (a.average || 99) - (b.average || 99));
  }, [overviewFilteredExams]);

  // Animation class for screen navigation (overview ↔ stats ↔ detail ↔ upload)
  const animClass = navDirection === 'forward' ? 'kaSlideIn' : 'kaSlideBack';

  // Detect return-to-overview synchronously during render (no useEffect = no double render)
  const prevViewForOverview = useRef<View>('overview');
  const isReturningToOverview = currentView === 'overview' && prevViewForOverview.current !== 'overview';
  if (currentView !== prevViewForOverview.current) {
    prevViewForOverview.current = currentView;
  }

  // ===== RENDER VIEWS =====

  // --- Subject Overview with Tabs ---
  const renderOverview = () => (
    <div style={isReturningToOverview ? { animation: 'kaOverviewFadeIn 0.2s ease-out' } : undefined}>
      {/* Swipeable tab content */}
      <div 
        className="overflow-hidden"
        style={{ touchAction: 'pan-y', clipPath: 'inset(0px)' }}
        onTouchStart={isMobile ? handleTabTouchStart : undefined}
        onTouchMove={isMobile ? handleTabTouchMove : undefined}
        onTouchEnd={isMobile ? handleTabTouchEnd : undefined}
      >
        <div
          ref={tabContainerRef}
          className="flex"
          style={{
            width: '200%',
            transform: `translateX(calc(${overviewTab === 'list' ? '0%' : '-50%'} + ${swipeOffset}px))`,
            transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
            willChange: 'transform',
          }}
        >
          {/* Panel 1: Subject List */}
          <div className="w-1/2 flex-shrink-0 overflow-hidden">
            <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
          {ALL_SUBJECTS.map((subject, index) => {
            const count = subjectCounts[subject];
            return (
              <button
                key={subject}
                onClick={() => goToSubject(subject)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 transition-colors duration-150 relative ${isMobile ? 'active:bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span className="text-[20px] flex-shrink-0 w-[28px] text-center">{SUBJECT_ICONS[subject] || '📚'}</span>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-['Poppins:Medium',sans-serif] text-[15px] text-white">{subject}</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/30 mt-0.5">
                    {count === 0 ? 'Keine Klassenarbeiten' : `${count} ${count === 1 ? 'Klassenarbeit' : 'Klassenarbeiten'}`}
                  </p>
                </div>
                {count > 0 && (
                  <span className="font-['Poppins:Bold',sans-serif] text-[14px] text-white/50 mr-1">{count}</span>
                )}
                <ChevronRight className="w-[16px] h-[16px] text-white/20 flex-shrink-0" />
                {index < ALL_SUBJECTS.length - 1 && (
                  <div className="absolute bottom-0 left-[60px] right-0 h-px bg-white/[0.06]" />
                )}
              </button>
            );
          })}
            </div>
          </div>
          {/* Panel 2: All-Subjects Statistics */}
          <div className="w-1/2 flex-shrink-0 overflow-hidden pl-[3px]">
          {/* Date range filter */}
          <div className="mb-4">
            <RangeCalendarTrigger
              from={overviewDateFrom}
              to={overviewDateTo}
              onClick={() => setShowOverviewCalendar(true)}
              onClear={() => { setOverviewDateFrom(''); setOverviewDateTo(''); }}
              isMobile={isMobile}
            />
          </div>

          {/* Summary cards */}
          <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden mb-4">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">Gesamt Klassenarbeiten</span>
                <span className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">{overviewFilteredExams.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">Durchschnitt</span>
                <span className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">
                  {overviewFilteredExams.length > 0 ? calculateAverage(overviewFilteredExams).toFixed(1) : '–'}
                </span>
              </div>
            </div>
          </div>

          {/* Per-subject breakdown with grade pills */}
          {perSubjectStats.length > 0 && (
            <>
              <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40 mb-3">Notenübersicht pro Fach</p>
              <div className="space-y-2.5">
                {perSubjectStats.map((item) => {
                  const avgBase = item.average ? String(Math.round(item.average)) : '3';
                  const avgColors = GRADE_COLORS[avgBase] || GRADE_COLORS['3'];
                  // Build unique grade entries with counts, sorted 1-6
                  const uniqueGrades = ['1', '2', '3', '4', '5', '6']
                    .filter(g => (item.gradeCounts[g] || 0) > 0)
                    .map(g => ({ grade: g, count: item.gradeCounts[g] }));

                  return (
                    <button
                      key={item.subject}
                      onClick={() => goToSubject(item.subject)}
                      className={`w-full rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden transition-all duration-150 text-left ${isMobile ? 'active:from-white/[0.06]' : 'hover:from-white/[0.06]'}`}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <div className="px-4 py-3.5">
                        {/* Top row: Subject name + average */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[18px] flex-shrink-0 w-[24px] text-center">{SUBJECT_ICONS[item.subject] || '📚'}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white">{item.subject}</p>
                          </div>
                          <div
                            className="flex items-center px-2 py-0.5 rounded-md flex-shrink-0"
                            style={{ backgroundColor: avgColors.bg, border: `1px solid ${avgColors.border}` }}
                          >
                            <span className="font-['Poppins:Bold',sans-serif] text-[12px]" style={{ color: avgColors.text }}>
                              Ø {item.average?.toFixed(1)}
                            </span>
                          </div>
                          <ChevronRight className="w-[14px] h-[14px] text-white/15 flex-shrink-0" />
                        </div>
                        {/* Grade circles with count badges */}
                        <div className="flex items-center gap-[10px] flex-wrap">
                          {uniqueGrades.map(({ grade, count }) => {
                            const colors = GRADE_COLORS[grade] || GRADE_COLORS['3'];
                            const barColor = colors.bar || colors.text;
                            return (
                              <div key={grade} className="relative">
                                <div
                                  className="flex items-center justify-center w-[30px] h-[30px] rounded-full"
                                  style={{ backgroundColor: `${barColor}18`, border: `1.5px solid ${barColor}45` }}
                                >
                                  <span className="font-['Poppins:Bold',sans-serif] text-[13px]" style={{ color: barColor }}>
                                    {grade}
                                  </span>
                                </div>
                                {count > 1 && (
                                  <div
                                    className="absolute -top-[5px] -right-[5px] flex items-center justify-center w-[16px] h-[16px] rounded-full"
                                    style={{ backgroundColor: barColor }}
                                  >
                                    <span className="font-['Poppins:Bold',sans-serif] text-[9px] text-[#0a0a0a]">
                                      {count}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/20 ml-auto">
                            {item.count} {item.count === 1 ? 'Arbeit' : 'Arbeiten'}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {exams.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <BarChart3 className="w-8 h-8 text-white/15 mb-3" />
              <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/30">Noch keine Daten</p>
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/20 mt-1">Lade Klassenarbeiten hoch um Statistiken zu sehen</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );

  // --- Exam Detail ---
  const renderDetail = () => {
    if (!selectedExam) return null;
    const baseGrade = getBaseGrade(selectedExam.grade);
    const colors = GRADE_COLORS[baseGrade] || GRADE_COLORS['3'];

    return (
      <div key={`detail-${selectedExam.id}`} style={{ animation: `${animClass} 0.2s ease-out` }}>
        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-[42px] h-[42px] rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(212, 160, 68, 0.12)' }}
            >
              {selectedExam.fileType === 'pdf' ? (
                <FileText className="w-5 h-5 text-[#E8B960]" />
              ) : (
                <Image className="w-5 h-5 text-[#E8B960]" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className={`font-['Poppins:Bold',sans-serif] text-white tracking-[-0.3px] break-words ${isMobile ? 'text-[20px]' : 'text-[22px]'}`}>
                {selectedExam.title}
              </h2>
              <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#E8B960]">
                {selectedExam.subject}
              </span>
            </div>
          </div>
        </div>

        {/* Detail Card */}
        <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
          <div className={`${isMobile ? 'px-4' : 'px-5'}`}>
            {/* Fach */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-[18px] flex items-center justify-center text-white/25">
                  <span className="text-[14px]">{SUBJECT_ICONS[selectedExam.subject] || '📚'}</span>
                </div>
                <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">Fach</span>
              </div>
              <span className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/85">{selectedExam.subject}</span>
            </div>
            <div className="h-px bg-white/[0.06] ml-[30px]" />

            {/* Note */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-[18px] flex items-center justify-center text-white/25">
                  <Star className="w-3.5 h-3.5" />
                </div>
                <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">Note</span>
              </div>
              <div
                className="flex items-center px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
              >
                <span className="font-['Poppins:Bold',sans-serif] text-[14px] tracking-[-0.3px]" style={{ color: colors.text }}>
                  {selectedExam.grade}
                </span>
              </div>
            </div>
            <div className="h-px bg-white/[0.06] ml-[30px]" />

            {/* Datum */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-[18px] flex items-center justify-center text-white/25">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">Hochgeladen</span>
              </div>
              <span className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/85">{selectedExam.uploadDate}</span>
            </div>
            <div className="h-px bg-white/[0.06] ml-[30px]" />

            {/* Datei */}
            <button
              onClick={async () => {
                try {
                  let pdfBytes: Uint8Array;

                  if (selectedExam.files && selectedExam.files.length > 0) {
                    const files = selectedExam.files;

                    // Check if single PDF – just download directly
                    if (files.length === 1 && files[0].type === 'application/pdf') {
                      const buf = await files[0].arrayBuffer();
                      pdfBytes = new Uint8Array(buf);
                    } else {
                      // Merge: combine PDFs and images into one PDF
                      const mergedPdf = await PDFDocument.create();

                      for (const file of files) {
                        const buf = await file.arrayBuffer();

                        if (file.type === 'application/pdf') {
                          // Merge existing PDF pages
                          const srcPdf = await PDFDocument.load(buf);
                          const pages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
                          pages.forEach(page => mergedPdf.addPage(page));
                        } else if (file.type === 'image/png') {
                          // Embed PNG
                          const img = await mergedPdf.embedPng(buf);
                          const page = mergedPdf.addPage([img.width, img.height]);
                          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
                        } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                          // Embed JPG
                          const img = await mergedPdf.embedJpg(buf);
                          const page = mergedPdf.addPage([img.width, img.height]);
                          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
                        }
                      }
                      pdfBytes = await mergedPdf.save();
                    }
                  } else {
                    // Mock data without files – generate placeholder PDF
                    const placeholderPdf = await PDFDocument.create();
                    const page = placeholderPdf.addPage([595.28, 841.89]); // A4
                    page.drawText(selectedExam.title, { x: 50, y: 780, size: 24 });
                    page.drawText(`Fach: ${selectedExam.subject}`, { x: 50, y: 740, size: 14 });
                    page.drawText(`Note: ${selectedExam.grade}`, { x: 50, y: 710, size: 14 });
                    page.drawText(`Hochgeladen: ${selectedExam.uploadDate}`, { x: 50, y: 680, size: 14 });
                    if (selectedExam.message) {
                      page.drawText(`Notiz: ${selectedExam.message}`, { x: 50, y: 640, size: 12 });
                    }
                    pdfBytes = await placeholderPdf.save();
                  }

                  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = selectedExam.fileName.endsWith('.pdf')
                    ? selectedExam.fileName
                    : `${selectedExam.fileName}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch (err) {
                  console.error('PDF download error:', err);
                }
              }}
              className={`w-full flex items-center justify-between py-3.5 transition-colors duration-150 ${isMobile ? 'active:bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-[18px] flex items-center justify-center text-white/25">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">Datei</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/85">{selectedExam.fileName}</span>
                <Download className="w-3.5 h-3.5 text-[#56C2D9]/70 flex-shrink-0" />
              </div>
            </button>

            {/* Nachricht */}
            {selectedExam.message && (
              <>
                <div className="h-px bg-white/[0.06] ml-[30px]" />
                <div className="py-3.5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-[18px] flex items-center justify-center text-white/25">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">Notiz</span>
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/60 leading-[1.6] ml-[30px] break-words" style={{ overflowWrap: 'anywhere' }}>
                    {selectedExam.message}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Delete */}
        <div className="mt-6">
          {deleteConfirmId !== selectedExam.id ? (
            <button
              onClick={() => setDeleteConfirmId(selectedExam.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${isMobile ? 'active:bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Trash2 className="w-3.5 h-3.5 text-[#FF453A]/60" />
              <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#FF453A]/60">Klassenarbeit entfernen</span>
            </button>
          ) : (
            <div className="rounded-xl bg-[#FF453A]/[0.06] border border-[#FF453A]/[0.10] px-4 py-3.5" style={{ animation: 'kaFadeIn 0.15s ease-out' }}>
              <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/60 mb-3">Klassenarbeit unwiderruflich entfernen?</p>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleDelete(selectedExam.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF453A]/15 border border-[#FF453A]/20 transition-all duration-200 active:scale-[0.97]"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#FF453A]" />
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#FF453A]">Löschen</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className={`px-4 py-2 rounded-xl font-['Poppins:Medium',sans-serif] text-[12px] text-white/40 transition-all duration-200 ${isMobile ? 'active:bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- Upload Form ---
  const renderUpload = () => (
    <div key="upload" style={{ animation: `${animClass} 0.2s ease-out` }}>
      <div className="space-y-4">
        {/* Linked Task Info Banner */}
        {uploadLinkedTaskId && (
          <div className="rounded-xl bg-[#D4A044]/[0.08] border border-[#D4A044]/[0.15] px-4 py-3 flex items-center gap-2.5">
            <div className="w-[6px] h-[6px] rounded-full bg-[#E8B960] flex-shrink-0" />
            <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#E8B960]/80">
              Verknüpft mit erledigter Klassenarbeit &middot; Fach &amp; Note vorausgefüllt
            </span>
          </div>
        )}
        {/* Subject Selection */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40 mb-2 block">Fach</label>
          <div className="relative">
            <select
              value={uploadSubject}
              onChange={e => setUploadSubject(e.target.value)}
              className="w-full h-[42px] rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 font-['Poppins:Medium',sans-serif] text-[14px] text-white appearance-none cursor-pointer outline-none focus:border-white/[0.15] transition-colors"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <option value="" disabled>Fach auswählen</option>
              {ALL_SUBJECTS.map(s => (
                <option key={s} value={s} className="bg-[#1a1a1a] text-white">{s}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 rotate-90 pointer-events-none" />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40 mb-2 block">Titel</label>
          <div className="relative">
            <input
              type="text"
              value={uploadTitle}
              onChange={e => setUploadTitle(e.target.value)}
              maxLength={40}
              placeholder="z.B. Analysis Klausur Q1"
              className="w-full h-[42px] rounded-xl bg-white/[0.05] border border-white/[0.08] pl-4 pr-14 font-['Poppins:Medium',sans-serif] text-[14px] text-white placeholder:text-white/20 outline-none focus:border-white/[0.15] transition-colors"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className={`font-['Poppins:Medium',sans-serif] text-[11px] transition-colors duration-200 ${
                uploadTitle.length >= 40 ? 'text-[#ff6b6b]/60' : uploadTitle.length >= 34 ? 'text-white/30' : 'text-white/15'
              }`}>
                {uploadTitle.length}/40
              </span>
            </div>
          </div>
        </div>

        {/* Message (optional) */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40 mb-2 block">
            Notiz <span className="text-white/20">(optional)</span>
          </label>
          <textarea
            value={uploadMessage}
            onChange={e => setUploadMessage(e.target.value.slice(0, 400))}
            maxLength={400}
            placeholder="z.B. Schwerpunkt: Differentialrechnung"
            rows={3}
            className="w-full rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3 font-['Poppins:Medium',sans-serif] text-[14px] text-white placeholder:text-white/20 outline-none focus:border-white/[0.15] transition-colors resize-none"
          />
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/20 text-right mt-1">
            {uploadMessage.length}/400
          </p>
        </div>

        {/* Grade Selection */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40 mb-2 block">Note</label>
          <div className="grid grid-cols-6 gap-2 mb-2">
            {['1', '2', '3', '4', '5', '6'].map(g => {
              const isActive = uploadGrade === g;
              const colors = GRADE_COLORS[g];
              return (
                <button
                  key={g}
                  onClick={() => {
                    if (isActive) {
                      setUploadGrade('');
                    } else {
                      setUploadGrade(g);
                      if (g === '6') setUploadModifier('');
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
          {uploadGrade && uploadGrade !== '6' && (
            <div className="flex items-center gap-2" style={{ animation: 'kaFadeIn 0.12s ease-out' }}>
              <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/30 mr-1">Tendenz:</span>
              {(['+', '', '-'] as const).map(mod => {
                const isActive = uploadModifier === mod;
                const label = mod === '+' ? `${uploadGrade}+` : mod === '-' ? `${uploadGrade}-` : `${uploadGrade}`;
                return (
                  <button
                    key={mod || 'none'}
                    onClick={() => setUploadModifier(mod)}
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
        </div>

        {/* File Upload */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40 mb-2 block">Dateien</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* File list */}
          {uploadFiles.length > 0 && (
            <div className="space-y-2 mb-3">
              {uploadFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                >
                  {file.type === 'application/pdf' ? (
                    <FileText className="w-4 h-4 text-white/30 flex-shrink-0" />
                  ) : (
                    <Image className="w-4 h-4 text-white/30 flex-shrink-0" />
                  )}
                  <span className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/60 flex-1 truncate">
                    {file.name}
                  </span>
                  <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/20 flex-shrink-0">
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="w-6 h-6 rounded-full flex items-center justify-center active:bg-white/[0.08] transition-colors"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <X className="w-3.5 h-3.5 text-white/30" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add files button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-[80px] rounded-xl border-2 border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-1.5 transition-all duration-150 ${isMobile ? 'active:bg-white/[0.03] active:border-white/[0.15]' : 'hover:bg-white/[0.03] hover:border-white/[0.15]'}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Upload className="w-5 h-5 text-white/25" />
            <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/30">
              {uploadFiles.length > 0 ? 'Weitere Dateien hinzufügen' : 'JPG, PNG oder PDF auswählen'}
            </span>
          </button>

          {/* Info text */}
          {uploadFiles.length > 1 && (
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 mt-2 leading-[1.5]">
              {uploadFiles.length} Dateien werden automatisch zu einer PDF zusammengeführt.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // --- Statistics (combined subject + stats view) ---
  const renderStats = () => (
    <div key={`stats-${selectedSubject}`} style={{ animation: `${animClass} 0.2s ease-out` }}>
      {/* Show empty state when no exams at all */}
      {subjectExams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-[56px] h-[56px] rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-white/20" />
          </div>
          <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white/30 mb-1">Noch keine Klassenarbeiten</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/20 mb-5 text-center px-8">
            Lade deine erste Klassenarbeit für {selectedSubject} hoch
          </p>
          <button
            onClick={() => goToUpload(selectedSubject)}
            className={`flex items-center gap-2 px-5 h-[38px] rounded-xl bg-white/[0.06] border border-white/[0.12] transition-all duration-150 ${isMobile ? 'active:bg-white/[0.10]' : 'hover:bg-white/[0.10]'}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Plus className="w-4 h-4 text-white" />
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white">Hochladen</span>
          </button>
        </div>
      ) : (
      <>
      {/* Date range filter */}
      <div className="mb-5">
        <RangeCalendarTrigger
          from={statsFrom}
          to={statsTo}
          onClick={() => setShowStatsCalendar(true)}
          onClear={() => { setStatsFrom(''); setStatsTo(''); }}
          isMobile={isMobile}
        />
      </div>

      {/* Summary */}
      <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden mb-5">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">Klassenarbeiten</span>
            <span className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">{statsExams.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">Durchschnitt</span>
            <span className="font-['Poppins:Bold',sans-serif] text-[16px] text-white">
              {statsExams.length > 0 ? calculateAverage(statsExams).toFixed(1) : '–'}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      {statsExams.length > 0 ? (() => {
        return (
        <div
          ref={chartRef}
          className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden p-4"
          onClick={(e) => {
            if (isMobile) {
              const target = e.target as SVGElement | HTMLElement;
              if (!target.closest('[data-bar]')) {
                setChartActiveIndex(undefined);
              }
            }
          }}
        >
          <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40 mb-3">Notenübersicht</p>
          <div style={{ width: '100%', height: 190 }}>
            {(() => {
              const maxVal = 7;
              const barCount = statsChartData.length;
              return (
                <svg width="100%" height="100%" viewBox="0 0 300 190" preserveAspectRatio="xMidYMid meet">
                  {/* Horizontal grid lines */}
                  {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <line
                      key={`grid-${i}`}
                      x1="0"
                      y1={160 - (i / maxVal) * 150}
                      x2="300"
                      y2={160 - (i / maxVal) * 150}
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray="3 3"
                    />
                  ))}
                  {/* Bars */}
                  {statsChartData.map((entry, index) => {
                    const gap = 300 / barCount;
                    const barWidth = gap * 0.55;
                    const barHeight = (entry.count / maxVal) * 150;
                    const x = gap * index + (gap - barWidth) / 2;
                    const y = 160 - barHeight;
                    const fillColor = GRADE_COLORS[entry.gradeNum]?.bar || '#666';
                    const isActive = chartActiveIndex === index;
                    const tooltipCenterX = x + barWidth / 2;
                    const tooltipY = barHeight > 0 ? y - 30 : 128;
                    const tooltipW = 72;
                    const tooltipRectX = Math.max(2, Math.min(tooltipCenterX - tooltipW / 2, 300 - tooltipW - 2));
                    return (
                      <g key={`bar-${entry.gradeNum}`}>
                        {/* Invisible wider hit area for easier tapping/hovering */}
                        <rect
                          data-bar="true"
                          x={gap * index}
                          y={0}
                          width={gap}
                          height={170}
                          fill="transparent"
                          style={{ cursor: entry.count > 0 ? 'pointer' : 'default' }}
                          onClick={() => {
                            if (entry.count > 0) {
                              setChartActiveIndex(prev => prev === index ? undefined : index);
                            }
                          }}
                          onMouseEnter={() => {
                            if (!isMobile && entry.count > 0) {
                              setChartActiveIndex(index);
                            }
                          }}
                          onMouseLeave={() => {
                            if (!isMobile) {
                              setChartActiveIndex(undefined);
                            }
                          }}
                        />
                        {barHeight > 0 && (
                          <rect
                            data-bar="true"
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            rx={6}
                            ry={6}
                            fill={fillColor}
                            fillOpacity={isActive ? 1 : 0.7}
                            style={{ cursor: 'pointer', transition: 'fill-opacity 0.15s ease' }}
                            onClick={() => {
                              setChartActiveIndex(prev => prev === index ? undefined : index);
                            }}
                            onMouseEnter={() => {
                              if (!isMobile) {
                                setChartActiveIndex(index);
                              }
                            }}
                            onMouseLeave={() => {
                              if (!isMobile) {
                                setChartActiveIndex(undefined);
                              }
                            }}
                          />
                        )}
                        {/* X-axis label */}
                        <text
                          x={x + barWidth / 2}
                          y={178}
                          textAnchor="middle"
                          fill="rgba(255,255,255,0.3)"
                          fontSize="11"
                          fontFamily="'Poppins:Medium',sans-serif"
                        >
                          {entry.gradeNum}
                        </text>
                        {/* Tooltip (hover on desktop, tap on mobile) */}
                        {isActive && entry.count > 0 && (
                          <g style={{ pointerEvents: 'none' }}>
                            <rect
                              x={tooltipRectX}
                              y={tooltipY}
                              width={tooltipW}
                              height={22}
                              rx={6}
                              fill="#1a1a1a"
                              stroke="rgba(255,255,255,0.12)"
                              strokeWidth={1}
                            />
                            <text
                              x={tooltipRectX + tooltipW / 2}
                              y={tooltipY + 15}
                              textAnchor="middle"
                              fill="white"
                              fontSize="11"
                              fontFamily="'Poppins:Medium',sans-serif"
                            >
                              {entry.count}× Note {entry.gradeNum}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              );
            })()}
          </div>
        </div>
        );
      })() : (
        <div className="flex flex-col items-center justify-center py-10">
          <BarChart3 className="w-8 h-8 text-white/15 mb-3" />
          <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">Keine Daten für diesen Zeitraum</p>
        </div>
      )}

      {/* Individual grades list */}
      {statsExams.length > 0 && (
        <div className="mt-5">
          <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40 mb-3">Klassenarbeiten</p>
          <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
            {statsExams
              .sort((a, b) => parseDDMMYYYY(b.uploadDate).getTime() - parseDDMMYYYY(a.uploadDate).getTime())
              .map((exam, index) => {
                const baseGrade = getBaseGrade(exam.grade);
                const colors = GRADE_COLORS[baseGrade] || GRADE_COLORS['3'];
                return (
                  <button
                    key={exam.id}
                    onClick={() => goToDetail(exam)}
                    className={`w-full flex items-center gap-3 px-4 py-3 relative text-left transition-colors duration-150 ${isMobile ? 'active:bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80 truncate">{exam.title}</p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 mt-0.5">{exam.uploadDate}</p>
                    </div>
                    <div
                      className="flex items-center px-2 py-0.5 rounded-md flex-shrink-0"
                      style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
                    >
                      <span className="font-['Poppins:Bold',sans-serif] text-[12px]" style={{ color: colors.text }}>
                        {exam.grade}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                    {index < statsExams.length - 1 && (
                      <div className="absolute bottom-0 left-4 right-0 h-px bg-white/[0.06]" />
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );

  // ===== HEADER =====
  const headerTitle = () => {
    switch (currentView) {
      case 'overview': return 'Klassenarbeiten';
      case 'upload': return 'Klassenarbeit hochladen';
      case 'stats': return selectedSubject;
      case 'detail': return 'Klassenarbeit';
    }
  };

  // ===== SHARED TAB BAR (used in both mobile header and desktop DesktopPageHeader) =====
  const tabBar = currentView === 'overview' ? (
    <div className="pb-4">
      <div className="relative p-1 rounded-xl bg-white/[0.04]">
        <div className="relative flex items-center">
          {/* Sliding indicator – GPU-composited translateX */}
          <div
            className="absolute top-0 bottom-0 left-[4px] rounded-lg"
            style={{
              width: 'calc((100% - 8px) / 2)',
              transform: `translateX(${overviewTab === 'list' ? '0%' : '100%'})`,
              transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
              willChange: 'transform',
            } as React.CSSProperties}
          >
            <div className="absolute inset-0 bg-white/[0.08] border border-white/[0.12] rounded-lg" />
          </div>

          <button
            onClick={() => { if (overviewTab !== 'list') setOverviewTab('list'); }}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 h-[36px] rounded-lg transition-colors duration-200 ${
              overviewTab === 'list' ? 'text-white' : 'text-white/35'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="font-['Poppins:Medium',sans-serif] text-[13px]">Klassenarbeiten</span>
          </button>
          <button
            onClick={() => { if (overviewTab !== 'allStats') setOverviewTab('allStats'); }}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 h-[36px] rounded-lg transition-colors duration-200 ${
              overviewTab === 'allStats' ? 'text-white' : 'text-white/35'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' } as React.CSSProperties}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="font-['Poppins:Medium',sans-serif] text-[13px]">Statistik</span>
          </button>
        </div>
      </div>
    </div>
  ) : null;

  // ===== UPLOAD ACTION BUTTON (desktop variant — hover instead of active) =====
  const uploadActionDesktop = (currentView === 'overview' || currentView === 'stats') ? (
    <button
      onClick={() => goToUpload(currentView === 'stats' ? selectedSubject : undefined)}
      className="flex items-center gap-1.5 px-3.5 h-[34px] rounded-xl bg-white/[0.06] border border-white/[0.12] transition-all duration-150 hover:bg-white/[0.10]"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <Plus className="w-3.5 h-3.5 text-white" />
      <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">Hochladen</span>
    </button>
  ) : undefined;

  // ===== CONTENT =====
  const content = (
    <div className="size-full flex flex-col bg-[#0a0a0a] overflow-hidden overscroll-none">
      <style>{screenCSS}</style>

      {/* Header — mobile only; desktop uses DesktopPageHeader */}
      {isMobile && (
      <div className="flex-shrink-0 px-4 pt-safe">
        <div className="flex items-center gap-3 h-[56px]">
          <button
            onClick={goBack}
            className="flex items-center gap-0.5 active:opacity-70 transition-opacity"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <ChevronLeft className="w-5 h-5 text-white/50" />
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50">Zurück</span>
          </button>
          <div className="flex-1" />
          {(currentView === 'overview' || currentView === 'stats') && (
            <button
              onClick={() => goToUpload(currentView === 'stats' ? selectedSubject : undefined)}
              className="flex items-center gap-1.5 px-3.5 h-[34px] rounded-xl bg-white/[0.06] border border-white/[0.12] transition-all duration-150 active:bg-white/[0.10]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">Hochladen</span>
            </button>
          )}
        </div>

        {/* Title */}
        <div className="mb-5">
          <h1 className="font-['Poppins:Bold',sans-serif] text-[22px] text-white tracking-[-0.3px]">
            {headerTitle()}
          </h1>
          {currentView === 'stats' && (
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/30 mt-0.5">
              {subjectExams.length} {subjectExams.length === 1 ? 'Klassenarbeit' : 'Klassenarbeiten'}
            </p>
          )}
        </div>

        {/* Tab bar – mobile */}
        {tabBar}
      </div>
      )}

      {/* Scrollable Content */}
      <div
        className={`flex-1 min-h-0 overflow-y-auto overscroll-none ka-scroll-hide ${isMobile ? `px-4 ${currentView === 'upload' ? 'pb-[120px]' : ''}` : 'pb-8'}`}
      >
        {currentView === 'overview' && renderOverview()}
        {currentView === 'upload' && renderUpload()}
        {currentView === 'stats' && renderStats()}
        {currentView === 'detail' && renderDetail()}
      </div>

      {/* First-time tutorial overlay */}
      <KlassenarbeitenTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

      {/* Premium Calendar Pickers */}
      <PremiumCalendarPicker
        mode="range"
        isOpen={showOverviewCalendar}
        onClose={() => setShowOverviewCalendar(false)}
        title="Zeitraum filtern"
        from={overviewDateFrom}
        to={overviewDateTo}
        onApply={(from, to) => { setOverviewDateFrom(from); setOverviewDateTo(to); }}
      />
      <PremiumCalendarPicker
        mode="range"
        isOpen={showStatsCalendar}
        onClose={() => setShowStatsCalendar(false)}
        title="Zeitraum filtern"
        from={statsFrom}
        to={statsTo}
        onApply={(from, to) => { setStatsFrom(from); setStatsTo(to); }}
      />

      {/* Bottom Action for Upload */}
      {currentView === 'upload' && (
        <div
          className={`flex-shrink-0 ${isMobile ? 'fixed bottom-0 left-0 right-0 px-4 pb-safe pt-3 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent' : 'mt-4 px-0'}`}
          style={isMobile ? { paddingBottom: 'max(env(safe-area-inset-bottom), 24px)', zIndex: 10 } : undefined}
        >
          <Button
            onClick={handleUpload}
            disabled={!uploadSubject || !uploadTitle || !composedGrade || uploadFiles.length === 0 || isUploading}
            size="md"
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4 text-white" />
                Hochladen
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  // ===== MOBILE LAYOUT =====
  if (isMobile) {
    // When wrapped by MobileRouteTransition, render content directly (no portal, no own animation)
    if (externalTransition) {
      return (
        <div className="flex-1 min-h-0 w-full bg-[#0a0a0a] overflow-y-auto overflow-x-hidden"
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'none' }}>
          {content}
        </div>
      );
    }

    const slideClass =
      animationState === 'entering' ? 'slide-screen-entering' :
      animationState === 'exiting' ? 'slide-screen-exiting' :
      'slide-screen-active';

    // Portal: Rendere direkt in document.body für korrekten Stacking Context
    // (wie AccountEditScreenMobile) – damit z-index über dem Footer liegt
    const mobileContent = (
      <div className={`slide-screen ${slideClass}`} style={{ zIndex: 99999 }}>
        {content}
      </div>
    );

    return typeof document !== 'undefined'
      ? ReactDOM.createPortal(mobileContent, document.body)
      : mobileContent;
  }

  // ===== DESKTOP LAYOUT =====
  // DesktopPageHeader provides standardized back button + title at uniform Y position.
  // No narrow max-w — content fills DCW standard width (1200px) like all other screens.
  // Viewport-based height: calc(100vh - 24px) matches Content Column pt-3 + pb-3.
  return (
    <div className="overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 24px)' }}>
      <DesktopPageHeader
        title={headerTitle()}
        subtitle={currentView === 'stats' ? `${subjectExams.length} ${subjectExams.length === 1 ? 'Klassenarbeit' : 'Klassenarbeiten'}` : undefined}
        onBack={goBack}
        backLabel="Zurück"
        actions={uploadActionDesktop}
      >
        {tabBar}
      </DesktopPageHeader>
      <div className="flex-1 min-h-0">
        {content}
      </div>
    </div>
  );
}