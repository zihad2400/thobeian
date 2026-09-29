import connectDB from "@/lib/mongodb";
import Collection from "@/models/Collection";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    await connectDB();
    const collections = await Collection.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();
    return successResponse({ collections });
  } catch (error) {
    console.error("Collections GET error:", error);
    return errorResponse(error.message, 500);
  }
}
