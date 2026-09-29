import connectDB from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const subscribers = await Newsletter.find({})
      .sort({ createdAt: -1 })
      .lean();

    return successResponse({ subscribers });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
