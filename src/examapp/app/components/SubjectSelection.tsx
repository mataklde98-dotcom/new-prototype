import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LoadingSpinner from './LoadingSpinner';
import { type Subject } from '../data/subjects';
import SubjectIcon from './SubjectIcon';
import CloseButton from '@/app/components/CloseButton';

type SubjectSelectionProps = {
  subjects: Subject[]; // Now passed as prop (dynamically loaded)
  onSelectSubject: (subject: Subject) => void;
  onClose?: () => void;
  isLoading?: boolean;
  title?: string; // Dynamic title for different features
  mode?: 'exam' | 'generate'; // Mode for different selection behaviors
};

export default function SubjectSelection({ subjects, onSelectSubject, onClose, isLoading, title = 'Prüfungssimulation', mode = 'exam' }: SubjectSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSelectSubject = (subject: Subject) => {
    onSelectSubject(subject);
  };

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <div className="size-full flex flex-col bg-[#0a0a0a] overscroll-none relative">
      {/* Loading overlay removed — content renders instantly */}

      {/* Header - STATIC */}
      <div className="px-6 py-3 flex-shrink-0 pt-safe lg:mt-[20px] mt-3">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="font-['Poppins:SemiBold',sans-serif] text-[16px] lg:text-[15px] text-white mb-1">
              {title}
            </h1>
            <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[13px] text-[#979797]">
              Wähle ein Fach
            </p>
          </div>
          {onClose && (
            <CloseButton onClick={onClose} />
          )}
        </div>
      </div>

      {/* Filters - STATIC */}
      <div className="px-6 mb-5 flex gap-2.5 flex-shrink-0">
        <div className="relative bg-white/[0.05] border border-white/[0.08] h-[38px] rounded-xl px-3.5 flex items-center gap-2.5 w-[160px]"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <svg className="w-[15px] h-[7px] flex-shrink-0 opacity-40" fill="none" viewBox="0 0 18.5 9.5">
            <path d="M0.75 0.75H17.75" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
            <path d="M4.81522 8.75H13.6848" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
            <path d="M2.59783 4.75H15.9022" stroke="white" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
          <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/80 whitespace-nowrap">Fächer</p>
        </div>
        
        <div className="relative bg-white/[0.05] border border-white/[0.08] h-[38px] rounded-xl px-3.5 flex-1 flex items-center gap-2.5 overflow-hidden"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <svg className="size-[15px] flex-shrink-0" fill="none" viewBox="0 0 16 16">
            <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#666" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M14 14L11.1 11.1" stroke="#666" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Suche"
            className="flex-1 min-w-0 bg-transparent font-['Poppins:Regular',sans-serif] text-[13px] text-white placeholder:text-white/25 outline-none"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="flex-shrink-0 p-1 transition-opacity"
            >
              <svg className="size-[11px]" fill="none" viewBox="0 0 12 12">
                <path d="M2 2L10 10M10 2L2 10" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Subject List */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto overscroll-none relative">
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredSubjects.length === 0 ? (
            searchQuery ? (
              <div className="text-center py-12">
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/25">
                  Keine Fächer gefunden
                </p>
              </div>
            ) : null
          ) : (
            <div className="rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden">
              {filteredSubjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors duration-150 active:bg-white/[0.04] relative ${
                    index < filteredSubjects.length - 1 ? '' : ''
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => handleSelectSubject(subject)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectSubject(subject);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                >
                  <div className="w-[24px] h-[24px] flex items-center justify-center flex-shrink-0">
                    <SubjectIcon subjectId={subject.id} />
                  </div>
                  <p className="font-['Poppins:Medium',sans-serif] text-[14px] lg:text-[15px] text-white flex-1 leading-[22px]">
                    {subject.name}
                  </p>
                  <svg className="w-[7px] h-[12px] flex-shrink-0" fill="none" viewBox="0 0 7 12">
                    <path d="M1 1L5.5 6L1 11" stroke="#8E8E93" strokeLinecap="round" strokeWidth="1.5" />
                  </svg>
                  {/* Divider */}
                  {index < filteredSubjects.length - 1 && (
                    <div className="absolute bottom-0 left-4 right-0 h-px bg-white/[0.08]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}