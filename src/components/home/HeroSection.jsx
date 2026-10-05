"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowRight,
  Sparkles,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Fallback data
const DEFAULT_HERO = {
  badge: "PREMIUM ISLAMIC FASHION",
  headlines: [
    { line1: "Sunnah in", line2: "Style" },
    { line1: "Elegance in", line2: "Every Thread" },
    { line1: "Tradition", line2: "Redefined" },
  ],
  autoRotate: true,
  rotateInterval: 5000,
  description: "Premium Thobes & Panjabis — crafted for the modern gentleman.",
  primaryButton: { label: "Shop Collection", url: "/shop" },
  secondaryButton: { label: "Customize Your Thobe", url: "/custom-thobe" },
  image: "/images/home/hero-thobe.jpg",
};

const HERO_IMAGES = [
  "/images/home/hero/hero1.jpeg",
  "/images/home/hero/hero2.jpeg",
  "/images/home/hero/hero3.jpeg",
  "/images/home/hero/hero4.jpeg",
  "/images/home/hero/hero5.jpeg",
  "/images/home/hero/hero6.jpeg",
  "/images/home/hero/hero7.jpeg",
  "/images/home/hero/hero8.jpeg",
];

const HERO_PRODUCTS = [
  {
    label: "Signature",
    name: "Premium Thobe",
    price: "৳5,490",
    oldPrice: "৳6,200",
  },
  {
    label: "Premium",
    name: "Luxury Thobe",
    price: "৳6,490",
    oldPrice: "৳7,200",
  },
  {
    label: "Exclusive",
    name: "Royal Thobe",
    price: "৳7,290",
    oldPrice: "৳8,000",
  },
  {
    label: "Essential",
    name: "Classic Panjabi",
    price: "৳3,490",
    oldPrice: "৳3,990",
  },
  {
    label: "Signature",
    name: "Premium Panjabi",
    price: "৳4,290",
    oldPrice: "৳4,900",
  },
  {
    label: "Luxury",
    name: "Pakistani Panjabi",
    price: "৳4,990",
    oldPrice: "৳5,600",
  },
  {
    label: "Premium",
    name: "Linen Thobe",
    price: "৳5,990",
    oldPrice: "৳6,700",
  },
  {
    label: "Exclusive",
    name: "Custom Thobe",
    price: "৳6,490",
    oldPrice: "৳7,200",
  },
];

export default function HeroSection() {
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [currentHeadline, setCurrentHeadline] = useState(0);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const { data } = await axios.get("/api/site-settings");
      const heroContent = data.data.settings?.homepageContent?.hero;
      if (heroContent) {
        setHero({ ...DEFAULT_HERO, ...heroContent });
      }
    } catch (error) {
      console.error("Hero fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-rotate hero images 3 seconds after every change
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [currentHeroImage]);

  const goToNextImage = () => {
    setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const goToPrevImage = () => {
    setCurrentHeroImage(
      (prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length
    );
  };

  // Auto-rotate headlines
  useEffect(() => {
    if (!hero.autoRotate || !hero.headlines || hero.headlines.length <= 1) {
      return;
    }

    const activeHeadlines = hero.headlines.filter((h) => h.active !== false);

    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % activeHeadlines.length);
    }, hero.rotateInterval || 5000);

    return () => clearInterval(interval);
  }, [hero]);

  const activeHeadlines = (hero.headlines || []).filter(
    (h) => h.active !== false
  );

  const currentHeroProduct =
    HERO_PRODUCTS[currentHeroImage] || HERO_PRODUCTS[0];

  const current = activeHeadlines[currentHeadline] || activeHeadlines[0] || {
    line1: "Sunnah in",
    line2: "Style",
  };

  const goToNext = () => {
    setCurrentHeadline((prev) => (prev + 1) % activeHeadlines.length);
  };

  const goToPrev = () => {
    setCurrentHeadline(
      (prev) => (prev - 1 + activeHeadlines.length) % activeHeadlines.length
    );
  };

  return (
    <section className="relative bg-background-luxury overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-champagne/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#1F1F1F 1px, transparent 1px), linear-gradient(90deg, #1F1F1F 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center lg:min-h-[750px]">
          {/* ===== IMAGE (Mobile first) ===== */}
          <div className="relative order-1 lg:order-2 pt-6 lg:pt-16">
            <div className="relative">
              {/* Rotating gold ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-[110%] h-[110%] border border-gold/20 rounded-full"
                  style={{ animation: "spin 60s linear infinite" }}
                />
              </div>

              {/* Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  {HERO_IMAGES.map((image, index) => (
                    <img
                      key={image}
                      src={image}
                      alt={`Thobeian Premium Collection ${index + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                        index === currentHeroImage
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Gold corners */}
                <div className="absolute top-4 left-4 w-10 h-10 lg:w-14 lg:h-14 border-t-2 border-l-2 border-gold rounded-tl-2xl" />
                <div className="absolute bottom-4 right-4 w-10 h-10 lg:w-14 lg:h-14 border-b-2 border-r-2 border-gold rounded-br-2xl" />

                {/* Live badge */}
                <div className="absolute top-4 right-4 lg:top-6 lg:right-6 bg-white/95 backdrop-blur-md px-3 py-2 lg:px-4 lg:py-2.5 rounded-full shadow-lg flex items-center gap-1.5 lg:gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-[9px] lg:text-[10px] uppercase tracking-widest text-charcoal font-medium">
                    New Collection
                  </span>
                </div>

                {/* Image carousel controls */}
                <button
                  onClick={goToPrevImage}
                  className="absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-charcoal hover:bg-gold hover:text-white transition-all duration-300"
                  aria-label="Previous hero image"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={goToNextImage}
                  className="absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-charcoal hover:bg-gold hover:text-white transition-all duration-300"
                  aria-label="Next hero image"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Image carousel dots */}
                <div className="absolute bottom-24 lg:bottom-28 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                  {HERO_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentHeroImage(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentHeroImage
                          ? "w-6 bg-gold"
                          : "w-1.5 bg-white/70 hover:bg-white"
                      }`}
                      aria-label={`Go to hero image ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Product card */}
                <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 lg:p-4 shadow-xl">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      key={`product-info-${currentHeroImage}`}
                      className="min-w-0 animate-slide-up"
                    >
                      <p className="text-[9px] lg:text-[10px] uppercase tracking-widest text-gold font-medium mb-0.5">
                        {currentHeroProduct.label}
                      </p>
                      <p className="font-serif text-sm lg:text-base text-charcoal truncate">
                        {currentHeroProduct.name}
                      </p>
                    </div>

                    <div
                      key={`product-price-${currentHeroImage}`}
                      className="text-right shrink-0 animate-slide-up"
                    >
                      <p className="font-serif text-base lg:text-xl text-charcoal">
                        {currentHeroProduct.price}
                      </p>
                      <p className="text-[9px] lg:text-[10px] text-text-muted line-through">
                        {currentHeroProduct.oldPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative */}
              <div className="absolute -top-4 -right-4 w-24 h-24 lg:w-32 lg:h-32 border-2 border-gold/30 rounded-3xl -z-10 hidden sm:block" />
              <div className="absolute -bottom-4 -left-4 hidden sm:block">
                <div className="grid grid-cols-4 gap-1.5 lg:gap-2">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ===== CONTENT (Text) ===== */}
          <div className="text-center lg:text-left order-2 lg:order-1 pb-12 lg:pb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-gold/30 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full mb-4 lg:mb-6 shadow-sm">
              <Sparkles size={10} className="text-gold lg:w-3 lg:h-3" />
              <span className="text-[9px] lg:text-[10px] uppercase tracking-[0.25em] text-gold font-medium">
                {hero.badge}
              </span>
            </div>

            {/* ===== DYNAMIC ROTATING HEADLINE ===== */}
            <div className="relative mb-4 lg:mb-6">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-charcoal leading-[1.05]">
                <span
                  key={currentHeadline}
                  className="inline-block animate-slide-up"
                >
                  {current.line1}
                  <br />
                  <span className="relative inline-block">
                    <span className="relative z-10 italic">{current.line2}</span>
                    <svg
                      className="absolute -bottom-1 lg:-bottom-2 left-0 w-full"
                      viewBox="0 0 200 12"
                      fill="none"
                    >
                      <path
                        d="M2 9C50 3 150 3 198 9"
                        stroke="#C8A96B"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </span>
              </h1>

              {/* Navigation arrows */}
              {activeHeadlines.length > 1 && (
                <div className="flex items-center justify-center lg:justify-start gap-2 mt-6">
                  <button
                    onClick={goToPrev}
                    className="p-2 border border-border hover:border-gold hover:text-gold transition-colors rounded-full"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Dots */}
                  <div className="flex items-center gap-2 mx-2">
                    {activeHeadlines.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentHeadline(idx)}
                        className={`h-1.5 transition-all duration-300 rounded-full ${
                          idx === currentHeadline
                            ? "w-8 bg-gold"
                            : "w-1.5 bg-border hover:bg-gold/50"
                        }`}
                        aria-label={`Go to headline ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={goToNext}
                    className="p-2 border border-border hover:border-gold hover:text-gold transition-colors rounded-full"
                    aria-label="Next"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-text-secondary text-base lg:text-lg xl:text-xl mb-6 lg:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 lg:px-0">
              {hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8 lg:mb-12 px-4 lg:px-0">
              <Link
                href={hero.primaryButton?.url || "/shop"}
                className="group inline-flex items-center justify-center gap-2 px-6 lg:px-8 py-3.5 lg:py-4 bg-charcoal hover:bg-gold text-white text-xs lg:text-sm uppercase tracking-widest font-medium transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {hero.primaryButton?.label || "Shop Collection"}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href={hero.secondaryButton?.url || "/custom-thobe"}
                className="inline-flex items-center justify-center px-6 lg:px-8 py-3.5 lg:py-4 bg-white border border-charcoal text-charcoal hover:bg-charcoal hover:text-white text-xs lg:text-sm uppercase tracking-widest font-medium transition-all duration-300 rounded-full"
              >
                {hero.secondaryButton?.label || "Customize Your Thobe"}
              </Link>
            </div>

            {/* Trust features */}
            <div className="grid grid-cols-3 gap-2 lg:gap-4 max-w-md mx-auto lg:mx-0 px-2 lg:px-0">
              {[
                { icon: Truck, label: "Fast Delivery" },
                { icon: Shield, label: "Secure Payment" },
                { icon: RotateCcw, label: "Easy Returns" },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 lg:gap-2 p-2 lg:p-3 bg-white/60 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-border"
                  >
                    <Icon size={14} className="text-gold lg:w-4 lg:h-4" />
                    <p className="text-[9px] lg:text-[10px] uppercase tracking-widest text-text-muted text-center leading-tight">
                      {feature.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-text-muted">
        <p className="text-[10px] uppercase tracking-[0.3em]">Scroll</p>
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
