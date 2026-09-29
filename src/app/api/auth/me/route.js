import { getCurrentUser } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    return successResponse({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
        measurementProfiles: user.measurementProfiles,
      },
    });
  } catch (error) {
    console.error("Me error:", error);
    return errorResponse("Something went wrong", 500);
  }
}