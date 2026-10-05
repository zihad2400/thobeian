"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Star,
  Quote,
  Loader2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarDays,
  Sparkles,
} from "lucide-react";

export default function CustomerReviews() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(3);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await axios.get("/api/testimonials?limit=50");
      setTestimonials(data.data.testimonials || []);
    } catch (error) {
      console.error("Failed to load testimonials:", error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth < 768) {
        setCardsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerSlide(2);
      } else {
        setCardsPerSlide(3);
      }
    };

    updateCardsPerSlide();
    window.addEventListener("resize", updateCardsPerSlide);

    return () => window.removeEventListener("resize", updateCardsPerSlide);
  }, []);

  const totalPages = Math.ceil(testimonials.length / cardsPerSlide);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(0);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalPages]);

  const goToNext = () => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrev = () => {
    if (totalPages <= 1) return;

    setCurrentPage(
      (prev) => (prev - 1 + totalPages) % totalPages
    );
  };

  const formatReviewDate = (date) => {
    if (!date) return "Recent review";

    try {
      return new Date(date).toLocaleDateString("en-BD", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recent review";
    }
  };

  if (loading) {
    return (
      <section className="section-padding bg-background-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
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
    <section className="section-padding bg-background-luxury relative overflow-hidden">

      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[220px] bg-gold/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-12 md:mb-14">

          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles size={13} className="text-gold" />

            <p className="heading-sub mb-0">
              Client Stories
            </p>

            <Sparkles size={13} className="text-gold" />
          </div>

          <h2 className="heading-section">
            Loved by Our Customers
          </h2>

          <p className="max-w-xl mx-auto mt-4 text-sm md:text-base text-text-secondary leading-relaxed">
            Discover what our customers say about their Thobeian
            experience, quality and timeless style.
          </p>

          <div className="divider-gold mt-6" />
        </div>

        {/* Carousel */}
        <div className="relative">

          {/* Previous */}
          {totalPages > 1 && (
            <button
              onClick={goToPrev}
              aria-label="Previous testimonials"
              className="absolute -left-2 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/95 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center text-charcoal hover:border-gold hover:text-gold hover:shadow-xl transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Viewport */}
          <div className="overflow-hidden px-1 py-2">

            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentPage * 100}%)`,
              }}
            >

              {Array.from({
                length: Math.ceil(testimonials.length / cardsPerSlide),
              }).map((_, pageIndex) => {

                const pageReviews = testimonials.slice(
                  pageIndex * cardsPerSlide,
                  pageIndex * cardsPerSlide + cardsPerSlide
                );

                return (
                  <div
                    key={pageIndex}
                    className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
                  >

                    {pageReviews.map((review) => (

                      <article
                        key={review._id}
                        className="group relative bg-white border border-border rounded-2xl overflow-hidden hover:border-gold/40 hover:shadow-[0_18px_45px_rgba(31,31,31,0.10)] transition-all duration-500"
                      >

                        {/* Gold Top Accent */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="p-5 sm:p-6">

                          {/* Customer Header */}
                          <div className="flex items-center justify-between gap-3 mb-5">

                            <div className="flex items-center gap-3 min-w-0">

                              <div className="relative shrink-0">

                                {review.avatar ? (
                                  <img
                                    src={review.avatar}
                                    alt={review.name || "Customer"}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white ring-1 ring-gold/30 shadow-sm"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center shadow-sm">
                                    <span className="text-gold font-serif text-lg font-semibold">
                                      {review.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "C"}
                                    </span>
                                  </div>
                                )}

                                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-white flex items-center justify-center">
                                  <span className="w-2 h-2 rounded-full bg-green-500" />
                                </span>

                              </div>

                              <div className="min-w-0">

                                <div className="flex items-center gap-1.5">

                                  <p className="text-sm font-semibold text-charcoal truncate">
                                    {review.name || "Verified Customer"}
                                  </p>

                                  {review.isVerifiedPurchase && (
                                    <CheckCircle
                                      size={13}
                                      className="text-gold shrink-0"
                                      fill="currentColor"
                                      strokeWidth={1.5}
                                    />
                                  )}

                                </div>

                                <div className="flex items-center gap-1 mt-0.5 text-[11px] text-text-muted">

                                  <MapPin size={10} />

                                  <span className="truncate">
                                    {review.city || "Bangladesh"}
                                  </span>

                                </div>

                              </div>

                            </div>

                            {/* Quote */}
                            <div className="w-9 h-9 rounded-full bg-gold/8 flex items-center justify-center shrink-0">
                              <Quote
                                size={17}
                                className="text-gold"
                              />
                            </div>

                          </div>

                          {/* Rating */}
                          <div className="flex items-center justify-between mb-4">

                            <div className="flex items-center gap-1">

                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < (review.rating || 5)
                                      ? "fill-gold text-gold"
                                      : "text-gray-300"
                                  }
                                />
                              ))}

                              <span className="ml-1.5 text-[11px] font-medium text-charcoal">
                                {review.rating || 5}.0
                              </span>

                            </div>

                            {review.isVerifiedPurchase && (
                              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full">
                                <CheckCircle size={9} />
                                Verified Purchase
                              </span>
                            )}

                          </div>

                          {/* Review */}
                          <div className="relative min-h-[120px] mb-5">

                            <span className="absolute -top-3 -left-1 text-4xl font-serif text-gold/10 select-none">
                              “
                            </span>

                            <p className="relative text-[13px] sm:text-sm text-text-secondary leading-7 line-clamp-5">
                              {review.comment}
                            </p>

                          </div>

                          {/* Product */}
                          {review.productName && (
                            <div className="mb-5 rounded-xl border border-border bg-background-luxury/60 p-2.5 flex items-center gap-3">

                              <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-border shrink-0">

                                {review.productImage ? (
                                  <img
                                    src={review.productImage}
                                    alt={review.productName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gold/5">
                                    <Sparkles
                                      size={17}
                                      className="text-gold/60"
                                    />
                                  </div>
                                )}

                              </div>

                              <div className="min-w-0 flex-1">

                                <p className="text-[9px] uppercase tracking-[0.18em] text-gold mb-1">
                                  Reviewed Product
                                </p>

                                {review.productSlug ? (
                                  <Link
                                    href={`/product/${review.productSlug}`}
                                    className="text-xs font-medium text-charcoal hover:text-gold transition-colors line-clamp-1"
                                  >
                                    {review.productName}
                                  </Link>
                                ) : (
                                  <p className="text-xs font-medium text-charcoal line-clamp-1">
                                    {review.productName}
                                  </p>
                                )}

                              </div>

                              <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center shrink-0">
                                <ChevronRight
                                  size={13}
                                  className="text-text-muted"
                                />
                              </div>

                            </div>
                          )}

                          {/* Bottom Meta */}
                          <div className="pt-4 border-t border-border flex items-center justify-between gap-3">

                            <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                              <CalendarDays size={11} />

                              <span>
                                {formatReviewDate(review.createdAt)}
                              </span>
                            </div>

                            <span className="text-[9px] uppercase tracking-[0.16em] text-gold font-medium">
                              Thobeian
                            </span>

                          </div>

                        </div>

                      </article>

                    ))}

                  </div>
                );
              })}

            </div>

          </div>

          {/* Next */}
          {totalPages > 1 && (
            <button
              onClick={goToNext}
              aria-label="Next testimonials"
              className="absolute -right-2 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/95 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center text-charcoal hover:border-gold hover:text-gold hover:shadow-xl transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          )}

        </div>

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                aria-label={`Go to testimonial group ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? "w-8 bg-gold"
                    : "w-1.5 bg-border hover:bg-gold/50"
                }`}
              />
            ))}

          </div>
        )}

        {/* Trust Line */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[10px] uppercase tracking-[0.16em] text-text-muted">

          <div className="flex items-center gap-1.5">
            <CheckCircle size={12} className="text-gold" />
            Quality Focused
          </div>

          <span className="hidden sm:block text-border">•</span>

          <div className="flex items-center gap-1.5">
            <Star
              size={12}
              className="text-gold"
              fill="currentColor"
            />
            Premium Collection
          </div>

          <span className="hidden sm:block text-border">•</span>

          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-gold" />
            Sunnah in Style
          </div>

        </div>

        {/* Shop Button */}
        <div className="mt-10 text-center">

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 text-xs uppercase tracking-widest font-medium rounded-full"
          >
            Shop Our Collection
            <ChevronRight size={15} />
          </Link>

        </div>

      </div>
    </section>
  );
}
