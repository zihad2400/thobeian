import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { createSlug } from "@/lib/slugify";

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const { id } = await params;
    const body = await req.json();

    const existingCategory = await Category.findById(id);

    if (!existingCategory) {
      return errorResponse("Category not found", 404);
    }

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : existingCategory.name;

    if (!name) {
      return errorResponse("Category name is required", 400);
    }

    let slug =
      typeof body.slug === "string" && body.slug.trim()
        ? createSlug(body.slug)
        : createSlug(name);

    const duplicate = await Category.findOne({
      slug,
      _id: { $ne: id },
    });

    if (duplicate) {
      return errorResponse("Category with this slug already exists", 409);
    }

    if (body.parent) {
      if (String(body.parent) === String(id)) {
        return errorResponse(
          "A category cannot be its own parent",
          400
        );
      }

      const parentExists = await Category.exists({
        _id: body.parent,
      });

      if (!parentExists) {
        return errorResponse("Parent category not found", 400);
      }
    }

    const update = {
      ...body,
      name,
      slug,
      isActive: body.isActive !== false,
      parent: body.parent || null,
      description:
        typeof body.description === "string"
          ? body.description.trim()
          : existingCategory.description || "",
      sortOrder: Number(body.sortOrder || 0),
      showInMenu: body.showInMenu !== false,
      showInMegaMenu: Boolean(body.showInMegaMenu),
    };

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: update },
      {
        new: true,
        runValidators: true,
      }
    );

    return successResponse({ category }, "Category updated");
  } catch (error) {
    console.error("Category PATCH error:", error);
    return errorResponse(error.message, 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const { id } = await params;

    const category = await Category.findById(id);

    if (!category) {
      return errorResponse("Category not found", 404);
    }

    const childCount = await Category.countDocuments({
      parent: id,
    });

    if (childCount > 0) {
      return errorResponse(
        "Cannot delete a category with subcategories. Remove or reassign its subcategories first.",
        409
      );
    }

    const productCount = await Product.countDocuments({
      $or: [
        { category: id },
        { subcategory: id },
      ],
    });

    if (productCount > 0) {
      return errorResponse(
        "Cannot delete a category assigned to products. Reassign those products first.",
        409
      );
    }

    await Category.findByIdAndDelete(id);

    return successResponse(null, "Category deleted");
  } catch (error) {
    console.error("Category DELETE error:", error);
    return errorResponse(error.message, 500);
  }
}
