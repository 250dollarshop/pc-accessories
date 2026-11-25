import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronDown,
  ChevronRight,
  Gamepad2,
  HardDrive,
  Headphones,
  Heart,
  Keyboard,
  Laptop,
  Menu,
  Monitor,
  Moon,
  Mouse,
  Search,
  ShoppingBag,
  Sun,
  User,
  Video,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import { ANNOUNCEMENTS, formatPKR } from '../data/storeContent';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { BRAND_LOGO_PATH } from '../data/images';
import { useStore } from '../context/StoreContext';
import { SmartImage } from './SmartImage';

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

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    cartCount,
    setIsCartOpen,
    cartPulse,
    wishlist,
  } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [searchOpen]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 4);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  const featuredMegaProduct = PRODUCTS[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* A) Slim Closable Announcement Bar */}
      <AnimatePresence initial={false}>
        {showAnnouncement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 34, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden bg-gradient-to-r from-[#1F5BFF] via-[#0B74FF] to-[#19C3FF] text-white"
          >
            <div className="max-w-7xl mx-auto h-full px-10 flex items-center justify-center text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={announcementIdx}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-[11px] sm:text-xs font-medium tracking-[0.04em] truncate"
                >
                  {ANNOUNCEMENTS[announcementIdx]}
                </motion.p>
              </AnimatePresence>
              <button
                type="button"
                onClick={() => setShowAnnouncement(false)}
                aria-label="Close announcement"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-white/85 hover:text-white hover:bg-white/15 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* B) Main Sticky Dark Premium Navbar */}
      <div
        className={`relative border-b border-[#1E2B4D] transition-all duration-200 ${
          scrolled
            ? 'bg-[rgba(10,13,20,0.85)] backdrop-blur-xl shadow-[0_14px_40px_rgba(0,0,0,0.45)]'
            : 'bg-[#0A0D14]'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-200 ${
            scrolled ? 'h-[66px]' : 'h-[74px]'
          }`}
        >
          {/* Left: Mobile Menu + Logo inside rounded white card */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-white hover:text-[#1F5BFF] hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" strokeWidth={1.65} />
            </button>

            <Link
              to="/"
              className="inline-flex items-center shrink-0 bg-white px-[10px] py-[6px] rounded-[12px] shadow-[0_6px_18px_rgba(0,0,0,0.28)] hover:scale-[1.02] transition-transform focus-visible:outline-2 focus-visible:outline-[#1F5BFF]"
              aria-label="PRIME COMPUTER ACCESSORIES Home"
            >
              <img
                src={BRAND_LOGO_PATH}
                alt="PRIME COMPUTER ACCESSORIES"
                className="h-[40px] lg:h-[48px] w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center: Navigation Links + Mega-Menu */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#C9D1DE]"
          >
            <Link
              to="/"
              className={`relative whitespace-nowrap shrink-0 py-2 transition-colors hover:text-white after:content-[''] after:absolute after:left-0 after:bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:rounded-full after:bg-[#1F5BFF] after:transition-transform after:duration-200 ${
                location.pathname === '/' ? 'text-white' : ''
              }`}
            >
              Home
              {location.pathname === '/' && (
                <motion.span
                  layoutId="nav-active-underline"
                  className="absolute left-0 bottom-1 h-[2px] w-full rounded-full bg-[#1F5BFF]"
                />
              )}
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <Link
                to="/shop"
                className={`relative inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-2 transition-colors hover:text-white after:content-[''] after:absolute after:left-0 after:bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:rounded-full after:bg-[#1F5BFF] after:transition-transform after:duration-200 ${
                  location.pathname === '/shop' && !location.search.includes('deals=flash')
                    ? 'text-white'
                    : ''
                }`}
              >
                Shop
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    megaOpen ? 'rotate-180' : ''
                  }`}
                />
                {location.pathname === '/shop' && !location.search.includes('deals=flash') && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute left-0 bottom-1 h-[2px] w-full rounded-full bg-[#1F5BFF]"
                  />
                )}
              </Link>

              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[720px] z-50"
                  >
                    <div className="rounded-[24px] border border-[#1E2B4D] bg-[#0B1224]/98 backdrop-blur-2xl shadow-[0_28px_70px_rgba(0,0,0,0.55)] p-6 grid grid-cols-12 gap-6">
                      <div className="col-span-7">
                        <p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#C9D1DE]/80 mb-3">
                          All 10 Hardware Categories
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {CATEGORIES.map((cat) => (
                            <Link
                              key={cat.slug}
                              to={`/shop?category=${cat.slug}`}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#C9D1DE] hover:bg-[#101A33] hover:text-white transition-colors"
                            >
                              <span className="text-[#19C3FF]">
                                {CATEGORY_ICON_MAP[cat.iconName]}
                              </span>
                              <span className="truncate">{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-5 rounded-2xl bg-[#101A33] p-4 border border-[#1E2B4D] flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#19C3FF]">
                            Featured Flagship
                          </span>
                          <div className="mt-2 aspect-[4/3] rounded-xl overflow-hidden bg-[#0B1224] border border-[#1E2B4D]">
                            <SmartImage
                              src={featuredMegaProduct.images[0]}
                              alt={featuredMegaProduct.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="mt-2.5 font-display text-sm font-semibold text-white line-clamp-2">
                            {featuredMegaProduct.name}
                          </h4>
                          <p className="mt-1 font-mono-num text-sm font-semibold text-[#19C3FF]">
                            {formatPKR(featuredMegaProduct.price)}
                          </p>
                        </div>
                        <Link
                          to={`/product/${featuredMegaProduct.slug}`}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#19C3FF] hover:text-white transition-colors"
                        >
                          View Product <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/shop?deals=flash"
              className={`relative inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 py-2 transition-colors hover:text-white after:content-[''] after:absolute after:left-0 after:bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:rounded-full after:bg-[#1F5BFF] after:transition-transform after:duration-200 ${
                location.search.includes('deals=flash') ? 'text-white' : ''
              }`}
            >
              <span>Flash Deals</span>
              <span className="rounded-full bg-[#F4B942] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-[#0B1220] tracking-wider animate-pulse">
                HOT
              </span>
              {location.search.includes('deals=flash') && (
                <motion.span
                  layoutId="nav-active-underline"
                  className="absolute left-0 bottom-1 h-[2px] w-full rounded-full bg-[#1F5BFF]"
                />
              )}
            </Link>

            <Link
              to="/catalog"
              className={`relative whitespace-nowrap shrink-0 py-2 transition-colors hover:text-white after:content-[''] after:absolute after:left-0 after:bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:rounded-full after:bg-[#1F5BFF] after:transition-transform after:duration-200 ${
                location.pathname === '/catalog' ? 'text-white' : ''
              }`}
            >
              Catalog
              {location.pathname === '/catalog' && (
                <motion.span
                  layoutId="nav-active-underline"
                  className="absolute left-0 bottom-1 h-[2px] w-full rounded-full bg-[#1F5BFF]"
                />
              )}
            </Link>

            <Link
              to="/about"
              className={`relative whitespace-nowrap shrink-0 py-2 transition-colors hover:text-white after:content-[''] after:absolute after:left-0 after:bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:rounded-full after:bg-[#1F5BFF] after:transition-transform after:duration-200 ${
                location.pathname === '/about' ? 'text-white' : ''
              }`}
            >
              About
              {location.pathname === '/about' && (
                <motion.span
                  layoutId="nav-active-underline"
                  className="absolute left-0 bottom-1 h-[2px] w-full rounded-full bg-[#1F5BFF]"
                />
              )}
            </Link>

            <Link
              to="/contact"
              className={`relative whitespace-nowrap shrink-0 py-2 transition-colors hover:text-white after:content-[''] after:absolute after:left-0 after:bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:rounded-full after:bg-[#1F5BFF] after:transition-transform after:duration-200 ${
                location.pathname === '/contact' ? 'text-white' : ''
              }`}
            >
              Contact
              {location.pathname === '/contact' && (
                <motion.span
                  layoutId="nav-active-underline"
                  className="absolute left-0 bottom-1 h-[2px] w-full rounded-full bg-[#1F5BFF]"
                />
              )}
            </Link>
          </nav>

          {/* Right: 44px White Thin Line Icons + Royal Blue Cart Pill */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search products"
              className="w-11 h-11 rounded-full flex items-center justify-center text-white hover:text-[#1F5BFF] hover:bg-white/10 transition-colors"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.65} />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white hover:text-[#1F5BFF] hover:bg-white/10 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-[18px] h-[18px]" strokeWidth={1.65} />
              ) : (
                <Sun className="w-[18px] h-[18px]" strokeWidth={1.65} />
              )}
            </button>

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="hidden sm:flex relative w-11 h-11 rounded-full items-center justify-center text-white hover:text-[#1F5BFF] hover:bg-white/10 transition-colors"
            >
              <Heart className="w-[18px] h-[18px]" strokeWidth={1.65} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#1F5BFF] text-white text-[10px] font-mono-num font-semibold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/account"
              aria-label="My Account"
              className="hidden sm:flex w-11 h-11 rounded-full items-center justify-center text-white hover:text-[#1F5BFF] hover:bg-white/10 transition-colors"
            >
              <User className="w-[18px] h-[18px]" strokeWidth={1.65} />
            </Link>

            <motion.button
              type="button"
              data-cart-target="true"
              onClick={() => setIsCartOpen(true)}
              animate={
                cartPulse
                  ? { rotate: [0, -14, 14, -8, 5, 0], scale: [1, 1.15, 1] }
                  : { rotate: 0, scale: 1 }
              }
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Open shopping cart"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] px-3.5 sm:px-4 min-h-[44px] text-sm font-medium text-white shadow-[0_6px_20px_rgba(31,91,255,0.34)] hover:shadow-[0_10px_28px_rgba(31,91,255,0.45)] transition-all whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.8} />
              <span className="font-mono-num font-semibold">{cartCount}</span>
            </motion.button>
          </div>
        </div>

        {/* Expanding Live Search Panel (Dark Navy #0B1224 + Input #101A33) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-x-0 top-full border-b border-[#1E2B4D] bg-[#0B1224]/98 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.55)] z-50"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2.5">
                  <div className="flex-1 flex items-center gap-2.5 rounded-2xl bg-[#101A33] border border-[#1E2B4D] px-4 focus-within:border-[#1F5BFF] focus-within:ring-2 focus-within:ring-[#1F5BFF]/60 transition-all">
                    <Search className="w-4 h-4 text-[#19C3FF] shrink-0" strokeWidth={1.8} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search keyboards, wireless mice, 4K monitors..."
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-slate-400 focus:outline-none py-3"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-shine min-h-[44px] rounded-full bg-[#1F5BFF] hover:bg-[#19C3FF] text-white px-5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close search"
                    className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-[#C9D1DE] hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-[#1E2B4D]">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-[#C9D1DE]/75 mb-3">
                    {searchQuery.trim() ? 'Matching Products' : 'Popular Hardware'}
                  </p>
                  {searchResults.length === 0 ? (
                    <p className="text-sm text-[#C9D1DE] py-3">
                      No matching hardware found. Try searching "Logitech", "Razer", or "Monitor".
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.map((item) => (
                        <Link
                          key={item.id}
                          to={`/product/${item.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[#101A33] border border-transparent hover:border-[#1E2B4D] transition-colors"
                        >
                          <div className="w-14 h-12 rounded-xl overflow-hidden bg-[#101A33] border border-[#1E2B4D] shrink-0">
                            <SmartImage
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">
                              {item.name}
                            </p>
                            <p className="text-xs font-mono-num font-semibold text-[#19C3FF]">
                              {formatPKR(item.price)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full-Screen Animated Mobile Menu (Dark Navy #0B1224) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#0B1224] text-white flex flex-col overflow-y-auto pb-24"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2B4D] bg-[#0A0D14]">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center bg-white px-[10px] py-[6px] rounded-[12px]"
              >
                <img
                  src={BRAND_LOGO_PATH}
                  alt="PRIME COMPUTER ACCESSORIES"
                  className="h-[40px] w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="w-11 h-11 rounded-full bg-[#101A33] border border-[#1E2B4D] text-white hover:text-[#1F5BFF] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6 flex-1">
              <nav className="flex flex-col gap-2">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/shop', label: 'All Products' },
                  { to: '/catalog', label: 'Shareable Price Catalog' },
                  { to: '/shop?deals=flash', label: 'Flash Deals' },
                  { to: '/wishlist', label: `Wishlist (${wishlist.length})` },
                  { to: '/account', label: 'My Account & Orders' },
                  { to: '/about', label: 'About Us' },
                  { to: '/contact', label: 'Contact & Support' },
                  { to: '/faq', label: 'FAQ' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[46px] flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium text-white hover:bg-[#101A33] border border-transparent hover:border-[#1E2B4D] transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#19C3FF]" />
                  </Link>
                ))}
              </nav>

              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#C9D1DE]/80 px-2 mb-3">
                  Browse Categories
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/shop?category=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="min-h-[44px] flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#1E2B4D] bg-[#101A33]/75 text-xs font-medium text-[#C9D1DE] hover:text-white hover:border-[#1F5BFF] transition-colors"
                    >
                      <span className="text-[#19C3FF]">
                        {CATEGORY_ICON_MAP[cat.iconName]}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
