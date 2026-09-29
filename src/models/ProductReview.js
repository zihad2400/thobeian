import mongoose from "mongoose";

const ProductReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: "" },
    comment: { type: String, required: true },
    images: [String],
    isVerifiedPurchase: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "hidden"],
      default: "pending",
    },
    adminNote: String,
    helpfulCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductReviewSchema.index({ product: 1, status: 1 });
ProductReviewSchema.index({ user: 1 });
ProductReviewSchema.index({ createdAt: -1 });

export default
  mongoose.models.ProductReview ||
  mongoose.model("ProductReview", ProductReviewSchema);
