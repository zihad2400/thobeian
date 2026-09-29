import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: String,
  name: String,
  image: String,
  size: String,
  color: String,
  fabric: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  customConfig: { type: mongoose.Schema.Types.Mixed },
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },
    sessionId: { type: String, unique: true, sparse: true },
    items: [CartItemSchema],
    couponCode: String,
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);