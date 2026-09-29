import { successResponse } from "@/lib/apiResponse";
import { COOKIE_NAME } from "@/lib/jwt";

export async function POST() {
  try {
    const response = successResponse(null, "Logged out successfully");

    response.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return successResponse(null, "Logged out");
  }
}
