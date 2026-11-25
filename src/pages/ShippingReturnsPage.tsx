import React from 'react';
import { Banknote, Check, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { STORE_INFO, formatPKR } from '../data/storeContent';

export const ShippingReturnsPage: React.FC = () => {
  return (
    <div className="bg-[#F3F7FF]/40 dark:bg-transparent py-12 sm:py-16">
      <div className="relative z-[2] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
            Store Policies
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B1220] dark:text-white">
            Shipping &amp; 7-Day Replacement Policy
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#4B5563] dark:text-slate-300">
            Transparent nationwide courier delivery and buyer protection from {STORE_INFO.location}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-6 sm:p-7 space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-[#0A5CFF]/12 text-[#0A5CFF] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-semibold text-[#0B1220] dark:text-white">
              Nationwide Pakistan Delivery
            </h2>
            <ul className="space-y-2.5 text-sm text-[#4B5563] dark:text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#0A5CFF] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#0B1220] dark:text-white">Free Delivery:</strong>{' '}
                  Automatic on all orders above {formatPKR(STORE_INFO.freeDeliveryThreshold)}.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#0A5CFF] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#0B1220] dark:text-white">Standard Fee:</strong>{' '}
                  Flat {formatPKR(STORE_INFO.standardShippingFee)} nationwide for orders below Rs. 15,000.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#0A5CFF] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#0B1220] dark:text-white">Transit Times:</strong>{' '}
                  1–2 working days within Punjab (Sialkot, Lahore, Gujranwala, Islamabad) &amp; 2–4 working days across Sindh, KPK &amp; Balochistan.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-6 sm:p-7 space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-[#0A5CFF]/12 text-[#0A5CFF] flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-semibold text-[#0B1220] dark:text-white">
              7-Day Replacement Warranty
            </h2>
            <ul className="space-y-2.5 text-sm text-[#4B5563] dark:text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#0A5CFF] shrink-0 mt-0.5" />
                <span>
                  Full 7-day replacement guarantee for dead-on-arrival or factory defects.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#0A5CFF] shrink-0 mt-0.5" />
                <span>
                  Keep original retail box, accessories, and warranty seal intact.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#0A5CFF] shrink-0 mt-0.5" />
                <span>
                  Message WhatsApp <span className="font-mono-num">{STORE_INFO.phoneRaw}</span> with your Order ID and unboxing clip for same-day pickup scheduling.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Banknote className="w-6 h-6 text-[#0A5CFF] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display text-base font-semibold text-[#0B1220] dark:text-white">
                Accepted Payment Channels
              </h3>
              <p className="text-sm text-[#4B5563] dark:text-slate-300 mt-0.5">
                Cash on Delivery (COD), JazzCash, Easypaisa, and IBFT / Raast Bank Transfer.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
            <ShieldCheck className="w-4 h-4" />
            100% Original Products
          </div>
        </div>
      </div>
    </div>
  );
};
