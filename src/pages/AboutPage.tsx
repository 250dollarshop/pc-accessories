import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BadgeCheck, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { BRAND_LOGO_PATH, STORE_IMAGES } from '../data/images';
import { STORE_INFO } from '../data/storeContent';
import { SmartImage } from '../components/SmartImage';

export const AboutPage: React.FC = () => {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-white via-[#F3F7FF] to-[#DFECFF] dark:from-[#070B16] dark:via-[#0C1530] dark:to-[#0E1E44] border-b border-[#E8EDF5] dark:border-white/10 py-16 sm:py-20">
        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
              Our Story · Sialkot, Punjab, Pakistan
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0B1220] dark:text-white tracking-tight leading-tight">
              Elevating Pakistan’s{' '}
              <span className="bg-gradient-to-r from-[#0A5CFF] to-[#19C3FF] bg-clip-text text-transparent">
                Desktop Standard
              </span>
            </h1>
            <p className="text-base text-[#4B5563] dark:text-slate-300 leading-relaxed max-w-2xl">
              Founded in Sialkot, Punjab, PRIME COMPUTER ACCESSORIES was built to eliminate
              counterfeit gear and unreliable marketplaces. We curate factory-sealed
              keyboards, esports mice, 4K displays, and NVMe storage from the world’s top
              manufacturers—backed by genuine serials and Cash on Delivery across Pakistan.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/shop"
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0A5CFF] to-[#19C3FF] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(10,92,255,0.28)]"
              >
                Explore Catalog <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#0C1530] px-7 py-3.5 text-sm font-semibold text-[#0B1220] dark:text-white"
              >
                Contact Our Team
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[28px] border border-[#E8EDF5] dark:border-white/15 bg-white dark:bg-[#0C1530] p-6 shadow-[0_24px_60px_rgba(10,92,255,0.12)] space-y-5">
              <div className="rounded-2xl bg-[#F3F7FF] dark:bg-white p-4 flex justify-center">
                <img
                  src={BRAND_LOGO_PATH}
                  alt="PRIME COMPUTER ACCESSORIES"
                  className="h-20 w-auto object-contain"
                />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <SmartImage
                  src={STORE_IMAGES.heroMonitorSetup}
                  alt="Studio workstation setup"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative z-[2] py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <BadgeCheck className="w-5 h-5" />,
              title: 'Zero Counterfeits',
              desc: 'Every Logitech, Razer, Samsung, Dell, and Anker unit comes factory-sealed with verifiable serial numbers.',
            },
            {
              icon: <ShieldCheck className="w-5 h-5" />,
              title: '7-Day Replacement',
              desc: 'Clear, no-excuses replacement warranty from our Sialkot fulfillment desk.',
            },
            {
              icon: <Truck className="w-5 h-5" />,
              title: '120+ Cities Covered',
              desc: 'Insured Cash on Delivery nationwide via trusted Pakistani courier partners.',
            },
            {
              icon: <Award className="w-5 h-5" />,
              title: 'Specialist Guidance',
              desc: 'Direct WhatsApp consultation on compatibility, switches, and PC upgrades.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-[#F3F7FF]/55 dark:bg-[#0C1530] p-6"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0A5CFF] to-[#19C3FF] text-white flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h2 className="font-display text-lg font-semibold text-[#0B1220] dark:text-white">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-[#4B5563] dark:text-slate-300 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-[#F3F7FF] dark:bg-[#0C1530] p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-[#0A5CFF] shrink-0" />
            <div>
              <p className="font-display text-base font-semibold text-[#0B1220] dark:text-white">
                Headquarters &amp; Dispatch Center
              </p>
              <p className="text-sm text-[#4B5563] dark:text-slate-300">
                {STORE_INFO.location} · {STORE_INFO.email} · {STORE_INFO.phoneRaw}
              </p>
            </div>
          </div>
          <a
            href={STORE_INFO.whatsappBase}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#0A5CFF] text-white px-6 py-2.5 text-sm font-semibold whitespace-nowrap"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};
