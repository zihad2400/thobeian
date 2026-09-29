import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword } from "@/lib/auth";
import { signToken, COOKIE_NAME, cookieOptions } from "@/lib/jwt";
import { loginSchema, validate } from "@/lib/validation";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // Validate
    const { success, data, errors } = validate(loginSchema, body);
    if (!success) {
      return errorResponse("Validation failed", 422, errors);
    }

    // Find user (with passwordHash)
    const user = await User.findOne({ email: data.email.toLowerCase() }).select(
      "+passwordHash"
    );
    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    if (!user.isActive) {
      return errorResponse("Account is disabled", 403);
    }

    // Compare password
    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      return errorResponse("Invalid email or password", 401);
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Sign token
    const token = signToken({ userId: user._id.toString(), role: user.role });

    // Response
    const response = successResponse(
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      "Login successful"
    );

    response.cookies.set(COOKIE_NAME, token, cookieOptions);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Login failed", 500);
  }
}