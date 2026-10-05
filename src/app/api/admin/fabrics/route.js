import connectDB from "@/lib/mongodb";
import Fabric from "@/models/Fabric";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const fabrics = await Fabric.find({ isActive: true })
      .select("_id name slug description origin weight texture season breathability images priceModifier isActive")
      .sort({ name: 1 })
      .lean();

    return successResponse({ fabrics });
  } catch (error) {
    console.error("========== ADMIN FABRICS GET ERROR ==========");
    console.error(error);

    return errorResponse(
      error?.message || "Failed to load fabrics",
      500
    );
  }
}
