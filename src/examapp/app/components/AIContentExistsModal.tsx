import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Sparkles } from 'lucide-react';
import Button from '@/app/components/Button';

type ExistingContent = {
  categories?: Array<{
    id: string;
    name: string;
    aiGenerated: boolean;
    topics?: Array<{
      id: string;
      name: string;
      aiGenerated: boolean;
      subtopics?: Array<{
        id: string;
        name: string;
        aiGenerated: boolean;
      }>;
    }>;
  }>;
};

type AIContentExistsModalProps = {
  isOpen: boolean;
  content: ExistingContent | null;
  onClose: () => void;
};

export default function AIContentExistsModal({ 
  isOpen, 
  content,
  onClose 
}: AIContentExistsModalProps) {
  if (!isOpen || !content || !content.categories || content.categories.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="bg-[#141414] border border-white/[0.12] rounded-[16px] p-6 max-w-[420px] w-full max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-5 flex-shrink-0">
              <div className="mt-0.5">
                <AlertCircle className="size-6 text-[#FF9500]" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h2 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white leading-tight">
                  Content existiert bereits
                </h2>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#979797] mt-1">
                  Der eingegebene Inhalt ist bereits in folgender Struktur vorhanden:
                </p>
              </div>
            </div>

            {/* Content Hierarchy - Scrollable */}
            <div className="flex-1 overflow-y-auto mb-5 space-y-5">
              {content.categories.map((category, catIndex) => (
                <div key={category.id} className="space-y-3">
                  {/* Category Header */}
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-white/[0.08]" />
                    <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797] uppercase tracking-wide">
                      {content.categories!.length > 1 ? `Kategorie ${catIndex + 1}` : 'Kategorie'}
                    </span>
                    <div className="h-px flex-1 bg-white/[0.08]" />
                  </div>

                  {/* Category Card */}
                  <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[12px] p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white flex-1">
                        {category.name}
                      </p>
                      {category.aiGenerated && (
                        <Sparkles className="w-[18px] h-[18px] text-[#FFD700]" strokeWidth={2.5} fill="#FFD700" />
                      )}
                    </div>

                    {/* Topics */}
                    {category.topics && category.topics.length > 0 && (
                      <div className="space-y-2">
                        {/* Themen Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-px flex-1 bg-white/[0.08]" />
                          <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-[#979797] uppercase tracking-wide">
                            Themen
                          </span>
                          <div className="h-px flex-1 bg-white/[0.08]" />
                        </div>

                        {category.topics.map((topic) => (
                          <div key={topic.id} className="bg-gradient-to-br from-white/[0.06] to-white/[0.03] border border-white/[0.10] rounded-[10px] p-2.5">
                            {/* Topic Name */}
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white flex-1">
                                {topic.name}
                              </p>
                              {topic.aiGenerated && (
                                <Sparkles className="w-[16px] h-[16px] text-[#FFD700]" strokeWidth={2.5} fill="#FFD700" />
                              )}
                            </div>

                            {/* Subtopics */}
                            {topic.subtopics && topic.subtopics.length > 0 && (
                              <div className="space-y-1.5 pl-3 border-l-2 border-white/[0.08]">
                                {/* Unterthemen Header */}
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="h-px flex-1 bg-white/[0.08]" />
                                  <span className="font-['Poppins:Medium',sans-serif] text-[9px] text-[#707070] uppercase tracking-wide">
                                    Unterthemen
                                  </span>
                                  <div className="h-px flex-1 bg-white/[0.08]" />
                                </div>

                                {topic.subtopics.map((subtopic) => (
                                  <div 
                                    key={subtopic.id}
                                    className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-[8px] px-2.5 py-2 flex items-center gap-2"
                                  >
                                    <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#d1d1d1] flex-1">
                                      {subtopic.name}
                                    </p>
                                    {subtopic.aiGenerated && (
                                      <Sparkles className="w-[14px] h-[14px] text-[#FFD700]" strokeWidth={2.5} fill="#FFD700" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Verstanden Button */}
            <Button onClick={onClose}>
              Verstanden
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}