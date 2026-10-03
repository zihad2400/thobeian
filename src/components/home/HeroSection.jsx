"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Truck, Shield, RotateCcw } from "lucide-react";
import { HERO_DATA } from "@/config/homeData";

export default function HeroSection() {
  return (
    <section className="relative bg-background-luxury overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-champagne/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#1F1F1F 1px, transparent 1px), linear-gradient(90deg, #1F1F1F 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile: Image First / Desktop: Two columns */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center lg:min-h-[750px]">
          
          {/* ===== MOBILE IMAGE FIRST (order-1 on mobile, order-2 on desktop) ===== */}
          <div className="relative order-1 lg:order-2 pt-6 lg:pt-16 animate-fade-in">
            {/* Main Image Container */}
            <div className="relative">
              {/* Rotating gold ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-[110%] h-[110%] border border-gold/20 rounded-full"
                  style={{ animation: "spin 60s linear infinite" }}
                />
              </div>

              {/* Main Image — Rounded Premium Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <img
                  src={HERO_DATA.image}
                  alt="Premium Thobe"
                  className="w-full aspect-[4/5] lg:aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-1000"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Gold corners */}
                <div className="absolute top-4 left-4 w-10 h-10 lg:w-14 lg:h-14 border-t-2 border-l-2 border-gold rounded-tl-2xl" />
                <div className="absolute bottom-4 right-4 w-10 h-10 lg:w-14 lg:h-14 border-b-2 border-r-2 border-gold rounded-br-2xl" />

                {/* Top Badge */}
                <div className="absolute top-4 right-4 lg:top-6 lg:right-6 bg-white/95 backdrop-blur-md px-3 py-2 lg:px-4 lg:py-2.5 rounded-full shadow-lg flex items-center gap-1.5 lg:gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-[9px] lg:text-[10px] uppercase tracking-widest text-charcoal font-medium">
                    New Collection
                  </span>
                </div>

                {/* Product Card — Bottom */}
                <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 lg:p-4 shadow-xl">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[9px] lg:text-[10px] uppercase tracking-widest text-gold font-medium mb-0.5 lg:mb-1">
                        Signature
                      </p>
                      <p className="font-serif text-sm lg:text-base text-charcoal truncate">
                        Premium Thobe
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-serif text-base lg:text-xl text-charcoal">
                        ৳5,490
                      </p>
                      <p className="text-[9px] lg:text-[10px] text-text-muted line-through">
                        ৳6,200
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative frame */}
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

          {/* ===== CONTENT (order-2 on mobile, order-1 on desktop) ===== */}
          <div className="text-center lg:text-left order-2 lg:order-1 pb-12 lg:pb-16">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-gold/30 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full mb-4 lg:mb-6 shadow-sm animate-fade-in">
              <Sparkles size={10} className="text-gold lg:w-3 lg:h-3" />
              <span className="text-[9px] lg:text-[10px] uppercase tracking-[0.25em] text-gold font-medium">
                {HERO_DATA.subtitle}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-charcoal leading-[1.05] mb-4 lg:mb-6 animate-slide-up">
              Sunnah in
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 italic">Style</span>
                <svg
                  className="absolute -bottom-1 lg:-bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9C50 3 150 3 198 9"
                    stroke="#C8A96B"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-text-secondary text-base lg:text-lg xl:text-xl mb-6 lg:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-slide-up px-2 lg:px-0">
              {HERO_DATA.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8 lg:mb-12 animate-slide-up px-4 lg:px-0">
              <Link
                href={HERO_DATA.primaryButton.url}
                className="group inline-flex items-center justify-center gap-2 px-6 lg:px-8 py-3.5 lg:py-4 bg-charcoal hover:bg-gold text-white text-xs lg:text-sm uppercase tracking-widest font-medium transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {HERO_DATA.primaryButton.label}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href={HERO_DATA.secondaryButton.url}
                className="inline-flex items-center justify-center px-6 lg:px-8 py-3.5 lg:py-4 bg-white border border-charcoal text-charcoal hover:bg-charcoal hover:text-white text-xs lg:text-sm uppercase tracking-widest font-medium transition-all duration-300 rounded-full"
              >
                {HERO_DATA.secondaryButton.label}
              </Link>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-3 gap-2 lg:gap-4 max-w-md mx-auto lg:mx-0 animate-fade-in px-2 lg:px-0">
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

      {/* Scroll Indicator (Desktop) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-text-muted">
        <p className="text-[10px] uppercase tracking-[0.3em]">Scroll</p>
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
