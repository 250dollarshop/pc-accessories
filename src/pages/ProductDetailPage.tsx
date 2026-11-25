import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  BadgeCheck,
  Banknote,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  FileCheck2,
  Heart,
  MessageCircle,
  Minus,
  PackageOpen,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { PRODUCTS, getProductBySlug } from '../data/catalog';
import {
  FAQS,
  PAKISTAN_CITIES,
  STORE_INFO,
  buildProductWhatsAppUrl,
  formatPKR,
  getDeliveryEstimate,
} from '../data/storeContent';
import { useStore } from '../context/StoreContext';
import { SmartImage } from '../components/SmartImage';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || '');
  const {
    addToCart,
    addBundleToCart,
    toggleWishlist,
    isInWishlist,
    customReviews,
    addReview,
    showToast,
  } = useStore();

  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [qty, setQty] = useState(1);
  const [deliveryCity, setDeliveryCity] = useState('Lahore');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'faq'>('desc');
  const [openFaqId, setOpenFaqId] = useState<string>(FAQS[0].id);
  const [showStickyMobileBar, setShowStickyMobileBar] = useState(false);

  const buyBoxRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Review Form State
  const [revName, setRevName] = useState('');
  const [revCity, setRevCity] = useState('Lahore');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setActiveImg(0);
      setSelectedVariant(product.variants[0]?.label || '');
      setQty(1);
      setActiveTab('desc');
      document.title = `${product.name} | PRIME COMPUTER ACCESSORIES`;
    }
    return () => {
      document.title =
        'PRIME COMPUTER ACCESSORIES | Original PC Gear & Gaming Accessories Pakistan';
    };
  }, [product]);

  // Show sticky mobile Add-to-Cart bar when scrolling past main buy box
  useEffect(() => {
    const onScroll = () => {
      if (!buyBoxRef.current) return;
      const rect = buyBoxRef.current.getBoundingClientRect();
      setShowStickyMobileBar(rect.bottom < 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const frequentlyBought = useMemo(() => {
    if (!product) return [];
    const sameCategory = PRODUCTS.filter(
      (p) => p.id !== product.id && p.categorySlug !== product.categorySlug
    );
    return sameCategory.slice(0, 2);
  }, [product]);

  if (!product) {
    return (
      <div className="relative z-[2] max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-[#0B1220] dark:text-white">
          Product Not Found
        </h1>
        <p className="mt-2 text-sm text-[#4B5563] dark:text-slate-400">
          This hardware item may have moved or sold out.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-full bg-[#1F5BFF] text-white px-7 py-3 text-sm font-semibold"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const variantObj = product.variants.find((v) => v.label === selectedVariant);
  const unitPrice = product.price + (variantObj?.priceDelta ?? 0);
  const savingsAmount =
    product.oldPrice && product.oldPrice > unitPrice
      ? product.oldPrice - unitPrice
      : 0;
  const savingsPct =
    product.oldPrice && product.oldPrice > unitPrice
      ? Math.round((savingsAmount / product.oldPrice) * 100)
      : 0;

  const allReviews = [...(customReviews[product.id] || []), ...product.reviews];
  const totalReviewCount = product.reviewCount + (customReviews[product.id]?.length || 0);
  const relatedProducts = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  const whatsappLink = buildProductWhatsAppUrl(
    product.name,
    unitPrice,
    product.slug,
    qty,
    selectedVariant
  );

  const currentUrl =
    typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      showToast('Link Copied', 'Share this product link with friends or on WhatsApp.', 'success');
    } catch {
      showToast('Copy Link', currentUrl, 'info');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) return;
    addReview(product.id, {
      author: revName.trim(),
      city: revCity,
      rating: revRating,
      comment: revComment.trim(),
    });
    setRevName('');
    setRevComment('');
    setRevRating(5);
  };

  // Dynamic Product Schema (JSON-LD) for rich search snippets
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    description: product.description,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: unitPrice,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toFixed(1),
      reviewCount: totalReviewCount,
    },
  };

  const fbtItems = [product, ...frequentlyBought];
  const fbtTotal = fbtItems.reduce((s, i) => s + i.price, 0);

  return (
    <div className="relative pb-28 sm:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb */}
      <div className="relative z-[2] border-b border-[#E8EDF5] dark:border-white/10 bg-[#F3F7FF]/50 dark:bg-[#0C1530]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[#4B5563] dark:text-slate-400">
            <Link to="/" className="hover:text-[#1F5BFF]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/shop" className="hover:text-[#1F5BFF]">Shop</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/shop?category=${product.categorySlug}`} className="hover:text-[#1F5BFF]">
              {product.categoryName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#0B1220] dark:text-white font-medium truncate max-w-[240px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Top Split */}
      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Gallery */}
          <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-28">
            <div
              ref={galleryRef}
              className="group relative aspect-[4/3] rounded-[28px] overflow-hidden border border-[#E8EDF5] dark:border-white/10 bg-gradient-to-br from-[#F3F7FF] to-[#E6EEFF] dark:from-[#0C1530] dark:to-[#070B16] shadow-[0_20px_50px_rgba(31,91,255,0.08)]"
            >
              <SmartImage
                src={product.images[activeImg] || product.images[0]}
                alt={product.name}
                eager
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {savingsPct > 0 && (
                <span className="absolute top-4 left-4 rounded-full bg-[#F4B942] px-3 py-1 text-xs font-semibold text-[#0B1220] font-mono-num shadow-md">
                  Save {savingsPct}% ({formatPKR(savingsAmount)})
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={`w-24 aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImg === i
                        ? 'border-[#1F5BFF] shadow-md'
                        : 'border-[#E8EDF5] dark:border-white/10 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <SmartImage src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right High-Converting Buy Box */}
          <div ref={buyBoxRef} className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="uppercase tracking-[0.16em] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                  {product.brand} · SKU {product.sku}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <BadgeCheck className="w-4 h-4" />
                  In Stock ({product.stock} ready to ship)
                </span>
              </div>

              <h1 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0B1220] dark:text-white tracking-tight">
                {product.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? 'fill-[#F4B942] text-[#F4B942]'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-mono-num font-semibold text-[#0B1220] dark:text-white">
                  {product.rating.toFixed(1)}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="text-sm text-[#1F5BFF] dark:text-[#19C3FF] hover:underline"
                >
                  ({totalReviewCount} verified reviews)
                </button>
              </div>
            </div>

            {/* Price & Savings Block */}
            <div className="p-5 rounded-2xl bg-[#F3F7FF] dark:bg-[#0C1530] border border-[#E8EDF5] dark:border-white/10 space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono-num text-3xl font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                    {formatPKR(unitPrice)}
                  </span>
                  {product.oldPrice && (
                    <span className="font-mono-num text-base text-slate-400 line-through">
                      {formatPKR(product.oldPrice)}
                    </span>
                  )}
                </div>
                {savingsAmount > 0 && (
                  <span className="rounded-full bg-[#F4B942] px-3 py-1 text-xs font-semibold text-[#0B1220] font-mono-num">
                    You Save {formatPKR(savingsAmount)} ({savingsPct}%)
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-[#4B5563] dark:text-slate-300">
                {unitPrice >= STORE_INFO.freeDeliveryThreshold
                  ? 'Qualifies for FREE Nationwide Delivery · Cash on Delivery Available'
                  : 'Flat Rs. 350 Delivery Across Pakistan · Open Parcel Before Payment'}
              </p>
            </div>

            {/* Short Bullet Benefits Above the Fold */}
            <ul className="space-y-2">
              {product.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-center gap-2.5 text-sm text-[#0B1220] dark:text-slate-200"
                >
                  <Check className="w-4 h-4 text-[#1F5BFF] shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.14em] font-semibold text-[#4B5563] dark:text-slate-400 mb-2">
                  Select Option
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v.label)}
                      className={`min-h-[44px] inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium border transition-all ${
                        selectedVariant === v.label
                          ? 'border-[#1F5BFF] bg-[#1F5BFF]/10 text-[#1F5BFF] dark:text-[#19C3FF] shadow-sm'
                          : 'border-[#E8EDF5] dark:border-white/15 text-[#0B1220] dark:text-slate-200 hover:border-[#1F5BFF]'
                      }`}
                    >
                      {v.colorHex && (
                        <span
                          className="w-3 h-3 rounded-full border border-black/15"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      )}
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* City Delivery Estimator */}
            <div className="rounded-2xl border border-[#E8EDF5] dark:border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-[#1F5BFF] shrink-0" />
                <div>
                  <span className="block text-xs text-[#4B5563] dark:text-slate-400">
                    Estimated Delivery to{' '}
                    <strong className="text-[#0B1220] dark:text-white">{deliveryCity}</strong>
                  </span>
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {getDeliveryEstimate(deliveryCity)}
                  </span>
                </div>
              </div>
              <select
                value={deliveryCity}
                onChange={(e) => setDeliveryCity(e.target.value)}
                aria-label="Select city for delivery estimate"
                className="min-h-[40px] rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#0C1530] px-3 py-1.5 text-xs font-medium text-[#0B1220] dark:text-white"
              >
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity + Primary Buttons ("Add to Cart" & "Buy Now on WhatsApp") */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#0C1530] px-2 h-12">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-10 h-10 flex items-center justify-center text-[#0B1220] dark:text-white hover:text-[#1F5BFF]"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-9 text-center font-mono-num text-sm font-semibold text-[#0B1220] dark:text-white">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    aria-label="Increase quantity"
                    className="w-10 h-10 flex items-center justify-center text-[#0B1220] dark:text-white hover:text-[#1F5BFF]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    const rect =
                      galleryRef.current?.getBoundingClientRect() ||
                      e.currentTarget.getBoundingClientRect();
                    addToCart(product, selectedVariant, qty, rect);
                  }}
                  className="btn-shine flex-1 min-w-[170px] min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] px-6 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(31,91,255,0.3)] hover:shadow-[0_16px_40px_rgba(31,91,255,0.42)] transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label="Save to wishlist"
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                    wishlisted
                      ? 'border-[#1F5BFF] bg-[#1F5BFF]/10 text-[#1F5BFF]'
                      : 'border-[#CBD5E1] dark:border-white/15 text-[#0B1220] dark:text-white hover:border-[#1F5BFF]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 text-sm font-semibold shadow-[0_10px_28px_rgba(16,185,129,0.28)] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Buy Now on WhatsApp ({STORE_INFO.phoneRaw})
              </a>
            </div>

            {/* 5 Trust Badges on Product Page */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {[
                { icon: <BadgeCheck className="w-4 h-4 text-[#1F5BFF]" />, text: '100% Original' },
                { icon: <Banknote className="w-4 h-4 text-[#1F5BFF]" />, text: 'Cash on Delivery' },
                { icon: <RotateCcw className="w-4 h-4 text-[#1F5BFF]" />, text: '7-Day Replacement' },
                { icon: <PackageOpen className="w-4 h-4 text-[#1F5BFF]" />, text: 'Open Parcel Before Pay' },
                { icon: <FileCheck2 className="w-4 h-4 text-[#1F5BFF]" />, text: 'Warranty Card Included' },
              ].map((b) => (
                <div
                  key={b.text}
                  className="flex items-center gap-2 rounded-xl border border-[#E8EDF5] dark:border-white/10 bg-[#F3F7FF]/50 dark:bg-[#0C1530] px-3 py-2 text-xs font-medium text-[#0B1220] dark:text-slate-200"
                >
                  {b.icon}
                  <span className="truncate">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Share Buttons (WhatsApp, Facebook, Copy Link) */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 border-t border-[#E8EDF5] dark:border-white/10">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4B5563] dark:text-slate-400">
                <Share2 className="w-3.5 h-3.5" /> Share:
              </span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out ${product.name} (${formatPKR(unitPrice)}) at PRIME COMPUTER ACCESSORIES: ${currentUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] inline-flex items-center gap-1.5 rounded-full border border-[#E8EDF5] dark:border-white/15 px-3.5 py-1.5 text-xs font-medium text-[#0B1220] dark:text-white hover:border-emerald-500 hover:text-emerald-600"
              >
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  currentUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] inline-flex items-center gap-1.5 rounded-full border border-[#E8EDF5] dark:border-white/15 px-3.5 py-1.5 text-xs font-medium text-[#0B1220] dark:text-white hover:border-[#1F5BFF] hover:text-[#1F5BFF]"
              >
                Facebook
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="min-h-[40px] inline-flex items-center gap-1.5 rounded-full border border-[#E8EDF5] dark:border-white/15 px-3.5 py-1.5 text-xs font-medium text-[#0B1220] dark:text-white hover:border-[#1F5BFF] hover:text-[#1F5BFF]"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together */}
        {frequentlyBought.length > 0 && (
          <div className="mt-14 rounded-[28px] border border-[#E8EDF5] dark:border-white/10 bg-[#F3F7FF]/60 dark:bg-[#0C1530]/70 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                  Complete Your Setup
                </p>
                <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-[#0B1220] dark:text-white">
                  Frequently Bought Together
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {fbtItems.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <Link
                      to={`/product/${item.slug}`}
                      className="flex items-center gap-3 rounded-2xl bg-white dark:bg-[#070B16] border border-[#E8EDF5] dark:border-white/10 p-2.5 pr-4 hover:border-[#1F5BFF]"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <SmartImage src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="max-w-[140px]">
                        <p className="text-xs font-semibold text-[#0B1220] dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="font-mono-num text-xs text-[#1F5BFF] dark:text-[#19C3FF]">
                          {formatPKR(item.price)}
                        </p>
                      </div>
                    </Link>
                    {idx < fbtItems.length - 1 && (
                      <span className="text-lg font-semibold text-slate-400">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                <div>
                  <span className="block text-xs text-[#4B5563] dark:text-slate-400">
                    Bundle Total ({fbtItems.length} items)
                  </span>
                  <span className="font-mono-num text-xl font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                    {formatPKR(fbtTotal)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => addBundleToCart(fbtItems, 'Frequently Bought Together')}
                  className="btn-shine min-h-[44px] rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] px-6 py-2.5 text-xs font-semibold text-white whitespace-nowrap"
                >
                  Add All {fbtItems.length} to Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Description / Specs / Reviews / FAQ Tabs */}
        <div className="mt-12 rounded-[28px] border border-[#E8EDF5] dark:border-white/10 bg-[#F3F7FF]/40 dark:bg-[#0C1530]/60 p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 border-b border-[#E8EDF5] dark:border-white/10 pb-4">
            {[
              { id: 'desc', label: 'Overview & Warranty' },
              { id: 'specs', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${allReviews.length})` },
              { id: 'faq', label: 'Buying FAQ' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  setActiveTab(t.id as 'desc' | 'specs' | 'reviews' | 'faq')
                }
                className={`min-h-[42px] px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  activeTab === t.id
                    ? 'bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] text-white shadow-md'
                    : 'text-[#4B5563] dark:text-slate-300 hover:text-[#0B1220] dark:hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pt-6">
            {activeTab === 'desc' && (
              <div className="max-w-3xl space-y-4 text-[#4B5563] dark:text-slate-300 leading-relaxed">
                <p className="text-base text-[#0B1220] dark:text-slate-100">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-[#1F5BFF] dark:text-[#19C3FF] pt-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    Includes Warranty Card, Open Parcel Before Payment COD, &amp; 7-Day Replacement
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="overflow-hidden rounded-2xl border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#070B16]">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-[#E8EDF5] dark:divide-white/10">
                    {Object.entries(product.specs).map(([k, v]) => (
                      <tr key={k}>
                        <th className="w-1/3 px-5 py-3.5 font-medium text-[#4B5563] dark:text-slate-400 bg-[#F3F7FF]/60 dark:bg-white/5">
                          {k}
                        </th>
                        <td className="px-5 py-3.5 font-medium text-[#0B1220] dark:text-white">
                          {v}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  {allReviews.length === 0 ? (
                    <p className="text-sm text-[#4B5563] dark:text-slate-400">
                      Be the first verified buyer to review this hardware!
                    </p>
                  ) : (
                    allReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="rounded-2xl border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#070B16] p-5"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div>
                            <p className="font-display text-sm font-semibold text-[#0B1220] dark:text-white">
                              {rev.author} · {rev.city}
                            </p>
                            <p className="text-xs text-slate-400 font-mono-num">{rev.date}</p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: rev.rating }).map((_, idx) => (
                              <Star
                                key={idx}
                                className="w-3.5 h-3.5 fill-[#F4B942] text-[#F4B942]"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-[#4B5563] dark:text-slate-300">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <form
                  onSubmit={handleReviewSubmit}
                  className="lg:col-span-5 rounded-2xl border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#070B16] p-5 space-y-4 h-fit"
                >
                  <h3 className="font-display text-base font-semibold text-[#0B1220] dark:text-white">
                    Write a Review
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder="e.g. Ali Raza"
                      className="w-full min-h-[44px] rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-transparent px-3.5 py-2.5 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#1F5BFF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1">
                        City
                      </label>
                      <select
                        value={revCity}
                        onChange={(e) => setRevCity(e.target.value)}
                        className="w-full min-h-[44px] rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#0C1530] px-3 py-2 text-sm text-[#0B1220] dark:text-white"
                      >
                        {PAKISTAN_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1">
                        Rating
                      </label>
                      <select
                        value={revRating}
                        onChange={(e) => setRevRating(Number(e.target.value))}
                        className="w-full min-h-[44px] rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#0C1530] px-3 py-2 text-sm text-[#0B1220] dark:text-white"
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>
                            {n} Stars
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1">
                      Your Experience
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={revComment}
                      onChange={(e) => setRevComment(e.target.value)}
                      placeholder="Share build quality, delivery speed, or setup tips..."
                      className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-transparent px-3.5 py-2.5 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#1F5BFF]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-shine w-full min-h-[44px] rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] py-2.5 text-sm font-semibold text-white"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-3 max-w-3xl">
                {FAQS.slice(0, 4).map((faq) => {
                  const open = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#070B16] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(open ? '' : faq.id)}
                        className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left"
                      >
                        <span className="font-display text-sm font-semibold text-[#0B1220] dark:text-white">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#1F5BFF] shrink-0 transition-transform ${
                            open ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {open && (
                        <div className="px-5 pb-4 text-xs sm:text-sm text-[#4B5563] dark:text-slate-300 border-t border-[#E8EDF5] dark:border-white/10 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-[#0B1220] dark:text-white mb-6">
              Related Hardware in {product.categoryName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Add-to-Cart + WhatsApp Bar when scrolling past Buy Box */}
      <div
        className={`sm:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[#E8EDF5] dark:border-white/15 bg-white/96 dark:bg-[#070B16]/96 backdrop-blur-xl px-3 py-2.5 shadow-[0_-10px_30px_rgba(11,18,32,0.1)] transition-transform duration-200 ${
          showStickyMobileBar ? 'translate-y-0' : 'translate-y-0'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="min-w-0 pr-1">
            <span className="block text-[10px] text-[#4B5563] dark:text-slate-400 truncate max-w-[90px]">
              {product.brand}
            </span>
            <span className="font-mono-num text-sm font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
              {formatPKR(unitPrice)}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              addToCart(product, selectedVariant, qty, rect);
            }}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] text-white text-xs font-semibold px-3"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold px-4 shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
