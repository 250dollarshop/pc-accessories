import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPKR, STORE_INFO } from '../data/storeContent';
import { SmartImage } from './SmartImage';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
  } = useStore();
  const navigate = useNavigate();

  const remainingForFreeShipping = Math.max(
    0,
    STORE_INFO.freeDeliveryThreshold - cartSubtotal
  );
  const progressPct = Math.min(
    100,
    (cartSubtotal / STORE_INFO.freeDeliveryThreshold) * 100
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-[#070B16]/55 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Shopping cart drawer"
            className="relative z-10 w-full max-w-md h-full bg-white/95 dark:bg-[#0C1530]/98 backdrop-blur-2xl border-l border-[#E8EDF5] dark:border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8EDF5] dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#0A5CFF] dark:text-[#19C3FF]" />
                <h2 className="font-display text-lg font-semibold text-[#0B1220] dark:text-white">
                  Your Cart ({cartCount})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
                className="w-9 h-9 rounded-full bg-[#F3F7FF] dark:bg-white/10 flex items-center justify-center text-[#0B1220] dark:text-white hover:bg-[#0A5CFF] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Delivery Progress Bar */}
            <div className="px-6 py-3.5 bg-[#F3F7FF] dark:bg-[#070B16]/70 border-b border-[#E8EDF5] dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-medium text-[#0B1220] dark:text-slate-200 mb-2">
                <Truck className="w-4 h-4 text-[#0A5CFF] dark:text-[#19C3FF] shrink-0" />
                {remainingForFreeShipping === 0 && cartSubtotal > 0 ? (
                  <span>You unlocked FREE nationwide delivery across Pakistan!</span>
                ) : (
                  <span>
                    Add{' '}
                    <strong className="font-mono-num text-[#0A5CFF] dark:text-[#19C3FF]">
                      {formatPKR(remainingForFreeShipping)}
                    </strong>{' '}
                    more for Free Delivery
                  </span>
                )}
              </div>
              <div className="h-2 w-full rounded-full bg-white dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0A5CFF] to-[#19C3FF] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#F3F7FF] dark:bg-white/10 flex items-center justify-center text-[#0A5CFF] dark:text-[#19C3FF] mb-4">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#0B1220] dark:text-white">
                    Your cart is empty
                  </h3>
                  <p className="mt-1 text-sm text-[#4B5563] dark:text-slate-400 max-w-xs">
                    Explore our flagship keyboards, wireless mice, 4K monitors, and NVMe drives.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/shop');
                    }}
                    className="btn-shine mt-6 rounded-full bg-gradient-to-r from-[#0A5CFF] to-[#19C3FF] px-6 py-3 text-sm font-medium text-white shadow-[0_10px_28px_rgba(10,92,255,0.28)]"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantLabel}`}
                    className="flex gap-4 p-3.5 rounded-2xl border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#070B16]/70"
                  >
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      className="w-20 h-20 rounded-xl overflow-hidden bg-[#F3F7FF] dark:bg-[#0C1530] shrink-0"
                    >
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${item.slug}`}
                            onClick={() => setIsCartOpen(false)}
                            className="font-display text-sm font-semibold text-[#0B1220] dark:text-white line-clamp-2 hover:text-[#0A5CFF]"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId, item.variantLabel)}
                            aria-label="Remove item"
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#4B5563] dark:text-slate-400 mt-0.5 truncate">
                          {item.variantLabel}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center rounded-full border border-[#E8EDF5] dark:border-white/15 bg-[#F3F7FF] dark:bg-white/5">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantLabel,
                                item.quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center text-[#0B1220] dark:text-white hover:text-[#0A5CFF]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-mono-num font-semibold text-[#0B1220] dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantLabel,
                                item.quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center text-[#0B1220] dark:text-white hover:text-[#0A5CFF]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-mono-num text-sm font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
                          {formatPKR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#E8EDF5] dark:border-white/10 bg-white/80 dark:bg-[#070B16]/80 space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between text-[#4B5563] dark:text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-mono-num font-semibold text-[#0B1220] dark:text-white">
                      {formatPKR(cartSubtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#4B5563] dark:text-slate-300">
                    <span>Delivery</span>
                    <span className="font-mono-num">
                      {remainingForFreeShipping === 0
                        ? 'FREE'
                        : formatPKR(STORE_INFO.standardShippingFee)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="btn-shine w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0A5CFF] to-[#19C3FF] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(10,92,255,0.3)] hover:shadow-[0_16px_40px_rgba(10,92,255,0.42)] transition-all"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
