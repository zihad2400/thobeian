"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Star, X, Loader2, Send } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function ReviewForm({ productSlug, onSuccess, onCancel }) {
  const { user } = useAuthStore();
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
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
      <div className="bg-background-luxury border border-border p-6 text-center">
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-border p-6 animate-slide-down"
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

      {/* Rating */}
      <div className="mb-5">
        <label className="text-xs uppercase tracking-widest text-text-muted mb-2 block">
          Your Rating *
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={
                  star <= (hoverRating || rating)
                    ? "fill-gold text-gold"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-charcoal font-medium">
              {["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1]}
            </span>
          )}
        </div>
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
          className="input-luxury"
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
          className="input-luxury resize-none"
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
          disabled={submitting}
          className="btn-primary text-xs py-2.5 px-6 flex items-center gap-2 disabled:opacity-50"
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
