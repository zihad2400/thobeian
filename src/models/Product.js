import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  size: String,
  color: String,
  fabric: String,
  sku: String,
  price: Number,
  compareAtPrice: Number,
  stock: { type: Number, default: 0 },
  image: String,
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sku: { type: String, sparse: true },
    description: { type: String, default: "" },
    shortDescription: String,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
    fabric: { type: mongoose.Schema.Types.ObjectId, ref: "Fabric" },

    images: [String],
    hoverImage: String,
    video: String,

    price: { type: Number, required: true },
    compareAtPrice: Number,
    costPrice: Number,

    variants: [VariantSchema],

    totalStock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },

    colors: [String],
    sizes: [String],
    tags: [String],

    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: true },

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

// Single index definition (no duplicates)
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ status: 1 });

export default
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
