"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { CUSTOM_THOBE_CTA } from "@/config/homeData";

export default function CustomThobeCTA() {
  return (
    <section className="section-padding bg-background-luxury relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ===== ROUNDED IMAGE CARD ===== */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src={CUSTOM_THOBE_CTA.image}
                alt={CUSTOM_THOBE_CTA.title}
                className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Light Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Top-left gold corner */}
              <div className="absolute top-5 left-5 w-12 h-12 border-t-2 border-l-2 border-gold rounded-tl-2xl" />

              {/* Bottom-right gold corner */}
              <div className="absolute bottom-5 right-5 w-12 h-12 border-b-2 border-r-2 border-gold rounded-br-2xl" />

              {/* Floating Badge */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                <Sparkles size={14} className="text-gold" />
                <span className="text-[10px] uppercase tracking-widest text-charcoal font-medium">
                  Custom Made
                </span>
              </div>
            </div>

            {/* Behind Frame */}
            <div className="absolute -top-4 -right-4 w-32 h-32 border-2 border-gold/20 rounded-3xl -z-10 hidden lg:block" />
          </div>

          {/* ===== CONTENT ===== */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-4 py-2 rounded-full mb-6">
              <Sparkles size={12} className="text-gold" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-medium">
                {CUSTOM_THOBE_CTA.subtitle}
              </p>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6 leading-tight">
              {CUSTOM_THOBE_CTA.title}
            </h2>

            <p className="text-text-secondary text-lg mb-8 max-w-lg leading-relaxed">
              {CUSTOM_THOBE_CTA.description}
            </p>

            {/* Features */}
            <div className="space-y-3 mb-10">
              {[
                "Choose from 10+ premium fabrics",
                "Select collar, placket, buttons & more",
                "Provide exact measurements",
                "Live 3D preview of your design",
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-text-secondary">{feature}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={CUSTOM_THOBE_CTA.button.url}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-charcoal hover:bg-gold text-white text-sm uppercase tracking-widest font-medium transition-all duration-300 rounded-full group"
              >
                {CUSTOM_THOBE_CTA.button.label}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white text-sm uppercase tracking-widest font-medium transition-all duration-300 rounded-full"
              >
                Talk to Designer
              </Link>
            </div>

            {/* Trust Line */}
            <p className="text-xs text-text-muted mt-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Crafted in 7-14 days • Free design consultation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
