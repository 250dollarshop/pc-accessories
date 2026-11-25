import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Package, Save, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PAKISTAN_CITIES, formatPKR } from '../data/storeContent';
import { OrderCustomer } from '../types/store';

export const AccountPage: React.FC = () => {
  const { orders, savedProfile, saveProfile, wishlist } = useStore();
  const [profileForm, setProfileForm] = useState<OrderCustomer>(savedProfile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(profileForm);
  };

  return (
    <div className="bg-[#F3F7FF]/40 dark:bg-transparent py-12 sm:py-16">
      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
              Customer Portal
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#0B1220] dark:text-white">
              My Account &amp; Orders
            </h1>
          </div>
          <Link
            to="/wishlist"
            className="inline-flex items-center gap-2 rounded-full border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#0C1530] px-5 py-2.5 text-xs font-semibold text-[#0B1220] dark:text-white"
          >
            <Heart className="w-4 h-4 text-[#0A5CFF]" />
            Saved Wishlist ({wishlist.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Order History */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-xl font-semibold text-[#0B1220] dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-[#0A5CFF]" />
              Order History ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <div className="rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-10 text-center">
                <ShoppingBag className="w-8 h-8 text-[#0A5CFF] mx-auto mb-3" />
                <p className="font-display text-base font-semibold text-[#0B1220] dark:text-white">
                  No orders placed on this browser yet
                </p>
                <p className="text-xs text-[#4B5563] dark:text-slate-400 mt-1">
                  Orders placed during checkout appear here automatically with receipts.
                </p>
                <Link
                  to="/shop"
                  className="mt-5 inline-block rounded-full bg-[#0A5CFF] text-white px-6 py-2.5 text-xs font-semibold"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order.orderId}
                    to={`/order-confirmation/${order.orderId}`}
                    className="block rounded-[22px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-5 hover:border-[#0A5CFF] transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-mono-num text-sm font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
                          {order.orderId}
                        </span>
                        <p className="text-xs text-[#4B5563] dark:text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-PK', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          · {order.customer.city}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono-num text-base font-semibold text-[#0B1220] dark:text-white">
                          {formatPKR(order.total)}
                        </span>
                        <span className="block text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Saved Delivery Profile */}
          <form
            onSubmit={handleSave}
            className="lg:col-span-5 rounded-[24px] border border-[#E8EDF5] dark:border-white/10 bg-white dark:bg-[#0C1530] p-6 space-y-4 h-fit"
          >
            <h2 className="font-display text-xl font-semibold text-[#0B1220] dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0A5CFF]" />
              Default Delivery Address
            </h2>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, fullName: e.target.value })
                }
                placeholder="Your full name"
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-transparent px-3.5 py-2.5 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#0A5CFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1">
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
                placeholder="+92 300 0000000"
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-transparent px-3.5 py-2.5 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#0A5CFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4B5563] dark:text-slate-400 mb-1">
                City
              </label>
              <select
                value={profileForm.city}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, city: e.target.value })
                }
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#070B16] px-3.5 py-2.5 text-sm text-[#0B1220] dark:text-white"
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
                Street Address
              </label>
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, address: e.target.value })
                }
                placeholder="House #, Street #, Area"
                className="w-full rounded-xl border border-[#CBD5E1] dark:border-white/15 bg-transparent px-3.5 py-2.5 text-sm text-[#0B1220] dark:text-white focus:outline-none focus:border-[#0A5CFF]"
              />
            </div>

            <button
              type="submit"
              className="btn-shine w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0A5CFF] to-[#19C3FF] py-3 text-sm font-semibold text-white"
            >
              <Save className="w-4 h-4" />
              Save Address
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
