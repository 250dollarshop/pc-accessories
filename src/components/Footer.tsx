import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Mail, MapPin, MessageCircle, Phone, Rocket, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import { BRAND_LOGO_PATH } from '../data/images';
import { STORE_INFO } from '../data/storeContent';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      data-watermark-dark="true"
      className="relative bg-[#070B16] text-slate-300 bg-circuit-dark overflow-hidden pb-20 sm:pb-0"
    >
      {/* Top 2px Blue-to-Cyan Gradient Line */}
      <div className="relative z-[2] h-[2px] w-full bg-gradient-to-r from-[#1F5BFF] via-[#19C3FF] to-[#1F5BFF]" />

      {/* Soft ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-[#1F5BFF]/15 blur-3xl" />

      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              to="/"
              className="btn-shine inline-block rounded-2xl bg-white/95 p-3 shadow-[0_12px_36px_rgba(31,91,255,0.22)] border border-white/60 hover:scale-[1.02] transition-transform"
            >
              <img
                src={BRAND_LOGO_PATH}
                alt="PRIME COMPUTER ACCESSORIES"
                className="h-14 w-auto object-contain"
              />
            </Link>

            <p className="text-sm leading-relaxed text-slate-300 max-w-sm">
              Pakistan’s trusted flagship storefront for 100% original mechanical keyboards,
              wireless esports mice, 4K monitors, studio headsets, and NVMe storage—dispatched
              from Sialkot with Open Parcel Cash on Delivery.
            </p>

            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300">
              <Lock className="w-3.5 h-3.5" />
              <span>Secure Shopping · 100% Original Sealed Gear</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={STORE_INFO.whatsappBase}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-11 h-11 rounded-full bg-white/8 border border-white/15 flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-500 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${STORE_INFO.email}`}
                aria-label="Email PRIME COMPUTER ACCESSORIES"
                className="w-11 h-11 rounded-full bg-white/8 border border-white/15 flex items-center justify-center text-white hover:bg-[#1F5BFF] hover:border-[#1F5BFF] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${STORE_INFO.phoneRaw}`}
                aria-label="Call PRIME COMPUTER ACCESSORIES"
                className="w-11 h-11 rounded-full bg-white/8 border border-white/15 flex items-center justify-center text-white hover:bg-[#1F5BFF] hover:border-[#1F5BFF] transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'Shop All Gear', to: '/shop' },
                { label: 'Price Catalog', to: '/catalog' },
                { label: 'Flash Deals', to: '/shop?deals=flash' },
                { label: 'My Wishlist', to: '/wishlist' },
                { label: 'Account & Orders', to: '/account' },
                { label: 'About Us', to: '/about' },
                { label: 'Shipping & Returns', to: '/shipping-returns' },
                { label: 'FAQ', to: '/faq' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="relative inline-block py-0.5 text-slate-300 hover:text-[#19C3FF] transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:bg-[#19C3FF] after:transition-transform after:duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-white mb-4">
              Categories
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/shop?category=${cat.slug}`}
                    className="relative inline-block max-w-full py-0.5 text-slate-300 hover:text-[#19C3FF] transition-colors truncate after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:bg-[#19C3FF] after:transition-transform after:duration-200"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-white mb-4">
              Store Contact
            </h3>
            <div className="space-y-3 text-sm">
              <a
                href={STORE_INFO.whatsappBase}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-slate-300 hover:text-[#19C3FF] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#19C3FF] shrink-0 mt-0.5" />
                <div>
                  <span className="block font-mono-num font-medium text-white">
                    {STORE_INFO.phoneRaw}
                  </span>
                  <span className="text-xs text-slate-400">WhatsApp · Reply in 5 minutes</span>
                </div>
              </a>

              <a
                href={`mailto:${STORE_INFO.email}`}
                className="flex items-start gap-3 text-slate-300 hover:text-[#19C3FF] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#19C3FF] shrink-0 mt-0.5" />
                <span className="break-all">{STORE_INFO.email}</span>
              </a>

              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-[#19C3FF] shrink-0 mt-0.5" />
                <span>{STORE_INFO.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright, Payment Methods & Rocket Back-to-Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            © 2026 PRIME COMPUTER ACCESSORIES. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure Shopping
            </span>
            {['COD', 'JazzCash', 'Easypaisa', 'Bank Transfer'].map((method) => (
              <span
                key={method}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-200"
              >
                {method}
              </span>
            ))}

            <motion.button
              type="button"
              onClick={scrollToTop}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Back to top"
              className="group ml-1 inline-flex items-center gap-1.5 rounded-full border border-[#19C3FF]/40 bg-[#1F5BFF]/20 hover:bg-gradient-to-r hover:from-[#1F5BFF] hover:to-[#19C3FF] px-3.5 min-h-[36px] text-[11px] font-semibold text-white transition-colors"
            >
              <Rocket className="w-3.5 h-3.5 text-[#19C3FF] group-hover:text-white group-hover:-translate-y-1 transition-transform duration-200" />
              <span>Top</span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};
