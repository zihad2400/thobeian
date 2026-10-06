import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: function () {
      return !this.isCustom;
    },
  },

  variantId: String,

  name: {
    type: String,
    trim: true,
  },

  image: {
    type: String,
    default: "",
  },

  size: {
    type: String,
    default: "",
  },

  color: {
    type: String,
    default: "",
  },

  fabric: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },

  isCustom: {
    type: Boolean,
    default: false,
  },

  customDesignId: {
    type: String,
    default: "",
  },

  customConfig: {
    type: mongoose.Schema.Types.Mixed,
  },
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