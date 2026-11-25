import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { GitCompareArrows, ShoppingBag, Star, X } from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { formatPKR } from '../data/storeContent';
import { useStore } from '../context/StoreContext';
import { SmartImage } from './SmartImage';

export const CompareModal: React.FC = () => {
  const {
    compareIds,
    toggleCompare,
    clearCompare,
    isCompareOpen,
    setIsCompareOpen,
    addToCart,
  } = useStore();

  const comparedProducts = PRODUCTS.filter((p) => compareIds.includes(p.id));
  if (comparedProducts.length === 0) return null;

  const allSpecKeys = Array.from(
    new Set(comparedProducts.flatMap((p) => Object.keys(p.specs)))
  );

  return (
    <>
      {/* Floating Compare Bar */}
      {!isCompareOpen && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 rounded-full border border-[#E8EDF5] dark:border-white/15 bg-white/95 dark:bg-[#0C1530]/95 backdrop-blur-xl px-4 py-2 shadow-[0_16px_44px_rgba(10,92,255,0.2)]">
          <div className="flex items-center gap-2 text-xs font-medium text-[#0B1220] dark:text-white">
            <GitCompareArrows className="w-4 h-4 text-[#0A5CFF]" />
            <span>Compare ({comparedProducts.length}/3)</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCompareOpen(true)}
            className="rounded-full bg-[#0A5CFF] text-white px-3.5 py-1.5 text-xs font-medium hover:bg-[#084CE0] transition-colors whitespace-nowrap"
          >
            View Side-by-Side
          </button>
          <button
            type="button"
            onClick={clearCompare}
            aria-label="Clear compare"
            className="p-1 text-slate-400 hover:text-[#0B1220] dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Side-by-Side Modal */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCompareOpen(false)}
              className="fixed inset-0 bg-[#070B16]/65 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative z-10 w-full max-w-4xl max-h-[85vh] overflow-auto rounded-[28px] border border-[#E8EDF5] dark:border-white/15 bg-white dark:bg-[#0C1530] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E8EDF5] dark:border-white/10">
                <h3 className="font-display text-xl font-semibold text-[#0B1220] dark:text-white">
                  Hardware Specification Comparison
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCompareOpen(false)}
                  className="w-9 h-9 rounded-full bg-[#F3F7FF] dark:bg-white/10 flex items-center justify-center text-[#0B1220] dark:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[540px]">
                  <thead>
                    <tr>
                      <th className="w-36 p-3 text-xs uppercase tracking-wider text-[#4B5563] dark:text-slate-400 align-top">
                        Product
                      </th>
                      {comparedProducts.map((p) => (
                        <th key={p.id} className="p-3 align-top">
                          <div className="relative rounded-2xl border border-[#E8EDF5] dark:border-white/10 p-3 bg-[#F3F7FF]/60 dark:bg-[#070B16]/60">
                            <button
                              type="button"
                              onClick={() => toggleCompare(p)}
                              aria-label="Remove from compare"
                              className="absolute top-2 right-2 p-1 rounded-full bg-white dark:bg-white/10 text-slate-400 hover:text-rose-500"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2">
                              <SmartImage src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <Link
                              to={`/product/${p.slug}`}
                              onClick={() => setIsCompareOpen(false)}
                              className="font-display text-sm font-semibold text-[#0B1220] dark:text-white line-clamp-2 hover:text-[#0A5CFF]"
                            >
                              {p.name}
                            </Link>
                            <p className="mt-1 font-mono-num text-base font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
                              {formatPKR(p.price)}
                            </p>
                            <button
                              type="button"
                              onClick={() => addToCart(p)}
                              className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0A5CFF] text-white py-2 text-xs font-medium"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" /> Add
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EDF5] dark:divide-white/10 text-sm">
                    <tr>
                      <td className="p-3 font-medium text-[#4B5563] dark:text-slate-400">Brand</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="p-3 text-[#0B1220] dark:text-white font-medium">
                          {p.brand}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-[#4B5563] dark:text-slate-400">Rating</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="p-3">
                          <span className="inline-flex items-center gap-1 font-mono-num text-[#0B1220] dark:text-white">
                            <Star className="w-3.5 h-3.5 fill-[#F4B942] text-[#F4B942]" />
                            {p.rating.toFixed(1)} ({p.reviewCount})
                          </span>
                        </td>
                      ))}
                    </tr>
                    {allSpecKeys.map((key) => (
                      <tr key={key}>
                        <td className="p-3 font-medium text-[#4B5563] dark:text-slate-400">
                          {key}
                        </td>
                        {comparedProducts.map((p) => (
                          <td key={p.id} className="p-3 text-[#0B1220] dark:text-slate-200">
                            {p.specs[key] || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
