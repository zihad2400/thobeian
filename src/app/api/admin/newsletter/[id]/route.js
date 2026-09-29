import connectDB from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const { id } = await params;
    await Newsletter.findByIdAndDelete(id);
    return successResponse(null, "Subscriber deleted");
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
