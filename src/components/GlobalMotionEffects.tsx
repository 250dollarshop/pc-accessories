import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useStore } from '../context/StoreContext';

export const GlobalMotionEffects: React.FC = () => {
  const { flyEvent } = useStore();
  const prefersReducedMotion = useReducedMotion();

  // Top scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  // Desktop custom soft blue cursor glow (disabled on touch devices & reduced motion)
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothX = useSpring(cursorX, { stiffness: 320, damping: 28 });
  const smoothY = useSpring(cursorY, { stiffness: 320, damping: 28 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;
    setCursorEnabled(true);

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [prefersReducedMotion, cursorX, cursorY]);

  // Compute cart icon target coords for flying arc
  const [targetCoords, setTargetCoords] = useState<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth - 52 : 320,
    y: 44,
  });

  useEffect(() => {
    if (!flyEvent) return;
    const el = document.querySelector('[data-cart-target="true"]');
    if (el) {
      const r = el.getBoundingClientRect();
      setTargetCoords({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
  }, [flyEvent]);

  return (
    <>
      {/* 1. Thin Blue Top Scroll Progress Bar */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX, transformOrigin: '0% 50%' }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-gradient-to-r from-[#1F5BFF] via-[#19C3FF] to-[#1F5BFF] pointer-events-none"
      />

      {/* 2. Desktop Soft Blue Cursor Glow */}
      {cursorEnabled && !prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          style={{ x: smoothX, y: smoothY }}
          className="hidden lg:block fixed top-0 left-0 w-10 h-10 rounded-full bg-[#1F5BFF]/14 dark:bg-[#19C3FF]/18 blur-md pointer-events-none z-[55]"
        />
      )}

      {/* 3. Curved Arc Flying Product Thumbnail to Cart */}
      <AnimatePresence>
        {flyEvent && !prefersReducedMotion && (
          <motion.img
            key={flyEvent.id}
            src={flyEvent.image}
            alt=""
            aria-hidden="true"
            initial={{
              x: flyEvent.startX - 24,
              y: flyEvent.startY - 24,
              scale: 1,
              opacity: 0.95,
              rotate: 0,
            }}
            animate={{
              x: [
                flyEvent.startX - 24,
                (flyEvent.startX + targetCoords.x) / 2 - 20,
                targetCoords.x - 16,
              ],
              y: [
                flyEvent.startY - 24,
                Math.min(flyEvent.startY, targetCoords.y) - 90,
                targetCoords.y - 16,
              ],
              scale: [1, 0.72, 0.25],
              opacity: [0.95, 0.9, 0.1],
              rotate: [0, 12, 24],
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed top-0 left-0 w-12 h-12 rounded-xl object-cover shadow-xl border-2 border-[#1F5BFF] pointer-events-none z-[70]"
          />
        )}
      </AnimatePresence>
    </>
  );
};
