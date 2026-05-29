import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, PanInfo } from 'motion/react';
import { Trash2 } from 'lucide-react';

type SwipeToDeleteProps = {
  onDelete: () => void;
  children: React.ReactNode;
  disabled?: boolean;
};

export default function SwipeToDelete({ onDelete, children, disabled = false }: SwipeToDeleteProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const DELETE_BUTTON_WIDTH = 75;
  
  const VELOCITY_THRESHOLD = -400;
  const DISTANCE_THRESHOLD = -30;

  const handleDragStart = () => {
    setIsDragging(true);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, _info: PanInfo) => {};

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;
    
    const hasVelocity = info.velocity.x < VELOCITY_THRESHOLD;
    const hasDistance = info.offset.x < DISTANCE_THRESHOLD;
    
    if (hasVelocity || hasDistance) {
      setIsRevealed(true);
    } else {
      setIsRevealed(false);
    }

    setTimeout(() => {
      setIsDragging(false);
    }, 100);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsDeleting(true);
    
    setTimeout(() => {
      onDelete();
    }, 250);
  };

  const handleContentClick = (e: React.MouseEvent) => {
    if (isDragging || isRevealed) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // Reset wenn außerhalb geklickt wird
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (isRevealed) {
          setIsRevealed(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isRevealed]);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <motion.div 
      ref={containerRef} 
      className="relative"
      initial={{ opacity: 1, height: 'auto' }}
      animate={isDeleting ? { 
        opacity: 0, 
        height: 0,
        marginBottom: 0
      } : { 
        opacity: 1, 
        height: 'auto' 
      }}
      transition={{ 
        duration: 0.25,
        ease: "easeOut"
      }}
    >
      <div className="relative overflow-hidden">
        {/* WhatsApp-Style: Volle Höhe, solider roter Hintergrund, Icon oben + Text unten */}
        <div 
          className="absolute inset-y-0 right-0"
          style={{ width: DELETE_BUTTON_WIDTH }}
        >
          <button
            onClick={handleDelete}
            className="flex flex-col items-center justify-center gap-1 w-full h-full bg-[#1f1315] active:bg-[#2a1519] transition-colors"
          >
            <Trash2 className="w-[18px] h-[18px] text-red-400/90" strokeWidth={1.8} />
            <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-red-400/90">
              Löschen
            </span>
          </button>
        </div>

        {/* Swipeable Content – braucht opaken Hintergrund damit Delete-Button nicht durchleuchtet */}
        <motion.div
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: -DELETE_BUTTON_WIDTH, right: 0 }}
          dragElastic={{ left: 0.05, right: 0 }}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onClick={handleContentClick}
          style={{ x }}
          animate={isRevealed ? { x: -DELETE_BUTTON_WIDTH } : { x: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 25,
            mass: 0.8
          }}
          className="relative touch-pan-y"
        >
          {/* Opaker Hintergrund-Layer – deckt den Delete-Button komplett ab */}
          <div 
            className="absolute inset-0 bg-[#111111] pointer-events-none" 
            style={{ zIndex: 0 }}
          />
          {/* Content darüber */}
          <div 
            className="relative w-full"
            style={{ zIndex: 1 }}
            onClick={handleContentClick}
            onPointerDown={(e) => {
              if (isRevealed) {
                e.stopPropagation();
                e.preventDefault();
              }
            }}
          >
            <div style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}