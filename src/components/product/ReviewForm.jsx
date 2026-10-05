"use client";

import { useState } from "react";
import axios from "axios";
import toast from "@/lib/toast";
import { X, Loader2, Send } from "lucide-react";
import RatingStars from "@/components/ui/RatingStars";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function ReviewForm({ productSlug, onSuccess, onCancel }) {
  const { user } = useAuthStore();
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write your review");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await axios.post(
        `/api/products/${productSlug}/reviews`,
        { rating, title, comment }
      );
      toast.success(data.message);
      onSuccess?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-background-luxury border border-border p-6 text-center rounded-2xl">
        <p className="text-sm text-text-secondary mb-4">
          Please login to write a review
        </p>
        <button
          onClick={() => router.push("/login")}
          className="btn-primary text-xs py-2.5 px-5"
        >
          Login to Review
        </button>
      </div>
    );
  }

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-border p-6 animate-slide-down rounded-2xl"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-serif text-lg text-charcoal">Write a Review</h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-text-muted hover:text-error"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ===== DYNAMIC RATING STARS ===== */}
      <div className="mb-5">
        <label className="text-xs uppercase tracking-widest text-text-muted mb-3 block">
          Your Rating *
        </label>

        <RatingStars
          value={rating}
          onChange={setRating}
          size={32}
          showCount={false}
        />

        {/* Rating Label */}
        {rating > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                rating === 5
                  ? "bg-success/10 text-success"
                  : rating === 4
                  ? "bg-info/10 text-info"
                  : rating === 3
                  ? "bg-warning/10 text-warning"
                  : "bg-error/10 text-error"
              }`}
            >
              {ratingLabels[rating]} — {rating} out of 5 stars
            </div>
          </div>
        )}

        {/* Visual Progress Bars */}
        {rating > 0 && (
          <div className="mt-4 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 transition-all duration-300 rounded-full ${
                  n <= rating ? "bg-gold" : "bg-border"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Title */}
      <div className="mb-5">
        <label className="text-xs uppercase tracking-widest text-text-muted mb-2 block">
          Title (optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={100}
          className="input-luxury rounded-xl"
        />
      </div>

      {/* Comment */}
      <div className="mb-5">
        <label className="text-xs uppercase tracking-widest text-text-muted mb-2 block">
          Your Review *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your honest experience about this product..."
          rows={5}
          maxLength={1000}
          className="input-luxury resize-none rounded-xl"
          required
        />
        <p className="text-[10px] text-text-muted mt-1">
          {comment.length}/1000 characters
        </p>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting || !rating || !comment.trim()}
          className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <Send size={14} /> Submit Review
            </>
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline text-xs py-2.5 px-6"
          >
            Cancel
          </button>
        )}
      </div>

      <p className="text-[10px] text-text-muted mt-3">
        💡 Your review will be published after admin approval.
      </p>
    </form>
  );
}
