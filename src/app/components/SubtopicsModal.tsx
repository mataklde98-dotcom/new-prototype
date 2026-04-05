import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, List } from 'lucide-react';

interface SubtopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtopics: string[];
  topicName: string;
  subjectName: string;
  badgeNumber?: number | null;
}

export default function SubtopicsModal({ isOpen, onClose, subtopics, topicName, subjectName, badgeNumber }: SubtopicsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[9998]"
            style={{
              WebkitTapHighlightColor: 'transparent'
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] z-[9999]"
            style={{
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <div 
              className="bg-gradient-to-br from-[#1e1e1e] to-[#0a0a0a] rounded-3xl border border-white/[0.12] overflow-hidden"
            >
              {/* Header */}
              <div className="relative px-6 py-5 border-b border-white/[0.08]">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/[0.06] border border-white/[0.08]">
                    <List className="size-[20px] text-[#4cadfd]" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white leading-[22px] mb-1">
                      Unterthemen
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#979797] leading-[16px]">
                        {subjectName} •{' '}
                        {badgeNumber && (
                          <span 
                            className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] font-['Poppins:SemiBold',sans-serif] mr-1"
                            style={{
                              backgroundColor: 'rgba(255, 215, 0, 0.15)',
                              color: '#FFD700',
                              border: '1px solid rgba(255, 215, 0, 0.3)'
                            }}
                          >
                            #{badgeNumber}
                          </span>
                        )}
                        {topicName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.08] border border-white/[0.08] transition-all duration-200 active:scale-95"
                    style={{
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    <X className="size-[20px] text-[#979797]" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Subtopics List */}
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  {subtopics.map((subtopic, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200"
                    >
                      <div className="flex items-center justify-center size-[24px] rounded-full bg-[#4cadfd]/10 border border-[#4cadfd]/20 flex-shrink-0">
                        <span className="font-['Poppins:SemiBold',sans-serif] text-[11px] text-[#4cadfd]">
                          {index + 1}
                        </span>
                      </div>
                      <p className="flex-1 font-['Poppins:Medium',sans-serif] text-[13px] text-white/90 leading-[18px]">
                        {subtopic}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/[0.08] bg-white/[0.02]">
                <p className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#707070] text-center">
                  {subtopics.length} {subtopics.length === 1 ? 'Unterthema' : 'Unterthemen'}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
