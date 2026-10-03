import connectDB from "@/lib/mongodb";

// ⚠️ IMPORTANT: Import all models used in populate
import Product from "@/models/Product";
import Category from "@/models/Category";
import Collection from "@/models/Collection";
import Fabric from "@/models/Fabric";
import ProductReview from "@/models/ProductReview";

import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params;

    const product = await Product.findOne({ slug, status: "published" })
      .populate("category", "name slug")
      .populate("collections", "name slug image")
      .populate("fabric", "name slug")
      .lean();

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    // 🔄 AUTO-CALCULATE RATING from approved reviews
    const reviews = await ProductReview.find({
      product: product._id,
      status: "approved",
    }).lean();

    if (reviews.length > 0) {
      const avgRating =
        Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10
        ) / 10;

      product.rating = avgRating;
      product.reviewCount = reviews.length;

      // Update DB silently
      await Product.findByIdAndUpdate(product._id, {
        rating: avgRating,
        reviewCount: reviews.length,
      });
    }

    // Related products
    const related = await Product.find({
      category: product.category?._id,
      _id: { $ne: product._id },
      status: "published",
    })
      .limit(4)
      .lean();

    return successResponse({ product, related });
  } catch (error) {
    console.error("Product detail API error:", error);
    return errorResponse(error.message, 500);
  }
}
