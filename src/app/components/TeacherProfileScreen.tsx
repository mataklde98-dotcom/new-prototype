// ===== TEACHER PROFILE SCREEN =====
// Zeigt das Profil eines Lehrers mit teacher-scoped Meetings, Dokumenten und Actions.
// Desktop: DesktopContentWrapper (standard, scrollable)
// Mobile: MobileRouteTransition Overlay
// Premium SaaS Style (#0a0a0a, Poppins)

import React, { useState } from 'react';
import {
  ArrowLeft, MessageSquare, CalendarPlus,
  Calendar, Clock, Video,
  CheckCircle, AlertCircle,
  ChevronRight, Users,
} from 'lucide-react';
import { useTeacherProfileData } from '@/hooks/useTeacherProfileData';
import { formatTutorName } from '@/mocks';
import type { TeacherMeeting } from '@/mocks/teacherProfile.mock';
import { useMeetingRatings } from '@/hooks/useMeetingRatings';
import { MeetingRatingModal, RatingBadge } from './MeetingRatingModal';
import ExtraSessionRequestModal from './ExtraSessionRequestModal';
import type { Meeting } from './MeetingsScreen';

// ===== TYPES =====
interface TeacherProfileScreenProps {
  teacherId: string | null;
  onClose: () => void;
  onOpenChat?: (teacherId: string) => void;
  /** Called when the student taps a meeting card — opens Meetings detail view for that meeting. */
  onOpenMeeting?: (meeting: Meeting) => void;
  isMobile?: boolean;
  externalTransition?: boolean;
}

// ===== HELPERS =====
const poppins = (weight: string) => `font-['Poppins:${weight}',sans-serif]`;

function formatDate(iso: string): string {
  const d = new Date(iso);
  const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

function getDurationMinutes(start: string, end: string): number {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

function getCountdown(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return 'Jetzt';
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours > 24) return `in ${Math.floor(hours / 24)}d`;
  if (hours > 0) return `in ${hours}h ${mins}m`;
  return `in ${mins}m`;
}

/** Build a synthetic Meeting from a teacher-scoped TeacherMeeting so the
 *  Meetings detail view can render it without requiring an entry in MOCK_MEETINGS. */
function teacherMeetingToMeeting(tm: TeacherMeeting, teacherName: string): Meeting {
  return {
    id: tm.id,
    subjectName: tm.subject,
    lessonType: tm.lessonType,
    tutor: { id: tm.teacherId, name: teacherName },
    students: [{ id: 's1', name: 'Max Mustermann' }],
    topicTitle: tm.topicTitle,
    startAt: tm.startAt,
    endAt: tm.endAt,
    status: tm.status,
    joinPolicy: { joinEarlyMinutes: 10, requiresTutorStart: true },
    room: { roomId: `room-${tm.id}` },
  };
}

// ===== SUB-COMPONENTS =====

/** Subject Pills */
function SubjectPill({ subject }: { subject: string }) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    'Mathematik': { bg: 'rgba(74,144,217,0.12)', text: '#4A90D9', border: 'rgba(74,144,217,0.2)' },
    'Physik': { bg: 'rgba(123,97,255,0.12)', text: '#7B61FF', border: 'rgba(123,97,255,0.2)' },
    'Deutsch': { bg: 'rgba(255,184,0,0.12)', text: '#FFB800', border: 'rgba(255,184,0,0.2)' },
    'Englisch': { bg: 'rgba(0,212,170,0.12)', text: '#00D4AA', border: 'rgba(0,212,170,0.2)' },
    'Chemie': { bg: 'rgba(255,68,68,0.12)', text: '#FF4444', border: 'rgba(255,68,68,0.2)' },
    'Biologie': { bg: 'rgba(0,180,90,0.12)', text: '#00B45A', border: 'rgba(0,180,90,0.2)' },
    'Geschichte': { bg: 'rgba(180,130,70,0.12)', text: '#B48246', border: 'rgba(180,130,70,0.2)' },
  };
  const c = colorMap[subject] || { bg: 'rgba(255,255,255,0.06)', text: 'rgba(255,255,255,0.6)', border: 'rgba(255,255,255,0.1)' };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md ${poppins('Medium')} text-[11px] tracking-wide`}
      style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {subject}
    </span>
  );
}

/** Section Title */
function SectionTitle({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <h3 className={`${poppins('SemiBold')} text-[15px] text-white/90`}>
        {children}
      </h3>
      {count !== undefined && count > 0 && (
        <span
          className={`${poppins('SemiBold')} text-[11px] px-2 py-0.5 rounded-full`}
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

/** Empty State */
function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{ width: 56, height: 56, backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Icon size={24} color="rgba(255,255,255,0.2)" />
      </div>
      <p className={`${poppins('Regular')} text-[13px] text-white/30 text-center max-w-[260px]`}>
        {message}
      </p>
    </div>
  );
}

/** Meeting Card */
function MeetingCard({ meeting, isUpcoming, isMobile, hasRating, onRate, onClick }: { meeting: TeacherMeeting; isUpcoming: boolean; isMobile?: boolean; hasRating?: boolean; onRate?: () => void; onClick?: () => void }) {
  const duration = getDurationMinutes(meeting.startAt, meeting.endAt);
  const statusConfig: Record<string, { label: string; color: string; bg: string; pulse?: boolean }> = {
    scheduled: { label: 'Geplant', color: '#7B61FF', bg: 'rgba(123,97,255,0.15)' },
    live: { label: 'LIVE', color: '#FF4444', bg: 'rgba(255,68,68,0.15)', pulse: true },
    ended: { label: 'Beendet', color: '#8E8E93', bg: 'rgba(142,142,147,0.15)' },
    cancelled: { label: 'Abgesagt', color: '#FF4444', bg: 'rgba(255,68,68,0.10)' },
  };
  const status = statusConfig[meeting.status];

  // Avatar initials
  const subjectInitials = meeting.subject.slice(0, 2).toUpperCase();
  const subjectColors: Record<string, string> = {
    'Mathematik': '#4A90D9', 'Physik': '#7B61FF', 'Deutsch': '#FFB800',
    'Englisch': '#00D4AA', 'Chemie': '#FF4444', 'Biologie': '#00B45A',
    'Geschichte': '#B48246', 'Französisch': '#FF8C00',
  };
  const avatarColor = subjectColors[meeting.subject] || '#7B61FF';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={`rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] p-4 transition-transform ${onClick ? 'cursor-pointer active:scale-[0.985] hover:border-white/[0.14]' : ''}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Top: Avatar + Subject + Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Subject Avatar */}
          <div
            className="rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: 40, height: 40, backgroundColor: `${avatarColor}20`, border: `1px solid ${avatarColor}30` }}
          >
            <span className={`${poppins('SemiBold')} text-white/80`} style={{ fontSize: 14 }}>
              {subjectInitials}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h4 className={`${poppins('SemiBold')} text-[14px] text-white truncate`}>
                {meeting.subject}
              </h4>
              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${poppins('SemiBold')} text-[10px] uppercase tracking-wider`}
                style={{ color: status.color, backgroundColor: status.bg, border: `1px solid ${status.color}25` }}
              >
                {status.pulse && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: status.color }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: status.color }} />
                  </span>
                )}
                {status.label}
              </span>
            </div>
            {meeting.topicTitle && meeting.status !== 'ended' && (
              <p className={`${poppins('Regular')} text-[12px] text-white/50 truncate`}>{meeting.topicTitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Info Row */}
      <div className="flex items-center gap-3 flex-wrap mb-3">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-white/30" />
          <span className={`${poppins('Regular')} text-[11px] text-white/40`}>{formatDate(meeting.startAt)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-white/30" />
          <span className={`${poppins('Regular')} text-[11px] text-white/40`}>{formatTimeRange(meeting.startAt, meeting.endAt)}</span>
        </div>
        {/* Type Badge */}
        <span
          className={`px-2 py-0.5 rounded-md ${poppins('Medium')} text-[10px] text-white/50 bg-white/[0.04] border border-white/[0.06]`}
        >
          {meeting.lessonType === '1on1' ? 'Einzel' : 'Gruppe'}
        </span>
        {meeting.lessonType === 'group' && meeting.studentsCount && (
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-white/30" />
            <span className={`${poppins('Regular')} text-[11px] text-white/40`}>{meeting.studentsCount} Teilnehmer</span>
          </div>
        )}
      </div>

      {/* Bottom Row: Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isUpcoming && meeting.status === 'ended' && (
            <span className={`${poppins('Medium')} text-[12px] text-white/30`}>
              {duration} Min
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {meeting.status === 'live' && (
            <button
              className={`px-3 py-1.5 rounded-lg ${poppins('Medium')} text-[12px] text-white bg-[#FF4444]/80 active:bg-[#FF4444] transition-colors`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Jetzt beitreten
            </button>
          )}
          {isUpcoming && meeting.status === 'scheduled' && (
            <span className={`${poppins('Medium')} text-[12px] text-[#7B61FF]/70`}>
              {getCountdown(meeting.startAt)}
            </span>
          )}
          {!isUpcoming && meeting.status === 'ended' && !hasRating && onRate && (
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
          {!isUpcoming && meeting.status === 'ended' && hasRating && (
            <span className={`${poppins('Medium')} text-[11px] text-white/25`}>
              Bewertet
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-white/20" />
        </div>
      </div>
    </div>
  );
}

/** Action Button */
function ActionButton({
  icon: Icon,
  label,
  color,
  onClick,
  disabled,
  tooltip,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  onClick?: () => void;
  disabled?: boolean;
  tooltip?: string;
}) {
  return (
    <div className="relative group flex-1">
      <button
        onClick={disabled ? undefined : onClick}
        className={`w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 px-4 ${poppins('SemiBold')} text-[13px] transition-all ${
          disabled ? 'cursor-not-allowed opacity-50' : 'active:scale-[0.97]'
        }`}
        style={{
          backgroundColor: disabled ? 'rgba(255,255,255,0.03)' : `${color}12`,
          color: disabled ? 'rgba(255,255,255,0.3)' : color,
          border: `1px solid ${disabled ? 'rgba(255,255,255,0.06)' : `${color}25`}`,
        }}
      >
        <Icon size={16} />
        {label}
      </button>
      {disabled && tooltip && (
        <div
          className={`absolute -bottom-9 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg ${poppins('Medium')} text-[10px] text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10`}
          style={{ backgroundColor: 'rgba(30,30,30,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}

// ===== MAIN COMPONENT =====
export default function TeacherProfileScreen({
  teacherId,
  onClose,
  onOpenChat,
  onOpenMeeting,
  isMobile = false,
  externalTransition = false,
}: TeacherProfileScreenProps) {
  const { teacher, upcomingMeetings, pastMeetings, isLoading, error } = useTeacherProfileData(teacherId);
  const [showExtraSessionModal, setShowExtraSessionModal] = useState(false);
  const { submitRating, getRating, hasRating } = useMeetingRatings();
  const [ratingModalMeeting, setRatingModalMeeting] = React.useState<TeacherMeeting | null>(null);

  // Loading / Error / Not Found
  if (!teacherId || !teacher) {
    return (
      <div className="size-full flex flex-col bg-[#0a0a0a] overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={32} color="rgba(255,255,255,0.2)" className="mx-auto mb-3" />
            <p className={`${poppins('Medium')} text-[14px] text-white/40`}>
              {error || 'Lehrer nicht gefunden'}
            </p>
            <button
              onClick={onClose}
              className={`mt-4 px-4 py-2 rounded-lg ${poppins('SemiBold')} text-[12px] text-white/60 transition-colors active:bg-white/10`}
              style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
            >
              Zurück
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== MOBILE LAYOUT =====
  if (isMobile) {
    return (
      <div className="size-full flex flex-col bg-[#0a0a0a] overflow-hidden overscroll-none">
        {/* Fixed Header */}
        <div
          className="flex-shrink-0 flex items-center gap-3 px-4 pt-3 pb-3"
          style={{
            paddingTop: 'max(12px, env(safe-area-inset-top))',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-xl active:scale-95 active:bg-white/10 transition-transform"
            style={{
              width: 36, height: 36,
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <ArrowLeft size={17} color="rgba(255,255,255,0.7)" />
          </button>
          <h2 className={`${poppins('SemiBold')} text-[15px] text-white/90`}>
            Lehrerprofil
          </h2>
        </div>

        {/* Scrollable Content */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-none px-4 pt-4 scrollbar-hide"
          style={{ paddingBottom: '100px' }}
        >
          {/* ===== PROFILE CARD ===== */}
          <div
            className="rounded-2xl px-4 py-5 mb-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex flex-col items-center text-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="rounded-2xl object-cover"
                  style={{ width: 90, height: 90 }}
                />
                {teacher.isOnline && (
                  <div
                    className="absolute -bottom-0.5 -right-0.5"
                    style={{
                      width: 14, height: 14,
                      borderRadius: '50%',
                      background: '#00D4AA',
                      border: '3px solid #0a0a0a',
                      boxShadow: '0 0 8px rgba(0,212,170,0.4)',
                    }}
                  />
                )}
              </div>

              {/* Name */}
              <h3 className={`${poppins('SemiBold')} text-[17px] text-white/95`}>
                {teacher.name}
              </h3>

              {/* Subject Pills */}
              <div className="flex flex-wrap justify-center gap-1.5">
                {teacher.subjects.map(s => <SubjectPill key={s} subject={s} />)}
              </div>
            </div>
          </div>

          {/* ===== ACTION BUTTONS – kompakt horizontal ===== */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => onOpenChat?.(teacher.id)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 ${poppins('SemiBold')} text-[12px] active:scale-[0.97] transition-transform`}
              style={{
                backgroundColor: 'rgba(0,212,170,0.12)',
                color: '#00D4AA',
                border: '1px solid rgba(0,212,170,0.25)',
              }}
            >
              <MessageSquare size={15} />
              Chat
            </button>
            <button
              onClick={() => setShowExtraSessionModal(true)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 ${poppins('SemiBold')} text-[12px] active:scale-[0.97] transition-transform`}
              style={{
                backgroundColor: 'rgba(123,97,255,0.12)',
                color: '#9B87FF',
                border: '1px solid rgba(123,97,255,0.25)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <CalendarPlus size={15} />
              Extra-Stunde
            </button>
          </div>

          {/* ===== UPCOMING MEETINGS ===== */}
          <div className="mb-5">
            <SectionTitle count={upcomingMeetings.length}>Anstehende Termine</SectionTitle>
            {upcomingMeetings.length === 0 ? (
              <EmptyState
                icon={Calendar}
                message="Keine anstehenden Termine mit diesem Lehrer geplant."
              />
            ) : (
              <div className="flex flex-col gap-2.5">
                {upcomingMeetings.map(m => (
                  <MeetingCard
                    key={m.id}
                    meeting={m}
                    isUpcoming
                    isMobile
                    onClick={onOpenMeeting ? () => onOpenMeeting(teacherMeetingToMeeting(m, teacher.name)) : undefined}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ===== PAST MEETINGS ===== */}
          <div className="mb-5">
            <SectionTitle count={pastMeetings.length}>Vergangene Termine</SectionTitle>
            {pastMeetings.length === 0 ? (
              <EmptyState
                icon={CheckCircle}
                message="Noch keine vergangenen Termine mit diesem Lehrer."
              />
            ) : (
              <div className="flex flex-col gap-2.5">
                {pastMeetings.map(m => (
                  <MeetingCard
                    key={m.id}
                    meeting={m}
                    isUpcoming={false}
                    isMobile
                    hasRating={hasRating(m.id)}
                    onRate={() => setRatingModalMeeting(m)}
                    onClick={onOpenMeeting ? () => onOpenMeeting(teacherMeetingToMeeting(m, teacher.name)) : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <MeetingRatingModal
          isOpen={!!ratingModalMeeting}
          onClose={() => setRatingModalMeeting(null)}
          onSubmit={(rating, message) => {
            if (ratingModalMeeting) submitRating(ratingModalMeeting.id, rating, message);
          }}
          meetingSubject={ratingModalMeeting?.subject || ''}
          tutorName={teacher?.name || ''}
          meetingDate={ratingModalMeeting?.startAt || ''}
          meetingTime={ratingModalMeeting ? formatTimeRange(ratingModalMeeting.startAt, ratingModalMeeting.endAt) : ''}
        />
        <ExtraSessionRequestModal
          isOpen={showExtraSessionModal}
          onClose={() => setShowExtraSessionModal(false)}
          teacherId={teacher.id}
          teacherName={teacher.name}
        />
      </div>
    );
  }

  // ===== DESKTOP LAYOUT =====
  return (
    <div
      className="flex flex-col w-full"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3 px-1 pt-2 pb-4">
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded-xl transition-colors hover:bg-white/8 active:scale-95"
          style={{
            width: 40, height: 40,
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <ArrowLeft size={18} color="rgba(255,255,255,0.7)" />
        </button>
        <h2 className={`${poppins('SemiBold')} text-[16px] text-white/90`}>
          Lehrerprofil
        </h2>
      </div>

      {/* ===== TEACHER PROFILE CARD ===== */}
      <div
        className="rounded-2xl p-5 mb-5"
        style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={teacher.avatar}
              alt={teacher.name}
              className="rounded-2xl object-cover"
              style={{ width: 88, height: 88 }}
            />
            {teacher.isOnline && (
              <div
                className="absolute -bottom-1 -right-1"
                style={{
                  width: 16, height: 16,
                  borderRadius: '50%',
                  background: '#00D4AA',
                  border: '3px solid #0a0a0a',
                  boxShadow: '0 0 8px rgba(0,212,170,0.4)',
                }}
              />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className={`${poppins('SemiBold')} text-[18px] text-white/95 truncate`}>
              {teacher.name}
            </h3>

            {/* Subject Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {teacher.subjects.map(s => <SubjectPill key={s} subject={s} />)}
            </div>
          </div>
        </div>
      </div>

      {/* ===== ACTION BUTTONS ===== */}
      <div className="flex flex-row gap-3 mb-6">
        <ActionButton
          icon={MessageSquare}
          label="Chat"
          color="#00D4AA"
          onClick={() => onOpenChat?.(teacher.id)}
          disabled={!onOpenChat}
          tooltip={!onOpenChat ? 'Bald verfügbar' : undefined}
        />
        <ActionButton
          icon={CalendarPlus}
          label="Extra-Stunde"
          color="#7B61FF"
          onClick={() => setShowExtraSessionModal(true)}
        />
      </div>

      {/* ===== UPCOMING MEETINGS ===== */}
      <div className="mb-6">
        <SectionTitle count={upcomingMeetings.length}>Anstehende Termine</SectionTitle>
        {upcomingMeetings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            message="Keine anstehenden Termine mit diesem Lehrer geplant."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingMeetings.map(m => (
              <MeetingCard
                key={m.id}
                meeting={m}
                isUpcoming
                onClick={onOpenMeeting ? () => onOpenMeeting(teacherMeetingToMeeting(m, teacher.name)) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== PAST MEETINGS ===== */}
      <div className="mb-6">
        <SectionTitle count={pastMeetings.length}>Vergangene Termine</SectionTitle>
        {pastMeetings.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            message="Noch keine vergangenen Termine mit diesem Lehrer."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {pastMeetings.map(m => (
              <MeetingCard
                key={m.id}
                meeting={m}
                isUpcoming={false}
                hasRating={hasRating(m.id)}
                onRate={() => setRatingModalMeeting(m)}
                onClick={onOpenMeeting ? () => onOpenMeeting(teacherMeetingToMeeting(m, teacher.name)) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />

      <MeetingRatingModal
        isOpen={!!ratingModalMeeting}
        onClose={() => setRatingModalMeeting(null)}
        onSubmit={(rating, message) => {
          if (ratingModalMeeting) submitRating(ratingModalMeeting.id, rating, message);
        }}
        meetingSubject={ratingModalMeeting?.subject || ''}
        tutorName={teacher?.name || ''}
        meetingDate={ratingModalMeeting?.startAt || ''}
        meetingTime={ratingModalMeeting ? formatTimeRange(ratingModalMeeting.startAt, ratingModalMeeting.endAt) : ''}
      />
      <ExtraSessionRequestModal
        isOpen={showExtraSessionModal}
        onClose={() => setShowExtraSessionModal(false)}
        teacherId={teacher.id}
        teacherName={teacher.name}
      />
    </div>
  );
}