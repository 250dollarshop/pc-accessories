import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND_LOGO_PATH } from '../data/images';
import { PAYMENT_METHODS, STORE_INFO, formatPKR } from '../data/storeContent';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useStore();
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="relative z-[2] max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-[#0B1220] dark:text-white">
          Order Record Not Found
        </h1>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-full bg-[#0A5CFF] text-white px-7 py-3 text-sm font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const pmInfo = PAYMENT_METHODS.find((m) => m.id === order.paymentMethod);
  const waConfirmText = encodeURIComponent(
    `Hello PRIME COMPUTER ACCESSORIES! I just placed Order #${order.orderId} for ${formatPKR(
      order.total
    )} (${pmInfo?.name}). Name: ${order.customer.fullName}, City: ${order.customer.city}.`
  );

  return (
    <div className="bg-[#F3F7FF]/45 dark:bg-transparent py-12 sm:py-16">
      <div className="relative z-[2] max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] border border-[#E8EDF5] dark:border-white/12 bg-white dark:bg-[#0C1530] p-6 sm:p-10 shadow-[0_24px_60px_rgba(10,92,255,0.1)]"
        >
          <div className="flex flex-col items-center text-center pb-8 border-b border-[#E8EDF5] dark:border-white/10">
            <img
              src={BRAND_LOGO_PATH}
              alt="PRIME COMPUTER ACCESSORIES"
              className="h-14 w-auto object-contain mb-6 dark:rounded-xl dark:bg-white dark:px-3 dark:py-1"
            />
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="w-9 h-9" />
            </motion.div>

            <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#0A5CFF] dark:text-[#19C3FF]">
              Order Confirmed
            </p>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#0B1220] dark:text-white">
              Thank You, {order.customer.fullName}!
            </h1>
            <p className="mt-2 text-sm text-[#4B5563] dark:text-slate-300">
              Order ID:{' '}
              <strong className="font-mono-num text-[#0B1220] dark:text-white">
                {order.orderId}
              </strong>{' '}
              — Preparing dispatch from Sialkot, Punjab.
            </p>
          </div>

          <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-[#E8EDF5] dark:border-white/10 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#4B5563] dark:text-slate-400 mb-1.5">
                Delivery Address
              </p>
              <p className="font-semibold text-[#0B1220] dark:text-white">
                {order.customer.fullName}
              </p>
              <p className="text-[#4B5563] dark:text-slate-300">
                {order.customer.address}, {order.customer.city}
              </p>
              <p className="font-mono-num text-[#4B5563] dark:text-slate-300 mt-1">
                {order.customer.phone}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#4B5563] dark:text-slate-400 mb-1.5">
                Payment &amp; Status
              </p>
              <p className="font-semibold text-[#0B1220] dark:text-white">
                {pmInfo?.name}
              </p>
              <p className="text-xs text-[#4B5563] dark:text-slate-300 mt-1">
                {pmInfo?.instructions}
              </p>
            </div>
          </div>

          <div className="py-6 space-y-3 border-b border-[#E8EDF5] dark:border-white/10">
            {order.items.map((item) => (
              <div
                key={`${item.productId}-${item.variantLabel}`}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-[#0B1220] dark:text-slate-200">
                  {item.name} ({item.variantLabel}) × {item.quantity}
                </span>
                <span className="font-mono-num font-semibold text-[#0B1220] dark:text-white">
                  {formatPKR(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="pt-3 flex items-center justify-between font-display text-lg font-semibold text-[#0B1220] dark:text-white">
              <span>Grand Total</span>
              <span className="font-mono-num text-[#0A5CFF] dark:text-[#19C3FF]">
                {formatPKR(order.total)}
              </span>
            </div>
          </div>

          <div className="pt-7 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href={`${STORE_INFO.whatsappBase}?text=${waConfirmText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-7 py-3.5 text-sm font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Confirm via WhatsApp
            </a>
            <Link
              to="/shop"
              className="w-full sm:w-auto text-center rounded-full border border-[#CBD5E1] dark:border-white/15 px-7 py-3.5 text-sm font-semibold text-[#0B1220] dark:text-white hover:border-[#0A5CFF]"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
