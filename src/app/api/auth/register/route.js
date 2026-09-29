import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { signToken, COOKIE_NAME, cookieOptions } from "@/lib/jwt";
import { registerSchema, validate } from "@/lib/validation";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    // Validate input
    const { success, data, errors } = validate(registerSchema, body);
    if (!success) {
      return errorResponse("Validation failed", 422, errors);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      return errorResponse("Email already registered", 409);
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || "",
      passwordHash,
      role: "customer",
    });

    // Sign JWT
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
      "Registration successful",
      201
    );

    // Set cookie
    response.cookies.set(COOKIE_NAME, token, cookieOptions);

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse(
      process.env.NODE_ENV === "production"
        ? "Registration failed"
        : error.message,
      500
    );
  }
}