// ===== EXTRA-SESSION REQUEST CARD =====
// Rich chat-bubble replacement rendered when ChatMessage.type ===
// 'extra-session-request'. Shows date, time, duration, status badge,
// teacher note (if any), and a "Anfrage zurückziehen" button while the
// request is still pending.

import React from 'react';
import {
  Calendar, Clock, Timer, CheckCircle2, XCircle, RefreshCw, Hourglass, Ban,
} from 'lucide-react';
import {
  extraSessionRequestStore,
  useExtraSessionRequest,
  type ExtraSessionRequest,
  type ExtraSessionRequestStatus,
} from './extraSessionRequestStore';

const poppins = (weight: string) => `font-['Poppins:${weight}',sans-serif]`;

interface ExtraSessionRequestCardProps {
  requestId: string;
  /** Align the card like a chat bubble. */
  isStudent?: boolean;
}

function formatDate(iso: string): string {
  try {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    return dt.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

type StatusConfig = {
  label: string;
  color: string;
  bg: string;
  border: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const STATUS_CONFIG: Record<ExtraSessionRequestStatus, StatusConfig> = {
  pending: {
    label: 'Ausstehend',
    color: '#FFB84D',
    bg: 'rgba(255,184,77,0.12)',
    border: 'rgba(255,184,77,0.30)',
    Icon: Hourglass,
  },
  approved: {
    label: 'Genehmigt',
    color: '#00D4AA',
    bg: 'rgba(0,212,170,0.12)',
    border: 'rgba(0,212,170,0.30)',
    Icon: CheckCircle2,
  },
  rescheduled: {
    label: 'Neuer Vorschlag',
    color: '#4A9EFF',
    bg: 'rgba(74,158,255,0.12)',
    border: 'rgba(74,158,255,0.30)',
    Icon: RefreshCw,
  },
  declined: {
    label: 'Abgelehnt',
    color: '#FF6B6B',
    bg: 'rgba(255,107,107,0.12)',
    border: 'rgba(255,107,107,0.30)',
    Icon: XCircle,
  },
  withdrawn: {
    label: 'Zurückgezogen',
    color: 'rgba(255,255,255,0.40)',
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.10)',
    Icon: Ban,
  },
};

function Row({ icon, children, strike }: { icon: React.ReactNode; children: React.ReactNode; strike?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${strike ? 'opacity-50' : ''}`}>
      <span className="text-white/40 flex-shrink-0">{icon}</span>
      <span
        className={`${poppins('Medium')} text-[13px] text-white/85`}
        style={strike ? { textDecoration: 'line-through' } : undefined}
      >
        {children}
      </span>
    </div>
  );
}

export default function ExtraSessionRequestCard({ requestId, isStudent = true }: ExtraSessionRequestCardProps) {
  const req = useExtraSessionRequest(requestId);

  if (!req) return null;

  const status = STATUS_CONFIG[req.status];
  const StatusIcon = status.Icon;
  const hasReschedule = req.status === 'rescheduled' && req.rescheduledDate && req.rescheduledTime;
  const isWithdrawable = req.status === 'pending';

  return (
    <div
      className={`max-w-[320px] w-full rounded-2xl overflow-hidden ${isStudent ? 'ml-auto' : 'mr-auto'}`}
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-3.5 pb-2.5">
        <div className="min-w-0">
          <p className={`${poppins('Regular')} text-[10px] text-white/35 uppercase tracking-wider mb-0.5`}>
            Extra-Stunde
          </p>
          <p className={`${poppins('SemiBold')} text-[14px] text-white leading-tight`}>
            Anfrage an Lehrer
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${poppins('SemiBold')} text-[10px] flex-shrink-0`}
          style={{
            color: status.color,
            background: status.bg,
            border: `1px solid ${status.border}`,
          }}
        >
          <StatusIcon className="w-3 h-3" strokeWidth={2.2} />
          {status.label}
        </span>
      </div>

      {/* Separator */}
      <div className="mx-4 h-px bg-white/[0.06]" />

      {/* Details */}
      <div className="px-4 py-3 space-y-2">
        <Row icon={<Calendar className="w-3.5 h-3.5" strokeWidth={2} />} strike={hasReschedule}>
          {formatDate(req.date)}
        </Row>
        <Row icon={<Clock className="w-3.5 h-3.5" strokeWidth={2} />} strike={hasReschedule}>
          {req.time} Uhr
        </Row>
        <Row icon={<Timer className="w-3.5 h-3.5" strokeWidth={2} />}>
          {req.durationMinutes} Minuten
        </Row>
      </div>

      {/* Rescheduled proposal */}
      {hasReschedule && (
        <div
          className="mx-4 mb-3 rounded-xl px-3 py-2.5"
          style={{
            background: 'rgba(74,158,255,0.08)',
            border: '1px solid rgba(74,158,255,0.20)',
          }}
        >
          <p className={`${poppins('Regular')} text-[10px] text-[#4A9EFF] uppercase tracking-wider mb-1`}>
            Vorschlag vom Lehrer
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#4A9EFF]/80" strokeWidth={2} />
              <span className={`${poppins('SemiBold')} text-[13px] text-white`}>
                {formatDate(req.rescheduledDate!)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#4A9EFF]/80" strokeWidth={2} />
              <span className={`${poppins('SemiBold')} text-[13px] text-white`}>
                {req.rescheduledTime} Uhr
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Student note */}
      {req.note && req.note.trim() && (
        <div className="mx-4 mb-3">
          <p className={`${poppins('Regular')} text-[10px] text-white/35 uppercase tracking-wider mb-1`}>
            Deine Notiz
          </p>
          <p className={`${poppins('Regular')} text-[12px] text-white/65 leading-relaxed break-words`}>
            {req.note.trim()}
          </p>
        </div>
      )}

      {/* Teacher note */}
      {req.teacherNote && (
        <div
          className="mx-4 mb-3 rounded-xl px-3 py-2.5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <p className={`${poppins('Regular')} text-[10px] text-white/35 uppercase tracking-wider mb-1`}>
            Nachricht vom Lehrer
          </p>
          <p className={`${poppins('Regular')} text-[12px] text-white/70 leading-relaxed break-words`}>
            {req.teacherNote}
          </p>
        </div>
      )}

      {/* Withdraw action — only for pending student requests */}
      {isWithdrawable && isStudent && (
        <div className="px-4 pb-3">
          <button
            onClick={() => extraSessionRequestStore.withdrawRequest(req.id)}
            className={`w-full h-[36px] rounded-xl ${poppins('SemiBold')} text-[12px] transition-all active:scale-[0.98]`}
            style={{
              color: '#FF6B6B',
              background: 'rgba(255,107,107,0.08)',
              border: '1px solid rgba(255,107,107,0.22)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Anfrage zurückziehen
          </button>
        </div>
      )}
    </div>
  );
}
