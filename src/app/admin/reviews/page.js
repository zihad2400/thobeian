"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Star,
  Check,
  X,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  User,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const TABS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "hidden", label: "Hidden" },
  { id: "all", label: "All" },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [tab]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/reviews?status=${tab}`);
      setReviews(data.data.reviews || []);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403) {
        toast.error("Admin access required");
      } else {
        toast.error("Failed to load reviews");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setProcessing(id);
      await axios.patch(`/api/admin/reviews/${id}`, { status });
      toast.success(`Review ${status}`);
      fetchReviews();
    } catch (error) {
      toast.error("Failed to update");
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review permanently?")) return;
    try {
      setProcessing(id);
      await axios.delete(`/api/admin/reviews/${id}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-gold mb-1">
          Manage
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal">
          Product Reviews
        </h1>
        <p className="text-sm text-text-muted mt-2">
          Approve, reject or delete customer reviews
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-border p-1.5 mb-6 flex items-center gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
              tab === t.id
                ? "bg-charcoal text-white"
                : "text-text-secondary hover:text-charcoal"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Reviews */}
      {loading ? (
        <div className="bg-white border border-border p-12 text-center">
          <Loader2 size={32} className="animate-spin text-gold mx-auto" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-border p-12 text-center">
          <Star size={48} className="text-border mx-auto mb-4" />
          <p className="text-sm text-text-muted">No {tab} reviews</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white border border-border p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <User size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {review.user?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-text-muted">
                      {review.user?.email || "No email"}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] uppercase tracking-widest px-2.5 py-1 border ${
                    review.status === "pending"
                      ? "bg-warning/10 text-warning border-warning/30"
                      : review.status === "approved"
                      ? "bg-success/10 text-success border-success/30"
                      : review.status === "rejected"
                      ? "bg-error/10 text-error border-error/30"
                      : "bg-border text-text-muted"
                  }`}
                >
                  {review.status}
                </span>
              </div>

              {/* Product */}
              <div className="mb-3 p-3 bg-background-luxury border border-border">
                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-0.5">
                  Product
                </p>
                <p className="text-xs text-charcoal font-medium">
                  {review.product?.name || "Deleted Product"}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < review.rating ? "fill-gold text-gold" : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-xs text-text-muted ml-2">
                  {review.rating}/5
                </span>
                {review.isVerifiedPurchase && (
                  <span className="text-[10px] uppercase tracking-widest text-success bg-success/10 px-2 py-0.5 ml-2">
                    Verified
                  </span>
                )}
              </div>

              {/* Title + Comment */}
              {review.title && (
                <h3 className="font-serif text-base text-charcoal mb-1">
                  {review.title}
                </h3>
              )}
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {review.comment}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-border flex-wrap">
                {review.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(review._id, "approved")}
                      disabled={processing === review._id}
                      className="text-xs bg-success text-white px-4 py-2 flex items-center gap-1.5 hover:bg-success/90 disabled:opacity-50"
                    >
                      {processing === review._id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Check size={12} />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(review._id, "rejected")}
                      disabled={processing === review._id}
                      className="text-xs bg-error text-white px-4 py-2 flex items-center gap-1.5 hover:bg-error/90 disabled:opacity-50"
                    >
                      <X size={12} /> Reject
                    </button>
                  </>
                )}

                {review.status === "approved" && (
                  <button
                    onClick={() => updateStatus(review._id, "hidden")}
                    disabled={processing === review._id}
                    className="text-xs border border-border px-4 py-2 flex items-center gap-1.5 hover:border-gold disabled:opacity-50"
                  >
                    <EyeOff size={12} /> Hide
                  </button>
                )}

                {review.status === "rejected" && (
                  <button
                    onClick={() => updateStatus(review._id, "approved")}
                    disabled={processing === review._id}
                    className="text-xs bg-success text-white px-4 py-2 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Check size={12} /> Approve
                  </button>
                )}

                {review.status === "hidden" && (
                  <button
                    onClick={() => updateStatus(review._id, "approved")}
                    disabled={processing === review._id}
                    className="text-xs border border-border px-4 py-2 flex items-center gap-1.5 hover:border-gold disabled:opacity-50"
                  >
                    <Eye size={12} /> Show
                  </button>
                )}

                <button
                  onClick={() => handleDelete(review._id)}
                  disabled={processing === review._id}
                  className="text-xs text-error hover:text-error/80 px-4 py-2 flex items-center gap-1.5 ml-auto disabled:opacity-50"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
