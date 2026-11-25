import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Eye,
  GitCompareArrows,
  Heart,
  MessageCircle,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { Product } from '../types/store';
import { buildProductWhatsAppUrl, formatPKR } from '../data/storeContent';
import { useStore } from '../context/StoreContext';
import { SmartImage } from './SmartImage';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
  index?: number;
}

const BURST_DOTS = [
  { x: -16, y: -16 },
  { x: 16, y: -16 },
  { x: -18, y: 10 },
  { x: 18, y: 10 },
  { x: 0, y: -20 },
  { x: 0, y: 18 },
];

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = 'grid',
  index = 0,
}) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    toggleCompare,
    compareIds,
  } = useStore();
  const prefersReducedMotion = useReducedMotion();
  const imgBayRef = useRef<HTMLDivElement>(null);
  const [heartBurstKey, setHeartBurstKey] = useState(0);

  const wishlisted = isInWishlist(product.id);
  const compared = compareIds.includes(product.id);
  const discountPct =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;
  const whatsappUrl = buildProductWhatsAppUrl(
    product.name,
    product.price,
    product.slug,
    1,
    product.variants[0]?.label
  );

  const secondaryImg = product.images[1] || product.images[0];
  const hasDistinctSecondary =
    Boolean(product.images[1]) && product.images[1] !== product.images[0];

  const handleAddToCart = () => {
    const rect = imgBayRef.current?.getBoundingClientRect();
    addToCart(
      product,
      undefined,
      1,
      rect
        ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
        : undefined
    );
  };

  const handleToggleWishlist = () => {
    if (!wishlisted) {
      setHeartBurstKey((k) => k + 1);
    }
    toggleWishlist(product);
  };

  if (layout === 'list') {
    return (
      <motion.article
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="group flex flex-col sm:flex-row items-stretch gap-5 rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-4 sm:p-5 shadow-[0_12px_36px_rgba(11,18,32,0.04)] hover:shadow-[0_20px_60px_rgba(31,91,255,0.12)] transition-all duration-200"
      >
        <Link
          to={`/product/${product.slug}`}
          ref={imgBayRef as unknown as React.RefObject<HTMLAnchorElement>}
          className="relative w-full sm:w-56 shrink-0 aspect-[4/3] rounded-[18px] overflow-hidden bg-gradient-to-br from-[#F3F7FF] to-[#E6EEFF] dark:from-[#0E1B3D] dark:to-[#091128]"
        >
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {hasDistinctSecondary && (
            <img
              src={secondaryImg}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}
          {discountPct > 0 && (
            <span className="absolute top-3 left-3 rounded-full bg-[#F4B942] px-2.5 py-0.5 text-[11px] font-semibold text-[#0B1220] font-mono-num">
              -{discountPct}%
            </span>
          )}
        </Link>

        <div className="flex-1 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-[#4B5563] dark:text-slate-400">
              <span className="uppercase tracking-[0.14em] font-medium text-[#1F5BFF] dark:text-[#19C3FF]">
                {product.brand}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#F4B942] text-[#F4B942]" />
                <span className="font-mono-num font-medium text-[#0B1220] dark:text-white">
                  {product.rating.toFixed(1)}
                </span>
                <span>({product.reviewCount})</span>
              </div>
            </div>
            <Link
              to={`/product/${product.slug}`}
              className="mt-1.5 block font-display text-lg font-semibold text-[#0B1220] dark:text-white hover:text-[#1F5BFF] dark:hover:text-[#19C3FF] transition-colors line-clamp-2"
            >
              {product.name}
            </Link>
            <p className="mt-1.5 text-sm text-[#4B5563] dark:text-slate-300 line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8EDF5] dark:border-white/10">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono-num text-xl font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                {formatPKR(product.price)}
              </span>
              {product.oldPrice && (
                <span className="font-mono-num text-sm text-slate-400 line-through">
                  {formatPKR(product.oldPrice)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`relative min-w-[44px] min-h-[44px] rounded-full border flex items-center justify-center transition-colors ${
                  wishlisted
                    ? 'border-[#1F5BFF] bg-[#1F5BFF]/10 text-[#1F5BFF]'
                    : 'border-[#E8EDF5] dark:border-white/15 text-[#4B5563] dark:text-slate-300 hover:border-[#1F5BFF]'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setQuickViewProduct(product)}
                aria-label="Quick view"
                className="min-w-[44px] min-h-[44px] rounded-full border border-[#E8EDF5] dark:border-white/15 text-[#4B5563] dark:text-slate-300 flex items-center justify-center hover:border-[#1F5BFF] hover:text-[#1F5BFF] transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white whitespace-nowrap shrink-0 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Order on WhatsApp
              </a>
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-shine min-h-[44px] inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] px-5 py-2.5 text-xs sm:text-sm font-medium text-white shadow-[0_8px_24px_rgba(31,91,255,0.28)] whitespace-nowrap shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              x: index % 2 === 0 ? -18 : 18,
              y: 12,
            }
      }
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{
        duration: 0.42,
        delay: Math.min((index % 4) * 0.05, 0.2),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group flex flex-col rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-4 shadow-[0_12px_32px_rgba(11,18,32,0.04)] hover:shadow-[0_24px_60px_rgba(31,91,255,0.14)] hover:-translate-y-1.5 hover:rotate-[0.6deg] transition-all duration-300"
    >
      {/* Image Bay */}
      <div
        ref={imgBayRef}
        className="relative aspect-[4/3] rounded-[18px] overflow-hidden bg-gradient-to-br from-[#F3F7FF] to-[#E6EEFF] dark:from-[#0E1B3D] dark:to-[#091128]"
      >
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-108 ${
              hasDistinctSecondary ? 'group-hover:opacity-0' : ''
            }`}
          />
          {hasDistinctSecondary && (
            <img
              src={secondaryImg}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
            />
          )}
        </Link>

        {discountPct > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-[#F4B942] px-2.5 py-0.5 text-[11px] font-semibold text-[#0B1220] font-mono-num shadow-sm">
            -{discountPct}%
          </span>
        )}

        {/* Quick hover actions (44px accessible targets, spring pop on desktop hover) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-100 lg:opacity-0 lg:scale-90 lg:translate-x-2 lg:group-hover:opacity-100 lg:group-hover:scale-100 lg:group-hover:translate-x-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={handleToggleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`relative w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center border transition-colors ${
              wishlisted
                ? 'bg-[#1F5BFF] text-white border-[#1F5BFF]'
                : 'bg-white/92 dark:bg-[#070B16]/85 text-[#0B1220] dark:text-white border-white/60 dark:border-white/15 hover:bg-[#1F5BFF] hover:text-white'
            }`}
          >
            <motion.span
              animate={wishlisted ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
            </motion.span>

            {/* Wishlist particle burst */}
            <AnimatePresence>
              {heartBurstKey > 0 && !prefersReducedMotion && (
                <div
                  key={heartBurstKey}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  {BURST_DOTS.map((dot, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                      animate={{ x: dot.x, y: dot.y, scale: 0, opacity: 0 }}
                      transition={{ duration: 0.48, ease: 'easeOut' }}
                      className="absolute w-1.5 h-1.5 rounded-full bg-[#19C3FF]"
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setQuickViewProduct(product)}
            aria-label="Quick view product"
            className="w-11 h-11 rounded-full bg-white/92 dark:bg-[#070B16]/85 backdrop-blur-md text-[#0B1220] dark:text-white border border-white/60 dark:border-white/15 flex items-center justify-center hover:bg-[#1F5BFF] hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleCompare(product)}
            aria-label="Compare product"
            className={`hidden sm:flex w-11 h-11 rounded-full backdrop-blur-md items-center justify-center border transition-colors ${
              compared
                ? 'bg-[#1F5BFF] text-white border-[#1F5BFF]'
                : 'bg-white/92 dark:bg-[#070B16]/85 text-[#0B1220] dark:text-white border-white/60 dark:border-white/15 hover:bg-[#1F5BFF] hover:text-white'
            }`}
          >
            <GitCompareArrows className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="uppercase tracking-[0.14em] font-medium text-[#4B5563] dark:text-slate-400">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3.5 h-3.5 fill-[#F4B942] text-[#F4B942]" />
              <span className="font-mono-num font-medium text-[#0B1220] dark:text-white">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-[#4B5563] dark:text-slate-400">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="mt-1.5 block font-display text-[15px] leading-snug font-semibold text-[#0B1220] dark:text-white hover:text-[#1F5BFF] dark:hover:text-[#19C3FF] transition-colors line-clamp-2 min-h-[2.65rem]"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E8EDF5] dark:border-white/10">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono-num text-[17px] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                {formatPKR(product.price)}
              </span>
              {product.oldPrice && (
                <span className="font-mono-num text-xs text-slate-400 line-through">
                  {formatPKR(product.oldPrice)}
                </span>
              )}
            </div>
            {product.stock <= 6 && (
              <span className="text-[11px] font-medium text-amber-700 dark:text-[#F4B942]">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Dual Conversion CTAs: Add to Cart + One-Tap WhatsApp */}
          <div className="mt-3 space-y-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn-shine w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_rgba(31,91,255,0.24)] hover:shadow-[0_12px_28px_rgba(31,91,255,0.36)] transition-all whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-600/35 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
