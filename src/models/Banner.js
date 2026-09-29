import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    description: String,
    image: String,
    mobileImage: String,
    video: String,
    buttonText: String,
    buttonUrl: String,
    secondaryButtonText: String,
    secondaryButtonUrl: String,
    position: {
      type: String,
      enum: ["hero", "homepage_middle", "homepage_bottom", "category", "custom"],
      default: "hero",
    },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);