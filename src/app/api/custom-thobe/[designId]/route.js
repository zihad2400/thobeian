import connectDB from "@/lib/mongodb";
import CustomThobeDesign from "@/models/CustomThobeDesign";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { designId } = await params;

    if (!designId) {
      return errorResponse("Design ID is required", 400);
    }

    const design = await CustomThobeDesign.findOne({
      designId,
    })
      .populate("user", "name email phone")
      .lean();

    if (!design) {
      return errorResponse("Design not found", 404);
    }

    return successResponse({ design });
  } catch (error) {
    console.error("Custom thobe GET error:", error);
    return errorResponse("Failed to load design", 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const { designId } = await params;

    if (!designId) {
      return errorResponse("Design ID is required", 400);
    }

    const design = await CustomThobeDesign.findOne({
      designId,
    });

    if (!design) {
      return errorResponse("Design not found", 404);
    }

    const isAdmin =
      user.role === "admin" ||
      user.role === "superadmin";

    if (!isAdmin) {
      const ownsDesign =
        design.user &&
        design.user.toString() === user._id.toString();

      if (!ownsDesign) {
        return errorResponse("You cannot delete this design", 403);
      }
    }

    await CustomThobeDesign.deleteOne({
      _id: design._id,
    });

    return successResponse(
      {
        deletedId: design._id,
        designId: design.designId,
      },
      "Design deleted successfully"
    );
  } catch (error) {
    console.error("Custom thobe DELETE error:", error);
    return errorResponse("Failed to delete design", 500);
  }
}
