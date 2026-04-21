// ===== MEETINGS SCREEN =====
// Full Meetings section: Upcoming, Live/Join, Past tabs
// MeetingCards, Detail View, Lobby, Room
// Premium SaaS Style (Linear/Vercel) – #0a0a0a, Glassmorphism, Poppins
// Responsive: Desktop + Mobile

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ArrowLeft, Video, VideoOff, Mic, MicOff, Monitor, Hand,
  Phone, PhoneOff, Settings, Users, MessageSquare, FileText,
  Search, Filter, Calendar, Clock, ChevronDown, ChevronRight,
  X, Check, AlertCircle, Wifi, WifiOff, Volume2,
  User, UserPlus, Star, BookOpen, MoreVertical, Copy,
  Play, Square, Camera, CameraOff, RefreshCw, Zap
} from 'lucide-react';
import { useMeetingRatings } from '@/hooks/useMeetingRatings';
import { MeetingRatingModal, RatingBadge } from './MeetingRatingModal';
import { useUser } from '@/contexts/UserContext';

// ===== TYPES =====
interface Meeting {
  id: string;
  subjectName: string;
  lessonType: '1on1' | 'group';
  tutor: { id: string; name: string; avatarUrl?: string };
  students: { id: string; name: string; avatarUrl?: string }[];
  topicTitle?: string;
  startAt: string;
  endAt: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  joinPolicy: { joinEarlyMinutes: number; requiresTutorStart: boolean };
  room: { roomId: string; roomKey?: string };
  liveState?: { isTutorPresent: boolean; participantsOnline: number; startedAt?: string; endedAt?: string };
}

type UIStatus = 'live' | 'upcoming' | 'joinable' | 'waiting' | 'past' | 'cancelled';
type MeetingTab = 'upcoming' | 'live' | 'past';
type ViewState = 'list' | 'detail' | 'lobby' | 'room';

interface MeetingsScreenProps {
  onClose?: () => void;
  isMobile?: boolean;
  externalTransition?: boolean;
  onOpenTutoringActivation?: () => void;
}

// ===== HELPERS =====
const poppins = (weight: string) => `font-['Poppins:${weight}',sans-serif]`;

function getUIStatus(meeting: Meeting): UIStatus {
  const now = new Date();
  const start = new Date(meeting.startAt);
  const end = new Date(meeting.endAt);

  if (meeting.status === 'cancelled') return 'cancelled';
  if (meeting.status === 'ended' || end < now) return 'past';
  if (meeting.status === 'live' || meeting.liveState?.startedAt) return 'live';

  if (meeting.status === 'scheduled' && start > now) {
    const earlyJoinTime = new Date(start.getTime() - meeting.joinPolicy.joinEarlyMinutes * 60000);
    if (now >= earlyJoinTime) {
      if (meeting.joinPolicy.requiresTutorStart && !meeting.liveState?.isTutorPresent) {
        return 'waiting';
      }
      return 'joinable';
    }
    return 'upcoming';
  }

  return 'upcoming';
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTime(startIso)}–${formatTime(endIso)}`;
}

function getCountdown(iso: string): string {
  const now = new Date();
  const target = new Date(iso);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return 'Jetzt';
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `in ${days}d ${hours % 24}h`;
  }
  if (hours > 0) return `in ${hours}h ${mins}m`;
  return `in ${mins}m`;
}

function getDuration(startIso: string, endIso: string): string {
  const diff = new Date(endIso).getTime() - new Date(startIso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  return `${mins} Min`;
}

// ===== MOCK DATA =====
const MOCK_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    subjectName: 'Mathematik',
    lessonType: '1on1',
    tutor: { id: 't1', name: 'Dr. Sarah Weber' },
    students: [{ id: 's1', name: 'Max Mustermann' }],
    topicTitle: 'Quadratische Gleichungen',
    startAt: '2026-03-04T16:00:00+01:00',
    endAt: '2026-03-04T17:00:00+01:00',
    status: 'live',
    joinPolicy: { joinEarlyMinutes: 10, requiresTutorStart: true },
    room: { roomId: 'room-abc123' },
    liveState: { isTutorPresent: true, participantsOnline: 2, startedAt: '2026-03-04T16:00:00+01:00' },
  },
  {
    id: 'm2',
    subjectName: 'Englisch',
    lessonType: 'group',
    tutor: { id: 't2', name: 'Emily Johnson' },
    students: [
      { id: 's1', name: 'Max Mustermann' },
      { id: 's2', name: 'Anna Schmidt' },
      { id: 's3', name: 'Lukas Bauer' },
      { id: 's4', name: 'Sophie Müller' },
    ],
    topicTitle: 'Conditional Sentences II & III',
    startAt: '2026-03-04T18:00:00+01:00',
    endAt: '2026-03-04T19:30:00+01:00',
    status: 'scheduled',
    joinPolicy: { joinEarlyMinutes: 10, requiresTutorStart: true },
    room: { roomId: 'room-def456' },
  },
  {
    id: 'm3',
    subjectName: 'Physik',
    lessonType: '1on1',
    tutor: { id: 't3', name: 'Prof. Hans Müller' },
    students: [{ id: 's1', name: 'Max Mustermann' }],
    topicTitle: 'Newtonsche Mechanik',
    startAt: '2026-03-05T15:00:00+01:00',
    endAt: '2026-03-05T16:00:00+01:00',
    status: 'scheduled',
    joinPolicy: { joinEarlyMinutes: 10, requiresTutorStart: true },
    room: { roomId: 'room-ghi789' },
  },
  {
    id: 'm4',
    subjectName: 'Deutsch',
    lessonType: '1on1',
    tutor: { id: 't4', name: 'Lisa Hofmann' },
    students: [{ id: 's1', name: 'Max Mustermann' }],
    topicTitle: 'Gedichtanalyse: Romantik',
    startAt: '2026-03-06T14:00:00+01:00',
    endAt: '2026-03-06T15:00:00+01:00',
    status: 'scheduled',
    joinPolicy: { joinEarlyMinutes: 10, requiresTutorStart: false },
    room: { roomId: 'room-jkl012' },
  },
  {
    id: 'm5',
    subjectName: 'Biologie',
    lessonType: 'group',
    tutor: { id: 't5', name: 'Dr. Maria Klein' },
    students: [
      { id: 's1', name: 'Max Mustermann' },
      { id: 's2', name: 'Anna Schmidt' },
      { id: 's5', name: 'Leon Fischer' },
    ],
    topicTitle: 'Genetik: Mendelsche Regeln',
    startAt: '2026-03-07T10:00:00+01:00',
    endAt: '2026-03-07T11:30:00+01:00',
    status: 'scheduled',
    joinPolicy: { joinEarlyMinutes: 15, requiresTutorStart: true },
    room: { roomId: 'room-mno345' },
  },
  // Past meetings
  {
    id: 'm6',
    subjectName: 'Mathematik',
    lessonType: '1on1',
    tutor: { id: 't1', name: 'Dr. Sarah Weber' },
    students: [{ id: 's1', name: 'Max Mustermann' }],
    topicTitle: 'Lineare Gleichungssysteme',
    startAt: '2026-03-01T16:00:00+01:00',
    endAt: '2026-03-01T17:00:00+01:00',
    status: 'ended',
    joinPolicy: { joinEarlyMinutes: 10, requiresTutorStart: true },
    room: { roomId: 'room-pqr678' },
    liveState: { isTutorPresent: false, participantsOnline: 0, startedAt: '2026-03-01T16:00:00+01:00', endedAt: '2026-03-01T17:02:00+01:00' },
  },
  {
    id: 'm7',
    subjectName: 'Französisch',
    lessonType: '1on1',
    tutor: { id: 't6', name: 'Marie Dupont' },
    students: [{ id: 's1', name: 'Max Mustermann' }],
    topicTitle: 'Passé Composé Übungen',
    startAt: '2026-02-28T14:00:00+01:00',
    endAt: '2026-02-28T15:00:00+01:00',
    status: 'ended',
    joinPolicy: { joinEarlyMinutes: 10, requiresTutorStart: true },
    room: { roomId: 'room-stu901' },
    liveState: { isTutorPresent: false, participantsOnline: 0, startedAt: '2026-02-28T14:00:00+01:00', endedAt: '2026-02-28T14:58:00+01:00' },
  },
  {
    id: 'm8',
    subjectName: 'Englisch',
    lessonType: 'group',
    tutor: { id: 't2', name: 'Emily Johnson' },
    students: [
      { id: 's1', name: 'Max Mustermann' },
      { id: 's2', name: 'Anna Schmidt' },
    ],
    topicTitle: 'Reading Comprehension B2',
    startAt: '2026-02-26T18:00:00+01:00',
    endAt: '2026-02-26T19:00:00+01:00',
    status: 'ended',
    joinPolicy: { joinEarlyMinutes: 10, requiresTutorStart: true },
    room: { roomId: 'room-vwx234' },
    liveState: { isTutorPresent: false, participantsOnline: 0, startedAt: '2026-02-26T18:01:00+01:00', endedAt: '2026-02-26T19:00:00+01:00' },
  },
  {
    id: 'm9',
    subjectName: 'Chemie',
    lessonType: '1on1',
    tutor: { id: 't7', name: 'Dr. Thomas Braun' },
    students: [{ id: 's1', name: 'Max Mustermann' }],
    topicTitle: 'Stöchiometrie',
    startAt: '2026-02-25T15:00:00+01:00',
    endAt: '2026-02-25T16:00:00+01:00',
    status: 'cancelled',
    joinPolicy: { joinEarlyMinutes: 10, requiresTutorStart: true },
    room: { roomId: 'room-yza567' },
  },
];

const SUBJECTS = ['Alle', 'Mathematik', 'Englisch', 'Deutsch', 'Physik', 'Biologie', 'Französisch', 'Chemie'];

// ===== SUB-COMPONENTS =====

const StatusBadge = ({ status }: { status: UIStatus }) => {
  const config: Record<UIStatus, { label: string; color: string; bg: string; pulse?: boolean }> = {
    live: { label: 'LIVE', color: '#FF4444', bg: 'rgba(255,68,68,0.15)', pulse: true },
    joinable: { label: 'Beitreten', color: '#00D4AA', bg: 'rgba(0,212,170,0.15)' },
    waiting: { label: 'Warteraum', color: '#FFB800', bg: 'rgba(255,184,0,0.15)' },
    upcoming: { label: 'Geplant', color: '#7B61FF', bg: 'rgba(123,97,255,0.15)' },
    past: { label: 'Beendet', color: '#8E8E93', bg: 'rgba(142,142,147,0.15)' },
    cancelled: { label: 'Abgesagt', color: '#FF4444', bg: 'rgba(255,68,68,0.10)' },
  };
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${poppins('SemiBold')} text-[10px] uppercase tracking-wider`}
      style={{ color: c.color, backgroundColor: c.bg, border: `1px solid ${c.color}25` }}
    >
      {c.pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: c.color }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: c.color }} />
        </span>
      )}
      {c.label}
    </span>
  );
};

const TypeBadge = ({ type }: { type: '1on1' | 'group' }) => (
  <span
    className={`px-2 py-0.5 rounded-md ${poppins('Medium')} text-[10px] text-white/50 bg-white/[0.04] border border-white/[0.06]`}
  >
    {type === '1on1' ? 'Einzel' : 'Gruppe'}
  </span>
);

const Avatar = ({ name, size = 36 }: { name: string; size?: number }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const colors = ['#7B61FF', '#00D4AA', '#FF8C00', '#FF4444', '#FFB800', '#00B4D8'];
  const color = colors[name.length % colors.length];
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: `${color}20`, border: `1px solid ${color}30` }}
    >
      <span className={`${poppins('SemiBold')} text-white/80`} style={{ fontSize: size * 0.35 }}>
        {initials}
      </span>
    </div>
  );
};

const GlassCard = ({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] ${onClick ? 'cursor-pointer active:bg-white/[0.04] transition-colors' : ''} ${className}`}
    style={onClick ? { WebkitTapHighlightColor: 'transparent' } : undefined}
  >
    {children}
  </div>
);

const EmptyState = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
  <div className="flex flex-col items-center justify-center py-16 opacity-60">
    <div className="mb-4 text-white/20">{icon}</div>
    <p className={`${poppins('SemiBold')} text-[15px] text-white/50 mb-1`}>{title}</p>
    <p className={`${poppins('Regular')} text-[12px] text-white/30 text-center max-w-[260px]`}>{subtitle}</p>
  </div>
);

const SkeletonCard = () => (
  <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-4 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-white/[0.06]" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-white/[0.06] rounded w-3/4" />
        <div className="h-2.5 bg-white/[0.04] rounded w-1/2" />
      </div>
      <div className="h-6 w-16 bg-white/[0.04] rounded-full" />
    </div>
    <div className="h-2.5 bg-white/[0.04] rounded w-full mb-2" />
    <div className="h-2.5 bg-white/[0.04] rounded w-2/3" />
  </div>
);

// ===== MEETING CARD =====
const MeetingCard = ({ meeting, onClick, hasRating, onRate }: { meeting: Meeting; onClick: () => void; hasRating?: boolean; onRate?: () => void }) => {
  const uiStatus = getUIStatus(meeting);

  return (
    <GlassCard className="p-4" onClick={onClick}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar name={meeting.tutor.name} size={40} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h4 className={`${poppins('SemiBold')} text-[14px] text-white truncate`}>
                {meeting.subjectName}
              </h4>
              <StatusBadge status={uiStatus} />
            </div>
            {meeting.topicTitle && uiStatus !== 'past' && (
              <p className={`${poppins('Regular')} text-[12px] text-white/50 truncate`}>{meeting.topicTitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Info Row */}
      <div className="flex items-center gap-3 flex-wrap mb-3">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-white/30" />
          <span className={`${poppins('Regular')} text-[11px] text-white/40`}>{formatDateTime(meeting.startAt)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-white/30" />
          <span className={`${poppins('Regular')} text-[11px] text-white/40`}>{formatTimeRange(meeting.startAt, meeting.endAt)}</span>
        </div>
        <TypeBadge type={meeting.lessonType} />
        {meeting.lessonType === 'group' && (
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-white/30" />
            <span className={`${poppins('Regular')} text-[11px] text-white/40`}>{meeting.students.length} Teilnehmer</span>
          </div>
        )}
      </div>

      {/* Tutor + Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`${poppins('Regular')} text-[11px] text-white/30`}>Tutor:</span>
          <span className={`${poppins('Medium')} text-[12px] text-white/60`}>{meeting.tutor.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {uiStatus === 'live' && (
            <button className={`px-3 py-1.5 rounded-lg ${poppins('Medium')} text-[12px] text-white bg-[#FF4444]/80 active:bg-[#FF4444] transition-colors`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
              onClick={(e) => { e.stopPropagation(); }}
            >
              Jetzt beitreten
            </button>
          )}
          {uiStatus === 'joinable' && (
            <button className={`px-3 py-1.5 rounded-lg ${poppins('Medium')} text-[12px] text-white transition-colors`}
              style={{ background: 'rgba(0,184,148,0.07)', border: '1px solid rgba(0,184,148,0.25)', WebkitTapHighlightColor: 'transparent' }}
              onClick={(e) => { e.stopPropagation(); }}
            >
              Beitreten
            </button>
          )}
          {uiStatus === 'waiting' && (
            <button className={`px-3 py-1.5 rounded-lg ${poppins('Medium')} text-[12px] text-[#FFB800]/70 bg-[#FFB800]/10 border border-[#FFB800]/20`}
              disabled
            >
              Warte auf Tutor…
            </button>
          )}
          {uiStatus === 'upcoming' && (
            <span className={`${poppins('Medium')} text-[12px] text-[#7B61FF]/70`}>
              {getCountdown(meeting.startAt)}
            </span>
          )}
          {uiStatus === 'past' && !hasRating && onRate && (
            <button
              onClick={(e) => { e.stopPropagation(); onRate(); }}
              className={`px-2.5 py-1 rounded-lg ${poppins('Medium')} text-[11px] transition-all active:scale-95`}
              style={{
                color: 'rgba(123,97,255,0.8)',
                background: 'rgba(123,97,255,0.08)',
                border: '1px solid rgba(123,97,255,0.15)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Bewerten
            </button>
          )}
          {uiStatus === 'past' && hasRating && (
            <span className={`${poppins('Medium')} text-[11px] text-white/25`}>
              Bewertet
            </span>
          )}
          {uiStatus === 'past' && (
            <span className={`${poppins('Medium')} text-[12px] text-white/30`}>
              {getDuration(meeting.startAt, meeting.endAt)}
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-white/20" />
        </div>
      </div>
    </GlassCard>
  );
};

// ===== MEETING DETAIL VIEW =====
const MeetingDetailView = ({ meeting, onBack, onJoinLobby, ratingValue, onRate }: { meeting: Meeting; onBack: () => void; onJoinLobby: () => void; ratingValue?: 1 | 2 | 3 | 4; onRate?: () => void }) => {
  const uiStatus = getUIStatus(meeting);
  const [countdown, setCountdown] = useState(getCountdown(meeting.startAt));

  useEffect(() => {
    if (uiStatus !== 'upcoming' && uiStatus !== 'joinable' && uiStatus !== 'waiting') return;
    const interval = setInterval(() => setCountdown(getCountdown(meeting.startAt)), 10000);
    return () => clearInterval(interval);
  }, [meeting.startAt, uiStatus]);

  return (
    <div className="space-y-4">
      {/* Back + Title */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.05] active:bg-white/[0.08] transition-colors flex-shrink-0"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className={`${poppins('SemiBold')} text-[18px] text-white`}>{meeting.subjectName}</h2>
            <StatusBadge status={uiStatus} />
          </div>
          {meeting.topicTitle && uiStatus !== 'past' && (
            <p className={`${poppins('Regular')} text-[13px] text-white/50 mt-0.5`}>{meeting.topicTitle}</p>
          )}
        </div>
      </div>

      {/* Time Block */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className={`${poppins('Regular')} text-[11px] text-white/30 uppercase tracking-wide mb-1`}>Datum & Zeit</p>
            <p className={`${poppins('SemiBold')} text-[16px] text-white`}>{formatDateTime(meeting.startAt)}</p>
            <p className={`${poppins('Medium')} text-[14px] text-white/60 mt-0.5`}>{formatTimeRange(meeting.startAt, meeting.endAt)}</p>
            <p className={`${poppins('Regular')} text-[11px] text-white/30 mt-1`}>Europe/Berlin · {getDuration(meeting.startAt, meeting.endAt)}</p>
          </div>
          {(uiStatus === 'upcoming' || uiStatus === 'joinable' || uiStatus === 'waiting') && (
            <div className="text-right">
              <p className={`${poppins('Regular')} text-[10px] text-white/30 uppercase tracking-wide mb-1`}>Startet</p>
              <p className={`${poppins('SemiBold')} text-[20px] text-[#7B61FF]`}>{countdown}</p>
            </div>
          )}
        </div>
        {uiStatus === 'past' && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
            <Check className="w-4 h-4 text-[#00D4AA]" />
            <span className={`${poppins('Medium')} text-[12px] text-white/50`}>
              Meeting beendet · Dauer: {getDuration(meeting.startAt, meeting.endAt)}
            </span>
          </div>
        )}
      </GlassCard>

      {/* Tutor Block */}
      <GlassCard className="p-4">
        <p className={`${poppins('Medium')} text-[11px] text-white/30 uppercase tracking-wide mb-3`}>Tutor</p>
        <div className="flex items-center gap-3">
          <Avatar name={meeting.tutor.name} size={44} />
          <div className="flex-1">
            <p className={`${poppins('SemiBold')} text-[14px] text-white`}>{meeting.tutor.name}</p>
            <p className={`${poppins('Regular')} text-[12px] text-white/40`}>{meeting.subjectName}</p>
          </div>
          {uiStatus === 'live' && meeting.liveState?.isTutorPresent && (
            <span className={`px-2 py-0.5 rounded-full ${poppins('Medium')} text-[10px] text-[#00D4AA] bg-[#00D4AA]/10 border border-[#00D4AA]/20`}>
              Online
            </span>
          )}
        </div>
      </GlassCard>

      {/* Students Block (Group) */}
      {meeting.lessonType === 'group' && (
        <GlassCard className="p-4">
          <p className={`${poppins('Medium')} text-[11px] text-white/30 uppercase tracking-wide mb-3`}>
            Teilnehmer ({meeting.students.length})
          </p>
          <div className="space-y-2">
            {meeting.students.map(s => (
              <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <Avatar name={s.name} size={32} />
                <span className={`${poppins('Medium')} text-[13px] text-white/70`}>{s.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Room Info */}
      <GlassCard className="p-4">
        <p className={`${poppins('Medium')} text-[11px] text-white/30 uppercase tracking-wide mb-3`}>Meeting-Info</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className={`${poppins('Regular')} text-[12px] text-white/40`}>Typ</span>
            <TypeBadge type={meeting.lessonType} />
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className={`${poppins('Regular')} text-[12px] text-white/40`}>Room ID</span>
            <div className="flex items-center gap-2">
              <span className={`${poppins('Medium')} text-[12px] text-white/60`}>{meeting.room.roomId}</span>
              <button className="p-1 rounded-md active:bg-white/[0.05]" style={{ WebkitTapHighlightColor: 'transparent' }}>
                <Copy className="w-3.5 h-3.5 text-white/30" />
              </button>
            </div>
          </div>
          {meeting.joinPolicy.requiresTutorStart && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFB800]/5 border border-[#FFB800]/10">
              <AlertCircle className="w-3.5 h-3.5 text-[#FFB800]/60 flex-shrink-0" />
              <span className={`${poppins('Regular')} text-[11px] text-[#FFB800]/60`}>
                Tutor muss das Meeting starten
              </span>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Past Meeting Summary */}
      {uiStatus === 'past' && (
        <GlassCard className="p-4">
          <p className={`${poppins('Medium')} text-[11px] text-white/30 uppercase tracking-wide mb-3`}>Zusammenfassung</p>
          <div className="space-y-3">
            <div>
              <p className={`${poppins('Medium')} text-[12px] text-white/50 mb-1`}>Behandelte Themen</p>
              <p className={`${poppins('Regular')} text-[12px] text-white/40 italic`}>Noch keine Zusammenfassung verfügbar</p>
            </div>
            <div>
              <p className={`${poppins('Medium')} text-[12px] text-white/50 mb-1`}>Hausaufgaben</p>
              <p className={`${poppins('Regular')} text-[12px] text-white/40 italic`}>Keine Hausaufgaben zugewiesen</p>
            </div>
            <div>
              <p className={`${poppins('Medium')} text-[12px] text-white/50 mb-1`}>Tutor-Feedback</p>
              <p className={`${poppins('Regular')} text-[12px] text-white/40 italic`}>Kein Feedback vorhanden</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Rating Section */}
      {uiStatus === 'past' && (
        <GlassCard className="p-4">
          <p className={`${poppins('Medium')} text-[11px] text-white/30 uppercase tracking-wide mb-3`}>Deine Bewertung</p>
          {ratingValue ? (
            <div className="flex items-center gap-3">
              <RatingBadge rating={ratingValue} />
              <span className={`${poppins('Regular')} text-[12px] text-white/30`}>Danke für dein Feedback!</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className={`${poppins('Regular')} text-[12px] text-white/40 italic`}>Noch nicht bewertet</p>
              {onRate && (
                <button
                  onClick={onRate}
                  className={`px-3.5 py-2 rounded-xl ${poppins('SemiBold')} text-[12px] transition-all active:scale-[0.97]`}
                  style={{
                    color: 'rgba(123,97,255,0.9)',
                    background: 'rgba(123,97,255,0.08)',
                    border: '1px solid rgba(123,97,255,0.15)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  Jetzt bewerten
                </button>
              )}
            </div>
          )}
        </GlassCard>
      )}

      {/* Materials Placeholder */}
      <GlassCard className="p-4">
        <p className={`${poppins('Medium')} text-[11px] text-white/30 uppercase tracking-wide mb-3`}>Materialien</p>
        <div className="flex items-center justify-center py-6 opacity-40">
          <div className="text-center">
            <FileText className="w-6 h-6 text-white/20 mx-auto mb-2" />
            <p className={`${poppins('Regular')} text-[12px] text-white/30`}>Keine Materialien vorhanden</p>
          </div>
        </div>
      </GlassCard>

      {/* Action Buttons */}
      <div className="flex gap-3 pb-4">
        {(uiStatus === 'live' || uiStatus === 'joinable') && (
          <button
            onClick={onJoinLobby}
            className={`flex-1 py-3 rounded-xl ${poppins('SemiBold')} text-[14px] text-white transition-colors active:scale-[0.98]`}
            style={{ background: 'rgba(0,184,148,0.07)', border: '1px solid rgba(0,184,148,0.25)', WebkitTapHighlightColor: 'transparent' }}
          >
            Zum Warteraum
          </button>
        )}
        {uiStatus === 'waiting' && (
          <button
            className={`flex-1 py-3 rounded-xl ${poppins('SemiBold')} text-[14px] text-[#FFB800]/60 bg-[#FFB800]/10 border border-[#FFB800]/20`}
            disabled
          >
            Warte auf Tutor…
          </button>
        )}
        {uiStatus === 'cancelled' && (
          <button className={`flex-1 py-3 rounded-xl ${poppins('SemiBold')} text-[14px] text-white/30 bg-white/[0.03] border border-white/[0.05]`} disabled>
            Meeting abgesagt
          </button>
        )}
      </div>
    </div>
  );
};

// ===== MEETING LOBBY =====
const MeetingLobby = ({ meeting, onBack, onJoin }: { meeting: Meeting; onBack: () => void; onJoin: () => void }) => {
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const uiStatus = getUIStatus(meeting);
  const canJoin = uiStatus === 'live' || uiStatus === 'joinable' || (uiStatus === 'waiting' && !meeting.joinPolicy.requiresTutorStart);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.05] active:bg-white/[0.08] transition-colors"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h2 className={`${poppins('SemiBold')} text-[17px] text-white flex-1`}>Warteraum</h2>
        <StatusBadge status={uiStatus} />
      </div>

      {/* Camera Preview */}
      <div className="flex-1 min-h-0 px-4 flex flex-col">
        <div className="relative flex-1 min-h-[200px] max-h-[400px] rounded-2xl bg-[#1a1a1a] border border-white/[0.08] overflow-hidden flex items-center justify-center mb-4">
          {cameraOn ? (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a1a] flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className={`${poppins('Regular')} text-[13px] text-white/30`}>Kamera-Vorschau</p>
                <p className={`${poppins('Regular')} text-[11px] text-white/20 mt-1`}>(Simulation)</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <CameraOff className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className={`${poppins('Regular')} text-[13px] text-white/30`}>Kamera ist aus</p>
            </div>
          )}
          {/* Name overlay */}
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
            <span className={`${poppins('Medium')} text-[12px] text-white`}>Max Mustermann</span>
          </div>
          {/* Connection indicator */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
            <Wifi className="w-3.5 h-3.5 text-[#00D4AA]" />
            <span className={`${poppins('Medium')} text-[10px] text-[#00D4AA]`}>Gut</span>
          </div>
        </div>

        {/* Device Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
              micOn ? 'bg-white/[0.08] border border-white/[0.12]' : 'bg-[#FF4444]/20 border border-[#FF4444]/30'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {micOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-[#FF4444]" />}
          </button>
          <button
            onClick={() => setCameraOn(!cameraOn)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
              cameraOn ? 'bg-white/[0.08] border border-white/[0.12]' : 'bg-[#FF4444]/20 border border-[#FF4444]/30'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {cameraOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-[#FF4444]" />}
          </button>
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white/[0.08] border border-white/[0.12] active:scale-95 transition-transform"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Volume2 className="w-5 h-5 text-white" />
          </button>
          <button
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white/[0.08] border border-white/[0.12] active:scale-95 transition-transform"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Meeting Info */}
        <GlassCard className="p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <Avatar name={meeting.tutor.name} size={36} />
            <div className="flex-1 min-w-0">
              <p className={`${poppins('SemiBold')} text-[14px] text-white`}>{meeting.subjectName}</p>
              <p className={`${poppins('Regular')} text-[12px] text-white/40`}>{meeting.tutor.name} · {formatTimeRange(meeting.startAt, meeting.endAt)}</p>
            </div>
          </div>
          {uiStatus === 'waiting' && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFB800]/8 border border-[#FFB800]/15 mt-2">
              <AlertCircle className="w-4 h-4 text-[#FFB800] flex-shrink-0 animate-pulse" />
              <span className={`${poppins('Medium')} text-[12px] text-[#FFB800]/80`}>Warte auf Tutor…</span>
            </div>
          )}
        </GlassCard>

        {/* Hints */}
        <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] mb-4">
          <p className={`${poppins('Regular')} text-[11px] text-white/30 leading-relaxed`}>
            Bitte stelle sicher, dass dein Mikrofon und deine Kamera funktionieren. Sei pünktlich und respektvoll.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-6">
          <button
            onClick={onBack}
            className={`flex-1 py-3 rounded-xl ${poppins('SemiBold')} text-[14px] text-white/60 bg-white/[0.05] border border-white/[0.08] active:bg-white/[0.08] transition-colors`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            Zurück
          </button>
          <button
            onClick={canJoin ? onJoin : undefined}
            disabled={!canJoin}
            className={`flex-1 py-3 rounded-xl ${poppins('SemiBold')} text-[14px] transition-all active:scale-[0.98] ${
              canJoin ? 'text-white' : 'text-white/30 bg-white/[0.03] border border-white/[0.05]'
            }`}
            style={canJoin ? { background: 'rgba(0,184,148,0.07)', border: '1px solid rgba(0,184,148,0.25)', WebkitTapHighlightColor: 'transparent' } : undefined}
          >
            {canJoin ? 'Meeting beitreten' : 'Warte auf Tutor…'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== MEETING ROOM =====
const MeetingRoom = ({ meeting, onLeave }: { meeting: Meeting; onLeave: () => void }) => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - start;
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setElapsedTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const participants = [meeting.tutor, ...meeting.students];
  const isGroup = meeting.lessonType === 'group';

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0a0a]/90 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4444] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4444]" />
          </span>
          <span className={`${poppins('SemiBold')} text-[14px] text-white`}>{meeting.subjectName}</span>
          {meeting.topicTitle && (
            <span className={`${poppins('Regular')} text-[12px] text-white/40 hidden sm:inline`}>· {meeting.topicTitle}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={`${poppins('Medium')} text-[13px] text-white/60 tabular-nums`}>{elapsedTime}</span>
          <div className="flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-[#00D4AA]" />
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 min-h-0 p-3 relative">
        <div className={`h-full grid gap-2 ${isGroup ? (participants.length <= 4 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-3 grid-rows-2') : 'grid-cols-1 md:grid-cols-2'}`}>
          {participants.map((p) => (
            <div
              key={p.id}
              className="relative rounded-xl bg-[#1a1a2e] border border-white/[0.06] overflow-hidden flex items-center justify-center"
            >
              <Avatar name={p.name} size={56} />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm flex items-center gap-1.5">
                <Mic className="w-3 h-3 text-white/60" />
                <span className={`${poppins('Medium')} text-[11px] text-white/80`}>{p.name.split(' ')[0]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Side Panel (Chat / Participants) */}
        {(showChat || showParticipants) && (
          <div className="absolute top-0 right-0 bottom-0 w-[280px] bg-[#121212] border-l border-white/[0.08] flex flex-col rounded-r-xl overflow-hidden z-10">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <span className={`${poppins('SemiBold')} text-[14px] text-white`}>
                {showChat ? 'Chat' : 'Teilnehmer'}
              </span>
              <button onClick={() => { setShowChat(false); setShowParticipants(false); }} className="p-1 rounded-md active:bg-white/[0.05]">
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
              {showParticipants && participants.map(p => (
                <div key={p.id} className="flex items-center gap-3 py-2">
                  <Avatar name={p.name} size={32} />
                  <span className={`${poppins('Medium')} text-[13px] text-white/70`}>{p.name}</span>
                </div>
              ))}
              {showChat && (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-white/15 mx-auto mb-2" />
                  <p className={`${poppins('Regular')} text-[12px] text-white/25`}>Noch keine Nachrichten</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="px-4 py-3 border-t border-white/[0.06] bg-[#0a0a0a]/90">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
              micOn ? 'bg-white/[0.08]' : 'bg-[#FF4444]/20'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {micOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-[#FF4444]" />}
          </button>
          <button
            onClick={() => setCameraOn(!cameraOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
              cameraOn ? 'bg-white/[0.08]' : 'bg-[#FF4444]/20'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {cameraOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-[#FF4444]" />}
          </button>
          <button
            onClick={() => setHandRaised(!handRaised)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
              handRaised ? 'bg-[#FFB800]/20' : 'bg-white/[0.08]'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Hand className={`w-5 h-5 ${handRaised ? 'text-[#FFB800]' : 'text-white'}`} />
          </button>
          <button
            onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
              showChat ? 'bg-[#7B61FF]/20' : 'bg-white/[0.08]'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <MessageSquare className={`w-5 h-5 ${showChat ? 'text-[#7B61FF]' : 'text-white'}`} />
          </button>
          <button
            onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
              showParticipants ? 'bg-[#7B61FF]/20' : 'bg-white/[0.08]'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Users className={`w-5 h-5 ${showParticipants ? 'text-[#7B61FF]' : 'text-white'}`} />
          </button>
          <button
            onClick={() => setShowLeaveConfirm(true)}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-[#FF4444] active:bg-[#FF4444]/80 transition-colors active:scale-95"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <PhoneOff className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Leave Confirmation */}
      {showLeaveConfirm && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="p-6 max-w-[320px] w-full">
            <h3 className={`${poppins('SemiBold')} text-[17px] text-white mb-2`}>Meeting verlassen?</h3>
            <p className={`${poppins('Regular')} text-[13px] text-white/50 mb-5`}>
              Möchtest du das Meeting wirklich verlassen?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className={`flex-1 py-2.5 rounded-xl ${poppins('Medium')} text-[14px] text-white/60 bg-white/[0.05] border border-white/[0.08] active:bg-white/[0.08] transition-colors`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Abbrechen
              </button>
              <button
                onClick={onLeave}
                className={`flex-1 py-2.5 rounded-xl ${poppins('Medium')} text-[14px] text-white bg-[#FF4444] active:bg-[#FF4444]/80 transition-colors`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Verlassen
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

// ===== MAIN MEETINGS SCREEN =====
export default React.memo(function MeetingsScreen({ onClose, isMobile = false, externalTransition = false, onOpenTutoringActivation }: MeetingsScreenProps) {
  const { tutoringStatus } = useUser();
  const isTutoringLocked = tutoringStatus !== 'activated';

  const [activeTab, setActiveTab] = useState<MeetingTab>('upcoming');
  const [viewState, setViewState] = useState<ViewState>('list');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Alle');
  const [selectedType, setSelectedType] = useState<'all' | '1on1' | 'group'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ===== RATING STATE =====
  const { submitRating, getRating, hasRating } = useMeetingRatings();
  const [ratingModalMeeting, setRatingModalMeeting] = useState<Meeting | null>(null);

  // ===== GPU SLIDE TRANSITION STATE =====
  const TAB_ORDER: Record<MeetingTab, number> = { upcoming: 0, live: 1, past: 2 };
  const SLIDE_DURATION = 280; // ms — matches CSS transition

  // slidePhase: null=idle, 'exit'=sliding out, 'enter-start'=positioned for entry (no transition), 'enter-end'=animating in
  const [slidePhase, setSlidePhase] = useState<'exit' | 'enter-start' | 'enter-end' | null>(null);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left');
  const isAnimatingRef = useRef(false);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // "Pending" state: what we're transitioning TO (applied mid-animation)
  const pendingRef = useRef<{ tab: MeetingTab; view: ViewState; meeting: Meeting | null } | null>(null);

  const triggerSlide = useCallback((
    dir: 'left' | 'right',
    nextTab: MeetingTab,
    nextView: ViewState,
    nextMeeting: Meeting | null,
  ) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    pendingRef.current = { tab: nextTab, view: nextView, meeting: nextMeeting };
    setSlideDir(dir);
    setSlidePhase('exit');

    animTimeoutRef.current = setTimeout(() => {
      // Swap content at peak of exit
      const p = pendingRef.current!;
      setActiveTab(p.tab);
      setViewState(p.view);
      setSelectedMeeting(p.meeting);
      scrollRef.current?.scrollTo({ top: 0 });

      // Step 1: position new content at entry offset (NO transition)
      setSlidePhase('enter-start');

      // Step 2: next frame → enable transition and animate to 0
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlidePhase('enter-end');

          setTimeout(() => {
            setSlidePhase(null);
            isAnimatingRef.current = false;
            pendingRef.current = null;
          }, SLIDE_DURATION);
        });
      });
    }, SLIDE_DURATION);
  }, []);

  // Tab switch with directional slide
  const handleTabSwitch = useCallback((newTab: MeetingTab) => {
    if (newTab === activeTab && viewState === 'list') return;
    const dir = viewState === 'detail'
      ? 'right'
      : (TAB_ORDER[newTab] > TAB_ORDER[activeTab] ? 'left' : 'right');
    triggerSlide(dir, newTab, 'list', null);
  }, [activeTab, viewState, triggerSlide]);

  // Open detail with slide-from-right
  const handleOpenMeeting = useCallback((meeting: Meeting) => {
    triggerSlide('left', activeTab, 'detail', meeting);
  }, [activeTab, triggerSlide]);

  // Back from detail with slide-from-left
  const handleBackToList = useCallback(() => {
    triggerSlide('right', activeTab, 'list', null);
  }, [activeTab, triggerSlide]);

  // Cleanup
  useEffect(() => () => { if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current); }, []);

  // Phase flow: null → 'exit' → [swap content] → 'enter-start' (1 frame, no transition) → 'enter-end' (animate to 0) → null

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter meetings by tab
  const tabMeetings = useMemo(() => {
    return MOCK_MEETINGS.filter(m => {
      const status = getUIStatus(m);
      switch (activeTab) {
        case 'upcoming': return status === 'upcoming' || status === 'joinable' || status === 'waiting';
        case 'live': return status === 'live';
        case 'past': return status === 'past' || status === 'cancelled';
      }
    });
  }, [activeTab]);

  // Apply filters
  const filteredMeetings = useMemo(() => {
    let result = tabMeetings;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.subjectName.toLowerCase().includes(q) ||
        m.tutor.name.toLowerCase().includes(q) ||
        m.topicTitle?.toLowerCase().includes(q)
      );
    }

    if (selectedSubject !== 'Alle') {
      result = result.filter(m => m.subjectName === selectedSubject);
    }

    if (selectedType !== 'all') {
      result = result.filter(m => m.lessonType === selectedType);
    }

    // Sort
    result.sort((a, b) => {
      const timeA = new Date(a.startAt).getTime();
      const timeB = new Date(b.startAt).getTime();
      return activeTab === 'past' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [tabMeetings, searchQuery, selectedSubject, selectedType, activeTab]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedSubject !== 'Alle' || selectedType !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('Alle');
    setSelectedType('all');
  };

  const tabs: { key: MeetingTab; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Anstehend', count: MOCK_MEETINGS.filter(m => { const s = getUIStatus(m); return s === 'upcoming' || s === 'joinable' || s === 'waiting'; }).length },
    { key: 'live', label: 'Live', count: MOCK_MEETINGS.filter(m => getUIStatus(m) === 'live').length },
    { key: 'past', label: 'Vergangen', count: MOCK_MEETINGS.filter(m => { const s = getUIStatus(m); return s === 'past' || s === 'cancelled'; }).length },
  ];

  // Meeting Room or Lobby view (fullscreen)
  if (viewState === 'room' && selectedMeeting) {
    return (
      <div className={`${externalTransition ? 'flex-1 min-h-0 w-full' : 'absolute inset-0 z-[60]'} bg-[#0a0a0a]`}>
        <MeetingRoom
          meeting={selectedMeeting}
          onLeave={() => { setViewState('list'); setSelectedMeeting(null); }}
        />
      </div>
    );
  }

  if (viewState === 'lobby' && selectedMeeting) {
    return (
      <div className={`${externalTransition ? 'flex-1 min-h-0 w-full' : 'absolute inset-0 z-[60]'} bg-[#0a0a0a]`}>
        <MeetingLobby
          meeting={selectedMeeting}
          onBack={() => setViewState('detail')}
          onJoin={() => setViewState('room')}
        />
      </div>
    );
  }

  // ===== LOCKED STATE (Tutoring not activated) =====
  const lockedContent = (
    <div className="size-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center gap-3 px-4 py-3">
          {onClose && (
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.05] active:bg-white/[0.08] transition-colors"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <h1 className={`${poppins('SemiBold')} text-[17px] text-white flex-1`}>Meetings</h1>
        </div>
      </div>
      {/* Locked Body */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="flex flex-col items-center text-center max-w-[340px]">
          {/* Icon */}
          <div
            className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: 'linear-gradient(135deg, rgba(0,184,148,0.15), rgba(0,184,148,0.05))',
              border: '1px solid rgba(0,184,148,0.18)',
            }}
          >
            <Zap className="w-8 h-8 text-[#00B894]" />
          </div>
          <h2 className={`${poppins('SemiBold')} text-[20px] text-white mb-2`}>
            {tutoringStatus === 'requestSent' ? 'Anfrage gesendet' : 'Nachhilfe nicht aktiviert'}
          </h2>
          <p className={`${poppins('Regular')} text-[14px] text-white/45 mb-8 leading-relaxed`}>
            {tutoringStatus === 'requestSent'
              ? 'Deine Anfrage wurde erfolgreich gesendet. Du wirst benachrichtigt, sobald die Nachhilfe freigeschaltet ist.'
              : 'Um deine Nachhilfestunden und Meetings sehen zu können, aktiviere zuerst die Nachhilfe-Funktion.'}
          </p>
          {/* CTA */}
          {tutoringStatus === 'requestSent' ? (
            <div
              className={`px-6 py-3 rounded-xl ${poppins('SemiBold')} text-[14px] flex items-center gap-2`}
              style={{
                background: 'rgba(255,184,77,0.07)',
                border: '1px solid rgba(255,184,77,0.2)',
              }}
            >
              <Clock className="w-4 h-4 text-[#FFB84D]" strokeWidth={2} />
              <span className="text-[#FFB84D]">Anfrage gesendet</span>
            </div>
          ) : (
            <button
              onClick={() => onOpenTutoringActivation?.()}
              className={`px-6 py-3 rounded-xl ${poppins('SemiBold')} text-[14px] text-white transition-all active:scale-[0.97]`}
              style={{
                background: 'rgba(0,184,148,0.07)',
                border: '1px solid rgba(0,184,148,0.25)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Nachhilfe aktivieren
            </button>
          )}
          {/* Subtle hint */}
          <p className={`${poppins('Regular')} text-[11px] text-white/20 mt-4`}>
            {tutoringStatus === 'requestSent'
              ? 'Dies kann bis zu 48 Stunden dauern.'
              : 'Nach der Aktivierung werden deine geplanten Meetings hier angezeigt.'}
          </p>
        </div>
      </div>
    </div>
  );

  const content = (
    <div className="size-full flex flex-col bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06]">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3">
          {onClose && (
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.05] active:bg-white/[0.08] transition-colors"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <h1 className={`${poppins('SemiBold')} text-[17px] text-white flex-1`}>Meetings</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors active:scale-95 ${
              showFilters || hasActiveFilters ? 'bg-[#7B61FF]/15 text-[#7B61FF]' : 'bg-white/[0.05] text-white/50'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Filter className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pb-3">
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabSwitch(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl ${poppins('Medium')} text-[12px] whitespace-nowrap transition-all duration-200 flex-shrink-0 active:scale-[0.97] ${
                  isActive
                    ? 'bg-white/[0.10] text-white border border-white/[0.12]'
                    : 'bg-transparent text-white/40 border border-transparent'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] ${poppins('SemiBold')} ${
                    isActive
                      ? (tab.key === 'live' ? 'bg-[#FF4444]/20 text-[#FF4444]' : 'bg-white/[0.12] text-white/70')
                      : 'bg-white/[0.06] text-white/30'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <div className="px-4 pb-3 space-y-2.5 border-t border-white/[0.04] pt-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Fach, Tutor, Thema…"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white ${poppins('Regular')} text-[13px] placeholder:text-white/25 outline-none focus:border-white/[0.15] transition-colors`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-white/30" />
                </button>
              )}
            </div>

            {/* Subject + Type Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSubject(s)}
                  className={`px-3 py-1.5 rounded-lg ${poppins('Medium')} text-[11px] whitespace-nowrap transition-all flex-shrink-0 active:scale-[0.97] ${
                    selectedSubject === s
                      ? 'bg-[#7B61FF]/15 text-[#7B61FF] border border-[#7B61FF]/25'
                      : 'bg-white/[0.03] text-white/40 border border-white/[0.06]'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {(['all', '1on1', 'group'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-lg ${poppins('Medium')} text-[11px] transition-all active:scale-[0.97] ${
                    selectedType === t
                      ? 'bg-[#7B61FF]/15 text-[#7B61FF] border border-[#7B61FF]/25'
                      : 'bg-white/[0.03] text-white/40 border border-white/[0.06]'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {t === 'all' ? 'Alle' : t === '1on1' ? 'Einzel' : 'Gruppe'}
                </button>
              ))}
            </div>

            {/* Active filter chips + reset */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                {searchQuery && (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#7B61FF]/10 ${poppins('Medium')} text-[10px] text-[#7B61FF]`}>
                    "{searchQuery}" <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                  </span>
                )}
                {selectedSubject !== 'Alle' && (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#7B61FF]/10 ${poppins('Medium')} text-[10px] text-[#7B61FF]`}>
                    {selectedSubject} <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSubject('Alle')} />
                  </span>
                )}
                {selectedType !== 'all' && (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#7B61FF]/10 ${poppins('Medium')} text-[10px] text-[#7B61FF]`}>
                    {selectedType === '1on1' ? 'Einzel' : 'Gruppe'} <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedType('all')} />
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className={`${poppins('Medium')} text-[11px] text-[#FF4444]/60 active:text-[#FF4444]/80`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  Filter zurücksetzen
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content — Full-width GPU slide transitions (matches SlideTransition.css pattern) */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-thin"
          style={{
            WebkitOverflowScrolling: 'touch',
            transform:
              slidePhase === 'exit'
                ? (slideDir === 'left' ? 'translateX(-100%) translateZ(0)' : 'translateX(100%) translateZ(0)')
              : slidePhase === 'enter-start'
                ? (slideDir === 'left' ? 'translateX(100%) translateZ(0)' : 'translateX(-100%) translateZ(0)')
              : 'translateX(0) translateZ(0)',
            transition:
              slidePhase === 'enter-start'
                ? 'none'
              : slidePhase
                ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.4, 0.0, 0.2, 1)`
                : 'none',
            willChange: slidePhase ? 'transform' : 'auto',
            backfaceVisibility: 'hidden',
            WebkitFontSmoothing: 'antialiased',
          } as React.CSSProperties}
        >
          <div className="px-4 pb-16 pt-4">
            {viewState === 'detail' && selectedMeeting ? (
              <MeetingDetailView
                meeting={selectedMeeting}
                onBack={handleBackToList}
                onJoinLobby={() => setViewState('lobby')}
                ratingValue={getRating(selectedMeeting.id)?.rating}
                onRate={() => setRatingModalMeeting(selectedMeeting)}
              />
            ) : isLoading ? (
              <div className="space-y-3">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : filteredMeetings.length === 0 ? (
              <EmptyState
                icon={activeTab === 'live' ? <Video className="w-10 h-10" /> : <Calendar className="w-10 h-10" />}
                title={
                  hasActiveFilters ? 'Keine Ergebnisse' :
                  activeTab === 'upcoming' ? 'Keine anstehenden Meetings' :
                  activeTab === 'live' ? 'Keine Live-Meetings' :
                  'Keine vergangenen Meetings'
                }
                subtitle={
                  hasActiveFilters ? 'Versuche andere Filterkriterien oder setze die Filter zurück.' :
                  activeTab === 'upcoming' ? 'Deine nächsten Meetings werden hier angezeigt.' :
                  activeTab === 'live' ? 'Sobald ein Meeting live geht, erscheint es hier.' :
                  'Vergangene Meetings und Zusammenfassungen findest du hier.'
                }
              />
            ) : (
              <div className="space-y-3">
                {filteredMeetings.map(m => (
                  <MeetingCard
                    key={m.id}
                    meeting={m}
                    onClick={() => handleOpenMeeting(m)}
                    hasRating={hasRating(m.id)}
                    onRate={() => setRatingModalMeeting(m)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ratingModal = (
    <MeetingRatingModal
      isOpen={!!ratingModalMeeting}
      onClose={() => setRatingModalMeeting(null)}
      onSubmit={(rating, message) => {
        if (ratingModalMeeting) {
          submitRating(ratingModalMeeting.id, rating, message);
        }
      }}
      meetingSubject={ratingModalMeeting?.subjectName || ''}
      tutorName={ratingModalMeeting?.tutor.name || ''}
      meetingDate={ratingModalMeeting?.startAt || ''}
      meetingTime={ratingModalMeeting ? `${formatTime(ratingModalMeeting.startAt)} – ${formatTime(ratingModalMeeting.endAt)}` : ''}
    />
  );

  // Use locked content when tutoring is not activated
  const activeContent = isTutoringLocked ? lockedContent : content;

  if (externalTransition) {
    return (
      <div className="flex-1 min-h-0 w-full bg-[#0a0a0a] overflow-hidden"
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'none' }}>
        {activeContent}
        {!isTutoringLocked && ratingModal}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-[60] bg-[#0a0a0a]">
      {activeContent}
      {!isTutoringLocked && ratingModal}
    </div>
  );
});