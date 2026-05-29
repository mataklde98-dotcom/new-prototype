// ===== CHAT MESSAGE ATTACHMENTS =====
// Multi-image grid, file cards, fullscreen viewer
// Premium SaaS Style on #0a0a0a

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { X, File, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ChatAttachment } from '@/mocks/chatMocks';

const ff = "Poppins, -apple-system, 'Inter', BlinkMacSystemFont, sans-serif";

// ===== FULLSCREEN IMAGE VIEWER =====
function FullscreenImageViewer({ images, startIndex, onClose }: {
  images: ChatAttachment[];
  startIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const pinchStartRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = images.length;
  const isMultiple = total > 1;

  const goTo = useCallback((idx: number) => {
    setCurrentIndex(idx);
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const goPrev = () => goTo((currentIndex - 1 + total) % total);
  const goNext = () => goTo((currentIndex + 1) % total);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && isMultiple) goPrev();
      if (e.key === 'ArrowRight' && isMultiple) goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIndex, total, onClose, isMultiple]);

  // Touch handling for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
    }
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartRef.current = dist;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (pinchStartRef.current !== null) {
      pinchStartRef.current = null;
      return;
    }
    if (!touchStartRef.current || !isMultiple) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dt = Date.now() - touchStartRef.current.time;
    if (Math.abs(dx) > 50 && dt < 500 && scale <= 1) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = Math.max(1, Math.min(5, scale * (dist / pinchStartRef.current)));
      setScale(newScale);
      pinchStartRef.current = dist;
    }
  };

  const currentImage = images[currentIndex];

  return ReactDOM.createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col"
      style={{ background: 'rgba(0,0,0,0.95)' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ paddingTop: 'max(env(safe-area-inset-top, 12px), 12px)' }}>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <X className="w-5 h-5 text-white" strokeWidth={2} />
        </button>
        {isMultiple && (
          <span className="text-white/70 text-[14px]" style={{ fontFamily: ff, fontWeight: 500 }}>
            {currentIndex + 1} / {total}
          </span>
        )}
        <div className="w-10" />
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center overflow-hidden relative">
        {/* Desktop arrows */}
        {isMultiple && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 z-10 w-10 h-10 rounded-full bg-white/10 items-center justify-center hover:bg-white/20 transition-colors hidden md:flex"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 z-10 w-10 h-10 rounded-full bg-white/10 items-center justify-center hover:bg-white/20 transition-colors hidden md:flex"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}

        <img
          src={currentImage.thumbnail || currentImage.url || ''}
          alt={currentImage.name}
          className="max-w-full max-h-full object-contain select-none"
          style={{
            transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
            transition: scale === 1 ? 'transform 0.3s ease' : 'none',
          }}
          draggable={false}
          onDoubleClick={() => setScale(s => s > 1 ? 1 : 2.5)}
        />
      </div>

      {/* Dot indicators */}
      {isMultiple && total <= 10 && (
        <div className="flex items-center justify-center gap-1.5 py-4 flex-shrink-0" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)' }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all"
              style={{
                width: i === currentIndex ? '20px' : '6px',
                height: '6px',
                background: i === currentIndex ? '#00D4AA' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}

// ===== MULTI-IMAGE GRID =====
export function ChatImageGrid({ images, bubbleRadius }: {
  images: ChatAttachment[];
  bubbleRadius?: string;
}) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerStart, setViewerStart] = useState(0);

  const openViewer = (index: number) => {
    setViewerStart(index);
    setViewerOpen(true);
  };

  const count = images.length;
  const gap = '2px';

  const imgStyle = (radius?: string): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    borderRadius: radius || '0px',
    cursor: 'pointer',
  });

  // max container width to keep images reasonable
  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gap,
    borderRadius: '12px',
    overflow: 'hidden',
    maxWidth: '280px',
  };

  const renderOverlay = (remaining: number) => (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center" style={{ borderRadius: 'inherit' }}>
      <span className="text-white text-[20px]" style={{ fontFamily: ff, fontWeight: 700 }}>+{remaining}</span>
    </div>
  );

  let grid: React.ReactNode;

  if (count === 1) {
    grid = (
      <div style={{ ...containerStyle, gridTemplateColumns: '1fr' }}>
        <div className="relative" style={{ aspectRatio: '4/3' }}>
          <img src={images[0].thumbnail || images[0].url} alt="" style={imgStyle()} onClick={() => openViewer(0)} />
        </div>
      </div>
    );
  } else if (count === 2) {
    grid = (
      <div style={{ ...containerStyle, gridTemplateColumns: '1fr 1fr' }}>
        {images.slice(0, 2).map((img, i) => (
          <div key={img.id} className="relative" style={{ aspectRatio: '3/4' }}>
            <img src={img.thumbnail || img.url} alt="" style={imgStyle()} onClick={() => openViewer(i)} />
          </div>
        ))}
      </div>
    );
  } else if (count === 3) {
    grid = (
      <div style={{ ...containerStyle, gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', height: '240px' }}>
        <div className="relative" style={{ gridRow: '1 / 3' }}>
          <img src={images[0].thumbnail || images[0].url} alt="" style={imgStyle()} onClick={() => openViewer(0)} />
        </div>
        <div className="relative">
          <img src={images[1].thumbnail || images[1].url} alt="" style={imgStyle()} onClick={() => openViewer(1)} />
        </div>
        <div className="relative">
          <img src={images[2].thumbnail || images[2].url} alt="" style={imgStyle()} onClick={() => openViewer(2)} />
        </div>
      </div>
    );
  } else if (count === 4) {
    grid = (
      <div style={{ ...containerStyle, gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
        {images.slice(0, 4).map((img, i) => (
          <div key={img.id} className="relative" style={{ aspectRatio: '1' }}>
            <img src={img.thumbnail || img.url} alt="" style={imgStyle()} onClick={() => openViewer(i)} />
          </div>
        ))}
      </div>
    );
  } else {
    // 5+ images: 1 large left + 2 small right, 4th position has +X overlay
    const remaining = count - 3;
    grid = (
      <div style={{ ...containerStyle, gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', height: '240px' }}>
        <div className="relative" style={{ gridRow: '1 / 3' }}>
          <img src={images[0].thumbnail || images[0].url} alt="" style={imgStyle()} onClick={() => openViewer(0)} />
        </div>
        <div className="relative">
          <img src={images[1].thumbnail || images[1].url} alt="" style={imgStyle()} onClick={() => openViewer(1)} />
        </div>
        <div className="relative" style={{ cursor: 'pointer' }} onClick={() => openViewer(2)}>
          <img src={images[2].thumbnail || images[2].url} alt="" style={imgStyle()} />
          {renderOverlay(remaining)}
        </div>
      </div>
    );
  }

  return (
    <>
      {grid}
      {viewerOpen && (
        <FullscreenImageViewer
          images={images}
          startIndex={viewerStart}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}

// ===== FILE CARD =====
export function ChatFileCard({ attachment }: { attachment: ChatAttachment }) {
  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    const colors: Record<string, string> = {
      pdf: '#FF6B6B', docx: '#3B82F6', doc: '#3B82F6',
      xlsx: '#22C55E', xls: '#22C55E', pptx: '#F59E0B',
      ppt: '#F59E0B', txt: '#9CA3AF',
    };
    return colors[ext || ''] || '#9CA3AF';
  };

  const color = getFileIcon(attachment.name);

  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg mt-1.5 first:mt-0"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
      >
        <File className="w-4 h-4" style={{ color }} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white/70 text-[12px] truncate" style={{ fontFamily: ff, fontWeight: 500 }}>{attachment.name}</p>
        <p className="text-white/30 text-[10px]" style={{ fontFamily: ff }}>{attachment.size}</p>
      </div>
      <button className="flex-shrink-0 active:scale-90 transition-transform" style={{ WebkitTapHighlightColor: 'transparent' }}>
        <Download className="w-4 h-4 text-white/25" strokeWidth={2} />
      </button>
    </div>
  );
}

// ===== COMBINED ATTACHMENT RENDERER =====
export function MessageAttachments({ attachments }: { attachments: ChatAttachment[] }) {
  if (!attachments || attachments.length === 0) return null;

  const imageAttachments = attachments.filter(a => a.type === 'image' || a.type === 'video');
  const fileAttachments = attachments.filter(a => a.type === 'document');

  return (
    <div className="mb-1">
      {imageAttachments.length > 0 && (
        <div className="mb-1">
          <ChatImageGrid images={imageAttachments} />
        </div>
      )}
      {fileAttachments.length > 0 && (
        <div>
          {fileAttachments.map(file => (
            <ChatFileCard key={file.id} attachment={file} />
          ))}
        </div>
      )}
    </div>
  );
}
