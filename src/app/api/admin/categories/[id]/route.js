import connectDB from "@/lib/mongodb";
import Category from "@/models/Category";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const { id } = await params;
    const body = await req.json();

    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    if (!category) return errorResponse("Not found", 404);

    return successResponse({ category }, "Category updated");
  } catch (error) {
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
    await Category.findByIdAndDelete(id);
    return successResponse(null, "Category deleted");
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
