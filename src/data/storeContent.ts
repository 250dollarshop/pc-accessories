import { HeroSlide, Testimonial, FAQItem, PaymentMethodId } from '../types/store';
import { STORE_IMAGES } from './images';

export const STORE_INFO = {
  name: 'PRIME COMPUTER ACCESSORIES',
  shortName: 'PRIME',
  phoneDisplay: '+92 329 8025766',
  phoneRaw: '+923298025766',
  whatsappBase: 'https://wa.me/923298025766',
  email: '250dollarshop@gmail.com',
  location: 'Sialkot, Punjab, Pakistan',
  currencyPrefix: 'Rs.',
  freeDeliveryThreshold: 15000,
  standardShippingFee: 350,
  firstOrderDiscountPct: 5,
};

export function formatPKR(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

export function buildProductWhatsAppUrl(
  productName: string,
  price: number,
  slug: string,
  qty = 1,
  variant?: string
): string {
  const origin =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : '';
  const productUrl = `${origin}#/product/${slug}`;
  const lines = [
    `Assalam-o-Alaikum PRIME COMPUTER ACCESSORIES! I want to order:`,
    `• Product: ${productName}${variant ? ` (${variant})` : ''}`,
    `• Price: ${formatPKR(price)}`,
    `• Quantity: ${qty}`,
    `• Link: ${productUrl}`,
  ];
  return `${STORE_INFO.whatsappBase}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export const CITY_DELIVERY_ESTIMATES: Record<string, string> = {
  Sialkot: 'Same-Day / 24 Hours (Local Dispatch)',
  Gujranwala: '1–2 Working Days',
  Gujrat: '1–2 Working Days',
  Lahore: '1–2 Working Days',
  Islamabad: '1–2 Working Days',
  Rawalpindi: '1–2 Working Days',
  Faisalabad: '2–3 Working Days',
  Multan: '2–3 Working Days',
  Karachi: '2–4 Working Days',
  Peshawar: '2–4 Working Days',
  Hyderabad: '2–4 Working Days',
  Quetta: '3–5 Working Days',
};

export function getDeliveryEstimate(city: string): string {
  return CITY_DELIVERY_ESTIMATES[city] || '2–4 Working Days Across Pakistan';
}

export const ANNOUNCEMENTS: string[] = [
  'Open Parcel Before Payment Available Across Pakistan',
  'Free Delivery on Orders Above Rs. 15,000 Nationwide',
  'Cash on Delivery + 7-Day Replacement Warranty + Warranty Card Included',
  'Order in 1 Tap on WhatsApp: +92 329 8025766 (Reply in 5 Mins)',
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-headsets',
    label: 'Acoustic Precision · 7.1 Spatial Audio',
    headlinePrefix: 'Hear Every',
    headlineAccent: 'Detail.',
    subtext: 'Tri-mode wireless gaming and studio headsets engineered with ultra-low latency drivers.',
    theme: 'light',
    image: STORE_IMAGES.heroHeadsetBlue,
    imageAlt: 'Wireless gaming headset with electric royal blue LED rings',
    fromPrice: 9499,
    specs: ['2.4GHz Wireless', '50mm Drivers', 'Warranty Card'],
    ctaCategory: 'headsets',
    ctaProductSlug: 'razer-blackshark-v2-hyperspeed',
  },
  {
    id: 'slide-keyboards',
    label: 'Gasket Mounted · Hot-Swappable',
    headlinePrefix: 'Type at the Speed',
    headlineAccent: 'of Thought.',
    subtext: 'CNC-anodized mechanical keyboards built with lubricated linear switches and per-key ice RGB.',
    theme: 'dark',
    image: STORE_IMAGES.heroKeyboardNavy,
    imageAlt: 'CNC aluminum mechanical keyboard with cyan underglow',
    fromPrice: 14999,
    specs: ['Hot-Swap PCB', 'PBT Keycaps', 'Open Parcel COD'],
    ctaCategory: 'keyboards',
    ctaProductSlug: 'logitech-g-pro-x-tkl-lightspeed',
  },
  {
    id: 'slide-monitors',
    label: 'IPS Black · 180Hz & 4K UHD',
    headlinePrefix: 'See Beyond',
    headlineAccent: 'Ordinary.',
    subtext: 'Color-calibrated 4K creator displays and rapid-IPS gaming panels with ultra-slim silver bezels.',
    theme: 'cyan',
    image: STORE_IMAGES.heroMonitorSetup,
    imageAlt: 'Frameless 4K IPS monitor on brushed aluminum stand',
    fromPrice: 41999,
    specs: ['4K UHD IPS', '180Hz / 1ms', 'USB-C 90W PD'],
    ctaCategory: 'monitors',
    ctaProductSlug: 'dell-ultrasharp-27-4k-usbc',
  },
  {
    id: 'slide-mice',
    label: '32K Optical Sensor · 60g Ultralight',
    headlinePrefix: 'Precision.',
    headlineAccent: 'Redefined.',
    subtext: 'Featherweight wireless esports mice and sculpted ergonomic masters built for zero-drag control.',
    theme: 'ink',
    image: STORE_IMAGES.heroMouseInk,
    imageAlt: 'Ultralight matte obsidian wireless gaming mouse with blue glow',
    fromPrice: 6499,
    specs: ['32,000 DPI', '95-Hr Battery', '7-Day Warranty'],
    ctaCategory: 'mouse',
    ctaProductSlug: 'logitech-g-pro-x-superlight-2',
  },
];

export const PAKISTAN_CITIES: string[] = [
  'Sialkot',
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Gujranwala',
  'Peshawar',
  'Quetta',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Gujrat',
  'Abbottabad',
  'Mardan',
  'Sheikhupura',
  'Rahim Yar Khan',
  'Sahiwal',
  'Mirpur (AJK)',
];

export const PAYMENT_METHODS: {
  id: PaymentMethodId;
  name: string;
  subtitle: string;
  instructions: string;
}[] = [
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    subtitle: 'Default · Open parcel & pay cash at your doorstep',
    instructions: 'Inspect sealed retail box upon arrival before paying cash to the rider.',
  },
  {
    id: 'jazzcash',
    name: 'JazzCash Mobile Account',
    subtitle: 'Instant mobile wallet transfer before dispatch',
    instructions: 'Send order total to +923298025766 (PRIME COMPUTER ACCESSORIES) and share screenshot on WhatsApp.',
  },
  {
    id: 'easypaisa',
    name: 'Easypaisa Wallet',
    subtitle: 'Fast digital transfer via Easypaisa app',
    instructions: 'Transfer to +923298025766 and reply with your Order ID on WhatsApp for priority dispatch.',
  },
  {
    id: 'bank',
    name: 'Bank Transfer (IBFT / Raast)',
    subtitle: 'Direct bank-to-bank transfer with zero extra fees',
    instructions: 'Account details are shared immediately on Order Confirmation & WhatsApp.',
  },
];

export const BRANDS_LIST: { name: string; tagline: string; hoverColor: string }[] = [
  { name: 'Logitech', tagline: 'Swiss Peripherals', hoverColor: '#00B8FC' },
  { name: 'Razer', tagline: 'Esports Gear', hoverColor: '#00D65B' },
  { name: 'Samsung', tagline: 'NVMe & Displays', hoverColor: '#1428A0' },
  { name: 'Dell', tagline: 'UltraSharp Monitors', hoverColor: '#007DB8' },
  { name: 'HP', tagline: 'HyperX & Pro Gear', hoverColor: '#0096D6' },
  { name: 'Anker', tagline: 'GaN Power & Hubs', hoverColor: '#00A9E0' },
  { name: 'Redragon', tagline: 'Mechanical RGB', hoverColor: '#E11D48' },
  { name: 'TP-Link', tagline: 'Wi-Fi 6E Mesh', hoverColor: '#0A9E88' },
  { name: 'Havit', tagline: 'Audio & Cooling', hoverColor: '#F97316' },
  { name: 'A4Tech', tagline: 'Bloody & Office', hoverColor: '#DC2626' },
];

export interface BundleDeal {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  discountPct: number;
  productSlugs: string[];
  image: string;
  theme: 'blue' | 'navy';
}

export const BUNDLE_DEALS: BundleDeal[] = [
  {
    id: 'bundle-gaming',
    badge: 'SAVE 15% COMBO',
    title: 'Pro Gaming Combo Setup',
    subtitle:
      'Redragon K673 Pro 75% Gasket Keyboard + Bloody R90 Wireless Mouse + Havit Wireless Headset + Logitech G840 XL Mat.',
    discountPct: 15,
    productSlugs: [
      'redragon-k673-pro-ice-75-gasket',
      'a4tech-bloody-r90-plus-wireless',
      'havit-h2002d-studio-pro-headset',
      'logitech-g840-xl-gaming-desk-mat',
    ],
    image: STORE_IMAGES.catGamingGearPro,
    theme: 'blue',
  },
  {
    id: 'bundle-wfh',
    badge: 'SAVE 12% COMBO',
    title: 'Work From Home Executive Setup',
    subtitle:
      'Logitech MX Master 3S + Anker 11-in-1 USB-C Hub + CNC Aluminum Laptop Riser + Anker 2K QHD Webcam.',
    discountPct: 12,
    productSlugs: [
      'logitech-mx-master-3s-graphite',
      'anker-565-11-in-1-usbc-hub',
      'prime-cnc-aluminum-ergonomic-stand',
      'anker-powerconf-c200-2k-webcam',
    ],
    image: STORE_IMAGES.catLaptopStandHub,
    theme: 'navy',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Hamza Tariq',
    city: 'Lahore',
    role: 'Software Architect',
    rating: 5,
    productPurchased: 'Logitech MX Master 3S',
    quote:
      'Ordered on Monday afternoon and received my sealed Logitech mouse in DHA Lahore the next day. Genuine serial verification worked on the official site.',
  },
  {
    id: 't2',
    name: 'Ayesha Siddiqui',
    city: 'Karachi',
    role: 'UI/UX Designer',
    rating: 5,
    productPurchased: 'Dell UltraSharp 27" 4K',
    quote:
      'Packaging was immaculate with double foam protection. Colors out of the box are accurate and WhatsApp support guided me on USB-C 90W delivery.',
  },
  {
    id: 't3',
    name: 'Bilal Cheema',
    city: 'Sialkot',
    role: 'Esports Streamer',
    rating: 5,
    productPurchased: 'Razer BlackShark V2 HyperSpeed',
    quote:
      'Best peripheral store in Sialkot by a mile. Same-day delivery, authentic Razer seal, and warranty card included inside the box.',
  },
  {
    id: 't4',
    name: 'Zainab Malik',
    city: 'Islamabad',
    role: 'Video Editor',
    rating: 5,
    productPurchased: 'Samsung 990 PRO 2TB NVMe',
    quote:
      'Zero fake stock, fair PKR pricing, and Cash on Delivery worked seamlessly in F-7 Islamabad. My 4K timeline renders twice as fast now.',
  },
  {
    id: 't5',
    name: 'Usman Raza',
    city: 'Faisalabad',
    role: 'Full-Stack Developer',
    rating: 5,
    productPurchased: 'Redragon K673 PRO 75%',
    quote:
      'Confirmed via WhatsApp in 3 minutes and opened the parcel before paying the TCS rider. Thocky linear switches feel unreal for the price.',
  },
  {
    id: 't6',
    name: 'Fahad Qureshi',
    city: 'Rawalpindi',
    role: 'CS Student & Gamer',
    rating: 5,
    productPurchased: 'Logitech G PRO X Superlight 2',
    quote:
      'Was worried about buying a Rs. 38k mouse online, but their open-parcel COD guarantee gave me peace of mind. 100% original sealed unit.',
  },
  {
    id: 't7',
    name: 'Sana Mir',
    city: 'Multan',
    role: 'Digital Marketer',
    rating: 5,
    productPurchased: 'Anker 100W GaN Charger',
    quote:
      'Charges my MacBook Pro and iPhone together without heating up. Arrived in Multan in 48 hours with proper warranty card.',
  },
  {
    id: 't8',
    name: 'Kamran Butt',
    city: 'Gujranwala',
    role: 'Agency Owner',
    rating: 5,
    productPurchased: 'TP-Link Deco XE75 Mesh',
    quote:
      'Bought two Deco mesh packs for our software house. Zero Wi-Fi drops across three floors and fast bank transfer verification.',
  },
];

export const FAQS: FAQItem[] = [
  {
    id: 'f1',
    category: 'Authenticity & Warranty',
    question: 'Are all products at PRIME COMPUTER ACCESSORIES 100% original?',
    answer:
      'Yes. Every keyboard, mouse, headset, monitor, SSD, and charger we sell is 100% authentic, factory-sealed stock sourced from authorized regional distributors with an official Warranty Card included.',
  },
  {
    id: 'f2',
    category: 'Open Parcel & COD',
    question: 'Can I check or open the parcel before paying Cash on Delivery?',
    answer:
      'Yes! We support Open Parcel Before Payment on verified Cash on Delivery orders so you can confirm the exact product model and sealed retail condition before paying the rider.',
  },
  {
    id: 'f3',
    category: 'Authenticity & Warranty',
    question: 'How does the 7-Day Replacement Warranty work?',
    answer:
      'If your item arrives with a manufacturing defect or transit damage, contact us on WhatsApp (+92 329 8025766) within 7 days of delivery with photos or a quick clip. We arrange an instant replacement.',
  },
  {
    id: 'f4',
    category: 'Delivery & COD',
    question: 'How much is shipping and how fast do orders arrive?',
    answer:
      'Orders above Rs. 15,000 qualify for FREE nationwide delivery. Orders below Rs. 15,000 carry a flat Rs. 350 courier charge. Major Punjab cities receive parcels in 1–2 working days; Karachi, Islamabad & nationwide in 2–4 working days.',
  },
  {
    id: 'f5',
    category: 'Payments',
    question: 'Which payment methods do you accept?',
    answer:
      'Cash on Delivery (default), JazzCash, Easypaisa, and direct Bank Transfer (IBFT / Raast) with zero extra fees.',
  },
  {
    id: 'f6',
    category: 'Orders & Support',
    question: 'How quickly do you reply on WhatsApp?',
    answer:
      'Our Sialkot desk replies within 5 minutes during store hours (10 AM – 11 PM PKT). Message +92 329 8025766 anytime for compatibility advice or instant ordering.',
  },
];
