import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, MessageCircle, Share2, ShoppingBag } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { BRAND_LOGO_PATH } from '../data/images';
import {
  STORE_INFO,
  buildProductWhatsAppUrl,
  formatPKR,
} from '../data/storeContent';
import { useStore } from '../context/StoreContext';
import { SmartImage } from '../components/SmartImage';

export const CatalogPage: React.FC = () => {
  const { addToCart, showToast } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const items = useMemo(() => {
    if (selectedCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.categorySlug === selectedCategory);
  }, [selectedCategory]);

  const catalogUrl =
    typeof window !== 'undefined' ? window.location.href : '';

  const shareCatalogWhatsApp = `${STORE_INFO.whatsappBase.replace(
    '/923298025766',
    ''
  )}/?text=${encodeURIComponent(
    `Check out the full PRIME COMPUTER ACCESSORIES PKR Price Catalog (Sialkot · Cash on Delivery): ${catalogUrl}`
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(catalogUrl);
      showToast('Catalog Link Copied', 'Ready to share on WhatsApp or Facebook.', 'success');
    } catch {
      showToast('Share Catalog', catalogUrl, 'info');
    }
  };

  return (
    <div className="bg-[#F3F7FF]/45 dark:bg-transparent py-10 sm:py-14 pb-24 sm:pb-16">
      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Compact Screenshot-Ready Brand Header */}
        <div className="rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={BRAND_LOGO_PATH}
              alt="PRIME COMPUTER ACCESSORIES"
              className="h-12 sm:h-14 w-auto object-contain dark:rounded-xl dark:bg-white dark:px-2 dark:py-0.5 shrink-0"
            />
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-semibold text-[#0B1220] dark:text-white">
                2026 Price List &amp; Quick Catalog
              </h1>
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-slate-300">
                100% Original · Open Parcel COD · WhatsApp{' '}
                <span className="font-mono-num font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                  {STORE_INFO.phoneRaw}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={shareCatalogWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share on WhatsApp
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full border border-[#CBD5E1] dark:border-white/15 px-4 py-2 text-xs font-semibold text-[#0B1220] dark:text-white hover:border-[#1F5BFF]"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Link
            </button>
          </div>
        </div>

        {/* Category Quick Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#1F5BFF] text-white'
                : 'bg-white dark:bg-[#0C1530] border border-[#E8EDF5] dark:border-white/10 text-[#0B1220] dark:text-slate-200'
            }`}
          >
            All ({PRODUCTS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-[#1F5BFF] text-white'
                  : 'bg-white dark:bg-[#0C1530] border border-[#E8EDF5] dark:border-white/10 text-[#0B1220] dark:text-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Compact Screenshot-Friendly Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {items.map((p) => {
            const discountPct =
              p.oldPrice && p.oldPrice > p.price
                ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                : 0;
            const waUrl = buildProductWhatsAppUrl(p.name, p.price, p.slug, 1);

            return (
              <div
                key={p.id}
                className="flex items-center gap-3.5 rounded-2xl border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-3 shadow-sm"
              >
                <Link
                  to={`/product/${p.slug}`}
                  className="w-20 h-20 rounded-xl overflow-hidden bg-[#F3F7FF] dark:bg-[#070B16] shrink-0"
                >
                  <SmartImage
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-[#4B5563] dark:text-slate-400">
                    <span className="font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                      {p.brand} · {p.categoryName}
                    </span>
                    {discountPct > 0 && (
                      <span className="rounded-full bg-[#F4B942] px-1.5 py-0.5 text-[10px] font-semibold text-[#0B1220]">
                        -{discountPct}%
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/product/${p.slug}`}
                    className="mt-0.5 block font-display text-xs sm:text-sm font-semibold text-[#0B1220] dark:text-white line-clamp-1 hover:text-[#1F5BFF]"
                  >
                    {p.name}
                  </Link>

                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="font-mono-num text-sm font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                      {formatPKR(p.price)}
                    </span>
                    {p.oldPrice && (
                      <span className="font-mono-num text-[11px] text-slate-400 line-through">
                        {formatPKR(p.oldPrice)}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => addToCart(p)}
                      className="min-h-[36px] px-3 rounded-full bg-[#1F5BFF] text-white text-[11px] font-semibold inline-flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Cart
                    </button>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[36px] px-3 rounded-full bg-emerald-600 text-white text-[11px] font-semibold inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
