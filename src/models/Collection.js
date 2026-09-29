import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    image: String,
    bannerImage: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date,
    seo: {
      title: String,
      description: String,
    },
  },
  { timestamps: true }
);

CollectionSchema.index({ slug: 1 });

export default
  mongoose.models.Collection ||
  mongoose.model("Collection", CollectionSchema);