// ===== PROFILE ANALYTICS SCREEN =====
// 4-Tab Lernanalyse: Lernfortschritt, Schwächen & Lücken, Ziele & Klausuren, Leistung
// Premium SaaS Style (Linear/Vercel) – #0a0a0a, Glassmorphism, Poppins
// v1.6.6 - Calendar date picker redesign (solid circles, range strip)

import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Shield,
  BookOpen, Brain, BarChart3, ChevronRight, ChevronDown,
  Target, Activity, Flame, Award, Lightbulb, Clock,
  Layers, Minus, CheckCircle, Sparkles,
  ClipboardCheck, ClipboardList, CreditCard, Star, CalendarDays, X, ShieldAlert, MoveRight,
  GraduationCap, Timer, Zap, CircleDot, Play, Info
} from 'lucide-react';
import WeaknessActionButtons from './WeaknessActionButtons';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, CartesianGrid
} from 'recharts';
import type { FlashcardSet } from '@/types/flashcard';
import LernanalyseTutorial, { shouldShowLernanalyseTutorial } from './LernanalyseTutorial';
import PremiumCalendarPicker from './PremiumCalendarPicker';
import { MOCK_UPCOMING_EXAMS, MOCK_COMPLETED_EXAMS } from './profileAnalyticsMockExams';
import type { CompletedExam } from './profileAnalyticsMockExams';
import { examGradesStore } from './examGradesStore';
import ExamPrepTodoSection from './ExamPrepTodoSection';

// ===== TYPES =====
interface WeaknessItem {
  id: string;
  topic: string;
  subject: string;
  score: number;
  severity: 'critical' | 'warning' | 'moderate';
  recommendation: string;
  criticalActions: string[];
}

interface StrengthItem {
  id: string;
  topic: string;
  subject: string;
  score: number;
}

interface TopicItem {
  id: string;
  name: string;
  mastery: number;
  completedExercises: number;
  totalExercises: number;
  trend: number;
}

interface CategoryItem {
  id: string;
  name: string;
  progress: number;
  topics: TopicItem[];
}

interface SubjectProgress {
  id: string;
  name: string;
  progress: number;
  status: 'on-track' | 'needs-attention' | 'at-risk';
  trend: number; // e.g. +5, -3, 0
  strongestCategory: string;
  categories: CategoryItem[];
}

interface RiskItem {
  id: string;
  topic: string;
  subject: string;
  score: number;
  riskLevel: 'high' | 'medium' | 'low';
  reason: string;
}

interface ActivityItem {
  id: string;
  type: 'flashcard' | 'exam' | 'chat';
  title: string;
  subject: string;
  score?: number;
  date: string;
  duration: string;
  cardsCount?: number;
  grade?: string;
  progress?: number;
  setId?: number; // Verknüpfung zu FlashcardSet.id für echten Fortschritt
  time?: string; // HH:MM format for today's hourly chart
}



interface UnifiedSummary {
  totalActivities: number;
  averagePerformance: number;
  strongestSubject: string;
  weakestSubject: string;
  trend: 'improving' | 'stable' | 'declining';
  learningStyle: string;
  dataSources: { key: string; label: string; count: number }[];
}

// ===== MOCK DATA =====
const MOCK_WEAKNESSES: WeaknessItem[] = [
  { id: 'w1', topic: 'Quadratische Funktionen & Textaufgaben', subject: 'Mathematik', score: 28, severity: 'critical', recommendation: 'Scheitelpunktform und Nullstellen intensiv üben – besonders die Umformung von Textaufgaben in mathematische Gleichungen bereitet noch Schwierigkeiten', criticalActions: ['Grundlagen-Quiz wiederholen', 'Übungsblatt Scheitelpunktform'] },
  { id: 'w2', topic: 'Passé Composé mit unregelmäßigen Verben', subject: 'Französisch', score: 35, severity: 'critical', recommendation: 'Hilfsverben être/avoir wiederholen', criticalActions: ['Konjugationstabelle lernen', 'Lückentext-Übungen'] },
  { id: 'w3', topic: 'Zellatmung', subject: 'Biologie', score: 42, severity: 'warning', recommendation: 'Glykolyse und Citratzyklus Schritte lernen', criticalActions: [] },
  { id: 'w4', topic: 'Gedichtanalyse', subject: 'Deutsch', score: 48, severity: 'warning', recommendation: 'Stilmittel und Metrik systematisch üben', criticalActions: [] },
  { id: 'w5', topic: 'Industrialisierung & soziale Folgen', subject: 'Geschichte', score: 55, severity: 'moderate', recommendation: 'Zeitleiste und Schlüsselereignisse wiederholen', criticalActions: [] },
];

const MOCK_STRENGTHS: StrengthItem[] = [
  { id: 's1', topic: 'Lineare Gleichungen', subject: 'Mathematik', score: 94 },
  { id: 's2', topic: 'Vokabular B2', subject: 'Englisch', score: 91 },
  { id: 's3', topic: 'Photosynthese', subject: 'Biologie', score: 88 },
  { id: 's4', topic: 'Erörterung', subject: 'Deutsch', score: 86 },
  { id: 's5', topic: 'Terme vereinfachen', subject: 'Mathematik', score: 85 },
  { id: 's6', topic: 'Simple Past', subject: 'Englisch', score: 92 },
];

export const MOCK_SUBJECTS: SubjectProgress[] = [
  {
    id: 'sub1', name: 'Mathematik', progress: 68, status: 'needs-attention',
    trend: -3, strongestCategory: 'Zahlen & Operationen',
    categories: [
      {
        id: 'mc1', name: 'Zahlen & Operationen', progress: 79,
        topics: [
          { id: 'mt1', name: 'Bruchrechnung', mastery: 82, completedExercises: 45, totalExercises: 50, trend: 3 },
          { id: 'mt2', name: 'Prozentrechnung', mastery: 74, completedExercises: 32, totalExercises: 40, trend: 0 },
          { id: 'mt3', name: 'Terme vereinfachen', mastery: 85, completedExercises: 38, totalExercises: 42, trend: 5 },
          { id: 'mt4', name: 'Gleichungen lösen', mastery: 71, completedExercises: 28, totalExercises: 38, trend: -2 },
        ],
      },
      {
        id: 'mc2', name: 'Funktionen', progress: 58,
        topics: [
          { id: 'mt5', name: 'Lineare Funktionen', mastery: 78, completedExercises: 35, totalExercises: 44, trend: 4 },
          { id: 'mt6', name: 'Funktionsgraphen deuten', mastery: 61, completedExercises: 18, totalExercises: 30, trend: 0 },
          { id: 'mt7', name: 'Steigungsberechnung', mastery: 52, completedExercises: 14, totalExercises: 28, trend: -3 },
          { id: 'mt8', name: 'Funktionsgleichungen', mastery: 41, completedExercises: 10, totalExercises: 32, trend: -5 },
        ],
      },
      {
        id: 'mc3', name: 'Geometrie', progress: 72,
        topics: [
          { id: 'mt9', name: 'Flächenberechnung', mastery: 88, completedExercises: 40, totalExercises: 44, trend: 2 },
          { id: 'mt10', name: 'Körper & Volumen', mastery: 69, completedExercises: 22, totalExercises: 34, trend: 0 },
          { id: 'mt11', name: 'Winkel & Symmetrie', mastery: 75, completedExercises: 30, totalExercises: 38, trend: 3 },
          { id: 'mt12', name: 'Trigonometrie', mastery: 38, completedExercises: 8, totalExercises: 30, trend: -4 },
        ],
      },
      {
        id: 'mc4', name: 'Stochastik', progress: 48,
        topics: [
          { id: 'mt13', name: 'Wahrscheinlichkeitsrechnung', mastery: 41, completedExercises: 12, totalExercises: 36, trend: -6 },
          { id: 'mt14', name: 'Datenauswertung', mastery: 55, completedExercises: 16, totalExercises: 28, trend: 0 },
          { id: 'mt15', name: 'Baumdiagramme', mastery: 47, completedExercises: 10, totalExercises: 24, trend: -2 },
        ],
      },
    ],
  },
  {
    id: 'sub2', name: 'Deutsch', progress: 74, status: 'on-track',
    trend: 6, strongestCategory: 'Texte lesen & verstehen',
    categories: [
      {
        id: 'dc1', name: 'Texte schreiben', progress: 76,
        topics: [
          { id: 'dt1', name: 'Erörterung', mastery: 86, completedExercises: 28, totalExercises: 30, trend: 5 },
          { id: 'dt2', name: 'Inhaltsangabe', mastery: 79, completedExercises: 22, totalExercises: 26, trend: 3 },
          { id: 'dt3', name: 'Kreatives Schreiben', mastery: 72, completedExercises: 18, totalExercises: 24, trend: 0 },
          { id: 'dt4', name: 'Berichte & Protokolle', mastery: 68, completedExercises: 14, totalExercises: 20, trend: 4 },
        ],
      },
      {
        id: 'dc2', name: 'Texte lesen & verstehen', progress: 71,
        topics: [
          { id: 'dt5', name: 'Sachtexte analysieren', mastery: 81, completedExercises: 24, totalExercises: 28, trend: 4 },
          { id: 'dt6', name: 'Gedichtanalyse', mastery: 48, completedExercises: 10, totalExercises: 24, trend: -3 },
          { id: 'dt7', name: 'Epische Texte', mastery: 74, completedExercises: 20, totalExercises: 26, trend: 2 },
          { id: 'dt8', name: 'Dramenanalyse', mastery: 65, completedExercises: 15, totalExercises: 22, trend: 0 },
        ],
      },
      {
        id: 'dc3', name: 'Sprache & Grammatik', progress: 66,
        topics: [
          { id: 'dt9', name: 'Kommasetzung', mastery: 58, completedExercises: 20, totalExercises: 36, trend: -2 },
          { id: 'dt10', name: 'Satzglieder', mastery: 62, completedExercises: 16, totalExercises: 28, trend: 0 },
          { id: 'dt11', name: 'Rechtschreibung', mastery: 78, completedExercises: 32, totalExercises: 38, trend: 3 },
        ],
      },
      {
        id: 'dc4', name: 'Medien & Methoden', progress: 82,
        topics: [
          { id: 'dt12', name: 'Medienanalyse', mastery: 84, completedExercises: 18, totalExercises: 20, trend: 0 },
          { id: 'dt13', name: 'Quellenarbeit', mastery: 80, completedExercises: 16, totalExercises: 20, trend: 2 },
        ],
      },
    ],
  },
  {
    id: 'sub3', name: 'Englisch', progress: 82, status: 'on-track',
    trend: 0, strongestCategory: 'Reading',
    categories: [
      {
        id: 'ec1', name: 'Reading', progress: 88,
        topics: [
          { id: 'et1', name: 'Text Comprehension', mastery: 91, completedExercises: 36, totalExercises: 38, trend: 4 },
          { id: 'et2', name: 'Vocabulary B2', mastery: 88, completedExercises: 42, totalExercises: 46, trend: 2 },
          { id: 'et3', name: 'Summary Writing', mastery: 82, completedExercises: 26, totalExercises: 30, trend: 0 },
        ],
      },
      {
        id: 'ec2', name: 'Writing', progress: 80,
        topics: [
          { id: 'et4', name: 'Essay Writing', mastery: 85, completedExercises: 20, totalExercises: 22, trend: 3 },
          { id: 'et5', name: 'Creative Writing', mastery: 78, completedExercises: 18, totalExercises: 24, trend: 0 },
          { id: 'et6', name: 'Formal Letters', mastery: 76, completedExercises: 14, totalExercises: 18, trend: 0 },
        ],
      },
      {
        id: 'ec3', name: 'Grammar', progress: 74,
        topics: [
          { id: 'et7', name: 'Tenses', mastery: 84, completedExercises: 38, totalExercises: 42, trend: 0 },
          { id: 'et8', name: 'Conditional Sentences', mastery: 53, completedExercises: 12, totalExercises: 28, trend: -4 },
          { id: 'et9', name: 'Relative Clauses', mastery: 72, completedExercises: 20, totalExercises: 26, trend: 2 },
          { id: 'et10', name: 'Passive Voice', mastery: 79, completedExercises: 22, totalExercises: 26, trend: 0 },
        ],
      },
      {
        id: 'ec4', name: 'Listening & Speaking', progress: 77,
        topics: [
          { id: 'et11', name: 'Listening Comprehension', mastery: 78, completedExercises: 24, totalExercises: 30, trend: 0 },
          { id: 'et12', name: 'Presentations', mastery: 76, completedExercises: 8, totalExercises: 12, trend: 3 },
        ],
      },
    ],
  },
  {
    id: 'sub4', name: 'Biologie', progress: 61, status: 'at-risk',
    trend: -8, strongestCategory: 'Ökologie',
    categories: [
      {
        id: 'bc1', name: 'Zellbiologie', progress: 55,
        topics: [
          { id: 'bt1', name: 'Zellaufbau', mastery: 72, completedExercises: 20, totalExercises: 26, trend: -4 },
          { id: 'bt2', name: 'Zellatmung', mastery: 42, completedExercises: 10, totalExercises: 28, trend: -6 },
          { id: 'bt3', name: 'Zellteilung', mastery: 51, completedExercises: 14, totalExercises: 30, trend: -3 },
        ],
      },
      {
        id: 'bc2', name: 'Genetik', progress: 48,
        topics: [
          { id: 'bt4', name: 'Vererbungslehre', mastery: 55, completedExercises: 16, totalExercises: 30, trend: -5 },
          { id: 'bt5', name: 'DNA & RNA', mastery: 44, completedExercises: 12, totalExercises: 28, trend: -4 },
          { id: 'bt6', name: 'Mutation & Selektion', mastery: 38, completedExercises: 8, totalExercises: 26, trend: -7 },
        ],
      },
      {
        id: 'bc3', name: 'Ökologie', progress: 78,
        topics: [
          { id: 'bt7', name: 'Ökosysteme', mastery: 76, completedExercises: 22, totalExercises: 28, trend: 0 },
          { id: 'bt8', name: 'Stoffkreisläufe', mastery: 71, completedExercises: 18, totalExercises: 24, trend: -2 },
          { id: 'bt9', name: 'Photosynthese', mastery: 88, completedExercises: 30, totalExercises: 32, trend: 3 },
        ],
      },
    ],
  },
];

// Exported so KIToolsScreen can show the same value in the progress ring
export const OVERALL_PROGRESS = Math.round(MOCK_SUBJECTS.reduce((s, sub) => s + sub.progress, 0) / MOCK_SUBJECTS.length);

const MOCK_RISKS: RiskItem[] = [
  { id: 'r1', topic: 'Stochastik', subject: 'Mathematik', score: 15, riskLevel: 'high', reason: 'Klausur in 2 Wochen, Score aktuell bei 41%' },
  { id: 'r2', topic: 'Genetik', subject: 'Biologie', score: 20, riskLevel: 'high', reason: 'Nur 2 Versuche, stark fallender Trend' },
  { id: 'r3', topic: 'Conditional Sentences', subject: 'Englisch', score: 38, riskLevel: 'medium', reason: 'Grundlagen fehlen, baut auf für B2-Level' },
  { id: 'r4', topic: 'Trigonometrie', subject: 'Mathematik', score: 32, riskLevel: 'medium', reason: 'Noch nicht bearbeitet, Vorwissen lückenhaft' },
  { id: 'r5', topic: 'Kommasetzung', subject: 'Deutsch', score: 62, riskLevel: 'low', reason: 'Leichter Abwärtstrend, regelmäßiges Üben empfohlen' },
];

const MOCK_ACTIVITIES: ActivityItem[] = [
  // === Aktuelle Woche (9.–15. März 2026) ===
  { id: 'a0a', type: 'exam', title: 'Prüfungssimulation: Lineare Funktionen', subject: 'Mathematik', score: 85, date: '2026-03-15', duration: '28 min', grade: '2', time: '09:30' },
  { id: 'a0b', type: 'chat', title: '4 Fragen zur Photosynthese', subject: 'Biologie', date: '2026-03-15', duration: '12 min', time: '13:15' },
  { id: 'a1', type: 'flashcard', title: 'Lineare Gleichungen', subject: 'Mathematik', score: 94, date: '2026-03-15', duration: '15 min', cardsCount: 24, progress: 78, setId: 7001, time: '16:45' },
  { id: 'a2', type: 'exam', title: 'Prüfungssimulation: Erörterung', subject: 'Deutsch', score: 78, date: '2026-03-14', duration: '32 min', grade: '3' },
  { id: 'a3', type: 'flashcard', title: 'Vokabeln Unit 7', subject: 'Englisch', score: 88, date: '2026-03-14', duration: '12 min', cardsCount: 18, progress: 62, setId: 7002 },
  { id: 'a4', type: 'chat', title: '3 Fragen zu Zellatmung', subject: 'Biologie', date: '2026-03-13', duration: '8 min' },
  { id: 'a5', type: 'flashcard', title: 'Passé Composé', subject: 'Französisch', score: 35, date: '2026-03-12', duration: '20 min', cardsCount: 30, progress: 22, setId: 7003 },
  { id: 'a6', type: 'exam', title: 'Prüfungssimulation: Bruchrechnung', subject: 'Mathematik', score: 82, date: '2026-03-12', duration: '25 min', grade: '2' },
  { id: 'a7', type: 'flashcard', title: 'Photosynthese', subject: 'Biologie', score: 91, date: '2026-03-11', duration: '18 min', cardsCount: 20, progress: 85, setId: 7004 },
  { id: 'a8', type: 'chat', title: '5 Fragen zur Erörterung', subject: 'Deutsch', date: '2026-03-11', duration: '11 min' },
  { id: 'a9', type: 'exam', title: 'Prüfungssimulation: Stochastik', subject: 'Mathematik', score: 41, date: '2026-03-10', duration: '28 min', grade: '5' },
  { id: 'a10', type: 'chat', title: 'Allgemeine Lernfragen', subject: '', date: '2026-03-09', duration: '5 min' },
  // === Vorwoche (2.–8. März 2026) ===
  { id: 'a11', type: 'flashcard', title: 'Terme vereinfachen', subject: 'Mathematik', score: 72, date: '2026-03-08', duration: '14 min', cardsCount: 20, progress: 55 },
  { id: 'a12', type: 'exam', title: 'Prüfungssimulation: Gedichtanalyse', subject: 'Deutsch', score: 58, date: '2026-03-07', duration: '30 min', grade: '4' },
  { id: 'a13', type: 'flashcard', title: 'Vokabeln Unit 6', subject: 'Englisch', score: 81, date: '2026-03-06', duration: '10 min', cardsCount: 15, progress: 70 },
  { id: 'a14', type: 'chat', title: '2 Fragen zu Genetik', subject: 'Biologie', date: '2026-03-05', duration: '6 min' },
  { id: 'a15', type: 'exam', title: 'Prüfungssimulation: Lineare Funktionen', subject: 'Mathematik', score: 67, date: '2026-03-04', duration: '22 min', grade: '3' },
  { id: 'a16', type: 'flashcard', title: 'Simple Past', subject: 'Englisch', score: 85, date: '2026-03-03', duration: '12 min', cardsCount: 16, progress: 75 },
  { id: 'a17', type: 'chat', title: 'Fragen zu Industrialisierung', subject: 'Geschichte', date: '2026-03-02', duration: '9 min' },
  // === Vormonat (Februar 2026) ===
  { id: 'a18', type: 'flashcard', title: 'Bruchrechnung Basics', subject: 'Mathematik', score: 63, date: '2026-02-27', duration: '16 min', cardsCount: 22, progress: 45 },
  { id: 'a19', type: 'exam', title: 'Prüfungssimulation: Kommasetzung', subject: 'Deutsch', score: 55, date: '2026-02-25', duration: '28 min', grade: '4' },
  { id: 'a20', type: 'flashcard', title: 'Vokabeln Unit 5', subject: 'Englisch', score: 76, date: '2026-02-22', duration: '11 min', cardsCount: 14, progress: 58 },
  { id: 'a21', type: 'exam', title: 'Prüfungssimulation: Zellatmung', subject: 'Biologie', score: 38, date: '2026-02-20', duration: '35 min', grade: '5' },
  { id: 'a22', type: 'chat', title: 'Fragen zu Passé Composé', subject: 'Französisch', date: '2026-02-18', duration: '7 min' },
  { id: 'a23', type: 'flashcard', title: 'Quadratische Funktionen', subject: 'Mathematik', score: 42, date: '2026-02-15', duration: '20 min', cardsCount: 25, progress: 30 },
  { id: 'a24', type: 'exam', title: 'Prüfungssimulation: Simple Past', subject: 'Englisch', score: 70, date: '2026-02-12', duration: '24 min', grade: '3' },
  { id: 'a25', type: 'flashcard', title: 'Erörterung Aufbau', subject: 'Deutsch', score: 68, date: '2026-02-10', duration: '13 min', cardsCount: 18, progress: 50 },
  // === Ältere Daten (Jan 2026, Dez/Nov/Okt 2025) ===
  { id: 'a26', type: 'exam', title: 'Prüfungssimulation: Prozentrechnung', subject: 'Mathematik', score: 59, date: '2026-01-28', duration: '26 min', grade: '4' },
  { id: 'a27', type: 'flashcard', title: 'Vokabeln Unit 4', subject: 'Englisch', score: 74, date: '2026-01-22', duration: '10 min', cardsCount: 12, progress: 62 },
  { id: 'a28', type: 'chat', title: 'Fragen zu Photosynthese', subject: 'Biologie', date: '2026-01-18', duration: '8 min' },
  { id: 'a29', type: 'flashcard', title: 'Konjugation Präsens', subject: 'Französisch', score: 50, date: '2026-01-10', duration: '15 min', cardsCount: 20, progress: 35 },
  { id: 'a30', type: 'exam', title: 'Prüfungssimulation: Textanalyse', subject: 'Deutsch', score: 62, date: '2025-12-18', duration: '30 min', grade: '3' },
  { id: 'a31', type: 'flashcard', title: 'Grundrechenarten', subject: 'Mathematik', score: 88, date: '2025-12-10', duration: '12 min', cardsCount: 16, progress: 80 },
  { id: 'a32', type: 'exam', title: 'Prüfungssimulation: Ökologie', subject: 'Biologie', score: 45, date: '2025-11-25', duration: '32 min', grade: '5' },
  { id: 'a33', type: 'flashcard', title: 'Conditional Sentences', subject: 'Englisch', score: 53, date: '2025-11-15', duration: '14 min', cardsCount: 18, progress: 40 },
  { id: 'a34', type: 'chat', title: 'Allgemeine Lernstrategie', subject: '', date: '2025-10-20', duration: '10 min' },
];

// Streak: count consecutive days with at least one activity going backwards from today
export function calculateStreak(activities: { date: string }[]): number {
  const today = new Date('2026-03-15'); // matches mock "today"
  const activityDates = new Set(activities.map(a => a.date));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (activityDates.has(key)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export const LEARNING_STREAK = calculateStreak(MOCK_ACTIVITIES);

const TREND_DATA = [
  { week: 'KW 5', score: 58 },
  { week: 'KW 6', score: 61 },
  { week: 'KW 7', score: 59 },
  { week: 'KW 8', score: 65 },
  { week: 'KW 9', score: 68 },
  { week: 'KW 10', score: 72 },
];

const RADAR_DATA = [
  { subject: 'Mathe', score: 68, fullMark: 100 },
  { subject: 'Deutsch', score: 74, fullMark: 100 },
  { subject: 'Englisch', score: 82, fullMark: 100 },
  { subject: 'Bio', score: 61, fullMark: 100 },
  { subject: 'Franz.', score: 45, fullMark: 100 },
  { subject: 'Gesch.', score: 65, fullMark: 100 },
];

// Derive weekly activity data from MOCK_ACTIVITIES (single source of truth)
const WEEKLY_ACTIVITY_DATA = (() => {
  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const weekStart = new Date('2026-03-09'); // Monday of current week
  const buckets: Record<string, number> = { Mo: 0, Di: 0, Mi: 0, Do: 0, Fr: 0, Sa: 0, So: 0 };
  MOCK_ACTIVITIES.forEach(a => {
    const d = new Date(a.date + 'T00:00:00');
    if (d >= weekStart) {
      const dayKey = dayNames[d.getDay()];
      const mins = parseInt(a.duration.replace(/[^\d]/g, '')) || 0;
      buckets[dayKey] += mins;
    }
  });
  return ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => ({ day, minutes: buckets[day] }));
})();



const MOCK_UNIFIED_SUMMARY: UnifiedSummary = {
  totalActivities: 38,
  averagePerformance: 72,
  strongestSubject: 'Englisch',
  weakestSubject: 'Biologie',
  trend: 'improving',
  learningStyle: 'Ausgewogener Lernstil',
  dataSources: [
    { key: 'flashcards', label: 'Karteikarten Lernsimulator', count: 65 },
    { key: 'exams', label: 'Prüfungssimulation', count: 85 },
    { key: 'chat', label: 'Lernassistent', count: 24 },
  ],
};

// ===== KI-WISSENSLÜCKEN (Self-Learning) =====
interface KnowledgeGapItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  score: number;
  severity: 'critical' | 'warning' | 'moderate';
}

const MOCK_KNOWLEDGE_GAPS_SELF: KnowledgeGapItem[] = [
  {
    id: 'sg1',
    title: 'Grundlagen der Termumformung',
    description: 'Die KI hat erkannt, dass Fehler bei quadratischen Gleichungen und Bruchrechnung auf unsichere Termumformung zurückzuführen sind.',
    subject: 'Mathematik',
    score: 22,
    severity: 'critical',
  },
  {
    id: 'sg2',
    title: 'Satzglied-Erkennung',
    description: 'Schwächen bei Kommasetzung und Gedichtanalyse deuten auf ein grundlegendes Defizit bei der Satzglied-Erkennung hin.',
    subject: 'Deutsch',
    score: 40,
    severity: 'warning',
  },
  {
    id: 'sg3',
    title: 'Grundvokabular Biologie (Zellbiologie)',
    description: 'Verwechslungen bei Zellatmung und Genetik legen nahe, dass die Fachbegriffe der Zellbiologie nicht sicher sitzen.',
    subject: 'Biologie',
    score: 18,
    severity: 'critical',
  },
  {
    id: 'sg4',
    title: 'Zeitformen-System Französisch',
    description: 'Die Schwäche beim Passé Composé könnte auf ein fehlendes Verständnis des gesamten Zeitformen-Systems zurückgehen.',
    subject: 'Französisch',
    score: 45,
    severity: 'warning',
  },
  {
    id: 'sg5',
    title: 'Wahrscheinlichkeitsbegriff',
    description: 'Der niedrige Score bei Stochastik deutet auf Lücken beim intuitiven Verständnis von Wahrscheinlichkeiten hin.',
    subject: 'Mathematik',
    score: 58,
    severity: 'moderate',
  },
];

// ===== ZIELE & KLAUSUREN TYPES + MOCK DATA =====
interface ExamTopicReadiness {
  name: string;
  category: string;
  mastery: number; // 0-100 from all platform data (flashcards, exams, chat, etc.)
}

interface ExamInsight {
  type: 'strength' | 'weakness' | 'not-practiced';
  topic: string;
  detail: string;
}

interface ExamLearningCurvePoint {
  label: string;
  readiness: number;
}

interface ExamPastComparisonData {
  title: string;
  daysBeforeReadiness: number;
  daysBeforeExam: number;
  grade: number;
}

interface ExamRecommendation {
  id: string;
  topic: string;
  subject: string;
  reason: string;
  severity: 'critical' | 'warning' | 'moderate';
  actions: ('flashcards' | 'exam-simulation')[];
}

interface UpcomingExam {
  id: string;
  title: string;
  subject: string;
  date: string;
  prepStartDate: string; // when the student created the exam / started preparing
  selectedTopics: ExamTopicReadiness[];
  overallReadiness: number; // 0-100 holistic score from ALL platform data
  prepTasks: {
    type: 'flashcards' | 'exam-simulation' | 'chat';
    title: string;
    topic: string;
    completed: boolean;
    assignedDate: string; // ISO date when first assigned
    completedDate?: string; // ISO date when completed
    cardCount?: number; // fixed count for flashcard tasks (e.g. 15)
    examDurationMinutes?: number; // duration for exam-simulation tasks (e.g. 20)
    linkedSetId?: number; // once a flashcard set has been generated, store the set ID here
  }[];
  dataSources: { label: string; count: number }[]; // what data the readiness is based on
  aiAssessment: string;
  // Detail insights
  insights: ExamInsight[];
  pastComparison: ExamPastComparisonData | null;
  recommendations: ExamRecommendation[];
}

/** Simple deterministic hash for seeded pseudo-random */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Dynamically generate learning curve data points from prepStartDate to today */
function generateLearningCurve(prepStartDate: string, currentReadiness: number): ExamLearningCurvePoint[] {
  const today = new Date('2026-03-17');
  const start = new Date(prepStartDate);
  const totalDays = Math.max(1, Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Deterministic seed from inputs
  const rand = seededRandom(totalDays * 1000 + currentReadiness);
  
  // Determine number of data points based on timespan
  let numPoints: number;
  if (totalDays <= 7) numPoints = Math.min(totalDays + 1, 5);
  else if (totalDays <= 14) numPoints = 5;
  else if (totalDays <= 30) numPoints = 6;
  else if (totalDays <= 60) numPoints = 7;
  else numPoints = 8;
  
  numPoints = Math.max(3, Math.min(numPoints, totalDays + 1));
  
  const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  
  // Starting readiness: deterministic scale from current
  const startReadiness = Math.max(8, currentReadiness * (0.2 + rand() * 0.15));
  
  const points: ExamLearningCurvePoint[] = [];
  for (let i = 0; i < numPoints; i++) {
    const fraction = i / (numPoints - 1);
    const dayOffset = Math.round(fraction * totalDays);
    const pointDate = new Date(start.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    
    // Smooth curve with slight deterministic noise
    const easedFraction = Math.pow(fraction, 0.7);
    const noise = i > 0 && i < numPoints - 1 ? (rand() - 0.5) * 6 : 0;
    const readiness = i === numPoints - 1
      ? currentReadiness
      : Math.round(Math.min(100, Math.max(0, startReadiness + (currentReadiness - startReadiness) * easedFraction + noise)));
    
    const label = `${pointDate.getDate()}. ${MONTHS[pointDate.getMonth()]}`;
    
    points.push({ label, readiness });
  }
  
  return points;
}

interface PastExamInsight {
  id: string;
  title: string;
  subject: string;
  date: string;
  grade: number;
  prepPercent: number;
}

interface ActiveGoal {
  id: string;
  topic: string;
  subject: string;
  dueDate: string;
  originalDueDate: string;
  masteryStart: number; // mastery when goal was created
  masteryCurrent: number; // current mastery from all platform data
  masteryTarget: number; // target mastery to "complete" goal
  todosCompleted: number;
  todosTotal: number;
  aiReasoning: string;
  status: 'on-track' | 'at-risk' | 'extended';
  note?: string;
  difficulties: {
    topic: string;
    detail: string;
    type: 'major' | 'moderate' | 'minor';
  }[];
  prepTasks: {
    type: 'flashcards' | 'exam-simulation' | 'chat';
    title: string;
    topic: string;
    completed: boolean;
    assignedDate: string;
    completedDate?: string;
    cardCount?: number;
    examDurationMinutes?: number;
    linkedSetId?: number;
  }[];
}

interface CompletedGoalInsight {
  id: string;
  topic: string;
  subject: string;
  plannedDays: number;
  actualDays: number;
  completedOnTime: boolean;
  completedDate: string;
}

// Synced with KlassenarbeitenScreen INITIAL_EXAMS – single source of truth
const MOCK_PAST_EXAM_INSIGHTS: PastExamInsight[] = [
  { id: 'pe1', title: 'Lineare Algebra', subject: 'Mathematik', date: '2025-02-14', grade: 1, prepPercent: 88 },
  { id: 'pe2', title: 'Geometrie Grundlagen', subject: 'Mathematik', date: '2025-01-28', grade: 2, prepPercent: 72 },
  { id: 'pe3', title: 'Erörterung Medien', subject: 'Deutsch', date: '2025-01-18', grade: 3, prepPercent: 55 },
  { id: 'pe4', title: 'Weimarer Republik', subject: 'Geschichte', date: '2025-01-15', grade: 2, prepPercent: 78 },
  { id: 'pe5', title: 'Vektorrechnung', subject: 'Mathematik', date: '2025-01-10', grade: 3, prepPercent: 45 },
  { id: 'pe6', title: 'Stochastik Klausur', subject: 'Mathematik', date: '2024-12-20', grade: 1, prepPercent: 91 },
  { id: 'pe7', title: 'Shakespeare Analysis', subject: 'Englisch', date: '2024-12-10', grade: 1, prepPercent: 85 },
  { id: 'pe8', title: 'Mechanik & Thermodynamik', subject: 'Physik', date: '2024-12-05', grade: 2, prepPercent: 76 },
  { id: 'pe9', title: 'Dramenanalyse Faust', subject: 'Deutsch', date: '2024-11-22', grade: 2, prepPercent: 68 },
  { id: 'pe10', title: 'Analysis Klausur Q1', subject: 'Mathematik', date: '2024-11-15', grade: 2, prepPercent: 71 },
];

export const MOCK_ACTIVE_GOALS: ActiveGoal[] = [
  {
    id: 'ag1',
    topic: 'Quadratische Funktionen',
    subject: 'Mathematik',
    dueDate: '2026-03-28',
    originalDueDate: '2026-03-28',
    masteryStart: 28,
    masteryCurrent: 54,
    masteryTarget: 100,
    todosCompleted: 4,
    todosTotal: 8,
    note: 'Ich will quadratische Funktionen komplett verstehen – Scheitelpunktform, Nullstellen mit p-q-Formel und Graphen zeichnen können. Wichtig für die Mathe-Klausur Ende März, aber auch generell fürs Verständnis von Funktionen.',
    aiReasoning: 'Dein Fortschritt ist von 28% auf 54% gestiegen – basierend auf Karteikarten-Sessions und einer Prüfungssimulation. Die gezielten ToDos können die restlichen 46% zum Ziel schließen.',
    status: 'on-track',
    difficulties: [
      { topic: 'Scheitelpunktform ↔ Normalform', detail: 'Die Umwandlung zwischen Scheitelpunktform und Normalform wird häufig verwechselt – besonders das Vorzeichen beim Quadrieren der verschobenen Variablen.', type: 'major' },
      { topic: 'p-q-Formel Sonderfälle', detail: 'Wenn die Diskriminante negativ ist, wird das nicht erkannt und es werden falsche Nullstellen berechnet. Sonderfälle brauchen mehr Übung.', type: 'major' },
      { topic: 'Graphen strecken/stauchen', detail: 'Der Streckfaktor a wird mit der Verschiebung verwechselt – du weißt, wie er den Graphen beeinflusst, aber die Kombination mit Verschiebung ist noch unsicher.', type: 'moderate' },
      { topic: 'Textaufgaben modellieren', detail: 'Bei Textaufgaben fällt es schwer, die richtige Funktion aufzustellen. Die Übersetzung von Text in mathematische Terme braucht noch Übung.', type: 'moderate' },
      { topic: 'Symmetrieachse bestimmen', detail: 'Kleinere Unsicherheit: Die Symmetrieachse wird manchmal falsch aus der Scheitelpunktform abgelesen, besonders bei negativem Vorzeichen.', type: 'minor' },
    ],
    prepTasks: [
      { type: 'flashcards', title: '15 Karteikarten: Scheitelpunktform durchgehen', topic: 'Scheitelpunktform', completed: true, assignedDate: '2026-03-08', completedDate: '2026-03-08', cardCount: 15, linkedSetId: 301 },
      { type: 'exam-simulation', title: '20 Min: Prüfung Quadratische Gleichungen', topic: 'Quadratische Gleichungen', completed: true, assignedDate: '2026-03-10', completedDate: '2026-03-11', examDurationMinutes: 20 },
      { type: 'flashcards', title: '15 Karteikarten: Nullstellen berechnen', topic: 'Nullstellen berechnen', completed: true, assignedDate: '2026-03-12', completedDate: '2026-03-12', cardCount: 15, linkedSetId: 302 },
      { type: 'flashcards', title: '15 Karteikarten: p-q-Formel üben', topic: 'p-q-Formel', completed: true, assignedDate: '2026-03-14', completedDate: '2026-03-15', cardCount: 15, linkedSetId: 303 },
      { type: 'exam-simulation', title: '25 Min: Prüfung Graphen verschieben & strecken', topic: 'Graphen verschieben', completed: false, assignedDate: '2026-03-16', examDurationMinutes: 25 },
      { type: 'flashcards', title: '15 Karteikarten: Diskriminante & Sonderfälle', topic: 'Diskriminante', completed: false, assignedDate: '2026-03-18', cardCount: 15 },
      { type: 'exam-simulation', title: '20 Min: Prüfung Scheitelpunktform & Normalform', topic: 'Scheitelpunktform', completed: false, assignedDate: '2026-03-20', examDurationMinutes: 20 },
      { type: 'flashcards', title: '15 Karteikarten: Textaufgaben quadratische Funktionen', topic: 'Textaufgaben', completed: false, assignedDate: '2026-03-22', cardCount: 15 },
    ],
  },
  {
    id: 'ag2',
    topic: 'Passé Composé',
    subject: 'Französisch',
    dueDate: '2026-04-05',
    originalDueDate: '2026-03-25',
    masteryStart: 20,
    masteryCurrent: 35,
    masteryTarget: 100,
    todosCompleted: 2,
    todosTotal: 6,
    note: 'Passé Composé sicher bilden können – mit être und avoir, auch die Angleichung. Brauche das für den Französisch-Test und will nicht mehr unsicher sein bei den Hilfsverben.',
    aiReasoning: 'Das Ziel wurde verschoben, weil dein Fortschritt trotz 2 erledigten ToDos nur auf 35% gestiegen ist. Die Plattform-Daten zeigen, dass die Hilfsverben être/avoir noch nicht sicher sitzen – die KI empfiehlt, erst die Grundlagen zu festigen.',
    status: 'extended',
    difficulties: [
      { topic: 'être vs. avoir Verwendung', detail: 'Die Wahl des richtigen Hilfsverbs wird häufig verwechselt – besonders bei Bewegungsverben, die être verlangen, wird avoir verwendet.', type: 'major' },
      { topic: 'Participe passé Angleichung', detail: 'Die Angleichung des Partizips bei être-Verben wird vergessen oder falsch angewendet – Genus und Numerus stimmen oft nicht überein.', type: 'major' },
      { topic: 'Unregelmäßige Partizipien', detail: 'Formen wie „fait", „pris", „mis" werden mit den regelmäßigen Endungen verwechselt. Die unregelmäßigen Formen sitzen noch nicht sicher.', type: 'moderate' },
      { topic: 'Verneinung im Passé Composé', detail: 'Die Stellung von „ne...pas" um das Hilfsverb herum wird bei längeren Sätzen unsicher.', type: 'minor' },
    ],
    prepTasks: [
      { type: 'flashcards', title: '15 Karteikarten: être/avoir Konjugation', topic: 'Hilfsverben', completed: true, assignedDate: '2026-03-10', completedDate: '2026-03-11', cardCount: 15, linkedSetId: 304 },
      { type: 'flashcards', title: '15 Karteikarten: Participe passé Formen', topic: 'Participe passé', completed: true, assignedDate: '2026-03-13', completedDate: '2026-03-14', cardCount: 15, linkedSetId: 305 },
      { type: 'exam-simulation', title: '20 Min: Prüfung être/avoir Verwendung', topic: 'Hilfsverben', completed: false, assignedDate: '2026-03-16', examDurationMinutes: 20 },
      { type: 'flashcards', title: '15 Karteikarten: Angleichung bei être', topic: 'Angleichung', completed: false, assignedDate: '2026-03-18', cardCount: 15 },
      { type: 'exam-simulation', title: '25 Min: Prüfung Passé Composé komplett', topic: 'Passé Composé', completed: false, assignedDate: '2026-03-22', examDurationMinutes: 25 },
      { type: 'flashcards', title: '15 Karteikarten: Unregelmäßige Partizipien', topic: 'Unregelmäßige Partizipien', completed: false, assignedDate: '2026-03-25', cardCount: 15 },
    ],
  },
  {
    id: 'ag3',
    topic: 'Zellatmung verstehen',
    subject: 'Biologie',
    dueDate: '2026-03-20',
    originalDueDate: '2026-03-20',
    masteryStart: 35,
    masteryCurrent: 42,
    masteryTarget: 100,
    todosCompleted: 1,
    todosTotal: 5,
    note: 'Zellatmung komplett durcharbeiten – Glykolyse, Citratzyklus und Atmungskette. Will verstehen wie ATP produziert wird und die einzelnen Schritte erklären können.',
    aiReasoning: 'Kaum Fortschritt: Nur von 35% auf 42% gestiegen. Nur 1 ToDo erledigt und keine weiteren Aktivitäten zum Thema erkannt. Ohne tägliches Lernen wird das Ziel in 3 Tagen nicht erreicht.',
    status: 'at-risk',
    difficulties: [
      { topic: 'ATP-Bilanz berechnen', detail: 'Die Gesamt-ATP-Ausbeute aus Glykolyse, Citratzyklus und Atmungskette wird nicht korrekt zusammengerechnet – einzelne Schritte werden vergessen.', type: 'major' },
      { topic: 'Citratzyklus Schritte', detail: 'Die Reihenfolge der Zwischenprodukte im Citratzyklus wird verwechselt. Acetyl-CoA → Citrat ist klar, aber danach wird es unsicher.', type: 'major' },
      { topic: 'Elektronentransportkette', detail: 'Die Rolle der Elektronencarrier (NADH, FADH₂) in der Atmungskette und wie sie zur ATP-Synthese beitragen, ist noch nicht verstanden.', type: 'moderate' },
    ],
    prepTasks: [
      { type: 'flashcards', title: '15 Karteikarten: Glykolyse Grundlagen', topic: 'Glykolyse', completed: true, assignedDate: '2026-03-12', completedDate: '2026-03-13', cardCount: 15, linkedSetId: 306 },
      { type: 'exam-simulation', title: '20 Min: Prüfung Glykolyse Schritte', topic: 'Glykolyse', completed: false, assignedDate: '2026-03-15', examDurationMinutes: 20 },
      { type: 'flashcards', title: '15 Karteikarten: Citratzyklus', topic: 'Citratzyklus', completed: false, assignedDate: '2026-03-17', cardCount: 15 },
      { type: 'flashcards', title: '15 Karteikarten: Atmungskette & ATP', topic: 'Atmungskette', completed: false, assignedDate: '2026-03-18', cardCount: 15 },
      { type: 'exam-simulation', title: '25 Min: Prüfung Zellatmung komplett', topic: 'Zellatmung', completed: false, assignedDate: '2026-03-19', examDurationMinutes: 25 },
    ],
  },
];

interface GoalRecommendation {
  id: string;
  goalId: string;
  topic: string;
  subject: string;
  reason: string;
  severity: 'critical' | 'warning' | 'moderate';
  actions: ('flashcards' | 'exam-simulation')[];
}

const MOCK_GOAL_RECOMMENDATIONS: GoalRecommendation[] = [
  // ag1 – Quadratische Funktionen (Mathematik)
  { id: 'gr1', goalId: 'ag1', topic: 'Scheitelpunktform', subject: 'Mathematik', reason: 'Dein Fortschritt bei der Scheitelpunktform liegt bei nur 32% – das ist eine Kernkompetenz für quadratische Funktionen. Karteikarten helfen dir, die Umwandlung zu verinnerlichen.', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr2', goalId: 'ag1', topic: 'Nullstellen berechnen', subject: 'Mathematik', reason: 'Die p-q-Formel und das Faktorisieren sind essenziell. Dein letzter Übungstest zeigt Unsicherheiten bei Sonderfällen (Diskriminante = 0).', severity: 'warning', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr3', goalId: 'ag1', topic: 'Graphen verschieben & strecken', subject: 'Mathematik', reason: 'Du kannst bereits Grundformen zeichnen, aber Verschiebungen mit Parametern a, d und e solltest du noch üben, um dein Ziel zu erreichen.', severity: 'moderate', actions: ['flashcards', 'exam-simulation'] },
  // ag2 – Passé Composé (Französisch)
  { id: 'gr4', goalId: 'ag2', topic: 'Hilfsverben être/avoir', subject: 'Französisch', reason: 'Die KI hat erkannt, dass du être-Verben mit avoir konjugierst. Diese Grundlage muss sitzen, bevor du komplexere Sätze bildest.', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr5', goalId: 'ag2', topic: 'Participe passé Angleichung', subject: 'Französisch', reason: 'Die Angleichung bei être-Verben fehlt in 70% deiner Übungen. Gezieltes Training schließt diese Lücke schnell.', severity: 'warning', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr6', goalId: 'ag2', topic: 'Unregelmäßige Partizipien', subject: 'Französisch', reason: 'Die häufigsten unregelmäßigen Formen (fait, dit, pris, mis) solltest du noch absichern – sie kommen in fast jeder Aufgabe vor.', severity: 'moderate', actions: ['flashcards', 'exam-simulation'] },
  // ag3 – Zellatmung (Biologie)
  { id: 'gr7', goalId: 'ag3', topic: 'Glykolyse Schritte', subject: 'Biologie', reason: 'Du hast die Glykolyse noch gar nicht aktiv geübt. Sie ist der erste Schritt der Zellatmung und Grundlage für alles Weitere.', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr8', goalId: 'ag3', topic: 'Citratzyklus', subject: 'Biologie', reason: 'Ohne Verständnis des Citratzyklus fehlt dir die Verbindung zwischen Glykolyse und Atmungskette. Empfohlene Wiederholung.', severity: 'critical', actions: ['flashcards', 'exam-simulation'] },
  { id: 'gr9', goalId: 'ag3', topic: 'Atmungskette & ATP-Synthese', subject: 'Biologie', reason: 'Der Elektronentransport ist komplex, aber wenn du die vorherigen Schritte verstehst, wirst du auch die Atmungskette schaffen.', severity: 'warning', actions: ['flashcards', 'exam-simulation'] },
];

const MOCK_COMPLETED_GOAL_INSIGHTS: CompletedGoalInsight[] = [
  { id: 'cg1', topic: 'Lineare Gleichungen', subject: 'Mathematik', plannedDays: 14, actualDays: 12, completedOnTime: true, completedDate: '2026-03-05' },
  { id: 'cg2', topic: 'Simple Past', subject: 'Englisch', plannedDays: 10, actualDays: 8, completedOnTime: true, completedDate: '2026-02-20' },
  { id: 'cg3', topic: 'Photosynthese', subject: 'Biologie', plannedDays: 12, actualDays: 12, completedOnTime: true, completedDate: '2026-02-15' },
  { id: 'cg4', topic: 'Erörterung Aufbau', subject: 'Deutsch', plannedDays: 7, actualDays: 11, completedOnTime: false, completedDate: '2026-01-28' },
  { id: 'cg5', topic: 'Vokabeln B2 Unit 1-3', subject: 'Englisch', plannedDays: 21, actualDays: 19, completedOnTime: true, completedDate: '2026-01-10' },
];

type GoalsSubToggle = 'exams' | 'goals';

type TabKey = 'progress' | 'prognosis' | 'goals' | 'performance';
type PrognosisSubView = 'overview' | 'allWeaknesses' | 'allGaps' | 'allRisks';

interface ProfileAnalyticsScreenProps {
  isClosing?: boolean;
  onClose: () => void;
  isMobile?: boolean;
  externalTransition?: boolean;
  onGenerateForWeakness?: (context: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo' | 'learning-goal' | 'recommendation'; cardCount?: number; examTitle?: string; examId?: string; taskIndex?: number; severityLabel?: string; contextLabel?: string; notificationLabel?: string }) => void;
  onStartExamSimulation?: (context: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo' | 'learning-goal' | 'recommendation'; cardCount?: number; examTitle?: string; severityLabel?: string; contextLabel?: string; notificationLabel?: string }) => void;
  allSets?: FlashcardSet[];
  onOpenFlashcardSet?: (set: FlashcardSet) => void;
  onOpenLinkedFlashcardSet?: (setId: string) => void;
  pendingPrepTaskLink?: { examId: string; taskIndex: number; setId: number } | null;
  onRequestUpload?: (examId: string, subject: string, grade: string) => void;
}

// ===== REUSABLE COMPONENTS =====

const SeverityBadge = ({ severity }: { severity: 'critical' | 'warning' | 'moderate' }) => {
  const config = {
    critical: { label: 'Kritisch', color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)' },
    warning: { label: 'Mittel', color: '#FFB84D', bg: 'rgba(255,184,77,0.12)' },
    moderate: { label: 'Gering', color: '#00D4AA', bg: 'rgba(0,212,170,0.12)' },
  }[severity];
  return (
    <span
      className="px-2 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px]"
      style={{ color: config.color, backgroundColor: config.bg, border: `1px solid ${config.color}30` }}
    >
      {config.label}
    </span>
  );
};

const RiskBadge = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
  const config = {
    high: { label: 'Kritisch', color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)' },
    medium: { label: 'Mittel', color: '#FFB84D', bg: 'rgba(255,184,77,0.12)' },
    low: { label: 'Gering', color: 'rgba(255,255,255,0.50)', bg: 'rgba(255,255,255,0.06)' },
  }[level];
  return (
    <span
      className="px-2 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px]"
      style={{ color: config.color, backgroundColor: config.bg, border: `1px solid ${config.color}30` }}
    >
      {config.label}
    </span>
  );
};

const StatusBadge = ({ status }: { status: 'on-track' | 'needs-attention' | 'at-risk' }) => {
  const config = {
    'on-track': { label: 'Auf Kurs', color: '#00D4AA' },
    'needs-attention': { label: 'Schwankend', color: '#FFB800' },
    'at-risk': { label: 'Nachlassend', color: '#FF4444' },
  }[status];
  return (
    <span
      className="px-2 py-0.5 rounded-full font-['Poppins:Medium',sans-serif] text-[10px]"
      style={{ color: config.color, backgroundColor: `${config.color}15`, border: `1px solid ${config.color}30` }}
    >
      {config.label}
    </span>
  );
};

const TrendIcon = ({ trend }: { trend: 'up' | 'stable' | 'down' }) => {
  if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-[#00D4AA]" />;
  if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-[#FF4444]" />;
  return <Minus className="w-3.5 h-3.5 text-[#8E8E93]" />;
};

const ScoreRing = ({ score, size = 44, strokeWidth = 3.5 }: { score: number; size?: number; strokeWidth?: number }) => {
  const sw = Math.max(strokeWidth, 5);
  const radius = (size - sw) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = score >= 80 ? '#00D4AA' : score >= 50 ? '#FFB800' : '#FF4444';
  const fillLength = (score / 100) * circumference;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={`${fillLength} ${circumference - fillLength}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease', opacity: 0.8 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-['Poppins:Medium',sans-serif] text-[10px] text-white/70">
        {score}
      </span>
    </div>
  );
};

const ActionButton = ({ label, variant = 'primary', onClick }: { label: string; variant?: 'primary' | 'secondary'; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[12px] transition-all duration-150 active:scale-[0.97] ${
      variant === 'primary'
        ? 'bg-[#00B894]/10 text-[#00B894]/70 border border-[#00B894]/15'
        : 'bg-white/[0.04] text-white/60 border border-white/[0.08]'
    }`}
    style={{ WebkitTapHighlightColor: 'transparent' }}
  >
    {label}
  </button>
);

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ icon, title, badge }: { icon?: React.ReactNode; title: string; badge?: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-3">
    {icon && <div className="text-white/40">{icon}</div>}
    <h3 className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/70 uppercase tracking-wide">
      {title}
    </h3>
    {badge}
  </div>
);

// ===== DETERMINISTIC SCORE HELPER (for standardized card design) =====
const getTopicScore = (topic: string, type: string): number => {
  let hash = 0;
  for (let i = 0; i < topic.length; i++) hash = ((hash << 5) - hash + topic.charCodeAt(i)) | 0;
  const variation = Math.abs(hash % 15);
  const baseScores: Record<string, number> = {
    'strength': 78, 'weakness': 42, 'not-practiced': 8,
    'major': 22, 'moderate': 45, 'minor': 68,
    'critical-rec': 18, 'warning-rec': 40, 'moderate-rec': 65,
  };
  return Math.min(100, Math.max(0, (baseScores[type] ?? 50) + variation));
};

// ===== STANDARDIZED CARD (neutral GlassCard + progress bar – used everywhere) =====
const StandardCard = ({ subject, topic, detail, score, severityColor, severityLabel, severity, source, onGenerate, onStartExam, onOpenLinkedFlashcardSet, showFlashcards = true, showExam = true }: {
  subject: string; topic: string; detail: string; score: number;
  severityColor: string; severityLabel: string;
  severity?: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'recommendation';
  onGenerate?: (ctx?: any) => void; onStartExam?: (ctx?: any) => void;
  onOpenLinkedFlashcardSet?: (setId: string) => void;
  showFlashcards?: boolean; showExam?: boolean;
}) => {
  const severityBg = severityColor === '#FF6B6B' ? 'rgba(255,107,107,0.12)' : severityColor === '#FFB84D' ? 'rgba(255,184,77,0.12)' : 'rgba(0,212,170,0.12)';
  const effectiveSeverity = severity || (severityColor === '#FF6B6B' ? 'critical' : severityColor === '#FFB84D' ? 'warning' : 'moderate');
  const effectiveSource = source || 'weakness';
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/25 uppercase tracking-wider">{subject}</span>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/50">{score}%</span>
            <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }} />
            </div>
          </div>
          <span className="py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px] text-center" style={{ color: severityColor, backgroundColor: severityBg, border: `1px solid ${severityColor}30`, minWidth: '62px' }}>
            {severityLabel}
          </span>
        </div>
      </div>
      <h4 className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white mb-2">{topic}</h4>
      <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 leading-relaxed mb-3">{detail}</p>
      <WeaknessActionButtons
        source={effectiveSource}
        subject={subject}
        topic={topic}
        severity={effectiveSeverity}
        recommendation={detail}
        showFlashcards={showFlashcards}
        showExam={showExam}
        onGenerate={(ctx) => onGenerate?.(ctx)}
        onStartExam={(ctx) => onStartExam?.(ctx)}
        onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
      />
    </GlassCard>
  );
};

// ===== WEAKNESS CARD (Reusable across Übersicht & KI-Prognose) =====
const WeaknessCard = ({ item, onGenerate, onStartExam, onOpenLinkedFlashcardSet }: { item: WeaknessItem; showCriticality?: boolean; onGenerate?: (ctx?: any) => void; onStartExam?: (ctx?: any) => void; onOpenLinkedFlashcardSet?: (setId: string) => void; subjectColor?: string }) => {
  const severityColor = item.severity === 'critical' ? '#FF6B6B' : item.severity === 'warning' ? '#FFB84D' : '#00D4AA';
  const severityLabel = item.severity === 'critical' ? 'Kritisch' : item.severity === 'warning' ? 'Mittel' : 'Gering';
  const severityBg = item.severity === 'critical' ? 'rgba(255,107,107,0.12)' : item.severity === 'warning' ? 'rgba(255,184,77,0.12)' : 'rgba(0,212,170,0.12)';
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/25 uppercase tracking-wider">
          {item.subject}
        </span>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/50">
              {item.score}%
            </span>
            <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${item.score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }}
              />
            </div>
          </div>
          <span
            className="py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px] text-center"
            style={{ color: severityColor, backgroundColor: severityBg, border: `1px solid ${severityColor}30`, minWidth: '62px' }}
          >
            {severityLabel}
          </span>
        </div>
      </div>
      <h4 className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white mb-2">{item.topic}</h4>
      <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 leading-relaxed mb-3">
        {item.recommendation}
      </p>
      <WeaknessActionButtons
        source="weakness"
        subject={item.subject}
        topic={item.topic}
        severity={item.severity}
        recommendation={item.recommendation}
        onGenerate={(ctx) => onGenerate?.(ctx)}
        onStartExam={(ctx) => onStartExam?.(ctx)}
        onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
      />
    </GlassCard>
  );
};

// ===== EMPTY STATE =====
const EmptyState = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex flex-col items-center justify-center py-12 opacity-50">
    <div className="mb-3 text-white/30">{icon}</div>
    <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40 text-center">{text}</p>
  </div>
);

// ===== SKELETON =====
const SkeletonCard = () => (
  <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-4 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-white/[0.06]" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/[0.06] rounded w-3/4" />
        <div className="h-2.5 bg-white/[0.04] rounded w-1/2" />
      </div>
    </div>
    <div className="h-2.5 bg-white/[0.04] rounded w-full mb-2" />
    <div className="h-2.5 bg-white/[0.04] rounded w-2/3" />
  </div>
);

// ===== MAIN COMPONENT =====
export default React.memo(function ProfileAnalyticsScreen({ isClosing, onClose, isMobile = false, externalTransition = false, onGenerateForWeakness, onStartExamSimulation, allSets = [], onOpenFlashcardSet, onOpenLinkedFlashcardSet, pendingPrepTaskLink, onRequestUpload }: ProfileAnalyticsScreenProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('progress');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [tooltipsHidden, setTooltipsHidden] = useState(false);
  const [practicePopup, setPracticePopup] = useState<{ topic: string; subject: string } | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [weaknessSubjectFilter, setWeaknessSubjectFilter] = useState<string>('all');
  const [weaknessSeverityFilter, setWeaknessSeverityFilter] = useState<string>('all');
  const [prognosisSubView, setPrognosisSubView] = useState<PrognosisSubView>('overview');
  const [goalsSubToggle, setGoalsSubToggle] = useState<GoalsSubToggle>('exams');
  const [examDetailId, setExamDetailId] = useState<string | null>(null);
  const [showAllExams, setShowAllExams] = useState(false);
  const [examsSubjectFilter, setExamsSubjectFilter] = useState<string>('all');
  const [showAllInsights, setShowAllInsights] = useState(false);
  const [showAllGoals, setShowAllGoals] = useState(false);
  const [goalsSubjectFilter, setGoalsSubjectFilter] = useState<string>('all');
  const [goalDetailId, setGoalDetailId] = useState<string | null>(null);
  const [showAllGoalRecs, setShowAllGoalRecs] = useState(false);
  const [goalRecsSeverityFilter, setGoalRecsSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'moderate'>('all');
  const [showAllGoalDifficulties, setShowAllGoalDifficulties] = useState(false);
  const [goalDifficultySeverityFilter, setGoalDifficultySeverityFilter] = useState<'all' | 'major' | 'moderate' | 'minor'>('all');
  const [insightsSeverityFilter, setInsightsSeverityFilter] = useState<'all' | 'strength' | 'weakness' | 'not-practiced'>('all');
  const [showAllReachedGoals, setShowAllReachedGoals] = useState(false);
  const [reachedGoalsSubjectFilter, setReachedGoalsSubjectFilter] = useState<string>('all');
  const [reachedGoalsTimeFilter, setReachedGoalsTimeFilter] = useState<string>('all');
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);
  const [recsSeverityFilter, setRecsSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'moderate'>('all');
  // Completed exams state
  const [showAllCompletedExams, setShowAllCompletedExams] = useState(false);
  const [completedExamsSubjectFilter, setCompletedExamsSubjectFilter] = useState<string>('all');
  const [completedExamDetailId, setCompletedExamDetailId] = useState<string | null>(null);
  const [gradeModalExam, setGradeModalExam] = useState<CompletedExam | null>(null);
  const [gradeSelectedGrade, setGradeSelectedGrade] = useState('');
  const [gradeSelectedModifier, setGradeSelectedModifier] = useState<'+' | '' | '-'>('');
  const [gradeSaving, setGradeSaving] = useState(false);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const [uploadPromptExam, setUploadPromptExam] = useState<CompletedExam | null>(null);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [topicsFilter, setTopicsFilter] = useState<'all' | 'stärke' | 'schwachstelle' | 'lücke'>('all');
  const [uploadPromptGrade, setUploadPromptGrade] = useState('');
  const [examGradesVersion, setExamGradesVersion] = useState(0); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [perfTimeRange, setPerfTimeRange] = useState<'today' | 'weekly' | 'monthly' | 'all' | 'custom'>('weekly');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateFrom, setCustomDateFrom] = useState<string>('2026-01-01');
  const [customDateTo, setCustomDateTo] = useState<string>('2026-03-15');
  const [customRangeApplied, setCustomRangeApplied] = useState(false);
  // calendarMonth & selectingField removed – handled by PremiumCalendarPicker
  const scrollRef = useRef<HTMLDivElement>(null);
  const trendChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Mutable state for upcoming exams (so linkedSetId can be updated after generation)
  const [upcomingExams, setUpcomingExams] = useState(() => MOCK_UPCOMING_EXAMS.map(e => ({ ...e, prepTasks: e.prepTasks.map(t => ({ ...t })) })));

  // Helper: format date string to DD.MM.YYYY (component-level)
  const fmtDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // When a new flashcard set is linked to a prep task, update the exam state
  useEffect(() => {
    if (pendingPrepTaskLink) {
      setUpcomingExams(prev => prev.map(exam => {
        if (exam.id !== pendingPrepTaskLink.examId) return exam;
        return {
          ...exam,
          prepTasks: exam.prepTasks.map((task, idx) =>
            idx === pendingPrepTaskLink.taskIndex
              ? { ...task, linkedSetId: pendingPrepTaskLink.setId }
              : task
          ),
        };
      }));
    }
  }, [pendingPrepTaskLink]);

  // Subscribe to shared grade store for sync
  useEffect(() => {
    return examGradesStore.subscribe(() => setExamGradesVersion(v => v + 1));
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Show tutorial on first visit (after loading completes)
  useEffect(() => {
    if (!isLoading && shouldShowLernanalyseTutorial()) {
      setShowTutorial(true);
    }
  }, [isLoading]);

  // Scroll to top on tab change + reset filters
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    if (activeTab !== 'prognosis') {
      setWeaknessSubjectFilter('all');
      setWeaknessSeverityFilter('all');
    }
    setPrognosisSubView('overview');
    setExamDetailId(null);
    setShowAllExams(false);
    setExamsSubjectFilter('all');
    setShowAllInsights(false);
    setShowAllGoals(false);
    setGoalsSubjectFilter('all');
    setGoalDetailId(null);
    setShowAllGoalRecs(false);
    setGoalRecsSeverityFilter('all');
    setShowAllGoalDifficulties(false);
    setGoalDifficultySeverityFilter('all');
    setInsightsSeverityFilter('all');
    setShowAllReachedGoals(false);
    setReachedGoalsSubjectFilter('all');
    setReachedGoalsTimeFilter('all');
    setShowAllRecommendations(false);
    setRecsSeverityFilter('all');
    setShowAllCompletedExams(false);
    setCompletedExamsSubjectFilter('all');
    setCompletedExamDetailId(null);
  }, [activeTab]);

  // Scroll to top when switching prognosis sub-views + reset filters on back
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    if (prognosisSubView === 'overview') {
      setWeaknessSubjectFilter('all');
      setWeaknessSeverityFilter('all');
    }
  }, [prognosisSubView]);

  // Dismiss chart tooltips when clicking outside chart areas
  const handleScrollAreaClick = (e: React.MouseEvent) => {
    // If the click was inside a chart container, show tooltips
    if (
      trendChartRef.current?.contains(e.target as Node) ||
      barChartRef.current?.contains(e.target as Node)
    ) {
      setTooltipsHidden(false);
      return;
    }
    // Click was outside any chart → hide tooltips via CSS
    setTooltipsHidden(true);
  };

  const toggleSubject = (id: string) => {
    setExpandedSubjects(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'progress', label: 'Lernfortschritt', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'prognosis', label: 'Schwächen & Lücken', icon: <Brain className="w-4 h-4" /> },
    { key: 'goals', label: 'Ziele & Klausuren', icon: <Target className="w-4 h-4" /> },
    { key: 'performance', label: 'Leistung', icon: <Activity className="w-4 h-4" /> },
  ];

  // Compute KPIs
  const totalActivities = MOCK_ACTIVITIES.length;
  const avgPerformance = Math.round(
    MOCK_ACTIVITIES.filter(a => a.score != null).reduce((s, a) => s + (a.score || 0), 0) /
    MOCK_ACTIVITIES.filter(a => a.score != null).length
  );
  const overallProgress = Math.round(MOCK_SUBJECTS.reduce((s, sub) => s + sub.progress, 0) / MOCK_SUBJECTS.length);
  const criticalCount = MOCK_WEAKNESSES.filter(w => w.severity === 'critical').length;

  // ===== TAB: ÜBERSICHT – REMOVED (content moved to HomeScreen) =====
  // The following block is dead code kept only for reference and will be cleaned up later.
  if (false as boolean) { const _dead = () => {
    const perfTrendLabel = MOCK_UNIFIED_SUMMARY.trend === 'improving' ? 'Aufsteigend' :
      MOCK_UNIFIED_SUMMARY.trend === 'stable' ? 'Stabil' : 'Absteigend';
    const perfTrendColor = MOCK_UNIFIED_SUMMARY.trend === 'improving' ? '#00D4AA' :
      MOCK_UNIFIED_SUMMARY.trend === 'stable' ? '#FFB800' : '#FF4444';
    const perfTrendIcon = MOCK_UNIFIED_SUMMARY.trend === 'improving' ? <TrendingUp className="w-3.5 h-3.5" /> :
      MOCK_UNIFIED_SUMMARY.trend === 'stable' ? <Minus className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />;

    // Schwächen-Counts
    const critWeaknessCount = MOCK_WEAKNESSES.filter(w => w.severity === 'critical').length;
    const critWeaknessNames = MOCK_WEAKNESSES.filter(w => w.severity === 'critical').map(w => w.topic);

    // Lernzeit diese Woche (Minuten)
    const weekStart = new Date('2026-03-09');
    const weekEnd = new Date('2026-03-15');
    const parseMin = (dur: string) => parseInt(dur.replace(/[^\d]/g, '')) || 0;
    const weeklyActs = MOCK_ACTIVITIES.filter(a => {
      const d = new Date(a.date + 'T00:00:00');
      return d >= weekStart && d <= weekEnd;
    });
    const weeklyMinutes = weeklyActs.reduce((s, a) => s + parseMin(a.duration), 0);
    const weeklyHours = Math.floor(weeklyMinutes / 60);
    const weeklyMins = weeklyMinutes % 60;

    // Weekly average for Quick-Links
    const allScoredActs = MOCK_ACTIVITIES.filter(a => a.score != null);
    const weeklyScoredActs = allScoredActs.filter(a => {
      const d = new Date(a.date + 'T00:00:00');
      return d >= weekStart && d <= weekEnd;
    });
    const weeklyAvg = weeklyScoredActs.length > 0
      ? Math.round(weeklyScoredActs.reduce((s, a) => s + (a.score || 0), 0) / weeklyScoredActs.length)
      : null;

    // ===== "Das steht jetzt an" – Smart prioritized actions =====
    const ovMockToday = new Date('2026-03-17');
    interface OverviewActionItem {
      id: string;
      priority: 'red' | 'orange' | 'green';
      title: string;
      reason: string;
      actionLabel: string;
      onAction: () => void;
    }

    const actionItems: OverviewActionItem[] = [];

    // 1) Upcoming exams with <= 7 days and readiness < 80%
    for (const exam of upcomingExams) {
      const days = Math.ceil((new Date(exam.date).getTime() - ovMockToday.getTime()) / (1000 * 60 * 60 * 24));
      if (days <= 7 && days >= 0 && exam.overallReadiness < 80) {
        actionItems.push({
          id: `exam-${exam.id}`,
          priority: days <= 3 ? 'red' : 'orange',
          title: `${exam.subject}-Klausur ${days === 0 ? 'heute' : days === 1 ? 'morgen' : `in ${days} Tagen`} – Vorbereitung bei ${exam.overallReadiness}%`,
          reason: `${exam.prepTasks.filter(t => !t.completed).length} offene Aufgaben bis zur Klausur`,
          actionLabel: 'Details ansehen',
          onAction: () => { setActiveTab('goals'); setGoalsSubToggle('exams'); setTimeout(() => setExamDetailId(exam.id), 100); },
        });
      }
    }

    // 2) Critical weaknesses
    for (const w of MOCK_WEAKNESSES.filter(w => w.severity === 'critical').slice(0, 2)) {
      actionItems.push({
        id: `weakness-${w.id}`,
        priority: 'red',
        title: `Kritisch: ${w.topic} – nur ${w.score}%`,
        reason: `${w.subject} · ${w.recommendation.split('–')[0].trim()}`,
        actionLabel: 'Karteikarten',
        onAction: () => onGenerateForWeakness?.({ topic: w.topic, subject: w.subject, severity: w.severity, recommendation: w.recommendation, source: 'weakness' }),
      });
    }

    // 3) Open prep tasks (overdue or due today)
    for (const exam of upcomingExams) {
      for (let ti = 0; ti < exam.prepTasks.length; ti++) {
        const task = exam.prepTasks[ti];
        if (!task.completed) {
          const taskDate = new Date(task.assignedDate + 'T00:00:00');
          if (taskDate <= ovMockToday) {
            const isExamSim = task.type === 'exam-simulation';
            actionItems.push({
              id: `task-${exam.id}-${ti}`,
              priority: 'orange',
              title: `Offene Aufgabe: ${task.title}`,
              reason: `${exam.subject} · ${taskDate < ovMockToday ? `Seit ${Math.ceil((ovMockToday.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24))} Tagen offen` : 'Heute fällig'}`,
              actionLabel: isExamSim ? 'Prüfung starten' : 'Karteikarten',
              onAction: isExamSim
                ? () => onStartExamSimulation?.({ topic: task.topic, subject: exam.subject, severity: 'warning', recommendation: task.title, source: 'prep-todo', examTitle: exam.subject, severityLabel: 'Empfohlen' })
                : () => onGenerateForWeakness?.({ topic: task.topic, subject: exam.subject, severity: 'warning', recommendation: task.title, source: 'prep-todo', cardCount: task.cardCount, examTitle: exam.subject, examId: exam.id, taskIndex: ti, severityLabel: 'Empfohlen' }),
            });
          }
        }
      }
    }

    // 4) At-risk Lernziele
    for (const goal of MOCK_ACTIVE_GOALS.filter(g => g.status === 'at-risk')) {
      actionItems.push({
        id: `goal-${goal.id}`,
        priority: 'orange',
        title: `Lernziel „${goal.topic}" gefährdet`,
        reason: `${goal.subject} · Fortschritt stagniert bei ${goal.masteryCurrent}%`,
        actionLabel: 'Details ansehen',
        onAction: () => { setActiveTab('goals'); setGoalsSubToggle('goals'); setTimeout(() => setGoalDetailId(goal.id), 100); },
      });
    }

    // Sort by urgency: red first, then orange, then green. Max 3.
    const priorityOrder: Record<string, number> = { red: 0, orange: 1, green: 2 };
    const seen = new Set<string>();
    const sortedActions = actionItems
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      .filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .slice(0, 3);

    // ===== Nächste Klassenarbeit + Lernziel =====
    const nextExam = upcomingExams.length > 0 ? upcomingExams[0] : null;
    const nextExamDays = nextExam ? Math.ceil((new Date(nextExam.date).getTime() - ovMockToday.getTime()) / (1000 * 60 * 60 * 24)) : null;

    const nextGoal = [...MOCK_ACTIVE_GOALS].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0] || null;
    const nextGoalDays = nextGoal ? Math.ceil((new Date(nextGoal.dueDate).getTime() - ovMockToday.getTime()) / (1000 * 60 * 60 * 24)) : null;

    // Quick-Links data
    const totalWeaknesses = MOCK_WEAKNESSES.length + MOCK_KNOWLEDGE_GAPS_SELF.length + MOCK_RISKS.length;

    return (
    <div className="space-y-5">
      {/* ① Gesamtfortschritt – Hero (UNCHANGED) */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-5">
          <ScoreRing score={overallProgress} size={72} strokeWidth={5} />
          <div className="flex-1 min-w-0">
            <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 mb-0.5">Gesamtfortschritt</p>
            <p className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-white">{overallProgress}%</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: `${perfTrendColor}15`, color: perfTrendColor }}
              >
                {perfTrendIcon}
                <span className="font-['Poppins:Medium',sans-serif] text-[10px]">{perfTrendLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ② Deine Stärken (Top 3) */}
      <div>
        <SectionTitle icon={<TrendingUp className="w-4 h-4" />} title="Deine Stärken" />
        <div className="space-y-2">
          {MOCK_STRENGTHS.slice(0, 3).map(s => (
            <GlassCard key={s.id} className="p-3.5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: '#00D4AA' }} />
                <div className="flex-1 min-w-0">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white truncate">{s.topic}</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">{s.subject}</p>
                </div>
                <span className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#00D4AA] flex-shrink-0">{s.score}%</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* ③ Konsistente Schwächen (Top 3) */}
      <div>
        <SectionTitle icon={<AlertTriangle className="w-4 h-4" />} title="Konsistente Schwächen" />
        <div className="space-y-2">
          {MOCK_WEAKNESSES.slice(0, 3).map(w => {
            const accentColor = w.severity === 'critical' ? '#FF6B6B' : '#FFB84D';
            return (
              <GlassCard key={w.id} className="p-3.5">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: accentColor }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white truncate">{w.topic}</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">{w.subject}</p>
                  </div>
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[16px] flex-shrink-0" style={{ color: accentColor }}>{w.score}%</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] transition-all duration-150 active:scale-[0.97]"
                    style={{ background: 'rgba(0,184,148,0.07)', border: '1px solid rgba(0,184,148,0.25)', color: 'rgba(255,255,255,0.9)', WebkitTapHighlightColor: 'transparent' }}
                  >
                    Karteikarten erstellen
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] transition-all duration-150 active:scale-[0.97]"
                    style={{ background: 'rgba(0,184,148,0.07)', border: '1px solid rgba(0,184,148,0.25)', color: 'rgba(255,255,255,0.9)', WebkitTapHighlightColor: 'transparent' }}
                  >
                    Prüfung starten
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>



      {/* ④ Lern-Streak + Lernzeit (UNCHANGED) */}
      <div>
        <SectionTitle icon={<Flame className="w-4 h-4" />} title="Lern-Streak" />
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-1.5">
                <span className="font-['Poppins:SemiBold',sans-serif] text-[24px] text-[#FF9F43]">5</span>
                <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">Tage</span>
              </div>
              <div className="h-5 w-px bg-white/[0.06]" />
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-white/25" />
                <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">Längste: <span className="text-white/50">12 Tage</span></span>
              </div>
            </div>
            {/* Lernzeit diese Woche */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-white/25" />
              <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/40">
                {weeklyHours > 0 ? `${weeklyHours}h ` : ''}{weeklyMins}min
              </span>
            </div>
          </div>
          {/* Weekly heatmap */}
          <div className="flex items-center gap-1.5">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, i) => {
              const isActive = i < 5;
              const isToday = i === 0;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full aspect-square rounded-lg flex items-center justify-center transition-colors"
                    style={{
                      background: isActive
                        ? isToday
                          ? 'rgba(255,159,67,0.20)'
                          : 'rgba(255,159,67,0.10)'
                        : 'rgba(255,255,255,0.03)',
                      border: isToday ? '1px solid rgba(255,159,67,0.35)' : '1px solid transparent',
                    }}
                  >
                    {isActive && <Flame className="w-3 h-3" style={{ color: isToday ? '#FF9F43' : 'rgba(255,159,67,0.50)' }} />}
                  </div>
                  <span
                    className="font-['Poppins:Medium',sans-serif] text-[9px]"
                    style={{ color: isToday ? '#FF9F43' : 'rgba(255,255,255,0.25)' }}
                  >
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* ⑥ Quick-Links – Deine Analyse im Detail (NEW) */}
      <div>
        <SectionTitle title="Deine Analyse im Detail" />
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setActiveTab('progress')}
            className="text-left transition-all duration-150 active:scale-[0.97]"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <GlassCard className="p-3.5 h-full">
              <BarChart3 className="w-[18px] h-[18px] text-white/30 mb-2" />
              <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50 mb-1">Lernfortschritt</p>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white">{overallProgress}%</p>
            </GlassCard>
          </button>

          <button
            onClick={() => setActiveTab('prognosis')}
            className="text-left transition-all duration-150 active:scale-[0.97]"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <GlassCard className="p-3.5 h-full">
              <Brain className="w-[18px] h-[18px] text-white/30 mb-2" />
              <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50 mb-1">Schwächen & Lücken</p>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white">{totalWeaknesses} <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">erkannt</span></p>
            </GlassCard>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className="text-left transition-all duration-150 active:scale-[0.97]"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <GlassCard className="p-3.5 h-full">
              <Target className="w-[18px] h-[18px] text-white/30 mb-2" />
              <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50 mb-1">Ziele & Klausuren</p>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                {MOCK_ACTIVE_GOALS.length} Ziele · {upcomingExams.length} Klausuren
              </p>
            </GlassCard>
          </button>

          <button
            onClick={() => setActiveTab('performance')}
            className="text-left transition-all duration-150 active:scale-[0.97]"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <GlassCard className="p-3.5 h-full">
              <Activity className="w-[18px] h-[18px] text-white/30 mb-2" />
              <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50 mb-1">Leistung</p>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white">
                {weeklyAvg != null ? `Ø ${weeklyAvg}%` : '–'}
              </p>
            </GlassCard>
          </button>
        </div>
      </div>
    </div>
    );
  }; }

  // ===== TAB: LERNFORTSCHRITT =====
  const progressBarColor = (score: number) =>
    score >= 80 ? '#00D4AA' : score >= 50 ? '#FFB800' : '#FF4444';

  const renderProgress = () => (
    <div className="space-y-6">
      {/* Gesamtfortschritt */}
      <div
        className="rounded-xl p-4"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <h3 className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-white/40 uppercase tracking-wider mb-2.5">
          Gesamtfortschritt
        </h3>
        <div className="flex items-baseline gap-1.5 mb-3.5">
          <span className="font-['Poppins:SemiBold',sans-serif] text-[28px] text-white leading-none">
            {overallProgress}%
          </span>
          {(() => {
            const overallTrend = Math.round(MOCK_SUBJECTS.reduce((s, sub) => s + sub.trend, 0) / MOCK_SUBJECTS.length);
            if (overallTrend === 0) return null;
            const isUp = overallTrend > 0;
            return (
              <div className="flex items-center ml-0.5 mb-0.5">
                {isUp
                  ? <TrendingUp className="w-3.5 h-3.5 text-[#00D4AA]/50" />
                  : <TrendingDown className="w-3.5 h-3.5 text-[#FF4444]/50" />
                }
              </div>
            );
          })()}
        </div>
        <div className="relative h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-2.5">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${overallProgress}%`,
              background: '#00D4AA',
              opacity: 0.8,
              transition: 'width 0.8s ease',
            }}
          />
        </div>
        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25">
          Basierend auf allen Fächern
        </p>
      </div>

      {/* Fächer */}
      <div>
        <SectionTitle icon={<BookOpen className="w-4 h-4" />} title="Fächerübersicht" />
        <div className="space-y-3">
          {MOCK_SUBJECTS.map(sub => {
            const isExpanded = expandedSubjects.has(sub.id);
            return (
              <GlassCard key={sub.id} className="overflow-hidden">
                {/* Level 1 – Subject */}
                <button
                  onClick={() => toggleSubject(sub.id)}
                  className="w-full px-4 py-3.5 flex items-center gap-3 active:bg-white/[0.02] transition-colors"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">{sub.name}</span>
                      <StatusBadge status={sub.status} />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">
                        Fortschritt {sub.progress}%
                      </span>
                    </div>
                  </div>
                  <ScoreRing score={sub.progress} size={38} strokeWidth={3} />
                  <ChevronDown
                    className={`w-4 h-4 text-white/30 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Level 2 – Kategorien */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/[0.06]">
                    <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/20 uppercase tracking-wider mt-3.5 mb-3">
                      Kategorien
                    </p>
                    <div className="space-y-2">
                      {sub.categories.map(cat => {
                        const isCatExpanded = expandedCategories.has(cat.id);
                        const barColor = progressBarColor(cat.progress);
                        return (
                          <div
                            key={cat.id}
                            className="rounded-xl overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}
                          >
                            {/* Category Header */}
                            <button
                              onClick={() => toggleCategory(cat.id)}
                              className="w-full px-3.5 py-3 flex items-center gap-3 active:bg-white/[0.02] transition-colors"
                              style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/75">
                                    {cat.name}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    {(() => {
                                      const avgTrend = cat.topics.reduce((s, t) => s + t.trend, 0) / cat.topics.length;
                                      if (Math.abs(avgTrend) < 0.5) return null;
                                      return avgTrend > 0
                                        ? <TrendingUp className="w-3 h-3 text-[#00D4AA]/50" />
                                        : <TrendingDown className="w-3 h-3 text-[#FF4444]/50" />;
                                    })()}
                                    <span className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white/60">
                                      {cat.progress}%
                                    </span>
                                  </div>
                                </div>
                                <div className="relative h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
                                  <div
                                    className="absolute inset-y-0 left-0 rounded-full"
                                    style={{
                                      width: `${cat.progress}%`,
                                      backgroundColor: barColor,
                                      opacity: 0.75,
                                      transition: 'width 0.6s ease',
                                    }}
                                  />
                                </div>
                              </div>
                              <ChevronRight
                                className={`w-3.5 h-3.5 text-white/15 flex-shrink-0 transition-transform duration-200 ${isCatExpanded ? 'rotate-90' : ''}`}
                              />
                            </button>

                            {/* Level 3 – Themen */}
                            {isCatExpanded && (
                              <div className="px-3.5 pb-3.5 border-t border-white/[0.04]">
                                <div className="mt-3 space-y-0.5">
                                  {cat.topics.map(topic => {
                                    const topicColor = progressBarColor(topic.mastery);
                                    return (
                                      <div
                                        key={topic.id}
                                        className="flex items-center gap-3 py-2.5 px-2.5 rounded-lg transition-colors hover:bg-white/[0.02]"
                                      >
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between">
                                            <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/65 truncate">
                                              {topic.name}
                                            </span>
                                            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                              {topic.trend !== 0 && (
                                                topic.trend > 0
                                                  ? <TrendingUp className="w-3 h-3 text-[#00D4AA]/60" />
                                                  : <TrendingDown className="w-3 h-3 text-[#FF4444]/60" />
                                              )}
                                              <span className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white/50 w-8 text-right">
                                                {topic.mastery}%
                                              </span>
                                            </div>
                                          </div>
                                          <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/20 mt-0.5 block">
                                            {topic.completedExercises}/{topic.totalExercises} Aufgaben
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ===== TAB: SCHWÄCHEN & LÜCKEN =====
  const INITIAL_PREVIEW_COUNT = 2;

  const subjectColors: Record<string, string> = {
    'Mathematik': '#7B61FF',
    'Deutsch': '#FF6B6B',
    'Englisch': '#4A9EFF',
    'Biologie': '#00D4AA',
    'Französisch': '#FFB84D',
    'Geschichte': '#FF8C00',
  };

  const allPrognosisSubjects = Array.from(new Set([
    ...MOCK_WEAKNESSES.map(w => w.subject),
    ...MOCK_KNOWLEDGE_GAPS_SELF.map(g => g.subject),
    ...MOCK_RISKS.map(r => r.subject),
  ])).sort();

  const riskSeverityMap: Record<string, string> = { high: 'critical', medium: 'warning', low: 'moderate' };

  // Filtered data (shared across overview and sub-views)
  const filteredWeaknesses = MOCK_WEAKNESSES.filter(w => {
    if (weaknessSubjectFilter !== 'all' && w.subject !== weaknessSubjectFilter) return false;
    if (weaknessSeverityFilter !== 'all' && w.severity !== weaknessSeverityFilter) return false;
    return true;
  });

  const filteredGaps = MOCK_KNOWLEDGE_GAPS_SELF.filter(g => {
    if (weaknessSubjectFilter !== 'all' && g.subject !== weaknessSubjectFilter) return false;
    if (weaknessSeverityFilter !== 'all' && g.severity !== weaknessSeverityFilter) return false;
    return true;
  });

  const filteredRisks = MOCK_RISKS.filter(r => {
    if (weaknessSubjectFilter !== 'all' && r.subject !== weaknessSubjectFilter) return false;
    if (weaknessSeverityFilter !== 'all' && riskSeverityMap[r.riskLevel] !== weaknessSeverityFilter) return false;
    return true;
  });

  // Severity filter config – matches TutoringProgressScreen exactly
  const severityFilterConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    all:      { label: 'Alle',     color: '#00D4AA',                bg: 'rgba(0,184,148,0.10)',     border: 'rgba(0,184,148,0.30)' },
    critical: { label: 'Kritisch', color: '#FF6B6B',                bg: 'rgba(255,107,107,0.10)',   border: 'rgba(255,107,107,0.30)' },
    warning:  { label: 'Mittel',   color: '#FFB84D',                bg: 'rgba(255,184,77,0.10)',    border: 'rgba(255,184,77,0.30)' },
    moderate: { label: 'Gering',   color: '#00D4AA',                bg: 'rgba(0,212,170,0.10)',   border: 'rgba(0,212,170,0.30)' },
  };

  // Shared: "Alle anzeigen" button (like TutoringProgressScreen)
  const PrognosisShowMoreButton = ({ label, count, onClick }: { label: string; count: number; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-[14px] h-[44px] flex items-center justify-center gap-2 border border-white/[0.08] active:scale-[0.98] transition-all duration-200 mt-2"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/70">
        {label} ({count})
      </span>
      <ChevronRight className="w-3.5 h-3.5 text-white/70" />
    </button>
  );

  // Shared: Subject + Severity filter chips for sub-views
  const renderSubViewFilters = () => (
    <>
      {/* Filter: Fach */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
        <button
          onClick={() => setWeaknessSubjectFilter('all')}
          className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] whitespace-nowrap transition-all flex-shrink-0"
          style={{
            WebkitTapHighlightColor: 'transparent',
            background: weaknessSubjectFilter === 'all' ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${weaknessSubjectFilter === 'all' ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
            color: weaknessSubjectFilter === 'all' ? '#00D4AA' : 'rgba(255,255,255,0.5)',
          }}
        >
          Alle Fächer
        </button>
        {allPrognosisSubjects.map(subject => {
          const isActive = weaknessSubjectFilter === subject;
          return (
            <button
              key={subject}
              onClick={() => setWeaknessSubjectFilter(isActive ? 'all' : subject)}
              className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] whitespace-nowrap transition-all flex-shrink-0"
              style={{
                WebkitTapHighlightColor: 'transparent',
                background: isActive ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.5)',
              }}
            >
              {subject}
            </button>
          );
        })}
      </div>

      {/* Filter: Severity */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {(['all', 'critical', 'warning', 'moderate'] as const).map(sevKey => {
          const isActive = weaknessSeverityFilter === sevKey;
          const config = severityFilterConfig[sevKey];
          return (
            <button
              key={sevKey}
              onClick={() => setWeaknessSeverityFilter(isActive && sevKey !== 'all' ? 'all' : sevKey)}
              className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5"
              style={{
                WebkitTapHighlightColor: 'transparent',
                background: isActive ? config.bg : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isActive ? config.border : 'rgba(255,255,255,0.08)'}`,
                color: isActive ? config.color : 'rgba(255,255,255,0.5)',
              }}
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </>
  );

  // Shared: render a single gap card (used in overview + sub-view)
  const renderGapCard = (gap: KnowledgeGapItem) => {
    const severityColor = gap.severity === 'critical' ? '#FF6B6B' : gap.severity === 'warning' ? '#FFB84D' : '#00D4AA';
    const severityLabel = gap.severity === 'critical' ? 'Kritisch' : gap.severity === 'warning' ? 'Mittel' : 'Gering';
    const severityBg = gap.severity === 'critical' ? 'rgba(255,107,107,0.12)' : gap.severity === 'warning' ? 'rgba(255,184,77,0.12)' : 'rgba(0,212,170,0.12)';
    return (
      <GlassCard key={gap.id} className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/25 uppercase tracking-wider">
            {gap.subject}
          </span>
          <div className="flex items-center gap-2.5">
            {/* Compact progress indicator */}
            <div className="flex items-center gap-1.5">
              <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/50">
                {gap.score}%
              </span>
              <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${gap.score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }}
                />
              </div>
            </div>
            <span
              className="py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px] text-center"
              style={{ color: severityColor, backgroundColor: severityBg, border: `1px solid ${severityColor}30`, minWidth: '62px' }}
            >
              {severityLabel}
            </span>
          </div>
        </div>
        <h4 className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white mb-2">{gap.title}</h4>
        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 leading-relaxed mb-3">
          {gap.description}
        </p>
        <WeaknessActionButtons
          source="knowledge-gap"
          subject={gap.subject}
          topic={gap.title}
          severity={gap.severity}
          recommendation={gap.description}
          onGenerate={(ctx) => onGenerateForWeakness?.(ctx)}
          onStartExam={(ctx) => onStartExamSimulation?.(ctx)}
          onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
        />
      </GlassCard>
    );
  };

  // Shared: render a single risk card (used in overview + sub-view)
  const renderRiskCard = (r: RiskItem) => {
    const severityColor = r.riskLevel === 'high' ? '#FF6B6B' : r.riskLevel === 'medium' ? '#FFB84D' : '#00D4AA';
    const severityLabel = r.riskLevel === 'high' ? 'Kritisch' : r.riskLevel === 'medium' ? 'Mittel' : 'Gering';
    const severityBg = r.riskLevel === 'high' ? 'rgba(255,107,107,0.12)' : r.riskLevel === 'medium' ? 'rgba(255,184,77,0.12)' : 'rgba(0,212,170,0.12)';
    return (
      <GlassCard key={r.id} className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/25 uppercase tracking-wider">
            {r.subject}
          </span>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/50">
                {r.score}%
              </span>
              <div className="relative overflow-hidden rounded-full" style={{ width: 36, height: 3, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${r.score}%`, backgroundColor: 'rgba(255,255,255,0.45)', transition: 'width 0.6s ease' }}
                />
              </div>
            </div>
            <span
              className="py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px] text-center"
              style={{ color: severityColor, backgroundColor: severityBg, border: `1px solid ${severityColor}30`, minWidth: '62px' }}
            >
              {severityLabel}
            </span>
          </div>
        </div>
        <h4 className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white mb-2">{r.topic}</h4>
        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 leading-relaxed mb-3">
          {r.reason}
        </p>
        <WeaknessActionButtons
          source="risk"
          subject={r.subject}
          topic={r.topic}
          severity={r.riskLevel}
          recommendation={r.reason}
          onGenerate={(ctx) => onGenerateForWeakness?.(ctx)}
          onStartExam={(ctx) => onStartExamSimulation?.(ctx)}
          onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
        />
      </GlassCard>
    );
  };

  // ===== PROGNOSIS: OVERVIEW (2 items + show more) =====
  const renderPrognosisOverview = () => (
    <div className="space-y-5">
      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-2.5">
        <GlassCard className="p-3 text-center">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#FF4444]">{MOCK_WEAKNESSES.length}</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/40">Schwächen</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-[#FF4444]/70 mt-0.5">{MOCK_WEAKNESSES.filter(w => w.severity === 'critical').length} kritisch</p>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#2D9E78]">{MOCK_KNOWLEDGE_GAPS_SELF.length}</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/40">Wissenslücken</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-[#2D9E78]/70 mt-0.5">{MOCK_KNOWLEDGE_GAPS_SELF.filter(g => g.severity === 'critical').length} kritisch</p>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#FFB800]">{MOCK_RISKS.length}</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/40">Risiken</p>
          <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-[#FFB800]/70 mt-0.5">{MOCK_RISKS.filter(r => r.riskLevel === 'high').length} kritisch</p>
        </GlassCard>
      </div>

      {/* SECTION 1 – Erkannte Schwächen (preview: 2 items) */}
      {MOCK_WEAKNESSES.length > 0 && (
        <div className="pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <SectionTitle icon={<AlertTriangle className="w-4 h-4 text-[#FF6B6B]" />} title={`Erkannte Schwächen (${MOCK_WEAKNESSES.length})`} />
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 -mt-2 mb-3">
            Inhalte, bei denen Schwierigkeiten aufgefallen sind
          </p>
          <div className="space-y-2">
            {MOCK_WEAKNESSES.slice(0, INITIAL_PREVIEW_COUNT).map(w => (
              <WeaknessCard key={w.id} item={w} subjectColor={subjectColors[w.subject]} showCriticality={w.severity === 'critical'} onGenerate={() => onGenerateForWeakness?.({ topic: w.topic, subject: w.subject, severity: w.severity, recommendation: w.recommendation, source: 'weakness' })} onStartExam={() => onStartExamSimulation?.({ topic: w.topic, subject: w.subject, severity: w.severity, recommendation: w.recommendation, source: 'weakness' })} />
            ))}
          </div>
          {MOCK_WEAKNESSES.length > INITIAL_PREVIEW_COUNT && (
            <PrognosisShowMoreButton
              label="Alle Schwächen anzeigen"
              count={MOCK_WEAKNESSES.length}
              onClick={() => setPrognosisSubView('allWeaknesses')}
            />
          )}
        </div>
      )}

      {/* SECTION 2 – KI-Wissenslücken (preview: 2 items) */}
      {MOCK_KNOWLEDGE_GAPS_SELF.length > 0 && (
        <div className="pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <SectionTitle icon={<Brain className="w-4 h-4 text-[#2D9E78]" />} title={`KI-Wissenslücken (${MOCK_KNOWLEDGE_GAPS_SELF.length})`} />
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 -mt-2 mb-3">
            Die KI hat die eigentlichen Ursachen dahinter erkannt, die mehrere deiner Schwächen verursachen könnten. Das Beheben einer Lücke kann mehrere Probleme gleichzeitig lösen.
          </p>
          <div className="space-y-2">
            {MOCK_KNOWLEDGE_GAPS_SELF.slice(0, INITIAL_PREVIEW_COUNT).map(gap => renderGapCard(gap))}
          </div>
          {MOCK_KNOWLEDGE_GAPS_SELF.length > INITIAL_PREVIEW_COUNT && (
            <PrognosisShowMoreButton
              label="Alle Wissenslücken anzeigen"
              count={MOCK_KNOWLEDGE_GAPS_SELF.length}
              onClick={() => setPrognosisSubView('allGaps')}
            />
          )}
        </div>
      )}

      {/* SECTION 3 – Zukünftige Risiken (preview: 2 items) */}
      {MOCK_RISKS.length > 0 && (
        <div className="pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <SectionTitle icon={<ShieldAlert className="w-4 h-4 text-[#FFB84D]" />} title={`Zukünftige Risiken (${MOCK_RISKS.length})`} />
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 -mt-2 mb-3">
            Themen, die zukünftig relevant sein könnten und Aufmerksamkeit brauchen
          </p>
          <div className="space-y-2">
            {MOCK_RISKS.slice(0, INITIAL_PREVIEW_COUNT).map(r => renderRiskCard(r))}
          </div>
          {MOCK_RISKS.length > INITIAL_PREVIEW_COUNT && (
            <PrognosisShowMoreButton
              label="Alle Risiken anzeigen"
              count={MOCK_RISKS.length}
              onClick={() => setPrognosisSubView('allRisks')}
            />
          )}
        </div>
      )}
    </div>
  );

  // GPU-optimized slide transition style (matches TutoringProgressScreen exactly)
  const prognosisSlideStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    transition: 'transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)',
    willChange: 'transform, opacity',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
  };

  // Shared helpers (used in renderGoals and overlays)
  const mockToday = new Date('2026-03-17');
  const daysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - mockToday.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // ===== TAB: ZIELE & KLAUSUREN =====
  const renderGoals = () => {

    // Past exam insights calculations
    const pastExams = MOCK_PAST_EXAM_INSIGHTS;
    const highPrepExams = pastExams.filter(e => e.prepPercent >= 70);
    const lowPrepExams = pastExams.filter(e => e.prepPercent < 50);
    const highPrepAvg = highPrepExams.length > 0
      ? (highPrepExams.reduce((s, e) => s + e.grade, 0) / highPrepExams.length).toFixed(1)
      : '–';
    const lowPrepAvg = lowPrepExams.length > 0
      ? (lowPrepExams.reduce((s, e) => s + e.grade, 0) / lowPrepExams.length).toFixed(1)
      : '–';
    const highPrepRange = highPrepExams.length > 0
      ? { min: Math.min(...highPrepExams.map(e => e.prepPercent)), max: Math.max(...highPrepExams.map(e => e.prepPercent)) }
      : { min: 0, max: 0 };
    const lowPrepRange = lowPrepExams.length > 0
      ? { min: Math.min(...lowPrepExams.map(e => e.prepPercent)), max: Math.max(...lowPrepExams.map(e => e.prepPercent)) }
      : { min: 0, max: 0 };
    const formatRange = (r: {min: number, max: number}) =>
      r.min === r.max ? `${r.min}%` : `${r.min}–${r.max}%`;
    const gradeAvg = pastExams.length > 0
      ? (pastExams.reduce((s, e) => s + e.grade, 0) / pastExams.length).toFixed(1)
      : '–';
    // Grade trend (last 3 vs first 3)
    const recentGrades = pastExams.slice(0, 3);
    const olderGrades = pastExams.slice(3);
    const recentAvg = recentGrades.reduce((s, e) => s + e.grade, 0) / recentGrades.length;
    const olderAvg = olderGrades.length > 0 ? olderGrades.reduce((s, e) => s + e.grade, 0) / olderGrades.length : recentAvg;
    const gradeTrend: 'improving' | 'stable' | 'declining' = olderAvg - recentAvg > 0.3 ? 'improving' : recentAvg - olderAvg > 0.3 ? 'declining' : 'stable';

    // Goal insights calculations
    const completedGoals = MOCK_COMPLETED_GOAL_INSIGHTS;
    const onTimeCount = completedGoals.filter(g => g.completedOnTime).length;
    const successRate = completedGoals.length > 0 ? Math.round((onTimeCount / completedGoals.length) * 100) : 0;
    const avgPlannedDays = completedGoals.length > 0
      ? Math.round(completedGoals.reduce((s, g) => s + g.plannedDays, 0) / completedGoals.length)
      : 0;
    const avgActualDays = completedGoals.length > 0
      ? Math.round(completedGoals.reduce((s, g) => s + g.actualDays, 0) / completedGoals.length)
      : 0;

    return (
      <div className="space-y-5">
        {/* Sub-Toggle */}
        <div
          className="flex rounded-xl p-1 gap-0.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {([
            { key: 'exams' as GoalsSubToggle, label: 'Klassenarbeiten', icon: <GraduationCap className="w-3.5 h-3.5" /> },
            { key: 'goals' as GoalsSubToggle, label: 'Lernziele', icon: <Target className="w-3.5 h-3.5" /> },
          ]).map(item => {
            const isActive = goalsSubToggle === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setGoalsSubToggle(item.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-['Poppins:Medium',sans-serif] text-[12px] transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? 'bg-white/[0.08] text-white border border-white/[0.10]'
                    : 'text-white/35 border border-transparent'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span className={isActive ? 'text-white/70' : 'text-white/25'}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* ===== KLASSENARBEITEN VIEW ===== */}
        {goalsSubToggle === 'exams' && (
          <div className="space-y-5">
            {/* Bevorstehende Klausuren (only future exams) */}
            {(() => {
              const futureExams = upcomingExams.filter(e => daysUntil(e.date) >= 0);
              return (
                <>
                  <SectionTitle
                    icon={<CalendarDays className="w-4 h-4" />}
                    title="Bevorstehende Klausuren"
                    badge={
                      <span className="px-2 py-0.5 rounded-full font-['Poppins:Medium',sans-serif] text-[10px] text-white/40 bg-white/[0.05] border border-white/[0.08]">
                        {futureExams.length}
                      </span>
                    }
                  />

            {futureExams.length === 0 ? (
              <EmptyState icon={<CalendarDays className="w-8 h-8" />} text="Keine bevorstehenden Klausuren" />
            ) : (() => {
              const visibleExams = futureExams.slice(0, 2);
              const hiddenCount = futureExams.length - 2;
              return (
                <div className="space-y-3">
                  {visibleExams.map(exam => {
                    const days = daysUntil(exam.date);
                    const countdownColor = days <= 3 ? '#FF6B6B' : days <= 7 ? '#FFB84D' : '#00D4AA';
                    const readiness = exam.overallReadiness;
                    const readinessColor = '#00D4AA';

                    return (
                      <button
                        key={exam.id}
                        onClick={() => { setExamDetailId(exam.id); setShowAllRecommendations(false); }}
                        className="w-full text-left transition-all duration-150 active:scale-[0.98]"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <GlassCard className="p-4">
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">{exam.subject}</span>
                              <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">· {formatDate(exam.date)}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px]" style={{ color: countdownColor, background: `${countdownColor}15`, border: `1px solid ${countdownColor}30` }}>
                              {days === 0 ? 'Heute' : days === 1 ? 'Morgen' : `In ${days} Tagen`}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50">Vorbereitung</span>
                              <span className="font-['Poppins:SemiBold',sans-serif] text-[11px]" style={{ color: readinessColor }}>{readiness}%</span>
                            </div>
                            <div className="relative h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${readiness}%`, background: readinessColor, transition: 'width 0.6s ease', opacity: 0.8 }} />
                            </div>
                          </div>
                          <div className="flex justify-end mt-2">
                            <ChevronRight className="w-4 h-4 text-white/20" />
                          </div>
                        </GlassCard>
                      </button>
                    );
                  })}
                  {/* "Mehr anzeigen" button */}
                  {hiddenCount > 0 && (
                    <button
                      onClick={() => { setShowAllExams(true); setExamsSubjectFilter('all'); }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-['Poppins:Medium',sans-serif] text-[11px] text-white/35 transition-all active:scale-[0.98]"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', WebkitTapHighlightColor: 'transparent' }}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      Alle {futureExams.length} Klassenarbeiten anzeigen
                    </button>
                  )}
                </div>
              );
            })()}
                </>
              );
            })()}

            {/* ===== ABGESCHLOSSENE KLAUSUREN ===== */}
            {(() => {
              // Auto-archive: exams whose date has passed move here
              const archivedFromUpcoming = upcomingExams.filter(e => daysUntil(e.date) < 0).map(e => ({
                id: e.id, subject: e.subject, date: e.date, overallReadiness: e.overallReadiness,
              }));
              const allCompleted = [...archivedFromUpcoming, ...MOCK_COMPLETED_EXAMS]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              if (allCompleted.length === 0) return null;

              const gradeColors: Record<string, { bg: string; border: string; text: string }> = {
                '1': { bg: 'rgba(74, 222, 128, 0.12)', border: 'rgba(74, 222, 128, 0.25)', text: '#4ADE80' },
                '2': { bg: 'rgba(96, 200, 120, 0.12)', border: 'rgba(96, 200, 120, 0.25)', text: '#60C878' },
                '3': { bg: 'rgba(232, 185, 96, 0.12)', border: 'rgba(232, 185, 96, 0.25)', text: '#E8B960' },
                '4': { bg: 'rgba(245, 158, 66, 0.12)', border: 'rgba(245, 158, 66, 0.25)', text: '#F59E42' },
                '5': { bg: 'rgba(255, 120, 80, 0.12)', border: 'rgba(255, 120, 80, 0.25)', text: '#FF7850' },
                '6': { bg: 'rgba(255, 69, 58, 0.12)', border: 'rgba(255, 69, 58, 0.25)', text: '#FF453A' },
              };
              const visibleCompleted = allCompleted.slice(0, 2);
              const hiddenCompletedCount = allCompleted.length - 2;

              const renderCompletedCard = (exam: CompletedExam) => {
                const grade = examGradesStore.getGrade(exam.id);
                const baseGrade = grade ? grade.replace(/[+-]/, '') : '';
                const gc = baseGrade ? gradeColors[baseGrade] : null;
                return (
                  <button
                    key={exam.id}
                    onClick={() => setCompletedExamDetailId(exam.id)}
                    className="w-full text-left transition-all duration-150 active:scale-[0.98]"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <GlassCard className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/25 uppercase tracking-wider">{exam.subject}</span>
                        {grade ? (
                          <div className="flex items-center px-2.5 py-1 rounded-full" style={{ background: gc?.bg || 'rgba(255,255,255,0.06)', border: `1px solid ${gc?.border || 'rgba(255,255,255,0.12)'}` }}>
                            <span className="font-['Poppins:Bold',sans-serif] text-[13px]" style={{ color: gc?.text || 'white' }}>{grade}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-['Poppins:Medium',sans-serif] text-[10px] whitespace-nowrap" style={{ backgroundColor: 'rgba(212,160,68,0.10)', border: '1px dashed rgba(212,160,68,0.25)' }}>
                            <Star className="w-2.5 h-2.5 text-[#D4A044]/60" />
                            <span className="text-[#D4A044]/60">Note?</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white mb-0.5">{formatDate(exam.date)}</h4>
                      <div className="flex items-center justify-between">
                        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">Klassenarbeit</p>
                        <ChevronRight className="w-4 h-4 text-white/20" />
                      </div>
                    </GlassCard>
                  </button>
                );
              };

              return (
                <div className="mt-5">
                  <SectionTitle
                    icon={<CheckCircle className="w-4 h-4" />}
                    title="Abgeschlossene Klausuren"
                    badge={
                      <span className="px-2 py-0.5 rounded-full font-['Poppins:Medium',sans-serif] text-[10px] text-white/40 bg-white/[0.05] border border-white/[0.08]">
                        {allCompleted.length}
                      </span>
                    }
                  />
                  <div className="space-y-3">
                    {visibleCompleted.map(renderCompletedCard)}
                    {hiddenCompletedCount > 0 && (
                      <button
                        onClick={() => { setShowAllCompletedExams(true); setCompletedExamsSubjectFilter('all'); }}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-['Poppins:Medium',sans-serif] text-[11px] text-white/35 transition-all active:scale-[0.98]"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', WebkitTapHighlightColor: 'transparent' }}
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                        Alle {allCompleted.length} abgeschlossene Klausuren anzeigen
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ===== INSIGHTS: Vergangene Klausuren ===== */}
            <div className="mt-6">
              <SectionTitle icon={<Lightbulb className="w-4 h-4" />} title="Klausur-Insights" />

              {/* Korrelation Vorbereitung vs. Note */}
              <GlassCard className="p-4 mb-3">
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 mb-3 leading-relaxed">
                  Wir vergleichen deine Noten: Wie hast du abgeschnitten, wenn du dich gut vorbereitet hast vs. wenn du wenig gelernt hast?
                </p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div
                    className="p-3 rounded-xl text-center"
                    style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.12)' }}
                  >
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 mb-1">Gut vorbereitet</p>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-[#00D4AA]">{highPrepAvg}</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 mt-1">{formatRange(highPrepRange)} vorbereitet</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/20 mt-0.5">{highPrepExams.length} Klausuren</p>
                  </div>
                  <div
                    className="p-3 rounded-xl text-center"
                    style={{ background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.12)' }}
                  >
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 mb-1">Wenig gelernt</p>
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-[#FF6B6B]">{lowPrepAvg}</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 mt-1">{formatRange(lowPrepRange)} vorbereitet</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/20 mt-0.5">{lowPrepExams.length} Klausuren</p>
                  </div>
                </div>
                <div
                  className="flex items-start gap-2 p-2.5 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <Info className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }} />
                  <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/25 leading-relaxed">
                    Basiert nur auf Klausuren, die du in der ToDo-Verwaltung als bevorstehende Klassenarbeit angelegt und anschließend eine Note eingetragen hast.
                  </p>
                </div>
              </GlassCard>

              {/* Noten-Trend + Gesamtschnitt */}
              <GlassCard className="p-4 mb-3">
                <h4 className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white/60 mb-3">
                  Noten-Trend
                </h4>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-white">{gradeAvg}</span>
                    <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">Ø Gesamtschnitt</span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    {gradeTrend === 'improving' && <TrendingUp className="w-4 h-4 text-[#00D4AA]" />}
                    {gradeTrend === 'declining' && <TrendingDown className="w-4 h-4 text-[#FF4444]" />}
                    {gradeTrend === 'stable' && <Minus className="w-4 h-4 text-[#8E8E93]" />}
                    <span className="font-['Poppins:Medium',sans-serif] text-[11px]" style={{
                      color: gradeTrend === 'improving' ? '#00D4AA' : gradeTrend === 'declining' ? '#FF4444' : '#8E8E93'
                    }}>
                      {gradeTrend === 'improving' ? 'Aufsteigend' : gradeTrend === 'declining' ? 'Absteigend' : 'Stabil'}
                    </span>
                  </div>
                </div>
                {/* Mini chart - last exams as bars */}
                <div className="flex items-end gap-1.5 h-[60px]">
                  {[...pastExams].reverse().map((exam, idx) => {
                    const height = ((6 - exam.grade) / 5) * 100; // Grade 1=100%, Grade 6=0%
                    const barColor = exam.grade <= 2 ? '#00D4AA' : exam.grade <= 3 ? '#FFB84D' : '#FF6B6B';
                    return (
                      <div key={exam.id} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-sm" style={{
                          height: `${height}%`,
                          background: barColor,
                          opacity: 0.5 + (idx / pastExams.length) * 0.5,
                          minHeight: 4,
                          transition: 'height 0.6s ease',
                        }} />
                        <span className="font-['Poppins:Medium',sans-serif] text-[8px] text-white/25">{exam.grade}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-['Poppins:Regular',sans-serif] text-[8px] text-white/20">Älter</span>
                  <span className="font-['Poppins:Regular',sans-serif] text-[8px] text-white/20">Aktuell</span>
                </div>
              </GlassCard>

              {/* Vergangene Klausuren Liste (kompakt) */}
              <GlassCard className="p-4">
                <h4 className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white/60 mb-2.5">
                  Letzte Klausuren
                </h4>
                <div className="space-y-2">
                  {pastExams.slice(0, 5).map(exam => {
                    const gradeColor = exam.grade <= 2 ? '#00D4AA' : exam.grade <= 3 ? '#FFB84D' : '#FF6B6B';
                    return (
                      <div key={exam.id} className="flex items-center justify-between py-1.5">
                        <div className="flex-1 min-w-0">
                          <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/60 truncate">{exam.title}</p>
                          <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/25">{exam.subject} · {formatDate(exam.date)}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                          <span className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/25">{exam.prepPercent}% vorbereitet</span>
                          <span
                            className="font-['Poppins:SemiBold',sans-serif] text-[13px] w-5 text-center"
                            style={{ color: gradeColor }}
                          >
                            {exam.grade}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* ===== LERNZIELE VIEW ===== */}
        {goalsSubToggle === 'goals' && (
          <div className="space-y-5">
            {/* Aktive Lernziele */}
            <SectionTitle
              icon={<Target className="w-4 h-4" />}
              title="Aktive Lernziele"
              badge={
                <span className="px-2 py-0.5 rounded-full font-['Poppins:Medium',sans-serif] text-[10px] text-white/40 bg-white/[0.05] border border-white/[0.08]">
                  {MOCK_ACTIVE_GOALS.length}
                </span>
              }
            />

            {MOCK_ACTIVE_GOALS.length === 0 ? (
              <EmptyState icon={<Target className="w-8 h-8" />} text="Keine aktiven Lernziele" />
            ) : (() => {
              const visibleGoals = MOCK_ACTIVE_GOALS.slice(0, 2);
              const hiddenCount = MOCK_ACTIVE_GOALS.length - 2;
              return (
              <div className="space-y-3">
                {visibleGoals.map(goal => {
                  const days = daysUntil(goal.dueDate);
                  const statusConfig = {
                    'on-track': { label: 'Auf Kurs', color: '#00D4AA', bg: 'rgba(0,212,170,0.08)', border: 'rgba(0,212,170,0.15)' },
                    'at-risk': { label: 'Gefährdet', color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.15)' },
                    'extended': { label: 'Verschoben', color: '#FFB84D', bg: 'rgba(255,184,77,0.08)', border: 'rgba(255,184,77,0.15)' },
                  }[goal.status];
                  const wasExtended = goal.dueDate !== goal.originalDueDate;
                  // Mastery progress: how far from start to target
                  const masteryRange = goal.masteryTarget - goal.masteryStart;
                  const masteryProgress = masteryRange > 0 ? Math.round(((goal.masteryCurrent - goal.masteryStart) / masteryRange) * 100) : 0;
                  const masteryColor = '#00D4AA';

                  return (
                    <button
                      key={goal.id}
                      onClick={() => { setGoalDetailId(goal.id); setShowAllGoalRecs(false); }}
                      className="w-full text-left transition-all duration-150 active:scale-[0.98]"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                    <GlassCard className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/25 uppercase tracking-wider">
                          {goal.subject}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px]"
                          style={{ color: statusConfig.color, background: statusConfig.bg, border: `1px solid ${statusConfig.border}` }}
                        >
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white mb-1">
                        {goal.topic}
                      </h4>

                      {/* Due date info */}
                      <div className="flex items-center gap-2 mb-3">
                        <CalendarDays className="w-3 h-3 text-white/25" />
                        <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                          Ziel: {formatDate(goal.dueDate)}
                          {days > 0 ? ` · noch ${days} Tage` : days === 0 ? ' · Heute' : ` · ${Math.abs(days)} Tage überfällig`}
                        </span>
                        {wasExtended && (
                          <span className="font-['Poppins:Regular',sans-serif] text-[9px] text-[#FFB84D]/50 line-through">
                            {formatDate(goal.originalDueDate)}
                          </span>
                        )}
                      </div>

                      {/* Fortschritt (holistic) */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50">
                            Fortschritt
                          </span>
                          <span className="font-['Poppins:SemiBold',sans-serif] text-[11px]" style={{ color: masteryColor }}>
                            {goal.masteryCurrent}%
                          </span>
                        </div>
                        <div className="relative h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{
                              width: `${Math.min(masteryProgress, 100)}%`,
                              background: masteryColor,
                              transition: 'width 0.6s ease',
                              opacity: 0.8,
                            }}
                          />
                        </div>
                      </div>
                    </GlassCard>
                    </button>
                  );
                })}
                {/* "Alle anzeigen" button */}
                {hiddenCount > 0 && (
                  <button
                    onClick={() => { setShowAllGoals(true); setGoalsSubjectFilter('all'); }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-['Poppins:Medium',sans-serif] text-[11px] text-white/35 transition-all active:scale-[0.98]"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', WebkitTapHighlightColor: 'transparent' }}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    Alle {MOCK_ACTIVE_GOALS.length} Lernziele anzeigen
                  </button>
                )}
              </div>
              );
            })()}

            {/* ===== DEINE LERNZIEL-BILANZ ===== */}
            <div className="mt-6">
              <SectionTitle title="Deine Lernziel-Bilanz" />

              {/* KPI Cards */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <GlassCard className="p-3 text-center">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[18px]" style={{ color: '#00D4AA' }}>
                    {completedGoals.length}
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/30 mt-0.5">Ziele erreicht</p>
                </GlassCard>
                <GlassCard className="p-3 text-center">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[18px]" style={{ color: '#00D4AA' }}>
                    {onTimeCount}
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/30 mt-0.5">Davon pünktlich</p>
                </GlassCard>
                <GlassCard className="p-3 text-center">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[18px]" style={{ color: '#00D4AA' }}>
                    {MOCK_ACTIVE_GOALS.length}
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/30 mt-0.5">Aktive Ziele</p>
                </GlassCard>
              </div>

              {/* Erreichte Ziele */}
              <GlassCard className="p-4 mb-3">
                <h4 className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white/60 mb-3">
                  Erreichte Ziele
                </h4>
                {completedGoals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Target className="w-6 h-6 text-white/10 mb-2" />
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">Du hast noch kein Lernziel abgeschlossen. Arbeite an deinen aktiven Zielen!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {completedGoals.slice(0, 3).map(goal => (
                      <div key={goal.id} className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle
                            className="w-3.5 h-3.5 flex-shrink-0"
                            style={{ color: '#00D4AA' }}
                          />
                          <div className="min-w-0">
                            <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/60 truncate">{goal.topic}</p>
                            <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/25">{goal.subject}</p>
                          </div>
                        </div>
                        <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/30 flex-shrink-0 ml-3">
                          {goal.actualDays} Tage
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>

              {/* "Alle anzeigen" button – only if more than 3 reached goals */}
              {completedGoals.length > 3 && (
                <button
                  onClick={() => { setShowAllReachedGoals(true); setReachedGoalsSubjectFilter('all'); setReachedGoalsTimeFilter('all'); }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-['Poppins:Medium',sans-serif] text-[11px] text-white/35 transition-all active:scale-[0.98] mb-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', WebkitTapHighlightColor: 'transparent' }}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  Alle erreichten Ziele anzeigen
                </button>
              )}

              {/* AI Insight */}
              <GlassCard className="p-4">
                <div
                  className="p-3 rounded-xl"
                  style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}
                >
                  <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50 mb-1">KI-Analyse</p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 leading-relaxed">
                    {onTimeCount} von {completedGoals.length} Zielen pünktlich erreicht.
                    {avgActualDays < avgPlannedDays
                      ? ` Im Schnitt ${avgPlannedDays - avgActualDays} Tage schneller als geplant – du setzt dir realistische Ziele.`
                      : avgActualDays > avgPlannedDays
                      ? ` Im Schnitt ${avgActualDays - avgPlannedDays} Tage länger als geplant – versuche kleinere Ziele zu setzen.`
                      : ' Deine Zeitplanung ist genau richtig.'}
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===== TAB: LEISTUNGSANALYSE =====
  const renderPerformance = () => {
    // Filter activities by selected time range
    const mockToday = new Date('2026-03-15');
    const getFilteredActivities = () => {
      return MOCK_ACTIVITIES.filter(a => {
        const d = new Date(a.date + 'T00:00:00');
        switch (perfTimeRange) {
          case 'today': return a.date === '2026-03-15';
          case 'weekly': {
            const weekStart = new Date('2026-03-09');
            return d >= weekStart && d <= mockToday;
          }
          case 'monthly': {
            const monthStart = new Date('2026-03-01');
            return d >= monthStart && d <= mockToday;
          }
          case 'custom': {
            if (!customRangeApplied) return true;
            const from = new Date(customDateFrom + 'T00:00:00');
            const to = new Date(customDateTo + 'T23:59:59');
            return d >= from && d <= to;
          }
          case 'all': return true;
          default: return true;
        }
      });
    };
    const filteredActivities = getFilteredActivities();

    // Cross-source data – filtered by time range
    const filteredSubjects = new Set(filteredActivities.map(a => a.subject).filter(Boolean));
    const consistentWeaknesses = MOCK_WEAKNESSES
      .filter(w => (w.severity === 'critical' || w.severity === 'warning') && (perfTimeRange === 'all' || filteredSubjects.has(w.subject)))
      .slice(0, 3).map(w => w.topic);
    const consistentStrengths = MOCK_STRENGTHS
      .filter(s => perfTimeRange === 'all' || filteredSubjects.has(s.subject))
      .slice(0, 3).map(s => s.topic);

    // Aktivitäten nach Typ – Gesamtzeit in Minuten pro Typ berechnet (from filtered)
    const parseMinutes = (dur: string) => parseInt(dur.replace(/[^\d]/g, '')) || 0;
    const flashcardMinutes = filteredActivities.filter(a => a.type === 'flashcard').reduce((s, a) => s + parseMinutes(a.duration), 0);
    const examMinutes = filteredActivities.filter(a => a.type === 'exam').reduce((s, a) => s + parseMinutes(a.duration), 0);
    const chatMinutes = filteredActivities.filter(a => a.type === 'chat').reduce((s, a) => s + parseMinutes(a.duration), 0);
    const totalMinutes = flashcardMinutes + examMinutes + chatMinutes;

    const activityByType = [
      { key: 'flashcards', label: 'Karteikarten Lernsimulator', minutes: flashcardMinutes, color: '#4A9EFF' },
      { key: 'exams', label: 'Prüfungs\u00ADsimulation', minutes: examMinutes, color: '#FF8C00' },
      { key: 'chat', label: 'Lernassistent', minutes: chatMinutes, color: '#00D4AA' },
    ];

    const activityTypeIconMap: Record<string, React.ReactNode> = {
      flashcards: <Layers className="w-4 h-4" />,
      exams: <ClipboardCheck className="w-4 h-4" />,
      chat: <Sparkles className="w-4 h-4" />,
    };

    // ===== Ø Ergebnis: Globaler Durchschnitt (alle Aktivitäten, zeitraumunabhängig) =====
    const allScoredActivities = MOCK_ACTIVITIES.filter(a => a.score != null);
    const globalAvgScore = allScoredActivities.length > 0
      ? Math.round(allScoredActivities.reduce((s, a) => s + (a.score || 0), 0) / allScoredActivities.length)
      : null;

    // Zeitraum-Ø für Delta-Berechnung (wie liegt der gewählte Zeitraum im Vergleich zum Gesamtdurchschnitt?)
    const periodScoredActivities = filteredActivities.filter(a => a.score != null);
    const periodAvgScore = periodScoredActivities.length > 0
      ? Math.round(periodScoredActivities.reduce((s, a) => s + (a.score || 0), 0) / periodScoredActivities.length)
      : null;

    // Delta = Zeitraum-Ø minus Gesamt-Ø (bei "Gesamt" kein Delta, da identisch)
    const scoreDelta = perfTimeRange !== 'all' && periodAvgScore != null && globalAvgScore != null
      ? periodAvgScore - globalAvgScore
      : null;
    const scoreColor = globalAvgScore != null
      ? (globalAvgScore >= 75 ? '#00D4AA' : globalAvgScore >= 50 ? '#FFB800' : '#FF4444')
      : '#7B61FF';
    const periodScoreColor = periodAvgScore != null
      ? (periodAvgScore >= 75 ? '#00D4AA' : periodAvgScore >= 50 ? '#FFB800' : '#FF4444')
      : '#7B61FF';
    const deltaColor = scoreDelta != null
      ? (scoreDelta > 0 ? '#00D4AA' : scoreDelta < 0 ? '#FF4444' : '#FFB800')
      : '#FFB800';
    const formatCustomLabel = () => {
      const fmt = (d: string) => { const p = d.split('-'); return `${p[2]}.${p[1]}.`; };
      return `${fmt(customDateFrom)} – ${fmt(customDateTo)}`;
    };
    const periodLabel = perfTimeRange === 'today' ? 'Heute'
      : perfTimeRange === 'weekly' ? 'Diese Woche'
      : perfTimeRange === 'monthly' ? 'Diesen Monat'
      : perfTimeRange === 'custom' ? formatCustomLabel()
      : 'Gesamt';

    // ===== Adaptive Leistungsbewertung =====
    const activeScore = perfTimeRange === 'all' ? globalAvgScore : periodAvgScore;
    const performanceTier = (() => {
      if (activeScore == null) return {
        label: 'Keine Daten',
        subtitle: 'Starte eine Lernsitzung für deine Analyse',
        color: '#7B61FF',
        icon: 'brain' as const,
      };
      if (activeScore >= 90) {
        const sub = scoreDelta != null && scoreDelta < 0
          ? 'Trotz Rückgang – exzellentes Niveau!'
          : 'Exzellente Ergebnisse – du übertriffst dich selbst!';
        return { label: 'Herausragende Leistung', subtitle: sub, color: '#FFB800', icon: 'flame' as const };
      }
      if (activeScore >= 75) {
        const sub = scoreDelta != null && scoreDelta > 10
          ? 'Deutlich über deinem Durchschnitt – starker Trend!'
          : scoreDelta != null && scoreDelta < -5
          ? 'Leicht unter deinem üblichen Niveau'
          : 'Starke Ergebnisse – weiter so!';
        return { label: 'Überdurchschnittlich', subtitle: sub, color: '#00D4AA', icon: 'star' as const };
      }
      if (activeScore >= 60) {
        const sub = scoreDelta != null && scoreDelta > 10
          ? 'Deutlich über deinem Durchschnitt – guter Trend!'
          : scoreDelta != null && scoreDelta < -5
          ? 'Etwas unter deinem üblichen Niveau'
          : 'Du bist auf einem guten Weg';
        return { label: 'Solide Leistung', subtitle: sub, color: '#4A9EFF', icon: 'check' as const };
      }
      if (activeScore >= 45) {
        const sub = scoreDelta != null && scoreDelta > 5
          ? 'Tendenz nach oben – bleib dran!'
          : 'Etwas mehr Übung kann nicht schaden';
        return { label: 'Durchschnittlich', subtitle: sub, color: '#FFB800', icon: 'chart' as const };
      }
      const sub = scoreDelta != null && scoreDelta > 5
        ? 'Es geht aufwärts – weitermachen!'
        : 'Mehr Wiederholung wird sich auszahlen';
      return { label: 'Ausbaufähig', subtitle: sub, color: '#FF8C00', icon: 'trending' as const };
    })();

    // ===== Chart data per time range =====
    // Today: one night-block (0–6 Uhr) + hourly bars (6–23 Uhr)
    const todayChartData = (() => {
      const buckets: { label: string; minutes: number; startH: number; endH: number }[] = [
        { label: '0–6', minutes: 0, startH: 0, endH: 6 },
      ];
      for (let h = 6; h <= 23; h++) {
        buckets.push({ label: `${h}:00`, minutes: 0, startH: h, endH: h + 1 });
      }
      filteredActivities.forEach(a => {
        if (a.time) {
          const hour = parseInt(a.time.split(':')[0], 10);
          const bucket = buckets.find(b => hour >= b.startH && hour < b.endH);
          if (bucket) bucket.minutes += parseMinutes(a.duration);
        } else {
          const fallback = buckets.find(b => b.startH === 14);
          if (fallback) fallback.minutes += parseMinutes(a.duration);
        }
      });
      return buckets.map(b => ({ label: b.label, minutes: b.minutes }));
    })();

    // Weekly: Mo–So
    const weeklyChartData = (() => {
      const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
      const buckets: Record<string, number> = { Mo: 0, Di: 0, Mi: 0, Do: 0, Fr: 0, Sa: 0, So: 0 };
      filteredActivities.forEach(a => {
        const d = new Date(a.date + 'T00:00:00');
        buckets[dayNames[d.getDay()]] += parseMinutes(a.duration);
      });
      return ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => ({ label: day, minutes: buckets[day] }));
    })();

    // Monthly: split into ~7-day weekly segments (handles 28/29/30/31 day months)
    const monthlyChartData = (() => {
      const year = mockToday.getFullYear();
      const month = mockToday.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const segments: { label: string; minutes: number; startDay: number; endDay: number }[] = [];
      let day = 1;
      while (day <= daysInMonth) {
        const endDay = Math.min(day + 6, daysInMonth);
        segments.push({ label: `${day}.–${endDay}.`, minutes: 0, startDay: day, endDay });
        day = endDay + 1;
      }
      filteredActivities.forEach(a => {
        const d = new Date(a.date + 'T00:00:00');
        const dayOfMonth = d.getDate();
        const seg = segments.find(s => dayOfMonth >= s.startDay && dayOfMonth <= s.endDay);
        if (seg) seg.minutes += parseMinutes(a.duration);
      });
      return segments.map(s => ({ label: s.label, minutes: s.minutes }));
    })();

    // All: monthly buckets (last 6 months)
    const allTimeChartData = (() => {
      const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
      const buckets: { label: string; minutes: number; year: number; month: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(mockToday);
        d.setMonth(d.getMonth() - i);
        buckets.push({ label: monthNames[d.getMonth()], minutes: 0, year: d.getFullYear(), month: d.getMonth() });
      }
      MOCK_ACTIVITIES.forEach(a => {
        const d = new Date(a.date + 'T00:00:00');
        const bucket = buckets.find(b => b.year === d.getFullYear() && b.month === d.getMonth());
        if (bucket) bucket.minutes += parseMinutes(a.duration);
      });
      return buckets.map(b => ({ label: b.label, minutes: b.minutes }));
    })();

    // Custom range chart data – daily bars within selected range
    const customChartData = (() => {
      if (perfTimeRange !== 'custom' || !customRangeApplied) return [];
      const from = new Date(customDateFrom + 'T00:00:00');
      const to = new Date(customDateTo + 'T00:00:00');
      const diffDays = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays <= 14) {
        // Daily bars
        const buckets: { label: string; minutes: number; dateStr: string }[] = [];
        for (let i = 0; i < diffDays; i++) {
          const d = new Date(from);
          d.setDate(d.getDate() + i);
          const ds = d.toISOString().slice(0, 10);
          buckets.push({ label: `${d.getDate()}.${d.getMonth() + 1}.`, minutes: 0, dateStr: ds });
        }
        filteredActivities.forEach(a => {
          const bucket = buckets.find(b => b.dateStr === a.date);
          if (bucket) bucket.minutes += parseMinutes(a.duration);
        });
        return buckets.map(b => ({ label: b.label, minutes: b.minutes }));
      } else if (diffDays <= 90) {
        // Weekly bars
        const buckets: { label: string; minutes: number; weekStart: Date; weekEnd: Date }[] = [];
        let cur = new Date(from);
        while (cur <= to) {
          const weekEnd = new Date(cur);
          weekEnd.setDate(weekEnd.getDate() + 6);
          if (weekEnd > to) weekEnd.setTime(to.getTime());
          buckets.push({
            label: `${cur.getDate()}.${cur.getMonth() + 1}.`,
            minutes: 0,
            weekStart: new Date(cur),
            weekEnd: new Date(weekEnd),
          });
          cur.setDate(cur.getDate() + 7);
        }
        filteredActivities.forEach(a => {
          const d = new Date(a.date + 'T00:00:00');
          const bucket = buckets.find(b => d >= b.weekStart && d <= b.weekEnd);
          if (bucket) bucket.minutes += parseMinutes(a.duration);
        });
        return buckets.map(b => ({ label: b.label, minutes: b.minutes }));
      } else {
        // Monthly bars
        const buckets: { label: string; minutes: number; year: number; month: number }[] = [];
        let cur = new Date(from.getFullYear(), from.getMonth(), 1);
        const end = new Date(to.getFullYear(), to.getMonth(), 1);
        while (cur <= end) {
          buckets.push({ label: monthNames[cur.getMonth()], minutes: 0, year: cur.getFullYear(), month: cur.getMonth() });
          cur.setMonth(cur.getMonth() + 1);
        }
        filteredActivities.forEach(a => {
          const d = new Date(a.date + 'T00:00:00');
          const bucket = buckets.find(b => b.year === d.getFullYear() && b.month === d.getMonth());
          if (bucket) bucket.minutes += parseMinutes(a.duration);
        });
        return buckets.map(b => ({ label: b.label, minutes: b.minutes }));
      }
    })();

    // Select chart data based on time range
    const chartData = perfTimeRange === 'today' ? todayChartData
      : perfTimeRange === 'weekly' ? weeklyChartData
      : perfTimeRange === 'monthly' ? monthlyChartData
      : perfTimeRange === 'custom' ? customChartData
      : allTimeChartData;

    const chartTitle = perfTimeRange === 'today' ? 'Lernzeit heute'
      : perfTimeRange === 'weekly' ? 'Wöchentliche Lernzeit'
      : perfTimeRange === 'monthly' ? 'Monatliche Lernzeit'
      : perfTimeRange === 'custom' ? `Lernzeit – ${formatCustomLabel()}`
      : 'Lernzeit – letzte 6 Monate';

    // Time range filter chips
    const timeRangeOptions: { key: typeof perfTimeRange; label: string }[] = [
      { key: 'today', label: 'Heute' },
      { key: 'weekly', label: 'Woche' },
      { key: 'monthly', label: 'Monat' },
      { key: 'all', label: 'Gesamt' },
    ];

    return (
      <div className="space-y-5">
        {/* Leistungsübersicht – Header with time range filter */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Leistungsübersicht</p>
            <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30">{periodLabel}</span>
          </div>
          {/* Time range filter chips */}
          <div className="flex items-center gap-1.5 mb-3">
            {timeRangeOptions.map(opt => {
              const isActive = perfTimeRange === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => { setPerfTimeRange(opt.key); setShowDatePicker(false); }}
                  className={`px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] transition-all duration-200 active:scale-[0.96] ${
                    isActive
                      ? 'bg-[#00B894]/10 text-[#00B894] border border-[#00B894]/25'
                      : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.05]'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {opt.label}
                </button>
              );
            })}
            {/* Calendar button for custom range */}
            <button
              onClick={() => setShowDatePicker(true)}
              className={`ml-auto px-2.5 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] transition-all duration-200 active:scale-[0.96] flex items-center gap-1.5 ${
                perfTimeRange === 'custom'
                  ? 'bg-[#00B894]/10 text-[#00B894] border border-[#00B894]/25'
                  : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.05]'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              {perfTimeRange === 'custom' && customRangeApplied && (
                <span className="hidden min-[360px]:inline">{formatCustomLabel()}</span>
              )}
            </button>
          </div>

          {/* KPI Cards – Zwei getrennte Anzeigen */}
          <div className="grid grid-cols-2 gap-2">
            {/* Card 1: Gesamtdurchschnitt (immer gleich, zeitraumunabhängig) */}
            <GlassCard className="p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${scoreColor}15` }}>
                  <Target className="w-3.5 h-3.5" style={{ color: scoreColor }} />
                </div>
                <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/40">Gesamtdurchschnitt</p>
              </div>
              <span className="font-['Poppins:SemiBold',sans-serif] text-[22px]" style={{ color: scoreColor }}>
                {globalAvgScore != null ? `${globalAvgScore}%` : '–'}
              </span>
              <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/25 mt-1">Über alle Ergebnisse</p>
            </GlassCard>

            {/* Card 2: Ergebnis im gewählten Zeitraum */}
            <GlassCard className="p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: perfTimeRange === 'all' ? `${scoreColor}15` : `${periodScoreColor}15` }}>
                  <BarChart3 className="w-3.5 h-3.5" style={{ color: perfTimeRange === 'all' ? scoreColor : periodScoreColor }} />
                </div>
                <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/40">{periodLabel}</p>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-['Poppins:SemiBold',sans-serif] text-[22px]" style={{ color: perfTimeRange === 'all' ? scoreColor : periodScoreColor }}>
                  {perfTimeRange === 'all'
                    ? (globalAvgScore != null ? `${globalAvgScore}%` : '–')
                    : (periodAvgScore != null ? `${periodAvgScore}%` : '–')
                  }
                </span>
                {scoreDelta != null && scoreDelta !== 0 && (
                  <span className="flex items-center gap-0.5 font-['Poppins:Medium',sans-serif] text-[10px]" style={{ color: deltaColor }}>
                    {scoreDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {scoreDelta > 0 ? '+' : ''}{scoreDelta}%
                  </span>
                )}
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[9px] text-white/25 mt-1">
                {perfTimeRange === 'all' ? 'Identisch mit Gesamt' : `Abweichung vom Gesamt-Ø`}
              </p>
            </GlassCard>
          </div>


        </div>

        {/* Aktivitäten nach Typ – Lernzeit in Minuten */}
        <div>
          <SectionTitle icon={<Clock className="w-4 h-4" />} title="Lernzeit nach Typ" />
          <div className="grid grid-cols-3 gap-2">
            {activityByType.map(src => (
              <GlassCard key={src.key} className="p-3 text-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5" style={{ backgroundColor: `${src.color}15` }}>
                  <div style={{ color: src.color }}>{activityTypeIconMap[src.key] || <Clock className="w-4 h-4" />}</div>
                </div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white">{src.minutes}<span className="text-[11px] text-white/40 ml-0.5">min</span></p>
                <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/40 mt-0.5 leading-tight">{src.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Lernzeit Chart – for all time ranges */}
        {chartData.length > 0 && (
          <GlassCard className="p-4 overflow-hidden">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/70 mb-3">{chartTitle}</p>
            <div
              className={(perfTimeRange === 'today' || (perfTimeRange === 'custom' && chartData.length > 10)) ? 'overflow-x-auto' : ''}
              style={(perfTimeRange === 'today' || (perfTimeRange === 'custom' && chartData.length > 10)) ? {
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.1) transparent',
              } : {}}
            >
              <div
                ref={barChartRef}
                className="flex items-end gap-1.5 px-1"
                style={{
                  height: '120px',
                  ...(perfTimeRange === 'today' ? { minWidth: '580px' } : {}),
                  ...(perfTimeRange === 'custom' && chartData.length > 10 ? { minWidth: `${chartData.length * 38}px` } : {}),
                }}
              >
                {chartData.map((d) => {
                  const maxMin = Math.max(...chartData.map(x => x.minutes), 1);
                  const pct = maxMin > 0 ? (d.minutes / maxMin) * 100 : 0;
                  return (
                    <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                      <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/40">{d.minutes > 0 ? d.minutes : ''}</span>
                      <div className="w-full flex justify-center" style={{ height: '80px' }}>
                        <div
                          className="w-full max-w-[32px] rounded-t-[5px]"
                          style={{
                            height: `${Math.max(pct, 4)}%`,
                            background: d.minutes > 0
                              ? 'linear-gradient(180deg, #7B61FF 0%, #5B3FD9 100%)'
                              : 'rgba(255,255,255,0.04)',
                            alignSelf: 'flex-end',
                            boxShadow: d.minutes > 0 ? '0 0 8px rgba(123, 97, 255, 0.25)' : 'none',
                          }}
                        />
                      </div>
                      <span className={`font-['Poppins:Regular',sans-serif] text-white/30 ${perfTimeRange === 'monthly' || perfTimeRange === 'custom' ? 'text-[8px]' : perfTimeRange === 'today' ? 'text-[9px]' : 'text-[10px]'}`}>{d.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35">Gesamt</span>
              <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/60">
                {Math.floor(chartData.reduce((s, d) => s + d.minutes, 0) / 60)}h {chartData.reduce((s, d) => s + d.minutes, 0) % 60}min
              </span>
            </div>
          </GlassCard>
        )}



        {/* SECTION 2 – Aktivitätsfeed */}
        <div>
          <SectionTitle
            icon={<Clock className="w-4 h-4" />}
            title="Aktivitätsfeed"
            badge={
              <span className="ml-auto flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7B61FF]/10 border border-[#7B61FF]/20">
                <Activity className="w-3 h-3 text-[#7B61FF]" />
                <span className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#7B61FF]">{filteredActivities.length} {filteredActivities.length === 1 ? 'Aktivität' : 'Aktivitäten'}</span>
              </span>
            }
          />
          {filteredActivities.length === 0 ? (
            <GlassCard className="p-6 text-center">
              <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/30">Keine Aktivitäten in diesem Zeitraum</p>
            </GlassCard>
          ) : (
          <div className="space-y-1.5">
            {filteredActivities.slice(0, 10).map((act) => {
              const typeConfig = {
                flashcard: { icon: <Layers className="w-4 h-4" />, color: '#4A9EFF', label: 'Karteikarten Lernmodus' },
                exam: { icon: <ClipboardCheck className="w-4 h-4" />, color: '#FF8C00', label: 'Prüfungssimulation' },
                chat: { icon: <Sparkles className="w-4 h-4" />, color: '#00D4AA', label: 'Lernassistent' },
              }[act.type];

              const displaySubject = act.subject || 'Allgemein';

              const gradeColor = act.grade
                ? Number(act.grade) <= 2 ? '#00D4AA' : Number(act.grade) <= 3 ? '#FFB800' : '#FF4444'
                : '#FFB800';

              return (
                <div key={act.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${typeConfig.color}15` }}>
                    <div style={{ color: typeConfig.color }}>{typeConfig.icon}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-white truncate">{act.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30">{displaySubject}</span>
                      <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/20">•</span>
                      <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30">{act.duration}</span>
                      {act.cardsCount && (
                        <>
                          <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/20">•</span>
                          <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30">{act.cardsCount} Karten</span>
                        </>
                      )}
                    </div>
                  </div>
                  {act.type === 'flashcard' && (() => {
                    const linkedSet = act.setId ? allSets.find(s => s.id === act.setId) : undefined;
                    const displayProgress = linkedSet?.progress ?? act.progress;
                    return displayProgress != null ? <ScoreRing score={displayProgress} size={32} strokeWidth={2.5} /> : null;
                  })()}
                  {act.type === 'exam' && act.grade && (
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${gradeColor}15`, border: `1.5px solid ${gradeColor}40` }}
                    >
                      <span className="font-['Poppins:SemiBold',sans-serif] text-[13px]" style={{ color: gradeColor }}>
                        {act.grade}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredActivities.length > 10 && (
              <div className="flex items-center justify-center py-2.5 mt-1">
                <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25">
                  Neueste 10 von {filteredActivities.length} Aktivitäten
                </span>
              </div>
            )}
          </div>
          )}
        </div>

        {/* SECTION 3 – Zeitraumspezifische Querschnittanalyse */}
        <div>
          <SectionTitle icon={<Lightbulb className="w-4 h-4" />} title="Querschnittanalyse" />
          <div className="space-y-3">
            <GlassCard className="p-4">
              <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#FF4444]/70 mb-2">Konstante Schwächen</p>
              {consistentWeaknesses.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {consistentWeaknesses.map(w => (
                    <span key={w} className="px-2.5 py-1 rounded-lg bg-[#FF4444]/10 text-[#FF4444] font-['Poppins:Medium',sans-serif] text-[11px] border border-[#FF4444]/20">
                      {w}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25">Keine Schwächen in diesem Zeitraum erkannt</p>
              )}
            </GlassCard>

            <GlassCard className="p-4">
              <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#00D4AA]/70 mb-2">Konstante Stärken</p>
              {consistentStrengths.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {consistentStrengths.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-[#00D4AA]/10 text-[#00D4AA] font-['Poppins:Medium',sans-serif] text-[11px] border border-[#00D4AA]/20">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25">Keine Stärken in diesem Zeitraum erkannt</p>
              )}
            </GlassCard>

            <GlassCard className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${performanceTier.color}15` }}>
                {performanceTier.icon === 'flame' && <Flame className="w-5 h-5" style={{ color: performanceTier.color }} />}
                {performanceTier.icon === 'star' && <Star className="w-5 h-5" style={{ color: performanceTier.color }} />}
                {performanceTier.icon === 'check' && <CheckCircle className="w-5 h-5" style={{ color: performanceTier.color }} />}
                {performanceTier.icon === 'chart' && <BarChart3 className="w-5 h-5" style={{ color: performanceTier.color }} />}
                {performanceTier.icon === 'trending' && <TrendingUp className="w-5 h-5" style={{ color: performanceTier.color }} />}
                {performanceTier.icon === 'brain' && <Brain className="w-5 h-5" style={{ color: performanceTier.color }} />}
              </div>
              <div>
                <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">{performanceTier.label}</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40">{performanceTier.subtitle}</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  };

  const isPrognosisOverview = prognosisSubView === 'overview';

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      );
    }
    switch (activeTab) {
      case 'progress': return renderProgress();
      case 'prognosis': return null; // handled by slide layer architecture below
      case 'goals': return null; // handled by slide layer architecture below
      case 'performance': return renderPerformance();
    }
  };

  const content = (
    <div className="size-full flex flex-col bg-[#0a0a0a] relative overflow-hidden">
      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06]">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.05] active:bg-white/[0.08] transition-colors"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white flex-1">
            Lernanalyse
          </h1>
        </div>

        {/* Tab Bar – horizontally scrollable on mobile */}
        <div
          ref={tabBarRef}
          className="flex gap-1 px-4 pb-3 overflow-x-auto scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-['Poppins:Medium',sans-serif] text-[12px] whitespace-nowrap transition-all duration-200 flex-shrink-0 active:scale-[0.97] ${
                  isActive
                    ? 'bg-white/[0.10] text-white border border-white/[0.12]'
                    : 'bg-transparent text-white/40 border border-transparent'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span className={isActive ? 'text-white' : 'text-white/30'}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content – non-prognosis/goals tabs */}
      {activeTab !== 'prognosis' && activeTab !== 'goals' && (
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto px-4 pb-16 pt-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
          onClick={handleScrollAreaClick}
        >
          {renderContent()}
        </div>
      )}

      {/* ===== PROGNOSIS TAB: Slide-layer architecture (like TutoringProgressScreen) ===== */}
      {/* All layers are absolute siblings inside a relative container with the same transition */}
      {activeTab === 'prognosis' && (
        <div className="flex-1 min-h-0 relative overflow-hidden">

          {/* Layer 0: Overview (slides left when sub-view opens) */}
          <div
            style={{
              ...prognosisSlideStyle,
              transform: isPrognosisOverview ? 'translateX(0)' : 'translateX(-30%)',
              opacity: isPrognosisOverview ? 1 : 0,
              pointerEvents: isPrognosisOverview ? 'auto' : 'none',
            }}
          >
            <div
              ref={scrollRef}
              className="overflow-y-auto px-4 pb-16 pt-4 h-full scrollbar-hide"
              style={{ WebkitOverflowScrolling: 'touch' }}
              onClick={handleScrollAreaClick}
            >
              {isLoading ? (
                <div className="space-y-4">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : (
                renderPrognosisOverview()
              )}
            </div>
          </div>

        </div>
      )}

      {/* ===== FULLSCREEN SUB-VIEWS (cover entire screen incl. header+tabs) ===== */}
      {activeTab === 'prognosis' && (
        <>
          {/* All Weaknesses – fullscreen slide */}
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 50,
              transform: prognosisSubView === 'allWeaknesses' ? 'translateX(0)' : 'translateX(100%)',
              opacity: prognosisSubView === 'allWeaknesses' ? 1 : 0,
              pointerEvents: prognosisSubView === 'allWeaknesses' ? 'auto' : 'none',
            }}
          >
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button
                onClick={() => setPrognosisSubView('overview')}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <h1 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white flex-1">Erkannte Schwächen</h1>
            </div>
            <div
              className="overflow-y-auto px-5 pb-12 scrollbar-hide"
              style={{ WebkitOverflowScrolling: 'touch', height: 'calc(100% - 56px)' }}
            >
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 mb-4">
                Inhalte, bei denen in Lernaktivitäten oder Prüfungen Schwierigkeiten beobachtet wurden.
              </p>
              {renderSubViewFilters()}
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 mb-3">
                {filteredWeaknesses.length} {filteredWeaknesses.length === 1 ? 'Schwäche' : 'Schwächen'} gefunden
              </p>
              {filteredWeaknesses.length === 0 ? (
                <EmptyState icon={<CheckCircle className="w-8 h-8" />} text="Keine Schwächen für diesen Filter gefunden" />
              ) : (
                <div className="space-y-2">
                  {filteredWeaknesses.map(w => (
                    <WeaknessCard key={w.id} item={w} subjectColor={subjectColors[w.subject]} showCriticality={w.severity === 'critical'} onGenerate={() => onGenerateForWeakness?.({ topic: w.topic, subject: w.subject, severity: w.severity, recommendation: w.recommendation, source: 'weakness' })} onStartExam={() => onStartExamSimulation?.({ topic: w.topic, subject: w.subject, severity: w.severity, recommendation: w.recommendation, source: 'weakness' })} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* All Knowledge Gaps – fullscreen slide */}
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 50,
              transform: prognosisSubView === 'allGaps' ? 'translateX(0)' : 'translateX(100%)',
              opacity: prognosisSubView === 'allGaps' ? 1 : 0,
              pointerEvents: prognosisSubView === 'allGaps' ? 'auto' : 'none',
            }}
          >
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button
                onClick={() => setPrognosisSubView('overview')}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <h1 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white flex-1">KI-Wissenslücken</h1>
            </div>
            <div
              className="overflow-y-auto px-5 pb-12 scrollbar-hide"
              style={{ WebkitOverflowScrolling: 'touch', height: 'calc(100% - 56px)' }}
            >
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 mb-4">
                Von der KI erschlossene tieferliegende Ursachen, die mehrere deiner Schwächen verursachen könnten.
              </p>
              {renderSubViewFilters()}
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 mb-3">
                {filteredGaps.length} {filteredGaps.length === 1 ? 'Wissenslücke' : 'Wissenslücken'} gefunden
              </p>
              {filteredGaps.length === 0 ? (
                <EmptyState icon={<CheckCircle className="w-8 h-8" />} text="Keine Wissenslücken für diesen Filter gefunden" />
              ) : (
                <div className="space-y-2">
                  {filteredGaps.map(gap => renderGapCard(gap))}
                </div>
              )}
            </div>
          </div>

          {/* All Risks – fullscreen slide */}
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 50,
              transform: prognosisSubView === 'allRisks' ? 'translateX(0)' : 'translateX(100%)',
              opacity: prognosisSubView === 'allRisks' ? 1 : 0,
              pointerEvents: prognosisSubView === 'allRisks' ? 'auto' : 'none',
            }}
          >
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button
                onClick={() => setPrognosisSubView('overview')}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <h1 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white flex-1">Zukünftige Risiken</h1>
            </div>
            <div
              className="overflow-y-auto px-5 pb-12 scrollbar-hide"
              style={{ WebkitOverflowScrolling: 'touch', height: 'calc(100% - 56px)' }}
            >
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 mb-4">
                Themen, die zukünftig relevant sein könnten und Aufmerksamkeit brauchen.
              </p>
              {renderSubViewFilters()}
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 mb-3">
                {filteredRisks.length} {filteredRisks.length === 1 ? 'Risiko' : 'Risiken'} gefunden
              </p>
              {filteredRisks.length === 0 ? (
                <EmptyState icon={<Shield className="w-8 h-8" />} text="Keine Risiken für diesen Filter gefunden" />
              ) : (
                <div className="space-y-2">
                  {filteredRisks.map(r => renderRiskCard(r))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ===== GOALS TAB: Slide-layer architecture ===== */}
      {activeTab === 'goals' && (
        <div className="flex-1 min-h-0 relative overflow-hidden">
          {/* Layer 0: Goals overview (slides left when detail opens) */}
          <div
            style={{
              ...prognosisSlideStyle,
              transform: !examDetailId && !goalDetailId && !completedExamDetailId ? 'translateX(0)' : 'translateX(-30%)',
              opacity: !examDetailId && !goalDetailId && !completedExamDetailId ? 1 : 0,
              pointerEvents: !examDetailId && !goalDetailId && !completedExamDetailId ? 'auto' : 'none',
            }}
          >
            <div
              ref={scrollRef}
              className="overflow-y-auto px-4 pb-16 pt-4 h-full scrollbar-hide"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {isLoading ? (
                <div className="space-y-4">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : (
                renderGoals()
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== EXAM DETAIL FULLSCREEN SUB-VIEW ===== */}
      {activeTab === 'goals' && (() => {
        const detailExam = upcomingExams.find(e => e.id === examDetailId);
        if (!detailExam) return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 50,
              transform: 'translateX(100%)',
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        );
        const days = Math.ceil((new Date(detailExam.date).getTime() - new Date('2026-03-17').getTime()) / (1000 * 60 * 60 * 24));
        const countdownColor = days <= 3 ? '#FF6B6B' : days <= 7 ? '#FFB84D' : '#00D4AA';
        const readiness = detailExam.overallReadiness;
        const readinessColor = '#00D4AA';

        return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 50,
              transform: examDetailId ? 'translateX(0)' : 'translateX(100%)',
              opacity: examDetailId ? 1 : 0,
              pointerEvents: examDetailId ? 'auto' : 'none',
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button
                onClick={() => { setExamDetailId(null); setShowAllRecommendations(false); }}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white truncate">{detailExam.subject} · {fmtDate(detailExam.date)}</h1>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                  Klassenarbeit
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Timer className="w-3.5 h-3.5" style={{ color: countdownColor }} />
                <span className="font-['Poppins:SemiBold',sans-serif] text-[12px]" style={{ color: countdownColor }}>
                  {days === 0 ? 'Heute' : days === 1 ? 'Morgen' : `in ${days} T.`}
                </span>
              </div>
            </div>

            {/* Scrollable Detail Content */}
            <div
              className="overflow-y-auto px-5 pb-12 scrollbar-hide"
              style={{ WebkitOverflowScrolling: 'touch', height: 'calc(100% - 70px)' }}
            >
              {/* Vorbereitung Overview */}
              <GlassCard className="p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50">Vorbereitung</span>
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[20px]" style={{ color: readinessColor }}>{readiness}%</span>
                </div>
                <div className="relative h-[6px] rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${readiness}%`, background: readinessColor, transition: 'width 0.6s ease', opacity: 0.8 }} />
                </div>
              </GlassCard>

              {/* ① Deine ToDo's */}
              <ExamPrepTodoSection
                parentId={detailExam.id}
                examSubject={detailExam.subject}
                examTitle={`${detailExam.subject} · ${fmtDate(detailExam.date)}`}
                SectionTitle={SectionTitle}
                onGenerateForWeakness={onGenerateForWeakness}
                onStartExamSimulation={onStartExamSimulation}
                allSets={allSets}
                onOpenFlashcardSet={onOpenFlashcardSet}
              />


              {/* ② Stärken & Schwächen – KI-Analyse */}
              <div className="mb-4">
                <SectionTitle icon={<Brain className="w-4 h-4" />} title={`Stärken & Schwächen (${detailExam.insights.length})`} />
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 leading-relaxed mb-2.5 -mt-1">
                  Deine Stärken & Schwächen in den klausurrelevanten Inhalten, basierend auf deinen bisherigen Lernaktivitäten.
                </p>
                <div className="space-y-2">
                  {[...detailExam.insights].sort((a, b) => {
                    const order: Record<string, number> = { 'not-practiced': 0, weakness: 1, strength: 2 };
                    return (order[a.type] ?? 9) - (order[b.type] ?? 9);
                  }).slice(0, 2).map((insight, idx) => {
                    const examTitleStr = `${detailExam.subject} · ${fmtDate(detailExam.date)}`;
                    const insightCfg = {
                      strength: { color: '#00D4AA', label: 'Stärke' },
                      weakness: { color: '#FFB84D', label: 'Schwachstelle' },
                      'not-practiced': { color: '#FF6B6B', label: 'Kritisch' },
                    }[insight.type];
                    const sevMap: Record<string, string> = { 'not-practiced': 'critical', weakness: 'warning', strength: 'moderate' };
                    return (
                      <StandardCard
                        key={idx}
                        subject={detailExam.subject}
                        topic={insight.topic}
                        detail={insight.detail}
                        score={getTopicScore(insight.topic, insight.type)}
                        severityColor={insightCfg.color}
                        severityLabel={insightCfg.label}
                        severity={sevMap[insight.type] || 'moderate'}
                        source="weakness"
                        onGenerate={(ctx) => { const notifLabel = insight.type === 'strength' ? 'Stärke weiter ausbauen' : 'Schwäche gezielt trainieren'; onGenerateForWeakness?.({ ...(ctx || { topic: insight.topic, subject: detailExam.subject, severity: sevMap[insight.type] || 'moderate', recommendation: insight.detail, source: 'weakness' }), contextLabel: 'Klassenarbeit-Vorbereitung', severityLabel: insightCfg.label, notificationLabel: notifLabel }); }}
                        onStartExam={(ctx) => { const notifLabel = insight.type === 'strength' ? 'Stärke weiter ausbauen' : 'Schwäche gezielt trainieren'; onStartExamSimulation?.({ ...(ctx || { topic: insight.topic, subject: detailExam.subject, severity: sevMap[insight.type] || 'moderate', recommendation: insight.detail, source: 'weakness' }), contextLabel: 'Klassenarbeit-Vorbereitung', severityLabel: insightCfg.label, notificationLabel: notifLabel }); }}
                        onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                      />
                    );
                  })}
                  {detailExam.insights.length > 2 && (
                    <button
                      onClick={() => { setShowAllInsights(true); setInsightsSeverityFilter('all'); }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-['Poppins:Medium',sans-serif] text-[11px] text-white/35 transition-all active:scale-[0.98]"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      Alle {detailExam.insights.length} anzeigen
                    </button>
                  )}
                </div>
              </div>

              {/* ④ KI-Empfehlungen mit Action-Buttons */}
              <div className="mb-4">
                <SectionTitle icon={<Sparkles className="w-4 h-4" />} title={`KI-Empfehlungen (${detailExam.recommendations.length})`} />
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 leading-relaxed mb-2.5 -mt-1">
                  Schlägt dir klausurrelevante Inhalte vor, die deine Vorbereitung gezielt stärken – dein Wegweiser, was du noch durchgehen solltest.
                </p>
                <div className="space-y-2.5">
                  {(() => {
                    const recSeverityOrder: Record<string, number> = { critical: 0, warning: 1, moderate: 2 };
                    const sortedRecs = [...detailExam.recommendations].sort((a, b) => (recSeverityOrder[a.severity] ?? 9) - (recSeverityOrder[b.severity] ?? 9));
                    const recSevCfg: Record<string, { color: string; label: string }> = {
                      critical: { color: '#FF6B6B', label: 'Dringend' },
                      warning: { color: '#FFB84D', label: 'Empfohlen' },
                      moderate: { color: '#00D4AA', label: 'Förderlich' },
                    };
                    return sortedRecs.slice(0, 2).map(rec => {
                      const cfg = recSevCfg[rec.severity];
                      const recSevLabelMap: Record<string, string> = { critical: 'Dringend', warning: 'Empfohlen', moderate: 'Förderlich' };
                      return (
                        <StandardCard
                          key={rec.id}
                          subject={rec.subject}
                          topic={rec.topic}
                          detail={rec.reason}
                          score={getTopicScore(rec.topic, `${rec.severity}-rec`)}
                          severityColor={cfg.color}
                          severityLabel={cfg.label}
                          severity={rec.severity}
                          source="recommendation"
                          showFlashcards={rec.actions.includes('flashcards')}
                          showExam={rec.actions.includes('exam-simulation')}
                          onGenerate={(ctx) => { const recLabel = ({ critical: 'Dringend', warning: 'Empfohlen', moderate: 'Förderlich' } as Record<string, string>)[rec.severity] || 'Förderlich'; onGenerateForWeakness?.({ ...(ctx || { topic: rec.topic, subject: rec.subject, severity: rec.severity, recommendation: rec.reason, source: 'recommendation' }), contextLabel: 'Klassenarbeit-Vorbereitung', severityLabel: recLabel, notificationLabel: 'KI-Empfehlung' }); }}
                          onStartExam={(ctx) => { const recLabel = ({ critical: 'Dringend', warning: 'Empfohlen', moderate: 'Förderlich' } as Record<string, string>)[rec.severity] || 'Förderlich'; onStartExamSimulation?.({ ...(ctx || { topic: rec.topic, subject: rec.subject, severity: rec.severity, recommendation: rec.reason, source: 'recommendation' }), contextLabel: 'Klassenarbeit-Vorbereitung', severityLabel: recLabel, notificationLabel: 'KI-Empfehlung' }); }}
                          onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                        />
                      );
                    });
                  })()}
                  {detailExam.recommendations.length > 2 && (
                    <button
                      onClick={() => { setShowAllRecommendations(true); setRecsSeverityFilter('all'); }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-['Poppins:Medium',sans-serif] text-[11px] text-white/35 transition-all active:scale-[0.98]"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      Alle {detailExam.recommendations.length} anzeigen
                    </button>
                  )}
                </div>
              </div>

              {/* ② Lernkurve – dynamisch basierend auf prepStartDate bis heute */}
              {(() => {
                const curveData = generateLearningCurve(detailExam.prepStartDate, detailExam.overallReadiness);
                const prepDays = Math.max(1, Math.floor((new Date('2026-03-17').getTime() - new Date(detailExam.prepStartDate).getTime()) / (1000 * 60 * 60 * 24)));
                return (
              <div className="mb-4">
                <SectionTitle icon={<TrendingUp className="w-4 h-4" />} title="Lernkurve" />
                <GlassCard className="p-4">
                  <div className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={curveData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs key="defs">
                          <linearGradient id={`examCurveGrad-${detailExam.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={readinessColor} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={readinessColor} stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          key="xaxis"
                          dataKey="label"
                          tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)', fontFamily: "'Poppins:Regular',sans-serif" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          key="yaxis"
                          domain={[0, 100]}
                          tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)', fontFamily: "'Poppins:Regular',sans-serif" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          key="tooltip"
                          contentStyle={{
                            background: 'rgba(20,20,20,0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 10,
                            fontSize: 11,
                            fontFamily: "'Poppins:Regular',sans-serif",
                            color: 'rgba(255,255,255,0.8)',
                          }}
                          formatter={(value: number) => [`${value}%`, 'Vorbereitung']}
                        />
                        <Area
                          key="area"
                          type="monotone"
                          dataKey="readiness"
                          stroke={readinessColor}
                          strokeWidth={2}
                          fill={`url(#examCurveGrad-${detailExam.id})`}
                          dot={{ r: 3, fill: readinessColor, strokeWidth: 0 }}
                          activeDot={{ r: 5, fill: readinessColor, strokeWidth: 2, stroke: '#0a0a0a' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/25 mt-2 text-center">
                    Vorbereitung über die letzten {prepDays} Tage
                  </p>
                </GlassCard>
              </div>
                );
              })()}

              {/* ③ Vergleich mit vergangenen Klausuren */}
              {detailExam.pastComparison && (
                <div className="mb-4">
                  <SectionTitle icon={<BarChart3 className="w-4 h-4" />} title="Vergleich" />
                  <GlassCard className="p-4">
                    {readiness > detailExam.pastComparison.daysBeforeReadiness ? (
                      <div className="flex items-center gap-2 p-2.5 rounded-lg mb-3" style={{ background: 'rgba(0,212,170,0.06)' }}>
                        <TrendingUp className="w-3 h-3 flex-shrink-0 text-[#00D4AA]" />
                        <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/35 leading-relaxed">
                          Du bist besser vorbereitet als bei der Klassenarbeit vom {fmtDate(detailExam.pastComparison.date)} zum gleichen Zeitpunkt.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2.5 rounded-lg mb-3" style={{ background: 'rgba(255,107,107,0.06)' }}>
                        <AlertTriangle className="w-3 h-3 flex-shrink-0 text-[#FF6B6B]" />
                        <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/35 leading-relaxed">
                          Deine Vorbereitung liegt unter dem Stand bei der Klassenarbeit vom {fmtDate(detailExam.pastComparison.date)}. Jetzt noch gegensteuern!
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/40 mb-1">
                          {detailExam.pastComparison.subject} · {fmtDate(detailExam.pastComparison.date)}
                        </p>
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white/60">
                          {detailExam.pastComparison.daysBeforeReadiness}%
                        </p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30 mt-0.5">
                          {detailExam.pastComparison.daysBeforeExam} Tage vorher · Note {detailExam.pastComparison.grade}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl text-center" style={{ background: `${readinessColor}08`, border: `1px solid ${readinessColor}15` }}>
                        <p className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/40 mb-1">
                          Jetzt
                        </p>
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[18px]" style={{ color: readinessColor }}>
                          {readiness}%
                        </p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30 mt-0.5">
                          {days} Tage vorher
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              )}

            </div>
          </div>
        );
      })()}

      {/* ===== GOAL DETAIL FULLSCREEN SUB-VIEW ===== */}
      {activeTab === 'goals' && (() => {
        const detailGoal = MOCK_ACTIVE_GOALS.find(g => g.id === goalDetailId);
        if (!detailGoal) return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 50,
              transform: 'translateX(100%)',
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        );

        const days = daysUntil(detailGoal.dueDate);
        const statusConf = {
          'on-track': { label: 'Auf Kurs', color: '#00D4AA', bg: 'rgba(0,212,170,0.08)', border: 'rgba(0,212,170,0.15)' },
          'at-risk': { label: 'Gefährdet', color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.15)' },
          'extended': { label: 'Verschoben', color: '#FFB84D', bg: 'rgba(255,184,77,0.08)', border: 'rgba(255,184,77,0.15)' },
        }[detailGoal.status];
        const masteryRange = detailGoal.masteryTarget - detailGoal.masteryStart;
        const masteryProgress = masteryRange > 0 ? Math.round(((detailGoal.masteryCurrent - detailGoal.masteryStart) / masteryRange) * 100) : 0;
        const masteryColor = '#00D4AA';
        const goalRecs = MOCK_GOAL_RECOMMENDATIONS.filter(r => r.goalId === detailGoal.id);

        // Generate learning curve for goal (using masteryStart as start, masteryCurrent as current)
        const goalStartDate = (() => {
          const d = new Date(detailGoal.dueDate);
          d.setDate(d.getDate() - 21); // assume goal was created ~21 days before due date
          return d.toISOString().split('T')[0];
        })();
        const goalCurveData = generateLearningCurve(goalStartDate, detailGoal.masteryCurrent);

        return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 50,
              transform: goalDetailId ? 'translateX(0)' : 'translateX(100%)',
              opacity: goalDetailId ? 1 : 0,
              pointerEvents: goalDetailId ? 'auto' : 'none',
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button
                onClick={() => { setGoalDetailId(null); setShowAllGoalRecs(false); setShowAllGoalDifficulties(false); }}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white truncate">{detailGoal.topic}</h1>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                  {detailGoal.subject} · Ziel: {formatDate(detailGoal.dueDate)}
                </p>
              </div>
              <span
                className="px-2.5 py-1 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px] flex-shrink-0"
                style={{ color: statusConf.color, background: statusConf.bg, border: `1px solid ${statusConf.border}` }}
              >
                {statusConf.label}
              </span>
            </div>

            {/* Scrollable Detail Content */}
            <div
              className="overflow-y-auto px-5 pb-12 scrollbar-hide"
              style={{ WebkitOverflowScrolling: 'touch', height: 'calc(100% - 70px)' }}
            >
              {/* Fortschritt */}
              <GlassCard className="p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50">Fortschritt</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-['Poppins:SemiBold',sans-serif] text-[20px]" style={{ color: masteryColor }}>{detailGoal.masteryCurrent}%</span>
                  </div>
                </div>
                <div className="relative h-[6px] rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(masteryProgress, 100)}%`, background: masteryColor, transition: 'width 0.6s ease', opacity: 0.8 }} />
                </div>
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-3 h-3 text-white/25" />
                    <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30">
                      {days > 0 ? `noch ${days} Tage` : days === 0 ? 'Heute' : `${Math.abs(days)} Tage überfällig`}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Notiz des Schülers */}
              {detailGoal.note && (
                <div className="mb-4">
                  <SectionTitle icon={<BookOpen className="w-4 h-4" />} title="Deine Notiz" />
                  <div
                    className="p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/45 leading-relaxed">
                      {detailGoal.note}
                    </p>
                  </div>
                </div>
              )}

              {/* ① Deine ToDo's */}
              <ExamPrepTodoSection
                parentId={detailGoal.id}
                examSubject={detailGoal.subject}
                examTitle={`${detailGoal.topic} (${detailGoal.subject})`}
                SectionTitle={SectionTitle}
                onGenerateForWeakness={onGenerateForWeakness}
                onStartExamSimulation={onStartExamSimulation}
                allSets={allSets}
                onOpenFlashcardSet={onOpenFlashcardSet}
                isGoalContext
              />

              {/* ② Erkannte Schwierigkeiten */}
              {detailGoal.difficulties.length > 0 && (
                <div className="mb-4">
                  <SectionTitle icon={<Brain className="w-4 h-4" />} title={`Erkannte Schwierigkeiten (${detailGoal.difficulties.length})`} />
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 leading-relaxed mb-2.5 -mt-1">
                    Schwierigkeiten, die beim Erreichen deines Lernziels erkannt wurden – arbeite gezielt daran, um deinen Fortschritt zu beschleunigen.
                  </p>
                  <div className="space-y-2">
                    {(() => {
                      const diffOrder: Record<string, number> = { major: 0, moderate: 1, minor: 2 };
                      const sorted = [...detailGoal.difficulties].sort((a, b) => (diffOrder[a.type] ?? 9) - (diffOrder[b.type] ?? 9));
                      return sorted.slice(0, 2).map((diff, idx) => {
                        const goalTitleStr = `${detailGoal.topic} (${detailGoal.subject})`;
                        const diffCfg: Record<string, { color: string; label: string }> = {
                          major: { color: '#FF6B6B', label: 'Hoch' },
                          moderate: { color: '#FFB84D', label: 'Mittel' },
                          minor: { color: '#00D4AA', label: 'Niedrig' },
                        };
                        const cfg = diffCfg[diff.type];
                        const sevMap: Record<string, string> = { major: 'critical', moderate: 'warning', minor: 'moderate' };
                        const sevLabelMap: Record<string, string> = { major: 'Hoch', moderate: 'Mittel', minor: 'Niedrig' };
                        return (
                          <StandardCard
                            key={idx}
                            subject={detailGoal.subject}
                            topic={diff.topic}
                            detail={diff.detail}
                            score={getTopicScore(diff.topic, diff.type)}
                            severityColor={cfg.color}
                            severityLabel={cfg.label}
                            severity={sevMap[diff.type] || 'moderate'}
                            source="weakness"
                            onGenerate={(ctx) => onGenerateForWeakness?.({ ...(ctx || { topic: diff.topic, subject: detailGoal.subject, severity: sevMap[diff.type] || 'moderate', recommendation: diff.detail, source: 'weakness' }), contextLabel: 'Lernziel erreichen', severityLabel: sevLabelMap[diff.type] || 'Niedrig', notificationLabel: 'Schwierigkeiten gezielt trainieren' })}
                            onStartExam={(ctx) => onStartExamSimulation?.({ ...(ctx || { topic: diff.topic, subject: detailGoal.subject, severity: sevMap[diff.type] || 'moderate', recommendation: diff.detail, source: 'weakness' }), contextLabel: 'Lernziel erreichen', severityLabel: sevLabelMap[diff.type] || 'Niedrig', notificationLabel: 'Schwierigkeiten gezielt trainieren' })}
                            onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                          />
                        );
                      });
                    })()}
                    {detailGoal.difficulties.length > 2 && (
                      <button
                        onClick={() => { setShowAllGoalDifficulties(true); setGoalDifficultySeverityFilter('all'); }}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-['Poppins:Medium',sans-serif] text-[11px] text-white/35 transition-all active:scale-[0.98]"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                        Alle {detailGoal.difficulties.length} anzeigen
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* KI-Empfehlungen */}
              <div className="mb-4">
                <SectionTitle icon={<Sparkles className="w-4 h-4" />} title={`KI-Empfehlungen (${goalRecs.length})`} />
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 leading-relaxed mb-2.5 -mt-1">
                  Schlägt dir Inhalte vor, die dich deinem Lernziel schneller näherbringen – dein persönlicher Wegweiser, was du als Nächstes angehen solltest.
                </p>
                <div className="space-y-2.5">
                  {(() => {
                    const recSeverityOrder: Record<string, number> = { critical: 0, warning: 1, moderate: 2 };
                    const sortedRecs = [...goalRecs].sort((a, b) => (recSeverityOrder[a.severity] ?? 9) - (recSeverityOrder[b.severity] ?? 9));
                    const recSevCfg: Record<string, { color: string; label: string }> = {
                      critical: { color: '#FF6B6B', label: 'Dringend' },
                      warning: { color: '#FFB84D', label: 'Empfohlen' },
                      moderate: { color: '#00D4AA', label: 'Förderlich' },
                    };
                    return sortedRecs.slice(0, 2).map(rec => {
                      const cfg = recSevCfg[rec.severity];
                      const recSevLabelMap: Record<string, string> = { critical: 'Dringend', warning: 'Empfohlen', moderate: 'Förderlich' };
                      return (
                        <StandardCard
                          key={rec.id}
                          subject={rec.subject}
                          topic={rec.topic}
                          detail={rec.reason}
                          score={getTopicScore(rec.topic, `${rec.severity}-rec`)}
                          severityColor={cfg.color}
                          severityLabel={cfg.label}
                          severity={rec.severity}
                          source="recommendation"
                          showFlashcards={rec.actions.includes('flashcards')}
                          showExam={rec.actions.includes('exam-simulation')}
                          onGenerate={(ctx) => { const recLabel = ({ critical: 'Dringend', warning: 'Empfohlen', moderate: 'Förderlich' } as Record<string, string>)[rec.severity] || 'Förderlich'; onGenerateForWeakness?.({ ...(ctx || { topic: rec.topic, subject: rec.subject, severity: rec.severity, recommendation: rec.reason, source: 'recommendation' }), contextLabel: 'Lernziel erreichen', severityLabel: recLabel, notificationLabel: 'KI-Empfehlung' }); }}
                          onStartExam={(ctx) => { const recLabel = ({ critical: 'Dringend', warning: 'Empfohlen', moderate: 'Förderlich' } as Record<string, string>)[rec.severity] || 'Förderlich'; onStartExamSimulation?.({ ...(ctx || { topic: rec.topic, subject: rec.subject, severity: rec.severity, recommendation: rec.reason, source: 'recommendation' }), contextLabel: 'Lernziel erreichen', severityLabel: recLabel, notificationLabel: 'KI-Empfehlung' }); }}
                          onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                        />
                      );
                    });
                  })()}
                  {goalRecs.length > 2 && (
                    <button
                      onClick={() => { setShowAllGoalRecs(true); setGoalRecsSeverityFilter('all'); }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-['Poppins:Medium',sans-serif] text-[11px] text-white/35 transition-all active:scale-[0.98]"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      Alle {goalRecs.length} anzeigen
                    </button>
                  )}
                </div>
              </div>

              {/* Lernkurve */}
              <div className="mb-4">
                <SectionTitle icon={<TrendingUp className="w-4 h-4" />} title="Lernkurve" />
                <GlassCard className="p-4">
                  <div className="h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={goalCurveData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs key="defs">
                          <linearGradient id={`goalCurveGrad-${detailGoal.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={masteryColor} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={masteryColor} stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          key="xaxis"
                          dataKey="label"
                          tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)', fontFamily: "'Poppins:Regular',sans-serif" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          key="yaxis"
                          domain={[0, 100]}
                          tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)', fontFamily: "'Poppins:Regular',sans-serif" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          key="tooltip"
                          contentStyle={{
                            background: 'rgba(20,20,20,0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 10,
                            fontSize: 11,
                            fontFamily: "'Poppins:Regular',sans-serif",
                            color: 'rgba(255,255,255,0.8)',
                          }}
                          formatter={(value: number) => [`${value}%`, 'Fortschritt']}
                        />
                        <Area
                          key="area"
                          type="monotone"
                          dataKey="readiness"
                          stroke={masteryColor}
                          strokeWidth={2}
                          fill={`url(#goalCurveGrad-${detailGoal.id})`}
                          dot={{ r: 3, fill: masteryColor, strokeWidth: 0 }}
                          activeDot={{ r: 5, fill: masteryColor, strokeWidth: 2, stroke: '#0a0a0a' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/25 mt-2 text-center">
                    Fortschritt über die letzten Wochen
                  </p>
                </GlassCard>
              </div>



            </div>
          </div>
        );
      })()}

      {/* ===== ALL GOAL DIFFICULTIES SLIDE-OVER ===== */}
      {activeTab === 'goals' && (() => {
        const detailGoal = MOCK_ACTIVE_GOALS.find(g => g.id === goalDetailId);
        if (!detailGoal || !showAllGoalDifficulties) return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: 'translateX(100%)',
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        );

        const diffConfig = {
          major: { color: '#FF6B6B', bg: 'rgba(255,107,107,0.06)', border: 'rgba(255,107,107,0.12)', label: 'Hoch' },
          moderate: { color: '#FFB84D', bg: 'rgba(255,184,77,0.06)', border: 'rgba(255,184,77,0.12)', label: 'Mittel' },
          minor: { color: '#00D4AA', bg: 'rgba(0,212,170,0.06)', border: 'rgba(0,212,170,0.12)', label: 'Niedrig' },
        };

        const diffOrder: Record<string, number> = { major: 0, moderate: 1, minor: 2 };
        const sortedDiffs = [...detailGoal.difficulties].sort((a, b) => (diffOrder[a.type] ?? 9) - (diffOrder[b.type] ?? 9));

        const filteredDiffs = goalDifficultySeverityFilter === 'all'
          ? sortedDiffs
          : sortedDiffs.filter(d => d.type === goalDifficultySeverityFilter);

        const diffFilterConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
          all:      { label: 'Alle',     color: '#00D4AA', bg: 'rgba(0,184,148,0.10)',   border: 'rgba(0,184,148,0.30)' },
          major:    { label: 'Hoch',     color: '#FF6B6B', bg: 'rgba(255,107,107,0.10)', border: 'rgba(255,107,107,0.30)' },
          moderate: { label: 'Mittel',   color: '#FFB84D', bg: 'rgba(255,184,77,0.10)',  border: 'rgba(255,184,77,0.30)' },
          minor:    { label: 'Niedrig',  color: '#00D4AA', bg: 'rgba(0,212,170,0.10)',   border: 'rgba(0,212,170,0.30)' },
        };

        return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: showAllGoalDifficulties ? 'translateX(0)' : 'translateX(100%)',
              opacity: showAllGoalDifficulties ? 1 : 0,
              pointerEvents: showAllGoalDifficulties ? 'auto' : 'none',
              display: 'flex',
              flexDirection: 'column' as const,
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button
                onClick={() => setShowAllGoalDifficulties(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white tracking-[-0.3px]">Erkannte Schwierigkeiten</h1>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                  {detailGoal.topic} · {detailGoal.subject} · {detailGoal.difficulties.length} Themen
                </p>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
              {(['all', 'major', 'moderate', 'minor'] as const).map(sevKey => {
                const isActive = goalDifficultySeverityFilter === sevKey;
                const config = diffFilterConfig[sevKey];
                return (
                  <button
                    key={sevKey}
                    onClick={() => setGoalDifficultySeverityFilter(isActive && sevKey !== 'all' ? 'all' : sevKey)}
                    className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      background: isActive ? config.bg : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? config.border : 'rgba(255,255,255,0.08)'}`,
                      color: isActive ? config.color : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>

            {/* Difficulties List */}
            <div className="flex-1 overflow-y-auto px-5 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="space-y-2">
                {filteredDiffs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="w-8 h-8 text-white/10 mb-3" />
                    <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">Keine Einträge vorhanden</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/15 mt-1">
                      {goalDifficultySeverityFilter === 'major' ? 'Keine Einträge mit hoher Priorität – gut gemacht!'
                        : goalDifficultySeverityFilter === 'moderate' ? 'Es gibt keine Einträge mit mittlerer Priorität.'
                        : goalDifficultySeverityFilter === 'minor' ? 'Es gibt keine Einträge mit niedriger Priorität.'
                        : 'Keine Schwierigkeiten vorhanden.'}
                    </p>
                  </div>
                ) : (
                  filteredDiffs.map((diff, idx) => {
                    const goalTitleStr = `${detailGoal.topic} (${detailGoal.subject})`;
                    const cfg = diffConfig[diff.type];
                    const sevMap: Record<string, string> = { major: 'critical', moderate: 'warning', minor: 'moderate' };
                    const sevLabelMap: Record<string, string> = { major: 'Hoch', moderate: 'Mittel', minor: 'Niedrig' };
                    return (
                      <StandardCard
                        key={idx}
                        subject={detailGoal.subject}
                        topic={diff.topic}
                        detail={diff.detail}
                        score={getTopicScore(diff.topic, diff.type)}
                        severityColor={cfg.color}
                        severityLabel={cfg.label}
                        severity={sevMap[diff.type] || 'moderate'}
                        source="weakness"
                        onGenerate={(ctx) => onGenerateForWeakness?.({ ...(ctx || { topic: diff.topic, subject: detailGoal.subject, severity: sevMap[diff.type] || 'moderate', recommendation: diff.detail, source: 'weakness' }), contextLabel: 'Lernziel erreichen', severityLabel: sevLabelMap[diff.type] || 'Niedrig', notificationLabel: 'Schwierigkeiten gezielt trainieren' })}
                        onStartExam={(ctx) => onStartExamSimulation?.({ ...(ctx || { topic: diff.topic, subject: detailGoal.subject, severity: sevMap[diff.type] || 'moderate', recommendation: diff.detail, source: 'weakness' }), contextLabel: 'Lernziel erreichen', severityLabel: sevLabelMap[diff.type] || 'Niedrig', notificationLabel: 'Schwierigkeiten gezielt trainieren' })}
                        onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== ALL GOAL RECOMMENDATIONS SLIDE-OVER ===== */}
      {activeTab === 'goals' && (() => {
        const detailGoal = MOCK_ACTIVE_GOALS.find(g => g.id === goalDetailId);
        if (!detailGoal || !showAllGoalRecs) return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: 'translateX(100%)',
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        );

        const goalRecs = MOCK_GOAL_RECOMMENDATIONS.filter(r => r.goalId === detailGoal.id);
        const recSevConfig = {
          critical: { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: '#FF6B6B', bg: 'rgba(255,107,107,0.06)', border: 'rgba(255,107,107,0.12)', label: 'Dringend' },
          warning: { icon: <CircleDot className="w-3.5 h-3.5" />, color: '#FFB84D', bg: 'rgba(255,184,77,0.06)', border: 'rgba(255,184,77,0.12)', label: 'Empfohlen' },
          moderate: { icon: <CheckCircle className="w-3.5 h-3.5" />, color: '#00D4AA', bg: 'rgba(0,212,170,0.06)', border: 'rgba(0,212,170,0.12)', label: 'Förderlich' },
        };

        const recSeverityOrder: Record<string, number> = { critical: 0, warning: 1, moderate: 2 };
        const sortedRecs = [...goalRecs].sort((a, b) => (recSeverityOrder[a.severity] ?? 9) - (recSeverityOrder[b.severity] ?? 9));

        const filteredRecs = goalRecsSeverityFilter === 'all'
          ? sortedRecs
          : sortedRecs.filter(r => r.severity === goalRecsSeverityFilter);

        const recsFilterConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
          all:       { label: 'Alle',       color: '#00D4AA', bg: 'rgba(0,184,148,0.10)',   border: 'rgba(0,184,148,0.30)' },
          critical:  { label: 'Dringend',   color: '#FF6B6B', bg: 'rgba(255,107,107,0.10)', border: 'rgba(255,107,107,0.30)' },
          warning:   { label: 'Empfohlen',  color: '#FFB84D', bg: 'rgba(255,184,77,0.10)',  border: 'rgba(255,184,77,0.30)' },
          moderate:  { label: 'Förderlich', color: '#00D4AA', bg: 'rgba(0,212,170,0.10)',   border: 'rgba(0,212,170,0.30)' },
        };

        return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: showAllGoalRecs ? 'translateX(0)' : 'translateX(100%)',
              opacity: showAllGoalRecs ? 1 : 0,
              pointerEvents: showAllGoalRecs ? 'auto' : 'none',
              display: 'flex',
              flexDirection: 'column' as const,
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button
                onClick={() => setShowAllGoalRecs(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white tracking-[-0.3px]">KI-Empfehlungen</h1>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                  {detailGoal.topic} · {goalRecs.length} Empfehlungen
                </p>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
              {(['all', 'critical', 'warning', 'moderate'] as const).map(sevKey => {
                const isActive = goalRecsSeverityFilter === sevKey;
                const config = recsFilterConfig[sevKey];
                return (
                  <button
                    key={sevKey}
                    onClick={() => setGoalRecsSeverityFilter(isActive && sevKey !== 'all' ? 'all' : sevKey)}
                    className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      background: isActive ? config.bg : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? config.border : 'rgba(255,255,255,0.08)'}`,
                      color: isActive ? config.color : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>

            {/* Recommendations List */}
            <div className="flex-1 overflow-y-auto px-5 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="space-y-2.5">
                {filteredRecs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="w-8 h-8 text-white/10 mb-3" />
                    <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">Keine Einträge vorhanden</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/15 mt-1">
                      {goalRecsSeverityFilter === 'critical' ? 'Keine dringenden Empfehlungen – gut gemacht!'
                        : goalRecsSeverityFilter === 'warning' ? 'Keine empfohlenen Inhalte für diesen Filter.'
                        : goalRecsSeverityFilter === 'moderate' ? 'Keine förderlichen Empfehlungen vorhanden.'
                        : 'Keine Empfehlungen vorhanden.'}
                    </p>
                  </div>
                ) : (
                  filteredRecs.map(rec => {
                    const cfg = recSevConfig[rec.severity];
                    const recSevLabelMap: Record<string, string> = { critical: 'Dringend', warning: 'Empfohlen', moderate: 'Förderlich' };
                    return (
                      <StandardCard
                        key={rec.id}
                        subject={rec.subject}
                        topic={rec.topic}
                        detail={rec.reason}
                        score={getTopicScore(rec.topic, `${rec.severity}-rec`)}
                        severityColor={cfg.color}
                        severityLabel={cfg.label}
                        showFlashcards={rec.actions.includes('flashcards')}
                        showExam={rec.actions.includes('exam-simulation')}
                        severity={rec.severity}
                        source="recommendation"
                        onGenerate={(ctx) => { setShowAllGoalRecs(false); const recLabel = ({ critical: 'Dringend', warning: 'Empfohlen', moderate: 'Förderlich' } as Record<string, string>)[rec.severity] || 'Förderlich'; onGenerateForWeakness?.({ ...(ctx || { topic: rec.topic, subject: rec.subject, severity: rec.severity, recommendation: rec.reason, source: 'recommendation' }), contextLabel: 'Lernziel erreichen', severityLabel: recLabel, notificationLabel: 'KI-Empfehlung' }); }}
                        onStartExam={(ctx) => { setShowAllGoalRecs(false); const recLabel = ({ critical: 'Dringend', warning: 'Empfohlen', moderate: 'Förderlich' } as Record<string, string>)[rec.severity] || 'Förderlich'; onStartExamSimulation?.({ ...(ctx || { topic: rec.topic, subject: rec.subject, severity: rec.severity, recommendation: rec.reason, source: 'recommendation' }), contextLabel: 'Lernziel erreichen', severityLabel: recLabel, notificationLabel: 'KI-Empfehlung' }); }}
                        onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== ALL INSIGHTS SUB-VIEW ===== */}
      {activeTab === 'goals' && (() => {
        const detailExam = upcomingExams.find(e => e.id === examDetailId);
        if (!detailExam || !showAllInsights) return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: 'translateX(100%)',
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        );

        const insightConfig = {
          strength: { color: '#00D4AA', bg: 'rgba(0,212,170,0.06)', border: 'rgba(0,212,170,0.12)', label: 'Stärke' },
          weakness: { color: '#FFB84D', bg: 'rgba(255,184,77,0.06)', border: 'rgba(255,184,77,0.12)', label: 'Schwachstelle' },
          'not-practiced': { color: '#FF6B6B', bg: 'rgba(255,107,107,0.06)', border: 'rgba(255,107,107,0.12)', label: 'Kritisch' },
        };

        const insightSeverityOrder: Record<string, number> = { 'not-practiced': 0, weakness: 1, strength: 2 };
        const sortedInsights = [...detailExam.insights].sort((a, b) => (insightSeverityOrder[a.type] ?? 9) - (insightSeverityOrder[b.type] ?? 9));

        const filteredInsights = insightsSeverityFilter === 'all'
          ? sortedInsights
          : sortedInsights.filter(i => i.type === insightsSeverityFilter);

        const insightsFilterConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
          all:              { label: 'Alle',           color: '#00D4AA', bg: 'rgba(0,184,148,0.10)',   border: 'rgba(0,184,148,0.30)' },
          'not-practiced':  { label: 'Kritisch',       color: '#FF6B6B', bg: 'rgba(255,107,107,0.10)', border: 'rgba(255,107,107,0.30)' },
          weakness:         { label: 'Schwachstelle',  color: '#FFB84D', bg: 'rgba(255,184,77,0.10)',  border: 'rgba(255,184,77,0.30)' },
          strength:         { label: 'Stärke',         color: '#00D4AA', bg: 'rgba(0,212,170,0.10)',   border: 'rgba(0,212,170,0.30)' },
        };

        return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: showAllInsights ? 'translateX(0)' : 'translateX(100%)',
              opacity: showAllInsights ? 1 : 0,
              pointerEvents: showAllInsights ? 'auto' : 'none',
              display: 'flex',
              flexDirection: 'column' as const,
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button
                onClick={() => setShowAllInsights(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white tracking-[-0.3px]">Stärken & Schwächen</h1>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                  {detailExam.subject} · {fmtDate(detailExam.date)} · {detailExam.insights.length} Themen
                </p>
              </div>
            </div>

            {/* Filter Chips – matches erkannte Schwächen style */}
            <div className="flex items-center gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
              {(['all', 'not-practiced', 'weakness', 'strength'] as const).map(sevKey => {
                const isActive = insightsSeverityFilter === sevKey;
                const config = insightsFilterConfig[sevKey];
                return (
                  <button
                    key={sevKey}
                    onClick={() => setInsightsSeverityFilter(isActive && sevKey !== 'all' ? 'all' : sevKey)}
                    className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      background: isActive ? config.bg : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? config.border : 'rgba(255,255,255,0.08)'}`,
                      color: isActive ? config.color : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>

            {/* Insights List */}
            <div className="flex-1 overflow-y-auto px-5 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="space-y-2">
                {filteredInsights.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="w-8 h-8 text-white/10 mb-3" />
                    <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">Keine Einträge vorhanden</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/15 mt-1">
                      {insightsSeverityFilter === 'not-practiced' ? 'Keine ungeübten Themen vorhanden.'
                        : insightsSeverityFilter === 'weakness' ? 'Keine Schwachstellen erkannt – gut gemacht!'
                        : insightsSeverityFilter === 'strength' ? 'Keine Stärken in diesem Filter.'
                        : 'Keine Erkenntnisse vorhanden.'}
                    </p>
                  </div>
                ) : (
                  filteredInsights.map((insight, idx) => {
                    const examTitleStr = `${detailExam.subject} · ${fmtDate(detailExam.date)}`;
                    const cfg = insightConfig[insight.type];
                    const sevMap: Record<string, string> = { 'not-practiced': 'critical', weakness: 'warning', strength: 'moderate' };
                    return (
                      <StandardCard
                        key={idx}
                        subject={detailExam.subject}
                        topic={insight.topic}
                        detail={insight.detail}
                        score={getTopicScore(insight.topic, insight.type)}
                        severityColor={cfg.color}
                        severityLabel={cfg.label}
                        severity={sevMap[insight.type] || 'moderate'}
                        source="weakness"
                        onGenerate={(ctx) => { const notifLabel = insight.type === 'strength' ? 'Stärke weiter ausbauen' : 'Schwäche gezielt trainieren'; onGenerateForWeakness?.({ ...(ctx || { topic: insight.topic, subject: detailExam.subject, severity: sevMap[insight.type] || 'moderate', recommendation: insight.detail, source: 'weakness' }), contextLabel: 'Klassenarbeit-Vorbereitung', severityLabel: cfg.label, notificationLabel: notifLabel }); }}
                        onStartExam={(ctx) => { const notifLabel = insight.type === 'strength' ? 'Stärke weiter ausbauen' : 'Schwäche gezielt trainieren'; onStartExamSimulation?.({ ...(ctx || { topic: insight.topic, subject: detailExam.subject, severity: sevMap[insight.type] || 'moderate', recommendation: insight.detail, source: 'weakness' }), contextLabel: 'Klassenarbeit-Vorbereitung', severityLabel: cfg.label, notificationLabel: notifLabel }); }}
                        onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== ALL EXAMS SLIDE-OVER ===== */}
      {activeTab === 'goals' && (() => {
        if (!showAllExams) return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: 'translateX(100%)',
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        );

        const futureExamsAll = upcomingExams.filter(e => daysUntil(e.date) >= 0);
        const allExamSubjects = Array.from(new Set(futureExamsAll.map(e => e.subject)));
        const filteredExams = examsSubjectFilter === 'all'
          ? futureExamsAll
          : futureExamsAll.filter(e => e.subject === examsSubjectFilter);

        return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: showAllExams ? 'translateX(0)' : 'translateX(100%)',
              opacity: showAllExams ? 1 : 0,
              pointerEvents: showAllExams ? 'auto' : 'none',
              display: 'flex',
              flexDirection: 'column' as const,
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button
                onClick={() => setShowAllExams(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white tracking-[-0.3px]">Bevorstehende Klassenarbeiten</h1>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                  {futureExamsAll.length} Klassenarbeit{futureExamsAll.length !== 1 ? 'en' : ''} · {allExamSubjects.length} Fächer
                </p>
              </div>
            </div>

            {/* Filter Chips – Fächer */}
            <div className="flex items-center gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
              {(['all', ...allExamSubjects] as const).map(subj => {
                const isActive = examsSubjectFilter === subj;
                const count = subj === 'all' ? futureExamsAll.length : futureExamsAll.filter(e => e.subject === subj).length;
                return (
                  <button
                    key={subj}
                    onClick={() => setExamsSubjectFilter(isActive && subj !== 'all' ? 'all' : subj)}
                    className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      background: isActive ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                      color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {subj === 'all' ? 'Alle' : subj}
                    <span
                      className="px-1.5 py-0.5 rounded-full font-['Poppins:Medium',sans-serif] text-[9px]"
                      style={{
                        background: isActive ? 'rgba(0,184,148,0.15)' : 'rgba(255,255,255,0.06)',
                        color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.35)',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Exams List */}
            <div className="flex-1 overflow-y-auto px-5 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="space-y-3">
                {filteredExams.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CalendarDays className="w-8 h-8 text-white/10 mb-3" />
                    <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">Keine Klassenarbeiten für dieses Fach</p>
                  </div>
                ) : (
                  filteredExams.map(exam => {
                    const days = daysUntil(exam.date);
                    const countdownColor = days <= 3 ? '#FF6B6B' : days <= 7 ? '#FFB84D' : '#00D4AA';
                    const readiness = exam.overallReadiness;
                    const readinessColor = '#00D4AA';

                    return (
                      <button
                        key={exam.id}
                        onClick={() => { setShowAllExams(false); setExamDetailId(exam.id); setShowAllRecommendations(false); }}
                        className="w-full text-left transition-all duration-150 active:scale-[0.98]"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                      <GlassCard className="p-4">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">{exam.subject}</span>
                            <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">· {formatDate(exam.date)}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px]" style={{ color: countdownColor, background: `${countdownColor}15`, border: `1px solid ${countdownColor}30` }}>
                            {days === 0 ? 'Heute' : days === 1 ? 'Morgen' : `In ${days} Tagen`}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50">Vorbereitung</span>
                            <span className="font-['Poppins:SemiBold',sans-serif] text-[11px]" style={{ color: readinessColor }}>{readiness}%</span>
                          </div>
                          <div className="relative h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${readiness}%`, background: readinessColor, transition: 'width 0.6s ease', opacity: 0.8 }} />
                          </div>
                        </div>
                        <div className="flex justify-end mt-2">
                          <ChevronRight className="w-4 h-4 text-white/20" />
                        </div>
                      </GlassCard>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== ALL COMPLETED EXAMS SLIDE-OVER ===== */}
      {activeTab === 'goals' && (() => {
        const archivedFromUpcoming2 = upcomingExams.filter(e => daysUntil(e.date) < 0).map(e => ({
          id: e.id, subject: e.subject, date: e.date, overallReadiness: e.overallReadiness,
        }));
        const allCompleted2: import('./profileAnalyticsMockExams').CompletedExam[] = [...archivedFromUpcoming2, ...MOCK_COMPLETED_EXAMS]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (!showAllCompletedExams) return (
          <div style={{ ...prognosisSlideStyle, background: '#0a0a0a', zIndex: 60, transform: 'translateX(100%)', opacity: 0, pointerEvents: 'none' }} />
        );

        const completedSubjects = Array.from(new Set(allCompleted2.map(e => e.subject)));
        const filteredCompleted = completedExamsSubjectFilter === 'all' ? allCompleted2 : allCompleted2.filter(e => e.subject === completedExamsSubjectFilter);
        const gradeColors2: Record<string, { bg: string; border: string; text: string }> = {
          '1': { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)', text: '#4ADE80' },
          '2': { bg: 'rgba(96,200,120,0.12)', border: 'rgba(96,200,120,0.25)', text: '#60C878' },
          '3': { bg: 'rgba(232,185,96,0.12)', border: 'rgba(232,185,96,0.25)', text: '#E8B960' },
          '4': { bg: 'rgba(245,158,66,0.12)', border: 'rgba(245,158,66,0.25)', text: '#F59E42' },
          '5': { bg: 'rgba(255,120,80,0.12)', border: 'rgba(255,120,80,0.25)', text: '#FF7850' },
          '6': { bg: 'rgba(255,69,58,0.12)', border: 'rgba(255,69,58,0.25)', text: '#FF453A' },
        };

        return (
          <div style={{ ...prognosisSlideStyle, background: '#0a0a0a', zIndex: 60, transform: showAllCompletedExams ? 'translateX(0)' : 'translateX(100%)', opacity: showAllCompletedExams ? 1 : 0, pointerEvents: showAllCompletedExams ? 'auto' : 'none', display: 'flex', flexDirection: 'column' as const }}>
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button onClick={() => setShowAllCompletedExams(false)} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]" style={{ WebkitTapHighlightColor: 'transparent' }}>
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white tracking-[-0.3px]">Abgeschlossene Klausuren</h1>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">{allCompleted2.length} Klausur{allCompleted2.length !== 1 ? 'en' : ''} · {completedSubjects.length} Fächer</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
              {(['all', ...completedSubjects] as const).map(subj => {
                const isActive = completedExamsSubjectFilter === subj;
                const count = subj === 'all' ? allCompleted2.length : allCompleted2.filter(e => e.subject === subj).length;
                return (
                  <button key={subj} onClick={() => setCompletedExamsSubjectFilter(isActive && subj !== 'all' ? 'all' : subj)} className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5" style={{ WebkitTapHighlightColor: 'transparent', background: isActive ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isActive ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`, color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.5)' }}>
                    {subj === 'all' ? 'Alle' : subj}
                    <span className="px-1.5 py-0.5 rounded-full font-['Poppins:Medium',sans-serif] text-[9px]" style={{ background: isActive ? 'rgba(0,184,148,0.15)' : 'rgba(255,255,255,0.06)', color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.35)' }}>{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="space-y-3">
                {filteredCompleted.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="w-8 h-8 text-white/10 mb-3" />
                    <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">Keine Klausuren für dieses Fach</p>
                  </div>
                ) : filteredCompleted.map(exam => {
                  const grade = examGradesStore.getGrade(exam.id);
                  const baseGrade = grade ? grade.replace(/[+-]/, '') : '';
                  const gc = baseGrade ? gradeColors2[baseGrade] : null;
                  return (
                    <button key={exam.id} onClick={() => setCompletedExamDetailId(exam.id)} className="w-full text-left transition-all duration-150 active:scale-[0.98]" style={{ WebkitTapHighlightColor: 'transparent' }}>
                      <GlassCard className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/25 uppercase tracking-wider">{exam.subject}</span>
                          {grade ? (
                            <div className="flex items-center px-2.5 py-1 rounded-full" style={{ background: gc?.bg || 'rgba(255,255,255,0.06)', border: `1px solid ${gc?.border || 'rgba(255,255,255,0.12)'}` }}>
                              <span className="font-['Poppins:Bold',sans-serif] text-[13px]" style={{ color: gc?.text || 'white' }}>{grade}</span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-['Poppins:Medium',sans-serif] text-[10px] whitespace-nowrap" style={{ backgroundColor: 'rgba(212,160,68,0.10)', border: '1px dashed rgba(212,160,68,0.25)' }}><Star className="w-2.5 h-2.5 text-[#D4A044]/60" /><span className="text-[#D4A044]/60">Note?</span></span>
                          )}
                        </div>
                        <h4 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white mb-0.5">{formatDate(exam.date)}</h4>
                        <div className="flex items-center justify-between">
                          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">Klassenarbeit</p>
                          <ChevronRight className="w-4 h-4 text-white/20" />
                        </div>
                      </GlassCard>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== COMPLETED EXAM DETAIL VIEW ===== */}
      {activeTab === 'goals' && (() => {
        const archivedFromUpcoming3 = upcomingExams.filter(e => daysUntil(e.date) < 0).map(e => ({
          id: e.id, subject: e.subject, date: e.date, overallReadiness: e.overallReadiness,
        }));
        const allCompleted3: CompletedExam[] = [...archivedFromUpcoming3, ...MOCK_COMPLETED_EXAMS];
        const cExam = allCompleted3.find(e => e.id === completedExamDetailId);

        if (!cExam) return (
          <div style={{ ...prognosisSlideStyle, background: '#0a0a0a', zIndex: 65, transform: 'translateX(100%)', opacity: 0, pointerEvents: 'none' }} />
        );

        const grade = examGradesStore.getGrade(cExam.id);
        const gradeColorsDetail: Record<string, { bg: string; border: string; text: string }> = {
          '1': { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)', text: '#4ADE80' },
          '2': { bg: 'rgba(96,200,120,0.12)', border: 'rgba(96,200,120,0.25)', text: '#60C878' },
          '3': { bg: 'rgba(232,185,96,0.12)', border: 'rgba(232,185,96,0.25)', text: '#E8B960' },
          '4': { bg: 'rgba(245,158,66,0.12)', border: 'rgba(245,158,66,0.25)', text: '#F59E42' },
          '5': { bg: 'rgba(255,120,80,0.12)', border: 'rgba(255,120,80,0.25)', text: '#FF7850' },
          '6': { bg: 'rgba(255,69,58,0.12)', border: 'rgba(255,69,58,0.25)', text: '#FF453A' },
        };
        const baseGradeD = grade ? grade.replace(/[+-]/, '') : '';
        const gcD = baseGradeD ? gradeColorsDetail[baseGradeD] : null;

        // Generate deterministic mock data based on exam id
        const seed = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; } return Math.abs(h); };
        const s = seed(cExam.id);
        const topicsBySubject: Record<string, { name: string; readiness: number; insight: string }[]> = {
          'Mathematik': [
            { name: 'Bruchrechnung', readiness: 85, insight: 'Du hast Bruchrechnung in 4 Simulationen mit durchschnittlich 85% beantwortet.' },
            { name: 'Prozentrechnung', readiness: 72, insight: 'Bei Prozentrechnung wurden Grundwert und Prozentwert gelegentlich verwechselt.' },
            { name: 'Lineare Gleichungen', readiness: 58, insight: 'Bei Linearen Gleichungen wurden Äquivalenzumformungen häufig fehlerhaft angewendet.' },
            { name: 'Geometrie', readiness: 79, insight: 'Du hast Geometrie in 3 Simulationen mit durchschnittlich 79% beantwortet.' },
            { name: 'Scheitelpunktform', readiness: 88, insight: 'Du hast Scheitelpunktform in 3 Simulationen mit durchschnittlich 88% beantwortet.' },
            { name: 'pq-Formel', readiness: 35, insight: 'Die pq-Formel wurde in Übungen nur zu 35% korrekt angewendet – besonders Sonderfälle waren problematisch.' },
          ],
          'Physik': [
            { name: 'Mechanik', readiness: 82 },
            { name: 'Optik', readiness: 74 },
            { name: 'Elektrizität', readiness: 68 },
          ],
          'Deutsch': [
            { name: 'Erörterung', readiness: 88, insight: 'Du hast Erörterung in 3 Simulationen mit durchschnittlich 88% beantwortet.' },
            { name: 'Gedichtanalyse', readiness: 65, insight: 'Bei der Gedichtanalyse wurden Stilmittel häufig nicht erkannt.' },
            { name: 'Grammatik', readiness: 91, insight: 'Du hast Grammatik in 4 Simulationen mit durchschnittlich 91% beantwortet.' },
            { name: 'Textinterpretation', readiness: 45, insight: 'Bei der Textinterpretation fehlte oft der Bezug zum historischen Kontext.' },
          ],
          'Englisch': [
            { name: 'Reading Comprehension', readiness: 92, insight: 'Du hast Reading Comprehension in 3 Simulationen mit durchschnittlich 92% beantwortet.' },
            { name: 'Vocabulary', readiness: 85, insight: 'Du hast Vocabulary in 4 Simulationen mit durchschnittlich 85% beantwortet.' },
            { name: 'Grammar', readiness: 78, insight: 'Du hast Grammar in 3 Simulationen mit durchschnittlich 78% beantwortet.' },
            { name: 'Writing', readiness: 62, insight: 'Beim Writing wurden Konjunktionen und Übergänge häufig fehlerhaft eingesetzt.' },
          ],
          'Biologie': [
            { name: 'Zellbiologie', readiness: 48, insight: 'Bei Zellbiologie wurden Zellorganellen und ihre Funktionen häufig verwechselt.' },
            { name: 'Genetik', readiness: 42, insight: 'Bei Genetik wurden Kreuzungsschemata nur zu 42% korrekt gelöst.' },
            { name: 'Ökologie', readiness: 55, insight: 'Bei Ökologie wurden Nahrungsketten und Stoffkreisläufe häufig unvollständig beschrieben.' },
            { name: 'Evolution', readiness: 76, insight: 'Du hast Evolution in 2 Simulationen mit durchschnittlich 76% beantwortet.' },
          ],
          'Französisch': [
            { name: 'Passé Composé', readiness: 62, insight: 'Beim Passé Composé wurden Hilfsverben être/avoir häufig verwechselt.' },
            { name: 'Vokabeln', readiness: 54, insight: 'Bei Vokabeln wurden Faux Amis häufig falsch übersetzt.' },
            { name: 'Textverständnis', readiness: 49, insight: 'Beim Textverständnis wurden Detailfragen nur zu 49% korrekt beantwortet.' },
            { name: 'Subjonctif', readiness: 30, insight: 'Der Subjonctif wurde in Übungen nur zu 30% korrekt angewendet – die Auslöser waren unklar.' },
          ],
          'Geschichte': [
            { name: 'Weimarer Republik', readiness: 78, insight: 'Du hast Weimarer Republik in 3 Simulationen mit durchschnittlich 78% beantwortet.' },
            { name: 'Industrialisierung', readiness: 71, insight: 'Bei Industrialisierung wurden soziale Folgen häufig unvollständig beschrieben.' },
            { name: 'Quellenanalyse', readiness: 68, insight: 'Bei der Quellenanalyse wurde der historische Kontext häufig nicht ausreichend einbezogen.' },
            { name: 'Imperialismus', readiness: 55, insight: 'Beim Imperialismus wurden Ursachen und Folgen häufig durcheinander gebracht.' },
          ],
          'Chemie': [
            { name: 'Säuren & Basen', readiness: 62, insight: 'Bei Säuren & Basen wurden pH-Wert-Berechnungen häufig fehlerhaft durchgeführt.' },
            { name: 'Redoxreaktionen', readiness: 55, insight: 'Bei Redoxreaktionen wurden Oxidationszahlen häufig falsch bestimmt.' },
            { name: 'Atommodelle', readiness: 58, insight: 'Bei Atommodellen wurden Orbitalmodell und Schalenmodell häufig verwechselt.' },
            { name: 'Organische Chemie', readiness: 38, insight: 'Organische Chemie wurde nur zu 38% korrekt gelöst – besonders Nomenklatur war problematisch.' },
          ],
          'Kunst': [
            { name: 'Farbtheorie', readiness: 90, insight: 'Du hast Farbtheorie in 3 Simulationen mit durchschnittlich 90% beantwortet.' },
            { name: 'Bildanalyse', readiness: 86, insight: 'Du hast Bildanalyse in 2 Simulationen mit durchschnittlich 86% beantwortet.' },
            { name: 'Epochen', readiness: 82, insight: 'Du hast Epochen in 3 Simulationen mit durchschnittlich 82% beantwortet.' },
          ],
        };
        const topics = topicsBySubject[cExam.subject] || [
          { name: 'Thema 1', readiness: 70, insight: 'Keine detaillierte Analyse verfügbar.' },
          { name: 'Thema 2', readiness: 55, insight: 'Keine detaillierte Analyse verfügbar.' },
        ];
        const cardsLearned = 20 + (s % 40);
        const simulations = 1 + (s % 4);
        const studyHours = (1.5 + (s % 50) / 10).toFixed(1).replace('.', ',');

        // AI retrospective text
        const weakestTopic = [...topics].sort((a, b) => a.readiness - b.readiness)[0];
        const strongestTopic = [...topics].sort((a, b) => b.readiness - a.readiness)[0];
        const aiText = `Du hast dich auf diese Klassenarbeit vorbereitet und ${cExam.overallReadiness}% Bereitschaft erreicht. Deine Stärke war ${strongestTopic.name} (${strongestTopic.readiness}%), während ${weakestTopic.name} (${weakestTopic.readiness}%) deine größte Lücke war. Insgesamt hast du ${cardsLearned} Karteikarten gelernt und ${simulations} Simulation${simulations > 1 ? 'en' : ''} absolviert.`;

        return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 65,
              transform: completedExamDetailId ? 'translateX(0)' : 'translateX(100%)',
              opacity: completedExamDetailId ? 1 : 0,
              pointerEvents: completedExamDetailId ? 'auto' : 'none',
              display: 'flex',
              flexDirection: 'column' as const,
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button
                onClick={() => { setCompletedExamDetailId(null); setShowAllTopics(false); }}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white truncate">{cExam.subject}</h1>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                  {formatDate(cExam.date)} · Abgeschlossene Klassenarbeit
                </p>
              </div>
            </div>

            {/* Scrollable Detail Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-12 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>

              {/* Section 1: Vorbereitungs-Bilanz */}
              <div className="mb-4 mt-4">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white/25 uppercase tracking-wider mb-1">Vorbereitungs-Bilanz</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35 mb-3">Dein Vorbereitungsstand am Tag der Klassenarbeit.</p>
                <GlassCard className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50">Bereitschaft</span>
                    <span className="font-['Poppins:SemiBold',sans-serif] text-[24px] text-[#00D4AA]">{cExam.overallReadiness}%</span>
                  </div>
                  <div className="relative h-[6px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${cExam.overallReadiness}%`, background: '#00D4AA', opacity: 0.8 }} />
                  </div>
                </GlassCard>
              </div>

              {/* Section 2: Note eintragen / display */}
              <div className="mb-4">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white/25 uppercase tracking-wider mb-1">Note</p>
                {grade ? (
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center px-4 py-2 rounded-2xl" style={{ background: gcD?.bg || 'rgba(255,255,255,0.06)', border: `1.5px solid ${gcD?.border || 'rgba(255,255,255,0.12)'}` }}>
                        <span className="font-['Poppins:Bold',sans-serif] text-[24px]" style={{ color: gcD?.text || 'white' }}>{grade}</span>
                      </div>
                      <div>
                        <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/80">Eingetragene Note</p>
                        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30 mt-0.5">Gespeichert · nicht editierbar</p>
                      </div>
                    </div>
                  </GlassCard>
                ) : (
                  <button
                    onClick={() => { setGradeSelectedGrade(''); setGradeSelectedModifier(''); setGradeModalExam(cExam); }}
                    className="w-full transition-all active:scale-[0.97]"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <GlassCard className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,184,148,0.08)', border: '1px solid rgba(0,184,148,0.20)' }}>
                          <Star className="w-5 h-5 text-[#E8B960]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white/90">Note eintragen</p>
                          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35 mt-0.5">Wie hast du abgeschnitten?</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/20" />
                      </div>
                    </GlassCard>
                  </button>
                )}
              </div>

              {/* Section 3: Deine Vorbereitung in Zahlen */}
              <div className="mb-4">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white/25 uppercase tracking-wider mb-1">Deine Vorbereitung in Zahlen</p>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35 mb-3">Was du für diese Klassenarbeit geleistet hast.</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { value: String(cardsLearned), label: 'Karten im Lernmodus', subtitle: 'Im Karteikarten-Simulator' },
                    { value: String(simulations), label: 'Prüfungssimulationen', subtitle: '' },
                    { value: `${studyHours}h`, label: 'Lernzeit', subtitle: '' },
                  ].map(kpi => (
                    <GlassCard key={kpi.label} className="p-3 text-center">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-[#00D4AA] mb-0.5">{kpi.value}</p>
                      <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/35">{kpi.label}</p>
                      {kpi.subtitle && (
                        <p className="font-['Poppins:Regular',sans-serif] text-[8px] text-white/20 mt-0.5">{kpi.subtitle}</p>
                      )}
                    </GlassCard>
                  ))}
                </div>
              </div>

              {/* Section 4: Themen-Bereitschaft (Top 3 worst first) */}
              {(() => {
                const getAssessment = (r: number) => r >= 75 ? { label: 'Stärke', color: '#00D4AA', bg: 'rgba(0,212,170,0.10)', border: 'rgba(0,212,170,0.25)' }
                  : r >= 40 ? { label: 'Schwachstelle', color: '#FFB84D', bg: 'rgba(255,184,77,0.10)', border: 'rgba(255,184,77,0.25)' }
                  : { label: 'Lücke', color: '#FF6B6B', bg: 'rgba(255,107,107,0.10)', border: 'rgba(255,107,107,0.25)' };
                const sortedTopics = [...topics].sort((a, b) => a.readiness - b.readiness);
                const top3 = sortedTopics.slice(0, 3);
                const barColor = (r: number) => r >= 75 ? '#00D4AA' : r >= 40 ? '#FFB84D' : '#FF6B6B';
                return (
                  <div className="mb-4">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[10px] text-white/25 uppercase tracking-wider mb-1">Themen-Bereitschaft</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35 mb-3">Dein Stand in den klausurrelevanten Themen am Tag der Klassenarbeit.</p>
                    <div className="space-y-2.5">
                      {top3.map(topic => {
                        const assessment = getAssessment(topic.readiness);
                        return (
                          <GlassCard key={topic.name} className="p-3.5">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white/80">{topic.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded-md font-['Poppins:Medium',sans-serif] text-[9px]" style={{ background: assessment.bg, border: `1px solid ${assessment.border}`, color: assessment.color }}>{assessment.label}</span>
                                <span className="font-['Poppins:SemiBold',sans-serif] text-[12px]" style={{ color: barColor(topic.readiness) }}>{topic.readiness}%</span>
                              </div>
                            </div>
                            <div className="relative h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${topic.readiness}%`, background: barColor(topic.readiness), opacity: 0.7 }} />
                            </div>
                          </GlassCard>
                        );
                      })}
                    </div>
                    {topics.length > 3 && (
                      <button
                        onClick={() => { setShowAllTopics(true); setTopicsFilter('all'); }}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-['Poppins:Medium',sans-serif] text-[11px] text-white/35 transition-all active:scale-[0.98] mt-3"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', WebkitTapHighlightColor: 'transparent' }}
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                        Alle {topics.length} Themen anzeigen
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Section 5: KI-Rückblick */}
              <div className="mb-4">
                <GlassCard className="p-4" >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#00D4AA]" />
                    <span className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#00D4AA]">KI-Rückblick</span>
                  </div>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 leading-relaxed">{aiText}</p>
                </GlassCard>
              </div>

              {/* ===== THEMEN ALLE ANZEIGEN OVERLAY ===== */}
              {showAllTopics && (() => {
                const getAssessment = (r: number) => r >= 75 ? { label: 'Stärke', color: '#00D4AA', bg: 'rgba(0,212,170,0.10)', border: 'rgba(0,212,170,0.25)' }
                  : r >= 40 ? { label: 'Schwachstelle', color: '#FFB84D', bg: 'rgba(255,184,77,0.10)', border: 'rgba(255,184,77,0.25)' }
                  : { label: 'Lücke', color: '#FF6B6B', bg: 'rgba(255,107,107,0.10)', border: 'rgba(255,107,107,0.25)' };
                const barColor = (r: number) => r >= 75 ? '#00D4AA' : r >= 40 ? '#FFB84D' : '#FF6B6B';
                const sortedAll = [...topics].sort((a, b) => a.readiness - b.readiness);
                const filtered = topicsFilter === 'all' ? sortedAll
                  : topicsFilter === 'stärke' ? sortedAll.filter(t => t.readiness >= 75)
                  : topicsFilter === 'schwachstelle' ? sortedAll.filter(t => t.readiness >= 40 && t.readiness < 75)
                  : sortedAll.filter(t => t.readiness < 40);
                const filterChips: { key: 'all' | 'stärke' | 'schwachstelle' | 'lücke'; label: string; count: number }[] = [
                  { key: 'all', label: 'Alle', count: sortedAll.length },
                  { key: 'stärke', label: 'Stärke', count: sortedAll.filter(t => t.readiness >= 75).length },
                  { key: 'schwachstelle', label: 'Schwachstelle', count: sortedAll.filter(t => t.readiness >= 40 && t.readiness < 75).length },
                  { key: 'lücke', label: 'Lücke', count: sortedAll.filter(t => t.readiness < 40).length },
                ];
                return ReactDOM.createPortal(
                  <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: '#0a0a0a' }}>
                    <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
                      <button onClick={() => setShowAllTopics(false)} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]" style={{ WebkitTapHighlightColor: 'transparent' }}>
                        <ArrowLeft className="w-5 h-5 text-white/70" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white tracking-[-0.3px]">Themen-Bereitschaft</h1>
                        <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">{cExam.subject} · {topics.length} Themen</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
                      {filterChips.map(chip => {
                        const isActive = topicsFilter === chip.key;
                        return (
                          <button key={chip.key} onClick={() => setTopicsFilter(chip.key)} className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5" style={{ WebkitTapHighlightColor: 'transparent', background: isActive ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isActive ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`, color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.5)' }}>
                            {chip.label}
                            <span className="px-1.5 py-0.5 rounded-full font-['Poppins:Medium',sans-serif] text-[9px]" style={{ background: isActive ? 'rgba(0,184,148,0.15)' : 'rgba(255,255,255,0.06)', color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.35)' }}>{chip.count}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex-1 overflow-y-auto px-5 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
                      {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <CheckCircle className="w-8 h-8 text-[#00D4AA]/30 mb-3" />
                          <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">Keine Themen in dieser Kategorie – gut gemacht!</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filtered.map(topic => {
                            const assessment = getAssessment(topic.readiness);
                            return (
                              <GlassCard key={topic.name} className="p-4">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/25 uppercase tracking-wider">{cExam.subject}</span>
                                  <span className="px-1.5 py-0.5 rounded-md font-['Poppins:Medium',sans-serif] text-[9px]" style={{ background: assessment.bg, border: `1px solid ${assessment.border}`, color: assessment.color }}>{assessment.label}</span>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">{topic.name}</h4>
                                  <span className="font-['Poppins:SemiBold',sans-serif] text-[14px]" style={{ color: barColor(topic.readiness) }}>{topic.readiness}%</span>
                                </div>
                                <div className="relative h-[5px] rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                  <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${topic.readiness}%`, background: barColor(topic.readiness), opacity: 0.7 }} />
                                </div>
                                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35 leading-relaxed">{topic.insight}</p>
                              </GlassCard>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>,
                  document.body
                );
              })()}

            </div>
          </div>
        );
      })()}

      {/* ===== GRADE ENTRY MODAL (Portal) – matches TaskDetailScreen exactly ===== */}
      {gradeModalExam && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" style={{ animation: 'detailFadeIn 0.15s ease-out' }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setGradeModalExam(null)} />
          <div className="relative w-full max-w-[380px] mx-4 mb-4 sm:mb-0 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(20,20,22,0.98), rgba(14,14,16,0.98))', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', animation: 'detailFadeIn 0.2s ease-out' }}>
            <div className="px-5 pt-5 pb-3 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-[#E8B960]" />
                <div>
                  <h3 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Note auswählen</h3>
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35 mt-0.5">{gradeModalExam.subject} · {formatDate(gradeModalExam.date)}</p>
                </div>
              </div>
              <button onClick={() => setGradeModalExam(null)} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]" style={{ WebkitTapHighlightColor: 'transparent' }}>
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>
            <div className="px-5 pb-5">
              {/* Grade Buttons 1-6 – identical to TaskDetailScreen */}
              <div className="grid grid-cols-6 gap-2 mb-3">
                {['1','2','3','4','5','6'].map(g => {
                  const isActive = gradeSelectedGrade === g;
                  const gradeColorsModal: Record<string, { bg: string; border: string; text: string }> = {
                    '1': { bg: 'rgba(74, 222, 128, 0.12)', border: 'rgba(74, 222, 128, 0.25)', text: '#4ADE80' },
                    '2': { bg: 'rgba(96, 200, 120, 0.12)', border: 'rgba(96, 200, 120, 0.25)', text: '#60C878' },
                    '3': { bg: 'rgba(232, 185, 96, 0.12)', border: 'rgba(232, 185, 96, 0.25)', text: '#E8B960' },
                    '4': { bg: 'rgba(245, 158, 66, 0.12)', border: 'rgba(245, 158, 66, 0.25)', text: '#F59E42' },
                    '5': { bg: 'rgba(255, 120, 80, 0.12)', border: 'rgba(255, 120, 80, 0.25)', text: '#FF7850' },
                    '6': { bg: 'rgba(255, 69, 58, 0.12)', border: 'rgba(255, 69, 58, 0.25)', text: '#FF453A' },
                  };
                  const c = gradeColorsModal[g];
                  return (
                    <button key={g} onClick={() => { if (isActive) setGradeSelectedGrade(''); else { setGradeSelectedGrade(g); if (g === '6') setGradeSelectedModifier(''); } }} className="relative flex items-center justify-center h-[44px] rounded-xl transition-all duration-150 active:scale-95" style={{ backgroundColor: isActive ? c.bg : 'rgba(255,255,255,0.04)', border: `1.5px solid ${isActive ? c.border : 'rgba(255,255,255,0.06)'}`, WebkitTapHighlightColor: 'transparent' }}>
                      <span className="font-['Poppins:Bold',sans-serif] text-[16px]" style={{ color: isActive ? c.text : 'rgba(255,255,255,0.35)' }}>{g}</span>
                    </button>
                  );
                })}
              </div>
              {/* Modifier +/Glatt/- – identical to TaskDetailScreen */}
              {gradeSelectedGrade && gradeSelectedGrade !== '6' && (
                <div className="flex items-center gap-2 mb-4" style={{ animation: 'detailFadeIn 0.12s ease-out' }}>
                  <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/30 mr-1">Tendenz:</span>
                  {(['+', '', '-'] as const).map(mod => {
                    const isActive = gradeSelectedModifier === mod;
                    const label = mod === '+' ? `${gradeSelectedGrade}+` : mod === '-' ? `${gradeSelectedGrade}-` : `${gradeSelectedGrade}`;
                    return (
                      <button key={mod || 'none'} onClick={() => setGradeSelectedModifier(mod)} className="flex items-center justify-center px-3.5 py-[6px] rounded-lg transition-all duration-150 active:scale-95" style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`, WebkitTapHighlightColor: 'transparent' }}>
                        <span className={`font-['Poppins:Medium',sans-serif] text-[13px] ${isActive ? 'text-white/80' : 'text-white/30'}`}>{label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {/* Save / Cancel – identical to TaskDetailScreen */}
              <div className="flex items-center gap-2.5">
                <button
                  disabled={!gradeSelectedGrade || gradeSaving}
                  onClick={() => {
                    if (!gradeSelectedGrade || !gradeModalExam) return;
                    setGradeSaving(true);
                    const composed = `${gradeSelectedGrade}${gradeSelectedModifier}`;
                    setTimeout(() => {
                      examGradesStore.setGrade(gradeModalExam.id, composed);
                      setGradeSaving(false);
                      // Store exam info for upload prompt
                      setUploadPromptExam(gradeModalExam);
                      setUploadPromptGrade(composed);
                      setGradeModalExam(null);
                      // Show upload prompt after brief delay
                      setTimeout(() => setShowUploadPrompt(true), 200);
                    }, 300);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-200 active:scale-[0.97] ${gradeSelectedGrade && !gradeSaving ? 'bg-white/[0.06] border border-white/[0.12] cursor-pointer' : 'bg-white/[0.03] border border-white/[0.06] cursor-not-allowed opacity-40'}`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {gradeSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-white">Speichern</span>}
                </button>
                <button onClick={() => { setGradeModalExam(null); setGradeSelectedGrade(''); setGradeSelectedModifier(''); }} className="px-4 py-2 rounded-xl font-['Poppins:Medium',sans-serif] text-[12px] text-white/40 transition-all duration-200 active:bg-white/[0.04]" style={{ WebkitTapHighlightColor: 'transparent' }}>
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ===== KLASSENARBEIT HOCHLADEN POPUP (Portal) – identical to TaskDetailScreen ===== */}
      {showUploadPrompt && uploadPromptExam && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 z-[210] bg-black/50" onClick={() => setShowUploadPrompt(false)} />
          <div
            className="fixed z-[211] inset-x-5 top-1/2 -translate-y-1/2 sm:inset-x-0 sm:mx-auto sm:w-full sm:max-w-[380px]"
            style={{ animation: 'detailFadeIn 0.2s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#141414] border border-white/[0.12] rounded-2xl overflow-hidden p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-[42px] h-[42px] rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(212, 160, 68, 0.12)' }}>
                  <ClipboardList className="w-5 h-5 text-[#E8B960]" />
                </div>
                <div>
                  <h3 className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white">Klassenarbeit hochladen?</h3>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 mt-0.5">{uploadPromptExam.subject} &middot; Note {uploadPromptGrade}</p>
                </div>
              </div>
              <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/50 leading-[1.6] mb-6">
                Lade deine Klassenarbeit jetzt hoch, damit sie analysiert und ausgewertet werden kann.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setShowUploadPrompt(false); if (onRequestUpload && uploadPromptExam) { onRequestUpload(uploadPromptExam.id, uploadPromptExam.subject, uploadPromptGrade); } }}
                  className="flex-1 h-[44px] rounded-xl flex items-center justify-center gap-2 bg-white/[0.08] border border-white/[0.15] transition-all duration-150 active:scale-[0.97] active:bg-white/[0.12]"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">Ja, hochladen</span>
                </button>
                <button
                  onClick={() => setShowUploadPrompt(false)}
                  className="flex-1 h-[44px] rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] transition-all duration-150 active:scale-[0.97] active:bg-white/[0.06]"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/40">Nein, danke</span>
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* ===== ALL GOALS SLIDE-OVER ===== */}
      {activeTab === 'goals' && (() => {
        if (!showAllGoals) return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: 'translateX(100%)',
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        );

        const allSubjects = Array.from(new Set(MOCK_ACTIVE_GOALS.map(g => g.subject)));
        const filteredGoals = goalsSubjectFilter === 'all'
          ? MOCK_ACTIVE_GOALS
          : MOCK_ACTIVE_GOALS.filter(g => g.subject === goalsSubjectFilter);

        const statusConfig = (status: string) => ({
          'on-track': { label: 'Auf Kurs', color: '#00D4AA', bg: 'rgba(0,212,170,0.08)', border: 'rgba(0,212,170,0.15)' },
          'at-risk': { label: 'Gefährdet', color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.15)' },
          'extended': { label: 'Verschoben', color: '#FFB84D', bg: 'rgba(255,184,77,0.08)', border: 'rgba(255,184,77,0.15)' },
        }[status] || { label: status, color: '#888', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' });

        return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: showAllGoals ? 'translateX(0)' : 'translateX(100%)',
              opacity: showAllGoals ? 1 : 0,
              pointerEvents: showAllGoals ? 'auto' : 'none',
              display: 'flex',
              flexDirection: 'column' as const,
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button
                onClick={() => setShowAllGoals(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white tracking-[-0.3px]">Aktive Lernziele</h1>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                  {MOCK_ACTIVE_GOALS.length} Lernziel{MOCK_ACTIVE_GOALS.length !== 1 ? 'e' : ''} · {allSubjects.length} Fächer
                </p>
              </div>
            </div>

            {/* Filter Chips – Fächer */}
            <div className="flex items-center gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
              {(['all', ...allSubjects] as const).map(subj => {
                const isActive = goalsSubjectFilter === subj;
                const count = subj === 'all' ? MOCK_ACTIVE_GOALS.length : MOCK_ACTIVE_GOALS.filter(g => g.subject === subj).length;
                return (
                  <button
                    key={subj}
                    onClick={() => setGoalsSubjectFilter(isActive && subj !== 'all' ? 'all' : subj)}
                    className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      background: isActive ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                      color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {subj === 'all' ? 'Alle' : subj}
                    <span
                      className="px-1.5 py-0.5 rounded-full font-['Poppins:Medium',sans-serif] text-[9px]"
                      style={{
                        background: isActive ? 'rgba(0,184,148,0.15)' : 'rgba(255,255,255,0.06)',
                        color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.35)',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Goals List */}
            <div className="flex-1 overflow-y-auto px-5 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="space-y-3">
                {filteredGoals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Target className="w-8 h-8 text-white/10 mb-3" />
                    <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">Keine Lernziele für dieses Fach</p>
                  </div>
                ) : (
                  filteredGoals.map(goal => {
                    const days = daysUntil(goal.dueDate);
                    const sc = statusConfig(goal.status);
                    const wasExtended = goal.dueDate !== goal.originalDueDate;
                    const masteryRange = goal.masteryTarget - goal.masteryStart;
                    const masteryProgress = masteryRange > 0 ? Math.round(((goal.masteryCurrent - goal.masteryStart) / masteryRange) * 100) : 0;
                    const masteryColor = '#00D4AA';

                    return (
                      <button
                        key={goal.id}
                        onClick={() => { setShowAllGoals(false); setGoalDetailId(goal.id); setShowAllGoalRecs(false); }}
                        className="w-full text-left transition-all duration-150 active:scale-[0.98]"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                      <GlassCard className="p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/25 uppercase tracking-wider">
                            {goal.subject}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full font-['Poppins:SemiBold',sans-serif] text-[10px]"
                            style={{ color: sc.color, background: sc.bg, border: `1px solid ${sc.border}` }}
                          >
                            {sc.label}
                          </span>
                        </div>
                        <h4 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white mb-1">
                          {goal.topic}
                        </h4>
                        <div className="flex items-center gap-2 mb-3">
                          <CalendarDays className="w-3 h-3 text-white/25" />
                          <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                            Ziel: {formatDate(goal.dueDate)}
                            {days > 0 ? ` · noch ${days} Tage` : days === 0 ? ' · Heute' : ` · ${Math.abs(days)} Tage überfällig`}
                          </span>
                          {wasExtended && (
                            <span className="font-['Poppins:Regular',sans-serif] text-[9px] text-[#FFB84D]/50 line-through">
                              {formatDate(goal.originalDueDate)}
                            </span>
                          )}
                        </div>
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-white/50">Fortschritt</span>
                            <span className="font-['Poppins:SemiBold',sans-serif] text-[11px]" style={{ color: masteryColor }}>{goal.masteryCurrent}%</span>
                          </div>
                          <div className="relative h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div
                              className="absolute inset-y-0 left-0 rounded-full"
                              style={{ width: `${Math.min(masteryProgress, 100)}%`, background: masteryColor, transition: 'width 0.6s ease', opacity: 0.8 }}
                            />
                          </div>
                        </div>
                      </GlassCard>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== REACHED GOALS SLIDE-OVER ===== */}
      {activeTab === 'goals' && (() => {
        if (!showAllReachedGoals) return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: 'translateX(100%)',
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        );

        const allReachedSubjects = Array.from(new Set(MOCK_COMPLETED_GOAL_INSIGHTS.map(g => g.subject)));
        const timeFilterOptions = [
          { key: 'all', label: 'Alle' },
          { key: 'month', label: 'Letzter Monat' },
          { key: '3months', label: 'Letzte 3 Monate' },
          { key: 'year', label: 'Dieses Schuljahr' },
        ];

        const mockToday = new Date('2026-03-17');
        const filteredReachedGoals = MOCK_COMPLETED_GOAL_INSIGHTS
          .filter(g => reachedGoalsSubjectFilter === 'all' || g.subject === reachedGoalsSubjectFilter)
          .filter(g => {
            if (reachedGoalsTimeFilter === 'all') return true;
            const cd = new Date(g.completedDate);
            if (reachedGoalsTimeFilter === 'month') {
              const d = new Date(mockToday); d.setMonth(d.getMonth() - 1); return cd >= d;
            }
            if (reachedGoalsTimeFilter === '3months') {
              const d = new Date(mockToday); d.setMonth(d.getMonth() - 3); return cd >= d;
            }
            if (reachedGoalsTimeFilter === 'year') {
              return cd >= new Date('2025-08-01');
            }
            return true;
          })
          .sort((a, b) => new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime());

        const formatCompletedDate = (dateStr: string) => {
          const d = new Date(dateStr + 'T00:00:00');
          return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
        };

        return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: showAllReachedGoals ? 'translateX(0)' : 'translateX(100%)',
              opacity: showAllReachedGoals ? 1 : 0,
              pointerEvents: showAllReachedGoals ? 'auto' : 'none',
              display: 'flex',
              flexDirection: 'column' as const,
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button
                onClick={() => setShowAllReachedGoals(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white tracking-[-0.3px]">Erreichte Ziele ({MOCK_COMPLETED_GOAL_INSIGHTS.length})</h1>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                  {allReachedSubjects.length} Fächer
                </p>
              </div>
            </div>

            {/* Filter Row 1 – Fächer */}
            <div className="flex items-center gap-2 px-5 pb-2 overflow-x-auto scrollbar-hide">
              {(['all', ...allReachedSubjects] as const).map(subj => {
                const isActive = reachedGoalsSubjectFilter === subj;
                const count = subj === 'all' ? MOCK_COMPLETED_GOAL_INSIGHTS.length : MOCK_COMPLETED_GOAL_INSIGHTS.filter(g => g.subject === subj).length;
                return (
                  <button
                    key={subj}
                    onClick={() => setReachedGoalsSubjectFilter(isActive && subj !== 'all' ? 'all' : subj)}
                    className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      background: isActive ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                      color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {subj === 'all' ? 'Alle' : subj}
                    <span
                      className="px-1.5 py-0.5 rounded-full font-['Poppins:Medium',sans-serif] text-[9px]"
                      style={{
                        background: isActive ? 'rgba(0,184,148,0.15)' : 'rgba(255,255,255,0.06)',
                        color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.35)',
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filter Row 2 – Zeitraum */}
            <div className="flex items-center gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
              {timeFilterOptions.map(opt => {
                const isActive = reachedGoalsTimeFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setReachedGoalsTimeFilter(isActive && opt.key !== 'all' ? 'all' : opt.key)}
                    className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] whitespace-nowrap transition-all flex-shrink-0"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      background: isActive ? 'rgba(0,184,148,0.10)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? 'rgba(0,184,148,0.30)' : 'rgba(255,255,255,0.08)'}`,
                      color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-5 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="space-y-3">
                {filteredReachedGoals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Target className="w-8 h-8 text-white/10 mb-3" />
                    <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">Keine erreichten Ziele in diesem Zeitraum.</p>
                  </div>
                ) : (
                  filteredReachedGoals.map(goal => (
                    <GlassCard key={goal.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#00D4AA' }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/80">{goal.topic}</p>
                          <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30 mt-0.5">{goal.subject}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/25">
                              Erreicht am {formatCompletedDate(goal.completedDate)}
                            </span>
                            <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/35">
                              In {goal.actualDays} Tagen erreicht
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== ALL RECOMMENDATIONS SLIDE-OVER ===== */}
      {activeTab === 'goals' && (() => {
        const detailExam = upcomingExams.find(e => e.id === examDetailId);
        if (!detailExam || !showAllRecommendations) return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: 'translateX(100%)',
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        );

        const recSevConfig = {
          critical: { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: '#FF6B6B', bg: 'rgba(255,107,107,0.06)', border: 'rgba(255,107,107,0.12)', label: 'Dringend' },
          warning: { icon: <CircleDot className="w-3.5 h-3.5" />, color: '#FFB84D', bg: 'rgba(255,184,77,0.06)', border: 'rgba(255,184,77,0.12)', label: 'Empfohlen' },
          moderate: { icon: <CheckCircle className="w-3.5 h-3.5" />, color: '#00D4AA', bg: 'rgba(0,212,170,0.06)', border: 'rgba(0,212,170,0.12)', label: 'Förderlich' },
        };

        const recSeverityOrder: Record<string, number> = { critical: 0, warning: 1, moderate: 2 };
        const sortedRecs = [...detailExam.recommendations].sort((a, b) => (recSeverityOrder[a.severity] ?? 9) - (recSeverityOrder[b.severity] ?? 9));

        const filteredRecs = recsSeverityFilter === 'all'
          ? sortedRecs
          : sortedRecs.filter(r => r.severity === recsSeverityFilter);

        const recsFilterConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
          all:      { label: 'Alle',        color: '#00D4AA', bg: 'rgba(0,184,148,0.10)',   border: 'rgba(0,184,148,0.30)' },
          critical: { label: 'Dringend',    color: '#FF6B6B', bg: 'rgba(255,107,107,0.10)', border: 'rgba(255,107,107,0.30)' },
          warning:  { label: 'Empfohlen',   color: '#FFB84D', bg: 'rgba(255,184,77,0.10)',  border: 'rgba(255,184,77,0.30)' },
          moderate: { label: 'Förderlich',  color: '#00D4AA', bg: 'rgba(0,212,170,0.10)',   border: 'rgba(0,212,170,0.30)' },
        };

        return (
          <div
            style={{
              ...prognosisSlideStyle,
              background: '#0a0a0a',
              zIndex: 60,
              transform: showAllRecommendations ? 'translateX(0)' : 'translateX(100%)',
              opacity: showAllRecommendations ? 1 : 0,
              pointerEvents: showAllRecommendations ? 'auto' : 'none',
              display: 'flex',
              flexDirection: 'column' as const,
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-5 pt-4 pb-2 flex items-center gap-3">
              <button
                onClick={() => setShowAllRecommendations(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors active:bg-white/[0.05]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white tracking-[-0.3px]">KI-Empfehlungen</h1>
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/30">
                  {detailExam.subject} · {fmtDate(detailExam.date)} · {detailExam.recommendations.length} Empfehlungen
                </p>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
              {(['all', 'critical', 'warning', 'moderate'] as const).map(sevKey => {
                const isActive = recsSeverityFilter === sevKey;
                const config = recsFilterConfig[sevKey];
                return (
                  <button
                    key={sevKey}
                    onClick={() => setRecsSeverityFilter(isActive && sevKey !== 'all' ? 'all' : sevKey)}
                    className="px-3 py-1.5 rounded-lg font-['Poppins:Medium',sans-serif] text-[11px] whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      background: isActive ? config.bg : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? config.border : 'rgba(255,255,255,0.08)'}`,
                      color: isActive ? config.color : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>

            {/* Recommendations List */}
            <div className="flex-1 overflow-y-auto px-5 pb-6" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="space-y-2">
                {filteredRecs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="w-8 h-8 text-white/10 mb-3" />
                    <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">Keine Einträge vorhanden</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/15 mt-1">
                      {recsSeverityFilter === 'critical' ? 'Keine dringenden Empfehlungen – gut gemacht!'
                        : recsSeverityFilter === 'warning' ? 'Keine empfohlenen Inhalte für diesen Filter.'
                        : recsSeverityFilter === 'moderate' ? 'Keine förderlichen Empfehlungen vorhanden.'
                        : 'Keine Empfehlungen vorhanden.'}
                    </p>
                  </div>
                ) : (
                  filteredRecs.map(rec => {
                    const sevConfig = {
                      critical: { color: '#FF6B6B', label: 'Dringend' },
                      warning: { color: '#FFB84D', label: 'Empfohlen' },
                      moderate: { color: '#00D4AA', label: 'Förderlich' },
                    }[rec.severity];
                    const recSevLabelMap: Record<string, string> = { critical: 'Dringend', warning: 'Empfohlen', moderate: 'Förderlich' };
                    return (
                      <StandardCard
                        key={rec.id}
                        subject={rec.subject}
                        topic={rec.topic}
                        detail={rec.reason}
                        score={getTopicScore(rec.topic, `${rec.severity}-rec`)}
                        severityColor={sevConfig.color}
                        severityLabel={sevConfig.label}
                        severity={rec.severity}
                        source="recommendation"
                        showFlashcards={rec.actions.includes('flashcards')}
                        showExam={rec.actions.includes('exam-simulation')}
                        onGenerate={(ctx) => { const recLabel = ({ critical: 'Dringend', warning: 'Empfohlen', moderate: 'Förderlich' } as Record<string, string>)[rec.severity] || 'Förderlich'; onGenerateForWeakness?.({ ...(ctx || { topic: rec.topic, subject: rec.subject, severity: rec.severity, recommendation: rec.reason, source: 'recommendation' }), contextLabel: 'Klassenarbeit-Vorbereitung', severityLabel: recLabel, notificationLabel: 'KI-Empfehlung' }); }}
                        onStartExam={(ctx) => { const recLabel = ({ critical: 'Dringend', warning: 'Empfohlen', moderate: 'Förderlich' } as Record<string, string>)[rec.severity] || 'Förderlich'; onStartExamSimulation?.({ ...(ctx || { topic: rec.topic, subject: rec.subject, severity: rec.severity, recommendation: rec.reason, source: 'recommendation' }), contextLabel: 'Klassenarbeit-Vorbereitung', severityLabel: recLabel, notificationLabel: 'KI-Empfehlung' }); }}
                        onOpenLinkedFlashcardSet={onOpenLinkedFlashcardSet}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );

  // ===== PRACTICE POPUP (Portal) =====
  const practicePopupPortal = practicePopup ? ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center"
      onClick={() => setPracticePopup(null)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Bottom Sheet */}
      <div
        className="relative w-full max-w-[420px] mx-auto rounded-t-2xl overflow-hidden"
        style={{
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
          paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)',
          animation: 'practicePopupSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Indicator */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-[4px] rounded-full bg-white/15" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-4">
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white tracking-[-0.3px]">
            {practicePopup.topic} üben
          </h3>
          <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 mt-0.5">
            {practicePopup.subject} • Wähle eine Übungsmethode
          </p>
        </div>

        {/* Options */}
        <div className="px-5 space-y-2.5 pb-2">
          {/* Karteikarten erstellen */}
          <button
            onClick={() => {
              // Check if this topic is a recognized weakness, risk, or knowledge gap
              const isWeakness = MOCK_WEAKNESSES.some(w => w.topic === practicePopup.topic && w.subject === practicePopup.subject);
              const isRisk = MOCK_RISKS.some(r => r.topic === practicePopup.topic && r.subject === practicePopup.subject);
              const isKnowledgeGap = MOCK_KNOWLEDGE_GAPS_SELF.some(g => g.title === practicePopup.topic && g.subject === practicePopup.subject);
              const source: 'weakness' | 'risk' | 'knowledge-gap' | 'practice' = isWeakness ? 'weakness' : isRisk ? 'risk' : isKnowledgeGap ? 'knowledge-gap' : 'practice';
              const matchedWeakness = MOCK_WEAKNESSES.find(w => w.topic === practicePopup.topic && w.subject === practicePopup.subject);
              const matchedRisk = MOCK_RISKS.find(r => r.topic === practicePopup.topic && r.subject === practicePopup.subject);
              const severity = matchedWeakness?.severity || matchedRisk?.riskLevel || 'moderate';
              const recommendation = matchedWeakness?.recommendation || matchedRisk?.reason || `${practicePopup.topic} üben und vertiefen`;
              const context = { topic: practicePopup.topic, subject: practicePopup.subject, severity, recommendation, source };
              setPracticePopup(null);
              onGenerateForWeakness?.(context);
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-150 active:scale-[0.98]"
            style={{
              background: 'rgba(74,158,255,0.07)',
              border: '1px solid rgba(74,158,255,0.2)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(74,158,255,0.12)' }}
            >
              <Layers className="w-5 h-5" style={{ color: '#4A9EFF' }} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">
                Karteikarten erstellen
              </p>
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 mt-0.5">
                KI generiert Lernkarten zu diesem Thema
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
          </button>

          {/* Prüfungssimulation starten */}
          <button
            onClick={() => {
              const isWeakness = MOCK_WEAKNESSES.some(w => w.topic === practicePopup.topic && w.subject === practicePopup.subject);
              const isRisk = MOCK_RISKS.some(r => r.topic === practicePopup.topic && r.subject === practicePopup.subject);
              const isKnowledgeGap = MOCK_KNOWLEDGE_GAPS_SELF.some(g => g.title === practicePopup.topic && g.subject === practicePopup.subject);
              const source: 'weakness' | 'risk' | 'knowledge-gap' | 'practice' = isWeakness ? 'weakness' : isRisk ? 'risk' : isKnowledgeGap ? 'knowledge-gap' : 'practice';
              const matchedWeakness = MOCK_WEAKNESSES.find(w => w.topic === practicePopup.topic && w.subject === practicePopup.subject);
              const matchedRisk = MOCK_RISKS.find(r => r.topic === practicePopup.topic && r.subject === practicePopup.subject);
              const severity = matchedWeakness?.severity || matchedRisk?.riskLevel || 'moderate';
              const recommendation = matchedWeakness?.recommendation || matchedRisk?.reason || `${practicePopup.topic} üben und vertiefen`;
              const context = { topic: practicePopup.topic, subject: practicePopup.subject, severity, recommendation, source };
              setPracticePopup(null);
              onStartExamSimulation?.(context);
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-150 active:scale-[0.98]"
            style={{
              background: 'rgba(255,140,0,0.07)',
              border: '1px solid rgba(255,140,0,0.2)',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,140,0,0.12)' }}
            >
              <ClipboardCheck className="w-5 h-5" style={{ color: '#FF8C00' }} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white">
                Prüfungssimulation starten
              </p>
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/40 mt-0.5">
                Teste dein Wissen unter Prüfungsbedingungen
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
          </button>
        </div>

        {/* Cancel */}
        <div className="px-5 pt-2">
          <button
            onClick={() => setPracticePopup(null)}
            className="w-full py-3 rounded-xl font-['Poppins:Medium',sans-serif] text-[14px] text-white/50 active:bg-white/[0.04] transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes practicePopupSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes detailFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

      `}</style>
    </div>,
    document.body
  ) : null;

  // ===== DATE PICKER (via PremiumCalendarPicker) =====
  const datePickerPortal = (
    <PremiumCalendarPicker
      mode="range"
      isOpen={showDatePicker}
      onClose={() => setShowDatePicker(false)}
      from={customDateFrom}
      to={customDateTo}
      maxDate="2026-03-15"
      onApply={(from, to) => {
        setCustomDateFrom(from);
        setCustomDateTo(to);
        setPerfTimeRange('custom');
        setCustomRangeApplied(true);
      }}
      presets={[
        { label: 'Letzte 7 Tage', from: '2026-03-09', to: '2026-03-15' },
        { label: 'Letzte 30 Tage', from: '2026-02-13', to: '2026-03-15' },
        { label: 'Letzte 3 Monate', from: '2025-12-15', to: '2026-03-15' },
        { label: 'Dieses Jahr', from: '2026-01-01', to: '2026-03-15' },
      ]}
    />
  );

  // When wrapped by MobileRouteTransition, render content directly (no absolute positioning, no own z-index)
  if (externalTransition) {
    return (
      <>
        <div className="flex-1 min-h-0 w-full bg-[#0a0a0a] overflow-hidden"
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'none' }}>
          {content}
        </div>
        {practicePopupPortal}
        {datePickerPortal}
        <LernanalyseTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      </>
    );
  }

  // Legacy standalone rendering (absolute positioning with z-index)
  return (
    <>
      <div className="absolute inset-0 z-[60] bg-[#0a0a0a]">
        {content}
      </div>
      {practicePopupPortal}
      {datePickerPortal}
      <LernanalyseTutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </>
  );
});