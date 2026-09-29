"use client";

import { Star, CheckCircle, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ReviewsList({ reviews, summary }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-background-luxury border border-border">
        <p className="text-sm text-text-secondary mb-1">No reviews yet</p>
        <p className="text-xs text-text-muted">
          Be the first to review this product
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-background-luxury border border-border p-6 grid md:grid-cols-2 gap-6">
        {/* Average */}
        <div className="text-center md:text-left md:border-r md:border-border md:pr-6">
          <p className="font-serif text-5xl text-charcoal mb-2">
            {summary.average}
          </p>
          <div className="flex items-center gap-1 justify-center md:justify-start mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.round(summary.average)
                    ? "fill-gold text-gold"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <p className="text-xs text-text-muted">
            Based on {summary.total} review{summary.total !== 1 && "s"}
          </p>
        </div>

        {/* Distribution */}
        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.distribution[star] || 0;
            const percent =
              summary.total > 0 ? (count / summary.total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="text-text-muted w-8">{star} ★</span>
                <div className="flex-1 bg-white border border-border h-2 overflow-hidden">
                  <div
                    className="bg-gold h-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-charcoal w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white border border-border p-5"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                {review.user?.avatar ? (
                  <img
                    src={review.user.avatar}
                    alt={review.user?.name || "User"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-gold" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-charcoal">
                        {review.user?.name || "Anonymous"}
                      </p>
                      {review.isVerifiedPurchase && (
                        <span className="text-[10px] text-success flex items-center gap-1 bg-success/10 px-2 py-0.5">
                          <CheckCircle size={10} /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < review.rating
                            ? "fill-gold text-gold"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>

                {review.title && (
                  <h4 className="font-serif text-sm text-charcoal mb-1">
                    {review.title}
                  </h4>
                )}

                <p className="text-sm text-text-secondary leading-relaxed">
                  {review.comment}
                </p>

                {/* Images */}
                {review.images?.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Review ${i + 1}`}
                        className="w-16 h-16 object-cover border border-border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
