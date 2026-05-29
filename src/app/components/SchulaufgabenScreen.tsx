// ===== SCHULAUFGABEN SCREEN =====
// iPhone Mediathek / Galerie Style – Foto-Grid nach Fächern gruppiert
// Premium SaaS Style (Linear/Vercel)

import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { ChevronLeft, ChevronRight, Upload, Plus, X, Trash2, Camera, Info, ImageIcon } from 'lucide-react';

import DesktopPageHeader from '@/app/components/DesktopPageHeader';
import PremiumCalendarPicker, { CalendarTrigger } from './PremiumCalendarPicker';
import './SlideTransition.css';
import Button from '@/app/components/Button';
import SchulaufgabenTutorial, { shouldShowSchulaufgabenTutorial } from './SchulaufgabenTutorial';

// ===== TYPES =====
interface SchulaufgabeImage {
  id: string;
  subject: string;
  assignmentDate: string; // DD.MM.YYYY – gewähltes Datum
  name: string;
  size: number; // bytes
  url: string; // object URL or data URL (leer = Mock-Placeholder)
  file?: File;
}

interface SchulaufgabenScreenProps {
  onClose: () => void;
  isMobile?: boolean;
  isClosing?: boolean;
  externalTransition?: boolean;
}

// ===== CONSTANTS =====
const ALL_SUBJECTS = ['Mathematik', 'Deutsch', 'Französisch', 'Geschichte', 'Biologie', 'Informatik', 'Politik & GK', 'Physik', 'Englisch'];

const SUBJECT_ICONS: Record<string, string> = {
  'Mathematik': '📐', 'Deutsch': '📖', 'Französisch': '🇫🇷', 'Geschichte': '🏛️',
  'Biologie': '🧬', 'Informatik': '💻', 'Politik & GK': '⚖️', 'Physik': '⚛️', 'Englisch': '🇬🇧',
};

const SUBJECT_COLORS: Record<string, string> = {
  'Mathematik': '#6C8EEF', 'Deutsch': '#E8B960', 'Französisch': '#4ECDC4', 'Geschichte': '#C49B66',
  'Biologie': '#4ADE80', 'Informatik': '#A78BFA', 'Politik & GK': '#F87171', 'Physik': '#38BDF8', 'Englisch': '#FB923C',
};

// ===== MOCK DATA =====
const INITIAL_IMAGES: SchulaufgabeImage[] = [
  // Mathematik – viele Bilder über viele Daten verteilt für Scroll-Test
  { id: 'm1', subject: 'Mathematik', assignmentDate: '28.02.2026', name: 'mathe_klausur_s1.jpg', size: 245000, url: '' },
  { id: 'm2', subject: 'Mathematik', assignmentDate: '28.02.2026', name: 'mathe_klausur_s2.jpg', size: 312000, url: '' },
  { id: 'm3', subject: 'Mathematik', assignmentDate: '28.02.2026', name: 'mathe_klausur_s3.jpg', size: 280000, url: '' },
  { id: 'm4', subject: 'Mathematik', assignmentDate: '26.02.2026', name: 'mathe_analysis_1.jpg', size: 198000, url: '' },
  { id: 'm5', subject: 'Mathematik', assignmentDate: '26.02.2026', name: 'mathe_analysis_2.jpg', size: 284000, url: '' },
  { id: 'm6', subject: 'Mathematik', assignmentDate: '26.02.2026', name: 'mathe_analysis_3.jpg', size: 251000, url: '' },
  { id: 'm7', subject: 'Mathematik', assignmentDate: '26.02.2026', name: 'mathe_analysis_4.jpg', size: 310000, url: '' },
  { id: 'm8', subject: 'Mathematik', assignmentDate: '24.02.2026', name: 'mathe_stochastik_1.jpg', size: 276000, url: '' },
  { id: 'm9', subject: 'Mathematik', assignmentDate: '24.02.2026', name: 'mathe_stochastik_2.jpg', size: 295000, url: '' },
  { id: 'm10', subject: 'Mathematik', assignmentDate: '24.02.2026', name: 'mathe_stochastik_3.jpg', size: 230000, url: '' },
  { id: 'm11', subject: 'Mathematik', assignmentDate: '22.02.2026', name: 'mathe_vektoren_1.jpg', size: 267000, url: '' },
  { id: 'm12', subject: 'Mathematik', assignmentDate: '22.02.2026', name: 'mathe_vektoren_2.jpg', size: 289000, url: '' },
  { id: 'm13', subject: 'Mathematik', assignmentDate: '22.02.2026', name: 'mathe_vektoren_3.jpg', size: 302000, url: '' },
  { id: 'm14', subject: 'Mathematik', assignmentDate: '22.02.2026', name: 'mathe_vektoren_4.jpg', size: 245000, url: '' },
  { id: 'm15', subject: 'Mathematik', assignmentDate: '22.02.2026', name: 'mathe_vektoren_5.jpg', size: 318000, url: '' },
  { id: 'm16', subject: 'Mathematik', assignmentDate: '20.02.2026', name: 'mathe_geometrie_1.jpg', size: 284000, url: '' },
  { id: 'm17', subject: 'Mathematik', assignmentDate: '20.02.2026', name: 'mathe_geometrie_2.jpg', size: 251000, url: '' },
  { id: 'm18', subject: 'Mathematik', assignmentDate: '20.02.2026', name: 'mathe_geometrie_3.jpg', size: 310000, url: '' },
  { id: 'm19', subject: 'Mathematik', assignmentDate: '17.02.2026', name: 'mathe_integral_1.jpg', size: 276000, url: '' },
  { id: 'm20', subject: 'Mathematik', assignmentDate: '17.02.2026', name: 'mathe_integral_2.jpg', size: 295000, url: '' },
  { id: 'm21', subject: 'Mathematik', assignmentDate: '17.02.2026', name: 'mathe_integral_3.jpg', size: 230000, url: '' },
  { id: 'm22', subject: 'Mathematik', assignmentDate: '17.02.2026', name: 'mathe_integral_4.jpg', size: 260000, url: '' },
  { id: 'm23', subject: 'Mathematik', assignmentDate: '14.02.2026', name: 'mathe_diff_1.jpg', size: 287000, url: '' },
  { id: 'm24', subject: 'Mathematik', assignmentDate: '14.02.2026', name: 'mathe_diff_2.jpg', size: 305000, url: '' },
  { id: 'm25', subject: 'Mathematik', assignmentDate: '14.02.2026', name: 'mathe_diff_3.jpg', size: 274000, url: '' },
  { id: 'm26', subject: 'Mathematik', assignmentDate: '12.02.2026', name: 'mathe_kurvendisk_1.jpg', size: 262000, url: '' },
  { id: 'm27', subject: 'Mathematik', assignmentDate: '12.02.2026', name: 'mathe_kurvendisk_2.jpg', size: 289000, url: '' },
  { id: 'm28', subject: 'Mathematik', assignmentDate: '12.02.2026', name: 'mathe_kurvendisk_3.jpg', size: 310000, url: '' },
  { id: 'm29', subject: 'Mathematik', assignmentDate: '12.02.2026', name: 'mathe_kurvendisk_4.jpg', size: 245000, url: '' },
  { id: 'm30', subject: 'Mathematik', assignmentDate: '10.02.2026', name: 'mathe_matrix_1.jpg', size: 298000, url: '' },
  { id: 'm31', subject: 'Mathematik', assignmentDate: '10.02.2026', name: 'mathe_matrix_2.jpg', size: 315000, url: '' },
  { id: 'm32', subject: 'Mathematik', assignmentDate: '10.02.2026', name: 'mathe_matrix_3.jpg', size: 270000, url: '' },
  { id: 'm33', subject: 'Mathematik', assignmentDate: '07.02.2026', name: 'mathe_folgen_1.jpg', size: 253000, url: '' },
  { id: 'm34', subject: 'Mathematik', assignmentDate: '07.02.2026', name: 'mathe_folgen_2.jpg', size: 290000, url: '' },
  { id: 'm35', subject: 'Mathematik', assignmentDate: '07.02.2026', name: 'mathe_folgen_3.jpg', size: 268000, url: '' },
  { id: 'm36', subject: 'Mathematik', assignmentDate: '07.02.2026', name: 'mathe_folgen_4.jpg', size: 305000, url: '' },
  { id: 'm37', subject: 'Mathematik', assignmentDate: '07.02.2026', name: 'mathe_folgen_5.jpg', size: 242000, url: '' },
  { id: 'm38', subject: 'Mathematik', assignmentDate: '04.02.2026', name: 'mathe_grenzwert_1.jpg', size: 278000, url: '' },
  { id: 'm39', subject: 'Mathematik', assignmentDate: '04.02.2026', name: 'mathe_grenzwert_2.jpg', size: 310000, url: '' },
  { id: 'm40', subject: 'Mathematik', assignmentDate: '04.02.2026', name: 'mathe_grenzwert_3.jpg', size: 256000, url: '' },
  { id: 'm41', subject: 'Mathematik', assignmentDate: '01.02.2026', name: 'mathe_trig_1.jpg', size: 293000, url: '' },
  { id: 'm42', subject: 'Mathematik', assignmentDate: '01.02.2026', name: 'mathe_trig_2.jpg', size: 280000, url: '' },
  { id: 'm43', subject: 'Mathematik', assignmentDate: '01.02.2026', name: 'mathe_trig_3.jpg', size: 315000, url: '' },
  { id: 'm44', subject: 'Mathematik', assignmentDate: '28.01.2026', name: 'mathe_exp_1.jpg', size: 265000, url: '' },
  { id: 'm45', subject: 'Mathematik', assignmentDate: '28.01.2026', name: 'mathe_exp_2.jpg', size: 302000, url: '' },
  { id: 'm46', subject: 'Mathematik', assignmentDate: '28.01.2026', name: 'mathe_exp_3.jpg', size: 248000, url: '' },
  { id: 'm47', subject: 'Mathematik', assignmentDate: '28.01.2026', name: 'mathe_exp_4.jpg', size: 290000, url: '' },
  { id: 'm48', subject: 'Mathematik', assignmentDate: '23.01.2026', name: 'mathe_log_1.jpg', size: 272000, url: '' },
  { id: 'm49', subject: 'Mathematik', assignmentDate: '23.01.2026', name: 'mathe_log_2.jpg', size: 298000, url: '' },
  { id: 'm50', subject: 'Mathematik', assignmentDate: '23.01.2026', name: 'mathe_log_3.jpg', size: 310000, url: '' },
  { id: 'm51', subject: 'Mathematik', assignmentDate: '19.01.2026', name: 'mathe_poly_1.jpg', size: 255000, url: '' },
  { id: 'm52', subject: 'Mathematik', assignmentDate: '19.01.2026', name: 'mathe_poly_2.jpg', size: 288000, url: '' },
  { id: 'm53', subject: 'Mathematik', assignmentDate: '19.01.2026', name: 'mathe_poly_3.jpg', size: 305000, url: '' },
  { id: 'm54', subject: 'Mathematik', assignmentDate: '19.01.2026', name: 'mathe_poly_4.jpg', size: 240000, url: '' },
  // Deutsch
  { id: 'd1', subject: 'Deutsch', assignmentDate: '25.02.2026', name: 'deutsch_aufsatz.jpg', size: 287000, url: '' },
  { id: 'd2', subject: 'Deutsch', assignmentDate: '25.02.2026', name: 'deutsch_aufsatz2.jpg', size: 305000, url: '' },
  { id: 'd3', subject: 'Deutsch', assignmentDate: '21.02.2026', name: 'deutsch_grammatik.jpg', size: 274000, url: '' },
  { id: 'd4', subject: 'Deutsch', assignmentDate: '18.02.2026', name: 'deutsch_lyrik.jpg', size: 262000, url: '' },
  { id: 'd5', subject: 'Deutsch', assignmentDate: '18.02.2026', name: 'deutsch_lyrik2.jpg', size: 289000, url: '' },
  { id: 'd6', subject: 'Deutsch', assignmentDate: '14.02.2026', name: 'deutsch_eroerterung.jpg', size: 310000, url: '' },
  // Physik
  { id: 'p1', subject: 'Physik', assignmentDate: '24.02.2026', name: 'physik_mechanik.jpg', size: 410000, url: '' },
  { id: 'p2', subject: 'Physik', assignmentDate: '24.02.2026', name: 'physik_mechanik2.jpg', size: 380000, url: '' },
  { id: 'p3', subject: 'Physik', assignmentDate: '19.02.2026', name: 'physik_optik.jpg', size: 345000, url: '' },
  { id: 'p4', subject: 'Physik', assignmentDate: '13.02.2026', name: 'physik_elektro.jpg', size: 298000, url: '' },
  // Englisch
  { id: 'e1', subject: 'Englisch', assignmentDate: '27.02.2026', name: 'english_essay.jpg', size: 178000, url: '' },
  { id: 'e2', subject: 'Englisch', assignmentDate: '27.02.2026', name: 'english_essay2.jpg', size: 220000, url: '' },
  { id: 'e3', subject: 'Englisch', assignmentDate: '22.02.2026', name: 'english_grammar.jpg', size: 195000, url: '' },
  // Geschichte
  { id: 'g1', subject: 'Geschichte', assignmentDate: '23.02.2026', name: 'geschichte_weimar.jpg', size: 350000, url: '' },
  { id: 'g2', subject: 'Geschichte', assignmentDate: '23.02.2026', name: 'geschichte_weimar2.jpg', size: 320000, url: '' },
  { id: 'g3', subject: 'Geschichte', assignmentDate: '16.02.2026', name: 'geschichte_kaiserreich.jpg', size: 290000, url: '' },
  { id: 'g4', subject: 'Geschichte', assignmentDate: '16.02.2026', name: 'geschichte_kaiserreich2.jpg', size: 310000, url: '' },
  { id: 'g5', subject: 'Geschichte', assignmentDate: '10.02.2026', name: 'geschichte_revolution.jpg', size: 275000, url: '' },
];

// Module-level persistent store
let persistedImages: SchulaufgabeImage[] | null = null;
// Reset persisted images to pick up new mock data
persistedImages = null;
const MOCK_DATA_VERSION = 2; // bump to invalidate cached data
let persistedDataVersion = 0;

// ===== CSS =====
const screenCSS = `
@keyframes saFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes saSlideIn {
  from { opacity: 0; transform: translateX(12px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes saSlideBack {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes saOverviewFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes saThumbPop {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes saDupToastIn {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
.sa-scroll-hide::-webkit-scrollbar { display: none; }
`;

// ===== HELPERS =====
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

function formatYYYYMMDDToDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
}




// ===== IMAGE PREVIEW MODAL (Portal) – iPhone Photos Style =====
function ImagePreviewModal({
  images, initialIndex, onClose, onDelete, isMobile,
}: {
  images: SchulaufgabeImage[]; initialIndex: number; onClose: () => void; onDelete?: (id: string) => void; isMobile?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const img = images[currentIndex];

  const isUserScrollingThumbs = useRef(false);
  const programmaticScroll = useRef(false);
  const lastScrollIndex = useRef(currentIndex);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef(true);
  const thumbAnimRef = useRef(0);
  const THUMB_WIDTH = 43; // 40px thumb + 3px gap

  // Cancelable rAF-based smooth scroll for thumbnail strip
  const scrollThumbTo = useCallback((target: number, instant: boolean) => {
    const container = thumbStripRef.current;
    if (!container) return;
    if (thumbAnimRef.current) { cancelAnimationFrame(thumbAnimRef.current); thumbAnimRef.current = 0; }
    if (instant) { container.scrollLeft = target; return; }

    programmaticScroll.current = true;
    const start = container.scrollLeft;
    const diff = target - start;
    if (Math.abs(diff) < 1) { programmaticScroll.current = false; return; }
    const duration = Math.min(250, Math.max(120, Math.abs(diff) * 1.5));
    const startTime = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      container.scrollLeft = start + diff * easeOut(progress);
      if (progress < 1) {
        thumbAnimRef.current = requestAnimationFrame(step);
      } else {
        thumbAnimRef.current = 0;
        programmaticScroll.current = false;
      }
    };
    thumbAnimRef.current = requestAnimationFrame(step);
  }, []);

  // Realtime thumb position during drag – called from onDragMove
  const scrollThumbRealtime = useCallback((fractionalIndex: number) => {
    const container = thumbStripRef.current;
    if (!container) return;
    if (thumbAnimRef.current) { cancelAnimationFrame(thumbAnimRef.current); thumbAnimRef.current = 0; }
    programmaticScroll.current = true;
    container.scrollLeft = fractionalIndex * THUMB_WIDTH;
  }, []);

  // Scroll thumbnail strip to keep active thumb centered (programmatic only)
  useEffect(() => {
    if (!thumbStripRef.current || isUserScrollingThumbs.current) return;
    const scrollTarget = currentIndex * THUMB_WIDTH;
    if (isInitialMount.current) {
      scrollThumbTo(scrollTarget, true);
      isInitialMount.current = false;
    } else {
      scrollThumbTo(scrollTarget, false);
    }
  }, [currentIndex, scrollThumbTo]);

  // REALTIME scroll tracking – fires on every scroll frame during swipe
  const handleThumbScroll = useCallback(() => {
    if (!thumbStripRef.current || programmaticScroll.current) return;
    isUserScrollingThumbs.current = true;
    const container = thumbStripRef.current;
    // With padding = 50%-20px, scrollLeft directly maps to index
    const centeredIndex = Math.round(container.scrollLeft / THUMB_WIDTH);
    const clampedIndex = Math.max(0, Math.min(images.length - 1, centeredIndex));
    // Only update when centered index actually changes (perf)
    if (clampedIndex !== lastScrollIndex.current) {
      lastScrollIndex.current = clampedIndex;
      setCurrentIndex(clampedIndex);
    }
    // Reset user-scrolling flag after scroll settles
    if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(() => {
      isUserScrollingThumbs.current = false;
    }, 150);
  }, [images.length]);

  // Format date like iPhone: ALWAYS show weekday (line1) + full date (line2)
  const formatDateLabel = (dateStr: string): { line1: string; line2: string } => {
    if (!dateStr) return { line1: '', line2: '' };
    const parts = dateStr.split('.');
    if (parts.length !== 3) return { line1: dateStr, line2: '' };
    const day = parseInt(parts[0]);
    const monthIndex = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    const date = new Date(year, monthIndex, day);
    date.setHours(0, 0, 0, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const SHORT_MONTHS = ['Jan.', 'Feb.', 'Mär.', 'Apr.', 'Mai', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
    const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const dateLine = `${day}. ${SHORT_MONTHS[monthIndex]} ${year}`;

    if (date.getTime() === today.getTime()) {
      return { line1: 'Heute', line2: dateLine };
    } else if (date.getTime() === yesterday.getTime()) {
      return { line1: 'Gestern', line2: dateLine };
    } else {
      return { line1: WEEKDAYS[date.getDay()], line2: dateLine };
    }
  };

  // ===== MAIN IMAGE SWIPE – native DOM listeners, touch + mouse, bug-free =====
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, startY: 0, delta: 0, locked: null as 'h' | 'v' | null, startTime: 0 });
  const animFrameRef = useRef(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(currentIndex);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  const applyTrackTransform = useCallback((deltaPx: number, animate: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    // Force reflow when switching from animated to non-animated to avoid stale transitions
    if (!animate) {
      track.style.transition = 'none';
      // Force reflow so 'none' takes effect immediately before setting transform
      void track.offsetWidth;
    } else {
      track.style.transition = 'transform 300ms cubic-bezier(0.4,0,0.2,1)';
    }
    track.style.transform = `translateX(calc(-33.3333% + ${deltaPx}px))`;
  }, []);

  const onDragStart = useCallback((cx: number, cy: number) => {
    // If a snap animation is pending, finish it immediately
    if (snapTimerRef.current) {
      clearTimeout(snapTimerRef.current);
      snapTimerRef.current = null;
      isAnimatingRef.current = false;
    }
    dragState.current = { active: true, startX: cx, startY: cy, delta: 0, locked: null, startTime: Date.now() };
    applyTrackTransform(0, false);
  }, [applyTrackTransform]);

  const onDragMove = useCallback((cx: number, cy: number): boolean => {
    const s = dragState.current;
    if (!s.active || isAnimatingRef.current) return false;
    const dx = cx - s.startX, dy = cy - s.startY;
    if (!s.locked) {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) s.locked = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v';
      return false;
    }
    if (s.locked !== 'h') return false;
    let clamped = dx;
    const idx = currentIndexRef.current;
    if ((dx > 0 && idx === 0) || (dx < 0 && idx === images.length - 1)) clamped = dx * 0.25;
    s.delta = clamped;
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(() => {
      applyTrackTransform(clamped, false);
      // Realtime thumbnail tracking: fractional index from drag delta
      const w = mainAreaRef.current?.offsetWidth || window.innerWidth;
      const fractional = idx + (-clamped / w);
      const clampedFrac = Math.max(0, Math.min(images.length - 1, fractional));
      scrollThumbRealtime(clampedFrac);
    });
    return true;
  }, [images.length, applyTrackTransform, scrollThumbRealtime]);

  const onDragEnd = useCallback(() => {
    const s = dragState.current; s.active = false;
    cancelAnimationFrame(animFrameRef.current);
    if (s.locked !== 'h') { applyTrackTransform(0, false); return; }
    const dx = s.delta, elapsed = Date.now() - s.startTime;
    const velocity = Math.abs(dx) / Math.max(elapsed, 1);
    const snap = Math.abs(dx) > 30 || velocity > 0.15;
    const idx = currentIndexRef.current;

    // Cancel any previous pending snap
    if (snapTimerRef.current) { clearTimeout(snapTimerRef.current); snapTimerRef.current = null; }

    if (snap && dx < 0 && idx < images.length - 1) {
      const w = mainAreaRef.current?.offsetWidth || window.innerWidth;
      isAnimatingRef.current = true;
      applyTrackTransform(-w, true);
      // Scroll thumbnails to target index IMMEDIATELY (don't wait for snap)
      scrollThumbTo((idx + 1) * THUMB_WIDTH, false);
      snapTimerRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
        snapTimerRef.current = null;
        setCurrentIndex(p => Math.min(p + 1, images.length - 1));
      }, 310);
    } else if (snap && dx > 0 && idx > 0) {
      const w = mainAreaRef.current?.offsetWidth || window.innerWidth;
      isAnimatingRef.current = true;
      applyTrackTransform(w, true);
      // Scroll thumbnails to target index IMMEDIATELY (don't wait for snap)
      scrollThumbTo((idx - 1) * THUMB_WIDTH, false);
      snapTimerRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
        snapTimerRef.current = null;
        setCurrentIndex(p => Math.max(p - 1, 0));
      }, 310);
    } else {
      applyTrackTransform(0, true);
      // Snap back – scroll thumbs back to current index
      scrollThumbTo(idx * THUMB_WIDTH, false);
    }
  }, [images.length, applyTrackTransform, scrollThumbTo]);

  // Reset track BEFORE paint (useLayoutEffect) to prevent 1-frame flash
  useLayoutEffect(() => { applyTrackTransform(0, false); }, [currentIndex, applyTrackTransform]);

  useEffect(() => {
    const el = mainAreaRef.current; if (!el) return;
    const onTS = (e: TouchEvent) => { const t = e.touches[0]; onDragStart(t.clientX, t.clientY); };
    const onTM = (e: TouchEvent) => { const t = e.touches[0]; if (onDragMove(t.clientX, t.clientY)) { e.preventDefault(); e.stopPropagation(); } };
    const onTE = () => onDragEnd();
    let md = false;
    const onMD = (e: MouseEvent) => { if ((e.target as HTMLElement).closest('button')) return; md = true; e.preventDefault(); onDragStart(e.clientX, e.clientY); };
    const onMM = (e: MouseEvent) => { if (md) onDragMove(e.clientX, e.clientY); };
    const onMU = () => { if (md) { md = false; onDragEnd(); } };
    el.addEventListener('touchstart', onTS, { passive: true });
    el.addEventListener('touchmove', onTM, { passive: false });
    el.addEventListener('touchend', onTE, { passive: true });
    el.addEventListener('touchcancel', onTE, { passive: true });
    el.addEventListener('mousedown', onMD);
    window.addEventListener('mousemove', onMM);
    window.addEventListener('mouseup', onMU);
    return () => { el.removeEventListener('touchstart', onTS); el.removeEventListener('touchmove', onTM); el.removeEventListener('touchend', onTE); el.removeEventListener('touchcancel', onTE); el.removeEventListener('mousedown', onMD); window.removeEventListener('mousemove', onMM); window.removeEventListener('mouseup', onMU); };
  }, [onDragStart, onDragMove, onDragEnd]);

  const dateLabel = formatDateLabel(img?.assignmentDate || '');

  const el = (
    <div className="fixed inset-0 flex flex-col bg-black" style={{ zIndex: 100001 }}>
      {/* Top bar – iPhone style */}
      <div className="flex-shrink-0 flex items-center px-4 pt-safe relative" style={{ height: '52px' }}>
        {/* Back button – left */}
        <button
          onClick={onClose}
          className="flex items-center gap-0.5 active:opacity-70 transition-opacity z-10"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <ChevronLeft className="w-[22px] h-[22px] text-white/80" />
        </button>

        {/* Date label – centered pill */}
        <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
          <div
            className="px-4 py-1.5 rounded-full flex flex-col items-center"
            style={{ background: 'rgba(60, 60, 60, 0.65)', backdropFilter: 'blur(12px)' }}
          >
            <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/90 leading-tight">
              {dateLabel.line1}
            </span>
            {dateLabel.line2 && (
              <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/50 leading-tight">
                {dateLabel.line2}
              </span>
            )}
          </div>
        </div>

        {/* Empty right side for balance */}
        <div className="flex-1" />
      </div>

      {/* Main image – fullscreen, swipeable 3-panel track */}
      <div
        ref={mainAreaRef}
        className="flex-1 min-h-0 relative overflow-hidden select-none"
        style={{ touchAction: 'none', cursor: 'grab' }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex', width: '300%', height: '100%',
            transform: 'translateX(-33.3333%)',
            willChange: 'transform',
          }}
        >
          {/* Prev slot */}
          <div className="flex items-center justify-center" style={{ width: '33.3333%', height: '100%', flexShrink: 0, pointerEvents: 'none' }}>
            {currentIndex > 0 && (() => {
              const p = images[currentIndex - 1];
              return p.url ? (
                <img src={p.url} alt={p.name} className="max-w-full max-h-full object-contain" draggable={false} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-[260px] h-[360px] rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center justify-center gap-3">
                    <span className="text-[48px] opacity-15">{SUBJECT_ICONS[p.subject] || '📄'}</span>
                    <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/15">{p.name}</span>
                  </div>
                </div>
              );
            })()}
          </div>
          {/* Current slot */}
          <div className="flex items-center justify-center" style={{ width: '33.3333%', height: '100%', flexShrink: 0, pointerEvents: 'none' }}>
            {img?.url ? (
              <img src={img.url} alt={img.name} className="max-w-full max-h-full object-contain" draggable={false} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-[260px] h-[360px] rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center justify-center gap-3">
                  <span className="text-[48px] opacity-15">{SUBJECT_ICONS[img?.subject || ''] || '📄'}</span>
                  <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/15">{img?.name}</span>
                </div>
              </div>
            )}
          </div>
          {/* Next slot */}
          <div className="flex items-center justify-center" style={{ width: '33.3333%', height: '100%', flexShrink: 0, pointerEvents: 'none' }}>
            {currentIndex < images.length - 1 && (() => {
              const n = images[currentIndex + 1];
              return n.url ? (
                <img src={n.url} alt={n.name} className="max-w-full max-h-full object-contain" draggable={false} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-[260px] h-[360px] rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center justify-center gap-3">
                    <span className="text-[48px] opacity-15">{SUBJECT_ICONS[n.subject] || '📄'}</span>
                    <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/15">{n.name}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Desktop navigation arrows */}
        {!isMobile && images.length > 1 && currentIndex > 0 && (
          <button onClick={() => setCurrentIndex(i => i - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-white/[0.12] transition-colors z-10">
            <ChevronLeft className="w-5 h-5 text-white/70" />
          </button>
        )}
        {!isMobile && images.length > 1 && currentIndex < images.length - 1 && (
          <button onClick={() => setCurrentIndex(i => i + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-white/[0.12] transition-colors z-10">
            <ChevronRight className="w-5 h-5 text-white/70" />
          </button>
        )}
      </div>

      {/* Bottom section */}
      <div className="flex-shrink-0" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}>
        {/* Thumbnail strip – horizontal scrollable, iPhone style */}
        {images.length > 1 && (
          <div className="pb-2">
            <div
              ref={thumbStripRef}
              onScroll={handleThumbScroll}
              className="flex gap-[3px] overflow-x-auto sa-scroll-hide py-1 snap-x snap-mandatory scrollbar-hide"
              style={{ paddingLeft: 'calc(50% - 20px)', paddingRight: 'calc(50% - 20px)' }}
            >
              {images.map((thumb, i) => (
                <button
                  key={thumb.id}
                  onClick={() => { isUserScrollingThumbs.current = false; lastScrollIndex.current = i; setCurrentIndex(i); }}
                  className="flex-shrink-0 relative overflow-hidden transition-all duration-200 snap-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '4px',
                    border: i === currentIndex ? '2px solid rgba(255, 255, 255, 0.8)' : '2px solid transparent',
                    opacity: i === currentIndex ? 1 : 0.4,
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {thumb.url ? (
                    <img src={thumb.url} alt="" className="w-full h-full object-cover" draggable={false} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/[0.06]">
                      <span className="text-[10px] opacity-30">{SUBJECT_ICONS[thumb.subject] || '📄'}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom bar – only trash icon on the right */}
        <div className="flex items-center justify-end px-5 py-2">
          {onDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2.5 active:opacity-70 transition-opacity"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Trash2 className="w-[22px] h-[22px] text-white/50" />
            </button>
          )}
        </div>
      </div>

      {/* Delete confirmation overlay – iOS action sheet style */}
      {showDeleteConfirm && onDelete && (
        <div className="absolute inset-0 flex items-end justify-center bg-black/50 backdrop-blur-sm" style={{ zIndex: 10 }} onClick={() => setShowDeleteConfirm(false)}>
          <div className="w-full max-w-[360px] mx-4 rounded-2xl overflow-hidden" style={{ marginBottom: 'max(env(safe-area-inset-bottom), 16px)', animation: 'saFadeIn 0.15s ease-out' }} onClick={e => e.stopPropagation()}>
            <div className="bg-[#1c1c1e] rounded-2xl overflow-hidden">
              <div className="px-4 py-4 text-center border-b border-white/[0.06]">
                <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white">Foto löschen?</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/30 mt-1">Dieses Foto wird dauerhaft entfernt.</p>
              </div>
              <button onClick={() => { onDelete(img.id); setShowDeleteConfirm(false); if (images.length <= 1) onClose(); else if (currentIndex >= images.length - 1) setCurrentIndex(i => i - 1); }} className="w-full py-3.5 text-center active:bg-white/[0.04]" style={{ WebkitTapHighlightColor: 'transparent' }}>
                <span className="font-['Poppins:Medium',sans-serif] text-[15px] text-[#FF453A]">Löschen</span>
              </button>
            </div>
            <button onClick={() => setShowDeleteConfirm(false)} className="w-full mt-2 py-3.5 rounded-2xl bg-[#1c1c1e] text-center active:bg-white/[0.04]" style={{ WebkitTapHighlightColor: 'transparent' }}>
              <span className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">Abbrechen</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
  return typeof document !== 'undefined' ? ReactDOM.createPortal(el, document.body) : el;
}

// ===== MAIN COMPONENT =====
export default function SchulaufgabenScreen({ onClose, isMobile = false, isClosing = false, externalTransition = false }: SchulaufgabenScreenProps) {
  // Animation state
  const [animationState, setAnimationState] = useState<'entering' | 'active' | 'exiting'>('entering');
  useEffect(() => { const t = setTimeout(() => setAnimationState('active'), 300); return () => clearTimeout(t); }, []);
  useEffect(() => { if (isClosing) setAnimationState('exiting'); }, [isClosing]);

  // Data
  const [images, setImages] = useState<SchulaufgabeImage[]>(() => {
    // Invalidate cached data when mock data version changes
    if (persistedDataVersion !== MOCK_DATA_VERSION) {
      persistedImages = null;
      persistedDataVersion = MOCK_DATA_VERSION;
    }
    return persistedImages || INITIAL_IMAGES;
  });
  useEffect(() => { persistedImages = images; }, [images]);

  // Navigation
  type View = 'gallery' | 'upload' | 'subject';
  const [currentView, setCurrentView] = useState<View>('gallery');
  const [navDirection, setNavDirection] = useState<'forward' | 'back'>('forward');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Upload form state
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadDate, setUploadDate] = useState('');
  const [showUploadCalendar, setShowUploadCalendar] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dupToast, setDupToast] = useState<string | null>(null);
  const dupToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tutorial
  const [showTutorial, setShowTutorial] = useState(false);
  useEffect(() => {
    if (shouldShowSchulaufgabenTutorial()) {
      setShowTutorial(true);
    }
  }, []);

  // Image preview
  const [previewImages, setPreviewImages] = useState<SchulaufgabeImage[] | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  // iPhone-style floating date indicator (range: first + last visible)
  const [visibleDate, setVisibleDate] = useState('');
  const [visibleDateEnd, setVisibleDateEnd] = useState('');
  const dateGroupRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Navigation helpers
  const goToUpload = () => { setNavDirection('forward'); setUploadSubject(''); setUploadDate(''); setUploadFiles([]); prevView.current = currentView; setCurrentView('upload'); };
  const goToSubject = (subject: string) => { setNavDirection('forward'); setSelectedSubject(subject); setCurrentView('subject'); };
  const prevView = useRef<View>('gallery');
  const goBack = () => {
    setNavDirection('back');
    if (currentView === 'subject') { setCurrentView('gallery'); setSelectedSubject(''); }
    else if (currentView === 'upload') { setCurrentView(prevView.current === 'subject' ? 'subject' : 'gallery'); }
    else { onClose(); }
  };

  // File handling
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let skippedSelected = 0;
    let skippedUploaded = 0;
    const filtered = files.filter(file => {
      if (uploadFiles.some(f => f.name === file.name && f.size === file.size)) { skippedSelected++; return false; }
      if (uploadSubject && images.some(img => img.subject === uploadSubject && img.name === file.name && img.size === file.size)) { skippedUploaded++; return false; }
      return true;
    });
    if (skippedSelected > 0 || skippedUploaded > 0) {
      if (dupToastTimer.current) clearTimeout(dupToastTimer.current);
      let msg = '';
      if (skippedSelected > 0 && skippedUploaded > 0) {
        msg = `${skippedSelected} bereits ausgewählt, ${skippedUploaded} bereits hochgeladen`;
      } else if (skippedUploaded > 0) {
        msg = skippedUploaded === 1 ? 'Foto bereits hochgeladen' : `${skippedUploaded} Fotos bereits hochgeladen`;
      } else {
        msg = skippedSelected === 1 ? 'Foto bereits ausgewählt' : `${skippedSelected} Fotos bereits ausgewählt`;
      }
      setDupToast(msg);
      dupToastTimer.current = setTimeout(() => setDupToast(null), 2400);
    }
    if (filtered.length > 0) setUploadFiles(prev => [...prev, ...filtered]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const removeFile = (index: number) => setUploadFiles(prev => prev.filter((_, i) => i !== index));

  // Upload handler
  const handleUpload = () => {
    if (!uploadSubject || !uploadDate || uploadFiles.length === 0) return;
    setIsUploading(true);
    setTimeout(() => {
      const displayDate = formatYYYYMMDDToDisplay(uploadDate);
      const newImages: SchulaufgabeImage[] = uploadFiles.map((file, i) => ({
        id: `sa-${Date.now()}-${i}`,
        subject: uploadSubject,
        assignmentDate: displayDate,
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
        file,
      }));
      setImages(prev => [...newImages, ...prev]);
      setIsUploading(false);
      setNavDirection('back');
      setCurrentView('gallery');
    }, 600);
  };

  // Delete single image
  const handleDeleteImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  // Subjects with images (sorted by most recent)
  const subjectsWithImages = useMemo(() => {
    const map = new Map<string, { count: number; latestDate: Date }>();
    images.forEach(img => {
      const existing = map.get(img.subject);
      const date = parseDDMMYYYY(img.assignmentDate);
      if (!existing) map.set(img.subject, { count: 1, latestDate: date });
      else { existing.count++; if (date > existing.latestDate) existing.latestDate = date; }
    });
    return ALL_SUBJECTS
      .filter(s => map.has(s))
      .sort((a, b) => (map.get(b)?.latestDate.getTime() || 0) - (map.get(a)?.latestDate.getTime() || 0))
      .map(s => ({ subject: s, count: map.get(s)!.count }));
  }, [images]);

  // Images for selected subject (sorted by assignmentDate DESC)
  const subjectImages = useMemo(() => {
    return images
      .filter(img => img.subject === selectedSubject)
      .sort((a, b) => parseDDMMYYYY(b.assignmentDate).getTime() - parseDDMMYYYY(a.assignmentDate).getTime());
  }, [images, selectedSubject]);

  // Group subject images by date for section headers
  const subjectImagesByDate = useMemo(() => {
    const groups: { date: string; images: SchulaufgabeImage[] }[] = [];
    const map = new Map<string, SchulaufgabeImage[]>();
    subjectImages.forEach(img => {
      if (!map.has(img.assignmentDate)) map.set(img.assignmentDate, []);
      map.get(img.assignmentDate)!.push(img);
    });
    map.forEach((imgs, date) => groups.push({ date, images: imgs }));
    return groups;
  }, [subjectImages]);

  // iPhone-style floating date: track scroll to update visible date range
  const handleSubjectScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || currentView !== 'subject') return;

    const containerTop = container.getBoundingClientRect().top;
    const containerBottom = container.getBoundingClientRect().bottom;

    // Find visible grid items with data-date attribute
    const items = container.querySelectorAll('[data-date]');
    let firstDate = '';
    let lastDate = '';

    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const date = el.getAttribute('data-date') || '';
      // Item is at least partially visible in the container
      if (rect.bottom > containerTop && rect.top < containerBottom) {
        if (!firstDate) firstDate = date;
        lastDate = date;
      }
    });

    // If nothing found (scrolled to very top), use the first date
    if (!firstDate && subjectImagesByDate.length > 0) {
      firstDate = subjectImagesByDate[0].date;
      lastDate = firstDate;
    }

    if (firstDate) {
      setVisibleDate(firstDate);
      setVisibleDateEnd(lastDate && lastDate !== firstDate ? lastDate : '');
    }
  }, [currentView, subjectImagesByDate]);

  // Set initial visible date when entering subject view
  useEffect(() => {
    if (currentView === 'subject' && subjectImagesByDate.length > 0) {
      setVisibleDate(subjectImagesByDate[0].date);
      const lastGroup = subjectImagesByDate[subjectImagesByDate.length - 1];
      setVisibleDateEnd(lastGroup && lastGroup.date !== subjectImagesByDate[0].date ? lastGroup.date : '');
    }
    // Clear refs when leaving subject view
    if (currentView !== 'subject') {
      dateGroupRefs.current.clear();
    }
  }, [currentView, subjectImagesByDate]);



  // Helper: format DD.MM.YYYY to "26. Feb. 2026" (iPhone style)
  const formatDateToIPhoneStyle = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.split('.');
    if (parts.length !== 3) return dateStr;
    const day = parseInt(parts[0]);
    const monthIndex = parseInt(parts[1]) - 1;
    const year = parts[2];
    const SHORT_MONTHS = ['Jan.', 'Feb.', 'Mär.', 'Apr.', 'Mai', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
    return `${day}. ${SHORT_MONTHS[monthIndex]} ${year}`;
  };

  // Format a date range: "19. Jan. 2026 – 1. Feb. 2026" or single date if same
  const formatDateRange = (start: string, end: string): string => {
    const s = formatDateToIPhoneStyle(start);
    if (!end) return s;
    const e = formatDateToIPhoneStyle(end);
    return `${s} – ${e}`;
  };

  // Animation class
  const animClass = navDirection === 'forward' ? 'saSlideIn' : 'saSlideBack';
  const prevViewRef = useRef<View>('gallery');
  const isReturning = currentView === 'gallery' && prevViewRef.current !== 'gallery';
  if (currentView !== prevViewRef.current) prevViewRef.current = currentView;

  // ===== RENDER: GALLERY (iPhone Mediathek) =====
  const renderGallery = () => (
    <div style={isReturning ? { animation: 'saOverviewFadeIn 0.2s ease-out' } : undefined}>

      {/* Empty state */}
      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-[64px] h-[64px] rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-2">
            <Camera className="w-7 h-7 text-white/12" />
          </div>
          <p className="font-['Poppins:Medium',sans-serif] text-[15px] text-white/25">Noch keine Schulaufgaben</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/12 text-center max-w-[260px]">
            Lade Fotos deiner Schulaufgaben hoch, damit unsere KI erkennt, was gerade im Unterricht behandelt wird.
          </p>
          <button onClick={goToUpload} className="mt-3 flex items-center gap-1.5 px-4 h-[36px] rounded-xl bg-white/[0.06] border border-white/[0.10] transition-all duration-150 active:bg-white/[0.10] active:scale-[0.98]" style={{ WebkitTapHighlightColor: 'transparent' }}>
            <Plus className="w-3.5 h-3.5 text-white" />
            <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">Hochladen</span>
          </button>
        </div>
      )}

      {/* Subject list – Klassenarbeiten style: all subjects, divider lines */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        {ALL_SUBJECTS.map((subject, index) => {
          const entry = subjectsWithImages.find(s => s.subject === subject);
          const count = entry?.count || 0;
          const hasPhotos = count > 0;

          return (
            <button
              key={subject}
              onClick={() => hasPhotos ? goToSubject(subject) : undefined}
              className={`w-full flex items-center gap-4 px-4 py-4 transition-colors ${hasPhotos ? (isMobile ? 'active:bg-white/[0.04]' : 'hover:bg-white/[0.04] cursor-pointer') : 'cursor-default'} ${index < ALL_SUBJECTS.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className="text-[28px] w-[36px] flex-shrink-0 text-center">{SUBJECT_ICONS[subject]}</span>
              <div className="flex-1 text-left min-w-0">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">{subject}</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/30 mt-0.5">
                  {count === 0 ? 'Keine Schulaufgaben' : `${count} ${count === 1 ? 'Schulaufgabe' : 'Schulaufgaben'}`}
                </p>
              </div>
              {count > 0 && (
                <span className="font-['Poppins:Medium',sans-serif] text-[15px] text-white/40 mr-1">{count}</span>
              )}
              <ChevronRight className={`w-[18px] h-[18px] flex-shrink-0 ${hasPhotos ? 'text-white/20' : 'text-white/8'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );

  // ===== RENDER: SUBJECT VIEW (full grid of one subject, grouped by date) =====
  const renderSubjectView = () => {
    // Flatten all images into one continuous grid, but track date boundaries for scroll tracking
    const allImagesFlat = subjectImagesByDate.flatMap(g => g.images);
    
    return (
      <div key={`subject-${selectedSubject}`} style={{ animation: `${animClass} 0.2s ease-out` }}>
        {/* Responsive photo grid – auto-fill adapts to container width */}
        <div className="grid gap-[2px] overflow-hidden" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
          {allImagesFlat.map((img) => (
            <button
              key={img.id}
              data-date={img.assignmentDate}
              onClick={() => { setPreviewImages(subjectImages); setPreviewIndex(subjectImages.findIndex(i => i.id === img.id)); }}
              className="relative aspect-square overflow-hidden active:opacity-80 transition-opacity"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {img.url ? (
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/[0.03]">
                  <span className="text-[24px] opacity-20">{SUBJECT_ICONS[selectedSubject]}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {subjectImages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Camera className="w-8 h-8 text-white/10" />
            <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/20">Keine Fotos in {selectedSubject}</p>
          </div>
        )}
      </div>
    );
  };

  // ===== RENDER: UPLOAD FORM =====
  const renderUpload = () => (
    <div key="upload" style={{ animation: `${animClass} 0.2s ease-out` }}>
      <div className="space-y-4">
        {/* AI Info Banner */}
        <div className="rounded-xl bg-[#00D4AA]/[0.06] border border-[#00D4AA]/[0.12] px-4 py-3 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#00D4AA]/60 flex-shrink-0 mt-0.5" />
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#00D4AA]/50 leading-[1.6]">
            Unsere KI nutzt deine Schulaufgaben, um zu erkennen, was aktuell im Unterricht behandelt wird. Achte darauf, dass alle Fotos zum gewählten Datum passen.
          </p>
        </div>

        {/* Subject */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40 mb-2 block">Fach</label>
          <div className="relative">
            <select value={uploadSubject} onChange={e => setUploadSubject(e.target.value)} className="w-full h-[42px] rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 font-['Poppins:Medium',sans-serif] text-[14px] text-white appearance-none cursor-pointer outline-none focus:border-white/[0.15] transition-colors" style={{ WebkitTapHighlightColor: 'transparent' }}>
              <option value="" disabled>Fach auswählen</option>
              {ALL_SUBJECTS.map(s => (<option key={s} value={s} className="bg-[#1a1a1a] text-white">{s}</option>))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 rotate-90 pointer-events-none" />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40 mb-2 block">Datum der Schulaufgabe</label>
          <CalendarTrigger
            value={uploadDate}
            placeholder="Datum wählen"
            onClick={() => setShowUploadCalendar(true)}
          />
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/20 mt-1.5 px-1">
            Wähle das Datum, an dem die Schulaufgabe im Unterricht war.
          </p>
        </div>

        {/* Photos */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40 mb-2 block">
            Fotos {uploadFiles.length > 0 && <span className="text-white/20">({uploadFiles.length})</span>}
          </label>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/heic,image/heif" multiple onChange={handleFileSelect} className="hidden" />

          {/* Preview grid for selected files */}
          {uploadFiles.length > 0 && (
            <div className="grid gap-[3px] overflow-hidden mb-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
              {uploadFiles.map((file, index) => {
                const objUrl = URL.createObjectURL(file);
                return (
                  <div key={index} className="relative aspect-square overflow-hidden group" style={{ animation: `saThumbPop 0.15s ease-out ${index * 0.03}s both` }}>
                    <img src={objUrl} alt="" className="w-full h-full object-cover" onLoad={() => URL.revokeObjectURL(objUrl)} />
                    <button onClick={(e) => { e.stopPropagation(); removeFile(index); }} className="absolute top-1 right-1 w-[22px] h-[22px] rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center active:bg-black/80" style={{ WebkitTapHighlightColor: 'transparent' }}>
                      <X className="w-3 h-3 text-white/80" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add photos button */}
          <button onClick={() => fileInputRef.current?.click()} className={`w-full h-[72px] rounded-xl border-2 border-dashed border-white/[0.08] flex flex-col items-center justify-center gap-1.5 transition-all duration-150 ${isMobile ? 'active:bg-white/[0.03] active:border-white/[0.15]' : 'hover:bg-white/[0.03] hover:border-white/[0.15]'}`} style={{ WebkitTapHighlightColor: 'transparent' }}>
            <Camera className="w-5 h-5 text-white/25" />
            <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/30">
              {uploadFiles.length > 0 ? 'Weitere Fotos hinzufügen' : 'Fotos auswählen'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  // ===== HEADER =====
  const headerTitle = () => {
    switch (currentView) {
      case 'gallery': return 'Schulaufgaben';
      case 'upload': return 'Schulaufgabe hochladen';
      case 'subject': return selectedSubject;
    }
  };

  // ===== UPLOAD ACTION BUTTON (desktop variant — hover instead of active) =====
  const uploadActionDesktop = (currentView === 'gallery' || currentView === 'subject') ? (
    <button
      onClick={() => { if (currentView === 'subject') { prevView.current = 'subject'; setUploadSubject(selectedSubject); setUploadDate(''); setUploadFiles([]); setNavDirection('forward'); setCurrentView('upload'); } else goToUpload(); }}
      className="flex items-center gap-1.5 px-3.5 h-[34px] rounded-xl bg-white/[0.06] border border-white/[0.12] transition-all duration-150 hover:bg-white/[0.10]"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <Plus className="w-3.5 h-3.5 text-white" />
      <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">Hochladen</span>
    </button>
  ) : undefined;

  // ===== DESKTOP SUBTITLE =====
  const desktopSubtitle = (() => {
    if (currentView === 'gallery' && images.length > 0)
      return `${images.length} ${images.length === 1 ? 'Foto' : 'Fotos'} · ${subjectsWithImages.length} ${subjectsWithImages.length === 1 ? 'Fach' : 'Fächer'}`;
    if (currentView === 'subject')
      return formatDateRange(
        visibleDate || (subjectImagesByDate[0]?.date || ''),
        visibleDateEnd || (subjectImagesByDate.length > 1 ? subjectImagesByDate[subjectImagesByDate.length - 1].date : '')
      );
    return undefined;
  })();

  // ===== CONTENT =====
  const content = (
    <div className="size-full flex flex-col bg-[#0a0a0a] overflow-hidden overscroll-none">
      <style>{screenCSS}</style>

      {/* Header — mobile only; desktop uses DesktopPageHeader */}
      {isMobile && (
      <div className="flex-shrink-0 px-4 pt-safe">
        <div className="flex items-center gap-3 h-[56px]">
          <button onClick={goBack} className="flex items-center gap-0.5 active:opacity-70 transition-opacity" style={{ WebkitTapHighlightColor: 'transparent' }}>
            <ChevronLeft className="w-5 h-5 text-white/50" />
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50">Zurück</span>
          </button>
          <div className="flex-1" />
          {(currentView === 'gallery' || currentView === 'subject') && (
            <button onClick={() => { if (currentView === 'subject') { prevView.current = 'subject'; setUploadSubject(selectedSubject); setUploadDate(''); setUploadFiles([]); setNavDirection('forward'); setCurrentView('upload'); } else goToUpload(); }} className="flex items-center gap-1.5 px-3.5 h-[34px] rounded-xl bg-white/[0.06] border border-white/[0.12] transition-all duration-150 active:bg-white/[0.10]" style={{ WebkitTapHighlightColor: 'transparent' }}>
              <Plus className="w-3.5 h-3.5 text-white" />
              <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white">Hochladen</span>
            </button>
          )}
        </div>

        {/* Title */}
        <div className={`${currentView === 'subject' ? 'mb-2' : 'mb-5'}`}>
          <h1 className="font-['Poppins:Bold',sans-serif] text-[22px] text-white tracking-[-0.3px]">
            {headerTitle()}
          </h1>
          {currentView === 'gallery' && images.length > 0 && (
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/30 mt-0.5">
              {images.length} {images.length === 1 ? 'Foto' : 'Fotos'} · {subjectsWithImages.length} {subjectsWithImages.length === 1 ? 'Fach' : 'Fächer'}
            </p>
          )}
          {currentView === 'subject' && (
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/30 mt-0.5">
              {formatDateRange(
                visibleDate || (subjectImagesByDate[0]?.date || ''),
                visibleDateEnd || (subjectImagesByDate.length > 1 ? subjectImagesByDate[subjectImagesByDate.length - 1].date : '')
              )}
            </p>
          )}
        </div>
      </div>
      )}

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        onScroll={currentView === 'subject' ? handleSubjectScroll : undefined}
        className={`flex-1 min-h-0 overflow-y-auto overscroll-none sa-scroll-hide relative ${isMobile ? `${currentView === 'subject' ? 'px-0' : 'px-4'} ${currentView === 'upload' ? 'pb-[140px]' : 'pb-6'}` : 'pb-8'}`}
      >
        {currentView === 'gallery' && renderGallery()}
        {currentView === 'upload' && renderUpload()}
        {currentView === 'subject' && renderSubjectView()}
      </div>

      {/* Bottom Action for Upload */}
      {currentView === 'upload' && (
        <div className={`flex-shrink-0 ${isMobile ? 'fixed bottom-0 left-0 right-0 px-4 pb-safe pt-8' : 'mt-4 px-0'}`} style={isMobile ? { paddingBottom: 'max(env(safe-area-inset-bottom), 24px)', zIndex: 10, background: 'linear-gradient(to top, #0a0a0a 60%, #0a0a0aee 75%, transparent 100%)' } : undefined}>
          <Button onClick={handleUpload} disabled={!uploadSubject || !uploadDate || uploadFiles.length === 0 || isUploading} size="md">
            {isUploading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
            ) : (
              <><Upload className="w-4 h-4 text-white" /> Hochladen</>
            )}
          </Button>
        </div>
      )}

      {/* Duplicate Toast */}
      {dupToast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[100px] z-[99999] pointer-events-none" style={{ animation: 'saDupToastIn 0.25s ease-out' }}>
          <div className="px-4 py-2.5 rounded-xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] shadow-lg">
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 whitespace-nowrap">{dupToast}</span>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImages && (
        <ImagePreviewModal images={previewImages} initialIndex={previewIndex} onClose={() => setPreviewImages(null)} onDelete={handleDeleteImage} isMobile={isMobile} />
      )}

      {/* Premium Calendar Picker */}
      <PremiumCalendarPicker
        mode="single"
        isOpen={showUploadCalendar}
        onClose={() => setShowUploadCalendar(false)}
        title="Datum der Schulaufgabe"
        value={uploadDate}
        onSelect={(date) => setUploadDate(date)}
        maxDate={(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })()}
      />
    </div>
  );

  // ===== MOBILE LAYOUT =====
  if (isMobile) {
    // When wrapped by MobileRouteTransition, render content directly (no portal, no own animation)
    if (externalTransition) {
      return (
        <>
          <div className="flex-1 min-h-0 w-full bg-[#0a0a0a] overflow-y-auto overflow-x-hidden"
            style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'none' }}>
            {content}
          </div>
          <SchulaufgabenTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
        </>
      );
    }

    const slideClass = animationState === 'entering' ? 'slide-screen-entering' : animationState === 'exiting' ? 'slide-screen-exiting' : 'slide-screen-active';
    const mobileContent = (<div className={`slide-screen ${slideClass}`} style={{ zIndex: 99999 }}>{content}</div>);
    const portal = typeof document !== 'undefined' ? ReactDOM.createPortal(mobileContent, document.body) : mobileContent;
    return (
      <>
        {portal}
        <SchulaufgabenTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      </>
    );
  }

  // ===== DESKTOP LAYOUT =====
  // DesktopPageHeader provides standardized back button + title at uniform Y position.
  // No narrow max-w — content fills DCW standard width (1200px) like all other screens.
  // Viewport-based height: calc(100vh - 24px) matches Content Column pt-3 + pb-3.
  return (
    <>
      <div className="overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 24px)' }}>
        <DesktopPageHeader
          title={headerTitle()}
          subtitle={desktopSubtitle}
          onBack={goBack}
          backLabel="Zurück"
          actions={uploadActionDesktop}
        />
        <div className="flex-1 min-h-0">
          {content}
        </div>
      </div>
      <SchulaufgabenTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </>
  );
}