"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Truck, Shield, RotateCcw } from "lucide-react";
import { HERO_DATA } from "@/config/homeData";

export default function HeroSection() {
  return (
    <section className="relative bg-background-luxury overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-champagne/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#1F1F1F 1px, transparent 1px), linear-gradient(90deg, #1F1F1F 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[600px] lg:min-h-[750px] py-16 lg:py-24">
          {/* ===== LEFT CONTENT ===== */}
          <div className="text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-gold/30 px-4 py-2 rounded-full mb-6 shadow-sm animate-fade-in">
              <Sparkles size={12} className="text-gold" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium">
                {HERO_DATA.subtitle}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-charcoal leading-[1.05] mb-6 animate-slide-up">
              Sunnah in
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 italic">Style</span>
                {/* Gold underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
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
            <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-slide-up">
              {HERO_DATA.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-3 flex-wrap justify-center lg:justify-start mb-12 animate-slide-up">
              <Link
                href={HERO_DATA.primaryButton.url}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-charcoal hover:bg-gold text-white text-sm uppercase tracking-widest font-medium transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {HERO_DATA.primaryButton.label}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href={HERO_DATA.secondaryButton.url}
                className="inline-flex items-center justify-center px-8 py-4 bg-white border border-charcoal text-charcoal hover:bg-charcoal hover:text-white text-sm uppercase tracking-widest font-medium transition-all duration-300 rounded-full"
              >
                {HERO_DATA.secondaryButton.label}
              </Link>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 animate-fade-in">
              {[
                { icon: Truck, label: "Fast Delivery" },
                { icon: Shield, label: "Secure Payment" },
                { icon: RotateCcw, label: "Easy Returns" },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-border"
                  >
                    <Icon size={18} className="text-gold" />
                    <p className="text-[10px] uppercase tracking-widest text-text-muted text-center">
                      {feature.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== RIGHT IMAGE ===== */}
          <div className="relative animate-fade-in">
            {/* Main Image Container */}
            <div className="relative">
              {/* Rotating Gold Ring Background */}
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
                  className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-1000"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Top-left corner accent */}
                <div className="absolute top-5 left-5 w-14 h-14 border-t-2 border-l-2 border-gold rounded-tl-2xl" />

                {/* Bottom-right corner accent */}
                <div className="absolute bottom-5 right-5 w-14 h-14 border-b-2 border-r-2 border-gold rounded-br-2xl" />

                {/* Floating Badge — Top Right */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-charcoal font-medium">
                    New Collection
                  </span>
                </div>

                {/* Floating Card — Bottom Left */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gold font-medium mb-1">
                        Signature Collection
                      </p>
                      <p className="font-serif text-base text-charcoal">
                        Premium Thobe
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-xl text-charcoal">
                        ৳5,490
                      </p>
                      <p className="text-[10px] text-text-muted line-through">
                        ৳6,200
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Gold Frame Behind */}
              <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-gold/30 rounded-3xl -z-10 hidden lg:block" />

              {/* Dot Pattern Bottom Left */}
              <div className="absolute -bottom-6 -left-6 hidden lg:block">
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(25)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                  ))}
                </div>
              </div>

              {/* Vertical Text Right Side */}
              <div className="absolute top-1/2 -right-12 -translate-y-1/2 hidden xl:block">
                <p
                  className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium"
                  style={{ writingMode: "vertical-rl" }}
                >
                  PREMIUM • AUTHENTIC • CRAFTED
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-text-muted">
        <p className="text-[10px] uppercase tracking-[0.3em]">Scroll</p>
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
