import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema(
  {
    brandName: { type: String, default: "THOBEIAN" },
    tagline: { type: String, default: "Sunnah in Style" },
    logo: String,
    favicon: String,

    contact: {
      email: { type: String, default: "hello@thobeian.com" },
      phone: { type: String, default: "+880 1XXX-XXXXXX" },
      whatsapp: { type: String, default: "+8801XXXXXXXXX" },
      address: { type: String, default: "Dhaka, Bangladesh" },
    },

    social: {
      facebook: { type: String, default: "https://facebook.com/thobeian" },
      instagram: { type: String, default: "https://instagram.com/thobeian" },
      youtube: { type: String, default: "https://youtube.com/@thobeian" },
      tiktok: { type: String, default: "https://tiktok.com/@thobeian" },
      twitter: { type: String, default: "https://twitter.com/thobeian" },
      linkedin: { type: String, default: "https://linkedin.com/company/thobeian" },
    },

    currency: { type: String, default: "BDT" },
    currencySymbol: { type: String, default: "৳" },
    taxPercentage: { type: Number, default: 0 },

    shipping: {
      insideDhaka: { type: Number, default: 80 },
      outsideDhaka: { type: Number, default: 130 },
      express: { type: Number, default: 200 },
      freeShippingAbove: { type: Number, default: 5000 },
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
