import mongoose from "mongoose";

const FabricSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    origin: String,
    weight: String,
    texture: String,
    season: [String],
    breathability: String,
    images: [String],
    priceModifier: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FabricSchema.index({ slug: 1 });

export default mongoose.models.Fabric || mongoose.model("Fabric", FabricSchema);