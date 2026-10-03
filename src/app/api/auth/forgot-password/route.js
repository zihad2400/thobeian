import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import { sendPasswordResetEmail } from "@/lib/email";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return errorResponse("Email is required", 400);
    }

    // Always return success message (security — don't reveal if email exists)
    const SUCCESS_MESSAGE =
      "If an account exists with this email, you'll receive a password reset link shortly.";

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return success anyway (security best practice)
      return successResponse(null, SUCCESS_MESSAGE);
    }

    // Delete any existing reset tokens for this user
    await PasswordReset.deleteMany({ user: user._id });

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token
    await PasswordReset.create({
      user: user._id,
      email: user.email,
      token,
      expiresAt,
    });

    // Build reset URL
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Send email
    const emailResult = await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl,
    });

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error);
      return errorResponse(
        "Failed to send reset email. Please try again.",
        500
      );
    }

    return successResponse(null, SUCCESS_MESSAGE);
  } catch (error) {
    console.error("Forgot password error:", error);
    return errorResponse(error.message, 500);
  }
}
