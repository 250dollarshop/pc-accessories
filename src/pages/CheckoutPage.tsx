import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Lock,
  MessageCircle,
  PackageOpen,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  PAKISTAN_CITIES,
  PAYMENT_METHODS,
  STORE_INFO,
  formatPKR,
  getDeliveryEstimate,
} from '../data/storeContent';
import { OrderCustomer, PaymentMethodId } from '../types/store';
import { SmartImage } from '../components/SmartImage';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    firstOrderDiscountPct,
    firstOrderDiscountAmount,
    placeOrder,
    savedProfile,
    showToast,
  } = useStore();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<OrderCustomer>({
    fullName: savedProfile.fullName || '',
    phone: savedProfile.phone || '',
    email: savedProfile.email || '',
    address: savedProfile.address || '',
    city: savedProfile.city || 'Sialkot',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cod');
  const [formError, setFormError] = useState('');

  const discountedSubtotal = Math.max(0, cartSubtotal - firstOrderDiscountAmount);
  const shipping =
    discountedSubtotal >= STORE_INFO.freeDeliveryThreshold || discountedSubtotal === 0
      ? 0
      : STORE_INFO.standardShippingFee;
  const total = discountedSubtotal + shipping;

  const validateCustomer = (): boolean => {
    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setFormError('Please enter your name, phone number, and full delivery address.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!validateCustomer()) return;

    const order = placeOrder(customer, paymentMethod);
    showToast('Order Confirmed!', `Order ${order.orderId} has been placed.`, 'success');
    navigate(`/order-confirmation/${order.orderId}`);
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const itemLines = cart
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.name} (${i.variantLabel}) x${i.quantity} — ${formatPKR(
            i.price * i.quantity
          )}`
      )
      .join('\n');

    const selectedPm = PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.name || 'COD';
    const message = [
      '*NEW ORDER — PRIME COMPUTER ACCESSORIES*',
      '',
      '*Items:*',
      itemLines,
      '',
      `*Subtotal:* ${formatPKR(cartSubtotal)}`,
      firstOrderDiscountAmount > 0
        ? `*First-Order 5% Off:* -${formatPKR(firstOrderDiscountAmount)}`
        : '',
      `*Delivery:* ${shipping === 0 ? 'FREE' : formatPKR(shipping)}`,
      `*Grand Total:* ${formatPKR(total)}`,
      `*Payment Method:* ${selectedPm}`,
      '',
      '*Customer Details:*',
      `Name: ${customer.fullName || 'Not entered'}`,
      `Phone: ${customer.phone || 'Not entered'}`,
      `City: ${customer.city}`,
      `Address: ${customer.address || 'Not entered'}`,
    ]
      .filter(Boolean)
      .join('\n');

    window.open(
      `${STORE_INFO.whatsappBase}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (cart.length === 0) {
    return (
      <div className="relative z-[2] max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F3F7FF] dark:bg-[#0C1530] text-[#1F5BFF] flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-[#0B1220] dark:text-white">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-[#4B5563] dark:text-slate-400">
          Add computer accessories to your cart before proceeding to guest checkout.
        </p>
        <Link
          to="/shop"
          className="btn-shine mt-6 inline-block rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] px-7 py-3 text-sm font-semibold text-white"
        >
          Shop Accessories
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F7FF]/45 dark:bg-transparent py-8 sm:py-14 pb-24 sm:pb-14">
      <div className="relative z-[2] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
            Fast Guest Checkout · No Account Required
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#0B1220] dark:text-white">
            Complete Your Order
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Simple 4-Field Form + Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="font-display text-lg font-semibold text-[#0B1220] dark:text-white">
                1. Delivery Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) =>
                      setCustomer({ ...customer, fullName: e.target.value })
                    }
                    placeholder="Muhammad Hamza"
                    className="w-full min-h-[46px] rounded-2xl border border-[#CBD5E1] dark:border-white/15 bg-transparent px-4 py-3 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#1F5BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    placeholder="0300 1234567"
                    className="w-full min-h-[46px] rounded-2xl border border-[#CBD5E1] dark:border-white/15 bg-transparent px-4 py-3 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#1F5BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1.5">
                  City * (Est. {getDeliveryEstimate(customer.city)})
                </label>
                <select
                  value={customer.city}
                  onChange={(e) =>
                    setCustomer({ ...customer, city: e.target.value })
                  }
                  className="w-full min-h-[46px] rounded-2xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#070B16] px-4 py-3 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#1F5BFF]"
                >
                  {PAKISTAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1.5">
                  Full Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                  placeholder="House #, Street #, Sector / Phase / Colony"
                  className="w-full min-h-[46px] rounded-2xl border border-[#CBD5E1] dark:border-white/15 bg-transparent px-4 py-3 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#1F5BFF]"
                />
              </div>
            </div>

            {/* Payment Method Cards (COD Selected by Default) */}
            <div className="rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="font-display text-lg font-semibold text-[#0B1220] dark:text-white">
                2. Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PAYMENT_METHODS.map((pm) => {
                  const selected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`text-left min-h-[68px] rounded-2xl border p-4 transition-all ${
                        selected
                          ? 'border-[#1F5BFF] bg-[#F3F7FF] dark:bg-[#1F5BFF]/15 shadow-sm'
                          : 'border-[#E8EDF5] dark:border-white/10 hover:border-[#1F5BFF]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-sm font-semibold text-[#0B1220] dark:text-white">
                          {pm.name}
                        </span>
                        {selected && (
                          <CheckCircle2 className="w-4 h-4 text-[#1F5BFF] shrink-0" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-[#4B5563] dark:text-slate-400">
                        {pm.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-[#F3F7FF] dark:bg-[#070B16] p-4 flex items-start gap-2.5 text-xs text-[#4B5563] dark:text-slate-300">
                <PackageOpen className="w-4 h-4 text-[#1F5BFF] shrink-0 mt-0.5" />
                <span>
                  {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.instructions}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-6 sm:p-7 shadow-[0_20px_50px_rgba(31,91,255,0.08)] space-y-5">
              <h2 className="font-display text-xl font-semibold text-[#0B1220] dark:text-white">
                Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </h2>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantLabel}`}
                    className="flex items-center gap-3"
                  >
                    <div className="w-14 h-12 rounded-xl overflow-hidden bg-[#F3F7FF] shrink-0">
                      <SmartImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0B1220] dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#4B5563] dark:text-slate-400">
                        {item.variantLabel} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono-num text-xs font-semibold text-[#0B1220] dark:text-white">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E8EDF5] dark:border-white/10 space-y-2 text-sm">
                <div className="flex justify-between text-[#4B5563] dark:text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-mono-num font-medium">{formatPKR(cartSubtotal)}</span>
                </div>

                {firstOrderDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>First-Order Offer ({firstOrderDiscountPct}% OFF)</span>
                    <span className="font-mono-num">
                      -{formatPKR(firstOrderDiscountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[#4B5563] dark:text-slate-300">
                  <span>Delivery ({customer.city})</span>
                  <span className="font-mono-num font-medium text-emerald-600 dark:text-emerald-400">
                    {shipping === 0 ? 'FREE' : formatPKR(shipping)}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#E8EDF5] dark:border-white/10 flex justify-between items-baseline">
                  <span className="font-display text-base font-semibold text-[#0B1220] dark:text-white">
                    Total Payable
                  </span>
                  <span className="font-mono-num text-2xl font-semibold text-[#1F5BFF] dark:text-[#19C3FF]">
                    {formatPKR(total)}
                  </span>
                </div>
              </div>

              {formError && (
                <p className="text-xs text-rose-500 font-medium">{formError}</p>
              )}

              <div className="space-y-3 pt-1">
                <button
                  type="submit"
                  className="btn-shine w-full min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#1F5BFF] to-[#19C3FF] py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(31,91,255,0.3)]"
                >
                  <Lock className="w-4 h-4" />
                  Place Order ({formatPKR(total)})
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 text-sm font-semibold transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Order on WhatsApp (+923298025766)
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#4B5563] dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#1F5BFF]" />
                <span>Open Parcel Before Payment · 7-Day Replacement</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
