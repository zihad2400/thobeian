import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json();

    const fullUser = await User.findById(user._id);
    const address = fullUser.addresses.id(id);
    if (!address) return errorResponse("Address not found", 404);

    if (body.isDefault) {
      fullUser.addresses.forEach((a) => (a.isDefault = false));
    }

    Object.assign(address, body);
    await fullUser.save();

    return successResponse({ addresses: fullUser.addresses });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { id } = await params;
    const fullUser = await User.findById(user._id);

    fullUser.addresses = fullUser.addresses.filter(
      (a) => a._id.toString() !== id
    );
    await fullUser.save();

    return successResponse({ addresses: fullUser.addresses });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
