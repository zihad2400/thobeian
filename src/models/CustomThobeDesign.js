import mongoose from "mongoose";

const CustomThobeDesignSchema = new mongoose.Schema(
  {
    designId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionId: String,
    config: { type: mongoose.Schema.Types.Mixed, required: true },
    totalPrice: { type: Number, required: true },
    previewImage: String,
    name: { type: String, default: "My Custom Thobe" },
    isSaved: { type: Boolean, default: true },
    isOrdered: { type: Boolean, default: false },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  },
  { timestamps: true }
);

CustomThobeDesignSchema.index({ user: 1 });
CustomThobeDesignSchema.index({ sessionId: 1 });

export default
  mongoose.models.CustomThobeDesign ||
  mongoose.model("CustomThobeDesign", CustomThobeDesignSchema);
