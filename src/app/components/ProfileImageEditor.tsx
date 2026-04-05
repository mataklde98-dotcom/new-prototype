import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ProfileImageEditorProps {
  imageUrl: string;
  onSave: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

export default function ProfileImageEditor({ imageUrl, onSave, onCancel }: ProfileImageEditorProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pinch-to-zoom state
  const [lastDistance, setLastDistance] = useState<number | null>(null);

  // Calculate distance between two touch points
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch gesture
      const distance = getDistance(e.touches[0], e.touches[1]);
      setLastDistance(distance);
    } else if (e.touches.length === 1) {
      // Pan gesture
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastDistance !== null) {
      // Pinch to zoom
      e.preventDefault();
      const distance = getDistance(e.touches[0], e.touches[1]);
      const delta = distance - lastDistance;
      const newScale = Math.max(1, Math.min(3, scale + delta * 0.01));
      setScale(newScale);
      setLastDistance(distance);
    } else if (e.touches.length === 1 && isDragging) {
      // Pan
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastDistance(null);
  };

  // Handle mouse events (for desktop testing)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.max(1, Math.min(3, scale + delta));
    setScale(newScale);
  };

  // Save the cropped image
  const handleSave = () => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match the circle (400x400 for high quality)
    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    const img = imageRef.current;
    const container = containerRef.current;
    
    // Get the actual rendered size and position
    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    // Calculate which part of the image is visible in the container
    // These are in screen coordinates
    const visibleLeft = containerRect.left - imgRect.left;
    const visibleTop = containerRect.top - imgRect.top;
    const visibleWidth = containerRect.width;
    const visibleHeight = containerRect.height;
    
    // Convert screen coordinates to natural image coordinates
    const scaleFactorX = img.naturalWidth / imgRect.width;
    const scaleFactorY = img.naturalHeight / imgRect.height;
    
    const cropX = visibleLeft * scaleFactorX;
    const cropY = visibleTop * scaleFactorY;
    const cropWidth = visibleWidth * scaleFactorX;
    const cropHeight = visibleHeight * scaleFactorY;

    // Draw circular clip
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    // Fill with background color first
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, outputSize, outputSize);
    
    // Draw the cropped portion of the image
    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      outputSize,
      outputSize
    );
    
    // Convert to data URL and save
    const croppedImageUrl = canvas.toDataURL('image/png', 0.95);
    onSave(croppedImageUrl);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col">
      {/* iOS-Style Header */}
      <div 
        className="flex-shrink-0"
        style={{ 
          paddingTop: 'max(env(safe-area-inset-top), 0px)',
        }}
      >
        {/* Status Bar Space */}
        <div className="h-3" />
        
        {/* Navigation Bar - alles auf gleicher Höhe */}
        <div className="relative flex items-center px-5 h-[44px]">
          <button
            onClick={onCancel}
            className="font-['Poppins:Regular',sans-serif] text-[15px] text-white/90 transition-opacity duration-150 active:opacity-40 z-10"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            Abbrechen
          </button>

          <h2 className="absolute left-1/2 -translate-x-1/2 font-['Poppins:SemiBold',sans-serif] text-[16px] text-white tracking-[-0.4px]">
            Foto bearbeiten
          </h2>

          <button
            onClick={handleSave}
            className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-[#00D4AA] transition-opacity duration-150 active:opacity-40 z-10 ml-auto"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            Fertig
          </button>
        </div>
      </div>

      {/* Image Editor Area */}
      <div className="flex-1 flex items-center justify-center">
        <div 
          ref={containerRef}
          className="relative overflow-hidden rounded-full"
          style={{
            width: '280px',
            height: '280px',
            border: '4px solid rgba(255, 255, 255, 0.15)'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Profile"
            draggable={false}
            className="absolute pointer-events-none select-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              minWidth: '100%',
              minHeight: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>

      {/* Instructions & Zoom Control */}
      <div 
        className="px-6 pb-4 space-y-4"
        style={{ 
          paddingBottom: 'max(env(safe-area-inset-bottom), 16px)'
        }}
      >
        {/* Instructions */}
        <p className="text-center font-['Poppins:Regular',sans-serif] text-[13px] text-white/50 leading-[18px]">
          Ziehe mit einem Finger zum Verschieben.<br />
          Zwei Finger zum Zoomen.
        </p>

        {/* Zoom Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70">Zoom</span>
            <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-[#00D4AA]">
              {Math.round(scale * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full h-[3px] rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #00D4AA 0%, #00D4AA ${((scale - 1) / 2) * 100}%, rgba(255,255,255,0.15) ${((scale - 1) / 2) * 100}%, rgba(255,255,255,0.15) 100%)`,
              WebkitTapHighlightColor: 'transparent'
            }}
          />
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #00D4AA;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #00D4AA;
          cursor: pointer;
          border: none;
          transition: transform 0.15s ease;
        }

        input[type="range"]:active::-webkit-slider-thumb {
          transform: scale(1.15);
        }

        input[type="range"]:active::-moz-range-thumb {
          transform: scale(1.15);
        }
      `}</style>
    </div>,
    document.body
  );
}