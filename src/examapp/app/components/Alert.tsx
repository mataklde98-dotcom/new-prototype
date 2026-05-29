import { motion, AnimatePresence } from 'motion/react';
import Button from '@/app/components/Button';

type AlertProps = {
  show: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export default function Alert({ show, title, message, onClose }: AlertProps) {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center"
            onClick={onClose}
          >
            {/* Alert Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-[#141414] border border-white/[0.12] rounded-[16px] p-6 mx-6 max-w-[340px] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-white mb-2">
                {title}
              </h2>
              <p className="font-['Poppins:Regular',sans-serif] text-[15px] text-[#979797] mb-6 leading-[22px]">
                {message}
              </p>
              <Button onClick={onClose}>
                OK
              </Button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}