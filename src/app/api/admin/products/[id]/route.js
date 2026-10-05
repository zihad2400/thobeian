import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const { id } = await params;
    const product = await Product.findById(id).lean();
    if (!product) return errorResponse("Product not found", 404);

    return successResponse({ product });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const { id } = await params;
    const body = await req.json();

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse({ product }, "Product updated");
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return errorResponse("Admin access required", 403);
    }

    const { id } = await params;
    await Product.findByIdAndDelete(id);

    return successResponse(null, "Product deleted");
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
