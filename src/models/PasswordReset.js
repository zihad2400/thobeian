import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 3600, // Auto delete after 1 hour
    },
    usedAt: Date,
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

PasswordResetSchema.index({ user: 1 });
PasswordResetSchema.index({ token: 1 });

export default
  mongoose.models.PasswordReset ||
  mongoose.model("PasswordReset", PasswordResetSchema);
