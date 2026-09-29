import connectDB from "@/lib/mongodb";
import ProductReview from "@/models/ProductReview";
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
    const { status, adminNote } = body;

    if (!["approved", "rejected", "hidden", "pending"].includes(status)) {
      return errorResponse("Invalid status", 400);
    }

    const review = await ProductReview.findByIdAndUpdate(
      id,
      { status, adminNote },
      { new: true }
    );

    if (!review) return errorResponse("Review not found", 404);

    return successResponse({ review }, `Review ${status}`);
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
    await ProductReview.findByIdAndDelete(id);
    return successResponse(null, "Review deleted");
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
