import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BRAND_LOGO_PATH } from '../data/images';

export const SplashLoader: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 950);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-[#070B16]"
          aria-hidden="true"
        >
          <div className="relative flex flex-col items-center">
            <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-[#0A5CFF]/25 via-[#19C3FF]/20 to-transparent blur-2xl animate-pulse" />
            <motion.img
              src={BRAND_LOGO_PATH}
              alt="PRIME COMPUTER ACCESSORIES"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-20 sm:h-24 w-auto object-contain rounded-2xl bg-white p-2 shadow-[0_20px_60px_rgba(10,92,255,0.16)]"
            />
            <div className="relative mt-6 h-1 w-36 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.85, ease: 'easeInOut' }}
                className="h-full w-full bg-gradient-to-r from-[#0A5CFF] to-[#19C3FF]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
