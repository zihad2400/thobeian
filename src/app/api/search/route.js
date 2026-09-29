import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Collection from "@/models/Collection";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();
    const limit = parseInt(searchParams.get("limit") || "8");
    const full = searchParams.get("full") === "true";

    if (!query) {
      return successResponse({
        products: [],
        categories: [],
        collections: [],
        total: 0,
      });
    }

    const regex = { $regex: query, $options: "i" };

    // Search products
    const products = await Product.find({
      status: "published",
      $or: [
        { name: regex },
        { description: regex },
        { tags: regex },
        { shortDescription: regex },
      ],
    })
      .limit(limit)
      .select("name slug price compareAtPrice images totalStock rating reviewCount")
      .lean();

    // Search categories
    const categories = await Category.find({
      isActive: true,
      name: regex,
    })
      .limit(5)
      .select("name slug image type")
      .lean();

    // Search collections
    const collections = await Collection.find({
      isActive: true,
      name: regex,
    })
      .limit(5)
      .select("name slug image")
      .lean();

    // Full search (search page) হলে total count
    let total = products.length;
    if (full) {
      total = await Product.countDocuments({
        status: "published",
        $or: [
          { name: regex },
          { description: regex },
          { tags: regex },
        ],
      });
    }

    return successResponse({
      products,
      categories,
      collections,
      total,
      query,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return errorResponse(error.message, 500);
  }
}
