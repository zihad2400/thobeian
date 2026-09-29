// ================================================================
// HOMEPAGE DATA (Temporary — পরে Admin Panel থেকে dynamic হবে)
// ================================================================

export const HERO_DATA = {
  subtitle: "PREMIUM ISLAMIC FASHION",

  title: "Sunnah in Style",

  description:
    "Premium Thobes & Panjabis — crafted for the modern gentleman.",

  primaryButton: {
    label: "Shop Collection",
    url: "/shop",
  },

  secondaryButton: {
    label: "Customize Your Thobe",
    url: "/custom-thobe",
  },

  image: "/images/home/hero-thobe.jpg",
};


// ================================================================
// CATEGORIES
// ================================================================

export const CATEGORIES = [
  {
    name: "Thobe",
    slug: "thobe",
    image: "/images/categories/thobe.jpg",
    productCount: 24,
  },

  {
    name: "Panjabi",
    slug: "panjabi",
    image: "/images/categories/panjabi.jpg",
    productCount: 32,
  },

  {
    name: "Fabrics",
    slug: "fabrics",
    image: "/images/categories/fabrics.jpg",
    productCount: 12,
  },

  {
    name: "Custom Thobe",
    slug: "custom-thobe",
    image: "/images/categories/custom-thobe.jpg",
    productCount: 0,
  },
];


// ================================================================
// FEATURED PRODUCTS
// ================================================================

export const FEATURED_PRODUCTS = [
  {
    _id: "1",

    name: "Premium Signature Thobe",

    slug: "premium-signature-thobe",

    image: "/images/products/thobe/premium-signature-thobe.jpg",

    hoverImage: "/images/products/thobe/premium-signature-thobe-hover.jpg",

    price: 5490,

    compareAtPrice: 6200,

    rating: 4.8,

    reviewCount: 24,

    badge: "bestseller",

    inStock: true,
  },

  {
    _id: "2",

    name: "Classic Saudi Thobe",

    slug: "classic-saudi-thobe",

    image: "/images/products/thobe/classic-saudi-thobe.jpg",

    hoverImage: "/images/products/thobe/classic-saudi-thobe-hover.jpg",

    price: 4290,

    compareAtPrice: 4900,

    rating: 4.6,

    reviewCount: 18,

    badge: "new",

    inStock: true,
  },

  {
    _id: "3",

    name: "Premium Embroidered Panjabi",

    slug: "premium-embroidered-panjabi",

    image: "/images/products/panjabi/premium-embroidered-panjabi.jpg",

    hoverImage:
      "/images/products/panjabi/premium-embroidered-panjabi-hover.jpg",

    price: 3890,

    compareAtPrice: 4500,

    rating: 4.9,

    reviewCount: 42,

    badge: "featured",

    inStock: true,
  },

  {
    _id: "4",

    name: "Emirati Style Thobe",

    slug: "emirati-style-thobe",

    image: "/images/products/thobe/emirati-style-thobe.jpg",

    hoverImage: "/images/products/thobe/emirati-style-thobe-hover.jpg",

    price: 6490,

    compareAtPrice: 7500,

    rating: 4.7,

    reviewCount: 15,

    badge: "bestseller",

    inStock: true,
  },

  {
    _id: "5",

    name: "Linen Summer Thobe",

    slug: "linen-summer-thobe",

    image: "/images/products/thobe/linen-summer-thobe.jpg",

    hoverImage: "/images/products/thobe/linen-summer-thobe-hover.jpg",

    price: 3490,

    compareAtPrice: null,

    rating: 4.5,

    reviewCount: 12,

    badge: "new",

    inStock: true,
  },

  {
    _id: "6",

    name: "Royal Black Thobe",

    slug: "royal-black-thobe",

    image: "/images/products/thobe/royal-black-thobe.jpg",

    hoverImage: "/images/products/thobe/royal-black-thobe-hover.jpg",

    price: 5990,

    compareAtPrice: 6800,

    rating: 4.8,

    reviewCount: 28,

    badge: "featured",

    inStock: true,
  },

  {
    _id: "7",

    name: "Band Collar Panjabi",

    slug: "band-collar-panjabi",

    image: "/images/products/panjabi/band-collar-panjabi.jpg",

    hoverImage:
      "/images/products/panjabi/band-collar-panjabi-hover.jpg",

    price: 2990,

    compareAtPrice: 3500,

    rating: 4.4,

    reviewCount: 8,

    badge: null,

    inStock: true,
  },

  {
    _id: "8",

    name: "Moroccan Style Thobe",

    slug: "moroccan-style-thobe",

    image: "/images/products/thobe/moroccan-style-thobe.jpg",

    hoverImage:
      "/images/products/thobe/moroccan-style-thobe-hover.jpg",

    price: 5290,

    compareAtPrice: 5900,

    rating: 4.7,

    reviewCount: 20,

    badge: "bestseller",

    inStock: true,
  },
];


// ================================================================
// CUSTOM THOBE CTA
// ================================================================

export const CUSTOM_THOBE_CTA = {
  subtitle: "DESIGNED BY YOU",

  title: "Create Your Own Thobe",

  description:
    "Choose fabric, color, collar, buttons, and measurements. We craft it just for you.",

  button: {
    label: "Customize Now",
    url: "/custom-thobe",
  },

  image: "/images/home/custom-thobe.jpg",
};


// ================================================================
// BRAND STORY
// ================================================================

export const BRAND_STORY = {
  subtitle: "OUR STORY",

  title: "Crafted with Purpose, Worn with Pride",

  description:
    "THOBEIAN was born from a simple vision — to bring premium Islamic fashion to the modern gentleman. Every thobe and panjabi is crafted with meticulous attention to detail, honoring tradition while embracing contemporary elegance.",

  stats: [
    {
      value: "10K+",
      label: "Happy Customers",
    },

    {
      value: "50+",
      label: "Premium Fabrics",
    },

    {
      value: "100%",
      label: "Handcrafted",
    },

    {
      value: "5★",
      label: "Customer Rating",
    },
  ],

  image: "/images/home/brand-story.jpg",
};


// ================================================================
// CUSTOMER REVIEWS
// ================================================================

export const CUSTOMER_REVIEWS = [
  {
    _id: "1",

    name: "Ahmed Rahman",

    city: "Dhaka",

    rating: 5,

    comment:
      "Absolutely stunning quality. The fabric feels premium and the fit is perfect. Will definitely order again!",

    productImage:
      "/images/products/thobe/premium-signature-thobe.jpg",
  },

  {
    _id: "2",

    name: "Mohammad Hasan",

    city: "Chittagong",

    rating: 5,

    comment:
      "Ordered a custom thobe for Eid. The measurement process was simple and the result was beyond expectations.",

    productImage:
      "/images/products/thobe/classic-saudi-thobe.jpg",
  },

  {
    _id: "3",

    name: "Rafiq Islam",

    city: "Sylhet",

    rating: 5,

    comment:
      "Best Islamic fashion brand in Bangladesh. Premium materials, fast delivery, excellent customer service.",

    productImage:
      "/images/products/panjabi/premium-embroidered-panjabi.jpg",
  },

  {
    _id: "4",

    name: "Karim Uddin",

    city: "Rajshahi",

    rating: 4,

    comment:
      "Great quality products. The panjabi I ordered fit perfectly. Delivery could be slightly faster.",

    productImage:
      "/images/products/panjabi/band-collar-panjabi.jpg",
  },
];


// ================================================================
// FAQS
// ================================================================

export const FAQS = [
  {
    _id: "1",

    question: "How do I choose the right size?",

    answer:
      "We provide a detailed size guide for every product. You can also use our custom measurement option at checkout for a perfect fit.",
  },

  {
    _id: "2",

    question: "What is your return policy?",

    answer:
      "We accept returns within 7 days of delivery for unused items in original packaging. Custom orders are non-returnable unless defective.",
  },

  {
    _id: "3",

    question: "How long does shipping take?",

    answer:
      "Inside Dhaka: 1-2 business days. Outside Dhaka: 2-4 business days. Express delivery available at additional cost.",
  },

  {
    _id: "4",

    question: "Do you offer custom tailoring?",

    answer:
      "Yes! Our Custom Thobe service lets you choose fabric, color, collar, buttons, and provide exact measurements.",
  },

  {
    _id: "5",

    question: "What payment methods do you accept?",

    answer:
      "We accept bKash, Nagad, SSLCommerz (card payments), and Cash on Delivery across Bangladesh.",
  },
];