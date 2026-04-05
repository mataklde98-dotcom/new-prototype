import { motion } from 'motion/react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Three animated dots */}
      <div className="flex gap-3">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-[#009379] rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Loading text with pulse */}
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <p className="font-['Poppins:Medium',sans-serif] text-[15px] text-[#979797]">
          Inhalte werden geladen
        </p>
      </motion.div>
    </div>
  );
}
