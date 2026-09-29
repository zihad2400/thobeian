import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const parent = searchParams.get("parent");
    const type = searchParams.get("type");

    const filter = { isActive: true };
    if (type) filter.type = type;
    
    if (parent) {
      const parentCat = await Category.findOne({ slug: parent });
      if (parentCat) filter.parent = parentCat._id;
    } else {
      filter.parent = null;
    }

    const categories = await Category.find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return successResponse({ categories });
  } catch (error) {
    console.error("Categories GET error:", error);
    return errorResponse(error.message, 500);
  }
}
