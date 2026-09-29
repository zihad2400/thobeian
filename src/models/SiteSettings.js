import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema(
  {
    brandName: { type: String, default: "THOBEIAN" },
    tagline: { type: String, default: "Sunnah in Style" },
    logo: String,
    favicon: String,

    contact: {
      email: String,
      phone: String,
      whatsapp: String,
      address: String,
    },

    social: {
      facebook: String,
      instagram: String,
      youtube: String,
      tiktok: String,
      twitter: String,
    },

    currency: { type: String, default: "BDT" },
    currencySymbol: { type: String, default: "৳" },
    taxPercentage: { type: Number, default: 0 },

    shipping: {
      insideDhaka: { type: Number, default: 80 },
      outsideDhaka: { type: Number, default: 130 },
      express: { type: Number, default: 200 },
      freeShippingAbove: { type: Number, default: 0 },
      codFee: { type: Number, default: 0 },
    },

    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String,
    },
  },
  { timestamps: true }
);

export default
  mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", SiteSettingsSchema);