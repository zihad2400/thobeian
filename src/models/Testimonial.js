import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, default: "Dhaka" },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    comment: { type: String, required: true, trim: true },
    avatar: { type: String, default: "" },
    productImage: { type: String, default: "" },
    productName: { type: String, default: "" },
    isFeatured: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    source: {
      type: String,
      enum: ["seed", "customer", "admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

TestimonialSchema.index({ isActive: 1, isFeatured: 1, sortOrder: 1 });

export default
  mongoose.models.Testimonial ||
  mongoose.model("Testimonial", TestimonialSchema);
