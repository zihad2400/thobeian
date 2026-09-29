import mongoose from "mongoose";

const NewsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    source: {
      type: String,
      default: "footer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    unsubscribedAt: Date,
  },
  { timestamps: true }
);

NewsletterSchema.index({ email: 1 });
NewsletterSchema.index({ isActive: 1 });

export default
  mongoose.models.Newsletter ||
  mongoose.model("Newsletter", NewsletterSchema);
