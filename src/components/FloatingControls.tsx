import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Gift,
  Info,
  MessageCircle,
  Phone,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO, formatPKR } from '../data/storeContent';

export const FloatingControls: React.FC = () => {
  const {
    toasts,
    dismissToast,
    cartCount,
    cartSubtotal,
    claimedOfferPhone,
    claimFirstOrderOffer,
  } = useStore();
  const location = useLocation();
  const [showTop, setShowTop] = useState(false);

  // Returning / Saved Cart "Complete your order" reminder
  const [reminderDismissed, setReminderDismissed] = useState(false);

  // 20-second / Exit-intent "Get 5% off your first order" modal (max once per session)
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerPhone, setOfferPhone] = useState('');
  const [offerError, setOfferError] = useState('');

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Trigger 5% off popup after 20s dwell OR desktop exit-intent (if not already claimed or seen this session)
  useEffect(() => {
    if (claimedOfferPhone) return;
    try {
      if (sessionStorage.getItem('pca_offer_seen') === '1') return;
    } catch {
      // ignore
    }

    const triggerOnce = () => {
      try {
        if (sessionStorage.getItem('pca_offer_seen') === '1') return;
        sessionStorage.setItem('pca_offer_seen', '1');
      } catch {
        // ignore
      }
      setOfferModalOpen(true);
    };

    const timer = setTimeout(triggerOnce, 20000);
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 4) {
        triggerOnce();
      }
    };
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [claimedOfferPhone]);

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = offerPhone.trim();
    if (cleaned.length < 10) {
      setOfferError('Please enter a valid WhatsApp number (e.g. 0300 1234567).');
      return;
    }
    setOfferError('');
    claimFirstOrderOffer(cleaned);
    setOfferModalOpen(false);
  };

  const showCartReminder =
    cartCount > 0 &&
    !reminderDismissed &&
    location.pathname !== '/checkout' &&
    !location.pathname.startsWith('/order-confirmation');

  const isProductPage = location.pathname.startsWith('/product/');

  return (
    <>
      {/* Toast Stack */}
      <div className="fixed top-24 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-2rem)] sm:w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-[#E8EDF5] dark:border-white/15 bg-white/95 dark:bg-[#0C1530]/95 backdrop-blur-xl p-4 shadow-[0_16px_40px_rgba(31,91,255,0.16)]"
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-[#1F5BFF] dark:text-[#19C3FF] shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-[#1F5BFF] dark:text-[#19C3FF] shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-semibold text-[#0B1220] dark:text-white">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-xs text-[#4B5563] dark:text-slate-300 mt-0.5 line-clamp-2">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="p-1 text-slate-400 hover:text-[#0B1220] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Saved Cart Reminder ("Complete your order") */}
      <AnimatePresence>
        {showCartReminder && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-20 sm:bottom-6 left-4 z-30 max-w-xs rounded-2xl border border-[#E8EDF5] dark:border-white/15 bg-white/95 dark:bg-[#0C1530]/95 backdrop-blur-xl p-3.5 shadow-[0_16px_44px_rgba(31,91,255,0.18)] flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1F5BFF]/10 text-[#1F5BFF] dark:text-[#19C3FF] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xs font-semibold text-[#0B1220] dark:text-white truncate">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in cart · {formatPKR(cartSubtotal)}
              </p>
              <Link
                to="/checkout"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F5BFF] dark:text-[#19C3FF] hover:underline mt-0.5"
              >
                Complete your order <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setReminderDismissed(true)}
              aria-label="Dismiss cart reminder"
              className="p-1 text-slate-400 hover:text-[#0B1220] dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop & Tablet Floating WhatsApp Button ("Chat with us, reply in 5 minutes") + Back-to-Top */}
      <div className="hidden sm:flex fixed bottom-5 right-5 z-40 flex-col items-end gap-3">
        <AnimatePresence>
          {showTop && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="w-11 h-11 rounded-full border border-[#E8EDF5] dark:border-white/15 bg-white/95 dark:bg-[#0C1530]/95 backdrop-blur-xl text-[#0B1220] dark:text-white shadow-lg flex items-center justify-center hover:border-[#1F5BFF] hover:text-[#1F5BFF] transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        <a
          href={`${STORE_INFO.whatsappBase}?text=${encodeURIComponent(
            'Assalam-o-Alaikum PRIME COMPUTER ACCESSORIES! I need help with an order.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="animate-wobble-8s group relative flex items-center gap-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white pl-4 pr-5 min-h-[48px] shadow-[0_14px_34px_rgba(16,185,129,0.38)] transition-all hover:-translate-y-0.5"
        >
          <span className="absolute -inset-1 rounded-full bg-emerald-400/35 animate-ping pointer-events-none" />
          <MessageCircle className="relative w-5 h-5 shrink-0" />
          <div className="relative text-left leading-tight">
            <span className="block text-xs font-semibold whitespace-nowrap">
              Chat with us
            </span>
            <span className="block text-[10px] text-emerald-100 whitespace-nowrap">
              reply in 5 minutes
            </span>
          </div>
        </a>
      </div>

      {/* Mobile Always-Visible Sticky Bottom Bar ("Order on WhatsApp" green + "Call Now") */}
      {!isProductPage && (
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[#E8EDF5] dark:border-white/15 bg-white/95 dark:bg-[#070B16]/95 backdrop-blur-xl px-3 py-2 shadow-[0_-10px_30px_rgba(11,18,32,0.08)]">
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`${STORE_INFO.whatsappBase}?text=${encodeURIComponent(
                'Assalam-o-Alaikum PRIME COMPUTER ACCESSORIES! I want to place an order.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-md"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Order on WhatsApp</span>
            </a>
            <a
              href={`tel:${STORE_INFO.phoneRaw}`}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full bg-[#1F5BFF] text-white text-xs font-semibold shadow-md"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      )}

      {/* 20-Second / Exit-Intent 5% Off First Order Popup */}
      <AnimatePresence>
        {offerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOfferModalOpen(false)}
              className="fixed inset-0 bg-[#070B16]/65 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              className="relative z-10 w-full max-w-md rounded-[28px] border border-[#E8EDF5] dark:border-white/15 bg-white dark:bg-[#0C1530] p-6 sm:p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setOfferModalOpen(false)}
                aria-label="Close offer"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#F3F7FF] dark:bg-white/10 flex items-center justify-center text-[#0B1220] dark:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F5BFF] to-[#19C3FF] text-white flex items-center justify-center mb-4">
                <Gift className="w-6 h-6" />
              </div>

              <h3 className="font-display text-2xl font-semibold text-[#0B1220] dark:text-white">
                Get 5% off your first order
              </h3>
              <p className="mt-2 text-sm text-[#4B5563] dark:text-slate-300 leading-relaxed">
                Enter your WhatsApp number to unlock an instant 5% discount at checkout—plus
                priority Cash on Delivery dispatch from Sialkot.
              </p>

              <form onSubmit={handleOfferSubmit} className="mt-5 space-y-3">
                <input
                  type="tel"
                  value={offerPhone}
                  onChange={(e) => setOfferPhone(e.target.value)}
                  placeholder="0300 1234567"
                  aria-label="WhatsApp phone number"
                  className="w-full min-h-[46px] rounded-2xl border border-[#CBD5E1] dark:border-white/15 bg-transparent px-4 py-3 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#1F5BFF]"
                />
                {offerError && (
                  <p className="text-xs text-rose-500">{offerError}</p>
                )}
                <button
                  type="submit"
                  className="btn-shine w-full min-h-[46px] rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] text-white text-sm font-semibold shadow-[0_10px_28px_rgba(31,91,255,0.3)]"
                >
                  Unlock 5% Discount Now
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
