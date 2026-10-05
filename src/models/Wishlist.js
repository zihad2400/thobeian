import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },

    sessionId: {
      type: String,
      unique: true,
      sparse: true,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export default
  mongoose.models.Wishlist ||
  mongoose.model("Wishlist", WishlistSchema);
