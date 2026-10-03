"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BRAND_STORY } from "@/config/homeData";

// Default fallback (used if API fails or loading)
const DEFAULT_STATS = [
  { label: "Happy Customers", value: "10K+" },
  { label: "Premium Fabrics", value: "50+" },
  { label: "Handcrafted", value: "100%" },
  { label: "Customer Rating", value: "5★" },
];

export default function BrandStory() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/api/brand-stats");
      if (data.data.stats && data.data.stats.length > 0) {
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error("Stats fetch error:", error);
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ROUNDED IMAGE CARD */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src={BRAND_STORY.image}
                alt={BRAND_STORY.title}
                className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute top-5 left-5 w-12 h-12 border-t-2 border-l-2 border-gold/80 rounded-tl-2xl" />
              <div className="absolute bottom-5 right-5 w-12 h-12 border-b-2 border-r-2 border-gold/80 rounded-br-2xl" />
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-lg">
                <p className="text-[10px] uppercase tracking-widest text-gold font-medium mb-0.5">
                  Since 2020
                </p>
                <p className="font-serif text-lg text-charcoal">
                  Crafted with Care
                </p>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-32 h-32 border-2 border-gold/30 rounded-3xl -z-10 hidden lg:block" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 hidden lg:block">
              <div className="grid grid-cols-4 gap-2">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                ))}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="order-1 lg:order-2">
            <p className="heading-sub">{BRAND_STORY.subtitle}</p>
            <h2 className="heading-section">{BRAND_STORY.title}</h2>
            <p className="text-text-secondary leading-relaxed mb-10">
              {BRAND_STORY.description}
            </p>

            {/* DYNAMIC Stats Grid */}
            <div className="grid grid-cols-2 gap-5">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-background-luxury rounded-2xl p-5 border border-border hover:border-gold/40 hover:shadow-lg transition-all duration-300 relative group"
                >
                  {/* Auto badge */}
                  {stat.auto && !loading && (
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      <span className="text-[8px] uppercase tracking-widest text-success font-medium">
                        Live
                      </span>
                    </div>
                  )}

                  <p className="font-serif text-3xl md:text-4xl text-gold mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-text-muted">
                    {stat.label}
                  </p>

                  {/* Extra info for rating */}
                  {stat.label === "Customer Rating" && stat.totalReviews > 0 && (
                    <p className="text-[10px] text-text-muted mt-2">
                      Based on {stat.totalReviews} reviews
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Signature Line */}
            <div className="mt-10 pt-6 border-t border-border">
              <p className="font-serif text-lg text-charcoal italic">
                "Elegance in Every Thread"
              </p>
              <p className="text-xs uppercase tracking-widest text-gold mt-2">
                — The THOBEIAN Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
