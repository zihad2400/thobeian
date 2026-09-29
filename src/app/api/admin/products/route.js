import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { createSlug } from "@/lib/slugify";

// ===== GET: List all products =====
export async function GET(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return successResponse({ products });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

// ===== POST: Create product =====
export async function POST(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const body = await req.json();

    if (!body.name || !body.price) {
      return errorResponse("Name and price required", 400);
    }

    const slug = createSlug(body.name);

    // Check duplicate slug
    const existing = await Product.findOne({ slug });
    if (existing) {
      return errorResponse("Product with this name exists", 409);
    }

    const product = await Product.create({
      ...body,
      slug,
      totalStock: body.totalStock || 0,
      status: body.status || "draft",
    });

    return successResponse({ product }, "Product created", 201);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
