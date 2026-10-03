import connectDB from "@/lib/mongodb";
import ProductReview from "@/models/ProductReview";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { updateProductRating } from "@/lib/updateProductRating";

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

    // 🔄 AUTO UPDATE PRODUCT RATING
    const ratingResult = await updateProductRating(review.product);

    return successResponse(
      {
        review,
        productRating: ratingResult,
      },
      `Review ${status} — Product rating updated to ${ratingResult.rating}★`
    );
  } catch (error) {
    console.error("Review update error:", error);
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
    const review = await ProductReview.findById(id);
    if (!review) return errorResponse("Review not found", 404);

    const productId = review.product;
    await ProductReview.findByIdAndDelete(id);

    // 🔄 AUTO UPDATE PRODUCT RATING AFTER DELETE
    await updateProductRating(productId);

    return successResponse(null, "Review deleted — rating updated");
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
