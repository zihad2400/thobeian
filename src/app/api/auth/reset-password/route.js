import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { hashPassword } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/apiResponse";

// ===== GET: Verify token =====
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return errorResponse("Token is required", 400);
    }

    const reset = await PasswordReset.findOne({ token });

    if (!reset) {
      return errorResponse("Invalid or expired reset link", 400);
    }

    if (reset.isUsed) {
      return errorResponse("This reset link has already been used", 400);
    }

    if (new Date() > reset.expiresAt) {
      return errorResponse("Reset link has expired", 400);
    }

    return successResponse({
      valid: true,
      email: reset.email,
    });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}

// ===== POST: Reset password =====
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return errorResponse("Token and password required", 400);
    }

    if (password.length < 6) {
      return errorResponse("Password must be at least 6 characters", 400);
    }

    // Find valid reset token
    const reset = await PasswordReset.findOne({ token });

    if (!reset) {
      return errorResponse("Invalid or expired reset link", 400);
    }

    if (reset.isUsed) {
      return errorResponse("This reset link has already been used", 400);
    }

    if (new Date() > reset.expiresAt) {
      return errorResponse("Reset link has expired", 400);
    }

    // Update user password
    const passwordHash = await hashPassword(password);
    await User.findByIdAndUpdate(reset.user, { passwordHash });

    // Mark token as used
    reset.isUsed = true;
    reset.usedAt = new Date();
    await reset.save();

    // Delete all other reset tokens for this user
    await PasswordReset.deleteMany({
      user: reset.user,
      _id: { $ne: reset._id },
    });

    return successResponse(
      null,
      "Password reset successfully! You can now login with your new password."
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return errorResponse(error.message, 500);
  }
}
