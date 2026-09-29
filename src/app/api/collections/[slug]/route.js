import connectDB from "@/lib/mongodb";
import Collection from "@/models/Collection";
import Product from "@/models/Product";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params;

    const collection = await Collection.findOne({ slug, isActive: true }).lean();
    if (!collection) return errorResponse("Collection not found", 404);

    const products = await Product.find({
      collections: collection._id,
      status: "published",
    })
      .limit(20)
      .lean();

    return successResponse({ collection, products });
  } catch (error) {
    console.error("Collection detail error:", error);
    return errorResponse(error.message, 500);
  }
}
