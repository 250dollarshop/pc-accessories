import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ChevronRight,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { BRANDS_LIST, formatPKR } from '../data/storeContent';
import { ProductCard } from '../components/ProductCard';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialQuery = searchParams.get('q') || '';
  const initialDeals = searchParams.get('deals') === 'flash';
  const initialSort = searchParams.get('sort') || 'featured';

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrand ? [initialBrand] : []
  );
  const [maxPrice, setMaxPrice] = useState<number>(160000);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyFlashDeals, setOnlyFlashDeals] = useState<boolean>(initialDeals);
  const [searchTerm, setSearchTerm] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync URL query params when navigating from mega-menu / header
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const q = searchParams.get('q') || '';
    const deals = searchParams.get('deals') === 'flash';
    const sort = searchParams.get('sort') || 'featured';

    if (cat) setSelectedCategories([cat]);
    else if (!searchParams.has('category')) setSelectedCategories([]);

    if (brand) setSelectedBrands([brand]);
    else if (!searchParams.has('brand')) setSelectedBrands([]);

    setSearchTerm(q);
    setOnlyFlashDeals(deals);
    setSortBy(sort);
    setVisibleCount(12);
  }, [searchParams]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMaxPrice(160000);
    setMinRating(0);
    setOnlyFlashDeals(false);
    setSearchTerm('');
    setSortBy('featured');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(p.categorySlug)
      ) {
        return false;
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      if (onlyFlashDeals && !p.isFlashSale) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      list = [...list].sort(
        (a, b) => Number(Boolean(b.isNewArrival)) - Number(Boolean(a.isNewArrival))
      );
    }
    return list;
  }, [
    selectedCategories,
    selectedBrands,
    maxPrice,
    minRating,
    onlyFlashDeals,
    searchTerm,
    sortBy,
  ]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    maxPrice < 160000 ||
    minRating > 0 ||
    onlyFlashDeals ||
    searchTerm.trim().length > 0;

  const FilterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-[#0B1220] dark:text-white">
          Filter Hardware
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#0A5CFF] dark:text-[#19C3FF] hover:underline"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Flash Deals Switch */}
      <label className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-[#E8EDF5] dark:border-white/10 bg-[#F3F7FF]/60 dark:bg-[#070B16]/60 cursor-pointer">
        <span className="text-sm font-medium text-[#0B1220] dark:text-white">
          Flash Deals Only
        </span>
        <input
          type="checkbox"
          checked={onlyFlashDeals}
          onChange={(e) => setOnlyFlashDeals(e.target.checked)}
          className="w-4 h-4 accent-[#0A5CFF] rounded"
        />
      </label>

      {/* Price Range Slider */}
      <div className="pt-4 border-t border-[#E8EDF5] dark:border-white/10">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="uppercase tracking-[0.14em] font-semibold text-[#4B5563] dark:text-slate-400">
            Max Price
          </span>
          <span className="font-mono-num font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
            {formatPKR(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={3000}
          max={160000}
          step={1000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#0A5CFF] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] font-mono-num text-slate-400 mt-1">
          <span>Rs. 3,000</span>
          <span>Rs. 160,000</span>
        </div>
      </div>

      {/* Categories */}
      <div className="pt-4 border-t border-[#E8EDF5] dark:border-white/10">
        <p className="text-xs uppercase tracking-[0.14em] font-semibold text-[#4B5563] dark:text-slate-400 mb-3">
          Categories
        </p>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => (
            <label
              key={cat.slug}
              className="flex items-center justify-between gap-2 text-sm text-[#0B1220] dark:text-slate-200 cursor-pointer hover:text-[#0A5CFF]"
            >
              <span className="flex items-center gap-2.5 truncate">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="w-4 h-4 accent-[#0A5CFF] rounded"
                />
                <span className="truncate">{cat.name}</span>
              </span>
              <span className="text-xs font-mono-num text-slate-400">
                {cat.itemCount}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="pt-4 border-t border-[#E8EDF5] dark:border-white/10">
        <p className="text-xs uppercase tracking-[0.14em] font-semibold text-[#4B5563] dark:text-slate-400 mb-3">
          Brands
        </p>
        <div className="grid grid-cols-2 gap-2">
          {BRANDS_LIST.map((b) => (
            <label
              key={b.name}
              className="flex items-center gap-2 text-xs text-[#0B1220] dark:text-slate-200 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(b.name)}
                onChange={() => toggleBrand(b.name)}
                className="w-3.5 h-3.5 accent-[#0A5CFF] rounded"
              />
              <span className="truncate">{b.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pt-4 border-t border-[#E8EDF5] dark:border-white/10">
        <p className="text-xs uppercase tracking-[0.14em] font-semibold text-[#4B5563] dark:text-slate-400 mb-3">
          Customer Rating
        </p>
        <div className="space-y-1.5">
          {[4.8, 4.5, 0].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => setMinRating(rate)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                minRating === rate
                  ? 'bg-[#0A5CFF]/10 text-[#0A5CFF] dark:text-[#19C3FF]'
                  : 'text-[#4B5563] dark:text-slate-300 hover:bg-[#F3F7FF] dark:hover:bg-white/5'
              }`}
            >
              {rate === 0 ? (
                <span>All Ratings</span>
              ) : (
                <>
                  <Star className="w-3.5 h-3.5 fill-[#F4B942] text-[#F4B942]" />
                  <span>{rate}+ Stars &amp; Above</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F7FF]/40 dark:bg-transparent">
      {/* Gradient Header Banner */}
      <section className="relative bg-gradient-to-br from-white via-[#F3F7FF] to-[#DFECFF] dark:from-[#070B16] dark:via-[#0C1530] dark:to-[#0E1E44] border-b border-[#E8EDF5] dark:border-white/10 py-10 sm:py-14">
        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#4B5563] dark:text-slate-400 mb-3">
            <Link to="/" className="hover:text-[#0A5CFF]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#0B1220] dark:text-white font-medium">Shop</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1220] dark:text-white tracking-tight">
                {onlyFlashDeals
                  ? 'Flash Deals Collection'
                  : selectedCategories.length === 1
                  ? CATEGORIES.find((c) => c.slug === selectedCategories[0])?.name ||
                    'All Hardware'
                  : 'All Computer Accessories'}
              </h1>
              <p className="mt-1.5 text-sm text-[#4B5563] dark:text-slate-300">
                Showing {filteredProducts.length} original products with 7-day replacement warranty.
              </p>
            </div>

            {/* Live Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#0A5CFF] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Live search hardware..."
                aria-label="Filter products by keyword"
                className="w-full rounded-full border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#0C1530] pl-10 pr-9 py-2.5 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#0A5CFF]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0B1220]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Sticky Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-6 shadow-[0_12px_32px_rgba(11,18,32,0.04)]">
              {FilterPanel}
            </div>
          </aside>

          {/* Products Column */}
          <div className="lg:col-span-9 space-y-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 rounded-full border border-[#E8EDF5] dark:border-white/15 px-3.5 py-1.5 text-xs font-medium text-[#0B1220] dark:text-white"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#0A5CFF]" />
                  Filters
                </button>
                <span className="text-xs sm:text-sm text-[#4B5563] dark:text-slate-300 font-mono-num">
                  {filteredProducts.length} results
                </span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort products"
                  className="rounded-full border border-[#E8EDF5] dark:border-white/15 bg-[#F3F7FF] dark:bg-[#070B16] px-4 py-2 text-xs font-medium text-[#0B1220] dark:text-white focus:outline-none focus:border-[#0A5CFF]"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>

                <div className="hidden sm:flex items-center rounded-full border border-[#E8EDF5] dark:border-white/15 p-1 bg-[#F3F7FF] dark:bg-[#070B16]">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                    className={`p-1.5 rounded-full transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-[#0C1530] text-[#0A5CFF] shadow-sm'
                        : 'text-slate-400'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                    className={`p-1.5 rounded-full transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-[#0C1530] text-[#0A5CFF] shadow-sm'
                        : 'text-slate-400'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategories.map((slug) => (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => toggleCategory(slug)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0A5CFF]/10 text-[#0A5CFF] dark:text-[#19C3FF] px-3 py-1 text-xs font-medium"
                  >
                    <span>
                      {CATEGORIES.find((c) => c.slug === slug)?.name || slug}
                    </span>
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {selectedBrands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBrand(b)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0A5CFF]/10 text-[#0A5CFF] dark:text-[#19C3FF] px-3 py-1 text-xs font-medium"
                  >
                    <span>{b}</span>
                    <X className="w-3 h-3" />
                  </button>
                ))}
                {onlyFlashDeals && (
                  <button
                    type="button"
                    onClick={() => setOnlyFlashDeals(false)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#F4B942]/20 text-[#0B1220] dark:text-[#F4B942] px-3 py-1 text-xs font-medium"
                  >
                    <span>Flash Deals</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                {maxPrice < 160000 && (
                  <button
                    type="button"
                    onClick={() => setMaxPrice(160000)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0A5CFF]/10 text-[#0A5CFF] dark:text-[#19C3FF] px-3 py-1 text-xs font-medium"
                  >
                    <span>Under {formatPKR(maxPrice)}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-medium text-slate-500 hover:text-[#0A5CFF] underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid / List */}
            {visibleProducts.length === 0 ? (
              <div className="rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-12 text-center">
                <h3 className="font-display text-xl font-semibold text-[#0B1220] dark:text-white">
                  No matching accessories found
                </h3>
                <p className="mt-2 text-sm text-[#4B5563] dark:text-slate-400">
                  Try widening your price range or clearing a category filter.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="mt-5 rounded-full bg-[#0A5CFF] text-white px-6 py-2.5 text-sm font-medium"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'flex flex-col gap-4'
                }
              >
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} layout={viewMode} />
                ))}
              </div>
            )}

            {/* Load More */}
            {visibleCount < filteredProducts.length && (
              <div className="pt-4 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + 12)}
                  className="rounded-full border border-[#CBD5E1] dark:border-white/20 bg-white dark:bg-[#0C1530] px-8 py-3 text-sm font-semibold text-[#0B1220] dark:text-white hover:border-[#0A5CFF] hover:text-[#0A5CFF] transition-colors"
                >
                  Load More ({filteredProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-[#070B16]/60 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-xs h-full bg-white dark:bg-[#0C1530] p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8EDF5] dark:border-white/10">
              <span className="font-display font-semibold text-[#0B1220] dark:text-white">
                Filters
              </span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 rounded-full bg-[#F3F7FF] dark:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  );
};
