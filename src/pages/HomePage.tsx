import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck2,
  Gamepad2,
  HardDrive,
  Headphones,
  Keyboard,
  Laptop,
  Mail,
  MailOpen,
  MessageCircle,
  Monitor,
  Mouse,
  PackageOpen,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Star,
  Video,
  Wifi,
  Zap,
  Check,
} from 'lucide-react';
import { CATEGORIES, PRODUCTS, getProductBySlug } from '../data/catalog';
import {
  BRANDS_LIST,
  BUNDLE_DEALS,
  HERO_SLIDES,
  STORE_INFO,
  TESTIMONIALS,
  buildProductWhatsAppUrl,
  formatPKR,
} from '../data/storeContent';
import { useStore } from '../context/StoreContext';
import { SmartImage } from '../components/SmartImage';
import { ProductCard } from '../components/ProductCard';
import { Category, Product } from '../types/store';

const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  Keyboard: <Keyboard className="w-4 h-4" />,
  Mouse: <Mouse className="w-4 h-4" />,
  Headphones: <Headphones className="w-4 h-4" />,
  Monitor: <Monitor className="w-4 h-4" />,
  Laptop: <Laptop className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  HardDrive: <HardDrive className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Gamepad2: <Gamepad2 className="w-4 h-4" />,
  Wifi: <Wifi className="w-4 h-4" />,
};

/* -------------------------------------------------------------------------- */
/*  1. Count-Up Stat Card                                                     */
/* -------------------------------------------------------------------------- */
const CountUpStat: React.FC<{ target: number; suffix: string; label: string }> = ({
  target,
  suffix,
  label,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1100;
    const stepTime = 24;
    const totalSteps = Math.ceil(duration / stepTime);
    const increment = target / totalSteps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div
      ref={ref}
      className="rounded-[22px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-6 text-center shadow-[0_12px_32px_rgba(31,91,255,0.06)]"
    >
      <p className="font-mono-num text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] bg-clip-text text-transparent">
        {val.toLocaleString('en-PK')}
        {suffix}
      </p>
      <p className="mt-1.5 text-sm font-medium text-[#4B5563] dark:text-slate-300">
        {label}
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  2. 3D Tilt Category Tile                                                  */
/* -------------------------------------------------------------------------- */
const CategoryTiltTile: React.FC<{ cat: Category; idx: number }> = ({ cat, idx }) => {
  const prefersReducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothX = useSpring(rotateX, { stiffness: 260, damping: 24 });
  const smoothY = useSpring(rotateY, { stiffness: 260, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 10);
    rotateY.set(px * 10);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.38, delay: Math.min(idx * 0.04, 0.25) }}
      style={{ perspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={
          prefersReducedMotion
            ? undefined
            : { rotateX: smoothX, rotateY: smoothY, transformStyle: 'preserve-3d' }
        }
        className="h-full"
      >
        <Link
          to={`/shop?category=${cat.slug}`}
          className="group relative flex flex-col rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-3.5 shadow-[0_10px_30px_rgba(11,18,32,0.04)] hover:border-[#1F5BFF] hover:shadow-[0_22px_54px_rgba(31,91,255,0.16)] transition-all duration-200 h-full overflow-hidden"
        >
          <div className="relative aspect-[4/3] rounded-[16px] overflow-hidden bg-[#F3F7FF] dark:bg-[#070B16]">
            <SmartImage
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-2"
            />
            {/* Sliding bottom gradient overlay */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1F5BFF]/70 via-[#1F5BFF]/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex items-end p-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                Explore Gear
              </span>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[#1F5BFF] dark:text-[#19C3FF]">
                {CATEGORY_ICON_MAP[cat.iconName]}
                <span className="text-[11px] font-mono-num font-medium text-[#4B5563] dark:text-slate-400">
                  {cat.itemCount} Items
                </span>
              </div>
              <h3 className="mt-1 font-display text-sm sm:text-[15px] font-semibold text-[#0B1220] dark:text-white truncate">
                {cat.name}
              </h3>
            </div>
            <span className="w-8 h-8 rounded-full bg-[#F3F7FF] dark:bg-white/10 flex items-center justify-center text-[#1F5BFF] dark:text-[#19C3FF] shrink-0 group-hover:bg-[#1F5BFF] group-hover:text-white transition-all">
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*  3. SVG Stroke-Draw Icons for Why Choose Us                                */
/* -------------------------------------------------------------------------- */
const StrokeDrawIcon: React.FC<{ kind: 'shield' | 'box' | 'award' | 'truck' | 'headset' }> = ({
  kind,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const pathProps = prefersReducedMotion
    ? {}
    : {
        initial: { pathLength: 0, opacity: 0.4 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.85, ease: 'easeOut' as const },
      };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      {kind === 'shield' && (
        <>
          <motion.path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            {...pathProps}
          />
          <motion.path d="m9 12 2 2 4-4" {...pathProps} />
        </>
      )}
      {kind === 'box' && (
        <>
          <motion.path
            d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
            {...pathProps}
          />
          <motion.path d="m3.3 7 8.7 5 8.7-5" {...pathProps} />
          <motion.path d="M12 22V12" {...pathProps} />
        </>
      )}
      {kind === 'award' && (
        <>
          <motion.circle cx="12" cy="8" r="6" {...pathProps} />
          <motion.path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" {...pathProps} />
        </>
      )}
      {kind === 'truck' && (
        <>
          <motion.path
            d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"
            {...pathProps}
          />
          <motion.path d="M15 18H9" {...pathProps} />
          <motion.path
            d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"
            {...pathProps}
          />
          <motion.circle cx="17" cy="18" r="2" {...pathProps} />
          <motion.circle cx="7" cy="18" r="2" {...pathProps} />
        </>
      )}
      {kind === 'headset' && (
        <>
          <motion.path
            d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"
            {...pathProps}
          />
          <motion.path d="M21 16v2a4 4 0 0 1-4 4h-5" {...pathProps} />
        </>
      )}
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/*  4. Main HomePage Component                                                */
/* -------------------------------------------------------------------------- */
export const HomePage: React.FC = () => {
  const { addToCart, addBundleToCart, showToast } = useStore();
  const prefersReducedMotion = useReducedMotion();

  /* --- HERO CAROUSEL & 3D PARALLAX TILT --- */
  const [slideIdx, setSlideIdx] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const heroSectionRef = useRef<HTMLElement>(null);

  // Desktop mouse tilt
  const heroTiltX = useMotionValue(0);
  const heroTiltY = useMotionValue(0);
  const heroSmoothTiltX = useSpring(heroTiltX, { stiffness: 160, damping: 22 });
  const heroSmoothTiltY = useSpring(heroTiltY, { stiffness: 160, damping: 22 });

  // Mobile scroll tilt fallback
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end start'],
  });
  const mobileScrollRotateX = useTransform(heroScroll, [0, 1], [0, 8]);

  const [isFinePointer, setIsFinePointer] = useState(true);
  useEffect(() => {
    setIsFinePointer(window.matchMedia('(pointer: fine)').matches);
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion || !isFinePointer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    heroTiltY.set(px * 12);
    heroTiltX.set(-py * 8);
  };

  const handleHeroMouseLeave = () => {
    heroTiltX.set(0);
    heroTiltY.set(0);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
      setProgressKey((k) => k + 1);
    }, 5500);
    return () => clearInterval(timer);
  }, [slideIdx]);

  const goToSlide = (idx: number) => {
    setSlideIdx((idx + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgressKey((k) => k + 1);
  };

  const activeSlide = HERO_SLIDES[slideIdx];
  const isDarkSlide = activeSlide.theme === 'dark' || activeSlide.theme === 'ink';
  const headlineWords = useMemo(
    () => [
      ...activeSlide.headlinePrefix.split(' ').map((w) => ({ text: w, accent: false })),
      ...activeSlide.headlineAccent.split(' ').map((w) => ({ text: w, accent: true })),
    ],
    [activeSlide.headlinePrefix, activeSlide.headlineAccent]
  );

  /* --- PRODUCT PARADE (10 Showcase Items) --- */
  const paradeProducts = useMemo(() => PRODUCTS.slice(0, 10), []);

  /* --- FLASH SALE COUNTDOWN & AUTO-SCROLL SLIDER --- */
  const [secondsLeft, setSecondsLeft] = useState(2 * 86400 + 14 * 3600 + 38 * 60 + 45);
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 2 * 86400 + 14 * 3600));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  const flashProducts = useMemo(() => PRODUCTS.filter((p) => p.isFlashSale), []);
  const flashSliderRef = useRef<HTMLDivElement>(null);
  const [flashPaused, setFlashPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || flashPaused) return;
    const id = setInterval(() => {
      const el = flashSliderRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 10) return;
      if (el.scrollLeft >= maxScroll - 8) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 310, behavior: 'smooth' });
      }
    }, 3600);
    return () => clearInterval(id);
  }, [flashPaused, prefersReducedMotion]);

  /* --- SHOWCASE TABS --- */
  const [activeTab, setActiveTab] = useState<'best' | 'new' | 'top' | 'featured'>('best');
  const tabProducts = useMemo(() => {
    if (activeTab === 'best') return PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
    if (activeTab === 'new') return PRODUCTS.filter((p) => p.isNewArrival).slice(0, 8);
    if (activeTab === 'top') return PRODUCTS.filter((p) => p.isTopRated).slice(0, 8);
    return PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);
  }, [activeTab]);

  /* --- PROMO / COMBO SCROLL PARALLAX --- */
  const bundleSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: bundleProgress } = useScroll({
    target: bundleSectionRef,
    offset: ['start end', 'end start'],
  });
  const bundleBgY = useTransform(bundleProgress, [0, 1], [-36, 36]);

  /* --- BRANDS TWO-ROW OPPOSITE MARQUEES --- */
  const brandsRowA = useMemo(() => BRANDS_LIST.slice(0, 5), []);
  const brandsRowB = useMemo(() => BRANDS_LIST.slice(5), []);

  /* --- REVIEWS AUTO-SLIDE & DRAG CAROUSEL --- */
  const [testimonialOffset, setTestimonialOffset] = useState(0);
  const [reviewsPaused, setReviewsPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || reviewsPaused) return;
    const id = setInterval(() => {
      setTestimonialOffset((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => clearInterval(id);
  }, [reviewsPaused, prefersReducedMotion]);

  /* --- NEWSLETTER INTERACTIVE FOCUS & CONFETTI --- */
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterFocused, setNewsletterFocused] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim());
    if (!valid) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setNewsletterError('');
    setNewsletterSuccess(true);
    showToast('Subscribed!', 'Welcome to PRIME COMPUTER ACCESSORIES VIP deals.', 'success');
    setNewsletterEmail('');
  };

  return (
    <div className="overflow-x-clip">
      {/* =================================================================== */}
      {/*  1. HERO 4-SLIDE CAROUSEL (3D Rotation, Orbit Rings, Word Reveal)   */}
      {/* =================================================================== */}
      <section
        ref={heroSectionRef}
        data-watermark-dark={isDarkSlide ? 'true' : undefined}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative"
      >
        <div
          className={`relative overflow-hidden transition-colors duration-500 ${
            activeSlide.theme === 'light'
              ? 'bg-gradient-to-br from-white via-[#F3F7FF] to-[#DFECFF] dark:from-[#070B16] dark:via-[#0C1530] dark:to-[#0F1E42]'
              : activeSlide.theme === 'cyan'
              ? 'bg-gradient-to-br from-white via-[#EEFBFF] to-[#D9F4FF] dark:from-[#070B16] dark:via-[#0B1B36] dark:to-[#0C264A]'
              : activeSlide.theme === 'dark'
              ? 'bg-gradient-to-br from-[#070B16] via-[#0C1530] to-[#0E224F] bg-circuit-dark'
              : 'bg-gradient-to-br from-[#060A15] via-[#0A132C] to-[#0D2154] bg-circuit-dark'
          }`}
        >
          <div className="pointer-events-none absolute -top-24 -left-24 w-[460px] h-[460px] rounded-full bg-[#1F5BFF]/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 right-0 w-[520px] h-[520px] rounded-full bg-[#19C3FF]/15 blur-[110px]" />

          <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:py-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center min-h-[460px]"
              >
                {/* Left Copy: Mask Word-by-Word Reveal + Staggered Subtext/Buttons */}
                <div className="lg:col-span-6 space-y-6">
                  <motion.p
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`text-xs uppercase tracking-[0.18em] font-semibold ${
                      isDarkSlide
                        ? 'text-[#19C3FF]'
                        : 'text-[#1F5BFF] dark:text-[#19C3FF]'
                    }`}
                  >
                    {activeSlide.label}
                  </motion.p>

                  <h1
                    style={{ textWrap: 'balance' }}
                    className={`font-display text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-tight leading-[1.08] flex flex-wrap gap-x-3 gap-y-1 ${
                      isDarkSlide ? 'text-white' : 'text-[#0B1220] dark:text-white'
                    }`}
                  >
                    {headlineWords.map((word, wIdx) => (
                      <span
                        key={`${activeSlide.id}-w-${wIdx}`}
                        className="inline-block overflow-hidden pb-1"
                      >
                        <motion.span
                          initial={
                            prefersReducedMotion
                              ? false
                              : { y: '115%', opacity: 0 }
                          }
                          animate={{ y: '0%', opacity: 1 }}
                          transition={{
                            duration: 0.45,
                            delay: prefersReducedMotion ? 0 : 0.04 + wIdx * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className={`inline-block ${
                            word.accent
                              ? 'bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] bg-clip-text text-transparent'
                              : ''
                          }`}
                        >
                          {word.text}
                        </motion.span>
                      </span>
                    ))}
                  </h1>

                  <motion.p
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: prefersReducedMotion ? 0 : 0.28 }}
                    className={`text-base sm:text-lg leading-relaxed max-w-xl ${
                      isDarkSlide ? 'text-slate-300' : 'text-[#4B5563] dark:text-slate-300'
                    }`}
                  >
                    {activeSlide.subtext}
                  </motion.p>

                  {/* Floating Spec Chips drifting at varied speeds */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {activeSlide.specs.map((spec, sIdx) => (
                      <motion.span
                        key={spec}
                        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 1, scale: 1, y: [0, -5, 0] }
                        }
                        transition={{
                          opacity: { duration: 0.3, delay: 0.32 + sIdx * 0.06 },
                          scale: { duration: 0.3, delay: 0.32 + sIdx * 0.06 },
                          y: {
                            duration: 3 + sIdx * 0.7,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          },
                        }}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium backdrop-blur-md border ${
                          isDarkSlide
                            ? 'bg-white/10 border-white/15 text-slate-100'
                            : 'bg-white/85 dark:bg-white/10 border-[#E8EDF5] dark:border-white/15 text-[#0B1220] dark:text-slate-100 shadow-sm'
                        }`}
                      >
                        {spec}
                      </motion.span>
                    ))}
                  </div>

                  {/* Buttons pop in last */}
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: prefersReducedMotion ? 0 : 0.42,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    className="flex flex-wrap items-center gap-3 pt-2"
                  >
                    <Link
                      to={`/shop?category=${activeSlide.ctaCategory}`}
                      className="btn-shine min-h-[46px] inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(31,91,255,0.34)] hover:-translate-y-0.5 transition-all whitespace-nowrap"
                    >
                      Shop Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a
                      href={`${STORE_INFO.whatsappBase}?text=${encodeURIComponent(
                        `Assalam-o-Alaikum! I want to order ${activeSlide.headlinePrefix} ${activeSlide.headlineAccent} gear.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-shine min-h-[46px] inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-sm font-semibold shadow-lg transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Order on WhatsApp
                    </a>
                  </motion.div>
                </div>

                {/* Right Showcase: 3D Spin Slide-In/Out + Continuous RotateY + Orbit Rings + Glow */}
                <div
                  style={{ perspective: 1200 }}
                  className="lg:col-span-6 relative flex items-center justify-center py-6"
                >
                  {/* Concentric Orbit Rings + Pulsing Blue Glow */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : { scale: [0.96, 1.06, 0.96], opacity: [0.45, 0.75, 0.45] }
                      }
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] rounded-full bg-gradient-to-tr from-[#1F5BFF]/30 to-[#19C3FF]/25 blur-2xl"
                    />

                    {/* Inner Orbit Ring + Dot */}
                    <div className="animate-orbit-cw absolute w-[300px] h-[300px] sm:w-[410px] sm:h-[410px] rounded-full border border-[#1F5BFF]/20 dark:border-[#19C3FF]/25">
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#19C3FF] shadow-[0_0_12px_#19C3FF]" />
                    </div>

                    {/* Outer Orbit Ring + Dot */}
                    <div className="animate-orbit-ccw absolute w-[350px] h-[350px] sm:w-[490px] sm:h-[490px] rounded-full border border-dashed border-[#19C3FF]/25 dark:border-[#1F5BFF]/35">
                      <span className="absolute bottom-4 right-10 w-2.5 h-2.5 rounded-full bg-[#1F5BFF] shadow-[0_0_10px_#1F5BFF]" />
                    </div>
                  </div>

                  {/* Slide-Transition 3D Card */}
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? false
                        : {
                            opacity: 0,
                            x: 90,
                            rotateY: 26,
                            scale: 0.88,
                            filter: 'blur(8px)',
                          }
                    }
                    animate={{
                      opacity: 1,
                      x: 0,
                      rotateY: 0,
                      scale: 1,
                      filter: 'blur(0px)',
                    }}
                    exit={
                      prefersReducedMotion
                        ? undefined
                        : {
                            opacity: 0,
                            x: -90,
                            rotateY: -26,
                            scale: 0.88,
                            filter: 'blur(8px)',
                          }
                    }
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      rotateX: isFinePointer
                        ? heroSmoothTiltX
                        : prefersReducedMotion
                        ? 0
                        : mobileScrollRotateX,
                      rotateY: isFinePointer ? heroSmoothTiltY : 0,
                      transformStyle: 'preserve-3d',
                    }}
                    className="relative w-full max-w-[520px]"
                  >
                    {/* Continuous gentle 3D rotateY showcase loop */}
                    <motion.div
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : { rotateY: [-4.5, 4.5, -4.5], y: [0, -7, 0] }
                      }
                      transition={{
                        rotateY: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
                        y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                      }}
                      className="relative rounded-[28px] overflow-hidden border border-white/50 dark:border-white/20 shadow-[0_28px_80px_rgba(31,91,255,0.26)] aspect-[4/3] bg-white/50 dark:bg-[#0C1530]/75"
                    >
                      <SmartImage
                        src={activeSlide.image}
                        alt={activeSlide.imageAlt}
                        eager
                        className="w-full h-full object-cover"
                      />

                      <Link
                        to={`/product/${activeSlide.ctaProductSlug}`}
                        className="absolute bottom-4 left-4 right-4 sm:right-auto sm:min-w-[235px] rounded-2xl bg-white/94 dark:bg-[#070B16]/90 backdrop-blur-xl border border-white/60 dark:border-white/15 px-4 py-3 flex items-center justify-between gap-4 shadow-lg hover:scale-[1.03] transition-transform"
                      >
                        <div>
                          <span className="block text-[10px] uppercase tracking-[0.15em] text-[#4B5563] dark:text-slate-400">
                            Starting From
                          </span>
                          <span className="font-mono-num text-lg font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                            {formatPKR(activeSlide.fromPrice)}
                          </span>
                        </div>
                        <span className="w-9 h-9 rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] text-white flex items-center justify-center shrink-0">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === slideIdx
                        ? 'w-9 bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF]'
                        : isDarkSlide
                        ? 'w-2.5 bg-white/30 hover:bg-white/50'
                        : 'w-2.5 bg-slate-300 dark:bg-white/25 hover:bg-[#1F5BFF]/60'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToSlide(slideIdx - 1)}
                  aria-label="Previous slide"
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${
                    isDarkSlide
                      ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                      : 'border-[#E8EDF5] dark:border-white/15 bg-white/90 dark:bg-white/10 text-[#0B1220] dark:text-white hover:border-[#1F5BFF]'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goToSlide(slideIdx + 1)}
                  aria-label="Next slide"
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${
                    isDarkSlide
                      ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                      : 'border-[#E8EDF5] dark:border-white/15 bg-white/90 dark:bg-white/10 text-[#0B1220] dark:text-white hover:border-[#1F5BFF]'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-[2] h-[3px] w-full bg-black/5 dark:bg-white/10">
            <motion.div
              key={progressKey}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5.5, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF]"
            />
          </div>
        </div>

        {/* 5-BADGE TRUST STRIP FOR PAKISTANI BUYERS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 rounded-[24px] border border-[#E8EDF5] dark:border-white/12 bg-white/95 dark:bg-[#0C1530]/95 backdrop-blur-xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(31,91,255,0.09)]">
            {[
              {
                icon: <BadgeCheck className="w-5 h-5" />,
                title: '100% Original',
                sub: 'Factory-sealed gear',
              },
              {
                icon: <Banknote className="w-5 h-5" />,
                title: 'Cash on Delivery',
                sub: 'Nationwide COD',
              },
              {
                icon: <RotateCcw className="w-5 h-5" />,
                title: '7-Day Replacement',
                sub: 'Instant defect swap',
              },
              {
                icon: <PackageOpen className="w-5 h-5" />,
                title: 'Open Parcel Before Payment',
                sub: 'Check seal & model',
              },
              {
                icon: <FileCheck2 className="w-5 h-5" />,
                title: 'Warranty Card Included',
                sub: 'Official serial card',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1F5BFF]/12 to-[#19C3FF]/15 text-[#1F5BFF] dark:text-[#19C3FF] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xs font-semibold text-[#0B1220] dark:text-white leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[#4B5563] dark:text-slate-400 truncate">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/*  2. LIVE HARDWARE PARADE (Right-to-Left Continuous Depth Showcase)  */}
      {/* =================================================================== */}
      <section className="relative py-10 sm:py-12 border-b border-[#E8EDF5] dark:border-white/10 overflow-hidden pause-on-hover">
        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
            Live Hardware Showcase · Hover To Pause &amp; Inspect
          </p>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#4B5563] dark:text-slate-300 hover:text-[#1F5BFF]"
          >
            View All →
          </Link>
        </div>

        {/* Edge fade masks */}
        <div className="pointer-events-none absolute left-0 top-14 bottom-4 w-12 sm:w-24 bg-gradient-to-r from-white dark:from-[#070B16] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-14 bottom-4 w-12 sm:w-24 bg-gradient-to-l from-white dark:from-[#070B16] to-transparent z-10" />

        <div className="relative z-[2] animate-parade items-center gap-6 px-4">
          {[...paradeProducts, ...paradeProducts].map((p, idx) => {
            const isAlt = idx % 2 === 0;
            const speedDuration = `${3.8 + (idx % 4) * 0.65}s`;
            return (
              <Link
                key={`${p.id}-parade-${idx}`}
                to={`/product/${p.slug}`}
                style={{ animationDuration: speedDuration }}
                className={`group relative shrink-0 w-36 sm:w-44 py-3 ${
                  isAlt ? 'parade-bob-a' : 'parade-bob-b'
                }`}
              >
                {/* Hover Tooltip with Name + PKR Price */}
                <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-44 rounded-xl border border-[#E8EDF5] dark:border-white/15 bg-white/98 dark:bg-[#0C1530]/98 backdrop-blur-xl px-3 py-2 text-center shadow-[0_14px_34px_rgba(31,91,255,0.22)] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                  <p className="font-display text-[11px] font-semibold text-[#0B1220] dark:text-white truncate">
                    {p.name}
                  </p>
                  <p className="font-mono-num text-xs font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                    {formatPKR(p.price)}
                  </p>
                </div>

                <div className="aspect-[4/3] rounded-[20px] overflow-hidden border border-[#E8EDF5] dark:border-white/12 bg-gradient-to-br from-[#F3F7FF] to-[#E6EEFF] dark:from-[#0C1530] dark:to-[#091229] p-1.5 shadow-[0_12px_28px_rgba(31,91,255,0.08)] group-hover:border-[#1F5BFF] group-hover:scale-108 transition-all duration-300">
                  <SmartImage
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/*  3. SHOP BY CATEGORY (3D Cursor Tilt + 2deg Zoom Rotate + Overlay)  */}
      {/* =================================================================== */}
      <section className="relative py-14 sm:py-20 bg-[#F3F7FF]/55 dark:bg-[#070B16]/40 bg-circuit-light dark:bg-circuit-dark">
        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                Curated Hardware Ecosystem
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B1220] dark:text-white tracking-tight">
                Shop by{' '}
                <span className="bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] bg-clip-text text-transparent">
                  Category
                </span>
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/catalog"
                className="text-sm font-semibold text-[#4B5563] dark:text-slate-300 hover:text-[#1F5BFF]"
              >
                View Price Catalog
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F5BFF] dark:text-[#19C3FF] hover:gap-2.5 transition-all whitespace-nowrap"
              >
                Explore All 30 Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {CATEGORIES.map((cat, idx) => (
              <CategoryTiltTile key={cat.slug} cat={cat} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/*  4. FLASH DEALS (Flip-Clock, Stock Bar Fill+Shimmer, Auto-Slider)   */}
      {/* =================================================================== */}
      <section
        data-watermark-dark="true"
        onMouseEnter={() => setFlashPaused(true)}
        onMouseLeave={() => setFlashPaused(false)}
        className="relative py-16 sm:py-20 bg-gradient-to-br from-[#070B16] via-[#0C1530] to-[#081229] bg-circuit-dark text-white overflow-hidden"
      >
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-[#1F5BFF]/20 blur-[120px]" />

        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#F4B942]">
                <Clock className="w-4 h-4" />
                <span>Limited Stock · Genuine Discounts</span>
              </div>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
                Weekly Hardware{' '}
                <span className="bg-gradient-to-r from-[#19C3FF] to-[#1F5BFF] bg-clip-text text-transparent">
                  Flash Deals
                </span>
              </h2>
            </div>

            {/* Flip-Clock Countdown Digits */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {[
                { label: 'Days', value: days },
                { label: 'Hours', value: hours },
                { label: 'Min', value: mins },
                { label: 'Sec', value: secs },
              ].map((unit) => (
                <div
                  key={unit.label}
                  style={{ perspective: 400 }}
                  className="min-w-[62px] sm:min-w-[74px] rounded-2xl border border-white/15 bg-white/8 backdrop-blur-xl px-3 py-2.5 text-center overflow-hidden"
                >
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={unit.value}
                      initial={
                        prefersReducedMotion
                          ? false
                          : { rotateX: -90, opacity: 0 }
                      }
                      animate={{ rotateX: 0, opacity: 1 }}
                      exit={
                        prefersReducedMotion
                          ? undefined
                          : { rotateX: 90, opacity: 0 }
                      }
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: '50% 50%' }}
                      className="block font-mono-num text-xl sm:text-2xl font-semibold text-white"
                    >
                      {String(unit.value).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-slate-300">
                    {unit.label}
                  </span>
                </div>
              ))}

              <div className="hidden sm:flex items-center gap-2 ml-2">
                <button
                  type="button"
                  onClick={() =>
                    flashSliderRef.current?.scrollBy({ left: -320, behavior: 'smooth' })
                  }
                  aria-label="Scroll flash deals left"
                  className="w-11 h-11 rounded-full border border-white/20 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    flashSliderRef.current?.scrollBy({ left: 320, behavior: 'smooth' })
                  }
                  aria-label="Scroll flash deals right"
                  className="w-11 h-11 rounded-full border border-white/20 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={flashSliderRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
          >
            {flashProducts.map((product) => {
              const discountPct = product.oldPrice
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 15;
              const stockPct = Math.min(92, Math.max(25, product.stock * 10));
              const waUrl = buildProductWhatsAppUrl(
                product.name,
                product.price,
                product.slug,
                1
              );
              return (
                <div
                  key={product.id}
                  className="snap-start shrink-0 w-[280px] sm:w-[300px] rounded-[24px] border border-white/12 bg-white/6 backdrop-blur-xl p-4 flex flex-col justify-between hover:border-[#19C3FF]/50 transition-all"
                >
                  <div>
                    <div className="relative aspect-[4/3] rounded-[18px] overflow-hidden bg-[#0E1938]">
                      <Link to={`/product/${product.slug}`} className="block w-full h-full">
                        <SmartImage
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <span className="absolute top-3 left-3 rounded-full bg-[#F4B942] px-2.5 py-0.5 text-[11px] font-semibold text-[#0B1220]">
                        -{discountPct}% OFF
                      </span>
                      <span className="animate-pulse absolute top-3 right-3 rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-[0_0_12px_rgba(244,63,94,0.6)]">
                        HOT
                      </span>
                    </div>

                    <p className="mt-3 text-[11px] uppercase tracking-[0.15em] text-[#19C3FF]">
                      {product.brand}
                    </p>
                    <Link
                      to={`/product/${product.slug}`}
                      className="mt-1 block font-display text-base font-semibold text-white line-clamp-2 hover:text-[#19C3FF] transition-colors"
                    >
                      {product.name}
                    </Link>

                    <div className="mt-2.5 flex items-baseline gap-2.5">
                      <span className="font-mono-num text-lg font-semibold text-[#19C3FF]">
                        {formatPKR(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="font-mono-num text-xs text-slate-400 line-through">
                          {formatPKR(product.oldPrice)}
                        </span>
                      )}
                    </div>

                    {/* Stock progress bar filling from 0 on scroll + shimmer */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                        <span>Remaining Stock</span>
                        <span className="font-mono-num text-[#F4B942]">
                          Only {product.stock} left
                        </span>
                      </div>
                      <div className="relative h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={prefersReducedMotion ? false : { scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true, amount: 0.4 }}
                          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                          className="relative h-full rounded-full bg-gradient-to-r from-[#F4B942] to-[#19C3FF] overflow-hidden"
                          style={{ width: `${stockPct}%`, transformOrigin: '0% 50%' }}
                        >
                          <div className="animate-shimmer absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        addToCart(product, undefined, 1, rect);
                      }}
                      className="btn-shine w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] text-xs font-semibold text-white"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Grab Deal
                    </button>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-600 hover:text-white text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Order on WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/*  5. PRODUCT SHOWCASE TABS (Alternating Left/Right Fly-In Cards)      */}
      {/* =================================================================== */}
      <section className="py-16 sm:py-20">
        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                Flagship Collection
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B1220] dark:text-white tracking-tight">
                Engineered for{' '}
                <span className="bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] bg-clip-text text-transparent">
                  Peak Performance
                </span>
              </h2>
            </div>

            <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-[#F3F7FF] dark:bg-[#0C1530] border border-[#E8EDF5] dark:border-white/10">
              {[
                { id: 'best', label: 'Best Sellers' },
                { id: 'new', label: 'New Arrivals' },
                { id: 'top', label: 'Top Rated' },
                { id: 'featured', label: 'Featured' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.id as 'best' | 'new' | 'top' | 'featured')
                  }
                  className={`min-h-[40px] px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] text-white shadow-[0_6px_18px_rgba(31,91,255,0.28)]'
                      : 'text-[#4B5563] dark:text-slate-300 hover:text-[#0B1220] dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          >
            {tabProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/shop"
              className="min-h-[46px] inline-flex items-center gap-2 rounded-full border border-[#CBD5E1] dark:border-white/20 bg-white dark:bg-[#0C1530] px-7 py-3 text-sm font-semibold text-[#0B1220] dark:text-white hover:border-[#1F5BFF] hover:text-[#1F5BFF] transition-colors"
            >
              View All 30 Products
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/catalog"
              className="min-h-[46px] inline-flex items-center gap-2 rounded-full bg-[#F3F7FF] dark:bg-white/10 px-6 py-3 text-sm font-semibold text-[#1F5BFF] dark:text-[#19C3FF]"
            >
              Open Shareable Price Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/*  6. PROMO / COMBO BUNDLES (Parallax BG + Rotating Slide-In + Shine)  */}
      {/* =================================================================== */}
      <section
        ref={bundleSectionRef}
        className="relative py-14 sm:py-18 bg-[#F3F7FF]/60 dark:bg-[#0C1530]/40 border-y border-[#E8EDF5] dark:border-white/10 overflow-hidden"
      >
        {/* Scroll parallax decorative background layer */}
        <motion.div
          style={prefersReducedMotion ? undefined : { y: bundleBgY }}
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/4 w-[540px] h-[540px] rounded-full bg-gradient-to-tr from-[#1F5BFF]/12 to-[#19C3FF]/15 blur-3xl"
        />

        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
              Save More With Complete Desk Bundles
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B1220] dark:text-white tracking-tight">
              Curated Combo{' '}
              <span className="animate-text-shine bg-gradient-to-r from-[#1F5BFF] via-[#19C3FF] to-[#1F5BFF] bg-clip-text text-transparent">
                Setups
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {BUNDLE_DEALS.map((bundle, bIdx) => {
              const items = bundle.productSlugs
                .map((s) => getProductBySlug(s))
                .filter((p): p is Product => Boolean(p));
              const regularSum = items.reduce((s, i) => s + i.price, 0);
              const comboPrice = Math.round(
                regularSum * (1 - bundle.discountPct / 100)
              );
              const savings = regularSum - comboPrice;
              const bundleWa = `${STORE_INFO.whatsappBase}?text=${encodeURIComponent(
                `Assalam-o-Alaikum! I want to order the "${bundle.title}" (${bundle.discountPct}% OFF Combo) for ${formatPKR(
                  comboPrice
                )}:\n` + items.map((i) => `• ${i.name}`).join('\n')
              )}`;

              return (
                <div
                  key={bundle.id}
                  className={`relative overflow-hidden rounded-[28px] p-6 sm:p-8 flex flex-col justify-between gap-6 ${
                    bundle.theme === 'blue'
                      ? 'bg-gradient-to-br from-[#1F5BFF] to-[#19C3FF] text-white shadow-[0_24px_60px_rgba(31,91,255,0.26)]'
                      : 'bg-gradient-to-br from-[#070B16] to-[#10204A] text-white shadow-[0_24px_60px_rgba(7,11,22,0.28)]'
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    <div className="sm:col-span-7 space-y-3">
                      <span className="inline-block rounded-full bg-[#F4B942] px-3 py-1 text-[11px] font-semibold text-[#0B1220]">
                        {bundle.badge}
                      </span>
                      <h3 className="animate-text-shine font-display text-2xl sm:text-3xl font-semibold leading-tight bg-gradient-to-r from-white via-[#DFF6FF] to-white bg-clip-text text-transparent">
                        {bundle.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/88 leading-relaxed">
                        {bundle.subtitle}
                      </p>
                    </div>

                    {/* Product image slides in from side with rotation then floats */}
                    <motion.div
                      initial={
                        prefersReducedMotion
                          ? false
                          : { opacity: 0, x: bIdx === 0 ? 44 : -44, rotate: bIdx === 0 ? 6 : -6 }
                      }
                      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="sm:col-span-5"
                    >
                      <div className="animate-float-slow aspect-[4/3] rounded-2xl overflow-hidden border border-white/25 shadow-xl">
                        <SmartImage
                          src={bundle.image}
                          alt={bundle.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Included Items + Pricing */}
                  <div className="rounded-2xl bg-black/15 backdrop-blur-md border border-white/15 p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-1.5 truncate">
                          <Check className="w-3.5 h-3.5 text-[#F4B942] shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="block text-[11px] text-white/75">
                          Combo Price (Save {formatPKR(savings)})
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono-num text-2xl font-semibold text-white">
                            {formatPKR(comboPrice)}
                          </span>
                          <span className="font-mono-num text-xs text-white/65 line-through">
                            {formatPKR(regularSum)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => addBundleToCart(items, bundle.title)}
                          className="btn-shine min-h-[44px] inline-flex items-center gap-1.5 rounded-full bg-white text-[#0B1220] px-5 py-2.5 text-xs font-semibold hover:bg-[#F3F7FF] transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Add Bundle
                        </button>
                        <a
                          href={bundleWa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 text-xs font-semibold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/*  7. BRANDS MARQUEE (2 Rows Moving In Opposite Directions)            */}
      {/* =================================================================== */}
      <section className="py-12 border-b border-[#E8EDF5] dark:border-white/10 overflow-hidden pause-on-hover">
        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[#4B5563] dark:text-slate-400">
            Authorized Official Stock From Global Hardware Leaders
          </p>
        </div>

        {/* Row 1: Leftward */}
        <div className="relative z-[2] overflow-hidden mb-4">
          <div className="animate-marquee-left items-center gap-5 px-4">
            {[...brandsRowA, ...brandsRowA, ...brandsRowA].map((brand, i) => (
              <Link
                key={`rowA-${brand.name}-${i}`}
                to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className="group shrink-0 w-44 rounded-2xl border border-[#E8EDF5] dark:border-white/10 bg-[#F3F7FF]/45 dark:bg-[#0C1530] px-5 py-4 flex flex-col items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-[#1F5BFF]/50"
              >
                <span className="font-display text-lg font-semibold text-slate-600 dark:text-slate-300 transition-colors duration-200 group-hover:text-[#1F5BFF] dark:group-hover:text-[#19C3FF]">
                  {brand.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 mt-0.5">
                  {brand.tagline}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Row 2: Rightward */}
        <div className="relative z-[2] overflow-hidden">
          <div className="animate-marquee-right items-center gap-5 px-4">
            {[...brandsRowB, ...brandsRowB, ...brandsRowB].map((brand, i) => (
              <Link
                key={`rowB-${brand.name}-${i}`}
                to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className="group shrink-0 w-44 rounded-2xl border border-[#E8EDF5] dark:border-white/10 bg-[#F3F7FF]/45 dark:bg-[#0C1530] px-5 py-4 flex flex-col items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-[#1F5BFF]/50"
              >
                <span className="font-display text-lg font-semibold text-slate-600 dark:text-slate-300 transition-colors duration-200 group-hover:text-[#1F5BFF] dark:group-hover:text-[#19C3FF]">
                  {brand.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 mt-0.5">
                  {brand.tagline}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/*  8. WHY CHOOSE US (SVG Stroke Draw + Staggered Rise + Count-Up)      */}
      {/* =================================================================== */}
      <section className="py-16 sm:py-20">
        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
              Our Promise To Pakistani Buyers
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B1220] dark:text-white tracking-tight">
              Zero Risk Online Buying at{' '}
              <span className="bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] bg-clip-text text-transparent">
                PRIME COMPUTER ACCESSORIES
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-10">
            {[
              {
                kind: 'shield' as const,
                title: '100% Original',
                desc: 'Authentic factory-sealed boxes with verifiable serials.',
              },
              {
                kind: 'box' as const,
                title: 'Open Parcel COD',
                desc: 'Verify model & retail seal before paying the courier.',
              },
              {
                kind: 'award' as const,
                title: 'Warranty Card',
                desc: 'Official stamped warranty & 7-day instant replacement.',
              },
              {
                kind: 'truck' as const,
                title: '1–4 Day Delivery',
                desc: 'Free delivery above Rs. 15,000 across 120+ cities.',
              },
              {
                kind: 'headset' as const,
                title: '5-Min WhatsApp',
                desc: 'Real Sialkot hardware team replies within 5 minutes.',
              },
            ].map((card, cIdx) => (
              <motion.div
                key={card.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: cIdx * 0.06 }}
                className="rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-[#F3F7FF]/55 dark:bg-[#0C1530] p-6 hover:border-[#1F5BFF]/50 transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1F5BFF] to-[#19C3FF] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(31,91,255,0.28)]">
                  <StrokeDrawIcon kind={card.kind} />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-[#0B1220] dark:text-white">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[#4B5563] dark:text-slate-300 leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Shipping & Returns Summary Strip */}
          <div className="rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-[#F3F7FF] dark:bg-[#0C1530] p-6 sm:p-8 mb-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                  Shipping Rates
                </p>
                <p className="mt-1 text-sm font-semibold text-[#0B1220] dark:text-white">
                  FREE above Rs. 15,000
                </p>
                <p className="text-xs text-[#4B5563] dark:text-slate-400">
                  Flat Rs. 350 courier fee below Rs. 15,000 anywhere in Pakistan.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                  Delivery Speed
                </p>
                <p className="mt-1 text-sm font-semibold text-[#0B1220] dark:text-white">
                  1–2 Days Punjab · 2–4 Days Nationwide
                </p>
                <p className="text-xs text-[#4B5563] dark:text-slate-400">
                  Same-day dispatch from Sialkot for orders before 4 PM.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                  Returns &amp; Warranty
                </p>
                <p className="mt-1 text-sm font-semibold text-[#0B1220] dark:text-white">
                  7-Day Replacement Guarantee
                </p>
                <p className="text-xs text-[#4B5563] dark:text-slate-400">
                  Instant swap if defective or damaged in transit.
                </p>
              </div>
            </div>

            <Link
              to="/shipping-returns"
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#070B16] border border-[#CBD5E1] dark:border-white/15 px-5 py-2.5 text-xs font-semibold text-[#0B1220] dark:text-white hover:border-[#1F5BFF] whitespace-nowrap shrink-0"
            >
              Read Full Policy <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <CountUpStat target={1200} suffix="+" label="Verified 5-Star Reviews" />
            <CountUpStat target={10000} suffix="+" label="Parcels Delivered Across Pakistan" />
            <CountUpStat target={5} suffix=" Min" label="Average WhatsApp Reply Time" />
            <CountUpStat target={100} suffix="%" label="Original Sealed Stock" />
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/*  9. REVIEWS (Auto-Slide + Drag Support + Scaled Active + Star Fill)  */}
      {/* =================================================================== */}
      <section
        onMouseEnter={() => setReviewsPaused(true)}
        onMouseLeave={() => setReviewsPaused(false)}
        className="py-16 sm:py-20 bg-[#F3F7FF]/60 dark:bg-[#0C1530]/40 border-t border-[#E8EDF5] dark:border-white/10 overflow-hidden"
      >
        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-[#0C1530] border border-[#E8EDF5] dark:border-white/15 px-4 py-1.5 mb-3 shadow-sm">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F4B942] text-[#F4B942]" />
                  ))}
                </div>
                <span className="font-mono-num text-xs font-semibold text-[#0B1220] dark:text-white">
                  4.8 / 5 from 1,200+ customers
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1220] dark:text-white tracking-tight">
                Trusted from{' '}
                <span className="bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] bg-clip-text text-transparent">
                  Sialkot to Karachi
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setTestimonialOffset((prev) =>
                    (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                  )
                }
                aria-label="Previous testimonials"
                className="w-11 h-11 rounded-full border border-[#E8EDF5] dark:border-white/15 bg-white dark:bg-[#0C1530] flex items-center justify-center text-[#0B1220] dark:text-white hover:border-[#1F5BFF]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setTestimonialOffset((prev) => (prev + 1) % TESTIMONIALS.length)
                }
                aria-label="Next testimonials"
                className="w-11 h-11 rounded-full border border-[#E8EDF5] dark:border-white/15 bg-white dark:bg-[#0C1530] flex items-center justify-center text-[#0B1220] dark:text-white hover:border-[#1F5BFF]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) {
                setTestimonialOffset((prev) => (prev + 1) % TESTIMONIALS.length);
              } else if (info.offset.x > 50) {
                setTestimonialOffset(
                  (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                );
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 cursor-grab active:cursor-grabbing select-none"
          >
            {[0, 1, 2, 3].map((shift) => {
              const t = TESTIMONIALS[(testimonialOffset + shift) % TESTIMONIALS.length];
              const isHighlighted = shift === 1;
              return (
                <motion.article
                  key={`${t.id}-${testimonialOffset}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: shift * 0.04 }}
                  className={`rounded-[24px] border bg-white/92 dark:bg-[#0C1530]/92 backdrop-blur-xl p-5 flex flex-col justify-between transition-all ${
                    isHighlighted
                      ? 'border-[#1F5BFF]/45 shadow-[0_22px_54px_rgba(31,91,255,0.14)] lg:scale-[1.03]'
                      : 'border-white/80 dark:border-white/12 shadow-[0_16px_44px_rgba(31,91,255,0.06)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <motion.span
                            key={i}
                            initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              delay: prefersReducedMotion ? 0 : i * 0.08,
                              duration: 0.25,
                            }}
                          >
                            <Star className="w-3.5 h-3.5 fill-[#F4B942] text-[#F4B942]" />
                          </motion.span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Verified Buyer
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#0B1220] dark:text-slate-200 leading-relaxed">
                      “{t.quote}”
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-[#E8EDF5] dark:border-white/10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1F5BFF] to-[#19C3FF] text-white font-display font-semibold text-xs flex items-center justify-center shrink-0">
                      {t.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-xs sm:text-sm font-semibold text-[#0B1220] dark:text-white truncate">
                        {t.name} · {t.city}
                      </p>
                      <p className="text-[11px] text-[#4B5563] dark:text-slate-400 truncate">
                        {t.productPurchased}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =================================================================== */}
      {/*  10. WHATSAPP BANNER (Concentric Ripple + Floating Chat Bubbles)     */}
      {/* =================================================================== */}
      <section className="py-10">
        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#1F5BFF] via-[#0B7CFF] to-[#19C3FF] p-8 sm:p-12 text-white shadow-[0_24px_60px_rgba(31,91,255,0.28)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Floating translucent chat bubbles rising in background */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
              {[
                { left: '14%', delay: '0s', label: 'Original?' },
                { left: '42%', delay: '1.8s', label: 'COD Sialkot' },
                { left: '68%', delay: '3.2s', label: '5 Min Reply' },
                { left: '84%', delay: '1.1s', label: 'Open Parcel' },
              ].map((b, i) => (
                <div
                  key={i}
                  style={{ left: b.left, animationDelay: b.delay }}
                  className="animate-bubble-rise absolute -bottom-6 rounded-full border border-white/25 bg-white/15 backdrop-blur-sm px-3 py-1 text-[10px] font-medium text-white/90"
                >
                  {b.label}
                </div>
              ))}
            </div>

            <div className="relative z-10 max-w-2xl">
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-white/85">
                Instant Human Concierge · Reply in 5 Minutes
              </span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
                Order Directly on WhatsApp
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/90">
                Message{' '}
                <span className="font-mono-num font-semibold">{STORE_INFO.phoneRaw}</span>{' '}
                for instant stock photos, laptop compatibility advice, and Cash on Delivery dispatch.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 rounded-full bg-white/30 animate-ping"
              />
              <a
                href={`${STORE_INFO.whatsappBase}?text=${encodeURIComponent(
                  'Assalam-o-Alaikum PRIME COMPUTER ACCESSORIES! I would like to place an order.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative min-h-[48px] inline-flex items-center gap-2.5 rounded-full bg-white text-[#1F5BFF] px-7 py-3.5 text-sm font-semibold shadow-xl hover:bg-[#F3F7FF] hover:-translate-y-0.5 transition-all whitespace-nowrap"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                Chat on WhatsApp Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/*  11. NEWSLETTER (Envelope Focus Open + Checkmark & Confetti Burst)   */}
      {/* =================================================================== */}
      <section className="pb-16 pt-6">
        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[28px] border border-[#E8EDF5] dark:border-white/12 bg-gradient-to-br from-[#F3F7FF] via-white to-[#E6F1FF] dark:from-[#0C1530] dark:to-[#070B16] p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 overflow-hidden">
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                <Sparkles className="w-4 h-4" />
                <span>VIP Hardware Drops</span>
              </div>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-[#0B1220] dark:text-white">
                Get Early Access to Restocks &amp; Flash Deals
              </h2>
              <p className="mt-2 text-sm text-[#4B5563] dark:text-slate-300">
                Receive PKR price alerts on new mechanical keyboards, monitors, and seasonal bundles.
              </p>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="relative w-full lg:w-auto lg:min-w-[420px]"
              noValidate
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <motion.span
                    animate={
                      newsletterFocused && !prefersReducedMotion
                        ? { y: -2, scale: 1.15, rotate: -6 }
                        : { y: 0, scale: 1, rotate: 0 }
                    }
                    transition={{ duration: 0.22 }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1F5BFF] dark:text-[#19C3FF] pointer-events-none"
                  >
                    {newsletterFocused ? (
                      <MailOpen className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4 text-slate-400" />
                    )}
                  </motion.span>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onFocus={() => setNewsletterFocused(true)}
                    onBlur={() => setNewsletterFocused(false)}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-label="Email address for newsletter"
                    className="w-full min-h-[46px] rounded-full border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#070B16] pl-11 pr-5 py-3 text-sm text-[#0B1220] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1F5BFF]"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-shine min-h-[46px] rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(31,91,255,0.28)] whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              {newsletterError && (
                <p className="mt-2 text-xs text-rose-500 pl-3">{newsletterError}</p>
              )}

              <AnimatePresence>
                {newsletterSuccess && !newsletterError && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mt-3 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 pl-3"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 shrink-0"
                    >
                      <motion.path
                        d="M20 6 9 17l-5-5"
                        initial={prefersReducedMotion ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45 }}
                      />
                    </svg>
                    <span>Subscribed! Watch your inbox for our next flash drop.</span>

                    {/* Lightweight confetti burst */}
                    {!prefersReducedMotion && (
                      <div className="pointer-events-none absolute left-4 top-1/2">
                        {[
                          { x: -18, y: -22, c: '#1F5BFF' },
                          { x: 16, y: -26, c: '#19C3FF' },
                          { x: 28, y: -10, c: '#F4B942' },
                          { x: -24, y: 12, c: '#10B981' },
                          { x: 12, y: 18, c: '#1F5BFF' },
                        ].map((dot, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                            animate={{ x: dot.x, y: dot.y, scale: 0, opacity: 0 }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            style={{ backgroundColor: dot.c }}
                            className="absolute w-2 h-2 rounded-full"
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
