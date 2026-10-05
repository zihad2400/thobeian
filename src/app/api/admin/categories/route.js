import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { createSlug } from "@/lib/slugify";

const ADMIN_ROLES = ["admin", "superadmin"];

export async function GET() {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return errorResponse("Admin access required", 403);
    }

    const categories = await Category.find({})
      .populate("parent", "name slug")
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return successResponse({ categories });
  } catch (error) {
    console.error("Categories GET error:", error);
    return errorResponse("Failed to load categories", 500);
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return errorResponse("Admin access required", 403);
    }

    const body = await req.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    if (!name) {
      return errorResponse("Category name is required", 400);
    }

    const slugInput =
      typeof body.slug === "string"
        ? body.slug.trim()
        : "";

    const slug = createSlug(slugInput || name);

    if (!slug) {
      return errorResponse("A valid category slug is required", 400);
    }

    const existing = await Category.findOne({ slug }).lean();

    if (existing) {
      return errorResponse(
        "Category with this slug already exists",
        409
      );
    }

    let parent = null;

    if (body.parent) {
      parent = await Category.findById(body.parent).lean();

      if (!parent) {
        return errorResponse("Parent category not found", 400);
      }
    }

    const category = await Category.create({
      name,
      slug,
      description:
        typeof body.description === "string"
          ? body.description.trim()
          : "",
      image:
        typeof body.image === "string" && body.image.trim()
          ? body.image.trim()
          : "",
      parent: parent?._id || null,
      type: body.type || "other",
      sortOrder: Number(body.sortOrder) || 0,
      isActive: body.isActive !== false,
      showInMenu: body.showInMenu !== false,
      showInMegaMenu: Boolean(body.showInMegaMenu),
      seo: {
        title:
          typeof body.seo?.title === "string"
            ? body.seo.title.trim()
            : "",
        description:
          typeof body.seo?.description === "string"
            ? body.seo.description.trim()
            : "",
        keywords: Array.isArray(body.seo?.keywords)
          ? body.seo.keywords
              .map((keyword) => String(keyword).trim())
              .filter(Boolean)
          : [],
      },
    });

    return successResponse(
      { category },
      "Category created",
      201
    );
  } catch (error) {
    console.error("Categories POST error:", error);

    if (error?.code === 11000) {
      return errorResponse(
        "Category with this slug already exists",
        409
      );
    }

    return errorResponse(
      error?.message || "Failed to create category",
      500
    );
  }
}
