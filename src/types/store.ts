export interface Category {
  slug: string;
  name: string;
  itemCount: number;
  iconName: string;
  image: string;
  description: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  colorHex?: string;
  priceDelta?: number;
}

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isTopRated?: boolean;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  variants: ProductVariant[];
  specs: Record<string, string>;
  description: string;
  highlights: string[];
  images: string[];
  reviews: ProductReview[];
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  variantLabel: string;
  price: number;
  quantity: number;
}

export type PaymentMethodId = 'cod' | 'bank' | 'jazzcash' | 'easypaisa';

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
}

export interface Order {
  orderId: string;
  createdAt: string;
  customer: OrderCustomer;
  paymentMethod: PaymentMethodId;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'Confirmed' | 'Processing';
}

export interface HeroSlide {
  id: string;
  label: string;
  headlinePrefix: string;
  headlineAccent: string;
  subtext: string;
  theme: 'light' | 'dark' | 'cyan' | 'ink';
  image: string;
  imageAlt: string;
  fromPrice: number;
  specs: string[];
  ctaCategory: string;
  ctaProductSlug: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  role: string;
  rating: number;
  productPurchased: string;
  quote: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
