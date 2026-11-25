import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { BRAND_LOGO_PATH } from '../data/images';
import { useStore } from '../context/StoreContext';

export const RoamingLogoWatermark: React.FC = () => {
  const { theme } = useStore();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isOverDarkSection, setIsOverDarkSection] = useState(false);

  // Scroll choreography across page sections (Hero top-right -> Categories left -> Flash Deals center -> Products right -> Footer left)
  const { scrollYProgress } = useScroll();
  const rawScrollX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.38, 0.58, 0.8, 1],
    ['22vw', '-22vw', '0vw', '22vw', '10vw', '-22vw']
  );
  const rawScrollY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.38, 0.58, 0.8, 1],
    ['-16vh', '-4vh', '2vh', '4vh', '6vh', '10vh']
  );

  // Smooth spring lag for subtle parallax (slower than page content)
  const scrollX = useSpring(rawScrollX, { stiffness: 40, damping: 20 });
  const scrollY = useSpring(rawScrollY, { stiffness: 40, damping: 20 });

  // Secondary smaller logo moves in opposite direction at a different speed
  const rawSecondX = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['-26vw', '20vw', '-18vw', '24vw', '16vw']
  );
  const rawSecondY = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['18vh', '-14vh', '12vh', '-10vh', '-18vh']
  );
  const secondX = useSpring(rawSecondX, { stiffness: 30, damping: 22 });
  const secondY = useSpring(rawSecondY, { stiffness: 30, damping: 22 });

  // Subtle 3D tilt following mouse on desktop (capped at ±6 degrees)
  const mouseTiltX = useMotionValue(0);
  const mouseTiltY = useMotionValue(0);
  const smoothTiltX = useSpring(mouseTiltX, { stiffness: 110, damping: 20 });
  const smoothTiltY = useSpring(mouseTiltY, { stiffness: 110, damping: 20 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    setIsFinePointer(fine);
    if (!fine || prefersReducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mouseTiltY.set(nx * 12); // -6 to +6 deg
      mouseTiltX.set(-ny * 12); // -6 to +6 deg
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [prefersReducedMotion, mouseTiltX, mouseTiltY]);

  // Detect whether the viewport band is currently over a dark-navy section (dark hero slide, flash deals, footer)
  useEffect(() => {
    let rafId = 0;

    const checkDarkOverlap = () => {
      rafId = 0;
      if (theme === 'dark') {
        setIsOverDarkSection(true);
        return;
      }
      const probeY = window.innerHeight * 0.48;
      const darkEls = document.querySelectorAll('[data-watermark-dark="true"]');
      let overlapping = false;
      for (let i = 0; i < darkEls.length; i++) {
        const rect = darkEls[i].getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom >= probeY) {
          overlapping = true;
          break;
        }
      }
      setIsOverDarkSection(overlapping);
    };

    const scheduleCheck = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(checkDarkOverlap);
      }
    };

    checkDarkOverlap();
    window.addEventListener('scroll', scheduleCheck, { passive: true });
    window.addEventListener('resize', scheduleCheck, { passive: true });

    // Observe data-watermark-dark attribute toggles (e.g. hero auto-advancing to dark slide)
    const observer = new MutationObserver(scheduleCheck);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-watermark-dark'],
    });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleCheck);
      window.removeEventListener('resize', scheduleCheck);
      observer.disconnect();
    };
  }, [theme, location.pathname, location.search]);

  const useDarkWatermark = theme === 'dark' || isOverDarkSection;

  // Reduced-motion static fallback (single logo at 5% opacity, zero drift/tilt)
  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[1] pointer-events-none select-none overflow-hidden flex items-center justify-center"
      >
        <img
          src={BRAND_LOGO_PATH}
          alt=""
          className={`w-[260px] md:w-[460px] h-auto object-contain opacity-[0.05] ${
            useDarkWatermark
              ? '[filter:invert(1)_hue-rotate(180deg)_contrast(1.1)] mix-blend-screen'
              : 'mix-blend-multiply'
          }`}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none select-none overflow-hidden flex items-center justify-center"
    >
      {/* Primary Roaming Logo + Soft Blue Radial Glow */}
      <motion.div
        style={{
          x: scrollX,
          y: scrollY,
          perspective: 1000,
          willChange: 'transform',
        }}
        className="relative flex items-center justify-center"
      >
        <div className="animate-roam-primary flex items-center justify-center">
          <motion.div
            style={
              isFinePointer
                ? {
                    rotateX: smoothTiltX,
                    rotateY: smoothTiltY,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }
                : undefined
            }
            className="relative flex items-center justify-center"
          >
            {/* Soft blue radial glow (#1F5BFF at 8% opacity) following the logo */}
            <div
              className="pointer-events-none absolute -inset-[22%] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(31,91,255,0.08) 0%, rgba(25,195,255,0.03) 50%, transparent 72%)',
              }}
            />

            <img
              src={BRAND_LOGO_PATH}
              alt=""
              className={`relative w-[260px] md:w-[460px] lg:w-[500px] h-auto object-contain transition-[opacity,filter] duration-500 ${
                useDarkWatermark
                  ? 'opacity-[0.06] [filter:invert(1)_hue-rotate(180deg)_contrast(1.1)] mix-blend-screen'
                  : 'opacity-[0.085] mix-blend-multiply'
              }`}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Secondary Smaller Copy (180px, 5% opacity, opposite direction, desktop/tablet only) */}
      <motion.div
        style={{
          x: secondX,
          y: secondY,
          willChange: 'transform',
        }}
        className="hidden md:flex absolute items-center justify-center"
      >
        <div className="animate-roam-secondary">
          <img
            src={BRAND_LOGO_PATH}
            alt=""
            className={`w-[180px] h-auto object-contain transition-[opacity,filter] duration-500 ${
              useDarkWatermark
                ? 'opacity-[0.045] [filter:invert(1)_hue-rotate(180deg)_contrast(1.1)] mix-blend-screen'
                : 'opacity-[0.05] mix-blend-multiply'
            }`}
          />
        </div>
      </motion.div>
    </div>
  );
};
