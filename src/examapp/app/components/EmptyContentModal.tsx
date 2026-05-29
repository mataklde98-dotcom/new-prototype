import { motion, AnimatePresence } from 'motion/react';
import Button from '@/app/components/Button';

type EmptyContentModalProps = {
  isOpen: boolean;
  level: 'categories' | 'topics' | 'subtopics';
  onClose: () => void;
};

const messages = {
  categories: {
    title: 'Keine Kategorien verfügbar',
    description: 'Dieses Fach enthält zurzeit keine Kategorien. Bitte wähle ein anderes Fach aus.'
  },
  topics: {
    title: 'Keine Themen verfügbar',
    description: 'Diese Kategorie enthält zurzeit keine Themen. Bitte wähle eine andere Kategorie aus.'
  },
  subtopics: {
    title: 'Keine Unterthemen verfügbar',
    description: 'Dieses Thema enthält zurzeit keine Unterthemen. Bitte wähle ein anderes Thema aus.'
  }
};

export default function EmptyContentModal({ 
  isOpen, 
  level, 
  onClose 
}: EmptyContentModalProps) {
  const message = messages[level];
  
  console.log('📢 EmptyContentModal:', { isOpen, level, message });

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
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[340px] lg:w-[300px] max-w-[90vw] bg-[#141414] border border-white/[0.12] rounded-[14px] overflow-hidden p-5"
          >
            {/* Title */}
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[17px] lg:text-[15px] text-white text-center mb-3 lg:mb-2.5 leading-[1.25]">
              {message.title}
            </h2>

            {/* Description */}
            <p className="font-['Poppins:Regular',sans-serif] text-[13.5px] lg:text-[12px] text-[#b8b8b8] text-center mb-4 leading-[1.5]">
              {message.description}
            </p>

            {/* OK Button */}
            <Button onClick={onClose} size="sm">
              OK
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}