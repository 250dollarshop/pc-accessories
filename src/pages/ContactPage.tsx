import React, { useState } from 'react';
import { ExternalLink, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { STORE_INFO } from '../data/storeContent';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${STORE_INFO.email}?subject=${encodeURIComponent(
      `[PRIME COMPUTER ACCESSORIES] ${subject} — ${name}`
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;
    window.location.href = mailtoUrl;
    showToast('Opening Email Client', `Sending inquiry to ${STORE_INFO.email}`, 'info');
  };

  return (
    <div className="bg-[#F3F7FF]/40 dark:bg-transparent py-12 sm:py-16">
      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
            Direct Store Support · Reply in 5 Minutes
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B1220] dark:text-white tracking-tight">
            Contact{' '}
            <span className="bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] bg-clip-text text-transparent">
              PRIME COMPUTER ACCESSORIES
            </span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#4B5563] dark:text-slate-300">
            Questions about stock, compatibility, bulk corporate orders, or warranty claims?
            Reach our Sialkot support desk directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Info & Map Card */}
          <div className="lg:col-span-5 space-y-4">
            <a
              href={STORE_INFO.whatsappBase}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-6 hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-[#0B1220] dark:text-white">
                    WhatsApp &amp; Phone Support
                  </h2>
                  <p className="font-mono-num text-sm font-semibold text-[#1F5BFF] dark:text-[#19C3FF] mt-1">
                    {STORE_INFO.phoneRaw}
                  </p>
                  <p className="text-xs text-[#4B5563] dark:text-slate-400 mt-1">
                    Reply in 5 minutes · Daily 10:00 AM – 11:00 PM PKT
                  </p>
                </div>
              </div>
            </a>

            <a
              href={`mailto:${STORE_INFO.email}`}
              className="block rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-6 hover:border-[#1F5BFF] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#1F5BFF]/12 text-[#1F5BFF] dark:text-[#19C3FF] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-[#0B1220] dark:text-white">
                    Official Store Email
                  </h2>
                  <p className="text-sm font-semibold text-[#1F5BFF] dark:text-[#19C3FF] mt-1 break-all">
                    {STORE_INFO.email}
                  </p>
                  <p className="text-xs text-[#4B5563] dark:text-slate-400 mt-1">
                    Corporate quotations, bulk orders &amp; warranty claims
                  </p>
                </div>
              </div>
            </a>

            {/* Sialkot Address + Interactive Map Placeholder Card */}
            <div className="rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] overflow-hidden">
              <div className="p-6 pb-4 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#1F5BFF]/12 text-[#1F5BFF] dark:text-[#19C3FF] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-[#0B1220] dark:text-white">
                    Store Dispatch Center
                  </h2>
                  <p className="text-sm text-[#0B1220] dark:text-slate-200 mt-1">
                    {STORE_INFO.location}
                  </p>
                  <p className="text-xs text-[#4B5563] dark:text-slate-400 mt-0.5">
                    Same-day courier handoff across Sialkot &amp; nationwide COD
                  </p>
                </div>
              </div>

              <div className="relative h-44 bg-gradient-to-br from-[#EAF2FF] via-[#F3F7FF] to-[#D8E8FF] dark:from-[#070B16] dark:to-[#10204A] bg-circuit-light dark:bg-circuit-dark border-t border-[#E8EDF5] dark:border-white/10 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-[#0C1530] shadow-lg flex items-center justify-center text-[#1F5BFF] mb-2">
                  <MapPin className="w-6 h-6" />
                </div>
                <p className="font-display text-sm font-semibold text-[#0B1220] dark:text-white">
                  Sialkot, Punjab, Pakistan
                </p>
                <a
                  href="https://maps.google.com/?q=Sialkot,Punjab,Pakistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 min-h-[40px] inline-flex items-center gap-1.5 rounded-full bg-[#1F5BFF] text-white px-4 py-1.5 text-xs font-semibold shadow-md hover:bg-[#1648D6] transition-colors"
                >
                  Open Sialkot on Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <a
              href={`tel:${STORE_INFO.phoneRaw}`}
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#0C1530] py-3.5 text-sm font-semibold text-[#0B1220] dark:text-white hover:border-[#1F5BFF]"
            >
              <Phone className="w-4 h-4 text-[#1F5BFF]" />
              Call {STORE_INFO.phoneRaw}
            </a>
          </div>

          {/* Email Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 rounded-[28px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-6 sm:p-8 shadow-sm space-y-5 h-fit"
          >
            <h2 className="font-display text-xl font-semibold text-[#0B1220] dark:text-white">
              Send Us a Message
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Bilal Ahmed"
                  className="w-full min-h-[46px] rounded-2xl border border-[#CBD5E1] dark:border-white/15 bg-transparent px-4 py-3 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#1F5BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1.5">
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full min-h-[46px] rounded-2xl border border-[#CBD5E1] dark:border-white/15 bg-transparent px-4 py-3 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#1F5BFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1.5">
                Topic
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full min-h-[46px] rounded-2xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#070B16] px-4 py-3 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#1F5BFF]"
              >
                <option value="Product Inquiry">Product &amp; Compatibility Inquiry</option>
                <option value="Order Status">Order Status / Tracking</option>
                <option value="Warranty Claim">7-Day Replacement Warranty</option>
                <option value="Bulk Order">Corporate / Bulk Office Setup</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1.5">
                Message *
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what hardware or setup help you need..."
                className="w-full rounded-2xl border border-[#CBD5E1] dark:border-white/15 bg-transparent px-4 py-3 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#1F5BFF]"
              />
            </div>

            <button
              type="submit"
              className="btn-shine min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(31,91,255,0.28)]"
            >
              <Send className="w-4 h-4" />
              Send to {STORE_INFO.email}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
