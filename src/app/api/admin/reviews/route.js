import connectDB from "@/lib/mongodb";
import ProductReview from "@/models/ProductReview";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";

    const filter = {};
    if (status !== "all") filter.status = status;

    const reviews = await ProductReview.find(filter)
      .populate("user", "name email")
      .populate("product", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    return successResponse({ reviews });
  } catch (error) {
    console.error("Admin reviews GET error:", error);
    return errorResponse(error.message, 500);
  }
}
