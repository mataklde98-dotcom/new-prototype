import React from 'react';
import { GraduationCap, BookOpen, FileText } from 'lucide-react';
import Checkbox from '@/app/components/Checkbox';

interface TodoFilterPopupProps {
  filters: {
    nachhilfe: boolean;
    karteikarten: boolean;
    prufung: boolean;
  };
  onFilterChange: (filterName: 'nachhilfe' | 'karteikarten' | 'prufung') => void;
  onClose: () => void;
}

export default function TodoFilterPopup({ filters, onFilterChange, onClose }: TodoFilterPopupProps) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[99]" 
        onClick={onClose}
      />
      
      {/* Popup */}
      <div
        className="absolute right-0 top-full mt-2 min-w-[240px] z-[100] rounded-2xl border border-white/[0.12] bg-[#141414]"
        style={{
          animation: 'fadeSlideIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/[0.08]">
          <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter-Modus
          </p>
        </div>

        {/* Filter Options */}
        <div className="py-2">
          {/* Nachhilfe */}
          <button
            onClick={() => onFilterChange('nachhilfe')}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left font-['Poppins:Medium',sans-serif] text-[14px] text-white/70 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
          >
            <Checkbox checked={filters.nachhilfe} />
            <GraduationCap className="w-5 h-5" />
            <span>Nachhilfe</span>
          </button>

          {/* Karteikarten */}
          <button
            onClick={() => onFilterChange('karteikarten')}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left font-['Poppins:Medium',sans-serif] text-[14px] text-white/70 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
          >
            <Checkbox checked={filters.karteikarten} />
            <BookOpen className="w-5 h-5" />
            <span>Karteikarten</span>
          </button>

          {/* Prüfung */}
          <button
            onClick={() => onFilterChange('prufung')}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left font-['Poppins:Medium',sans-serif] text-[14px] text-white/70 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
          >
            <Checkbox checked={filters.prufung} />
            <FileText className="w-5 h-5" />
            <span>Prüfung</span>
          </button>
        </div>
      </div>
    </>
  );
}