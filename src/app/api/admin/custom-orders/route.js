import connectDB from "@/lib/mongodb";
import CustomThobeDesign from "@/models/CustomThobeDesign";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const designs = await CustomThobeDesign.find({})
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    return successResponse({ designs });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
