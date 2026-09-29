import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params;

    const category = await Category.findOne({ slug, isActive: true })
      .populate("parent", "name slug")
      .lean();

    if (!category) return errorResponse("Category not found", 404);

    // Get products in this category
    const products = await Product.find({
      $or: [
        { category: category._id },
        { subcategory: category._id },
      ],
      status: "published",
    })
      .limit(24)
      .lean();

    // Get subcategories if any
    const subcategories = await Category.find({
      parent: category._id,
      isActive: true,
    })
      .sort({ sortOrder: 1 })
      .lean();

    return successResponse({ category, products, subcategories });
  } catch (error) {
    console.error("Category detail error:", error);
    return errorResponse(error.message, 500);
  }
}
