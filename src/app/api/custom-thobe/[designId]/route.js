import connectDB from "@/lib/mongodb";
import CustomThobeDesign from "@/models/CustomThobeDesign";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { designId } = await params;
    const design = await CustomThobeDesign.findOne({ designId }).lean();
    if (!design) return errorResponse("Design not found", 404);
    return successResponse({ design });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { designId } = await params;
    await CustomThobeDesign.deleteOne({ designId, user: user._id });
    return successResponse(null, "Design deleted");
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
