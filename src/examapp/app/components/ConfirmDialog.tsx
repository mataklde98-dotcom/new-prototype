import { motion, AnimatePresence } from 'motion/react';
import Button from '@/app/components/Button';

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Ja',
  cancelText = 'Nein'
}: ConfirmDialogProps) {
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
            className="fixed lg:absolute inset-0 bg-black/60 z-50 flex items-center justify-center px-6"
            onClick={onCancel}
          >
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#141414] border border-white/[0.12] rounded-[16px] p-6 lg:p-5 w-full max-w-[360px] lg:max-w-[280px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <h2 className="font-['Poppins:SemiBold',sans-serif] text-white text-[18px] lg:text-[15px] mb-3 lg:mb-2.5">
                {title}
              </h2>
              
              {/* Message */}
              <p className="font-['Poppins:Regular',sans-serif] text-[rgba(255,255,255,0.7)] text-[14px] lg:text-[12px] leading-[22px] lg:leading-[18px] mb-6 lg:mb-4">
                {message}
              </p>
              
              {/* Buttons */}
              <div className="flex gap-3 lg:gap-2">
                <Button
                  fullWidth={false}
                  className="flex-1"
                  onClick={onCancel}
                >
                  {cancelText}
                </Button>
                <Button
                  fullWidth={false}
                  className="flex-1"
                  onClick={onConfirm}
                >
                  {confirmText}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}