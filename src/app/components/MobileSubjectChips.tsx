import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface MobileSubjectChipsProps {
  allSets: any[];
  activeSubject: string;
  activeKategorie: string;
  activeThema: string;
  activeUnterthema: string;
  onSubjectChange: (subject: string) => void;
  onKategorieChange: (kategorie: string) => void;
  onThemaChange: (thema: string) => void;
  onUnterthemaChange: (unterthema: string) => void;
  showOnlySubject?: boolean; // True for "Eigene" tab - users can only create subjects, not full hierarchy
}

export function MobileSubjectChips({ 
  allSets, 
  activeSubject, 
  activeKategorie,
  activeThema,
  activeUnterthema,
  onSubjectChange,
  onKategorieChange,
  onThemaChange,
  onUnterthemaChange,
  showOnlySubject = false
}: MobileSubjectChipsProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [subjectButtonRef, setSubjectButtonRef] = useState<HTMLButtonElement | null>(null);
  const [kategorieButtonRef, setKategorieButtonRef] = useState<HTMLButtonElement | null>(null);
  const [themaButtonRef, setThemaButtonRef] = useState<HTMLButtonElement | null>(null);
  const [unterthemaButtonRef, setUnterthemaButtonRef] = useState<HTMLButtonElement | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  
  // Check if there are any items at all
  const hasAnyItems = allSets.length > 0;
  
  // Auto-scroll to newly visible chips
  useEffect(() => {
    if (kategorieButtonRef && activeSubject !== 'Alle Fächer' && activeSubject !== 'All' && activeSubject !== '') {
      setTimeout(() => {
        kategorieButtonRef.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 100);
    }
  }, [activeSubject, kategorieButtonRef]);
  
  useEffect(() => {
    if (themaButtonRef && activeKategorie !== 'Alle' && activeKategorie !== '') {
      setTimeout(() => {
        themaButtonRef.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 100);
    }
  }, [activeKategorie, themaButtonRef]);
  
  useEffect(() => {
    if (unterthemaButtonRef && activeThema !== 'Alle' && activeThema !== '') {
      setTimeout(() => {
        unterthemaButtonRef.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 100);
    }
  }, [activeThema, unterthemaButtonRef]);
  
  // Auto-scroll when Unterthema is selected to ensure it's fully visible
  useEffect(() => {
    if (unterthemaButtonRef && activeUnterthema !== 'Alle' && activeUnterthema !== '') {
      setTimeout(() => {
        unterthemaButtonRef.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 100);
    }
  }, [activeUnterthema, unterthemaButtonRef]);
  
  // Get unique subjects, categories, themes, etc.
  const subjects = ['Alle Fächer', ...Array.from(new Set(allSets.map(s => s.subject).filter(s => s && s !== 'Custom')))];
  const kategorien = activeSubject === 'Alle Fächer' || activeSubject === 'All' || activeSubject === '' ? [] : ['Alle', ...Array.from(new Set(allSets.filter(s => s.subject === activeSubject).map(s => s.kategorie).filter(k => k && k.trim() !== '')))];
  const themen = (activeKategorie === 'Alle' || activeKategorie === '') ? [] : ['Alle', ...Array.from(new Set(allSets.filter(s => s.subject === activeSubject && s.kategorie === activeKategorie).map(s => s.thema).filter(t => t && t.trim() !== '')))];
  const unterthemen = (activeThema === 'Alle' || activeThema === '') ? [] : ['Alle', ...Array.from(new Set(allSets.filter(s => s.subject === activeSubject && s.kategorie === activeKategorie && s.thema === activeThema).map(s => s.unterthema).filter(u => u && u.trim() !== '')))];

  // Get subject color
  const getSubjectColor = (subject: string): string => {
    const colorMap: Record<string, string> = {
      "Alle Fächer": "#009379",
      "All": "#009379", // Fallback for legacy data
      "Mathematik": "#618cff",
      "Mathe": "#618cff",
      "Deutsch": "#ff6b9d",
      "Englisch": "#4a9eff",
      "Biologie": "#00d084",
      "Geschichte": "#ffa94d",
      "Chemie": "#a78bfa",
      "Französisch": "#3b82f6",
    };
    return colorMap[subject] || "#618cff";
  };

  const color = getSubjectColor(activeSubject);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (openDropdown && !target.closest('.dropdown-chip')) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  // Render dropdown menu
  const renderDropdown = (options: string[], active: string, onChange: (val: string) => void, level: string, buttonRef: HTMLButtonElement | null) => {
    if (openDropdown !== level || !buttonRef) return null;
    
    const rect = buttonRef.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Calculate max dropdown height (leave 20px padding top and bottom)
    const maxDropdownHeight = 320;
    const spaceBelow = viewportHeight - rect.bottom - 20;
    const spaceAbove = rect.top - 20;
    
    // Decide whether to open upwards or downwards
    const openUpwards = spaceBelow < 200 && spaceAbove > spaceBelow;
    
    // Calculate actual dropdown height
    const dropdownHeight = Math.min(maxDropdownHeight, openUpwards ? spaceAbove : spaceBelow);
    
    // Calculate horizontal position - prefer left-aligned with button
    const dropdownMinWidth = Math.max(rect.width, 240);
    const dropdownMaxWidth = Math.min(viewportWidth - 32, 340); // 16px padding on each side
    const dropdownWidth = Math.min(dropdownMinWidth, dropdownMaxWidth);
    
    // Start with button's left position
    let left = rect.left;
    
    // Adjust if dropdown would go off-screen on the right
    if (left + dropdownWidth > viewportWidth - 16) {
      left = Math.max(16, viewportWidth - 16 - dropdownWidth);
    }
    
    // Ensure minimum left padding
    if (left < 16) {
      left = 16;
    }
    
    // Render dropdown via Portal to escape transform context (Safari fix!)
    const dropdownElement = (
      <div 
        className="fixed z-[200] rounded-xl border border-white/[0.12] bg-[#141414] overflow-y-auto scrollbar-thin"
        style={{
          top: openUpwards ? 'auto' : `${rect.bottom + 10}px`,
          bottom: openUpwards ? `${viewportHeight - rect.top + 10}px` : 'auto',
          left: `${left}px`,
          width: `${dropdownWidth}px`,
          maxHeight: `${dropdownHeight}px`,
        }}
      >
        {options.map((option) => {
          // "Alle" ist aktiv wenn: active === "Alle" ODER active === "" (initial state)
          const isActive = active === option || (option === 'Alle' && active === '');
          const isHovered = hoveredOption === option;
          const isTruncated = option.length > 50; // Wenn länger als 50 Zeichen
          
          return (
            <div key={option} className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(option);
                  setOpenDropdown(null);
                  setHoveredOption(null);
                }}
                onMouseEnter={() => setHoveredOption(option)}
                onMouseLeave={() => setHoveredOption(null)}
                className="w-full text-left font-['Poppins:Medium',sans-serif] transition-all duration-200 relative"
                style={{
                  padding: '12px 16px',
                  fontSize: '13px',
                  lineHeight: '1.35',
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.6)',
                  background: isActive ? `linear-gradient(90deg, ${color}20, transparent)` : 'transparent',
                  borderLeft: isActive ? `3px solid ${color}` : 'none',
                  paddingLeft: isActive ? '13px' : '16px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span 
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {option}
                </span>
              </button>
              
              {/* Tooltip für lange Texte */}
              {isHovered && isTruncated && (
                <div 
                  className="fixed z-[250] rounded-lg border border-white/[0.15] bg-[#141414] pointer-events-none"
                  style={{
                    bottom: openUpwards ? 'auto' : `${viewportHeight - rect.bottom + dropdownHeight / 2}px`,
                    top: openUpwards ? `${rect.top + (spaceAbove - dropdownHeight) / 2}px` : 'auto',
                    left: `${Math.max(16, Math.min(left + dropdownWidth + 12, viewportWidth - 296))}px`,
                    maxWidth: '280px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    lineHeight: '1.4',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {option}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
    
    // Use Portal to render at document.body (escapes transform context!)
    return typeof document !== 'undefined' ? createPortal(dropdownElement, document.body) : null;
  };

  // Render a chip button with dropdown
  const renderChip = (
    label: string, 
    activeValue: string, 
    options: string[], 
    level: string, 
    onChange: (val: string) => void,
    buttonRef: HTMLButtonElement | null,
    setButtonRef: (ref: HTMLButtonElement | null) => void
  ) => {
    if (options.length === 0) return null;
    
    // ✅ Disable "Alle Fächer" chip when there are no items at all
    const isDisabled = !hasAnyItems && level === 'subject';
    
    // CHIP: Nur farbig wenn ein konkreter Wert ausgewählt wurde (nicht "Alle" und nicht leer)
    const isActive = activeValue !== '' && activeValue !== 'Alle' && activeValue !== 'Alle Fächer' && activeValue !== 'All';
    
    // Display logic: Map "All" → "Alle Fächer" for Subject
    let displayLabel: string;
    if (level === 'subject' && activeValue === 'All') {
      displayLabel = 'Alle Fächer';
    } else if (activeValue && activeValue !== 'Alle' && activeValue !== 'All') {
      displayLabel = activeValue;
    } else {
      displayLabel = label;
    }
    const isTruncated = displayLabel.length > 30;
    if (isTruncated) {
      displayLabel = displayLabel.substring(0, 30) + '...';
    }
    
    return (
      <div key={level} className="dropdown-chip relative flex-shrink-0">
        <button
          ref={setButtonRef}
          onClick={(e) => {
            e.stopPropagation();
            if (!isDisabled) {
              setOpenDropdown(openDropdown === level ? null : level);
            }
          }}
          disabled={isDisabled}
          className="relative flex items-center justify-center gap-2 h-[38px] px-[20px] rounded-[10px] border transition-all duration-200 shrink-0"
          style={{
            backgroundColor: isActive ? `${color}25` : 'rgba(255, 255, 255, 0.02)',
            borderColor: isActive ? `${color}40` : 'rgba(255, 255, 255, 0.06)',
            overflow: 'hidden',
            opacity: isDisabled ? 0.5 : 1,
            cursor: isDisabled ? 'not-allowed' : 'pointer'
          }}
        >
          {/* Inner Glow - wie FlashcardItem Badge */}
          {isActive && (
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${color}50, transparent 70%)`,
                borderRadius: '10px'
              }}
            />
          )}
          <span 
            className="relative z-10 font-['Poppins:Medium',sans-serif] whitespace-nowrap overflow-hidden text-ellipsis" 
            style={{ 
              fontSize: '13px',
              color: isActive ? 'white' : 'rgba(255, 255, 255, 0.65)',
              lineHeight: 'normal',
              maxWidth: '180px',
            }}
          >
            {displayLabel}
          </span>
          {!isDisabled && (
            <svg 
              className="transition-transform duration-200 flex-shrink-0" 
              width="12" 
              height="12" 
              viewBox="0 0 12 12" 
              fill="none"
              style={{
                transform: openDropdown === level ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <path 
                d="M3 4.5L6 7.5L9 4.5" 
                stroke={isActive ? color : 'rgba(255, 255, 255, 0.4)'} 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        {renderDropdown(options, activeValue, onChange, level, buttonRef)}
      </div>
    );
  };

  return (
    <div 
      className="mobile-subject-chips flex items-center gap-3 overflow-x-scroll px-4 scrollbar-hide" 
      style={{ 
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <style>{`
        .mobile-subject-chips::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Subject Chip - Always visible */}
      {renderChip('Fach', activeSubject, subjects, 'subject', onSubjectChange, subjectButtonRef, setSubjectButtonRef)}
      
      {/* Kategorie Chip - Shows when subject is selected (hidden in "Eigene" tab) */}
      {!showOnlySubject && kategorien.length > 0 && renderChip('Kategorie', activeKategorie, kategorien, 'kategorie', onKategorieChange, kategorieButtonRef, setKategorieButtonRef)}
      
      {/* Thema Chip - Shows when kategorie is selected (hidden in "Eigene" tab) */}
      {!showOnlySubject && themen.length > 0 && renderChip('Thema', activeThema, themen, 'thema', onThemaChange, themaButtonRef, setThemaButtonRef)}
      
      {/* Unterthema Chip - Shows when thema is selected (hidden in "Eigene" tab) */}
      {!showOnlySubject && unterthemen.length > 0 && renderChip('Unterthema', activeUnterthema, unterthemen, 'unterthema', onUnterthemaChange, unterthemaButtonRef, setUnterthemaButtonRef)}
    </div>
  );
}