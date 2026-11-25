import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useStore();
  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-[70vh] bg-[#F3F7FF]/40 dark:bg-transparent py-12 sm:py-16">
      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
              Saved Collection
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B1220] dark:text-white">
              Your Wishlist ({savedProducts.length})
            </h1>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A5CFF] dark:text-[#19C3FF]"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {savedProducts.length === 0 ? (
          <div className="rounded-[28px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-14 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F3F7FF] dark:bg-white/10 text-[#0A5CFF] dark:text-[#19C3FF] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7" />
            </div>
            <h2 className="font-display text-xl font-semibold text-[#0B1220] dark:text-white">
              No saved hardware yet
            </h2>
            <p className="mt-2 text-sm text-[#4B5563] dark:text-slate-400 max-w-md mx-auto">
              Tap the heart icon on any keyboard, mouse, monitor, or headset to save it here for later.
            </p>
            <Link
              to="/shop"
              className="btn-shine mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0A5CFF] to-[#19C3FF] px-7 py-3 text-sm font-semibold text-white"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
