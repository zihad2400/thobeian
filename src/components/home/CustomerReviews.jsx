"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Star, Quote, Loader2, CheckCircle } from "lucide-react";

export default function CustomerReviews() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await axios.get("/api/testimonials?limit=8");
      setTestimonials(data.data.testimonials || []);
    } catch (error) {
      console.error("Failed to load testimonials:", error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="section-padding bg-background-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-gold" />
          </div>
        </div>
      </section>
    );
  }

  // ⚠️ HIDE SECTION IF NO TESTIMONIALS
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-background-luxury">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="heading-sub">Testimonials</p>
          <h2 className="heading-section">Loved by Our Customers</h2>
          <div className="divider-gold mt-6" />
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {testimonials.map((review) => (
            <div
              key={review._id}
              className="bg-white p-6 border border-border hover:border-gold/40 hover:shadow-xl transition-all duration-300 rounded-2xl flex flex-col group"
            >
              {/* Quote Icon */}
              <div className="flex items-start justify-between mb-4">
                <Quote size={24} className="text-gold shrink-0" />
                {review.isVerifiedPurchase && (
                  <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-success bg-success/10 px-2 py-0.5 rounded-full">
                    <CheckCircle size={8} />
                    Verified
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < review.rating
                        ? "fill-gold text-gold"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-5 flex-1">
                "{review.comment}"
              </p>

              {/* Product Reference */}
              {review.productName && review.productSlug && (
                <Link
                  href={`/product/${review.productSlug}`}
                  className="text-[10px] uppercase tracking-widest text-gold hover:text-gold-dark mb-4 line-clamp-1"
                >
                  {review.productName}
                </Link>
              )}

              {/* Customer */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                {review.productImage ? (
                  <img
                    src={review.productImage}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <span className="text-gold font-serif text-sm font-medium">
                      {review.name?.charAt(0) || "C"}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">
                    {review.name}
                  </p>
                  <p className="text-xs text-text-muted">{review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 text-xs uppercase tracking-widest font-medium rounded-full"
          >
            Shop Our Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
