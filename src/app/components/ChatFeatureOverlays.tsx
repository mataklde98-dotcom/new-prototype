// ===== CHAT FEATURE OVERLAYS =====
// Upload sheet, Chat settings, Report, Block, Media gallery, Mute
// Premium SaaS Style on #0a0a0a

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera, Image as ImageIcon, FileText, Mic, X, CheckCircle2,
  BellOff, Bell, Flag, Ban, Images, MoreVertical, Play, Pause,
  Square, File, Download,
} from 'lucide-react';

const ff = "Poppins, -apple-system, 'Inter', BlinkMacSystemFont, sans-serif";

// ===== TYPES =====
export interface ChatAttachment {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  name: string;
  size: string;
  url?: string;
  thumbnail?: string;
  duration?: number; // seconds for audio/video
}

// ===== BOTTOM SHEET WRAPPER =====
function BottomSheet({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => setVisible(true));
    else setVisible(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-[500px] bg-[#141414] border border-white/[0.08] rounded-t-[20px] overflow-hidden transition-transform duration-300 ease-out ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-[5px] rounded-full bg-white/[0.15]" />
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

// ===== 1. UPLOAD ACTION SHEET =====
export function UploadSheet({ isOpen, onClose, onAttach }: {
  isOpen: boolean;
  onClose: () => void;
  onAttach: (attachment: ChatAttachment) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (recordingInterval.current) clearInterval(recordingInterval.current);
    const duration = recordingDuration;
    setRecordingDuration(0);
    onAttach({
      id: `audio-${Date.now()}`,
      type: 'audio',
      name: 'Audio-Nachricht',
      size: `${Math.max(1, Math.round(duration * 16 / 1024))} KB`,
      duration,
    });
    onClose();
  }, [recordingDuration, onAttach, onClose]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    recordingInterval.current = setInterval(() => {
      setRecordingDuration(d => d + 1);
    }, 1000);
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleCamera = () => {
    // Simulate camera capture
    onAttach({
      id: `img-${Date.now()}`,
      type: 'image',
      name: 'Foto.jpg',
      size: '2.4 MB',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop',
    });
    onClose();
  };

  const handleGallery = () => {
    imageInputRef.current?.click();
  };

  const handleDocument = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file, i) => {
      const sizeStr = file.size > 1048576
        ? `${(file.size / 1048576).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;
      onAttach({
        id: `${type}-${Date.now()}-${i}`,
        type: type === 'image' ? (file.type.startsWith('video') ? 'video' : 'image') : 'document',
        name: file.name,
        size: sizeStr,
        thumbnail: type === 'image' ? URL.createObjectURL(file) : undefined,
      });
    });
    e.target.value = '';
    onClose();
  };

  if (isRecording) {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-[9999] flex items-end justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative w-full max-w-[500px] bg-[#141414] border border-white/[0.08] rounded-t-[20px] overflow-hidden p-6 pb-10">
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center animate-pulse">
              <Mic className="w-7 h-7 text-[#FF6B6B]" strokeWidth={2} />
            </div>
            <div className="text-center">
              <p className="text-white text-[16px] mb-1" style={{ fontFamily: ff, fontWeight: 600 }}>Aufnahme läuft</p>
              <p className="text-[#FF6B6B] text-[28px]" style={{ fontFamily: ff, fontWeight: 700 }}>{formatDuration(recordingDuration)}</p>
            </div>
            <button
              onClick={stopRecording}
              className="w-14 h-14 rounded-full bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 flex items-center justify-center active:scale-90 transition-transform"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Square className="w-5 h-5 text-[#FF6B6B]" strokeWidth={2} fill="#FF6B6B" />
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  const options = [
    { icon: Camera, label: 'Foto oder Video\naufnehmen', color: '#3B82F6', action: handleCamera },
    { icon: ImageIcon, label: 'Foto oder Video\naus Galerie', color: '#8B5CF6', action: handleGallery },
    { icon: FileText, label: 'Dokument', color: '#F59E0B', action: handleDocument },
    { icon: Mic, label: 'Audio-\nNachricht', color: '#FF6B6B', action: startRecording },
  ];

  return (
    <>
      <input ref={imageInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => handleFileSelected(e, 'image')} />
      <input ref={fileInputRef} type="file" accept=".pdf,.docx,.xlsx,.pptx,.txt" className="hidden" onChange={(e) => handleFileSelected(e, 'document')} />
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        <div className="px-5 py-4 pb-8">
          <h3 className="text-white text-[16px] mb-5" style={{ fontFamily: ff, fontWeight: 600 }}>Datei oder Medien senden</h3>
          <div className="grid grid-cols-3 gap-3">
            {options.map((opt) => (
              <button
                key={opt.label}
                onClick={opt.action}
                className="flex flex-col items-center gap-2.5 active:scale-95 transition-transform"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: `${opt.color}12`, border: `1px solid ${opt.color}30` }}
                >
                  <opt.icon className="w-6 h-6" strokeWidth={2} style={{ color: opt.color }} />
                </div>
                <span className="text-white/50 text-[11px] text-center leading-tight whitespace-pre-line" style={{ fontFamily: ff, fontWeight: 500 }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>
    </>
  );
}

// ===== 2. ATTACHMENT PREVIEW BAR =====
export function AttachmentPreviewBar({ attachments, onRemove }: {
  attachments: ChatAttachment[];
  onRemove: (id: string) => void;
}) {
  if (attachments.length === 0) return null;

  return (
    <div
      className="flex gap-2 px-3 py-2.5 overflow-x-auto scrollbar-thin"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      {attachments.map((att) => (
        <div key={att.id} className="relative flex-shrink-0">
          {att.type === 'image' || att.type === 'video' ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden relative" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              {att.thumbnail ? (
                <img src={att.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/[0.05] flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-white/30" />
                </div>
              )}
              {att.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-5 h-5 text-white" fill="white" />
                </div>
              )}
            </div>
          ) : att.type === 'audio' ? (
            <div
              className="h-16 px-3 rounded-xl flex items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <Mic className="w-4 h-4 text-[#FF6B6B]" />
              <div>
                <p className="text-white/60 text-[11px]" style={{ fontFamily: ff, fontWeight: 500 }}>Audio</p>
                <p className="text-white/30 text-[10px]" style={{ fontFamily: ff }}>{att.size}</p>
              </div>
            </div>
          ) : (
            <div
              className="h-16 px-3 rounded-xl flex items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <File className="w-4 h-4 text-[#F59E0B]" />
              <div className="max-w-[100px]">
                <p className="text-white/60 text-[11px] truncate" style={{ fontFamily: ff, fontWeight: 500 }}>{att.name}</p>
                <p className="text-white/30 text-[10px]" style={{ fontFamily: ff }}>{att.size}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => onRemove(att.id)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#141414] border border-white/20 flex items-center justify-center active:scale-90 transition-transform"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X className="w-3 h-3 text-white/60" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ===== 3. CHAT SETTINGS SHEET =====
export function ChatSettingsSheet({ isOpen, onClose, isMuted, isBlocked, onMute, onBlock, onReport, onMediaGallery }: {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  isBlocked: boolean;
  onMute: () => void;
  onBlock: () => void;
  onReport: () => void;
  onMediaGallery: () => void;
}) {
  const items = [
    {
      icon: isMuted ? Bell : BellOff,
      label: isMuted ? 'Stummschaltung aufheben' : 'Chat stummschalten',
      color: '#9CA3AF',
      action: () => { onMute(); onClose(); },
    },
    {
      icon: Flag,
      label: 'Nutzer melden',
      color: '#F59E0B',
      action: () => { onReport(); onClose(); },
    },
    {
      icon: Ban,
      label: isBlocked ? 'Blockierung aufheben' : 'Nutzer blockieren',
      color: '#FF6B6B',
      action: () => { onBlock(); onClose(); },
      destructive: !isBlocked,
    },
    {
      icon: Images,
      label: 'Medien & Dateien',
      color: '#8B5CF6',
      action: () => { onMediaGallery(); onClose(); },
    },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="px-2 py-2 pb-8">
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl active:bg-white/[0.04] transition-colors"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}
            >
              <item.icon className="w-5 h-5" strokeWidth={2} style={{ color: item.color }} />
            </div>
            <span
              className="text-[14px]"
              style={{ fontFamily: ff, fontWeight: 500, color: item.destructive ? '#FF6B6B' : 'rgba(255,255,255,0.8)' }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}

// ===== 4. MUTE DURATION SHEET =====
export function MuteDurationSheet({ isOpen, onClose, onSelect }: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (duration: string) => void;
}) {
  const options = ['1 Stunde', '8 Stunden', '24 Stunden', 'Bis ich es ändere'];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="px-5 py-4 pb-8">
        <h3 className="text-white text-[16px] mb-1" style={{ fontFamily: ff, fontWeight: 600 }}>Chat stummschalten</h3>
        <p className="text-white/40 text-[13px] mb-5" style={{ fontFamily: ff }}>Wie lange möchtest du stummschalten?</p>
        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onSelect(opt); onClose(); }}
              className="w-full py-3.5 rounded-xl text-left px-4 active:bg-white/[0.06] transition-colors"
              style={{
                fontFamily: ff, fontWeight: 500, fontSize: '14px',
                color: 'rgba(255,255,255,0.7)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}

// ===== 5. REPORT MODAL =====
export function ReportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  const reasons = [
    'Beleidigung oder Mobbing',
    'Unangemessene Inhalte',
    'Spam oder Werbung',
    'Betrug oder Fake-Profil',
    'Sonstiges',
  ];

  const handleSend = () => {
    if (!reason) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
    }, 1200);
  };

  const handleClose = () => {
    setReason(null);
    setDetails('');
    setSuccess(false);
    setSending(false);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <div className="px-5 py-4 pb-8 max-h-[80vh] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
        {success ? (
          <div className="flex flex-col items-center py-8 gap-4" style={{ animation: 'chatFadeIn 0.4s ease-out' }}>
            <div className="w-16 h-16 rounded-full bg-[#00D4AA]/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-[#00D4AA]" strokeWidth={2} />
            </div>
            <div className="text-center">
              <h3 className="text-white text-[18px] mb-1.5" style={{ fontFamily: ff, fontWeight: 600 }}>Meldung eingegangen</h3>
              <p className="text-white/40 text-[13px] max-w-[280px] leading-relaxed" style={{ fontFamily: ff }}>
                Wir prüfen deine Meldung so schnell wie möglich. Vielen Dank.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="mt-4 w-full h-[48px] rounded-xl flex items-center justify-center active:scale-[0.98] transition-all"
              style={{
                fontFamily: ff, fontWeight: 500, fontSize: '14px',
                background: 'rgba(0,184,148,0.07)', border: '1px solid rgba(0,184,148,0.25)',
                color: 'rgba(255,255,255,0.9)', WebkitTapHighlightColor: 'transparent',
              }}
            >
              Schließen
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-white text-[16px] mb-1" style={{ fontFamily: ff, fontWeight: 600 }}>Nutzer melden</h3>
            <p className="text-white/40 text-[13px] mb-5" style={{ fontFamily: ff }}>Wähle einen Grund für die Meldung.</p>
            <div className="space-y-2 mb-5">
              {reasons.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className="w-full py-3 rounded-xl text-left px-4 transition-all active:scale-[0.98]"
                  style={{
                    fontFamily: ff, fontWeight: 500, fontSize: '13px',
                    color: reason === r ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
                    background: reason === r ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${reason === r ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.06)'}`,
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="mb-5">
              <label className="text-white/50 text-[13px] block mb-2" style={{ fontFamily: ff, fontWeight: 500 }}>
                Weitere Details (optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Beschreibe das Problem..."
                className="w-full rounded-xl px-4 py-3 text-white/80 text-[13px] placeholder:text-white/20 resize-none outline-none transition-colors focus:border-white/20"
                style={{
                  fontFamily: ff, background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)', minHeight: '80px',
                }}
                rows={3}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!reason || sending}
              className="w-full h-[48px] rounded-xl flex items-center justify-center active:scale-[0.98] transition-all"
              style={{
                fontFamily: ff, fontWeight: 500, fontSize: '14px',
                background: reason && !sending ? 'rgba(0,184,148,0.07)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${reason && !sending ? 'rgba(0,184,148,0.25)' : 'rgba(255,255,255,0.06)'}`,
                color: reason && !sending ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                cursor: reason && !sending ? 'pointer' : 'default',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {sending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Wird gesendet...</span>
                </div>
              ) : 'Meldung senden'}
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes chatFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </BottomSheet>
  );
}

// ===== 6. BLOCK CONFIRMATION =====
export function BlockConfirmation({ isOpen, onClose, onConfirm }: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="px-5 py-5 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.15)' }}>
            <Ban className="w-5 h-5 text-[#FF6B6B]" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-white text-[15px]" style={{ fontFamily: ff, fontWeight: 600 }}>Nutzer blockieren?</h3>
          </div>
        </div>
        <p className="text-white/50 text-[13px] mb-6 leading-relaxed" style={{ fontFamily: ff }}>
          Du wirst keine Nachrichten mehr von diesem Nutzer erhalten und kannst ihm keine Nachrichten mehr senden.
        </p>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="w-full py-3 rounded-xl text-center active:scale-[0.97] transition-all"
            style={{
              fontFamily: ff, fontWeight: 600, fontSize: '14px',
              color: 'white', background: 'rgba(255,107,107,0.15)',
              border: '1px solid rgba(255,107,107,0.25)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Blockieren
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-center active:scale-[0.97] transition-all"
            style={{
              fontFamily: ff, fontWeight: 500, fontSize: '14px',
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.06)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Abbrechen
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

// ===== 7. MEDIA GALLERY =====
export function MediaGallerySheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'medien' | 'dateien'>('medien');

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="px-5 py-4 pb-8" style={{ maxHeight: '70vh' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-[16px]" style={{ fontFamily: ff, fontWeight: 600 }}>Medien & Dateien</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center" style={{ WebkitTapHighlightColor: 'transparent' }}>
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {(['medien', 'dateien'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-lg text-center transition-all"
              style={{
                fontFamily: ff, fontWeight: 500, fontSize: '13px',
                background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: tab === t ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {t === 'medien' ? 'Medien' : 'Dateien'}
            </button>
          ))}
        </div>
        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-12">
          {tab === 'medien' ? (
            <Images className="w-10 h-10 text-white/15 mb-3" strokeWidth={1.5} />
          ) : (
            <FileText className="w-10 h-10 text-white/15 mb-3" strokeWidth={1.5} />
          )}
          <p className="text-white/30 text-[13px] text-center" style={{ fontFamily: ff }}>
            Noch keine {tab === 'medien' ? 'Medien' : 'Dateien'} geteilt.
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}

// ===== 8. MUTE BANNER =====
export function MuteBanner({ onUnmute }: { onUnmute: () => void }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
      style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-2">
        <BellOff className="w-3.5 h-3.5 text-white/30" strokeWidth={2} />
        <span className="text-white/40 text-[12px]" style={{ fontFamily: ff }}>Dieser Chat ist stummgeschaltet.</span>
      </div>
      <button
        onClick={onUnmute}
        className="text-[#00D4AA] text-[12px] active:opacity-60 transition-opacity"
        style={{ fontFamily: ff, fontWeight: 500, WebkitTapHighlightColor: 'transparent' }}
      >
        Aufheben →
      </button>
    </div>
  );
}

// ===== 9. BLOCKED BAR =====
export function BlockedBar({ onUnblock }: { onUnblock: () => void }) {
  return (
    <div
      className="flex items-center justify-center gap-2 px-4 py-3.5 flex-shrink-0"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}
    >
      <Ban className="w-4 h-4 text-white/25" strokeWidth={2} />
      <span className="text-white/35 text-[13px]" style={{ fontFamily: ff }}>Du hast diesen Nutzer blockiert.</span>
      <button
        onClick={onUnblock}
        className="text-[#00D4AA] text-[13px] active:opacity-60 transition-opacity ml-1"
        style={{ fontFamily: ff, fontWeight: 500, WebkitTapHighlightColor: 'transparent' }}
      >
        Aufheben →
      </button>
    </div>
  );
}

// ===== HOOK: useChatFeatures =====
export function useChatFeatures() {
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [showMuteDuration, setShowMuteDuration] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);

  const addAttachment = useCallback((att: ChatAttachment) => {
    setAttachments(prev => [...prev, att]);
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearAttachments = useCallback(() => {
    setAttachments([]);
  }, []);

  const handleMuteAction = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
    } else {
      setShowMuteDuration(true);
    }
  }, [isMuted]);

  const handleBlockAction = useCallback(() => {
    if (isBlocked) {
      setIsBlocked(false);
    } else {
      setShowBlockConfirm(true);
    }
  }, [isBlocked]);

  return {
    showUploadSheet, setShowUploadSheet,
    showSettingsSheet, setShowSettingsSheet,
    showMuteDuration, setShowMuteDuration,
    showReportModal, setShowReportModal,
    showBlockConfirm, setShowBlockConfirm,
    showMediaGallery, setShowMediaGallery,
    isMuted, setIsMuted,
    isBlocked, setIsBlocked,
    attachments, addAttachment, removeAttachment, clearAttachments,
    handleMuteAction, handleBlockAction,
  };
}