"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Star, Quote, Loader2 } from "lucide-react";

export default function CustomerReviews() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await axios.get("/api/testimonials?featured=true&limit=8");
      setTestimonials(data.data.testimonials || []);
    } catch (error) {
      console.error("Failed to load testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section-padding bg-background-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="heading-sub">Testimonials</p>
            <h2 className="heading-section">Loved by Our Customers</h2>
            <div className="divider-gold mt-6" />
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-gold" />
          </div>
        </div>
      </section>
    );
  }

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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((review) => (
            <div
              key={review._id}
              className="bg-white p-6 border border-border hover:border-gold/40 hover:shadow-card transition-all duration-300 flex flex-col"
            >
              <Quote size={24} className="text-gold mb-4 shrink-0" />

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

              <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-5 flex-1">
                "{review.comment}"
              </p>

              {/* Customer */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                {review.productImage ? (
                  <img
                    src={review.productImage}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <span className="text-gold font-serif text-sm font-medium">
                      {review.name.charAt(0)}
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
      </div>
    </section>
  );
}
