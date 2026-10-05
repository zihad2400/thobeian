import connectDB from "@/lib/mongodb";
import CustomThobeDesign from "@/models/CustomThobeDesign";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

async function requireAdmin() {
  const user = await getCurrentUser();

  if (
    !user ||
    (user.role !== "admin" && user.role !== "superadmin")
  ) {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    await connectDB();

    const user = await requireAdmin();

    if (!user) {
      return errorResponse("Admin access required", 403);
    }

    const designs = await CustomThobeDesign.find({})
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    return successResponse({ designs });
  } catch (error) {
    console.error("Admin custom orders GET error:", error);
    return errorResponse("Failed to load custom thobe designs", 500);
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    const user = await requireAdmin();

    if (!user) {
      return errorResponse("Admin access required", 403);
    }

    const body = await req.json().catch(() => ({}));

    const designId = body.designId;

    if (!designId) {
      return errorResponse("Design ID is required", 400);
    }

    const design = await CustomThobeDesign.findOne({ designId });

    if (!design) {
      return errorResponse("Custom thobe design not found", 404);
    }

    await CustomThobeDesign.deleteOne({
      _id: design._id,
    });

    return successResponse(
      {
        deletedId: design._id,
        designId: design.designId,
      },
      `Custom thobe ${design.designId} deleted successfully`
    );
  } catch (error) {
    console.error("Admin custom order DELETE error:", error);
    return errorResponse("Failed to delete custom thobe", 500);
  }
}
