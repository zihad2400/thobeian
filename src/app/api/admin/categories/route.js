import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { createSlug } from "@/lib/slugify";

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const categories = await Category.find({})
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return successResponse({ categories });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const body = await req.json();
    if (!body.name) return errorResponse("Name required", 400);

    const slug = body.slug || createSlug(body.name);

    const existing = await Category.findOne({ slug });
    if (existing) {
      return errorResponse("Category with this slug exists", 409);
    }

    const category = await Category.create({
      ...body,
      slug,
      isActive: body.isActive !== false,
    });

    return successResponse({ category }, "Category created", 201);
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
