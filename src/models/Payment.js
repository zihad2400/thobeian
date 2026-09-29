import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    transactionId: { type: String, unique: true, required: true },
    provider: {
      type: String,
      enum: ["cod", "bkash", "nagad", "sslcommerz", "card"],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    status: {
      type: String,
      enum: ["initiated", "pending", "success", "failed", "cancelled", "refunded"],
      default: "initiated",
    },
    providerResponse: mongoose.Schema.Types.Mixed,
    verifiedAt: Date,
    paidAt: Date,
  },
  { timestamps: true }
);

PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ order: 1 });

export default
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);