import connectDB from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import ProductReview from "@/models/ProductReview";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req) {
  try {
    await connectDB();

    // ===== 1. Fetch REAL customer reviews (approved) =====
    const realReviews = await ProductReview.find({
      status: "approved",
      comment: { $exists: true, $ne: "" },
    })
      .populate("user", "name city avatar")
      .populate("product", "name slug images")
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const reviewTestimonials = realReviews
      .filter((r) => r.user && r.comment)
      .map((r) => ({
        _id: r._id,
        name: r.user?.name || "Verified Customer",
        city: r.user?.city || "Bangladesh",
        rating: r.rating,
        comment: r.comment,
        productImage: r.product?.images?.[0] || "",
        productName: r.product?.name || "",
        productSlug: r.product?.slug || "",
        avatar: r.user?.avatar || "",
        isVerifiedPurchase: r.isVerifiedPurchase,
        source: "customer",
        createdAt: r.createdAt,
      }));

    // ===== 2. Fetch Admin testimonials =====
    const adminTestimonials = await Testimonial.find({
      isActive: true,
      isFeatured: true,
    })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(8)
      .lean();

    // ===== 3. Combine =====
    const allTestimonials = [
      ...reviewTestimonials,
      ...adminTestimonials.map((t) => ({ ...t, source: "admin" })),
    ].slice(0, 8);

    // ⚠️ NO FALLBACK — if empty, return empty
    return successResponse({ testimonials: allTestimonials });
  } catch (error) {
    console.error("Testimonials GET error:", error);
    return errorResponse(error.message, 500);
  }
}
