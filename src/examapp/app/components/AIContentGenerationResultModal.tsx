import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import SubjectIcon from './SubjectIcon';
import { subjects } from '../data/subjects';
import Button from '@/app/components/Button';

type Subtopic = {
  name: string;
  isNew: boolean;
};

type Topic = {
  name: string;
  isNew: boolean;
  subtopics: Subtopic[];
};

type Category = {
  name: string;
  isNew: boolean;
  topics: Topic[];
};

type AIContentGenerationResultModalProps = {
  isOpen: boolean;
  content: {
    categories: Category[];
  } | null;
  subjectId: string;
  onClose: () => void;
};

export default function AIContentGenerationResultModal({ 
  isOpen, 
  content,
  subjectId,
  onClose 
}: AIContentGenerationResultModalProps) {
  if (!content) return null;

  // DEBUG: Log raw content to console
  console.log('🔍 AIContentGenerationResultModal RAW content:', JSON.stringify(content, null, 2));
  
  // Safety check: Ensure content has correct structure
  if (!content || typeof content !== 'object') {
    console.error('❌ Content is null or not an object:', content);
    return null;
  }
  
  // ✅ TRANSFORMIERE AIGenerationResult → Component-Datenstruktur
  let categories: Category[];
  
  // Check if content has the NEW structure { categories: [...] }
  if ('categories' in content && Array.isArray(content.categories)) {
    // NEW structure - use as is
    categories = content.categories;
    console.log('✅ Using NEW structure');
  } else {
    // OLD/UNKNOWN structure - try to extract data
    console.warn('⚠️ OLD or UNKNOWN structure detected, attempting transformation...');
    
    // Try to extract category data from various possible structures
    const anyContent = content as any;
    
    categories = [
      {
        name: anyContent.categoryName || anyContent.category?.name || 'Unbekannt',
        isNew: anyContent.isNewCategory ?? anyContent.category?.isNew ?? true,
        topics: []
      }
    ];
    
    // Try to extract topics
    if (anyContent.topicName) {
      // Single topic from old structure
      const subtopicNames = anyContent.subtopics || [];
      categories[0].topics = [{
        name: anyContent.topicName,
        isNew: anyContent.isNewTopic ?? anyContent.topicIsAIGenerated ?? true,
        subtopics: subtopicNames.map((name: string) => ({
          name: name,
          isNew: true
        }))
      }];
    } else if (anyContent.topics && Array.isArray(anyContent.topics)) {
      // Already has topics array
      categories[0].topics = anyContent.topics;
    } else {
      categories[0].topics = [];
    }
    
    console.log('🔄 Transformed to:', { categories });
  }

  // Safety check: Ensure category and topics exist
  if (!categories || categories.length === 0) {
    console.error('❌ Invalid content structure after transformation:', content);
    return null;
  }

  // ✅ Get subject name from subjectId
  const subject = subjects.find(s => s.id === subjectId);
  const subjectName = subject?.name || 'Unbekannt';

  // Generate description based on what was created
  const getDescription = () => {
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return 'Neue Inhalte wurden erstellt';
    }

    const newTopicsCount = categories.reduce((sum, category) => 
      sum + category.topics.filter(t => t.isNew).length, 0
    );
    const totalSubtopicsCount = categories.reduce((sum, category) => 
      sum + category.topics.reduce((sum, topic) => 
        sum + (topic.subtopics || []).length, 0
      ), 0
    );
    const newSubtopicsCount = categories.reduce((sum, category) => 
      sum + category.topics.reduce((sum, topic) => 
        sum + (topic.subtopics || []).filter(st => st.isNew).length, 0
      ), 0
    );

    if (newTopicsCount > 0) {
      // Neue Themen wurden hinzugefügt
      return `${newTopicsCount === 1 ? 'Ein neues Thema' : `${newTopicsCount} neue Themen`} mit ${newSubtopicsCount} ${newSubtopicsCount === 1 ? 'Unterthema' : 'Unterthemen'} wurde${newTopicsCount === 1 ? '' : 'n'} hinzugefügt`;
    } else {
      // Nur Unterthemen wurden hinzugefügt
      return `${newSubtopicsCount} neue ${newSubtopicsCount === 1 ? 'Unterthema wurde' : 'Unterthemen wurden'} hinzugefügt`;
    }
  };

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
              <div className="w-10 h-10 rounded-full bg-[#009379]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#009379]" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h2 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white leading-tight">
                  Erfolgreich erstellt!
                </h2>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#979797] mt-1">
                  {getDescription()}
                </p>
              </div>
            </div>

            {/* Content Hierarchy - Scrollable */}
            <div className="flex-1 overflow-y-auto mb-5 space-y-3">
              {/* ✅ FACH - GANZ OBEN */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-white/[0.08]" />
                <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797] uppercase tracking-wide">
                  Fach
                </span>
                <div className="h-px flex-1 bg-white/[0.08]" />
              </div>

              {/* Subject Card */}
              <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[12px] p-3">
                <div className="flex items-center gap-3">
                  <div className="w-[28px] h-[28px] flex items-center justify-center flex-shrink-0">
                    <SubjectIcon subjectId={subjectId} />
                  </div>
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white flex-1">
                    {subjectName}
                  </p>
                </div>
              </div>

              {/* Category Header */}
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-white/[0.08]" />
                <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#979797] uppercase tracking-wide">
                  Kategorie
                </span>
                <div className="h-px flex-1 bg-white/[0.08]" />
              </div>

              {/* Category Card */}
              {categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-gradient-to-br from-white/[0.08] to-white/[0.04] border border-white/[0.12] rounded-[12px] p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white flex-1">
                      {category.name}
                    </p>
                    {category.isNew && (
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

                      {category.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="bg-gradient-to-br from-white/[0.06] to-white/[0.03] border border-white/[0.10] rounded-[10px] p-2.5">
                          {/* Topic Name */}
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-['Poppins:Medium',sans-serif] text-[14px] text-white flex-1">
                              {topic.name}
                            </p>
                            {topic.isNew && (
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

                              {topic.subtopics.map((subtopic, subtopicIndex) => (
                                <div 
                                  key={subtopicIndex}
                                  className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/[0.08] rounded-[8px] px-2.5 py-2 flex items-center gap-2"
                                >
                                  <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#d1d1d1] flex-1">
                                    {subtopic.name}
                                  </p>
                                  {subtopic.isNew && (
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
              ))}
            </div>

            {/* Schließen Button */}
            <Button onClick={onClose}>
              Schließen
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}