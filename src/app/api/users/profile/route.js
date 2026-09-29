import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function PATCH(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const update = {};
    if (body.name) update.name = body.name;
    if (body.phone) update.phone = body.phone;

    await User.findByIdAndUpdate(user._id, update);

    return successResponse(null, "Profile updated");
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
