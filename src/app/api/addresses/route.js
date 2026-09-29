import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const fullUser = await User.findById(user._id).select("addresses").lean();
    return successResponse({ addresses: fullUser?.addresses || [] });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const fullUser = await User.findById(user._id);

    if (body.isDefault) {
      fullUser.addresses.forEach((a) => (a.isDefault = false));
    }

    fullUser.addresses.push(body);
    await fullUser.save();

    return successResponse(
      { addresses: fullUser.addresses },
      "Address added",
      201
    );
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
