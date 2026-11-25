import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { FAQS, STORE_INFO } from '../data/storeContent';

export const FaqPage: React.FC = () => {
  const [openId, setOpenId] = useState<string>(FAQS[0].id);

  return (
    <div className="bg-[#F3F7FF]/40 dark:bg-transparent py-12 sm:py-16">
      <div className="relative z-[2] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
            Help Center
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B1220] dark:text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-sm text-[#4B5563] dark:text-slate-300">
            Everything you need to know about authenticity, Cash on Delivery, and warranty.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-[22px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? '' : faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                >
                  <div>
                    <span className="block text-[11px] uppercase tracking-[0.15em] font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
                      {faq.category}
                    </span>
                    <span className="mt-1 block font-display text-base font-semibold text-[#0B1220] dark:text-white">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[#0A5CFF] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 text-sm text-[#4B5563] dark:text-slate-300 leading-relaxed border-t border-[#E8EDF5] dark:border-white/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#0B1220] dark:text-white">
              Still have questions?
            </h2>
            <p className="text-sm text-[#4B5563] dark:text-slate-300">
              Our Sialkot desk is ready to help via WhatsApp or email.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={STORE_INFO.whatsappBase}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 text-white px-5 py-2.5 text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <Link
              to="/contact"
              className="rounded-full bg-[#0A5CFF] text-white px-5 py-2.5 text-xs font-semibold"
            >
              Contact Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
