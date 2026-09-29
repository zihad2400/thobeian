import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = await params;

    const product = await Product.findOne({ slug, status: "published" })
      .populate("category", "name slug")
      .populate("collections", "name slug")
      .populate("fabric", "name slug")
      .lean();

    if (!product) {
      return errorResponse("Product not found", 404);
    }

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