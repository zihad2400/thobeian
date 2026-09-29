import connectDB from "@/lib/mongodb";
import ProductReview from "@/models/ProductReview";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const reviews = await ProductReview.find({ user: user._id })
      .populate("product", "name slug images")
      .sort({ createdAt: -1 })
      .lean();

    return successResponse({ reviews });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
