import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  CartItem,
  Order,
  OrderCustomer,
  PaymentMethodId,
  Product,
  ProductReview,
} from '../types/store';
import { STORE_INFO } from '../data/storeContent';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'error';
}

export interface FlyToCartEvent {
  id: number;
  image: string;
  startX: number;
  startY: number;
}

interface StoreContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  cart: CartItem[];
  addToCart: (
    product: Product,
    variantLabel?: string,
    quantity?: number,
    originRect?: { left: number; top: number; width: number; height: number }
  ) => void;
  addBundleToCart: (products: Product[], bundleTitle: string) => void;
  updateQuantity: (productId: string, variantLabel: string, quantity: number) => void;
  removeFromCart: (productId: string, variantLabel: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  firstOrderDiscountPct: number;
  firstOrderDiscountAmount: number;
  claimFirstOrderOffer: (whatsappPhone: string) => void;
  claimedOfferPhone: string;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartPulse: boolean;
  flyEvent: FlyToCartEvent | null;
  wishlist: string[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  compareIds: string[];
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  orders: Order[];
  placeOrder: (customer: OrderCustomer, paymentMethod: PaymentMethodId) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  savedProfile: OrderCustomer;
  saveProfile: (profile: OrderCustomer) => void;
  customReviews: Record<string, ProductReview[]>;
  addReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'verified'>) => void;
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function safeReadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = safeReadStorage<'light' | 'dark'>('pca_theme', 'light');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [cart, setCart] = useState<CartItem[]>(() => safeReadStorage<CartItem[]>('pca_cart', []));
  const [wishlist, setWishlist] = useState<string[]>(() => safeReadStorage<string[]>('pca_wishlist', []));
  const [claimedOfferPhone, setClaimedOfferPhone] = useState<string>(() =>
    safeReadStorage<string>('pca_offer_phone', '')
  );
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartPulse, setCartPulse] = useState(false);
  const [flyEvent, setFlyEvent] = useState<FlyToCartEvent | null>(null);
  const [orders, setOrders] = useState<Order[]>(() => safeReadStorage<Order[]>('pca_orders', []));
  const [savedProfile, setSavedProfile] = useState<OrderCustomer>(() =>
    safeReadStorage<OrderCustomer>('pca_profile', {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: 'Sialkot',
      notes: '',
    })
  );
  const [customReviews, setCustomReviews] = useState<Record<string, ProductReview[]>>(() =>
    safeReadStorage<Record<string, ProductReview[]>>('pca_reviews', {})
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('pca_theme', JSON.stringify(theme));
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('pca_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('pca_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('pca_offer_phone', JSON.stringify(claimedOfferPhone));
    } catch {
      // ignore
    }
  }, [claimedOfferPhone]);

  useEffect(() => {
    try {
      localStorage.setItem('pca_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('pca_profile', JSON.stringify(savedProfile));
    } catch {
      // ignore
    }
  }, [savedProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('pca_reviews', JSON.stringify(customReviews));
    } catch {
      // ignore
    }
  }, [customReviews]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { id, title, description, type }]);
      setTimeout(() => {
        dismissToast(id);
      }, 3600);
    },
    [dismissToast]
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const addToCart = useCallback(
    (
      product: Product,
      variantLabel?: string,
      quantity = 1,
      originRect?: { left: number; top: number; width: number; height: number }
    ) => {
      const chosenVariant =
        variantLabel || product.variants[0]?.label || 'Standard Edition';
      const variantObj = product.variants.find((v) => v.label === chosenVariant);
      const unitPrice = product.price + (variantObj?.priceDelta ?? 0);

      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.productId === product.id && item.variantLabel === chosenVariant
        );
        if (existingIndex > -1) {
          const next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: Math.min(product.stock, next[existingIndex].quantity + quantity),
          };
          return next;
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            image: product.images[0],
            variantLabel: chosenVariant,
            price: unitPrice,
            quantity: Math.min(product.stock, quantity),
          },
        ];
      });

      if (originRect) {
        const eventId = Date.now();
        setFlyEvent({
          id: eventId,
          image: product.images[0],
          startX: originRect.left + originRect.width / 2,
          startY: originRect.top + originRect.height / 2,
        });
        setTimeout(() => {
          setFlyEvent((curr) => (curr?.id === eventId ? null : curr));
        }, 720);
      }

      setCartPulse(true);
      setTimeout(() => setCartPulse(false), 600);
      showToast('Added to Cart', `${product.name} (${chosenVariant})`, 'success');
    },
    [showToast]
  );

  const addBundleToCart = useCallback(
    (products: Product[], bundleTitle: string) => {
      setCart((prev) => {
        const next = [...prev];
        for (const product of products) {
          const chosenVariant = product.variants[0]?.label || 'Standard Edition';
          const idx = next.findIndex(
            (i) => i.productId === product.id && i.variantLabel === chosenVariant
          );
          if (idx > -1) {
            next[idx] = {
              ...next[idx],
              quantity: Math.min(product.stock, next[idx].quantity + 1),
            };
          } else {
            next.push({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              image: product.images[0],
              variantLabel: chosenVariant,
              price: product.price,
              quantity: 1,
            });
          }
        }
        return next;
      });
      setCartPulse(true);
      setTimeout(() => setCartPulse(false), 600);
      setIsCartOpen(true);
      showToast('Bundle Added to Cart', `${bundleTitle} (${products.length} items)`, 'success');
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (productId: string, variantLabel: string, quantity: number) => {
      if (quantity <= 0) {
        setCart((prev) =>
          prev.filter(
            (i) => !(i.productId === productId && i.variantLabel === variantLabel)
          )
        );
        return;
      }
      setCart((prev) =>
        prev.map((i) =>
          i.productId === productId && i.variantLabel === variantLabel
            ? { ...i, quantity }
            : i
        )
      );
    },
    []
  );

  const removeFromCart = useCallback((productId: string, variantLabel: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.variantLabel === variantLabel))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const claimFirstOrderOffer = useCallback(
    (whatsappPhone: string) => {
      const cleaned = whatsappPhone.trim();
      setClaimedOfferPhone(cleaned);
      setSavedProfile((prev) => ({
        ...prev,
        phone: prev.phone || cleaned,
      }));
      showToast('5% First-Order Discount Unlocked!', 'Applied automatically at checkout.', 'success');
    },
    [showToast]
  );

  const toggleWishlist = useCallback(
    (product: Product) => {
      setWishlist((prev) => {
        const exists = prev.includes(product.id);
        if (exists) {
          showToast('Removed from Wishlist', product.name, 'info');
          return prev.filter((id) => id !== product.id);
        }
        showToast('Saved to Wishlist', product.name, 'success');
        return [...prev, product.id];
      });
    },
    [showToast]
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const toggleCompare = useCallback(
    (product: Product) => {
      setCompareIds((prev) => {
        if (prev.includes(product.id)) {
          return prev.filter((id) => id !== product.id);
        }
        if (prev.length >= 3) {
          showToast('Compare Limit Reached', 'You can compare up to 3 products at once.', 'info');
          return prev;
        }
        showToast('Added to Compare', product.name, 'info');
        return [...prev, product.id];
      });
    },
    [showToast]
  );

  const clearCompare = useCallback(() => {
    setCompareIds([]);
    setIsCompareOpen(false);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const firstOrderDiscountPct = claimedOfferPhone ? STORE_INFO.firstOrderDiscountPct : 0;
  const firstOrderDiscountAmount = Math.round((cartSubtotal * firstOrderDiscountPct) / 100);

  const placeOrder = useCallback(
    (customer: OrderCustomer, paymentMethod: PaymentMethodId): Order => {
      const discountedSubtotal = Math.max(0, cartSubtotal - firstOrderDiscountAmount);
      const shipping =
        discountedSubtotal >= STORE_INFO.freeDeliveryThreshold || discountedSubtotal === 0
          ? 0
          : STORE_INFO.standardShippingFee;
      const newOrder: Order = {
        orderId: `PCA-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        customer,
        paymentMethod,
        items: [...cart],
        subtotal: discountedSubtotal,
        shipping,
        total: discountedSubtotal + shipping,
        status: 'Confirmed',
      };
      setOrders((prev) => [newOrder, ...prev]);
      setSavedProfile(customer);
      setCart([]);
      return newOrder;
    },
    [cart, cartSubtotal, firstOrderDiscountAmount]
  );

  const getOrderById = useCallback(
    (orderId: string) => orders.find((o) => o.orderId === orderId),
    [orders]
  );

  const saveProfile = useCallback(
    (profile: OrderCustomer) => {
      setSavedProfile(profile);
      showToast('Profile Updated', 'Your delivery address has been saved.', 'success');
    },
    [showToast]
  );

  const addReview = useCallback(
    (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'verified'>) => {
      const nextReview: ProductReview = {
        ...review,
        id: `rev-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        verified: true,
      };
      setCustomReviews((prev) => ({
        ...prev,
        [productId]: [nextReview, ...(prev[productId] || [])],
      }));
      showToast('Review Submitted', 'Thank you for sharing your feedback!', 'success');
    },
    [showToast]
  );

  return (
    <StoreContext.Provider
      value={{
        theme,
        toggleTheme,
        cart,
        addToCart,
        addBundleToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        firstOrderDiscountPct,
        firstOrderDiscountAmount,
        claimFirstOrderOffer,
        claimedOfferPhone,
        isCartOpen,
        setIsCartOpen,
        cartPulse,
        flyEvent,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareIds,
        toggleCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        quickViewProduct,
        setQuickViewProduct,
        orders,
        placeOrder,
        getOrderById,
        savedProfile,
        saveProfile,
        customReviews,
        addReview,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
