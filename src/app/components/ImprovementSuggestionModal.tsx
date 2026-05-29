// ===== IMPROVEMENT SUGGESTION MODAL =====
// Bottom-Sheet Popup für Verbesserungsvorschlag senden
// Premium SaaS Style (Linear/Vercel)

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { X, Bug, Lightbulb, Wrench, Heart, MoreHorizontal, CheckCircle2 } from 'lucide-react';

interface ImprovementSuggestionModalProps {
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'bug', label: 'Fehler melden', icon: Bug, color: '#FF6B6B' },
  { id: 'feature', label: 'Feature-Wunsch', icon: Lightbulb, color: '#8B5CF6' },
  { id: 'improvement', label: 'Verbesserung', icon: Wrench, color: '#FFB84D' },
  { id: 'praise', label: 'Lob', icon: Heart, color: '#00D4AA' },
  { id: 'other', label: 'Sonstiges', icon: MoreHorizontal, color: '#6B7280' },
] as const;

const PRIORITIES = [
  { id: 'high', label: 'Sehr wichtig' },
  { id: 'medium', label: 'Mittel' },
  { id: 'low', label: 'Nice-to-have' },
] as const;

export default function ImprovementSuggestionModal({ onClose }: ImprovementSuggestionModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [priority, setPriority] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setCategory(null);
      setPriority(null);
      setMessage('');
      setSuccess(false);
      setSending(false);
      onClose();
    }, 300);
  }, [onClose]);

  const canSend = category && priority && message.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    setSending(true);
    // Simulate sending
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
    }, 1200);
  };

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`relative w-full max-w-[500px] max-h-[90vh] bg-[#141414] border border-white/[0.08] rounded-t-[20px] overflow-hidden transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-[5px] rounded-full bg-white/[0.15]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white">
              Verbesserungsvorschlag
            </h2>
            <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 mt-0.5">
              Dein Feedback hilft uns, die App für dich zu verbessern.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center active:bg-white/[0.12] transition-colors flex-shrink-0"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X className="w-4 h-4 text-white/60" strokeWidth={2} />
          </button>
        </div>

        <div className="h-px bg-white/[0.06]" />

        {/* Scrollable Content */}
        <div
          className="overflow-y-auto px-5 pb-10 pt-5 scrollbar-thin"
          style={{ maxHeight: 'calc(90vh - 120px)', WebkitOverflowScrolling: 'touch' }}
        >
          {success ? (
            /* ===== Success State ===== */
            <div
              className="flex flex-col items-center justify-center py-12 gap-4"
              style={{ animation: 'fadeIn 0.4s ease-out' }}
            >
              <div className="w-16 h-16 rounded-full bg-[#00D4AA]/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#00D4AA]" strokeWidth={2} />
              </div>
              <div className="text-center">
                <h3 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white mb-1.5">
                  Vielen Dank!
                </h3>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40 max-w-[280px] leading-relaxed">
                  Dein Verbesserungsvorschlag ist bei uns eingegangen. Wir schauen uns dein Feedback an.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-4 w-full h-[48px] rounded-xl flex items-center justify-center font-['Poppins:Medium',sans-serif] text-[14px] text-white/90 active:scale-[0.98] transition-all duration-200"
                style={{
                  background: 'rgba(0,184,148,0.07)',
                  border: '1px solid rgba(0,184,148,0.25)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                Schließen
              </button>
            </div>
          ) : (
            /* ===== Form ===== */
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              {/* Section 1: Kategorie */}
              <div className="mb-6">
                <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50 block mb-3">
                  Art des Feedbacks
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const selected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-200 active:scale-[0.97]"
                        style={{
                          background: selected ? `${cat.color}12` : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${selected ? `${cat.color}40` : 'rgba(255,255,255,0.08)'}`,
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        <Icon
                          className="w-4 h-4 flex-shrink-0"
                          strokeWidth={2}
                          style={{ color: selected ? cat.color : 'rgba(255,255,255,0.35)' }}
                        />
                        <span
                          className="font-['Poppins:Medium',sans-serif] text-[12px]"
                          style={{ color: selected ? cat.color : 'rgba(255,255,255,0.5)' }}
                        >
                          {cat.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Priorität */}
              <div className="mb-6">
                <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50 block mb-3">
                  Wie wichtig ist dir das?
                </label>
                <div className="flex gap-2">
                  {PRIORITIES.map((p) => {
                    const selected = priority === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPriority(p.id)}
                        className="flex-1 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.97]"
                        style={{
                          background: selected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${selected ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.06)'}`,
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        <span
                          className="font-['Poppins:Medium',sans-serif] text-[12px]"
                          style={{ color: selected ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)' }}
                        >
                          {p.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Nachricht */}
              <div className="mb-6">
                <label className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/50 block mb-3">
                  Deine Nachricht
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Beschreibe deinen Vorschlag so detailliert wie möglich..."
                  className="w-full rounded-xl px-4 py-3.5 font-['Poppins:Regular',sans-serif] text-[13px] text-white/80 placeholder:text-white/20 resize-none outline-none transition-colors duration-200 focus:border-white/20"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    minHeight: '120px',
                    WebkitAppearance: 'none',
                  }}
                  rows={5}
                />
              </div>

              {/* Section 4: Send Button */}
              <button
                onClick={handleSend}
                disabled={!canSend || sending}
                className="w-full h-[48px] rounded-xl flex items-center justify-center font-['Poppins:Medium',sans-serif] text-[14px] active:scale-[0.98] transition-all duration-200"
                style={{
                  background: canSend && !sending ? 'rgba(0,184,148,0.07)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${canSend && !sending ? 'rgba(0,184,148,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  color: canSend && !sending ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                  cursor: canSend && !sending ? 'pointer' : 'default',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {sending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Wird gesendet...</span>
                  </div>
                ) : (
                  'Vorschlag senden'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}