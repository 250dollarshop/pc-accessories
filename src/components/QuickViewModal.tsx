import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, MessageCircle, ShoppingBag, Star, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPKR, STORE_INFO } from '../data/storeContent';
import { SmartImage } from './SmartImage';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useStore();
  const [selectedVariant, setSelectedVariant] = useState('');
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedVariant(quickViewProduct.variants[0]?.label || '');
      setActiveImgIdx(0);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const variantObj = quickViewProduct.variants.find((v) => v.label === selectedVariant);
  const unitPrice = quickViewProduct.price + (variantObj?.priceDelta ?? 0);
  const whatsappText = encodeURIComponent(
    `Hello PRIME COMPUTER ACCESSORIES, I want to order:\n• ${quickViewProduct.name} (${selectedVariant})\n• Price: ${formatPKR(unitPrice)}`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-[#070B16]/65 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-3xl rounded-[28px] border border-[#E8EDF5] dark:border-white/15 bg-white dark:bg-[#0C1530] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12"
        >
          <button
            type="button"
            onClick={() => setQuickViewProduct(null)}
            aria-label="Close quick view"
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-[#070B16]/90 border border-[#E8EDF5] dark:border-white/15 flex items-center justify-center text-[#0B1220] dark:text-white hover:bg-[#0A5CFF] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="md:col-span-6 p-6 bg-gradient-to-br from-[#F3F7FF] to-[#E6EEFF] dark:from-[#070B16] dark:to-[#101C3E] flex flex-col justify-between gap-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white dark:bg-[#0C1530]">
              <SmartImage
                src={quickViewProduct.images[activeImgIdx] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {quickViewProduct.images.length > 1 && (
              <div className="flex items-center gap-2">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIdx(idx)}
                    className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImgIdx === idx
                        ? 'border-[#0A5CFF]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <SmartImage src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-6 p-6 sm:p-7 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-[0.15em] font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
                  {quickViewProduct.brand} · {quickViewProduct.categoryName}
                </span>
                <div className="flex items-center gap-1 pr-8">
                  <Star className="w-3.5 h-3.5 fill-[#F4B942] text-[#F4B942]" />
                  <span className="font-mono-num font-semibold text-[#0B1220] dark:text-white">
                    {quickViewProduct.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <h3 className="mt-2 font-display text-xl font-semibold text-[#0B1220] dark:text-white">
                {quickViewProduct.name}
              </h3>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-mono-num text-2xl font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
                  {formatPKR(unitPrice)}
                </span>
                {quickViewProduct.oldPrice && (
                  <span className="font-mono-num text-sm text-slate-400 line-through">
                    {formatPKR(quickViewProduct.oldPrice)}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-[#4B5563] dark:text-slate-300 leading-relaxed line-clamp-3">
                {quickViewProduct.description}
              </p>

              {/* Variants */}
              {quickViewProduct.variants.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-2">
                    Select Variant
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v.label)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          selectedVariant === v.label
                            ? 'border-[#0A5CFF] bg-[#0A5CFF]/10 text-[#0A5CFF] dark:text-[#19C3FF]'
                            : 'border-[#E8EDF5] dark:border-white/15 text-[#4B5563] dark:text-slate-300'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <ul className="mt-4 space-y-1.5">
                {quickViewProduct.highlights.slice(0, 3).map((hl) => (
                  <li
                    key={hl}
                    className="flex items-center gap-2 text-xs text-[#4B5563] dark:text-slate-300"
                  >
                    <Check className="w-3.5 h-3.5 text-[#0A5CFF] shrink-0" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-[#E8EDF5] dark:border-white/10">
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(quickViewProduct, selectedVariant);
                    setQuickViewProduct(null);
                  }}
                  className="btn-shine flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0A5CFF] to-[#19C3FF] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(10,92,255,0.28)]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <a
                  href={`${STORE_INFO.whatsappBase}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#E8EDF5] dark:border-white/15 px-4 py-3 text-sm font-medium text-[#0B1220] dark:text-white hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  WhatsApp
                </a>
              </div>
              <Link
                to={`/product/${quickViewProduct.slug}`}
                onClick={() => setQuickViewProduct(null)}
                className="block text-center text-xs font-medium text-[#0A5CFF] dark:text-[#19C3FF] hover:underline"
              >
                View Full Specifications &amp; Reviews
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
