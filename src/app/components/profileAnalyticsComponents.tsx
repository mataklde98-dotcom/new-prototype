// ===== EXTRACTED REUSABLE COMPONENTS for ProfileAnalyticsScreen =====

import React from 'react';
import {
  TrendingUp, TrendingDown, Minus,
  Layers, ClipboardCheck,
} from 'lucide-react';
import type { WeaknessItem } from './profileAnalyticsData';
import WeaknessActionButtons from './WeaknessActionButtons';

export const SeverityBadge = ({ severity }: { severity: 'critical' | 'warning' | 'moderate' }) => {
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

export const RiskBadge = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
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

export const StatusBadge = ({ status }: { status: 'on-track' | 'needs-attention' | 'at-risk' }) => {
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

export const TrendIcon = ({ trend }: { trend: 'up' | 'stable' | 'down' }) => {
  if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-[#00D4AA]" />;
  if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-[#FF4444]" />;
  return <Minus className="w-3.5 h-3.5 text-[#8E8E93]" />;
};

export const ScoreRing = ({ score, size = 44, strokeWidth = 3.5 }: { score: number; size?: number; strokeWidth?: number }) => {
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

export const ActionButton = ({ label, variant = 'primary', onClick }: { label: string; variant?: 'primary' | 'secondary'; onClick?: () => void }) => (
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

export const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] ${className}`}>
    {children}
  </div>
);

export const SectionTitle = ({ icon, title, badge }: { icon?: React.ReactNode; title: string; badge?: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-3">
    {icon && <div className="text-white/40">{icon}</div>}
    <h3 className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-white/70 uppercase tracking-wide">
      {title}
    </h3>
    {badge}
  </div>
);

// ===== WEAKNESS CARD (Reusable across Übersicht & KI-Prognose) =====
export const WeaknessCard = ({ item, onGenerate, onStartExam, onOpenLinkedFlashcardSet }: { item: WeaknessItem; showCriticality?: boolean; onGenerate?: (ctx: any) => void; onStartExam?: (ctx: any) => void; onOpenLinkedFlashcardSet?: (setId: string) => void; subjectColor?: string }) => {
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
export const EmptyState = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex flex-col items-center justify-center py-12 opacity-50">
    <div className="mb-3 text-white/30">{icon}</div>
    <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40 text-center">{text}</p>
  </div>
);

// ===== SKELETON =====
export const SkeletonCard = () => (
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