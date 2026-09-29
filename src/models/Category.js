import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    image: String,
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    type: {
      type: String,
      enum: ["thobe", "jubba", "panjabi", "fabric", "collection", "other"],
      default: "other",
    },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    showInMenu: { type: Boolean, default: true },
    showInMegaMenu: { type: Boolean, default: false },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

CategorySchema.index({ parent: 1 });
CategorySchema.index({ type: 1 });

export default
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
